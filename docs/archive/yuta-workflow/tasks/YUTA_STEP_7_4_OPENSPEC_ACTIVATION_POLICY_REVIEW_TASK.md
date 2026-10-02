# YUTA — Step 7.4: OpenSpec Activation Policy Review

## Mục tiêu

Chốt **quy tắc sử dụng** `yuta-spec-driven` trước khi kích hoạt nó làm schema
mặc định của YuTa.

Đây là **policy-review only**.

Không đổi `openspec/config.yaml`.
Không activate schema.
Không sửa `yuta-spec-driven`.
Không sửa `.agents/skills`.
Không tạo change/spec thật.
Không sửa Product Knowledge hoặc product code.

Schema đã được approve về kỹ thuật:

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

Direct dependencies:

```text
proposal: []
analysis: [proposal]
specs:    [analysis]
design:   [analysis, specs]
tasks:    [specs, design]
```

Known limitation còn lại:

- `design` là conditional theo upstream instruction;
- `openspec-propose` / `openspec-explore` hiểu deliberate skip;
- generated `openspec-continue-change` 1.11.0 không có cùng skip rule;
- raw CLI không persist generic conditional-design skip.

Mục tiêu Step 7.4 là chọn policy đơn giản, maintainable và không patch generated
skills.

---

# 1. Đọc evidence

Đọc:

- `docs/OPENSPEC_BASELINE_AUDIT.md`
- `docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`
- `docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`
- `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md`
- `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md`
- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `openspec/config.yaml`
- `openspec/schemas/yuta-spec-driven/schema.yaml`
- relevant `.agents/skills/openspec-*`

Không sửa chúng.

---

# 2. Chốt vai trò từng workflow

Đánh giá và đề xuất policy rõ cho các workflow hiện có:

## `openspec-explore`

Vai trò mong muốn:
- suy nghĩ/thăm dò trước hoặc trong change;
- không tạo Product approval;
- có thể giúp nhận ra conflict/unknown;
- không thay thế `analysis.md`.

## `openspec-new-change`

Vai trò mong muốn:
- tạo change shell với schema mặc định hoặc explicit schema;
- không tự đồng nghĩa với approval.

## `openspec-propose`

Vai trò mong muốn:
- **preferred planning workflow** cho YuTa;
- tạo planning artifact chain theo schema;
- phải đi qua `analysis`;
- có thể deliberate-skip conditional `design` khi instruction thật sự không áp dụng;
- không apply code.

Đánh giá xem đây có nên là default recommendation cho phần lớn change mới hay
không.

## `openspec-continue-change`

Known limitation:
- không có contract-defined conditional-design skip.

Chọn policy maintainable, ưu tiên một trong:

### Policy C1 — bounded use
Cho phép `continue-change` khi artifact kế tiếp thực sự cần tạo.
Nếu first ready artifact là conditional `design` và design không áp dụng:
- không dùng `continue-change` để bypass;
- chuyển sang `openspec-propose` để hoàn tất phần planning còn lại theo adapter
  có conditional-skip rule;
- không tạo placeholder `design.md`.

### Policy C2 — avoid continue-change for YUTA planning
Dùng `propose` làm planning workflow chính; giữ `continue-change` chỉ cho
debug/manual inspection hoặc trường hợp chắc chắn không gặp conditional skip.

### Policy C3 — project-owned wrapper
Chỉ recommend nếu thật sự cần và có lợi ích rõ.
Không được patch generated skill trực tiếp.

So sánh complexity và operational clarity.

## `openspec-apply-change`

Policy phải nói rõ:
- chỉ chạy sau planning đủ để apply;
- task completion = implementation progress;
- không tự nâng lifecycle;
- blocker/authority conflict => dừng.

## `openspec-verify-change`

Policy phải nói rõ:
- verify specs/design/tasks/code;
- `analysis` chỉ là context, chưa có semantic verifier riêng;
- verify PASS không chứng minh production readiness/deployment/external provider.

## `openspec-sync-specs`

Policy phải nói rõ:
- không tự chạy chỉ vì code xong;
- sync main specs chỉ khi Product/Spec approval policy cho phép;
- trong giai đoạn chưa làm OpenSpec normative, không được suy diễn sync = normative approval.

## `openspec-archive-change`

Policy phải nói rõ:
- archive = đóng change/history;
- không tự suy ra Product Decision/Implementation/Production Ready;
- conditional design absence có thể gây raw CLI warning;
- deliberate skip phải được ghi/report rõ trước khi archive;
- không tạo placeholder design chỉ để làm warning biến mất.

---

# 3. Activation policy cho schema default

Đánh giá việc đổi:

```yaml
schema: spec-driven
```

thành:

```yaml
schema: yuta-spec-driven
```

Khi schema được activate, policy phải yêu cầu:

1. mọi change mới mặc định đi qua `analysis`;
2. change cũ giữ schema được pin trong `.openspec.yaml`, không migrate ngầm;
3. không shadow package `spec-driven`;
4. custom schema source phải là `project`;
5. OpenSpec upgrade phải trigger schema re-validation/re-audit trước khi
   regenerate hoặc thay đổi workflow;
6. generated skills không patch thủ công;
7. nếu custom schema không resolve/validate:
   - dừng;
   - không fallback âm thầm sang schema khác.

---

# 4. Normativity policy

Đây là phần bắt buộc.

Phân biệt:

```text
Schema activation
≠ OpenSpec specs become normative
```

Chốt policy:

- `openspec/changes/**` = proposed / in-progress change artifacts;
- `openspec/specs/**` hiện vẫn chưa tự động là normative Product authority;
- sync/archive/apply/verify không tự làm spec normative;
- OpenSpec main specs chỉ trở thành normative behavioral authority sau một
  **separate explicit YUTA approval transition**;
- accepted durable ADR/security/runtime boundaries vẫn không bị spec override.

Nếu cần một bước riêng sau activation để chuyển main specs sang normative,
recommend rõ nhưng không implement trong Step 7.4.

---

# 5. Lifecycle policy

Policy phải giữ 5 dimensions độc lập:

- Product Decision
- Implementation
- Environment
- Production Readiness
- External Dependency

Không workflow event nào được map tự động:

```text
proposal done
analysis done
specs done
design done
tasks done
apply done
verify pass
sync done
archive done
```

sang lifecycle promotion.

Nếu cần lifecycle update, đó phải là action riêng dựa trên evidence/approval.

---

# 6. Recommended day-to-day flow

Đề xuất workflow đơn giản nhất cho user/Codex.

Mục tiêu ví dụ:

```text
Ý tưởng
  ↓
$openspec-propose
  ↓
proposal
  ↓
analysis
  ↓
GATE
  ├─ blocked → hỏi/review
  └─ ready
       ↓
      specs
       ↓
      design (nếu cần)
       ↓
      tasks
       ↓
$openspec-apply-change
       ↓
$openspec-verify-change
       ↓
approval/sync decision
       ↓
$openspec-archive-change
```

Nhưng phải dựa trên local skill behavior và known limitation.

Đề xuất riêng khi user muốn làm từng artifact:
- khi nào `continue-change` an toàn;
- khi nào chuyển về `propose`.

Giữ quy trình dễ nhớ, không tạo nhiều command ceremony.

---

# 7. Upgrade policy

Do custom schema API experimental:

Đề xuất policy cho mỗi OpenSpec upgrade:

1. check new CLI version/changelog/source;
2. `openspec schema validate yuta-spec-driven`;
3. diff package `spec-driven` mới với base assumptions/custom fork;
4. inspect regenerated skill behavior;
5. smoke-test critical paths nếu semantics thay đổi;
6. chỉ sau đó mới update/rebase custom schema nếu cần.

Không tự regenerate schema fork.

---

# 8. Failure / fallback policy

Chốt behavior nếu:

- analysis = `BLOCKED_NEEDS_REVIEW`;
- analysis có `CONFLICT`;
- custom schema validation fail;
- design conditional nhưng `continue-change` đang đứng ở design;
- verify fail;
- archive có missing conditional design warning;
- OpenSpec upgrade làm workflow khác baseline.

Mỗi trường hợp phải có action ngắn, deterministic.

Không fallback âm thầm.
Không invent approval.
Không tạo ceremonial artifact chỉ để qua status.

---

# 9. Output duy nhất

Tạo:

`docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`

Nội dung tối thiểu:

1. Activation scope
2. Schema default policy
3. Workflow-by-workflow policy
4. Conditional-design / continue-change policy
5. Day-to-day recommended workflow
6. Normativity policy
7. Lifecycle policy
8. Upgrade/revalidation policy
9. Failure/fallback policy
10. Exact activation diff proposed for next step
11. Validation required after activation
12. Final recommendation

Final recommendation phải là một trong:

- `READY_TO_ACTIVATE`
- `READY_TO_ACTIVATE_WITH_OPERATIONAL_POLICY`
- `ACTIVATION_REQUIRES_MORE_WORK`
- `BLOCKED`

Nếu ready, exact next-step diff chỉ được đề xuất, chưa apply:

```yaml
# openspec/config.yaml
schema: yuta-spec-driven
```

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

# 10. Allowed modifications

Chỉ tạo:

`docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`

Không sửa file nào khác.

---

# 11. Validation

Xác nhận:

- schema unchanged;
- config unchanged;
- skills unchanged;
- real specs/changes unchanged;
- Product Knowledge/code unchanged;
- only activation policy review created;
- Markdown/docs checks pass.

Dừng sau Step 7.4.

Không activate schema.
Không bắt đầu real YuTa change.
