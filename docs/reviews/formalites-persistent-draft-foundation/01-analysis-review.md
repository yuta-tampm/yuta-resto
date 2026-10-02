Change: formalites-persistent-draft-foundation

Gate: 1 — Regenerated Product / Authority review

Review status: APPROVED

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-04T21:02:55.9345731+02:00

Created: 2026-09-04

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — Personnel privacy, durable data boundary, scoped authorization consumption, migration

## Revision authority and disposition

Nguồn: explicit current-user attachment
`804bf47f-0e58-401c-b03d-b598ec274d6a/pasted-text.txt`.

Đây là TARGETED PROPOSAL / ANALYSIS REVISION → REGENERATED GATE 1, không phải
approval cho current Gate 1, Specs hoặc Apply. Skill `yuta-run-change` điều phối
review; `openspec-update-change` giới hạn revision vào existing artifacts.
Cả hai skill hiện tại và CLI instructions được đọc trước revision.

Previous Gate 1 disposition: CHANGES_REQUESTED theo explicit request, sau đó
regenerated về AWAITING_HUMAN_REVIEW. Previous BLOCKED_NEEDS_REVIEW conclusion
được supersede **chỉ** nhờ approved N1–N3 và explicit N4 carry-forward;
không phải approval được suy từ code/test. Previous packet raw SHA-256:
`746f1fbe99eedf51fad94eee65c495ac94e9c59400c575eba41d4d6b552c0625` (historical provenance only).

Trước sửa: đúng hai reviewed artifacts và năm protected authorization entries
trong packet cũ đều raw SHA-256 MATCH (7/7). Specs/Design/Tasks vẫn absent.
Không phát hiện source/authority drift cần discovery lại; không mở lại hai
prerequisite đã DONE.

## Approved Product decision table

| Item | Decision state             | Approved bounded semantics                                                                                                                                                                                                                                                   |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N1   | RESOLVED                   | Durable semantic states UNDECIDED / INCLUDE / EXCLUDE. Initial UNDECIDED; explicit SAVE được phép khi UNDECIDED. INCLUDE chỉ là hướng chuẩn bị OWNER muốn, không legal eligibility/validity/duration/renewal/collective compliance/recommendation                            |
| N2   | RESOLVED                   | ABANDON → reason REQUIRED. abandonmentReason là workflow metadata, không phải input nội dung hợp đồng thứ hai. Không reason enum tại Gate 1                                                                                                                                  |
| N3   | RESOLVED                   | Current Personnel CDI điều khiển eligibility; non-CDI existing draft chỉ bounded READ/REOPEN/view snapshot/current/ABANDON recovery; không normal EDIT/SAVE/eligible-continuation REFRESH hoặc another active draft. CDI trở lại phải re-evaluate và required reconciliation |
| N4   | CARRIED_FORWARD_UNRESOLVED | ACKNOWLEDGED / UNRESOLVED; không chặn behavioral Specs, bắt buộc giải quyết tại applicable Sensitive Design/privacy-data gate trước durable sensitive persistence Apply                                                                                                      |

### Exact N1 user-facing meaning

| State     | Meaning                           |
| --------- | --------------------------------- |
| UNDECIDED | À décider                         |
| INCLUDE   | Prévoir une période d’essai       |
| EXCLUDE   | Ne pas prévoir de période d’essai |

Không thêm duration, renewal, legal conditions, NOT_APPLICABLE hoặc default
INCLUDE/EXCLUDE. Preparation draft đang làm dở không phải completed employment
contract. Existing fictional yes/no/undecided code không được sửa trong revision.

### Eligibility and reconciliation remain independent

- Current Personnel `employmentTermType != indefinite`: no new draft.
- Existing non-CDI draft có bounded ineligible/recovery state để đọc/mở lại,
  xem snapshot/current values và explicit abandon với required reason.
- Chặn normal EDIT/SAVE và REFRESH để tiếp tục eligible CDI workflow; không
  dùng snapshot CDI cũ hoặc KEEP DRAFT VALUE để vượt current eligibility.
- Không auto-abandon/delete/type conversion. Khi Personnel trở lại CDI,
  re-evaluate current eligibility và reconcile current source trước normal
  EDIT/SAVE theo DRAFT lifecycle. Không tự tái kích hoạt ABANDONED.
- Không thêm full-time/upcoming/departure/probation legal eligibility.

### N4 gate placement — mandatory carry-forward

Retained ABANDONED và no workflow hard-delete là bounded statement có thể viết
trong Specs; không thiết lập infinite retention. Không tự đặt 1 năm/5 năm,
reuse Personnel retention, keep-forever, automatic purge, legal hold hoặc job.

Current `yuta-run-change` State 3 và
`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` “Conditional sensitive Design Gate”
đặt sensitive review trước Tasks/Apply. Normativity policy §§4–5 vẫn yêu cầu
applicable privacy authority; không có dedicated privacy gate sớm hơn được tìm
thấy cho việc viết bounded behavioral Specs này. N4 **không** chỉ là production
follow-up: unresolved N4 chặn approval cho durable sensitive persistence Apply.
Generic Design approval không tự đóng N4 nếu thiếu đúng privacy decision/evidence.

Production: NOT_AUTHORIZED.

## Separate review conclusions

| Review dimension             | Result                                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| PRODUCT SCOPE                | PASS — approved N1–N3 incorporated                                                                                          |
| AUTHORITY / OWNERSHIP        | PASS for this bounded slice; Formalités draft, Personnel source/history/revision, Shared Authorization grants/enforcement   |
| CROSS-MODULE IMPACT          | CROSS_MODULE — preserved, all ten criteria unchanged                                                                        |
| DATA/PERSISTENCE FEASIBILITY | PASS IN PRINCIPLE — no schema/Design approval or new DB proof                                                               |
| SECURITY/TENANCY             | PASS for requirements progression — existing OWNER operations; future resource/source enforcement still required            |
| PRODUCT BLOCKERS             | NONE for Specs                                                                                                              |
| CARRIED SENSITIVE ISSUE      | N4 retention/privacy unresolved; must be resolved at applicable Sensitive Design/privacy-data gate before persistence Apply |

## Exact reviewed artifact integrity

PowerShell command used per artifact:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <repository-relative-path>
```

Hashes cover exact raw bytes **after** scoped formatting. Sorted current table:

| Artifact                                                              | SHA-256                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/formalites-persistent-draft-foundation/analysis.md` | `11f11ee989b339dad2286fd6e2bc34e3119514a55dd4717123bea529a28ad693` |
| `openspec/changes/formalites-persistent-draft-foundation/proposal.md` | `2166d890b0449b63c925c798724e9e66432a8bff5debbccab238851ade73db18` |

Exact complete Proposal/Analysis are embedded below, not replaced by summaries.
Future approval applies only to this regenerated packet and these exact bytes.

## Preserved boundaries and attribution

- HEAD `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`; existing dirty shared work
  preserved. Pre-revision raw inventory: 2235 on-disk tracked/untracked,
  non-ignored files using the same `git ls-files --cached --others
--exclude-standard` + unique sort + `Get-FileHash` method.
- Before/after comparison permits changes **only** to Proposal, Analysis and
  this Gate 1 packet; no path created/deleted. Metadata `.openspec.yaml` intact.
- Exact original implementation inventory, seven-field source findings,
  ten-criterion cross-module check and Proposal non-goals remained unchanged
  by section comparison. Only N1–N4 semantics, dependent evidence needs,
  requirement readiness and review/provenance changed.
- No implementation, tests, canonical Product Knowledge, page pack, normative
  spec, schema, migration, API, config or provider changes.
- `formalites-authorization` remains DONE under
  `openspec/changes/archive/2026-09-04-formalites-authorization`, with its
  completed Gate 3/Knowledge reviews unchanged.
- `next-generated-types-bootstrap` remains DONE under
  `openspec/changes/archive/2026-09-04-next-generated-types-bootstrap`.
  No next-env tracking/ignore or tooling change.
- No prerequisite resync/archive, review regeneration, runtime call, migration
  or production operation.

Protected bytes remain:

| Protected path                                                  | SHA-256                                                            |
| --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/server/auth/formalites.ts`                 | `60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626` |
| `apps/backoffice/src/server/auth/permissions.ts`                | `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` |
| `apps/backoffice/test/formalites-authorization-context.test.ts` | `af3a2bd48565cec5afb559602626b16c563f21ca3ec660b7943e4e49327f4537` |
| `apps/backoffice/test/formalites-permissions.test.ts`           | `9e9888461c4154df90802f3d9021956dba3731cd34a9d27aa110d08ba9bc42e6` |
| `openspec/specs/authorization/formalites/spec.md`               | `1815f4dcdd4236d08176b45377e08e9e72a7d187de89172458d7e796a6a05616` |

## Checks actually run during this revision

| Command                                                                                                                                                              | Actual result                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `git status --short`; `git rev-parse HEAD`                                                                                                                           | Exit 0; existing dirty baseline captured, no reset                                         |
| `openspec status --change formalites-persistent-draft-foundation --json`                                                                                             | Exit 0; yuta-spec-driven, only Proposal/Analysis exist                                     |
| `openspec instructions proposal --change formalites-persistent-draft-foundation --json`                                                                              | Exit 0; current path/rules read                                                            |
| `openspec instructions analysis --change formalites-persistent-draft-foundation --json`                                                                              | Exit 0; current path/rules read; revised Proposal read before Analysis update              |
| `pnpm exec prettier --write openspec/changes/formalites-persistent-draft-foundation/proposal.md openspec/changes/formalites-persistent-draft-foundation/analysis.md` | Exit 0; scoped artifacts only                                                              |
| `pnpm docs:check`                                                                                                                                                    | Exit 0; 36 current documents                                                               |
| `pnpm architecture:check`                                                                                                                                            | Exit 0; runtime imports, database URLs, client boundaries, migration baselines valid       |
| `pnpm -r --if-present typecheck`                                                                                                                                     | Exit 0; scope 15 of 16 projects; existing generated local state, not clean-bootstrap proof |
| `pnpm format:check`                                                                                                                                                  | Exit 1; exactly 62 pre-existing unrelated files; no full-format PASS                       |

No broad repository discovery repeated. Hash comparisons, existing artifact
reads and targeted current privacy-gate checks were performed. No unit/DB
integration/Browser QA/build/typegen run claimed; no implementation change
requires their rerun. Strict OpenSpec delta validation is not run before Specs;
no delta or skip_specs flag is manufactured. Final packet checks recorded below.

### Existing full-format debt — unchanged

```text
.agents/skills/openspec-apply-change/SKILL.md
.agents/skills/openspec-archive-change/SKILL.md
.agents/skills/openspec-continue-change/SKILL.md
.agents/skills/openspec-explore/SKILL.md
.agents/skills/openspec-new-change/SKILL.md
.agents/skills/openspec-propose/SKILL.md
.agents/skills/openspec-sync-specs/SKILL.md
.agents/skills/openspec-update-change/SKILL.md
.agents/skills/openspec-verify-change/SKILL.md
docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_1_AUTHORITY_MODEL_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_2_LIFECYCLE_STATUS_MODEL_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_3_MODULE_REGISTRY_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_1_PERSONNEL_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_2_TODAY_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_3_ESTABLISHMENT_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_4_IDENTITY_ACCESS_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_5_SITE_AGENT_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_6_DISPLAY_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md
docs/features/establishment/general-information/README.md
docs/features/establishment/README.md
docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md
docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md
docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md
docs/reviews/restaurant-knowledge-validated-knowledge/02-specs-review.md
docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md
docs/reviews/restaurant-knowledge-validated-knowledge/04-knowledge-consolidation-review.md
docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md
docs/tasks/YUTA_INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_AUDIT_TASK.md
docs/tasks/YUTA_INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_TASK.md
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_TASK.md
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_PROPOSAL_ANALYSIS_TASK.md
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_TASK.md
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_TASK.md
docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md
docs/tasks/YUTA_STEP_6_2A_INDEX_TRUTHFULNESS_CLEANUP_TASK.md
docs/tasks/YUTA_STEP_6_2B1_CURRENT_STATE_SLIM_PLAN_TASK.md
docs/tasks/YUTA_STEP_6_2C_ARCHIVE_KNOWLEDGE_NORMALIZATION_HISTORY_TASK.md
docs/tasks/YUTA_STEP_6_2D1_PUBLIC_BOOKING_PRODUCT_SPEC_REVIEW_TASK.md
docs/tasks/YUTA_STEP_6_2D3_POS_PRODUCT_SPEC_REVIEW_TASK.md
docs/tasks/YUTA_STEP_6_2E1_UI_PROMPT_TOPOLOGY_REVIEW_TASK.md
docs/tasks/YUTA_STEP_6_2E2_IMPLEMENT_GENERATED_SNAPSHOT_TOPOLOGY_TASK.md
docs/tasks/YUTA_STEP_6_2E3_MIGRATE_EXISTING_PROMPT_PROVENANCE_TASK.md
docs/tasks/YUTA_STEP_6_2F_FINAL_DOCUMENTATION_CLEANUP_VALIDATION_TASK.md
openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/analysis.md
openspec/schemas/yuta-spec-driven/templates/design.md
openspec/schemas/yuta-spec-driven/templates/proposal.md
openspec/schemas/yuta-spec-driven/templates/spec.md
openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md
openspec/specs/restaurant-knowledge/validated-knowledge/spec.md
```

All 62 warning paths remain outside this revision and raw-byte unchanged.

## Exact Proposal

```markdown
## Why

Formalités hiện chỉ giữ thao tác chuẩn bị trong bộ nhớ trình duyệt: OWNER rời
trang hoặc tải lại sẽ mất công việc. Sau khi prerequisite phân quyền riêng đã
hoàn tất, cần một draft CDI có thể lưu và mở lại mà không biến bản chụp của
Formalités thành nguồn sự thật mới của Personnel.

## What Changes

- First slice: persistent CDI preparation draft cho một employee đã tồn tại
  trong trusted organization + active establishment. Eligibility chỉ xét
  current Personnel CDI (`employmentTermType = indefinite` trong repository),
  không thêm điều kiện full-time, upcoming, departure hoặc kết luận pháp lý.
- OWNER sử dụng hai quyền độc lập `formalites.read` / `formalites.manage` đã
  được triển khai; MANAGER, STAFF và system-role bypass không được mở. Giữ
  Personnel source-read permission độc lập khi đọc dữ liệu Personnel.
- Formalités sở hữu draft, reconciliation và abandonment; Personnel giữ
  current facts, authoritative mutations, history và revision. Shared
  Authorization giữ representation, grants và server enforcement.
- Draft hybrid gồm employee reference, existing Personnel revision anchor và
  snapshot đúng bảy field đang tạo sáu nhóm hiển thị: `givenNames`, `familyName`,
  `position`, `qualification`, `employmentTermType`, `entryDate`,
  `contractWeeklyMinutes`. Không invent combined identity hoặc field Personnel.
- Chỉ `probationChoice` được phê duyệt làm input nghiệp vụ durable mới của
  Formalités, với ba semantic states được Product duyệt: `UNDECIDED` (À décider),
  `INCLUDE` (Prévoir une période d’essai), `EXCLUDE` (Ne pas prévoir de période
  d’essai). Initial state là UNDECIDED và explicit SAVE vẫn được phép khi chưa
  quyết định. INCLUDE chỉ ghi hướng chuẩn bị mà OWNER muốn, không xác nhận legal
  eligibility/validity, duration, renewal, collective-agreement compliance hoặc
  đưa ra legal recommendation. Không thêm NOT_APPLICABLE hay default INCLUDE/EXCLUDE.
- CREATE → DRAFT; explicit SAVE, REOPEN và EDIT; explicit ABANDONED được giữ
  lại. Không autosave/hard delete. Tối đa một active DRAFT cho organization +
  establishment + employee + formality type; có thể tạo mới sau abandonment,
  không overwrite draft đang active. ABANDON bắt buộc reason theo F5-07;
  `abandonmentReason` là workflow metadata, không phải input nội dung hợp đồng
  thứ hai. Chưa định nghĩa reason enum hoặc transport/storage validation shape.
- Khi mở lại, so source anchor/snapshot với current Personnel; thay đổi liên
  quan phải hiển thị cả hai giá trị, OWNER chọn KEEP DRAFT VALUE hoặc REFRESH
  FROM PERSONNEL. Không silent refresh, Personnel write-back hoặc history merge.
- Current Personnel CDI mới là eligibility authority. Nếu employee của draft
  đã tồn tại trở thành non-CDI, cho READ/REOPEN ở bounded ineligible/recovery
  state, xem snapshot/current values và ABANDON; chặn normal EDIT/SAVE, REFRESH
  để tiếp tục eligible CDI workflow và tạo draft active khác. Không auto-abandon,
  auto-delete, đổi formality type hoặc dùng snapshot CDI cũ để vượt eligibility.
  Khi current Personnel trở lại CDI, re-evaluate và hoàn tất reconciliation
  bắt buộc trước khi normal EDIT/SAVE có thể tiếp tục. KEEP DRAFT VALUE không
  bảo lưu current Personnel eligibility.
- N4 retention/privacy: ACKNOWLEDGED / UNRESOLVED. ABANDONED được giữ lại và
  workflow không hard-delete, nhưng không thiết lập infinite retention.
  N4 không chặn behavioral Specs; bắt buộc giải quyết tại Sensitive Design/privacy
  review trước khi cho phép Apply durable sensitive persistence. Không tự đặt
  thời hạn, tái dùng Personnel retention, legal-hold policy hoặc cleanup job.
- Mở rộng existing employee-connected capability sau các gate; giữ nguồn dữ
  liệu thật, scoped reads và test protection; không thay bằng fixture/greenfield
  mockup. Không đổi prototype trong lượt này.

## Capabilities

### New Capabilities

- `formalites/persistent-draft-foundation`: lưu/mở lại CDI preparation draft,
  lifecycle DRAFT/ABANDONED, cardinality và explicit bounded reconciliation.

### Modified Capabilities

Không có tại Gate 1. `authorization/formalites` được consume, không sửa grants
hoặc nghĩa của prerequisite; `personnel/reconstructable-value-history` giữ
nguyên. Prototype-preservation requirement của authorization chỉ giới hạn
prerequisite đó, không tự cấm một consumer change được duyệt riêng.

## Impact

- Classification: CROSS_MODULE; Discovery/Shaping: COMPLETED theo handoff
  Control Tower hiện tại. Không downgrade PAGE_LOCAL.
- Runtime dự kiến: cloud Backoffice; database boundary theo ADR-003 là
  `packages/db-cloud`; shared transport theo `packages/contracts`. Chưa chọn
  table, columns, constraints, API hoặc component design. Bounded data owner
  cần được ghi rõ trong Gate 1; không promote registry lifecycle.
- Existing prerequisites `formalites-authorization` và
  `next-generated-types-bootstrap` đã archived/DONE; không mở lại.
- Sensitive change: YES — dữ liệu nhân sự, durable cross-module snapshot,
  authorization consumption và migration/privacy. Sensitive Design Gate bắt
  buộc sau Specs; chưa tạo Design.

### Non-goals

Address, remuneration/salary, legal templates, PDF/preview/generation, signature,
DPAE/DSN, payroll, providers, Documents handoff, final contract creation, AI/OCR,
extraction, legal advice/probation calculation, MANAGER/STAFF grants, Personnel
write-back/history changes, generic workflow/sync engine, broad redesign,
production deployment/enablement, migration/cutover execution. Không áp dụng
Personnel retention policy cho Formalités bằng suy đoán hoặc tạo cleanup job.

### Gate boundary

Chỉ Proposal → Analysis → Gate 1, `AWAITING_HUMAN_REVIEW`. Requirement-level
unknowns/conflicts phải được trả lời trước Specs; không implementation, schema,
migration, canonical knowledge update, sync, archive hoặc production claim.
```

## Exact Analysis

```markdown
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
```

## Final regenerated-packet verification

- `pnpm exec prettier --write docs/reviews/formalites-persistent-draft-foundation/01-analysis-review.md`: exit 0; only this authorized review packet formatted.
- `pnpm exec prettier --check openspec/changes/formalites-persistent-draft-foundation/proposal.md openspec/changes/formalites-persistent-draft-foundation/analysis.md docs/reviews/formalites-persistent-draft-foundation/01-analysis-review.md`: exit 0; all three files PASS.
- Exact embedded complete Proposal and Analysis match their current formatted file contents; both recorded raw SHA-256 values MATCH.
- Raw inventory comparison: 2235 paths before and after; exactly the three authorized documents changed; zero added/deleted paths; the other 2232 file hashes MATCH.
- Four authorization implementation/test files and normative authorization/formalites main spec MATCH. Both completed prerequisite archives and their existing review/knowledge records remain unchanged.
- All 62 paths reported by the full formatting check remain byte-identical to this revision's baseline. They are unrelated existing debt, not repaired or excluded.
- No Specs, Design, Tasks, schema, migration, API, implementation or canonical knowledge change; no sync/archive or production operation.

## Recommendation and stop

Review this exact regenerated Gate 1 packet and approve or request changes.
READY_FOR_SPECS is an Analysis conclusion, not gate approval or permission to
write Specs automatically. N4 remains CARRIED_FORWARD_UNRESOLVED and blocks
durable sensitive persistence Apply until the applicable review resolves it.

Review status: AWAITING_HUMAN_REVIEW.
Sync authorization: NOT_REQUESTED.
Production: NOT_AUTHORIZED.

STOP after these three revised documents. No Specs, Design, Tasks, schema,
migration, API or implementation created.
