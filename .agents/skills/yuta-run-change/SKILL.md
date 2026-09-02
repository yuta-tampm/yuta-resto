---
name: yuta-run-change
description: Run or resume a YUTA OpenSpec change through the next human review gate, including phased implementation, technical verification, and required QA. Never sync or archive normative specs.
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

The user supplies a change request. Before creating an OpenSpec change, classify
whether material Product, ownership, workflow, provider, runtime, data, or
cross-module uncertainty prevents a safe bounded request.

- Use conditional Discovery / Shaping for a new capability with an unclear
  owner, cross-module behavior, external-provider behavior, a major workflow
  redesign, or an unfamiliar runtime/data boundary.
- Discovery / Shaping is pre-change reasoning, not a mandatory OpenSpec
  artifact. Inspect current authorities and implementation read-only, then
  either ask the user / Control Tower for the missing decision, produce a
  bounded request, or stop without creating a change.
- Skip Discovery / Shaping for a small request that current Product Knowledge
  and durable boundaries already bound clearly.

If behavior, ownership, authorization, compatibility, acceptance criteria, or
another material boundary remains ambiguous after applicable shaping, ask
before creating the change. Otherwise derive an unused kebab-case name and run:

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
- `qa/` only when QA evidence is applicable; mandatory for UI-affecting changes
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

### State 4 — Tasks and phased implementation plan

1. Create tasks from the current artifact graph/instructions. Resolve any
   design question that would change what gets built before writing tasks.
2. Organize checkbox tasks in dependency order under only the implementation
   phases the change actually needs. The allowed planning labels are:
   - `Foundation / Data`;
   - `Service / Domain`;
   - `UI / Components`;
   - `Interaction / States`;
   - `Integration / Regression`.
3. These labels are optional planning vocabulary, not mandatory stages. Do not
   invent a Data, Service, UI, or Interaction phase for a change that does not
   need it. Keep change-specific subgroups inside the closest allowed phase.
4. Every included phase contains verifiable checkbox outcomes. Preserve
   dependency order and keep sensitive migrations or cross-boundary work behind
   the approved Design Gate.
5. Embed a `TECHNICAL IMPLEMENTATION CONTRACT` inside each included phase in
   `tasks.md`. It is part of the existing Tasks / Implementation Plan, not a
   new OpenSpec artifact or review packet. For that phase record:
   - affected runtime, data, domain, security, or presentation boundary;
   - canonical owner;
   - exact repository/root and nearest scoped `AGENTS.md` plus applicable
     current architecture, security, tenancy, database, application, UI,
     package, or operations authorities consulted;
   - only the technical constraints applicable to this change;
   - intended files/packages;
   - required targeted checks;
   - completion evidence.

   Reference authority paths and resolve their current rules; do not copy or
   restate the repository's full rule sets in Tasks. The contract must cover
   the real concerns of the selected phase, such as ownership/schema/migration
   and isolation for `Foundation / Data`, trusted boundaries/validation/domain
   behavior for `Service / Domain`, component/client ownership for
   `UI / Components`, interaction/accessibility/state behavior for
   `Interaction / States`, and relevant end-to-end/regression evidence for
   `Integration / Regression`.

6. Do not begin Apply while a required technical owner, boundary, authority, or
   constraint is unresolved. A required new permission, contract, API,
   canonical owner, cross-runtime behavior, or durable-boundary change returns
   to the applicable Design/Product/authority gate.
7. Classify and record before Apply:

   ```text
   UI_AFFECTING: YES | NO
   BROWSER_QA_REQUIRED: YES | NO
   ```

   `UI_AFFECTING: YES` and `BROWSER_QA_REQUIRED: YES` apply whenever the change
   affects visible UI, user interaction, responsive layout, UI role/edit/read-
   only state, loading/error/success presentation, or visual component behavior.
   Backend/data-only changes may use a non-browser QA plan.

8. Before Apply, identify intended implementation files as closely as possible
   and require them to be clean relative to the recorded baseline, or stop to
   isolate/preserve pre-existing work. Record the pre-Apply scoped status.

### State 5 — APPLY

1. Follow the current generated `openspec-apply-change` workflow and CLI apply
   instructions. Read every returned context file.
2. Execute included task phases in dependency order. Within each phase:
   - implement only approved scope;
   - follow the phase's embedded Technical Implementation Contract and its
     referenced current authorities;
   - run targeted checks where practical before moving on;
   - evaluate every contract item before completing the phase;
   - mark a checkbox complete only when both its implementation outcome and
     technical-compliance evidence exist.
3. APPLY owns approved code, schema/migrations, service/domain behavior,
   UI/components, interaction/state logic, integration, regression work, and
   tests. It does not create Product authority.
4. Technical defects inside approved behavior may be corrected autonomously.
   If implementation discovery changes Product behavior or a durable boundary,
   stop and return to the appropriate earlier gate. Never silently revise or
   weaken Specs/Design to fit implementation.
5. Do not bypass a current scoped technical rule to complete a phase. If
   compliance would require changing that rule or its owning boundary, stop for
   the authority that owns the rule.

### State 6 — VERIFY

VERIFY is technical verification and answers whether repository implementation
matches the approved Specs and Design. Keep it distinct from QA.

1. Run the current generated `openspec-verify-change` workflow plus applicable
   repository checks.
2. Require applicable evidence for:
   - requirement/scenario-to-implementation mapping;
   - targeted tests and broader relevant suites;
   - typecheck and build;
   - strict OpenSpec validation;
   - architecture/security checks;
   - migration/schema checks;
   - scoped diff review;
   - deviations and blockers.
3. Build a `TECHNICAL COMPLIANCE MATRIX` in the existing VERIFY evidence. It is
   not a new OpenSpec artifact. For every applicable contract item record:

   ```text
   technical rule/constraint
   -> authoritative source
   -> affected implementation
   -> test/check/evidence
   -> PASS | FAIL
   ```

   Require exact traceability to each phase actually used; do not add empty
   matrix rows for phases the change did not need.

4. Record exactly `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` only when every
   applicable matrix row passes. Record exactly `VERIFY: PASS` only when both
   the approved Specs/Design match implementation and Technical Implementation
   Compliance is `PASS`, with no unresolved critical issue. Otherwise record
   `FAIL` or the exact blocker and stop or fix within approved behavior before
   rerunning VERIFY.
5. VERIFY must not claim browser UX, visual or responsive correctness,
   deployment success, environment enablement, or Production Readiness.

### State 7 — QA

Read and follow `docs/YUTA_QA_PROTOCOL.md`. QA status is exactly one of:

```text
PASS
FAIL
BLOCKED_BY_ENVIRONMENT
NOT_APPLICABLE
```

For `UI_AFFECTING: YES`, Browser QA is mandatory and must use the real/local app
route with the closest safe realistic data. Create:

```text
docs/reviews/<change-name>/qa/
├── QA_REPORT.md
├── screenshot-manifest.md
└── *.png
```

Use page-pack viewport rules when present. Otherwise test at least desktop
`1366x768` and mobile `390x844`; add tablet/intermediate coverage such as
`768x1024` when the target or meaningful breakpoint requires it. Check the
applicable happy path, before/after state, edit/read-only or role state,
loading/error/success presentation, keyboard/basic accessibility, overflow,
responsive behavior, and regression around the changed section.

Screenshots must come from actual browser QA, be listed with relative path,
viewport, role/state, scenario, and SHA-256 in `screenshot-manifest.md`, and be
linked from `QA_REPORT.md` and Gate 3. Do not add a visual-testing dependency
only for one change unless the approved Design authorizes it.

- `PASS`: all required QA and evidence are complete.
- `FAIL`: record the observed issue; fix implementation defects inside approved
  behavior, then rerun VERIFY and QA.
- `BLOCKED_BY_ENVIRONMENT`: attempt only safe repository-defined recovery,
  record the exact blocker, do not claim PASS, and stop with the environment
  action required.
- `NOT_APPLICABLE`: only when there is no applicable user-facing/runtime QA
  dimension. It is invalid for `UI_AFFECTING: YES`.

### State 8 — Gate 3 final review packet

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
- separate `TECHNICAL VERIFY` and `QA` sections;
- `TECHNICAL IMPLEMENTATION COMPLIANCE`, with phase coverage and the Technical
  Compliance Matrix source/hash;
- `UI_AFFECTING`, `BROWSER_QA_REQUIRED`, exact VERIFY result, and exact QA
  status;
- for UI-affecting changes, the QA report, screenshot manifest, screenshot
  hashes, key screenshot paths, viewports/roles/states, and unresolved
  visual/accessibility issues;
- relevant/full diff for a reasonably small change, or key hunks plus an explicit note that the reviewer may request the exact full diff for a large change;
- the exact field `Sync authorization: PENDING`;
- recommendation and `Review status: AWAITING_HUMAN_REVIEW`.

Build the implementation diff from only the files attributed to this change. Record the exact deterministic command and hash the exact bytes of the diff included or attached to the packet. Include untracked implementation files explicitly; do not let `git diff` omission hide them. If a clean, reproducible scoped diff cannot be produced because of overlapping pre-existing changes, stop instead of issuing Gate 3.

Build a canonical verify-evidence block containing exact commands, exit results, and the verification assessment source; hash the exact UTF-8 bytes of that block and include it unchanged in the packet.

Gate 3 is ready only when `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`,
`VERIFY: PASS`, and required QA is `PASS`. A
non-UI change may proceed with `QA: PASS` for its applicable non-browser plan or
`QA: NOT_APPLICABLE` when no runtime/user-facing QA dimension exists. Never
hide `BLOCKED_BY_ENVIRONMENT`, and never issue an awaiting-review Gate 3 packet
or a fully-ready recommendation while required QA is blocked or failed.

Only a ready Gate 3 may use the recommendation:

```text
APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY
```

This recommendation does not itself approve Gate 3 or authorize sync/archive.
Those remain explicit current-user decisions.

## Stop conditions

Stop at the first applicable condition:

- a packet is awaiting review, changed-requested, or invalidated;
- explicit gate approval is missing or ambiguous;
- artifact hashes do not match;
- authority or requirement decisions remain unresolved;
- sensitive design lacks approval;
- apply/verify discovers a spec or durable-boundary conflict;
- a scoped implementation diff cannot be isolated;
- Technical Implementation Compliance is not `PASS`;
- VERIFY is not `PASS`;
- required QA is `FAIL` or `BLOCKED_BY_ENVIRONMENT`;
- UI-affecting QA lacks responsive Browser QA or hashed screenshot evidence;
- Gate 3 has been created.

End with the current change, schema, gate, packet path, status, and the exact approval needed next. Do not suggest or execute sync/archive from this skill.
