# Codex Prompt - Phase 0: POS Order Entry Repository Analysis

Do not change runtime code or mutate local data.

Re-read root and POS instructions, current architecture/product/operations/UI
authority, and this package. Re-inspect `/pos`, the shared POS shell, employee
helpers, `createOrderAction`, `pos-api`, site-agent client/routes/service,
`@yuta/contracts/local-pos`, db-pos orders/users schema, and affected tests.

Confirm or update the 23-part Implementation Inventory in `README.md`, including
`PAGE`, `EXISTING_PAGE`, `integrated`, `EXISTING_CAPABILITY_RENEWAL`, the
unauthenticated employee-attribution truth, local-only ownership, current
validation/persistence/redirect, health polling, protected invariants, exact
commands, expected impact, and unsupported proposals.

Confirm shared context remains `RESOLVED` with
`REUSE_APPROVED_SHARED_SHELL`, owned by `PosPageShell`, `PosHeader`, and
`PosConnectivityStatus`. Do not import the management or Backoffice shell.

For the baseline, use the real local stack and real users. Never submit the
create form merely to obtain a screenshot. Record a blocker instead of using
fixtures or bypassing current boundaries. Refresh `DESIGN_HANDOFF.md` and its
self-contained prompts when repository reality changes.

Stop after Phase 0. Do not generate a mockup or begin Phase 1 without explicit
owner approval.
