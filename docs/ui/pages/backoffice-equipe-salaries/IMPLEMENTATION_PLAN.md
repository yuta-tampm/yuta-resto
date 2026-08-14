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

Do not combine these into Phase 1 or treat their ordering as authorization to
implement them automatically.

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
