# Global to Bound Page QA Transfer — targeted Sensitive Design review

Status: `AWAITING_HUMAN_REVIEW`. This packet is a review candidate, not a Human Gate result, selection authority, handoff, or implementation authorization.

## Reviewed boundary

- Change: `federated-control-towers-foundation`.
- Pre-change Design SHA-256: `753bff4fa3324a5a8696be26c9d4e5360484f3093f9c916aaf0d21c681de56b1`.
- Updated Design SHA-256: `342d99ba862c8dc911b3041d95c99b8dd7f14fe22fde4c0a4bb97bca6499a6c2`.
- Unchanged Gate 2 delta Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0`.
- Existing Tasks/TIC SHA-256: `3ddf37e74152ecc6adfe2fe8eea632db5cbc9f6ddaba609d11740e189dedc9a3`; this remains unchanged and does not yet authorize the new direction.
- Design delta: D3 `LIVE_TOWER_SELECTION.INTENDED_ACTION` gains only `GLOBAL_TO_BOUND_PAGE_QA_TRANSFER`; D6 defines its ordered transfer. Existing Page-to-Global escalation and same-role rotation retain their semantics.

## Exact source and target

The observed activation snapshot for `FEDERATED-CONTROL-TOWERS-FOUNDATION` is `ACTIVE GLOBAL_CONTROL_TOWER`, scope `FOUNDATION`, instance/conversation `6ab40aa1-ea94-83eb-85be-dafbbef3ddef`, Project `g-p-6a4d778944108191894f8e3657742da4`, run `FED-LIVE-20260927-RC1-B1`, epoch `2`, revision `11`, record hash `54568aeb8039f6c843b2d6615b2eb85ed460e3ba2f5fefb130a9515291533255`. These are observed planning inputs, not a promise that the source will remain current at a later Human Gate or execution; the helper must recheck the canonical source under lock.

The Human-bound Page target from bridge round 17 is `PAGE_CONTROL_TOWER`, scope `PAGE_LOCAL`, owning Page Chat/instance/conversation `6a760691-3674-83eb-9347-9e4ef8c60acf`, Project `g-p-6a4d778944108191894f8e3657742da4`, title `Avis & commentaires v`, URL `https://chatgpt.com/g/g-p-6a4d778944108191894f8e3657742da4-yuta-sarl/c/6a760691-3674-83eb-9347-9e4ef8c60acf`. The round-17 binding identifies a candidate only. It is not a consumed `LIVE_TOWER_SELECTION` or an executable Page activation.

## Safety review

| Boundary               | Required behavior and failure disposition                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One active tower       | A single canonical NTFS checkout and the existing long-lived `FileShare.None` lock serialize source verification, typed Human selection consumption, fence, immutable handoff, target probe and active commit. A second active claim or unproven lock ownership blocks both dependent flows. No distributed/multi-host claim is made.                                                                                                           |
| Authority and ordering | Bind the version-2 `LIVE_TOWER_SELECTION` proof to exact source hash/state/epoch, target tuple, reviewed artifact, action and fresh target run. Human approval of this Design does not supply that proof. Keep Global executable only until the durable fencing transition. Commit Global `FENCING` then terminal/revoked before Page `ACTIVATING`; the fence commit is the linearization point. In the gap, zero towers are executable.        |
| Handoff and replay     | Reserve the fresh Page run in the terminal source record and create the existing D4 immutable handoff only after Global is terminal/revoked. Handoff carries exact lineage, budgets, consumed proofs, freeze state, blockers and evidence-stop state; it does not authorize execution. Old Global commands and selection proofs cannot be replayed. A later Page-to-Global return is a separate, already-defined transfer with fresh authority. |
| Crash or uncertainty   | A crash before proven fencing leaves the last verified Global state authoritative only after journal/snapshot reconciliation; never assume a new Page authority. A crash after durable fencing but before Page active leaves zero executable authority. Missing/conflicting journal, snapshot, handoff, target, accepted Human result, browser delivery or command outcome blocks rather than auto-resends or creates another active tower.     |
| Product and context    | The owning Page Chat keeps `PAGE_LOCAL` Product/shaping authority. Global retains Workflow v3 `CROSS_MODULE`/`UNCERTAIN` coordination authority. `PAGE_CONTEXT_INTAKE: UNKNOWN` is not evidence that no prior requirement exists. Codex neither accesses nor self-orchestrates Page Chat content; the exact Page browser endpoint is used only after valid authority and target verification.                                                   |
| Privacy                | Persist only bounded role/scope, instance, context/run/epoch, authority/proof, state and artifact/hash metadata under the existing schema. No transcript, private Page Chat content, customer data, credential, token, cookie or session enters the handoff, journal, snapshot or review evidence.                                                                                                                                              |

## Acceptance and residual limitations

Sensitive Design review must confirm the typed action and exact target do not silently broaden the supported transfer set; the lock and journal sequence maintains at most one executable tower; the D4 handoff remains non-authorizing; and stale/ambiguous source, target or delivery yields zero new executable authority. The built-in browser remains the transport; no Chrome, Playwright, new session infrastructure, arbitrary role transition, Product authority, protocol wire change or multi-host mechanism is proposed.

The current implementation owners and Tasks/TIC still reject or omit Global-to-Page. This packet does not change them. Planning cannot prove a live fence, target probe, lock exclusivity or Page QA. Fresh T18 and T19 `PASS` results predate this Design change and must be reassessed after any separately authorized implementation. Phase 6 remains `1 PASS`, `11 PARTIAL`, `23 NOT_RUN`, `BLOCKED_BY_ENVIRONMENT`; no case is promoted by this packet. Historical failures remain preserved.

## Human review boundary

This candidate requires a separate Sensitive Design Human decision. Approval would authorize review of targeted Tasks/TIC corrections only. It would not authorize owner edits, a new live-selection record, Global fencing, Page activation, handoff execution, remaining Browser QA, T18/T19 reruns or Gate 3 readiness.

The exact Human Gate labels and machine tokens for this packet are:

| Decision        | Human label                                             | Machine token                                           |
| --------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| Approve         | `APPROVE GLOBAL TO BOUND PAGE SENSITIVE DESIGN`         | `APPROVE_GLOBAL_TO_BOUND_PAGE_SENSITIVE_DESIGN`         |
| Request changes | `REQUEST GLOBAL TO BOUND PAGE SENSITIVE DESIGN CHANGES` | `REQUEST_GLOBAL_TO_BOUND_PAGE_SENSITIVE_DESIGN_CHANGES` |
| Defer           | `DEFER GLOBAL TO BOUND PAGE SENSITIVE DESIGN`           | `DEFER_GLOBAL_TO_BOUND_PAGE_SENSITIVE_DESIGN`           |
