# Phase 2 Apply evidence — Federated Control Towers foundation

Change: `federated-control-towers-foundation`  
Scope: separately authorized Phase 2, T05–T09 only  
Status: local synthetic implementation complete; awaiting Human review before Phase 3  
Formal Technical Compliance: `NOT_RUN`  
Formal VERIFY: `NOT_RUN`  
Federated Browser QA Q01–Q35: `NOT_RUN`  
Live Page/Global tower activation: `NOT_PERFORMED`

## Integrity and attribution

Before Phase 2, the approved Tasks/TIC SHA-256 was `2d950bb8adf260e49768a77b3991b0ca923f15d3b7bf6715b59906de2ef12b35`, Design was `5235f719d253e487766f5e6fb6302183ed17a3eaa9b2ad52208c0f7336608ec9`, and the Phase 1 evidence was `2d0256e0d17b25e2c87154f6bf467b2e46c2450511fd892abaf7ee2b1418c329`. The three owner baselines were:

| Owner                                                                   | Before Phase 2 SHA-256                                             | After Phase 2 SHA-256                                              |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `.agents/skills/yuta-federated-control-towers/SKILL.md`                 | `58272d40f76b165d366c4f3dda8d5b6da492bf9a0817baae34578a9c13238b3a` | `ea899fb71f9ecb64f68df425bd07c1240b1d580ee765fdc679b5fae2158195ff` |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` | `3ab80a304ab8393061d4766addaaf53a3cca9e946ba56a057d498924dcbab88b` | `5d676f5c4a21496aa79aa47a212291ba491230d3d75fa66927ca2b3f1113c825` |
| `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`      | `44119d894dfe16396a72bd305cef29601a462bef9b2d63c9fc96aa0246026eee` | `88ea3f350367cb004ce865d4f04ea0f52611c1fc5fc4ca6e90c91aaef1b612de` |

Phase 2 also changed `openspec/changes/federated-control-towers-foundation/tasks.md` only to record Phase 2 authorization and mark T05–T09 complete (SHA-256 `72ca49334e1cb44c5b30689eeab11d087914797ed25ec2ac63648b36af321897`). This evidence file is the only new tracked review artifact. The three owner files and change/review artifacts were already untracked Phase 1 work in the dirty checkout; Git's HEAD diff cannot reconstruct a Phase 1-to-Phase 2 text diff. The before/after hashes above and scoped content summary below attribute this phase without treating unrelated dirty work as ours.

Progress is 9/24 tasks checked. T10–T24 remain unchecked. The approved Design (`5235f719d253e487766f5e6fb6302183ed17a3eaa9b2ad52208c0f7336608ec9`) and Gate 2 Spec (`a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0`) are byte-identical to their pre-Apply baselines. Bridge v1 skill (`149e48785980fd16affbade76e7c50957b6ae5f0e7e5f71954f19f4d8031aa3e`), tracked Control Tower prompt (`4f65c0c132ebe566c8fc9094582e8cf2c3cfbe784e2fa8f3b8a3915f3fc92558`) and QA report (`6a3a7979b64617cb30d162f5a6e5ca853ad26d2bd084f01339023e8f475c8d83`) are also unchanged.

Synthetic fixture state is ignored beneath `tmp/yuta-federated-control-towers/FED-QA-*/`. At the evidence snapshot there were 39 synthetic context directories and 279 local files. Some intentionally invalid or interrupted fixtures remain for fail-closed evidence. No fixture was promoted to a live context and no runtime cleanup was performed.

## T05–T09 implementation and observed results

| Task | Implemented local behavior                                                                                                                                                                                                                                                                         | Focused evidence                                                                                                                                                                                                                                                                                                                           | Result           |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| T05  | Exact Windows/NTFS/root/helper preflight; exclusive `FileStream(OpenOrCreate, ReadWrite, FileShare.None)` handle held around each local transaction and disposed in `finally`; lock file never deleted for authority.                                                                              | Two PowerShell processes contended on `FED-QA-PHASE2-LOCK`; a second probe was blocked, then succeeded after release. On `FED-QA-P2-LOCK-DEATH`, process termination released the handle, the file remained, and the next probe acquired the handle with `ExecutableAuthority=false`.                                                      | PASS, local-only |
| T06  | Required activation v1 schema, canonical SHA-256, previous-record and previous-event hash chains, immutable journal before snapshot, `Flush(true)`, same-directory move/replace with backup and read-back, strict transitions and epochs.                                                          | Synthetic INACTIVE→ACTIVATING→ACTIVE→FENCING→TERMINAL→ACTIVATING→ACTIVE reached epochs 0→1→2→3 without a live tower. Orphan temp, snapshot/event mismatch, missing journal, duplicate active binding and epoch rollback were blocked.                                                                                                      | PASS, local-only |
| T07  | Exact command/run/round binding through current epoch and instance; accepted/executing/outcome revisions around a synthetic read-only no-op; duplicate and stale round scan; result identity bound to latest command; uncertain outcome and delivery have separate states.                         | Round 1 and 2 completed; skipped round 3 was blocked. Same `COMMAND_ID` replay was blocked. Accepted-only and executing-only restart returned `EXECUTION_UNCERTAIN`; a durable outcome followed by lost result stayed `COMPLETED` with `DELIVERY_UNCERTAIN` and blocked dependent command. Result B identity used for A failed validation. | PASS, local-only |
| T08  | Fresh target run reserved in terminal journal before immutable handoff file; handoff hash bound into journal; exact source/target, lineage, budget, approval and artifact checks; supersede event; once-only consumption at synthetic ACTIVE commit.                                               | `FED-QA-P2-HANDOFF-BOUND-01` consumed once at epoch 3, then replay was blocked. Superseded handoff was blocked. File hash drift, recomputed file hash differing from the journal, and artifact reference drift were blocked. Handoff never set executable authority.                                                                       | PASS, local-only |
| T09  | Restart reopens exact local lock, verifies the complete journal/snapshot chain, handoff directory and hash, run/budget/lineage continuity and privacy schema, then returns a non-executing status or blocks. Existing context is required; a missing context is not created during reconciliation. | Nine final crash-window fixtures below; wrong host/checkout blocked; missing journal and orphan temp blocked; secret/transcript fields rejected in 24 static checks; pre-existing lock-only context cannot be initialized as genesis.                                                                                                      | PASS, local-only |

The PowerShell JSON reader initially normalized some ISO timestamp strings and exposed a real snapshot/journal hash mismatch. The implementation now uses `ConvertFrom-Json -DateKind String` for every persisted record read, preserving exact bytes for canonical reconstruction. Previously inconsistent synthetic fixtures were not repaired or erased; reconciliation blocks them.

The focused artifact checker accepted the current reviewed Design SHA-256 and blocked a deliberately wrong SHA-256. A separate in-memory validator rejected a second distinct `ACTIVE` run binding. Neither check mutated the Design or created live authority.

The Phase 2 helper preserves an empty evaluator bucket array and rejects a nonempty array because the approved Design does not specify a complete nested bucket schema. An in-memory fixture with a nonempty bucket was rejected; another fixture attempting to decrease `RECOVERY_BUDGET.ATTEMPTS_USED` was blocked. Phase 3 must retain this fail-closed behavior unless a reviewed contract specifies and validates nonempty buckets. No budget was reset in persisted runtime state.

### Nine Design D6 crash windows, final helper

All fixtures are `FED-QA-P2-FINAL-WINDOW-01` through `FED-QA-P2-FINAL-WINDOW-09` under the ignored local path. These are synthetic process-crash posture tests, not browser or live tower tests.

| D6 window                                   | Fixture posture                      | Restart result             | Executable authority |
| ------------------------------------------- | ------------------------------------ | -------------------------- | -------------------- |
| 1 before fencing intent                     | old synthetic ACTIVE                 | `RECONCILED_NON_EXECUTING` | false                |
| 2 during fencing write                      | orphan same-directory temporary file | `BLOCKED`                  | false                |
| 3 old TERMINAL before handoff               | terminal, no handoff                 | `RECONCILED_NON_EXECUTING` | false                |
| 4 handoff persisted before ACTIVATING       | terminal, unused immutable handoff   | `RECONCILED_NON_EXECUTING` | false                |
| 5 ACTIVATING before probe                   | reserved run, no probe               | `RECONCILED_NON_EXECUTING` | false                |
| 6 probe started before ACTIVE               | durable probe intent, no outcome     | `PROBE_UNCERTAIN`          | false                |
| 7 ACTIVE after commit before acknowledgment | synthetic ACTIVE                     | `RECONCILED_NON_EXECUTING` | false                |
| 8 COMMAND_ACCEPTED before effect            | accepted intent, no outcome          | `EXECUTION_UNCERTAIN`      | false                |
| 9 effect before outcome                     | executing intent, no outcome         | `EXECUTION_UNCERTAIN`      | false                |

### Commands and checks executed

All local invocations used PowerShell 7.6.5, `-ExpectedCheckoutRoot (Resolve-Path .).Path`, `-ExpectedHostLabel $env:COMPUTERNAME`, the approved helper path, and synthetic `FED-QA-*` context IDs. The nine-window harness called `InitializeFixture`, `AdvanceFixture`, `RecordFixtureProbe`, `PersistFixtureHandoff`, and `RecordFixtureCommand` as specified in the matrix, then called `ReconcileFixture` in a fresh helper invocation for each window. Window 2 wrote only an orphan `activation.json.tmp-orphan` within its own synthetic context. Window 6 used `-ProbeIntentOnly`; windows 8 and 9 used `-FixtureOutcome ACCEPTED_ONLY` and `EXECUTING_ONLY` respectively. Every output had `ExecutableAuthority=false`.

Representative exact commands executed (PowerShell variables shown with their bound values):

```powershell
$p = '.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1'
$root = (Resolve-Path .).Path
$hostLabel = $env:COMPUTERNAME
& $p -Action SelfTest -ExecutionContextId 'FED-QA-P2-FINAL-SELFTEST' -ExpectedCheckoutRoot $root -ExpectedHostLabel $hostLabel
& $p -Action ReconcileFixture -ExecutionContextId 'FED-QA-P2-FINAL-WINDOW-08' -ExpectedCheckoutRoot $root -ExpectedHostLabel $hostLabel
& $p -Action ReconcileFixture -ExecutionContextId 'FED-QA-P2-FINAL-WINDOW-09' -ExpectedCheckoutRoot $root -ExpectedHostLabel $hostLabel
```

The final `SelfTest` returned 24/24 PASS, with no state creation or lock acquisition. The helper parser returned 0 errors. The separate two-process lock checks, handoff drift and result-identity checks were executed with the same approved helper and local fixture root; their observed outputs are summarized above.

## Repository validation and boundaries

| Check                                                                          | Result                                                                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `pnpm exec openspec validate federated-control-towers-foundation --strict`     | PASS                                                                                                    |
| `pnpm docs:check`                                                              | PASS, 36 current documents                                                                              |
| `pnpm architecture:check`                                                      | PASS                                                                                                    |
| `pnpm -r --if-present typecheck`                                               | PASS across applicable workspace projects                                                               |
| `pnpm exec prettier --check` on the three modified Markdown owner/change files | PASS                                                                                                    |
| `pnpm format:check` repository-wide                                            | FAIL on 85 pre-existing out-of-scope files; none of the Phase 2 Markdown files appeared in its warnings |

No Bridge v1 owner or QA record, Workflow v3, Page Chat authority/rules, Product code, API, auth, database/schema, business logic, deployment configuration or live ChatGPT context was changed. No federation browser traffic, Page Chat access, real activation, escalation, rotation, commit, push, PR, merge, deploy or release occurred. The supported boundary remains one Windows host, one NTFS checkout and all participating executors using this helper. The local fixture results do not establish live single-active behavior, formal Technical Compliance, formal VERIFY, Q01–Q35 Browser QA, DEV_USABLE, MANUAL_TEST_READY or Gate 3 readiness. Phase 3 requires new explicit Human authorization. No `NEEDS_REVIEW` scope expansion was taken.
