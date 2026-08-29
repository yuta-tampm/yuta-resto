# YUTA OpenSpec Activation Policy Review

Visibility: Engineering

Owner: YUTA product and engineering

Reviewed baseline: 2026-08-29 against local OpenSpec 1.11.0

## 1. Activation Scope

This review defines how YUTA must use the technically approved
`yuta-spec-driven` schema if it is activated as the project default. It does not
activate the schema, modify the schema or generated skills, create a real change
or spec, approve Product Intent, promote a lifecycle value, or make OpenSpec
normative.

The validated project schema remains:

```text
proposal: []
analysis: [proposal]
specs:    [analysis]
design:   [analysis, specs]
tasks:    [specs, design]
```

`apply` requires `tasks` and tracks `tasks.md`. Live validation found the schema
valid with zero issues, resolved from `project` with no shadow, while the current
project default remains `spec-driven`. There are currently no real main specs or
active change files.

## 2. Schema Default Policy

If a separately approved activation step changes the project default to
`yuta-spec-driven`, the following rules apply:

1. Every new change created without an explicit schema uses
   `yuta-spec-driven` and must pass through `analysis` before behavioral specs.
2. Existing changes retain the schema pinned in their `.openspec.yaml`; they
   must not be silently migrated or reinterpreted under the new default.
3. The package schema `spec-driven` must not be shadowed, copied over, or
   modified. `yuta-spec-driven` must continue to resolve from `project` with no
   shadows.
4. Generated OpenSpec skills must not be patched manually. A project-owned
   workflow extension requires separate evidence and review.
5. Every OpenSpec upgrade triggers schema revalidation and workflow re-audit
   before schema regeneration, rebasing, or workflow changes.
6. If `yuta-spec-driven` cannot resolve or validate, work stops. There is no
   silent fallback to `spec-driven` or another schema.

Creating a change shell under this default records a workflow choice only. It
does not approve the proposal or any product behavior.

## 3. Workflow-by-Workflow Policy

### `openspec-explore`

Use `explore` to investigate an idea, current evidence, unknowns, or conflicts
before or during a change. It may identify `CONFLICT`, `NEEDS REVIEW`, or a
possible deliberate design skip. It does not create Product approval and never
substitutes for the change's required `analysis.md`.

### `openspec-new-change`

Use `new-change` only when a shell is useful before authoring artifacts. By
default it must select the activated `yuta-spec-driven` schema; an explicit
schema selection must be intentional and reported. Shell creation is neither
approval nor authorization to implement.

### `openspec-propose`

Use `propose` as the preferred planning workflow for most new YUTA changes. It
creates the planning chain in dependency order, must create and honor
`analysis.md`, and must stop before specs when analysis is blocked. It may omit
conditional `design.md` only when the design instruction genuinely does not
apply, and it must report that deliberate skip. It does not apply product code.

### `openspec-continue-change`

Use `continue-change` only when the next ready artifact is known to apply and
should be created individually. It is suitable for bounded manual progression
through proposal, analysis, specs, a required design, or tasks. It must not be
used to bypass a conditional design because the generated OpenSpec 1.11.0 skill
has no contract-defined skip behavior.

### `openspec-apply-change`

Use `apply-change` only after the applicable planning artifacts are complete,
the apply instructions resolve, and no analysis or authority blocker remains.
Checkbox completion records implementation progress only. Any authority
conflict, newly discovered requirement conflict, or material blocker stops
apply for review; it must not be resolved by implementation assumption.

### `openspec-verify-change`

Use `verify-change` to compare specs, design, tasks, and implementation. Treat
`analysis.md` as required authority and evidence context, not as content covered
by a dedicated semantic verifier. A verification pass does not prove deployment,
production runtime, environment readiness, external-provider readiness, or any
other lifecycle state.

### `openspec-sync-specs`

Do not sync merely because implementation or verification is complete. Sync
main specs only after an accountable YUTA reviewer explicitly approves the
bounded Product/Spec decision and permits sync. While OpenSpec main specs remain
non-normative, sync organizes approved change content but does not itself grant
normative authority.

### `openspec-archive-change`

Archive closes the change and preserves its history. It does not infer Product
Decision, Implementation, Environment, Production Readiness, External
Dependency, deployment, or normative approval. When conditional design was
deliberately omitted, record and review the reason before archive and explicitly
accept the raw CLI warning if it remains. Never create placeholder design content
solely to remove that warning.

## 4. Conditional-Design / Continue-Change Policy

YUTA adopts **Policy C2 — avoid `continue-change` for normal YUTA planning**,
with the bounded C1 rule for intentional artifact-by-artifact work:

- `propose` is the primary planning workflow and the simplest default.
- `continue-change` is allowed only when the next artifact is known to apply.
- If `continue-change` reaches a ready conditional `design` and the design
  conditions do not apply, stop that workflow and use `propose` to complete the
  remaining planning through its deliberate-skip adapter.
- Record the omitted design and its reason; do not invent `design.md` and do not
  pretend the raw schema persisted a generic skip.

Policy C1 alone puts more decision burden on each incremental run. Policy C3
adds a project-owned wrapper and maintenance surface without current operational
evidence that it is necessary. C2 therefore gives the clearest daily rule while
retaining controlled incremental use. Generated skills remain untouched.

## 5. Day-to-Day Recommended Workflow

The default flow is:

```text
Idea
  |
  v
openspec-explore (optional)
  |
  v
openspec-propose
  |
  +-> proposal
  +-> analysis
        |
        +-> BLOCKED_NEEDS_REVIEW / CONFLICT -> stop and review
        `-> ready
              |
              +-> specs, or approved skip_specs for no behavior change
              +-> design when its conditions apply
              `-> tasks
                    |
                    v
              openspec-apply-change
                    |
                    v
              openspec-verify-change
                    |
                    v
              explicit approval / sync decision
                    |
                    v
              openspec-archive-change
```

Use `new-change` plus `continue-change` only when the user specifically wants to
review one artifact at a time. Continue is safe while the next artifact clearly
applies. At a non-applicable conditional design, switch back to `propose`; do not
add another command or wrapper merely to manufacture a complete raw status.

## 6. Normativity Policy

```text
Schema activation != OpenSpec specs become normative
```

- `openspec/changes/**` contains proposed or in-progress change artifacts and is
  non-normative.
- `openspec/specs/**` does not automatically become normative Product authority
  through activation, apply, verify, sync, or archive.
- Main specs become the primary authority for specific behavioral requirements
  only after a separate, explicit YUTA approval transition makes
  `openspec/specs/**` normative.
- Even after that future transition, specs operate inside accepted durable
  product, architecture, security, runtime, and data-ownership boundaries. They
  cannot silently override those higher durable authorities.
- Product Knowledge remains the broader Product Intent and context source and
  cannot be silently overridden by change artifacts.

After activation, YUTA should run a separate normativity-policy step before any
main spec is treated as normative. That later decision must define accountable
approval and sync controls; this review does not implement it.

## 7. Lifecycle Policy

The five lifecycle dimensions remain independent:

- Product Decision
- Implementation
- Environment
- Production Readiness
- External Dependency

No completion or result from proposal, analysis, specs, design, tasks, apply,
verify, sync, or archive automatically promotes any dimension. In particular,
verification does not establish deployed production runtime evidence or external
dependency readiness. Any lifecycle update is a separate action supported by
the evidence and approval required for that bounded dimension.

## 8. Upgrade and Revalidation Policy

For every OpenSpec upgrade:

1. Review the installed CLI version, release notes or changelog, and relevant
   source behavior.
2. Run `openspec schema validate yuta-spec-driven --json --verbose`.
3. Diff the upgraded package `spec-driven` schema and behavior against the base
   assumptions used by the YUTA fork.
4. Inspect newly generated skill behavior, especially analysis gating,
   conditional-design handling, apply, verify, sync, and archive semantics.
5. Smoke-test the normal chain, blocked analysis, `skip_specs`, required design,
   deliberate design omission, apply readiness, and archive behavior whenever
   relevant semantics changed.
6. Only then propose a separately reviewed custom-schema rebase, regeneration,
   or policy update if evidence requires it.

Do not automatically regenerate the schema fork or generated skills during an
upgrade.

## 9. Failure and Fallback Policy

| Condition                                                                | Deterministic action                                                                                                                                                                                       |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Analysis concludes `BLOCKED_NEEDS_REVIEW`                                | Stop before specs and request the accountable review. Resume only after the blocker is explicitly resolved in authority.                                                                                   |
| Analysis records `CONFLICT` affecting requirements                       | Stop before specs. Route the conflict to the controlling authority; do not choose a side or infer approval.                                                                                                |
| Custom schema fails validation or cannot resolve from `project`          | Stop creation or activation. Diagnose and review the schema; never fall back silently.                                                                                                                     |
| `continue-change` stands at conditional design and design does not apply | Stop continue, record the deliberate omission, and switch to `propose` to finish planning. Do not create a placeholder.                                                                                    |
| Verification fails                                                       | Do not claim completion, sync as approved, or archive as complete. Correct implementation or revise approved planning artifacts, then apply and verify again.                                              |
| Archive reports a missing conditional-design warning                     | Confirm that design conditions truly did not apply, ensure the skip reason is recorded, and explicitly accept/report the warning. If design was required, create a meaningful design and reverify instead. |
| An OpenSpec upgrade changes behavior from the validated baseline         | Stop regeneration and workflow use for affected paths, retain the last validated setup, and perform the upgrade re-audit before adopting the change.                                                       |

No failure path may invent approval, silently switch schema, or create a
ceremonial artifact solely to advance status.

## 10. Exact Activation Diff Proposed for the Next Step

If this policy is approved, the next step should apply only this activation
change:

```yaml
# openspec/config.yaml
schema: yuta-spec-driven
```

This is a proposed future diff. It is not applied by Step 7.4.

## 11. Validation Required After Activation

The activation step must prove all of the following:

1. Before editing, capture hashes and repository state for config, custom schema,
   generated skills, real specs, and real changes.
2. Change only the default schema line in `openspec/config.yaml`.
3. Confirm `openspec schema validate yuta-spec-driven --json --verbose` passes
   with zero issues.
4. Confirm `openspec schema which yuta-spec-driven --json` reports
   `source: project` and no shadows.
5. Confirm project context and schema listing report `yuta-spec-driven` as the
   default while the package `spec-driven` remains available and unshadowed.
6. In an isolated temporary workspace, create a disposable change without an
   explicit schema and prove it pins `yuta-spec-driven`, begins at proposal, and
   requires analysis before specs. Do not create a real YUTA product change.
7. Confirm every pre-existing change retains its prior pinned schema and no
   change or spec was migrated or rewritten.
8. Confirm custom schema files and generated skills are byte-for-byte unchanged.
9. Run Markdown formatting, documentation/link checks, and the repository's
   required validation checks; report any unrelated pre-existing failure
   truthfully.
10. Confirm no Product Knowledge, lifecycle value, architecture, product code,
    real spec, or real change was modified.

## 12. Final Recommendation

`READY_TO_ACTIVATE_WITH_OPERATIONAL_POLICY`

The custom schema is valid, project-resolved, unshadowed, and technically ready
for a separately reviewed default activation. The remaining OpenSpec 1.11.0
conditional-design limitation does not require a generated-skill patch or a new
wrapper: the preferred-`propose` policy and bounded `continue-change` rule handle
it deterministically. Approval of this review would approve the operating policy
and permit a separate activation step; it would not activate the schema, make
OpenSpec normative, approve product behavior, or promote lifecycle state.

Status: APPROVED
