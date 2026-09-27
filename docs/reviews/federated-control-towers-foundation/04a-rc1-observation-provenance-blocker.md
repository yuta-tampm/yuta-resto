# Federated Control Towers — RC1 observation provenance blocker

Change: `federated-control-towers-foundation`  
Boundary: Control Tower round `BRIDGE-ARCH-20260925-F9R2:138`  
Status: `PARTIAL_NEEDS_REVIEW`; production `RunLiveSelection` is fail closed. T18/T19 are not eligible for reassessment from this evidence.

Reviewed authority: Design SHA-256 `753bff4fa3324a5a8696be26c9d4e5360484f3093f9c916aaf0d21c681de56b1`; Sensitive Design `03w` SHA-256 `ddbd7993e59072d24087ccbbed992315d1f3ac234bc3424a0bbb4262ba54e5a1`; Tasks/TIC `03x` SHA-256 `0b67cb70db3ff0c5873f7d9eca6bcb3833fda9b4ffb9b45db1c705f7f098555b`; current `tasks.md` SHA-256 `3ddf37e74152ecc6adfe2fe8eea632db5cbc9f6ddaba609d11740e189dedc9a3`.

## Bounded findings

1. The exact current-user `AUTHORIZE LIVE TOWER SELECTION IMPLEMENTATION CORRECTION` decision is now recorded in `03y-live-tower-selection-implementation-correction-authorization-gate.md`, with the pre-approval packet hash and round-135/136 lineage. This is review provenance, not a runtime `LIVE_TOWER_SELECTION` decision or permission to activate a tower.
2. The round-136 candidate `03z-live-tower-selection-implementation-correction-evidence.md` remains unchanged at SHA-256 `d1a1ee5b93b808e9264d72acca6c5024cde77c87178f2291b2012b0653e15b56`. Its acceptance claim was rejected in round 137. Caller-provided JSON on stdin can assert `TRANSPORT_SOURCE=CODEX_CUA_ACTUAL_UI` and arbitrary artifact hashes. Neither that string nor synthetic SelfTest data proves an actual browser observation.
3. The approved UI transport is available to the Codex coordinator, but the PowerShell helper has no internally callable trusted UI-observation adapter. The three approved implementation owners do not provide a way for `RunLiveSelection` itself to obtain and bind actual browser evidence under its lock. A new external attestation system, signed tool receipt, browser credential, provider API, or implementation owner is outside this correction. No such trust root was invented.
4. The production `RunLiveSelection` entrypoint now throws `NEEDS_REVIEW: trusted in-process UI observation adapter unavailable; caller metadata cannot authorize ACTIVE` before lock acquisition or runtime mutation. Proposed downstream transaction code is unreachable and remains review material. The skill and tracked operating protocol now state this stop explicitly. This guard prevents the known caller-metadata impersonation path from creating executable authority; it does not complete RC1.

## Scoped changes and evidence

| Path                                                                                                                        | Bounded delta                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`                                                     | Add unconditional production fail-closed guard at `RunLiveSelection` entrypoint. No schema, Bridge v1 wire grammar, synthetic command lineage, or Human Gate rule changed. |
| `.agents/skills/yuta-federated-control-towers/SKILL.md`                                                                     | Replace the live-provenance completion claim with the production stop and explicit review boundary.                                                                        |
| `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`                                                          | Record that stdin/browser metadata is a caller assertion and cannot authorize `ACTIVE`.                                                                                    |
| `docs/reviews/federated-control-towers-foundation/03y-live-tower-selection-implementation-correction-authorization-gate.md` | Record the exact Human correction authorization and its bound reviewed packet; retain the original packet hash.                                                            |
| This addendum                                                                                                               | Preserve round-137 rejection and round-138 blocker separately from the immutable `03z` candidate.                                                                          |

Focused command: `& .agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1 -Action RunLiveSelection -ExecutionContextId LIVE-OBSERVATION-FAILCLOSED-20260926 -ExpectedCheckoutRoot (Get-Location).Path -ExpectedHostLabel ([System.Net.Dns]::GetHostName()) -DecisionId ('a' * 64)`. It returned the expected `NEEDS_REVIEW` error, and the target runtime-state directory did not exist afterward. PowerShell parser reported zero errors.

The original `03y` preapproval SHA-256 was `31e5c22e12bf2707b5495d9d1b2c3ecd25a2f08127b58074fab520ad62cccdd6`; its updated recorded-approval SHA-256 is `589e950831b8d91b68eced4e6f2c82827225e8d588800219b6d66045bb510b01`.

| Implementation owner                                                    | Before round 138 SHA-256                                           | After round 138 SHA-256                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `.agents/skills/yuta-federated-control-towers/SKILL.md`                 | `ebd4ff83a91ecb4b059bf7e60e0899b7e23e896851313c239918c7b1b2aef70d` | `b18b6bef17fc4045cb08af21fea99f7a58a5ceedc55f0e199b52ff002787c8b0` |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` | `6dae3a31248065455e2c9ec5bef637c5e7a00a440f0aaaf600bb0b9366584d00` | `8c363d4ff750ab9501470db54996976e17ce21dc6377951945d00517041c0bdc` |
| `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`      | `35b6f069b8aa66555445b765d95d9cfa271e7cfdb66229fd585954c3e656dcef` | `462c3466605b8808abb2cabee5eeedb20bbf1164e79611148cc0c80838bfd657` |

The isolated `SelfTest` command with `-ExecutionContextId FED-QA-SELFTEST-20260926`, current checkout root and host label passed `109/109` synthetic checks; `CanonicalRuntimeStateCreated=False` and `LiveTowerActivated=False`. Synthetic state and lock were removed. This does not count as a live UI observation or an RC1 pass.

`pnpm exec openspec validate federated-control-towers-foundation --strict`, `pnpm docs:check` (36 current documents), `pnpm architecture:check`, and `pnpm -r --if-present typecheck` (15/16 workspace projects in scope) passed after the guard and documentation changes. Scoped formatting is checked separately. No real tower, browser probe, Page Chat access, or live-context mutation occurred.

## Stop and lifecycle

The remaining question is material to single-active executable authority: a caller can otherwise impersonate actual browser observation. Resolve the trusted observation boundary through a separately reviewed architecture and Human decision; do not infer completion from the synthetic suite or attempt live activation. Historical `03r` T18 `FAIL` and `03s` T19 `FAIL` remain unchanged; progress is `19/24`; T20–T24 are unchecked; Phase 6 is `NOT_AUTHORIZED`; Federated Browser QA Q01–Q35 is `NOT_RUN`; Gate 3 is `NOT_READY`. No Phase 3/Phase 6 advancement, commit, push, PR, merge, deployment, release, sync, or archive occurred.
