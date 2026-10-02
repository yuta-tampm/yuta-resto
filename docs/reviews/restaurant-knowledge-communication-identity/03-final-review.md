# Gate 3 — Final Review

Change: `restaurant-knowledge-communication-identity`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-02T20:55:52.4277210+02:00`

Approved review packet SHA-256:
`2403370d2ea805c3351492e70683d43a1dbe43981366052bef547425da6bcef4`

Sync authorization: `AUTHORIZED_BY_CURRENT_USER`

Finish outcome: `COMPLETED`

Workflow status: `DONE`

`RELEASE_FOLLOW_UP: NOT_REQUIRED`

Finish completed through archive:
`2026-09-02T21:02:09.0088941+02:00`

## Gate result

- `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`
- `VERIFY: PASS`
- `QA: PASS`
- deterministic attribution and protected-file verification: `PASS`
- remaining `CONFLICT`: `NONE`
- remaining `NEEDS REVIEW`: `NONE`

All `29/29` approved implementation-plan tasks and all five Technical
Implementation Contracts are complete. The current user approved Gate 3 and
explicitly authorized spec sync and archive for this exact reviewed packet.
This approval does not authorize deployment, lifecycle promotion or automatic
Knowledge Consolidation edits.

## Planning and Gate hashes

| Artifact                      | SHA-256                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `proposal.md`                 | `a58e71eef2dbce764191dc0250cc812e00123fcb31fc2b7c98b5016db0e2d6c4` |
| `analysis.md`                 | `6203a25f11b83f80af89ec5f20cfa4d98df23659ff1b82f9c8c86a17f4fa35fb` |
| delta `spec.md`               | `a6b0d54a741ad8ac17c668c0fe3f8f8b8927fc9e7e1747e760e91b1131db408f` |
| `design.md`                   | `2d10088d01fd4102a1e16e4eb81e33f024d921601691574b0dc59c5a85626169` |
| approved pre-Apply `tasks.md` | `12d2dcb328d11ae146a4adc2b320a547551a1d66d8b9273deb4c8c3ca8dc67fa` |
| completed `tasks.md`          | `f190145165616bd15d3d4341ddc246327d6dc1541f91ede2d62157e57ce6fd11` |
| Gate 1 review                 | `c5f134ea2904d639595a4eafea31ec2a1c087e93be4238bea62e7417b5d56b96` |
| Gate 2 review                 | `5e86c03b56e03dd63628d0ff4a1483a2f6e822c61563e2a2515ff4005fa013ea` |
| Sensitive Design Gate review  | `511a3c3c65bc9525f6a4b7fff4326d4c29e773a93a55733fd227d08f286a685b` |

Proposal, Analysis, delta Spec, Design and all three approved planning/Gate
packet hashes match the saved pre-Apply record. `tasks.md` changed only for
explicit Apply authorization, task completion and the workflow checkpoint.

## Pre-Apply attribution and protected state

- captured HEAD: `01e6ca74186f5cda389f5ca8c0700274b29d18d0`;
- pre-Apply manifest:
  `docs/reviews/restaurant-knowledge-communication-identity/03-pre-apply-manifest.md`;
- pre-Apply manifest SHA-256:
  `026514bf933ccb8e96fa750cf7e6f3ed6da1a4168db5a3112bfed4d66cdb5a39`;
- all 14 shared baseline files reproduce their saved bytes/hashes;
- all seven anticipated implementation/test paths and both generated migration
  artifacts were missing before Apply;
- all 148 protected existing dirty files: `0` missing, `0` hash mismatch;
- generated `apps/backoffice/next-env.d.ts` was restored after each production
  build to its exact pre-Apply SHA-256
  `83a6738771334a63124c8acf38250eccd39fd0aba62846bb0815d952a7936205`.

## Technical evidence

- Technical Compliance Matrix and detailed 16-requirement/45-scenario mapping:
  `docs/reviews/restaurant-knowledge-communication-identity/03-verify-evidence.md`;
- VERIFY evidence SHA-256:
  `ec692bcbd0b5442ff89f3180f8754cff96143d9f9e735866598fbd592d95ccf7`;
- guarded full migration chain: `PASS`;
- exact live five-column schema, composite PK/FK and `ON DELETE RESTRICT`:
  `PASS`;
- repository integration: 11/11 passed;
- schema integration: 3/3 passed;
- focused authorization/action/model/fields/form/loader suite: 43/43 passed;
- post-QA-fix directly affected focused suite: 35/35 passed;
- full db-cloud suite: 16 passed, 52 guarded tests skipped;
- full Backoffice suite after the Browser QA fix: 320/320 passed, one file
  skipped by its existing guard;
- recursive workspace typecheck: all 15 participating projects passed;
- Backoffice production build after the Browser QA fix: `PASS`;
- `pnpm docs:check`: `PASS` (36 current documents);
- `pnpm architecture:check`: `PASS`;
- strict change validation: `PASS`;
- scoped attributable/workflow Prettier checks: `PASS`;
- repository-wide format check remains blocked only by 63 protected pre-existing
  files outside this change; no attributable file is listed;
- no Backoffice lint script exists, so no lint command/result is invented.

## Requirement-to-code and test mapping

| Approved requirement group                                                                             | Implementation                                              | Evidence                                                               |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| Restaurant Knowledge ownership and establishment scope                                                 | dedicated schema, migration and tenant-scoped repository    | schema 12/12, live PK/FK inspection, repository integration 11/11      |
| Exactly three independently optional values and valid all-empty state                                  | exact projection, page-local model/fields and atomic upsert | model/form tests plus real all-empty/populated Browser QA              |
| READ view; MANAGE edit/save; OWNER/MANAGER; STAFF denial; Profile/Marketing non-substitution           | READ-first loader and MANAGE-first server action            | focused authorization/action tests and real OWNER/MANAGER/no-access QA |
| Manual input, one whole-slice save and no autosave                                                     | controlled local draft, one form/action/upsert              | interaction tests plus explicit-save/reload Browser QA                 |
| Canonical dirty semantics                                                                              | empty-only canonical comparison and returned saved baseline | four focused canonical cases plus real pristine/dirty/reload states    |
| No Profile, Marketing, Reviews, AI, Social/public, provider, CRM or legal relationship                 | no imports, APIs, FK, events, jobs or consumer hooks        | deterministic added-line/source scans and Technical Compliance Matrix  |
| No POS, Site Agent or Display relationship                                                             | cloud-only page-local implementation                        | architecture check and deterministic dependency scans                  |
| No required content, limits, format, enum, taxonomy, presets, score, moderation, AI or shared contract | exact nullable text model and constructed boundary parser   | schema/model/action tests and source scans                             |

All 16 approved requirements and 45 scenarios are individually mapped in
`03-verify-evidence.md`. Browser QA does not substitute for server authorization,
tenant-isolation or persistence evidence.

## Implementation diff

`03-implementation.diff` contains exactly 20 attributable non-migration paths
and 20 `diff --git` sections: 13 saved-baseline-to-current shared-file diffs and
seven proper `/dev/null -> current` new-file diffs.

Exact globally sorted inventory:

1. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-fields.tsx`
2. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx`
3. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`
4. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/communication-identity-model.ts`
5. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`
6. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`
7. `apps/backoffice/test/communication-identity-action.test.ts`
8. `apps/backoffice/test/communication-identity-fields.test.tsx`
9. `apps/backoffice/test/communication-identity-form.test.tsx`
10. `apps/backoffice/test/communication-identity-model.test.ts`
11. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`
12. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`
13. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
14. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
15. `docs/ui/pages/establishment-general-information/README.md`
16. `docs/ui/pages/establishment-general-information/UI_SPEC.md`
17. `packages/db-cloud/src/restaurant-knowledge-repository.ts`
18. `packages/db-cloud/src/schema/restaurant-knowledge.ts`
19. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`
20. `packages/db-cloud/test/schema.test.ts`

Exact SHA-256:
`d8fb9be29b2e072768db75d37fc92b545deca9d7702677fc3099ebb51708adb4`.

Apply-check/apply/current-byte comparison:
`0 / 0 / 0 mismatches`. Reverse-check/reverse/baseline comparison/new-file
removal: `0 / 0 / 0 mismatches / 0 remaining`.

## Migration diff

`03-migration.diff` contains exactly three attributable paths and three
`diff --git` sections:

1. `packages/db-cloud/drizzle/0015_restaurant_knowledge_communication_identity.sql`
2. `packages/db-cloud/drizzle/meta/0015_snapshot.json`
3. `packages/db-cloud/drizzle/meta/_journal.json`

SQL and snapshot are proper new-file diffs; journal is the exact saved-baseline-
to-current diff. Exact SHA-256:
`3ae21ff7313ac21222d969e3e71345edb8e54874ca69a75e51b8d97ddfeddd15`.

Apply-check/apply/current-byte comparison:
`0 / 0 / 0 mismatches`. Reverse-check/reverse/journal-baseline comparison/new-
file removal: `0 / 0 / MATCH / 0 remaining`.

The SQL remains additive and matches the approved Design: one dedicated table,
exactly five columns, composite establishment PK/FK, `ON DELETE RESTRICT`, and
no backfill, alteration, destructive operation or extra lifecycle field.

## Real Browser QA

- QA report: `docs/reviews/restaurant-knowledge-communication-identity/qa/QA_REPORT.md`;
- QA report SHA-256:
  `9b24124a72d7ad326d977aeafd3e27744e33facc14ee9627712ec32f73cf9705`;
- screenshot manifest:
  `docs/reviews/restaurant-knowledge-communication-identity/qa/screenshot-manifest.md`;
- screenshot manifest SHA-256:
  `9fe36e1e7f28f87ee7ba10ae212bcbff0961eb0dae5aa31685d2d5f78b64989a`.

Exact screenshot hashes:

| Screenshot                                   | SHA-256                                                            |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `manager-editable-dirty-768x1024.png`        | `016ca49f6a3473cb28941f15217f45ad2f40c8b1d0d7f19c4a4fba05177fa441` |
| `no-establishment-no-access-390x844.png`     | `5680dfc02cb9bf030958dedd26465980a05856e5b9b400309b6f58ecb841c4f9` |
| `no-restaurant-knowledge-access-390x844.png` | `d7bb2db5d14048bf29b2227899d39b3ee45d9abda9269fe2f3d5b796fa8f9497` |
| `owner-all-empty-1024x768.png`               | `eb155360cd223a0c8753718c9676ec41c39d3d3e900d398bd141c4b4422745da` |
| `owner-all-empty-section-1024x768.png`       | `5dd2f0f950d104758babd5e0ce1f99c8bf35d23005d9fa832e5db326cac15f31` |
| `owner-dirty-focus-390x844.png`              | `5f28f03dfe10f79531fedfa885103006a612a2dd9b452386818b326372afeefa` |
| `owner-populated-saved-1440x900.png`         | `8b410696d7ba4e51a21833c70e1a76321e8a7cdb29fdaa672db38f2823b45139` |
| `owner-success-status-1440x900.png`          | `d49f5be534561e10aff3939d3faaf6aca4e77328207d20b256e040aea2838ee4` |

Mandatory OWNER, MANAGER, safe existing no-access, populated, all-empty, dirty,
save, reload, no-autosave, accessibility, six-section regression and
1440/1024/768/390 responsive scenarios all passed. Conditional READ-without-
MANAGE, induced persistence failure and a stable pending capture are truthfully
recorded as `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`; their approved
focused automated evidence passed.

## Post-VERIFY correction

Browser QA found that the Communication Identity form's server-value-derived
React key remounted the form after revalidation and removed the success message
before it remained observable. The page-local key was removed. This does not
change Product scope, Spec, Design, persistence or authorization; canonical
dirty-state correctness continues to use the action's returned saved projection.

Focused tests, typecheck, full Backoffice tests, production build and the real
success/save/reload scenarios all passed after the correction. The regenerated
implementation diff and its apply/reverse checks cover the corrected current
bytes. No other implementation deviation was found.

## Lifecycle preservation

- Product Decision: `APPROVED`
- Implementation: `PARTIAL`
- Environment: `NOT_ENABLED`
- Production Readiness: `NOT_ASSESSED`
- External Dependency: `NOT_ASSESSED`

Apply/VERIFY/QA does not promote any lifecycle dimension. The local migration
used for QA is not an environment enablement or deployment.

Product Knowledge, Module Registry, Establishment feature knowledge and the
review index remained read-only during Apply and finish. The required
post-archive Knowledge Consolidation scan classified the current knowledge as
`UPDATE_REQUIRED`. The current user separately approved the exact Knowledge
Review payload, and its `22/22` replacements were subsequently applied and
verified without lifecycle promotion.

## Sync, validation and archive result

- Gate 3: `APPROVED`;
- sync authorization: `AUTHORIZED_BY_CURRENT_USER`;
- normative spec:
  `openspec/specs/restaurant-knowledge/communication-identity/spec.md`;
- normative spec SHA-256:
  `156e0e05aa4a3b72145ffad5c3dc38ae5a73213a1744d679777850ace4cd7323`;
- normalized delta-to-main content comparison: `MATCH`;
- strict main-spec validation: `PASS` (`7` passed, `0` failed);
- archived change:
  `openspec/changes/archive/2026-09-02-restaurant-knowledge-communication-identity`;
- release follow-up: `NOT_REQUIRED` for this repository-only finish; no deploy,
  environment enablement or readiness promotion was authorized or performed;
- Knowledge Consolidation: `UPDATE_REQUIRED`;
- Knowledge Review packet:
  `docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md`;
- Knowledge Review packet SHA-256:
  `258c4405bff05a27a87d631b5fbd42f50148485c8ca72a60e7a1ce2b1cf49c0e`;
- Knowledge Review status: `APPROVED`;
- exact knowledge replacements: `22/22`;
- restricted diff and reverse integrity: `PASS`;
- post-apply `pnpm docs:check`: `PASS`;
- post-apply `pnpm architecture:check`: `PASS`;
- unrelated dirty-file drift: `NONE`.

## Current workflow stop

Gate 3 approval, authorized spec sync, strict main-spec validation, archive and
the separately approved exact Knowledge Consolidation update are complete. The
repository workflow status is `DONE`. No commit, push, deploy, environment
enablement, readiness promotion or lifecycle promotion occurred.
