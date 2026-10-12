# Irrigation 0.3.1

- Automatically register and update the card's Lovelace module resource, including removal of duplicate integration resource URLs.
- Serve a fresh bootstrap through independent frontend and Lovelace URLs, loading the bundle from a versioned path.
- Retry failed card downloads without refreshing the dashboard; resume after reconnecting or returning to the app.
- Keep the native YAML-resource fallback and avoid duplicate card-picker entries.

Update through HACS, restart Home Assistant and reopen the dashboard. The card YAML remains `type: custom:irrigation-schedule-integration-card`. No schedules, valve assignments or entity IDs change.
