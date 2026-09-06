## Context

Xem [Proposal](proposal.md), [Analysis](analysis.md) và
[approved delta spec](specs/authorization/formalites/spec.md). Gate 1 và Gate 2
đã được current user duyệt. Design này chỉ giải quyết authorization prerequisite,
không mở persistent Formalités workflow.

Convention hiện tại: [permissions.ts](../../../apps/backoffice/src/server/auth/permissions.ts)
chứa typed permission unions, private role maps và boolean/throwing guards;
[session.ts](../../../apps/backoffice/src/server/auth/session.ts) compose
session/repository resolution với [tenant guards](../../../packages/tenant/src/index.ts).
Formalités prototype chỉ dùng Personnel source-read authorization; chưa có
Formalités permission hoặc durable state. Không có lý do tạo auth package mới.

Authorities: root và Backoffice AGENTS; Tenant AGENTS; Authority Model;
Authentication, Tenancy, Identity and Membership architecture; Identity / Access
và Personnel Product Knowledge; approved Gate 1/2. Các link và current-state
finding đầy đủ được giữ trong Analysis. Ownership được Control Tower duyệt:
Formalités owns semantics; Shared Authorization/Identity / Access owns mapping
và enforcement trong cloud Backoffice.

## Goals / Non-Goals

**Goals:** thêm representation/guards có thể kiểm chứng cho hai operation riêng,
compose existing trusted-context layers, giữ mọi existing consumer nguyên trạng.

**Non-Goals:** draft persistence/schema/migration/repository/lifecycle/UI;
Personnel projection hoặc write-back; lưu address/remuneration/probationChoice;
PDF/preview/template/signature/provider; DPAE/DSN; Documents integration; delivery;
AI/OCR/payroll; grant MANAGER/STAFF; production enablement hoặc legal claims.
Không wire quyền mới vào prototype, navigation hay development gates.

## Decisions

### D1 — Typed permission representation tại server auth hiện có

Thêm `FormalitesPermission` với đúng hai literal `formalites.read` và
`formalites.manage` trong `apps/backoffice/src/server/auth/permissions.ts`.
Giữ `import 'server-only'`; không export qua browser contract hoặc chuyển sang
package mới. Hai literal là representation của logical READ/MANAGE đã duyệt,
không tạo API hay lifecycle command.

Alternative rejected: mở rộng `PersonnelPermission`, alias quyền Personnel,
generic wildcard hoặc một quyền duy nhất. Những cách đó mất semantic ownership
hoặc operation independence. Package/runtime mới không có nhu cầu repository.

### D2 — Private explicit grant map

Thêm riêng `formalitesPermissionRoles`, typed
`Record<FormalitesPermission, readonly TenantRole[]>`:

| Operation           | OWNER | MANAGER | STAFF |
| ------------------- | ----- | ------- | ----- |
| `formalites.read`   | allow | deny    | deny  |
| `formalites.manage` | allow | deny    | deny  |

Mỗi key có grant array riêng. Không suy MANAGE từ READ hoặc ngược lại, không
nhận permission list từ browser. Không bổ sung entitlement hoặc system-role
override. Các existing union/map/function blocks, nhất là Personnel và Restaurant
Knowledge, giữ nguyên byte-for-byte; chỉ chèn declarations/functions mới.

Alternative rejected: gọi `hasPersonnelPermission` vì cùng OWNER grant. Grant
trùng hiện tại không chứng minh hai quyền có cùng semantics. Không đổi legacy
helpers để áp dụng abstraction/refactor mới.

### D3 — Boolean và throwing guards có ranh giới rõ

Thêm `hasFormalitesPermission(context, permission): boolean` và
`requireFormalitesPermission(context, permission): void` trong permissions.ts.

Boolean predicate chỉ làm scoped permission evaluation trên `TenantContext`
đã được server resolve. Nó trả false khi thiếu establishment, actor không phải
user hoặc role không nằm trong grant của đúng operation. Unknown operation
tại runtime trả false thay vì fallback sang operation khác; typed callers chỉ
được truyền hai literal. Không tự parse browser context hoặc đọc database ở đây.

Throwing guard gọi existing `requireEstablishment(context)` trước, rồi kiểm tra
Formalités boolean predicate. Giữ nguyên error contract:

| Failure                                              | Result                                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| Thiếu establishment ở throwing path                  | `TenantError`, `ESTABLISHMENT_REQUIRED`, 400, `An establishment is required.` |
| Sai role/non-user/unknown operation với scope có mặt | `TenantError`, `CROSS_TENANT_ACCESS_DENIED`, 403, `Permission denied.`        |
| Boolean denial                                       | `false`, không throw                                                          |

Không thay đổi semantics của bất kỳ existing guard nào. Scope-presence check
không phải xác minh membership: forged object có hình dạng TenantContext không
trở thành trusted input. Boolean helper không phải public security endpoint.

Alternative rejected: boolean role check được coi là đủ cho mọi request; hoặc
mọi denial bị chuyển thành error mới. Thiết kế giữ distinction giữa missing
required scope và operation permission denial của repository.

### D4 — Server composition tái sử dụng session/tenant resolution

Thêm server-only module `apps/backoffice/src/server/auth/formalites.ts`, chứa
`requireFormalitesTenant(permission: FormalitesPermission, returnTo =
'/equipe/formalites-personnel')`. Đây là internal helper, không phải server
action/route handler, không có `'use server'` export tới client.

Helper gọi `requireAuthenticatedTenant(returnTo)` từ session.ts, yêu cầu
establishment, rồi `requireFormalitesPermission` cho operation được yêu cầu;
trả `{ session, tenant }` với establishmentId được TypeScript narrow thành
string. Không nhận organizationId, establishmentId, membership, role, permission
arrays, TenantContext hoặc resource object từ browser. Operation do server caller
chọn; returnTo chỉ là navigation hint qua existing safeReturnTo behavior.

```text
validated server session (existing requireAuthenticatedTenant)
  -> existing metadata + verified active matching membership
  -> trusted organization and active establishment in TenantContext
  -> requireEstablishment
  -> Formalités operation evaluation
  -> authorized scoped context, no domain side effect
```

Không sửa session.ts, không duplicate resolver/repository/cache hoặc active-status
checks. Existing unauthenticated redirect tới connexion và invalid-scope recovery
redirect giữ nguyên; helper không catch rồi normalize những kết quả này thành
allow hoặc error mới. Existing resolver kiểm tra matching user/organization/
establishment và active membership; existing auth/metadata layer kiểm tra session,
active user/organization/establishment. Không thêm fallback establishment.

System role không được đọc bởi grant evaluation; chỉ `tenant.actor.role` từ
verified membership. `YUTA_ADMIN`/`YUTA_SUPPORT` không tạo bypass.

Alternative rejected: thêm wrapper vào session.ts hoặc nhận browser scope để
tiện test. Module riêng nhỏ giữ session.ts và existing helpers nguyên bytes;
không phải abstraction/runtime mới. Tests mock infrastructure, không đưa
dependency-injection auth override vào production API.

### D5 — Tenancy guarantees và giới hạn resource authorization

Sai organization/establishment/user trong membership resolution bị existing
resolver từ chối trước Formalités evaluation. Membership missing/inactive hoặc
metadata không hợp lệ không tạo authorized context. Organization-only context
không đủ. Browser tenant/role/permission claims không được chuyển thành trusted
context ở helper entry point.

Helper không kiểm tra ownership của một draft ID vì change này không có draft
resource. Nó trả scope đã authorize, không cấp quyền đọc resource bất kỳ ngoài
scope. Future resource consumer phải làm scoped lookup theo organization và
establishment trong change riêng. Không tạo fake repository hoặc resource lookup
ở prerequisite để giả lập coverage.

### D6 — Personnel isolation và prototype preservation

Không import/call Personnel guards từ Formalités guards hoặc composition module.
Giữ nguyên Personnel maps/helper blocks. Existing Formalités generic/connected
routes, full-dossier entry link, Personnel source reads, six-fact projection,
navigation và development flag không import hoặc gọi helper mới. Connected route
tiếp tục bảo vệ source bằng `personnel.employee.read`, development opt-in và
scoped employee lookup. Generic fixture route không bị thêm development gate.

Alternative rejected: thay source-read permission bằng Formalités READ ngay khi
thêm literal. Đó là consumer change ngoài prerequisite và làm thay đổi approved
prototype boundary.

### D7 — Exact evidence design

Hai test files mới dự kiến: `apps/backoffice/test/formalites-permissions.test.ts`
và `apps/backoffice/test/formalites-authorization-context.test.ts`. Dùng Vitest và
`server-only` mock như existing permission tests. Không cần database row, server
endpoint, browser UI hoặc external request để test helper.

| Evidence                                  | Mechanism and expected result                                                                                                                                                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OWNER READ allow                          | Real boolean + throwing guards, valid scoped OWNER context; true/no throw                                                                                                                                                          |
| OWNER MANAGE allow                        | Cùng fixture, kiểm tra riêng MANAGE; true/no throw                                                                                                                                                                                 |
| MANAGER / STAFF deny                      | Parameterize role × operation; false, throwing error code/status/message chính xác                                                                                                                                                 |
| Public / service deny                     | Parameterize actors × operations với establishment có mặt; false/403                                                                                                                                                               |
| System-role no bypass                     | Thêm system-role property trên fixture MANAGER/STAFF vẫn deny; missing membership ở composition vẫn không authorize                                                                                                                |
| Missing establishment                     | OWNER organization-only context: boolean false; throwing guard ESTABLISHMENT_REQUIRED/400; composition không trả context                                                                                                           |
| Missing/inactive/mismatched membership    | Dùng real session/tenant composition với mocked auth repository/metadata/membership lookup; missing, inactive, wrong user, wrong organization, wrong establishment đều đi existing recovery redirect, không trả authorized context |
| Missing session / inactive upstream facts | Mock findSession trả null hoặc metadata trả null; existing connexion/scope recovery redirect được giữ; không invoke successful Formalités evaluation                                                                               |
| Valid session composition                 | Real requireAuthenticatedTenant + real resolver + real Formalités guards, mocked cookies/DB adapters; scoped OWNER được trả, đúng operation được truyền, không gọi Personnel guard                                                 |
| Browser claims cannot override            | Fixture query/headers có role/scope claim khác; helper không đọc chúng; assert lookup chỉ nhận identifiers từ validated session, output chỉ có membership scope                                                                    |
| READ/MANAGE independence                  | Assert exact two typed literal keys; test composition chuyển đúng operation; controlled mock Formalités evaluator allow READ/deny MANAGE chứng minh wrapper không substitute/cache grant của operation khác                        |
| Personnel independence                    | Source boundary assertion không reference Personnel union/map/guards trong phần Formalités; mock Personnel allow không làm Formalités deny thành allow; existing Personnel tests giữ nguyên                                        |
| Existing grants unchanged                 | Existing personnel-permissions, restaurant-knowledge-permissions, establishment-profile-permissions, access-audit-permissions suites và full Backoffice tests; review unchanged legacy blocks trong permissions.ts                 |
| Prototype unchanged                       | Existing formalites-cdi-prototype, formalites-cdi-connected-read và runtime-gate tests; scoped diff/hash chứng minh routes/components/navigation/session.ts không đổi; không claim live browser execution                          |
| Side-effect-free decision                 | No draft/file/provider/domain-write imports trong helper; mocked adapters chỉ chạy existing auth reads, không domain writes                                                                                                        |

Context suite không mock `requireAuthenticatedTenant` thành một OWNER context rồi
claim đã test membership. Giữ actual session.ts và tenant resolver khi kiểm tra
missing/inactive/mismatch; mock boundaries của `next/headers`, `next/navigation`,
cloudDatabase và db-cloud factories. Mock redirects throw sentinel để assert exact
existing destination. Isolate React cache/module state giữa cases bằng test
module reset/cache passthrough. Các underlying active-user/session behavior vẫn
thuộc auth repository; không claim database integration từ mock-based test.

Existing `packages/tenant/test/tenant.test.ts` và `foundation.test.ts` là regression
evidence của resolver/guards, không cần sửa chúng nếu behavior không đổi.

Commands có sẵn cho verification sau implementation:

- `pnpm --filter @yuta/backoffice test` và targeted Vitest filenames qua script này;
- `pnpm --filter @yuta/tenant test`;
- `pnpm --filter @yuta/backoffice typecheck`;
- `pnpm --filter @yuta/backoffice build`;
- `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck`;
- targeted Prettier check; `openspec validate formalites-authorization --strict`.

Đây là evidence design, không phải Tasks hoặc test execution result. Trước Apply,
capture scope baseline và exact legacy blocks/prototype hashes để tách F07 và
workflow work đang dirty. Không lấy toàn bộ HEAD diff làm change evidence.

## Risks / Trade-offs

- Predicate bị gọi với object giả → server-only composition là entry point cho
  request; chỉ nhận operation do server chọn, không nhận browser TenantContext.
- OWNER grants giống Personnel che giấu alias → test/source boundary chứng minh
  hai maps và evaluator độc lập, không chỉ so grant outcomes.
- Missing-scope error bị đổi thành generic 403 → preserve existing
  requireEstablishment 400 và session redirects; kiểm tra exact semantics.
- Test mock quá sâu che mất resolver → context suite chạy actual resolver/session
  composition; tách role-unit evidence khỏi upstream integration evidence.
- Thêm quyền bị hiểu là draft enabled → không wire consumer; no state/API/UI,
  existing gates giữ nguyên; production remains unauthorized.
- Shared permissions file dễ gây regression → additive-only declarations/functions;
  legacy blocks byte-unchanged và chạy current permission suites.

## Migration Plan

Không có schema/data migration, backfill, config flag, seed hoặc production
operation. Đây là additive server auth prerequisite chưa có consumer durable.
Release/deploy không được cho phép trong workflow này.

Rollback khi chưa có consumer: chỉ loại bỏ additive Formalités helper/declarations
sau scoped review; không reset shared file hoặc xóa dữ liệu. Nếu future consumer
đã phụ thuộc, không rollback tạo bypass; dừng và phối hợp change của consumer,
giữ fail-closed. Không sửa session/tenant model hoặc prototype để rollback.

## Open Questions

Không còn design-level question bắt buộc cho prerequisite. Persistent-draft
inputs/ownership implementation/eligibility/legal/template/production vẫn ngoài
scope; không resolve chúng ở đây. Nếu Apply cần owner/grants/security boundary
khác, cross-runtime hoặc Personnel semantic change: STOP về Control Tower.

Sensitive Design Gate: REQUIRED, AWAITING_HUMAN_REVIEW. Không tạo Tasks hoặc
application code trước explicit approval.
