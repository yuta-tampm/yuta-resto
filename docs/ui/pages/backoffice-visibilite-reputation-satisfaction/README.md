# Backoffice Visibilité et réputation — Satisfaction client

Status: Implemented and locally verified

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/visibilite-reputation/satisfaction`

Runtime family: `CLOUD`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

Prompt snapshot topology: `GENERATED_SNAPSHOTS`

Prompt provenance: `prompt-provenance.json`

No-image reference reason: `NOT_APPLICABLE — authenticated baselines, approved proposed references, and final QA screenshots are recorded separately.`

## Current implementation

The existing authenticated route is a persisted Direct Customer Feedback inbox.
`satisfaction/page.tsx` loads the shared Reputation review page in `direct` mode.
The server loader resolves the authenticated tenant, trusted organization and
active establishment, enforces `reputation.read`, fixes the source to `DIRECT`,
and loads the current list, counters, selected review, detail and assignable
users. Current actions update feedback status, assignment, internal notes and
related review management through the existing server boundary.

The current route renders the approved “Liens d’avis et réseaux sociaux”
section after the existing inbox only for an authorized OWNER. It uses the
shared URL policy, typed outcomes, scoped repository behavior,
conflict/reload, no-op, audit, public safe projection, and fail-closed missing
settings-row behavior. This page package documents those approved artifacts;
it does not redefine them.

## Authority

Read in order:

1. root `AGENTS.md` and `apps/backoffice/AGENTS.md`;
2. `docs/CURRENT_STATE.md`, `docs/AUTHORITY_MODEL.md` and Reputation product
   knowledge;
3. `docs/ui/README.md`, `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`,
   `docs/ui/PAGE_PACK_PROTOCOL.md`, `docs/ui/YUTA_FRONTEND_RULES.md` and
   `docs/ui/BACKOFFICE_FRONTEND_RULES.md`;
4. approved Proposal, Analysis, Spec, Design and Tasks for
   `reputation-review-social-links-configuration`;
5. current route, shared components, contracts, repository, authorization and
   tests;
6. this page package and its sealed prompt snapshots.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

- `references/baseline-owner-1440x900.png` — desktop authenticated OWNER
  baseline and full two-column inbox.
- `references/baseline-owner-1024x768.png` — compact desktop/tablet baseline.
- `references/baseline-owner-768x1024.png` — narrow authenticated Backoffice
  baseline with current responsive stacking.
- `references/baseline-owner-390x844.png` — current mobile shell and above-fold
  content.
- `references/proposed-owner-1440x900.png` — proposed compact desktop placement
  after the primary two-column inbox.
- `references/proposed-owner-1024x768.png` — proposed scrolled view showing the
  settings card after the inbox.
- `references/proposed-owner-768x1024.png` — proposed narrow stacked form after
  the inbox.
- `references/proposed-owner-390x844.png` — proposed mobile single-column form
  after the inbox.

The baseline captures remain pre-change evidence. The proposed images are the
approved visual authority. Final implementation evidence is stored under
`docs/reviews/reputation-review-social-links-configuration/qa`; none of these
images defines permissions or Product behavior.

## Shared UI context

Shell mode: `REUSE_CURRENT_TARGET`.

Reuse the existing authenticated `BackofficeFrame`, sidebar/mobile navigation,
top bar, establishment switcher, account/session area, footer, content width,
Geist typography, semantic tokens, `@yuta/ui` primitives and `lucide-react`.
The current “Satisfaction client” navigation entry and route stay unchanged.
The page may add only the approved OWNER-only settings section while preserving
the Direct Customer Feedback inbox as the primary capability. It must not
redesign the application shell or create a route, navigation item, dashboard,
provider connection flow or shared primitive.

## Protected invariants

- The route keeps its current `reputation.read` access for OWNER, MANAGER and
  STAFF when their trusted membership and active establishment are valid.
- The settings section is available only after server-side
  `reputation.settings.manage`; MANAGER and STAFF keep the inbox but receive no
  settings model or settings UI.
- Organization, establishment, membership, role and permissions come from the
  authenticated server context, never from browser claims.
- The Direct Customer Feedback source remains server-fixed to `DIRECT`; query
  input cannot widen it.
- The three settings values belong to Reputation and remain scoped by trusted
  organization plus establishment.
- Missing settings rows fail closed as `CONFIGURATION_UNAVAILABLE`; this page
  cannot create or provision a row or infer unrelated Reputation fields.
- One explicit Save covers all three fields. No autosave, partial write,
  provider call or OAuth behavior is introduced.
- Page header, metrics, existing inbox and settings keep the same DOM and visual
  order at every viewport. Responsive CSS must not reorder major focusable
  regions, and the form must not be duplicated for desktop/mobile placement.
- Public rendering continues to use the shared safe projection. The concurrent
  `feedback-public-trusted-boundary-hardening` change owns hostname and client
  identity hardening and explicitly excludes external review URLs/settings.
- No polling, offline queue or device integration applies to this page.

## Change impact

```text
Files expected to modify: existing Satisfaction page; feedback-web feedback form; shared Reputation contracts, repository exports, and public projection; Reputation feature knowledge; this page pack
Files expected to create: route-local Backoffice action, component, state helper and tests; bounded db-cloud operation and focused tests; Phase 4 verification and QA evidence
Phase 3A files: this page package and authenticated baseline/proposed references
Phase 3B files: existing Satisfaction route plus route-local action, component, state model and tests
Phase 3C files: bounded feedback-web success CTA rendering plus focused evidence
Packages affected: contracts, db-cloud, backoffice, feedback-web and this page pack
Cross-application impact: YES — shared safe projection consumed by feedback-web
Database change: NO
API or contract change: YES
Permission/auth change: NO
Runtime/device change: NO
```

The API/contract impact is limited to bounded typed Reputation link contracts;
no new HTTP route was added. Authorization reuses the existing
`reputation.settings.manage` operation without changing grants.

## Design approval

The Product, behavioral Spec, Technical Design, page-pack gate, and Phase 1–3
implementation reviews are approved. Phase 4 verified the implementation on a
real local route with synthetic data at 1440×900, 1024×768, 768×1024, and
390×844. Final Gate 3 remains a separate human decision; this page pack does
not authorize production.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

The snapshots are sealed by `prompt-provenance.json`. Do not edit them in place.
Later canonical-template changes do not rewrite this generated pack.

## Stop conditions

Stop before UI code until this exact page pack is approved. Stop again if later
implementation requires a new route/navigation item, permission or role grant,
schema/migration, settings-row provisioning, provider/OAuth call, analytics,
QR, social publishing, AI, shared UI primitive change, tenant-boundary change,
or reinterpretation of `feedback-public-trusted-boundary-hardening`.

## Final delivery and as-built status

Final implementation locations/files changed: `Existing Satisfaction route plus route-local action/component/state/tests; bounded feedback-web success CTA rendering; shared contracts and db-cloud operation`

Verification commands and results: `PASS — focused/full tests, typechecks, both Next builds, strict OpenSpec, UI pack, docs and architecture; repository-wide formatting debt is reported separately`

Functional/regression QA result: `PASS on disposable PostgreSQL and synthetic local data`

Visual/browser/device evidence: `PASS — final screenshots and hashes in docs/reviews/reputation-review-social-links-configuration/qa`

Intentional deviations: `None from approved Product/Design behavior.`

Deferred proposals and risks: `Missing settings-row provisioning and all production rollout/readiness work remain separate and unauthorized.`

As-built documentation status: `CURRENT`
