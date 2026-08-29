# YUTA — Step 6.2F: Final Documentation Cleanup Validation

## Mục tiêu

Thực hiện **final validation** cho toàn bộ Documentation Cleanup trước khi đóng
Step 6 và chuyển sang custom OpenSpec.

Đây là bước review/validation cuối cùng.

Mục tiêu:

- xác nhận routing hiện hành không còn stale;
- xác nhận current authority và archive đã tách đúng;
- xác nhận CURRENT_STATE đã slim đúng vai trò;
- xác nhận Public Booking và POS Product Specs đã được làm sạch;
- xác nhận UI prompt duplicate policy đã được giải quyết;
- xác nhận không còn safe-delete candidate bị bỏ sót;
- liệt kê toàn bộ `NEEDS REVIEW` còn tồn tại để không bị quên;
- xác nhận docs hiện đủ sạch để OpenSpec đọc Product Knowledge an toàn.

Không sửa code.
Không sửa OpenSpec.
Không xóa/move/archive thêm file trong bước này.

---

## Nguồn bắt buộc phải đọc

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/PRODUCT_KNOWLEDGE.md`
4. `docs/AUTHORITY_MODEL.md`
5. `docs/LIFECYCLE_STATUS_MODEL.md`
6. `docs/MODULE_REGISTRY.md`
7. `docs/CURRENT_STATE.md`
8. `docs/DOCUMENTATION_CLEANUP_AUDIT.md`
9. `docs/archive/README.md`
10. `docs/features/public-booking/PRODUCT_SPEC.md`
11. `docs/products/pos/PRODUCT_SPEC.md`
12. `docs/ui/UI_PROMPT_TOPOLOGY_REVIEW.md`
13. `docs/ui/PROMPT_PROVENANCE_MIGRATION_REPORT.md`
14. `docs/ui/PAGE_PACK_PROTOCOL.md`
15. `docs/ui/UI_PACK_TOOLING_SPEC.md`
16. `docs/ui/pages/README.md`
17. approved Product Knowledge Homes
18. current `docs/tasks/` inventory
19. current `docs/archive/knowledge-normalization/` inventory

---

## Output duy nhất

Tạo:

`docs/DOCUMENTATION_CLEANUP_FINAL_REPORT.md`

Không sửa file nào khác.

---

# 1. Final current-authority map

Xác nhận current entry points:

- `docs/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- scoped Product Knowledge Homes
- accepted ADRs / architecture
- operations/readiness
- OpenSpec (chưa normative)

Tạo bảng:

| Question type | Current entry point | Deeper authority |
|---|---|---|

Không invent authority mới.

---

# 2. Cleanup execution summary

Tóm tắt các batch đã hoàn tất:

- index truthfulness;
- CURRENT_STATE slimming;
- knowledge-normalization archive;
- Public Booking Product Spec cleanup;
- POS Product Spec cleanup;
- UI prompt topology;
- prompt provenance migration;
- duplicate reclassification.

Ghi rõ các kết quả chính và file hiện hành.

---

# 3. Stale-link / stale-routing scan

Search current non-archive docs cho:

- moved `docs/KNOWLEDGE_AUDIT.md`;
- moved task paths;
- wording `proposed for review` đối với các home đã APPROVED;
- references tới `.codex/skills` nếu current OpenSpec/Codex layout dùng `.agents`;
- stale OpenSpec command syntax nếu có;
- stale Product Knowledge routing;
- stale Site Agent / Display / Today / Establishment home status;
- old universal authority order;
- stale direct-feedback ownership.

Không tự sửa.

Mọi finding phải phân loại:
- `NONE`
- `UPDATE NEEDED`
- `NEEDS REVIEW`

---

# 4. Current-vs-archive boundary validation

Xác nhận:

- archive không được current indexes dùng như source of truth;
- archive README cảnh báo historical-only;
- completed normalization tasks không còn active-reading path;
- active Step 6 task files vẫn ở `docs/tasks/`;
- current authority files không bị archive nhầm.

Tạo bảng:

| Area | Result | Notes |
|---|---|---|

---

# 5. CURRENT_STATE validation

Xác nhận:

- file vẫn là summary/routing layer;
- không duplicate lifecycle table;
- không chứa delivery diary dài;
- current implementation vs Product Intent vs readiness tách rõ;
- unresolved surfaces vẫn giữ bounded wording;
- orphan historical fragment vẫn được preserve nếu provenance chưa giải quyết.

Nếu có vấn đề:
report, không sửa.

---

# 6. Product Spec validation

## Public Booking

Xác nhận:
- broader Product Intent được giữ;
- future phases không bị hiểu là individually approved/implemented;
- technical authority route sang ADR/schema/contracts/code;
- unresolved areas vẫn unresolved.

## POS

Xác nhận:
- local-first != browser-offline;
- cloud/POS data boundary rõ;
- non-fiscal boundary rõ;
- Site Agent/db-pos technical authority được route đúng;
- future cloud sync/remote/multi-site/fiscalization vẫn separately reviewable.

---

# 7. UI prompt topology validation

Xác nhận policy hiện hành:

- canonical prompts generate NEW packs;
- local prompts là sealed historical snapshots;
- old packs không auto-update theo template mới;
- duplicate bodies được phép;
- hash mismatch = error;
- validator không auto-repair;
- 18 existing packs đã có provenance metadata;
- 86 unresolved provenance entries chỉ là provenance review, không phải cleanup/delete candidate;
- 19 duplicate candidates cũ đã được reclassify KEEP.

---

# 8. Remaining cleanup classifications

Đọc `DOCUMENTATION_CLEANUP_AUDIT.md` hiện tại và tạo final counts:

| Classification | Count | Notes |
|---|---:|---|

Xác nhận:
- có còn `DELETE` candidate không;
- có còn `MERGE` candidate không;
- `NEEDS REVIEW` còn là gì;
- những gì đã chuyển từ `NEEDS REVIEW` sang `KEEP`.

Không re-audit toàn repo nếu không cần; dùng current audit + spot verification.

---

# 9. Remaining NEEDS REVIEW register

Tạo một bảng tập trung:

| Area | Why unresolved | Current source | Next decision/reviewer | Blocks OpenSpec setup? |
|---|---|---|---|---|

Tối thiểu kiểm tra:

- Rooms / Tables
- Compliance
- Creative Studio
- Menu / Resources / Marketing / Subscription placeholders
- Planning / Pointage / Tâches source-module Product Decisions
- Personnel Documents Product Decision
- durable Formalités data owner
- Display admin security
- Display media lifecycle / backup
- Identity / Access unresolved Product Decisions
- Public Website bounded Product Decision
- 86 prompt provenance origins
- provider/OpenAI external response
- any other current audit item

Điểm quan trọng:
không phải mọi `NEEDS REVIEW` đều block OpenSpec.

Phân biệt:
- `BLOCKS OPENSPEC CUSTOMIZATION`
- `DOES NOT BLOCK`
- `BLOCKS ONLY RELATED FEATURE`

---

# 10. OpenSpec readiness assessment

Đánh giá repo có sẵn sàng để bước sang custom OpenSpec không.

Tối thiểu kiểm tra:

- current Product Knowledge entry point rõ;
- Authority Model approved;
- Lifecycle Model approved;
- Module Registry approved;
- major Product Knowledge Homes approved;
- current summary cleaned;
- stale docs đã được route/archive;
- OpenSpec current role được ghi rõ là chưa normative;
- no unresolved documentation conflict that makes global Product Knowledge unsafe.

Kết luận:

`READY`
hoặc
`READY WITH BOUNDED REVIEW`
hoặc
`NOT READY`

Giải thích.

---

# 11. Recommended next step

Nếu READY:
recommend:
**Step 7 — Custom OpenSpec for YUTA**

Nếu chưa ready:
liệt kê exact blocker trước khi custom.

Không tạo OpenSpec schema trong bước này.

---

# 12. Validation commands

Run:

- `pnpm docs:check`
- `pnpm architecture:check`
- workspace typecheck
- `pnpm test:ui-pack`
- `pnpm ui:pack:check`
- Markdown link check
- targeted Prettier
- `git diff --check`

Không tự sửa out-of-scope formatting.

---

# 13. Status

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

## Điều kiện hoàn thành

- Chỉ tạo `docs/DOCUMENTATION_CLEANUP_FINAL_REPORT.md`.
- Không sửa current docs.
- Không sửa archive.
- Không sửa code.
- Không sửa OpenSpec.
- Có final authority map.
- Có final cleanup counts.
- Có remaining NEEDS REVIEW register.
- Có OpenSpec readiness conclusion.
- Có validation results.

Dừng sau Step 6.2F và chờ review.
