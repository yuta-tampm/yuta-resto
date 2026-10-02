# Pointage employee

Status: IMPLEMENTED / VERIFIED / BROWSER-QA-PASS — production blocked

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/pointage/[establishmentSlug]`

Runtime family: `cloud`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `NONE`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

No-image reference reason: Human-approved written state-driven Design provides
the required hierarchy, French copy and state behavior. No image is needed;
no image or screenshot is claimed. See [reference metadata](references/README.md).

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

## Current implementation

The employee route `/pointage/[establishmentSlug]`, employee Pointage UI,
Pointage-specific continuation and employee transport/API endpoints are
implemented, formally verified and Browser-QA-evidenced. The browser keeps the
continuation only in memory for the current interaction; it does not durably
store the plaintext credential, trusted employee context or employee identity.
Immutable raw events exist as the canonical attendance evidence in the approved
guarded synthetic/disposable implementation.

Mandatory Browser QA passed in Microsoft Edge with zero Product failures and
the accepted residual evidence limitations for genuine hidden/background
lifecycle, BFCache triggering and independently observable absolute expiry.
Production enablement and real employee attendance remain `NOT_AUTHORIZED`;
trusted production client-address provenance and the other six legal/privacy
blockers remain unresolved. Package status is `implemented`, not
`PRODUCTION_READY`.

## Authority

Root/scoped AGENTS, current product and architecture docs, the current UI
workflow and [Backoffice rules](../../BACKOFFICE_FRONTEND_RULES.md) precede this
draft. Exact approved scope/hashes are in [PRODUCT_SCOPE](PRODUCT_SCOPE.md).
Shared rules: `docs/ui/YUTA_FRONTEND_RULES.md`
([source](../../YUTA_FRONTEND_RULES.md)).
[Archived Technical Design](../../../../openspec/changes/archive/2026-09-23-pointage-usable-raw-clocking/design.md)
selects security/time/transaction behavior; this pack cannot expand it.

## Documents

- [PRODUCT_SCOPE](PRODUCT_SCOPE.md)
- [DESIGN_HANDOFF](DESIGN_HANDOFF.md)
- [UI_SPEC](UI_SPEC.md)
- [DATA_AND_INTERACTION_SPEC](DATA_AND_INTERACTION_SPEC.md)
- [ACCEPTANCE_CHECKLIST](ACCEPTANCE_CHECKLIST.md)
- [IMPLEMENTATION_PLAN](IMPLEMENTATION_PLAN.md)
- [Reference metadata](references/README.md)
- [Sealed prompt provenance](prompt-provenance.json)
- [00 Repository analysis](prompts/00_REPOSITORY_ANALYSIS.md)
- [01 Visual baseline](prompts/01_VISUAL_BASELINE.md)
- [02 Component refactor](prompts/02_COMPONENT_REFACTOR.md)
- [03 Interactions](prompts/03_INTERACTIONS.md)
- [04 Data integration](prompts/04_DATA_INTEGRATION.md)
- [05 Visual QA](prompts/05_VISUAL_QA.md)

Pack completion metadata: the previously partial Design-stage pack now has its
Implementation Plan, six canonical prompt snapshots and no-image metadata.
The generator was not run: it refuses an existing destination. Missing prompts
were copied byte-exactly from the current canonical template, then hashed and
sealed with their actual source revision and current Git commit. No pre-seal
customization or invented provenance. The validator is run without modification.

## Shared UI context

NO_APPLICATION_SHELL. Reuse root typography, semantic tokens and shared
primitives. No cloud-account chrome, restaurant selector, manager sidebar,
mobile navigation or invented shared shell. See the four-layer context matrix
and self-contained written design prompt in DESIGN_HANDOFF.

## Protected invariants

Own minimal state only. Current eligibility and exact authority on every
protected read/mutation/replay. No clock backdating, Planning rounding,
history/totals, durable browser employee identity or offline fallback.
A receipt is not a second attendance source. Shared-device clearing and
unknown-outcome recovery remain explicit. Test data is synthetic/disposable
only; real attendance and production enablement remain NOT_AUTHORIZED.

## Change impact

Current Batch C writes are bounded to accurate technical/as-built documentation
and the authorized Tasks/review evidence. Product behavior, Specs, Design,
prompt snapshots, references and provenance remain unchanged.

Implemented boundaries: Backoffice employee route and server Pointage consumer,
`@yuta/contracts` DTOs, `@yuta/auth` state-guard primitive, and guarded
disposable-test `@yuta/db-cloud` raw/receipt/continuation persistence. Canonical
production migrations intentionally exclude raw-clocking persistence.

Cross-application impact: no local/public application change.

Files expected to modify: the isolated foundation exports and integration paths
listed in master Tasks / IMPLEMENTATION_PLAN; implemented within that allowlist.

Files expected to create: the approved employee page, transport, domain, DTO,
persistence and tests listed in master Tasks / IMPLEMENTATION_PLAN; implemented
within those exact path keys. No additional runtime or app was added.

Packages affected: @yuta/backoffice, @yuta/contracts, @yuta/auth, @yuta/db-cloud.

Database change: YES

API or contract change: YES

Permission/auth change: YES

Runtime/device change: NO

These flags describe the approved and implemented Design. Existing six
operations and grants remain unchanged; no new runtime/device exists, only the
approved guarded synthetic/disposable test composition.

## Design approval

Scope: exact revised Gate 2 Specs APPROVED_FOR_DESIGN.
Design, layout, copy and no-image direction: APPROVED by explicit current-user
instruction on the exact Sensitive Design packet. Approval recorded 2026-09-08.
Source: [Sensitive Design review](../../../reviews/pointage-usable-raw-clocking/02b-design-review.md).
The completed delivery preserved the approved Product/UI/Design behavior.
All 32 Apply tasks, formal Technical Implementation Compliance, formal VERIFY
and mandatory Browser QA passed. The exact change is archived at
`openspec/changes/archive/2026-09-23-pointage-usable-raw-clocking`.

Current repository checkpoint: Gate 3 approved; Specs synced and strictly
validated; change archived. Production enablement and real employee attendance
remain `NOT_AUTHORIZED`. Package status is `implemented` because final
functional/regression and visual/browser evidence is complete; this status does
not promote production readiness.

## Stop conditions

Stop for a Product/authority conflict, unsupported Personnel projection,
production provider, real attendance data, new permission/runtime, raw mutation
or expanded visible behavior. Do not weaken Specs for implementation convenience.

## Final delivery and as-built status

Implementation: COMPLETE (32/32).
Technical Implementation Compliance: PASS.
Formal VERIFY: PASS.
Visual/browser evidence: PASS with three accepted residual evidence limitations.
Gate 3: APPROVED.
Main Specs: SYNCED / STRICTLY VALIDATED.
Archived change: `2026-09-23-pointage-usable-raw-clocking`.
As-built technical documentation status: CURRENT after approved consolidation.
Real employee attendance: NOT_AUTHORIZED.
Production enablement: NOT_AUTHORIZED.
Seven legal/privacy/provenance blockers: UNRESOLVED.
