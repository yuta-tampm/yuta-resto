# POS Order Entry - UI Specification

Status: Phase 1 approved visual baseline

Visibility: Engineering

## Authority and target

The target is the existing integrated `apps/yuta-pos` page `/pos`, delivered
through `EXISTING_CAPABILITY_RENEWAL`. Repository implementation and current POS
documentation remain behavioral authority. Visual references guide only
hierarchy, density, proportions, spacing, responsive composition, and tone.

## Shared UI context

Shell mode is `REUSE_APPROVED_SHARED_SHELL`.

- Reuse `PosPageShell`, `PosHeader`, and `PosConnectivityStatus` hierarchy.
- Keep logo/home, title/description, the direct route-owned `Service actif`
  badge, the shared three-line `Commandes`/`Cuisine`/`Gestion` navigation, and
  the truthful status strip. Do not add the Home-only direct
  `Nouvelle commande` navigation action.
- Reuse POS typography, `@yuta/ui`, semantic tokens, Lucide, focus, keyboard,
  and touch conventions.
- Adapt only page content density and form composition by viewport.
- Do not add sidebar, bottom navigation, tenant/account UI, management shell,
  unrelated routes, or cross-page shell changes.

## Current baseline

The 1366 x 768 capture shows the shared dark header and local-status strip above
a centered single-card form. It contains employee selection, table/reference,
three equal order-type choices, optional note, and a full-width primary action.
The real seeded state selects `YuTa Staff`, defaults to `Sur place`, has an
enabled create action, reports local service/database available, and reports
the printer unconfigured.

The screen is force-dynamic and data-backed. With no eligible employee, it
shows a danger alert and disables selection and creation. Load, submit-pending,
field-validation, and create-failure recovery have no dedicated page-level UI.

## Visual hierarchy

1. Shared POS identity, page context, real command/kitchen navigation, and
   local-service status.
2. `Nouvelle commande` task heading and concise service description.
3. Employee attribution and table/reference as the first scan group.
4. Direct order-type selection with all three options visible.
5. Optional general note as secondary input.
6. One unmistakable primary action: `Creer la commande`.
7. Blocking no-employee/load/create errors adjacent to the form.

## Content and copy

Current repository copy is authoritative: `Nouvelle commande`,
`Creer une commande pour le service`, `Service actif`, `Commandes`, `Cuisine`,
`Gestion`,
`Employe`, `Choisir employe`, `Table / Repere`, `Terrasse 5`,
`Type de commande`, `Sur place`, `A emporter`, `Livraison`,
`Note (optionnel)`, `Ex: Anniversaire, demande generale...`,
`Creer la commande`, and
`Aucun employe actif disponible pour creer une commande.`

Generated copy must not silently replace source copy without review.

## Service-time / interaction density

Keep the flow direct, compact, and tablet/touch-friendly. Core fields and the
primary action must remain in a predictable top-to-bottom scan. Do not hide
types or creation behind menus, steps, tabs, accordions, or dashboard cards.

## Responsive behavior

Use 1366 x 768, 1024 x 768, 768 x 1024, and 390 x 844. Phase 0 captures the
1366 baseline; Phase 5 must cover all four. Keep one content column, preserve
the current narrow header action menu, prevent horizontal overflow, and keep
fields/actions reachable with a virtual keyboard. Order types may wrap only if
direct recognition and touch size are preserved.

## Accessibility

- Preserve labels and the order-type `fieldset`/`legend` relationship.
- Preserve native required semantics and a non-color selected state.
- Keep keyboard navigation, visible focus, and text-backed status/errors.
- Keep touch-critical controls at least 44 CSS pixels high.
- Pending/disabled states must be readable and unambiguous if approved.
- Associate future errors with fields and preserve entered values on recovery.

## Visual acceptance

The desktop and narrow renewal direction was approved on 2026-08-14 for Phase

1. It governs action reachability, grouping, shell fidelity, density,
   responsive composition, and tone. Generated text, icons, exact pixels, and
   state-study details remain subordinate to the repository implementation and
   semantic UI system.

Phase 5 as-built QA completed on 2026-08-14 at 1366 x 768, 1024 x 768,
768 x 1024, and 390 x 844. The delivered page has zero horizontal overflow,
48px minimum effective touch targets, a visible 56px primary action, working
employee-combobox Enter/Escape behavior, visible focus, and no essential
hover-only behavior. A reduced 390 x 500 height kept the action reachable with
the note focused. Server validation is field-associated and preserves entered
values, including the selected order type.

The final approved header is full-width on `/pos`, with the prominent desktop
scale from the reference and a compact action menu below `lg`. This is a
route-selected presentation variant of the shared POS shell; it does not change
the header hierarchy, destinations, connectivity status, or sibling routes.

## Out of scope

Backend, schema, contract, authentication, runtime, device, printer, shared
shell, unrelated route, and product-capability changes are excluded.
