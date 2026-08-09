# <Page or screen name>

Status: Draft design package

Visibility: Engineering

Owner: YUTA product and engineering

Application: `<apps/...>`

Route / entry point: `<real route or screen entry>`

Runtime family: `<cloud | public cloud | local POS | standalone local | repository-defined value>`

Page classification: `<NEW_PAGE | EXISTING_PAGE>`

Implementation class: `<visual-only | interactive | integrated | device-coupled>`

## Current implementation

Complete this section from Phase 0. List the real route/shell files and
summarize current behavior without guessing.

## Authority

Read in order:

1. root `AGENTS.md`;
2. nearest application `AGENTS.md`;
3. `docs/CURRENT_STATE.md` and relevant architecture, product, feature,
   operations, and QA docs;
4. implemented contracts, schema, session/authorization, business logic, and
   tests;
5. target-application UI rules;
6. this page package;
7. `@yuta/ui` exports and semantic tokens;
8. visual references.

Application-specific UI rules: `<path or "none; use nearest AGENTS/product docs">`.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

List page-specific images and their purpose.

Images are non-authoritative.

## Protected invariants

Summarize the runtime, business, session, data, polling, offline, and device
invariants discovered in Phase 0 that UI work must preserve.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

Review each phase before starting the next.

## Stop conditions

Stop and request approval when implementation would require an unsupported
product capability, field, enum, permission, contract, API route,
schema/migration, runtime dependency, hardware/device setting, or change to a
protected business invariant.
