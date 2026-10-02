# Round 162 duplicate result correction

Change: `federated-control-towers-foundation`  
Outer command: `BRIDGE-ARCH-20260925-F9R2:162`  
Date: 2026-09-27

## Historical evidence and cause

The [04i evidence](04i-one-live-rc1-rc2-evidence.md) remained byte-identical at SHA-256 `a951eae2d0fd5e15ed55a069d044617dfb0a8f77b0dc3195576a61b186ad28b9`. Round 161 retains `HUMAN_AUTHORITY_BINDING=PASS`, `RC1=FAIL`, and `RC2=PASS_LOCK_EXCLUSION_ONLY`. One inner command `FED-LIVE-20260927-RC1-A1:1` and one consumed Human authority proof were observed. Two browser messages carried results for that same command. There is no evidence of a second command execution or authority consumption.

The second result originated in Codex's built-in-browser relay orchestration: after the first result had been posted with a literal URL, Codex submitted an equivalent result with percent-encoded URL to correct formatting. The helper received no positive continuation and did not cause the second browser send. The Control Tower evaluated the second relay as accepted, but that evaluation cannot override the independent one-result Bridge v1 rule. The cause was a second UI submission after the first post, not the URL encoding itself.

The original round-162 response rendered multiline Markdown lists whose exact indentation could not be established from the UI. One non-executable diagnostic requested the same identity and scope with scalar fields. The subsequent complete command had protocol version 1, exact run/round/command/lineage, every mandatory field once, a closing delimiter, and no unknown fields. Only that complete round-162 command was accepted.

## Bounded correction

- `.agents/skills/yuta-control-tower-bridge/SKILL.md` now requires a complete, validated draft and a browser history check before the sole Send. Once Send is activated, editing, replacing or submitting a corrected result is prohibited; a visible duplicate is a protocol failure, not a correction.
- `.agents/skills/yuta-control-tower-bridge/scripts/result-relay-guard.mjs` provides an in-memory identity decision aid. It rejects another send for the same run/round/command after activation, when a result is already visible, or when delivery/history is uncertain. It does not observe the browser or independently establish provenance. The actual selected conversation remains the observation source.
- `.agents/skills/yuta-control-tower-bridge/scripts/result-relay-guard.test.mjs` exercises first-result allowance, duplicate-result detection including changed encoding, no second send after activation or uncertainty, incomplete-history denial, and separate command identity.
- `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` adds an exact `TerminalizeUncertainLiveSelection` action. It requires the current record hash, decision ID, run and command under the existing exclusive lock. It preserves uncertain delivery/execution, consumed proof, budgets, journal, and non-replayability while committing a terminal non-executable state. The federated skill documents this boundary.

These changes do not alter Bridge v1 wire grammar, Human Gate validation, Page Chat authority or Product code. The guard and synthetic checks do not establish a future live RC1 PASS.

## Focused revalidation and recovery

| Check                                                                                       | Observed result                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node --test .agents/skills/yuta-control-tower-bridge/scripts/result-relay-guard.test.mjs`  | 5 PASS, 0 FAIL.                                                                                                                                                                                                                               |
| Helper `SelfTest` with exact checkout, host and synthetic `FED-QA-DUPLICATE-RESULT` context | 119 PASS, 0 FAIL; no live tower activated. Includes terminal uncertainty preservation, replay denial, wrong authority denial, authority once-only, and competing lock denial.                                                                 |
| Live preflight                                                                              | Windows, NTFS, exact checkout, host and context PASS; no state or lock mutation from preflight.                                                                                                                                               |
| Exact terminal recovery                                                                     | One `TerminalizeUncertainLiveSelection` on the round-161 record hash `2f34a9cc8f9b7407da0a2eec9f033fed534a58f46b9a39457167152cd5cb7df3` committed revision 5, record hash `b30e014b76d38177c5cf88bf33f33b3378f32d363929d554dd4750b46062c8b7`. |

The read-back state is `TERMINAL`, `DELIVERY_UNCERTAIN`, `EXECUTION_UNCERTAIN`, `ExecutableAuthority=false`, one consumed authority proof, and the old command identity remains `FED-LIVE-20260927-RC1-A1:1`. The old authority and command are not replayable. No new live RC1/RC2 transaction or Human decision occurred. A fresh live selection remains blocked by the helper's uncertain-source guard until separately reviewed recovery and fresh typed Human authority establish a safe path; this correction grants neither.

Historical T18/T19 `FAIL` remain unchanged. T18/T19 were not rerun. Phase 6 Browser QA remains `NOT_RUN`; Phase 6 is not authorized.

Additional checks passed: activation validation, all 6 journal records, OpenSpec strict validation, `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck` across the reported 15 workspace projects, scoped Prettier, and the PowerShell parser. These repository checks do not reassess T18 or T19.
