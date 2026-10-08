"""Local release preflight; HACS Action and Hassfest remain separate required checks."""
import argparse
import ast
import importlib.util
import json
from pathlib import Path
import re
import struct
from string import Formatter
import sys

DOMAIN = 'irrigation_schedule'


def check(root, repository=None, version=None):
    errors = []
    integration = root / 'custom_components' / DOMAIN
    manifest = json.loads((integration / 'manifest.json').read_text(encoding='utf-8'))
    keys = ['domain', 'name', *sorted(set(manifest) - {'domain', 'name'})]
    if list(manifest) != keys:
        errors.append('Manifest keys must be domain, name, then alphabetical.')
    if manifest.get('domain') != DOMAIN:
        errors.append('Manifest domain does not match the integration directory.')
    if not re.fullmatch(r'\d+\.\d+\.\d+(?:-[a-z]+\.\d+)?', manifest.get('version', '')):
        errors.append('Use a semantic version such as 0.1.0.')
    if version and version != manifest.get('version'):
        errors.append('Requested release version does not match manifest.json.')
    constants = ast.parse((integration / 'const.py').read_text(encoding='utf-8'))
    values = {node.targets[0].id: ast.literal_eval(node.value) for node in constants.body
              if isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name) and isinstance(node.value, ast.Constant)}
    if values.get('VERSION') != manifest.get('version'):
        errors.append('const.py and manifest.json versions differ (card cache version).')
    owners = manifest.get('codeowners', [])
    if not owners or any(not re.fullmatch(r'@[A-Za-z0-9][A-Za-z0-9-]*(?:/[A-Za-z0-9_.-]+)?', v) for v in owners):
        errors.append('Set a real GitHub code owner with configure_repository.py.')
    documentation = manifest.get('documentation', '')
    issue_tracker = manifest.get('issue_tracker', '')
    if 'REPLACE_' in documentation or 'REPLACE_' in issue_tracker:
        errors.append('Repository metadata is not configured yet; run configure_repository.py.')
    else:
        base = documentation.removesuffix('#readme')
        if not re.fullmatch(r'https://github.com/[A-Za-z0-9-]+/[A-Za-z0-9_.-]+', base) or issue_tracker != base + '/issues':
            errors.append('Documentation and issue tracker must refer to the same real GitHub project.')
        if repository and base.lower() != ('https://github.com/' + repository).lower():
            errors.append('Manifest links do not match GITHUB_REPOSITORY.')
    if manifest.get('requirements') != []:
        errors.append('Revisit declared runtime requirements before introducing dependencies.')
    hacs = json.loads((root / 'hacs.json').read_text(encoding='utf-8'))
    if not hacs.get('name') or hacs.get('homeassistant') != '2026.10.0':
        errors.append('HACS name/minimum HA version is missing or changed without compatibility review.')
    directories = [p.name for p in (root / 'custom_components').iterdir() if p.is_dir() and p.name != '__pycache__']
    if directories != [DOMAIN]:
        errors.append('The repository must contain exactly one integration.')
    for name in ['icon.png', 'icon@2x.png', 'dark_icon.png', 'dark_icon@2x.png']:
        data = (integration / 'brand' / name).read_bytes() if (integration / 'brand' / name).exists() else b''
        if len(data) < 24 or data[:8] != b'\x89PNG\r\n\x1a\n':
            errors.append(f'Missing or invalid brand image: {name}.')
        elif struct.unpack('>II', data[16:24]) != ((512, 512) if '@2x' in name else (256, 256)):
            errors.append(f'Unexpected dimensions for {name}.')
    codeowners = (root / '.github/CODEOWNERS').read_text(encoding='utf-8')
    if owners and not all(o in codeowners for o in owners):
        errors.append('CODEOWNERS does not match the manifest.')
    for relative in ['LICENSE', 'README.md', 'CHANGELOG.md', 'docs/TEST_PLAN.md', 'docs/PUBLISHING.md',
                     f'docs/RELEASE_NOTES_{manifest.get("version")}.md', '.github/workflows/validate.yml', '.github/workflows/package.yml']:
        if not (root / relative).is_file():
            errors.append(f'Missing release file: {relative}.')
    spec = importlib.util.spec_from_file_location('irrigation_card_builder', root / 'build.py')
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)
    if builder.bundle(root) != (integration / 'frontend/irrigation-schedule-card.js').read_text(encoding='utf-8'):
        errors.append('Card bundle is outdated; run python3 build.py.')
    if builder.navigation(root) != (root / 'navigation-card.yaml').read_text(encoding='utf-8'):
        errors.append('Navigation YAML is outdated; run python3 build.py.')
    locales = {language: json.loads((integration / 'locales' / (language + '.json')).read_text(encoding='utf-8')) for language in ('en', 'pl', 'de')}
    for language, data in locales.items():
        if data.keys() != locales['en'].keys():
            errors.append(f'Locale {language} has missing or extra keys.')
        if len(data.get('days', [])) != 7:
            errors.append(f'Locale {language} must provide seven weekday labels.')
        for key, source in locales['en'].items():
            if not isinstance(source, str):
                continue
            value = data.get(key)
            if not isinstance(value, str) or not value:
                errors.append(f'Missing locale text: {language}.{key}')
                continue
            placeholders = lambda text: {name for _, name, _, _ in Formatter().parse(text) if name is not None}
            if placeholders(value) != placeholders(source):
                errors.append(f'Locale placeholders differ: {language}.{key}')
    strings = json.loads((integration / 'strings.json').read_text(encoding='utf-8'))
    if strings != json.loads((integration / 'translations/en.json').read_text(encoding='utf-8')):
        errors.append('strings.json must match the native English translation.')
    for path in integration.rglob('*.py'):
        compile(path.read_text(encoding='utf-8'), str(path), 'exec')
    return errors


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', help='Validate against this GitHub OWNER/REPOSITORY.')
    parser.add_argument('--version', help='Validate the version intended for release.')
    args = parser.parse_args()
    errors = check(Path(__file__).resolve().parents[1], args.repository, args.version)
    if errors:
        print('\n'.join('FAIL ' + error for error in errors))
        sys.exit(1)
    print('PASS local release preflight. HACS Action and Hassfest must also pass on GitHub.')
