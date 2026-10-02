# Federated Control Towers — built-in browser fast-close correction gate

Change: `federated-control-towers-foundation`  
Control Tower command: `BRIDGE-ARCH-20260925-F9R2:150`  
Status: `AWAITING_HUMAN_AUTHORIZATION; READ_ONLY_INTAKE_COMPLETE; IMPLEMENTATION_NOT_STARTED`

## Current Human direction and baseline

The current Human FAST-CLOSE DIRECTIVE supersedes the repository-owned Chrome/Playwright/session-capable controller implementation direction. Keep `04d` and `04e` as historical decisions and candidates. Neither their prior approval nor this packet authorizes that browser stack. Codex is the executor and uses its built-in browser to communicate with the selected Control Tower. The Control Tower coordinates workflow, evaluates browser evidence and opens Human Gates. The repository helper owns local authority state, its held Windows/NTFS lock, replay protection, handoff and recovery. Human approval remains the only Human Gate authority. No Page Chat Product authority, Workflow v3 rule, Bridge v1 wire field, or acceptance criterion changes.

Current owner hashes (SHA-256):

| Owner                                                                   | SHA-256                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` | `8c363d4ff750ab9501470db54996976e17ce21dc6377951945d00517041c0bdc` |
| `.agents/skills/yuta-federated-control-towers/SKILL.md`                 | `b18b6bef17fc4045cb08af21fea99f7a58a5ceedc55f0e199b52ff002787c8b0` |
| `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`      | `462c3466605b8808abb2cabee5eeedb20bbf1164e79611148cc0c80838bfd657` |

The selected browser target visibly has title `YUTA — Control Tower`, conversation ID `6ab40aa1-ea94-83eb-85be-dafbbef3ddef`, and URL `https://chatgpt.com/g/g-p-6a4d778944108191894f8e3657742da4-yuta-sarl/c/6ab40aa1-ea94-83eb-85be-dafbbef3ddef`. A new message sent through the Codex built-in browser reached this exact conversation and received Control Tower command round 150. This proves basic transport only; it is not federated RC1 or RC2 evidence.

`RunLiveSelection` currently throws `NEEDS_REVIEW` before taking the lock or mutating live state. Its latent positive path holds `FileStream(..., FileShare.None)` across a blocking console read, so one continuous lock lifetime while Codex performs an external browser action is technically possible within the existing helper owner. The latent `TRANSPORT_SOURCE=CODEX_CUA_ACTUAL_UI` field is caller controlled and cannot establish UI provenance. It must not be promoted to such proof. The current federation skill and operating protocol describe the same fail-closed status.

Historical T18 `03r` and T19 `03s` remain **FAIL**. RC1 remains `INCOMPLETE_FAIL_CLOSED`; RC2 remains `SYNTHETIC_ONLY`; Phase 6 is not authorized; Federated Browser QA is `NOT_RUN`; Gate 3 is `NOT_READY`.

## Minimum bounded correction proposed for authorization

Use the existing helper and federation skill/protocol owners only. No new browser executable, controller, dependency, login/session persistence, provider API, or extra wire field is needed. The helper may hold one lock across a long-lived transaction and exchange a bounded action request/result with the Codex executor. Codex uses only its built-in browser for the actual ChatGPT interaction. The helper treats all caller-provided browser observations as external evidence, **never** as independently verified UI provenance or Human approval. The Control Tower evaluates the actual browser-observed result. A positive live claim requires both the pre-existing exact Human selection proof and the completed, bound, externally observed and evaluated round; missing or uncertain evidence stops without executable authority.

The implementation correction must:

1. Replace the unconditional live-entry blocker only after exact approved Human selection proof, source-state/hash/epoch reconciliation and a fresh target run are verified. Keep synthetic `FED-QA-*` fixtures unable to obtain production authority.
2. Acquire one `FileShare.None` lock before consuming authority or reserving dispatch. Keep the **same open handle** through target/run binding, browser request, actual Codex browser transaction, result or uncertainty classification, complete journal flush/snapshot read-back and terminal/active decision. Do not approximate this with separate helper calls. Release last.
3. Before browser dispatch, durably bind `EXECUTION_CONTEXT_ID`, `CAUSAL_LINEAGE_ID`, exact role/scope/owning Page Chat when applicable, `TOWER_ID`, `CONTROL_TOWER_INSTANCE`, Project and conversation ID/title/URL, target `RUN_ID`, epoch, activation/probe transaction, round 1 and `COMMAND_ID=<RUN_ID>:1`, source record hash, and no competing active authority. The Human approval must refer to this exact reviewed scope and target. The current FAST-CLOSE DIRECTIVE is not that approval.
4. Emit only a bounded action request from the lock holder. Codex rechecks the exact visible target immediately before every send, follows Bridge v1 grammar/delivery rules and returns the observed result/uncertainty. The helper checks identities, immutable intent and state transitions, rejects stale/replay/mismatch, and records bounded metadata/hashes. It never accepts `TRANSPORT_SOURCE` or another caller marker as proof of browser origin. The Control Tower evaluates the actual browser exchange independently of helper stdin.
5. A command accepted without a durable outcome remains `EXECUTION_UNCERTAIN`; uncertain delivery remains `DELIVERY_UNCERTAIN`. Neither timeout, process death nor restart permits resend or proof reuse. Reconcile journal/snapshot/handoff and pending intent under the lock after restart. Preserve lineage, budgets, freezes, consumed Human proofs and blocker ancestry.
6. Demonstrate with focused tests that a competing process cannot acquire executable authority for the same execution context while the lock holder waits for and records a real Codex browser round. A mere lock-file presence or two separate helper calls is insufficient. No `ACTIVE` claim follows from a fabricated stdin observation or a Control Tower assertion without the actual bound browser round.

The helper validates repository authority and transaction identity; it does not authenticate ChatGPT UI content from PowerShell. The browser observation and Control Tower evaluation are the external evidence surface of this architecture. That trust split is a deliberate limit: a forged local caller input must not by itself consume a Human approval, grant a different tower authority, or mark RC1/RC2 PASS. If the existing proof chain and held lock cannot preserve those properties, stop on material safety condition A, B or C before live activation.

## Required sequence and boundaries

The next step is the existing separate Human implementation-correction authorization, limited to the three owner paths above and focused synthetic/local tests. The pre-label-completion packet SHA-256 was `8680918c505951b733e91b4404d301b0e305d15a1fc405c55ec9791b9a5e0137`. `GATE_LABEL_STATUS=GATE_READY`; packet status remains `AWAITING_HUMAN_AUTHORIZATION`. The exact, one-to-one Human labels and result tokens are:

| Decision              | Exact Human label                                                  | Normalized result token                                            |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Authorize             | `AUTHORIZE BUILT IN BROWSER HELPER BINDING CORRECTION`             | `AUTHORIZE_BUILT_IN_BROWSER_HELPER_BINDING_CORRECTION`             |
| Request scope changes | `REQUEST BUILT IN BROWSER HELPER BINDING CORRECTION SCOPE CHANGES` | `REQUEST_BUILT_IN_BROWSER_HELPER_BINDING_CORRECTION_SCOPE_CHANGES` |
| Defer                 | `DEFER BUILT IN BROWSER HELPER BINDING CORRECTION`                 | `DEFER_BUILT_IN_BROWSER_HELPER_BINDING_CORRECTION`                 |

Approval of this packet is **not** runtime `LIVE_TOWER_SELECTION` authority. After correction evidence is reviewed, a separate exact Human selection gate must bind one tower/context/run and authorize one read-only RC1 plus concurrent RC2 lock proof. No general activation, second live round, Phase 6 QA, or T18/T19 PASS is implied. Fresh T18 and T19 reassessments retain their earlier FAIL reports as history. Only independent PASS/PASS can open the Phase 6 Human Gate.

For any blocker, perform one bounded diagnosis, one correction attempt and one revalidation, then stop if it remains. Reopen planning only for material duplicate command/Human-authority consumption (A), Human Gate bypass or forgery (B), or simultaneous executable tower authority (C). If Codex built-in browser itself cannot complete RC1, report one bounded `BLOCKED` result and do not pivot to Chrome/Playwright.

No implementation, runtime state, tower activation, RC1/RC2 test, T18/T19 rerun, Browser QA, commit, push, PR, deploy, sync or archive is authorized by this intake packet.

## Human implementation decision

The current Human supplied the exact `AUTHORIZE BUILT IN BROWSER HELPER BINDING CORRECTION` decision. Codex relayed `CURRENT_USER_DECISION=AUTHORIZE_BUILT_IN_BROWSER_HELPER_BINDING_CORRECTION` in Bridge round `153`, command `BRIDGE-ARCH-20260925-F9R2:153`, bound to this packet's immutable preapproval SHA-256 `af7ec52e680bfad29668cc6885c0a0209b7c6ccb4ee9c366c116c8362998f7f1`. Control Tower round `154` authorized only the bounded correction and focused local tests described here. This review metadata is not runtime `LIVE_TOWER_SELECTION` authority or evidence that RC1/RC2, T18/T19, Phase 6, Browser QA, or Gate 3 passed.
