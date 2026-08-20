# Backoffice Équipe — Salariés — Implementation Plan

Status: Implementation ready

Visibility: Engineering

## Delivery mode

Use `NEW_CAPABILITY_DISCOVERY`. Deliver approved vertical slices rather than a
complete frontend or backend in isolation.

## Phase 0 — Repository analysis gate

Status: complete, documentation only. The package records classification,
boundaries, repository gaps, MVP/deferred scope, sensitive-data gates, shared
context, shell mode, and a ready prompt. No runtime/schema/API change occurred.

Product approval completed on 2026-08-13.

## Design-generation and approval gate

After approval, run `DESIGN_HANDOFF.md`, store generated references under
`references/` as `DRAFT`, remove unsupported concepts, and obtain explicit
scope/reference approval. An image alone never makes the package approved or
implementation-ready.

## Phase 1 — Typed-fixture UI discovery prototype

Status: complete on 2026-08-13; typed-fixture prototype only.

After scope/reference approval, compose the responsive page in the current
shell with typed fictional fixtures and a prototype-data notice. Cover approved
local interactions and required states. Create no contracts, repositories,
mutations, permissions, entitlements, schema, migrations, or providers.

Implemented evidence: route-local typed fixtures and pure view derivation,
search/completeness filtering, active/upcoming/former navigation, selected-row
quick view, responsive list cards, a non-persisting form simulation, and
selectable truthful state studies.

## Phase 2 — Interaction map and data dictionary

Status: complete on 2026-08-13; proposal documentation only.

Map each action/state; distinguish stored, derived, transient, and integration-
owned values; finalize aggregate, multiple-establishment, duplicate, conflict,
and departure semantics. Never turn fixture view types directly into tables.

The proposed boundary is one establishment employee dossier with a minimum
identity snapshot and establishment employment relationship. Phase 2 records
12 interactions, request-state transitions, field classifications,
same-establishment advisory duplicate handling, optimistic concurrency,
idempotent retry, and non-destructive departure/correction semantics in
`DATA_AND_INTERACTION_SPEC.md`.

These are recommendations for Phase 3 approval, not authorization for schema,
contracts, repositories, permissions, or mutations. Stop before Phase 3.

## Phase 3 — Domain/security/privacy approval

Status: product boundary approved on 2026-08-13 for read-only technical
preparation. Controller/legal and operational-security approval remain pending.

Approve ownership, aggregate rules, role/action/field matrix, entitlement,
sensitive-data purpose, audit, retention, documents if applicable, register
scope, and concurrency/cross-tenant tests before integration.

`DATA_AND_INTERACTION_SPEC.md` now contains the recommended permission keys,
role/action/field matrices, purpose/minimization boundary, audit taxonomy,
active/archive policy, domain validation, conflict/idempotency contract, and
cross-tenant security matrix. It intentionally introduces no entitlement.

The approval allows the technical design below. It does not allow database,
migration, API, permission code, or production data collection.

## Phase 4 — Production vertical slices

Status: read and development create slices implemented; later writes not authorized.

```text
approved flow -> domain rule -> reviewed schema/migration when required
-> establishment-scoped repository/authorization -> Zod transport contract
-> security/domain tests -> integrated UI/truthful states -> fixture removal
```

Recommended order: list/read, create minimum relationship, edit with conflict
handling, non-destructive departure, then minimal audit history. Documents,
OCR, Formalités, apprenticeship, and register/PDF remain separate waves.

### Plain-language request flow

```text
User opens Salariés
-> Backoffice checks the signed-in session and active establishment
-> server checks OWNER personnel permission
-> server asks the employee repository using organization + establishment
-> repository reads/writes cloud PostgreSQL inside that exact scope
-> server validates and returns only approved fields
-> page renders real loading/empty/error/success states
```

The browser never chooses or proves organization, establishment, role,
permission, actor, timestamps, or audit identity. No browser code imports a
database module.

### Proposed storage design — not created

The first implementation would use three cloud-owned storage groups. Names are
provisional until schema review; this section is not a migration.

#### Employee dossier

One row represents one employment dossier at one establishment:

- opaque ID;
- organization ID and establishment ID;
- given names and family name;
- poste and qualification;
- employment term: `indefinite` or `fixed_term`;
- expected end date only for `fixed_term`;
- work-time category: `full_time` or `part_time`;
- entry date and optional departure date;
- integer revision for conflict protection;
- server-created `createdAt` and `updatedAt`.

Do not store display name, initials, active/upcoming/former status, completeness
boolean, localized contract summary, selected tab, filters, or KPI counts.
Those values are calculated from approved facts.

Every identity, lookup, index, and foreign-key path must retain organization +
establishment scope. The repository must expose no `findById(id)` or
`updateById(id)` function.

#### Employee audit events

Append-only records for create, identity update, employment update, departure,
departure correction, and duplicate override. Each record contains trusted
scope, employee ID, actor user ID, event type, time, operation ID, allowlisted
changed fields, and a bounded reason only when required.

The audit row is written in the same database transaction as the employee
change. A failed audit write fails the whole change.

#### Command receipts

Short-lived records prevent duplicate creates/retries. Store a hash of the
idempotency key, trusted actor/scope, command type, validated request
fingerprint, committed outcome reference, creation time, and expiry time. Do
not store a second full employee payload.

The proposed 24-hour expiry remains subject to operational-security approval.

### Proposed contract design — not created

Add one `personnel` contract area to `@yuta/contracts`, using existing common
identifier, error, date/time, and cursor-pagination conventions.

Proposed boundary objects:

- list query: view, search, completeness, cursor, limit;
- employee summary: approved list fields, derived status/completeness, revision;
- employee detail: approved identity/employment fields plus minimal history;
- create input: approved writable fields plus idempotency key;
- update input: employee ID, writable fields, expected revision;
- departure input: employee ID, departure date, expected revision;
- departure correction input: employee ID, corrected date or clear operation,
  expected revision, bounded reason;
- duplicate confirmation: candidate decision plus bounded reason;
- stable results/errors: validation, forbidden/not found, conflict, duplicate
  candidate, and service failure.

Organization ID, establishment ID, actor ID, role, permission, audit time, and
server timestamps never appear as trusted writable input.

### Proposed application files — not created

| Responsibility                                 | Expected location                                |
| ---------------------------------------------- | ------------------------------------------------ |
| Transport validation and safe types            | `packages/contracts/src/personnel/`              |
| Schema proposal after approval                 | `packages/db-cloud/src/schema/personnel.ts`      |
| Tenant-scoped repository                       | `packages/db-cloud/src/personnel-repository.ts`  |
| Permission mapping                             | `apps/backoffice/src/server/auth/permissions.ts` |
| Trusted personnel context helper               | `apps/backoffice/src/server/auth/session.ts`     |
| Server-loaded list/detail                      | existing `/equipe/salaries` route area           |
| Server actions                                 | route-local `actions.ts`                         |
| Form/error mapping                             | route-local model/component files                |
| Contract, repository, permission, and UI tests | existing package/application test folders        |

No new package, application, standalone HR service, public API, provider, job,
worker, local POS dependency, or compatibility layer is proposed.

### Read design

1. The Server Component resolves the authenticated tenant and requires an
   establishment plus `personnel.employee.read`.
2. List query input is validated, but tenant scope comes only from the trusted context.
3. Repository queries always include organization and establishment.
4. Default ordering is deterministic: entry date descending, then employee ID.
5. Cursor pagination reuses repository conventions; configurable `10 / page`
   is not introduced.
6. Search is limited to approved names, poste, and qualification within the
   active establishment.
7. Detail/history retrieval repeats scope on every joined/read table.
8. Unauthorized responses expose no employee count, name, ID, or existence signal.

### Write design

Every future write follows the same order:

1. resolve the current authenticated tenant again;
2. require establishment and `personnel.employee.manage`;
3. validate only the approved input;
4. begin one cloud-database transaction;
5. read/check the employee using full tenant scope where applicable;
6. check revision, duplicate decision, and idempotency as applicable;
7. write the employee change;
8. append the minimal audit event;
9. store the command outcome where applicable;
10. commit, revalidate the Salariés route, then show persisted success.

Validation, conflict, and service errors preserve form input. There is no
optimistic “success” before commit and no last-write-wins update.

### Production delivery sequence

Each item is a separate reviewable vertical slice:

1. **Foundation and real empty list:** approved schema/migration, contracts,
   OWNER permission, tenant-scoped repository, real list/read, empty/error/
   forbidden UI, and cross-tenant tests. Remove fixture list data.
2. **Create:** minimum form, duplicate candidates, idempotent retry, atomic
   create audit, persisted success, and failure recovery.
3. **Edit:** identity/employment edits, revision conflict, comparison/reload,
   atomic audit, and preserved input.
4. **Departure:** record effective date without deletion, correct departure
   with reason, derived former view, and atomic audit.
5. **Read-only history:** bounded approved events, server-resolved actor display
   name, repeated tenant scope, and no raw audit metadata.
6. **Development hardening:** on-demand history with recovery states,
   explainable completeness, authorization/tenant regressions, performance
   review, and full development QA. Retention/archive, backup/restore, and
   access-log operations remain production gates after owner approval.

Delivery status on 2026-08-13:

- slice 1 read foundation is complete: contract, schema/migration, OWNER read
  permission, tenant-scoped repository, real empty/list/search/filter states,
  navigation filtering, and cross-tenant tests;
- the development database has migration `0005_lean_zzzax.sql` applied;
- no employee fixture or production seed was added;
- slice 2 create is complete for development: validated minimum form,
  same-establishment duplicate review, reasoned override, idempotent retry,
  atomic create audit, persisted success, and failure recovery;
- slice 3 edit is complete for development: approved identity/employment
  fields, full-scope compare-and-set revision guard, preserved input, current-
  version reload after conflict, idempotent retry, and atomic field-group audit;
- slice 4 departure is complete for development: non-deletion confirmation,
  establishment-local effective date, correction/reopening with bounded reason,
  derived former view, compare-and-set conflict recovery, idempotent retry, and
  atomic audit;
- migrations `0005_lean_zzzax.sql` and
  `0006_aromatic_boom_boom.sql` are applied locally;
- slice 5 read-only history is complete for development: at most 50 known
  events, newest first, repeated organization/establishment/employee scope,
  safe actor display name, and allowlisted reason/date details only;
- slice 6 development hardening is complete: initial list rendering no longer
  loads history for every employee, history has loading/error/retry states,
  completeness count/filter/detail use one derived rule, and permission,
  missing-establishment, suspended-membership, tenant-switch, responsive, test,
  typecheck, and build evidence is recorded;
- production retention/archive, backup/restore, access-log review, legal, and
  operational-security approvals remain blocking release gates.

Do not build all tables/backend first or leave the UI on fixtures while claiming
integration. Each completed slice replaces only the corresponding fixture behavior.

### Migration and rollback design

- migration is additive: create new personnel-owned tables/indexes only;
- generated SQL is reviewed before execution;
- production deployment applies schema before code that depends on it;
- the old application remains compatible because no current table is changed;
- application rollback leaves unused new tables in place rather than dropping
  possibly written employee data;
- removal or destructive rollback requires a later explicit, backed-up,
  retention-aware migration;
- no demo/employee fixtures are seeded into production.

### Required tests before each real slice

- contract validation and serialization tests;
- permission matrix tests for OWNER allow and every other actor deny;
- repository tests proving every read/write uses organization + establishment;
- two-organization/two-establishment cross-tenant denial tests;
- suspended/stale membership and missing-establishment tests;
- resource-ID-only access regression tests;
- create idempotency and duplicate-override tests;
- stale revision/conflict and no-last-write-wins tests;
- transaction rollback when audit append fails;
- departure date/business-day and correction tests;
- Server Component/action error mapping and preserved-input tests;
- Backoffice typecheck, tests, build, responsive and browser QA.

### Blocking approvals before production deployment

The development MVP slices are complete, but production collection does not
start until:

1. controller/legal owner provides the employee notice, legal bases, rights
   workflow, recipients, and per-data-class retention/deletion schedule;
2. security owner confirms access review, encryption, logging, backup/restore,
   incident response, audit access, and idempotency cleanup operations;
3. release/security owners review the already implemented migrations, rollback,
   production database target, and release evidence.

Repository audit on 2026-08-14:

- cloud operations documentation delegates backup, point-in-time recovery,
  encryption, and access control to the managed provider, but this repository
  contains no provider/project-specific restore-drill evidence for Salariés;
- personnel mutation events are persisted and OWNER-readable; opening dossier
  detail, business history, or the OWNER-only consultation history appends a
  dedicated sensitive-read event, while a list scan is not expanded into one
  event per returned employee;
- `auth_audit_events` is scoped to authentication/membership administration and
  must not be repurposed as employee dossier access history;
- no employee archive/deletion/legal-hold job exists because the per-class
  retention schedule and operational owner are not approved;
- idempotency receipts store a 24-hour `expiresAt`; each create/edit/departure
  entry point removes expired receipts inside the current trusted
  organization/establishment before replay evaluation. A future global
  maintenance scheduler is unnecessary for correctness but may be approved to
  clean inactive establishments.

### Deferred production tasks

- `SALARIES-RETENTION-01` — **deferred:** controller/legal owner defines the
  per-data-class active/archive/deletion schedule, legal-hold workflow, employee
  notice, recipients, rights workflow, and operational deletion owner. Do not
  implement archive or hard deletion before approval.
- `SALARIES-NEON-RESTORE-01` — **deferred:** on the production Neon project,
  verify backup/PITR configuration and perform a documented restore drill into
  an isolated recovery target. Current work remains local; do not access or
  mutate Neon production until the target, owner, and drill window are approved.
- `SALARIES-SENSITIVE-AUDIT-01` — **future-wave requirement:** before enabling
  Documents, export/download, archive, legal hold, rights-response, or audit-log
  administration, define and test an allowlisted audit event for each sensitive
  action. Current scope records dossier-detail, business-history, and
  consultation-history opens, exposes an allowlisted OWNER-only consultation
  timeline, and records every create/edit/departure/duplicate-override mutation.

### Later capability waves

After the MVP is integrated and each wave receives its own domain/security
approval, continue independently:

1. secure employee Documents with explicit categories/actions, storage,
   authorization, audit, retention, and recovery;
2. extended employment/contract data and approved Formalités reuse;
3. actionable missing-data versus upcoming-event handling;
4. Formalités status/navigation and document-specific handoff;
5. personnel-register domain, stable historical ordering/history, and
   stagiaire handling where approved;
6. PDF export only after structured register data and legal boundaries exist;
7. optional OCR only after provider/security/privacy approval.

### Documents Wave A Phase 0 gate — completed read-only

On 2026-08-15 repository analysis confirmed that secure employee Documents are
a new capability inside the integrated Salaries dossier. No cloud file storage,
document contracts/schema/permissions, upload/download actions, security
processing, or tests exist. The standalone Display upload directory is outside
the cloud runtime and cannot be reused.

Phase 0 records the proposed OWNER-only list/upload/view/download/replace MVP,
establishment ownership, sensitive-data boundary, deferred capabilities, UI
discovery scope, truthful states, and ready design prompt. It creates no runtime
code or production data behavior.

Before a Documents Phase 1 prototype:

1. product owner approves/revises the MVP actions and category examples;
2. product owner authorizes running the Documents design prompt;
3. generated references return as `DRAFT` for review;
4. no prototype control may imply a real upload or persisted file.

Steps 1–3 and the visual review were completed on 2026-08-15. The Phase 1
prototype uses only a route-local typed fixture, and step 4 remains a protected
invariant. No real document persistence or action is implemented.

Phase 2 technical-design preparation was authorized on 2026-08-15. Real
vertical slices still require separate approval of category purpose/retention,
document-specific authorization, private cloud storage/provider
responsibilities, malware quarantine, audit events, backup/restore, incident
response, and rights/deletion operations.

Do not combine these into Phase 1 or treat their ordering as authorization to
implement them automatically.

### Documents Wave A Phase 2 — technical design only

Phase 2 maps the approved prototype to a provider-neutral domain proposal. It
does not create runtime files or modify personnel implementation.

```text
Files expected to modify now: existing page-pack Markdown only
Files expected to create now: none
Packages affected now: none
Cross-application impact now: none
Database change: PROPOSAL
API or contract change: PROPOSAL
Permission/auth change: PROPOSAL
Runtime/provider change: PROPOSAL
```

The design reuses the current employee dossier scope, OWNER-only personnel
guard pattern, optimistic revision/idempotency patterns, and personnel audit
infrastructure. It proposes new document-specific permissions, metadata and
version persistence, a private object-storage adapter, quarantine/verification
processing, and application-controlled file delivery only for a later approved
implementation.

Recommended later vertical-slice order:

1. **Real empty/list foundation:** approved category allowlist, document read
   permission, tenant-scoped metadata repository, empty/error/forbidden states,
   and cross-tenant tests.
2. **One-category add:** server-mediated bounded upload, private quarantine,
   verification, idempotent command, processing/rejected/available states, and
   cleanup compensation.
3. **Content access:** fresh scope/permission check, application-controlled
   view/download, one access-grant audit event, expiry/retry behavior, and no
   stable URL.
4. **Explicit replacement:** expected revision, immutable new version,
   verification before current-pointer swap, previous version safe on failure,
   and atomic metadata/audit update.
5. **Document activity:** safe allowlisted OWNER projection separated from the
   employee business-change timeline.

Before slice 1, approve or revise D2-01 through D2-09 in
`DATA_AND_INTERACTION_SPEC.md`. Before slice 2, additionally select the private
storage and scanning providers, define secrets/region and operational ownership,
and approve the category purpose plus retention schedule. No implementation is
implicitly authorized by this sequence.

On 2026-08-15 the product owner selected `Contrat de travail signé` as the first
category and PDF up to 10 MiB as the first-slice file boundary. A signed
amendment remains a separate deferred category. Legal/privacy and security
approvals for these choices are still required, so this decision does not open
slice 1 or authorize runtime work.

The future application boundary must expose separate provider-neutral
`PersonnelDocumentStorage` and `PersonnelDocumentScanner` services. Provider
SDK imports and credentials stay inside their infrastructure adapters. A
storage-provider change may alter the adapter, configuration, dependency, and
provider contract tests, but not the document domain, permissions, audit,
contracts, server actions, or UI behavior.

### Documents Wave A Phase 3 — local vertical slice implemented

The product owner authorized local implementation on 2026-08-15. The first
slice is complete in code and local database migration `0007`:

1. replace the fictional Documents fixture with a real lazy-loaded tab;
2. add signed-contract metadata, immutable versions, and idempotency receipts;
3. enforce separate OWNER-only document read/manage permissions;
4. quarantine PDF bytes in private local storage and require Microsoft Defender
   before promotion;
5. commit metadata/audit only after verification and clean orphaned objects on
   failure;
6. mediate inline view/download through a fresh tenant and permission check;
7. keep production fail-closed until the deferred external-provider, legal,
   retention, backup, deletion, and incident gates are approved.

Do not interpret the local adapter as the selected EU production provider. The
next delivery step is functional/security and visual QA of this slice, followed
by production-readiness decisions in a separately approved phase.

### Documents Wave B Phase 0 — signed amendments, read-only

Repository analysis classifies signed amendments as
`NEW_CAPABILITY_DISCOVERY` inside the integrated Documents surface. Phase 0
updates this stable page pack only and stops before prompt execution or runtime
implementation.

```text
Files expected to modify now: existing page-pack Markdown only
Files expected to create now: none
Packages affected now: none
Cross-application impact now: none
Database change: NO (later PROPOSAL)
API or contract change: NO (later PROPOSAL)
Permission/auth change: NO (reuse requires later approval)
Runtime/provider change: NO
```

Phase 0 records:

1. OWNER-only local MVP and establishment-owned employee-dossier boundary;
2. distinction between a later legal amendment and a correction version of the
   same uploaded amendment;
3. sensitive-data, audit, authorization, and storage/scanner invariants;
4. decisions still needed for amendment identity, labels, ordering, effective
   date versus signature date, applicability, and retention;
5. explicit exclusions and truthful UI states;
6. a ready design prompt based on the current as-built Documents drawer.

Approval sequence after this gate:

1. product owner approves or revises the Phase 0 MVP and proposed date/label
   discovery scope;
2. product owner separately authorizes running the design prompt;
3. generated references return as `DRAFT` for review;
4. no schema, enum, contract, migration, repository, server action, file
   mutation, or implementation begins without a later phase approval.

Steps 1–3 were completed on 2026-08-15: the product owner approved Phase 0,
authorized the design prompt, and four responsive references were generated as
`DRAFT`. Product review then approved the selected visual direction and a local
typed-fixture Phase 1 prototype. Step 4 remains the active stop condition for
every real data or file capability.

### Documents Wave B Phase 1 — typed-fixture local prototype

Phase 1 adds one route-local presentation component and one route-local fixture
model/test. It renders two fictional amendment cards beneath the real signed-
contract slice, with a persistent demonstration notice. Every amendment action
is disabled and no browser event calls a server action, API, repository, storage
service, or file chooser.

```text
Files expected to modify: existing Documents presentation and page-pack Markdown
Files expected to create: route-local prototype component, model, and test
Packages affected: apps/backoffice only
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/provider change: NO
```

Stop after responsive/accessibility review. Phase 2 must derive and approve the
minimum amendment identity/date/order model before any enum, schema, contract,
repository, or real file action is considered.

### Documents Wave B Phase 2 — technical design only

Phase 2 was authorized on 2026-08-15 and changes page-pack documentation only.
It maps the approved fixture flow to a provider-neutral proposal without
creating real amendment behavior.

```text
Files expected to modify now: existing page-pack Markdown only
Files expected to create now: none
Packages affected now: none
Cross-application impact now: none
Database change: PROPOSAL
API or contract change: PROPOSAL
Permission/auth change: REUSE PROPOSAL
Runtime/provider change: REUSE PROPOSAL
```

Recommended later local vertical-slice order:

1. **Scoped empty/list:** separate amendment aggregate, safe read contract,
   OWNER-only document read permission, effective-date ordering, ten-item cursor
   page, and cross-tenant denial tests.
2. **Add one amendment:** required effective date, optional reference, bounded
   PDF, idempotent command, quarantine/scan/promotion, atomic metadata/audit,
   cleanup compensation, and rejected/retry states.
3. **View/download:** fresh scoped authorization for each content grant,
   application-controlled delivery, no stable URL, and minimized access audit.
4. **Replace one scan:** amendment ID plus expected revision, verification before
   current-version swap, immutable prior version, conflict/retry behavior, and
   no effect on other amendments.
5. **Safe activity and paging QA:** one deduplicated Documents-open event,
   allowlisted amendment events, ten-item navigation, and responsive/security
   regression.

Do not extend the current single-category uniqueness rule to represent multiple
amendments. The recommended later persistence design uses a distinct logical
amendment aggregate with immutable versions while sharing the implemented
provider-neutral storage/scanner services and document permissions. The exact
schema and contract names remain subject to the Phase 3 implementation review.

Before slice 1, approve or revise AB2-01 through AB2-09 in
`DATA_AND_INTERACTION_SPEC.md`. Before any real file is accepted, approve the
local security boundary. AB2-10 and production provider/operations decisions
remain release blockers and do not need to be resolved for a separately
approved local-only implementation.

Stop here. Phase 2 authorizes no enum, schema, migration, contract, repository,
permission, action, API, storage object, fixture removal, or real data.

### Documents Wave B Phase 3 — local vertical slices implemented

The product owner approved AB2-01 through AB2-09 and local implementation on
2026-08-15. The delivery follows the proposed slice order:

1. safe OWNER-only list with ten-item effective-date cursor pages;
2. idempotent add with required date, optional reference, PDF validation,
   quarantine, Defender scan, promotion, atomic metadata/audit, and cleanup;
3. fresh scoped server-mediated view/download;
4. expected-revision replacement that verifies before current-version swap and
   leaves prior versions immutable;
5. cross-tenant, replay, conflict, paging, safe-projection, responsive, and
   failure/recovery coverage.

```text
Migration: packages/db-cloud/drizzle/0008_omniscient_colonel_america.sql
Contracts: packages/contracts/src/personnel/index.ts
Schema/repository: packages/db-cloud/src/schema/personnel.ts and personnel-contract-amendment-repository.ts
Application: Salaries actions, route-local amendment UI, and protected content route
Database change: LOCAL APPLIED
API or contract change: IMPLEMENTED FOR LOCAL DEVELOPMENT
Permission/auth change: NONE; existing OWNER-only document permissions reused
Runtime/provider change: NONE; existing local-only adapters reused
Production release: BLOCKED
```

Rollback before production consists of removing the local UI/actions/routes and
reverting migration `0008` in an explicitly disposable local database. Never
drop these tables after real production collection without a separately
approved export/retention/deletion plan. AB2-10 remains a deferred production
task.

## Verification gate

Use exact affected commands including:

```text
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
pnpm format:check
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice test
pnpm --filter @yuta/backoffice build
pnpm test:auth
pnpm --filter @yuta/tenant test
pnpm --filter @yuta/contracts test
pnpm test:db-cloud
```

Schema work additionally requires guarded integration tests and reviewed SQL.
The Backoffice has no lint script.

## Phase 5 — Functional, security, visual, and as-built QA

Run functional/security checks before visual review. Verify 1440/1024/768/390,
shell fidelity, hierarchy, states, keyboard/focus, overflow, dialogs, and input
recovery. Test tenant/authorization denial cases, remove completed-slice
fixtures, and synchronize docs before marking the package `implemented`.

## Wave C Phase 0 — read-only discovery gate

Wave C currently authorizes documentation and repository analysis only:

1. inventory existing employee facts, permissions, ownership, dossier UI,
   Documents boundary, and the planned Formalités route;
2. approve or revise the two-field discovery MVP: controlled CDD reason and
   contractual weekly duration;
3. approve product ownership, OWNER-only audience, sensitive-data treatment,
   explicit deferred capability, UI states, and ready-to-run design prompt;
4. only after approval, run the design prompt and review DRAFT references;
5. keep later interaction mapping, domain choices, technical design, and real
   vertical slices behind their own approval gates.

```text
Files expected to modify in Phase 0: this existing page pack only
Files expected to create in Phase 0: none
Packages affected: documentation only
Cross-application impact: none
Database change: PROPOSAL; NO CHANGE AUTHORIZED
API or contract change: PROPOSAL; NO CHANGE AUTHORIZED
Permission/auth change: PROPOSAL; NO CHANGE AUTHORIZED
Runtime/device change: NO
Implementation code: NOT AUTHORIZED
Design prompt: READY; EXECUTION AWAITS APPROVAL
```

Stop after Phase 0. Do not create a field, enum, schema, migration, contract,
permission, repository, loader, action, API, fixture, Formalités link/status,
or runtime implementation. Phase 1 begins only if the product owner explicitly
approves Phase 0 and authorizes the design prompt.

### Wave C Phase 1 — local prototype implemented

The product owner approved the selected visual direction and local prototype on
2026-08-16. The delivered slice contains only:

1. a route-local typed fixture with fictional reason/duration values;
2. a read-only complementary-information component in the existing employment
   tab;
3. explicit `Prototype` and no-save disclosure;
4. CDI not-applicable presentation logic and focused unit tests;
5. no new edit control and no change to the existing real edit action.

Stop after prototype QA. Do not add inputs, save behavior, schema, migration,
contract, permission, repository, action, API, audit event, or Formalités
workflow. Phase 2 interaction/data decisions require separate authorization.

### Wave C Phase 2 — technical design only

Phase 2 was authorized on 2026-08-16 and changes documentation only. The
recommended later design is:

1. extend the existing employee aggregate with nullable CDD-reason code and
   integer contractual weekly minutes;
2. expose safe nullable read values under existing trusted tenant scope;
3. reuse the current OWNER-only employee permissions and single edit action;
4. extend the current atomic revision/idempotency-protected mutation rather than
   creating a second update workflow;
5. reuse minimized employment audit and the existing dossier-open event;
6. keep Formalités, Documents, Planning, Pointage, and payroll as separate
   owners.

Proposed later implementation order:

1. additive nullable persistence, safe contract projection, and cross-tenant
   read tests;
2. existing-employee edit with four supported CDD reasons, minute validation,
   contract-transition rules, conflict/retry, and audit tests;
3. employee-create integration after edit is proven;
4. fixture removal and functional/security/responsive/as-built QA.

Before slice 1, approve or revise WC2-01 through WC2-12 in
`DATA_AND_INTERACTION_SPEC.md`. Legal review must confirm the supported reason
subset and numeric boundary before production; a local Phase 3 approval does
not constitute that review.

```text
Database change: PROPOSAL; NO CHANGE AUTHORIZED
API or contract change: PROPOSAL; NO CHANGE AUTHORIZED
Permission/auth change: NO; EXISTING OWNER-ONLY PERMISSIONS PROPOSED FOR REUSE
Runtime/provider change: NO
Prototype fixture: RETAINED
Production: NOT AUTHORIZED
```

Stop here. Do not create a field, enum, migration, contract, repository,
permission, action, API, audit event, fixture removal, or real-data behavior.

### Wave C Phase 3 — local vertical slices implemented

Approved on 2026-08-16 for local development only:

1. additive nullable employee-dossier storage and safe read projection;
2. four controlled CDD reason codes and 1–2,880 integer weekly minutes;
3. existing OWNER-only create/edit flow with revision, idempotency, atomic
   writes, transition confirmation, and minimized audit;
4. real complementary-employment detail card and fixture removal;
5. local migration and guarded tenant-scoped integration tests.

```text
Migration: packages/db-cloud/drizzle/0009_heavy_sauron.sql
Permission/auth change: NO; existing OWNER-only permissions reused
Runtime/provider change: NO
Prototype fixture: REMOVED
Production: NOT AUTHORIZED
```

Production rollout, data collection, legal validation of the controlled list,
retention/privacy operations, and release evidence remain separate tasks.

### Wave C Phase 5 — local QA and as-built complete

Completed on 2026-08-16:

1. contract boundaries cover 1 and 2,880 minutes, zero, and unsupported reason;
2. guarded integration covers tenant isolation, CDD-to-CDI confirmation,
   idempotency/conflict/audit, and an unrelated edit of a legacy nullable CDD;
3. signed-in OWNER QA creates, reads, and transitions a fictional CDD dossier;
4. save remains disabled until CDD-reason clearing is explicitly confirmed;
5. the history exposes field labels without old/new sensitive values;
6. 1440/1024/768/390 captures prove drawer width and no horizontal overflow;
7. the temporary QA dossier, audit events, and command receipts are removed.

This closes the approved local Wave C delivery. Production remains a separate,
blocked release decision.

## Wave D Phase 0 — `À traiter` read-only discovery gate

Status: `PHASE 2 TECHNICAL DESIGN COMPLETE FOR REVIEW — REAL DATA BLOCKED`

Phase 0 work is limited to this existing page pack:

1. classify the new surface as `NEW_CAPABILITY_DISCOVERY` inside the integrated
   Salaries page;
2. inventory current employee completeness, signed-base-contract availability,
   recorded departure dates, permissions, tenant scope, existing resolving
   flows, and absent task/notification infrastructure;
3. propose the three-kind derived MVP and distinguish correctable issues from
   dated events;
4. record OWNER-only organization + establishment + employee ownership,
   sensitive-data and audit requirements, date rules, truthful failures, and
   production blockers;
5. defer unsupported task, notification, CDD expiry, Formalités, manager,
   cross-establishment, and compliance behavior;
6. prepare the Wave D responsive design prompt;
7. obtain product approval of WD0-01 through WD0-08 and prompt execution;
8. store four selected responsive DRAFT studies and stop before implementation.

```text
Target: SURFACE + FLOW inside /equipe/salaries
Delivery mode: NEW_CAPABILITY_DISCOVERY
Containing page: EXISTING integrated page; preserve behavior
Capability baseline: NOT_APPLICABLE; surface is absent
Containing-page baseline: current Wave C Phase 5 as-built evidence
Files expected to modify in Phase 0: existing page-pack Markdown only
Files expected to create in Phase 0: none
Packages affected: documentation only
Cross-application impact: none
Database change: NO; NO SCHEMA/TASK TABLE AUTHORIZED
API or contract change: PROPOSAL; NO CHANGE AUTHORIZED
Permission/auth change: PROPOSAL TO REUSE OWNER-ONLY READS; NO CHANGE AUTHORIZED
Audit change: PROPOSAL; NO EVENT AUTHORIZED
Runtime/device/provider change: NO
Fixture/prototype/UI code: NOT AUTHORIZED
Production: NOT AUTHORIZED
Design prompt: EXECUTED; VISUAL DIRECTION APPROVED FOR PHASE 1 PROTOTYPE
```

### Phase 1 authorized local prototype

The product owner approved the selected Wave D design and authorized a local
typed-fixture prototype on 2026-08-16. Authorized files are limited to one
route-local presentation component, its fixture-focused test, the containing
page composition, and this stable page pack.

```text
Database change: NO
API or contract change: NO
Permission/auth change: NO
Audit change: NO
Runtime/provider change: NO
Real employee/document data: NO
Prototype actions: VISIBLE BUT DISABLED
Production: NOT AUTHORIZED
```

Phase 1 implements only the approved ready state. It must preserve the
integrated page loader, trusted OWNER scope, three real metrics, employee list,
drawer, and every existing mutation. The prototype cannot consume employee
records or document availability.

### Phase 2 interaction/data design only

The product owner approved the local Phase 1 prototype and authorized Phase 2
documentation on 2026-08-16. The proposal now defines:

1. a derived organization + establishment-scoped overview owner with bounded
   employee and document-presence reads;
2. five-item independent cursor pages for each group with no total or new
   route;
3. deterministic neutral correction order and earliest-departure event order;
4. fresh server-authorized target resolution before entering an existing
   edit, Documents-add, or departure-review flow;
5. partial document failure, full employee failure, no-items, retry, stale
   target, refresh, focus, and responsive behavior;
6. existing OWNER-only employee/document permissions and a proposed minimized
   cross-employee overview audit event;
7. a required authorization, tenant-isolation, cursor, stale-source, audit,
   state, accessibility, and responsive test matrix.

```text
Files expected to modify in Phase 2: existing page-pack Markdown only
Files expected to create in Phase 2: none
Packages affected: documentation only
Cross-application impact: none
Database change: NO; DERIVED READ PROPOSED, NO TASK TABLE
API or contract change: PROPOSAL; NO CHANGE AUTHORIZED
Permission/auth change: NO; EXISTING OWNER PERMISSIONS PROPOSED FOR REUSE
Audit change: PROPOSAL; NEW ALLOWLISTED EVENT NOT AUTHORIZED
Runtime/provider change: NO
Fixture/prototype UI: RETAINED UNCHANGED
Real employee/document data: NOT AUTHORIZED
Production: NOT AUTHORIZED
```

WD2-01 through WD2-12 and the local real-data Phase 3 slice were approved on
2026-08-17.

### Phase 3 local real-data slice implemented

1. Added the bounded action-overview contract and independent cursors.
2. Added set-based employee/document-presence reads and one minimized overview
   audit event using existing tables only.
3. Added fresh scoped target revalidation before opening an existing flow.
4. Replaced the fictional fixture with the real local UI, five-item paging,
   retry, partial document-source warning, and empty state.
5. Reused edit, Documents add, and departure review; successful document save
   now refreshes route source truth.
6. Kept production fail closed: no overview read, render, or action outside
   development mode.

No schema, migration, task persistence, notification, public API, or new
permission was introduced. Production approval remains a separate later gate.

### Wave D Phase 4 local integration audit completed

Phase 4 was approved on 2026-08-17 without production authority. The audit:

1. traced the authenticated OWNER, active-establishment, permission, repository,
   transport, target-revalidation, and existing-flow boundaries;
2. centralized page/action development gating in one tested helper;
3. confirmed development renders the real overview and no fixture disclosure;
4. built and served a production build on an isolated local port, confirming
   Salariés renders but Wave D does not;
5. introduced no data/schema/API/permission/audit/provider expansion;
6. kept mutation-capable database integration tests disabled because the
   explicit local database opt-in was not granted.

Status: `COMPLETE_LOCAL_AUDIT — PRODUCTION BLOCKED`.

### Wave D Phase 5 local QA and as-built completed

Phase 5 was approved and completed on 2026-08-17 against the signed-in local
LUNA OWNER session. Functional and visual QA confirmed:

1. real configured establishment data with no fixture/DRAFT disclosure;
2. one current correction item plus the truthful empty departures group;
3. the existing Documents-add flow opens after fresh target validation;
4. the employee drawer is exactly viewport width at 390 px with no page or
   drawer horizontal overflow;
5. 1440/1024/768/390 layouts preserve hierarchy and stack the action at the
   narrow breakpoint;
6. closing the action-opened drawer with Escape returns keyboard focus to the
   originating overview button after a Phase 5 correction;
7. no browser warning or error in a fresh QA session.

The four current as-built captures are stored under `references/` with stable
`wave-d-phase-5-as-built-*` names. Error, partial-source, and five-plus-item
pagination states were not fabricated against real data for screenshots; their
contracts and implementation remain covered by code/tests. The opt-in database
integration suite was not forced. Status: `LOCAL QA COMPLETE — PRODUCTION
BLOCKED`.

### Later sequence, not yet authorized

1. review production legal, privacy, retention, security, and operations gates;
2. keep production behind the existing personnel/document legal, privacy,
   retention, security, provider, backup/restore, and operations gates.

Phase 2 itself remained documentation-only. The separately approved Phase 3
work above is the sole authority for the local contract, repository, actions,
audit event, fixture replacement, and real-data UI.

## Wave E Phase 0 — personnel register and PDF export discovery gate

Status: `PHASE 0 APPROVED; DESIGN PROMPT EXECUTED — NO IMPLEMENTATION`.

Phase 0 completed these read-only tasks on 2026-08-17:

1. reconciled the integrated Salariés employee/document/audit foundation with
   the absent register, stagiaire/service-civique, retention, and PDF domains;
2. reviewed current official Code du travail and CNIL sources without making a
   legal-compliance claim;
3. identified the current fields that may be reused and every required or
   conditional field/domain currently missing;
4. proposed a dedicated establishment-wide route entered from Salariés rather
   than another per-employee drawer tab;
5. proposed OWNER-only access, separate future register read/export permissions,
   strict organization + establishment scope, and minimized access audit;
6. separated structured register source data from transient protected PDF output;
7. recorded stable order, non-destructive history, five-year retention review,
   responsive/accessibility states, and production gates;
8. retained OCR, document extraction, AI suggestions, and automatic field
   updates for separately approved Wave F discovery;
9. prepared the Wave E design prompt; product subsequently approved WE0-01
   through WE0-10 and authorized prompt execution;
10. created the dedicated `backoffice-equipe-registre-personnel` design pack
    and retained four responsive DRAFT studies for visual review.

No implementation inventory item authorizes a schema, migration, contract,
route, navigation action, permission, repository, API, audit event, PDF
generator, storage object, provider, fixture, test, or production behavior.

### Proposed later sequence — not authorized

1. product reviews and approves or revises the four DRAFT responsive studies in
   the dedicated register page pack;
2. after explicit approval, build a local typed-fixture prototype with disabled
   export and no real personal data;
3. Phase 2 defines the exact field dictionary, person categories, immutable
   history/order model, permissions, audit, retention, PDF contract, and tests;
4. legal/DPO, privacy, security, and operations owners approve the electronic-
   register and production boundaries before any real-data implementation;
5. deliver later vertical slices only after those approvals.

```text
Files expected to modify in Phase 0: existing page-pack Markdown only
Files expected to create in Phase 0: none
Packages affected: documentation only
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/provider change: NO
Operational data change: NO
```

## Wave F Phase 0 — document extraction discovery complete

Status: `WAVE F PHASE 2 TECHNICAL DESIGN COMPLETE FOR REVIEW — IMPLEMENTATION BLOCKED`.

Phase 0 reconciles the existing secure signed-contract storage, scanner,
permissions, server delivery, employee fields, mutations, and audit boundaries
with the absent OCR/AI capability. The recommended first scope is one verified
base contract for one existing employee, reviewed suggestions for allowlisted
employment fields, and no automatic save.

### Proposed later sequence — separately gated

1. product approved WF0-01 through WF0-12 on 2026-08-18;
2. the separately authorized Wave F design prompt produced four DRAFT references;
3. product approved the visual direction and Phase 1; the local typed-fixture
   prototype is complete with no document read or provider call;
4. Phase 2 decides extraction contracts, permission/audit, transient retention,
   idempotency, provider/local OCR strategy, consent/disclosure, cost/rate limits,
   test matrix, and production gates;
5. only a separately approved Phase 3 may implement a local vertical slice;
6. Phase 4 hardens security, tenant isolation, prompt-injection handling,
   stale/version conflicts, retries, observability, and provider failure;
7. Phase 5 performs functional, security, responsive, accessibility, and
   as-built QA without using real personnel files solely for screenshots.

No shared generic AI platform should be extracted before a second proven
consumer exists. A first server-only application interface may be provider-
neutral so its adapter can change without changing Documents UI or employee
domain validation.

```text
Files expected to modify in Wave F Phase 0: existing backoffice-equipe-salaries page-pack Markdown only
Files expected to create in Wave F Phase 0: none
Packages affected: documentation only
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/provider/AI call: NO
File read/transmission: NO
Operational data change: NO
Production: NOT AUTHORIZED
```

### Wave F Phase 1 implementation evidence

- development-only runtime gate is tested and fails closed for production/test;
- the action is attached only to the signed base-contract card;
- route-owned typed fixtures model three approved fictional suggestions;
- choices are local presentation state with no preselection;
- the apply action is always disabled;
- no extraction service, file read, OCR/AI call, contract, schema, migration,
  repository, permission, audit event, or employee mutation was added;
- Backoffice component/model/runtime tests and four-width browser overflow
  checks cover the prototype.

## Wave F Phase 2 — technical delivery plan

Status: `APPROVED; LOCAL SYNTHETIC PHASE 3 IMPLEMENTED`.

### Proposed Phase 3 slices — separately gated

1. **Pure contract and validation tests**
   - define the strict versioned result and field discriminated union in
     `@yuta/contracts` only after approval;
   - test extra-key rejection, confidence/page/excerpt bounds, dependency codes,
     and no arbitrary provider payload.
2. **Server orchestration with test adapters**
   - add route-owned preflight and extraction interfaces behind `server-only`;
   - use synthetic PDFs and a deterministic adapter;
   - prove authorization occurs before any content open or adapter invocation.
3. **Development interaction vertical slice**
   - replace the Phase 1 fixture button with a development-only server request;
   - keep provider exercise synthetic unless WF2-06 is evidenced;
   - implement pending, partial/no-result, unsupported, timeout, failure, and retry.
4. **Bounded apply vertical slice**
   - permit only `position` and `contractWeeklyMinutes`;
   - reauthorize extraction and employee management;
   - verify exact document version and employee revision;
   - reuse the existing employee update validation, idempotency, conflict, and audit behavior.
5. **Provider adapter evaluation**
   - evaluate local PDF preparation and an optional OpenAI adapter behind the
     same interface using synthetic/approved fixtures;
   - measure extraction accuracy, refusal/invalid result rate, latency, and cost;
   - do not promote an adapter to real personnel files or production without
     WF2-06 and release gates.

### Wave F Phase 3 implementation evidence

Slices 1 through 4 are implemented locally. Slice 5 remains deferred because
no provider call was authorized:

- `@yuta/contracts` owns strict request, review-result, suggestion, scenario,
  and bounded-apply schemas;
- the Backoffice owns a server-only PDF preparer, deterministic synthetic
  adapter, orchestration timeout, and development in-memory rate limiter;
- the server generates a fictional three-page PDF and never opens the signed
  personnel document for extraction;
- the document UI offers complete, partial, no-result, unsupported, failure,
  timeout, retry, review, and apply states only in development;
- `position` and `contractWeeklyMinutes` reuse the existing scoped employee
  update, validation, revision, idempotency, and audit transaction;
- `employmentTermType` remains visible but blocked from apply;
- the existing personnel audit table records minimized requested, completed,
  failed, and applied outcomes without a migration;
- production, real-file reads, remote calls, provider evaluation, and release
  operations remain blocked.

### Wave F Phase 4 local hardening evidence

Phase 4 was authorized without production authority and completed locally:

- a completed extraction audit event now acts as the short-lived server-side
  review grant; it must match trusted tenant scope, employee, request,
  document/version, and complete/partial outcome;
- the grant expires after 15 minutes and no result cache/table was introduced;
- stale employee/document props and apply conflicts invalidate all transient
  choices and the request before retry;
- controlled radio state removes the warning discovered in browser QA;
- repository-gated tests cover valid, mismatched, cross-establishment, and
  expired grants; the existing authorization/service tests continue to prove
  denial before preparation or adapter invocation;
- local browser QA covered supported recovery states, focus, console, and
  responsive overflow without applying employee changes;
- provider evaluation remains the separately gated slice 5 item.

### Expected future ownership

```text
apps/backoffice route UI
-> route actions and application orchestration
-> server/personnel-contract-extraction interfaces and adapters
-> existing db-cloud scoped document grant and employee repository
-> existing private personnel-document storage runtime
```

`@yuta/contracts` may later own serialization-safe request/result schemas.
`@yuta/db-cloud` continues to own only tenant-scoped persisted reads/mutations
and audit transactions. `@yuta/ui` receives no personnel or AI business logic.
No generic AI package should be created before a second independent consumer
proves a reusable boundary.

### Explicitly not authorized in Phase 2

- code changes beyond the already approved Phase 1 prototype;
- OpenAI or OCR SDK/library installation and API key/environment variables;
- permission or audit enum changes;
- schema, migration, result cache, queue, cron, worker, webhook, or background mode;
- PDF content access for extraction or any outbound file/text transmission;
- applying a suggestion or changing employee/register/document data;
- production enablement, secrets, deployment, monitoring, billing, or legal claims.

### Wave F Phase 5 local QA and as-built completed

Phase 5 was authorized and completed on 2026-08-18 without production or
real-file authority. Signed-in OWNER QA:

1. opened an existing employee and the signed base-contract Documents surface;
2. ran only the complete server-generated synthetic-PDF scenario;
3. verified truthful synthetic disclosure, review hierarchy, document actions,
   keyboard focus restoration, and empty console warnings/errors;
4. checked 1440/1024/768/390 layouts with no horizontal page or review overflow;
5. retained four stable as-built captures without applying a suggestion.

No implementation code, schema, migration, provider, SDK/key, real-file read,
external transmission, operational data mutation, or production behavior was
added by Phase 5. Provider evaluation remains a future separately approved
wave; it is not completed by this local synthetic finalization.

## Wave G Phase 0 — provider evaluation plan only

Status: `DOCUMENTATION COMPLETE FOR REVIEW — IMPLEMENTATION BLOCKED`.

### Repository-proven reuse

- keep the route UI and Wave F strict request/result contracts unchanged;
- keep authorization and exact employee/document resolution before preparation;
- keep `ContractPdfPreparer` and `ContractExtractionAdapter` as the replaceable
  application boundary;
- keep the 45-second foreground timeout, manual retry, minimized audit, and
  transient review behavior;
- keep provider secrets and clients server-only if later authorized;
- do not create a generic shared AI package before another independent consumer
  proves common ownership.

### Proposed later sequence — separately gated

1. **Phase 1: provider eligibility and private submission — IN PROGRESS**
   - review the organization-level
     [`OPENAI_PROVIDER_ELIGIBILITY.md`](../../../operations/OPENAI_PROVIDER_ELIGIBILITY.md);
   - complete legal identity, private contacts, volume, and budget outside the
     public repository;
   - obtain explicit authorization before contacting OpenAI;
   - retain the provider response privately and synchronize only
     non-confidential conclusions into current documentation;
   - create no account, key, SDK, request, or spend as an inferred follow-up.

   Product approval and authorization to submit were recorded on 2026-08-18.
   The private form was prepared with the pre-incorporation status, four use
   cases, 24-month target, planning volumes, and budget envelope. The product
   owner confirmed submission through the OpenAI Sales contact form on
   2026-08-18. An OpenAI response is not yet recorded. Phase 1 stops while
   awaiting that evidence. Product authorized the offline Phase 2 track to run
   in parallel on 2026-08-19; this does not infer provider approval.

2. **Phase 2: offline fictional corpus and evaluation harness — COMPLETE**
   - generate the approved fictional corpus and answer manifest;
   - measure expected answers through the existing strict YUTA result contract;
   - do not add native-text extraction, Tesseract, or another self-hosted OCR path;
   - add no external SDK/key/request and no restaurant UI change.
3. **Phase 3: synthetic OpenAI experiment design — SANDBOX CONFIGURED**
   - approve the OpenAI account, EU project, retention control, budget, pinned snapshots,
     exact request shape, telemetry minimization, and secret ownership;
   - stop before any external request.
4. **Phase 4: synthetic OpenAI benchmark — COMPLETE; SELECTION GATE FAILED**
   - call only OpenAI with explicitly approved fictional PDFs;
   - record normalized metrics without secrets or real personnel content;
   - compare only approved pinned OpenAI snapshots/request settings.
5. **Phase 5: comparison evidence complete; selection closeout pending**
   - accept or reject OpenAI from evidence; rejection stops this wave rather
     than silently adding another provider;
   - test malformed output, instruction injection, timeouts, rate/cost limits,
     version pinning, kill switch, and production-disabled behavior.
6. **Separate future real-file pilot wave**
   - may begin only after legal/DPO/privacy/security/operations approval,
     AIPD decision, DPA/subprocessor/region/retention evidence, employee
     information duties, incident response, and explicit product authorization.

### Phase 0 prohibition

Do not install or configure OpenAI, Tesseract, native extraction, Azure, Google,
AWS, or another provider. Do not create an API key, environment variable, billing account,
remote adapter, eval script, fixture PDF, schema, migration, database record,
queue, log sink, production flag, or provider call in this phase.

### Wave G Phase 2 corpus — offline only

Product authorized Phase 2 on 2026-08-19 while the Phase 1 Sales response
remains pending. Product reviewed the first ten-file slice and authorized its
expansion on the same date. The completed corpus contains 60 generated,
entirely fictional two-page PDFs: 20 digital-text files, 15 clear image-only
scans, 15 degraded scans, and 10 ambiguous/adversarial files. The versioned
manifest records stable hashes, page counts, exact allowlisted answers, and
required abstentions.

The server-owned evaluation harness parses every candidate through the existing
strict YUTA extraction result before measuring exact matches, missing and false
suggestions, incorrect high-confidence suggestions, and abstention violations.
Tests verify the corpus distribution, bytes, hashes, page counts, exact answers,
unsafe guesses, and rejection of extra provider keys. The corpus generator is
offline and deterministic. It uses no employee/document storage, restaurant UI,
provider SDK, key, account, network request, schema, migration, or operational
data.

The fixed 60-document Phase 2 corpus is complete. Stop before each Phase 3
external-state step; do not create a service account, key, SDK integration, or
provider request without a separate explicit approval.

### Wave G Phase 3 — bounded temporary sandbox

Product authorized design preparation on 2026-08-19 using the current
pre-incorporation API organization as a disposable synthetic-evaluation owner.
Product separately authorized project creation on 2026-08-19. The current
configuration is:

- one isolated project named `YUTA AI Test`;
- observed geography `Global` and data-retention control `None`, with no EU or
  Zero Data Retention claim;
- private project ID excluded from the repository;
- USD 10 prepaid organization credit with automatic reload disabled;
- USD 5 monthly hard project limit and the dashboard's 100% alert;
- model allowlist limited to `gpt-5.6-luna` and `gpt-5.6-terra`;
- project service account/key named `yuta-ai-evaluation-local`, with the secret
  retained privately and excluded from the repository;
- custom `YUTA AI Evaluation Caller` role with only model-request capability,
  replacing the broader preset `member` role;
- zero observed usage, no SDK, no injected environment secret, and no request;

The remaining Phase 3 configuration is:

- approve exact model snapshots and a conservative project rate limit;
- define the server-only secret injection path and kill switch without
  committing the secret;
- direct PDF input from this approved corpus only, strict structured output,
  `store: false`, no tools, no background mode, and no real personnel content;
- archive the temporary project and create a new company-owned organization,
  project, service account, and key before any later production consideration.

The ignored local secret path and explicit `approved-synthetic-only` run gate
now provide the evaluation-only injection path and kill switch. Exact model
snapshot pinning and a project rate-limit decision remain open. OpenAI's written
Sales response also remains pending. The observed Global/None project is
synthetic-only.

### Wave G Phase 4 — complete synthetic benchmark evidence

Product explicitly authorized a minimal adapter and the first fictional-PDF
request on 2026-08-19. The implemented slice:

- uses a server-only native-`fetch` OpenAI adapter behind
  `ContractExtractionAdapter`, with no OpenAI SDK dependency;
- accepts only prepared `synthetic_fixture` bytes with a PDF signature and the
  existing 10 MiB bound;
- sends Responses direct Base64 PDF input with `store: false`, low reasoning
  effort, no tools, no background mode, and a strict semantic JSON schema;
- rebuilds request/document/revision/page/expiry metadata locally and validates
  the final value through the existing strict YUTA result schema;
- locks the smoke runner to approved fixture IDs, manifest hashes, and page
  counts; it requires an ignored environment secret plus either the exact
  `approved-synthetic-only`, `approved-three-representative`, or
  `approved-remaining-corpus` execution gate; Phase 5 adds the separate
  `approved-terra-full-corpus` gate for the approved comparison only;
- made one first digital-text request and, after separate approval, three
  representative requests covering clear scan, degraded partial scan, and
  adversarial instruction content using the `gpt-5.6-luna` alias;
- passed all four fixtures on the first attempt with zero missing, false,
  incorrect-high-confidence, or abstention-violating suggestions;
- measured 4,362 ms / 6,495 input / 183 output tokens / USD 0.0015186 for the
  clear scan, 2,799 ms / 6,495 / 66 / USD 0.0013782 for the degraded scan, and
  5,791 ms / 711 / 178 / USD 0.0003558 for the adversarial fixture;
- then ran the separately approved remaining 56 fixtures once each, in
  sequence, without retry;
- persisted only normalized aggregate evidence, never a provider response,
  provider identifier, prompt, PDF content, or secret.

The complete Luna baseline produced:

- 58/60 document passes (96.67%): digital text 20/20, clear scan 14/15,
  degraded scan 14/15, and adversarial 10/10;
- 60/60 schema-valid responses, no provider failures or timeouts, and every
  recorded request below eight seconds;
- one false and missing high-confidence suggestion on `wg2-scan-clear-03`;
- one status-only mismatch on `wg2-scan-degraded-07`, which safely returned no
  suggestions but used `partial` rather than `no_result`;
- zero abstention violations and no arbitrary-key or unsupported-field leak.

This configuration fails WG0-09 because the approved benchmark allows no
incorrect high-confidence suggestion. Phase 4 is complete, but it does not
select OpenAI or authorize a post-hoc retry. The Usage dashboard had not yet
ingested the full run immediately afterward, so full billed-cost reconciliation
remains open. Phase 5 must either reject this configuration or separately
approve a predefined next candidate without weakening the safety rule. Real
personnel files and production remain prohibited.

### Wave G Phase 5 — same-condition Luna/Terra comparison

Product separately authorized one complete `gpt-5.6-terra` run against the
unchanged versioned corpus. The runner used the same prompt, strict schema,
direct-PDF request shape, low reasoning effort, `store: false`, no tools, no
background mode, and no automatic retry. All 60 fixtures ran once in sequence.

The comparison baseline is:

| Configuration   | Digital | Clear scan | Degraded scan | Adversarial | Overall | Incorrect high-confidence |
| --------------- | ------- | ---------- | ------------- | ----------- | ------- | ------------------------- |
| `gpt-5.6-luna`  | 20/20   | 14/15      | 14/15         | 10/10       | 58/60   | 1                         |
| `gpt-5.6-terra` | 20/20   | 13/15      | 15/15         | 10/10       | 58/60   | 2                         |

Terra produced 60/60 schema-valid responses, no provider failure, timeout,
arbitrary-key leak, or abstention violation, and a maximum recorded latency
below five seconds. It returned the expected `no_result` status for
`wg2-scan-degraded-07`, where Luna had a safe status-only mismatch. However,
`wg2-scan-clear-03` and `wg2-scan-clear-05` each contained a false, missing,
incorrect high-confidence suggestion. Rendered visual review confirmed that
both fictional PDFs and manifest answers are legible and correct. No post-hoc
retry or corpus correction was made.

Both configurations fail the unchanged WG0-09 safety gate. Terra is not a
safer selection and, at the [official model prices checked on
2026-08-19](https://developers.openai.com/api/docs/models/compare), costs ten
times Luna per input and output token. The delayed Usage dashboard later showed only
a partial 98/120 requests, 328,421 tokens, and USD 0.40; final billed-cost
reconciliation remains pending. Freeze both baselines. The next product
decision is either to reject the current OpenAI configurations or to approve a
predefined new prompt/model configuration before a fresh full-corpus run. Do
not weaken WG0-09, retry failed fixtures selectively, send a real personnel
file, or enable production.

### Wave G Phase 5 — approved prompt v2 definition

Status: `APPROVED 2026-08-19 — NO EXTERNAL RUN GATE`.

The smallest measured-failure correction is implemented as the separate `v2`
prompt version. Prompt v1 remains the adapter default and every completed
Luna/Terra baseline remains attributed to v1. No existing benchmark gate
selects v2. The approved prompt fingerprint is
`74a7caee7db5266f546474f82973f40ad09f56b750b1ffd2b2519d7c6906f67f`.

Prompt v2 changes only instructions and local validation:

1. copy `position` exactly as visible, including accents, apostrophes,
   punctuation, capitalization, spacing, and word order;
2. omit uncertain values instead of correcting or normalizing French;
3. define `complete` as three unique suggestions, `partial` as one or two,
   and `no_result`/`unsupported` as zero;
4. accept weekly minutes only from an explicit weekly duration, calculate
   `(hours * 60) + minutes`, and verify the arithmetic;
5. require a clear one-based evidence page and reserve high confidence for a
   complete value plus clear page;
6. perform one final uniqueness, status/count, verbatim-position, arithmetic,
   and untrusted-instruction check.

The strict structured-output schema remains the syntax boundary. Additional
v2 local validation rejects duplicate fields and status/count inconsistency.
The offline scorer keeps exact acceptance but now reports only field names and
mismatch categories: missing expected suggestion, unexpected suggestion,
candidate value, source page, duplicate field, and orthographic variation. It
does not persist candidate values, excerpts, prompts, or provider payloads.

Fake-response tests cover the exact `wg2-scan-clear-03` answer, the approved
prompt fingerprint, a simulated `Hôte d’accueil` rewrite, a wrong source page,
zero suggestions labeled `partial`, and a duplicate position. The product owner
approved the exact prompt text on 2026-08-19. A clean 60-document run still
requires separate approval and a dedicated external gate.

### Wave G Phase 5 — Luna/prompt-v2 full-corpus result

Status: `COMPLETE — REJECTED BY WG0-09`.

Product separately authorized one clean 60-document run using
`gpt-5.6-luna`, prompt v2 fingerprint
`74a7caee7db5266f546474f82973f40ad09f56b750b1ffd2b2519d7c6906f67f`,
the unchanged corpus/schema/scorer, low reasoning effort, `store: false`, no
tools, no background mode, and no retry. All fixtures ran once in sequence.

| Configuration              | Digital | Clear scan | Degraded scan | Adversarial | Overall | Incorrect high-confidence |
| -------------------------- | ------- | ---------- | ------------- | ----------- | ------- | ------------------------- |
| Luna / prompt v1 baseline  | 20/20   | 14/15      | 14/15         | 10/10       | 58/60   | 1                         |
| Terra / prompt v1 baseline | 20/20   | 13/15      | 15/15         | 10/10       | 58/60   | 2                         |
| Luna / prompt v2 candidate | 14/20   | 9/15       | 15/15         | 8/10        | 46/60   | 11                        |

Of the 14 failures, eleven were incorrect high-confidence orthographic
rewrites of `position`, one provider result was rejected by v2 local
status/count or uniqueness validation, and two adversarial results safely
omitted one expected weekly duration. The other 59 result envelopes passed the
strict local schema and had no abstention violation. V2 is rejected without a
selective retry. The temporary v2 run gate was removed after use. Exact billed
cost remains pending because the test output did not retain a complete
successful-request aggregate; do not invent it from partial observations.

### Wave G Phase 5 — approved prompt v3 and candidate corpus v2

Status: `COMPLETE — REJECTED BY WG0-09`.

Prompt v3 is represented as `v3`; v1 remains the adapter default and no
external gate selects v3. Its approved fingerprint is
`1a162a4c941a604495ae9b313af4d5bb1027aedadd689379dcd5ba2733f11017`.
Compared with v2, it makes one targeted prompt change: three held-out examples
show that missing accents and typography must not be repaired. None of those
example titles occurs in the frozen evaluation corpus, preventing answer
leakage. V3 retains v2's strict unique-field and status/count validation.

Offline failure review also separates prompt defects from corpus defects.
`wg2-adversarial-05` and `wg2-adversarial-09` visibly say only a non-conflicting
duration in hours; they do not label it weekly. Their v1 expected answers still
require `contractWeeklyMinutes`. V3 correctly instructs the model to omit such
a value. Do not weaken that rule to improve the score. Keep corpus v1 frozen
and create a separately reviewed corpus v2 that adds explicit weekly wording
and new hashes.

Candidate corpus v2 now exists beside immutable corpus v1. It changes only the
visible page-two wording in `wg2-adversarial-05` and
`wg2-adversarial-09` from a bare duration to an explicitly weekly duration.
All expected answers remain unchanged. The generator verifies and copies the
frozen v1 bytes for the other 58 fixtures, so their hashes remain identical.
The two changed hashes are:

- `wg2-adversarial-05`:
  `0eea5ec94bdaa835c1818180c85409c927bbd89c3aea0eb84a4ea8a9ce0fb1aa`;
- `wg2-adversarial-09`:
  `6055eb15968f521981c7b531a55abb9b5d35ee5f8c58910ec21fd4ac709a614a`.

Both complete two-page PDFs were rendered and visually checked for readable,
unclipped text, stable header/footer, conflicting positions, and the corrected
weekly-duration line. Corpus-v2 tests verify count/distribution, expected-answer
identity, exactly two changed hashes, PDF signatures, hashes, and page counts.

Fake-response tests pin v3, verify its request/schema selection,
accept exact `Maitre d hotel`, reject normalized `Maître d’hôtel`, preserve safe
omission for a bare duration, and retain strict local validation. Product
approved the exact prompt and corpus v2, then separately authorized one clean
60-document Luna/v3 run on 2026-08-19. All fixtures ran once in sequence with
no retry.

| Configuration                 | Digital | Clear scan | Degraded scan | Adversarial | Overall | Incorrect high-confidence | Invalid result |
| ----------------------------- | ------- | ---------- | ------------- | ----------- | ------- | ------------------------- | -------------- |
| Luna / prompt v1 / corpus v1  | 20/20   | 14/15      | 14/15         | 10/10       | 58/60   | 1                         | 0              |
| Terra / prompt v1 / corpus v1 | 20/20   | 13/15      | 15/15         | 10/10       | 58/60   | 2                         | 0              |
| Luna / prompt v2 / corpus v1  | 14/20   | 9/15       | 15/15         | 8/10        | 46/60   | 11                        | 1              |
| Luna / prompt v3 / corpus v2  | 20/20   | 13/15      | 15/15         | 10/10       | 58/60   | 1                         | 1              |

`wg2-scan-clear-07` produced the single incorrect high-confidence
orthographic rewrite. `wg2-scan-clear-09` completed at the provider, but the
returned result failed local schema/consistency validation. There were no
provider failures or abstention violations. Maximum observed request latency
was 9,965 ms. The 59 responses with adapter usage observations consumed
227,463 input and 9,586 output tokens, with an estimated cost of USD 0.0569958
at the checked Luna prices. The rejected response has no usage observation, so
this estimate is not final billed evidence.

V3 does not improve the v1 safety result and still violates WG0-09. It is not
selected, the adapter continues to default to v1, and the single-use v3 gate
was removed after the authorized run. No retry, further provider call,
real-file processing, or production use is authorized.

### Wave G Phase 5 — approved prompt v4

Status: `COMPLETE — SYNTHETIC WINNER SELECTED; PRODUCTION BLOCKED`.

Product requested v4 preparation after the v3 run. OpenAI's current model
guidance recommends changing one measured prompt area at a time and evaluating
on representative cases. V4 therefore keeps Luna, low reasoning effort,
corpus v2, the response schema, local validation, scorer, and WG0-09 unchanged.
It makes only two prompt changes:

1. define `position` as the value after its label and separator but before
   punctuation that only terminates the sentence; internal punctuation remains
   literal;
2. construct the final suggestion array once in field order, with zero or one
   item per field, then derive status mechanically from the final count.

The first change targets the sanitized `orthographic_variation` diagnostic from
`wg2-scan-clear-07`. Because YUTA intentionally retained no raw provider value,
a trailing period is a plausible boundary failure, not a confirmed
reconstruction. The second targets `wg2-scan-clear-09`, but the retained error
code cannot distinguish duplicate fields from status/count inconsistency.

V4 is addressable as `v4`, while v1 remains the adapter default. The exact
draft is pinned by SHA-256 fingerprint
`24e76f787c56a5e8c3e350d4be9623cbb6149cf6eef5f45a028b7566807d6ed4`.
Offline fake-response tests verify the request/schema name, exact
`Responsable de bar` acceptance, rejection of a sentence-ending period inside
`candidateValue`, and strict rejection of duplicate/status-inconsistent
output. Product approved the exact prompt text on 2026-08-19. No external gate
selected v4 at that point.

Product then separately authorized one full Luna/v4 run over corpus v2. All 60
fictional PDFs ran once in sequence with no retry.

| Configuration                 | Digital | Clear scan | Degraded scan | Adversarial | Overall | Incorrect high-confidence | Invalid result |
| ----------------------------- | ------- | ---------- | ------------- | ----------- | ------- | ------------------------- | -------------- |
| Luna / prompt v1 / corpus v1  | 20/20   | 14/15      | 14/15         | 10/10       | 58/60   | 1                         | 0              |
| Terra / prompt v1 / corpus v1 | 20/20   | 13/15      | 15/15         | 10/10       | 58/60   | 2                         | 0              |
| Luna / prompt v2 / corpus v1  | 14/20   | 9/15       | 15/15         | 8/10        | 46/60   | 11                        | 1              |
| Luna / prompt v3 / corpus v2  | 20/20   | 13/15      | 15/15         | 10/10       | 58/60   | 1                         | 1              |
| Luna / prompt v4 / corpus v2  | 20/20   | 14/15      | 15/15         | 10/10       | 59/60   | 0                         | 1              |

`wg2-scan-clear-15` completed at the provider but its result failed local
schema/consistency validation, so it could not enter review. The other 59
results were schema-valid. There were zero incorrect high-confidence
suggestions, zero abstention violations, and zero provider failures. Maximum
observed latency was 7,498 ms, therefore every request remained below the
45-second foreground boundary. Usage observations for 59 results totaled
232,065 input and 9,184 output tokens, estimated at USD 0.0574338 at the
checked Luna prices. Usage for the locally rejected result is unavailable, so
the estimate is not final billed evidence.

V4 meets WG0-08 and WG0-09, exceeds the 95% digital and 90% clear-scan exact
accuracy thresholds, and remains inside the latency boundary. Product selected
Luna/v4/corpus-v2 as the winner of the synthetic evaluation on 2026-08-19. The
synthetic comparison is now closed. The single-use v4 gate remains removed and
prompt v1 remains the generic adapter default to prevent an implicit runtime
promotion. No rerun, real-file processing, employee update, or production use
is authorized by this selection.

### Wave G Phase 6 — Luna/v4 development integration

Status: `IMPLEMENTED — FICTIONAL PDF ONLY; PRODUCTION FAIL-CLOSED`.

The smallest integration reuses the Wave F action, authorization, version
checks, rate limit, transient result, review, audit, and apply boundaries. A
server-only runtime factory selects:

- `deterministic-synthetic` by default for offline development;
- `openai-synthetic` only in development with a non-empty evaluation key,
  explicitly pinning `gpt-5.6-luna` and prompt `v4`.

The service continues to generate the PDF in memory and does not read the
signed personnel document. Unknown modes, missing keys, and all non-development
runtimes throw before provider access. The existing page and action gates also
remain development-only. Tests cover offline default, production/test/missing
environment rejection, invalid configuration, explicit Luna/v4 selection, and
an end-to-end generated-PDF flow with a fake provider response and no network.
The `complete` scenario is the only provider-backed generated PDF; partial,
no-result, unsupported, failure, and timeout remain deterministic local state
tests and never spend API credit.
No schema, migration, SDK, new route, new UI, real-file path, automatic update,
or production enablement is added.

Signed-in Phase 6 QA completed on 2026-08-20. The new differing fictional PDF
was analyzed twice through the complete scenario during review/rerun. OWNER
selected and applied `position` plus `contractWeeklyMinutes`; the persisted
fictional dossier shows `Responsable de salle` and 39 weekly hours, while its
CDD type remains unchanged. The history view records analysis requested,
analysis completed, suggestions applied, and the two-field employment update.
Apply made no provider request. A fresh production build was served on an
isolated port with the authenticated session: Salariés rendered normally with
no analysis control, synthetic label, warning, or error. Development was then
restored on port 3001.

### Wave G Phase 7 — explicit fictional PDF upload

Status: `IMPLEMENTED — DEVELOPMENT ONLY; PRODUCTION FAIL-CLOSED`.

The review now starts idle instead of automatically invoking the configured
adapter. OWNER may explicitly analyze the generated fixture or choose a local
PDF, attest that it contains only fictional data, and click analysis. The
uploaded path is restricted to the provider-backed complete scenario and
validates `.pdf` filename, `application/pdf` media type, 750 KiB maximum, PDF
signature, and the existing 1–40 page limit. It is never persisted and does not
use personnel-document storage. The service loads its transient bytes only
inside the existing authorized, version-bound extraction flow.

The source tag distinguishes `synthetic_fixture` from `synthetic_upload`, while
both use the same provider adapter, output contract, validation, rate limit,
review, explicit apply, and audit boundaries. Partial, no-result, unsupported,
failure, and timeout remain deterministic local scenarios. Production still
rejects the page and action before provider access. No schema, migration, SDK,
route, production configuration, automatic update, or real-file capability is
added.

Signed-in QA confirmed the idle no-request state, file-selection disclosure,
disabled analysis before attestation, and locked complete scenario. The first
apply exposed an obsolete deterministic-fixture reconstruction in the apply
action. It is replaced by a bounded server-owned review store keyed by trusted
organization, establishment, and request ID. The store retains only the strict
validated result, never PDF bytes, and expires after the result's 15-minute TTL.
Apply rechecks current versions and the persisted audit grant, matches selected
allowlisted values against the stored review, makes no provider call, and
deletes the review on success or invalidation.

Final QA with `wg2-digital-cdd-35h.pdf` persisted only `Chef de rang` and 35
weekly hours; CDD remained unchanged and history records the two-field apply.
Four Phase 7 provider requests occurred across initial QA, two UI retries, and
final verification. Usage currently reports 306 requests, 1,142,658 tokens, and
USD 0.88, including three of those four; final-request ingestion remains pending.
A fresh production build rendered the authenticated Documents view without the
analysis action, upload field, or synthetic review. Development was restored on
port 3001.

### Wave G Phase 8 — stored fictional contract offline integration

Status: `IMPLEMENTED — ONE PROVIDER QA COMPLETE; STOP BEFORE ANY FURTHER CALL`.

Goal: remove the artificial second upload from the next development test by
reading the current local Documents object, while making it impossible for an
arbitrary or real stored personnel file to enter the extraction path.

Implemented slice:

1. reuse the SHA-256 already persisted on every personnel-document version;
2. allowlist only `wg2-digital-cdd-35h` and its corpus-v2 SHA-256;
3. bind eligibility to trusted organization, establishment, employee,
   document, current version, storage key, media type, byte size, and checksum;
4. add a server-only repository resolver for the exact current extraction
   source; do not reuse the view/download grant or its audit meaning;
5. reject unknown/stale eligibility before opening storage, then open the
   available object and recheck size, signature, pages, and SHA-256;
6. extend the application-local prepared source vocabulary with
   `stored_synthetic_document` and pass the verified bytes through the existing
   preparer and a fixture-specific deterministic adapter;
7. reuse the current rate limit, strict response validation, tenant-scoped
   review store, OWNER decisions, version/audit grant, apply action, and audit;
8. expose the stored source only in development and only while eligible; retain
   generated and upload sources for controlled testing;
9. fail closed in production, test, missing environment, replacement, object
   failure, mismatch, timeout, and provider failure;
10. cover the stored source offline before any real provider request.

Expected implementation impact:

```text
Files modified: Backoffice extraction action/service/UI/tests,
  personnel document repository/tests, current page-pack docs
Files created: one stored-synthetic source/adapter module and one test file
Packages affected: apps/backoffice, @yuta/db-cloud
Cross-application impact: none
Database/schema/migration: NO
API route: NO
Shared application/transport contract: NO
Application-local source discriminant: YES — stored_synthetic_document
Permission/auth: NO — reuse existing OWNER-only permissions
Runtime/device: YES — development local document runtime read only
Provider/SDK/model: NO — stored source is deterministic and cannot call OpenAI
External request during implementation: NO
Production: NOT AUTHORIZED
```

Required offline tests before browser/provider QA:

- OWNER success with exact trusted scope, current version, eligible fixture,
  matching storage key, and matching hash;
- MANAGER, STAFF, public/service actor, missing establishment, and cross-tenant
  denial before storage access;
- unknown checksum, replacement/version mismatch, storage-key mismatch, missing
  object, wrong media/signature, oversize, over-page, and hash mismatch all fail
  before extraction-adapter invocation;
- the browser cannot forge eligibility, fixture ID, hash, tenant, version,
  storage key, provider, model, or prompt;
- provider failure/timeout preserves Documents access and makes no employee
  change;
- apply still requires the exact transient review and makes no second provider
  call;
- production/test/missing environment expose no stored-analysis control and do
  not open personnel storage even when secrets are configured.

Product approved the Phase 8 scope and offline implementation on 2026-08-20.
The implemented unit/service tests prove exact-fixture success, non-development
and unknown-hash denial before storage access, changed-byte rejection, and a
complete deterministic stored-PDF flow with no network. The Backoffice suite
passes 154 tests; database integration assertions are present for current-
version success plus stale/cross-establishment denial and run only when the
repository integration-test gate is enabled.

Signed-in OWNER browser QA selected the eligible current version-2 stored
fixture. The action completed through the deterministic adapter in about 0.6
seconds and displayed CDD, `Chef de rang`, and 35 weekly hours. No choice was
selected or applied. Browser logs contained no warning/error, and both the page
and drawer remained free of horizontal overflow at 390 px.

Product separately authorized exactly one provider-backed QA call with the exact
stored fixture on 2026-08-20. The implementation added a development-only,
process-only `approved-once` gate and provider wrapper. The wrapper repeats the
exact hash, page-count, and scenario checks, consumes the gate before sending,
then delegates to the pinned Luna/v4 adapter. The UI disclosed the transfer
before the click. The single request completed in 4,486 ms with 1,107 input,
152 output, and 1,259 total tokens and returned the expected three suggestions.
No suggestion was selected or applied. The privileged process was stopped and
development restarted without the flag, restoring the offline stored adapter.

Stop here. Any additional provider call requires another explicit approval.
Real personnel files, schema/migration, production storage/scanning, retention,
backup/restore, and production enablement remain outside Phase 8.
