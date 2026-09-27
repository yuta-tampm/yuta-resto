# Federated Control Towers — Phase 5 correction blocked by live selection authority

Change: `federated-control-towers-foundation`  
Bridge command: `BRIDGE-ARCH-20260925-F9R2:127`  
Status: `NEEDS_REVIEW`  
Scope: bounded RC1/RC2 correction preflight; no executable correction committed

## Authorization and preserved evidence

- The current user selected `AUTHORIZE PHASE 5 IMPLEMENTATION CORRECTION` for the exact `03t` packet, preapproval SHA-256 `999de92bd9bc6c8d9ab3969ef7c12810e6de07257ea53e04cc034a5fe8bc67c9`. The decision was relayed in valid Bridge round 126. The approval was recorded as review metadata in `03t`; its postdecision hash is `0a80ed97233300877fd2038b59b133483d85bf26c0383d06946ad2ef544ae11a`.
- Historical T18 Technical Compliance `03r` remains `FAIL`, SHA-256 `9bf01c74a952df9beede6c6e4e9799f110039e1b9ac9dfc51999c49e9d2bda7c`. Historical T19 formal VERIFY `03s` remains `FAIL`, SHA-256 `1d5957902bd809688759155f77a4a6f7fa96b82202f738186d77782ba3985775`.
- The approved three implementation owners remain byte-for-byte unchanged. In particular, `state-helper.ps1` remains SHA-256 `c8a9086991bb4dd9e43be006bb80c3a1a27e1af5679d340e317272bb63c12719`; PowerShell parsing has zero errors. No live runtime state or lock was created.

## Material threshold B: live tower selection proof is not defined

Design D1 and D8 require a current-user or reviewed-workflow selection of the exact Page or Global tower, execution context, role/scope, owning Page Chat, Project, conversation and fresh run before executable activation. The approved machine-readable accepted-result and durable-consumption chain in Design D3 is typed for evaluator bucket classification, budget maximum exception and budget freeze transition. Its exact token mapping and helper verification do not define a live tower selection decision type or record.

During correction preflight, a proposed live helper path would have had to trust a caller-created selection JSON containing `DECISION_SOURCE=CURRENT_USER` and a free-form Human Gate reference. Those fields would not prove an accepted Human decision bound to the pending command, reviewed packet, exact target, execution context and run. Using them to permit `ACTIVATING→ACTIVE` would make a forged or misbound Human Gate capable of creating executable tower authority. This meets the round-107 material threshold **B**. The speculative helper edits were removed before execution; the original helper hash was restored.

The existing correction authorization approves implementation of RC1/RC2. It does not select or activate a live tower and cannot be reused as a live-selection Human Gate. Synthetic `FED-QA-*` fixtures remain non-authoritative. A browser observation can be collected by the trusted Codex UI transport while a helper holds the lock, but it cannot substitute for the missing Human selection authority proof.

## Bounded next decision

The Control Tower should determine the smallest reviewed authority contract that binds a live selection to exact context, tower role/scope/owner, Project/conversation, run, reviewed artifact hash, current-user or reviewed-workflow gate result and replay/staleness rules. It must preserve the already-approved budget decision chain and Workflow v3 authority. Do not infer live approval from a caller string, matching target, tracked protocol, synthetic probe, or this correction gate.

Until resolved: `RC1=BLOCKED`, `RC2=NOT_STARTED`, `CORRECTION_STATUS=NEEDS_REVIEW`, `T18/T19=HISTORICAL_FAIL`, `T20–T24=UNCHECKED`, `PHASE_6=NOT_AUTHORIZED`, `FEDERATED_BROWSER_QA=NOT_RUN`, `GATE_3=NOT_READY`. No formal reassessment, browser QA, Page Chat access, commit, push, PR, merge, deploy, release, sync or archive occurred.
