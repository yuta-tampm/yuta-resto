# Canonical Verify Evidence — Restaurant Knowledge Customer Experience

Change: `restaurant-knowledge-customer-experience`

Schema: `yuta-spec-driven`

Assessment source: generated `openspec-verify-change` workflow, reviewed against
the exact Proposal, Analysis, delta Spec, Design, Tasks, implementation diff and
command results recorded below.

## Verification scorecard

| Dimension    | Result                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Completeness | 16/16 Tasks complete at Gate 3; 11/11 requirements mapped                                          |
| Correctness  | 26/26 scenarios covered by implementation, tests or explicit negative source/dependency evidence   |
| Coherence    | Approved Design followed; no shared contract, permission, ownership, runtime or provider deviation |

Issues:

- CRITICAL: `0`;
- WARNING: `0`;
- SUGGESTION: `0`.

Final assessment: bounded implementation matches the approved Spec and Design
and is ready for Gate 3 human review. This assessment is not normative sync,
archive, deployment, environment enablement or Production Readiness evidence.

## Exact commands and results

All commands ran from repository root unless a different working directory is
stated.

1. `pnpm --filter @yuta/db-cloud exec vitest run test/schema.test.ts` — exit
   `0`; 1 file, 10 tests passed. The exact Customer Experience column set,
   nullable descriptive columns, composite primary key, establishment foreign
   key and separation from `establishments` passed.
2. `pnpm --filter @yuta/db-cloud typecheck` — exit `0`.
3. `pnpm --filter @yuta/db-cloud db:generate --name restaurant_knowledge_customer_experience`
   — exit `0`; generated
   `0013_restaurant_knowledge_customer_experience.sql` and
   `meta/0013_snapshot.json`; journal entry `13` was added.
4. `pnpm --filter @yuta/backoffice exec vitest run test/customer-experience-action.test.ts test/customer-experience-model.test.ts test/customer-experience-fields.test.tsx test/customer-experience-form.test.tsx test/restaurant-knowledge-loader.test.ts test/concept-history-action.test.ts test/cuisine-know-how-action.test.ts`
   — exit `0`; 7 files, 36 tests passed.
5. `pnpm --filter @yuta/backoffice typecheck` — exit `0`.
6. Disposable PostgreSQL verification from `packages/db-cloud`:

   ```powershell
   $verifyDb = 'yuta_rk_customer_verify_20260901_1507'
   docker exec yuta-cloud-db-dev createdb -U yuta_cloud $verifyDb
   # CLOUD_DATABASE_URL reused local credentials while overriding only the
   # active container port 56031 and disposable database path.
   pnpm exec drizzle-kit migrate
   $env:YUTA_ALLOW_DATABASE_INTEGRATION_TESTS = 'true'
   pnpm exec vitest run test/restaurant-knowledge-repository.integration.test.ts
   docker exec yuta-cloud-db-dev dropdb -U yuta_cloud --if-exists $verifyDb
   ```

   Create, migration, integration and drop all exited `0`. Drizzle reported
   `migrations applied successfully`; repository integration reported 1 file,
   7 tests passed. PostgreSQL emitted only existing identifier-truncation
   notices from earlier migrations.

7. `pnpm exec openspec validate restaurant-knowledge-customer-experience --strict`
   — exit `0`; exact result:
   `Change 'restaurant-knowledge-customer-experience' is valid`.
8. `pnpm docs:check` — exit `0`;
   `Documentation consistency check passed (36 current documents).`
9. `pnpm architecture:check` — exit `0`;
   `Architecture check passed: runtime imports, database URLs, client boundaries, and migration baselines are valid.`
10. `git diff --check` — exit `0`; only Git line-ending notices were emitted,
    with no whitespace error.
11. `pnpm test:cloud` — exit `0`:
    - auth: 3 files, 11 tests passed;
    - core: 1 file, 9 tests passed;
    - contracts: 2 files, 34 tests passed;
    - booking: 1 file, 3 tests passed;
    - booking-web: 1 file/3 tests passed, 1 file/4 tests skipped;
    - tenant: 2 files, 11 tests passed;
    - db-cloud: 4 files/14 tests passed, 14 files/48 guarded integration tests
      skipped by their normal opt-in policy;
    - Backoffice: 70 files/274 tests passed, 1 guarded file skipped.
12. `pnpm -r --if-present typecheck` — exit `0`; all 15 participating workspace
    projects completed successfully.
13. `pnpm build:cloud` — exit `0`; Web, Backoffice, Booking Web and Feedback Web
    compiled, typechecked and generated route output successfully. Backoffice
    output included `/etablissement/informations-generales`.
14. Build preservation check around `pnpm build:cloud`: build changed
    `apps/backoffice/next-env.d.ts` from SHA-256
    `83a6738771334a63124c8acf38250eccd39fd0aba62846bb0815d952a7936205`
    to `4e4da12aa061aac172fb1bcb48e9b6e4b293080d2f494327925fdba8f39632ac`;
    the generated-file line was restored immediately, and the final exact hash
    returned to `83a6738771334a63124c8acf38250eccd39fd0aba62846bb0815d952a7936205`.
15. `pnpm format:check` — exit `1` on 55 pre-existing files outside this
    change, consisting of generated skills, archived/task documents, OpenSpec
    templates and the pre-existing Cuisine/savoir-faire normative spec. None of
    the 55 paths is attributed to Customer Experience.
16. Changed-file formatting used
    `node node_modules/prettier/bin/prettier.cjs --check <30 explicit scoped files>`
    — exit `0`; `All matched files use Prettier code style!`.
17. Forbidden boundary scan:
    `rg -n -i '@yuta/booking|booking-repository|\breservation(s)?\b|reputation|feedback|\btoday\b|personnel|@yuta/db-pos|site-agent|\bpos\b|\border(s)?\b|marketing|\bcrm\b|provider' <8 scoped runtime/schema/migration files>`
    — no matches; `BOUNDARY_MATCHES=0`.
18. Autosave-trigger scan:
    `rg -n 'onBlur|useEffect|setInterval|setTimeout|fetch\(' <Customer Experience model/fields/form files>`
    — no matches; `AUTOSAVE_TRIGGER_MATCHES=0`.
19. Diff integrity commands `git apply --numstat
docs/reviews/restaurant-knowledge-customer-experience/03-implementation.diff`
    and the equivalent migration diff command parsed successfully. The
    implementation artifact contains 28 diff headers, 8,696 insertions and 94
    deletions. The migration artifact contains 3 diff headers and 7,578
    insertions. Neither artifact leaks the saved baseline path.
20. Exact preservation audit compared the 25 dirty files outside the 19 shared
    implementation paths against their pre-Apply SHA-256 values — result
    `UNRELATED_PRESERVED=25/25`.

## Truthful failed diagnostics and unavailable checks

- An initial read-only environment diagnostic from repository root used
  `node -e "require('dotenv')..."` and exited `1` because `dotenv` is package
  local. Repeating it from `packages/db-cloud` succeeded and exposed only
  non-secret connection metadata. It confirmed the configured port `55431`
  differed from the active disposable container port `56031`; the verification
  command therefore used a process-local URL override without editing an
  environment file.
- Browser automation was not run against the non-disposable developer
  database. The workflow did not migrate or mutate that environment. Page
  evidence consists of model/field/form/action/loader tests, full Backoffice
  regressions and the successful Backoffice production build. Environment
  remains `NOT_ENABLED`; Production Readiness remains `NOT_ASSESSED`.

## Requirement and scenario mapping

- Canonical ownership and establishment semantic scope: dedicated
  `restaurant_knowledge_customer_experience` table, composite organization +
  establishment primary/foreign scope, scoped repository predicates, schema
  tests and disposable isolation tests.
- Exactly three descriptive values: schema, repository projection, fields and
  form contain only `desiredExperience`, `welcomeAndService` and
  `customerAttention`; no classification or operational structure was added.
- READ: loader checks `restaurant-knowledge.read` before calling the repository;
  OWNER/MANAGER success and STAFF denial-before-read tests pass.
- MANAGE: action re-derives tenant context and requires
  `restaurant-knowledge.manage` before parsing or persistence; OWNER/MANAGER
  save exactly once and STAFF denial-before-write tests pass. Existing typed
  permission tests prove READ/MANAGE separation and Profile non-inheritance.
- Optional independent states: nullable columns plus repository, model and
  field tests cover missing, all-empty and each of the three single-value
  states.
- Independent manual edits: pure update functions preserve the other two
  values and dirty-state tests cover unchanged versus changed drafts.
- Whole-slice save and read-back: one form/submit binds one action; the action
  calls one atomic upsert; disposable tests cover full round-trip and overwrite.
- No autosave: drafts live only in `useState`; render does not invoke the
  action; source scan reports zero blur/effect/timer/fetch triggers.
- Operational-module non-relationships: scoped dependency scan reports zero
  forbidden imports/references; migration foreign key targets only
  `establishments`; architecture check passes.
- No CRM/customer-specific model: no customer/profile/event relation, field,
  contract, read, write or sync was added; values remain unclassified text.
- No AI/automatic enrichment or Product classification: no provider, AI,
  inference, taxonomy, enum, scoring, analytics or content-limit implementation
  exists; server validation only enforces the exact three nullable strings.

## Regression and lifecycle evidence

- Full Backoffice tests preserve Establishment Profile, Concept/Histoire and
  Cuisine/savoir-faire forms, actions, permissions and loaders.
- Customer Experience action tests explicitly prove that Profile,
  Concept/Histoire and Cuisine/savoir-faire repositories are not invoked.
- Product Knowledge, Module Registry and the existing page pack now describe
  all three implemented slices and the explicit module exclusions.
- Restaurant Knowledge remains Product Decision `APPROVED`, Implementation
  `PARTIAL`, Environment `NOT_ENABLED`, Production Readiness `NOT_ASSESSED`,
  External Dependency `NOT_ASSESSED`.
- No lifecycle dimension was promoted by Tasks, migration, tests, build or this
  verification assessment.
