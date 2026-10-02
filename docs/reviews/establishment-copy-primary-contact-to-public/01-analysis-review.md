# Gate 1 — Analysis Review

Change: `establishment-copy-primary-contact-to-public`

Gate: `1 — Proposal + Analysis`

Review status: `APPROVED`

Created: `2026-08-30T16:12:53.5610247+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `NO`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-08-30T16:49:23.6734150+02:00`

## Adoption provenance

This packet adopts an existing in-flight change. At adoption time, `proposal.md`, `analysis.md`, the delta spec, `design.md`, and `tasks.md` already existed, while no YUTA review packet existed. Gate 1 is therefore the earliest missing human review gate.

The existing later artifacts are outside this review packet. Their presence does not bypass Gate 1 and this packet does not approve them. No existing OpenSpec artifact was regenerated or modified.

- Repository revision at packet creation: `dff49c129fadbbeaaf67c041bcad962cbeec2516`
- OpenSpec planning status: all configured artifacts present
- Review packets present before adoption: none

## Integrity hashes

Hashes cover the exact bytes reviewed. They were generated with PowerShell `Get-FileHash -Algorithm SHA256 -LiteralPath <path>` and rendered in lowercase.

| Reviewed artifact                                                           | SHA-256                                                            |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/establishment-copy-primary-contact-to-public/analysis.md` | `cc46c4f9d3881f6fb930f88264f8a7c4021c0afe05a9b6dd48b899fbf3aaa0a2` |
| `openspec/changes/establishment-copy-primary-contact-to-public/proposal.md` | `77fd805c12a72d659f118cd813bb8a197ff57cd6fb6e363449e74fd3048f7eb3` |

## Request and bounded change summary

The request is to adopt this existing in-flight change without rewriting or regenerating any existing OpenSpec artifact, start from the earliest missing human review gate, and stop there.

The bounded proposed behavior adds an explicit, one-time draft action to the existing Establishment Profile form. A non-empty current primary phone replaces the draft public phone, and a non-empty current primary email replaces the draft public email. An empty or `null` source leaves its corresponding public value unchanged. The action does not persist automatically and creates no continuing synchronization.

## Exact proposal

```text
## Why

Khi số điện thoại và email công khai giống thông tin liên hệ chính, người quản lý hiện phải nhập lại cùng dữ liệu vào hai trường riêng. Một hành động sao chép rõ ràng sẽ giảm thao tác lặp lại mà vẫn giữ nguyên quyền kiểm soát và quy trình lưu hiện tại.

## What Changes

- Thêm một hành động UI rõ ràng trong form Establishment Profile để sao chép có điều kiện các giá trị contact chính hiện tại sang public contact tương ứng:
  - `phone` hiện tại không rỗng sẽ thay thế `publicPhone`;
  - `email` hiện tại không rỗng sẽ thay thế `publicEmail`;
  - nếu một source field rỗng hoặc `null`, public field tương ứng hiện có được giữ nguyên.
- Hành động chỉ cập nhật các trường công khai trong trạng thái form; người dùng vẫn phải lưu rõ ràng qua quy trình hiện tại để persist thay đổi.
- Việc sao chép là thao tác một lần theo yêu cầu, không tạo liên kết hoặc đồng bộ tiếp diễn giữa hai bộ trường.

## Capabilities

### New Capabilities

- `establishment-profile`: Các yêu cầu hành vi chuẩn hóa cho Establishment Profile hiện có, bắt đầu với thao tác sao chép thông tin liên hệ chính sang thông tin liên hệ công khai.

### Modified Capabilities

- Không có; hiện chưa có main spec nào dưới `openspec/specs/**` để sửa đổi.

## Impact

- Ảnh hưởng ở mức cao tới phần contact của trang/form `/etablissement/informations-generales`, trạng thái form và validation hiện có.
- Cần bổ sung kiểm thử hành vi sao chép và bảo toàn trạng thái chỉnh sửa/lưu hiện tại.
- Không cần field, persistence shape, API, provider hoặc external dependency mới.

## Non-goals

- Không tạo field cơ sở dữ liệu mới hoặc thay canonical data owner.
- Không thay đổi permissions hoặc trusted tenant/authorization boundary.
- Không tự động đồng bộ public contact khi primary contact thay đổi sau thao tác sao chép.
- Không thay đổi visibility rules.
- Không thay đổi company/legal data.
- Không thuộc hoặc thay đổi Restaurant Knowledge.
- Không thêm provider hoặc external dependency.
```

## Exact analysis

```text
# Change Analysis

## Scope and Change Type

Change này là một behavior change có ảnh hưởng UI, được giới hạn trong capability Establishment Profile hiện có trên route `/etablissement/informations-generales`. Một action rõ ràng sẽ sao chép từng source field không rỗng trong current form draft sang public field tương ứng: `phone` thay thế `publicPhone` và `email` thay thế `publicEmail`. Nếu một source field rỗng hoặc `null`, public field tương ứng hiện có được giữ nguyên. Đây không phải refactor, không phải thay đổi data shape, ownership, permissions, security boundary hoặc external dependency.

Action chỉ thay đổi draft của form. Persistence vẫn xảy ra qua thao tác lưu rõ ràng hiện có, và hai bộ contact không được đồng bộ tự động sau lần sao chép.

## Sources Consulted

### Product, authority và lifecycle

- [Establishment Product Knowledge](../../../docs/features/establishment/README.md)
- [Informations générales page Product Knowledge](../../../docs/features/establishment/general-information/README.md)
- [Module Registry](../../../docs/MODULE_REGISTRY.md)
- [Authority Model](../../../docs/AUTHORITY_MODEL.md)
- [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md)
- [OpenSpec Normativity Policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
- [ADR-006 — Cloud Establishment Profile Context](../../../docs/decisions/ADR-006-cloud-establishment-profile-context.md)
- [ADR-007 — Composed General Information and Restaurant Knowledge](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)

### UI authority

- [Current page pack](../../../docs/ui/pages/establishment-general-information/README.md)
- [Product Scope](../../../docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md)
- [Data and Interaction Spec](../../../docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md)

### Implemented-state evidence

- [Route page](../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx) và [server action](../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts)
- [Form](../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx), [primary-contact section](../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/coordinates-section.tsx), [public-contact section](../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx) và [form model](../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts)
- [Establishment Profile contract](../../../packages/contracts/src/establishment-profile/index.ts)
- [Cloud schema](../../../packages/db-cloud/src/schema/tenancy.ts) và [profile repository](../../../packages/db-cloud/src/establishment-profile-repository.ts)
- [Form-model tests](../../../apps/backoffice/test/general-information-model.test.ts), [permission tests](../../../apps/backoffice/test/establishment-profile-permissions.test.ts) và [cloud schema integration tests](../../../packages/db-cloud/test/schema.integration.test.ts)

## Authority and Product Decision

ADR-006 cùng Establishment Product Knowledge và page-level Product Knowledge xác lập Establishment Profile là capability `APPROVED`, gồm primary phone/email và các public contact được mô hình hóa riêng. ADR-007 giữ nguyên boundary này và tách Restaurant Knowledge thành capability khác.

Product proposal hiện tại nằm hoàn toàn trong boundary đã được phê duyệt: nó chỉ bổ sung convenience behavior cho các field đã có. Nó không chuyển ownership, không mở rộng permission, không đổi visibility hoặc company/legal scope và không sử dụng Restaurant Knowledge. Change artifact này vẫn là đề xuất non-normative; review gate hiện tại không tự phê duyệt proposal hay nâng lifecycle.

## Current Implemented State

Repository hiện implement:

- Primary contact dùng chính xác `phone` và `email`; public contact dùng `publicPhone` và `publicEmail`.
- Cả bốn field đều nullable. Phone có giới hạn 30 ký tự; email được trim, kiểm tra email hợp lệ và giới hạn 254 ký tự. Primary và public counterpart có cùng kiểu/validation tương ứng.
- `GeneralInformationForm` giữ một client-side draft, đánh dấu dirty bằng cách so sánh draft với profile ban đầu và chỉ persist qua submit rõ ràng.
- Server action parse toàn bộ input bằng `establishmentProfileInputSchema`, yêu cầu `establishment.profile.manage`, rồi gọi repository với trusted `organizationId` và `establishmentId`.
- `OWNER` và `MANAGER` có quyền manage; `STAFF` chỉ đọc. Form chỉ hiển thị save control khi có quyền edit.
- Schema đã có đủ bốn cột contact; repository đọc và cập nhật theo cả organization và establishment scope.

Repository chưa implement:

- Không tìm thấy action hoặc behavior copy/same-as-primary tương đương trong route, form, contact sections hoặc tests liên quan.
- Tests hiện có kiểm tra model dẫn xuất, permission matrix và persistence/tenant scope, nhưng chưa kiểm tra thao tác copy, dirty-state sau copy hoặc việc action không khả dụng ở read-only state.

Environment và production behavior chưa được xác minh trong analysis này; code/tests là repository evidence, không phải deployment evidence.

## Affected Boundaries

- Runtime owner: giữ nguyên `apps/backoffice`.
- Data owner: giữ nguyên `packages/db-cloud`, bảng `establishments`.
- Persistence shape: không bị ảnh hưởng; các field nguồn và đích đã tồn tại với validation tương thích.
- Tenancy/auth/permissions: giữ nguyên trusted server-derived organization, establishment, membership và `establishment.profile.manage`. Copy action không được persist trực tiếp hoặc bypass server action/save validation.
- Public/local boundary: không bị ảnh hưởng; đây là cloud Backoffice behavior, không tạo cloud/POS/Display synchronization.
- External provider/device: không bị ảnh hưởng.
- Cross-module boundaries: không đụng Restaurant Knowledge, Booking, company/legal data hoặc capability khác.

## Lifecycle Baseline

Baseline của bounded Establishment Profile vẫn là:

| Dimension | Current value |
| --- | --- |
| Product Decision | `APPROVED` |
| Implementation | `IMPLEMENTED` |
| Environment | `UNVERIFIED` |
| Production Readiness | `NOT_READY` |
| External Dependency | `NOT_ASSESSED` |
| Review Marker | `OK` |

Các giá trị này mô tả capability hiện có. Behavior copy mới chưa được implement; việc tạo proposal/analysis không thay đổi bất kỳ lifecycle value nào.

## Requirement Readiness

`READY_FOR_SPECS`

Có thể viết precise behavioral specs mà không cần đoán về boundary hoặc empty-source semantics. Một action rõ ràng dành cho người có quyền edit sẽ xử lý độc lập từng cặp field trong current form draft: source `phone` không rỗng thay thế `publicPhone`; source `email` không rỗng thay thế `publicEmail`; source rỗng hoặc `null` giữ nguyên public counterpart hiện có. Action không persist tự động, không thay visibility và chỉ là one-time draft operation, không tạo ongoing synchronization. Existing explicit save, validation và server authorization tiếp tục kiểm soát persistence.

Vì đây là behavior change thực, change không được dùng `skip_specs: true`. Capability OpenSpec có thể tiến tới specs sau khi proposal và analysis được review/approve là `establishment-profile`.

## UI / UX Applicability

UI/UX bị ảnh hưởng trên route `/etablissement/informations-generales`. Specs và design sau này phải bám [current page pack](../../../docs/ui/pages/establishment-general-information/README.md), đặc biệt explicit-save behavior, editable/read-only states, validation và accessibility; screenshot không phải authority cho field semantics.

Vị trí, wording, icon và presentation chi tiết của control là câu hỏi design, miễn là action vẫn rõ ràng, có accessible name và không xuất hiện như một persistence shortcut.

## Conflicts and Unknowns

- Không có `CONFLICT` với Product Knowledge, ADR, field semantics, ownership, permission hoặc runtime/data boundary hiện tại.
- Không có requirement-level `NEEDS REVIEW` ngăn việc viết specs.
- Requirement-level ambiguity duy nhất về source rỗng hoặc `null` đã được review giải quyết: public counterpart hiện có phải được giữ nguyên.
- Cách trình bày control và cấu trúc test cụ thể có thể được quyết định ở design/tasks sau specs; chúng không thay đổi behavior đã được bound.
- Deployment state vẫn `UNVERIFIED`, nhưng không phải blocker cho proposal/spec readiness.

## Analysis Conclusion

Bounded scope đã được xác nhận trong Establishment Profile hiện có. Capability `establishment-profile` có thể tiến tới specs sau review gate hiện tại, với behavior giới hạn ở conditional one-time draft copy: mỗi source không rỗng thay thế public counterpart, mỗi source rỗng hoặc `null` giữ nguyên public counterpart, và quy trình lưu/validation/authorization hiện hữu vẫn được giữ nguyên.

Kết luận: `READY_FOR_SPECS`. Không có blocker Product, architecture, security hoặc field semantics. Change không đủ điều kiện dùng `skip_specs: true`. Analysis dừng trước specs, design và tasks theo yêu cầu.
```

## Authorities consulted

- `docs/AUTHORITY_MODEL.md`
- `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- `docs/features/establishment/README.md`
- `docs/features/establishment/general-information/README.md`
- `docs/decisions/ADR-006-cloud-establishment-profile-context.md`
- `docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md`
- `docs/ui/pages/establishment-general-information/README.md`
- `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
- `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
- The implemented-state files and tests enumerated in the exact analysis above

The authority review confirms that change artifacts remain non-normative, accepted durable boundaries remain authoritative, and this packet records review evidence only. It does not approve Product Intent, change lifecycle values, sync specs, or establish implementation or deployment evidence.

## Conflicts and remaining review items

- No authority, Product, ownership, permission, runtime, data-boundary, or field-semantics `CONFLICT` was identified for this bounded proposal.
- No requirement-level `NEEDS REVIEW` item blocks specification review.
- The previously identified empty/`null` source ambiguity is resolved in both reviewed artifacts: the corresponding existing public value remains unchanged.
- Deployment remains `UNVERIFIED`; this does not block the Gate 1 requirement-readiness decision and is not changed by this packet.
- Presentation details and test structure remain design/task concerns within the bounded behavior; they are not authority decisions at this gate.

## Explicit reviewer questions

1. Does the reviewer approve the exact proposal and analysis identified by the hashes above as `READY_FOR_SPECS`?
2. Does the reviewer confirm that the bounded behavior remains inside the approved Establishment Profile ownership and permission boundary, with no automatic persistence or continuing synchronization?
3. May the workflow proceed on its next run to strict validation and Gate 2 review of the already-existing delta spec, without rewriting it?

## Conclusion and recommendation

Analysis conclusion: `READY_FOR_SPECS`.

Recommendation: `APPROVE_GATE_1_AND_PROCEED_TO_EXISTING_SPECS_REVIEW`.

This packet stops at Gate 1. No approval is inferred from its creation. A current-user instruction explicitly approving this exact Gate 1 packet is required before the workflow may evaluate the existing delta spec for Gate 2.
