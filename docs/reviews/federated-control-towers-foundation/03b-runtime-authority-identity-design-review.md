# Runtime Authority Identity Model — approved revised Design decision

Current revised Design status: `APPROVED` for the pre-approval packet SHA-256 `ae5ca070744ce431791c51e57db991cf2a7e7cc281b78bb0ba01f325a917a7b0` only.  
Approval source: exact current-user `APPROVE RUNTIME AUTHORITY IDENTITY DESIGN`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:92`.  
Bound Design SHA-256: `42f71996db47a2e0e5e88bc4b8f8648658ada9951711e7a389c98ffc04922b5a`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable approval does not become runtime machine authority. Targeted Sensitive Design, Tasks/TIC, fresh helper correction and Phase 3 remain separate gates.

---

# Runtime Authority Identity Model — revised Design review

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW`  
Human model decision: `APPROVE EXACT RUNTIME AUTHORITY IDENTITY MODEL`, relayed in Bridge result `BRIDGE-ARCH-20260925-F9R2:89`.  
Planning command: `BRIDGE-ARCH-20260925-F9R2:90`; approval of the model authorizes this planning reconciliation only.  
Revised Design: `openspec/changes/federated-control-towers-foundation/design.md` SHA-256 `42f71996db47a2e0e5e88bc4b8f8648658ada9951711e7a389c98ffc04922b5a`.  
Pre-planning Design SHA-256: `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c`.  
Approved Gate 2 Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).

## Exact targeted delta for Human review

1. `CANONICAL_JSON_V1` now defines exact UTF-8 bytes, recursive ordinal key order, array order, JSON escaping, shortest decimal integers, explicit null/boolean limits, duplicate/unknown-field rejection and SHA-256 input. No boolean field was introduced. Budget objects still forbid null; the exact freeze scope/payload explicitly permits it.
2. The private, immutable `APPROVAL_TOKEN_MAPPING_VERSION=1` has exactly three typed approval tokens. The helper must resolve `DECISION_TYPE` before requiring exact accepted `CURRENT_USER_DECISION`; generic, negative, stale, unrelated or approximate choices grant nothing.
3. Freeze scope and proposed payload each have four exact fields. `DECISION_ID` hashes the typed pre-Human descriptor input. `TRANSITION_ID=DECISION_ID`; APPLY/SUPERSEDE create `FREEZE_ID=DECISION_ID`; LIFT targets the current active freeze and creates none. Wrong target/scope or multiple active freezes block. The older Human-result-derived freeze hash formula is superseded.
4. `CONSUMED_AUTHORITY_PROOF_V1` has exactly eight fields and a canonical proof hash. Activation/handoff carry a sorted `CONSUMED_AUTHORITY_PROOFS` array. The single existing journal `EVENT_KIND: AUTHORITY_CONSUMED` records exact proof and complete `POST_STATE`. The old semantic-specific event-kind names are superseded for new-model decisions.
5. Lock → full chain and runtime-precondition verification → complete `POST_STATE` → journal-first durable flush → atomic snapshot replacement/flush/read-back → dependent execution. Crash recovery and replay checks cover journal/snapshot disagreement, restart, fresh run, both rotations and Page-to-Global handoff. Historical missing proof arrays normalize empty only with proof of zero semantic consumption.
6. Synthetic SelfTest runs against private per-run temporary fixtures outside the repository through the same internal verifier functions. Synthetic authority cannot authorize live state.

The one-way descriptor → accepted result → approval → semantic record chain, `RESULT_CORE_V1`, `RESULT_HASH`, positive `EXCEPTION_ID=DECISION_ID`, SAME/DISTINCT material authority, monotonic counters/maximum, independent freeze/evidence-stop and command at-most-once remain. No Spec, Workflow v3, PAGE_LOCAL authority, Bridge v1 wire, Product, provider or multi-host change is requested. The trust boundary remains workflow-governed repository provenance rather than cryptographic Human attestation.

The prior round-86 helper authorization and packet `02z` are preserved as historical evidence and superseded for future helper work. Round-87 blocker `03a` remains truthful. T01–T09 stay completed; T10–T24, helper convergence and Phase 3 remain pending. The Sensitive Design and Tasks/TIC packets are candidates only; neither is approved by this Design review.

Human decision for this exact Design hash: `APPROVE RUNTIME AUTHORITY IDENTITY DESIGN` | `REQUEST RUNTIME AUTHORITY IDENTITY DESIGN CHANGES` | `DEFER RUNTIME AUTHORITY IDENTITY DESIGN`.
