# Fresh retry live-tower selection — Human review packet

Change: `federated-control-towers-foundation`  
Status: `AWAITING_HUMAN_REVIEW`  
Prepared by command: `BRIDGE-ARCH-20260925-F9R2:165`  
Date: 2026-09-27

## Exact source and proposed target

The bounded transition evidence is [`04k-history-preserving-retry-transition-evidence.md`](04k-history-preserving-retry-transition-evidence.md), SHA-256 `8caa2c8e0c2fb9137e416d39407a2ce21ab6f22d87b4801af1cdbccf8ed95806`. The immutable old terminal uncertain parent is record hash `b30e014b76d38177c5cf88bf33f33b3378f32d363929d554dd4750b46062c8b7`, revision 5. It retains `DELIVERY_UNCERTAIN`, `EXECUTION_UNCERTAIN`, old command `FED-LIVE-20260927-RC1-A1:1` and the consumed old decision `7da6f31b3cf326bf0de69d3471c4790f081505bdfdd1f8933ef23818bf00c96a`. None may be replayed.

The current source is revision 6, record hash `22256c8e2fcd47587bceaf543f3f887c1527e857643a0f00b81d334a6e271121`, `STATE=TERMINAL`, epoch `1`, `DELIVERY_STATE=NOT_SENT` and `EXECUTION_STATE=NONE` **for the fresh retry only**. It has no active run or executable authority. `PREVIOUS_RECORD_HASH` binds to the old parent. Execution context is `FEDERATED-CONTROL-TOWERS-FOUNDATION`; causal lineage is `BRIDGE-FEDERATED-CONTROL-TOWERS-ARCH`. The fresh target run is `FED-LIVE-20260927-RC1-B1`, proposed round `1`, command `FED-LIVE-20260927-RC1-B1:1`, target epoch `2`. No fresh run binding, browser action, accepted Human result, approval, semantic decision or consumed proof exists yet.

The target is the same exact `YUTA — Control Tower` conversation: Project ID `g-p-6a4d778944108191894f8e3657742da4`, conversation ID `6ab40aa1-ea94-83eb-85be-dafbbef3ddef`, URL `https://chatgpt.com/g/g-p-6a4d778944108191894f8e3657742da4-yuta-sarl/c/6ab40aa1-ea94-83eb-85be-dafbbef3ddef`, role `GLOBAL_CONTROL_TOWER`, scope `FOUNDATION`, Page owner `NONE`. Exact visible target identity must be rechecked before every send.

## Reviewed decision identity

The proposal is [`decisions/live-selection-proposal-20260927-rc1-b1.json`](decisions/live-selection-proposal-20260927-rc1-b1.json), SHA-256 `916d6bdb8d0ee559d082dfee23c45e71b91222eefdaa24911eb0416baa2684ec`. The canonical pre-decision descriptor is [`decisions/descriptors/3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5.json`](decisions/descriptors/3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5.json), SHA-256 `8703c93c8d71aa08a939aa1806fbf37d5a5dab8a54cbd78eb5922e4f317bfd41`. Its deterministic `DECISION_ID` is `3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5`. `DECISION_TYPE=LIVE_TOWER_SELECTION`; the exact decision scope is `BUDGET_TYPE=NONE`, `BUCKET_KEY=NONE`, the context and lineage above. The proposed payload binds `REACTIVATION`, exact source state/hash/epoch, target epoch/run/tower and proposal hash. A hash or matching title alone is not Human authorization.

The next Human Gate may use proposed `DECISION_ITEM_ID=BRIDGE-FRESHGATE-20260927-C11790A1:2#1` **only if** the complete round-2 command is the exact `HUMAN_REQUIRED` command for this descriptor, scope and finalized packet hash. The accepted typed result must contain `CURRENT_USER_DECISION: APPROVE_LIVE_TOWER_SELECTION` under mapping version 2; request-changes or defer does not grant authority. If round or item differs, rebind and stop before creating authority records. The finalized SHA-256 of this packet is supplied externally to the Gate and later result; this file must not contain its own hash.

The active YUTA Control Tower issued the following exact decision labels and tokens for this fresh `LIVE_TOWER_SELECTION` Human Gate:

| Decision        | Exact Human label                      | Machine token                          |
| --------------- | -------------------------------------- | -------------------------------------- |
| Approve         | `APPROVE LIVE TOWER SELECTION`         | `APPROVE_LIVE_TOWER_SELECTION`         |
| Request changes | `REQUEST LIVE TOWER SELECTION CHANGES` | `REQUEST_LIVE_TOWER_SELECTION_CHANGES` |
| Defer           | `DEFER LIVE TOWER SELECTION`           | `DEFER_LIVE_TOWER_SELECTION`           |

Only the exact approve token can satisfy the version-2 live-selection authority check. Request changes and defer grant no runtime or execution authority.

## Bounded authorization and stop conditions

If Human approves the exact fresh decision, a later command may create the accepted gate-result, approval and semantic decision records in the approved one-way order. Only after those records verify under the held context lock may one fresh read-only built-in-browser handshake → command → single RESULT → single Control Tower evaluation and concurrent same-context lock-exclusion proof run. The retry genesis and this packet do not authorize RC1/RC2 execution. A missing/mismatched gate token, stale source, wrong Project/conversation, incomplete or duplicate block, uncertain delivery, or conflicting lock/lineage stops without resend. This Gate grants no Page Chat access, Product decision, Phase 6, T18/T19 PASS, commit, deployment or release.

Historical round-161 RC1 `FAIL` and T18/T19 `FAIL` remain unchanged. Fresh RC1/RC2 are `NOT_RUN`; Phase 6 is `NOT_AUTHORIZED`; Gate 3 is `NOT_READY`.
