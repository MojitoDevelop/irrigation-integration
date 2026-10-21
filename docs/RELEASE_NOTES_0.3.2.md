# Irrigation 0.3.2

Fixes the removed-valve ownership issue reported during HACS review.

- Removed switches are released immediately when they report `off`. Otherwise, the controller makes one bounded close attempt, then releases them even if closure cannot be confirmed.
- The cleanup attempt budget is saved before the command, so a restart does not replenish it.
- Released switches no longer participate in normal reconciliation, availability diagnostics or shutdown commands.
- Removing a valve preserves the state of other manually opened valves. Re-adding a valve cancels cleanup that has not been issued.
- Saving an options form opened before cleanup cannot restore released switches. Changes to automation or valve selection during cleanup are evaluated again before further commands.

A failed close attempt is logged. The integration relinquishes that switch rather than repeatedly switching it off.

Update through HACS and restart Home Assistant. Card YAML, entity IDs and saved schedules are unchanged.
