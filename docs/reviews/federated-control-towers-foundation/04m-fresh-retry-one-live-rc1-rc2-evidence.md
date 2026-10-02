# Fresh retry — one live RC1/RC2 transaction evidence

Change: `federated-control-towers-foundation`  
Date: 2026-09-27  
Outer Bridge command: `BRIDGE-FRESHGATE-20260927-C11790A1:3`  
Scope: one fresh `LIVE_TOWER_SELECTION`, one read-only browser probe, and one concurrent lock-exclusion proof

## Human authority and immutable records

The Human selected the exact label `APPROVE LIVE TOWER SELECTION` for item `BRIDGE-FRESHGATE-20260927-C11790A1:2#1`. One bound round-2 `YUTA_CODEX_RESULT` carried `CURRENT_USER_DECISION=APPROVE_LIVE_TOWER_SELECTION`; the Control Tower then issued the distinct round-3 recording and transaction command. The semantic `DECISION_ID` remained `3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5`. The pre-approval [packet](04l-fresh-retry-live-selection-human-gate.md) SHA-256 was `ad9f94c4b5b02706c3ea5edcfc005ac20174ae89ffb4748e9dc3c1b30176e51b`; descriptor SHA-256 was `8703c93c8d71aa08a939aa1806fbf37d5a5dab8a54cbd78eb5922e4f317bfd41`.

The one-way records were created in order with a flush and read-back after each write:

| Record                                                                                                               | SHA-256                                                            |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Accepted gate result](decisions/gate-results/2662ef55bda62f13625432cd9714f3f471886525230e2e957cd055a3d11d602d.json) | `d2a48df34c6920e7580036aa6491e713685b04b658af252c9ecbe4e2f979f563` |
| [Approval](decisions/approvals/0077c5d0e3eaaa9174b6484491d3c1b8b9fe9cb3dc293e698dd95e7a39fa86e8.json)                | `7268d42ecce2558749876cf9cc1954ef7a2f2a55cb480928373667675ae5d6a6` |
| [Semantic decision](decisions/3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5.json)                 | `2401269f4926f4ceb5e7a44b2e82ef07a786f60616f98aa8f67269d4aacd561f` |

`RESULT_HASH=2662ef55bda62f13625432cd9714f3f471886525230e2e957cd055a3d11d602d`. The helper validated this chain before consuming the new authority exactly once. The new consumed proof SHA-256 is `cc5e0dc3db2381ddf187cb22052111e2a0a2011c572dd8e0d84472c2e6a89b2c`. The old consumed proof `eb5d0a31b73ba2095c5f7aec4468e615de0b921eddd6c72682cea3ece880f27c` remains present and non-replayable.

## RC1 — exact built-in-browser round trip

Windows/NTFS/checkout/host preflight passed without acquiring a lock. The source was `TERMINAL`, revision `6`, epoch `1`, record hash `22256c8e2fcd47587bceaf543f3f887c1527e857643a0f00b81d334a6e271121`. `RunLiveSelection` acquired the local exclusive lock, journaled authority consumption and one fresh `PROBE_INTENT`, then waited for Codex browser evidence while retaining that same lock. Its probe-intent event hash was `0de754cfc917121b4e942e8a878476ad3d7a229a205207c728abe0e58089d5a2`.

The actual Codex in-app browser showed the exact `YUTA — Control Tower` title, Project `g-p-6a4d778944108191894f8e3657742da4`, and conversation `6ab40aa1-ea94-83eb-85be-dafbbef3ddef`. The fresh inner run `FED-LIVE-20260927-RC1-B1` posted one valid handshake. The Control Tower issued one complete protocol-v1 read-only command `FED-LIVE-20260927-RC1-B1:1`, with the expected causal lineage. Codex posted exactly one bound `YUTA_CODEX_RESULT` for that command; there was no resend or second relay. To keep the URL on one protocol content line, the result serialized its scheme as `HTTPS://`; the same host/path and conversation ID were observed, and the Control Tower explicitly accepted the case-insensitive scheme normalization.

The Control Tower's completed evaluation was `ACCEPTED`, reported `PROTOCOL_VALID=PASS`, `RESULT_RELAY_COUNT=1`, `DUPLICATE_RESULT_RELAY=NO`, `RESEND_PERFORMED=NO`, and `RC1_LIVE_RESULT=PASS`. Codex independently observed one posted result in this run and the matching completed evaluation. SHA-256 digests of the exact posted handshake, complete command block, posted result, and normalized visible evaluation text were respectively `8d2a96a3dbb5e6e5f9ab3c8da59213a0837555ef80e42ce249d497f5cfc92e5f`, `b0cc565e7a8688b8442dd054d285f3b6ede8cad49138354f76af66eb49fefc8c`, `9630846c7a456462b1fb33f22e5e51a28e9753826f0326023093041e75b25776`, and `68898f8d7f6c6809babd9098f992337adb0cdc4a837638852f47f5cbd134d0d3`. The evaluation digest is over normalized accessibility text, not a transcript artifact or cryptographic browser attestation.

**RC1_LIVE_BUILT_IN_BROWSER_ROUND_TRIP: PASS** for this one transaction. No Page Chat was accessed and the inner browser command made no repository or environment mutation.

## RC2 — same-context authority exclusion

The primary helper process ID was `14096`. While it held the lock and waited for browser evidence, independent process `12676` tried `FileStream(FileMode.Open, FileAccess.ReadWrite, FileShare.None)` on the exact same context lock and received a sharing violation. Activation-file SHA-256 before and after this attempt remained `cff4de9ffac06f3d287c860ef4977c9cdf684375f1f07082826a07621914b9e0`. The competitor acquired no lock and made no state mutation.

The primary helper accepted the single bounded continuation, journaled `PROBE_OUTCOME` at revision `10`, then `ACTIVE_COMMIT` at revision `11` before releasing its lock. It returned `LIVE_ACTIVE_COMMIT`, final record hash `54568aeb8039f6c843b2d6615b2eb85ed460e3ba2f5fefb130a9515291533255`, and `ExecutableAuthority=True` for the exact new run. After process exit, a separate read-only attempt acquired and released the same lock; activation-file SHA-256 stayed `5a3e39a237a5473f1c72608dbf1c571d3d6cb93d0e74493b9e90e4d8c331ca84` during that attempt.

The final activation snapshot is `ACTIVE`, epoch `2`, revision `11`, `ACTIVE_RUN_ID=FED-LIVE-20260927-RC1-B1`, `DELIVERY_STATE=RESPONSE_COMPLETE`, and `EXECUTION_STATE=COMPLETED`. The old `FED-LIVE-20260927-RC1-A1` run remains `TERMINAL`; the new run alone is `ACTIVE`. Recovery-budget use and maximum remain `0/2`; both consumed proofs and the causal lineage are preserved. Helper activation validation passed, and all 12 journal records passed schema validation. The synthetic-only `ReconcileFixture` entrypoint rejected this live context as designed; its rejection is not positive live reconciliation evidence.

**RC2_LIVE_AUTHORITY_EXCLUSIVITY: PASS** for this single-host, same-context transaction. This observation does not prove behavior for other hosts or executors that bypass the approved helper.

## Disposition and remaining gates

`MATERIAL_A_STATUS=PASS` for the observed single command/result and one-time authority consumption; `MATERIAL_B_STATUS=PASS` for the exact typed Human Gate chain; `MATERIAL_C_STATUS=PASS` for the held-lock exclusion and one active run in this context. No safety-critical A/B/C violation was observed in this transaction. The previously recorded duplicate-result RC1 `FAIL` and historical T18/T19 `FAIL` remain historical facts and were not rewritten. Fresh T18 Technical Compliance and T19 Formal VERIFY were **not run**. Phase 6 and Q01–Q35 Browser QA were **not run** and remain separately gated; Gate 3 is **NOT_READY**. No Phase 6 action, Page Chat access, commit, push, PR, merge, deploy, release, sync, or archive occurred.
