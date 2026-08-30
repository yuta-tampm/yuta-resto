---
name: yuta-finish-change
description: Finish a reviewed YUTA OpenSpec change after explicit final human approval and sync authorization. Validate reviewed state, sync normative specs when applicable, validate main specs, then archive.
---

# YUTA Finish Change

Finish only a change that has passed the `$yuta-run-change` Gate 3 review. This is the sole project workflow authorized to promote reviewed delta specs and archive the completed change.

## Required input

Require an exact change name and a current-user instruction that explicitly includes both final review approval and authorization to sync and archive, for example:

```text
$yuta-finish-change <change-name>
Final review approved. I authorize spec sync and archive.
```

Approval without sync authorization, sync authorization without final approval, “continue,” a passing verify result, a packet status, a commit, a PR approval, or prior assistant text is insufficient. Ask for the missing authorization and make no mutation.

## Preconditions

1. Read repository/scoped instructions, `docs/AUTHORITY_MODEL.md`, the OpenSpec normativity policy, and `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`.
2. Start with `git status --short` and preserve unrelated work.
3. Resolve the change through `openspec status --change "<name>" --json`; use returned roots and paths. Require the expected YUTA schema or report the mismatch.
4. Find `docs/reviews/<change-name>/03-final-review.md`.
5. Require its current review status to be `AWAITING_HUMAN_REVIEW`. If it is approved already, do not reuse an old authorization blindly; inspect the recorded finish outcome and ask for direction when the prior run was incomplete.
6. Require all earlier applicable gate packets to be `APPROVED` with bounded approval records. A no-spec path has no Gate 2; a non-sensitive change has no Design Gate.

## Integrity check before approval

Recompute, using the exact recorded algorithms and path sets:

- every planning artifact hash;
- every earlier packet's reviewed artifact hashes;
- the exact scoped implementation diff hash, including untracked implementation files;
- the verify-evidence source hash recorded by Gate 3.

Require exact path-set and hash equality. Also confirm all tasks remain complete and current verification has no unresolved critical issue.

If anything differs:

1. do not accept approval;
2. set Gate 3 to `INVALIDATED_BY_ARTIFACT_CHANGE`;
3. record expected and current values;
4. do not sync or archive;
5. direct the user back to `$yuta-run-change <change-name>` for re-verification and a fresh Gate 3 packet.

## Record final approval

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

## Behavior-changing path: sync and validate

When status reports approved delta specs:

1. Use `artifactPaths.specs.existingOutputPaths` as the complete delta selection. Do not infer paths.
2. Capture a byte-level pre-sync snapshot/hash manifest of the corresponding main specs and current scoped Git state. If unrelated edits overlap target main specs and cannot be safely separated or restored, stop before sync.
3. Follow the current generated `openspec-sync-specs` workflow inline. Fetch current specs instructions/rules once and merge every selected delta intelligently; never copy delta operation headers into main specs.
4. Inspect the exact main-spec diff against the approved delta and confirm no unexpected capability or requirement changed.
5. Run strict main-spec validation with the current CLI equivalent of `openspec validate --specs --strict`.
6. If sync, diff inspection, or validation fails, do not archive or claim promotion. Restore the exact pre-sync main-spec state when the approved normativity rollback policy can be applied safely, record the failure and rollback result in Gate 3, set `Finish outcome: FAILED`, and stop. If safe restoration is uncertain, stop and preserve evidence rather than performing a broad reset.

Sync is a mechanical promotion after approval; it does not create approval or change any YUTA lifecycle value.

## No-spec path

When the change validly declares `skip_specs: true`, status reports specs skipped, analysis concluded no spec-level behavior change, and Gate 1 approved that path:

- do not create or sync a main spec;
- record `Specs: no normative promotion (approved skip_specs path)`;
- continue to archive only after all other integrity, task, verification, and final-approval checks pass.

If delta specs exist on a claimed no-spec path, stop as a conflict.

## Archive

After successful applicable sync and main-spec validation, or after a valid no-spec decision:

1. Follow the current generated `openspec-archive-change` workflow synchronously using the resolved planning root.
2. Reconfirm artifact/task completion and that sync state matches every delta before moving the change.
3. Do not approve warnings for incomplete work merely because final authorization exists; unresolved incompleteness invalidates readiness and must return to `$yuta-run-change`.
4. Archive only when the target path is unambiguous and does not already exist.
5. Confirm the archived change retains its metadata and evidence.

Never archive while sync is running or after a failed/partial/unvalidated sync.

## Completion record

After success, update Gate 3 with:

```text
Finish outcome: COMPLETED
Specs: <synced and validated capability paths | no normative promotion>
Archive location: <resolved path>
Completed: <ISO-8601 timestamp>
```

Produce a concise completion report containing:

- change and schema;
- approved packet path and reviewed hashes;
- synced capability paths or no-spec decision;
- main-spec validation command/result;
- archive location;
- any warnings or rollback activity;
- explicit statement that no lifecycle value was automatically promoted.

If any step fails, report the exact stopping point, preserved state, recovery evidence, and authorization needed next. Never label a partial sync or failed archive as complete.
