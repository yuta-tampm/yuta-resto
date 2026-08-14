# Backoffice Équipe — Salariés — UI Specification

Status: Approved direction with real read, create, edit, departure, and history slices

Visibility: Engineering

## Authority and target

This is a `NEW_PAGE` at `/equipe/salaries` whose intended production class is
`integrated`. Repository/product decisions remain behavior authority; images
may guide hierarchy, density, proportions, spacing, and tone only.

## Shared UI context

Use `REUSE_APPROVED_SHARED_SHELL`: preserve `BackofficeFrame`, sidebar, topbar,
tenant selector, account/sign-out area, mobile menu, footer, typography,
semantic tokens, and navigation. The Équipe section has no second shell.

## Current baseline

The route began as a planned placeholder, so the original baseline status
remains `NOT_APPLICABLE`. It now hosts real employee list, minimum creation,
minimum editing, and confirmed non-destructive departure slices. Audit-history
presentation is integrated as a bounded read-only detail tab.
It loads on demand and provides loading, unavailable, retry, and truthful empty
states rather than delaying the initial employee list.

## Discovery hierarchy

1. `Salariés` header and `Ajouter un salarié` primary action.
2. Compact actionable summary for active, upcoming, and incomplete records.
3. Search and practical filters.
4. `Actifs`, `Entrées à venir`, and `Anciens salariés` views.
5. Responsive list: name, poste, qualification, minimal contract summary,
   entry/expected end dates, and completeness.
6. Detail: `Vue d'ensemble`, `Identité`, `Relation de travail`, `Historique`.
7. Progressive manual create/edit flow.
8. Confirmed non-destructive departure flow.

The current desktop visual direction should be preserved during the approved
prototype unless repository constraints require a documented deviation:

- three compact summary cards, without KPI inflation;
- search, restrained filters, and employment-status views;
- dense operational table/list with selected-row feedback;
- no dossier selected or opened on initial page load;
- a right-side overlay drawer, opened only by explicit row/card selection,
  wide enough for the four dossier sections without shrinking the list layout;
- a structured dossier header with identity/status separated from secondary
  actions, followed by a stable tab bar and a responsive two-column key-fact
  grid on the overview tab;
- mobile list cards and a full-width detail drawer rather than a squeezed split
  layout.

After approval, typed fictional fixtures must use a demonstration-data notice
and must not imply implemented persistence, upload, export, or generation.

## Interaction density

Favor desktop scan speed and reachable filters/actions. Mobile may use list
cards instead of a wide table. Progressive disclosure should hide deferred HR
complexity. Departure requires confirmation and clear non-deletion copy.

Selecting an employee row opens the read-only dossier drawer; it must not mutate
employee data. Closing the drawer clears the selection. Pagination follows
approved repository/product semantics. The
draft image's `10 / page` control does not authorize configurable page size.

## Completeness and actionable issues

The MVP completeness state must explain what approved minimum information is
missing and which available action resolves it. Do not persist or present only
an unexplained `Complet / À compléter` boolean.

The integrated state derives stable reasons for missing minimum names, poste,
or qualification, applies the same rule to count/filter results, and offers the
existing `Modifier` action from the detail.

Future expiry, contract, document, or formality alerts are distinct from MVP
completeness. When their capability waves are approved, use a compact `À
traiter` surface only when concrete actionable items exist; do not reserve a
large empty panel or add a fourth summary card.

## Future dossier sections and actions

The MVP detail sections remain `Vue d'ensemble`, `Identité`, `Relation de
travail`, and the integrated read-only `Historique`.

Future-wave UX intent, not Phase 1 scope:

- add `Documents` as a first-class dossier section only after secure storage,
  document authorization, actions, audit, and retention are approved;
- surface Formalités status/navigation only after a real route contract and
  authorization exist;
- add a `Registre du personnel` header or dossier action only after its route,
  domain, historical ordering, and legal/security boundaries are approved;
- keep the dossier drawer focused on consultation; create/edit/departure remain
  separate confirmed dialogs rather than turning the drawer into one large form.

## Required discovery states

Loading, first-use empty, forbidden, validation, conflict, pending,
prototype-success, load/save failure with retry, and active/upcoming/former/
incomplete examples.

## Responsive behavior

Verify 1440, 1024, 768, and 390 px. Preserve current sidebar/mobile-drawer
behavior, prevent horizontal overflow, stack content safely, keep the primary
action reachable, and keep dialogs scroll-safe.

## Accessibility

Keyboard operation, visible focus, accessible names, connected labels/errors,
preserved failed input, text-backed status, managed dialog focus, and truthful
pending/disabled behavior are required.

## Visual acceptance

The desktop and mobile page references are `APPROVED` as Phase 1 visual
direction. This approval governs hierarchy, responsiveness, truthful states,
and absence of deferred capabilities only; it does not define production data,
contracts, permissions, persistence, or legal behavior.

## Out of scope

Shell/navigation changes, POS data, documents, OCR, remuneration, payroll,
Formalités, contract generation, DPAE/DSN, apprenticeship, register/PDF,
legal-compliance claims, and backend/schema design are out of Phase 1. They are
retained as future capability waves in `PRODUCT_SCOPE.md`.
