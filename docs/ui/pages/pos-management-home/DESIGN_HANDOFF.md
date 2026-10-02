# POS Management Home - Design Handoff

Status: Ready for design generation

Visibility: Engineering

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer              | Owner/source                                                               | Status   | Reuse exactly                                                              | May adapt                               | Excluded                                            |
| ------------------ | -------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------- |
| YUTA global        | `@yuta/ui`, semantic tokens, shared frontend rules                         | APPROVED | typography, focus, accessible primitives, semantic states, Lucide          | density and responsive composition      | raw colors, another UI/icon system                  |
| POS application    | POS `AGENTS.md`, product and UI rules                                      | APPROVED | French operational copy, local-session model, touch/keyboard behavior      | compact spacing by viewport             | cloud tenancy, Backoffice shell, marketing UI       |
| Management section | `ManagementHeader.tsx`; approved printing, catalog, combos, users evidence | APPROVED | dark header, YUTA POS identity, user/role, return-to-POS, account/sign-out | narrow label compression                | sidebar, drawer, bottom nav, persistent module tabs |
| Management hub     | current authenticated captures and route behavior                          | REVIEWED | four real destinations, unavailable reports, current meanings              | card density, grouping, responsive grid | invented routes, fields, metrics, actions           |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`

Real destinations are `/`, `/management`, `/management/users`,
`/management/catalog`, `/management/combos`, and `/management/printing`.
`Rapports locaux` is unavailable and must not be drawn as a working route.

## Current authenticated baseline

Baseline status: `CAPTURED`

Captured 2026-08-13 from `http://localhost:3003/management` at 1366x768 and
390x844. Local PostgreSQL, site-agent, and the POS development server were
healthy. An active admin management session rendered `YuTa Admin ·
Administrateur`. No form was submitted and no data changed.

Files:

- `references/current-baseline-1366x768.png`;
- `references/current-baseline-390x844.png`.

## Curated design-tool bundle

1. The two current authenticated hub captures in this package.
2. Approved desktop and narrow shared-shell captures from printing.
3. Current as-built catalog, combos, and users captures for sibling density,
   responsive rhythm, state treatment, and action placement.
4. This shell decision, exact route inventory, product scope, protected
   invariants, required states, and explicit exclusions.

## Ready-to-use design-generation prompt

Design prompt status: `READY`

```text
Use case: ui-mockup
Asset type: high-fidelity UI renewal proposal for the existing local restaurant POS screen `/management`
Primary request: Redesign the real YUTA POS local management home for faster module recognition and safe touch use while preserving every implemented route, availability state, and local-session behavior.
Input images: Image 1 is the current authenticated management-home baseline at 1366 x 768; Image 2 is the current 390 x 844 baseline; Image 3 is the approved desktop shared POS Management shell from printing; Image 4 is the approved narrow shared shell; Images 5-7 are current catalog, combos, and users as-built references. Treat all images as visual references, not edit targets.
Scene/backdrop: Produce one 1366 x 768 operational desktop screen and one 390 x 844 narrow companion, with no browser or device frame.
Style/medium: shippable French restaurant operations UI; compact, restrained, calm, highly legible; not a marketing dashboard.
Composition/framing: Reuse the approved compact dark POS Management header exactly in hierarchy: YUTA POS identity, "Gestion locale", signed-in user and role, "Retour au POS", and account/sign-out. Below it present a concise management-home heading and a scannable module grid. Keep four available modules directly actionable: "Équipe POS", "Menu et catégories", "Formules et combos", and "File d’impression". Keep "Rapports locaux" clearly unavailable with the text status "Prochaine étape" and no working action. Use a one-column narrow composition without horizontal overflow.
Text (verbatim): "Gestion locale"; "Connecté en tant que YuTa Admin · Administrateur"; "Retour au POS"; "Équipe POS"; "Utilisateurs, rôles, PIN et activation."; "Menu et catégories"; "Articles, prix, postes cuisine et disponibilité."; "Formules et combos"; "Règles, groupes, suppléments et priorités."; "Rapports locaux"; "Chiffre payé, commandes ouvertes et activité du jour."; "File d’impression"; "Tickets en attente, imprimés, échoués et relance."; "Disponible"; "Prochaine étape"; "Ouvrir".
Behavioral constraints: Only an active local admin or manager may access this screen. Preserve exactly four real destinations: `/management/users`, `/management/catalog`, `/management/combos`, and `/management/printing`. The reports card has no route. Sign-out and return-to-POS remain in the approved shared header. All authentication remains server-side through the HttpOnly local management session and site-agent; there is no cloud tenancy or cloud data.
Required state studies: authenticated populated desktop, authenticated populated narrow layout, visible keyboard focus, unavailable reports treatment, and expired-session redirect as an annotation rather than an invented inline page state.
Constraints: Use YUTA semantic surfaces, text, borders, status treatments, focus, Geist Sans, @yuta/ui-style primitives, and Lucide-style icons. Maintain mouse, keyboard, and touch usability, accessible names, clear state text, and reachable touch targets.
Avoid: no sidebar, drawer, bottom navigation, persistent module tabs, tenant switcher, cloud Backoffice, working reports, metrics, charts, recent activity, notifications, search, favorites, new routes, new modules, module permissions, new fields, device controls, raw hex colors, gradients, glassmorphism, decorative illustration, watermark, or unrelated text.
Return design proposals only, not implementation code. Keep runtime copy, routes, authorization, data ownership, contracts, and persistence repository-authoritative.
```

Generated output remains `DRAFT` until the product owner reviews it. Phase 1
must not start from this prompt alone.

## Generated-reference handoff

Reference status: `APPROVED`

Generated on 2026-08-13 with the built-in ImageGen workflow and the curated
Phase 0 reference bundle:

- `references/design-proposal-01-desktop.png`: desktop operational hub;
- `references/design-proposal-02-narrow.png`: narrow responsive companion.

Review findings:

1. Both proposals reuse the approved management header hierarchy and introduce
   no sidebar, drawer, bottom navigation, module tabs, cloud navigation, route,
   permission, field, metric, chart, notification, or device control.
2. They preserve the four real destinations and present `Rapports locaux` as
   unavailable without an `Ouvrir` action.
3. The proposed card hierarchy is more scannable and makes the unavailable
   state more distinct while keeping the current module order and meanings.
4. The generated sentence `Accédez aux paramètres et contenus essentiels de
votre POS local.` is proposed orientation copy only. It is not current
   repository copy and requires product-owner approval before implementation.
5. Generated logo geometry, colors, typography metrics, icons, shadows, focus
   treatment, and exact output pixel dimensions are illustrative. Runtime must
   use `YutaBrandMark`, semantic tokens, Lucide, and the required viewport QA.
6. The narrow raster is a full-page responsive composition, not authenticated
   browser evidence and not proof of 390x844 containment. Phase 1 and Phase 5
   must verify the real viewport independently.

Approval may cover visual hierarchy, card treatment, responsive direction, and
the proposed orientation copy. It does not authorize runtime behavior, routes,
reports, data, contracts, permissions, persistence, or shared-shell changes.

## Review gate

The product owner approved the draft visual direction and authorized Phase 1.
The selected direction includes the proposed orientation copy, approved shared
management shell, desktop three-column module grid, narrow single-column
composition, and distinct unavailable reports treatment.

## Phase 1 as-built evidence

Captured on 2026-08-13 from the authenticated production build with the active
`YuTa Admin` local management session:

- `references/phase-01-implementation-1366x768.png`;
- `references/phase-01-implementation-390x844.png`.

The production capture preserves all four real links and renders no link for
`Rapports locaux`. At 1366x768 the complete hub fits the viewport. At 390x844
the page uses natural vertical scrolling. Both viewports report document
`scrollWidth` equal to `clientWidth`, so there is no horizontal overflow. No
mutation was submitted.

## Phase 5 as-built evidence

Final clean-origin authenticated production-build captures are stored at
1366x768, 1024x768, 768x1024, and 390x844. The visual review confirmed the
approved shared shell, orientation header, desktop/tablet grid transitions,
narrow single-column flow, text-backed availability, distinct reports state,
and repository-authoritative French copy.

All viewports have zero horizontal document overflow and all module actions are
44 pixels high. The existing shared-shell desktop 40-pixel header controls and
narrow 40-pixel brand/home link remain documented exceptions outside
route-local ownership. Clean-origin browser warning/error collection was empty.
