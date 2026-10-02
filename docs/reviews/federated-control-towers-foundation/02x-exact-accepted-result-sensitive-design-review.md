# Exact accepted-result proof model — approved targeted Sensitive Design decision

Current targeted Sensitive Design status: `APPROVED` for the pre-approval packet SHA-256 `fff928ba609ded197ac18f4bf35396560a86be834a7c7644475eee66e7e89ac4` only.  
Approval source: exact current-user `APPROVE EXACT ACCEPTED RESULT SENSITIVE DESIGN`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:77`.  
Bound Design SHA-256: `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable approval does not substitute for the canonical accepted-result/approval/semantic chain required for runtime budget decisions. Targeted Tasks/TIC, fresh helper correction and Phase 3 remain separate gates.

---

# Exact accepted-result proof model — targeted Sensitive Design candidate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` after the revised Design Human gate; not approved by this packet.  
Revised Design: `openspec/changes/federated-control-towers-foundation/design.md` SHA-256 `1866cdb7aaf86a8b6e685c798ac8b523e20d38cb236995b8051c6f22d7344e6c`.  
Revised Design approval: exact current-user `APPROVE EXACT ACCEPTED RESULT DESIGN` in Bridge result `BRIDGE-ARCH-20260925-F9R2:70`; approval review `02w-exact-accepted-result-design-review.md` SHA-256 `651c88c2fd3a4f9be47d275619ff16f593e2fe56ceed3a3579ff046b7d006b28`.  
Pre-planning approved Design SHA-256: `ade4c1be825823e20bd1e7af5174f65ffe8b93e24872880ccbcd0c61cd30197a`.  
Prior approved one-way Sensitive Design record: `02t-one-way-approval-binding-sensitive-design-review.md` SHA-256 `a3ca38b46df7c049f4899eabc9154fc3338d96c9af3510179ac8c980a10513fc` (historical).  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).

## Targeted risk review

| Risk                                                        | Required control and fail-closed behavior                                                                                                                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fabricated accepted-result record                           | Require an accepted valid Human Gate result and a distinct later recording command in the same causal lineage. Repository JSON alone cannot manufacture acceptance.                       |
| Wrong `RESULT_HASH`                                         | Recompute from exact canonical `RESULT_CORE_V1` bytes and require canonical path/hash match.                                                                                              |
| Wrong result-core field binding                             | Compare all fourteen exact fields to the Gate command, accepted result, descriptor, packet and scope. Reject omitted, extra or inconsistent fields.                                       |
| Result record created before Human acceptance               | Require accepted-result observation before workflow recording; chronological command ordering alone is insufficient.                                                                      |
| Recording command changes Human decision                    | Copy accepted result fields exactly; reject altered, inferred, broadened or normalized-to-another-choice data.                                                                            |
| Wrong causal order                                          | Recording command must be distinct and later than Human Gate command in the same validated lineage.                                                                                       |
| Stale pre-approval review evidence                          | Bind preserved packet bytes/hash captured before Human choice; never reconstruct by removing a later approval header.                                                                     |
| Approval lacks accepted-result binding                      | Approval must include accepted-result path/hash and `RESULT_HASH`; missing or mismatched binding blocks.                                                                                  |
| Semantic record binds wrong approval hash                   | Approval must be written, hashed and read back first; semantic record points to its exact immutable hash.                                                                                 |
| Equal maximum presented as exception                        | Equality is no-op, not exception authority; strict positive increase and exact allowance are mandatory.                                                                                   |
| Duplicate exception replay                                  | `EXCEPTION_ID = DECISION_ID`; consume once in the existing journal/snapshot transaction and preserve history across transport changes.                                                    |
| Conflicting identity reuse                                  | Compare consumed decision, approval, result and item identities and hashes before effect; incompatible reuse blocks.                                                                      |
| Accepted-result mutation after consumption                  | Validate canonical bytes/hash and append-only history; altered authority artifact blocks.                                                                                                 |
| Workflow provenance confused with cryptographic attestation | State the accepted workflow-governed repository trust boundary; no claim of cryptographic Human identity or compromised-writer resistance.                                                |
| Privacy leakage                                             | Permit bounded operational IDs, scope, timestamps, purpose/stop references and hashes only. Reject transcripts, customer/private chat content, credentials, tokens, cookies and sessions. |

Additional exact binding and replay risks remain independently reviewable:

| Risk                                                                                      | Required control and fail-closed behavior                                                                                                          |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Noncanonical result JSON, duplicate keys, unsupported version or mutated bytes            | Enforce exact version-one schema, recursive ordinal key ordering, UTF-8 bytes and path/hash read-back; reject every deviation.                     |
| Approval written before accepted-result persistence                                       | Require accepted-result durable write, hash and read-back before approval write. A later matching file does not cure a broken ordering proof.      |
| Approval references a future semantic path/hash                                           | Reject reverse or circular binding; only the later semantic record may reference the approval hash.                                                |
| Wrong `APPROVAL_RECORD_ID`                                                                | Recompute from exactly the five approved canonical inputs and match field and path.                                                                |
| Wrong accepted-result path/hash, `RESULT_HASH`, item or decision in approval              | Resolve the canonical accepted-result record and compare its exact result core with every repeated approval field.                                 |
| Wrong approval-recording command or order                                                 | Require distinct, causally later command in the same lineage; reject metadata that merely claims an order.                                         |
| Semantic record written before approval read-back                                         | Require durable approval write, hash and successful read-back first; reject early semantic authority.                                              |
| Semantic payload drift or conflicting type/scope                                          | Recompute `DECISION_ID` from reviewed descriptor and compare typed payload, `DECISION_TYPE` and `DECISION_SCOPE` across all records.               |
| Caller metadata contradicts repository evidence                                           | Repository records govern mechanical verification; reject the conflicting operation rather than accepting caller-provided approval.                |
| Duplicate consumed `DECISION_ID`, `APPROVAL_RECORD_ID` or incompatible `DECISION_ITEM_ID` | Check the existing journal/snapshot consumption history before application; reject already consumed or incompatible identities.                    |
| Replay after restart, fresh run, rotation or Page-to-Global handoff                       | Carry consumed semantic/result/approval IDs and hashes plus item unchanged; transport changes never reset them.                                    |
| Later reclassification, exception or freeze transition reuses old authority               | Preserve append-only records; require a fresh reviewed descriptor, accepted result, approval and semantic chain.                                   |
| Duplicate semantic positive exception                                                     | Identical payload yields the same `DECISION_ID = EXCEPTION_ID` and is rejected; no second capacity increase.                                       |
| Incorrect positive maximum arithmetic                                                     | Require `NEW_APPROVED_MAXIMUM > PREVIOUS_APPROVED_MAXIMUM` and exact positive `ADDED_ALLOWANCE`; equality is no-op and decrease blocks.            |
| Result hash is mistaken for domain authority                                              | Keep `RESULT_HASH`, decision/item/approval IDs, exception and freeze identities distinct; result evidence alone grants no execution or Human Gate. |

Missing, stale, noncanonical, unsupported-version, wrong-command/lineage/item/scope or conflicting descriptor, accepted-result, approval or semantic evidence yields zero executable authority and `BLOCKED`/`NEEDS_REVIEW`. The helper never creates, edits or approves authority artifacts. SAME/DISTINCT remains Human or reviewed-workflow judgment. Independent freeze, monotonic budgets, pending-command at-most-once and `EVIDENCE_STOP` remain unchanged. `PAGE_LOCAL` Product/shaping authority stays with the owning Page Chat; Global Control Tower coordinates under Workflow v3 and Codex is the executor. No Product, Page Chat, Human Gate, provider, Apply or cross-host authority, Bridge v1 wire change, destructive capability or implementation permission follows from this candidate. Cryptographic signatures, external identity, signed transcript export and remote attestation require separate review.

Implementation remains 9/24; T10–T24 remain unchecked. Helper correction is `PAUSED_NEEDS_REVIEW`; Phase 3 is `NOT_AUTHORIZED`. Formal Technical Compliance, VERIFY and Federated Browser QA have not run for this delta. The revised Design is approved; this Sensitive Design candidate awaits its own separate Human decision. Tasks/TIC and fresh helper-correction authorization remain later gates.

Human decision for this exact packet: `APPROVE EXACT ACCEPTED RESULT SENSITIVE DESIGN` | `REQUEST EXACT ACCEPTED RESULT SENSITIVE DESIGN CHANGES` | `DEFER EXACT ACCEPTED RESULT SENSITIVE DESIGN`.

Corresponding `CURRENT_USER_DECISION` tokens: `APPROVE_EXACT_ACCEPTED_RESULT_SENSITIVE_DESIGN` | `REQUEST_EXACT_ACCEPTED_RESULT_SENSITIVE_DESIGN_CHANGES` | `DEFER_EXACT_ACCEPTED_RESULT_SENSITIVE_DESIGN`.
