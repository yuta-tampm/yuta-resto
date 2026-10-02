Change: formalites-template-legal-review-governance
Gate: 2 — Requirements review
Review status: APPROVED
Created: 2026-09-07T14:02:25.532Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — CROSS_MODULE / AUTHORITY_SENSITIVE

# Specs Review

## Integrity-only chain refresh — 2026-09-07T14:36:24Z

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T14:36:24Z
Rebaseline type: INTEGRITY_ONLY
Gate 2: REMAINS APPROVED

Control Tower đã duyệt ba protected source hashes mới trong Gate 1; reviewed
semantic artifacts UNCHANGED. Current Gate 1 reference trong active hash table
được refresh sau rebaseline. Các hash/approval/result trước đây trong prose là
historical evidence, không thay thế active table hoặc current permission.

Gate 2 packet trước refresh:
`ca50e70078d565bc6618e2220bfd22daf99dbaaf2a8853cc9c1429636b864f6f`.
Metadata, Proposal, Analysis và exact delta hash không đổi; không sửa embedded
spec content. Chỉ tiếp tục Tasks-only sau cập nhật Gate 2b chain; Apply và
production NOT AUTHORIZED.

## Approved Gate 1 and bounded authorization

User instruction: `Gate 1: APPROVED. Proceed to Specs only.`

Gate 1 approval đã được ghi trong [01-analysis-review.md](01-analysis-review.md), với source `explicit current-user instruction`, recorded by `Codex workflow`, timestamp `2026-09-07T14:02:25.532Z`. Approval giới hạn đúng governance scope và yêu cầu STOP tại Gate 2; Sensitive Design Gate tiếp tục bắt buộc sau Design.

Pre-approval Gate 1 packet SHA-256: `3fd7e7b08335bacbe9294b05a96ab36daebf9fb434a6cd3aa17196026f5560fa`. Post-approval hash nằm trong table bên dưới. Chỉ status và dated approval record của packet Gate 1 thay đổi; exact Proposal/Analysis không bị sửa.

Resume check: 13/13 recorded path/hash pairs match, gồm metadata, hai reviewed artifacts và mười protected authority/source files. Existing path-set trước Specs đúng ba files metadata/Proposal/Analysis; không có pre-existing Specs, Design hoặc Tasks để overwrite.

## Scope and provenance

Repository: `D:/working/yuta/yuta-resto`.
Baseline HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
OpenSpec root: nearest repository.
Actual pinned schema và artifact instructions: `yuta-spec-driven`.
New capability: `formalites/template-legal-review-governance`.
Modified existing capabilities: NONE.
Expected delta set: đúng một `spec.md` tại path trong hash table.

Run sử dụng `openspec status --change formalites-template-legal-review-governance --json` và `openspec instructions specs --change formalites-template-legal-review-governance --json`; đã đọc lại dependencies trước Specs. Proposal/Analysis giữ nguyên bytes. Existing normative authorization/main specs giữ nguyên; không sync hoặc tạo normative main spec trong turn này.

Baseline inventory dùng `git ls-files --cached --others --exclude-standard -z`, exact SHA-256 cho 2498 existing files và `git status --short`. Preservation check sau Specs chỉ thấy Gate 1 packet changed và delta spec mới; final check sau Gate 2 packet phải giới hạn vào đúng ba paths dưới đây.

Authorized authored path-set:

- `docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md`: approval metadata/record only.
- `openspec/changes/formalites-template-legal-review-governance/specs/formalites/template-legal-review-governance/spec.md`: new governance delta.
- `docs/reviews/formalites-template-legal-review-governance/02-specs-review.md`: new Gate 2 evidence.

Baseline dirty checkout được giữ nguyên:

```text
 M apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx
 M apps/backoffice/src/components/backoffice/backoffice-frame.tsx
 M docs/CURRENT_STATE.md
 M docs/MODULE_REGISTRY.md
 M docs/architecture/AUTHENTICATION.md
 M docs/architecture/IDENTITY_AND_MEMBERSHIP.md
 M docs/architecture/OVERVIEW.md
 M docs/features/identity-access/README.md
 M packages/auth/src/index.ts
 M packages/auth/src/session.ts
 M packages/db-cloud/drizzle/meta/_journal.json
 M packages/db-cloud/src/index.ts
 M packages/db-cloud/src/schema/index.ts
 M packages/ui/package.json
 M packages/ui/src/button.tsx
 M pnpm-lock.yaml
?? apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx
?? apps/backoffice/src/components/backoffice/logout-submit-button.tsx
?? apps/backoffice/src/server/pointage/
?? apps/backoffice/test/general-information-form.test.tsx
?? apps/backoffice/test/google-location-submit-button.test.tsx
?? apps/backoffice/test/logout-submit-button.test.tsx
?? apps/backoffice/test/pointage-foundation-inventory.test.ts
?? apps/backoffice/test/pointage-foundation.test.ts
?? docs/reviews/async-interaction-feedback-foundation/
?? docs/reviews/formalites-template-legal-review-governance/
?? docs/reviews/platform-admin-formalites-template-authority-foundation/
?? docs/reviews/pointage-authority-and-access-foundation/
?? openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/
?? openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/
?? openspec/changes/async-interaction-feedback-foundation/
?? openspec/changes/formalites-template-legal-review-governance/
?? openspec/specs/authorization/platform-admin-formalites-template-administration/
?? openspec/specs/authorization/pointage/
?? openspec/specs/pointage/
?? packages/auth/src/formalites-template-system-authorization.ts
?? packages/auth/src/pointage-credential.ts
?? packages/auth/test/formalites-template-system-authorization.test.ts
?? packages/auth/test/pointage-credential.test.ts
?? packages/db-cloud/drizzle/0019_pointage_authority_foundation.sql
?? packages/db-cloud/drizzle/meta/0019_snapshot.json
?? packages/db-cloud/src/pointage-repository.ts
?? packages/db-cloud/src/schema/pointage.ts
?? packages/db-cloud/test/pointage-repository.integration.test.ts
?? packages/db-cloud/test/pointage-schema.test.ts
?? packages/ui/test/
```

## Artifact hashes

SHA-256 trên exact file bytes; sorted repository-relative paths, lowercase hex.

| Path                                                                                                                     | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md`                                         | `8df6f016533a9a208273d36d5bd985f568fb63492fb1de670fceb0bf392dda05` |
| `openspec/changes/formalites-template-legal-review-governance/.openspec.yaml`                                            | `84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e` |
| `openspec/changes/formalites-template-legal-review-governance/analysis.md`                                               | `1cf8a62d41994d8a33ce56dfc03659a5a609f7b42e2a19acd7365fe2f5b9db1d` |
| `openspec/changes/formalites-template-legal-review-governance/proposal.md`                                               | `53bc674bb634576506bc50cb94bb38ab9a939939f6cc2c7fc8695647c45f6d7e` |
| `openspec/changes/formalites-template-legal-review-governance/specs/formalites/template-legal-review-governance/spec.md` | `9105bd3d7eace661169fda7717a8fb934916c4fc35209ccffc2264f1755e370e` |

Capture tool: Node `crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')`.

Reproduce:

```powershell
$reviewPaths = @(
  'docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md',
  'openspec/changes/formalites-template-legal-review-governance/.openspec.yaml',
  'openspec/changes/formalites-template-legal-review-governance/analysis.md',
  'openspec/changes/formalites-template-legal-review-governance/proposal.md',
  'openspec/changes/formalites-template-legal-review-governance/specs/formalites/template-legal-review-governance/spec.md'
)
$reviewPaths | Sort-Object | ForEach-Object {
  [PSCustomObject]@{
    Path = $_
    SHA256 = (Get-FileHash -LiteralPath $_ -Algorithm SHA256).Hash.ToLowerInvariant()
  }
}
```

## Requirements and scenarios summary

13 added requirements, 32 scenarios; no MODIFIED/REMOVED/RENAMED requirements.

| Requirement                                                         | Scenario count |
| ------------------------------------------------------------------- | -------------- |
| Global governance giữ nguyên ownership và authorization boundary    | 3              |
| Reviewer external có identity và evidenced authority phù hợp        | 2              |
| Minimum evidence ràng buộc đúng immutable version và review         | 3              |
| Applicability envelope và binding conditions được bảo toàn          | 2              |
| Review outcomes có đúng ba semantic kết quả                         | 3              |
| Qualification yêu cầu đủ review và completed authorized publication | 3              |
| Recorder và publisher không trở thành external opinion author       | 4              |
| Content hoặc applicability change cần version mới và new review     | 2              |
| Supersession và retirement không ghi đè historical evidence         | 2              |
| Legal wording chỉ mô tả bounded template qualification              | 2              |
| Private evidence và retention prerequisites đứng trước persistence  | 2              |
| Ba audit families giữ semantics riêng biệt                          | 2              |
| Governance contract không triển khai excluded capabilities          | 2              |

Coverage giữ nguyên resolved decisions: external/manual reviewer không cần YUTA identity; evidenced authority/competence; đúng ba outcomes; exact version/checksum/envelope binding; recorder có thể là publisher nhưng external reviewer phải khác; không standalone evidence CRUD hoặc sixth operation; authorization allow không là domain completion; changes/supersession fail closed; bounded legal wording; privacy prerequisites trước persistence; ba audit families riêng biệt.

## Changed assumptions and remaining ambiguity

Changed Product/authority assumptions since approved Analysis: NONE.

Specs chuyển approved semantics thành observable acceptance/denial scenarios. Không chọn enum/schema representation, checksum canonicalization algorithm, transaction/storage, audit implementation, API, UI hoặc framework. Atomic publication chỉ là all-or-nothing semantic precondition, không triển khai publication.

Outstanding requirement-level CONFLICT hoặc NEEDS REVIEW: NONE trong approved scope. Actual reviewer engagement/evidence, actual template/applicability, retention duration/private storage/access operations và production/provider approvals vẫn ngoài scope. Không sử dụng việc defer để bắt đầu actual collection/persistence.

Existing exact operation identifiers chỉ được reference; quyền `YUTA_SUPPORT`, restaurant memberships và tenant resources không đổi. No general-purpose Platform Admin, runtime, schema/migration/repository/API/UI, evidence upload/store, actual template content, generation/PDF/signature/Documents handoff hoặc provider integration.

Canonical Knowledge reconciliation vẫn theo Gate 3 → finish → authorized Sync → Validate Main Specs → Archive → reviewed Knowledge Consolidation; không automatic lifecycle/readiness promotion.

## Validation commands and exact results

### openspec validate formalites-template-legal-review-governance --strict

Exit code: `0`.

```text
Change 'formalites-template-legal-review-governance' is valid
```

### pnpm docs:check

Exit code: `0`.

```text
$ node ./scripts/check-documentation-consistency.mjs
Documentation consistency check passed (36 current documents).
```

### pnpm architecture:check

Exit code: `0`.

```text
$ node ./scripts/check-import-boundaries.mjs
Architecture check passed: runtime imports, database URLs, client boundaries, and migration baselines are valid.
```

### pnpm -r --if-present typecheck

Exit code: `0`.

```text
Scope: 15 of 16 workspace projects
packages/contracts typecheck$ tsc --noEmit
packages/core typecheck$ tsc --noEmit
packages/tenant typecheck$ tsc --noEmit
packages/db-pos typecheck$ tsc --noEmit
packages/tenant typecheck: Done
packages/core typecheck: Done
packages/db-pos typecheck: Done
packages/contracts typecheck: Done
apps/site-agent typecheck$ tsc --noEmit
apps/yuta-pos typecheck$ tsc --noEmit
apps/yuta-display typecheck$ tsc --noEmit
packages/auth typecheck$ tsc --noEmit
packages/auth typecheck: Done
packages/booking typecheck$ tsc --noEmit
packages/booking typecheck: Done
apps/yuta-display typecheck: Done
apps/yuta-pos typecheck: Done
apps/site-agent typecheck: Done
packages/db-cloud typecheck$ tsc --noEmit
packages/db-cloud typecheck: Done
apps/backoffice typecheck$ tsc --noEmit
apps/booking-web typecheck$ tsc --noEmit
apps/feedback-web typecheck$ tsc --noEmit
apps/web typecheck$ tsc --noEmit
apps/feedback-web typecheck: Done
apps/web typecheck: Done
apps/booking-web typecheck: Done
apps/backoffice typecheck: Done
```

### Scoped formatting and source integrity

`pnpm exec prettier --check openspec/changes/formalites-template-legal-review-governance/specs/formalites/template-legal-review-governance/spec.md docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md`: PASS, exit 0. Final scoped check includes this Gate 2 packet after formatting.

Proposal/Analysis/metadata hashes và mười protected hashes của Gate 1 match; final pre-Gate 2 verification rechecks the full table. Structural verification checks exactly one delta, 13 requirements/32 WHEN/THEN scenarios, exact embedded content/hash, and absent Design/Tasks. Untracked delta được kiểm tra bằng exact bytes và no-index whitespace comparison, không chỉ tracked `git diff`.

### pnpm format:check

Exit code: `1`. Exact summary: `Code style issues found in 67 files. Run Prettier with --write to fix.`

Tất cả 67 warning paths có trong pre-turn baseline và giữ nguyên SHA-256; đây là failures có sẵn ngoài authored path-set. Không chạy repository-wide formatter write. Exact warning paths:

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
docs/features/personnel/README.md
docs/PRODUCT_KNOWLEDGE.md
docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md
docs/reviews/async-interaction-feedback-foundation/02-specs-review.md
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
openspec/changes/async-interaction-feedback-foundation/analysis.md
openspec/schemas/yuta-spec-driven/templates/design.md
openspec/schemas/yuta-spec-driven/templates/proposal.md
openspec/schemas/yuta-spec-driven/templates/spec.md
openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md
openspec/specs/restaurant-knowledge/validated-knowledge/spec.md
```

Auth tests, cloud/local tests, builds và Browser QA: NOT RUN trong Specs-only turn; không có code/runtime change. Không claim VERIFY, Technical Implementation Compliance hoặc QA PASS. Recursive typecheck thực sự chạy trong shared checkout với existing generated types; không claim clean-install/bootstrap test được chạy lại trong turn này.

## Final Gate 2 verification

- Exact hash recheck: Gate 1 13/13 pairs PASS; Gate 2 five artifact/packet hash pairs PASS; no mismatches.
- Embedded delta content equals exact source body: PASS.
- Structural check: 13 requirements, 32 scenarios, every scenario has WHEN/THEN; Design/Tasks absent: PASS.
- Final scoped Prettier including both review packets and delta: PASS, exit 0.
- Post-packet `pnpm docs:check`: PASS, exit 0, 36 current documents.
- Repeated strict OpenSpec validation: PASS, exit 0.
- `git -c core.autocrlf=false diff --no-index --check -- NUL <path>` for the three authored paths: no whitespace diagnostics. No-index exit 1 denotes difference from the empty comparison file; aggregate verification exit 0, PASS.
- These checks establish artifact integrity and scope, not implementation compliance, actual legal review, QA or production readiness.

## Exact delta spec content

File: `openspec/changes/formalites-template-legal-review-governance/specs/formalites/template-legal-review-governance/spec.md`.
SHA-256: `9105bd3d7eace661169fda7717a8fb934916c4fc35209ccffc2264f1755e370e`.

```markdown
## Purpose

Định nghĩa governance contract cho external human legal review và qualification của exact GLOBAL YUTA Formalités template version trong reviewed applicability envelope. Contract này xác lập future publication prerequisites, không triển khai persistence, runtime hoặc legal-template lifecycle.

## ADDED Requirements

### Requirement: Global governance giữ nguyên ownership và authorization boundary

Formalités SHALL là semantic owner của GLOBAL YUTA Formalités templates; Platform Admin SHALL chỉ là future internal administration runtime/access boundary. Template scope SHALL NOT thuộc organization hoặc establishment và restaurant membership SHALL NOT tạo global authority.

Governance SHALL sử dụng nguyên trạng đúng năm existing independent operations: `formalites.template.read`, `formalites.template.draft.manage`, `formalites.template.review.submit`, `formalites.template.publish`, `formalites.template.retire`. `YUTA_ADMIN` SHALL chỉ nhận các explicit per-operation grants hiện có; `YUTA_SUPPORT` SHALL nhận none. Governance SHALL NOT thêm operation thứ sáu, role/principal, wildcard, prefix matching, implication, role hierarchy hoặc caller-defined policy.

Trusted system authorization SHALL yêu cầu authenticated active internal user và exact approved operation grant, không yêu cầu restaurant membership hoặc `TenantContext`. Global authority SHALL NOT được merge với, fallback sang hoặc thay thế tenant authorization.

#### Scenario: Internal publisher không có restaurant membership

- **WHEN** trusted active `YUTA_ADMIN` không có restaurant membership yêu cầu publication cho global template version
- **THEN** authority SHALL được đánh giá bằng exact `formalites.template.publish` grant
- **AND** thiếu restaurant membership SHALL NOT tự tạo denial hoặc bỏ qua bất kỳ domain qualification prerequisite nào

#### Scenario: Support hoặc restaurant-only actor yêu cầu publication

- **WHEN** actor là `YUTA_SUPPORT` hoặc chỉ có OWNER/MANAGER/STAFF membership và không có exact granted system authority
- **THEN** publication SHALL bị từ chối
- **AND** valid legal-review evidence hoặc tenant permissions SHALL NOT thay thế missing authority

#### Scenario: Global allow không cấp tenant access hoặc additional operation

- **WHEN** caller có global template authorization nhưng yêu cầu tenant resource hoặc operation ngoài năm identifiers
- **THEN** global grant SHALL NOT authorize yêu cầu đó
- **AND** tenant resource SHALL tiếp tục chịu independent trusted tenant authorization

### Requirement: Reviewer external có identity và evidenced authority phù hợp

Legal review SHALL được thực hiện external/manual bởi một cá nhân xác định được, có evidenced authority tư vấn pháp luật Pháp và competence phù hợp với French employment law trong exact review scope. Reviewer SHALL NOT cần YUTA identity, system role hoặc tenant membership. Firm/entity name đơn lẻ SHALL NOT thay thế accountable reviewer identity.

Default acceptance SHALL là avocat đăng ký tại barreau Pháp, hoặc luật sư EU được phép tư vấn pháp luật Pháp, có competence phù hợp. Juriste khác SHALL chỉ được chấp nhận khi có documented professional/legal authority cho exact type/scope of consultation và competence evidence tương ứng; nhãn “juriste qualifié” đơn lẻ SHALL NOT đủ.

Reviewer evidence SHALL xác định identity, firm/entity nếu có, professional capacity, registration hoặc equivalent authority reference, jurisdiction, competence, engagement/matter reference và dated review confirmation. `YUTA_ADMIN` status SHALL NOT cung cấp legal-review authority hoặc biến internal actor thành opinion author.

#### Scenario: Accepted external reviewer không có YUTA account

- **WHEN** external reviewer có đủ identity, authority, competence và dated confirmation cho exact review scope nhưng không có YUTA account
- **THEN** review SHALL được xét theo evidence và domain prerequisites
- **AND** governance SHALL NOT yêu cầu tạo account hoặc system role cho reviewer

#### Scenario: Reviewer identity hoặc authority không được chứng minh

- **WHEN** evidence chỉ ghi tên firm, nhãn “juriste qualifié”, hoặc thiếu căn cứ authority/competence phù hợp
- **THEN** review SHALL không đủ điều kiện hỗ trợ qualification
- **AND** publisher SHALL NOT dùng system role để tự xác nhận legal competence thay cho evidence

### Requirement: Minimum evidence ràng buộc đúng immutable version và review

Review evidence SHALL bao gồm exact template identity/version, immutable canonical-content checksum kèm thuật toán, review date, reviewer identity/authority/qualification references, review outcome, reviewed applicability envelope, binding conditions/reservations/exclusions, external deliverable hoặc confirmation reference, evidence received/recorded time và internal recorder identity.

Evidence SHALL bao gồm effective date khi liên quan, legal/conventional reference snapshot khi reviewer yêu cầu, và superseded evidence reference khi có supersession. Không applicable SHALL được phân biệt với missing hoặc unknown information; thiếu dữ liệu SHALL NOT được hiểu là không có điều kiện.

Evidence SHALL cho phép đối chiếu external opinion/confirmation thực sự áp dụng cho exact version/checksum và envelope được publication xét đến. Checksum SHALL chỉ chứng minh content identity, không tự chứng minh reviewer identity, authority hoặc authenticity của opinion. Một reference không xác lập được review source/binding SHALL NOT đủ điều kiện qualification.

#### Scenario: Complete evidence khớp exact version

- **WHEN** evidence có đủ required information và external confirmation đối chiếu được với exact immutable version/checksum/envelope
- **THEN** evidence SHALL đủ điều kiện được xét cùng outcome, publication authority và các qualification prerequisites khác
- **AND** evidence completeness SHALL NOT tự tạo publication hoặc qualification

#### Scenario: Missing evidence hoặc mismatched checksum

- **WHEN** required evidence thiếu, review source không đối chiếu được, hoặc checksum/version trong review khác publication candidate
- **THEN** candidate SHALL không được qualified hoặc successfully published
- **AND** similarity của nội dung hoặc internal assurance SHALL NOT thay thế exact binding

#### Scenario: Checksum có nhưng opinion author chưa xác thực

- **WHEN** content checksum khớp nhưng reviewer identity, authority hoặc external confirmation chưa được chứng minh
- **THEN** review SHALL không đủ điều kiện qualification

### Requirement: Applicability envelope và binding conditions được bảo toàn

Reviewed envelope SHALL xác định jurisdiction, contract category, full/part-time boundary, employee/employer categories, collective-agreement assumptions, exclusions và effective-date constraints liên quan. Declared use SHALL được đánh giá trong đúng envelope đó; unknown hoặc contradictory applicability SHALL fail closed.

Binding conditions/reservations SHALL được giữ nguyên và phải được thỏa mãn cho declared use. Internal actor SHALL NOT bỏ, mở rộng hoặc diễn giải lại conditions để cho phép một use chưa được review.

#### Scenario: Declared use ngoài envelope hoặc chưa xác định

- **WHEN** declared use nằm ngoài reviewed categories, ngoài effective dates, hoặc thiếu thông tin cần thiết để xác định applicability
- **THEN** version SHALL không được coi là qualified cho use đó
- **AND** previous publication SHALL NOT mở rộng reviewed envelope

#### Scenario: Binding condition chưa được đáp ứng

- **WHEN** external review là approved trong một envelope có binding condition nhưng condition đó chưa được thỏa mãn cho declared use
- **THEN** qualification SHALL bị từ chối cho declared use
- **AND** publisher SHALL NOT loại bỏ condition để chuyển kết quả thành qualified

### Requirement: Review outcomes có đúng ba semantic kết quả

Governance SHALL sử dụng đúng ba Product review outcomes: `APPROVED`, `CHANGES_REQUIRED`, `REJECTED`. Governance SHALL NOT tạo outcome `APPROVED_WITH_CONDITIONS` hoặc coi unknown/missing outcome là approved. Các tên này SHALL biểu đạt Product semantics, không yêu cầu enum implementation trong change này.

`APPROVED` SHALL chỉ biểu thị external reviewer chấp nhận exact version trong declared reviewed envelope; binding conditions chỉ phù hợp với outcome này khi đã thuộc envelope và không yêu cầu sửa version. `CHANGES_REQUIRED` SHALL biểu thị version cần thay đổi và chưa qualified. `REJECTED` SHALL biểu thị version không được chấp nhận cho proposed scope và không eligible cho publication đó.

Việc hiểu source opinion có conditions SHALL bảo toàn nguyên văn opinion và author attribution; internal classification SHALL NOT giả mạo hoặc sửa external reviewer outcome. Conditions yêu cầu sửa content/applicability hoặc chưa biểu diễn được trong envelope SHALL được xử lý là `CHANGES_REQUIRED`, không qualified.

#### Scenario: Approved review có conditions trong envelope hiện tại

- **WHEN** reviewer chấp nhận exact version với conditions đã nằm trong envelope và không yêu cầu sửa version
- **THEN** Product outcome SHALL là `APPROVED`
- **AND** mọi condition SHALL tiếp tục là prerequisite cho qualification, không tạo outcome thứ tư

#### Scenario: Reviewer yêu cầu chỉnh sửa

- **WHEN** reviewer yêu cầu thay đổi content/applicability hoặc condition chưa thể được biểu diễn trong envelope của exact version
- **THEN** Product outcome SHALL là `CHANGES_REQUIRED`
- **AND** version SHALL chưa qualified và cần version mới cùng new review sau thay đổi

#### Scenario: Review bị rejected hoặc outcome không hợp lệ

- **WHEN** outcome là `REJECTED`, missing, unknown hoặc được đưa vào như `APPROVED_WITH_CONDITIONS`
- **THEN** version SHALL không được qualified hoặc published dựa trên outcome đó
- **AND** governance SHALL NOT silently map outcome không hợp lệ thành `APPROVED`

### Requirement: Qualification yêu cầu đủ review và completed authorized publication

Một version SHALL chỉ được coi là qualified cho declared use khi đồng thời có exact immutable version/checksum, completed review bởi accepted external reviewer, outcome `APPROVED`, complete bound evidence, matching reviewed envelope, satisfied binding conditions/effective dates, review chưa bị supersede/invalidate, và successful authorized publication của version chưa retired.

Thiếu bất kỳ prerequisite nào SHALL ngăn qualification. Authorization allow alone SHALL NOT tạo review completion, successful publication hoặc qualification. Qualification SHALL NOT chứng minh final contract compliant/valid, employee/employer inputs chính xác hoặc legal suitability ngoài reviewed scope.

#### Scenario: Mọi qualification prerequisites được thỏa mãn

- **WHEN** exact version có accepted approved review/evidence, declared use đáp ứng toàn bộ envelope/conditions và successful authorized publication vẫn applicable, version chưa retired
- **THEN** version SHALL được coi là qualified chỉ cho declared use trong reviewed scope đó
- **AND** kết quả SHALL NOT là guarantee cho final contract hoặc input correctness

#### Scenario: Authorization allow nhưng publication chưa hoàn thành

- **WHEN** `formalites.template.publish` được allow nhưng domain publication chưa hoàn thành hoặc một qualification prerequisite không đạt
- **THEN** version SHALL không trở thành published hoặc qualified chỉ từ authorization result

#### Scenario: Completed review chưa được publication

- **WHEN** review `APPROVED` và evidence đầy đủ nhưng chưa có successful authorized publication
- **THEN** review SHALL không tự đưa version vào qualified use

### Requirement: Recorder và publisher không trở thành external opinion author

`YUTA_ADMIN` có exact publication authority SHALL được record/link evidence nhận từ external reviewer như prerequisite bên trong future atomic publication action qua `formalites.template.publish`. Evidence recording/linkage SHALL phân biệt external opinion author, internal recorder/publisher và external source reference; internal actor SHALL NOT author, sửa hoặc thay thế legal opinion.

External reviewer SHALL khác internal publisher. Recorder SHALL được phép trùng publisher; governance SHALL NOT yêu cầu reviewer YUTA identity, ba người riêng biệt hoặc hai internal approvers. `formalites.template.review.submit` SHALL chỉ đại diện submission, không cấp independent evidence intake/edit/approval authority.

Governance SHALL NOT cung cấp standalone evidence CRUD hoặc additional authorization operation. Atomic publication SHALL biểu thị semantic all-or-nothing completion: required evidence/authority không hợp lệ thì không có successful publication hoặc qualification; contract này SHALL NOT chọn transaction/storage implementation.

#### Scenario: Recorder đồng thời là authorized publisher

- **WHEN** authorized internal publisher record/link external evidence với đầy đủ attribution, reviewer là người khác và mọi domain prerequisites đạt
- **THEN** việc recorder trùng publisher SHALL NOT ngăn publication
- **AND** legal opinion SHALL vẫn thuộc external reviewer

#### Scenario: Publisher cũng là reviewer hoặc sửa external opinion

- **WHEN** internal publisher được ghi là reviewer của chính review dùng cho publication, hoặc sửa outcome/conditions/opinion để đáp ứng qualification
- **THEN** publication và qualification SHALL bị từ chối theo governance boundary

#### Scenario: Evidence linkage thất bại

- **WHEN** publication authority hợp lệ nhưng required external evidence không được liên kết hợp lệ với exact version
- **THEN** domain action SHALL không báo successful publication hoặc qualification

#### Scenario: Caller yêu cầu independent evidence management

- **WHEN** caller yêu cầu standalone evidence create/read/update/delete hoặc evidence approval dưới authority của governance capability này
- **THEN** capability SHALL không cung cấp operation đó
- **AND** existing submit/publish grant SHALL NOT được suy diễn thành independent evidence CRUD

### Requirement: Content hoặc applicability change cần version mới và new review

Bất kỳ thay đổi nào đối với canonical template content hoặc reviewed applicability SHALL tạo version mới và yêu cầu new external review cho exact new version trước qualification. Governance SHALL NOT mutate qualified immutable version hoặc chuyển evidence của version cũ sang version mới như automatic approval.

#### Scenario: Nội dung thay đổi dù được xem là nhỏ

- **WHEN** canonical content của một reviewed version thay đổi
- **THEN** changed content SHALL thuộc version mới với content checksum tương ứng và phải được review lại
- **AND** approval/evidence của version cũ SHALL NOT qualify version mới

#### Scenario: Applicability thay đổi nhưng content giữ nguyên

- **WHEN** envelope được mở rộng, thu hẹp hoặc thay đổi trong khi content bytes giữ nguyên
- **THEN** envelope mới SHALL thuộc version mới và cần new review
- **AND** content checksum giống nhau SHALL NOT cho phép kế thừa qualification

### Requirement: Supersession và retirement không ghi đè historical evidence

New review superseding earlier evidence SHALL có explicit supersession linkage và giữ historical author/outcome/version attribution. Superseded hoặc invalidated review SHALL không tiếp tục hỗ trợ current qualification. Evidence mới SHALL vượt đầy đủ prerequisites và SHALL NOT tự thực hiện publication hoặc qualification.

Khi legal/conventional change, effective-date boundary hoặc reviewer re-review trigger làm review không còn applicable, version SHALL không còn eligible cho future qualified use dựa trên review đó. Retirement qua existing authorized boundary SHALL loại version khỏi future use, không sửa ngược historical evidence hoặc previously generated artifacts. Governance SHALL NOT thêm suspension operation hoặc tự động legal-change detection/provider.

#### Scenario: Review mới supersede review đã approved

- **WHEN** earlier approved review được supersede bởi new review cho exact version
- **THEN** earlier evidence SHALL được giữ như lịch sử nhưng không tiếp tục là căn cứ current qualification
- **AND** new review SHALL phải đáp ứng đầy đủ acceptance/publication prerequisites, kể cả khi outcome mới cũng là `APPROVED`

#### Scenario: Review không còn applicable hoặc version retired

- **WHEN** review không còn applicable cho future use hoặc version đã retired
- **THEN** version SHALL không được dùng như qualified version cho future use đó
- **AND** historical publication/evidence SHALL không bị viết lại thành một review khác

### Requirement: Legal wording chỉ mô tả bounded template qualification

Khi mô tả kết quả thực sự đã đáp ứng qualification cho declared use, YUTA SHALL giới hạn wording vào “préparé à partir d’un modèle qualifié pour ce cas d’usage” và kèm qualifier gần claim: “La qualification concerne uniquement la version du modèle et le périmètre déclarés. Elle ne constitue ni un avis juridique sur la situation individuelle, ni une garantie de conformité du contrat final.”

YUTA SHALL NOT dùng qualification làm căn cứ cho “contrat conforme”, “juridiquement conforme”, “validé juridiquement” hoặc legal-compliance/certification/guarantee claims. Governance approval, authorization allow hoặc completed implementation SHALL NOT được trình bày như actual legal template qualification. Change này SHALL NOT triển khai UI/document rendering.

#### Scenario: Truthful qualification wording

- **WHEN** YUTA mô tả một declared use thực sự dựa trên exact qualified version
- **THEN** wording SHALL gắn qualification với model/version/scope và giữ qualifier nêu trên gần claim
- **AND** SHALL NOT tuyên bố final contract được chứng nhận hoặc bảo đảm pháp lý

#### Scenario: Claim không có actual qualification hoặc vượt scope

- **WHEN** chỉ governance/authorization được approved hoặc claim mô tả final contract là compliant/certified
- **THEN** claim SHALL không được chấp nhận theo wording contract

### Requirement: Private evidence và retention prerequisites đứng trước persistence

Reviewer identity/professional data và legal evidence SHALL được xử lý như potentially personal/confidential information. Public repository SHALL chỉ chứa governance descriptions/status và opaque evidence references; SHALL NOT chứa actual legal opinions, reviewer personal records, real employee data, private URLs hoặc vault paths.

Trước corresponding evidence processing/persistence, SHALL có quyết định về purpose/legal basis, minimization, recipients/access, private storage/confidentiality, active/archive separation, rights handling, legal hold, deletion/backup propagation và justified retention duration hoặc criteria. Retention duration SHALL được defer trong governance-only change này; defer SHALL NOT authorize indefinite retention, actual collection/upload hoặc persistence.

#### Scenario: Governance được định nghĩa khi duration còn deferred

- **WHEN** retention duration chưa được chốt và công việc chỉ định nghĩa governance contract
- **THEN** governance SHALL có thể được review mà không invent duration
- **AND** corresponding processing/persistence SHALL vẫn chờ đầy đủ privacy/retention decisions

#### Scenario: Evidence riêng tư được đưa vào public repository

- **WHEN** proposed evidence record chứa actual opinion, personal data, private URL hoặc vault path trong Git
- **THEN** nội dung đó SHALL không được chấp nhận
- **AND** repository SHALL chỉ giữ opaque reference phù hợp, không thực hiện upload/storage trong capability này

### Requirement: Ba audit families giữ semantics riêng biệt

Authorization/security audit SHALL mô tả actor khi resolved, exact requested operation và security decision/denial, không chứa legal opinion/template content hoặc đại diện cho domain completion. Legal-review evidence SHALL mô tả external reviewer, exact version/checksum, opinion/outcome/envelope/conditions và private evidence reference. Publication/retirement audit SHALL mô tả internal actor, exact version, completed action/time, reason khi liên quan và evidence reference.

Ba families SHALL giữ distinct attribution và meaning; security allow/deny SHALL NOT được dùng thay legal-review evidence hoặc publication completion, và publication record SHALL NOT biến internal actor thành opinion author. Contract SHALL NOT chọn audit schema, storage hoặc retention implementation.

#### Scenario: Authorization signal không là publication evidence

- **WHEN** chỉ có successful authorization context hoặc security audit signal
- **THEN** governance SHALL không suy ra completed legal review, publication hoặc qualification

#### Scenario: Publication audit tham chiếu legal evidence

- **WHEN** completed publication được ghi nhận cùng external evidence reference
- **THEN** audit SHALL giữ internal publisher/action attribution và tham chiếu riêng external opinion author/evidence
- **AND** legal opinion SHALL không được sao chép vào security log như authorization evidence

### Requirement: Governance contract không triển khai excluded capabilities

Capability SHALL chỉ định nghĩa governance semantics. Nó SHALL NOT tạo schema/migration, repository/API/UI, Platform Admin runtime, evidence persistence/upload, actual template content, generation/PDF/signature/Documents handoff, provider integration, restaurant customization hoặc production enablement. Existing tenant authorization, Backoffice sessions và persistent draft behavior SHALL không thay đổi.

Manual/private external review handling SHALL là permitted future direction, không phải provider integration hoặc authorization thực hiện actual engagement/data transfer. Workflow/spec completion SHALL NOT tự promote lifecycle/readiness, thay canonical Knowledge hoặc đóng production/legal/privacy gates.

#### Scenario: Governance spec được approved hoặc validated

- **WHEN** governance artifacts được review hoặc strict validation thành công
- **THEN** kết quả SHALL chỉ xác lập artifact/governance progress trong authorized workflow
- **AND** SHALL không tạo runtime, actual review/template qualification, lifecycle/readiness promotion hoặc production permission

#### Scenario: Future work cần persistence hoặc authority expansion

- **WHEN** việc tiếp tục yêu cầu persistence/runtime, independent evidence CRUD, new role/principal/operation hoặc tenant-authority merge
- **THEN** yêu cầu đó SHALL nằm ngoài bounded capability và cần quay lại owning Product/authority decision
- **AND** governance contract SHALL NOT cung cấp implicit permission để thực hiện
```

## Recommendation and next approval

Gate 2: `APPROVED`.
Recommendation: approve exact delta nếu requirements/scenarios khớp approved governance decisions.
Required next instruction: `Gate 2: APPROVED. Proceed to Design only, then STOP at Sensitive Design Gate.`

Raw OpenSpec status: Proposal/Analysis/Specs done; Design ready; Tasks blocked.
YUTA operational state: STOP at Gate 2; raw Design readiness không phải authorization.
Sensitive Design Gate: REQUIRED after Design, before Tasks/Apply.
Sync authorization: PENDING.
Production: NOT AUTHORIZED.

## Gate 2 approval record

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T14:11:45.681Z

User decision: `Gate 2: APPROVED. Proceed to Design only, then STOP at the mandatory Sensitive Design Gate.`

Resume integrity: Gate 1 13/13 recorded path/hash pairs and Gate 2 5/5 pairs
match; expected inventory has exactly one delta spec, no Design or Tasks.
Gate 2 packet before approval SHA-256:
`92ed737981616400075970a1d82054279730117a808b52b03e7164e9f7f7bf2e`.
Exact Proposal, Analysis, delta spec and Gate 1 packet remain unchanged.
Historical next-approval/STOP wording above records the original Gate 2 state;
this dated record authorizes Design only. Atomic publication remains an
all-or-nothing governance invariant, with no persistence or transaction design.
Tasks/Apply, sync/archive and production remain unauthorized at this point.
