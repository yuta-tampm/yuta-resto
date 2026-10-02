Change: restaurant-knowledge-authorization
Gate: 3 — Final Implementation Review
Review status: APPROVED
Created: 2026-08-30T21:59:07.3965970+02:00
Regenerated: 2026-08-30T22:16:46.6362105+02:00
Schema: yuta-spec-driven
Sensitive change: YES — authorization/security and CROSS_MODULE durable boundary
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Changes requested: 2026-08-30 — correct stale Restaurant Knowledge Product Knowledge and regenerate Gate 3 evidence.
Correction status: COMPLETED — returned to human review with regenerated diff and verification evidence.
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-08-30T22:40:54.7761203+02:00
Finish outcome: COMPLETED
Specs: synced and strictly validated `authorization/restaurant-knowledge`
Main spec SHA-256: `f924222ae59f13937da91c5272a26a6050e16dbe3b2ee994b823297d5e393322`
Main spec validation: `openspec validate --specs --strict` — 2 passed, 0 failed
Archive location: `openspec/changes/archive/2026-08-30-restaurant-knowledge-authorization`
Completed: 2026-08-30T22:42:31.9153308+02:00

# Gate 3 — Final Implementation Review

## Approved gate chain and artifact integrity

| Gate    | Packet                                           | Status     | Approved                            | Reviewed artifact hashes                                                                                                                                 |
| ------- | ------------------------------------------------ | ---------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gate 1  | [`01-analysis-review.md`](01-analysis-review.md) | `APPROVED` | `2026-08-30T21:32:31.3037141+02:00` | proposal `356b47691970101a0e760da13d559895d24d7347cb177cdbd97c86c32259d3fe`; analysis `88a4bf5b6ba44ca4be4fe631d04d49b867b6685f8c689a3c6e0ccb6c9c3cf6ff` |
| Gate 2  | [`02-specs-review.md`](02-specs-review.md)       | `APPROVED` | `2026-08-30T21:41:05.8311656+02:00` | delta spec `41ccb74dffcd56f5c23760a4bb11efbbf4363697feb1651980c27ef5134c67e0`                                                                            |
| Gate 2b | [`02b-design-review.md`](02b-design-review.md)   | `APPROVED` | `2026-08-30T21:52:12.3699282+02:00` | design `0acf4049546b8eb8df144fdd4b8bad8d499b20f6cd9381faf329820b134cfcf2`                                                                                |

Current planning artifact hashes were recomputed after Apply:

| Artifact                                           | SHA-256                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `proposal.md`                                      | `356b47691970101a0e760da13d559895d24d7347cb177cdbd97c86c32259d3fe` |
| `analysis.md`                                      | `88a4bf5b6ba44ca4be4fe631d04d49b867b6685f8c689a3c6e0ccb6c9c3cf6ff` |
| `specs/authorization/restaurant-knowledge/spec.md` | `41ccb74dffcd56f5c23760a4bb11efbbf4363697feb1651980c27ef5134c67e0` |
| `design.md`                                        | `0acf4049546b8eb8df144fdd4b8bad8d499b20f6cd9381faf329820b134cfcf2` |
| `tasks.md`                                         | `d4b5d3d69523fbe7c3cec221be2aecc1f6979a7bfd3556e9519bf46fa1925219` |

The approved proposal, analysis, delta spec, and design hashes remain intact.

## Design and implementation summary

Implementation follows the approved Design without deviation:

- added the separate typed operations `restaurant-knowledge.read` and `restaurant-knowledge.manage` to the existing Backoffice shared permission module;
- added two independent grant-map entries, both limited to `OWNER` and `MANAGER`;
- added `hasRestaurantKnowledgePermission` and fail-closed `requireRestaurantKnowledgePermission` using the existing `TenantError` / `CROSS_TENANT_ACCESS_DENIED` / HTTP 403 behavior;
- retained `TenantContext` as the only guard input and did not add a session wrapper, route, API, persistence, schema, UI, package, framework, role, principal, entitlement, or tenancy behavior;
- added focused executable evidence for operation separation, grants, denials, no profile inheritance, non-user denial, and system-role no-bypass;
- updated current authority documentation with the approved Concept/Histoire ownership, scope, and initial behavior without promoting Restaurant Knowledge content lifecycle state or selecting technical storage design.

No database, data, API, runtime, or deployment migration exists. Rollback is the bounded removal of the new type/map/guards/test and documentation updates before dependent callers consume them.

## tasks.md — 8/8 complete

Exact artifact: [`tasks.md`](../../../openspec/changes/restaurant-knowledge-authorization/tasks.md)

```markdown
## 1. Shared Authorization Implementation

- [x] 1.1 Thêm typed `restaurant-knowledge.read` và `restaurant-knowledge.manage` permissions, hai grant-map entries độc lập cho `OWNER`/`MANAGER`, cùng fail-closed `has`/`require` guards trong existing Backoffice permission module; verify bằng Backoffice typecheck và focused permission test.
- [x] 1.2 Tạo focused Restaurant Knowledge authorization tests chứng minh READ/MANAGE được đánh giá riêng, `OWNER`/`MANAGER` được allow, `STAFF` bị deny, public/service actors bị deny, Establishment Profile permission không được inherit và `YUTA_ADMIN`/`YUTA_SUPPORT` không bypass membership-role grants; verify focused test passes.

## 2. Current Authority Documentation

- [x] 2.1 Cập nhật current Identity / Access và Restaurant Knowledge Product Knowledge để ghi nhận semantic/authorization ownership split, READ/MANAGE grant matrix, STAFF denial, no-profile-inheritance và no-system-role-bypass; verify `pnpm docs:check` passes.
- [x] 2.2 Cập nhật Module Registry review marker/evidence tối thiểu để phản ánh authorization prerequisite mà không promote Restaurant Knowledge content implementation, environment, readiness hoặc external-dependency lifecycle values; verify scoped documentation diff preserves unrelated lifecycle values.

## 3. Verification and Regression

- [x] 3.1 Chạy focused Backoffice authorization tests và existing Establishment Profile, Personnel, Access Audit permission regressions; verify all exact test commands exit 0.
- [x] 3.2 Chạy relevant tenant/auth tests cho trusted active membership, cross-scope denial và no restaurant access without membership; verify all exact test commands exit 0.
- [x] 3.3 Chạy strict OpenSpec validation, targeted formatting, `git diff --check`, `pnpm docs:check`, `pnpm architecture:check`, Backoffice typecheck/test và workspace typecheck; verify every required command result is recorded truthfully.
- [x] 3.4 Chạy generated OpenSpec verify workflow, reconcile every requirement/scenario với code/tests/docs, và chỉ mark complete khi verification assessment passes without spec/design deviation.
```

## Requirement and scenario evidence

| Spec requirement                                                                         | Implementation and executable evidence                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| READ and MANAGE are independent logical operations; no Establishment Profile inheritance | Separate union literals and map keys in `apps/backoffice/src/server/auth/permissions.ts:26-29,67-74`; exact-operation and profile-non-inheritance tests in `apps/backoffice/test/restaurant-knowledge-permissions.test.ts:54-78`.                                                                                                                                                                                                   |
| READ grants only OWNER and MANAGER                                                       | Independent READ map entry at `permissions.ts:71`; OWNER/MANAGER allow test at `restaurant-knowledge-permissions.test.ts:39-52`; STAFF denial at lines 62-78.                                                                                                                                                                                                                                                                       |
| MANAGE grants only OWNER and MANAGER                                                     | Independent MANAGE map entry at `permissions.ts:72`; the same parameterized test calls the exact MANAGE operation independently; STAFF denial exercises MANAGE separately.                                                                                                                                                                                                                                                          |
| Trusted tenant enforcement and fail closed                                               | Guards accept only `TenantContext` and require a user membership role at `permissions.ts:150-172`; tenant tests cover cross-establishment denial, public/service actors, trusted route selection, missing membership, and suspended tenant/membership behavior. The unchanged auth-selection integration file contains active-membership/no-membership DB scenarios but was skipped because its explicit DB opt-in was unavailable. |
| YUTA_ADMIN/YUTA_SUPPORT do not bypass                                                    | Guard reads only `TenantContext.actor.role`, never `systemRole`; focused parameterized test at `restaurant-knowledge-permissions.test.ts:93-116` proves both system roles cannot expand a STAFF membership grant. Upstream tenant resolution still requires a matching active membership.                                                                                                                                           |
| Existing authorization contracts remain unchanged                                        | Restaurant Knowledge uses a new union/map/guard and does not edit existing mappings; focused regression run covers Establishment Profile, Personnel, and Access Audit, while the full Backoffice suite reports 215 passed tests. The union contains only READ/MANAGE, so STAFF expansion, section access, and additional tiers are not inferred.                                                                                    |

Coverage assessment: all `6/6` requirements and `16/16` scenarios are covered by the code, focused tests, existing trusted-tenant tests, or the unchanged upstream enforcement boundary. No requirement or scenario was weakened.

## Gate 3 documentation correction

The requested Product Knowledge correction is complete:

- Restaurant Knowledge is now explicitly the canonical owner of Concept and Histoire and of their persistence/domain boundary;
- Establishment Profile explicitly owns neither datum;
- the knowledge is semantically establishment-scoped, while Organization remains the tenancy/access envelope rather than semantic owner;
- Concept and Histoire are independent and optional, and an empty initial state is valid;
- the initial behavior explicitly permits manual input, view, and edit for each value, followed by one explicit save for the complete slice, with no autosave;
- concrete schema, repository/table, API, field validation, and storage implementation remain `NEEDS REVIEW` and were not invented.

The correction changes Product Knowledge accuracy only. It does not implement or resume `restaurant-knowledge-concept-history`.

## Required authorization evidence

### READ/MANAGE separation

- two distinct exported typed values;
- two independent grant-map entries;
- every focused matrix loop calls the requested literal separately;
- an explicit test asserts the two operation values remain separate;
- no READ-implies-MANAGE or MANAGE-implies-READ branch exists.

### OWNER/MANAGER grants and STAFF denial

- `OWNER`: READ allowed; MANAGE allowed;
- `MANAGER`: READ allowed; MANAGE allowed;
- `STAFF`: READ denied; MANAGE denied;
- both boolean `has` behavior and throwing `require` behavior are exercised.

### No Establishment Profile inheritance

The focused test first proves the same STAFF context has `establishment.profile.read`, then proves it is denied both Restaurant Knowledge operations. Restaurant Knowledge values are not members of `EstablishmentPermission` and use a dedicated grant map.

### YUTA_ADMIN/YUTA_SUPPORT no-bypass

The guard has no system-role input. Focused tests overlay each system role on a valid STAFF membership context and prove both operations still deny. The existing tenant boundary prevents any Restaurant Knowledge permission check from creating access when no active matching membership resolves.

## Tests and checks actually executed

Canonical verify evidence: [`03-verify-evidence.txt`](03-verify-evidence.txt)

SHA-256 of the exact UTF-8 bytes of that evidence block: `e6564b1e49877887effc5fbd10ac62d57c9b24efd74f6823a161bcce8a6dd895`

```text
Verification assessment source: generated openspec-verify-change workflow applied to proposal.md, analysis.md, specs/authorization/restaurant-knowledge/spec.md, design.md, and tasks.md.
Assessment: PASS; completeness 8/8 tasks and 6/6 requirements; correctness 6/6 requirements and 16/16 scenarios covered by code, focused tests, existing tenant/auth tests, and current authority documentation; coherence follows approved Design with 0 critical issues, 0 warnings, and 0 suggestions.
Command: pnpm --filter @yuta/backoffice test -- test/restaurant-knowledge-permissions.test.ts; Result: exit 0; Vitest ran the Backoffice suite because the script forwarded an extra --, with 57 passed files, 1 skipped file, and 215 passed tests.
Command: pnpm --filter @yuta/backoffice typecheck; Result: exit 0; tsc --noEmit produced no diagnostics.
Command: pnpm --filter @yuta/backoffice exec vitest run test/restaurant-knowledge-permissions.test.ts test/establishment-profile-permissions.test.ts test/personnel-permissions.test.ts test/access-audit-permissions.test.ts; Result: exit 0; 4 passed files and 18 passed tests.
Command: pnpm --filter @yuta/tenant exec vitest run test/tenant.test.ts; Result: exit 0; 1 passed file and 4 passed tests.
Command: pnpm --filter @yuta/tenant exec vitest run test/foundation.test.ts; Result: exit 0; 1 passed file and 7 passed tests.
Command: pnpm --filter @yuta/db-cloud exec vitest run test/auth-selection.integration.test.ts; Result: exit 0; 1 skipped file and 3 skipped tests because CLOUD_DATABASE_URL plus YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true were not available; this is recorded as skipped, not passing runtime database evidence.
Command: openspec validate restaurant-knowledge-authorization --strict; Result: exit 0; Change 'restaurant-knowledge-authorization' is valid.
Command: pnpm exec prettier --check apps/backoffice/src/server/auth/permissions.ts apps/backoffice/test/restaurant-knowledge-permissions.test.ts docs/features/identity-access/README.md docs/features/establishment/README.md docs/features/establishment/general-information/README.md docs/MODULE_REGISTRY.md openspec/changes/restaurant-knowledge-authorization; Result: exit 0; all matched files use Prettier code style.
Command: git diff --check -- apps/backoffice/src/server/auth/permissions.ts docs/features/identity-access/README.md docs/features/establishment/README.md docs/features/establishment/general-information/README.md docs/MODULE_REGISTRY.md; Result: exit 0; no whitespace errors; Git emitted only LF-to-CRLF working-copy notices.
Command: pnpm docs:check; Result: exit 0; Documentation consistency check passed for 36 current documents.
Command: pnpm architecture:check; Result: exit 0; runtime imports, database URLs, client boundaries, and migration baselines are valid.
Command: pnpm --filter @yuta/backoffice typecheck; pnpm --filter @yuta/backoffice test; Result: exit 0; typecheck produced no diagnostics, then 57 passed files, 1 skipped file, and 215 passed tests.
Command: pnpm -r --if-present typecheck; Result: exit 0; 15 of 16 workspace projects selected and every present typecheck completed successfully.
Command: openspec instructions apply --change restaurant-knowledge-authorization --json; Result: exit 0; progress 8/8, state all_done.
Builds: not run; this authorization-only server guard change has no new route, API, UI, persistence, runtime integration, or build-specific behavior, and typecheck plus full Backoffice tests were the proportional validation selected by the approved tasks.
Gate 3 correction source: human review required current Restaurant Knowledge Product Knowledge to record the approved canonical Concept/Histoire owner, persistence/domain ownership, establishment semantic scope, Organization tenancy/access envelope, optionality, valid empty state, manual input/view/edit, one explicit save, and no autosave while leaving technical schema/repository/table/API/validation/storage details unresolved.
Correction command: pnpm exec prettier --write docs/features/establishment/README.md docs/features/establishment/general-information/README.md docs/MODULE_REGISTRY.md; Result: exit 0; all three corrected documents were formatted.
Correction command: pnpm exec prettier --check apps/backoffice/src/server/auth/permissions.ts apps/backoffice/test/restaurant-knowledge-permissions.test.ts docs/features/identity-access/README.md docs/features/establishment/README.md docs/features/establishment/general-information/README.md docs/MODULE_REGISTRY.md openspec/changes/restaurant-knowledge-authorization; Result: exit 0; all matched files use Prettier code style.
Correction command: pnpm docs:check; Result: exit 0; Documentation consistency check passed for 36 current documents.
Correction command: pnpm architecture:check; Result: exit 0; runtime imports, database URLs, client boundaries, and migration baselines are valid.
Correction command: openspec validate restaurant-knowledge-authorization --strict; Result: exit 0; Change 'restaurant-knowledge-authorization' is valid.
Correction command: git diff --check -- apps/backoffice/src/server/auth/permissions.ts docs/features/identity-access/README.md docs/features/establishment/README.md docs/features/establishment/general-information/README.md docs/MODULE_REGISTRY.md; Result: exit 0; no whitespace errors; Git emitted only LF-to-CRLF working-copy notices.
Correction command: pnpm --filter @yuta/backoffice exec vitest run test/restaurant-knowledge-permissions.test.ts test/establishment-profile-permissions.test.ts test/personnel-permissions.test.ts test/access-audit-permissions.test.ts; Result: exit 0; 4 passed files and 18 passed tests.
Correction command: pnpm --filter @yuta/backoffice typecheck; Result: exit 0; tsc --noEmit produced no diagnostics.
Post-correction assessment: PASS; stale Product Knowledge statements were removed, approved ownership and initial behavior are explicit, technical implementation choices remain uninvented, authorization evidence remains passing, lifecycle values remain unchanged, and no dependent change was resumed.
Correction follow-up: repository-wide documentation scan found the approved Product Decision integration report still carried the earlier unresolved-owner/readiness statement, so that current status report was corrected to the same approved ownership and behavior boundary.
Correction follow-up command: pnpm exec prettier --write docs/INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_REPORT.md; Result: exit 0; document formatted.
Correction follow-up command: pnpm exec prettier --check docs/INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_REPORT.md docs/features/establishment/README.md docs/features/establishment/general-information/README.md docs/MODULE_REGISTRY.md; Result: exit 0; all matched files use Prettier code style.
Correction follow-up command: pnpm docs:check; Result: exit 0; Documentation consistency check passed for 36 current documents.
Correction follow-up command: openspec validate restaurant-knowledge-authorization --strict; Result: exit 0; Change 'restaurant-knowledge-authorization' is valid.
Correction follow-up command: git diff --check -- docs/INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_REPORT.md apps/backoffice/src/server/auth/permissions.ts docs/features/identity-access/README.md docs/features/establishment/README.md docs/features/establishment/general-information/README.md docs/MODULE_REGISTRY.md; Result: exit 0; no whitespace errors; Git emitted only LF-to-CRLF working-copy notices.
Correction follow-up scan: rg for the stale current-document statements returned no matches; rg exit 1 is the expected no-match result.
Final post-correction assessment: PASS; all current Restaurant Knowledge Product Knowledge/status sources in scope reflect the approved owner, persistence/domain ownership, tenant envelope, optionality, empty state, manual input/view/edit, explicit-save, and no-autosave decisions without selecting technical implementation details.
```

## Existing authorization regression evidence

- Establishment Profile permission tests: included in targeted run, passing.
- Personnel permission tests: included in targeted run, passing.
- Access Audit permission tests: included in targeted run, passing.
- Booking and Reputation plus other Backoffice behavior: included in the final full Backoffice run, `57 passed | 1 skipped` files and `215 passed` tests.
- Tenant context and cross-scope guards: `tenant.test.ts` passed `4/4` and `foundation.test.ts` passed `7/7`.
- Auth selection DB integration: command exit 0 but `3/3` tests skipped because both `CLOUD_DATABASE_URL` and `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true` are required. This is the only unavailable runtime-integration evidence and is not reported as a pass.

## Documentation changes

- `docs/features/identity-access/README.md`: records semantic/authorization ownership split, exact grants, separate operations, no profile inheritance, and no system-role bypass.
- `docs/INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_REPORT.md`: replaces its earlier unresolved-owner/readiness snapshot with the subsequent approved Concept/Histoire ownership and behavior decisions while retaining technical implementation unknowns.
- `docs/features/establishment/README.md`: records Restaurant Knowledge as canonical Concept/Histoire and persistence/domain owner, establishment semantic scope, Organization envelope, and the approved initial behavior while leaving concrete technical persistence choices unresolved.
- `docs/features/establishment/general-information/README.md`: records the same ownership boundary plus independent optional values, valid empty state, manual input/view/edit, one explicit save, no autosave, and the dedicated READ/MANAGE policy.
- `docs/MODULE_REGISTRY.md`: records Restaurant Knowledge as the establishment-scoped persistence/domain owner, distinguishes technical storage choice from domain ownership, and retains no content implementation evidence.
- `pnpm docs:check`: passed for 36 current documents.

## Lifecycle and status changes

No lifecycle value changed. Restaurant Knowledge remains:

- Product Decision: `APPROVED`;
- Implementation: `NOT_STARTED` for Restaurant Knowledge content;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

Implementation evidence, the review-marker explanation, and current Product Knowledge accuracy were updated. No lifecycle value changed, no sync or archive occurred, and `restaurant-knowledge-concept-history` was not resumed or modified during Apply/Verify or the Gate 3 correction.

## Scoped changed files and diff evidence

Implementation files attributed to this change, sorted:

1. `apps/backoffice/src/server/auth/permissions.ts`
2. `apps/backoffice/test/restaurant-knowledge-permissions.test.ts`
3. `docs/INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_REPORT.md`
4. `docs/MODULE_REGISTRY.md`
5. `docs/features/establishment/README.md`
6. `docs/features/establishment/general-information/README.md`
7. `docs/features/identity-access/README.md`

Scoped implementation diff stat, including the new test: 7 files, 334 insertions, 114 deletions. Markdown table alignment accounts for part of the documentation diff.

The exact full scoped implementation diff is attached as [`03-implementation.diff`](03-implementation.diff), 641 lines.

Implementation diff SHA-256: `24a9afbc20256a8819a2f7ce24a25f4b533659dedfa9d67cde018f85a547efa3`

Deterministic source commands, concatenated in this order with LF-normalized output and one terminal LF:

```text
git -c core.autocrlf=false diff --no-ext-diff --binary -- apps/backoffice/src/server/auth/permissions.ts docs/INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_REPORT.md docs/MODULE_REGISTRY.md docs/features/establishment/README.md docs/features/establishment/general-information/README.md docs/features/identity-access/README.md
git -c core.autocrlf=false diff --no-index --binary -- /dev/null apps/backoffice/test/restaurant-knowledge-permissions.test.ts
```

The second command's expected exit code is `1` because it represents a new untracked file; its diff output is intentionally included.

## Deviations, unresolved issues, and recommendation

- Spec/design deviations: none.
- Verification CRITICAL issues: none.
- Verification WARNING issues: none.
- Verification SUGGESTION issues: none.
- Gate 3 documentation blocker: resolved; stale owner/boundary/behavior statements were corrected and evidence regenerated.
- Unavailable check: opted-in DB auth-selection integration was skipped as documented; no database code changed.
- Out-of-scope dependent change: `restaurant-knowledge-concept-history` remains stopped.

Recommendation: `APPROVE Gate 3` for this prerequisite if the reviewed implementation, exact scoped diff, and recorded verification evidence are accepted. Do not sync or archive under `$yuta-run-change`.

Review status: APPROVED
Sync authorization: AUTHORIZED_BY_CURRENT_USER
