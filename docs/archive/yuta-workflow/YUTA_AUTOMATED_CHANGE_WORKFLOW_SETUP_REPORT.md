# YUTA Automated Change Workflow Setup Report

## 1. Files created

- `.agents/skills/yuta-run-change/SKILL.md`
- `.agents/skills/yuta-finish-change/SKILL.md`
- `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`
- `docs/reviews/README.md`
- `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md`

No support scripts, references, UI metadata, empty review packets, or Pilot artifacts were created by this setup.

## 2. Skill discovery result

Both skills use the repository's project-owned `.agents/skills/<skill-name>/SKILL.md` convention, have distinct names from generated OpenSpec skills, and passed direct validation of the same structural invariants used by the bundled validator:

- required YAML delimiters;
- allowed and required frontmatter keys;
- lowercase hyphen-case name and folder-name match;
- non-empty bounded description;
- no unfinished scaffold placeholder.

The official `skill-creator/scripts/quick_validate.py` was attempted with both the system and bundled Python runtimes, but both runtimes lack the `PyYAML` module required by that script. This is an environment dependency limitation, not a detected skill error. Equivalent frontmatter/body validation passed for both skills.

The new paths are discoverable by the project skill convention. The active Codex session's preloaded skill catalog does not hot-refresh after filesystem creation; start a new task/session or restart Codex before the smoke test if `$yuta-run-change` and `$yuta-finish-change` do not yet appear in the available-skills catalog. This is not considered a setup failure.

## 3. State-machine summary

`$yuta-run-change` supports:

1. bounded new-change creation with the configured default schema;
2. safe adoption of in-flight changes without rewriting existing artifacts;
3. Proposal + Analysis to Gate 1;
4. explicit approval and hash verification before Specs;
5. Specs + strict validation to Gate 2;
6. explicit approval and hash verification before Design/Tasks/Apply;
7. reuse of an existing design rather than regeneration;
8. an optional sensitive-change Design Gate;
9. Tasks + Apply + Verify to Gate 3;
10. a mandatory stop before sync/archive.

Resume always selects the earliest unapproved or invalidated gate. Later file existence cannot bypass an earlier gate.

For an adopted change, missing review evidence is reconstructed from exact current artifact bytes: existing Proposal + Analysis produce Gate 1 and stop; after approval, existing delta specs are strict-validated without editing, produce Gate 2, and stop. Pre-existing artifacts remain byte-for-byte unchanged unless the user explicitly requests post-review corrections.

The analysis conclusion vocabulary is exactly `READY_FOR_SPECS`, `BLOCKED_NEEDS_REVIEW`, or `NO_SPEC_BEHAVIOR_CHANGE`. `CONFLICT` remains a conflict-section finding; a requirement-affecting conflict requires `BLOCKED_NEEDS_REVIEW`.

`$yuta-finish-change` requires a Gate 3 packet plus explicit current-user final approval and explicit authorization to sync and archive. It rechecks reviewed state, performs applicable normative promotion, validates main specs, and archives only after success.

## 4. Review gates

- Gate 1: `01-analysis-review.md` contains exact proposal and analysis content, authority findings, blockers/questions, conclusion, recommendation, and hashes.
- Gate 2: `02-specs-review.md` contains exact delta specs, approved Gate 1 reference, requirements/scenarios summary, strict validation evidence, assumptions, recommendation, and hashes.
- Conditional sensitive Design Gate: `02b-design-review.md` contains exact design, boundary implications, migration/rollback, unresolved choices, spec hashes, and recommendation.
- Gate 3: `03-final-review.md` contains planning hashes, implementation/spec/test mapping, task and verification evidence, scoped diff and hash, changed files, deviations/issues, and `Sync authorization: PENDING`.

Automation stops at every packet. Tests, OpenSpec status, file existence, commits, pull requests, and prior assistant text cannot substitute for explicit current-user approval.

## 5. Hash and invalidation mechanism

Packets record SHA-256 for exact artifact bytes and sorted path sets. Gate 3 additionally hashes the exact scoped implementation diff and a canonical verify-evidence block.

Every resume and finish operation recomputes current and earlier approved packet hashes. Any content or path-set drift changes the affected packet to `INVALIDATED_BY_ARTIFACT_CHANGE` and stops the workflow for re-review. Approval records use only:

```text
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
```

No universal approver identity is invented.

## 6. Sensitive-change behavior

A separate Design Gate is mandatory before apply when a change affects authorization/security, runtime/data ownership, migrations, payment/fiscal behavior, Personnel/legal/privacy data, external providers, POS transaction integrity, destructive/irreversible operations, or cross-module durable boundaries.

Normal bounded changes proceed from approved specs through applicable design, tasks, apply, and verify without an extra design gate. Requirement or durable-boundary conflicts always return to human review.

## 7. No-spec behavior

For an analysis conclusion of `NO_SPEC_BEHAVIOR_CHANGE`, Gate 1 remains mandatory. After explicit Gate 1 approval, the workflow requires valid `skip_specs: true` metadata and CLI state, skips Gate 2, and never invents a placeholder requirement or main spec.

Finalization of a valid no-spec change records that no normative promotion occurred, then archives only after all other review, implementation, verification, and integrity conditions pass.

## 8. Finish and sync policy

`$yuta-finish-change` refuses ambiguous approval or missing sync authorization. For behavior changes it:

1. validates all gate and artifact/diff hashes;
2. captures the pre-sync main-spec state;
3. performs the current intelligent delta-spec sync inline;
4. inspects the exact main-spec diff;
5. runs strict main-spec validation;
6. stops and applies the approved rollback policy on safe, recoverable failure;
7. archives only after applicable promotion and validation succeed.

Sync and archive never promote YUTA lifecycle values.

## 9. Protected files unchanged

Before setup, SHA-256 manifests were captured for:

- all `.agents/skills/openspec-*/**` files;
- `openspec/config.yaml`;
- the complete `openspec/schemas/yuta-spec-driven/**` tree;
- the complete current Pilot #1 change, `establishment-copy-primary-contact-to-public`.

Post-setup comparison result: **byte-for-byte unchanged for every protected manifest**.

Additional checks:

- New skill structural/frontmatter validation: **PASS** for both skills.
- Prettier check for both skills and workflow/review documentation: **PASS**.
- `pnpm docs:check`: **PASS**.
- `git diff --check`: **PASS**; Git emitted only existing LF-to-CRLF working-copy warnings for unrelated tracked documentation.

Bounded correction validation:

- Existing in-flight adoption behavior: **ADDED**.
- Existing-artifact byte preservation rule: **ADDED**.
- Earliest-gate precedence over later artifacts: **CONFIRMED**.
- Analysis conclusions restricted to the three valid YUTA values: **CONFIRMED**.
- `CONFLICT` removed from conclusion semantics and routed to `BLOCKED_NEEDS_REVIEW` when requirement-affecting: **CONFIRMED**.
- `$yuta-finish-change`, generated OpenSpec skills, schema/config, Pilot #1, and product code: **UNCHANGED**.

Product code was not modified. Pilot #1 was not continued. No review packet was pre-created.

## 10. Recommendation

`READY_TO_SMOKE_TEST_ON_PILOT_01`

Perform the smoke test only after this setup is reviewed and after the new skills are visible in a fresh Codex task/session.

Status: PROPOSED FOR REVIEW
