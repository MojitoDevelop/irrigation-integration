// Independent time wheels reused from the EV editor.
class IrrigationIntegrationTimePicker extends ElementBase {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._timers = /* @__PURE__ */ new Map();
    this._disabled = false;
    this.shadowRoot.addEventListener("input", (event) => {
      const part = event.target.dataset.part;
      if (!part) return;
      const value = event.target.value.trim();
      if (/^\d{1,2}:\d{2}$/.test(value)) {
        this._parts = value.split(":");
        this._sync();
      } else this._parts[part === "hour" ? 0 : 1] = value;
      this._emit();
    });
    this.shadowRoot.addEventListener("focusin", (event) => {
      if (event.target.matches("input")) {
        clearTimeout(this._timers.get(event.target.closest(".wheel")));
        event.target.select();
      }
    });
    this.shadowRoot.addEventListener("focusout", (event) => {
      if (event.target.matches("input")) this._commit();
    });
    this.shadowRoot.addEventListener("keydown", (event) => {
      if (!event.target.matches("input")) return;
      if (event.key === "Enter") event.target.blur();
      if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const wheel = event.target.closest(".wheel");
      this._choose(wheel, this._index(wheel) + (event.key === "ArrowUp" ? 1 : -1));
    });
    this.addEventListener("wheel", (event) => {
      const wheel = event.composedPath().find(element => element?.classList?.contains("wheel") && element.getRootNode() === this.shadowRoot);
      if (!wheel || this._disabled || !event.deltaY) return;
      event.preventDefault();
      this.shadowRoot.activeElement?.blur();
      // Use the selected value rather than a scroll position that can still be
      // snapping after the form has just become visible.
      clearTimeout(this._timers.get(wheel));
      const index = wheel.dataset.part === "hour" ? 0 : 1;
      const current = Number(this._parts[index]);
      const step = Math.max(-3, Math.min(3, Math.round(event.deltaY / ROW_HEIGHT) || Math.sign(event.deltaY)));
      this._choose(wheel, (Number.isFinite(current) ? current : this._index(wheel)) + step);
    }, { passive: false });
    this.shadowRoot.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch" || this._disabled) return;
      const wheel = event.target.closest(".wheel");
      if (!wheel) return;
      this._drag = { wheel, id: event.pointerId, y: event.clientY, top: wheel.querySelector(".list").scrollTop, moved: false };
    });
    this.shadowRoot.addEventListener("pointermove", (event) => {
      const drag = this._drag;
      if (!drag || drag.id !== event.pointerId) return;
      const delta = drag.y - event.clientY;
      if (!drag.moved && Math.abs(delta) < 6) return;
      if (!drag.moved) {
        drag.moved = true;
        drag.wheel.setPointerCapture(event.pointerId);
        drag.wheel.classList.add("dragging");
        this.shadowRoot.activeElement?.blur();
      }
      event.preventDefault();
      drag.wheel.querySelector(".list").scrollTop = drag.top + delta;
    });
    const finishDrag = () => {
      const drag = this._drag;
      this._drag = null;
      if (!drag?.moved) return;
      drag.wheel.classList.remove("dragging");
      this._choose(drag.wheel, this._index(drag.wheel));
    };
    this.shadowRoot.addEventListener("pointerup", finishDrag);
    this.shadowRoot.addEventListener("pointercancel", finishDrag);
    this.shadowRoot.addEventListener("click", (event) => {
      const option = event.target.closest(".option");
      if (option && !this._disabled) this._choose(option.closest(".wheel"), Number(option.dataset.value));
    });
  }
  connectedCallback() {
    this._parts = (this.getAttribute("value") || "00:00").split(":").slice(0, 2);
    this._end = this.hasAttribute("end");
    const language = languageCode(this.getAttribute("language"));
    const label = this.getAttribute("label") || translate(language, "time");
    this.shadowRoot.innerHTML = `<style>
      :host{display:block;min-width:0}*{box-sizing:border-box}
      .field{padding:10px;border-radius:12px;background:var(--ir-field)}
      .caption{font:12px var(--paper-font-body1_-_font-family,Roboto,Arial,sans-serif);color:var(--secondary-text-color);margin:0 0 5px}
      .columns{display:grid;grid-template-columns:minmax(0,1fr) 12px minmax(0,1fr);align-items:center;gap:2px}
      .colon{font-size:20px;text-align:center;color:var(--secondary-text-color)}
      .wheel{height:108px;position:relative;min-width:0;touch-action:none;isolation:isolate}
      .list{height:100%;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;scroll-snap-type:y mandatory;padding:36px 0;mask-image:linear-gradient(to bottom,transparent 0,#000 24px,#000 35px,transparent 36px,transparent 72px,#000 73px,#000 84px,transparent 108px);-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 24px,#000 35px,transparent 36px,transparent 72px,#000 73px,#000 84px,transparent 108px)}
      .list::-webkit-scrollbar{display:none}.dragging .list{scroll-snap-type:none}
      .option{height:36px;min-height:36px;line-height:1;display:flex;align-items:center;justify-content:center;scroll-snap-align:center;font-size:18px;font-variant-numeric:tabular-nums;color:var(--secondary-text-color);cursor:pointer;user-select:none}
      .option.active{visibility:hidden}
      input{position:absolute;z-index:1;top:36px;left:0;width:100%;height:36px;padding:0;border:1px solid var(--ir-green-line);border-radius:8px;background:var(--ir-green-soft);color:var(--primary-text-color);font:500 22px/34px var(--paper-font-body1_-_font-family,Roboto,Arial,sans-serif);font-variant-numeric:tabular-nums;text-align:center;min-width:0;touch-action:none}
      input:focus{outline:2px solid var(--ir-green);outline-offset:0}input[aria-invalid=true]{border-color:var(--ir-error)}
      :host([disabled]){opacity:.45}input:disabled{cursor:default}
      @media(max-width:380px){.field{padding:8px}.option{font-size:16px}input{font-size:20px}}
    </style><div class="field"><div class="caption">${esc(this.getAttribute("caption") || label)}</div><div class="columns">${["hour", "minute"].map((part, index) => `${index ? '<span class="colon" aria-hidden="true">:</span>' : ""}<div class="wheel" data-part="${part}"><div class="list" aria-hidden="true">${Array.from({ length: part === "hour" ? this._end ? 25 : 24 : 60 }, (_, n) => `<div class="option" data-value="${n}">${String(n).padStart(2, "0")}</div>`).join("")}</div><input type="text" inputmode="numeric" maxlength="5" autocomplete="off" spellcheck="false" data-part="${part}" role="spinbutton" aria-label="${esc(label)} — ${translate(language, part === "hour" ? "hours" : "minutes")}" aria-valuemin="0" aria-valuemax="${part === "hour" ? this._end ? 24 : 23 : 59}"></div>`).join("")}</div></div>`;
    for (const wheel of this.shadowRoot.querySelectorAll(".wheel")) {
      wheel.querySelector(".list").addEventListener("scroll", () => {
        if (this._syncing || this._disabled || !this.getClientRects().length) return;
        this._select(wheel, this._index(wheel));
        if (!this._drag?.moved) this._settle(wheel);
      });
    }
    this._sync();
    this.disabled = this._disabled;
  }
  disconnectedCallback() {
    this._pause();
  }
  _pause() {
    for (const timer of this._timers.values()) clearTimeout(timer);
    cancelAnimationFrame(this._frame);
    this._syncing = true;
    this._drag = null;
    for (const wheel of this.shadowRoot.querySelectorAll(".wheel")) wheel.classList.remove("dragging");
  }
  get value() {
    return this._parts.join(":");
  }
  set disabled(value) {
    this._disabled = Boolean(value);
    this.toggleAttribute("disabled", this._disabled);
    for (const input of this.shadowRoot.querySelectorAll("input")) input.disabled = this._disabled;
  }
  get disabled() {
    return this._disabled;
  }
  _index(wheel) {
    return Math.round(wheel.querySelector(".list").scrollTop / ROW_HEIGHT);
  }
  _select(wheel, value) {
    const part = wheel.dataset.part, index = part === "hour" ? 0 : 1;
    const max = part === "hour" ? this._end ? 24 : 23 : 59;
    value = Math.max(0, Math.min(max, value));
    if (part === "minute" && Number(this._parts[0]) === 24) value = 0;
    const formatted = String(value).padStart(2, "0");
    const changed = this._parts[index] !== formatted;
    this._parts[index] = formatted;
    const input = wheel.querySelector("input");
    input.value = formatted;
    input.setAttribute("aria-valuenow", value);
    input.setAttribute("aria-invalid", "false");
    for (const option of wheel.querySelectorAll(".option")) option.classList.toggle("active", Number(option.dataset.value) === value);
    if (part === "hour" && value === 24) {
      this._parts[1] = "00";
      this._sync();
    }
    if (changed) this._emit();
  }
  _choose(wheel, value) {
    if (this._disabled) return;
    this._select(wheel, value);
    wheel.querySelector(".list").scrollTop = Number(this._parts[wheel.dataset.part === "hour" ? 0 : 1]) * ROW_HEIGHT;
  }
  _settle(wheel) {
    clearTimeout(this._timers.get(wheel));
    this._timers.set(wheel, setTimeout(() => this._choose(wheel, this._index(wheel)), 140));
  }
  _sync() {
    this._syncing = true;
    for (const timer of this._timers.values()) clearTimeout(timer);
    cancelAnimationFrame(this._frame);
    for (const wheel of this.shadowRoot.querySelectorAll(".wheel")) {
      const part = wheel.dataset.part, value = this._parts[part === "hour" ? 0 : 1];
      const valid = /^\d{1,2}$/.test(value) && Number(value) <= (part === "hour" ? this._end ? 24 : 23 : 59);
      const input = wheel.querySelector("input");
      input.value = value;
      input.setAttribute("aria-invalid", String(!valid));
      if (valid) {
        input.setAttribute("aria-valuenow", Number(value));
        wheel.querySelector(".list").scrollTop = Number(value) * ROW_HEIGHT;
      } else input.removeAttribute("aria-valuenow");
      for (const option of wheel.querySelectorAll(".option")) option.classList.toggle("active", valid && Number(option.dataset.value) === Number(value));
    }
    this._frame = requestAnimationFrame(() => {
      this._syncing = false;
    });
  }
  _commit() {
    try {
      const raw = this._parts.map((part) => /^\d{1,2}$/.test(part) ? part.padStart(2, "0") : part).join(":");
      this._parts = time(seconds(raw, this._end)).slice(0, 5).split(":");
      this._sync();
      this._emit();
    } catch {
      for (const input of this.shadowRoot.querySelectorAll("input")) input.setAttribute("aria-invalid", "true");
    }
  }
  _emit() {
    this.dispatchEvent(new CustomEvent("time-change", { bubbles: true, composed: true, detail: { value: this.value } }));
  }
}
