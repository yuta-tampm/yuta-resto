# YUTA — Step 7.6B: Enable Normative Main Specs

## Mục tiêu

Kích hoạt vai trò normative cho `openspec/specs/**` trong hệ thống authority của YUTA,
dựa trên policy đã được APPROVED ở Step 7.6A.

Quan trọng:

```text
openspec/specs/** chỉ normative khi:
approval gate PASS
→ sync thành công
→ resulting main specs validate thành công
```

Không phải mọi file trong `openspec/specs/**` tự động normative chỉ vì tồn tại.

Hiện repository có:

```text
0 main specs
0 active real changes
```

nên đây là clean cutover, không cần migrate legacy spec.

Đây là governance activation only.

Không tạo main spec.
Không tạo real change.
Không sync/archive.
Không sửa OpenSpec schema/config/skills.
Không sửa product code.

---

# 1. Preconditions

Đọc:

- `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`
- `docs/AUTHORITY_MODEL.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`
- `docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md`
- `openspec/config.yaml`

Xác nhận:

- normativity policy = `Status: APPROVED`
- recommendation = `READY_TO_ENABLE_NORMATIVE_SPECS`
- default schema = `yuta-spec-driven`
- `openspec/specs/**` empty
- no real active change

Nếu khác:
- dừng;
- không sửa authority docs.

---

# 2. Update `docs/AUTHORITY_MODEL.md`

Cập nhật current OpenSpec position từ future/non-normative sang active normative role.

Phải giữ nguyên nguyên tắc:

```text
Accepted durable decisions
> control durable product/architecture/security/runtime/data boundaries
```

Bổ sung rõ:

```text
Approved normative openspec/specs/**
= primary authority for precise observable behavioral requirements
  inside accepted durable boundaries
```

Phải ghi rõ điều kiện normative:

Main spec chỉ được coi normative khi:
1. exact delta đã qua accountable approval gate;
2. sync được explicitly authorized;
3. sync hoàn tất thành công;
4. resulting main specs validate và diff review thành công.

`openspec/changes/**` luôn non-normative.

Không tạo global universal authority order mới.
Vẫn route theo question type.

---

# 3. Update `docs/PRODUCT_KNOWLEDGE.md`

Cập nhật OpenSpec integration/routing section.

Phải nói rõ:

- Product Knowledge vẫn là broader Product Intent/context;
- `openspec/specs/**` là normative cho precise behavior sau approved promotion;
- `openspec/changes/**` là proposed/in-progress;
- code/tests = Implemented State evidence;
- runtime/deployment evidence = live/readiness authority;
- specs không override accepted durable boundaries.

Không copy full normativity policy vào file này.
Chỉ route/link tới policy chính.

Thêm link tới:

`docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`

---

# 4. Update `docs/LIFECYCLE_STATUS_MODEL.md`

Xóa wording cũ nói OpenSpec specs chưa normative nếu còn.

Thêm nguyên tắc hiện tại:

```text
Normative spec state
≠ lifecycle promotion
```

Cụ thể:

- normative behavioral spec không tự làm Product Decision APPROVED globally;
- không tự làm Implementation IMPLEMENTED;
- không tự làm Environment enabled;
- không tự làm Production Readiness READY;
- không tự làm External Dependency READY.

Spec approval/sync có thể là evidence cho một bounded Product Decision update,
nhưng lifecycle update phải là action riêng.

Không thay đổi 5 dimension names/values.

---

# 5. Update `docs/MODULE_REGISTRY.md`

Cập nhật phần OpenSpec position / registry guidance để phản ánh:

- main specs có thể là normative behavioral authority sau approved promotion;
- registry vẫn là lifecycle/ownership index;
- không auto-update lifecycle chỉ vì spec sync;
- capability-specific spec links chỉ thêm khi approved main specs thật sự tồn tại;
- hiện tại main spec count vẫn là 0, nên không thêm fake links/rows.

Không đổi lifecycle values của bất kỳ module nào trong Step 7.6B.

---

# 6. Add concise governance record

Tạo:

`docs/OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md`

Nội dung tối thiểu:

## Preconditions
- policy approved
- yuta-spec-driven active
- 0 main specs
- 0 active changes

## Authority changes
- summary exact changes in 4 docs

## Normative rule
```text
approval
→ sync
→ validate
→ normative main spec
```

## Non-normative areas
- changes
- unsynced delta specs
- failed/partial sync output
- unvalidated main-spec result

## Lifecycle separation
- all 5 dimensions remain independent

## Repository safety
- no OpenSpec schema/config/skills changed
- no main spec/change created
- no product code changed

## Current state after activation
```text
Normative role: ENABLED
Normative main spec count: 0
```

Final recommendation:

`NORMATIVE_SPECS_POLICY_ACTIVE`

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

# 7. Validation

Run appropriate checks:

- docs/link validation
- targeted formatting
- `git diff --check`
- architecture check if required by repository policy

Confirm:

1. only these files changed:
   - `docs/AUTHORITY_MODEL.md`
   - `docs/PRODUCT_KNOWLEDGE.md`
   - `docs/LIFECYCLE_STATUS_MODEL.md`
   - `docs/MODULE_REGISTRY.md`
   - `docs/OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md`
2. `openspec/config.yaml` unchanged
3. `openspec/schemas/**` unchanged
4. `.agents/skills/**` unchanged
5. `openspec/specs/**` still empty
6. no real active change
7. no lifecycle values changed
8. no product code changed

---

# 8. Stop condition

Dừng sau Step 7.6B.

Không:
- create first real OpenSpec change;
- create/sync main spec;
- archive anything;
- modify schema/config/skills;
- modify product code;
- begin first feature workflow.

