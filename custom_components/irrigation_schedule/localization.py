"""Server localization; shared locale files also supply the dashboard bundle."""
import json
from pathlib import Path

LOCALES_KEY = 'irrigation_schedule_locales'


def load_locales():
    folder = Path(__file__).parent / 'locales'
    return {language: json.loads((folder / f'{language}.json').read_text(encoding='utf-8')) for language in ('en', 'pl', 'de')}


def language_code(value):
    language = str(value or 'en').lower().replace('_', '-').split('-')[0]
    return language if language in ('en', 'pl', 'de') else 'en'


def translate(hass, key, params=None, language=None):
    locales = hass.data[LOCALES_KEY]
    code = language_code(language or hass.config.language)
    text = locales[code].get(key, locales['en'].get(key, key))
    return text.format_map(params or {})


def error_text(hass, error, language=None):
    if getattr(error, 'code', None):
        return translate(hass, error.code, error.params, language)
    return str(error) or translate(hass, 'error_timeout', language=language)
