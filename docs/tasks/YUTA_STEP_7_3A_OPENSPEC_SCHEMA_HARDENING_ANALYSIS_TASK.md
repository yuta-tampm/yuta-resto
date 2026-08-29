# YUTA — Step 7.3A: OpenSpec Schema Hardening Analysis

## Mục tiêu

Phân tích **hai limitation** phát hiện ở Step 7.2 trước khi quyết định có sửa
`yuta-spec-driven` hay không.

Đây là **analysis-only**.

Không sửa schema.
Không activate schema.
Không sửa `openspec/config.yaml`.
Không sửa `.agents/skills`.
Không tạo change/spec thật.
Không sửa Product Knowledge hoặc code.

Hai vấn đề cần đánh giá:

1. `design` là conditional artifact:
   - workflow adapter có thể deliberately skip;
   - raw CLI vẫn giữ `design = ready`;
   - `tasks = blocked`;
   - `isPlanningComplete = false`.

2. `skip_specs: true`:
   - `specs` được coi là satisfied độc lập với `analysis`;
   - vì `design` hiện chỉ requires `[specs]`, raw CLI có thể làm `design`
     ready trước khi `analysis` hoàn tất;
   - workflow adapters hiện vẫn đi proposal -> analysis đúng thứ tự.

Mục tiêu của YUTA là giữ:

```text
proposal
   ↓
analysis   ← mandatory authority/evidence gate
   ↓
specs
   ↓
design
   ↓
tasks
```

với mức divergence khỏi upstream nhỏ nhất.

---

# 1. Đọc evidence hiện tại

Đọc:

- `docs/OPENSPEC_BASELINE_AUDIT.md`
- `docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`
- `docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`
- `openspec/schemas/yuta-spec-driven/schema.yaml`
- `openspec/schemas/yuta-spec-driven/templates/analysis.md`
- `.agents/skills/` OpenSpec skills hiện tại

Xác nhận local:

```bash
openspec --version
openspec schema validate yuta-spec-driven --json --verbose
```

Expected version: `1.11.0`.

---

# 2. Re-check local OpenSpec semantics

Inspect local installed OpenSpec 1.11.0 source/help for:

- `status --json`
- skipped artifacts
- `isPlanningComplete`
- conditional artifact behavior
- `openspec-propose`
- `openspec-continue-change`
- archive behavior
- `skip_specs`

Phân biệt rõ:

- **CLI graph semantics**
- **workflow adapter semantics**
- **schema semantics**

Không gọi một behavior là bug nếu local/OpenSpec workflow contract cố ý thiết kế
như vậy.

---

# 3. Limitation A — Conditional `design`

Phân tích hiện trạng:

```text
specs done
   ↓
design ready (conditional)
   ↓
design deliberately skipped by workflow adapter
   ↓
raw CLI still:
design = ready
tasks = blocked
isPlanningComplete = false
```

Đánh giá tối thiểu 3 options:

## Option A1 — Keep upstream conditional design

Giữ schema/instruction hiện tại.

Đánh giá:

- compatibility với official workflow adapter;
- ảnh hưởng tới `status`;
- archive warnings;
- human readability;
- risk agent/tool khác không hiểu deliberate skip;
- maintenance/upstream compatibility.

## Option A2 — Make `design` mandatory in YUTA schema

Bỏ conditional behavior trong design instruction.

Mọi change đi qua custom schema phải tạo `design.md`.

Cho simple change, design có thể rất ngắn nhưng vẫn phải có nội dung có ích;
không tạo placeholder giả.

Đánh giá:

- deterministic graph;
- `isPlanningComplete`;
- archive;
- workflow simplicity;
- overhead cho docs/tooling/refactor;
- divergence khỏi upstream.

## Option A3 — Change dependency topology

Chỉ đánh giá nếu có topology thực sự tốt hơn, ví dụ giảm dependency lên
conditional design.

Không được recommend topology làm `tasks` có thể chạy trước một design thực sự
cần thiết.

Nếu không có option an toàn, ghi rõ không recommend.

---

# 4. Limitation B — `skip_specs` có thể làm design ready sớm

Hiện tại:

```text
analysis requires [proposal]
specs requires [analysis]
design requires [specs]
```

OpenSpec coi `specs = skipped` là satisfied.

Do đó raw graph có thể thấy:

```text
proposal = ready
analysis = blocked/ready
specs = skipped
design = ready
```

dù workflow adapter vẫn chọn proposal/analysis trước.

Đánh giá các options:

## Option B1 — Keep current graph

Dựa vào artifact order + workflow adapters.

Đánh giá robustness nếu:
- dùng Codex skills chuẩn;
- dùng raw CLI/manual workflow;
- sau OpenSpec upgrade;
- một agent khác không tuân workflow adapter.

## Option B2 — Add redundant direct gate

Đánh giá graph:

```yaml
analysis:
  requires: [proposal]

specs:
  requires: [analysis]

design:
  requires: [analysis, specs]

tasks:
  requires: [specs, design]
```

Mục tiêu:
- behavior path không đổi về logic;
- khi `specs` skipped, `analysis` vẫn trực tiếp block design;
- analysis trở thành schema-level gate thay vì chỉ workflow-level gate.

Kiểm tra parser có chấp nhận redundant transitive dependency này không.

Không sửa schema; chỉ validate reasoning bằng source/temporary model nếu cần.

## Option B3 — Alternative minimal solution

Chỉ đề xuất nếu tốt hơn B2 và ít divergence hơn.

---

# 5. Đánh giá theo tiêu chí YUTA

Mỗi option phải chấm:

- Authority safety
- Schema-level enforcement
- CLI/status coherence
- Workflow adapter compatibility
- Raw/manual CLI safety
- `skip_specs` behavior
- Archive behavior
- Maintenance cost
- Upstream divergence
- User/Codex complexity

Dùng:

- HIGH
- MEDIUM
- LOW

hoặc PASS/WARN/FAIL nếu phù hợp.

---

# 6. Nguyên tắc quyết định

Ưu tiên theo thứ tự:

1. `analysis` phải là gate thật sự trước work downstream.
2. Không để agent dễ bypass Product Knowledge/Authority review.
3. Không tạo workflow phức tạp chỉ để đẹp CLI status.
4. Giữ gần OpenSpec upstream nếu safety tương đương.
5. Không ép artifact vô nghĩa chỉ để `isPlanningComplete = true`.
6. Không phụ thuộc vào undocumented behavior.
7. Known limitation được chấp nhận nếu official workflow contract rõ và risk thấp.

---

# 7. Recommendation

Kết luận chính xác một trong:

- `NO_SCHEMA_CHANGE_REQUIRED`
- `MINIMAL_SCHEMA_HARDENING_RECOMMENDED`
- `WORKFLOW_ADAPTER_HARDENING_REQUIRED`
- `SCHEMA_AND_WORKFLOW_HARDENING_REQUIRED`
- `BLOCKED_PENDING_OPENSPEC_CHANGE`

Nếu recommend schema change, ghi **exact proposed diff** nhưng KHÔNG apply.

Ví dụ format:

```yaml
# CURRENT
design:
  requires: [specs]

# PROPOSED
design:
  requires: [analysis, specs]
```

Nếu recommend design mandatory, ghi chính xác instruction-level change cần làm.

Không sửa file thật.

---

# 8. Activation decision

Đánh giá lại Step 7.2 recommendation:

`READY_TO_ACTIVATE_WITH_KNOWN_LIMITATIONS`

Sau hardening analysis, đưa ra một trong:

- `ACTIVATION_CAN_PROCEED_WITHOUT_SCHEMA_CHANGE`
- `ACTIVATION_AFTER_MINIMAL_HARDENING`
- `ACTIVATION_BLOCKED`

Giải thích ngắn.

---

# 9. Output duy nhất

Tạo:

`docs/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md`

Nội dung:

1. Current limitations
2. OpenSpec 1.11 semantics
3. Conditional design options
4. Analysis-gate / skip_specs options
5. Comparison matrix
6. Recommended option
7. Exact proposed diff, nếu có
8. Required re-test scope, nếu có
9. Activation recommendation

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

# 10. Allowed modifications

Chỉ tạo:

`docs/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md`

Không sửa bất kỳ file nào khác.

---

# 11. Validation

Xác nhận:

- schema không đổi;
- config không đổi;
- skills không đổi;
- specs/changes thật không đổi;
- code không đổi;
- chỉ report mới được tạo;
- Markdown checks pass.

Dừng sau Step 7.3A.

Không implement hardening.
Không activate schema.
