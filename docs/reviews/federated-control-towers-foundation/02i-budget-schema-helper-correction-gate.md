# Bounded helper-correction authorization review — federation budget schema

Change: `federated-control-towers-foundation`  
Gate: separate Human authorization for local helper convergence  
Status: `AWAITING_HUMAN_REVIEW`  
Requested action: correct the already approved single-host helper contract and run focused synthetic revalidation. This packet does **not** authorize the action.

## Exact approved planning and baseline

| Artifact                                  | SHA-256                                                            | State                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Gate 2 delta Spec                         | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Approved, unchanged.                                                                                         |
| Targeted D3 Design                        | `6beb02c49b48eb1096d417c29e99348fb66ce2795747fce9133d9e13c0beb676` | Approved.                                                                                                    |
| Recorded targeted Sensitive Design packet | `818950c04c4464bd440b7447e142a5484fc09b28cfb82f3a6efde31e2f63bccd` | Approved; preserves pre-approval SHA-256 `840e048f68e428c75f71647e3fb67fe716a86893c0fcfe0a84cdb07a3f6fe08b`. |
| Recorded targeted Tasks/TIC packet        | `bd193f1815f0f57a3f7f2fe0381862c388db3176c25647d95d45814819f6d96d` | Approved; preserves pre-approval SHA-256 `4d22cc25e8c1de45f66bd498a4b07c710de7624f12a2965f495ce042b5b05a26`. |
| Current Tasks/TIC                         | `2c53ff8de5393d14d77f267d2b59e62fe1244b31ad8634b50dd9c29caef39ce6` | T01–T09 historically checked; T10–T24 unchecked. Phase 3 not authorized.                                     |
| Current helper owner                      | `5d676f5c4a21496aa79aa47a212291ba491230d3d75fa66927ca2b3f1113c825` | Phase 2 baseline. It intentionally rejects nonempty evaluator-budget buckets.                                |
| Historical Phase 2 evidence               | `97d591434eae95d0201251d792ffe71f52eb22464f993e34d0bb8b4c372077d8` | Historical scope only; not proof of the clarified nonempty-bucket contract.                                  |

The helper baseline explicitly rejects nonempty `EVALUATOR_BUDGET.BUCKETS`. This was correct for the earlier synthetic Phase 2 contract, but does not satisfy the newly approved D3 nested schema. No helper correction, helper test or runtime mutation has occurred during the targeted planning approvals.

## Exact bounded correction for a later authorization

The sole tracked **implementation owner** would be `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. Bounded change/review evidence under this change and `docs/reviews/federated-control-towers-foundation/`, plus `tasks.md` metadata only if needed to record evidence, are not additional implementation owners. Existing ignored `tmp/yuta-federated-control-towers/<EXECUTION_CONTEXT_ID>/` may hold synthetic local fixtures only after explicit authorization; it must not become a real tower activation or Product-authority record. Preserve unrelated dirty/untracked work.

The correction must implement the exact approved D3 schema and safety contract:

1. Validate required `RECOVERY_BUDGET` fields `CAUSAL_LINEAGE_ID`, `ATTEMPTS_USED`, `APPROVED_MAXIMUM`, `EVIDENCE_REFERENCES`; validate required `EVALUATOR_BUDGET` fields `CAUSAL_LINEAGE_ID`, `BUCKETS`; reject missing, duplicate, unknown, null-substitute and wrong-type fields. Keep the approved zero/empty representation and canonical UTF-8 serialization.
2. Support nonempty evaluator buckets with required `BUCKET_KEY`, `STAGE_KEY`, `PURPOSE_KEY`, `MATERIAL_EQUIVALENCE_REFERENCE`, `EXECUTION_GENERATIONS_USED`, `APPROVED_MAXIMUM`, `EVIDENCE_REFERENCES`, and nullable `PENDING_COMMAND_ID`. Keep canonical bucket ordering, stable material-equivalence provenance and exact evidence-reference validation.
3. Bind budget identity to `(EXECUTION_CONTEXT_ID, CAUSAL_LINEAGE_ID)` and materially equivalent stage/purpose bucket. `RUN_ID`, epoch, tower instance, conversation title and transport are not fresh budget domains. Preserve approved default maxima, monotonic counts and explicit Human-only exception provenance.
4. Commit `COMMAND_ACCEPTED` and pending reservation before possible evaluator dispatch. Commit a separately proven attributable actual evaluator outcome, one execution-generation increment and pending clear together under the held local lock and journal/snapshot ordering. A failed actual run also counts; rejected preflight, malformed/stale/duplicate/replayed/unauthorized commands, Human Gate and delivery uncertainty do not themselves count.
5. Keep an accepted command with missing or uncertain outcome `EXECUTION_UNCERTAIN`: zero dependent executable authority, no same-command redispatch and no automatic retry. Preserve no-resend behavior for `DELIVERY_UNCERTAIN`.
6. Preserve exact counters, maxima, bucket identity, pending intent, evidence references, blocker ancestry and evidence-stop through restart, fresh run, Page-to-Global handoff and same-role rotation. Reject reset/decrease, stale epoch, lineage/context mismatch, unknown bucket, unsupported version, corrupt/hash-invalid state, journal ahead/behind and conflicting handoff. Do not silently migrate or repair incompatible historical fixtures.
7. Persist only bounded operational IDs, counters, hashes and evidence references. Reject transcript, customer content, credentials, tokens, cookies, sessions, provider secrets and unrelated private data.

Use existing repository tooling and the established Windows/NTFS/one-checkout/local-helper boundary. A new test framework, implementation owner, cross-host mechanism, Bridge v1 wire field, Product authority or workflow change requires `NEEDS_REVIEW`, not implementation inference.

## Focused revalidation and evidence required after separate authorization

Run synthetic local cases for empty/nonempty buckets; recovery and evaluator counts/maxima; lineage/context and material-bucket identity; pending accepted command; missing/uncertain outcome; duplicate/replay; one proven actual execution increment; failed correction plus same-blocker observation; exhausted budget; restart and handoff continuity; malformed, hash-invalid, rollback, journal-ahead/behind and privacy-violating state; at-most-once and no budget reset across fresh run, rotation or escalation. Recheck existing applicable Phase 2 fixtures without rewriting the Phase 2 evidence packet. Record exact helper before/after SHA-256, scoped diff, fixture inputs, observed outputs, executable-authority disposition, validation commands and limitations in **new** bounded evidence.

No real Page or Global tower activation, Page Chat access, live conversation modification, T10–T14 execution, provider operation, Product code/auth/schema/deployment change, Bridge v1 modification, formal Technical Compliance, formal VERIFY or Federated Browser QA is permitted by this proposed correction. Correcting and revalidating the helper would still leave Phase 3 `NOT_AUTHORIZED`; Phase 3 needs another current Human decision.

## Human decision boundary

Approval of targeted Tasks/TIC is already recorded. This **separate** gate remains pending. The Human may choose `AUTHORIZE BOUNDED HELPER CORRECTION`, `REQUEST HELPER CORRECTION SCOPE CHANGES`, or `DEFER HELPER CORRECTION`. No option is inferred from the prior Tasks/TIC approval.
