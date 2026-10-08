"""Persistent automation switch owned by the integration."""
from homeassistant.components.switch import SwitchEntity
from homeassistant.const import STATE_ON
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.restore_state import RestoreEntity

from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([AutomationSwitch(entry.runtime_data)])


class AutomationSwitch(SwitchEntity, RestoreEntity):
    _attr_name = 'Irrigation automation'
    _attr_icon = 'mdi:sprinkler-variant'
    _attr_should_poll = False

    def __init__(self, controller):
        self.controller = controller
        self._attr_unique_id = f'{controller.entry.entry_id}_automation'
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, controller.entry.entry_id)}, name='Irrigation', manufacturer='MojitoDevelop', model='Schedule controller')

    @property
    def is_on(self):
        return self.controller.enabled

    async def async_added_to_hass(self):
        await super().async_added_to_hass()
        self.controller.master_entity = self.entity_id
        last = await self.async_get_last_state()
        self.controller.restore_enabled(bool(last and last.state == STATE_ON))
        self.async_on_remove(self.controller.subscribe(self.async_write_ha_state))

    async def async_turn_on(self, **kwargs):
        await self.controller.async_set_enabled(True)

    async def async_turn_off(self, **kwargs):
        await self.controller.async_set_enabled(False)
