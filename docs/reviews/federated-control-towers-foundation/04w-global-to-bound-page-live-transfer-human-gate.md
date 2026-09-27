# Global to bound Page transfer — Human review packet

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW`  
Prepared by Bridge round: `BRIDGE-FRESHGATE-20260927-C11790A1:39`  
Date: 2026-09-27

## Current source and exact target

One `ReconcileLiveReadOnly` call opened the existing foundation-context lock with `FileMode.Open` and `FileShare.None`, reconciled the activation/journal while holding it, then released it. The observed source was the sole `ACTIVE GLOBAL_CONTROL_TOWER`, Project `g-p-6a4d778944108191894f8e3657742da4`, conversation/instance `6ab40aa1-ea94-83eb-85be-dafbbef3ddef`, run `FED-LIVE-20260927-RC1-B1`, epoch `2`, revision `11`, record hash `54568aeb8039f6c843b2d6615b2eb85ed460e3ba2f5fefb130a9515291533255`. The 14 existing runtime files had identical SHA-256 values before and after the read. This is a point-in-time observation. The later transfer must reacquire the same lock and recheck the exact source; a stale source blocks.

The only proposed target is `PAGE_CONTROL_TOWER`, `PAGE_LOCAL`, owning Page Chat/conversation/instance `6a760691-3674-83eb-9347-9e4ef8c60acf`, Project `g-p-6a4d778944108191894f8e3657742da4`, reviewed title `Avis & commentaires v`, URL `https://chatgpt.com/g/g-p-6a4d778944108191894f8e3657742da4-yuta-sarl/c/6a760691-3674-83eb-9347-9e4ef8c60acf`. The proposed fresh run is `FED-LIVE-20260927-G2P-A1`, target epoch `4`, with the existing causal lineage `BRIDGE-FEDERATED-CONTROL-TOWERS-ARCH`. `PAGE_CONTEXT_INTAKE` remains `UNKNOWN`; Codex has not accessed Page Chat content.

## Reviewed, non-authorizing decision

The immutable [proposal](decisions/global-to-bound-page-proposal-20260927-a1.json) has SHA-256 `b119bc464ed853de7afc1540ca803e0c6c45b51f48baef1eb9b7d45280547cc7`. The canonical [pre-decision descriptor](decisions/descriptors/3f7fe12fe410242dad1f6540f983e777d33be078ed3e1cc2dd2aae1a6299438b.json) has SHA-256 `d2c3da1488f4addad6d550fdfd81ac975d53ac0fb9109db9e1de9ef8d5fccef5` and deterministic `DECISION_ID=3f7fe12fe410242dad1f6540f983e777d33be078ed3e1cc2dd2aae1a6299438b`. Type is `LIVE_TOWER_SELECTION`; scope is the exact foundation execution context, same causal lineage, and `BUDGET_TYPE=NONE`, `BUCKET_KEY=NONE`. The helper's `Assert-LiveSelectionPayload` accepted this proposed payload against the observed source. This descriptor is not Human approval or executable authority.

Reserve `DECISION_ITEM_ID=BRIDGE-FRESHGATE-20260927-C11790A1:40#1` **only if** the next complete Control Tower `HUMAN_REQUIRED` command binds this descriptor, scope and the final pre-approval SHA-256 of this packet. The accepted gate result, approval record, semantic decision record and durable consumed proof do not yet exist. This packet does not contain its own SHA-256; the bridge computes it from the final bytes before opening the Gate.

| Decision        | Exact Human label                      | Machine token                          |
| --------------- | -------------------------------------- | -------------------------------------- |
| Approve         | `APPROVE LIVE TOWER SELECTION`         | `APPROVE_LIVE_TOWER_SELECTION`         |
| Request changes | `REQUEST LIVE TOWER SELECTION CHANGES` | `REQUEST_LIVE_TOWER_SELECTION_CHANGES` |
| Defer           | `DEFER LIVE TOWER SELECTION`           | `DEFER_LIVE_TOWER_SELECTION`           |

Approval would authorize **one exact** Global-to-bound-Page transaction only after the accepted Human result and one-way authority chain verify. Under the same exclusive lock, the transaction must recheck the source and typed proof, durably move Global through `FENCING` to `TERMINAL` or `REVOKED`, then create and verify the immutable non-authorizing D4 handoff. Only after Global is non-executable may the Page target reserve the fresh run, probe through the built-in browser and reach `ACTIVE`. The old Global run, commands and consumed decision cannot replay. Uncertain lock, source, target, delivery, result, handoff or crash state fails closed to zero new executable authority. The existing Page Chat retains `PAGE_LOCAL` Product/shaping authority. The return Page-to-Global transfer is separate.

No D4 handoff, Global fence, Page activation, consumed Human authority, browser send or remaining Phase 6 QA case is performed by this packet. Historical T18/T19 evidence remains unchanged; the fresh post-implementation T18 and T19 PASS are [04u](04u-post-g2p-t18-technical-compliance-reassessment.md) and [04v](04v-post-g2p-t19-formal-verify.md). Phase 6 remains 1 PASS, 11 PARTIAL, 23 NOT_RUN; Gate 3 is NOT_READY.

## Bounded correction evidence

Only the existing federation helper, skill and tracked operating protocol owners were corrected. Current SHA-256 values: helper `2dbfd6dab7172d78b6b8002b223ead8f31293e16d1e79e32e00174ac02565f02`; skill `0b0849122edca3fa2c7738324750898c17bfe474826c5405fdfe708bb9bb919b`; protocol `6764da7335d52bbf857b06850121ad2867447d937432946f13847e9b70a70b92`. `SelfTest` passed 148/148, including strict no-repair, no-byte-change, contention, corrupt snapshot and multiple-active rejection. Wrong context and mutation parameters were rejected before live access; Bridge duplicate-result guard passed 5/5. PowerShell parse, OpenSpec strict, docs:check, architecture:check, workspace typecheck and scoped Markdown formatting passed. Canonical descriptor JSON intentionally retains canonical compact bytes; Prettier would change its reviewed hash.
