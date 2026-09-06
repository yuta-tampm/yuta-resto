## Context

`formalites-persistent-draft-foundation` biến phần employee-connected Formalités
đang chạy bằng React memory thành một CDI preparation draft có thể lưu và mở
lại. Capability vẫn nằm sau development gate hiện hữu; generic fictional
prototype không bị thay thế. Behavioral authority là [proposal.md](proposal.md),
[analysis.md](analysis.md) và
[delta Spec](specs/formalites/persistent-draft-foundation/spec.md) đang chờ Gate
2 revalidation sau targeted N4 revision với 22 Requirements / 70 Scenarios.

Repository hiện có các ranh giới liên quan sau:

- `apps/backoffice` là cloud server/UI runtime; `packages/db-cloud` là owner của
  cloud persistence theo ADR-003.
- Personnel sở hữu employee, current facts, revision và history. Formalités chỉ
  được đọc đúng bảy source facts đã duyệt và không ghi ngược Personnel.
- `formalites.read` và `formalites.manage` là hai quyền độc lập, OWNER-only.
  Đọc source Personnel tiếp tục cần `personnel.employee.read` độc lập.
- Employee-connected route hiện là
  `/equipe/formalites-personnel/[employeeId]`, dùng trusted session, active
  establishment và scoped `findPersonnelEmployee`; state chuẩn bị hiện chưa
  persist.
- Repository đã có convention Drizzle/PostgreSQL, UUIDv7, composite tenant
  scope, optimistic revision, transaction và command receipt. Thiết kế chỉ tái
  dùng các convention phù hợp, không làm bảng Formalités phụ thuộc semantic
  permission hoặc history của Personnel.

Đây là thay đổi sensitive vì snapshot chứa dữ liệu nhân sự. Human Product/
privacy authority đã giải quyết N4 cho bounded local/development slice: active
và abandoned drafts được giữ, không có automatic expiry/purge/anonymization và
không hứa infinite retention. Final retention/deletion policy cùng production
backup/readiness vẫn deferred. Sensitive Design Gate cần human revalidation
trước Tasks hoặc Apply.

## Goals / Non-Goals

**Goals**

- Persist một CDI preparation draft cho existing employee trong trusted
  organization + active establishment.
- Giữ đúng một active draft cho business key và cho phép record mới sau khi
  record trước được abandon.
- Giữ đúng bảy Personnel facts, một coherent source anchor và
  `contractWeeklyMinutes = null` có nghĩa rõ ràng.
- Cho phép explicit SAVE, REOPEN, EDIT, RECONCILE và ABANDON với atomicity,
  optimistic concurrency và duplicate-safe replay.
- Phân biệt Formalités draft value với trusted Personnel source state đã được
  đối chiếu, để KEEP không lặp prompt và không định nghĩa lại Personnel truth.
- Revalidate current CDI eligibility trong transaction của mọi active mutation.
- Trả typed outcomes đủ cho UI recovery mà không lộ tenant hoặc resource khác.

**Non-Goals**

- Không lưu address, remuneration, probation duration/renewal hoặc input khác
  ngoài `probationChoice` đã duyệt.
- Không sinh hợp đồng/PDF, không signature, DPAE/DSN, provider, Documents,
  AI/OCR, payroll hoặc legal advice.
- Không sửa Personnel facts, revision, history, receipt hoặc register.
- Không thêm MANAGER/STAFF access, permission mới, auth framework hoặc browser
  authority.
- Không tạo generic formality/workflow/reconciliation engine.
- Không backfill prototype memory, không production-enable route, không deploy.
- Không thêm retention timer, legal-hold authority, purge/anonymization job hoặc
  backup duration. Final retention/deletion và production backup policy vẫn là
  future decisions riêng.

## Decisions

### D1. Ownership và runtime giữ đúng cloud boundary hiện hữu

Formalités sở hữu semantic draft, lifecycle, reconciliation acknowledgement và
command receipts của chính capability. Physical persistence thuộc
`packages/db-cloud`; orchestration/server actions và UI thuộc employee-connected
route trong `apps/backoffice`; serialization-safe request/result contracts nếu
cần qua client/server boundary thuộc `packages/contracts`.

Personnel vẫn là canonical owner của employee và bảy current source facts.
Formalités repository chỉ thực hiện scoped read đối với Personnel trong cùng
cloud transaction; không import một browser DTO làm authority, không tạo
Personnel history và không dùng Personnel command receipts.

Không có POS, Site Agent, Display hoặc cross-runtime behavior.

### D2. Form formality type là một literal có kiểu, không phải generic engine

First slice dùng đúng một canonical literal `cdi_preparation`. Transport dùng
Zod literal/discriminated type; persistence dùng bounded text column kèm DB
check chỉ chấp nhận literal này. Business key vẫn chứa `formalityType` để không
đóng đường mở rộng bằng một schema phá vỡ dữ liệu, nhưng thêm type mới sau này
phải qua một change riêng và migration/check update riêng.

Không dùng free-text type từ browser, không dùng enum chứa các workflow chưa
được duyệt và không suy luận DPAE/DSN/contract type mới.

### D3. Một aggregate draft tối thiểu, có full tenant/resource scope

Một bảng Formalités-owned mới, tên thiết kế
`formalites_personnel_drafts`, giữ một row cho mỗi draft lifecycle record. Row
gồm các nhóm field sau:

1. Identity/scope: `id`, `organizationId`, `establishmentId`, `employeeId`,
   `formalityType`.
2. Lifecycle: `status` (`draft` hoặc `abandoned`), `probationChoice`
   (`undecided`, `include`, `exclude`), `revision`.
3. Formalités content snapshot: đúng bảy `draft*` values được copy từ
   Personnel khi CREATE và chỉ thay đổi bởi approved REFRESH.
4. Reconciled source snapshot: đúng bảy `source*` values mô tả trusted
   Personnel state mà draft đã capture/reconcile gần nhất, cộng
   `sourcePersonnelRevision` như integrity/diagnostic anchor.
5. Lifecycle metadata: `abandonmentReason`, `abandonedAt`, `createdAt`,
   `updatedAt`.

Hai snapshot dùng typed scalar columns thay vì raw JSON. Điều này làm null,
allowlist và migration rõ ràng, đồng thời ngăn raw persistence JSON trở thành
UI contract. `contractWeeklyMinutes` ở cả hai snapshot là nullable integer:
`null` nghĩa là Personnel không có contractual weekly duration được ghi nhận;
không được chuyển thành `0` hoặc chuỗi rỗng. Contract type dùng đúng Personnel
representation `indefinite | fixed_term` dù CREATE hiện chỉ eligible với
`indefinite`.

Draft content và reconciled source snapshot bắt đầu bằng cùng một coherent
Personnel row tại CREATE. Chúng được tách vì KEEP phải giữ draft value nhưng
vẫn acknowledge source state mới; chỉ một snapshot không thể biểu diễn đúng cả
hai sự thật.

Không tạo audit/event table ở slice này vì Spec không yêu cầu timeline hoặc
actor attribution. `abandonmentReason` là workflow metadata, không phải contract
content. Không persist browser display labels hoặc combined identity field.

### D4. Field inventory và data-minimization contract

| Persistent field/group    | Owner                                                              | Purpose                                                          | Nullability                                     | Source                                              | Mutation authority                     | N4 retention disposition                                                          |
| ------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| `id`                      | Formalités                                                         | Stable draft reference                                           | NOT NULL                                        | Server UUIDv7                                       | Repository CREATE only                 | Retained with draft; no timer/automatic deletion; final policy deferred           |
| `organizationId`          | Shared tenancy scope on Formalités row                             | Tenant isolation                                                 | NOT NULL                                        | Trusted session/membership                          | Server only, immutable                 | Retained with draft; no timer/automatic deletion; final policy deferred           |
| `establishmentId`         | Shared tenancy scope on Formalités row                             | Active-establishment isolation                                   | NOT NULL                                        | Trusted session                                     | Server only, immutable                 | Retained with draft; no timer/automatic deletion; final policy deferred           |
| `employeeId`              | Personnel reference held by Formalités                             | Bind draft to scoped employee                                    | NOT NULL                                        | Scoped Personnel lookup                             | Server only, immutable                 | Retained with draft; no timer/automatic deletion; final policy deferred           |
| `formalityType`           | Formalités                                                         | Bounded workflow discriminator                                   | NOT NULL                                        | Server constant `cdi_preparation`                   | Repository CREATE only                 | Retained with draft; no timer/automatic deletion; final policy deferred           |
| `status`                  | Formalités                                                         | `draft` / `abandoned` lifecycle                                  | NOT NULL                                        | Server workflow                                     | CREATE/ABANDON only                    | Retained with draft; no timer/automatic deletion; final policy deferred           |
| `probationChoice`         | Formalités                                                         | Approved preparation choice                                      | NOT NULL                                        | OWNER input, strictly parsed                        | CREATE/SAVE while eligible             | Sensitive preparation data retained with draft; final policy deferred             |
| `revision`                | Formalités                                                         | Optimistic concurrency                                           | NOT NULL, positive                              | Server                                              | Increment on successful state mutation | Retained integrity metadata; no timer/automatic deletion; final policy deferred   |
| seven `draft*` facts      | Formalités copy; Personnel remains source owner                    | Values used by this draft                                        | Each mirrors Personnel; weekly minutes nullable | Trusted Personnel at CREATE; approved REFRESH later | Server-derived CREATE/REFRESH only     | Personnel snapshot retained with draft; final policy deferred                     |
| seven `source*` facts     | Formalités reconciliation evidence; Personnel remains source owner | Last trusted Personnel state acknowledged by this draft          | Each mirrors Personnel; weekly minutes nullable | Trusted locked Personnel read                       | CREATE/RECONCILE only                  | Personnel snapshot retained with draft; final policy deferred                     |
| `sourcePersonnelRevision` | Formalités anchor to Personnel                                     | Coherent source/integrity anchor, not divergence truth by itself | NOT NULL, positive                              | Trusted Personnel row                               | CREATE/RECONCILE only                  | Retained integrity metadata; no timer/automatic deletion; final policy deferred   |
| `abandonmentReason`       | Formalités                                                         | Required workflow reason for ABANDON                             | NULL while active; NOT NULL when abandoned      | OWNER input, trimmed, 1–250 characters              | ABANDON only                           | Sensitive free text retained with abandoned draft; final policy deferred          |
| `abandonedAt`             | Formalités                                                         | Lifecycle timestamp                                              | NULL while active; NOT NULL when abandoned      | Server clock                                        | ABANDON only                           | Retained lifecycle metadata; no timer/automatic deletion; final policy deferred   |
| `createdAt`, `updatedAt`  | Formalités                                                         | Persistence/recovery timestamps                                  | NOT NULL                                        | Server clock                                        | Repository only                        | Retained operational metadata; no timer/automatic deletion; final policy deferred |

“Seven facts” in both snapshots are exactly:
`givenNames`, `familyName`, `position`, `qualification`,
`employmentTermType`, `entryDate`, `contractWeeklyMinutes`. Two copies do not
expand the approved Personnel projection; one is draft content, one is the
source state against which reconciliation is resolved.

No address, remuneration, departure, expected end date, CDD reason, IP,
user-agent, request body dump, Personnel history or document content is stored.

### D5. Reconciliation uses content state plus acknowledged source state

On READ/REOPEN, server reads the scoped draft and current scoped Personnel.
Relevant divergence is computed field-by-field between current seven Personnel
facts and stored seven `source*` facts. `sourcePersonnelRevision` changing alone
does not create a displayed divergence.

For each server-derived divergent fact, UI can submit KEEP or REFRESH. Server
re-derives the exact divergent set; missing, duplicate or extra choices fail
validation.

- KEEP: corresponding `draft*` value stays unchanged; corresponding `source*`
  value becomes the trusted current Personnel value.
- REFRESH: both `draft*` and `source*` become the trusted current Personnel
  value.
- After all choices succeed, `sourcePersonnelRevision` becomes the revision of
  the coherent Personnel row actually reconciled.

Therefore a later reopen against unchanged source has no unresolved divergence,
while KEEP can still display a draft value different from current Personnel
without calling it Personnel truth. A later change to any approved source fact
differs from `source*` and creates a new reconciliation episode.

The read DTO marks values explicitly as `draftValue` and
`currentPersonnelValue`; it never labels a retained KEEP value as current
Personnel.

### D6. Stale reconciliation is checked against the exact presented source state

READ returns a server-computed opaque `sourceStateFingerprint` derived only
from normalized seven current Personnel facts. RECONCILE submits this
fingerprint plus expected draft revision and per-fact choices. The fingerprint
is concurrency evidence, not authority: repository locks and rereads scoped
Personnel, recomputes it, derives all values/divergences server-side and never
uses browser-provided Personnel replacements.

If current fingerprint differs, RECONCILE returns a typed stale-source outcome
with a fresh bounded read model and writes nothing. This detects relevant fact
changes without turning an unrelated Personnel revision increment into a false
divergence. A forged fingerprint cannot inject values or choices for
non-divergent facts because server derivation and allowlist remain decisive.

No fingerprint is required as a durable field. The durable
`sourcePersonnelRevision` remains a coherent anchor but is not the sole
divergence condition.

### D7. Every active mutation revalidates current CDI eligibility atomically

CREATE, normal SAVE/EDIT and RECONCILE run in a db-cloud transaction. They use a
scoped Personnel read with row locking before deciding eligibility. This lock
serializes against concurrent Personnel row updates, so one committed ordering
is authoritative:

- if CDI → CDD committed first, the Formalités mutation reads non-CDI and is
  rejected;
- if the Formalités mutation obtained/validated the current CDI row first, it
  commits before the competing Personnel update can become current.

Normal SAVE/EDIT and RECONCILE require current
`employmentTermType = indefinite`. They do not infer full-time, upcoming,
departure or probation legality. ABANDON is deliberately allowed while
non-CDI; READ/REOPEN returns the bounded ineligible/recovery state. CREATE is
rejected while non-CDI. An abandoned row never reactivates.

The employee lookup always includes organization + establishment + employee.
No source check by employee ID alone is allowed.

### D8. Database constraint enforces at most one active draft

A partial unique index covers
`(organizationId, establishmentId, employeeId, formalityType)` where
`status = 'draft'`. Composite foreign keys bind establishment to organization
and employee to organization + establishment + employee.

CREATE first performs trusted authorization/source/eligibility validation, then
inserts. Two concurrent CREATEs with different command identities are finally
serialized by the database constraint. The loser is mapped to a typed
`active_draft_exists` result containing only the already-authorized scoped
draft reference/read model. An abandoned row no longer participates in the
partial index, so a later eligible CREATE can succeed without overwriting it.

Application prechecks improve UX but never replace the constraint.

### D9. Optimistic draft revision prevents silent last-write-wins

Every SAVE, RECONCILE and ABANDON requires `expectedDraftRevision`. Repository
updates use full scope + draft ID + current active status + expected revision
and increment revision exactly once. Zero updated rows trigger a scoped reread:

- current scoped draft at another revision → typed `stale_draft`;
- already abandoned → typed `draft_abandoned` recovery/read result;
- no scoped record → fail-closed `not_found` without cross-tenant disclosure.

Thus save-vs-save, save-vs-abandon and stale editor cannot partially overwrite
each other. ABANDON validates a trimmed reason of 1–250 characters,
eligibility-independent, and atomically sets status/reason/time/revision.
Database checks require reason/time only for `abandoned` and require both to be
null for `draft`. Abandoned drafts reject later content mutations.

### D10. Command receipts provide behavioral replay safety

A second Formalités-owned table, design name
`formalites_personnel_draft_command_receipts`, stores only the technical
evidence needed to distinguish replay from a different mutation:

- full `organizationId` + `establishmentId` scope;
- `actorUserId`, bounded command type, one-way hash of caller operation key;
- canonical request fingerprint;
- resulting `draftId`, resulting draft revision/outcome discriminator;
- `createdAt`.

Unique key is scope + actor + command type + operation-key hash. The fingerprint
covers normalized intended mutation, expected draft revision and reconciliation
choices where applicable. Same logical replay returns the committed scoped
outcome without applying it twice. Same operation key with materially different
fingerprint returns `replay_conflict`. Receipts are inserted in the same
transaction as the mutation.

This is orchestration only, not a Product-visible idempotency field. Receipt
payload does not store raw reason or Personnel values. For this bounded slice,
receipt technical state is retained without `expiresAt`, automatic expiry or a
cleanup job. This absence does not promise infinite retention; a later approved
privacy/operations change may define receipt retention separately.

### D11. CREATE/SAVE/RECONCILE/ABANDON are transactionally atomic

All mutation paths start by requiring trusted scoped user context, then acquire
scoped operation-key serialization and check an existing receipt. Any path that
needs both resources uses one canonical lock order: **PERSONNEL → FORMALITES
DRAFT**.

- **CREATE:** lock/read scoped Personnel, validate current eligibility, then
  insert the Formalités draft and receipt.
- **SAVE / EDIT / RECONCILE:** lock/read scoped Personnel, validate current
  eligibility/source, then lock/read scoped Formalités draft, validate expected
  draft revision/reconciliation state, mutate the complete row and insert the
  receipt.
- **ABANDON:** does not require Personnel eligibility; it locks only the scoped
  Formalités draft, validates active status/revision/reason, mutates lifecycle
  state and inserts the receipt.

Every path commits and returns one typed authoritative outcome only after all
required state is written.

Any failure before commit rolls back both draft state and receipt. The CREATE
partial unique constraint, draft compare-and-swap and locked Personnel read are
the database backstops. No normal mutation writes a half-reconciled snapshot.
No operation writes Personnel.

### D12. Trusted authorization composition stays independent and fail closed

Employee-connected loader/actions compose current boundaries rather than
duplicating session resolution:

1. development gate remains required;
2. `requireFormalitesTenant('formalites.read')` for read/reopen;
3. `requireFormalitesTenant('formalites.manage')` for each mutation;
4. independent `personnel.employee.read` evaluation before any Personnel source
   read;
5. repository repeats organization + establishment + employee + draft scope.

The authenticated server session, verified active membership, trusted
organization and trusted active establishment are the only authority. Browser
employee/draft IDs are parsed references, never scope proof. Browser role,
membership, tenant, organization, establishment or permissions are ignored.
Public/service actors and system roles without valid OWNER restaurant membership
do not bypass grants. Missing establishment preserves current 400 semantics;
permission denial preserves 403 semantics. Cross-scope resource lookup fails
closed without revealing existence.

Formalités MANAGE never delegates to `personnel.employee.manage`; Personnel
READ never grants Formalités authority.

### D13. Contracts expose typed values and recoverable outcomes only

`@yuta/contracts` may add a bounded `formalites` entry for serialized draft
commands/read models. Zod schemas allowlist literal type/status/probation states,
UUIDs, positive revisions, a trimmed 1–250-character abandonment reason and
exact per-fact reconciliation choices. Dates remain canonical date strings and
weekly minutes remain integer-or-null.

Read projection is a discriminated union:

- `editable`: current CDI, no unresolved divergence;
- `reconciliation_required`: current CDI plus exact divergent facts;
- `ineligible_recovery`: current non-CDI, read/abandon only;
- `abandoned`: immutable retained record.

Mutation results are a discriminated union with at least:

- `success` (including recognizable replay status and authoritative model);
- `validation_error` with safe field errors;
- `active_draft_exists`;
- `stale_draft`;
- `stale_personnel_source`;
- `ineligible_recovery`;
- `draft_abandoned`;
- `replay_conflict`;
- fail-closed `not_found`;
- recoverable `server_error` at the action boundary.

Authorization failures continue through current 400/403 guard semantics rather
than being serialized as successful business outcomes. Raw database rows,
tenant IDs, actor IDs, hashes, receipts and stack errors never reach browser UI.

### D14. Extend the employee-connected route without replacing prototypes

The durable UI seam is the existing
`/equipe/formalites-personnel/[employeeId]` route. Its connected read model is
extended to load scoped draft/current Personnel state and render the approved
three-state `probationChoice`, explicit Save, reconciliation, reopen recovery
and abandon interactions. It remains behind
`isFormalitesReadPrototypeEnabled`; this change does not production-enable it.

The generic `/equipe/formalites-personnel` fictional prototype, its memory
reducer, navigation and development gate remain intact. Address/remuneration
prototype inputs do not enter durable contracts or persistence. Existing
Personnel source authorization is retained and Formalités guards are added for
the durable consumer rather than replacing it.

Client interaction preserves unsaved input on validation/conflict/server error,
prevents double submit while pending, reloads authoritative state after success,
and explicitly distinguishes draft values from current Personnel values.
Dirty-close protection, focus recovery, keyboard navigation, visible focus,
French labels and responsive layouts follow Backoffice conventions; shared
`@yuta/ui` primitives need no change.

### D15. Migration is additive; no existing data is backfilled

After this revised Sensitive Design is approved and Apply is separately
approved, generate one new Drizzle migration that adds only the two Formalités
tables, constraints and indexes described above. Do not edit an existing
migration. Export schema/repository via current db-cloud boundaries and add
bounded contracts/actions/components/tests.

There is no backfill: prototype memory/fixtures are not authoritative drafts,
and existing employees do not receive drafts automatically. CREATE is always an
explicit authorized action after migration.

Forward deployment sequence is schema first, then server code while the route
remains development-gated, then local/integration evidence. Production
migration, route enablement and deploy remain separately unauthorized.

Before any durable data exists, a failed local migration can be corrected by a
new forward migration in accordance with repository convention. After draft
data exists, rollback is data-preserving: keep tables/data, stop writers or roll
forward. Never automatically drop tables or records. Production backup/PITR,
restore privacy and final deletion propagation remain outside this slice and
require separate production/privacy authority; their unresolved duration does
not alone block local/disposable persistence after Sensitive Design approval.

### D16. Verification strategy maps all behavior layers

**Pure contract/domain tests** cover literals, three probation states,
nullable weekly minutes, exact seven-fact comparison, KEEP/REFRESH transitions,
fingerprint stability, reason bounds and typed outcome mapping.

**Disposable-db integration tests** cover full tenant composite constraints,
CDI/non-CDI CREATE, no extra eligibility gate, one-active constraint and
concurrent CREATE, create-after-abandon, all transaction rollback points,
save/save, save/abandon, stale editor, replay/different payload, current
eligibility race, stale reconciliation, mixed KEEP/REFRESH, unchanged-source
no-reprompt, changed-again divergence, canonical Personnel-before-draft lock
order, and no Personnel writes/history/receipts.

The CDI → CDD race uses two transactions and proves both legal serial orders;
the stale UI submission after CDD commit must reject and preserve the previous
draft. Cross-organization/establishment tests prove IDs alone reveal/mutate
nothing. Authorization tests cover OWNER allow, MANAGER/STAFF/public/service/
system-role denial and browser-claim rejection.

**Component/interaction tests** cover four read states, UNDECIDED save, pending,
validation, conflicts/reload, response replay, server retry, abandon reason,
dirty close, focus and keyboard behavior. They assert no address/remuneration,
legal recommendation or raw internal fields enter the durable UI.

**Final Browser QA**, only in later Integration/Regression phase, uses the real
authenticated employee-connected route with safe synthetic local data at 1440,
1024, 768 and 390 px. Required states include create/save/reload, reconciliation
KEEP/REFRESH, non-CDI recovery, stale conflict, generic retry where safely
reproducible, abandoned/read-only, loading/error/success, dirty close,
keyboard/focus and no overflow. Generic prototype and gate non-regression are
checked separately. Browser QA is not run in Design.

**Repository checks** planned for Apply/Verify use existing scripts only:
focused contracts/db-cloud/Backoffice tests and typechecks, Backoffice build,
`pnpm docs:check`, `pnpm architecture:check`, recursive typecheck, scoped
Prettier, truthful repository format disposition and strict OpenSpec validation.

## Requirement-to-Decision Coverage

|   # | Approved Requirement title                                                 | Design decisions  |
| --: | -------------------------------------------------------------------------- | ----------------- |
|   1 | Eligibility tạo draft dựa trên Personnel hiện tại và trusted scope         | D7, D8, D12       |
|   2 | Formalités authorization và Personnel source authorization độc lập         | D1, D12           |
|   3 | Browser identifiers và claims không tạo authority                          | D12, D13          |
|   4 | Draft lifecycle sử dụng explicit persistence                               | D3, D9, D11, D14  |
|   5 | Abandonment yêu cầu reason và giữ record                                   | D3, D4, D9, D11   |
|   6 | Có thể tạo draft mới sau abandonment                                       | D8, D9            |
|   7 | Tối đa một active draft trong business scope                               | D3, D8            |
|   8 | probationChoice có ba trạng thái chuẩn bị đã duyệt                         | D3, D4, D13, D14  |
|   9 | INCLUDE không phải kết luận hoặc khuyến nghị pháp lý                       | D2, D14           |
|  10 | Draft giữ đúng Personnel reference, anchor và source snapshot              | D3, D4, D6        |
|  11 | Reopen phát hiện relevant Personnel divergence theo source facts           | D5, D6, D13       |
|  12 | Reconciliation là explicit và per divergent fact                           | D5, D6, D11, D14  |
|  13 | Reconciliation thành công giải quyết đúng source state đã đối chiếu        | D3, D5, D6        |
|  14 | Reconciliation stale phải fail visibly                                     | D6, D9, D11, D13  |
|  15 | Current Personnel eligibility độc lập với reconciliation choice            | D5, D7, D13, D14  |
|  16 | CDI eligibility phục hồi không bỏ qua reconciliation                       | D5, D7, D13       |
|  17 | Save failure giữ nguyên authoritative saved state                          | D9, D10, D11, D14 |
|  18 | Concurrent và stale mutations không dùng silent last-write-wins            | D8, D9, D10, D11  |
|  19 | Mọi resource access giữ full tenant scope                                  | D3, D8, D10, D12  |
|  20 | Formalités draft không ghi ngược vào Personnel                             | D1, D5, D7, D11   |
|  21 | Employee-connected capability được mở rộng mà không phá prototype hiện tại | D14               |
|  22 | Workflow giữ draft mà không hứa retention vô hạn                           | D4, D10, D15, N4  |

## Risks / Trade-offs

- **Hai snapshot lặp bảy fields:** tăng số cột nhưng là cách tối thiểu để vừa
  giữ draft value vừa acknowledge source state. Mitigation: exact allowlist,
  typed columns và không capture field ngoài projection.
- **Personnel row locking có thể chờ mutation Personnel:** cần thiết để đóng
  race eligibility. Transaction phải ngắn, không gọi network/provider và lock
  order cố định Personnel trước draft update nơi cần thiết để tránh deadlock.
- **Partial unique conflict là expected concurrency:** repository phải map đúng
  constraint, không biến mọi database error thành “draft exists”.
- **Free-text abandonment reason có thể chứa dữ liệu dư:** bounded length,
  hướng dẫn UI ngắn, không lưu trong receipts; final retention policy vẫn cần
  future privacy/production decision.
- **Slice không tự expiry draft/receipt:** đúng bounded N4 decision và không có
  cleanup job. Đây không phải keep-forever guarantee; future policy phải qua
  change riêng.
- **Route vẫn development-only:** thiết kế có thể được kiểm thử local nhưng
  không tạo production readiness hoặc legal-compliance claim.
- **Typed wide columns cần migration khi projection đổi:** chủ ý fail closed;
  tránh versionless JSON và ngăn Formalités tự hấp thụ Personnel fields mới.

## Migration Plan

1. **Hiện tại — targeted Spec/Design revision only:** không tạo schema/migration;
   Sensitive Design Gate chờ human revalidation.
2. **Sau Sensitive Design + Tasks/Apply approval:** thêm migration mới và schema
   exports; không backfill, không sửa migration cũ.
3. Thêm contracts/domain/repository với integration tests trên disposable DB.
4. Thêm actions/UI vào employee-connected route vẫn development-gated.
5. Chạy Technical Compliance, Verify và Browser QA ở phase được duyệt.
6. Không production migrate/deploy/enable nếu chưa có release authority và các
   privacy/backup/operational gates cần thiết.

Rollback sau khi có dữ liệu là preserve-data + stop writers/roll-forward. Không
drop bảng, hard-delete abandoned records hoặc dùng restore để che lỗi migration.

## N4 — Privacy / Retention Decision for the Bounded Slice

N4 là `RESOLVED_FOR_BOUNDED_SLICE` theo human Product/privacy decision hiện tại:

- active `DRAFT` và `ABANDONED` records được persist/retained;
- không có Product retention timer hoặc automatic expiry;
- không có user hard delete;
- không có automatic purge hoặc anonymization;
- command receipts được giữ như bounded technical state, không có `expiresAt`
  hay cleanup job trong slice này;
- không thêm hoặc suy luận legal-hold/mandatory-retention override;
- absence of automatic deletion không phải infinite-retention guarantee;
- final retention/deletion policy được deferred sang future privacy/production
  decision riêng.

Dữ liệu retained gồm Personnel snapshot facts, employee reference, source
anchor, probation choice, reconciliation acknowledgement, abandonment reason và
lifecycle/concurrency metadata đã liệt kê tại D4/D10. Mục đích vẫn giới hạn ở
draft preparation, reopen, reconciliation, recovery và replay safety; không mở
rộng field inventory.

Personnel “5 years after departure” không được kế thừa. Không invent 90 ngày,
một năm, năm năm, keep-forever, purge/anonymization scheduler hoặc backup/PITR
duration. Production backup/PITR/restore lifecycle và production readiness vẫn
ngoài slice, `NOT_AUTHORIZED`, và cần authority riêng. Global production backup
retention chưa giải quyết không tự chặn local/disposable durable persistence sau
khi Sensitive Design Gate được duyệt.

## Open Questions

- Tên physical constraint/index cuối cùng sẽ được đóng trong Tasks theo Design
  sau khi Sensitive Design được duyệt; nó không được làm thay đổi behavioral
  scope hoặc field inventory.
- Production backup/PITR, final retention/deletion và route enablement vẫn là
  privacy/release/operations gates riêng; bounded N4 decision không cấp production
  authority.
