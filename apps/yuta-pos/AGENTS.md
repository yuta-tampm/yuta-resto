# YUTA POS Agent Instructions

`apps/yuta-pos` is a local-only restaurant POS client. Operator-facing UI text
is French; code and engineering documentation are English.

For UI work, read and follow both:

- `docs/ui/YUTA_FRONTEND_RULES.md`;
- `docs/ui/POS_FRONTEND_RULES.md`.

Also read the current POS product, operator, offline, QA, local-development,
and deployment documents relevant to the target.

## Runtime and persistence

- Access operational persistence only through `apps/site-agent`; never import
  `@yuta/db-cloud` or `@yuta/db-pos` into the POS client.
- Never add cloud synchronization for orders, payments, kitchen state, print
  jobs, local staff, menu snapshots, or operational reports.
- Preserve the existing `apps/yuta-pos -> apps/site-agent -> packages/db-pos`
  ownership boundary and current `@yuta/contracts/local-pos` transport model.
- Browser/UI code must not become the owner of transaction logic, database
  access, privileged printer/device configuration, or service-owned
  calculations.

## Behavior protection

Preserve historical accuracy, no-hard-delete rules, payment invariants,
kitchen batches, print-job behavior, local-session authorization, idempotency,
service-day filtering, polling semantics, and offline-safe/degraded failure
handling.

Existing integrated POS screens must be improved in place. Do not replace real
data or working site-agent interactions with fixtures to establish a mock
visual baseline.

## UI

Reuse `@yuta/ui`. Keep service-time screens fast, clear, touch-friendly, and
operational rather than marketing-oriented. Preserve usable focus, status,
loading, disabled, pending, retry, local-service, and device-disconnected
states.

Follow the repository Next.js component-placement convention. POS-wide
components belong in `src/components/<domain>/`; route-subtree components
belong in the nearest `_components`; one-route components belong in that
route's `_components`; and extracted route-local non-UI logic belongs in
`_lib`, `_utils`, or another clearly owned folder. Do not recreate
`src/app/components`, and do not promote POS business components to
`@yuta/ui`.

Reference images are visual guidance only. They do not authorize changes to
station routing, print classification, order/payment logic, roles, contracts,
APIs, schema, or hardware settings.

## Documentation and verification

Update current POS product/operator/QA/offline/local-development/deployment
documentation when behavior changes.

Use existing repository checks appropriate to the change, including
architecture check, POS typecheck/tests/build, and affected site-agent, db-pos,
offline, contracts, core, and UI checks. Do not claim lint unless a real lint
command is added to the repository.
