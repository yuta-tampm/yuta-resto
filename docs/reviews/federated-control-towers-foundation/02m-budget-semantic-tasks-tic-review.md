# Targeted budget semantic reconciliation — approved Tasks/TIC decision

Current targeted Tasks/TIC status: `APPROVED` for the pre-approval packet SHA-256 `ff3d5fd791b7a602bafd0cefddb74800701ca327b6b4c0be163cdb70f74fb12e` only.  
Approval source: exact current-user `APPROVE CORRECTED TARGETED SEMANTIC TASKS TIC`, relayed in YUTA Control Tower Bridge result `BRIDGE-ARCH-20260925-F9R2:40`.  
Bound unchanged Tasks SHA-256: `8135f3f950d107d9c757e56e522703fca9176df2ef316785cb046d655a5b3eee`.  
Approval permits preparation of a separate bounded helper-correction Human Gate only. It does not authorize helper edits, tests, Phase 3, formal VERIFY or Browser QA.

The review below preserves the pre-approval snapshot. Its `AWAITING_HUMAN_REVIEW` and decision-request wording describe the state before this current-user approval and do not supersede the approved status above.

---

# Pre-approval targeted budget semantic reconciliation — Tasks/TIC candidate

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW` for separate targeted Tasks/TIC approval. This packet grants no helper or Phase-3 authorization.  
Approved corrected Design SHA-256: `a9074405083a3f82616c9dd94ac27154ac70bb741a7f0dfd21c9663e80395998`.  
Approved targeted Sensitive Design pre-approval packet SHA-256: `43596b8f449ade55acce274ff1b0793299f31276e4510e1c156ad38af8dcd85c`. Its approval source is exact current-user `APPROVE CORRECTED TARGETED SEMANTIC SENSITIVE DESIGN`, relayed in YUTA Control Tower Bridge result `BRIDGE-ARCH-20260925-F9R2:38`; the updated approval record is `02l-budget-semantic-sensitive-design-review.md`, SHA-256 `280bf8588237f102061bc364dabf36f854641fed74abd104b42b3a2c2f07fa48`.  
Revised Tasks/TIC SHA-256: `8135f3f950d107d9c757e56e522703fca9176df2ef316785cb046d655a5b3eee`.  
Prior approved Tasks/TIC review: `02h-budget-schema-tasks-tic-review.md`, SHA-256 `bd193f1815f0f57a3f7f2fe0381862c388db3176c25647d95d45814819f6d96d`.

The first semantic Tasks/TIC candidate SHA-256 `0504eddca4cc1267be58cd6d3e56f7d569ed54c169986690d3b6177afd5a01bd` and first targeted Tasks/TIC review packet SHA-256 `aefdcc6d88db77dec37a3b098cdf097ba13af3efe84aec544e4c1b369d0f1d2a` are historical, unapproved candidates. Current-user Design change request in Bridge round 34 required the focused freeze correction below.

## Exact Tasks/TIC delta

The 24 tasks and six phases are unchanged. T01–T09 remain historical completion; T10–T24 remain unchecked. A targeted checkpoint and TIC section in `tasks.md` now require:

1. Existing materially equivalent evaluator work reuses its bucket across fresh run, rename, tower, restart, escalation and rotation. A `DISTINCT_MATERIAL_BUCKET` candidate requires an immutable reviewed classification artifact and separate bound Human/reviewed-workflow decision; helper checks structure, hash, identity and durable ledger, never decides semantic materiality.
2. A positive Human exception is one exact-scope typed approval in the existing `APPROVAL_REFERENCES`; deterministic ID and decision uniqueness make application idempotent. The existing journal/snapshot mechanism raises only the selected maximum, preserving used counters, pending identity, lineage and evidence-stop.
3. Unknown/stale/conflicting record, missing approval, replay, rollback, mismatched prior maximum or incomplete transfer stops before executable authority. No automatic migration, new retry subsystem, new runtime owner or extra Bridge wire field.
4. Later helper correction is a separate bounded Human Gate after Design, Sensitive Design and Tasks/TIC approvals. Historical Phase-2 evidence and round-30 19/19 local cases stay historical; current helper convergence remains `PARTIAL_NEEDS_REVIEW`.
5. The committed maximum and used count are monotonic non-decreasing for each exact recovery or evaluator-bucket scope. A later stricter Human decision appends typed `BUDGET_EXECUTION_FREEZE` APPLY/LIFT/SUPERSEDE evidence; it never lowers the maximum. A unique ACTIVE freeze blocks new affected execution despite remaining numerical capacity. All transitions are exact-scope, Human-proven, artifact/hash-bound, idempotent and persisted with the existing journal/snapshot and handoff. A separate lift cannot raise maximum or clear `EVIDENCE_STOP_STATE`; a positive exception cannot lift a freeze. If one Human interaction requests both changes, the exception and freeze transition need distinct attributable decision items and independent validation. A freeze after `COMMAND_ACCEPTED` cannot erase accepted intent or its attributable outcome, and cannot permit redispatch of `PENDING_COMMAND_ID` or `EXECUTION_UNCERTAIN` work.

## Required later focused revalidation

Under a **new** bounded helper authorization, test at least: approved SAME reuse; approved DISTINCT creation; absent/self-issued approval; stale and hash-drifted classification; conflicting/ambiguous materiality; rename/fresh-run/tower reuse; positive recovery maximum; positive evaluator maximum with used count preserved; duplicate/replayed exception and decision; wrong prior maximum; wrong context/lineage/bucket; any maximum decrease rejection; Human Gate without exception; evidence-stop independence; restart and Page→Global/Page/Global-rotation carry; privacy allowlist; accepted-command uncertainty and at-most-once. Add focused cases for used `2`/maximum `5` plus ACTIVE freeze blocking further execution without changing `2`/`5`; valid APPLY; duplicate/replayed APPLY/LIFT/SUPERSEDE; wrong scope, active-freeze identity or conflicting freeze provenance; restart, fresh run, epoch change, handoff, rotation and escalation carrying ACTIVE freeze; maximum exception while frozen leaving freeze active; exact Human LIFT preserving maximum and used count; unauthorized LIFT rejection; separately attributable exception and freeze decisions from one Human interaction; `PENDING_COMMAND_ID` and accepted outcome preservation through a freeze; no redispatch after lift or transfer; `EVIDENCE_STOP_STATE` remaining effective after LIFT; and a Human Gate without exact freeze change leaving state unchanged. Rerun the pre-existing 19 focused budget-schema cases as regressions. Record actual commands and hashes in fresh evidence; do not relabel the earlier `02j` packet as proof.

No task may infer implementation authority from these candidates. T10–T14 and Phase 3 remain `NOT_AUTHORIZED`; formal Technical Compliance, VERIFY and Browser QA remain outside this planning round. The only implementation owner eligible for a later **separately approved** correction is `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`; this packet does not change that file.

The corrected Design and targeted Sensitive Design prerequisites are approved for their exact hashes above. Request a separate current-Human Tasks/TIC review bound to this packet's exact pre-decision SHA-256 and the unchanged `tasks.md` candidate hash. A later helper correction and Phase-3 Apply require distinct authorizations. No Spec change is required; Product/Page Chat/Global Tower/Human authority, Bridge v1 wire grammar, single-host boundary and privacy allowlist remain unchanged.
