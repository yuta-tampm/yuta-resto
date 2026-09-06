Change: next-generated-types-bootstrap

Gate: 1 — Proposal / Analysis

Review status: APPROVED

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-04T09:16:22.9715374+02:00

Approval scope: Gate 1 current Proposal/Analysis/metadata hashes; NO_SPEC_BEHAVIOR_CHANGE with skip_specs: true; technical design and Sensitive Design review only. No delta Specs, Tasks or Apply authorized.

Created: 2026-09-04

Schema: yuta-spec-driven

Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE

Sensitive change: YES — bounded cross-module generated-evidence/tooling convention; evaluate technical design through Sensitive Design Gate after Gate 1 approval.

## Request and bounded-change summary

Control Tower yêu cầu bootstrap Next generated types cho sáu Next apps trước recursive typecheck, rồi mới bỏ tracking/ignore đúng generated declarations. next-env.d.ts không phải durable implementation authority. Không sửa Formalités hoặc general integrity. Lượt này chỉ tạo Proposal, Analysis và packet Gate 1; không triển khai.

## Provenance and artifact inventory

- Repository: D:/working/yuta/yuta-resto.
- HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- Change này chưa tồn tại ở đầu lượt; `openspec status --change next-generated-types-bootstrap --json` trả change not found, chỉ liệt kê Formalités.
- `openspec new change next-generated-types-bootstrap` không dùng schema override. Banner/default planning-home ghi spec-driven nhưng pinned metadata, schemaName và instructions đều xác nhận yuta-spec-driven; không có schema fallback.
- Proposal, Analysis, Specs, Design, Tasks và review packet ban đầu đều missing. Chỉ metadata shell, Proposal, Analysis và packet này được tạo. Specs/Design/Tasks vẫn absent.
- Scope dirty baseline trước tạo change:

```text
 M .agents/skills/yuta-finish-change/SKILL.md
 M .agents/skills/yuta-run-change/SKILL.md
 M apps/backoffice/next-env.d.ts
 M apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-edit-dialog.tsx
 M apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/salaries-page.tsx
 M apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow.test.ts
 M apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow.ts
 M apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-refresh.test.ts
 M apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-refresh.ts
 M apps/backoffice/src/app/(authenticated)/equipe/salaries/actions.ts
 M apps/backoffice/src/server/auth/permissions.ts
 M docs/AUTHORITY_MODEL.md
 M docs/MODULE_REGISTRY.md
 D docs/OPENSPEC_BASELINE_AUDIT.md
 M docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md
 D docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md
 M docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md
 D docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md
 D docs/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md
 D docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md
 D docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md
 M docs/PRODUCT_KNOWLEDGE.md
 M docs/README.md
 M docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md
 D docs/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md
 M docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md
 M docs/YUTA_QA_PROTOCOL.md
 D docs/YUTA_WORKFLOW_V3_UPDATE_REPORT.md
 M docs/archive/README.md
 D docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE.md
 M docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md
 D docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT.md
 M docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md
 D docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT.md
 M docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md
 D docs/chatGPT/YuTa_Workflow_v2.pdf
 D docs/chatGPT/YuTa_Workflow_v3.pdf
 M docs/features/personnel/README.md
 M docs/reviews/README.md
 D docs/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md
 D docs/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md
 D docs/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md
 D docs/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md
 D docs/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md
 D docs/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md
 D docs/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md
 D docs/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md
 D docs/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md
 D docs/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md
 D docs/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md
 D docs/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md
 M docs/ui/pages/backoffice-equipe-salaries/README.md
 M packages/contracts/src/personnel/index.ts
 M packages/contracts/test/personnel.test.ts
 M packages/db-cloud/drizzle/meta/_journal.json
 M packages/db-cloud/src/index.ts
 M packages/db-cloud/src/personnel-repository.ts
 M packages/db-cloud/src/schema/personnel.ts
 M packages/db-cloud/test/personnel-repository.integration.test.ts
 M packages/db-cloud/test/schema.test.ts
?? apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-history-metadata-fields.tsx
?? apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-history.tsx
?? apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-action-errors.ts
?? apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-presentation.ts
?? apps/backoffice/src/server/auth/formalites.ts
?? apps/backoffice/test/formalites-authorization-context.test.ts
?? apps/backoffice/test/formalites-permissions.test.ts
?? apps/backoffice/test/personnel-history-action.test.ts
?? apps/backoffice/test/personnel-reconstructable-history-ui.test.tsx
?? docs/YUTA_WORKFLOW_V3.md
?? docs/YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md
?? docs/YUTA_WORKFLOW_V3_HISTORY_CLEANUP_REVIEW.md
?? docs/YUTA_WORKFLOW_V3_LEGACY_CLEANUP_REVIEW.md
?? docs/YUTA_WORKFLOW_V3_PDF_B_REVIEW.md
?? docs/archive/yuta-workflow/
?? docs/reference/
?? docs/reviews/formalites-authorization/
?? docs/reviews/personnel-reconstructable-value-history/
?? openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/
?? openspec/changes/formalites-authorization/
?? openspec/specs/personnel/
?? packages/db-cloud/drizzle/0017_whole_warbound.sql
?? packages/db-cloud/drizzle/meta/0017_snapshot.json
?? packages/db-cloud/src/personnel-history-cutover.ts
?? packages/db-cloud/src/personnel-history-domain.ts
?? packages/db-cloud/test/personnel-history-cutover.integration.test.ts
?? packages/db-cloud/test/personnel-history-cutover.test.ts
?? packages/db-cloud/test/personnel-history-domain.test.ts
```

Không nhận bất kỳ path baseline nào làm implementation của change này. Đặc biệt Backoffice next-env drift đã có trước lượt; không restore hoặc thêm vào Formalités manifest.

## Authority, conflicts and questions

Các source được dẫn đầy đủ trong exact Analysis bên dưới: root/scoped instructions, Authority Model, activation/normativity policies, runtime ADR, development workflow, manifests/config/CLI và integrity evidence.

- Requirement-level CONFLICT: NONE.
- NEEDS REVIEW: duyệt nhánh `NO_SPEC_BEHAVIOR_CHANGE` với `skip_specs: true`, theo instruction cho pure tooling. Không tạo normative product requirement giả.
- Product/authority decision bổ sung: không có trong bounded scope.
- Cần reviewer phê duyệt Gate 1 hiện tại trước design applicability / sensitive technical design. Không coi CLI nextSteps là quyền tiếp tục.
- Verification còn phải làm sau approval: cả sáu app clean generation/typecheck, recursive clean bootstrap, dev/build/typegen Git stability, negative source-drift detection và non-regression.
- General docs stale wording và formatting ngoài scope được ghi nhận, không sửa.
- Root tooling entry point khả thi theo source/CLI evidence; exact wiring và failure handling thuộc Design, chưa được triển khai.
- Formalités remains blocked from sync/archive; substantive evidence được bảo toàn, không khôi phục Gate 3 approval bằng packet này.

## Commands and evidence

| Command/check                                                                                                                                                                                                       | Exact observed result                                                      | Evidence boundary                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `openspec new change next-generated-types-bootstrap`                                                                                                                                                                | Exit 0; schema yuta-spec-driven                                            | New shell only                                                                                        |
| `openspec instructions proposal --change next-generated-types-bootstrap --json`                                                                                                                                     | Exit 0                                                                     | Read before Proposal                                                                                  |
| `openspec instructions analysis --change next-generated-types-bootstrap --json`                                                                                                                                     | Exit 0                                                                     | Read after Proposal/dependency                                                                        |
| `pnpm --filter @yuta/backoffice --filter @yuta/web --filter @yuta/booking-web --filter @yuta/feedback-web --filter @yuta/pos --filter @yuta/display exec next typegen --help`                                       | Exit 0; six supported typegen help outputs                                 | No generation or app build performed                                                                  |
| `pnpm docs:check`                                                                                                                                                                                                   | PASS; 36 current documents                                                 | Documentation check                                                                                   |
| `pnpm architecture:check`                                                                                                                                                                                           | PASS                                                                       | Current boundaries check                                                                              |
| `pnpm -r --if-present typecheck`                                                                                                                                                                                    | Exit 0; 15 of 16 workspace projects selected                               | Existing local generated state; NOT clean-bootstrap verification                                      |
| `pnpm format:check`                                                                                                                                                                                                 | Exit 1; Code style issues found in 62 files                                | Unrelated generated skills, archived/current docs, existing main specs/schema templates; no broad fix |
| `pnpm exec prettier --write openspec/changes/next-generated-types-bootstrap/proposal.md openspec/changes/next-generated-types-bootstrap/analysis.md openspec/changes/next-generated-types-bootstrap/.openspec.yaml` | Exit 0                                                                     | Own artifacts only                                                                                    |
| `openspec validate next-generated-types-bootstrap --strict`                                                                                                                                                         | Exit 0; Change 'next-generated-types-bootstrap' is valid                   | No-spec change validation, not implementation verification                                            |
| `openspec status --change next-generated-types-bootstrap --json`                                                                                                                                                    | Exit 0; Proposal/Analysis done, Specs skipped, Design ready, Tasks blocked | YUTA approval still absent                                                                            |
| Formalités protected SHA-256 comparison                                                                                                                                                                             | 4/4 implementation and 18/18 approved entries match                        | No Formalités edits                                                                                   |

No actual six-app typegen, install, dev, build, tests, Browser QA, database integration, migrations or deployment executed during this planning turn. Earlier Backoffice disposable proof is explicitly historical in Analysis; not a new all-app PASS.

## Artifact integrity

Hashes are lowercase SHA-256 over exact file bytes, using PowerShell:

```powershell
(Get-FileHash -LiteralPath <repository-relative-path> -Algorithm SHA256).Hash.ToLower()
```

Exact sorted reviewed path set (metadata included because skip_specs changes the branch):

| Path                                                             | SHA-256                                                            |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/next-generated-types-bootstrap/.openspec.yaml` | `3994c732a35b66600bfde953f28a4169ca9138804c634a11e1775a1bd1594896` |
| `openspec/changes/next-generated-types-bootstrap/analysis.md`    | `322846fe2553a9579b64d8afce607388b7f92f1d55787b32c8491ca9599cc59a` |
| `openspec/changes/next-generated-types-bootstrap/proposal.md`    | `036e03c7e588d8970dc7255d364ab489612952edcf74f7633ba65e472817b18f` |

## Formalités protected approved hashes

Source: docs/reviews/formalites-authorization/03-integrity.json. Preserve exact approved bytes; this packet does not approve or modify Formalités.

| Path                                                                               | SHA-256                                                            |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/server/auth/formalites.ts`                                    | `60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626` |
| `apps/backoffice/src/server/auth/permissions.ts`                                   | `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` |
| `apps/backoffice/test/formalites-authorization-context.test.ts`                    | `af3a2bd48565cec5afb559602626b16c563f21ca3ec660b7943e4e49327f4537` |
| `apps/backoffice/test/formalites-permissions.test.ts`                              | `9e9888461c4154df90802f3d9021956dba3731cd34a9d27aa110d08ba9bc42e6` |
| `docs/reviews/formalites-authorization/01-analysis-review.md`                      | `b6fc2871222a750ebaa2ffba99a717203fbf41f15bfdc7ff33634bc1a100bb57` |
| `docs/reviews/formalites-authorization/02-specs-review.md`                         | `7deebcd29f6b3d0e9a1f005c45f7966cd1f593dd77532ac75474a34baca78286` |
| `docs/reviews/formalites-authorization/02b-design-review.md`                       | `3a621ae86e916c072cd31373931a51b29d5dbdc9d6374bf2193e9cbef8321fa8` |
| `docs/reviews/formalites-authorization/03-command-results.md`                      | `4859c3c85f9a3b47caadad55cedcdc8683b21c646d929e439420d165959d9318` |
| `docs/reviews/formalites-authorization/03-implementation.diff`                     | `214702ed3c8a8b7a93fd17366b9491923295409d8ca2817c6233101c88e2e5bd` |
| `docs/reviews/formalites-authorization/03-verify-evidence.md`                      | `87bdc43572c7429b9a696619389cd254b7b548a770bd4b49bef0a3dfeeba5c93` |
| `docs/reviews/formalites-authorization/phase-1-baseline.json`                      | `8bebe87ce43d365177e330eb2ac3a38f86a5b53dfa11bd777011d3e7c5017168` |
| `docs/reviews/formalites-authorization/phase-1-review.md`                          | `9892aa686e12b910072af0fffbe6116137979af185c5a7e927c9aef990dd95ab` |
| `docs/reviews/formalites-authorization/qa/QA_REPORT.md`                            | `90419ff3a4baea4f630abfa95f140cfc05d8cc742934b00cfdc9e6853690276a` |
| `openspec/changes/formalites-authorization/analysis.md`                            | `c3d1babc03b1bb3088fe2178065e4fa6b2975c329050c3de847f59ca359794c4` |
| `openspec/changes/formalites-authorization/design.md`                              | `4f8b77b216fb820bd637a6661d164bcf998fde5c26a76e4d236d1652ab1b194d` |
| `openspec/changes/formalites-authorization/proposal.md`                            | `2da37c1b35c5450318ed051e1dec4b23941102e324dc4d453d8a932794b04613` |
| `openspec/changes/formalites-authorization/specs/authorization/formalites/spec.md` | `601dd1417ac25527f201fdb3b95488b98474f6514ecfb0c428f68584d118ba46` |
| `openspec/changes/formalites-authorization/tasks.md`                               | `3d22add75fccb9ab2d48ff808afd1a0e23d81b7119f9bc54cfb14c4dd4595dc4` |

Additional baseline covers all planning/review files including invalidated final packet and integrity metadata:

| Path                                                                               | SHA-256                                                            |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/formalites-authorization/01-analysis-review.md`                      | `b6fc2871222a750ebaa2ffba99a717203fbf41f15bfdc7ff33634bc1a100bb57` |
| `docs/reviews/formalites-authorization/02-specs-review.md`                         | `7deebcd29f6b3d0e9a1f005c45f7966cd1f593dd77532ac75474a34baca78286` |
| `docs/reviews/formalites-authorization/02b-design-review.md`                       | `3a621ae86e916c072cd31373931a51b29d5dbdc9d6374bf2193e9cbef8321fa8` |
| `docs/reviews/formalites-authorization/03-command-results.md`                      | `4859c3c85f9a3b47caadad55cedcdc8683b21c646d929e439420d165959d9318` |
| `docs/reviews/formalites-authorization/03-final-review.md`                         | `6b0be272d0297265d16e7f47138229f8113c542ee9b8681ccfa491a279ed765c` |
| `docs/reviews/formalites-authorization/03-implementation.diff`                     | `214702ed3c8a8b7a93fd17366b9491923295409d8ca2817c6233101c88e2e5bd` |
| `docs/reviews/formalites-authorization/03-integrity.json`                          | `1b0d3474722e9b25dddd4539f831b7778ef8a21f8c66517475fb415a9715a3c8` |
| `docs/reviews/formalites-authorization/03-verify-evidence.md`                      | `87bdc43572c7429b9a696619389cd254b7b548a770bd4b49bef0a3dfeeba5c93` |
| `docs/reviews/formalites-authorization/phase-1-baseline.json`                      | `8bebe87ce43d365177e330eb2ac3a38f86a5b53dfa11bd777011d3e7c5017168` |
| `docs/reviews/formalites-authorization/phase-1-review.md`                          | `9892aa686e12b910072af0fffbe6116137979af185c5a7e927c9aef990dd95ab` |
| `docs/reviews/formalites-authorization/qa/QA_REPORT.md`                            | `90419ff3a4baea4f630abfa95f140cfc05d8cc742934b00cfdc9e6853690276a` |
| `openspec/changes/formalites-authorization/.openspec.yaml`                         | `6766e675615f87c16f60cf61d6cff3c8149687bb14bf8d1f4451537b72fdea72` |
| `openspec/changes/formalites-authorization/analysis.md`                            | `c3d1babc03b1bb3088fe2178065e4fa6b2975c329050c3de847f59ca359794c4` |
| `openspec/changes/formalites-authorization/design.md`                              | `4f8b77b216fb820bd637a6661d164bcf998fde5c26a76e4d236d1652ab1b194d` |
| `openspec/changes/formalites-authorization/proposal.md`                            | `2da37c1b35c5450318ed051e1dec4b23941102e324dc4d453d8a932794b04613` |
| `openspec/changes/formalites-authorization/specs/authorization/formalites/spec.md` | `601dd1417ac25527f201fdb3b95488b98474f6514ecfb0c428f68584d118ba46` |
| `openspec/changes/formalites-authorization/tasks.md`                               | `3d22add75fccb9ab2d48ff808afd1a0e23d81b7119f9bc54cfb14c4dd4595dc4` |

Gate 3 status stays INVALIDATED_BY_ARTIFACT_CHANGE. The earlier approved implementation aggregate remains `214702ed3c8a8b7a93fd17366b9491923295409d8ca2817c6233101c88e2e5bd`.

## Exact Proposal

```markdown
## Why

`next-env.d.ts` là output do Next.js sinh, không phải implementation authority. Checkout sạch hiện không sinh Next types trước TypeScript; giữ file trong Git gây drift dev/build và làm gián đoạn integrity review của change không liên quan.

## What Changes

- Theo quyết định Control Tower: tạo bootstrap được repository hỗ trợ để sinh Next types trước recursive typecheck cho đúng sáu app: `apps/backoffice`, `apps/web`, `apps/booking-web`, `apps/feedback-web`, `apps/yuta-pos`, `apps/yuta-display`.
- Dùng CLI `next typegen` của Next hiện có; orchestration ở repository root và thứ tự CI/development được cập nhật tối thiểu. Không tự viết bộ sinh declarations, không thêm dependency hoặc framework.
- Chỉ sau bằng chứng clean-bootstrap cho cả sáu app mới bỏ tracking và ignore các `next-env.d.ts` tương ứng. File vẫn có thể được sinh local bởi typegen/dev/build.
- Giữ nguyên phát hiện drift với mọi tracked source khác; không tạo ngoại lệ riêng Formalités hoặc sửa workflow integrity.
- Kiểm chứng từng app, recursive flow từ clean checkout, generation failure, Git drift và bảo toàn Formalités. Không dùng restore/build/restore làm giải pháp.

## Capabilities

### New Capabilities

Không thêm capability sản phẩm hoặc normative behavioral requirement. Đây là repository tooling/bootstrap maintenance. Đề nghị nhánh `NO_SPEC_BEHAVIOR_CHANGE`, với `skip_specs: true`; Gate 1 vẫn bắt buộc. Không tạo spec giả chỉ để đáp ứng CLI.

### Modified Capabilities

Không sửa main spec nào, bao gồm Personnel và Authorization. Thay đổi thứ tự chạy công cụ không thay đổi hợp đồng nghiệp vụ, API hoặc runtime.

## Impact

- Owner: YUTA engineering / repository tooling; không tạo runtime hoặc package owner mới.
- Phạm vi dự kiến khi được phép Apply: root `package.json`, `.github/workflows/ci.yml`, `.gitignore`, sáu generated declaration paths và tài liệu bootstrap hiện có (`README.md`, `docs/DEVELOPMENT_WORKFLOW.md`). Scoped regression evidence được xác định khi thiết kế/lập kế hoạch. Không cần sửa business code hoặc dependencies.
- Rủi ro: bỏ tracking trước khi bootstrap đúng; app bị bỏ sót; cấu hình app có side effect; typed routes thiếu; bypass typecheck; drift của source bị che; dirty-worktree attribution. Bằng chứng Backoffice trước đó không thay thế kiểm chứng năm app còn lại.
- Giữ nguyên toàn bộ bốn file implementation và planning/evidence của `formalites-authorization`; change đó vẫn không được sync/archive bởi công việc này.

## Non-goals

Không sửa Formalités, Product behavior, quyền, tenancy, runtime/data ownership, UI, application business logic, schema, migrations, provider hoặc production. Không deploy, sync/archive, tạo Specs/Design/Tasks trong lượt Gate 1 này; không nâng lifecycle hoặc nới Gate 3 integrity.
```

## Exact Analysis

````markdown
# Change Analysis

## Scope and Change Type

- Change: `next-generated-types-bootstrap`.
- Origin: YUTA Control Tower; Discovery/Shaping: COMPLETED theo yêu cầu hiện tại.
- Classification: CROSS_MODULE / REPOSITORY_TOOLING; owner là YUTA engineering ở repository root.
- Đây là tooling/bootstrap maintenance, không thay đổi behavioral contract của sản phẩm. Không thêm runtime, quyền, data owner hoặc external provider.
- Chỉ Proposal, Analysis và Gate 1 được phép trong lượt này. Không sinh types ở checkout chính, không untrack/ignore, không sửa CI/scripts/app code lúc phân tích.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [current-state routing](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge entry](../../../docs/PRODUCT_KNOWLEDGE.md).
- [Activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [run-change skill](../../../.agents/skills/yuta-run-change/SKILL.md), [OpenSpec config](../../config.yaml), CLI proposal/analysis instructions và current main-spec path inventory.
- [Architecture overview](../../../docs/architecture/OVERVIEW.md), [ADR-001](../../../docs/decisions/ADR-001-runtime-families-and-product-visibility.md), [Lifecycle Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Module Registry](../../../docs/MODULE_REGISTRY.md).
- [Development workflow](../../../docs/DEVELOPMENT_WORKFLOW.md), [local development](../../../docs/operations/LOCAL_DEVELOPMENT.md), [root README](../../../README.md), [root manifest](../../../package.json), [workspace config](../../../pnpm-workspace.yaml), [CI](../../../.github/workflows/ci.yml), [.gitignore](../../../.gitignore), [.prettierignore](../../../.prettierignore).
- Sáu scoped instructions: [Backoffice](../../../apps/backoffice/AGENTS.md), [Web](../../../apps/web/AGENTS.md), [Booking](../../../apps/booking-web/AGENTS.md), [Feedback](../../../apps/feedback-web/AGENTS.md), [POS](../../../apps/yuta-pos/AGENTS.md), [Display](../../../apps/yuta-display/AGENTS.md). Package manifests và `next.config.ts` tương ứng đã được đọc.
- [POS offline acceptance tooling](../../../scripts/test-pos-offline.mjs), [Formalités integrity manifest](../../../docs/reviews/formalites-authorization/03-integrity.json) và các file được manifest bảo vệ.
- Next 16.2.9 đã cài tại mỗi app: `next/package.json`, `next typegen --help`; source `next/dist/cli/next-typegen.js`, `next/dist/server/config.js`, `next/dist/lib/typescript/writeAppTypeDeclarations.js` và tài liệu TypeScript đi kèm package. Đây là implementation evidence của version hiện có, không suy từ version mới trên Internet.

## Authority and Product Decision

Quyết định Control Tower trong yêu cầu hiện tại xác định `next-env.d.ts` là generated tooling output, non-authoritative, không tiếp tục tracked làm implementation evidence. Việc thiếu generated types là dependency về thứ tự bootstrap, không phải lý do duy trì tracking.

Quyết định này không nới integrity: mọi tracked source khác vẫn phải được phát hiện khi thay đổi; không có ngoại lệ Formalités. ADR-001 cho phép engineering/tooling dùng chung trong monorepo nhưng runtime/data vẫn độc lập. Root và sáu AGENTS không yêu cầu `next-env.d.ts` phải tracked. Development workflow đã phân loại generated Next declarations là formatting-excluded qua `.prettierignore`; đó không phải Git ignore.

Artifact này không phê duyệt implementation hoặc thay thế quyết định duyệt Gate 1. Không cần Product decision bổ sung cho phạm vi tooling đã bounded.

## Current Implemented State

### Exact six-app inventory

Tất cả sáu app: manifest `next: ^16.2.9`, installed `16.2.9`, `build: next build`, `typecheck: tsc --noEmit`. Cả sáu `next-env.d.ts` đang tracked. Không có app script `typegen`, `pretypecheck` hoặc `postinstall` sinh Next types.

| App path            | Package              | dev                    | start                    | Các scripts còn lại ngoài build/typecheck                                                            |
| ------------------- | -------------------- | ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `apps/backoffice`   | `@yuta/backoffice`   | `next dev -p 3001`     | `next start -p 3001`     | `test: vitest run`; `test:openai:synthetic: vitest run test/personnel-contract-openai-smoke.test.ts` |
| `apps/web`          | `@yuta/web`          | `next dev`             | `next start`             | Không có                                                                                             |
| `apps/booking-web`  | `@yuta/booking-web`  | `next dev -p 3005`     | `next start -p 3005`     | `test: vitest run --exclude e2e/**`; `test:e2e: playwright test`                                     |
| `apps/feedback-web` | `@yuta/feedback-web` | `next dev -p 3006`     | `next start -p 3006`     | Không có                                                                                             |
| `apps/yuta-pos`     | `@yuta/pos`          | `next dev -p 3003`     | `next start -p 3003`     | `test: vitest run`                                                                                   |
| `apps/yuta-display` | `@yuta/display`      | `next dev --port 3002` | `next start --port 3002` | `db:generate`, `db:migrate`, `db:push`, `db:studio`: các lệnh `drizzle-kit` tương ứng                |

Lệnh read-only đã chạy từ repository root, exit 0 và trả sáu help outputs:

```powershell
pnpm --filter @yuta/backoffice --filter @yuta/web --filter @yuta/booking-web --filter @yuta/feedback-web --filter @yuta/pos --filter @yuta/display exec next typegen --help
```

Điều này chứng minh cả sáu CLI hỗ trợ `typegen` và pnpm hiện có có thể dispatch đúng sáu app. Không phải bằng chứng generation/typecheck PASS trên sáu app.

Source `next-typegen.js` dùng config phase production-build, kiểm tra TypeScript setup, khám phá routes và sinh `routes.d.ts`, `validator.ts`, cache-life types; không chạy full application build. Cấu hình sáu app chỉ có redirects/headers tĩnh, transpilePackages, standalone output và allowedDevOrigins; không import DB/provider hoặc custom type generator. Không có `distDir` tùy chỉnh. Typegen/dev/build dùng Next sở hữu declarations; dev dùng `.next/dev`, build/typegen dùng `.next`.

**Feasibility:** một entry point root dispatch đúng sáu package bằng CLI hiện có là phương án tối thiểu có căn cứ, không cần custom generator hoặc sửa từng business app. Chưa chốt implementation script/name tại Analysis. Phải kiểm chứng execution và lỗi dừng đúng trước khi dùng kết luận này cho Apply; CLI support không bảo đảm sạch toàn bộ routes ở mọi app.

### Existing root commands and CI ordering

Root manifest dùng `pnpm --filter` cho app-specific dev/build/typecheck; `build:cloud` nối bốn cloud builds. Root `typecheck` chỉ kiểm tra Web, không phải toàn repo. Không âm thầm đổi nghĩa alias này hoặc để tên tương tự che coverage thiếu.

`.github/workflows/ci.yml`, job `architecture-and-typecheck`: checkout → Node 24.17.0/pnpm 11.8.0 → `pnpm install --frozen-lockfile` → `pnpm docs:check` → `pnpm format:check` → `pnpm architecture:check` → ba Compose config checks và `pnpm db:reset:dev --dry-run` → `pnpm -r --if-present typecheck`.

Không có typegen/dev/build trước recursive typecheck. `cloud-builds` ở checkout/job riêng nên không tạo prerequisite cho job typecheck. README chạy install → dev env sync → dev (chỉ Web); development quality flow cũng chạy recursive typecheck không generation. `dev:env:sync` không sinh Next types và không nên biến thành prerequisite có quyền DB/seed cho type generation.

Theo convention root orchestration, generation prerequisite nên sống ở root tooling/package scripts và được gọi rõ trước recursive TypeScript trong CI cùng hướng dẫn development. Không đặt trong auth module, Next runtime route, database setup, install side effect hoặc Formalités workflow. Design sẽ quyết định wiring cụ thể; Analysis không tạo implementation plan.

### Ignore and existing generated-file handling

`.gitignore` hiện có `node_modules`, `.next`, `.turbo`, `dist`, `coverage`, `playwright-report`, `test-results`, `*.tsbuildinfo`, `*.log`, `.tmp-*` cùng env/private/output rules. Không có `next-env.d.ts` rule. `.prettierignore` có `**/.next/**` và `**/next-env.d.ts`.

`scripts/test-pos-offline.mjs` lưu nội dung POS next-env khi file tồn tại và phục hồi trong cleanup. Đây là housekeeping cũ có điều kiện, không chứng minh tracking bắt buộc; không dùng vòng restore/build/restore để giải quyết issue mới. Test này vẫn cần regression sau khi file không tracked. Chưa phê duyệt refactor offline business/DB flow hoặc mở rộng sang generated artifacts khác.

### Earlier faithful Backoffice experiment, not six-app verification

Control Tower đã chấp nhận phân tích trước: worktree `D:/working/yuta/.tmp-next-env-196baccc`, snapshot `c78789a887ae6635e6ea21a1043e2fb2c9f14f17`, đủ 2.188 file; không copy `.next`, env hoặc node_modules. `pnpm install --frozen-lockfile` exit 0 nhưng không sinh types. `pnpm --filter @yuta/backoffice typecheck` lỗi TS2307 ở `packages/ui/src/yuta-brand.tsx` do thiếu declarations cho SVG có thật. `pnpm --filter @yuta/backoffice exec next typegen` exit 0; typecheck sau đó exit 0; build với CI synthetic env exit 0. Dạng import sinh ra là `./.next/types/routes.d.ts`.

Đây là evidence trước lượt này, không được trình bày như vừa chạy lại. Lượt Gate 1 chỉ kiểm tra manifests/config/source/help và integrity. Full clean-state generation/typecheck cho sáu app và recursive repo verification còn phải được thực hiện ở Apply/Verify sau phê duyệt, không được suy diễn PASS.

## Affected Boundaries

- Tooling chung điều phối các process trong từng app directory; không ghép runtime cloud, POS hoặc Display.
- Không đổi DB ownership, app imports, session, tenancy, auth, API, provider, device, product visibility hoặc business logic.
- Integrity bảo vệ tracked sources giữ nguyên. Bỏ tracking chỉ cho sáu generated declaration paths sau bootstrap proof; không ignore toàn bộ `*.d.ts` hoặc bỏ source paths khỏi integrity.
- Formalités: bốn approved implementation hashes và 18 mục approved integrity manifest khớp ở đầu lượt; snapshot bổ sung toàn bộ 17 file planning/review bao gồm Gate 3 invalidated và metadata. Recheck khi kết thúc và trước mỗi Apply/later gate. Không sửa code/spec/design/tasks/review của change đó; không tự tiếp tục sync/archive.

## Lifecycle Baseline

Module Registry không có bounded product capability cho Next generated-type bootstrap. Không tạo hoặc gán lifecycle mới chỉ để phục vụ tooling. Decision hiện tại là chỉ đạo Control Tower cho phạm vi này; implementation chưa làm, environment/production không được thay đổi hoặc suy từ local proof. External provider không thuộc phạm vi. Các lifecycle Formalités/Personnel và mọi module hiện có giữ nguyên.

## Requirement Readiness

`NO_SPEC_BEHAVIOR_CHANGE`.

Không có precise product/API/security requirement thay đổi; inventory main specs không có tooling capability bị sửa. CLI proposal instruction nêu tooling không đổi spec-level behavior dùng `skip_specs: true`, không tạo placeholder requirement. Đã ghi marker ở metadata của change mới; phải xác nhận CLI nhận Specs skipped. Gate 1 cần duyệt rõ lựa chọn nhánh này; không hiểu yêu cầu “trước Specs” là quyền tạo một spec không có hành vi sản phẩm.

Acceptance của tooling đã bounded: generation có trước recursive typecheck, đủ sáu app, failure không bị bỏ qua, clean-checkout proof, untrack chỉ sau proof, local regeneration không tracked drift, source drift khác vẫn bị phát hiện và Formalités bytes không đổi. Các điều kiện này phải trở thành technical contracts/evidence ở các gate sau, không bị mất vì skip Specs.

## UI / UX Applicability

UI_AFFECTING: NO.

BROWSER_QA_REQUIRED: NO.

Không chỉnh UI hoặc user interaction. QA phù hợp là non-browser CLI/bootstrap/Git regression; không cần tạo page pack hay screenshot QA. Actual dev/build smoke ở giai đoạn sau không phải production enablement.

## Conflicts and Unknowns

- Requirement-level CONFLICT: NONE. Không có instruction yêu cầu tracking. Chênh lệch current CI với desired bootstrap là implementation gap đã được Control Tower xác định, không phải lý do giữ tracking.
- NEEDS REVIEW — Gate 1: duyệt nhánh no-spec tooling. User yêu cầu không tạo Specs trước approval; workflow cũng không cho invent Specs. Marker không tự cấp quyền vượt Gate 1.
- Verification pending, không phải Product blocker: generation/typecheck từng app từ clean state; recursive typecheck trước untrack; dev/build/typegen Git stability; negative tracked-source drift detection; POS offline housekeeping regression. Không claim đã hoàn tất.
- Design-only: root command wiring/name, direct app typecheck usage guidance, bounded ignore form, failure propagation và repeatability evidence. Không cần authority mới; nếu cần đổi runtime/auth/business logic, broad ignore/integrity exception hoặc dependencies thì STOP.
- Attribution risk: HEAD `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`, worktree có nhiều thay đổi unrelated. Backoffice next-env đã drift từ dev import sang build import trước change này. Các source/workflow/docs modifications khác không được nhận làm tooling implementation. Recheck scope trước Apply; không revert drift chỉ để khớp hash.
- Documentation observation: Product Knowledge entry còn câu “no current change artifact” dù có active Formalités; đó là routing text stale, không phải lifecycle authority hoặc permission sửa Formalités. Không normalize trong change này.

## Analysis Conclusion

`NO_SPEC_BEHAVIOR_CHANGE` — phạm vi repository tooling đã rõ; `skip_specs: true` phù hợp. Không có capability được chuyển sang delta Specs. Chưa có implementation hoặc bootstrap verification sáu app được hoàn thành.

Dừng tại Gate 1 `AWAITING_HUMAN_REVIEW`. Sau approval hợp lệ, workflow no-spec phải đánh giá Design applicability riêng; không bỏ Design/Sensitive Design Gate chỉ vì skip Specs. Cross-module generated-evidence convention là điểm cần đánh giá thận trọng ở bước đó. Không tạo Design/Tasks trong lượt này; không sync/archive Formalités hoặc thay đổi production.
````

## Recommendation and stop

### Final packet checks

- `pnpm exec prettier --check openspec/changes/next-generated-types-bootstrap docs/reviews/next-generated-types-bootstrap`: exit 0, all matched files use Prettier code style.
- `pnpm docs:check`: PASS, 36 current documents; rerun after packet creation.
- `pnpm architecture:check`: PASS; rerun after packet creation.
- `openspec validate next-generated-types-bootstrap --strict`: exit 0, valid; rerun after packet creation.
- Recomputed Formalités integrity: 18/18 approved entries match, including 4/4 implementation files. All 17 planning/review baseline paths retain identical hashes and path set.
- Git status compared with pre-change baseline: only the two new change/review directories were added; no baseline status was removed or replaced. No canonical tooling file was edited.

Gate 1: APPROVED. Historical recommendation below was the pre-approval request; the approval metadata above controls this resume.

Reviewer action: approve Proposal + Analysis and the no-spec tooling branch, or request changes. No approval inferred.

RAW OPENSPEC STATUS: Specs skipped; Design ready; Tasks blocked; planning incomplete.

YUTA OPERATIONAL READINESS: stopped at Gate 1. Sensitive technical design review remains required after approval; no Design created yet.

No tooling implementation, tracking/ignore change, Formalités edit, sync/archive or production operation occurred. No lifecycle promotion.
