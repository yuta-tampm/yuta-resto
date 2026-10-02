# Targeted Tasks/TIC delta approval — federation budget schema

Current targeted Tasks/TIC status: `APPROVED` for the pre-approval packet SHA-256 `4d22cc25e8c1de45f66bd498a4b07c710de7624f12a2965f495ce042b5b05a26` only.  
Approval source: exact current-user `APPROVE BUDGET SCHEMA TASKS TIC`, relayed in Bridge result `BRIDGE-ARCH-20260925-F9R2:27`.  
Bound pre-approval Tasks SHA-256: `284dd3a8316dc48c10acd1e5b44a661017d5f8b31182db821dccdedb08938460`; targeted Design SHA-256: `6beb02c49b48eb1096d417c29e99348fb66ce2795747fce9133d9e13c0beb676`.  
Bounded helper correction/revalidation and Phase 3 Apply remain separately `NOT_AUTHORIZED`. T01–T09 are historical completion; T10–T24 remain unchecked.

The review below is the **pre-approval snapshot**. Its `AWAITING_HUMAN_REVIEW` and pending-decision wording record the state before the current-user decision; they do not supersede the approved targeted Tasks/TIC status above.

---

# Pre-approval targeted Tasks/TIC delta review — federation budget schema

Change: `federated-control-towers-foundation`  
Gate: targeted Tasks/TIC Human review  
Status: `AWAITING_HUMAN_REVIEW`  
Scope: deterministic D3 budget accounting and bounded helper convergence before separately authorized Phase 3. No Apply authorization is requested by this packet.

## Exact authority and reviewed bytes

| Artifact                                      | SHA-256                                                            | Disposition                                                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Approved Gate 2 delta Spec                    | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Unchanged; 14 Requirements / 39 Scenarios.                                                                                                                       |
| Historical approved Design                    | `5235f719d253e487766f5e6fb6302183ed17a3eaa9b2ad52208c0f7336608ec9` | Prior approval history, not the clarified D3 bytes.                                                                                                              |
| Approved targeted budget Design               | `6beb02c49b48eb1096d417c29e99348fb66ce2795747fce9133d9e13c0beb676` | Exact current-user `APPROVE BUDGET SCHEMA DESIGN`, Bridge round `BRIDGE-ARCH-20260925-F9R2:23`.                                                                  |
| Pre-approval targeted Sensitive Design packet | `840e048f68e428c75f71647e3fb67fe716a86893c0fcfe0a84cdb07a3f6fe08b` | Exact current-user `APPROVE BUDGET SCHEMA SENSITIVE DESIGN`, Bridge round `:25`; approval recorded in `02g-budget-schema-sensitive-design-review.md`.            |
| Targeted Sensitive Design approval record     | `818950c04c4464bd440b7447e142a5484fc09b28cfb82f3a6efde31e2f63bccd` | Current `02g` header records approval and preserves its pre-approval snapshot.                                                                                   |
| Pre-review targeted Tasks/TIC                 | `87df944808e15a2f2eecf917fc2e2ab232fdc87f30dcd4dcada36ba2136eac40` | Budget-schema candidate before this approval-record metadata update.                                                                                             |
| Current targeted Tasks/TIC                    | `284dd3a8316dc48c10acd1e5b44a661017d5f8b31182db821dccdedb08938460` | Only approval-status metadata and checkpoint wording changed during this preparation; task actions and TIC semantics remain the same. Human approval is pending. |
| Historical Phase 2 evidence                   | `97d591434eae95d0201251d792ffe71f52eb22464f993e34d0bb8b4c372077d8` | Preserved; does not prove nonempty evaluator-bucket behavior.                                                                                                    |

The historical Tasks/TIC baseline was approved before Phase 1. The current budget-schema delta has **not** been approved. T01–T09 remain historically checked; T10–T24 remain unchecked. Phase 3 and later phases remain `NOT_AUTHORIZED`.

## Exact targeted delta for Human review

The existing `tasks.md` keeps 24 tasks in six phases. Its targeted budget-schema reconciliation checkpoint, T10/T12/T13 implementation preconditions, and Phase 3 Budget TIC require the exact approved D3 nested recovery/evaluator fields and provenance. The only edit to `tasks.md` in this approval-record round updates the top authority line and checkpoint wording to reflect separate Design and Sensitive Design approvals. It does not mark another task complete or expand an implementation owner.

| #   | Tasks/TIC decision to review                                                                                                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | `RECOVERY_BUDGET` uses the exact D3 nested shape, inherited recovery maximum, lineage binding and monotonic count.                                               |
| 02  | `EVALUATOR_BUDGET.BUCKETS` uses the exact D3 nested shape; a new bucket requires reviewed material distinction.                                                  |
| 03  | `EXECUTION_GENERATIONS_USED` is the single actual equivalent evaluator-execution count, with no separately replenishable evaluator counter.                      |
| 04  | `PENDING_COMMAND_ID` is durably reserved with `COMMAND_ACCEPTED` before possible evaluator dispatch.                                                             |
| 05  | Attributable actual outcome, one generation increment and clearing pending commit together.                                                                      |
| 06  | Missing accepted-command outcome remains `EXECUTION_UNCERTAIN`; redispatch and dependent execution stop.                                                         |
| 07  | Malformed, unauthorized, stale, duplicate, replayed and preflight-rejected commands do not themselves consume evaluator generations.                             |
| 08  | Proven actual materially equivalent evaluator execution consumes exactly one generation on success or failure.                                                   |
| 09  | Restart, fresh `RUN_ID`, rotation, escalation, epoch/title/stage changes cannot reset inherited budget state.                                                    |
| 10  | Fresh `RUN_ID` is transport occurrence/fencing identity, not a new anti-loop budget domain.                                                                      |
| 11  | Handoff rejects budget decrease/reset, unsupported shape, stale provenance/epoch, lineage mismatch and cross-context contamination.                              |
| 12  | Counters change only with the durable journal/snapshot transaction, not through independent edits; crash disagreement fails closed.                              |
| 13  | Human Gate does not consume or extend budget; an exception above a maximum needs an exact current Human decision.                                                |
| 14  | `DELIVERY_UNCERTAIN` permits no resend or budget reset and does not itself prove evaluator execution.                                                            |
| 15  | Evidence-stop state and blocker ancestry survive restart and tower transfer.                                                                                     |
| 16  | Incompatible historical synthetic evaluator-bucket fixtures remain blocked, without silent migration or repair.                                                  |
| 17  | The current helper needs bounded correction because it rejects the newly clarified nonempty evaluator-bucket shape.                                              |
| 18  | Helper correction converges to approved D3 and TIC; it creates no new Product or Bridge protocol capability.                                                     |
| 19  | Helper correction stays within the existing implementation owner `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`.                        |
| 20  | Helper correction does not activate a live tower, access a Page Chat, change Bridge v1 or begin T10–T14.                                                         |
| 21  | Focused revalidation covers nonempty buckets, pending reservation, monotonicity, handoff/restart continuity, malformed/rollback state, privacy and at-most-once. |
| 22  | New convergence evidence is separate from the historical Phase 2 T05–T09 evidence, which is not rewritten.                                                       |
| 23  | Phase 3 stays blocked until helper convergence and focused local revalidation succeed.                                                                           |
| 24  | Helper correction requires its own explicit Human authorization after this Tasks/TIC delta decision.                                                             |
| 25  | Phase 3 T10–T14 requires a later, separate Human authorization after convergence.                                                                                |
| 26  | No Bridge v1 wire, multi-host, credential, transcript, auth, provider, destructive, Workflow v3 or Page Chat Product-authority expansion.                        |

## Bounded convergence and evidence

The helper correction may touch only `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` as an implementation owner, plus separately authorized change/review evidence. It must implement exact D3 field/type/canonical-serialization validation, stable `(EXECUTION_CONTEXT_ID, CAUSAL_LINEAGE_ID)` budget provenance, material bucket identity, monotonic counts and approved maxima, pending accepted-command reservation, atomic attributable-outcome accounting, handoff equality and fail-closed restart reconciliation. It must reject unknown, missing, corrupt, conflicting, rollback, version-mismatched and privacy-violating state. It must not invent a retry framework or migrate incompatible old fixtures silently.

A later, separately authorized correction must rerun focused local synthetic checks for nonempty buckets, zero/empty state, count/maximum and lineage drift, rejected preflight, pending accepted command and unknown outcome, proven execution increment, failed corrective action and same-blocker observation, budget exhaustion, duplicate command, handoff/rotation continuity, restart, malformed/hash-invalid/rollback state and secret/transcript rejection. Evidence must distinguish actual execution from an unproven outcome. Phase 2's historical 9/24 task progress remains historical; these new checks do not retroactively alter its report. No helper or implementation test was run in preparing this packet.

## Boundary and stop

Gate 1/Gate 2 Spec, original role/authority decisions, one-Windows-host/one-NTFS-checkout boundary, PAGE_LOCAL Page Chat Product/shaping authority, Workflow v3 CROSS_MODULE/UNCERTAIN escalation, Human Gates, fresh-run requirement, handoff non-authority, privacy restrictions and Bridge v1 isolation remain unchanged. The three existing implementation owner paths remain the entire owner allowlist; this checkpoint adds no fourth owner, task, wire field, runtime capability or live activation. A need for any of those, or a Spec semantic change, returns `NEEDS_REVIEW`.

Targeted Tasks/TIC approval would approve **planning only**. It would not authorize helper correction, Phase 3, real tower activation, Page Chat access, formal Technical Compliance, VERIFY, Federated Browser QA Q01–Q35, Gate 3, sync/archive, commit, push, PR, merge, deploy or release. Human must later authorize the bounded helper correction, inspect its new evidence, then decide Phase 3 separately. Required QA and Gate 3 remain `NOT_READY`.

## Human decision

Review the current Tasks/TIC SHA-256 above and the 26 bounded decisions. Choose exactly one: `APPROVE BUDGET SCHEMA TASKS TIC` | `REQUEST BUDGET SCHEMA TASKS TIC CHANGES` | `DEFER BUDGET SCHEMA TASKS TIC`.
