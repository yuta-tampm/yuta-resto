Change: formalites-legal-template-foundation
Gate: 1
Review status: APPROVED
Created: 2026-09-07T22:19:14.435Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — mandatory Gate 2b after Design

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T22:32:06.059Z

Gate 1 resume: approved for Specs only. Revalidation PASS: exact Proposal/Analysis, 24 protected source hashes, metadata hash and expected artifact path-set match. Pre-approval packet SHA-256: `338ceb2b22fe5c3670ff8f2b73c8c9ade65a13c9fab523ec5ab5c309aa1595b2`. Existing creation-time status/evidence below is historical; this approval record governs current Gate 1 status. No Proposal/Analysis wording, protected baseline, Design, Tasks or Apply authorization changed.

# Gate 1 — Proposal / Analysis Review

## Request and bounded change

Current-user request: `$yuta-run-change formalites-legal-template-foundation`; Discovery/Shaping completed, Strategy A và 14 explicit approved Product decisions. Chỉ Proposal + Analysis, sau đó STOP tại Gate 1. Approval của Product decisions không đồng nghĩa Gate 1 approval hoặc Apply authorization.

Request provenance: `C:/Users/Tam/.codex/attachments/ebb04994-1ac7-4f74-9b06-747a1c248414/pasted-text.txt`.
Exact request SHA-256: `575ccfa72268e90e7cf139f2d9e4f2d4352ff76e0668dc0e008a31abd356a62c`.
Attachment là current-user instruction, không phải canonical repository source.

Classification: `CROSS_MODULE / DATA_OWNERSHIP_SENSITIVE / LEGAL_PRIVACY_SENSITIVE`.

Scope: dedicated GLOBAL cloud template identity, một active mutable Working Draft/identity, 0..N immutable versions, textual source profile UTF-8/no BOM/LF, no Unicode normalization/trim, exact SHA-256 và immutable applicability. Approved read/draft.manage/review.submit mapping; freeze không delivery/review/evidence/qualification. Không publication/retirement execution, private evidence, UI/runtime app, generation hoặc production.

## Repository provenance and inventory

Repository/root: `D:/working/yuta/yuta-resto`; nearest local OpenSpec, không registered store.
HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Pre-turn baseline: 2515 tracked + non-ignored untracked existing files, exact raw-byte SHA-256. Snapshot giữ in-memory để compare same-turn.

Trước creation: selected change và review directory absent; status trả `change_error` / change not found. Không equivalent archived template-persistence foundation. Existing archived authority/governance prerequisites không bị adopt hoặc rewrite.

New delivery allowlist:

- `openspec/changes/formalites-legal-template-foundation/.openspec.yaml`
- `openspec/changes/formalites-legal-template-foundation/proposal.md`
- `openspec/changes/formalites-legal-template-foundation/analysis.md`
- `docs/reviews/formalites-legal-template-foundation/01-analysis-review.md`

Specs, Design, Tasks, implementation và later packets intentionally absent. Không `skip_specs: true`.

CLI progress/planning-home metadata hiển thị default label `spec-driven`, nhưng generated metadata, `status.schemaName` và cả instructions xác nhận pinned `yuta-spec-driven`. Không schema override/config/tooling edit.

Pre-turn `git status --short`:

```text
 M apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx
 M apps/backoffice/src/components/backoffice/backoffice-frame.tsx
 M docs/CURRENT_STATE.md
 M docs/MODULE_REGISTRY.md
 M docs/PRODUCT_KNOWLEDGE.md
 M docs/architecture/AUTHENTICATION.md
 M docs/architecture/IDENTITY_AND_MEMBERSHIP.md
 M docs/architecture/OVERVIEW.md
 M docs/features/identity-access/README.md
 M docs/features/personnel/README.md
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
?? docs/reviews/pointage-usable-raw-clocking/
?? openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/
?? openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/
?? openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/
?? openspec/changes/async-interaction-feedback-foundation/
?? openspec/changes/pointage-usable-raw-clocking/
?? openspec/specs/authorization/platform-admin-formalites-template-administration/
?? openspec/specs/authorization/pointage/
?? openspec/specs/formalites/template-legal-review-governance/
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

## Reviewed artifact hashes

Exact raw bytes, lowercase SHA-256, sorted paths:

| Path                                                                | SHA-256                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/formalites-legal-template-foundation/analysis.md` | `c40e395a230518bb5ff2073204fb44ae083eee5a2b833898c58287d326d6a4c1` |
| `openspec/changes/formalites-legal-template-foundation/proposal.md` | `61d51cce2ddc75acd050ca0317865e3ddc60e38f41c8e7e2047e4d2a28a9951c` |

Method actually used: Node.js `createHash("sha256").update(readFileSync(path)).digest("hex")`. Reproduce:

```powershell
(Get-FileHash -Algorithm SHA256 -LiteralPath 'openspec/changes/formalites-legal-template-foundation/analysis.md').Hash.ToLowerInvariant()
(Get-FileHash -Algorithm SHA256 -LiteralPath 'openspec/changes/formalites-legal-template-foundation/proposal.md').Hash.ToLowerInvariant()
```

## Protected authority and compatibility baseline

Các exact current working-tree hashes bằng pre-turn baseline. Không phải approval của implementation mới. Recheck exact path/hash set trước Specs; không silently rebaseline.

| Path                                                                                      | SHA-256                                                            |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `.agents/skills/yuta-run-change/SKILL.md`                                                 | `ea82819f0ae07ea24e58169c3b33fe7ad2b1140b5ca91b9cbad81389e9ef0f70` |
| `AGENTS.md`                                                                               | `9e93a58dcdf6127660388ae073817fbac1df0b73be1e8fff9da9187e5cd9065b` |
| `docs/AUTHORITY_MODEL.md`                                                                 | `ff82cba785e2f81d9605f20aa9d311a3d7d8abc4008384fabc159d54b949e01f` |
| `docs/CURRENT_STATE.md`                                                                   | `ad5f744b3758079f1fb55024cf85f4185d32acf51a7488e210c41a2b418f993b` |
| `docs/MODULE_REGISTRY.md`                                                                 | `5727e1caaf374dd9611a79e5447f68b781a826f61ccfa27b53ac9693607f5481` |
| `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`                                          | `27e7cd6a621c6a3f490949041d0d87e1093ffa0d6f045f4356ab39255a0b4a8f` |
| `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`                                         | `edf97a0988b6edfa26c4acc04c89ff91eec6ec8f6df3ac16d3b50d1c895d1bd5` |
| `docs/PRODUCT_KNOWLEDGE.md`                                                               | `4249d0ef9caf3da7f6cc703eb182305f186e82bf14b820765918b00ce1ff19c9` |
| `docs/architecture/DATABASE_BOUNDARIES.md`                                                | `833fc791ec80e487c8f079af951dd35006dc27102e2a9f8be7c4ef347a3ead5e` |
| `docs/architecture/IDENTITY_AND_MEMBERSHIP.md`                                            | `515e3ab673914db49e01aeda1bda7c05f7053628435107566df8fdeb19ca1578` |
| `docs/architecture/TENANCY.md`                                                            | `33f07d70b7e08fe61fe7c74b3865bf818dabbf6986061e1ea11c793bbb79b68d` |
| `docs/features/personnel/README.md`                                                       | `ac6e0a1baf36dd0839de1e9c8d36613f773852ec1644d21b9e3f867b29e6922a` |
| `docs/operations/PRODUCTION_READINESS.md`                                                 | `8e24615545a5246c353fe8eac7786e1d20a4d9d901012d119efe850ab5c73223` |
| `docs/reviews/formalites-template-legal-review-governance/03-final-review.md`             | `23b0c8064b8d9469db25c7369000ca88af4fb491f9d46ce53ef93cf5ec64ac0d` |
| `docs/reviews/platform-admin-formalites-template-authority-foundation/03-final-review.md` | `3e3c767f708e21a2e0329cac4e557a6ccef857b9ffedfb09f156be57bec7948c` |
| `openspec/config.yaml`                                                                    | `d8d2b2aefd4b52e48d3e419b94234460a158820ab3aeb3325ced92d9d4965d8a` |
| `openspec/specs/authorization/formalites/spec.md`                                         | `1815f4dcdd4236d08176b45377e08e9e72a7d187de89172458d7e796a6a05616` |
| `openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md`  | `3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2` |
| `openspec/specs/formalites/persistent-draft-foundation/spec.md`                           | `b4c8077df69c7da638627836255b0a64a3b9b342751964bebe6860183c1b768e` |
| `openspec/specs/formalites/template-legal-review-governance/spec.md`                      | `cbb2dc9173120e9fbc7231bca542b974278ed5d249a9ec8af47a1165873ccb22` |
| `packages/auth/src/formalites-template-system-authorization.ts`                           | `816b912b7cd4b9408d50f4ae4d01832499e87b452661143cac6dbcb0886cace2` |
| `packages/auth/src/session.ts`                                                            | `278d08effc39d90cfe147bd45182a6e80d76ff5641f94d3d1bc302fd8063f5a1` |
| `packages/auth/test/formalites-template-system-authorization.test.ts`                     | `93911ec279fa61f20f2f9af3b0fdb6cc591d1ba88fd6eb1ae2f344f45c52de89` |
| `packages/db-cloud/src/schema/formalites.ts`                                              | `bf7be60d7c9957683e84ad990c513e91e023ae1ab8096d8c7e5d50eb8ea694c8` |

## Authorities, conflicts and review questions

Authorities consulted và evidence routing nằm trong exact Analysis bên dưới. Normative sources/current explicit Product decisions định nghĩa accepted behavior; code/tests chỉ là implementation evidence.

- Resolved: Working Draft không canonical version; freeze bắt đầu immutable boundary. Không override governance content-change rule.
- Resolved: one active draft, 0..N versions, duplicate-free same-revision freeze, textual profile/bytes/SHA-256, applicability assertions không selection engine, exact operation mapping và minimal internal actor allowance.
- CONFLICT, non-blocking summary: DATA_MODEL nói Formalités data “not active”, trái current draft schema/spec/Home. Preserve bytes; không ảnh hưởng new foundation requirements.
- NEEDS REVIEW tại mandatory Design: exact identifiers/serialization/validation, data constraints, freeze concurrency/idempotency, integrity, minimal traceability, migration/rollback. Không chọn mechanism tại Analysis.
- NEEDS REVIEW outside scope: private evidence privacy/retention/storage, actual review, employer/collective configuration, applicability engine, publication/retirement và production.
- Không unanswered requirement-level Product question trước Specs. Cần human Gate 1 review của exact artifacts.
- Concurrent external drift: `docs/reviews/pointage-usable-raw-clocking/02-specs-review.md`, baseline `63041ffbc8b8fc9d35904ede0984d1ac6ea24cf8c75cffcf2de3a331bd351260` → observed `c5a7fd21c9fb04ea8f3617463241fc0ec8b41ea6e69b6074da5fefe98f0da566`. Không do edit của change này; preserve, không revert/claim whole-checkout equality. Protected source table không drift.

## Commands and truthful results

| Command / check                                                                                                                                                                                                                       | Exit             | Result                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `pnpm exec openspec new change formalites-legal-template-foundation`                                                                                                                                                                  | 0                | Shell created; no schema override                                                       |
| `pnpm exec openspec status --change formalites-legal-template-foundation --json`                                                                                                                                                      | 0 after creation | 2/5 artifacts done; Specs ready; Design/Tasks blocked                                   |
| `pnpm exec openspec instructions proposal --change formalites-legal-template-foundation --json`                                                                                                                                       | 0                | Returned path/template followed                                                         |
| `pnpm exec openspec instructions analysis --change formalites-legal-template-foundation --json`                                                                                                                                       | 0                | Proposal re-read first                                                                  |
| `pnpm exec prettier --write openspec/changes/formalites-legal-template-foundation/proposal.md openspec/changes/formalites-legal-template-foundation/analysis.md`                                                                      | 0                | Only newly authored planning files; no canonical formatter write                        |
| `pnpm exec prettier --check openspec/changes/formalites-legal-template-foundation/.openspec.yaml openspec/changes/formalites-legal-template-foundation/proposal.md openspec/changes/formalites-legal-template-foundation/analysis.md` | 0                | PASS                                                                                    |
| `git diff --check -- openspec/changes/formalites-legal-template-foundation docs/reviews/formalites-legal-template-foundation`                                                                                                         | 0                | No tracked whitespace error; untracked content checked separately                       |
| `pnpm docs:check`                                                                                                                                                                                                                     | 0                | PASS — Documentation consistency check passed (36 current documents)                    |
| `pnpm architecture:check`                                                                                                                                                                                                             | 0                | PASS — runtime imports, database URLs, client boundaries, migration baselines           |
| `pnpm -r --if-present typecheck`                                                                                                                                                                                                      | 0                | PASS — repository compatibility, not execution of new foundation                        |
| `pnpm format:check`                                                                                                                                                                                                                   | 1                | FAIL — 67 files outside new change, unchanged pre-turn hashes at comparison; no cleanup |
| `pnpm exec openspec validate formalites-legal-template-foundation --type change --strict --json --no-interactive`                                                                                                                     | 1                | FAIL — exactly one issue: no delta spec at Gate 1                                       |

Exact strict-validation error:

```text
Change must have at least one delta. No deltas found. Ensure your change has a specs/ directory with capability folders (e.g. specs/http-server/spec.md) containing .md files that use delta headers (## ADDED/MODIFIED/REMOVED/RENAMED Requirements) and that each requirement includes at least one "#### Scenario:" block. If this change intentionally modifies no specs (pure refactor, tooling, docs), set "skip_specs: true" in the change's .openspec.yaml instead. Tip: run "openspec change show <change-id> --json --deltas-only" to inspect parsed deltas.
```

Không claim strict PASS, không tạo Specs hoặc fake skip để bypass Gate 1. Rerun strict validation sau authorized Specs.

Global formatter failed paths:

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

Targeted auth/database tests, guarded integration databases, builds và Browser QA: NOT RUN trong planning-only turn. Không claim Technical Implementation Compliance, VERIFY hoặc QA PASS của foundation chưa triển khai.

## Exact proposal content

Exact source: `openspec/changes/formalites-legal-template-foundation/proposal.md`. Hash áp dụng original file bytes, không surrounding fences.

```text
## Why

Hai prerequisite normative về system authority và legal-review governance đã hoàn tất, nhưng repository chưa có durable GLOBAL YUTA Formalités template identity/version. Control Tower đã chốt scope và content-identity decisions để tạo foundation tối thiểu trước một real CDI template, không đồng nhất persistence với review, publication hoặc qualification.

## What Changes

- Tạo dedicated GLOBAL template data boundary trong `@yuta/db-cloud`, không organization/establishment ownership, `TenantContext`, system organization giả hoặc tenant fallback.
- Template Identity giữ một stable legal purpose/type qua nhiều versions; đổi fundamental purpose/type cần identity khác. Metadata ảnh hưởng legal meaning, rendered content, applicability, selection, generation hoặc review scope là version-significant; không invent mutable presentation fields.
- Mỗi identity có tối đa một active mutable Working Draft và `0..N` immutable Template Versions. Working Draft không phải canonical version. Freeze tạo exact immutable snapshot; sửa content/applicability sau freeze cần Working Draft khác và Version khác.
- Repeated freeze cùng working-draft revision không tạo duplicate versions. Nếu có ordinal, nó unique trong template nhưng không làm applicability selector; latest không đồng nghĩa applicable. Cơ chế thuộc Design.
- Canonical Legal Source Profile V1 là textual source có explicit profile identity: valid UTF-8, không BOM, LF, không Unicode normalization, không silent whitespace trimming. Canonicalization trước freeze; profile và bytes bất biến sau freeze, không formatter rewrite hoặc recanonicalize historical versions.
- Bind exact template/version identity, profile, canonical content, identified SHA-256 checksum và immutable applicability declaration. Cùng content checksum nhưng applicability khác không kế thừa qualification.
- Giữ các governance applicability dimensions; dùng canonical reference chỉ khi approved owner tồn tại, còn lại là explicit assertions/assumptions. Không tạo reference-data enums, executable applicability facts hoặc automatic matching.
- Reuse đúng operation mapping: `formalites.template.read` đọc identity/draft/retained history; `formalites.template.draft.manage` tạo identity/draft và sửa mutable draft; `formalites.template.review.submit` freeze exact draft. Freeze không xác nhận reviewer receipt, review, evidence hoặc qualification.
- Chỉ cho bounded internal create/edit/freeze traceability nếu Design cần, dùng minimal internal YUTA actor identifier; không duplicate name/email/contact. Existing security audit giữ riêng.

## Capabilities

### New Capabilities

- `formalites/legal-template-foundation`: durable global template identity, mutable working draft, immutable version/content/applicability binding, exact operation enforcement và duplicate-free freeze; không publication/evidence lifecycle.

### Modified Capabilities

Không có. Reuse nguyên trạng `authorization/platform-admin-formalites-template-administration` và `formalites/template-legal-review-governance`; không sửa `authorization/formalites` hoặc `formalites/persistent-draft-foundation`.

## Impact

- Classification: `CROSS_MODULE / DATA_OWNERSHIP_SENSITIVE / LEGAL_PRIVACY_SENSITIVE`; Strategy A, một bounded cross-module change.
- Formalités giữ semantic ownership; `@yuta/db-cloud` giữ persistence; Identity / Access giữ authorization; Platform Admin chỉ là future runtime. Exact files, data shape, concurrency và traceability mechanisms thuộc Design; Sensitive Design Gate bắt buộc.
- Personnel facts, Documents signed artifacts, tenant repositories/authorization, Backoffice sessions, POS và Display không đổi. Không tạo application/API/UI hoặc provider integration; không yêu cầu dependency mới tại Proposal.
- Turn này chỉ tạo Proposal + Analysis và Gate 1 packet. Chưa Specs, Design, Tasks hoặc Apply. Canonical Knowledge reconciliation chỉ sau archive qua reviewed Knowledge Consolidation; không tự promote lifecycle/readiness. Production `NOT AUTHORIZED`.

## Non-goals

Không actual CDI/CDD content, legal engagement/review, reviewer identity/professional data, opinion/correspondence, private evidence URL/path/attachment/record, publication evidence, evidence CRUD/upload/storage, publication, qualification hoặc retirement execution. Không sixth operation, new principal/reviewer YUTA account, tenant customization, employer/employee collection, employer legal/collective configuration, automatic applicability selection, placeholder/conditional execution, generated contract, preview/PDF/DOCX renderer, signature, Documents handoff, automatic legal research/change detection hoặc production enablement. Privacy/retention production gates không được đóng bởi foundation này.
```

## Exact analysis content

Exact source: `openspec/changes/formalites-legal-template-foundation/analysis.md`.

```text
# Change Analysis

## Scope and Change Type

`formalites-legal-template-foundation` là behavioral, data-affecting, security-sensitive và legal/privacy-sensitive change. Classification: `CROSS_MODULE / DATA_OWNERSHIP_SENSITIVE / LEGAL_PRIVACY_SENSITIVE`; Strategy A: một bounded foundation, không general-purpose Platform Admin hoặc publication lifecycle.

Current-user authorization chỉ cho Proposal + Analysis và Gate 1 packet. Target capability là `formalites/legal-template-foundation`. Không tạo Specs, Design, Tasks, implementation, migration hoặc runtime trong turn này. Sensitive Design Gate bắt buộc sau Design, trước Tasks/Apply.

## Sources Consulted

- [Proposal](proposal.md), current-user Control Tower request với 14 approved Product decisions; request provenance/hash được ghi trong Gate 1 packet.
- [Root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [workflow skill](../../../.agents/skills/yuta-run-change/SKILL.md) và [OpenSpec config](../../config.yaml).
- [Current State](../../../docs/CURRENT_STATE.md), [Personnel Home](../../../docs/features/personnel/README.md), [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Cloud database instructions](../../../packages/db-cloud/AGENTS.md), [auth instructions](../../../packages/auth/AGENTS.md), [ADR-003](../../../docs/decisions/ADR-003-database-ownership-boundaries.md), [database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), [tenancy](../../../docs/architecture/TENANCY.md), [identity/membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md), [architecture overview](../../../docs/architecture/OVERVIEW.md), [data model](../../../docs/architecture/DATA_MODEL.md), [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md).
- Normative [system authorization](../../specs/authorization/platform-admin-formalites-template-administration/spec.md), [legal-review governance](../../specs/formalites/template-legal-review-governance/spec.md), [tenant Formalités authorization](../../specs/authorization/formalites/spec.md), [persistent draft](../../specs/formalites/persistent-draft-foundation/spec.md).
- Current [system operation policy](../../../packages/auth/src/formalites-template-system-authorization.ts), [session resolution/guard](../../../packages/auth/src/session.ts), [authorization tests](../../../packages/auth/test/formalites-template-system-authorization.test.ts), [Formalités schema](../../../packages/db-cloud/src/schema/formalites.ts), [global users schema](../../../packages/db-cloud/src/schema/users.ts), [Personnel versions/history schema](../../../packages/db-cloud/src/schema/personnel.ts), [draft integration tests](../../../packages/db-cloud/test/formalites-personnel-draft-repository.integration.test.ts).
- Completed prerequisite evidence: [authority final review](../../../docs/reviews/platform-admin-formalites-template-authority-foundation/03-final-review.md), [governance final review](../../../docs/reviews/formalites-template-legal-review-governance/03-final-review.md). Các packets là provenance, không thay current normative sources.

## Authority and Product Decision

Control Tower đã explicitly resolve Discovery/Shaping bằng current-user request. Đây là authority cho bounded Product decisions dưới đây, không phải Gate 1 approval hoặc Apply authorization. Existing main specs tiếp tục normative, không cần sửa để tạo new foundation capability.

1. Scope là `GLOBAL_YUTA_FORMALITES_TEMPLATES`; Formalités giữ semantic ownership, `@yuta/db-cloud` giữ persistence family. Không org/establishment owner, `TenantContext`, system organization giả, tenant fallback hoặc restaurant customization.
2. Template Identity đại diện stable legal purpose/type. Đổi fundamental purpose/type cần identity khác. Metadata tác động legal meaning/rendered content/applicability/selection/generation/review scope là version-significant. Không có concrete mutable presentation-only field được cấp thêm tại Analysis.
3. Mutable Working Draft không phải canonical Template Version. Tối đa một active draft mỗi identity; identity có `0..N` immutable versions và có thể nhiều frozen historical/review candidates. Freeze tạo exact snapshot; sau freeze mọi content/applicability change cần draft/version khác.
4. Stable version identity là bắt buộc. Ordinal chỉ nếu Design cần: unique trong template, không applicability selector. Repeated freeze cùng draft revision không tạo duplicate version; không quyết định locking, transactions hoặc receipt mechanism ở đây.
5. Canonical Legal Source Profile V1 là textual source, explicit profile identity, valid UTF-8/no BOM/LF, không Unicode normalization/silent whitespace trimming. Canonicalization trước freeze; sau freeze profile/bytes bất biến, không formatter rewrite hoặc recanonicalize historical data khi profile tiến hóa. AST, DOCX và PDF không phải canonical source của slice này.
6. SHA-256 được identify và tính trên exact canonical bytes. Version bind template/version identity, profile, exact content, algorithm/checksum và immutable applicability. Cùng checksum với applicability khác không cho inherit qualification.
7. Applicability giữ jurisdiction, contract category, full/part-time boundary, employee/employer categories, collective-agreement assumptions, effective-date constraints, exclusions và binding conditions. Approved owner có sẵn mới cho canonical references; otherwise là explicit assertions/assumptions. Chúng không chứng minh external review đã diễn ra. Unsupported/unmapped/unknown không trở thành executable applicability facts. Không automatic matching hoặc invented dictionaries.
8. Existing five independent operations/grants giữ nguyên: `YUTA_ADMIN` nhận explicit grants, `YUTA_SUPPORT` none; không wildcard/prefix/implication/hierarchy/caller policy hoặc principal mới. Trusted active internal user + exact operation, không cần restaurant membership; global grant không cấp tenant access.
9. Không external reviewer identity/professional data, legal opinion/correspondence, private evidence URL/path/attachment/record hoặc publication evidence. Minimal internal actor ID có thể hỗ trợ create/edit/freeze traceability nếu Design cần; không copy email/name/contact. Security audit không là mutation completion, legal-review evidence hoặc publication audit.
10. Privacy/retention production gates vẫn unresolved. Không invent retention duration, indefinite-retention guarantee, evidence processing approval hoặc lifecycle/readiness promotion. Canonical Knowledge reconciliation chỉ qua reviewed post-archive Knowledge Consolidation.

Approved operation-to-behavior mapping:

| Exact operation                     | Bounded behavior                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `formalites.template.read`          | Đọc template identity, working draft và retained version history theo authorized boundary                                            |
| `formalites.template.draft.manage`  | Tạo template identity, tạo working draft, sửa mutable draft                                                                          |
| `formalites.template.review.submit` | Freeze exact working draft thành immutable review candidate/version; không chứng minh delivery/receipt/review/evidence/qualification |
| `formalites.template.publish`       | Existing authority giữ nguyên; không domain execution trong change                                                                   |
| `formalites.template.retire`        | Existing authority giữ nguyên; không domain execution trong change                                                                   |

## Current Implemented State

- `packages/auth` đã có exact operation tuple/grant map và trusted active-user system guard, cùng tests cho allow/deny/unsupported operations và không tenant fallback. `requireSystemRole` đơn lẻ không thay exact capability guard. Tests được inspect, không được trình bày như execution evidence của foundation chưa tồn tại.
- Current Formalités database chỉ có tenant/employee-connected preparation drafts và receipts. Draft revision/concurrency không phải global immutable legal-template version. No Personnel write-back và existing scoped authorization tiếp tục độc lập.
- Global users chứng minh cloud package có non-tenant identity records; không tạo general-purpose global content authority. Documents immutable signed-artifact versions và Personnel history chỉ là implementation patterns, không phải template/evidence owner để reuse bằng cách bỏ tenant scope.
- Không tìm thấy existing global template catalog/version repository/contracts hoặc equivalent archived foundation. Hai archived prerequisites hiện có là authority-only và governance-only; không duplicate chúng.
- Platform Admin application, legal evidence storage, actual qualified content, publication/retirement service và generation chưa có trong bounded foundation. Không kiểm tra deployed database/runtime; deployment/environment evidence `UNVERIFIED` trong analysis này.

## Affected Boundaries

- Formalités: new identity/draft/freeze/version/content/applicability semantics. Dedicated global persistence trong approved cloud family; exact files/schema/API-internal representation thuộc Design, không chọn tại Analysis.
- Identity / Access: reuse existing system-only authorization, không grant change hoặc tenant bypass. Không sửa Backoffice session architecture; không browser/runtime integration.
- Personnel và Documents: không facts/history mutation, signed-artifact storage reuse hoặc ownership transfer. Không thu thập employee/employer data.
- Employer legal configuration, collective-agreement canonical configuration và automatic applicability selection: excluded; absence không được xử lý bằng invented fields/enums.
- Private evidence, publication, qualification, retirement execution, external provider, generation/rendering/signature/handoff: excluded. Foundation không tạo evidence CRUD hoặc reviewer account.
- POS/Site Agent/Display: không bị ảnh hưởng. Production và lifecycle state: không được promote.

## Lifecycle Baseline

Các giá trị dưới đây là current routing/evidence, không phải status assignment mới:

| Existing bounded scope                  | Baseline                                                                                                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Employee-connected persistent CDI draft | Product `APPROVED`; Implementation `IMPLEMENTED`; Environment `DEVELOPMENT_ONLY`; Production Readiness `BLOCKED`; External Dependency `BLOCKED` theo Personnel Home           |
| Broader future generation/signature     | `PROPOSED / NOT_STARTED / NOT_ENABLED / BLOCKED`; external legal/template/privacy/storage/signature dependencies `BLOCKED`                                                    |
| Platform Admin application              | Reserved runtime only; `NOT_STARTED / NOT_ENABLED / NOT_ASSESSED`; portable authority implementation không promote app lifecycle                                              |
| Authority và governance prerequisites   | Review evidence ghi workflow `DONE`; normative specs tồn tại, không actual legal review/template qualification hoặc production permission                                     |
| Candidate này                           | Current-user bounded Product decisions đã explicit; chưa có implementation hoặc riêng một canonical registry assignment. Không tự thêm row hay gán inherited lifecycle values |

`HR-TEMPLATE-01`, `HR-FORMALITY-01`, `HR-RET-01`, `HR-STORE-01` và `HR-AUDIT-01` vẫn là unresolved external/production gates; persistence planning không đóng chúng.

## Requirement Readiness

Có thể viết precise behavioral specs cho `formalites/legal-template-foundation` mà không invent Product authority. Current request đã resolve draft/version distinction, cardinality, textual profile/byte rules, SHA-256, operation mapping, global persistence owner và excluded evidence boundary.

Behavioral acceptance dimensions cho Specs, chưa là delta spec: exact grants/denials và independent tenant isolation; stable identity/purpose; one active working draft; immutable freeze binding; no duplicate freeze; byte/checksum preservation; changed applicability creates another version; assertions không là applicability engine; minimal traceability không là review/publication; excluded lifecycle/runtime không xuất hiện.

Mọi version vẫn unqualified bởi slice này: freeze không legal review, checksum không opinion authenticity, authorization allow không publication. Không có `published/qualified` writable shortcut hoặc false placeholder evidence.

## UI / UX Applicability

`UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO` cho approved candidate scope. Không UI/page-pack change, preview hoặc Platform Admin app. Future data/domain Apply vẫn cần appropriate non-browser QA; chưa gán final QA `NOT_APPLICABLE` cho executable persistence chỉ vì không có UI. Turn này không thực hiện Apply/Verify/QA.

## Conflicts and Unknowns

- **Resolved discovery ambiguity:** canonical-content changes luôn tạo new version theo governance; mutable working draft không canonical version theo current explicit decision. Freeze bắt đầu canonical immutable identity, không sửa governance hoặc cho minor-change exemption.
- **CONFLICT — non-blocking stale summary:** `docs/architecture/DATA_MODEL.md` vẫn ghi Formalités data “not active”, trong khi current persisted draft schema/spec và Personnel Home chứng minh ngược lại. Conflict chỉ là broad implemented-state summary; không tác động new foundation requirements. Preserve nguyên bytes, không sửa canonical docs tại Gate 1.
- **NEEDS REVIEW — Design-only:** exact content-profile identifier, byte validation/canonicalization interface và error representation; applicability serialization/reference representation; identity storage shape; stable version/optional ordinal mechanism; one-active-draft and repeated-freeze concurrency/idempotency; integrity enforcement; bounded traceability/minimization và migration/rollback verification. Phải tuân fixed Product semantics; không chọn mechanisms trong Analysis. Nếu lựa chọn đổi observable Product scope, quay lại Control Tower.
- **NEEDS REVIEW — excluded future scope:** actual private evidence owner/privacy/retention, employer legal configuration, collective reference authority, automatic applicability selection, publication/retirement execution và qualified-template production readiness. Không cần giải quyết bằng implementation trong change này.
- Repository dirty trước turn, gồm shared auth/database/Knowledge và unrelated active changes. Gate 1 chỉ thêm scoped planning/review files. Before Apply cần fresh exact path/hash baseline và isolation review; current dirty paths không được coi là approved implementation changes.
- CLI creation progress/planning-home metadata hiển thị default `spec-driven`, nhưng `.openspec.yaml`, `status.schemaName` và artifact instructions đều xác nhận pinned `yuta-spec-driven`. Không override schema/config hoặc sửa tooling. Nếu effective schema đổi/không resolve, STOP.

Không còn requirement-level authority conflict trong approved bounded request. Không có Product question bắt buộc trả lời thêm trước Specs; human Gate 1 review vẫn bắt buộc. Sensitive Design review không được bỏ qua.

## Analysis Conclusion

`READY_FOR_SPECS`

Scope confirmed cho duy nhất `formalites/legal-template-foundation`, sau explicit Gate 1 approval và intact hashes. Đây là behavior change; không dùng `skip_specs: true`. Không tạo Specs trong turn này. Proposal/Analysis không authorize Apply, Sync, Archive hoặc production; dừng tại Gate 1 với `AWAITING_HUMAN_REVIEW`.
```

## Gate decision and next authorization

Analysis conclusion: `READY_FOR_SPECS`.
RAW OPENSPEC STATUS: 2/5 artifacts done; Specs ready; planning incomplete.
YUTA OPERATIONAL READINESS: Gate 1 `AWAITING_HUMAN_REVIEW`; STOP before Specs.
Sensitive Design Gate: MANDATORY after Design.
Apply: NOT AUTHORIZED.
Sync authorization: PENDING.
Production: NOT AUTHORIZED.

Recommendation: approve exact Proposal/Analysis at Gate 1 để proceed **Specs only**, sau hash/path revalidation. Không Design/Tasks/Apply, Sync/Archive/Knowledge Consolidation hoặc lifecycle promotion từ packet này.

## Final packet validation

- Scoped Prettier cho metadata, Proposal, Analysis và packet: PASS, exit 0. Packet-only formatter được chạy bằng `pnpm exec prettier --write docs/reviews/formalites-legal-template-foundation/01-analysis-review.md`; không canonical target bị format.
- Exact embedded Proposal/Analysis equality: PASS. Node.js đọc từng source bằng UTF-8, extract `text` fences của packet bằng `/```text\n([\s\S]*?)```/g`, yêu cầu `texts.includes(source)` cho cả hai files; mismatch throw/exit nonzero. Actual exit 0; source hashes khớp reviewed table.
- Protected path/hash integrity: PASS, 24/24 sources bằng pre-turn baseline. Dedicated selected metadata SHA-256: `26bded8c207d4f1916a7733b9877e748de1536ffbb966b0f75839ab6a64d8820`; schema vẫn `yuta-spec-driven`.
- Full tracked/non-ignored-untracked inventory comparison: chỉ bốn new delivery paths thuộc allowlist trên; không removed existing file. Một existing Pointage packet có concurrent drift đã record riêng, không thuộc change này. Không có existing canonical/source file bị change này sửa; không claim whole-repository pristine state.
- Snapshot method: `git ls-files --cached --others --exclude-standard -z`, deduplicate existing files, sort path, SHA-256 raw bytes qua Node `fs`/`crypto`, compare path-to-hash maps trước/sau. Ignored generated typecheck cache không thuộc source-integrity inventory.
- Specs, Design, Tasks và later gate packets vẫn absent; review status `AWAITING_HUMAN_REVIEW`, không auto-approval.
