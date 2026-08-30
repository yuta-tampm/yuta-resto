# YUTA — Informations générales: Page Knowledge Integration Audit

## Mục tiêu

Đối chiếu tài liệu Product Knowledge được tổng hợp từ conversation ChatGPT:

`docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE_SOURCE.md`

với current YUTA repository knowledge trước khi đưa nó vào vị trí canonical.

Tài liệu source này là **input từ Product discussion**, chưa phải current repository authority.

Không merge ngay.
Không sửa Product Knowledge hiện tại.
Không tạo OpenSpec change/spec.
Không sửa code.

Output duy nhất:

`docs/INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_REVIEW.md`

---

## 1. Sources phải đọc

Đọc tối thiểu:

- `docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE_SOURCE.md`
- `docs/features/establishment/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- page pack hiện tại của `establishment-general-information`
- accepted ADR / architecture / tenancy / identity-access sources liên quan
- current code/tests/schema chỉ khi cần xác minh Implemented State

Không suy luận current Product Decision từ code.

---

## 2. Mục tiêu audit

Với từng nhóm nội dung trong source document, phân loại thành một trong:

- `ALREADY_CURRENT`
- `NEW_PRODUCT_INTENT`
- `IMPLEMENTED_EVIDENCE_ONLY`
- `CONFLICT`
- `NEEDS_REVIEW`
- `OTHER_OWNER`

Không tự resolve `CONFLICT`.
Không tự promote `NEW_PRODUCT_INTENT` thành APPROVED.

---

## 3. Các điểm bắt buộc phải đối chiếu

### A. Vai trò của page

Đối chiếu `Restaurant Knowledge Hub` với current bounded Establishment Product Knowledge.

### B. Establishment vs Organization/company/legal data

Đối chiếu ownership của raison sociale, forme juridique, SIREN/SIRET, TVA, siège, représentant légal, administrative contact.

### C. Fields hiện tại

Đối chiếu name, address, phone, email, website, public contacts, description, logo/cover references, languages, service modes, visibility, locale/timezone/status/slug.

### D. Roles / permissions

Đối chiếu profile read/manage và OWNER / MANAGER / STAFF từ current authorization evidence.

### E. Organization / establishment scope + runtime/data boundary

Đối chiếu Cloud Establishment, `packages/db-cloud`, trusted server-derived scope, Organization parent boundary, POS-local separation, Display separation.

### F. Other module relationships

Kiểm tra Booking, Reputation / Direct Feedback, Personnel, Today, Public Website, POS / Site Agent, Marketing/content, Formalités.

### G. AI knowledge suggestions

Đánh giá:
- learn something to YUTA
- infer potential knowledge from replies/corrections
- human validation
- public/internal/administrative knowledge classes
- history/provenance

Không thiết kế provider/schema/API/storage.

---

## 4. Kết quả mong muốn

Report cần có:

### Executive conclusion

Một trong:

- `SAFE_TO_INTEGRATE_WITH_BOUNDED_UPDATES`
- `PRODUCT_REVIEW_REQUIRED_BEFORE_INTEGRATION`
- `CONFLICT_RESOLUTION_REQUIRED`
- `NOT_READY`

### Reconciliation matrix

| Source section / claim | Classification | Current authority/evidence | Recommended treatment |
|---|---|---|---|

### Confirmed current page context

### New Product Intent register

### Conflicts

### NEEDS REVIEW

### Proposed canonical home

Ưu tiên:

`docs/features/establishment/general-information/README.md`

nếu audit xác nhận page thuộc Establishment.

### Relationship to Establishment home

- module home không bị thay thế;
- page home là page-level context;
- OpenSpec analysis phải đọc cả hai.

### OpenSpec readiness

Trả lời có thể bắt đầu pilot change chưa; nếu chưa thì blocker nào cần resolve.

---

## 5. Không được làm

Không sửa current Product Knowledge, không tạo canonical page home, không tạo OpenSpec change/spec, không sửa schema/config/skills/code.

---

## 6. Allowed repository change

Chỉ tạo:

`docs/INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_REVIEW.md`

Cuối file:

`Status: PROPOSED FOR REVIEW`

Dừng sau report.
