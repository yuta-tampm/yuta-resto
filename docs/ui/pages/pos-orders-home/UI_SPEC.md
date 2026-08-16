# POS Orders Home — UI Specification

Status: Implemented and Phase 5 QA verified

Visibility: Engineering

## Authority and target

Target: `apps/yuta-pos`, route `/`, `EXISTING_PAGE`, implementation class `integrated`, delivery mode `EXISTING_CAPABILITY_RENEWAL`.

Repository behavior and current product documentation are authoritative. Future images may guide hierarchy, proportions, density, spacing, and tone only.

## Shared UI context

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Reuse `PosPageShell`/`PosHeader`, global `PosConnectivityStatus`, Geist Sans with Inter fallback, semantic tokens, `@yuta/ui`, and lucide icons. On desktop, use the existing prominent header variant and full-width shell treatment established by `/pos`: approximately 90px header height, a 56px logo, equal 48px Home action/menu controls, and a 30px title at the large breakpoint. Keep `Nouvelle commande` directly visible and place the global secondary destinations `Cuisine` and `Gestion` in an accessible three-line menu. Home-specific content owns the `Commandes` title/actions, segmented service-day views, search, order list/table, and mobile new-order FAB.

The shared application header owns action layout. Routes provide primary action content through `actions` and optional global secondary destinations through `secondaryActions`; routes must not recreate the header `<details>`, breakpoint visibility, trigger dimensions, dropdown anchoring, or compact-menu duplication.

Do not use the Backoffice dashboard shell, the authenticated management header, a new sidebar, or invented bottom navigation. Reusing the approved prominent `/pos` header variant does not authorize copying `/pos` form content, `Commandes` self-navigation, or its static `Service actif` badge into Home; Home continues to use the truthful shared health strip.

The shared service-time shell exposes the same three-line trigger on sibling
routes, where its real destinations are `Commandes`, `Cuisine`, and `Gestion`.
Home intentionally omits the `Commandes` self-link while keeping the same
trigger geometry and interaction model.

## Phase 0 baseline and Phase 1 result

The Phase 0 header presented `Commandes`, `Suivi des commandes du service`, and real links to new order, kitchen, and management inside a max-width-constrained shell. Phase 1 made the header and health strip span the viewport using the existing `/pos` prominent mode. After real-device review, the Home controls and order renderer now also use the full available route width instead of an independently bounded `max-w-7xl` container. The approved revision displays only `Nouvelle commande` directly on desktop; `Cuisine` and `Gestion` appear after opening secondary navigation. A subheader contains three segmented views and a GET search form. Below `md`, orders render as cards; from `md` to below `xl`, as compact rows; at `xl`, as a seven-column table. A new-order FAB appears below `sm`.

Phase 3 corrections:

- the search form exposes a truthful `Rechercher` submit action instead of the unsupported `Filtres` affordance;
- the actionless desktop `Options` ellipsis is removed;
- each mobile order presents the allergy badge once.

Remaining presentation gaps:

- `Articles` is `items.length`: row count, including cancelled rows, not a summed active quantity.
- Home has no route-owned loading/error/retry surface; rejected loads fall to framework error handling.
- No order-list polling exists; order data refreshes on navigation/reload only.

## Visual hierarchy

1. Compact service-time title and direct global operational destinations.
2. Truthful local service/database/Internet/printer condition.
3. Service-day view selection with open/paid counts where currently available.
4. Search by repere/table or order number.
5. Highly scannable order identity, status, time, article-row count, total, allergy warning, and next action.
6. Truthful empty or load/degraded recovery state.

No decorative dashboard metrics or marketing content should displace the command list.

## Content and copy

Keep operator copy in French and preserve real vocabulary: `Commandes`, `Nouvelle commande`, `Cuisine`, `Gestion`, `Ouvertes`, `Payees aujourd'hui`, `Activite aujourd'hui`, `Ouvrir`, `Voir le detail`, `Envoyer`, and `Payer`. Correct accents may be proposed visually only if repository copy/encoding is handled consistently during implementation.

Status mapping remains:

| Domain status | Current Home label | Current primary action                                           |
| ------------- | ------------------ | ---------------------------------------------------------------- |
| `draft`       | `Non envoyee`      | `Envoyer`, but it navigates to detail and does not send directly |
| `sent`        | `Envoyee`          | payment route                                                    |
| `preparing`   | `En preparation`   | payment route                                                    |
| `ready`       | `Prete`            | payment route                                                    |
| `served`      | `Servie`           | payment route                                                    |
| `paid`        | `Payee`            | detail only                                                      |
| `cancelled`   | `Annulee`          | detail only                                                      |

## Service-time / interaction density

The page must support quick scanning during service, with direct primary actions, readable totals/statuses, and touch targets of about 44px or larger where feasible. Core actions must not move into a dense overflow menu. Allergy and degraded-state information must use text/icons, not color alone.

## Responsive behavior

QA matrix: 1366×768, 1024×768, 768×1024, and 390×844.

- Desktop `xl`: table with visible actions.
- Tablet `md` through below `xl`: row list with the same authoritative fields/actions.
- Desktop `lg` and above: full-width/prominent header and full-width route content; `Nouvelle commande` stays direct and `Cuisine`/`Gestion` use the secondary menu.
- Below `lg`: all three header destinations collapse into the existing compact menu to prevent wrapping; the mobile new-order FAB remains direct.
- Mobile below `md`: order cards and the FAB remains available.
- Segmented views may scroll without causing document-level horizontal overflow.
- Main content keeps its existing internal vertical scroll within the `h-dvh` shell.

## Accessibility

- Preserve semantic links for navigation and a GET search form.
- Every icon-only action requires an accessible name; a visual-only ellipsis is not acceptable.
- Preserve visible focus, keyboard operation, textual status, and non-color allergy communication.
- Search needs a persistent accessible label even if placeholder copy changes.
- Loading/error/degraded states must announce status and provide safe retry without operational mutation.
- Do not hide essential order actions behind hover-only UI.

## Visual acceptance

The product owner reviewed and approved only the full-width/prominent header direction shown in `header-direction-full-width.png`. No complete Home design proposal is approved. Phase 0 acceptance otherwise remains represented by the current-state captures and ready prompt. Any generated full-page reference starts as `DRAFT` and must be checked against the route/control inventory.

## Out of scope

Backend, schema, contract, authentication, transaction, device, printer-control, cross-route shell, cloud, customer, provider, fiscal, and unsupported action changes are excluded.
