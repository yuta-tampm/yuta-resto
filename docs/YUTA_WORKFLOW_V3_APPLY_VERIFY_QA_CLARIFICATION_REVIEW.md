# YUTA Workflow v3 — APPLY, VERIFY and QA Clarification Review

Status: APPROVED

## Scope and authorization

Original scope decision: `APPROVE_SCOPE_WITH_MINOR_WORDING_ADJUSTMENTS`.

Historical human decision: `APPROVED` (2026-09-04). The current user explicitly
approved the then-current version of `docs/YUTA_WORKFLOW_V3.md` covered by
this review, including the sections 8–10 clarification and section 18 follow-up.
Verified approved guide SHA-256:
`85f546d00e20689cfa43037d9db1567bcc48e0468bf56f3680b66e300d23a640`.
That metadata-only finalization did not change the guide or workflow semantics.
The subsequent human-requested section 8 readability refinement below changed
the guide bytes and required human review again; that historical approval did
not approve the new hash.

Final human decision for the readability refinement: `APPROVED` (2026-09-04).
The current user explicitly approved the exact current version of
`docs/YUTA_WORKFLOW_V3.md` with SHA-256
`2e10a64ec93fd10927439dc803d515919accd5ebb77b0a2c4119d2d92fc4c4ca`.
The repository file hash was verified to match the human-approved hash.
This metadata-only finalization leaves the guide and workflow semantics unchanged.

This review records documentation clarification only in
[`YUTA_WORKFLOW_V3.md`](YUTA_WORKFLOW_V3.md), using the reviewed proposal and
the user's explicit wording adjustments. It does not approve the resulting
document diff on behalf of the human reviewer.

Files authored by the original clarification and its human-requested follow-up:

- `docs/YUTA_WORKFLOW_V3.md` — original sections 8–10 clarification, plus the
  section 18 follow-up recorded below.
- `docs/YUTA_WORKFLOW_V3_APPLY_VERIFY_QA_CLARIFICATION_REVIEW.md` — this evidence.

The guide was already untracked in a dirty worktree. Review attribution uses
its exact pre-edit contents, not an assumption that its entire Git addition
belongs to this task.

- Pre-edit guide SHA-256: `51995c998d5bc1010b9e936551dc2daf494aae2a3eed99edb052841d1f6e0dc4`.
- Original sections 8–10 post-edit guide SHA-256 (historical): `fd232e1f4c8d7bdc48c7ede44e46d2bd2a00248a6728697d4c9af25a9d1b7fb9`.
- Previously approved guide SHA-256 after the section 18 follow-up: `85f546d00e20689cfa43037d9db1567bcc48e0468bf56f3680b66e300d23a640`.
- Current guide SHA-256 after the section 8 readability refinement: `2e10a64ec93fd10927439dc803d515919accd5ebb77b0a2c4119d2d92fc4c4ca`.

## Exact diff summary

| Location                                  | Change                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Section 8, phase list                     | Replaced the five-label list with a table explaining when each existing optional phase is useful and example relevant concerns. Explicitly excluded irrelevant concerns, empty phases and a mandatory five-phase sequence.                                                                                                                                                                             |
| Section 8, contract and APPLY explanation | Preserved contract fields; expanded the completion paragraph into entry constraints, pre-APPLY classification reference, the internal task/contract → implementation → targeted checks → contract evaluation → evidence → completion loop, and in-scope defect versus authority/gate escalation handling. Clarified that no per-phase approval is added and APPLY UI checks do not replace Browser QA. |
| Section 9, VERIFY                         | Distinguished APPLY checks, scoped technical verification and user/runtime QA. Expanded the existing matrix into explicit traceability, applicable-only phase/constraint coverage, PASS conditions and existing deviation/blocker handling. No new critical-issue status was introduced.                                                                                                               |
| Section 9, QA                             | Organized explanation into A. scope classification, B. environment/data preparation, C. applicable behavior checks, D. evidence and E. status/next action. Explicitly identified these as explanatory groups, not phases/states/gates. Replaced the four-value code list with a table retaining exactly the same enum and explaining actions. Added the approved two-way QA FAIL routing.              |
| Sections 9–10, evidence placement         | Moved the evidence directory tree, screenshot/hash requirements and viewport rules from section 10 into section 9.D/9.C; retained their requirements and added report/manifest role explanations.                                                                                                                                                                                                      |
| Section 10                                | Retained the three readiness conditions, truthful non-UI exception and blockers; made applicable non-browser PASS explicit and referred to section 9 instead of duplicating the QA checklist. Reaffirmed that readiness is not approval or authorization.                                                                                                                                              |

The original sections 8–10 comparison confirmed that metadata and
sections 1–7 and 11–18 were unchanged. The subsequent section 18 exception is
recorded below; metadata and sections 1–7 and 11–17 remain unchanged.
All 18 section numbers/titles remain.
The existing `Status: APPROVED` metadata was preserved, not newly assigned by
this task; this clarification diff was submitted for human review here and is
now explicitly human-approved as recorded above.

## Human-requested section 18 follow-up

Before approval, the human requested one small documentation clarification
outside the original sections 8–10 diff. The CORE shorthand in section 18
previously combined the Design artifact and Sensitive Design Gate:

```text
→ Specs → Gate 2 → [Design Gate] → Tasks
```

It now reads:

```text
→ Specs → Gate 2
→ Design [when applicable]
→ Sensitive Design Gate [conditional]
→ Tasks
```

The existing `→ Apply → Verify → QA` continuation remains after Tasks. This
matches the already-approved distinction in sections 3 and 5: Design artifact
applicability and Sensitive Design Gate applicability are separate. No workflow
semantic change, new gate, or dependency change was introduced. Exact text
comparison with the captured follow-up baseline confirms this replacement is
the only guide change in the follow-up. No PDF was updated.

## Source/rule traceability

The following current sources were inspected as rules, not modified:

| Clarification                                                                        | Existing source and exact rule location                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Optional five phases, relevant concerns, phase contract and pre-APPLY classification | [`yuta-run-change`](../.agents/skills/yuta-run-change/SKILL.md), State 4 — Tasks and phased implementation plan, items 2–7; original guide section 8.                                                                                 |
| Internal APPLY loop and completion evidence                                          | Same skill, State 5 — APPLY, items 1–3; original guide sections 5 and 8.                                                                                                                                                              |
| Defect repair versus Product/design/authority escalation                             | Same skill, State 4 item 6 and State 5 items 4–5; [`QA protocol`](YUTA_QA_PROTOCOL.md), Failure and environment handling.                                                                                                             |
| VERIFY matrix, applicable phase coverage, PASS and deviation/blocker handling        | Same skill, State 6 — VERIFY, items 1–5; original guide sections 9–10. The explanatory wording uses existing deviation/blocker terminology without inventing a finding status or requiring every non-blocking deviation to disappear. |
| QA classification and timing                                                         | Same skill, State 4 item 7 and State 7 — QA; QA protocol, Classification. The protocol's before-Gate-3 requirement remains satisfied by the existing skill's more specific before-APPLY timing.                                       |
| Real environment/data, applicable scenarios and viewports                            | QA protocol, Browser QA for UI changes; same skill, State 7; original guide sections 9–10.                                                                                                                                            |
| Report, screenshot manifest, hashes and authority limits                             | QA protocol, Evidence; same skill, States 7–8; original guide sections 7 and 10.                                                                                                                                                      |
| Four QA statuses, bounded environment recovery and FAIL routing                      | QA protocol, Classification and Failure and environment handling; same skill, States 5–7.                                                                                                                                             |
| Gate 3 readiness and non-UI QA                                                       | QA protocol, Gate 3 integration; same skill, State 8 — Gate 3 final review packet; original guide section 10.                                                                                                                         |

## Semantic safety

No new requirement was introduced: additions explain existing protocol/skill
requirements, while evidence and viewport text was relocated within the guide.
The phase examples apply only when relevant. QA groups A–E are editorial
organization, not execution phases or new states.

Preserved:

- Optional phases and dependency-based selection; no per-phase human gate.
- Conditional Design, omission evidence, Sensitive Design Gate independence,
  and `skip_specs` semantics.
- APPLY/VERIFY/QA separation, the four-value QA enum, truthful non-UI
  `NOT_APPLICABLE`, Browser QA requirements and evidence integrity.
- Gate ordering, approval/hash boundaries, explicit sync/archive authorization,
  finalization branches, Knowledge Consolidation and release separation.

No protocols, skills, OpenSpec schema/config, Product Knowledge, lifecycle,
ADRs, normative specs or product code were edited. Existing unrelated changes
were preserved. No PDF was updated: existing PDFs remain snapshots of their
previous source versions and do not yet include this clarification.

## Original sections 8–10 validation (historical)

| Check                                                      | Result                                                                              |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Targeted Prettier write/check on the guide and this report | PASS                                                                                |
| `pnpm docs:check`                                          | PASS — 36 current documents                                                         |
| `pnpm architecture:check`                                  | PASS                                                                                |
| `pnpm -r --if-present typecheck`                           | PASS — additional root-instruction validation                                       |
| `git diff --check`                                         | PASS                                                                                |
| Captured pre-edit versus post-edit section comparison      | PASS — only sections 8, 9 and 10 changed; metadata and all other sections unchanged |
| Manual source/rule comparison                              | PASS — traceability above; no new workflow requirement or status                    |

Repository-wide formatting, product tests/builds and PDF rendering were not
run: this task changes documentation only and explicitly stops before PDF
updates. Targeted formatting avoids unrelated worktree churn. Since the guide
and report are untracked, targeted formatting and direct content comparison
supplement Git's tracked-file whitespace check.

## Section 18 follow-up validation

- Targeted Prettier write/check on the guide and this report: PASS.
- `pnpm docs:check`: PASS.
- `pnpm architecture:check`: PASS.
- `git diff --check`: PASS.
- Exact follow-up baseline comparison: PASS; only the requested CORE
  replacement changed in the guide.
- `pnpm -r --if-present typecheck`: PASS (additional root-instruction check).

At the section 18 follow-up checkpoint, the report remained `PROPOSED FOR
REVIEW`; neither the earlier scope approval nor that follow-up request was
recorded as final approval. The subsequent explicit human approval is recorded
in Scope and authorization above.

## Section 8 readability refinement — current review

The human requested fuller in-place explanation, not a workflow change. Only
section 8 of the guide was edited in this refinement. The previous approval
and validation records above remain historical evidence for their exact bytes.

### Exact wording changes and proposal coverage

| Section 8 location                           | Explanatory expansion now represented directly                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Five-phase table                             | Kept the same five optional labels. Expanded Foundation/Data to canonical owner, applicable schema/migration, tenant/isolation and contract evidence/checks; Service/Domain to behavior, trusted boundaries, validation, applicable authorization and targeted tests/checks; UI/Components to ownership, Server/Client boundary, approved-pattern reuse and approved-outcome evidence; Interaction/States to edit/read-only, loading/error/pending/success/recovery, keyboard/basic accessibility and relevant states; Integration/Regression to applicable integration/end-to-end/regression checks and affected-behavior evidence. |
| Block immediately after table                | Collected all five selection rules: select only needed phases, order by dependency, do not force small changes through all phases, allow multiple concrete tasks per phase and create no empty phase. Kept applicable-only concerns explicit.                                                                                                                                                                                                                                                                                                                                                                                        |
| Technical Implementation Contract subsection | Made embedding in each selected phase of `tasks.md` and non-artifact status explicit in one place. Listed all seven fields separately: affected boundary, canonical owner, scoped authorities, applicable constraints, intended files/packages, required targeted checks and completion evidence. Preserved unresolved-boundary entry constraints and before-APPLY classification.                                                                                                                                                                                                                                                   |
| APPLY loop subsection                        | Made task + contract + referenced authority → implement approved scope → appropriate targeted checks → every applicable contract item → evidence → completion conditional on outcome AND compliance evidence a distinct subsection. Kept code-change-alone insufficiency, no per-phase approval and Browser QA non-substitution together.                                                                                                                                                                                                                                                                                            |
| Two discovery subsections                    | Separated in-scope technical defect repair, rerun targeted checks and continuation when contract/evidence is satisfied from decision-changing discovery. Explicitly listed Product behavior, requirement, permission/security, canonical owner, API/contract and runtime/data/durable boundary as reasons to STOP and return to the appropriate gate; preserved the prohibition on weakening or silently rewriting Specs/Design to fit code.                                                                                                                                                                                         |

These are the practical points already covered by the approved proposal and
the current human refinement request. The table's concerns are applicable
examples, not new universal obligations. `pending` describes relevant UI state
behavior, not a new workflow or QA status. Existing source traceability to
`yuta-run-change` States 4–7 and the QA protocol remains applicable. No phase,
artifact, status, gate or per-phase approval was added. Conditional Design,
`skip_specs`, VERIFY/QA semantics and authority boundaries are unchanged.

### Bounded sections 9–10 readability findings

- Section 9 VERIFY already directly distinguishes APPLY checks, VERIFY and QA;
  explains matrix traceability and applicable-only phase/constraint coverage;
  and uses existing deviations/blockers without a new status. No approved
  clarification point was missing or materially dispersed.
- Section 9 QA already has explanatory A–E groups, before-APPLY classification,
  environment/data preparation, applicable behavior checks, evidence integrity,
  the four statuses and both FAIL routes. No expansion was needed.
- Section 10 intentionally consolidates readiness and links to section 9 rather
  than repeating the QA checklist. Non-UI QA, blockers and human authorization
  remain explicit. No expansion was needed.

Sections 9–10 were left unchanged. Exact section comparison also confirms all
other guide sections and metadata remain unchanged, including section 18.
No protocol, skill, schema/config, Product Knowledge, lifecycle, ADR, normative
spec, product code or PDF was edited by this refinement.

### Refinement validation

- Targeted formatting on the guide and this report: PASS.
- `pnpm docs:check`: PASS.
- `pnpm architecture:check`: PASS.
- `git diff --check`: PASS.
- `pnpm -r --if-present typecheck`: PASS (additional root-instruction check).
- Captured before/after guide comparison: PASS; only section 8 changed.

PDF regeneration remains deferred. The refined guide bytes were submitted for
human review and are now explicitly human-approved under their exact hash as
recorded in Scope and authorization above.

## Historical review recommendation

READY_FOR_HUMAN_REVIEW

## Readability refinement recommendation (historical)

READY_FOR_HUMAN_REVIEW
