# POS Order Detail - UI Specification

Status: Receipt-printing Phase 5 interaction and responsive QA completed

Visibility: Engineering

## Authority and target

`apps/yuta-pos`, real route `/orders/[orderId]`, `EXISTING_PAGE`, integrated,
`EXISTING_CAPABILITY_RENEWAL`. Repository behavior overrides future visuals.

## Shared UI context

Use `REUSE_APPROVED_SHARED_SHELL`: full-width prominent `PosPageShell`/
`PosHeader`, logo to `/`, three-line Commandes/Cuisine/Gestion menu, and shared
health strip. Direct `Nouvelle commande` remains Home-only. Management/login
and Backoffice shells are excluded.

## Current baseline

Summary context precedes Articles, totals, Historique, Informations, and a
full-width destructive action. Desktop uses four content columns; narrow stacks
content in an internal scroller and duplicates Send/Pay below the summary while
also exposing them in the compact header menu. Final states disable actions. No
horizontal document overflow was measured at 1280x720 or 390x844.

## Visual hierarchy

1. Shared header and truthful health strip.
2. Order identity, real status, time/type, and allergy attention.
3. Current primary actions: kitchen send and payment; conditional item entry is
   secondary.
4. Active line items and service-owned totals.
5. Operational progression and supported note/type/table context.
6. Eligible cancellation, visually separated as destructive.

Do not promote placeholder staff/printer text or heuristic history into trusted
identity, device, or audit facts.

Within the totals card, `Remise` is a read-only disclosure. Its default
collapsed row shows the aggregate discount and a clear collapsed indicator.
The expanded state reveals the service-provided discount entries before the
unchanged total. It is not a discount editor or catalog-management surface.

## Content and copy

Use concise French service-time copy and existing domain vocabulary. Accents/
grammar may be corrected as presentation only. Remove or defer `Creee par
Utilisateur` and `Imprimante cuisine: Cuisine` unless real values are approved.

## Service-time / interaction density

Optimize scanning and touch reachability without becoming a dashboard. Preserve
high-frequency actions, destructive separation, compact item detail, and clear
allergy/status information.

The approved summary/action design groups order identity, four operational
facts, and the three actions in one overview. Action color communicates state:
neutral gray means completed or unavailable, solid green is the current primary
action, and pale green identifies an available secondary action. Kitchen send
uses the completed label `Envoyé en cuisine` only when a prior send is evidenced
and no pending item remains.

## Responsive behavior

Design/verify 1366x768, 1024x768, 768x1024, and 390x844. Preserve full-screen
shell and contained vertical scrolling. No horizontal overflow, clipped totals,
or hover-only essentials. Consolidating duplicate narrow actions requires
presentation approval and must preserve their business conditions.

## Accessibility

Visible focus; semantic controls; accessible icon labels; text-backed status;
keyboard-operable menu/dialogs; managed dialog focus; disabled/pending feedback;
and at least 44px service-critical touch targets. The discount disclosure uses
button semantics, `aria-expanded`, keyboard activation, and a visible expanded/
collapsed indicator. Any new destructive confirmation behavior requires
approval.

## Visual acceptance

The three responsive `v2` proposals and focused discount-disclosure study are
approved for Phase 1. Phase 0 images remain evidence only. Review confirms shell
fidelity, real action conditions, readable density, responsive containment,
and zero invented capability against the as-built browser evidence.

## Approved receipt design direction

The containing page baseline has no receipt action. Design generation should
study a page-specific `Imprimer le reçu` entry inside the existing three-line
menu. Place it before and visually separate from Commandes, Cuisine, and
Gestion. It is an action for this order, not navigation and not a new global
menu entry. Keep Send, Pay, and Add in their current primary action regions.

On compact layouts the same three-line trigger already combines page actions
and secondary content. Keep one unambiguous receipt entry and do not duplicate
it in the body. For a paid `single` order it can act directly after a clear
confirmation/status step. For split modes it may open a route-owned chooser
containing only paid checks; unpaid checks are unavailable and equal-split
receipts must not invent item allocations.

The design must cover these distinct text-backed states:

- unavailable before the approved paid target condition;
- available to request printing;
- submitting/idempotent replay protection;
- accepted into the durable queue;
- printer not configured or worker disabled;
- job failed with a recovery path;
- physically printed only when worker/job evidence confirms it;
- explicit reprint from an immutable snapshot if that access is approved.

`Ajouté à la file d’impression` is not equivalent to `Imprimé`. Printer-health
status is not job status. Color may reinforce state but cannot carry meaning
alone. The action remains at least 44px, keyboard/touch operable, and reachable
at 1366x768, 1024x768, 768x1024, and 390x844 without horizontal overflow.

The action produces only a non-fiscal paid `REÇU DE PAIEMENT`, one copy on the existing
local printer. No merchant legal identity, VAT/tax fields, invoice numbering,
printer route/settings controls, or automatic post-payment print action may be
introduced.

## Previous renewal out of scope

Data-access/backend changes, shell redesign, management/login, fixtures,
customer/provider/fiscal features, new states/permissions, cloud/offline/
realtime capability, printer controls, API/schema/contracts, and
presentation-owned calculations/transitions.

The visual direction and Phase 2 boundary were followed by explicit Phase 3
approval. Runtime contract/API, worker, and route-owned UI support are now
implemented; browser and physical-device evidence remain separately gated.

## Phase 2 component ownership implemented in Phase 3

### Application-wide shared shell

- `PosPageShell` remains a Server Component and has only an optional additive
  `pageMenuActions?: ReactNode` slot.
- Existing `actions` remain directly visible on prominent desktop and continue
  to appear in the compact combined menu. Existing `secondaryActions` retains
  its navigation ownership and default `PosServiceNavigation`; order detail
  must not copy those links.
- `PosHeader` remains a Server Component. It composes direct actions and passes
  menu groups into a small `PosHeaderMenu` Client Component.
- `PosHeaderMenu` owns disclosure state, Escape/outside dismissal, focus return,
  controlled close after a page action, group separators, and the current 48px/
  44px trigger geometry. It owns no receipt or navigation business logic.
- Desktop menu order is page action, separator, shared navigation. Compact menu
  order is page action, existing workflow actions, separator, shared navigation.
  When `pageMenuActions` is absent, existing consumers remain visually and
  behaviorally unchanged.

This is a backward-compatible application component extension, not a shared
`@yuta/ui` primitive and not a receipt-specific boolean on the shell.

### Route-local receipt ownership

- `_lib/order-receipt-presentation.ts` owns pure, deterministic mapping from
  validated order/check/payment/job/printer data to serializable presentation
  targets and labels. It never decides service eligibility authoritatively.
- `_components/OrderReceiptMenuAction.tsx` is the smallest Client Component. It
  owns chooser/confirmation visibility, stable operation ID, submit pending,
  selected target, selected job tracking, retry/reprint intent, and accessible
  focus/status announcements.
- A route-local receipt Server Action parses only operation ID, order ID,
  target kind/ID, and command intent. It calls the server-only POS adapter and
  returns a typed safe result; it owns no calculations, snapshots, printer
  route, or queue transitions.
- `page.tsx` remains the Server Component loader and composer. It supplies only
  validated serializable presentation data and places the receipt flow in
  `pageMenuActions`.

No component is promoted to `@yuta/ui`, no generic `src/app/components` folder
is created, and management printing components are not reused because their
authorization and operator purpose differ.

## Phase 2 interaction model

- Unpaid/cancelled/no-paid-target: menu row remains text-backed unavailable with
  `Le paiement doit être terminé`; it performs no request.
- Paid `single`: selecting the row closes the header menu, opens one-copy
  confirmation, and submits an order target.
- Split: selecting the row closes the menu and opens the target chooser. All
  non-void checks may appear for context; only `paid` checks expose print.
  Pending checks are disabled with `Paiement en attente`.
- Submit: generate one UUIDv7 operation ID per deliberate request and retain it
  across transport retries. Disable repeat activation while pending.
- Accepted: announce `Ajouté à la file d’impression`; show printer-unavailable
  warning independently of job status.
- Tracking: poll only the selected job while the status surface is open,
  document visible, and status is `pending`/`printing`; refresh immediately on
  focus/visibility return and stop on close, unmount, `printed`, or `failed`.
- Failure: transport/validation/conflict remains distinct from a persisted
  failed print job. Conflict offers refresh; failed job offers `Réessayer` for
  the immutable snapshot.
- Printed: show `Imprimé` only with terminal job evidence and printed time;
  `Réimprimer le reçu` creates a new deliberate operation against the immutable
  original snapshot.

Dialog/sheet behavior uses one semantic dialog model with managed focus,
Escape close when not submitting, focus return to the invoking menu trigger,
`aria-live` status feedback, and no color-only meaning. Responsive presentation
may use a centered panel on landscape and bottom sheet on narrow screens without
changing the interaction state machine.
