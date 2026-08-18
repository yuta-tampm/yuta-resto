# Codex Prompt — Phase 3: Approved Interactions

For the active receipt initiative, implement no action until a dedicated
vertical slice is approved. Queue acceptance must not be labelled physical
success; double submission/retry must use UUIDv7 idempotency; split-target and
reprint behavior must follow the approved product decision.

Implement only interactions approved by current product documentation and this
page package.

Preserve the target application's actual trust model: cloud
authorization/tenant scope, public-resolution boundary, local POS session,
standalone-local ownership, or another repository-defined boundary. Do not
assume a Backoffice tenant model.

Preserve current mutation/action/transaction ownership, validation,
destructive confirmation, merge/replace rules, dirty-state behavior, polling,
retry, offline recovery, device behavior, and idempotency where applicable.

Do not add a state/form/data library for one page when the repository already
has an established approach.

The approved `Remise` disclosure is presentation-only and read-only. Preserve
the aggregate amount when collapsed, expose real discount entries when
expanded, support keyboard/touch operation and semantic expanded state, and do
not add apply/edit/remove controls or recalculate totals.

Test applicable keyboard, touch, focus, pending, validation, success, error,
degraded, retry, and recovery behavior. Report exact commands and results. Do
not perform Phase 4 automatically.
