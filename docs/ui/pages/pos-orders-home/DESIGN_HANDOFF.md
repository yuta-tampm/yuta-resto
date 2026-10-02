# POS Orders Home — Design Handoff

Status: Ready for design generation after product-owner Phase 0 approval

Visibility: Engineering

## Phase 0 source

The implementation inventory is recorded across `README.md`, `PRODUCT_SCOPE.md`, `UI_SPEC.md`, and `DATA_AND_INTERACTION_SPEC.md`. The target is the existing integrated local POS service home at `/`, renewed under `EXISTING_CAPABILITY_RENEWAL` without replacing real data or changing service ownership.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer        | Owner/source                                                    | Reference status                | Reuse exactly                                                                                                      | May adapt                                           | Excluded                                     | Decision/blocker |
| ------------ | --------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | -------------------------------------------- | ---------------- |
| YUTA global  | `@yuta/ui` exports and global semantic tokens                   | APPROVED repository source      | tokens, primitives, Geist/Inter, focus/accessibility rules                                                         | composition/density                                 | raw colors/new UI framework                  | resolved         |
| Application  | `PosPageShell`, `PosHeader`, `PosConnectivityStatus`, POS rules | APPROVED current implementation | full-viewport shell, full-width/prominent desktop header variant, compact responsive menu, and health distinctions | Home-specific title/actions and content composition | Backoffice/management shell, new sidebar/nav | resolved         |
| Section/flow | `/pos`, order items success, order detail, kitchen, payment     | APPROVED implemented flow       | real route ownership and status/action boundaries                                                                  | page-level hierarchy                                | cross-route capability invention             | resolved         |
| Page/screen  | current `/` captures and implementation                         | DRAFT current baseline evidence | real fields/views/search/routes/states                                                                             | visual hierarchy, density, responsive presentation  | dead controls becoming features              | resolved         |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Shell owner: `apps/yuta-pos/src/components/pos/PosPageShell.tsx`, `PosHeader.tsx`, and `PosConnectivityStatus.tsx`. The route canvas and operational content use the full viewport width. Home must use the existing full-width/prominent desktop header treatment established by `/pos`, with shared `actions`/`secondaryActions` composition and the existing compact menu below `lg`; header/navigation content remains Home-specific. Focused forms, dialogs, success cards, and login cards may remain bounded for readability. Allowed routes are `/pos`, `/kitchen`, `/management`, `/orders/[orderId]`, and `/orders/[orderId]/payment`. No sidebar, Backoffice shell, persistent management nav, staff account area, or new mobile navigation may be invented.

Curated design bundle:

- `references/phase-0-current-1366x768.png`;
- `references/phase-0-current-390x844.png`;
- `references/header-direction-full-width.png`, reviewed for header width/scale only;
- current `PosPageShell`/`PosHeader`/health strip behavior;
- approved visual context from completed `/pos` and `/orders/[orderId]/items` page packs, used only for POS family consistency;
- `UI_SPEC.md` and `DATA_AND_INTERACTION_SPEC.md`.

## Current baseline capture

Baseline status: `CAPTURED`

Capture date: 2026-08-15, Europe/Paris service day 2026-08-15 05:00 through 2026-08-16 05:00.

| File                           | Route/state   | Viewport | Runtime/data conditions                                                                                                                                             |
| ------------------------------ | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `phase-0-current-1366x768.png` | `/`, `open`   | 1366×768 | clean temporary port 3013; current site-agent/database; 4 open sent orders; 0 paid-today; 4 all-today; no current allergy; Internet unknown; printer not configured |
| `phase-0-current-390x844.png`  | `/?view=open` | 390×844  | same persisted data and health conditions; mobile cards, collapsed header menu, FAB                                                                                 |

Document metrics were `scrollWidth === clientWidth` at both viewports. `PosPageShell` intentionally keeps the document at viewport height and places vertical scrolling inside the main content region, so document `scrollHeight === clientHeight` does not mean every order row is visible without internal scrolling.

The production server already running on port 3003 had stale chunk artifacts during narrow capture (`ChunkLoadError`). No code or data was changed; the final evidence came from a clean temporary dev port using `localhost`, then that process was stopped. The health API and final hydrated strip reported site-agent/database available, printer not configured, and Internet unknown.

Important states not visible: draft, preparing, ready, served, paid, cancelled, allergy, paid-today populated, genuine empty service day, search no-match, database/server unavailable, Internet unavailable, printer ready/printing/attention/unavailable, and route load error. They remain truthful gaps; no fixture/order mutation was used to manufacture them.

## Design-generation prompt

Design prompt status: `READY`

### Ready-to-use prompt

Create a UI design proposal, not implementation code, for the existing YUTA local POS Home route `/` in `apps/yuta-pos`. This is an `EXISTING_PAGE`, implementation class `integrated`, using `EXISTING_CAPABILITY_RENEWAL`. Use the supplied real current-state captures at 1366×768 and 390×844. Preserve repository behavior; the proposal may improve hierarchy, density, scanning, spacing, responsive composition, and accessibility only.

Operator context: French restaurant staff use this service-time screen to list, monitor, reopen, and continue current commands. It is the Home destination after the successful kitchen-send screen on `/orders/[orderId]/items`. Use the reviewed full-width/prominent desktop POS header direction from `header-direction-full-width.png` and keep the truthful local health strip; do not turn the page into a Backoffice dashboard or management shell.

Use one shell/navigation model: `REUSE_APPROVED_SHARED_SHELL`. Reuse `PosPageShell`, `PosHeader`, `PosConnectivityStatus`, YUTA semantic tokens, Geist Sans with Inter fallback, `@yuta/ui` primitives, and lucide icons. The route canvas, header, health strip, subheader, and operational order content must use the full available viewport width rather than a centered desktop max-width container. Focused forms, dialogs, success cards, and login cards may remain bounded for readability. At `lg` and above, the header must span the full viewport width and use the existing prominent `/pos` scale (approximately 90px tall with a 56px logo, equal 48px Home action/menu controls, and a 30px title). Below `lg`, retain the compact collapsed action menu. The approved real Home destinations are `Nouvelle commande` → `/pos`, `Cuisine` → `/kitchen`, and `Gestion` → `/management`; do not copy the reference image's `Commandes` self-link or static `Service actif` badge. The shared health strip remains the truthful service-state source. Order detail is `/orders/[orderId]`; payment is `/orders/[orderId]/payment`. Retain the accessible new-order FAB on narrow screens. Do not add a sidebar, bottom navigation, staff account/login area, Backoffice navigation, or management header.

Real service-day views are `Ouvertes`, `Payees aujourd'hui`, and `Activite aujourd'hui`. The local service day runs from 05:00 inclusive to the next 05:00 exclusive. Open shows draft/sent/preparing/ready/served orders created in the window. Paid-today uses payment time. Activity shows orders created or paid in the window. Preserve query-string search by table/repere label or order number and preserve the query when changing views.

Real order presentation fields are: table/repere label, order number, order type (`Sur place`, `A emporter`, `Livraison`), stored order status, creation time, order-item row count, stored total in euros, and an allergy warning derived from persisted order/item data. Stored totals and statuses are service-owned; do not calculate or transition them in presentation. Current status set is exactly draft, sent, preparing, ready, served, paid, cancelled. Draft offers a detail navigation labelled `Envoyer` today but does not send directly. Sent/preparing/ready/served can navigate to payment. Paid/cancelled offer detail only. Do not create new statuses or actions.

Provide coordinated desktop/tablet/mobile designs. Desktop at 1366×768 should support a dense scannable table or equally efficient operational list. Tablet targets include 1024×768 and 768×1024. Mobile target is 390×844 with cards, reachable primary actions, internal vertical scrolling, no document-level horizontal overflow, and no essential hover-only interaction. Maintain roughly 44px touch targets, visible focus, keyboard-operable links/forms, accessible labels for icon-only controls, and status/allergy communication that does not rely on color alone.

Show or annotate truthful designs for loading, selected-view empty, search no-match, load error with safe retry, and degraded local conditions: POS/site-agent unavailable, database unavailable, Internet unavailable while local operation remains available, and printer not configured/unavailable/attention/ready. Health polling remains the current shared behavior; the order list currently has no polling or realtime refresh. Do not imply that a retry changes operational data.

Phase 3 removed the unsupported affordances rather than inventing behavior: the GET search form now submits through `Rechercher`, and the actionless desktop `Options` ellipsis is absent. Do not create a filter drawer, overflow actions, cancellation, printing, customer fields, or other hidden capability.

Explicitly exclude customer profile/CRM, delivery-provider integrations, fiscal/VAT/invoice features, new order/payment/kitchen/print states, new roles or permissions, staff login, cloud sync, cloud tenancy, offline mutation queue, background sync, realtime capability not already present, new printer controls, new API/contract/schema/migration, presentation-owned totals, and presentation-owned status transitions. Do not expose device paths or suggest cloud persistence.

Return one desktop, one tablet, and one mobile proposal with consistent information hierarchy plus brief annotations for the full-width/prominent-to-compact header transition, responsive content, touch/accessibility, empty/error/degraded states, and which current dead controls were removed. Mark every full-page proposal as `DRAFT` pending product-owner review; the supplied header direction alone is already reviewed.

## Handoff result

No design generation was run. Phase 1 header implementation, the Phase 2 shared-header refactor, the approved Phase 3 interaction cleanup, the Phase 4 no-change data audit, and Phase 5 production visual QA are complete. The stable page pack now matches the implemented as-built route. Any later generated full-page reference still enters as `DRAFT` and cannot override repository-backed behavior.
