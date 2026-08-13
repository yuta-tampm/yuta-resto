# Backoffice Équipe — Salariés — UI Specification

Status: Approved direction with real read slice

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
remains `NOT_APPLICABLE`. It now hosts a real read-only employee-list slice;
creation, editing, departure, and audit behavior are not integrated yet.

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
- right-side desktop quick view for fast consultation, not a large editor;
- mobile list cards and a separate full-width detail surface rather than a
  squeezed split layout.

After approval, typed fictional fixtures must use a demonstration-data notice
and must not imply implemented persistence, upload, export, or generation.

## Interaction density

Favor desktop scan speed and reachable filters/actions. Mobile may use list
cards instead of a wide table. Progressive disclosure should hide deferred HR
complexity. Departure requires confirmation and clear non-deletion copy.

Selecting an employee row changes only the selected quick-view content; it must
not mutate data. Pagination follows approved repository/product semantics. The
draft image's `10 / page` control does not authorize configurable page size.

## Completeness and actionable issues

The MVP completeness state must explain what approved minimum information is
missing and which available action resolves it. Do not persist or present only
an unexplained `Complet / À compléter` boolean.

Future expiry, contract, document, or formality alerts are distinct from MVP
completeness. When their capability waves are approved, use a compact `À
traiter` surface only when concrete actionable items exist; do not reserve a
large empty panel or add a fourth summary card.

## Future dossier sections and actions

The Phase 1 detail sections remain `Vue d'ensemble`, `Identité`, `Relation de
travail`, and `Historique` using approved fixture concepts only.

Future-wave UX intent, not Phase 1 scope:

- add `Documents` as a first-class dossier section only after secure storage,
  document authorization, actions, audit, and retention are approved;
- surface Formalités status/navigation only after a real route contract and
  authorization exist;
- add a `Registre du personnel` header or dossier action only after its route,
  domain, historical ordering, and legal/security boundaries are approved;
- keep the desktop quick view concise and use a larger route/drawer/dialog for
  a full editor only when the repository establishes that interaction owner.

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
