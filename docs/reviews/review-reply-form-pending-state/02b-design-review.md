Change: review-reply-form-pending-state
Gate: Design Review — explicit Bridge Test 003 stop after Gate 2
Review status: APPROVED
Approval source: explicit current-user instruction `APPROVE DESIGN` for this exact reviewed Design
Approval recorded by: Codex workflow
Approved: 2026-09-24T23:53:54.0765650+02:00
Approved Design SHA-256: 638dd3cac9257d1a5ef118d279d91930123e02af03138037e25d747613f50daa
Approval scope: bounded Tasks/TIC planning and planning review only; implementation remains unauthorized
Created: 2026-09-24T23:40:58.5891148+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: NO — SENSITIVE_DESIGN_GATE NOT_TRIGGERED for the approved presentation-only scope

# Design Review — Review Reply Form Pending State

## Approved gates and artifact integrity

The current user explicitly approved Gate 1 after reviewing its 11 decisions and Gate 2 after reviewing all 4 Requirements and 9 Scenarios in Vietnamese. The exact approved Spec and pre-approval Gate 2 packet hashes matched before Gate 2 was recorded. This Design is submitted for explicit review only; approval of earlier gates does not authorize Tasks or implementation.

| Repository-relative path                                                                               | SHA-256 / state                                                                          |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| openspec/changes/review-reply-form-pending-state/proposal.md                                           | dfa7d8b2c99f0ec96b1926097cbd2a026ea007a2562428250444078ad7793ce9 / MATCH                 |
| openspec/changes/review-reply-form-pending-state/analysis.md                                           | e038230d05014147275d5468123ca830697f053563715c4dd5e5d250a1a9b7e8 / MATCH                 |
| docs/reviews/review-reply-form-pending-state/01-analysis-review.md                                     | e4f2d04bbebd549021871f90263822b9fe38689bdc50cd90f0c739b8e087a625 / APPROVED              |
| openspec/changes/review-reply-form-pending-state/specs/reputation/reply-draft-pending-feedback/spec.md | 71115d2e59a52edc2e8b46bc3657683d1f329b8c400087d9d15e10fbb1aff834 / MATCH                 |
| docs/reviews/review-reply-form-pending-state/02-specs-review.md                                        | d818b90b1e1cc3f92173fc23429aa29d9e5ed9745e9c060fe422c7788bb4b53a / APPROVED              |
| openspec/changes/review-reply-form-pending-state/design.md                                             | 638dd3cac9257d1a5ef118d279d91930123e02af03138037e25d747613f50daa / AWAITING_HUMAN_REVIEW |

Hash method: `Get-FileHash -Algorithm SHA256 -LiteralPath <exact path>`, lowercase hexadecimal over exact file bytes. Pre-approval Gate 2 packet SHA-256 was `94413d71aad71dcd3a0e8b4c567f12e159c3eaec5b5b842644223aa90cda30d7`; its new hash reflects only the current-user approval record and status. The earlier Proposal, Analysis, Gate 1 packet and Spec remain byte-for-byte unchanged.

## Design decision summary

| Decision             | Bounded proposal                                                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ---------------------------------------------------------------- |
| Production owner     | Only `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx`, at local `ReplySubmit`.                                         |
| Exact pending label  | `Enregistrement du brouillon…`; idle remains `Enregistrer`.                                                                                                                  |
| Pending authority    | The existing `useFormStatus().pending`, also driving current Button loading.                                                                                                 |
| Disabled and busy    | Preserve `loading={pending}`, `disabled={disabled                                                                                                                            |     | pending}`, native Button disabled, `aria-busy`and`data-loading`. |
| Form/textarea        | No form-level busy or new textarea disabling; preserve existing state, validation and result message.                                                                        |
| Visual/accessibility | Current Button, icon, layout and semantic tokens; readable pending text, no new spinner/live region.                                                                         |
| Focused test         | One later Backoffice Vitest component test, proposed `apps/backoffice/test/review-reply-form.test.tsx`, following existing `useActionState`/`useFormStatus` mocking pattern. |
| Browser QA           | Mandatory later on authenticated Avis route with safe selected GOOGLE review; observe idle, pending, disabled/busy, textarea, result, layout and basic accessibility.        |
| Post-Apply controls  | Later `DEV_USABLE`, `MANUAL_TEST_READY`, `HUMAN_PRODUCT_VALIDATION` handoffs defined; no assessment or verdict now.                                                          |

## Scope, risks and classification

No Server Action, API, database/schema, shared `@yuta/ui`, authentication, authorization, roles, tenant/organization/establishment, assigned-feedback, validation, business logic, navigation, revalidation or Google publication change. `async-interaction-feedback-foundation` remains separate; its historical `QA: BLOCKED_BY_ENVIRONMENT` is not inherited or changed.

`SENSITIVE_DESIGN_GATE: NOT_TRIGGERED`: Design selects route-local copy/test/QA and does not change security/privacy, provider, durable contract, data/runtime owner, database, legal/payment/fiscal, POS transaction or irreversible boundaries. Any discovered need for those boundaries requires renewed review. The explicit Design review stop is part of Bridge Test 003; it does not assert that the conditional sensitive gate was triggered.

The pending label is longer than the idle label, so later mobile Browser QA must check wrapping/overflow and form/footer stability. Safe dev GOOGLE review data, authorized test identity and observable pending duration are unverified; if absent, later QA must report a real blocker. Static component tests cannot replace real interaction or accessibility observations. No unresolved Product or technical decision remains within the approved Spec; the current human decision is whether to accept this exact Design and wording.

## Checks and current workflow state

- `pnpm exec openspec validate review-reply-form-pending-state --type change --strict --json --no-interactive`: PASS, `valid=true`, 1/1 item passed, zero issues.
- `pnpm docs:check`: PASS, 36 current documents.
- `pnpm exec prettier --check` on approved Gate 2 packet and new Design: PASS before this packet was created.
- No production implementation, tests, typecheck, build, VERIFY, Browser QA, or post-Apply controls were run.

Gate 1: APPROVED. Gate 2: APPROVED. Design: created, `AWAITING_HUMAN_REVIEW`. Tasks/TIC: absent and unauthorized. Implementation: unauthorized.

## Exact Design review questions

1. Approve the exact pending label `Enregistrement du brouillon…` while keeping idle `Enregistrer`?
2. Confirm the only later production edit is the local `ReplySubmit` in `review-reply-form.tsx`?
3. Confirm no shared `@yuta/ui` change or loading foundation is needed?
4. Confirm `useFormStatus().pending` remains the single pending source?
5. Confirm current Button disabled, `aria-busy` and `data-loading` semantics remain authoritative?
6. Confirm the form and textarea do not gain a whole-form busy or extra disabled state?
7. Accept the one-file focused Backoffice component test architecture for later Apply?
8. Accept mandatory later Browser QA on the real authenticated Avis route with a safe selected GOOGLE review?
9. Accept the later `DEV_USABLE` handoff target, without a verdict now?
10. Accept the later `MANUAL_TEST_READY` handoff target, without a verdict now?
11. Accept the later `HUMAN_PRODUCT_VALIDATION` target, without a verdict now?
12. Confirm `SENSITIVE_DESIGN_GATE: NOT_TRIGGERED` for this exact Design and its non-scope boundaries?

The current user may approve this exact Design, request specific changes, or defer. Control Tower review does not self-approve Design. Stop before Tasks/TIC, production code, tests, VERIFY or QA.

## Exact Design snapshot

```markdown
## Context

Gate 2 đã duyệt đúng [delta Spec](specs/reputation/reply-draft-pending-feedback/spec.md), SHA-256 `71115d2e59a52edc2e8b46bc3657683d1f329b8c400087d9d15e10fbb1aff834`. Xem [Proposal](proposal.md) cho lý do sản phẩm. Đây là `EXISTING_CAPABILITY_RENEWAL`, `PAGE_LOCAL`, `UI_AFFECTING: YES` tại `/visibilite-reputation/avis`, chỉ khi `ReviewDetail` dựng `ReviewReplyForm` cho review `GOOGLE` được chọn.

Trong `review-reply-form.tsx`, `ReviewReplyForm` dùng `useActionState(saveReplyDraftAction)` cho kết quả lưu; `ReplySubmit` cục bộ dùng `useFormStatus().pending` cho `loading={pending}` và `disabled={disabled || pending}`. `@yuta/ui` Button đã sở hữu native disabled, `data-loading` và `aria-busy` khi loading; nó giữ nguyên children và không tự thêm spinner. Nút hiện giữ nhãn `Enregistrer` trong cả hai trạng thái. Textarea chỉ bị disabled theo `canCreateReply`, không theo pending. Các thông điệp kết quả đi qua `ReviewActionMessage` hiện hữu.

Design áp dụng vì Spec để mở câu chữ pending chính xác và cần chốt cách kiểm thử/handoff trước Apply. Nó không tạo một architecture hoặc shared UI contract mới. `SENSITIVE_DESIGN_GATE: NOT_TRIGGERED` được đánh giá lại bên dưới; Design review này là điểm dừng rõ ràng của Bridge Test 003, không tự biến nó thành sensitive gate.

## Goals / Non-Goals

**Goals:**

- Chốt một nhãn pending tiếng Pháp, xuất hiện ngay trên submit hiện có và dùng chính trạng thái pending hiện có.
- Giữ nguyên disabled/busy của Button, khả năng sử dụng của textarea, và các thông điệp thành công/lỗi hiện hữu.
- Xác định test component tập trung, Browser QA thật và ba handoff sau Apply mà không chạy chúng tại Design.

**Non-Goals:**

- Không thay `saveReplyDraftAction`, validation, quyền, tenant scope, repository, audit, revalidation, Google publication hoặc kết quả lưu.
- Không thay Server Action, API, database/schema, shared `@yuta/ui`, route khác, form khác, dependency, token hay loading foundation chung.
- Không thêm spinner, timer, live region, trạng thái pending thứ hai hoặc busy cho toàn form.

## Decisions

### 1. Owner và giới hạn file

Production change sau khi được duyệt chỉ nằm trong `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx`, tại `ReplySubmit` cục bộ. Một test tập trung dự kiến tại `apps/backoffice/test/review-reply-form.test.tsx`; đây là file test sẽ được tạo ở giai đoạn được cấp quyền, không phải code hiện có. Không sửa shared Button hoặc tách thành component dùng chung. Lý do: `ReviewReplyForm` sở hữu copy/action cụ thể, còn Button đã cung cấp contract loading cần thiết. Phương án shared component hoặc đổi `@yuta/ui` mở rộng ownership không cần thiết và bị loại.

### 2. Một nguồn pending, hai nhãn

Giữ `useFormStatus().pending` trong `ReplySubmit` làm nguồn sự thật duy nhất. Cùng giá trị đó tiếp tục cấp `loading={pending}`, `disabled={disabled || pending}` và chọn children text: idle `Enregistrer`; pending **`Enregistrement du brouillon…`**. Đây là nhãn chính xác đề xuất cho implementation sau Design review. Nó mô tả thao tác đang diễn ra, không tuyên bố lưu thành công. `FilePenLine` và variant hiện có giữ nguyên. Phương án state/timer riêng, hoặc dựa vào kết quả `useActionState` để suy ra pending, có thể lệch thời điểm submit và bị loại. Phương án spinner mới không cần thiết vì nhãn nhìn thấy đáp ứng Spec.

### 3. Disabled, busy và phạm vi form

Giữ `loading={pending}` và `disabled={disabled || pending}`; native Button tiếp tục phát disabled, `data-loading` và `aria-busy="true"` khi pending. Khi không pending, điều kiện disabled do permission hoặc nội dung rỗng vẫn do prop `disabled` hiện có quyết định. Không đặt `aria-busy` riêng trên form, textarea hoặc một wrapper; không thêm live region. Textarea tiếp tục disabled chỉ theo `!canCreateReply`; form, hidden feedback ID, trạng thái reply và `ReviewActionMessage` không đổi. Phương án khóa toàn form hoặc sao chép ARIA state có thể gây tín hiệu sai và bị loại.

### 4. Visual và accessibility

Dùng nguyên Button thứ cấp, icon, layout hai cột và semantic tokens hiện có. Không thêm CSS/token hoặc đổi hierarchy. Nhãn pending dài hơn nhãn idle, vì vậy Browser QA phải quan sát khả năng đọc, xuống dòng/overflow và sự ổn định của form/footer ở viewport desktop và mobile theo quy tắc Backoffice. Nhãn hiển thị là thông tin truy cập trực tiếp; Button-owned `aria-busy` giữ thông tin trạng thái. Không đề xuất announcement tự động vì chưa có bằng chứng pattern hiện hành đòi hỏi; nếu QA cho thấy lỗi truy cập thực, quay lại review thay vì tự mở rộng Design.

### 5. Test component sau khi có quyền Apply

Một test Vitest/React tập trung render `ReviewReplyForm` với mock tối thiểu cho action và `useActionState`, cùng `useFormStatus().pending` được kiểm soát, theo pattern Backoffice hiện có. Không cần export `ReplySubmit` chỉ để test nếu full-form render chứng minh được nút. Assertion độc lập cần kiểm tra: `Enregistrer` khi idle; nhãn pending chính xác; submit disabled và `aria-busy="true"`/`data-loading` khi pending; permission hoặc nội dung rỗng vẫn disabled khi idle; textarea không bị khóa thêm khi vốn có quyền; không có form-level busy; kết quả success/error vẫn qua `ReviewActionMessage` khi state được kiểm soát. Test không giả làm Browser QA, không tái kiểm chứng Server Action hay persistence. Nếu full-form isolation cần mock vượt phạm vi hợp lý, chỉ điều chỉnh ranh giới test route-local trong cùng production file và đưa quyết định đó vào review trước khi Apply.

### 6. Browser QA và handoff sau Apply

`BROWSER_QA_REQUIRED: YES`. QA sau implementation phải dùng Backoffice xác thực thật tại `/visibilite-reputation/avis`, người dùng có `reputation.reply.create` và quyền nhìn thấy một review `GOOGLE` dev/test an toàn với form bản nháp. Cần quan sát nhãn idle, kích hoạt luồng lưu hiện có, nhãn pending, nút disabled, `aria-busy`/`data-loading` nơi có thể kiểm tra, textarea/form vẫn dùng được theo quyền hiện hữu, kết quả sau thao tác, bố cục/footer, keyboard/focus và khả năng đọc/truy cập ở kích thước phù hợp. Không dùng fixture hoặc phản hồi provider giả làm bằng chứng route thật. Thời gian pending và dữ liệu dev an toàn chưa được xác minh; nếu không quan sát được, ghi blocker thực thay vì làm chậm action nhân tạo hoặc tuyên bố PASS.

`DEV_USABLE` sau Apply cần ghi command/runtime Backoffice hiện hành (ứng viên `pnpm --filter @yuta/backoffice dev`, port `3001` theo manifest), route, điều kiện review `GOOGLE` dev/test, test identity/permission/visibility và khả năng lưu nháp an toàn. Đây là yêu cầu bằng chứng, chưa xác nhận môi trường chạy được.

`MANUAL_TEST_READY` sau Apply cần handoff command/route, test user có quyền, review `GOOGLE` được chọn, trạng thái idle, cách kích hoạt lưu, nhãn pending mong đợi, cách reset/retry trên dữ liệu dev/test có thể dùng lại, và giới hạn môi trường đã quan sát. Không yêu cầu thao tác trên review sản xuất.

`HUMAN_PRODUCT_VALIDATION` sau Apply cần người dùng xác nhận nhãn pending dễ hiểu, câu chữ phù hợp, disabled có cảm giác đúng và không có UX regression gây nhầm. Không ghi verdict tại Design.

### 7. Giữ ranh giới nghiệp vụ và change liên quan

Không đổi `saveReplyDraftAction`, schemas, permission `reputation.reply.create`, session/tenant derivation, STAFF assigned-feedback restrictions, persistence, audit, revalidation, thông báo kết quả hoặc Google publication. `async-interaction-feedback-foundation` giữ phạm vi riêng; QA `BLOCKED_BY_ENVIRONMENT` lịch sử của nó không được kế thừa hay giải quyết bởi change này. Phương án nhập form vào pilot foundation đã có bị loại vì sai allowlist được duyệt.

## Risks / Trade-offs

- Nhãn pending dài có thể tràn hoặc khiến bố cục nhảy ở màn hình hẹp → Browser QA tại viewport nhỏ, rồi chỉ sửa presentation route-local trong phạm vi được duyệt nếu cần.
- Pending của action có thể quá ngắn để chụp bằng browser thật → ghi bằng chứng quan sát được hoặc blocker thật; component test vẫn chứng minh state tĩnh nhưng không thay thế QA.
- Không có review Google dev an toàn hoặc identity đủ quyền → đánh dấu môi trường/QA bị chặn, không dùng dữ liệu sản xuất hay provider giả.
- Server render test không chứng minh interaction timing, focus hoặc accessibility thực → Browser QA và human validation sau Apply giữ vai trò riêng.

## Migration Plan

Không có migration dữ liệu, API hoặc provider. Khi Apply được cấp quyền riêng, thay nhãn pending trong component route-local, thêm test tập trung, rồi chạy checks/VERIFY/Browser QA theo gate tương ứng. Rollback code hoàn nguyên duy nhất presentation/test change đó; draft đã lưu theo luồng hiện hữu không bị sửa hoặc đảo ngược bởi rollback này. Design hiện tại không deploy hay rollback gì.

## Open Questions

Không còn lựa chọn kỹ thuật hoặc Product decision cần giải quyết để lập Tasks trong phạm vi Spec hiện tại. Tính sẵn có của môi trường QA, review Google dev an toàn và thời gian pending quan sát được là điều kiện thực thi về sau; chưa được coi là PASS.

## Sensitive Design Gate reassessment

`SENSITIVE_DESIGN_GATE: NOT_TRIGGERED`. Design chỉ chọn copy và test/QA cho nút route-local. Nó không đổi authorization, privacy/security boundary, external provider behavior, durable shared contract, database/schema, runtime/data owner, legal/payment/fiscal behavior, POS transaction hoặc thao tác irreversible. Nếu implementation thật đòi hỏi một trong các ranh giới này, dừng và quay lại review, không tự mở scope.
```
