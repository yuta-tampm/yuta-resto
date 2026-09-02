---
name: yuta-finish-change
description: Finish a reviewed YUTA OpenSpec change after explicit approval and sync authorization, then consolidate current knowledge after archive. Also resumes an approved post-archive knowledge review without recreating the change.
---

# YUTA Finish Change

Finish only a change that has passed the `$yuta-run-change` Gate 3 review. This
is the sole project workflow authorized to promote reviewed delta specs,
archive the completed change, and close any required post-archive Knowledge
Consolidation review. Release/deploy remains a separate operational lane.

## Operating modes

Resolve exactly one mode before mutating anything:

1. **Active-change finalization:** the active change exists, Gate 3 is
   `AWAITING_HUMAN_REVIEW`, and the current user explicitly approves Gate 3 and
   authorizes sync and archive.
2. **Archived knowledge-review resume:** Gate 3 is already `APPROVED`, the
   successful finish/archive and `AWAITING_KNOWLEDGE_REVIEW` outcome are
   recorded, the active change no longer exists, the recorded archive exists,
   and `04-knowledge-consolidation-review.md` is
   `AWAITING_HUMAN_REVIEW`. Require a current-user instruction equivalent to
   `Knowledge consolidation review approved. Apply and close.`

Never recreate or copy an archived change back into the active changes tree.
Never apply one mode's preconditions or integrity checks to the other mode.

## Required input

For active-change finalization, require an exact change name and a current-user
instruction that explicitly includes both final review approval and
authorization to sync and archive, for example:

```text
$yuta-finish-change <change-name>
Final review approved. I authorize spec sync and archive.
```

Approval without sync authorization, sync authorization without final approval,
“continue,” a passing verify/QA result, a packet status, a commit, a PR approval,
or prior assistant text is insufficient. Ask for the missing authorization and
make no mutation.

For archived knowledge-review resume, the earlier Gate 3 and sync/archive
authorization remain historical evidence; do not request or reuse them as
authorization for a documentation edit. Require the separate current-user
Knowledge Review approval for the exact packet and proposed diff.

## Branch A — Active-change finalization

This branch alone owns final Gate 3 approval, normative sync, validation, and
archive. Do not enter it for an already archived change.

### Active-change preconditions

1. Read repository/scoped instructions, `docs/AUTHORITY_MODEL.md`, the OpenSpec normativity policy, and `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`.
2. Start with `git status --short` and preserve unrelated work.
3. Resolve the active change through `openspec status --change "<name>" --json`; use returned roots and paths. Require the expected YUTA schema or report the mismatch.
4. Find `docs/reviews/<change-name>/03-final-review.md`.
5. Require Gate 3 `Review status: AWAITING_HUMAN_REVIEW`. An already
   `APPROVED` Gate 3 does not satisfy this branch; inspect the recorded outcome
   and route to the archived-resume branch only when all of that branch's
   preconditions hold.
6. Require the current-user instruction to contain both explicit final Gate 3
   approval and explicit sync/archive authorization.
7. Require all earlier applicable gate packets to be `APPROVED` with bounded approval records. A no-spec path has no Gate 2; a non-sensitive change has no Design Gate.
8. Require Gate 3 to record `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`,
   `VERIFY: PASS`, and a QA state permitted by Workflow v3. Confirm every
   implementation phase used by the change has its embedded Technical
   Implementation Contract completed and traced through the Technical
   Compliance Matrix. UI-affecting changes require `QA: PASS` plus intact
   QA-report, screenshot-manifest, and screenshot hashes. Any required `FAIL`
   or `BLOCKED_BY_ENVIRONMENT` state is never finalization-ready.

### Active-change integrity check before approval

Recompute, using the exact recorded algorithms and path sets:

- every planning artifact hash;
- every earlier packet's reviewed artifact hashes;
- the exact scoped implementation diff hash, including untracked implementation files;
- the verify-evidence source hash recorded by Gate 3.
- the Technical Compliance Matrix source/hash recorded by Gate 3, whether it
  is embedded in the verify-evidence source or recorded separately.

Require exact path-set and hash equality. Also confirm all Tasks and their
embedded phase contracts remain complete, Technical Implementation Compliance
remains `PASS`, and current verification has no unresolved critical issue.

If anything differs:

1. do not accept approval;
2. set Gate 3 to `INVALIDATED_BY_ARTIFACT_CHANGE`;
3. record expected and current values;
4. do not sync or archive;
5. direct the user back to `$yuta-run-change <change-name>` for re-verification and a fresh Gate 3 packet.

These active-change planning, implementation, VERIFY, Technical Compliance,
and earlier-gate integrity checks must never run as preconditions for the
archived knowledge-review resume branch.

### Record final approval

Only after every integrity check passes, update Gate 3 with:

```text
Review status: APPROVED
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: <ISO-8601 timestamp>
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Finish outcome: PENDING
```

Do not invent a person, title, team, or universal approver. Approval is bounded to this change, gate, reviewed hashes, capability paths, and current instruction.

### Behavior-changing path: sync and validate

When status reports approved delta specs:

1. Use `artifactPaths.specs.existingOutputPaths` as the complete delta selection. Do not infer paths.
2. Capture a byte-level pre-sync snapshot/hash manifest of the corresponding main specs and current scoped Git state. If unrelated edits overlap target main specs and cannot be safely separated or restored, stop before sync.
3. Follow the current generated `openspec-sync-specs` workflow inline. Fetch current specs instructions/rules once and merge every selected delta intelligently; never copy delta operation headers into main specs.
4. Inspect the exact main-spec diff against the approved delta and confirm no unexpected capability or requirement changed.
5. Run strict main-spec validation with the current CLI equivalent of `openspec validate --specs --strict`.
6. If sync, diff inspection, or validation fails, do not archive or claim promotion. Restore the exact pre-sync main-spec state when the approved normativity rollback policy can be applied safely, record the failure and rollback result in Gate 3, set `Finish outcome: FAILED`, and stop. If safe restoration is uncertain, stop and preserve evidence rather than performing a broad reset.

Sync is a mechanical promotion after approval; it does not create approval or change any YUTA lifecycle value.

### No-spec path

When the change validly declares `skip_specs: true`, status reports specs skipped, analysis concluded no spec-level behavior change, and Gate 1 approved that path:

- do not create or sync a main spec;
- record `Specs: no normative promotion (approved skip_specs path)`;
- continue to archive only after all other integrity, task, verification, and final-approval checks pass.

If delta specs exist on a claimed no-spec path, stop as a conflict.

### Archive

After successful applicable sync and main-spec validation, or after a valid no-spec decision:

1. Follow the current generated `openspec-archive-change` workflow synchronously using the resolved planning root.
2. Reconfirm artifact/task completion and that sync state matches every delta before moving the change.
3. Do not approve warnings for incomplete work merely because final authorization exists; unresolved incompleteness invalidates readiness and must return to `$yuta-run-change`.
4. Archive only when the target path is unambiguous and does not already exist.
5. Confirm the archived change retains its metadata and evidence.

Never archive while sync is running or after a failed/partial/unvalidated sync.

### Knowledge Consolidation after archive

After a successful archive, read and follow
`docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`. Inspect only the current sources
that could materially need reconciliation:

- Page Product Knowledge and as-built page pack evidence;
- owning Module Product Knowledge;
- `docs/PRODUCT_KNOWLEDGE.md` routing;
- `docs/MODULE_REGISTRY.md`;
- lifecycle/current-state documents;
- ADRs and durable decisions;
- `docs/CURRENT_STATE.md` when the repository-wide summary materially changed;
- `NEEDS REVIEW` items actually resolved by the completed change;
- newly discovered limitations or future work.

Classify exactly:

```text
NO_UPDATE_REQUIRED
UPDATE_REQUIRED
```

Do not assume every completed change needs a knowledge edit. Consolidation must
never automatically approve Product Intent, change a durable boundary,
ownership or permission, promote lifecycle/readiness, rewrite normative specs,
or resolve `NEEDS REVIEW` by assumption.

#### NO_UPDATE_REQUIRED

Record in Gate 3:

```text
Knowledge consolidation: NO_UPDATE_REQUIRED
Reason: <bounded reason>
Sources inspected: <exact paths>
Workflow status: DONE
```

Then classify `RELEASE_FOLLOW_UP` as `NOT_REQUIRED`, `REQUIRED`, or `UNKNOWN`
and close the repository workflow as `DONE`.

#### UPDATE_REQUIRED

Do not edit canonical knowledge yet. Create
`docs/reviews/<change-name>/04-knowledge-consolidation-review.md` containing:

- why the update is required and exact completed-change evidence;
- current files proposed for update;
- exact proposed diff or replacement text;
- authority classification for each edit;
- confirmation that no unapproved Product Decision, lifecycle, ownership,
  permission, durable-boundary, readiness, or normative-spec change occurs;
- `Review status: AWAITING_HUMAN_REVIEW`;
- SHA-256 hashes of every current target file and of the exact proposed-diff
  bytes.

Record the archive location and `Workflow status:
AWAITING_KNOWLEDGE_REVIEW` in Gate 3, then stop. The archive is successful, but
the repository workflow is not `DONE`.

## Branch B — Archived knowledge-review resume

This branch resumes only the pending Knowledge Review after a completed active
finalization. It must not rerun sync/archive or the active-change approval and
integrity sequence.

### Archived-resume preconditions

Before mutating anything, require all of the following:

1. Gate 3 records `Review status: APPROVED`.
2. Gate 3 records a successful `Finish outcome: COMPLETED` and the exact archive
   location.
3. Gate 3 records `Workflow status: AWAITING_KNOWLEDGE_REVIEW`.
4. No active change exists at the resolved active-change path.
5. The exact recorded archive location exists and retains the completed change
   evidence.
6. `docs/reviews/<change-name>/04-knowledge-consolidation-review.md` exists with
   `Review status: AWAITING_HUMAN_REVIEW`.
7. The current user explicitly approves that exact Knowledge Review packet and
   proposed documentation diff.

Gate 3 must not be `AWAITING_HUMAN_REVIEW` in this branch. Do not request fresh
Gate 3 approval or sync/archive authorization, and do not reinterpret their
historical records as authorization for the documentation edit.

### Archived-resume integrity check

Validate only the Knowledge Review approval boundary recorded in
`04-knowledge-consolidation-review.md`:

- the complete target documentation path set;
- the SHA-256 hash of every target's current bytes; and
- the SHA-256 hash of the exact proposed-diff bytes.

Require exact path-set and hash equality plus the explicit current-user
Knowledge Review approval. Do not recompute or gate this branch on active-change
planning artifacts, implementation diffs, VERIFY evidence, Technical
Compliance evidence, earlier gate packets, normative spec hashes, or active
change status.

Any Knowledge Review target or proposed-diff drift sets only that packet to
`INVALIDATED_BY_ARTIFACT_CHANGE` and stops without editing canonical knowledge.
It does not reopen Gate 3, recreate an active change, or rerun sync/archive.

### Apply the approved Knowledge Consolidation update

On archived knowledge-review resume:

1. After the branch-specific checks pass, mark the packet approved with the
   standard bounded approval source/time.
2. Apply only the exact approved knowledge diff. Do not alter product code,
   main specs, lifecycle values, or documentation outside the approved target
   set. Only the Knowledge Review packet and archived Gate 3 may additionally
   receive their bounded approval, validation, and `DONE` evidence.
3. Run targeted formatting, `pnpm docs:check`, and
   `pnpm architecture:check`. Run another repository check only when the
   approved documentation edit makes it applicable.
4. Record applied paths, post-apply hashes, exact validation commands/results,
   completion time, and `Workflow status: DONE` in the Knowledge Review packet
   and Gate 3.
5. Classify `RELEASE_FOLLOW_UP` and stop. Never deploy from this workflow.

## Completion record

After the active-finalization branch reaches its post-archive stop, or the
archived-resume branch reaches `DONE`, update only the applicable completion
fields. The archived-resume branch preserves the already recorded approval,
sync, validation, archive, and implementation-integrity evidence rather than
recreating or re-approving it.

```text
Finish outcome: COMPLETED
Specs: <synced and validated capability paths | no normative promotion>
Archive location: <resolved path>
Completed: <ISO-8601 timestamp>
Knowledge consolidation: <NO_UPDATE_REQUIRED | UPDATE_REQUIRED>
Knowledge review: <NOT_REQUIRED | packet path and status>
Workflow status: <DONE | AWAITING_KNOWLEDGE_REVIEW>
RELEASE_FOLLOW_UP: <NOT_REQUIRED | REQUIRED | UNKNOWN>
```

Produce a concise completion report containing:

- change and schema;
- approved packet path and reviewed hashes;
- synced capability paths or no-spec decision;
- main-spec validation command/result;
- archive location;
- Knowledge Consolidation classification and sources inspected;
- Knowledge Review packet/status when applicable;
- release follow-up classification without deployment;
- any warnings or rollback activity;
- explicit statement that no lifecycle value was automatically promoted.

If `RELEASE_FOLLOW_UP` is `REQUIRED`, report the affected runtime/environment,
required deployment/readiness evidence, and post-deploy verification need. Do
not deploy automatically; `IMPLEMENTED != PRODUCTION_ENABLED`.

If any step fails, report the exact stopping point, preserved state, recovery
evidence, and authorization needed next. Never label a partial sync, failed
archive, or pending Knowledge Review as `DONE`.
