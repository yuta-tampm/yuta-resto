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
