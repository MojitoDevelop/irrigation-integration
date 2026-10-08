"""Create local repository/manual-install archives; never upload or publish."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

from check_release import check

EXCLUDED_PARTS = {'.git', '__pycache__', '.venv', 'venv', 'node_modules', 'dist',
                  '.pytest_cache', '.ruff_cache', 'test-results', 'playwright-report'}
ROOT_FILES = {'README.md', 'README.pl.md', 'INSTALL.md', 'INSTALL.pl.md', 'LICENSE', 'CHANGELOG.md', 'hacs.json', '.gitignore', '.gitattributes',
              'build.py', 'package.json', 'package-lock.json', 'card.yaml', 'card-with-valves.yaml', 'navigation-card.yaml', 'resource.yaml',
              'preview.html', 'preview-navigation.html', 'preview-light.png', 'preview-dark.png',
              'preview-form.png', 'preview-manual.png', 'preview-navigation.png',
              'test-model.py', 'test-card-model.mjs', 'test-fixtures.json', 'test-release.py',
              'test-integration.py', 'test-browser.cjs', 'test-navigation.cjs'}
ROOT_DIRS = {'custom_components', 'card-source', 'scripts', 'docs', '.github'}


def files(root):
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if not path.is_file() or path.is_symlink() or any(p in EXCLUDED_PARTS for p in relative.parts):
            continue
        if path.suffix in {'.pyc', '.log', '.zip'} or path.name.startswith('.env'):
            continue
        if (len(relative.parts) == 1 and relative.name in ROOT_FILES) or (len(relative.parts) > 1 and relative.parts[0] in ROOT_DIRS):
            yield path, relative


def archive(output, pairs):
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as z:
        for path, relative in pairs:
            item = zipfile.ZipInfo(relative.as_posix(), (2026, 1, 1, 0, 0, 0))
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o100644 << 16
            z.writestr(item, path.read_bytes())
    with zipfile.ZipFile(output) as z:
        if z.testzip() is not None:
            raise ValueError('Archive CRC check failed.')


def package(root, output):
    errors = check(root)
    if errors:
        raise ValueError('\n'.join(errors))
    version = json.loads((root / 'custom_components/irrigation_schedule/manifest.json').read_text(encoding='utf-8'))['version']
    output.mkdir(parents=True, exist_ok=True)
    pairs = list(files(root))
    repo = output / f'irrigation-schedule-repository-{version}.zip'
    install = output / f'irrigation-schedule-{version}.zip'
    archive(repo, [(path, Path('irrigation-schedule') / relative) for path, relative in pairs])
    install_files = {'LICENSE', 'README.md', 'README.pl.md', 'INSTALL.md', 'INSTALL.pl.md', 'card.yaml', 'card-with-valves.yaml', 'navigation-card.yaml', 'resource.yaml'}
    archive(install, [(path, relative) for path, relative in pairs if relative.parts[0] == 'custom_components' or relative.as_posix() in install_files])
    checksums = output / 'SHA256SUMS'
    checksums.write_text(''.join(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n' for path in [install, repo]), encoding='utf-8')
    return install, repo, checksums


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', type=Path, default=None)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    try:
        outputs = package(root, args.output_dir or root / 'dist')
    except ValueError as error:
        parser.exit(1, str(error) + '\n')
    for path in outputs:
        print(path)
