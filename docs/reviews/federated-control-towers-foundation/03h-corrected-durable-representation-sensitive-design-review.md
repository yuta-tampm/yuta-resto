# Corrected Durable Representation Model — approved targeted Sensitive Design decision

Current targeted Sensitive Design status: `APPROVED` for the pre-approval packet SHA-256 `dbb0e793c9b95590dd1af314a4717e7e71645966f2d6ee6af338a5c3dacedd61` only.  
Approval source: exact current-user `APPROVE CORRECTED DURABLE REPRESENTATION SENSITIVE DESIGN`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:107` as `APPROVE_CORRECTED_DURABLE_REPRESENTATION_SENSITIVE_DESIGN`.  
Bound approved Design SHA-256: `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable approval is review evidence only, never runtime machine authority. Targeted Tasks/TIC, fresh helper correction and Phase 3 remain separate gates.

---

# Corrected Durable Representation Model — targeted Sensitive Design candidate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` after separate revised Design approval; this candidate is not approved by the model decision.  
Revised Design SHA-256: `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`.  
Revised Design approval: exact current-user `APPROVE CORRECTED DURABLE REPRESENTATION DESIGN` in Bridge result `BRIDGE-ARCH-20260925-F9R2:105`; approved Design review `03g-corrected-durable-representation-design-review.md` SHA-256 `ed55d3101dab53c2dc00d051a2c527ba8d7875a59ccebf2d756dd1c81b5bc60a`. Its preserved pre-approval packet SHA-256 is `c5e3563338fc477c07a3cf689b2024938a070b4384cc96e6d18cc1a0e34475cc`.  
Prior approved Sensitive Design review `03c-runtime-authority-identity-sensitive-design-review.md` SHA-256: `94ec3e15c4fb86a5dec9474996e39ba1a91bde61b3a32ae8607e4ef730c2a17d` (historical).  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).

## Targeted risks and fail-closed controls

| Risk                                                           | Required control and stop behavior                                                                                                                                                             |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Corrupt or missing current active-freeze projection            | Require the exact activation `CURRENT_ACTIVE_FREEZES` array and canonical entries; reject unsupported, missing or malformed new-model state before affected execution.                         |
| Duplicate active budget scope                                  | Sort by UTF-8 canonical scope bytes, require one entry per exact scope and reject duplicates; never choose one entry.                                                                          |
| Wrong recovery/evaluator scope                                 | Recovery requires `BUCKET_KEY: null`; evaluator requires its authoritative key; mismatch in context or causal lineage blocks.                                                                  |
| Projection/history disagreement                                | Reconcile each active entry against ordered committed `AUTHORITY_CONSUMED` events, matching consumed proofs and immutable semantic records; return `NEEDS_REVIEW` on any disagreement.         |
| Invalid APPLY/LIFT/SUPERSEDE delta                             | Compare exact pre/post arrays; require null/no-active for APPLY, exact current target for LIFT/SUPERSEDE, exactly one proof and no unrelated scope change. Stale or conflicting target blocks. |
| Approval metadata mistaken for runtime authority               | Retain the six-field `APPROVAL_REFERENCES` solely as generic provenance. Never derive freeze state, history, approval or replay status from it.                                                |
| Proof/freeze mismatch in journal                               | `STATE_PAYLOAD` must contain the complete post-state with exactly one new canonical proof and the corresponding freeze delta; reject missing, multiple, altered or mismatched entries.         |
| Crash after authority commit, before snapshot replacement      | Durable journal flush commits consumption. On restart validate the hash chain, reconstruct the exact `STATE_PAYLOAD`, complete snapshot convergence, and never reapply or reuse the decision.  |
| Partial or unverifiable journal append                         | Do not infer consumption or retry by assumption; fail closed and require existing recovery/`NEEDS_REVIEW` handling.                                                                            |
| Crash after snapshot replacement or during dependent execution | Require exact journal/snapshot equality; dependent execution starts only after read-back and retains `PENDING_COMMAND_ID`, `EXECUTION_UNCERTAIN` and at-most-once protections.                 |
| Handoff omits or changes active freezes/proofs                 | Include both arrays in `HANDOFF_HASH`; compare exact handoff/source and receiving/handoff values. Any omission or mismatch blocks executable activation.                                       |
| Illegal merge or backfill                                      | No union, larger-set preference, inference, prose/hash repair or backfill across handoff, restart, rotation or escalation. Conflicting state is `NEEDS_REVIEW`.                                |
| False empty historical normalization                           | Missing new-model arrays become `[]` only with proof of zero new-model consumption, active freeze, implied maximum exception and material classification; otherwise `NEEDS_REVIEW`.            |

The approved one-way Human authority chain, exact accepted-result proof, same/distinct material authority, strict-positive maximum exceptions, monotonic counters/maximum, independent evidence-stop, privacy and single-host boundary remain. These records contain only bounded IDs, scope, references and hashes; no transcript, customer/private chat content, credential, token, cookie or session. No Product or Human authority is created by the runtime state.

This review requests no helper correction, SelfTest, runtime activation, Phase 3, formal Technical Compliance, VERIFY, Browser QA or Bridge v1 QA promotion. Prior Phase 1/2 and `03f` evidence remains historical; helper convergence is `NEEDS_REVIEW`.

Human decision after revised Design approval: `APPROVE CORRECTED DURABLE REPRESENTATION SENSITIVE DESIGN` | `REQUEST CORRECTED DURABLE REPRESENTATION SENSITIVE DESIGN CHANGES` | `DEFER CORRECTED DURABLE REPRESENTATION SENSITIVE DESIGN`.
