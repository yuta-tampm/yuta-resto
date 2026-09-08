Change: pointage-usable-raw-clocking
Gate: GATE 1 — PRODUCT / AUTHORITY REVIEW
Review status: APPROVED
Created: 2026-09-07T22:50:42.8286636+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T22:58:05.4685424+02:00
Gate 1 decision: APPROVED_FOR_SPECS

Resume integrity: exact Proposal, Analysis và scaffold hashes/path set MATCH.
Reviewed packet pre-approval SHA-256:
`05038a18bb84e89ab1064b4b9094662ff85ccd4fc13f7eb29ffccdff6281ec38`.
Approval chỉ cho hai delta Specs và Gate 2 packet. Các nội dung và stop
statements ban đầu dưới đây là snapshot của Gate 1; exact embedded artifacts
được giữ nguyên, không phải approval cho Design, Tasks hoặc Apply.

# Gate 1 Review Packet

## Request and Bounded Change

Current-user request `$yuta-run-change pointage-usable-raw-clocking` chỉ cho
Proposal, Analysis và packet này. P1–P14 là explicit Human Product/Security
shaping approval, không phải approval cho Gate 1 hoặc các bước sau.

Change mới thuộc `CROSS_MODULE`, Pointage làm owner: employee
`/pointage/[establishmentSlug]` ở existing Backoffice cloud, dedicated
identification và bounded continuation, CLOCK_IN/CLOCK_OUT, immutable raw
events, derived state/session, stable request/replay, server time,
cross-midnight và minimal manager server read. Attendance data chỉ
synthetic/disposable. Existing authority foundation là prerequisite đã
hoàn tất, không reopen hoặc rewrite.

Exact future capability set:

- New: `pointage/raw-clocking`.
- Modified: `authorization/pointage`.
- Unchanged dependencies: `pointage/authority-foundation`, Personnel và Tenancy.
- Planning không được consume.

Full scope/non-scope và P1–P14 nằm trong exact contents dưới đây. Không
manager UI, history/totals, correction, canonical/materialized session table,
Planning/payroll/TESE/PDF, local/POS/offline/sync, production provider hoặc
real attendance data. Không tạo Specs, Design, Tasks, code, migrations, test
data, page pack hoặc lifecycle update trong lượt này.

## Reviewed Artifact Integrity

Sorted exact reviewed path set gồm đúng hai Markdown artifacts:

| Repository-relative path                                    | Exact-byte SHA-256                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/pointage-usable-raw-clocking/analysis.md` | `f04e66f9f2307dc92aa9cdbd134fb4a35f9c1089459440c0ccfdb40c4a3e9146` |
| `openspec/changes/pointage-usable-raw-clocking/proposal.md` | `d42975cd06290431701e39d499edac93774275c1bb0f28f8474f6ff0e61816f1` |

Hash command đã dùng cho từng path:

```powershell
(Get-FileHash -LiteralPath $taskPath -Algorithm SHA256).Hash.ToLowerInvariant()
```

`$taskPath` được bind lần lượt tới từng exact repository-relative path trong
bảng. Hash được tính trên bytes thực của file, không normalize newline,
Unicode hoặc whitespace. Hai nội dung bên dưới là UTF-8 không BOM, LF, có
final LF; final LF nằm ngay trước closing fence. Khi resume phải đối chiếu
exact path set và hashes trước khi nhận approval.

CLI-required scaffold, không phải behavior artifact:

| Repository-relative path                                       | Exact-byte SHA-256                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/pointage-usable-raw-clocking/.openspec.yaml` | `84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e` |

```text
schema: yuta-spec-driven
created: 2026-09-07
```

## Exact Proposal Content

Source: `openspec/changes/pointage-usable-raw-clocking/proposal.md`.

```text
## Why

Pointage đã có authority/access foundation canonical nhưng chưa có luồng nhân
viên chấm công sử dụng được hoặc raw attendance evidence. P1–P14 được current
user phê duyệt cho phép định hình vertical slice đầu tiên, chỉ dùng dữ liệu
synthetic/disposable và không mở lại foundation đã archive.

## What Changes

- Thêm employee surface `/pointage/[establishmentSlug]` trong existing
  Backoffice cloud; public locator không phải tenant authority.
- Consume dedicated credential và Pointage-specific continuation ngắn hạn,
  self-only, shared-device safe. Mọi employee identify/state read/operation
  vẫn chịu Personnel eligibility và exact authority; credential proof alone
  không tạo employee authority.
- Chỉ `CLOCK_IN`/`CLOCK_OUT`: không có phiên mở + IN thì accept/open; có
  phiên mở + OUT thì accept/close; hai tổ hợp còn lại conflict, không event.
- Stable request identifier; cùng identifier/intent replay committed receipt
  chỉ sau current authorization/lifecycle checks, khác intent conflict.
  Competing requests cho một transition có tối đa một acceptance; timeout retry
  dùng lại identifier.
- Ghi immutable canonical raw events; derive session/current state. Cho phép
  nhiều phiên tuần tự, tối đa một phiên mở; không overlap, quota hoặc auto-close.
  Receipt/continuation metadata không trở thành attendance source of truth.
- Dùng server-observed instant, giữ đủ timezone/calendar context; không browser
  time/backdating/Planning rounding. Session qua midnight vẫn là một phiên,
  grouping ban đầu theo CLOCK_IN business date. OUT sau departure bị deny,
  giữ phiên mở cho future correction; không tự tạo close.
- Employee chỉ thấy own display name, `NOT_CLOCKED_IN`/`CLOCKED_IN`,
  open-session start date/time và immediate committed receipt. Xóa
  employee-specific state khi kết thúc interaction; không durable browser
  storage cho plaintext credential, trusted employee context hoặc identity.
- Thêm minimal manager server read dưới `pointage.establishment.read` cho
  scoped current-day raw events và current open session; OWNER/MANAGER theo
  exact grants, STAFF không được mở rộng quyền; không manager UI.
- Chỉ synthetic/disposable development, integration tests và Browser QA.
  Injected synthetic test provider không phải production provider; missing hoặc
  untrusted provenance vẫn fail closed.

### Explicit non-scope

Không manager/credential-management UI, monthly dashboard, employee attendance
history, today session history/totals hoặc prior clock-out display. Không
break/pause/meal/manual-adjustment events, correction, auto-close hay weekly
acknowledgement.

Không Planning reconciliation/rounding, +/-15-minute anomalies, Today
integration, weekly/monthly/payroll allocation, HS/HC, absences, jours fériés,
avantages en nature, payroll/TESE, closure hoặc PDF/export.

Không canonical/materialized session table; credential crypto/grant redesign;
standalone revoke/suspend; global employee identity; Personnel write-back;
browser-supplied tenant authority; app/deployment topology mới; POS, Site Agent,
db-pos, offline acceptance/replay queue/sync; production client-address provider;
real employee attendance ở bất kỳ environment nào; production enablement.

## Capabilities

### New Capabilities

- `pointage/raw-clocking`: employee raw-clock flow, transitions, immutable
  events, derived current/session state, time/grouping, idempotency/concurrency,
  minimal manager server read và synthetic-only boundary theo P1–P14.

### Modified Capabilities

- `authorization/pointage`: bổ sung bounded continuation/consumer authorization
  requirements cho usable slice; giữ credential crypto/grants, self-only scope,
  non-enumeration, current eligibility và reset-invalidates-old-authority
  invariants. Không thay foundation thành generic employee/cloud session.

`pointage/authority-foundation` và Personnel là unchanged dependencies, không
phải delta targets. Archived foundation không bị rewrite.

## Impact

- Classification: `CROSS_MODULE`; owning capability: Pointage.
- Runtime/data: existing `apps/backoffice` và `@yuta/db-cloud`; Personnel giữ
  dossier/lifecycle, Pointage giữ actual-work evidence, Planning giữ planned work
  và không được consume.
- Affected areas dự kiến: Backoffice employee route/transport/server foundation,
  scoped Personnel read projection, cloud persistence/repository, transport
  contracts và tests; portable auth primitives chỉ khi Sensitive Design yêu cầu
  cho continuation, không redesign credential.
- `Sensitive change: YES`; `UI_AFFECTING: YES`;
  `BROWSER_QA_REQUIRED: YES`. Exact continuation, timeout/storage/rotation,
  transaction, schema/migration, time precision và security mechanisms chờ
  Sensitive Design; Proposal/Analysis không lựa chọn chúng.
- Production vẫn blocked bởi retention, deletion/anonymization, legal hold,
  backup-retention interaction, employee notice, detailed audit visibility và
  trusted production client-address provenance.
- Lượt này chỉ tạo Proposal, Analysis, Gate 1 packet và CLI-required metadata;
  không Specs, Design, Tasks, implementation, lifecycle promotion, sync,
  archive hoặc deploy.
```

## Exact Analysis Content

Source: `openspec/changes/pointage-usable-raw-clocking/analysis.md`.

```text
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
```

## Authorities and Findings for Human Review

Authority routing và exact consulted paths được liệt kê đầy đủ trong
`Sources Consulted` của exact Analysis ở trên. Packet dùng current human
P1–P14 cho shaping; current normative Specs cho behavioral foundation;
Product Knowledge/Personnel/Registry cho ownership/lifecycle; approved
architecture/ADR cho runtime/tenancy; code/tests chỉ cho Implemented State.

Main normative authorities:

- [Pointage authority foundation](../../../openspec/specs/pointage/authority-foundation/spec.md).
- [Pointage authorization](../../../openspec/specs/authorization/pointage/spec.md).
- [Product Knowledge](../../PRODUCT_KNOWLEDGE.md).
- [Personnel](../../features/personnel/README.md).
- [Module Registry](../../MODULE_REGISTRY.md).
- [Authority Model](../../AUTHORITY_MODEL.md).
- [Workflow v3](../../YUTA_WORKFLOW_V3.md).
- [QA protocol](../../YUTA_QA_PROTOCOL.md).

### CONFLICT

Không có unresolved controlling-authority/requirement-level conflict.
Không đánh dấu later Design choices đã resolved.

Current State có wording broad ở unresolved Planning/Pointage/Tâches row
về “no current Personnel ... integration”, trong khi foundation row,
normative Specs, feature/registry và code chứng minh scoped lifecycle read.
Đây là context-only documentation clarification NEEDS REVIEW, không phải
quyền phủ nhận foundation hoặc tự sửa Current State. Không thay file đó.

Archived foundation Design chưa authorize multi-request session và yêu cầu
future reviewed Design. Current P12 cho continuation về nguyên tắc ở change
mới; representation vẫn chưa duyệt. Không sửa archive để hợp thức hóa.

### NEEDS REVIEW — Sensitive Design

Toàn bộ items sau vẫn mở, không có lựa chọn kỹ thuật nào ở Gate 1:

- Continuation representation, lifetime, storage, rotation, binding,
  credential-reset interaction, CSRF/replay và shared-device inactivity/clearing.
- Atomic transition, concurrency/stale tab, semantic request identity,
  receipt replay và consistent acceptance; không chọn locking/index/isolation.
- Precision, DST/timezone historical interpretation, acceptance ordering,
  clock abstraction; không chọn physical fields.
- Raw-event/receipt/security-audit separation, minimum attribution,
  additive persistence/migration/rollback và reconstructability.
- Test-only trusted-address composition, transport contracts,
  non-enumerating failures, cache/cross-user leakage.
- New-page design/page pack theo UI governance ở đúng phase.

Nếu bất kỳ quyết định nào cần mở rộng Product/authority hoặc yếu hóa
foundation, phải trở lại Control Tower, không tự sửa behavior cho khớp code.

### NEEDS REVIEW — Production and Real-data Blockers

Cả bảy blockers vẫn unresolved:

1. Exact retention duration.
2. Deletion/anonymization.
3. Legal hold.
4. Backup-retention interaction.
5. Employee notice.
6. Detailed audit visibility.
7. Trusted production client-address provenance.

P13/P14 chỉ cho approved injected synthetic test provider và
synthetic/disposable attendance khi implementation/testing được authorize
sau này. Không cho real attendance trong development/staging/production;
không processing khi missing/untrusted provider; không production fallback.
Không import Personnel retention hoặc diễn giải immutability thành keep-forever.

### Explicit Human Questions and Recommendation

Không còn unanswered Product prerequisite trong bounded P1–P14.
Câu hỏi Gate 1: reviewer có approve exact Proposal/Analysis, hai capability
paths và preserved non-scope để chuyển sang delta requirements hay yêu cầu sửa?

Recommendation: approve Gate 1 for Specs only nếu exact artifacts được chấp
nhận. Recommendation không phải approval. Sensitive Design review vẫn bắt buộc.
Current State contextual wording là follow-up ngoài target scope; không cần
invent Product decision để lập requirements.

## Provenance and Unrelated-work Isolation

Repository: `D:\working\yuta\yuta-resto`.
Baseline HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Baseline capture: `2026-09-07T22:45:06.0230285+02:00`.
Integrity comparison: `2026-09-07T22:50:42.8286636+02:00`.

Trước creation: selected change và review packet đều missing; không adoption
hoặc overwrite planning artifacts. `openspec new change
pointage-usable-raw-clocking` dùng configured default, không `--schema`.
Pinned metadata/status là `yuta-spec-driven`; CLI generic
`planningHome.defaultSchema: spec-driven` không thay schema pinned.

Checkout có unrelated tracked/untracked work từ đầu. Baseline
`git status --short` và `git rev-parse HEAD` được thu trước write.
Preserve cả Formalités hunk ở `packages/auth/src/index.ts`; không edit code.

Sorted repository-relative inventory gồm cached + untracked non-ignored
files từ `git ls-files --cached --others --exclude-standard`.
Mỗi group digest dùng sorted `path + TAB + lowercase SHA256`, LF-join,
không trailing LF, hash UTF-8. Group hashes trước/sau đều bằng nhau:

| Protected group   | Files | Aggregate SHA-256                                                  | Baseline comparison |
| ----------------- | ----- | ------------------------------------------------------------------ | ------------------- |
| implementation    | 1218  | `50d2146d8ef5f288c685c1dcd07ea818b0daae81a7e13acc9ef352be99e60e28` | MATCH               |
| mainSpecs         | 16    | `bd349acbbbf35fc0a8251b13f8232c2220cbef8878d0ac1748847c1257cacf05` | MATCH               |
| foundationArchive | 7     | `ba70f7956163e612bdc9c58b8a77c3035439f297415f646071a8e2465c4d74bf` | MATCH               |
| foundationReview  | 10    | `db809efbf915e9e6f449e694947993d3865c8f2de7d58f381a61047e103412b4` | MATCH               |
| workflow          | 19    | `7de69d2bb52312ffea1d706dd6bdd4a328ae687ccecf933a5a6c48743ccd6059` | MATCH               |
| knowledge         | 4     | `efc52d97ef08943152045e61b7ccb9f49afeb34cdd1c762d7ec25ecad379e1d5` | MATCH               |

Groups: all `apps/**` và `packages/**`; all `openspec/specs/**`;
exact `2026-09-07-pointage-authority-and-access-foundation` archive;
foundation review directory; `.agents/skills/**`, `openspec/schemas/**`,
`openspec/config.yaml`; bốn current knowledge files PRODUCT_KNOWLEDGE,
MODULE_REGISTRY, CURRENT_STATE và Personnel README.

Ngoài attribution của lượt này, có hai concurrent additions dưới
`docs/reviews/formalites-template-legal-review-governance/`:

- `04-knowledge-consolidation-review.md`.
- `04-proposed-knowledge.diff`.

Không được tạo/chỉnh sửa bởi lượt này; giữ nguyên, không nhận chúng vào
Pointage diff. Không claim toàn checkout clean hoặc không có concurrent work.

Exact attributed output path set:

```text
docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md
openspec/changes/pointage-usable-raw-clocking/.openspec.yaml
openspec/changes/pointage-usable-raw-clocking/analysis.md
openspec/changes/pointage-usable-raw-clocking/proposal.md
```

## Validation Evidence

| Command / check                                                                                                                                  | Result                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec new change pointage-usable-raw-clocking`                                                                                               | Exit 0; default selected, pinned yuta-spec-driven.                                                                                                               |
| `openspec instructions proposal --change pointage-usable-raw-clocking --json`                                                                    | Exit 0; followed returned path/rules/context.                                                                                                                    |
| `openspec instructions analysis --change pointage-usable-raw-clocking --json`                                                                    | Exit 0; proposal dependency reread before Analysis.                                                                                                              |
| `openspec status --change pointage-usable-raw-clocking --json`                                                                                   | Exit 0; proposal/analysis done, specs ready, design/tasks blocked; isPlanningComplete false.                                                                     |
| `openspec validate pointage-usable-raw-clocking --strict --json`                                                                                 | Exit 1; exactly one issue: no delta Specs yet. Full change validation is NOT PASS.                                                                               |
| `pnpm docs:check`                                                                                                                                | Exit 0; Documentation consistency check passed (36 current documents).                                                                                           |
| `pnpm architecture:check`                                                                                                                        | Exit 0; runtime imports, database URLs, client boundaries, migration baselines valid.                                                                            |
| `pnpm -r --if-present typecheck`                                                                                                                 | Exit 0; workspace typechecks completed. Not implementation or Browser QA proof for this change.                                                                  |
| `pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/proposal.md openspec/changes/pointage-usable-raw-clocking/analysis.md` | Exit 0; both reviewed source artifacts formatted.                                                                                                                |
| Gate 1 scope/content audit                                                                                                                       | Exact requested scope/P1–P14, two capability paths, preserved non-scope, Design deferrals, all seven blockers, valid READY_FOR_SPECS conclusion.                 |
| Final packet integrity / scoped formatting                                                                                                       | PASS: exact embedded contents/hashes match; source links resolve; later artifacts absent; three Markdown files pass scoped Prettier. No Gate 1 approval implied. |

Final formatting command:

```text
pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/proposal.md openspec/changes/pointage-usable-raw-clocking/analysis.md docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md
```

Exit 0. Exact-content check đọc source/packet bằng `[IO.File]::ReadAllText`,
extract từng `Exact Proposal Content` / `Exact Analysis Content` fenced block,
so sánh `[String]::Equals(..., [StringComparison]::Ordinal)` kể cả final LF,
và xác nhận SHA-256 source nằm trong packet. Cả hai MATCH; mọi source link
resolve; không có Specs/Design/Tasks. Docs và architecture checks được chạy lại
sau khi tạo packet, đều exit 0. `git diff --check --
openspec/changes/pointage-usable-raw-clocking
docs/reviews/pointage-usable-raw-clocking` exit 0 nhưng không bao phủ untracked
content; scoped Prettier và explicit inventory là evidence bổ sung, không dùng
Git omission làm chứng cứ duy nhất.

Native strict validation output:

```json
{
  "items": [
    {
      "id": "pointage-usable-raw-clocking",
      "type": "change",
      "valid": false,
      "issues": [
        {
          "level": "ERROR",
          "path": "file",
          "message": "Change must have at least one delta. No deltas found. Ensure your change has a specs/ directory with capability folders (e.g. specs/http-server/spec.md) containing .md files that use delta headers (## ADDED/MODIFIED/REMOVED/RENAMED Requirements) and that each requirement includes at least one \"#### Scenario:\" block. If this change intentionally modifies no specs (pure refactor, tooling, docs), set \"skip_specs: true\" in the change's .openspec.yaml instead. Tip: run \"openspec change show <change-id> --json --deltas-only\" to inspect parsed deltas."
        }
      ],
      "durationMs": 10
    }
  ],
  "summary": {
    "totals": {
      "items": 1,
      "passed": 0,
      "failed": 1
    },
    "byType": {
      "change": {
        "items": 1,
        "passed": 0,
        "failed": 1
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

Không tạo delta giả hoặc `skip_specs: true` để vượt validation. Gate 1
operational review readiness không đồng nghĩa full OpenSpec change validation.
Specs chỉ được tạo sau explicit Gate 1 approval.

Skipped: broad `pnpm format:check` (thay bằng scoped check, không
repository-wide formatter write); `pnpm test:cloud`, `pnpm test:local`,
`pnpm build:cloud`, migration/disposable-DB operations và Browser QA vì
chưa có authorized implementation. Không coi source inspection hoặc existing
foundation tests là VERIFY/QA cho change mới. Không tạo test attendance data.

## Required Stop

Analysis conclusion: READY_FOR_SPECS
UI_AFFECTING: YES
BROWSER_QA_REQUIRED: YES
Apply authorization: NOT_GRANTED
Production enablement: NOT_AUTHORIZED

GATE 1 — PRODUCT / AUTHORITY REVIEW
Review status: AWAITING_HUMAN_REVIEW

Cần explicit current-user Gate 1 approval trên exact hashes ở packet này
(ví dụ `Gate 1 decision: APPROVED_FOR_SPECS`) trước khi tạo delta Specs.
Không Specs, Design, Tasks, implementation, production provider,
sync/archive/deploy hoặc lifecycle promotion ở lượt này.
