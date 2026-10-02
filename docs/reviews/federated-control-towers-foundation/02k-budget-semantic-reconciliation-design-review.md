# Targeted budget semantic reconciliation — approved Design decision

Current targeted Design status: `APPROVED` for Design SHA-256 `a9074405083a3f82616c9dd94ac27154ac70bb741a7f0dfd21c9663e80395998` only.  
Approval source: exact current-user `APPROVE CORRECTED TARGETED SEMANTIC DESIGN`, relayed in YUTA Control Tower Bridge result `BRIDGE-ARCH-20260925-F9R2:36`.  
Pre-approval Design review packet SHA-256: `9c0ae012ca535b9e2d3847b705c9c6aef63eabe514ba1112c275c72e7ad65710`.  
Approval permits a separate targeted Sensitive Design review only. It does not approve that Sensitive Design or Tasks/TIC, authorize helper correction or Phase 3, or promote VERIFY/Browser QA.

The review below preserves the pre-approval snapshot. Its `AWAITING_HUMAN_REVIEW` and decision-request wording describe the state before the current-user approval and do not supersede the approved status above.

---

# Pre-approval targeted budget semantic reconciliation — Design review

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` for this second revised Design candidate  
Authority: current-user `AUTHORIZE TARGETED SEMANTIC RECONCILIATION`, relayed through YUTA Control Tower Bridge round `BRIDGE-ARCH-20260925-F9R2:32`. This authorized planning edits only.

The current Human rejected the first semantic Design candidate with `REQUEST TARGETED SEMANTIC DESIGN CHANGES` in Bridge round `BRIDGE-ARCH-20260925-F9R2:34`. That candidate Design SHA-256 `2373e59c5ec84c861223044b7d3dbd064646ae0386b53b267f9d8d4898465b5e` and this packet's prior SHA-256 `3b50265deb9eb809be20b6ca1f39775eda9414a14e1f195e0901abf14df30e54` are historical, unapproved review evidence. Round 35 authorized only the targeted correction below.

## Integrity and classification

| Artifact                          | SHA-256                                                            | Treatment                                                        |
| --------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Approved Gate 2 delta Spec        | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Unchanged. No Spec semantic change required.                     |
| Previously approved budget Design | `6beb02c49b48eb1096d417c29e99348fb66ce2795747fce9133d9e13c0beb676` | Historical approval applies to those bytes only.                 |
| Revised Design candidate          | `a9074405083a3f82616c9dd94ac27154ac70bb741a7f0dfd21c9663e80395998` | New Human Design review required.                                |
| Previously approved Tasks/TIC     | `2c53ff8de5393d14d77f267d2b59e62fe1244b31ad8634b50dd9c29caef39ce6` | Historical approval applies to those bytes only.                 |
| Revised Tasks/TIC candidate       | `8135f3f950d107d9c757e56e522703fca9176df2ef316785cb046d655a5b3eee` | Separate later review required.                                  |
| Current helper                    | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` | Unchanged; convergence remains `PARTIAL_NEEDS_REVIEW`.           |
| Round-30 helper evidence          | `3c8935cc48c61f6da21388f57c7494c1304bafa2a6a2da980eb8a41693f39080` | Historical 19/19 local checks, not proof of these two semantics. |
| Original Phase-2 evidence         | `97d591434eae95d0201251d792ffe71f52eb22464f993e34d0bb8b4c372077d8` | Historical, unchanged.                                           |

The approved Spec already requires bounded evaluator/recovery budgets, reviewed material distinction, Human exceptions and preserved lineage. The gap was a deterministic local Design representation and approval/provenance test. This is a targeted Design/Sensitive Design/Tasks-TIC reconciliation. It does not reopen Gate 1 or Gate 2, create a new retry subsystem, or amend Workflow v3, Bridge v1, Product authority, implementation allowlist or host boundary.

## Exact Design delta for review

1. **Evaluator classification record.** D3 now defines a bounded `EVALUATOR_BUCKET_CLASSIFICATION` artifact with version, context, lineage, bucket, stable stage/purpose keys, `SAME_MATERIAL_BUCKET` or `DISTINCT_MATERIAL_BUCKET`, related bucket, evaluated claim, evaluator process, rationale and a preassigned decision ID. `MATERIAL_EQUIVALENCE_REFERENCE` carries its repository path and exact SHA-256. The candidate's hash is computed before the matching approval reference binds the decision ID to that hash, avoiding a self-referential hash.
2. **Reuse before creation.** Materially equivalent work reuses the existing bucket. Fresh run, epoch, tower, wrapper, file path/hash, stage display label or evaluator label cannot create budget. A distinct zero-used bucket requires a current Human or already-authoritative reviewed-workflow classification of materially different purpose. Hash/path prove byte identity only; the Human/workflow judges materiality. Missing, stale, conflicting or ambiguous provenance stops execution.
3. **Positive maximum exception.** D3 now defines one typed `BUDGET_MAXIMUM_EXCEPTION` inside existing `APPROVAL_REFERENCES`: exact context, lineage and recovery/evaluator bucket; prior/new maxima; added allowance; purpose; stop condition; validated current Human Gate identity; reviewed artifact/hash; timestamp; applied status and journal revision/event. The exception ID deterministically hashes decision identity and exact scope. One Human decision applies once to one scope; replay cannot add allowance. A 3-to-4 evaluator decision leaves used at 3.
4. **Durability.** D5 adds local journal event kinds `MATERIAL_BUCKET_CLASSIFICATION_RECORDED` and `BUDGET_EXCEPTION_APPLIED`. Under the existing lock, each decision and its exact snapshot effect commit through the journal-first flush/replace/read-back path. Restart and handoff reconcile event, snapshot, approval, bucket and counters; any disagreement yields zero executable authority. Neither event changes Bridge wire grammar or independently grants an execution.
5. **Monotonic maximum.** Within one exact context/lineage/recovery scope or context/lineage/evaluator-bucket scope, the committed `APPROVED_MAXIMUM` never decreases. It stays fixed or rises only through an exact bounded Human exception. The previously described later stricter-maximum reduction is removed; a more restrictive Human decision uses a separate freeze and preserves earlier approved capacity and used counters.
6. **Execution freeze.** A typed, append-only `BUDGET_EXECUTION_FREEZE` transition in existing `APPROVAL_REFERENCES` records APPLY, LIFT or SUPERSEDE for one exact budget scope. It binds current Human decision item, reviewed artifact/hash, purpose, stop condition, counter/maximum snapshot, deterministic IDs and journal revision. At most one freeze is ACTIVE. APPLY blocks new affected execution even when numerical budget remains; LIFT/SUPERSEDE needs a later exact-scope Human decision. Replay, stale or conflicting state blocks. Maximum exception never lifts a freeze; lift never raises maximum. Existing `EVIDENCE_STOP_STATE` remains independent.
7. **Durability of freeze.** D5 adds local `BUDGET_FREEZE_APPLIED`, `BUDGET_FREEZE_LIFTED` and `BUDGET_FREEZE_SUPERSEDED` events through the existing held-lock, journal-first complete-snapshot path. Handoff and restart carry full transition history and derived active state. No second budget store or Bridge wire field is added.

## Sensitive questions to review

- Semantic classification remains a Human/reviewed-workflow judgment. A valid hash cannot prove two evaluator jobs are materially different.
- A prepared classification artifact is not approval. The matching current approval reference must name the exact context, lineage, bucket, decision ID and hash.
- An exception raises only one selected maximum; it does not authorize the next execution, clear a pending command, bypass evidence-stop, reset counters or grant Apply.
- A freeze preserves approved maximum and used count: used `2`/maximum `5` remains `2`/`5` while an ACTIVE freeze prohibits another affected execution. Lifting it does not itself authorize work or clear an independent stop.
- Browser and disk effects are not one atomic transaction. Accepted commands with uncertain outcome remain blocked under the existing at-most-once rule.
- Only bounded IDs, references and hashes are persisted; no transcript, customer content, credential, token, cookie, session or private chat content.

Next sequence: Human review of this revised Design; separate targeted Sensitive Design review; separate Tasks/TIC review; new bounded helper correction authorization and focused evidence; separate Phase-3 authorization. Until then helper correction is `PARTIAL_NEEDS_REVIEW`, T10–T14 and Phase 3 are `NOT_AUTHORIZED`, and formal VERIFY/Browser QA are not run by this reconciliation.

Human decision requested for the exact revised Design hash above: `APPROVE TARGETED SEMANTIC DESIGN` | `REQUEST TARGETED SEMANTIC DESIGN CHANGES` | `DEFER TARGETED SEMANTIC DESIGN`.
