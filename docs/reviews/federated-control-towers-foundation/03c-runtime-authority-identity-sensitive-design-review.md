# Runtime Authority Identity Model — approved targeted Sensitive Design decision

Current targeted Sensitive Design status: `APPROVED` for the pre-approval packet SHA-256 `6fcfe184239dfc1139bbf7dbcbc4fcfd4703d110819fae246e4d94d4fcab1924` only.  
Approval source: exact current-user `APPROVE RUNTIME AUTHORITY IDENTITY SENSITIVE DESIGN`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:94` as `APPROVE_RUNTIME_AUTHORITY_IDENTITY_SENSITIVE_DESIGN`.  
Bound revised Design SHA-256: `42f71996db47a2e0e5e88bc4b8f8648658ada9951711e7a389c98ffc04922b5a`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable approval is review evidence only, never runtime machine authority. Targeted Tasks/TIC, fresh helper correction and Phase 3 remain separate gates.

---

# Runtime Authority Identity Model — targeted Sensitive Design candidate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` after separate revised Design approval; not approved by this packet.  
Revised Design SHA-256: `42f71996db47a2e0e5e88bc4b8f8648658ada9951711e7a389c98ffc04922b5a`.  
Revised Design approval: exact current-user `APPROVE RUNTIME AUTHORITY IDENTITY DESIGN` in Bridge result `BRIDGE-ARCH-20260925-F9R2:92`; approved Design review `03b-runtime-authority-identity-design-review.md` SHA-256 `3363f3132ef910db17bb59af4829788d9243b222ade6c78276404f5141026cb6`. Its preserved pre-approval packet SHA-256 is `ae5ca070744ce431791c51e57db991cf2a7e7cc281b78bb0ba01f325a917a7b0`.  
Current Tasks/TIC SHA-256: `2c362394e4caeb98d7cfef7daf610c11200282b85109f8ae5282abfb1bb25d55` (candidate; no new Tasks/TIC approval).  
Prior approved Sensitive Design `02x` SHA-256: `41aabcab5e639661832c086e05cbaefcdbebef5e29b5e2e8117c5c3f24c06da7` (historical).  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).

## Targeted risks and required fail-closed behavior

| Risk                                                                 | Required control                                                                                                                             |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Missing, wrong, generic, stale or cross-type Human approval token    | Resolve `DECISION_TYPE` and compare exact version-one token; prose, fuzzy match, negative choice or token alias grants zero authority.       |
| Noncanonical, duplicated or unknown JSON fields                      | Recompute `CANONICAL_JSON_V1` bytes/hashes for each exact schema; reject unsupported versions, forbidden null/boolean or duplicate keys.     |
| Wrong freeze scope, payload or pre-Human ID                          | Recompute exact `DECISION_ID_INPUT_V1`; compare descriptor, accepted result, approval, semantic record and committed scope.                  |
| APPLY/LIFT/SUPERSEDE alias or target confusion                       | Require exact current active target and one active freeze per budget scope; no separate freeze hash formula or implicit lift.                |
| Missing, corrupt, conflicting or partially written consumption proof | Recompute eight-field proof hash; reject malformed array, duplicate IDs, journal/snapshot disagreement and incomplete post-state.            |
| Journal-first crash windows                                          | Recover complete `POST_STATE` after durable event; never reapply after snapshot write; unverifiable event blocks.                            |
| Replay after restart, fresh run, rotation or handoff                 | Preserve and reconcile full proof set and one-way chain; transport identity never resets consumption.                                        |
| Historical proof falsely backfilled                                  | Normalize absent array empty only with proof that zero new-model decisions were consumed; otherwise `NEEDS_REVIEW`.                          |
| Synthetic SelfTest mistaken for live authority                       | Use a private per-run non-repository fixture root and same verifier functions; no external trust-root override or direct approved flag.      |
| Privacy leakage                                                      | Persist bounded IDs, hashes, scopes and references only; no transcript, customer/private chat content, credential, token, cookie or session. |

The exact negative-case review also includes:

- **Approval tokens:** missing mapping, unknown type, generic `APPROVE`, `REQUEST`/`DEFER`/`REJECT`, wrong-type or stale token, case/punctuation/fuzzy normalization, prose-derived token and caller token conflicting with `ACCEPTED_GATE_RESULT_RECORD` all grant zero authority.
- **Canonical bytes:** BOM, comments, insignificant whitespace, trailing newline, wrong ordinal key order, duplicate/unknown fields, noncanonical integer or boolean, and null outside an exact nullable field fail closed.
- **Freeze scope and identity:** wrong budget type, recovery with non-null bucket, evaluator with wrong bucket, wrong context/lineage, missing or wrong active target, wrong purpose/stop binding, unknown transition or an independently hashed freeze/transition ID fail closed. APPLY requires no active freeze; LIFT and SUPERSEDE require the exact current active target in the same scope. LIFT creates no new freeze; SUPERSEDE atomically deactivates the old and activates the sole replacement.
- **Consumed proof:** missing/unknown/duplicate field, unsupported version, wrong or malformed hash, unsorted array, identity collision or a proof weakened to prose fails closed. Duplicate or conflicting `DECISION_ID`, `APPROVAL_RECORD_ID`, `DECISION_ITEM_ID` or consumed `RESULT_HASH` cannot grant another effect.
- **Journal and crash:** wrong discriminator, a value other than `AUTHORITY_CONSUMED`, parallel event-kind field, missing complete `POST_STATE`, snapshot before journal flush, execution before read-back, partial/unverifiable event, snapshot/journal disagreement and replayed effect after crash all block.
- **Transport continuity:** restart, fresh `RUN_ID`, either same-role rotation and Page-to-Global handoff preserve complete proofs. Handoff prose is not proof; the receiver cannot become executable before durable reconciliation. The Phase-2 command ledger remains separate.
- **Historical and test isolation:** missing proof despite implied consumption, prose/hash backfill, promotion of partial historical evidence, or false zero-consumption normalization require `NEEDS_REVIEW`. SelfTest fixtures must stay outside repository authority paths, use the same verifier functions, avoid environment bypass/direct approval flags and never become live authority. Fixtures contain no sensitive data.
- **Privacy and trust:** reject transcript, customer personal data, provider secret, credentials, token, cookie, session or unrelated private content. Workflow-governed provenance provides no cryptographic Human identity, external IdP, signature, remote attestation or cross-host trust.

Missing, stale, replayed, wrong-scope, hash-mismatched or conflicting evidence stops before semantic effect or dependent execution. The helper does not infer Human approval or material bucket distinction. The model neither creates Product authority nor changes PAGE_LOCAL Page Chat ownership, Workflow v3, Bridge v1 or single-host scope. Workflow provenance is not cryptographic Human identity proof.

No helper correction, SelfTest, Phase 3, formal Technical Compliance, VERIFY or Browser QA is authorized here. T01–T09 stay historical completion; T10–T24 remain unchecked. This packet requires separate Human review after the revised Design decision.

Human decision for this exact packet: `APPROVE RUNTIME AUTHORITY IDENTITY SENSITIVE DESIGN` | `REQUEST RUNTIME AUTHORITY IDENTITY SENSITIVE DESIGN CHANGES` | `DEFER RUNTIME AUTHORITY IDENTITY SENSITIVE DESIGN`.
