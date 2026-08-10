# <Page or screen name> — Design Handoff

Status: Draft

Visibility: Engineering

## Phase 0 source

Link to the completed Implementation Inventory and summarize the target,
classification, implementation class, user goal, and protected invariants.

## Shared UI context resolution

Shared context status: `PENDING | RESOLVED | BLOCKED`

Complete this matrix before preparing the design prompt:

| Layer        | Owner/source | Reference status       | Reuse exactly | May adapt | Excluded | Decision/blocker |
| ------------ | ------------ | ---------------------- | ------------- | --------- | -------- | ---------------- |
| YUTA global  |              | MISSING/DRAFT/APPROVED |               |           |          |                  |
| Application  |              | MISSING/DRAFT/APPROVED |               |           |          |                  |
| Section/flow |              | MISSING/DRAFT/APPROVED |               |           |          |                  |
| Page/screen  |              | MISSING/DRAFT/APPROVED |               |           |          |                  |

Choose exactly one shell mode:

```text
REUSE_CURRENT_TARGET
REUSE_APPROVED_SHARED_SHELL
SEPARATE_SHELL_PROPOSAL
NO_APPLICATION_SHELL
```

Record the shell owner/reference, header, primary navigation, sidebar, mobile
navigation, account/session area, allowed real routes, unavailable/placeholder
routes, and forbidden invented elements. If a shared decision is missing and
would materially change the design, use `BLOCKED`; do not ask the design tool to
fill the gap.

List the curated shared references and constraints that will be supplied to the
design tool. Do not copy the full component export catalog or raw token source.

## Current baseline capture

Baseline status: `PENDING | CAPTURED | BLOCKED | NOT_APPLICABLE`

For `EXISTING_PAGE`, attach one or more current authenticated browser/device
captures under `references/` and record:

- file name;
- route/screen and state;
- viewport/device dimensions;
- capture date;
- authentication/runtime conditions;
- important states not visible in the capture.

If capture is blocked, record the exact blocker and the command/session/device
needed to resume. Repository-derived layout notes are useful context but are not
a substitute for a visual capture.

For `NEW_PAGE`, use `NOT_APPLICABLE` and explain why no current screen exists.

## Design-generation prompt

Design prompt status: `PENDING | READY`

Prepare a self-contained prompt suitable for ChatGPT/ImageGen or another
approved design tool. It must include:

- target application, route/screen, viewport, and operator/customer context;
- current baseline capture(s) when applicable;
- the resolved global/application/section/page context matrix;
- the exact shell/navigation mode, real routes, and forbidden invented UI;
- the curated approved shared visual references;
- approved capabilities and content hierarchy;
- protected auth/data/runtime/polling/offline/device invariants;
- required states and interactions;
- YUTA typography, semantic-token, icon, component, touch, and accessibility
  constraints;
- concepts that must not be invented;
- requested design output and review criteria.

The prompt must ask for a design proposal, not implementation code. It must not
authorize new product capability, raw production data, provider integration,
schema, API, permission, or device behavior.

Do not mark the prompt `READY` while shared context is `PENDING` or `BLOCKED`.

### Ready-to-use prompt

`<replace with the complete design-generation prompt>`

## Handoff result

Record the generated mockup/reference files, design review decisions, rejected
concepts, and next approval owner. A generated image remains `DRAFT` until it is
reviewed and explicitly approved.
