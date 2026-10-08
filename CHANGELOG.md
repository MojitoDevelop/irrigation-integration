# Changelog

## 0.3.0 — schedule activation

- Per-schedule activity switch in the card, translated into English, Polish and German.
- Disabled schedules retain their complete configuration and are ignored by the server controller.
- Activation persists in native Schedule data across HA restarts; existing schedules default to active.
- Deactivation closes only valves no longer requested by another active schedule.

## 0.2.0 — localization and publication package

- English, Polish and German native configuration/options and card interfaces, localized status, errors and time-picker accessibility labels.
- English default names/IDs for new entities and helpers, retaining all legacy registry IDs and schedule prefixes.
- Empty valve selection on new installation; existing options preserve configured valves.
- Localized standalone navigation button-card, shared runtime dictionaries and English fallback.
- Repository metadata for MojitoDevelop/irrigation-integration, English README, Polish documentation and release artifacts.
- Simplified English/Polish README and repository layout: documentation/screenshots in `docs/`, YAML in `examples/`, build tools in `scripts/`.
- Development tests, fixtures, previews and test dependencies are maintained separately; public CI retains release preflight, Hassfest and HACS validation.
- Patched test-only YAML parser; retained event-driven frontend updates with no periodic polling.

## 0.1.3 — powiadomienia zamiast odpytywania

- Usunięty frontendowy timer odczytu co 30 sekund.
- Zmiany pomocników Schedule pobierane po powiadomieniu z natywnej kolekcji HA; zmiany statusu i stanów nadal aktualizowane na bieżąco.
- Identyczna konfiguracja karty nie resetuje formularza ani nie przebudowuje DOM.
- Odświeżanie listy zaworów po zmianie opcji integracji oraz listy harmonogramów po odzyskaniu połączenia.
- Powiadomienia podczas zapisu lub odczytu zostają obsłużone po zakończeniu operacji; subskrypcje usuwane po odłączeniu karty.
- Test przeglądarkowy: 95 sekund bezczynności bez wywołań API, mutacji DOM i utraty aktywnego pola. Test rzeczywistego HA: dodanie, edycja, usunięcie oraz anulowanie subskrypcji.

## 0.1.2 — odświeżanie bez migania

- Odczyt harmonogramów w tle nie wyszarza przycisków ani pól formularza.
- Nieodmienione stany i wpisy pozostawiają elementy DOM bez zmian.
- Aktualizacja stanów zaworów i sensora zmienia tylko potrzebny tekst i oznaczenia.
- Zachowanie aktywnego pola, szkicu oraz kół wyboru czasu podczas okresowego odczytu.
- Zapis kliknięty podczas odczytu w tle czeka na jego zakończenie zamiast być pomijany.
- Instrukcja czyszczenia cache na Androidzie i zasób JS z wersją 0.1.2.

## 0.1.1 — poprawki do testów

- Mniejszy, jednoliniowy układ ręcznych przycisków zaworów ze znacznikiem stanu.
- Ukrywanie całej sekcji ręcznej, gdy automatyka jest włączona; odtworzenie przy wyłączeniu.
- Numer wersji JS i nowy adres zasobu zapobiegający wykorzystaniu cache wcześniejszego pliku.
- Instrukcja migracji na poprawny typ karty integracji oraz awaryjny zasób Lovelace.
- Uzupełnione deklaracje zależności integracji i schemat konfiguracji wyłącznie przez UI.

Publikacja GitHub/HACS jest na razie odłożona.

## 0.1.0 — kandydat do pierwszego wydania / initial release candidate

- Konfiguracja zaworów i ich nazw przez „Urządzenia i usługi”.
- Sterownik działający w tle bez Node-RED i otwartego dashboardu.
- Edycja całego harmonogramu, wybór dni oraz zaworów i obsługa przedziałów przez północ.
- Nakładające się harmonogramy z zachowaniem zaworów współdzielonych przez aktywne wpisy.
- Przełącznik automatyki, tekstowy sensor statusu i ręczne sterowanie po zatrzymaniu automatyki.
- Karta dołączona do integracji oraz osobny skoczek `button-card` do `/irrigation`.
- Potwierdzanie stanów zaworów, diagnostyka błędów, ponawianie i odtwarzanie po restarcie.
- Zgodność z formatami harmonogramów poprzedniej wersji HA (v1/v2).

Nie opublikowano jeszcze wydania na GitHubie. / No GitHub release has been published yet.
