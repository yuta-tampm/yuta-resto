## Why

Formalités đã có authority foundation cho năm global template operations, nhưng chưa có contract bền vững xác định legal review nào đủ điều kiện qualify một exact template version. Control Tower đã chốt Discovery/Shaping và các Product/authority decisions; cần ghi nhận governance semantics trước khi xem xét template persistence hoặc generation.

## What Changes

- Định nghĩa reviewer external/manual có danh tính, tư cách tư vấn pháp luật Pháp và năng lực French employment law được kiểm chứng; không yêu cầu YUTA identity.
- Định nghĩa minimum evidence gắn với exact immutable template/version, content checksum, reviewer, ngày review, outcome, applicability envelope, conditions và external evidence reference.
- Chốt ba outcomes `APPROVED`, `CHANGES_REQUIRED`, `REJECTED`; conditions chỉ nằm trong `APPROVED` khi đã thuộc envelope và không yêu cầu sửa version.
- Định nghĩa qualification cho declared use: exact version, complete accepted review/evidence, matching envelope, satisfied conditions và authorized publication; authorization allow đơn lẻ không tạo qualification.
- Định nghĩa recorder/publisher attribution: external reviewer khác publisher; recorder có thể là publisher. Evidence linkage chỉ là prerequisite của future atomic publication qua `formalites.template.publish`, không tạo standalone evidence CRUD.
- Định nghĩa invalidation/supersession, giới hạn legal wording, ba audit families riêng biệt và privacy/retention prerequisites trước persistence.
- Giữ Sensitive Design Gate bắt buộc. Retention duration được defer và không chặn governance-only change.

## Capabilities

### New Capabilities

- `formalites/template-legal-review-governance`: behavioral contract cho human legal review, exact-version qualification và internal publication prerequisites của GLOBAL YUTA Formalités templates; chỉ định nghĩa governance, chưa thực thi lifecycle.

### Modified Capabilities

Không có. `authorization/platform-admin-formalites-template-administration` tiếp tục sở hữu đúng năm grants và trusted system-only boundary; `authorization/formalites` và `formalites/persistent-draft-foundation` giữ nguyên.

## Impact

Classification: `CROSS_MODULE / AUTHORITY_SENSITIVE`.

Formalités là semantic owner; Platform Admin là future internal administration runtime/access boundary; Identity / Access tiếp tục sở hữu authorization foundation. GLOBAL template không thuộc organization hoặc establishment; restaurant memberships không có global authority.

Phạm vi hiện tại là Proposal/Analysis và Gate 1 review packet. Sau review, change sẽ định nghĩa governance delta spec và Design/Tasks phù hợp với phạm vi không có runtime. Không dùng `skip_specs: true` vì governance này bổ sung observable acceptance/rejection requirements dù chưa triển khai software behavior.

Không tạo hoặc sửa application/package code, system roles/principals/grants, tenant authorization, Backoffice sessions, `apps/platform-admin`, template content/schema/migration/repository/API/UI, legal-evidence store, provider integration, generation/PDF/signature/Documents handoff hoặc production configuration. Không thay đổi draft/persistence behavior hiện hữu, không thêm restaurant customization.

Canonical Product Knowledge, `CURRENT_STATE`, Module Registry, architecture summaries và lifecycle/readiness không được cập nhật trong Apply/Verify. Reconciliation chỉ sau Gate 3 → finish → authorized Sync → Validate Main Specs → Archive, qua reviewed Knowledge Consolidation. Change này không chứng minh bất kỳ template nào đã được legal review hoặc qualified và không đưa ra legal-compliance guarantee.
