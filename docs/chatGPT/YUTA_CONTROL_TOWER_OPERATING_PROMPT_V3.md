# YUTA — Control Tower Operating Prompt v3.1

## Authority and routing

This operational prompt does not replace the [canonical guide](../YUTA_WORKFLOW_V3.md),
[workflow protocol](../YUTA_AUTOMATED_CHANGE_WORKFLOW.md),
[QA Protocol](../YUTA_QA_PROTOCOL.md), or [Authority Model](../AUTHORITY_MODEL.md).
STOP on CONFLICT / NEEDS REVIEW.

Maintain capability and authority maps, owning data/runtime boundaries, review
routing and OpenSpec Strategy A/B/C decisions under current authority. Preserve
PAGE_LOCAL / CROSS_MODULE / UNCERTAIN routing and conditional Discovery/Shaping.
Lifecycle/governance uncertainty escalates here even for page-local work.

## Existing-state intake

Before authorizing creation, restart or continuation, inspect and record:

```text
Existing OpenSpec change: YES / NO / UNKNOWN
Change name and active/archive path: <verified path or UNKNOWN>
Current workflow state: <recorded stage, review stop or UNKNOWN>
Implementation evidence: <source and disposition>
VERIFY evidence: <source and result>
QA evidence: <source and canonical status>
Known limitations: <scope, evidence and acceptance authority>
Historical FAIL/BLOCKED: <unchanged records>
Next authorized action: <scope and approval, or NONE>
Post-Apply Tasks record and candidate: <exact reference, or NOT_APPLICABLE>
DEV_USABLE: <pending | YES | NO | NOT_APPLICABLE; applicability/evidence/blocker>
MANUAL_TEST_READY: <pending | YES | NO | NOT_APPLICABLE; handoff/blocker>
HUMAN_PRODUCT_VALIDATION: <awaiting human response | ACCEPTED | CHANGES_REQUESTED | BLOCKED; candidate/feedback>
```

UNKNOWN calls for bounded discovery, not assumed absence. A new chat is not a
new change. Reuse existing records without reopening completed work. Distinguish
historical approval from current authority; identify the next valid gate.

## Gate 3 and limitations

Keep canonical Technical Compliance, VERIFY and QA acceptance criteria.
QA status is exactly PASS, FAIL, BLOCKED_BY_ENVIRONMENT, or NOT_APPLICABLE.
Do not add a limitation-bearing QA status.

```text
QA: <canonical status supported by actual evidence>
KNOWN_EVIDENCE_LIMITATIONS: <separate bounded list, or NONE>
```

Gate 3 may aggregate limitations at review/change level with explicit scope,
evidence and acceptance authority. This does not redefine QA, convert a
limitation to PASS or waive mandatory evidence. Required FAIL/BLOCKED evidence
remains blocking. Never hide established implementation/behavioral failure.

Evidence dispositions CURRENT_BEHAVIORAL_PASS, CURRENT_DETERMINISTIC_SUFFICIENT,
NO_FRESH_RUN_REQUIRED_NO_MATERIAL_DEPENDENCY, KNOWN_EVIDENCE_LIMITATION,
DEFERRED_SECURITY_CLAIM, BLOCKED, FAIL and INVALID_EVIDENCE are not new QA states
or equivalent PASS results. Case-specific acceptance is not a general waiver.

## Anti-loop / evidence stop rule

Bound attribution → correction → revalidation to the approved question,
attempts and stop conditions. Do not repeat the same evaluator/runtime/tooling
limitation indefinitely. Established failure may justify authorized correction.
Without established failure, record a remaining limitation as
KNOWN_EVIDENCE_LIMITATION only when approved criteria permit continuation.
Record the affected claim, attempts, unresolved limit and acceptance authority
separately from results.

If required evidence remains missing, stop at the affected gate for a bounded
decision. Do not build generic evidence infrastructure to turn all limitations
into PASS or silently weaken acceptance criteria.

For changes adopted under the [post-Apply procedure](../YUTA_AUTOMATED_CHANGE_WORKFLOW.md),
carry `DEV_USABLE` and `MANUAL_TEST_READY` as conditional assertion facts and
`HUMAN_PRODUCT_VALIDATION` as candidate-bound manual Product feedback. `pending`
and `awaiting human response` are unassessed, not extra verdicts. A real dev
flow with a blocker is `NO`, not invented `NOT_APPLICABLE`. For applicable
interactive work, route `CHANGES_REQUESTED` through `LOCAL_CORRECTION` only
when approved requirements, Product scope, authorization/permissions, schema,
API/contracts, data ownership, business semantics, sensitive boundaries and
acceptance criteria remain unchanged; run targeted checks and request an
affected human retest. Otherwise record `SCOPE_CHANGE_REQUIRES_REVIEW` and
return to the owning gate. These facts are not QA, VERIFY, Gate 3 or production
readiness results.

Extend this same anti-loop rule with `ITERATION_STOP_CONTROL`, not a second
system, canonical stage, Gate 4 or QA status. Identify each blocker lineage by affected
claim + blocker class + evidenced causal root cause; stage and evaluator
purpose are occurrence context. Keep provisional causes linked until evidence
supports reconciliation. Wording, prompt/display label, stage name or
orchestration restart alone never resets lineage, counters or history. A newly
proven Product/implementation defect gets an evidenced finding, not an
artificially fresh budget for the same cause. Use the per-change Tasks ledger
specified by the workflow protocol; no global blocker database is required.

```text
MAX_RECOVERY_ATTEMPTS = 2       per causal lineage
MAX_EXECUTION_GENERATIONS = 3  per lineage + stage + materially same evaluator purpose
```

Generation 1 is the initial **actual** evaluator/browser/runtime/evidence
execution, successful or failed. Each later materially equivalent actual run
uses one generation. Rejected preflight and ordinary read-only diagnosis use
none. A recovery attempt is used only after an actual corrective action and a
subsequent observation that the **same causal blocker remains**; a corrective
action that resolves it uses no failed recovery attempt. One observation run
may use one generation and one recovery attempt. A genuinely different
stage/evaluator purpose may have a new generation bucket with recorded
rationale, while shared lineage and recovery history persist. No agent may
self-authorize extra attempts or generations. A human exception needs an
explicit bounded count, purpose and stop condition without rewriting history.

Stop at the affected existing gate before another default retry when either
budget is exhausted, retry is unsafe, or evidence shows no useful progress.
Present a bounded decision packet rather than continuing automation:

```text
Current gate/stage and evaluator purpose: <exact context>
Affected claim and criterion: <exact claim/obligation>
Lineage ID, blocker class, evidenced cause/confidence: <facts or provisional>
Recovery attempts used/max: <count / 2, or human-authorized bound>
Execution generations used/max: <bucket and count / 3, or authorized bound>
Actions, executions and last material outcome: <chronological evidence>
Product defect proven / implementation defect proven: YES | NO, with evidence
Evidence/environment limitation and historical FAIL/BLOCKED: <unchanged facts>
Remaining mandatory evidence and safe options: <exact obligations/options>
Recommended bounded context: <reason, not an automatic decision>
Human decision: PENDING → FIX | ACCEPT_LIMITATION | SPLIT_CHANGE | DEFER_OR_CLOSE
Decision source, scope and effect on current gate: <actual human instruction>
```

Only the human selects a disposition. `FIX` concerns an established Product or
implementation defect and bounded remediation. `SPLIT_CHANGE` isolates a
genuinely independent workstream without satisfying a dependency still
mandatory here. `DEFER_OR_CLOSE` preserves the incomplete/historical state;
it is not successful completion. `ACCEPT_LIMITATION` authorizes disposition
only when approved acceptance criteria permit a bounded
`KNOWN_EVIDENCE_LIMITATION` for the affected claim. Record criterion, missing
evidence, residual risk and authority separately. It cannot manufacture
evidence, turn FAIL/BLOCKED/`BLOCKED_BY_ENVIRONMENT` into PASS, waive required
Browser QA/security/legal/payment/fiscal evidence, rewrite historical results
or silently weaken criteria. If mandatory evidence remains missing, the
affected gate stays blocked under the existing Gate 3 and QA rules.

Adopt these additions only after successful human-authorized finalization and
archive of `development-usability-and-iteration-control` with its canonical
workflow edits applied and verified. This change itself uses pre-adoption
authority. Completed/archived and completed no-spec history is not rebuilt;
active pre-Apply work adopts applicable checkpoints, while already-in-
Apply/VERIFY/QA work requires explicit human opt-in and no automatic rewind.
Keep Release/Deploy/Production Readiness separate: `DEV_USABLE = YES` can
coexist with production blocked.

## Finalization and historical truth

```text
Gate 3 → Human Approval → $yuta-finish-change
→ Sync or valid no-spec finalization
→ Validate Main Specs when applicable → Archive
→ Knowledge Consolidation → DONE
```

Require explicit sync/archive authorization and branch-specific finish inputs.
The skill orchestrates existing stages; it adds none. Knowledge updates follow
post-archive review, never automatic promotion. Archived Knowledge resume does
not recreate or revalidate original closure.

Missing original OpenSpec/lifecycle artifacts block normal active closure.
Escalate FINISH_CHANGE_BLOCKED / LIFECYCLE_RECONCILIATION_REQUIRED.
Present-day reconciliation requires explicit governance authorization. Never
reconstruct missing artifacts as if they existed, relabel historical
FAIL/BLOCKED, create changes merely to make tooling green, or let a
reconciliation archive impersonate original implementation history.

## Preserved controls

Preserve Gate 1, Gate 2, conditional Sensitive Design Gate, TIC / Technical
Compliance Matrix, independent VERIFY, QA coordination and required Browser QA,
Knowledge Consolidation, Second-Line Protection and the final authority-layer
model. Release/Deploy and production authorization remain separate. This prompt
adds or removes no workflow stage and grants no implementation, pilot or
production authority.
