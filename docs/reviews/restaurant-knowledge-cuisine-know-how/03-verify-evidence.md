# Canonical Verify Evidence

Change: `restaurant-knowledge-cuisine-know-how`

Assessment source: generated `openspec-verify-change` workflow applied manually
to the current `proposal`, `analysis`, delta Spec, `design`, `tasks`, scoped
implementation diff, repository tests and validation outputs. The active
`yuta-spec-driven` schema has no `verify` artifact; therefore this file is the
canonical verification report rather than an OpenSpec planning artifact.

## Scorecard

| Dimension    | Result                                                         |
| ------------ | -------------------------------------------------------------- |
| Completeness | PASS — 14/14 tasks complete; 9/9 requirements implemented      |
| Correctness  | PASS — 19/19 scenarios covered by tests and/or source evidence |
| Coherence    | PASS — approved Design followed; no guarded expansion found    |

CRITICAL issues: none.

WARNING issues: none.

SUGGESTION issues: none.

## Exact commands and results

All commands ran from repository root unless another working directory is
stated.

1. `pnpm exec openspec validate restaurant-knowledge-cuisine-know-how --strict`
   — exit `0`; exact result:
   `Change 'restaurant-knowledge-cuisine-know-how' is valid`.
2. `pnpm docs:check` — exit `0`;
   `Documentation consistency check passed (36 current documents).`
3. `pnpm architecture:check` — exit `0`;
   `Architecture check passed: runtime imports, database URLs, client boundaries, and migration baselines are valid.`
4. `pnpm -r --if-present typecheck` — exit `0`; all 15 selected workspace
   projects completed successfully, including `@yuta/db-cloud` and
   `@yuta/backoffice`.
5. `pnpm test:cloud` — exit `0`:
   - auth: 3 files, 11 tests passed;
   - core: 1 file, 9 tests passed;
   - contracts: 2 files, 34 tests passed;
   - booking: 1 file, 3 tests passed;
   - booking-web: 1 file/3 tests passed, 1 file/4 tests skipped;
   - tenant: 2 files, 11 tests passed;
   - db-cloud: 4 files/13 tests passed, 14 files/46 database tests skipped by
     their normal opt-in guard;
   - backoffice: 66 files/253 tests passed, 1 file skipped.
6. `pnpm --filter @yuta/backoffice test -- test/cuisine-know-how-action.test.ts test/cuisine-know-how-form.test.tsx test/restaurant-knowledge-loader.test.ts test/concept-history-action.test.ts test/concept-history-form.test.tsx test/concept-history-fields.test.tsx test/concept-history-model.test.ts test/restaurant-knowledge-permissions.test.ts test/establishment-profile-permissions.test.ts`
   — exit `0`. Because the package script forwards the extra separator to
   Vitest, Vitest executed the full Backoffice suite: 66 files/253 tests
   passed, 1 file skipped. This includes OWNER/MANAGER, STAFF denial,
   whole-slice save, empty normalization, no-persistence-on-render, failure,
   Concept/Histoire and Profile permission regressions.
7. `pnpm --filter @yuta/db-cloud test -- test/schema.test.ts` — exit `0`.
   Because the package script forwards the extra separator, Vitest executed
   all normally enabled db-cloud tests: 4 files/13 tests passed; 14
   integration files/46 tests skipped by opt-in guards. The schema test for
   exact columns, nullability, composite keys and Profile separation passed.
8. Disposable database verification from `packages/db-cloud`:

   ```powershell
   $verifyDb = 'yuta_rk_cuisine_verify_20260831'
   docker exec yuta-cloud-db-dev createdb -U yuta_cloud $verifyDb
   # CLOUD_DATABASE_URL was derived from .env.local, with only the active
   # container port (56031) and disposable database path overridden.
   pnpm exec drizzle-kit migrate
   $env:YUTA_ALLOW_DATABASE_INTEGRATION_TESTS = 'true'
   pnpm exec vitest run test/restaurant-knowledge-repository.integration.test.ts
   docker exec yuta-cloud-db-dev dropdb -U yuta_cloud --if-exists $verifyDb
   ```

   Exact result: migration exit `0` with
   `migrations applied successfully`; integration exit `0`, 1 file/5 tests
   passed; disposable database drop exit `0`. The tests cover missing-row and
   all-empty state, each of the three single-value states, whole-slice round
   trips, separate establishments/organizations, mismatched composite scope,
   rejected cross-tenant writes, and preservation of the original tenant's
   data.

9. `pnpm build:cloud` — exit `0`; Web, Backoffice, Booking Web and Feedback Web
   all compiled, typechecked and generated their route output successfully.
   The Backoffice output includes dynamic route
   `/etablissement/informations-generales`.
10. `git diff --check` — exit `0`; no whitespace errors.
11. Changed-file format verification:

    ```powershell
    $tracked = git diff --name-only --diff-filter=ACM
    $untracked = git ls-files --others --exclude-standard
    $files = @($tracked + $untracked) | Where-Object { $_ -match '\.(ts|tsx|js|jsx|json|md|yaml|yml|css|mjs)$' -and $_ -notmatch '^docs/reviews/restaurant-knowledge-cuisine-know-how/03-' }
    node node_modules/prettier/bin/prettier.cjs --check $files
    ```

    Exit `0`; `All matched files use Prettier code style!`.

12. Boundary source scan across the new schema/repository/action/loader/form
    paths using
    `rg -n '@yuta/db-pos|site-agent|carte-menus|\bdish\b|\bproduct\b|\bprice\b|\bingredient\b|\brecipe\b|\bsupplier\b|\bsync\b' <scoped-files>`
    — no matches; recorded as `menu_pos_boundary_matches=0`.
13. Autosave-trigger scan using
    `rg -n 'onBlur|useEffect|setInterval|setTimeout|fetch\(' <scoped-files>`
    — no matches; recorded as `autosave_trigger_matches=0`.

## Truthful failed or unavailable checks

- The first disposable migration attempt exited `1` because the repository's
  local `.env.local` still named inactive host port `55431`, while the active
  `yuta-cloud-db-dev` container published `56031`. That disposable database was
  dropped successfully. The retry changed no repository configuration: it
  overrode only the process-local port and disposable database name, then
  passed migration/integration/drop as recorded above.
- Repository-wide `pnpm format:check` exited `1` on 54 pre-existing formatting
  warnings outside this change (principally agent skills, archived/task docs,
  OpenSpec templates and an archived change). The deterministic changed-file
  Prettier check above exited `0`; none of the scoped changed files is among
  the baseline warnings.
- An exploratory `pnpm exec openspec instructions verify --change restaurant-knowledge-cuisine-know-how --json`
  exited `1` because `verify` is not an artifact in `yuta-spec-driven`. The
  generated verification procedure in `openspec-verify-change` was therefore
  performed manually and is the assessment source for this report.
- Browser automation was not run against the developer database. The workflow
  deliberately did not migrate or mutate that non-disposable environment.
  UI/page evidence instead consists of render/model/action/loader tests and a
  successful Backoffice production build. Environment stays `NOT_ENABLED` and
  Production Readiness stays `NOT_ASSESSED`.

## Requirement and scenario evidence

- Canonical ownership and tenant scope: dedicated schema, composite primary
  and establishment foreign key, repository guards/predicates, schema tests
  and disposable tenant-isolation tests.
- READ/MANAGE: loader gates repository reads with READ; server action requires
  MANAGE before parsing or persistence. Existing permission tests prove
  OWNER/MANAGER grants, STAFF denial and Profile non-inheritance; permission
  mapping was not changed.
- Optional independent values: nullable text columns, empty projection,
  all-empty plus three single-value integration/model/render cases.
- Manual input, one explicit save and no autosave: controlled draft model,
  exactly one form/submit, one repository call per action, pristine-disabled
  save, no action on render and zero autosave-trigger source matches.
- Carte/POS separation: no matching imports/references in scoped source, no
  foreign keys beyond establishments, architecture check passed, and action
  tests prove Concept/Profile repositories are not invoked.
- Exclusions: no shared contract, API, permission, role, validation taxonomy,
  provider, AI, learning, provenance, Marketing/social, external runtime or
  other Restaurant Knowledge section was added.

## Verification conclusion

PASS. Implementation is complete, correct and coherent with the approved
Proposal, delta Spec and Design. No requirement-level conflict, guarded
expansion or archive blocker was found.
