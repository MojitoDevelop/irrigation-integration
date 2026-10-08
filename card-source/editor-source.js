// Bundled with schedule-model.js and the independent time picker by build.py.
const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const time = value => [Math.floor(value / 3600), Math.floor(value % 3600 / 60), value % 60].map(n => String(n).padStart(2, '0')).join(':');
const setText = (element, value) => { if (element.textContent !== value) element.textContent = value; };
const setAttr = (element, name, value) => { value = String(value); if (element.getAttribute(name) !== value) element.setAttribute(name, value); };
const setDisabled = (element, value) => { value = Boolean(value); if (element.disabled !== value) element.disabled = value; };
const CSS = `
 :host{display:block;min-width:0;color:var(--primary-text-color,#e2e2ec);font:13px var(--paper-font-body1_-_font-family,Roboto,Arial,sans-serif)}
 *{box-sizing:border-box}ha-card{display:block;padding:18px 16px;background:transparent;--ha-card-background:transparent;--ha-card-border-width:0;--ha-card-box-shadow:none;border:0;border-radius:0;box-shadow:none;backdrop-filter:none}
 .heading{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;background:none;border:0;border-radius:0;padding:0 0 12px;border-bottom:1px solid var(--ir-green);text-align:left}
 .heading svg{width:22px;height:22px;flex:none}.heading strong{flex:1;text-align:center;font-size:14px;font-weight:600}.badge{font-size:10px;padding:6px 8px;background:var(--ir-field);border-radius:10px;white-space:nowrap;color:var(--secondary-text-color)}
 .body{display:flex;flex-direction:column;gap:16px;padding-top:16px}.schedule-form{display:flex;flex-direction:column;gap:16px}.schedule-form[hidden],.add-schedule[hidden],.manual-section[hidden]{display:none}label,.caption{display:block;font-size:12px;color:var(--secondary-text-color);margin-bottom:8px}
 button,input{font:inherit;color:inherit;min-width:0}button{cursor:pointer;border:1px solid transparent;background:var(--ir-field);border-radius:12px;padding:10px 6px;-webkit-tap-highlight-color:transparent}
 button:hover:not(:disabled){filter:brightness(1.08)}button.selected,.primary{color:var(--ir-green);background:var(--ir-green-soft);border-color:var(--ir-green-line)}
 button:focus-visible,input:focus-visible{outline:2px solid var(--ir-green);outline-offset:2px}button:disabled,input:disabled{opacity:.45;cursor:default}
 input[type=text]{width:100%;padding:11px 12px;border:1px solid transparent;border-radius:12px;background:var(--ir-field)}
 .presets,.days,.times,.zones,.actions,.manual-grid{display:grid;gap:8px}.presets{grid-template-columns:repeat(3,minmax(0,1fr))}.days{grid-template-columns:repeat(7,minmax(0,1fr));margin-top:8px}.times{grid-template-columns:repeat(2,minmax(0,1fr))}.zones{grid-template-columns:repeat(3,minmax(0,1fr))}.actions{grid-template-columns:repeat(2,minmax(0,1fr))}
 .manual-grid{grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:8px}.manual-grid button{position:relative;display:flex;align-items:center;justify-content:space-between;gap:6px;min-height:36px;padding:7px 8px;border-radius:9px;font-size:11px}.manual-name{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.manual-grid small{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap}.manual-indicator{width:7px;height:7px;flex:none;border:1px solid var(--secondary-text-color);border-radius:50%}.manual-grid [data-state=on] .manual-indicator{border-color:var(--ir-green);background:var(--ir-green)}.manual-grid [data-state=unavailable] .manual-indicator,.manual-grid [data-state=unknown] .manual-indicator{border-color:var(--error-color,#d96276);background:var(--error-color,#d96276)}.manual-section .caption{margin:0}.manual-section .hint{margin-top:6px}.manual-section .toolbar button{font-size:11px;padding:7px 9px}.sensor-status{padding:10px 12px;border-radius:12px;background:var(--ir-field);font-size:12px;line-height:1.5;overflow-wrap:anywhere;margin-top:10px}
 .days button{padding:10px 0}.zones button{padding:10px 6px;overflow-wrap:anywhere}.actions button{font-size:12px}.danger{color:var(--error-color,#d96276)}.wide{width:100%}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px}.toolbar label{margin:0}.toolbar button{padding:8px 12px}
 .hint,.message{font-size:11px;color:var(--secondary-text-color);line-height:1.5}.message{overflow-wrap:anywhere;min-height:17px}.message.error{color:var(--error-color,#d96276)}
 .editing{font-size:12px;color:var(--ir-green);margin-bottom:10px}.section-line{border-top:1px solid var(--ir-line);padding-top:14px}.entries{display:flex;flex-direction:column;gap:8px}.schedule-toolbar{margin-bottom:12px}.schedule-toolbar .caption{margin-bottom:0}
 .entry{width:100%;display:flex;flex-direction:column;align-items:flex-start;text-align:left;padding:12px;gap:6px;border:1px solid var(--ir-line);border-radius:12px;background:var(--ir-field)}
 .entry.selected{border-color:var(--ir-green-line)}.entry-title{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;font-weight:500}.entry small{font-size:11px;color:var(--secondary-text-color);line-height:1.5}.entry.active .badge{background:var(--ir-green-soft);color:var(--ir-green)}
 .track{height:10px;border-radius:7px;background:var(--ir-field);position:relative;overflow:hidden}.range{position:absolute;top:0;height:100%;background:var(--ir-green);opacity:.65}.ticks{display:flex;justify-content:space-between;font-size:10px;color:var(--secondary-text-color);margin-top:6px}
 @media(max-width:380px){ha-card{padding:16px 12px}.heading strong{font-size:13px}.presets,.days,.times,.zones,.actions{gap:6px}.badge{font-size:9px}.presets button{font-size:12px}}
`;
class IrrigationIntegrationCard extends ElementBase {
  static version = INTEGRATION_CARD_VERSION;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._entries = [];
    this._ready = false;
    this._message = this._msg('reading');
    this._resetDraft();
    this.shadowRoot.addEventListener('click', e => this._click(e));
    this.shadowRoot.addEventListener('input', e => { if (e.target.matches('[data-title]')) this._title = e.target.value; });
    this.shadowRoot.addEventListener('time-change', e => { this[e.target.dataset.time === 'from' ? '_from' : '_to'] = e.detail.value; this._updateTrack(); });
  }
  _tr(key, params = {}) { return translate(this._language, key, params); }
  _msg(key, params = {}) { return { key, params }; }
  set _message(value) { this._messageValue = value; }
  get _message() { const value = this._messageValue; return value?.key ? this._tr(value.key, value.params) : value || ''; }
  _errorMessage(error, fallback) { return IRRIGATION_TRANSLATIONS.en[error.code] ? this._msg(error.code, error.params) : error.message || this._msg(fallback); }
  _entryError(entry) { return entry.error_code ? this._tr(entry.error_code, entry.error_params) : entry.error; }
  _statusText(sensor) {
    const attributes = sensor?.attributes;
    if (!attributes?.status_code || !IRRIGATION_TRANSLATIONS.en[attributes.status_code]) return sensor?.state || this._tr('no_status');
    const params = { ...attributes.status_params };
    if (attributes.status_code === 'status_error' && Array.isArray(attributes.error_details)) params.errors = attributes.error_details.map(issue => this._tr(issue.code, issue.params)).join(' · ');
    return this._tr(attributes.status_code, params);
  }
  _ws(request) { return this._hass.callWS(request.type.startsWith('irrigation_schedule/') ? { ...request, language: this._language || 'en' } : request); }
  setConfig(config) {
    if (config.entry_id != null && typeof config.entry_id !== 'string') throw new ScheduleError('error_entry_id');
    const signature = canonical(config);
    if (this._configSignature === signature) return;
    const initialValves = config.valves == null ? null : normalizeValves(config.valves);
    this._configSignature = signature;
    this._catalogSignature = undefined;
    this._config = { title: null, master_entity: 'switch.irrigation_automation', status_entity: 'sensor.irrigation_status', ...config };
    this._initialValves = initialValves;
    this._valves = this._initialValves || []; this._configApplied = false; this._integrationId = config.entry_id;
    this._catalogReady = false; this._ready = false; this._resetDraft();
    if (this.isConnected) { this._render(); this.refresh(); }
  }
  set hass(value) {
    const language = languageCode(value?.locale?.language || value?.language);
    const languageChanged = this._language != null && this._language !== language;
    this._language = language;
    this._hass = value;
    if (languageChanged && this.isConnected) {
      const active = this.shadowRoot.activeElement;
      const titleFocused = active?.matches('[data-title]');
      const selection = titleFocused ? [active.selectionStart, active.selectionEnd] : null;
      this._render();
      if (titleFocused) { const title = this.shadowRoot.querySelector('[data-title]'); title.focus(); title.setSelectionRange(...selection); }
    }
    this._theme();
    this._updateStatus();
    this._subscribeSchedules();
    const catalog = value?.states?.[this._config?.status_entity]?.attributes?.configured_valves;
    if (Array.isArray(catalog)) {
      const signature = canonical(catalog);
      if (this._catalogSignature !== undefined && this._catalogSignature !== signature && this._ready) this._queueRefresh();
      this._catalogSignature = signature;
    }
    if (!this._ready && !this._loading && !this._busy) this.refresh();
  }
  get hass() { return this._hass; }
  getCardSize() { return this._formOpen ? 12 : 7; }
  connectedCallback() {
    if (!this.shadowRoot.querySelector('.heading')) this._render();
    this._subscribeSchedules();
    this.refresh(!this._ready);
  }
  disconnectedCallback() {
    clearTimeout(this._changeTimer);
    this._changeTimer = null;
    this._stopSubscription();
  }
  _stopSubscription() {
    const subscription = this._subscription;
    this._subscription = null;
    if (subscription?.onReady) subscription.connection.removeEventListener?.('ready', subscription.onReady);
    if (subscription?.unsubscribe) this._unsubscribe(subscription.unsubscribe);
  }
  _unsubscribe(unsubscribe) {
    try { Promise.resolve(unsubscribe()).catch(() => {}); } catch {}
  }
  _subscribeSchedules() {
    const connection = this._hass?.connection;
    if (!this.isConnected || !connection?.subscribeMessage || this._subscription?.connection === connection) return;
    this._stopSubscription();
    const subscription = this._subscription = { connection };
    subscription.onReady = () => {
      if (this._subscription !== subscription || !this.isConnected) return;
      if (subscription.failed) { this._stopSubscription(); this._subscribeSchedules(); }
      // Covers changes made offline, including deletion of all managed helpers.
      this._queueRefresh();
    };
    connection.addEventListener?.('ready', subscription.onReady);
    // HA resubscribes automatically on reconnect and sends a fresh collection snapshot.
    Promise.resolve().then(() => connection.subscribeMessage(changes => {
      if (this._subscription !== subscription || !this.isConnected) return;
      if (changes.some(change => isManagedSchedule(change.item || {}) || this._entries.some(entry => entry.schedule.id === change.schedule_id))) this._queueRefresh();
    }, { type: 'schedule/subscribe' })).then(unsubscribe => {
      if (this._subscription === subscription && this.isConnected) subscription.unsubscribe = unsubscribe;
      else this._unsubscribe(unsubscribe);
    }).catch(() => {
      if (this._subscription !== subscription) return;
      subscription.failed = true;
      this._message = this._msg('error_subscription');
      this._error = true; this._renderMessage();
    });
  }
  _queueRefresh() {
    this._refreshQueued = true;
    this._flushQueuedRefresh();
  }
  _flushQueuedRefresh() {
    if (!this._refreshQueued || this._changeTimer || !this.isConnected || !this._hass || this._loading || this._busy) return;
    this._changeTimer = setTimeout(() => {
      this._changeTimer = null;
      if (this._loading || this._busy || !this.isConnected) return;
      this._refreshQueued = false;
      this.refresh(false);
    }, 50);
  }
  _theme() {
    const dark = this._hass?.themes?.darkMode !== false;
    if (this._lastDark === dark) return;
    this._lastDark = dark;
    const vars = { 'ir-panel': dark ? 'rgba(31,34,53,.64)' : 'rgba(255,255,255,.48)', 'ir-field': dark ? 'rgba(194,195,213,.16)' : 'rgba(35,32,64,.07)', 'ir-line': dark ? 'rgba(255,255,255,.07)' : 'rgba(35,32,64,.05)', 'ir-green': dark ? '#6adca2' : '#287e53', 'ir-green-soft': dark ? 'rgba(106,220,162,.12)' : 'rgba(40,126,83,.10)', 'ir-green-line': dark ? 'rgba(106,220,162,.22)' : 'rgba(40,126,83,.17)', 'ir-error': 'var(--error-color,#d96276)' };
    for (const [key, val] of Object.entries(vars)) this.style.setProperty('--' + key, val);
  }
  _resetDraft() {
    this._formOpen = false; this._editing = null; this._title = ''; this._days = new Set(DAYS); this._zones = new Set(this._valves?.length ? [this._valves[0].entity] : []); this._from = '12:00'; this._to = '13:00';
  }
  async _read(syncCatalog = false) {
    await this._loadIntegration(syncCatalog);
    const [schedules, registry] = await Promise.all([this._ws({ type: 'schedule/list' }), this._ws({ type: 'config/entity_registry/list' })]);
        return schedules.filter(s => isManagedSchedule(s) && !isCatalogSchedule(s)).map(schedule => {
      const entries = listEntries(schedule);
      const record = registry.find(r => r.platform === 'schedule' && r.unique_id === schedule.id && r.entity_id.startsWith('schedule.'));
      const entry = entries.length === 1 ? entries[0] : null;
      const unmanaged = DAYS.some(d => (schedule[d] || []).some(b => decodeEntry(b.data)?.id !== entry?.id));
      const error_code = !record ? 'error_no_registry' : record.disabled_by ? 'error_disabled_schedule' : !isManagedEntity(record.entity_id) ? 'error_schedule_id' : entries.length !== 1 || unmanaged ? 'error_helper' : entry.error_code;
      const error_params = entry?.error_params;
      const error = error_code ? translate('en', error_code, error_params) : entry?.error;
      return { schedule, entry, entityId: record?.entity_id, error, error_code, error_params, fingerprint: weekFingerprint(schedule) };
    });
  }
  _valveName(id) { return this._valves.find(v=>v.entity === id)?.name || id; }
  async _loadIntegration(applyYaml = false) {
    const request = {type:'irrigation_schedule/config', ...(this._integrationId ? {entry_id:this._integrationId} : {})};
    let settings = await this._ws(request);
    if (applyYaml && !this._configApplied && this._initialValves && canonical(this._initialValves) !== canonical(settings.valves)) {
      if (!this._hass.user?.is_admin) throw new ScheduleError('error_yaml_admin');
      await this._ws({type:'irrigation_schedule/configure_valves',entry_id:settings.entry_id,valves:this._initialValves});
      settings = await this._ws(request);
    }
    if (applyYaml) this._configApplied = true;
    const changed = canonical(this._valves) !== canonical(settings.valves);
    this._valves = normalizeValves(settings.valves);
    this._integrationId = settings.entry_id;
    this._config.master_entity = settings.master_entity;
    this._config.status_entity = settings.status_entity;
    if (!this._formOpen && !this._editing) this._zones = new Set([this._valves[0].entity]);
    this._catalogReady = true;
    if (changed) this._render();
  }
  async refresh(showMessage = true) {
    if (!this._hass || !this.isConnected || this._loading || this._busy) return;
    this._loading = true; this._controls();
    this._refreshPromise = (async () => {
      try {
        this._entries = await this._read(true); this._ready = true;
        if (showMessage) { this._message = this._msg(this._hass.user?.is_admin ? 'select_edit' : 'read_only'); this._error = false; }
        this._renderEntries();
      } catch (e) { this._catalogReady = false; this._message = this._errorMessage(e, 'error_read'); this._error = true; }
      finally { this._loading = false; this._controls(); this._renderMessage(); }
    })();
    try { await this._refreshPromise; }
    finally { this._refreshPromise = null; this._flushQueuedRefresh(); }
  }
  async _save(remove = false) {
    if (this._busy || !this._ready || (!remove && !this._catalogReady) || !this._hass.user?.is_admin) return;
    const editing = this._editing;
    if (remove && (!editing || !window.confirm(this._tr('delete_confirm', {name: editing.entry?.rule?.title || this._tr('unnamed')})))) return;
    let rule;
    try {
      if (!remove && [...this._zones].some(id=>!this._valves.some(v=>v.entity===id))) throw new ScheduleError('error_choose_catalog');
      if (!remove) rule = normalizeRule({ id: editing?.entry.rule.id || crypto.randomUUID().replaceAll('-', '').slice(0, 16), title: this._title, days: [...this._days], zones: [...this._zones], from: this._from, to: this._to });
    } catch (e) { this._message = this._errorMessage(e, 'error_save'); this._error = true; this._renderMessage(); return; }
    this._busy = true; this._message = this._msg(remove ? 'deleting' : 'saving'); this._error = false; this._controls(); this._renderMessage();
    try {
      await this._refreshPromise;
      await this._loadIntegration(false);
      if (!remove && rule.zones.some(id=>!this._valves.some(v=>v.entity===id))) throw new ScheduleError('error_catalog_changed');
      if (editing) {
        const current = (await this._read()).find(e => e.schedule.id === editing.schedule.id);
        if (!current || current.fingerprint !== editing.fingerprint || current.schedule.name !== editing.schedule.name) throw new ScheduleError('error_stale_schedule');
        if (remove) await this._ws({ type: 'schedule/delete', schedule_id: current.schedule.id });
        else {
          if (current.error) throw current.error_code ? new ScheduleError(current.error_code, current.error_params) : Error(current.error);
          const payload = updateWeek(current.schedule, { operation: 'replace', id: rule.id, fingerprint: current.entry.fingerprint, rule });
          payload.name = scheduleName(rule);
          await this._ws(payload);
        }
      } else await this._ws(createSchedule(rule));
      this._resetDraft();
      this._message = this._msg(remove ? 'deleted' : editing ? 'updated' : 'created');
      // A successful mutation must remain successful even if the subsequent read fails.
      try { this._entries = await this._read(); }
      catch { this._ready = false; this._message = this._msg('saved_refresh_failed'); }
      this._render();
    } catch (e) { this._message = this._errorMessage(e, 'error_save'); this._error = true; this._renderMessage(); }
    finally { this._busy = false; this._controls(); this._flushQueuedRefresh(); }
  }
  async _toggleMaster() {
    if (this._busy || !['on', 'off'].includes(this._hass?.states?.[this._config.master_entity]?.state)) return;
    this._busy = true; this._controls();
    try { await this._refreshPromise; await this._hass.callService('switch', this._hass.states[this._config.master_entity].state === 'on' ? 'turn_off' : 'turn_on', { entity_id: this._config.master_entity }); }
    catch (e) { this._message = this._errorMessage(e, 'error_master'); this._error = true; this._renderMessage(); }
    finally { this._busy = false; this._controls(); this._flushQueuedRefresh(); }
  }
  get _canManual() {
    const status = this._hass?.states?.[this._config.status_entity]?.attributes;
    return this._hass?.user?.is_admin && this._catalogReady && canonical(status?.configured_valves) === canonical(this._valves) && this._hass?.states?.[this._config.master_entity]?.state === 'off' && status?.mode === 'manual';
  }
  async _manualValve(number) {
    if (!this._canManual || this._busy) return;
    const ids = number ? [number] : this._valves.map(v=>v.entity);
    if (number && !ids.every(id=>this._valves.some(v=>v.entity===id))) return;
    const service = number && this._hass.states[ids[0]]?.state === 'off' ? 'turn_on' : 'turn_off';
    this._busy = true; this._controls();
    try {
      await this._refreshPromise;
      if (!this._canManual || (number && !this._valves.some(v=>v.entity===number))) throw new ScheduleError('error_manual_changed');
      await this._ws({type:'irrigation_schedule/manual',entry_id:this._integrationId,...(number ? {entity:number} : {}),enabled:service === 'turn_on'});
    }
    catch (e) { this._message = this._errorMessage(e, 'error_manual'); this._error = true; this._renderMessage(); }
    finally { this._busy = false; this._controls(); this._flushQueuedRefresh(); }
  }
  _click(e) {
    const button = e.target.closest('button');
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (this._busy || (this._loading && !this._ready)) return;
    if (button.dataset.day) { const day = button.dataset.day; this._days.has(day) ? this._days.delete(day) : this._days.add(day); }
    else if (button.dataset.zone) { const n = button.dataset.zone; this._zones.has(n) ? this._zones.delete(n) : this._zones.add(n); }
    else if (button.dataset.preset) this._days = new Set(button.dataset.preset === 'all' ? DAYS : button.dataset.preset === 'work' ? DAYS.slice(0, 5) : DAYS.slice(5));
    else if (button.dataset.edit) {
      const found = this._entries.find(e => e.schedule.id === button.dataset.edit);
      if (!found) return;
      this._editing = structuredClone(found);
      this._formOpen = true;
      const rule = found.entry?.rule;
      if (rule && !found.error) { this._title = rule.title; this._days = new Set(rule.days); this._zones = new Set(rule.zones.filter(id=>this._valves.some(v=>v.entity===id))); this._from = rule.from; this._to = rule.to; }
      const removed = rule?.zones.filter(id=>!this._valves.some(v=>v.entity === id)).length;
      this._message = found.error ? (found.error_code ? this._msg(found.error_code, found.error_params) : found.error) : this._msg(removed ? 'removed_valves_hint' : 'edit_hint'); this._error = Boolean(found.error);
      this._render(); return;
    } else if (action === 'add-form') { this._resetDraft(); this._formOpen = true; this._message = this._msg('add_hint'); this._error = false; this._render(); return; }
    else if (action === 'cancel') { this._resetDraft(); this._message = this._msg('cancelled'); this._error = false; this._render(); return; }
    else if (action === 'refresh') { this.refresh(); return; }
    else if (action === 'save') { this._save(); return; }
    else if (action === 'delete') { this._save(true); return; }
    else if (action === 'master') { this._toggleMaster(); return; }
    else if (action === 'manual') { this._manualValve(button.dataset.manual); return; }
    else if (action === 'close-all') { this._manualValve(null); return; }
    this._controls();
  }
  _controls() {
    if (!this.shadowRoot.querySelector('.body')) return;
    const locked = this._busy || (this._loading && !this._ready), readOnly = !this._hass?.user?.is_admin;
    for (const button of this.shadowRoot.querySelectorAll('button')) {
      const action = button.dataset.action;
      let disabled = Boolean(locked);
      if (action === 'save') disabled ||= readOnly || !this._ready || !this._catalogReady || Boolean(this._editing?.error);
      if (action === 'add-form') disabled ||= readOnly || !this._ready || !this._catalogReady;
      if (action === 'delete') disabled ||= readOnly || !this._editing;
      if (action === 'master') disabled ||= !['on', 'off'].includes(this._hass?.states?.[this._config.master_entity]?.state);
      if (action === 'manual') disabled ||= !this._canManual || !['on','off'].includes(this._hass?.states?.[button.dataset.manual]?.state);
      if (action === 'close-all') disabled ||= !this._canManual;
      setDisabled(button, disabled);
      if (button.dataset.day) button.classList.toggle('selected', this._days.has(button.dataset.day));
      if (button.dataset.zone) button.classList.toggle('selected', this._zones.has(button.dataset.zone));
      if (button.dataset.day || button.dataset.zone) setAttr(button, 'aria-pressed', button.classList.contains('selected'));
    }
    for (const picker of this.shadowRoot.querySelectorAll('irrigation-integration-time-picker')) setDisabled(picker, locked || this._editing?.error);
    setDisabled(this.shadowRoot.querySelector('[data-title]'), locked || this._editing?.error);
    this._updateStatus();
  }
  _updateStatus() {
    if (!this._config || !this.shadowRoot.querySelector('.heading')) return;
    const states = this._hass?.states || {}, master = states[this._config.master_entity]?.state;
    const opened = this._valves.map(v=>v.entity).filter(id => states[id]?.state === 'on');
    setText(this.shadowRoot.querySelector('.heading .badge'), opened.length ? this._tr('watering_badge', {count: opened.length}) : master === 'on' ? this._tr('waiting') : master === 'off' ? this._tr('disabled') : this._tr('no_switch'));
    const control = this.shadowRoot.querySelector('[data-action=master]');
    setText(control, master === 'on' ? this._tr('on') : master === 'off' ? this._tr('off') : this._tr('unavailable'));
    control.classList.toggle('selected', master === 'on');
    setAttr(control, 'aria-pressed', master === 'on');
    setDisabled(control, this._busy || (this._loading && !this._ready) || !['on','off'].includes(master));
    setText(this.shadowRoot.querySelector('[data-opened]'), opened.length ? this._tr('opened', {names: opened.map(id=>this._valveName(id)).join(', ')}) : this._tr('closed_or_unknown'));
    const sensor = states[this._config.status_entity];
    setText(this.shadowRoot.querySelector('[data-sensor]'), sensor && !['unknown','unavailable'].includes(sensor.state) ? this._statusText(sensor) : this._tr('no_status'));
    const manual = this.shadowRoot.querySelector('.manual-section');
    if (manual.hidden !== (master !== 'off')) manual.hidden = master !== 'off';
    setText(this.shadowRoot.querySelector('[data-manual-hint]'), this._canManual ? this._tr('manual_hint') : master === 'on' ? this._tr('disable_manual_hint') : this._tr('wait_manual_hint'));
    for (const button of this.shadowRoot.querySelectorAll('[data-manual]')) {
      const state = states[button.dataset.manual]?.state;
      setText(button.querySelector('small'), state === 'on' ? this._tr('valve_on') : state === 'off' ? this._tr('valve_off') : this._tr('no_reading'));
      setAttr(button, 'data-state', state || 'unknown');
      setAttr(button, 'title', this._valveName(button.dataset.manual) + ' · ' + button.querySelector('small').textContent);
      button.classList.toggle('selected', state === 'on'); setAttr(button, 'aria-pressed', state === 'on');
      setDisabled(button, this._busy || (this._loading && !this._ready) || !this._canManual || !['on','off'].includes(state));
    }
    setDisabled(this.shadowRoot.querySelector('[data-action=close-all]'), this._busy || (this._loading && !this._ready) || !this._canManual);
    for (const row of this.shadowRoot.querySelectorAll('[data-edit]')) {
      const entry = this._entries.find(e => e.schedule.id === row.dataset.edit), state = states[entry?.entityId]?.state;
      row.classList.toggle('active', state === 'on');
      setText(row.querySelector('.badge'), entry?.error ? this._tr('error') : state === 'on' ? master === 'on' ? this._tr('active') : this._tr('blocked') : state === 'off' ? this._tr('waiting') : this._tr('schedule_unavailable'));
    }
  }
  _renderEntries() {
    const container = this.shadowRoot.querySelector('.entries');
    if (!container) return;
    const markup = this._entries.length ? this._entries.map(e => {
      const rule = e.entry?.rule;
      const days = rule?.days.map(d => this._tr('days')[DAYS.indexOf(d)]).join(', ') || '';
      return `<button class="entry ${this._editing?.schedule.id === e.schedule.id ? 'selected' : ''}" data-edit="${esc(e.schedule.id)}" aria-label="${esc(this._tr('edit_schedule', {name: rule?.title || days || e.schedule.name}))}"><span class="entry-title"><span>${esc(rule?.title || this._tr('schedule'))}</span><span class="badge"></span></span>${rule ? `<span>${esc(days)} · ${esc(rule.from)}–${esc(rule.to)}</span><small>${esc(this._tr('valves', {names: rule.zones.map(id=>this._valveName(id)).join(', ')}))}${seconds(rule.to, true) < seconds(rule.from) ? this._tr('next_day_suffix') : ''}</small>` : ''}${e.error ? `<small class="danger">${esc(this._entryError(e))}</small>` : ''}</button>`;
    }).join('') : `<div class="hint">${esc(this._tr('empty'))}</div>`;
    if (container._irrigationMarkup !== markup) {
      container.innerHTML = markup;
      container._irrigationMarkup = markup;
    }
    this._controls();
  }
  _updateTrack() {
    const track = this.shadowRoot.querySelector('.track');
    if (!track) return;
    try {
      const a = seconds(this._from), b = seconds(this._to, true);
      track.innerHTML = (a < b ? [[a, b]] : a > b ? [[0, b], [a, 86400]] : []).map(([from, to]) => `<span class="range" style="left:${from / 864}%;width:${(to - from) / 864}%"></span>`).join('');
      this.shadowRoot.querySelector('[data-overnight]').textContent = a > b ? this._tr('overnight_hint') : this._tr('all_days_hint');
    } catch { track.innerHTML = ''; }
  }
  _renderMessage() { const el = this.shadowRoot.querySelector('.message'); if (el) { setText(el, this._message); el.classList.toggle('error', Boolean(this._error)); } }
  _render() {
    if (!this._config) return;
    this.shadowRoot.innerHTML = `<style>${CSS}</style><ha-card>
      <div class="heading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg><strong>${esc(this._config.title ?? this._tr('title'))}</strong><span class="badge"></span></div>
      <div class="body" id="irrigation-body">
        <div><div class="toolbar"><label>${esc(this._tr('automation'))}</label><button data-action="master" aria-label="${esc(this._tr('automation'))}"></button></div><div class="hint" data-opened></div><div class="sensor-status" data-sensor role="status" aria-live="polite"></div></div>
        <div class="manual-section" hidden><div class="toolbar"><span class="caption">${esc(this._tr('manual_title'))}</span><button data-action="close-all">${esc(this._tr('close_all'))}</button></div><div class="hint" data-manual-hint></div><div class="manual-grid">${this._valves.map(v => `<button data-action="manual" data-manual="${esc(v.entity)}" aria-label="${esc(this._tr('control_valve', {name: v.name}))}"><span class="manual-name">${esc(v.name)}</span><span class="manual-indicator" aria-hidden="true"></span><small></small></button>`).join('')}</div></div>
        <div><div class="toolbar schedule-toolbar"><span class="caption">${esc(this._tr('saved_schedules'))}</span><button data-action="refresh">${esc(this._tr('refresh'))}</button></div><div class="entries"></div></div>
        <button class="primary wide add-schedule" data-action="add-form" aria-expanded="${this._formOpen}" aria-controls="schedule-form" ${this._formOpen ? 'hidden' : ''}>${esc(this._tr('add'))}</button>
        <div class="schedule-form" id="schedule-form" ${this._formOpen ? '' : 'hidden'}>
        <div class="section-line"><div class="editing">${this._editing ? this._tr('editing') : this._tr('new')}</div><label for="ir-title">${esc(this._tr('schedule_name'))}</label><input id="ir-title" data-title type="text" maxlength="80" placeholder="${esc(this._tr('name_example'))}" value="${esc(this._title)}"></div>
        <div><div class="caption">${esc(this._tr('start_days'))}</div><div class="presets"><button data-preset="all">${esc(this._tr('everyday'))}</button><button data-preset="work">${esc(this._tr('weekdays'))}</button><button data-preset="weekend">${esc(this._tr('weekends'))}</button></div><div class="days">${DAYS.map((d, i) => `<button data-day="${d}">${this._tr('days')[i]}</button>`).join('')}</div></div>
        <div><div class="caption">${esc(this._tr('window'))}</div><div class="times"><irrigation-integration-time-picker data-time="from" language="${this._language || 'en'}" caption="${esc(this._tr('from'))}" label="${esc(this._tr('start_time'))}" value="${esc(this._from)}"></irrigation-integration-time-picker><irrigation-integration-time-picker data-time="to" language="${this._language || 'en'}" end caption="${esc(this._tr('to'))}" label="${esc(this._tr('end_time'))}" value="${esc(this._to)}"></irrigation-integration-time-picker></div><div class="hint" style="margin-top:7px">${esc(this._tr('time_hint'))}</div></div>
        <div><div class="caption">${esc(this._tr('schedule_valves'))}</div><div class="zones">${this._valves.map(v => `<button data-zone="${esc(v.entity)}" aria-label="${esc(this._tr('valve', {name: v.name}))}">${esc(v.name)}</button>`).join('')}</div><div class="hint" style="margin-top:7px">${esc(this._tr('overlap_hint'))}</div></div>
        <div><div class="track"></div><div class="ticks"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div><div class="hint" data-overnight style="margin-top:7px"></div></div>
        <div class="actions"><button class="primary" data-action="save">${this._editing ? this._tr('save') : this._tr('add')}</button><button data-action="cancel">${esc(this._tr('cancel'))}</button></div>
        ${this._editing ? `<div class="section-line"><button class="danger wide" data-action="delete">${esc(this._tr('delete'))}</button></div>` : ''}
        </div>
        <div class="message" role="status" aria-live="polite"></div>
      </div></ha-card>`;
    this._theme(); this._renderEntries(); this._updateTrack(); this._renderMessage(); this._controls();
  }
}
if (globalThis.customElements && !customElements.get('irrigation-schedule-integration-card')) customElements.define('irrigation-schedule-integration-card', IrrigationIntegrationCard);
if (globalThis.window) { window.customCards ||= []; window.customCards.push({ type: 'irrigation-schedule-integration-card', name: 'Irrigation', description: 'Whole schedules with days, times and valves. Language follows Home Assistant.' }); }
