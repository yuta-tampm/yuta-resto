# Runtime Authority Identity helper convergence — bounded stop evidence

Change: `federated-control-towers-foundation`  
Bridge command: `BRIDGE-ARCH-20260925-F9R2:99`  
Status: `NEEDS_REVIEW`  
Phase 3: `NOT_AUTHORIZED`

## Authorization and baseline

The exact current Human helper-correction decision was relayed in Bridge round 98 against the immutable `03e` pre-approval SHA-256 `24c74bf190c52c3fd422bad5220a7a50da9169a35debaaa87551a6cf77f60cbd`. Round 99 authorized only the bounded helper correction and synthetic checks. The pre-correction helper SHA-256 is `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4`.

## Exact representation blockers found before mutation

1. The approved Design requires append-only freeze transitions and derived active state in the existing `APPROVAL_REFERENCES`, journal and snapshot. It specifies the exact pre-Human freeze scope/payload/ID and the exact eight-field consumed proof, but no exact durable freeze-transition entry schema in `APPROVAL_REFERENCES`: field names, types, active/inactive derivation representation, and binding of transition to the proof remain unresolved. The current helper's `APPROVAL_REFERENCES` validator accepts exactly six fields (`DECISION_SOURCE`, `DECISION`, `SCOPE`, `ARTIFACT_PATH`, `ARTIFACT_SHA256`, `DECIDED_AT_UTC`). Choosing a new typed entry shape would be an unreviewed durable schema decision.
2. The Design requires an `AUTHORITY_CONSUMED` event containing the exact proof entry and complete `POST_STATE`, while preserving the existing Phase-2 journal envelope. The helper's exact journal schema has `STATE_PAYLOAD` and no `POST_STATE` or proof-entry field. The approved artifacts do not state whether `POST_STATE` is the existing `STATE_PAYLOAD`, a second field, or a nested member, nor how a separate proof entry is represented and checked against that payload. Choosing among these alters hash, replay and crash recovery semantics.
3. The Design requires transferred consumed proofs to reconcile through immutable handoff and destination state. It defines the activation proof array but no exact handoff field or embedding/binding for the proof set. The helper's exact handoff schema omits it. Copying proof hashes only, adding a new top-level field, or deriving from another field have different replay behavior; selecting one is a durable schema decision.

These are representation gaps, not permission to relax the approved semantic rules. The exact freeze identity, one-way approval chain, maximum exception and proof hash formulas remain approved. No helper code, runtime state, lock, authority record, tower, Page Chat or live context was changed or exercised. No focused synthetic matrix, formal Technical Compliance, VERIFY or Browser QA was run. The earlier `03a` and Phase-2 evidence remains historical and does not establish convergence.

## Required bounded decision

Control Tower should request the smallest targeted Design/Sensitive Design/Tasks-TIC clarification of those three exact schemas and their canonical bindings. Keep the `03e` Human authorization recorded, but require a new exact helper execution gate if the reviewed implementation contract changes materially. Until then helper convergence is `NEEDS_REVIEW`, T10–T24 remain incomplete, and Phase 3 remains `NOT_AUTHORIZED`.
