# Corrected Durable Representation helper correction evidence

Change: `federated-control-towers-foundation`  
Scope: bounded helper correction after the exact current-user `AUTHORIZE CORRECTED DURABLE REPRESENTATION HELPER CORRECTION`, relayed to the selected YUTA Control Tower in bridge round `BRIDGE-ARCH-20260925-F9R2:111`; execution command round `112`.  
Status: `FOCUSED_SYNTHETIC_VALIDATION_PASS`; Control Tower review pending. This record does not approve Phase 3, formal Technical Compliance, VERIFY or Browser QA.

## Exact scope and hashes

| Path                                                                                                              | Before SHA-256                                                     | After SHA-256                                                      | Purpose                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`                                           | `1693d2c18418d52d49d3d64f77efd3a4b55b843e06fe7b405f104462f74c44e4` | `8db153def5189fdc69a78350437280a963531a8e8b091d94307d0d88476feb31` | Sole implementation owner; exact authority chain, freeze/proof projection, journal recovery and synthetic tests.                       |
| `docs/reviews/federated-control-towers-foundation/03j-corrected-durable-representation-helper-correction-gate.md` | `4ac1aea591859a702165e347b9b67f73fa3c1704d79e135987fbd9176d22e219` | `fe3392197b2e0fa486a98b53d4c001d1802acfb2637d1b4f59372ba2dab86862` | Prepended exact Human authorization metadata. The historical pre-approval body remains byte-for-byte and retains its original SHA-256. |
| This evidence record                                                                                              | absent                                                             | Reported separately after final write                              | New bounded review evidence only.                                                                                                      |

No other implementation owner, Spec, Design, Sensitive Design, Tasks/TIC, Bridge v1, Workflow v3, Page Chat, Product, provider or deployment file was edited. The working tree was already dirty and the existing untracked change files remain preserved. T01–T09 remain historical completion; T10–T24 remain unchecked; Phase 3 is `NOT_AUTHORIZED`.

## Scoped implementation delta

1. Added required `CURRENT_ACTIVE_FREEZES` and `CONSUMED_AUTHORITY_PROOFS` to activation, journal `STATE_PAYLOAD` and handoff schemas. Validate exact nested fields, identity, canonical ordering, proof SHA-256, duplicate identities, scope and active-freeze proof linkage. `APPROVAL_REFERENCES` remains six-field provenance metadata.
2. Added canonical, strict UTF-8, checkout-relative, hash-bound reads for the pre-decision descriptor, accepted gate-result record, approval record and semantic decision record. Recompute `DECISION_ID`, `RESULT_HASH` and `APPROVAL_RECORD_ID`; require exact v1 type/token, completed accepted result, item/command/run/lineage/scope/review binding and causal recording order. The helper only reads authority artifacts and never creates Human approval. The accepted trust boundary remains workflow-governed repository provenance, without cryptographic Human attestation.
3. Consume one approved decision under the existing context lock via one `AUTHORITY_CONSUMED` journal event with complete `STATE_PAYLOAD`; add one proof and exactly its typed semantic effect. `SAME` reuses an existing bucket; `DISTINCT` establishes one new zero-used bucket with the semantic record as reviewed material reference. A bare `REVIEW:path:hash` can no longer create a bucket in `COMMAND_ACCEPTED`.
4. A maximum exception requires `NEW_APPROVED_MAXIMUM > PREVIOUS_APPROVED_MAXIMUM` and exact positive allowance. Used counters stay unchanged. Freeze `APPLY`, `LIFT` and `SUPERSEDE` modify only the exact active scope; a freeze blocks budgeted execution and cannot change maximum or independent evidence-stop state.
5. Journal flush/read-back precedes snapshot replace/read-back. If one validated `AUTHORITY_CONSUMED` event is ahead of the prior snapshot, restart reconstructs its exact committed post-state and never consumes the decision again. Partial journal, unrelated orphan temp, multi-revision mismatch and conflicting state block. Handoff must carry both authority arrays exactly from source through receiver; no merge or false-empty substitution.
6. SelfTest now truthfully reports an isolated synthetic temporary state and lock outside the repository; cleanup is required. It does not create canonical runtime state or activate a live tower. The command ledger remains separate and preserves accepted-without-outcome uncertainty.

## Exact commands and results

Executed on Windows PowerShell 7 with the exact current checkout and `$env:COMPUTERNAME` host label:

```powershell
$p = Resolve-Path '.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1'
$tokens = $null; $errors = $null
[System.Management.Automation.Language.Parser]::ParseFile($p, [ref]$tokens, [ref]$errors) | Out-Null
$r = & $p -Action SelfTest -ExpectedCheckoutRoot (Get-Location).Path -ExpectedHostLabel $env:COMPUTERNAME -ExecutionContextId FED_QA_TEST
$r | Select-Object Passed, Count, CanonicalRuntimeStateCreated, LiveTowerActivated, SyntheticExternalTempStateCreatedAndRemoved
pnpm docs:check
pnpm architecture:check
pnpm exec openspec validate federated-control-towers-foundation --strict
pnpm -r --if-present typecheck
pnpm exec prettier --check docs/reviews/federated-control-towers-foundation/03j-corrected-durable-representation-helper-correction-gate.md
pnpm format:check
```

PowerShell parser: **0 errors**. SelfTest: **83/83 PASS**, no failed case, `CanonicalRuntimeStateCreated=false`, `LiveTowerActivated=false`, isolated temp state created and removed. The tests include canonical authority chains; hash-consistent wrong Human token and blocked-result denial; missing/stale/noncanonical/unknown-field artifact denial; `SAME`/`DISTINCT`; strict-positive exception and rollback denial; freeze `APPLY`, `LIFT`, `SUPERSEDE`, stale-target and wrong-scope denial; zero/multiple/altered/replayed/misordered proofs; exact handoff array carry and false-empty denial; journal-ahead crash recovery, partial journal and orphan temp denial; one generation for each failed and successful synthetic evaluator execution; accepted-without-outcome uncertainty; command replay denial; evidence-stop and privacy checks. All synthetic authority files, journal, snapshot and lock lived in a per-run temp directory outside the repository and were removed.

`docs:check`, `architecture:check`, strict OpenSpec validation, monorepo typecheck and the scoped Prettier check: **PASS**. Repository-wide `pnpm format:check`: **FAIL on 85 existing files outside this correction's three-path scope**, including archived/current files from other changes. No unrelated formatting repair was made. This failure remains separate from the scoped format PASS.

`git -c core.autocrlf=false diff --no-index --check -- NUL <scoped path>` emitted no whitespace diagnostic for the untracked PowerShell owner. Applied to the two Markdown review artifacts, it flags intentional two-space Markdown hard breaks, including lines in the preserved pre-approval packet body. Prettier accepts both files. A normal `git diff` is empty for these paths because the change files are still untracked; this record provides the exact scoped path, before/after hashes and implementation delta without attributing unrelated work.

## Evidence limits and stop

The 83 cases are focused local synthetic validation, not live federation Browser QA, formal Technical Compliance or formal VERIFY. No real Page/Global tower, Page Chat, browser federation traffic or live Human decision record was exercised. Historical v1 runtime records lacking either new authority array are rejected; no automatic migration or false-empty backfill is performed. The preserved Phase 1/2 results and earlier partial/blocker packets remain historical and are not relabeled PASS by this test. The production-facing `ConsumeFixtureAuthority` action remains bound to the synthetic approved context path and returns no executable authority.

Next step is Control Tower review of this evidence. A separate exact Human Gate is still required before Phase 3/T10–T14. No commit, push, PR, merge, deploy, release, sync or archive occurred.
