# Nawodnienie 0.1.3 — aktualizacja przez powiadomienia HA

Usunięty został timer karty, który co 30 sekund odczytywał harmonogramy. Karta korzysta teraz z powiadomień natywnej kolekcji Schedule: reaguje na utworzenie, edycję i usunięcie pomocnika, również poza kartą. Stan automatyki, zaworów i sensora nadal zmienia się na bieżąco przez aktualizacje HA. Przycisk Odśwież pozostaje dostępny.

Identyczne wywołanie konfiguracji nie odtwarza karty. Powrót po utracie połączenia pobiera aktualną listę, także gdy harmonogramy usunięto podczas rozłączenia. Zmiana listy zaworów w opcjach integracji powoduje jednorazowy odczyt konfiguracji.

Test przeglądarkowy obejmuje 95 sekund bezczynności: zero wywołań API i zero zmian DOM, z zachowanym szkicem i aktywnym polem. Sprawdzono również zmiany pomocników poza kartą, powrót po rozłączeniu, porządkowanie subskrypcji oraz API powiadomień w rzeczywistym HA 2026.10 z symulowanymi zaworami. Potwierdzenie na urządzeniach użytkownika pozostaje częścią wstępnych testów.

Podmień folder `custom_components/irrigation_schedule`, uruchom ponownie HA i odśwież klienta. Przy ręcznie dodanym zasobie ustaw `/irrigation_schedule/irrigation-schedule-card.js?v=0.1.3`. Typ karty: `custom:irrigation-schedule-integration-card`.

Zapisane harmonogramy i sterownik serwerowy zachowują dotychczasowe działanie. HACS jest na razie odłożony.
