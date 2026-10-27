// The bootstrap can be loaded by frontend extras, Lovelace or a manual resource.
(() => {
  const tag = 'irrigation-schedule-integration-card';
  const bundle = "/irrigation_schedule/0.3.3/irrigation-schedule-card.js";
  const key = Symbol.for(`irrigation_schedule.card_loader:${bundle}`);
  if (globalThis[key]) { globalThis[key].start(); return; }
  let pending = null, requests = 0, complete = false;
  const start = () => {
    if (complete || customElements.get(tag)) {
      complete = true;
      return Promise.resolve();
    }
    if (pending) return pending;
    // Retrying a failed import needs a new URL because browsers cache module errors.
    pending = (async () => {
      for (const delay of [0, 250, 1000, 3000, 8000]) {
        if (delay) await new Promise(resolve => setTimeout(resolve, delay));
        if (customElements.get(tag)) { complete = true; return; }
        const url = new URL(bundle, window.location.href);
        if (requests++) url.searchParams.set('retry', `${Date.now()}-${requests}`);
        try {
          await import(url.href);
          if (!customElements.get(tag)) throw new Error('The Irrigation module did not register its card.');
          complete = true;
          return;
        } catch (error) {
          if (delay === 8000) console.error('Irrigation: could not load the dashboard card. Loading will resume when the connection or page visibility changes.', error);
        }
      }
    })().finally(() => {
      pending = null;
      if (complete) {
        window.removeEventListener('online', start);
        window.removeEventListener('connection-status', reconnect);
        document.removeEventListener('visibilitychange', visible);
      }
    });
    return pending;
  };
  const reconnect = event => { if (event.detail === 'connected') start(); };
  const visible = () => { if (document.visibilityState === 'visible') start(); };
  globalThis[key] = {start};
  window.addEventListener('online', start);
  window.addEventListener('connection-status', reconnect);
  document.addEventListener('visibilitychange', visible);
  start();
})();
