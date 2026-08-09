# YUTA Design-to-Code Workflow

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-09

Protocol revision: 3

## Purpose

This document defines the canonical lifecycle for meaningful design-to-code
work across every YUTA frontend application. It complements
`YUTA_FRONTEND_RULES.md` and
`PAGE_PACK_PROTOCOL.md` by defining when repository analysis, product scoping,
visual design, approval, implementation, regression QA, visual QA, and
documentation synchronization occur.

The workflow applies to pages, screens, operational surfaces, and multi-step
flows. It is application-neutral. Application-specific runtime, authorization,
data, device, and QA rules remain owned by the nearest `AGENTS.md`, current
product/architecture documentation, and application frontend rules.

Small maintenance changes that do not warrant a page package still follow the
shared and application rules, but they do not need to manufacture lifecycle
artifacts solely to satisfy this workflow.

## Core principle

Use the following authority split:

```text
repository reality -> what the target can currently do
approved product scope -> what the target should do
approved visual reference -> how the target should look
```

A visual reference never authorizes new navigation, domain fields, permissions,
contracts, APIs, persistence, runtime ownership, printer/device behavior, or
business logic.

## Canonical lifecycle

```text
0. Target identification
        ↓
1. Repository analysis
        ↓
2. Product + implementation scope
        ↓
3. UI design
        ↓
4. Design approval
        ↓
5. Final page/screen package
        ↓
6. Implementation
        ↓
7. Functional + regression QA
        ↓
8. Visual + responsive QA
        ↓
9. As-built documentation sync
```

The final implementation package is created after the visual direction is
approved. Repository analysis always happens before design, including when the
request already contains a mockup.

## Step 0 — Target identification

Before analysis, identify the target from the request and repository evidence.
Record:

- application;
- target type: `PAGE`, `SCREEN`, `SURFACE`, or `FLOW`;
- route, screen identifier, or entry point when known;
- page-package slug when a package already exists;
- initial implementation status as `UNKNOWN` until repository analysis proves
  `NEW_PAGE` or `EXISTING_PAGE`.

Do not infer the application from the mockup when repository evidence can
resolve it.

## Step 1 — Repository analysis gate

Repository analysis is read-only. It must happen before design decisions are
finalized and before implementation code is changed.

Produce an Implementation Inventory covering, as applicable:

- target application and real route/screen/entry point;
- `NEW_PAGE` or `EXISTING_PAGE`;
- implementation class: visual-only, interactive, integrated, or
  device-coupled;
- application shell and route/container files;
- nearby implementation conventions and reusable components;
- auth, tenant, public-resolution, local-session, or standalone-local boundary;
- state owner, data owner, persistence boundary, and transport/contracts;
- loaders, queries, actions, mutations, transactions, and validation;
- provider, polling, offline, retry, local-service, printer, worker, or device
  behavior;
- existing tests protecting the target;
- current visual baseline for an existing target;
- current authoritative documentation;
- exact verification commands that exist in the repository;
- conflicts between the request/reference and repository reality;
- unsupported concepts requiring approval.

No implementation begins in this step.

### Required Phase 0 design handoff

After the Implementation Inventory, complete `DESIGN_HANDOFF.md` before UI
design begins. The Phase 0 handoff output is:

1. the completed Implementation Inventory;
2. a current authenticated browser/device capture for `EXISTING_PAGE`, including
   route/state, viewport or device, capture date, and runtime/session conditions;
3. a truthful `BLOCKED` record with the exact resume condition when the current
   baseline cannot be captured, or `NOT_APPLICABLE` for `NEW_PAGE`;
4. a self-contained design-generation prompt ready for ChatGPT/ImageGen or
   another approved design tool.

Repository-derived layout notes do not count as visual evidence. Baseline
capture is read-only and must not require replacing real data, bypassing auth,
or changing application code. The design-generation prompt must preserve the
inventory's protected invariants and explicitly exclude unsupported concepts.

A blocked baseline may remain in a `design` package, but an existing-page pack
cannot advance to `approved` or `implementation-ready` until the baseline is
captured. Generated mockups enter the package as `DRAFT` references and still
require design review.

## Step 2 — Product and implementation scope

Convert the repository findings into a concise implementation boundary before
visual design is finalized.

### Required scope decisions

Define:

- user goal;
- approved capabilities;
- out-of-scope capabilities;
- approved interaction changes;
- unsupported proposals;
- protected invariants;
- expected change impact.

### Protected invariants

Protected invariants are mandatory for an existing integrated or device-coupled
target. Examples include authorization, tenant scope, local session, data
ownership, mutation semantics, transaction behavior, polling, offline/retry,
printing, hardware ownership, historical accuracy, and behavior-protecting
tests.

Application-specific rules determine which invariants apply. Do not copy
Backoffice invariants into POS or POS invariants into cloud applications.

### Change impact

Before implementation, record the expected change surface:

```text
Files expected to modify:
Files expected to create:
Packages affected:
Cross-application impact:
Database change: YES / NO / PROPOSAL
API or contract change: YES / NO / PROPOSAL
Permission/auth change: YES / NO / PROPOSAL
Runtime/device change: YES / NO / PROPOSAL
```

A visual refactor that unexpectedly requires broad architecture, database,
contract, authorization, or runtime changes must stop for review.

## Step 3 — UI design

Design only after the target and implementation boundary are understood.

The design is based on:

```text
current application shell
+ current capabilities
+ current shared/application components
+ approved product scope
+ YUTA visual system
```

For `EXISTING_PAGE`, redesign the real target rather than imagining a separate
replacement implementation.

For `NEW_PAGE`, a static or typed-fixture visual baseline may be designed when
explicitly allowed by the page specification. Fixtures must not imply that an
unimplemented capability already exists.

## Step 4 — Design approval gate

A page package may be drafted while design is being reviewed, but it is not
implementation-ready until the visual direction is approved.

Use these reference states:

```text
DRAFT -> REVIEWED -> APPROVED
```

The final implementation-ready package must identify the approved reference or
explicitly state that no image reference is required.

Approved references remain visual authority only. Repository implementation and
current product documentation remain behavioral authority.

## Step 5 — Final page or screen package

After approval, complete or update the stable package for an initiative that
warrants one under:

```text
docs/ui/pages/<page-slug>/
```

Use the structure and ZIP rules from `PAGE_PACK_PROTOCOL.md`.

Recommended package lifecycle:

```text
design -> approved -> implementation-ready -> implemented
```

Meaning:

- `design`: scope/design is still being developed;
- `approved`: visual direction and product scope are approved;
- `implementation-ready`: repository inventory, protected invariants,
  implementation plan, acceptance criteria, references, and phase prompts are
  complete;
- `implemented`: implementation and QA are complete and the package reflects
  the as-built result.

Do not create `v2`, `v3`, `new`, `final`, or `latest` sibling packages. Update
the stable package in place.

## Step 6 — Implementation

Codex must re-run the package's Phase 0 repository analysis before editing.
This protects against repository drift between design approval and
implementation.

Use the package prompts in this lifecycle order:

```text
00 Repository Analysis gate
01-04 approved implementation work
functional and regression QA
05 visual/device QA and delivery synchronization
```

Phase 00 is a hard gate and makes no code changes.
Phase 05 begins only after applicable functional/regression checks have passed
or their failures have been explicitly reported and accepted as blockers.

### Component decision order

When implementation needs a component, use this order:

1. reuse an existing target-feature component;
2. reuse an existing target-application component;
3. compose existing components and `@yuta/ui` primitives;
4. extend an existing application component when the need is genuinely shared;
5. create a new application/feature component;
6. create or change a shared `@yuta/ui` primitive only when the requirement is
   domain-neutral and reuse across independent consumers is justified.

Do not create parallel page-specific primitives merely because visual names
differ.

## Step 7 — Functional and regression QA

Functional/regression QA happens before visual parity is declared.

Verify, as applicable:

- existing authorization/session/trust boundaries;
- loading and data retrieval;
- forms, validation, mutations, commands, and transactions;
- current polling/retry/offline behavior;
- local-service, worker, printer, hardware, or provider behavior;
- existing behavior-protecting tests;
- target-application typecheck/tests/build;
- affected contract, domain, database, runtime, or device tests.

If regression QA fails, resolve the functional regression before performing
final visual polish.

Never claim a command was run if the command does not exist or was not executed.

## Step 8 — Visual and responsive QA

After functional behavior is protected, compare the implementation against the
approved visual direction using the target application's viewport/device
profile.

This step executes the package's Phase 05 prompt.

Verify:

- application shell alignment;
- visual hierarchy and proportions;
- density and spacing;
- typography and semantic color;
- responsive stacking and scroll containment;
- no horizontal overflow;
- keyboard and visible focus where supported;
- touch usability for touch-oriented products;
- truthful loading, pending, empty, forbidden, conflict, error, degraded,
  device, success, retry, and recovery states.

Do not claim visual parity without browser/device evidence.

## Step 9 — As-built documentation sync

The UI task is not complete until current documentation describes the actual
implemented result.

After implementation and QA:

- update the stable page package when implementation differs from the approved
  plan for a valid repository reason;
- record intentional visual deviations;
- update product/feature/operator/QA documentation when behavior or operations
  changed;
- remove obsolete page-package statements rather than leaving planned behavior
  as if it were implemented;
- set the package status to `implemented` only when the package reflects the
  delivered implementation;
- rely on Git history for prior revisions rather than creating duplicate
  completion documents.

The desired final state is:

```text
implementation <-> current page package <-> approved visual reference
```

## Existing vs new target branch

### Existing target

```text
repository analysis
-> preserve current behavior and protected invariants
-> design against real capabilities
-> approve reference
-> refactor implementation in place
-> regression QA
-> visual QA
-> as-built sync
```

Do not replace real integration with fixtures to obtain visual parity.

### New target

```text
repository analysis
-> define approved scope
-> design
-> approve reference
-> implementation-ready package
-> optional typed-fixture visual baseline
-> approved data/interaction integration
-> regression QA
-> visual QA
-> as-built sync
```

Do not invent backend capability merely because a new UI can display it.

## When a visual reference is supplied with the request

A supplied mockup does not skip repository analysis.

Use this sequence:

```text
supplied reference
+ repository analysis
-> identify conflicts / unsupported concepts
-> adapt or approve visual direction
-> final package
-> implementation
```

When the reference conflicts with protected behavior, preserve the behavior and
document the required visual deviation or request a product decision.

## Responsibilities

### Product/design preparation

The party preparing the UI package is responsible for:

- understanding repository reality before finalizing design;
- defining product scope and protected invariants;
- producing or curating the visual reference;
- resolving design iterations with the product owner;
- producing the final implementation-ready package.

### Codex implementation

Codex is responsible for:

- verifying repository reality again at Phase 0;
- implementing within the approved change boundary;
- preserving protected invariants;
- reusing current architecture/components before creating new ones;
- running exact repository checks;
- reporting conflicts, deviations, blocked proposals, and remaining risks;
- synchronizing the page package with the as-built result.

Codex must not use a screenshot as permission to redesign architecture or
invent product capability.
