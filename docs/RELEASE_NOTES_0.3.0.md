# Irrigation 0.3.0

- Activate or deactivate each schedule directly in the dashboard card.
- Inactive schedules remain saved and editable, but do not request valves or appear as active in the status sensor.
- Activity applies to all weekdays and overnight fragments, and survives HA restarts.
- Existing schedules are active by default. Editing an inactive schedule keeps it inactive.
- A shared valve stays open while another active schedule still needs it.
- English, Polish and German controls and status labels.

Update through HACS and restart Home Assistant. Card type remains `custom:irrigation-schedule-integration-card`. Manual dashboard resources should use `/irrigation_schedule/irrigation-schedule-card.js?v=0.3.0`.
