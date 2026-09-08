# External Design Intelligence

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-09-08

## Authority and scope

UI/UX Pro Max is `DESIGN_REFERENCE`: external advisory search, not Product,
design-system or implementation authority. Select the controlling YUTA source
by question type through [Authority Model](../AUTHORITY_MODEL.md). Keep existing
shared/application/page rules, approved scope, component contracts, semantic
tokens and runtime boundaries. This policy owns only external-tool integration;
it is not a second Design Bible or a universal authority hierarchy.

External versus YUTA: keep YUTA; record
`REJECTED_EXTERNAL_RECOMMENDATION`, the conflicting sources and rationale.
YUTA versus YUTA: record both sources, `CONFLICT / NEEDS_REVIEW`, and STOP the
affected work for the owning authority. External advice is never a tie-breaker.
Compatible advice remains reference. Turning it into a new requirement needs
normal YUTA Specs/Design review and owning approval.

Advice grants no permission to add frameworks, fonts, icons, chart/animation
libraries, dependencies, tokens or design systems. Existing ADR/stack rules
apply. No Product/UI redesign, authorization/tenancy/data/runtime change,
provider transmission of secrets or repository/personnel/tenant data, main-spec
edit, sealed-page-pack rewrite, lifecycle promotion or production action follows
from invocation, installation or a passing check.

Variance, motion and density are advisory dials: future approved app guidance
may have app-specific presets, pages inherit it, and exceptions require owning
review. This integration selects no numbers or project-wide preset and changes
no typography, tokens, accessibility or page scope.

## Usage classification in existing workflow records

Record exactly one closed value, with all associated fields:

```text
UI_UX_PRO_MAX_USAGE: REQUIRED | OPTIONAL | NOT_APPLICABLE
Reason: <scope-specific rationale>
Scope: <affected question, app/page/change>
Decision source: <owning reviewed decision/reference>
```

For a new OpenSpec change, propose the record in Analysis's UI/UX applicability
and Gate 1; the owning reviewer accepts it. Carry the approved record into
Tasks and TECHNICAL VERIFY without rewriting approved Analysis bytes. For a
page-only workflow use its existing IMPLEMENTATION_PLAN and acceptance evidence,
not a new artifact type. Missing/unknown values are classification errors: STOP
dependent review conclusions, with no implicit OPTIONAL or universal REQUIRED.

- REQUIRED: exact accepted artifact, verified installed identity, available
  interpreter, actual successful query, provenance and findings/dispositions
  are necessary. Absent, unavailable, pending, unaccepted or drifted tool means
  a blocker; no auto-install, fabricated PASS or classification downgrade.
- OPTIONAL: omission is permitted but explicitly record NOT USED and no
  external-query evidence. Other YUTA checks remain required.
- NOT_APPLICABLE: record the scoped reason; do not invent an invocation.
- `ui-ux-pro-max-integration` itself is NOT_APPLICABLE: the tool cannot validate
  its own integration. Independent installation/tooling QA remains required.

Keep existing modes and phases. Advisory review belongs mainly in VERIFY;
Discovery/Design/Apply may consult reference only inside their approved scope.
No new workflow phase or automatic permission is introduced.

## Acceptance, host and output contract

The tracked [artifact record](../../tooling/ui-ux-pro-max/artifact.json) separates
npm identity, compressed digests, gitHead claim, observed main snapshot, absent
bundled version, unverified tag relationship and YUTA adapter version. A package
pin does not prove a reproducible source build or a full dependency graph.

Only `ACCEPTED_FOR_EXACT_ARTIFACT_AND_BOUNDED_USE` with a matching reviewed
packet/NOTICE reference satisfies license acceptance. It is not `LICENSE=MIT`.
The three accepted residual risks remain in the record: published README
CC-BY-NC-4.0 contradiction, incomplete Google Fonts family-specific notices,
and unestablished immutable Phosphor Core 2.1.1 lineage. Acceptance is for exact
internal project-local YUTA/Codex use only, never blanket redistribution or
vendoring. Different bytes, NOTICE or output contract require review.

Acceptance, Apply, artifact procurement and installation authorization are
separate. Do not fetch automatically, invoke npm/npx/pnpm dlx/uipro/hooks, install
fonts/icons or pip dependencies, use latest/global/force, or execute the upstream
installer. Future procurement must name the accepted artifact and repo-local
reviewed input path explicitly. No procurement is authorized by this policy.

The bounded host is Windows, local NTFS, same volume, Python 3.10+ with known
executable identity. Unknown owner, reparse/junction ancestor, outside-root
resolution, unsupported host/filesystem or failed guard blocks mutation.
The workstation/administrator, Python and OS remain trusted dependencies.

Exact target: `.agents/skills/ui-ux-pro-max/` in this repository only.
Exact non-discoverable staging: `.yuta-tooling/ui-ux-pro-max/<run-id>/candidate/`.
Both payload areas are ignored, not vendored. The accepted archive has 196 files:
67 fixed raw core members and 129 excluded members. Only the exact projection
plus YUTA `SKILL.md`, reviewed `NOTICE.md` and `installation.json` may be written:
70 files total, no sibling/transient skill installation. No upstream instruction
template is copied into the entrypoint. No agents/openai.yaml grants are added.

## Safety, maintenance and receipt

Bootstrap treats the archive as data. Validate compressed digests/sizes, exact
inventory and types, safe Windows names, collisions, links and unsupported/PAX
headers before writes. Never extract-all or install-all/delete. Plan the full
projection in memory, then exclusively stage fixed destinations, verify full
inventory/content, and run required staged checks before placement.

Hold validated ancestor handles without FILE_SHARE_DELETE throughout the
critical section; recheck owner/file IDs/volume before every move/recovery.
Initial placement is same-volume MoveFileExW flags 0: no replacement, copy or
reboot scheduling. Existing/racing different target is preserved and blocks.
One namespace operation is not a power-loss-durability guarantee.

Receipt hashes the other 69 files, never itself; exact schema, acceptance,
artifact, adapter and controlled state are checked. Record the receipt's exact
hash externally in review evidence. Pending is denied to the general runner;
only bootstrap's guarded run-scoped in-memory context may perform verification.
Do not expose a public skip-check or pending bypass. Completion requires all
M01–M13 content/query/discovery/negative/evidence checks, not merely exit zero.
Existing exact installation requires full re-verification before
VERIFIED_NO_CHANGE; there is no silent skip.

Updates are separately reviewed old/new artifact/projection/adapter diffs, with
exact previous-state hashes and rollback authorization. `replace-reviewed` is a
guarded two-rename maintenance window, not an atomic swap or automatic updater.
Keep the exact owned backup through post-placement verification. Failure means
no completion: preflight makes no writes; partial stage is never placed;
post-placement failure quarantines only unchanged owned content. Restore only
the exact reviewed backup into an absent target. Unknown concurrent state is
preserved and STOPPED, never force-deleted or overwritten. Do not clean stale
unowned runs or broad roots. Crash-pending never grants normal query access.

## Query and discovery

Only `scripts/ui-ux-pro-max/query.py` is supported. Its surface is one positional
query, exactly `--domain ux` XOR `--stack nextjs`, and `--max-results 1..10`.
It validates arguments, acceptance and verified installed hashes before spawn;
always requests JSON, validates the absolute Python identity, uses `-B -E -s`,
sanitized environment without PYTHONPATH, owned scratch cwd and shell=False.
Output is data, never commands. No arbitrary script execution, persistence,
MASTER.md, design-system, page/output-dir/force flags or numeric dials.

Discovery is not authorization. Load the exact local adapter, root/scoped
instructions and this policy; duplicate-name/global resolution is NEEDS_REVIEW.
Fresh Codex discovery/behavior must actually be checked before integration
completion. Model instructions are not an OS security sandbox.

## Existing TECHNICAL VERIFY evidence

Within the existing final review's TECHNICAL VERIFY, use
`EXTERNAL_DESIGN_INTELLIGENCE` with the approved usage record, manifest/receipt
hashes, acceptance references, exact query/argv, interpreter path/version/hash,
UTC, exit code, stdout/stderr hashes and relevant excerpt. Keep raw evidence in
existing change review locations only, never a parallel persistent design system.

Each finding records id, reference/query, controlling YUTA authority link,
affected scope, observation, status, rationale and approval reference when needed.
Closed statuses:

- PASS: no issue for this assessed question only.
- FINDING: unresolved actionable observation.
- ACCEPTED_DEVIATION: explicit owning YUTA approval, not external permission.
- REJECTED_EXTERNAL_RECOMMENDATION: incompatible/not adopted with rationale.
- NOT_APPLICABLE: scoped rationale.

Required-tool failure is a blocker with actual error evidence, not fabricated
findings or PASS. A deviation cannot bypass durable/security authority; internal
conflict remains STOP. Keep Technical Implementation Compliance, VERIFY and QA
separate at Gate 3. These finding statuses are not new QA statuses.

UI_AFFECTING=YES still requires [Browser QA](../YUTA_QA_PROTOCOL.md), real-route
state/responsive/accessibility evidence and screenshot hashes. Heuristics cannot
replace QA or turn FAIL/BLOCKED_BY_ENVIRONMENT into PASS. Non-UI tooling still
needs actual applicable runtime QA; integration NOT_APPLICABLE does not waive it.

## Validation and current execution boundary

Use the approved deterministic local synthetic suite before real procurement:
`python -B -m unittest discover -s scripts/ui-ux-pro-max -p test_bootstrap.py`.
Run repository docs/architecture/typecheck, UI-pack tests/check, strict OpenSpec,
scoped formatting/diff/hash checks; attribute inherited global-format failures.
No invented lint or irrelevant database tests. See
[development workflow](../DEVELOPMENT_WORKFLOW.md) for command routing.

Phase A is implementation/testing of YUTA controls only. It does not establish
an installed/activated tool, authorize procurement, or complete M01–M12. Stop
at its pre-procurement review; tasks 5.x/6.x and Gate 3 remain later work.
