# YUTA Workflow v3 — Documentation Audit

Status: PROPOSED FOR REVIEW

Visibility: Engineering

Owner: YUTA product and engineering

Audited: 2026-09-03

History routing: The inventory below preserves paths and findings at audit time.
Completed Phase B moves are mapped in the
[workflow history index](archive/yuta-workflow/README.md). Use
[`YUTA_WORKFLOW_V3.md`](YUTA_WORKFLOW_V3.md) for current operations; historical
path literals below are provenance, not current file-location instructions.

## Current documentation model

The intended documentation hierarchy is:

```text
docs/YUTA_WORKFLOW_V3.md
|
+-- detailed protocols
|   +-- automation/workflow protocol
|   +-- QA protocol
|   +-- post-archive Knowledge Consolidation protocol
|   +-- OpenSpec activation and normativity policies
|
+-- operating prompts
|   +-- Page Chat v3
|   +-- Control Tower v3
|   +-- Control Tower handoff v3
|
+-- executable rules
|   +-- yuta-run-change
|   +-- yuta-finish-change
|   +-- OpenSpec config and yuta-spec-driven schema
|
+-- review/history evidence
    +-- approval and implementation reports
    +-- one-time implementation tasks
    +-- superseded prompts and static workflow references
```

[`README.md`](README.md) is the repository documentation index and already
routes readers to `YUTA_WORKFLOW_V3.md` as the **Canonical human-readable YUTA
Workflow v3 operating guide**. It is not itself a Workflow v3 authority layer.
[`PRODUCT_KNOWLEDGE.md`](PRODUCT_KNOWLEDGE.md) routes product knowledge, while
[`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md) selects authority by question type;
neither should be repurposed as a workflow index.

The classifications below identify a document's role in this set. A
`REVIEW_EVIDENCE` or `IMPLEMENTATION_TASK` classification does not make the
document current operating guidance. An `EXECUTABLE_RULE` controls machine
behavior but does not replace human approval or the broader authority model.

## Inventory and classification

| Document                                                               | Classification            | Current purpose                                                                                                                       | Still needed?                        | Overlap                                                                                                                                    | Recommended action      |
| ---------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `docs/YUTA_WORKFLOW_V3.md`                                             | `CANONICAL_GUIDE`         | Approved primary human-readable guide for understanding and operating Workflow v3.                                                    | Yes                                  | Summarizes all supporting layers without replacing them.                                                                                   | `KEEP_AS_IS`            |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`                               | `DETAILED_PROTOCOL`       | Active detailed automation, gate, integrity, failure, sync/archive and branch-isolation protocol.                                     | Yes                                  | Substantial end-to-end overlap with the guide, but retains machine-oriented detail and stop behavior.                                      | `ADD_ROUTING_NOTE`      |
| `docs/YUTA_QA_PROTOCOL.md`                                             | `DETAILED_PROTOCOL`       | Defines QA classification, Browser QA, evidence, failure states and Gate 3 integration.                                               | Yes                                  | The guide summarizes its distinction from VERIFY and core evidence rules.                                                                  | `ADD_ROUTING_NOTE`      |
| `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`                        | `DETAILED_PROTOCOL`       | Defines post-archive scan, review packet and approved knowledge-update behavior.                                                      | Yes                                  | The guide summarizes both consolidation paths and authority safeguards.                                                                    | `ADD_ROUTING_NOTE`      |
| `docs/reviews/README.md`                                               | `DETAILED_PROTOCOL`       | Defines review-packet sequence, content, hashes, QA evidence and retention.                                                           | Yes                                  | Overlaps packet summaries in the guide and automation protocol; currently links only to the automation protocol as “Workflow v3 protocol.” | `ADD_ROUTING_NOTE`      |
| `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`                       | `DETAILED_PROTOCOL`       | Approved operating and upgrade/fallback policy for the active `yuta-spec-driven` default.                                             | Yes                                  | Some pre-activation framing is historical; operational rules remain relevant to executable OpenSpec behavior.                              | `ADD_ROUTING_NOTE`      |
| `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`                      | `DETAILED_PROTOCOL`       | Approved policy for normative scope, approval, sync, conflict, rollback and lifecycle separation.                                     | Yes                                  | The guide summarizes normative promotion; pre-activation state/proposal sections are now historical.                                       | `ADD_ROUTING_NOTE`      |
| `.agents/skills/yuta-run-change/SKILL.md`                              | `EXECUTABLE_RULE`         | Executes start/resume/adoption through the next human gate; never syncs or archives.                                                  | Yes                                  | The guide explains usage, not the state-machine implementation.                                                                            | `KEEP_AS_IS`            |
| `.agents/skills/yuta-finish-change/SKILL.md`                           | `EXECUTABLE_RULE`         | Executes authorized active finalization or archived Knowledge Review resume.                                                          | Yes                                  | The guide explains the two branches without duplicating integrity algorithms.                                                              | `KEEP_AS_IS`            |
| `openspec/config.yaml`                                                 | `EXECUTABLE_RULE`         | Selects `yuta-spec-driven` and supplies project artifact language context.                                                            | Yes                                  | No material prose duplication; the guide only routes to it.                                                                                | `KEEP_AS_IS`            |
| `openspec/schemas/yuta-spec-driven/**`                                 | `EXECUTABLE_RULE`         | Defines artifact graph, dependencies, templates/instructions and Apply tracking mechanics.                                            | Yes                                  | The guide describes the operating model, not schema mechanics.                                                                             | `KEEP_AS_IS`            |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`                   | `OPERATING_PROMPT`        | Gives Page Chat page-local context, impact classification, gate review and escalation instructions.                                   | Yes                                  | Repeats the workflow overview for operational use; it is not normative workflow authority.                                                 | `ADD_ROUTING_NOTE`      |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`               | `OPERATING_PROMPT`        | Gives Control Tower cross-module coordination, strategy and review-routing instructions.                                              | Yes                                  | Repeats cross-module portions of the guide for prompt usability; it is not normative workflow authority.                                   | `ADD_ROUTING_NOTE`      |
| `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md`               | `OPERATING_PROMPT`        | Provides the current structured handoff from Page Chat to Control Tower.                                                              | Yes                                  | Narrow template content is intentionally repeated by the Page Chat prompt.                                                                 | `ADD_ROUTING_NOTE`      |
| `docs/YUTA_WORKFLOW_V3_UPDATE_REPORT.md`                               | `REVIEW_EVIDENCE`         | Records the approved automation update, protected-scope evidence and validation that produced Workflow v3.                            | Yes, as provenance                   | Much of its explanatory summary is now covered by the guide and protocols.                                                                 | `MARK_HISTORICAL`       |
| `docs/YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md`                        | `REVIEW_EVIDENCE`         | Records coverage, validation and approval evidence for the canonical guide.                                                           | Yes, as provenance                   | Source and coverage lists overlap the guide's structure but serve audit history.                                                           | `MARK_HISTORICAL`       |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md`                  | `REVIEW_EVIDENCE`         | Records the initial v1 skill/protocol setup and smoke-test recommendation.                                                            | Yes, if setup provenance is retained | Superseded operationally by the v3 update report, approved guide and current skills.                                                       | `MOVE_TO_HISTORY_LATER` |
| `docs/OPENSPEC_BASELINE_AUDIT.md`                                      | `REVIEW_EVIDENCE`         | Records the pre-custom-schema OpenSpec 1.11.0 baseline.                                                                               | Yes, as versioned provenance         | Its observed default and empty-state facts are historical after activation and real changes.                                               | `MOVE_TO_HISTORY_LATER` |
| `docs/OPENSPEC_YUTA_SCHEMA_REVIEW.md`                                  | `REVIEW_EVIDENCE`         | Records the initial proposed custom-schema review before hardening and activation.                                                    | Yes, if decision lineage is retained | Superseded by hardening, activation policy and executable schema state.                                                                    | `MOVE_TO_HISTORY_LATER` |
| `docs/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md`                       | `REVIEW_EVIDENCE`         | Records isolated compatibility tests and known limitations before activation.                                                         | Yes, as test provenance              | Later hardening and activation reports supersede its readiness conclusion.                                                                 | `MOVE_TO_HISTORY_LATER` |
| `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md`                        | `REVIEW_EVIDENCE`         | Records analysis and recommendation for the schema dependency hardening.                                                              | Yes, as decision provenance          | The implementation report and current schema supersede it operationally.                                                                   | `MOVE_TO_HISTORY_LATER` |
| `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md`         | `REVIEW_EVIDENCE`         | Records the approved schema hardening and isolated validation.                                                                        | Yes, as implementation provenance    | Current schema is executable truth; the report is historical evidence.                                                                     | `MOVE_TO_HISTORY_LATER` |
| `docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md`                              | `REVIEW_EVIDENCE`         | Records activation of `yuta-spec-driven` as the project default.                                                                      | Yes, as activation provenance        | Current config proves the executable default; report facts are dated.                                                                      | `MOVE_TO_HISTORY_LATER` |
| `docs/OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md`                  | `REVIEW_EVIDENCE`         | Records integration of the approved normative role into current authority sources.                                                    | Yes, as activation provenance        | Current authority sources now carry the live semantics.                                                                                    | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md`    | `IMPLEMENTATION_TASK`     | One-time instructions that created the initial automation workflow and reports.                                                       | No for current operation             | Superseded by produced artifacts and later v3 work.                                                                                        | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md`                | `IMPLEMENTATION_TASK`     | One-time instructions that upgraded the automation workflow to v3.                                                                    | No for current operation             | Duplicates desired behavior now present in the guide, protocols, skills and update report.                                                 | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md`       | `IMPLEMENTATION_TASK`     | One-time instructions for the original local OpenSpec baseline audit.                                                                 | No for current operation             | Output is retained in `OPENSPEC_BASELINE_AUDIT.md`.                                                                                        | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md`        | `IMPLEMENTATION_TASK`     | One-time OpenSpec 1.11.0 delta re-audit instructions.                                                                                 | No for current operation             | Incorporated into the baseline audit.                                                                                                      | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md` | `IMPLEMENTATION_TASK`     | One-time isolated schema test instructions.                                                                                           | No for current operation             | Output is retained in the smoke-test report.                                                                                               | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md` | `IMPLEMENTATION_TASK`     | One-time instructions for hardening analysis.                                                                                         | No for current operation             | Output and implementation evidence exist separately.                                                                                       | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md`   | `IMPLEMENTATION_TASK`     | One-time instructions for activation-policy review.                                                                                   | No for current operation             | Approved policy document is the durable result.                                                                                            | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md` | `IMPLEMENTATION_TASK`     | One-time instructions for normativity-policy review.                                                                                  | No for current operation             | Approved policy and activation report are the durable results.                                                                             | `MOVE_TO_HISTORY_LATER` |
| `docs/tasks/YUTA_WORKFLOW_V3_DOCUMENTATION_FINALIZATION_TASK.md`       | `IMPLEMENTATION_TASK`     | Referenced as the one-time source task for the approved guide, but absent from the current worktree and unknown to Git at audit time. | Undetermined                         | `YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md` still cites the missing path.                                                                   | `NEEDS_HUMAN_DECISION`  |
| `docs/chatGPT/YuTa_Workflow_v3.pdf`                                    | `HISTORICAL`              | Static eight-page approved Workflow v3 visual reference created before the Markdown guide became canonical.                           | Optional as a dated visual snapshot  | Closely duplicates the guide; static content can drift, including shorthand that requires nearby conditional clarification.                | `MARK_HISTORICAL`       |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT.md`                      | `DEPRECATED_OR_REDUNDANT` | Legacy Page Chat prompt predating the fuller v3 prompt.                                                                               | No for current operation             | Materially superseded by `YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`.                                                                          | `REMOVE_LATER`          |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT.md`                  | `DEPRECATED_OR_REDUNDANT` | Legacy Control Tower prompt predating the fuller v3 prompt.                                                                           | No for current operation             | Materially superseded by `YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`.                                                                      | `REMOVE_LATER`          |
| `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE.md`                  | `DEPRECATED_OR_REDUNDANT` | Legacy cross-module handoff template.                                                                                                 | No for current operation             | Materially superseded by `YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md`.                                                                      | `REMOVE_LATER`          |
| `docs/chatGPT/YuTa_Workflow_v2.pdf`                                    | `DEPRECATED_OR_REDUNDANT` | Static four-page Workflow v2 reference.                                                                                               | No for current operation             | Superseded by Workflow v3 and omits v3's independent QA and Knowledge Consolidation model.                                                 | `REMOVE_LATER`          |

Separate systems found by the filename search—`DEVELOPMENT_WORKFLOW.md`,
`DOCUMENTATION_POLICY.md`, `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`,
`docs/ui/DELIVERY_WORKFLOW_MODES.md`, and
`docs/ui/UI_WORKFLOW_DELIVERY_CHECKLIST.md`—are not Workflow v3/OpenSpec
governance artifacts. They retain their existing development, documentation or
UI-delivery scopes and need no normalization under this audit.

## Duplication / stale content findings

### 1. Detailed protocol versus canonical guide

`YUTA_AUTOMATED_CHANGE_WORKFLOW.md` remains an active detailed automation
protocol. It is not superseded as an implementation reference: it retains
review-packet integrity, adoption, failure handling, finalization branch
isolation and automation boundaries at a level intentionally summarized by the
guide. Its end-to-end explanation substantially duplicates the canonical
guide, however, and its `Status: Proposed` can be read as conflicting with the
approved guide and approved v3 update report. A short header note should route
human readers to the guide and state whether the protocol's metadata is active
or still awaiting a separate approval decision. Reducing its body is not a safe
metadata-only cleanup and should not occur without a later semantic comparison.

The same status ambiguity exists on `YUTA_QA_PROTOCOL.md`,
`YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`, and `docs/reviews/README.md`:
current approved Workflow v3 and executable skills rely on them, while each
still says `Status: Proposed`.

### 2. Review and implementation reports

`YUTA_WORKFLOW_V3_UPDATE_REPORT.md` and
`YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md` remain useful as approval and
provenance evidence only. They should not appear as day-to-day workflow entry
points. The initial setup report and the dated OpenSpec schema/activation
reports are similarly valuable evidence but no longer describe current
operational state better than config, schema, skills and current authority
sources.

### 3. One-time tasks

The discovered `docs/tasks/YUTA_*WORKFLOW*` and OpenSpec Step 7 task files are
one-time implementation instructions whose durable results now exist. Keeping
them beside active task specifications makes filename search noisier and risks
readers treating old preconditions as current truth. They are candidates for a
history move after references are mapped. The specifically requested
`YUTA_WORKFLOW_V3_DOCUMENTATION_FINALIZATION_TASK.md` is absent and has no
tracked Git history, while the approved documentation review still cites it;
that evidence gap needs a human retention decision rather than reconstruction
by assumption.

### 4. Operating prompts

The three v3 prompt/template files remain operational prompts. They encode how
Page Chat and Control Tower should use the workflow in their own context; they
are not normative Workflow v3 authority and do not replace the canonical guide,
Product Knowledge, ADRs, main specs or executable rules. Brief back-links would
make that relationship explicit. The corresponding non-v3 prompt/template set
is materially superseded and is likely removable after explicit approval.

### 5. Static PDFs

`YuTa_Workflow_v3.pdf` is a readable, internally consistent static snapshot of
the approved v3 model, but it duplicates the Markdown guide and cannot track
future approved clarifications automatically. It should be labeled historical
or snapshot-only. `YuTa_Workflow_v2.pdf` is superseded and omits v3's separated
QA, Technical Implementation Contract and post-archive Knowledge Consolidation
model.

### 6. OpenSpec policy lineage

The activation and normativity policy reviews retain active rules, but they
also contain pre-activation current-state and future-action sections that are
now historical. Their core policy should remain in place. A routing note can
separate active policy sections from dated decision context; any later split or
reduction requires a semantic review against current authority documents and
executable rules.

## Recommended cleanup plan

### Phase A — safe documentation metadata/routing cleanup

1. Add a short standardized note to the automation, QA, Knowledge
   Consolidation and review-packet protocols: human readers start with
   `YUTA_WORKFLOW_V3.md`; the current file supplies the named detailed protocol.
2. Ask the accountable reviewer to resolve the `Proposed` metadata on the four
   protocols that approved Workflow v3 currently depends on. Do not infer
   `APPROVED` from usage alone.
3. Add a one-line non-normative operating-prompt notice and canonical-guide
   back-link to the three v3 Page Chat/Control Tower files.
4. Add historical-evidence labels to the two Workflow v3 reports and a static
   snapshot label to the v3 PDF.
5. Add a scope note to the activation and normativity policies identifying
   dated pre-activation sections while preserving their approved active rules.
6. Update `docs/reviews/README.md` so its first workflow link points to the
   canonical guide, then separately links the detailed automation protocol.
7. Resolve the missing finalization-task reference without recreating content
   from memory: either restore the reviewed exact task artifact from an
   accountable source or annotate the review evidence as source unavailable.

### Phase B — historical/archive moves

1. Define one documentation-history destination consistent with
   `DOCUMENTATION_POLICY.md` and `docs/archive/README.md`; avoid creating a new
   overlapping archive convention.
2. Move initial workflow setup, schema review/smoke/hardening reports, activation
   reports and completed Step 7 tasks together with an index that preserves
   chronology and replacement links.
3. Move the approved Workflow v3 update/documentation review evidence and v3
   PDF only after every active inbound link is redirected to the canonical
   guide or the correct detailed protocol.
4. Preserve Git history and update exact relative links in the same reviewed
   move; rerun documentation validation after each bounded batch.

### Phase C — possible deletions requiring explicit human approval

1. Remove the three non-v3 Page Chat/Control Tower prompt/template files after
   confirming no live ChatGPT workspace still bootstraps from them.
2. Remove the Workflow v2 PDF after confirming no external review packet or
   training reference requires it.
3. Consider removing one-time task files whose result and provenance are fully
   retained in approved reports and Git history; decide retention per task
   family rather than deleting the entire task tree.
4. Consider reducing duplicated end-to-end prose in the detailed automation
   protocol only after a line-by-line invariant comparison and explicit human
   approval. Do not reduce failure, integrity, branch-isolation or stop rules.

No move or deletion is authorized by this audit.

## Authority safety

The proposed cleanup is documentation classification, metadata, routing and
retention work only. It must not change:

- Workflow v3 logic, gates, branches, stop conditions or approval semantics;
- OpenSpec artifact behavior, dependency graph, validation or sync semantics;
- Product Decisions, Product Knowledge or module ownership;
- lifecycle dimensions or status values;
- normative main specs or change artifacts;
- YUTA skills, generated skills, OpenSpec schema/config or templates;
- ADRs, security/runtime/data boundaries, QA requirements or Knowledge
  Consolidation requirements;
- product code, tests, databases, migrations, deployment or runtime state.

For every future cleanup batch, compare exact content before and after, keep
current authority links intact, and stop on any semantic change. Historical
labels and file moves do not downgrade or rewrite the decision evidence they
contain.

## Recommendation

`CLEANUP_PLAN_READY_FOR_HUMAN_REVIEW`
