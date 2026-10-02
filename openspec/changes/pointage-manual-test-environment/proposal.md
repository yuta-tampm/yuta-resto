## Why

Giao diện nhân viên Pointage đã có trong Backoffice, nhưng lệnh dev thông thường không tạo được môi trường Pointage an toàn để chủ sản phẩm tự thử trên máy cá nhân. Harness Browser QA hiện có chứng minh luồng với dữ liệu giả dùng một lần, song chưa cung cấp một lệnh vận hành thủ công có thông tin đăng nhập và dọn dẹp đầy đủ.

## REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** Yêu cầu Discovery/Shaping Pointage manual-test trong cuộc trao đổi này, được xác nhận bằng yêu cầu hiện tại “làm cho tôi kiểm thử”, là một lệnh repository để người vận hành tự mở Microsoft Edge trên máy dev và thử route nhân viên Pointage với ít nhất hai hồ sơ giả, PIN giả, trạng thái ban đầu và generation ID được hiển thị sau khi runtime thực sự READY.
- **HARD_CONSTRAINTS:** Chỉ dùng PostgreSQL tạm/disposable, migration canonical rồi extension Pointage test-only hiện có, tổ chức/cơ sở/dossier giả, provider địa chỉ client giả được tiêm từ harness hiện có, Backoffice runtime và route hiện có. Giữ các guard dev/test, loopback, database identity, bí mật và authority hiện hành; Ctrl+C/termination phải dừng child, đóng client, xóa đúng container và nhả cổng. Không dùng dữ liệu nhân viên thật trong dev, staging hoặc production.
- **OUT_OF_SCOPE:** Không mở lại `pointage-usable-raw-clocking`; không đổi Product behavior, Specs, quyền, contracts, schema, migration canonical, UI Pointage, provider production hay deployment/readiness. Không bắt buộc Playwright hoặc tự động điều khiển Edge. Không dùng hồ sơ nhân viên trong database dev thông thường.
- **SUCCESS_OUTCOMES:** Một lệnh được repository hỗ trợ khởi tạo môi trường tạm, xác nhận context-driven READY, in URL, tên/PIN 8 chữ số và trạng thái ban đầu của hai nhân viên giả cùng generation ID; người vận hành có thể tự kiểm thử trên Edge; dừng hoặc lỗi khởi động đều được dọn dẹp xác định, không để runtime/container/cổng sở hữu còn hoạt động.

## What Changes

- Thêm entrypoint dev/test cho việc chạy thử thủ công, tái sử dụng fixture, migration helper và runtime child Pointage hiện có.
- Bổ sung fixture nhân viên giả thứ hai, kiểm tra readiness, thông tin bàn giao tối thiểu cho người vận hành và cleanup có kiểm chứng.
- Ghi hướng dẫn vận hành và checklist thử thủ công ngắn trong tài liệu phát triển hiện có; thêm kiểm thử cho guard, readiness và cleanup của entrypoint.

## Capabilities

### New Capabilities

Không có. Đây là công cụ phát triển/kiểm thử cho capability Pointage đã được phê duyệt; không tạo hành vi Product mới.

### Modified Capabilities

Không có. Các requirement trong `pointage/raw-clocking` và `authorization/pointage` không đổi. Change sử dụng `skip_specs: true`; không tạo delta Spec giả để hợp thức hóa tooling.

## Impact

- Phân loại tác động: `CROSS_MODULE` cho tooling dev/test, vì một lệnh điều phối `apps/backoffice`, fixture `@yuta/db-cloud`, dossier Personnel giả, credential Pointage và tenant scope.
- Dự kiến chỉ chạm entrypoint/helper/test, script package và hướng dẫn phát triển; không chạm mã Product/runtime production hoặc main Specs.
- `UI_AFFECTING: NO`: không sửa giao diện hiện có. Người vận hành vẫn cần quan sát thủ công route thật; việc này không tự động biến thay đổi tooling thành UI redesign.
- Sensitive Design cần xem xét ranh giới credential, database tạm, runtime admission, cleanup và việc có tiến trình khác đang giữ cổng 3001 trước khi Apply.
- Production enablement và ghi giờ nhân viên thật tiếp tục `NOT_AUTHORIZED`; các blocker legal/privacy và provenance production hiện có không được xóa.
