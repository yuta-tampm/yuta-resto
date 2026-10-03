# ADR-012: Select checks by impact and reuse attributable evidence

Status: Accepted

Date: 2026-10-03

Decision owners: YUTA

Decision type: Engineering governance

Decision source: The current user's 2026-10-03 approval to implement the
checkout guard and validation/repetition assessment sequentially in separate
worktrees/branches, followed by the explicit `CODEX_ONLY` selection. The
bounded design, including conservative CI selection and preservation of
owner/gate obligations, was independently APPROVED by
`/root/validation_design_review` on 2026-10-03. Local commit selection remains
separate; this decision grants no remote delivery or operational authority.

## Context

The existing CI workflow runs all four groups for feature pushes, PR updates
and main pushes. Documentation changes receive application suites/builds, and
the local validation instruction lists recursive typecheck universally.
Repeated runs can therefore consume time without new evidence. Conversely,
typecheck, tests, builds and QA cover distinct risks; deleting repetitions
without checking their inputs or purpose can lose required evidence.
The existing cloud/local groups also omit the UI package's own test script.

## Decision

Keep documentation, architecture and format guards as the baseline. Classify
typed runtime, tooling, dependency/configuration and owner-specific checks from
the current candidate and approved behavior. Uncertain impact retains full
validation. Evidence reuse requires equivalent inputs/environment and retained
attributable success; it is recorded as reuse, never a new PASS or approval.

CI runs PR updates once, cancels only superseded PR runs, and preserves every
main push with full selection. PR classification binds to the exact merge
candidate tested by every job. Stable family jobs fail on unsuccessful or
invalid prerequisites and report inapplicable groups explicitly. Shared/UI
selections run the existing UI tests separately. Generic full tooling is a
repository CI baseline; the specialized format-policy suite keeps its own
approved-source/runtime prerequisites and is explicitly selected on its inputs.
Its generic-run disposition is NOT_RUN, not success or an owner-gate waiver.

The procedure and check catalog have one current home:
[Development Workflow](../DEVELOPMENT_WORKFLOW.md#check-applicability-and-repeat-decisions).
The planner is a grouped CI minimum, not an owner-specific completion,
security, migration, QA or gate waiver. Existing suites are retained.

## Alternatives considered

- Always run every suite everywhere: simple, but repeats feature push and PR
  work and treats unrelated documentation as runtime impact.
- Trust a previous PASS or a single file hash: cannot establish equivalent
  coverage, generated prerequisites, integration tree or environment.
- Use only workflow-level path filters: can leave required checks pending and
  does not protect prerequisite failure.
- Reuse remote CI artifacts across merge candidates: adds trust/invalidation
  complexity; deferred. Main full execution remains deliberate.

## Consequences

Known documentation/tooling PRs can avoid unrelated runtime groups, and every
skipped or repeated check has an explicit reason. Conservative global/main
runs retain cost; future mapping changes require review. Live GitHub behavior
and elapsed savings remain unverified until this change is delivered. The
existing formatting-preservation policy and deployment authority remain intact.
