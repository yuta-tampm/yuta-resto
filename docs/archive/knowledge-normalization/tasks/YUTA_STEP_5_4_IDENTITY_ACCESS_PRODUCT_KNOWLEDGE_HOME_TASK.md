# YUTA — Step 5.4: Identity / Access Product Knowledge Home

## Mục tiêu

Tạo **Product Knowledge Home** cho nhóm **Identity / Access**
(Authentication, membership, role, permission, trusted tenant scope) trong Cloud Backoffice.

Output chính:

`docs/features/identity-access/README.md`

Nếu thư mục chưa tồn tại, được phép tạo.

Mục tiêu là giúp agent hiểu rõ:

- Authentication là gì;
- membership/access là gì;
- role và permission được xác định ở đâu;
- tenant scope được suy ra từ đâu;
- dữ liệu nào thuộc Authentication / Access / Tenancy;
- dữ liệu nào KHÔNG thuộc nhóm này;
- current implementation là gì;
- Product Intent nào đã được chấp nhận;
- relation với Establishment, Personnel, Reservations, Today và các module khác;
- source nào phải đọc khi cần đi sâu.

Không refactor toàn bộ docs.
Không sửa code.
Không custom OpenSpec.
Không tạo OpenSpec change/spec.

---

# Nguồn bắt buộc phải đọc

Đọc trước:

1. `AGENTS.md`
2. `docs/AUTHORITY_MODEL.md`
3. `docs/LIFECYCLE_STATUS_MODEL.md`
4. `docs/MODULE_REGISTRY.md`
5. `docs/PRODUCT_KNOWLEDGE.md`
6. `docs/CURRENT_STATE.md`
7. `docs/architecture/AUTHENTICATION.md`
8. `docs/architecture/TENANCY.md`
9. `docs/architecture/IDENTITY_AND_MEMBERSHIP.md`
10. `docs/architecture/DATA_MODEL.md`
11. `docs/operations/PRODUCTION_READINESS.md`
12. các accepted ADR/decision liên quan.

Đọc các source liên quan:

- Establishment Product Knowledge Home
- Today Product Knowledge Home
- Personnel Product Knowledge Home
- public booking / reputation docs nếu dùng tenant resolution
- UI/page pack cho user/access management nếu có

Kiểm tra code khi cần xác minh Implemented State:

- `apps/backoffice/src/server/auth`
- session/auth routes
- membership/access management routes
- `packages/tenant`
- `packages/auth`
- `packages/db-cloud` auth/membership repositories
- relevant permission/role guards
- relevant tests

Tuân thủ root và nested `AGENTS.md`.

---

# Vai trò của `docs/features/identity-access/README.md`

Sau khi review, đây sẽ là **canonical Product Knowledge Home** cho Identity / Access.

Nó không thay thế:

- Authentication architecture;
- Tenancy architecture;
- executable schemas;
- code/tests;
- module-specific permissions;
- OpenSpec specs sau này.

File này phải giải thích **business/security ownership và trust boundaries**
(ranh giới tin cậy), không biến thành low-level auth implementation guide.

---

# Nội dung bắt buộc

## 1. Purpose

Giải thích ngắn vai trò của:

- Authentication
- Identity
- Membership
- Access
- Tenant context

Phải phân biệt chúng.

Ví dụ:
- Authentication xác minh/session người dùng;
- Membership nối user với organization/establishment và scope;
- Access quyết định quyền;
- Tenancy cung cấp trusted server-derived scope.

Chỉ ghi nếu source hỗ trợ.

---

## 2. Core concepts

Tạo bảng:

| Concept | Meaning | Owner/source |
|---|---|---|

Tối thiểu kiểm tra:

- User identity
- Session
- Organization
- Establishment
- Membership
- Role
- Permission
- Entitlement
- Active establishment
- Tenant context

Không gộp Organization, Establishment và Membership vào một entity.

---

## 3. Users / roles

Liệt kê các role hiện có nếu được source/code xác nhận.

Ví dụ:
- OWNER
- MANAGER
- STAFF

Không invent role.

Làm rõ:
- role không phải permission;
- permission có thể khác theo capability;
- route visibility không phải authority;
- browser-provided role/tenant values không đáng tin.

---

## 4. Current bounded scope

Mô tả current implemented capability nếu được xác minh:

- sign-in/session;
- logout;
- password reset foundation nếu có;
- organization/establishment selection/switching;
- membership administration;
- role/permission enforcement;
- access-history/audit nếu có;
- trusted tenant resolution.

Không gọi provider/email capability là implemented nếu chỉ có foundation.

---

## 5. Product Intent vs implementation

Tách:

### Approved / durable boundaries
Các security/tenancy boundaries đã được accepted decision/architecture xác nhận.

### Current implementation
Code hiện thực hiện gì.

### Future / incomplete
Ví dụ nếu đúng:
- automated password reset delivery;
- external identity provider;
- SSO;
- invitation flow;
- platform-admin identity;
- richer RBAC/ABAC;
- production provider configuration.

Không suy future từ code placeholder.

---

## 6. Lifecycle summary

Dùng đúng 5 dimensions từ `docs/LIFECYCLE_STATUS_MODEL.md`.

Tạo bảng:

| Capability / Scope | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review Marker |
|---|---|---|---|---|---|---|

Tối thiểu xem xét:

- Authentication/session foundation
- Tenant/membership boundary
- Access/membership administration

Ưu tiên reuse status từ `MODULE_REGISTRY.md`.

Nếu Product Decision hiện chưa có explicit authority:
- giữ `— + NEEDS REVIEW`;
- không tự promote chỉ vì architecture/code tồn tại.

---

## 7. Trust and authority boundaries

Đây là phần quan trọng nhất.

Tạo rule rõ:

- server derives trusted organization/establishment scope;
- browser-provided tenant/role/permission/entitlement is untrusted;
- membership must be verified server-side;
- source modules enforce their own capability permission;
- Identity/Access does not automatically grant data ownership;
- UI visibility does not equal authorization;
- denial must fail closed where architecture requires it.

Không invent new permission model.

---

## 8. Source-of-truth boundaries

Tạo bảng:

| Data / concern | Owning module/source | Identity / Access relationship |
|---|---|---|

Tối thiểu:

- user identity
- session
- organization
- establishment
- membership
- role
- permission
- entitlement
- employee dossier
- reservation
- reputation
- POS local user nếu tồn tại
- public anonymous user/visitor

Phải làm rõ:

Cloud user identity ≠ Personnel employee dossier.
Cloud membership ≠ POS local user.
Public visitor ≠ authenticated Backoffice membership.

---

## 9. Cloud identity vs POS local users

Phải có section riêng nếu repo có POS local users.

Xác minh và ghi:

- cloud identity/access owner;
- POS local user owner;
- có sync hay không;
- agent không được merge hai user models.

Không phát minh federation/sync.

---

## 10. Related modules

Tạo bảng:

| Related module | Current relationship | Source of truth / direction |
|---|---|---|

Tối thiểu kiểm tra:

- Establishment
- Personnel
- Today
- Reservations / Booking
- Reputation
- POS / Site Agent
- Public Booking / Feedback anonymous flows
- Platform Admin reserved boundary nếu relevant

---

## 11. Current limitations / non-goals

Làm rõ khi evidence hỗ trợ:

- auth code không tự chứng minh production readiness;
- missing email/provider workflow không được gọi completed;
- membership không phải employee identity;
- entitlement không phải permission nếu model tách chúng;
- no cloud↔POS identity sync unless approved;
- no platform-wide admin behavior unless implemented/approved.

---

## 12. Source map

Tạo bảng:

| Question | Read this source |
|---|---|

Route agent tới:

- Identity / Access Product Knowledge Home
- AUTHENTICATION architecture
- TENANCY architecture
- IDENTITY_AND_MEMBERSHIP
- Establishment Product Knowledge
- Personnel Product Knowledge
- MODULE_REGISTRY
- AUTHORITY_MODEL
- LIFECYCLE_STATUS_MODEL
- current auth/tenant code
- PRODUCTION_READINESS

---

## 13. Agent interpretation rules

Tối thiểu:

1. Do not trust browser-provided tenant/role/permission scope.
2. Do not infer authorization from UI visibility.
3. Do not merge cloud user identity with Personnel employee dossiers.
4. Do not merge cloud user identity with POS local users.
5. Separate role, permission, entitlement, and membership where the current model does.
6. Separate Product Intent from Implemented State.
7. Do not infer Product Decision from code.
8. When sources conflict, use Authority Model and mark NEEDS REVIEW.
9. OpenSpec is not currently normative for Identity / Access.

---

## 14. OpenSpec position

Ghi ngắn:

- hiện chưa có normative Identity/Access OpenSpec spec;
- home này giữ Product Knowledge và security/trust context;
- approved OpenSpec specs sau này mô tả behavioral requirements cụ thể;
- accepted security/tenancy decisions vẫn là durable boundary authority;
- không tạo OpenSpec artifacts ở bước này.

---

## 15. Status

Cuối file:

`Status: PROPOSED FOR REVIEW`

Không tự chuyển thành APPROVED.

---

# File phụ được phép cập nhật

Sau khi tạo home, chỉ được cập nhật tối thiểu:

1. `docs/PRODUCT_KNOWLEDGE.md`
2. `docs/MODULE_REGISTRY.md`
3. `docs/README.md`

Chỉ update routing/link.

## `docs/PRODUCT_KNOWLEDGE.md`
Identity / Access phải trỏ tới:

`docs/features/identity-access/README.md`

## `docs/MODULE_REGISTRY.md`
Ở các row:
- Authentication
- Tenancy
- Access / membership

update `Primary Knowledge Source` để ưu tiên home mới khi phù hợp.

Không đổi lifecycle status chỉ vì tạo home.
Giữ Review Marker nếu Product Decision còn unresolved.
Giữ `Status: APPROVED`.

## `docs/README.md`
Thêm link tới Identity / Access Product Knowledge Home ở vị trí phù hợp nếu cần.

Không sửa architecture docs.
Không sửa CURRENT_STATE.
Không sửa code.

---

# Validation

Sau khi tạo:

1. Confirm Identity, Membership, Access, Tenancy được phân biệt rõ.
2. Confirm user identity ≠ Personnel employee dossier.
3. Confirm cloud identity ≠ POS local user.
4. Confirm route/UI visibility không được coi là authorization.
5. Confirm trusted tenant scope được mô tả server-side.
6. Confirm lifecycle summary không suy đoán.
7. Confirm routing đã cập nhật.
8. Confirm không code nào thay đổi.
9. Run relevant docs/architecture/format checks.

Report:

- files created/modified;
- concept map;
- trust boundaries;
- cloud vs POS identity distinction;
- routing updates;
- unresolved review markers;
- validation results.

Không start Step 5.5.

Dừng sau Step 5.4 và chờ review.
