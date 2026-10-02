# Codex Prompt — Phase 4: Data Integration or Extension

First map the current domain, data owner, transport/contracts, and trusted
runtime boundary to the approved UI.

For an existing integrated screen, do not rewrite data access merely because
the visual composition changed.

Preserve the target application's actual scope and ownership model. Do not
inject organization/establishment tenancy into local POS or other runtimes that
do not use it, and do not bypass cloud tenant rules where they apply.

Stop for approval before adding or changing a field, enum, permission, API
route, contract, schema/migration, transaction rule, runtime dependency, device
setting, printer route, or persistence owner.

Run only affected repository commands that actually exist. Include local API,
database, offline, and device tests when the approved change touches those
boundaries. Do not perform Phase 5 automatically.

For the combo-completion slice, expected flags remain database `NO`, API and
contract `NO`, permission/auth `NO`, and runtime/device `NO`. Audit that the
as-built feature consumes the current catalog response and order model, that
site-agent/payment optimization remains authoritative, and that no presentation
component became a second combo engine.
