# Federated Control Towers — Phase 4 safe local manual handoff

Change: `federated-control-towers-foundation`  
Scope: current Phase 3 candidate, single-host synthetic developer flow only  
Status: `MANUAL_TEST_READY=YES` for the safe local flow; live federation and Browser QA `NOT_RUN`

## Candidate and supported boundary

Run from the canonical `D:\working\yuta\yuta-resto` checkout on one Windows host, NTFS volume, with PowerShell 7 and the approved `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. The helper's `Preflight` must return `Valid=true`, `Platform=Windows`, `FileSystem=NTFS`, the exact checkout and host, `RuntimeStateCreated=false` and `LockAcquired=false`. Stop if any differs. Cross-host or distributed coordination is unsupported. Do not use a reparse-point checkout or bypass the helper.

Candidate owner SHA-256 at this handoff: skill `38c3e5d4e3f292b4892037882ccce8fbeea0836ff091b5741caa86684fb617d5`; helper `c8a9086991bb4dd9e43be006bb80c3a1a27e1af5679d340e317272bb63c12719`; tracked protocol `e1b01038052e359653a919ec6dc98fef92cde7e38739fed181bf40d9d9b16f66`. The pre-Phase-4 Tasks hash is `5b74dd81ba7bc52b91affa66bf5e7232912493a2ac0e726f99973690fb9299b9`; the assessed Tasks hash is recorded in `03p-phase4-post-apply-feedback-evidence.md`. Recheck all hashes before using the handoff against a later candidate.

Only `FED-QA-*` synthetic identities are allowed. The commands below create one ignored fixture at `tmp/yuta-federated-control-towers/<EXECUTION_CONTEXT_ID>/`; that fixture is evidence, never executable tower authority. The sample context ID must be fresh. If it already exists, choose another unique `FED-QA-*` ID and change `$id` before starting. Never delete an old fixture or lock to make a retry work. No credentials, customer data, Page Chat content, or real ChatGPT conversation identity is needed.

## Exact safe invocation

This is an existing helper invocation sequence, not a live browser instruction. Copy the whole PowerShell block from the checkout root. A rejected step stops the script; preserve the fixture and inspect it rather than rerunning an accepted identity.

```powershell
$ErrorActionPreference = 'Stop'
$h = '.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1'
$root = (Resolve-Path .).Path
$id = 'FED-QA-MANUAL-P4-Z9R4'
$base = @{ ExpectedCheckoutRoot=$root; ExpectedHostLabel=$env:COMPUTERNAME; ExecutionContextId=$id }
$preflight = & $h -Action Preflight @base
if (-not $preflight.Valid -or $preflight.Platform -cne 'Windows' -or $preflight.FileSystem -cne 'NTFS') { throw 'BLOCKED: unsupported host or checkout' }
if (Test-Path -LiteralPath $preflight.ReservedStatePath) { throw 'BLOCKED: choose a fresh synthetic context ID; do not reuse or delete state' }

$project = 'QA-PROJECT-MANUALP4'
$pageConversation = 'QA-CONVERSATION-MANUALP4-PAGE'
$pageTitle = 'QA-TARGET-MANUALP4-PAGE'
$pageRun = 'FED-QA-MANUALP4-RUN-1'
$pageTarget = @{ TargetRole='PAGE_CONTROL_TOWER'; TargetScope='PAGE_LOCAL'; TargetOwningPageChatId='QA-PAGE-MANUALP4'; TargetProjectId=$project; TargetConversationId=$pageConversation; TargetTitle=$pageTitle }
$pageObserved = @{ ObservedProjectId=$project; ObservedConversationId=$pageConversation; ObservedTitle=$pageTitle; ObservedUrl="https://chatgpt.com/g/$project/c/$pageConversation" }
$pageTrace = [ordered]@{ PROTOCOL_VERSION=1; RUN_ID=$pageRun; ROUND_ID=1; COMMAND_ID="$($pageRun):1"; CAUSAL_LINEAGE_ID="$id-LINEAGE"; PROJECT_ID=$project; CONVERSATION_ID=$pageConversation; CONVERSATION_TITLE=$pageTitle; CONVERSATION_URL=$pageObserved.ObservedUrl; HANDSHAKE='VALID'; COMMAND='VALID'; RESULT='VALID'; EVALUATION='COMPLETE'; ACTION='READ_ONLY'; REPOSITORY_MUTATION='NONE' } | ConvertTo-Json -Compress

& $h -Action InitializeFixture @base
& $h -Action AdvanceFixture -NextState ACTIVATING -NewRunId $pageRun @pageTarget @base
& $h -Action RecordFixtureProbe -RunId $pageRun -ProbeTraceJson $pageTrace @pageObserved @base
& $h -Action AdvanceFixture -NextState ACTIVE @pageObserved @base
& $h -Action AdvanceFixture -NextState FENCING @base
& $h -Action AdvanceFixture -NextState TERMINAL @base

$globalConversation = 'QA-CONVERSATION-MANUALP4-GLOBAL'
$globalTitle = 'QA-TARGET-MANUALP4-GLOBAL'
$globalRun = 'FED-QA-MANUALP4-RUN-2'
$handoff = 'FED-QA-HANDOFF-MANUALP4-PAGE-GLOBAL'
$globalTarget = @{ TargetRole='GLOBAL_CONTROL_TOWER'; TargetScope='CROSS_MODULE'; TargetOwningPageChatId='NONE'; TargetProjectId=$project; TargetConversationId=$globalConversation; TargetTitle=$globalTitle }
$globalObserved = @{ ObservedProjectId=$project; ObservedConversationId=$globalConversation; ObservedTitle=$globalTitle; ObservedUrl="https://chatgpt.com/g/$project/c/$globalConversation" }
$globalTrace = [ordered]@{ PROTOCOL_VERSION=1; RUN_ID=$globalRun; ROUND_ID=1; COMMAND_ID="$($globalRun):1"; CAUSAL_LINEAGE_ID="$id-LINEAGE"; PROJECT_ID=$project; CONVERSATION_ID=$globalConversation; CONVERSATION_TITLE=$globalTitle; CONVERSATION_URL=$globalObserved.ObservedUrl; HANDSHAKE='VALID'; COMMAND='VALID'; RESULT='VALID'; EVALUATION='COMPLETE'; ACTION='READ_ONLY'; REPOSITORY_MUTATION='NONE' } | ConvertTo-Json -Compress

& $h -Action PersistFixtureHandoff -HandoffId $handoff -NewRunId $globalRun @globalTarget -PageContextIntake UNKNOWN -PageContextCompleteness UNKNOWN -PageContextGaps @('QA-GAP-MANUALP4-SOURCE-NOT-RETRIEVED') @base
& $h -Action AdvanceFixture -NextState ACTIVATING -NewRunId $globalRun -HandoffId $handoff @globalTarget @base
& $h -Action RecordFixtureProbe -RunId $globalRun -ProbeTraceJson $globalTrace @globalObserved @base
& $h -Action AdvanceFixture -NextState ACTIVE -HandoffId $handoff @globalObserved @base
& $h -Action AdvanceFixture -NextState FENCING @base
& $h -Action AdvanceFixture -NextState TERMINAL @base
& $h -Action ReconcileFixture @base
& $h -Action LockProbe @base
```

Every fixture response must report `ExecutableAuthority=false`. The synthetic probe trace is caller-supplied metadata; `VALID` labels do not prove a real handshake, command, result or Control Tower evaluation. The local handoff preserves one causal lineage and budgets while the run and tower instance change. A Page rotation uses the same owning Page ID with a distinct `QA-CONVERSATION-*` target; a Global rotation keeps the Global role and scope. Use another fresh context for each independent manual scenario. The Phase 3 evidence `03m-phase3-apply-evidence.md` records these rotation paths; this handoff directly exercises Page-to-Global only.

## Inspect, recover and stop

Inspect `tmp/yuta-federated-control-towers/$id/activation.json`, `journal/<REVISION>.json`, `handoffs/$handoff/handoff.json` and the persistent `lock` file. The snapshot's `CURRENT_ACTIVE_FREEZES` and `CONSUMED_AUTHORITY_PROOFS` arrays and both budget objects must remain present; an empty array means no synthetic decision was consumed, not proof of Human approval. Verify `CAUSAL_LINEAGE_ID` is unchanged, `ACTIVE_RUN_ID` becomes null after the final fence, and `ReconcileFixture` reports `RECONCILED_NON_EXECUTING`. A lock file may remain; the exclusive process handle is the lock, and `LockProbe` must reacquire it after the prior call ends.

For interrupted work, use `ReconcileFixture` read-only before any further action. An accepted command without attributable outcome is `EXECUTION_UNCERTAIN`; ambiguous send is `DELIVERY_UNCERTAIN`. Neither is a reason to resend, retry the same command, remove a lock or reuse a handoff. Missing, corrupt, partial, conflicting or rollback state, wrong target, stale run/epoch, consumed handoff, approval/hash mismatch, and unsupported host/checkout must stop with `BLOCKED`, `HUMAN_REQUIRED` or `NEEDS_REVIEW` as specified by the helper and approved Design. `PAGE_CONTEXT_INTAKE=UNKNOWN` preserves missing-context uncertainty; it never means there were no prior Page requirements. An owning Page Chat keeps `PAGE_LOCAL` Product authority.

There is no destructive reset procedure in this approved phase. A new manual attempt uses a fresh synthetic context and IDs; retained ignored fixtures are evidence. Removing an old fixture or forcibly clearing a lock requires separate safe authorization. Human live-context updates and real Page/Global conversation selection belong to later separately authorized live QA; this handoff does not instruct those actions. Formal Technical Compliance, VERIFY, Browser QA Q01–Q35, and Gate 3 remain independent and not run/not ready.
