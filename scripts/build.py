"""Bundle the dashboard card; --check detects an outdated committed bundle."""
import argparse
import json
from pathlib import Path


def bundle(root):
    version = json.loads((root / 'custom_components/irrigation_schedule/manifest.json').read_text(encoding='utf-8'))['version']
    source = root / 'card-source'
    model = (source / 'schedule-model.js').read_text(encoding='utf-8').replace('export ', '')
    editor = (source / 'editor-source.js').read_text(encoding='utf-8')
    wheel = (source / 'time-picker-source.js').read_text(encoding='utf-8')
    split = editor.index('class IrrigationIntegrationCard')
    locales = {lang: json.loads((root / 'custom_components/irrigation_schedule/locales' / (lang + '.json')).read_text(encoding='utf-8')) for lang in ('en', 'pl', 'de')}
    localization = 'const IRRIGATION_TRANSLATIONS = ' + json.dumps(locales, ensure_ascii=False) + ';\n' + (source / 'localization-source.js').read_text(encoding='utf-8')
    resource = 'const INTEGRATION_CARD_VERSION = ' + json.dumps(version) + ';\n' + localization + '\n' + model + '\n' + editor[:split] + '\nconst ElementBase = globalThis.HTMLElement || class {};\nconst ROW_HEIGHT = 36;\n' + wheel
    resource += "\nif (globalThis.customElements && !customElements.get('irrigation-integration-time-picker')) customElements.define('irrigation-integration-time-picker', IrrigationIntegrationTimePicker);\n"
    return resource + editor[split:]


def navigation(root):
    lines = ['  translations:']
    for language in ('en', 'pl', 'de'):
        data = json.loads((root / 'custom_components/irrigation_schedule/locales' / (language + '.json')).read_text(encoding='utf-8'))
        lines.append('    ' + language + ':')
        for key, value in data.items():
            if key in ('title', 'no_status') or key.startswith(('status_', 'issue_')):
                lines.append('      ' + key + ': ' + json.dumps(value, ensure_ascii=False))
    return (root / 'card-source/navigation-template.yaml').read_text(encoding='utf-8').replace('__TRANSLATIONS__', '\n'.join(lines))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    output = root / 'custom_components/irrigation_schedule/frontend/irrigation-schedule-card.js'
    resource = bundle(root)
    navigation_resource = navigation(root)
    navigation_output = root / 'examples/navigation-card.yaml'
    if args.check:
        if output.read_text(encoding='utf-8') != resource:
            parser.exit(1, 'Card bundle is outdated; run python3 scripts/build.py\n')
        if navigation_output.read_text(encoding='utf-8') != navigation_resource:
            parser.exit(1, 'Navigation YAML is outdated; run python3 scripts/build.py\n')
        print('PASS committed card bundle and navigation YAML match their sources')
    else:
        output.write_text(resource, encoding='utf-8')
        navigation_output.write_text(navigation_resource, encoding='utf-8')
        print('Built bundled integration card')
