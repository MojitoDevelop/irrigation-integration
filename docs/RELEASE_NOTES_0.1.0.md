# Nawodnienie 0.1.0

Pierwsze wydanie integracji Home Assistant do sterowania harmonogramami nawodnienia bez Node-RED.

- Konfiguracja encji zaworów i nazw w „Urządzenia i usługi”.
- Edycja całych harmonogramów, także dni, godzin oraz zaworów.
- Obsługa nakładających się wpisów i przedziałów przez północ.
- Automatyka działająca na serwerze HA bez otwartej aplikacji.
- Dołączona karta, przełącznik automatyki, status i sterowanie ręczne.

**Wymagania:** Home Assistant 2026.10.0 lub nowszy. Testy automatyczne wykonano na 2026.10.0; kolejne wersje nie są objęte gwarancją zgodności. Zawory muszą być encjami `switch`.

**Instalacja HACS:** dodaj adres tego repozytorium jako repozytorium niestandardowe kategorii „Integration”, pobierz integrację, uruchom ponownie HA i dodaj „Nawodnienie” przez „Urządzenia i usługi”.

**Instalacja ręczna:** rozpakuj `irrigation-schedule-0.1.0.zip` i skopiuj zawartość `custom_components` do `/config/custom_components`, potem zrestartuj HA.

**Migracja:** wyłącz wcześniejszy sterownik Node-RED albo pakiet YAML. Zachowaj istniejące pomocniki Schedule z poprzedniej wersji HA. Nie uruchamiaj dwóch sterowników tych samych zaworów jednocześnie.

Główna karta:

```yaml
type: custom:irrigation-schedule-integration-card
title: Nawodnienie
```

Karta rejestruje się automatycznie. Nie trzeba dodawać zasobu ani kopiować plików do `www`. Opcjonalny skoczek wymaga osobno `custom:button-card`.

Sterownik działa podczas pracy serwera HA. Status opiera się na stanach encji, nie na fizycznym pomiarze przepływu. Ręczne otwarcia nie są automatycznie odtwarzane po restarcie; integracja rozpoczyna tryb ręczny od zamknięcia zaworów.
