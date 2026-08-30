# YUTA — Pilot 01: Establishment Contact Copy — Proposal + Analysis Only

## Mục tiêu

Bắt đầu OpenSpec change thật đầu tiên của YUTA để kiểm nghiệm workflow đã setup.

Pilot được chọn:

**Informations générales → Establishment Profile → Copy primary contact to public contact**

Ý tưởng Product ở mức cao:

> Cho phép người có quyền chỉnh sửa Establishment Profile dùng một action rõ ràng
> để copy phone/email chính hiện tại sang public phone/email tương ứng, nhằm tránh
> nhập lặp lại khi hai bộ contact giống nhau.

Đây là convenience behavior trong capability **Establishment Profile hiện có**.

Không tạo field mới.
Không đổi data owner.
Không đổi permission model.
Không tạo sync tự động lâu dài giữa primary và public contact.
Không đụng Restaurant Knowledge.

Trong bước này chỉ tạo:

- `proposal.md`
- `analysis.md`

Dừng trước `specs`.

---

## 1. Preconditions

Đọc tối thiểu:

- `docs/features/establishment/README.md`
- `docs/features/establishment/general-information/README.md`
- `docs/decisions/ADR-006-cloud-establishment-profile-context.md`
- `docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md`
- `docs/MODULE_REGISTRY.md`
- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- current page pack cho `/etablissement/informations-generales`
- current code/tests/contracts/schema liên quan Establishment Profile contacts

Xác nhận:

- default schema = `yuta-spec-driven`
- `openspec/specs/**` hiện có thể normative theo approved policy nhưng chưa được
  tự động sync/approve
- change này thuộc **Establishment Profile**, không phải Restaurant Knowledge

---

## 2. Tạo real OpenSpec change

Tạo change:

```text
establishment-copy-primary-contact-to-public
```

Dùng project default schema, không override sang schema khác.

Không dùng `skip_specs: true` vì đây là behavior change.

---

## 3. Proposal

Tạo `proposal.md` theo schema instruction.

Proposal phải giữ scope hẹp:

### Why
Giảm việc nhập lặp lại khi public phone/email giống primary phone/email.

### What Changes
Thêm một explicit UI action để copy current primary contact values sang các
public contact fields tương ứng trong form.

### Capability
Chỉ capability hiện có:

`Establishment Profile`

Không tạo capability Restaurant Knowledge mới.

### Impact
Chỉ ghi high-level impact sau khi đọc code hiện tại:
- page/form contact section;
- validation/form state;
- tests nếu relevant.

### Non-goals
Proposal phải ghi rõ:

- không tạo DB field mới;
- không thay canonical owner;
- không thay permissions;
- không tự sync public contact khi primary contact thay đổi sau đó;
- không thay visibility rules;
- không đụng company/legal data;
- không đụng Restaurant Knowledge;
- không thêm provider/external dependency.

Không viết design kỹ thuật.

---

## 4. Analysis

Tạo `analysis.md` theo custom YUTA analysis template.

Bắt buộc kiểm tra:

### Product / authority
- feature có nằm hoàn toàn trong approved Establishment Profile boundary không;
- primary/public contact ownership hiện tại;
- current permissions;
- relevant ADR boundaries.

### Current implementation
Xác minh:
- exact current primary phone/email fields;
- exact current public phone/email fields;
- current edit/save behavior;
- current validation;
- current form state;
- existing copy/same-as-primary behavior có tồn tại chưa;
- tests hiện có.

Không suy từ screenshot nếu code/contracts có authority cao hơn cho Implemented State.

### Runtime / data / security
Xác nhận:
- không cần ownership mới;
- không cần persistence shape mới nếu evidence support;
- existing server-derived tenant/permission boundary giữ nguyên;
- action không bypass permission/save validation.

### UI applicability
Route tới current page pack và UI governance.

### Conflicts / unknowns
Nếu phát hiện:
- equivalent behavior đã tồn tại;
- field semantics khác proposal;
- public contacts không editable như proposal giả định;
- permission/boundary conflict;
- requirement-level decision chưa đủ;

thì ghi `CONFLICT` hoặc `NEEDS REVIEW`.

---

## 5. Analysis conclusion

Chỉ dùng một trong:

### `READY_FOR_SPECS`
Nếu behavior proposal hợp lệ và có thể viết precise specs không cần đoán.

### `BLOCKED_NEEDS_REVIEW`
Nếu có Product/authority/field-semantics blocker.

### `NO_SPEC_BEHAVIOR_CHANGE`
Nếu current implementation đã có behavior tương đương đầy đủ.

Nếu kết luận không phải `READY_FOR_SPECS`:
- dừng;
- không tạo specs/design/tasks.

Nếu `READY_FOR_SPECS`:
- vẫn dừng ở review gate;
- chưa tạo specs.

---

## 6. Không được làm

Không:

- tạo `specs/**/*.md`
- tạo `design.md`
- tạo `tasks.md`
- apply code
- verify/sync/archive
- sửa Product Knowledge
- sửa ADR
- sửa Module Registry/lifecycle
- sửa schema/config/skills
- sửa product code

---

## 7. Output

Ngoài change chứa `proposal.md` + `analysis.md`, tạo review report:

`docs/PILOT_01_ESTABLISHMENT_CONTACT_COPY_ANALYSIS_REPORT.md`

Report gồm:

1. change name
2. proposal summary
3. authorities consulted
4. current implementation findings
5. conflicts / NEEDS REVIEW
6. analysis conclusion
7. recommendation:
   - proceed to specs
   - choose another pilot
   - resolve blocker first

Cuối file:

`Status: PROPOSED FOR REVIEW`

Dừng ở đây.
