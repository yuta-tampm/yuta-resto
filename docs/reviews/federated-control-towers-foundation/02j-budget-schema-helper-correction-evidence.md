# Budget schema helper correction — bounded revalidation evidence

Change: `federated-control-towers-foundation`  
Authority: current Human `AUTHORIZE BUDGET SCHEMA HELPER CORRECTION`, relayed through YUTA Control Tower command `BRIDGE-ARCH-20260925-F9R2:30`  
Scope: the Phase 2 local helper owner and synthetic ignored QA contexts only  
Correction disposition: `PARTIAL_NEEDS_REVIEW`; default-bound synthetic cases pass, but positive Human exception handling and material-review semantics are not fully demonstrated  
Helper convergence precondition for Phase 3: `NOT_MET`  
Phase 3 T10–T14: `NOT_AUTHORIZED`  
Formal Technical Compliance: `NOT_RUN`  
Formal VERIFY: `NOT_RUN`  
Federated Browser QA Q01–Q35: `NOT_RUN`  
Live Page/Global activation: `NOT_PERFORMED`

## Attribution and source integrity

| Artifact                                                                | Before correction SHA-256                                          | After correction SHA-256                                           |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` | `5d676f5c4a21496aa79aa47a212291ba491230d3d75fa66927ca2b3f1113c825` | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` |
| `openspec/changes/federated-control-towers-foundation/design.md`        | `6beb02c49b48eb1096d417c29e99348fb66ce2795747fce9133d9e13c0beb676` | unchanged                                                          |
| `openspec/changes/federated-control-towers-foundation/tasks.md`         | `2c53ff8de5393d14d77f267d2b59e62fe1244b31ad8634b50dd9c29caef39ce6` | unchanged                                                          |
| Gate 2 delta Spec                                                       | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | unchanged                                                          |
| Historical Phase 2 evidence `02e-phase2-apply-evidence.md`              | `97d591434eae95d0201251d792ffe71f52eb22464f993e34d0bb8b4c372077d8` | unchanged                                                          |

The helper and this review directory were already untracked in this dirty checkout. Git HEAD has no baseline blob for the helper, so `git diff` cannot reproduce a literal Phase 2-to-correction patch. The baseline SHA-256 above was checked before editing. The exact scoped content delta is:

1. The helper accepts synthetic evaluator bucket identity/provenance parameters and a same-blocker observation flag. No other owner or Bridge v1 wire field changed.
2. Activation, journal payload and handoff validation now enforce the D3 nested recovery/evaluator fields, token and lineage binding, zero form, chronological counted references, canonical bucket order, distinct key and stage/purpose pair, pending-command binding, allowed maxima, and reviewed artifact path/hash. One material-review reference cannot mint two buckets; another bucket requires distinct reviewed provenance. Unknown, duplicate, missing, wrong-type, privacy-sensitive and incompatible old shapes fail closed.
3. A journal-replayed transition checker preserves counters, evidence prefix, bucket identity, maximum, pending intent, blockers and evidence-stop state. Genesis cannot import an established budget. A new bucket begins at zero only with accepted command intent.
4. The local commit path preassigns the immutable event ID, reserves pending on `COMMAND_ACCEPTED`, records `COMMAND_EXECUTING`, and appends one `JOURNAL:<REVISION>:<EVENT_ID>` reference with each proven synthetic evaluator outcome or failed correction/same-blocker observation. It increments and clears pending in the same journal/snapshot transaction. Read-only and rejected actions do not increment.
5. Synthetic fixture validation performs an actual read-only digest comparison, with a deliberately mismatched expected digest for a failed evaluation. The synthetic command never grants executable live authority.
6. Handoff source checks now compare exact budgets, blockers, limitations and evidence-stop state. Existing run, delivery, lock, journal and privacy boundaries remain.

No Product, API, auth, database, Workflow v3, Page Chat, deployment, Bridge v1 or other implementation owner was edited. Synthetic state is ignored under `tmp/yuta-federated-control-towers/FED-QA-BUDGET-20260926*/`; no fixture was made live. An automatic policy check rejected one proposed command that would have removed a synthetic test file; the test was instead run in a fresh context without cleanup.

## Focused budget schema revalidation

All helper calls used PowerShell, `-ExpectedCheckoutRoot (Get-Location).Path`, `-ExpectedHostLabel $env:COMPUTERNAME`, and synthetic `FED-QA-*` context IDs. Every mutating fixture output reported `ExecutableAuthority=False`. `A` reached revision 24 after one three-generation bucket and a fresh Global run; `B` stopped at accepted-only revision 5; `C` contains a clean zero-form genesis; `D` intentionally retains an extra journal file; `E` contains one failed synthetic evaluator outcome followed by `DELIVERY_UNCERTAIN`; `F` has an unconsumed handoff with a nonempty bucket; `G` intentionally has a snapshot ahead of its journal.

| #   | Required case                  | Observed local result                                                                                                                                | Scope/result                               |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | Empty budgets                  | Zero-form genesis in `C`, recovery/evaluator schema valid.                                                                                           | PASS, local                                |
| 2   | Valid nonempty bucket          | `A` accepted one sorted D3 bucket with reviewed artifact hash and exact identity.                                                                    | PASS, local                                |
| 3   | Invalid key/provenance         | Invalid token and missing/hash-drifted review reference rejected.                                                                                    | PASS                                       |
| 4   | Monotonic counters             | `A` generation 0→1→2→3, recovery 0→1→2, one chronological journal reference per increment.                                                           | PASS, local                                |
| 5   | Maximum exhaustion             | Generation attempt 4 and recovery attempt 3 rejected before command acceptance.                                                                      | PASS, local                                |
| 6   | Rejected preflight             | Exhausted and duplicate commands left durable counters/revision unchanged.                                                                           | PASS, local                                |
| 7   | Accepted without outcome       | `B` accepted revision 5; restart returned `EXECUTION_UNCERTAIN`, pending retained, executable authority false.                                       | PASS, local                                |
| 8   | Failed actual execution        | `E` digest comparison failed; exactly one generation consumed, pending cleared, recovery stayed zero.                                                | PASS, local                                |
| 9   | Successful actual execution    | `A` successful digest evaluation consumed exactly one generation at its outcome.                                                                     | PASS, local                                |
| 10  | Restart                        | New helper invocation reconciled `A` at revision 24 with recovery 2/generation 3.                                                                    | PASS, local                                |
| 11  | Fresh `RUN_ID`                 | `A` terminal→handoff→new run retained recovery 2/generation 3 and rejected another execution.                                                        | PASS, local                                |
| 12  | Page→Global                    | In-memory exact handoff schema with Page source/Global target retained recovery 2/generation 3.                                                      | PASS for budget shape; no Phase 3 transfer |
| 13  | Page rotation                  | In-memory exact Page→Page handoff schema retained both counters.                                                                                     | PASS for budget shape; no Phase 3 rotation |
| 14  | Global rotation                | `A` persisted/consumed synthetic Global handoff; schema and new run retained both counters.                                                          | PASS, local synthetic                      |
| 15  | Budget rollback                | Recomputed snapshot hash with lower count/reference prefix was rejected against final journal projection; original snapshot restored and reconciled. | PASS, local                                |
| 16  | Stale/unknown bucket           | Same stage/purpose with renamed key, unknown field, invalid key and hash-drifted provenance rejected.                                                | PASS, local                                |
| 17  | Incompatible old Phase 2 state | Flat evaluator object without `BUCKETS` was rejected; no migration action exists.                                                                    | PASS                                       |
| 18  | Privacy allowlist              | Nested `SESSION_TOKEN` and credential-like content rejected; no transcript, customer content, credential, token, cookie or session persisted.        | PASS                                       |
| 19  | At most once                   | `B` replay/new command and fencing blocked while accepted outcome uncertain; `A` duplicate command rejected.                                         | PASS, local                                |

Additional negative checks rejected wrong execution context, unsupported schema version, missing bucket field, duplicate bucket key, duplicate pending command, non-chronological counted reference, pending identity mismatch, recovery-lineage mismatch, duplicate stage/purpose, reusing a material-review reference to mint an alias bucket, and maximum above the approved default without a Human exception. `D` and `G` returned `BLOCKED: journal revision count does not match snapshot` for journal-ahead and journal-behind respectively. An in-memory transition carrying `HUMAN_GATE`, `BLOCKED`, `STOP`, `DONE` or `RESULT_DELIVERY` could not increment recovery; `E` entered `DELIVERY_UNCERTAIN` without another generation and rejected resend. `F` rejected lower recovery count, lower maximum, lower evaluator generation and stale source epoch. The Phase 2 `SelfTest` returned `Passed=True`, `Count=24`, `RuntimeStateCreated=False`, `LockAcquired=False`.

Representative exact invocations, with the stated bound variables, were:

```powershell
$h = '.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1'
$root = (Get-Location).Path
$hostLabel = $env:COMPUTERNAME
& $h -Action SelfTest -ExpectedCheckoutRoot $root -ExpectedHostLabel $hostLabel -ExecutionContextId FED-QA-BUDGET-20260926A
& $h -Action ReconcileFixture -ExpectedCheckoutRoot $root -ExpectedHostLabel $hostLabel -ExecutionContextId FED-QA-BUDGET-20260926A
& $h -Action ReconcileFixture -ExpectedCheckoutRoot $root -ExpectedHostLabel $hostLabel -ExecutionContextId FED-QA-BUDGET-20260926B
& $h -Action ReconcileFixture -ExpectedCheckoutRoot $root -ExpectedHostLabel $hostLabel -ExecutionContextId FED-QA-BUDGET-20260926D
```

The `A` fixture's first command used `-Action RecordFixtureCommand -FixtureOutcome COMPLETE -EvaluatorBucketKey HELPER_BUDGET_QA -EvaluatorStageKey HELPER_CONVERGENCE -EvaluatorPurposeKey SYNTHETIC_EVALUATOR` and `REVIEW:docs/reviews/federated-control-towers-foundation/02i-budget-schema-helper-correction-gate.md:c22c62f825af3320bebef9f2a1cec31dc7a802dba159c8382a0e48d1fc3a19e6`. Subsequent `FAILED`/same-blocker and `COMPLETE` outcomes reached the counters above. `B` used `-FixtureOutcome ACCEPTED_ONLY`; `E` used `-FixtureOutcome FAILED`. In-memory negative records were rehashed using the helper's canonical hash before `Test-Record`, so rejection was due to the named schema error rather than a stale hash.

## Checks and limitations

| Check                                                                      | Result                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| PowerShell parser after correction                                         | 0 errors                                                           |
| Helper `SelfTest`                                                          | 24/24 PASS                                                         |
| `pnpm exec openspec validate federated-control-towers-foundation --strict` | PASS                                                               |
| `pnpm docs:check`                                                          | PASS, 36 current documents                                         |
| `pnpm architecture:check`                                                  | PASS                                                               |
| `pnpm -r --if-present typecheck`                                           | PASS across applicable workspace projects                          |
| Scoped Markdown format and final hash check                                | PASS after formatting this packet                                  |
| `pnpm format:check` repository-wide                                        | FAIL on 85 out-of-scope existing files; this packet was not warned |

Known evidence limits and blocker: Page→Global and Page→Page checks prove budget object preservation at the read-only handoff-schema boundary, not Phase 3 orchestration or browser behavior. A material reference is checked for exact path/hash and stable bucket identity; the helper does not establish that the referenced artifact contains a Human-reviewed classification of a newly distinct purpose. No above-default Human budget exception exists in the current approved evidence, and the helper currently rejects all such maxima, including a future positively approved one. These two unresolved semantic checks mean exact D3 convergence cannot yet be claimed. They require a bounded authority decision before any broader owner edit or Phase 3 authorization. Formal Compliance, VERIFY and Q01–Q35 remain `NOT_RUN`.
