# POS management catalog — Design Handoff

Status: Approved visual direction

Visibility: Engineering

## Phase 0 source

The completed Implementation Inventory is in `README.md`. The target is the
existing integrated local POS screen `/management/catalog`. It lets an
authenticated local admin or manager maintain the real single-site catalogue
without cloud access while preserving `yuta-pos -> site-agent -> db-pos`,
validated mutations, no-hard-delete history, and downstream POS ordering rules.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer        | Owner/source                                                                       | Reference status | Reuse exactly                                                                                                                                 | May adapt                                                                   | Excluded                                                                     | Decision/blocker                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| YUTA global  | `@yuta/ui`, semantic tokens, `YutaBrandMark`, frontend rules                       | APPROVED         | typography, semantic states, focus, accessible primitives, Lucide icons                                                                       | density and responsive composition                                          | Backoffice shell/navigation and raw reference colors                         | No blocker; use only the global foundation relevant to POS.                                                                |
| Application  | `apps/yuta-pos/AGENTS.md`, POS UI rules, current management routes                 | APPROVED         | French operational copy, local-session context, touch/keyboard conventions                                                                    | compact header layout by viewport                                           | cloud tenancy, cloud Backoffice, marketing navigation                        | No blocker.                                                                                                                |
| Section/flow | `/management`, `PrintingManagementHeader.tsx`, approved printing as-built evidence | APPROVED         | dark POS Management top header direction, YUTA POS identity, `Gestion locale`, user/role context, return-to-POS and account/sign-out behavior | compress labels on small widths using the existing responsive pattern       | left sidebar, mobile drawer, persistent module tabs, invented modules        | Product owner approved this shared direction on 2026-08-11. Runtime reuse is deferred to an approved implementation phase. |
| Page/screen  | current catalogue baselines plus proposals 01 and 02                               | APPROVED         | real catalogue hierarchy, fields, actions, states, and return to `/management`                                                                | overview density, category disclosure, editor grouping, responsive stacking | invented data, routes, fields, drag persistence, bulk/search/filter features | Visual direction approved on 2026-08-11 with documented raster text/data deviations.                                       |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`

Shell owner/reference: the approved POS Management direction is evidenced by
`apps/yuta-pos/src/app/management/printing/PrintingManagementHeader.tsx` and
the accepted printing as-built captures, especially
`../pos-management-printing/references/phase-05-as-built-1366x768.png` and
`../pos-management-printing/references/phase-05-as-built-390x844.png`.

- Header: compact dark top header with YUTA POS identity, `Gestion locale`,
  authenticated user/role context, `Retour au POS`, and account/sign-out.
- Primary navigation: `/management` is the module hub; do not reproduce all
  modules as persistent navigation on the catalogue screen.
- Sidebar and mobile navigation: none. Do not add a left rail, drawer, or bottom
  module navigation.
- Page navigation: expose `Retour à la gestion` from the catalogue content to
  `/management`.
- Allowed real destinations: `/`, `/management`, `/management/users`,
  `/management/catalog`, `/management/combos`, and `/management/printing`.
- Unavailable route: `Rapports locaux` has no href and must not be presented as
  a working destination.
- Forbidden invented elements: unrelated POS sections, cloud modules, new
  roles, tenant switching, notification/help controls, or any navigation not
  supported by current routes.

Curated design-tool input bundle:

1. the three authenticated catalogue baseline captures in this package;
2. draft `design-proposal-01.png` for overview composition and
   `design-proposal-02.png` for editor composition;
3. the two approved POS printing as-built references named above for shared
   header behavior at desktop and mobile widths;
4. the exact shell/navigation decision, route inventory, and exclusions in
   this section;
5. `PRODUCT_SCOPE.md`, `UI_SPEC.md`, and `DATA_AND_INTERACTION_SPEC.md` for the
   real page hierarchy, states, and protected invariants.

## Current baseline capture

Baseline status: `CAPTURED`

Captured on 2026-08-09 from
`http://localhost:3003/management/catalog` at `1366 × 768`. The current POS
Next.js development server, `site-agent`, and local PostgreSQL catalogue were
running. The browser already had a valid active local management session for an
admin/manager; access was confirmed by the protected route rendering directly
rather than redirecting to `/management/login`.

The populated seed-backed state contained 12 categories and 53 catalogue rows,
with visible/hidden and available/unavailable affordances, category/item order,
station, price, ordering policy, instruction summaries, and the unavailable
zero-price `Plat spécial du samedi`. Opening the edit dialog was read-only for
capture purposes; no form was submitted and no catalogue data was changed.

Files:

- `references/current-baseline-1366x768.png` — populated top viewport;
- `references/current-baseline-1366x768-full-page.png` — full current catalogue;
- `references/current-baseline-edit-item-dialog-1366x768.png` — current
  scrollable article editor.

Not captured: empty catalogue, empty category, expired/forbidden session,
site-agent unavailable, pending mutation, success feedback, Zod validation,
name conflict, not-found conflict, category visibility confirmation, and item
availability confirmation. These must be designed from the current code and
contracts, not manufactured by mutating the live catalogue solely for images.

## Design-generation prompt

Design prompt status: `READY`

### Ready-to-use prompt

Create a high-fidelity visual redesign proposal for YUTA’s existing local POS
management screen `/management/catalog`. This is a French operational
restaurant interface used by a local administrator or manager, not a marketing
dashboard and not the cloud Backoffice. Use the attached authenticated baseline
images as the current-state visual input. Produce the primary design at
1366 × 768, plus concise responsive annotations for 1024 × 768, 768 × 1024,
and 390 × 844. Also produce a companion view of the article editor dialog.

Use the approved POS Management shared shell shown by the supplied printing
as-built references: a compact dark top header with YUTA POS identity,
`Gestion locale`, signed-in user/role context, `Retour au POS`, and the existing
account/sign-out pattern. `/management` is the module hub, and this child page
must expose `Retour à la gestion` in page content. There is no left sidebar,
mobile drawer, bottom module navigation, or persistent module tab bar. Do not
invent one. The real available management routes are users, catalogue, combos,
and printing; `Rapports locaux` is unavailable and has no route.

Preserve the existing product scope and real data hierarchy:

- a compact local-management context/header, screen title `Menu et catégories`,
  explanatory text, and return navigation to `/management`;
- top actions `Options notes / allergies`, `Nouvelle catégorie`, and
  `Nouvel article`;
- an ordered catalogue of categories, each with name, visible/hidden status,
  sort order, instruction-suggestion count, article count, edit action,
  category-scoped new-article action, and confirmed show/hide action;
- each article’s name, available/unavailable status, ordering policy
  (`Quantités regroupées` or `Une ligne par portion`), TTC price, preparation
  station (`Cuisine`, `Bar`, `Dessert`, or none), sort order, optional
  description, edit action, and confirmed availability toggle;
- category create/edit fields for name, sort order, primary instruction codes,
  and additional instruction codes;
- article create/edit fields for category, name, optional description, TTC
  price, sort order, inherited versus article-specific note suggestions,
  primary/additional instruction codes, preparation station, ordering policy,
  required choices per portion, stable `CODE = Libellé` variant options, and
  availability;
- local quick-note definitions using `CODE = Libellé | CONFLIT_1, CONFLIT_2`
  and allergen definitions using `CODE = Libellé`;
- truthful loading/service-unavailable, empty catalogue, empty category,
  dialog pending, validation error, duplicate-name conflict, stale/not-found
  conflict, success feedback, confirmation, disabled, and recovery states.

Improve scan speed and operational density without hiding essential actions.
The current full-page list is very long and the article form is a tall
single-column dialog; propose clearer grouping, hierarchy, sticky or contained
actions where appropriate, and responsive stacking while keeping every current
field and action reachable. Favor large touch targets, clear text-backed
statuses, visible selected/disabled/pending feedback, mouse/keyboard/touch
usability, visible focus, safe dialog scrolling, and no horizontal overflow.
Keep destructive-looking red treatment proportional: hiding a category or
making an article unavailable is reversible and requires confirmation, not a
physical delete.

Use YUTA’s existing visual language: Geist Sans with Inter and sans-serif
fallback; semantic canvas/surface/text/border/success/warning/danger tokens;
reusable card, badge, button, form, dialog, select, alert, and confirmation
patterns; and Lucide-style icons. Do not prescribe raw hex colors, copy a new
design system, introduce a new component library, or depend on hover-only
meaning. All user-facing copy must remain French.

The proposal must preserve these non-negotiable behaviors:

- only a validated active local `admin` or `manager` session can access or
  mutate the screen; the HttpOnly token stays server-side;
- catalogue operations remain local and follow
  `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`;
- there is no organization/establishment tenancy and no cloud synchronization;
- categories and articles are never physically deleted by this workflow;
  categories are hidden and articles are marked unavailable;
- current contract/service rules remain authoritative for unique names,
  instruction assignments/conflicts, stable option codes, required variant
  quantities, kitchen stations, ordering policy, prices, and validation;
- successful changes take effect on the next POS server render and keep the
  current catalogue/order revalidation behavior;
- the real integrated catalogue must never be replaced with fixtures.

Do not draw or imply image/media upload, ingredient inventory, stock counts,
cost or margin data, tax configuration, physical delete, drag-and-drop
reordering persistence, bulk actions, search/filter/category navigation,
import/export, scheduling, menu publication channels, combo editing, analytics,
audit history, new roles, cloud sync, new fields, new API/schema/contract
capabilities, or unrelated POS navigation. Those concepts are excluded unless
separately proposed and approved.

Treat generated images as composition studies, not factual data authority.
Preserve the real 12-category/53-row hierarchy, use no drag handles, do not
invent fields or behavior, and keep every current editor field and operational
state reachable. Runtime data, contracts, and repository-owned French copy
override all generated raster text.

Return design images and brief visual annotations only, not implementation
code. Label the output `DRAFT`. Review criteria are: all current capabilities
remain visible/reachable; hierarchy and density are materially clearer than the
baseline; the 53-row catalogue remains practical; the article editor remains
complete and scroll-safe; operational states are truthful; touch and keyboard
use are supported; and the proposal introduces no unsupported product concept.

## Handoff result

Approved visual-direction references:

- `references/design-proposal-01.png` — catalogue overview composition;
- `references/design-proposal-02.png` — article editor composition.

Product-owner approval was recorded on 2026-08-11. Proposal 01 owns the
catalogue overview direction; proposal 02 owns the article-editor direction.
The approval covers the dark shared header, no-sidebar shell, hierarchy,
density, disclosure, editor grouping, responsive behavior, action hierarchy,
and state treatment.

Documented non-authoritative raster deviations are the incorrect `13,60 €` Mix
LUNA price in proposal 01, inaccurate generated item descriptions in proposal
02, and internal `design-proposal-03/04` labels that differ from the stored
filenames. Phase 1 must use live catalogue data, current contracts, and
repository-owned French copy. The package is implementation-ready, but Phase 1
must not start without a separate explicit approval.
