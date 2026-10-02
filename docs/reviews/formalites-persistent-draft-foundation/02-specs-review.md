Change: formalites-persistent-draft-foundation

Gate: 2 — Requirements Review

Review status: APPROVED

Gate 2: APPROVED

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-04T23:29:32.6932801+02:00

Created: 2026-09-04

Regenerated: 2026-09-04T22:57:03.6464328+02:00

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — Personnel privacy, durable Formalités data, scoped authorization consumption and migration

## Targeted revision disposition

Current revision authority is the explicit human N4 Product/privacy decision.
The previously approved Gate 2 exact Spec SHA-256 was
`e540c535b6f738f4e3a24247f23c39483b68bd5673935b9df45b2317e26c880b`
(22 Requirements / 68 Scenarios). That approval is superseded only for the
targeted N4 wording revised here; Gate 1 remains approved and unchanged.

| Revision | Requested correction                             | Regenerated disposition                                                                                                                                                          |
| -------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N4-R1    | Retention behavior for bounded development slice | Both DRAFT and ABANDONED are retained; no user hard delete, automatic expiry, purge or anonymization; no infinite-retention promise                                              |
| N4-R2    | Local versus production boundary                 | Local/development durable persistence may proceed only after Sensitive Design approval; production retention/readiness remains deferred and NOT_AUTHORIZED                       |
| N4-R3    | Deferred authority                               | No duration, Personnel inheritance, legal hold, cleanup job or backup/PITR duration is inferred; final retention/deletion requires a future approved privacy/production decision |

### Preserved earlier R1–R3 revision history

Prior Gate 2 review result: `CHANGES_REQUESTED`. Revision authority is the
explicit current-user instruction for this change. Previous reviewed Spec
SHA-256 was
`268df071e1447234ffc88dcd1159a416043aea20b9d5c1977d7ca584187eed22`;
previous Gate 2 packet SHA-256 was
`cdf870a865ece6ac0ee6397504973221922573edf02973baf1e898170930bb6e`.

| Revision | Requested correction                                   | Regenerated disposition                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1       | Post-reconciliation acknowledgement semantics          | Added observable resolution against the exact trusted Personnel source state reconciled; KEEP does not reprompt against unchanged state or redefine Personnel truth; REFRESH adopts the accepted trusted value; later source change creates a new divergence |
| R2       | Mutation-time eligibility revalidation                 | Added stale-UI scenario: authoritative CDI → non-CDI before SAVE/EDIT commit rejects the mutation, preserves prior state and exposes/reloads recovery state                                                                                                  |
| R3       | Retry/idempotency wording returned to behavioral level | Removed `retry identity`; same logical replay remains duplicate-safe, while a materially different mutation is evaluated as distinct under current rules                                                                                                     |

## Current N4 revision disposition

Behavioral Spec semantics outside N4: **UNCHANGED** from the approved Gate 2.
The N4 requirement and decision section alone now encode the approved bounded
retention behavior.

N4: `RESOLVED_FOR_BOUNDED_SLICE`. Local/development durable persistence is no
longer blocked solely by an absent Product retention duration, but still needs
Sensitive Design approval, Tasks and explicit Apply approval. Production
retention/readiness remains `DEFERRED / NOT_AUTHORIZED`.

Only the existing delta Spec and this Gate 2 packet are revised. Gate 1 is not
reopened; Proposal, Analysis and approved Gate 1 packet bytes remain unchanged.

## Gate 1 approval and integrity

Gate 1 được duyệt bằng explicit current-user instruction cho đúng change này.
Trước khi tạo Specs, hai reviewed artifacts khớp chính xác hash được duyệt:

| Gate 1 artifact                                                       | Approved and current SHA-256                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/formalites-persistent-draft-foundation/analysis.md` | `11f11ee989b339dad2286fd6e2bc34e3119514a55dd4717123bea529a28ad693` |
| `openspec/changes/formalites-persistent-draft-foundation/proposal.md` | `2166d890b0449b63c925c798724e9e66432a8bff5debbccab238851ade73db18` |

Gate 1 packet đã được chuyển sang `APPROVED` theo workflow. Current approved
packet SHA-256 sau metadata approval:
`17bf41fa36705e6ec96c93b08d9a0419aff1c88fb9e1ba84178f9c96f7462815`.

Không có path/hashes Gate 1 nào bị thay đổi ngoài review-status metadata được
workflow cho phép. Analysis vẫn `READY_FOR_SPECS`; N1–N3 remain resolved. N4 is
now resolved only for the bounded slice by the current explicit decision;
Proposal/Analysis are preserved as historical Gate 1 authority rather than
rewritten.

## Delta Spec under review

| Capability                               | Operation | Exact path                                                                                                     | SHA-256                                                            | Requirements | Scenarios |
| ---------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -----------: | --------: |
| `formalites/persistent-draft-foundation` | ADDED     | `openspec/changes/formalites-persistent-draft-foundation/specs/formalites/persistent-draft-foundation/spec.md` | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` |           22 |        70 |

Hash command:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <repository-relative-path>
```

Hash là lowercase SHA-256 của exact formatted bytes. Không có delta khác.

## Requirements and scenario coverage matrix

|   # | Gate 1 area                                         | Spec requirement                                                           | Covered scenarios                                                                                                                                                                                                                               |
| --: | --------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | A — Existing employee / scope eligibility           | Eligibility tạo draft dựa trên Personnel hiện tại và trusted scope         | Tạo draft cho employee CDI hợp lệ; Từ chối tạo draft cho employee CDD hiện tại; Employee không thuộc đúng scope; Không thêm eligibility gate ngoài CDI hiện tại                                                                                 |
|   2 | B — Authorization                                   | Formalités authorization và Personnel source authorization độc lập         | Đọc draft với Formalités READ; Mutation thiếu Formalités MANAGE; Personnel READ không cấp Formalités authority; Formalités READ không cấp Personnel source authority                                                                            |
|   3 | B, M — Trusted authority and IDs                    | Browser identifiers và claims không tạo authority                          | Browser tự khai scope hoặc role; Biết employeeId hoặc draftId                                                                                                                                                                                   |
|   4 | C, K — Lifecycle and explicit save                  | Draft lifecycle sử dụng explicit persistence                               | Create tạo trạng thái DRAFT; Explicit save; Không autosave khi rời trang; Reopen draft đã lưu                                                                                                                                                   |
|   5 | C, F, P — Abandon                                   | Abandonment yêu cầu reason và giữ record                                   | Abandon thiếu reason; Abandon thành công; Không sửa abandoned draft; Không hard-delete khi abandon                                                                                                                                              |
|   6 | C — New draft after abandon                         | Có thể tạo draft mới sau abandonment                                       | Tạo mới sau abandonment; Không tạo mới nếu eligibility đã mất                                                                                                                                                                                   |
|   7 | D — Cardinality                                     | Tối đa một active draft trong business scope                               | Active draft đã tồn tại trước create; Hai create đồng thời                                                                                                                                                                                      |
|   8 | E — probationChoice states                          | probationChoice có ba trạng thái chuẩn bị đã duyệt                         | Draft mới bắt đầu ở UNDECIDED; Lưu khi chưa quyết định; Lưu INCLUDE; Lưu EXCLUDE; Từ chối state ngoài allowlist                                                                                                                                 |
|   9 | E — Non-legal meaning                               | INCLUDE không phải kết luận hoặc khuyến nghị pháp lý                       | Hiển thị INCLUDE                                                                                                                                                                                                                                |
|  10 | G — Personnel snapshot                              | Draft giữ đúng Personnel reference, anchor và source snapshot              | Capture source khi create; Hai identity facts vẫn tách biệt; Không capture field ngoài projection                                                                                                                                               |
|  11 | H — Change detection                                | Reopen phát hiện relevant Personnel divergence theo source facts           | Relevant source fact thay đổi; Chỉ revision thay đổi; Không silent refresh                                                                                                                                                                      |
|  12 | I — Reconciliation choices                          | Reconciliation là explicit và per divergent fact                           | Hiển thị hai phía của divergence; Mixed KEEP và REFRESH; REFRESH dùng trusted current value                                                                                                                                                     |
|  13 | I — Post-reconciliation semantics                   | Reconciliation thành công giải quyết đúng source state đã đối chiếu        | KEEP không lặp lại prompt khi Personnel source không đổi; KEEP không định nghĩa lại Personnel truth; REFRESH giải quyết divergence bằng trusted accepted value; Personnel đổi lại sau reconciliation thành công                                 |
|  14 | I, L — Stale reconciliation                         | Reconciliation stale phải fail visibly                                     | Personnel đổi trong lúc OWNER reconcile                                                                                                                                                                                                         |
|  15 | J — CDI to CDD recovery and commit-time eligibility | Current Personnel eligibility độc lập với reconciliation choice            | CDI chuyển thành CDD sau create; Recovery state cho phép đọc và abandon; Recovery state chặn normal continuation; KEEP không giữ eligibility; Không tự xử lý draft khi mất eligibility; Eligibility đổi sang non-CDI trước khi mutation cam kết |
|  16 | J — CDD to CDI recovery                             | CDI eligibility phục hồi không bỏ qua reconciliation                       | CDD trở lại CDI với relevant divergence; Eligibility được đánh giá lại; Abandoned draft không tái kích hoạt                                                                                                                                     |
|  17 | K — Save/reopen failure                             | Save failure giữ nguyên authoritative saved state                          | Save thành công rồi reload; Save thất bại                                                                                                                                                                                                       |
|  18 | L — Concurrent/stale/replay                         | Concurrent và stale mutations không dùng silent last-write-wins            | Hai save xung đột; Save cạnh tranh với abandon; Stale editor sau mutation khác; Replay sau response loss; Mutation khác biệt đáng kể không phải equivalent replay                                                                               |
|  19 | M — Tenancy/resource isolation                      | Mọi resource access giữ full tenant scope                                  | Employee đúng organization nhưng sai establishment; Draft thuộc organization khác; Draft thuộc establishment khác                                                                                                                               |
|  20 | N — Personnel write isolation                       | Formalités draft không ghi ngược vào Personnel                             | KEEP chỉ tác động draft; REFRESH không write back Personnel; Lifecycle mutation không tạo Personnel history                                                                                                                                     |
|  21 | O — Prototype preservation                          | Employee-connected capability được mở rộng mà không phá prototype hiện tại | Generic fictional prototype không bị xóa theo spec này; Existing source-read protection được giữ                                                                                                                                                |
|  22 | P — Bounded retention only                          | Workflow giữ draft mà không hứa retention vô hạn                           | Active draft được giữ mà không có automatic expiry; Abandoned record vẫn được giữ và đọc theo quyền; Workflow không cung cấp user hard delete; Final retention policy cần quyết định riêng                                                      |

Tổng kiểm tra theo header: **22 Requirements / 70 Scenarios**. Mọi Requirement
có ít nhất một Scenario và mọi Scenario dùng đúng `#### Scenario:` với
WHEN/THEN observable behavior.

## Mandatory error and recovery coverage

| Required case from approval             | Exact scenario evidence                                                                                          |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Ineligible current CDD employee create  | Từ chối tạo draft cho employee CDD hiện tại                                                                      |
| Valid CDI create                        | Tạo draft cho employee CDI hợp lệ                                                                                |
| Duplicate/concurrent create             | Active draft đã tồn tại trước create; Hai create đồng thời                                                       |
| SAVE while UNDECIDED                    | Lưu khi chưa quyết định                                                                                          |
| INCLUDE / EXCLUDE save                  | Lưu INCLUDE; Lưu EXCLUDE                                                                                         |
| Reload/reopen                           | Reopen draft đã lưu; Save thành công rồi reload                                                                  |
| Failed save preserves prior state       | Save thất bại                                                                                                    |
| Abandonment missing reason              | Abandon thiếu reason                                                                                             |
| Successful abandonment                  | Abandon thành công                                                                                               |
| Create after abandonment                | Tạo mới sau abandonment                                                                                          |
| Relevant Personnel fact change          | Relevant source fact thay đổi                                                                                    |
| Irrelevant revision-only change         | Chỉ revision thay đổi                                                                                            |
| Mixed KEEP/REFRESH                      | Mixed KEEP và REFRESH                                                                                            |
| KEEP against unchanged source           | KEEP không lặp lại prompt khi Personnel source không đổi; KEEP không định nghĩa lại Personnel truth              |
| REFRESH accepted trusted value          | REFRESH giải quyết divergence bằng trusted accepted value                                                        |
| New source state after reconciliation   | Personnel đổi lại sau reconciliation thành công                                                                  |
| Personnel changes during reconciliation | Personnel đổi trong lúc OWNER reconcile                                                                          |
| CDI → CDD recovery                      | CDI chuyển thành CDD sau create; Recovery state cho phép đọc và abandon; Recovery state chặn normal continuation |
| CDI → non-CDI before mutation commit    | Eligibility đổi sang non-CDI trước khi mutation cam kết                                                          |
| CDD → CDI recovery/reconciliation       | CDD trở lại CDI với relevant divergence; Eligibility được đánh giá lại                                           |
| Stale concurrent edit                   | Hai save xung đột; Save cạnh tranh với abandon; Stale editor sau mutation khác                                   |
| Wrong-scope employee                    | Employee không thuộc đúng scope; Employee đúng organization nhưng sai establishment                              |
| Wrong-scope draft                       | Draft thuộc organization khác; Draft thuộc establishment khác                                                    |
| Missing/denied Formalités permission    | Mutation thiếu Formalités MANAGE; Browser tự khai scope hoặc role                                                |
| Personnel source READ denied            | Formalités READ không cấp Personnel source authority                                                             |
| No Personnel write-back                 | KEEP chỉ tác động draft; REFRESH không write back Personnel; Lifecycle mutation không tạo Personnel history      |

## N1–N4 decision mapping

| Decision                     | Spec mapping                                                                                                                                                                                                                                                                                                                                                    | Review result                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| N1 — probationChoice         | `probationChoice có ba trạng thái chuẩn bị đã duyệt` and `INCLUDE không phải kết luận hoặc khuyến nghị pháp lý` define only UNDECIDED/INCLUDE/EXCLUDE, exact French meanings, initial UNDECIDED, explicit SAVE and the non-legal boundary                                                                                                                       | RESOLVED and fully represented |
| N2 — abandonmentReason       | `Abandonment yêu cầu reason và giữ record` requires missing/blank rejection and reason retention as workflow metadata, without enum/length/storage design                                                                                                                                                                                                       | RESOLVED and fully represented |
| N3 — current CDI eligibility | `Eligibility tạo draft dựa trên Personnel hiện tại và trusted scope`, `Có thể tạo draft mới sau abandonment`, `Current Personnel eligibility độc lập với reconciliation choice` and `CDI eligibility phục hồi không bỏ qua reconciliation` define create eligibility, mutation-time revalidation, bounded non-CDI recovery and CDI re-evaluation/reconciliation | RESOLVED and fully represented |
| N4 — privacy/retention       | `Workflow giữ draft mà không hứa retention vô hạn` plus `Bounded N4 Decision` retains DRAFT/ABANDONED without user hard delete or automatic expiry/purge/anonymization, while deferring final policy and production authority                                                                                                                                   | RESOLVED_FOR_BOUNDED_SLICE     |

N4 is resolved only for this bounded local/development slice. Sensitive Design
still requires human revalidation before Tasks/Apply. No production retention,
migration, enablement or deployment authority is granted.

## Cross-capability authority check

- Delta duy nhất là new capability
  `formalites/persistent-draft-foundation`.
- Normative `authorization/formalites` chỉ được consume:
  `formalites.read` cho read và `formalites.manage` cho mutation.
  Grants không được định nghĩa lại hoặc mở rộng.
- Personnel source read vẫn là authorization độc lập. Personnel vẫn sở hữu
  current facts, revision, history, receipts và register.
- Draft/snapshot/reconciliation/abandonment chỉ thuộc bounded Formalités state.
  KEEP/REFRESH không ghi ngược Personnel và không merge history.
- Trusted authenticated membership, organization và active-establishment
  boundary được giữ; browser claims và IDs không tạo authority.
- `personnel/reconstructable-value-history` và main
  `authorization/formalites` không bị sửa.

Cross-module boundary: **PRESERVED**. Không có Product/authority decision mới
được suy ra từ implementation.

## Exclusions check

Spec không tạo requirement cho address, remuneration/salary, legal contract
generation, PDF, signature, DPAE, DSN, payroll, provider, Documents handoff,
AI/OCR/extraction, legal advice, probation duration/renewal, MANAGER/STAFF
grants, Personnel write-back, generic workflow engine, production enablement
hoặc migration execution.

Spec không có table/column/index/SQL lock/API route/React component/idempotency
mechanism/transaction primitive. Technical Design tồn tại riêng và đang được
regenerate cho Sensitive Design review; các mechanics đó không trở thành
behavioral requirement trong Spec.

## Strict validation

Command actually run:

```text
openspec validate formalites-persistent-draft-foundation --strict
```

Exact result:

```text
Change 'formalites-persistent-draft-foundation' is valid
```

Exit code: **0 — PASS**.

Scoped formatting and strict validation were rerun after targeted N4 revision.
No implementation-shaped field or mechanism was introduced.

## Changed assumptions and remaining ambiguity

Changed assumption since approved Gate 2: **N4 only**, by explicit human
Product/privacy decision. R1–R3, N1–N3 and every non-retention behavior remain
unchanged. No Product owner, field, permission, runtime or Personnel projection
was added.

N4 is now encoded as `RESOLVED_FOR_BOUNDED_SLICE`: retain active/abandoned
records, no user hard delete or automatic expiry/purge/anonymization, and no
infinite-retention promise. Final retention/deletion and production
backup/readiness remain future decisions. Reason length/transport/storage shape,
persistence model, concurrency mechanism, transaction boundary, migration,
rollback and UI seam remain Design questions inside the approved behavioral
boundary.

No new owner, permission, grant, runtime, provider, legal conclusion or
Personnel projection was introduced.

## Exact complete Spec content

```markdown
## Purpose

Capability này cho phép OWNER lưu và mở lại một bản chuẩn bị CDI gắn với nhân
viên hiện có, đồng thời giữ Personnel là nguồn dữ liệu có thẩm quyền và bảo vệ
đầy đủ quyền truy cập cũng như phạm vi organization/establishment.

## ADDED Requirements

### Requirement: Eligibility tạo draft dựa trên Personnel hiện tại và trusted scope

Hệ thống SHALL chỉ cho phép tạo draft khi authenticated request có trusted
organization, trusted active establishment và một employee Personnel hiện tồn
tại trong chính xác scope đó, đồng thời `employmentTermType` hiện tại của
employee là `indefinite`. Hệ thống MUST từ chối tạo draft cho employee hiện tại
không phải CDI. Trạng thái full-time, upcoming, departure hoặc điều kiện pháp lý
về période d’essai MUST NOT trở thành eligibility gate của capability này.

#### Scenario: Tạo draft cho employee CDI hợp lệ

- **WHEN** OWNER được phép tạo draft cho employee hiện có trong trusted organization và active establishment, và Personnel hiện có `employmentTermType = indefinite`
- **THEN** hệ thống SHALL chấp nhận eligibility tạo draft

#### Scenario: Từ chối tạo draft cho employee CDD hiện tại

- **WHEN** employee trong đúng trusted scope có `employmentTermType = fixed_term`
- **THEN** hệ thống SHALL từ chối tạo draft và SHALL không tạo durable draft

#### Scenario: Employee không thuộc đúng scope

- **WHEN** employee không tồn tại trong tổ hợp trusted organization và active establishment của request
- **THEN** hệ thống SHALL fail closed và SHALL không tạo draft

#### Scenario: Không thêm eligibility gate ngoài CDI hiện tại

- **WHEN** employee trong đúng trusted scope hiện là CDI nhưng có thuộc tính part-time, không upcoming hoặc có departure date
- **THEN** hệ thống SHALL NOT từ chối eligibility chỉ vì các thuộc tính đó

### Requirement: Formalités authorization và Personnel source authorization độc lập

Mọi thao tác đọc draft SHALL yêu cầu operation `formalites.read`; mọi thao tác
tạo, lưu, sửa, reconcile hoặc abandon draft SHALL yêu cầu operation
`formalites.manage`. Việc đọc current Personnel source để kiểm tra eligibility,
hiển thị giá trị hiện tại hoặc reconcile SHALL tiếp tục yêu cầu Personnel source
read authorization độc lập. Capability này SHALL NOT định nghĩa lại role grants
hoặc dùng Personnel permission thay cho Formalités permission.

#### Scenario: Đọc draft với Formalités READ

- **WHEN** caller có trusted scoped context và `formalites.read` nhưng không thực hiện mutation
- **THEN** hệ thống SHALL cho phép đọc draft thuộc đúng scope, tùy thuộc các source-read checks áp dụng

#### Scenario: Mutation thiếu Formalités MANAGE

- **WHEN** caller yêu cầu tạo, lưu, sửa, reconcile hoặc abandon mà không có `formalites.manage`
- **THEN** hệ thống SHALL từ chối mutation và SHALL không thay đổi draft

#### Scenario: Personnel READ không cấp Formalités authority

- **WHEN** caller có Personnel source read permission nhưng thiếu Formalités operation cần thiết
- **THEN** hệ thống SHALL từ chối Formalités operation

#### Scenario: Formalités READ không cấp Personnel source authority

- **WHEN** caller có `formalites.read` nhưng bị từ chối Personnel source read cần thiết để reopen và so sánh current source
- **THEN** hệ thống SHALL fail closed cho operation cần source đó và SHALL không lộ current Personnel values

### Requirement: Browser identifiers và claims không tạo authority

Hệ thống SHALL lấy authenticated user, active membership, trusted organization
và trusted active establishment từ server-side trusted context. Browser-provided
role, organization, establishment, employeeId hoặc draftId SHALL chỉ được xem là
untrusted input hoặc lookup candidate và MUST NOT tạo, mở rộng hoặc thay thế
authority.

#### Scenario: Browser tự khai scope hoặc role

- **WHEN** browser gửi organization, establishment hoặc role không khớp trusted context
- **THEN** hệ thống SHALL bỏ qua các claim đó như authorization proof và SHALL fail closed

#### Scenario: Biết employeeId hoặc draftId

- **WHEN** caller biết một employeeId hoặc draftId nhưng thiếu trusted scope hoặc permission cần thiết
- **THEN** hệ thống SHALL từ chối truy cập mà không coi identifier là authority

### Requirement: Draft lifecycle sử dụng explicit persistence

Tạo thành công SHALL đưa record vào trạng thái `DRAFT`. Một `DRAFT` SHALL hỗ
trợ explicit SAVE, leave, REOPEN, EDIT và explicit ABANDON. Hệ thống MUST NOT
autosave; chỉ một explicit mutation thành công mới được trình bày là durable.

#### Scenario: Create tạo trạng thái DRAFT

- **WHEN** một create hợp lệ hoàn tất thành công
- **THEN** hệ thống SHALL tạo một durable record ở trạng thái `DRAFT`

#### Scenario: Explicit save

- **WHEN** OWNER thực hiện explicit SAVE hợp lệ cho active `DRAFT`
- **THEN** hệ thống SHALL lưu trạng thái Formalités-owned được chấp nhận

#### Scenario: Không autosave khi rời trang

- **WHEN** OWNER sửa cục bộ rồi rời trang mà không có explicit SAVE thành công
- **THEN** hệ thống SHALL NOT trình bày hoặc lưu các thay đổi cục bộ đó như durable state

#### Scenario: Reopen draft đã lưu

- **WHEN** OWNER rời, reload hoặc quay lại một active `DRAFT` đã được lưu thành công
- **THEN** hệ thống SHALL mở lại last successful saved state của draft

### Requirement: Abandonment yêu cầu reason và giữ record

ABANDON SHALL yêu cầu một `abandonmentReason` không blank. Reason này SHALL là
workflow metadata, SHALL được giữ cùng record đã abandon và SHALL NOT được coi
là input nội dung chuẩn bị hợp đồng thứ hai. ABANDON thành công SHALL chuyển
record sang `ABANDONED`; workflow này MUST NOT hard-delete record đó và
`ABANDONED` MUST NOT được sửa như active `DRAFT`.

#### Scenario: Abandon thiếu reason

- **WHEN** OWNER yêu cầu ABANDON mà reason bị thiếu hoặc chỉ gồm khoảng trắng
- **THEN** hệ thống SHALL từ chối abandonment và SHALL giữ nguyên active `DRAFT`

#### Scenario: Abandon thành công

- **WHEN** OWNER có `formalites.manage` gửi ABANDON hợp lệ với reason không blank
- **THEN** hệ thống SHALL chuyển draft sang `ABANDONED` và SHALL giữ reason với workflow record

#### Scenario: Không sửa abandoned draft

- **WHEN** caller cố EDIT hoặc SAVE một record `ABANDONED` như active draft
- **THEN** hệ thống SHALL từ chối mutation và SHALL không tái kích hoạt record

#### Scenario: Không hard-delete khi abandon

- **WHEN** draft được abandon thành công
- **THEN** workflow SHALL giữ record `ABANDONED` thay vì hard-delete record đó

### Requirement: Có thể tạo draft mới sau abandonment

Một prior `ABANDONED` record SHALL NOT tự động được tái kích hoạt và SHALL NOT
chặn vĩnh viễn draft mới. Hệ thống SHALL cho phép OWNER tạo draft mới cho cùng
employee và formality type khi current eligibility, authorization và cardinality
đều hợp lệ.

#### Scenario: Tạo mới sau abandonment

- **WHEN** prior draft của cùng employee và formality type là `ABANDONED`, không còn active draft và current Personnel eligibility hợp lệ
- **THEN** hệ thống SHALL cho phép một create mới mà không sửa hoặc tái kích hoạt prior record

#### Scenario: Không tạo mới nếu eligibility đã mất

- **WHEN** prior draft đã `ABANDONED` nhưng employee hiện không còn CDI
- **THEN** hệ thống SHALL từ chối create mới theo current Personnel eligibility

### Requirement: Tối đa một active draft trong business scope

Tại mọi thời điểm, hệ thống MUST duy trì tối đa một active `DRAFT` cho cùng tổ
hợp organization, establishment, employee và formality type. Create MUST NOT
silent-overwrite active draft hiện có. Caller SHALL nhận outcome có thể phân
biệt create thành công, existing active draft hoặc conflict.

#### Scenario: Active draft đã tồn tại trước create

- **WHEN** một create hợp lệ được yêu cầu nhưng active `DRAFT` đã tồn tại trong cùng business scope
- **THEN** hệ thống SHALL không tạo record active thứ hai và SHALL trả outcome existing active draft có thể nhận biết

#### Scenario: Hai create đồng thời

- **WHEN** hai create hợp lệ cạnh tranh cho cùng business scope khi chưa có active draft
- **THEN** hệ thống MUST kết thúc với nhiều nhất một active `DRAFT`
- **AND** mỗi caller SHALL nhận outcome create thành công, existing active draft hoặc conflict có thể nhận biết, không silent overwrite

### Requirement: probationChoice có ba trạng thái chuẩn bị đã duyệt

Durable `probationChoice` SHALL chỉ có ba semantic states: `UNDECIDED`,
`INCLUDE` và `EXCLUDE`. Meaning hiển thị tương ứng MUST là `À décider`,
`Prévoir une période d’essai` và `Ne pas prévoir de période d’essai`. Draft mới
SHALL khởi tạo là `UNDECIDED`, và explicit SAVE SHALL được phép trong trạng thái
này. Capability MUST NOT thêm `NOT_APPLICABLE` hoặc mặc định ngầm sang INCLUDE
hay EXCLUDE.

#### Scenario: Draft mới bắt đầu ở UNDECIDED

- **WHEN** draft được tạo thành công
- **THEN** `probationChoice` SHALL là `UNDECIDED` với meaning `À décider`

#### Scenario: Lưu khi chưa quyết định

- **WHEN** OWNER explicit SAVE một draft hợp lệ với `probationChoice = UNDECIDED`
- **THEN** hệ thống SHALL cho phép lưu trạng thái đang làm dở đó

#### Scenario: Lưu INCLUDE

- **WHEN** OWNER chọn `INCLUDE` và explicit SAVE thành công
- **THEN** hệ thống SHALL giữ hướng chuẩn bị `Prévoir une période d’essai`

#### Scenario: Lưu EXCLUDE

- **WHEN** OWNER chọn `EXCLUDE` và explicit SAVE thành công
- **THEN** hệ thống SHALL giữ hướng chuẩn bị `Ne pas prévoir de période d’essai`

#### Scenario: Từ chối state ngoài allowlist

- **WHEN** untrusted input cung cấp probation choice không phải UNDECIDED, INCLUDE hoặc EXCLUDE
- **THEN** hệ thống SHALL từ chối giá trị đó và SHALL không thay đổi durable draft

### Requirement: INCLUDE không phải kết luận hoặc khuyến nghị pháp lý

`INCLUDE` SHALL chỉ biểu thị OWNER muốn preparation draft bao gồm một hướng về
période d’essai. Hệ thống MUST NOT trình bày lựa chọn này như xác nhận về legal
eligibility, legal validity, duration, renewal, collective-agreement compliance
hoặc legal recommendation.

#### Scenario: Hiển thị INCLUDE

- **WHEN** saved `probationChoice` là `INCLUDE`
- **THEN** hệ thống SHALL trình bày đây là hướng chuẩn bị của OWNER
- **AND** SHALL NOT khẳng định bất kỳ kết luận pháp lý, duration hoặc renewal nào

### Requirement: Draft giữ đúng Personnel reference, anchor và source snapshot

Draft SHALL giữ employee reference, Personnel revision anchor và source
snapshot gồm đúng bảy atomic Personnel facts đã duyệt: `givenNames`,
`familyName`, `position`, `qualification`, `employmentTermType`, `entryDate` và
`contractWeeklyMinutes`. Bảy facts này có thể được trình bày thành sáu nhóm hiện
tại, nhưng hệ thống MUST NOT tạo một combined identity business field. Personnel
SHALL tiếp tục là authoritative source của các facts đó.

#### Scenario: Capture source khi create

- **WHEN** một draft được tạo thành công
- **THEN** hệ thống SHALL gắn đúng employee reference và Personnel revision anchor
- **AND** SHALL capture bảy approved raw source facts từ trusted current Personnel source

#### Scenario: Hai identity facts vẫn tách biệt

- **WHEN** snapshot chứa `givenNames` và `familyName`
- **THEN** hệ thống SHALL giữ chúng như hai atomic source facts dù UI có thể trình bày chung một identity group

#### Scenario: Không capture field ngoài projection

- **WHEN** Personnel có các field khác ngoài bảy approved source facts
- **THEN** capability SHALL NOT đưa các field đó vào approved Formalités source snapshot bằng suy đoán

### Requirement: Reopen phát hiện relevant Personnel divergence theo source facts

Khi REOPEN hoặc đọc active draft, hệ thống SHALL so sánh current authoritative
Personnel source với stored snapshot. Revision anchor thay đổi một mình MUST NOT
tự động được trình bày là relevant draft divergence; divergence SHALL được xác
định từ thay đổi của bảy approved raw source facts. Hệ thống MUST NOT silent
refresh snapshot hoặc draft values.

#### Scenario: Relevant source fact thay đổi

- **WHEN** ít nhất một trong bảy approved source facts khác giữa stored snapshot và current Personnel
- **THEN** hệ thống SHALL báo relevant divergence cho đúng fact bị ảnh hưởng

#### Scenario: Chỉ revision thay đổi

- **WHEN** Personnel revision thay đổi nhưng cả bảy approved source facts vẫn bằng stored snapshot
- **THEN** hệ thống SHALL NOT báo relevant draft divergence chỉ dựa trên revision change

#### Scenario: Không silent refresh

- **WHEN** relevant divergence được phát hiện khi REOPEN
- **THEN** hệ thống SHALL giữ stored draft/snapshot cho tới khi OWNER thực hiện reconciliation hợp lệ

### Requirement: Reconciliation là explicit và per divergent fact

Khi approved source facts diverge, hệ thống SHALL hiển thị stored draft/snapshot
value và current Personnel value cho từng fact được hỗ trợ. OWNER SHALL có thể
chọn riêng `KEEP DRAFT VALUE` hoặc `REFRESH FROM PERSONNEL` cho mỗi divergent
fact. REFRESH SHALL dùng current trusted server-side Personnel value tại lúc
reconciliation được chấp nhận; browser replacement MUST NOT trở thành Personnel
source. Các lựa chọn chỉ thay đổi Formalités-owned draft state.

#### Scenario: Hiển thị hai phía của divergence

- **WHEN** một approved source fact có relevant divergence
- **THEN** hệ thống SHALL hiển thị stored draft/snapshot value và current Personnel value cho fact đó

#### Scenario: Mixed KEEP và REFRESH

- **WHEN** nhiều facts diverge và OWNER chọn KEEP cho một fact, REFRESH cho fact khác
- **THEN** hệ thống SHALL áp dụng từng lựa chọn rõ ràng trong một reconciliation thành công

#### Scenario: REFRESH dùng trusted current value

- **WHEN** OWNER chọn REFRESH FROM PERSONNEL
- **THEN** hệ thống SHALL lấy giá trị từ current trusted server-side Personnel source
- **AND** SHALL NOT dùng browser-provided replacement như authoritative Personnel value

### Requirement: Reconciliation thành công giải quyết đúng source state đã đối chiếu

Một reconciliation thành công SHALL giải quyết reconciliation episode được trình
bày đối với đúng trusted Personnel source state thực tế đã được đối chiếu. Với
`KEEP DRAFT VALUE`, hệ thống SHALL giữ Formalités draft value và SHALL thể hiện
rằng OWNER đã acknowledge divergence đó đối với source state cụ thể đã đối
chiếu; hệ thống MUST NOT tuyên bố hoặc ngụ ý draft value được giữ lại bằng
current Personnel value. Nếu Personnel source không đổi so với source state đã
đối chiếu, cùng acknowledged divergence MUST NOT bị trình bày lặp lại như một
unresolved reconciliation mới mỗi lần REOPEN. Với `REFRESH FROM PERSONNEL`,
Formalités draft value SHALL trở thành trusted current Personnel value được chấp
nhận bởi reconciliation và divergence đó SHALL được xem là resolved cho source
state đã đối chiếu. Nếu bất kỳ approved source fact nào thay đổi sau đó, hệ thống
SHALL phát hiện relevant divergence mới; prior KEEP/REFRESH acknowledgement MUST
NOT bao phủ source state mới và reconciliation mới SHALL được yêu cầu khi áp dụng.

#### Scenario: KEEP không lặp lại prompt khi Personnel source không đổi

- **WHEN** OWNER đã reconcile thành công một divergence bằng KEEP DRAFT VALUE và approved Personnel source facts vẫn bằng source state đã đối chiếu
- **THEN** lần REOPEN sau SHALL NOT trình bày lại cùng acknowledged divergence như một unresolved reconciliation mới

#### Scenario: KEEP không định nghĩa lại Personnel truth

- **WHEN** reconciliation KEEP DRAFT VALUE thành công và retained draft value khác current Personnel value đã đối chiếu
- **THEN** hệ thống SHALL giữ Formalités draft value nhưng MUST NOT trình bày nó là current Personnel truth hoặc là giá trị bằng current Personnel

#### Scenario: REFRESH giải quyết divergence bằng trusted accepted value

- **WHEN** OWNER reconcile thành công bằng REFRESH FROM PERSONNEL với trusted current Personnel value
- **THEN** Formalités draft value SHALL trở thành đúng trusted value được chấp nhận
- **AND** divergence SHALL được xem là resolved đối với source state đã đối chiếu

#### Scenario: Personnel đổi lại sau reconciliation thành công

- **WHEN** một approved Personnel source fact thay đổi sau khi prior KEEP hoặc REFRESH reconciliation đã thành công
- **THEN** hệ thống SHALL phát hiện relevant divergence mới đối với source state mới
- **AND** prior acknowledgement MUST NOT làm divergence mới được coi là đã resolved

### Requirement: Reconciliation stale phải fail visibly

Nếu relevant Personnel facts thay đổi lần nữa trước khi reconciliation được
cam kết, hệ thống MUST NOT silent-apply lựa chọn dựa trên current values đã lỗi
thời. Reconciliation SHALL bị từ chối bằng outcome conflict/stale có thể nhận
biết và draft đã persist trước đó SHALL còn nguyên.

#### Scenario: Personnel đổi trong lúc OWNER reconcile

- **WHEN** OWNER chuẩn bị KEEP/REFRESH choices nhưng relevant Personnel source lại thay đổi trước khi reconciliation được cam kết
- **THEN** hệ thống SHALL từ chối stale reconciliation và SHALL yêu cầu đọc lại current source
- **AND** SHALL không partial-apply bất kỳ choice nào

### Requirement: Current Personnel eligibility độc lập với reconciliation choice

Current Personnel state SHALL luôn là eligibility authority. `KEEP DRAFT VALUE`
MUST NOT bảo lưu CDI eligibility. Khi employee của existing retained draft trở
thành non-CDI, hệ thống SHALL cho phép READ, REOPEN trong bounded
ineligible/recovery state, xem stored snapshot, xem authorized current Personnel
values và ABANDON với required reason. Trong khi employee còn non-CDI, hệ thống
MUST từ chối normal EDIT, normal SAVE, REFRESH để tiếp tục eligible CDI workflow
và create active draft khác. Hệ thống MUST NOT auto-abandon, auto-delete hoặc tự
đổi formality type.

#### Scenario: CDI chuyển thành CDD sau create

- **WHEN** active draft đã tồn tại nhưng current Personnel `employmentTermType` chuyển từ `indefinite` sang non-CDI
- **THEN** hệ thống SHALL mở draft trong ineligible/recovery state thay vì active editable state

#### Scenario: Recovery state cho phép đọc và abandon

- **WHEN** authorized OWNER mở existing draft trong lúc employee hiện non-CDI
- **THEN** hệ thống SHALL cho phép xem stored snapshot và authorized current values
- **AND** SHALL cho phép ABANDON khi có reason hợp lệ

#### Scenario: Recovery state chặn normal continuation

- **WHEN** employee hiện non-CDI và caller yêu cầu normal EDIT, SAVE hoặc REFRESH để tiếp tục CDI workflow
- **THEN** hệ thống SHALL từ chối mutation và SHALL giữ prior durable state

#### Scenario: KEEP không giữ eligibility

- **WHEN** stored snapshot có CDI và OWNER từng chọn KEEP DRAFT VALUE nhưng current Personnel là non-CDI
- **THEN** hệ thống SHALL vẫn coi draft là ineligible theo current Personnel

#### Scenario: Không tự xử lý draft khi mất eligibility

- **WHEN** current Personnel chuyển sang non-CDI
- **THEN** hệ thống SHALL NOT tự abandon, delete hoặc chuyển draft sang formality type khác

#### Scenario: Eligibility đổi sang non-CDI trước khi mutation cam kết

- **WHEN** OWNER đã mở editable draft lúc current Personnel là CDI nhưng authoritative Personnel trở thành non-CDI trước khi normal SAVE hoặc EDIT được cam kết
- **THEN** hệ thống SHALL từ chối mutation dựa trên stale eligibility và SHALL giữ nguyên prior successful persisted draft state
- **AND** current non-CDI eligibility SHALL kiểm soát outcome, đồng thời hệ thống SHALL expose hoặc reload bounded ineligible/recovery condition

### Requirement: CDI eligibility phục hồi không bỏ qua reconciliation

Nếu Personnel sau đó trở lại `employmentTermType = indefinite`, hệ thống SHALL
đánh giá lại eligibility từ current trusted Personnel source. Khi còn relevant
divergence, OWNER MUST hoàn tất required reconciliation với current source trước
khi normal EDIT hoặc SAVE được tiếp tục. Một `ABANDONED` record MUST NOT tự tái
kích hoạt khi eligibility trở lại.

#### Scenario: CDD trở lại CDI với relevant divergence

- **WHEN** employee của retained active draft trở lại CDI và current approved source facts còn diverge với stored snapshot
- **THEN** hệ thống SHALL yêu cầu reconciliation với current source trước normal EDIT hoặc SAVE

#### Scenario: Eligibility được đánh giá lại

- **WHEN** employee trở lại CDI
- **THEN** hệ thống SHALL đánh giá eligibility từ current trusted Personnel, không từ stored CDI snapshot

#### Scenario: Abandoned draft không tái kích hoạt

- **WHEN** employee trở lại CDI nhưng prior record đã là `ABANDONED`
- **THEN** hệ thống SHALL giữ prior record ở `ABANDONED`

### Requirement: Save failure giữ nguyên authoritative saved state

Một explicit SAVE chỉ được báo thành công khi toàn bộ approved Formalités-owned
draft state của mutation đã persist thành công. Nếu save thất bại, hệ thống MUST
giữ nguyên prior successful saved state và MUST NOT trình bày partial hoặc
unsaved local state như authoritative persisted state.

#### Scenario: Save thành công rồi reload

- **WHEN** explicit SAVE hoàn tất thành công và OWNER reload hoặc reopen draft
- **THEN** hệ thống SHALL trả lại đúng committed saved state

#### Scenario: Save thất bại

- **WHEN** explicit SAVE không hoàn tất thành công
- **THEN** prior successful saved state SHALL còn nguyên
- **AND** hệ thống SHALL báo failure mà không tuyên bố partial authoritative state

### Requirement: Concurrent và stale mutations không dùng silent last-write-wins

Hệ thống MUST bảo vệ active draft trước save-vs-save, save-vs-abandon và stale
editor sau một mutation thành công khác. Một stale conflicting mutation SHALL bị
từ chối bằng outcome có thể nhận biết và MUST NOT silent-overwrite authoritative
draft. Replay của cùng logical mutation sau response loss SHALL không tạo duplicate
effect; caller SHALL có thể nhận lại authoritative committed outcome. Một request
khác nội dung MUST NOT được coi là replay tương đương.

#### Scenario: Hai save xung đột

- **WHEN** hai editors dựa trên cùng prior saved state gửi các save khác nhau và một save cam kết trước
- **THEN** save stale còn lại SHALL bị từ chối mà không ghi đè save đã cam kết

#### Scenario: Save cạnh tranh với abandon

- **WHEN** SAVE và ABANDON dựa trên cùng prior state cạnh tranh và một mutation cam kết trước
- **THEN** mutation stale còn lại SHALL bị từ chối và SHALL không tạo partial lifecycle state

#### Scenario: Stale editor sau mutation khác

- **WHEN** editor cũ gửi mutation sau khi authoritative draft đã được thay đổi thành công nơi khác
- **THEN** hệ thống SHALL trả outcome stale/conflict có thể nhận biết thay vì last-write-wins

#### Scenario: Replay sau response loss

- **WHEN** caller replay cùng logical mutation vì không nhận được response của lần cam kết thành công
- **THEN** hệ thống SHALL không áp dụng effect lần thứ hai và SHALL trả authoritative committed outcome có thể nhận biết

#### Scenario: Mutation khác biệt đáng kể không phải equivalent replay

- **WHEN** một request sau response loss khác biệt đáng kể về intended draft mutation so với logical mutation đã được cam kết
- **THEN** hệ thống MUST NOT coi request đó là equivalent replay hoặc trả prior outcome như thể hai mutation giống nhau
- **AND** SHALL đánh giá request đó như một mutation riêng theo current authorization, eligibility và stale-conflict rules

### Requirement: Mọi resource access giữ full tenant scope

Mọi read và mutation SHALL scope resource bằng trusted organization,
establishment, employee và draft. Cross-organization hoặc cross-establishment
employee/draft access MUST fail closed. Lookup theo employeeId hoặc draftId đơn
lẻ MUST NOT đủ để đọc hoặc mutate resource.

#### Scenario: Employee đúng organization nhưng sai establishment

- **WHEN** caller dùng employee thuộc establishment khác trong cùng organization
- **THEN** hệ thống SHALL fail closed và SHALL không đọc hoặc mutate draft cho employee đó

#### Scenario: Draft thuộc organization khác

- **WHEN** draftId thuộc organization khác với trusted context
- **THEN** hệ thống SHALL fail closed mà không lộ hoặc thay đổi draft

#### Scenario: Draft thuộc establishment khác

- **WHEN** draftId thuộc establishment khác với trusted active establishment
- **THEN** hệ thống SHALL fail closed mà không lộ hoặc thay đổi draft

### Requirement: Formalités draft không ghi ngược vào Personnel

CREATE, SAVE, EDIT, KEEP, REFRESH, reconciliation và ABANDON SHALL NOT mutate
Personnel current facts, Personnel revision, Personnel history, Personnel
command receipts hoặc Personnel register. Formalités history SHALL NOT được gộp
vào Personnel history bởi capability này.

#### Scenario: KEEP chỉ tác động draft

- **WHEN** OWNER chọn KEEP DRAFT VALUE và reconciliation thành công
- **THEN** chỉ Formalités-owned draft state có thể thay đổi
- **AND** Personnel facts, revision và history SHALL giữ nguyên

#### Scenario: REFRESH không write back Personnel

- **WHEN** OWNER chọn REFRESH FROM PERSONNEL và reconciliation thành công
- **THEN** hệ thống SHALL copy trusted Personnel value vào Formalités-owned draft state
- **AND** SHALL không mutation Personnel hoặc Personnel register

#### Scenario: Lifecycle mutation không tạo Personnel history

- **WHEN** draft được tạo, lưu hoặc abandon
- **THEN** capability SHALL NOT tạo hoặc sửa Personnel history hay Personnel receipts

### Requirement: Employee-connected capability được mở rộng mà không phá prototype hiện tại

Capability này SHALL mở rộng employee-connected Formalités flow và SHALL giữ
Personnel source-read protections hiện có. Nó MUST NOT yêu cầu xóa hoặc thay thế
generic fictional prototype, current development gate hoặc navigation bằng hành
vi ngoài phạm vi; việc di chuyển UI seam cụ thể thuộc Technical Design.

#### Scenario: Generic fictional prototype không bị xóa theo spec này

- **WHEN** persistent employee-connected capability được bổ sung
- **THEN** spec này SHALL NOT yêu cầu xóa hoặc biến fictional generic prototype thành durable authority

#### Scenario: Existing source-read protection được giữ

- **WHEN** employee-connected flow đọc current Personnel source
- **THEN** existing independent Personnel authorization và trusted scope checks SHALL tiếp tục áp dụng

### Requirement: Workflow giữ draft mà không hứa retention vô hạn

Workflow SHALL giữ cả `DRAFT` và `ABANDONED` records trong bounded first slice
này. Capability MUST NOT cung cấp user hard delete và MUST NOT tự động expiry,
purge hoặc anonymize các records đó. Việc slice này không có automatic deletion
MUST NOT được hiểu là Product guarantee về infinite retention. Final retention/
deletion policy nằm ngoài slice và chỉ có thể thay đổi hành vi này bằng một
future privacy/production decision được duyệt riêng. Capability SHALL không tự
tái dùng Personnel retention và SHALL không tạo legal-hold/mandatory-retention
override.

#### Scenario: Active draft được giữ mà không có automatic expiry

- **WHEN** một `DRAFT` đã được persist thành công và không có lifecycle mutation được duyệt
- **THEN** workflow SHALL giữ record để authorized OWNER có thể REOPEN
- **AND** slice này SHALL NOT tự expiry, purge hoặc anonymize record

#### Scenario: Abandoned record vẫn được giữ và đọc theo quyền

- **WHEN** authorized caller đọc một retained `ABANDONED` record trong đúng trusted scope
- **THEN** hệ thống SHALL trả record đó mà không tự expiry, purge hoặc anonymize trong slice này
- **AND** SHALL không tuyên bố record được Product bảo đảm giữ vĩnh viễn

#### Scenario: Workflow không cung cấp user hard delete

- **WHEN** caller cố hard-delete draft thông qua capability này
- **THEN** hệ thống SHALL từ chối vì user hard delete nằm ngoài workflow được duyệt

#### Scenario: Final retention policy cần quyết định riêng

- **WHEN** một future change muốn thêm retention timer, deletion, purge, anonymization hoặc mandatory-retention override
- **THEN** change đó SHALL cần một privacy/production decision được duyệt riêng
- **AND** MUST NOT coi bounded first slice này là authority cho behavior mới

## Bounded N4 Decision

N4 là `RESOLVED_FOR_BOUNDED_SLICE`: active và abandoned drafts được giữ; slice
không có Product retention timer, user hard delete, automatic expiry, purge hoặc
anonymization. Không có legal-hold/mandatory-retention override nào được thêm
hoặc suy luận. Đây không phải infinite-retention guarantee. Final retention/
deletion policy được deferred sang future privacy/production decision riêng.

Local/development durable persistence có thể được lập kế hoạch và Apply sau khi
Sensitive Design Gate được duyệt. Production retention/readiness, migration,
enablement và deployment vẫn `NOT_AUTHORIZED`. Spec không phê duyệt 90 ngày,
một năm, năm năm, Personnel retention inheritance, keep-forever, cleanup job
hoặc backup/PITR duration.

## Explicit Exclusions

Capability này không định nghĩa address, remuneration/salary, legal contract
generation, PDF, signature, DPAE, DSN, payroll, provider integration, Documents
handoff, AI/OCR/extraction, legal advice, probation duration/renewal,
MANAGER/STAFF grants, Personnel write-back, generic workflow engine, production
enablement hoặc migration execution.
```

## Preserved earlier R1–R3 revision checks

| Command                                                                            | Exact result                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm exec prettier --check` scoped to Gate 1 packet, Gate 2 packet and delta Spec | Exit 0; all three files use Prettier style                                                        |
| `openspec validate formalites-persistent-draft-foundation --strict`                | Exit 0; change is valid                                                                           |
| `pnpm docs:check`                                                                  | Exit 0; documentation consistency passed for 36 current documents                                 |
| `pnpm architecture:check`                                                          | Exit 0; runtime imports, database URLs, client boundaries and migration baselines valid           |
| `pnpm -r --if-present typecheck`                                                   | Exit 0; 15 of 16 workspace projects, all invoked typechecks completed                             |
| `pnpm format:check`                                                                | Exit 1; exactly 62 pre-existing unrelated files; none of the three attributable files is reported |

Repository-wide formatting is therefore not claimed PASS. The 62 unrelated
files were not repaired, ignored or attributed to this targeted planning step.

No unit, database integration, build or Browser QA command was run because no
application/schema behavior was implemented. Those checks are not claimed.

The broader earlier R1–R3 evidence remains historical. Applicable repository
checks were rerun for the current targeted N4 revision as recorded below.

## Targeted N4 revision checks

| Check                                                               | Exact result                                                                                               |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Prior approved Spec SHA-256                                         | `e540c535b6f738f4e3a24247f23c39483b68bd5673935b9df45b2317e26c880b`                                         |
| Regenerated Spec SHA-256                                            | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850`                                         |
| Requirement count from exact `### Requirement:` headers             | 22                                                                                                         |
| Scenario count from exact `#### Scenario:` headers                  | 70                                                                                                         |
| N4 delta                                                            | Retain DRAFT/ABANDONED; no hard delete/automatic expiry/purge/anonymization; final policy deferred         |
| `pnpm exec prettier --write` scoped to exact Spec and Gate 2 packet | Exit 0; exact files formatted                                                                              |
| `openspec validate formalites-persistent-draft-foundation --strict` | Exit 0; `Change 'formalites-persistent-draft-foundation' is valid`                                         |
| `pnpm docs:check`                                                   | Exit 0; documentation consistency passed for 36 current documents                                          |
| `pnpm architecture:check`                                           | Exit 0; architecture boundaries and migration baselines valid                                              |
| `pnpm -r --if-present typecheck`                                    | Exit 0; all invoked typechecks across 15 of 16 workspace projects completed                                |
| `pnpm format:check`                                                 | Exit 1; exactly 62 pre-existing unrelated files; all four attributable planning files pass scoped Prettier |

Behavioral Spec semantics outside the approved N4 revision: **UNCHANGED**.

## Scope and stop confirmation

Modified by this targeted N4 revision:

- `openspec/changes/formalites-persistent-draft-foundation/specs/formalites/persistent-draft-foundation/spec.md`;
- this Gate 2 packet;
- Technical Design and Gate 2b packet, reviewed separately at the Sensitive Design Gate.

Gate 1 artifact status from the earlier Specs step remains unchanged:

- `docs/reviews/formalites-persistent-draft-foundation/01-analysis-review.md`
  remains `APPROVED`; no Gate 1 byte changed in this correction.

Not created:

- Tasks;
- schema or migration;
- API or application/test implementation;
- canonical knowledge;
- normative main Specs;
- permissions/grants;
- production configuration.

Gate 2 recommendation: review the exact delta and either approve it or request
targeted changes. Validation PASS không phải human approval.

Review status: AWAITING_HUMAN_REVIEW.

This regenerated packet supersedes the prior Gate 2 packet only for the
targeted N4 decision. Gate 1 substantive approval and exact artifacts remain
unchanged.

Sync authorization: NOT_REQUESTED.

Production: NOT_AUTHORIZED.

STOP for Gate 2 revalidation and Sensitive Design review before Tasks or Apply.
