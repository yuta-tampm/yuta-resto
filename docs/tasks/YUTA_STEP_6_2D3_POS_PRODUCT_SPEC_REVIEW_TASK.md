# YUTA — Step 6.2D3: POS Product Spec Authority Review

## Mục tiêu
Review `docs/products/pos/PRODUCT_SPEC.md` để xác định phần nào vẫn là current Product Intent, phần nào là technical/architecture guidance đã bị source hiện hành thay thế, và cách cleanup an toàn.

Đây là review-only.
Không sửa `PRODUCT_SPEC.md`.
Không move/archive/delete file.
Không sửa code.
Không sửa OpenSpec.

## Nguồn phải đọc
1. `AGENTS.md`
2. `docs/AUTHORITY_MODEL.md`
3. `docs/LIFECYCLE_STATUS_MODEL.md`
4. `docs/MODULE_REGISTRY.md`
5. `docs/PRODUCT_KNOWLEDGE.md`
6. `docs/CURRENT_STATE.md`
7. `docs/DOCUMENTATION_CLEANUP_AUDIT.md`
8. `docs/products/pos/README.md`
9. `docs/products/pos/PRODUCT_SPEC.md`
10. `docs/products/pos/USER_GUIDE.md`
11. `docs/products/pos/OFFLINE_STRATEGY.md`
12. `docs/products/pos/QA_CHECKLIST.md`
13. `docs/products/pos/site-agent/README.md`
14. `docs/operations/PRODUCTION_READINESS.md`
15. ADR-001 / ADR-003 và database/runtime architecture liên quan
16. POS page-pack index và các page pack cần thiết
17. current code/contracts/schema/tests khi cần xác minh

Tuân thủ root và nested `AGENTS.md`.

## Output duy nhất
Tạo:
`docs/products/pos/PRODUCT_SPEC_REVIEW.md`

Không sửa file nào khác.

## Classification
Phân loại nội dung `PRODUCT_SPEC.md` thành:
- `KEEP_CURRENT_INTENT`
- `ROUTE_TO_CURRENT_SOURCE`
- `SUPERSEDED_ARCHITECTURE`
- `HISTORICAL_CONTEXT`
- `NEEDS_REVIEW`

Không dùng `DELETE` trong review này.

## Nội dung bắt buộc

### 1. Executive summary
Trả lời:
- `PRODUCT_SPEC.md` hiện nên giữ vai trò gì?
- Product Intent unique nào vẫn nằm trong đó?
- technical/architecture sections đã superseded đến mức nào?
- recommendation: `UPDATE IN PLACE` | `SPLIT` | `KEEP AS-IS` | `NEEDS REVIEW`

### 2. Section inventory
Bảng:
| PRODUCT_SPEC section | Current role | Classification | Current source / destination | Confidence |
|---|---|---|---|---|

Audit toàn bộ section chính.

### 3. Unique Product Intent map
Bảng:
| Intent / requirement group | Still current? | Already represented elsewhere? | Recommended home |
|---|---|---|---|

Tối thiểu kiểm tra:
- local-first restaurant operation;
- fast order entry;
- order lifecycle;
- kitchen workflow;
- payment / split workflows;
- durable printing;
- local management;
- reports;
- local users / permissions;
- offline / degraded operation;
- hardware/device expectations;
- fiscal/non-fiscal boundaries;
- multi-site / future cloud relationship;
- operator UX principles;
- non-goals;
- future extensibility.

### 4. Superseded architecture map
Bảng:
| Technical/architecture topic | Why superseded | Current authority |
|---|---|---|

Tối thiểu kiểm tra:
- `apps/yuta-pos` vs `apps/site-agent` responsibility;
- `packages/db-pos` ownership;
- browser/server DB boundary;
- cloud/POS separation;
- exact routes/APIs;
- package trees;
- schema/model prescriptions;
- printing/device architecture;
- realtime/SSE implementation;
- local auth implementation;
- deployment assumptions;
- cloud synchronization assumptions.

Accepted ADRs, Site Agent Home, current manifests/code/schema/contracts phải là authority hiện hành cho technical questions.

### 5. Product Intent vs Implemented State
Tách rõ:
- Current bounded repository implementation → route tới POS README, Site Agent Home, page packs, code/tests, Module Registry.
- Broader Product Intent / future direction → giữ trong Product Spec khi vẫn useful.
- Unresolved / separately reviewable → không tự approve.
- Historical → giữ provenance, không gọi current authority.

### 6. Offline / resilience treatment
Đối chiếu `PRODUCT_SPEC.md` với:
- `OFFLINE_STRATEGY.md`
- Site Agent Home
- current PWA/runtime behavior

Phải phân biệt:
- cloud outage resilience;
- local Site Agent/PostgreSQL availability;
- browser-offline emergency mode;
- durable local operations;
- future offline intent.

Không được coi "local-first" là browser-offline nếu current source không hỗ trợ.

### 7. Printing / hardware treatment
Phân biệt:
- Product Intent cho reliable printing/device support;
- repository implementation;
- exact printer/device implementation;
- site/device-specific readiness.

### 8. Cloud / local relationship
Review mọi statement về:
- cloud sync;
- analytics/export;
- cloud user ↔ POS local user;
- cloud Establishment ↔ local POS establishment;
- remote management;
- multi-site.

Nếu current durable boundary nói không sync operational data, Product Spec không được silently override.
Future export/sync intent phải được đánh dấu separately reviewable.

### 9. Recommended treatment
Chọn một:
- Option A — UPDATE IN PLACE
- Option B — SPLIT
- Option C — KEEP AS-IS
- Option D — NEEDS REVIEW

Giải thích vì sao.

### 10. OpenSpec future role
Ghi ngắn:
- Product Spec giữ broader Product Intent/non-goals/context;
- approved OpenSpec specs sau này có thể giữ precise behavioral requirements;
- ADR/runtime/database decisions vẫn là durable authority;
- OpenSpec không tự biến repository implementation thành deployment/readiness.

### 11. Proposed execution scope
Nếu recommendation là UPDATE/SPLIT:
- file nào được phép sửa ở bước sau;
- phần nào protected;
- link nào phải update;
- validation nào cần chạy.

### 12. Status
Cuối file:
`Status: PROPOSED FOR REVIEW`

## Validation
1. Confirm chỉ `docs/products/pos/PRODUCT_SPEC_REVIEW.md` được tạo.
2. Confirm POS `PRODUCT_SPEC.md` chưa bị sửa.
3. Confirm lifecycle statuses không đổi.
4. Confirm ADR/Site Agent/current code được dùng đúng authority cho technical questions.
5. Confirm unique Product Intent không bị đề xuất bỏ nếu chưa có destination.
6. Run docs/architecture/format/link checks phù hợp.

Report:
- recommendation;
- major Product Intent retained;
- superseded architecture groups;
- unresolved areas;
- validation results.

Không bắt đầu execution.
Không bắt đầu UI prompt cleanup.
Không sửa OpenSpec.

Dừng sau Step 6.2D3 và chờ review.
