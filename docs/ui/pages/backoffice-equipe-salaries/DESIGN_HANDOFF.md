# Backoffice Équipe — Salariés — Design Handoff

Status: Approved visual direction

Visibility: Engineering

## Phase 0 source

The Implementation Inventory is in `README.md`. It identifies an authenticated
cloud Backoffice `NEW_PAGE`, intended `integrated`, for an establishment-scoped
minimum employee record. Documents, OCR, payroll, Formalités, and register/PDF
claims are excluded.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer       | Owner/source                                    | Status   | Reuse exactly                           | May adapt        | Excluded               |
| ----------- | ----------------------------------------------- | -------- | --------------------------------------- | ---------------- | ---------------------- |
| YUTA global | `@yuta/ui`, tokens, shared references           | APPROVED | Typography, semantic/component language | Page density     | Raw colors/new system  |
| Application | `BackofficeFrame`, navigation, Backoffice rules | APPROVED | Shell, tenant/account/session UI        | Content stacking | Shell redesign         |
| Section     | Équipe navigation and `equipe/layout.tsx`       | APPROVED | Real labels/routes                      | Page hierarchy   | Invented section shell |
| Page        | This package                                    | APPROVED | Approved Phase 1 visual constraints     | New composition  | Deferred capabilities  |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Sources: `backoffice-frame.tsx`, `backoffice-navigation.ts`,
`docs/ui/references/yuta-shell-brand-reference.png`, and Backoffice UI rules.
Preserve sidebar, topbar, tenant selector, account/sign-out, mobile navigation,
and footer. Real Équipe routes remain current planned routes; their presence
does not make them implemented. Do not invent a second sidebar, HR hub, account
area, cross-establishment selector, global tabs/search behavior, or new route.

### Curated design-tool bundle

- shared shell/brand image above;
- current shell/navigation implementation;
- shared and Backoffice frontend rules;
- this package's scope, UI, and data/interaction documents;
- relevant `@yuta/ui` visual language and semantic roles;
- Backoffice viewports: 1440, 1024, 768, and 390 px.

## Current baseline capture

Baseline status: `NOT_APPLICABLE`

At Phase 0 no employee-management screen existed; the placeholder supplied
route/shell context but was not a capability baseline. The approved design has
since been implemented for the development MVP. The prompt below is retained
as historical design input, not as a statement of current runtime capability.

## Design-generation prompt

Design prompt status: `READY`

Running this prompt was a separate approval gate. New output starts as `DRAFT`;
the reviewed stored references are now `APPROVED` visual direction.

### Ready-to-use prompt

```text
Create responsive design images and brief annotations, not implementation code,
for YUTA authenticated Backoffice route `/equipe/salaries`.

This is a NEW_PAGE discovery proposal. No employee backend, persistence,
mutation, HR permission, document storage, OCR, Formalités, register, or PDF
engine exists. Use fictional typed-fixture examples, label output DRAFT, and do
not imply production persistence.

Use shell mode REUSE_APPROVED_SHARED_SHELL. Reuse the supplied current
Backoffice sidebar, topbar, tenant selector, account/sign-out area, mobile
drawer, footer, active navigation, and YUTA shell/brand reference exactly. Do
not invent a second sidebar, HR hub, global tabs, account area, cross-
establishment selector, navigation item, route, or shared search behavior.

Primary operator: restaurant owner responsible for personnel management. Show
manager access only as explicitly personnel-authorized and include a truthful
STAFF-forbidden state. All examples belong to the selected establishment.
Never imply POS/local staff reuse. Users/memberships are not employees.

MVP job: maintain a minimum operational employee and employment relationship,
not payroll, Planning, Pointage, Formalités, documents, or a compliant
electronic personnel register.

Explore:
1. Header `Salariés`, concise description, `Ajouter un salarié`.
2. Compact actionable active/upcoming/incomplete summary, not a decorative dashboard.
3. Search and practical filters.
4. `Actifs`, `Entrées à venir`, `Anciens salariés`.
5. Responsive list with fictional name, poste, qualification, minimal contract
   summary, entry/relevant end date, and explainable completeness.
6. Detail: `Vue d'ensemble`, `Identité`, `Relation de travail`, `Historique`.
7. Progressive manual add/edit flow.
8. Non-destructive departure confirmation with effective date and retention copy.

Derive active/upcoming/former from dates. Show only minimum identity, poste,
qualification, dates, minimal contract summary, full/part-time, and actionable
completeness. Do not show NIR, RIB, scans, work titles, signed contracts,
remuneration, medical/disciplinary information, apprenticeship, interns,
payroll, OCR, uploads, export, contract generation, Formalités, DPAE/DSN, PDF,
register controls, or legal-compliance claims.

Show loading, empty, forbidden, validation with preserved values, conflict,
pending, prototype success, load/save error with retry, and active/upcoming/
former/incomplete studies.

Use French copy, Geist Sans with Inter/sans-serif fallback, YUTA semantic roles,
current card/list/table/badge/button/form/dialog/alert/state patterns, and
Lucide-style icons. No raw hex colors or new component system. Require text-
backed statuses, visible focus, labels/errors, dialog focus, no hover-only
meaning, and no horizontal overflow.

Return desktop and mobile images for review at 1440, 1024, 768, and 390 px plus
brief hierarchy/responsive/state annotations. Mobile should use scannable cards
rather than force a wide table. Label everything DRAFT. Success means the
shared shell is preserved, the MVP workflow is understandable, states are
truthful, accessibility/responsiveness are credible, and no deferred capability
appears.
```

## Handoff result

Generated draft references:

- `references/design-proposal-desktop-01.png` — desktop overview at a wide
  Backoffice viewport, including compact summaries, filters, employee table,
  and contained detail panel;
- `references/design-proposal-mobile-01.png` — mobile composition with the
  responsive topbar, compact metrics, filters, segmented views, and scannable
  employee cards.

Reference status is `APPROVED` for Phase 1 visual direction. The first desktop generation was rejected because
it invented navigation and an unapproved manager field. The stored desktop
reference is the corrected iteration: it uses the repository's real navigation
labels and removes that field.

Both images are composition studies. Raster names, dates, counts, qualification
labels, contract labels, establishment/account examples, and generated copy are
fictional/non-authoritative. Repository data, approved contracts, permissions,
French copy, and shared shell implementation override raster content.

Product-owner review approved the hierarchy, density, responsive behavior,
action priority, and state treatment on 2026-08-13. Repository rules and the
selective feedback audit remain authoritative over generated details.

## Documents capability Phase 0 handoff

Capability mode: `NEW_CAPABILITY_DISCOVERY`

Capability scope status: `APPROVED FOR PHASE 1 PROTOTYPE ONLY`

Documents design prompt status: `EXECUTED — REFERENCES APPROVED FOR PHASE 1`

The containing `/equipe/salaries` page is integrated, but the `Documents`
surface and its cloud storage/domain do not exist. The design target is a new
tab/flow inside the current explicitly opened employee drawer, not a new page.
The current authenticated page was inspected on 2026-08-15 at
`http://localhost:3001/equipe/salaries` with the local OWNER LUNA session. It
confirmed the current overlay drawer, five tabs, former-employee state, and no
Documents tab. Because the target surface itself is absent, its baseline status
is `NOT_APPLICABLE`; the containing page and approved references supply context.

### Documents curated design-tool bundle

- the current authenticated `/equipe/salaries` drawer and implemented tab order;
- `references/design-proposal-desktop-01.png` and
  `references/design-proposal-mobile-01.png` for approved page composition only;
- `UI_SPEC.md`, the Documents Phase 0 sections in `PRODUCT_SCOPE.md` and
  `DATA_AND_INTERACTION_SPEC.md`, and the current Backoffice UI rules;
- `@yuta/ui` semantic component language, Geist Sans, and Lucide-style icons;
- exact shell mode `REUSE_APPROVED_SHARED_SHELL` and viewports 1440, 1024, 768,
  and 390 px.

### Ready-to-run Documents design prompt

```text
Create responsive DRAFT design images and short annotations, not implementation
code, for a new `Documents` tab inside the existing employee dossier drawer on
YUTA Backoffice route `/equipe/salaries`.

This is NEW_CAPABILITY_DISCOVERY inside an integrated existing page. No cloud
employee-document table, contract, permission, API, private object-storage
adapter, malware-processing flow, upload/download action, OCR service, or
document test currently exists. Do not imply that files are persisted or that
the capability is already available.

Preserve the supplied current Backoffice shell and current Salaries page exactly:
sidebar/topbar, tenant and account controls, explicitly opened right overlay
drawer, employee dossier header/status/actions, responsive width, and existing
tabs `Vue d'ensemble`, `Identité`, `Relation de travail`, `Historique`, and
`Consultations`. Add `Documents` as the sixth dossier tab for exploration only.
Do not redesign the shell, employee list, create/edit/departure flows, or invent
a new route, HR hub, global document library, organization-wide selector, or
second drawer.

Primary operator: OWNER of the currently selected establishment. MANAGER,
STAFF, employee self-service, public users, service actors, and cross-
establishment access are denied in this proposal. Show an OWNER-forbidden study
without leaking employee or document metadata. Every example belongs only to
the selected employee dossier and establishment.

Explore the smallest proposed MVP:
1. An empty `Documents` tab with concise privacy copy and one primary
   `Ajouter un document` action.
2. A compact populated list using fictional neutral categories approved only
   for design study, such as an employment supporting document and applicable
   work-authorization evidence. Do not present category examples as legal
   requirements.
3. Safe visible metadata: localized category label, sanitized filename,
   verified type/size, upload date, availability state, and optional relevant
   or expiry date only when the example clearly says the category supports it.
4. Restrained per-row actions: `Consulter` or `Télécharger`, and `Remplacer`.
5. Add/replace dialog with category selection, file picker, explicit limits/help,
   upload progress, security processing, validation rejection, retry, conflict,
   and persisted-success studies.
6. Truthful states: loading, empty, forbidden, upload pending, processing,
   available, rejected, unavailable, service failure, expired download link,
   retry, and success. A file is not available while still uploading or being
   security-processed.

Replacement must look deliberate and must not imply silent overwrite. Do not
show document deletion, archive/legal-hold administration, public/share links,
email delivery, bulk import/export, ZIP download, camera scanning, OCR,
automatic extraction/prefill, AI classification, e-signature, contract
generation, Formalités, DPAE/DSN, payroll, RIB, NIR/social-security data,
medical or disciplinary material, manager delegation, or employee self-service.
Do not show missing/expiry alert dashboards before a real category requirement
and resolving action exist.

Use French user-facing copy, Geist Sans, current YUTA semantic roles and
Card/Badge/Button/Dialog/Alert/Tabs patterns, and Lucide-style icons. Use no raw
hex colors, gradients, glassmorphism, or new component system. Keep visible
focus, labels and connected errors, keyboard-safe dialogs, text-backed statuses,
long-filename truncation with accessible full name, and no hover-only meaning.

Return desktop and mobile studies for 1440, 1024, 768, and 390 px. At desktop,
keep the current drawer width and avoid shrinking the employee list beneath it.
At tablet/mobile, use the existing full-width drawer, stack metadata and actions,
keep file controls reachable, and prevent horizontal overflow. Label all output
DRAFT. Success means the proposal fits the current drawer, shows honest file
states, protects sensitive data boundaries, and does not invent backend,
authorization, storage, legal requirements, or deferred capabilities.
```

The prompt stopped after draft image generation. Product review then approved
the hierarchy, category examples, action priority, copy, responsive behavior,
and state treatment before the Phase 1 prototype was built.

### Documents prompt execution result

The product owner approved Phase 0 and authorized prompt execution on
2026-08-15. Built-in image generation produced these responsive references:

- `references/documents-design-proposal-desktop-01.png` — wide desktop drawer;
- `references/documents-design-proposal-tablet-1024-01.png` — compact desktop/tablet;
- `references/documents-design-proposal-tablet-768-01.png` — tablet portrait;
- `references/documents-design-proposal-mobile-01.png` — 390 px mobile composition.

The references consistently preserve the dossier header/actions, existing five
tabs, sixth active `Documents` tab, OWNER-focused add/view/replace actions,
available/processing states, category caveat, and deferred-capability boundary.
The product owner approved their hierarchy, actions, fictional category
examples, copy, state treatment, and responsive direction for a typed-fixture
Phase 1 prototype. They remain design evidence only and do not authorize a real
document capability.

After in-app review, the product owner requested more working room than the
historical 48 rem baseline. The approved as-built adjustment caps the drawer at
60 rem on wide screens, allows up to 88% of the viewport at 1024 px, and keeps
the drawer full-width at 768 px and below.

## Documents Wave B Phase 0 handoff — signed amendments

Capability mode: `NEW_CAPABILITY_DISCOVERY`

Capability scope status: `APPROVED FOR PHASE 1 PROTOTYPE ONLY`

Design prompt status: `EXECUTED — REFERENCES APPROVED FOR PHASE 1`

The containing `/equipe/salaries` page and Documents tab are integrated locally.
The amendment flow itself is absent, so its capability baseline is
`NOT_APPLICABLE`. Current as-built evidence is supplied by:

- `references/documents-phase-5-as-built-1024x768.png`;
- `references/documents-phase-5-as-built-768x1024.png`;
- `references/documents-phase-5-as-built-390x844.png`.

Shell mode remains `REUSE_APPROVED_SHARED_SHELL`. The design must preserve the
Backoffice shell, Salaries list, explicit-open dossier drawer, employee header,
actions, existing tab order, protected-access notice, signed-contract section,
and current responsive widths. No shared shell or navigation work is in scope.

### Ready-to-run signed-amendments design prompt

```text
Create responsive DRAFT design images and short annotations, not implementation
code, for a new signed-contract-amendments flow inside the existing `Documents`
tab of the employee dossier drawer on YUTA Backoffice route
`/equipe/salaries`.

This is NEW_CAPABILITY_DISCOVERY inside an integrated local-only Documents
surface. The current implementation supports only one category,
`Contrat de travail signé`, PDF up to 10 MiB. No amendment category, amendment
identifier, metadata fields, list behavior, schema value, contract, repository
mutation, or test exists. Do not imply that amendments are already persisted.

Use shell mode REUSE_APPROVED_SHARED_SHELL. Preserve the supplied Backoffice
shell and current Salaries drawer exactly: employee identity/status/actions,
tab order with `Documents` active, current drawer widths, `Accès protégé`
notice, signed-contract card, French file-picker pattern, and server-mediated
`Consulter`/`Télécharger` behavior. Do not redesign the employee list, shell,
navigation, account/establishment controls, or create another route, document
library, drawer, or HR hub.

Primary operator: OWNER of the active establishment. MANAGER, STAFF, employee
self-service, public users, and service actors are denied. Every fictional item
belongs only to the selected employee dossier and establishment. Include a
non-disclosing forbidden study.

Explore the smallest proposed local MVP:
1. Keep the existing `Contrat de travail signé` area distinct.
2. Add a separate `Avenants signés` area that can contain zero or more items.
3. Show an empty state with one `Ajouter un avenant` action.
4. Show compact fictional amendment rows/cards with a neutral display label,
   sanitized filename, PDF size, availability, upload date, and a clearly
   labelled proposed effective date for chronological discovery.
5. Provide restrained per-amendment `Consulter`, `Télécharger`, and deliberate
   `Remplacer` actions.
6. Reuse the current PDF-only, 10 MiB file picker as proposal copy.
7. Show loading, empty, forbidden, validation with preserved input, uploading,
   security processing, rejected, unavailable, conflict, success, and retry.

Treat every later legal amendment as its own document. Never show it replacing
the base contract or another amendment. `Remplacer` means correcting the scan
of that same amendment while preserving version history. Do not infer or update
salary, work time, role, dates, contract type, or any structured employee field
from PDF content.

Effective date, signature date, amendment number, required/optional status,
ordering rules, completeness, and retention are product/legal decisions. The
design may label effective date as a proposal for review but must not present
it as approved law, schema, or validation. Do not invent free-form sensitive
descriptions.

Do not show generation/editing, clause templates, e-signature, Formalités,
DPAE/DSN, email delivery, OCR, extracted fields, AI classification, automatic
record updates, missing/expiry alerts, delete/archive/legal hold, rights tools,
bulk import/export, ZIP, share/public links, manager delegation, employee
self-service, production provider details, or other document categories.

Use French copy, Geist Sans, YUTA semantic roles and existing
Card/Badge/Button/Alert/form patterns, and Lucide-style icons. Use no raw hex
colors, gradients, glassmorphism, or new component system. Keep visible focus,
connected labels/errors, text-backed states, touch-sized actions, long filename
truncation with accessible full text, and no hover-only meaning.

Return studies at 1440, 1024, 768, and 390 px. Preserve the current 60 rem wide
drawer cap, up to 88% at 1024, and full-width drawer at 768/390. Stack amendment
metadata/actions without page overflow; horizontal scrolling remains limited
to the existing dossier-tab navigation where needed. Label every output DRAFT.
Success means the distinction between base contract, distinct amendments, and
correction versions is obvious without inventing backend, legal, or production
capability.
```

The product owner approved Phase 0 and authorized prompt execution on
2026-08-15. Built-in ImageGen produced:

- `references/documents-wave-b-design-draft-desktop-1440-02.png`;
- `references/documents-wave-b-design-draft-tablet-1024-01.png`;
- `references/documents-wave-b-design-draft-tablet-768-01.png`;
- `references/documents-wave-b-design-draft-mobile-390-01.png`.

The first desktop output was revised to remove redundant row chevrons, and the
first mobile output was revised to remove a redundant three-dot menu while
keeping the three visible amendment actions. The product owner approved the
selected four references and a typed-fixture local Phase 1 prototype on
2026-08-15. They do not authorize schema, contracts, migrations, permissions,
storage, real file actions, or data implementation.

## Wave C Phase 0 handoff — complementary employment facts

Status: `EXECUTED — DRAFT REFERENCES AWAITING REVIEW`

Wave C is `NEW_CAPABILITY_DISCOVERY` within the integrated Salaries dossier.
Use `REUSE_APPROVED_SHARED_SHELL`: the Backoffice shell, Salaries list, employee
drawer, employee header/actions, existing tabs, and current `Relation de
travail` content remain authoritative. Generated references may explore
presentation only; they cannot approve fields, enums, validation, permissions,
persistence, or a Formalités workflow.

### Ready-to-run Wave C design prompt

```text
Create responsive DRAFT design images and short annotations, not implementation
code, for Wave C inside the existing employee dossier drawer on YUTA
Backoffice route `/equipe/salaries`.

This is NEW_CAPABILITY_DISCOVERY for complementary employment facts within an
already integrated page. Reuse the approved Backoffice shell and current
Salaries employee drawer. Preserve the employee identity/status/actions, tab
order, current responsive drawer widths, and existing real content in the
`Relation de travail` tab. Do not redesign the shell, navigation, employee
list, KPIs, drawer header, or create another route, tab, HR hub, or Formalités
page.

Primary operator: OWNER of the active establishment. MANAGER, STAFF, employee
self-service, public users, and service actors are denied. Every example
belongs to the selected organization + establishment + employee dossier. Show
a non-disclosing forbidden study.

Explore only a clearly separated section named `Informations contractuelles
complémentaires` with two proposed facts:
1. `Motif du CDD`, using a controlled-choice pattern only when the existing
   contract is CDD and a clear not-applicable presentation for CDI. Labels are
   fictional discovery examples, not an approved enum. Do not use free text or
   identify a replaced employee.
2. `Durée hebdomadaire contractuelle`, displayed in hours per week. Do not
   derive it from `Temps plein`/`Temps partiel`, Planning, Pointage, a document,
   or an uploaded filename.

Keep the existing contract type, expected end date, work-time category, entry
date, departure date, and revision authoritative. Show present, missing,
not-applicable, loading, forbidden, validation with preserved input, pending,
conflict, save failure with retry, and success proposals. Mark edit and success
states DRAFT because no persistence is approved. A neutral message may say
that Formalités is not yet available, but include no link, status, badge,
generated document, or action.

Do not show remuneration, payroll, bank/tax/social-security data, probation,
probation renewal, detailed part-time distribution, apprenticeship, schedule
generation, Formalités templates/clauses/status/generation/e-signature,
DPAE/DSN, provider or government submission, alerts, register/PDF, OCR,
extraction, automatic employee updates, manager delegation, employee
self-service, transfer, merge, public sharing, or production claims.

Use French UI copy, Geist Sans, existing YUTA semantic roles and current
Card/Badge/Button/Alert/form patterns, and Lucide-style icons. Use no raw hex
colors, gradients, glassmorphism, or new component system. Preserve keyboard
operation, visible focus, connected labels/errors, text-backed states, touch
targets, and truthful disabled/pending behavior.

Return DRAFT studies at 1440, 1024, 768, and 390 px. Stack fields and actions
safely at narrow widths, avoid page/drawer overflow, and retain the current
dossier-tab horizontal scrolling behavior where needed. Success means OWNER
can understand the two proposed reusable facts and their missing/not-applicable
states without implying that Formalités, persistence, or sensitive deferred
data already exists.
```

The product owner approved the Phase 0 MVP, boundary, deferred list, and prompt
execution on 2026-08-16. Built-in ImageGen produced four selected DRAFT
references:

- `references/wave-c-design-draft-desktop-1440-01.png`;
- `references/wave-c-design-draft-tablet-1024-01.png`;
- `references/wave-c-design-draft-tablet-768-01.png`;
- `references/wave-c-design-draft-mobile-390-01.png`.

The first desktop generation was revised before selection: the duplicate local
edit button was removed, complementary values became read-only by default, and
the `Motif du CDD` label was corrected. The existing header `Modifier` action is
now the only edit entry point in every selected study. These references remain
DRAFT presentation evidence. The product owner approved them for a route-local
Phase 1 prototype on 2026-08-16. That approval does not authorize schema,
migration, contract, API, permission, repository, action, or real data.

## Wave D Phase 0 handoff — `À traiter`

Status: `EXECUTED — VISUAL DIRECTION APPROVED FOR PHASE 1 PROTOTYPE`

Wave D is a new `SURFACE + FLOW` inside the integrated Salaries page and uses
`NEW_CAPABILITY_DISCOVERY`. The capability itself has no baseline. The current
signed-in containing page and drawer are evidenced by the Wave C Phase 5
as-built captures, including the later `Identité` / `Relation de travail`
visual-correction set under `references/`.

### Shared context and shell decision

| Layer       | Authority/input                                                             | Decision |
| ----------- | --------------------------------------------------------------------------- | -------- |
| YUTA global | shared frontend rules, Geist Sans, semantic tokens, `@yuta/ui`, Lucide      | reuse    |
| Backoffice  | authenticated shell, sidebar, topbar, establishment selector, OWNER session | preserve |
| Équipe      | current navigation labels and planned route boundaries                      | preserve |
| Salariés    | header, three metrics, filters/list, drawer, actions, responsive as-built   | preserve |
| Wave D      | proposed compact `À traiter` surface and DRAFT states only                  | explore  |

Exact shell/navigation mode: `REUSE_APPROVED_SHARED_SHELL`. Do not create or
redesign shell/navigation, add an HR dashboard, add another route/tab, or alter
the existing three metrics.

### Curated design input

Provide the design tool with:

- the current 1440/1024/768/390 Wave C Phase 5 as-built captures;
- `PRODUCT_SCOPE.md` Wave D boundary;
- `UI_SPEC.md` Wave D placement, state, responsive, and forbidden-inference rules;
- `DATA_AND_INTERACTION_SPEC.md` derived source/action map;
- shared Backoffice/YUTA visual rules and semantic component constraints.

Generated employee names, counts, dates, issue examples, and contract presence
must be visibly fictional design evidence. They do not define a contract,
database, query, pagination rule, or legal requirement.

### Ready-to-run Wave D design prompt

```text
Create responsive DRAFT design images and short state/responsive annotations,
not implementation code, for a proposed `À traiter` surface inside the existing
YUTA Backoffice page `/equipe/salaries`.

This is NEW_CAPABILITY_DISCOVERY inside an already integrated, OWNER-only
employee page. Reuse the supplied current signed-in Salaries as-built exactly
for the shared Backoffice shell, page header, `Ajouter un salarié`, three summary
cards, search/filter/list, selected-row behavior, right overlay drawer, employee
header/actions/tabs, spacing, semantic colors, and responsive widths. Do not
redesign the shell, navigation, list, drawer, or existing flows.

Explore one compact section titled `À traiter` between the existing three-card
summary and the employee search/list area. Do not add a fourth KPI, new route,
sidebar item, page tab, drawer tab, notification bell, inbox, or HR dashboard.

Primary user: OWNER of the active establishment. MANAGER, STAFF, employee
self-service, public users, and service actors are denied. Every fictional item
belongs only to the selected organization + establishment + employee dossier.
Include a non-disclosing forbidden study with no employee names, counts, issue
types, dates, or existence signal.

Organize only these proposed MVP item families:

1. `À corriger`
   - `Dossier incomplet` for an active or upcoming employee, with one
     `Compléter le dossier` action opening the existing edit flow;
   - `Contrat signé manquant` for an active or upcoming employee, with one
     `Ajouter le contrat` action opening the existing protected Documents flow.
     Missing contract evidence must remain separate from dossier completeness.
2. `Échéances proches`
   - a recorded employee departure from today through the next five local
     calendar days, using text such as `Dernier jour`, `Départ demain`, or
     `Départ dans 5 jours`, plus the exact date and one `Voir le départ` action.
     Present this as an event to review, not an error.

Each item shows a fictional employee name, concise text-backed reason, optional
date, and exactly one supported action. Actions navigate into existing flows;
do not show a checkbox or local “completed” state. Use a small fictional set to
study density, but do not invent final pagination, infinite scrolling,
`Voir tout`, persisted priority, assignment, assignee, status, comment,
acknowledgement, dismiss, snooze, bulk action, or saved task.

Show DRAFT studies for:
- loading;
- ready with both groups;
- only correction items;
- only dated events;
- compact no-items treatment that does not reserve a large empty panel;
- document-source partial failure while employee-derived items remain truthful;
- complete failure with retry;
- forbidden with no data disclosure;
- return from an existing resolving flow followed by a refreshed derived view.

Do not imply polling, background jobs, scheduled notifications, email, SMS,
push, calendar delivery, or an outbox. A normal authorized page read recomputes
the overview. A source failure must never appear as a missing contract.

Do not show CDD expected-end alerts, missing amendments, document expiry,
Formalités status/deadlines/DPAE/DSN, generated documents, e-signature,
government/provider state, probation, training, medical/disciplinary, payroll,
remuneration, planning, pointage, register/PDF, OCR/extraction, manager
delegation, cross-establishment totals, global-person identity, or production /
legal-compliance claims.

Use French UI copy, Geist Sans, current YUTA semantic roles, existing
Card/Badge/Button/Alert/list/state patterns, and Lucide-style icons. Use no raw
hex colors, gradients, glassmorphism, new component library, or color-only
meaning. Preserve semantic headings/lists, visible focus, keyboard operation,
accessible action names including employee context, touch-sized actions, and
safe long-name wrapping/truncation.

Return DRAFT studies at 1440 x 1000, 1024 x 768, 768 x 1024, and 390 x 844. At
wide sizes, explore a restrained two-group composition that does not dominate
the employee list. At narrow sizes, stack groups/items/actions without page
overflow or nested horizontal scrolling. Preserve existing drawer-tab scrolling
only inside the drawer.

Success means the OWNER can quickly distinguish correctable issues from dated
events and enter only currently supported resolving flows, while the design
does not imply a task system, notification system, new data model, broader HR
scope, or production approval.
```

Stop after generated DRAFT review. Prompt execution does not authorize a typed
fixture, UI implementation, contract, repository aggregation, schema,
migration, permission, audit event, API/action, task state, notification, or
production rollout.

### Wave D prompt execution record — 2026-08-16

The product owner approved WD0-01 through WD0-08 and authorized prompt
execution only. Built-in ImageGen produced four selected responsive DRAFT
references:

- `references/wave-d-design-draft-1440x1000-01.png`;
- `references/wave-d-design-draft-1024x768-01.png`;
- `references/wave-d-design-draft-768x1024-01.png`;
- `references/wave-d-design-draft-390x844-01.png`.

The selected wide studies keep exactly three metrics and place one compact,
two-group surface before the existing filters/list. The 768 px study stacks
the two groups, while the selected 390 px study first restores the containing
page's real single-column metric layout and then stacks groups, items, and
actions without horizontal overflow. A first mobile generation was rejected
because it incorrectly compressed the three existing metrics into columns; it
is not part of the page pack.

These images use fictional presentation data and cover the ready state only.
They do not settle loading, partial failure, complete failure, forbidden,
no-items, refresh, ordering, item limits, or runtime behavior. Product review
of the selected visual direction was recorded on 2026-08-16 for a route-local
typed-fixture prototype only. That approval does not authorize real data,
enabled actions, contracts, schema, API, permissions, audit, or production.

## Wave E Phase 0 handoff — personnel register and PDF export

### Phase 0 source and baseline

Repository inventory on 2026-08-17 confirms that the Salariés containing page
is integrated but no personnel-register page or electronic-register domain
exists. Therefore the Wave E target baseline is `NOT_APPLICABLE`. Current
`wave-d-phase-5-as-built-*` references may be supplied only as containing-page
and Backoffice-shell context; they are not evidence of a register screen.

Wave E uses `NEW_CAPABILITY_DISCOVERY`. It may explore a secondary Salariés
header entry and a dedicated establishment-wide page, but neither the route nor
runtime UI is approved. No generated reference may invent authorization,
legally required values, PDF behavior, or compliance status.

### Shared context and design-tool bundle

- YUTA global: shared Geist typography, semantic tokens, `@yuta/ui`, and
  `lucide-react` conventions;
- Backoffice application: current authenticated topbar, sidebar, establishment
  selector, content width, loading/error/forbidden patterns, and French copy;
- Équipe section: real routes and current Salariés navigation ownership only;
- containing page: current Salariés header, metrics, `À traiter`, filters/list,
  explicit-open employee drawer, and responsive evidence;
- proposed target: `/equipe/registre-personnel`, clearly marked DRAFT and
  treated as a separate full-width page rather than a drawer tab.

Exact shell decision: `REUSE_APPROVED_SHARED_SHELL`. Do not redesign the shell,
sidebar, topbar, establishment selector, Salariés list, or employee drawer. Do
not add a sidebar item until routing/navigation ownership is separately approved.

### Executed Wave E design prompt

Status: `EXECUTED — DRAFT REFERENCES PENDING VISUAL APPROVAL`.

WE0-01 through WE0-10 and prompt execution were approved on 2026-08-17. The
retained 1440, 1024, 768, and 390 studies and current design authority now live
in the dedicated
[`backoffice-equipe-registre-personnel`](../backoffice-equipe-registre-personnel/DESIGN_HANDOFF.md)
pack. The prompt below remains the source prompt for traceability.

```text
Conçois uniquement des maquettes DRAFT, sans code, pour la Wave E « Registre du
personnel » de YUTA Backoffice. La page Salariés existante se trouve sur
/equipe/salaries. La nouvelle capacité est absente du produit et suit
NEW_CAPABILITY_DISCOVERY. Explore une page dédiée proposée à
/equipe/registre-personnel, ouverte depuis une action secondaire « Registre du
personnel » dans l'en-tête de Salariés. Cette route et cette action sont des
propositions de design, pas des fonctions existantes.

Réutilise exactement le contexte visuel fourni : shell Backoffice authentifié,
barre supérieure, navigation latérale, sélecteur d'établissement, typographie,
tokens sémantiques, densité, largeur de contenu et états communs. Ne redessine
pas le shell, la navigation, la liste Salariés, les indicateurs, « À traiter »
ou le dossier salarié latéral. N'ajoute pas une entrée de navigation latérale.

Utilisateur principal : OWNER de l'établissement actif. MANAGER, STAFF,
salarié, utilisateur public et acteur technique sont hors périmètre. Le registre
appartient à un seul établissement. Ne montre aucune vue multi-établissements,
aucun compte externe pour le CSE ou l'inspection et aucun lien public.

Objectif de la maquette : permettre au propriétaire de consulter un registre
ordonné, comprendre les informations obligatoires manquantes et repérer une
action protégée d'export PDF. Le registre structuré est la source. Le PDF n'est
qu'une représentation générée à la demande ; il n'est ni modifiable, ni stocké
par défaut, ni preuve visuelle de conformité.

Produis quatre études cohérentes : 1440 x 1000, 1024 x 768, 768 x 1024 et
390 x 844. La composition proposée contient :

1. un en-tête « Registre du personnel », le contexte d'établissement actif et
   un retour clair vers « Salariés » ;
2. une explication courte : registre propre à cet établissement, construit à
   partir des données structurées ;
3. une carte de préparation distinguant les dossiers exploitables, les
   informations manquantes et les catégories non encore prises en charge, sans
   badge « Conforme » ;
4. une liste dans l'ordre canonique d'embauche ou d'arrivée, avec une position
   d'ordre visible et sans tri inventé ;
5. une séparation explicite entre « Salariés » et la partie spécifique
   « Stagiaires et service civique ». Cette seconde partie doit être présentée
   comme non encore disponible, sans fausses personnes ni fausses données ;
6. des lignes ou cartes lisibles regroupant identité, emploi/qualification,
   entrée/sortie, mentions de contrat applicables et informations
   conditionnelles. Utilise « Information manquante » à la place d'une valeur
   inventée ;
7. une action secondaire « Exporter en PDF », visible mais désactivée dans la
   maquette de découverte, avec une aide indiquant que l'export sera protégé ;
8. une notice concise sur l'accès restreint et la conservation.

Utilise seulement des données fictives et non personnelles. Les valeurs
nécessaires à la présentation ne doivent contenir aucun identifiant technique,
numéro réel d'autorisation de travail, nom de fichier, URL, clé de stockage ou
métadonnée de tenant. Ne déduis rien d'un contrat PDF.

Montre au minimum l'état principal « informations manquantes ». Prévois dans la
structure, sans multiplier les écrans, les états chargement, registre prêt,
établissement vide, accès interdit, erreur avec réessai, export en cours, échec
d'export et source modifiée nécessitant une actualisation. Tous les états ont
un texte explicite et ne reposent jamais uniquement sur une couleur.

À 1440 et 1024 px, privilégie une liste compacte et structurée. À 768 et 390 px,
transforme-la en cartes empilées dans le même ordre. N'utilise pas de tableau
horizontal inaccessible, ne masque pas une mention par survol, autorise les
noms longs à revenir à la ligne, conserve des cibles tactiles d'au moins 44 px
et évite tout débordement horizontal.

Interdictions : badge ou sceau de conformité, signature/certification,
horodatage de confiance, édition en grille, suppression/correction destructive,
archive PDF, partage, email, lien public, import/export en masse, portail CSE ou
inspection, vue organisation, accès manager, self-service salarié, Documents,
OCR, extraction, ChatGPT/IA, remplissage automatique, Formalités, DPAE/DSN,
paie, Planning, Pointage, fournisseur externe ou soumission administrative.

Le résultat doit guider la hiérarchie, la densité, les proportions, les états
et le responsive uniquement. Il ne définit ni route, ni permission, ni champ,
ni schéma, ni API, ni règle juridique. Ajoute la mention « DRAFT — exploration
sans données réelles » dans chaque étude.
```

### Stop condition

Prompt execution and dedicated pack creation are complete. Stop before any
prototype, runtime route, navigation, UI, fixture, schema, migration, contract,
permission, audit, PDF, provider, real data, or production work until the DRAFT
visual direction and a later phase are explicitly approved.

## Wave F Phase 0 — design prompt executed

Design prompt status: `EXECUTED 2026-08-18 — VISUAL DIRECTION APPROVED FOR PHASE 1 LOCAL PROTOTYPE`.

Use the current Wave C/Documents Phase 5 as-built drawer captures as containing-
surface authority. Repository reality overrides all fictional values in the
prompt. The prompt explores only presentation and creates no AI capability.

```text
Conçois uniquement des maquettes DRAFT, sans code ni appel IA, pour une future
fonction « Analyser le contrat » dans le tiroir salarié existant de YUTA
Backoffice, route /equipe/salaries, onglet Documents.

Conserve exactement le shell Backoffice, le tiroir salarié large, les onglets,
la fiche du contrat de travail signé, les actions Consulter/Télécharger, la
typographie, les tokens et la densité des captures as-built fournies. N'ajoute
ni route, ni item de navigation, ni centre IA, ni chatbot.

Utilisateur : OWNER autorisé de l'établissement actif. Le document appartient
à une organisation, un établissement, un salarié et une version précise. Le
fichier est déjà stocké en privé et contrôlé avant cette future étape. La
maquette ne définit pas de fournisseur, de modèle, de stockage ou d'API.

Ajoute une action secondaire « Analyser le contrat » sur le contrat signé, puis
une zone « Suggestions à vérifier ». Montre clairement « Aperçu — aucune
analyse réelle » et « Rien ne sera enregistré sans votre confirmation ».

Utilise des données entièrement fictives pour illustrer trois suggestions :
- Poste : valeur actuelle « Employé polyvalent », suggestion « Chef de rang »;
- Type de contrat : valeur actuelle « CDI », suggestion « CDD »;
- Durée hebdomadaire : valeur actuelle « Non renseignée », suggestion
  « 35 h par semaine ».

Pour chaque suggestion, affiche le champ, la valeur actuelle, la valeur détectée,
une confiance textuelle (élevée/moyenne/faible), la page source, un court extrait
fictif, et un choix explicite « Conserver la valeur actuelle » ou « Utiliser la
suggestion ». Ne présélectionne aucune suggestion uniquement selon la confiance.
Ajoute un récapitulatif des changements sélectionnés et un bouton désactivé
« Appliquer les champs sélectionnés » portant la mention prototype.

Prévois visuellement les états : prêt, analyse en cours, résultat partiel,
aucun champ détecté, PDF image non pris en charge, service indisponible, version
du document modifiée, dossier salarié modifié/conflit, validation impossible,
application en cours, succès et réessai. L'échec de l'analyse ne bloque jamais
Consulter ou Télécharger.

Produis 1440x1000, 1024x768, 768x1024 et 390x844. Sur desktop/tablette, utilise
des comparaisons alignées lisibles. À 390 px, empile les suggestions sans grille
horizontale. Les valeurs longues, la confiance, la page et l'extrait doivent
revenir à la ligne. Conserve des cibles tactiles de 44 px, un focus visible,
des états textuels et aucun débordement horizontal.

Interdictions : analyse réelle, fournisseur/modèle, prompt visible, token/coût,
chat, enregistrement automatique, suggestion présélectionnée, création salarié
depuis un fichier, pièce d'identité, passeport, titre de séjour, caméra, avenant,
fusion de documents, mise à jour du registre, paie, Formalités, DPAE/DSN,
Planning, Pointage, génération/signature de document, partage, lien public,
traitement en masse, notification ou badge « Conforme » / « Vérifié par l'IA ».

Le résultat guide uniquement la hiérarchie, la compréhension, les états et le
responsive. Il n'autorise aucune implementation, transmission de fichier,
permission, schéma, migration, API, audit ou comportement production.
```

### Wave F stop condition

WF0-01 through WF0-12 and this prompt execution were approved on 2026-08-18.
Stop after the four DRAFT references. Prompt execution does not authorize a prototype,
file read, OCR/AI call, provider setup, runtime UI, contract, persistence,
permission, audit, employee mutation, or production behavior.

## Wave G Phase 0 — design handoff decision

Target: server-only synthetic AI/OCR provider evaluation behind the existing
Wave F Documents review.

Shared context status: `RESOLVED`.

Shell mode: `REUSE_CURRENT_TARGET`.

Visual baseline: the Wave F Phase 5 as-built references remain authoritative.

Design-generation prompt: `NOT_APPLICABLE`.

Reason: Wave G Phase 0 changes no restaurant job, information hierarchy,
interaction, state, route, navigation, or visible control. Provider/model
selection belongs to engineering evaluation and must remain hidden behind the
existing provider-neutral adapter. A visual prompt would encourage unsupported
technical controls and is therefore intentionally not prepared or run.

Resume design only if a later approved real-file flow requires new privacy
information, explicit acknowledgement, or another user-visible state. That
would be a separate approval gate, not an inference from provider selection.

Wave G Phase 6 reuses this decision. Its development-only Luna/v4 wiring adds
no visible state or interaction, so no new design prompt or reference is
required. The Wave F Phase 5 as-built references remain authoritative.

Wave G Phase 8 required no new design-generation prompt. Its approved offline
implementation reuses the compact Phase 7 source choice and existing Wave F
review, adding `Contrat fictif enregistré` only after server eligibility.
Missing or stale eligibility uses the existing unavailable/recovery language.
Normal responsive and accessibility QA remains required, but no new image,
layout, or design prompt was needed. The separately approved one-request provider QA temporarily
replaced the offline badge/disclosure with truthful `QA OpenAI` copy stating
that the fictional PDF would be sent once with Luna/v4 and never applied
automatically. Restarting without the gate restores the offline presentation.

## F02 Phase 1 design handoff

Target: existing `Ajouter un salarié` dialog within `/equipe/salaries`.

Delivery mode: `EXISTING_CAPABILITY_RENEWAL`.

Shell mode: `REUSE_CURRENT_TARGET` inside the existing approved Backoffice and
Salariés page shell.

Shared context status: `RESOLVED` from the current Salariés package.

F02 baseline status: `CAPTURED 2026-08-23`.

The authenticated fictional-data baseline covers 1440, 1024, 768, and 390 CSS
pixels plus duplicate, dirty-close, and committed-success evidence. It proves
the current controlled CDD reason, contractual weekly duration, existing page
shell, and the two bounded Phase 1 additions.

F02 design prompt status: `NOT_APPLICABLE FOR PHASE 1`.

The approved change completes two missing interactions inside the current
dialog and reuses existing `@yuta/ui` patterns. Generating a new design would
invite the wider unsupported downloaded flow. A later design phase must remain
separately approved and preserve the current fields, conditional CDD branch,
duplicate review, pending, validation, error, committed-success,
authorization, and tenant boundaries. File-first creation, unsupported
documents, a new route, remuneration, probation, apprenticeship, detailed
scheduling, Formalités, register writes, AI, and production claims remain
excluded.

## F03 Phase 0 design handoff

Target: existing shared `Modifier le dossier salarié` dialog opened from the
Salariés quick view and full dossier.

Delivery mode: `EXISTING_CAPABILITY_RENEWAL`.

Shell mode: `REUSE_CURRENT_TARGET` inside the approved Backoffice and Salariés
shell; do not redesign navigation, dossier tabs, or the containing drawer/page.

Shared context status: `RESOLVED` from the current Salariés package and Wave C
as-built dossier references.

F03 baseline status: `CAPTURED 2026-08-23`. Four authenticated fictional-data
captures cover the current editor at 1440, 1024, 768, and 390 CSS pixels. One
additional mobile capture covers the explicit dirty-close decision. Existing
Wave C references continue to own the containing dossier context.

F03 design prompt status: `NOT_APPLICABLE FOR THE PROPOSED PHASE 1`. The only
implemented UI change reuses the existing F02 discard-confirmation pattern. A new
generated design would add no authority and risks importing unsupported fields
from the downloaded functional flow.

Any later design work must preserve the combined current field set, conditional
CDD logic, OWNER/establishment boundary, pending/validation/conflict/retry/
success states, and the distinction between F03 current-value editing and F07
value-level history. It must exclude payroll, remuneration, general documents,
work authorization, Formalités, register correction, departure, new contract
types, and production claims unless separately approved.
