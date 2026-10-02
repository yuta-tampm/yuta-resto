# Runtime Authority Identity Model — bounded helper-correction Human Gate

Change: `federated-control-towers-foundation`  
Status: `AUTHORIZED_FOR_BOUNDED_CORRECTION; IMPLEMENTATION_NEEDS_REVIEW`  
Requested action: a separate, bounded correction of `state-helper.ps1` and focused synthetic revalidation. This packet does **not** authorize implementation.

## Exact reviewed baseline

| Artifact                                    | SHA-256                                                            | Treatment                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Approved Gate 2 delta Spec                  | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Unchanged; Gate 2 is not reopened.                                         |
| Approved revised Design                     | `42f71996db47a2e0e5e88bc4b8f8648658ada9951711e7a389c98ffc04922b5a` | Exact current planning contract.                                           |
| Recorded revised Design approval            | `3363f3132ef910db17bb59af4829788d9243b222ade6c78276404f5141026cb6` | `03b` review; exact Human decision in Bridge round 92.                     |
| Recorded targeted Sensitive Design approval | `94ec3e15c4fb86a5dec9474996e39ba1a91bde61b3a32ae8607e4ef730c2a17d` | `03c` review; exact Human decision in Bridge round 94.                     |
| Targeted Tasks/TIC pre-approval packet      | `fd07df0b49433466345e9bcb925e4030bbfaf6f2192d7d57dead85de9899273b` | Preserved byte-for-byte in `03d`; exact Human decision in Bridge round 96. |
| Recorded targeted Tasks/TIC approval        | `df3ab88e099fa5693451035b68d001d421a75eb3e441008807b292cb4f115e86` | `03d` review; approval metadata is not runtime machine authority.          |
| Current `tasks.md`                          | `2c362394e4caeb98d7cfef7daf610c11200282b85109f8ae5282abfb1bb25d55` | 9/24 checked; T10–T24 remain unchecked.                                    |
| Current `state-helper.ps1`                  | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` | Partial baseline; unchanged at this gate.                                  |

The round-64 and round-86 helper authorizations and their `02v`/`02z` packets are historical and superseded for future helper execution. Retain rounds 65/87 and the `03a` blocker as historical evidence; do not replay either authorization or promote prior partial evidence to convergence. This packet has a new scope and requires a fresh exact current-Human decision.

## Bounded implementation contract if separately authorized

The sole implementation owner is `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. Bounded change/review/evidence metadata may record the correction and focused results. No other implementation owner is allowed. No `SKILL.md`, federated operating protocol, Bridge v1, Workflow v3, Product code, API, auth, database/schema, provider integration, deployment, external service, Page Chat, or live tower context may be changed or accessed by this gate. Do not activate a Page or Global tower, perform browser federation, live escalation or rotation, or begin Phase 3.

The helper correction must implement the complete approved contract in the Design, Sensitive Design and Tasks/TIC artifacts bound above, including:

1. `CANONICAL_JSON_V1`: UTF-8 without BOM, comments, insignificant whitespace or trailing newline; ordinal recursive object-key ordering; semantic array order; standard JSON escaping; shortest base-10 integers; lowercase booleans and schema-permitted null; rejection of duplicate keys and unknown fields in exact schemas.
2. `APPROVAL_TOKEN_MAPPING_VERSION=1`: the exact approved token for each of `EVALUATOR_BUCKET_CLASSIFICATION`, `BUDGET_MAXIMUM_EXCEPTION`, and `BUDGET_EXECUTION_FREEZE_TRANSITION`. Require exact equality to the accepted Human Gate result; reject generic, missing, unknown, stale, wrong-type, negative, prose-derived, normalized, aliased or fuzzy tokens.
3. Exact freeze `DECISION_SCOPE` and `PROPOSED_DECISION_PAYLOAD`, canonical `DECISION_ID`, and `FREEZE_ID`/`TRANSITION_ID` alias rules for `APPLY`, `LIFT`, and `SUPERSEDE`. Enforce the exact active target and one-active-freeze invariant; an increase in a maximum does not lift a freeze.
4. The existing one-way `PRE_DECISION_DESCRIPTOR -> accepted HUMAN_GATE_RESULT -> ACCEPTED_GATE_RESULT_RECORD -> APPROVAL_RECORD -> SEMANTIC_DECISION_RECORD -> CONSUMED_AUTHORITY_PROOF_V1` chain. The accepted-result record alone sources `RESULT_HASH`; no approval is inferred from a prose header. Preserve `APPROVAL_RECORD_ID`, removal of `APPLICATION_ID`, and `EXCEPTION_ID=DECISION_ID` for a budget maximum exception.
5. The exact eight-field `CONSUMED_AUTHORITY_PROOF_V1` and canonical proof SHA-256; top-level sorted activation `CONSUMED_AUTHORITY_PROOFS`; the existing `EVENT_KIND=AUTHORITY_CONSUMED` discriminator and complete intended `POST_STATE`. Under the exclusive lock, validate authority and replay state, append and flush the journal, atomically replace and read back the snapshot, and only then permit dependent execution.
6. Crash reconciliation and rejection of partial or conflicting journal/snapshot proof; no duplicate semantic effect. Preserve proofs and replay protection over restart, fresh `RUN_ID`, same-role rotation and Page-to-Global handoff. Historical missing proof arrays may normalize to empty only when zero new-model semantic consumption is provable; no prose, hash or partial-evidence backfill.
7. Private, per-run, non-sensitive SelfTest fixtures outside repository and live authority paths, using the same internal verifier functions without a production bypass or alternate trust root. Synthetic evidence must never authorize live state.
8. Existing budget provenance, SAME/DISTINCT judgment, strict-positive maximum exception, monotonic counters and approved maximum, independent freeze, `PENDING_COMMAND_ID`, `EXECUTION_UNCERTAIN`, at-most-once, `EVIDENCE_STOP`, privacy and single-host boundaries. The command ledger remains separate from consumed semantic proofs.

The full focused validation matrix in the approved pre-approval `03d` packet is mandatory. It includes positive and negative token mapping; canonical freeze identity and every `APPLY`/`LIFT`/`SUPERSEDE` target case; proof schema, hash and identity collisions; journal-first commit and both crash windows; restart/fresh-run/rotation/handoff continuity; historical zero-consumption versus implied-consumption rejection; isolated SelfTest without live trust bypass; privacy rejection; and regression of the Exact Accepted Result chain, maximum exception, SAME/DISTINCT, freeze, pending-command, `EXECUTION_UNCERTAIN`, at-most-once and `EVIDENCE_STOP`. Record the exact helper before/after SHA-256, scoped diff, test commands, synthetic fixture identity, results, failures and evidence hash. Do not mark T10–T24 complete from this bounded correction.

Only complete implementation of the approved contract plus the full focused synthetic matrix can change helper convergence from `PARTIAL_NEEDS_REVIEW` to `COMPLETE`. Even then, Phase 3 becomes only `ELIGIBLE_FOR_SEPARATE_HUMAN_AUTHORIZATION`; it remains `NOT_AUTHORIZED` until its own Human Gate. Formal Technical Compliance, formal VERIFY and Federated Browser QA remain separate and are not part of this correction gate.

## Human decision boundary

Choose exactly one for this packet: `AUTHORIZE RUNTIME AUTHORITY IDENTITY HELPER CORRECTION` | `REQUEST RUNTIME AUTHORITY IDENTITY HELPER CORRECTION SCOPE CHANGES` | `DEFER RUNTIME AUTHORITY IDENTITY HELPER CORRECTION`.

Corresponding `CURRENT_USER_DECISION` tokens: `AUTHORIZE_RUNTIME_AUTHORITY_IDENTITY_HELPER_CORRECTION` | `REQUEST_RUNTIME_AUTHORITY_IDENTITY_HELPER_CORRECTION_SCOPE_CHANGES` | `DEFER_RUNTIME_AUTHORITY_IDENTITY_HELPER_CORRECTION`.

No choice was inferred from the earlier Design, Sensitive Design or Tasks/TIC approvals, this packet's existence, or a superseded helper authorization. Before the exact current-Human decision, the status was `AWAITING_HUMAN_REVIEW`.

## Current Human decision and bounded stop

The current Human supplied the exact `AUTHORIZE RUNTIME AUTHORITY IDENTITY HELPER CORRECTION` decision. Codex relayed `AUTHORIZE_RUNTIME_AUTHORITY_IDENTITY_HELPER_CORRECTION` in valid Bridge round `BRIDGE-ARCH-20260925-F9R2:98`, bound to this packet's pre-approval SHA-256 `24c74bf190c52c3fd422bad5220a7a50da9169a35debaaa87551a6cf77f60cbd`. Control Tower round 99 issued the bounded execution command. This records authorization; it does not claim convergence or authorize Phase 3.

Pre-mutation consistency review identified unresolved exact runtime representation constraints. The bounded correction is stopped at `NEEDS_REVIEW`; see `03f-runtime-authority-identity-helper-convergence-evidence.md`. The helper and its prior historical evidence remain unchanged.
