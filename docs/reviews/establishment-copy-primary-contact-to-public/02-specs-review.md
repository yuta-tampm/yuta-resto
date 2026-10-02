# Gate 2 — Delta Specs Review

Change: `establishment-copy-primary-contact-to-public`

Gate: `2 — Delta Specs`

Review status: `APPROVED`

Created: `2026-08-30T16:49:43.6067990+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `NO`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-08-30T16:58:02.6641306+02:00`

## Approved Gate 1 reference

Gate 1 is recorded as `APPROVED` in `docs/reviews/establishment-copy-primary-contact-to-public/01-analysis-review.md` from an explicit current-user instruction. Integrity was recomputed before proceeding and the exact proposal and analysis hashes matched the approved packet.

| Gate 1 evidence                                                                   | SHA-256                                                            |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/establishment-copy-primary-contact-to-public/01-analysis-review.md` | `336d9b3e18dc2669064d1c9597d10f13e489196801d867a77da4c8f2d1535275` |
| `openspec/changes/establishment-copy-primary-contact-to-public/analysis.md`       | `cc46c4f9d3881f6fb930f88264f8a7c4021c0afe05a9b6dd48b899fbf3aaa0a2` |
| `openspec/changes/establishment-copy-primary-contact-to-public/proposal.md`       | `77fd805c12a72d659f118cd813bb8a197ff57cd6fb6e363449e74fd3048f7eb3` |

The packet hash was generated after recording approval. Hashes were generated with PowerShell `Get-FileHash -Algorithm SHA256 -LiteralPath <path>` and rendered in lowercase.

## Adoption provenance

The delta spec existed before Gate 1 approval and before this packet. It was read and strict-validated without modification. Existing `design.md` and `tasks.md` remain later artifacts outside this review packet; their presence does not bypass Gate 2 and this packet does not approve them.

- Repository revision at packet creation: `dff49c129fadbbeaaf67c041bcad962cbeec2516`
- OpenSpec root: nearest repository-local root
- OpenSpec schema resolved by status: `yuta-spec-driven`
- Delta spec path set: one file under capability `establishment-profile`

## Delta spec integrity hash

The hash covers the exact file bytes reviewed. It was generated with PowerShell `Get-FileHash -Algorithm SHA256 -LiteralPath <path>` and rendered in lowercase.

| Reviewed delta spec                                                                                 | SHA-256                                                            |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/establishment-copy-primary-contact-to-public/specs/establishment-profile/spec.md` | `2253f7791b9feef29534f363d8e16612f9a8ffb4e03888948f6795269add5939` |

## Exact delta spec

```text
## Purpose

Capability này xác định hành vi Establishment Profile cho phép editor sao chép có điều kiện thông tin liên hệ chính sang public contact mà vẫn giữ quyền kiểm soát lưu và các boundary hiện có.

## ADDED Requirements

### Requirement: Sao chép có điều kiện primary contact sang public contact

Khi editor được phép chỉnh sửa profile kích hoạt copy action rõ ràng, hệ thống SHALL xử lý độc lập từng cặp contact trong current form draft. Source `phone` không rỗng SHALL thay thế `publicPhone`, và source `email` không rỗng SHALL thay thế `publicEmail`. Nếu một source field rỗng hoặc `null`, hệ thống SHALL giữ nguyên public counterpart hiện có trong draft.

#### Scenario: Sao chép cả phone và email không rỗng

- **WHEN** current primary `phone` và `email` đều không rỗng và editor kích hoạt copy action
- **THEN** draft `publicPhone` SHALL bằng current primary `phone`
- **AND** draft `publicEmail` SHALL bằng current primary `email`

#### Scenario: Phone rỗng và email không rỗng

- **WHEN** current primary `phone` rỗng hoặc `null`, current primary `email` không rỗng và editor kích hoạt copy action
- **THEN** draft `publicPhone` SHALL giữ nguyên giá trị có trước action
- **AND** draft `publicEmail` SHALL bằng current primary `email`

#### Scenario: Phone không rỗng và email rỗng

- **WHEN** current primary `phone` không rỗng, current primary `email` rỗng hoặc `null` và editor kích hoạt copy action
- **THEN** draft `publicPhone` SHALL bằng current primary `phone`
- **AND** draft `publicEmail` SHALL giữ nguyên giá trị có trước action

#### Scenario: Cả hai source field đều rỗng

- **WHEN** current primary `phone` và `email` đều rỗng hoặc `null` và editor kích hoạt copy action
- **THEN** draft `publicPhone` và `publicEmail` SHALL cùng giữ nguyên giá trị có trước action

#### Scenario: Chỉ source không rỗng được phép ghi đè public value hiện có

- **WHEN** draft có `publicPhone` và `publicEmail` không rỗng, current primary `phone` không rỗng, current primary `email` rỗng hoặc `null`, và editor kích hoạt copy action
- **THEN** current primary `phone` SHALL ghi đè draft `publicPhone`
- **AND** draft `publicEmail` SHALL giữ nguyên giá trị có trước action

### Requirement: Copy action chỉ thay đổi draft và giữ explicit save

Copy action SHALL chỉ cập nhật current form draft và SHALL NOT tự động persist thay đổi. Existing explicit save flow SHALL vẫn là thao tác bắt buộc để persist draft, và existing profile validation SHALL tiếp tục áp dụng khi save.

#### Scenario: Copy tạo unsaved draft nhưng không tự persist

- **WHEN** ít nhất một source contact không rỗng làm thay đổi public counterpart sau copy action
- **THEN** form SHALL chứa thay đổi chưa lưu tương ứng
- **AND** persisted Establishment Profile SHALL giữ nguyên cho đến khi editor kích hoạt explicit save thành công

#### Scenario: Validation hiện có vẫn áp dụng khi save

- **WHEN** editor kích hoạt explicit save sau copy action
- **THEN** hệ thống SHALL áp dụng existing Establishment Profile validation trước khi persist draft
- **AND** copy action SHALL NOT bypass validation đó

### Requirement: Public contact không đồng bộ tiếp diễn với primary contact

Copy action SHALL là một one-time draft operation và SHALL NOT tạo ongoing synchronization giữa primary contact và public contact. Sau action, public fields SHALL tiếp tục chỉnh sửa độc lập theo quyền profile hiện có.

#### Scenario: Thay đổi primary contact sau copy không tự cập nhật public contact

- **WHEN** editor đã kích hoạt copy action rồi thay đổi primary `phone` hoặc `email`
- **THEN** public counterpart tương ứng SHALL giữ nguyên giá trị draft được thiết lập trước thay đổi primary đó

#### Scenario: Editor chỉnh sửa public contact độc lập sau copy

- **WHEN** editor thay đổi `publicPhone` hoặc `publicEmail` sau copy action
- **THEN** hệ thống SHALL giữ thay đổi public contact độc lập đó trong current form draft
- **AND** primary counterpart SHALL không bị thay đổi bởi thao tác này

### Requirement: Copy action giữ nguyên permission và capability boundaries

Hệ thống SHALL chỉ cung cấp copy action có khả năng mutate draft cho user có quyền edit/manage Establishment Profile hiện có. Hệ thống SHALL NOT tạo permission mới, bypass tenant hoặc server authorization khi save, thay đổi visibility flags, tạo field mới, chuyển canonical ownership, hoặc ảnh hưởng Restaurant Knowledge, Booking, POS, Display hay company/legal data.

#### Scenario: Read-only user không thể kích hoạt mutating copy behavior

- **WHEN** user chỉ có quyền read Establishment Profile
- **THEN** hệ thống SHALL NOT cung cấp cho user đó copy action có khả năng mutate form draft

#### Scenario: Copy giữ nguyên visibility và dữ liệu ngoài bounded contact draft

- **WHEN** authorized editor kích hoạt copy action
- **THEN** hệ thống SHALL chỉ áp dụng các thay đổi contact draft được quy định cho `publicPhone` và `publicEmail`
- **AND** visibility flags cùng dữ liệu thuộc Restaurant Knowledge, Booking, POS, Display và company/legal scope SHALL giữ nguyên

#### Scenario: Save sau copy vẫn tuân thủ authorization hiện có

- **WHEN** một draft đã qua copy action được gửi qua explicit save flow
- **THEN** hệ thống SHALL áp dụng existing trusted tenant scope và server authorization của Establishment Profile
- **AND** copy action SHALL NOT cấp thêm quyền persist cho user
```

## Requirements and scenarios summary

The delta adds four requirements with twelve scenarios:

1. Conditional field-by-field copy covers both populated sources, either source empty or `null`, both sources empty, and overwrite protection for the empty counterpart.
2. Draft-only behavior preserves explicit save and existing validation.
3. One-time behavior prevents ongoing synchronization and preserves independent public-contact editing.
4. Existing permissions and capability boundaries keep read-only users from mutating the draft and preserve server authorization, visibility, ownership, and unrelated modules.

The capability path `establishment-profile` matches the proposal and the approved Gate 1 analysis.

## Strict validation

Command:

```text
pnpm exec openspec validate establishment-copy-primary-contact-to-public --type change --strict --json --no-interactive
```

Exit code: `0`

Exact result:

```json
{
  "items": [
    {
      "id": "establishment-copy-primary-contact-to-public",
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

Result: `PASS — 1 change passed, 0 failed, 0 issues`.

## Changed assumptions since analysis

None. The delta spec preserves the approved analysis semantics:

- each non-empty source independently replaces its public counterpart;
- each empty or `null` source leaves its public counterpart unchanged;
- copy changes only the current draft;
- persistence still requires explicit save and existing validation/authorization;
- no continuing synchronization is created; and
- no permission, ownership, visibility, lifecycle, runtime, data, or cross-module boundary changes are introduced.

## Remaining ambiguity and review items

- No requirement-level ambiguity or authority conflict was identified.
- Presentation details and implementation structure remain design concerns, not spec ambiguity.
- Environment remains `UNVERIFIED` and Production Readiness remains `NOT_READY`; Gate 2 does not change lifecycle values.
- The existing design and tasks have not been reviewed by this packet and cannot bypass Gate 2.

## Explicit reviewer questions

1. Does the reviewer approve the exact delta spec identified by the hash above as consistent with the approved Gate 1 proposal and analysis?
2. Does the reviewer confirm the requirements fully preserve one-time draft-only behavior, explicit save, existing authorization, and field-by-field empty-source semantics?
3. May the workflow proceed on its next run to the existing design and tasks without regenerating either artifact?

## Conclusion and recommendation

Strict validation passes and no assumption has changed since the approved analysis.

Recommendation: `APPROVE_GATE_2_AND_CONTINUE_WITH_EXISTING_DESIGN`.

This packet stops at Gate 2. No approval is inferred from its creation. A current-user instruction explicitly approving this exact Gate 2 packet is required before the workflow may use the existing design and continue toward tasks/apply.
