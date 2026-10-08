"""Pure validation/union tests; no Home Assistant installation is required."""
import importlib.util
import json
from pathlib import Path
import sys
from types import SimpleNamespace

file = Path(__file__).parent / 'custom_components/irrigation_schedule/model.py'
spec = importlib.util.spec_from_file_location('irrigation_model', file)
model = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = model
spec.loader.exec_module(model)
valves = [{'entity': 'switch.a', 'name': 'Trawnik'}, {'entity': 'switch.b', 'name': 'Rabaty'}]

def state(value, **attributes):
    return SimpleNamespace(state=value, attributes=attributes)

def scheduled(zones, version=2):
    return state('on', irrigation_managed='adk45-ha-v2', irrigation_valves=json.dumps(zones), irrigation_entry=json.dumps({'version': version, 'title': 'Rano', 'zones': zones}))

states = {'switch.a': state('on'), 'switch.b': state('off'), 'schedule.nawodnienie_a': scheduled(['switch.a', 'switch.b']), 'schedule.nawodnienie_b': scheduled(['switch.b'])}
p = model.make_plan(states, valves, [], True)
assert p.requested == ('switch.a', 'switch.b') and not p.errors
states['schedule.nawodnienie_a'] = state('off')
assert model.make_plan(states, valves, [], True).requested == ('switch.b',)
assert model.make_plan(states, valves, [], False).requested == ()
assert model.make_plan(states, valves[::-1], [], True).requested == ('switch.b',)

for raw in [None, [], [{}, {}], [{'entity': 'light.a', 'name': 'X'}], valves + [valves[0]], [{'entity': 'switch.a', 'name': ''}], [{'entity': 'switch.nawodnienie_automatyka', 'name': 'Auto'}]]:
    try:
        model.normalize_valves(raw)
        raise AssertionError(raw)
    except ValueError:
        pass

for zones, version in [(None, 2), ({}, 2), ([], 2), (['switch.not_allowed'], 2), ([{}], 2), (['switch.a'], True), (['switch.a'], 9)]:
    states['schedule.nawodnienie_b'] = scheduled(zones, version)
    p = model.make_plan(states, valves, [], True)
    assert p.errors and not p.requested

states['schedule.other'] = scheduled(['switch.b'])
states['schedule.nawodnienie_catalog'] = state('on', irrigation_catalog='{}')
assert not model.make_plan(states, valves, [], True).requested
states['switch.b'] = state('unavailable')
assert 'switch.b' in model.make_plan(states, valves, [], True).unavailable

legacy_valve = {'entity': 'switch.nawodnienie_strefa_1', 'name': 'Strefa 1'}
legacy = {'schedule.nawodnienie_legacy': state('on', irrigation_managed='adk45-v1', strefy='1', irrigation_entry=json.dumps({'version': 1, 'title': 'Stary wpis', 'zones': [1]})), legacy_valve['entity']: state('off')}
assert model.make_plan(legacy, [legacy_valve], [], True).requested == (legacy_valve['entity'],)
assert not model.make_plan(legacy, valves, [], True).requested

retired = model.merged_catalog(valves[:1], {'valves': valves, 'retired': []})
assert retired['retired'] == valves[1:]
assert model.merged_catalog(valves[::-1], retired)['retired'] == []
print('PASS pure model: entity validation, union, invalid metadata, unavailable valves, retirement/re-add and stable legacy identity')
