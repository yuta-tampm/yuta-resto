# POS Order Items - Design Handoff

Status: Approved for Phase 1

Visibility: Engineering

## Phase 0 source

The complete inventory is in `README.md`. This is an existing integrated local
POS page using `EXISTING_CAPABILITY_RENEWAL`; real data and behavior must never
be replaced by fixtures.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer           | Owner/source                                                 | Reference status | Reuse exactly                                                                                                   | May adapt                           | Excluded                                        | Decision/blocker |
| --------------- | ------------------------------------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------- | ---------------- |
| YUTA global     | `@yuta/ui`, semantic tokens, shared rules                    | APPROVED         | primitives, focus, labels, Lucide, semantic states                                                              | route density/composition           | raw colors, another framework, Backoffice image | none             |
| POS application | POS rules, layout, `PosPageShell`, `PosHeader`, health strip | APPROVED         | prominent desktop header, compact behavior below `lg`, logo/home, status semantics, French operational patterns | existing responsive action behavior | management shell, cloud tenancy, marketing UI   | none             |
| Order flow      | `/pos`, detail, items, kitchen, payment                      | APPROVED         | real routes, direct service actions, order/status vocabulary                                                    | route-local grouping                | table map, new route/capability                 | none             |
| Target page     | current route and Phase 0 baseline                           | APPROVED         | real loader/actions/content hierarchy                                                                           | approved visual hierarchy           | fixtures, invented fields/actions               | none             |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Keep the prominent desktop shared header, logo/home link to `/`, payment link to
`/orders/<id>/payment`, and connectivity strip; the shared header has no leading
back-arrow action. The shared three-line menu exposes `Commandes` -> `/`,
`Cuisine` -> `/kitchen`, and `Gestion` -> `/management`; below `lg`, keep the
shared compact behavior. Do not add the Home-only direct `Nouvelle commande`
action.
Keep the current desktop category/menu/order composition and current narrow
mobile order dialog. There is no sidebar, bottom navigation, tenant/account
area, or service-time login. `/kitchen` is adjacent but not a new header link.
`/management` and its authenticated shell are excluded.

Curated bundle:

1. `references/phase-0-current-1366x768.png`.
2. Current target files and shared POS shell files listed in `README.md`.
3. Current `/pos`, order detail, kitchen, and payment implementations as
   interaction/density context.
4. This package's scope and data specifications.
5. POS viewport matrix: 1366x768, 1024x768, 768x1024, 390x844.

## Current baseline capture

Baseline status: `CAPTURED`

- File: `references/phase-0-current-1366x768.png`.
- Route/state: `/orders/019fe56c-bf4b-771b-a1ce-c217aeff6f24/items`, real
  persisted `draft`, `single`, three pending items, no paid payment.
- Viewport/date: 1366x768, 2026-08-14, Europe/Paris.
- Runtime: clean worktree dev origin `http://localhost:3013`, site-agent on
  3004, real local PostgreSQL; service/database available, Internet probe
  unconfigured, printer unconfigured.
- Session: no authenticated service-time session exists. Persisted creator was
  an active local staff user; no management PIN/bearer was used.
- Safety: no control was submitted and no item, status, payment, or kitchen
  command changed. Rendering the real route necessarily called the current
  payment-summary GET, whose combo optimization advanced `orders.updatedAt`.
  This existing loader side effect is recorded rather than hidden; no fixture
  or avoidable operator mutation was used.
- Capture recovery: the reused 3003 origin initially exposed stale Turbopack
  chunks, so it was not used as evidence. A clean isolated origin was used.
- Not visible: loader/error, empty order/search, locked paid/cancelled/split,
  variant/allergy errors, pending/success, send conflict, degraded service, and
  narrow states. These are required design studies, not implemented evidence.

## Design-generation prompt

Design prompt status: `READY`

### Ready-to-use prompt

```text
Use case: ui-mockup
Asset type: high-fidelity UI renewal proposal for the existing integrated local restaurant POS page `/orders/[orderId]/items`
Primary request: Renew the real YUTA order-item entry workspace for faster touch-first restaurant service while preserving its exact current shell, real routes, data hierarchy, actions, validation, transactions, kitchen/payment boundaries, and local-only runtime.
Input image: `phase-0-current-1366x768.png` is the current real 1366x768 operational baseline. It is visual evidence, not an edit target or behavioral authority. No Backoffice or management-shell image applies.
Operator context: French-speaking restaurant service staff rapidly adding catalog items, checking the current order, recording instructions/allergies, and sending a pending batch to production.
Shell mode: `REUSE_APPROVED_SHARED_SHELL`. Use the shared prominent desktop POS header with logo/home -> `/`, real order table label and number, payment -> `/orders/<id>/payment`, and truthful local-service/printer strip. Do not render a leading back-arrow action. The three-line menu exposes `Commandes` -> `/`, `Cuisine` -> `/kitchen`, and `Gestion` -> `/management`; below `lg`, retain the shared compact menu behavior. Do not add the Home-only direct `Nouvelle commande` action, replace the shell, or add a sidebar, bottom navigation, tenant/account area, login, notifications, or dead routes.
Desktop content hierarchy: active category navigation; immediate catalog search; dense available-item grid with name, price, and selected quantity; current-order summary with quantity controls, item status, instructions/allergy attention, subtotal/discount/total, one direct `Envoyer en cuisine` action, and `Voir details` secondary action.
Narrow behavior: retain the current horizontal category navigation, searchable item grid, and `Voir commande` mobile order dialog without losing category, search, or grid position. Keep send action and totals reachable. No essential hover-only behavior or document-level horizontal overflow.
Real capabilities only: category selection; client-side search; add available item; merge or separate portions according to service-owned ordering policy; edit/remove pending items only when order/payment locks allow; edit note, quick instructions, exact required variants, and structured allergy; review service-owned totals; navigate to detail/payment; confirm allergies and send the exact pending batch with UUIDv7 replay and durable print-job creation.
Required state studies: loading/initialization; real empty order; empty search; catalog/order/site-agent/database load failure with retry; Internet unavailable while local service remains usable; paid, cancelled, split, or already-paid locked page; item mutation pending and failure/conflict; unavailable menu item; incomplete required variants; allergy validation and send confirmation; no pending items; kitchen-send pending, idempotency conflict, persisted success, and cautious recovery; printer unavailable without claiming the kitchen transaction or physical print failed.
Protected invariants: `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`; no cloud sync/tenancy; staff selection is attribution, not authentication; kitchen send requires active selected staff; historical menu/price/station snapshots; no hard delete; pending-only free edits; locks after payment or active split; service-owned merge/separate ordering policy, totals, combo/payment calculations, instruction conflicts, variants, allergy acknowledgement and kitchen confirmation; UUIDv7 idempotency; exact pending-batch kitchen send and durable print jobs; browser receives no DB or device secrets; physical print success is not browser success; no fixtures.
Visual constraints: shippable French operational UI, `@yuta/ui`, semantic token roles, current POS typography, Lucide icons, restrained high-contrast density, text-backed statuses, visible focus, keyboard and touch operation, 44px service-critical targets, managed dialog focus, no raw color values, no new framework, no decorative marketing/dashboard composition.
Explicit exclusions: no table map/entity, customer/reservation/loyalty/provider fields, catalog photo upload/storage, VAT/fiscal receipt, new discount/payment/kitchen state, auto-send, hard delete, cloud data, offline mutation queue, realtime, printer routing/settings/device path, management authorization, new roles/permissions, new route/API/contract/schema/migration, presentation-owned pricing/combo logic, invented navigation/copy, watermark, glassmorphism, gradients, charts, or analytics.
Output: Produce one realistic 1366x768 desktop renewal and one 390x844 responsive companion, plus compact annotated studies for locked, validation/allergy, local-service failure, and kitchen-send pending/failure states. Clearly mark them DRAFT. Review criteria: shell fidelity, real route/action fidelity, faster scan/action reachability, truthful states, responsive scroll containment, accessibility, and zero invented capability.
```

## Handoff result

Phase 0 was approved by the product owner on 2026-08-14. Design generation is
authorized. ImageGen produced desktop and narrow proposals. Repository review
rejected the first drafts because they invented a catalog filter button and
per-item overflow menus without current actions or contracts.

Targeted revisions removed only those unsupported controls:

- `references/design-proposal-01-desktop-v2.png` - corrected desktop workspace
  with four separate operational state studies.
- `references/design-proposal-02-narrow-v2.png` - corrected narrow catalog,
  current-order dialog, and recovery/attention studies.

The product owner approved both corrected outputs on 2026-08-15 for hierarchy,
density, spacing, and responsive direction. Generated text rendering and pixels
remain directional and do not override repository copy, semantic tokens, route
behavior, contracts, or protected invariants. Phase 1 implementation is
authorized; Phase 2 is not authorized.

The product owner then requested a dedicated screen after successful kitchen
send, with a return-to-main action and a create-another-order action. Repository
route resolution maps these to `/` and `/pos`. ImageGen produced
`references/design-proposal-03-send-success.png`, showing desktop and narrow
states with exactly those two actions. The product owner approved this visual
direction on 2026-08-15 for the later interaction phase. The success state is
authorized only after trusted
site-agent/Server Action success; it does not authorize a new route, contract,
schema field, payment action, or physical-print claim. On 2026-08-15, the
product owner additionally approved a five-second countdown followed by
automatic navigation to the existing home route `/`.
