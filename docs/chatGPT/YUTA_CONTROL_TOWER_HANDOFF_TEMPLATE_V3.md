# YUTA — Control Tower Handoff Template v3.1

Operating notice:
This is an operational handoff template, not normative workflow authority.

Canonical workflow authority:
[`YUTA_WORKFLOW_V3.md`](../YUTA_WORKFLOW_V3.md)

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

Do not open repeated
attribution → correction → revalidation
cycles for the same evidence limitation unless:

- a new behavioral / implementation failure is established; or
- a required workflow criterion cannot otherwise be satisfied.

When an accepted evaluator / runtime / tooling limitation remains and no
implementation failure is established, record it as a known limitation and
continue toward the next workflow gate.

HISTORICAL TRUTH RULE:

Do not:

- reconstruct missing historical artifacts as if they previously existed;
- relabel historical FAIL/BLOCKED evidence as PASS;
- infer Product / permission / schema / API authority from UI or mockups;
- create a new change merely to make workflow tooling green.

If lifecycle history is missing, Control Tower must explicitly authorize any
present-day reconciliation path.