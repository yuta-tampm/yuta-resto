# YUTA — Step 6.2E1: UI Prompt Topology Review

## Mục tiêu

Review cách các UI page-pack prompts (các prompt theo phase trong từng page pack)
đang được lưu và sử dụng, trước khi quyết định có nên:

- giữ mỗi page pack hoàn toàn self-contained;
- dùng canonical templates chung;
- generate/copy prompts từ templates;
- hay dùng mô hình hybrid.

Đây là review-only.

Không sửa tooling.
Không sửa protocol.
Không xóa/merge prompt.
Không sửa page pack.
Không sửa code.
Không sửa OpenSpec.

## Nguồn bắt buộc phải đọc

1. `AGENTS.md`
2. `docs/DOCUMENTATION_CLEANUP_AUDIT.md`
3. `docs/ui/README.md`
4. `docs/ui/PAGE_PACK_PROTOCOL.md`
5. `docs/ui/UI_PACK_TOOLING_SPEC.md`
6. `docs/ui/templates/page/prompts/`
7. `docs/ui/pages/README.md`
8. `scripts/ui-pack-tooling.mjs`
9. tests của UI pack tooling nếu có
10. một số page pack đại diện có prompt duplicate:
   - Formalités
   - Registre du personnel
   - POS Printing
   - POS Catalog

Dùng kết quả exact-duplicate groups từ Cleanup Audit để đối chiếu.

## Output duy nhất

Tạo:

`docs/ui/UI_PROMPT_TOPOLOGY_REVIEW.md`

Không sửa file nào khác.

# Các mô hình phải đánh giá

## Option A — Self-contained snapshots

Mỗi page pack tiếp tục giữ đủ 6 prompt riêng.

Đánh giá:
- provenance;
- reproducibility;
- duplication;
- drift risk;
- maintenance cost;
- tooling simplicity;
- portability.

## Option B — Canonical templates only

Page pack không giữ prompt copy; chỉ reference tới:
`docs/ui/templates/page/prompts/`

Đánh giá:
- giảm duplication;
- nguy cơ mất historical snapshot;
- template đổi về sau có làm khó hiểu pack cũ không;
- ảnh hưởng tooling/protocol/tests.

## Option C — Generated immutable snapshots

Canonical template là nguồn để tạo pack mới, nhưng khi tạo pack:
- tooling copy/generate snapshot vào pack;
- snapshot được coi là immutable historical input;
- duplicate là intentional;
- tooling có thể ghi template version/hash.

Đánh giá:
- provenance;
- reproducibility;
- duplication;
- drift;
- auditability;
- tooling complexity.

## Option D — Hybrid reference + local overrides

Page pack reference canonical template,
chỉ lưu local override/delta khi cần.

Đánh giá:
- complexity;
- readability;
- provenance;
- template drift;
- tooling requirements.

# Nội dung bắt buộc

## 1. Executive summary

Trả lời:
- current topology đang hoạt động thế nào;
- duplicate prompts có phải lỗi hay intentional structure;
- recommendation chính:
  - KEEP SELF-CONTAINED
  - CANONICAL ONLY
  - GENERATED SNAPSHOTS
  - HYBRID
  - NEEDS REVIEW

## 2. Current tooling contract

Tóm tắt chính xác:
- page pack hiện phải có bao nhiêu prompt;
- filenames nào bắt buộc;
- tooling validate gì;
- tests đang assume gì;
- protocol nói gì về self-contained package.

Không suy đoán.

## 3. Duplicate inventory interpretation

Dùng duplicate groups từ Cleanup Audit.

Bảng:
| Prompt group | Duplicate count | Current reason | Harmful duplication? | Notes |
|---|---:|---|---|---|

Phân biệt:
- byte-identical nhưng intentional;
- stale divergent copy;
- accidental duplicate.

## 4. Evaluation matrix

Bảng:
| Criterion | Self-contained | Canonical only | Generated snapshots | Hybrid |
|---|---|---|---|---|

Tối thiểu:
- provenance
- historical reproducibility
- agent readability
- maintenance
- drift risk
- tooling complexity
- migration risk
- Git diff clarity
- page-pack portability

## 5. Recommended model

Chọn một mô hình và giải thích:
- canonical source nằm ở đâu;
- page pack giữ gì;
- historical prompt version bảo toàn thế nào;
- khi template đổi, pack cũ có đổi theo không;
- tooling tạo pack mới thế nào;
- agent nên đọc template hay local snapshot;
- duplicate có còn là cleanup problem không.

## 6. Migration impact

Nếu recommendation cần đổi topology:

| Area | Required change | Risk |
|---|---|---|

Tối thiểu:
- `PAGE_PACK_PROTOCOL.md`
- `UI_PACK_TOOLING_SPEC.md`
- `scripts/ui-pack-tooling.mjs`
- tooling tests
- existing page packs
- future page-pack creation
- duplicate prompt cleanup

Không thực thi.

## 7. Existing page-pack treatment

Đề xuất cách xử lý 19 duplicate prompt copies:
- KEEP
- MARK AS SNAPSHOT
- REGENERATE
- REFERENCE
- MERGE
- DELETE
- NEEDS REVIEW

Không được delete trong review step.

Nếu recommendation là generated snapshot:
nói rõ các file duplicate hiện tại có thể trở thành intentional historical snapshots thay vì cleanup candidates.

## 8. Version / provenance strategy

Nếu recommendation dùng snapshot/template versioning, đề xuất metadata tối thiểu:
- template source path
- template version
- template hash
- generation timestamp hoặc generation commit
- local modifications allowed? yes/no

Không thiết kế schema phức tạp nếu không cần.

## 9. Execution plan proposal

Đề xuất các bước tiếp theo dựa trên recommendation, ví dụ:
- Step E2: update protocol/spec/tooling
- Step E3: migrate existing packs
- Step E4: validate and cleanup duplicates

## 10. Status

Cuối file:

`Status: PROPOSED FOR REVIEW`

# Validation

1. Confirm chỉ `docs/ui/UI_PROMPT_TOPOLOGY_REVIEW.md` được tạo.
2. Confirm không prompt nào bị sửa/xóa.
3. Confirm tooling/script/test không đổi.
4. Confirm recommendation dựa trên current protocol/tooling thật.
5. Confirm 19 duplicate prompt copies không bị xử lý trước khi model được approve.
6. Run targeted Markdown formatting/checks nếu phù hợp.

Report:
- recommendation;
- current tooling contract;
- duplicate interpretation;
- migration impact;
- next execution steps.

Không bắt đầu E2.
Không sửa OpenSpec.

Dừng sau Step 6.2E1 và chờ review.
