"""Server-side, event-driven irrigation controller with confirmed valve actions."""
from __future__ import annotations

import asyncio
from datetime import timedelta
import logging
from time import monotonic
from typing import Callable

from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, EVENT_HOMEASSISTANT_STOP, EVENT_STATE_CHANGED
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_interval

from .model import IrrigationError, make_plan
from .localization import translate

_LOGGER = logging.getLogger(__name__)


class IrrigationController:
    def __init__(self, hass: HomeAssistant, entry):
        self.hass = hass
        self.entry = entry
        catalog = entry.options or entry.data
        self.valves = catalog['valves']
        self.retired = catalog.get('retired', [])
        self.enabled = False
        self.mode = 'stopping'
        self.ready = False
        self.master_entity = None
        self.status_entity = None
        self._listeners: set[Callable[[], None]] = set()
        self._unsubs = []
        self._start_unsub = None
        self._stop_unsub = None
        self._task: asyncio.Task | None = None
        self._changed = asyncio.Event()
        self._failure = None
        self._retry_at = 0.0
        self._stopped = False
        self._pending = None
        self._restored = False

    @property
    def controlled(self):
        return {v['entity'] for v in self.valves + self.retired}

    def plan(self):
        return make_plan({s.entity_id: s for s in self.hass.states.async_all()}, self.valves, self.retired, self.enabled)

    @callback
    def subscribe(self, listener):
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)

    @callback
    def publish(self):
        for listener in tuple(self._listeners):
            listener()

    def snapshot(self):
        plan = self.plan()
        details = list(plan.error_details)
        errors = [translate(self.hass, issue['code'], issue['params']) for issue in details]
        if self._failure:
            details.append({'code': self._failure['code'], 'params': {'name': self._failure['name']}})
            errors.append(translate(self.hass, self._failure['code'], {'name': self._failure['name']}))
        names = {v['entity']: v['name'] for v in self.valves + self.retired}
        opened = ', '.join(names[id_] for id_ in plan.opened)
        params = {'schedules': ', '.join(plan.names), 'valves': opened}
        if errors:
            code = 'status_error'
            params['errors'] = ' · '.join(errors)
        elif not self.ready:
            code = 'status_starting'
        elif self.mode == 'manual':
            code = 'status_manual_open' if plan.opened else 'status_manual_closed'
        elif self.mode == 'stopping':
            code = 'status_stopping'
        elif self._pending or set(plan.opened) != set(plan.requested):
            code = 'status_setting'
        elif plan.requested:
            code = 'status_watering'
        else:
            code = 'status_waiting'
        text = translate(self.hass, code, params)
        return text[:255], {
            'status_code': code,
            'status_params': params,
            'error_details': details,
            'mode': self.mode,
            'enabled': self.enabled,
            'active_schedules': list(plan.names),
            'active_schedule_entities': list(plan.active_ids),
            'requested_valves': list(plan.requested),
            'open_valves': list(plan.opened),
            'controlled_valves': sorted(self.controlled),
            'configured_valves': self.valves,
            'retired_valves': self.retired,
            'errors': errors,
            'entry_id': self.entry.entry_id,
            'master_entity': self.master_entity,
        }

    @callback
    def async_start(self):
        self._unsubs.append(self.hass.bus.async_listen(EVENT_STATE_CHANGED, self._state_changed))
        self._stop_unsub = self.hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, self._shutdown)
        self._unsubs.append(async_track_time_interval(self.hass, self._tick, timedelta(seconds=5)))
        if self.hass.is_running:
            self._started(None)
        else:
            self._start_unsub = self.hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, self._started)

    @callback
    def _started(self, _event):
        self._start_unsub = None
        self.ready = True
        self.request()

    @callback
    def _tick(self, _now):
        self.request()

    async def _shutdown(self, _event):
        self._stop_unsub = None
        await self.async_stop()

    @callback
    def _state_changed(self, event):
        entity_id = event.data['entity_id']
        if entity_id.startswith(('schedule.irrigation_', 'schedule.nawodnienie_')) or entity_id in self.controlled:
            self._changed.set()
            self.publish()
            self.request()

    @callback
    def request(self):
        if self._stopped or not self.ready:
            return
        self._changed.set()
        if self._task is None or self._task.done():
            self._task = self.hass.async_create_background_task(self._reconcile(), 'irrigation_schedule reconcile', eager_start=False)

    @callback
    def restore_enabled(self, enabled):
        if self._restored:
            self.publish()
            return
        self._restored = True
        self.enabled = enabled
        self.mode = 'automatic' if enabled else 'stopping'
        self.publish()
        self.request()

    async def async_set_enabled(self, enabled):
        if enabled != self.enabled:
            self.enabled = enabled
            self.mode = 'automatic' if enabled else 'stopping'
            self._retry_at = 0.0
        self.publish()
        self.request()

    @callback
    def async_update_catalog(self):
        catalog = self.entry.options or self.entry.data
        old = {v['entity'] for v in self.valves}
        self.valves, self.retired = catalog['valves'], catalog.get('retired', [])
        if not self.enabled and old != {v['entity'] for v in self.valves}:
            self.mode = 'stopping'
        self.publish()
        self.request()

    async def _wait_state(self, entity_id, expected):
        async with asyncio.timeout(5):
            while not self.hass.states.is_state(entity_id, expected):
                self._changed.clear()
                # Recheck after clearing the event to avoid losing a state update.
                if self.hass.states.is_state(entity_id, expected):
                    return
                await self._changed.wait()

    async def _command(self, entity_id, expected):
        self._pending = (entity_id, expected)
        self.publish()
        try:
            async with asyncio.timeout(10):
                await self.hass.services.async_call('switch', 'turn_on' if expected == 'on' else 'turn_off', {'entity_id': entity_id}, blocking=True)
            await self._wait_state(entity_id, expected)
        except asyncio.CancelledError:
            raise
        except Exception as err:
            label = next(v['name'] for v in self.valves + self.retired if v['entity'] == entity_id)
            code = 'issue_open' if expected == 'on' else 'issue_close'
            message = translate(self.hass, code, {'name': label})
            self._failure = {'entity': entity_id, 'state': expected, 'code': code, 'name': label}
            self._retry_at = monotonic() + 5
            _LOGGER.warning('%s (%s)', message, type(err).__name__)
            return False
        finally:
            self._pending = None
            self.publish()
        self._failure = None
        self._retry_at = 0.0
        return True

    async def _reconcile(self):
        try:
            for _ in range(max(8, len(self.controlled) * 2 + 4)):
                self._changed.clear()
                plan = self.plan()
                if self.enabled:
                    self.mode = 'automatic'
                elif self.mode == 'manual' and any(not self.hass.states.is_state(v['entity'], 'off') for v in self.retired):
                    self.mode = 'stopping'
                # A recovered state removes a diagnostic without another service call.
                if self._failure and self.hass.states.is_state(self._failure['entity'], self._failure['state']):
                    self._failure = None
                    self._retry_at = 0.0
                if self.mode == 'manual' and not self.enabled:
                    self.publish()
                    return
                desired = set(plan.requested) if self.enabled else set()
                close = [id_ for id_ in plan.opened if id_ not in desired]
                open_ = [id_ for id_ in plan.requested if self.hass.states.is_state(id_, 'off')]
                if self._failure:
                    id_ = self._failure['entity']
                    current_target = 'on' if id_ in desired else 'off'
                    if current_target != self._failure['state']:
                        # Supersede a failed old command, even if the state already
                        # appears correct, before granting manual control.
                        self._retry_at = 0.0
                        if current_target == 'off' and id_ not in close:
                            close.insert(0, id_)
                        elif current_target == 'on' and id_ not in open_:
                            open_.insert(0, id_)
                if self._retry_at > monotonic():
                    self.publish()
                    return
                if not close and not open_:
                    if not self.enabled and not plan.unavailable and not self._failure:
                        self.mode = 'manual'
                    self.publish()
                    return
                entity_id, target = (close[0], 'off') if close else (open_[0], 'on')
                if not await self._command(entity_id, target):
                    self.publish()
                    return
                # The next iteration always uses current schedules, catalog and master.
                self.publish()
        except asyncio.CancelledError:
            raise
        except Exception:
            _LOGGER.exception('Irrigation controller error')
        finally:
            self._task = None

    async def async_manual(self, entity_id, enabled):
        if self.enabled or self.mode != 'manual' or not self.ready:
            raise IrrigationError('error_manual_mode')
        ids = [v['entity'] for v in self.valves] if entity_id is None else [entity_id]
        if any(id_ not in {v['entity'] for v in self.valves} for id_ in ids):
            raise IrrigationError('error_unknown_valve')
        async with asyncio.timeout(10):
            await self.hass.services.async_call('switch', 'turn_on' if enabled else 'turn_off', {'entity_id': ids}, blocking=True)
        self.publish()

    async def async_stop(self):
        if self._stopped:
            return
        self._stopped = True
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        if self._start_unsub:
            self._start_unsub()
            self._start_unsub = None
        if self._stop_unsub:
            self._stop_unsub()
            self._stop_unsub = None
        if self._task:
            self._task.cancel()
            await asyncio.gather(self._task, return_exceptions=True)
        self._task = None
        if self.enabled or self.mode == 'stopping':
            try:
                async with asyncio.timeout(10):
                    await self.hass.services.async_call('switch', 'turn_off', {'entity_id': sorted(self.controlled)}, blocking=True)
            except Exception as err:
                _LOGGER.warning('Could not close valves while stopping the controller: %s', type(err).__name__)
        self.ready = False
        self._listeners.clear()
