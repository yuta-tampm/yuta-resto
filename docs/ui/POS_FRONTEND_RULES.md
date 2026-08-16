# YUTA POS Frontend Rules

Status: Current

Visibility: Engineering

Owner: YUTA engineering and restaurant operations

Last updated: 2026-08-16

Application: `apps/yuta-pos`

## Purpose

These rules specialize `docs/ui/YUTA_FRONTEND_RULES.md` for the local
restaurant POS. They apply to order entry, service home, kitchen, payment,
local management, printing management, and other POS screens.

The POS is an operational application used during restaurant service. UI
refactors prioritize speed, clarity, touch usability, truthful local-runtime
state, and preservation of transactional behavior over marketing-style
composition.

## Required reading

Before POS UI work, read:

1. root `AGENTS.md`;
2. `docs/README.md` and `docs/CURRENT_STATE.md`;
3. `apps/yuta-pos/AGENTS.md`;
4. `docs/products/pos/README.md`;
5. `docs/products/pos/PRODUCT_SPEC.md`;
6. `docs/products/pos/OFFLINE_STRATEGY.md`;
7. `docs/products/pos/QA_CHECKLIST.md`;
8. relevant operator/deployment docs when the target touches them;
9. `docs/ui/README.md` and `docs/ui/YUTA_FRONTEND_RULES.md`;
10. the current page package when one exists;
11. current POS, site-agent, contract, core, db-pos, and tests relevant to the
    screen.

## Runtime boundary — non-negotiable

```text
apps/yuta-pos
    -> apps/site-agent
        -> packages/db-pos
            -> local PostgreSQL
```

The POS client does not own operational persistence.

- Never import `@yuta/db-cloud` or `@yuta/db-pos` into `apps/yuta-pos`.
- Never add cloud synchronization for orders, payments, kitchen state, print
  jobs, local staff, menu snapshots, or operational reports.
- Use current `@yuta/contracts/local-pos` transport contracts and the
  established POS server/client path.
- Do not move transaction logic into React components, browser state, or Server
  Actions when `site-agent` currently owns it.
- Do not expose database credentials, physical printer paths, or privileged
  local configuration to the browser.

## Existing-page default

POS routes should be presumed `EXISTING_PAGE` until Phase 0 proves otherwise.

Most POS UI work is an in-place operational refactor. A visual redesign must
not recreate the screen using fixture data and reconnect behavior later.

Before editing, identify the exact actions, endpoints, and contracts currently
used by the target and the tests that protect them.

## POS component placement

Apply the shared Next.js ownership convention without changing the local POS
runtime boundary:

- POS-wide shell and application components live in
  `src/components/<domain>/`;
- components shared by an operational route subtree live in the nearest
  `_components` folder, such as `src/app/orders/_components/`;
- components used by one POS route live in that route's `_components` folder;
- extracted route-local non-UI logic uses `_lib`, `_utils`, or another
  ownership-specific folder;
- do not create `src/app/components`;
- keep order, kitchen, payment, printing, and management business components
  inside `apps/yuta-pos` rather than promoting them to `@yuta/ui`.

Moving a component does not authorize changing its Server/Client boundary,
markup, actions, contracts, polling, offline behavior, or service ownership.

## Full-viewport POS layout

The installed POS is an operational workstation application. Its route canvas,
service header, health strip, subheader, management header, and route-level main
content span the available viewport width on desktop instead of sitting inside
a centered `max-width` website container.

- `PosPageShell` owns a full-width operational canvas by default.
- Management route headers and page-level content also span the viewport.
- Preserve route padding, responsive grids, internal scrolling, and touch
  targets when removing a shell constraint.
- Task-focused content may remain intentionally bounded when stretching would
  reduce usability. Examples include order-creation forms, login cards,
  dialogs, success cards, alerts, and readable text blocks.
- Do not interpret full viewport as permission to invoke the browser Fullscreen
  API, hide browser/device controls, or change kiosk/deployment behavior.
- Verify the shell at wide desktop, standard desktop, tablet, and narrow mobile
  widths, including document overflow and real-data density.

## Protected POS invariants

UI work must preserve every applicable current invariant, including:

- historical accuracy and no-hard-delete behavior;
- order/item mutation locks after payment or active split;
- pending/sent/preparing/ready lifecycle semantics;
- kitchen-send batch accuracy;
- allergy acknowledgement and kitchen-confirmation behavior;
- combo/pricing snapshots and service-owned calculations;
- UUIDv7 idempotency/replay behavior;
- payment and split-payment transaction semantics;
- durable print-job state and retry semantics;
- local session/role authorization for management screens;
- current service-day filtering and polling behavior;
- truthful offline/local-service failure handling.

If a design conflicts with one of these, preserve the invariant and document
the visual deviation.

## Local sessions and management

The POS is single-site local infrastructure, not cloud multi-tenancy. Do not
introduce cloud organization/establishment membership concepts into POS page
packs unless current architecture explicitly changes.

Management screens use the current local management session and role rules.
Preserve server-side/local-service authorization and the HttpOnly session flow.
Do not infer new roles or permissions from a mockup.

## Service-time header consistency

All non-management service-time routes that use `PosPageShell` share its
prominent desktop header by default and the same compact menu behavior below
`lg`. Route titles, status badges, and real workflow actions remain route-owned.
The shared service-time header does not render a leading back-arrow action. The
direct `Nouvelle commande` navigation action belongs only to POS Home `/`;
sibling service-time routes must not duplicate it.

Every sibling service-time route exposes the shared three-line navigation menu
with the real `Commandes` -> `/`, `Cuisine` -> `/kitchen`, and `Gestion` ->
`/management` destinations. Home may omit its own `Commandes` destination and
keeps `Cuisine`/`Gestion` in the same menu. Route-owned status and workflow
actions stay directly visible; they are not replaced by global navigation.
In the prominent desktop header, every direct action or status control uses the
same 48px height as the three-line menu trigger. The compact trigger remains a
44px touch target below `lg`.

The authenticated `ManagementHeader` and the management login surface remain
separate because they own local session, role, return-to-POS, and sign-out
behavior. Do not force those surfaces into `PosPageShell` merely for visual
uniformity.

## Local-service status

Preserve the compact POS local-service status behavior and its distinction
between local service, database, printer, and Internet conditions where the
current shell exposes them.

Do not replace truthful degraded states with a generic online/offline badge.
Local operation may remain available while Internet access is unavailable.

## Printing and device rules

Printing is device-coupled and site-agent-owned.

- Preserve durable print jobs, current queue state transitions, payload
  snapshots, copy/font/spacing snapshots, retry behavior, and batch semantics.
- Do not infer station routing or ticket classification from a visual
  reference.
- Do not expose or edit the physical printer device path from browser UI.
- Safe browser-editable print settings are limited to capabilities already
  supported by current contracts and `site-agent`.
- A redesigned printing screen must preserve current polling, focus, and
  visibility behavior unless an approved product change says otherwise.
- Do not claim physical-print success based only on browser state if the
  current workflow requires worker/device evidence.

## POS interaction model

All operator-facing UI copy is French; code and engineering docs remain
English.

Service-time screens should:

- keep primary actions direct and easy to reach;
- favor large touch targets and clear selected/disabled/pending states;
- avoid hiding core actions behind dense menus;
- make destructive or irreversible transitions explicit;
- maintain readable totals, quantities, station/status grouping, and error
  recovery;
- remain usable with mouse, keyboard, and touch when the current screen
  supports them.

Do not turn operational screens into marketing/dashboard compositions with
decorative content that reduces service density or action speed.

## POS QA viewport profile

Use real target hardware dimensions when known. If a page pack does not specify
hardware, use this default evidence matrix:

```text
1366 x 768  service landscape
1024 x 768  compact landscape/tablet
768 x 1024  portrait tablet
390 x 844   narrow fallback
```

These are QA fixtures, not a product promise of device support. The page
package may replace them with measured restaurant-device dimensions.

For touch-critical screens, QA must also check reachability, accidental double
activation, disabled/pending feedback, scroll containment, virtual-keyboard
impact where relevant, and no essential hover-only behavior.

## Verification commands

For POS UI changes, use existing repository commands as applicable:

```bash
pnpm docs:check
pnpm format:check
pnpm architecture:check
pnpm typecheck:pos
pnpm test:pos
pnpm build:pos
```

When the change touches or depends on local API, database, offline, printing,
or device behavior, also run the affected existing checks:

```bash
pnpm typecheck:site-agent
pnpm test:site-agent
pnpm typecheck:db-pos
pnpm test:db-pos
pnpm test:pos:offline
```

Run affected contract, core, and UI checks when those boundaries change. Do
not report a lint result; the current root scripts do not define lint.
