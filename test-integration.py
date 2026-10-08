"""Test the installed custom integration against a real HA 2026.10 runtime."""
import asyncio
import copy
import json
import logging
from pathlib import Path
import shutil
import socket
import tempfile
from types import SimpleNamespace

import aiohttp
from homeassistant.bootstrap import async_from_config_dict
from homeassistant.core import HomeAssistant
from homeassistant.components.switch import SwitchEntity
from homeassistant import loader
from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL

ROOT = Path(__file__).resolve().parent
DOMAIN = 'irrigation_schedule'
VALVES = [{'entity': f'switch.garden_{n}', 'name': name} for n, name in enumerate(['Trawnik', 'Rabaty', 'Drzewa'], 1)]


def schedule_attrs(ids, title='Rano'):
    return {'friendly_name': 'Nawodnienie ' + title, 'irrigation_managed': 'adk45-ha-v2', 'irrigation_valves': json.dumps(ids), 'irrigation_entry': json.dumps({'version': 2, 'id': title, 'title': title, 'days': ['monday'], 'from': '12:00', 'to': '13:00', 'zones': ids})}


async def main():
    with tempfile.TemporaryDirectory(prefix='irrigation-integration-') as tmp:
        shutil.copytree(ROOT / 'custom_components', Path(tmp) / 'custom_components')
        with socket.socket() as s:
            s.bind(('127.0.0.1', 0))
            port = s.getsockname()[1]
        config = {'homeassistant': {'latitude': 52, 'longitude': 21, 'elevation': 100, 'time_zone': 'Europe/Warsaw', 'unit_system': 'metric', 'country': 'PL'}, 'http': {'server_host': '127.0.0.1', 'server_port': port}, 'frontend': {}, 'schedule': {}}
        hass = HomeAssistant(tmp)
        hass.config.skip_pip = True
        loader.async_setup(hass)
        assert await async_from_config_dict(config, hass)
        calls, failures = [], set()
        gate = None

        class Valve(SwitchEntity):
            _attr_should_poll = False
            def __init__(self, v):
                self.entity_id = v['entity']
                self._attr_name = v['name']
                self._attr_is_on = False
            async def _set(self, enabled):
                nonlocal gate
                calls.append(('turn_on' if enabled else 'turn_off', self.entity_id))
                if gate:
                    hold, gate = gate, None
                    await hold.wait()
                if self.entity_id not in failures:
                    self._attr_is_on = enabled
                    self.async_write_ha_state()
            async def async_turn_on(self, **kwargs):
                await self._set(True)
            async def async_turn_off(self, **kwargs):
                await self._set(False)

        for v in VALVES:
            hass.states.async_set(v['entity'], 'off', {'friendly_name': v['name']})
        hass.states.async_set('schedule.nawodnienie_konfiguracja_zaworow', 'on', {'irrigation_catalog': json.dumps({'version': 1, 'valves': VALVES[:2], 'retired': VALVES[2:]})})
        for number in range(1, 13):
            hass.states.async_set(f'switch.nawodnienie_strefa_{number}', 'off')
        result = await hass.config_entries.flow.async_init(DOMAIN, context={'source': 'user'})
        assert result['type'] == 'form' and result['step_id'] == 'user', result
        field = next(key for key in result['data_schema'].schema if key.schema == 'entities')
        assert field.default() == [], 'new installations must not select existing valves'
        print('PASS new config flow starts empty even with 12 original switches and a legacy catalog')
        result = await hass.config_entries.flow.async_configure(result['flow_id'], {'entities': [v['entity'] for v in VALVES]})
        assert result['step_id'] == 'names', result
        result = await hass.config_entries.flow.async_configure(result['flow_id'], {v['entity']: v['name'] for v in VALVES})
        assert result['type'] == 'create_entry', result
        entry = result['result']
        await hass.async_block_till_done()
        for v in VALVES:
            hass.states.async_remove(v['entity'])
        await hass.data['switch'].async_add_entities([Valve(v) for v in VALVES])
        await hass.async_start()

        async def until(predicate, timeout=10):
            async with asyncio.timeout(timeout):
                while not predicate():
                    await asyncio.sleep(.05)
            await hass.async_block_till_done()

        def state(id_):
            s = hass.states.get(id_)
            return s.state if s else None

        class Connection:
            def __init__(self, admin=True):
                self.user = SimpleNamespace(is_admin=admin)
                self.done = asyncio.get_running_loop().create_future()
            def send_result(self, id_, result=None):
                self.done.set_result(result)
            def send_error(self, id_, code, message):
                self.done.set_exception(ValueError((code, message)))
            def async_handle_exception(self, msg, error):
                self.done.set_exception(error)

        async def ws(payload, admin=True):
            connection = Connection(admin)
            handler, schema = hass.data['websocket_api'][payload['type']]
            handler(hass, connection, schema({'id': 1, **payload}))
            return await asyncio.wait_for(connection.done, 6)

        try:
            controller = entry.runtime_data
            await until(lambda: controller.mode == 'manual')
            master, status = controller.master_entity, controller.status_entity
            assert master == 'switch.irrigation_automation', master
            assert status == 'sensor.irrigation_status', status
            assert state(status) == 'Manual mode · valves closed'
            assert not hass.states.get('input_boolean.nawodnienie_automatyka')
            settings = await ws({'type': DOMAIN + '/config'})
            assert settings['valves'] == VALVES and settings['entry_id'] == entry.entry_id
            duplicate = await hass.config_entries.flow.async_init(DOMAIN, context={'source': 'user'})
            assert duplicate['type'] == 'abort' and duplicate['reason'] == 'already_configured'
            print('PASS actual installation, config flow/name step, single instance, entities and authenticated config API')

            assert '/irrigation_schedule/irrigation-schedule-card.js?v=0.2.0' in hass.data[DATA_EXTRA_MODULE_URL].urls
            async with aiohttp.ClientSession() as session:
                async with session.get(f'http://127.0.0.1:{port}/irrigation_schedule/irrigation-schedule-card.js') as response:
                    assert response.status == 200
                    js = await response.text()
                    assert 'irrigation-schedule-integration-card' in js and 'INTEGRATION_CARD_VERSION = "0.2.0"' in js
            print('PASS bundled JS is registered automatically and served through real HA HTTP')

            class SubscriptionConnection:
                def __init__(self):
                    self.user = SimpleNamespace(is_admin=True)
                    self.subscriptions = {}
                    self.messages = []
                def send_message(self, message):
                    self.messages.append(message)
            subscription = SubscriptionConnection()
            handler, schema = hass.data['websocket_api']['schedule/subscribe']
            handler(hass, subscription, schema({'id': 20, 'type': 'schedule/subscribe'}))
            assert subscription.messages[0]['success'] is True
            assert subscription.messages[1]['type'] == 'event'

            from homeassistant.helpers.translation import async_get_translations
            for language, expected in [('en', 'Irrigation valves'), ('pl', 'Zawory nawodnienia'), ('de', 'Bewässerungsventile')]:
                translations = await async_get_translations(hass, language, 'config', {DOMAIN})
                assert translations['component.irrigation_schedule.config.step.user.title'] == expected
            for language, expected in [('en', 'Manual mode · valves closed'), ('pl', 'Tryb ręczny · zawory zamknięte'), ('de', 'Manueller Modus · Ventile geschlossen'), ('fr', 'Manual mode · valves closed')]:
                hass.config.language = language
                assert controller.snapshot()[0] == expected
                assert controller.snapshot()[1]['status_code'] == 'status_manual_closed'
                assert state(master) == 'off'
            hass.config.language = 'en'
            controller.publish()
            for language, expected in [('en', 'Select one valve to open.'), ('pl', 'Otwarcie wymaga wskazania jednego zaworu.'), ('de', 'Ein Ventil zum Öffnen auswählen.')]:
                try:
                    await ws({'type': DOMAIN + '/manual', 'enabled': True, 'language': language})
                    raise AssertionError('opening all valves must be rejected')
                except ValueError as error:
                    assert error.args[0][1] == expected, error
            print('PASS native en/pl/de flow translations, localized server text and client API errors, fallback English, stable English entity IDs')

            fixtures = json.loads((ROOT / 'test-fixtures.json').read_text())
            helper = await ws(fixtures['create'])
            helper_id = 'schedule.' + helper['id']
            assert state(helper_id) == 'on'
            assert 'Test API' in controller.plan().names
            await ws({**fixtures['update'], 'schedule_id': helper['id']})
            saved = next(s for s in await ws({'type': 'schedule/list'}) if s['id'] == helper['id'])
            assert saved['tuesday'][0]['from'] == '23:30:00' and saved['wednesday'][0]['to'] == '01:15:00'
            await ws({'type': 'schedule/delete', 'schedule_id': helper['id']})
            assert state(helper_id) is None
            assert not controller.plan().errors
            print('PASS migration catalog suggestion and actual Schedule CRUD using exact card payloads')
            await hass.async_block_till_done()
            changes = [change for message in subscription.messages if message['type'] == 'event' for change in message['event'] if change['schedule_id'] == helper['id']]
            assert [change['change_type'] for change in changes] == ['added', 'updated', 'removed'], changes
            assert changes[0]['item']['name'] == fixtures['create']['name']
            assert changes[1]['item']['tuesday'][0]['from'] == '23:30:00'
            subscription.subscriptions[20]()
            print('PASS native Schedule push subscription emits exact added/updated/removed payloads and unsubscribes')


            await ws({'type': DOMAIN + '/manual', 'entity': 'switch.garden_3', 'enabled': True})
            assert state('switch.garden_3') == 'on'
            await asyncio.sleep(.1)
            assert state('switch.garden_3') == 'on'
            print('PASS guarded manual API and manual changes persist without dashboard')

            renamed = [{**v, 'name': 'Trawnik północny' if v['entity'] == 'switch.garden_1' else v['name']} for v in reversed(VALVES)]
            before = len(calls)
            await ws({'type': DOMAIN + '/configure_valves', 'valves': renamed})
            await hass.async_block_till_done()
            assert controller.valves == renamed and state('switch.garden_3') == 'on' and len(calls) == before
            await ws({'type': DOMAIN + '/configure_valves', 'valves': VALVES})
            try:
                await ws({'type': DOMAIN + '/configure_valves', 'valves': VALVES}, admin=False)
                assert False, 'non-admin write allowed'
            except Exception as error:
                assert type(error).__name__ == 'Unauthorized', type(error)
            print('PASS renaming/reorder leaves manual states; non-admin configuration rejected')

            hass.states.async_set('schedule.nawodnienie_a', 'on', schedule_attrs(['switch.garden_1', 'switch.garden_2'], 'Trawnik rano'))
            hass.states.async_set('schedule.nawodnienie_b', 'on', schedule_attrs(['switch.garden_2'], 'Rabaty'))
            # Invoke the actual integration switch, without the fake actuator service handler.
            switch = hass.data['switch'].get_entity(master)
            await switch.async_turn_on()
            await until(lambda: state('switch.garden_1') == state('switch.garden_2') == 'on' and state('switch.garden_3') == 'off')
            assert calls[-3:] == [('turn_off', 'switch.garden_3'), ('turn_on', 'switch.garden_1'), ('turn_on', 'switch.garden_2')], calls
            assert 'Trawnik rano' in state(status) and 'Rabaty' in state(status)
            try:
                await ws({'type': DOMAIN + '/manual', 'entity': 'switch.garden_3', 'enabled': True})
                assert False, 'manual during automation allowed'
            except ValueError:
                pass
            print('PASS actual automation switch, union overlaps, closes before opens, manual API blocked while automatic')

            hass.states.async_set('schedule.nawodnienie_a', 'off')
            await until(lambda: state('switch.garden_1') == 'off')
            assert state('switch.garden_2') == 'on'
            hass.states.async_set('schedule.nawodnienie_b', 'on', schedule_attrs(['switch.garden_3'], 'Zmiana całego wpisu'))
            await until(lambda: state('switch.garden_2') == 'off' and state('switch.garden_3') == 'on')
            hass.states.async_remove('schedule.nawodnienie_b')
            await until(lambda: state('switch.garden_3') == 'off')
            print('PASS shared valve survives one end, active metadata edits and dynamic helper deletion')

            gate = asyncio.Event()
            hold = gate
            hass.states.async_set('schedule.nawodnienie_c', 'on', schedule_attrs(['switch.garden_1', 'switch.garden_2'], 'Przerwanie'))
            await asyncio.sleep(.2)
            await switch.async_turn_off()
            hold.set()
            await until(lambda: controller.mode == 'manual' and all(state(v['entity']) == 'off' for v in VALVES))
            assert calls[-2:] == [('turn_on', 'switch.garden_1'), ('turn_off', 'switch.garden_1')]
            print('PASS master off while action is pending prevents remaining opens')

            failures.add('switch.garden_1')
            await switch.async_turn_on()
            await until(lambda: 'not confirmed' in state(status))
            failures.clear()
            await until(lambda: state('switch.garden_1') == 'on' and not hass.states.get(status).attributes['errors'], timeout=15)
            print('PASS confirmation timeout diagnostic and retry after recovery')

            await switch.async_turn_off()
            await until(lambda: controller.mode == 'manual')
            failures.add('switch.garden_1')
            await switch.async_turn_on()
            await until(lambda: 'not confirmed' in state(status))
            await switch.async_turn_off()
            await until(lambda: controller.mode == 'manual')
            assert not hass.states.get(status).attributes['errors']
            failures.clear()
            print('PASS disabling after a failed open supersedes the old command and releases manual mode')

            hass.states.async_set('switch.garden_2', 'unavailable')
            await switch.async_turn_on()
            await until(lambda: state('switch.garden_1') == 'on')
            await switch.async_turn_off()
            await until(lambda: state('switch.garden_1') == 'off')
            assert controller.mode == 'stopping' and controller.plan().unavailable == ('switch.garden_2',)
            hass.states.async_set('switch.garden_2', 'off')
            await until(lambda: controller.mode == 'manual')
            print('PASS unavailable valve prevents manual release until confirmed closed')

            await switch.async_turn_off()
            await until(lambda: controller.mode == 'manual')
            hass.states.async_set('switch.garden_3', 'on')
            # Options flow is native and persists the retirement of removed valves.
            result = await hass.config_entries.options.async_init(entry.entry_id)
            assert result['step_id'] == 'init'
            result = await hass.config_entries.options.async_configure(result['flow_id'], {'entities': [v['entity'] for v in VALVES[:2]]})
            result = await hass.config_entries.options.async_configure(result['flow_id'], {v['entity']: v['name'] for v in VALVES[:2]})
            assert result['type'] == 'create_entry'
            await until(lambda: controller.mode == 'manual' and state('switch.garden_3') == 'off')
            assert controller.valves == VALVES[:2] and controller.retired == VALVES[2:]
            print('PASS native options flow, removed valve closure and persistent retired list')

            await switch.async_turn_on()
            await until(lambda: state('switch.garden_1') == 'on')
            from homeassistant.helpers import entity_registry as er
            registry = er.async_get(hass)
            registry.async_update_entity(master, new_entity_id='switch.nawodnienie_automatyka')
            registry.async_update_entity(status, new_entity_id='sensor.nawodnienie_integracja_status')
            await hass.async_block_till_done()
            master, status = 'switch.nawodnienie_automatyka', 'sensor.nawodnienie_integracja_status'
            await hass.async_stop()
            # Real restart re-loads the custom component and native ConfigEntry storage.
            hass = HomeAssistant(tmp)
            hass.config.skip_pip = True
            loader.async_setup(hass)
            assert await async_from_config_dict(config, hass)
            await hass.data['switch'].async_add_entities([Valve(v) for v in VALVES])
            hass.states.async_set('schedule.nawodnienie_restarted', 'on', schedule_attrs(['switch.garden_2'], 'Po restarcie'))
            await hass.async_start()
            entry = hass.config_entries.async_entries(DOMAIN)[0]
            controller = entry.runtime_data
            await until(lambda: controller.enabled and state('switch.garden_2') == 'on')
            assert controller.valves == VALVES[:2] and controller.retired == VALVES[2:]
            assert controller.master_entity == master and controller.status_entity == status
            print('PASS full restart restores switch state, catalog, options and legacy registered entity IDs without duplicates')

            assert await hass.config_entries.async_unload(entry.entry_id)
            await hass.async_block_till_done()
            assert state(master) in (None, 'unavailable') and state(status) in (None, 'unavailable'), (state(master), state(status))
            assert all(state(v['entity']) == 'off' for v in VALVES)
            assert not controller._listeners and not controller._unsubs and controller._task is None
            print('PASS unload removes platforms, timers, event listeners and running tasks')
        finally:
            await hass.async_stop()

if __name__ == '__main__':
    logging.basicConfig(level=logging.WARNING)
    asyncio.run(main())
