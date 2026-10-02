# One-way approval binding — bounded helper-correction Human Gate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW`  
Requested action: a separate, bounded correction of `state-helper.ps1` and focused synthetic revalidation. This packet does **not** authorize implementation.

## Exact reviewed baseline

| Artifact                                      | SHA-256                                                            | Treatment                                                |
| --------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| Approved Gate 2 delta Spec                    | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Unchanged; Gate 2 is not reopened.                       |
| Approved one-way-binding Design               | `ade4c1be825823e20bd1e7af5174f65ffe8b93e24872880ccbcd0c61cd30197a` | Exact planning contract.                                 |
| Recorded Design approval review               | `96beb048abfce195a41959e2d3cf6f7e6e29ade5ed3f941dc89432af8163e843` | Human-readable planning history.                         |
| Targeted Sensitive Design pre-approval packet | `dd3ec5d08dcf9d19dc5dc02026e3bfab190618c3128fb812fad32ae8982cc1c9` | Exact Human-reviewed risk packet.                        |
| Recorded Sensitive Design approval            | `a3ca38b46df7c049f4899eabc9154fc3338d96c9af3510179ac8c980a10513fc` | Human-readable planning history.                         |
| Targeted Tasks/TIC pre-approval packet        | `282a7a26015135f4a2d4c6dc4f5b51f43a777dd80ef6e9112bd861090357b601` | Exact Human-reviewed implementation plan.                |
| Current `tasks.md`                            | `b51fba978d8de2df80c79c64ea58ab366d77a1a55092247d0d3ef9da87f015c5` | 9/24 complete; T10–T24 unchecked.                        |
| Current `state-helper.ps1`                    | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` | Existing partial implementation; unchanged at this gate. |

The recorded Tasks/TIC approval is the exact current-user `APPROVE ONE WAY APPROVAL BINDING TASKS TIC`, relayed in Bridge result `BRIDGE-ARCH-20260925-F9R2:62` and recorded in `02u-one-way-approval-binding-tasks-tic-review.md`. Its current post-approval hash must be rechecked immediately before any separately authorized helper correction. The prose approval headers are Human-readable planning history, never the helper's machine trust root.

Round-30, round-43 and round-55 helper results remain historical `PARTIAL_NEEDS_REVIEW` evidence and are not promoted. Round-55 authorization is historical and cannot be replayed against this revised contract. Helper convergence remains `PARTIAL_NEEDS_REVIEW`; Phase 3 remains `NOT_AUTHORIZED`.

## Proposed exact implementation boundary

After a **new, explicit current-Human authorization** for this packet, the sole implementation owner is `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. Only bounded change/review/evidence metadata, and `tasks.md` metadata if required by the existing workflow, may accompany it. The correction must not modify the federated `SKILL.md`, tracked operating protocol, Bridge v1 artifacts or QA, Workflow v3, Page Chat authority, Product code, API, auth, database/schema, provider integration, deployment configuration, external service or live context. It must not activate a Page or Global tower, access Page Chats, perform live escalation/rotation, begin T10–T14, or authorize Phase 3.

The helper must read canonical authority artifacts without creating or repairing them. The authority chain is `PRE_DECISION_DESCRIPTOR` → accepted `HUMAN_GATE_RESULT` → canonical `GATE_RESULT_RECEIPT` → immutable `APPROVAL_RECORD` → immutable `SEMANTIC_DECISION_RECORD` → durable consumption. No predecessor requires a successor's path or SHA-256. The descriptor has zero runtime authority; `DECISION_ID` derives only from canonical `DECISION_TYPE`, `DECISION_SCOPE` and typed `PROPOSED_DECISION_PAYLOAD`. The receipt proves an already accepted exact Human Gate item and cannot create Human authority. The approval record binds the descriptor, exact Gate run/round/command/lineage/item/literal, pre-approval review packet path/hash and distinct causally later recording command. It contains no semantic-record path/hash. Only after approval persistence, hash and read-back may the semantic record bind its exact approval path/hash and approved typed payload.

Before any durable effect, the helper must resolve and compare canonical bytes, versions, paths, hashes, type, scope, proposed and completed payload, recomputed `DECISION_ID`, `APPROVAL_RECORD_ID`, `DECISION_ITEM_ID`, accepted Gate result, receipt, recording-command causal order and review evidence. Ordering alone, caller metadata, structurally valid but unapproved JSON and prose approval headers confer no authority. Missing, stale, malformed, mismatched, conflicting or unsupported provenance fails closed. The trust boundary is deterministic workflow-governed repository provenance, not cryptographic Human identity attestation; signatures, external identity providers, signed transcript export and remote attestation are out of scope.

The helper must journal consumed semantic `DECISION_ID`/hash, `APPROVAL_RECORD_ID`/hash and `DECISION_ITEM_ID` exactly once. Duplicate approval IDs, duplicate semantic consumption, incompatible item reuse and replay after restart, fresh `RUN_ID`, same-role rotation or Page→Global handoff must fail closed. Consumed authority records are append-only. Later material reclassification, maximum exception, freeze `LIFT` or `SUPERSEDE` requires a new descriptor, Human decision item, receipt, approval record and semantic record.

Human or already-authoritative reviewed workflow retains `SAME_MATERIAL_BUCKET` versus `DISTINCT_MATERIAL_BUCKET` judgment; the helper cannot infer material difference from path, hash, title, stage label, wrapper, run, tower or evaluator implementation. `BUDGET_MAXIMUM_EXCEPTION` requires `NEW_APPROVED_MAXIMUM > PREVIOUS_APPROVED_MAXIMUM` and exact positive `ADDED_ALLOWANCE`; equality is a no-op, lower maximum fails closed, and used counters do not reset. `BUDGET_EXECUTION_FREEZE` is independent: approved `APPLY`, `LIFT` and `SUPERSEDE` do not rewrite maximum or clear `EVIDENCE_STOP`. Preserve pending-command, `EXECUTION_UNCERTAIN`, at-most-once, budget, handoff and single-host rules. Persist only bounded operational IDs, scopes, hashes, purposes, stop conditions and review references; reject transcripts, customer data, credentials, tokens, cookies, sessions, provider secrets and private chat content.

## Focused revalidation required after separate authorization

Record exact helper before/after hashes, scoped diff, synthetic fixture identity, commands, outputs, fail-closed results, limitations and evidence hash. Use existing repository tooling with synthetic non-sensitive local contexts only; do not introduce a new test framework. Include at least:

1. Complete valid descriptor → accepted Human result → receipt → approval → semantic chain; exact canonical `DECISION_ID`; no future semantic hash in approval; semantic record bound to the already-created approval hash.
2. Rejection of wrong descriptor hash, `DECISION_ID`, fabricated or unresolved receipt, wrong Human Gate command/item/literal/scope, stale pre-approval packet hash, wrong recording command or causal order, semantic payload drift and wrong approval hash.
3. Rejection of duplicate approval ID or semantic consumption, incompatible item reuse, structurally valid but unapproved record, caller-only metadata and prose-header-only authority.
4. Replay rejection after restart, fresh `RUN_ID`, same-role rotation and Page→Global handoff.
5. Valid `SAME_MATERIAL_BUCKET` and `DISTINCT_MATERIAL_BUCKET` with reviewed authority; self-issued classification rejection.
6. Valid strictly positive recovery and evaluator maximum exceptions; rejection of equality, lower maximum and `ADDED_ALLOWANCE` mismatch without counter reset.
7. Valid authoritative freeze `APPLY`, `LIFT`, `SUPERSEDE`; rejection of unauthorized or wrong-active-freeze transition; freeze independence from maximum and `EVIDENCE_STOP`.
8. Pending-command, `EXECUTION_UNCERTAIN`, at-most-once, evidence-stop, canonical JSON/version/hash, privacy and historical budget/freeze regressions as new separately attributable evidence.

Do not promote historical partial results. Formal Technical Compliance, VERIFY and Federated Browser QA remain separate later steps. Successful helper convergence does not authorize Phase 3, which requires a further explicit current-Human decision.

## Human decision boundary

Choose exactly one for this packet: `AUTHORIZE ONE WAY APPROVAL BINDING HELPER CORRECTION`, `REQUEST ONE WAY APPROVAL BINDING HELPER SCOPE CHANGES`, or `DEFER ONE WAY APPROVAL BINDING HELPER CORRECTION`. No choice is inferred from Design, Sensitive Design, Tasks/TIC approval or this packet's existence. Remain at `AWAITING_HUMAN_REVIEW` until the exact decision is provided.
