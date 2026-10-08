# Installation and update — 0.2.0

1. Extract the archive and copy **`custom_components/irrigation_schedule`** into **`/config/custom_components/irrigation_schedule`**, replacing the old integration folder.
2. Restart Home Assistant.
3. For a new installation, add **Irrigation** in **Settings → Devices & services**, select valve switch entities, then set their display names. No entities are selected by default. An update preserves your existing configuration and registered entity IDs.
4. Refresh the frontend cache and use:

```yaml
type: custom:irrigation-schedule-integration-card
```

The old `custom:irrigation-schedule-card` belongs to the earlier flow/package version. Remove old resources for that card from active dashboard use.

The integration automatically registers its JavaScript. If the new card is missing, open `/irrigation_schedule/irrigation-schedule-card.js?v=0.2.0` on your HA server and check it returns JavaScript starting with `const INTEGRATION_CARD_VERSION = "0.2.0";`. If necessary, add this dashboard resource manually:

```yaml
url: /irrigation_schedule/irrigation-schedule-card.js?v=0.2.0
type: module
```

An older manual resource must use the current version query. Do not point it at an old `/local/` copy of the card.

## Language and entity names

English, Polish and German are selected by HA language, with an English fallback. Omit an explicit `title` from card YAML for a translated heading. Names supplied by users stay unchanged.

Fresh installations create `switch.irrigation_automation` and `sensor.irrigation_status`; legacy registered IDs stay unchanged during an update. The main card detects actual IDs. In `examples/navigation-card.yaml`, set `entity` to the existing status sensor if it still has a legacy Polish ID.

Preserve native Schedule helpers when updating. Both `schedule.irrigation_*` and legacy `schedule.nawodnienie_*` are supported. Disable any previous Node-RED/YAML controller before using this integration.

## Android cache

**HA Companion app:** use **Settings → Companion app → Troubleshooting → Reset frontend cache**, then close and reopen the app. Menu labels depend on app version/language. Alternatively use Android **Settings → Apps → Home Assistant → Storage → Clear cache**, then force-stop and reopen. Clearing app data is a separate operation that removes its login/configuration. [Companion troubleshooting](https://companion.home-assistant.io/docs/troubleshooting/faqs/).

**Chrome:** open **⋮ → Delete browsing data → More options**, choose **All time** and select **Cached images and files**. Clear that cache and reopen the dashboard. [Chrome help](https://support.google.com/chrome/answer/2392709?co=GENIE.Platform%3DAndroid).

The app and Chrome have independent caches. Test the JavaScript URL above using the HA address configured on the affected phone.

[Polska instrukcja](INSTALL.pl.md) · [README](../README.md)
