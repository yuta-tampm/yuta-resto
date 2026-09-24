Change: product-version-management-foundation
Gate: Gate 2 — Requirements Review
Review status: APPROVED
Created: 2026-09-23T20:30:56.9170455+02:00
Approved: 2026-09-23T20:50:12.5779492+02:00
Approval source: explicit current-user Gate 2 instruction for the exact Spec SHA-256 bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d
Approval scope: Design phase only; no Tasks, TIC, Apply, implementation, VERIFY or Browser QA in this turn
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: NO (current scope; reassess later qualifying boundary)

# Gate 2 Review — Product Release Identity Requirements

## Approved Gate 1 reference and integrity
- Gate 1 packet: docs/reviews/product-version-management-foundation/01-analysis-review.md
- Gate 1 status: APPROVED; exact packet SHA-256: fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564
- Reviewed Proposal SHA-256: 5d924477c3d83fc7f0b5e4fbf657c66f17a9d85b6a1439bbe4e43814ed4bf0dc
- Reviewed Analysis SHA-256: f2721e6a41223b1283e79becbe98f62818580cbfdc6a22550d3199b180256d29
- Approval source: explicit current-user Gate 1 instruction. Original Gate 1 BLOCKED_NEEDS_REVIEW evidence remains at docs/reviews/product-version-management-foundation/01-analysis-review-preapproval.md.

## Historical Gate 2 evidence
The earlier AWAITING_HUMAN_REVIEW packet is retained byte-for-byte at docs/reviews/product-version-management-foundation/02-specs-review-preclarification.md (SHA-256 0be340fd72edbb0dda189f137ecadc804784621caec23b483ee0f2b9d5ef676d). It identified incomplete future Product Version grammar; that review finding remains historical, not relabeled as an earlier PASS. The current user supplied a bounded normative clarification, and only the Product Version requirement/scenarios changed.

The immediately preceding AWAITING_HUMAN_REVIEW packet is retained byte-for-byte at docs/reviews/product-version-management-foundation/02-specs-review-preapproval.md (SHA-256 26c8fbee8965196ca98c117204d407b44875a0b11df2ab797d7d7243157970c4). Its awaiting status and recommendation remain historical evidence; this packet records the later explicit approval without retroactively changing them.

## Delta Spec scope
- One declared new capability: product-release/identity; exact delta path: openspec/changes/product-version-management-foundation/specs/product-release/identity/spec.md
- 7 ADDED requirements and 21 scenarios; no modified, removed or renamed capabilities.
- The approved initial YUTA ALPHA / 0.1.0-alpha.1 / Foundation release, stage labels, package-version independence, direct consumers and capability lifecycle separation remain unchanged.

## Exact revised delta Spec content

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
```

## Bounded clarification for Gate 2 review
- Revised only `### Requirement: Validated and independent Product Version` and its scenarios.
- Canonical Product Version is the full string MAJOR.MINOR.PATCH or MAJOR.MINOR.PATCH-PRERELEASE. Core numeric identifiers are non-negative ASCII integers without leading zeroes except 0. Prerelease is one or more nonempty dot-separated ASCII alphanumeric/hyphen identifiers; purely numeric identifiers have the same leading-zero restriction.
- Canonical metadata excludes the presentation-only v prefix. Build metadata +... is intentionally outside this YUTA foundation contract; this does not characterize build metadata as invalid SemVer generally.
- Product Version prerelease tokens do not determine Product Maturity Stage; beta.1 does not select PRIVATE_BETA versus PUBLIC_BETA, and changing Product Version does not promote/demote stage.
- Scenarios now cover core/prerelease acceptance; leading-zero, missing-component and malformed-prerelease rejection; v-prefix and build-metadata rejection; package-version independence; and maturity-stage independence.

## Strict validation evidence
Command: `openspec validate product-version-management-foundation --type change --strict --json --no-interactive`
Actual result: exit 0; valid: true; issues: []; passed: 1; failed: 0. Structural OpenSpec validation only; no Product approval, implementation VERIFY or Browser QA is inferred.

## Changed assumptions and remaining questions
- Prior basic version-shape proposal is replaced by the current-user restricted SemVer-compatible subset above. No complete external SemVer contract, build metadata support or package-version synchronization is introduced.
- No unresolved requirement-level ambiguity was identified within this clarification. Gate 2 reviewer must still approve the exact revised requirements/scenarios; validation PASS alone is insufficient.
- UI_AFFECTING: YES and future Browser QA remain mandatory. No QA was performed at this stage.

## Artifact integrity
Tool/command: Get-FileHash -Algorithm SHA256 over exact file bytes, lowercase hexadecimal. Gate 1 reviewed path set was rechecked before creating this packet.

| Repository-relative path | SHA-256 |
| --- | --- |
| docs/reviews/product-version-management-foundation/01-analysis-review.md | fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564 |
| openspec/changes/product-version-management-foundation/specs/product-release/identity/spec.md | bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d |

## Approval decision and exact next action
The current user explicitly approved Gate 2 for this exact delta Spec SHA-256 and 7 requirements / 21 scenarios. Design is now authorized. This approval does not authorize Tasks, Technical Implementation Contract, Apply, implementation, VERIFY or Browser QA in the current turn. Reassess the Sensitive Design Gate against the actual Design before determining the next workflow action.
