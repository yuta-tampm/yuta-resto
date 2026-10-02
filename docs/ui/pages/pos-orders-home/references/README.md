# POS Orders Home — Reference Metadata

Status: Current Phase 0 baseline through final Phase 5 as-built evidence

Visibility: Engineering

Reference status: `APPROVED`

## Cross-route service-header unification

Product-owner follow-up on 2026-08-16 standardized the Home prominent header
geometry across every non-management `PosPageShell` route. Read-only production
QA covered `/`, `/pos`, `/kitchen`, order detail, item entry, payment, and
item-split payment. At the available desktop browser width of 1280 CSS pixels,
every route rendered a 90px header with a 56px logo and zero document overflow.
At 390×844, every route rendered the same 70px compact header with zero
document overflow. The direct `Nouvelle commande` navigation action was visible
only on Home; route-owned send, payment, and status actions remained available.
The shared leading back arrow was subsequently removed from service-time
headers to match Home. Management and login were deliberately excluded.

## Post-Phase-5 data-path verification

The separately approved performance/data extension was verified read-only on 2026-08-16 against `http://localhost:3003/`, the running site-agent, and current local PostgreSQL. `GET /api/v1/orders/home` returned the naturally persisted open order `POS-20260816-105407-CAC4A0` with the same stored 20,00 EUR total and three item rows as its detail endpoint. A literal `%` search returned no false wildcard match, normal `tes` search returned the order, a no-match `page=99` request clamped to page one, and the production Home retained 1366/1366 CSS-pixel geometry with no horizontal overflow.

No new screenshot was added because the summary endpoint intentionally leaves the one-page visual output unchanged from the Phase 5 evidence matrix. No fixture or order/payment/kitchen/print mutation was used. The database did not contain enough natural current-service orders for a second page, so many-order pagination remains covered by source/unit and opt-in disposable-database tests rather than fabricated browser evidence. The generated paid-at query-index migration was not applied to the operational QA database.

The product-owner-supplied header direction was approved for implementation. Baseline and as-built images are reviewed evidence; no generated full-page design was requested or approved.

## Phase 5 final as-built evidence

Production QA used the clean `http://localhost:3003/` build on 2026-08-16 with the required site-agent and local PostgreSQL running. One naturally persisted open `sent` order was available: `POS-20260816-105407-CAC4A0`, three item rows, stored total 20,00 EUR. The local service and database were available, Internet status was unknown, and the printer was not configured. No order/payment/kitchen/print mutation or fixture was used.

- `phase-5-as-built-1366x768.png`: desktop table renderer; full-width shell; 44px order actions; 1366/1366 document width.
- `phase-5-as-built-1024x768.png`: tablet-row renderer; full-width shell; 44px order actions; 1024/1024 document width.
- `phase-5-as-built-768x1024.png`: tablet portrait renderer and compact header menu; 44px order actions; 768/768 document width.
- `phase-5-as-built-390x844.png`: mobile card renderer, compact menu, accessible icon-only search submit, and FAB; 44px order actions; 390/390 document width.

All visible interactive targets measured at least 40px and all direct order actions measured 44px after the Phase 5 correction. The correct renderer alone was visible at each breakpoint. `Filtres` and `Options` counts were zero. The secondary menu exposed only `/kitchen` and `/management` on desktop, while `/pos` remained direct. Keyboard focus reached the semantic menu summary.

State checks used GET/read navigation only: `open` and `all_today` displayed the persisted order; `paid_today` displayed the truthful empty state; `q=__phase5_no_match__` displayed the truthful no-match empty state and remained in all generated segmented-view URLs. Loading/framework error, route-owned retry, degraded local service/database, many-order internal scrolling, allergy, and unavailable order statuses could not be produced truthfully without changing runtime/data conditions and remain recorded evidence gaps.

## Phase 3 interaction evidence

Production QA used `http://localhost:3003/` on 2026-08-16 with current persisted local data. One open `sent` order was naturally present in the service day (`POS-20260816-105407-CAC4A0`, three item rows, stored total 20,00 EUR). The site-agent and database were available, the printer was not configured, and Internet status remained unknown. No operational mutation was used.

- `phase-3-interactions-1366x768.png`: the truthful `Rechercher` GET action is visible; the desktop `Options` ellipsis is absent; the existing detail and payment links remain direct; document width is 1366/1366.
- `phase-3-interactions-390x844.png`: the icon-only search submit exposes the accessible name `Rechercher`; the order card and new-order FAB remain available; document width is 390/390.

Browser assertions found zero `Filtres` buttons and zero `Options` buttons at both viewports. Submitting the existing GET form produced `/?view=open&q=POS-20260816-105407-CAC4A0`. The rendered paid-today link preserved the query as `/?view=paid_today&q=POS-20260816-105407-CAC4A0`, and opening that exact generated URL retained the input value. Keyboard focus reached the semantic submit button; the browser-control backend did not reliably dispatch Enter, so keyboard activation is supported by native button/form semantics but remains a device-test follow-up. No current allergy-bearing order existed, so the one-badge correction is source-verified but not visually proven with persisted data.

## 2026-08-16 full-viewport correction evidence

The product owner requested that the complete POS route canvas use the available device width after testing on a real device. Production QA used `http://localhost:3003/` with the current local PostgreSQL and site-agent. The database and site-agent were available, the printer was not configured, and the current service day contained no orders. Only GET/read navigation was used; no fixture, create, edit, send, cancel, pay, kitchen transition, print, or management login was performed.

- `full-viewport-home-1366x768.png`: Home `main`, shared shell, header, subheader, and content span 1366/1366 CSS pixels with no document-level horizontal overflow.
- `full-viewport-home-390x844.png`: Home `main`, shared shell, and header span 390/390 CSS pixels with no document-level horizontal overflow; compact navigation and FAB remain available.

Additional measured production geometry:

- Home at 1920×1080: `main`, shell, header, and subheader each measured 1920/1920 CSS pixels; document `scrollWidth` and `clientWidth` were both 1920.
- `/pos` at 1920×1080: `main`, shell, and header measured 1920/1920 CSS pixels; the task-focused order form remained intentionally bounded at 670px.
- `/kitchen` at 1920×1080: `main`, shell, and header measured 1920/1920 CSS pixels.
- `/management` and its authenticated child routes redirected to `/management/login` because the QA browser had no management session. The unauthenticated canvas measured 1920/1920 CSS pixels and the login card remained intentionally bounded at 448px. Authenticated management rendering is protected by source/type/build checks but remains a truthful browser-evidence gap.

The 1920px screenshot surface was capped below the requested CSS viewport by the browser capture backend, so it was not retained. The 1920px DOM geometry above and the complete 1366px/390px captures are the authoritative evidence.

## Phase 2 shared-header evidence

- `phase-2-shared-header-menu-1366x768.jpg`: clean production build with the shared `PosHeader` secondary menu open. Direct action and trigger are both 48px high; dropdown width is 256px; right edge is 1350/1366; document width is 1366/1366; links are `/kitchen` and `/management`.
- `phase-2-shared-header-menu-390x844.jpg`: clean production compact menu with `/pos`, `/kitchen`, and `/management` visible and no document-level horizontal overflow.

The development server was separately checked at 1366×768 after a clean restart: direct action and trigger were both 48px high at the same y coordinate, dropdown width was 256px, right edge was 1350/1366, and document width was 1366/1366. Development and production use the same shared component markup and passed the same geometry/navigation assertions. Only GET/read operations were used.

## Phase 1 header evidence

The following captures show the implemented header-only renewal against current persisted local data on 2026-08-15 (Europe/Paris). The route was served from a clean production build at `http://localhost:3013/`. Site-agent and database were available, Internet remained unknown, and the printer was not configured. Four open `sent` orders were visible; no fixture or operational mutation was used.

- `phase-1-header-1366x768.png`: full-width 90px prominent header; 56px logo/action height; desktop actions visible; document width 1366/1366.
- `phase-1-header-1024x768.png`: full-width 90px prominent header; desktop actions visible; document width 1024/1024.
- `phase-1-header-768x1024.png`: full-width 90px header; existing 44px compact menu shown below `lg`; document width 768/768.
- `phase-1-header-390x844.png`: full-width 70px narrow header; existing 44px compact menu; document width 390/390.
- `phase-1-header-secondary-menu-1366x768.jpg`: corrected follow-up desktop state with only `Nouvelle commande` direct and the open three-line menu exposing `Cuisine` and `Gestion`. The direct action and menu trigger are both 48px high; the dropdown is anchored 16px from the viewport's right edge and does not overflow.
- `phase-1-header-secondary-menu-390x844.jpg`: compact menu open with the three existing destinations `/pos`, `/kitchen`, and `/management` presented as direct links.

All captures had no document-level horizontal overflow. The command list retained its existing internal vertical scrolling and responsive table/row/card renderers. The loader remained read-only and did not recalculate or mutate orders. The QA server and browser tab were stopped after capture.

The original four Phase 1 captures remain authoritative for full-width/responsive dimensions, but their desktop direct-action placement is superseded by `phase-1-header-secondary-menu-1366x768.jpg`.

## `header-direction-full-width.png`

- Source: product-owner supplied image on 2026-08-15.
- Review decision: approved direction for Home desktop header width, prominence, and scale; follow-up annotation approves keeping only `Nouvelle commande` direct and grouping `Cuisine`/`Gestion` in the three-line menu.
- Reuse: the established `/pos` full-width/prominent desktop header variant and its compact menu below `lg`.
- Home-specific content: title `Commandes`; real actions remain `Nouvelle commande`, `Cuisine`, and `Gestion`; the shared health strip remains the truthful service-state source.
- Explicit non-reuse: the `/pos` form, `Commandes` self-navigation shown in the image, static `Service actif` badge, and any unrelated page content or capability.
- Full-page status: not a Home design proposal and not approval for Phase 1.

## `phase-0-current-1366x768.png`

- Purpose: current real-data desktop baseline.
- Route: `http://localhost:3013/` (`view=open`).
- Viewport: 1366×768.
- Captured: 2026-08-15, Europe/Paris.
- Data: current local site-agent/database; 10 persisted orders in the first 200; current service day contains 4 open orders, all `sent`, 0 paid-today, 4 all-today, 21 item rows/quantity units, and no allergy-bearing open order.
- Health: site-agent and database available; Internet probe unknown; printer not configured.
- Overflow: document width 1366/1366 and height 768/768. Vertical list overflow is intentionally contained inside the shell content region.

## `phase-0-current-390x844.png`

- Purpose: current real-data narrow baseline showing mobile cards, collapsed header actions, and new-order FAB.
- Route: `http://localhost:3013/?view=open`.
- Viewport: 390×844.
- Captured: 2026-08-15, Europe/Paris.
- Data/health: same persisted state as desktop.
- Overflow: document width 390/390 and height 844/844; no document-level horizontal overflow.

## Capture safety and gaps

Only GET/read operations were used. No fixture, create, edit, send, cancel, pay, kitchen transition, test print, or print job was used for evidence. The Home loader/detail path was confirmed read-only and did not recalculate persisted totals/statuses.

The initially running production server on port 3003 had stale chunk artifacts during narrow reload. Final captures used a temporary clean dev port 3013 at `localhost`; it was stopped after capture, and its generated `next-env.d.ts` change was reverted so no runtime source change remains.

The baseline does not prove draft/preparing/ready/served/paid/cancelled/allergy/populated-paid views or degraded/error variants because current real data did not safely provide them. This is a truthful evidence gap, not permission to seed or mutate data.

## Non-authority

These images do not define routes, product scope, authorization, permissions, contracts, APIs, persistence, runtime/device ownership, business logic, exact copy, or raw color values. The product owner has approved only the stated header direction. No generated full-page proposal is approved; any future full-page design asset starts as `DRAFT`.
