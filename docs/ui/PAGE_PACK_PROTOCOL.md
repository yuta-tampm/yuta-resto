# YUTA UI Page Pack Protocol

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-09

Protocol revision: 3

## Purpose

This protocol defines repository-ready UI/Codex page packages for every YUTA
frontend application. It prevents a Backoffice template from being applied
blindly to POS, Display, public web, or another runtime.

It prevents flat, ambiguous packs and ensures that visual references, product decisions, implementation instructions, and acceptance criteria remain scoped to one stable page directory.

## Trigger convention

The project shorthand is:

```text
Lên UI + Codex pack chuẩn cho page `<route or page name>`.
```

The resulting package must comply with this document.

When the application is ambiguous, identify the target from repository
evidence before implementation. Do not infer it from the mockup alone.

## ZIP root rule

The archive entry paths must begin directly at:

```text
docs/ui/pages/<page-slug>/
```

Correct:

```text
docs/ui/pages/today/README.md
docs/ui/pages/today/UI_SPEC.md
```

Incorrect:

```text
YUTA_TODAY_CODEX_PACK/docs/ui/pages/today/README.md
```

Incorrect:

```text
YUTA_TODAY_CODEX_PACK/01_UI_SPEC.md
```

The archive must be safe to extract at the repository root.

## Slug rules

A page slug:

- is lowercase;
- uses hyphens;
- contains no accents;
- remains stable across revisions;
- normally follows the real route or established feature vocabulary.

Examples:

```text
/aujourdhui                         -> today
/etablissement/horaires-services   -> hours-services
/etablissement/informations        -> establishment-information
/equipe/taches-quotidiennes        -> daily-tasks
```

Because `docs/ui/pages/` is shared across applications, new slugs must be
unambiguous repository-wide. If vocabulary can collide, include an application
or feature qualifier:

```text
apps/yuta-pos /management           -> pos-management
apps/yuta-pos /management/printing  -> pos-management-printing
apps/yuta-pos /pos                  -> pos-order-entry
```

Do not rename existing stable Backoffice packages solely to match this
recommendation.

Do not create `v2`, `v3`, `new`, `final`, or `latest` page directories.

## Required page structure

```text
docs/ui/pages/<page-slug>/
├── README.md
├── PRODUCT_SCOPE.md
├── UI_SPEC.md
├── DATA_AND_INTERACTION_SPEC.md
├── IMPLEMENTATION_PLAN.md
├── ACCEPTANCE_CHECKLIST.md
├── references/
└── prompts/
    ├── 00_REPOSITORY_ANALYSIS.md
    ├── 01_VISUAL_BASELINE.md
    ├── 02_COMPONENT_REFACTOR.md
    ├── 03_INTERACTIONS.md
    ├── 04_DATA_INTEGRATION.md
    └── 05_VISUAL_QA.md
```

`PRODUCT_SCOPE.md` may be omitted only when the page is trivial and its scope is fully governed by an existing current feature document. The page `README.md` must state the reason.

## Shared documentation

Do not copy shared rules into every page package.

Shared authority remains:

```text
docs/ui/README.md
docs/ui/YUTA_FRONTEND_RULES.md
packages/ui/src/index.ts
packages/ui/src/styles/global.css
```

Each package also links to the target application's specific rules. Backoffice
packages link to `docs/ui/BACKOFFICE_FRONTEND_RULES.md`.

POS packages link to `docs/ui/POS_FRONTEND_RULES.md` and the current
`docs/products/pos/*` documents relevant to the screen.

Page documents link to these sources rather than reproducing the component
export catalog, application rules, or design-token implementation.

## Required file responsibilities

Before these files are completed, `prompts/00_REPOSITORY_ANALYSIS.md` must
produce a read-only Implementation Inventory covering:

- target application and real route or screen;
- `NEW_PAGE` or `EXISTING_PAGE`;
- visual-only, interactive, integrated, or device-coupled classification;
- route, shell, and container files;
- the applicable auth, tenant, public-resolution, local-session, or
  standalone-local boundary;
- data owner, persistence boundary, and transport/contracts;
- loaders, actions, mutations, validation, and transactions;
- polling, offline, retry, provider, printer, or device behavior;
- current shared UI primitives and tokens;
- current visual baseline for an existing screen;
- tests, authoritative documentation, and protected invariants;
- conflicts and unsupported proposals;
- exact repository verification commands.

No later phase may assume a Backoffice tenant model, POS local model, API,
permission, schema, device capability, or business rule absent from this
inventory and higher-authority documentation.

### `README.md`

Contains:

- page name and route;
- target application;
- current implementation status;
- authority order;
- page documents;
- references;
- prompt execution order;
- important stop conditions.

### `PRODUCT_SCOPE.md`

Contains:

- user goal;
- current approved capabilities;
- out-of-scope capabilities;
- current product and domain boundaries;
- proposed capabilities requiring separate approval;
- relationships with other features.

### `UI_SPEC.md`

Contains:

- current visual and behavioral baseline;
- page hierarchy;
- content structure;
- French UI copy;
- responsive behavior;
- accessibility;
- visual acceptance;
- intentional deviations from mockups.

It must not describe unsupported persistence as if it already exists.

### `DATA_AND_INTERACTION_SPEC.md`

Contains:

- mapping from current domain fields to UI fields;
- current interactions;
- current mutations and permissions;
- validation;
- pending, error, success, and recovery states;
- tenant, establishment, locale, and timezone boundaries;
- explicit gaps requiring product/schema decisions.

A UI model is not a database schema.

### `IMPLEMENTATION_PLAN.md`

Uses six phases but adapts them to route maturity.

For a new route, Phase 1 may use typed fixture data.

For an existing integrated route, Phase 1 improves the visual baseline in place and must preserve working authorization, loading, data access, mutations, and tests.

### `ACCEPTANCE_CHECKLIST.md`

Covers:

- repository and tenant boundaries;
- product scope;
- visual structure;
- current behavior preservation;
- responsive layout;
- accessibility;
- truthful states;
- documentation;
- exact repository checks;
- browser evidence.

### `references/`

Contains page-specific visual evidence only.

Global shell or brand references belong in:

```text
docs/ui/references/
```

Each reference must be described in the page `README.md`. Images are non-authoritative.

### `prompts/`

Contains one focused instruction per phase. Do not replace these with one large `CODEX_PROMPT.md`.

## Existing-route rule

Before producing implementation prompts, determine whether the route already exists.

When it exists and is integrated:

- do not instruct Codex to recreate it from fixture data;
- do not discard working forms, authorization, or server actions;
- require current-page screenshots before editing;
- preserve current domain behavior;
- treat unsupported mockup fields as proposals;
- separate visual improvement from data-model extension.

For a device-coupled screen, also preserve current worker, queue, hardware,
polling, visibility/focus, retry, and physical-success boundaries.

## New-route rule

When the route does not exist:

- inspect current route and shell conventions first;
- define product scope before persistence;
- typed fixtures may establish the visual baseline;
- do not add contracts, permissions, or schema fields before mapping and approval.

Typed fixtures cannot masquerade as an implemented backend capability.

## Reference-image rule

A generated or supplied image may guide:

- hierarchy;
- density;
- proportions;
- spacing;
- visual tone.

It must not define:

- navigation;
- permission;
- route ownership;
- domain fields;
- database shape;
- mutation behavior;
- unsupported modules;
- exact colors.

## Verification before delivery

Before delivering a ZIP:

1. list every archive entry;
2. confirm the first entries begin with `docs/ui/pages/<page-slug>/`;
3. confirm all required files exist;
4. confirm there is no outer wrapper directory;
5. confirm page references are inside the page package;
6. confirm shared documents are not duplicated;
7. confirm the prompts distinguish new, existing, integrated, and
   device-coupled behavior;
8. confirm the package uses current repository command names;
9. print the actual archive tree;
10. report any intentionally omitted file.

## Updating an existing page package

Update the stable directory in place.

The update must identify:

- files changed;
- product decisions changed;
- references replaced;
- prompts affected;
- documentation links that Codex must update.

Git history records prior versions.
