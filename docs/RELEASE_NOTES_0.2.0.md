# Irrigation 0.2.0

- English, Polish and German native HA configuration/options flows and dashboard controls, messages, validation, status and accessibility labels.
- The dashboard follows the current HA user language; the text sensor follows server language. Structured status fields also allow the standalone button-card navigation card to localize status. Unsupported languages fall back to English.
- New integration entities and Schedule helpers have English default names and identifiers. Existing registry IDs and legacy schedules remain supported; external valve IDs and user-supplied names are preserved.
- New configuration starts with an empty valve selection, even if original irrigation switches or an old catalogue helper already exist. Existing options retain the user's list.
- Repository metadata targets MojitoDevelop/irrigation-integration, with English README, Polish documentation, MIT license, CI and deterministic source/install archives.
- Retains the 0.1.3 push-update behaviour, with no periodic card polling. Updated test-only YAML dependency to a patched version.

## Update

Replace `custom_components/irrigation_schedule`, restart HA and refresh frontend cache. For manual resources, use `/irrigation_schedule/irrigation-schedule-card.js?v=0.2.0`. Card type remains `custom:irrigation-schedule-integration-card`. Omit an explicit `title` to translate the heading. Set the standalone navigation card's entity to your existing sensor if it has a legacy ID.

Local tests: native HA 2026.10.0 with simulated valves, Chromium main and navigation cards, all three languages and English fallback, unchanged draft/focus on language change, empty initial valve selection, English new entity IDs, legacy IDs after restart, overlap/manual/failure behaviour, pure models, release guards and Hassfest. GitHub HACS/CI checks and real-device tests must be confirmed for the uploaded commit before marking a stable release.

## Zmiany po polsku

Tłumaczenia PL/EN/DE dla integracji i kart; domyślne nazwy nowych encji po angielsku; brak automatycznego zaznaczania zaworów przy dodawaniu integracji. Stare identyfikatory i harmonogramy są zachowane. Po aktualizacji zrestartuj HA i odśwież cache. Usuń `title` z YAML, jeśli nagłówek ma się tłumaczyć zgodnie z językiem HA.
