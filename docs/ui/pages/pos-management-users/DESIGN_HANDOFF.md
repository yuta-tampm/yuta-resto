# POS management users - Design Handoff

Status: As-built verified

Visibility: Engineering

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer              | Owner/source                                                        | Status   | Reuse exactly                                                                                | May adapt                                                      | Excluded                                            |
| ------------------ | ------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| YUTA global        | `@yuta/ui`, semantic tokens, shared frontend rules                  | APPROVED | typography, focus, accessible primitives, semantic states, Lucide icons                      | density and responsive composition                             | raw colors, another UI/icon system                  |
| POS application    | POS `AGENTS.md`, product and UI rules                               | APPROVED | French operational copy, local-session model, touch/keyboard behavior                        | compact spacing by viewport                                    | cloud tenancy, Backoffice shell, marketing UI       |
| Management section | `ManagementHeader.tsx`; approved printing, catalog, combos evidence | APPROVED | dark header, YUTA POS identity, `Gestion locale`, user/role, return-to-POS, account/sign-out | label compression at narrow widths                             | sidebar, drawer, bottom nav, persistent module tabs |
| Users page         | current captures and repository behavior                            | REVIEWED | real fields, roles, actions, permission limits, states                                       | list density, responsive row/card composition, dialog grouping | invented fields, roles, routes, HR/cloud features   |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`

Real destinations are `/`, `/management`, `/management/users`,
`/management/catalog`, `/management/combos`, and `/management/printing`.
`Rapports locaux` is unavailable and must not be drawn as a working route.
There is no sidebar or shared module navigation on child pages.

## Current authenticated baseline

Baseline status: `CAPTURED`

Captured 2026-08-13 at 1366 x 768, DPR 1, from
`http://localhost:3003/management/users`. Local PostgreSQL, site-agent, and the
POS development server were healthy. An existing valid active admin management
session rendered the protected route directly. The populated seed state showed
`YuTa Admin`, `YuTa Kitchen`, and `YuTa Staff`, all active. The admin edit dialog
was opened and cancelled. No form was submitted and no data changed.

Files:

- `references/current-baseline-1366x768.png`;
- `references/current-baseline-edit-user-dialog-1366x768.png`.

## Curated design-tool bundle

1. The two current authenticated users captures in this package.
2. Approved desktop and narrow POS Management shell captures from
   `../pos-management-printing/references/phase-05-as-built-1366x768.png` and
   `phase-05-as-built-390x844.png`.
3. Catalog and combos as-built captures for current sibling-page density and
   responsive composition.
4. This shell decision, real-route inventory, field mapping, permission rules,
   protected invariants, required states, and exclusions.

## Ready-to-use design-generation prompt

Design prompt status: `READY`

```text
Use case: ui-mockup
Asset type: high-fidelity UI renewal proposal for the existing local restaurant POS screen `/management/users`
Primary request: Redesign the real YUTA POS local user-management screen for faster scanning, safer identity maintenance, and touch-friendly use while preserving every implemented capability and authorization rule.
Input images: Image 1 is the current authenticated users-page baseline; Image 2 is the current edit-user dialog; Image 3 is the approved desktop shared POS Management shell; Image 4 is the approved narrow shared shell. Treat them as visual references, not edit targets.
Scene/backdrop: Produce a 1366 x 768 operational desktop screen plus a 390 x 844 narrow companion, with no device frame.
Style/medium: shippable French restaurant operations UI; compact, restrained, calm, highly legible; not a marketing dashboard.
Composition/framing: Reuse the approved compact dark POS Management header exactly in hierarchy: YUTA POS identity, "Gestion locale", signed-in user and role, "Retour au POS", and account/sign-out. Below it show an in-content "Retour à la gestion" link, the title "Équipe POS", the existing description, and the primary action "Ajouter un utilisateur". Present the real user collection with name, optional email, role, active state, and only allowed edit, PIN-reset, activate/deactivate actions. Use a desktop table or equally scannable structure and a stacked narrow composition without horizontal overflow.
Text (verbatim): "Équipe POS"; "Gérez les utilisateurs, les rôles, les PIN et l’accès au terminal."; "Ajouter un utilisateur"; "Utilisateur"; "Rôle"; "État"; "Actions"; "Administrateur"; "Manager"; "Service"; "Cuisine"; "Actif"; "Inactif"; "Modifier"; "Changer le PIN"; "Désactiver"; "Activer"; "Annuler"; "Enregistrer".
Dialog requirements: Show a clear create or edit companion using only name, optional local email, role, active state where applicable, and PIN only on create/reset. PIN is 4-8 digits, remains secret, and is never displayed. Dialogs are scroll-safe with visible footer actions, initial focus, focus containment, Escape dismissal, pending feedback, and inline error/recovery.
Behavioral constraints: Only an active local admin or manager session may access the screen. Admins manage every role; managers manage only Service and Cuisine. The last active admin cannot be disabled or demoted. Role, active-state, and PIN changes invalidate existing sessions. Users are deactivated, never deleted. Email is optional and unique. All writes remain site-agent-owned and local db-pos persisted; credentials stay server-side; no cloud synchronization or fixture replacement.
Required state studies: populated, empty, site-agent unavailable with recovery, submit pending, invalid input, duplicate email, forbidden role, last-active-admin conflict, stale user, success, and expired session. Use text-backed status and clear disabled/pending feedback.
Constraints: Use YUTA semantic surfaces, text, borders, states, focus, Geist Sans, @yuta/ui-style primitives, and Lucide-style icons. Maintain mouse, keyboard, and touch usability, accessible icon names, visible focus, and reachable touch targets.
Avoid: no sidebar, drawer, bottom navigation, persistent module tabs, tenant switcher, cloud Backoffice, invitations, employee documents, payroll, scheduling, analytics, audit history, last-login field, granular permissions, search/filter, bulk edit, user deletion, PIN reveal, biometric login, new roles, new fields, new routes, raw hex colors, gradients, glassmorphism, decorative illustration, watermark, or unrelated text.
Return design proposals only, not implementation code. Keep runtime copy, permissions, data, contracts, and persistence repository-authoritative.
```

Generated output remains `DRAFT` until the product owner reviews it. Phase 1
must not start from this prompt alone.

## Generated-reference handoff

Reference status: `APPROVED`

Generated on 2026-08-13 with the built-in ImageGen path and the curated local
reference bundle. The project-bound files are:

- `references/design-proposal-01-desktop.png`: populated desktop overview;
- `references/design-proposal-02-edit-user.png`: edit-admin dialog with
  last-active-admin warning;
- `references/design-proposal-03-narrow.png`: stacked narrow composition.

Review findings:

1. The proposals reuse the approved shared management header and add no
   sidebar, module navigation, cloud capability, HR feature, role, field, or
   route.
2. They retain the three real seed identities, roles, active states, and direct
   edit, PIN-reset, and activation actions.
3. The dialog correctly excludes PIN editing and includes the current
   session-invalidation and last-active-admin constraints.
4. The overview rasters still render the last-admin deactivation affordance as
   enabled-looking. This is non-authoritative: implementation must preserve
   service enforcement and, if Phase 1 approves proactive disabling, derive it
   only from the real loaded user set while retaining server validation.
5. Generated logo geometry, colors, typography metrics, icons, focus treatment,
   and output pixel dimensions are illustrative. Implementation uses
   `YutaBrandMark`, semantic tokens, Lucide, and the real viewport matrix.
6. The narrow informational note proposes explanatory copy and placement, not
   a new domain capability. Final copy and whether it is persistent or
   contextual require product-owner selection during this review.

Approval of these references may govern visual hierarchy and responsive
composition only. It does not approve any database, contract, permission,
session, service, or runtime change.

## Review gate

The product owner approved the visual direction and explicitly authorized
Phase 1 on 2026-08-13. The approved implementation decisions were:

1. reuse the approved shared POS Management shell;
2. retain the desktop table and use stacked cards at narrow widths;
3. derive last-active-admin presentation from the real loaded users;
4. disable the protected destructive/role/status choices proactively while
   retaining site-agent enforcement;
5. show last-admin explanation contextually rather than as a persistent page
   banner.

## Phase 1 as-built evidence

Captured from the authenticated production build on 2026-08-13 with the real
local seed data and no submitted mutation:

- `references/phase-01-implementation-1366x768.png`;
- `references/phase-01-edit-admin-1366x768.png`;
- `references/phase-01-implementation-390x844.png`.

The browser verified the disabled last-admin deactivation action, disabled
Manager/Service/Cuisine role options, disabled Inactif status, contextual
warning, and zero horizontal document overflow at 1366x768, 1024x768,
768x1024, and 390x844. Console warning/error collection was empty.

## Phase 3 interaction evidence

Authenticated production-build checks on 2026-08-13 verified associated field
labels, initial focus, Escape dismissal with trigger focus return, preserved PIN
values after server validation, visible dismissible success feedback after an
unchanged-user save, and redirect to management login when the session expires
during an open editor. At 390x844, reset-PIN and activation dialogs had zero
document overflow and all footer/close controls measured at least 44 CSS
pixels. Browser warning/error collection was empty. Phase 3 introduced no new
visual direction, so no additional reference image is authoritative.

## Phase 5 as-built evidence

Final authenticated production-build captures on 2026-08-13 are stored in
`references/` for 1366x768, 1024x768, 768x1024, and 390x844, plus the protected
narrow admin editor, persisted-success confirmation, and preserved validation
state. The visual review confirmed the approved shared shell, desktop/tablet
table density, deliberate narrow cards, contextual last-admin treatment,
French operational copy, semantic states, and unchanged real seed identities.

All four viewports reported zero horizontal document overflow. Users-page
primary/row actions and every editor control measured at least 44 CSS pixels;
the narrow editor measured 712px high within the 844px viewport. Browser
warning/error collection was empty. The shared header's 40-pixel brand/home
link is an existing approved-shell detail and was not changed route-locally.
