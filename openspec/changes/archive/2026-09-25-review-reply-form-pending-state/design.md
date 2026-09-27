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
