"""Irrigation integration with config flow, persistent catalog and bundled card."""
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.helpers import config_validation as cv

from .const import CARD_URL, DOMAIN, PLATFORMS
from .controller import IrrigationController
from .localization import LOCALES_KEY, load_locales
from .websocket import async_register_api

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass, config):
    hass.data.setdefault(DOMAIN, {})
    hass.data[LOCALES_KEY] = await hass.async_add_executor_job(load_locales)
    async_register_api(hass)
    await hass.http.async_register_static_paths([StaticPathConfig('/irrigation_schedule/irrigation-schedule-card.js', str(Path(__file__).parent / 'frontend' / 'irrigation-schedule-card.js'), False)])
    frontend.add_extra_js_url(hass, CARD_URL)
    return True


async def async_setup_entry(hass, entry):
    controller = IrrigationController(hass, entry)
    entry.runtime_data = controller
    hass.data[DOMAIN][entry.entry_id] = controller
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(async_update_options))
    controller.async_start()
    return True


async def async_update_options(hass, entry):
    entry.runtime_data.async_update_catalog()


async def async_unload_entry(hass, entry):
    controller = entry.runtime_data
    if await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        await controller.async_stop()
        hass.data[DOMAIN].pop(entry.entry_id, None)
        return True
    return False
