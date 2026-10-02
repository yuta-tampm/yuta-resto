# Codex Prompt — Phase 0: POS Kitchen Repository Analysis

Do not change runtime code or operational data. Read the complete authority set
listed in this package and inspect the current `/kitchen` route, POS shell,
site-agent order/item services, local-pos contracts, db-pos schemas, printing
boundary, and affected tests.

Re-verify and update the Phase 0 inventory for:

- `PAGE` / `EXISTING_PAGE` / integrated /
  `EXISTING_CAPABILITY_RENEWAL`;
- `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`;
- service-day 05:00 cutoff and runtime timezone;
- station/status parsing, fallback, counts, ordering, limit, and grouping;
- order/item notes, variants, allergies, confirmation, paid and cancelled
  behavior;
- exact transition matrix, validation, command errors, transaction ownership,
  concurrency, and idempotency;
- 10-second Kitchen polling and 15-second shared health/printer polling;
- upstream durable kitchen-send print jobs versus Kitchen transitions;
- current shell/navigation, responsive states, shared primitives/tokens, tests,
  conflicts, gaps, proposed changes, and exact verification commands.

Use only safe persisted read-only baseline data. Do not create an order, send a
batch, confirm an allergy, click a transition, or change a print job for QA. If
no safe populated state exists, record the missing evidence truthfully.

Resolve shared context as exactly one shell mode and capture a current browser
baseline or precise blocker. Prepare the ready design prompt, then stop. Do not
generate a mockup, start Phase 1, or implement runtime changes.
