# YUTA OpenSpec Activation Report

Visibility: Engineering

Owner: YUTA product and engineering

Activated and validated: 2026-08-29 against local OpenSpec 1.11.0

## 1. Preconditions

All Step 7.5 activation preconditions passed before the configuration change.

| Precondition               | Result | Evidence                                                                                                                               |
| -------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| OpenSpec version           | PASS   | `openspec --version` returned `1.11.0`.                                                                                                |
| Activation policy approved | PASS   | `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md` ends with `Status: APPROVED` and retains `READY_TO_ACTIVATE_WITH_OPERATIONAL_POLICY`. |
| Custom schema valid        | PASS   | `openspec schema validate yuta-spec-driven --json --verbose` returned `valid: true` with zero issues.                                  |
| Custom schema source       | PASS   | `openspec schema which yuta-spec-driven --json` returned `source: project` and `shadows: []`.                                          |
| Prior project default      | PASS   | The first line of `openspec/config.yaml` was `schema: spec-driven`.                                                                    |
| Real OpenSpec state        | PASS   | The repository had zero main spec files, zero active changes, and zero active change files.                                            |

The pre-activation SHA-256 values were:

```text
openspec/config.yaml                                  ADE39106DCBE9A78EDF1145A7E8BDFDA036AD946154FA27C3AAE574CDD1AE528
openspec/schemas/yuta-spec-driven/schema.yaml         23ECC50057C4D68342C1688EF5723C3CABE75FE8A549A1401A998CFFF605DBA9
openspec/schemas/yuta-spec-driven/**                  1AD49E546AD24FCB07CA36E02C60F00F36A7F709976FEB107BB5CA661480B492
.agents/skills/**                                     88BE33F626BEF878D2D5F442AC79F22CB0A4BE649AEB21D69BCAA2FEC974A0D0
openspec/specs/**                                     E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855
openspec/changes/**                                   E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855
```

The worktree already contained unrelated modified and untracked work. It was
preserved and was not normalized, reverted, or rewritten by this step.

## 2. Exact Activation Diff

Step 7.5 changed only the default-schema value in `openspec/config.yaml`:

```diff
-schema: spec-driven
+schema: yuta-spec-driven
```

The remaining config context, rules, comments, and operation guidance were not
changed. The post-activation config SHA-256 is:

```text
D8D2B2AEFD4B52E48D3E419B94234460A158820AB3AEB3325CED92D9D4965D8A
```

No skill regeneration command was run.

## 3. Validation Results

| Check                       | Result | Observed result                                                                                |
| --------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `openspec --version`        | PASS   | `1.11.0`                                                                                       |
| Schema validation           | PASS   | `yuta-spec-driven` is valid with zero issues.                                                  |
| Custom schema resolution    | PASS   | Source is `project`; `shadows` is empty.                                                       |
| Project config              | PASS   | `openspec/config.yaml` now declares `schema: yuta-spec-driven`.                                |
| Schema catalog              | PASS   | `yuta-spec-driven` is listed with proposal, analysis, specs, design, and tasks from `project`. |
| Package schema availability | PASS   | `spec-driven` remains listed from `package`.                                                   |
| Package schema resolution   | PASS   | `openspec schema which spec-driven --json` reports `source: package` and `shadows: []`.        |
| Project context             | PASS   | `openspec context --json` resolves this repository as the nearest OpenSpec root.               |

The activation does not shadow or modify the package `spec-driven` schema.

## 4. Default-Selection Smoke Test

The smoke test ran outside the repository in a unique operating-system temporary
workspace. It copied only the activated config and the project
`yuta-spec-driven` schema. The disposable command did not pass `--schema`:

```text
openspec new change smoke-default-selection --json
```

The command selected `yuta-spec-driven`, and the generated disposable metadata
contained:

```yaml
schema: yuta-spec-driven
```

Initial artifact readiness matched the required graph:

| Artifact | Initial status                  |
| -------- | ------------------------------- |
| proposal | `ready`                         |
| analysis | `blocked` on proposal           |
| specs    | `blocked` on analysis           |
| design   | `blocked` on analysis and specs |
| tasks    | `blocked` on specs and design   |

After a synthetic proposal was created in the temporary change, readiness was:

| Artifact | Status after proposal           |
| -------- | ------------------------------- |
| proposal | `done`                          |
| analysis | `ready`                         |
| specs    | `blocked` on analysis           |
| design   | `blocked` on analysis and specs |
| tasks    | `blocked` on specs and design   |

The selected change `schemaName` and its persisted pin were both
`yuta-spec-driven`. OpenSpec 1.11.0 also emitted a nested diagnostic
`planningHome.defaultSchema: spec-driven` in the status payload; that field did
not control selection, because default creation without `--schema`, the change
pin, and the active `schemaName` all resolved to `yuta-spec-driven`. This
diagnostic inconsistency should remain part of the next OpenSpec upgrade
re-audit; it does not change the successful activation acceptance result.

The temporary workspace was positively identified under the operating-system
temp root and removed after the test. No disposable artifact entered the YUTA
repository.

## 5. Existing Change and Spec Safety

Post-activation checks returned:

```text
Real main spec file count:   0
Real active change count:    0
Real active change files:    0
```

`openspec list --json` returned no changes, and
`openspec list --specs --json` returned no main specs. Therefore no existing
change was migrated or rewritten, no schema pin was changed, and no sync or
archive operation occurred.

Future pre-existing changes must continue to use their persisted
`.openspec.yaml` schema pin rather than being silently migrated to the new
default.

## 6. Schema and Skill Integrity

The custom schema and generated skills were read and validated but not modified.
Their post-activation hashes remained identical to the pre-activation snapshot:

```text
openspec/schemas/yuta-spec-driven/schema.yaml         23ECC50057C4D68342C1688EF5723C3CABE75FE8A549A1401A998CFFF605DBA9
openspec/schemas/yuta-spec-driven/**                  1AD49E546AD24FCB07CA36E02C60F00F36A7F709976FEB107BB5CA661480B492
.agents/skills/**                                     88BE33F626BEF878D2D5F442AC79F22CB0A4BE649AEB21D69BCAA2FEC974A0D0
```

The approved Step 7.4 operational policy remains controlling, including the
preferred `openspec-propose` workflow, bounded `continue-change` use, explicit
conditional-design handling, failure rules, and no silent schema fallback.

## 7. Normativity and Lifecycle Safety

```text
Schema activation
!= OpenSpec specs normative
!= Product Decision approval
!= Implementation completion
!= Environment enablement
!= Production Readiness
!= External Dependency readiness
```

`openspec/changes/**` remains proposed or in-progress material. There are still
no main specs, and activation, apply, verify, sync, or archive would not by
itself make a main spec normative. OpenSpec main specs can become normative
behavioral authority only through a separate explicit YUTA approval transition.
No such transition occurred in Step 7.5.

Accepted durable product, architecture, security, runtime, and data-ownership
boundaries retain their higher authority. The five YUTA lifecycle dimensions
remain independent and require their own bounded evidence and approval.

## 8. Repository Safety

| Protected area                  | Result    | Evidence                                                                      |
| ------------------------------- | --------- | ----------------------------------------------------------------------------- |
| Custom schema                   | UNCHANGED | File and schema-tree hashes match the pre-activation snapshot.                |
| Generated OpenSpec skills       | UNCHANGED | Skills-tree hash matches the pre-activation snapshot; no regeneration ran.    |
| Real OpenSpec specs and changes | UNCHANGED | Both trees remain empty; CLI listing confirms zero specs and zero changes.    |
| Product Knowledge               | UNCHANGED | No Product Knowledge file was written; its pre-activation hash was preserved. |
| Lifecycle documentation         | UNCHANGED | Authority, lifecycle, and registry files were not written.                    |
| Architecture                    | UNCHANGED | No architecture file was written.                                             |
| Product code                    | UNCHANGED | No application or package source was written.                                 |
| Temporary smoke workspace       | REMOVED   | The verified temporary path no longer exists.                                 |

The only Step 7.5 repository outputs are:

1. `openspec/config.yaml`, with the approved one-line default activation; and
2. `docs/OPENSPEC_YUTA_ACTIVATION_REPORT.md`, this evidence report.

Pre-existing unrelated worktree changes remain outside this step's ownership.

Repository validation produced these results:

| Command                                                      | Result                                                                                                                                                            |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm docs:check`                                            | PASS — documentation consistency passed for 36 current documents.                                                                                                 |
| `pnpm architecture:check`                                    | PASS — runtime imports, database URLs, client boundaries, and migration baselines are valid.                                                                      |
| `pnpm -r --if-present typecheck`                             | PASS — all 15 participating workspace projects completed successfully.                                                                                            |
| Targeted Prettier check for the activation config and report | PASS                                                                                                                                                              |
| `git diff --check` for the activation config and report      | PASS                                                                                                                                                              |
| Repository-wide `pnpm format:check`                          | BOUNDED PRE-EXISTING FAILURE — 40 out-of-scope generated-skill, archive/task, and schema-template files remain unformatted; neither Step 7.5 output was reported. |

## 9. Final Status

`YUTA_SPEC_DRIVEN_ACTIVE`

The project default is now `yuta-spec-driven`. Schema validation, source and
shadow checks, isolated default selection, artifact readiness, real repository
safety, and protected-area integrity all satisfy the approved activation policy.
This result activates the workflow default only; it does not make OpenSpec main
specs normative or promote any product or lifecycle state.

Status: APPROVED
