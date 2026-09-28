# YUTA — Control Tower Handoff Template v3.2

Operating notice:
This is an operational handoff template, not normative workflow authority.
Fields and existing reminders below only transport current evidence; the
canonical Workflow, Automated Workflow and Control Tower prompt own decisions.

Canonical workflow authority:
[`YUTA_WORKFLOW_V3.md`](../YUTA_WORKFLOW_V3.md)

## Manual Global to owning Page Chat

For unmigrated work classified `PAGE_LOCAL`, Global gives Human this short, sourced relay
and stops dependent work. Human chooses the exact owning Page Chat. Codex then
verifies that selected chat and its Bridge Mode before a fresh run. This relay
does not move runtime authority, approve a gate or authorize Apply; the chats
do not communicate automatically. A scope with recorded migration PASS uses
repository knowledge and Control Tower coordination under
[Workflow v3](../YUTA_WORKFLOW_V3.md#legacy-page-knowledge-migration--separate-governance-maintenance);
this Page Chat handoff does not restore its retired Product/shaping authority.

```text
PAGE_LOCAL MANUAL HANDOFF
Owning Page Chat: <title and exact conversation URL/ID, or UNKNOWN>
Task and PAGE_LOCAL reason: <bounded request and source>
Requirement baseline: <source and hard constraints, or UNKNOWN>
Current change/gate: <exact change and next gate, or NONE/UNKNOWN>
Evidence and blockers: <exact references and unresolved gaps>
Last run/command and causal lineage: <identities if applicable; no replay>
Next action for Human: select the owning Page Chat and continue there
```

## Page Chat to Global Control Tower

Use this template when a Page Chat classifies a request as:

- `CROSS_MODULE`
- `UNCERTAIN`

Do not create or continue an OpenSpec change until Control Tower explicitly decides
that the change is ready to enter OpenSpec.

---

```text
CROSS-MODULE CHANGE HANDOFF

Origin page:
Feature / request:
Requirement baseline and source (including hard constraints/out-of-scope):

Impact classification:
- CROSS_MODULE / UNCERTAIN

Why cross-module / uncertain:

Affected pages/modules:
-
-

Owning capability currently known:
-

Canonical data owners currently known:
-

Consumers / downstream dependencies:
-

Runtime boundaries involved:
- Cloud / POS / Site Agent / Display / External / Other

Security / tenancy / permission boundaries:
-

Existing Product decisions:
-

Relevant ADR / durable boundary:
-

Current normative specs involved:
-

Existing implementation / contracts / schema / tests involved:
-

Existing OpenSpec change:
- YES / NO / UNKNOWN
- Change name if known:

Current workflow state if already started:
- IDEA / DISCOVERY / PROPOSAL / ANALYSIS / GATE_1 / SPECS / GATE_2 /
  DESIGN / TASKS / APPLY / VERIFY / QA / GATE_3 / FINISH / ARCHIVED / DONE
- UNKNOWN if not established

Current evidence state:
- Implementation evidence:
- Verify evidence:
- QA evidence:
- Known limitations:
- Historical failures/blockers that must not be relabeled:

Post-Apply development feedback (only when adopted/applicable; copy from Tasks):
- Adoption disposition and event / explicit opt-in reference:
- `POST_APPLY_DEVELOPMENT_FEEDBACK` Tasks path and tested candidate:
- DEV_USABLE applicability / current state / evidence or reason / NO blocker:
- MANUAL_TEST_READY applicability / current state / evidence or reason / NO blocker:
- Manual-test command/runtime, route/entry, safe data/identity reference:
- Basic flow, reset/retry and dev-only limitations:
- HUMAN_PRODUCT_VALIDATION state, human feedback/source and tested candidate:
- LOCAL_CORRECTION or SCOPE_CHANGE_REQUIRES_REVIEW disposition / owning gate:
- Affected human retest required and current response:
- Separate Production Readiness / Release / Deploy state (no DEV_USABLE inference):

Iteration facts (copy existing lineage/occurrences; do not recalculate here):
- Blocker lineage ID, affected claim, class and evidenced/provisional cause:
- Observed stage, evaluator purpose and last material outcome:
- Corrective actions and observed results:
- Recovery attempts used / applicable bound and evidence:
- Execution generations used / bucket and applicable bound:
- ITERATION_STOP_CONTROL state and trigger, if any:
- Product defect proven / implementation defect proven / evidence limitation:
- Historical FAIL/BLOCKED and remaining mandatory criterion:
- Requested human decision and exact Control Tower decision reference, if any:

CONFLICT:
- None / ...

NEEDS REVIEW:
-

UI_AFFECTING across multiple pages:
- YES / NO / UNKNOWN

Release / operational impact known:
- None / ...

Known blockers:
-

Recommended next action:
Move to YUTA Control Tower for ownership, boundary, workflow-state and
OpenSpec-readiness decisions.

Control Tower must decide:

1. owning capability;
2. authority / data / runtime boundaries;
3. Product decisions required;
4. one cross-module change vs multiple bounded changes;
5. review routing;
6. whether Discovery/Shaping is required;
7. whether an OpenSpec change already exists and should be continued;
8. whether a new OpenSpec change is authorized;
9. current workflow state and the next valid gate;
10. what evidence may be reused vs what requires fresh validation;
11. explicit STOP conditions and completion criteria.

ANTI-LOOP RULE:

The Control Tower Operating Prompt owns this rule and any human stop decision;
the lines below are carry-through reminders, not a second policy source.

Do not open repeated
attribution → correction → revalidation
cycles for the same evidence limitation unless:

- a new behavioral / implementation failure is established; or
- a required workflow criterion cannot otherwise be satisfied.

After bounded investigation/correction/retry, record an evaluator / runtime /
tooling limitation as KNOWN_EVIDENCE_LIMITATION only when approved criteria
permit continuation. Record the affected claim and explicit acceptance
authority. Otherwise stop at the affected gate. Do not build generic evidence
infrastructure merely to convert limitations to PASS.

QA status: PASS / FAIL / BLOCKED_BY_ENVIRONMENT / NOT_APPLICABLE
KNOWN_EVIDENCE_LIMITATIONS: <separate bounded list, or NONE>

The canonical QA Protocol controls these statuses. A limitation is not PASS,
does not hide established failure and does not waive mandatory evidence.
Gate 3 may aggregate limitations without redefining QA or its readiness rules.

HISTORICAL TRUTH RULE:

Do not:

- reconstruct missing historical artifacts as if they previously existed;
- relabel historical FAIL/BLOCKED evidence as PASS;
- infer Product / permission / schema / API authority from UI or mockups;
- create a new change merely to make workflow tooling green.

If lifecycle history is missing, Control Tower must explicitly authorize any
present-day reconciliation path.
Its archive must not impersonate original implementation history.
Do not create a change merely because a new chat lacks context.

FINISH / CLOSURE:

Gate 3 → Human Approval → $yuta-finish-change
→ Sync or valid no-spec finalization
→ Validate Main Specs when applicable → Archive
→ Knowledge Consolidation → DONE

Require explicit sync/archive authorization and branch-specific prerequisites.
Missing original lifecycle inputs: FINISH_CHANGE_BLOCKED /
LIFECYCLE_RECONCILIATION_REQUIRED; escalate even for PAGE_LOCAL work.
No stage is added or removed. Release/Deploy remains separate.
```
