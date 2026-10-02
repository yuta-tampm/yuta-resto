# Round 165 history-preserving retry transition evidence

Change: `federated-control-towers-foundation`  
Command: `BRIDGE-ARCH-20260925-F9R2:165`  
Date: 2026-09-27

## Bounded implementation and source

The approved round-164 Human decision authorized a non-executing retry transition, not RC1/RC2. The round-165 command was complete and bound to `04j-duplicate-result-correction-evidence.md` SHA-256 `05888b3747bb6dafc56e7d411bd88d8bceab09eef686b51c5acf023c19ed7cc6`. The previous live runtime revision 5 had record hash `b30e014b76d38177c5cf88bf33f33b3378f32d363929d554dd4750b46062c8b7`, `STATE=TERMINAL`, `DELIVERY_UNCERTAIN`, `EXECUTION_UNCERTAIN`, one consumed Human authority proof, and old command `FED-LIVE-20260927-RC1-A1:1`.

Only `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`, its owning skill, and the tracked federation operating protocol were changed as implementation owners. The helper added an exact `RETRY_GENESIS` journal transition under the existing `FileShare.None` context lock. It requires the immutable parent hash, terminal uncertain state, unique old run and consumed proof, pending live probe, unambiguous lineage and unused target run. It retains the old revision and all budget, blocker, freeze, proof, run-binding and accepted-command history. The new `NOT_SENT` / `NONE` slots refer solely to the fresh retry; they do not recategorize the old uncertain command. A later same-conversation selection remains dependent on a fresh typed Human Gate and matching descriptor. Ordinary instance transfers keep the existing handoff rule.

## Focused validation before the one live state transition

| Check                                                                          | Result                                                                                                |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| PowerShell parser                                                              | PASS                                                                                                  |
| Helper `SelfTest` on `FED-QA-HISTORY-RETRY`                                    | 124/124 PASS; synthetic temp state removed; no live tower activated                                   |
| Retry parent, budget and proof carry                                           | PASS in focused SelfTest                                                                              |
| Ambiguous parent, non-terminal source, executable source and old replay denial | PASS in focused SelfTest                                                                              |
| Duplicate-result relay guard regression                                        | 5/5 PASS (`node --test .agents/skills/yuta-control-tower-bridge/scripts/result-relay-guard.test.mjs`) |

## Exactly one committed retry genesis

`PrepareHistoryPreservingRetry` was invoked once with old record hash `b30e014b76d38177c5cf88bf33f33b3378f32d363929d554dd4750b46062c8b7`, old decision `7da6f31b3cf326bf0de69d3471c4790f081505bdfdd1f8933ef23818bf00c96a`, old run/command `FED-LIVE-20260927-RC1-A1` / `FED-LIVE-20260927-RC1-A1:1`, and fresh target run `FED-LIVE-20260927-RC1-B1` in the same `FEDERATED-CONTROL-TOWERS-FOUNDATION` context and `BRIDGE-FEDERATED-CONTROL-TOWERS-ARCH` causal lineage. It committed revision 6, record hash `22256c8e2fcd47587bceaf543f3f887c1527e857643a0f00b81d334a6e271121`, with `PREVIOUS_RECORD_HASH` exactly the old hash and journal `EVENT_KIND=RETRY_GENESIS`. Read-back returned `FRESH_RETRY_NON_EXECUTING`, `ExecutableAuthority=false`, `HumanAuthorityConsumedForRetry=false`, and `BrowserActionSent=false`.

The old revision-5 journal payload still records uncertain delivery/execution. Read-only comparison of old journal payload against revision 6 showed exact equality for causal lineage, old accepted command, recovery budget, evaluator budget, consumed authority proofs, current freezes, run bindings, blockers, evidence-stop state and authorization reference. The new target run has no run binding or executable authority. A repeated transition using the old parent hash was rejected as stale. Attempting the old `LIVE_TOWER_SELECTION` decision against the fresh source was rejected for source ancestry mismatch before authority consumption.

## Prepared non-authorizing Human review

The fresh proposal is `decisions/live-selection-proposal-20260927-rc1-b1.json`, SHA-256 `916d6bdb8d0ee559d082dfee23c45e71b91222eefdaa24911eb0416baa2684ec`. The canonical pre-decision descriptor is `decisions/descriptors/3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5.json`, SHA-256 `8703c93c8d71aa08a939aa1806fbf37d5a5dab8a54cbd78eb5922e4f317bfd41`. Its deterministic `DECISION_ID` is `3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5`. No accepted-result, approval or semantic decision record exists for this fresh decision. The separate Human Gate remains pending.

## Repository checks and limits

`pnpm exec openspec validate federated-control-towers-foundation --strict`, `pnpm docs:check`, `pnpm architecture:check`, and `pnpm -r --if-present typecheck` passed. Scoped Prettier passed for the skill, operating protocol and proposal JSON. The canonical descriptor intentionally remains compact machine JSON; applying Prettier to it would change its reviewed SHA-256, so it was checked by canonicalization and deterministic `DECISION_ID` instead. PowerShell has no Prettier parser; its parser and focused SelfTest passed.

Historical round-161 RC1 `FAIL`, round-161 RC2 lock-exclusion-only evidence, and T18/T19 `FAIL` remain unchanged. The new RC1/RC2 are `NOT_RUN`; no fresh Human authority has been consumed. Phase 6 is `NOT_AUTHORIZED`, and Gate 3 is `NOT_READY`.
