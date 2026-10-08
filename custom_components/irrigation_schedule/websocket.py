"""Authenticated dashboard API; schedules use native HA Schedule CRUD."""
import probatio
from homeassistant.components import websocket_api
from homeassistant.core import callback

from .const import DOMAIN
from .model import IrrigationError, merged_catalog
from .localization import error_text


def controller_for(hass, entry_id):
    controllers = hass.data.get(DOMAIN, {})
    if entry_id:
        controller = controllers.get(entry_id)
    else:
        controller = next(iter(controllers.values()), None) if len(controllers) == 1 else None
    if not controller or not controller.ready:
        raise IrrigationError('error_not_ready')
    return controller


@websocket_api.websocket_command({probatio.Required('type'): 'irrigation_schedule/config', probatio.Optional('entry_id'): str, probatio.Optional('language'): str})
@callback
def websocket_config(hass, connection, msg):
    try:
        controller = controller_for(hass, msg.get('entry_id'))
        connection.send_result(msg['id'], {'entry_id': controller.entry.entry_id, 'valves': controller.valves, 'retired': controller.retired, 'master_entity': controller.master_entity, 'status_entity': controller.status_entity})
    except ValueError as err:
        connection.send_error(msg['id'], 'not_ready', error_text(hass, err, msg.get('language')))


@websocket_api.websocket_command({probatio.Required('type'): 'irrigation_schedule/configure_valves', probatio.Optional('entry_id'): str, probatio.Optional('language'): str, probatio.Required('valves'): list})
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_configure(hass, connection, msg):
    try:
        controller = controller_for(hass, msg.get('entry_id'))
        entry = controller.entry
        if any(isinstance(v, dict) and v.get('entity') == controller.master_entity for v in msg['valves']):
            raise IrrigationError('error_automation_valve')
        options = merged_catalog(msg['valves'], entry.options or entry.data)
        hass.config_entries.async_update_entry(entry, options=options)
        controller.async_update_catalog()
        connection.send_result(msg['id'], options)
    except ValueError as err:
        connection.send_error(msg['id'], 'invalid_valves', error_text(hass, err, msg.get('language')))


@websocket_api.websocket_command({probatio.Required('type'): 'irrigation_schedule/manual', probatio.Optional('entry_id'): str, probatio.Optional('language'): str, probatio.Optional('entity'): str, probatio.Required('enabled'): bool})
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_manual(hass, connection, msg):
    try:
        controller = controller_for(hass, msg.get('entry_id'))
        if msg.get('enabled') and 'entity' not in msg:
            raise IrrigationError('error_open_one')
        await controller.async_manual(msg.get('entity'), msg['enabled'])
        connection.send_result(msg['id'])
    except (ValueError, TimeoutError) as err:
        connection.send_error(msg['id'], 'manual_failed', error_text(hass, err, msg.get('language')))


@callback
def async_register_api(hass):
    for command in [websocket_config, websocket_configure, websocket_manual]:
        websocket_api.async_register_command(hass, command)
