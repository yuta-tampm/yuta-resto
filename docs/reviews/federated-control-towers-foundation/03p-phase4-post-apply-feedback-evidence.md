# Federated Control Towers — Phase 4 Post-Apply Development Feedback

Change: `federated-control-towers-foundation`  
Scope: T15–T17 only  
Phase 4: `COMPLETE` for the approved synthetic local candidate; progress 17/24  
Technical Compliance / formal VERIFY / Federated Browser QA: `NOT_RUN`  
Gate 3: `NOT_READY`

## Authorization and candidate binding

The current user chose exact `AUTHORIZE APPLY PHASE 4` (`AUTHORIZE_APPLY_PHASE_4`), relayed in Bridge round 119. The valid bounded execution command was `BRIDGE-ARCH-20260925-F9R2:120`. The preapproval `03n-phase4-post-apply-feedback-authorization-gate.md` bytes hash to `4709f2c027356baa4873cf0523ae32d4dbe993cc7a505ac7a747e479c1012a00` and remain byte-for-byte after the prepended decision record; the updated packet hashes to `6f57cdbee503b722789567ad398b62cc8976f57f9bbf77305ad1ab784b8f22a9`. The Phase 3 candidate evidence `03m-phase3-apply-evidence.md` hashes to `82581353840e04c3a6f26822d6a95f45f2e0b0ade9df30211f00b78f0b8763ca`.

Pre-Phase-4 Tasks SHA-256: `5b74dd81ba7bc52b91affa66bf5e7232912493a2ac0e726f99973690fb9299b9`. Post-assessment Tasks SHA-256: `f64382b3d0c844f9430b9f5b89f3be3b100af56a8ede6307cb01a2311458b3f8`. The owner baseline was rehashed before mutation and remained unchanged after assessment:

| Implementation owner                                                    | SHA-256                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `.agents/skills/yuta-federated-control-towers/SKILL.md`                 | `38c3e5d4e3f292b4892037882ccce8fbeea0836ff091b5741caa86684fb617d5` |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` | `c8a9086991bb4dd9e43be006bb80c3a1a27e1af5679d340e317272bb63c12719` |
| `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`      | `e1b01038052e359653a919ec6dc98fef92cde7e38739fed181bf40d9d9b16f66` |

Approved Design, Spec and Bridge v1 skill hashes also matched `03n` before mutation. The Bridge v1 skill remained `149e48785980fd16affbade76e7c50957b6ae5f0e7e5f71954f19f4d8031aa3e`. No Bridge v1 QA status or authority semantics changed.

## T15 — DEV_USABLE

Applicability `YES`; workflow result `YES`; bounded command result `PASS` for the approved single-host synthetic local developer path. Exact runtime: `D:\working\yuta\yuta-resto`, Windows host `DESKTOP-2SON6M9`, NTFS, PowerShell 7, approved helper path, fresh `FED-QA-P4-20260926-K7R2` context. `Preflight` returned `Valid=true`, exact checkout and host, no state or lock creation. `DescribeSchemas` returned Phase 3, read-only and synthetic action groups, `LiveExecutableAuthority=false`. The helper parsed successfully and `SelfTest` returned `Passed=true`, 83 checks, zero failed, no canonical runtime state or live activation.

Observed local sequence, each using the exact helper with `-ExpectedCheckoutRoot`, `-ExpectedHostLabel`, and `-ExecutionContextId`: `InitializeFixture` revision 0; Page `AdvanceFixture ACTIVATING` revision 1; `RecordFixtureProbe` durable intent/outcome; `AdvanceFixture ACTIVE` revision 4; `FENCING` revision 5; `TERMINAL` revision 6; `ReconcileFixture` revision 6. Then `PersistFixtureHandoff` with explicit `PAGE_CONTEXT_INTAKE=UNKNOWN`, source gap and fresh Global run; Global `ACTIVATING` revision 9; probe intent/outcome; `ACTIVE` revision 12; `FENCING` revision 13; `TERMINAL` revision 14; `ReconcileFixture` revision 14. Every returned `ExecutableAuthority=false`. The snapshot retained one lineage `FED-QA-P4-20260926-K7R2-LINEAGE`, recovery attempts 0, empty evaluator buckets, current active freezes and consumed proofs present as arrays. `LockProbe` acquired and released the lock after previous calls. Reusing the consumed handoff failed with `BLOCKED: handoff already consumed`.

The exact state is inspectable under the ignored `tmp/yuta-federated-control-towers/FED-QA-P4-20260926-K7R2/` path. The terminal fixture and lock file were retained as evidence; no deletion or force reset occurred. The test used synthetic `QA-*` target identifiers and caller-supplied probe metadata, not actual ChatGPT traffic. The path is usable for a developer to exercise local transition, fence, handoff, recovery and negative behavior. It cannot establish live tower/browser operation, real target observation, actual delivery uncertainty, or Q01–Q35.

## T16 — MANUAL_TEST_READY

Applicability `YES`; workflow result `YES` for the same synthetic local candidate. The Human-usable handoff is `03o-phase4-manual-test-handoff.md`, SHA-256 `7e7a28afcab60b1a23ef707ef66ce9af76057a92674d47a7d4b35b68ac324ae1`. It supplies exact host/checkout requirements, helper invocations with fresh synthetic Page/Global identity, setup, activation/probe, fence, Page-to-Global transfer, terminal reconciliation, lock probe, inspection of budgets/freezes/consumption proofs, stop/retry rules, and the absence of an authorized destructive cleanup. It distinguishes synthetic manual testing from later live Browser QA. Its flow follows the Phase 4 observed invocation pattern; no live manual browser QA was performed in this phase.

## T17 — Human Product/operator validation applicability

Applicability `NO`; verdict `NOT_APPLICABLE`; T17 assessment complete. The as-built candidate is a synthetic, non-live helper and tracked operating protocol. Its remaining acceptance questions are objectively testable lock, state, protocol, target, handoff, privacy and browser behaviors under later independent Technical Compliance, VERIFY and Browser QA. The manual handoff requires technical operation but no subjective Product or operator choice to progress toward Phase 5. A pending live QA case is not converted into a Product verdict. No new Human Product Gate or inferred `ACCEPTED` verdict was created. `HUMAN_PRODUCT_VALIDATION_QUESTION=NOT_APPLICABLE`; authority owner `NOT_APPLICABLE` for this assessment. Any later actual PAGE_LOCAL Product/shaping decision remains with its owning Page Chat; `PAGE_CONTEXT_INTAKE=UNKNOWN` in the synthetic handoff does not imply absence of prior Page requirements or supply them.

## Checks, scope and limitations

Commands/results: PowerShell helper parser `PASS`; helper `Preflight` `PASS`; `DescribeSchemas` read-only `PASS`; `SelfTest` 83/83 `PASS`; isolated synthetic Page/Global transition and replay rejection `PASS`; `pnpm exec openspec validate federated-control-towers-foundation --strict` `PASS`; `pnpm docs:check` `PASS` (36 current documents); `pnpm architecture:check` `PASS`; `pnpm -r --if-present typecheck` `PASS` (15 workspace projects); scoped Prettier `PASS`; scoped `git diff --check` `PASS` for tracked paths, with untracked-file visibility limitation. No repository-wide `format:check`, build, formal Technical Compliance, VERIFY or Browser QA was run. No Product code or implementation owner was edited.

Anti-loop material A/B/C threshold: no new known duplicate command/Human-authority consumption, Human Gate bypass, or dual executable tower issue in this bounded assessment. Synthetic `AUTHORIZATION_REFERENCE` fixture metadata is not a live Human Gate proof. The helper's fixture-only reference may contain a historical Tasks hash; current candidate identity is bound separately above and no executable authority is granted by that metadata. No planning reconciliation is opened. Historical Phase 1–3 and any prior FAIL/BLOCKED evidence remain historical; this assessment does not relabel them.

Changed repository paths for Phase 4: `openspec/changes/federated-control-towers-foundation/tasks.md` (T15–T17 and feedback), `docs/reviews/federated-control-towers-foundation/03n-phase4-post-apply-feedback-authorization-gate.md` (prepended decision), `docs/reviews/federated-control-towers-foundation/03o-phase4-manual-test-handoff.md` (new), and this `03p-phase4-post-apply-feedback-evidence.md` (new). One new ignored `FED-QA-*` synthetic context was created and retained. Unrelated dirty/untracked work was preserved. Live tower/browser operations and Page Chat access were `NOT_RUN`. Phase 5 is eligible only for a separate Human authorization; T18–T24 remain unchecked. Gate 3 is `NOT_READY`.
