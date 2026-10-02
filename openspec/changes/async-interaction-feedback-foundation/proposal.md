## Why

Các tương tác mutation do người dùng khởi tạo trong các frontend YUTA hiện có nhiều pattern hợp lệ nhưng chưa có một behavioral contract dùng chung cho pending feedback, ngăn kích hoạt lặp ngoài ý muốn, error recovery, confirmed success và accessibility. Cần định nghĩa foundation hẹp trước khi mở rộng adoption để tái sử dụng các primitive và framework-native pattern hiện có mà không đồng nhất hóa các business state machine riêng của từng route.

## What Changes

- Định nghĩa behavioral foundation dùng chung cho standard form mutation, navigation/redirect mutation, refresh/retry action, custom business state machine và direct API/manual pending state.
- Yêu cầu pending feedback phải xuất hiện trung thực, giữ rõ nghĩa hành động và ngăn accidental duplicate activation trong khi cùng mutation đang pending.
- Phân biệt field validation với operation/server failure; giữ user-entered values khi recoverable failure và current architecture cho phép; chỉ cung cấp retry khi route thực sự hỗ trợ.
- Chỉ trình bày success sau authoritative success; cho phép visible updated result, redirect hoặc route state rõ ràng thay thế explicit success message khi chính kết quả đã xác nhận completion.
- Định nghĩa accessibility contract cho disabled, busy, accessible action name, error association, focus recovery và live-region restraint.
- Làm rõ vai trò của `Button loading` và composition với `Alert`, `ErrorState`, `Skeleton`, `LoadingOverlay` cùng các route-owned component; bảo vệ behavior dùng chung bằng test phù hợp sau các gate.
- Dùng Strategy B: foundation dùng chung trước, sau đó adoption có allowlist trong Backoffice; POS, Display, Booking và Feedback cần các adoption review riêng.

### Explicit non-goals

- Không tạo universal `ActionButton`, generic async state machine, state-management library, toast architecture, global request spinner hoặc cơ chế intercept mọi `fetch`.
- Không chuẩn hóa route skeleton, mở rộng hàng loạt `loading.tsx`, background refresh, stale/revalidation UX, polling, long-running processing, optimistic update framework hoặc server-side idempotency.
- Không đổi API/action contract, schema, permission, authorization, tenant/org/establishment scope, transaction, persistence lifecycle hoặc business outcome semantics.
- Không sửa stuck-pending runtime issue trong change này.

## Capabilities

### New Capabilities

- `frontend/async-interaction-feedback`: Behavioral contract dùng chung cho feedback của user-triggered async mutation và nguyên tắc adoption có giới hạn theo application/route.

### Modified Capabilities

- Không có. Các capability hiện hữu tiếp tục sở hữu validation, conflict, idempotency, retry identity, authoritative outcome và persistence semantics riêng.

## Impact

- Affected presentation boundary: `packages/ui` có thể được làm rõ hoặc mở rộng hẹp sau khi Specs/Design được duyệt; không thay thế các primitive hiện hữu.
- Initial adoption boundary: một allowlist nhỏ trong `apps/backoffice`; change hiện tại chỉ shaping, chưa adoption.
- Multiple applications chịu tác động ở mức contract tương lai, nhưng POS, Display, Booking và Feedback không nằm trong implementation/adoption của phase đầu.
- Không có API, schema, authorization, data ownership, runtime topology, persistence hoặc transaction change.
- Nếu runtime resolution yêu cầu thay đổi Server Action completion, redirect/revalidation, router refresh, transition architecture hoặc action return contract thì `STOP — CONTROL_TOWER_REVIEW_REQUIRED` và tách khỏi pure UX change này.
