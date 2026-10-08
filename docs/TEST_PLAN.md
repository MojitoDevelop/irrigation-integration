# Wstępne testy w Home Assistant

Testy lokalne sprawdziły serwer i kartę z symulowanymi zaworami. Poniższe próby potwierdzają działanie w Twoim HA i na Twoich urządzeniach. Zanotuj wersję HA, wersję integracji, wynik oraz ewentualne logi.

## Instalacja

1. Wyłącz wcześniejszy sterownik tych zaworów i zachowaj istniejące pomocniki Schedule.
2. Zainstaluj folder `custom_components/irrigation_schedule`, uruchom ponownie HA i dodaj „Nawodnienie”.
3. Sprawdź, że początkowo nie zaznaczono żadnego zaworu, nawet jeśli HA ma stare przełączniki nawodnienia. Wybierz zawory, ustaw nazwy i dodaj kartę z `card.yaml`. Po odświeżeniu powinna działać bez ręcznego zasobu JS.
4. Sprawdź własny przełącznik automatyki i sensor statusu. W trybie ręcznym otwórz i zamknij jeden zawór, potwierdzając jego działanie na urządzeniu.

## Cały harmonogram i dni

1. Dodaj „Test A”: poniedziałek, środa i piątek, 12:00–13:00, zawory 1 i 2.
2. Otwórz zapisany harmonogram. Zmień godziny na 10:30–12:30, dni na wtorek i czwartek, zawory na 2 i 3 oraz nazwę.
3. Zapisz. Ma pozostać jeden harmonogram ze wszystkimi zmianami; stare dni i godziny mają zniknąć.
4. Rozpocznij kolejną edycję i wybierz „Anuluj”. Zapisane dane mają pozostać bez zmian, a formularz ma się zamknąć.
5. Odśwież stronę i sprawdź dane. Usuń testowy harmonogram: jego pomocnik Schedule również ma zniknąć.

## Nakładanie harmonogramów

Wybierz krótkie przedziały na dzisiejszy dzień, rozpoczynające się kilka minut po bieżącej godzinie w strefie czasowej HA:

- A: zawory 1 i 2, od początku próby do minuty 4;
- B: zawory 2 i 3, od minuty 2 do minuty 6.

Włącz automatykę i obserwuj:

1. Początek A: otwarte 1 i 2.
2. Początek B: otwarte 1, 2 i 3.
3. Koniec A: zamknięty 1; zawory 2 i 3 nadal otwarte.
4. Koniec B: wszystkie zamknięte.

Sensor ma wskazywać nazwy aktualnie aktywnych harmonogramów. Powtórz przynajmniej jedną próbę po zamknięciu aplikacji i przeglądarki.

## Wyłączenie i sterowanie ręczne

- Wyłącz automatykę podczas aktywnego podlewania. Zawory mają się zamknąć, a ręczne przyciski uaktywnić po potwierdzeniu stanu.
- Otwórz ręcznie jeden zawór i odczekaj co najmniej 15 sekund: sterownik w trybie ręcznym ma zachować jego stan.
- Użyj „Zamknij wszystkie”. Włącz automatykę: wymagane zawory mają odpowiadać aktualnym harmonogramom.

## Zmiana zaworów w integracji

- Zmień nazwy i kolejność w opcjach integracji. Harmonogramy mają nadal wskazywać te same encje, a karta pokazać nowe nazwy.
- Usuń otwarty zawór z konfiguracji: sterownik powinien go zamknąć. Harmonogram korzystający z usuniętej encji ma wskazywać problem do poprawienia, bez przypisania innego zaworu na jego miejsce.
- Jeśli używasz `valves` w YAML karty, aktualizuj tę listę również tam. Do testów opcji wygodniejsza jest karta bez jawnej listy.

## Restart i błędy

- Zrestartuj HA przy włączonej automatyce i aktywnym krótkim harmonogramie. Po starcie stan ma odpowiadać bieżącemu harmonogramowi, a konfiguracja pozostać zapisana.
- Przy wyłączonej automatyce restart rozpoczyna tryb ręczny od zamknięcia zaworów; nie oczekuj przywrócenia ręcznego otwarcia.
- Jeśli możesz czasowo odłączyć jeden zawór, sprawdź status niedostępności i ponowienie po odzyskaniu łączności. Nie oczekuj skutecznego zamknięcia urządzenia bez połączenia; manualny tryb czeka na potwierdzenie zamknięcia.
- Sprawdź wpis 23:30–01:15: karta ma odtworzyć go jako jeden harmonogram. Pełną próbę przez północ wykonaj, jeśli taki wpis będzie używany.

## Przed publikacją

- Podczas otwartej edycji wpisz roboczą nazwę i godziny, poczekaj przynajmniej 90 sekund oraz zmień stan jednego zaworu. Karta nie powinna mrugać, a szkic i aktywne pole mają pozostać zachowane.
- Zmień pomocnik Schedule poza kartą: lista ma się zaktualizować bez przycisku Odśwież. Zmień nazwę zaworu w opcjach integracji i potwierdź aktualizację nazwy w karcie.
- Przerwij połączenie klienta z HA i przywróć je. Lista ma pokazać również zmiany wykonane podczas rozłączenia, zachowując niezapisany szkic.
- Sprawdź ładowanie karty w aplikacji HA i Chrome na Androidzie po wyczyszczeniu ich osobnych cache. Instrukcja jest w `INSTALL.md`.
- Usuń harmonogramy testowe i potwierdź zamknięcie zaworów.
- Sprawdź kartę skoczka i nawigację do `/irrigation`.
- Zanotuj wyniki oraz logi związane z `custom_components.irrigation_schedule`.
- Zapisz wykryte problemy; wydanie przygotowujemy po ich poprawieniu i ponownym sprawdzeniu odpowiednich prób.

## Języki 0.2.0 i identyfikatory

- Przełącz język użytkownika HA kolejno na polski, angielski i niemiecki. Po wczytaniu dashboardu karta oraz skoczek mają tłumaczyć przyciski, dni, godziny i komunikaty statusu. Nazwy nadane przez użytkownika pozostają jego tekstem.
- Usuń jawny `title` z YAML, aby sprawdzić tłumaczenie nagłówka. Podczas zmiany języka otwarta edycja karty głównej ma zachować szkic.
- Ustaw inny język użytkownika niż język serwera HA: tekstowy sensor używa języka serwera, a karta główna i skoczek mogą pokazywać status w języku użytkownika.
- Przy nowej instalacji sprawdź `switch.irrigation_automation` i `sensor.irrigation_status`. Przy aktualizacji istniejące polskie ID mają pozostać zachowane bez nowych, zdublowanych encji.
- Sprawdź nowy pomocnik `schedule.irrigation_*` obok starego `schedule.nawodnienie_*`: oba mają być widoczne i sterować odpowiednimi zaworami.
- W opcjach integracji konfiguracja zaworów ma pozostać zaznaczona; brak domyślnego wyboru dotyczy dodawania nowej integracji.
