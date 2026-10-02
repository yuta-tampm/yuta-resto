## Why

Direct Customer Feedback đang có hai khoảng lệch tại public trusted boundary: runtime lookup chưa chứng minh miền `active` đồng thời đã được xác minh, và yêu cầu production fail-closed cho IP-hash salt chưa được thực thi khi không tìm thấy client IP. Change này làm rõ và gia cố đúng hai invariant đó trước khi coi public submission boundary là nhất quán với authority hiện hành.

## What Changes

- Làm cho production public tenant resolution chỉ chấp nhận hostname ánh xạ tới domain đang active, đã được xác minh, thuộc organization/establishment đang active và khớp public feedback slug.
- Giữ nguyên write-path hiện có khi đã bảo đảm `active => verified`; nếu repository không có invariant bền vững trên mọi authorized write path, thực thi fail-closed tại điểm đọc/resolution nhỏ nhất thay vì mở rộng thành domain-management workflow hoặc migration không cần thiết.
- Định nghĩa contract cấu hình production cho `PUBLIC_FEEDBACK_IP_HASH_SALT`, gồm độ dài tối thiểu hiện hành và validation fail-closed không phụ thuộc việc request có cung cấp client IP hay không.
- Định nghĩa client-IP source chỉ được tin cậy theo runtime/deployment contract đã cấu hình; khi repository chưa chứng minh header provenance, giữ đó là environment requirement và không tự suy đoán topology.
- Bổ sung focused tests cho verified/active domain resolution, unverified/inactive/malformed hostname denial, thiếu production salt và thiếu trusted client-IP source.
- Không thay đổi rate-limit atomicity, idempotency, duplicate handling, body limits, contact workflow, retention, Backoffice settings, external review URL/QR policy, UI/accessibility, analytics, composite tenant ownership hoặc Google/Facebook/Instagram connectors.

## Capabilities

### New Capabilities

- `public-feedback/trusted-boundary`: Yêu cầu quan sát được cho verified public hostname resolution và production client-IP hashing/configuration fail-closed của Direct Customer Feedback.

### Modified Capabilities

- Không có.

## Impact

- Runtime owner: `apps/feedback-web`.
- Cross-module consumers/owners: `packages/tenant` cho trusted public tenant resolution; `packages/db-cloud` cho domain lookup/schema evidence; focused tests trong các boundary này và contracts chỉ khi thật sự cần.
- Data shape: chưa đề xuất schema hoặc migration; Analysis/Design phải chứng minh có cần hay không trước Apply.
- Deployment: không deploy và không tuyên bố production readiness; exact trusted proxy/header provenance còn là environment evidence requirement nếu repository không định nghĩa.
- Security: change ảnh hưởng public trusted boundary, vì vậy Design và Sensitive Design Gate là bắt buộc trước Tasks/Apply.
