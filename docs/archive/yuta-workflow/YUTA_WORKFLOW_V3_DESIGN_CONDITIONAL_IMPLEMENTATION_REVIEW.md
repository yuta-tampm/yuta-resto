# YUTA Workflow v3 — Conditional Design Implementation Review

Status: APPROVED

## Final human review

Final human review result: APPROVED

Approval source: explicit current-user instruction, recorded 2026-09-03.

The human approved the recorded MODEL_B_DESIGN_CONDITIONAL implementation.
The unavailable optional `quick_validate.py` result caused by missing PyYAML is
explicitly accepted as non-blocking; its original validation limitation remains
recorded below. No dependency installation is required for this closure.
This approval does not promote the four supporting protocol statuses.

## Scope and authorization

This report records implementation of the current human decision approving
`MODEL_B_DESIGN_CONDITIONAL`, following
[`YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md`](YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md).
It does not approve the supporting protocols or promote their statuses.

## Exact files changed

- `docs/YUTA_WORKFLOW_V3.md`: concise human-facing explanation of conditional Design.
- `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`: applicability, persisted omission, resume, raw status, and bounded finalization interpretation.
- `.agents/skills/yuta-run-change/SKILL.md`: controlled Tasks creation, resume checks, and Gate 3 omission evidence.
- `.agents/skills/yuta-finish-change/SKILL.md`: Branch A omission integrity and scoped warning acceptance.
- `docs/reviews/README.md`: Gate 3 packet fields and invalidation triggers.
- `docs/YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md`: this new review evidence.

The worktree already contained unrelated changes. Attribution is against the
pre-task content/hash baseline, not all differences from HEAD. No existing
file was moved or deleted. Branch B and the subsequent completion section of
the finish skill are byte-for-byte unchanged from that baseline.

## Before and after semantics

Previously, conditional Design intent coexisted with static dependency mechanics
without a complete persisted omission/resume contract. The implementation now
requires meaningful Design whenever any approved applicability criterion applies.
Otherwise, the controlled YUTA adapter may create Tasks only when Design is the
sole deliberately omitted dependency and earlier gates/prerequisites are satisfied.

This does not add native OpenSpec conditional dependencies. The static graph is
unchanged. There is no new `skip_design` flag, placeholder Design, artifact,
schema override, or per-change dependency modification. Sensitive Design Gate
classification remains independent; omission cannot waive a required gate.
`skip_specs: true` does not decide Design applicability.

## Omission evidence format

The detailed protocol defines this bounded block in the existing `tasks.md`:

```text
DESIGN APPLICABILITY
Status: NOT_APPLICABLE
Reason: <bounded rationale for this approved scope>
Applicability criteria checked:
- architecture / cross-cutting impact: <finding>
- data/runtime ownership: <finding>
- security/authorization: <finding>
- migration/destructive data: <finding>
- significant dependency/provider: <finding>
- significant performance/operational complexity: <finding>
- unresolved technical decision: <finding>
Authority / evidence: <exact sources and approved scope/spec references>
Expected artifact state: design.md intentionally absent
```

Each criterion requires a finding. Gate 3 exposes the rationale, exact evidence
sources, Tasks path/SHA-256, and resolved expected-absent Design path. This is
reviewable planning evidence, not an implementation checkbox or human approval.

## Skill behavior changes

Run-change evaluates current scope and Design criteria. First-time justified
omission is persisted while creating Tasks; Continue is not an implicit bypass.
Resume/adoption requires existing valid evidence and re-evaluation against current
approved scope/specs. Missing, drifted, invalidated, or no-longer-valid evidence
stops at the appropriate planning/review point, without silent backfill.

Gate 3 binds the omission through the Tasks hash and expected Design absence.
Adding Design or changing applicability, rationale, or reviewed Tasks evidence
invokes normal review invalidation. Ordinary task checkbox progress does not
authorize alteration of the omission evidence.

Finish Branch A independently checks the block, scope, Tasks hash, expected
absence, and Gate 3 exposure before approval/sync/archive. Only the warning
attributable to this exact reviewed omission can be accepted, with its text,
evidence/path/hash, current-user authorization, and bounded acceptance recorded.
Unrelated incompleteness still stops. Historical acceptance is not reusable.
Branch B remains the isolated archived Knowledge Review route.

## Regression matrix

Disposable fixtures used installed OpenSpec 1.11.0 and copies of the unchanged
project schema/config. CLI cases are actual local commands outside the repository.
Instruction cases are independent forward review of the updated skills against
concrete synthetic fixtures, not full autonomous execution or real approvals.

| Case | Fixture                                 | RAW OPENSPEC STATUS / executable evidence                                                                                          | YUTA OPERATIONAL READINESS / instruction result                                                                                                                         |
| ---- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | Spec-bearing, applicable Design         | Design done; Tasks ready before creation, done afterward; planning complete; Apply ready                                           | Normal Design and human gates remain required. PASS.                                                                                                                    |
| B    | Spec-bearing, omitted Design            | Tasks initially blocked; Tasks instructions retrievable; after creation Tasks done, Design ready, planning incomplete, Apply ready | Only persisted justified omission plus prior prerequisites permits this adapter path. PASS.                                                                             |
| C    | Resume valid omission                   | Concrete Tasks block, sources, no-spec metadata, and matching hash inspected                                                       | Omission boundary passes; pending Gate 3 still stops for human review. PASS.                                                                                            |
| D    | Resume without evidence                 | Missing block despite matching Tasks hashes                                                                                        | Stop; do not infer omission or silently backfill. PASS.                                                                                                                 |
| E    | Scope now requires migration            | Old omission block conflicts with changed destructive-migration scope                                                              | Stop and revisit Design/sensitive review and affected approvals. PASS.                                                                                                  |
| F    | Finish/archive valid omission           | Strict validation and actual temporary CLI archive succeeded after task completion and synthetic integrity checks                  | Demonstrates archive mechanics only; Branch A still requires real current approval, all integrity/QA checks, and applicable sync authorization. PASS within this limit. |
| G    | Finish without evidence                 | Missing block despite matching hashes and simulated final authorization                                                            | Stop before approval, sync, or archive. PASS.                                                                                                                           |
| H    | No-spec, applicable Design              | Specs skipped; Design done; planning complete; Apply ready                                                                         | Design remains independently required. PASS.                                                                                                                            |
| I    | No-spec, omitted Design                 | Specs skipped; Tasks initially blocked, then done; Design ready; planning incomplete; Apply ready                                  | Independent justified omission required; no automatic Design skip. PASS.                                                                                                |
| J    | Gate 3 omission evidence changed        | Actual rationale edit changes Tasks SHA-256 from reviewed value                                                                    | Invalidate Gate 3. Later Design addition is also an explicit instruction-level invalidation trigger. PASS.                                                              |
| K    | Archived Branch B, implementation drift | Synthetic valid knowledge-target/diff approval facts with old implementation drift                                                 | Knowledge-only checks; do not rerun active-change integrity, Gate 3, sync, or archive. PASS.                                                                            |

The temporary F command used CLI archive's spec update behavior inside its
synthetic root; it was not an end-to-end test of YUTA's sync-before-archive
authorization sequence. No repository change was synced or archived.
Forward-review fixtures do not contain complete real approval packets or phase
contracts and therefore do not prove whole-change Apply/Gate 3 readiness.

Temporary evidence is retained at
`C:/Users/Tam/AppData/Local/Temp/yuta-design-smoke-d867a84119ee4866907702ed7f52bca1/`:
`smoke.mjs`, `scenarios.mjs`, `results.json`, and scenario fixtures.
The reviewed valid Tasks SHA-256 was
`e1e436a16288b076c25fd19827a06e972c524eebe6a79526842d7c35ef0d0209`;
the changed-rationale fixture produced
`31afc65f8cd16ccc151826392f1129709c4d869a29ae7e1d1e3c568e24985101`.
These are disposable fixture hashes, not live approval evidence.

## Raw status and warning interpretation

Raw Design remains `ready`, not `skipped`, when intentionally absent. Once Tasks
exists, the tested CLI reports Tasks `done` and Apply `ready`, while
`isPlanningComplete` remains false. These states do not grant YUTA approval.

The generated archive skill requires checking artifact completion and warning
about incomplete artifacts. The actual temporary CLI archive JSON returned
success without a warning field. Therefore an incomplete-artifact warning is
not guaranteed to be emitted by the raw archive command itself. The updated
YUTA instructions explicitly distinguish status from operational readiness and
require scoped acceptance of any warning encountered; they do not invent warning
output or claim native omission support.

## Validation and safety

- Targeted Prettier formatting/check: PASS for the six changed Markdown files.
- `pnpm docs:check`: PASS.
- `pnpm architecture:check`: PASS.
- `pnpm -r --if-present typecheck`: PASS.
- `openspec schema validate yuta-spec-driven`: PASS.
- Disposable CLI smoke cases and independent instruction cases above: PASS within stated limits.
- YAML frontmatter parsing/name/description checks for both edited skills: PASS.
- Skill-creator `quick_validate.py`: attempted but could not run because PyYAML is absent from both available Python environments; not reported as passed.
- `git diff --check`: PASS.

Schema/config and generated `openspec-*` skills remain unchanged. The static
Design/Tasks dependency remains intact, and no executable `skip_design` support
was introduced. Product code, Product Knowledge, lifecycle, ADRs, and normative
specs were not modified by this task. No protocol status was promoted. Full
product tests/builds and repository-wide formatting were not run for this bounded
instruction/documentation change; formatting was targeted as requested.

## Unresolved items

No unresolved semantic contradiction was identified in the updated omission
contract. Raw planning completeness remains an intentional limitation of this
controlled adapter model, not a schema fix. The optional skill-validator run
remains unavailable until PyYAML is supplied; actual skill execution still depends
on the agent faithfully following the reviewed instructions, not a new hard-coded
CLI enforcement layer. Human review was pending at the original report stage;
the final approval and non-blocking validator disposition are recorded above.

## Historical recommendation

READY_FOR_HUMAN_REVIEW

Final human review result: APPROVED
