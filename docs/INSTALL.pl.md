# Nawodnienie 0.2.0 — instalacja poprawionej wersji

Ta paczka zawiera **integrację oraz jej nową kartę**. Sam wcześniejszy folder z `www` nie zawiera tej integracji i nie rejestruje nowego typu karty.

1. Skopiuj cały folder `custom_components/irrigation_schedule` do **`/config/custom_components/irrigation_schedule`**, zastępując poprzednie pliki integracji. Nie kopiuj go do `www`. Nie usuwaj konfiguracji w `.storage` ani zapisanych pomocników Schedule.
2. Wyłącz wcześniejszy sterownik zaworów: flow Node-RED lub poprzedni pakiet YAML, jeśli jeszcze działa. Zachowaj harmonogramy.
3. **Uruchom ponownie Home Assistant**, aby serwer załadował nowy Python i adres JS z wersją `0.2.0`.
4. W **Ustawienia → Urządzenia i usługi** upewnij się, że „Nawodnienie” jest uruchomione. Jeśli nie było dodane, wybierz **Dodaj integrację → Nawodnienie**, wskaż zawory i ich nazwy. W informacjach integracji powinna być wersja **0.2.0**.
5. Odśwież przeglądarkę z pominięciem cache, np. **Ctrl+Shift+R**, albo zamknij i ponownie uruchom aplikację HA.
6. Zastąp YAML głównej karty:

   ```yaml
   type: custom:irrigation-schedule-integration-card
   title: Nawodnienie
   ```

Stary typ **`custom:irrigation-schedule-card`** uruchamia wcześniejszą kartę, ze starym zachowaniem nagłówka i przełącznika. Nowa karta odczytuje rzeczywisty identyfikator przełącznika z integracji.

## Gdy nadal pojawia się „Custom element doesn't exist”

Karta jest normalnie rejestrowana automatycznie. Jeśli po powyższych krokach jej element nadal nie jest dostępny:

1. Otwórz na swoim adresie HA ścieżkę **`/irrigation_schedule/irrigation-schedule-card.js?v=0.2.0`**. Powinien zostać zwrócony kod JavaScript, rozpoczynający się od `const INTEGRATION_CARD_VERSION = "0.2.0";`.
2. Jeśli otrzymujesz **404**, nie został załadowany backend nowej integracji. Sprawdź folder instalacji, restart, stan integracji oraz logi `custom_components.irrigation_schedule`. Dodanie zasobu nie naprawi brakującego backendu.
3. Jeśli plik JS działa, dodaj w **zasobach dashboardu Lovelace** (nie w YAML karty) zasób:

   ```yaml
   url: /irrigation_schedule/irrigation-schedule-card.js?v=0.2.0
   type: module
   ```

   W edytorze zasobów wybierz typ **JavaScript Module**. Ten sam wpis jest w `examples/resource.yaml`. Odśwież przeglądarkę ponownie. Przy kolejnych aktualizacjach zmień numer wersji również w tym ręcznym zasobie.

Jeżeli starsza karta nie jest używana na żadnym dashboardzie, usuń jej stary zasób z `/local/...`, aby nie ładować go dalej. Nie trzeba usuwać zapisanych harmonogramów.

## Aktualizacja do 0.2.0

Karta i formularze obsługują PL/EN/DE. Nowe encje tworzone są po angielsku; istniejące ID pozostają zachowane. Usuń jawny `title` z YAML, jeśli tytuł ma podążać za językiem HA. Nowa konfiguracja zaczyna się bez zaznaczonych zaworów.

## Poprawki zachowane z poprzedniej wersji

- Usunięte odpytywanie karty co 30 sekund. Lista korzysta z powiadomień HA o zmianach pomocników Schedule.
- Stany zaworów i status nadal aktualizują się na bieżąco, bez przebudowy całej karty.
- Ponowne przekazanie tej samej konfiguracji przez HA zachowuje otwarty formularz.
- Powrót po utracie połączenia pobiera aktualną listę, także po usunięciu harmonogramów podczas rozłączenia.
- Niezmienione harmonogramy zachowują swoje elementy; otwarty formularz zachowuje szkic i aktywne pole.
- Nagłówek nowej karty jest nieruchomy — kliknięcie nie zwija zawartości.
- Przycisk automatyki steruje encją `switch` należącą do integracji.
- Cała sekcja ręcznego sterowania jest ukryta przy włączonej automatyce; wraca po jej wyłączeniu. Do czasu potwierdzenia zamknięcia zaworów przyciski pozostają niedostępne.
- Przyciski zaworów mają kompaktowy, jednoliniowy układ i znacznik stanu. Liczba kolumn dostosowuje się do szerokości karty.
- Zwiększony numer wersji zasobu JS pozwala przeglądarce pobrać poprawiony plik.

[Opis integracji](README.pl.md) i przykłady YAML w katalogu `examples/` pomagają skonfigurować kartę i harmonogramy.

## Cache na Androidzie

**Aplikacja Home Assistant:** w aplikacji wejdź w **Ustawienia → Aplikacja towarzysząca / Companion App → Rozwiązywanie problemów** (w starszych wersjach „Debugowanie”) i wybierz **Reset frontend cache** / reset pamięci podręcznej interfejsu. Po zakończeniu zamknij i ponownie otwórz aplikację. Położenie przycisku i jego etykieta mogą zależeć od wersji i języka. Funkcja jest w [oficjalnym ekranie ustawień Android HA](https://github.com/home-assistant/android/blob/main/app/src/main/kotlin/io/homeassistant/companion/android/settings/developer/DeveloperSettingsFragment.kt).

Jeśli przycisku nie ma, spróbuj w ustawieniach Androida: **Aplikacje → Home Assistant → Pamięć / Pamięć i pamięć podręczna → Wyczyść pamięć podręczną**, a następnie wymuś zatrzymanie aplikacji i uruchom ją ponownie. Wybór **Wyczyść dane / Wyczyść pamięć** usuwa konfigurację aplikacji i wymaga ponownego logowania; do samego odświeżenia karty użyj cache. [Dokumentacja rozwiązywania problemów aplikacji](https://companion.home-assistant.io/docs/troubleshooting/faqs/).

**Chrome na Androidzie:** wybierz **⋮ → Usuń dane przeglądania → Więcej opcji**, zakres **Od początku / Cały okres** i zaznacz tylko **Obrazy i pliki zapisane w pamięci podręcznej**. Odznacz historię, cookies i pozostałe kategorie. Usuń dane i otwórz dashboard ponownie. [Instrukcja Google](https://support.google.com/chrome/answer/2392709?co=GENIE.Platform%3DAndroid&hl=pl).

Aplikacja HA i Chrome mają osobną pamięć podręczną: wyczyszczenie jednej nie odświeża drugiej. Jeżeli karta nadal się nie wczytuje na telefonie, sprawdź opisany wyżej zasób JS pod adresem HA używanym **na telefonie**. W ręcznym zasobie ustaw bieżącą wersję `?v=0.2.0`.
