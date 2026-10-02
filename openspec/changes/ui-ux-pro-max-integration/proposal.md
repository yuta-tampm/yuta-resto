## Why

YUTA cần khai thác UI/UX Pro Max như nguồn tư vấn thiết kế bên ngoài cho Codex,
nhưng không để hướng dẫn hoặc trình cài đặt bên ngoài trở thành Product/UI
authority. Discovery phát hiện khác biệt npm/main, giấy phép chưa nhất quán và
payload cài đặt rộng hơn core skill; cần một ranh giới tích hợp có kiểm soát.

## What Changes

- Đề xuất tích hợp project-local, **core-only** `ui-ux-pro-max` qua pinned
  bootstrap có kiểm tra provenance, digest và tập đường dẫn; không vendor
  payload trong giai đoạn giấy phép chưa được chấp thuận.
- Chỉ cho phép sử dụng artifact đã được review về giấy phép/provenance. Bản npm
  `2.15.0` là ứng viên khảo sát, chưa phải artifact được phép cài đặt. Pin phiên
  bản không tự giải quyết khả năng tái lập của dependencies.
- Giữ YUTA authority cao hơn mọi lời khuyên bên ngoài; xung đột giữa YUTA
  authorities phải STOP với `CONFLICT / NEEDS_REVIEW`.
- Bổ sung chính sách tư vấn bên ngoài vào hệ thống UI governance hiện có,
  không tạo một Design Bible song song. Phân loại việc dùng công cụ là
  `REQUIRED / OPTIONAL / NOT_APPLICABLE` theo nhiệm vụ; tích hợp vào các giai
  đoạn hiện có, không thêm một phase bắt buộc cho mọi thay đổi.
- Dùng mô hình preset `variance / motion / density` theo từng app; page kế
  thừa và ngoại lệ cần review. Không chốt giá trị số hoặc thiết kế lại app
  trong change này.
- Kiểm soát activation, đường dẫn đang tồn tại, payload ngoài allowlist và
  trường hợp installer bỏ qua; không suy diễn exit code thành bằng chứng cài
  đặt đúng. Heuristic review không thay Browser QA hoặc Gate 3.

### Non-goals

Không cài sáu sibling skills; không `@latest`, `--global`, `--force`, tự động
update, `--persist` hoặc `MASTER.md`. Không đổi UI, token, font, component,
business/auth/tenant/data/runtime, Product Knowledge hay lifecycle/readiness.
Không thay generated OpenSpec skills, schema hoặc config. Không production.

## Capabilities

### New Capabilities

- `tooling/external-design-intelligence`: hành vi chấp nhận/từ chối nguồn tư
  vấn, project-local bootstrap được kiểm soát, authority routing và bằng chứng
  sử dụng UI/UX Pro Max trong workflow YUTA. Đây là hành vi tooling quan sát
  được, không phải spec giả cho thay đổi chỉ-format/documentation.

### Modified Capabilities

Không có. Các normative main specs hiện hữu không thay đổi.

## Impact

Classification: `CROSS_MODULE / TOOLING_GOVERNANCE_SENSITIVE /
SUPPLY_CHAIN_SENSITIVE / LICENSE_PROVENANCE_UNCERTAIN`.

Strategy A: một change bounded cho policy, bootstrap và verification liên quan.
Design sẽ chốt exact implementation allowlist, nguồn pin/dependencies,
activation và fail-closed handling. Sensitive Design Gate: `REQUIRED`.

Vùng có thể bị ảnh hưởng khi được phép Apply: project-local skill setup,
ignore/bootstrap metadata, developer setup và các nguồn UI/workflow/prompt có
liên quan. Existing page packs và prompt provenance không được tự viết lại.
Không thêm application dependency hoặc provider/runtime integration.

Lần này chỉ tạo Proposal, Analysis và Gate 1 packet. Specs, Design, Tasks,
download/install payload và Apply chưa được phép. License/provenance acceptance
là điều kiện bắt buộc trước Apply; phê duyệt planning không thay điều kiện đó.
