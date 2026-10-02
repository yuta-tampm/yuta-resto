## Purpose

Capability này xác định authorization contract cho Restaurant Knowledge READ và MANAGE trong trusted organization/establishment tenant context, độc lập với Establishment Profile permissions.

## ADDED Requirements

### Requirement: Restaurant Knowledge READ và MANAGE là hai logical operations độc lập

Shared Authorization capability SHALL biểu diễn và đánh giá Restaurant Knowledge READ và Restaurant Knowledge MANAGE như hai logical operations riêng biệt. Grant hoặc permission check của một operation SHALL NOT thay thế permission check của operation còn lại, ngay cả khi initial grant sets của chúng giống nhau. Hệ thống SHALL NOT reuse hoặc inherit `establishment.profile.read` hay `establishment.profile.manage` để authorize Restaurant Knowledge.

#### Scenario: READ và MANAGE được đánh giá riêng

- **WHEN** một caller yêu cầu authorization cho Restaurant Knowledge READ hoặc Restaurant Knowledge MANAGE
- **THEN** hệ thống SHALL đánh giá đúng operation được yêu cầu
- **AND** kết quả của operation còn lại SHALL NOT tự động thay thế kết quả đó

#### Scenario: Establishment Profile permission không cấp Restaurant Knowledge access

- **WHEN** một principal có Establishment Profile read hoặc manage permission nhưng không có Restaurant Knowledge operation permission tương ứng
- **THEN** hệ thống SHALL deny Restaurant Knowledge operation được yêu cầu

### Requirement: READ chỉ được grant cho OWNER và MANAGER

Trong một valid server-derived tenant context, shared Authorization capability SHALL grant Restaurant Knowledge READ cho active `OWNER` và active `MANAGER` của establishment hiện tại. Hệ thống SHALL deny READ cho `STAFF` theo default policy hiện tại.

#### Scenario: Active OWNER được phép READ

- **WHEN** active establishment membership có role `OWNER` yêu cầu Restaurant Knowledge READ trong trusted tenant context tương ứng
- **THEN** hệ thống SHALL allow READ

#### Scenario: Active MANAGER được phép READ

- **WHEN** active establishment membership có role `MANAGER` yêu cầu Restaurant Knowledge READ trong trusted tenant context tương ứng
- **THEN** hệ thống SHALL allow READ

#### Scenario: STAFF bị deny READ mặc định

- **WHEN** active establishment membership có role `STAFF` yêu cầu Restaurant Knowledge READ
- **THEN** hệ thống SHALL deny READ

### Requirement: MANAGE chỉ được grant cho OWNER và MANAGER

Trong một valid server-derived tenant context, shared Authorization capability SHALL grant Restaurant Knowledge MANAGE cho active `OWNER` và active `MANAGER` của establishment hiện tại. Hệ thống SHALL deny MANAGE cho `STAFF` theo default policy hiện tại.

#### Scenario: Active OWNER được phép MANAGE

- **WHEN** active establishment membership có role `OWNER` yêu cầu Restaurant Knowledge MANAGE trong trusted tenant context tương ứng
- **THEN** hệ thống SHALL allow MANAGE

#### Scenario: Active MANAGER được phép MANAGE

- **WHEN** active establishment membership có role `MANAGER` yêu cầu Restaurant Knowledge MANAGE trong trusted tenant context tương ứng
- **THEN** hệ thống SHALL allow MANAGE

#### Scenario: STAFF bị deny MANAGE mặc định

- **WHEN** active establishment membership có role `STAFF` yêu cầu Restaurant Knowledge MANAGE
- **THEN** hệ thống SHALL deny MANAGE

### Requirement: Restaurant Knowledge authorization giữ trusted tenant enforcement và fail closed

Hệ thống SHALL chỉ đánh giá Restaurant Knowledge READ hoặc MANAGE từ server-derived tenant context có valid active user, active organization, active establishment và matching active establishment membership. Missing, inactive, mismatched hoặc browser-supplied identity, scope, role hay permission SHALL NOT authorize operation. Restaurant Knowledge SHALL giữ semantic establishment scope và SHALL NOT thay đổi accepted organization/establishment tenancy boundary.

#### Scenario: Missing hoặc inactive trusted prerequisite bị deny

- **WHEN** user, organization, establishment hoặc matching establishment membership bị thiếu hoặc không active
- **THEN** hệ thống SHALL deny Restaurant Knowledge operation trước khi operation permission có thể cấp access

#### Scenario: Mismatched organization hoặc establishment bị deny

- **WHEN** authenticated context không khớp organization hoặc establishment scope của active membership
- **THEN** hệ thống SHALL deny Restaurant Knowledge operation

#### Scenario: Browser-supplied authorization input không có authority

- **WHEN** browser cung cấp organization, establishment, membership, role hoặc permission value
- **THEN** hệ thống SHALL NOT dùng value đó làm authorization proof cho Restaurant Knowledge

#### Scenario: Public hoặc service actor không thuộc accepted principals

- **WHEN** actor không phải authenticated restaurant user với active establishment membership role `OWNER`, `MANAGER` hoặc `STAFF`
- **THEN** hệ thống SHALL deny Restaurant Knowledge READ và MANAGE

### Requirement: YUTA system roles không bypass restaurant authorization

`YUTA_ADMIN` và `YUTA_SUPPORT` SHALL NOT tự cấp Restaurant Knowledge READ hoặc MANAGE. Một user có system role chỉ có thể được authorize theo valid active restaurant membership và Restaurant Knowledge operation grant giống mọi restaurant user khác.

#### Scenario: System role không có active membership bị deny

- **WHEN** user có `YUTA_ADMIN` hoặc `YUTA_SUPPORT` nhưng không có matching active establishment membership
- **THEN** hệ thống SHALL deny Restaurant Knowledge READ và MANAGE

#### Scenario: System role có active membership vẫn dùng membership grant

- **WHEN** user có `YUTA_ADMIN` hoặc `YUTA_SUPPORT` đồng thời có matching active establishment membership
- **THEN** hệ thống SHALL quyết định Restaurant Knowledge operation chỉ từ trusted membership role và approved operation grant
- **AND** system role SHALL NOT mở rộng grant đó

### Requirement: Existing authorization contracts giữ nguyên

Việc bổ sung Restaurant Knowledge READ và MANAGE SHALL NOT thay đổi role grants, permission semantics hoặc enforcement của Establishment Profile, Booking, Reputation, Personnel, Access Audit hay capability khác. Future STAFF access, section-specific access hoặc additional permission tier SHALL yêu cầu một Product decision riêng.

#### Scenario: Existing capability permission được đánh giá như trước

- **WHEN** hệ thống đánh giá một non-Restaurant-Knowledge permission sau khi Restaurant Knowledge operations được tích hợp
- **THEN** existing capability grant và denial behavior SHALL giữ nguyên

#### Scenario: Không suy ra future access expansion

- **WHEN** caller yêu cầu STAFF access, section-specific access hoặc permission tier ngoài READ và MANAGE
- **THEN** hệ thống SHALL NOT suy ra hoặc grant access đó từ Restaurant Knowledge authorization contract hiện tại
