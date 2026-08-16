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
