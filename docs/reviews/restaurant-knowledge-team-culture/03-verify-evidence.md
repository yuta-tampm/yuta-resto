# Technical Verify Evidence

Change: `restaurant-knowledge-team-culture`

Schema: `yuta-spec-driven`

Status: `PASS`

`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`

`VERIFY: PASS`

## Foundation / Data

Pre-Apply attribution is recorded in `03-pre-apply-manifest.md`. HEAD is
`01e6ca74186f5cda389f5ca8c0700274b29d18d0`; the sorted status baseline has 60
entries; 14 shared files have exact baseline copies; 98 protected existing
dirty files are hash-guarded; all copied bytes reproduced their source hashes.
The initial protected-file list omitted 11 tracked dirty paths. VERIFY recovered
that exact path set from the captured status, restored the build-generated
`next-env.d.ts` to its independently recorded pre-build hash, and documented
the correction in the attribution manifest. Final recomputation has zero
missing paths and zero hash mismatches.

Commands and results:

1. `pnpm --filter @yuta/db-cloud exec vitest run test/schema.test.ts` — exit
   `0`; 1 file and 11 tests passed. The Team Culture assertion verifies exactly
   five columns, three nullable text values, one composite primary key, one
   composite establishment foreign key, and `ON DELETE RESTRICT`.
2. `pnpm --filter @yuta/db-cloud exec drizzle-kit generate --name restaurant_knowledge_team_culture`
   — exit `0`; generated only
   `drizzle/0014_restaurant_knowledge_team_culture.sql`,
   `drizzle/meta/0014_snapshot.json`, and journal entry `14` from the captured
   `0013_restaurant_knowledge_customer_experience` baseline.
3. Disposable PostgreSQL full-chain verification from `packages/db-cloud`:

   ```powershell
   $verifyDb = 'yuta_rk_team_verify_20260902_1330'
   docker exec yuta-cloud-db-dev createdb -U yuta_cloud $verifyDb
   $env:CLOUD_DATABASE_URL = "postgres://yuta_cloud:yuta_cloud@localhost:56031/$verifyDb"
   pnpm exec drizzle-kit migrate
   docker exec yuta-cloud-db-dev psql -U yuta_cloud -d $verifyDb -v ON_ERROR_STOP=1 -c <column-query>
   docker exec yuta-cloud-db-dev psql -U yuta_cloud -d $verifyDb -v ON_ERROR_STOP=1 -c <constraint-query>
   ```

   Creation and migration exited `0`; Drizzle reported `migrations applied
successfully`. Live inspection returned exactly five columns, nullable
   `text` for all three descriptive fields, the composite primary key, and the
   composite foreign key with PostgreSQL delete action `RESTRICT`. Existing
   identifier-truncation notices came from earlier migrations.

4. Protected-existing-file recomputation after Foundation/Data — 0 mismatches.

Generated migration hashes:

- SQL: `e2c40e0441c3da500a221b57d181267f3ba15cb9dc9cd993bf1f31cdbcd62a2c`;
- snapshot: `2a353328c9b76c27350fa5374b8b4cdfb55e745b453930b40cda2321f4728d00`.

The disposable database was dropped after the guarded repository tests.

## Service / Domain

The internal repository projection/input contains exactly
`valuesAndMindset`, `workingTogether`, and `transmissionAndIntegration` as
`string | null`. Reads use trusted `TenantContext`, `requireEstablishment`, and
both organization and establishment predicates. Save is one Drizzle insert
with composite conflict target, updates all three values together, and returns
the complete projection.

Disposable repository command:

```powershell
$env:CLOUD_DATABASE_URL = 'postgres://yuta_cloud:yuta_cloud@localhost:56031/yuta_rk_team_verify_20260902_1330'
$env:YUTA_ALLOW_DATABASE_INTEGRATION_TESTS = 'true'
pnpm --filter @yuta/db-cloud exec vitest run test/restaurant-knowledge-repository.integration.test.ts
```

Result: exit `0`; 1 file and 9 tests passed. The two Team Culture cases cover
missing/all-null, every single-value state, full three-value round-trip,
whole-slice overwrite, separate establishments, separate organizations, and a
mismatched organization/establishment denial without read/write leakage.

Focused server boundary command:

```text
pnpm --filter @yuta/backoffice exec vitest run test/team-culture-action.test.ts test/team-culture-model.test.ts test/team-culture-fields.test.tsx test/team-culture-form.test.tsx test/restaurant-knowledge-loader.test.ts test/restaurant-knowledge-permissions.test.ts
```

Result: exit `0`; 6 files and 40 tests passed. Evidence includes separate OWNER
and MANAGER success, STAFF denial before persistence, Profile permission
non-substitution, READ-before-repository, zero repository calls without READ,
direct server-side MANAGE enforcement, zero persistence on denied paths,
empty-to-null without trimming, exact three-field forwarding, unrelated raw
FormData non-forwarding, revalidation only after successful persistence, and
content-safe recoverable error output. The logical READ-without-MANAGE path is
modeled only by a test-local guard override; it adds no production role,
principal, permission or grant.

## UI / Components and Interaction / States

The real route composes an independent Team Culture section after Expérience
client. It loads real repository data in the existing Server Component flow and
preserves Profile, Concept/Histoire, Cuisine/savoir-faire, and Expérience client
forms/actions. The fields component renders exactly the three approved French
labels and optional textareas. `canManage = false` is tested only as a disabled
presentation with no submit control, not as evidence of a production principal.

Current-byte verification also includes the two focused post-VERIFY UI fixes:
the Team Culture form no longer depends on a server-value React key for canonical
dirty reset, success uses `role="status"`, recoverable failure uses
`role="alert"`, and the three pre-existing sibling Restaurant Knowledge keys are
namespaced to prevent the duplicate-key runtime issue observed during Browser
QA. The focused form suite verifies both alert semantics and the successful
canonical-equivalent save without remount dependence.

The pure model canonicalizes only `''` to `null`, preserves text and
whitespace-only strings, and compares all three draft/server values canonically.
Tests cover the four approved dirty cases, including retained browser `''`
against revalidated server `null` without relying on remount. The form owns
browser-local draft state, renders exactly one whole-slice submit, uses
`useFormStatus` pending state on that same control, retains draft state on
action error, and has no effect/timer/background/autosave path.

Additional results:

- `pnpm --filter @yuta/backoffice typecheck` — exit `0`;
- `pnpm --filter @yuta/db-cloud typecheck` — exit `0`;
- `pnpm docs:check` — exit `0`, 36 current documents passed;
- `pnpm architecture:check` — exit `0`;
- protected-existing-file recomputation after Service/UI/docs — 0 mismatches;
- Team Culture autosave-token scan — zero matches.

Implementation-facing page-pack documentation now describes only the actual
Team Culture page behavior. Product Knowledge, Module Registry, ownership,
permissions, durable boundaries, Environment and Production Readiness were not
modified or promoted by this Apply.

## Integration / Regression checks

- `pnpm test:cloud` — exit `0`; all unguarded cloud suites passed, including
  Backoffice 297 tests, db-cloud 15 tests, contracts 34 tests, tenant 11 tests,
  auth 11 tests, core 9 tests, booking 3 tests, and booking-web 3 tests. Guarded
  database/browser-dependent suites retained their repository-defined skips.
- `pnpm -r --if-present typecheck` — exit `0`; all 15 participating workspace
  projects passed.
- `pnpm build:cloud` — exit `0`; all four cloud/public applications built,
  including the Backoffice establishment route.
- that build regenerated `apps/backoffice/next-env.d.ts`; after the build it was
  restored to its attributed pre-Apply byte sequence and verified at lowercase
  SHA-256 `83a6738771334a63124c8acf38250eccd39fd0aba62846bb0815d952a7936205`.
- scoped repository Prettier check over the 22 attributable files for which the
  configured formatter has a parser — exit `0`. Migration SQL is not claimed as
  lint/Prettier evidence because this repository has no configured SQL parser;
  it is covered by the guarded migration and live PostgreSQL checks above.
- `pnpm exec openspec validate restaurant-knowledge-team-culture --strict` —
  exit `0`; change is valid.
- approved Proposal, Analysis, delta Spec, Design and the three approved review
  packets reproduce their recorded hashes. `tasks.md` differs only because
  Apply authorization/evidence and completion checkboxes are updated.
- attributable added-line scan: zero prohibited imports, zero prohibited
  FK/event/contract/API relationships, and zero new Team Culture imports from
  `@yuta/contracts`.
- migration scan: one new table, zero other-table alters, zero references other
  than the establishment composite scope, and zero insert/update/delete
  backfill statements.
- Product Knowledge and Module Registry protected hashes reproduce exactly.

## Technical Compliance Matrix

| Design rule                                                   | Authoritative implementation                                                | Verification evidence                                                                                                              | Result |
| ------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1. Dedicated exact persistence shape                          | `restaurant-knowledge.ts`; migration `0014`                                 | schema 11/11; live five-column/PK/FK inspection                                                                                    | PASS   |
| 2. Additive migration and safe rollback posture               | SQL, snapshot and journal entry 14                                          | full migration chain on disposable PostgreSQL; bounded migration scan                                                              | PASS   |
| 3. Trusted scoped repository and atomic upsert                | `restaurant-knowledge-repository.ts`                                        | repository integration 9/9; all states, overwrite and A1/A2/B isolation                                                            | PASS   |
| 4. READ before repository, MANAGE derived separately          | `restaurant-knowledge-loader.ts`                                            | loader/action focused suite; OWNER/MANAGER success, STAFF and Profile non-substitution                                             | PASS   |
| 5. MANAGE before parsing/persistence; exact constructed input | `actions.ts`                                                                | authorization ordering, three-field forwarding, unrelated raw-field non-forwarding and safe error tests                            | PASS   |
| 6. Page-local draft, canonical dirty equality, one save       | Team Culture model/fields/form                                              | model/form tests cover all four canonical cases, one invocation, pending/success/error/retry and no autosave                       | PASS   |
| 7. Existing page boundaries preserved                         | `page.tsx` and unchanged independent form/action composition                | focused 40/40 plus full Backoffice 297-test regression, namespaced sibling keys and cloud build                                    | PASS   |
| 8. No cross-module/runtime/provider relationship              | attributable implementation and migration diff                              | zero prohibited import/FK/event/contract/API scan results                                                                          | PASS   |
| 9. Requirement-to-technical traceability                      | Spec, approved Design and this matrix                                       | 14 requirements/38 scenarios covered by schema, migration, repository, authorization, parsing, interaction and regression evidence | PASS   |
| 10. Browser QA remains separate and mandatory                 | real authenticated route and QA packet reservation                          | technical evidence complete; Browser QA executes only after this VERIFY PASS                                                       | PASS   |
| 11. Dirty-worktree attribution                                | pre-Apply baseline, exact byte copies and corrected protected hash manifest | 14 shared baselines; 98 protected files; zero final mismatches; deterministic scoped diffs                                         | PASS   |

The Spec's 14 requirements and 38 scenarios map to these rows: ownership and
scope to rows 1, 3 and 4; exact values and optional/all-empty states to rows 1,
3 and 6; READ/MANAGE behavior to rows 4 and 5; manual whole-slice save and no
autosave to rows 3, 5 and 6; every approved non-relationship and absence of
automatic classification/inference to row 8. Each mapping is backed by the
named focused tests and source scans above; Browser QA is not substituted for
server, repository or migration proof.

## Deterministic change-scoped diffs

`03-implementation.diff` contains exactly 20 `diff --git` sections: 13 shared
non-migration paths compared with their saved pre-Apply bytes and seven new
Team Culture implementation/test files represented as `/dev/null` to current
file diffs. Its SHA-256 is
`bbf72495533f176e0f2454ce2de2e581882b053f9427d4431a31ffa53319766b`.

Exact implementation inventory:

1. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-fields.tsx`
2. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx`
3. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`
4. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`
5. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`
6. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/team-culture-model.ts`
7. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`
8. `apps/backoffice/test/team-culture-action.test.ts`
9. `apps/backoffice/test/team-culture-fields.test.tsx`
10. `apps/backoffice/test/team-culture-form.test.tsx`
11. `apps/backoffice/test/team-culture-model.test.ts`
12. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`
13. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
14. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
15. `docs/ui/pages/establishment-general-information/README.md`
16. `docs/ui/pages/establishment-general-information/UI_SPEC.md`
17. `packages/db-cloud/src/restaurant-knowledge-repository.ts`
18. `packages/db-cloud/src/schema/restaurant-knowledge.ts`
19. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`
20. `packages/db-cloud/test/schema.test.ts`

`03-migration.diff` contains exactly three `diff --git` sections and has
SHA-256 `55e752347d9b1eb0aa2bb0fd46f6e68a0240164a5f3b274e218f66491e36122f`:

1. `packages/db-cloud/drizzle/0014_restaurant_knowledge_team_culture.sql`
2. `packages/db-cloud/drizzle/meta/0014_snapshot.json`
3. `packages/db-cloud/drizzle/meta/_journal.json`

The SQL and snapshot are proper new-file diffs from `/dev/null`; the journal is
the saved-baseline-to-current diff. The SQL remains additive: it creates only
the approved Team Culture table and adds its composite establishment foreign
key with `ON DELETE RESTRICT`.

Both evidence files were regenerated from saved pre-Apply bytes plus
attributable new files, not from the dirty `HEAD` diff. Integrity results are:

- implementation apply-check on a reconstructed pre-Apply tree: PASS;
- implementation reverse-check on current bytes, including deletion of the
  seven represented new files: PASS;
- migration apply-check on a reconstructed pre-Apply tree: PASS;
- migration reverse-check on current bytes, including deletion of SQL and
  snapshot: PASS.

No unrelated dirty file is attributed to either diff.

## VERIFY conclusion

Completeness: `PASS`. Correctness: `PASS`. Coherence: `PASS`.

No critical issue or warning remains. Browser QA is the next mandatory and
independent gate; this technical PASS does not itself establish Gate 3
readiness.
