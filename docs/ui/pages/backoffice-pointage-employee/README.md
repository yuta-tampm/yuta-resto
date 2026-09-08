# Pointage employee

Status: Approved Design; implementation planning AWAITING_HUMAN_REVIEW

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/pointage/[establishmentSlug]`

Runtime family: `cloud`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Package status: `implementation-ready`

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

The root Backoffice document and Pointage authorization/credential foundation
exist. The employee route, continuation, raw events, transport and Browser QA
do not. Full read-only inventory: [DESIGN_HANDOFF](DESIGN_HANDOFF.md).
No current employee screen exists; baseline capture is not applicable.

## Authority

Root/scoped AGENTS, current product and architecture docs, the current UI
workflow and [Backoffice rules](../../BACKOFFICE_FRONTEND_RULES.md) precede this
draft. Exact approved scope/hashes are in [PRODUCT_SCOPE](PRODUCT_SCOPE.md).
Shared rules: `docs/ui/YUTA_FRONTEND_RULES.md`
([source](../../YUTA_FRONTEND_RULES.md)).
[Technical Design](../../../../openspec/changes/pointage-usable-raw-clocking/design.md)
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

Current writes: planning completion files and authorized README metadata/links
only in this pack; approval metadata and planning review recorded separately.
Five existing reviewed documents remain byte-identical. Their historical
DRAFT/pre-approval labels and unchecked planning boxes are retained by explicit
user instruction; current approval/completion status is recorded here.

Future proposed boundaries (not authorized Apply): Backoffice employee route
and server Pointage consumer, @yuta/contracts DTOs, @yuta/auth state-guard
primitive, @yuta/db-cloud raw/receipt/continuation persistence.

Cross-application impact: no local/public application change.

Files expected to modify: Isolated exports and foundation integration only;
exact paths and dirty-hunk protections in master Tasks / IMPLEMENTATION_PLAN.

Files expected to create: Approved employee page, transport, domain, DTO,
persistence and tests; exact path keys in master Tasks / IMPLEMENTATION_PLAN.

Packages affected: @yuta/backoffice, @yuta/contracts, @yuta/auth, @yuta/db-cloud.

Database change: YES

API or contract change: YES

Permission/auth change: YES

Runtime/device change: NO

These flags describe approved Design impact, not Apply authority. Existing six
operations and grants remain unchanged; no new runtime/device, only approved
cloud synthetic-test composition.

## Design approval

Scope: exact revised Gate 2 Specs APPROVED_FOR_DESIGN.
Design, layout, copy and no-image direction: APPROVED by explicit current-user
instruction on the exact Sensitive Design packet. Approval recorded 2026-09-08.
Source: [Sensitive Design review](../../../reviews/pointage-usable-raw-clocking/02b-design-review.md).
Subsequent user permission: README metadata/completion links only; no changes
to approved Product/UI/Design content in the other five documents.
Tasks and implementation planning are authorized; Apply is not.
The master plan has four Apply phases; UI prompts are mapped checkpoints,
not extra Apply phases. See IMPLEMENTATION_PLAN for execution and human stops.

Apply authorization: NOT_GRANTED.
Production enablement: NOT_AUTHORIZED.
Package status implementation-ready denotes pack completeness, not Apply,
implementation, successful QA or production-readiness approval.

## Stop conditions

Stop for a Product/authority conflict, unsupported Personnel projection,
production provider, real attendance data, new permission/runtime, raw mutation
or expanded visible behavior. Do not weaken Specs for implementation convenience.

## Final delivery and as-built status

Implementation: NOT_STARTED.
Functional/regression QA: NOT_RUN.
Visual/browser evidence: NOT_RUN; required after implementation.
As-built documentation status: PENDING.
Only planning inventory is complete, not the UI or its QA.
