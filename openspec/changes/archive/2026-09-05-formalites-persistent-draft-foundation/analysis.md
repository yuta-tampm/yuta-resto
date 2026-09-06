# Change Analysis

## Scope and Change Type

`formalites-persistent-draft-foundation`: behavioral change, CROSS_MODULE,
data-affecting, UI-affecting và sensitive. Handoff Control Tower hiện tại xác
nhận Discovery/Shaping COMPLETED. Human Product decisions N1–N3 hiện đã được
phê duyệt; N4 được acknowledge nhưng chưa giải quyết. Revision này chỉ cập nhật
Proposal/Analysis/Gate 1 theo attachment `804bf47f-0e58-401c-b03d-b598ec274d6a`;
không lặp Discovery, tự phê duyệt gate hoặc cho phép Apply.

First slice là preparation draft cho existing scoped employee có current CDI,
không phải hợp đồng hoàn chỉnh/pháp lý. Source identifier thực tế là
`employmentTermType: 'indefinite'`, không phải enum literal `'CDI'`.
Không thêm full-time/upcoming/no-departure eligibility. Không đổi hai prerequisite
đã DONE. Lượt này chỉ tạo artifact review; schema, API, implementation và
canonical knowledge giữ nguyên.

## Sources Consulted

Các đường dẫn code trong bảng bên dưới là repository-relative; số dòng là điểm
neo của source được đọc tại Gate 1, không phải authorization sửa file. Evidence
repository của lần phân tích trước được giữ lại sau raw-byte comparison; không
claim một vòng Discovery/test mới. Current run/update skill, artifact instructions
và privacy-gate routing được kiểm tra lại cho targeted revision này.

- [Root instructions](../../../AGENTS.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md),
  [db-cloud instructions](../../../packages/db-cloud/AGENTS.md),
  [contracts instructions](../../../packages/contracts/AGENTS.md).
- [Docs index](../../../docs/README.md), [Current State](../../../docs/CURRENT_STATE.md),
  [Authority Model](../../../docs/AUTHORITY_MODEL.md),
  [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md),
  [Module Registry](../../../docs/MODULE_REGISTRY.md),
  [Lifecycle model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Personnel Home](../../../docs/features/personnel/README.md),
  [Identity / Access Home](../../../docs/features/identity-access/README.md).
- [ADR-003](../../../docs/decisions/ADR-003-database-ownership-boundaries.md),
  [database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md),
  [tenancy](../../../docs/architecture/TENANCY.md),
  [authentication](../../../docs/architecture/AUTHENTICATION.md),
  [membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md).
- [Formalités page pack](../../../docs/ui/pages/backoffice-equipe-formalites-personnel/README.md),
  [Product Scope](../../../docs/ui/pages/backoffice-equipe-formalites-personnel/PRODUCT_SCOPE.md),
  [Data/Interaction](../../../docs/ui/pages/backoffice-equipe-formalites-personnel/DATA_AND_INTERACTION_SPEC.md),
  [legal review brief](../../../docs/ui/pages/backoffice-equipe-formalites-personnel/LEGAL_REVIEW_BRIEF.md),
  [production gates](../../../docs/operations/PRODUCTION_READINESS.md).
- [Normative authorization/formalites](../../specs/authorization/formalites/spec.md),
  [archived prerequisite](../archive/2026-09-04-formalites-authorization),
  [completed authorization review](../../../docs/reviews/formalites-authorization/03-final-review.md),
  [completed Knowledge review](../../../docs/reviews/formalites-authorization/04-knowledge-consolidation-review.md),
  [completed tooling review](../../../docs/reviews/next-generated-types-bootstrap/03-final-review.md).
- [Current run skill](../../../.agents/skills/yuta-run-change/SKILL.md),
  [new-change skill](../../../.agents/skills/openspec-new-change/SKILL.md) (initial creation),
  [update-change skill](../../../.agents/skills/openspec-update-change/SKILL.md) (targeted revision),
  [detailed workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md),
  [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md),
  [10-criterion check](../../../docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md),
  [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md),
  [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md),
  [development prerequisite](../../../docs/DEVELOPMENT_WORKFLOW.md).
- [UI routing](../../../docs/ui/README.md) và
  [delivery modes](../../../docs/ui/DELIVERY_WORKFLOW_MODES.md); chưa thực hiện
  design-to-code hoặc tạo visual artifact.
- [Personnel transport](../../../packages/contracts/src/personnel/index.ts),
  [schema](../../../packages/db-cloud/src/schema/personnel.ts),
  [repository](../../../packages/db-cloud/src/personnel-repository.ts),
  [register repository](../../../packages/db-cloud/src/personnel-register-repository.ts),
  [db-cloud manifest](../../../packages/db-cloud/package.json),
  [root manifest](../../../package.json), migration journal/SQL và tests nêu dưới.

## Authority and Product Decision

### B. Current authority/spec inventory

| Question                       | Controlling source / finding                                                                                                                          | Disposition                                                                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bounded Product scope          | Current-user Control Tower handoff: CDI-only existing employee, hybrid snapshot, one active draft, explicit save/reconciliation, probationChoice only | Approved starting scope; not implementation authority                                                                                                              |
| Formalités semantics/ownership | Handoff; Personnel Home §§6–8 already separates future draft ownership from authoritative Personnel facts                                             | Formalités owns only this draft/workflow/reconciliation; no Personnel write-back                                                                                   |
| Physical persistence/runtime   | ADR-003 and Database Boundaries; cloud Backoffice uses db-cloud                                                                                       | Likely owning runtime/database identified, no alternate owner or cross-runtime needed                                                                              |
| Authorization                  | Normative `authorization/formalites`; current helpers; archived prerequisite and DONE Knowledge result                                                | Reuse independent OWNER READ/MANAGE, not Personnel/RK/generic role proof                                                                                           |
| Personnel source               | Personnel Home; summary contract; composite repository; existing revision                                                                             | Facts/revision remain Personnel-owned, history is not Formalités history                                                                                           |
| Earlier lifecycle              | Formalités Product Scope “Approved F5-07 lifecycle” và current N2 decision                                                                            | Explicit save, one draft, retained abandonment/no hard delete; required abandonmentReason được xác nhận là workflow metadata, không phải preparation input thứ hai |
| Earlier eligibility proposal   | Data/Interaction “Applicability matrix”, Product Scope Phase 5/F08                                                                                    | Upcoming full-time was only PROPOSED, not runtime eligibility; current explicit CDI-only scope is the bounded new direction, not a legal approval                  |
| Durable field dictionary       | Current N1 Product decision; existing prototype/blocked legal dictionary không tạo authority                                                          | UNDECIDED / INCLUDE / EXCLUDE là approved semantic states cho preparation-only; initial UNDECIDED và SAVE được phép khi UNDECIDED; không legal conclusion          |
| Retention/privacy              | F5-08, HR-RET-01, HR-AUDIT-01, PRIV-04 và current N4 decision                                                                                         | ACKNOWLEDGED / UNRESOLVED; không chặn behavioral Specs, chặn sensitive persistence Apply tới khi applicable Sensitive Design/privacy review giải quyết             |

Registry's broader durable lifecycle retains `Data Owner: NEEDS REVIEW` and
proposed Backoffice runtime. This is broader than the requested preparation
slice (includes files/generation/signature). The handoff explicitly supplies
the bounded semantic owner; ADR-003 supplies the existing cloud DB boundary.
There is no contradictory accepted runtime ADR or implemented competing owner.
Gate 1 must record this bounded ownership without pretending the registry's
entire future lifecycle is resolved. No canonical source is changed here.

The authorization main spec's prototype-preservation requirement applies to
the prerequisite itself. Its final requirement explicitly reserves future
workflow approval. Consuming the guards in this separately reviewed change
does not require reopening the prerequisite or rewriting its normative spec.

### Approved Product decisions for this revision

Nguồn quyết định là explicit current-user attachment, không phải prototype enum,
code readiness hoặc Codex suy luận:

- N1: `UNDECIDED` / `INCLUDE` / `EXCLUDE`, initial UNDECIDED; explicit SAVE
  được phép khi UNDECIDED. Ý nghĩa và giới hạn phi-pháp-lý tại J.
- N2: ABANDON yêu cầu `abandonmentReason`, workflow metadata; không thêm
  preparation/business input thứ hai. Không định nghĩa reason enum tại Gate 1;
  exact length/transport/storage validation thuộc Design, không có current
  Formalités contract nào đã được phát hiện để tự kế thừa.
- N3: current Personnel eligibility tách khỏi snapshot/reconciliation; existing
  non-CDI draft có bounded read/recovery/abandon, không normal edit/save; phục
  hồi current CDI đòi re-evaluation và required reconciliation (I).
- N4: CARRIED_FORWARD_UNRESOLVED. Retention period/privacy-data obligation chưa
  được giải quyết; không được xem việc viết Specs là quyền persistence Apply.

Privacy-gate routing được kiểm tra trong current run skill State 3 và
`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` “Conditional sensitive Design Gate”:
sensitive approval bắt buộc trước Tasks/Apply. Normativity policy §§4–5 vẫn
đòi applicable privacy authority; không tìm thấy dedicated privacy gate bắt
buộc sớm hơn cho việc viết bounded behavioral Specs này. Thời hạn/cleanup/hold
không được đưa vào Specs bằng assumption. N4 bắt buộc giải quyết trong applicable
Sensitive Design/privacy-data review trước durable sensitive persistence Apply,
không chỉ là việc cần làm trước production. Không coi generic Design approval
là closure N4 khi chưa có đúng privacy decision/evidence.

## Current Implemented State

### A. Existing implementation inventory

Prefix `F` = `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/`.
Prefix `S` = `apps/backoffice/src/app/(authenticated)/equipe/salaries/`.
Classifications below are analysis dispositions, **not** an Apply allowlist.
REFRACTOR preserves current behavior until a reviewed Design identifies the
specific delta; REPLACE never authorizes deleting source tests or data reads.

| Exact file (prefix expanded as above)                                                                                                                            | Evidence now                                                                                             | Disposition for later bounded change                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F `page.tsx`                                                                                                                                                     | Generic authenticated OWNER Personnel-read fixture; no employee lookup                                   | KEEP — generic demonstration, not new durable entry by assumption                                                                                                 |
| F `[employeeId]/page.tsx`                                                                                                                                        | Gate → session → establishment → Personnel read → UUID → scoped find → projection                        | REFACTOR — extend employee-connected entry only after approval; preserve all existing protections/data reads                                                      |
| F `_lib/formalites-read-prototype-runtime.ts`                                                                                                                    | `NODE_ENV=development` and explicit `BACKOFFICE_PERSONNEL_FORMALITES_READ_PROTOTYPE_ENABLED=true`        | KEEP — no production enabling or silent gate removal                                                                                                              |
| F `_lib/formalites-read-prototype-runtime.test.ts`                                                                                                               | Development opt-in and production/test false                                                             | KEEP — existing regression remains                                                                                                                                |
| F `_lib/cdi-draft-connected-read-model.ts`                                                                                                                       | Pick of seven Personnel fields → six formatted display rows                                              | REFACTOR — preserve source allowlist; raw typed snapshot/anchor must not be reconstructed from formatted labels                                                   |
| F `_components/cdi-draft-connected-read-prototype.tsx`                                                                                                           | Wraps shared demo with employeeName/fields and return href                                               | REFACTOR — employee-connected integration, no fixture substitution                                                                                                |
| F `_components/cdi-draft-readiness-prototype.tsx`                                                                                                                | `useReducer`, three steps, local checkpoint, address/pay/probation, disabled generation                  | REFACTOR only if shared seam needed; KEEP generic demo. REPLACE demo-only connected save/readiness semantics with approved durable behavior later, not whole page |
| F `_lib/cdi-draft-prototype.ts`                                                                                                                                  | Fictional fixture/types/reducer/derived demo readiness                                                   | KEEP generic model; DEFER its enum/readiness as durable authority; do not reuse address/pay requirements in first slice                                           |
| `apps/backoffice/test/formalites-cdi-prototype.test.tsx`                                                                                                         | Five cases: fixture, disclosure, readiness, checkpoint/reset, missing demo values                        | KEEP — generic regression, not proof of persistence                                                                                                               |
| `apps/backoffice/test/formalites-cdi-connected-read.test.tsx`                                                                                                    | Two cases: exact six rows/no IDs or revision; local-only connected output                                | REFACTOR/add bounded expectations later; preserve exact source allowlist and no internal-data disclosure guarantees                                               |
| S `[employeeId]/page.tsx`                                                                                                                                        | Server full-dossier route passes development flag                                                        | KEEP — no alternative dossier/editor                                                                                                                              |
| S `_components/salaries-page.tsx` at 1237                                                                                                                        | Formalités link only `mode === 'page'` and flag                                                          | KEEP — full-dossier handoff, no list drawer expansion                                                                                                             |
| `apps/backoffice/src/components/backoffice/backoffice-navigation.ts`                                                                                             | Generic Formalités navigation with current Personnel access metadata                                     | KEEP — no menu redesign or role expansion                                                                                                                         |
| `apps/backoffice/src/server/auth/formalites.ts`                                                                                                                  | Server-only `requireFormalitesTenant` composition                                                        | KEEP/consume — no auth prerequisite rewrite                                                                                                                       |
| `apps/backoffice/src/server/auth/permissions.ts`                                                                                                                 | Separate formalites.read/manage maps, OWNER only                                                         | KEEP — no grant/permission edits                                                                                                                                  |
| `apps/backoffice/src/server/auth/session.ts`                                                                                                                     | Validated session + metadata + membership resolution                                                     | KEEP — no session refactor                                                                                                                                        |
| `apps/backoffice/test/formalites-permissions.test.ts`                                                                                                            | Exact operations, separate grants, actors/denial/no Personnel delegation                                 | KEEP                                                                                                                                                              |
| `apps/backoffice/test/formalites-authorization-context.test.ts`                                                                                                  | Real session/resolver composition with mocked infrastructure; browser claims, mismatch and failure cases | KEEP — not database acceptance evidence                                                                                                                           |
| `packages/contracts/src/personnel/index.ts`                                                                                                                      | Summary/source fields, positive revision, existing update metadata                                       | KEEP — consume existing Personnel authority, no fact expansion                                                                                                    |
| `packages/db-cloud/src/personnel-repository.ts`                                                                                                                  | Scoped find, authoritative mutation/revision/history/receipts                                            | KEEP — source read only for Formalités; do not reuse Personnel write/receipt authority                                                                            |
| `packages/db-cloud/src/schema/personnel.ts`                                                                                                                      | Employee composite ownership, revision and separate Personnel evidence                                   | KEEP — no change to Personnel-owned values/history                                                                                                                |
| `packages/db-cloud/test/personnel-repository.integration.test.ts`                                                                                                | Guarded tenant, conflict, idempotency/history transaction evidence                                       | KEEP as regression/reference; not a Formalités suite                                                                                                              |
| `packages/db-cloud/src/personnel-register-repository.ts`                                                                                                         | Scoped transactions/revision patterns                                                                    | KEEP/reference only, no Register writes                                                                                                                           |
| `packages/db-cloud/drizzle/0005_lean_zzzax.sql`, `0006_aromatic_boom_boom.sql`, `0009_heavy_sauron.sql`, `0017_whole_warbound.sql`, `drizzle/meta/_journal.json` | Existing dossier/revision, receipt/composite identity, weekly minutes, F07/journal                       | KEEP — no old migration edits or execution                                                                                                                        |

No current Formalités draft repository, transport schema, database table or
write action was found: search `formalites|probation` over
`packages/contracts/src`, `packages/db-cloud/src`, `packages/db-cloud/drizzle`
returns no match. This is source inspection, not a statement about an unseen DB.

### D. Exact Personnel data/revision available today

All seven source fields come from `PersonnelEmployeeSummary`, inferred from
`personnelEmployeeSummarySchema` (`packages/contracts/src/personnel/index.ts:304`).
`findPersonnelEmployee` (`personnel-repository.ts:207`) reads one current row
using employee + organization + establishment, then `toSummary` (at 1678)
projects current values, trims four text fields and serializes dates/timestamps.
The Formalités model receives those live current values, **not** fixture values.

| Raw domain field        | Contract type / current meaning        | Formalités consumption in `_lib/cdi-draft-connected-read-model.ts` |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| `givenNames`            | string, max 120; Personnel given names | Identity row and employeeName, combined only for presentation      |
| `familyName`            | string, max 120; family name           | Same identity presentation, still separate raw fact                |
| `position`              | string, max 120                        | Poste                                                              |
| `qualification`         | string, max 120                        | Qualification                                                      |
| `employmentTermType`    | `indefinite` / `fixed_term`            | Current type displayed CDI / CDD                                   |
| `entryDate`             | date-only ISO string                   | Locale-formatted Date d'entrée, no invented effective date         |
| `contractWeeklyMinutes` | integer 1–2880 or null                 | Durée hebdomadaire; null becomes Non renseignée                    |

**Count: seven atomic fields, six presentation groups.** The Home/page pack and
test phrase “six fields/facts” describes the displayed rows; interpreting it as
six raw properties would be inaccurate. The user explicitly preserves separate
givenNames/familyName, so this is a counting clarification, not projection growth.
Current presentation additionally repeats identity as employeeName; that is not
an eighth source fact. The return href contains employeeId but is not a fact row.

Real anchor exists: `personnelEmployeeDossiers.revision`, positive integer,
default 1 (`schema/personnel.ts:85`; migration 0005). Summary returns revision
(`personnel-repository.ts:1699`; contract:320). Employee update and departure
increment it transactionally (repository:1217,1455), with expectedRevision
conflicts. No-op/replay paths must not be mistaken for a new revision.
F07 is not the origin of this revision and its baseline/history is not needed
to invent an anchor.

The current connected Pick/model intentionally **does not carry revision or
employeeId**; connected tests explicitly exclude revision. Availability at the
server is not current browser projection. Later Design must capture coherent
existing anchor + seven typed facts under Personnel source authority without
turning formatted strings or browser-submitted revisions into authoritative
source data. No new Personnel business fact is needed for the approved slice.

### E. Prototype state, inputs and formality representation

Generic route: fictional `Camille Martin` fixture. Connected route: actual scoped
Personnel repository read; docs authorize synthetic development QA only. The
runtime gate itself does not inspect a “synthetic employee” property, so it must
not be described as a real-data filter.

Both use `CdiDraftReadinessPrototype` and `cdiDraftPrototypeReducer`:

| Existing illustrative input | Actual type and label                                                                              | Persistence / Product status                                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `address`                   | string; Adresse fictive                                                                            | React draftValues/checkpoint only; no durable first-slice approval; DEFER                                                                   |
| `remuneration`              | string; Rémunération fictive                                                                       | Same memory ownership; no durable approval; DEFER                                                                                           |
| `probationChoice`           | `FictionalProbationChoice = 'undecided' \| 'yes' \| 'no'`; Décision fictive sur la période d’essai | Existing implementation vẫn memory-only; N1 duyệt riêng durable semantic states UNDECIDED / INCLUDE / EXCLUDE, không promote fictional enum |

`activeStep` is SOURCE/INPUTS/REVIEW; reviewAcknowledged, validationAttempted and
checkpoint are UI memory. No URL storage, localStorage/sessionStorage, cookie,
server or database persists them; reload/re-entry resets. Employee identity is
carried by route `[employeeId]`, then a formatted model and return href, not a
durable draft reference. CDI is a route/component/fixture concept, **not an
existing Formalités formality-type enum/record**. Personnel term enum must not
be misrepresented as a Formalités workflow-type contract.

`hasRequiredDemoInputs` requires address and remuneration; probation undecided
or missing review acknowledgement produces ATTENTION_REQUIRED. These are
demonstration rules only and are incompatible with treating the one-input
first slice as a ready legal contract. Do not promote them into durable validation.
N1 hiện cho explicit SAVE với UNDECIDED; không có yêu cầu address/pay hoặc
reviewAcknowledged từ demo được kế thừa để chặn lưu preparation draft.
Connected route does not test CDI/full-time/upcoming; even CDD current facts
can be displayed today. New CDI eligibility is intentional future behavior.

### C. Relevant current persistence patterns

`@yuta/db-cloud` uses Drizzle ORM/PostgreSQL (`postgres`) behind server-only
Backoffice cloudDatabase. ADR-003 and package instructions route approved cloud
domains here; no POS/Display/provider persistence is appropriate. Personnel's
composite unique identity and restrictive employee/establishment foreign keys
demonstrate parent-scope enforcement; ID-only lookup is forbidden.

Current Personnel mutations use `db.transaction`, scoped advisory locks for
idempotency identities, request fingerprints, command receipts, conditional
revision updates and audit/history writes within the transaction
(`personnel-repository.ts:873–1000,1061–1320,1357–1529`). A fingerprint mismatch
is not a safe replay. Register also has scoped transactional snapshot/revision
patterns. These are reusable **conventions**, not permission to store Formalités
in Personnel receipts, audit, history or Register. No generic draft repository
or approved shared history/retention abstraction was found.

Existing Personnel history retention is eligibility only, five years after
departure within its approved scope (Personnel Home §9). It is not a Formalités
retention policy. F5-08 requires per-class review; abandon retention does not
mean keep forever, automatic purge, copied legal hold or cross-module cleanup.

Integration test convention: `CLOUD_DATABASE_URL` plus
`YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`, synthetic UUIDs, separate
organizations/establishments, scoped setup/cleanup. Existing suites may skip
without this environment; a skipped suite is not evidence of persistence PASS.
No DB was accessed in this Analysis. Root/package commands are inspected, not
permission to migrate, seed or run unguarded integration against real data.

## Affected Boundaries

### F. Authorization path and operation matrix

Current helper: `requireFormalitesTenant` → existing
`requireAuthenticatedTenant` → validated opaque session → active metadata →
`resolveAuthenticatedTenant` with matching active membership →
`requireEstablishment` → independent Formalités operation guard.
Formalités permission arrays are exactly OWNER for each operation. Missing
establishment fails 400; unauthorized actor/operation fails 403. Missing session
and invalid scope preserve existing login/recovery redirects, not fabricated
generic 403 for every failure. Public/service and YUTA_ADMIN/YUTA_SUPPORT
without valid restaurant membership cannot bypass.

| Intended boundary                | Required authority to specify later                                                      | Scope/evidence needed                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Load eligible employee for draft | Formalités READ for workflow entry plus independent `personnel.employee.read` for source | Fresh scoped employee, current indefinite; same trusted establishment                                                       |
| Create draft                     | Formalités MANAGE; Personnel source READ for coherent source capture                     | Employee parent and active-draft cardinality; no browser snapshot as source truth                                           |
| Read/reopen draft                | Formalités READ; Personnel source READ for current comparison                            | Scoped draft + matching employee; do not return other establishment metadata                                                |
| Save draft                       | Formalités MANAGE; Personnel source READ whenever validating/refreshing source           | Server-resolved draft state; no silent overwrite or browser-derived authority                                               |
| Edit flow                        | READ to load, MANAGE for authoritative saved mutation                                    | No second permission inferred from the first; retained inputs on failure                                                    |
| Abandon                          | Formalités MANAGE                                                                        | Scoped draft and explicit transition; N2 required abandonmentReason metadata, kể cả recovery non-CDI; no Personnel mutation |
| Reconciliation choice            | READ/source READ for comparison; MANAGE for committing choice                            | Bounded fields, current source validation, no Personnel write-back                                                          |

N3 eligibility áp dụng riêng ngoài permission allow: READ/recovery được giữ
cho existing non-CDI draft; normal EDIT/SAVE và continuation REFRESH bị chặn.
Authorization allow không override current Personnel eligibility.

This table is boundary analysis, not endpoint/API design. Existing guards cover
these logical operations; resource ownership enforcement is still a future
consumer responsibility. A Personnel allow or generic OWNER test cannot
substitute for Formalités evaluation. No new permission/grant is required.

### G. Tenancy boundary

Every establishment-owned draft access must retain organization + establishment
and validate its employee within the same scope. Route/draft/employee IDs are
lookup candidates, not authority. Browser tenant, organization, establishment,
membership, role and permission fields never select trusted scope. Membership
revocation/switching between load and save must fail/revalidate through the
existing server boundary; old browser state cannot authorize the old scope.
No session/tenancy model, runtime boundary or cross-establishment aggregate is
introduced. No API accepting client-supplied TenantContext is justified.

### H. Concurrency/cardinality analysis

One active DRAFT per trusted organization + establishment + employee + formality
type is a Product invariant, not a UI button rule. Concurrent creates can both
observe no draft; concurrent save/abandon or create-after-abandon can race;
two editors can overwrite each other's changes; response loss can replay a
command. Existing Personnel command receipt does not solve Formalités races
merely because both are cloud-backed.

Later specifications/design need observable non-overwrite, atomic transition,
conflict/retry and replay outcomes. Re-reading only in the browser is insufficient.
The invariant permits a new draft after retained ABANDONED; it does not permit
editing the abandoned record into a new active draft by assumption. This
Analysis chooses no unique index, locking primitive, table layout or receipt
schema; those require approved requirements and Sensitive Design.

### I. Reconciliation feasibility

Available current revision plus seven typed facts make comparison feasible.
Revision may change for facts **outside** this snapshot (e.g. departure), so
revision mismatch alone does not prove a relevant field changed. Conversely,
formatted display equality is not a raw value comparison. Snapshot null versus
populated weekly minutes and individual names must remain distinguishable.

On relevant divergence, preserve snapshot and current Personnel, expose explicit
KEEP DRAFT VALUE / REFRESH FROM PERSONNEL decisions. Decisions apply only to
the approved snapshot; never copy choices back to Personnel or merge histories.
If Personnel changes again during review, stale choices must not silently adopt
an unseen current value. Design must keep capture origin and reconciliation
acknowledgement truthful after KEEP; a source anchor cannot falsely assert that
retained draft values are current Personnel truth.

N3 đã được Product giải quyết: current Personnel `employmentTermType != indefinite`
chặn creation và không tạo draft mới. Với existing retained draft:

- Cho READ và REOPEN ở bounded ineligible/recovery state, xem snapshot và
  current Personnel values, cùng explicit ABANDON với required reason.
- Không cho normal EDIT/SAVE, REFRESH làm tiếp tục eligible CDI workflow, hoặc
  tạo active draft khác trong khi current Personnel vẫn non-CDI.
- UI/runtime phải nêu employee hiện không còn eligible. Không auto-abandon,
  auto-delete, silent formality-type conversion hoặc old-snapshot eligibility.
- Khi current Personnel lại CDI, re-evaluate current eligibility và yêu cầu
  reconciliation với current source; chỉ sau required reconciliation mới
  cho normal EDIT/SAVE tiếp tục theo lifecycle DRAFT đã duyệt. Không làm sống
  lại ABANDONED bằng assumption.
- KEEP DRAFT VALUE không có nghĩa CURRENT PERSONNEL ELIGIBILITY IS PRESERVED.
  Reconciliation choice và eligibility là hai khái niệm riêng.

Không mở rộng thêm full-time/upcoming/departure gate. Field-vs-identity-group
presentation và conflict mechanisms vẫn là Design-level với đủ bảy raw facts.

### J. probationChoice authority check

Exact code enum is explicitly **Fictional**; radio labels say Oui — fictif,
Non — fictif, À décider. Data/Interaction:264 proposes conditional yes/no plus
duration/conditions/renewal, but marks template/collective/qualified review
BLOCKED. Its “Review outcome” says no row approved for persistence/runtime.
`LEGAL_REVIEW_BRIEF.md:110` asks a reviewer for allowed cases; it is not approved
law/template knowledge. No durable probationChoice schema/enum was found.

N1 hiện RESOLVED bằng explicit Product decision, không bằng legal matrix:

| Durable semantic state | User-facing meaning               |
| ---------------------- | --------------------------------- |
| UNDECIDED              | À décider                         |
| INCLUDE                | Prévoir une période d’essai       |
| EXCLUDE                | Ne pas prévoir de période d’essai |

Initial `probationChoice = UNDECIDED`. Explicit SAVE được phép trong trạng thái
này vì preparation draft là công việc đang làm, không phải hợp đồng hoàn chỉnh.
INCLUDE chỉ có nghĩa OWNER muốn draft chứa hướng chuẩn bị về période d’essai;
không xác nhận legal eligibility, validity, duration, renewal, collective-agreement
compliance hoặc legal recommendation. Không thêm duration, renewal, legal
conditions, NOT_APPLICABLE hoặc default INCLUDE/EXCLUDE. Đây là Product semantic
contract để viết Specs sau review, không phải schema/transport enum được tạo
ở Gate 1. Existing fictional values/code giữ nguyên.

### K. Migration implications

There is no durable Formalités state to migrate from React checkpoints. Later
persistence requires reviewed additive cloud data work, not conversion of
fictional local inputs or automatic backfill of every employee into a draft.
Journal currently ends at `0017_whole_warbound`; current revision originated
in 0005, composite identity/receipts in 0006, weekly duration in 0009. Existing
SQL, journal and schemas remain untouched. No table names/columns/constraints
chosen and no migration generated/applied here.

Sensitive Design must address scoped parent integrity, concurrency, failure
rollback, retained sensitive snapshots, backup/retention boundaries and safe
data-preserving recovery. N4 chưa giải quyết là blocking obligation cho applicable
Sensitive Design/privacy-data review trước durable persistence Apply; không thể
chỉ hoãn đến production. Không tự chọn thời hạn hoặc cơ chế retention. An
implementation plan or production migration is not authorized by this analysis;
external production gates stay open.

### CROSS-MODULE IMPACT CHECK — current ten criteria

Criterion meanings follow the current Page Chat v3 §1 exactly. A YES for impact
does not imply authority to change the referenced module.

| #   | Criterion                                               | Result | Exact evidence and bounded assessment                                                                                                                                                                                                            |
| --- | ------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Read/write another module's data?                       | YES    | F `[employeeId]/page.tsx` calls `findPersonnelEmployee`; model Pick consumes Personnel facts, draft snapshot adds durable consumption                                                                                                            |
| 2   | Change or ambiguity in canonical data owner?            | YES    | Registry durable Formalités row has NEEDS REVIEW; current handoff establishes new bounded Formalités state owner, while Personnel Home §§6–8 preserves Personnel truth. This needs Gate 1 ownership acknowledgement, not a transfer of Personnel |
| 3   | Another module must consume/react/update?               | NO     | Direction remains Formalités ← Personnel read. No Personnel/Document/Register mutation, event reaction or subscriber required by handoff; existing full-dossier link remains                                                                     |
| 4   | Shared permission/security/tenancy/identity impact?     | YES    | New resource consumer must compose normative `authorization/formalites` and `server/auth/formalites.ts` with source permission/scope. Grants/model unchanged; impact is enforcement integration                                                  |
| 5   | Multiple runtime families?                              | NO     | Backoffice route + ADR-003/db-cloud only; no POS/Site Agent/Display coupling                                                                                                                                                                     |
| 6   | Legal/privacy/provider/external integration?            | YES    | Durable employee snapshots/probation data; F5-08, HR-RET-01/HR-AUDIT-01. Provider/legal contract generation explicitly excluded                                                                                                                  |
| 7   | Accepted ADR/architecture/runtime/data boundary change? | YES    | New Formalités durable data boundary where Registry currently says no durable state. No ADR-003/runtime reassignment; snapshot/current-source boundary needs explicit review                                                                     |
| 8   | Coordinated Product Decision across capabilities?       | YES    | Handoff §§4–7 links Personnel ownership/revision to Formalités snapshot/reconciliation; Identity / Access remains authorization owner                                                                                                            |
| 9   | Coordinated rollout/contract across pages/modules?      | YES    | Existing summary/projection lacks anchor in presentation, future bounded draft transport crosses contracts/Backoffice/db-cloud; Personnel authorization independent. No production rollout is authorized                                         |
| 10  | UI/UX in multiple pages needs coordinated QA?           | YES    | Full dossier `S _components/salaries-page.tsx:1237` → F `[employeeId]/page.tsx` → return link; source update/reopen reconciliation and generic demo non-regression need combined QA                                                              |

Impact classification: **CROSS_MODULE**, not PAGE_LOCAL. This is already a
Control Tower-origin bounded parent request, not an uncoordinated page-local
continuation. No newly discovered cross-runtime or permission expansion.

## Lifecycle Baseline

Registry bounded prototype: APPROVED / PROTOTYPE / DEVELOPMENT_ONLY / BLOCKED /
BLOCKED. Broader durable lifecycle: PROPOSED / NOT_STARTED / NOT_ENABLED /
BLOCKED / BLOCKED; its Data Owner marker remains NEEDS REVIEW. Personnel dossier:
APPROVED / IMPLEMENTED / UNVERIFIED / BLOCKED / BLOCKED. Current handoff approves
starting Product scope only; it does not promote these records or claim a live
environment. Auth/tooling DONE is a workflow result, not production release.

## Requirement Readiness

Behavior is new, so `skip_specs: true` is inappropriate. Candidate capability is
`formalites/persistent-draft-foundation` only. Source/projection/revision and
authorization feasibility are established by inspection; no storage trial or
future integration is claimed. N1–N3 đã có explicit Product answers; không còn
Product blocker cho behavioral Specs. N4 được carry forward unresolved, không
chặn Specs giới hạn ở retained ABANDONED/no workflow hard-delete; không đồng
nghĩa infinite retention. N4 phải được giải quyết tại applicable Sensitive
Design/privacy-data review trước persistence Apply. Gate 1 mới vẫn cần human
review; READY_FOR_SPECS không tự authorize viết Specs.

## UI / UX Applicability

### L. Test/QA implications

UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES for later implementation verification.
Target is an **existing employee-connected page**, despite historical page-pack
creation label NEW_PAGE. Preserve the current shell, full-dossier handoff,
allowlisted live source, French UI, keyboard/focus and responsive behavior.
No new mockup, page pack or UI code is created at Gate 1.

Later evidence must distinguish source/model tests, request authorization tests,
guarded disposable DB integration, and actual authenticated Browser QA:

- Source projection exact seven fields/six rows, null handling, real revision,
  CDI-only eligibility including part-time/current/upcoming cases without extra
  gates; source changes outside projection do not fake relevant divergence.
- OWNER READ/MANAGE and independent source READ; manager/staff/public/service
  denial, system-role non-bypass, missing/inactive/mismatched context, stale
  membership and wrong organization/establishment/employee/draft IDs.
- Actual create/save/reopen/abandon persistence; no autosave; one active draft
  under concurrent creates; save/save, save/abandon, abandon/recreate, replay,
  conflict and transaction failure outcomes without partial state or overwrite.
- Snapshot/current differences; mixed KEEP/REFRESH choices, new source revision
  during reconciliation, no silent refresh, no Personnel/history writes.
- N1: ba semantic states/đúng French meaning, initial UNDECIDED, explicit SAVE
  UNDECIDED thành công; không legal recommendation/duration/renewal/NOT_APPLICABLE
  hoặc mặc định INCLUDE/EXCLUDE, không kế thừa demo address/pay requirements.
- N2: ABANDON không có reason bị từ chối; required reason là workflow metadata,
  không input hợp đồng thứ hai; retained ABANDONED và no workflow hard-delete.
- N3: current non-CDI chặn create; existing draft vẫn scoped READ/REOPEN/snapshot/
  current values/ABANDON recovery, nhưng normal EDIT/SAVE/continuation REFRESH
  và another active draft bị chặn. Không automatic abandon/delete/type conversion.
  Current CDI trở lại phải re-evaluate/reconcile trước normal EDIT/SAVE; KEEP
  snapshot không bypass current eligibility. Áp dụng cùng authority/scope checks.
- N4: Specs không assert retention duration, Personnel-policy reuse, keep-forever,
  purge/job hoặc hold policy. Trước persistence Apply cần đúng Sensitive
  Design/privacy approval; chưa có runtime retention-test implementation ở đây.
- Không legal claim, excluded address/pay persistence hoặc generated file.
- Existing generic prototype and Personnel history/authorization regression.
- Real local route with safe synthetic data: leave/reopen, pending/success/error,
  retry, stale edits, denial, eligibility/reconciliation, dirty-close/focus and
  responsive 1440/1024/768/390; screenshot evidence at QA, not now.

Commands exist in manifests: Backoffice test/typecheck/build, contracts and
db-cloud test/typecheck; guarded suites must be targeted because db-cloud
`test:integration` names only `test/schema.integration.test.ts`. Root docs,
architecture, recursive typecheck and formatting; Next bootstrap prerequisite
as documented before clean-state typecheck. No new test command is invented.
These are analysis evidence needs, **not Tasks/implementation plan**. No claim
that a new Formalités persistence test or Browser QA passed this turn.

## Conflicts and Unknowns

### M. Exclusions and deferred decisions

Keep exact Proposal non-goals: address/remuneration, full legal dictionary,
templates/PDF/signature, DPAE/DSN/payroll, providers/AI/OCR/extraction, Documents
handoff, legal calculations/advice, new grants, Personnel write-back/history,
generic engine, broad redesign, production and migration execution. F5-07
GENERATED/SUPERSEDED remain outside this first slice; readiness is not an added
durable state. Do not use broader legal-template requirements to silently add
fields to this preparation-only draft.

Design-deferred, after the required human gates: table/constraint/transaction mechanics,
typed boundary shapes, operation concurrency tokens, idempotency scope, coherent
anchor capture, reconciliation presentation/acknowledgement, error mapping,
non-production rollout guard and migration/rollback mechanics. No invented
storage model, legal-hold authority or cleanup executor in this Analysis.

### N. CONFLICT / NEEDS REVIEW

| ID  | Classification                                         | Exact finding / decision needed                                                                                                                                                                                                                                                  | Gate impact                                                                                                                                    |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| N1  | RESOLVED                                               | Approved UNDECIDED / INCLUDE / EXCLUDE với đúng French meaning; initial UNDECIDED, SAVE UNDECIDED được phép; INCLUDE chỉ hướng chuẩn bị của OWNER, không legal conclusion                                                                                                        | Không chặn Specs                                                                                                                               |
| N2  | RESOLVED                                               | ABANDON reason REQUIRED; abandonmentReason là workflow metadata, không phải second preparation input. Không reason enum; length/transport/storage validation shape để Design                                                                                                     | Không chặn Specs                                                                                                                               |
| N3  | RESOLVED                                               | Current non-CDI: no new draft; existing scoped recovery READ/REOPEN/view snapshot/current/ABANDON allowed, normal EDIT/SAVE/eligible-continuation REFRESH/another active draft denied. CDI trở lại phải re-evaluate/reconcile trước normal EDIT/SAVE; KEEP không giữ eligibility | Không chặn Specs                                                                                                                               |
| N4  | CARRIED_FORWARD_UNRESOLVED — ACKNOWLEDGED / UNRESOLVED | Retain ABANDONED/no workflow hard-delete không định nghĩa infinite retention; không 1-year/5-year/Personnel reuse/keep-forever/purge/hold/job policy. Chưa có approved per-class Formalités period                                                                               | Không chặn behavioral Specs; blocking obligation tại applicable Sensitive Design/privacy-data review trước durable sensitive persistence Apply |

CONFLICT mới ảnh hưởng requirement: NONE. N1–N3 không còn là Product blockers;
N4 không được ghi resolved hoặc chỉ là production follow-up. Current repository
source bytes khớp baseline trước revision; không lặp Discovery hoặc reopen
prerequisites. Human decisions được ghi tại đây nhưng Gate 1 vẫn chưa duyệt.

Documentation reconciliation (not silently edited):

- Seven raw fields versus six display facts: clarified from Pick/model/test;
  no required projection expansion (D).
- Page-pack introductory Phase 3 text says no inputs while later Phase 4 and
  current component do expose three local inputs. Use current Phase 4 code and
  dated section for Implemented State; preserve historical section.
- Historical Phase 5/F08 upcoming/full-time eligibility is a proposal, not an
  accepted restriction or current runtime guard. The explicit new handoff
  chooses CDI only for preparation, not legally valid contract generation.
- Broad durable Data Owner review marker is not proof of an alternative owner;
  current handoff/ADR resolve this bounded direction. Broader generation/files/
  signature ownership and lifecycle remain unresolved, unpromoted.
- Legal brief/review matrix do not authorize an enum or production use. N1
  semantic states được duyệt riêng trong current Product decision, không phải
  qualified legal-template approval và không sửa prototype enum.
- CLI banner/planningHome defaultSchema displays spec-driven, but pinned
  `.openspec.yaml`, `schemaName` and artifact instructions resolve
  yuta-spec-driven. Same observed metadata discrepancy as archived prerequisite;
  no schema/CLI changes or fallback performed.

Pre-existing dirty candidate includes Personnel F07, auth/tooling prerequisites,
workflow documentation and staged six next-env tracking removals. Captured HEAD
`07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa` and raw file inventory; these are not
attributed to this new change. No source normalization or old prerequisite
review regeneration is authorized.

Stop if a different owner/runtime, new permission/grant/security boundary,
Personnel write-back/projection expansion, required provider/legal template or
unsupported Product semantic becomes necessary. Return those exact findings
to Control Tower; do not solve them in code.

## Analysis Conclusion

READY_FOR_SPECS

- PRODUCT SCOPE: PASS — N1–N3 resolved bằng explicit Product decisions.
- AUTHORITY / OWNERSHIP: PASS for this bounded slice — Formalités draft,
  Personnel facts/revision/history, Shared Authorization giữ đúng boundary;
  broader Registry lifecycle/ownership markers không được promote.
- CROSS-MODULE IMPACT: CROSS_MODULE — preserved, full ten criteria unchanged.
- DATA/PERSISTENCE FEASIBILITY: PASS IN PRINCIPLE — existing cloud boundary và
  real Personnel anchor; chưa có schema/Design approval hoặc DB acceptance proof.
- SECURITY/TENANCY: PASS for requirements progression — dedicated OWNER
  operations đủ; future consumer phải enforce source/resource scope, no grants.
- PRODUCT BLOCKERS: NONE for Specs.
- CARRIED SENSITIVE ISSUE: N4 retention/privacy — ACKNOWLEDGED / UNRESOLVED;
  phải được giải quyết tại applicable Sensitive Design/privacy-data gate trước
  durable sensitive persistence Apply. Không retention duration/hold/cleanup
  policy được ngầm phê duyệt; production NOT_AUTHORIZED.

Gate 1: AWAITING_HUMAN_REVIEW. Không tạo Specs, Design, Tasks, schema/migration,
API, code, sync/archive hoặc production operation. Không dùng skip_specs.
