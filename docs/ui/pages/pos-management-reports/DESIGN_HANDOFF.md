# POS Management Reports — Design Handoff

Status: Approved direction delivered and Phase 5 as-built verified

Visibility: Engineering

## Phase 0 source

The completed inventory is in `README.md`. This is a `NEW_PAGE`, future
integrated, read-only local POS capability under `NEW_CAPABILITY_DISCOVERY`.
Product/data decisions `R0-01` through `R0-10` were approved on 2026-08-20.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer              | Owner/source                                                 | Status   | Reuse exactly                                                       | May adapt             | Excluded                              |
| ------------------ | ------------------------------------------------------------ | -------- | ------------------------------------------------------------------- | --------------------- | ------------------------------------- |
| YUTA global        | `@yuta/ui`, semantic tokens, shared rules                    | APPROVED | components, typography, focus, text states, Lucide                  | page density          | raw colors/new UI system              |
| POS application    | POS product/UI rules                                         | APPROVED | French operational copy, full-width canvas, touch/keyboard behavior | compact report layout | cloud/marketing shell                 |
| Management section | `ManagementHeader`, home and establishment as-built evidence | APPROVED | dark header, local identity, role, return to POS, account/sign-out  | narrow compression    | sidebar/drawer/bottom nav/tabs        |
| Reports page       | this Phase 0 pack and approved references                    | APPROVED | three metrics, service window, bounded activity list, order link    | card/list composition | charts/export/fiscal/cloud/date range |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Real shared routes: `/`, `/management`, `/management/users`,
`/management/catalog`, `/management/combos`, `/management/establishment`, and
`/management/printing`. `/management/reports` is proposed. Do not invent other
navigation.

Curated visual sources:

- `../pos-management-home/references/phase-05-as-built-1366x768.png`;
- `../pos-management-home/references/phase-05-as-built-390x844.png`;
- `../pos-management-establishment/references/phase-05-as-built-1366x768.png`;
- `../pos-management-establishment/references/phase-05-as-built-390x844.png`.

These establish shell ownership only. They do not define report fields or
financial semantics.

## Current baseline

Baseline status: `NOT_APPLICABLE`

The page and route are absent. Phase 0 used repository and existing as-built
Management evidence only. No runtime was started, no authenticated page was
captured, and no operational data was queried or changed.

## Design-generation prompt

Design prompt status: `READY`

This prompt was executed after explicit Phase 1 approval on 2026-08-20.

```text
Use case: UI mockup for a new read-only local restaurant POS Management page.
Target: `/management/reports` in YUTA POS.
Output after approval: one 1366×768 desktop proposal and one 390×844 narrow companion, without browser/device frame or implementation code.

Reuse the supplied approved POS Management shell exactly in hierarchy: dark `ManagementHeader`, YuTa POS / Gestion locale identity, signed-in local admin or manager, Retour au POS, and account/sign-out. Under it keep an in-content Retour à la gestion link. Do not add a sidebar, drawer, bottom navigation, tabs, Backoffice shell, cloud establishment selector, notification center, or second account area.

Purpose: an authorized local admin/manager needs a compact point-in-time operational view of the current restaurant service day and can open the correct existing POS order.

Page hierarchy: eyebrow Gestion locale; title Rapports locaux; concise sentence explaining that data is local and the service day runs 05:00 to 05:00; visible exact interval and generated/refresh time; three metric cards in order Encaissé aujourd'hui, Commandes payées, Commandes ouvertes; one Activité du jour section with bounded order rows and pagination; direct Ouvrir la commande link in each row; clear Actualiser action.

Candidate row content pending product approval: order number, table/service label, order type, textual status, created time, paid time when present, order total, payment mode, and possibly paid principal during this service day. Do not expose payment/check IDs, internal IDs, staff identity, cancellation/refund reasons, or database metadata.

Required state studies: loading without fake zeros; valid empty service with three zero metrics; local site-agent/database unavailable with retry; missing/expired session with no financial content and login recovery; narrow stacked rows; pagination. Internet loss alone must not be shown as a report outage when the local stack remains healthy.

Truth constraints: this is not accounting, fiscal, tax, cash closing, bank reconciliation, or cloud reporting. Do not use chiffre d'affaires net, ventes nettes, clôture, Z report, fiscal, compliant, or synchronized claims. No charts, trends, comparisons, date picker/range, export/PDF/CSV, payment-method breakdown, tips, cash drawer, refund action, edit/pay/cancel action, printer/device state, live indicator, polling, or offline cache.

Financial constraints: the future paid metric is payment principal captured in the 05:00 service day, including partial and split payments once. Paid orders are parent orders fully paid in the window, one per order. Open orders use the current non-final service-day predicate. These remain proposals until product approval; the mockup must not claim the backend exists.

Visual direction: calm operational density, highly legible, YUTA semantic roles, current cards/buttons/badges, Lucide-style icons, French copy, textual states, visible focus, and 44px touch controls. Desktop may use three compact metric columns. Narrow view stacks metrics and order rows without horizontal page overflow.

Review criteria: exact Management-shell fidelity; fast scanning; truthful service-day and local-only scope; no invented navigation/capability; explicit state/recovery behavior; direct accessible order link; responsive touch-safe composition.
```

## Handoff result

The built-in image generation tool created two page-specific DRAFT references
on 2026-08-20:

- `references/design-proposal-01-desktop.png`, generated at 1672×941 in the
  requested 16:9 desktop direction;
- `references/design-proposal-02-mobile.png`, generated at 853×1844 in the
  requested narrow portrait direction.

Both preserve the approved dark Management shell, three-metric hierarchy,
manual refresh, bounded activity list, direct order actions, and absence of
charts/export/cloud/fiscal controls. The mobile reference correctly replaces
the desktop table with stacked order cards.

The product owner approved both references on 2026-08-20 for their shared-shell
fidelity, hierarchy, density, metric order, manual refresh, activity-list
structure, stacked narrow rows, and direct order actions. Their raster
dimensions are generation output, not browser QA evidence or a supported
viewport claim. Generated values, exact copy, icons, colors, font metrics,
state coverage, and pagination remain illustrative. Phase 1 created no runtime,
route, fixture, API, contract, schema, migration, or operational-data change.
Phase 2 was separately authorized and implemented on 2026-08-20 as a
development-only fictional composition. It follows the approved hierarchy but
is not browser-QA evidence or production behavior. Phase 3 was separately
authorized and completed with browser-local fictional interactions. Phase 4
then replaced the prototype with the authenticated local read slice; Phase 5
browser/as-built validation was separately authorized and completed on
2026-08-20.

The built-in edit flow produced `design-proposal-02-mobile.png` from the first
mobile generation by replacing only three misleading `période sélectionnée`
phrases with fixed-service-day copy. `design-proposal-01-mobile.png` remains in
the package as superseded DRAFT evidence and is not the review candidate.
