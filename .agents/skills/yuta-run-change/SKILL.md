---
name: yuta-run-change
description: Run or resume a YUTA OpenSpec change through the next human review gate. Use for YUTA feature/change planning, implementation, and verification. Never sync or archive normative specs.
---

# YUTA Run Change

Run one YUTA change as a resumable, approval-gated state machine. Automate work between gates, but never infer or manufacture human approval.

## Non-negotiable boundaries

- Read the repository and nearest scoped instructions, `docs/AUTHORITY_MODEL.md`, the OpenSpec activation and normativity policies, and the relevant Product Knowledge/ADR/runtime sources before acting.
- Preserve unrelated work. Start with `git status --short`; before apply, stop if an intended implementation path already has unrelated edits that cannot be isolated safely.
- Use the nearest local OpenSpec root unless the user explicitly selects a registered store. Keep a selected store sticky for all supported commands.
- Use `openspec status --change "<name>" --json` and `openspec instructions <artifact-id> --change "<name>" --json`. Use returned paths, dependency edges, context, rules, and instructions instead of hard-coded artifact paths or built-in schema assumptions.
- Use the configured default schema when creating a change; omit `--schema` unless the user explicitly asks for another schema. A normal YUTA run must resolve to `yuta-spec-driven`; otherwise stop and report the mismatch.
- Never sync main specs or archive a change in this skill. Those operations belong only to `$yuta-finish-change` after Gate 3 authorization.
- Never promote Product Decision, Implementation, Environment, Production Readiness, External Dependency, or any other lifecycle value merely because workflow steps pass.
- Do not modify generated `.agents/skills/openspec-*/**`, the custom schema, or OpenSpec config while running a product change.

## Inputs

### Start a new change

The user supplies a bounded change description. If behavior, ownership, authorization, compatibility, acceptance criteria, or another material boundary is ambiguous, ask before creating the change. Otherwise derive an unused kebab-case name and run:

```text
openspec new change "<change-name>"
```

Do not pass `--schema`; verify the pinned schema from status.

### Resume a change

The user supplies the exact change name and an explicit gate decision, for example:

```text
$yuta-run-change <change-name>
Analysis review approved. Continue.
```

or:

```text
$yuta-run-change <change-name>
Specs review approved. Continue.
```

Approval must be a current-user instruction bounded to the selected change and current gate. “Continue,” a passing test, `Status: PASS`, an OpenSpec status, file existence, a commit, a PR approval, prior assistant text, or an earlier unrelated approval is not approval.

### Adopt an existing in-flight change

An existing change may already contain proposal, analysis, specs, design, or later artifacts while having no YUTA review packets. Adopt its current files without regenerating or rewriting them merely because a packet is missing.

- Always begin at the earliest missing, unapproved, changed-requested, or invalidated review gate.
- Existing later artifacts never bypass an earlier gate.
- Preserve every pre-existing artifact byte-for-byte unless the user explicitly requests a change after reviewing it.
- Treat packet creation as evidence assembly, not permission to normalize artifact wording, formatting, metadata, or content.
- If an existing artifact is invalid, inconsistent, or blocked, record that result in the applicable packet and stop. Do not repair it during adoption without explicit user authorization.

## Review packet integrity protocol

Review packets live under `docs/reviews/<change-name>/` and are created only when their gate is reached:

- `01-analysis-review.md`
- `02-specs-review.md`
- `02b-design-review.md` only for sensitive changes
- `03-final-review.md`

Every packet starts with these fields:

```text
Change:
Gate:
Review status:
Created:
Schema:
Analysis conclusion:
Sensitive change:
```

Allowed review statuses are:

- `AWAITING_HUMAN_REVIEW`
- `APPROVED`
- `CHANGES_REQUESTED`
- `INVALIDATED_BY_ARTIFACT_CHANGE`

For each reviewed artifact, compute SHA-256 over its exact file bytes and record a sorted table of repository-relative path and lowercase hexadecimal hash. Record the exact command/tool used. Hash every delta spec separately; never hash only a directory name.

At every resume and before any later gate:

1. Recompute every hash in the current packet and all earlier approved packets.
2. Require exact path-set and hash equality.
3. If any path is added, removed, renamed, or changed, do not accept approval. Set the affected packet to `INVALIDATED_BY_ARTIFACT_CHANGE`, record expected versus current hashes, and stop for re-review.
4. If the user requests changes, set the packet to `CHANGES_REQUESTED`; revise only with authorization, then produce a fresh `AWAITING_HUMAN_REVIEW` packet and stop again.
5. When approval is valid, change the packet to `APPROVED` and record:

```text
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: <ISO-8601 timestamp>
```

Do not invent an approver name, role, or universal authority.

Review packets are evidence, not Product Knowledge or normative specs. Write them as self-contained engineering review documents. Include exact artifact content where required, not paraphrase alone.

## State machine

### State 0 — Discover

1. Resolve the change from explicit input; do not guess when multiple changes are plausible.
2. Run OpenSpec status and inspect the returned schema, artifact graph, paths, apply requirements, and existing outputs.
3. Inspect existing review packets and their statuses.
4. Determine the earliest unapproved or invalidated gate. Never skip it because later artifacts happen to exist.
5. Capture `git status --short` and the current `HEAD` revision as provenance. Keep unrelated paths outside the change scope.
6. Inventory all existing artifact paths before writing anything. Classify each as pre-existing or missing so adoption cannot accidentally overwrite later work.

When a change has artifacts but no packets, enter adoption mode. Create only the packet for the earliest gate whose required artifacts already exist; create missing artifacts only when the workflow has reached their normal state and no pre-existing artifact occupies that role.

### State 1 — Proposal and analysis to Gate 1

For a new change, or a change genuinely missing Gate 1 artifacts:

1. Follow the artifact graph and instructions to create proposal and analysis in dependency order. Re-read dependencies before each artifact.
2. Apply YUTA authority routing. Use code/tests only for Implemented State, not as Product approval.
3. Read the analysis conclusion exactly. The only valid YUTA analysis conclusions are `READY_FOR_SPECS`, `BLOCKED_NEEDS_REVIEW`, and `NO_SPEC_BEHAVIOR_CHANGE`.
4. Create `01-analysis-review.md`, then stop before specs.

If proposal and analysis already exist but `01-analysis-review.md` does not:

1. Read and validate the existing files without changing them.
2. Hash their exact bytes.
3. Create Gate 1 from their current content and findings.
4. Stop, even when specs, design, tasks, or implementation already exist.

`CONFLICT` is not an analysis conclusion. Record each conflict in the analysis conflict section and Gate 1 packet. When a conflict affects requirement readiness, require the analysis conclusion `BLOCKED_NEEDS_REVIEW`. If an adopted analysis uses `CONFLICT` as its conclusion or otherwise lacks one of the three valid conclusions, report that as a Gate 1 blocker without rewriting the artifact.

Gate 1 packet includes:

- request and bounded-change summary;
- exact proposal content;
- exact analysis content;
- authorities consulted;
- every `CONFLICT` and `NEEDS REVIEW` item;
- explicit Product/authority questions requiring answers;
- analysis conclusion and recommendation;
- proposal and analysis hashes.

If analysis is `BLOCKED_NEEDS_REVIEW` or contains a requirement-level conflict, an approval word alone does not unblock it. Require explicit answers, revise the affected artifacts only after the user authorizes those changes, generate a new Gate 1 packet, and stop for review.

If analysis is `READY_FOR_SPECS`, Gate 1 approval permits State 2. If it is `NO_SPEC_BEHAVIOR_CHANGE`, Gate 1 approval permits the no-spec branch only after metadata and CLI state validly report `skip_specs: true`; never invent a spec to satisfy validation.

### State 2 — Delta specs to Gate 2

After valid Gate 1 approval on a behavior-changing path:

1. Recompute all Gate 1 hashes before proceeding.
2. Use status/instructions to create only the required delta specs, preserving capability paths declared by the proposal.
3. Run strict change validation using the current CLI syntax.
4. Automatically correct formatting or internal spec consistency errors only when semantics do not change. If a correction requires a Product, authority, security, ownership, or compatibility decision, stop and return to Gate 1.
5. Create `02-specs-review.md`, then stop before design, tasks, or apply.

If delta specs already exist but `02-specs-review.md` does not after Gate 1 approval:

1. Read the existing specs without changing them.
2. Strict-validate their current bytes.
3. Hash every exact delta spec separately.
4. Create Gate 2 with the exact content and validation result.
5. Stop, even when design, tasks, or implementation already exist.

Do not auto-fix an adopted spec merely because strict validation fails. Record the failure and blocker in Gate 2; change the spec only after explicit user review direction.

Gate 2 packet includes:

- approved Gate 1 packet reference and hashes;
- exact content and hash of every delta spec;
- requirements/scenarios summary;
- strict validation command and exact result;
- changed assumptions since analysis;
- remaining ambiguity and recommendation.

On the no-spec branch, do not create Gate 2. Confirm OpenSpec reports specs skipped, record the approved Gate 1 reference, and continue to State 3 only when the user explicitly approved Gate 1.

### State 3 — Design decision and optional sensitive gate

After valid Gate 2 approval, or valid Gate 1 approval on a no-spec path:

1. Recompute all earlier packet hashes.
2. If design already exists, read and use it byte-for-byte; do not regenerate it. Otherwise follow the schema's design instruction. Create design only when applicable; if the instruction makes it conditional and it is not applicable, follow the approved operational policy and do not create ceremonial design.
3. Classify the change as sensitive when it affects any of:
   - authorization or security boundary;
   - runtime or data ownership;
   - database or destructive migration;
   - payment or fiscal behavior;
   - Personnel, legal, or privacy-sensitive data;
   - external provider contract/readiness;
   - POS transaction integrity;
   - irreversible/destructive operation;
   - cross-module durable boundary.

For a sensitive change, create `02b-design-review.md` and stop before tasks/apply. Include exact design, design hash, spec hashes, security/data/runtime implications, migration/rollback, unresolved choices, and recommendation. Resume only after explicit design approval and intact hashes.

For a normal change, proceed directly to State 4 without a separate design gate.

The same preservation rule applies to any existing later artifact: reaching its state permits use and review, not automatic regeneration. Only explicit user-requested post-review changes authorize edits.

### State 4 — Tasks, apply, and verify

1. Create tasks from the current artifact graph/instructions. Resolve any design question that would change what gets built before writing tasks.
2. Before apply, identify intended implementation files as closely as possible and require them to be clean relative to the recorded baseline, or stop to isolate/preserve pre-existing work. Record the pre-apply scoped status.
3. Follow the current generated `openspec-apply-change` workflow and CLI apply instructions. Read all returned context files. Complete tasks in order and mark a checkbox only when fully implemented and verified as stated.
4. Technical failures inside approved behavior may be fixed autonomously. If implementation discovery invalidates a requirement or requires a new Product/authority decision, stop and return to the appropriate earlier gate; never silently weaken the spec.
5. Run the relevant repository checks and the current generated `openspec-verify-change` workflow.
6. If verification fails because of implementation defects, fix and repeat. If it fails because specs/design conflict or authority is unresolved, stop for human review.
7. When bounded verification passes, create Gate 3 and stop. Never sync or archive.

### State 5 — Gate 3 final review packet

Create `03-final-review.md` containing:

- approved Gate 1, Gate 2, and conditional Design Gate references and hashes;
- hashes of all current planning artifacts;
- design summary;
- tasks summary and completion count;
- implementation files changed;
- requirement/scenario-to-code-and-test mapping;
- commands and results for tests, typechecks, builds, validation, and verification;
- deviations from specs/design and unresolved issues;
- `git diff --stat` and sorted changed-file list;
- implementation diff hash;
- verify evidence hash and its exact summary source;
- relevant/full diff for a reasonably small change, or key hunks plus an explicit note that the reviewer may request the exact full diff for a large change;
- the exact field `Sync authorization: PENDING`;
- recommendation and `Review status: AWAITING_HUMAN_REVIEW`.

Build the implementation diff from only the files attributed to this change. Record the exact deterministic command and hash the exact bytes of the diff included or attached to the packet. Include untracked implementation files explicitly; do not let `git diff` omission hide them. If a clean, reproducible scoped diff cannot be produced because of overlapping pre-existing changes, stop instead of issuing Gate 3.

Build a canonical verify-evidence block containing exact commands, exit results, and the verification assessment source; hash the exact UTF-8 bytes of that block and include it unchanged in the packet.

## Stop conditions

Stop at the first applicable condition:

- a packet is awaiting review, changed-requested, or invalidated;
- explicit gate approval is missing or ambiguous;
- artifact hashes do not match;
- authority or requirement decisions remain unresolved;
- sensitive design lacks approval;
- apply/verify discovers a spec or durable-boundary conflict;
- a scoped implementation diff cannot be isolated;
- Gate 3 has been created.

End with the current change, schema, gate, packet path, status, and the exact approval needed next. Do not suggest or execute sync/archive from this skill.
