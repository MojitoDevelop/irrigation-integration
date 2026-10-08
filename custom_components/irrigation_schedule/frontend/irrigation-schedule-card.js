const INTEGRATION_CARD_VERSION = "0.2.0";
const IRRIGATION_TRANSLATIONS = {"en": {"title": "Irrigation", "automation": "Irrigation automation", "manual_title": "Manual valve control", "close_all": "Close all", "saved_schedules": "Saved schedules", "refresh": "Refresh", "add": "Add schedule", "editing": "Edit entire schedule", "new": "New schedule", "schedule_name": "Schedule name", "name_example": "E.g. Morning lawn", "start_days": "Watering start days", "everyday": "Every day", "weekdays": "Weekdays", "weekends": "Weekends", "window": "Watering window", "from": "From", "to": "To", "start_time": "Watering start", "end_time": "Watering end", "time": "Time", "hours": "hours", "minutes": "minutes", "time_hint": "Swipe hours and minutes or tap a number to type.", "schedule_valves": "Valves in this schedule", "overlap_hint": "A valve can belong to several overlapping schedules.", "save": "Save entire schedule", "cancel": "Cancel", "delete": "Delete entire schedule", "edit_schedule": "Edit schedule {name}", "control_valve": "Control valve {name}", "valve": "Valve {name}", "schedule": "Schedule", "valves": "Valves: {names}", "next_day_suffix": " · ends the next day", "overnight_hint": "Selected days are start days. Ends the next day.", "all_days_hint": "Time changes apply to all selected days.", "empty": "No saved schedules. Click Add schedule to create the first one.", "watering_badge": "Watering · {count}", "waiting": "Waiting", "disabled": "Disabled", "no_switch": "Switch missing", "on": "On", "off": "Off", "unavailable": "Unavailable", "opened": "Open valves: {names}", "closed_or_unknown": "Valves are closed or their state is unavailable.", "no_status": "Status unavailable — check the Irrigation integration.", "manual_hint": "Manual mode · tap a valve to turn it on or off.", "disable_manual_hint": "Disable automation to control valves manually.", "wait_manual_hint": "Manual control becomes available after HA confirms all valves are closed.", "valve_on": "On", "valve_off": "Off", "no_reading": "No reading", "error": "Error", "active": "Active", "blocked": "Blocked", "schedule_unavailable": "Unavailable", "reading": "Reading schedules…", "select_edit": "Tap a schedule to edit all its days and valves.", "read_only": "View only · an HA administrator account is required to save.", "saving": "Saving entire schedule…", "deleting": "Deleting schedule…", "deleted": "Deleted the entire schedule and its entity.", "updated": "Changed the entire schedule for all selected days.", "created": "Added a schedule and created its Schedule entity.", "saved_refresh_failed": "Saved successfully. Click Refresh to reload the list.", "delete_confirm": "Delete the entire schedule “{name}”?\n\nIts Schedule entity and all days will be removed.", "unnamed": "unnamed", "edit_hint": "You are editing the entire schedule: all days, times and valves.", "removed_valves_hint": "Removed valves will be removed from this schedule when saved. Select valves and save the entire schedule.", "add_hint": "Select days, times and valves for the new schedule.", "cancelled": "Cancelled changes in the form.", "error_entry_id": "entry_id must be a string.", "error_subscription": "Schedule notifications are unavailable. Use Refresh or reopen the dashboard.", "error_no_registry": "Schedule entity is missing from the HA registry.", "error_disabled_schedule": "Schedule entity is disabled in HA.", "error_schedule_id": "Use an entity ID starting with schedule.irrigation_ or the legacy schedule.nawodnienie_.", "error_helper": "This helper does not contain one complete entry created by the card.", "error_yaml_admin": "An administrator must save the YAML valve list to the integration.", "error_read": "Could not read schedules.", "error_choose_catalog": "Select valves from the current list.", "error_catalog_changed": "The valve list changed in the integration. Refresh and select valves again.", "error_stale_schedule": "The schedule changed. Refresh and select it again.", "error_save": "Could not save the schedule.", "error_master": "Could not change the automation switch.", "error_manual_changed": "Valve configuration or control mode changed. Try again.", "error_manual": "Could not switch the valve.", "error_time": "Enter a time as HH:MM (minute precision).", "error_time_range": "Time is out of range.", "error_rule_id": "Missing entry ID.", "error_days": "Select at least one day.", "error_valves": "Select at least one valve.", "error_switch": "Valves must be switch entities.", "error_equal_times": "Start and end times must differ.", "error_name": "Name must contain at most 80 characters.", "error_reserved": "This name is reserved for automation configuration.", "error_version": "Unsupported entry version.", "error_valve_data": "Valve data is inconsistent.", "error_zone_data": "Zone data is inconsistent.", "error_parts": "Entry fragments are inconsistent. Fix the helper in HA or delete the entire entry.", "error_operation": "Unknown operation.", "error_stale_clear": "The schedule changed. Refresh it before clearing.", "error_stale_entry": "This entry changed. Refresh and select it again.", "error_change_id": "Entry ID cannot be changed.", "error_duplicate_id": "This entry ID already exists.", "error_overlap": "Time window overlaps another entry: {day}.", "error_catalog_empty": "Add at least one valve to valves.", "error_entity": "Each valve needs a valid entity: switch.…", "error_valve_name": "Valve name must contain 1–80 characters.", "error_duplicate_valves": "Valve entities must be distinct.", "error_automation_valve": "The automation switch cannot be a valve.", "error_not_ready": "The irrigation integration is not running.", "error_manual_mode": "Disable automation and wait until the valves are closed.", "error_unknown_valve": "This valve is not part of the irrigation configuration.", "error_open_one": "Select one valve to open.", "error_timeout": "Timed out waiting for the valve action.", "issue_valve": "Unavailable valve: {name}", "issue_schedule": "Unavailable schedule: {name}", "issue_data": "Invalid data or removed valve in schedule: {name}", "issue_open": "Opening not confirmed: {name}", "issue_close": "Closing not confirmed: {name}", "status_error": "Error: {errors}", "status_starting": "Starting automation", "status_manual_open": "Manual mode · valves: {valves}", "status_manual_closed": "Manual mode · valves closed", "status_stopping": "Disabling automation · closing valves", "status_setting": "Setting valves · {schedules}", "status_watering": "Watering: {schedules} · valves: {valves}", "status_waiting": "Automation enabled · waiting for a schedule", "days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}, "pl": {"title": "Nawodnienie", "automation": "Automatyka nawodnienia", "manual_title": "Ręczne sterowanie zaworami", "close_all": "Zamknij wszystkie", "saved_schedules": "Zapisane harmonogramy", "refresh": "Odśwież", "add": "Dodaj harmonogram", "editing": "Edycja całego harmonogramu", "new": "Nowy harmonogram", "schedule_name": "Nazwa harmonogramu", "name_example": "Np. Trawnik rano", "start_days": "Dni rozpoczęcia podlewania", "everyday": "Codziennie", "weekdays": "Robocze", "weekends": "Weekendy", "window": "Okno podlewania", "from": "Od", "to": "Do", "start_time": "Początek podlewania", "end_time": "Koniec podlewania", "time": "Godzina", "hours": "godziny", "minutes": "minuty", "time_hint": "Przesuń godziny i minuty lub kliknij liczbę, aby wpisać.", "schedule_valves": "Zawory w tym harmonogramie", "overlap_hint": "Zawór może należeć do kilku nakładających się harmonogramów.", "save": "Zapisz cały harmonogram", "cancel": "Anuluj", "delete": "Usuń cały harmonogram", "edit_schedule": "Edytuj harmonogram {name}", "control_valve": "Steruj zaworem {name}", "valve": "Zawór {name}", "schedule": "Harmonogram", "valves": "Zawory: {names}", "next_day_suffix": " · koniec następnego dnia", "overnight_hint": "Wybrane dni oznaczają dzień rozpoczęcia. Koniec następnego dnia.", "all_days_hint": "Zmiana godzin obejmie wszystkie wybrane dni.", "empty": "Nie ma zapisanych harmonogramów. Kliknij Dodaj harmonogram, aby utworzyć pierwszy.", "watering_badge": "Podlewa · {count}", "waiting": "Oczekuje", "disabled": "Wyłączone", "no_switch": "Brak przełącznika", "on": "Włączona", "off": "Wyłączona", "unavailable": "Niedostępna", "opened": "Otwarte zawory: {names}", "closed_or_unknown": "Zawory są zamknięte lub brak odczytu ich stanu.", "no_status": "Brak odczytu statusu — sprawdź integrację Nawodnienie.", "manual_hint": "Tryb ręczny · dotknij zaworu, aby go włączyć lub wyłączyć.", "disable_manual_hint": "Wyłącz automatykę, aby sterować zaworami ręcznie.", "wait_manual_hint": "Sterowanie ręczne będzie dostępne po zamknięciu zaworów i potwierdzeniu przez HA.", "valve_on": "Włączony", "valve_off": "Wyłączony", "no_reading": "Brak odczytu", "error": "Błąd", "active": "Aktywny", "blocked": "Zablokowany", "schedule_unavailable": "Niedostępny", "reading": "Odczytywanie harmonogramów…", "select_edit": "Dotknij harmonogramu, aby edytować wszystkie jego dni i zawory.", "read_only": "Podgląd · zapis wymaga konta administratora HA.", "saving": "Zapisywanie całego harmonogramu…", "deleting": "Usuwanie harmonogramu…", "deleted": "Usunięto cały harmonogram i jego encję.", "updated": "Zmieniono cały harmonogram we wszystkich wybranych dniach.", "created": "Dodano harmonogram i utworzono encję Schedule.", "saved_refresh_failed": "Zapisano poprawnie. Kliknij Odśwież, aby pobrać listę.", "delete_confirm": "Usunąć cały harmonogram „{name}”?\n\nZostanie usunięta encja Schedule wraz ze wszystkimi dniami.", "unnamed": "bez nazwy", "edit_hint": "Edytujesz cały harmonogram: wszystkie jego dni, godziny i zawory.", "removed_valves_hint": "Zawory usunięte z listy zostaną usunięte z tego harmonogramu po zapisaniu. Wybierz zawory i zapisz cały harmonogram.", "add_hint": "Wybierz dni, godziny i zawory nowego harmonogramu.", "cancelled": "Anulowano zmiany w formularzu.", "error_entry_id": "entry_id musi być tekstem.", "error_subscription": "Nie można włączyć powiadomień o harmonogramach. Użyj Odśwież lub ponownie otwórz panel.", "error_no_registry": "Brak encji harmonogramu w rejestrze HA.", "error_disabled_schedule": "Encja harmonogramu jest wyłączona w HA.", "error_schedule_id": "Przywróć identyfikator encji zaczynający się od schedule.irrigation_ lub starszego schedule.nawodnienie_.", "error_helper": "Ten pomocnik nie zawiera jednego pełnego wpisu utworzonego przez kartę.", "error_yaml_admin": "Administrator musi zapisać listę zaworów z YAML w integracji.", "error_read": "Nie udało się odczytać harmonogramów.", "error_choose_catalog": "Wybierz zawory z aktualnej listy.", "error_catalog_changed": "Lista zaworów zmieniła się w integracji. Odśwież i wybierz zawory ponownie.", "error_stale_schedule": "Harmonogram zmienił się. Odśwież i wybierz go ponownie.", "error_save": "Nie udało się zapisać harmonogramu.", "error_master": "Nie udało się zmienić przełącznika automatyki.", "error_manual_changed": "Konfiguracja zaworów lub tryb sterowania zmieniły się. Spróbuj ponownie.", "error_manual": "Nie udało się przełączyć zaworu.", "error_time": "Wpisz godzinę GG:MM (dokładność do minuty).", "error_time_range": "Godzina jest poza zakresem.", "error_rule_id": "Brak identyfikatora wpisu.", "error_days": "Wybierz przynajmniej jeden dzień.", "error_valves": "Wybierz przynajmniej jeden zawór.", "error_switch": "Zawory muszą być encjami switch.", "error_equal_times": "Początek i koniec muszą być różne.", "error_name": "Nazwa może mieć najwyżej 80 znaków.", "error_reserved": "Ta nazwa jest zarezerwowana dla konfiguracji automatyki.", "error_version": "Nieobsługiwana wersja wpisu.", "error_valve_data": "Dane zaworów są niespójne.", "error_zone_data": "Dane stref są niespójne.", "error_parts": "Części wpisu są niespójne. Popraw je w pomocniku HA lub usuń cały wpis.", "error_operation": "Nieznana operacja.", "error_stale_clear": "Harmonogram zmienił się. Odśwież go przed wyczyszczeniem.", "error_stale_entry": "Ten wpis zmienił się. Odśwież i wybierz go ponownie.", "error_change_id": "Nie można zmienić identyfikatora wpisu.", "error_duplicate_id": "Ten identyfikator jest już zapisany.", "error_overlap": "Przedział nachodzi na inny wpis: {day}.", "error_catalog_empty": "Dodaj przynajmniej jeden zawór w valves.", "error_entity": "Każdy zawór wymaga entity: switch.…", "error_valve_name": "Nazwa zaworu musi mieć 1–80 znaków.", "error_duplicate_valves": "Encje zaworów nie mogą się powtarzać.", "error_automation_valve": "Przełącznik automatyki nie może być zaworem.", "error_not_ready": "Integracja nawodnienia nie jest uruchomiona.", "error_manual_mode": "Wyłącz automatykę i poczekaj na zamknięcie zaworów.", "error_unknown_valve": "Ten zawór nie należy do konfiguracji nawodnienia.", "error_open_one": "Otwarcie wymaga wskazania jednego zaworu.", "error_timeout": "Przekroczono czas oczekiwania na akcję zaworu.", "issue_valve": "Niedostępny zawór: {name}", "issue_schedule": "Niedostępny harmonogram: {name}", "issue_data": "Nieprawidłowe dane lub usunięty zawór w harmonogramie: {name}", "issue_open": "Brak potwierdzenia otwarcia: {name}", "issue_close": "Brak potwierdzenia zamknięcia: {name}", "status_error": "Błąd: {errors}", "status_starting": "Uruchamianie automatyki", "status_manual_open": "Tryb ręczny · zawory: {valves}", "status_manual_closed": "Tryb ręczny · zawory zamknięte", "status_stopping": "Wyłączanie automatyki · zamykanie zaworów", "status_setting": "Ustawianie zaworów · {schedules}", "status_watering": "Podlewanie: {schedules} · zawory: {valves}", "status_waiting": "Automatyka włączona · oczekuje na harmonogram", "days": ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"]}, "de": {"title": "Bewässerung", "automation": "Bewässerungsautomatik", "manual_title": "Manuelle Ventilsteuerung", "close_all": "Alle schließen", "saved_schedules": "Gespeicherte Zeitpläne", "refresh": "Aktualisieren", "add": "Zeitplan hinzufügen", "editing": "Gesamten Zeitplan bearbeiten", "new": "Neuer Zeitplan", "schedule_name": "Name des Zeitplans", "name_example": "Z. B. Rasen morgens", "start_days": "Starttage der Bewässerung", "everyday": "Täglich", "weekdays": "Werktage", "weekends": "Wochenende", "window": "Bewässerungszeitraum", "from": "Von", "to": "Bis", "start_time": "Beginn der Bewässerung", "end_time": "Ende der Bewässerung", "time": "Uhrzeit", "hours": "Stunden", "minutes": "Minuten", "time_hint": "Stunden und Minuten wischen oder zum Eingeben eine Zahl antippen.", "schedule_valves": "Ventile in diesem Zeitplan", "overlap_hint": "Ein Ventil kann mehreren überlappenden Zeitplänen zugeordnet sein.", "save": "Gesamten Zeitplan speichern", "cancel": "Abbrechen", "delete": "Gesamten Zeitplan löschen", "edit_schedule": "Zeitplan {name} bearbeiten", "control_valve": "Ventil {name} steuern", "valve": "Ventil {name}", "schedule": "Zeitplan", "valves": "Ventile: {names}", "next_day_suffix": " · Ende am nächsten Tag", "overnight_hint": "Die ausgewählten Tage sind Starttage. Ende am nächsten Tag.", "all_days_hint": "Zeitänderungen gelten für alle ausgewählten Tage.", "empty": "Keine gespeicherten Zeitpläne. Mit Zeitplan hinzufügen den ersten anlegen.", "watering_badge": "Bewässert · {count}", "waiting": "Wartet", "disabled": "Deaktiviert", "no_switch": "Schalter fehlt", "on": "Ein", "off": "Aus", "unavailable": "Nicht verfügbar", "opened": "Geöffnete Ventile: {names}", "closed_or_unknown": "Ventile geschlossen oder Zustand nicht verfügbar.", "no_status": "Status nicht verfügbar — Integration Bewässerung prüfen.", "manual_hint": "Manueller Modus · Ventil zum Ein- oder Ausschalten antippen.", "disable_manual_hint": "Automatik ausschalten, um Ventile manuell zu steuern.", "wait_manual_hint": "Manuelle Steuerung ist verfügbar, sobald HA alle Ventile als geschlossen bestätigt.", "valve_on": "Ein", "valve_off": "Aus", "no_reading": "Kein Messwert", "error": "Fehler", "active": "Aktiv", "blocked": "Gesperrt", "schedule_unavailable": "Nicht verfügbar", "reading": "Zeitpläne werden geladen…", "select_edit": "Zeitplan antippen, um alle Tage und Ventile zu bearbeiten.", "read_only": "Nur Ansicht · Speichern erfordert ein HA-Administratorkonto.", "saving": "Gesamter Zeitplan wird gespeichert…", "deleting": "Zeitplan wird gelöscht…", "deleted": "Gesamter Zeitplan und seine Entität gelöscht.", "updated": "Gesamter Zeitplan für alle ausgewählten Tage geändert.", "created": "Zeitplan hinzugefügt und Schedule-Entität erstellt.", "saved_refresh_failed": "Erfolgreich gespeichert. Mit Aktualisieren die Liste neu laden.", "delete_confirm": "Gesamten Zeitplan „{name}“ löschen?\n\nDie Schedule-Entität und alle Tage werden entfernt.", "unnamed": "ohne Namen", "edit_hint": "Sie bearbeiten den gesamten Zeitplan: alle Tage, Zeiten und Ventile.", "removed_valves_hint": "Entfernte Ventile werden beim Speichern aus diesem Zeitplan entfernt. Ventile auswählen und den gesamten Zeitplan speichern.", "add_hint": "Tage, Zeiten und Ventile für den neuen Zeitplan auswählen.", "cancelled": "Änderungen im Formular verworfen.", "error_entry_id": "entry_id muss eine Zeichenfolge sein.", "error_subscription": "Zeitplanbenachrichtigungen sind nicht verfügbar. Aktualisieren verwenden oder das Dashboard erneut öffnen.", "error_no_registry": "Schedule-Entität fehlt im HA-Register.", "error_disabled_schedule": "Schedule-Entität ist in HA deaktiviert.", "error_schedule_id": "Eine Entitäts-ID verwenden, die mit schedule.irrigation_ oder dem bisherigen schedule.nawodnienie_ beginnt.", "error_helper": "Dieser Helfer enthält keinen vollständigen Eintrag, der von der Karte erstellt wurde.", "error_yaml_admin": "Ein Administrator muss die YAML-Ventilliste in der Integration speichern.", "error_read": "Zeitpläne konnten nicht geladen werden.", "error_choose_catalog": "Ventile aus der aktuellen Liste auswählen.", "error_catalog_changed": "Die Ventilliste wurde geändert. Aktualisieren und Ventile erneut auswählen.", "error_stale_schedule": "Der Zeitplan wurde geändert. Aktualisieren und erneut auswählen.", "error_save": "Zeitplan konnte nicht gespeichert werden.", "error_master": "Automatikschalter konnte nicht geändert werden.", "error_manual_changed": "Ventilkonfiguration oder Steuerungsmodus wurde geändert. Erneut versuchen.", "error_manual": "Ventil konnte nicht geschaltet werden.", "error_time": "Uhrzeit als HH:MM eingeben (Minutengenauigkeit).", "error_time_range": "Uhrzeit liegt außerhalb des gültigen Bereichs.", "error_rule_id": "Eintrags-ID fehlt.", "error_days": "Mindestens einen Tag auswählen.", "error_valves": "Mindestens ein Ventil auswählen.", "error_switch": "Ventile müssen switch-Entitäten sein.", "error_equal_times": "Start- und Endzeit müssen unterschiedlich sein.", "error_name": "Name darf höchstens 80 Zeichen enthalten.", "error_reserved": "Dieser Name ist für die Automatikkonfiguration reserviert.", "error_version": "Nicht unterstützte Eintragsversion.", "error_valve_data": "Ventildaten sind inkonsistent.", "error_zone_data": "Zonendaten sind inkonsistent.", "error_parts": "Eintragsteile sind inkonsistent. Helfer in HA korrigieren oder den gesamten Eintrag löschen.", "error_operation": "Unbekannte Aktion.", "error_stale_clear": "Zeitplan wurde geändert. Vor dem Leeren aktualisieren.", "error_stale_entry": "Dieser Eintrag wurde geändert. Aktualisieren und erneut auswählen.", "error_change_id": "Eintrags-ID kann nicht geändert werden.", "error_duplicate_id": "Diese Eintrags-ID existiert bereits.", "error_overlap": "Zeitraum überlappt einen anderen Eintrag: {day}.", "error_catalog_empty": "Mindestens ein Ventil zu valves hinzufügen.", "error_entity": "Jedes Ventil benötigt eine gültige entity: switch.…", "error_valve_name": "Ventilname muss 1–80 Zeichen enthalten.", "error_duplicate_valves": "Ventil-Entitäten dürfen sich nicht wiederholen.", "error_automation_valve": "Der Automatikschalter kann kein Ventil sein.", "error_not_ready": "Die Bewässerungsintegration ist nicht gestartet.", "error_manual_mode": "Automatik ausschalten und warten, bis die Ventile geschlossen sind.", "error_unknown_valve": "Dieses Ventil gehört nicht zur Bewässerungskonfiguration.", "error_open_one": "Ein Ventil zum Öffnen auswählen.", "error_timeout": "Zeitüberschreitung beim Warten auf die Ventilaktion.", "issue_valve": "Ventil nicht verfügbar: {name}", "issue_schedule": "Zeitplan nicht verfügbar: {name}", "issue_data": "Ungültige Daten oder entferntes Ventil im Zeitplan: {name}", "issue_open": "Öffnen nicht bestätigt: {name}", "issue_close": "Schließen nicht bestätigt: {name}", "status_error": "Fehler: {errors}", "status_starting": "Automatik wird gestartet", "status_manual_open": "Manueller Modus · Ventile: {valves}", "status_manual_closed": "Manueller Modus · Ventile geschlossen", "status_stopping": "Automatik wird ausgeschaltet · Ventile werden geschlossen", "status_setting": "Ventile werden eingestellt · {schedules}", "status_watering": "Bewässerung: {schedules} · Ventile: {valves}", "status_waiting": "Automatik eingeschaltet · wartet auf einen Zeitplan", "days": ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]}};
// Text is stored in custom_components/irrigation_schedule/locales/*.json.
const languageCode = value => {
  const code = String(value || 'en').toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(IRRIGATION_TRANSLATIONS, code) ? code : 'en';
};
const translate = (language, key, params = {}) => {
  const text = IRRIGATION_TRANSLATIONS[languageCode(language)][key] ?? IRRIGATION_TRANSLATIONS.en[key] ?? key;
  return typeof text === 'string' ? text.replace(/\{(\w+)\}/g, (match, name) => params[name] == null ? match : String(params[name])) : text;
};

// One logical entry owns every weekday and midnight fragment with the same ID.
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MODEL_MESSAGES = {"error_entry_id": "entry_id must be a string.", "error_subscription": "Schedule notifications are unavailable. Use Refresh or reopen the dashboard.", "error_no_registry": "Schedule entity is missing from the HA registry.", "error_disabled_schedule": "Schedule entity is disabled in HA.", "error_schedule_id": "Use an entity ID starting with schedule.irrigation_ or the legacy schedule.nawodnienie_.", "error_helper": "This helper does not contain one complete entry created by the card.", "error_yaml_admin": "An administrator must save the YAML valve list to the integration.", "error_read": "Could not read schedules.", "error_choose_catalog": "Select valves from the current list.", "error_catalog_changed": "The valve list changed in the integration. Refresh and select valves again.", "error_stale_schedule": "The schedule changed. Refresh and select it again.", "error_save": "Could not save the schedule.", "error_master": "Could not change the automation switch.", "error_manual_changed": "Valve configuration or control mode changed. Try again.", "error_manual": "Could not switch the valve.", "error_time": "Enter a time as HH:MM (minute precision).", "error_time_range": "Time is out of range.", "error_rule_id": "Missing entry ID.", "error_days": "Select at least one day.", "error_valves": "Select at least one valve.", "error_switch": "Valves must be switch entities.", "error_equal_times": "Start and end times must differ.", "error_name": "Name must contain at most 80 characters.", "error_reserved": "This name is reserved for automation configuration.", "error_version": "Unsupported entry version.", "error_valve_data": "Valve data is inconsistent.", "error_zone_data": "Zone data is inconsistent.", "error_parts": "Entry fragments are inconsistent. Fix the helper in HA or delete the entire entry.", "error_operation": "Unknown operation.", "error_stale_clear": "The schedule changed. Refresh it before clearing.", "error_stale_entry": "This entry changed. Refresh and select it again.", "error_change_id": "Entry ID cannot be changed.", "error_duplicate_id": "This entry ID already exists.", "error_overlap": "Time window overlaps another entry: {day}.", "error_catalog_empty": "Add at least one valve to valves.", "error_entity": "Each valve needs a valid entity: switch.…", "error_valve_name": "Valve name must contain 1–80 characters.", "error_duplicate_valves": "Valve entities must be distinct.", "error_automation_valve": "The automation switch cannot be a valve.", "error_not_ready": "The irrigation integration is not running.", "error_manual_mode": "Disable automation and wait until the valves are closed.", "error_unknown_valve": "This valve is not part of the irrigation configuration.", "error_open_one": "Select one valve to open.", "error_timeout": "Timed out waiting for the valve action."};
class ScheduleError extends Error {
  constructor(code, params = {}) {
    super((MODEL_MESSAGES[code] || code).replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match));
    this.code = code; this.params = params;
  }
}
const copy = value => JSON.parse(JSON.stringify(value));
const canonical = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === 'object' ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v);
function seconds(value, end = false) {
  if (typeof value !== 'string' || !/^\d{1,2}:\d{2}(?::00)?$/.test(value.trim())) throw new ScheduleError('error_time');
  const [h, m] = value.trim().split(':').map(Number);
  if (end && h === 24 && m === 0) return 86400;
  if (h > 23 || m > 59) throw new ScheduleError('error_time_range');
  return h * 3600 + m * 60;
}
const format = n => `${String(Math.floor(n / 3600)).padStart(2, '0')}:${String(n % 3600 / 60).padStart(2, '0')}:00`;
function normalizeRule(raw) {
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
function compileRule(raw, extraData = {}) {
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
function decodeEntry(data) {
  try { return typeof data?.irrigation_entry === 'string' ? JSON.parse(data.irrigation_entry) : null; } catch { return null; }
}
function entryFingerprint(week, id) {
  return canonical(DAYS.flatMap(day => (week[day] || []).filter(b => decodeEntry(b.data)?.id === id).map(block => ({ day, block }))).sort((a, b) => canonical(a).localeCompare(canonical(b))));
}
function listEntries(week) {
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
function updateWeek(current, request) {
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
const weekFingerprint = week => canonical(DAYS.map(d => week[d] || []));
const MANAGED_PREFIX = 'Irrigation ';
const isManagedSchedule = schedule => ['Irrigation ', 'Nawodnienie '].some(prefix => schedule.name?.startsWith(prefix));
const isManagedEntity = id => ['schedule.irrigation_', 'schedule.nawodnienie_'].some(prefix => id?.startsWith(prefix));
const scheduleName = rule => MANAGED_PREFIX + (rule.title || 'Schedule ' + rule.id.slice(0, 8));
function createSchedule(rule) {
  const normalized = normalizeRule(rule);
  const payload = updateWeek({ id: normalized.id, name: scheduleName(normalized), icon: 'mdi:sprinkler-variant' }, { operation: 'add', rule: normalized });
  delete payload.schedule_id;
  payload.type = 'schedule/create';
  return payload;
}

const CATALOG_NAME = 'Irrigation Valve configuration';
function normalizeValves(raw) {
  if (!Array.isArray(raw) || !raw.length) throw new ScheduleError('error_catalog_empty');
  const valves = raw.map(v => {
    if (!v || typeof v.entity !== 'string' || !/^switch\.[a-z0-9_]+$/.test(v.entity)) throw new ScheduleError('error_entity');
    if (v.name != null && (typeof v.name !== 'string' || !v.name.trim() || v.name.length > 80)) throw new ScheduleError('error_valve_name');
    return {entity:v.entity, name:v.name?.trim() || v.entity};
  });
  if (new Set(valves.map(v=>v.entity)).size !== valves.length) throw new ScheduleError('error_duplicate_valves');
  return valves;
}
function isCatalogSchedule(s) { return [CATALOG_NAME, 'Nawodnienie Konfiguracja zaworów'].includes(s.name) || DAYS.some(d => (s[d] || []).some(b => b.data?.irrigation_catalog != null)); }
function decodeCatalog(s) {
  const block = DAYS.flatMap(d => s[d] || []).find(b => b.data?.irrigation_catalog != null);
  try { return JSON.parse(block.data.irrigation_catalog); } catch { return null; }
}
function catalogPayload(valves, old = null) {
  valves = normalizeValves(valves);
  const previous = old && decodeCatalog(old);
  const retired = [...(previous?.retired || []), ...(previous?.valves || [])].filter(v => !valves.some(n => n.entity === v.entity));
  const data = {irrigation_managed:'adk45-ha-v2', irrigation_catalog:JSON.stringify({version:1, valves, retired:[...new Map(retired.map(v=>[v.entity,v])).values()]})};
  const payload = {type:old ? 'schedule/update' : 'schedule/create', name:CATALOG_NAME, icon:'mdi:cog'};
  if (old) payload.schedule_id = old.id;
  for (const d of DAYS) payload[d] = [{from:'00:00:00',to:'24:00:00',data:copy(data)}];
  return payload;
}

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

const ElementBase = globalThis.HTMLElement || class {};
const ROW_HEIGHT = 36;
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

if (globalThis.customElements && !customElements.get('irrigation-integration-time-picker')) customElements.define('irrigation-integration-time-picker', IrrigationIntegrationTimePicker);
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
