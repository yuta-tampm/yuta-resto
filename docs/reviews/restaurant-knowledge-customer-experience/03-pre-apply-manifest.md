# Pre-Apply attribution manifest

Change: `restaurant-knowledge-customer-experience`

Captured: `2026-09-01T15:01:07.6426641+02:00`

Provenance HEAD: `01e6ca74186f5cda389f5ca8c0700274b29d18d0`

## Exact shared-file baseline

Each source file was copied byte-for-byte under
`docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/`
at the same repository-relative path. Source and copy hashes were computed with
`Get-FileHash -Algorithm SHA256 -LiteralPath <path>` and matched for all 19
files.

| Repository-relative path                                                                                      | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`                     | `50b889797c3f096ca66d6674b0b5018a0c18893f1134d12386bc6317bdace665` |
| `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`                       | `4141754619bfdca5e2fa8434141fbd07e63e5e9575b1d2ced72833628564b04b` |
| `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts` | `ddb6ce15638c263870ff12b1474ae95b486ce6dfc95a2ea5288e39dc870c71b6` |
| `apps/backoffice/test/concept-history-action.test.ts`                                                         | `ea059e50a957e60b5f3c32e38a0d5123290ee8aef9cdce5110bcd400a062d942` |
| `apps/backoffice/test/cuisine-know-how-action.test.ts`                                                        | `eb729d8298b0eea8a1ef79891dbeadb14de68891619c7a5410159beb06031377` |
| `apps/backoffice/test/restaurant-knowledge-loader.test.ts`                                                    | `d82cd51bc08c5f6a72ff533b426c2f402046baf839f7ea39a579fb67a3506161` |
| `docs/MODULE_REGISTRY.md`                                                                                     | `045a808d9263e48a3021b490d4429cfcca330414ddb147bed7d29146c987d7d3` |
| `docs/features/establishment/README.md`                                                                       | `ed4519c6ed004c6b36510801181cd61482deab894d16519eeacd1b366fa8e1dd` |
| `docs/features/establishment/general-information/README.md`                                                   | `3f1369fbdd0a7a0f0485e63cc2fbacdb69cd60e39680faf7cd35bea91b1f636a` |
| `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`                                     | `8c7b4f0acea703c2f9d4e0dfeeeb31f25c5cbfe46180368cb6295a05ef2ac05c` |
| `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`                                | `0098fdc44742a01ff84ac11803cb4f41977b85d3be5cdb1bee8d278ef55743d6` |
| `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`                                            | `cb578f5a5e9bd75d65989a58e371bde78c04cc22ffcc95b99a80d97a7346de92` |
| `docs/ui/pages/establishment-general-information/README.md`                                                   | `0d616efdcc1e57ac93d8965c992855a21b7b84f18fa8b2440d53f464c4ecaadb` |
| `docs/ui/pages/establishment-general-information/UI_SPEC.md`                                                  | `b664ac795566cab0878d54c6333e42d953fb163c81948424eccc20b80c4979cf` |
| `packages/db-cloud/drizzle/meta/_journal.json`                                                                | `f4f314b6c4e551641ac505015832219ec3660966fda67f8e79429702b03da2fc` |
| `packages/db-cloud/src/restaurant-knowledge-repository.ts`                                                    | `9bb87c63c84f6cede86dcc86aeb4cd1e24cb961cb04b5244de41efe6f3102e68` |
| `packages/db-cloud/src/schema/restaurant-knowledge.ts`                                                        | `fa48a9d9aab36f51f8801c68f0f4e1a27d526538d66fd2297a666edc28beb431` |
| `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`                                  | `de843a7ba4c6750721d71585607179d846a6e3216c38d4ea4fbf3a3ccccdd92f` |
| `packages/db-cloud/test/schema.test.ts`                                                                       | `1ea929492c0deb6104adc7982090dc793df37b7e221b160b8aba7fb7575e5ed7` |

## Existing dirty-worktree attribution

The deterministic sorted UTF-8 LF-only `status|path|SHA-256` manifest for all
dirty files outside this change's OpenSpec and review directories remains:

- file count: `44`;
- aggregate SHA-256: `69f856d85ccae7d5fe247a3b4489b1a7cf6e50aa6c5522f1d39baeb4ed3e4c92`.

## Git status snapshot

Command: `git status --short --untracked-files=all`

The 53 entries below are the exact logical status captured before implementation
edits and exclude only the newly created byte-copy files under
`pre-apply-baseline/`, whose hashes are recorded above.

```text
 M apps/backoffice/next-env.d.ts
 M apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts
 M apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx
 M apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts
 M apps/backoffice/test/concept-history-action.test.ts
 M apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/manifest.json
 M apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/manifest.json
 M apps/backoffice/test/restaurant-knowledge-loader.test.ts
 M docs/MODULE_REGISTRY.md
 M docs/features/establishment/README.md
 M docs/features/establishment/general-information/README.md
 M docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md
 M docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md
 M docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md
 M docs/ui/pages/establishment-general-information/README.md
 M docs/ui/pages/establishment-general-information/UI_SPEC.md
 M packages/db-cloud/drizzle/meta/_journal.json
 M packages/db-cloud/src/restaurant-knowledge-repository.ts
 M packages/db-cloud/src/schema/restaurant-knowledge.ts
 M packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts
 M packages/db-cloud/test/schema.test.ts
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-fields.tsx
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/cuisine-know-how-model.ts
?? apps/backoffice/test/cuisine-know-how-action.test.ts
?? apps/backoffice/test/cuisine-know-how-fields.test.tsx
?? apps/backoffice/test/cuisine-know-how-form.test.tsx
?? apps/backoffice/test/cuisine-know-how-model.test.ts
?? docs/reviews/restaurant-knowledge-cuisine-know-how/01-analysis-review.md
?? docs/reviews/restaurant-knowledge-cuisine-know-how/02-specs-review.md
?? docs/reviews/restaurant-knowledge-cuisine-know-how/02b-design-review.md
?? docs/reviews/restaurant-knowledge-cuisine-know-how/03-final-review.md
?? docs/reviews/restaurant-knowledge-cuisine-know-how/03-implementation.diff
?? docs/reviews/restaurant-knowledge-cuisine-know-how/03-migration.diff
?? docs/reviews/restaurant-knowledge-cuisine-know-how/03-verify-evidence.md
?? docs/reviews/restaurant-knowledge-customer-experience/01-analysis-review.md
?? docs/reviews/restaurant-knowledge-customer-experience/02-specs-review.md
?? docs/reviews/restaurant-knowledge-customer-experience/02b-design-review.md
?? openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/.openspec.yaml
?? openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/analysis.md
?? openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/design.md
?? openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/proposal.md
?? openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/specs/restaurant-knowledge/cuisine-know-how/spec.md
?? openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/tasks.md
?? openspec/changes/restaurant-knowledge-customer-experience/.openspec.yaml
?? openspec/changes/restaurant-knowledge-customer-experience/analysis.md
?? openspec/changes/restaurant-knowledge-customer-experience/design.md
?? openspec/changes/restaurant-knowledge-customer-experience/proposal.md
?? openspec/changes/restaurant-knowledge-customer-experience/specs/restaurant-knowledge/customer-experience/spec.md
?? openspec/changes/restaurant-knowledge-customer-experience/tasks.md
?? openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md
?? packages/db-cloud/drizzle/0012_restaurant_knowledge_cuisine_know_how.sql
?? packages/db-cloud/drizzle/meta/0012_snapshot.json
```
