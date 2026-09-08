Change: platform-admin-formalites-template-authority-foundation
Gate: 2b — Sensitive Design Review
Review status: APPROVED
Created: 2026-09-06T21:16:46.7301323+02:00
Regenerated: 2026-09-06T21:34:00.3904831+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — authorization/security, runtime boundary và cross-module durable boundary
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-06T22:17:43.8422610+02:00

# Gate 2b — Sensitive Design Review

## Approved Earlier Gates

| Gate   | Packet                                                                                       | Status     | Packet SHA-256                                                     |
| ------ | -------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| Gate 1 | `docs/reviews/platform-admin-formalites-template-authority-foundation/01-analysis-review.md` | `APPROVED` | `1b613c4898cfbbb0e0ac139bc51c772ff85268b598e971863e95962a56bdb53c` |
| Gate 2 | `docs/reviews/platform-admin-formalites-template-authority-foundation/02-specs-review.md`    | `APPROVED` | `4054de5e90f3ec0b2aa37cf51adf3f76d3c90f467ae28cc98e93d9338f7a4c49` |

Gate 1/Gate 2 artifact path-sets và hashes đã được recompute trước Design và khớp exact reviewed values.

## Requested Correction and Resolution

Previous review status: `CHANGES_REQUESTED`.

Correction source: explicit current-user Sensitive Design review instruction.

The previous Design hash was `4f8719323d9cce5d811bdb2891ae60bb406674059c88c5d9e253b30aa1e32f6c`. D7 alone was revised to restore Workflow v3 ordering: canonical knowledge reconciliation now occurs only after Gate 3, authorized finish/sync, strict Main Spec validation and Archive, through the reviewed Knowledge Consolidation process. D1–D6 and every byte after D7 remain unchanged from the previous packet.

| Preserved segment | Before SHA-256                                                     | Current SHA-256                                                    | Result  |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------- |
| D1–D6             | `3b4a93e7ff9eaf7fe2f315237124e1b95177e0dd9032410c148852cc2b8283f1` | `3b4a93e7ff9eaf7fe2f315237124e1b95177e0dd9032410c148852cc2b8283f1` | `MATCH` |
| Post-D7 bytes     | `3f68659a4ebc2dc346813b0e9e79f42bfe8e735e96000fce126cb24bb4840fed` | `3f68659a4ebc2dc346813b0e9e79f42bfe8e735e96000fce126cb24bb4840fed` | `MATCH` |

## Reviewed Artifact Hashes

Hash command/tool:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <path>
```

| Path                                                                                                                                                     | SHA-256                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/analysis.md`                                                                   | `6f39ed1cb07ccc2b1db66c7cad920d97c01e4183d23bcbad5783c419dc3ec73b` |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/design.md`                                                                     | `c165a8ae8b21f78dd33dbd12d634bf52e9cf6acd65d4385e36ce5656981fd07d` |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/proposal.md`                                                                   | `ef4ce308839aa02bf15f89254bce366a65fe115c35eeec04da367ffcfc7efa91` |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/specs/authorization/platform-admin-formalites-template-administration/spec.md` | `c2ff7c618b2d050f0fa259f2e01d226870446638c1138a9cf2a7cd0a6bb45dfb` |

## Exact Design Content

````markdown
## Context

Xem [Proposal](proposal.md), [Analysis](analysis.md) và [approved delta spec](specs/authorization/platform-admin-formalites-template-administration/spec.md). Gate 1 và Gate 2 đã được current user duyệt. Design này chỉ giải quyết portable system-authorization foundation; nó không tạo `apps/platform-admin`, system login UI, template resource hoặc lifecycle service.

`@yuta/auth` hiện có provider-neutral `AuthAdapter`, internal-user lookup và `createAuthService`. Luồng này resolve active `SessionUser` và kiểm tra exact system role mà không import `@yuta/tenant`. Ngược lại, Backoffice password session trong `packages/db-cloud` bắt buộc organization/establishment membership và không phù hợp cho system-only context. Design phải giữ hai boundary tách biệt và không sửa Backoffice session architecture.

`YUTA_ADMIN` và `YUTA_SUPPORT` đã tồn tại trong shared system-role contract. Không có general Platform Admin permission model, system-operation map hoặc application runtime. Formalités vẫn sở hữu semantics của năm template operations; Shared Authentication / Identity / Access chỉ biểu diễn và enforce approved grant policy.

Authorities: root và `packages/auth/AGENTS.md`; Authority Model; Authentication, Identity and Membership, Tenancy và Database Boundaries; Identity / Access và Personnel Product Knowledge; Module Registry; approved Proposal/Analysis/Specs. Current code/tests chỉ là Implemented State evidence.

## Goals / Non-Goals

**Goals:**

- Thêm một closed, typed allowlist cho đúng năm `formalites.template.*` operations và explicit system-role grant map.
- Compose active internal-user resolution với exact operation authorization để trả immutable, minimized GLOBAL YUTA Formalités system context.
- Fail closed cho missing, disabled, unsupported-operation và ungranted-role cases với security audit attribution tối thiểu.
- Giữ existing `getCurrentUser`, `requireUser`, `requireSystemRole`, Backoffice sessions và tenant authorization behavior tương thích.
- Tạo focused executable evidence cho operation independence, grant matrix, audit separation và tenant non-bypass.

**Non-Goals:**

- Không tạo generic/custom Platform Admin permission framework, configurable RBAC/ABAC, wildcard, role inheritance hoặc operation inheritance.
- Không tạo hoặc sửa `apps/platform-admin`, Backoffice routes/sessions, `TenantContext`, tenant guards, membership, entitlement hoặc tenant permission maps.
- Không thêm template schema/repository/API/UI/content/version/lifecycle side effect hoặc `@yuta/db-cloud` access.
- Không thêm legal reviewer role, legal-review evidence storage, qualification, generation, PDF/DOCX/HTML, signature, Documents handoff hoặc provider integration.
- Không thêm production configuration, seed, migration, enablement hoặc deployment.

## Decisions

### D1 — Đặt bounded system authorization trong `@yuta/auth`, không tạo runtime mới

Thêm một capability-specific module `packages/auth/src/formalites-template-system-authorization.ts`. Module này chứa exact operation literals, global scope literal, immutable context type, exhaustive role grant map và pure operation/grant helpers. `packages/auth/src/index.ts` chỉ export public constants/types và service behavior cần cho caller tương lai.

Lý do: `@yuta/auth` là portable authentication/authorization primitive boundary hiện hữu, đã phụ thuộc shared `SystemRole`, không import persistence/framework/tenant và có focused tests. Formalités vẫn sở hữu semantics qua approved spec; auth package chỉ biểu diễn/enforce mapping. Không có legitimate app-local placement vì `apps/platform-admin` chưa tồn tại.

**Alternative considered:** tạo `apps/platform-admin` chỉ để chứa guard. Bị loại vì vi phạm explicit scope và stop condition.

**Alternative considered:** đặt system guard trong `apps/backoffice/src/server/auth`. Bị loại vì Backoffice là restaurant tenant runtime và sẽ làm mờ system/tenant separation.

**Alternative considered:** đặt operations trong `@yuta/tenant` hoặc thêm chúng vào tenant permission unions. Bị loại vì global template authority không phải `TenantContext` authority.

**Alternative considered:** thêm transport schema vào `@yuta/contracts`. Bị loại ở change này vì không có API/event/process boundary; typed literals nội bộ trong auth package là nhỏ nhất và không tạo speculative public contract.

### D2 — Closed operation catalog và explicit exhaustive grant map

Module mới định nghĩa đúng năm literals:

- `formalites.template.read`;
- `formalites.template.draft.manage`;
- `formalites.template.review.submit`;
- `formalites.template.publish`;
- `formalites.template.retire`.

Grant map dùng exact `SystemRole` keys và exact operation arrays:

| System role    | Granted operations       |
| -------------- | ------------------------ |
| `YUTA_ADMIN`   | đúng năm literals ở trên |
| `YUTA_SUPPORT` | empty readonly array     |

Mỗi authorization call đánh giá một exact operation. Không wildcard, `includes` theo namespace prefix, permission implication, role hierarchy hoặc caller-provided grant map. Unsupported runtime input bị deny trước khi tạo context.

**Alternative considered:** chỉ gọi `requireSystemRole(['YUTA_ADMIN'])`. Bị loại vì role-only check không biểu diễn exact requested operation, không chứng minh operation independence và dễ bị hiểu thành blanket Platform Admin authority.

**Alternative considered:** generic policy factory nhận grant map từ future caller. Bị loại vì mở một configurable Platform Admin authorization surface lớn hơn bounded capability hiện tại.

### D3 — `createAuthService` compose active identity với operation authorization, không dùng tenant session

`createAuthService` thêm một method capability-specific, dự kiến `requireFormalitesTemplateSystemOperation(rawOperation)`. Method dùng cùng `AuthAdapter` và `InternalUserLookupPort` đã được inject vào auth service; nó không nhận session cookie, organization, establishment, membership, `TenantContext`, entitlement hoặc permission từ caller.

Để giữ behavior hiện hữu và cung cấp denial attribution chính xác, active-user resolution trong `session.ts` được refactor thành một private discriminated result dùng chung:

```text
external identity absent
| internal user not found
| internal user disabled with resolved user id
| active SessionUser
```

Existing public methods map result này về đúng behavior hiện tại:

- `getCurrentUser`: null cho absent/not-found, `DisabledUserError` cho disabled, `SessionUser` cho active;
- `requireUser`: tiếp tục throw `UnauthenticatedError` khi không có active user;
- `requireSystemRole`: tiếp tục exact-role check và existing error semantics.

Method mới thực hiện theo thứ tự: resolve trusted internal user → validate exact closed operation → evaluate explicit grant → return minimized context hoặc deny. Refactor không đọc/sửa Backoffice database session và không tạo system login/session mechanism.

**Alternative considered:** tái sử dụng `packages/db-cloud` Backoffice `AuthenticatedSession`. Bị loại vì type/flow đó bắt buộc organization và establishment, trái approved system-only boundary.

**Alternative considered:** nhận prebuilt `SessionUser` hoặc role từ caller. Bị loại vì có thể bỏ qua authenticated identity, active-status lookup và trusted stored role.

### D4 — Immutable minimized context không thể trở thành TenantContext

Successful method trả một readonly context với đúng các trường authority cần thiết:

```text
actorUserId
systemRole: YUTA_ADMIN
operation: one exact formalites.template.* literal
resourceScope: GLOBAL_YUTA_FORMALITES_TEMPLATES
```

Context không chứa organizationId, establishmentId, membership role, entitlement, tenant permission hoặc arbitrary resource ID. Nó không implement/extend `TenantContext` và auth package không import `@yuta/tenant`. Email/display name không nằm trong context để giảm dữ liệu không cần thiết.

Context chỉ chứng minh authorization decision cho exact operation. Nó không cung cấp template object, repository handle hoặc lifecycle command. Future domain service phải nhận context một cách tường minh và tự enforce mọi prerequisite thuộc change riêng.

**Alternative considered:** dùng một context chung chứa optional tenant và system fields. Bị loại vì optional mixed scope tạo nguy cơ merge/fallback authority và làm tenant non-bypass khó chứng minh.

### D5 — Security audit signal nằm ở auth logger, không có audit persistence

Mở rộng shape của existing `AuthSecurityLogger.warn` bằng optional normalized `operation` metadata; giữ existing fields/callers tương thích. Method mới phát event `auth.formalites_template_system_operation_denied` cho mọi denial với stable reason thuộc allowlist:

- `unauthenticated`;
- `user_not_found`;
- `disabled`;
- `operation_not_allowed`;
- `role_not_allowed`.

Event chứa `userId` khi private resolver đã resolve internal user. `operation` giữ exact known/unknown string chỉ khi phù hợp safe identifier pattern và length bound; input khác được ghi bằng stable `invalid` marker, không stringify object hoặc payload. Không log email, template content, legal evidence, credentials, tokens hoặc tenant data.

Successful authorization không tạo persistent event trong foundation này; returned context cung cấp actor/operation/scope cho future downstream security attribution. Không tạo bảng, repository, retention policy hoặc legal-review record. Security event name/shape không được dùng làm bằng chứng legal qualification/publication.

**Alternative considered:** ghi `auth_audit_events` trong `@yuta/auth`. Bị loại vì package không được import persistence và change cấm audit/legal-evidence store.

**Alternative considered:** không log operation denial. Bị loại vì không đáp ứng approved security-audit requirement và không phân biệt role denial với unsupported operation attempt.

### D6 — Focused tests chứng minh behavior và strict separation

Thêm `packages/auth/test/formalites-template-system-authorization.test.ts` và giữ existing `session.test.ts` làm regression evidence. Tests dùng real `createAuthService` với in-memory adapter/lookup ports, không database, browser, Next.js hoặc fabricated `TenantContext`.

Minimum evidence matrix:

| Behavior                                             | Executable evidence                                                                                                                                  |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| exact operation catalog                              | assert đúng năm literals, không duplicate và không extra operation                                                                                   |
| `YUTA_ADMIN` grants                                  | parameterize năm operations; mỗi call trả exact actor/role/operation/global scope                                                                    |
| operation independence                               | mỗi requested operation giữ nguyên; unsupported/prefix/wildcard values deny                                                                          |
| `YUTA_SUPPORT` denial                                | parameterize năm operations; tất cả throw `ForbiddenError` và audit role denial                                                                      |
| null role / missing identity / unknown internal user | deny fail closed, không context; audit reason/actor rules chính xác                                                                                  |
| disabled `YUTA_ADMIN`                                | deny dù role stored là admin; event có user id, operation và `disabled` reason                                                                       |
| untrusted runtime operation                          | non-string, missing, malformed và unknown safe string đều deny; không fallback                                                                       |
| context minimization                                 | result có đúng four authority fields và không có tenant/membership keys                                                                              |
| existing auth behavior                               | current session tests vẫn pass cho `getCurrentUser`, `requireUser`, `requireSystemRole`                                                              |
| no lifecycle side effect                             | source/module dependency review xác nhận không DB, template, file, provider hoặc tenant import; invocation chỉ resolve identity/user và return/throw |

`packages/auth` typecheck/test và repository `architecture:check` chứng minh portable boundary. No-browser QA là phù hợp vì không UI/runtime route được thêm.

### D7 — Canonical Knowledge chỉ được reconcile sau Archive

Apply và Verify của change này không trực tiếp sửa hoặc promote canonical Product Knowledge, `docs/CURRENT_STATE.md`, `docs/MODULE_REGISTRY.md`, lifecycle summaries hay current architecture summaries chỉ vì implementation thành công. Trong active change, chỉ change-local artifacts và review evidence dưới `openspec/changes/platform-admin-formalites-template-authority-foundation/` và `docs/reviews/platform-admin-formalites-template-authority-foundation/` được cập nhật khi workflow yêu cầu; chúng không được claim lifecycle, readiness, environment hoặc production completion.

Canonical reconciliation phải tuân theo đúng thứ tự:

```text
Gate 3
-> $yuta-finish-change
-> authorized Sync
-> strict Main Spec validation
-> Archive
-> Knowledge Consolidation
```

Sau Archive, `$yuta-finish-change` phải áp dụng `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`: inspect chỉ các current sources có thể thực sự cần reconcile, rồi classify `NO_UPDATE_REQUIRED` hoặc `UPDATE_REQUIRED`. Chỉ reviewed Knowledge Consolidation process mới xác định exact canonical target files và exact update. Nếu `UPDATE_REQUIRED`, workflow tạo `04-knowledge-consolidation-review.md` và dừng chờ explicit approval trước mọi canonical edit.

Main-spec links chỉ được thêm sau authorized Sync thành công và strict Main Spec validation thành công. Implementation, Sync, Archive hoặc main-spec promotion không tự động promote bất kỳ lifecycle value nào, gồm Product Decision, Implementation, Environment, Production Readiness và External Dependency.

Mọi reference khác trong Design này tới documentation updates, gồm bước 4 của Migration Plan, đều bị D7 chi phối: trước Archive, chúng chỉ có nghĩa là change-local implementation/review evidence; các canonical sources từng được cân nhắc chỉ là post-archive inspection candidates, không phải pre-authorized edit targets. Không sửa Personnel/Formalités product behavior, readiness gates hoặc unrelated lifecycle values.

## Risks / Trade-offs

- **[Risk] Method mới bị hiểu là general `YUTA_ADMIN` superuser** → Tên method capability-specific, closed catalog, exhaustive map, no caller policy và explicit unknown-operation tests.
- **[Risk] Internal resolution refactor làm đổi existing auth behavior** → Giữ public return/error contracts, chạy existing auth tests và thêm focused cases cho every resolution state.
- **[Risk] System context bị truyền vào tenant guard** → Context type không liên quan `TenantContext`, không tenant fields/imports; docs/tests giữ explicit no-merge rule.
- **[Risk] Unsupported operation làm log injection hoặc dữ liệu tùy ý** → Chỉ log safe bounded identifier hoặc `invalid`, dùng structured logger và không stringify payload.
- **[Risk] Security event bị hiểu là legal/publication evidence** → Event chỉ là denial signal; success chỉ trả attribution context; không persistence và docs/specs ghi explicit distinction.
- **[Risk] Foundation không có production caller** → Đây là intentional prerequisite. Không tạo speculative runtime/UI để chứng minh integration; repository evidence chỉ claim portable auth behavior.
- **[Trade-off] Capability-specific method nằm trong shared auth service** → Chấp nhận để giữ identity resolution và actor attribution ở một trusted boundary; đổi lại không mở generic policy framework hoặc app mới.

## Migration Plan

Không có database/data migration, schema, seed, environment variable, feature flag hoặc deployment.

Sau Sensitive Design approval, implementation dự kiến:

1. Thêm closed operation/context/policy module trong `packages/auth`.
2. Refactor private user-resolution path và thêm capability-specific method mà không đổi existing public behavior.
3. Export bounded API và thêm focused tests.
4. Cập nhật current architecture/Product Knowledge/Registry summaries tối thiểu.
5. Chạy package auth tests/typecheck, relevant contracts regression nếu cần, repository docs/architecture/recursive typecheck, strict OpenSpec validation và scoped diff review.

Rollback trước khi có future consumer là remove additive method/module/tests và revert đúng bounded documentation hunks. Không có data rollback. Nếu future consumer đã phụ thuộc, rollback phải phối hợp với consumer và ưu tiên fail closed; không fallback sang `requireSystemRole` hoặc tenant permissions.

## Open Questions

Không còn design question bắt buộc. Tasks có thể xác định exact test case grouping và documentation hunk order mà không thay Specs hoặc approach.

Stop-condition assessment:

- Không thay tenant-bound Backoffice session architecture.
- Không thêm system role.
- Không tạo Platform Admin runtime/UI.
- Không thêm template persistence hoặc legal governance.
- System và tenant authorization giữ strict type, dependency và context separation.

Sensitive Design Gate: `REQUIRED`, `AWAITING_HUMAN_REVIEW`. Không tạo Tasks hoặc implementation trước explicit approval.
````

## Security, Data and Runtime Implications

- **Authorization/security:** closed five-operation catalog; exhaustive explicit grants; `YUTA_SUPPORT` denied; all prerequisite failures deny; no role/operation inheritance.
- **Identity:** reuses provider-neutral internal-user resolution; existing active/disabled semantics remain. No new principal or system role.
- **Tenant isolation:** no `@yuta/tenant` import, no tenant fields in result, no modification to tenant guards or Backoffice sessions, no mixed context.
- **Audit:** denial-only structured security signal plus success attribution context; no database write, legal evidence or retention contract.
- **Data:** no executable schema, migration, repository, template content/version or legal-review evidence.
- **Runtime:** no `apps/platform-admin`, route, UI, API, login/session runtime, provider or deployment.
- **Side effects:** authorization returns/throws only; no template lifecycle operation is executed.

## Migration and Rollback Assessment

No schema/data/runtime migration exists. Implementation is additive within `@yuta/auth`; before Archive, documentation changes are limited to change-local implementation/review evidence. Canonical knowledge is neither an Apply target nor a rollback hunk: post-archive Knowledge Consolidation separately determines whether an update is required and requires its own review before any canonical edit. Rollback removes only the bounded auth module/method/tests and change-local evidence before any future consumer exists. It must never fall back to role-only or tenant authorization.

## Unresolved Choices

No Product, authorization, ownership or task-shaping choice remains unresolved. Exact line-level naming and test grouping may be completed in Tasks/Apply only within the reviewed Design.

The mandatory stop-condition audit is clear:

- tenant-bound Backoffice session architecture remains unchanged;
- no new system role is required;
- no Platform Admin runtime/UI is created;
- no template persistence or legal governance enters scope;
- system and tenant authorization remain strictly separate.

## Validation

```text
pnpm exec openspec validate "platform-admin-formalites-template-authority-foundation" --strict --json
PASS — one change passed, zero failed, zero issues.

pnpm exec prettier --check "openspec/changes/platform-admin-formalites-template-authority-foundation/design.md" "docs/reviews/platform-admin-formalites-template-authority-foundation/02b-design-review.md"
PASS — All matched files use Prettier code style.
```

## Recommendation

`APPROVE_SENSITIVE_DESIGN_GATE_TO_PROCEED_TO_TASKS`

Exact approval needed next:

```text
$yuta-run-change platform-admin-formalites-template-authority-foundation
Sensitive Design approved. Continue to Tasks and implementation planning only.
```
