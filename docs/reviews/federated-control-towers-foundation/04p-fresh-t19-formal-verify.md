# Federated Control Towers — fresh T19 formal VERIFY

Change: `federated-control-towers-foundation`  
Date: 2026-09-27  
Authorization: `AUTHORIZE FRESH T19 FORMAL VERIFY`, Control Tower command `BRIDGE-FRESHGATE-20260927-C11790A1:11`  
Scope: independent implementation VERIFY; Phase 6 Browser QA remains unauthorized and not run  
Result: **PASS** for the implementation contract, with the live QA limits below

## Candidate, method, and preserved history

This reassessment independently compares the current 14 Requirements and 39 Scenarios, approved Design, Tasks/TIC, implementation owners, current local state, and bounded live evidence. It does not inherit the [fresh T18 PASS](04o-second-fresh-t18-technical-compliance-reassessment.md) as its verdict. A scenario marked PASS here has a supported implementation path or fail-closed guard; it does **not** mean its separate Phase 6 browser case passed. One live Global selection and one same-context lock exclusion were observed in 04m. Live Page routing, Page/Global transfer, rotation, crash windows, real delivery uncertainty, and Q01–Q35 remain untested in Phase 6.

| Reviewed source                 | SHA-256                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| Delta Spec                      | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` |
| Approved Design                 | `753bff4fa3324a5a8696be26c9d4e5360484f3093f9c916aaf0d21c681de56b1` |
| Tasks/TIC                       | `3ddf37e74152ecc6adfe2fe8eea632db5cbc9f6ddaba609d11740e189dedc9a3` |
| State helper                    | `0364517af34cb5d5fbb20e5382abd3d12e716e0ff3f31e4c5daae105e2c47a8e` |
| Federated skill                 | `df1faf2ee068d2b14619222d6ae867308f62b7b5a0b559bdb19b4b34c6a0a1c7` |
| Bridge v1 skill                 | `95c36019369ca4a7cc9e9cd402c8c5722523f8ad04e38bafa78d3c5193d95f56` |
| Tracked operating protocol      | `b57276e2b5bb90ad6d39518174f6031939675b8db05ce9603a52efee87495cc0` |
| 04j duplicate-result correction | `05888b3747bb6dafc56e7d411bd88d8bceab09eef686b51c5acf023c19ed7cc6` |
| 04k history-preserving retry    | `8caa2c8e0c2fb9137e416d39407a2ce21ab6f22d87b4801af1cdbccf8ed95806` |
| 04m one live RC1/RC2            | `9a11e2903a1ea9fb11afe074c0dd77e2a4e13bb2b5db056af616c91cd41f0262` |
| 04o second fresh T18            | `90fba6f78cc58d4a59dae6b721b22d7f1c7bf826a03d857a4a25f09aaa519e97` |

The [original T19](03s-phase5-formal-verify.md) remains **FAIL**, SHA-256 `1d5957902bd809688759155f77a4a6f7fa96b82202f738186d77782ba3985775`. Historical T18 FAIL reports [03r](03r-phase5-technical-compliance.md) and [04n](04n-fresh-t18-technical-compliance-reassessment.md) remain **FAIL**, respectively SHA-256 `9bf01c74a952df9beede6c6e4e9799f110039e1b9ac9dfc51999c49e9d2bda7c` and `86da218eab6047d2ebe2ede4b5b81c0e382ca618fc46ef2a591bf2ca30e1ec9b`. The earlier candidate lacked real executable selection. The current helper has a separately authorized `RunLiveSelection` path, and 04m exercised it once. No historical verdict is relabeled.

Evidence keys: `H` = current state helper; `S` = federated skill; `P` = tracked operating protocol; `B` = unchanged Bridge v1 skill and result relay guard; `L` = 04m live RC1/RC2; `D` = 04j; `R` = 04k; `ST` = prior 124/124 isolated helper SelfTest on the identical helper hash. `ST` is supporting synthetic evidence, never live browser QA. Q numbers below name **pending** Phase 6 cases.

## Requirement assessment

| Requirement | Result | Independent implementation conclusion                                                                                             | Phase 6 limit               |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| F1          | PASS   | Explicit mode and unchanged Bridge v1 boundary in S/P; one selected Global run in L.                                              | Q01/Q33                     |
| F2          | PASS   | Role/scope/owner/instance are distinct; Page Product authority remains with owning Page Chat (S/P/H).                             | Q02/Q07/Q32                 |
| F3          | PASS   | Exact Page target and Page→Global transfer path exist; invalid owner/scope blocks (H/S/P).                                        | Q07/Q08 live routing        |
| F4          | PASS   | One held local `FileShare.None` lock spans live selection; L denied a competing process and committed one active run.             | Q01–Q04/Q21                 |
| F5          | PASS   | Exact UI target plus Human authority, durable fence, bound probe and active commit are required; L observed one Global selection. | Q03/Q27/transfer            |
| F6          | PASS   | Page→Global handoff preserves lineage, budgets, proofs and blockers (H/S/P); no execution between fence and commit.               | Q08/Q25 live transfer       |
| F7          | PASS   | Immutable hash-bound, one-use handoff is context evidence only (H/ST/S/P).                                                        | Q23/Q24                     |
| F8          | PASS   | Fresh run/epoch with unchanged lineage; R/L preserve old uncertain command and create distinct B1 run.                            | Q09/Q10/Q25                 |
| F9          | PASS   | v1 identity/grammar and at-most-once retained; D guard 5/5, L one result/evaluation and no resend.                                | Q28/Q29 real uncertainty    |
| F10         | PASS   | Fence-first Page/Global rotation and non-executing restart reconciliation exist (H/S/P/ST).                                       | Q09–Q20 live rotation/crash |
| F11         | PASS   | Journal/hash/snapshot and source-specific authority rules exist; current live activation and journal validate.                    | Q31 real discrepancy        |
| F12         | PASS   | Four exact intake states, attributable source/gaps and no inference from UNKNOWN (H/S/P/ST).                                      | Q30/Q31 real Page source    |
| F13         | PASS   | Exact accepted Human chain and consumed proof, separate side-effect gates, English protocol/Vietnamese Human updates (H/S/P/L).   | Q26/Q32                     |
| F14         | PASS   | Tracked prompt is not live proof; L establishes only one instance; Q01–Q35 and Gate 3 remain separate.                            | Q01–Q35                     |

Requirement count: **14 PASS, 0 FAIL, 0 BLOCKED, 0 N/A**. These are implementation VERIFY classifications, not Browser QA classifications.

## All 39 scenario assessments

| Scenario | Result | Evidence and exact limit                                                                                                                 | Pending QA  |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| F1.1     | PASS   | S/P retain Bridge v1 absent valid federation activation.                                                                                 | Q33         |
| F1.2     | PASS   | H `RunLiveSelection` plus L verified explicit selected Global context.                                                                   | Q01         |
| F1.3     | PASS   | S/P keep Bridge v1 QA historical and separate.                                                                                           | Q33         |
| F2.1     | PASS   | H requires Page role, owner, scope and instance; S/P retain Page Product authority. No Page live selection claimed.                      | Q02/Q07     |
| F2.2     | PASS   | H identity uses exact Project/conversation, never title alone.                                                                           | Q02         |
| F2.3     | PASS   | H/S/P reject Page scope expansion.                                                                                                       | Q07/Q08     |
| F3.1     | PASS   | H exact target selection supports Page role, with owning Page boundary in S/P. Live Page send pending.                                   | Q07         |
| F3.2     | PASS   | Missing owner/scope/activation blocks; Codex cannot guess Page target.                                                                   | Q07         |
| F3.3     | PASS   | H fence/handoff/new selection path and S/P require Workflow v3 escalation. Live Page→Global pending.                                     | Q08         |
| F4.1     | PASS   | H commits one exact active run; L observed held lock and one active Global run.                                                          | Q01/Q04     |
| F4.2     | PASS   | H conflicting claims/lock reject; L competitor could not acquire the context lock.                                                       | Q04/Q21     |
| F4.3     | PASS   | H/S/P fail closed when exclusivity is unproven; no title/timeout inference.                                                              | Q04/Q20     |
| F5.1     | PASS   | H requires fenced old run, valid source/handoff/probe; L proves one safe terminal-to-new-Global selection. Other transfer types pending. | Q01/Q03     |
| F5.2     | PASS   | S/P require visible exact target; H rejects mismatched bound target.                                                                     | Q27         |
| F5.3     | PASS   | H run/epoch/instance journal rejects old command; R preserves A1 non-replayability.                                                      | Q05         |
| F6.1     | PASS   | H ACTIVE→FENCING→TERMINAL, Page→Global handoff and fresh selection enforce stop before new authority.                                    | Q08         |
| F6.2     | PASS   | H leaves no executable run between fence and verified active commit.                                                                     | Q08/Q14     |
| F7.1     | PASS   | H validates immutable source, target, hash and carried state before consume.                                                             | Q23         |
| F7.2     | PASS   | H denies absent, stale, conflicting or consumed handoff.                                                                                 | Q23/Q24     |
| F7.3     | PASS   | S/P/H do not turn handoff into Apply or Human authorization.                                                                             | Q26         |
| F8.1     | PASS   | H requires new run after terminal/hand-off; R/L show A1 terminal and fresh B1 live run. Different instance pending.                      | Q09/Q10/Q25 |
| F8.2     | PASS   | H rejects reused run/wrong lineage; title or stage change does not transfer identity.                                                    | Q25         |
| F9.1     | PASS   | H accepted-command ledger and consumed proof reject replay; old A1 command remains non-replayable.                                       | Q29         |
| F9.2     | PASS   | H records uncertain outcome and forbids resend; D/R preserve uncertainty. Real browser interruption pending.                             | Q28         |
| F9.3     | PASS   | B requires complete v1 block and exact lineage/result binding; no prose execution.                                                       | Q27/Q33     |
| F10.1    | PASS   | H Page rotation path binds owner, new instance/run and handoff; live Page rotation pending.                                              | Q09         |
| F10.2    | PASS   | H Global rotation path carries budgets/proofs and denies old command; live rotation pending.                                             | Q10         |
| F10.3    | PASS   | H rejects missing/corrupt journal, orphan state and unproven old authority.                                                              | Q20         |
| F11.1    | PASS   | H reconciles journal/snapshot/handoff with approval/hash references before continuation.                                                 | Q23/Q25     |
| F11.2    | PASS   | S/P require discrepancy report and forbid chat memory from overriding repo/approval evidence. Real Page discrepancy pending.             | Q31         |
| F12.1    | PASS   | H accepts AVAILABLE only with attributable sufficient Page source. Real Page source pending.                                             | Q30         |
| F12.2    | PASS   | H/S/P preserve PARTIAL and explicit gaps; dependent Product inference stops.                                                             | Q30         |
| F12.3    | PASS   | H/S/P preserve UNKNOWN and reject similar-chat substitution/no-prior-requirement inference.                                              | Q30         |
| F12.4    | PASS   | NOT_APPLICABLE requires no owning Page context and a tooling/workflow reason.                                                            | Q30         |
| F13.1    | PASS   | H exact result/token/approval/decision proof chain; missing current Human result blocks.                                                 | Q26         |
| F13.2    | PASS   | H/S/P reject out-of-scope side effects; L used a separate one-time Human selection only.                                                 | Q32         |
| F13.3    | PASS   | B/P/S retain English machine fields, Vietnamese Human updates, distinct VERIFY/QA/limits.                                                | Q32         |
| F14.1    | PASS   | P says tracked instructions do not auto-sync; L observed actual Control Tower context.                                                   | Q34         |
| F14.2    | PASS   | 35 QA cases remain NOT_RUN, Gate 3 NOT_READY; no historical Bridge v1 promotion.                                                         | Q01–Q35     |

Scenario count: **39 PASS, 0 FAIL, 0 BLOCKED, 0 N/A**. The table verifies code and bounded evidence against the 39 Spec scenarios. It makes no claim that 39 live scenarios were observed.

## Design, boundaries, checks, and limitations

**Design VERIFY: PASS.** D1–D8 have implementation evidence: D1 exact target/L; D2 Windows/NTFS/exclusive lock/L; D3 durable activation, budgets, Human proofs, freeze and monotonic guards/H/ST; D4 immutable one-use handoff/H/ST; D5 unchanged v1 grammar plus `PROBE_INTENT→PROBE_OUTCOME→ACTIVE_COMMIT`/H/L; D6 fence-first transfer, rotation and fail-closed recovery/H/ST; D7 Page authority and metadata-only privacy/H/S/P; D8 exact Human Gate and separate QA/H/S/P/L. The live proof covers one Global selection only; the other live paths are Phase 6 obligations. No new wire field, Chrome/Playwright active direction, multi-host claim, Product authority, Page Chat rule change, or Workflow v3 authority change was found in the scoped owners.

**Human authority and at-most-once: PASS within the supported boundary.** H verifies the descriptor → accepted result → approval → semantic decision chain and consumes a bound proof under the context lock before the browser probe. D shows the prior duplicate result failure and its correction; R keeps its old uncertain command and consumed authority; L shows a fresh one-time authority and exactly one new result/evaluation. An accepted command with missing outcome remains uncertain and non-replayable. The current live record retains both consumed proofs. The `FileShare.None` proof is same-host/same-checkout/approved-helper only, not distributed or bypass-helper proof.

**Current read-only state:** `ACTIVE`, epoch 2, revision 11, run `FED-LIVE-20260927-RC1-B1`, record hash `54568aeb8039f6c843b2d6615b2eb85ed460e3ba2f5fefb130a9515291533255`, two consumed proofs. All 12 journal event files validate against the helper schema. No runtime mutation or Page Chat access occurred during this T19 reassessment.

**Known evidence limitations:** 04m is one actual built-in-browser transaction, not cryptographic browser attestation or full federation QA. The duplicate-result guard is an in-memory decision aid; browser history remains the observation source. The operating protocol's opening status was a snapshot before 04o and still calls fresh T18 FAIL / T19 NOT_RUN; 04o supersedes that assessment status without changing the underlying operating rules. This T19 artifact records the current assessment without editing that owner. The prior 124/124 helper SelfTest applies by identical helper SHA-256 but was not rerun here. Live Page context AVAILABLE/PARTIAL/UNKNOWN, live Page→Global and rotations, crash windows, and delivery uncertainty remain Phase 6 evidence gaps, not presumed QA PASS.

| Check                                   | Result                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------- |
| OpenSpec strict                         | PASS: change valid                                                     |
| `pnpm docs:check`                       | PASS: 36 current documents                                             |
| `pnpm architecture:check`               | PASS                                                                   |
| `pnpm -r --if-present typecheck`        | PASS: 15 of 16 workspace projects in scope                             |
| PowerShell parser                       | PASS                                                                   |
| Bridge result relay guard               | PASS: 5/5                                                              |
| Read-only activation and journal schema | PASS: activation valid and 12/12 journal events valid                  |
| Scoped Prettier                         | PASS                                                                   |
| Repository-wide format baseline         | 04o recorded FAIL on 93 unrelated files; not a scoped artifact defect. |

**Disposition:** Fresh T19 formal VERIFY is **PASS** on the implementation contract. Phase 6 Q01–Q35 remains `NOT_RUN` and `NOT_AUTHORIZED`; its only next normal step is a **separate Human Gate**. Gate 3 is `NOT_READY`. No Phase 6 test, Gate 3 promotion, historical relabeling, commit, push, PR, merge, deploy, release, sync or archive is authorized by this artifact.
