# YUTA — Step 7.0: OpenSpec Local Baseline Audit

## Mục tiêu

Trước khi custom OpenSpec cho YUTA, kiểm tra **OpenSpec đang cài thật trên máy/repo**
và schema `spec-driven` đang được resolve thật sự.

Đây là bước **audit-only**.

Không fork schema.
Không sửa `openspec/config.yaml`.
Không sửa `.agents/skills`.
Không tạo change/spec.
Không sửa code.

Mục tiêu là tránh dùng hướng dẫn OpenSpec lỗi thời và thiết kế custom workflow
dựa trên đúng version/schema đang chạy.

---

## 1. Kiểm tra version và project state

Chạy và ghi kết quả:

```bash
openspec --version
openspec schemas
openspec schema which spec-driven
openspec templates --schema spec-driven
```

Nếu command hỗ trợ JSON, ưu tiên dùng thêm JSON để audit chính xác:

```bash
openspec schemas --json
openspec schema which spec-driven --json
openspec templates --schema spec-driven --json
```

Không giả định version từ docs internet.

---

## 2. Kiểm tra project OpenSpec

Đọc:

- `openspec/config.yaml`
- `openspec/specs/`
- `openspec/changes/`
- `openspec/schemas/` nếu tồn tại
- `.agents/skills/` các OpenSpec skills hiện có
- `AGENTS.md`

Xác nhận:

- default schema hiện tại là gì;
- có project-local schema nào đang shadow built-in schema không;
- `openspec/specs/` hiện có normative spec nào chưa;
- `openspec/changes/` hiện có active change nào chưa;
- Codex OpenSpec skills nằm ở đâu;
- workflow/profile hiện đang expose những skill nào.

Không sửa các file này.

---

## 3. Inspect built-in `spec-driven` schema

Dùng path từ:

`openspec schema which spec-driven`

để đọc schema thật đang cài.

Audit:

- `schema.yaml`
- template files
- artifact dependency graph
- `apply` configuration

Xác nhận chính xác default flow.

Dự kiến theo OpenSpec hiện tại có thể là:

`proposal -> specs -> design -> tasks`

nhưng phải lấy local installed schema làm bằng chứng cuối cùng.

---

## 4. Phân tích artifact `proposal`

Ghi rõ:

### Proposal là gì?

Phân biệt:

- `proposal` artifact
- workflow/skill `openspec-propose`

Proposal artifact phải trả lời chủ yếu:

- WHY: vì sao change cần làm;
- WHAT CHANGES: thay đổi gì ở mức cao;
- CAPABILITIES: capability nào mới hoặc bị thay đổi;
- IMPACT: code/API/system nào bị ảnh hưởng ở mức định hướng.

Không biến `proposal.md` thành:
- design kỹ thuật;
- implementation plan;
- task list;
- full Product Knowledge copy.

Kiểm tra template/instruction local để xác nhận wording thật.

### `openspec-propose` là gì?

Đây là workflow/skill có thể tạo tất cả artifacts cần thiết trong một lượt.

Nó KHÔNG đồng nghĩa với riêng file `proposal.md`.

Ghi rõ sự khác nhau để YUTA không nhầm sau này.

---

## 5. Inspect custom schema support

Chạy/kiểm tra:

```bash
openspec schema --help
openspec schema fork --help
openspec schema validate --help
openspec schema init --help
```

Xác nhận local CLI hỗ trợ:

- schema init
- schema fork
- schema validate
- schema which

Ghi chính xác syntax/version hiện có.

Không fork schema trong step này.

---

## 6. Project Knowledge integration assessment

Đọc current YUTA knowledge entry points:

- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- `docs/CURRENT_STATE.md`

Đánh giá custom OpenSpec sau này cần **tham chiếu** chúng như thế nào.

Không copy toàn bộ Product Knowledge vào OpenSpec config/schema.

Phải giữ nguyên nguyên tắc:

- docs = broader Product Knowledge / context;
- OpenSpec specs = precise behavioral requirements sau khi YUTA làm chúng normative;
- OpenSpec changes = proposed/in-progress changes;
- code = Implemented State evidence;
- accepted ADR/security/runtime boundaries không được OpenSpec silently override.

---

## 7. Đề xuất Artifact Graph cho YUTA — chỉ proposal, chưa implement

Dựa trên local OpenSpec capability và YUTA workflow đã chuẩn hóa, đề xuất 1–2
artifact graph khả thi.

Ví dụ có thể xem xét:

### Minimal extension
`proposal -> analysis -> specs -> design -> tasks`

hoặc

### UX-aware extension
`proposal -> analysis -> specs -> ux-flow -> design -> tasks`

Nhưng KHÔNG được copy mù ví dụ này.

Phải kiểm tra:
- artifact dependency support thực tế;
- YUTA có thật sự cần artifact riêng hay có thể để một số nội dung trong
  proposal/spec/design;
- tránh workflow quá nặng.

Đối với mỗi phương án, ghi:
- artifact;
- purpose;
- dependency;
- lợi ích;
- cost/complexity;
- recommended hay không.

---

## 8. Output duy nhất

Tạo:

`docs/OPENSPEC_BASELINE_AUDIT.md`

Nội dung tối thiểu:

1. Local OpenSpec version
2. Resolved schema source
3. Current default schema
4. Default artifact flow
5. Proposal artifact meaning
6. `openspec-propose` workflow meaning
7. Current project OpenSpec state
8. Current Codex skill location/profile
9. Custom schema commands supported
10. YUTA knowledge integration constraints
11. Candidate YUTA artifact graphs
12. Recommendation for Step 7.1

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

## 9. Validation

Xác nhận:

- không file OpenSpec nào bị sửa;
- không schema nào được fork;
- không skill nào regenerate/update trong step này;
- không code nào bị sửa;
- chỉ `docs/OPENSPEC_BASELINE_AUDIT.md` được tạo.

Report:
- version;
- schema source;
- default flow;
- recommendation;
- any compatibility concern.

Dừng sau Step 7.0.
Không bắt đầu custom schema.
