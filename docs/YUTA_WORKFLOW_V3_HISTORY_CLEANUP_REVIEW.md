# YUTA Workflow v3 — History Cleanup Review

Status: APPROVED

Reviewed: 2026-09-03

## Final human approval

Final human approval result: APPROVED

Approval source: explicit current-user instruction, recorded 2026-09-03.

The human approved the Phase B historical cleanup recorded here. The following
scope, retention decisions, validation results, and Phase C candidate list remain
historical evidence of that completed phase, not the current deletion status.
Phase C execution is recorded separately in the
[legacy cleanup review](YUTA_WORKFLOW_V3_LEGACY_CLEANUP_REVIEW.md).

## Result and scope

Phase B moved 26 historical files into the existing topic-based documentation
archive convention: 13 reports, 12 completed one-time tasks, and one static PDF.
Nothing was deleted. Active workflow sources retain their locations, content,
statuses, and authority. No Phase C deletion was performed.

The [source audit](YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md) supplied the candidate
classification. The current human instruction authorized historical moves only.
The canonical operating entry point remains [YUTA_WORKFLOW_V3.md](YUTA_WORKFLOW_V3.md).

## Archive convention

[DOCUMENTATION_POLICY.md](DOCUMENTATION_POLICY.md) removes completed material
from active reading paths and requires reference repair. The more specific
existing [archive convention](archive/README.md) preserves process provenance
inside topic directories, as demonstrated by `knowledge-normalization/` and its
`tasks/` subdirectory. The current no-deletion authorization uses that retained
history convention, not the policy's general Git-only removal route.

The destination is [archive/yuta-workflow/](archive/yuta-workflow/README.md), with
completed instructions under `tasks/` and the static PDF under `reference/`.
This is a topic within the existing archive, not a second archive tree.
Its index preserves Step ordering, recorded dates, original filenames, durable
outputs, and current replacement routing. It does not promote history to authority.

## Exact files moved

Old paths below are provenance identifiers. Each new path is the retained file.

| Old path                                                               | New path                                                                                                                                                                            |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/OPENSPEC_BASELINE_AUDIT.md`                                      | [docs/archive/yuta-workflow/OPENSPEC_BASELINE_AUDIT.md](archive/yuta-workflow/OPENSPEC_BASELINE_AUDIT.md)                                                                           |
| `docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`                                  | [docs/archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_REVIEW.md](archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_REVIEW.md)                                                                   |
| `docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`                       | [docs/archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md](archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md)                                             |
| `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md`                        | [docs/archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md](archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md)                                               |
| `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md`         | [docs/archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md](archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md)                 |
| `docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md`                              | [docs/archive/yuta-workflow/OPENSPEC_YUTA_ACTIVATION_REPORT.md](archive/yuta-workflow/OPENSPEC_YUTA_ACTIVATION_REPORT.md)                                                           |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md`                  | [docs/archive/yuta-workflow/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md](archive/yuta-workflow/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md)                                   |
| `docs/YUTA_WORKFLOW_V3_UPDATE_REPORT.md`                               | [docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_UPDATE_REPORT.md](archive/yuta-workflow/YUTA_WORKFLOW_V3_UPDATE_REPORT.md)                                                             |
| `docs/YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md`                        | [docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md](archive/yuta-workflow/YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md)                                               |
| `docs/YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md`                    | [docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md](archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md)                                       |
| `docs/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md`             | [docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md](archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md)                         |
| `docs/YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md`    | [docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md](archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md)       |
| `docs/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md`              | [docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md](archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md)                           |
| `docs/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md`    | [docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md](archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md)       |
| `docs/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md`       | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md)             |
| `docs/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md`        | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md)               |
| `docs/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md`         | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md)                 |
| `docs/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md` | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md) |
| `docs/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md` | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md) |
| `docs/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md`           | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md)                     |
| `docs/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md`   | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md)     |
| `docs/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md`           | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md)                     |
| `docs/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md` | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md) |
| `docs/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md`             | [docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md](archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md)                         |
| `docs/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md`                | [docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md](archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md)                               |
| `docs/chatGPT/YuTa_Workflow_v3.pdf`                                    | [docs/archive/yuta-workflow/reference/YuTa_Workflow_v3.pdf](archive/yuta-workflow/reference/YuTa_Workflow_v3.pdf)                                                                   |

The ten Step 7 tasks have retained baseline/schema/smoke/hardening/activation
outputs. Step 7.4 and 7.6A produced the still-active approved policies; Step 7.6B
has a retained completion report at its original path. The setup and v3 update
tasks have retained setup/update reports and current approved implementations.
The preliminary protocol approval review is superseded by the approved final
review and Design resolution; its older findings/status were not rewritten.

## Preservation and chronology

- Twenty-two moved files are byte-for-byte identical: all 12 tasks, the PDF,
  and nine reports. No historical formatting was normalized in these files.
- Four approved reports received only planned relative-link destination
  repairs: update, documentation review, Design decision, and final protocol
  approval review. Comparison against their pre-move text proves no other
  content changed. All five explicitly listed approved Workflow v3 reports
  retain APPROVED and their exact decision text.
- Existing recorded hashes, command transcripts, reviewed source paths, and
  one-time task output instructions remain historical facts. Old repository-root
  path literals are resolved through the relocation map; they were not globally
  replaced inside approval evidence or task history.
- The PDF SHA-256 before and after is
  `16998bfc5912dae1e657298de08bdc49aee9fc7361432cd2dbcfb1d8cb1d0d0c`.
  Its prior audit classification and docs index already established a historical,
  static/non-canonical role. The new reference index makes that role explicit;
  PDF content was not edited or regenerated.
- Moves preserve names and content for Git rename detection; Git history was
  not rewritten, and no commit/staging operation was performed. Several recent
  review reports were already untracked: their current bytes were preserved,
  but no prior committed history is claimed for them. Existing unrelated dirty
  work was not attributed to this cleanup.

## Links and routing updated

The repository documentation index keeps the canonical guide first. Its PDF
link now resolves into the archive, and a separate history-index link routes
provenance readers out of active operating documentation. The archive root
links the new topic. The source audit has a short routing note explaining that
its inventory paths are historical and linking the relocation map; its findings
and classifications remain unchanged.

Existing inline relative-link destinations repaired:

| Source after move                                                                | Previous destination                                                                            | New destination                                                                                       |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md` | `../openspec/schemas/yuta-spec-driven/schema.yaml`                                              | `../../../openspec/schemas/yuta-spec-driven/schema.yaml`                                              |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md` | `../openspec/config.yaml`                                                                       | `../../../openspec/config.yaml`                                                                       |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md` | `../.agents/skills/openspec-propose/SKILL.md`                                                   | `../../../.agents/skills/openspec-propose/SKILL.md`                                                   |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md` | `OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`                                                     | `../../OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`                                                     |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md` | `../openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/design.md` | `../../../openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/design.md` |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md` | `../openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/design.md`      | `../../../openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/design.md`      |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md`            | `YUTA_WORKFLOW_V3.md`                                                                           | `../../YUTA_WORKFLOW_V3.md`                                                                           |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md`  | `YUTA_WORKFLOW_V3.md`                                                                           | `../../YUTA_WORKFLOW_V3.md`                                                                           |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md`  | `../.agents/skills/yuta-run-change/SKILL.md`                                                    | `../../../.agents/skills/yuta-run-change/SKILL.md`                                                    |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md`  | `../.agents/skills/yuta-finish-change/SKILL.md`                                                 | `../../../.agents/skills/yuta-finish-change/SKILL.md`                                                 |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md`  | `../openspec/config.yaml`                                                                       | `../../../openspec/config.yaml`                                                                       |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md`  | `../openspec/schemas/yuta-spec-driven/schema.yaml`                                              | `../../../openspec/schemas/yuta-spec-driven/schema.yaml`                                              |
| `docs/README.md`                                                                 | `chatGPT/YuTa_Workflow_v3.pdf`                                                                  | `archive/yuta-workflow/reference/YuTa_Workflow_v3.pdf`                                                |
| `docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_UPDATE_REPORT.md`                   | `YUTA_WORKFLOW_V3.md`                                                                           | `../../YUTA_WORKFLOW_V3.md`                                                                           |

No active protocol needed a link change. No active relative link still targets
a moved-away file. Links between reports that moved together retained their
relative destinations. Added index links route to retained files, active policies,
and the canonical guide. Historical old path literals and embedded Git-status
transcripts are not active routing and were intentionally preserved.

## Active documents intentionally retained

Unchanged at their current locations:

- `docs/YUTA_WORKFLOW_V3.md` — canonical human-readable operating guide.
- `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, `docs/YUTA_QA_PROTOCOL.md`,
  `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`, and `docs/reviews/README.md`
  — approved supporting protocols, including all routing notes and statuses.
- `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md` and
  `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md` — active approved policies,
  despite historical sections and review-style filenames.
- Current Page Chat / Control Tower v3 prompts/templates, YUTA and generated
  OpenSpec skills, and OpenSpec schema/config.
- Product Knowledge, lifecycle, ADRs, normative specs, product code, and all
  product-change artifacts and hash-bound review packets.

## Not moved and why

- [OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md](OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md)
  remains at its existing path. The `restaurant-knowledge-authorization` and
  `restaurant-knowledge-validated-knowledge` archived Analysis artifacts and
  their Gate 1 packets reference it. Changing those embedded links would alter
  historical/hash-bound product-change evidence. This cleanup neither rewrites
  those packets nor introduces a duplicate/stub. A later move needs an explicit
  decision on preserving that evidence. The history index identifies this report
  as retained provenance, not an operational entry point.
- `docs/YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md` remains the cleanup decision
  source while Phase C is unresolved; only its history-routing note was added.
- `docs/tasks/YUTA_WORKFLOW_V3_DOCUMENTATION_FINALIZATION_TASK.md` is still
  absent. It was not reconstructed. The approved guide and retained documentation
  review remain durable outputs, with the existing source-unavailable notice intact.
- Step 6 cleanup tasks, Pilot #1 tasks, Informations Generales tasks, the task
  template, unrelated active tasks/changes, and existing product-review folders
  are outside this historical workflow-setup batch and were not moved.
- REMOVE_LATER legacy files remain untouched; no deletion authority was inferred.

## Remaining Phase C candidates

Only a future explicit human decision may authorize:

- `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT.md`;
- `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT.md`;
- `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE.md`;
- `docs/chatGPT/YuTa_Workflow_v2.pdf`.

Confirm external ChatGPT/workspace/training references before deleting those
legacy resources. Optional future task retention/deletion must be decided per
family after provenance review. Any reduction of duplicated active automation
prose requires separate semantic review and authorization, not this move-only task.

## Validation

- Targeted Prettier formatting/check of new index/report and changed routing/link
  Markdown: PASS.
- Initial broader formatting check also inspected the 12 moved task files and
  reported their pre-existing formatting differences. They were deliberately
  not reformatted; exact pre/post byte hashes match. This is a historical
  preservation exception, not a claim that those legacy files pass Prettier.
- `pnpm docs:check`: PASS.
- `pnpm architecture:check`: PASS.
- `git diff --check`: PASS.
- `pnpm -r --if-present typecheck`: PASS (additional root-instruction check).
- Relative-link regression scan: no newly unresolved inline relative file
  targets and no remaining inbound links to moved-away paths. All moved-file
  relative links and new/edited index/report file links resolve. The repository
  scan compares against a pre-move baseline; existing unresolved candidates
  elsewhere, including example/template paths, were not silently repaired or
  represented as clean. External URLs and heading-anchor semantics were not
  validated by this file-path check.
- Exact-content preservation: 22 byte-identical moves; four link-only moves;
  protected active files unchanged against the pre-task baseline.
- Product tests/builds, Browser QA, PDF rendering, and repository-wide formatting
  were not run: no product, UI, PDF content, or workflow behavior changed.

The link scan and move plan were generated in a disposable OS-temp directory,
not added to product code. No dependency installation, workflow execution,
product-change sync/archive, deployment, or lifecycle promotion occurred.

## Historical recommendation

HISTORY_CLEANUP_READY_FOR_HUMAN_REVIEW

Final human approval result: APPROVED
