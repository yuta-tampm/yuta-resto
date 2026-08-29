# YUTA — Step 5.3: Establishment Product Knowledge Home

## Mục tiêu

Tạo **Product Knowledge Home** (tài liệu chính để bắt đầu hiểu module) cho
**Établissement / Establishment** trong Cloud Backoffice.

Output chính:

`docs/features/establishment/README.md`

Nếu thư mục chưa tồn tại, được phép tạo.

Mục tiêu là giúp agent hiểu rõ:

- Establishment đại diện cho cái gì trong YUTA;
- dữ liệu nào thuộc Establishment;
- dữ liệu nào chỉ liên quan nhưng thuộc module khác;
- current implementation (phần code hiện có) là gì;
- Product Intent (ý định sản phẩm đã chốt) là gì;
- quan hệ với Reservations/Public Booking, Today, Reputation và các module khác;
- cloud Establishment khác gì với restaurant-local POS establishment;
- source nào cần đọc tiếp.

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
7. `docs/REPOSITORY_MAP.md`
8. `docs/architecture/OVERVIEW.md`
9. `docs/architecture/TENANCY.md`
10. `docs/architecture/DATA_MODEL.md`
11. `docs/operations/PRODUCTION_READINESS.md`

Đọc các UI/source liên quan:

12. `docs/ui/pages/establishment-general-information/README.md`
13. page pack / docs cho `horaires-services` nếu tồn tại
14. Public Booking docs
15. Today Product Knowledge Home
16. Reputation docs nếu Establishment context/identity được dùng ở đó
17. các accepted decision/ADR liên quan tới tenancy, runtime, public app hoặc
    establishment ownership.

Kiểm tra code khi cần xác minh Implemented State:

- `apps/backoffice/src/app/(authenticated)/etablissement`
- general-information route/server code
- hours/services route/server code
- establishment profile repository
- booking administration/service-period repository
- trusted tenant context
- relevant schemas/tests

Tuân thủ root và nested `AGENTS.md`.

---

# Vai trò của `docs/features/establishment/README.md`

Sau khi review, đây sẽ là **canonical Product Knowledge Home** cho Cloud
Establishment.

Nó không thay thế:

- executable schemas;
- tenant/auth architecture;
- Booking knowledge;
- UI page packs;
- code/tests;
- production-readiness evidence;
- OpenSpec specs sau này.

File này phải tập trung vào **business ownership + module boundaries**
(ranh giới nghiệp vụ và ownership), không biến thành schema catalog hoặc route
inventory.

---

# Nội dung bắt buộc

## 1. Purpose

Giải thích ngắn Establishment dùng để làm gì trong YUTA.

Phải làm rõ Establishment là tenant-scoped restaurant establishment context,
không phải platform-wide organization và không phải restaurant-local POS
database identity nếu hai scope này khác nhau.

Không suy đoán nếu source không đủ.

---

## 2. Users / roles

Xác định ai có thể:

- read establishment context;
- edit general establishment profile;
- manage hours/service periods;

theo source/code hiện tại.

Tách read access và mutation authority nếu khác nhau.

Không suy role từ UI visibility.

---

## 3. Scope

Tách rõ:

### Current bounded scope

Chỉ ghi các capability thực sự được source/code xác minh, ví dụ nếu đúng:

- general establishment identity/profile;
- address/contact;
- language/locale/timezone-related context;
- media/visibility fields;
- service modes;
- other approved profile fields.

### Related but separately owned scope

Đặc biệt kiểm tra:

- booking service periods;
- dated booking exceptions;
- reservation settings;
- public booking availability;
- reputation/feedback settings;
- tenant membership/access.

Nếu một dữ liệu thuộc Booking/Tenancy/Reputation thay vì Establishment,
phải ghi rõ.

### Future / proposed scope

Chỉ ghi khi có authoritative Product Intent.

Không suy future scope từ placeholder hay field tồn tại trong schema.

---

## 4. Capability map

Tạo bảng ngắn:

| Capability / scope | Current boundary | Owner |
|---|---|---|

Tối thiểu xem xét:

- General establishment profile
- Establishment context (locale/timezone/identity)
- Hours / service periods
- Dated exceptions
- Public-facing establishment information
- Service modes / visibility
- Any media/logo/profile capability if current sources support it

Không bắt buộc tất cả thuộc Establishment.
Nếu một capability thuộc Booking, ghi owner là Booking và giải thích relation.

---

## 5. Lifecycle summary

Dùng đúng 5 dimensions trong `docs/LIFECYCLE_STATUS_MODEL.md`.

Bảng:

| Capability / Scope | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review Marker |
|---|---|---|---|---|---|---|

Ưu tiên reuse status đã APPROVED trong `docs/MODULE_REGISTRY.md`.

Nếu registry hiện chỉ có một row rộng cho Establishment:
- không tự invent status riêng cho từng capability;
- có thể dùng `— + NEEDS REVIEW` nếu chưa đủ authority;
- không suy Product Decision từ code.

---

## 6. Source-of-truth boundaries

Đây là phần quan trọng nhất.

Tạo bảng:

| Data / concern | Owning module/source | Establishment relationship |
|---|---|---|

Tối thiểu xác minh:

- organization identity
- establishment identity/profile
- locale/timezone
- booking service periods
- booking exceptions
- reservation settings
- public booking tenant resolution
- reputation/direct-feedback tenant context
- access/membership
- Today context

Mục tiêu:
- không duplicate owner;
- không coi mọi thứ dưới `/etablissement/*` là Establishment-owned;
- route location không tự quyết định domain ownership.

---

## 7. Cloud Establishment vs restaurant-local POS establishment

Phải có một section riêng.

Xác minh và giải thích:

- Cloud Backoffice Establishment data owner;
- POS/Site Agent local establishment/configuration owner;
- có synchronization hay không;
- có phải cùng canonical record hay là hai bounded contexts khác nhau;
- agent không được tự nối/sync hai bên nếu chưa có approved decision.

Nếu source hiện tại khẳng định POS operational data không sync lên cloud,
giữ boundary đó rõ ràng.

Không phát minh sync architecture.

---

## 8. Data and ownership

Ghi ngắn:

- Runtime owner
- Data owner
- trusted tenant scope
- repositories hiện tại
- module nào sở hữu service periods nếu không phải Establishment

Không copy schema field-by-field.

---

## 9. Related modules

Tạo bảng:

| Related module | Current relationship | Source of truth / direction |
|---|---|---|

Tối thiểu kiểm tra:

- Organization / Tenancy
- Authentication / Access
- Reservations / Public Booking
- Today
- Reputation / Direct Feedback
- POS / Site Agent
- Display nếu có relation thật
- Marketing/public website nếu có approved relation

Không invent relation chỉ vì sử dụng cùng establishment slug/id.

---

## 10. Current limitations / non-goals

Làm rõ khi evidence hỗ trợ:

- Establishment không sở hữu user membership;
- Establishment không sở hữu booking records;
- Establishment không tự sở hữu service periods nếu Booking là owner;
- Cloud Establishment không tự đồng nghĩa POS local config;
- route/UI grouping không định nghĩa ownership;
- repository implementation không chứng minh production deployment.

---

## 11. Source map

Tạo bảng:

| Question | Read this source |
|---|---|

Route agent tới tối thiểu:

- Establishment Product Knowledge Home
- Establishment general-information page pack
- Hours/services source/page pack
- Tenancy architecture
- Booking knowledge
- Today knowledge
- MODULE_REGISTRY
- AUTHORITY_MODEL
- LIFECYCLE_STATUS_MODEL
- current Backoffice code/repositories
- PRODUCTION_READINESS

---

## 12. Agent interpretation rules

Tối thiểu:

1. Do not infer domain ownership from route/path placement.
2. Do not merge Organization, Establishment, membership, Booking, or POS local
   data into one model.
3. Use trusted server-derived tenant context.
4. Do not infer cloud↔POS synchronization.
5. Separate Product Intent from Implemented State.
6. Do not infer Product Decision from code.
7. When sources conflict, use Authority Model and mark NEEDS REVIEW.
8. OpenSpec is not currently normative for Establishment.

---

## 13. OpenSpec position

Ghi ngắn:

- hiện chưa có normative Establishment OpenSpec spec;
- home này giữ Product Knowledge context và ownership boundaries;
- approved OpenSpec specs sau này mô tả behavioral requirements cụ thể;
- không tạo OpenSpec artifacts ở bước này.

---

## 14. Status

Cuối file:

`Status: PROPOSED FOR REVIEW`

Không tự chuyển thành APPROVED.

---

# File phụ được phép cập nhật

Sau khi tạo Establishment home, chỉ được cập nhật tối thiểu:

1. `docs/PRODUCT_KNOWLEDGE.md`
2. `docs/MODULE_REGISTRY.md`
3. `docs/README.md`

Chỉ update routing/link.

## `docs/PRODUCT_KNOWLEDGE.md`

Establishment phải trỏ tới:

`docs/features/establishment/README.md`

## `docs/MODULE_REGISTRY.md`

Ở row Establishment profile:
- update `Primary Knowledge Source` để ưu tiên home mới khi phù hợp;
- không đổi lifecycle status chỉ vì tạo home;
- giữ Review Marker hiện có nếu Product Decision còn unresolved;
- giữ `Status: APPROVED`.

Nếu source-of-truth analysis chứng minh một row hiện tại đang gộp sai ownership,
không tự sửa rộng.
Report `NEEDS REVIEW` nếu cần.

## `docs/README.md`

Thêm link tới Establishment Product Knowledge Home ở vị trí phù hợp nếu cần.

Không sửa page packs.
Không sửa CURRENT_STATE.
Không sửa code.

---

# Validation

Sau khi tạo:

1. Confirm README là entry point dễ hiểu.
2. Confirm Establishment vs Organization/Tenancy được tách rõ.
3. Confirm Establishment vs Booking ownership được tách rõ.
4. Confirm service periods/exceptions owner được ghi theo authority thực tế.
5. Confirm cloud Establishment vs POS local establishment không bị merge.
6. Confirm lifecycle summary không suy đoán.
7. Confirm routing đã cập nhật.
8. Confirm không code nào thay đổi.
9. Run relevant docs/architecture/format checks.

Report:

- files created/modified;
- capability map;
- ownership boundaries;
- cloud vs POS distinction;
- routing updates;
- unresolved review markers;
- validation results.

Không start Step 5.4.

Dừng sau Step 5.3 và chờ review.
