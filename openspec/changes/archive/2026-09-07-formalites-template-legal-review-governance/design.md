## Context

Xem [Proposal — Why](proposal.md#why), [approved Analysis](analysis.md) và [approved governance delta](specs/formalites/template-legal-review-governance/spec.md). Gate 1/Gate 2 đã được user phê duyệt cho exact artifact bytes. Design này áp dụng vì legal/privacy và cross-module authority boundaries nhạy cảm; Sensitive Design Gate bắt buộc trước Tasks/Apply.

Existing [system authorization spec](../../specs/authorization/platform-admin-formalites-template-administration/spec.md) cùng `packages/auth/src/formalites-template-system-authorization.ts` và `packages/auth/src/session.ts` chỉ xác lập exact operation authority. Foundation không thực hiện legal review, evidence storage hoặc publication. [Personnel Product Knowledge](../../../docs/features/personnel/README.md) giữ existing development draft riêng với future global templates; [Identity / Access](../../../docs/features/identity-access/README.md) giữ system-only scope tách tenant resources.

Design giải quyết cách biểu đạt, review và kiểm chứng governance-only delivery. Nó không thiết kế một future service bằng cách đặt tên entity, method, payload, database transaction hoặc endpoint. Existing code/tests là compatibility evidence; không là Product hoặc legal approval.

## Goals / Non-Goals

**Goals:**

- Giữ một governance contract có thể review bằng exact requirements/scenarios và documentary evidence, không cần executable template resource.
- Phân biệt rõ operation authority, external opinion, publication completion và qualification; đảm bảo thiếu prerequisite không bị diễn giải thành success.
- Xác định cách kiểm chứng binding, outcomes, attribution, evolution và wording của 13 requirements/32 scenarios bằng tình huống trừu tượng không có dữ liệu thật.
- Bảo vệ approved artifact hashes, existing source boundaries và Knowledge Consolidation ordering.

**Non-Goals:**

- Không chọn storage/transaction/concurrency mechanism, model, schema, migration, repository, API, UI hoặc runtime/package placement cho template/evidence.
- Không tạo operation, role/principal, reviewer account, standalone evidence CRUD, automatic legal assessment hoặc compliance certification.
- Không tạo actual template/version, upload/evidence persistence, Platform Admin app, generation/CDI/PDF/signature/Documents handoff, provider integration hoặc production enablement.
- Không sửa existing Backoffice sessions, tenant authorization hoặc persistent draft. Không quyết định actual reviewer engagement, real review result, retention duration hoặc provider.

## Decisions

### D1 — Deliver và verify contract ở documentary boundary

Giữ capability duy nhất tại `formalites/template-legal-review-governance`. Approved delta là behavioral source cho change; Design chỉ giải thích cách đảm bảo tính nhất quán và phạm vi. Không sửa existing authorization main spec, không thêm package/export hoặc executable policy evaluator để giả lập một runtime chưa được duyệt.

Later verification, sau authorization tương ứng, dùng requirement/scenario-to-evidence matrix trong existing change review evidence: exact requirement/scenario title, symbolic premise, expected governance result, rationale và artifact reference/hash. Matrix chứng minh documentary conformance; không được ghi thành actual published template, operational enforcement hoặc legal review đã hoàn thành. Không tạo artifact type mới hay Tasks trong Design turn.

Rationale: deliverable được duyệt là governance trước persistence; mọi fixture/template implementation đều dễ tạo source of truth ngoài scope. Alternative dùng code-only evaluator hoặc mock resource bị loại vì thêm runtime/model decisions và không chứng minh external opinion authenticity. Alternative chỉ prose summary không traceability bị loại vì khó phát hiện scenario bị mất.

### D2 — Reviewer/evidence acceptance được kiểm tra theo nguồn và phạm vi

Reviewer là external person với professional authority/competence evidence theo approved spec; tên organization không thay thế accountable person. Không tạo YUTA identity hoặc technical reviewer principal để chứng minh trách nhiệm. Human reviewer acceptance được đánh giá từ attributable external sources và exact review scope; system role không là evidence legal competence.

Dùng documentary comparison của ba mối liên hệ: opinion → external author/authority, opinion → exact content/version, opinion → reviewed envelope/conditions. Opaque reference đơn lẻ hoặc matching checksum không đủ nếu không đối chiếu được external source. Missing/unknown evidence giữ non-eligible result; không tự bổ sung N/A hay auto-accept.

Symbolic verification có thể dùng nhãn `reviewer A`, `publisher B`, `version V`, `content H` như ký hiệu trong narrative. Chúng không phải identities, actual template bytes, real hashes hoặc persisted evidence. Checksum algorithm/canonicalization, signature verification và reviewer-registry integration không được chọn ở đây; future implementation phải chứng minh exact binding theo spec trước khi dùng thực tế.

Rationale: content identity và opinion authority là hai chứng cứ khác nhau. Alternative dùng email domain, job title, firm name hoặc `YUTA_ADMIN` để mặc nhiên chấp nhận reviewer bị loại. Alternative tạo reviewer login hoặc external verification provider bị loại vì không cần cho bounded contract và không được duyệt.

### D3 — Outcomes là semantic decision table, không enum implementation

Dùng đúng ba outcomes đã approved; không thêm trạng thái “approved pending evidence”, “conditionally qualified” hoặc `APPROVED_WITH_CONDITIONS` như review outcome. Eligibility cho qualification là câu hỏi riêng với outcome, vì approved opinion có thể thiếu prerequisites khác.

| External finding theo exact current version                                          | Product interpretation                    | Qualification consequence                       |
| ------------------------------------------------------------------------------------ | ----------------------------------------- | ----------------------------------------------- |
| Chấp nhận; conditions đã thuộc envelope, không cần sửa version                       | `APPROVED`                                | Chỉ eligible khi tất cả prerequisites khác đạt  |
| Yêu cầu sửa content/applicability hoặc conditions chưa biểu diễn được trong envelope | `CHANGES_REQUIRED`                        | Không qualified; changed version cần new review |
| Không chấp nhận proposed scope                                                       | `REJECTED`                                | Không qualified/publication cho scope đó        |
| Outcome thiếu/unknown hoặc dùng tên outcome thứ tư                                   | Không phải accepted outcome; không tự map | Fail closed                                     |

Table là cách review documentary semantics, không transport shape hay additional enum value. Source opinion và conditions được giữ nguyên về attribution/meaning; internal interpretation không được sửa lời reviewer để đạt eligibility. Ambiguous finding không được nội bộ đoán là approved.

Rationale: tránh trộn external finding với trạng thái của evidence/publication. Alternative fourth outcome bị loại theo approved spec. Alternative tự chuyển mọi “approved sous conditions” thành unconditional approved bị loại vì làm mất binding conditions.

### D4 — Atomic publication là invariant về kết quả

Qualification chỉ đúng khi đồng thời đáp ứng exact version/checksum, accepted completed external review, `APPROVED`, complete bound evidence, matching envelope/conditions/effective dates, current review, successful authorized publication và non-retired status theo spec. Đây là logical conjunction dùng để review result; không định execution order, transaction, API hay data representation.

All-or-nothing nghĩa là: nếu authority hoặc required evidence/linkage/domain prerequisite không hợp lệ, không được tuyên bố successful publication hay qualification. Authorization allow chỉ chứng minh quyền cho exact operation; approved opinion chỉ chứng minh reviewer finding. Cả hai không thay thế publication completion. Không tạo một speculative intermediate success state cho missing prerequisites.

Documentary counterexamples thay từng premise: allow nhưng chưa publication; review approved nhưng thiếu evidence; checksum đúng nhưng envelope khác; ngoài effective date; review superseded; version retired. Mỗi counterexample phải giữ kết quả non-qualified phù hợp với approved scenario, không chế tạo actual lifecycle event.

Rationale: observable outcome đủ diễn đạt governance mà không cần persistence. Alternatives gồm database transaction, locks, outbox, idempotency/retry, commit/rollback orchestration bị loại khỏi Design này; chọn chúng sẽ vượt scope và yêu cầu quay lại Control Tower. Không xem mô hình ký hiệu là implementation của publication.

### D5 — Authority reuse và separation không thêm principal/operation

Năm existing operations giữ nguyên exact identifiers và grants:

- `formalites.template.read`;
- `formalites.template.draft.manage`;
- `formalites.template.review.submit`;
- `formalites.template.publish`;
- `formalites.template.retire`.

Governance chỉ tham chiếu exact publish grant cho future publication có required evidence record/linkage; submit không cấp independent evidence management. Không phát sinh standalone evidence create/read/update/delete/approve authority từ read, submit hoặc publish. `YUTA_ADMIN` không có blanket authority; `YUTA_SUPPORT` và restaurant-only memberships không có grant ở capability này.

Tách factual external reviewer identity khỏi internal publisher identity; yêu cầu là hai người khác nhau, không chỉ hai textual labels khác nhau. Reviewer không có YUTA account vẫn được xét bằng evidenced identity. Recorder được trùng publisher; không yêu cầu second internal approver. Design không chọn identity-matching algorithm hoặc lưu personal identifiers. Verification narrative chỉ xác nhận separation premise và fail-closed case khi không chứng minh được premise.

System context không construct/reuse/merge/fallback vào `TenantContext`. Một người đồng thời có system role và tenant membership vẫn dùng hai authority boundaries riêng. Existing Backoffice session architecture không đổi.

Rationale: role grants cho internal administration không phải legal authority. Alternatives reviewer system role, extra evidence operation, independent evidence inbox/CRUD hoặc tenant-scoped Platform Admin bị loại vì mở rộng authority. Nếu cách thực thi future flow cần một trong những phương án này, STOP trước thiết kế/implementation mở rộng.

### D6 — Version evolution và supersession được review như relations lịch sử

Documentary examples giữ content identity và applicability identity cùng exact version. Content thay đổi hoặc envelope thay đổi đều dẫn tới new version/new review; không có formatting/minor-change exemption cho canonical content. Cùng content checksum nhưng envelope khác không được kế thừa qualification.

Supersession xác định earlier và new review một cách rõ ràng; earlier evidence giữ historical author/outcome/version attribution nhưng không còn hỗ trợ current qualification. New review không tự publication; mọi prerequisite vẫn áp dụng. Retirement hoặc review không còn applicable chặn future use mà không sửa historical meaning của previous evidence/artifacts.

Rationale: historical accuracy và current eligibility là hai câu hỏi khác nhau. Alternative overwrite review cũ, tái gắn evidence theo content similarity hoặc coi latest approved opinion là automatic re-publication bị loại. Không chọn history table, append-only storage, timestamps schema, automatic legal-change detector hoặc retention executor. Việc bảo toàn lịch sử về semantic không cho phép indefinite retention; xử lý lưu giữ thực tế vẫn chờ privacy decisions.

### D7 — Audit, privacy và wording có evidence mục đích riêng

Review bằng ba cột tách biệt trong documentary matrix: authorization/security attribution; external legal-review evidence; publication/retirement attribution. Có thể tham chiếu cùng logical version/evidence nhưng không dùng security allow/deny làm proof của legal review hay completed publication. Không nhúng opinion/template content vào security signal, không biến internal recorder thành author.

Private actual evidence không được thu thập trong change. Repository chỉ giữ governance và opaque references theo [Production Readiness storage rule](../../../docs/operations/PRODUCTION_READINESS.md#security-and-document-storage-rule). Before-processing/persistence decisions về purpose/legal basis, minimization, access/confidentiality, storage, rights, active/archive, legal hold, deletion/backups và retention giữ explicit prerequisites. Retention duration deferred không làm governance bị blocked nhưng không authorize processing. Không chọn duration, vault/provider hoặc retention mechanism.

Wording kiểm tra bằng exact approved phrase/qualifier trong spec và negative examples cho compliance/certification claims. Không viết lại qualifier bằng nội dung marketing hoặc thử nghiệm rendering. Passing artifact review không cho phép phát biểu một actual template đã qualified.

Rationale: audit correlation không làm ba families có cùng meaning hoặc confidentiality. Alternative unified audit record chứa opinion hoặc dùng publication stamp làm legal certification bị loại. Alternative chọn evidence store/retention để giúp minh họa bị loại vì persistence ngoài scope.

### D8 — Delivery integrity và Knowledge Consolidation tuân Workflow v3

Trong Design turn, authored paths chỉ là `design.md`, approval record của Gate 2 và `docs/reviews/formalites-template-legal-review-governance/02b-design-review.md`. Proposal, Analysis, delta spec và Gate 1 packet giữ nguyên exact bytes. Không tạo Tasks hoặc implementation evidence như thể chúng đã được thực hiện.

Sau approval thích hợp, documentary verification phải trace đủ 13 requirements/32 scenarios, kiểm tra allowed operation/outcome sets, binding/separation counterexamples và protected source hashes. Existing test/code inspection chỉ chứng minh compatibility baseline; không yêu cầu xây runtime hoặc actual template để hoàn thành documentary verification. Các repository checks thực sự chạy được báo exit/result; failures có sẵn ngoài scope được phân biệt bằng hashes và không bị cleanup tự động.

Apply/Verify không cập nhật canonical Product Knowledge, `CURRENT_STATE`, Module Registry, architecture summaries hoặc lifecycle/readiness. Canonical reconciliation chỉ diễn ra sau Gate 3 → `$yuta-finish-change` → authorized Sync → Validate Main Specs → Archive → reviewed Knowledge Consolidation. Chỉ nguồn do reviewed consolidation xác định mới được sửa sau approval cần thiết; main-spec links chỉ sau successful authorized sync/validation. Implementation, sync và archive không tự promote lifecycle values.

Rationale: artifact completion khác current Knowledge/readiness authority. Alternative direct canonical promotion khi checks pass bị loại theo approved Analysis và Workflow v3. Không thêm implementation manifest entry cho code chưa thay đổi, không mở lại prerequisite tooling hoặc completed authorization lifecycle.

## Requirement Traceability

Các số R1–R13 dưới đây chỉ là labels cho thứ tự exact requirements trong approved delta, không tạo requirement identifiers mới hoặc sửa title.

| Spec requirement                  | Design decisions | Documentary validation focus                                                   |
| --------------------------------- | ---------------- | ------------------------------------------------------------------------------ |
| R1 Global ownership/authorization | D1, D5           | Exact five operations, no support/tenant authority or merge                    |
| R2 Reviewer identity/authority    | D2, D5           | Accepted external person; absent account does not deny; missing authority does |
| R3 Minimum bound evidence         | D2, D4           | Complete versus missing/mismatched source/version/checksum                     |
| R4 Envelope/conditions            | D3, D4           | Declared use, effective dates and conditions; unknown fails closed             |
| R5 Three outcomes                 | D3               | Three outcomes only; no unconditional reinterpretation                         |
| R6 Qualification/publication      | D4               | All premises required; auth/review alone insufficient                          |
| R7 Recorder/publisher             | D4, D5           | External person differs; recorder may equal publisher; no independent CRUD     |
| R8 Version changes                | D6               | Content or applicability change requires new version and review                |
| R9 Supersession/retirement        | D6               | Historical attribution preserved; no automatic current qualification           |
| R10 Bounded wording               | D7               | Exact phrase/qualifier, no guarantee or premature claim                        |
| R11 Privacy/retention             | D7               | Private references and before-processing decisions; no duration invented       |
| R12 Audit families                | D7               | Security, legal opinion and publication meanings remain distinct               |
| R13 Excluded capabilities         | D1, D8           | Documentary scope, no runtime/lifecycle/readiness promotion                    |

## Risks / Trade-offs

- [Documentation PASS bị hiểu là runtime/legal PASS] → Evidence labels ghi rõ documentary validation; không actual review/publication/template hoặc implementation-enforcement claim.
- [Opaque reference/hash bị hiểu là authenticity] → D2 kiểm tra author/source/version/envelope riêng; missing premise không eligible.
- [Atomicity bị hiểu là transaction approval] → D4 chỉ định result invariant; mọi persistence/transaction choice ngoài scope.
- [Conditions hoặc applicability bị sửa để đạt approval] → D3/D6 giữ source opinion và yêu cầu version mới/new review cho content/envelope change.
- [Hai identity labels che cùng một reviewer/publisher] → D5 yêu cầu factual different people; không chấp nhận textual distinction làm proof.
- [Historical preservation bị hiểu là retention vô hạn] → D6/D7 phân biệt semantic history với future storage/retention decisions.
- [Shared dirty checkout bị normalize] → Exact baseline snapshots và authored allowlist; unexpected protected-source drift STOP, unrelated work giữ nguyên.
- [Governance được dùng để promote Knowledge/readiness] → D8 giữ authorized lifecycle và post-archive reviewed consolidation ordering.

## Migration Plan

Database/data migration: NOT_APPLICABLE. Deployment/runtime rollout: NOT_APPLICABLE; production NOT AUTHORIZED. Không có processing, upload, external call hoặc state transition cần rollback trong Design scope.

Repository lifecycle về sau chỉ theo các gate đã duyệt. Design bị yêu cầu sửa thì chỉnh change-local Design/review evidence theo explicit direction, recompute hashes và review lại; không sửa approved Proposal/Analysis/Specs để phù hợp một implementation chưa được phép.

Trước sync, current main specs tiếp tục là authority hiện hành; change delta vẫn non-normative. Nếu future authorized sync/validation thất bại, áp dụng owning normativity/finish policy và giữ evidence; Design không cấp quyền direct main-spec edit hoặc silent rollback. Không sync/archive trong turn này.

## Open Questions

Không có unresolved choice ảnh hưởng bounded governance approach hoặc requirements. Actual reviewer engagement/authority verification, template content, canonicalization/representation, evidence storage/access/retention implementation và runtime đều là future separately authorized work, không phải missing deliverable của Design này.

STOP về Control Tower nếu cần sixth operation, independent evidence CRUD, new role/principal, reviewer YUTA account, tenant-authority merge, persistence/runtime để diễn đạt governance hoặc unsafe legal-compliance claim. Không điều kiện STOP nào cần được kích hoạt để hoàn thành Design documentary hiện tại.

Sensitive Design Gate: REQUIRED. Current next state: AWAITING_HUMAN_REVIEW tại Gate 2b; chưa Tasks/Apply.
