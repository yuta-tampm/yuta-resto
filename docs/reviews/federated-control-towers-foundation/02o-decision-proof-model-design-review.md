# Decision Proof Model — approved targeted Design decision

Current targeted Design status: `APPROVED` for the pre-approval packet SHA-256 `e9d8cfe59e82ecb2968a66b48e47c50c98ec82486e80c2ebd4235f1350628ea3` only.  
Approval source: exact current-user `APPROVE DECISION PROOF MODEL DESIGN`, relayed in YUTA Control Tower Bridge result `BRIDGE-ARCH-20260925-F9R2:47`.  
Bound revised Design SHA-256: `fe0a6f48afb24074bac8c64d3835443312a128eeb2ce22207fcf2181eb81b12b`.  
The earlier current-user `ACCEPT WORKFLOW PROVENANCE TRUST BOUNDARY` in round 45 remains the model's trust boundary: deterministic workflow-governed repository provenance, not cryptographic Human identity attestation.  
Approval permits preparation of the separate targeted Sensitive Design Human review only. It does not approve Sensitive Design or Tasks/TIC, authorize helper correction or Phase 3, or promote formal Technical Compliance, VERIFY or Browser QA. Implementation remains 9/24, T10–T24 unchecked, helper convergence `PARTIAL_NEEDS_REVIEW`, and Phase 3 `NOT_AUTHORIZED`.

The review below preserves the exact pre-approval packet. Its `AWAITING_HUMAN_REVIEW` wording describes the state before this current-user decision.

---

# Decision Proof Model — targeted Design review

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` for this revised Design only.  
Source decision: current-user `APPROVE CORRECTED DECISION PROOF MODEL` and `ACCEPT WORKFLOW PROVENANCE TRUST BOUNDARY`, relayed in Control Tower result `BRIDGE-ARCH-20260925-F9R2:45`. This approved the model as planning input, not this revised Design or implementation.  
Prior approved Design SHA-256: `a9074405083a3f82616c9dd94ac27154ac70bb741a7f0dfd21c9663e80395998`.  
Revised Design SHA-256: `fe0a6f48afb24074bac8c64d3835443312a128eeb2ce22207fcf2181eb81b12b`.  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).

## Exact Design delta

Only the Decision Proof Model paragraph group inserted before D4 in `design.md` is new. It fixes the round-43 pre-mutation blocker: the helper had no deterministic, repository-bound way to resolve a separately recorded Human decision from a candidate path/hash.

1. The canonical `decisions/<DECISION_ID>.json` path, exact UTF-8 JSON bytes, recursive key ordering, SHA-256 review reference and deterministic five-field `DECISION_ID` formula are explicit.
2. The immutable envelope binds one typed decision, exact execution context/lineage/bucket, one Human Gate result item, and the pre-approval packet plus separately recorded approval evidence. A candidate, caller metadata or matching hash alone has no authority. The helper only reads and mechanically validates.
3. Classification of SAME versus DISTINCT remains a Human or reviewed-workflow judgment. An existing reviewed-workflow classification still needs a current Human Gate binding before consumption; run, tower, label, wrapper or file changes cannot mint capacity.
4. A positive maximum exception requires `NEW_APPROVED_MAXIMUM > PREVIOUS_APPROVED_MAXIMUM` and an exact positive difference. Equality is a no-op, not an exception. Historical maxima and used counters never decrease. Freeze transitions remain separate typed decisions.
5. Decision ID/hash/item are consumed once in the existing journal and snapshot. Restart, fresh run and handoff preserve provenance. Missing, stale, replayed or conflicting records fail closed.

This is workflow-governed repository provenance, not cryptographic Human attestation. It does not add signatures, external authentication, Product authority, Bridge v1 wire fields, a second retry store or multi-host execution. Only bounded metadata and references may be persisted.

## Review boundary

Gate 1/2 and the Spec remain approved and unchanged. Phase 1/2 and round-30 helper evidence remain historical. Helper convergence is `PARTIAL_NEEDS_REVIEW`; implementation is 9/24, T10–T24 unchecked; Phase 3 is `NOT_AUTHORIZED`. Separate Sensitive Design, Tasks/TIC and helper-correction decisions follow any approval of this Design. No formal Technical Compliance, VERIFY or Browser QA is claimed here.

Human choice on the exact revised Design hash: `APPROVE DECISION PROOF MODEL DESIGN` | `REQUEST DECISION PROOF MODEL DESIGN CHANGES` | `DEFER DECISION PROOF MODEL DESIGN`.
