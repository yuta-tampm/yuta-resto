# One-way approval binding — approved targeted Tasks/TIC decision

Current targeted Tasks/TIC status: `APPROVED` for the pre-approval packet SHA-256 `282a7a26015135f4a2d4c6dc4f5b51f43a777dd80ef6e9112bd861090357b601` only.  
Approval source: exact current-user `APPROVE ONE WAY APPROVAL BINDING TASKS TIC`, relayed in YUTA Control Tower Bridge result `BRIDGE-ARCH-20260925-F9R2:62`.  
Bound current Tasks SHA-256: `b51fba978d8de2df80c79c64ea58ab366d77a1a55092247d0d3ef9da87f015c5`; approved Design SHA-256: `ade4c1be825823e20bd1e7af5174f65ffe8b93e24872880ccbcd0c61cd30197a`; recorded Sensitive Design approval SHA-256: `a3ca38b46df7c049f4899eabc9154fc3338d96c9af3510179ac8c980a10513fc`.  
This Human-readable planning approval record is not the canonical machine authority for a later runtime semantic decision. Such a decision still requires its own accepted Human Gate result, canonical receipt, approval record and semantic decision record.  
Approval permits preparation of a separate bounded helper-correction Human Gate only. It does not authorize helper modification or Phase 3. Implementation remains 9/24; T10–T24 remain unchecked; helper convergence remains `PARTIAL_NEEDS_REVIEW`; Phase 3 remains `NOT_AUTHORIZED`.

The review below preserves the exact pre-approval packet. Its `AWAITING_HUMAN_REVIEW` wording describes the state before this current-user decision.

---

# One-way approval binding — targeted Tasks/TIC review

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` for this targeted Tasks/TIC delta only.  
Current Tasks SHA-256: `b51fba978d8de2df80c79c64ea58ab366d77a1a55092247d0d3ef9da87f015c5`.  
Approved Design SHA-256: `ade4c1be825823e20bd1e7af5174f65ffe8b93e24872880ccbcd0c61cd30197a`; Design approval review SHA-256: `96beb048abfce195a41959e2d3cf6f7e6e29ade5ed3f941dc89432af8163e843`.  
Targeted Sensitive Design pre-approval packet SHA-256: `dd3ec5d08dcf9d19dc5dc02026e3bfab190618c3128fb812fad32ae8982cc1c9`.  
Sensitive Design approval source: exact current-user `APPROVE ONE WAY APPROVAL BINDING SENSITIVE DESIGN`, relayed in Control Tower result `BRIDGE-ARCH-20260925-F9R2:60`; recorded approval review `02t-one-way-approval-binding-sensitive-design-review.md` SHA-256 `a3ca38b46df7c049f4899eabc9154fc3338d96c9af3510179ac8c980a10513fc`.  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).  
Prior approved Tasks/TIC SHA-256: `dd8346d79bf3dd5d70b51510cb34c0855707b2c33f662f98693c91da8cb46732` (historical for the previous Design bytes).

## Targeted TIC delta

The existing 24 tasks and six phases remain. T01–T09 retain historical completion; T10–T24 remain unchecked. The new pre-Phase-3 checkpoint requires this exact one-way chain: non-authoritative `PRE_DECISION_DESCRIPTOR` → accepted Human Gate result → canonical `GATE_RESULT_RECEIPT` → immutable `APPROVAL_RECORD` → immutable semantic decision record → durable consumption. No predecessor depends on a later artifact hash. `DECISION_ID` comes only from canonical `DECISION_TYPE`, `DECISION_SCOPE` and typed `PROPOSED_DECISION_PAYLOAD`, not a later Human item or record. A receipt documents an already accepted item; it creates no authority. Prose headers remain Human-readable history and never become helper machine trust evidence.

The approval record is separate from the semantic record, has no later semantic path/hash, and binds the descriptor, exact Human Gate result/item/literal, canonical scope, pre-approval packet path/hash and a causally later recording command. Ordering alone cannot fabricate a Human decision. Only after approval persistence, hash and read-back may the semantic record bind its exact approval path/hash and approved typed payload. The helper later reads and mechanically validates the whole chain before an effect; it cannot create, approve, repair, rewrite or silently supersede authority artifacts. Structurally valid but unapproved JSON and caller-supplied metadata alone fail closed. The trust model remains workflow-governed repository provenance, not cryptographic Human attestation.

Consumption must journal exact semantic `DECISION_ID`/hash, `APPROVAL_RECORD_ID`/hash and `DECISION_ITEM_ID` once. Duplicate approval ID, incompatible item reuse or replay after restart, fresh `RUN_ID`, same-role rotation or Page→Global handoff blocks. Used authority records are append-only; a later material reclassification, positive maximum exception or freeze transition needs a fresh reviewed chain. SAME/DISTINCT remains Human or reviewed-workflow authority. A maximum exception requires `NEW_APPROVED_MAXIMUM > PREVIOUS_APPROVED_MAXIMUM`, exact positive `ADDED_ALLOWANCE`, no counter reset and no implicit freeze lift. Independent freeze, pending command, at-most-once, `EVIDENCE_STOP`, handoff, privacy and single-host semantics remain unchanged.

## Later bounded helper correction and evidence

A **new, separate Human helper-correction authorization** is required after this Tasks/TIC review. That later correction may touch only `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` and narrowly necessary review/evidence metadata. It does not permit changes to the skill instructions, tracked operating protocol, Bridge v1, Workflow v3, Product code, auth, schema, provider integrations or deployment configuration. It does not activate a Page or Global tower, access Page Chats, perform live escalation/rotation or start T10–T14.

The focused synthetic revalidation required after that separate authorization covers:

1. Valid descriptor → accepted Human result → receipt → approval → semantic chain; canonical `DECISION_ID` recomputation; approval with no future semantic hash; semantic record with the exact approval hash.
2. Rejection of wrong descriptor hash, `DECISION_ID`, Gate command, item, literal, canonical scope, pre-approval packet hash, recording command or causal order; fabricated receipt or approval; semantic payload drift or wrong approval hash.
3. Rejection of duplicate `APPROVAL_RECORD_ID`, incompatible `DECISION_ITEM_ID` reuse and replay after restart, fresh run, same-role rotation and Page→Global handoff.
4. Regression checks for strict-positive exception, SAME/DISTINCT authority, independent freeze, monotonic budgets, canonical serialization, privacy, pending-command at-most-once and evidence-stop.

Historical round-30, round-43 and round-55 helper evidence stays historical `PARTIAL_NEEDS_REVIEW`; it is not promoted by these planning approvals. Round-55 helper authorization stopped before mutation and cannot be reused for the revised contract. Helper convergence remains `PARTIAL_NEEDS_REVIEW`, and Phase 3 remains `NOT_AUTHORIZED`. This packet does not authorize helper modification, Phase 3, live activation, formal Technical Compliance, VERIFY, Browser QA, Gate 3 or lifecycle promotion. Even successful later helper convergence would still require separate explicit Human Phase 3 authorization.

This exact Tasks/TIC delta awaits a separate Human decision: `APPROVE ONE WAY APPROVAL BINDING TASKS TIC` | `REQUEST ONE WAY APPROVAL BINDING TASKS TIC CHANGES` | `DEFER ONE WAY APPROVAL BINDING TASKS TIC`.
