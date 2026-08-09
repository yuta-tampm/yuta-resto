# <Page or screen name> — Design Handoff

Status: Draft

Visibility: Engineering

## Phase 0 source

Link to the completed Implementation Inventory and summarize the target,
classification, implementation class, user goal, and protected invariants.

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

### Ready-to-use prompt

`<replace with the complete design-generation prompt>`

## Handoff result

Record the generated mockup/reference files, design review decisions, rejected
concepts, and next approval owner. A generated image remains `DRAFT` until it is
reviewed and explicitly approved.
