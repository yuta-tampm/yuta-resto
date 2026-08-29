# YUTA — Step 5.5: Site Agent Product Knowledge Home

## Mục tiêu
Tạo Product Knowledge Home cho Site Agent, runtime dịch vụ local phục vụ YUTA POS.

Output chính:
`docs/products/pos/site-agent/README.md`

Nếu thư mục chưa tồn tại, được phép tạo.

Mục tiêu là giúp agent hiểu:
- Site Agent là gì;
- ranh giới giữa `apps/yuta-pos` và `apps/site-agent`;
- Site Agent sở hữu local persistence/mutations/realtime/printing/device boundary nào;
- `packages/db-pos` thuộc runtime nào;
- dữ liệu nào không được đưa lên cloud;
- relation với POS UI, Kitchen, Payments, Printing, Reports, Catalog;
- current implementation là gì;
- production/site readiness khác repository implementation thế nào.

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
12. `docs/products/pos/README.md`
13. `docs/products/pos/PRODUCT_SPEC.md`
14. `docs/products/pos/OFFLINE_STRATEGY.md`
15. `docs/products/pos/QA_CHECKLIST.md`
16. `docs/operations/PRODUCTION_READINESS.md`

Đọc các POS page packs liên quan khi cần và kiểm tra:
- `apps/site-agent`
- `apps/yuta-pos`
- `packages/db-pos`
- relevant contracts
- routes/services
- printing/device services
- realtime/SSE
- local auth
- tests

## Vai trò của file
Sau review, đây là canonical Product Knowledge Home cho Site Agent.
Không thay thế POS Product Knowledge, database architecture, code/tests, deployment/operations docs, hardware evidence hay OpenSpec specs sau này.

## Nội dung bắt buộc

### 1. Purpose
Giải thích Site Agent là local service boundary cho POS; POS UI gọi qua HTTP/contracts; Site Agent sở hữu local persistence/mutations theo boundary hiện tại; không phải cloud API.

### 2. Runtime boundary
Sơ đồ ngắn:
`apps/yuta-pos -> HTTP/contracts -> apps/site-agent -> packages/db-pos`

Làm rõ:
- yuta-pos = client/UI
- site-agent = authoritative local service boundary
- browser/UI không trực tiếp sở hữu DB
- persistence/mutations đi qua Site Agent theo boundary được approve

### 3. Current bounded scope
Xác minh các capability hiện có:
- POS API boundary
- local persistence
- order mutations
- payment transaction boundary
- kitchen read/event boundary
- catalog/management mutations
- printing queue/jobs/worker coordination
- local auth/session
- reports read models
- realtime/SSE
- device/printer integration
- health/readiness nếu có

Không liệt kê từng route.

### 4. Capability map
Bảng:
| Capability / Scope | Site Agent responsibility | Consumer |
|---|---|---|

Tối thiểu xem xét Orders, Payments, Kitchen, Printing, Catalog, Reports, Local users/auth, Realtime, Health/readiness, Device integration.

### 5. Lifecycle summary
Dùng đúng 5 dimensions từ `docs/LIFECYCLE_STATUS_MODEL.md`.

Bảng:
| Capability / Scope | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review Marker |
|---|---|---|---|---|---|---|

Ít nhất một row cho Site Agent local runtime boundary.
Ưu tiên reuse status đã APPROVED trong `docs/MODULE_REGISTRY.md`.
Nếu tách thêm capability thì không tự gán Product Decision mới; thiếu evidence → `—` + `NEEDS REVIEW`.

### 6. Data ownership
Bảng:
| Data / concern | Owner | Notes |
|---|---|---|

Tối thiểu xác minh:
- local POS establishment/config
- local users/sessions
- catalog
- orders
- payments
- kitchen state/read model
- print jobs/settings
- reports/read models

Làm rõ:
- `packages/db-pos` là persistence boundary của Site Agent
- POS browser/UI không sở hữu database
- cloud `packages/db-cloud` không sở hữu POS operational data
- Display DB không liên quan

### 7. Cloud boundary
Làm rõ theo authority:
- POS operational data không tự sync lên cloud
- Site Agent không trở thành cloud sync worker nếu chưa approved
- cloud membership/user model không thay POS local users
- cloud Establishment và local POS establishment/config là bounded contexts riêng
- không invent cloud↔local sync

### 8. Failure and resilience boundary
Nếu source hỗ trợ:
- Site Agent là local failure boundary
- POS UI phụ thuộc local service
- local DB/runtime outage khác cloud outage
- printing/device failure xử lý local
- browser offline emergency mode nếu chưa có thì không gọi implemented

### 9. Printing / device boundary
Làm rõ:
- Site Agent sở hữu print-job/device interaction nếu đúng
- physical printer acceptance là site/device-specific evidence
- `IMPLEMENTED` trong repo không đồng nghĩa printer ready ở mọi restaurant
- hardware readiness theo External Dependency / Production Readiness model

### 10. Security / local auth boundary
Xác minh:
- local users ≠ cloud users
- local roles/session model
- Site Agent enforce local server-side authority
- browser values không tự tạo quyền
- không có cloud identity federation nếu chưa approved

### 11. Related modules
Bảng:
| Related module/runtime | Relationship | Source of truth / direction |
|---|---|---|

Tối thiểu: YUTA POS, Orders, Payments, Kitchen, Printing, Catalog, Reports, Local users/auth, Cloud Backoffice, Display.

### 12. Current limitations / non-goals
Làm rõ:
- no cloud sync of POS operational data
- no direct browser DB access
- no guarantee of hardware readiness from repository code
- no cloud identity federation
- no Display persistence sharing
- repository implementation ≠ site deployment
- local service ≠ offline browser operation

### 13. Source map
Bảng:
| Question | Read this source |
|---|---|

Route tới Site Agent home, POS Product Knowledge, DATABASE_BOUNDARIES, ADR/runtime decisions, MODULE_REGISTRY, AUTHORITY_MODEL, LIFECYCLE_STATUS_MODEL, Site Agent code, db-pos, POS page packs, PRODUCTION_READINESS, deployment/operations docs.

### 14. Agent interpretation rules
1. `apps/yuta-pos` is not the POS database owner.
2. `apps/site-agent` is the local service boundary.
3. Do not use `packages/db-pos` directly from browser UI if architecture forbids it.
4. Do not sync POS operational data to cloud without approved decision.
5. Do not merge cloud users with POS local users.
6. Do not treat repository implementation as site/hardware readiness.
7. Do not infer Product Decision from code.
8. When sources conflict, use Authority Model and mark NEEDS REVIEW.
9. OpenSpec is not currently normative for Site Agent.

### 15. OpenSpec position
Ghi ngắn:
- chưa có normative Site Agent OpenSpec spec
- home này giữ runtime/data/failure-boundary context
- approved OpenSpec specs sau này mô tả behavioral requirements
- accepted runtime/database decisions vẫn là durable boundary authority

### 16. Status
Cuối file:
`Status: PROPOSED FOR REVIEW`

## File phụ được phép cập nhật
Chỉ được cập nhật tối thiểu:
1. `docs/PRODUCT_KNOWLEDGE.md`
2. `docs/MODULE_REGISTRY.md`
3. `docs/README.md`
4. `docs/products/pos/README.md`

Chỉ update routing/link.

- `docs/PRODUCT_KNOWLEDGE.md`: Site Agent trỏ tới `docs/products/pos/site-agent/README.md`
- `docs/MODULE_REGISTRY.md`: Site Agent row ưu tiên home mới; không đổi lifecycle; giữ `Status: APPROVED`
- `docs/README.md`: thêm link nếu cần
- `docs/products/pos/README.md`: chỉ thêm link/routing tới Site Agent Home

Không sửa architecture docs.
Không sửa CURRENT_STATE.
Không sửa code.

## Validation
1. POS UI vs Site Agent boundary rõ.
2. Site Agent vs `packages/db-pos` ownership rõ.
3. cloud/POS data boundary rõ.
4. local users ≠ cloud users.
5. printing/device readiness is site-specific.
6. repository implementation ≠ deployment.
7. lifecycle summary không suy đoán.
8. routing đã cập nhật.
9. không code nào thay đổi.
10. chạy relevant docs/architecture/format checks.

Report:
- files created/modified
- runtime boundary
- capability map
- data ownership
- cloud/local separation
- routing updates
- unresolved review markers
- validation results

Không start Step 5.6.
Dừng sau Step 5.5 và chờ review.
