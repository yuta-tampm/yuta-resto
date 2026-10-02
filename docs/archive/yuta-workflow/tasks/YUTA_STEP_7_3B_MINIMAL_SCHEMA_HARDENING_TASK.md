# YUTA — Step 7.3B: Minimal Schema Hardening

## Mục tiêu

Áp dụng **chỉ** hardening ở schema-level đã được chấp nhận từ Step 7.3A:

```yaml
# CURRENT
design:
  requires:
    - specs

# TARGET
design:
  requires:
    - analysis
    - specs
```

Mục tiêu là bảo đảm `analysis` luôn là direct schema-level gate trước `design`,
kể cả khi OpenSpec đánh dấu `specs` là `skipped` do `skip_specs: true`.

Không patch generated OpenSpec skills trong bước này.

Lý do:
`.agents/skills/openspec-*` là generated files và có thể bị `openspec update`
regenerate/overwrite. Không tạo local divergence khó bảo trì trong Step 7.3B.

---

## 1. Preconditions

Đọc:

- `docs/OPENSPEC_BASELINE_AUDIT.md`
- `docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`
- `docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`
- `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md`
- `openspec/schemas/yuta-spec-driven/schema.yaml`

Chạy:

```bash
openspec --version
openspec schema validate yuta-spec-driven --json --verbose
```

Expected:
- OpenSpec `1.11.0`
- schema valid trước thay đổi

Nếu khác:
- dừng;
- không sửa schema.

---

## 2. Apply exact schema diff

Chỉ sửa dependency của artifact `design`.

From:

```yaml
requires:
  - specs
```

To:

```yaml
requires:
  - analysis
  - specs
```

Không thay đổi:

- artifact IDs
- artifact order
- proposal
- analysis
- specs
- tasks
- templates
- instructions
- apply.requires
- apply.tracks
- schema name/version
- `openspec/config.yaml`

Không thêm dependency khác.

---

## 3. Validate graph

Chạy:

```bash
openspec schema validate yuta-spec-driven --json --verbose
openspec schema which yuta-spec-driven --json
openspec templates --schema yuta-spec-driven --json
openspec schemas --json
```

Xác nhận graph:

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

với direct dependencies:

```text
proposal: []
analysis: [proposal]
specs: [analysis]
design: [analysis, specs]
tasks: [specs, design]
```

`analysis` -> `design` là redundant transitive edge trên behavior path bình
thường nhưng là direct safety gate trên `skip_specs` path.

---

## 4. Isolated targeted smoke test

Test trong temporary workspace ngoài repo.

Không tạo real YUTA change/spec.

### Case A — normal behavior path

Expected:

```text
proposal ready
→ proposal done
analysis ready
→ analysis done
specs ready
→ specs done
design ready
→ design done
tasks ready
```

### Case B — `skip_specs: true`

Ngay sau tạo change + marker:

Expected:

```text
proposal = ready
analysis = blocked
specs = skipped
design = blocked
```

Sau proposal:

```text
analysis = ready
design = blocked
```

Sau analysis:

```text
design = ready
```

Đây là acceptance criterion chính.

Không cần giải quyết conditional-design persisted skip trong Step 7.3B.

### Case C — required design

Tạo synthetic change nơi design condition áp dụng.

Xác nhận:
- design không bị bypass;
- tasks blocked đến khi design tồn tại.

---

## 5. Continue-change limitation

Không sửa:

`.agents/skills/openspec-continue-change/**`

Trong report ghi rõ:

- official generated `continue-change` vẫn có conditional-design limitation
  đã biết;
- Step 7.3B không patch generated file;
- limitation này sẽ được xử lý bằng activation/workflow policy riêng hoặc một
  maintainable project-owned mechanism nếu thật sự cần;
- không claim limitation đã resolved.

---

## 6. Repository safety

Xác nhận không đổi:

- `openspec/config.yaml`
- `.agents/skills/**`
- `openspec/specs/**`
- `openspec/changes/**`
- Product Knowledge
- product code

Temporary workspace phải được xóa sau test.

---

## 7. Output

Tạo:

`docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md`

Report tối thiểu:

1. exact schema diff
2. schema validation result
3. normal-path result
4. `skip_specs` gate result
5. required-design result
6. unresolved conditional-design / continue-change limitation
7. repository safety
8. activation recommendation

Final recommendation phải là một trong:

- `READY_FOR_ACTIVATION_POLICY_REVIEW`
- `ADDITIONAL_SCHEMA_CHANGE_REQUIRED`
- `BLOCKED`

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

## 8. Allowed repo modifications

Chỉ:

- `openspec/schemas/yuta-spec-driven/schema.yaml`
- `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md`

Không sửa file khác.

---

## 9. Stop condition

Dừng sau Step 7.3B.

Không:
- activate schema;
- sửa generated skills;
- sửa config;
- tạo real change/spec;
- bắt đầu Step 7.4.
