# YUTA — Step 6.2D1: Public Booking Product Spec Authority Review

## Mục tiêu

Review `docs/features/public-booking/PRODUCT_SPEC.md` để xác định phần nào vẫn là
**current Product Intent** (ý định sản phẩm hiện hành), phần nào là kiến trúc/kỹ
thuật đã bị superseded (được thay thế), và cách xử lý tài liệu này an toàn trong
Documentation Cleanup.

Đây là **review-only**.

Không sửa `PRODUCT_SPEC.md`.
Không move/archive/delete file.
Không sửa code.
Không sửa OpenSpec.

---

## Nguồn phải đọc

1. `AGENTS.md`
2. `docs/AUTHORITY_MODEL.md`
3. `docs/LIFECYCLE_STATUS_MODEL.md`
4. `docs/MODULE_REGISTRY.md`
5. `docs/PRODUCT_KNOWLEDGE.md`
6. `docs/CURRENT_STATE.md`
7. `docs/DOCUMENTATION_CLEANUP_AUDIT.md`
8. `docs/features/public-booking/README.md`
9. `docs/features/public-booking/STATUS.md`
10. `docs/features/public-booking/PRODUCT_SPEC.md`
11. ADR-002 và các accepted runtime/database decisions liên quan
12. relevant Booking architecture / schema / contracts / code khi cần xác minh

---

## Output duy nhất

Tạo:

`docs/features/public-booking/PRODUCT_SPEC_REVIEW.md`

Không sửa file nào khác.

---

## Mục tiêu phân tích

Phân loại nội dung của `PRODUCT_SPEC.md` thành:

### `KEEP_CURRENT_INTENT`
Vẫn là Product Intent hiện hành và unique.

### `ROUTE_TO_CURRENT_SOURCE`
Nội dung vẫn đúng nhưng đã có source current/cụ thể hơn.

### `SUPERSEDED_ARCHITECTURE`
Chi tiết kỹ thuật/architecture đã bị accepted ADR/current architecture thay thế.

### `HISTORICAL_CONTEXT`
Không còn current authority nhưng có giá trị lịch sử/provenance.

### `NEEDS_REVIEW`
Chưa đủ authority để quyết định.

Không dùng `DELETE` trong review này.

---

## Nội dung bắt buộc của review

### 1. Executive summary
- vai trò hiện tại của PRODUCT_SPEC;
- có còn unique Product Intent không;
- mức độ architecture superseded;
- recommendation sơ bộ: UPDATE IN PLACE | SPLIT | KEEP AS-IS | NEEDS REVIEW.

### 2. Section inventory

Bảng:

| PRODUCT_SPEC section | Current role | Classification | Current source / destination | Confidence |
|---|---|---|---|---|

### 3. Unique Product Intent map

Liệt kê requirement/product intent vẫn unique trong PRODUCT_SPEC.

Bảng:

| Intent / requirement group | Still current? | Already represented elsewhere? | Recommended home |
|---|---|---|---|

Không copy dài nội dung spec.

### 4. Superseded architecture map

Bảng:

| Technical/architecture topic | Why superseded | Current authority |
|---|---|---|

Ưu tiên:
- runtime ownership
- public booking app boundary
- persistence ownership
- tenancy
- server/client boundaries
- deployment assumptions

### 5. Current-vs-future separation

Chỉ ra phần nào:
- implemented bounded scope;
- approved future intent;
- proposed/unresolved;
- historical.

Không tự đổi lifecycle status.

### 6. Recommended treatment

Chọn một recommendation:

#### Option A — UPDATE IN PLACE
Giữ PRODUCT_SPEC nhưng:
- bỏ/simplify superseded architecture;
- giữ durable Product Intent;
- thêm routing tới current architecture/spec sources.

#### Option B — SPLIT
Tách:
- current/durable Product Intent;
- historical architecture/provenance.

#### Option C — KEEP AS-IS
Chỉ khi file đã rõ ràng và không gây agent confusion.

#### Option D — NEEDS REVIEW
Nếu chưa đủ authority.

Phải giải thích.

### 7. OpenSpec future role

Ghi ngắn:
- khi OpenSpec normative, behavioral requirements cụ thể nên chuyển sang approved specs;
- PRODUCT_SPEC có thể giữ broader product intent/non-goals/context;
- OpenSpec không tự supersede accepted decisions.

### 8. Proposed execution scope

Nếu recommendation là UPDATE/SPLIT:
- file nào được sửa ở bước sau;
- phần nào protected;
- link nào phải update;
- validation nào cần chạy.

### 9. Status

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

## Validation

1. Confirm chỉ `PRODUCT_SPEC_REVIEW.md` được tạo.
2. Confirm `PRODUCT_SPEC.md` chưa bị sửa.
3. Confirm không lifecycle status bị thay.
4. Confirm accepted ADR/current architecture được dùng đúng authority.
5. Confirm unique Product Intent không bị đề xuất bỏ mà không có destination.

Report kết quả rồi dừng.
Không bắt đầu execution và không review POS Product Spec trong cùng task.
