"""Register the bundled card and migrate its Lovelace resource."""
from pathlib import Path
from urllib.parse import urlsplit

from aiohttp import web
from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import LOVELACE_DATA
from homeassistant.components.lovelace.resources import ResourceStorageCollection
from homeassistant.helpers.http import HomeAssistantView

from .const import CARD_BUNDLE_URL, CARD_URL

CARD_PATH = '/irrigation_schedule/irrigation-schedule-card.js'


class IrrigationCardLoaderView(HomeAssistantView):
    """Keep the bootstrap fresh even when a manual resource uses an older query."""

    url = CARD_PATH
    name = 'irrigation_schedule:card_loader'
    requires_auth = False

    def __init__(self, source):
        self.source = source

    async def get(self, request):
        return web.Response(text=self.source, content_type='text/javascript',
                            headers={'Cache-Control': 'no-store'})


async def async_register_card(hass):
    directory = Path(__file__).parent / 'frontend'
    source = await hass.async_add_executor_job((directory / 'irrigation-schedule-loader.js').read_text, 'utf-8')
    await hass.http.async_register_static_paths([
        StaticPathConfig(CARD_BUNDLE_URL, str(directory / 'irrigation-schedule-card.js'), True)
    ])
    hass.http.register_view(IrrigationCardLoaderView(source))
    # Also covers YAML resources and a dashboard already open while HA starts.
    frontend.add_extra_js_url(hass, CARD_URL)
    resources = hass.data[LOVELACE_DATA].resources
    if not isinstance(resources, ResourceStorageCollection):
        return  # The user's YAML resource definitions remain under their control.
    await resources.async_get_info()
    items = [item for item in resources.async_items()
             if urlsplit(item['url']).path == CARD_PATH]
    if items:
        first, *duplicates = items
        if first['url'] != CARD_URL or first['type'] != 'module':
            await resources.async_update_item(first['id'], {'url': CARD_URL, 'res_type': 'module'})
        for item in duplicates:
            await resources.async_delete_item(item['id'])
    else:
        await resources.async_create_item({'url': CARD_URL, 'res_type': 'module'})
