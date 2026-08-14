# POS Order Entry - Design Handoff

Status: Visual direction approved for Phase 1

Visibility: Engineering

## Phase 0 source

The completed Implementation Inventory is in `README.md`. The target is the
existing integrated local POS page `/pos`, using
`EXISTING_CAPABILITY_RENEWAL`. It loads real local employees, creates a real
draft order through site-agent/db-pos, and redirects to real item entry.

Protected invariants include local-only ownership, current employee
eligibility/attribution, create-order contract/validation, UUIDv7 identity,
draft persistence, three order types, redirect semantics, truthful health and
device status, and fixture prohibition.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer              | Owner/source                                                                  | Reference status | Reuse exactly                                                                             | May adapt                                                | Excluded                                                            | Decision/blocker                        |
| ------------------ | ----------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------- |
| YUTA global        | `@yuta/ui`, semantic tokens, shared frontend rules                            | APPROVED         | semantic primitives/states, visible focus, labels, Lucide                                 | density and responsive composition                       | raw colors, another framework, Backoffice-only reference            | No blocker                              |
| POS application    | POS rules, `layout.tsx`, `PosPageShell`, `PosHeader`, `PosConnectivityStatus` | APPROVED         | IBM Plex Sans, dark header, logo/home, status strip, French copy, touch/keyboard patterns | narrow action menu and page padding                      | management shell, cloud tenancy, marketing UI, generic online badge | No blocker                              |
| Order-service flow | `/`, `/pos`, order detail/items/payment, `/kitchen`                           | APPROVED         | direct actions, title hierarchy, real routes, dense operational patterns                  | route-local content grouping                             | new navigation, table map, metrics, item/payment controls on `/pos` | No blocker                              |
| `/pos` page        | current route and baseline image                                              | REVIEWED         | real fields/copy/types, no-staff truth, create redirect                                   | grouping, spacing, responsive arrangement, state studies | new fields, login, customer/provider/table entities, fixtures       | Design review pending, context resolved |

### Shell and navigation

Shell mode: `REUSE_APPROVED_SHARED_SHELL`

Owners are `PosPageShell.tsx`, `PosHeader.tsx`, and
`PosConnectivityStatus.tsx`, supported by current `/pos` and related routes.

- Header: YUTA logo/home, `Nouvelle commande`, current description,
  `Service actif`, `Commandes`, and `Cuisine`.
- Visible primary destinations: `/` and `/kitchen` only.
- Success continuation: `/orders/<created-id>/items` through the existing
  action redirect, not a static design link.
- Sidebar, bottom navigation, tenant/account/session area: none.
- Mobile navigation: current header action menu; no new drawer or bottom bar.
- Adjacent real routes: `/`, `/pos`, `/kitchen`, `/orders/<id>`,
  `/orders/<id>/items`, and `/orders/<id>/payment`.
- Real but excluded from this header: `/management` and its protected children.
- Forbidden invention: Backoffice navigation, tenant switcher, notifications,
  customer account, table map, delivery provider, reports, payment/item panels,
  printer controls, and dead links.

## Current baseline capture

Baseline status: `CAPTURED`

File: `references/current-baseline-1366x768.png`

- Route/state: canonical `/pos`; captured at clean dev origin
  `http://localhost:3013/pos` after the reused `3003` origin exposed stale
  cached dev chunks.
- Viewport: 1366 x 768, DPR 1.
- Capture date: 2026-08-13, Europe/Paris.
- Runtime: healthy existing `yuta-pos-db-dev` on 55432, site-agent on 3004,
  POS dev server on 3013, real seeded users, no cloud dependency.
- Authentication/session: this route is not authenticated in the current MVP.
  `YuTa Staff` was selected for real employee attribution; no management PIN or
  bearer session was used.
- Visible state: `Sur place` selected; create enabled; local server/database
  available; Internet probe unconfigured (`Service local`); printer
  unconfigured; zero horizontal overflow; empty clean-tab warning/error console.
- Mutation safety: no field was submitted and no order/data changed.

Not visible: no eligible employee, load failure, submit pending, validation
failure, stale employee conflict, create failure, Internet outage, database or
site-agent outage, and narrow behavior. These are state studies or later QA
targets, not captured evidence.

## Curated design-tool input bundle

1. `references/current-baseline-1366x768.png` as current target reference.
2. This package's scope, UI, and data/interaction specifications.
3. Current `PosPageShell`, `PosHeader`, and `PosConnectivityStatus` as shell
   authority; the Backoffice shell image is not applicable.
4. Current order list and item-entry code as service-density/action context.
5. POS viewport matrix: 1366 x 768, 1024 x 768, 768 x 1024, 390 x 844.

## Design-generation prompt

Design prompt status: `READY`

### Prompt A - desktop operational renewal

```text
Use case: ui-mockup
Asset type: high-fidelity UI renewal proposal for the existing local restaurant POS page `/pos`
Primary request: Redesign the real YUTA POS new-order page for faster, safer service-time creation while preserving its exact shell, routes, fields, validation boundaries, and local-only runtime.
Input images: Image 1 is `current-baseline-1366x768.png`, the current real operational page. It is a visual reference, not an edit target. No Backoffice image applies.
Scene/backdrop: One 1366 x 768 application viewport, no browser chrome or device frame.
Operator context: Restaurant service staff on a local desktop/tablet POS. Speed, legibility, touch reachability, and recovery matter more than decoration.
Style/medium: Shippable French operational UI; compact, calm, restrained, high contrast; not a marketing/dashboard composition.
Shell/navigation: Reuse the shared POS shell exactly in hierarchy: dark header with YUTA logo/home, `Nouvelle commande`, `Creer une commande pour le service`, `Service actif`, `Commandes` -> `/`, `Cuisine` -> `/kitchen`, then the truthful local-service status strip. No sidebar, bottom navigation, tenant/account area, management navigation, notifications, or replacement shell.
Page hierarchy: One direct creation task. Employee attribution and table/reference first; all three order types visibly selectable; optional general note; one dominant create action. Blocking errors remain adjacent to the form. No steps, tabs, accordions, or dashboard cards.
Text (verbatim): `Nouvelle commande`; `Creer une commande pour le service`; `Service actif`; `Commandes`; `Cuisine`; `Employe`; `Choisir employe`; `Table / Repere`; `Terrasse 5`; `Type de commande`; `Sur place`; `A emporter`; `Livraison`; `Note (optionnel)`; `Ex: Anniversaire, demande generale...`; `Creer la commande`; `Aucun employe actif disponible pour creer une commande.`
Real data/content: A selected local employee such as `YuTa Staff` may illustrate the state, but generated names are non-authoritative. Use only employee, table/reference, order type, and optional note.
Required state studies: healthy/default; no eligible employee with disabled creation; submit pending; field-associated required/validation feedback preserving values; employee became unavailable with refresh/reselect recovery; site-agent/database unavailable; Internet unavailable while local service remains usable. These are design states, not authorization for runtime changes. Success remains the redirect to `/orders/<id>/items`, not a new dashboard, toast, or receipt.
Protected invariants: `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`; no cloud dependency/sync; selected employee is attribution, not authentication; site-agent validates active non-kitchen staff; exact types are dine-in, takeaway, delivery; table/reference is free text; new orders are draft; IDs are service-generated UUIDv7; browser receives no DB/device secrets; `/pos` performs no print command; printer failure does not redefine creation; no fixtures.
UI constraints: Current POS IBM Plex Sans, `@yuta/ui`, semantic token roles, Lucide, text-backed status, visible focus, keyboard operation, 44px touch targets, no essential hover-only behavior, no raw hex colors, and no horizontal overflow.
Avoid: no table map/entity, reservation/customer/loyalty fields, menu item browser here, totals, discounts, payments, VAT, fiscal receipt, delivery provider, cloud tenancy, staff PIN/login, new roles/permissions, offline mutation queue, printer settings/actions, analytics, charts, illustration, glassmorphism, gradients, watermark, invented routes/copy, or extra fields.
Output: Produce a realistic desktop proposal plus a compact annotated state strip for no-staff, pending, validation, and local-service failure. The result is DRAFT until repository review.
```

### Prompt B - narrow responsive companion

```text
Use case: ui-mockup
Asset type: high-fidelity narrow responsive companion for existing local POS `/pos`
Primary request: Adapt the reviewed desktop direction to 390 x 844 without changing capabilities, shell ownership, field order, routes, or runtime behavior.
Input images: Image 1 is the current 1366 x 768 `/pos` baseline; Image 2 is the desktop proposal from Prompt A. Both are references, not edit targets.
Scene/backdrop: One 390 x 844 application viewport, no device frame.
Composition/framing: Reuse the current compact POS header/action menu and status strip. Use one scroll-safe form column. Keep employee, table/reference, three direct order-type choices, optional note, and `Creer la commande` reachable with touch and virtual keyboard. Types may wrap only if all remain immediately visible.
Required behavior/state intent: 44px touch targets, visible focus, text-backed selected/disabled/error/pending states, no horizontal overflow, no clipped submit, and recoverable form state after validation/service failure. Preserve the exact local route, employee eligibility, three types, Server Action/site-agent ownership, and success redirect.
Avoid: no bottom navigation, new drawer, sidebar, stepper, hidden types, virtual-keyboard-obscured sticky overlay, customer/table/provider fields, item/payment UI, login/PIN, cloud modules, printer action, invented route/API/schema/permission, watermark, or extra text.
Output: Produce one shippable narrow companion and a small no-employee or service-unavailable variant. It remains DRAFT until product review.
```

## Handoff result

Phase 0 was approved for design generation on 2026-08-14. The built-in ImageGen
workflow produced two repository-local references:

- `references/design-proposal-01-desktop.png` - 1672 x 941 output representing
  the requested 1366 x 768 desktop composition, with the healthy form and four
  subordinate state studies.
- `references/design-proposal-02-narrow.png` - 852 x 1846 output matching the
  requested 390 x 844 aspect, with the scroll-safe form and a subordinate local
  service failure study.

Both outputs were approved on 2026-08-14 as visual direction rather than
implementation or behavior evidence. Implementation must use the repository
inventory and current baseline as authority. In particular, generated
typography, icons, pixels, copy rendering, status layout, and state-study
messages are directional; they
do not override `@yuta/ui`, semantic tokens, current French product copy,
contracts, routes, validation, authorization, or service behavior. The narrow
proposal intentionally shows its failure study after the healthy form as a
separate visual study, not as a simultaneous runtime state.

The approved direction is implemented. Phase 5 production-build evidence is
stored in `references/phase-05-as-built-*.png`, with the non-mutating validation
state in `references/phase-05-validation-390x844.png`. The as-built result keeps
the approved shared shell and page hierarchy while preserving repository-owned
copy, routes, actions, service boundaries, and data behavior.

The final product-owner correction makes the `/pos` instance full-width and
uses the prominent desktop sizing shown by the approved reference. This is a
presentation variant of `PosHeader`/`PosPageShell`, not a replacement shell:
sibling POS routes keep their current density, and `/pos` keeps the same logo
destination, command/kitchen routes, local-status strip, and mobile menu.
