"""Constants for the irrigation controller."""
DOMAIN = 'irrigation_schedule'
VERSION = '0.3.0'
PLATFORMS = ['switch', 'sensor']
SCHEDULE_PREFIX = 'schedule.irrigation_'
LEGACY_SCHEDULE_PREFIX = 'schedule.nawodnienie_'
MASTER_ENTITY = 'switch.irrigation_automation'
STATUS_ENTITY = 'sensor.irrigation_status'
CARD_URL = f'/irrigation_schedule/irrigation-schedule-card.js?v={VERSION}'
