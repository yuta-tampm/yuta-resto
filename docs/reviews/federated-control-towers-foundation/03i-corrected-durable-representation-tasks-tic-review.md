# Corrected Durable Representation Model — approved targeted Tasks/TIC decision

Current targeted Tasks/TIC status: `APPROVED` for the pre-approval packet SHA-256 `c04f1ffd97bf04cb48a58ab1b4c382af26abafee1ebb4f67dde21734aca38a0e` only.  
Approval source: exact current-user `APPROVE CORRECTED DURABLE REPRESENTATION TASKS TIC`, relayed in YUTA Control Tower result `BRIDGE-ARCH-20260925-F9R2:109` as `APPROVE_CORRECTED_DURABLE_REPRESENTATION_TASKS_TIC`.  
Bound approved Design SHA-256: `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`.  
The approved pre-approval packet follows byte-for-byte below this separator. Its historical `AWAITING_HUMAN_REVIEW` status describes the state before this Human decision. This Human-readable approval is review evidence only, never runtime machine authority. Fresh helper correction and Phase 3 remain separate Human gates.

---

# Corrected Durable Representation Model — targeted Tasks/TIC candidate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` after separate revised Design and Sensitive Design approvals; this packet itself is not approved.  
Updated Tasks/TIC: `openspec/changes/federated-control-towers-foundation/tasks.md` SHA-256 `517de3a6dfc211579968e4725b108192a3ba8f9190fb05a51054ee0f7d5203d7`.  
Pre-planning Tasks/TIC SHA-256: `2c362394e4caeb98d7cfef7daf610c11200282b85109f8ae5282abfb1bb25d55`.  
Revised Design SHA-256: `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`.  
Approved revised Design review `03g-corrected-durable-representation-design-review.md` SHA-256: `ed55d3101dab53c2dc00d051a2c527ba8d7875a59ccebf2d756dd1c81b5bc60a`; exact current-user Design approval in Bridge result `BRIDGE-ARCH-20260925-F9R2:105`; preserved pre-approval packet SHA-256 `c5e3563338fc477c07a3cf689b2024938a070b4384cc96e6d18cc1a0e34475cc`.  
Approved targeted Sensitive Design review `03h-corrected-durable-representation-sensitive-design-review.md` SHA-256: `86fa4ed037beb7fe60f0ea63a50efd1b993701950caf951e314abc4398eb3d7c`; exact current-user Sensitive Design approval in Bridge result `BRIDGE-ARCH-20260925-F9R2:107`; preserved pre-approval packet SHA-256 `dbb0e793c9b95590dd1af314a4717e7e71645966f2d6ee6af338a5c3dacedd61`.  
Prior approved Tasks/TIC review `03d-runtime-authority-identity-tasks-tic-review.md` SHA-256: `df3ab88e099fa5693451035b68d001d421a75eb3e441008807b292cb4f115e86` (historical).  
Approved Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` (unchanged).  
Helper SHA-256: `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` (unchanged).

Current-user anti-loop directive in Bridge result `BRIDGE-ARCH-20260925-F9R2:107`: converge on `DEV_USABLE` through this existing Tasks/TIC gate, a separate helper-correction authorization, focused/synthetic tests and evidence review, then a separate Phase 3 Human Gate if safety-critical criteria pass. Ordinary implementation-detail ambiguity is resolved by the smallest deterministic Design-consistent implementation with a documented assumption and focused test where useful. New planning reconciliation is reserved for a material risk of duplicate command/Human-authority consumption, invalid Human Gate approval, or multiple executable towers for one execution context. Historical `FAIL`/`BLOCKED` evidence and all existing acceptance criteria remain intact; this note grants no Apply or Phase 3 authority.

## Exact targeted implementation contract

The 24 tasks and six phase boundaries remain. T01–T09 remain checked historical completion; T10–T24 remain unchecked. This packet adds a helper-convergence dependency and focused test requirements, not a new task or permission to run Phase 3. Only after separate revised Design, Sensitive Design, Tasks/TIC and fresh helper-correction Human gates may the existing helper owner implement this delta.

1. Validate exact activation `CURRENT_ACTIVE_FREEZES` and `ACTIVE_FREEZE_ENTRY_V1` schema, four-field scope, recovery-null/evaluator-exact bucket, canonical UTF-8 scope ordering and duplicate-scope denial. It is the sole active-freeze projection; no mutable history array or typed `APPROVAL_REFERENCES` entry is added.
2. Verify the approved semantic-record/proof/ordered-journal history and exact APPLY, LIFT and SUPERSEDE pre/post-state deltas. Each transition changes only its exact scope and adds exactly one proof. Reject stale, missing, inactive, conflicting or wrong-scope targets and projection/history disagreement.
3. Use existing-envelope `EVENT_KIND=AUTHORITY_CONSUMED` and `STATE_PAYLOAD` as the sole complete activation post-state, including both new arrays. Do not add journal top-level proof or `POST_STATE`. Preserve prior proofs byte-equivalently after canonicalization, validate exactly one new proof and reject duplicates or noncanonical ordering.
4. Under the existing lock, verify authority and state, compute post-state, append and durably flush/read back journal, atomically replace/flush/read back activation, then allow dependent execution. The durable journal flush is the semantic commit point for replay protection. Recover exact committed post-state after a journal-flushed/snapshot-missing crash without reapplying authority; reject partial journal and inconsistent snapshot. Retain pending-command and execution-uncertainty rules for subsequent execution.
5. Add exactly `CURRENT_ACTIVE_FREEZES` and `CONSUMED_AUTHORITY_PROOFS` to handoff top-level schema and existing `HANDOFF_HASH`. Copy both from `SOURCE_RECORD_HASH`-verified source and require exact equality with source and existing receiving state; reject union, larger-set choice, inference and backfill. Carry them across restart, fresh run, both rotations and Page-to-Global escalation.
6. Keep journal `SCHEMA_VERSION` and `HANDOFF_VERSION` unchanged. Historical missing fields normalize to `[]` only with proof of zero new-model consumption, active freeze and implied maximum exception/classification; otherwise `NEEDS_REVIEW`. Never promote `03f` or earlier partial evidence.

## Focused revalidation after fresh helper authorization

Cover empty and populated valid active-freeze projections; malformed entry, wrong bucket and duplicate scope; positive and negative APPLY/LIFT/SUPERSEDE; unchanged unrelated scope and counters; proof/journal/freeze agreement; zero, multiple, altered, replayed and misordered proof deltas; each pre/post durable-flush and snapshot crash boundary; no dependent execution before read-back; exact source/handoff/receiving equality and no merge/backfill; historical false-empty denial; replay protection across restart, fresh run, Page/Global rotation and Page-to-Global handoff. Regress exact Human token/result chain, SAME/DISTINCT bucket authority, strict-positive maximum exception, monotonic counters/maximum, independent freeze/evidence-stop, command at-most-once and privacy. The helper SelfTest and fixtures do not run in this planning round.

Prior round-98 helper authorization and `03e` become superseded for future helper work; `03f` remains truthful historical blocker evidence. Helper correction stays `PAUSED`, convergence `NEEDS_REVIEW`, Phase 3 `NOT_AUTHORIZED`. No Product, Workflow v3, Page Chat, Bridge v1 or multi-host authority is added.

Human decision after the preceding approvals: `APPROVE CORRECTED DURABLE REPRESENTATION TASKS TIC` | `REQUEST CORRECTED DURABLE REPRESENTATION TASKS TIC CHANGES` | `DEFER CORRECTED DURABLE REPRESENTATION TASKS TIC`.
