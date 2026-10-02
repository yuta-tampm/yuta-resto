# Corrected Durable Representation Model — approved bounded helper correction

Current helper-correction authorization: `APPROVED` for the pre-approval packet SHA-256 `4ac1aea591859a702165e347b9b67f73fa3c1704d79e135987fbd9176d22e219` only.  
Authorization source: exact current-user `AUTHORIZE CORRECTED DURABLE REPRESENTATION HELPER CORRECTION`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:111` as `AUTHORIZE_CORRECTED_DURABLE_REPRESENTATION_HELPER_CORRECTION`.  
Bound approved Design SHA-256: `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable authorization is review evidence only, never runtime machine authority. Phase 3 remains separately gated.

---

# Corrected Durable Representation Model — bounded helper-correction Human Gate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW`  
Requested action: a separate, bounded correction of the federated state helper and focused synthetic revalidation. This packet does not authorize implementation.

## Exact reviewed baseline

| Artifact                           | SHA-256                                                            | Binding                                                        |
| ---------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Approved Gate 2 delta Spec         | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Unchanged; Gate 2 is not reopened.                             |
| Approved corrected Design          | `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77` | Current complete planning contract.                            |
| Recorded Design approval           | `ed55d3101dab53c2dc00d051a2c527ba8d7875a59ccebf2d756dd1c81b5bc60a` | `03g` review; exact current-user decision in Bridge round 105. |
| Recorded Sensitive Design approval | `86fa4ed037beb7fe60f0ea63a50efd1b993701950caf951e314abc4398eb3d7c` | `03h` review; exact current-user decision in Bridge round 107. |
| Tasks/TIC pre-approval packet      | `c04f1ffd97bf04cb48a58ab1b4c382af26abafee1ebb4f67dde21734aca38a0e` | Preserved byte-for-byte in `03i`.                              |
| Recorded Tasks/TIC approval        | `98746bf1667eeea82b029ac62166fe3114b9b69beb06fd4790e91918e5a9a7b3` | `03i` review; exact current-user decision in Bridge round 109. |
| Current `tasks.md`                 | `517de3a6dfc211579968e4725b108192a3ba8f9190fb05a51054ee0f7d5203d7` | 9/24 complete; T10–T24 unchecked.                              |
| Current `state-helper.ps1`         | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` | Partial implementation baseline; unchanged at this gate.       |

Earlier helper authorizations in Bridge rounds 64, 86 and 98, and their `02v`, `02z` and `03e` gate packets, are historical and superseded for future helper execution. Preserve their results, including `03f` blocker evidence, without replay or promotion to current convergence. Helper correction is `PAUSED`, helper convergence is `NEEDS_REVIEW`, and Phase 3 is `NOT_AUTHORIZED`.

## Bounded correction if separately authorized

The sole implementation owner is `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. Only bounded change/review/evidence metadata required by repository workflow may accompany it. No other implementation owner is allowed. The correction covers the complete current approved Design, Sensitive Design and Tasks/TIC contract, including:

1. `CANONICAL_JSON_V1`, `APPROVAL_TOKEN_MAPPING_VERSION=1`, and the exact one-way pre-decision descriptor → accepted Human Gate result → accepted-result record → approval record → semantic decision record → durable consumption chain. Reject missing, forged, stale, scope-mismatched or conflicting authority; do not infer approval from prose.
2. Reviewed `SAME_MATERIAL_BUCKET` and `DISTINCT_MATERIAL_BUCKET` decisions; stable evaluator bucket provenance; strict-positive maximum exceptions with `EXCEPTION_ID=DECISION_ID` and no `APPLICATION_ID`; monotonic used counters and approved maximum; independent freeze and evidence-stop state.
3. The exact freeze `DECISION_SCOPE`, `PROPOSED_DECISION_PAYLOAD`, `DECISION_ID` formula and `FREEZE_ID`/`TRANSITION_ID` aliases. `CURRENT_ACTIVE_FREEZES` is the sole active-freeze projection with exact `ACTIVE_FREEZE_ENTRY_V1`, canonical scope sorting and one active freeze per scope. Enforce the approved `APPLY`, `LIFT` and `SUPERSEDE` pre/post-state rules and current-freeze/history consistency.
4. The exact `CONSUMED_AUTHORITY_PROOF_V1` and proof SHA-256, sorted activation `CONSUMED_AUTHORITY_PROOFS`, and exactly one new proof per consumed authority. Preserve prior proofs, reject replay, and use existing `EVENT_KIND=AUTHORITY_CONSUMED` with `STATE_PAYLOAD` as the sole complete `POST_STATE`; add no top-level journal proof or `POST_STATE` field. Generic six-field `APPROVAL_REFERENCES` remains provenance metadata only.
5. Under the existing exclusive lock, verify authority and state, compute the complete post-state, append and durably flush/read back the journal, then atomically replace and flush/read back activation before dependent execution. Journal durable flush is the semantic commit point. Pre-flush partial writes fail closed; post-flush/pre-snapshot recovery uses the exact committed `STATE_PAYLOAD` without reapplying authority. Reject inconsistent snapshots and never reuse committed authority.
6. Preserve `CURRENT_ACTIVE_FREEZES` and `CONSUMED_AUTHORITY_PROOFS` exactly in handoff and `HANDOFF_HASH`, with source/handoff/receiving equality and no union, merge, inference, larger-set preference or backfill. Carry authority, budgets, pending command, blocker ancestry and evidence-stop over restart, fresh run, Page-to-Global escalation and Page/Global rotation. Historical missing arrays normalize to empty only when zero new-model consumption and active freeze are proven.
7. Preserve `PENDING_COMMAND_ID`, `COMMAND_ACCEPTED`, `EXECUTION_UNCERTAIN`, no-resend and command at-most-once behavior. Use isolated, non-sensitive per-run SelfTest fixtures without a production bypass or alternate trust root. Reject transcript, customer/private-chat data, credentials, tokens, cookies and sessions.

The full focused positive/negative matrix in the approved `03i` Tasks/TIC packet is mandatory. It covers active-freeze schema/order/duplicate denial; every valid and invalid `APPLY`, `LIFT` and `SUPERSEDE`; proof/journal/freeze agreement and zero/multiple/altered proof denial; durable-flush and snapshot crash boundaries; no dependent execution before read-back; exact handoff transfer and no merge/backfill; historical false-empty denial; restart/fresh-run/rotation/handoff replay resistance; and all previously approved runtime-authority, budget, accepted-result, pending-command, privacy and SelfTest regressions. Record exact helper before/after hashes, scoped diff, commands, fixture identity, results, failures and evidence hash. Do not mark T10–T24 complete from this correction.

The active current-user DEV_USABLE anti-loop directive was relayed in Bridge round 107. Resolve ordinary implementation mechanics with the smallest deterministic Design-consistent choice, document assumptions or limitations, and add a focused test when useful. Reopen planning only for a material risk of (A) duplicate command or Human-authority execution/consumption, (B) bypassed, forged, unsupported or misbound Human Gate approval, or (C) multiple executable Control Towers for one execution context. Do not weaken acceptance criteria or convert historical `FAIL`/`BLOCKED` evidence to `PASS`.

The correction does not include the federated `SKILL.md`, federated operating protocol, Bridge v1, Workflow v3, Page Chat authority, Product code, API, auth, database/schema, provider integration, deployment, external service, or live conversation context. It does not permit Page Chat access, tower activation, browser federation, live escalation, live rotation, Phase 3, formal Technical Compliance, formal VERIFY or Federated Browser QA. Do not commit, push, create a PR, merge, deploy or release.

Helper convergence may become `COMPLETE` only after the entire approved helper contract and focused matrix pass with no unresolved A/B/C issue. Even then, Phase 3 becomes `ELIGIBLE_FOR_SEPARATE_HUMAN_AUTHORIZATION_ONLY`; its authorization status remains `NOT_AUTHORIZED` until its own Human Gate.

## Exact Human decision boundary

Choose exactly one label for this packet:

1. `AUTHORIZE CORRECTED DURABLE REPRESENTATION HELPER CORRECTION`
2. `REQUEST CORRECTED DURABLE REPRESENTATION HELPER CORRECTION SCOPE CHANGES`
3. `DEFER CORRECTED DURABLE REPRESENTATION HELPER CORRECTION`

Corresponding `CURRENT_USER_DECISION` tokens, in the same order:

1. `AUTHORIZE_CORRECTED_DURABLE_REPRESENTATION_HELPER_CORRECTION`
2. `REQUEST_CORRECTED_DURABLE_REPRESENTATION_HELPER_CORRECTION_SCOPE_CHANGES`
3. `DEFER_CORRECTED_DURABLE_REPRESENTATION_HELPER_CORRECTION`

No choice is inferred from the preceding approvals, this packet's existence, or a superseded authorization. Remain `AWAITING_HUMAN_REVIEW` until the exact current-Human decision is relayed in a valid bound Bridge result. The Human-readable review packet is not runtime machine authority.
