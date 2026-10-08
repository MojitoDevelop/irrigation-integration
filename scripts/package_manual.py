"""Package a tested manual-install build while GitHub/HACS publication is deferred."""
import hashlib
import importlib.util
import json
from pathlib import Path

from package_release import archive, files

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'custom_components/irrigation_schedule/manifest.json').read_text(encoding='utf-8'))
version = manifest['version']
spec = importlib.util.spec_from_file_location('irrigation_card_builder', ROOT / 'scripts/build.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
bundle_path = ROOT / 'custom_components/irrigation_schedule/frontend/irrigation-schedule-card.js'
if bundle_path.read_text(encoding='utf-8') != builder.bundle(ROOT):
    raise SystemExit('Outdated card bundle; run python3 scripts/build.py first.')
for path in (ROOT / 'custom_components/irrigation_schedule').glob('*.py'):
    compile(path.read_text(encoding='utf-8'), str(path), 'exec')
output = ROOT.parent / f'irrigation-integration-{version}.zip'
archive(output, [(path, Path(ROOT.name) / relative) for path, relative in files(ROOT)])
digest = hashlib.sha256(output.read_bytes()).hexdigest()
output.with_suffix('.zip.sha256').write_text(f'{digest}  {output.name}\n', encoding='utf-8')
print(f'Created {output} ({output.stat().st_size:,} bytes)')
print(f'SHA256 {digest}')
