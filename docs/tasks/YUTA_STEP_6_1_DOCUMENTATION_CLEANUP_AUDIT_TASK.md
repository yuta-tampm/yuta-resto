# YUTA — Step 6.1: Documentation Cleanup Audit

## Mục tiêu

Thực hiện **Documentation Cleanup Audit** (kiểm kê để chuẩn bị dọn dẹp tài liệu) trước khi thật sự move/archive/delete bất kỳ file nào.

Đây là **Step 6.1 của Knowledge Normalization**.

Mục tiêu:
- xác định file nào còn là tài liệu hiện hành;
- file nào cần update;
- file nào trùng nội dung và nên merge;
- file nào chỉ còn giá trị lịch sử và nên archive;
- file nào có thể delete an toàn;
- file nào chưa đủ bằng chứng và phải giữ `NEEDS REVIEW`.

Ở bước này:
- chỉ audit và đề xuất;
- KHÔNG move file;
- KHÔNG delete file;
- KHÔNG merge file;
- KHÔNG rewrite hàng loạt;
- KHÔNG sửa code;
- KHÔNG custom OpenSpec;
- KHÔNG tạo OpenSpec change/spec.

---

## Nguồn bắt buộc phải đọc

Đọc trước:

1. `AGENTS.md`
2. `docs/PRODUCT_KNOWLEDGE.md`
3. `docs/AUTHORITY_MODEL.md`
4. `docs/LIFECYCLE_STATUS_MODEL.md`
5. `docs/MODULE_REGISTRY.md`
6. `docs/DOCUMENTATION_POLICY.md`
7. `docs/README.md`
8. `docs/CURRENT_STATE.md`
9. `docs/REPOSITORY_MAP.md`

Sau đó audit toàn bộ:

- `docs/features/`
- `docs/products/`
- `docs/architecture/`
- `docs/decisions/`
- `docs/operations/`
- `docs/ui/`
- `docs/tasks/`

Có thể dùng Git metadata/tracking và content hash khi cần xác định:
- file trùng hoàn toàn;
- file cũ nhưng vẫn được link;
- file không còn được dùng;
- file generated/history.

Không dùng file modification time một mình để quyết định file mới/cũ.

---

## Output duy nhất được phép tạo

Tạo:

`docs/DOCUMENTATION_CLEANUP_AUDIT.md`

Không sửa file nào khác.

---

# Classification bắt buộc

Mỗi file hoặc nhóm file được audit phải thuộc một trong các classification sau:

## `KEEP`
Tài liệu hiện hành, còn đúng vai trò, nên giữ nguyên vị trí.

## `UPDATE`
Tài liệu hiện hành nhưng còn wording/link/status/index cũ cần chỉnh.

## `MERGE`
Có nội dung trùng hoặc chia nhỏ không còn cần thiết; nên gộp về một source chính.

`MERGE` không có nghĩa được phép merge trong bước này.

## `ARCHIVE`
Không còn là source hiện hành nhưng vẫn có giá trị lịch sử, delivery evidence, decision history, QA evidence, hoặc provenance.

## `DELETE`
File thật sự obsolete (lỗi thời), redundant (trùng dư thừa), generated, hoặc không còn giá trị lịch sử/authority.

Chỉ đề xuất `DELETE` khi bằng chứng rất mạnh.

## `NEEDS REVIEW`
Chưa đủ bằng chứng để quyết định an toàn.

---

# Nguyên tắc bắt buộc

## 1. Không cleanup theo số lượng

Mục tiêu KHÔNG phải giảm số file bằng mọi giá.

Mục tiêu là:
- rõ authority;
- giảm duplication;
- giảm stale docs;
- giữ history có giá trị;
- giúp agent biết phải đọc gì;
- tránh source-of-truth bị phân tán.

## 2. Product Knowledge Homes là entry point hiện hành

Các home đã APPROVED phải được coi là current knowledge entry points:
- Personnel
- Today
- Establishment
- Identity / Access
- Site Agent
- Display

Không được đề xuất archive/delete chúng.

## 3. Page packs

`docs/ui/pages/**` phần lớn là UI delivery evidence (bằng chứng thiết kế/triển khai UI), không tự động là Product Knowledge chính.

Không được delete page pack chỉ vì:
- đã implemented;
- có Product Knowledge Home mới;
- nội dung dài;
- có phase history.

Phải phân loại:
- current UI evidence;
- historical phase evidence;
- duplicated prompt/template;
- obsolete pack.

Nếu page pack vẫn có implementation/design/QA evidence hữu ích:
ưu tiên `KEEP` hoặc `ARCHIVE`, không `DELETE`.

## 4. Task documents

`docs/tasks/**` mặc định là task/history context, không phải source of truth.

Audit:
- task đang active;
- task đã hoàn thành nhưng còn provenance value;
- task hoàn toàn disposable;
- task OpenSpec/Knowledge Normalization mới.

Không delete task chỉ vì completed nếu nó còn cần cho audit trail.

## 5. CURRENT_STATE.md

Đánh giá riêng:
- phần nào vẫn là useful summary;
- phần nào đã được thay thế bởi Product Knowledge Homes;
- phần nào là chronology/history;
- có nên slim down (rút gọn) thay vì archive toàn file.

Không rewrite trong bước này.

## 6. Index files

Audit tối thiểu:
- `docs/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/MODULE_REGISTRY.md`
- `docs/ui/pages/README.md`

Xác định:
- index nào current;
- index nào trùng vai trò;
- link nào stale;
- index nào nên giữ làm routing layer.

## 7. Decision / ADR files

Accepted decisions và ADRs không được `DELETE` chỉ vì có OpenSpec hoặc Product Knowledge Home mới.

Có thể:
- KEEP
- UPDATE links
- ARCHIVE chỉ nếu superseded (được thay thế chính thức) và có decision mới chỉ rõ.

Không tự đánh dấu superseded nếu chưa có bằng chứng.

## 8. Architecture docs

Không delete architecture docs chỉ vì code đã tồn tại.

Phải giữ những tài liệu mô tả:
- durable boundaries;
- data ownership;
- tenancy/security;
- runtime ownership.

Chỉ đề xuất merge/archive nếu vai trò thật sự bị trùng và authority không bị mất.

## 9. OpenSpec

Không cleanup `openspec/` trong Step 6.1.

Chỉ ghi nhận nếu task docs hoặc current documentation còn nhắc sai OpenSpec workflow/path.

Không sửa OpenSpec.

---

# Nội dung bắt buộc của `docs/DOCUMENTATION_CLEANUP_AUDIT.md`

## 1. Executive summary

Tóm tắt:
- tổng số file Markdown trong `docs/`;
- nhóm nào chiếm nhiều nhất;
- cleanup opportunity chính;
- risk chính;
- có safe-delete candidate nào không.

## 2. Cleanup principles

Ghi ngắn các rule dùng để phân loại.

## 3. Classification summary

Tạo bảng:

| Classification | Count | Main reason |
|---|---:|---|

Nếu classification theo nhóm thay vì từng file, ghi rõ methodology.

## 4. High-confidence actions

Tạo bảng:

| Path / group | Classification | Reason | Authority impact | Confidence |
|---|---|---|---|---|

Chỉ đưa các đề xuất có confidence `High`.

Ưu tiên:
- exact duplicates;
- stale indexes;
- superseded summaries;
- generated/history-only files;
- empty/dead docs;
- redundant prompts/templates.

## 5. Product Knowledge / feature docs

Audit các Product Knowledge Homes và feature/product docs còn lại.

Xác định:
- KEEP
- UPDATE
- MERGE
- ARCHIVE
- DELETE
- NEEDS REVIEW

Không duplicate nội dung.

## 6. UI page-pack audit

Không cần liệt kê hàng trăm file một cách vô nghĩa.

Có thể audit theo:
- page pack;
- subfolder;
- repeated prompt/template groups;
- reference assets;
- phase history.

Phải chỉ ra:
- current packs cần KEEP;
- historical phase files có thể ARCHIVE;
- exact duplicate prompts có thể MERGE/DELETE sau review;
- files không nên agent đọc mặc định.

## 7. Task/history audit

Phân loại `docs/tasks/`.

Tách:
- active tasks;
- completed audit/normalization tasks;
- old implementation tasks;
- disposable/generated task files.

## 8. CURRENT_STATE.md recommendation

Đưa một recommendation riêng:
- KEEP AS-IS
- UPDATE / SLIM
- SPLIT
- ARCHIVE

Giải thích vì sao.

Không sửa file.

## 9. Cleanup candidates requiring review

Tạo bảng:

| Path / group | Proposed action | Why uncertain | Required reviewer/evidence |
|---|---|---|---|

Dùng cho các file nhạy cảm.

## 10. Proposed execution batches

Đề xuất cleanup theo batch nhỏ dựa trên evidence thực tế của repo.

## 11. Archive strategy

Đề xuất một chiến lược archive nhưng chưa thực thi.

Archive phải:
- không trở thành source of truth;
- vẫn search được khi cần historical context;
- có README cảnh báo historical-only.

Không tạo archive folder trong bước này.

## 12. Delete policy

Định nghĩa điều kiện để một file được DELETE ở Step 6.2+:
- không còn authority;
- không còn unique information;
- không cần audit/provenance/history;
- không được current docs link tới;
- không được code/tooling phụ thuộc;
- Git history đủ để recover;
- confidence cao.

## 13. Readiness

Cuối file:

```md
## Readiness for cleanup execution

Status: READY | READY WITH REVIEW | NOT READY

### Safe first batch
- ...

### Blocking questions
- ...
```

## 14. Document status

Cuối cùng:

`Status: PROPOSED FOR REVIEW`

Không tự approve.

---

# Validation

Sau audit:

1. Confirm không file nào ngoài audit output bị sửa.
2. Confirm không file nào bị move/delete.
3. Confirm classifications dựa trên authority/role, không chỉ age/file count.
4. Confirm Product Knowledge Homes giữ current role.
5. Confirm accepted decisions/architecture không bị đề xuất xóa tùy tiện.
6. Confirm page-pack history được xử lý thận trọng.
7. Confirm delete candidates có evidence rõ.
8. Run docs/format checks nếu phù hợp.

Report:
- file created;
- counts;
- high-confidence cleanup candidates;
- safe first batch;
- blocking questions;
- validation results.

Không start cleanup execution.
Không start OpenSpec customization.

Dừng sau Step 6.1 và chờ review.
