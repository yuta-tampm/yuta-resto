# YUTA Workflow v3 — Final Supporting Protocol Approval Review

Status: APPROVED

Reviewed: 2026-09-03

## Final human approval

Final human approval result: APPROVED

Approval source: explicit current-user instruction, recorded 2026-09-03.

The human approved the exact reviewed versions of all four protocols listed
under Per-document review. Their pre-finalization SHA-256 values were rechecked
and matched those recorded below. The authorized finalization changes only
`Status: Proposed` to `Status: APPROVED` in each protocol; all routing notes and
other content are preserved. The historical hashes identify the approved
pre-status-change bytes, not the resulting metadata-updated files.

Final protocol statuses:

- `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`: APPROVED
- `docs/YUTA_QA_PROTOCOL.md`: APPROVED
- `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`: APPROVED
- `docs/reviews/README.md`: APPROVED

The sections below retain the original readiness review, findings, validation,
and recommendation as historical evidence. References to Proposed status or
pending human approval describe that earlier review stage; this final approval
record supersedes only those status statements. This approval does not authorize
a product-change sync/archive, deployment, or lifecycle promotion.

## Executive summary

All four current supporting protocols are ready for explicit human approval.
Their `Status: Proposed` metadata remains unchanged. This is a fresh review of
the exact bytes identified below, not a carry-forward of the earlier protocol
review or an approval inferred from passing checks.

The current user explicitly approved `MODEL_B_DESIGN_CONDITIONAL` and the
recorded Conditional Design implementation. Part A records those decisions in
the two existing evidence documents without changing implementation. The missing
optional Python validator result is accepted as non-blocking; its PyYAML
limitation remains validation history and no dependency was installed.

## Review basis and boundaries

Read the current canonical [Workflow guide](../../YUTA_WORKFLOW_V3.md), the approved
[Design decision](YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md), and the
approved [implementation review](YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md).
Compared all four protocols with the current
[run skill](../../../.agents/skills/yuta-run-change/SKILL.md),
[finish skill](../../../.agents/skills/yuta-finish-change/SKILL.md),
[config](../../../openspec/config.yaml),
[schema](../../../openspec/schemas/yuta-spec-driven/schema.yaml), and its five artifact
templates. Also checked relevant authority/lifecycle/normativity rules in
`AUTHORITY_MODEL.md`, `LIFECYCLE_STATUS_MODEL.md`, and
`OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`, plus the generated Propose omission
and Archive warning instructions.

This is a semantic/source review, not a new live product-change execution.
The approved implementation report's disposable CLI and instruction tests remain
historical test evidence with their stated limits. No sync, archive, deployment,
new smoke fixture, or implementation change was performed in this task.

SHA-256 values below identify exact on-disk bytes, including line endings, as
read in this worktree. The four files were not formatted or edited. Any later
byte change requires a fresh integrity comparison and review of the affected
content before approval; these recommendations do not transfer to revised bytes.

## Per-document review

### docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md

Current status: Proposed

SHA-256:
`cc8f7d2ef51600afc97a09bff82377f8d3c99df55c3332295d5bc6de97664b26`

Semantic alignment: ALIGNED.

- End-to-end workflow, Gates and adoption: correct earliest-gate resumption,
  Gate 1/2 ordering, conditional sensitive review, and no later-artifact bypass.
- Conditional Design and persisted omission: all seven applicability findings,
  exact scope/source evidence, bounded Tasks block, expected Design absence,
  fresh creation versus resume, and no silent backfill are explicit.
- Gate 3 binds omission to Tasks hash and expected absence. Design addition or
  reviewed rationale/applicability/evidence drift invalidates review.
- Static graph readiness is distinguished from YUTA readiness. No native skip,
  placeholder, or relaxed unrelated prerequisite is claimed. The Branch A
  warning exception is specific to reviewed omission and not reusable generally.
- Tasks, VERIFY, QA, finalization, knowledge, and release sections agree with
  the skills and specialized protocols, including non-UI compliance/VERIFY/QA.

Remaining findings: no contradiction or missing required rule identified.
The broad hash-integrity paragraph is scoped by the explicit Finish-change
branch-isolation subsection: it does not impose active-change hashes on Branch B.
The overview's sync sequence is likewise qualified by the valid no-spec branch.
These are safe summary/detail relationships, not new exceptions.

Required correction: none.

Recommendation: READY_FOR_APPROVAL

### docs/YUTA_QA_PROTOCOL.md

Current status: Proposed

SHA-256:
`1aa25fec503416540bc4db587c6ccb6ec054534a37bf8640864cf49c23878982`

Semantic alignment: ALIGNED.

- VERIFY is technical correctness; QA is applicable user/runtime correctness.
  Backend/database correctness is not forced into meaningless Browser QA.
- UI impact makes Browser QA mandatory on the real/local route with preserved
  authorization, tenancy, persistence, and runtime boundaries, not substitute fixtures.
- Required states, accessibility, responsive coverage, page-pack precedence,
  default desktop/mobile sizes, and applicable intermediate coverage are explicit.
- Actual-session screenshots have path, viewport, role/state, scenario, and
  lowercase SHA-256; Gate 3 hashes the report, manifest, and images.
- Non-UI Gate 3 explicitly requires Technical Implementation Compliance PASS
  and VERIFY PASS plus applicable QA PASS, or truthful NOT_APPLICABLE only when
  no user/runtime QA dimension exists. FAIL and environment blockage do not pass.
- Environment recovery is bounded and truthful; Design omission does not waive
  technical compliance, required QA, or permission to add testing dependencies.

Remaining findings: no contradiction or missing required rule identified.
References to approved Specs/Design describe applicable technical context; the
canonical conditional-Design policy does not require fabricating either artifact.
Omission mechanics appropriately remain in the automation/review rules.

Required correction: none.

Recommendation: READY_FOR_APPROVAL

### docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md

Current status: Proposed

SHA-256:
`3c7d65f6487f0a9bf0206ad67b67aa06ee8eb22b4a17dcfe3d76864894dc5156`

Semantic alignment: ALIGNED.

- Archive leads to a bounded knowledge scan, not automatic DONE or a mandatory
  rewrite. NO_UPDATE_REQUIRED records reasons/sources; UPDATE_REQUIRED stops
  before canonical edits with an exact-diff review packet.
- Branch B requires approved Gate 3, recorded successful finish/archive,
  AWAITING_KNOWLEDGE_REVIEW, no active change, the recorded archive, an awaiting
  Knowledge Review packet, and separate current-user approval of that exact diff.
- Its integrity boundary is only knowledge target paths/hashes and proposed-diff
  hash plus that approval. It does not rerun active-change integrity, Gate 3,
  sync, archive, or Design-omission checks.
- Drift invalidates the knowledge packet; only the approved diff is applied,
  then validation, post-apply hashes, and completion are recorded.
- Product decisions, durable boundaries, ownership/permissions/APIs, lifecycle,
  normative specs, and unresolved authority retain their separate approval rules.
  Release/deploy remains separate from repository DONE.

Remaining findings: no contradiction or missing required rule identified.
Conditional Design requires no additional post-archive checks; adding them would
violate Branch B isolation rather than improve alignment.

Required correction: none.

Recommendation: READY_FOR_APPROVAL

### docs/reviews/README.md

Current status: Proposed

SHA-256:
`e66becad1f8f9cfffca101e5298a4d41e5f01e3a43869ee7a21d33d76fb8e62f`

Semantic alignment: ALIGNED.

- Packet order/names remain 01 Analysis, 02 Specs except valid no-spec, 02b
  sensitive Design when required, applicable QA, 03 Final, and conditional
  post-archive 04 Knowledge. No empty pre-created packets are permitted.
- Bounded current-user approval, exact path sets/hashes, all four review
  statuses, and addition/removal/rename/byte-drift invalidation agree with skills.
- Gate 3 exposes phase contracts, Technical Compliance Matrix source/hash,
  separate technical VERIFY and QA, implementation attribution, and pending sync
  authorization. UI and non-UI readiness rules are both explicit.
- Deliberate Design omission includes classification, rationale/sources,
  Tasks path/hash/block, expected absence, invalidation, and scoped warning handling.
- QA evidence, exact Knowledge Review diff/target hashes, and retention after
  archive preserve provenance without promoting product or lifecycle authority.

Remaining findings: no contradiction or missing required rule identified.
The README routes specialized execution details to their owning protocols and
skills; it need not duplicate all Branch B entry checks to preserve them.

Required correction: none.

Recommendation: READY_FOR_APPROVAL

## Cross-document consistency matrix

Section references identify the rules reviewed, rather than imply every
specialized protocol must repeat every workflow rule.

| Rule                                       | Current evidence                                                                                                                   | Result                                                                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Gate ordering / Gate 1 / Gate 2 / Gate 3   | Guide sections 3, 5, 7; automation Gates and adoption; run States 0–3 and 8; reviews Packet sequence                               | ALIGNED: explicit earliest applicable human gate, no artifact-existence bypass.                                                        |
| Conditional Design                         | Guide section 3; approved decision/model and implementation; automation Conditional Design; run State 3; schema Design instruction | ALIGNED: meaningful Design when applicable, controlled omission otherwise, no native conditional dependency claim.                     |
| Persisted omission                         | Automation DESIGN APPLICABILITY block; run States 3–4; implementation evidence format                                              | ALIGNED: bounded reason, seven findings, exact sources, intentional absence in existing Tasks.                                         |
| Resume behavior                            | Automation Adoption/Conditional Design; run State 0/3                                                                              | ALIGNED: preserve existing bytes, re-evaluate current approved scope/specs, stop missing/invalid/drifted evidence.                     |
| Gate 3 omission integrity                  | Reviews Gate 3 content; run State 8; finish Branch A Design omission integrity                                                     | ALIGNED: Tasks SHA-256 plus resolved expected absence; addition/rationale/scope/evidence changes invalidate.                           |
| skip_specs interaction                     | Guide section 15; automation Conditional Design; run States 1–3; finish No-spec path; schema proposal/specs                        | ALIGNED: no Gate 2 or normative promotion on valid no-spec; Design assessed independently.                                             |
| Sensitive Design Gate                      | Guide sections 3/7; automation sensitive gate; run State 3                                                                         | ALIGNED: independently conditional; omission never bypasses required sensitive review.                                                 |
| Technical Implementation Contract          | Guide section 8; automation Tasks; run States 4–5; finish precondition 8                                                           | ALIGNED: embedded in each used phase, owners/authorities/checks/evidence, unresolved constraints stop Apply.                           |
| VERIFY / QA separation                     | Guide section 9; automation VERIFY/QA; QA Purpose; run States 6–7; reviews Gate 3                                                  | ALIGNED: technical matching never substitutes for user/runtime QA.                                                                     |
| Technical Compliance Matrix                | Guide section 9; automation VERIFY; run State 6/8; finish integrity; reviews Gate 3                                                | ALIGNED: every applicable contract row traceable and PASS; source/hash bound.                                                          |
| Non-UI QA                                  | Guide section 10; automation Gate 3; QA Gate 3 integration; reviews Gate 3; run State 8                                            | ALIGNED: compliance and VERIFY PASS plus applicable QA PASS or truthful no-dimension NOT_APPLICABLE.                                   |
| Browser QA / screenshots                   | Guide section 10; automation QA; QA Browser QA/Evidence; run State 7; reviews QA evidence; finish precondition 8                   | ALIGNED: real route, applicable states/viewports, actual screenshots and intact report/manifest/image hashes.                          |
| QA status / environment block              | QA Classification/Failure handling; automation QA/Gate 3; run State 7/8; reviews QA/Gate 3                                         | ALIGNED: PASS, FAIL, BLOCKED_BY_ENVIRONMENT, NOT_APPLICABLE; no blocked/failed ready packet.                                           |
| Gate 3 readiness                           | Guide section 10; automation Gate 3; QA integration; reviews Gate 3; run State 8; finish precondition 8                            | ALIGNED: technical compliance + VERIFY + permitted QA and complete current evidence; recommendation is not authorization.              |
| Sync/archive authorization                 | Guide section 11/13; automation Sync; finish Required input/Branch A; normativity policy sections 4–7                              | ALIGNED: current explicit bounded approval and authorization, selected deltas, exact diff review and strict validation before archive. |
| Branch A omission warning                  | Automation Conditional Design; reviews Gate 3; finish Branch A/Archive; approved implementation Raw status                         | ALIGNED: only reviewed omission warning is boundedly acceptable; unrelated incomplete work blocks.                                     |
| Branch B                                   | Automation branch isolation; Knowledge Approved knowledge update; finish Branch B; guide section 13                                | ALIGNED: archive-only knowledge review, fresh knowledge approval, target/diff integrity only, no active re-finalization.               |
| Knowledge Consolidation / Archive not DONE | Guide section 14; automation Knowledge; Knowledge scan/update paths; finish post-archive/Branch B                                  | ALIGNED: no-update evidence or approved exact update before closure; pending review is not DONE.                                       |
| Packet retention                           | Reviews Packet sequence/Retention; run packet creation; finish archive/completion                                                  | ALIGNED: gate and QA evidence survives as provenance, not independent Product/normative authority.                                     |
| Release separation                         | Guide section 16; automation Release; Knowledge Operational separation; finish Completion; lifecycle model                         | ALIGNED: release follow-up classification, no automatic deployment or lifecycle promotion.                                             |

## Accepted limitations and remaining decisions

Raw schema dependencies remain `design.requires = [analysis, specs]`,
`tasks.requires = [specs, design]`, and `apply.requires = [tasks]`. Omitted Design
can remain raw-ready and planning incomplete even when adapter-created Tasks
exists. That limitation is explicitly approved, not an unresolved protocol defect.
Generated adapter mechanics are not authority to cross YUTA human gates or waive
unrelated missing work. The historical archive JSON did not guarantee a warning;
current instructions handle actual warnings without fabricating their output.

No remaining correction or semantic decision is required for these four reviewed
versions. The outstanding human action is explicit approval of their exact bytes
and a separately authorized status update. Approval of the Design evidence alone
does not perform that action.

## Validation and change scope

Part A changed only the two Design evidence documents' final approval/status and
historical framing. Part B created this review. No guide, protocol, skill,
schema/config, Product Knowledge, lifecycle, ADR, normative spec, or product code
was changed. Existing unrelated work was preserved against a pre-task hash baseline.

- Targeted Prettier formatting/check on these three evidence files: PASS.
- `pnpm docs:check`: PASS.
- `pnpm architecture:check`: PASS.
- `git diff --check`: PASS.
- `pnpm -r --if-present typecheck`: PASS (additional root-instruction check).
- Optional `quick_validate.py`: not rerun; historical PyYAML unavailability
  explicitly accepted as non-blocking by the human. No dependencies installed.
- Product tests/builds and repository-wide formatting: not run for this
  evidence-only review; no product implementation changed.

## Historical recommendation

- `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` → READY_FOR_APPROVAL
- `docs/YUTA_QA_PROTOCOL.md` → READY_FOR_APPROVAL
- `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md` → READY_FOR_APPROVAL
- `docs/reviews/README.md` → READY_FOR_APPROVAL

ALL_PROTOCOLS_READY_FOR_HUMAN_APPROVAL

Final human approval result: APPROVED
