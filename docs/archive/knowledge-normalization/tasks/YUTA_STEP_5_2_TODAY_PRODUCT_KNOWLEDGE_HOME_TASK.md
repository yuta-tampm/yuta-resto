# YUTA — Step 5.2: Today Product Knowledge Home

## Mục tiêu

Tạo **Product Knowledge Home** (tài liệu chính để bắt đầu hiểu module) cho module **Aujourd’hui / Today**.

Output chính:

`docs/features/today/README.md`

Nếu thư mục chưa tồn tại, được phép tạo.

Mục tiêu của file là giúp agent hiểu nhanh:

- Today dùng để làm gì;
- ai sử dụng;
- Today tổng hợp dữ liệu từ đâu;
- Today KHÔNG sở hữu dữ liệu nào;
- phạm vi hiện tại đã triển khai;
- phạm vi Product Intent rộng hơn;
- các module liên quan;
- trạng thái hiện tại theo Lifecycle Status Model;
- cần đọc source nào nếu muốn đi sâu.

Đây là **Step 5.2 của Knowledge Normalization**.

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
7. `docs/ui/pages/today/README.md`
8. `docs/operations/PRODUCTION_READINESS.md`

Sau đó đọc các source liên quan tới dữ liệu Today đang sử dụng hoặc dự kiến sử dụng:

- reservations / public booking docs;
- establishment / booking service-period docs;
- reputation docs;
- Personnel / Planning / Pointage / Tâches du jour docs nếu có relation được ghi nhận;
- stock docs nếu Today Product Intent hiện có nhắc tới stock/inventory;
- relevant decisions/ADRs.

Kiểm tra code khi cần xác minh Implemented State:

- `apps/backoffice/src/app/(authenticated)/aujourdhui`
- relevant Today server loaders/actions/services
- relevant booking/reputation/establishment repositories
- tests nếu có

Tuân thủ root và nested `AGENTS.md`.

---

# Vai trò của `docs/features/today/README.md`

Đây phải là **canonical Product Knowledge Home** cho Today sau khi được review.

Nó không thay thế:

- source module của dữ liệu;
- page pack;
- code/tests;
- production-readiness evidence;
- OpenSpec specs sau này.

Today phải được mô tả như một **operational aggregation / decision-support surface**
(màn hình tổng hợp vận hành và hỗ trợ quyết định), không phải source-of-truth mới.

---

# Nội dung bắt buộc

## 1. Purpose

Giải thích ngắn:

- Today giúp người dùng thấy những gì cần chú ý hoặc hành động trong ngày;
- Today tổng hợp thông tin từ module nguồn;
- Today không được trở thành nơi sở hữu hoặc duplicate dữ liệu nguồn.

Chỉ ghi những gì source hiện tại hỗ trợ.

---

## 2. Users / roles

Xác định role hiện tại có thể dùng Today dựa trên source/code.

Nếu Product Intent có khác nhau theo role như:
- équipe;
- manager;
- restaurateur;

thì tách:
- current implemented role behavior;
- approved/proposed role-specific Product Intent.

Không suy đoán role chưa có evidence.

---

## 3. Scope

Tách rõ:

### Current bounded scope

Mô tả những gì Today hiện thực sự đọc/hiển thị theo code và source hiện tại.

Ví dụ chỉ ghi nếu được verify:
- reservations;
- service periods / exceptions;
- reputation feedback;
- establishment context.

### Approved / broader Product Intent

Nếu Product Knowledge hiện tại đã chốt Today sau này phải tổng hợp thêm:
- tasks;
- pointage anomalies;
- stock/inventory alerts;
- suppliers;
- reviews;
- compliance;
- service handover;

thì ghi dưới Product Intent, không gọi là implemented nếu code chưa có.

### Not implemented / future

Liệt kê các source/module chưa tích hợp thật.

Không biến navigation hoặc placeholder thành integration.

---

## 4. Capability map

Tối thiểu xem xét:

- Daily operational summary
- Reservations summary
- Service-period / exception awareness
- Reputation / feedback attention items
- Role-specific views nếu được source hỗ trợ
- Future task aggregation
- Future pointage anomaly aggregation
- Future stock/inventory alert aggregation
- Future supplier/order awareness
- Future compliance/alert aggregation

Không cần mỗi card/widget là một capability riêng.

Chỉ tách capability nếu status hoặc source khác nhau đáng kể.

---

## 5. Lifecycle summary

Dùng đúng 5 dimensions trong `docs/LIFECYCLE_STATUS_MODEL.md`.

Tạo bảng:

| Capability / Scope | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review Marker |
|---|---|---|---|---|---|---|

Ưu tiên reuse status đã APPROVED trong `docs/MODULE_REGISTRY.md`.

Nếu một Product Intent đã được chốt nhưng chưa có registry row riêng:
- không tự gán APPROVED nếu authority chưa đủ;
- dùng `—` + `NEEDS REVIEW` nếu cần.

Không suy Product Decision từ code.

---

## 6. Source-of-truth boundaries

Đây là phần rất quan trọng.

Tạo bảng:

| Data / concern | Owning module/source | Today relationship |
|---|---|---|

Ví dụ khi evidence hỗ trợ:

- Reservations -> booking/reservations source
- Service periods -> booking/establishment source
- Reputation feedback -> reputation source
- Personnel identity -> Personnel source
- Pointage anomalies -> future Pointage source
- Tasks -> future Tâches du jour source
- Inventory alerts -> future Stock/Inventaire source
- Supplier needs -> future Fournisseurs source

Today phải:
- read / aggregate / surface;
- không duplicate canonical records;
- không bypass source permissions;
- không trở thành write-owner nếu source không cho phép.

Không phát minh mutation/action ownership nếu chưa có approved behavior.

---

## 7. Deduplication / alert interpretation

Nếu Product Intent hiện tại hỗ trợ nguyên tắc:
- cảnh báo phải đại diện cho situation hiện tại;
- không lặp succession of events;
- phân biệt task / anomaly / alert-information / action;

thì ghi ngắn gọn.

Nếu các rule này chỉ tồn tại ở historical/task docs và chưa đủ authority:
- ghi `NEEDS REVIEW`;
- không nâng thành canonical rule.

Phải dùng Authority Model để quyết định.

---

## 8. Data and ownership

Ghi ngắn:

- Runtime owner
- Today có data owner riêng hay không
- Today đọc repository nào hiện tại
- Today có persistence riêng không

Không copy schema chi tiết.

Nếu Today chỉ là read/aggregation surface:
ghi rõ.

---

## 9. Related modules

Tạo bảng:

| Related module | Current relationship | Future / intended relationship | Source of truth |
|---|---|---|---|

Tối thiểu kiểm tra:

- Reservations
- Establishment / service periods
- Reputation
- Personnel
- Planning
- Pointage
- Tâches du jour
- Stock / Inventaire
- Fournisseurs
- Compliance nếu source có

Không invent relation chỉ vì module tồn tại.

---

## 10. Current limitations / non-goals

Tối thiểu làm rõ:

- Today không thay thế module nguồn;
- Today không được bypass permissions của module nguồn;
- chưa tích hợp module nào thì phải ghi rõ;
- code existence không đồng nghĩa production deployment;
- không suy ra alert/action engine nếu chưa có evidence.

---

## 11. Source map

Tạo bảng:

| Question | Read this source |
|---|---|

Phải route agent tới:
- Today Product Knowledge Home
- Today page pack
- Reservations/booking source
- Establishment/service period source
- Reputation source
- MODULE_REGISTRY
- AUTHORITY_MODEL
- LIFECYCLE_STATUS_MODEL
- current Today code
- PRODUCTION_READINESS nếu cần

Không duplicate nội dung source.

---

## 12. Agent interpretation rules

Tối thiểu:

1. Today is an aggregation surface, not a new source of truth.
2. Do not infer an integration from navigation or a planned card.
3. Do not duplicate source-module records in Today.
4. Do not bypass source-module permissions.
5. Separate current implementation from broader Product Intent.
6. Do not infer Product Decision from code.
7. When sources conflict, use Authority Model and mark NEEDS REVIEW.
8. OpenSpec is not currently normative for Today.

---

## 13. OpenSpec position

Ghi ngắn:

- hiện chưa có normative Today OpenSpec spec;
- file này giữ Product Knowledge context và module relationships;
- approved OpenSpec specs sau này sẽ mô tả behavioral requirements cụ thể;
- không tạo OpenSpec artifacts ở bước này.

---

## 14. Status

Cuối file:

`Status: PROPOSED FOR REVIEW`

Không tự chuyển thành APPROVED.

---

# File phụ được phép cập nhật

Sau khi tạo Today home, chỉ được cập nhật tối thiểu:

1. `docs/PRODUCT_KNOWLEDGE.md`
2. `docs/MODULE_REGISTRY.md`
3. `docs/README.md`

Chỉ update routing/link.

## `docs/PRODUCT_KNOWLEDGE.md`
Today phải trỏ tới:
`docs/features/today/README.md`

## `docs/MODULE_REGISTRY.md`
Ở row Today:
- update Primary Knowledge Source để ưu tiên home mới khi phù hợp;
- không đổi lifecycle status chỉ vì tạo home;
- giữ Review Marker hiện có nếu unresolved Product Decision hoặc evidence chưa được giải quyết;
- giữ `Status: APPROVED`.

## `docs/README.md`
Thêm link tới Today Product Knowledge Home ở vị trí phù hợp nếu cần.

Không sửa page pack.
Không sửa CURRENT_STATE.
Không sửa code.

---

# Validation

Sau khi tạo:

1. Confirm README là entry point dễ hiểu.
2. Confirm Today được mô tả là aggregation surface, không phải data owner mới.
3. Confirm current implementation và future Product Intent tách rõ.
4. Confirm relation tới Reservations / Establishment / Reputation rõ.
5. Confirm Planning / Pointage / Tasks / Stock chỉ được ghi future nếu chưa implemented.
6. Confirm lifecycle summary không suy đoán.
7. Confirm routing đã cập nhật.
8. Confirm không code nào thay đổi.
9. Chạy relevant docs/format checks.

Report:
- files created/modified;
- capability map;
- source-of-truth boundaries;
- routing updates;
- unresolved markers;
- validation results.

Không start Step 5.3.

Dừng sau Step 5.2 và chờ review.
