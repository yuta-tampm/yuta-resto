# POS management combos — References

Status: Current baseline, approved design direction, and final as-built evidence

Visibility: Engineering

Reference status: `APPROVED`

The 2026-08-23 suggestion-eligibility extension inherits these approved
references. The initial clean browser correctly redirected to
`/management/login`. The operator later authenticated locally without sharing
the PIN, allowing final read-only as-built capture. No credential was requested
and no combo or order data was changed solely for capture.

## 2026-08-23 suggestion-eligibility final as-built

- `phase-5-suggestion-config-1366x768.png`
- `phase-5-suggestion-config-1024x768.png`
- `phase-5-suggestion-config-768x1024.png`
- `phase-5-suggestion-config-390x844.png`
  - Purpose: authenticated production-browser evidence for the persisted
    `Suggestion à la commande` control across the complete POS viewport matrix.
  - State: Menu Gourmand/Menu Express disabled; Gua Bao Happy/Combo Été enabled;
    all four discount rules independently Active.
  - Captured: 2026-08-23; DPR 1; zero document-level horizontal overflow.
  - Mutation: none; no switch or operational action was submitted.

## 2026-08-23 suggestion-eligibility approved proposals

- `design-proposal-04-suggestion-config-desktop.png`
  - Purpose: desktop hierarchy for the independent per-rule suggestion control.
  - State study: Menu Gourmand/Menu Express suggestion-disabled; Gua Bao
    Happy/Combo Été suggestion-enabled while all four discount rules remain
    Active.
  - Status: `APPROVED`; generated with built-in ImageGen from approved references.
- `design-proposal-05-suggestion-config-narrow.png`
  - Purpose: narrow responsive companion with a full-width setting row and
    readable state/switch treatment.
  - Native image represents a 390px-wide scrolling page; no device frame.
  - Status: `APPROVED`; generated with built-in ImageGen from approved references.

The first generated variants were rejected for incorrect repeated priority and
pricing metadata. The selected pair uses current read-only catalog values. The
references remain visually non-authoritative for icons, exact styling, switch
implementation, and persistence. The product owner approved this pair on
2026-08-23 and authorized Phase 2. Fresh authenticated final capture is
recorded above.

## Current baseline

- `current-baseline-1366x768.png`
  - Purpose: current authenticated populated top viewport.
  - Route: `http://localhost:3003/management/combos`.
  - State: active local seed admin; four active seed-backed rules; first rule
    fully expanded; structural controls disabled by the real active lock.
  - Runtime: local PostgreSQL, site-agent, and POS Next.js dev server healthy.
  - Captured: 2026-08-12; `1366 × 768`; DPR 1.

- `current-baseline-edit-rule-dialog-1366x768.png`
  - Purpose: current authenticated edit-rule dialog.
  - State: `Modifier Menu Gourmand` opened and cancelled without submission.
  - Captured: 2026-08-12; `1366 × 768`; DPR 1.

These images are visual evidence, not product or data authority. They do not
authorize copying exact colors, fields, permissions, routes, or behavior.

## Shared references

The page package links rather than copies the approved POS Management shell
evidence:

- `../../pos-management-printing/references/phase-05-as-built-1366x768.png`;
- `../../pos-management-printing/references/phase-05-as-built-390x844.png`.

## Generated draft proposals

- `design-proposal-01-desktop.png`
  - Purpose: desktop hierarchy and density proposal.
  - Native image: `1672 × 941`; represents the `1366 × 768` design viewport.
  - Direction: approved shared shell, in-content return, four compact active
    rules, nested page-local disclosure, and visibly locked structural actions.
  - Status: `APPROVED` for hierarchy and density only.

- `design-proposal-02-rule-editor.png`
  - Purpose: rule editor grouping and pending-submit proposal.
  - Native image: `1672 × 941`; represents the `1366 × 768` design viewport.
  - Direction: current fields only, neutral inputs, no invented validation
    banner, and persistent cancel/save actions.
  - Status: `APPROVED` for hierarchy and density only.

- `design-proposal-03-narrow.png`
  - Purpose: narrow responsive companion.
  - Native image: `853 × 1844`; represents the `390 × 844` design viewport.
  - Direction: approved narrow shell, one-column rule flow, direct primary
    action, disclosure hierarchy, and locked structural controls.
  - Status: `APPROVED`; implementation uses stronger narrow stacking.

Generated on 2026-08-13 with the built-in ImageGen path. The prompts are stored
in `../DESIGN_HANDOFF.md`. The selected drafts use repository baselines as
references, not edit targets. Rejected generations remain outside the workspace
and are not package references.

Reference status is `APPROVED` for visual hierarchy, density, and responsive
direction. Generated logo geometry, exact colors, shadows, gradients,
typography, icons, text, and sample data are non-authoritative. Implementation
must use repository `YutaBrandMark`, semantic tokens, `@yuta/ui`, Lucide, real
runtime data, and current French copy.

## Phase 1 as-built

- `phase-01-implementation-1366x768.png`
  - Purpose: authenticated Phase 1 desktop top viewport.
  - State: first real rule and first group expanded; long item list previewed;
    active structural controls disabled.
  - Captured: 2026-08-13; `1366 × 768`; DPR 1.

- `phase-01-implementation-390x844.png`
  - Purpose: authenticated Phase 1 narrow top viewport.
  - State: same real populated state with stacked headers/actions.
  - Captured: 2026-08-13; `390 × 844`; DPR 1; no horizontal document overflow.

Both captures use the real local session and seed-backed site-agent response.
No mutation was submitted during capture.

## Phase 5 final as-built

- `phase-05-as-built-1366x768.png`
- `phase-05-as-built-1024x768.png`
- `phase-05-as-built-768x1024.png`
- `phase-05-as-built-390x844.png`
  - Purpose: authenticated populated top-viewport evidence across the complete
    POS QA matrix.
  - State: four real local rules; first rule and first group expanded; active
    structural controls visibly disabled; route-local actions use final
    `44 × 44` minimum targets.
  - Captured: 2026-08-13; DPR 1; zero document-level horizontal overflow at
    every viewport.

- `phase-05-rule-dialog-390x844.png`
  - Purpose: final narrow rule-editor containment evidence.
  - State: `Nouvelle formule` opened with initial focus on `Nom`; fields scroll
    independently and the save/cancel footer remains visible.
  - Captured: 2026-08-13; `390 × 844`; dialog `390 × 812` with 16 CSS pixel
    vertical margins.

These captures use the authenticated local admin session, local PostgreSQL,
the running site-agent, and the production POS build. No mutation was submitted:
the empty create attempt was blocked by native required-field validation, the
dialog was dismissed with Escape, and focus returned to `Nouvelle formule`.

Intentional deviations from generated references preserve repository truth:
the approved shared shell and route-local `@yuta/ui` composition replace raster
logo/color/shadow details, real seed-backed content replaces sample content,
and narrow layouts use stronger card/action stacking for readability and touch
access. Generated imagery remains authority for hierarchy, density, and
responsive direction only.
