# Corrected Durable Representation Model — approved revised Design decision

Current revised Design status: `APPROVED` for the pre-approval packet SHA-256 `c5e3563338fc477c07a3cf689b2024938a070b4384cc96e6d18cc1a0e34475cc` only.  
Approval source: exact current-user `APPROVE CORRECTED DURABLE REPRESENTATION DESIGN`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:105` as `APPROVE_CORRECTED_DURABLE_REPRESENTATION_DESIGN`.  
Bound revised Design SHA-256: `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable approval is review evidence only, never runtime machine authority. Targeted Sensitive Design, Tasks/TIC, fresh helper correction and Phase 3 remain separate gates.

---

# Corrected Durable Representation Model — revised Design candidate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW`; this packet is not Design approval.  
Model approval: exact current-user `APPROVE CORRECTED DURABLE REPRESENTATION MODEL`, relayed to the selected YUTA Control Tower in valid result `BRIDGE-ARCH-20260925-F9R2:102`.  
Planning authorization: bounded Control Tower command `BRIDGE-ARCH-20260925-F9R2:103`; no helper or Phase 3 authority.  
Revised Design: `openspec/changes/federated-control-towers-foundation/design.md` SHA-256 `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`.  
Pre-planning approved Design SHA-256: `42f71996db47a2e0e5e88bc4b8f8648658ada9951711e7a389c98ffc04922b5a`.  
Revised Tasks/TIC: `openspec/changes/federated-control-towers-foundation/tasks.md` SHA-256 `517de3a6dfc211579968e4725b108192a3ba8f9190fb05a51054ee0f7d5203d7` (candidate only).  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).  
Helper SHA-256: `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` (unchanged).

## Exact targeted Design delta

1. The activation schema adds required top-level `CURRENT_ACTIVE_FREEZES`, the sole active-freeze runtime projection. Each `ACTIVE_FREEZE_ENTRY_V1` has exactly `DECISION_SCOPE`, lowercase SHA-256 `FREEZE_ID`, and `RECORD_VERSION: 1`. The four-field scope retains recovery `BUCKET_KEY: null` or the evaluator's exact authoritative key. Entries are ordered by UTF-8 `CANONICAL_JSON_V1(DECISION_SCOPE)` and unique per exact scope. Inactive freezes remain in immutable history, not this array.
2. Applied freeze history is the ordered committed `AUTHORITY_CONSUMED` journal events with matching `CONSUMED_AUTHORITY_PROOF_V1` and immutable semantic decision records. `APPROVAL_REFERENCES` keeps exactly the existing six-string generic provenance shape and is not active state, transition history, approval proof, or replay protection. No mutable `FREEZE_HISTORY` is added.
3. `APPLY` adds exactly one active entry for an empty scope; `LIFT` removes exactly the current targeted entry; `SUPERSEDE` replaces exactly that entry. `TRANSITION_ID=DECISION_ID`; APPLY and SUPERSEDE create `FREEZE_ID=DECISION_ID`, LIFT creates no freeze ID. Each transition adds exactly one consumed proof and leaves unrelated scopes, counters, maximum, and evidence-stop unchanged. Missing, stale, wrong-scope or conflicting target fails closed.
4. `AUTHORITY_CONSUMED` uses existing `EVENT_KIND`; existing `STATE_PAYLOAD` is the sole complete activation `POST_STATE`, containing `CURRENT_ACTIVE_FREEZES`, `CONSUMED_AUTHORITY_PROOFS`, and other exact activation fields. No top-level journal proof or `POST_STATE` field is added. Prior proof entries are immutable, the array stays canonical, and each event adds exactly one valid proof.
5. Under the exclusive lock, reconcile durable state, verify the full authority chain and transition, compute one post-state, append and durably flush/read back the journal event, atomically replace/flush/read back activation, then permit dependent execution. Durable journal flush is the semantic consumption commit point: a crash before snapshot replacement cannot make the decision reusable. Partial/unverifiable journal or journal/snapshot disagreement fails closed. Dependent execution retains its separate pending-command/at-most-once rules.
6. Handoff adds exactly the top-level `CURRENT_ACTIVE_FREEZES` and `CONSUMED_AUTHORITY_PROOFS` arrays with activation schemas. Both are copied from `SOURCE_RECORD_HASH`-reconstructed source state, participate in `HANDOFF_HASH`, and must equal source and any existing receiving state exactly. No merge, larger-set selection, inference, or backfill. Restart, fresh run, both rotations and Page-to-Global preserve both arrays. Current freeze projection must reconcile against committed transition history.
7. Journal `SCHEMA_VERSION` and `HANDOFF_VERSION` stay unchanged. Historical missing arrays may normalize to `[]` only when zero new-model semantic consumption, zero active new-model freeze and no implied new-model exception or classification are provable; otherwise `NEEDS_REVIEW`. Earlier partial evidence is not promoted.

## Boundaries and next gate

Gate 1, Gate 2 Spec, Workflow v3, `PAGE_LOCAL` Page Chat Product/shaping authority, Bridge v1 grammar/QA, approval token mapping, decision/proof hash formulas, positive maximum exceptions, single-host scope, privacy, evidence-stop and at-most-once remain unchanged. No implementation owner or runtime state was modified in this planning step. Historical approved review packets `03b`–`03e` and blocker `03f` remain immutable evidence; the round-98 helper authorization is superseded for future execution. T01–T09 remain checked, T10–T24 unchecked; helper correction remains paused/`NEEDS_REVIEW`, Phase 3 `NOT_AUTHORIZED`.

Separate Human reviews must follow this order: revised Design, targeted Sensitive Design, targeted Tasks/TIC, fresh helper-correction authorization, then a separate Phase 3 authorization after convergence. This packet authorizes none of those later steps.

Human decision for this exact revised Design: `APPROVE CORRECTED DURABLE REPRESENTATION DESIGN` | `REQUEST CORRECTED DURABLE REPRESENTATION DESIGN CHANGES` | `DEFER CORRECTED DURABLE REPRESENTATION DESIGN`.
