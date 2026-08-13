# Backoffice Équipe — Salariés

Status: Partially integrated — real read and development create slices

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-13

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/equipe/salaries`

Runtime family: `cloud`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Package status: `implementation-ready`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

No-image reference reason: `NOT_APPLICABLE`; draft desktop and mobile references now exist.

## Current implementation

The canonical route now uses the first real read-only vertical slice. It has a
personnel list contract, cloud-owned employee dossier table and migration,
OWNER-only read permission, trusted establishment context, tenant-scoped
repository, real summary/list/search/filter states, and truthful loading,
empty, forbidden, and error behavior. Typed fictional fixtures and the state
simulator have been removed.

Employee creation is implemented for development with validation, duplicate
review, idempotent retry, and atomic minimal audit. Editing and departure remain
disabled. No production seed, secure document storage, OCR, personnel-register
model, Formalités engine, or PDF generator exists.

The route remains under `NEW_CAPABILITY_DISCOVERY` until the approved write
slices and final QA are complete. `users` and `tenant_memberships` remain login
and restaurant-access records; they are not employee records.

Current sources:

- route: `apps/backoffice/src/app/(authenticated)/equipe/salaries/page.tsx`;
- integrated read composition/model:
  `apps/backoffice/src/app/(authenticated)/equipe/salaries/`;
- authenticated layout: `apps/backoffice/src/app/(authenticated)/layout.tsx`;
- shell/navigation: `apps/backoffice/src/components/backoffice-frame.tsx` and
  `apps/backoffice/src/components/backoffice-navigation.ts`;
- session/tenant resolution: `apps/backoffice/src/server/auth/session.ts`;
- permissions: `apps/backoffice/src/server/auth/permissions.ts`;
- cloud schema authority: `packages/db-cloud/src/schema/`.

## Authority

Read in order:

1. root `AGENTS.md`;
2. `apps/backoffice/AGENTS.md`;
3. `docs/CURRENT_STATE.md` and current architecture documentation;
4. `docs/ui/README.md`, `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`,
   `docs/ui/DELIVERY_WORKFLOW_MODES.md`, and `docs/ui/YUTA_FRONTEND_RULES.md`;
5. implemented contracts, schema, session/authorization, and tests;
6. `docs/ui/BACKOFFICE_FRONTEND_RULES.md`;
7. this page package;
8. `packages/ui/src/index.ts` and semantic tokens;
9. reviewed visual references.

The functional proposal under
`C:\Users\Tam\Downloads\yuta-salaries-functional-pack\docs` is discovery
input only. It is not repository authority and must not be copied mechanically.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

- `references/design-proposal-desktop-01.png` — corrected desktop overview,
  operational employee list, and contained detail composition.
- `references/design-proposal-mobile-01.png` — responsive mobile list-card
  composition using the current no-sidebar mobile shell behavior.
- `references/CURRENT_UI_AUDIT.md` — selectively merged review of what to keep,
  refine, defer, and never infer from the draft references.
- `references/README.md` records review metadata and non-authoritative limits.
- `../../references/yuta-shell-brand-reference.png` provides approved shared
  Backoffice shell and brand direction only.

Images are non-authoritative.

## Phase 0 Implementation Inventory

1. **Target:** cloud Backoffice page at `/equipe/salaries`.
2. **Target type:** `PAGE`.
3. **Classification:** `NEW_PAGE`; the route is a truthful placeholder.
4. **Implementation class:** intended `integrated`; no integration exists.
5. **Composition:** reuse `BackofficeFrame`, `BackofficePage`, current sidebar,
   topbar, tenant selector, account area, mobile drawer, and footer.
6. **Trust boundary:** validated server session and active establishment-level
   membership resolve trusted organization and establishment scope.
7. **Data owner:** future employee records are proposed establishment-owned
   cloud data; no current persistence owner exists.
8. **Transport:** no employee contract or transport schema exists.
9. **Behavior:** no employee loader, action, mutation, validation, or transaction exists.
10. **Runtime behavior:** no polling, offline, provider, printer, worker, or device behavior applies.
11. **UI reuse:** current `@yuta/ui` cards, lists/tables, badges, forms, dialogs,
    alerts, empty/error/loading states, semantic tokens, and Lucide icons.
12. **Tests:** no employee tests exist; auth, tenant, navigation, contracts, and
    cloud-database tests protect adjacent boundaries.
13. **Documentation:** `CURRENT_STATE.md` identifies employees and Formalités as
    planned empty surfaces; architecture documents own tenancy and identity.
14. **Invariants:** cloud/local separation, trusted server scope, fail-closed
    authorization, no browser-trusted scope, no POS staff reuse, and no
    identity-membership/employee conflation.
15. **Baseline:** `NOT_APPLICABLE`; no employee screen exists to capture.
16. **Conflicts:** the supplied pack calls itself approved, assumes document-first
    onboarding and broad legal workflows, and uses a non-canonical phase plan.
17. **Unsupported concepts:** documents, OCR, remuneration, contract/Formalités
    generation, DPAE/DSN, apprenticeship, register/PDF compliance, interns,
    cross-establishment HR, and employee self-service.
18. **Phase 0 impact:** this package and documentation indexes only.
19. **Flags:** database `PROPOSAL`; API/contract `PROPOSAL`;
    permission/auth `PROPOSAL`; runtime/device `NO`.
20. **Commands:** `pnpm ui:pack:check backoffice-equipe-salaries`,
    `pnpm test:ui-pack`, `pnpm docs:check`, `pnpm format:check`, and
    `pnpm architecture:check`; later code phases add affected typechecks/tests/builds.
21. **Later files:** route-local UI first; domain/auth/contracts/repository/schema
    files only after separate approval.
22. **Context:** YUTA global and Backoffice application layers are approved; the
    Équipe section has navigation but no separate section shell; the page is new.
23. **Shell mode:** `REUSE_APPROVED_SHARED_SHELL`; shared navigation, header,
    account/session UI, tenant switching, and routes must not be invented.

## Shared UI context

The page inherits the current YUTA visual foundation and authenticated
Backoffice shell. Nearby planned routes do not become implemented capabilities.
Page content may adapt responsively; application-shell ownership is excluded.

Exact shell/navigation mode: `REUSE_APPROVED_SHARED_SHELL`.

## Protected invariants

- Employee data never comes from or synchronizes with POS local staff data.
- Future records are establishment-owned and all access uses trusted
  organization and establishment scope.
- Browser-provided scope, role, permission, entitlement, or identifiers are not authorization evidence.
- `users` and `tenant_memberships` remain identity/access records.
- `STAFF` is denied in the recommended MVP; manager access needs explicit approval.
- Departure is non-destructive; register/legal claims require separate history,
  retention, and immutability design.
- Sensitive fields/documents require purpose, access, retention, security, and audit approval.

## Change impact

```text
Files expected to modify: docs/README.md; docs/ui/pages/README.md
Files expected to create: docs/ui/pages/backoffice-equipe-salaries/**
Packages affected: documentation only in Phase 0
Cross-application impact: none
Database change: PROPOSAL
API or contract change: PROPOSAL
Permission/auth change: PROPOSAL
Runtime/device change: NO
```

## Design approval

Product scope and visual direction were approved by the product owner on
2026-08-13 for the typed-fixture Phase 1 prototype. The generated desktop and
mobile references are `APPROVED` as visual direction only; this does not
approve production integration.

The external feedback pack reviewed on 2026-08-13 was not copied into the
repository. Its useful UI findings were reconciled in place. Documents,
Formalités, register/PDF, apprenticeship, and other sensitive/legal concepts
remain explicit future capability waves rather than Phase 1 scope.

The approved first slice is establishment-owned and `OWNER`-only. `STAFF` is
denied; manager access remains deferred until a dedicated personnel-management
authorization decision exists.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. run the prompt in `DESIGN_HANDOFF.md` only after approval and review its output;
3. `prompts/01_VISUAL_BASELINE.md` only after scope/reference approval;
4. `prompts/02_COMPONENT_REFACTOR.md`;
5. `prompts/03_INTERACTIONS.md`;
6. `prompts/04_DATA_INTEGRATION.md` only after domain/security approval;
7. `prompts/05_VISUAL_QA.md`.

## Stop conditions

Stop before generating a reference, creating a prototype, or adding/changing
any employee field, enum, permission, entitlement, contract, API, repository,
schema, migration, storage provider, audit model, retention behavior, or
legal-compliance claim without its explicit approval.

## Final delivery and as-built status

Final implementation locations/files changed: `PENDING`

Verification commands and results: `PENDING`

Functional/regression QA result: `PENDING`

Visual/browser/device evidence: `PENDING`

Intentional deviations: `PENDING`

Deferred proposals and risks: See `PRODUCT_SCOPE.md`.

As-built documentation status: `PENDING`

## Phase 1 prototype evidence

Phase 1 completed on 2026-08-13. The route uses typed fictional employee view
fixtures, derived active/upcoming/former views, explainable completeness,
search/filtering, selected-row quick view, responsive cards, simulated form
validation/success, and explicitly selectable loading/empty/forbidden/error/
conflict/success review states.

No schema, migration, API/contract, repository, server action, permission,
entitlement, provider, persistence, or production document behavior was added.
The package remains `implementation-ready`, not `implemented`, until approved
real-data vertical slices replace fixtures and complete functional/security QA.

## Phase 2 discovery evidence

Phase 2 completed on 2026-08-13 as documentation-only discovery. The canonical
interaction map and data dictionary are in `DATA_AND_INTERACTION_SPEC.md`.
They classify stored, derived, transient UI, and integration-owned values and
record proposed aggregate, multiple-establishment, duplicate, concurrency,
idempotency, departure, audit, and state-transition semantics.

The Phase 1 fixture type remains a presentation read model and is explicitly
not a contract/table blueprint. All Phase 2 domain/security choices remain
`PROPOSAL` pending the Phase 3 approval register.

## Phase 3 review evidence

Phase 3 review material was completed on 2026-08-13. The canonical
`DATA_AND_INTERACTION_SPEC.md` now contains:

- establishment ownership and aggregate transaction boundaries;
- proposed `personnel.employee.read` and `personnel.employee.manage`
  permissions with OWNER-only role/action/field matrices;
- no invented feature entitlement;
- approved-for-review minimum fields and validation semantics;
- audit, concurrency, idempotency, duplicate, departure, retention/archive,
  security-control, and cross-tenant test proposals;
- current CNIL and Légifrance constraints with a clear non-compliance-claim boundary.

The product boundary was approved on 2026-08-13 for technical preparation and
the first real read-only slice. External controller/legal and operational-
security sign-offs are still pending, so employee writes are not authorized.

## Phase 4 technical-design evidence

Phase 4 technical preparation was completed on 2026-08-13 in
`IMPLEMENTATION_PLAN.md`. It describes, without creating anything:

- the proposed employee, change-history, and safe-retry storage groups;
- how a request is checked, read, changed, and reported back to the page;
- the proposed contract, repository, permission, and application boundaries;
- five small future delivery slices and their rollback approach;
- the permission, cross-establishment, conflict, retry, and audit tests required
  before any slice can be called real.

This preparation created no database table, schema, migration, API, permission
code, repository, server action, or real data-storage behavior. Documents,
Formalites, register/PDF, apprenticeship, OCR, and sensitive contract data stay
recorded as later capability waves with their own approval gates.

## Phase 4 read-slice evidence

The first real slice was implemented on 2026-08-13 after explicit delivery
approval. It adds the minimum personnel contract, cloud schema and migration,
composite establishment ownership constraint, OWNER-only read permission,
server-loaded list repository, real empty/list/search/filter UI, navigation
filtering, and tenant-isolation tests.

Migration `0005_lean_zzzax.sql` was applied to the local development database.
The integration test proves that an employee from another establishment or
organization is not returned and that a mismatched organization/establishment
pair is rejected by PostgreSQL. No employee record was seeded.

This is partial integration, not completion of Phase 4. Writes and sensitive
later waves remain blocked as described above.

## Phase 4 create-slice evidence

The development create slice was implemented on 2026-08-13. Migration
`0006_aromatic_boom_boom.sql` adds scoped employee audit events and hashed
command receipts. The OWNER-only form validates minimum identity/employment
facts, requires an expected end date for CDD, preserves failed input, reviews
same-establishment duplicate candidates, and requires a bounded reason before
creating a confirmed homonym.

The dossier, creation audit, optional duplicate-override audit, and retry
receipt commit in one transaction. Retrying the same committed command returns
the same employee; reusing its key with different values fails. Integration
tests clean their data and prove scoped creation, duplicate review, audit, and
idempotency behavior. Production employee collection remains blocked by the
existing controller/legal and operational-security approvals.
