# YUTA — Pilot 01: Establishment Contact Copy — Specs Only

## Mục tiêu

Tiếp tục OpenSpec Pilot #1 sau khi Proposal + Analysis đã được review và clarification
về empty/null source đã được chốt.

Change:

`establishment-copy-primary-contact-to-public`

Trong bước này chỉ tạo **delta specs**.

Không tạo `design.md`.
Không tạo `tasks.md`.
Không apply code.
Không verify/sync/archive.

---

## 1. Preconditions

Đọc:

- `openspec/changes/establishment-copy-primary-contact-to-public/proposal.md`
- `openspec/changes/establishment-copy-primary-contact-to-public/analysis.md`
- `docs/features/establishment/README.md`
- `docs/features/establishment/general-information/README.md`
- `docs/decisions/ADR-006-cloud-establishment-profile-context.md`
- `docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md`
- current Establishment general-information page pack
- current code/tests/contracts relevant to contact fields

Xác nhận analysis conclusion vẫn là:

`READY_FOR_SPECS`

Nếu không:
- dừng;
- không tạo specs.

---

## 2. Capability path

Vì hiện chưa có main spec tương ứng, tạo new capability delta under:

`establishment-profile`

Không tạo capability mới khác tên chỉ để mô tả riêng button.

Expected path:

`openspec/changes/establishment-copy-primary-contact-to-public/specs/establishment-profile/spec.md`

---

## 3. Required behavioral scope

Specs phải mô tả chính xác behavior đã được review:

### Copy action

Khi authorized editor trigger explicit copy action:

- nếu current primary phone non-empty:
  - `publicPhone` draft SHALL được thay bằng current primary `phone`;
- nếu current primary phone empty/null:
  - existing `publicPhone` draft SHALL giữ nguyên;

- nếu current primary email non-empty:
  - `publicEmail` draft SHALL được thay bằng current primary `email`;
- nếu current primary email empty/null:
  - existing `publicEmail` draft SHALL giữ nguyên.

### Draft-only

Copy action:

- SHALL chỉ update current client-side form draft;
- SHALL NOT persist automatically;
- existing explicit save flow vẫn required;
- existing validation vẫn áp dụng khi save.

### No ongoing sync

Sau copy:

- thay đổi primary phone/email sau đó SHALL NOT tự update public counterparts;
- public fields tiếp tục editable độc lập.

### Permission / read-only

Behavior phải tôn trọng current profile permission model:

- action chỉ available khi user có khả năng edit/manage profile;
- read-only user SHALL NOT có action có thể mutate draft.

Không invent permission mới.

### Visibility / data boundaries

Copy action SHALL NOT:

- đổi visibility flags;
- tạo new field;
- đổi canonical owner;
- bypass tenant/server authorization;
- affect Restaurant Knowledge;
- affect Booking/POS/Display/company/legal data.

---

## 4. Required scenarios

Tối thiểu có scenarios cho:

1. Copy both non-empty phone + email
2. Phone empty, email non-empty
3. Phone non-empty, email empty
4. Both source fields empty
5. Copy overwrites existing non-empty public value only for non-empty source
6. Action marks/changes form draft but does not persist without save
7. Later primary change does not auto-sync public field
8. Read-only user cannot trigger mutating copy behavior

Nếu một scenario không thể viết chính xác từ approved behavior/current authority:
- ghi blocker;
- dừng trước khi inventing.

---

## 5. OpenSpec format

Dùng exact OpenSpec delta-spec conventions.

Vì đây là capability mới trong main-spec tree:

```md
## ADDED Requirements
```

Mỗi requirement:

```md
### Requirement: ...
The system SHALL ...

#### Scenario: ...
- **WHEN** ...
- **THEN** ...
```

Giữ requirement observable/testable.

Không đưa vào spec:
- React implementation
- component names
- state-hook details
- API choices
- test framework
- CSS/layout/icon wording
- DB schema details đã không đổi

---

## 6. Validation

Chạy:

```bash
openspec validate establishment-copy-primary-contact-to-public --strict
```

hoặc local 1.11.0 equivalent nếu exact syntax khác.

Ngoài ra chạy:
- targeted formatting
- docs/spec checks nếu relevant

Nếu validation fail:
- sửa spec;
- không đi tiếp design.

---

## 7. Output report

Tạo:

`docs/PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_REPORT.md`

Report gồm:

1. capability path
2. requirements created
3. scenarios covered
4. validation result
5. remaining ambiguity/blocker, nếu có
6. recommendation:
   - `READY_FOR_DESIGN`
   - `BLOCKED_NEEDS_REVIEW`

Cuối file:

`Status: PROPOSED FOR REVIEW`

---

## 8. Không được làm

Không:
- tạo `design.md`
- tạo `tasks.md`
- apply code
- verify
- sync
- archive
- modify Product Knowledge
- modify ADR/lifecycle
- modify schema/config/skills
- modify product code

Dừng sau specs + report.
