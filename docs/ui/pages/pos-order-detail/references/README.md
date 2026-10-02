# POS Order Detail - Reference Metadata

Status: Receipt-printing Phase 5 browser evidence complete

Visibility: Engineering

## Active receipt-printing Phase 0 baseline

Receipt-specific Phase 1 visuals were generated and approved on 2026-08-18.

The six `phase-5-as-built-paid-*` files are reused as the current containing-
page baseline because the page implementation has not changed since that
capture. They cover 1366x768, 1024x768, 768x1024, and 390x844, show the safe
real paid order with no receipt action, and truthfully show the printer as
unconfigured. They remain runtime evidence for the existing page, not design
authority for the proposed capability.

The Phase 0 read-only status check on 2026-08-18 reported printer
`not_configured`, worker `disabled`, and 13 pending jobs. No receipt job, queue
command, payment, order mutation, or physical print was created for discovery.

The receipt discovery scope was approved on 2026-08-18, including an explicit
paid non-fiscal action in the page-specific section of the three-line menu,
whole paid `single`/paid-check targets, local snapshot content, one current-
printer copy, degraded queue truth, and immutable reprint. Design generation
then received separate explicit approval.

## Receipt Phase 1 draft references

Reference status: `APPROVED`

- `receipt-phase-1-desktop-1366x768.png` - generated 1672x941; open desktop
  menu plus paid-single confirmation and truthful unconfigured-printer warning.
- `receipt-phase-1-tablet-1024x768.png` - generated 1448x1086; open landscape
  tablet menu plus paid-check chooser. A correction pass restored the original
  three-line trigger.
- `receipt-phase-1-tablet-768x1024.png` - generated 1086x1448; open portrait
  tablet menu plus queued/unavailable status. A correction pass restored the
  original three-line trigger.
- `receipt-phase-1-mobile-390x844.png` - generated 852x1846; compact menu plus
  queued-status sheet, with no body receipt-action duplication.
- `receipt-phase-1-state-board.png` - generated 1536x1024; unavailable, ready,
  submitting, queued, failed, printed/reprint, paid-check selection, and menu
  anatomy. A correction pass removed an invented refund receipt row.

Generation used built-in ImageGen with the matching final Phase 5 paid-order
screenshots as containing-page references. These are presentation proposals,
not browser captures or evidence that the command, queue, worker, or physical
printing capability exists. No fixture or operational mutation was created.

## Current desktop baseline

Reference file: `phase-0-current-paid-1280x720.png`

Reference status: `EVIDENCE_ONLY`

Capture: 2026-08-16, real paid order at `/orders/019fe56b-e32d-7266-b37a-d4db4aca8511`, actual viewport 1280x720.

Purpose: Current desktop shell, density, content, disabled actions, health strip,
and overflow evidence.

## Current narrow baseline

Reference file: `phase-0-current-paid-390x844.png`

Reference status: `EVIDENCE_ONLY`

Capture: 2026-08-16, same real paid order, actual viewport 390x844.

Purpose: Current compact header/menu, stacked content, action sizing, internal
scroll, and no-horizontal-overflow evidence.

## Runtime and data conditions

Site-agent and local PostgreSQL were available; printer was not configured;
Internet state was unknown. There is no authenticated service-time staff
session and no management bearer was used. No control was submitted. The paid
status caused payment summary to skip combo optimization; post-capture values
remained unchanged.

Current service-day open orders were deliberately not opened because their
`single` payment summary can run persisted combo optimization. Missing state
evidence was not fabricated.

## Authority

These captures are non-authoritative evidence. They define no route, product
scope, authorization, permission, contract, API, persistence, runtime/device
behavior, business logic, or raw color. No page-specific design image is
approved.

## Draft desktop proposal

Reference file: `draft-order-detail-1366x768.png`

Reference status: `DRAFT`

Generation: 2026-08-16 with built-in ImageGen; target viewport 1366x768,
generated dimensions 1672x941.

Purpose: Item-dominant desktop hierarchy with a right rail for derived
operational progression, service-owned totals, and supported information.

Review notes: The selected output removes the invented allergy card from the
first generation and visibly locks header/body actions for the paid study. It
is superseded for totals interaction by `draft-order-detail-1366x768-v2.png`.

## Draft tablet proposal

Reference file: `draft-order-detail-1024x768.png`

Reference status: `DRAFT`

Generation: 2026-08-16 with built-in ImageGen; target viewport 1024x768,
generated dimensions 1448x1086.

Purpose: Responsive two-column study with dominant items, nearby totals, and
explicit paid-order lock communication.

Review notes: Superseded for totals interaction by
`draft-order-detail-1024x768-v2.png`.

## Draft narrow proposal

Reference file: `draft-order-detail-390x844.png`

Reference status: `DRAFT`

Generation: 2026-08-16 with built-in ImageGen; target viewport 390x844,
generated dimensions 852x1846.

Purpose: Contained vertical composition with reachable actions, dense readable
items, prominent totals, and stacked progression/information.

Review notes: Superseded for totals interaction by
`draft-order-detail-390x844-v2.png`.

## Draft state-study board

Reference file: `draft-order-detail-state-studies.png`

Reference status: `DRAFT`

Generation: 2026-08-16 with built-in ImageGen; generated dimensions 1672x941.

Purpose: Eight presentation studies covering pending items, paid/cancelled
locks, no active items, existing allergy confirmation, kitchen-send pending/
accepted/conflict states, partial/split payment locks, and truthful degraded
service/printer conditions without an offline mutation queue.

Review notes: This is a design-spec board, not evidence that every state was
opened in the runtime. Command acceptance and durable print-job creation are
visually separated from physical print output.

## Approved responsive refinement - desktop

Reference file: `draft-order-detail-1366x768-v2.png`

Reference status: `APPROVED`

Generation: 2026-08-16 with built-in ImageGen; target viewport 1366x768,
generated dimensions 1672x941.

Purpose: Current desktop proposal with the `Remise` disclosure visibly
collapsed while preserving the aggregate amount and service-owned total.

## Approved responsive refinement - tablet

Reference file: `draft-order-detail-1024x768-v2.png`

Reference status: `APPROVED`

Generation: 2026-08-16 with built-in ImageGen; target viewport 1024x768,
generated dimensions 1448x1086.

Purpose: Current tablet proposal with the same default-collapsed disclosure.

## Approved responsive refinement - narrow

Reference file: `draft-order-detail-390x844-v2.png`

Reference status: `APPROVED`

Generation: 2026-08-16 with built-in ImageGen; target viewport 390x844,
generated dimensions 852x1846.

Purpose: Current narrow proposal with a touch-friendly collapsed disclosure and
no horizontal growth.

## Approved discount-disclosure interaction study

Reference file: `draft-order-detail-discount-disclosure.png`

Reference status: `APPROVED`

Generation: 2026-08-16 with built-in ImageGen; generated dimensions 1672x941.

Purpose: Closed/default and open/read-only states, visible aggregate amount,
service-owned total, keyboard semantics, expanded-state indicator, and 44px
touch target.

Review notes: Unknown discount names and amounts are deliberately represented
as service-provided structure rather than invented promotional data. The
implementation must render only real `order.discounts` entries.

## Phase 1 production-build evidence

Evidence files:

- `phase-1-paid-1366x768-collapsed.png`
- `phase-1-paid-1366x768-expanded.png`
- `phase-1-paid-1024x768-collapsed.png`
- `phase-1-paid-768x1024-collapsed.png`
- `phase-1-paid-390x844-collapsed.png`
- `phase-1-paid-390x844-expanded.png`

Evidence status: `PHASE_1_AS_BUILT`

Capture: 2026-08-16 from a fresh production build on
`http://127.0.0.1:3013`, using only the Phase 0 safe paid order
`POS-20260809-072800-CA8511`. Site-agent and local PostgreSQL were available;
the printer was not configured. No action form was submitted and no active
order was opened.

Geometry: exact browser viewports 1366x768, 1024x768, 768x1024, and 390x844;
document horizontal overflow was 0 throughout. The narrow page retained its
716px internal scroller with 1170px content after renewal.

Interaction: `Remise` was closed on load. Opening it on desktop and narrow
revealed the real persisted `Menu Express` entry at -1.50 EUR while aggregate
discount and total remained unchanged. Expanded views retained 0 horizontal
overflow. The native trigger remained keyboard-focusable; no client state or
mutation was introduced.

Truthfulness: creator and fixed kitchen-printer placeholders were absent.
Disabled Send/Pay controls used neutral surface/text styling rather than an
active primary treatment. Browser console errors/warnings were empty.

These screenshots are Phase 1 implementation evidence, not approval for later
component, behavior, data, transaction, printer, or runtime changes.

## Phase 2 component-refactor evidence

Evidence files:

- `phase-2-paid-1366x768.png`
- `phase-2-paid-390x844-collapsed.png`
- `phase-2-paid-390x844-expanded.png`

Evidence status: `PHASE_2_AS_BUILT`

Capture: 2026-08-17 from the restarted development stack at
`http://localhost:3003`, using only the established safe paid order
`POS-20260809-072800-CA8511`. Site-agent and local PostgreSQL remained
available; the printer remained not configured. No action form was submitted
and no active order was opened.

Geometry and behavior: exact viewports 1366x768 and 390x844 had 0 document/body
horizontal overflow. The narrow internal scroller measured 716px client height
and 1143px content height. `Remise` remained closed on load; expanding it
revealed the real `Menu Express` entry at -1.50 EUR with 0 overflow. The Phase 1
hierarchy, disabled final-state actions, supported information, and operational
progression were visually unchanged after component extraction. Creator and
fixed kitchen-printer placeholders remained absent. The temporary viewport
override was reset after capture.

These screenshots validate presentation parity after the Phase 2 structural
refactor. They authorize no Phase 3 behavior or later data/runtime work.

## Phase 3 persisted discount-item evidence

Evidence files:

- `phase-3-paid-1366x768-expanded.png`
- `phase-3-paid-390x844-collapsed.png`
- `phase-3-paid-390x844-expanded.png`

Evidence status: `PHASE_3_AS_BUILT`

Capture: 2026-08-17 from the running development stack at
`http://localhost:3003`, using only safe paid order
`POS-20260809-072800-CA8511`. No action form was submitted and no active order
was opened for QA.

Geometry and interaction: exact 1366x768 and 390x844 viewports had 0
document/body horizontal overflow. `Remise` was closed on load. Click/touch-
style activation expanded the persisted `Menu Express` row at -1.50 EUR and
the applied snapshot composition `1 × Bún Thịt Nướng + 1 × Mochi glacé (2
pcs)` with 0 overflow. The collapsed narrow internal scroller measured 716px
client height and 1143px content height. The temporary viewport override was
reset and the disclosure returned to closed after capture.

Keyboard note: the implementation retains native `<details>/<summary>` and
visible focus styling. The in-app browser driver could not maintain the native
summary as its focused key target, so keyboard activation is not represented as
successful runtime automation evidence.

These screenshots authorize no apply/edit/remove control, recalculation,
catalog inference, Phase 4 data work, or runtime change.

## Approved visual-correction evidence

Evidence files:

- `visual-correction-paid-1366x768.png`
- `visual-correction-paid-1024x768.png`
- `visual-correction-paid-768x1024.png`
- `visual-correction-paid-390x844.png`
- `visual-correction-paid-390x844-expanded.png`

Evidence status: `PRE_PHASE_5_VISUAL_CORRECTION`

Capture: 2026-08-17 from the running development stack at
`http://localhost:3003`, using only safe paid order
`POS-20260809-072800-CA8511`. No action was submitted and no active order was
opened for this QA.

Correction scope: summary identity/status and responsive metrics, truthful
paid-state banner, three locked page actions, separated article rows,
horizontal connected operational progression, totals/information hierarchy,
and desktop right-rail/narrow stacking were aligned to the approved `v2`
references. The shared POS shell remains reused. The real table label `d`
replaces the generated image artifact `d4`.

Geometry: exact browser viewports 1366x768, 1024x768, 768x1024, and 390x844
had 0 document/body horizontal overflow. Contained scroller client/scroll
heights were respectively 662/779, 662/795, 918/1256, and 716/1332 pixels.
`Remise` was closed on load; narrow expansion preserved 0 overflow and rendered
the persisted `Menu Express` item composition.

These screenshots document the approved correction before Phase 5. They do not
authorize new states, actions, data, calculations, runtime behavior, or Phase 5
completion.

## Phase 5 final as-built evidence

Evidence files:

- `phase-5-as-built-paid-1366x768-collapsed.png`
- `phase-5-as-built-paid-1366x768-expanded.png`
- `phase-5-as-built-paid-1024x768-collapsed.png`
- `phase-5-as-built-paid-768x1024-collapsed.png`
- `phase-5-as-built-paid-390x844-collapsed.png`
- `phase-5-as-built-paid-390x844-expanded.png`
- `receipt-phase-5-as-built-1366x768.png`
- `receipt-phase-5-as-built-1024x768.png`
- `receipt-phase-5-as-built-768x1024.png`
- `receipt-phase-5-as-built-390x844.png`

Evidence status: `FINAL_AS_BUILT`

Receipt-dialog capture: 2026-08-18 from the safe paid order
`POS-20260809-072800-CA8511`. Each viewport shows the authoritative full-order
target, 35.00 EUR amount, explicit non-fiscal wording, and the truthful
unconfigured-printer warning. Measured document/body widths matched the exact
1366, 1024, 768, and 390 pixel viewports with zero horizontal overflow. No
`Imprimer` submission occurred and the operational target retained
`latestJob: null`. Physical output is not claimed; the production renderer and
worker were verified separately on disposable PostgreSQL.

Capture: 2026-08-18 from a fresh POS production build at
`http://localhost:3013`, using only safe paid order
`POS-20260809-072800-CA8511`. Site-agent and local PostgreSQL were available;
the printer was unconfigured. No action was submitted and no active order was
opened.

Geometry: exact browser viewports 1366x768, 1024x768, 768x1024, and 390x844
all measured document/body horizontal overflow of 0. Contained scroller
client/scroll heights were 646/847, 646/879, 902/1452, and 716/1484 pixels in
the collapsed state. The 768px QA pass exposed compressed desktop facts, so the
final breakpoint keeps that width in a readable 2x2 fact layout.

Action presentation: the paid state truthfully shows all actions locked in
neutral gray. `Envoyé en cuisine` includes the completed check/label. Controls
measure 48px high at desktop/tablet and 64px at 390px. Available primary and
secondary colors are deterministic presentation branches protected by the same
unchanged eligibility conditions; no unsafe active order was opened merely to
capture them.

Discount interaction: `Remise` was closed on every fresh load. Click/touch
activation opened the persisted `Menu Express` entry, -1.50 EUR amount, and
`1 × Bún Thịt Nướng + 1 × Mochi glacé (2 pcs)` composition with zero overflow
at desktop and narrow sizes. Native summary focus and focus styling remained
present. The in-app driver did not toggle the focused native summary through
synthetic Enter, matching the previously recorded automation limitation.

Truthfulness: browser warnings/errors were empty; local-service/database and
unconfigured-printer status were visible; unsupported creator and fixed
kitchen-printer placeholders were absent. These files are final presentation
evidence and authorize no loader optimization, new state, mutation, API/schema,
authorization, printer/device, offline, or runtime work.

## Draft authority and review gate

The generated dimensions preserve the target viewport aspect ratios but are
not runtime browser evidence. These proposals may guide hierarchy, density,
proportions, spacing, and visual tone only. They do not authorize data,
behavior, route, shell, authorization, API/contract, persistence, printer, or
device changes. Product-owner selection and explicit reference approval are
required before Phase 1.
