Change: platform-admin-formalites-template-authority-foundation
Gate: 2 — Specs Review
Review status: APPROVED
Created: 2026-09-06T21:06:13.4167548+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — authorization/security, runtime boundary và cross-module durable boundary
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-06T21:12:02.2766210+02:00

# Gate 2 — Specs Review

## Approved Gate 1 Reference

- Packet: `docs/reviews/platform-admin-formalites-template-authority-foundation/01-analysis-review.md`
- Gate 1 status: `APPROVED`
- Approval source: explicit current-user instruction ngày 2026-09-06.
- Gate 1 packet SHA-256: `1b613c4898cfbbb0e0ac139bc51c772ff85268b598e971863e95962a56bdb53c`
- Approved Proposal SHA-256: `ef4ce308839aa02bf15f89254bce366a65fe115c35eeec04da367ffcfc7efa91`
- Approved Analysis SHA-256: `6f39ed1cb07ccc2b1db66c7cad920d97c01e4183d23bcbad5783c419dc3ec73b`

Gate 1 artifact path-set và hashes đã được recompute trước khi Specs được tạo và khớp chính xác với packet đã duyệt.

## Delta Spec Path and Hash

| Path                                                                                                                                                     | SHA-256                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/specs/authorization/platform-admin-formalites-template-administration/spec.md` | `c2ff7c618b2d050f0fa259f2e01d226870446638c1138a9cf2a7cd0a6bb45dfb` |

Hash command/tool:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <path>
```

Hash được tính trên exact file bytes và ghi dưới dạng lowercase hexadecimal.

## Exact Delta Spec Content

```markdown
## Purpose

Capability này định nghĩa authorization contract fail-closed cho việc quản trị nội bộ GLOBAL YUTA Formalités template resources qua Platform Admin mà không tạo tenant bypass, legal authority hoặc template lifecycle implementation.

## ADDED Requirements

### Requirement: Năm system operations là các quyền độc lập

Hệ thống SHALL biểu diễn đúng năm system authorization operations độc lập cho capability này:

- `formalites.template.read` tương ứng `TEMPLATE_READ`;
- `formalites.template.draft.manage` tương ứng `TEMPLATE_MANAGE_DRAFT`;
- `formalites.template.review.submit` tương ứng `TEMPLATE_SUBMIT_FOR_REVIEW`;
- `formalites.template.publish` tương ứng `TEMPLATE_PUBLISH`;
- `formalites.template.retire` tương ứng `TEMPLATE_RETIRE`.

Grant một operation SHALL NOT tự grant bất kỳ operation nào khác và hệ thống SHALL NOT áp dụng implicit inheritance giữa năm operations.

#### Scenario: Mỗi operation được đánh giá riêng

- **WHEN** một trusted system caller yêu cầu một trong năm operations
- **THEN** hệ thống SHALL đánh giá đúng operation identifier được yêu cầu
- **AND** SHALL NOT thay thế bằng operation khác hoặc suy ra grant từ operation khác

#### Scenario: Operation ngoài allowlist bị từ chối

- **WHEN** system authorization nhận một operation không thuộc đúng năm identifiers đã duyệt
- **THEN** hệ thống SHALL deny fail closed
- **AND** SHALL NOT coi role hoặc tên Platform Admin là blanket authority

### Requirement: Initial grant matrix chỉ cấp năm operations cho YUTA_ADMIN

Hệ thống SHALL grant cả năm approved operations cho authenticated active YUTA user có exact system role `YUTA_ADMIN`. Hệ thống SHALL grant không operation nào trong capability này cho `YUTA_SUPPORT`, user không có system role hoặc bất kỳ restaurant membership role nào.

Grant matrix SHALL là explicit per-operation mapping và SHALL NOT thiết lập quy tắc `YUTA_ADMIN = all platform permissions`.

#### Scenario: YUTA_ADMIN được phép thực hiện từng operation đã duyệt

- **WHEN** authenticated active YUTA user có exact system role `YUTA_ADMIN` yêu cầu một trong năm approved operations
- **THEN** system authorization SHALL allow operation đó
- **AND** kết quả SHALL chỉ xác nhận authority cho exact requested operation

#### Scenario: YUTA_SUPPORT bị từ chối mọi approved operation

- **WHEN** authenticated active YUTA user có exact system role `YUTA_SUPPORT` yêu cầu bất kỳ operation nào trong năm approved operations
- **THEN** system authorization SHALL deny
- **AND** restaurant membership nếu có SHALL NOT thay đổi kết quả deny

#### Scenario: Restaurant role không tạo global authority

- **WHEN** một user chỉ có `OWNER`, `MANAGER` hoặc `STAFF` membership authority yêu cầu một approved system operation
- **THEN** system authorization SHALL deny
- **AND** SHALL NOT chuyển tenant role thành system role hoặc operation grant

### Requirement: Authorization sử dụng trusted system-only context

Hệ thống SHALL chỉ authorize khi trusted server state xác lập đồng thời authenticated active YUTA user, accepted system role và exact requested operation. Successful authorization SHALL tạo một trusted system context bị bind với user, system role, exact operation và GLOBAL YUTA Formalités template scope.

Context này SHALL NOT yêu cầu hoặc chứa authority lấy từ organization, establishment, tenant membership, tenant entitlement hoặc tenant permission.

#### Scenario: YUTA_ADMIN không có restaurant membership vẫn được đánh giá

- **WHEN** authenticated active `YUTA_ADMIN` không có active restaurant membership yêu cầu một approved operation
- **THEN** system authorization SHALL evaluate và allow theo explicit system-operation grant
- **AND** SHALL NOT yêu cầu organization hoặc establishment selection

#### Scenario: Browser-supplied authority không được tin cậy

- **WHEN** browser hoặc untrusted input cung cấp system role, operation grant, organization, establishment, membership, entitlement hoặc permission
- **THEN** hệ thống SHALL NOT dùng các giá trị đó làm authorization proof
- **AND** chỉ trusted server-derived user, stored system role và exact server-requested operation mới có thể authorize

#### Scenario: Public và service actor không tạo system user context

- **WHEN** public actor hoặc service actor không resolve thành authenticated active YUTA user yêu cầu một approved operation
- **THEN** system authorization SHALL deny
- **AND** SHALL NOT tạo trusted system context

### Requirement: Mọi prerequisite thiếu hoặc không hợp lệ đều fail closed

Hệ thống SHALL deny khi authenticated user vắng mặt, internal user không tồn tại, user bị disabled, system role vắng mặt hoặc không được grant, requested operation vắng mặt hoặc không thuộc allowlist, hoặc trusted system context không thể được xác lập đầy đủ.

Denial SHALL không trả về partial authorized context và SHALL không fallback sang tenant authorization, restaurant membership hoặc một role khác.

#### Scenario: Missing user bị từ chối

- **WHEN** không có authenticated YUTA user hợp lệ
- **THEN** system authorization SHALL deny
- **AND** SHALL không authorize bất kỳ operation nào

#### Scenario: Disabled user bị từ chối

- **WHEN** resolved YUTA user có status disabled dù có stored `YUTA_ADMIN` role
- **THEN** system authorization SHALL deny
- **AND** SHALL không tạo trusted system context

#### Scenario: Missing hoặc ungranted role bị từ chối

- **WHEN** authenticated active user không có system role hoặc role không được grant exact requested operation
- **THEN** system authorization SHALL deny
- **AND** SHALL không fallback sang membership hoặc operation khác

### Requirement: Global system authorization không bypass tenant resources

Authority cho một approved global template operation SHALL chỉ có scope GLOBAL YUTA Formalités templates. Nó SHALL NOT grant quyền đọc hoặc mutate organization-owned, establishment-owned hoặc tenant-scoped resource và SHALL NOT thay đổi evaluation của existing tenant permissions.

Existing tenant-scoped `formalites.read` và `formalites.manage` SHALL tiếp tục yêu cầu verified active restaurant context theo normative Formalités authorization capability hiện hữu.

#### Scenario: Global allow không cấp tenant Formalités access

- **WHEN** `YUTA_ADMIN` được allow một global template operation nhưng thiếu matching active restaurant membership
- **THEN** user SHALL vẫn bị deny khi yêu cầu tenant-scoped `formalites.read` hoặc `formalites.manage`
- **AND** global system context SHALL NOT được dùng làm tenant context

#### Scenario: Tenant membership không cấp global operation

- **WHEN** OWNER, MANAGER hoặc STAFF có valid tenant context nhưng không có granted system operation yêu cầu global template administration
- **THEN** system authorization SHALL deny
- **AND** tenant permission SHALL NOT được dùng làm global authorization proof

#### Scenario: System và tenant evaluations không merge authority

- **WHEN** một user đồng thời có system role và restaurant membership
- **THEN** global operation SHALL chỉ dùng system-operation grant
- **AND** tenant resource access SHALL chỉ dùng trusted tenant authorization tương ứng
- **AND** hệ thống SHALL NOT hợp nhất hai context để mở rộng authority

### Requirement: Authorization security audit không trở thành legal evidence

Mỗi denied authorization attempt SHALL tạo security audit signal với requested operation, denial reason và actor identifier khi actor đã được resolve. Successful authorization SHALL cung cấp actor identifier, exact operation và global scope cho downstream security audit attribution.

Authorization audit SHALL NOT chứa hoặc đại diện cho legal opinion, legal-review evidence, template content, template qualification, publication completion hoặc retention decision.

#### Scenario: Denial tạo security signal tối thiểu

- **WHEN** system authorization deny một approved hoặc unknown operation request
- **THEN** hệ thống SHALL tạo security audit signal chứa operation được yêu cầu và denial reason
- **AND** SHALL chỉ chứa actor identifier khi trusted actor đã được resolve

#### Scenario: Successful context hỗ trợ attribution

- **WHEN** system authorization allow một approved operation
- **THEN** authorized result SHALL giữ actor identifier, exact operation và GLOBAL YUTA Formalités template scope cho downstream attribution
- **AND** SHALL NOT tuyên bố rằng template action hoặc legal review đã hoàn tất

### Requirement: Authorization foundation không thực thi template lifecycle hoặc legal review

Allow một operation SHALL chỉ xác nhận quyền gọi một future owning service cho exact operation. Capability này SHALL NOT tự tạo, đọc từ persistence, sửa, submit, qualify, publish hoặc retire template resource và SHALL NOT tạo general-purpose Platform Admin authority.

`YUTA_ADMIN` SHALL NOT được xem là legal reviewer, SHALL NOT tạo legal opinion qua authorization result và SHALL NOT biến security audit thành legal-review evidence.

#### Scenario: Publish authorization không phải legal approval

- **WHEN** `YUTA_ADMIN` được allow `formalites.template.publish`
- **THEN** authorization result SHALL NOT được coi là legal opinion, qualification hoặc legal-review evidence
- **AND** SHALL NOT tự publish template

#### Scenario: Lifecycle operation không có resource side effect

- **WHEN** system authorization allow draft management, review submission hoặc retirement operation
- **THEN** authorization foundation SHALL không tạo hoặc mutate template, version, evidence, file hoặc tenant resource
- **AND** future domain service SHALL vẫn chịu trách nhiệm cho mọi prerequisite và side effect ngoài capability này

#### Scenario: Capability không mở general Platform Admin

- **WHEN** `YUTA_ADMIN` yêu cầu một Platform Admin operation ngoài đúng năm Formalités template operations
- **THEN** capability này SHALL không cung cấp grant
- **AND** SHALL không suy ra authority từ việc user có `YUTA_ADMIN` role
```

## Requirements and Scenarios Summary

Delta thêm bảy requirements với 19 scenarios:

1. Năm operation identifiers độc lập, không inheritance và unknown operation fail closed.
2. Initial grant matrix: `YUTA_ADMIN` có đúng năm grants; `YUTA_SUPPORT` và restaurant roles có none.
3. Trusted system-only context không phụ thuộc organization/establishment membership và không tin browser authority.
4. Missing/disabled/ungranted prerequisites đều deny, không partial context hoặc fallback.
5. Global template authority và tenant authorization không merge hoặc bypass lẫn nhau.
6. Authorization security audit chỉ mang attribution/denial signal, không legal evidence.
7. Authorization allow không thực thi template lifecycle, legal review hoặc general Platform Admin behavior.

## Strict Validation

Command:

```text
pnpm exec openspec validate "platform-admin-formalites-template-authority-foundation" --strict --json
```

Exact result summary:

```json
{
  "items": [
    {
      "id": "platform-admin-formalites-template-authority-foundation",
      "type": "change",
      "valid": true,
      "issues": [],
      "durationMs": 8
    }
  ],
  "summary": {
    "totals": {
      "items": 1,
      "passed": 1,
      "failed": 0
    }
  }
}
```

Result: `PASS` — one change passed, zero failed, zero issues.

Formatting:

```text
pnpm exec prettier --check "openspec/changes/platform-admin-formalites-template-authority-foundation/specs/authorization/platform-admin-formalites-template-administration/spec.md"
PASS — All matched files use Prettier code style.
```

## Changed Assumptions Since Analysis

Không có Product, authority, scope hoặc ownership assumption nào thay đổi.

Specs resolves concrete identifiers theo dotted lowercase capability convention và Formalités semantic ownership:

- `formalites.template.read`
- `formalites.template.draft.manage`
- `formalites.template.review.submit`
- `formalites.template.publish`
- `formalites.template.retire`

Việc chọn identifiers này không chuyển semantic ownership sang Platform Admin và không mở thêm operation.

## Remaining Ambiguity

Không có requirement-level ambiguity.

Các chi tiết sau được giữ cho Design đúng chỉ thị hiện tại:

- concrete package placement;
- trusted context type/representation;
- operation-to-role mapping representation;
- security logger/audit signal interface và composition;
- test seams và future runtime integration boundary.

Design không được mở template persistence, Platform Admin UI/runtime implementation hoặc tenant-session modification. Nếu system-only authentication buộc phải thay đổi tenant-bound Backoffice session architecture, Design phải STOP và quay lại Control Tower.

## Scope Preservation

Delta spec không thêm:

- general-purpose Platform Admin;
- template schema, persistence, content hoặc lifecycle side effect;
- legal-review evidence store hoặc legal reviewer role;
- qualification, generation, signature hoặc Documents handoff;
- tenant permission, membership grant hoặc system-role bypass;
- production enablement.

Existing `authorization/formalites` main spec không bị sửa.

## Recommendation

`APPROVE_GATE_2_TO_PROCEED_TO_MANDATORY_SENSITIVE_DESIGN`

Exact approval needed next:

```text
$yuta-run-change platform-admin-formalites-template-authority-foundation
Specs review approved. Continue to Design and Sensitive Design Gate only.
```
