# Implementation Plan

Change: `formalites-authorization` — schema `yuta-spec-driven`.

Authority: [Proposal](proposal.md), [Analysis](analysis.md),
[Spec](specs/authorization/formalites/spec.md), [Design](design.md),
[approved Sensitive Design Gate](../../../docs/reviews/formalites-authorization/02b-design-review.md).
Design D1–D7 không còn blocking open question. Dòng awaiting-review trong Design
là trạng thái lúc phát hành; approval hiện tại nằm trong packet, không sửa Design.

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

Non-browser QA: REQUIRED — authorization decisions và trusted-context composition.

Hai phase đủ cho prerequisite: Service / Domain rồi Integration / Regression.
Không có Foundation / Data, UI / Components hoặc Interaction / States vì không
đổi persistence, consumer hoặc giao diện. Các checkbox dưới đây là công việc
chưa thực hiện; không phải bằng chứng PASS. Dừng sau kế hoạch để user duyệt Apply.

## 1. Service / Domain

- [x] 1.1 Capture pre-Apply baseline: HEAD, scoped status, exact bytes/hashes của permissions.ts, session.ts, tenant resolver, existing auth tests và prototype/navigation paths; inventory untracked files. Xác minh intended implementation paths sạch hoặc isolate được; lưu provenance dưới review directory, không lấy toàn bộ dirty HEAD diff làm evidence của change.
- [x] 1.2 Bổ sung `FormalitesPermission`, private separate grant entries và boolean/throwing guards theo D1–D3; tạo `test/formalites-permissions.test.ts`. Hoàn tất khi permission matrix bên dưới PASS và diff chứng minh existing union/map/function blocks nguyên bytes.
- [x] 1.3 Tạo internal server-only `auth/formalites.ts` với `requireFormalitesTenant` theo D4–D6; tạo `test/formalites-authorization-context.test.ts`. Hoàn tất khi real session/resolver composition với mocked infrastructure vượt qua context matrix bên dưới, không sửa session.ts hoặc wire consumer.
- [x] 1.4 Kiểm tra cả hai test files mới và Backoffice typecheck; kiểm tra no-side-effect imports, operation forwarding, Personnel independence, exact error/redirect semantics. Ghi exact command/result và đánh giá Phase 1 contract từng dòng; không đánh dấu complete nếu test chỉ mock sẵn OWNER thay vì kiểm chứng resolution.

### TECHNICAL IMPLEMENTATION CONTRACT

**Scope / canonical owner:** cloud Backoffice server authorization; Formalités
owns READ/MANAGE semantics, Shared Authorization/Identity / Access owns typed
representation, grants và enforcement. Không đổi data/runtime/security boundary.

**Authorities:** `AGENTS.md`, nearest `apps/backoffice/AGENTS.md`;
`packages/tenant/AGENTS.md` cho resolver/guard evidence (read-only);
`docs/README.md`, `docs/CURRENT_STATE.md`, `docs/AUTHORITY_MODEL.md`,
`docs/architecture/AUTHENTICATION.md`, `docs/architecture/TENANCY.md`,
`docs/architecture/IDENTITY_AND_MEMBERSHIP.md`,
`docs/features/identity-access/README.md`, `docs/features/personnel/README.md`,
approved Spec và Design D1–D7. Đọc lại current authorities trước Apply;
conflict không được tự resolve bằng code.

**Exact implementation allowlist:**

| Path                                                            | Allowed change                                                                                                 |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `apps/backoffice/src/server/auth/permissions.ts`                | Chèn Formalités declarations/guards và import existing requireEstablishment cần thiết; không sửa legacy blocks |
| `apps/backoffice/src/server/auth/formalites.ts`                 | New small server-only composition helper                                                                       |
| `apps/backoffice/test/formalites-permissions.test.ts`           | New focused permission tests                                                                                   |
| `apps/backoffice/test/formalites-authorization-context.test.ts` | New composition/boundary tests                                                                                 |

Evidence chỉ dưới `docs/reviews/formalites-authorization/`; progress chỉ trong
file Tasks này. Không sửa package manifests, shared helpers, session.ts,
packages/tenant, existing suites hoặc route/component/navigation files.

**Invariants:**

- Đúng hai literal `formalites.read` / `formalites.manage`; independent private
  grant entries OWNER-only. Không wildcard/framework/package/grant table/entitlement.
- `hasFormalitesPermission` false khi thiếu establishment, non-user, denied role
  hoặc unknown runtime operation; không throw. Throwing guard gọi
  `requireEstablishment` trước: thiếu scope là `TenantError`,
  `ESTABLISHMENT_REQUIRED`, 400, `An establishment is required.`; denied operation
  với scope là `CROSS_TENANT_ACCESS_DENIED`, 403, `Permission denied.`.
- Helper nhận server-selected operation và returnTo hint theo D4; không nhận
  browser tenant/organization/establishment/role/membership/permission làm proof.
  Tái sử dụng `requireAuthenticatedTenant`, existing membership/metadata checks,
  `requireEstablishment`; không duplicate session/tenant resolution.
- Validated session → active matching membership → trusted organization/active
  establishment → requested Formalités operation. Không system-role bypass,
  fallback establishment hoặc org-only authorization. Giữ existing redirects.
- Không import/call/alias Personnel permissions để authorize Formalités;
  Personnel và Restaurant Knowledge legacy mappings/helpers nguyên bytes.
- Không wire quyền vào generic/connected prototype, Personnel source-read,
  development gates, navigation hoặc UI. Không domain writes hay production enablement.

**Required permission evidence (1.2 / 1.4):** real guards, synthetic typed
contexts, parameterize cả hai operations: OWNER allow riêng READ và MANAGE;
MANAGER/STAFF/public/service deny; system roles không nâng grant; missing
establishment false/400; exact error class/code/status/message; unknown operation
false/403; exact two literals; separate grants, không alias Personnel.
Kiểm tra forwarding bằng controlled evaluator READ allow/MANAGE deny để chứng
minh wrapper không substitute/cache kết quả, không thay đổi real Product grants.

**Required trusted-context evidence (1.3 / 1.4):** actual session.ts + actual
tenant resolver + real guards, chỉ mock cookies, redirects, cloudDatabase,
auth repository/metadata/membership factories. Không mock
`requireAuthenticatedTenant` thành trusted OWNER để claim upstream coverage.
Isolate cache/modules giữa cases. Cover missing session; missing/inactive
membership; mismatched user; wrong organization; wrong establishment; missing
required establishment; null/inactive upstream metadata/session; valid OWNER;
YUTA_ADMIN/YUTA_SUPPORT với missing hoặc denied membership; browser claims bị
ignore (lookup identifiers chỉ từ validated session). Assert exact existing
connexion/recovery redirect destinations và không trả authorized context khi deny.
Mocks không chứng minh database active-status integration hoặc arbitrary draft
resource ownership. Không tạo draft resource để giả lập evidence.

**Checks / completion evidence:**

```text
pnpm --filter @yuta/backoffice test test/formalites-permissions.test.ts test/formalites-authorization-context.test.ts
pnpm --filter @yuta/backoffice typecheck
```

Ghi test counts, skips, exact failures/results; scoped diff + baseline comparison
chứng minh unchanged legacy blocks/consumers. Mỗi invariant có evidence hoặc
FAIL/BLOCKED, không suy PASS từ file existence.

**Stop conditions:** overlapping work không isolate được; phải sửa session,
Personnel/RK/shared helpers; mới/khác owner, tenancy/security boundary, runtime,
permission ngoài hai literal, grants ngoài OWNER, Product decision mới;
UI_AFFECTING thành YES; cần consumer wiring; không chứng minh required denials.
Dừng để review, không refactor hoặc mở rộng allowlist âm thầm.

**Out of scope:** persistence/schema/migration/repository/draft lifecycle;
address/remuneration/probationChoice persistence; Personnel projection/write-back;
PDF/preview/template/signature/provider/DPAE/DSN; Documents; AI/OCR/payroll;
production, public API và mọi route/UI behavior change.

## 2. Integration / Regression

- [x] 2.1 Chạy full Backoffice và Tenant tests, xác minh existing Personnel, Restaurant Knowledge, Establishment Profile, Access Audit cùng Formalités generic/connected/runtime-gate suites không đổi và PASS. Ghi exact counts/skips/failures; không che pre-existing failure bằng focused PASS.
- [x] 2.2 Chạy Backoffice typecheck/build, recursive typecheck, docs/architecture checks, format checks và strict OpenSpec validation theo command inventory bên dưới; ghi exact commands/exit/results và blockers, không sửa unrelated failure hoặc chạy database/production commands.
- [x] 2.3 Review scoped implementation diff (gồm files mới), so pre-Apply baseline, kiểm tra no consumer wiring/no grant expansion/no session change/no excluded-module writes. Lập Technical Compliance Matrix theo mọi Spec requirement/scenario và mọi Phase contract item; completion cần location/test/evidence cụ thể, không còn NOT_EXECUTED hoặc required evidence bị block.
- [x] 2.4 Thực hiện và ghi riêng VERIFY + applicable non-browser QA, assemble Gate 3 theo current workflow với hashes/diff/evidence. Chỉ tạo ready packet khi technical compliance, VERIFY và QA đều PASS; `Review status: AWAITING_HUMAN_REVIEW`, `Sync authorization: PENDING`; STOP cho human review, không sync/archive/deploy.

### TECHNICAL IMPLEMENTATION CONTRACT

**Scope / canonical owner:** kiểm chứng authorization prerequisite trong cùng
cloud Backoffice boundary; ownership như Phase 1. Không tạo feature mới để test.

**Authorities:** `AGENTS.md`, `apps/backoffice/AGENTS.md`,
`packages/tenant/AGENTS.md`; toàn bộ authority paths ở Phase 1;
`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, `docs/YUTA_QA_PROTOCOL.md`,
`docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`,
`docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`, current
`.agents/skills/yuta-run-change/SKILL.md`; approved Spec/Design và Phase 1 contract.
Re-read applicable VERIFY/QA workflow khi phase thực sự chạy.

**Allowed areas:** sửa technical defects trong đúng bốn implementation/test files
của Phase 1, không mở scope. Review evidence dưới
`docs/reviews/formalites-authorization/`; checkbox progress trong Tasks.
Không rewrite Proposal/Analysis/Spec/Design hoặc earlier gate evidence; approval
metadata chỉ theo workflow. Không đổi canonical knowledge/lifecycle tại phase này:
as-built boundary được mô tả trong review evidence; durable consolidation đi qua
authorized lifecycle riêng, không opportunistic fix documentation drift.

**Invariants:** mọi Phase 1 invariant giữ nguyên; existing prototypes/source-read,
nav/dev gates/session/tenant/membership unchanged. Rollback review chỉ additive
removal khi chưa có consumer; không reset shared permissions file. Nếu phát hiện
future consumer đã phụ thuộc, STOP cho coordinated fail-closed review. Không
claim DB integration, browser QA hay production authorization từ unit/mocked tests.

**Required regression evidence:** giữ nguyên và chạy
`apps/backoffice/test/personnel-permissions.test.ts`,
`restaurant-knowledge-permissions.test.ts`, `establishment-profile-permissions.test.ts`,
`access-audit-permissions.test.ts`, `formalites-cdi-prototype.test.tsx`,
`formalites-cdi-connected-read.test.tsx` (các basename cùng directory test);
`apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.test.ts`;
`packages/tenant/test/tenant.test.ts`, `packages/tenant/test/foundation.test.ts`.
Full suites bao gồm other existing authorization tests, không chỉ sáu suites nêu tên.
Baseline/diff và import-reference inventory chứng minh prototype/gates/nav không
được wire helper, không dùng test PASS để thay thế diff review.

**Existing command inventory / completion evidence:**

```text
pnpm --filter @yuta/backoffice test
pnpm --filter @yuta/tenant test
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice build
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
pnpm format:check
openspec validate formalites-authorization --strict
```

Thêm `pnpm exec prettier --check` với exact attributed paths để tách scoped
formatting khỏi unrelated repository failures; không thay thế full-check result.
Manifests/CLI được xác minh khi lập kế hoạch, recheck trước execution. Không cần
cloud/local DB integration suites, other-app builds hoặc browser screenshots vì
không có DB/consumer/UI change; ghi rõ evidence không áp dụng, không claim đã chạy.

**VERIFY / Technical Compliance Matrix:** dùng bảng sau làm coverage index trong
existing VERIFY evidence; expand mỗi hàng thành từng scenario của Spec, không
gom test bị thiếu vào một PASS chung. Location là dự kiến tới khi Apply thực hiện.

| Spec requirement                            | Design decision | Intended implementation location                    | Required test/evidence                                                                | Planning status |
| ------------------------------------------- | --------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------- |
| Hai logical operations độc lập              | D1–D3           | permissions.ts + formalites.ts                      | literal/map isolation; per-operation and forwarding tests                             | NOT_EXECUTED    |
| Initial grants chỉ OWNER                    | D2–D3           | permissions.ts                                      | OWNER each allow; MANAGER/STAFF each deny                                             | NOT_EXECUTED    |
| Trusted authenticated establishment context | D3–D5           | formalites.ts using unchanged session/resolver      | real-composition context matrix, exact scope errors/redirects, browser claims ignored | NOT_EXECUTED    |
| Unsupported actors/system-role bypass deny  | D2–D5           | permissions.ts + formalites.ts                      | public/service/system-role/missing-membership denial                                  | NOT_EXECUTED    |
| Không kế thừa Personnel authorization       | D1–D2, D6       | new Formalités guards/helper                        | forbidden references; independent evaluation; unchanged Personnel blocks              | NOT_EXECUTED    |
| Existing authorization/tenancy giữ nguyên   | D2, D4–D7       | additive permissions only; unchanged session/tenant | legacy byte baseline + full auth/Tenant regression suites                             | NOT_EXECUTED    |
| Existing prototype không đổi                | D6–D7           | no prototype implementation edits                   | generic/connected/gate tests + scoped diff/import inventory                           | NOT_EXECUTED    |
| Không kích hoạt excluded capabilities       | D5–D7           | side-effect-free helper                             | no writes/provider/consumer imports; exact scope inventory                            | NOT_EXECUTED    |

Thêm mapping từng technical rule → exact authority → affected implementation
→ test/check/evidence → PASS/FAIL/BLOCKED, trace Phase 1 và Phase 2. Ghi riêng:
`TECHNICAL IMPLEMENTATION COMPLIANCE`, `VERIFY`, `QA`; không dùng một PASS chung.
Non-browser QA kiểm tra operational allow/deny/recovery scenarios qua executable
tests và scope review; báo limitations của mocked infrastructure. Gate 3 hash
planning artifacts, attributed diff (kể cả untracked), canonical verify evidence
và matrix theo current workflow; không tự thiết kế aggregate convention khác.

**Stop conditions:** bất kỳ approved-boundary drift, required evidence FAIL/BLOCKED,
unisolatable diff, earlier hash mismatch hoặc UI_AFFECTING YES. Không phát hành
ready Gate 3 khi required evidence thiếu; không dùng NOT_APPLICABLE để bỏ qua
authorization QA. Unrelated failures phải báo nguyên trạng để review.

**Out of scope:** toàn bộ exclusions Phase 1; browser QA/UI work, database
integration claims, production deployment/migration/enablement, spec sync/archive,
lifecycle promotion và Product/durable authority changes.
