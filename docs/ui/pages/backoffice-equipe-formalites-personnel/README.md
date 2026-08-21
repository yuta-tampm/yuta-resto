# Backoffice Équipe Formalités du personnel

Status: Phase 1 fictional read-only prototype

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/equipe/formalites-personnel`

Runtime family: `CLOUD`

Page classification: `NEW_PAGE`

Implementation class: `visual-only`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `NONE`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

No-image reference reason: `The 2026-08-22 approval authorizes a bounded read-only prototype using existing Backoffice patterns; no visual redesign or generated reference is required.`

## Current implementation

The former `PlannedBackofficePage` placeholder is replaced by an OWNER-only
server page. It renders one typed, route-local fictional CDI-readiness fixture.
It performs no employee repository read, receives no employee identifier, has
no mutation, and disables document generation.

## Authority

Read root and `apps/backoffice/AGENTS.md`, `docs/CURRENT_STATE.md`,
`docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/BACKOFFICE_FRONTEND_RULES.md`, the
UI workflow, then this package and current code/tests.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

No page image is used. The current Backoffice shell, `BackofficePage`, and
`@yuta/ui` cards, alerts, badges, and buttons define the visual context.

## Shared UI context

Reuse the authenticated Backoffice shell, section navigation, account/session
area, typography, semantic tokens, and responsive content width. This page may
compose route-local CDI-readiness content only. It must not change the shell or
invent a formality center, document library, provider selector, or legal status.

## Protected invariants

- Authentication, active establishment, and OWNER personnel-read permission are
  resolved on the server.
- All content inside the prototype is fictional and visibly labelled.
- No dossier, contract file, database, API, provider, or browser-supplied tenant
  scope is read.
- No save, generation, signature, sending, audit, or production behavior exists.
- Opening from a real employee dossier and passing an employee identifier remain
  deferred until a separately approved integrated phase.

## Change impact

```text
Files expected to modify: Formalités route, Backoffice navigation permission filter, current docs
Files expected to create: route-local prototype component/model, tests, canonical page pack
Packages affected: apps/backoffice, docs
Cross-application impact: NO
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Design approval

On 2026-08-22 the product owner approved F5-02 through F5-06 and Phase 1 as a
read-only prototype using entirely fictional data. F5-02 limits access to
OWNER; F5-03 keeps the future flow to one employee in the active establishment;
F5-04 selects the full dossier as the future entry point; F5-05 forbids a
generated file in Phase 1; F5-06 assigns reusable employee facts to Salariés
and document-specific inputs/validation to Formalités.

## Stop conditions

Stop before using an employee identifier or real dossier fact, persisting an
input or result, creating a PDF, adding schema/API/contracts, calling a provider,
or claiming legal validity. Those steps require F5-07/F5-08 and a new approval.

## Final delivery and as-built status

Final implementation locations/files changed: `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel`, `apps/backoffice/src/components/backoffice/backoffice-navigation.ts`, and their tests.

Verification commands and results: page-pack, documentation, architecture,
Backoffice typecheck/test/build, recursive workspace typecheck, and formatting
checks passed on 2026-08-22.

Functional/regression QA result: 50 Backoffice test files passed (one skipped),
159 tests passed; production build and recursive typecheck passed.

Visual/browser/device evidence: authenticated OWNER browser QA at
1440x900, 1024x800, 768x800, and 390x844 showed no horizontal overflow; the
disabled generation control and title remained present, mobile content was
scrollable, and no browser warning/error was recorded.

Intentional deviations: The approved future entry from a full employee dossier is documented but not connected in Phase 1 because the approved prototype must not read or receive real employee data.

Deferred proposals and risks: F5-07 result lifecycle; F5-08 legal, security, privacy, retention, audit, template, signature, and operations decisions.

As-built documentation status: `COMPLETE`
