Change: restaurant-knowledge-concept-history
Gate: 3 — Final Implementation Review
Review status: APPROVED
Created: 2026-08-30T23:51:59.3372925+02:00
Schema: yuta-spec-driven
Sensitive change: YES — tenant-owned data, canonical ownership, migration and authorization enforcement
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-08-31T00:02:35.9708242+02:00
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Archive authorization: AUTHORIZED_BY_CURRENT_USER
Finish outcome: COMPLETED
Specs: synced and strictly validated `restaurant-knowledge/concept-history`
Main spec SHA-256: `93ece2037955b7b208f506cf7581a9adf45ffe9570783828e159a5fef2fc25c1`
Main spec validation: `openspec validate --specs --strict` — 3 passed, 0 failed
Archive location: `openspec/changes/archive/2026-08-31-restaurant-knowledge-concept-history`
Completed: 2026-08-31T00:03:53.7348468+02:00

# Gate 3 — Final Implementation Review

## Approved gate chain and artifact integrity

| Gate    | Packet                                           | Status     | Approved                            | Reviewed artifact hash                                                                                                                                   |
| ------- | ------------------------------------------------ | ---------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gate 1  | [`01-analysis-review.md`](01-analysis-review.md) | `APPROVED` | recorded in packet                  | packet `48a9a7584c69addae404c8385444cbfff58be19fd17ff8a823c3e5a58097551e`                                                                                |
| Gate 2  | [`02-specs-review.md`](02-specs-review.md)       | `APPROVED` | recorded in packet                  | packet `f70b7d440b8803fdf57c12eeb1211fdd4e1352e7066c2493b0c72411b253773f`; delta spec `6a9b186070a8b2d9b02072ca109f256fed188babd1817726438f02bf8bc9893b` |
| Gate 2b | [`02b-design-review.md`](02b-design-review.md)   | `APPROVED` | `2026-08-30T23:34:21.5560250+02:00` | packet `3a4483a6febcaa94fe3fbf3066fee8eb81657b468b3b7adfa52737841485be21`; design `89afc116d25482e91b40efc299bf32ac5168d960b3369abf62746b089a85b295`     |

Current planning artifact hashes after Apply:

| Artifact                                             | SHA-256                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `proposal.md`                                        | `071b1300029075719d69954f2fafe707173145d6e75a54c17251eb2c0be46ddc` |
| `analysis.md`                                        | `3e79cd9d7f8464edf9d5eda3d2c03da1f5716af024ab3717465df467afce7ea8` |
| `specs/restaurant-knowledge/concept-history/spec.md` | `6a9b186070a8b2d9b02072ca109f256fed188babd1817726438f02bf8bc9893b` |
| `design.md`                                          | `89afc116d25482e91b40efc299bf32ac5168d960b3369abf62746b089a85b295` |
| `tasks.md`                                           | `dec47e0a5dfcd68ae88ca91b7dd60a0c9fa26e69f6f999a39960de13c86d135c` |

Proposal, Analysis, delta Spec và Design giữ nguyên hashes đã được duyệt. Chỉ `tasks.md` được tạo/check-off trong Apply theo workflow.

## Implementation outcome

Implementation theo đúng approved Design:

- tạo bounded cloud table và repository riêng do Restaurant Knowledge sở hữu;
- scope mọi read/write bằng trusted `organizationId + establishmentId`, với composite primary key và composite foreign key tới establishment cùng organization;
- giữ missing row là valid `{ concept: null, history: null }` và dùng một upsert ghi cả Concept/Histoire;
- compose một form/action riêng trong page hiện hữu, không đưa fields hoặc permission vào Establishment Profile;
- dùng Restaurant Knowledge READ để load/view và MANAGE để edit/save;
- OWNER/MANAGER được view/edit/save, STAFF không load slice và direct save bị deny trước persistence;
- giữ draft trong browser, một explicit submit cho cả slice, không effect/timer/blur/background persistence;
- không tạo `@yuta/contracts` shared contract, API route, permission, role, validation business rule, runtime integration hoặc section Restaurant Knowledge khác.

Không phát hiện điều kiện phải quay lại review: không có shared-contract expansion, additional permission, tenancy-boundary change, canonical-ownership change hoặc cross-runtime behavior.

## tasks.md — 11/11 complete

Exact artifact: [`tasks.md`](../../../openspec/changes/archive/2026-08-31-restaurant-knowledge-concept-history/tasks.md)

```markdown
## 1. Persistence Restaurant Knowledge

- [x] 1.1 Thêm schema table riêng cho `restaurant_knowledge_concept_history` với composite organization/establishment scope, nullable Concept/Histoire và exports cần thiết; verify bằng db-cloud schema tests và typecheck.
- [x] 1.2 Generate và review forward Drizzle migration, xác nhận migration chỉ tạo bounded Restaurant Knowledge table/constraints và không sửa Establishment Profile schema.
- [x] 1.3 Thêm Restaurant Knowledge repository read/upsert nhận trusted `TenantContext`; verify zero-row empty state, Concept-only, Histoire-only, whole-slice save và organization/establishment isolation bằng guarded db-cloud integration tests.

## 2. Backoffice server boundary

- [x] 2.1 Tích hợp page loader với Restaurant Knowledge READ mà không thay đổi Establishment Profile route permission; verify OWNER/MANAGER load slice và STAFF không load/expose slice qua focused tests.
- [x] 2.2 Thêm route-local Zod parser và server action riêng require Restaurant Knowledge MANAGE, re-derive trusted tenant context và save cả slice; verify MANAGE success, READ-only/profile-only denial và không có shared contract/API mới.

## 3. Concept & histoire UI

- [x] 3.1 Thêm route-local form/section cho manual Concept/Histoire draft, independent optional values, valid empty state và một explicit save; verify component/model tests cho Concept-only, Histoire-only và both-empty states.
- [x] 3.2 Bảo đảm draft không autosave và read-only state không render save control; verify tests chỉ quan sát mutation khi explicit form submit và preserve existing profile form behavior.
- [x] 3.3 Chạy Backoffice focused tests và build để verify composed page, READ/MANAGE enforcement, OWNER/MANAGER behavior, STAFF denial, accessibility names và profile regressions.

## 4. Documentation và page pack

- [x] 4.1 Cập nhật current Restaurant Knowledge/Product Knowledge và stable `establishment-general-information` page pack theo as-built ownership, data boundary, permission mapping, explicit-save/no-autosave behavior và evidence; không promote Environment/Production Readiness/External Dependency.

## 5. Verification và Gate 3 evidence

- [x] 5.1 Chạy strict OpenSpec validation, migration/schema checks, db-cloud tests, tenant-isolation integration test khi database evidence khả dụng, Backoffice tests/build, docs/architecture checks, monorepo typecheck và format check; ghi truthful pass/skip/failure results.
- [x] 5.2 Đối chiếu toàn bộ 7 requirements/16 scenarios với code/tests, tạo deterministic full scoped implementation diff cùng migration diff và chuẩn bị Gate 3 packet với lifecycle/status changes; verify không có shared contract, permission, tenancy, ownership hoặc cross-runtime expansion.
```

`openspec instructions apply --change restaurant-knowledge-concept-history --json` reports `11/11`, `remaining: 0`, state `all_done`.

## Full implementation and migration diffs

- Full deterministic scoped implementation diff: [`03-implementation.diff`](03-implementation.diff), 8,984 lines, 346,494 bytes, SHA-256 `c5dc55b185e963dea4a150473641613d12aee3df26888e3a30e223d3214861ce`.
- Dedicated full migration diff: [`03-migration.diff`](03-migration.diff), 7,470 lines, 221,765 bytes, SHA-256 `b79a92ad201bbde24b0dca02ca216398a439915ab338d66b9b4dc688be408a66`.
- Implementation diff stat: 28 files changed, 8,507 insertions, 87 deletions. The generated Drizzle snapshot accounts for 7,427 inserted lines.

The scoped diff baseline was reconstructed as `HEAD +` the already-accepted `restaurant-knowledge-authorization` implementation diff, so prerequisite authorization/documentation hunks are not re-attributed to this change. Planning artifacts and Gate packets are intentionally outside the implementation diff.

## Migration, schema and repository evidence

- Migration `0011_restaurant_knowledge_concept_history.sql` creates only `restaurant_knowledge_concept_history` with nullable `concept` and `history`, composite `(organization_id, establishment_id)` primary key, and a composite foreign key to `(establishments.organization_id, establishments.id)`.
- There is no `ALTER establishments`, backfill, profile column, profile repository reuse, API, shared contract or destructive statement.
- `restaurant-knowledge.ts` is a dedicated schema source; `restaurant-knowledge-repository.ts` exposes bounded read/upsert operations receiving trusted `TenantContext`.
- Repository read predicates include both scope IDs. Upsert values and conflict target include both IDs; the composite foreign key rejects an organization/establishment mismatch.
- Schema tests assert exact columns, nullable Concept/Histoire, one composite primary key, one composite foreign key, and absence of Concept/Histoire from `establishments`.
- The full migration chain through 0011 applied successfully to disposable PostgreSQL 17.

## Tenant-isolation evidence

The guarded integration suite passed `3/3` against the disposable database:

- missing row returns the valid empty state;
- Concept-only, Histoire-only and both-empty values round-trip;
- two establishments in one organization and one establishment in another organization retain independent slices;
- mismatched organization + establishment read exposes no row;
- mismatched-scope write is rejected by the database and the original tenant row remains unchanged.

The temporary database used a uniquely named `--rm` container. It was stopped, removed and verified absent after the test.

## Authorization evidence

### READ/MANAGE separation

- The accepted authorization contract remains unchanged with two distinct typed operations and independent grants.
- The page loader checks exactly `restaurant-knowledge.read` before calling the repository.
- Editability is computed independently with `restaurant-knowledge.manage`.
- The server action re-derives authenticated tenant context and requires MANAGE before parsing or persistence.
- `establishment.profile.read/manage` are never used to authorize the knowledge loader or action.

### OWNER/MANAGER and STAFF

- OWNER: READ loader passes; MANAGE UI/action passes; whole slice saved once.
- MANAGER: READ loader passes; MANAGE UI/action passes; whole slice saved once.
- STAFF: existing Establishment Profile READ regression still passes, but knowledge loader returns `null`, repository is not called, save action throws permission denial before persistence, and no revalidation occurs.
- Existing prerequisite tests also prove public/service denial and no YUTA_ADMIN/YUTA_SUPPORT bypass; the full Backoffice suite passed with those tests unchanged.

## Requirement and scenario coverage — 7/7 requirements, 16/16 scenarios

| Requirement                                              | Scenario evidence                                                                                                                                                                                                                   |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Restaurant Knowledge owns establishment Concept/Histoire | Dedicated schema/repository/form/action plus schema test proving no profile fields; repository integration reads/writes only the current trusted scope. Covers view and save ownership scenarios.                                   |
| View requires READ                                       | Loader tests prove OWNER/MANAGER load and STAFF/profile-read does not load or call persistence. Covers allow and deny/no-inheritance scenarios.                                                                                     |
| Edit/save requires MANAGE                                | Action tests prove OWNER/MANAGER success, one repository call, and STAFF denial before persistence; accepted permission test keeps READ/MANAGE separate. Covers MANAGE allow, READ-only denial and profile-MANAGE non-substitution. |
| Concept/Histoire independently optional                  | Model, fields and database tests cover both-empty, Concept-only and Histoire-only states. Covers all three scenarios.                                                                                                               |
| Manual independent editing                               | Draft-model tests prove Concept updates preserve Histoire and Histoire updates preserve Concept; nullable form/repository model accepts either empty. Covers all three scenarios.                                                   |
| One explicit save for whole slice                        | One form contains exactly one submit control; action receives both fields and makes exactly one whole-slice repository call; integration read-back proves persistence. Covers save and subsequent view scenarios.                   |
| No autosave                                              | Form test proves action is not called on render; implementation has no effect, timer, blur or background mutation, and persistence is reachable only from the form action. Covers the unsaved-change scenario.                      |

## UI and page behavior evidence

- Existing `Informations générales` profile remains the first independent form.
- A separate full-width `Restaurant Knowledge / Concept & histoire` card renders only with READ.
- Both accessible labels are present and both textareas are marked optional.
- MANAGE users receive editable local drafts and one `Enregistrer le concept et l’histoire` submit control.
- Without MANAGE, both controls are disabled, a read-only notice is rendered and no save control exists.
- Production build includes `/etablissement/informations-generales` as a dynamic server-rendered route.
- Authenticated browser/device QA was not run because no live user/session/tenant fixture was authorized. Component/server tests, disposable-DB integration and production build are the truthful UI/page evidence; no visual-parity claim is made.

## Establishment Profile regression evidence

- Profile route entry still requires `establishment.profile.read` and profile editability still uses `establishment.profile.manage`.
- Existing profile form/action, schema and repository were not merged with Restaurant Knowledge.
- Focused regression passed `establishment-profile-permissions`, `general-information-model` and `public-information-section` tests.
- STAFF profile-read behavior remains passing while Restaurant Knowledge is absent.
- Full Backoffice suite passed: 62 files passed, 1 skipped, 233 tests passed.

## Documentation and page-pack changes

- `docs/features/establishment/README.md`: records the implemented bounded slice, dedicated owner/repository and remaining unimplemented knowledge families.
- `docs/features/establishment/general-information/README.md`: records as-built storage, permission and explicit-save/no-autosave behavior.
- `docs/MODULE_REGISTRY.md`: promotes Restaurant Knowledge content Implementation only from `NOT_STARTED` to `PARTIAL` with concrete evidence.
- Stable `establishment-general-information` page pack was updated in place across README, Product Scope, Data/Interaction Spec, UI Spec and Acceptance Checklist; no replacement pack was created.
- `pnpm docs:check` passed for 36 current documents.
- `pnpm ui:pack:check establishment-general-information` passed with six preserved unresolved historical prompt-provenance warnings and one preserved legacy-lifecycle warning.

## Lifecycle and status changes

Restaurant Knowledge content lifecycle now records:

- Product Decision: remains `APPROVED`;
- Implementation: `NOT_STARTED` → `PARTIAL` for the implemented Concept/Histoire slice;
- Environment: remains `NOT_ENABLED`;
- Production Readiness: remains `NOT_ASSESSED`;
- External Dependency: remains `NOT_ASSESSED`;
- Review Marker: `OK` for Concept/Histoire; every other knowledge family and excluded integration remains unimplemented.

No environment, deployment, production-readiness, external-dependency, sync or archive promotion occurred. The page pack retains its legacy lifecycle metadata warning; this bounded capability change does not claim visual delivery evidence sufficient to migrate the entire existing-page package lifecycle.

## Exact commands and truthful results

Canonical command-by-command record: [`03-verify-evidence.txt`](03-verify-evidence.txt), SHA-256 `9c6f566956b0232d454b5a96047684ed08f0a718cb54d7e48ceff748d7070071`.

Key results:

- disposable PostgreSQL migration: PASS;
- repository tenant integration: `1` file, `3/3` tests PASS;
- focused authorization/domain/UI/profile regression: `9` files, `46/46` tests PASS;
- db-cloud ordinary suite: `4` files and `12` tests PASS; `14` guarded files/`44` tests SKIP without opt-in, while the new guarded suite separately passed with opt-in;
- full Backoffice: `62` files, `233` tests PASS; `1` file SKIP;
- full cloud test command: PASS across auth/core/contracts/booking/booking-web/tenant/db-cloud/Backoffice;
- Backoffice production build: PASS;
- workspace typecheck: PASS for all 15 selected projects with a typecheck script;
- docs check, architecture check, strict OpenSpec validation and scoped diff check: PASS;
- page-pack check: PASS with 7 preserved warnings described above;
- targeted formatting for every attributed file: PASS;
- repository-wide `pnpm format:check`: FAIL on 54 unrelated pre-existing files; no attributed file is in that list. This baseline failure is not reported as a pass and no unrelated formatting was changed.

## Verification assessment

`PASS` for Gate 3 review:

- completeness: 11/11 tasks;
- correctness: 7/7 requirements and 16/16 scenarios covered;
- coherence: implementation matches the approved Design;
- critical issues: 0;
- warnings attributable to this change: 0;
- suggestions: 0.

## Completion record

Gate 3 was explicitly approved with sync/archive authorization. The reviewed
Concept & histoire delta was promoted to
`openspec/specs/restaurant-knowledge/concept-history/spec.md`, strict main-spec
validation passed `3/3`, and the change was archived at the recorded path.

The separate `authorization/restaurant-knowledge` normative capability kept
its pre-sync SHA-256 unchanged. Sync/archive made no Product Knowledge, Module
Registry, Environment, Production Readiness, External Dependency or other
lifecycle change.
