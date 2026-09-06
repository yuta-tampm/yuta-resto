# YUTA OpenSpec Minimal Schema Hardening Implementation Report

Visibility: Engineering

Owner: YUTA product and engineering

Implemented and tested: 2026-08-29 against local OpenSpec 1.11.0

## 1. Scope

Step 7.3B applied only the approved schema-level authority gate:

```text
design requires analysis and specs
```

No generated OpenSpec skill, template, instruction, config, real change, real spec, Product Knowledge source, lifecycle value, or product code was changed. The custom schema remains inactive as the project default.

## 2. Exact Schema Diff

Only the `design` artifact's direct dependencies changed:

```yaml
# BEFORE
- id: design
  requires:
    - specs

# AFTER
- id: design
  requires:
    - analysis
    - specs
```

No artifact ID, artifact order, proposal, analysis, specs, tasks, template, instruction, apply requirement, apply tracking path, schema name, or schema version changed.

The pre-change schema SHA-256 was:

```text
FC5993E056BA21B1FC24FD8140F45FDE8935954C6016C50D54D1CE47EDAB387C
```

The hardened schema SHA-256 is:

```text
23ECC50057C4D68342C1688EF5723C3CABE75FE8A549A1401A998CFFF605DBA9
```

Removing only the new `analysis` dependency in memory reproduced the exact pre-change hash. Reconstructing the pre-change schema-tree digest with that original schema hash reproduced the full prior tree hash, confirming the other five schema files were unchanged.

## 3. Schema Validation

| Check                         | Result | Evidence                                                                                         |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| Pre-change CLI version        | PASS   | `openspec --version` returned `1.11.0`                                                           |
| Pre-change schema validation  | PASS   | Valid with zero issues                                                                           |
| Post-change schema validation | PASS   | `openspec schema validate yuta-spec-driven --json --verbose` returned valid with zero issues     |
| Schema resolution             | PASS   | `source: project`, no shadows                                                                    |
| Template resolution           | PASS   | Proposal, analysis, specs, design, and tasks templates all still resolve from the project schema |
| Schema catalog                | PASS   | Artifact order remains proposal, analysis, specs, design, tasks                                  |
| Project default               | PASS   | `openspec/config.yaml` remains `schema: spec-driven`                                             |

The direct graph after hardening is:

```text
proposal: []
analysis: [proposal]
specs:    [analysis]
design:   [analysis, specs]
tasks:    [specs, design]
```

The `analysis -> design` edge is redundant on a normal behavior path and a direct safety gate when specs is skipped.

## 4. Isolated Targeted Smoke Test

All tests ran outside the repository in:

```text
C:\Users\Tam\AppData\Local\Temp\yuta-openspec-hardening-f4f6e24168ff43628b3daa154bb95c0e
```

The temporary workspace kept its default schema as `spec-driven`; every disposable change explicitly selected `yuta-spec-driven`. The copied hardened schema matched the real hardened schema SHA-256. The workspace was removed after evidence collection.

Final strict temporary validation passed all three disposable changes with zero failures.

## 5. Normal Behavior Path Result

Disposable change: `hardening-normal`

| Step                     | Expected readiness                                           | Result |
| ------------------------ | ------------------------------------------------------------ | ------ |
| Initial                  | Proposal ready; all downstream artifacts blocked             | PASS   |
| Proposal created         | Analysis ready; specs and design blocked                     | PASS   |
| Analysis created         | Specs ready; design blocked on specs                         | PASS   |
| Valid delta spec created | Design ready; tasks blocked on design                        | PASS   |
| Design created           | Tasks ready                                                  | PASS   |
| Tasks created            | All five planning artifacts done; `isPlanningComplete: true` | PASS   |

The synthetic delta passed strict validation. The redundant analysis dependency did not change or obstruct the normal chain:

```text
proposal -> analysis -> specs -> design -> tasks
```

## 6. `skip_specs` Authority-Gate Result

Disposable change: `hardening-skip-specs`

Immediately after valid metadata set `skip_specs: true`:

```text
proposal = ready
analysis = blocked
specs = skipped
design = blocked (missing analysis)
```

Result: PASS.

After proposal:

```text
analysis = ready
design = blocked (missing analysis)
```

Result: PASS.

After analysis concluded `NO_SPEC_BEHAVIOR_CHANGE`:

```text
analysis = done
specs = skipped
design = ready
```

Result: PASS.

Strict change validation accepted the explicit zero-delta path. The delta-spec file count remained zero, so no requirement was invented. The main acceptance criterion is satisfied: skipped specs can no longer make design ready before analysis completes.

## 7. Required-Design Result

Disposable change: `hardening-required-design`

The synthetic proposal affected two temporary components, so the cross-cutting design condition applied.

After proposal, analysis, and a valid delta spec existed:

```text
design = ready
tasks = blocked (missing design)
```

Result: PASS.

Only after a meaningful `design.md` existed did tasks become ready. The hardened graph therefore did not bypass required design. Strict change validation passed.

## 8. Unresolved Conditional-Design / Continue-Change Limitation

The official generated `openspec-continue-change` workflow still lacks the deliberate conditional-design skip rule present in generated `openspec-propose` and `openspec-explore` workflows.

Step 7.3B intentionally did not patch `.agents/skills/openspec-continue-change/**` or any other generated file. Generated skills may be regenerated or overwritten by `openspec update`, so a local patch would create a maintenance liability outside this step's approved scope.

This limitation is not resolved and is not claimed as resolved. It must be handled by a separate activation/workflow policy or by a reviewed, maintainable project-owned mechanism if operational evidence shows that one is required. OpenSpec 1.11.0 still has no persisted generic conditional-artifact skip; raw status can therefore leave an intentionally omitted design ready, tasks nominally blocked, and `isPlanningComplete: false`.

## 9. Repository Safety

| Protected area                     | Result    | Evidence                                                                                                                                                    |
| ---------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec/config.yaml`             | UNCHANGED | SHA-256 remained `ADE39106DCBE9A78EDF1145A7E8BDFDA036AD946154FA27C3AAE574CDD1AE528`                                                                         |
| `.agents/skills/**`                | UNCHANGED | Tree SHA-256 remained `62954980B1E3F23736C2850C002F60538CE861C7F43DD8D42BF6B2A9FA53855A`                                                                    |
| Schema templates and instructions  | UNCHANGED | Reconstructed pre-change schema-tree hash matched `F1D4228549AC87569D636A87E765FCF528F189924DBB97B4C7DA4D9C4F3A5523` when only the schema hash was restored |
| Real `openspec/specs/**`           | UNCHANGED | File count remained `0`                                                                                                                                     |
| Real active `openspec/changes/**`  | UNCHANGED | Active file count remained `0`                                                                                                                              |
| Product Knowledge and product code | UNCHANGED | Pre-existing worktree state was preserved; no out-of-scope path was written                                                                                 |
| Temporary workspace                | REMOVED   | The verified OS-temp path no longer exists                                                                                                                  |

Only these repository outputs belong to Step 7.3B:

- `openspec/schemas/yuta-spec-driven/schema.yaml`
- `docs/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md`

## 10. Activation Recommendation

`READY_FOR_ACTIVATION_POLICY_REVIEW`

The minimal schema hardening is valid and the isolated acceptance tests passed. The custom schema is not activated by this result. Activation review must explicitly account for the unresolved conditional-design / generated continue-change limitation and must preserve the existing authority, lifecycle, normativity, and deployment boundaries.

Status: APPROVED
