# YUTA — Automated OpenSpec Review Workflow Setup v1

## Mục tiêu

Giảm tối đa thao tác thủ công giữa YUTA owner, ChatGPT reviewer và Codex,
nhưng **không bỏ các human review gate** đã chứng minh hữu ích trong Pilot #1.

Sau setup, workflow mục tiêu:

```text
User request
   ↓
$yuta-run-change
   ↓
Proposal + Analysis
   ↓
01-analysis-review.md
   ↓
HUMAN REVIEW GATE 1
   ↓ approved
$yuta-run-change <change> continue
   ↓
Specs
   ↓
02-specs-review.md
   ↓
HUMAN REVIEW GATE 2
   ↓ approved
$yuta-run-change <change> continue
   ↓
Design + Tasks + Apply + Verify
   ↓
03-final-review.md
   ↓
HUMAN REVIEW GATE 3
   ↓ explicit sync authorization
$yuta-finish-change
   ↓
Sync + validate main specs + archive
```

Đối với no-spec change (`skip_specs: true`), Gate 2 được bỏ qua.

Đối với change nhạy cảm, workflow có thể tạo thêm Design Review Gate trước apply.

Mục tiêu quan trọng:

- Codex tự chạy giữa các gate.
- User không còn phải copy từng task prompt.
- External reviewer chỉ cần nhận **một review packet tại mỗi gate**.
- Approval phải explicit, không được Codex tự suy diễn.
- Artifact thay đổi sau review phải invalidate approval.
- Không patch các `openspec-*` generated skills.

---

# 1. Kiểm tra môi trường trước

Đọc:

- `AGENTS.md`
- `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`
- `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`
- `docs/AUTHORITY_MODEL.md`
- `openspec/config.yaml`
- `openspec/schemas/yuta-spec-driven/schema.yaml`
- relevant `.agents/skills/openspec-*`

Kiểm tra local Codex skill convention đang dùng.

Không sửa generated OpenSpec skills.

---

# 2. Tạo hai repo-scoped skills

Tạo:

```text
.agents/skills/yuta-run-change/SKILL.md
.agents/skills/yuta-finish-change/SKILL.md
```

Đây là project-owned skills.

Chúng không được dùng cùng `name` với OpenSpec generated skills.

Không sửa:

```text
.agents/skills/openspec-*/**
```

---

# 3. Skill `yuta-run-change`

Frontmatter tối thiểu:

```yaml
---
name: yuta-run-change
description: Run or resume a YUTA OpenSpec change through the next human review gate. Use for YUTA feature/change planning, implementation, and verification. Never sync or archive normative specs.
---
```

Skill phải hoạt động như **resumable state machine**.

## 3.1 Input modes

### Start new change

User có thể nói:

```text
$yuta-run-change
<description>
```

Skill:
1. hiểu bounded request;
2. nếu material ambiguity tồn tại trước change creation → hỏi user;
3. derive kebab-case change name;
4. tạo change dùng current default `yuta-spec-driven`;
5. chạy đến Gate 1.

### Resume existing change

User có thể nói:

```text
$yuta-run-change <change-name>
Analysis review approved. Continue.
```

hoặc:

```text
$yuta-run-change <change-name>
Specs review approved. Continue.
```

Skill phải:
- xác định current review gate;
- require explicit approval wording;
- verify reviewed artifacts chưa đổi;
- mark packet approved;
- tiếp tục đến next gate.

Không infer approval từ:
- `Status: PASS`;
- tests;
- OpenSpec status;
- file existence;
- prior assistant text;
- git commit;
- PR approval.

---

# 4. Gate 1 — Proposal + Analysis

Skill phải dùng OpenSpec CLI/schema state, không hard-code assumption rằng chỉ có
built-in artifacts.

Tạo proposal và analysis theo `yuta-spec-driven`.

Sau analysis:

### Nếu `BLOCKED_NEEDS_REVIEW` hoặc `CONFLICT`

- không tạo specs;
- tạo Gate 1 review packet;
- stop.

### Nếu `READY_FOR_SPECS`

- tạo Gate 1 review packet;
- stop trước specs.

### Nếu `NO_SPEC_BEHAVIOR_CHANGE`

- tạo Gate 1 review packet;
- stop;
- sau explicit Gate 1 approval có thể đi no-spec path.

---

# 5. Review packet protocol

Tạo directory:

```text
docs/reviews/<change-name>/
```

Tạo packet theo gate:

```text
01-analysis-review.md
02-specs-review.md
02b-design-review.md   # conditional, sensitive changes only
03-final-review.md
```

Không tạo tất cả trước; chỉ tạo khi gate tương ứng đến.

Mỗi packet phải self-contained đủ để một external reviewer review mà thường
không cần upload thêm nhiều artifact.

## 5.1 Packet common header

Mỗi packet phải có:

```text
Change:
Gate:
Review status:
Created:
Schema:
Analysis conclusion:
Sensitive change:
```

Review status values:

- `AWAITING_HUMAN_REVIEW`
- `APPROVED`
- `CHANGES_REQUESTED`
- `INVALIDATED_BY_ARTIFACT_CHANGE`

## 5.2 Integrity hashes

Packet phải ghi SHA-256 của exact artifacts/diff được review.

Ví dụ Gate 1:

- proposal hash
- analysis hash

Gate 2:

- proposal hash
- analysis hash
- all delta spec hashes

Gate 3:

- planning artifact hashes
- implementation diff hash
- verify evidence hash/summary source

Khi user approve/resume:
- recompute hashes;
- nếu khác packet → không accept approval;
- set/recreate packet as `INVALIDATED_BY_ARTIFACT_CHANGE`;
- stop for re-review.

## 5.3 Full review content

### Gate 1 packet phải include

- request/change summary;
- exact proposal content;
- exact analysis content;
- authorities consulted;
- `CONFLICT` / `NEEDS REVIEW`;
- explicit questions requiring Product decision;
- analysis conclusion;
- recommendation.

### Gate 2 packet phải include

- approved Gate 1 reference/hash;
- exact delta spec content;
- requirements/scenarios summary;
- OpenSpec strict validation result;
- any changed assumption since analysis;
- remaining ambiguity;
- recommendation.

### Gate 3 packet phải include

- approved Gate 1 + Gate 2 references/hashes;
- design summary;
- tasks summary + completion;
- implementation files changed;
- mapping specs → implementation/tests;
- test/typecheck/validation results;
- verify result;
- deviations from specs/design;
- unresolved issues;
- `git diff --stat`;
- changed-file list;
- implementation diff hash;
- for reasonably small diffs, include relevant/full diff;
- for large diffs, include key hunks and clearly say external reviewer may request
  exact files/diff before approval;
- explicit field:

```text
Sync authorization: PENDING
```

---

# 6. Gate 2 — Specs

Sau Gate 1 explicit approval:

## Behavior-changing path

Tạo specs only trước.

- validate strict;
- nếu fail → Codex được tự sửa spec-format/internal consistency errors miễn là
  không thay Product decision;
- nếu fix yêu cầu behavior decision mới → stop.

Tạo:

`02-specs-review.md`

Stop.

## No-spec path

Nếu analysis kết luận `NO_SPEC_BEHAVIOR_CHANGE` và metadata/CLI hợp lệ cho
`skip_specs: true`:

- không invent spec;
- không tạo Gate 2;
- sau Gate 1 approval tiếp tục planning theo schema/workflow policy.

---

# 7. Sensitive-change Design Gate

Tạo `02b-design-review.md` và stop trước apply nếu change ảnh hưởng ít nhất một:

- authorization/security boundary;
- data ownership/runtime boundary;
- database migration/destructive migration;
- payment/fiscal behavior;
- Personnel/legal/privacy-sensitive data;
- external provider contract/readiness;
- POS transaction integrity;
- irreversible/destructive operation;
- cross-module durable boundary.

Design Gate packet phải include:
- exact design;
- security/data/runtime implications;
- migration/rollback;
- unresolved design choices;
- specs hashes.

Không tự approve sensitive design.

Với change bình thường, design + tasks không cần human gate riêng.

---

# 8. Design + Tasks + Apply + Verify

Sau Specs approval, hoặc Gate 1 approval trong no-spec path:

1. tạo design nếu applicable;
2. nếu design conditional và không applicable:
   - follow approved YUTA operational policy;
   - không tạo ceremonial design;
3. tạo tasks;
4. apply tasks;
5. tự xử lý lỗi kỹ thuật nằm rõ trong approved specs/design;
6. nếu implementation discovery làm requirement sai hoặc cần Product decision:
   - stop;
   - quay lại gate phù hợp;
   - không tự sửa normative intent;
7. run verify;
8. nếu verify fail do implementation bug:
   - Codex có thể sửa và verify lại;
9. nếu verify fail do spec/design conflict:
   - stop for human review.

Khi verify pass đủ bounded scope:
- tạo Gate 3 packet;
- stop.

Không sync/archive trong `yuta-run-change`.

---

# 9. Skill `yuta-finish-change`

Frontmatter tối thiểu:

```yaml
---
name: yuta-finish-change
description: Finish a reviewed YUTA OpenSpec change after explicit final human approval and sync authorization. Validate reviewed state, sync normative specs when applicable, validate main specs, then archive.
---
```

Input ví dụ:

```text
$yuta-finish-change <change-name>
Final review approved. I authorize spec sync and archive.
```

Skill bắt buộc:

1. tìm `03-final-review.md`;
2. require status `AWAITING_HUMAN_REVIEW`;
3. require explicit current-user approval + sync authorization;
4. recompute artifact + implementation hashes;
5. nếu mismatch → refuse, invalidate packet, require re-review;
6. mark final packet `APPROVED` và record explicit sync authorization;
7. nếu behavior change có approved delta specs:
   - run sync-specs;
   - inspect diff;
   - validate resulting main specs;
   - nếu sync/validation fail → stop, do not archive as successful;
8. nếu `skip_specs: true`:
   - no normative spec promotion;
9. archive change only after applicable promotion/validation success;
10. produce concise completion report.

Không map sync/archive sang lifecycle promotion.

---

# 10. Human approval record

Không invent universal approver name.

Packet chỉ ghi:

```text
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
```

Nếu repo có commit/revision/hash, ghi exact reviewed revision.

Approval phải bounded theo gate/change.

---

# 11. Docs protocol

Tạo:

```text
docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md
docs/reviews/README.md
```

`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` phải giải thích ngắn:

```text
$yuta-run-change
→ Gate 1 packet
→ human review
→ resume
→ Gate 2 packet
→ human review
→ resume
→ implementation + verify
→ Gate 3 packet
→ human review
→ $yuta-finish-change
```

Nêu rõ:
- ChatGPT/external reviewer vẫn là independent review layer;
- automation chỉ loại bỏ manual handoff;
- human Product/authority decisions không được tự động hóa.

`docs/reviews/README.md` phải nói:
- review packets là review/provenance evidence;
- không phải Product Knowledge;
- không phải normative specs;
- approval invalid nếu reviewed content hash thay đổi.

---

# 12. Không sửa current Pilot #1 trong setup

Pilot hiện tại:

`establishment-copy-primary-contact-to-public`

Không tiếp tục/change artifacts của pilot trong task setup này.

Sau khi setup được review, Pilot #1 sẽ dùng để smoke-test resume flow từ current
state.

---

# 13. Validation

Kiểm tra:

- Codex detects `$yuta-run-change`
- Codex detects `$yuta-finish-change`
- skill frontmatter valid
- generated `openspec-*` skill tree unchanged
- custom OpenSpec schema unchanged
- config unchanged
- current Pilot #1 unchanged
- docs formatting/link checks
- `git diff --check`

Nếu Codex cần restart để skill appear, report rõ; không coi là failure.

---

# 14. Output report

Tạo:

`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md`

Report gồm:

1. files created
2. skill discovery result
3. state-machine summary
4. review gates
5. hash/invalidation mechanism
6. sensitive-change behavior
7. no-spec behavior
8. finish/sync policy
9. protected files unchanged
10. recommendation:
   - `READY_TO_SMOKE_TEST_ON_PILOT_01`
   - `SETUP_ADJUSTMENT_REQUIRED`

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

# 15. Allowed modifications

Chỉ:

```text
.agents/skills/yuta-run-change/**
.agents/skills/yuta-finish-change/**
docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md
docs/reviews/README.md
docs/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md
```

Không sửa file khác.

Dừng sau setup.
Không tiếp tục Pilot #1.
