# YUTA — Step 7.2: Isolated Smoke Test for `yuta-spec-driven`

## Mục tiêu

Smoke-test (test thử tối thiểu) custom schema `yuta-spec-driven` trên OpenSpec
1.11.0 **trong một workspace tạm, cô lập khỏi YuTa thật**.

Schema cần test:

```text
proposal
   ↓
analysis
   ↓
specs
   ↓
design
   ↓
tasks
```

Đây là bước compatibility test, KHÔNG phải product development.

Không activate schema làm default.
Không tạo YuTa product change thật.
Không tạo main spec thật trong repo YuTa.
Không sửa code YuTa.
Không sửa `.agents/skills`.
Không sửa custom schema trong Step 7.2.

Output duy nhất trong repo:

`docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`

---

# 1. Preconditions

Đọc:

- `docs/OPENSPEC_BASELINE_AUDIT.md`
- `docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`
- `openspec/schemas/yuta-spec-driven/schema.yaml`
- `openspec/schemas/yuta-spec-driven/templates/analysis.md`
- `.agents/skills/` OpenSpec workflow skills hiện tại

Chạy:

```bash
openspec --version
openspec schema validate yuta-spec-driven --json --verbose
openspec schema which yuta-spec-driven --json
```

Phải xác nhận:

- version = `1.11.0`
- custom schema valid
- custom schema source = `project`
- project default trong `openspec/config.yaml` vẫn là `spec-driven`

Nếu khác:
- dừng;
- tạo report BLOCKED;
- không sửa schema/config.

---

# 2. Tạo isolated smoke workspace

Không test bằng active `openspec/changes/` của repo YuTa.

Tạo một temporary directory ngoài repo, ví dụ dưới OS temp:

```text
<temp>/yuta-openspec-smoke-<unique-id>/
```

Trong temp workspace, tạo/copy tối thiểu:

```text
openspec/
├── config.yaml
├── changes/
├── specs/
└── schemas/
    └── yuta-spec-driven/
```

Copy chính xác custom schema từ repo YuTa vào temp workspace.

Temp `openspec/config.yaml` phải giữ default:

```yaml
schema: spec-driven
```

để chứng minh custom schema chỉ được dùng khi explicit selection.

Nếu schema instructions cần project context, tạo synthetic/minimal test context trong
temp workspace. Không copy toàn bộ YuTa Product Knowledge nếu không cần.

Ghi temp path vào report.

Trước test, ghi snapshot:

- repo `git status --short`
- hash của `openspec/config.yaml`
- hash của `openspec/schemas/yuta-spec-driven/schema.yaml`
- hash của `.agents/skills/**` OpenSpec files nếu practical
- trạng thái thật của `openspec/specs/` và `openspec/changes/`

Mục tiêu: sau test phải chứng minh repo YuTa không bị contamination.

---

# 3. Test A — behavior-changing path

Tại temp workspace, tạo disposable change:

```bash
openspec new change smoke-yuta-behavior --schema yuta-spec-driven --json
```

Không bỏ `--schema`.

Xác nhận `.openspec.yaml` ghi custom schema.

## A1. Initial status

Chạy:

```bash
openspec status --change smoke-yuta-behavior --json
```

Expected:

```text
proposal = ready
analysis = blocked
specs    = blocked
design   = blocked
tasks    = blocked
```

Và direct dependencies phải đúng schema.

## A2. Proposal

Lấy instruction:

```bash
openspec instructions proposal --change smoke-yuta-behavior --json
```

Tạo một synthetic proposal nhỏ cho capability test, ví dụ:

`smoke/example-behavior`

Không liên quan feature thật của YuTa.

Sau đó status phải làm `analysis` ready.

## A3. Analysis

Lấy:

```bash
openspec instructions analysis --change smoke-yuta-behavior --json
```

Xác nhận:

- output path = `analysis.md`
- dependency includes completed proposal
- template là custom `analysis.md`

Tạo synthetic analysis với:

```text
READY_FOR_SPECS
```

Không dùng lifecycle status thật của YuTa.

Sau đó status phải làm `specs` ready và `design` chưa ready.

## A4. Specs

Lấy instructions và tạo một valid synthetic delta spec.

Phải tuân thủ OpenSpec format:

- `## Purpose` cho new capability
- `## ADDED Requirements`
- `### Requirement`
- SHALL/MUST
- `#### Scenario`
- WHEN/THEN

Chạy validation thích hợp.

Sau specs:

```text
design = ready
tasks  = blocked
```

## A5. Design — normal path

Với Test A, giả định design áp dụng và tạo `design.md`.

Sau design:

```text
tasks = ready
```

## A6. Tasks

Tạo `tasks.md` đúng checkbox format.

Task implementation chỉ được tác động vào một synthetic file trong TEMP workspace,
không tác động repo YuTa.

Sau tasks:

- planning complete theo CLI semantics;
- apply requirements satisfied.

## A7. Apply context

Chạy:

```bash
openspec instructions apply --change smoke-yuta-behavior --json
```

Xác nhận apply context có các planning artifacts cần thiết, đặc biệt:

- proposal
- analysis
- specs
- design
- tasks

Xác nhận custom `analysis` không làm apply command fail.

Có thể thực hiện task synthetic trong TEMP workspace và mark checkbox complete
để kiểm tra tracking.

Không chạm product code.

---

# 4. Test B — conditional `design` behavior

Đây là test bổ sung bắt buộc.

Lý do:
upstream design instruction nói `create only if any apply`, trong khi graph vẫn có:

```text
tasks requires [specs, design]
```

OpenSpec workflow skills xem dependencies là enablers và cho phép deliberate
conditional skip. Cần chứng minh custom chain vẫn coherent.

Tạo temp change:

```bash
openspec new change smoke-yuta-simple-behavior --schema yuta-spec-driven --json
```

Tạo:

- proposal
- analysis = `READY_FOR_SPECS`
- valid simple spec

Chọn một synthetic behavior change mà design conditions KHÔNG áp dụng.

Khi design trở thành ready:

1. đọc `openspec instructions design ... --json`;
2. xác nhận instruction vẫn nói conditional;
3. deliberate-skip design theo workflow rule;
4. kiểm tra `openspec status`.

Nếu CLI status vẫn hiển thị tasks blocked chỉ vì design file không tồn tại,
xác nhận workflow adapter có thể tiếp tục bằng cách lấy task instructions và
tạo tasks khi **design là missing dependency duy nhất và đã deliberate-skip hợp lệ**.

Không tự sửa schema trong Step 7.2.

Kết luận một trong:

- `CONDITIONAL_DESIGN_COMPATIBLE`
- `CONDITIONAL_DESIGN_NEEDS_ADJUSTMENT`
- `CONDITIONAL_DESIGN_BLOCKED`

Ghi evidence rõ.

---

# 5. Test C — `skip_specs: true` non-behavior path

Tạo:

```bash
openspec new change smoke-yuta-no-spec --schema yuta-spec-driven --json
```

Sau khi scaffold, set đúng metadata của temp change:

```yaml
skip_specs: true
```

Giữ `schema: yuta-spec-driven`.

Đây là synthetic docs/tooling/refactor change, không thay đổi behavior.

Tạo proposal phù hợp và analysis kết luận:

```text
NO_SPEC_BEHAVIOR_CHANGE
```

Sau đó kiểm tra status/instructions.

Bắt buộc xác nhận:

- specs status = `skipped`;
- không tạo delta spec file;
- skipped specs được tính là satisfied dependency;
- design readiness/conditional behavior coherent;
- tasks có thể đạt trạng thái cần thiết theo workflow;
- không invent requirement để làm validator pass.

Chạy validation của change.

Kết luận:

- `SKIP_SPECS_COMPATIBLE`
- `SKIP_SPECS_NEEDS_ADJUSTMENT`
- `SKIP_SPECS_BLOCKED`

---

# 6. Test workflow adapters

Dùng local `.agents/skills/` generated by OpenSpec 1.11.0 làm workflow contract.

Không sửa skills.

Đối với temp changes, kiểm tra behavior của:

## new-change

- explicit `--schema yuta-spec-driven`
- proposal là first ready artifact

## continue-change

- chọn first ready artifact theo CLI status
- custom analysis được discover như artifact bình thường

## propose

- transitive dependency closure từ apply requirements bao gồm:
  proposal -> analysis -> specs -> design -> tasks
- custom analysis không bị bỏ qua
- conditional design rule không gây dead-end
- skipped specs không bị tạo trái marker

## apply

- đọc CLI-provided context files
- analysis xuất hiện trong planning context
- task tracking vẫn dùng `tasks.md`

## verify

Không yêu cầu verify phải hiểu semantic riêng của analysis.

Test chỉ cần xác nhận:
- custom context không làm workflow crash;
- analysis file được đọc như context;
- verify vẫn thực hiện standard specs/design/tasks checks;
- thiếu analysis-specific semantic verifier được report như known limitation,
  không được falsely claim là đã verify nội dung analysis.

Kết luận:

- `VERIFY_COMPATIBLE_WITH_LIMITATION`
hoặc blocker cụ thể.

## sync-specs

Chỉ test trong TEMP workspace.

Với behavior change:
- sync delta spec vào temp main specs;
- validate temp main specs;
- chạy sync lần hai để kiểm tra idempotence nếu workflow cho phép;
- custom analysis không làm sync suy diễn sai spec path.

Không copy delta file thô thành main spec.

## archive

Chỉ test trong TEMP workspace.

Xác nhận:
- artifact graph completion có analysis;
- standard spec sync/archive vẫn hoạt động;
- `.openspec.yaml` custom schema được giữ trong archived change;
- skip_specs change archive không tạo main spec.

Không archive bất kỳ change thật của YuTa.

---

# 7. Validate custom schema remains unchanged

Sau smoke tests, tại repo YuTa chạy lại:

```bash
openspec schema validate yuta-spec-driven --json --verbose
openspec schema which yuta-spec-driven --json
```

Không sửa schema dù smoke test fail.

Nếu có compatibility issue:
- report;
- để Step 7.3 hoặc một reviewed fix task xử lý.

---

# 8. Cleanup isolated workspace

Sau khi evidence cần thiết đã được ghi:

- xóa temporary smoke workspace;
- xác nhận không còn disposable smoke change trong repo YuTa;
- không có temp main spec trong repo YuTa.

Nếu cleanup fail:
- report exact path;
- không claim clean success.

---

# 9. Repo contamination check

So sánh pre/post:

- `git status --short`
- hash `openspec/config.yaml`
- hash custom `schema.yaml`
- `.agents/skills` state
- `openspec/specs/`
- `openspec/changes/`

Expected:

Không có repo modification do smoke tests.

Chỉ được phép có output report của Step 7.2.

Không được thay đổi:

- `openspec/config.yaml`
- `openspec/schemas/yuta-spec-driven/**`
- `.agents/skills/**`
- `openspec/specs/**`
- `openspec/changes/**`
- Product Knowledge
- product code

---

# 10. Output duy nhất

Tạo:

`docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`

Nội dung tối thiểu:

## Environment
- OpenSpec version
- schema source
- temp workspace path
- real project default schema

## Test A — Behavior path
Mỗi transition:

```text
proposal -> analysis -> specs -> design -> tasks
```

PASS/FAIL + evidence.

## Test B — Conditional design
- status behavior
- workflow behavior
- conclusion enum

## Test C — skip_specs
- skipped specs behavior
- downstream readiness
- validation
- conclusion enum

## Workflow compatibility matrix

| Workflow | Result | Notes |
|---|---|---|
| new-change | PASS/FAIL | |
| continue-change | PASS/FAIL | |
| propose | PASS/FAIL | |
| apply | PASS/FAIL | |
| verify | PASS/WITH LIMITATION/FAIL | |
| sync-specs | PASS/FAIL | |
| archive | PASS/FAIL | |

## Known limitations
Include at least:
- schema commands experimental;
- verify has no analysis-specific semantic dimension;
- conditional design result;
- any observed skip_specs nuance.

## Repository safety
Show no contamination.

## Final recommendation

Exactly one:

- `READY_TO_ACTIVATE`
- `READY_TO_ACTIVATE_WITH_KNOWN_LIMITATIONS`
- `SCHEMA_ADJUSTMENT_REQUIRED`
- `BLOCKED`

If ready, this still does NOT activate schema.

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

# 11. Allowed repo modifications

Only:

`docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`

Temporary files outside repo are allowed during testing and must be removed.

Do NOT update:

`docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`

in this step.

---

# 12. Stop condition

Stop after producing the smoke-test report.

Do not:
- approve the schema review;
- activate `yuta-spec-driven`;
- modify `openspec/config.yaml`;
- update OpenSpec skills;
- start a real YuTa change;
- begin Step 7.3.
