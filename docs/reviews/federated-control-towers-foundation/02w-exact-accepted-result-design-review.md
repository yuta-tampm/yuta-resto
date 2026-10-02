# Exact accepted-result proof model — approved targeted Design decision

Current targeted Design status: `APPROVED` for the pre-approval packet SHA-256 `b042afb538b64f0cc1049354f9bdd83f978823965c5b6dfe6dcd9fd08ae8b642` only.  
Approval source: exact current-user `APPROVE EXACT ACCEPTED RESULT DESIGN`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:70`.  
Bound Design SHA-256: `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable approval does not substitute for a later canonical accepted-result/approval/semantic chain used for runtime budget decisions. Targeted Sensitive Design, Tasks/TIC, fresh helper correction and Phase 3 remain separate gates.

---

# Exact accepted-result proof model — targeted Design review

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` for this Design delta only.  
Approval input: current-user `APPROVE EXACT ACCEPTED RESULT PROOF MODEL`, relayed in Control Tower command/result `BRIDGE-ARCH-20260925-F9R2:67`.  
Planning command: `BRIDGE-ARCH-20260925-F9R2:68`.  
Pre-planning approved Design SHA-256: `ade4c1be825823e20bd1e7af5174f65ffe8b93e24872880ccbcd0c61cd30197a`.  
Revised Design: `openspec/changes/federated-control-towers-foundation/design.md`.  
Revised Design SHA-256: `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c`.  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).

## Exact Design delta

The machine authority chain is `PRE_DECISION_DESCRIPTOR -> accepted HUMAN_GATE_RESULT -> ACCEPTED_GATE_RESULT_RECORD -> APPROVAL_RECORD -> SEMANTIC_DECISION_RECORD -> DURABLE_CONSUMPTION`. The previously proposed `GATE_RESULT_RECEIPT` has no machine authority; an optional diagnostic receipt cannot authorize helper consumption. The accepted-result record is the sole machine-readable repository source for `RESULT_HASH`.

`DECISION_ID` is computed before Human approval from canonical `{DECISION_TYPE,DECISION_SCOPE,PROPOSED_DECISION_PAYLOAD}`. `DECISION_ITEM_ID` is the exact Human Gate command ID followed by `#` and a positive ordinal. `RESULT_CORE_V1` contains only the fourteen exact fields in Design D3. `RESULT_HASH` is lowercase SHA-256 of its exact canonical bytes, never prose or transcript bytes. The accepted-result record is canonical version-one JSON at `decisions/gate-results/<RESULT_HASH>.json`, written only after a valid Human Gate result is accepted by a distinct, causally later recording command in the same lineage. The helper only reads this record.

The approval record is written only after accepted-result write/hash/read-back. Its ID hashes exactly `DECISION_ID`, `RESULT_HASH`, `DECISION_ITEM_ID`, the pre-approval review-packet SHA-256 and the recording command ID. It binds accepted-result path/hash and never references a future semantic record. The later semantic record binds the exact approval-record path/hash. Helper validates the chain and exact Gate identity, scope, packet bytes, recording order and payload before durable consumption. Missing, noncanonical, stale, conflicting or wrong-scope evidence blocks.

For `BUDGET_MAXIMUM_EXCEPTION`, `EXCEPTION_ID = DECISION_ID` is the sole domain idempotency identity. `APPLICATION_ID` has no field, formula, validation rule or runtime state. A valid increase is strictly positive; equal maximum is no-op and decrease blocks. Consumption journals semantic ID/hash, approval ID/hash, `RESULT_HASH` and item once, and carries them through restart, fresh run, rotation and Page-to-Global handoff. Exact duplicate semantics cannot grant capacity twice. A later increase begins from the newly committed prior maximum and needs a new reviewed chain.

## Preserved boundaries and required review

SAME/DISTINCT material classification, independent freeze, monotonic counters and maximum, pending-command at-most-once and `EVIDENCE_STOP` are unchanged. `PAGE_LOCAL` authority remains with the owning Page Chat; Global Control Tower coordinates CROSS_MODULE/UNCERTAIN under Workflow v3. Bridge v1 grammar, Product code, live context, single Windows/NTFS checkout scope and privacy constraints are unchanged. This is workflow-governed repository provenance, not cryptographic Human attestation. No Spec delta is required.

The prior one-way-binding approvals and their hashes remain historical. Phase 1/2 and earlier partial helper evidence are not convergence proof. Implementation remains 9/24 with T10–T24 unchecked; helper correction is `PAUSED_NEEDS_REVIEW`, Phase 3 `NOT_AUTHORIZED`. Targeted Sensitive Design and Tasks/TIC candidates require separate later Human reviews. This packet does not approve Design by its existence.

Human decision: `APPROVE EXACT ACCEPTED RESULT DESIGN` | `REQUEST EXACT ACCEPTED RESULT DESIGN CHANGES` | `DEFER EXACT ACCEPTED RESULT DESIGN`.
