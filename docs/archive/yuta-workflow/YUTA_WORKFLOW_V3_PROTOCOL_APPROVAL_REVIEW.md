# YUTA Workflow v3 — Supporting Protocol Approval Review

Status: PROPOSED FOR HUMAN REVIEW

## Executive summary

Three proposed supporting documents are semantically compatible with the
approved YUTA Workflow v3 model but need one narrow documentation-only
correction each. The automation protocol is not approval-ready because the
authorities it must describe disagree on whether `design.md` is an optional
artifact. Resolving that discrepancy requires an explicit workflow/executable
mechanics decision; this review does not make it.

The review compared the exact current bytes of the four documents with the
approved guide and update report, the Authority and Lifecycle models, the
approved OpenSpec normativity policy, both executable YUTA skills, and the
active `yuta-spec-driven` config, artifact graph, instructions, and templates.
The source-document baselines reviewed were:

| Document                                        | SHA-256                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`        | `6666ac92367ad70e9e1e45278df41ae37f2d04ea06ba8c2f83c1840453849960` |
| `docs/YUTA_QA_PROTOCOL.md`                      | `9338b52097f2b5092b22330c3130db7e64ac632d1c0fc59795384dbc5c51cf3a` |
| `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md` | `c5105d8529b62d60f0183a9b3534f5f192a1d6372c84a3dcfff1655a97e3706b` |
| `docs/reviews/README.md`                        | `734f9048d87cc5c97426a43a8422cce51f6b2566ab7d1ce1076dc083af188eaf` |

The classifications below use only `ALIGNED`, `STALE_WORDING`,
`CONTRADICTION`, `MISSING_REQUIRED_RULE`, `DUPLICATED_BUT_SAFE`, and
`NEEDS_HUMAN_DECISION`.

## Per-document review

### YUTA_AUTOMATED_CHANGE_WORKFLOW.md

Current status: `Proposed`

Alignment: Apart from Design artifact optionality, the detailed state sequence,
earliest-gate adoption/resume behavior, bounded SHA-256 invalidation,
`skip_specs` path, phase-level Technical Implementation Contract, VERIFY/QA
separation, Technical Compliance Matrix, Gate 3 readiness, finalization
authorization, selected-delta sync, validation, archive, Branch A/Branch B
isolation, Knowledge Consolidation, and release separation align with the
approved guide, skills, policy, and OpenSpec mechanics.

Findings:

- `CONTRADICTION` — the approved guide says `Design [when applicable]`; the
  schema's design instruction and the run skill say not to create ceremonial
  Design when its criteria do not apply. However, the active schema graph makes
  `design` depend on `specs`, makes `tasks` depend on both `specs` and `design`,
  and makes Apply depend on `tasks`. OpenSpec's dependency mechanics therefore
  cannot mark `tasks` ready without a completed `design` artifact. The
  automation overview's unqualified `-> DESIGN` agrees with the graph but not
  with the approved guide and run-skill rule.
- `NEEDS_HUMAN_DECISION` — YUTA must decide which behavior is authoritative:
  make optional Design executable in the artifact/dependency mechanics, or
  require a Design artifact universally and revise the approved human and
  skill rules through their own authority process. Merely adding
  `[when applicable]` to this protocol would hide, not resolve, the executable
  discrepancy.
- `ALIGNED` — Gate ordering and all conditional gate branches are consistent;
  `skip_specs: true` omits Gate 2 and normative promotion without relaxing
  Tasks, applicable Design, VERIFY, QA, Gate 3, archive, or consolidation.
- `ALIGNED` — active finalization and archived Knowledge Review resume have
  separate preconditions, authorization boundaries, hash scopes, and mutation
  scopes. Archive is followed by consolidation and is not itself `DONE`.
- `DUPLICATED_BUT_SAFE` — summaries of QA, packet integrity, authority safety,
  and release separation intentionally duplicate the specialist protocols and
  approved guide without changing their meaning.

Approval readiness: `NOT_READY_FOR_APPROVAL`

Required correction, if any: No documentation-only correction is sufficient.
After the Design optionality decision is separately approved and implemented in
the controlling sources, align the end-to-end diagram and nearby explanatory
text to that decision. This review does not authorize changes to the guide,
skill, schema, config, or protocol.

### YUTA_QA_PROTOCOL.md

Current status: `Proposed`

Alignment: The protocol correctly separates QA from VERIFY, uses the exact QA
status enum, makes Browser QA mandatory for UI-affecting work, preserves real
authorization/tenancy/persistence boundaries, defines responsive and
role/state coverage, requires actual screenshots and lowercase SHA-256
manifest entries, and keeps `FAIL` and `BLOCKED_BY_ENVIRONMENT` from producing
a ready Gate 3. Its safe bounded recovery and stop behavior matches the run
skill.

Findings:

- `MISSING_REQUIRED_RULE` — the final non-UI Gate 3 sentence requires
  `VERIFY: PASS` and applicable `QA: PASS` or truthful `NOT_APPLICABLE`, but
  omits the universal `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` prerequisite.
  That prerequisite is explicit in the approved guide, update report,
  automation protocol, run skill, finish skill, and review-packet protocol.
- `ALIGNED` — UI-affecting readiness correctly requires Technical
  Implementation Compliance PASS, VERIFY PASS, and QA PASS; missing responsive,
  screenshot-hash, or applicable role/state evidence prevents readiness.
- `ALIGNED` — `BLOCKED_BY_ENVIRONMENT` remains a visible stop after only safe,
  repository-defined recovery; it cannot be normalized into PASS.
- `DUPLICATED_BUT_SAFE` — the VERIFY/QA distinction and Gate 3 summary repeat
  the guide so the standalone QA protocol remains operable.

Approval readiness: `READY_AFTER_DOCUMENTATION_ONLY_CORRECTION`

Required correction, if any: Replace the final non-UI readiness sentence with
wording that requires all three applicable conditions:
`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`, `VERIFY: PASS`, and either
applicable non-browser `QA: PASS` or truthful `QA: NOT_APPLICABLE`. This only
restates the already-active universal Gate 3 rule.

### YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md

Current status: `Proposed`

Alignment: The post-archive scan, exact `NO_UPDATE_REQUIRED` /
`UPDATE_REQUIRED` classification, exact knowledge-diff review, target and diff
hashes, bounded approval, authority safeguards, validation, release separation,
and Archive != `DONE` semantics align with the guide, update report, automation
protocol, and finish skill.

Findings:

- `MISSING_REQUIRED_RULE` — the approved-update section identifies archive-only
  resume, separate Knowledge Review approval, exact target/diff rehashing, and
  no active-change recreation, but does not state the full Branch B entry
  conditions or its negative boundary. It omits the required facts that Gate 3
  is already `APPROVED`, finish/archive is recorded as completed, workflow is
  `AWAITING_KNOWLEDGE_REVIEW`, no active change exists, the recorded archive and
  awaiting packet exist, and Branch B does not rerun Gate 3 approval,
  active-change integrity checks, sync, or archive.
- `ALIGNED` — only the exact approved documentation diff may be applied after
  exact path-set, target-hash, and proposed-diff-hash equality; drift invalidates
  the Knowledge Review packet and stops without editing canonical knowledge.
- `ALIGNED` — authority and lifecycle safeguards prevent automatic Product,
  durable-boundary, ownership/permission/API, lifecycle/readiness, or normative
  spec changes.
- `DUPLICATED_BUT_SAFE` — the scan list and release invariant repeat the finish
  skill and guide to keep this specialist protocol self-contained.

Approval readiness: `READY_AFTER_DOCUMENTATION_ONLY_CORRECTION`

Required correction, if any: Expand the existing approved-update section with
one concise Branch B paragraph listing the entry conditions above and stating
that this branch validates only the Knowledge Review target path set, target
hashes, proposed-diff hash, and current explicit approval. State explicitly
that it does not reopen or rerun Gate 3, active-change integrity, sync, or
archive. Do not change the executable branch behavior.

### docs/reviews/README.md

Current status: `Proposed`

Alignment: Packet ordering and names match the run and finish skills. Gate
packets remain bounded to exact paths, bytes, hashes, and decisions; drift
invalidates approval. QA evidence, screenshot manifests, Gate 3 section
separation, Technical Compliance Matrix provenance, Knowledge Review exact-diff
evidence, and post-archive retention semantics are aligned.

Findings:

- `MISSING_REQUIRED_RULE` — Gate 3 content says every packet needs Technical
  Implementation Compliance PASS and VERIFY PASS and separately states the UI
  QA PASS requirement, but it does not state the corresponding non-UI rule:
  applicable non-browser QA must be PASS, or QA may be `NOT_APPLICABLE` only
  when no user/runtime QA dimension exists.
- `ALIGNED` — packet sequence is `01-analysis-review.md`, conditional
  `02-specs-review.md`, conditional `02b-design-review.md`, applicable `qa/`,
  `03-final-review.md`, and conditional post-archive
  `04-knowledge-consolidation-review.md`.
- `ALIGNED` — the QA report, manifest, and screenshot bytes are linked and
  hashed; `FAIL`, `BLOCKED_BY_ENVIRONMENT`, or missing required responsive or
  screenshot evidence prevents ready Gate 3.
- `ALIGNED` — retained packets are provenance, not Product Knowledge,
  lifecycle, normative, implementation, deployment, or readiness authority.
- `DUPLICATED_BUT_SAFE` — packet status and authority reminders repeat the
  skills intentionally and safely.

Approval readiness: `READY_AFTER_DOCUMENTATION_ONLY_CORRECTION`

Required correction, if any: In Gate 3 content, add one sentence stating that a
non-UI packet additionally requires `QA: PASS` for an applicable non-browser
plan or truthful `QA: NOT_APPLICABLE` when no user/runtime QA dimension exists,
and that `FAIL` or `BLOCKED_BY_ENVIRONMENT` is never ready. Do not change packet
names, ordering, fields, hashes, or retention.

## Cross-document consistency matrix

`N/A (scope)` means that the specialist document correctly delegates or does
not own that rule; it is not a missing rule.

| Rule                              | Workflow guide     | Automation            | QA                    | Knowledge              | Reviews README          | Skills                               | Result                  |
| --------------------------------- | ------------------ | --------------------- | --------------------- | ---------------------- | ----------------------- | ------------------------------------ | ----------------------- |
| Gate order                        | Design conditional | Design unqualified    | N/A (scope)           | Post-archive only      | Packet order            | Skill conditional; graph requires it | `CONTRADICTION`         |
| Gate 1                            | Full               | Full                  | N/A (scope)           | N/A (scope)            | Packet/hash behavior    | Run skill full                       | `ALIGNED`               |
| Gate 2                            | Conditional        | Conditional           | N/A (scope)           | N/A (scope)            | Conditional packet      | Run skill conditional                | `ALIGNED`               |
| Gate 3                            | Full               | Full                  | Readiness integration | Completion evidence    | Full packet contract    | Both skills                          | `ALIGNED`               |
| Sensitive Design Gate             | Conditional        | Conditional           | Earlier-gate return   | Authority safeguard    | Conditional packet      | Run skill conditional                | `ALIGNED`               |
| `skip_specs`                      | Full               | Full                  | Rules still apply     | Post-archive applies   | Gate 2 omitted          | Both skills + schema/CLI             | `ALIGNED`               |
| Technical Implementation Contract | Full               | Full                  | VERIFY-owned boundary | N/A (scope)            | Phase contract source   | Run and finish skills                | `ALIGNED`               |
| VERIFY                            | Separate           | Separate              | Separate              | N/A (scope)            | Separate section        | Run/finish checks                    | `ALIGNED`               |
| Technical Compliance Matrix       | Required           | Required              | Referenced by result  | N/A (scope)            | Source/hash required    | Run/finish integrity                 | `ALIGNED`               |
| `UI_AFFECTING`                    | Full               | Exact field           | Exact field           | N/A (scope)            | Exact field             | Run skill exact field                | `ALIGNED`               |
| Browser QA                        | UI mandatory       | UI mandatory          | Detailed              | N/A (scope)            | Required evidence       | Run/finish enforced                  | `ALIGNED`               |
| Non-UI QA                         | PASS or N/A        | PASS or N/A           | Compliance omitted    | N/A (scope)            | PASS/N/A rule omitted   | Run/finish enforced                  | `MISSING_REQUIRED_RULE` |
| QA status enum                    | Exact four         | Exact four            | Exact four            | N/A (scope)            | Delegates to QA         | Run skill exact four                 | `ALIGNED`               |
| Screenshot hashes                 | Required for UI    | Required for UI       | Detailed              | N/A (scope)            | Detailed                | Run/finish enforced                  | `ALIGNED`               |
| Gate 3 readiness                  | Three-part         | Three-part            | Non-UI omission       | N/A (scope)            | Non-UI omission         | Run/finish three-part                | `MISSING_REQUIRED_RULE` |
| Sync authorization                | Explicit           | Explicit              | N/A (scope)           | Historical in Branch B | `PENDING` field         | Finish skill explicit                | `ALIGNED`               |
| Normative promotion               | Gated sync         | Gated sync            | N/A (scope)           | Prohibited             | Not packet authority    | Finish + OpenSpec policy             | `ALIGNED`               |
| Archive                           | Before KC          | Synchronous before KC | N/A (scope)           | Starting condition     | Retention after archive | Finish skill owns                    | `ALIGNED`               |
| Knowledge Consolidation           | Required           | Required              | N/A (scope)           | Detailed               | Conditional packet      | Finish skill owns                    | `ALIGNED`               |
| Branch A                          | Full               | Full                  | N/A (scope)           | Receives archive       | Gate 3 evidence         | Finish skill full                    | `ALIGNED`               |
| Branch B                          | Core boundary      | Full                  | N/A (scope)           | Partial boundary       | Exact packet evidence   | Finish skill full                    | `MISSING_REQUIRED_RULE` |
| Release separation                | Separate lane      | Separate lane         | Not readiness         | Separate lane          | Not release evidence    | Both skills separate                 | `ALIGNED`               |

## Human decisions required

- Resolve Design artifact optionality between the approved guide/run-skill rule
  and the active OpenSpec dependency graph. This is a workflow/executable
  mechanics decision and is outside this review's mutation scope.
- Authorize or reject the three exact documentation-only corrections listed for
  the QA, Knowledge Consolidation, and review-packet protocols.
- After corrected bytes and validation evidence are available, explicitly
  approve or decline each eligible protocol's status change in a separate task.

## Validation

| Check                                         | Result |
| --------------------------------------------- | ------ |
| Targeted formatting of this review report     | PASS   |
| `pnpm docs:check`                             | PASS   |
| `pnpm architecture:check`                     | PASS   |
| `git diff --check`                            | PASS   |
| Supplemental `pnpm -r --if-present typecheck` | PASS   |

## Recommendation

`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`
→ `NOT_READY_FOR_APPROVAL`

`docs/YUTA_QA_PROTOCOL.md`
→ `READY_AFTER_DOCUMENTATION_ONLY_CORRECTION`

`docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`
→ `READY_AFTER_DOCUMENTATION_ONLY_CORRECTION`

`docs/reviews/README.md`
→ `READY_AFTER_DOCUMENTATION_ONLY_CORRECTION`

Overall recommendation: `PROTOCOL_SEMANTIC_REVIEW_REQUIRED`
