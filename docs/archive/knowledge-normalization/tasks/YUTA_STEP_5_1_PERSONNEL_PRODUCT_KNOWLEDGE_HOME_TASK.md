# YUTA — Step 5.1: Personnel Product Knowledge Home

## Mục tiêu
Tạo Product Knowledge Home (tài liệu chính để bắt đầu hiểu module) cho Personnel / Salariés.

Output chính:
`docs/features/personnel/README.md`

Nếu thư mục chưa tồn tại, được phép tạo.

## Nguồn phải đọc
1. `AGENTS.md`
2. `docs/AUTHORITY_MODEL.md`
3. `docs/LIFECYCLE_STATUS_MODEL.md`
4. `docs/MODULE_REGISTRY.md`
5. `docs/PRODUCT_KNOWLEDGE.md`
6. `docs/CURRENT_STATE.md`
7. `docs/operations/PRODUCTION_READINESS.md`
8. `docs/ui/pages/backoffice-equipe-salaries/README.md`
9. `docs/ui/pages/backoffice-equipe-registre-personnel/README.md`
10. `docs/ui/pages/backoffice-equipe-formalites-personnel/README.md`
11. Các decision/ADR liên quan nếu có.

Kiểm tra code khi cần xác minh Implemented State:
- `apps/backoffice/src/app/(authenticated)/equipe/salaries`
- `apps/backoffice/src/app/(authenticated)/equipe/registre-personnel`
- `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel`
- personnel guards/runtime restrictions
- `packages/db-cloud` personnel schemas/repositories
- relevant tests

## Vai trò của file
`docs/features/personnel/README.md` là canonical Product Knowledge home cho Personnel.
Nó không thay thế page packs, code, schema, production-readiness evidence hay OpenSpec specs sau này.

## Nội dung bắt buộc

### 1. Purpose
Giải thích ngắn module Personnel dùng để làm gì.

### 2. Users / roles
Chỉ ghi role có authority/source hỗ trợ. Không suy đoán.

### 3. Scope
Tách:
- Current bounded scope
- Development-only scope
- Future / proposed scope

### 4. Capability map
Tối thiểu xem xét:
- Employee dossier / Salariés
- Personnel documents
- Registre du personnel
- Formalités development prototype
- Durable Formalités lifecycle
- Planning relation
- Pointage relation
- Tâches du jour relation nếu có evidence

Không copy route/API dài.

### 5. Lifecycle summary
Dùng đúng 5 dimensions từ `docs/LIFECYCLE_STATUS_MODEL.md`.

Bảng:
| Capability | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review Marker |
|---|---|---|---|---|---|---|

Ưu tiên reuse các status đã APPROVED trong `docs/MODULE_REGISTRY.md`.
Không tự gán khi thiếu evidence.

### 6. Business boundaries
Ghi các boundary có bằng chứng:
- Personnel là nguồn hồ sơ nhân viên nếu source hỗ trợ;
- Formalités depends on Personnel;
- Planning/Pointage liên hệ Personnel nhưng không tự duplicate identity nếu source-of-truth đã rõ;
- Register phụ thuộc Personnel data;
- development prototype không được coi là durable capability;
- production/legal/privacy gates tách khỏi repository implementation.

Không phát minh business rule mới.

### 7. Data and ownership
Ghi ngắn:
- Runtime owner
- Data owner
- persistence boundary
- development-only in-memory capability nếu có

Không copy schema chi tiết.

### 8. Related modules
Bảng:
| Related module | Relationship | Source of truth / direction |
|---|---|---|

Kiểm tra:
- Formalités
- Registre du personnel
- Planning
- Pointage
- Today
- Documents
- Tâches du jour

### 9. Current limitations / non-goals
Chỉ ghi những gì source hỗ trợ, ví dụ:
- durable Formalités chưa implemented;
- approved legal templates/signature/production OCR-AI chưa sẵn sàng nếu đúng;
- production gates còn block nếu đúng.

### 10. Source map
Bảng:
| Question | Read this source |
|---|---|

Phải route agent tới:
- Personnel Product Knowledge Home
- Salariés page pack
- Registre page pack
- Formalités page pack
- PRODUCTION_READINESS
- Backoffice code + db-cloud personnel repositories
- MODULE_REGISTRY
- AUTHORITY_MODEL

### 11. Agent interpretation rules
Tối thiểu:
1. Không coi page pack là Product Intent authority cho toàn module.
2. Không coi code existence là production-ready.
3. Không coi development prototype là durable capability.
4. Không coi `planned` là Product Decision status.
5. Khi conflict, dùng Authority Model + NEEDS REVIEW.
6. Không duplicate Personnel identity/data sang module khác khi source-of-truth đã rõ.
7. OpenSpec hiện chưa normative.

### 12. OpenSpec position
- hiện chưa có normative Personnel OpenSpec spec;
- file này là Product Knowledge context;
- approved OpenSpec specs sau này sẽ mô tả behavioral requirements cụ thể;
- không tạo OpenSpec artifacts ở bước này.

### 13. Status
Cuối file:
`Status: PROPOSED FOR REVIEW`

## File phụ được phép cập nhật
Sau khi tạo home, chỉ được cập nhật tối thiểu:
1. `docs/PRODUCT_KNOWLEDGE.md`
2. `docs/MODULE_REGISTRY.md`
3. `docs/README.md`

Chỉ cập nhật routing/link để trỏ tới Product Knowledge Home mới.
Không rewrite các file này.
Không sửa page packs.
Không sửa code.
Không sửa `CURRENT_STATE.md`; nếu phát hiện conflict mới thì chỉ report NEEDS REVIEW.

## Routing updates
- `docs/PRODUCT_KNOWLEDGE.md`: Personnel phải trỏ tới `docs/features/personnel/README.md`.
- `docs/MODULE_REGISTRY.md`: các row Personnel phù hợp cập nhật `Primary Knowledge Source` để ưu tiên home mới. Không đổi lifecycle status chỉ vì tạo home. Giữ `Status: APPROVED`.
- `docs/README.md`: thêm link ở vị trí hợp lý nếu cần.

## Validation
1. README là entry point dễ hiểu.
2. Không duplicate page-pack history.
3. Formalités prototype và durable lifecycle tách riêng.
4. Personnel vs Planning/Pointage/Register relationships rõ.
5. Lifecycle status khớp Module Registry.
6. Routing đã cập nhật.
7. Không code nào thay đổi.
8. Chạy docs/format checks liên quan.

Report:
- files created/modified;
- capability map;
- routing updates;
- unresolved review markers;
- validation results.

Không start Step 5.2.
Dừng sau Step 5.1 và chờ review.
