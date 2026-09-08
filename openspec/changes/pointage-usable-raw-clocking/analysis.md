# Change Analysis

## Scope and Change Type

Change: `pointage-usable-raw-clocking`. Behavior-changing, `CROSS_MODULE`,
data-affecting, Personnel-related, security-sensitive và UI-affecting.
Owning capability: Pointage. Existing cloud Backoffice là runtime duy nhất.

Current user chỉ authorize Proposal, Analysis và exact Gate 1 packet.
P1–P14 trong quyết định con người trước đó, được current request tái xác nhận,
là shaping authority; không phải Gate 1/Specs/Design/Apply approval. Artifacts
viết bằng tiếng Việt theo OpenSpec context; main Specs và archived foundation
không thay đổi.

Phạm vi và toàn bộ non-scope nằm trong [proposal](proposal.md). Không tạo page
pack, UX-flow, Specs, Design, Tasks, implementation, test data hoặc deployment
trong lượt này. Synthetic-only là giới hạn dữ liệu, không phải production
readiness và không phải quyền bypass security trong development.

## Sources Consulted

### Product, behavioral và provenance

- Current-user P1–P14 approval trong Control Tower và request
  `$yuta-run-change pointage-usable-raw-clocking`; exact scope được ghi trong
  Proposal và bảng decision dưới đây, không dựa trên prior assistant approval.
- [Product Knowledge routing](../../../docs/PRODUCT_KNOWLEDGE.md), mục Pointage.
- [Personnel Product Knowledge](../../../docs/features/personnel/README.md),
  capability map, ownership và limitations.
- [Module Registry](../../../docs/MODULE_REGISTRY.md), hai rows Pointage
  foundation/usable workflow.
- [Current State](../../../docs/CURRENT_STATE.md), foundation row và planned/
  unresolved wording.
- [Lifecycle model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Normative authority foundation](../../specs/pointage/authority-foundation/spec.md).
- [Normative authorization](../../specs/authorization/pointage/spec.md).
- [Personnel F07](../../specs/personnel/reconstructable-value-history/spec.md),
  ownership/retention scope; không import retention rule vào Pointage.
- [Archived foundation Design](../archive/2026-09-07-pointage-authority-and-access-foundation/design.md),
  D1, D6–D10: established technical boundary/provenance, không sửa archive.
- [Foundation final review](../../../docs/reviews/pointage-authority-and-access-foundation/03-final-review.md):
  approved finish, archive và Knowledge Consolidation DONE.

### Governance, security và runtime

- [Root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md),
  [Authority Model](../../../docs/AUTHORITY_MODEL.md).
- [Activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md),
  [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md),
  [normativity activation](../../../docs/OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md).
- [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md),
  [cross-module check](../../../docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md),
  [Control Tower routing](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md).
- [Authentication](../../../docs/architecture/AUTHENTICATION.md),
  [Tenancy](../../../docs/architecture/TENANCY.md),
  [database/runtime boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md),
  [ADR-003](../../../docs/decisions/ADR-003-database-ownership-boundaries.md).
- [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md),
  [guarded local testing](../../../docs/operations/LOCAL_DEVELOPMENT.md).
- Scoped instructions:
  [Backoffice](../../../apps/backoffice/AGENTS.md),
  [auth](../../../packages/auth/AGENTS.md),
  [db-cloud](../../../packages/db-cloud/AGENTS.md),
  [contracts](../../../packages/contracts/AGENTS.md),
  [tenant](../../../packages/tenant/AGENTS.md).

### Implemented State và UI evidence

- [Pointage primitives](../../../packages/auth/src/pointage-credential.ts).
- [Pointage schema](../../../packages/db-cloud/src/schema/pointage.ts),
  [repository](../../../packages/db-cloud/src/pointage-repository.ts).
- [Operation catalog](../../../apps/backoffice/src/server/pointage/authorization.ts),
  [server service](../../../apps/backoffice/src/server/pointage/service.ts).
- [Foundation tests](../../../apps/backoffice/test/pointage-foundation.test.ts),
  [negative inventory](../../../apps/backoffice/test/pointage-foundation-inventory.test.ts);
  source inspection, không claim đã chạy lại tests.
- [Manager placeholder](<../../../apps/backoffice/src/app/(authenticated)/equipe/pointage/page.tsx>).
- [UI governance](../../../docs/ui/README.md),
  [delivery modes](../../../docs/ui/DELIVERY_WORKFLOW_MODES.md),
  [Backoffice UI rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md),
  [page-pack protocol](../../../docs/ui/PAGE_PACK_PROTOCOL.md),
  [QA protocol](../../../docs/YUTA_QA_PROTOCOL.md).

## Authority and Product Decision

### Approved Human Shaping — P1–P14

| Decision | Phạm vi được current user phê duyệt                                                                                                                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Chỉ CLOCK_IN và CLOCK_OUT, không thêm break/pause/meal/manual adjustment.                                                                                                                                                                                     |
| P2       | NO_OPEN_SESSION + IN: accept/open; OPEN_SESSION + OUT: accept/close; OPEN_SESSION + IN hoặc NO_OPEN_SESSION + OUT: conflict/no event.                                                                                                                         |
| P3       | Stable mutation identifier; cùng ID/intent replay original committed receipt, subject to current authority/lifecycle; khác intent conflict; competing distinct requests cho một transition có tối đa một acceptance; retry timeout dùng lại ID.               |
| P4       | Nhiều phiên tuần tự; tối đa một mở; không overlap, arbitrary quota hoặc automatic end-of-day closure.                                                                                                                                                         |
| P5       | Own display name, NOT_CLOCKED_IN/CLOCKED_IN, open-session start date/time và immediate receipt; không history, daily total hoặc prior clock-out.                                                                                                              |
| P6       | Không manager UI; minimal server read cho scoped current-day events và current open session dưới pointage.establishment.read; không monthly/payroll/correction/security-audit view.                                                                           |
| P7       | Server-observed accepted instant; không browser time/backdating/Planning rounding; giữ đủ establishment timezone/calendar context để diễn giải lịch sử.                                                                                                       |
| P8       | Qua midnight vẫn một session, initial grouping theo CLOCK_IN business date; raw instants độc lập; không quyết định future day/payroll allocation.                                                                                                             |
| P9       | Giữ eligibility hiện tại: OUT sau departure bị deny dù IN ngày cuối hợp lệ; không automatic close, giữ session mở cho future correction.                                                                                                                      |
| P10      | Chỉ raw events là canonical attendance persistence; session/current state derived; không canonical hoặc materialized session table trong slice này.                                                                                                           |
| P11      | Shared-device support; clear employee-specific state khi kết thúc interaction; không durable browser storage cho plaintext credential, trusted context hoặc identity; inactivity timeout chờ Design.                                                          |
| P12      | Dedicated short-lived self-scoped Pointage continuation được duyệt về nguyên tắc; không generic session, plaintext persistence hoặc serialized trusted context; representation/lifetime/storage/rotation/binding/reset interaction/CSRF chờ Sensitive Design. |
| P13      | Approved injected synthetic provider chỉ phục vụ implementation/test; không production provider; real/public employee use vẫn blocked đến separately approved provenance.                                                                                     |
| P14      | Chỉ synthetic/disposable attendance trong development, integration tests và Browser QA; không authorize real attendance ở development/staging/production; legal/privacy blockers giữ nguyên.                                                                  |

P5 chỉ cho display projection tối thiểu, không cấp Personnel dossier-management
access. P6 được đưa vào scope theo current request; open session không biến
thành monthly/history manager view.

### Preserved authority

Personnel giữ canonical employee dossier và employment lifecycle. Pointage giữ
actual-work evidence; Planning giữ planned work và không được consume. Mọi query
vẫn cần trusted organization + establishment + dossier khi áp dụng; browser
locator/ID/role không tạo authority; không global identity hoặc dossier merge.

Employee identify, own-state read và own operation đều chịu current Personnel
eligibility. P12 không thu hẹp các guards về mutation-only. Before entry và after
departure đều fail closed; valid departure day vẫn eligible. Request replay
không cấp ngoại lệ. Issue/reset không tự quyết định upcoming issuance policy.

Giữ closed six-operation catalog của foundation; hai raw clock commands là
Pointage domain semantics, không phải lý do thêm grant hoặc STAFF access.
OWNER/MANAGER vẫn cần active matching establishment authority và exact
`pointage.establishment.read`. Không alias Personnel/POS/cloud-user authority.

Continuation mở rộng consumer behavior ở change mới, không tự đổi credential
crypto hoặc historical foundation approval. Credential-reset interaction phải
được giải quyết ở Sensitive Design trong existing invalidation boundary.

## Current Implemented State

- Foundation có portable dedicated-credential primitives, ba cloud tables cho
  credential versions/distributed limiter/security audit và scoped repository.
  Không có raw attendance/session persistence trong executable Pointage schema.
- Service resolve active establishment/organization từ public slug, validate
  credential qua injected trusted-address provider và phân biệt
  `VerifiedPointageCredential` với `PointageEmployeeContext`.
- Existing service/tests kiểm tra inclusive entry/departure cho cả ba employee
  operations theo server time và establishment timezone.
- Lifecycle read hiện tại chỉ trả scoped dossier ID, entry/departure dates;
  employee display name và raw-clock read/command contracts là consumer gap mới,
  không phải quyền đọc toàn bộ Personnel.
- Foundation chưa có employee browser transport, continuation hoặc usable raw
  clocking. Reserved employee route không phải implemented UI.
- `/equipe/pointage` vẫn là placeholder; không bị biến thành manager UI trong
  change này. Không tìm thấy existing Pointage page pack.
- Không có approved production trusted-client-address adapter/default.
  Injected test provider là testing evidence, không production provenance.
- Repository code/tests và recorded foundation DONE không phải live deployment,
  real-data permission hoặc QA evidence cho usable raw clocking.

## Affected Boundaries

| Boundary          | Owner / tác động                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloud runtime     | Existing apps/backoffice; employee route ngoài authenticated restaurant layout theo approved foundation entry placement, không app/domain topology mới. |
| Persistence       | @yuta/db-cloud cho Pointage-owned raw evidence và bounded technical metadata khi Design chứng minh cần; không db-pos hoặc shared local/cloud store.     |
| Personnel read    | Scoped lifecycle và minimal display projection; Personnel không bị ghi hoặc mất ownership.                                                              |
| Authorization     | authorization/pointage bổ sung continuation consumer semantics; không đổi credential crypto, grant catalog hoặc STAFF authority.                        |
| Attendance source | Raw events canonical; receipt/continuation metadata, derived session/current state không cạnh tranh source of truth.                                    |
| Transport         | New bounded employee contracts/handlers và server-only manager read; exact API shape chờ Design, không serialize rows/trusted contexts ra browser.      |
| Legal/privacy     | Synthetic-only scope; mọi real attendance và production/readiness decisions bị loại khỏi authorization này.                                             |
| Local/downstream  | POS/Site Agent/Display/offline/sync, Planning/Today/payroll không affected/không được integrate.                                                        |

### Mandatory Cross-Module Impact Check

| #   | Câu hỏi                                      | Finding                                                                                             |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Đọc/ghi data module khác?                    | Có: Personnel read; Pointage evidence write.                                                        |
| 2   | Đổi/làm mơ hồ canonical owner?               | Không; owner và canonical/derived distinction được giữ rõ.                                          |
| 3   | Module khác phải consume/react/update?       | Không downstream integration hoặc Personnel write-back trong slice.                                 |
| 4   | Shared permission/security/tenancy/identity? | Có: continuation, employee transport và dedicated scoped authorization.                             |
| 5   | Nhiều runtime?                               | Không; chỉ existing cloud Backoffice.                                                               |
| 6   | Legal/privacy/provider?                      | Có; synthetic-only và production-address/legal blockers.                                            |
| 7   | Accepted ADR/runtime/data boundary?          | Mở rộng cloud consumer/persistence cần Design; không thay ADR/runtime owner.                        |
| 8   | Product Decision phối hợp?                   | Có; P1–P14 đã được current user approve.                                                            |
| 9   | Coordinated contract/rollout?                | Có coordinated UI/transport/domain/Personnel contracts; rollout chưa authorize.                     |
| 10  | UI/UX nhiều page?                            | Không manager UI; employee Browser QA và manager server role/isolation tests cần phối hợp evidence. |

Impact classification: `CROSS_MODULE`. Control Tower review Gate 1, Gate 2,
Sensitive Design và Gate 3; không tự delegate hoặc suy ra approval.

## Lifecycle Baseline

Theo current Module Registry, không sửa các rows trong lượt này:

| Bounded row              | Product Decision trong registry | Implementation | Environment | Production Readiness | External Dependency |
| ------------------------ | ------------------------------- | -------------- | ----------- | -------------------- | ------------------- |
| Pointage foundation      | APPROVED                        | IMPLEMENTED    | NOT_ENABLED | BLOCKED              | BLOCKED             |
| Pointage usable workflow | Unresolved marker (—)           | NOT_STARTED    | NOT_ENABLED | NOT_ASSESSED         | NOT_ASSESSED        |

Current-user P1–P14 là approval mới có scope để lập Proposal/Analysis, được ghi
riêng với baseline registry chưa consolidate. Không dùng workflow progression
để tự promote bất kỳ lifecycle row nào. Dù registry broader workflow còn
NOT_ASSESSED, real-data/production enablement cho request này rõ ràng
NOT_AUTHORIZED và các named blockers chưa được giải quyết.

Foundation Gate 3 APPROVED, synced Specs, archive và Knowledge Consolidation
DONE là prerequisite evidence đã hoàn tất, không được reopen/rewrite.

## Requirement Readiness

Behavior-changing; không dùng `skip_specs: true`. Có thể viết requirements từ
P1–P14 và preserved authorities mà không lựa chọn giải pháp kỹ thuật trước hạn.

Exact future delta selection:

| Capability             | Loại     | Nội dung                                                                                                                                                                                   |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pointage/raw-clocking  | New      | Raw command/state behavior, immutable evidence, derived current/session state, time/grouping, idempotency/concurrency, minimal reads, synthetic-only/UI boundary.                          |
| authorization/pointage | Modified | Bounded Pointage continuation/consumer authority, no generic identity, current eligibility/replay/shared-device/non-disclosure requirements; giữ established grants/credential invariants. |

Không tạo delta cho `pointage/authority-foundation`, Personnel, Planning hoặc
Tenancy: change consume chúng, không đổi normative ownership/eligibility.
Authorization delta phải bổ sung usable-consumer requirements mà không xóa
historical foundation non-scope để giả foundation đã triển khai final workflow.

Exact storage/locking/continuation/time mechanics chưa quyết định không phải
requirement-level gap: P1–P14 xác định outcome và explicit Design deferrals.
Nếu Design cần Product behavior mới hoặc weaker authority, phải quay lại
Control Tower thay vì sửa requirements bằng assumption.

## UI / UX Applicability

`UI_AFFECTING: YES`. `BROWSER_QA_REQUIRED: YES`.
Target: employee `/pointage/[establishmentSlug]`, `NEW_PAGE`,
`NEW_CAPABILITY_DISCOVERY`; không renewal của manager placeholder.
Future UI dùng French theo Backoffice instructions và current shared UI rules;
không chốt visual appearance hoặc tạo page-pack artifacts ở Gate 1.

Required future behavior/evidence: mobile, tablet/shared tablet, applicable
desktop coverage, invalid credential, rate limiting, lifecycle denial,
NOT_CLOCKED_IN/CLOCKED_IN, IN/OUT committed success, state conflict,
double submit, retry after unknown timeout, cloud/database unavailable,
shared-device clearing, keyboard/basic accessibility, screenshots + SHA-256.
Viewport details theo current Backoffice/page-pack rules và QA protocol khi tới
đúng phase; không claim Browser QA PASS hoặc NOT_APPLICABLE ở Gate 1.

Non-enumerating failure giữ nguyên: không public response cho biết credential
đúng nhưng dossier former/upcoming. Identity chỉ hiển thị sau đủ scoped
authorization; manager read không lộ security audit. Continuation và shared-device
clearing không được giữ identity cho người dùng kế tiếp.

## Conflicts and Unknowns

### CONFLICT

Không có unresolved controlling-authority hoặc requirement-level conflict.

Có bounded documentation wording inconsistency: Current State foundation row
đã ghi implemented scoped Personnel relationship, nhưng unresolved
Planning/Pointage/Tâches row vẫn nói rộng “no current Personnel ... integration”.
Registry, current feature docs, normative foundation và code phân biệt rõ
foundation với usable workflow. Ghi là context-only clarification NEEDS REVIEW;
không dùng câu broad này để deny existing foundation, invent Product decision
hoặc mở rộng target edits. Không sửa Current State ở change-planning lượt này.

Archived Design không cung cấp multi-request employee session; nó yêu cầu
separate approved Design cho future continuation. P12 hiện authorize hướng
continuation về nguyên tắc cho change mới, không approval representation và
không cần sửa archive để tiến hành Proposal/Analysis.

### NEEDS REVIEW — Sensitive Design, không quyết định ở đây

- Exact continuation representation, lifetime, browser storage, rotation,
  binding, credential-reset interaction, CSRF/replay protection và inactivity/
  end-of-interaction clearing.
- Atomic transition/concurrency/stale-tab protection, receipt replay, semantic
  request identity và consistent acceptance boundary; không chọn lock/index/
  transaction isolation, receipt table hoặc nonce format.
- Time precision, DST/timezone historical interpretation, acceptance ordering
  và clock abstraction; không chọn physical fields hoặc timestamp mechanism.
- Raw-event/receipt/security-audit separation, minimum attribution,
  additive cloud persistence/migration/rollback và reconstructability.
- Test-only trusted-address composition, transport contracts,
  non-enumerating failure mapping, cache và cross-user leakage prevention.
- New-page design/page-pack evidence theo UI workflow, không biến Gate 1 thành
  visual Design approval hoặc implementation plan.

### NEEDS REVIEW — production-only, ngoài synthetic behavioral authorization

Exact retention duration; deletion/anonymization; legal hold; backup-retention
interaction; employee notice; detailed audit visibility; trusted production
client-address provenance.

P13/P14 cho approved injected synthetic test provider và synthetic/disposable
attendance development/testing; không cho phép credential processing khi không
có trusted test provider, không cho public production fallback và không real
attendance ở development/staging/production. Không tự áp retention Personnel F07
cho raw Pointage; không diễn giải immutable thành keep-forever.

### Human decision needed at this gate

Không còn câu hỏi Product prerequisite chưa có đáp án trong bounded P1–P14.
Reviewer cần phê duyệt hoặc yêu cầu sửa exact Proposal/Analysis và hai capability
paths. Các Sensitive Design và production-only questions không được đánh dấu
đã resolve chỉ để đạt READY_FOR_SPECS.

## Analysis Conclusion

READY_FOR_SPECS

Bounded synthetic-only raw-clocking scope và authority đã đủ rõ để chuẩn bị
delta requirements cho `pointage/raw-clocking` và `authorization/pointage`,
nhưng chỉ sau explicit Gate 1 approval trên exact artifact hashes.

Sensitive change: YES. UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES.
Không skip_specs. Apply authorization: NOT_GRANTED.
Production enablement: NOT_AUTHORIZED.

Dừng ở GATE 1 — PRODUCT / AUTHORITY REVIEW, Review status:
AWAITING_HUMAN_REVIEW. Không tạo Specs, Design, Tasks, implementation,
production provider, database operations, sync, archive hoặc lifecycle update.
