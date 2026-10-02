# YUTA Workflow History

Status: Historical

Visibility: Engineering

Owner: YUTA product and engineering

## Reading rule

Start current operations with the [canonical human-readable YUTA Workflow v3
operating guide](../../YUTA_WORKFLOW_V3.md). This topic follows the existing
[documentation archive convention](../README.md), including its completed-task
subdirectory convention. These records preserve how the active system was
produced; they are not a competing operational authority.

Original dates, decisions, statuses, hashes, command output, and repository-root
path literals remain historical evidence. APPROVED records remain APPROVED;
archiving does not revoke their decisions. Older Proposed recommendations are
not reopened tasks. Only relative link destinations needed for relocation were
repaired. Use the relocation map below to resolve old path literals. Filenames
are unchanged to preserve provenance and Git rename tracking when committed.
No Git history was rewritten and no commit was created by this cleanup.

## Chronology and durable outputs

The sequence follows recorded Step numbers and report dates, not filesystem
modification times. Where no date was recorded, only the relative phase is shown.

| Stage                                                         | Historical evidence                                                                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Step 7.0 / 7.0B — local baseline and 1.11 delta               | [OPENSPEC_BASELINE_AUDIT.md](OPENSPEC_BASELINE_AUDIT.md)                                                                     |
| Step 7.1 — schema proposal                                    | [OPENSPEC_YUTA_SCHEMA_REVIEW.md](OPENSPEC_YUTA_SCHEMA_REVIEW.md)                                                             |
| Step 7.2 — isolated smoke evidence                            | [OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md](OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md)                                       |
| Step 7.3A — hardening analysis                                | [OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md](OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md)                                         |
| Step 7.3B — hardening implementation                          | [OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md](OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md)           |
| Step 7.5 — schema activation                                  | [OPENSPEC_YUTA_ACTIVATION_REPORT.md](OPENSPEC_YUTA_ACTIVATION_REPORT.md)                                                     |
| Initial automated workflow setup                              | [YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md](YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md)                             |
| 2026-09-01 — Workflow v3 update                               | [YUTA_WORKFLOW_V3_UPDATE_REPORT.md](YUTA_WORKFLOW_V3_UPDATE_REPORT.md)                                                       |
| 2026-09-03 — canonical guide review                           | [YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md](YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md)                                         |
| 2026-09-03 — preliminary protocol review; superseded findings | [YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md](YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md)                                 |
| 2026-09-03 — approved conditional Design decision             | [YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md](YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md)                   |
| 2026-09-03 — approved Design implementation                   | [YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md](YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md) |
| 2026-09-03 — final protocol review and approval               | [YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md](YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md)                     |

Step 7.4 and Step 7.6A produced the still-active
[activation policy](../../OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md) and
[normativity policy](../../OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md); those
policies remain outside the archive. The completed Step 7.6B
[normativity activation report](../../OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md)
remains at its existing path because historical product-change packets and
archived artifacts reference it. Moving it would require a separate decision
about preserving that hash-bound evidence; it is not current operating guidance.

The current [automation](../../YUTA_AUTOMATED_CHANGE_WORKFLOW.md),
[QA](../../YUTA_QA_PROTOCOL.md),
[Knowledge Consolidation](../../YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md), and
[review-packet](../../reviews/README.md) protocols retain their active roles.
Executable truth remains the current skills and schema/config, not old task
instructions. Step 7.1, 7.3B, 7.5, and 7.6B tasks are included with the earlier
audited task family because their schema, hardening, activation, and normative
role outputs are retained and completion is recorded by the corresponding reports.

## Static reference

[YuTa_Workflow_v3.pdf](reference/YuTa_Workflow_v3.pdf) is a historical static,
non-canonical snapshot. It is preserved byte-for-byte and may predate later
approved clarifications. Use the Markdown guide for current operations.

## Relocation map

Old paths are historical identifiers, not links to files still at those paths.
Task filenames retain their original Step numbering and instructions unchanged.

| Original repository path                                               | Retained file                                                                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `docs/OPENSPEC_BASELINE_AUDIT.md`                                      | [OPENSPEC_BASELINE_AUDIT.md](OPENSPEC_BASELINE_AUDIT.md)                                                                     |
| `docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`                                  | [OPENSPEC_YUTA_SCHEMA_REVIEW.md](OPENSPEC_YUTA_SCHEMA_REVIEW.md)                                                             |
| `docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`                       | [OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md](OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md)                                       |
| `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md`                        | [OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md](OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md)                                         |
| `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md`         | [OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md](OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md)           |
| `docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md`                              | [OPENSPEC_YUTA_ACTIVATION_REPORT.md](OPENSPEC_YUTA_ACTIVATION_REPORT.md)                                                     |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md`                  | [YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md](YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md)                             |
| `docs/YUTA_WORKFLOW_V3_UPDATE_REPORT.md`                               | [YUTA_WORKFLOW_V3_UPDATE_REPORT.md](YUTA_WORKFLOW_V3_UPDATE_REPORT.md)                                                       |
| `docs/YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md`                        | [YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md](YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md)                                         |
| `docs/YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md`                    | [YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md](YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md)                                 |
| `docs/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md`             | [YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md](YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md)                   |
| `docs/YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md`    | [YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md](YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md) |
| `docs/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md`              | [YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md](YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md)                     |
| `docs/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md`    | [YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md](tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md)       |
| `docs/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md`       | [YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md](tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md)             |
| `docs/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md`        | [YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md](tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md)               |
| `docs/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md`         | [YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md](tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md)                 |
| `docs/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md` | [YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md](tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md) |
| `docs/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md` | [YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md](tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md) |
| `docs/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md`           | [YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md](tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md)                     |
| `docs/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md`   | [YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md](tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md)     |
| `docs/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md`           | [YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md](tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md)                     |
| `docs/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md` | [YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md](tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md) |
| `docs/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md`             | [YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md](tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md)                         |
| `docs/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md`                | [YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md](tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md)                               |
| `docs/chatGPT/YuTa_Workflow_v3.pdf`                                    | [YuTa_Workflow_v3.pdf](reference/YuTa_Workflow_v3.pdf)                                                                       |

The source [documentation audit](../../YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md)
remains outside this archive while cleanup decisions remain open. The missing
one-time documentation-finalization task was not reconstructed; the approved
guide and documentation review remain its durable outputs. Unrelated tasks and
legacy REMOVE_LATER candidates were not moved or deleted.
