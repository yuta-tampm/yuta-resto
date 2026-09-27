# Federated Control Towers — T19 independent formal VERIFY

Change: `federated-control-towers-foundation`  
Scope: Phase 5 / T19, after T18 terminal `FAIL`  
Result: **FAIL**  
Federated Browser QA: `NOT_RUN`; Gate 3: `NOT_READY`

## Execution decision and independent method

Tasks 5.1 and 5.2 require running assessments in sequence; neither task nor the current YUTA Workflow v3 makes T18 `PASS` a prerequisite to _perform_ VERIFY. The workflow explicitly permits recording `VERIFY: FAIL` when the implementation differs from approved Spec/Design. T19 therefore ran after T18 reached a truthful terminal result. The T18 result was treated as a finding to challenge, not as inherited proof.

I independently re-read the approved Spec (SHA-256 `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0`), Design (`a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`), Tasks/TIC (`f64382b3d0c844f9430b9f5b89f3be3b100af56a8ede6307cb01a2311458b3f8` before Phase 5), current implementation owners, relevant Sensitive Design reviews `02g`/`02l`/`02p`/`02t`/`02x`/`03c`/`03h`, helper convergence `03k`, Phase 3 `03m`, accepted Phase 4 `03p`, and T18 `03r`. The helper's exported action set, `FED-QA-*` path gate, lock scope, synthetic probe and `ExecutableAuthority=false` are directly visible in source, independent of historical review assertions. A positive real federation flow cannot be executed by this candidate. That gap agrees with T18 TC-01/02/03.

Evidence key: `H` = current `state-helper.ps1`; `S` = current federated skill; `P` = current tracked operating protocol; `E3` = Phase-3 local fixtures; `E4` = accepted Phase-4 synthetic local flow; `ST` = current 83/83 helper SelfTest. `Qnn` denotes **unrun** required Phase-6 Browser QA, never a PASS citation. `PASS` here means the repository contract/negative guard is implemented and locally supported, while the indicated live QA remains pending. `BLOCKED` means the specific real source cannot yet be assessed. `FAIL` means current implementation lacks or contradicts approved behavior, independently of missing live QA.

## Requirement results

| Requirement | Status  | Independent finding                                                                                                                  | Later QA boundary |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| F1          | FAIL    | v1 isolation exists, but selectable federation has no live executable path (S/H).                                                    | Q01/Q33           |
| F2          | FAIL    | Role and Product boundaries are represented, but a real owning Page tower cannot be activated.                                       | Q02/Q07/Q32       |
| F3          | FAIL    | Direct Page routing and live Global escalation are described, not executable (S/H).                                                  | Q07/Q08           |
| F4          | FAIL    | Local exclusion fails closed; no live executable active tower can be established.                                                    | Q01–Q04/Q21       |
| F5          | FAIL    | Probe and exact observation are synthetic/caller supplied; no real activation or send integration.                                   | Q01/Q03/Q27       |
| F6          | FAIL    | Synthetic transfer carries lineage; live Page→Global escalation is absent.                                                           | Q08/Q25           |
| F7          | PASS    | Immutable handoff, source/hash and once-only checks are implemented locally (H/ST/E3).                                               | Q23/Q24           |
| F8          | FAIL    | Fresh run and lineage are preserved in fixtures, not in a live instance transfer.                                                    | Q09/Q10/Q25       |
| F9          | PASS    | v1 grammar remains unchanged; local command ledger/replay/uncertainty guards exist (H/ST/E3).                                        | Q28/Q29           |
| F10         | FAIL    | Page/Global rotations are synthetic only; no real replacement activation.                                                            | Q09–Q19           |
| F11         | FAIL    | Journal is canonical locally, but a real Page/repository discrepancy cannot be compared/routed by this candidate.                    | Q31               |
| F12         | BLOCKED | Four labels and provenance rules exist; real owning Page source for AVAILABLE/PARTIAL/UNKNOWN is unobserved.                         | Q30/Q31           |
| F13         | PASS    | S/P preserve Workflow v3, Page Product authority, Human Gates, side effects and language boundaries; H is non-executable by default. | Q26/Q32           |
| F14         | PASS    | Tracked prompt is not treated as live proof; independent Q01–Q35 remain NOT_RUN and Gate 3 NOT_READY.                                | Q01–Q35           |

Requirement count: `PASS=4`, `FAIL=9`, `BLOCKED=1`, `NOT_APPLICABLE=0` (14 total).

## All 39 scenario results

| Scenario | Status  | Exact implementation/evidence conclusion                                                 | Live QA still required |
| -------- | ------- | ---------------------------------------------------------------------------------------- | ---------------------- |
| F1.1     | PASS    | S/P retain Bridge v1 when federation not activated.                                      | Q33                    |
| F1.2     | FAIL    | H cannot activate a real executable federated target.                                    | Q01                    |
| F1.3     | PASS    | E3/E4 and P keep Bridge v1 QA historical.                                                | Q33                    |
| F2.1     | FAIL    | H validates synthetic Page role/owner but cannot activate the owning Page Chat.          | Q02/Q07                |
| F2.2     | PASS    | H uses Project/conversation identity, not title alone.                                   | Q02                    |
| F2.3     | PASS    | S/P and H block Page scope expansion; E3 negative.                                       | Q07/Q08                |
| F3.1     | FAIL    | No live Page tower transport action exists.                                              | Q07                    |
| F3.2     | PASS    | S/P require owner/scope/activation and prohibit guessed Page access.                     | Q07                    |
| F3.3     | FAIL    | H handles synthetic handoff, but cannot perform live Global escalation.                  | Q08                    |
| F4.1     | FAIL    | H never grants executable authority, including after synthetic ACTIVE.                   | Q01/Q04                |
| F4.2     | PASS    | Local lock/conflict handling denies both uncertain claimants (H/ST/E3).                  | Q04/Q21                |
| F4.3     | PASS    | H rejects incomplete exclusion/state; no title/timeout inference.                        | Q04/Q20                |
| F5.1     | FAIL    | No actual target observation → live probe → executable activation chain.                 | Q01/Q03                |
| F5.2     | PASS    | S/P deny guessed target; H rejects mismatched supplied fixture target.                   | Q27                    |
| F5.3     | PASS    | H run/epoch/instance ledger rejects old command in fixtures.                             | Q05                    |
| F6.1     | FAIL    | Live Page stop and Global activation are absent (H action gate).                         | Q08                    |
| F6.2     | PASS    | H synthetic fenced handoff is non-executable until new activation.                       | Q08/Q14                |
| F7.1     | PASS    | H checks immutable source/target/hash and carries budget/proof/state.                    | Q23                    |
| F7.2     | PASS    | H rejects missing, stale, corrupt and consumed handoff (ST/E3).                          | Q23/Q24                |
| F7.3     | PASS    | S/P and H do not treat handoff as Apply approval.                                        | Q26                    |
| F8.1     | FAIL    | Synthetic new run succeeds, but no real instance handshake/activation.                   | Q09/Q10/Q25            |
| F8.2     | PASS    | H rejects reused run or wrong lineage in fixture transfer.                               | Q25                    |
| F9.1     | PASS    | H records accepted command and rejects duplicate/replay (ST/E3).                         | Q29                    |
| F9.2     | PASS    | H blocks delivery-uncertain fixture; v1 no-resend rule retained.                         | Q28                    |
| F9.3     | PASS    | S/P preserve v1 parser and H rejects wrong command binding.                              | Q27/Q33                |
| F10.1    | FAIL    | Page rotation is fixture only.                                                           | Q09                    |
| F10.2    | FAIL    | Global rotation is fixture only.                                                         | Q10                    |
| F10.3    | PASS    | H fails closed on absent/corrupt current state.                                          | Q20                    |
| F11.1    | PASS    | H rechecks local handoff/activation/journal and hashes on resume.                        | Q23/Q25                |
| F11.2    | FAIL    | S/P demand source discrepancy reporting; no live Page/repository comparison path exists. | Q31                    |
| F12.1    | BLOCKED | H can label AVAILABLE from supplied provenance; real Page source unverified.             | Q30                    |
| F12.2    | BLOCKED | H can label PARTIAL with gaps; real partial Page source unverified.                      | Q30                    |
| F12.3    | BLOCKED | H can label UNKNOWN; actual Page source/routing unverified.                              | Q30                    |
| F12.4    | PASS    | H permits NOT_APPLICABLE only without an owning Page context.                            | Q30                    |
| F13.1    | PASS    | H proof/token checks and S/P stop on absent Human Gate.                                  | Q26                    |
| F13.2    | PASS    | S/P require separate scope/side-effect authorization; H grants none.                     | Q32                    |
| F13.3    | PASS    | P/S preserve English machine protocol and Vietnamese Human-facing updates.               | Q32                    |
| F14.1    | PASS    | S/P and E3/E4 explicitly keep live context unverified.                                   | Q34                    |
| F14.2    | PASS    | Q01–Q35 remain NOT_RUN; Gate 3 remains NOT_READY.                                        | Q01–Q35                |

Scenario count: `PASS=25`, `FAIL=11`, `BLOCKED=3`, `NOT_APPLICABLE=0` (39 total). The PASS rows do **not** claim the listed live QA case passed. Negative-path local coverage includes host/checkout mismatch, malformed/duplicate/unknown/privacy fields, wrong accepted Human token, blocked gate result, stale approval, proof replay, freeze scope/replay, monotonic maximum/counter, journal crash gap, command replay, execution uncertainty and evidence stop (83/83 ST). Real browser delivery uncertainty, nine real crash windows, true Page provenance, live Page/Global rounds and exact UI identity remain unrun.

## Boundaries and disposition

The approved Design, Sensitive Design and Tasks/TIC hashes have not changed. The three approved implementation owners match the exact pre-Phase-5 hashes; Bridge v1 skill hash is unchanged. Inspection of the Phase-5 scoped paths finds no Product/UI/API/auth/database/schema/business logic/deployment/Workflow v3/Page Chat owner edits. Current code stores bounded target/reference/hash metadata; `secret-field`, `transcript-field` and `nested-secret-field` SelfTest cases pass. This is not a claim about private data in an unrun live QA session.

**VERIFY: FAIL.** The formal audit was performed, so T19 task completion may be recorded, but its outcome is not PASS. The ordinary implementation gap is not an authorized Phase-5 owner edit and is not a proven anti-loop A/B/C event. The workflow says QA evaluates a verified implementation; Phase 6 is **NOT_ELIGIBLE_FOR_NORMAL_QA** while this VERIFY FAIL remains. A separately authorized correction in the approved owner scope and a fresh Compliance/VERIFY assessment are needed before Phase-6 Human authorization can be considered. No Design/Spec change, Phase 6 preparation, live operation, Gate 3, sync, archive, commit or deployment is performed here.
