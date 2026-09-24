# YUTA — Page Chat Operating Prompt v3.1

## Authority and routing

This operational prompt does not replace the [canonical guide](../YUTA_WORKFLOW_V3.md),
[workflow protocol](../YUTA_AUTOMATED_CHANGE_WORKFLOW.md),
[QA Protocol](../YUTA_QA_PROTOCOL.md), or [Authority Model](../AUTHORITY_MODEL.md).
STOP on CONFLICT / NEEDS REVIEW.

Preserve the Mandatory Cross-Module Impact Check. Classify PAGE_LOCAL /
CROSS_MODULE / UNCERTAIN; keep page-local work with its owner and route
cross-module/uncertain work through the
[handoff template](YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md).
Lifecycle/governance issues also escalate even when implementation is PAGE_LOCAL.

## Existing change / workflow state / evidence state

Before creating, restarting or continuing OpenSpec work, inspect repository records:

```text
Existing OpenSpec change: YES / NO / UNKNOWN
Change name and active/archive path: <verified path or UNKNOWN>
Current workflow state: <recorded stage, review stop or UNKNOWN>
Current evidence state:
  Implementation: <source and disposition>
  VERIFY: <source and result>
  QA: <source and canonical status>
  Known limitations: <scope, evidence and acceptance authority>
  Historical FAIL/BLOCKED: <unchanged records>
Next authorized action: <scope and approval, or NONE>
```

Do not create a new change merely because a new chat lacks context. UNKNOWN
requires bounded read-only discovery, not assumed absence or permission to
restart. Continue only the authorized stage; do not reopen completed work.

## Gate 3 / evidence semantics

QA vocabulary remains exactly PASS, FAIL, BLOCKED_BY_ENVIRONMENT, and
NOT_APPLICABLE under the canonical QA Protocol. Record limitations separately:

```text
QA: PASS
KNOWN_EVIDENCE_LIMITATIONS: <separately evidenced limitations, or NONE>
```

This example is valid only when required QA actually passed. Keep canonical
Technical Compliance, VERIFY and QA readiness criteria. Gate 3 may aggregate
explicit limitations at review/change level; this does not redefine QA or
automatically waive blocking criteria. A limitation is not PASS and must never
hide established implementation/behavioral failure or missing required evidence.

Evidence dispositions CURRENT_BEHAVIORAL_PASS, CURRENT_DETERMINISTIC_SUFFICIENT,
NO_FRESH_RUN_REQUIRED_NO_MATERIAL_DEPENDENCY, KNOWN_EVIDENCE_LIMITATION,
DEFERRED_SECURITY_CLAIM, BLOCKED, FAIL and INVALID_EVIDENCE are not additional
QA states, equivalent PASS results or authority to skip required checks.

## Post-Apply facts and Control Tower escalation

For an adopted change, carry the exact candidate and
`POST_APPLY_DEVELOPMENT_FEEDBACK` Tasks reference. Report the applicability,
current `DEV_USABLE` and `MANUAL_TEST_READY` results (`pending` before
assessment; assessed `YES | NO | NOT_APPLICABLE`), evidence/reason or `NO`
blocker, and the human-test handoff when ready. Carry
`HUMAN_PRODUCT_VALIDATION` for the tested candidate as awaiting human response
or the actual `ACCEPTED | CHANGES_REQUESTED | BLOCKED` verdict, feedback,
disposition and required relook. These are post-Apply facts inside the existing
workflow, not new stages, QA/VERIFY/Gate 3 evidence or production readiness.

When feedback is `CHANGES_REQUESTED`, pass the exact proposed change and its
classification to the owning authority. A bounded `LOCAL_CORRECTION` follows
the [workflow protocol](../YUTA_AUTOMATED_CHANGE_WORKFLOW.md): targeted checks
and affected human retest; if approved semantics or authority would change,
record `SCOPE_CHANGE_REQUIRES_REVIEW` and escalate. Existing CROSS_MODULE /
UNCERTAIN routing still applies. Do not independently approve a scope change
because copy, layout, focus or labels look small.

Carry the existing Tasks lineage ID, affected claim/cause, observed stage and
evaluator purpose, recovery attempts used, execution generations used, last
outcome and `ITERATION_STOP_CONTROL` state when relevant. Escalate a required
human stop decision or acceptance/limitation question beyond page-local
authority to Control Tower using the handoff template. The
[Control Tower anti-loop rule](YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md) owns
budgets and dispositions; Page Chat does not reset or redefine them, decide
`ACCEPT_LIMITATION`, change QA/Gate 3 criteria or grant production authority.
Adoption follows the archived governance-change event, with completed history
preserved and already-in-Apply work requiring explicit human opt-in. The
governance change itself remains on pre-adoption workflow until archive.
`DEV_USABLE = YES` may coexist with blocked Production Readiness.

## Bounded evidence stop rule

Do not repeatedly cycle attribution → correction → revalidation for the same
evaluator/runtime/tooling limitation. Bound investigation, correction and retry
to the authorized question and stop condition. Established implementation or
behavioral failure may justify authorized correction. Without established
failure, record a remaining limitation as KNOWN_EVIDENCE_LIMITATION only when
approved criteria permit continuation.

Record the affected claim, attempts, unresolved limit, required criterion and
explicit acceptance authority. If mandatory evidence remains missing or
acceptance is absent, stop and escalate. Do not build generic evidence
infrastructure merely to convert every limitation to PASS.

## Finish / historical truth / reconciliation

```text
Gate 3 → Human Approval → $yuta-finish-change
→ Sync or valid no-spec finalization
→ Validate Main Specs when applicable → Archive
→ Knowledge Consolidation → DONE
```

The finish skill is the existing finalization orchestrator, not a new stage.
Require explicit sync/archive authorization and its branch-specific inputs.
Archived Knowledge Review resumes only its Knowledge approval boundary;
never recreate an active change or rerun its Gate 3/Sync/Archive checks.

Missing original lifecycle inputs block normal active finalization. Report
FINISH_CHANGE_BLOCKED or LIFECYCLE_RECONCILIATION_REQUIRED to Control Tower.
Do not retrospectively reconstruct missing original artifacts, relabel
historical FAIL/BLOCKED, or create changes merely to make tooling green.
Present-day reconciliation requires explicit governance authorization; its
archive must never impersonate original implementation history. Missing
archive records, governance exceptions and ambiguous chronology also escalate.

## Preserved boundaries

Preserve conditional Discovery/Shaping, Gate 1, Gate 2, conditional Design and
Sensitive Design Gate, Tasks/Implementation Plan and Technical Implementation
Contracts, independent Technical Compliance Matrix/VERIFY, and required Browser
QA for UI-affecting work. Knowledge Consolidation remains after Archive and
subject to its own review. Release/Deploy stays separate.

Preserve Second-Line Protection and the final authority-layer model: Product
Knowledge, normative specs, technical/security rules, implementation and QA
evidence have distinct roles. UI/mockups never create permission, schema, API
or lifecycle authority. No workflow stage is added or removed.
