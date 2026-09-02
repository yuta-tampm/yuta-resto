# Tasks / Implementation Plan

Change: `restaurant-knowledge-team-culture`

```text
UI_AFFECTING: YES
BROWSER_QA_REQUIRED: YES
SENSITIVE_CHANGE: YES
APPLY_AUTHORIZATION: GRANTED
```

Phases selected because each is required by the approved Design:

1. Foundation / Data;
2. Service / Domain;
3. UI / Components;
4. Interaction / States;
5. Integration / Regression.

Lifecycle remains unchanged throughout planning and implementation:
Product Decision `APPROVED`, Implementation `PARTIAL`, Environment
`NOT_ENABLED`, Production Readiness `NOT_ASSESSED`, External Dependency
`NOT_ASSESSED`.

No task may introduce Personnel/Salariés, Planning, Pointage, Today, Tâches du
jour, Formalités, onboarding/training workflow, employee-specific state, POS,
Site Agent, Display, Marketing/social, external provider, AI/inference or a
shared API/contract. If any becomes technically required, stop with
`CROSS_MODULE` / `NEEDS REVIEW`.

## 1. Foundation / Data

### TECHNICAL IMPLEMENTATION CONTRACT — Foundation / Data

**Purpose:** establish exact pre-Apply attribution, then add the smallest
Restaurant Knowledge persistence representation and additive migration without
touching another canonical owner.

**Boundary and canonical owner:** cloud persistence under `@yuta/db-cloud`;
Restaurant Knowledge owns the slice; semantic scope is establishment;
Organization is tenancy/access envelope.

**Authorities:** root `AGENTS.md`, `packages/db-cloud/AGENTS.md`,
`docs/architecture/DATABASE_BOUNDARIES.md`, `docs/architecture/TENANCY.md`,
approved Spec/Design, current Drizzle journal and current schema conventions.

**Intended shared existing files:**

- `packages/db-cloud/src/schema/restaurant-knowledge.ts`;
- `packages/db-cloud/drizzle/meta/_journal.json`;
- `packages/db-cloud/test/schema.test.ts`;
- `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`;
- any current shared migration configuration read by the repository tooling,
  only if generation requires it and the pre-Apply allowlist records it first.

**Intended new files:**

- `packages/db-cloud/drizzle/0014_restaurant_knowledge_team_culture.sql`, only
  if the captured journal still ends at `0013`;
- `packages/db-cloud/drizzle/meta/0014_snapshot.json`, generated with the same
  baseline;
- `docs/reviews/restaurant-knowledge-team-culture/03-pre-apply-manifest.md`;
- exact-byte baseline copies under
  `docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/`.

**Allowed dependencies:** current Drizzle/PostgreSQL tooling,
`packages/db-cloud` schema primitives, `establishments` composite scope and
guarded disposable PostgreSQL test infrastructure.

**Prohibited dependencies:** every global prohibited dependency above; Profile
or Personnel tables as Team Culture storage; generic key/value/JSON/taxonomy
stores; cross-runtime database access; new API/shared contract.

**Data and tenant invariants:** exactly five columns
`organization_id`, `establishment_id`, `values_and_mindset`,
`working_together`, `transmission_and_integration`; three business columns are
nullable text; composite PK on organization + establishment; composite FK to
`establishments(organization_id, id)` with `ON DELETE RESTRICT`; no backfill;
missing row and all-null row are observable all-empty equivalents; no resource
ID, employee field, timestamp/history or destructive rollback.

**Required checks:** deterministic pre-Apply manifest verification; generated
SQL/journal/snapshot review; schema exactness test; full migration chain on
guarded disposable PostgreSQL; architecture check for database ownership.

**Stop conditions:** Apply authorization absent; intended shared file missing
from baseline; unexpected path/status/hash drift; journal no longer ends at
expected `0013`; generated migration alters/backfills existing data; extra
column/constraint; another module/runtime owner becomes necessary.

**Completion evidence:** reproducible manifest with HEAD, sorted status,
allowlist, exact bytes/hashes and `MISSING` new-file records; reviewed additive
migration; passing schema/migration evidence; unrelated dirty files proven
byte-identical before phase 2.

- [x] 1.1 Before any implementation edit, capture current HEAD and sorted `git status --short`, establish the final shared-file allowlist, save exact bytes plus lowercase SHA-256 for every shared file Apply may modify, record intended new files as `MISSING`, and verify the manifest can reproduce baseline-to-post diffs without using HEAD alone.
- [x] 1.2 Verify the captured Drizzle journal still ends at `0013_restaurant_knowledge_customer_experience`; stop on drift, otherwise add `restaurant_knowledge_team_culture` with exactly the approved five-column shape, composite PK/FK and `ON DELETE RESTRICT`, then verify focused schema tests inspect the exact definition.
- [x] 1.3 Generate only the additive next Drizzle migration and snapshot from the captured baseline, then verify SQL contains create-table/composite-FK operations only, with no backfill, existing-table alteration or destructive down path.
- [x] 1.4 Run the full migration chain on guarded disposable PostgreSQL and verify the Team Culture table/constraints exist while all earlier migrations and Restaurant Knowledge tables remain intact.
- [x] 1.5 Recompute unrelated dirty-file hashes after Foundation/Data edits and stop unless every out-of-allowlist file remains byte-identical; attach exact schema/migration commands and results as phase completion evidence.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT — Service / Domain

**Purpose:** expose one trusted, establishment-scoped read projection and one
whole-slice save, with READ/MANAGE enforced before database access and no
browser-derived authority.

**Boundary and canonical owner:** `@yuta/db-cloud` owns persistence operations;
the Backoffice route owns server composition/actions; current auth/tenant
infrastructure remains authoritative.

**Authorities:** root `AGENTS.md`, `packages/db-cloud/AGENTS.md`,
`apps/backoffice/AGENTS.md`, `docs/architecture/TENANCY.md`,
`docs/architecture/AUTHENTICATION.md`,
`docs/architecture/IDENTITY_AND_MEMBERSHIP.md`, Restaurant Knowledge
authorization spec and approved Team Culture Design.

**Intended shared existing files:**

- `packages/db-cloud/src/restaurant-knowledge-repository.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`;
- `apps/backoffice/test/restaurant-knowledge-loader.test.ts`;
- `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`.

**Intended new files:**

- `apps/backoffice/test/team-culture-action.test.ts`.

**Allowed dependencies:** trusted `TenantContext`, `requireEstablishment`,
current Restaurant Knowledge permission helpers, page-local server action,
Zod already used at the route boundary, `@yuta/db-cloud` and Next route
revalidation conventions.

**Prohibited dependencies:** browser organization/establishment/role/permission
authority; Profile or Personnel repository/permission reuse; resource-ID-only
lookup; per-field mutation; generic FormData parser/whitelist; raw-extra-key
Product requirement; global prohibited modules/runtimes/providers/contracts.

**Authorization and tenant invariants:** READ before repository read; no READ
means no repository call; MANAGE derived separately; authenticated tenant is
re-derived server-side; active establishment and MANAGE are required before
parsing/persistence; OWNER/MANAGER succeed, STAFF default deny; Profile
permissions never substitute; every repository predicate uses organization +
establishment.

**Data/input invariants:** internal projection contains exactly
`valuesAndMindset`, `workingTogether`, `transmissionAndIntegration` as
`string | null`; missing row returns three nulls; save is one-statement
whole-slice upsert; action reads exactly those three FormData entries, constructs
and strict-parses that object, normalizes only `''` to null, ignores unrelated
raw fields as authority and does not forward them.

**Required checks:** guarded repository integration tests for state and tenant
isolation; loader tests proving READ-before-repository; action tests proving
separate OWNER and MANAGER success, STAFF denial before persistence, Profile
permission non-substitution, independent server-side MANAGE enforcement, zero
persistence on every denied path, exact three-value forwarding and unrelated
raw-field non-forwarding. A READ-without-MANAGE authorization-path case is
conditional on the existing authorization test infrastructure being able to
model that logical state without changing the accepted grant matrix, adding a
permission, role or principal, or changing production authorization behavior.

**Stop conditions:** need for new permission/role/principal; browser scope enters
repository input; organization or establishment predicate omitted; per-field
save; Profile/Personnel repository reuse; shared API/contract or prohibited
dependency becomes required; Product validation beyond empty-to-null appears.

**Completion evidence:** source-to-Spec mapping for read/save paths, passing
focused tests with mock-call ordering/non-calls for OWNER, MANAGER, STAFF,
Profile permission non-substitution and independent MANAGE enforcement,
disposable-DB isolation results, unchanged current permission definitions, and
no test-created production grant, permission, role or principal.

- [x] 2.1 Add the internal Team Culture three-value input/projection plus scoped get operation in `@yuta/db-cloud`, then verify `requireEstablishment`, both tenant predicates and missing-row-to-three-null behavior through focused integration tests.
- [x] 2.2 Add one-statement composite-key whole-slice upsert with all three values and no per-field mutation, then verify all-empty, each single-value state, full round-trip, overwrite and atomic returned projection on disposable PostgreSQL.
- [x] 2.3 Add wrong-organization, wrong-establishment and mismatched organization/establishment integration cases, then verify no read leak or accepted cross-tenant write.
- [x] 2.4 Add the page-local Team Culture loader that checks Restaurant Knowledge READ before repository access and derives MANAGE independently, then verify OWNER/MANAGER behavior, STAFF denial and zero repository calls without READ.
- [x] 2.5 Add the page-local save action that re-derives tenant context, requires active establishment and MANAGE before parsing/persistence, reads exactly the three approved FormData entries, strict-parses the constructed object and normalizes only empty string to null, then verify one repository save and route revalidation only after success.
- [x] 2.6 Add action tests proving separate OWNER and MANAGER success, STAFF denial before persistence, Profile-permission non-substitution, independent MANAGE enforcement at the server authorization boundary, zero persistence on every denied path, browser authority/unrelated raw fields are not forwarded, no generic raw-key rejection requirement exists, and safe error results contain no descriptive content. Include a READ-without-MANAGE authorization-path case only if the existing test infrastructure can model that logical state without changing the accepted grant matrix, adding a permission, role or principal, or changing production authorization behavior; otherwise do not invent authorization solely for testing.

## 3. UI / Components

### TECHNICAL IMPLEMENTATION CONTRACT — UI / Components

**Purpose:** add one independent Team Culture section to the existing real-data
page with exactly three French-labelled inputs and authorization-derived
visibility/editability.

**Boundary and canonical owner:** route-local Backoffice presentation only;
business data remains Restaurant Knowledge-owned; shared `@yuta/ui` supplies
domain-neutral primitives.

**Authorities:** root and `apps/backoffice/AGENTS.md`,
`docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/BACKOFFICE_FRONTEND_RULES.md`,
`docs/ui/PAGE_PACK_PROTOCOL.md`, current
`docs/ui/pages/establishment-general-information/` page pack, approved Spec and
Design.

**Intended shared existing files:**

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`;
- current page/loader/action files only through their approved Team Culture
  additions;
- existing page-level tests if a focused composition assertion belongs there.

**Intended new files:**

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/team-culture-model.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-fields.tsx`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx`;
- `apps/backoffice/test/team-culture-fields.test.tsx`;
- `apps/backoffice/test/team-culture-form.test.tsx`.

**Allowed dependencies:** React/Next patterns already used by the route,
`@yuta/ui` primitives, `lucide-react`, page-local model/action and server-provided
projection/`canManage`.

**Prohibited dependencies:** fixtures replacing real data; new UI framework;
business logic promoted to `@yuta/ui`; client authorization as enforcement;
employee/training/HR/operational controls; all global prohibited dependencies.

**Authorization and presentation invariants:** no READ means loader returns null
and section is not rendered; READ with no MANAGE gives visible read-only/disabled
presentation and no save control; MANAGE gives editable inputs; exactly three
labels; section follows Expérience client; Profile and three existing knowledge
sections keep their own data/actions/auth.

**Required checks:** component tests for exact labels/field names, read-only and
editable states, accessible names and single submit; page composition/regression
tests; Backoffice typecheck and focused render tests. A component test with
`canManage = false` is presentation-state evidence only and is not evidence that
a real READ-without-MANAGE production principal exists.

**Stop conditions:** section requires Profile permission/data; another form is
merged/replaced; extra field/control appears; fixture data replaces loader;
client props become authorization proof; new shared UI/domain abstraction or
prohibited dependency is required.

**Completion evidence:** rendered component tests, page composition evidence,
accessible labels, unchanged existing form boundaries and clean scoped source
review.

- [x] 3.1 Create the page-local Team Culture model shape and verify it exposes only the three approved `string | null` values without employee, workflow, score, taxonomy or validation fields.
- [x] 3.2 Create `TeamCultureFields` with exactly the French labels `Valeurs & état d’esprit`, `Façon de travailler ensemble` and `Transmission & intégration`, then verify field names, optional presentation, accessible label associations and disabled read-only behavior.
- [x] 3.3 Create the independent `TeamCultureForm` using existing card/alert/button patterns, then verify `canManage = false` presentation has no save control and MANAGE presentation has exactly one Team Culture submit; treat the false presentation case only as component-state evidence, not as evidence of a real READ-without-MANAGE production principal.
- [x] 3.4 Compose the READ-gated section after Expérience client in the existing page using real loader data, then verify Profile, Concept/Histoire, Cuisine/savoir-faire and Expérience client remain rendered through their existing independent props/actions.
- [x] 3.5 Run focused fields/form/page tests and Backoffice typecheck, then attach evidence that no fixture replacement, client authorization enforcement, extra control or cross-section mutation was introduced.

## 4. Interaction / States

### TECHNICAL IMPLEMENTATION CONTRACT — Interaction / States

**Purpose:** implement canonical-equivalent dirty semantics, local draft and one
explicit whole-slice submission with complete recoverable states and no
autosave.

**Boundary and canonical owner:** interaction state is browser-local until the
MANAGE-gated server action succeeds; canonical persistence remains server-side
Restaurant Knowledge.

**Authorities:** approved revised Design Decisions 5, 6 and 9; Backoffice
frontend rules; current page pack interaction/accessibility requirements; Team
Culture delta Spec.

**Intended shared existing files:**

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`, only for stable server-state composition;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`, only for the approved action state;
- no existing Restaurant Knowledge model/form may be rewritten for this phase.

**Intended new files:**

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/team-culture-model.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx`;
- `apps/backoffice/test/team-culture-model.test.ts`;
- `apps/backoffice/test/team-culture-form.test.tsx`.

**Allowed dependencies:** pure page-local normalization/comparison functions,
React local state, `useActionState`, `useFormStatus`, current route action and
shared presentation primitives.

**Prohibited dependencies:** trimming, length/format/content validation,
autosave, on-change/on-blur mutation, effect/timer/background persistence,
optimistic canonical write, multiple/per-field submits, reliance solely on
React key remount, and every global prohibited dependency.

**State invariants:** comparison normalization maps only `''` to `null` and
leaves every non-empty string including whitespace unchanged; both draft and
server values are canonicalized for equality; stable key is refresh-only;
pristine/canonical-equivalent state disables submit; dirty state enables one
submit; pending uses the same control; success revalidates canonical state;
error retains draft and supports retry.

**Required checks:** pure model cases for null/empty/non-empty/whitespace;
focused form tests for exact four canonical dirty scenarios, one invocation,
pristine/pending/success/error/retry, and absence of persistence on change,
blur, effect, timer or background activity; basic keyboard/focus assertions.

**Stop conditions:** canonical comparison trims/transforms non-empty content;
successful canonical-equivalent save stays dirty; correctness depends only on
key change; any autosave path; multiple save controls; Product validation or
prohibited workflow/control appears.

**Completion evidence:** passing model/form tests including the four named
canonical cases, source scan proving no autosave mechanism, and component
evidence for pending/success/error/recovery.

- [x] 4.1 Implement `canonicalTeamCultureValue` so only `''` compares as `null` and every non-empty string remains unchanged, then verify unit tests cover null, empty, text and whitespace without trimming.
- [x] 4.2 Implement dirty comparison by canonicalizing both server and draft values, then verify initial null + draft `''` is not dirty, initial `'abc'` + draft `''` is dirty, and initial null + draft `'abc'` is dirty.
- [x] 4.3 Verify a successful save that canonicalizes `''` to null results in not-dirty state even when the React key does not change; prove the form test does not rely solely on remount.
- [x] 4.4 Implement one explicit whole-slice submit with pristine disabled and pending/loading on the same button, then verify exactly one action invocation carries all three current draft values.
- [x] 4.5 Implement visible success, error and retry behavior while retaining failed draft state, then verify source/tests observe no persistence on change, blur, effect, timer or background activity and no autosave mechanism exists.

## 5. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT — Integration / Regression

**Purpose:** keep implementation-facing page documentation accurate, run bounded
regression/verification, produce the Technical Compliance Matrix, execute
separate real Browser QA and prepare Gate 3 only when every required dimension
passes.

**Boundary and canonical owner:** cross-cutting evidence only; no new runtime,
data owner, permission or consumer relationship. VERIFY and QA remain distinct.

**Authorities:** root instructions, `docs/AUTHORITY_MODEL.md`, current Product
Knowledge/Module Registry, `docs/YUTA_QA_PROTOCOL.md`, OpenSpec verify workflow,
page pack, approved Design and every earlier review packet.

**Read-only authority/current-state documentation inputs:**

- `docs/MODULE_REGISTRY.md`;
- `docs/features/establishment/README.md`;
- `docs/features/establishment/general-information/README.md`;

These inputs may be read during Apply/VERIFY but MUST NOT be modified by this
implementation phase. The already-known broad Product Knowledge documentation
drift remains an input to the post-archive Knowledge Consolidation scan.

**Intended existing implementation-documentation write targets:**

- `docs/ui/pages/establishment-general-information/README.md`;
- `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`;
- `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`;
- `docs/ui/pages/establishment-general-information/UI_SPEC.md`;
- `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`;
- `docs/reviews/README.md` only if the current review index convention requires
  the new active packet entry.

**Intended new evidence files:**

- `docs/reviews/restaurant-knowledge-team-culture/03-verify-evidence.md`;
- `docs/reviews/restaurant-knowledge-team-culture/03-implementation.diff`;
- `docs/reviews/restaurant-knowledge-team-culture/03-migration.diff`;
- `docs/reviews/restaurant-knowledge-team-culture/qa/QA_REPORT.md`;
- `docs/reviews/restaurant-knowledge-team-culture/qa/screenshot-manifest.md`;
- actual QA screenshots under the same `qa/` directory;
- `docs/reviews/restaurant-knowledge-team-culture/03-final-review.md` only after
  compliance, VERIFY and required QA all pass.

**Allowed dependencies:** repository test/build/typecheck/documentation tools,
generated OpenSpec verify workflow, guarded disposable PostgreSQL, real local
Backoffice route/environment and approved browser QA tooling.

**Prohibited dependencies:** fixtures replacing the real route/data for QA;
fabricated permission principals/screenshots/results; sync/archive; deployment
or lifecycle promotion; every global prohibited module/runtime/provider/API.

**Security/data/state invariants:** all Foundation–Interaction contracts remain
intact; page-pack/review documentation describes only actual implemented page
behavior without creating a Product Decision, changing canonical ownership,
permission or durable boundaries, promoting Environment or Production
Readiness, or rewriting normative behavior beyond the approved change. Product
Knowledge and Module Registry authority/current-state documents are not Apply
write targets. Dependency scan is zero for prohibited relationships;
implementation diff is baseline-to-post for shared dirty files and includes all
attributable new files.

**Required checks:** focused and regression tests; guarded migration tests;
strict OpenSpec validation; docs/architecture/format/typecheck/build checks;
generated verify workflow; deterministic scoped diff/hash; Technical Compliance
Matrix; and separate real Browser QA on the authenticated
`/etablissement/informations-generales` route with real persisted data.
Mandatory Browser QA covers OWNER editable state, MANAGER editable state, STAFF
or no Restaurant Knowledge access with no Team Culture section, populated and
all-empty states, a dirty draft, successful explicit save, reload and persisted
round-trip, exactly one visible Team Culture save control where MANAGE applies,
1440/1024/768/390 widths, keyboard navigation, visible focus, accessible
labels/names, alert semantics where observable, no horizontal overflow or
clipping, and regression visibility/layout of Establishment Profile,
Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture.
Actual screenshot evidence and a lowercase SHA-256 manifest are mandatory.
READ without MANAGE, persistence error/recovery and a visually capturable
pending state are conditional real-browser states: cover them only when the
current real authorization/environment can produce them safely without changing
accepted Product/auth behavior or deliberately damaging the environment. When
a conditional state is unavailable, record
`NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` and use the approved focused
automated tests as technical evidence; do not fabricate grants, principals,
screenshots or persistence failures.

**Stop conditions:** any contract row FAIL; VERIFY not PASS; migration/tenant
evidence unavailable; prohibited dependency; unrelated file drift; mandatory QA
FAIL or `BLOCKED_BY_ENVIRONMENT`; missing mandatory responsive/screenshot
evidence; lifecycle promotion; non-reproducible scoped diff.
`QA = BLOCKED_BY_ENVIRONMENT` applies only when the environment prevents a
mandatory Browser QA scenario. An unavailable conditional state alone does not
block or fail the whole QA run.

**Completion evidence:** `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`,
`VERIFY: PASS`, truthful `QA: PASS`, exact commands/results, matrix traceability,
hashed diffs/screenshots and ready Gate 3 packet with
`Sync authorization: PENDING`.

- [x] 5.1 Update only legitimate implementation-facing page-pack documentation required to keep the implemented Team Culture page behavior accurate, plus `docs/reviews/README.md` only if the current review-index convention genuinely requires it; do not update Product Knowledge or Module Registry during Apply, run `pnpm docs:check`, and record any Product Knowledge/Module Registry drift as an input for the post-archive Knowledge Consolidation scan.
- [x] 5.2 Run deterministic source/import/FK/event/contract/API scans across the attributable diff and verify zero prohibited Personnel, Planning, Pointage, Today, Tâches du jour, Formalités, onboarding/training, POS, Site Agent, Display, Marketing/social, provider, AI or shared-contract dependency.
- [x] 5.3 Run focused schema/repository/loader/action/model/fields/form tests plus regression suites for Establishment Profile, authorization, Concept/Histoire, Cuisine/savoir-faire and Expérience client; record exact commands, exits and failures fixed only within approved behavior.
- [x] 5.4 Run strict OpenSpec validation, guarded migration checks, `pnpm docs:check`, `pnpm architecture:check`, recursive typechecks, relevant Backoffice/db-cloud tests/builds and scoped formatting checks; record every result and truthful skipped limitation.
- [x] 5.5 Execute the generated OpenSpec VERIFY workflow and produce a `TECHNICAL COMPLIANCE MATRIX` mapping every selected phase’s Design rule to authoritative source, implementation, test/migration/auth/tenant/interaction/dependency/regression evidence and exact command result; require `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` and `VERIFY: PASS` before QA/Gate 3 readiness.
- [x] 5.6 Build deterministic implementation and migration diffs from saved pre-Apply bytes plus attributable new files, verify unrelated dirty files remain byte-identical, and record lowercase SHA-256 for exact diff bytes.
- [x] 5.7 After VERIFY PASS, run separate real Browser QA on the authenticated `/etablissement/informations-generales` route with real persisted data. Mandatory coverage is OWNER editable, MANAGER editable, STAFF or no Restaurant Knowledge access with no Team Culture section, populated, all-empty, dirty draft, successful explicit save, reload and persisted round-trip, exactly one visible Team Culture save control where MANAGE applies, widths 1440, 1024, 768 and 390, keyboard navigation, visible focus, accessible labels/names, alert semantics where observable, no horizontal overflow/clipping, and regression visibility/layout of Establishment Profile, Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture; save actual screenshots and a lowercase SHA-256 manifest. Cover READ without MANAGE, persistence error/recovery and a visually capturable pending state only when the current real authorization/environment can produce them safely without changing accepted Product/auth behavior or deliberately damaging the environment. For each unavailable conditional state, record `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` and cite approved focused automated tests; do not fabricate permission grants, principals, screenshots or persistence failures. Set `QA = BLOCKED_BY_ENVIRONMENT` only when the environment prevents a mandatory scenario, never solely because a conditional state is unavailable.
- [x] 5.8 Create Gate 3 evidence only if compliance and VERIFY are PASS and required QA is PASS; include exact planning/task hashes, matrix source/hash, requirement-to-code/test mapping, scoped diffs, screenshot manifest, lifecycle preservation and `Sync authorization: PENDING`, then stop before sync/archive.

### Post-archive Knowledge Consolidation reservation

This is later workflow planning, not an Apply task. Do not create
`04-knowledge-consolidation-review.md` during planning, Apply, VERIFY, QA or Gate 3. After successful Gate 3 approval, `$yuta-finish-change`, normative spec sync,
strict main-spec validation and archive, run the repository Knowledge
Consolidation scan:

- if classified `NO_UPDATE_REQUIRED`, record the bounded reason and inspected
  sources, then close the repository workflow as `DONE`;
- if classified `UPDATE_REQUIRED`, create
  `docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md`
  with the exact proposed knowledge diff and hashes, stop at human review, and
  apply only that exact diff after explicit approval;
- if consolidation would affect cross-module or durable authority, route it to
  Control Tower instead of approving or applying it within this change.
