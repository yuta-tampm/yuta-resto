# Product Release Identity Specification

## Purpose

Xác định một danh tính Product Release YUTA thống nhất để các ứng dụng trực tiếp hiển thị cùng thông tin sản phẩm, đồng thời tách danh tính này khỏi phiên bản package, trạng thái capability và bằng chứng triển khai.

## Requirements

### Requirement: Canonical Product Release metadata

Product Release hiện hành SHALL có đúng các thành phần có ý nghĩa sản phẩm: product identity, Product Maturity Stage canonical, Product Version và human-readable release name. Release đầu tiên của capability này SHALL là `YUTA`, `ALPHA`, `0.1.0-alpha.1`, `Foundation`. Capability SHALL không tạo hoặc yêu cầu stable release ID riêng để nhận diện release này.

#### Scenario: Đọc release hiện hành

- **WHEN** một direct consumer yêu cầu Product Release metadata hiện hành
- **THEN** consumer nhận cùng product identity `YUTA`, stage `ALPHA`, Product Version `0.1.0-alpha.1` và release name `Foundation`, không có stable release ID riêng

#### Scenario: Release name không thay vai trò stage hoặc version

- **WHEN** consumer trình bày release name `Foundation`
- **THEN** consumer vẫn phân biệt tên này với stage `ALPHA` và Product Version `0.1.0-alpha.1`

### Requirement: Closed maturity stages and public labels

Product Maturity Stage SHALL chỉ nhận `PROTOTYPE`, `ALPHA`, `PRIVATE_BETA`, `PUBLIC_BETA`, `RELEASE_CANDIDATE`, `GENERAL_AVAILABILITY`. Mapping public label SHALL chính xác là `Prototype`, `Alpha`, `Private Beta`, `Public Beta`, `RC`, `Stable` theo cùng thứ tự. Mỗi stage SHALL có đúng một canonical public label; stage không được hỗ trợ SHALL bị từ chối thay vì tự suy ra nhãn hoặc fallback sang stage khác.

#### Scenario: Mapping đầy đủ

- **WHEN** consumer lấy public label cho từng stage được hỗ trợ
- **THEN** kết quả lần lượt là `Prototype`, `Alpha`, `Private Beta`, `Public Beta`, `RC`, `Stable`

#### Scenario: General Availability dùng Stable

- **WHEN** stage là `GENERAL_AVAILABILITY`
- **THEN** canonical public label là `Stable`, không phải `GA`

#### Scenario: Stage không được hỗ trợ

- **WHEN** release metadata chứa một stage ngoài tập sáu giá trị canonical
- **THEN** metadata bị từ chối, không được hiển thị với nhãn đoán hoặc mặc định

### Requirement: Validated and independent Product Version

Product Version SHALL là giá trị riêng của Product Release, không được suy ra từ `package.json` version. Giá trị canonical SHALL khớp toàn bộ một trong hai dạng `MAJOR.MINOR.PATCH` hoặc `MAJOR.MINOR.PATCH-PRERELEASE`. `MAJOR`, `MINOR`, `PATCH` SHALL là các số nguyên không âm viết bằng chữ số ASCII, mỗi thành phần bắt buộc và không có leading zero trừ khi chính thành phần đó là `0`. Nếu có `PRERELEASE`, suffix SHALL bắt đầu bằng `-` và có ít nhất một identifier; các identifier SHALL được phân tách bằng dấu `.`, không rỗng, chỉ gồm chữ cái ASCII, chữ số ASCII hoặc `-`; identifier hoàn toàn bằng số SHALL không có leading zero trừ khi là `0`. Đây là SemVer-compatible subset có chủ đích: build metadata `+...` nằm ngoài Product Version contract của foundation này. Giá trị canonical SHALL không chứa `v` prefix; `v` chỉ có thể được thêm khi format biểu diễn. Validation SHALL cho cùng kết quả đối với cùng metadata ở mọi direct consumer. Prerelease identifier SHALL không quyết định hoặc tự thay đổi Product Maturity Stage.

#### Scenario: Core version hợp lệ

- **WHEN** Product Version là `0.1.0`, `1.0.0` hoặc `2.13.4`
- **THEN** validation chấp nhận giá trị canonical theo dạng `MAJOR.MINOR.PATCH`

#### Scenario: Prerelease version hợp lệ

- **WHEN** Product Version là `0.1.0-alpha.1`, `0.2.0-beta.1` hoặc `0.9.0-rc.1`
- **THEN** validation chấp nhận giá trị canonical theo dạng `MAJOR.MINOR.PATCH-PRERELEASE`, bao gồm release hiện hành `0.1.0-alpha.1`

#### Scenario: Core numeric identifier có leading zero

- **WHEN** Product Version là `01.0.0`, `1.01.0` hoặc `1.0.00`
- **THEN** release metadata bị từ chối trước khi tạo nhãn hiển thị

#### Scenario: Core version thiếu thành phần

- **WHEN** Product Version là chuỗi rỗng, `1.0` hoặc `1`
- **THEN** release metadata bị từ chối trước khi tạo nhãn hiển thị

#### Scenario: Prerelease bị lỗi

- **WHEN** Product Version là `0.1.0-`, `0.1.0-alpha..1` hoặc `0.1.0-alpha.01`
- **THEN** release metadata bị từ chối vì thiếu identifier, có identifier rỗng hoặc numeric identifier có leading zero

#### Scenario: Canonical Product Version không có v prefix

- **WHEN** Product Version metadata là `v0.1.0-alpha.1`
- **THEN** validation từ chối giá trị metadata đó, dù presentation formatting có thể thêm `v` vào Product Version canonical `0.1.0-alpha.1`

#### Scenario: Build metadata ngoài contract hiện hành

- **WHEN** Product Version metadata là `1.0.0+build.42`
- **THEN** validation từ chối giá trị đó theo YUTA foundation contract, không khẳng định build metadata là sai trong SemVer nói chung

#### Scenario: Package version thay đổi độc lập

- **WHEN** version của một package/workspace thay đổi nhưng Product Release metadata không đổi
- **THEN** Product Version được hiển thị vẫn là `0.1.0-alpha.1`

#### Scenario: Prerelease không quyết định maturity stage

- **WHEN** Product Version là `0.2.0-beta.1` và Product Maturity Stage được xác định độc lập là `PRIVATE_BETA` hoặc `PUBLIC_BETA`
- **THEN** validation không suy ra hoặc ghi đè stage từ `beta.1`; thay đổi Product Version riêng lẻ không tự promote hoặc demote Product Maturity Stage

### Requirement: Deterministic release representation

Biểu diễn đầy đủ của release hiện hành SHALL là `YUTA Alpha · v0.1.0-alpha.1`, dẫn xuất từ metadata và canonical stage label. Biểu diễn compact bỏ product identity SHALL là `Alpha · v0.1.0-alpha.1`. Cùng metadata SHALL tạo cùng biểu diễn tại Web và Backoffice; các ứng dụng SHALL không duy trì literal phiên bản release độc lập.

#### Scenario: Biểu diễn đầy đủ

- **WHEN** direct consumer yêu cầu full representation cho release hiện hành
- **THEN** kết quả là `YUTA Alpha · v0.1.0-alpha.1`

#### Scenario: Biểu diễn compact

- **WHEN** direct consumer yêu cầu compact representation cho release hiện hành
- **THEN** kết quả là `Alpha · v0.1.0-alpha.1` từ cùng metadata và label mapping

### Requirement: Public Web footer uses the Product Release

Public Web SHALL hiển thị full Product Release representation tại footer persistent hiện hữu và thay đúng wording Product Maturity `Projet pilote`. Việc hiển thị này SHALL không tự thêm claim về deployment, capability availability hoặc production readiness.

#### Scenario: Web footer của release ban đầu

- **WHEN** người dùng xem footer của Public Web ở desktop hoặc mobile
- **THEN** footer hiển thị `YUTA Alpha · v0.1.0-alpha.1` và không còn dùng `Projet pilote` làm Product Maturity wording

### Requirement: Backoffice footer uses the same release authority

Backoffice SHALL hiển thị Product Release tại authenticated `AppFooter` hiện hữu, dùng metadata và canonical mapping giống Public Web. Footer SHALL thay hardcoded release wording `YUTA v1.0.0`; compact representation `Alpha · v0.1.0-alpha.1` được chấp nhận khi product identity vẫn rõ trong shell.

#### Scenario: Authenticated Backoffice footer

- **WHEN** một người dùng đã xác thực xem Backoffice footer
- **THEN** footer hiển thị release hiện hành từ cùng authority với Public Web, không hiển thị hardcoded `YUTA v1.0.0`

#### Scenario: Hai direct consumers nhất quán

- **WHEN** Web và Backoffice cùng hiển thị release hiện hành
- **THEN** stage label và Product Version của cả hai là `Alpha` và `0.1.0-alpha.1`, dù mức độ rút gọn của text khác nhau

### Requirement: Product maturity remains separate from capability lifecycle

Product Maturity Stage SHALL không được dùng như bằng chứng hoặc điều kiện tự động để kết luận capability `IMPLEMENTED`, `READY`, `PRODUCTION_ENABLED` hay external `READY`. Capability readiness SHALL không tự động thay đổi Product Maturity Stage. Product Release representation SHALL không tự cấp deployment hoặc production authorization.

#### Scenario: Alpha khi capability còn blocked

- **WHEN** YUTA Product Release đang ở `ALPHA` và một capability có readiness `BLOCKED`
- **THEN** capability đó vẫn `BLOCKED` và release label không diễn giải thành `READY`

#### Scenario: Capability readiness không promote Product

- **WHEN** một capability riêng được chứng minh `READY`
- **THEN** Product Maturity Stage vẫn là `ALPHA` cho đến khi có Product Release decision riêng
