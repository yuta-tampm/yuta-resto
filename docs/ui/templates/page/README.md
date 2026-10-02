# <Page or screen name>

Status: Draft design package

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `<apps/...>`

Target type: `UNKNOWN`

Route / entry point: `<real route or screen entry>`

Runtime family: `<cloud | public cloud | local POS | standalone local | repository-defined value>`

Page classification: `UNKNOWN`

Implementation class: `UNKNOWN`

Package status: `design`

Scope status: `DRAFT`

Reference status: `NONE`

Inventory status: `PENDING`

Baseline status: `PENDING`

Design prompt status: `PENDING`

Shared context status: `PENDING`

Prompt snapshot topology: `GENERATED_SNAPSHOTS`

Prompt provenance: `prompt-provenance.json`

No-image reference reason: `<required when Reference status is NONE after design approval>`

## Current implementation

Complete this section from Phase 0. List the real route/shell files and
summarize current behavior without guessing.

## Authority

Read in order:

1. root `AGENTS.md`;
2. nearest application `AGENTS.md`;
3. `docs/CURRENT_STATE.md` and relevant architecture, product, feature,
   operations, and QA docs;
4. `docs/ui/README.md`, `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`, and
   `docs/ui/YUTA_FRONTEND_RULES.md`;
5. implemented contracts, schema, session/authorization, business logic, and
   tests;
6. target-application UI rules;
7. this page package;
8. `@yuta/ui` exports and semantic tokens;
9. visual references.

Application-specific UI rules: `<path or "none; use nearest AGENTS/product docs">`.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

List page-specific images and their purpose.

Images are non-authoritative.

## Shared UI context

Summarize the resolved YUTA-global, application, section/flow, and page layers.
Link approved shared references, identify the exact shell/navigation mode, and
state which common elements must be reused, may adapt, or are forbidden.

## Protected invariants

Summarize the runtime, business, session, data, polling, offline, and device
invariants discovered in Phase 0 that UI work must preserve.

## Change impact

```text
Files expected to modify:
Files expected to create:
Packages affected:
Cross-application impact:
Database change: YES | NO | PROPOSAL
API or contract change: YES | NO | PROPOSAL
Permission/auth change: YES | NO | PROPOSAL
Runtime/device change: YES | NO | PROPOSAL
```

## Design approval

Record the approved scope/reference, approval date, and reviewer or the explicit
no-image decision. A draft reference is not implementation authority.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

Review each phase before starting the next.

The generator reads `prompt-template.json`, copies the six canonical prompts,
writes their sealed provenance to `prompt-provenance.json`, and excludes the
template-only metadata file from the generated pack. Agents working in the pack
execute the local prompt snapshots. Later canonical-template changes never
rewrite those snapshots.

## Stop conditions

Stop and request approval when implementation would require an unsupported
product capability, field, enum, permission, contract, API route,
schema/migration, runtime dependency, hardware/device setting, or change to a
protected business invariant.

## Final delivery and as-built status

Complete only after implementation and QA:

Final implementation locations/files changed: `<required>`

Verification commands and results: `<required>`

Functional/regression QA result: `<required>`

Visual/browser/device evidence: `<required when UI changed>`

Intentional deviations: `<required; use NONE when applicable>`

Deferred proposals and risks: `<required; use NONE when applicable>`

As-built documentation status: `PENDING | COMPLETE`
