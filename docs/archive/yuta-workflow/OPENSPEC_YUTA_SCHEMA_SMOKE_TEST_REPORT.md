# OpenSpec `yuta-spec-driven` Isolated Smoke-Test Report

**Date:** 2026-08-29  
**Owner:** YUTA Architecture  
**Scope:** Step 7.2 compatibility testing only

## Environment

| Check                     | Result | Evidence                                                                                                                                                    |
| ------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenSpec CLI              | PASS   | Version `1.11.0`                                                                                                                                            |
| Custom schema validation  | PASS   | `openspec schema validate yuta-spec-driven --json --verbose` returned `valid: true` with no issues                                                          |
| Custom schema source      | PASS   | `openspec schema which yuta-spec-driven --json` returned `source: project` and no shadows                                                                   |
| Real project default      | PASS   | `openspec/config.yaml` remained `schema: spec-driven`                                                                                                       |
| Explicit custom selection | PASS   | Every disposable change was created with `--schema yuta-spec-driven`, and each `.openspec.yaml` retained that schema                                        |
| Isolated workspace        | PASS   | `C:\Users\Tam\AppData\Local\Temp\yuta-openspec-smoke-4101bffeabca48ef8636aff9f4a0a3df` was outside the repository and was removed after evidence collection |
| Schema copy               | PASS   | The temporary schema SHA-256 matched the real schema SHA-256: `FC5993E056BA21B1FC24FD8140F45FDE8935954C6016C50D54D1CE47EDAB387C`                            |

The temporary `openspec/config.yaml` kept `schema: spec-driven` and contained only synthetic context. No YUTA Product Knowledge was copied into the workspace.

## Test A — Behavior Path

Disposable change: `smoke-yuta-behavior`  
Synthetic capability: `smoke/example-behavior`

| Transition or check           | Result | Evidence                                                                                                                                                                                                                             |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Initial graph                 | PASS   | `proposal = ready`; `analysis`, `specs`, `design`, and `tasks = blocked`; direct dependencies matched the reviewed schema                                                                                                            |
| `proposal -> analysis`        | PASS   | Completing `proposal.md` made `analysis` ready                                                                                                                                                                                       |
| `analysis -> specs`           | PASS   | Analysis instructions used output `analysis.md`, depended on the completed proposal, resolved the custom template, and the synthetic analysis concluded `READY_FOR_SPECS`; `specs` then became ready while `design` remained blocked |
| `specs -> design`             | PASS   | A valid new-capability delta used Purpose, ADDED Requirements, SHALL, a four-hash Scenario, and WHEN/THEN; strict validation passed; `design` became ready and `tasks` remained blocked                                              |
| `design -> tasks`             | PASS   | Creating applicable `design.md` made `tasks` ready                                                                                                                                                                                   |
| Tasks and planning completion | PASS   | Checkbox-formatted `tasks.md` completed the five-artifact planning graph according to CLI semantics                                                                                                                                  |
| Apply context                 | PASS   | Apply instructions included proposal, analysis, specs, design, and tasks; custom analysis caused no failure                                                                                                                          |
| Task tracking                 | PASS   | Apply initially reported one pending task, then reported `all_done` after the isolated `synthetic/echo.txt` marker was created with exact content and its checkbox was completed                                                     |
| Validation                    | PASS   | Strict change validation passed before and after the synthetic task                                                                                                                                                                  |

Observed normal-path chain:

```text
proposal -> analysis -> specs -> design -> tasks
```

## Test B — Conditional Design

Disposable change: `smoke-yuta-simple-behavior`

- Proposal and analysis completed normally; analysis concluded `READY_FOR_SPECS`.
- The simple synthetic behavior delta passed strict validation.
- Design instructions retained the upstream conditional rule: create `design.md` only when a listed condition applies.
- The test deliberately skipped design because no design condition applied.
- Raw CLI status continued to show `design = ready`, `tasks = blocked`, and missing dependency `design`.
- Task instructions were still retrievable. The workflow adapter created `tasks.md` only after confirming that design was the sole missing dependency and had been deliberately skipped under the instruction rule.
- After `tasks.md` existed, CLI status showed tasks done and apply instructions reported `state: ready`, because apply requires tasks. The apply context correctly omitted the intentionally absent design.
- CLI `isPlanningComplete` remained false because OpenSpec 1.11.0 does not persist a conditional-design skip marker.

Conclusion: `CONDITIONAL_DESIGN_COMPATIBLE`

This is compatible through the existing workflow-adapter rule, with a known status-reporting limitation. Agents must never skip design merely to bypass a real dependency.

## Test C — `skip_specs: true`

Disposable change: `smoke-yuta-no-spec`

| Check                   | Result                     | Evidence                                                                                                                        |
| ----------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Metadata                | PASS                       | `.openspec.yaml` retained `schema: yuta-spec-driven` and set `skip_specs: true`                                                 |
| Proposal and analysis   | PASS                       | The proposal declared no capabilities; analysis concluded `NO_SPEC_BEHAVIOR_CHANGE`                                             |
| Specs status            | PASS                       | CLI reported `specs = skipped`; specs instructions returned `skipped: true` and warned not to create spec files                 |
| Dependency satisfaction | PASS                       | The skipped specs dependency was treated as done by downstream task instructions                                                |
| No invented requirement | PASS                       | Delta spec file count was zero                                                                                                  |
| Conditional design      | PASS WITH KNOWN LIMITATION | Design became ready through the satisfied specs dependency; deliberate design skip used the same bounded adapter rule as Test B |
| Tasks and apply         | PASS                       | After adapter-created `tasks.md`, apply reported `all_done`, read proposal/analysis/tasks, and did not request specs or design  |
| Validation              | PASS                       | Strict validation accepted zero deltas and reported the `skip_specs` informational reason                                       |
| Archive                 | PASS                       | Archive reported `specsUpdated: false`; the temp main-spec file count remained unchanged                                        |

Nuance: `skip_specs` is evaluated independently of the analysis dependency. Immediately after setting the marker, specs were `skipped` and design was `ready` even before proposal and analysis were complete. The first-ready workflow still selected proposal and then analysis, so the tested adapters did not bypass authority analysis.

Conclusion: `SKIP_SPECS_COMPATIBLE`

## Workflow Compatibility Matrix

| Workflow        | Result          | Notes                                                                                                                                                                                                                                                                        |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| new-change      | PASS            | Explicit `--schema yuta-spec-driven` persisted the custom schema; proposal was the first ready artifact                                                                                                                                                                      |
| continue-change | PASS            | CLI status exposed analysis as the first ready artifact after proposal, and the custom analysis instructions/template resolved normally                                                                                                                                      |
| propose         | PASS            | The apply-requirement closure covered tasks, design, specs, analysis, and proposal; conditional design and skipped specs were handled by the bounded adapter rules without omitting analysis                                                                                 |
| apply           | PASS            | CLI-provided context included analysis; task tracking continued to use `tasks.md`                                                                                                                                                                                            |
| verify          | WITH LIMITATION | Standard context, specs, design, task, and validation checks can run without crashing, and analysis is available as context; there is no analysis-specific semantic verifier, so its conclusion was not falsely claimed as semantically verified                             |
| sync-specs      | PASS            | The behavior delta was merged into the correct temp main-spec path as a main spec rather than copied raw; strict main-spec validation passed; a second sync assessment was a no-op with identical SHA-256 `21EF80E911F40C41C1F205851D11625287B25C450FE300F701D8765E37112875` |
| archive         | PASS            | The already-synced behavior change archived without reapplying specs, the no-spec change archived without creating a main spec, and both archived `.openspec.yaml` files retained `schema: yuta-spec-driven`                                                                 |

Final temporary validation passed all remaining active items: one change and one main spec, with zero failures.

## Known Limitations

- OpenSpec schema commands are experimental in 1.11.0 and may change.
- Verify has no analysis-specific semantic dimension. It can read analysis as context but cannot prove that authority or lifecycle reasoning inside it is correct.
- Conditional design skips are workflow-adapter decisions, not persisted CLI artifact states. Raw status therefore leaves design ready, planning incomplete, and tasks nominally blocked until the adapter creates tasks.
- `skip_specs: true` marks specs satisfied without waiting for analysis, which can make design appear ready early. New/continue/propose adapters must continue to select proposal and analysis before downstream work.
- Because conditional skip is not recorded by the CLI, archive readiness requires the workflow adapter to distinguish a reviewed deliberate skip from an actually missing required design.

## Repository Safety

The real repository was snapshotted before testing and checked again after the temporary workspace was removed, before this report was created.

| Protected state                             | Before                                                             | After cleanup     | Result |
| ------------------------------------------- | ------------------------------------------------------------------ | ----------------- | ------ |
| `git status --short` SHA-256                | `E03DED55E835B22BD09362077E21240AB93051AF83D5BC1654349E1861FDDB1D` | Same              | PASS   |
| `openspec/config.yaml` SHA-256              | `ADE39106DCBE9A78EDF1145A7E8BDFDA036AD946154FA27C3AAE574CDD1AE528` | Same              | PASS   |
| Custom `schema.yaml` SHA-256                | `FC5993E056BA21B1FC24FD8140F45FDE8935954C6016C50D54D1CE47EDAB387C` | Same              | PASS   |
| Full `yuta-spec-driven` schema tree SHA-256 | `F1D4228549AC87569D636A87E765FCF528F189924DBB97B4C7DA4D9C4F3A5523` | Same              | PASS   |
| Full `.agents/skills` tree SHA-256          | `62954980B1E3F23736C2850C002F60538CE861C7F43DD8D42BF6B2A9FA53855A` | Same              | PASS   |
| Real `openspec/specs` file count            | `0`                                                                | `0`               | PASS   |
| Real active `openspec/changes` file count   | `0`                                                                | `0`               | PASS   |
| Real custom schema validation/source        | Valid / `project`                                                  | Valid / `project` | PASS   |
| Temporary workspace                         | Present only during testing                                        | Removed           | PASS   |

No real OpenSpec change, main spec, config, schema, or skill was modified. No Product Knowledge or product code was modified. The pre-existing dirty worktree was preserved unchanged; this report is the only repository output from Step 7.2.

## Final Recommendation

`READY_TO_ACTIVATE_WITH_KNOWN_LIMITATIONS`

The custom schema and the tested local workflow adapters are compatible with OpenSpec 1.11.0 for behavior changes, conditional-design changes, and explicit no-spec changes. Activation remains a separate approval-gated step. This recommendation does not activate the schema, make `openspec/specs` normative, create a Product Decision, or change any lifecycle dimension.

Status: PROPOSED FOR REVIEW
