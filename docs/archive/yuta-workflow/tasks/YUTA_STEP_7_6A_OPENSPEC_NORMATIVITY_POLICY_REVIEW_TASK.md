# YUTA — Step 7.6A: OpenSpec Normativity Policy Review

## Mục tiêu

Chốt **khi nào `openspec/specs/**` được coi là behavioral requirements chính thức
(normative) của YUTA**.

Hiện tại:

```text
yuta-spec-driven = ACTIVE
```

nhưng:

```text
openspec/specs/** = chưa normative
```

Repository hiện có:

```text
0 main specs
0 active product changes
```

Đây là thời điểm an toàn để định nghĩa policy trước khi tạo feature change thật.

Đây là **policy-review only**.

Không tạo main spec.
Không tạo real change.
Không sync/archive.
Không sửa schema/config/skills.
Không sửa Product Knowledge/code.

---

# 1. Đọc authority hiện tại

Đọc:

- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`
- `docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md`
- `openspec/config.yaml`
- `openspec/schemas/yuta-spec-driven/schema.yaml`

Xác nhận:

- `yuta-spec-driven` đang active;
- `openspec/specs/**` đang empty;
- không active real change.

---

# 2. Định nghĩa normative scope

Policy phải phân biệt rõ:

## Product Knowledge

Trả lời:

```text
WHY / broader WHAT / module purpose / product context
```

Ví dụ:
- module để làm gì;
- product intent rộng;
- relationships;
- scope/non-goals;
- accepted durable decisions.

## Accepted ADR / architecture / security / runtime boundary

Là authority cho durable boundary tương ứng.

OpenSpec spec KHÔNG được silently override các boundary này.

## `openspec/changes/**`

Luôn là:

```text
PROPOSED / IN-PROGRESS
```

Không normative.

Dù:
- proposal done;
- analysis ready;
- specs written;
- design/tasks done;
- apply complete;
- verify pass;
- archive pending.

## `openspec/specs/**`

Sau future normativity activation, đây sẽ là:

> primary normative authority cho **precise observable behavioral requirements**
> bên trong accepted durable boundaries.

Không phải authority cho:
- implementation state;
- deployment;
- environment;
- production readiness;
- provider readiness;
- architecture boundary ngoài phạm vi requirement.

---

# 3. Chốt approval gate trước sync

Đề xuất policy đơn giản nhất:

```text
Change
  ↓
proposal
  ↓
analysis
  ↓
specs
  ↓
design
  ↓
tasks
  ↓
apply
  ↓
verify
  ↓
SPEC APPROVAL GATE
  ├─ not approved → không sync
  └─ approved
       ↓
      sync-specs
       ↓
main specs trở thành normative
       ↓
archive
```

Đánh giá xem đây có phải policy tốt nhất cho YUTA hay không.

### Approval gate phải xác nhận tối thiểu

1. Product Intent của change đã được chấp nhận cho bounded capability.
2. Không còn `CONFLICT` ảnh hưởng requirement.
3. `NEEDS REVIEW` ảnh hưởng requirement đã được resolve hoặc explicitly scoped out.
4. Delta specs phản ánh đúng behavior được approve.
5. Specs không override accepted ADR/architecture/security/runtime boundary.
6. Verify result đủ cho bounded implementation claim nếu implementation đã được làm.
7. Reviewer explicitly authorizes sync.

Không yêu cầu production readiness để approve behavioral spec.

---

# 4. Ai/cái gì có quyền approve?

Không invent named person/role nếu repo không định nghĩa.

Policy nên dùng khái niệm:

```text
accountable YUTA reviewer
```

và yêu cầu authority tương ứng theo loại decision:

- Product behavior → Product authority
- Architecture/security boundary → owning architecture/security authority
- Legal/privacy-sensitive behavior → applicable legal/privacy review
- Provider/external behavior → provider evidence khi requirement phụ thuộc nó

Một change có thể cần nhiều reviewer theo scope.

Không biến Codex/OpenSpec workflow thành approver.

---

# 5. Sync semantics

Chốt:

```text
approval permits sync
sync performs mechanical promotion
```

Tức:

- approval là hành động governance;
- `sync-specs` là hành động kỹ thuật cập nhật main specs;
- sync không tự tạo approval;
- nhưng sau khi policy normative được activate, **content đã sync vào
  `openspec/specs/**` theo gate này là normative**.

Nếu sync thất bại:
- main spec cũ vẫn là normative;
- change chưa được promoted;
- không archive như thành công.

Nếu partial/misaligned sync:
- stop;
- verify diff;
- không claim normative transition hoàn tất.

---

# 6. Archive semantics

Đánh giá thứ tự mặc định:

```text
approve
→ sync
→ validate main specs
→ archive
```

Archive:
- đóng history;
- không phải authority event;
- không làm spec normative;
- không làm implementation/production ready.

Nếu change không có behavioral spec (`skip_specs: true`):
- không có normative spec promotion;
- archive vẫn được phép nếu workflow/policy khác pass.

---

# 7. Main-spec conflict policy

Nếu main spec mới conflict với:

### accepted durable boundary
→ main spec KHÔNG được sync cho đến khi boundary được explicitly changed/approved.

### Product Knowledge broader intent
→ resolve conflict before sync.

### existing main spec
→ delta phải MODIFY/REMOVE/ADD đúng semantics;
→ không để hai normative requirements mâu thuẫn cùng tồn tại.

### code
→ spec vẫn có thể là normative desired behavior;
→ code mismatch = implementation gap, không tự sửa spec theo code.

### production runtime
→ runtime mismatch = deployment/readiness gap, không tự đổi normative spec.

---

# 8. Spec change after normativity

Sau khi `openspec/specs/**` normative:

Không sửa main spec thủ công để thay đổi behavior, trừ emergency correction policy
được separately approved.

Behavior change bình thường phải đi:

```text
new OpenSpec change
→ proposal
→ analysis
→ delta specs
→ design/tasks/apply/verify
→ approval
→ sync
```

Nếu chỉ sửa typo/format không thay behavior:
- có thể dùng bounded docs/non-behavior process;
- không được thay semantic requirement dưới nhãn typo.

---

# 9. Lifecycle separation

Policy phải ghi rõ:

```text
normative spec approved
≠ Product Decision lifecycle automatically APPROVED globally
≠ code IMPLEMENTED
≠ environment enabled
≠ production READY
≠ external dependency READY
```

Một bounded Product Decision có thể cần update riêng nếu approval evidence đủ.

Không auto-update Module Registry/Lifecycle Model chỉ vì sync.

---

# 10. Transition strategy vì hiện có 0 main specs

Đánh giá lợi thế:

Repository hiện chưa có main specs, nên YUTA có thể chọn clean cutover:

```text
Normativity policy APPROVED
        ↓
activate normative role
        ↓
mọi main spec được tạo từ đây
phải qua approval gate trước sync
```

Không cần audit/migrate legacy main specs vì hiện không có.

Chốt xem có cần một explicit policy file/current-authority update khi activation
xảy ra hay không.

---

# 11. Authority Model update proposal

Nếu normative policy được approve sau này, đề xuất exact conceptual update:

Trong `docs/AUTHORITY_MODEL.md`:

- accepted durable decisions vẫn highest cho durable boundaries;
- `openspec/specs/**` trở thành primary authority cho precise behavioral
  requirements **inside those boundaries**;
- Product Knowledge vẫn broader context/intent;
- code/tests vẫn Implemented State evidence;
- runtime/deployment evidence vẫn production authority.

Không apply thay đổi trong Step 7.6A.

---

# 12. Failure / rollback policy

Định nghĩa action khi:

- approval chưa có;
- verify fail;
- sync fail;
- sync tạo conflict;
- main spec validation fail;
- later discover approved spec sai;
- emergency behavior correction cần làm.

Không silent rollback.
Không edit normative spec để khớp code nếu code sai.

---

# 13. Day-to-day flow sau normativity

Đề xuất sơ đồ ngắn:

```text
IDEA
 ↓
PROPOSE
 ↓
ANALYSIS
 ↓
SPECS
 ↓
DESIGN
 ↓
TASKS
 ↓
APPLY
 ↓
VERIFY
 ↓
APPROVE SPECS
 ↓
SYNC → normative main spec
 ↓
ARCHIVE
```

Nếu `skip_specs: true`:

```text
IDEA
 ↓
PROPOSE / ANALYSIS
 ↓
DESIGN? / TASKS
 ↓
APPLY / VERIFY
 ↓
ARCHIVE
```

Không có spec promotion.

---

# 14. Output duy nhất

Tạo:

`docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`

Nội dung tối thiểu:

1. Current state
2. Normative scope
3. Authority relationship
4. Approval gate
5. Reviewer/authority rule
6. Sync semantics
7. Archive semantics
8. Conflict policy
9. Main-spec modification policy
10. Lifecycle separation
11. Clean-cutover strategy
12. Required Authority Model update
13. Failure/rollback policy
14. Day-to-day flow
15. Exact activation changes proposed
16. Final recommendation

Final recommendation:

- `READY_TO_ENABLE_NORMATIVE_SPECS`
- `READY_WITH_POLICY_ADJUSTMENT`
- `MORE_GOVERNANCE_REQUIRED`
- `BLOCKED`

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

# 15. Allowed modifications

Chỉ tạo:

`docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`

Không sửa file nào khác.

---

# 16. Stop condition

Dừng sau Step 7.6A.

Không:
- make specs normative;
- update Authority Model;
- create real change/spec;
- sync/archive;
- modify schema/config/skills/code.
