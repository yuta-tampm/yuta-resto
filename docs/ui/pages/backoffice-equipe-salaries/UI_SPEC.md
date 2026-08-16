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
6. Detail: `Vue d'ensemble`, `Identité`, `Relation de travail`, `Historique`,
   `Consultations`.
7. Progressive manual create/edit flow.
8. Confirmed non-destructive departure flow.

The current desktop visual direction should be preserved during the approved
prototype unless repository constraints require a documented deviation:

- three compact summary cards, without KPI inflation;
- search, restrained filters, and employment-status views;
- dense operational table/list with selected-row feedback;
- a text-backed warning badge in the list and dossier during the final five
  calendar days: `Départ dans X jours`, `Départ demain`, then `Dernier jour`;
- no dossier selected or opened on initial page load;
- a right-side overlay drawer, opened only by explicit row/card selection, with
  a 60 rem desktop maximum so the six dossier sections and document content have
  enough working space;
- a structured dossier header with identity/status separated from secondary
  actions, followed by a stable tab bar and a responsive two-column key-fact
  grid on the overview tab;
- the `Identité` and `Relation de travail` tabs use the same responsive key-fact
  card language instead of stretching label/value rows across the wide drawer;
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

The integrated MVP detail sections are `Vue d'ensemble`, `Identité`, `Relation
de travail`, the read-only business `Historique`, and the OWNER-only
`Consultations` access history. A sixth `Documents` tab now exposes the
local-development signed-contract slice with real loading, empty, upload,
replacement, available, validation, conflict, scanner rejection, service error,
success, and recovery states.

Documents local-slice UX:

- enable add/replace only for a signed-contract PDF up to 10 MiB;
- show that missing written-contract evidence does not automatically make the
  employee dossier incomplete;
- keep view/download server mediated and make scanner or storage failure
  explicit without exposing operational details;
- retain the approved Phase 1 hierarchy while removing all fictional files and
  the prototype notice;
- surface Formalités status/navigation only after a real route contract and
  authorization exist;
- add a `Registre du personnel` header or dossier action only after its route,
  domain, historical ordering, and legal/security boundaries are approved;
- keep the dossier drawer focused on consultation; create/edit/departure remain
  separate confirmed dialogs rather than turning the drawer into one large form.

### Documents Phase 0 UI discovery scope

The next design exercise may explore a sixth `Documents` tab inside the existing
employee drawer. It must preserve the current explicit-open overlay drawer,
header, employee identity/status, action hierarchy, responsive width, and the
five implemented tabs. It does not redesign the list, Backoffice shell, or
employee creation flow.

The proposed tab may show:

- a concise explanation that files belong to the selected employee and establishment;
- an empty state with one `Ajouter un document` action for an authorized OWNER;
- a compact list grouped or labelled by an approved category, with document
  name, availability/status, verified type/size, upload date, and optional
  relevant/expiry date only where its meaning is approved;
- restrained row actions for `Consulter`/`Télécharger` and `Remplacer`;
- a separate add/replace dialog with category, file selection, limits/help,
  confirmation, upload progress, processing, validation rejection, retry, and
  persisted-success states;
- text-backed unavailable, rejected, expiring, or failed states; no color-only meaning;
- an OWNER-forbidden study demonstrating that no metadata is disclosed.

The design must not show delete/archive/share/email/export-all controls, OCR or
prefilled extracted data, electronic signature, contract generation,
Formalités, manager/self-service access, stable public URLs, storage-provider
details, or generic drag-and-drop success before the server has accepted and
security-processed the file. Missing/expiring warnings stay out until category
requirements and resolving actions are approved.

At 1440 px, cap the drawer at 60 rem. At 1024 px, allow it to use up to 88% of
the viewport so the underlying page remains recognizable without squeezing the
dossier content. At 768 and 390 px, use the full-width drawer, stack
metadata/actions safely, keep file controls reachable, and prevent long
filenames from causing horizontal overflow.

### Documents Wave B Phase 0 UI discovery scope

The next design exercise may extend the implemented Documents tab with a
separate `Avenants signés` section. It must preserve the current drawer,
employee header/actions, tab order, signed-contract card, protected-access
notice, server-mediated file actions, responsive behavior, and French copy.
It must not redesign the Salaries page or add a route/global document library.

The proposal may explore:

- a clearly separate base-contract area and zero-or-more amendment area;
- an amendment empty state with one `Ajouter un avenant` action;
- compact amendment rows/cards ordered by an explicitly labelled date;
- safe metadata such as a neutral display label, sanitized filename, PDF size,
  availability, upload date, and proposed effective date;
- `Consulter`, `Télécharger`, and deliberate `Remplacer` actions per amendment;
- add/replace UI reusing the current French file picker and PDF/10 MiB help;
- loading, empty, forbidden, validation, uploading, processing, rejected,
  unavailable, conflict, success, and retry studies.

The design must not present a new legal amendment as a replacement version of
the base contract or another amendment. It must not infer salary, work-time,
role, contract, or other structured employee changes from the file. Amendment
number, signature date, effective date, required/optional rules, and ordering
remain visibly non-authoritative proposals until approved.

The generated 1440/1024/768/390 references are `APPROVED FOR PHASE 1 PROTOTYPE
ONLY`. They keep the base contract separate, introduce an `Avenants signés`
section, and stack amendment actions responsively. The local prototype must add
a visible `Prototype` badge and `Aperçu sans sauvegarde` notice, use obviously
fictional filenames, label the date as proposed, and disable every amendment
action so it cannot be mistaken for persisted behavior.

### Documents Wave B Phase 2 proposed interaction contract

For a later approved real-data slice, each card represents one distinct legal
amendment. The effective date becomes required display/order metadata, while an
optional bounded reference may be shown only when supplied by the operator.
Cards are ordered by newest effective date and loaded ten at a time with
previous/next cursor controls only when another page exists.

`Remplacer` must identify the selected amendment and explain that it corrects
that amendment's scan without creating a new legal amendment. Add and replace
preserve submitted metadata after validation, scan, storage, or conflict errors.
The existing protected-access notice and PDF/10 MiB help remain authoritative.
No UI control may edit amendment metadata, delete/archive an amendment, infer
employee fields from PDF content, or expose a stable file URL in this phase.

The Phase 3 local implementation replaces the fixture cards with this real
interaction contract. Empty, loading, load failure/retry, validation, scanning,
persisted success, conflict, available, and paged states are active. Add and
replace use an inline bounded form; mobile actions stack and long filenames
truncate without hiding their accessible title. Production-only and deferred
controls remain absent.

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

Shell/navigation changes, POS data, real document storage/actions, OCR,
remuneration, payroll,
Formalités, contract generation, DPAE/DSN, apprenticeship, register/PDF,
legal-compliance claims, and backend/schema design are out of Phase 1. They are
retained as future capability waves in `PRODUCT_SCOPE.md`.

## Wave C Phase 0 UI discovery scope

Use the current employee drawer and its existing `Relation de travail` tab.
Preserve the employee header, actions, tab order, drawer widths, Backoffice
shell, French copy, semantic components/tokens, and current real employment
summary. Do not add another route, tab, KPI, global HR navigation item, or
Formalités action.

The proposed design may add one clearly separated section named
`Informations contractuelles complémentaires` containing:

- a CDD-reason row/control shown only when the existing contract is CDD, with
  an explicit not-applicable state for CDI;
- contractual weekly duration in `heures par semaine`, without deriving it from
  full-/part-time category, Planning, or Pointage;
- concise missing-information help and a neutral statement that Formalités is
  not yet available, with no link or workflow action.

Design loading, complete, incomplete, not-applicable, forbidden, validation,
pending, conflict, save-error/retry, and success studies. Because Phase 0 does
not authorize implementation, generated edit/success states are interaction
proposals only and must be marked DRAFT. Use no remuneration, probation,
part-time-distribution, apprenticeship, document extraction, Formalités status,
generation, alert, register, PDF, OCR, manager, or self-service controls.

Produce DRAFT studies at 1440, 1024, 768, and 390 px. At smaller widths, stack
field content and actions, keep labels/errors connected, retain visible focus,
avoid horizontal overflow, and preserve the current dossier-tab scrolling
behavior. Product approval allowed prompt execution and the selected visual
direction authorized a local Phase 1 prototype on 2026-08-16. The implemented
section is read-only, labelled `Prototype` and `Aperçu sans sauvegarde`, and
uses no persistence, permission, contract, or server behavior.

### Wave C Phase 1 prototype fidelity

The real employment summary remains unchanged. A separate complementary card
shows the two fictional values and a neutral Formalités-unavailable notice. It
does not duplicate the header edit action or render an open edit form. The
existing `Modifier` action continues to edit only supported real fields. CDI
renders the CDD reason as not applicable; CDD renders the clearly fictional
example. Both tablet and mobile layouts stack safely using the existing drawer
and tab-strip behavior.

### Wave C Phase 2 proposed interaction contract

The real read state would replace the prototype disclosure only after a safe
read slice exists. Missing legacy values display `Non renseigné`; CDI displays
`Non applicable — contrat CDI` for the reason. Neither state changes current
completeness. The Salaries list, KPIs, filters, tabs, and drawer header remain
unchanged.

The existing `Modifier` dialog remains the single edit surface. When contract
type is CDD, it shows one controlled reason select containing the four approved
labels and separate numeric `Heures` / `Minutes` inputs for contractual weekly
duration. CDI hides the reason control and explains that saving a CDD-to-CDI
change clears the previous reason. No free-text fallback is offered; an
unsupported case presents `Cas non pris en charge` and blocks that update.

Preserve submitted values after validation, conflict, or save failure. Show a
confirmation before clearing a CDD reason, existing pending behavior while
saving, existing stale-revision recovery, and a persisted success message only
after the real server mutation commits. Do not infer full-/part-time category,
open a second dialog, add a local save button, or expose Formalités actions.

Required Phase 3 QA covers CDD supported/unsupported, CDI not-applicable,
legacy missing values, 1-minute and 48-hour boundaries, invalid minutes,
contract-type transitions, conflict, retry, forbidden, narrow layouts, focus,
labels/errors, and preserved input.

### Wave C Phase 3 local as-built UI

The complementary card now displays persisted employee values and no longer
shows `Prototype` or `Aperçu sans sauvegarde`. Missing legacy values display
`Non renseigné`; CDI keeps the reason not-applicable message. The existing
`Modifier` dialog contains the controlled CDD reason and separate weekly hours
and minutes inputs. A CDD-to-CDI change with a stored reason exposes a required
confirmation checkbox. No second edit action or Formalités control was added.
