"""Validated valve catalog and a pure plan derived from HA states."""
from __future__ import annotations

from dataclasses import dataclass
import json
import re
from typing import Any, Mapping


ERROR_MESSAGES = {'error_valves': 'Select at least one valve.', 'error_entity': 'Each valve needs a valid entity: switch.…', 'error_automation_valve': 'The automation switch cannot be a valve.', 'error_valve_name': 'Valve name must contain 1–80 characters.', 'error_duplicate_valves': 'Valve entities must be distinct.'}

class IrrigationError(ValueError):
    def __init__(self, code, params=None):
        self.code, self.params = code, params or {}
        super().__init__(ERROR_MESSAGES.get(code, code).format_map(self.params))

ENTITY_RE = re.compile(r'^switch\.[a-z0-9_]+$')


def normalize_valves(raw: Any) -> list[dict[str, str]]:
    if not isinstance(raw, list) or not raw:
        raise IrrigationError('error_valves')
    result = []
    seen = set()
    for item in raw:
        if not isinstance(item, dict) or not isinstance(item.get('entity'), str) or not ENTITY_RE.fullmatch(item['entity']):
            raise IrrigationError('error_entity')
        if item['entity'] in ('switch.irrigation_automation', 'switch.nawodnienie_automatyka'):
            raise IrrigationError('error_automation_valve')
        name = item.get('name', item['entity'])
        if not isinstance(name, str) or not name.strip() or len(name) > 80:
            raise IrrigationError('error_valve_name')
        if item['entity'] in seen:
            raise IrrigationError('error_duplicate_valves')
        seen.add(item['entity'])
        result.append({'entity': item['entity'], 'name': name.strip()})
    return result


def merged_catalog(valves: Any, previous: Mapping[str, Any]) -> dict[str, Any]:
    valves = normalize_valves(valves)
    ids = {v['entity'] for v in valves}
    retired = {v['entity']: v for v in previous.get('retired', []) + previous.get('valves', []) if v['entity'] not in ids}
    return {'valves': valves, 'retired': list(retired.values())}


def parse_json(value: Any, fallback: Any) -> Any:
    try:
        return json.loads(value) if isinstance(value, str) else fallback
    except (TypeError, ValueError):
        return fallback


@dataclass(frozen=True)
class Plan:
    requested: tuple[str, ...]
    opened: tuple[str, ...]
    unavailable: tuple[str, ...]
    names: tuple[str, ...]
    active_ids: tuple[str, ...]
    errors: tuple[str, ...]
    error_details: tuple[dict[str, Any], ...]


def make_plan(states: Mapping[str, Any], valves: list[dict[str, str]], retired: list[dict[str, str]], enabled: bool) -> Plan:
    """Read only managed schedules and explicit catalog entities; never map by order."""
    allowed = {v['entity'] for v in valves}
    controlled = [v['entity'] for v in valves + retired]
    requested, names, active_ids, errors = set(), [], [], []
    opened, unavailable, error_details = [], [], []
    def issue(code, name):
        error_details.append({'code': code, 'params': {'name': name}})
        templates = {'issue_valve': 'Unavailable valve: {name}', 'issue_schedule': 'Unavailable schedule: {name}', 'issue_data': 'Invalid data or removed valve in schedule: {name}'}
        errors.append(templates[code].format(name=name))
    labels = {v['entity']: v['name'] for v in valves + retired}
    for entity_id in controlled:
        state = states.get(entity_id)
        value = state.state if state else None
        if value == 'on':
            opened.append(entity_id)
        elif value != 'off':
            unavailable.append(entity_id)
            issue('issue_valve', labels[entity_id])
    for entity_id, state in states.items():
        if not entity_id.startswith(('schedule.irrigation_', 'schedule.nawodnienie_')):
            continue
        data = state.attributes
        if 'irrigation_catalog' in data:
            continue  # Previous package's technical helper does not water anything.
        title = str(data.get('friendly_name', entity_id)).removeprefix('Irrigation ').removeprefix('Nawodnienie ')
        entry = parse_json(data.get('irrigation_entry'), {})
        if isinstance(entry, dict) and entry.get('enabled') is False:
            continue
        if state.state not in ('on', 'off'):
            issue('issue_schedule', title)
            continue
        if state.state != 'on':
            continue
        valid = isinstance(entry, dict) and type(entry.get('enabled', True)) is bool
        zones = entry.get('zones') if valid else None
        valid = valid and type(entry.get('version')) is int and isinstance(zones, list) and bool(zones)
        ids = []
        if valid and entry.get('version') == 2 and data.get('irrigation_managed') in ('adk45-ha-v2', 'adk45-integration-v2'):
            valid = parse_json(data.get('irrigation_valves'), None) == zones and all(isinstance(id_, str) and id_ in allowed for id_ in zones)
            if valid:
                ids = zones
        elif valid and entry.get('version') == 1 and data.get('irrigation_managed') == 'adk45-v1':
            valid = all(type(n) is int and 1 <= n <= 12 for n in zones)
            if valid:
                ids = [f'switch.nawodnienie_strefa_{n}' for n in zones]
                valid = data.get('strefy') == ','.join(map(str, sorted(set(zones)))) and all(id_ in allowed for id_ in ids)
        else:
            valid = False
        if not valid:
            issue('issue_data', title)
            continue
        if isinstance(entry.get('title'), str) and entry['title']:
            title = entry['title']
        names.append(title)
        active_ids.append(entity_id)
        if enabled:
            requested.update(ids)
    return Plan(tuple(sorted(requested)), tuple(opened), tuple(unavailable), tuple(names), tuple(active_ids), tuple(errors), tuple(error_details))
