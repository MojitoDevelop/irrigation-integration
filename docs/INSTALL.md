# Installation and update — 0.3.3

1. Open **HACS**, search for **Irrigation** and download it. You can also [open its HACS listing](https://my.home-assistant.io/redirect/hacs_repository/?owner=MojitoDevelop&repository=irrigation-integration&category=integration).
2. Restart Home Assistant.
3. For a new installation, add **Irrigation** in **Settings → Devices & services**, select valve switch entities, then set their display names. No entities are selected by default. An update preserves your existing configuration and registered entity IDs.
4. Reopen the dashboard and use:

```yaml
type: custom:irrigation-schedule-integration-card
```

The old `custom:irrigation-schedule-card` belongs to the earlier flow/package version. Remove old resources for that card from active dashboard use.

The integration automatically registers its JavaScript. If the new card is missing, open `/irrigation_schedule/irrigation-schedule-card.js?v=0.3.3` on your HA server and check it returns the JavaScript bootstrap with the bundle path `/irrigation_schedule/0.3.3/irrigation-schedule-card.js`. If necessary, add this dashboard resource manually:

```yaml
url: /irrigation_schedule/irrigation-schedule-card.js?v=0.3.3
type: module
```

In storage mode, the integration updates its resource URL automatically and removes duplicate URLs for this integration. In YAML resource mode, frontend registration still loads the card; you can also add the module above to your configured resources. Do not point it at an old `/local/` copy of the card.

## Alternative installation

If HACS search does not show Irrigation, add `https://github.com/MojitoDevelop/irrigation-integration` as a custom repository with category **Integration**, then download it.

For manual installation, download and extract the latest release, copy `custom_components/irrigation_schedule` into `/config/custom_components/irrigation_schedule`, then restart HA and add the integration. Keep your existing Schedule helpers and configuration.

## HACS store icon

The integration includes light and dark brand icons in `custom_components/irrigation_schedule/brand/`. Some HACS versions show a placeholder despite valid local brand assets. The maintainer identifies this as fixed in Marketplace for Home Assistant 2026.11; see the [upstream report](https://github.com/hacs/integration/issues/5171#issuecomment-6222990878). Changing the integration icon files does not resolve that HACS rendering issue.

## Language and entity names

English, Polish and German are selected by HA language, with an English fallback. Omit an explicit `title` from card YAML for a translated heading. Names supplied by users stay unchanged.

Fresh installations create `switch.irrigation_automation` and `sensor.irrigation_status`; legacy registered IDs stay unchanged during an update. The main card detects actual IDs. In `examples/navigation-card.yaml`, set `entity` to the existing status sensor if it still has a legacy Polish ID.

Preserve native Schedule helpers when updating. Both `schedule.irrigation_*` and legacy `schedule.nawodnienie_*` are supported. Disable any previous Node-RED/YAML controller before using this integration.

## Android cache

**HA Companion app:** use **Settings → Companion app → Troubleshooting → Reset frontend cache**, then close and reopen the app. Menu labels depend on app version/language. Alternatively use Android **Settings → Apps → Home Assistant → Storage → Clear cache**, then force-stop and reopen. Clearing app data is a separate operation that removes its login/configuration. [Companion troubleshooting](https://companion.home-assistant.io/docs/troubleshooting/faqs/).

**Chrome:** open **⋮ → Delete browsing data → More options**, choose **All time** and select **Cached images and files**. Clear that cache and reopen the dashboard. [Chrome help](https://support.google.com/chrome/answer/2392709?co=GENIE.Platform%3DAndroid).

The app and Chrome have independent caches. Test the JavaScript URL above using the HA address configured on the affected phone.

[Polska instrukcja](INSTALL.pl.md) · [README](../README.md)

## Schedule activity

Each saved schedule has an activity switch in the card. Turning it off preserves its days, times and valves, while excluding it from irrigation control. The setting survives HA restarts. Existing schedules are active by default.
