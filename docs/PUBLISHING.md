# Release Irrigation

Repository: [MojitoDevelop/irrigation-integration](https://github.com/MojitoDevelop/irrigation-integration).

## Prepare the package

Keep the repository public with Issues enabled and topics such as `home-assistant`, `irrigation`, `hacs` and `lovelace`.

```sh
python3 scripts/build.py --check
python3 scripts/check_release.py --repository MojitoDevelop/irrigation-integration --version 0.2.0
python3 scripts/package_release.py
```

The package script produces manual-install and repository archives with `dist/SHA256SUMS`. Local environments, caches, logs and previous archives are excluded. Development tests are maintained separately.

## Publish a release

1. Confirm that GitHub Actions **Validate** passes release preflight, Hassfest and HACS checks. Confirm operation on your HA installation and valves.
2. Create a GitHub Release with tag **`v0.2.0`** at the verified commit. Use [release notes](RELEASE_NOTES_0.2.0.md) as the description.
3. Attach `irrigation-schedule-0.2.0.zip`, `irrigation-schedule-repository-0.2.0.zip` and `SHA256SUMS`. Use a prerelease while device testing is ongoing.
4. Verify installation and update through HACS as a custom repository, category **Integration**.

The **Prepare release artifacts** workflow can generate these archives from a selected version. It does not publish a release.

All runtime assets are inside `custom_components/irrigation_schedule`. HACS installs the standard integration layout; inclusion in the default catalogue is a separate step.

[HACS integration requirements](https://www.hacs.xyz/docs/publish/integration/) · [HACS Action](https://www.hacs.xyz/docs/publish/action/)
