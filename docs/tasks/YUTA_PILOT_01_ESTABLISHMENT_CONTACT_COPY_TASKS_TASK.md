# YUTA — Pilot 01: Establishment Contact Copy — Tasks Only

## Mục tiêu

Tiếp tục OpenSpec change:

`establishment-copy-primary-contact-to-public`

Proposal, analysis, specs và design đã được review.

Trong bước này chỉ tạo:

`tasks.md`

Không apply code.
Không verify/sync/archive.
Không sửa specs/design/Product Knowledge.

---

## 1. Đọc trước

Đọc toàn bộ planning artifacts hiện tại:

- `proposal.md`
- `analysis.md`
- `specs/establishment-profile/spec.md`
- `design.md`

Đọc current files được design xác định để chia task đúng với repo hiện tại.

---

## 2. Task breakdown

Tasks phải đủ nhỏ để Codex apply tuần tự và verify được.

Tối thiểu phải cover:

### A. Pure copy helper
- thêm pure helper trong general-information model;
- non-empty phone -> publicPhone;
- empty/null phone -> preserve publicPhone;
- non-empty email -> publicEmail;
- empty/null email -> preserve publicEmail;
- preserve unrelated fields.

### B. Form integration
- `GeneralInformationForm` sở hữu callback one-time copy;
- dùng functional draft update;
- truyền callback xuống `PublicInformationSection`;
- không gọi persistence/server action.

### C. UI control
- thêm shared `Button`;
- `type="button"`;
- visible accessible French label;
- đặt tại public-contact area;
- chỉ render khi `canEdit`;
- không redesign page.

### D. Tests
- mở rộng model tests cho full copy matrix;
- test overwrite/preserve/no-op/unrelated fields;
- test no ongoing linkage;
- focused static-render test cho editable/read-only control;
- assert `type="button"` và accessible visible label;
- giữ existing permission tests làm regression.

### E. Verification
Task cuối phải chạy các targeted checks phù hợp:
- relevant Vitest tests;
- typecheck;
- formatting;
- docs/spec validation nếu repo convention yêu cầu;
- `git diff --check`.

Không thêm DB migration/API/repository/schema task vì design đã xác nhận không cần.

---

## 3. Task format

Dùng checkbox format chuẩn OpenSpec, ví dụ:

```md
- [ ] 1.1 ...
- [ ] 1.2 ...
```

Group task theo implementation order hợp lý.

Mỗi task phải:
- có outcome rõ;
- tránh trùng lặp;
- đủ cụ thể để apply;
- không chứa Product Decision mới.

Không mark task complete trong bước này.

---

## 4. Guardrails

Tasks không được:

- thay đổi behavior ngoài specs;
- tạo permission mới;
- tạo DB/API/server action mới;
- đổi save flow;
- tạo ongoing sync;
- đụng Restaurant Knowledge;
- thay lifecycle;
- sync/archive spec;
- update Product Knowledge.

Nếu design không đủ để chia task mà không đoán:
- dừng;
- report blocker;
- không invent task.

---

## 5. Output

Tạo:

`openspec/changes/establishment-copy-primary-contact-to-public/tasks.md`

Và:

`docs/PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_REPORT.md`

Report gồm:

1. task groups
2. implementation files expected
3. test coverage planned
4. migrations/API/schema changes: YES/NO
5. blocker nếu có
6. recommendation:
   - `READY_FOR_APPLY`
   - `RETURN_TO_DESIGN`
   - `BLOCKED_NEEDS_REVIEW`

Cuối report:

`Status: PROPOSED FOR REVIEW`

---

## 6. Không được làm

Không:
- modify product code
- mark tasks complete
- run apply
- verify implementation
- sync specs
- archive
- modify proposal/analysis/specs/design
- modify Product Knowledge/ADR/lifecycle
- modify OpenSpec schema/config/skills

Dừng sau tasks + report.
