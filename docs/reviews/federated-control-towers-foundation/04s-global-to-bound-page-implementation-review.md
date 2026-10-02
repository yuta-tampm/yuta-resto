# Global to Bound Page QA Transfer — bounded implementation review

Status: `AWAITING_HUMAN_REVIEW`. This packet prepares one implementation decision; its existence and the Control Tower command do not constitute Human authorization.

## Review binding and scope

- Change: `federated-control-towers-foundation`.
- Control Tower vocabulary source: complete Bridge command `BRIDGE-FRESHGATE-20260927-C11790A1:28`, which established the exact scope-specific labels below after round 27 found no repository-canonical label formula. The vocabulary is not a Human decision.
- Approved Tasks/TIC: `openspec/changes/federated-control-towers-foundation/tasks.md`, SHA-256 `19b042c004a32b0f2c767e5b79222d679513aa623c3df2d4b8b49261bf4e1209`; current-user decision relayed in Bridge round 26.
- Approved Design: `openspec/changes/federated-control-towers-foundation/design.md`, SHA-256 `342d99ba862c8dc911b3041d95c99b8dd7f14fe22fde4c0a4bb97bca6499a6c2`.
- Approved Sensitive Design review: `04q-global-to-bound-page-sensitive-design-review.md`, SHA-256 `293cadd9990487bc420b47fb492821de69258577df2beab8ff7962fca6cef506`.
- Tasks/TIC review: `04r-global-to-bound-page-tasks-tic-review.md`, SHA-256 `1bbd656f48a6d53c8786f9be2245544ce7353561ff56dc1e7adbcaf6e44af230`.
- Gate 2 delta Spec is unchanged. The 24 original tasks and six phases retain their historical assessments; supplemental `G2P-01`–`G2P-04` remain unchecked.

If separately authorized, implementation may add only the approved typed `GLOBAL_TO_BOUND_PAGE_QA_TRANSFER` support from the verified active Global tower to the exact Human-bound Page tower `Avis & commentaires v`, Project `g-p-6a4d778944108191894f8e3657742da4`, owning Page Chat/conversation/instance `6a760691-3674-83eb-9347-9e4ef8c60acf`, plus focused synthetic/local validation. This is a code and local-fixture authorization only. The current Human requests a stop before any actual Global-to-Page authority transfer.

## Exact implementation owner baseline

These three existing files are present in the current dirty working tree and untracked by Git. Preserve their bytes outside the later approved implementation delta and preserve all unrelated dirty/untracked changes.

| Implementation owner                                                    | Current SHA-256                                                    | Later bounded role                                                                                           |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `.agents/skills/yuta-federated-control-towers/SKILL.md`                 | `df1faf2ee068d2b14619222d6ae867308f62b7b5a0b559bdb19b4b34c6a0a1c7` | Executor workflow instructions for the one approved transfer direction and stop rules.                       |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` | `0364517af34cb5d5fbb20e5382abd3d12e716e0ff3f31e4c5daae105e2c47a8e` | Exact typed authority, held lock, fencing, durable state/handoff, replay and crash safety.                   |
| `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`      | `b57276e2b5bb90ad6d39518174f6031939675b8db05ce9603a52efee87495cc0` | Tracked operating instructions and authority boundaries; a tracked edit does not update a live conversation. |

Focused test and review evidence may be added only within the approved change/review conventions. No new implementation owner, browser controller, runtime subsystem, or dependency is included.

## Required implementation and focused evidence after separate authorization

- Require a fresh target `RUN_ID`, exact source snapshot/hash/epoch, exact bound Page tuple and reviewed artifact, non-`NONE` causal lineage, and one accepted typed `LIVE_TOWER_SELECTION` decision. A handoff, title, prose, synthetic probe or caller assertion is not authority.
- Use the existing Windows/NTFS checkout and one held `FileShare.None` lock. Global remains sole executable tower until the valid transfer transaction reaches its durable fence. Commit Global `FENCING` and terminal/revoked before any Page `ACTIVATING`; the fence is the linearization point. Until a separately verified Page `ACTIVE_COMMIT`, neither tower may execute.
- Persist the immutable, non-authorizing handoff and fresh Page run only after old Global terminal. Preserve exact budgets, freeze state, consumed proofs, pending command, blocker ancestry, Page context and evidence-stop state. Old Global commands and authority remain non-replayable.
- Fail closed with zero new executable authority on stale target/source, competing lock, incomplete or conflicting journal/snapshot/handoff, missing Human proof, uncertain browser delivery/outcome, crash or failed read-back. Do not resend or replay a possibly delivered command.
- Focused synthetic/local tests must cover the successful bounded state transition and negatives for precondition rejection, fence-before-activation order, every critical crash/uncertainty boundary, stale Global command, handoff/authority replay, duplicate result, one-active exclusion, and zero-authority failure. Preserve historical results; fixtures cannot claim live transfer or Browser QA PASS.
- Keep `PAGE_LOCAL` Product/shaping authority with the owning Page Chat and Workflow v3 `CROSS_MODULE`/`UNCERTAIN` coordination with Global. `PAGE_CONTEXT_INTAKE: UNKNOWN` never means no prior requirement. Codex does not directly read or orchestrate Page Chat content. The built-in browser remains the platform transport; no Chrome, Playwright, session infrastructure, Bridge v1 wire change or multi-host coordination is authorized.

## Explicit stop and later gates

This decision does **not** authorize an actual handoff/transfer, fencing or deactivation of the active Global tower, Page activation, consumption of live Page selection authority, browser messages, Page Chat access, remaining Q01–Q35 execution, formal T18/T19 rerun, Gate 3, commit, push, PR, merge, deploy, release, sync or archive. The Human will decide and perform the actual tower-switch portion when reached. Implementation must stop at the local/synthetic evidence boundary and request a separate live-transfer Human Gate.

Prior T18/T19 PASS evidence predates the current Design/Tasks delta. After separately authorized implementation, fresh independent T18 Technical Compliance and T19 Formal VERIFY must be run before Gate 3 eligibility, while historical PASS/FAIL records remain intact. Phase 6 remains `1 PASS`, `11 PARTIAL_EVIDENCE`, `23 NOT_RUN`, `BLOCKED_BY_ENVIRONMENT`; Gate 3 remains `NOT_READY`.

## Exact Human implementation decision

The following one-to-one labels and tokens are the scope-specific review vocabulary established by the active Control Tower in round 28. Only a current-user choice bound to this packet's reviewed bytes/hash can authorize the later bounded implementation.

| Decision              | Exact Human label                                                   | Machine token                                                       |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Authorize             | `AUTHORIZE BOUNDED GLOBAL TO BOUND PAGE IMPLEMENTATION`             | `AUTHORIZE_BOUNDED_GLOBAL_TO_BOUND_PAGE_IMPLEMENTATION`             |
| Request scope changes | `REQUEST BOUNDED GLOBAL TO BOUND PAGE IMPLEMENTATION SCOPE CHANGES` | `REQUEST_BOUNDED_GLOBAL_TO_BOUND_PAGE_IMPLEMENTATION_SCOPE_CHANGES` |
| Defer                 | `DEFER BOUNDED GLOBAL TO BOUND PAGE IMPLEMENTATION`                 | `DEFER_BOUNDED_GLOBAL_TO_BOUND_PAGE_IMPLEMENTATION`                 |

Human decision: `PENDING`. No implementation, runtime authority or live transfer has been authorized by this packet.
