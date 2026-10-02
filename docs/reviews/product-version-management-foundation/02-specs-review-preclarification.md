Change: product-version-management-foundation
Gate: Gate 2 — Requirements Review
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-23T20:18:00.3255639+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: NO (current scope; reassess later qualifying boundary)

# Gate 2 Review — Product Release Identity Requirements

## Approved Gate 1 reference
- Gate 1 packet: `docs/reviews/product-version-management-foundation/01-analysis-review.md`
- Gate 1 status: `APPROVED`; exact packet SHA-256: `fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564`
- Reviewed Proposal SHA-256: `5d924477c3d83fc7f0b5e4fbf657c66f17a9d85b6a1439bbe4e43814ed4bf0dc`
- Reviewed Analysis SHA-256: `f2721e6a41223b1283e79becbe98f62818580cbfdc6a22550d3199b180256d29`
- Approval source: explicit current-user Gate 1 instruction for this change. The initial pre-approval BLOCKED_NEEDS_REVIEW record remains preserved at `docs/reviews/product-version-management-foundation/01-analysis-review-preapproval.md`.

## Delta Spec scope
- One declared new capability: `product-release/identity`; one delta spec at `
openspec/changes/product-version-management-foundation/specs/product-release/identity/spec.md
`.
- Seven ADDED requirements and fifteen scenarios; no modified, removed or renamed capabilities.
- No Design, Tasks, implementation, VERIFY or Browser QA artifacts were created by this step.

## Exact Delta Spec Content

```markdown
## Purpose

Xác định một danh tính Product Release YUTA thống nhất để các ứng dụng trực tiếp hiển thị cùng thông tin sản phẩm, đồng thời tách danh tính này khỏi phiên bản package, trạng thái capability và bằng chứng triển khai.

## ADDED Requirements

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

Product Version SHALL là giá trị riêng của Product Release, không được suy ra từ `package.json` version. Release metadata SHALL từ chối Product Version rỗng hoặc không có dạng phiên bản `major.minor.patch` với các thành phần số không âm, có thể có prerelease suffix; giá trị hiện hành `0.1.0-alpha.1` SHALL được chấp nhận. Validation SHALL xác định cùng một kết quả cho cùng một metadata ở mọi direct consumer; không được suy ra Product Maturity Stage chỉ từ suffix của Product Version.

#### Scenario: Phiên bản ban đầu hợp lệ
- **WHEN** metadata có Product Version `0.1.0-alpha.1` và stage `ALPHA`
- **THEN** validation chấp nhận hai giá trị đã được phê duyệt mà không lấy `0.1.0` từ package manifest để thay thế

#### Scenario: Phiên bản thiếu hoặc sai cấu trúc
- **WHEN** Product Version là chuỗi rỗng hoặc không có ba thành phần số `major.minor.patch`
- **THEN** release metadata bị từ chối trước khi tạo nhãn hiển thị

#### Scenario: Package version thay đổi độc lập
- **WHEN** version của một package/workspace thay đổi nhưng Product Release metadata không đổi
- **THEN** Product Version được hiển thị vẫn là `0.1.0-alpha.1`

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
```

## Requirements and scenarios for review
1. Canonical four-part YUTA Product Release metadata and no separate stable release ID (2 scenarios).
2. Exactly six maturity stages with one public label each, including GENERAL_AVAILABILITY → Stable and unsupported-stage rejection (3 scenarios).
3. Product Version independent of package manifests, with basic major.minor.patch/prerelease format validation (3 scenarios).
4. Full and compact deterministic representations from one authority (2 scenarios).
5. Web persistent footer replaces Projet pilote with full Product Release representation (1 scenario).
6. Backoffice authenticated AppFooter replaces hardcoded v1.0.0 using the same release authority (2 scenarios).
7. Product maturity remains independent from capability lifecycle/readiness and deployment authorization (2 scenarios).

## Strict validation evidence
Command: `openspec validate product-version-management-foundation --type change --strict --json --no-interactive`
Result: exit 0; change valid: true; issues: []; passed 1, failed 0. This is structural OpenSpec validation, not Product approval, implementation VERIFY or Browser QA.

## Changed assumptions and bounded questions
- The spec proposes a basic Product Version format rule (`major.minor.patch`, optional prerelease suffix) to make the approved deterministic validation objective testable. Gate 1 approved the initial exact value but did not separately define a complete grammar for future releases. Gate 2 should explicitly accept or request revision of this bounded rule; no external SemVer standard or new dependency is silently imposed.
- Full Web wording and permitted Backoffice compact wording follow the exact Gate 1 decision. Release name Foundation remains metadata but is not required inside the compact footer text.
- No new Product, authorization, tenant, database, API, provider, deployment or capability-availability behavior is inferred. QA is mandatory later because UI_AFFECTING: YES; none is performed now.

## Artifact integrity
Tool/command: Get-FileHash -Algorithm SHA256 over exact file bytes, rendered below as lowercase hex. Gate 1 reviewed path set was rechecked before creating this packet.

| Repository-relative path | SHA-256 |
| --- | --- |
| `docs/reviews/product-version-management-foundation/01-analysis-review.md` | `fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564` |
| `openspec/changes/product-version-management-foundation/specs/product-release/identity/spec.md` | `49838a9bf593952417043c9b170e82c05841ea2895874587e36f7c6d86926d07` |

## Recommendation and stop
AWAITING_HUMAN_REVIEW at Gate 2. Review exact requirements/scenarios, especially the Product Version format rule. No Design or Apply until explicit current-user Gate 2 approval bound to this spec path and hash. Sensitive Design Gate remains not triggered on current scope and must be reassessed if later Design introduces a qualifying durable boundary.
