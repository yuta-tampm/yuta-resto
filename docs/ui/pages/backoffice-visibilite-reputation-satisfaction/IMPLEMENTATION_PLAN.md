# Satisfaction client — Implementation Plan

Status: Phase 1–4 complete; Gate 3 human review pending

Visibility: Engineering

## Phase 3A — Stable page-pack prerequisite

Status: `APPROVED_AND_COMPLETE`

- Create the revision-4 generated page pack for the existing route.
- Inventory the current route, shared shell, auth, data, actions, tests and
  public-consumer boundary without changing implementation.
- Capture the authenticated OWNER baseline at 1440, 1024, 768 and 390 px using
  safe persisted local data.
- Record Product/UI/Data/Interaction/Design Handoff/Acceptance authority and a
  ready-to-use design prompt.
- Preserve generated prompt provenance and sealed prompt snapshots.
- Validate the pack and stop at `PAGE_PACK_APPROVED_BEFORE_UI_CODE`.

No UI code, server action, feedback-web edit or Browser QA belongs to Phase 3A.

## Required human gate

`PAGE_PACK_APPROVED_BEFORE_UI_CODE`

Human approval must bind to the exact current page-pack bytes and design
handoff. Pack approval does not authorize shared UI changes, Phase 3C,
integration/QA or production.

## Phase 3B — Backoffice settings UI and server action

Status: `APPROVED_AND_COMPLETE`

After separate authorization only:

- extend the existing Satisfaction route, never create a second page;
- load/render settings only for trusted OWNER
  `reputation.settings.manage` while preserving the inbox for MANAGER/STAFF;
- compose the approved server read/action around existing Phase 1/2 contracts
  and repository decisions;
- implement exactly three fields, one Save and the complete approved state
  matrix;
- preserve user input across recoverable validation, conflict and server errors;
- add focused action/component/model tests without modifying shared primitives.

Stop if the work requires auth/grant, schema/migration, route/navigation,
settings provisioning or shared `@yuta/ui` changes.

## Phase 3C — Minimal public safe-link rendering

Status: `APPROVED_AND_COMPLETE`

After separate authorization only, reconcile current shared file hashes and the
current `feedback-public-trusted-boundary-hardening` artifacts before any edit.
Consume only the existing shared safe projection and preserve trusted public
hostname, organization, establishment, slug and missing-row behavior. Render
only accepted non-null destinations with approved safe external-link attributes.

Do not add fallback URLs, provider calls, cleanup, analytics or public-page
redesign.

## Phase 4 — Integration, regression and QA

Status: `COMPLETE`

Only after Phase 3B/3C review:

- run the approved contract, real disposable PostgreSQL, Backoffice and
  feedback-web regression suites;
- produce separate Technical Implementation Compliance, VERIFY and QA results;
- run authenticated real-route Browser QA at 1440, 1024, 768 and 390 px with
  safe synthetic/local data;
- cover every settings state, OWNER/MANAGER/STAFF visibility, current inbox
  preservation, public safe CTA behavior, keyboard/focus and no-overflow;
- synchronize this page package to as-built behavior only after completion.

All listed Phase 4 evidence is complete. Technical Implementation Compliance,
VERIFY, and Browser QA are recorded separately as `PASS`; Gate 3 is awaiting
independent human review.

## Production

Status: `NOT_AUTHORIZED`

No deployment, production data mutation, settings provisioning, runtime
configuration or readiness promotion is permitted by this plan.

## Delivery evidence

Phase 3A evidence consists of the exact page-pack tree and hashes, four current
authenticated baseline captures and their hashes, prompt provenance, inspected
file inventory, pack/document checks and the explicit later-phase locks.
