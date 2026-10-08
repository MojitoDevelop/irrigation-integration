"""Fill actual GitHub metadata locally. Does not contact GitHub or publish anything."""
import argparse
import json
from pathlib import Path
import re


def parse_repository(value):
    value = value.removeprefix('https://github.com/').rstrip('/').removesuffix('.git')
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9-]{0,38}/[A-Za-z0-9_.-]+', value):
        raise ValueError('Use OWNER/REPOSITORY or its https://github.com/ URL.')
    owner, name = value.split('/')
    if name in {'.', '..'} or 'REPLACE_' in value.upper():
        raise ValueError('Use the real GitHub repository name.')
    return owner, name


def configure(root, repository, maintainer=None):
    owner, name = parse_repository(repository)
    maintainer = (maintainer or owner).removeprefix('@')
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9-]{0,38}(?:/[A-Za-z0-9_.-]+)?', maintainer):
        raise ValueError('Maintainer must be a GitHub login or an organization/team.')
    base = f'https://github.com/{owner}/{name}'
    path = root / 'custom_components/irrigation_schedule/manifest.json'
    manifest = json.loads(path.read_text(encoding='utf-8'))
    manifest.update(codeowners=['@' + maintainer], documentation=base + '#readme', issue_tracker=base + '/issues')
    manifest = {k: manifest[k] for k in ['domain', 'name', *sorted(set(manifest) - {'domain', 'name'})]}
    path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    (root / '.github/CODEOWNERS').write_text(f'# Project maintainer\n* @{maintainer}\n', encoding='utf-8')
    (root / 'docs/REPOSITORY.md').write_text(
        f'# Repository\n\n- Project: [{owner}/{name}]({base})\n- Documentation: {base}#readme\n'
        f'- Issues: {base}/issues\n- Maintainer: @{maintainer}\n', encoding='utf-8')
    return base


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repository', help='OWNER/REPOSITORY or https://github.com/OWNER/REPOSITORY')
    parser.add_argument('--maintainer', help='Defaults to the repository owner; set a user/team for organization repos.')
    args = parser.parse_args()
    try:
        base = configure(Path(__file__).resolve().parents[1], args.repository, args.maintainer)
    except ValueError as error:
        parser.exit(1, str(error) + '\n')
    print(f'Configured {base}. No upload or publication was performed.')
