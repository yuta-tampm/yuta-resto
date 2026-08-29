# YUTA OpenSpec Local Baseline Audit

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Audited: 2026-08-29; re-audited: 2026-08-29 against OpenSpec 1.11.0

## 1. Purpose and audit boundary

This audit records the OpenSpec CLI, schema, project state, and Codex workflow
that resolve locally before YUTA creates a custom schema. It was re-audited
after the local upgrade from OpenSpec 1.10.0 to 1.11.0. Local executable
evidence is controlling for this baseline; no internet documentation was used
to infer the installed behavior.

This step did not fork or edit a schema, modify `openspec/config.yaml`, update
the generated skills, create a change or spec, or modify application code.

## 2. Local OpenSpec version and command evidence

| Command                                                 | Observed result                                                                   |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `openspec --version`                                    | `1.11.0`                                                                          |
| `openspec schemas`                                      | One available schema: `spec-driven`, sourced from the package                     |
| `openspec schemas --json`                               | `spec-driven`; artifacts `proposal`, `specs`, `design`, `tasks`; source `package` |
| `openspec schema which spec-driven --json`              | Package path shown below; `shadows: []`                                           |
| `openspec templates --schema spec-driven --json`        | All four templates resolve from the same package schema                           |
| `openspec schema validate spec-driven --json --verbose` | `valid: true`; no issues                                                          |
| `openspec context --json`                               | Nearest OpenSpec root is this repository; no members or status entries            |
| `openspec list --json`                                  | No active changes                                                                 |
| `openspec list --specs --json`                          | No main specs                                                                     |

Schema commands are explicitly labelled **experimental** by this CLI and may
change in a later OpenSpec version.

## 3. Resolved schema source and current default

The project default in `openspec/config.yaml` is:

```yaml
schema: spec-driven
```

The resolved schema is the installed package schema, not a repository-local
copy:

```text
Name: spec-driven
Source: package
Path: C:\Users\Tam\AppData\Roaming\npm\node_modules\@fission-ai\openspec\schemas\spec-driven
Shadows: []
```

`openspec/schemas/` does not exist. Therefore no project-local schema currently
shadows the built-in `spec-driven` schema. Using the same name for a future
local fork would introduce shadowing; a distinct YUTA schema name is safer and
more explicit.

The current config also supplies concise project context:

- artifact language is Vietnamese;
- OpenSpec structural headings and `SHALL`/`MUST` remain English; and
- no active per-artifact rules or apply/archive operation guidance are
  configured. The examples in the file are comments only.

## 4. Installed `spec-driven` artifact graph

The CLI describes the default flow as:

```text
proposal -> specs -> design -> tasks
```

The installed `schema.yaml` contains this exact dependency graph:

| Artifact   | Output          | Direct dependencies | Installed purpose                                                 |
| ---------- | --------------- | ------------------- | ----------------------------------------------------------------- |
| `proposal` | `proposal.md`   | none                | Establish the reason, high-level change, capabilities, and impact |
| `specs`    | `specs/**/*.md` | `proposal`          | Define observable behavioral requirements and scenarios           |
| `design`   | `design.md`     | `proposal`          | Explain the technical implementation approach                     |
| `tasks`    | `tasks.md`      | `specs`, `design`   | Provide a tracked implementation checklist                        |

The displayed order and the dependency graph are not identical concepts.
After `proposal` exists, both `specs` and `design` are dependency-ready. Their
declaration order makes the CLI present `specs` first, but `design` does not
directly require `specs` in the installed schema. `tasks` is blocked until both
are complete.

The installed apply configuration is:

```yaml
apply:
  requires: [tasks]
  tracks: tasks.md
```

Apply therefore becomes available through the `tasks` artifact and tracks its
checkboxes. Its instruction says to read context files, work through pending
tasks, mark them complete, and pause on blockers or required clarification.

## 5. Meaning of the `proposal` artifact

The local proposal template and instruction establish a concise planning
artifact, normally one to two pages, focused on the change rather than its
implementation.

It answers:

- **Why**: the problem or opportunity and why the change is needed now;
- **What Changes**: the high-level additions, modifications, removals, and any
  breaking change;
- **Capabilities**: the exact new capability paths and existing capability
  paths whose behavioral requirements change; and
- **Impact**: affected code, APIs, dependencies, or systems at an orientation
  level.

The Capabilities section is the contract from proposal to delta specs. A
behavior-changing proposal needs corresponding capability specs. A pure
refactor, tooling, or documentation change may explicitly use
`skip_specs: true`; it must not invent a behavioral requirement merely to
satisfy validation.

`proposal.md` is not a technical design, implementation plan, task checklist,
or copy of the YUTA Product Knowledge corpus. Technical choices belong in
`design.md`, executable work breakdown belongs in `tasks.md`, and precise
observable behavior belongs in specs.

## 6. Meaning of the `openspec-propose` workflow

`openspec-propose` is a Codex skill/workflow, not the `proposal` artifact. Its
local skill creates a change and then generates the complete planning-artifact
set required by the selected schema in dependency order. Under the current
default schema that can include:

```text
proposal.md
specs/<capability-path>/spec.md
design.md
tasks.md
```

It remains planning-only and stops before implementation. In contrast,
`proposal.md` is one artifact with one bounded purpose inside that workflow.
The similar names must not be used interchangeably.

## 7. Current project OpenSpec state

| Area             | Observed state                                                        |
| ---------------- | --------------------------------------------------------------------- |
| OpenSpec root    | This repository, resolved as the nearest root                         |
| Default schema   | `spec-driven`                                                         |
| Main specs       | `openspec/specs/` exists and is empty; no normative spec exists       |
| Active changes   | None; `openspec/changes/` contains only an empty `archive/` directory |
| Project schemas  | `openspec/schemas/` is absent                                         |
| Schema shadowing | None; `spec-driven` reports `shadows: []`                             |
| Custom workflow  | Not created                                                           |

The empty directories and bootstrap config create no product authority. They
also provide no evidence of implementation, deployment, readiness, or an
approved lifecycle transition.

## 8. Current Codex OpenSpec skill location and profile

The repository-local Codex skills are under `.agents/skills/`. Each inspected
OpenSpec skill reports `generatedBy: "1.11.0"`, matching the installed CLI and
confirming that the skills—not only the CLI—were refreshed. The current profile
exposes:

- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-propose`
- `openspec-update-change`
- `openspec-apply-change`
- `openspec-verify-change`
- `openspec-sync-specs`
- `openspec-archive-change`

These skills are workflow adapters around CLI-reported schema state:

- new-change selects the first ready artifact reported by `status` and obtains
  its instructions;
- continue-change and explore use `status`, artifact IDs, dependencies,
  `artifactPaths`, and per-artifact `instructions`;
- propose walks the transitive dependency closure from `applyRequires` rather
  than hard-coding only four artifacts;
- update-change explicitly requires artifact IDs and paths from `status` and
  says custom schemas must work unchanged;
- apply-change reads every path in the CLI-provided `contextFiles` and locates
  the task artifact from schema status; and
- archive checks graph completion from `status` before its task and delta-spec
  handling.

The skills are schema-aware, but not semantically generic in every operation.
Verify performs special checks for `contextFiles.tasks`, `.specs`, and
`.design`; sync-specs and archive contain behavior specific to the `specs`
artifact and task checkboxes. They still read the full CLI context/graph, but a
new `analysis` artifact will not automatically receive a dedicated verification
dimension. Candidate B retains the standard `specs`, `design`, and `tasks` IDs,
so these specializations do not block it; they remain compatibility cases to
test before adoption.

A future schema still needs compatibility validation against every workflow
YUTA intends to use. The presence of a refreshed generated skill alone is not
proof that a custom artifact is well designed.

No skill was regenerated or modified during this audit.

## 9. Custom schema commands supported locally

OpenSpec `1.11.0` exposes the following experimental commands:

| Capability        | Local syntax                           | Relevant options or constraint                                                   |
| ----------------- | -------------------------------------- | -------------------------------------------------------------------------------- |
| Locate resolution | `openspec schema which [name]`         | `--json`, `--all`                                                                |
| Validate schema   | `openspec schema validate [name]`      | `--json`, `--verbose`                                                            |
| Fork schema       | `openspec schema fork <source> [name]` | `--json`, `--force`                                                              |
| Initialize schema | `openspec schema init <name>`          | `--json`, `--description`, `--artifacts`, `--default`, `--no-default`, `--force` |

The `schema init --artifacts` scaffolder accepts only the built-in IDs
`proposal,specs,design,tasks`. The installed schema parser itself supports
named artifact records with relative output/template paths and `requires`
edges, validates dependency references, rejects duplicate IDs and cycles, and
computes topological readiness. Consequently, a YUTA artifact such as
`analysis` is feasible through a reviewed fork and schema edit, not directly
through `schema init --artifacts analysis`.

No fork or init command was executed in this step.

## 10. OpenSpec 1.10 to 1.11 delta

| Concern                     | 1.10 finding                                                                                                           | 1.11 observed                                                                                                                    | Impact on YUTA                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Default artifact graph      | Displayed `proposal -> specs -> design -> tasks`; dependency graph made `specs` and `design` siblings after `proposal` | Unchanged in the installed `schema.yaml`                                                                                         | Candidate B must still encode its desired sequencing through explicit `requires` edges            |
| Proposal meaning            | Concise Why, What Changes, Capabilities, and Impact; not design/tasks/Product Knowledge copy                           | Template and instruction unchanged                                                                                               | Preserve the bounded proposal role                                                                |
| Propose workflow meaning    | Planning workflow that generates the schema-required artifact set, not only `proposal.md`                              | Unchanged; refreshed skill walks `applyRequires` and transitive dependencies                                                     | A custom `analysis` dependency can be discovered and generated                                    |
| Schema command syntax       | Experimental `which`, `validate`, `fork`, and `init` commands                                                          | Syntax and options unchanged                                                                                                     | Existing Step 7.1 command plan remains applicable, subject to revalidation at execution time      |
| Custom artifact feasibility | Parser accepted named artifacts, relative paths, and `requires` edges                                                  | Unchanged parser behavior; duplicate IDs, invalid references, and cycles remain rejected                                         | `analysis` remains structurally supported through fork/edit                                       |
| Schema init limitation      | `--artifacts` accepted only `proposal,specs,design,tasks`                                                              | Unchanged                                                                                                                        | Do not try `schema init --artifacts analysis`; use a reviewed fork/edit                           |
| Schema fork behavior        | `schema fork <source> [name]`, with `--json` and `--force`                                                             | CLI surface unchanged; no fork executed during either audit                                                                      | A distinct `yuta-spec-driven` name remains the safe proposal                                      |
| Resolution and shadowing    | Package `spec-driven`; no project schema; `shadows: []`                                                                | Unchanged                                                                                                                        | No current shadow; using a distinct local name avoids implicit override                           |
| Apply configuration         | `requires: [tasks]`, `tracks: tasks.md`                                                                                | Unchanged                                                                                                                        | Candidate B can retain the existing apply contract                                                |
| Codex skill location        | `.agents/skills/`                                                                                                      | Unchanged                                                                                                                        | Repository-local workflow ownership remains explicit                                              |
| Skill schema-awareness      | 1.10 skills used CLI status/instructions and graph paths, with standard-artifact specializations                       | All nine inspected skills now report `generatedBy: "1.11.0"`; graph discovery remains, as do verify/archive/sync specializations | Skills were actually refreshed; Candidate B remains compatible but requires a workflow smoke test |
| Project specs/changes state | No main specs and no active changes                                                                                    | Unchanged                                                                                                                        | No migration or existing change compatibility work is needed before schema design                 |

The locally installed 1.11 package description, command help, resolved schema,
templates, and parser behavior agree with one another for the concerns above.
No repository-local behavior contradicted those installed comments or help
texts. If a future external document differs, this local executable baseline
remains controlling for the installed version.

## 11. YUTA knowledge integration constraints

A future YUTA schema should reference knowledge entry points as constraints and
routing sources, without copying their full content into config, templates, or
change artifacts.

| Knowledge concern         | Required integration behavior                                                                                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Durable boundaries        | Accepted product, architecture, runtime, and security decisions remain the highest authority for their boundaries. OpenSpec must report a conflict rather than silently override them.                                                                        |
| Product context           | `docs/PRODUCT_KNOWLEDGE.md` and the owning feature/product home remain the broader context and routing layer.                                                                                                                                                 |
| Behavioral requirements   | Only after explicit YUTA approval makes `openspec/specs/` normative may an approved main spec become primary for precise behavior inside accepted boundaries.                                                                                                 |
| Change status             | `openspec/changes/` remains proposed or in-progress work. Create, apply, sync, verify, or archive must not automatically make a change normative.                                                                                                             |
| Lifecycle                 | `docs/LIFECYCLE_STATUS_MODEL.md` and `docs/MODULE_REGISTRY.md` keep Product Decision, Implementation, Environment, Production Readiness, and External Dependency status independent. OpenSpec workflow progress must not promote any dimension automatically. |
| Implemented state         | Current tracked code and tests are repository implementation evidence. They do not prove the deployed version.                                                                                                                                                |
| Live and readiness claims | Dated deployment/runtime and scoped readiness evidence remain necessary; an OpenSpec artifact cannot replace them.                                                                                                                                            |
| Broad summary             | `docs/CURRENT_STATE.md` remains a repository-wide summary and routing layer, not a duplicate requirements or lifecycle table.                                                                                                                                 |

At artifact creation time, the agent should read only the relevant Product
Knowledge Home, Module Registry row, accepted decisions, architecture/security
boundaries, and implementation evidence for the bounded capability. Artifacts
should link to those sources and record conflicts or unknowns; they should not
paste the whole knowledge set into every change.

## 12. Candidate YUTA artifact graphs

### Candidate A — retain the installed graph

```text
proposal -> {specs, design} -> tasks
```

| Aspect            | Assessment                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Artifacts         | Installed `proposal`, `specs`, `design`, and `tasks`                                                                                                                                                        |
| Dependencies      | `specs` and `design` each require `proposal`; `tasks` requires both                                                                                                                                         |
| Benefit           | Zero schema customization, lowest maintenance, and immediate compatibility with the installed CLI and skills                                                                                                |
| Cost / limitation | No mandatory place for repository evidence, authority conflicts, lifecycle boundaries, or affected runtime/data/security analysis before requirements are written; proposal or design may become overloaded |
| Recommendation    | Viable fallback for small, low-risk changes; not recommended as the default YUTA governance graph                                                                                                           |

### Candidate B — minimal YUTA analysis extension

```text
proposal -> analysis -> specs -> design -> tasks
```

| Artifact   | Purpose                                                                                                                                                                                                         | Direct dependency |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `proposal` | Concise why, high-level what, capability paths, and impact                                                                                                                                                      | none              |
| `analysis` | Resolve relevant authorities and repository evidence; bound product decision, lifecycle, runtime, data, security, external dependency, UI applicability, conflicts, and unknowns without designing the solution | `proposal`        |
| `specs`    | Define precise observable requirements and scenarios supported by the approved intent and bounded analysis                                                                                                      | `analysis`        |
| `design`   | Select the technical approach inside the accepted boundaries and specs                                                                                                                                          | `specs`           |
| `tasks`    | Break the accepted specs/design into verifiable implementation work                                                                                                                                             | `specs`, `design` |

Benefits:

- keeps `proposal.md` concise and prevents it from becoming a Product
  Knowledge copy;
- forces authority/evidence reconciliation before normative-looking behavior
  is drafted;
- makes the intended sequence explicit rather than relying only on declaration
  order; and
- gives YUTA a stable place to record `CONFLICT`, `NEEDS REVIEW`, and
  Unknown/Unverified findings before design and implementation.

Costs and complexity:

- one additional artifact is required for every change using this schema;
- the analysis template must remain bounded or it will duplicate the Module
  Registry and current docs;
- the fork, templates, dependencies, apply closure, and all relevant Codex
  skills require validation; and
- YUTA must maintain the custom schema across experimental CLI upgrades.

**1.11 conclusion: `CANDIDATE_B_STILL_RECOMMENDED`.** The 1.11 parser still
supports the required custom artifact and acyclic dependencies:

- `analysis` requires `proposal`;
- `specs` requires `analysis`;
- `design` requires `specs`;
- `tasks` requires `specs` and `design`; and
- apply can retain `requires: [tasks]` and `tracks: tasks.md`.

New-change, continue-change, propose, update-change, explore, and apply discover
the custom artifact through CLI status/instructions/context. Archive checks all
artifact completion through the graph. Verify reads all context files but has
no analysis-specific verification dimension, while archive/sync keep
standard-ID behavior for `specs` and `tasks`; Candidate B preserves those IDs.
That bounded specialization requires a disposable workflow smoke test, not a
graph adjustment.

A dedicated `ux-flow` artifact is not recommended in the default graph yet.
The local schema has no native conditional-artifact field, so including
`ux-flow` would burden non-UI changes unless YUTA maintained a separate
UX-specific schema or accepted a more complex convention. UI-specific intent
can initially be assessed in `analysis` and detailed in existing page-pack
authorities; revisit a separate artifact only after repeated changes
demonstrate a real gap.

## 13. Recommendation for Step 7.1

After this audit is reviewed, Step 7.1 should propose and review—not silently
activate—the minimal extension:

1. fork `spec-driven` to a distinct project-local name such as
   `yuta-spec-driven`;
2. add a concise `analysis` artifact and template;
3. make `specs` depend on `analysis`, `design` depend on `specs`, and `tasks`
   depend on both `specs` and `design`;
4. retain `apply.requires: [tasks]` and `tracks: tasks.md`;
5. validate the fork with `openspec schema validate yuta-spec-driven --json
--verbose` and inspect its resolved templates and build order;
6. test the schema-aware new/continue/propose/apply/verify/archive workflows on
   a disposable, non-product change before selecting it as the default; and
7. keep `openspec/config.yaml` on `spec-driven` until the custom schema and its
   authority/lifecycle rules receive separate approval.

Approving a schema design does not make `openspec/specs/` normative. That
authority transition requires the explicit YUTA approval already reserved by
the Authority Model.

## 14. Compatibility concerns

- Schema commands remain experimental in OpenSpec `1.11.0`; pin or re-audit the
  CLI before later regeneration or upgrade.
- `schema init` cannot scaffold the proposed `analysis` ID; Step 7.1 should use
  a named fork and reviewed edits.
- The built-in displayed sequence hides a real dependency branch between
  `specs` and `design`; the custom graph must encode the desired sequence in
  `requires`, not rely on list order.
- Forking under the name `spec-driven` would shadow the package schema. A
  distinct name avoids an implicit override and makes rollback explicit.
- The repository-local skills were refreshed and generated by `1.11.0`. Their
  schema-aware behavior should still be tested after the graph changes and
  re-audited after a CLI upgrade; they must not be regenerated casually because
  local workflow corrections may exist.
- Verify has no dedicated semantic check for a custom `analysis` artifact, and
  verify/archive/sync retain standard-artifact specializations. Candidate B
  keeps `specs`, `design`, and `tasks`, so this is a smoke-test requirement
  rather than a blocker.
- OpenSpec progress and archive state do not map automatically to any YUTA
  Product Decision, Implementation, Environment, Production Readiness, or
  External Dependency value.

## 15. Validation statement

Step 7.0 originally created this file. Step 7.0B updated only
`docs/OPENSPEC_BASELINE_AUDIT.md` to reflect the local OpenSpec 1.11.0 delta. It
did not modify any OpenSpec file, fork or initialize a schema, create a change
or spec, regenerate a skill, or modify code.

Status: APPROVED
