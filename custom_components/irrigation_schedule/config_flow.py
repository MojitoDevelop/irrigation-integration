"""Add irrigation from Devices & Services, then edit valve names in options."""
from __future__ import annotations

import json

import probatio
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import DOMAIN
from .model import merged_catalog, normalize_valves


def suggested_valves(hass):
    """Start every new installation with an empty valve selection."""
    return []



def valve_schema(valves):
    return probatio.Schema({probatio.Required('entities', default=[v['entity'] for v in valves]): selector.EntitySelector(selector.EntitySelectorConfig(domain='switch', multiple=True))})


def name_schema(valves):
    return probatio.Schema({probatio.Required(v['entity'], default=v['name']): selector.TextSelector() for v in valves})


def selected_valves(hass, selected, old):
    masters = {getattr(getattr(e, 'runtime_data', None), 'master_entity', None) for e in hass.config_entries.async_entries(DOMAIN)}
    if any(id_ in masters for id_ in selected):
        raise ValueError('The automation switch cannot be a valve.')
    names = {v['entity']: v['name'] for v in old}
    return normalize_valves([{'entity': id_, 'name': names.get(id_) or (hass.states.get(id_).name if hass.states.get(id_) else id_)} for id_ in selected])


class IrrigationConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1
    MINOR_VERSION = 1

    async def async_step_user(self, user_input=None):
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        valves = suggested_valves(self.hass)
        errors = {}
        if user_input is not None:
            try:
                self._valves = selected_valves(self.hass, user_input['entities'], valves)
                return await self.async_step_names()
            except (ValueError, KeyError):
                errors['base'] = 'invalid_valves'
        return self.async_show_form(step_id='user', data_schema=valve_schema(valves), errors=errors)

    async def async_step_names(self, user_input=None):
        errors = {}
        if user_input is not None:
            try:
                valves = normalize_valves([{'entity': v['entity'], 'name': user_input[v['entity']]} for v in self._valves])
                previous = {'valves': suggested_valves(self.hass), 'retired': []}
                for state in self.hass.states.async_all('schedule'):
                    try:
                        raw = json.loads(state.attributes.get('irrigation_catalog', ''))
                        if not isinstance(raw, dict):
                            continue
                        old_retired = normalize_valves(raw['retired']) if raw.get('retired') else []
                        previous['retired'] = old_retired
                        break
                    except (ValueError, TypeError, KeyError):
                        continue
                return self.async_create_entry(title='Irrigation', data=merged_catalog(valves, previous))
            except (ValueError, KeyError):
                errors['base'] = 'invalid_names'
        return self.async_show_form(step_id='names', data_schema=name_schema(self._valves), errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return IrrigationOptionsFlow()


class IrrigationOptionsFlow(config_entries.OptionsFlow):
    async def async_step_init(self, user_input=None):
        self._previous = self.config_entry.options or self.config_entry.data
        errors = {}
        if user_input is not None:
            try:
                self._valves = selected_valves(self.hass, user_input['entities'], self._previous['valves'])
                return await self.async_step_names()
            except (ValueError, KeyError):
                errors['base'] = 'invalid_valves'
        return self.async_show_form(step_id='init', data_schema=valve_schema(self._previous['valves']), errors=errors)

    async def async_step_names(self, user_input=None):
        errors = {}
        if user_input is not None:
            try:
                valves = [{'entity': v['entity'], 'name': user_input[v['entity']]} for v in self._valves]
                return self.async_create_entry(title='', data=merged_catalog(valves, self._previous))
            except (ValueError, KeyError):
                errors['base'] = 'invalid_names'
        return self.async_show_form(step_id='names', data_schema=name_schema(self._valves), errors=errors)
