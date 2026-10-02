## Why

`next-env.d.ts` là output do Next.js sinh, không phải implementation authority. Checkout sạch hiện không sinh Next types trước TypeScript; giữ file trong Git gây drift dev/build và làm gián đoạn integrity review của change không liên quan.

## What Changes

- Theo quyết định Control Tower: tạo bootstrap được repository hỗ trợ để sinh Next types trước recursive typecheck cho đúng sáu app: `apps/backoffice`, `apps/web`, `apps/booking-web`, `apps/feedback-web`, `apps/yuta-pos`, `apps/yuta-display`.
- Dùng CLI `next typegen` của Next hiện có; orchestration ở repository root và thứ tự CI/development được cập nhật tối thiểu. Không tự viết bộ sinh declarations, không thêm dependency hoặc framework.
- Chỉ sau bằng chứng clean-bootstrap cho cả sáu app mới bỏ tracking và ignore các `next-env.d.ts` tương ứng. File vẫn có thể được sinh local bởi typegen/dev/build.
- Giữ nguyên phát hiện drift với mọi tracked source khác; không tạo ngoại lệ riêng Formalités hoặc sửa workflow integrity.
- Kiểm chứng từng app, recursive flow từ clean checkout, generation failure, Git drift và bảo toàn Formalités. Không dùng restore/build/restore làm giải pháp.

## Capabilities

### New Capabilities

Không thêm capability sản phẩm hoặc normative behavioral requirement. Đây là repository tooling/bootstrap maintenance. Đề nghị nhánh `NO_SPEC_BEHAVIOR_CHANGE`, với `skip_specs: true`; Gate 1 vẫn bắt buộc. Không tạo spec giả chỉ để đáp ứng CLI.

### Modified Capabilities

Không sửa main spec nào, bao gồm Personnel và Authorization. Thay đổi thứ tự chạy công cụ không thay đổi hợp đồng nghiệp vụ, API hoặc runtime.

## Impact

- Owner: YUTA engineering / repository tooling; không tạo runtime hoặc package owner mới.
- Phạm vi dự kiến khi được phép Apply: root `package.json`, `.github/workflows/ci.yml`, `.gitignore`, sáu generated declaration paths và tài liệu bootstrap hiện có (`README.md`, `docs/DEVELOPMENT_WORKFLOW.md`). Scoped regression evidence được xác định khi thiết kế/lập kế hoạch. Không cần sửa business code hoặc dependencies.
- Rủi ro: bỏ tracking trước khi bootstrap đúng; app bị bỏ sót; cấu hình app có side effect; typed routes thiếu; bypass typecheck; drift của source bị che; dirty-worktree attribution. Bằng chứng Backoffice trước đó không thay thế kiểm chứng năm app còn lại.
- Giữ nguyên toàn bộ bốn file implementation và planning/evidence của `formalites-authorization`; change đó vẫn không được sync/archive bởi công việc này.

## Non-goals

Không sửa Formalités, Product behavior, quyền, tenancy, runtime/data ownership, UI, application business logic, schema, migrations, provider hoặc production. Không deploy, sync/archive, tạo Specs/Design/Tasks trong lượt Gate 1 này; không nâng lifecycle hoặc nới Gate 3 integrity.
