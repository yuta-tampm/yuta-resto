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
minimum editing, confirmed non-destructive departure, and server-side list
sorting slices. Audit-history
presentation is integrated as a bounded read-only detail tab.
It loads on demand and provides loading, unavailable, retry, and truthful empty
states rather than delaying the initial employee list.

## Discovery hierarchy

1. `Salariés` header and `Ajouter un salarié` primary action.
2. Compact actionable summary for active, upcoming, and incomplete records.
3. Search, dossier-completeness filter, and operational ordering.
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
- mobile list cards navigate to the addressable full employee dossier rather
  than squeezing the desktop drawer into the narrow layout.

After approval, typed fictional fixtures must use a demonstration-data notice
and must not imply implemented persistence, upload, export, or generation.

## Interaction density

Favor desktop scan speed and reachable filters/actions. Mobile may use list
cards instead of a wide table. Progressive disclosure should hide deferred HR
complexity. Departure requires confirmation and clear non-deletion copy.

Selecting a desktop employee row opens the read-only dossier quick view; it must
not mutate employee data. The quick view exposes `Ouvrir le dossier complet`.
Selecting a mobile card opens `/equipe/salaries/[employeeId]` directly. The full
route repeats OWNER authorization and trusted establishment scope, reuses the
approved dossier sections/actions, and returns not found without disclosure for
an invalid or out-of-scope employee identifier. Closing the desktop drawer
clears the selection. The list defaults to
`Date d’entrée — plus récente` and supports `Nom — A à Z`, `Nom — Z à A`,
`Poste — A à Z`, and `Poste — Z à A`. Ordering applies to the full server
result, resets the cursor, and never changes personnel-register order.
Pagination follows approved repository/product semantics. The
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

## Wave D Phase 0 UI discovery — `À traiter`

Status: `PHASE 1 LOCAL PROTOTYPE — REAL DATA NOT AUTHORIZED`

The capability surface does not exist. The signed-in local OWNER baseline on
2026-08-16 confirms the current page still has exactly three summary cards and
no `À traiter` section. The containing-page baseline is the current Wave C
Phase 5 responsive as-built set under `references/`; the new surface baseline
is `NOT_APPLICABLE`.

### Proposed placement and hierarchy

Keep the shared Backoffice shell, page header, three summary cards, search,
filters, employee list, and explicitly opened dossier drawer unchanged. Explore
one compact `À traiter` section between the three-card summary and list/search
area. Do not add a fourth metric card, sidebar item, page tab, drawer tab, or
new route.

Separate the content visually and semantically into:

- `À corriger`: incomplete minimum dossiers and missing signed base contracts;
- `Échéances proches`: recorded departures from today through the next five
  establishment-local calendar days.

An item contains an employee name, a short text-backed reason, an optional
relevant date, and one supported action. Recommended French actions are
`Compléter le dossier`, `Ajouter le contrat`, and `Voir le départ`. Actions open
the existing employee flow; they do not complete or dismiss an item locally.

The first design study may use a small bounded set of clearly fictional items
to evaluate density. It must not invent final pagination, infinite scrolling,
`Voir tout`, assignment, badges implying persisted priority, or task status.
Item limit and navigation remain a Phase 2 interaction decision.

### Truthful states

Design these DRAFT states without implying runtime support:

- loading of the derived overview;
- ready with only correction items, only dated events, or both groups;
- compact no-items treatment without reserving a large empty panel;
- partial unavailability where document status cannot be loaded while employee
  items remain truthful;
- complete load failure with retry;
- forbidden state that reveals no names, counts, issue types, or dates;
- an employee/source record changing while the overview is open, resolved by a
  fresh read rather than local dismissal.

Do not show mutation pending/success as a property of `À traiter`; success
belongs to the existing edit/document/departure flow. On return, the overview
refreshes and the derived item remains or disappears according to authoritative
data.

### Responsive and accessibility scope

At 1440 and 1024 px, explore a compact two-group layout without competing with
the employee list. At 768 and 390 px, stack groups and item content, keep one
visible action per item, and avoid nested horizontal scrolling. Preserve the
existing horizontal drawer-tab scrolling only inside the drawer.

Use semantic headings/lists, text-backed issue/event meaning, visible focus,
44 px touch targets where applicable, accessible action names including the
employee context, and no color-only urgency. Long names must wrap or truncate
without hiding the accessible full name.

### Forbidden visual inference

Do not show CDD-expiry alerts, missing amendments, Formalités deadlines,
notification bells/counts, inbox semantics, emails, task checkboxes,
assignees, snooze/dismiss, manual priority, bulk selection, payroll/medical
alerts, register/PDF actions, manager views, cross-establishment counts, or
production/legal-compliance claims.

### Phase 1 as-built prototype boundary

The approved local prototype implements the selected ready-state hierarchy
only. It adds one route-local card after the three metrics, with two semantic
groups and the three fictional design examples. The card displays `DRAFT` and
`Données fictives`; all three action buttons are disabled and their accessible
names state that they are unavailable in the prototype.

Loading, no-items, partial failure, complete failure, forbidden, retry, return
refresh, ordering, and item-limit studies remain design requirements for later
interaction mapping. They are not simulated as working states in Phase 1.

### Wave D Phase 2 proposed interaction contract

Phase 2 keeps the approved visual hierarchy and specifies later behavior only;
the development fixture remains unchanged.

- each group shows five items per page and owns its own `Précédent` / `Suivant`
  controls only when needed;
- do not add totals, hidden-item counts, `Voir tout`, infinite scroll, a route,
  tab, filter, or fourth KPI;
- pagination marks only the active group busy, disables its controls, and keeps
  the current page visible until replacement succeeds;
- correction items use neutral name ordering; dated events put the earliest
  departure first;
- `Compléter le dossier` opens the existing edit dialog only after a fresh
  server check and focuses the first missing minimum field;
- `Ajouter le contrat` opens the existing drawer on `Documents` and reveals the
  existing add form only when the absence is revalidated;
- `Voir le départ` opens the existing overview at the departure information;
  it does not open the correction dialog automatically;
- returning from a successful existing flow refreshes source data; no item is
  removed or marked complete optimistically;
- a changed/resolved item reports that the list was refreshed rather than
  opening a stale flow.

At narrow widths, stack group pagination and item actions without nested
horizontal scrolling. Focus moves into the edit dialog or dossier drawer using
their existing managed-dialog behavior; after closing, restore focus to the
originating overview action when it still exists, otherwise to the `À traiter`
heading.

Document-source partial failure uses a text-backed warning inside `À corriger`
and disables that group's pagination until retry. Employee-source failure
replaces the whole surface with non-disclosing error + retry. A no-items result
is one compact neutral row. The route-level forbidden state shows no Wave D
heading, names, counts, kinds, dates, or source-status signal.

### Wave D Phase 3 local as-built UI

The approved development-only implementation replaces the fixture and its
`DRAFT` disclosures with the real derived overview. Each group renders at most
five items, owns independent previous/next controls, and exposes no total or
new route. Loading disables controls; full failure shows retry; document-source
failure retains only truthful employee-derived corrections with a warning; and
the empty state makes no legal-completeness claim.

Actions first revalidate the current tenant-scoped condition. They then open
the existing edit dialog, Documents tab/add form, or dossier overview focused
at the departure fact. Successful document save refreshes route source truth.
Production renders no Wave D surface and performs no overview query.

### Wave D Phase 5 visual correction and final local state

Responsive QA retains the Phase 3 composition without spacing, density, color,
or breakpoint changes. One accessibility correction records the originating
Wave D button before asynchronous target resolution and restores focus to that
connected button when the opened drawer/edit dialog closes. This is required
because the dossier drawer is state-driven rather than opened by a colocated
dialog trigger.

The approved local as-built evidence covers 1440, 1024, 768, and 390 px. The
current real-data state shows one missing-contract action and a truthful empty
departure group. Error, partial-source, and pagination visuals remain specified
truthful runtime states but are not represented with fixtures in the final
evidence set.

## Wave E Phase 0 UI discovery — personnel register and PDF export

### Proposed placement and hierarchy

Wave E explores an establishment-wide page rather than another employee-drawer
tab. A secondary `Registre du personnel` action may appear in the Salariés page
header and open the proposed `/equipe/registre-personnel` route. The Backoffice
shell, establishment selector, Salariés list, metrics, `À traiter`, employee
drawer, and current actions remain unchanged.

The proposed page hierarchy is:

1. title `Registre du personnel`, active establishment context, and a clear
   return path to `Salariés`;
2. a neutral explanation that the register is establishment-specific and that
   PDF is generated from the structured register;
3. a readiness card distinguishing ready data, missing required information,
   and unsupported person categories without a compliance badge;
4. a canonical ordered register list, with salariés and the separate
   stagiaire/service-civique part visually distinguishable;
5. a secondary `Exporter en PDF` action, disabled in the Phase 1 discovery
   prototype and never represented as a public/share link;
6. a concise protected-access and retention notice.

The preferred PDF study may use one person per page, but must preserve the
canonical establishment order and show that it is a generated representation,
not the editable source or proof of compliance.

### Proposed row/card content

The design may group only legally motivated facts that are present in the
Phase 0 data dictionary: identity, employment classification, entry/exit, and
conditional mentions. Missing values use explicit `Information manquante`
text. Do not invent real values, legal-status badges, document links, work-
permit copies, payroll facts, or AI-extracted content.

Search and filtering are not part of the first discovery MVP because they can
obscure canonical order. A future display filter must never alter the complete
ordered PDF export.

### Truthful discovery states

- loading skeleton that reveals no names before authorization;
- ready register with canonical order and export affordance;
- incomplete register with field/category counts and a clear explanation;
- empty establishment with no fabricated row or compliant state;
- separate unsupported stagiaire/service-civique explanation;
- forbidden state that discloses no names, counts, or existence signal;
- full read error with retry;
- export pending, export unavailable, export failure with retry, and protected
  download success;
- source changed during export, requiring a fresh snapshot rather than silently
  combining versions;
- retained former-person state without presenting departure as deletion.

### Responsive and accessibility scope

At 1440 and 1024 px, use a compact ordered table or structured rows with the
readiness card above it. At 768 and 390 px, preserve the same order using
stacked cards; do not create a horizontally scrolling legal-data grid or hide
required facts behind hover. Long names and conditional mentions must wrap.

Every status needs text, not color alone. The ordered position, person category,
missing-information reason, and export state require accessible names. Focus
must return to the initiating control after any future export dialog closes.
The design must preserve visible focus, keyboard access, 44 px touch targets,
and no horizontal page overflow.

### Forbidden visual inference

Do not add a compliance seal, digital signature, certification, inspection/CSE
portal, public URL, email/share control, organization-wide register, manager
view, employee self-service, editing grid, destructive correction, PDF archive,
OCR/AI action, Formalités, DPAE/DSN, payroll, Planning, or Pointage control.
Phase 0 does not authorize the proposed route or header action in runtime code.

## Wave F Phase 0 — extraction review UI discovery

### Surface and hierarchy

Wave F remains inside the existing employee drawer and `Documents` tab. It does
not create a route, sidebar item, chatbot, global AI center, or creation wizard.
The design scope is one existing verified signed-contract card plus a proposed
secondary `Analyser le contrat` action and a review surface below that card.

The review surface should show:

1. `Suggestions à vérifier` heading and explicit AI/OCR uncertainty copy;
2. exact analysed document/version and a stale-version warning when applicable;
3. one row/card per allowlisted suggestion with field label, current value,
   detected value, confidence text, source page, and bounded evidence;
4. explicit `Conserver la valeur actuelle` or `Utiliser la suggestion` choice;
5. a summary of selected changes and a future apply action;
6. clear disclosure that nothing is saved until OWNER confirmation and normal
   employee validation succeeds.

Phase 1, if approved later, uses typed fictional suggestions and keeps analysis
and apply disabled or explicitly `Aperçu sans analyse`. It must not read the
current PDF or simulate a successful provider call.

### States and truthful behavior

Design ready, pending, partial result, no detected field, unsupported/image-only
PDF, provider unavailable, stale document, employee conflict, forbidden,
validation failure, apply pending, success, and retry. Current document access
and download remain usable when extraction fails. No state says `Vérifié par
l’IA`, `Conforme`, or claims legal accuracy.

Selecting a suggestion must not save it. Confidence needs text and cannot be
the only selection rule. Evidence stays collapsed by default on narrow screens
but remains keyboard accessible. Error recovery preserves reviewed choices only
when the document version and employee revision are unchanged.

### Responsive and accessibility scope

Study the containing drawer at 1440 x 1000, 1024 x 768, 768 x 1024, and
390 x 844. Desktop/tablet may use aligned comparison columns; mobile uses
stacked field cards in the same order. Current/detected values, confidence,
source page, and choice labels must wrap without horizontal scrolling.

Use 44 px touch targets, visible focus, keyboard-operable choices, textual
pending/error feedback, live-region save outcomes, and focus return to the
originating analysis/apply action after dialogs close. Do not hide source or
uncertainty behind hover.

### Forbidden visual inference

No chat composer, model selector, prompt editor, token/cost dashboard, batch
queue, background notification, identity-document upload, camera, amendment
merge, register update, automatic checkbox selection, automatic save, payroll,
Formalités, DPAE/DSN, public link, sharing, e-signature, or production-ready
badge. The design is presentation discovery only.

## Wave F Phase 1 — local typed-fixture prototype

Status: `IMPLEMENTED LOCALLY — NO REAL ANALYSIS OR APPLY`.

The signed base-contract card keeps `Consulter` and `Télécharger` and adds the
development-only secondary action `Analyser le contrat`. The action reveals an
in-place panel clearly labelled `Aperçu — aucune analyse réelle` and
`Prototype avec données fictives`. It never appears on an amendment.

The panel renders the three approved fictional suggestions with textual
confidence, page, collapsed fictional evidence, and keyboard-operable keep/use
choices. Choices update only the local summary. Nothing is preselected and
`Appliquer les champs sélectionnés — Prototype` remains disabled even after a
choice. Planned non-ready states are listed as design coverage, not simulated
provider outcomes.

Browser verification at 1440, 1024, 768, and 390 px reports no page or prototype
horizontal overflow. At narrow widths, comparisons and decisions stack and
retain 44 px touch targets.

## Wave F Phase 2 — approved-direction interaction specification

Status: `IMPLEMENTED LOCALLY WITH SYNTHETIC PDF — PRODUCTION BLOCKED`.

### Start and pending

- `Analyser le contrat` remains a secondary action on the available signed base contract only.
- Starting a future request changes that action to a textual pending state and prevents a second concurrent request.
- `Consulter`, `Télécharger`, drawer close, and other employee tabs remain available.
- Pending copy progresses only through truthful coarse states such as
  `Préparation du document` and `Analyse en cours`; it never displays provider,
  model, token, prompt, or unsupported percentage claims.
- Closing the drawer asks no destructive confirmation because no employee change exists; transient results are discarded.

### Review

- Every suggestion begins undecided even when confidence is high.
- Current value, detected value, confidence, page, dependency/block reason, and evidence remain visible or keyboard-expandable.
- Selecting `Conserver` or `Utiliser` changes only the transient summary.
- `Type de contrat` is visibly non-applicable when its required CDD date/reason dependencies are absent.
- The apply action becomes enabled only when at least one independently valid,
  supported suggestion is selected and no document/employee stale state exists.
- The first apply-capable UI fields are `Poste` and `Durée hebdomadaire`; other
  returned fields remain review-only until separately approved.

### Failure and recovery

- timeout/provider failure: show a bounded error and explicit `Réessayer`; retain view/download;
- partial result: show valid suggestions and count unresolved fields without inventing values;
- no result: explain that no supported field was detected;
- image-only/unsupported: explain that this processing path is unavailable;
- document stale: discard all suggestions and require a fresh analysis;
- employee conflict: preserve no apply-ready state; reload current employee and require re-review;
- validation failure: identify the affected field/dependency without exposing provider internals;
- rate limit: state when a later manual attempt is allowed, without an automatic retry countdown unless the server supplies one.

After successful apply, close the extraction review, refresh the employee
summary/detail, show the normal persisted success message, and restore focus to
the signed-contract analysis action. The register and document metadata do not
change.

Phase 4 hardening makes conflict invalidation concrete: an employee/document
revision change or apply conflict clears the active request, all choices, and
the review result, then shows a retry message. The local scenario selector and
radio groups remain controlled for their complete component lifetime. French
user-facing copy describes a local fictional-data test and does not expose
internal delivery-phase names.

## Wave F Phase 5 — as-built responsive state

The completed local review preserves the existing wide employee drawer. At
1440 and 1024 px, document actions and the review use the available width. At
768 px the drawer fills the viewport and review decisions stack when needed.
At 390 px the dossier tabs remain horizontally scrollable, the document actions
become full-width rows, and every review card stays within the drawer.

Signed-in captures at 1440 x 1000, 1024 x 768, 768 x 1024, and 390 x 844 show
the complete synthetic result state. Page and review widths do not overflow;
the console has no warning/error. Closing the review returns keyboard focus to
`Analyser le contrat`. This visual evidence does not represent real PDF
analysis or production readiness.

## Wave G Phase 0 — UI discovery scope

Wave G Phase 0 requires no new visual design. The approved Wave F Documents
review already contains the required ready, pending, partial, unsupported,
failure, timeout, retry, transient review, apply, stale, conflict, and synthetic
disclosure states. A provider/model selector, prompt editor, OCR engine label,
token counter, cost display, regional-processing badge, or technical eval panel
must not appear in the restaurant UI.

Any later synthetic provider evaluation is an engineering activity behind the
existing server adapter. The restaurant-facing wording remains provider-
neutral. If a future real-file flow requires a new employee disclosure or
consent/information state, that state must receive separate product, privacy,
and design approval before implementation.

Design prompt status: `NOT_APPLICABLE`. Reuse the Wave F approved/as-built UI;
do not run ImageGen or create a new visual reference for Phase 0.

## Wave G Phase 6 — unchanged restaurant UI

The development Luna/v4 integration stays behind the existing provider-neutral
Documents review. The visible flow, French wording, states, responsive layout,
and explicit fictional-data disclosure remain unchanged. No provider/model,
prompt, token, cost, account, or production control is added to the UI.

## Wave G Phase 7 — fictional PDF choice

The development review opens idle and clearly states that no external request
starts before an explicit click. A compact file field accepts an optional PDF
up to 750 KiB. When no file is selected, the existing generated fixture remains
the source. When a file is selected, the UI shows its filename, requires an
unchecked fictional-only confirmation, locks the scenario to `complete`, and
disables analysis until confirmation. OWNER can return to the generated PDF.

Wording must say that the selected PDF is transmitted to the configured
analysis service, is not saved in YUTA Documents, and must contain no real
employee data. It remains provider-neutral and exposes no model, prompt, token,
cost, account, or production control.

## Wave G Phase 8 — stored fictional contract offline state

Status: `IMPLEMENTED IN DEVELOPMENT; ONE PROVIDER QA COMPLETE`.

Reuse the existing Documents card and review rather than introducing another
screen or design language. When the current signed contract has a valid
server-owned fictional-fixture eligibility result, the development source
choice may add `Contrat fictif enregistré` alongside the generated fixture and
local fictional upload. Its supporting copy states that YUTA will verify and
analyze the current stored test contract through an offline simulation after an
explicit click. It must not imply that an arbitrary stored contract is eligible
or that an external request occurs.

When eligibility is absent, expired, stale, or invalid, the stored source is not
selectable and the UI explains that only a YUTA-registered fictional contract
can be used in this development test. A replaced contract clears the choice and
review. Missing storage, hash mismatch, validation failure, provider failure,
and timeout use the existing bounded unavailable/retry states without exposing
storage keys, hashes, provider identifiers, or technical configuration.

No new visual reference or ImageGen prompt was required. Phase 7 already
established the compact source choice and explicit start interaction. Phase 8
adds an eligibility loading message, disabled unavailable state, selected-source
badge, explicit offline disclosure, and source-specific analysis label.

For the separately approved one-request QA only, eligibility also returned a
temporary `provider_once` display mode. Before the click, the badge and alert
explicitly stated that the entirely fictional stored PDF would be sent once to
OpenAI with Luna/v4 and that no value would be applied automatically. After the
request, the server was restarted without this mode, restoring the offline
copy. No provider/model control is exposed to the restaurant user.

Signed-in offline QA confirms the eligible stored source, selected badge,
offline disclosure, ready review, and expected two-page suggestions. At 390 px,
the page and employee drawer have no horizontal overflow and the stored-source
control remains visible. Browser logs contain no warning/error. A separate
production-hidden recheck remains part of any later provider-QA approval.

## F02 Phase 1 — current create UI

Status: `IMPLEMENTED — AUTHENTICATED FICTIONAL BASELINE CAPTURED`.

### Current implemented UI

`Ajouter un salarié` opens one scrollable dialog over the existing Salariés
page. It contains two sections, `Identité minimale` and `Relation de travail`,
with the current required inputs. Selecting CDD reveals `Fin prévue du CDD` and
`Motif du CDD`. A possible duplicate inserts a warning, scoped candidate list,
and required reason without replacing the entered values. Pending disables the
submit action; validation and service errors remain inside the dialog; a
committed success refreshes the page, shows the bounded success message, and
offers close or full-dossier actions.

The dialog is separate from the dossier drawer. It does not upload documents,
save an onboarding draft, open Formalités, create a register inscription, or
expose tenant scope.

### Implemented Phase 1 behavior

- preserve the current single-dialog hierarchy and every current field;
- retain conditional CDD and duplicate-review sections in place;
- add no wizard, stepper, document drop zone, remuneration, probation,
  apprenticeship, work-permit, or Formalités section;
- when input has changed, confirm before closing and losing it;
- after committed success, show `Le dossier minimum a été créé.` with a deliberate
  `Ouvrir le dossier` action and a secondary close action; and
- do not auto-navigate, because the OWNER must remain in control and the list
  refresh is still useful.

### F02 as-built baseline

Authenticated OWNER QA on 2026-08-23 captured the current dialog at 1440,
1024, 768, and 390 CSS pixels after the CDD reason and contractual weekly-
duration changes. Additional captures prove the duplicate, committed-success,
and dirty-close states. Interactive QA also proves the CDD branch and the full-
dossier destination. Validation, pending, error/retry, and idempotency remain
covered by the existing action/repository behavior and tests; unsupported
screenshots were not fabricated.

At every captured width, the document and visible dialog have matching client
and scroll widths. The browser reported no warning/error. The baseline contains
only fictional LUNA data and is current as-built evidence, not production
approval or authority for additional fields.

## F03 Phase 0 — current manage-dossier UI

Status: `PHASE 1 IMPLEMENTED; AUTHENTICATED FICTIONAL QA COMPLETE`.

`Modifier` opens the same scrollable dialog from the selected desktop quick
view and the full dossier page. The dialog contains `Identité minimale` and
`Relation de travail`; choosing CDD reveals the expected end date and controlled
reason, while changing a recorded CDD to CDI requires explicit confirmation
before clearing its reason. The dialog deliberately excludes departure,
documents, payroll, and Formalités.

Current truthful states are pending, field validation, general save error,
idempotency-key conflict, revision conflict with `Recharger la version
actuelle`, no-change success, and committed success. A successful save closes
only the editor, keeps the quick view or full dossier context, updates visible
facts, refreshes the route, and presents a success message.

Phase 1 closes the confirmed unsaved-close gap. The cancel button, Escape,
backdrop, and close control now open `Abandonner les modifications ?` when any
editable value differs from the currently loaded summary. `Continuer la
modification` preserves the draft; `Abandonner` closes without a write.
Untouched values and values changed then restored close immediately. The
interaction reuses the F02 confirmation pattern without changing layout,
fields, validation, or mutation semantics.

Existing Wave C references remain valid for the dossier shell, tabs, identity,
and employment display. They do not prove the current edit-dialog states. F03
baseline status is now `CAPTURED 2026-08-23`: authenticated fictional QA stores
the editor at 1440, 1024, 768, and 390 CSS pixels plus the mobile dirty-close
state. Page and dialog client/scroll widths match at every viewport, and the
browser has no warning/error. No new design-generation prompt was needed.

## F04 Phase 0 — current-contract view UI

Status: `PHASE 1 IMPLEMENTED; FICTIONAL QA COMPLETE`.

F04 reuses the current full employee dossier. The structured view remains in
`Relation de travail`; the signed base contract and signed amendments remain in
`Documents`. Do not add a contract page, duplicate tab, quick-view contract
editor, document preview inside the structured card, or another mutation.

The truthful structured summary may show only repository-backed facts: CDI or
CDD, expected CDD end date and controlled reason when applicable, full-time or
part-time category, contractual weekly duration, entry date, position, and
qualification. Labels and helper text must distinguish declared dossier facts
from signed-document evidence and must not claim legal completeness.

Existing Wave C employment and Documents as-built references provide the
containing-surface baseline. No new design-generation prompt was needed. Phase
1 corrects the stale helper text without implying contract generation, legal
validation, or production availability. It says that declared information may
be reused to prepare a formality and directs signed-contract viewing to
`Documents` when such a file exists. The layout, navigation, fields, and actions
are unchanged.

## F05 Phase 0 — current Documents UI

Status: `PHASE 1 READ-ONLY FICTIONAL REGRESSION COMPLETE`.

F05 reuses the existing full-dossier `Documents` tab. Keep the signed base
contract first and the separate `Avenants signés` section below it. Do not add a
document-vault page, document-category picker, general upload area, validity
dashboard, signature workflow, or cross-employee document browser.

The base section truthfully supports loading, unavailable/retry, no signed
contract, add, file selected, verification pending, validation/scanner failure,
revision or idempotency conflict, success, available card, replace, view, and
download. The amendment section separately supports loading, unavailable/retry,
empty, add, replace, validation/conflict/success, ten-item pagination, view, and
download. Every card displays only bounded filename, PDF size, current version,
upload date, and availability; amendments additionally show effective date and
optional reference.

`Remplacer` must remain unambiguous: for the base it replaces the current base
scan after verification; for an amendment it corrects only the selected
amendment scan. Missing base-contract copy must stay separate from employee-
dossier completeness, and an empty amendment list must not be presented as a
problem.

Existing Documents Wave A and Wave B as-built references remain the design
authority. F05 is `EXISTING_CAPABILITY_RENEWAL`; no new design-generation prompt
was needed. Phase 1 verified current available-base and missing-base states at
desktop width, the missing state at 390 px, the empty-amendment state, and clean
browser logs. The populated-amendment state remains supported by existing
as-built evidence because creating another amendment solely for QA was forbidden.
Wave F/G controls remain separately gated and do not redefine F05.

## F06 Phase 0 — current alert-resolution UI

F06 reuses the existing integrated surfaces. The `Dossiers à compléter` metric
is display-only; the separate completeness selector owns the current minimum-
dossier list filter. The development-only `À traiter` card remains between the
metrics and the employee list; it is not promoted to a page, tab, drawer,
modal, or KPI.

The card has two semantic groups:

- `À corriger`: `Dossier incomplet` with `Compléter le dossier`, and `Contrat
signé manquant` with `Ajouter le contrat`;
- `Échéances proches`: a dated departure with `Voir le départ`.

Opening an action has a pending state while the server resolves the current
target. A current item opens the existing employee surface at the relevant
context. A stale item displays the existing changed-state notice and refreshes
the overview. The overview owns no mutation success state because resolution
belongs to the underlying F03, F05, or departure flow.

Preserve the current loading, empty, full-error/retry, document-source partial
warning, source refresh, independent previous/next pagination, action pending,
stale-item notice, focus restoration, responsive stacking, and accessible-name
behavior. At narrow widths, each action stays full-width and no horizontal
overflow is allowed.

Do not add resolved checkboxes, dismiss/snooze controls, counts, urgency scores,
priorities, assignees, comments, notifications, unsupported alert labels, file
details, legal-completeness claims, manager views, or production disclosure.
No new visual design prompt is needed: the selected Wave D as-built surface is
the current authority.

### F06 Phase 1 as-built regression

Current fictional LUNA data rendered zero incomplete dossiers, five missing-
base actions on page one, five on page two, and an empty departure group. The
existing `Ajouter le contrat` action opened the correct employee Documents tab
and visible protected add form. Closing restored focus to the action. No file
was selected or submitted.

At 390 px, the page and `À traiter` card had matching client/scroll widths and
all five actions remained visible. Browser logs were clean. Missing current
incomplete/departure, partial/error, and stale states were not fabricated;
existing Wave D references and tests remain their truthful evidence.

## F07 Phase 0 — current employee-history UI

The existing `Historique` tab is shared by the quick-view drawer and full
dossier. It loads only when selected and renders `Historique du dossier` with
loading, error/retry, truthful empty, populated, and truncated states.

Each current row shows:

- a localized event label;
- occurrence date/time;
- actor display name or `Utilisateur supprimé`;
- allowlisted changed-field labels when present;
- previous/new departure dates when present; and
- a reason only when safely exposed by the current departure/duplicate event.

The UI does not show old/new values for ordinary identity or employment edits,
revision numbers, operation grouping, effective dates, raw metadata, document
names/content, prompts, excerpts, IP/user-agent data, or generic auth events.
`Consultations` remains a separate tab and must not be merged into business
change history.

The current 50-event limit uses a notice, not pagination. Do not invent a
`Voir tout`, filter, export, compare, restore, rollback, or “version actuelle”
snapshot control. Do not imply that two event rows from one save are distinct
user operations when the public contract does not expose grouping.

After a successful edit, the containing dossier refreshes current values but a
previously loaded history state is not explicitly invalidated. Record this as a
future coherence correction, not an authorized Phase 0 runtime change.

Existing Salariés as-built references remain sufficient for Phase 0. No new
design-generation prompt is required before the field-history policy matrix is
approved.

### F07 Phase 1 policy outcome

Phase 1 changes no UI. The current row remains an event/changed-field trace.
Future value-history candidates must not be mocked or labelled implemented.

If a later phase is authorized, one user save should be presented as one
operation even when identity and employment groups both change. Within that
operation, only approved coupled groups may later display previous/new values:
identity, role, contract term, or work time. Entry/departure corrections may
show their date transition and bounded reason under their separate approved
rules. Effective date must stay distinct from recorded-at time.

Do not add value diff, correction badge, effective-date label, baseline event,
compare/restore controls, pagination, or export until the matching data policy
and transport are separately approved. The smallest current-UI renewal remains
only invalidating/reloading `Historique` after a successful F03 edit.
