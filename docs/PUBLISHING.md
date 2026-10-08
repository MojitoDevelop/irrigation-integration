# Publish MojitoDevelop/irrigation-integration

Repository metadata is already configured for [MojitoDevelop/irrigation-integration](https://github.com/MojitoDevelop/irrigation-integration): documentation, issues, code owner and CODEOWNERS. The local tools prepare files and archives; they do not upload commits or publish a release.

## Upload the repository

Extract `irrigation-schedule-repository-0.2.0.zip`. Upload the **contents** of its `irrigation-schedule` directory to the repository root, including `.github`, `.gitignore` and `.gitattributes`. `custom_components` must be directly at the root, with exactly one integration directory, `irrigation_schedule`.

Use the description:

> Home Assistant irrigation integration with a custom dashboard card, weekly schedules, overlapping valve control, manual operation, and live status updates. Runs entirely in Home Assistant, without Node-RED.

Keep the repository public, enable Issues and set topics such as `home-assistant`, `irrigation`, `hacs`, `lovelace`, `schedule`. README and MIT license are included.

## Verify the uploaded commit

GitHub Actions should finish successfully for the commit you intend to release:

- **Validate**: source/model/release checks, locale-key/placeholder checks, Hassfest and HACS validation.
- **Dashboard browser tests**: Chromium schedule editing, manual operation, translations and idle stability.

The workflows require only read access and do not publish releases. The HACS job checks repository settings too; its remote result cannot be replaced by a local preflight. It is configured without ignored checks.

Local checks and archives can be regenerated:

```sh
npm ci
npx playwright install chromium
python3 test-model.py
npm test
npm run test:browser
python3 test-release.py
python3 build.py --check
python3 scripts/check_release.py --repository MojitoDevelop/irrigation-integration --version 0.2.0
python3 scripts/package_release.py
```

Also run the real HA test and the [physical-device test plan](TEST_PLAN.md). `test-integration.py` requires a Python 3.14/HA 2026.10.0 environment with frontend requirements and local sockets. Local HA tests use simulated valves; do not interpret their result as proof of physical valve operation.

The release package script writes deterministic archives and `dist/SHA256SUMS`, excluding node_modules, caches, logs, `.env`, previous archives and local environments. It fails on mismatched version, metadata, locale strings or generated resources.

## Create the release

1. Confirm the uploaded commit passes CI and your installation/device tests.
2. Create a GitHub Release with tag **`v0.2.0`**, pointing at that exact commit. The manifest, constants and package files use **`0.2.0`**.
3. Use `docs/RELEASE_NOTES_0.2.0.md` as the body and add your HA/device test result.
4. Attach `irrigation-schedule-0.2.0.zip`, `irrigation-schedule-repository-0.2.0.zip` and `SHA256SUMS` if using the supplied two-file checksum list. The first archive is for manual installation; the second contains repository sources.
5. Mark it as a prerelease while physical-device validation is still ongoing. Decide whether it is stable only after those checks.
6. Test a clean HACS custom-repository install, then an update from the previous manual installation.

`hacs.json` uses the normal integration layout without `zip_release`. All runtime assets, including the JS card and locale files, are in the integration directory. HACS can install it as a custom repository; inclusion in the default catalogue is a separate reviewed step.

References: [HACS integration requirements](https://www.hacs.xyz/docs/publish/integration/), [HACS Action](https://www.hacs.xyz/docs/publish/action/), [HA custom localization](https://developers.home-assistant.io/docs/internationalization/custom_integration/).
