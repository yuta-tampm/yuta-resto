Change: restaurant-knowledge-cuisine-know-how
Gate: 3 — Final Review
Review status: APPROVED
Created: 2026-08-31T23:27:34.0218352+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — tenant-owned Restaurant Knowledge data, database migration, canonical ownership, authorization consumption, and tenant isolation

# Gate 3 — Final Review

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-08-31T23:33:27.9446893+02:00
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Finish outcome: COMPLETED
Specs: synced and strictly validated `restaurant-knowledge/cuisine-know-how`
Archive location: `openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how`
Completed: 2026-08-31T23:34:52.6574565+02:00

## Gate 3 regeneration provenance

Regenerated: 2026-08-31T23:27:34.0218352+02:00

The earlier Gate 3 packet was invalidated when its reviewed `.diff` evidence
paths were temporarily absent and equivalent `.txt` paths existed instead.
The exact reviewed filenames have now been restored:

- `docs/reviews/restaurant-knowledge-cuisine-know-how/03-implementation.diff`
  with SHA-256
  `9992bcd7a8ac8c80aff6f22216a0a42b722b3917d3051ab4ea3962f7e7eec440`;
- `docs/reviews/restaurant-knowledge-cuisine-know-how/03-migration.diff` with
  SHA-256
  `bb34bf99720fde83cf33032778deb20fd1cf729f54e5c5ce065626a0c5bc0fdb`.

A deterministic regeneration of the current scoped implementation diff
produced the same implementation hash. Every planning artifact, earlier
approved packet and verify-evidence hash still matches; all 14 tasks remain
complete; strict change validation and `docs:check` pass. No normative spec was
synced and no change was archived during the invalidated finish attempt.

This fresh packet requires a new explicit Gate 3 approval and sync/archive
authorization; the earlier authorization is not reused.

## Earlier approved gates and integrity

Gate 1, Gate 2 and Gate 2b were approved by explicit current-user
instructions. Their reviewed artifact path sets and hashes were recomputed
before Apply and again before this packet; all values match.

Hash command: `Get-FileHash -Algorithm SHA256 -LiteralPath <path>`;
hexadecimal output normalized to lowercase.

| Repository-relative path                                                                                     | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-cuisine-know-how/01-analysis-review.md`                                   | `5f374035d75a06069ccf7ddda63d1eaf9fbad212eb79019803476fa6b857a45f` |
| `docs/reviews/restaurant-knowledge-cuisine-know-how/02-specs-review.md`                                      | `400c035da135e2be5e5962d96269b5b2eb40e7a784b2169112c78f618f641c8a` |
| `docs/reviews/restaurant-knowledge-cuisine-know-how/02b-design-review.md`                                    | `e786427d8077669323d07f529623054dbf227c089acfcd2eba0cc7198a1f2efb` |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/analysis.md`                                         | `fbf4fabcc6ef28420c33b42db89608dacfa6a9accb52ef39cde183628c9fe6a7` |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/design.md`                                           | `ecc8eb49d983ce2fb71b7e66590bd37e18c3b0f2515a676b2d0b04511d8e25c6` |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/proposal.md`                                         | `48a1c22588d7785520cd0fbc99aaf1845029bafbf84675888fc3e2a8b96d4b1d` |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/specs/restaurant-knowledge/cuisine-know-how/spec.md` | `5b923da9db3095d1e216301875cb4d3d247763fb4ba5f0b6bb3c291f1b1444e7` |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/tasks.md`                                            | `123d957497bfdbbbd213760c3bc17f456073854673afc17c0441e7edad73a9cb` |

Provenance HEAD:
`01e6ca74186f5cda389f5ca8c0700274b29d18d0`.

## Design and implementation summary

- Added dedicated cloud table
  `restaurant_knowledge_cuisine_know_how` with composite organization and
  establishment scope, exactly three nullable text values, composite primary
  key and composite foreign key to establishments.
- Added whole-slice get/upsert operations in the existing Restaurant Knowledge
  repository. Missing persistence returns the valid three-null state; all
  reads/writes use trusted organization and establishment scope.
- Added a page-local READ-gated loader and MANAGE-gated server action without
  changing the accepted permission mapping or accepting browser tenant data.
- Added an independent route-local draft model, three-field form and exactly
  one explicit whole-slice save. Field edits are local; no autosave trigger is
  present.
- Composed the card after Concept/Histoire while keeping Profile,
  Concept/Histoire and Cuisine/savoir-faire forms/actions/persistence
  independent.
- Updated current Product Knowledge, Module Registry and the existing page
  pack. Restaurant Knowledge stays `PARTIAL`; Environment stays `NOT_ENABLED`;
  Production Readiness stays `NOT_ASSESSED`.

No shared contract, API, new permission, changed tenancy/canonical ownership,
Carte/POS dependency, Product validation/taxonomy or cross-runtime behavior
was required or introduced.

## Tasks

[`tasks.md`](../../../openspec/changes/restaurant-knowledge-cuisine-know-how/tasks.md)
contains 14/14 checked tasks. OpenSpec apply status reports `complete: 14`,
`remaining: 0` after final verification.

## Requirement/scenario mapping

| Behavioral area                          | Code evidence                                                                                                     | Test/evidence                                                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Canonical ownership and tenant scope     | schema and Restaurant Knowledge repository                                                                        | schema test; disposable migration; repository composite-isolation integration tests                                            |
| READ view/load                           | `loadCuisineKnowHowSection` checks `restaurant-knowledge.read` before repository access                           | loader OWNER/MANAGER cases; STAFF returns null with zero repository reads                                                      |
| MANAGE edit/save                         | form derives `canManage`; action requires `restaurant-knowledge.manage` before persistence                        | action OWNER/MANAGER saves exactly once; STAFF rejects before persistence; accepted authorization regressions                  |
| Optional independent and empty states    | three nullable columns; empty projection; three independent draft update functions                                | missing/all-empty, every single-value integration/model/render cases                                                           |
| Manual input and one explicit save       | controlled textareas; one form and one submit; whole-slice action/repository input                                | component submit-count/pristine/read-only tests; action single-call assertion                                                  |
| No autosave                              | field handlers only update React state; no blur/effect/timer/fetch persistence                                    | no action on render; scoped source scan reports `autosave_trigger_matches=0`                                                   |
| No Carte & menus/POS relationship        | only establishment composite foreign key; no menu/POS import/query/write/link/sync                                | scoped source scan reports `menu_pos_boundary_matches=0`; architecture pass; action never invokes Profile/Concept repositories |
| Concept/Profile isolation and regression | separate tables, operations, loaders, actions and forms; existing authorization mapping unchanged                 | full cloud suite; Concept model/form/action/loader tests; Profile permission/general-information regressions                   |
| Excluded enrichment/integrations         | no provider, AI, learning, provenance, Marketing/social, external runtime, vector or other knowledge-section code | scoped diff review and architecture check                                                                                      |

The delta Spec contains 9 requirements and 19 scenarios. Verification found
9/9 requirements and 19/19 scenarios covered by executable tests and/or direct
source-boundary evidence.

## Implementation files

Runtime, schema and repository:

- `packages/db-cloud/src/schema/restaurant-knowledge.ts`
- `packages/db-cloud/src/restaurant-knowledge-repository.ts`
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/cuisine-know-how-model.ts`
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-fields.tsx`
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx`

Migration:

- `packages/db-cloud/drizzle/0012_restaurant_knowledge_cuisine_know_how.sql`
- `packages/db-cloud/drizzle/meta/0012_snapshot.json`
- `packages/db-cloud/drizzle/meta/_journal.json`

Tests:

- `packages/db-cloud/test/schema.test.ts`
- `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`
- `apps/backoffice/test/restaurant-knowledge-loader.test.ts`
- `apps/backoffice/test/concept-history-action.test.ts`
- `apps/backoffice/test/cuisine-know-how-model.test.ts`
- `apps/backoffice/test/cuisine-know-how-fields.test.tsx`
- `apps/backoffice/test/cuisine-know-how-form.test.tsx`
- `apps/backoffice/test/cuisine-know-how-action.test.ts`

Documentation/page pack:

- `docs/MODULE_REGISTRY.md`
- `docs/features/establishment/README.md`
- `docs/features/establishment/general-information/README.md`
- `docs/ui/pages/establishment-general-information/README.md`
- `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
- `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
- `docs/ui/pages/establishment-general-information/UI_SPEC.md`
- `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`

## Diff evidence

The complete scoped implementation diff, including all nine untracked
implementation/migration files, is attached at
[`03-implementation.diff`](03-implementation.diff). It contains 27 files,
8,612 insertions and 125 deletions; the generated Drizzle snapshot accounts
for 7,494 inserted lines.

The migration-only diff is attached at
[`03-migration.diff`](03-migration.diff).

| Evidence path                                                               | SHA-256                                                            |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-cuisine-know-how/03-implementation.diff` | `9992bcd7a8ac8c80aff6f22216a0a42b722b3917d3051ab4ea3962f7e7eec440` |
| `docs/reviews/restaurant-knowledge-cuisine-know-how/03-migration.diff`      | `bb34bf99720fde83cf33032778deb20fd1cf729f54e5c5ce065626a0c5bc0fdb` |
| `docs/reviews/restaurant-knowledge-cuisine-know-how/03-verify-evidence.md`  | `f659b145db67ade1d9cc00f0e8f438a8c3d7444e3c6e109eedad35b76a046ecc` |

Implementation diff generation was deterministic:

1. `git diff --binary HEAD -- <18 explicit tracked implementation paths>`;
2. append `git diff --no-index --binary -- /dev/null <path>` for each of the
   nine explicit untracked implementation/migration files in sorted scope;
3. join exact output and write UTF-8 without BOM.

Migration diff generation used the same method for `_journal.json`, migration
SQL and the generated snapshot.

`git diff --quiet` returns `0` for `apps/backoffice/next-env.d.ts` and both
personnel fixture manifests. Windows stat/line-ending normalization makes
`git status` display those paths, but they contain no content diff and are not
attributed to or included in this change.

## Verification and exact results

The canonical unchanged evidence block is
[`03-verify-evidence.md`](03-verify-evidence.md), hashed above. It records exact
commands, exits, suite counts, disposable-database lifecycle, authorization,
tenant isolation, UI/page evidence, boundary scans, format baseline, failed
attempts and unavailable browser automation.

Key accepted results:

- disposable Drizzle migration: exit `0`;
- disposable repository integration: 1 file/5 tests passed; exit `0`;
- disposable database drop: exit `0`;
- cloud regression suite: exit `0`; Backoffice 66 files/253 tests passed;
- recursive typechecks: exit `0` across all selected workspaces;
- cloud build: exit `0` across Web, Backoffice, Booking Web and Feedback Web;
- docs, architecture, strict OpenSpec validation and changed-file formatting:
  exit `0`;
- repository-wide format baseline: exit `1` only for 54 pre-existing files
  outside the scoped change; changed-file format check passes;
- automated browser QA: not run against the non-disposable developer database;
  no Environment or Production Readiness claim is made.

## Lifecycle and documentation changes

- Restaurant Knowledge remains Product Decision `APPROVED`, Implementation
  `PARTIAL`, Environment `NOT_ENABLED`, Production Readiness `NOT_ASSESSED`,
  External Dependency `NOT_ASSESSED`.
- Documentation now records both implemented slices, their separate canonical
  persistence boundaries, READ/MANAGE behavior, optional empty states,
  explicit saves, no autosave and no Carte/POS dependency.
- Stale statements that Concept/Histoire lacked a concrete implementation or
  normative spec were corrected.
- No lifecycle dimension was promoted by planning, tests, build, migration or
  this review packet.

## Deviations and unresolved issues

No implementation deviation from the approved Spec or Design was found. No
requirement-level issue or guarded expansion remains unresolved.

The only verification limitation is the intentionally unexecuted browser pass
against the developer database. Component/render/action/loader tests and the
Backoffice production build provide page behavior evidence without mutating
that environment. This limitation preserves `NOT_ENABLED` / `NOT_ASSESSED` and
does not weaken the implemented repository contract.

## Recommendation

APPROVE Gate 3 for `restaurant-knowledge-cuisine-know-how` if the attached
implementation, migration and canonical verification evidence are accepted.
Do not sync or archive until a new explicit current-user instruction authorizes
the repository-approved finish workflow.
