# POS management combos — Design Handoff

Status: Visual direction approved; Phase 1 implemented

Visibility: Engineering

## Phase 0 source

The completed Implementation Inventory is in `README.md`. The target is the
existing integrated local POS page `/management/combos`; design must preserve
the real `yuta-pos -> site-agent -> db-pos` chain and payment-combo semantics.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer        | Owner/source                                                          | Status   | Reuse exactly                                                                                               | May adapt                                             | Excluded                                                                           |
| ------------ | --------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| YUTA global  | `@yuta/ui`, semantic tokens, global/frontend rules                    | APPROVED | typography, semantic states, focus, accessible primitives, Lucide icons                                     | density and responsive composition                    | raw reference colors, another component/icon system                                |
| Application  | `apps/yuta-pos/AGENTS.md`, POS UI rules, current POS routes           | APPROVED | French operational copy, local-session model, touch/keyboard patterns                                       | compact spacing by viewport                           | cloud tenancy, Backoffice shell, marketing navigation                              |
| Section/flow | shared `ManagementHeader.tsx`; approved printing and catalog evidence | APPROVED | dark POS Management header, YUTA POS identity, `Gestion locale`, user/role, return-to-POS, account/sign-out | label compression at narrow widths                    | sidebar, drawer, persistent module tabs, invented modules                          |
| Page         | current authenticated combos captures and repository behavior         | REVIEWED | real hierarchy, fields, actions, active locks, states, return to `/management`                              | rule/group density and proposed page-local disclosure | invented fields, search/filter, bulk edit, drag persistence, cloud/device concepts |

### Shell and navigation

Shell mode: `REUSE_APPROVED_SHARED_SHELL`

Shell owner/reference:
`apps/yuta-pos/src/app/management/_components/ManagementHeader.tsx`,
`../pos-management-printing/references/phase-05-as-built-1366x768.png`,
`../pos-management-printing/references/phase-05-as-built-390x844.png`, and the
implemented catalog use of the same header.

- Header: compact dark shared header with YUTA POS identity, local-management
  label, authenticated user/role, `Retour au POS`, and account/sign-out.
- Primary navigation: `/management` remains the module hub.
- Page navigation: `Retour à la gestion` links to `/management`.
- Sidebar/mobile module navigation: none.
- Real destinations: `/`, `/management`, `/management/users`,
  `/management/catalog`, `/management/combos`, `/management/printing`.
- Unavailable destination: `Rapports locaux` has no working href.
- Forbidden: tenant switcher, cloud modules, new roles, notification/help
  controls, new routes, sidebar, drawer, bottom nav, or persistent module tabs.

## Current baseline capture

Baseline status: `CAPTURED`

Captured on 2026-08-12 from
`http://localhost:3003/management/combos` at `1366 × 768` with DPR 1. The local
PostgreSQL service, site-agent, and POS Next.js development server were healthy.
The browser signed in with an active local seed `admin` through the real login
flow and rendered the protected route rather than redirecting to login.

The populated seed-backed state showed four active rules: `Menu Gourmand`,
`Gua Bao Happy`, `Menu Express`, and `Combo Été`. The first rule displayed
three groups and a long eligible-item list; structural controls were disabled
because the rule was active. The rule editor was opened and cancelled without
submitting. No combo, catalogue, order, or database data was changed.

Files:

- `references/current-baseline-1366x768.png` — authenticated populated top
  viewport;
- `references/current-baseline-edit-rule-dialog-1366x768.png` — authenticated
  edit-rule dialog.

Not captured by mutating live data: inactive rule editing, empty rule/group/item
states, pending, success, conflict, invalid structure, stale/not-found,
forbidden/expired session, or site-agent unavailable. Design these from the
current code/contracts and label them as state studies, not captured evidence.

## Curated design-tool input bundle

1. Input image 1: current populated page baseline; role: target reference.
2. Input image 2: current rule-editor dialog; role: target reference.
3. Input image 3: approved printing desktop as-built; role: shared shell
   reference.
4. Input image 4: approved printing narrow as-built; role: shared responsive
   shell reference.
5. `PRODUCT_SCOPE.md`, `UI_SPEC.md`, and `DATA_AND_INTERACTION_SPEC.md` for the
   real hierarchy, fields, states, and protected invariants.

The generated images are `DRAFT` references. They may govern hierarchy,
density, proportions, spacing, and tone only after review. Runtime copy, data,
permissions, contracts, and behavior remain repository-authoritative.

## Design-generation prompt set

Design prompt status: `READY`

ImageGen mode: built-in generation with reference images. Do not treat the
baseline as an edit target. Generate each distinct asset separately.

### Prompt A — desktop operational overview

```text
Use case: ui-mockup
Asset type: high-fidelity desktop UI proposal for an existing local restaurant POS management page
Primary request: Redesign the real YUTA POS route `/management/combos` for faster scanning and safer combo-rule maintenance while preserving every current capability and business rule.
Input images: Image 1 is the current authenticated combos-page reference; Image 2 is the current rule-editor reference; Image 3 is the approved desktop shared-shell reference; Image 4 is the approved narrow shared-shell reference.
Scene/backdrop: 1366 × 768 operational desktop canvas, realistic application screenshot, no device frame.
Style/medium: shippable product UI mockup, not concept art; French restaurant operations; restrained, compact, calm, high legibility.
Composition/framing: Reuse the approved compact dark POS Management top header exactly in hierarchy: YUTA POS identity, “Gestion locale”, signed-in user and role, “Retour au POS”, and account/sign-out. Then show an in-content “Retour à la gestion” link, title “Formules et combos”, concise description, and the primary button “Nouvelle formule”. Show a rule overview optimized for scanning. Use real examples “Menu Gourmand”, “Gua Bao Happy”, “Menu Express”, and “Combo Été”. One rule may be expanded while the other rules remain compact summaries only if the disclosure affordance is explicit and all content remains reachable.
Text (verbatim): “Formules et combos”; “Retour à la gestion”; “Nouvelle formule”; “Active”; “Inactive”; “Priorité 10”; “Désactivez la formule pour modifier ses groupes et articles éligibles.”; “Menu Gourmand”; “Plat”; “Entrée”; “Dessert”; “Supplément 0,00 €”.
Required hierarchy: Each rule exposes name, active state, priority, pricing summary, group count, edit, add-group, and activate/deactivate actions. Each expanded group exposes name, minimum, maximum, order, edit, add-item, remove, and eligible items with extra prices. Active rules visibly disable structural group/item editing but still expose the current rule-level edit and deactivate actions.
Interaction/state intent: Make active locks, disabled controls, confirmation, pending, error, and empty states unambiguous. Use text-backed status and accessible icon labels. Keep direct touch targets, visible focus, keyboard usability, and no horizontal overflow.
Color palette: Use YUTA semantic canvas, surface, text, border, success, information, warning, danger, and focus roles. Do not sample or invent raw hex colors.
Constraints: Preserve real French copy, fields, routes, local admin/manager context, fixed and base-item-plus-delta pricing, priority, maximum applications, group quantities/order, eligible items, and extra prices. The page remains local POS and uses real data through site-agent. Generated sample data is non-authoritative.
Avoid: no sidebar, mobile drawer, bottom navigation, persistent module tabs, tenant switcher, cloud Backoffice, analytics, charts, search/filter, bulk edit, drag-and-drop, rule duplication, kitchen routing, hard-delete rule, new roles, new fields, new routes, marketing layout, decorative illustration, gradients, glassmorphism, watermark, or unrelated text.
```

### Prompt B — rule editor and state study

```text
Use case: ui-mockup
Asset type: high-fidelity companion UI proposal for the existing combo rule editor
Primary request: Design a clear, scroll-safe editor dialog for the existing rule “Menu Gourmand”, using the page and dialog baseline as references and changing presentation only.
Input images: Image 1 is the current authenticated combos page; Image 2 is the current editor dialog; Image 3 is the approved desktop shell reference.
Scene/backdrop: 1366 × 768 application canvas with the real combos page dimmed behind a centered dialog.
Style/medium: shippable YUTA POS UI mockup with compact operational density and readable French labels.
Composition/framing: Show title “Modifier Menu Gourmand”, concise existing helper copy, a logically grouped form, and persistent visible “Annuler” and “Enregistrer” actions within a scroll-safe dialog.
Text (verbatim): “Modifier Menu Gourmand”; “Nom”; “Mode de prix”; “Article de base + supplément”; “Prix fixe (€)”; “Supplément au prix de base (€)”; “Nom du groupe de prix de base”; “Requis uniquement pour le mode article de base + supplément.”; “Priorité”; “Applications maximum”; “Vide = sans limite.”; “Annuler”; “Enregistrer”.
Required fields: name, pricing mode, fixed price, signed base-price delta, nullable base group name, priority, and optional maximum applications. Depict clear pending, validation-error, duplicate-name, invalid-base-group, and service-unavailable variants as concise annotations or a secondary state strip, not new fields.
Constraints: Preserve current dialog behavior, focus, keyboard dismissal, pending submit, inline error, and close-on-success semantics. Do not imply autosave or direct database access.
Avoid: no wizard, tabs, new fields, analytics, preview calculator, recipe/kitchen fields, delete-rule action, cloud data, toast notification center, watermark, or extra text.
```

### Prompt C — narrow responsive companion

```text
Use case: ui-mockup
Asset type: high-fidelity narrow responsive companion for the existing local POS combos page
Primary request: Adapt the approved desktop combos proposal to 390 × 844 without changing capabilities or shell ownership.
Input images: Image 1 is the current combos baseline; Image 2 is the approved narrow POS Management shell reference; Image 3 is the approved desktop proposal produced from Prompt A.
Scene/backdrop: 390 × 844 narrow application viewport, no device frame.
Style/medium: shippable responsive product UI, French operational interface.
Composition/framing: Reuse the approved compact narrow management header/account pattern. Use one content column, readable wrapped French labels, direct access to “Retour à la gestion” and “Nouvelle formule”, compact rule summaries, and one clearly expanded rule/group example. Keep dialogs within the viewport with safe internal scrolling and reachable footer actions.
Constraints: Preserve all real actions, active locks, text-backed status, minimum touch targets, visible focus, keyboard/touch use, and no horizontal overflow.
Avoid: no bottom navigation, drawer, sidebar, hidden primary action, hover-only controls, clipped dialog footer, invented route, field, role, search, filter, bulk edit, cloud capability, watermark, or extra text.
```

## Review gate

The product owner approved proceeding to Phase 1 on 2026-08-13. That approval
accepts the selected hierarchy and disclosure direction subject to the
repository-authoritative deviations below. It does not approve invented
navigation, fields, permissions, persistence, pricing behavior, or unsupported
modules.

## Generated-reference handoff

Reference status: `APPROVED`

Generated on 2026-08-13 with the built-in ImageGen path and the curated local
reference bundle. The selected files are:

- `references/design-proposal-01-desktop.png` — desktop operational overview;
- `references/design-proposal-02-rule-editor.png` — rule-editor pending state;
- `references/design-proposal-03-narrow.png` — narrow responsive companion.

The first desktop generation was rejected because it introduced drag handles,
an incorrect inactive rule, incorrect seed values, and enabled-looking locked
controls. The first editor generation was rejected because it invented a
`Prêt` banner and field-level success validation. The selected drafts remove
those unsupported details.

Phase 1 decisions:

1. page-local rule/group disclosure is the approved density strategy;
2. the derived runtime summary remains and uses the real rule count;
3. narrow rule/group headers stack more strongly than the raster proposal;
4. hierarchy, spacing, and destructive-action emphasis use repository semantic
   tokens and primitives rather than generated styling.

Known non-authoritative raster deviations:

- generated logo geometry must not replace repository `YutaBrandMark`;
- generated colors, shadows, gradients, typography metrics, icons, and focus
  treatment are illustrative only; implementation uses semantic tokens,
  `@yuta/ui`, and Lucide;
- generated text/data must not override runtime French copy, real catalogue
  values, contract fields, disabled behavior, or permissions;
- the editor backdrop reflects the current baseline rather than authorizing a
  second shell variant. Phase 1 must use the approved shared management header.

## Phase 1 as-built evidence

Captured on 2026-08-13 through the real authenticated local management flow:

- `references/phase-01-implementation-1366x768.png`;
- `references/phase-01-implementation-390x844.png`.

The captures use real seed-backed data and submit no mutation. Desktop and
narrow layouts retain the shared header, content return, primary create action,
active-rule locks, real rule/group/item actions, and French runtime values.
The narrow capture has no horizontal document overflow.

## 2026-08-23 extension design prompt — suggestion eligibility

Status: `APPROVED`; selected references were approved by the product owner on
2026-08-23. Final authenticated as-built evidence was captured after the
operator signed in locally without sharing the PIN.

```text
Use case: ui-mockup
Asset type: high-fidelity extension of the existing authenticated YUTA POS `/management/combos` page
Primary request: Add a compact per-combo setting that lets a local admin or manager decide whether an active combo may appear in the order-entry completion-suggestion shelf.
Context bundle: Use the existing approved desktop and 390px management-combos references, the approved ManagementHeader references, and the current real hierarchy in this package. Do not redesign the page or shell.
Desktop state: Show the real rules Menu Gourmand, Menu Express, Gua Bao Happy, and Combo Été. Preserve each rule's Active/Inactive discount badge, priority, pricing summary, group count, disclosure, edit, group, and activation actions. Add a separate text-backed state and control labelled “Suggestion à la commande” with “Activée” or “Désactivée”. Demonstrate Menu Gourmand disabled for suggestions and Gua Bao Happy enabled without changing either rule's Active discount state.
Narrow state: At 390x844, keep the setting readable, keyboard/touch reachable, and at least 44px without causing horizontal page overflow or crowding existing actions. It may wrap below the rule summary.
Interaction states: Include a clear pending state, persisted success feedback, and local-service/save-error recovery. The control remains editable while a rule is active because it does not change groups, eligible items, pricing, or activation.
Protected invariants: This setting affects only `/orders/[orderId]/items` suggestions. It must not change payment/check discounts, combo priority, pricing, maximum applications, structural locks, historical snapshots, kitchen behavior, local authorization, or runtime ownership.
Exact exclusions: no automatic threshold based on item/group counts; no name matching or hard-coded combo IDs; no candidate cap; no browser-local preference; no new route, role, permission, shell, sidebar, cloud sync, analytics, kitchen control, delete action, or payment behavior.
Visual system: Reuse @yuta/ui semantic tokens, the existing Switch primitive if approved by composition, Lucide icons only where already justified, visible focus, French operator copy, and the approved ManagementHeader.
```

### Generated approved handoff

- `references/design-proposal-04-suggestion-config-desktop.png` — compact
  desktop rule-header setting with independent Active/suggestion states;
- `references/design-proposal-05-suggestion-config-narrow.png` — one-column
  390px companion with a full-width setting row and 44px control.

The initial generated pair was rejected because it repeated priority 10 and
illustrative pricing/group metadata across rules. The selected pair was
regenerated with current read-only catalog values. Exact raster icons, colors,
shadows, typography metrics, and switch geometry remain illustrative;
implementation must compose the existing `@yuta/ui` `Switch`, `Badge`, `Card`,
and feedback patterns.

The proposed disabled states for Menu Gourmand/Menu Express and enabled states
for Gua Bao Happy/Combo Été are design examples only. Phase 1 did not submit a
management action or change persisted combo data.
