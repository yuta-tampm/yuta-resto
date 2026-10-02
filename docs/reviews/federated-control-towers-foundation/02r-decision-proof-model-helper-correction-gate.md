# Decision Proof Model — bounded helper-correction Human Gate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW`  
Requested action: a separate, bounded correction of `state-helper.ps1` and focused synthetic revalidation. This packet does **not** authorize implementation.

## Exact approved baseline

| Artifact                               | SHA-256                                                            | Treatment                                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Approved Gate 2 delta Spec             | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Unchanged.                                                                                                                        |
| Approved Decision Proof Model Design   | `fe0a6f48afb24074bac8c64d3835443312a128eeb2ce22207fcf2181eb81b12b` | Exact implementation contract.                                                                                                    |
| Recorded Sensitive Design approval     | `4da7ca1d3a14cfec33dc6189c9231a3e50f4c200ea3eddc0c4cf69d1935e7c85` | Approved risk boundary.                                                                                                           |
| Approved Tasks/TIC pre-approval packet | `5b98726c2e0bfa8c36b095809460f79225fad970daceddbe5659200a57f9043b` | Exact Human-reviewed bytes.                                                                                                       |
| Recorded Tasks/TIC approval            | `dd8346d79bf3dd5d70b51510cb34c0855707b2c33f662f98693c91da8cb46732` | Approval header binds the pre-approval packet; round 51 was malformed, and round 52 positively recovered the exact user decision. |
| Current `tasks.md`                     | `e103053aac3251e2fd3a421745afd66d33be85669d615b5469c7a28140c94923` | 9/24 complete; T10–T24 unchecked.                                                                                                 |
| Current `state-helper.ps1`             | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` | Existing partial implementation; unchanged at this gate.                                                                          |

Round-30 and round-43 helper results remain historical `PARTIAL_NEEDS_REVIEW` evidence. This packet does not relabel them as convergence. Helper convergence remains `PARTIAL_NEEDS_REVIEW`; Phase 3 remains `NOT_AUTHORIZED`.

## Proposed exact implementation boundary

The only eligible implementation owner after a **new, exact current-Human authorization** is `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. Bounded change/review/evidence metadata, and `tasks.md` metadata only where the workflow requires it, may record the correction. Do not modify the federated `SKILL.md`, tracked operating protocol, Bridge v1, Workflow v3, Page Chat authority, Product code, API, auth, schema, provider integrations, deployment configuration, or external services. Do not activate Page or Global towers, access Page Chats, execute live escalation or rotation, or start T10–T14.

The helper must resolve authoritative decision records **read-only** from `docs/reviews/federated-control-towers-foundation/decisions/<DECISION_ID>.json`. It must never create, approve, rewrite, repair, synthesize, silently supersede, or semantically self-authorize a decision. Only `EVALUATOR_BUCKET_CLASSIFICATION`, `BUDGET_MAXIMUM_EXCEPTION`, and `BUDGET_EXECUTION_FREEZE_TRANSITION` are supported. Validate canonical `RECORD_VERSION: 1` deterministic UTF-8 JSON, exact bytes and lowercase SHA-256, unique known fields, typed payload, deterministic `DECISION_ID`, scope, and one-time consumption.

Validate `HUMAN_GATE_RESULT` against exact `RUN_ID`, `ROUND_ID`, `COMMAND_ID`, `CAUSAL_LINEAGE_ID`, normalized `DECISION_LITERAL`, and `DECISION_ITEM_ID`. Independent decisions in one Human interaction require distinct item IDs and records. Validate `REVIEW_BINDING` against exact packet path, pre-approval SHA-256, approval-record SHA-256, and approval-record `COMMAND_ID`. Caller metadata alone is insufficient; structurally valid but unapproved JSON is non-authoritative. The trust claim is deterministic workflow-governed repository provenance, **not** cryptographic Human identity attestation.

The Human or already-authoritative reviewed workflow decides `SAME_MATERIAL_BUCKET` versus `DISTINCT_MATERIAL_BUCKET`. New path, hash, run, tower, stage label, wrapper, transport, title, or evaluator implementation alone cannot prove material difference. A positive maximum exception requires `NEW_APPROVED_MAXIMUM > PREVIOUS_APPROVED_MAXIMUM` and `ADDED_ALLOWANCE` equal to that strictly positive difference. Equality is a no-op, not an exception; a lower maximum fails closed. Used counters never reset. Freeze `APPLY`, `LIFT`, and `SUPERSEDE` require independent approved records. Maximum increase does not lift a freeze, and lifting a freeze does not increase a maximum or clear `EVIDENCE_STOP_STATE`.

Journal consumed `DECISION_ID`, `DECISION_ITEM_ID`, and record SHA-256 exactly once. Reject duplicate or replayed consumption after restart, fresh `RUN_ID`, same-role rotation, or Page-to-Global handoff. Decision records are append-only history; a later reclassification, increase, lift, or supersession requires a new approved record. Handoff and recovery must preserve the consumed references and current bucket, maximum, freeze, budget, pending-command, and evidence-stop state. Missing, stale, hash-mismatched, conflicting, unresolved, replayed, or unsupported provenance fails closed before execution. Persist only bounded operational identifiers, references, hashes, purpose, and stop conditions; reject transcript, customer data, credential, token, cookie, session, provider secret, and private chat content.

## Focused revalidation required after separate authorization

Record exact helper before/after hashes, scoped diff, synthetic fixture identity, test commands and outputs, fail-closed disposition, limitations, and evidence hash. Include at least:

1. Approved `EVALUATOR_BUCKET_CLASSIFICATION` accepted; structurally valid but unapproved classification and caller metadata without `REVIEW_BINDING` rejected.
2. Stale pre-approval or approval-record hash, wrong approval-record `COMMAND_ID`, and wrong `HUMAN_GATE_RESULT` identity rejected.
3. Duplicate `DECISION_ITEM_ID` or `DECISION_ID` rejected; replay after restart, fresh `RUN_ID`, same-role rotation, and Page-to-Global handoff rejected.
4. Strict-positive recovery and evaluator maximum exceptions accepted; equal/lower maximum and `ADDED_ALLOWANCE` mismatch rejected without granting capacity.
5. Authoritative freeze `APPLY`, `LIFT`, and `SUPERSEDE` accepted; self-issued transition or wrong active-freeze identity rejected. Freeze remains independent of maximum and evidence stop.
6. Noncanonical JSON, duplicate key, unsupported version, malformed payload, record-hash mutation, and prohibited privacy field rejected.
7. Prior budget, pending-command, freeze, accepted-command uncertainty, and at-most-once cases rerun as new regression evidence. Do not promote historical round-30 or round-43 results.

Run only focused synthetic local checks, with no real tower activation or live browser traffic. Later formal Technical Compliance, VERIFY, and Federated Browser QA are separate lifecycle steps. Even successful helper convergence does **not** authorize Phase 3; Phase 3 needs another explicit current-Human decision.

## Human decision boundary

Choose exactly one for this packet: `AUTHORIZE DECISION PROOF MODEL HELPER CORRECTION`, `REQUEST DECISION PROOF MODEL HELPER SCOPE CHANGES`, or `DEFER DECISION PROOF MODEL HELPER CORRECTION`. No choice is inferred from Design, Sensitive Design, Tasks/TIC approval, or this packet's existence. Remain at `AWAITING_HUMAN_REVIEW` until the exact decision is provided.
