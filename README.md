# Irrigation for Home Assistant

A custom integration with a dashboard card for weekly irrigation schedules, overlapping valve control, manual operation and live status. The controller runs on the Home Assistant server, including when every browser and app is closed.

**Version 0.2.0.** Supports Home Assistant **2026.10.0 or newer**; 2026.10.0 is the tested runtime. English, Polish and German interfaces. [Polska dokumentacja](README.pl.md).

![Irrigation dashboard](preview-light.png)

## Installation

Copy `custom_components/irrigation_schedule` into `/config/custom_components/irrigation_schedule`, restart Home Assistant, then add **Irrigation** in **Settings → Devices & services**. Select the valve `switch` entities and enter their display names. A new installation starts with **no valves selected**; at least one valve is required. Options for an existing installation retain its configured valves.

Once the repository has been published, it can also be added as a HACS custom repository:

- Repository: `https://github.com/MojitoDevelop/irrigation-integration`
- Category: **Integration**

Restart HA after installation or an update. This repository is not automatically part of the HACS default catalogue.

Add the dashboard card:

```yaml
type: custom:irrigation-schedule-integration-card
```

The integration serves and registers the card automatically. Its files do not need to be copied to `www`. [Installation and troubleshooting](INSTALL.md).

## Languages and default names

The card follows the current HA user's language; configuration and options forms use HA's native translations. English, Polish and German are supported, with English as the fallback. The textual sensor uses the HA server language. Structured status attributes allow the main card and navigation card to display that status in the current user's language.

Custom schedule/valve names and an explicit YAML `title` are preserved as supplied. Omit `title` for a translated heading. Changing the interface language does not rewrite schedules or valve assignments.

New integration entities use English default names and IDs:

| Entity | Default name | Purpose |
| --- | --- | --- |
| `switch.irrigation_automation` | Irrigation automation | Enable or disable automatic control |
| `sensor.irrigation_status` | Irrigation status | Current activity and diagnostics |
| `schedule.irrigation_*` | Irrigation … | Native weekly Schedule helpers created by the card |

Existing registry IDs from older versions, including `switch.nawodnienie_automatyka`, `sensor.nawodnienie_integracja_status` and `schedule.nawodnienie_*`, are retained and supported. The main card discovers the actual integration entity IDs. External valve entities are never renamed.

## Valve configuration

Use the integration's options to add/remove valves and change their display names. Assignments are stored by entity ID, so renaming or reordering valves does not change watering assignments.

Optional card YAML can configure valves too:

```yaml
type: custom:irrigation-schedule-integration-card
valves:
  - entity: switch.garden_lawn
    name: Lawn
  - entity: switch.garden_beds
    name: Flower beds
```

An administrator's first card load persists an explicit YAML list into the integration. Loading another card with a different explicit list may apply that list. For a single source of truth, use integration options and omit `valves` from the card. [Original 12-valve example](card-with-valves.yaml).

Removed valves are retained internally until the controller can confirm they are closed. Re-adding an entity returns it to the active catalogue.

## Scheduling and operation

- One card entry owns a complete native Schedule helper: name, selected start days, time window and valves. Editing replaces the entire logical schedule across all selected days. Adding and deleting helpers is available in the card.
- Overlapping schedules request the union of their valves. A valve stays open while any active schedule requires it.
- Overnight windows continue into the next day. Selected weekdays are start days. HA interprets times using its configured time zone.
- Disabling automation closes controlled valves before allowing manual control. Manual controls are hidden while automation is enabled. In manual mode the controller preserves manually selected states.
- The controller responds to HA events, with a five-second server fallback check. The frontend has no periodic polling timer: schedule changes use HA collection notifications; state updates change only the relevant display elements.
- The controller confirms switch states, retries failed commands, and reevaluates the latest intent before each command. Disabling automation during an operation prevents subsequent planned opens.
- After restart, enabled automation applies the current schedules. With automation disabled, the controller confirms closure before releasing manual control. Manual open states are not restored as schedules.

The controller requires a running HA server and available devices. Switch-state confirmation is not a physical measurement of water flow. Valve behaviour during power or connection loss depends on the devices.

## Dashboard

The main card has a transparent background and a fixed, non-collapsible heading. The schedule form opens with **Add schedule** and closes with **Cancel**. Default times are **12:00–13:00**. Creating schedules, configuring valves and manual control require an HA administrator account.

[Navigation card YAML](navigation-card.yaml) uses only `custom:button-card`, with an icon, translated name and status. It navigates to `/irrigation`. Set `entity` to the actual status sensor if updating an older installation, and adjust `variables.navigation_path` if necessary. This separate card requires button-card to be installed. Its translated templates are evaluated when the card is loaded or its tracked state updates; reload the dashboard after changing the profile language if necessary.

## Updating older installations

Replace the integration folder, restart HA and refresh the frontend cache. Existing unique IDs, valve configuration and Schedule helpers are preserved. The card continues to recognise legacy Polish helper names and entity prefixes, as well as v1 numerical assignments to the original `switch.nawodnienie_strefa_N` entities.

Disable any earlier Node-RED flow or YAML irrigation controller before using this integration. Preserve your Schedule helpers. The integration does not import arbitrary flow formats. Invalid helpers are labelled **Error** for correction or deletion; old catalogue helpers are ignored by the controller.

## Validation and development

Local validation covers a real HA 2026.10.0 runtime with simulated switch valves, configuration/options flows, Schedule CRUD and push notifications, restart, legacy entity IDs, unload, unavailable valves, command failures and overlapping schedules. Browser tests cover all three languages, language changes during editing, accessibility labels, complete schedule updates, manual operation and 95 seconds of idle time with zero API calls or DOM changes. Physical-device checks remain the maintainer's responsibility before a stable release. [Test plan](docs/TEST_PLAN.md).

```sh
npm ci
npx playwright install chromium
python3 test-model.py
npm test
npm run test:browser
python3 test-release.py
python3 build.py --check
python3 scripts/check_release.py --repository MojitoDevelop/irrigation-integration --version 0.2.0
```

`test-integration.py` requires Python 3.14 with HA 2026.10.0, frontend requirements and local network sockets. `test-navigation.cjs` also requires an official button-card JavaScript file specified with `IRRIGATION_BUTTON_CARD`. That dependency is not distributed in this repository.

Edit card code in `card-source`; edit shared display strings in `custom_components/irrigation_schedule/locales/{en,pl,de}.json`. Native HA translations are in `translations/{en,pl,de}.json`, with English `strings.json`. Run `python3 build.py` after changes: it regenerates the single-file card and translated navigation YAML. The server loads locale files through an executor at startup.

GitHub Actions validate source, browser behaviour, Hassfest and HACS metadata. [Publication checklist](docs/PUBLISHING.md), [release notes](docs/RELEASE_NOTES_0.2.0.md), [changelog](CHANGELOG.md).

## License

[MIT](LICENSE), including the bundled brand graphics. Icon source: [docs/assets/icon.svg](docs/assets/icon.svg).
