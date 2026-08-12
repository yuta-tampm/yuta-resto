# YUTA UI Implementation Guide

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-10

Protocol revision: 4

## Purpose

This directory governs design-to-code work for every YUTA frontend
application. UI implementation resolves repository/shared rules,
target-application rules, and an optional page or screen package. Current
Backoffice page packages keep their stable paths; new packages may target any
frontend application when their metadata identifies the application and
runtime unambiguously.

It turns an approved visual direction into maintainable UI without treating a screenshot as authority for product scope, navigation, data, authorization, or persistence.

Read this directory together with:

- the root `AGENTS.md`;
- the nearest application `AGENTS.md`;
- `docs/CURRENT_STATE.md`;
- the relevant current feature or product documentation;
- `DESIGN_TO_CODE_WORKFLOW.md` for meaningful design-to-code initiatives;
- `DELIVERY_WORKFLOW_MODES.md` to select the existing-capability or
  new-capability delivery mode;
- `YUTA_FRONTEND_RULES.md`;
- the target application's frontend rules, including
  `BACKOFFICE_FRONTEND_RULES.md` for Backoffice work and
  `POS_FRONTEND_RULES.md` for POS work;
- the current page package under `pages/<page-slug>/` when one exists;
- `packages/ui/src/index.ts` and `packages/ui/src/styles/global.css`.

`UI_WORKFLOW_DELIVERY_CHECKLIST.md` is the short daily gate from repository
analysis through as-built completion. `UI_PACK_TOOLING_SPEC.md` documents the
page-pack generator and validator lifecycle.

Workflow documentation is maintained as one synchronized system. Changes to
the lifecycle, modes, phases, classifications, fixtures, approval gates,
templates, prompts, checklist, page-pack protocol, or tooling must update
`DELIVERY_WORKFLOW_MODES.md` and every other affected current workflow artifact
in the same change.

Current page-pack tooling commands are:

```bash
pnpm ui:pack:new --app <application> --slug <page-slug> --target <route-or-id> [--type <target-type>]
pnpm ui:pack:check [<page-slug>]
pnpm test:ui-pack
```

The generator creates mechanics and unresolved metadata only. The validator
does not infer product decisions or silently migrate legacy packages.

## Authority order

When sources conflict, use this order:

1. root and nearest nested `AGENTS.md`;
2. `docs/CURRENT_STATE.md`, current architecture, and approved feature/product documentation;
3. implemented contracts, schemas, authorization, tests, and route conventions;
4. the target application's UI rules;
5. the current page-specific product, UI, and interaction specifications;
6. `@yuta/ui` exports and semantic tokens;
7. visual reference images;
8. model judgment.

Images may guide hierarchy, proportions, density, spacing, and visual tone. They must not be used to infer navigation, permissions, domain fields, API design, or unsupported product capabilities.

## Directory structure

```text
docs/ui/
├── README.md
├── DESIGN_TO_CODE_WORKFLOW.md
├── YUTA_FRONTEND_RULES.md
├── BACKOFFICE_FRONTEND_RULES.md
├── POS_FRONTEND_RULES.md
├── PAGE_PACK_PROTOCOL.md
├── UI_PACK_TOOLING_SPEC.md
├── UI_WORKFLOW_DELIVERY_CHECKLIST.md
├── references/
│   ├── README.md
│   └── yuta-shell-brand-reference.png
├── templates/
│   ├── README.md
│   └── page/
│       ├── README.md
│       ├── PRODUCT_SCOPE.md
│       ├── UI_SPEC.md
│       ├── DATA_AND_INTERACTION_SPEC.md
│       ├── DESIGN_HANDOFF.md
│       ├── IMPLEMENTATION_PLAN.md
│       ├── ACCEPTANCE_CHECKLIST.md
│       ├── references/
│       └── prompts/
│           ├── 00_REPOSITORY_ANALYSIS.md
│           ├── 01_VISUAL_BASELINE.md
│           ├── 02_COMPONENT_REFACTOR.md
│           ├── 03_INTERACTIONS.md
│           ├── 04_DATA_INTEGRATION.md
│           └── 05_VISUAL_QA.md
└── pages/
    ├── README.md
    └── <page-slug>/
        ├── README.md
        ├── PRODUCT_SCOPE.md
        ├── UI_SPEC.md
        ├── DATA_AND_INTERACTION_SPEC.md
        ├── DESIGN_HANDOFF.md
        ├── IMPLEMENTATION_PLAN.md
        ├── ACCEPTANCE_CHECKLIST.md
        ├── references/
        └── prompts/
```

## Page packages

When an initiative warrants a page package, it receives one stable directory:

```text
docs/ui/pages/<page-slug>/
```

Do not create parallel `v2`, `new`, `final`, or `latest` directories. Update the current package in place and rely on Git history.

The required artifact shape and packaging rules are defined in `PAGE_PACK_PROTOCOL.md`.

## Repository-first workflow

The canonical lifecycle is defined in `DESIGN_TO_CODE_WORKFLOW.md`:

```text
target identification
-> repository analysis
-> product and implementation scope
-> UI design
-> design approval
-> implementation-ready package
-> implementation
-> functional and regression QA
-> visual and responsive QA
-> as-built documentation sync
```

Repository analysis happens before final design even when a mockup is supplied.
The final implementation-ready package follows design approval. The concise
phase summary below does not replace the canonical lifecycle.

### Phase 0 — Repository analysis gate

Phase 0 makes no code changes. Before editing, produce an Implementation
Inventory that:

- classifies the target as `NEW_PAGE` or `EXISTING_PAGE` and as visual-only,
  interactive, integrated, or device-coupled;
- identifies the real route, shell, page container, and nearby pages;
- reads root and application instructions;
- inspects the applicable authorization, public-resolution, local-session, or
  standalone-local boundary;
- identifies the data owner, transport/contracts, forms, mutations,
  transactions, polling, offline/retry, provider, printing, and device behavior
  that apply;
- inspects `@yuta/ui` exports and semantic tokens;
- identifies protected business/runtime invariants and tests;
- captures or records the current visual baseline for an existing screen;
- reports conflicts between the design and the implemented domain;
- records exact repository commands available for verification.

Phase 0 also resolves the shared UI context supplied to the design tool. Record
YUTA-global, application, section/flow, and page layers; select the exact
shell/navigation mode; inventory real routes; and assemble the curated baseline
and shared-reference bundle. A missing header, sidebar, navigation, account
area, responsive convention, or common state pattern is a blocker or separate
cross-page proposal, not permission for the design tool to invent one.

For an existing integrated route, improve it in place. Do not replace working behavior with fixture data merely because a generic design workflow begins with a static phase.

### Phase 1 — Establish the visual baseline

For a new route, a typed responsive static composition may be appropriate before persistence.

For an existing route:

- capture the current page;
- compare it with the current written specification and visual references;
- preserve authorization, server boundaries, data loading, and mutations;
- make the smallest visual change that establishes the approved hierarchy.

For a device-coupled route, also preserve worker, queue, hardware,
focus/visibility, polling, retry, and physical-success boundaries.

For current Backoffice page packages, use:

```text
1440 px
1024 px
768 px
390 px
```

Other applications use their application rules, current product/operator
documentation, and page package. Do not apply the Backoffice viewport matrix
globally.

### Phase 2 — Improve component boundaries

Keep page-specific components near the route. Extract only meaningful units, reuse shared primitives, and avoid wrappers that merely rename an existing component.

Move a component to `@yuta/ui` only after independent reuse is proven.

### Phase 3 — Implement approved interactions

Add only behavior defined by current product decisions. Do not guess:

- merge or replace semantics;
- destructive behavior;
- validation;
- dirty-state behavior;
- whether a preview uses saved or unsaved values;
- whether a visual control has a persisted domain representation.

### Phase 4 — Integrate or extend data

Map the existing domain model to the UI model before editing persistence.

A missing field is a product/schema proposal, not permission to add a column, contract field, enum value, route, or permission.

### Phase 5 — Visual and responsive QA

Review in this order:

1. global/application/section shared-context fidelity;
2. shell, navigation, and page-container alignment;
3. page-specific hierarchy and content/data fidelity;
4. spacing and density;
5. typography and semantic color;
6. responsive stacking and overflow;
7. keyboard, focus, labels, and state communication.

Separate visual corrections from backend refactors.

## Current visual foundation

The repository implementation is authoritative.

Use:

- shared components exported by `packages/ui/src/index.ts`;
- semantic tokens defined in `packages/ui/src/styles/global.css`;
- `lucide-react`;
- the typography approved by the target application's current instructions.

Before page design, also resolve the applicable shared visual context from
`docs/ui/references/`, the current application/section implementation, and
approved page packages. Supply that curated context to the design tool before
page-specific requirements. Never infer application-wide ownership from a
single route screenshot.

Use role-based classes such as:

```text
bg-canvas
bg-surface
bg-surface-muted
bg-surface-selected
text-primary
text-secondary
text-muted
text-inverse
border-border-default
border-border-strong
bg-action-primary
bg-action-danger
ring-focus-ring
status-*
```

Do not introduce a second token vocabulary, copy color values from references, or duplicate the public component catalog in documentation.

## Verification

Use the repository-wide commands defined by `YUTA_FRONTEND_RULES.md`, then the
target application's typecheck, tests, and build. For Backoffice work, also use
the commands and browser widths in `BACKOFFICE_FRONTEND_RULES.md`.

Common repository checks are:

```text
pnpm docs:check
pnpm format:check
pnpm architecture:check
pnpm -r --if-present typecheck
```

Run affected auth, tenant, contract, domain, database, local runtime, and device
tests when their behavior changes.

Browser QA verifies:

- console and hydration errors;
- keyboard operation;
- visible focus;
- responsive layout;
- horizontal overflow;
- truthful loading, empty, error, forbidden, conflict, success, and recovery states.

## Delivery evidence

Every UI delivery reports:

- route and files changed;
- shared primitives reused and page-specific components added;
- domain/design conflicts and intentional deviations;
- commands and exact results;
- browser evidence at requested widths;
- accessibility and overflow observations;
- deferred work and risks.

Do not claim visual parity without browser evidence.
