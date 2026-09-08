# Change Analysis

## Scope and Change Type

Change: `formalites-template-legal-review-governance`.

Classification: `CROSS_MODULE / AUTHORITY_SENSITIVE`; governance-only behavioral contract cho GLOBAL YUTA Formalités legal templates. Đây là bước định nghĩa desired acceptance/rejection behavior trước persistence hoặc lifecycle implementation. Không có runtime implementation trong scope.

Control Tower đã xác nhận Product decisions, reviewer authority, outcomes, qualification, recorder/publisher boundary và evidence linkage `RESOLVED`; cho phép bắt đầu OpenSpec. Retention duration `DEFERRED`, persistence `OUT OF SCOPE`, Sensitive Design Gate `REQUIRED`. Quyết định này cho phép soạn Proposal/Analysis; không tự phê duyệt artifact Gate 1 chưa được review.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [current-state routing](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md).
- [Activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [YUTA run skill](../../../.agents/skills/yuta-run-change/SKILL.md), [workflow gate/knowledge protocol](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [configuration](../../config.yaml).
- [Personnel Product Knowledge](../../../docs/features/personnel/README.md), [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Identity and Membership architecture](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md), [normative system authorization](../../specs/authorization/platform-admin-formalites-template-administration/spec.md), [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md).
- [Auth package instructions](../../../packages/auth/AGENTS.md), [operation/grant implementation](../../../packages/auth/src/formalites-template-system-authorization.ts), [trusted auth service](../../../packages/auth/src/session.ts), [authorization tests](../../../packages/auth/test/formalites-template-system-authorization.test.ts), [existing tenant-owned draft schema](../../../packages/db-cloud/src/schema/formalites.ts).
- [Draft legal-review brief](../../../docs/ui/pages/backoffice-equipe-formalites-personnel/LEGAL_REVIEW_BRIEF.md): supporting discovery evidence; không phải completed review hoặc approved template.
- Current-user Control Tower decision ngày 2026-09-07 và Discovery/Shaping trong cùng conversation: provenance cho bounded Product decisions được chuyển thành reviewable artifacts; không phải completed legal opinion hay main-spec promotion.

## Authority and Product Decision

### Ownership and authorization

Formalités sở hữu template semantics. Platform Admin là future internal administration runtime/access boundary; không mở general-purpose Platform Admin. GLOBAL YUTA Formalités template không thuộc organization hoặc establishment; restaurant OWNER/MANAGER/STAFF là future consumers, không có global template authority.

Existing authority contract giữ đúng năm operations:

- `formalites.template.read`;
- `formalites.template.draft.manage`;
- `formalites.template.review.submit`;
- `formalites.template.publish`;
- `formalites.template.retire`.

`YUTA_ADMIN` chỉ nhận explicit grant cho từng operation; `YUTA_SUPPORT` nhận none. Không wildcard, prefix matching, implication, role hierarchy, caller policy hoặc principal mới. Trusted active internal user và exact system-operation grant là prerequisite; tenant membership và `TenantContext` không cần thiết và không cung cấp global authority. System context không cho phép truy cập tenant resources.

### Reviewer authority

Reviewer là external/manual, không cần YUTA identity. Một cá nhân chịu trách nhiệm cho opinion phải xác định được; tên firm/entity đơn lẻ không đủ.

Theo quyết định đã chốt sau Discovery, default acceptance là avocat đăng ký tại barreau Pháp, hoặc luật sư EU được phép tư vấn pháp luật Pháp, có năng lực French employment law phù hợp. Juriste khác chỉ được chấp nhận khi có documented professional/legal authority cho đúng loại tư vấn và evidence về năng lực phù hợp; nhãn “juriste qualifié” đơn lẻ không đủ. Đây là acceptance policy của YUTA, không phải kết luận rằng chỉ một loại nghề nghiệp được pháp luật cho phép tư vấn.

Evidence về reviewer gồm identity, firm/entity nếu có, professional capacity, registration hoặc equivalent authority reference, jurisdiction, competence, engagement/matter reference và dated review confirmation. Thiếu căn cứ authority hoặc không xác định được người chịu trách nhiệm thì review không đủ điều kiện qualification. `YUTA_ADMIN` không sở hữu hoặc tạo legal opinion.

### Minimum review evidence

Evidence phải xác định exact immutable template/version và canonical-content checksum kèm thuật toán; review date; reviewer identity/authority/qualification references; outcome; reviewed applicability envelope; binding conditions/reservations/exclusions; effective date nếu liên quan; legal/conventional reference snapshot khi reviewer yêu cầu; external deliverable/confirmation reference; evidence received/recorded time; internal recorder identity; supersedes reference nếu có.

Envelope bao gồm jurisdiction, contract category, full/part-time boundary, employee/employer categories, collective-agreement assumptions và effective-date constraints liên quan. Không coi thiếu thông tin là không có điều kiện. Evidence phải cho phép đối chiếu opinion thực sự nói về đúng version và envelope; checksum chỉ chứng minh content identity, không tự chứng minh reviewer identity hoặc authenticity của opinion.

Private evidence và professional personal data không được đưa vào Git. Public repository chỉ giữ governance descriptions và opaque references; không private URL hoặc vault path. Không thu thập actual review hay real employee dossier trong change này. Không thiết kế schema hoặc checksum representation/canonicalization algorithm ở Analysis.

### Outcomes and qualification

Ba Product outcomes, chưa chọn enum implementation:

- `APPROVED`: reviewer chấp nhận exact version trong envelope đã khai báo. Conditions/reservations vẫn bắt buộc; chỉ phù hợp khi đã nằm trong envelope và không yêu cầu sửa version.
- `CHANGES_REQUIRED`: có thay đổi cần thực hiện; version chưa qualified. Thay content/envelope tạo version mới và cần review lại.
- `REJECTED`: không đủ điều kiện publication cho declared use.

Không có outcome riêng `APPROVED_WITH_CONDITIONS`; source opinion có điều kiện được đánh giá theo hai trường hợp trên, không được nội bộ sửa hoặc bỏ điều kiện để đổi kết quả.

Qualification cho declared use yêu cầu đồng thời exact immutable version/checksum, completed accepted external review với `APPROVED`, complete evidence, matching reviewed envelope, satisfied binding conditions, applicable effective dates, review chưa bị supersede/invalidate và successful authorized publication của version chưa retired. Authorization allow không phải publication completion, review completion hoặc qualification.

Qualification không bảo đảm contract cuối cùng compliant/valid, không xác minh employee/employer input, không thay legal advice cho trường hợp cụ thể và không mở rộng sang version/use khác.

### Recorder/publisher and evidence linkage

External reviewer khác internal publisher; recorder có thể là publisher. Không yêu cầu hai internal approvers hoặc ba người riêng biệt. Internal record phải phân biệt opinion author, internal recorder/publisher và external evidence source; không được sửa outcome, reservations hoặc envelope của reviewer.

`formalites.template.review.submit` chỉ đại diện submission, không cấp independent evidence CRUD. Evidence record/linkage là prerequisite bên trong future atomic publication action dùng `formalites.template.publish`. Chỉ mô tả semantic all-or-nothing boundary: không có successful publication khi required evidence không hợp lệ; không định nghĩa transaction, storage hoặc service implementation.

Nếu cần standalone evidence intake/edit/approval trước publication, đây là authority expansion ngoài scope và phải STOP về Control Tower. Existing authorization spec không bị sửa để ngầm cấp operation thứ sáu.

### Invalidation and supersession

Thay đổi content hoặc applicability tạo version mới; evidence cũ không tự qualify version mới. `CHANGES_REQUIRED`/`REJECTED` không qualify. Review mới supersede evidence cũ nhưng không ghi đè historical attribution. Review đã bị supersede/invalidate không tiếp tục hỗ trợ current qualification; evidence mới phải vượt đủ prerequisites, không tự tái-publication.

Legal/conventional change, effective-date boundary hoặc reviewer re-review trigger làm version không còn đủ điều kiện future use khi review không còn applicable. Không tự suy luận pháp luật còn hiệu lực từ publication cũ. Retirement khỏi future use giữ nguyên historical records; không sửa ngược generated artifacts. Không tạo thêm suspension operation hoặc lifecycle executor trong change này.

### Wording, privacy and audit

Wording đã bounded: “préparé à partir d’un modèle qualifié pour ce cas d’usage”, đi kèm qualifier: “La qualification concerne uniquement la version du modèle et le périmètre déclarés. Elle ne constitue ni un avis juridique sur la situation individuelle, ni une garantie de conformité du contrat final.” Đây là future wording contract; change không hiển thị claim trên UI hoặc tạo document.

Không dùng default claims “contrat conforme”, “juridiquement conforme”, “validé juridiquement” hoặc certification/guarantee. Completion của governance không chứng minh bất kỳ actual template nào đã qualified.

Reviewer/evidence có thể là personal/confidential data. Trước persistence phải có purpose/legal basis, minimization, recipients/access, private storage/confidentiality, active/archive separation, rights handling, legal hold, deletion/backup propagation và justified retention decision. Không định retention duration; việc defer chỉ áp dụng governance-only scope, không cho phép lưu evidence vô thời hạn hoặc bắt đầu processing.

Giữ riêng authorization/security audit (actor/operation/decision), external legal-review evidence (author/opinion/version/envelope), publication/retirement audit (internal actor/action/version/time/reason/evidence reference). Security logs không chứa legal content và không là proof của domain completion.

Không có external provider integration. Manual/private evidence handling là future permitted direction, không phải authorization gửi dữ liệu, ký hợp đồng, chọn provider hoặc mở vault trong turn này.

## Current Implemented State

Inspected checkout có five-operation authorization source và denial/grant tests; `session.ts` cung cấp minimized system context từ trusted user và exact operation. Existing tests mô tả denial cho missing/disabled user, missing/ungranted role, unknown operations và no lifecycle side effects; inspection không được ghi thành test PASS.

Prerequisite đã completed theo Control Tower và có normative main-spec file trong checkout. Một số prerequisite files vẫn untracked hoặc modified relative to HEAD, vì worktree dùng chung; không coi HEAD một mình là approved full implementation snapshot, không commit hoặc normalize chúng.

Không có global-template legal-review resource implementation được xác lập. Existing `formalites.ts` là tenant-owned personnel draft với organization/establishment/employee scope, không phải global template model. Development persistent draft đã tồn tại và được giữ nguyên. Không có actual accepted legal review/template evidence hoặc production deployment được xác minh trong analysis.

## Affected Boundaries

- Domain: Formalités sở hữu human-review/qualification semantics.
- Authorization: chỉ reference existing exact system operations; không thêm grant hoặc đổi security behavior.
- Runtime: Platform Admin vẫn reserved, chưa tạo application; Backoffice sessions không đổi.
- Data: không schema/migration/repository/API. `@yuta/db-cloud` là approved cloud persistence family cho later global Formalités data; không chọn model hoặc file provider trong change này.
- Tenancy: global templates tách organization/establishment resources; không `TenantContext` reuse, fabrication, merge hoặc fallback. Existing tenant Formalités permissions/draft không đổi.
- Legal/privacy: manual external author và private evidence prerequisites; no legal-compliance guarantee.
- External/local: không provider call; POS/Display không bị ảnh hưởng; không generation/PDF/signature/Documents handoff hoặc restaurant customization.

## Lifecycle Baseline

Giữ nguyên current bounded assignments trong Module Registry/Personnel Home:

- Generic Formalités walkthrough: `APPROVED / PROTOTYPE / DEVELOPMENT_ONLY / BLOCKED / BLOCKED`.
- Persistent CDI draft: `APPROVED / IMPLEMENTED / DEVELOPMENT_ONLY / BLOCKED / BLOCKED`.
- Future generation/template/signature lifecycle: `PROPOSED / NOT_STARTED / NOT_ENABLED / BLOCKED / BLOCKED`.
- Platform Admin app chưa started/enabled; chỉ portable five-operation foundation đã được approved/implemented trong scope riêng.

Thứ tự trên là Product Decision / Implementation / Environment / Production Readiness / External Dependency. Các giá trị tổng hợp không phải assignment mới cho governance candidate. Current-user Product decisions được ghi nhận theo bounded request; không chỉnh Registry hoặc tự nâng broad future lifecycle. `HR-TEMPLATE-01`, `HR-FORMALITY-01`, `HR-RET-01`, `HR-AUDIT-01` và các production gates liên quan vẫn chưa được đóng bởi change này.

Canonical reconciliation chỉ sau Gate 3 → finish → authorized Sync → Validate Main Specs → Archive → reviewed Knowledge Consolidation. Không cập nhật canonical Knowledge, summaries hoặc lifecycle trong Apply/Verify; main-spec link chỉ được thêm sau successful authorized sync/validation và đúng Knowledge review scope.

## Requirement Readiness

Có thể soạn precise observable acceptance/rejection scenarios mà không chọn persistence hoặc auth redesign. Minimum scenario coverage cho Specs: unqualified/anonymous reviewer; missing/mismatched evidence/checksum/envelope; approved có binding conditions; changes required/rejected; unauthorized publisher/support/tenant-only actor; author/recorder attribution; review supersession; content/applicability version changes; publish allow without domain completion; misleading legal claims; private evidence/audit separation.

Chỉ capability `formalites/template-legal-review-governance` được phép tiến đến Specs sau Gate 1. Existing authorization main spec không có requirement modification. Không dùng `skip_specs: true`; governance semantics là behavioral delta dù chưa triển khai runtime.

## UI / UX Applicability

`UI_AFFECTING: NO`. `BROWSER_QA_REQUIRED: NO` cho bounded governance-only scope. Không sửa page pack/UI, tạo `ux-flow`, generation screen hoặc Platform Admin. Wording là contract cho future use, chưa có rendering. QA applicability và documentary verification sẽ được ghi bằng evidence ở giai đoạn thích hợp; không tuyên bố QA/VERIFY PASS tại Analysis.

## Conflicts and Unknowns

Requirement-level `CONFLICT`: không phát hiện trong scope đã được Control Tower chốt.

Draft brief dùng “avocat ou juriste qualifié” và bốn checkbox outcomes; đó là unsigned proposal, không cao hơn current resolved acceptance/outcome decisions. Không sửa brief hoặc tạo legal approval. Nếu sau này nhận actual opinion với conditions chưa biểu diễn được, fail closed và review lại thay vì tự map thành approved.

`NEEDS REVIEW` được defer ra ngoài change: actual reviewer engagement và qualification evidence cho từng review; actual template/content/applicability; exact retention duration/legal basis/storage/access operations; provider và production readiness. Chúng không chặn governance-only requirements nhưng phải được quyết định trước corresponding processing/runtime enablement.

Design-only: cách tài liệu hóa và kiểm chứng governance scenarios, exact content identity/canonicalization boundary khi thích hợp; không được dùng Design để chọn schema, API, runtime hoặc thực hiện evidence persistence. Sensitive Design Gate bắt buộc trước Tasks/Apply.

STOP nếu cần principal/role/operation mới, independent evidence CRUD, tenant-bound session redesign/bypass, persistence để giải quyết governance, Platform Admin implementation, unresolved reviewer/qualification semantics hoặc unsafe legal wording. Không mở lại unrelated tooling/prerequisite lifecycle.

## Analysis Conclusion

`READY_FOR_SPECS`.

Bounded governance scope đã rõ; không còn requirement-level Product/authority blocker. Gate 1 review phải kiểm tra exact Proposal/Analysis và artifact hashes trước khi cho phép Specs. Sensitive Design Gate tiếp tục bắt buộc. Không có Apply, Sync, Archive, actual legal approval hoặc production authorization ở bước hiện tại.
