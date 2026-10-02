# Exact accepted-result proof model — approved bounded helper correction

Current helper-correction authorization: `APPROVED` for the pre-approval packet SHA-256 `b51740fbd503c9df4a77758fffb0d82ec9f7d2a2b65e0a70887fe286a4e2bf13` only.  
Authorization source: exact current-user `AUTHORIZE EXACT ACCEPTED RESULT HELPER CORRECTION`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:86`.  
Bound approved Design SHA-256: `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable header is review evidence only and is not runtime machine authority. Phase 3 remains separately gated.

---

# Exact accepted-result proof model — bounded helper-correction Human Gate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW`  
Requested action: a separate, bounded correction of `state-helper.ps1` and focused synthetic revalidation. This packet does **not** authorize implementation.

## Exact reviewed baseline

| Artifact                                    | SHA-256                                                            | Treatment                                                      |
| ------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Approved Gate 2 delta Spec                  | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Unchanged; Gate 2 is not reopened.                             |
| Approved Exact Accepted Result Design       | `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c` | Exact planning contract.                                       |
| Recorded targeted Sensitive Design approval | `41aabcab5e639661832c086e05cbaefcdbebef5e29b5e2e8117c5c3f24c06da7` | `02x` review; exact current-user decision in Bridge round 77.  |
| Targeted Tasks/TIC pre-approval packet      | `56088d06f4a8eab344af4eae605519e8af9f04b2356d0725186b9aeb4d15ac4c` | Exact Human-reviewed packet, preserved byte-for-byte in `02y`. |
| Recorded targeted Tasks/TIC approval        | `2a6e6d6628389847589c7f052f2dc7ddafac9a75309d79a160b5c10cac766b17` | `02y` review; exact current-user decision in Bridge round 83.  |
| Current `tasks.md`                          | `5eec6002d1c24d0cd34c5c98c0a3e1d1c91d256db9497df7f49b65e47cf3247c` | 9/24 complete; T10–T24 unchecked.                              |
| Current `state-helper.ps1`                  | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` | Existing partial implementation; unchanged at this gate.       |

The Sensitive Design approval binds the pre-approval `02x` packet SHA-256 `fff928ba609ded197ac18f4bf35396560a86be834a7c7644475eee66e7e89ac4`. The approval recorded in `02y` is Human-readable planning history. Neither approval header is the helper's runtime machine trust root.

The round-64 helper-correction authorization and `02v-one-way-approval-binding-helper-correction-gate.md` are **superseded for future execution** because the approved helper contract changed in rounds 67–83. Retain `02v` and rounds 64/65 as historical evidence; do not replay that authorization or relabel its result. Helper convergence remains `PAUSED_NEEDS_REVIEW`. Phase 3 remains `NOT_AUTHORIZED`.

## Proposed exact implementation boundary

Only after a **new, explicit current-Human authorization for this exact packet**, the sole implementation owner is `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. Bounded change/review/evidence metadata may accompany it. The correction does not include the federated `SKILL.md`, `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`, Bridge v1, Workflow v3, Page Chat authority, Product code, API, auth, database/schema, provider integration, deployment configuration or live contexts. It must not activate a Page or Global tower, access Page Chats, perform browser federation, live escalation or rotation, or start T10–T14 or Phase 3.

Implement only the approved one-way authority chain: canonical `PRE_DECISION_DESCRIPTOR` → accepted `HUMAN_GATE_RESULT` → canonical `ACCEPTED_GATE_RESULT_RECORD` → immutable `APPROVAL_RECORD` → later immutable `SEMANTIC_DECISION_RECORD` → durable one-time consumption. The accepted-result record is the sole machine-readable repository source for `RESULT_HASH`; diagnostic receipts, caller metadata and prose approval headers are not authority. The helper reads all four authority artifact classes without creating, repairing or self-authorizing them. A distinct causally later recording command must copy the exact accepted Human fields. The accepted-result record must be written, hashed and read back before approval creation; approval must be written, hashed and read back before semantic-record creation. No predecessor binds the path or hash of a future artifact.

The helper must reconstruct the canonical fourteen-field `RESULT_CORE_V1`: `PROTOCOL_VERSION`, `RUN_ID`, `ROUND_ID`, `COMMAND_ID`, `CAUSAL_LINEAGE_ID`, `STAGE`, `STATUS`, `CURRENT_USER_DECISION`, `DECISION_ITEM_ID`, `DECISION_ID`, `DECISION_TYPE`, `DECISION_SCOPE`, `REVIEW_PACKET_PATH`, and `REVIEW_PACKET_PRE_APPROVAL_SHA256`. `RESULT_HASH` is lowercase SHA-256 over those canonical bytes only. Recompute `DECISION_ID` from the approved type, scope and proposed semantic payload; derive `DECISION_ITEM_ID` from the exact Human Gate command and item ordinal; recompute `APPROVAL_RECORD_ID` from the five approved Design inputs. Verify exact path/hash, versions, command/lineage/item, review packet, typed payload, scope, causal order and accepted Human effect before any durable operation. Missing, fabricated, malformed, noncanonical, unsupported-version, stale, wrong-scope, wrong-lineage, wrong-command, wrong-item, wrong-hash or conflicting evidence fails closed.

For `BUDGET_MAXIMUM_EXCEPTION`, remove `APPLICATION_ID` and require `EXCEPTION_ID = DECISION_ID`; do not introduce a second exception identity formula. Only a strict positive increase is valid: `NEW_APPROVED_MAXIMUM > PREVIOUS_APPROVED_MAXIMUM` and `ADDED_ALLOWANCE = NEW_APPROVED_MAXIMUM - PREVIOUS_APPROVED_MAXIMUM > 0`. Equality is a no-op; a decrease or allowance mismatch fails closed. Used counters remain monotonic. A duplicate semantic exception cannot add capacity twice. A later genuinely new exception starts from the then-committed previous maximum and needs a new approved decision.

Preserve reviewed `SAME_MATERIAL_BUCKET` versus `DISTINCT_MATERIAL_BUCKET` authority; the helper must not infer material distinction from a new run, tower, epoch, wrapper, path, hash, stage or evaluator label. Preserve independent `BUDGET_EXECUTION_FREEZE` `APPLY`/`LIFT`/`SUPERSEDE` semantics: a maximum exception does not lift a freeze. Preserve `PENDING_COMMAND_ID`, `COMMAND_ACCEPTED`, `EXECUTION_UNCERTAIN`, at-most-once dispatch, monotonic budgets and independent `EVIDENCE_STOP`.

Journal consumption exactly once with `DECISION_ID`, semantic-record SHA-256, `APPROVAL_RECORD_ID`, approval-record SHA-256, `RESULT_HASH` and `DECISION_ITEM_ID`. Reject duplicate decision/approval IDs and incompatible item reuse. Carry consumed authority provenance through restart, fresh `RUN_ID`, Page/Global rotation and Page-to-Global handoff; keep history append-only. Store only bounded operational IDs, scopes, hashes, purposes, stop conditions and review references. Reject transcript, customer/private chat content, credential, token, cookie, session and provider secret fields. No new retry/budget subsystem or multi-host coordination is authorized.

## Focused revalidation required after separate authorization

Record exact helper before/after SHA-256, scoped diff, synthetic fixture identity, commands, outputs, failures and evidence SHA-256. Use existing repository tooling and non-sensitive local fixtures; do not introduce a new test framework. At minimum:

1. Accept one complete valid descriptor → accepted Human result → accepted-result record → approval → semantic record → durable consumption chain, with the exact one-way write/hash/read-back order.
2. Reject fabricated or pre-Human accepted-result records, wrong `RECORDED_BY_COMMAND_ID`, causal order, copied Human decision, item, scope or `DECISION_ID`.
3. Reject wrong `RESULT_CORE_V1` field or `RESULT_HASH`, stale review-packet pre-approval hash, noncanonical JSON, duplicate JSON key and unsupported version.
4. Reject approval before accepted-result read-back, future semantic dependency, wrong `APPROVAL_RECORD_ID`, accepted-result path/hash or approval `RESULT_HASH`.
5. Reject semantic record before approval read-back, wrong approval-record SHA-256, payload drift, conflicting type/scope, caller metadata conflict and prose-header-only authority.
6. Reject duplicate consumed `DECISION_ID` or `APPROVAL_RECORD_ID`, incompatible item reuse, and replay after restart, fresh `RUN_ID`, same-role rotation or Page-to-Global handoff.
7. Accept one `EXCEPTION_ID = DECISION_ID` application and separate valid strict-positive recovery/evaluator increases. Reject duplicate exception, equal/lower maximum and `ADDED_ALLOWANCE` mismatch without resetting counters.
8. Accept valid reviewed SAME/DISTINCT bucket decisions and reject self-issued classification. Regress freeze `APPLY`/`LIFT`/`SUPERSEDE`, pending-command and `EXECUTION_UNCERTAIN` at-most-once, `EVIDENCE_STOP`, canonical serialization/hash, privacy rejection and historical budget/freeze cases.

All approved helper-scope requirements and focused tests must pass before helper convergence can be reported `COMPLETE`. Formal Technical Compliance, formal VERIFY and Federated Browser QA remain separate. Even successful helper convergence makes Phase 3 only `ELIGIBLE_FOR_SEPARATE_HUMAN_AUTHORIZATION`; it does not authorize Phase 3. Historical Phase 1/2 and rounds 30/43/55/65 are retained as historical evidence, not promoted to current convergence proof.

## Human decision boundary

Choose exactly one for this packet: `AUTHORIZE EXACT ACCEPTED RESULT HELPER CORRECTION` | `REQUEST EXACT ACCEPTED RESULT HELPER CORRECTION SCOPE CHANGES` | `DEFER EXACT ACCEPTED RESULT HELPER CORRECTION`.

Corresponding `CURRENT_USER_DECISION` tokens: `AUTHORIZE_EXACT_ACCEPTED_RESULT_HELPER_CORRECTION` | `REQUEST_EXACT_ACCEPTED_RESULT_HELPER_CORRECTION_SCOPE_CHANGES` | `DEFER_EXACT_ACCEPTED_RESULT_HELPER_CORRECTION`.

No choice is inferred from Design, Sensitive Design or Tasks/TIC approval, this packet's existence or a historical helper authorization. Remain `AWAITING_HUMAN_REVIEW` until the exact current-Human decision is provided.
