# YUTA — Step 6.2A: Index Truthfulness Cleanup

## Mục tiêu

Thực hiện batch cleanup đầu tiên đã được `docs/DOCUMENTATION_CLEANUP_AUDIT.md` xác định là an toàn:

**chỉ sửa các index/routing docs hiện hành để phản ánh đúng trạng thái đã được approve.**

Đây là batch thực thi đầu tiên của Documentation Cleanup.

Không move/archive/delete file.
Không slim `CURRENT_STATE.md`.
Không sửa Product Spec.
Không sửa page-pack nội dung ngoài index.
Không sửa code.
Không sửa OpenSpec.

---

## Nguồn phải đọc

1. `AGENTS.md`
2. `docs/DOCUMENTATION_CLEANUP_AUDIT.md`
3. `docs/AUTHORITY_MODEL.md`
4. `docs/LIFECYCLE_STATUS_MODEL.md`
5. `docs/MODULE_REGISTRY.md`
6. `docs/PRODUCT_KNOWLEDGE.md`
7. `docs/README.md`
8. `docs/ui/pages/README.md`

Đọc các Product Knowledge Homes và approved decisions chỉ khi cần xác minh routing/status:

- Personnel
- Today
- Establishment
- Identity / Access
- Site Agent
- Display
- ADR-001 ... ADR-006

---

## Chỉ được sửa 3 file

1. `docs/README.md`
2. `docs/PRODUCT_KNOWLEDGE.md`
3. `docs/ui/pages/README.md`

Không sửa file nào khác.

---

# 1. `docs/README.md`

Mục tiêu:
- bỏ hoặc sửa universal authority order (thứ tự ưu tiên nguồn duy nhất) nếu còn tồn tại;
- route người đọc tới `docs/AUTHORITY_MODEL.md` để xác định authority theo loại câu hỏi;
- route tới `docs/PRODUCT_KNOWLEDGE.md` và `docs/MODULE_REGISTRY.md` như entry points hiện hành;
- đảm bảo các Product Knowledge Homes đã APPROVED được link đúng;
- không mô tả `CURRENT_STATE.md` như nguồn có authority cao nhất cho mọi câu hỏi;
- accepted ADR/decision phải giữ vai trò đúng theo Authority Model.

Không tạo một authority order mới trong README.
README chỉ nên chỉ đường.

---

# 2. `docs/PRODUCT_KNOWLEDGE.md`

Mục tiêu:
- bỏ các wording kiểu `Proposed canonical` đối với các Product Knowledge Homes đã APPROVED;
- bỏ cảnh báo nói repo chưa có Authority Model/Lifecycle/Registry nếu chúng đã được approve;
- cập nhật routing tới:
  - `AUTHORITY_MODEL.md`
  - `LIFECYCLE_STATUS_MODEL.md`
  - `MODULE_REGISTRY.md`
  - approved Product Knowledge Homes
- giữ file này là navigation/entry point, không copy business rules vào đây;
- nếu header/status của file vẫn là proposed nhưng nội dung hiện đã đủ để trở thành current routing layer, chỉ đổi status khi evidence và repo convention cho phép.

Nếu chưa đủ authority để tự đổi status:
- giữ status hiện tại;
- report `NEEDS REVIEW`.

Không tự invent Product Decision.

---

# 3. `docs/ui/pages/README.md`

Mục tiêu:
- sửa chỉ các stale current summaries / backlog wording đã được Cleanup Audit chỉ ra;
- đảm bảo Formalités, POS Printing, POS Catalog/Combos summary phản ánh current individual page-pack state;
- không nâng page-pack evidence thành Product Intent authority;
- không rewrite page-pack history;
- không sửa individual page packs;
- không xóa phase history;
- nếu index chứa dated backlog đã lỗi thời, cập nhật hoặc route tới current source thay vì giữ statement sai.

Giữ vai trò của file là UI page-pack index/routing layer.

---

# Không được làm

Không:
- sửa `CURRENT_STATE.md`;
- sửa `KNOWLEDGE_AUDIT.md`;
- archive task files;
- tạo `docs/archive/`;
- merge/delete duplicate prompts;
- sửa booking/POS `PRODUCT_SPEC.md`;
- sửa `PRODUCTION_READINESS.md`;
- sửa Product Knowledge Homes đã approved;
- sửa ADR/architecture;
- sửa code;
- sửa OpenSpec.

---

# Validation

Sau khi sửa:

1. Search `docs/README.md`, `docs/PRODUCT_KNOWLEDGE.md`, `docs/ui/pages/README.md`
   để đảm bảo không còn pre-approval wording đã lỗi thời.
2. Confirm `docs/README.md` không còn một universal authority order trái với `AUTHORITY_MODEL.md`.
3. Confirm all approved Product Knowledge Homes được route đúng.
4. Confirm UI page index không còn stale lifecycle summary đã được audit xác định.
5. Confirm không file nào ngoài 3 file cho phép bị sửa.
6. Run:
   - `pnpm docs:check`
   - `pnpm architecture:check`
   - targeted Prettier
   - inbound-link check nếu repo có tool/script tương ứng.

---

# Báo cáo cuối

Report:
- 3 file đã sửa;
- wording cũ -> wording mới;
- routing changes;
- stale status/index entries corrected;
- validation results;
- any remaining `NEEDS REVIEW`.

Dừng sau Step 6.2A.
Không bắt đầu `CURRENT_STATE` slimming.
