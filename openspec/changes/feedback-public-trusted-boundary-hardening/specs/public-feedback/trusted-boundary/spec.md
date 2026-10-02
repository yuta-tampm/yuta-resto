## Purpose

Capability này bảo đảm Direct Customer Feedback chỉ chấp nhận production submission khi public tenant và rate-limit identity đều được thiết lập từ các nguồn đã xác minh, với hành vi fail-closed khi thiếu trust evidence bắt buộc.

## ADDED Requirements

### Requirement: Verified public tenant boundary

Hệ thống SHALL chỉ tạo trusted public tenant context cho Direct Customer Feedback khi request hostname hợp lệ, ánh xạ chính xác tới một tenant domain có trạng thái active và có verification evidence, đồng thời organization và establishment liên quan đều active. Hệ thống MUST tiếp tục cross-check public feedback slug trong trusted establishment scope và MUST NOT dùng route slug, form value, cookie hoặc browser-supplied identifier làm tenant authorization proof.

#### Scenario: Verified active domain được chấp nhận

- **WHEN** production request có hostname hợp lệ ánh xạ chính xác tới domain active đã verified, organization và establishment đều active, và route slug khớp public feedback configuration trong trusted scope
- **THEN** hệ thống tạo trusted public tenant context cho đúng organization và establishment đó và cho phép tiếp tục xử lý public feedback request

#### Scenario: Active domain chưa verified bị từ chối

- **WHEN** production request có hostname ánh xạ tới domain mang trạng thái active nhưng không có verification evidence
- **THEN** hệ thống MUST NOT tạo trusted public tenant context và MUST từ chối public feedback request theo public unavailable behavior

#### Scenario: Inactive domain bị từ chối

- **WHEN** production request có hostname ánh xạ tới domain pending hoặc disabled, kể cả khi domain từng có verification evidence
- **THEN** hệ thống MUST NOT tạo trusted public tenant context và MUST từ chối public feedback request

#### Scenario: Inactive organization hoặc establishment bị từ chối

- **WHEN** hostname ánh xạ tới domain active đã verified nhưng organization hoặc establishment liên quan không active
- **THEN** hệ thống MUST NOT tạo trusted public tenant context và MUST từ chối public feedback request

#### Scenario: Slug không khớp trusted scope bị từ chối

- **WHEN** hostname đủ điều kiện trusted nhưng route slug không khớp public feedback configuration của establishment đã resolve
- **THEN** hệ thống MUST từ chối request và MUST NOT dùng slug để chuyển sang organization hoặc establishment khác

#### Scenario: Hostname malformed hoặc không được ánh xạ bị từ chối

- **WHEN** request hostname malformed, là URL thay vì hostname, hoặc không ánh xạ tới eligible tenant domain
- **THEN** hệ thống MUST NOT tạo trusted public tenant context và MUST từ chối public feedback request mà không tiết lộ tenant data

### Requirement: Production-required abuse-protection configuration

Trước khi chấp nhận bất kỳ production public feedback submission nào, hệ thống SHALL validate independent production configuration cho việc tạo salted client identity. `PUBLIC_FEEDBACK_IP_HASH_SALT` MUST tồn tại và MUST có ít nhất 32 ký tự; validation này MUST không phụ thuộc vào việc request có cung cấp client address hay không. Missing hoặc invalid production-required configuration MUST fail closed trước khi feedback được persist.

#### Scenario: Production salt hợp lệ

- **WHEN** production runtime có `PUBLIC_FEEDBACK_IP_HASH_SALT` dài ít nhất 32 ký tự và các configuration requirement khác của trusted client identity đều hợp lệ
- **THEN** hệ thống cho phép request đi tiếp tới bước resolve trusted client identity

#### Scenario: Production salt bị thiếu

- **WHEN** production runtime không có `PUBLIC_FEEDBACK_IP_HASH_SALT`
- **THEN** hệ thống MUST từ chối submission, MUST NOT persist feedback và MUST NOT bỏ qua lỗi chỉ vì request không có client address

#### Scenario: Production salt không đạt contract

- **WHEN** production runtime có `PUBLIC_FEEDBACK_IP_HASH_SALT` ngắn hơn 32 ký tự
- **THEN** hệ thống MUST từ chối submission và MUST NOT persist feedback

### Requirement: Trusted production client identity

Hệ thống SHALL chỉ tạo production rate-limit identity từ client-IP source có provenance được runtime/deployment environment xác lập rõ ràng. Hệ thống MUST NOT coi một header là trusted chỉ vì header đó có tên thường dùng, và MUST NOT silently tiếp tục submission khi trusted client identity không thể được thiết lập. Raw client IP MUST NOT được persist; chỉ salted one-way hash được phép đi vào feedback persistence/rate-limit boundary.

#### Scenario: Trusted client identity được thiết lập

- **WHEN** production request đến qua runtime path có documented trusted client-IP provenance và trusted source cung cấp một client address dùng được
- **THEN** hệ thống tạo salted one-way client identity cho rate limiting, không persist raw client IP, và cho phép submission tiếp tục theo existing abuse limits

#### Scenario: Trusted client-IP source không được xác lập

- **WHEN** production environment không chứng minh được source/proxy contract nào có authority cung cấp client address
- **THEN** public feedback submission MUST fail closed và MUST NOT được persist

#### Scenario: Trusted client identity vắng mặt trong request

- **WHEN** production environment có trusted source contract nhưng request không cung cấp usable client address từ source đó
- **THEN** hệ thống MUST từ chối submission, MUST NOT persist feedback và MUST NOT chuyển sang một untrusted header hoặc anonymous rate-limit bypass

#### Scenario: Client-supplied untrusted header không cấp identity

- **WHEN** request chứa client-IP-like header không thuộc trusted source contract của environment
- **THEN** hệ thống MUST NOT dùng giá trị đó để tạo rate-limit identity và MUST fail closed nếu không còn trusted client identity
