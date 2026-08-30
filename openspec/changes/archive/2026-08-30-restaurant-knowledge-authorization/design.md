## Context

Xem [proposal.md](proposal.md) để biết motivation và [delta spec](specs/authorization/restaurant-knowledge/spec.md) cho behavioral contract.

Backoffice hiện resolve session, active organization/establishment metadata và matching active membership thành immutable `TenantContext` trước khi module permission được kiểm tra. `apps/backoffice/src/server/auth/permissions.ts` là shared integration point hiện tại cho typed module operations, role grant maps và fail-closed `has*`/`require*` guards. Guard chỉ nhận `TenantContext`; global `systemRole` không nằm trong actor authorization input.

Restaurant Knowledge chưa có API, route, persistence hoặc caller. Vì vậy prerequisite này cần tạo reusable authorization representation và enforcement point mà không tạo speculative route/session wrapper hoặc thay đổi tenant resolution.

## Goals / Non-Goals

**Goals:**

- Biểu diễn READ và MANAGE bằng hai typed Restaurant Knowledge permission values riêng.
- Áp dụng exact `OWNER`/`MANAGER` grants và STAFF denial trong existing shared Backoffice permission mechanism.
- Cung cấp fail-closed permission query và enforcing guard cho future server-side Restaurant Knowledge callers.
- Giữ existing `TenantContext` là trusted authorization input và giữ nguyên upstream active-session/membership validation.
- Tạo focused tests chứng minh grant matrix, logical separation, non-user denial và no-inheritance boundary.

**Non-Goals:**

- Không thêm route-level caller, session wrapper, UI visibility logic, API, persistence, schema hoặc Restaurant Knowledge content behavior.
- Không chuyển module permission mapping sang package/framework mới.
- Không thay đổi `TenantContext`, membership records, tenant resolution, system roles, entitlements hoặc unrelated permissions.
- Không tạo configurable/custom role grants hoặc section/field-level policy.

## Decisions

### 1. Thêm typed Restaurant Knowledge permissions vào shared Backoffice permission module

Thêm một exported union riêng trong `apps/backoffice/src/server/auth/permissions.ts` với hai values:

- `restaurant-knowledge.read`
- `restaurant-knowledge.manage`

Tên values dùng namespace riêng, không alias sang `establishment.profile.*`. Union riêng giữ semantic ownership rõ ràng và cho future caller chọn đúng operation tại compile time.

**Alternative considered:** reuse `EstablishmentPermission` hoặc thêm values vào union đó. Bị loại vì vi phạm canonical permission ownership và làm page composition trở thành permission inheritance.

**Alternative considered:** tạo shared package/authorization framework mới. Bị loại vì repository đã có accepted Backoffice integration point; framework mới là parallel architecture ngoài scope.

### 2. Dùng hai grant-map entries độc lập dù role arrays giống nhau

Thêm `Record<RestaurantKnowledgePermission, readonly TenantRole[]>` với hai entries riêng, mỗi entry chứa `OWNER` và `MANAGER`. Không derive MANAGE từ READ, không dùng một boolean “can access Restaurant Knowledge”, và không cho STAFF.

Hai entries riêng giúp future Product decision thay đổi một operation mà không làm thay đổi operation còn lại hoặc buộc migration từ một combined permission.

**Alternative considered:** một permission `restaurant-knowledge.access`. Bị loại vì xóa logical separation đã được approve.

**Alternative considered:** cho MANAGE imply READ trong guard. Bị loại vì permission check phải đánh giá requested operation; current equal grants không phải semantic implication.

### 3. Cung cấp `has` và `require` guards theo pattern hiện có

Thêm exported `hasRestaurantKnowledgePermission(context, permission)` và `requireRestaurantKnowledgePermission(context, permission)` trong shared permission module.

- `has` chỉ allow khi `context.actor.type === 'user'` và trusted membership role nằm trong grant map của exact operation.
- `require` gọi `has` và dùng existing fail-closed `TenantError`/`CROSS_TENANT_ACCESS_DENIED`/HTTP 403 behavior khi deny.
- Không đọc browser input, session object hoặc system role trong permission guard.

**Alternative considered:** guard tự query user/organization/establishment/membership. Bị loại vì sẽ duplicate tenant resolution, tăng TOCTOU/inconsistency risk và thay accepted boundary. Production caller phải resolve fresh trusted `TenantContext` qua existing server flow trước permission check.

**Alternative considered:** thêm `requireRestaurantKnowledgeTenant` vào `session.ts` ngay bây giờ. Bị loại vì chưa có route/caller và wrapper không được prerequisite nào consume. Dependent behavior change sẽ compose `requireAuthenticatedTenant`, `requireEstablishment` và exact Restaurant Knowledge operation guard tại owning server boundary.

### 4. Focused tests nằm cạnh Backoffice authorization tests

Tạo `apps/backoffice/test/restaurant-knowledge-permissions.test.ts` để xác minh:

- `OWNER` và `MANAGER` được allow riêng cho READ và MANAGE;
- `STAFF` bị deny cho cả hai;
- public và service actors bị deny;
- READ và MANAGE được gọi bằng hai exact typed operation values;
- Establishment Profile permission không được truyền hoặc dùng thay Restaurant Knowledge permission.

Existing tenant/auth tests tiếp tục là evidence cho active user/session, active matching membership, scope mismatch và system-role-no-membership boundary. Apply/verify phải chạy focused new tests cùng relevant existing tenant/auth tests; chỉ sửa shared tenant/auth tests nếu implementation discovery cho thấy một scenario đã approved chưa có executable coverage và việc sửa vẫn không thay contract.

**Alternative considered:** chỉ test role arrays trực tiếp. Bị loại vì tests cần exercise public `has`/`require` behavior và fail-closed error path.

### 5. Cập nhật current authority documentation mà không promote lifecycle

Sau implementation, update current Identity / Access và Restaurant Knowledge authority sources tối thiểu để ghi nhận READ/MANAGE policy, ownership split và no-inheritance/no-bypass boundary. Không đổi lifecycle values ngoài evidence được separately authorized; prerequisite implementation không làm Restaurant Knowledge content capability thành implemented hoặc enabled.

Không tạo report mới ngoài workflow review packets và không sửa Establishment Profile normative spec.

## Risks / Trade-offs

- **[Risk] Equal initial grants khiến future code collapse READ/MANAGE** → Giữ two literal types, two map entries và tests gọi từng operation riêng.
- **[Risk] Future caller chỉ dùng UI visibility hoặc bỏ qua server guard** → Guards là server-only; dependent change phải map mỗi read/mutation boundary vào exact guard và verify denial tests.
- **[Risk] Permission guard bị dùng với fabricated context trong non-server code** → Giữ module `server-only`; production path phải đi qua existing authenticated tenant resolver. Browser values không trở thành guard input.
- **[Risk] System role bị hiểu nhầm là restaurant bypass** → Guard chỉ consume `TenantContext.actor` membership role; docs/tests giữ explicit no-bypass rule.
- **[Trade-off] Prerequisite chưa có production caller** → Đây là intentional coordinated-change sequencing. Nó tạo accepted reusable authorization contract trước khi dependent Concept/Histoire change tích hợp read/save boundaries.
- **[Trade-off] Authorization mapping vẫn code-defined** → Phù hợp current repository mechanism và fixed approved principals; configurable grants/custom roles nằm ngoài scope.

## Migration Plan

1. Add typed permissions, independent grant entries và `has`/`require` guards trong existing Backoffice permission module.
2. Add focused authorization tests và chạy relevant tenant/auth regression tests.
3. Update current authority documentation tối thiểu, không promote unrelated lifecycle state.
4. Run strict OpenSpec validation, focused tests, Backoffice typecheck/test và repository-required docs/architecture/workspace checks.

Không có database, data, API hoặc runtime migration. Deployment là code-only authorization foundation và không kích hoạt Restaurant Knowledge UI/API.

Rollback có thể remove exact Restaurant Knowledge type/map/guards/tests và bounded documentation updates. Không cần data rollback. Nếu dependent change đã bắt đầu consume guards, rollback prerequisite và dependent integration phải được phối hợp để tránh build failure hoặc authorization gap; fail closed được ưu tiên.
