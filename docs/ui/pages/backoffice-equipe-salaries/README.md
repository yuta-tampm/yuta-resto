# Backoffice Équipe — Salariés

Status: Implemented locally — production gates remain open

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-17

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/equipe/salaries`

Runtime family: `cloud`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Package status: `implemented`

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
review, idempotent retry, and atomic minimal audit. Editing of the approved
minimum fields is implemented with revision-conflict recovery, idempotent retry,
and atomic field-group audit. Non-destructive departure, correction, and
reopening are implemented with explicit confirmation, reasoned correction,
revision-conflict recovery, and atomic audit. No production seed, secure
document storage, OCR, personnel-register model, Formalités engine, or PDF
generator exists. The explicitly opened dossier drawer exposes the 50 most
recent approved audit events in a read-only history without returning raw audit
or tenant metadata. History is requested only when the selected employee's tab
is opened and has loading, unavailable, retry, and empty states. The OWNER-only
`Consultations` tab separately exposes allowlisted dossier/history access events
in server-backed pages of 10 and records access to that timeline. Completeness counts, filtering,
reason labels, and the supported edit action use the same derived minimum-field
rules.

The drawer also contains a local-development `Documents` vertical slice for one
approved product category: `Contrat de travail signé`. OWNER can add, replace,
view, and download a verified PDF up to 10 MiB. Metadata is establishment scoped
in cloud persistence; bytes remain outside PostgreSQL in private local storage
and must pass Microsoft Defender before becoming available. Production fails
closed until the external storage, scanner, retention, and operations gates are
approved.

Documents Wave B now has a completed read-only Phase 0 for
`Avenants signés`. Repository analysis confirms that this is a new capability:
the current category enum, contracts, repository, action, UI, and tests support
only the base signed employment contract. Phase 0 proposes an OWNER-only local
flow for multiple amendments, keeps each amendment distinct from the base
contract and from correction versions, and records date/ordering questions. The
product owner approved Phase 0 and authorized prompt execution on 2026-08-15.
Four responsive references were approved for a typed-fixture local Phase 1
prototype. The implemented preview shows two fictional amendments, a persistent
no-save notice, and disabled add/view/download/replace controls. No runtime,
schema, migration, API, permission, repository, or storage behavior was added.

The route remains under `NEW_CAPABILITY_DISCOVERY` until the approved write
slices and final QA are complete. `users` and `tenant_memberships` remain login
and restaurant-access records; they are not employee records.

Current sources:

- route: `apps/backoffice/src/app/(authenticated)/equipe/salaries/page.tsx`;
- integrated read composition/model:
  `apps/backoffice/src/app/(authenticated)/equipe/salaries/`;
- authenticated layout: `apps/backoffice/src/app/(authenticated)/layout.tsx`;
- shell/navigation:
  `apps/backoffice/src/components/backoffice/backoffice-frame.tsx` and
  `apps/backoffice/src/components/backoffice/backoffice-navigation.ts`;
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

## Documents capability Phase 2 — technical design prepared

Phase 0 for Wave A `Secure employee documents` was completed read-only on
2026-08-15. The stable package remains `backoffice-equipe-salaries`; no second
page pack or route was created because Documents is a proposed dossier tab/flow
inside `/equipe/salaries`.

Documents capability metadata:

```text
Documents target: SURFACE + FLOW inside the existing PAGE
Documents implementation status: PHASE 3 LOCAL-ONLY REAL VERTICAL SLICE
Documents delivery mode: NEW_CAPABILITY_DISCOVERY
Documents scope status: LOCAL QA — PRODUCTION RELEASE BLOCKED
Documents baseline status: NOT_APPLICABLE
Documents prompt status: EXECUTED — REFERENCES APPROVED FOR PHASE 1
```

Repository findings:

- the containing Salaries page is integrated and OWNER-only, with trusted
  organization and establishment scope and a current five-tab employee drawer;
- no Backoffice/cloud document domain, private object storage, permission,
  contract, schema, API/action, security-processing flow, or test exists;
- the standalone local Display upload directory belongs to another runtime and
  cannot be reused for cloud employee files;
- document ownership is proposed at the employee dossier's organization plus
  establishment scope, never by resource ID or browser-provided storage key;
- every employee document is confidential; more sensitive categories remain
  category-by-category decisions rather than a generic upload bucket;
- no real-file work may begin before product, privacy/legal, retention,
  security, provider, audit, backup/restore, and incident-response approvals.

The proposed MVP is OWNER-only list, upload, view/download, and explicit
replacement for approved categories, with truthful quarantine/processing/error
states and allowlisted audit events. Delete/archive/legal hold, OCR, camera
scanning, generation/signature/Formalités, sharing/export, manager delegation,
employee self-service, RIB/NIR/payroll/medical/disciplinary files, and generic
missing/expiry alerts remain deferred.

The current authenticated containing page was inspected on 2026-08-15 using the
local LUNA OWNER session at `http://localhost:3001/equipe/salaries`. The new
Documents surface has no baseline because it does not exist. After explicit
product approval, the prompt in `DESIGN_HANDOFF.md` was executed and produced
four responsive visual references. The product owner approved those references
and the typed-fixture prototype on 2026-08-15. This approval does not authorize
real document implementation.

### Documents Wave B Phase 1 prototype evidence

The existing employee drawer now includes a `Documents` tab backed only by a
route-local typed fixture. It contains two explicitly fictional examples, a
persistent demonstration notice, and disabled add, view, and replace controls.
The download controls are disabled as well.
The fixture carries no resource ID, URL, storage key, tenant value, transport
contract, or persistence behavior. Tabs remain horizontally scrollable on
narrow screens, long labels truncate, and document actions stack responsively.
The right-side drawer is capped at 60 rem on wide desktop screens, uses up to
88% of the viewport at the 1024 px breakpoint, and remains full-width at 768 px
and below. Signed-in browser QA passed at 1440 x 1000, 1024 x 768, 768 x 1024,
and 390 x 844. The prototype remained readable at every size, its fictional
actions remained disabled, and mobile cards stacked without horizontal page
overflow.

### Documents Wave B Phase 2 technical-design status

Phase 2 was authorized on 2026-08-15 for documentation only. The recommended
local design uses a separate establishment-owned amendment aggregate because
the implemented base-contract record intentionally allows only one current
document for its category. Each legal amendment is distinct; replacing a bad
scan creates an immutable version of that same amendment.

The proposal requires an effective date, permits one optional bounded reference,
orders newest effective date first, and returns ten items per cursor page. It
reuses the existing OWNER-only document permissions and provider-neutral private
storage/scanner boundaries. One Documents-open audit event covers both sections
to avoid duplicate consultation entries. Real file actions, schemas, contracts,
and repositories remain blocked pending AB2-01 through AB2-09 approval and a
separate Phase 3 authorization. Production/legal/operations gates remain open.

### Documents Wave B Phase 3 local implementation

AB2-01 through AB2-09 and local implementation were approved on 2026-08-15.
Migration `0008_omniscient_colonel_america.sql` adds a separate scoped amendment
aggregate, immutable versions, and hashed retry receipts without changing the
base signed-contract category. The Phase 1 fixture was removed.

The Documents tab now loads real amendments ten at a time, adds a required
effective date and optional reference, replaces only the selected amendment's
scan, and reauthorizes every server-mediated view/download. It reuses the
existing OWNER-only document permissions, private local storage, Defender
inspection, minimized audit taxonomy, and production fail-closed runtime.
AB2-10 and every production provider/retention/rights/operations task remain
deferred. Signed-in browser QA passed for the real empty state, add form, cancel
behavior, and responsive layout at 1440 x 1000, 1024 x 768, 768 x 1024, and
390 x 844.

### Documents Wave B Phase 5 local QA

Phase 5 completed on 2026-08-15 against the signed-in local LUNA OWNER session.
A generated non-personal PDF passed Defender inspection, was added as a real
amendment, opened through the protected server route, downloaded as an
attachment, and replaced to create immutable version 2. The guarded repository
test also recreated more than ten scoped amendments, verified ten-item cursor
pages, and removed its own data.

QA found and corrected one recovery defect: a rejected file submission reset
the effective date and reference. The action now returns only those two safe
form values after an error, and the client restores them while still requiring
the file to be selected again. The previous success notice is also cleared when
a new add or replace form opens. Backoffice tests and typecheck pass after the
correction.

Responsive as-built evidence at 1440 x 1000, 1024 x 768, 768 x 1024, and
390 x 844 confirms the real amendment card, version, actions, scroll behavior,
and absence of page or drawer overflow. This completes local Wave B QA only;
production remains blocked by AB2-10.

### Documents Wave A Phase 2 technical-design status

Phase 2 was authorized on 2026-08-15 for documentation only. The page pack now
proposes a conceptual document/version aggregate, private-storage and
quarantine boundary, failure-safe replacement lifecycle, document-specific
OWNER permissions, allowlisted audit events, stable error semantics, and a
narrow first real slice. These are not schemas, contracts, routes, migrations,
provider selections, or implementation approval.

The product owner selected `Contrat de travail signé` as the first category and
PDF up to 10 MiB as the initial file boundary on 2026-08-15. A signed amendment
is a separate deferred category. Legal/privacy must still approve the category,
and security must still approve the file-processing and version limits. The
remaining document-permission, private-storage/provider, delivery, audit,
retention, replacement, and scanning decisions also remain open. Real-file work
is blocked until the required product, legal/privacy, security, operations, and
engineering approvals are complete. Scaleway Paris is a provisional
engineering recommendation only; no provider has been selected or connected.

### Documents Phase 3 local implementation

The product owner authorized implementation on 2026-08-15. The Phase 1 fixture
was removed and replaced by one local end-to-end slice:

- `signed_employment_contract` only, PDF only, 10 MiB maximum;
- separate OWNER-only `personnel.document.read` and
  `personnel.document.manage` permissions;
- organization + establishment + employee scope on every metadata operation;
- migration `0007_happy_master_chief.sql` with document, immutable-version, and
  bounded idempotency-receipt metadata;
- private local filesystem adapter outside Neon/PostgreSQL, with quarantine and
  Microsoft Defender inspection before promotion;
- server-mediated add, replace, inline view, and download without a stable
  provider/public URL;
- safe document events for tab access, successful/rejected upload, replacement,
  view, and download grants;
- optimistic revision conflict handling, retry-safe commands, and cleanup when
  scanning or metadata persistence fails.

This is not production authorization. The application deliberately rejects the
document runtime when `NODE_ENV=production`. Provider-neutral storage and
scanner interfaces isolate the later EU adapters. Legal/privacy category and
retention approval, production EU storage/scanner selection, backup/restore,
deletion/rights handling, incident ownership, and superseded-version retention
remain deferred release tasks.

## Final delivery and as-built status

Final implementation locations/files changed: the authenticated salaries route
and route-local dialogs/actions under
`apps/backoffice/src/app/(authenticated)/equipe/salaries/`, personnel contracts
under `packages/contracts/src/personnel/`, and the tenant-scoped repository,
schema/migration evidence, and integration tests under `packages/db-cloud/`.

Verification commands and results: Backoffice typecheck/build and 87 tests pass;
contracts typecheck and 22 tests pass; the targeted guarded local document/schema
suite passes 4 tests, and `test:cloud` passes with its intentional guarded skips.
`docs:check`, the page-pack check, `architecture:check`, recursive typecheck,
scoped Prettier, and scoped `git diff --check` pass. Repository-wide
`format:check` still reports 35 unrelated pre-existing files outside this slice.

Functional/regression QA result: OWNER-only list/create/edit/departure,
conflict/idempotent retry, duplicate override, business history, dossier access
audit, and the on-demand consultation history are verified with local persisted
data and tenant-isolation coverage. The Documents browser flow additionally
verified empty state, Defender-checked upload, available metadata, server-mediated
view/download, safe access events, and cleanup of the QA file and metadata.

Visual/browser/device evidence: signed-in local browser QA verifies the initially
closed dossier, explicit row selection, wide right-side drawer, redesigned
overview, existing create dialog, Escape close, business-history loading, and
the new `Consultations` timeline. Responsive classes preserve the approved
full-width mobile drawer and single-column overview facts. The Documents slice
was browser-verified at 1024 x 768, 768 x 1024, and 390 x 844. Its empty state,
protected-access notice, actions, horizontal dossier navigation, and French file
picker remain reachable without content overflow. The final evidence is stored
under `references/documents-phase-5-as-built-*.png`.

Intentional deviations: the former permanently visible 420 px desktop quick
view was replaced by an explicitly opened overlay drawer following product
review; no employee is selected on initial load. No deferred HR/legal capability
was introduced.

Deferred proposals and risks: See `PRODUCT_SCOPE.md`.

As-built documentation status: `COMPLETE`

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

## Wave C Phase 0 evidence

Wave C read-only discovery was prepared on 2026-08-16 under
`NEW_CAPABILITY_DISCOVERY`. It remains inside this stable Salaries page pack
because it extends the existing employee dossier rather than implementing the
planned `/equipe/formalites-personnel` page.

The proposed smallest MVP adds no runtime behavior. It explores a controlled
CDD reason and contractual weekly duration in the existing `Relation de
travail` tab, for OWNER only and scoped to the active organization,
establishment, and employee dossier. Salariés owns reusable employment facts;
Documents remains evidence-only; future Formalités owns its legal validation,
templates, clauses, generation, status, submission, and lifecycle.

Remuneration, probation, detailed part-time distribution, apprenticeship,
Formalités workflows, alerts/events, register/PDF, OCR, manager delegation,
self-service, transfer, merge, and all production legal/security/retention work
remain explicitly deferred. `DESIGN_HANDOFF.md` contains a ready-to-run French
design prompt for 1440/1024/768/390 DRAFT studies.

The product owner approved Wave C Phase 0 and design-prompt execution on
2026-08-16. Four selected responsive references are stored as DRAFT. The first
desktop proposal was corrected to remove a duplicate edit action and show
complementary values as read-only by default.

The product owner approved the selected visual direction and a local Phase 1
prototype on 2026-08-16. The existing `Relation de travail` tab now includes a
typed fictional complementary-information section with explicit `Prototype`
and `Aperçu sans sauvegarde` disclosure. It uses the existing responsive drawer,
adds no second edit action, and does not change the real edit dialog.

The prototype creates no schema, migration, enum, contract, API, permission,
repository, server action, audit event, Formalités workflow, or real employee
data. Phase 2 interaction/data discovery requires separate approval.

## Wave C Phase 2 evidence

Phase 2 technical discovery was authorized and completed as documentation-only
on 2026-08-16. `DATA_AND_INTERACTION_SPEC.md` now proposes:

- nullable CDD-reason code and integer contractual weekly minutes;
- four restaurant-relevant supported CDD reasons with no free-text fallback;
- CDI/CDD transition, legacy-null, numeric, conflict, retry, and failure rules;
- reuse of the establishment employee aggregate, OWNER-only permissions,
  existing edit flow, revision/idempotency protection, minimized audit, and
  dossier-open trace;
- later read, edit, create, fixture-removal, and QA vertical slices.

WC2-01 through WC2-12 and local Phase 3 were approved on 2026-08-16. The
additive nullable migration, safe read projection, existing create/edit flow,
CDD transition confirmation, minimized audit fields, and real detail card are
implemented locally. The fictional fixture and no-save notice were removed.

No new permission or route was introduced: the existing OWNER-only employee
scope and organization + establishment repository predicates remain
authoritative. Production deployment and collection remain blocked pending the
separate legal, privacy, retention, security, and operations gates.

## Wave C Phase 5 local QA

Phase 5 completed on 2026-08-16 against the signed-in local LUNA OWNER session.
A non-personal `QA Wave C Phase 5` dossier was created as CDD with a controlled
reason and 24 h 30 weekly duration, read back through the real drawer, changed
to CDI through the required confirmation, and removed with its exact local
audit/retry records after capture.

QA found and corrected one interaction defect: after an unconfirmed CDD-to-CDI
submission the form could return to its original values. The save action is now
disabled until the explicit confirmation is checked, while the server-side
guard remains authoritative. Contract bounds, unsupported reason rejection,
legacy nullable CDD editing, tenant isolation, idempotency, conflict, and
minimized audit tests pass. Signed-in browser QA passed at 1440 x 1000,
1024 x 768, 768 x 1024, and 390 x 844 with no horizontal page/drawer overflow
or console errors. The four as-built captures are listed in `references/README.md`.

A Phase 5 visual correction replaced the sparse edge-aligned rows in `Identité`
and the primary `Relation de travail` section with the same responsive key-fact
card language as the overview. Signed-in follow-up QA covered both tabs at the
same four viewport sizes. All eight states have no page or drawer horizontal
overflow and no browser console errors; the correction captures are listed in
`references/README.md`. No personnel data or behavior changed.

## Wave D delivery evidence — `À traiter`

The selected design was approved for a local Phase 1 typed-fixture prototype
on 2026-08-16. WD2-01 through WD2-12 and a local real-data Phase 3 slice were
then approved on 2026-08-17. The route-local `À traiter` card now derives its
three approved item kinds from real establishment-scoped employee and signed-
contract metadata. The fictional examples and prototype labels were removed.

The implementation uses bounded five-item group pages, deterministic ordering,
fresh scoped action-target checks, truthful partial failure, source refresh,
existing OWNER permissions, and one minimized cross-employee overview audit
event. It adds no schema, migration, task table, notification, public API, or
new permission. Development mode only is authorized; production performs no
overview read and renders no Wave D surface.

Wave D Phase 4 was completed on 2026-08-17 as a local integration and
production-boundary audit. The loader and server actions now share one tested
development-only gate. Backoffice reports 31 passing test files and 93 passing
tests. A fresh production build was served on an isolated local port with the
authenticated OWNER session: Salariés rendered, Wave D remained absent, and
the browser reported no warning or error. Development still rendered the real
overview and action with no fixture disclosure. No production authorization,
schema, migration, API, permission, audit payload, task system, notification,
or provider change was introduced. Database integration tests remain behind
their explicit mutation opt-in and were not forced in this audit.

Wave D Phase 5 completed on 2026-08-17 with authenticated local QA at
1440/1024/768/390. The current real overview, mixed action/empty-group state,
Documents-add entry point, narrow drawer, responsive stacking, accessible
labels, and absence of horizontal overflow or console errors were verified.
Phase 5 corrected Escape-close focus so it returns to the originating overview
button. Four stable as-built captures are listed in `references/README.md`.
No real employee/document mutation was performed for visual evidence, and no
fixture was introduced to force unavailable error or pagination screenshots.
Production remains blocked and Wave D remains absent there.

Wave D read-only discovery was completed on 2026-08-16 under
`NEW_CAPABILITY_DISCOVERY`. It remains a proposed `SURFACE + FLOW` inside the
integrated `/equipe/salaries` page and this stable page pack. The Phase 0
signed-in OWNER baseline contained no `À traiter` surface, personnel task
state, acknowledgement, assignment, scheduled reminder, or personnel
notification system. The later Phase 1 development-only fixture does not
change those absent domain capabilities.

The proposed smallest MVP is a derived, OWNER-only overview for the active
organization and establishment. It distinguishes:

- active/upcoming employee dossiers missing approved minimum fields;
- active/upcoming employees missing the signed base employment contract;
- active employees with a recorded departure from today through the next five
  establishment-local calendar days.

The first two are correctable issues; the last is a dated event to review.
Every item enters an existing edit, Documents-add, or departure-review flow.
The overview is not a persisted task list, does not change dossier completeness,
does not treat CDD expected end as departure, and does not add a fourth KPI.

Product boundaries, trusted organization + establishment + employee ownership,
OWNER authorization, confidential-data treatment, partial-failure truth rules,
later minimized access-audit requirement, deferred capability, responsive UI
scope, and WD0-01 through WD0-08 are recorded across the page documents.
`DESIGN_HANDOFF.md` contains a self-contained French prompt for DRAFT studies at
1440/1024/768/390. The product owner approved WD0-01 through WD0-08 and
authorized prompt execution on 2026-08-16. Four selected ready-state DRAFT
references are now stored under `references/` for product review. The selected
mobile study preserves the real single-column metric layout; an earlier mobile
generation that changed those metrics was rejected and is not retained.

Phase 0 and prompt execution changed documentation and design evidence only.
No UI, fixture, route, tab, KPI, schema,
migration, contract, repository query, loader, API/action, permission, audit
event, task state, notification, scheduled job, provider, or production
behavior was created.

## Wave E Phase 0 evidence — personnel register and PDF export

Wave E read-only discovery was prepared and approved on 2026-08-17 under
`NEW_CAPABILITY_DISCOVERY`. The existing Salariés page remains integrated, but
the establishment-wide register and PDF-export flow are absent. Phase 0 proposes
a dedicated `/equipe/registre-personnel` page entered from Salariés. That
proposal now has the dedicated
[`backoffice-equipe-registre-personnel`](../backoffice-equipe-registre-personnel/README.md)
page pack; the runtime route remains unimplemented.

Repository reconciliation confirms that current employee records provide only
part of the required register information and are mutable current-state rows.
There is no immutable hiring/arrival sequence, complete legal field dictionary,
stagiaire/service-civique aggregate, five-year register retention process,
register-specific permission/audit, or PDF generator. Current employee history
cannot be treated as a reconstructable legal register.

`PRODUCT_SCOPE.md` records WE0-01 through WE0-10, establishment ownership,
OWNER-only first use, sensitive-data controls, legal-source review, the PDF-as-
representation boundary, and deferred Wave F OCR/AI work. `UI_SPEC.md` and
`DATA_AND_INTERACTION_SPEC.md` record the discovery states and current/missing
data. The approved French design prompt was executed, and four responsive
DRAFT studies are stored in the dedicated register pack for visual review.

The visual direction and Phase 1 local prototype were approved on 2026-08-18.
The dedicated register pack now owns the later approved Phase 3 local real-data
slice. Salariés exposes only its secondary entry and candidate dossier facts;
it does not silently create register inscriptions. Register persistence,
OWNER permissions, audit, corrections, and transient PDF remain owned by the
dedicated register route and fail closed in production.

WE2-01 through WE2-14 and the local Phase 3 slice were approved on 2026-08-18.
Salariés remains the owner of reusable employee facts; it is not itself the
reconstructable register or PDF source.

## Wave F Phase 0 — document extraction and reviewed suggestions

Wave F read-only discovery was completed on 2026-08-18 under
`NEW_CAPABILITY_DISCOVERY`. It remains a proposed flow inside the existing
employee drawer and Documents tab, not a new route or global AI capability.

Repository reconciliation confirms the secure signed-contract and amendment
storage flows, quarantine, Microsoft Defender scan, OWNER document permissions,
server-mediated delivery, and existing revision/idempotency employee mutation.
No OCR/AI SDK, provider, extraction interface, suggestion contract/store,
permission, audit, job, or runtime control exists.

The recommended first MVP analyses one verified signed base contract belonging
to an existing employee and proposes only allowlisted employment-field changes.
The OWNER must compare and explicitly accept/reject every suggestion; no AI
output becomes authoritative or updates the employee/register automatically.
File-first employee creation, amendments, identity/work-permit documents,
multi-file reconciliation, chatbot, batch processing, and production provider
use remain deferred.

`PRODUCT_SCOPE.md` records WF0-01 through WF0-12, approved for design on
2026-08-18. `DATA_AND_INTERACTION_SPEC.md`
defines the proposed provider-neutral server boundary, field allowlist,
sensitive handling, review/apply flow, minimized audit, and stale/conflict
behavior. `UI_SPEC.md` and `DESIGN_HANDOFF.md` define the discovery states and a
self-contained French design prompt. The separately authorized prompt was
executed on 2026-08-18 and produced four responsive DRAFT references. Their
visual direction and Phase 1 local prototype were subsequently approved.

Phase 0 and prompt execution change page-pack documentation and DRAFT reference
images only. They create no route, runtime UI, fixture,
schema, migration, contract, permission, audit event, AI service/provider,
file read/transmission, employee mutation, operational data, or production
behavior.

Wave F Phase 1 now adds a development-only typed-fixture prototype to the
existing signed base-contract card. It is explicitly labelled as fictitious,
keeps all choices in client memory, disables apply, and is absent outside
development. It reads or transmits no PDF, calls no OCR/AI service, analyses no
amendment, and adds no contract, API, persistence, permission, audit event, or
employee/register mutation. Stop for separate Phase 2 approval.

Wave F Phase 2 technical design was completed on 2026-08-18. WF2-01 through
WF2-16 propose a server-only provider-neutral service, separate PDF preflight
and extraction adapters, strict allowlisted results, transient review state,
fresh version/revision validation, a distinct future extract permission,
minimized audit, synchronous limits, and a synthetic-first Phase 3 sequence.
The first apply slice is limited to `position` and
`contractWeeklyMinutes`; CDI/CDD remains review-only until its required date and
CDD-reason dependencies are supported.

Official OpenAI documentation confirms that a future adapter could use inline
PDF input plus strict structured output, but `store: false` alone does not
satisfy the personnel-data privacy gate. Remote real-file processing remains
blocked until European processing, approved retention controls, DPA,
legal/DPO/privacy/security, cost, and operations evidence is accepted. Phase 2
added documentation only and stopped for WF2 decision approval before Phase 3.

Wave F Phase 3 was approved and implemented locally on 2026-08-18. The
development-only server generates a fictional three-page PDF and processes it
through a replaceable preparer and deterministic adapter. It does not open or
transmit the signed employee contract. The UI exercises complete, partial,
no-result, unsupported, failure, timeout, retry, transient review, stale/
conflict, and bounded apply behavior. Only position and contractual weekly
minutes may be applied; CDI/CDD remains review-only. OWNER authorization,
exact employee/document versions, strict schemas, the existing employee update
guards, minimized audit events, and a development in-memory rate limit are in
place. No AI/OCR provider, API key, external call, schema, migration, result
store, production runtime, or real-file extraction was added.

Wave F Phase 4 local hardening was completed on 2026-08-18. Apply now requires
a matching completed extraction audit event in the same trusted tenant,
employee, request, document/version, and complete/partial outcome scope; this
server-side review grant expires after 15 minutes. Stale employee/document
versions and conflicts discard the whole transient review. Live QA also fixed
the radio controlled-state warning, removed internal phase language from the
French UI, and confirmed recovery states, focus, clean console, and no
horizontal overflow at 1440/1024/768/390. Browser QA applied no employee
change. Real files, external AI/OCR, provider evaluation, shared production
rate limiting, and production remain blocked.

Wave F Phase 5 was authorized and completed locally on 2026-08-18. Signed-in
OWNER QA ran the complete synthetic-PDF scenario, retained four responsive
as-built captures at 1440/1024/768/390, found no horizontal overflow or console
warning/error, and confirmed that closing the review returns focus to
`Analyser le contrat`. No suggestion was applied, no employee or document data
changed, and the signed PDF was neither opened nor transmitted for extraction.
Wave F is therefore closed only for the local synthetic slice; real files,
external AI/OCR, provider evaluation, production controls, and production
authorization remain deferred.

## Wave G Phase 0 — synthetic AI/OCR provider evaluation

Wave G Phase 0 was requested and completed as documentation-only discovery on
2026-08-18. The repository already provides a provider-neutral synthetic PDF
preparer/adapter boundary, strict extraction result, exact scope/version checks,
timeout, review, and bounded apply behavior. It contains no native text/OCR
engine, selected provider SDK, provider key, remote adapter, evaluation runner,
or external request.

The proposed first benchmark uses at least 60 generated fictional French PDFs
and evaluates OpenAI Responses direct-PDF extraction only. It may compare
approved pinned OpenAI model snapshots and request settings, but does not add
local native extraction, Tesseract/self-hosted OCR, Azure, Google, or another
external provider. YUTA keeps its provider adapter, prompt, strict result,
validation, authorization, cost limits, OWNER confirmation, and audit rules.
Production files remain in private EU storage outside Neon and never become
authoritative employee updates through an AI response.

WG0-01 through WG0-14, the synthetic corpus, measurements, safe pass/fail
rules, later gated phases, and official-source review are recorded in this page
pack. The approved Wave F UI remains unchanged, so the Wave G design prompt is
`NOT_APPLICABLE`. Phase 0 created no code, PDF fixture, SDK/library, key,
provider account, external call, file read/transmission, schema, migration,
permission, audit event, operational data, or production behavior. Stop for
product approval before Phase 1.

WG0-01 through WG0-14 and Wave G Phase 1 were approved on 2026-08-18. Phase 1
is limited to the private OpenAI Sales eligibility submission and retention of
the written response. The private form was prepared truthfully for a
pre-incorporation project and contains only fictional/planning information. The
product owner confirmed submission through the OpenAI Sales contact form on
2026-08-18. No OpenAI response or approval is yet recorded.

Product separately authorized Wave G Phase 2 offline and Phase 3 design
preparation on 2026-08-19. After reviewing the ten-PDF starter, product approved
its expansion on the same date. Phase 2 now has a deterministic 60-PDF corpus:
20 digital-text files, 15 clear scans, 15 degraded scans, and 10 ambiguous or
adversarial files. It includes a versioned answer manifest, strict offline
scorer, and tests covering
digital text, clear scans, degraded scans, ambiguous content, instruction-like
text, exact answers, safe abstention, hashes, and page counts. The representative
rendered pages were visually reviewed. Phase 2 is complete; this does not by
itself authorize credentials, SDK installation, or an external call.

Phase 3 treats the current personal/pre-incorporation API organization as a
disposable synthetic-only environment. Product separately authorized creation
of `YUTA AI Test` and its bounded sandbox controls on 2026-08-19. The project
was observed as `Global` with data-retention control `None`; its private ID is
not stored in the repository. The organization has USD 10 prepaid credit with
automatic reload disabled. The project has a USD 5 monthly hard limit, the
dashboard's 100% spend alert, and an allowlist containing only
`gpt-5.6-luna` and `gpt-5.6-terra`. A project service account and key named
`yuta-ai-evaluation-local` exist; the secret remains private and is not stored
in the repository or page pack. The service account uses only the custom
`YUTA AI Evaluation Caller` role with model-request capability, and no longer
has the broader preset `member` role.

Product then explicitly authorized the first Wave G Phase 4 synthetic call on
2026-08-19. A minimal server-only adapter now uses native `fetch` rather than a
provider SDK. Its request uses the `gpt-5.6-luna` alias, direct Base64 PDF input,
`store: false`, low reasoning effort, strict structured output, and no tools or
background mode. A separate smoke runner can send only explicitly allowlisted,
hashed corpus fixtures when the matching local run gate and ignored environment
secret are both present. The first digital-text fixture and a separately
approved three-call representative batch covering clear scan, degraded partial
scan, and adversarial instruction content all passed the YUTA schema and
fixture scorer on their first attempt. The three-call batch measured 4,362 ms,
2,799 ms, and 5,791 ms and cost an estimated USD 0.0032526 from 13,701 input and
427 output tokens.

Product next approved the other 56 fixtures. They ran once in sequence with no
retry. The full Luna baseline passed 58/60 documents: 20/20 digital text, 14/15
clear scan, 14/15 degraded scan, and 10/10 adversarial. All 60 results were
schema-valid and no request timed out or failed at the provider. One clear scan
contained a false high-confidence suggestion, and one degraded scan had only a
safe status mismatch. The approved zero-tolerance high-confidence rule is
therefore not met, so this configuration is not selected. Full billed-cost
reconciliation remains pending because the Usage dashboard had not yet caught
up after the run. No raw provider response, provider ID, prompt, PDF content,
or secret was persisted. Snapshot comparison, a different candidate,
real-file processing, and production remain blocked.

Product separately authorized the same-condition `gpt-5.6-terra` comparison in
Wave G Phase 5. The frozen 60-PDF corpus ran once in sequence with no retry and
also passed 58/60: 20/20 digital text, 13/15 clear scan, 15/15 degraded scan,
and 10/10 adversarial. All outputs were schema-valid, with no provider failure,
timeout, arbitrary-key leak, or abstention violation; every recorded request
completed below five seconds. Terra corrected Luna's safe status mismatch on
`wg2-scan-degraded-07`, but `wg2-scan-clear-03` and
`wg2-scan-clear-05` each produced a false, missing, incorrect high-confidence
suggestion. A visual check confirmed both fictional PDFs and their expected
answers are clear. Terra therefore also fails WG0-09 and is not selected. At
the prices checked on 2026-08-19, Terra costs ten times Luna per input and
output token. The Usage dashboard had ingested only 98 of the 120 total Luna
and Terra requests when rechecked, showing 328,421 tokens and USD 0.40; those
values are a partial snapshot, not final reconciliation. No further provider
call, real-file use, or production path is authorized.

Prompt v2 was approved by the product owner on 2026-08-19 and its exact text is
pinned by a SHA-256 fingerprint. It is not the adapter default and has no
external run gate. It targets the measured failure
modes with exact position transcription, explicit status/count mapping, unique
fields, verified weekly-minute conversion, and stronger omission rules. Fake
provider tests verify the prompt/request shape, exact output, orthographic and
source-page diagnostics, and rejection of inconsistent or duplicate output.
The exact-match gate is unchanged. This prompt-text approval does not authorize
an API call; separate approval is required before any v2 full-corpus rerun.

Product separately authorized one full Luna/v2 corpus run on 2026-08-19. All
60 fictional PDFs ran once in sequence without retry. V2 passed 46/60: digital
14/20, clear scan 9/15, degraded scan 15/15, and adversarial 8/10. Eleven
outputs still rewrote the position with incorrect high confidence, one result
was rejected by v2 local consistency validation, and two adversarial results
safely omitted an expected weekly duration. This is materially worse than the
58/60 Luna/v1 baseline and fails WG0-09, so v2 is not selected. Its temporary
external gate was removed after the authorized run. Full billed-cost
reconciliation remains pending; no total is guessed from incomplete console
evidence.

Product approved the exact prompt v3 text on 2026-08-19. V3 addresses the
measured v2 regression with held-out examples that are not answers from the
60-PDF corpus. It demonstrates
that an unaccented printed title remains unaccented and keeps exact matching as
the acceptance rule. The draft also refuses to interpret a bare hour duration
as weekly. This exposed a corpus-v1 specification defect:
`wg2-adversarial-05` and `wg2-adversarial-09` expect weekly minutes although the
visible line does not say weekly. The frozen corpus remains unchanged.
Candidate corpus v2 resolves only those two cases by adding explicit weekly
wording, preserves every expected answer and 58/60 PDF hashes, and pins the two
changed hashes in its own manifest. Both changed two-page PDFs were visually
checked. Product approved corpus v2 and separately authorized one complete
Luna/v3 run on 2026-08-19. The 60 PDFs ran once in sequence without retry. V3
passed 58/60: digital 20/20, clear scan 13/15, degraded scan 15/15, and
adversarial 10/10. `wg2-scan-clear-07` contained one incorrect high-confidence
orthographic rewrite; `wg2-scan-clear-09` completed at the provider but failed
local schema/consistency validation. There was no provider failure or
abstention violation. The 59 responses with recorded usage consumed 227,463
input and 9,586 output tokens, estimated at USD 0.0569958. The rejected
response has no adapter usage observation, so that estimate is not the final
billed total. V3 fails WG0-09 and is not selected. Its temporary gate was
removed, v1 remains the adapter default, and no further call is authorized.

Product requested preparation and approved the exact prompt v4 text on
2026-08-19. V4 has two surgical changes only. It tells the model to exclude the field
label, separator, and sentence-ending punctuation from `position` while
preserving punctuation inside the actual value. It also requires at most one
suggestion per field in a fixed order, followed by a final count-to-status
mapping. Sanitized v3 evidence proves an orthographic mismatch but does not
retain the wrong value, so terminal punctuation remains a targeted hypothesis,
not a reconstructed provider response. Likewise, the rejected v3 result does
not reveal whether duplication or status/count caused rejection. Fake-response
tests cover both boundaries. V4 is pinned, has no run gate, is not the default,
and has made no API request. The prompt approval does not authorize external
spend; a separate product approval remains required before a v4 run.

Product separately authorized one complete Luna/v4 corpus-v2 run on
2026-08-19. All 60 fictional PDFs ran once in sequence without retry. V4 passed
59/60: digital 20/20, clear scan 14/15, degraded scan 15/15, and adversarial
10/10. `wg2-scan-clear-15` completed at the provider but was safely rejected by
the local schema/consistency boundary. The other 59 outputs were schema-valid,
with zero incorrect high-confidence suggestions, zero abstention violations,
and zero provider failures. The maximum observed latency was 7,498 ms. The 59
responses with usage observations consumed 232,065 input and 9,184 output
tokens, estimated at USD 0.0574338; the rejected response's usage is unavailable,
so this is not final billed evidence. V4 meets the current synthetic safety,
accuracy, and latency thresholds. Product selected Luna/v4/corpus-v2 as the
synthetic evaluation winner on 2026-08-19. This selection closes the synthetic
comparison but does not approve real files or production. The temporary v4
gate remains removed, the adapter default remains v1 to avoid implicit
promotion, and no further call is authorized.

Wave G Phase 6 integrates that selected configuration into the existing
development Documents action. `openai-synthetic` explicitly selects
`gpt-5.6-luna` with prompt v4; the service still creates the fictional PDF and
does not read the signed personnel file. The default remains the deterministic
synthetic adapter for offline development. The runtime rejects missing keys,
unknown modes, and every environment other than development before network
access. Production UI/action gates remain closed, and no real-file or
production use is approved.

The organization-level eligibility request is prepared separately in
[`OPENAI_PROVIDER_ELIGIBILITY.md`](../../../operations/OPENAI_PROVIDER_ELIGIBILITY.md).
It discloses the four proposed YUTA AI use cases while keeping Personnel
Documents as a separately blocked high-risk project. The Sales form was
submitted on 2026-08-18; its response is pending and it does not approve an
account, key, SDK, request, or real-file use.
