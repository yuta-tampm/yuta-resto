# Backoffice Équipe — Salariés — UI Specification

Status: Draft design reference

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

The route is a planned placeholder, so baseline status is `NOT_APPLICABLE`.
The placeholder establishes route/shell context, not an employee-page design.

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

After approval, typed fictional fixtures must use a demonstration-data notice
and must not imply implemented persistence, upload, export, or generation.

## Interaction density

Favor desktop scan speed and reachable filters/actions. Mobile may use list
cards instead of a wide table. Progressive disclosure should hide deferred HR
complexity. Departure requires confirmation and clear non-deletion copy.

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

No page-specific reference is approved. Generated proposals remain `DRAFT`
until product review confirms scope, hierarchy, responsiveness, truthful states,
and absence of deferred capabilities.

## Out of scope

Shell/navigation changes, POS data, documents, OCR, remuneration, payroll,
Formalités, contract generation, DPAE/DSN, apprenticeship, register/PDF,
legal-compliance claims, and backend/schema design.
