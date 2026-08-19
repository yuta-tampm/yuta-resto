# POS Management Establishment — Design Handoff

Status: Ready for design generation after separate approval

Visibility: Engineering

## Phase 0 source

The completed inventory is in `README.md`. This is a `NEW_PAGE` integrated
local-POS discovery target. Protected invariants are the local runtime/session
boundary, no cloud authority/sync, immutable receipt payloads, truthful
unconfigured behavior, and site-agent ownership of persistence/rendering.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer              | Owner/source                                                       | Status   | Reuse exactly                                                        | May adapt                       | Excluded                        |
| ------------------ | ------------------------------------------------------------------ | -------- | -------------------------------------------------------------------- | ------------------------------- | ------------------------------- |
| YUTA global        | `@yuta/ui`, semantic tokens, shared frontend rules                 | APPROVED | typography, focus, components, semantic states, Lucide               | page density                    | raw colors/new UI system        |
| POS application    | POS app/product/UI rules                                           | APPROVED | French operational copy, full-width canvas, touch/keyboard behavior  | bounded form width              | cloud tenancy/marketing UI      |
| Management section | `ManagementHeader.tsx`, Management home/printing as-built evidence | APPROVED | dark header, local identity, user/role, POS return, account/sign-out | narrow label compression        | sidebar/drawer/bottom nav/tabs  |
| New page           | this Phase 0 pack                                                  | DRAFT    | one display-name task and truthful states                            | card composition/copy hierarchy | legal/fiscal/cloud/extra fields |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Real routes in the supplied context are `/`, `/management`,
`/management/users`, `/management/catalog`, `/management/combos`, and
`/management/printing`. `/management/establishment` is proposed by this pack.
`Rapports locaux` remains unavailable. Do not invent other navigation.

Curated references:

- `../pos-management-home/references/phase-05-as-built-1366x768.png`;
- `../pos-management-home/references/phase-05-as-built-390x844.png`;
- current printing page evidence for the in-content return link and focused settings treatment.

## Current baseline capture

Baseline status: `NOT_APPLICABLE`

There is no current route or screen to capture. On 2026-08-19, the containing
Management shell's existing 1366x768 and 390x844 as-built images were visually
inspected read-only. They show the approved header, full-width management
canvas, module cards, four real destinations, and unavailable reports state.
No runtime was started and no operational data or session was mutated.

## Design-generation prompt

Design prompt status: `READY`

```text
Use case: ui-mockup
Asset: high-fidelity discovery proposal for new local YUTA POS page `/management/establishment`
Output: one 1366 x 768 desktop screen plus one 390 x 844 narrow companion, no browser/device frame, no implementation code.

Context: This is a restaurant-local POS management screen in French. The route and backend do not exist yet. The proposal is discovery evidence only. Reuse the supplied approved dark POS Management header exactly in hierarchy: YUTA POS identity, “Gestion locale”, signed-in local user/role, “Retour au POS”, and account/sign-out. Under it retain an in-content “Retour à la gestion” link. Do not add a sidebar, drawer, bottom navigation, persistent tabs, Backoffice shell, notification area, or second account area.

Goal: Let an authorized local manager understand and edit one proposed local field, the restaurant display name, intended to be snapshotted onto newly created non-fiscal customer receipts after backend approval.

Composition: Use a concise PageHeader with eyebrow “Gestion locale”, title “Établissement”, and a local/non-fiscal explanation. Present one focused settings card, not a dashboard. Use label “Nom affiché du restaurant”, a single text input, helpful copy, and a direct “Enregistrer” action. Include a restrained note that renaming does not rewrite receipts already queued or printed. Show a configured default state in the main proposal without using a real restaurant name; use a clearly fictional placeholder such as “Le Jardin Démo”. Also provide small state callouts or a companion state sheet for loading, unconfigured/empty, editing, validation error, save pending, save success, stale conflict, site-agent/database unavailable, expired/forbidden session, and retry/recovery.

Truth constraints: The only proposed field is `displayName`. Do not add legal name, address, contacts, SIRET, SIREN, VAT, invoice, tax, fiscal receipt, cloud establishment profile, licensing, backup identity, printer settings, kitchen-ticket settings, POS-header settings, audit history, or additional modules. Do not imply that saving, persistence, receipt integration, audit, or role permissions are already implemented. Do not use YUTA, YuTa, or Luna as a configured restaurant value or fallback.

Behavior constraints: The local runtime boundary is POS -> site-agent -> db-pos -> local PostgreSQL. Browser code never owns persistence. A future unconfigured name omits the receipt name line. A future newly queued receipt snapshots the current name; retry/reprint keeps the old immutable payload after rename. Do not depict cloud sync or device configuration.

Visual system: operational, calm, compact, highly legible; use YUTA semantic roles, Geist Sans with Inter fallback, Lucide-style icons, current cards/forms/buttons, textual states, visible focus, and no raw copied colors. Preserve a full-width operational canvas but keep the one-field form readably bounded. At 390px use one column, no horizontal overflow, and 44px minimum touch controls.

Review criteria: shared-shell fidelity; one-task hierarchy; truthful proposed/unconfigured states; no invented navigation or fields; clear save, conflict, outage, and recovery communication; responsive touch-safe layout. This is a design proposal only and requires explicit review before Phase 1.
```

## Handoff result

No design was generated. Product owner must first approve Phase 1/design
generation and resolve or explicitly defer the decisions in `PRODUCT_SCOPE.md`.
