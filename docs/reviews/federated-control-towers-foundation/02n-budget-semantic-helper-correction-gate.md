# Bounded helper-correction authorization review — federated budget semantics

Change: `federated-control-towers-foundation`  
Gate: separate current-Human authorization for helper convergence  
Status: `AWAITING_HUMAN_REVIEW`  
Requested action: correct the local helper and run focused synthetic revalidation against the approved material-bucket provenance, positive maximum-exception, monotonic-maximum and execution-freeze contracts. This packet does **not** authorize that action.

## Exact planning and implementation baseline

| Artifact                                   | SHA-256                                                            | Treatment                                                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Approved Gate 2 delta Spec                 | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Unchanged; no new Spec or authority semantics.                                                                        |
| Approved corrected Design                  | `a9074405083a3f82616c9dd94ac27154ac70bb741a7f0dfd21c9663e80395998` | Exact approved semantic contract.                                                                                     |
| Recorded corrected Sensitive Design review | `280bf8588237f102061bc364dabf36f854641fed74abd104b42b3a2c2f07fa48` | Approval header binds pre-approval packet SHA-256 `43596b8f449ade55acce274ff1b0793299f31276e4510e1c156ad38af8dcd85c`. |
| Recorded corrected Tasks/TIC review        | `8c7425f0b049fa24593edb8aae65d225b22c33fbde85cfcf1c680cf53c75128c` | Approval header binds pre-approval packet SHA-256 `ff3d5fd791b7a602bafd0cefddb74800701ca327b6b4c0be163cdb70f74fb12e`. |
| Current `tasks.md`                         | `8135f3f950d107d9c757e56e522703fca9176df2ef316785cb046d655a5b3eee` | 9/24 historically complete; T10–T24 unchecked; Phase 3 `NOT_AUTHORIZED`.                                              |
| Current `state-helper.ps1`                 | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` | Existing partially converged implementation; no edit under this gate preparation.                                     |
| Round-30 correction evidence               | `3c8935cc48c61f6da21388f57c7494c1304bafa2a6a2da980eb8a41693f39080` | Historical 19/19 local checks with `PARTIAL_NEEDS_REVIEW`; not proof of the corrected contract.                       |

Phase 1 and original Phase 2 evidence remain historical and unchanged. The later helper correction is still `PARTIAL_NEEDS_REVIEW`. Corrected planning approval does not authorize implementation, and passing future focused checks would not authorize Phase 3.

## Proposed bounded owner and safety boundary

The only eligible tracked **implementation owner** is `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. Bounded change/review/evidence metadata and `tasks.md` metadata only where the workflow requires them are supporting records, not additional implementation owners. Synthetic local fixtures may use only the existing ignored `tmp/yuta-federated-control-towers/<EXECUTION_CONTEXT_ID>/` boundary after separate Human authorization. They must not activate a real Page or Global tower.

The proposed correction must remain on one supported Windows/NTFS host and canonical checkout, with the approved helper and existing held-lock, journal-first complete-snapshot, flush, replace and read-back persistence model. It must not create a second budget store, retry subsystem, wire field, Product authority or distributed coordination mechanism. Missing host/checkout/lock/journal proof and any unknown, stale, conflicting or unsupported state fail closed with zero executable authority.

## Proposed exact helper convergence

1. **Evaluator bucket provenance.** Mechanically validate immutable reviewed `EVALUATOR_BUCKET_CLASSIFICATION` references using exact repository-relative path, SHA-256, schema, execution context, causal lineage, bucket identity, separately bound approval reference and journal continuity. A current Human or already-authoritative reviewed workflow decides `SAME_MATERIAL_BUCKET` versus `DISTINCT_MATERIAL_BUCKET`; the helper and Codex never infer or self-approve material difference. Reject self-issued, unapproved, stale, mutable, hash-mismatched, ambiguous, conflicting, cross-context or cross-lineage provenance. Materially equivalent work reuses its bucket across fresh `RUN_ID`, restart, epoch, tower, rename, transport, escalation or rotation.
2. **Monotonic accounting.** `APPROVED_MAXIMUM` never decreases within the exact recovery or evaluator-bucket lineage. `ATTEMPTS_USED` and `EXECUTION_GENERATIONS_USED` never decrease. A typed, exact-scope, current-Human `BUDGET_MAXIMUM_EXCEPTION` may only increase the selected maximum after validating its prior maximum, decision identity, artifact/hash, purpose and stop condition. Persist the exception and resulting maximum atomically through the existing journal/snapshot model. Duplicate or replayed application, wrong scope, prior maximum or counter rollback blocks.
3. **Independent execution freeze.** Validate typed `BUDGET_EXECUTION_FREEZE` APPLY, LIFT and SUPERSEDE transitions with exact current-Human decision provenance, deterministic transition identity, reviewed artifact/hash, prior active freeze identity and one ACTIVE freeze per exact budget scope. An ACTIVE freeze blocks new affected execution without changing maximum or used counts. A maximum increase does not lift it; LIFT does not increase maximum or reset counts; SUPERSEDE retains immutable history. One Human interaction that requests both an exception and a freeze change requires separately attributable decision items. Human Gates without an explicit exact exception or freeze transition change neither state.
4. **Accepted command and independent stops.** Preserve `COMMAND_ACCEPTED`, `PENDING_COMMAND_ID`, attributable outcome and `EXECUTION_UNCERTAIN` at-most-once semantics. A freeze applied after acceptance cannot erase accepted intent or its outcome; a lift never redispatches a pending or uncertain command. `EVIDENCE_STOP_STATE`, unsafe retry, missing mandatory evidence, no-useful-progress and other authorization blockers remain independent. Neither exception nor freeze lift clears them.
5. **Handoff, recovery and privacy.** Restart, fresh run, epoch change, Page-to-Global handoff and same-role rotation carry counters, maxima, exception and freeze histories, derived active freeze, bucket classification provenance, pending identity, blocker ancestry and evidence-stop state. Reject reduced maximum/count, dropped ACTIVE freeze, unauthorized lift, duplicate event, stale epoch, wrong scope, unsupported schema, rollback and journal-ahead/behind conflict. Store only bounded IDs, decision metadata, references and hashes; reject transcript, customer personal data, credentials, tokens, cookies, sessions, provider secrets and unrelated private content. Do not auto-migrate incompatible old runtime state.

## Required focused evidence after separate authorization

Use existing repository tooling and test conventions; add no test framework. Record exact helper before/after SHA-256, scoped diff, synthetic fixture identity, commands, actual outputs, executable-authority disposition, limitations and new evidence SHA-256. Test at least:

- approved SAME reuse and DISTINCT creation; self-issued, stale, mutable, ambiguous, conflicting, cross-lineage and hash-drifted classification rejection; equivalent work retaining one bucket across run, rename, restart, epoch, rotation and escalation;
- positive recovery and evaluator maximum exceptions; exact prior-maximum and scope checks; duplicate/replay rejection; maximum and used-counter decrease rejection;
- valid freeze APPLY, LIFT and SUPERSEDE; duplicate/replayed/unauthorized or wrong-active-freeze transition rejection; one ACTIVE freeze per scope and conflicting-state rejection;
- used `2`/maximum `5` remaining `2`/`5` while ACTIVE freeze blocks execution; maximum increase while frozen leaving freeze active; lift preserving maximum and used counters; separate attributable decision items;
- accepted pending command preserved through freeze, uncertain command not redispatched after lift/restart/transfer, and `EVIDENCE_STOP_STATE` still effective after lift;
- restart, fresh `RUN_ID`, Page-to-Global handoff and Page/Global rotation preserving all approved provenance and state; dropped ACTIVE freeze, rollback, malformed state, journal-ahead/behind and privacy-field rejection; and
- regression of the prior 19 focused budget-schema cases, recorded as **new** evidence without changing or promoting the historical round-30 packet.

The proposed correction does not permit real tower activation, Page Chat access, live browser federation traffic, T10–T14 execution, formal Technical Compliance, formal VERIFY, Federated Browser QA, Gate 3, sync/archive, commit/push/PR/merge/deploy/release, or edits to the federated skill, tracked operating protocol, Bridge v1, Workflow v3, Product code, API, auth, schema, provider integration or deployment configuration. It changes no PAGE_LOCAL Product/shaping authority, Global Control Tower coordination scope or Human Gate authority.

## Human decision boundary

This packet is `AWAITING_HUMAN_REVIEW`. The current Human may choose `AUTHORIZE CORRECTED TARGETED SEMANTIC HELPER CORRECTION`, `REQUEST CORRECTED TARGETED SEMANTIC HELPER SCOPE CHANGES`, or `DEFER CORRECTED TARGETED SEMANTIC HELPER CORRECTION`. No option is inferred from Design, Sensitive Design or Tasks/TIC approval. A later explicit Phase 3 authorization remains necessary even after successful helper convergence.
