# YUTA OpenSpec Schema Review

Status: PROPOSED FOR REVIEW

Visibility: Engineering

Owner: YUTA product and engineering

Reviewed baseline: OpenSpec 1.11.0 on 2026-08-29

## 1. Scope

This document reviews the project-local `yuta-spec-driven` schema created from
the installed OpenSpec 1.11.0 `spec-driven` package schema. Step 7.1 designs and
validates the schema only. It does not activate it, create a product change or
main spec, make OpenSpec normative, modify Product Knowledge, or change code.

## 2. Local baseline

| Concern                                  | Observed value     |
| ---------------------------------------- | ------------------ |
| OpenSpec version                         | `1.11.0`           |
| Base schema                              | `spec-driven`      |
| Base schema source                       | `package`          |
| Base schema validation                   | Valid; zero issues |
| Custom schema                            | `yuta-spec-driven` |
| Custom schema source                     | `project`          |
| Custom schema validation                 | Valid; zero issues |
| Custom schema active as project default? | **NO**             |
| Current project default                  | `spec-driven`      |

The fork command completed successfully:

```text
openspec schema fork spec-driven yuta-spec-driven
```

It copied the package schema from the globally installed OpenSpec package to
`openspec/schemas/yuta-spec-driven/`. No `--force` option was used.

## 3. Artifact graph

```text
proposal
   -> analysis
   -> specs
   -> design
   -> tasks
```

The actual direct dependencies are encoded in `requires`; sequencing does not
depend on list order:

| Artifact   | Direct dependencies | Output          |
| ---------- | ------------------- | --------------- |
| `proposal` | none                | `proposal.md`   |
| `analysis` | `proposal`          | `analysis.md`   |
| `specs`    | `analysis`          | `specs/**/*.md` |
| `design`   | `specs`             | `design.md`     |
| `tasks`    | `specs`, `design`   | `tasks.md`      |

Apply remains:

```yaml
apply:
  requires: [tasks]
  tracks: tasks.md
```

## 4. Exact diff from upstream

### Added

- artifact `analysis`, generating `analysis.md` from
  `templates/analysis.md` and requiring `proposal`;
- the routing-first `analysis.md` template; and
- concise analysis instructions covering relevant knowledge routing,
  authority, repository evidence, lifecycle baseline, conflicts, requirement
  readiness, and the boundary against technical design.

### Dependency changes

- `specs.requires` changed from `[proposal]` to `[analysis]`;
- `design.requires` changed from `[proposal]` to `[specs]`; and
- `tasks.requires` remains `[specs, design]`.

### Minimal instruction changes

- specs must be supported by proposal plus analysis, must not resolve
  `CONFLICT` or `NEEDS REVIEW` by assumption, and must use the approved
  `skip_specs: true` path instead of inventing behavior when no spec-level
  behavior changes;
- design must treat specs as the behavioral contract and return to
  analysis/specs when technical discovery invalidates a requirement;
- tasks explicitly do not promote Product Decision, deployment, readiness, or
  another lifecycle status; and
- apply pauses on authority conflict and distinguishes task progress from YUTA
  lifecycle promotion.

### Unchanged upstream content

The bodies of these four templates are byte-for-byte unchanged from the
installed OpenSpec 1.11.0 package schema, confirmed by matching SHA-256 hashes:

- `templates/proposal.md`
- `templates/spec.md`
- `templates/design.md`
- `templates/tasks.md`

The proposal artifact keeps the upstream Why, What Changes, Capabilities, and
Impact contract. The upstream spec requirement/scenario format, design role,
task checkbox format, and apply tracking behavior remain intact.

## 5. Analysis artifact contract

`analysis.md` answers one bounded question before behavioral requirements are
written: does the change have enough authority and evidence to specify the
desired behavior without guessing?

It records:

- exact scope and change type;
- only the relevant sources actually consulted;
- controlling Product Intent authority and current Product Decision evidence;
- bounded repository Implemented State and unknowns;
- affected runtime, data, tenant/security, public/local, external, and
  cross-module boundaries;
- relevant five-dimension lifecycle baseline;
- UI/UX applicability and routing; and
- conflicts and unknowns that could affect specs, design, or tasks.

It uses exactly one change-analysis conclusion:

- `READY_FOR_SPECS`
- `BLOCKED_NEEDS_REVIEW`
- `NO_SPEC_BEHAVIOR_CHANGE`

These conclusions are workflow signals, not YUTA lifecycle statuses.

The analysis must stop requirements work when a `CONFLICT`, `NEEDS REVIEW`, or
missing requirement-level decision prevents precise specs. It must not invent
approval, choose a technical solution, create an implementation plan, promote
a lifecycle value, or substitute for product/architecture/security review.

## 6. Knowledge integration

The schema routes an agent to relevant YUTA knowledge without embedding or
duplicating the knowledge corpus:

1. read `proposal.md` to bound the proposed change;
2. read only the owning Product Knowledge Home and feature/product sources for
   the bounded capability;
3. use `docs/AUTHORITY_MODEL.md` to select controlling authority;
4. use the relevant `docs/MODULE_REGISTRY.md` row and
   `docs/LIFECYCLE_STATUS_MODEL.md` definitions when lifecycle evidence matters;
5. read accepted ADRs and architecture/security sources only for affected
   boundaries; and
6. inspect current code, tests, contracts, or executable schema only when
   needed to verify repository Implemented State.

`analysis.md` links to sources and summarizes only evidence needed for the
change. It does not copy Product Knowledge, the Module Registry, lifecycle
tables, architecture documents, or source code into every change.

## 7. Lifecycle and authority safety

Schema progress does not modify any of YUTA's five independent lifecycle
dimensions:

- Product Decision
- Implementation
- Environment
- Production Readiness
- External Dependency

Creating or completing proposal, analysis, specs, design, tasks, apply,
verification, sync, or archive is not lifecycle promotion. Code remains
repository Implemented State evidence, not deployment proof. Dated runtime and
readiness evidence remains necessary for environment and production claims.

The custom schema does not make `openspec/specs/` normative. Accepted durable
product, architecture, runtime, and security boundaries remain authoritative,
and explicit YUTA approval is still required before approved OpenSpec main
specs become normative behavioral authority inside those boundaries.

## 8. `skip_specs` compatibility

Local OpenSpec 1.11.0 source inspection indicates that when a change declares
`skip_specs: true`, artifacts whose output is under `specs/` are marked
`skipped` and added to the completed dependency set so their dependents can
proceed. This is structurally compatible with `design` requiring `specs` in the
custom graph.

Step 7.1 did not create a change, so this path has not been exercised end to
end with `yuta-spec-driven`. Step 7.2 must smoke-test a non-behavior change and
confirm that specs are skipped, design/tasks readiness is correct, no
requirement is invented, and apply/verify/archive behavior remains coherent.
There is no schema-validation error proving an incompatibility at this stage.

## 9. Compatibility concerns

- Custom schema commands remain experimental in OpenSpec 1.11.0.
- `skip_specs` must be smoke-tested against the full custom dependency chain.
- Verify reads all CLI context files but has no analysis-specific semantic
  verification dimension.
- Sync and archive retain standard `specs` behavior and must be tested with the
  unchanged `specs` artifact ID plus the added analysis dependency.
- Archive completion is graph-aware, but its task and delta-spec checks retain
  standard-artifact specializations.
- The repository-local OpenSpec skills report `generatedBy: "1.11.0"` and use
  CLI status/instructions for schema discovery, but the custom graph still
  needs end-to-end workflow smoke tests.
- A later OpenSpec upgrade requires schema diff/revalidation before skills or
  the fork are regenerated.

## 10. Activation status

```text
NOT ACTIVE
```

`openspec/config.yaml` remains:

```yaml
schema: spec-driven
```

`yuta-spec-driven` resolves from the project only when explicitly selected. It
does not shadow the package `spec-driven` schema, and no project default was
changed.

## 11. Required Step 7.2 smoke tests

Use disposable, non-product changes only, with cleanup/recovery planned before
the test. Step 7.2 must verify:

1. `new-change` discovers `proposal` first under `yuta-spec-driven`;
2. `continue-change` follows proposal -> analysis -> specs -> design -> tasks;
3. `propose` walks the complete transitive dependency graph and creates
   analysis in the correct order;
4. CLI `status` and `instructions` report the exact artifacts, dependencies,
   output paths, and readiness transitions;
5. apply remains blocked until its required task artifact is ready and reads
   analysis among the context files;
6. verify reads the custom context without failing and clearly exposes the lack
   of an analysis-specific semantic dimension;
7. sync/archive retain correct standard `specs` handling and include analysis
   in graph completion;
8. a behavior-changing path requires proposal, analysis, valid delta specs,
   design when applicable, and tasks;
9. a `skip_specs: true` docs/tooling/refactor path skips specs without inventing
   behavior and allows the intended downstream readiness; and
10. `openspec/config.yaml` remains unchanged throughout the tests unless a
    separate reviewed activation task later authorizes a default change.

No Step 7.2 smoke test or real product change was started in Step 7.1.

## 12. Validation evidence

The following Step 7.1 checks passed:

- OpenSpec version is `1.11.0`;
- built-in `spec-driven` resolves from `package` with `shadows: []`;
- `yuta-spec-driven` resolves from `project` with `shadows: []`;
- `openspec schema validate yuta-spec-driven --json --verbose` returns
  `valid: true` with no issues;
- template resolution includes project-local `analysis.md` and all four
  unchanged upstream templates;
- `openspec schemas --json` reports the custom artifact order as proposal,
  analysis, specs, design, tasks;
- `openspec/config.yaml` remains `schema: spec-driven`;
- `openspec/specs/` remains empty;
- `openspec/changes/` contains no active product change; and
- no skill or product code was modified.

Status: PROPOSED FOR REVIEW
