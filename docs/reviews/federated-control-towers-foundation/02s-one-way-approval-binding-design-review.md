# One-way approval binding — approved targeted Design decision

Current targeted Design status: `APPROVED` for the pre-approval packet SHA-256 `7c55592a6117765ab9e86d9ac044df5d2349e7312589c72743a60c45512005ad` only.  
Approval source: exact current-user `APPROVE ONE WAY APPROVAL BINDING DESIGN`, relayed in YUTA Control Tower Bridge result `BRIDGE-ARCH-20260925-F9R2:58`.  
Bound revised Design SHA-256: `ade4c1be825823e20bd1e7af5174f65ffe8b93e24872880ccbcd0c61cd30197a`.  
This Human-readable planning approval record does not substitute for the canonical structured Human Gate, receipt, approval and semantic records required before any later runtime budget decision can be consumed.  
Approval permits preparation of the separate targeted Sensitive Design Human review only. It does not approve Sensitive Design or Tasks/TIC, authorize helper correction or Phase 3, or promote formal Technical Compliance, VERIFY or Browser QA. Implementation remains 9/24; T10–T24 remain unchecked; helper convergence remains `PARTIAL_NEEDS_REVIEW`; Phase 3 remains `NOT_AUTHORIZED`.

The review below preserves the exact pre-approval packet. Its `AWAITING_HUMAN_REVIEW` wording describes the state before this current-user decision.

---

# One-way approval binding — targeted Design review

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` for this targeted Design only.  
Revised Design SHA-256: `ade4c1be825823e20bd1e7af5174f65ffe8b93e24872880ccbcd0c61cd30197a`  
Previously approved Design SHA-256: `fe0a6f48afb24074bac8c64d3835443312a128eeb2ce22207fcf2181eb81b12b` (historical).  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).  
Source: exact current-user `REQUEST APPROVAL RECORD RECONCILIATION SCOPE CHANGES`, relayed in Bridge round `BRIDGE-ARCH-20260925-F9R2:56`; bounded planning command is round 57.

## Targeted decision

The old proposed approval record could not depend on the hash of a semantic record created later. The revised D3 defines this one-way sequence: non-authoritative canonical pre-decision descriptor → exact accepted Human Gate result → minimal canonical result receipt → immutable approval record → semantic decision record → durable consumption. The descriptor fixes the typed proposal and yields `DECISION_ID` before the Human decision. The approval record binds that ID, exact item/result, scope, review packet pre-approval hash, descriptor hash and causally later recording command. It contains **no** semantic-record path/hash or self-hash. The later semantic record binds exact approval-record path/hash and the approved payload.

Canonical paths, version-one UTF-8 JSON rules, strict schemas and deterministic ID formulas are in revised D3. The result receipt binds the validated Human Gate item to its later recording command without storing a transcript. Helper must mechanically resolve and compare descriptor, receipt, approval, packet and semantic bytes, hashes, IDs, scope, payload and causal order before consumption. It remains read-only for these authority artifacts. Review prose is human history, never machine authority. Missing, stale, conflicting, replayed, wrong-lineage or scope-mismatched evidence blocks.

## Preserved boundaries and risk

SAME/DISTINCT materiality stays with the current Human or already-authoritative reviewed workflow; Codex/helper cannot classify it. A maximum exception remains strictly positive, preserves used counters and cannot lift a freeze. Freeze remains independent of maximum and `EVIDENCE_STOP`. Consumed semantic and approval IDs/hashes/items survive restart, fresh run, rotation and handoff. No Bridge v1 wire, Workflow v3, Page Chat Product authority, single-host boundary, Product code, credential or transcript scope changes. Workflow-governed repository provenance is **not** cryptographic Human attestation. A forged or unresolvable result receipt remains a workflow-integrity risk and must fail closed under the accepted trust boundary.

Targeted Sensitive Design and Tasks/TIC review are required after this Design review because approval spoofing, replay, payload drift and helper validation change. Prior approvals remain historical; round-55 helper correction stopped before mutation. Helper convergence is `PARTIAL_NEEDS_REVIEW`; Phase 3 is `NOT_AUTHORIZED`. A new helper-correction Human authorization will be required after all planning reviews.

Human choice for this exact revised Design: `APPROVE ONE-WAY APPROVAL BINDING DESIGN` | `REQUEST ONE-WAY APPROVAL BINDING DESIGN CHANGES` | `DEFER ONE-WAY APPROVAL BINDING DESIGN`.
