# Tasks / Pre-Apply Planning Review — Control Tower Bridge Protocol v1

Change: `control-tower-bridge-protocol-v1`  
Gate: `Tasks / Pre-Apply`  
Historical Tasks/TIC review status: `APPROVED`  
Current reconciled Tasks/TIC review status: `APPROVED`  
Created: `2026-09-25T14:25:02Z`  
Schema: `yuta-spec-driven`  
Design decision: explicit current-user `APPROVE DESIGN`  
Approval source: explicit current-user `AUTHORIZE APPLY` for the exact reviewed Tasks/TIC  
Approval recorded by: Codex workflow  
Approved: `2026-09-25T14:44:13Z`  
Apply: `AUTHORIZED`, bounded to T01–T11 and the reviewed implementation allowlist

## Authority and exact integrity

| Artifact                                                                                               | SHA-256                                                            | Status                                                     |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| `openspec/changes/control-tower-bridge-protocol-v1/proposal.md`                                        | `5181be8b42c81789c3a440fe662b66507d2abac80cdc94eb8031ddaa78d2db7e` | Gate 1 approved; unchanged                                 |
| `openspec/changes/control-tower-bridge-protocol-v1/analysis.md`                                        | `aad61b1b4b3e66552a2194687e392c14f127b0461ed212f672c58a46238d5d18` | Gate 1 approved; unchanged                                 |
| `openspec/changes/control-tower-bridge-protocol-v1/specs/tooling/control-tower-browser-bridge/spec.md` | `b6784468976d1637f0223cc87c9c0c49e5e929757ff28353465419eaeb192be8` | Gate 2 approved; unchanged, 19 Requirements / 41 Scenarios |
| `openspec/changes/control-tower-bridge-protocol-v1/design.md`                                          | `6c7382b31d311ff658e2126460c7a86e6c29544922c97ad1e86f9670356a7a19` | Design approved; exact reviewed bytes                      |
| `docs/reviews/control-tower-bridge-protocol-v1/02b-design-review.md`                                   | `ffc736ba218d64d16a23070e08c0520b348c3b323029e15d1dfda18ae7212b73` | Approval metadata recorded; embedded Design unchanged      |
| `openspec/changes/control-tower-bridge-protocol-v1/tasks.md`                                           | `d221bfe7fd07e8bc173c9f3529a0a47f25dad1f1de57bf0e8b5a6706e0323009` | New planning candidate; 11 unchecked tasks                 |

SHA-256 values are lowercase hashes of exact file bytes. This packet records the Tasks hash without editing the approved Proposal, Analysis, Spec or Design. The Design approval binds the earlier reviewed Design and preapproval packet hashes recorded in `02b-design-review.md`.

## Planning decision for review

One `Integration / Regression` phase contains tasks 1.1–1.11 and one embedded `TECHNICAL IMPLEMENTATION CONTRACT`. It limits repository implementation to a new `.agents/skills/yuta-control-tower-bridge/SKILL.md` and one minimal Bridge Mode section in `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`. Tasks/review records are workflow artifacts. No Product runtime, API, schema, auth, shared UI, Page Chat prompt or Workflow v3 authority edit is planned.

Tasks cover target and Page Chat authority; exact handshake/command/result grammar; run/round/command identity and at-most-once binding; Human Gate and evidence; six delivery states and bounded recovery; the tracked prompt section; static trace to 19 Requirements / 41 Scenarios and 13 Design Decisions; checks; manual live Project handoff; and scoped diff review. Every task remains unchecked. `UI_AFFECTING: NO`; Product UI QA is `NOT_APPLICABLE`; bridge transport Browser QA is `REQUIRED`.

The owning Page Chat remains Product/shaping authority for `PAGE_LOCAL`; `CROSS_MODULE`/`UNCERTAIN` escalate under YUTA Workflow v3. Control Tower is the single browser bridge gateway and coordinator, without new Product authority. Codex does not access Page Chat directly. No parser service, separate retry framework, background ledger or hardcoded historical conversation URL is planned.

## Later evidence and stop

After separately authorized Apply, formal Technical Compliance/VERIFY and all 24 Design Browser QA cases need independent evidence. The Project administrator must apply the reviewed Bridge Mode section manually to live ChatGPT Project instructions. A tracked prompt hash or administrator attestation alone does not prove live behavior. Gate 3 cannot be ready while `LIVE_BRIDGE_MODE` is `NOT_VERIFIED` or `OUTSIDE_REPOSITORY_CONTROL`; live config and a real handshake → command → result must be observed. The 24 cases include target, protocol/identity, multi-round, Human Gate, delivery/no duplicate, Page Chat authority, context states, discrepancy, live verification and scope. Safe non-reproducible cases require an honest blocker or limitation, not a fabricated PASS.

The post-Apply development feedback controls are `REQUIRED` because this change is pre-Apply after the adoption event. The Tasks contain only a prospective record: candidate `NONE`, no verdict or QA result. Commit, push, PR, merge, deploy, release, destructive action, live Project update, Browser QA, sync and archive remain outside this planning approval.

## Planning validation

| Check                                                                                                         | Result                                                    |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `pnpm exec openspec validate control-tower-bridge-protocol-v1 --type change --strict --json --no-interactive` | PASS; one valid change, zero issues                       |
| `pnpm docs:check`                                                                                             | PASS; 36 current documents                                |
| `pnpm architecture:check`                                                                                     | PASS                                                      |
| Scoped Prettier check for Design packet and Tasks                                                             | PASS                                                      |
| Typecheck, tests, build, Browser QA, formal VERIFY                                                            | NOT_RUN; planning-only scope, no implementation candidate |

Unrelated dirty and untracked checkout work remains outside this change and was not modified for this review. The current user subsequently authorized Apply for the exact Tasks hash above. This authorization does not approve live Project update, Browser QA, VERIFY, Gate 3, sync/archive, commit/push/PR/merge/deploy/release, or an expansion of the two-file implementation boundary.

## Targeted Tasks/TIC live-target reconciliation — current review candidate

Current review status: **AWAITING_HUMAN_REVIEW**. The `APPROVED` metadata and hashes above record the historical pre-Apply Tasks/TIC decision only. They do not approve the revised `tasks.md` bytes. The current user authorized the bounded target correction after Control Tower run `BRIDGE-CONSISTENCY-20260925-5E9B`; a fresh Human Tasks/TIC approval is required because T10/T11 and live acceptance now identify a different live target. Gate 1 and Gate 2 remain approved and byte-unchanged; the revised Design must also be approved before T11 or formal Technical Compliance resumes.

Current revised Tasks/TIC SHA-256: `7587f67d402ba5b2a9b8c8550ff1fa7af24907f79506e4fa0829e4772f4ddf99`. Current revised Design SHA-256: `0eaf28a915144e754b5507a2a15a203f92185dab0adb786ad44ed3e5d6f3d807`. Historical pre-Apply Tasks SHA-256: `d221bfe7fd07e8bc173c9f3529a0a47f25dad1f1de57bf0e8b5a6706e0323009`.

T01–T09 implementation evidence and the two-file owner boundary are unchanged. T10 remains checked because a corrected handoff is recorded in `02d-apply-evidence.md`; its former instruction to install the full section in global Project Instructions is superseded. T11 remains unchecked. The full Bridge Mode belongs only to the operating context of the selected **YUTA — Control Tower** conversation; global Project Instructions contain shared rules and may contain a short authority/routing boundary only. Page Chats do not receive the protocol or lose `PAGE_LOCAL` Product/shaping authority. Tracked prompt bytes do not establish live activation. The observed `BRIDGE-LIVE-20260925-7F6C` round is historical runtime evidence pending re-evaluation against Human-approved revised artifacts, not formal VERIFY or the 24-case Browser QA.

Revised TIC acceptance requires `LIVE_CONTROL_TOWER_BRIDGE_MODE = VERIFIED` in the exact Control Tower conversation before Gate 3 readiness, with target, protocol v1 identity/grammar, fail-closed behavior, and fresh handshake → valid command → bound result → evaluation evidence. It does not require full protocol parity in global Project Instructions. The older `LIVE_BRIDGE_MODE = NOT_VERIFIED`, `DEV_USABLE = NO`, and `MANUAL_TEST_READY = NO` statements above are historical pre-update observations, not current verdicts; no current usability re-assessment or formal gate verdict is made here. The corrected handoff, Design and Tasks/TIC await Human review. No skill, tracked prompt, Product code, Workflow v3 or Page Chat rules changed in this reconciliation.

Human review question after revised Design approval: **APPROVE REVISED TASKS/TIC**, **REQUEST TASKS CHANGES**, or **DEFER TASKS** for the revised exact Tasks bytes reported with this packet. Earlier `AUTHORIZE APPLY` does not transfer to the new planning hashes.

## Revised Tasks/TIC decision — 2026-09-25

The current user explicitly chose `APPROVE REVISED TASKS TIC` for Tasks/TIC SHA-256 `7587f67d402ba5b2a9b8c8550ff1fa7af24907f79506e4fa0829e4772f4ddf99` after revised Design approval. The preapproval Tasks review packet was SHA-256 `95083b80b4ace4d54a1659a737436eb8c66ce13ba656f2323aa1863e7336f310`. This addendum records the decision; the preceding `AWAITING_HUMAN_REVIEW` section is historical. The earlier `AUTHORIZE APPLY` covered T01–T11 under the original planning bytes; the current user's targeted reconciliation requested review before T11 resumes. The revised approval permits the bounded T11 re-evaluation under the fresh Control Tower command, not a wider implementation, live configuration edit, formal VERIFY, Browser QA, or Gate 3 approval.
