# Nawodnienie — integracja Home Assistant

Wersja **0.2.0**, wydanie do testów. Integracja własna (`custom integration`), konfigurowana w **Ustawienia → Urządzenia i usługi**. Sterownik działa na serwerze HA, także przy zamkniętym dashboardzie, aplikacji i przeglądarce. Nie wymaga Node-RED ani pakietu automatyzacji YAML.

Przetestowana na **Home Assistant 2026.10.0**; ta wersja jest minimum zadeklarowanym w HACS. Zgodność ze starszymi wersjami nie została sprawdzona. Nie jest częścią HA Core ani opublikowaną integracją HACS. Repozytorium: [MojitoDevelop/irrigation-integration](https://github.com/MojitoDevelop/irrigation-integration). Wydanie jest przygotowane do publikacji i testów; nie zostało opublikowane przez narzędzia tej paczki. [Instrukcja aktualizacji i rozwiązanie problemu z brakującym elementem karty](INSTALL.md).

![Karta Nawodnienie](preview-light.png)

Dokumentacja: [aktualizacja i brakujący element karty](INSTALL.md), [testy przed wydaniem](docs/TEST_PLAN.md), [historia zmian](CHANGELOG.md), [poprawki 0.2.0](docs/RELEASE_NOTES_0.2.0.md). Instrukcja publikacji: [docs/PUBLISHING.md](docs/PUBLISHING.md).

## Instalacja przez HACS po publikacji repozytorium

Dodaj adres publicznego repozytorium w **HACS → menu → Repozytoria niestandardowe**, wybierając kategorię **Integration**. Pobierz „Nawodnienie”, uruchom ponownie HA i dodaj integrację przez „Urządzenia i usługi”. Dalej postępuj od kroku 5 poniżej. Nie wymaga to obecności projektu w domyślnym katalogu HACS; takie zgłoszenie jest osobnym etapem.

## Instalacja i przejście z poprzedniej wersji

1. Wyłącz poprzedni sterownik nawodnienia: flow Node-RED albo wcześniejszy pakiet `/config/packages/nawodnienie_ha.yaml`. Przy wersji pakietowej usuń ten pakiet z konfiguracji. **Zachowaj pomocniki Schedule z harmonogramami** — integracja korzysta z nich dalej. Nie uruchamiaj obu sterowników jednocześnie.
2. Skopiuj folder `custom_components/irrigation_schedule` z paczki do `/config/custom_components/irrigation_schedule`. Jeśli `custom_components` nie istnieje, utwórz go.
3. Uruchom ponownie Home Assistant.
4. Wybierz **Ustawienia → Urządzenia i usługi → Dodaj integrację → Nawodnienie**.
5. Wskaż encje `switch` zaworów. W następnym kroku wpisz ich nazwy widoczne w karcie. Przy dodawaniu integracji lista jest pusta: żaden istniejący przełącznik nie jest wybierany automatycznie. W opcjach istniejącej integracji jej konfiguracja pozostaje zaznaczona.
6. Odśwież przeglądarkę i dodaj ręczną kartę Lovelace z pliku [card.yaml](card.yaml):

   ```yaml
   type: custom:irrigation-schedule-integration-card
   ```

Karta jest dostarczana i rejestrowana przez integrację. **Nie kopiuj jej do `www` i nie dodawaj zasobu JavaScript ręcznie.** Nowy typ karty pozwala zachować starą kartę w czasie przejścia, ale usuń ją z używanego dashboardu po migracji.

Integracja obsługuje jedną instancję. Przy aktualizacji podmień jej folder, uruchom ponownie HA i odśwież przeglądarkę.

## Zawory i nazwy

Zawory można zmieniać w opcjach integracji w „Urządzenia i usługi”. Najpierw wybierasz encje, potem nazwy. Nazwa i kolejność na liście nie zmieniają przypisania zaworu do harmonogramu: zapis wykorzystuje identyfikator encji.

Opcjonalnie użyj [card-with-valves.yaml](card-with-valves.yaml), który zawiera wszystkie 12 oryginalnych zaworów. Przykład:

```yaml
type: custom:irrigation-schedule-integration-card
valves:
  - entity: switch.nawodnienie_strefa_1
    name: Trawnik
  - entity: switch.nawodnienie_strefa_2
    name: Rabaty
```

Jawna lista `valves` jest zapisywana w konfiguracji integracji przy pierwszym otwarciu danej instancji karty przez administratora. Od tej chwili serwer zna zawory i działa bez karty. Ponowne wczytanie strony z taką listą może ponownie zastosować YAML. Dlatego wybierz spójne źródło konfiguracji: **najwygodniej opcje integracji i minimalna karta bez `valves`**. Przy konfiguracji YAML aktualizuj tę listę we wszystkich kopiach karty.

Usunięte zawory pozostają na wewnętrznej liście do zamknięcia, dzięki czemu sterownik może ponowić polecenie po odzyskaniu ich dostępności. Ponowne dodanie tej samej encji przywraca ją do aktywnej listy. Zmiana samej nazwy lub kolejności nie przełącza zaworów w trybie ręcznym.

## Encje i dashboard

Integracja tworzy urządzenie „Irrigation” oraz domyślnie:

- `switch.irrigation_automation` — włączanie i wyłączanie automatyki; ostatni stan jest odtwarzany po restarcie;
- `sensor.irrigation_status` — opis bieżącego działania, aktywne harmonogramy i zawory, tryb oraz błędy w atrybutach.

Główna karta pobiera rzeczywiste identyfikatory tych encji z integracji. Osobna karta skoczka [navigation-card.yaml](navigation-card.yaml) wymaga zainstalowanego `custom:button-card`, pokazuje nazwę, ikonę i status oraz prowadzi do **`/irrigation`**. Jeśli zmienisz identyfikator sensora w HA, popraw również `entity` w skoczku.

Sekcja ręcznego sterowania jest ukrywana podczas pracy automatyki. Przyciski zaworów są kompaktowe, z nazwą i znacznikiem stanu. Główna karta ma przezroczyste tło, tytuł „Nawodnienie” i nie ma opcji zwijania całości. Formularz jest początkowo ukryty; otwiera go „Dodaj harmonogram”, a zamyka „Anuluj”. Domyślne godziny to 12:00–13:00. Karta zawiera przełącznik automatyki oraz ręczne sterowanie zaworami dostępne po zatrzymaniu automatyki. Zmiana konfiguracji, zapis harmonogramów i sterowanie ręczne wymagają konta administratora HA.

## Harmonogramy i działanie

- Każdy harmonogram jest natywnym pomocnikiem HA `schedule.irrigation_*` (starszy prefiks `schedule.nawodnienie_*` pozostaje obsługiwany) z nazwą, dniami, przedziałem czasu i listą zaworów. Przy edycji zmieniasz **cały harmonogram**, także wszystkie wybrane dni i zawory. Dodawanie i usuwanie pomocników działa z karty.
- Przedział może przechodzić przez północ. Wybrane dni oznaczają dni rozpoczęcia; koniec trafia do kolejnego dnia. Godziny interpretuje HA w swojej skonfigurowanej strefie czasowej.
- Nakładające się harmonogramy otwierają sumę wymaganych zaworów. Zakończenie jednego wpisu nie zamyka zaworu wymaganego przez inny aktywny wpis.
- Stan pomocników, zmiany konfiguracji i stan zaworów są obsługiwane na serwerze. Sterownik reaguje na zdarzenia oraz wykonuje sprawdzenie co 5 sekund. Dashboard nie jest zegarem ani wykonawcą harmonogramów.
- Wyłączenie automatyki najpierw zamyka sterowane zawory. Tryb ręczny zostaje udostępniony po potwierdzeniu zamknięcia. W trybie ręcznym sterownik zachowuje świadomie ustawione stany zaworów.
- Po starcie HA włączona automatyka zastosuje aktualnie aktywne harmonogramy. Przy wyłączonej automatyce sterownik najpierw zamknie zawory, a następnie udostępni sterowanie ręczne. Ręczne otwarcia nie są odtwarzane jako osobny harmonogram.
- Wywołania usług mają limit czasu, a zmiana stanu encji jest potwierdzana. Przy błędzie lub niedostępności sterownik zapisuje diagnostykę i ponawia polecenie. Przed każdym poleceniem sprawdza najnowszy plan, dzięki czemu wyłączenie automatyki w trakcie działania nie uruchamia kolejnych zaplanowanych otwarć.
- Przy zatrzymaniu albo przeładowaniu integracji w trybie automatycznym lub podczas zatrzymywania wysyłane są polecenia zamknięcia. W trybie ręcznym przeładowanie nie zmienia ręcznie ustawionych stanów. Sterownik nie działa, kiedy serwer HA jest wyłączony; zachowanie zaworów przy utracie zasilania lub łączności zależy od urządzeń.

Status opisuje stan znany Home Assistant. Potwierdzenie `on`/`off` nie jest fizycznym pomiarem przepływu wody.

## Zachowanie wcześniejszych danych

Obsługiwane są harmonogramy z poprzedniej wersji HA: metadane v2 z pełnymi identyfikatorami encji oraz starsze v1 z numerami oryginalnych stref. Numery v1 wskazują `switch.nawodnienie_strefa_N`, a nie pozycję zaworu na nowej liście. Pomocniki niezawierające jednego poprawnego wpisu są oznaczane w karcie jako „Błąd” i wymagają poprawienia.

Stary techniczny pomocnik katalogu zaworów jest wykorzystywany do podpowiedzenia konfiguracji przy instalacji, a potem pomijany przez sterownik. Nie jest usuwany automatycznie. Stare `input_boolean` i sensory poprzedniego sterownika również nie są potrzebne nowej wersji; paczka ich nie usuwa. Nie jest to automatyczny importer dowolnych wcześniejszych flow Node-RED ani obcych formatów harmonogramów.

## Walidacja i pliki źródłowe

Testy wykonano na rzeczywistym HA 2026.10.0: instalacja, formularze konfiguracji i opcji, encje, serwowanie JS przez HTTP, natywne operacje Schedule, nakładanie harmonogramów, sterowanie ręczne, usuwanie zaworów, niedostępność, limit czasu, wyłączenie podczas polecenia, pełny restart i wyładowanie integracji. Zawory w tych testach są symulowanymi encjami przełączników; paczka nie została wdrożona ani sprawdzona na fizycznych zaworach użytkownika.

Testy przeglądarkowe obejmują wygenerowaną kartę, edycję całego harmonogramu, formularz czasu, walidację, sterowanie oraz skoczek z rzeczywistym modułem `button-card`. Zrzuty `preview-*.png` pokazują wygląd.

Podstawowe sprawdzenia źródeł:

```sh
python3 test-model.py
node test-card-model.mjs
python3 build.py
```

Test pełnego HA: `test-integration.py` wymaga środowiska z HA 2026.10.0 i jego zależnościami oraz lokalnych gniazd sieciowych. Testy `test-browser.cjs` i `test-navigation.cjs` wymagają Playwright/Chromium; skoczek dodatkowo modułu `button-card` i parsera YAML. Ścieżki można ustawić zmiennymi `IRRIGATION_PLAYWRIGHT`, `IRRIGATION_BUTTON_CARD` i `IRRIGATION_YAML`.

Źródła karty są w `card-source`; `build.py` tworzy plik dostarczany przez integrację. Kod serwera znajduje się w `custom_components/irrigation_schedule`. Konstrukcja wykorzystuje natywny [config flow HA](https://developers.home-assistant.io/docs/config_entries_config_flow_handler/) i [strukturę integracji HA](https://developers.home-assistant.io/docs/creating_integration_file_structure/).

Po `npm ci` oraz `npx playwright install chromium` uruchomisz `npm test` i `npm run test:browser` bez lokalnych ścieżek autora. `npm run test:navigation` wymaga dodatkowo pliku `button-card.js` z oficjalnego wydania, wskazanego w `IRRIGATION_BUTTON_CARD`. Ten moduł nie jest dołączany do naszej paczki.

Pliki PNG marki są dołączone do integracji. Źródło własnej ikony znajduje się w `docs/assets/icon.svg`; odtwarzanie: `npm run build:brand`. Licencja projektu i własnych grafik: [MIT](LICENSE).

## Języki i aktualizacja do 0.2.0

Formularze konfiguracji, karta i komunikaty obsługują polski, angielski i niemiecki. Karta wybiera język bieżącego użytkownika HA (`hass.locale.language`, z rezerwowym `hass.language`), a sensor tekstowy język serwera HA. Dla innych języków używany jest angielski. Jawny `title` w YAML oraz nazwy wpisane przez użytkownika pozostają jego własnym tekstem; usuń `title`, aby tytuł karty też się tłumaczył.

Nowe encje mają domyślne angielskie nazwy i identyfikatory: `switch.irrigation_automation`, `sensor.irrigation_status`. Nowe pomocniki mają nazwę `Irrigation …` i identyfikator `schedule.irrigation_*`; brak nazwy wpisanej przez użytkownika daje `Irrigation Schedule …`. Istniejące identyfikatory i unikalne ID są zachowane przy aktualizacji. Karta główna wykrywa rzeczywiste encje; skoczek wymaga wskazania istniejącego sensora w `entity`. Zewnętrzne encje zaworów nie są przemianowywane.
