# YUTA OpenSpec Schema Hardening Review

Visibility: Engineering

Owner: YUTA product and engineering

Reviewed: 2026-08-29 against local OpenSpec 1.11.0

## 1. Scope

This review analyzes the two known limitations from the isolated Step 7.2 smoke test. It does not change or activate `yuta-spec-driven`, modify `openspec/config.yaml`, modify generated skills, create a real change or spec, make OpenSpec normative, or modify product code.

The target remains:

```text
proposal
   -> analysis   (mandatory authority and evidence gate)
   -> specs
   -> design
   -> tasks
```

## 2. Current Limitations

### Limitation A — conditional design has no persisted skip state

The design instruction is intentionally conditional. When none of its conditions apply, `openspec-propose` and `openspec-explore` allow an agent to deliberately skip it and create an artifact blocked only by that recorded in-session skip.

OpenSpec 1.11.0 does not persist a generic conditional-artifact skip. Therefore raw status remains:

```text
design = ready
tasks = blocked (missing design)
isPlanningComplete = false
```

This is expected from current graph semantics rather than proof of a schema parser defect. Apply can still become ready after the adapter creates `tasks.md`, because apply directly requires only `tasks`.

The local workflow contracts are not fully uniform:

- `openspec-propose` and `openspec-explore` explicitly define conditional evaluation, deliberate skip, and continuation through a dependency blocked only by that skip.
- `openspec-continue-change` says to create the first ready artifact and also says “Never skip artifacts or create out of order.” It has no equivalent conditional-skip branch. A simple change can therefore repeatedly surface `design` without a contract-defined way for this adapter to reach tasks.
- `openspec-archive-change` treats every artifact that is neither done nor CLI-skipped as incomplete, warns, and requires confirmation. It does not recognize an in-session conditional skip as graph completion.

### Limitation B — `skip_specs` satisfies specs before analysis

The current graph says:

```yaml
analysis:
  requires: [proposal]

specs:
  requires: [analysis]

design:
  requires: [specs]
```

OpenSpec marks every not-yet-completed artifact whose output is under `specs/` as completed and separately `skipped` as soon as valid change metadata declares `skip_specs: true`. That mechanism intentionally lets dependents proceed without files that must not exist.

Because current design depends only on specs, raw graph status can make proposal and design ready together before proposal or analysis exists. Declaration order keeps standard adapters on proposal and then analysis, but the authority gate is enforced by adapter behavior rather than by every relevant schema edge.

## 3. OpenSpec 1.11 Semantics

Local executable and installed-source evidence establishes these separate layers:

### CLI graph semantics

- `status --json` reports `done`, `skipped`, `ready`, or `blocked` from file existence, the `skip_specs` completed set, and direct `requires` edges.
- A `skip_specs` artifact is inserted into the completed set independently of its own prerequisites.
- `isPlanningComplete` is true only when every artifact ID is in the completed set. There is no generic conditional-skip state.
- Ready artifacts are ordered by schema declaration order only after dependency readiness is calculated.
- Apply checks the artifact IDs in `apply.requires` directly and loads all existing artifact files as context. It does not require `isPlanningComplete: true`.
- Archive warns when any artifact is neither done nor skipped, but it permits an explicitly confirmed archive with warnings.

### Workflow adapter semantics

- `propose` and `explore` treat dependencies as enablers and explicitly support deliberate skips when an artifact's own instruction is conditional.
- `continue-change` does not currently contain that exception and conflicts with the conditional-design path.
- `new-change` correctly selects the first ready artifact.
- `apply` reads CLI-provided context and preserves CLI blocked/ready/all-done states.
- `verify` gracefully omits design adherence when no design exists, but it has no analysis-specific semantic verification dimension.
- `archive` remains graph-aware for warnings and spec-aware for sync, but cannot distinguish an absent required design from an intentionally absent conditional design.

### Schema semantics

- Schema validation checks unique artifact IDs, valid dependency references, and cycles. It does not reject a redundant transitive dependency.
- An in-memory model using the installed 1.11.0 parser accepted `design.requires: [analysis, specs]`.
- The proposed redundant edge preserved build order `proposal, analysis, specs, design, tasks`.
- With only specs placed in the completed set to model early `skip_specs`, the current graph returned `proposal, design` as ready; the proposed graph returned only `proposal`.
- After proposal plus skipped specs, the proposed graph returned only analysis; design became ready only after analysis joined the completed set.

These behaviors are intentional or documented by the local source and workflow templates. The problem is not that `skip_specs` satisfies a skipped spec artifact; it is that the YUTA graph currently relies on that artifact as the only direct authority gate for design.

## 4. Conditional Design Options

### Option A1 — keep upstream conditional design

Keep the schema and design instruction conditional. Add a narrow consistency correction to the `continue-change` workflow contract so it applies the same deliberate-skip rule already present in `propose` and `explore`.

Assessment:

- Preserves useful upstream behavior and avoids meaningless design artifacts.
- Keeps raw status and archive-warning limitations visible rather than falsely marking a non-existent file complete.
- Works with propose/explore today and with apply/verify after tasks exist.
- Requires agents and humans to understand that raw planning completion remains false after a legitimate skip.
- Needs a small adapter clarification because continue-change currently has no safe conditional path.
- Retains a warning at archive time until OpenSpec supports a persisted generic skip or archive receives equivalent conditional context.

### Option A2 — make design mandatory

Remove “create only if any apply” and require every custom-schema change to create a useful `design.md`, including simple docs/tooling/refactor changes.

Assessment:

- Produces a deterministic file graph, true `isPlanningComplete`, and clean archive status.
- Simplifies all adapters and manual status interpretation.
- Adds recurring overhead and creates pressure to write low-value justification documents for changes with no meaningful technical design.
- Diverges from the upstream artifact contract and violates YUTA's preference not to require an artifact merely to make status look complete.
- Does not improve the mandatory analysis gate beyond what dependency hardening can provide.

### Option A3 — remove design from task dependencies

For example, changing tasks to require only specs would make tasks ready when design is absent.

Assessment:

- Removes the raw dead-end for simple changes.
- Also allows tasks before a design that is genuinely required.
- Moves the safety decision entirely into agent judgment and weakens schema-level enforcement.
- A split schema or additional conditional task artifact would add substantially more complexity than the limitation warrants.

Option A3 is not recommended. OpenSpec 1.11.0 has no generic conditional-artifact metadata that would make an alternative topology both simple and safe.

## 5. Analysis-Gate and `skip_specs` Options

### Option B1 — keep the current graph

Rely on declaration order and the current propose/explore adapter contracts.

Assessment:

- Requires no schema maintenance.
- Works in the tested Codex path.
- Leaves raw/manual CLI users and less careful agents able to see design as ready before analysis.
- Makes YUTA's mandatory authority gate a workflow convention rather than an explicit dependency for design in the no-spec path.
- Is sensitive to future adapter or ordering changes.

This does not meet the requirement that analysis be a real downstream gate.

### Option B2 — add a redundant direct analysis gate to design

Use:

```yaml
analysis:
  requires: [proposal]

specs:
  requires: [analysis]

design:
  requires: [analysis, specs]

tasks:
  requires: [specs, design]
```

Assessment:

- Leaves the normal behavior-changing path logically unchanged.
- Prevents design readiness before analysis when specs is skipped.
- Makes the authority gate visible in schema status and safer for raw/manual CLI use.
- Is accepted by the installed parser and preserves the current topological order.
- Adds one redundant dependency edge and no new artifact, template, metadata convention, or tool.
- Keeps `skip_specs` behavior intact and does not invent a requirement.
- Does not solve the separate generic conditional-design completion limitation.

### Option B3 — alternative topologies

Making design depend only on analysis would allow specs and design to become siblings, weakening the intended specs-before-design sequence. Adding analysis only to tasks would not stop design from becoming ready early. Adding analysis to both design and tasks adds no material safety beyond B2 because tasks already depend on design.

No B3 topology is safer or simpler than B2.

## 6. Comparison Matrix

Ratings use PASS/WARN/FAIL for outcomes and LOW/MEDIUM/HIGH for cost or divergence.

### Conditional design

| Criterion                      | A1: conditional + adapter alignment       | A2: mandatory design                         | A3: remove task dependency          |
| ------------------------------ | ----------------------------------------- | -------------------------------------------- | ----------------------------------- |
| Authority safety               | PASS                                      | PASS                                         | WARN                                |
| Schema-level enforcement       | WARN                                      | PASS                                         | FAIL                                |
| CLI/status coherence           | WARN                                      | PASS                                         | PASS                                |
| Workflow adapter compatibility | WARN until continue alignment             | PASS                                         | PASS                                |
| Raw/manual CLI safety          | WARN                                      | PASS                                         | FAIL                                |
| `skip_specs` behavior          | PASS                                      | PASS with required design                    | PASS but unsafe when design applies |
| Archive behavior               | WARN; confirmation required               | PASS                                         | PASS                                |
| Maintenance cost               | LOW to MEDIUM                             | MEDIUM                                       | LOW                                 |
| Upstream divergence            | LOW for schema; LOW adapter clarification | MEDIUM                                       | MEDIUM                              |
| User/Codex complexity          | MEDIUM                                    | LOW during use; recurring authoring overhead | LOW but unsafe                      |

### Analysis gate

| Criterion                      | B1: current graph        | B2: direct analysis gate        | B3: alternatives        |
| ------------------------------ | ------------------------ | ------------------------------- | ----------------------- |
| Authority safety               | WARN                     | PASS                            | WARN                    |
| Schema-level enforcement       | FAIL on no-spec path     | PASS                            | WARN                    |
| CLI/status coherence           | WARN                     | PASS for analysis ordering      | WARN                    |
| Workflow adapter compatibility | PASS                     | PASS                            | PASS/WARN               |
| Raw/manual CLI safety          | WARN                     | PASS                            | WARN                    |
| `skip_specs` behavior          | WARN; design ready early | PASS; design waits for analysis | WARN                    |
| Archive behavior               | No change                | No change                       | No material improvement |
| Maintenance cost               | LOW                      | LOW                             | MEDIUM                  |
| Upstream divergence            | LOW                      | LOW                             | MEDIUM                  |
| User/Codex complexity          | LOW but implicit         | LOW and explicit                | MEDIUM                  |

## 7. Recommendation

`SCHEMA_AND_WORKFLOW_HARDENING_REQUIRED`

Use Option A1 plus the narrow continue-change adapter alignment, and use Option B2 for the schema.

Do not make design mandatory. A legitimate simple change should not create an empty or ceremonial design solely to satisfy `isPlanningComplete`. Do not remove design from the tasks dependency. Preserve archive's explicit warning rather than silently treating every missing design as an approved skip.

The schema change is minimal and safety-relevant: one redundant direct edge makes analysis a schema-level gate even when specs is intentionally skipped. The workflow change is also bounded: bring continue-change into line with the deliberate conditional-skip behavior already generated for propose and explore. No analysis-specific verify extension is required by these two limitations; its absence remains a known limitation, not a false claim of semantic verification.

## 8. Exact Proposed Changes

### Schema dependency diff

```yaml
# CURRENT
- id: design
  requires:
    - specs

# PROPOSED
- id: design
  requires:
    - analysis
    - specs
```

No other schema dependency, artifact, template, instruction, apply requirement, or tracking path should change.

### Continue-change workflow contract diff

The future reviewed implementation should replace the unconditional “never skip artifacts” treatment with this bounded rule:

```text
Never skip a non-conditional artifact.

When the first ready artifact's own instruction explicitly makes it
conditional, evaluate that condition against the change. If it does not apply:

1. record and report a deliberate skip for the current workflow run;
2. do not create a placeholder file;
3. continue only to the first artifact whose sole missing dependency is that
   deliberate skip;
4. fetch that artifact's instructions and create at most that one artifact;
5. preserve and report raw CLI status, including isPlanningComplete = false;
6. never infer a skip from artifact name alone and never skip specs except when
   CLI status reports specs = skipped.
```

If no downstream artifact can safely proceed, the adapter must stop and report the raw status. It must not mark or persist a generic skip because OpenSpec 1.11.0 provides no such metadata contract.

This proposed workflow text is analysis output only. It is not applied in Step 7.3A.

## 9. Required Re-Test Scope

After a separately reviewed implementation, repeat an isolated temporary-workspace test covering:

1. schema validation and resolution under OpenSpec 1.11.0;
2. normal behavior path with analysis, specs, applicable design, tasks, apply, verify, sync, and archive;
3. `skip_specs: true` initial status proving only proposal is ready;
4. status after proposal proving analysis is ready while design remains blocked;
5. status after analysis proving design becomes ready through satisfied analysis plus skipped specs;
6. conditional design through `openspec-propose`;
7. conditional design through `openspec-continue-change`, including creation of tasks without a placeholder design;
8. a change where design conditions do apply, proving neither adapter skips required design;
9. apply context and task tracking with and without design;
10. archive warning behavior for a deliberate conditional skip;
11. zero delta specs and zero invented requirements on the no-spec path; and
12. repository contamination hashes and temporary-workspace cleanup.

The re-test must not activate the schema or create a real YUTA product change or main spec.

## 10. Activation Recommendation

`ACTIVATION_AFTER_MINIMAL_HARDENING`

Step 7.2's `READY_TO_ACTIVATE_WITH_KNOWN_LIMITATIONS` remains evidence that the core custom chain works, but activation should wait for the one-edge analysis gate and the continue-change conditional-skip alignment, followed by the bounded isolated re-test above.

Approval of this review would approve only the recommended hardening direction. It would not apply the diff, activate `yuta-spec-driven`, make `openspec/specs/` normative, create a Product Decision, or change any lifecycle dimension.

Status: PROPOSED FOR REVIEW
