"""Live textual irrigation status and structured controller attributes."""
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.entity import DeviceInfo

from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([IrrigationStatus(entry.runtime_data)])


class IrrigationStatus(SensorEntity):
    _attr_name = 'Irrigation status'
    _attr_icon = 'mdi:sprinkler-variant'
    _attr_should_poll = False

    def __init__(self, controller):
        self.controller = controller
        self._attr_unique_id = f'{controller.entry.entry_id}_status'
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, controller.entry.entry_id)}, name='Irrigation', manufacturer='MojitoDevelop', model='Schedule controller')

    @property
    def native_value(self):
        return self.controller.snapshot()[0]

    @property
    def extra_state_attributes(self):
        return self.controller.snapshot()[1]

    async def async_added_to_hass(self):
        await super().async_added_to_hass()
        self.controller.status_entity = self.entity_id
        self.async_on_remove(self.controller.subscribe(self.async_write_ha_state))
