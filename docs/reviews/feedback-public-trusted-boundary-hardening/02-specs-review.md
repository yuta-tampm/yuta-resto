Change: feedback-public-trusted-boundary-hardening
Gate: Gate 2 — Requirements Review
Review status: APPROVED
Created: 2026-09-05T10:34:05.3085407Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-05T10:40:19.5258094Z

# Gate 2 Review — Public Feedback Trusted Boundary Requirements

## Approval Record

Current user approved the three requirements and thirteen scenarios exactly as written and authorized progression to Design only. The approved Design constraints are:

1. chọn smallest correct enforcement points; không mặc định schema migration, domain-management workflow, shared transport contract change hoặc centralized environment framework;
2. không suy ra `x-forwarded-for`, `x-real-ip`, proxy ordering hoặc hosting behavior từ convention;
3. xác định concrete repository/deployment/runtime evidence cho trusted client-IP source và proxy/origin boundary;
4. nếu exact provenance chưa đủ, ghi `BLOCKED_BEFORE_APPLY` và không deferred thành post-implementation TODO;
5. raw client IP không được đi vào Direct Customer Feedback persistence; logging/telemetry path do change chạm tới cũng không được làm yếu invariant này;
6. giữ toàn bộ rate-limit atomicity, idempotency, duplicate handling, contact PII, retention, settings, UI/accessibility, external URLs, QR, analytics và social connectors ngoài scope.

Approval này không authorize Tasks, Apply, sync, archive, deployment hoặc lifecycle promotion. Sensitive Design review vẫn bắt buộc.

## Approved Gate 1 Reference

- Approved packet: `docs/reviews/feedback-public-trusted-boundary-hardening/01-analysis-review.md`
- Review status: `APPROVED`
- Approval source: explicit current-user instruction
- Approved: `2026-09-05T10:32:35.4292573Z`
- Gate 1 packet SHA-256: `545aa08084bc8607d723761ebc4eed3ff3b1534fe8d955fd8afd68cd558f438c`

Gate 1 reviewed artifact hashes remain intact:

| Repository-relative path                                                  | SHA-256                                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/feedback-public-trusted-boundary-hardening/analysis.md` | `3d41d7ad9664a3468d6956fccec4a486a779e87b7debad2d63776d2a2573c2ba` |
| `openspec/changes/feedback-public-trusted-boundary-hardening/proposal.md` | `89d08d9ddf5ea11af8c7eb5b6530c27e4b359167150bc45641d5750d8c42b9c1` |

## Delta Spec Scope

Proposal khai báo đúng một new capability và Gate 2 có đúng một delta spec:

- `public-feedback/trusted-boundary`
- `openspec/changes/feedback-public-trusted-boundary-hardening/specs/public-feedback/trusted-boundary/spec.md`

Không có modified, removed hoặc renamed capability. Không có Design, Tasks hoặc implementation artifact được tạo.

## Exact Delta Spec Content

```markdown
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
```

## Requirements and Scenarios Summary

Delta có ba requirements và mười ba scenarios:

1. `Verified public tenant boundary` — verified-active happy path và denial cho unverified, inactive, inactive parent, mismatched slug, malformed/unknown hostname.
2. `Production-required abuse-protection configuration` — valid salt, missing salt và salt ngắn hơn 32 ký tự; mọi invalid production configuration đều ngăn persistence và không phụ thuộc client-address presence.
3. `Trusted production client identity` — trusted provenance happy path, no established source, missing address và untrusted header denial; raw IP không được persist.

Specs không chọn schema/migration, domain-management workflow, shared contract, environment variable mới, proxy topology hoặc header name. Workflow stop-before-Apply khi provenance không được xác lập vẫn thuộc approved Gate 1 và Sensitive Design review evidence; nó không được biến thành product runtime requirement trong delta spec.

## Strict Validation

Command:

```text
openspec validate feedback-public-trusted-boundary-hardening --type change --strict --json
```

Exact result:

```json
{
  "items": [
    {
      "id": "feedback-public-trusted-boundary-hardening",
      "type": "change",
      "valid": true,
      "issues": [],
      "durationMs": 9
    }
  ],
  "summary": {
    "totals": {
      "items": 1,
      "passed": 1,
      "failed": 0
    },
    "byType": {
      "change": {
        "items": 1,
        "passed": 1,
        "failed": 0
      }
    }
  },
  "version": "1.0",
  "root": {
    "path": "D:\\working\\yuta\\yuta-resto",
    "source": "nearest"
  }
}
```

Validation result: `PASS` — one change passed, zero issues.

## Changed Assumptions Since Analysis

Không có assumption nào được mở rộng hoặc thay đổi. Gate 1 approval xác nhận:

- active + verified hostname là required trusted public boundary;
- invalid production salt/configuration hoặc missing trusted identity không được tạo silent bypass;
- không mặc định schema migration, domain-management workflow hay shared contract change;
- exact trusted proxy/header provenance vẫn là environment requirement;
- không có connector/external-review/general-readiness work trong scope.

## Gate 2 Validation Evidence

| Command                                                                                      | Result                                                                                                 |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `pnpm exec prettier --check <Gate 1 artifacts> <delta spec> <Gate 1 packet> <Gate 2 packet>` | PASS                                                                                                   |
| `pnpm docs:check`                                                                            | PASS — 36 current documents                                                                            |
| `pnpm architecture:check`                                                                    | PASS                                                                                                   |
| `pnpm -r --if-present typecheck`                                                             | PASS — 15 of 16 workspace projects with scripts completed, including feedback-web, tenant and db-cloud |

Không chạy behavior tests hoặc builds vì lượt này chỉ tạo/review Specs và chưa có implementation change.

## Remaining Ambiguity and Stop Condition

`NEEDS REVIEW`: exact trusted proxy/header provenance vẫn chưa được repository/environment evidence xác lập. Specs cố ý không chọn `x-forwarded-for`, `x-real-ip`, thứ tự ưu tiên, proxy chain hoặc hosting behavior.

Điểm này không ngăn review requirements nhưng bắt buộc Design và Sensitive Design Gate. Nếu Design review không chứng minh được bounded environment contract và exact trusted client-IP source, workflow phải dừng trước Apply theo approved Gate 1.

`UNKNOWN`: current production deployment/configuration state vẫn chưa được chứng minh và không được promote bởi Gate 2.

## Artifact Integrity

Hash command/tool used:

```powershell
$paths = @(
  'docs/reviews/feedback-public-trusted-boundary-hardening/01-analysis-review.md',
  'openspec/changes/feedback-public-trusted-boundary-hardening/specs/public-feedback/trusted-boundary/spec.md'
) | Sort-Object
foreach ($path in $paths) {
  $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLowerInvariant()
  "$path`t$hash"
}
```

| Repository-relative path                                                                                     | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/feedback-public-trusted-boundary-hardening/01-analysis-review.md`                              | `545aa08084bc8607d723761ebc4eed3ff3b1534fe8d955fd8afd68cd558f438c` |
| `openspec/changes/feedback-public-trusted-boundary-hardening/specs/public-feedback/trusted-boundary/spec.md` | `f42e82be1b20031f7d48b5b48a59137f3d33e0b56bd3b5fb03a22c102c6c631c` |

## Recommendation

`APPROVE_GATE_2_TO_AUTHORIZE_DESIGN_ONLY`

Gate 2 approval chỉ cho phép tạo Design. Vì change là security-sensitive và cross-module, Design sau đó phải đi qua `02b-design-review.md`; approval Specs không authorize Tasks hoặc Apply.

## Required Next Approval

Để tiếp tục tới Design, current user phải gửi explicit approval gắn với đúng change và Gate 2 hiện tại:

```text
$yuta-run-change feedback-public-trusted-boundary-hardening
Specs review approved. Continue to Design.
```
