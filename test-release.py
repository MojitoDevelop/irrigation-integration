"""Exercise release guards and archive contents on an isolated repository copy."""
import hashlib
import json
from pathlib import Path
import shutil
import sys
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'scripts'))
from check_release import check
from configure_repository import configure
from package_release import package

with tempfile.TemporaryDirectory(prefix='irrigation-release-test-') as tmp:
    root = Path(tmp) / 'project'
    shutil.copytree(ROOT, root, ignore=shutil.ignore_patterns('__pycache__', 'dist', 'node_modules', '.git'))
    manifest_path = root / 'custom_components/irrigation_schedule/manifest.json'
    manifest = json.loads(manifest_path.read_text())
    manifest.update(codeowners=[], documentation='https://github.com/REPLACE_OWNER/REPLACE_REPOSITORY#readme', issue_tracker='https://github.com/REPLACE_OWNER/REPLACE_REPOSITORY/issues')
    manifest_path.write_text(json.dumps(manifest))
    assert any('not configured' in e for e in check(root))
    try:
        package(root, root / 'dist')
        raise AssertionError('Unconfigured repository must not be packaged as a release')
    except ValueError:
        pass
    assert not (root / 'dist').exists()
    configure(root, 'https://github.com/test-maintainer/irrigation-test.git')
    assert not check(root, 'test-maintainer/irrigation-test', '0.2.0'), check(root)
    assert check(root, 'different-owner/different-repo')
    assert check(root, version='9.0.0')
    bundle = root / 'custom_components/irrigation_schedule/frontend/irrigation-schedule-card.js'
    original = bundle.read_bytes()
    bundle.write_bytes(original + b'\n// stale generated file\n')
    assert any('outdated' in e for e in check(root))
    bundle.write_bytes(original)
    (root / '.env').write_text('secret=not-for-publication')
    cache = root / 'custom_components/irrigation_schedule/__pycache__'
    cache.mkdir(exist_ok=True)
    (cache / 'leak.pyc').write_bytes(b'not-source')
    first = package(root, root / 'dist')
    hashes = [hashlib.sha256(p.read_bytes()).hexdigest() for p in first]
    second = package(root, root / 'dist')
    assert hashes == [hashlib.sha256(p.read_bytes()).hexdigest() for p in second]
    with zipfile.ZipFile(first[0]) as z:
        assert z.testzip() is None
        assert 'custom_components/irrigation_schedule/manifest.json' in z.namelist()
        assert 'custom_components/irrigation_schedule/brand/icon.png' in z.namelist()
        assert not any(n.startswith('scripts/') or n.startswith('card-source/') for n in z.namelist())
    with zipfile.ZipFile(first[1]) as z:
        assert 'irrigation-schedule/.github/workflows/validate.yml' in z.namelist()
        assert not any('.env' in n or '__pycache__' in n or '/dist/' in n for n in z.namelist())
    print('PASS release guards: real metadata, matching repo/version, stale bundle rejected, deterministic archives, cache/secrets excluded')
