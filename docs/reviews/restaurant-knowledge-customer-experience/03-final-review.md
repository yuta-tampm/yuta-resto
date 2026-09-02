Change: restaurant-knowledge-customer-experience
Gate: 3 — Final Review
Review status: APPROVED
Created: 2026-09-01T15:17:53.2728422+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — tenant-owned Restaurant Knowledge data, database migration, canonical ownership, authorization consumption, and tenant isolation
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-01T15:32:05.4703571+02:00
Finish outcome: COMPLETED
Sync/archive authorized: 2026-09-01T15:41:08.4258729+02:00
Specs: synced and validated `restaurant-knowledge/customer-experience`
Archive location: `openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience`
Completed: 2026-09-01T15:43:55.1181040+02:00

# Gate 3 — Final Review

## Approved gate integrity

Gate 1, Gate 2 and Gate 2b were approved through explicit current-user
instructions. Their reviewed artifact path sets and hashes were recomputed
before Tasks/Apply and matched exactly. Gate 2b approval was recorded at
`2026-09-01T14:58:47.7800420+02:00`.

| Approved packet                                                               | SHA-256                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-customer-experience/01-analysis-review.md` | `ee9cf27559e46c3ece59bced9d3d341859d36e9c3a9b0268182dde993365c9ee` |
| `docs/reviews/restaurant-knowledge-customer-experience/02-specs-review.md`    | `2372f9c9ea94f1be8d035739a5a26acd4874e9cb6f14c66a2d3836e7aef0b9e8` |
| `docs/reviews/restaurant-knowledge-customer-experience/02b-design-review.md`  | `0bd1809092694f60c5633f79cd0353035efb5717287cc7ec83d5f7968113b612` |

## Current planning artifact hashes

Hash command: `Get-FileHash -Algorithm SHA256 -LiteralPath <path>`; hexadecimal
output normalized to lowercase.

| Repository-relative path                                                                                           | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-customer-experience/analysis.md`                                            | `bd7e2df308415adc95b17ff1002c775d12e6fbc66c8526a466a2efb9bca37aa9` |
| `openspec/changes/restaurant-knowledge-customer-experience/design.md`                                              | `64228423fc7e3b0b94acb0f69ff13ae0b70f814426e6272b25b1a2dd1298edfb` |
| `openspec/changes/restaurant-knowledge-customer-experience/proposal.md`                                            | `4b1cf04bbab4711918cee0166261f9c135d0db9911349c5ddaafca7757e992c3` |
| `openspec/changes/restaurant-knowledge-customer-experience/specs/restaurant-knowledge/customer-experience/spec.md` | `d028bcbbb1cec1dfb5c84c91174d1ea55985b7e056d776294626a1940f098ff6` |
| `openspec/changes/restaurant-knowledge-customer-experience/tasks.md`                                               | `c51c921d6b706d00dc3c55b8eaf0ad8fa8f747c8f6183ae572abac734af4f4a8` |

## Design and implementation summary

Implementation follows the approved Design without deviation:

- one dedicated `restaurant_knowledge_customer_experience` cloud table with
  composite organization/establishment primary and establishment foreign scope;
- exactly three nullable text values: `desiredExperience`,
  `welcomeAndService`, and `customerAttention`;
- a scoped missing-to-empty projection and one atomic whole-slice upsert;
- READ-gated loading before repository access and separately MANAGE-gated save
  before parsing/persistence;
- one route-local three-value draft/form with one submit and no autosave;
- no shared contract, new permission, changed ownership, provider,
  operational-module relation or cross-runtime path;
- an additive migration with non-destructive application rollback semantics.

## Tasks completion

`tasks.md` contains 16/16 checked Tasks. OpenSpec Apply reports:

```text
total: 16
complete: 16
remaining: 0
state: all_done
```

Tasks cover pre-Apply attribution, schema/migration, repository isolation,
server authorization, page/form behavior, documentation/lifecycle truth,
bounded verification and deterministic Gate 3 evidence.

## Attributed implementation files

The sorted 28-file implementation scope is:

1. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-fields.tsx`
2. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx`
3. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`
4. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/customer-experience-model.ts`
5. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`
6. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`
7. `apps/backoffice/test/concept-history-action.test.ts`
8. `apps/backoffice/test/cuisine-know-how-action.test.ts`
9. `apps/backoffice/test/customer-experience-action.test.ts`
10. `apps/backoffice/test/customer-experience-fields.test.tsx`
11. `apps/backoffice/test/customer-experience-form.test.tsx`
12. `apps/backoffice/test/customer-experience-model.test.ts`
13. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`
14. `docs/features/establishment/general-information/README.md`
15. `docs/features/establishment/README.md`
16. `docs/MODULE_REGISTRY.md`
17. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`
18. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
19. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
20. `docs/ui/pages/establishment-general-information/README.md`
21. `docs/ui/pages/establishment-general-information/UI_SPEC.md`
22. `packages/db-cloud/drizzle/0013_restaurant_knowledge_customer_experience.sql`
23. `packages/db-cloud/drizzle/meta/_journal.json`
24. `packages/db-cloud/drizzle/meta/0013_snapshot.json`
25. `packages/db-cloud/src/restaurant-knowledge-repository.ts`
26. `packages/db-cloud/src/schema/restaurant-knowledge.ts`
27. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`
28. `packages/db-cloud/test/schema.test.ts`

The pre-Apply baseline copies and review artifacts are evidence files, not
implementation files, and are not included in the implementation diff.

## Change-scoped diff and migration evidence

Because the worktree was dirty before this change, raw HEAD-only `git diff` or
`git diff --stat` is not attribution evidence. The complete scoped diff was
built from each of the 19 saved pre-Apply shared-file byte copies plus nine
new-file `/dev/null` diffs, sorted by repository path and serialized as UTF-8
without BOM.

Full diff: [`03-implementation.diff`](03-implementation.diff)

Migration-only diff: [`03-migration.diff`](03-migration.diff)

| Evidence path                                                                    | SHA-256                                                            |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-customer-experience/03-implementation.diff`   | `075dcbba24359d5fd27c3e40bdb3b48188af99e38a99b22b296b4f2c0cec4ee3` |
| `docs/reviews/restaurant-knowledge-customer-experience/03-migration.diff`        | `42462dd013e30e198568484179f4ccaaed760012a65bfd71d129fe9cefea3f10` |
| `docs/reviews/restaurant-knowledge-customer-experience/03-pre-apply-manifest.md` | `f0dffc5408415ba0e72864e294b879445f479093380cdf432bd69f2b07b38adf` |
| `docs/reviews/restaurant-knowledge-customer-experience/03-verify-evidence.md`    | `5df49f94719a30cfbf646fcb099814a58e1930e7dd5176f31e7e7fca4e160eef` |

Baseline-scoped stat command:

```text
git apply --stat docs/reviews/restaurant-knowledge-customer-experience/03-implementation.diff
```

Exact result:

```text
28 files changed, 8696 insertions(+), 94 deletions(-)
```

Migration result:

```text
3 files changed, 7578 insertions(+)
```

`git apply --numstat` parsed both artifacts successfully, implementation and
migration header counts are respectively 28 and 3, and baseline path leakage is
zero. Exact SHA-256 preservation checks pass for all 25 unrelated dirty files
outside the 19 shared implementation paths.

## Requirement and scenario mapping

The canonical mapping and command evidence is attached in
[`03-verify-evidence.md`](03-verify-evidence.md). Its assessment source is the
generated `openspec-verify-change` workflow applied to the exact current
Proposal, Analysis, 11-requirement/26-scenario delta Spec, Design, completed
Tasks, code/tests and command outputs.

Key mappings:

- schema/repository/migration plus disposable PostgreSQL tests prove canonical
  ownership, composite tenant scope, missing/all-empty, every single-value
  state, whole-slice round-trip, overwrite and cross-scope denial;
- loader tests prove READ before repository access and STAFF denial;
- action tests prove MANAGE before persistence, OWNER/MANAGER success, STAFF
  denial, one upsert call and no Profile-permission substitution;
- model/fields/form tests prove independent manual drafts, read-only behavior,
  exactly one submit and no action on render;
- source scans prove zero autosave triggers and zero forbidden operational,
  CRM or provider dependencies;
- full Backoffice regressions cover Establishment Profile, Concept/Histoire and
  Cuisine/savoir-faire while the cloud build proves route compilation.

Verification scorecard: 16/16 Tasks, 11/11 requirements, 26/26 scenarios, zero
CRITICAL, WARNING or SUGGESTION issue.

## Commands and truthful results

The attached canonical evidence records exact commands, exits and suite counts.
Accepted key results:

- strict OpenSpec validation: exit `0`;
- docs check: exit `0`, 36 current documents;
- architecture check: exit `0`;
- focused Backoffice: 7 files/36 tests passed;
- disposable migration: exit `0`;
- disposable repository isolation: 1 file/7 tests passed;
- disposable database drop: exit `0`;
- full cloud tests: exit `0`; Backoffice 70 files/274 tests passed and db-cloud
  4 enabled files/14 tests passed;
- recursive typechecks: exit `0` across 15 participating workspaces;
- cloud build: exit `0` across Web, Backoffice, Booking Web and Feedback Web;
- changed-file Prettier: exit `0`;
- forbidden boundary matches: `0`;
- autosave trigger matches: `0`;
- unrelated dirty files preserved: `25/25`.

Truthful limitations:

- repository-wide `pnpm format:check` exits `1` on 55 pre-existing paths
  outside this change; all scoped changed files pass formatting;
- browser automation was not run against the non-disposable developer database,
  which was deliberately not migrated or mutated;
- the build-generated `next-env.d.ts` drift was restored to its exact pre-build
  SHA-256 and is not attributed to this change.

## Documentation and lifecycle

Current Product Knowledge, Module Registry and the existing page pack now
describe the third implemented Restaurant Knowledge slice, its dedicated
persistence, READ/MANAGE behavior, optional states, explicit save, no autosave
and prohibited module/provider relationships.

Restaurant Knowledge remains exactly:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

No lifecycle dimension was promoted by Tasks, Apply, migration, tests, build or
Verify.

## Deviations and unresolved issues

No implementation deviation from the approved Spec or Design was found. No
shared contract, new permission, changed tenancy/canonical ownership,
prohibited module dependency, external provider or cross-runtime behavior was
needed. No requirement-level issue remains unresolved.

## Finish record

The current-user instruction dated `2026-09-01` explicitly authorized sync and
archive for this exact approved change. The status-reported delta selection
contained only `restaurant-knowledge/customer-experience/spec.md`. It was
promoted to
`openspec/specs/restaurant-knowledge/customer-experience/spec.md`, with the
delta operation heading converted to the canonical main-spec `Requirements`
heading and no behavioral content changed.

Post-sync comparison proved the main spec reproduces the approved delta exactly
when that structural heading conversion is reversed. Strict main-spec
validation passed for all 5/5 normative specs. Repository documentation,
architecture and recursive typecheck commands all exited `0`.

The active change was archived at
`openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience`
with its `.openspec.yaml`, planning artifacts, delta spec and completed Tasks
intact.

The following previously accepted normative specs remained byte-identical to
the pre-sync manifest:

- `authorization/restaurant-knowledge`;
- `establishment-profile`;
- `restaurant-knowledge/concept-history`;
- `restaurant-knowledge/cuisine-know-how`.

No lifecycle value was promoted. Browser QA, deployment, environment enablement
and Production Readiness were not performed or claimed.
