# YUTA — Pilot 01: Establishment Contact Copy — Design Only

## Mục tiêu

Tiếp tục change:

`establishment-copy-primary-contact-to-public`

Proposal, analysis và delta spec đã qua review.

Trong bước này chỉ tạo:

`design.md`

Không tạo `tasks.md`.
Không apply code.
Không verify/sync/archive.

## 1. Đọc trước

Đọc:
- `proposal.md`
- `analysis.md`
- `specs/establishment-profile/spec.md`
- current Establishment general-information page pack
- current form/components/model/tests liên quan contact fields
- current Establishment Profile contract/repository khi cần xác nhận boundary

Design phải bám spec, không thay đổi behavior đã approved.

## 2. Design scope

Thiết kế cách implement nhỏ nhất cho behavior:

```text
primary phone/email
        ↓ explicit copy action
public phone/email draft
        ↓
explicit save hiện tại
```

Phải giữ:
- draft-only copy;
- non-empty source mới overwrite destination;
- empty/null source giữ destination hiện tại;
- không ongoing sync;
- không persistence trực tiếp;
- không permission mới;
- read-only state không có mutating action;
- existing save validation/authorization giữ nguyên.

## 3. Các quyết định design cần chốt

### UI placement
Chọn vị trí hợp lý trong contact/public-contact area dựa trên current page structure.
Không redesign cả page.

### Form-state update
Xác định nơi phù hợp nhất để thực hiện one-time draft copy.
Ưu tiên reuse current form state/update pattern.
Không đưa logic này xuống persistence/server nếu không cần.

### Empty/null handling
Implement đúng spec:
`source non-empty → copy`
`source empty/null → preserve destination`

### Dirty state
Xác định copy action tương tác thế nào với existing dirty-state calculation.
Không tạo mechanism mới nếu comparison logic hiện tại đã đủ.

### Read-only behavior
Dựa trên current editable/read-only structure.
Không tạo permission mới.

### Accessibility
Control phải có accessible name và keyboard/touch interaction phù hợp.

### Tests
Xác định test layers tối thiểu:
- form/model logic nếu phù hợp;
- component/UI behavior nếu repo convention hỗ trợ;
- permission/read-only coverage;
- regression cho explicit save/no auto-persist.

Không chọn test framework mới.

## 4. Không được làm

Không:
- sửa specs
- đổi Product behavior
- tạo API mới nếu không cần
- tạo DB migration
- đổi repository contract
- đổi permissions
- đụng Restaurant Knowledge
- tạo tasks
- code implementation

Nếu technical discovery cho thấy spec sai hoặc không khả thi:
- dừng;
- report blocker;
- quay lại analysis/specs;
- không sửa behavior trong design.

## 5. Output

Tạo:

`openspec/changes/establishment-copy-primary-contact-to-public/design.md`

Và report:

`docs/PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_REPORT.md`

Report gồm:
1. chosen implementation approach
2. UI placement decision
3. form-state strategy
4. permission/read-only handling
5. test strategy
6. migrations/API/schema changes required? YES/NO
7. any spec conflict/blocker
8. recommendation:
   - `READY_FOR_TASKS`
   - `RETURN_TO_SPECS`
   - `BLOCKED_NEEDS_REVIEW`

Cuối report:

`Status: PROPOSED FOR REVIEW`

Dừng sau design.
