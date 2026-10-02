Change: formalites-template-legal-review-governance
Gate: 2b — Sensitive Design review
Review status: APPROVED
Created: 2026-09-07T14:15:32.378Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — CROSS_MODULE / AUTHORITY_SENSITIVE

# Sensitive Design Review

## Gate 2b approval and integrity-only chain refresh — 2026-09-07T14:36:24Z

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T14:36:24Z
Rebaseline type: INTEGRITY_ONLY
Gate 1: REMAINS APPROVED
Gate 2: REMAINS APPROVED
Gate 2b: REMAINS APPROVED

User đã approve Sensitive Design và hiện xác nhận giữ nguyên cả ba semantic gate
decisions sau exact three-source Pointage-only rebaseline. D1–D8 và toàn bộ
Proposal/Analysis/Specs/Design giữ nguyên bytes. Active table chỉ refresh
dependency hashes của Gate 1/Gate 2; không đổi semantic artifact hashes.

Gate 2b packet trước approval/refresh:
`607d46e24ef979b01432677b62f9595b31d4580cb371116d65650710898dea84`.
Historical awaiting-review wording, Tasks-absent inventory và command results
bên dưới là snapshot của Design turn, không phải current authorization state.

Authorized next action: Tasks / Implementation Plan / embedded Technical
Implementation Contracts only; STOP cho Control Tower review sau planning.
Apply: NOT AUTHORIZED. Production: NOT AUTHORIZED. Không tạo Gate 3 hoặc
implementation evidence trong lượt planning; không Sync/Archive/Knowledge edits.

## Approval and resume integrity

Gate 1: APPROVED, unchanged packet.
Gate 2: APPROVED through explicit current-user instruction: `Proceed to Design only, then STOP at the mandatory Sensitive Design Gate.`
Approval record: [02-specs-review.md](02-specs-review.md).

Pre-approval Gate 2 packet hash: `92ed737981616400075970a1d82054279730117a808b52b03e7164e9f7f7bf2e`.
Post-approval Gate 2 packet hash is in the table below. Only status and dated approval record changed; no previously approved artifact content changed.

Resume checked Gate 1 13/13 and Gate 2 5/5 recorded path/hash pairs with no mismatch. Expected inventory: metadata, Proposal, Analysis, exactly one governance delta; Design/Tasks absent before work. Design is newly created, no adoption/overwrite.

Repository: `D:/working/yuta/yuta-resto`.
Baseline HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Actual pinned schema/status/instructions: `yuta-spec-driven`; root is nearest repository.
Commands: `openspec status --change formalites-template-legal-review-governance --json`; `openspec instructions design --change formalites-template-legal-review-governance --json`.
Dependencies Analysis and Specs were reread before Design.

## Design scope and recommendation

Eight decisions D1–D8 cover documentary delivery, external reviewer/evidence acceptance, three outcomes, atomic publication invariant, existing authority/separation, version evolution/supersession, audit/privacy/wording and lifecycle/Knowledge ordering.

Design traceability covers all 13 approved requirements and their 32 scenarios; this is a plan for documentary validation, not a claim that actual legal review, runtime enforcement or publication occurred.

Atomic publication is an all-or-nothing governance result invariant only. No schema, persistence, transaction, locking, outbox, idempotency/retry, API, UI, service, template implementation or Platform Admin runtime is designed.

No new role/principal/operation; no reviewer YUTA account; recorder may equal publisher while external reviewer differs; no independent evidence CRUD; no tenant-authority merge. Exactly three review outcomes remain. Supersession preserves historical attribution without inventing indefinite retention. Qualification cannot imply compliance/certification.

## Security, data and runtime implications

| Boundary                              | Design treatment                                                                      | Review finding                                |
| ------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------- |
| System/tenant authority               | Existing five grants/context; no code or auth changes                                 | Within approved scope                         |
| Reviewer/publisher                    | Different people evidenced factually; no new identity mechanism                       | Within approved scope                         |
| Evidence authenticity/content binding | Source, author, version/checksum and envelope are separate prerequisites              | No storage/provider implementation            |
| Atomic publication                    | No success on unmet prerequisites; no transaction design                              | Within approved scope                         |
| Version/history                       | New version/new review for content or envelope change; supersession preserves history | No executable lifecycle                       |
| Privacy/retention                     | Required before processing/persistence; duration deferred                             | No evidence collection/upload                 |
| Audit                                 | Three distinct meanings and attribution; security logs exclude legal content          | No audit storage/schema                       |
| Wording                               | Approved bounded phrase/qualifier; no legal guarantee                                 | No UI/rendering or actual qualification claim |
| Knowledge/lifecycle                   | Gate 3 → finish → Sync → Validate Main Specs → Archive → reviewed consolidation       | No canonical promotion                        |

Migration/deployment: NOT_APPLICABLE. Design creates no data/runtime state to migrate or roll back. Artifact revisions require reviewed hashes; future sync failure follows owning policy and never grants silent/direct main-spec edits.

Unresolved requirement/design choices: NONE for bounded documentary scope. Actual reviewer engagement, real template/evidence, canonicalization implementation, retention duration, storage/provider/runtime are future separately authorized work, not missing deliverables here.

STOP conditions inspected: no sixth operation, independent evidence CRUD, new role/principal, reviewer account, tenant merge, persistence/runtime prerequisite or unsafe legal-compliance claim is required to express the approved contract.

## Exact reviewed hashes

SHA-256 over exact file bytes, lowercase hexadecimal. Gate 2b reviewed set includes both earlier packets, all current planning files and exact delta; Tasks remains absent.

| Path                                                                                                                     | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md`                                         | `8df6f016533a9a208273d36d5bd985f568fb63492fb1de670fceb0bf392dda05` |
| `docs/reviews/formalites-template-legal-review-governance/02-specs-review.md`                                            | `14346c42610b10425bddbc60abe2680e981c58aba2a6b321177758f97c533ab5` |
| `openspec/changes/formalites-template-legal-review-governance/.openspec.yaml`                                            | `84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e` |
| `openspec/changes/formalites-template-legal-review-governance/analysis.md`                                               | `1cf8a62d41994d8a33ce56dfc03659a5a609f7b42e2a19acd7365fe2f5b9db1d` |
| `openspec/changes/formalites-template-legal-review-governance/design.md`                                                 | `9759d0fc4487fa0e037622e16f24308054480eb453a44ac027579a084e6ea6b1` |
| `openspec/changes/formalites-template-legal-review-governance/proposal.md`                                               | `53bc674bb634576506bc50cb94bb38ab9a939939f6cc2c7fc8695647c45f6d7e` |
| `openspec/changes/formalites-template-legal-review-governance/specs/formalites/template-legal-review-governance/spec.md` | `9105bd3d7eace661169fda7717a8fb934916c4fc35209ccffc2264f1755e370e` |

Capture: Node `crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')`.

Reproduce:

```powershell
$reviewPaths = @(
  'docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md',
  'docs/reviews/formalites-template-legal-review-governance/02-specs-review.md',
  'openspec/changes/formalites-template-legal-review-governance/.openspec.yaml',
  'openspec/changes/formalites-template-legal-review-governance/analysis.md',
  'openspec/changes/formalites-template-legal-review-governance/design.md',
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

## Preservation and authored path-set

Baseline recorded exact hashes for 2501 existing tracked/untracked non-ignored files using `git ls-files --cached --others --exclude-standard -z` and Node SHA-256; baseline status below preserves shared-checkout provenance.

Authored paths are exactly:

- `docs/reviews/formalites-template-legal-review-governance/02-specs-review.md`: approval status/record only.
- `openspec/changes/formalites-template-legal-review-governance/design.md`: new Design.
- `docs/reviews/formalites-template-legal-review-governance/02b-design-review.md`: new review packet.

Pre-packet comparison found only the Gate 2 update and new Design; final comparison must add only this packet. Proposal/Analysis/delta/Gate 1, existing authorization implementation/main spec, canonical Knowledge and unrelated work remain byte-for-byte unchanged.

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

## Validation evidence

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
packages/db-pos typecheck$ tsc --noEmit
packages/tenant typecheck$ tsc --noEmit
packages/tenant typecheck: Done
packages/core typecheck: Done
packages/db-pos typecheck: Done
packages/contracts typecheck: Done
apps/yuta-pos typecheck$ tsc --noEmit
apps/yuta-display typecheck$ tsc --noEmit
apps/site-agent typecheck$ tsc --noEmit
packages/auth typecheck$ tsc --noEmit
packages/auth typecheck: Done
packages/booking typecheck$ tsc --noEmit
packages/booking typecheck: Done
apps/yuta-pos typecheck: Done
apps/yuta-display typecheck: Done
apps/site-agent typecheck: Done
packages/db-cloud typecheck$ tsc --noEmit
packages/db-cloud typecheck: Done
apps/web typecheck$ tsc --noEmit
apps/backoffice typecheck$ tsc --noEmit
apps/booking-web typecheck$ tsc --noEmit
apps/feedback-web typecheck$ tsc --noEmit
apps/web typecheck: Done
apps/feedback-web typecheck: Done
apps/booking-web typecheck: Done
apps/backoffice typecheck: Done
```

### Scoped checks

`pnpm exec prettier --check openspec/changes/formalites-template-legal-review-governance/design.md docs/reviews/formalites-template-legal-review-governance/02-specs-review.md`: PASS, exit 0. Final scoped check includes this packet after formatting.
Design relative source links: 7/7 target files exist; D1–D8 all present; Tasks absent.
Final hash/embedded-content/path-set checks below establish review integrity; they are not VERIFY/QA or legal opinion evidence.

### pnpm format:check

Exit code: `1`.
Exact summary: `Code style issues found in 67 files. Run Prettier with --write to fix.`
All warning paths existed at baseline and retain their exact hashes. No authored Design/review file is among them; no global formatter write was run.

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

Auth/cloud/local tests, builds and Browser QA: NOT RUN; Design-only changes have no runtime/code effects. Recursive typecheck ran using existing generated Next types; no clean-install/typegen rerun claim. Technical Implementation Compliance, VERIFY and QA are not completed at this gate.

## Final integrity verification

- Gate 1: 13/13 recorded hash pairs match; Gate 2: 5/5 match; Gate 2b: 7/7 match. No mismatch.
- Exact Design body embedded below equals source file content: PASS.
- Tasks absent; no implementation performed: confirmed.
- Final baseline comparison: only Gate 2 approval packet changed; only Design and this packet added. All other existing tracked/untracked non-ignored files retain baseline bytes.
- Post-packet scoped Prettier: PASS, exit 0; `pnpm docs:check`: PASS, exit 0, 36 current documents.
- No-index whitespace checks for all three authored paths have no diagnostics. Command uses `git -c core.autocrlf=false diff --no-index --check -- NUL <path>`; exit 1 denotes difference from empty baseline, not whitespace error. Aggregate integrity/whitespace checker: PASS, exit 0.
- These are documentary integrity results, not actual legal-review evidence or runtime enforcement claims.

## Exact Design content

File: `openspec/changes/formalites-template-legal-review-governance/design.md`.
SHA-256: `9759d0fc4487fa0e037622e16f24308054480eb453a44ac027579a084e6ea6b1`.

```markdown
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
```

## Gate decision requested

Review status: AWAITING_HUMAN_REVIEW.
Recommendation: approve exact Design if D1–D8 preserve the approved governance invariant and excluded implementation boundaries.

Required next instruction:
`Gate 2b: APPROVED. Proceed to Tasks / Implementation Plan / Technical Implementation Contracts only.`

Raw OpenSpec status: Proposal/Analysis/Specs/Design done; Tasks ready.
YUTA operational state: STOP at mandatory Sensitive Design Gate. Raw readiness does not authorize Tasks/Apply.
Sync authorization: PENDING.
Production: NOT AUTHORIZED.
