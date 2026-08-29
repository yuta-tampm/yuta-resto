# YUTA — Step 7.1: Fork and Design `yuta-spec-driven`

## Mục tiêu

Tạo custom OpenSpec schema đầu tiên cho YUTA dựa trên local OpenSpec **1.11.0**,
nhưng **chưa kích hoạt làm default**.

Schema mục tiêu:

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

Dependency bắt buộc:

- `proposal` requires `[]`
- `analysis` requires `[proposal]`
- `specs` requires `[analysis]`
- `design` requires `[specs]`
- `tasks` requires `[specs, design]`
- `apply.requires: [tasks]`
- `apply.tracks: tasks.md`

Mục tiêu của artifact mới `analysis` là buộc agent đối chiếu Product Knowledge,
authority, current code và lifecycle **trước khi viết behavioral requirements**.

Đây là bước fork + schema design + validation.

KHÔNG:
- đổi `openspec/config.yaml` sang custom schema;
- làm `openspec/specs/` normative;
- tạo product change thật;
- tạo spec thật;
- apply code;
- regenerate `.agents/skills`;
- sửa Product Knowledge.

---

# 1. Đọc trước

Đọc:

1. `AGENTS.md`
2. `docs/OPENSPEC_BASELINE_AUDIT.md`
3. `docs/PRODUCT_KNOWLEDGE.md`
4. `docs/AUTHORITY_MODEL.md`
5. `docs/LIFECYCLE_STATUS_MODEL.md`
6. `docs/MODULE_REGISTRY.md`
7. `docs/CURRENT_STATE.md`
8. `openspec/config.yaml`

Kiểm tra local CLI:

```bash
openspec --version
openspec schema which spec-driven --json
openspec schema validate spec-driven --json --verbose
```

Version phải là `1.11.0`.

Nếu version/schema khác baseline:
- dừng;
- report blocker;
- không fork.

---

# 2. Fork schema

Chạy:

```bash
openspec schema fork spec-driven yuta-spec-driven
```

Không dùng `--force` trừ khi task này vừa tạo destination và một lỗi an toàn cần
retry rõ ràng.

Expected destination:

```text
openspec/schemas/yuta-spec-driven/
├── schema.yaml
└── templates/
    ├── proposal.md
    ├── spec.md
    ├── design.md
    └── tasks.md
```

Sau fork:

- xác nhận source là `project`;
- xác nhận không shadow built-in `spec-driven`;
- tên schema phải là `yuta-spec-driven`;
- giữ built-in `spec-driven` nguyên vẹn.

Không đổi `openspec/config.yaml`.

---

# 3. Nguyên tắc minimize divergence

Custom schema phải giữ càng gần upstream `spec-driven` 1.11.0 càng tốt.

Giữ nguyên template bodies của:

- `templates/proposal.md`
- `templates/spec.md`
- `templates/design.md`
- `templates/tasks.md`

trừ khi một thay đổi tối thiểu thật sự cần thiết để schema hoạt động.

Không rewrite các template built-in chỉ để "YUTA hóa" wording.

YUTA-specific governance nằm chủ yếu ở:

- artifact `analysis`;
- `analysis` template;
- dependency graph;
- concise artifact instructions.

Mục tiêu là giúp upgrade OpenSpec sau này dễ diff/rebase.

---

# 4. Thêm artifact `analysis`

Tạo:

```text
openspec/schemas/yuta-spec-driven/templates/analysis.md
```

Artifact:

```yaml
id: analysis
generates: analysis.md
requires: [proposal]
```

## Vai trò của `analysis`

`analysis.md` trả lời:

> Trước khi viết requirement, change này có đủ authority/evidence để xác định
> hành vi mong muốn hay chưa?

Nó KHÔNG phải:
- technical design;
- implementation plan;
- task list;
- Product Knowledge copy;
- lifecycle promotion;
- approval substitute.

---

# 5. Template `analysis.md`

Template phải ngắn, routing-first, có các section sau.

Dùng English structural headings; nội dung artifact sẽ theo project language
(Vietnamese) từ `openspec/config.yaml`.

```md
# Change Analysis

## Scope and Change Type
<!--
Bound the exact capability/change.
State whether this is behavioral, refactor/tooling/docs-only, UI-affecting,
data-affecting, security-sensitive, external-dependency-sensitive, etc.
Do not infer approval from code existence.
-->

## Sources Consulted
<!--
List only the relevant sources actually read:
- Product Knowledge Home / feature/product source
- Module Registry row
- accepted decisions / ADRs
- architecture/security sources
- current code/tests/contracts/schema when needed

Link to sources; do not copy their contents.
-->

## Authority and Product Decision
<!--
State the controlling Product Intent authority for this bounded change.
Record accepted boundaries.
If approval is absent or sources conflict, use NEEDS REVIEW / CONFLICT and
do not invent approval.
-->

## Current Implemented State
<!--
Summarize only repository evidence needed to understand the delta.
Separate:
- what code/tests currently implement;
- what is not implemented;
- what is unverified.

Repository implementation is not deployment evidence.
-->

## Affected Boundaries
<!--
Identify only relevant boundaries:
- runtime owner
- data owner
- tenancy/auth/permissions
- public/local boundary
- external provider/device
- cross-module dependencies

State "not affected" when appropriate.
Do not design the solution here.
-->

## Lifecycle Baseline
<!--
Record the current bounded values/evidence relevant to the change from
LIFECYCLE_STATUS_MODEL / MODULE_REGISTRY:
- Product Decision
- Implementation
- Environment
- Production Readiness
- External Dependency

Do not promote any value because an OpenSpec workflow progressed.
-->

## Requirement Readiness
<!--
Can precise behavioral specs be written without guessing?

Use one workflow conclusion:
- READY_FOR_SPECS
- BLOCKED_NEEDS_REVIEW
- NO_SPEC_BEHAVIOR_CHANGE

These are change-analysis conclusions only, NOT YUTA lifecycle statuses.

If NO_SPEC_BEHAVIOR_CHANGE, verify whether skip_specs: true is appropriate.
Do not invent a requirement solely to satisfy OpenSpec validation.
-->

## UI / UX Applicability
<!--
State whether UI/UX is affected.
If yes, route to the relevant current UI page pack/governance source.
Do not create a ux-flow artifact in this default schema.
Do not infer product behavior from screenshots.
-->

## Conflicts and Unknowns
<!--
List only unresolved items that could affect specs/design/tasks.
Classify as CONFLICT or NEEDS REVIEW.
Deferrable design-only questions may be left for design; requirement-changing
questions must be resolved before specs.
-->

## Analysis Conclusion
<!--
State:
- bounded scope confirmed or blocked;
- capabilities that may proceed to specs;
- blockers requiring user/product/architecture/security review;
- whether this change may use skip_specs: true.

Do not choose implementation architecture.
-->
```

Không thêm section kỹ thuật chi tiết hơn nếu chưa có nhu cầu thực tế.

---

# 6. Cập nhật `schema.yaml`

Giữ:

```yaml
name: yuta-spec-driven
version: 1
```

Description phải nói ngắn rằng đây là YUTA spec-driven workflow với mandatory
authority/evidence analysis trước specs.

## Artifact order

Artifact list phải theo thứ tự:

1. proposal
2. analysis
3. specs
4. design
5. tasks

## Dependencies

Encode chính xác:

```text
proposal: []
analysis: [proposal]
specs: [analysis]
design: [specs]
tasks: [specs, design]
```

Không dựa vào list order để tạo sequencing; `requires` phải thể hiện đúng graph.

## Proposal

Giữ purpose/upstream behavior của proposal:
- Why
- What Changes
- Capabilities
- Impact
- concise
- no implementation design

Không biến proposal thành analysis.

## Analysis

Instruction phải yêu cầu agent:

- đọc proposal;
- đọc Product Knowledge **có liên quan**, không đọc/copy toàn bộ docs;
- dùng `AUTHORITY_MODEL.md`;
- dùng Module Registry/Lifecycle Model khi relevant;
- kiểm tra current code/tests khi cần xác minh Implemented State;
- phát hiện `CONFLICT` / `NEEDS REVIEW`;
- dừng nếu requirement-level decision chưa đủ;
- không thiết kế technical solution.

## Specs

Giữ upstream behavior của specs và thêm tối thiểu nguyên tắc:

- specs phải được supported bởi proposal + analysis;
- không resolve `CONFLICT` / `NEEDS REVIEW` bằng assumption;
- nếu analysis kết luận blocker ảnh hưởng requirement, dừng và hỏi/review;
- nếu change thật sự không có spec-level behavior, dùng approved
  `skip_specs: true` path thay vì invent requirement.

Không thay đổi format OpenSpec requirement/scenario:
- `### Requirement`
- SHALL/MUST
- `#### Scenario`
- WHEN/THEN

## Design

`design` requires `specs`.

Giữ upstream design role:
- HOW
- decisions/rationale
- risks/trade-offs
- migration/rollback khi relevant
- open questions chỉ khi thật sự deferrable

Không cho design silently đổi Product Intent/specs.
Nếu technical discovery làm requirement sai:
- quay lại analysis/specs;
- không chữa bằng design assumption.

## Tasks

Giữ upstream checkbox format và tracking behavior.

`tasks` requires `[specs, design]`.

Tasks không được:
- promote lifecycle;
- claim deployment/readiness;
- resolve Product Decision.

## Apply

Giữ upstream:

```yaml
apply:
  requires: [tasks]
  tracks: tasks.md
```

Giữ apply instruction gần upstream.
Có thể thêm một câu rất ngắn:
- pause on blocker/authority conflict;
- task completion is implementation workflow progress, not YUTA lifecycle promotion.

Không thêm operation complexity khác trong Step 7.1.

---

# 7. `skip_specs` compatibility

Candidate B tạo chain qua `specs`, nên phải kiểm tra behavior cho change
docs/tooling/refactor sử dụng:

```yaml
skip_specs: true
```

Trong Step 7.1:

- KHÔNG tự sửa graph chỉ để đoán behavior;
- inspect local CLI/schema behavior;
- ghi rõ vào review report rằng `skip_specs` cần smoke-test ở Step 7.2;
- nếu schema validation đã chứng minh một incompatibility chắc chắn, report nó.

Không tạo product requirement giả.

---

# 8. Validate schema

Chạy:

```bash
openspec schema validate yuta-spec-driven --json --verbose
openspec schema which yuta-spec-driven --json
openspec templates --schema yuta-spec-driven --json
openspec schemas --json
```

Xác nhận:

- schema valid;
- source = project;
- artifact flow có `analysis`;
- template `analysis.md` resolve đúng;
- built-in `spec-driven` vẫn source = package;
- không shadow built-in schema ngoài ý muốn.

Nếu CLI có command read-only để inspect artifact graph/status without creating
change, dùng thêm nếu phù hợp.

---

# 9. Tạo review document

Tạo:

```text
docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md
```

Nội dung tối thiểu:

## Local baseline
- OpenSpec version: 1.11.0
- base schema: spec-driven package
- custom schema: yuta-spec-driven project
- custom schema active as default? NO

## Graph
```text
proposal -> analysis -> specs -> design -> tasks
```

## Diff from upstream
Liệt kê chính xác:
- added `analysis`;
- changed dependencies;
- any minimally changed instructions/templates;
- unchanged upstream templates.

## Analysis artifact contract
Tóm tắt role và stop conditions.

## Knowledge integration
Nói rõ schema reference docs như thế nào mà không duplicate.

## Lifecycle safety
Nói rõ workflow progress không đổi 5 lifecycle dimensions.

## Compatibility concerns
Tối thiểu:
- custom schema commands experimental;
- `skip_specs` must be smoke-tested;
- verify has no analysis-specific semantic dimension;
- sync/archive standard `specs` behavior must be smoke-tested;
- schema-aware skills generated by 1.11.0 but custom graph still needs smoke test.

## Activation status
`NOT ACTIVE`

## Required Step 7.2 smoke tests
Liệt kê:
- new/continue
- propose
- status/instructions order
- apply readiness
- verify
- sync/archive behavior
- behavior-change path
- skip_specs non-behavior path
- no default-config change

Cuối file:

```text
Status: PROPOSED FOR REVIEW
```

---

# 10. Không activate schema

Trong Step 7.1, `openspec/config.yaml` PHẢI tiếp tục:

```yaml
schema: spec-driven
```

Không đổi default.

Không chạy bất kỳ command nào với ý nghĩa tạo Product change thật.

Không tạo:
- `openspec/specs/**`
- product change trong `openspec/changes/**`

Ngoại trừ nếu CLI fork command tự tạo đúng schema directory.

---

# 11. Allowed modifications

Được phép tạo/sửa:

```text
openspec/schemas/yuta-spec-driven/**
docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md
```

Không sửa:
- `openspec/config.yaml`
- `openspec/specs/**`
- `openspec/changes/**`
- `.agents/skills/**`
- Product Knowledge
- code
- architecture
- lifecycle docs

---

# 12. Validation

Xác nhận:

1. `openspec --version` = 1.11.0.
2. `spec-driven` vẫn resolve từ package.
3. `yuta-spec-driven` resolve từ project.
4. custom schema validates with zero schema errors.
5. graph đúng:
   `proposal -> analysis -> specs -> design -> tasks`.
6. analysis template tồn tại.
7. upstream proposal/spec/design/tasks template bodies không bị rewrite nếu
   không có lý do bắt buộc.
8. `openspec/config.yaml` vẫn `schema: spec-driven`.
9. no main spec created.
10. no active product change created.
11. no skill modified/regenerated.
12. no code changed.
13. run Markdown/format checks cho files mới/changed.

---

# 13. Report

Report:

- fork command result;
- files created/modified;
- exact graph;
- exact upstream diff;
- validation output;
- skip_specs concern;
- schema activation status;
- smoke tests required next.

Dừng sau Step 7.1.
Không bắt đầu Step 7.2.
