# YUTA — Step 7.5: Activate `yuta-spec-driven` as Default Schema

## Mục tiêu

Kích hoạt custom schema đã được approve:

```text
yuta-spec-driven
```

làm schema mặc định của repository YuTa.

Đây là bước activation-only.

Không sửa custom schema.
Không sửa generated skills.
Không tạo real YUTA change/spec.
Không làm OpenSpec main specs normative.
Không sửa Product Knowledge, lifecycle docs, architecture hoặc product code.

---

## 1. Preconditions

Đọc:

- `docs/OPENSPEC_BASELINE_AUDIT.md`
- `docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`
- `docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`
- `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md`
- `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`
- `openspec/config.yaml`
- `openspec/schemas/yuta-spec-driven/schema.yaml`

Xác nhận:

- OpenSpec = `1.11.0`
- activation policy status = `APPROVED`
- custom schema validates
- custom schema resolves from `project`
- current default vẫn là `spec-driven`

Nếu bất kỳ precondition nào fail:
- dừng;
- không activate.

---

## 2. Snapshot trước activation

Ghi lại:

- `git status --short`
- SHA-256 của `openspec/config.yaml`
- SHA-256 của `openspec/schemas/yuta-spec-driven/schema.yaml`
- tree hash của `.agents/skills/**` nếu practical
- số file trong `openspec/specs/**`
- số active file/change trong `openspec/changes/**`

Mục tiêu là chứng minh activation không gây side effect.

---

## 3. Apply exact activation diff

Chỉ sửa:

`openspec/config.yaml`

Từ:

```yaml
schema: spec-driven
```

sang:

```yaml
schema: yuta-spec-driven
```

Không sửa context/rules/comment khác.

Không chạy command regenerate skills.

---

## 4. Validate activation

Chạy:

```bash
openspec --version
openspec schema validate yuta-spec-driven --json --verbose
openspec schema which yuta-spec-driven --json
openspec schemas --json
openspec context --json
```

Xác nhận:

- version = `1.11.0`
- `yuta-spec-driven` valid, zero issues
- source = `project`
- no shadows
- project default = `yuta-spec-driven`
- package `spec-driven` vẫn tồn tại và không bị shadow

---

## 5. Isolated default-selection smoke test

Không tạo change thật trong repo YuTa.

Tạo temp workspace ngoài repo.

Copy tối thiểu:

- activated `openspec/config.yaml`
- `openspec/schemas/yuta-spec-driven/**`

Tạo disposable change **không truyền `--schema`**:

```bash
openspec new change smoke-default-selection --json
```

Xác nhận `.openspec.yaml` của change tự pin:

```yaml
schema: yuta-spec-driven
```

Chạy:

```bash
openspec status --change smoke-default-selection --json
```

Expected ban đầu:

```text
proposal = ready
analysis = blocked
specs    = blocked
design   = blocked
tasks    = blocked
```

Tạo synthetic proposal trong temp rồi check lại:

```text
analysis = ready
specs/design/tasks = blocked
```

Không cần chạy full planning chain lại; Step 7.2/7.3B đã smoke-test graph.

Xóa temp workspace sau test.

---

## 6. Existing changes / specs safety

Trong repo thật:

- xác nhận không real active change nào bị rewrite/migrate;
- nếu có pre-existing pinned change, schema pin phải giữ nguyên;
- `openspec/specs/**` không thay đổi;
- không sync/archive gì;
- không tạo main spec.

---

## 7. Normativity and lifecycle safety

Ghi rõ trong report:

```text
Schema activation
≠ OpenSpec specs normative
≠ Product Decision approval
≠ Implementation completion
≠ Environment enablement
≠ Production Readiness
≠ External Dependency readiness
```

Policy approved ở Step 7.4 vẫn áp dụng nguyên vẹn.

---

## 8. Repository safety check

Sau activation, xác nhận:

- custom schema hash unchanged
- generated skills unchanged
- Product Knowledge unchanged
- lifecycle docs unchanged
- architecture unchanged
- product code unchanged
- real specs/changes unchanged

Chỉ expected repo changes:

1. `openspec/config.yaml`
2. activation report

---

## 9. Output

Tạo:

`docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md`

Nội dung tối thiểu:

1. Preconditions
2. Exact activation diff
3. Validation results
4. Default-selection smoke test
5. Existing change/spec safety
6. Schema/skill integrity
7. Normativity/lifecycle safety
8. Repository safety
9. Final status

Final recommendation:

`YUTA_SPEC_DRIVEN_ACTIVE`

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

## 10. Allowed modifications

Chỉ:

- `openspec/config.yaml`
- `docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md`

Không sửa file khác.

---

## 11. Stop condition

Dừng sau activation + validation.

Không:
- tạo real YuTa OpenSpec change;
- tạo main spec;
- sync/archive;
- make specs normative;
- modify skills/schema;
- modify product code;
- start next governance step.
