# YUTA — Step 5.6: Display Product Knowledge Home

## Mục tiêu

Tạo **Product Knowledge Home** (tài liệu chính để bắt đầu hiểu module) cho **YUTA Display**.

Output chính:

`docs/products/display/README.md`

Nếu thư mục chưa tồn tại, được phép tạo.

Mục tiêu là giúp agent hiểu rõ:

- Display là sản phẩm/runtime gì;
- Display độc lập với Cloud và POS ở mức nào;
- Display sở hữu dữ liệu gì;
- admin và playback (phát nội dung) hoạt động trong cùng bounded context nào;
- media upload/playlist/playback/resilience hiện có đến đâu;
- current implementation khác deployment/device readiness thế nào;
- source nào cần đọc nếu muốn đi sâu.

Đây là **Step 5.6 của Knowledge Normalization**.

Không refactor toàn bộ docs.
Không sửa code.
Không custom OpenSpec.
Không tạo OpenSpec change/spec.

## Nguồn bắt buộc phải đọc

1. `AGENTS.md`
2. `docs/AUTHORITY_MODEL.md`
3. `docs/LIFECYCLE_STATUS_MODEL.md`
4. `docs/MODULE_REGISTRY.md`
5. `docs/PRODUCT_KNOWLEDGE.md`
6. `docs/CURRENT_STATE.md`
7. `docs/REPOSITORY_MAP.md`
8. `docs/architecture/OVERVIEW.md`
9. `docs/architecture/DATABASE_BOUNDARIES.md`
10. `docs/architecture/DATA_MODEL.md`
11. relevant accepted ADR/decision về runtime/database ownership
12. `docs/operations/PRODUCTION_READINESS.md`
13. deployment/operations docs liên quan tới Display
14. nearest `AGENTS.md` trong `apps/yuta-display` nếu có

Kiểm tra code khi cần xác minh Implemented State:

- `apps/yuta-display`
- `apps/yuta-display/src/app`
- `apps/yuta-display/src/db`
- media/upload APIs
- playlist/admin behavior
- playback behavior
- resilience/fallback logic
- relevant tests

Tuân thủ root và nested `AGENTS.md`.

## Vai trò của `docs/products/display/README.md`

Sau khi review, đây sẽ là **canonical Product Knowledge Home** cho Display.

Nó không thay thế executable schema, code/tests, deployment/operations docs, device/site evidence, hay OpenSpec specs sau này.

## Nội dung bắt buộc

### 1. Purpose
Giải thích ngắn:
- Display là standalone local product/runtime;
- dùng để quản lý media/playlist và phát nội dung;
- phải tiếp tục playback qua transient backend/database failure nếu source hiện tại hỗ trợ;
- không phải Cloud Backoffice;
- không phải POS;
- không dùng chung DB với Cloud hoặc POS.

### 2. Runtime boundary
Tạo sơ đồ text ngắn nếu phù hợp:

`Display admin / playback -> apps/yuta-display -> apps/yuta-display/src/db`

Làm rõ:
- Display app tự sở hữu runtime và persistence;
- không phụ thuộc `packages/db-cloud` hoặc `packages/db-pos`;
- không invent Site Agent dependency;
- không infer synchronization với Establishment/POS/Cloud.

### 3. Current bounded scope
Xác minh các capability hiện có, ví dụ nếu đúng:
- media upload;
- media metadata persistence;
- playlist/order management;
- admin UI;
- playback UI;
- local/app-owned storage;
- fallback/resilience khi backend/database tạm lỗi;
- health/readiness nếu có.

Không liệt kê từng route.

### 4. Capability map
Bảng:
| Capability / Scope | Current boundary | Owner |
|---|---|---|

Tối thiểu xem xét Media upload, Media metadata, Playlist management, Playback, Resilience/fallback, Admin, Storage/database.

Nếu chưa đủ evidence: ghi `NEEDS REVIEW`, không đoán.

### 5. Lifecycle summary
Dùng đúng 5 dimensions từ `docs/LIFECYCLE_STATUS_MODEL.md`.

Bảng:
| Capability / Scope | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review Marker |
|---|---|---|---|---|---|---|

Ít nhất một row cho Display bounded product/runtime.
Ưu tiên reuse status từ `docs/MODULE_REGISTRY.md`.
Nếu tách thêm capability: không tự gán Product Decision mới; thiếu evidence → `—` + `NEEDS REVIEW`.

### 6. Data ownership
Bảng:
| Data / concern | Owner | Notes |
|---|---|---|

Tối thiểu xác minh:
- media metadata;
- playlist/order;
- local file/media storage nếu có;
- playback state nếu persisted;
- transient cache/state nếu có.

Làm rõ:
- `apps/yuta-display/src/db` là app-owned persistence boundary;
- Cloud DB không sở hữu Display data;
- POS DB không sở hữu Display data;
- Site Agent không sở hữu Display data/device boundary.

Không copy schema field-by-field.

### 7. Cloud / POS separation
Làm rõ:
- Display là bounded context riêng;
- không dùng `packages/db-cloud`;
- không dùng `packages/db-pos`;
- không có approved synchronization với Cloud Establishment hoặc POS;
- không được tự join/copy data giữa các runtime;
- future integration cần accepted decision riêng.

### 8. Playback and resilience boundary
Nếu source hỗ trợ, giải thích:
- authoritative persisted playlist/media source;
- playback lấy state thế nào;
- transient backend/database failure được xử lý thế nào;
- cached/last-known state có vai trò gì nếu có;
- resilience không đồng nghĩa vô hạn offline;
- repository implementation không chứng minh device deployment.

Không invent behavior nếu source không hỗ trợ.

### 9. Media/storage boundary
Làm rõ nếu source hỗ trợ:
- upload path;
- metadata owner;
- file storage owner;
- validation/bounds;
- cleanup/deletion semantics nếu hiện có;
- local/device storage vs database metadata.

Nếu retention/cleanup chưa rõ: ghi `NEEDS REVIEW`.

### 10. Security / admin boundary
Xác minh và ghi nếu có:
- admin access model;
- auth hiện có hay không;
- local-only assumptions;
- browser/client values không tự tạo trusted ownership;
- không invent cloud auth integration.

Nếu auth/permissions chưa có Product Knowledge đủ rõ: ghi `NEEDS REVIEW`.

### 11. Related modules/runtimes
Bảng:
| Related module/runtime | Current relationship | Source of truth / direction |
|---|---|---|

Tối thiểu: Cloud Backoffice, Establishment, POS, Site Agent.
Nếu không có relation thật, ghi rõ "no current relationship/synchronization".

### 12. Current limitations / non-goals
Làm rõ khi evidence hỗ trợ:
- no cloud sync;
- no POS DB sharing;
- no Site Agent dependency;
- no guarantee of device/site readiness from repo code;
- resilience != unlimited offline;
- no multi-site/device fleet management unless implemented/approved;
- no remote content management unless source supports it.

### 13. Source map
Bảng:
| Question | Read this source |
|---|---|

Route agent tới Display Product Knowledge Home, Display app code, Display DB/schema, DATABASE_BOUNDARIES, relevant ADR/runtime decisions, MODULE_REGISTRY, AUTHORITY_MODEL, LIFECYCLE_STATUS_MODEL, deployment/operations docs, PRODUCTION_READINESS.

### 14. Agent interpretation rules
1. Treat Display as a separate bounded runtime and persistence domain.
2. Do not use cloud or POS databases for Display data without an accepted decision.
3. Do not infer Site Agent ownership or dependency.
4. Do not infer cloud/POS synchronization.
5. Do not treat repository implementation as device/site readiness.
6. Do not infer Product Decision from code.
7. Separate resilience behavior from unlimited offline guarantees.
8. When sources conflict, use Authority Model and mark NEEDS REVIEW.
9. OpenSpec is not currently normative for Display.

### 15. OpenSpec position
Ghi ngắn:
- hiện chưa có normative Display OpenSpec spec;
- home này giữ product/runtime/data/resilience context;
- approved OpenSpec specs sau này mô tả behavioral requirements cụ thể;
- accepted runtime/database decisions vẫn là durable boundary authority;
- không tạo OpenSpec artifacts ở bước này.

### 16. Status
Cuối file:
`Status: PROPOSED FOR REVIEW`

Không tự chuyển thành APPROVED.

## File phụ được phép cập nhật

Chỉ được cập nhật tối thiểu:
1. `docs/PRODUCT_KNOWLEDGE.md`
2. `docs/MODULE_REGISTRY.md`
3. `docs/README.md`

Chỉ update routing/link.

- `docs/PRODUCT_KNOWLEDGE.md`: Display trỏ tới `docs/products/display/README.md`
- `docs/MODULE_REGISTRY.md`: Display row ưu tiên home mới; không đổi lifecycle chỉ vì tạo home; giữ Review Marker nếu unresolved; giữ `Status: APPROVED`
- `docs/README.md`: thêm link nếu cần

Không sửa architecture docs.
Không sửa CURRENT_STATE.
Không sửa code.

## Validation
1. Confirm Display là bounded runtime riêng.
2. Confirm Display DB ownership rõ.
3. Confirm no cloud/POS DB sharing.
4. Confirm no Site Agent dependency được invent.
5. Confirm playback/resilience wording đúng evidence.
6. Confirm repository implementation ≠ device/site deployment.
7. Confirm lifecycle summary không suy đoán.
8. Confirm routing đã cập nhật.
9. Confirm không code nào thay đổi.
10. Run relevant docs/architecture/format checks.

Report:
- files created/modified;
- runtime boundary;
- capability map;
- data ownership;
- resilience boundary;
- routing updates;
- unresolved review markers;
- validation results.

Không start Step 6.
Dừng sau Step 5.6 và chờ review.
