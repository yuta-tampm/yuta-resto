# Tasks / TIC review — Federated Control Towers foundation

Change: `federated-control-towers-foundation`  
Gate: `Tasks / Pre-Apply`  
Review status: `APPROVED`  
Approval source: explicit current-user `APPROVE TASKS TIC`, relayed in bridge result `BRIDGE-ARCH-20260925-F9R2:14`.  
Approved: `2026-09-25T23:37:26+02:00`  
Pre-approval packet SHA-256: `a2e77e87ee1ec460a5328d89b8202c9ff7e4b0709b12b2c63cfb95fe44a14704`.  
Approval scope: Tasks/TIC planning only; `AUTHORIZE APPLY PHASE 1` requires a separate explicit current-user decision.  
Apply: `NOT_AUTHORIZED`  
Implementation / formal VERIFY / federated Browser QA: `NOT_RUN`  
Gate 3: `NOT_READY`

## Reviewed authority and exact bytes

| Artifact                                                                                                       | SHA-256                                                            | State                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/reviews/federated-control-towers-foundation/01-analysis-review.md`                                       | `72d62468666dc3a2962b33e390f436028eb27f2cce43d8deaa167298448eaa25` | Gate 1 approved                                                                                                                                                     |
| `docs/reviews/federated-control-towers-foundation/02-specs-review.md`                                          | `46b69d158eca331fa4dbbdf70ab1f5a617eab2fee02d364065e0ee542372de20` | Gate 2 approved                                                                                                                                                     |
| `openspec/changes/federated-control-towers-foundation/specs/tooling/federated-control-tower-transport/spec.md` | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | 14 Requirements / 39 Scenarios, unchanged                                                                                                                           |
| `openspec/changes/federated-control-towers-foundation/design.md`                                               | `5235f719d253e487766f5e6fb6302183ed17a3eaa9b2ad52208c0f7336608ec9` | revised Design approved, unchanged                                                                                                                                  |
| `docs/reviews/federated-control-towers-foundation/02-design-review.md`                                         | `7c645be5325c4576782a44dd472742712807bcc1b07e75dea0f9b364e2d9d5ae` | normal Design approval history                                                                                                                                      |
| `docs/reviews/federated-control-towers-foundation/02b-design-review.md`                                        | `2eec7f8a2222e3d44b2e785ab3a791805b6681c3877f360e9910116ee7eb87c5` | current-user separate `APPROVE SENSITIVE DESIGN` recorded; pre-approval packet SHA-256 `ec154e28892d5798f2e7699b48ebe7467539a38a98c688bad7f0411313735e3b` preserved |
| `openspec/changes/federated-control-towers-foundation/tasks.md`                                                | `6e022cfbb1cacef0464888a4974a86cb379e80d17b856423ab40a2d83fe723a6` | 24 unchecked tasks; embedded TIC approved for planning, Apply not authorized                                                                                        |

The explicit current-user Sensitive Design approval was relayed in bound bridge result `BRIDGE-ARCH-20260925-F9R2:12`. It permits this Tasks/TIC planning only. The earlier `REQUEST DESIGN CHANGES`, normal revised Design approval and historical Sensitive packet remain preserved; this packet does not reinterpret those decisions.

## Phase and requirement coverage

| Phase                       | Tasks   | Count | Primary requirements / Design | Boundary and evidence                                                                     |
| --------------------------- | ------- | ----: | ----------------------------- | ----------------------------------------------------------------------------------------- |
| 1. Foundation / Data        | 1.1–1.4 |     4 | F1–F4, F11–F14; D1/D2/D7/D8   | Static owner sources, schema and read-only validation; no activation                      |
| 2. Foundation / Data        | 2.1–2.5 |     5 | F4–F11, F13; D2–D6            | Single-host lock, durable state, journal, handoff, crash fixtures; local only             |
| 3. Integration / Regression | 3.1–3.5 |     5 | F1–F14; D1–D8                 | Exact target, controlled activation/fence/escalation/rotation; authorization required     |
| 4. Integration / Regression | 4.1–4.3 |     3 | F1/F13/F14; D8                | Candidate-specific DEV_USABLE, MANUAL_TEST_READY and conditional Human Product validation |
| 5. Integration / Regression | 5.1–5.2 |     2 | F1–F14; D1–D8                 | Independent Technical Compliance and formal VERIFY                                        |
| 6. Integration / Regression | 6.1–6.5 |     5 | F1–F14; D1–D8                 | Independent real Q01–Q35 Browser QA, no Gate 3 self-approval                              |

All tasks are unchecked. Each checkbox names an observable completion check. Each phase embeds a `TECHNICAL IMPLEMENTATION CONTRACT` in the existing `tasks.md`; there is no new OpenSpec TIC artifact. The full Tasks/TIC text is bound by the exact SHA-256 above, not duplicated here.

## Exact implementation owner and side-effect boundary

Tracked owners proposed for later authorized Apply only:

1. `.agents/skills/yuta-federated-control-towers/SKILL.md`;
2. `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`;
3. `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`.

Ignored local runtime state is limited to `tmp/yuta-federated-control-towers/<EXECUTION_CONTEXT_ID>/` and Design D2–D5 `lock`, `activation.json`, immutable handoff/journal and same-directory temporary records. It is **not created now**. Change/review/QA records are evidence owners, not Product implementation. Existing Bridge v1 skill/prompt/QA are outside the implementation allowlist. No Workflow v3, Page Chat prompt/rules, global Project Instructions, Product code/UI, API, auth, schema, business logic, provider control or deployment owner is added.

All federation executors for one context must use the same helper and one canonical NTFS checkout on one Windows host. A second host/checkout, bypassed helper, uncertain lock owner, corrupt/missing journal, conflicting `ACTIVE`, unsupported filesystem semantics or changed owner path means fail closed. There is no distributed or cross-host atomicity claim. A live tower, ignored state or browser send requires the precise later phase and Human/workflow authority; approval of this plan alone grants none.

## TIC, verification and risk review

- **Authority:** `PAGE_LOCAL` Product/shaping stays with owning Page Chat; `CROSS_MODULE`/`UNCERTAIN` coordinates through Global under Workflow v3. Codex only executes and collects evidence. Role/handoff does not grant Product, Human Gate, recovery-budget or side-effect authority. Exact Project/title/URL/conversation identity is checked before send.
- **Protocol:** unchanged Bridge v1 handshake/command/result grammar. Local `COMMAND_ID→RUN_ID→RUN_BINDING→epoch→instance` rejects stale/replayed work, including old run in same chat. Result A never binds command B. Prose, malformed/partial blocks and uncertain delivery are non-executable; timeout alone never permits resend.
- **Durability:** old authority ends at verified `ACTIVE→FENCING` commit; new authority begins only at verified `ACTIVATING→ACTIVE` commit after terminal old run, handoff, exact target and read-only probe. Immutable hashed handoff with fresh run is evidence, not authorization. Journal intent/outcome supports at-most-once; missing outcome is `EXECUTION_UNCERTAIN`, not retry authority. Restart/rotation never reset causal lineage, blockers or budgets.
- **Privacy:** only bounded IDs, title, references, hashes and Page-context provenance metadata; no credentials, cookies, tokens, sessions, full transcripts, customer content or provider secrets. Local access/retention and context-close cleanup remain constrained; no destructive cleanup is authorized.
- **Tests:** use existing repository tooling and bounded fixture/process tests for schema, lock contention, epoch, replay, handoff, crash windows and privacy. No new framework or test owner is approved. Static/helper tests are implementation evidence, separate from formal VERIFY and real Browser QA.
- **Development feedback:** safe dev context and non-destructive Page/Global test conversations are required for actual `DEV_USABLE` assessment; Human handoff must give setup, flow, reset/retry and limitations. `HUMAN_PRODUCT_VALIDATION` applicability follows as-built Product/operator judgement per workflow; no default `ACCEPTED` or unsupported N/A.
- **Stop triggers:** new credential/transcript storage, auth/provider change, destructive operation, cross-host coordination, same-RUN switch, new executable grammar/field, Workflow v3/Page Chat authority change, new owner/framework or unresolved lock/state/target/outcome returns `NEEDS_REVIEW` or `BLOCKED` before expansion.

Bridge v1 Browser QA remains `PAUSED` and `BLOCKED_BY_ENVIRONMENT` at 16 PASS / 6 PARTIAL_EVIDENCE / 2 NOT_RUN, Gate 3 NOT_READY. Its report SHA-256 is `6a3a7979b64617cb30d162f5a6e5ca853ad26d2bd084f01339023e8f475c8d83`; it is historical independent evidence, not federation acceptance.

## Federated QA obligations

Phase 6 maps all approved Design cases: Q01–Q10 activation/fencing/role routing/rotation; Q11–Q22 crash windows, corrupt state, lock and unsupported host/checkout; Q23–Q35 handoff, replay, lineage, Human Gate, target, genuine delivery uncertainty, ledger, four Page-context states, discrepancy, authority, Bridge v1 isolation, live Page/Global protocol and privacy. Each requires its own real browser/local evidence, exact target/epoch/run and relevant state/handoff/journal hashes. Fixtures/prose cannot establish runtime PASS. Human must supply safe exact targets and apply tracked instructions to those conversation operating contexts; repository bytes do not auto-sync live.

## Historical exact questions for Human Tasks/TIC review

1. Implementation-owner allowlist có tối thiểu và đúng không?
2. Ranh giới một Windows host/một NTFS checkout/một helper có đủ rõ không?
3. Các phase lock, activation state, epoch, handoff và ledger có tách an toàn không?
4. Live activation và side effect của ignored runtime state đã được gate đủ chặt chưa?
5. Page→Global escalation và rotation có tránh dual execution không?
6. Crash recovery và `EXECUTION_UNCERTAIN` stop có đủ không?
7. Causal lineage và recovery/evaluator budget có được giữ qua transfer/restart không?
8. Privacy restrictions và dữ liệu cấm lưu đã đủ chưa?
9. Các `NEEDS_REVIEW` triggers có bao phủ scope expansion chưa?
10. Bridge v1 owner và QA isolation có được giữ không?
11. `DEV_USABLE`/`MANUAL_TEST_READY` nghĩa vụ có đúng workflow không?
12. `HUMAN_PRODUCT_VALIDATION` có được đánh giá theo as-built thay vì giả định không?
13. Formal VERIFY có tách khỏi implementation checks không?
14. Contract Browser QA Q01–Q35 có đầy đủ và độc lập không?
15. Automated tests/helper dự kiến có nằm trong existing tooling/approved owner không?
16. Sau khi duyệt riêng Tasks/TIC, Human có cho phép bắt đầu **Apply Phase 1** với ranh giới tĩnh, chưa live activation, hay yêu cầu sửa/hoãn?

Historical pre-approval state was `AWAITING_HUMAN_REVIEW` at the exact packet hash above. The current user has approved these Tasks/TIC; no implementation phase is authorized by that decision. Do not infer Apply approval from this packet, OpenSpec planning completion, passing document checks or a matching hash.

## Validation and known evidence limits

Planning validation: `pnpm exec openspec validate federated-control-towers-foundation --strict` PASS; `pnpm docs:check` PASS (36 current documents); `pnpm architecture:check` PASS; scoped `pnpm exec prettier --check` PASS after formatting this packet. Tasks checkbox count and packet hash are rechecked separately after formatting. `pnpm -r --if-present typecheck`, implementation tests, formal VERIFY and Browser QA were not run: no implementation owner changed, and this command authorizes planning validation only.

Planning changed only the Sensitive Design review status, new `tasks.md` and this review packet. No implementation owner, local state, live tower, Page Chat, Bridge v1 owner or QA evidence was touched. No federation lock, activation, fencing, handoff, ledger, crash safety, atomicity, live target or Browser QA outcome has been demonstrated.
