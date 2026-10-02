# Backoffice Équipe — Registre du personnel — UI Spec

Status: Phase 5 local as-built UI synchronized; production blocked

Visibility: Engineering

## Hierarchy

1. Back link to `Salariés`, page title, active establishment, and DRAFT label.
2. Neutral explanation that structured establishment data builds the register.
3. `Préparation du registre` card with ready, missing, and unsupported-category facts.
4. Disabled protected `Exporter en PDF` action during prototype discovery.
5. `Salariés` in visible canonical order, using rows on wide screens and cards on narrow screens.
6. Separate truthful `Stagiaires et service civique` unavailable section.
7. Protected-access and retention-review notice.

No `Conforme` badge, sidebar item, public link, or editing grid is allowed.

## States

Design later loading, ready, incomplete, empty, unsupported category,
forbidden, read error/retry, export pending/failure/success, stale source, and
retained former-person states. No state may reveal names or counts before authorization.

## Responsive and accessibility

At 1440/1024 use a compact ordered table. At 768/390 use ordered stacked cards.
No horizontal data grid or hidden hover-only facts. Text must wrap; touch targets
are at least 44 px; status is text-backed; focus is visible and restored after
future dialogs. Preserve keyboard operation and no horizontal overflow.

## Reference review notes

The selected reference set preserves the shell, keeps `Salariés` selected, omits a
register sidebar item, shows a disabled export, separates unsupported stagiaire/
service-civique scope, and adapts rows into cards at 768/390. Fictional names
and counts are prototype-only. Product approved this visual direction for the
local typed-fixture prototype on 2026-08-18.

## Phase 1 as built

The prototype uses the shared Backoffice demonstration notice, an explicit
`DRAFT` label, disabled PDF export, a three-part readiness card, a wide table at
`lg` and above, and stacked employee cards below `lg`. The prototype implements
authenticated loading, OWNER-only forbidden, error/retry, incomplete-data, and
unsupported-category presentation. Ready, empty, export progress/failure/
success, stale source, and retained-former-person behavior remain Phase 2 design
work because Phase 1 has no data loader or export interaction.

## Phase 2 proposed interactions

- keep the register read-only; no grid editing, deletion, reorder, inline
  correction, or bulk action;
- show 50 entries in canonical order with `Précédent` and `Suivant` only;
- keep the current page visible and mark it busy while pagination loads;
- enable `Exporter en PDF` only for a complete supported snapshot and provide a
  textual reason while disabled;
- on export, show one pending state, prevent duplicate activation, and surface
  failure without navigating away or claiming a file exists;
- when source revision changes, invalidate pagination/export and offer
  `Actualiser le registre`;
- route any later correction into a separately approved, reasoned append-only
  flow; Phase 2 does not add that UI to the prototype.

The ready summary must distinguish complete supported entries, missing fields,
and unsupported categories. It must never say `Conforme`. An empty
establishment explains that no entry exists and leaves export disabled. A full
read error displays no names or stale counts. Forbidden renders no register
content. Long names, qualifications, agency/group addresses, and conditional
facts wrap without hover-only disclosure.

## Phase 3 as built

The route now replaces fictional rows with persisted employee inscriptions.
An empty register shows real Salariés candidates separately and explains that
they are not backfilled. The inscription dialog keeps dossier-owned facts
fixed, collects the additional required and conditional facts, and closes only
after persisted success. Each row exposes a separate correction dialog with
editable facts, required reason/date, optimistic revision, and preserved
history.

The list uses responsive stacked rows rather than a horizontal mobile grid.
Pagination remains previous/next at 50 rows. Export is enabled only for a
non-empty supported snapshot. The page carries a visible local-only warning
rather than DRAFT/demo copy, and production renders no register data.

## Phase 5 as built

The final local evidence uses the truthful empty register: zero inscriptions,
three existing employee candidates awaiting explicit review, disabled PDF
export, and the separate unsupported-category notice. It intentionally differs
from the fictional Phase 1 rows and DRAFT disclosure because persisted data and
the local-only runtime warning are now authoritative.

At 1440/1024 the content keeps a compact wide composition; at 768 the existing
Backoffice sidebar leaves a readable single-column content area; at 390 the
mobile shell, actions, summary cards, candidate review, and register content
stack without horizontal overflow. The inscription dialog uses internal
vertical scrolling at 390 x 844. Selecting a dossier does not open it; the
explicit review button does. Escape closes it and restores focus to that button.
