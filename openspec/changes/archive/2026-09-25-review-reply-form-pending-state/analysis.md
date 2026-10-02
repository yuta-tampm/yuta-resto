# Change Analysis

## Scope and Change Type

- `PAGE_LOCAL` cho `ReviewReplyForm` tại `/visibilite-reputation/avis`, khi một review `GOOGLE` được chọn. Đây là cải thiện hành vi trình bày trạng thái chờ của một thao tác đã tồn tại, không phải capability lưu hoặc xuất bản mới.
- `UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES`. Delivery mode là `EXISTING_CAPABILITY_RENEWAL` vì route, bản nháp lưu bền vững, action, validation và quyền đã hiện hữu. Phạm vi nhỏ này không cần tạo page pack mới chỉ để ghi một nhãn pending.
- Ứng viên và scope đã được current user trả lời `APPROVE CANDIDATE` trong Bridge Test 003; quyết định đó cho phép Proposal/Analysis, chưa duyệt Gate 1, Specs hay implementation.

## Sources Consulted

- Quy trình/authority: [`AGENTS.md`](../../../AGENTS.md), [`docs/README.md`](../../../docs/README.md), [`docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md), [`docs/AUTHORITY_MODEL.md`](../../../docs/AUTHORITY_MODEL.md), [`docs/YUTA_WORKFLOW_V3.md`](../../../docs/YUTA_WORKFLOW_V3.md), [`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [`docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [`docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), và trạng thái/instructions CLI của change `yuta-spec-driven` này.
- Product/lifecycle: [`docs/PRODUCT_KNOWLEDGE.md`](../../../docs/PRODUCT_KNOWLEDGE.md), [`docs/features/reputation/README.md`](../../../docs/features/reputation/README.md), [`docs/features/reputation/STATUS.md`](../../../docs/features/reputation/STATUS.md), [`docs/MODULE_REGISTRY.md`](../../../docs/MODULE_REGISTRY.md), [`docs/LIFECYCLE_STATUS_MODEL.md`](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- UI: [`apps/backoffice/AGENTS.md`](../../../apps/backoffice/AGENTS.md), [`docs/ui/README.md`](../../../docs/ui/README.md), [`docs/ui/DELIVERY_WORKFLOW_MODES.md`](../../../docs/ui/DELIVERY_WORKFLOW_MODES.md), [`docs/ui/DESIGN_TO_CODE_WORKFLOW.md`](../../../docs/ui/DESIGN_TO_CODE_WORKFLOW.md), [`docs/ui/YUTA_FRONTEND_RULES.md`](../../../docs/ui/YUTA_FRONTEND_RULES.md), [`docs/ui/BACKOFFICE_FRONTEND_RULES.md`](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [`docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- Implemented State: [`review-reply-form.tsx`](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx>), [`review-detail.tsx`](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-detail.tsx>), [`reviews-loader.tsx`](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-loader.tsx>), [`actions.ts`](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/actions.ts>), [`button.tsx`](../../../packages/ui/src/button.tsx), [`packages/contracts/src/reputation/index.ts`](../../../packages/contracts/src/reputation/index.ts), [`reputation-repository.ts`](../../../packages/db-cloud/src/reputation-repository.ts), và test pattern [`google-location-submit-button.test.tsx`](../../../apps/backoffice/test/google-location-submit-button.test.tsx).
- Related but separate: [`async-interaction-feedback-foundation/tasks.md`](../async-interaction-feedback-foundation/tasks.md) và [`QA_REPORT.md`](../../../docs/reviews/async-interaction-feedback-foundation/qa/QA_REPORT.md). Adoption event của ba kiểm soát hậu Apply được ghi ở [`development-usability-and-iteration-control/03-final-review.md`](../../../docs/reviews/development-usability-and-iteration-control/03-final-review.md).

## Authority and Product Decision

- Reputation Product Knowledge và Module Registry sở hữu mục đích inbox/back-office; action lưu bản nháp phản hồi Google hiện là capability đã được phê duyệt và triển khai. Current-user approval chỉ chọn ứng viên UI hẹp này; yêu cầu quan sát chính xác vẫn cần Gate 1 và Specs sau đó.
- `@yuta/ui` tiếp tục sở hữu Button presentation contract. Form, action và thông điệp lỗi/thành công thuộc route Reputation. Shared foundation đang hoạt động có allowlist pilot riêng, không bao gồm `ReviewReplyForm`; không thể nhập form này vào scope của change đó bằng suy luận.
- Không có authority nào đã đọc cho phép đổi action outcome, phân quyền, validation, tenant scope, publication hay provider. Các giới hạn này là non-goal bắt buộc.

## Current Implemented State

- Route Avis tải inbox theo session/tenant đáng tin cậy; `ReviewDetail` chỉ dựng `ReviewReplyForm` khi `review.source === 'GOOGLE'`. Route Satisfaction ép source `DIRECT`, vì vậy không lộ form này.
- Form dùng `useActionState(saveReplyDraftAction, initialReputationActionState)`; `ReplySubmit` cục bộ lấy `pending` từ `useFormStatus`. Nút hiện có nhãn nhìn thấy “Enregistrer” ở cả idle lẫn pending; `loading={pending}` và `disabled={disabled || pending}`. Shared `Button` chuyển `loading` thành native disabled, `data-loading` và `aria-busy=true`, nhưng không đổi nhãn hay tự chèn spinner. Textarea chỉ disabled theo `canCreateReply`, không theo pending.
- `saveReplyDraftAction` lấy tenant/session phía server, yêu cầu `reputation.reply.create`, validate `feedbackId` bằng `identifierSchema` và nội dung bằng `saveReplySchema`, rồi gọi `saveFeedbackReplyDraft`. Repository lọc theo organization, establishment và visibility/assigned-feedback condition, chỉ nhận source `GOOGLE`, ghi draft/audit trong transaction. Những điều này không thuộc thay đổi.
- Existing focused Backoffice component tests dùng Vitest và `renderToStaticMarkup` với `useFormStatus` được kiểm soát để kiểm tra nút ở idle/pending. Chưa có assertion tập trung cho chính `ReplySubmit` này. Live route, actual pending duration, screen-reader output và environment QA của ứng viên này đều chưa được kiểm chứng.

## Affected Boundaries

| Boundary | Assessment |
| --- | --- |
| Presentation | Chỉ nhãn/chỉ báo chờ cục bộ của submit trong form Avis; giữ `Button` dùng chung và các trạng thái khác. |
| Runtime/data owner | Backoffice cloud UI; persistence tiếp tục thuộc `@yuta/db-cloud`. Không đổi topology hoặc data shape. |
| Authorization/tenant | Session, permission, role, organization, establishment và assigned-feedback visibility vẫn được áp dụng phía server. Không đổi. |
| Validation/action/business | `saveReplyDraftAction`, schemas, draft transaction/audit, error/success, revalidation và publication vẫn giữ nguyên. |
| Provider/external | Không gọi hay xuất bản lên Google; Browser QA tương lai cần review Google đã có trong môi trường dev an toàn, không suy ra provider readiness. |

## Lifecycle Baseline

Module Registry ghi Backoffice Reputation inbox `Product Decision: APPROVED`, `Implementation: IMPLEMENTED`, `Environment: UNVERIFIED`, `Production Readiness: BLOCKED`, `External Dependency: BLOCKED` trong scope hiện tại. Đây là baseline module, không phải verdict QA của ứng viên. Planning này không promote bất kỳ dimension nào. Change `async-interaction-feedback-foundation` vẫn giữ QA `BLOCKED_BY_ENVIRONMENT` và Gate 3 của nó không được hợp thức hóa bởi change mới.

## Requirement Readiness

- Có thể viết requirement quan sát được, giới hạn vào nhãn idle giữ nguyên, indication riêng cho lưu bản nháp khi pending, nút không thể submit lặp và busy semantics hiện hữu. Không cần đoán thêm quyền, dữ liệu hoặc outcome.
- Đây là behavior-changing UI nên đường OpenSpec chuẩn là Proposal → Analysis → Gate 1 → Specs → Gate 2, rồi Design nếu áp dụng, Tasks/TIC, Apply, VERIFY và QA theo các gate riêng. Không dùng `skip_specs: true`; `reputation/reply-draft-pending-feedback` là new capability bounded và sẽ cần một delta spec sau Gate 1.
- Sensitive Design Gate: `NOT_TRIGGERED` theo scope hiện tại. Không đổi security/auth, legal/privacy, payment, provider, dữ liệu/runtime, transaction hoặc durable cross-module boundary. Nếu scope sau này vượt các ranh giới đó, phải phân loại lại trước Tasks/Apply.

## UI / UX Applicability

- `UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES`. Browser QA sau implementation phải dùng route thật và review `GOOGLE` được chọn để thấy idle, pending, indication, disabled submit, bố cục và khả năng đọc/truy cập cơ bản. Không chạy QA ở Gate 1. Nếu không có môi trường/review an toàn hoặc pending không quan sát được, ghi blocker thật thay vì giả lập screenshot hay kế thừa verdict của change khác.
- `UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE`. Reason: scope chỉ bổ sung wording chờ cho một nút hiện hữu theo pattern YUTA đã có, không đặt câu hỏi thiết kế ngoài hoặc đổi visual system. Scope: `ReviewReplyForm` trên trang Avis. Decision source: current-user approved candidate scope và `docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`; Gate 1 reviewer cần chấp nhận classification này. Không có external query.
- `DEV_USABLE`, `MANUAL_TEST_READY`, `HUMAN_PRODUCT_VALIDATION`: applicable sau Apply vì đây là flow tương tác trên route thực. Adoption event đã được ghi nhận ở hồ sơ archive có human authorization. Chưa tạo hoặc đánh giá các record đó trong planning.
- Focused test strategy về sau: một component test route-local với idle/pending `useFormStatus`, kiểm tra nhãn tương ứng, native disabled và button `aria-busy`/`data-loading`, gồm disabled do permission/empty input khi cần. Không rewrite Server Action/business tests khi hành vi của chúng không đổi.

## Conflicts and Unknowns

- Không phát hiện `CONFLICT` hay `NEEDS REVIEW` ở mức requirement trong scope đã duyệt.
- Môi trường có review Google dev an toàn và thời gian pending đủ để quan sát là điều kiện QA tương lai; chưa được xác minh, không cản việc viết Specs. Không được coi là QA PASS ở Gate 1.
- Không có page pack riêng cho route Avis trong `docs/ui/pages/`; thay đổi bảo trì nhỏ dùng quy tắc UI chung và Backoffice. Nếu reviewer yêu cầu page pack, đó là quyết định bổ sung, không được tự mở rộng scope ở đây.

## Analysis Conclusion

`READY_FOR_SPECS` cho đúng capability `reputation/reply-draft-pending-feedback`, sau khi Gate 1 duyệt Proposal/Analysis cùng hash. `skip_specs: true` không phù hợp. Gate 1 vẫn `AWAITING_HUMAN_REVIEW`; không cho phép tạo Specs, Design, Tasks, code, test hoặc QA trong bước này.
