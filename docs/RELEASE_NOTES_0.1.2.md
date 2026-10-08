# Nawodnienie 0.1.2 — odświeżanie bez migania

- Okresowe odświeżanie nie wyszarza całej karty i nie odtwarza niezmienionych harmonogramów.
- Aktualizacja stanu nie zastępuje całej karty; formularz zachowuje aktywne pole i szkic.
- Zapis podczas odczytu w tle zostaje wykonany po zakończeniu tego odczytu.
- Dodana instrukcja cache dla aplikacji HA i Chrome na Androidzie.

Podmień folder integracji, uruchom ponownie HA i odśwież klienta. Przy ręcznie dodanym zasobie zmień jego adres na `/irrigation_schedule/irrigation-schedule-card.js?v=0.1.2`.

Typ karty pozostaje `custom:irrigation-schedule-integration-card`. Sterownik serwerowy i zapisane harmonogramy zachowują dotychczasowe działanie. HACS jest na razie odłożony.
