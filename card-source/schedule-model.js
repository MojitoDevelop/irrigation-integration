// One logical entry owns every weekday and midnight fragment with the same ID.
export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MODEL_MESSAGES = {"error_entry_id": "entry_id must be a string.", "error_subscription": "Schedule notifications are unavailable. Use Refresh or reopen the dashboard.", "error_no_registry": "Schedule entity is missing from the HA registry.", "error_disabled_schedule": "Schedule entity is disabled in HA.", "error_schedule_id": "Use an entity ID starting with schedule.irrigation_ or the legacy schedule.nawodnienie_.", "error_helper": "This helper does not contain one complete entry created by the card.", "error_yaml_admin": "An administrator must save the YAML valve list to the integration.", "error_read": "Could not read schedules.", "error_choose_catalog": "Select valves from the current list.", "error_catalog_changed": "The valve list changed in the integration. Refresh and select valves again.", "error_stale_schedule": "The schedule changed. Refresh and select it again.", "error_save": "Could not save the schedule.", "error_master": "Could not change the automation switch.", "error_manual_changed": "Valve configuration or control mode changed. Try again.", "error_manual": "Could not switch the valve.", "error_time": "Enter a time as HH:MM (minute precision).", "error_time_range": "Time is out of range.", "error_rule_id": "Missing entry ID.", "error_days": "Select at least one day.", "error_valves": "Select at least one valve.", "error_switch": "Valves must be switch entities.", "error_equal_times": "Start and end times must differ.", "error_name": "Name must contain at most 80 characters.", "error_reserved": "This name is reserved for automation configuration.", "error_version": "Unsupported entry version.", "error_valve_data": "Valve data is inconsistent.", "error_zone_data": "Zone data is inconsistent.", "error_parts": "Entry fragments are inconsistent. Fix the helper in HA or delete the entire entry.", "error_operation": "Unknown operation.", "error_stale_clear": "The schedule changed. Refresh it before clearing.", "error_stale_entry": "This entry changed. Refresh and select it again.", "error_change_id": "Entry ID cannot be changed.", "error_duplicate_id": "This entry ID already exists.", "error_overlap": "Time window overlaps another entry: {day}.", "error_catalog_empty": "Add at least one valve to valves.", "error_entity": "Each valve needs a valid entity: switch.…", "error_valve_name": "Valve name must contain 1–80 characters.", "error_duplicate_valves": "Valve entities must be distinct.", "error_automation_valve": "The automation switch cannot be a valve.", "error_not_ready": "The irrigation integration is not running.", "error_manual_mode": "Disable automation and wait until the valves are closed.", "error_unknown_valve": "This valve is not part of the irrigation configuration.", "error_open_one": "Select one valve to open.", "error_timeout": "Timed out waiting for the valve action."};
export class ScheduleError extends Error {
  constructor(code, params = {}) {
    super((MODEL_MESSAGES[code] || code).replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match));
    this.code = code; this.params = params;
  }
}
const copy = value => JSON.parse(JSON.stringify(value));
const canonical = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === 'object' ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v);
export function seconds(value, end = false) {
  if (typeof value !== 'string' || !/^\d{1,2}:\d{2}(?::00)?$/.test(value.trim())) throw new ScheduleError('error_time');
  const [h, m] = value.trim().split(':').map(Number);
  if (end && h === 24 && m === 0) return 86400;
  if (h > 23 || m > 59) throw new ScheduleError('error_time_range');
  return h * 3600 + m * 60;
}
const format = n => `${String(Math.floor(n / 3600)).padStart(2, '0')}:${String(n % 3600 / 60).padStart(2, '0')}:00`;
export function normalizeRule(raw) {
  if (typeof raw.id !== 'string' || !raw.id.trim()) throw new ScheduleError('error_rule_id');
  if (!Array.isArray(raw.days) || !raw.days.length || raw.days.some(d => !DAYS.includes(d))) throw new ScheduleError('error_days');
  if (!Array.isArray(raw.zones) || !raw.zones.length) throw new ScheduleError('error_valves');
  const zones = raw.zones.map(n => Number.isInteger(n) && n >= 1 && n <= 12 ? 'switch.nawodnienie_strefa_' + n : n);
  if (zones.some(n => typeof n !== 'string' || !/^switch\.[a-z0-9_]+$/.test(n))) throw new ScheduleError('error_switch');
  const a = seconds(raw.from), b = seconds(raw.to, true);
  if (a === b) throw new ScheduleError('error_equal_times');
  if (raw.title != null && (typeof raw.title !== 'string' || raw.title.length > 80)) throw new ScheduleError('error_name');
  if (['Konfiguracja zaworów', 'Valve configuration'].includes(raw.title?.trim())) throw new ScheduleError('error_reserved');
  return { id: raw.id, title: raw.title?.trim() || '', days: DAYS.filter(d => raw.days.includes(d)), from: format(a).slice(0, 5), to: format(b).slice(0, 5), zones: [...new Set(zones)].sort() };
}
export function compileRule(raw, extraData = {}) {
  const rule = normalizeRule(raw), a = seconds(rule.from), b = seconds(rule.to, true);
  const parts = [];
  const data = { ...copy(extraData), irrigation_managed: 'adk45-ha-v2', irrigation_valves: JSON.stringify(rule.zones), irrigation_entry: JSON.stringify({ version: 2, ...rule }) };
  delete data.strefy;
  for (const day of rule.days) {
    if (a < b) parts.push({ day, block: { from: format(a), to: format(b), data: copy(data) } });
    else {
      parts.push({ day, block: { from: format(a), to: '24:00:00', data: copy(data) } });
      if (b > 0) parts.push({ day: DAYS[(DAYS.indexOf(day) + 1) % 7], block: { from: '00:00:00', to: format(b), data: copy(data) } });
    }
  }
  return parts;
}
export function decodeEntry(data) {
  try { return typeof data?.irrigation_entry === 'string' ? JSON.parse(data.irrigation_entry) : null; } catch { return null; }
}
export function entryFingerprint(week, id) {
  return canonical(DAYS.flatMap(day => (week[day] || []).filter(b => decodeEntry(b.data)?.id === id).map(block => ({ day, block }))).sort((a, b) => canonical(a).localeCompare(canonical(b))));
}
export function listEntries(week) {
  const ids = new Set(DAYS.flatMap(day => (week[day] || []).map(b => decodeEntry(b.data)?.id)).filter(Boolean));
  return [...ids].map(id => {
    const parts = DAYS.flatMap(day => (week[day] || []).filter(b => decodeEntry(b.data)?.id === id).map(block => ({ day, block })));
    const first = parts[0].block.data;
    let rule, error, error_code, error_params;
    try {
      const decoded = decodeEntry(first);
      if (![1, 2].includes(decoded?.version)) throw new ScheduleError('error_version');
      rule = normalizeRule(decoded);
      if (decoded.version === 2 && (first.irrigation_managed !== 'adk45-ha-v2' || first.irrigation_valves !== JSON.stringify(rule.zones))) throw new ScheduleError('error_valve_data');
      if (decoded.version === 1 && (first.irrigation_managed !== 'adk45-v1' || first.strefy !== [...new Set(decoded.zones)].sort((a,b)=>a-b).join(','))) throw new ScheduleError('error_zone_data');
      const expected = canonical(compileRule(rule, first).map(p => ({day:p.day, block:{...p.block, data:first}})).sort((a, b) => canonical(a).localeCompare(canonical(b))));
      const actual = canonical(parts.sort((a, b) => canonical(a).localeCompare(canonical(b))));
      if (expected !== actual) throw new ScheduleError('error_parts');
    } catch (e) { error = e.message; error_code = e.code; error_params = e.params; }
    return { id, rule, error, error_code, error_params, fingerprint: entryFingerprint(week, id) };
  });
}
export function updateWeek(current, request) {
  const week = { name: current.name, ...current.icon != null ? { icon: current.icon } : {} };
  for (const day of DAYS) week[day] = copy(current[day] || []);
  if (!['add', 'replace', 'delete', 'clear'].includes(request.operation)) throw new ScheduleError('error_operation');
  if (request.operation === 'clear') {
    if (request.fingerprint !== canonical(DAYS.map(d => current[d] || []))) throw new ScheduleError('error_stale_clear');
    for (const day of DAYS) week[day] = [];
  } else {
    let extra = {};
    if (request.operation === 'replace' || request.operation === 'delete') {
      const entry = listEntries(current).find(e => e.id === request.id);
      if (!entry || entry.fingerprint !== request.fingerprint) throw new ScheduleError('error_stale_entry');
      if (request.operation === 'replace' && entry.error) throw entry.error_code ? new ScheduleError(entry.error_code, entry.error_params) : Error(entry.error);
      const existing = DAYS.flatMap(d => week[d]).find(b => decodeEntry(b.data)?.id === request.id);
      extra = existing?.data || {};
      for (const day of DAYS) week[day] = week[day].filter(b => decodeEntry(b.data)?.id !== request.id);
    }
    if (request.operation === 'add' || request.operation === 'replace') {
      if (request.operation === 'replace' && request.rule.id !== request.id) throw new ScheduleError('error_change_id');
      if (request.operation === 'add' && listEntries(current).some(e => e.id === request.rule.id)) throw new ScheduleError('error_duplicate_id');
      for (const { day, block } of compileRule(request.rule, extra)) {
        const a = seconds(block.from), b = seconds(block.to, true);
        if (week[day].some(old => a < seconds(old.to, true) && b > seconds(old.from))) throw new ScheduleError('error_overlap', {day: LABELS[DAYS.indexOf(day)]});
        week[day].push(block);
      }
    }
    for (const day of DAYS) week[day].sort((a, b) => seconds(a.from) - seconds(b.from));
  }
  return { type: 'schedule/update', schedule_id: current.id, ...week };
}
export const weekFingerprint = week => canonical(DAYS.map(d => week[d] || []));
export const MANAGED_PREFIX = 'Irrigation ';
export const isManagedSchedule = schedule => ['Irrigation ', 'Nawodnienie '].some(prefix => schedule.name?.startsWith(prefix));
export const isManagedEntity = id => ['schedule.irrigation_', 'schedule.nawodnienie_'].some(prefix => id?.startsWith(prefix));
export const scheduleName = rule => MANAGED_PREFIX + (rule.title || 'Schedule ' + rule.id.slice(0, 8));
export function createSchedule(rule) {
  const normalized = normalizeRule(rule);
  const payload = updateWeek({ id: normalized.id, name: scheduleName(normalized), icon: 'mdi:sprinkler-variant' }, { operation: 'add', rule: normalized });
  delete payload.schedule_id;
  payload.type = 'schedule/create';
  return payload;
}

export const CATALOG_NAME = 'Irrigation Valve configuration';
export function normalizeValves(raw) {
  if (!Array.isArray(raw) || !raw.length) throw new ScheduleError('error_catalog_empty');
  const valves = raw.map(v => {
    if (!v || typeof v.entity !== 'string' || !/^switch\.[a-z0-9_]+$/.test(v.entity)) throw new ScheduleError('error_entity');
    if (v.name != null && (typeof v.name !== 'string' || !v.name.trim() || v.name.length > 80)) throw new ScheduleError('error_valve_name');
    return {entity:v.entity, name:v.name?.trim() || v.entity};
  });
  if (new Set(valves.map(v=>v.entity)).size !== valves.length) throw new ScheduleError('error_duplicate_valves');
  return valves;
}
export function isCatalogSchedule(s) { return [CATALOG_NAME, 'Nawodnienie Konfiguracja zaworów'].includes(s.name) || DAYS.some(d => (s[d] || []).some(b => b.data?.irrigation_catalog != null)); }
export function decodeCatalog(s) {
  const block = DAYS.flatMap(d => s[d] || []).find(b => b.data?.irrigation_catalog != null);
  try { return JSON.parse(block.data.irrigation_catalog); } catch { return null; }
}
export function catalogPayload(valves, old = null) {
  valves = normalizeValves(valves);
  const previous = old && decodeCatalog(old);
  const retired = [...(previous?.retired || []), ...(previous?.valves || [])].filter(v => !valves.some(n => n.entity === v.entity));
  const data = {irrigation_managed:'adk45-ha-v2', irrigation_catalog:JSON.stringify({version:1, valves, retired:[...new Map(retired.map(v=>[v.entity,v])).values()]})};
  const payload = {type:old ? 'schedule/update' : 'schedule/create', name:CATALOG_NAME, icon:'mdi:cog'};
  if (old) payload.schedule_id = old.id;
  for (const d of DAYS) payload[d] = [{from:'00:00:00',to:'24:00:00',data:copy(data)}];
  return payload;
}
