# YUTA Workflow v3 — Design Artifact Decision Review

Status: APPROVED

## Final human decision

Human decision: MODEL_B_DESIGN_CONDITIONAL

Approval source: explicit current-user instruction, recorded 2026-09-03.

The human approved the conditional-Design model and its implementation recorded
in [the implementation review](YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md).
The analysis and proposed-work sections below retain the original decision-time
history; they are not outstanding implementation requests. This approval does
not approve the four supporting protocol statuses, authorize a product-change
sync/archive, or promote lifecycle values.

## Current contradiction

The approved human guide says `Design [when applicable]`, and the current
run skill avoids ceremonial Design. The raw OpenSpec artifact graph instead
uses static dependencies:

```text
design.requires = [analysis, specs]
tasks.requires = [specs, design]
apply.requires = [tasks]
```

Consequently, raw graph readiness does not natively support an absent Design:
before Tasks exists, missing Design leaves Tasks blocked. However, YUTA already
has an approved conditional-Design adapter policy. When the artifact's own
applicability criteria do not apply, the adapter may record a deliberate
omission and create Tasks if that omission is its only missing prerequisite.

OpenSpec does not persist a native Design-skip state. Tasks can subsequently
be reported as done and Apply can proceed, while Design remains ready and
planning remains incomplete. Archive handling must distinguish that reviewed
omission from genuinely missing required work and explicitly handle warnings.

The earlier supporting-protocol approval review was too broad in presenting
mandatory Design or schema change as the only resolutions. The completed A2.2
analysis identified the already-approved adapter policy. The unresolved issue
is consistent omission evidence through run, resume, review, and finalization,
not whether such a policy exists. Neither earlier report is rewritten here.

## Current executable evidence

This report persists the immediately preceding A2.2 investigation. It does not
claim a new end-to-end smoke test or a new product-change execution.

### Native OpenSpec behavior

- [Current schema](../../../openspec/schemas/yuta-spec-driven/schema.yaml), Design
  and Tasks definitions: the dependency arrays above are static; the Design
  instruction separately says to create the artifact only when its criteria
  apply. The [config](../../../openspec/config.yaml) selects `yuta-spec-driven` and
  supplies artifact-language context, not conditional dependency logic.
- Installed OpenSpec reported version `1.11.0`. Its local source root was
  `C:/Users/Tam/AppData/Roaming/npm/node_modules/@fission-ai/openspec/dist/`.
  Source references below are relative to that installation, not portable
  repository dependencies.
- `core/artifact-graph/graph.js`, `getNextArtifacts` at lines 122–136:
  readiness requires every `requires` entry to be in the completed set.
  `isComplete` at lines 140–147 requires every artifact to be completed.
- `core/artifact-graph/state.js`, `detectCompleted`: completion is detected
  from generated-file existence, not semantic adequacy.
- `core/artifact-graph/instruction-loader.js`, `loadChangeContext` at lines
  88–100: `skip_specs` satisfies missing artifacts whose generated paths are
  under `specs/`. It does not skip `design.md`. `formatChangeStatus` reports
  existing artifacts as done before considering readiness and reports
  `isPlanningComplete` from whole-graph completion.
- `commands/workflow/instructions.js`, `instructionsCommand`: blocked
  dependencies do not prevent returning an artifact's instructions.
  `generateApplyInstructions` at lines 253–268 checks direct `apply.requires`
  output existence. Under this schema that is Tasks, not its transitive
  dependency closure. Task presence alone is therefore not YUTA approval or
  proof of complete planning.
- `core/artifact-graph/types.js` defines static dependency arrays, without a
  native conditional-dependency field. `core/change-metadata/schema.js`
  provides `skip_specs`, not a supported `skip_design` or generic artifact-skip
  state.

The preceding investigation executed the installed `ArtifactGraph` in memory
against the current repository schema, without creating files:

| Completed set                     | Next ready | Tasks condition                       | Planning complete |
| --------------------------------- | ---------- | ------------------------------------- | ----------------- |
| Proposal, Analysis, Specs         | Design     | Blocked by Design                     | No                |
| Proposal, Analysis, Specs, Design | Tasks      | Ready                                 | No                |
| Proposal, Analysis, Specs, Tasks  | Design     | Already completed in the supplied set | No                |

The last row models an adapter-created Tasks artifact; it does not imply that
the graph made Tasks ready before creation.

### Project-supported adapter behavior

The current [generated Propose skill](../../../.agents/skills/openspec-propose/SKILL.md)
at lines 107–113 permits evaluating an artifact's conditional instruction,
reporting a deliberate skip, and creating a dependent artifact blocked only
by that skip. The Explore adapter has equivalent conditional-capture support.
The Continue adapter does not have that exception.

This adapter rule does not authorize bypassing YUTA Gate 1, Gate 2, a required
Sensitive Design Gate, or unresolved authority decisions. Propose cannot be
used as an unrestricted shortcut around the gated YUTA runner.

### Approved YUTA policy and historical evidence

The [approved activation policy](../../OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md),
sections 3–4 and 9, explicitly adopts controlled conditional omission, records
its reason, avoids Continue when Design does not apply, prohibits placeholders,
and requires review and explicit acceptance/reporting of the archive warning.
It does not claim the CLI persisted a generic skip.

The [historical smoke-test report](OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md),
Test B, records missing Design, initially blocked Tasks, retrievable Tasks
instructions, adapter-created Tasks, Apply readiness, and
`isPlanningComplete: false`. This is historical isolated-test evidence;
current source inspection supports its mechanics, but the test was not rerun
during A2.2.

All nine current archived YUTA changes inspected in A2.2 contain `design.md`.
The smallest is the 97-line
[primary-contact copy Design](../../../openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/design.md),
with meaningful draft, save, permission, test, and rollback decisions. It is
compact relative to the others, not an omission-only or empty placeholder.
The 202-line
[Personnel history Design](../../../openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/design.md)
is substantial, covering persistence, transactions, metadata, and cutover.
No absent-Design completed product change or minimal omission-only Design was
found in that archive set. Do not mistake adapter/test evidence for a completed
product-change precedent.

## Spec-bearing change analysis

Design is required when its approved applicability criteria apply: cross-cutting
or architectural work, new dependencies or significant data changes,
security/performance/migration complexity, or ambiguity requiring technical
decisions before implementation.

When none apply, do not fabricate Design. Record a justified deliberate
omission, allow the approved adapter path to reach Tasks only after all other
prerequisites and human gates are satisfied, and preserve the omission evidence
for resume, finalization, and review. Unresolved applicability is not an
approved omission. A later scope change that makes Design necessary must
return to the appropriate planning/review boundary.

## No-spec path analysis

`skip_specs: true` is a separate declaration that no spec-level behavior changes.
It natively satisfies Specs, not Design. The direct Analysis dependency on
Design remains important on this path.

Docs, tooling, refactor, and other no-behavior changes must not receive fake
Design merely to clear graph readiness. Conversely, no-spec does not mean
no-design: a refactor with meaningful architecture, security, migration, or
other applicable complexity still needs Design. Evaluate both independently.
The controlled omission path preserves the same approval, authority, exact
evidence, and invalidation rules. It never creates normative promotion or
relaxes technical verification and applicable QA.

## Design artifact vs Sensitive Design Gate

```text
Design artifact applicability != Sensitive Design Gate applicability
```

Design provides technical reasoning/context when required. The Sensitive
Design Gate adds human approval when sensitive criteria apply. A Design
artifact does not automatically require a Design Gate. Sensitive work must
not use omission to evade required Design evidence or its human review.

## Candidate models

### MODEL A — Design always required

Require a meaningful Design for every change. This matches static readiness,
makes completion reporting straightforward, and reduces omission-specific
resume logic. It would, however, change current approved intent and artifact
instructions, impose overhead on simple changes, and encourage ceremonial
content. A file's existence still would not prove technical adequacy.

### MODEL B — Design conditional through approved YUTA adapter policy

Retain the static graph and existing applicability criteria. Use the
project-supported controlled adapter exception with reviewable omission
evidence when Design genuinely does not apply. Do not create placeholders or
claim native graph-level conditional support. Accept the known
planning-complete/warning limitation transparently and harden the evidence
needed to resume and finalize safely.

No third model is proposed: removing the dependency would also permit Tasks
before genuinely required Design, and no native generic skip mechanism was
found in the installed version.

## Evaluation matrix

| Criterion                        | MODEL A                                               | MODEL B                                                                             |
| -------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| OpenSpec-native compatibility    | Matches static graph                                  | Adapter-compatible; not native conditional readiness                                |
| Deterministic artifact readiness | Direct graph signal                                   | Graph remains deterministic; operational readiness needs explicit omission evidence |
| Schema complexity                | Same graph; instruction changes                       | No graph/config change                                                              |
| yuta-run-change complexity       | Simpler presence rule; applicability intent changes   | Must persist and revalidate justified omission across resume                        |
| yuta-finish-change integrity     | Ordinary artifact hashes                              | Must bind omission evidence and distinguish warnings from incomplete work           |
| skip_specs compatibility         | Design still universally required                     | Specs skip and Design applicability evaluated separately                            |
| Auditability                     | Review Design bytes; detect boilerplate               | Review exact omission rationale, scope, and approval evidence                       |
| Human cognitive load             | More documents on simple changes                      | Fewer documents; explicit distinction between graph and operational readiness       |
| Ceremonial-artifact risk         | High for simple changes                               | Low when omission is justified                                                      |
| Hidden-decision risk             | Boilerplate may conceal unresolved decisions          | Unsafe if omission is inferred; bounded evidence must prevent this                  |
| Maintenance cost                 | Lower branch complexity; recurring authoring overhead | Moderate adapter/evidence regression maintenance                                    |
| OpenSpec upgrade resilience      | Less dependent on skip conventions                    | Re-audit adapter, status, Apply, and archive behavior on upgrade                    |
| YUTA authority-model consistency | Requires changing approved conditional intent         | Preserves approved policy without weakening human gates                             |

## Recommended model

`MODEL_B_DESIGN_CONDITIONAL`

Retain the already-approved controlled-adapter semantics and harden
run/resume/finalization evidence handling. This is not native OpenSpec
conditional artifact support. Do not describe raw planning completeness, Apply
readiness, or a missing file as sufficient proof of YUTA workflow readiness.

## Exact semantic changes required if approved

The following are proposed future work, not changes implemented by this report.

### Canonical guide

Classification: `CLARIFICATION_ONLY`. `Design [when applicable]` is already
semantically correct. Explain controlled omission, recorded evidence, and the
raw planning-status limitation without rewriting the guide as an adapter.

### Automation protocol

Classification: `CLARIFICATION_REQUIRED`. Mark Design conditional and explain
the approved omission path, distinction from native skip state, required
evidence, and warning handling. Preserve gate ordering and authority rules.

### yuta-run-change skill

Classification: `EVIDENCE_HANDLING_HARDENING_REQUIRED`. Define a durable,
change-scoped omission record in existing planning/review evidence: evaluated
criteria and source, bounded scope, rationale, expected absence of Design, and
applicable approval references. Bind that evidence to exact reviewed bytes.
On resume, recover and revalidate it rather than infer omission from absence
or rely on session memory. Missing/invalidated evidence or changed applicability
must stop progression. Do not introduce a new mandatory artifact or bypass
existing gates; choose the exact record location in the later implementation
review.

### yuta-finish-change skill

Classification: `EVIDENCE_HANDLING_HARDENING_REQUIRED`. Recognize a reviewed,
still-valid omission as distinct from genuinely incomplete planning. Recheck
its scope, evidence hashes, and expected Design absence before active
finalization. Explicitly record and accept only the known conditional-Design
warning under the approved policy and bounded finalization authorization.
Other incomplete artifacts/tasks, ambiguous omission, or changed scope remain
blockers. Never infer blanket warning approval. Preserve Branch B isolation:
archived Knowledge Review resume must not rerun active-finalization checks.

### OpenSpec schema/config

Classification: `NO_CHANGE_REQUIRED`. Retain the static dependencies and the
direct Analysis dependency on Design. Do not invent `skip_design`, remove
Design from Tasks prerequisites, or silently select a different schema.

### artifact instructions/templates

Classification: `VERIFY_ONLY`. Existing Design applicability wording is
consistent with MODEL B. Clarify only if a targeted review finds wording that
incorrectly assumes Design always exists. Do not patch generated skills merely
to change status reporting, or fabricate placeholder templates.

### review packet protocol

Classification: `EVIDENCE_CLARIFICATION_REQUIRED`. Gate 3 must expose the
deliberate omission, rationale, applicability assessment, approval references,
and exact evidence source/hash. Its reviewed path set must represent expected
Design absence; a later Design addition or rationale/scope change must not
silently inherit approval. Existing applicable earlier gates remain binding.

### QA / Knowledge protocols

Classification: `NO_CHANGE_REQUIRED`. No QA requirement or post-archive
Knowledge Consolidation behavior changes. In particular, omission does not
waive Technical Compliance, VERIFY, Browser QA, or Branch B boundaries.

### tests/smoke validation

Classification: `TARGETED_REGRESSION_REQUIRED`. Before implementing or claiming
hardening complete, obtain isolated evidence for:

- Design-applicable path, including required sensitive review;
- deliberate omission with all other dependencies satisfied;
- resume after omission, including missing/drifted rationale and changed scope;
- finish/archive after omission, including explicit warning handling and
  refusal of unrelated incomplete work;
- `skip_specs` with both applicable and omitted Design;
- Gate 3 path/hash invalidation when Design or omission evidence changes;
- preservation of archived Knowledge Review Branch B isolation.

Assert raw status separately from operational readiness; no test may relabel
Design as natively skipped. Use disposable fixtures, not existing product
changes. These regression tests were not executed in this persistence task.

### no-spec behavior

Classification: `PRESERVE_AND_CLARIFY`. Require valid `skip_specs` metadata,
the no-behavior Analysis conclusion, Gate 1 approval, and CLI Specs-skipped
state. Omit Gate 2 and normative promotion only. Independently require Design
or justified omission, retain a sensitive gate when applicable, then Tasks,
VERIFY, QA, Gate 3, authorized archive, and Knowledge Consolidation. Existing
delta specs on a claimed no-spec path remain a conflict.

## Migration / compatibility impact

- **Active changes:** no automatic rewrite or retroactive omission approval.
  Preserve existing Design bytes. If Design is absent, distinguish missing
  work from an evidenced omission and stop when that distinction is unresolved.
- **Archived changes:** retain historical bytes and approvals; do not backfill
  Design or rewrite old evidence. No absent-Design product archive was found in
  the inspected set.
- **Main specs:** no change, sync, or normative promotion is required by this
  decision. Product requirements and lifecycle remain untouched.
- **Review packet hashes:** existing approvals remain bounded to their reviewed
  bytes. Adding omission evidence to a live packet requires the applicable
  re-review/invalidation process; old hashes must not be silently replaced.
- **Generated artifacts:** no regeneration, placeholder creation, schema
  migration, or generated-skill patch. Future OpenSpec upgrades require a
  bounded re-audit of the adapter exception and warning behavior.

## Historical human decision request

Whether YUTA formally retains the existing conditional-Design model using the
approved controlled adapter omission path, and proceeds to harden
run/resume/finalization evidence around that model.

At the original review stage, this report did not record that decision as
approved or authorize implementation, status promotion, sync, archive, or
lifecycle changes. The final decision is recorded above.

## Recommendation

Recommended model: MODEL_B_DESIGN_CONDITIONAL

Historical review status: AWAITING_HUMAN_DECISION

Final human decision: MODEL_B_DESIGN_CONDITIONAL

Final approval status: APPROVED
