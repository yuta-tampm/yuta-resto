# Exact accepted-result proof model — approved targeted Tasks/TIC decision

Current targeted Tasks/TIC status: `APPROVED` for the pre-approval packet SHA-256 `56088d06f4a8eab344af4eae605519e8af9f04b2356d0725186b9aeb4d15ac4c` only.  
Approval source: exact current-user `APPROVE EXACT ACCEPTED RESULT TASKS TIC`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:83`.  
Bound Design SHA-256: `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c`.  
Bound Sensitive Design approval review SHA-256: `41aabcab5e639661832c086e05cbaefcdbebef5e29b5e2e8117c5c3f24c06da7`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable approval is planning history, not runtime machine authority. Fresh helper correction and Phase 3 require separate Human authorization.

---

# Exact accepted-result proof model — targeted Tasks/TIC candidate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` after separate revised Design and Sensitive Design Human gates; not approved by this packet.  
Updated Tasks: `openspec/changes/federated-control-towers-foundation/tasks.md` SHA-256 `5eec6002d1c24d0cd34c5c98c0a3e1d1c91d256db9497df7f49b65e47cf3247c`.  
Pre-planning approved Tasks SHA-256: `b51fba978d8de2df80c79c64ea58ab366d77a1a55092247d0d3ef9da87f015c5`.  
Revised Design SHA-256: `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c`.  
Targeted Sensitive Design approval: exact current-user `APPROVE EXACT ACCEPTED RESULT SENSITIVE DESIGN` in Bridge result `BRIDGE-ARCH-20260925-F9R2:77`; pre-approval packet SHA-256 `fff928ba609ded197ac18f4bf35396560a86be834a7c7644475eee66e7e89ac4`; approval review `02x-exact-accepted-result-sensitive-design-review.md` SHA-256 `41aabcab5e639661832c086e05cbaefcdbebef5e29b5e2e8117c5c3f24c06da7`.  
Prior approved one-way Tasks/TIC record: `02u-one-way-approval-binding-tasks-tic-review.md` SHA-256 `07933950e0c0e688cb7d368331623123746abc22ee2ea16034ed57adc8b4cceb` (historical).  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).

## Targeted TIC delta

The 24 tasks and six phases remain. T01–T09 retain historical completion; T10–T24 remain unchecked. Before a later separately authorized helper correction, require the exact chain: descriptor, accepted Human Gate result, canonical `ACCEPTED_GATE_RESULT_RECORD`, immutable approval record, later immutable semantic record and durable consumption. The accepted-result record is the sole repository machine source for `RESULT_HASH`; a diagnostic receipt and Human-readable approval header are not machine authority. Its recording command is distinct, later and in the same causal lineage. The helper is read-only for all four authority artifact classes and must fail closed on missing, fabricated, malformed, stale or conflicting evidence.

The helper must recompute `DECISION_ID` from canonical type/scope/proposed payload; derive `DECISION_ITEM_ID` from exact Human Gate command plus `#` ordinal; compute `RESULT_HASH` over only the fourteen-field `RESULT_CORE_V1`; and recompute `APPROVAL_RECORD_ID` from exactly the five Design inputs. Accepted-result write/hash/read-back precedes approval; approval write/hash/read-back precedes semantic decision. No predecessor binds a future hash. The semantic payload and scope must match the reviewed proposal and accepted Human effect. Caller metadata or prose cannot supply a missing Human decision.

For positive maximum exceptions, remove `APPLICATION_ID` entirely and require `EXCEPTION_ID = DECISION_ID`. A strict positive change with exact allowance is the only exception. Used counters never reset; an identical repeat cannot add capacity twice. Journal consumed semantic ID/hash, approval ID/hash, `RESULT_HASH` and item exactly once in the existing transaction. Carry them through restart, fresh `RUN_ID`, Page/Global rotation and Page-to-Global handoff. Preserve independent freeze, SAME/DISTINCT material authority, pending-command at-most-once and evidence-stop state.

Authority artifacts remain bounded to operational IDs, hashes, scopes and review references; they contain no transcript, customer/private chat content, credential, token, cookie, session or provider secret. Bridge v1 wire grammar, Workflow v3 authority, Page Chat Product/shaping authority and the existing single-host boundary remain unchanged.

## Later focused revalidation after a separate helper authorization

1. Accept one valid complete descriptor → accepted Human Gate result → canonical `ACCEPTED_GATE_RESULT_RECORD` → immutable approval → later immutable semantic record → durable consumption chain.
2. Reject a fabricated accepted-result record, a record created before Human acceptance, wrong `RECORDED_BY_COMMAND_ID` or causal order, and recording that alters `CURRENT_USER_DECISION`, `DECISION_ITEM_ID`, `DECISION_SCOPE` or `DECISION_ID`.
3. Reject a wrong `RESULT_CORE_V1` field, wrong `RESULT_HASH`, stale `REVIEW_PACKET_PRE_APPROVAL_SHA256`, noncanonical JSON, duplicate JSON key or unsupported version.
4. Reject approval created before accepted-result write/hash/read-back, approval referencing a future semantic artifact, wrong `APPROVAL_RECORD_ID`, wrong accepted-result path/hash, wrong `RESULT_HASH` in approval, or wrong approval-recording command.
5. Reject semantic record created before approval read-back, wrong `APPROVAL_RECORD_SHA256`, semantic payload drift, conflicting `DECISION_TYPE` or `DECISION_SCOPE`, caller metadata contradicting repository authority, and prose-header-only authority.
6. Reject duplicate consumed `DECISION_ID` or `APPROVAL_RECORD_ID`, incompatible `DECISION_ITEM_ID` reuse, and replay after restart, fresh `RUN_ID`, same-role rotation or Page-to-Global handoff.
7. Accept a valid `EXCEPTION_ID = DECISION_ID` application once; reject an identical semantic exception replay. Accept separately approved strict-positive recovery and evaluator maximum increases with exact `ADDED_ALLOWANCE`; a later genuine exception starts from the new committed previous maximum and receives a new `DECISION_ID`. Reject equality as a no-op, a lower maximum and allowance mismatch.
8. Verify valid `SAME_MATERIAL_BUCKET` and `DISTINCT_MATERIAL_BUCKET` authority and reject self-issued material classification. Regress freeze APPLY/LIFT/SUPERSEDE, pending-command and `EXECUTION_UNCERTAIN` at-most-once behavior, independent `EVIDENCE_STOP`, monotonic counters/maximum, privacy-field rejection and historical budget/freeze/at-most-once cases.

These tests have **not** run. Phase 1/2 and rounds 30/43/55/65 remain historical evidence only. Helper convergence is `PAUSED_NEEDS_REVIEW`, Phase 3 `NOT_AUTHORIZED`. Revised Design and Sensitive Design approvals are recorded; Tasks/TIC approval and then new helper-correction authorization remain separate later gates. This packet grants no implementation, live activation, QA or Phase 3 authority.

Human decision for this exact packet: `APPROVE EXACT ACCEPTED RESULT TASKS TIC` | `REQUEST EXACT ACCEPTED RESULT TASKS TIC CHANGES` | `DEFER EXACT ACCEPTED RESULT TASKS TIC`.

Corresponding `CURRENT_USER_DECISION` tokens: `APPROVE_EXACT_ACCEPTED_RESULT_TASKS_TIC` | `REQUEST_EXACT_ACCEPTED_RESULT_TASKS_TIC_CHANGES` | `DEFER_EXACT_ACCEPTED_RESULT_TASKS_TIC`.
