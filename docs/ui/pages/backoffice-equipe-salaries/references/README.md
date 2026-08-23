# Backoffice Équipe — Salariés — Reference Metadata

Status: Approved design reference

Visibility: Engineering

Reference file: `design-proposal-desktop-01.png`; `design-proposal-mobile-01.png`

Reference status: `APPROVED`

Approved scope/date or review note: Generated on 2026-08-12 and approved for
Phase 1 visual direction on 2026-08-13 after selective feedback reconciliation.

Purpose: Explore page hierarchy, proportions, density, action priority,
responsive behavior, and visual tone for desktop and mobile.

Intentional non-authority: A future reference may guide hierarchy,
proportions, spacing, density, and visual tone only. It does not define routes,
scope, authorization, contracts, APIs, persistence, runtime ownership, business
logic, legal compliance, or raw color values.

## Draft references

### `design-proposal-desktop-01.png`

- corrected desktop overview;
- retains the approved Backoffice shell direction and current navigation labels;
- explores compact summary metrics, employee filters/table, and contained detail;
- replaces a rejected first generation that invented routes and a manager field.

### `design-proposal-mobile-01.png`

- mobile responsive study with no desktop sidebar;
- explores compact metrics, search/filter, segmented views, employee cards,
  touch-friendly actions, and vertical scrolling;
- keeps the demonstration-data label visible.

## Review boundary

The references do not approve fixture values, names, counts, dates,
qualifications, contract vocabulary, establishment/account data, shared shell
changes, backend fields, authorization, persistence, legal behavior, or exact
generated copy. They contain no production data.

Shared reference: `docs/ui/references/yuta-shell-brand-reference.png`.

Selective feedback review: `CURRENT_UI_AUDIT.md`.

## Documents Phase 0 containing-page context

On 2026-08-15, the current authenticated local OWNER view at
`http://localhost:3001/equipe/salaries` was inspected at a desktop viewport.
The inspection confirmed the explicitly opened right overlay drawer, current
employee header/actions, tabs `Vue d'ensemble`, `Identité`, `Relation de
travail`, `Historique`, and `Consultations`, responsive 48 rem maximum width,
and absence of a Documents surface.

The Documents capability itself is absent, so its baseline is
`NOT_APPLICABLE`. The current implementation plus the two approved page design
references form the curated visual context for its design prompt. The generated
Documents references were approved on 2026-08-15 for the typed-fixture Phase 1
prototype only.

The 48 rem value above records the historical pre-Documents baseline. The
current approved as-built drawer uses a 60 rem desktop maximum, up to 88% of the
1024 px viewport, and full width at 768 px and below.

## Documents design proposals — APPROVED FOR PHASE 1

Documents reference status: `APPROVED FOR PHASE 1 PROTOTYPE ONLY`

Generated with the approved Phase 0 prompt on 2026-08-15:

### `documents-design-proposal-desktop-01.png`

- wide desktop overlay drawer with the active sixth `Documents` tab;
- compact document rows, available/processing states, and restrained actions;
- underlying Salaries page remains visually separate beneath the overlay.

### `documents-design-proposal-tablet-1024-01.png`

- compact desktop/tablet adaptation with the same hierarchy and actions;
- preserves scan speed while keeping the drawer separate from the page below.

### `documents-design-proposal-tablet-768-01.png`

- full-width tablet portrait drawer;
- document actions adapt below each row without overflow.

### `documents-design-proposal-mobile-01.png`

- 390 px full-width drawer with stacked document cards and touch-sized actions;
- preserves all dossier tabs and keeps `Documents` visibly active.

All four images are visual proposals only. Names, filenames, dates, sizes,
categories, counts, and copy are fictional/non-authoritative design examples.
They do not approve document requirements, authorization, contracts, schema,
storage, upload/download behavior, security processing, retention, legal
compliance, or real implementation. Product review approved these references on
2026-08-15 only for a typed-fictional-fixture presentation prototype.

## Documents Phase 5 as-built evidence

The following signed-in local captures document the implemented empty state and
responsive drawer after functional/security QA:

- `documents-phase-5-as-built-1024x768.png`;
- `documents-phase-5-as-built-768x1024.png`;
- `documents-phase-5-as-built-390x844.png`.

These images are implementation evidence, not approval for production document
storage. Production remains fail-closed until the separate legal, retention,
EU-provider, backup/restore, monitoring, and incident-response gates are closed.

## Documents Wave B Phase 0 context — signed amendments

The three Documents Phase 5 as-built captures above are the approved containing-
surface context for signed-amendment discovery. They show the real drawer,
Documents tab, signed-contract boundary, protected-access treatment, action
hierarchy, and responsive behavior. No amendment row/action exists, so the new
capability baseline is `NOT_APPLICABLE`.

The product owner authorized the prompt on 2026-08-15. Built-in ImageGen created
four references subsequently approved for the typed-fixture Phase 1 prototype:

- `documents-wave-b-design-draft-desktop-1440-02.png` — selected wide drawer with the
  base contract and two compact amendment rows;
- `documents-wave-b-design-draft-tablet-1024-01.png` — compact landscape drawer
  with visible row actions;
- `documents-wave-b-design-draft-tablet-768-01.png` — portrait stacking with
  amendment actions aligned beside each card;
- `documents-wave-b-design-draft-mobile-390-01.png` — one-column mobile cards
  with full-width visible actions.

The initial desktop `-01` output invented redundant row chevrons and is rejected
as visual authority; selected desktop `-02` removes them. The first mobile output
invented a redundant three-dot menu even though all three actions were already
visible; the stored mobile reference is the corrected iteration. All names,
dates, filenames, sizes, and document values are fictional design examples. The
references authorize only the labelled, non-persisting local prototype. They do
not authorize a category enum, schema, API, permission, repository, file action,
storage, or real-data implementation.

## Documents Wave B Phase 5 as-built evidence

The following signed-in local captures show the real, Defender-checked Wave B
vertical slice after add, protected delivery, download, and version-2 replace
QA:

- `documents-wave-b-phase-5-as-built-1440x1000.png`;
- `documents-wave-b-phase-5-as-built-1024x768.png`;
- `documents-wave-b-phase-5-as-built-768x1024.png`;
- `documents-wave-b-phase-5-as-built-390x844.png`.

The visible `QA Phase 5` amendment and generated filename are non-personal test
evidence; their local database records, audit events, storage objects, and source
files were removed after capture. These images do not approve production file
collection. AB2-10 and the EU provider, retention, rights, backup/restore,
monitoring, deletion, and incident-response decisions remain release blockers.

## Wave C DRAFT design references

The product owner approved Phase 0 and prompt execution on 2026-08-16. Built-in
ImageGen produced the following selected responsive studies:

- `wave-c-design-draft-desktop-1440-01.png` — wide drawer with the existing
  `Relation de travail` summary and a separate complementary-information card;
- `wave-c-design-draft-tablet-1024-01.png` — landscape adaptation retaining
  compact multi-column cards;
- `wave-c-design-draft-tablet-768-01.png` — portrait adaptation with stacked
  authoritative facts and compact complementary values;
- `wave-c-design-draft-mobile-390-01.png` — full-width mobile drawer with a
  scrollable tab strip and vertically stacked read-only values.

The initial desktop output displayed a duplicate section-level edit button and
form-like controls. It was rejected before storage. The selected desktop output
uses only the existing header `Modifier` action and read-only default values;
its CDD label was separately corrected. The tablet and mobile studies follow
the same single-action rule.

All employee names, dates, roles, and contract values are fictional visual
examples. The DRAFT badge is a design-review marker, not a proposed production
badge. The product owner approved these images only for the labelled,
non-persisting Phase 1 prototype on 2026-08-16. They do not approve an enum,
validation rule, schema, migration, contract, API, permission, repository,
server action, persistence, Formalités workflow, or real employee data.

## Wave C Phase 5 as-built evidence

The following signed-in local captures show the implemented real-data drawer
after a fictional CDD dossier was persisted and read back:

- `wave-c-phase-5-as-built-1440x1000.png`;
- `wave-c-phase-5-as-built-1024x768.png`;
- `wave-c-phase-5-as-built-768x1024.png`;
- `wave-c-phase-5-as-built-390x844.png`.

They verify the single header edit action, controlled reason label, integer-
minute duration formatting, wide desktop drawer, full-width tablet/mobile
drawer, scrollable mobile tabs, and stacked narrow cards without horizontal
drawer overflow. `QA Wave C Phase 5` and every displayed employment value are
non-personal test evidence. The exact dossier, audit events, and retry receipts
were removed after capture. These images do not authorize production use.

### Wave C Phase 5 visual-correction evidence

The following signed-in local captures record the corrected `Identité` and
primary `Relation de travail` key-fact cards:

- `wave-c-phase-5-as-built-identity-1440x1000.png`;
- `wave-c-phase-5-as-built-employment-1440x1000.png`;
- `wave-c-phase-5-as-built-identity-1024x768.png`;
- `wave-c-phase-5-as-built-employment-1024x768.png`;
- `wave-c-phase-5-as-built-identity-768x1024.png`;
- `wave-c-phase-5-as-built-employment-768x1024.png`;
- `wave-c-phase-5-as-built-identity-390x844.png`;
- `wave-c-phase-5-as-built-employment-390x844.png`.

These captures verify two-column cards where space permits, one-column narrow
layout, preserved drawer/tab behavior, and no page or drawer horizontal
overflow. They reuse existing non-personal local evidence and introduce no data
mutation or production approval.

## Wave D Phase 0 containing-page context — `À traiter`

The signed-in local OWNER page was re-inspected on 2026-08-16. It retains the
three current summary cards and contains no `À traiter` surface. The Wave C
Phase 5 responsive as-built captures, including the later identity/employment
visual-correction set above, are the approved containing-page context.

The proposed Wave D surface is absent, so its baseline is `NOT_APPLICABLE`.
Current captures may guide shell fidelity, page hierarchy, spacing, responsive
behavior, and drawer containment only. They do not authorize issue kinds,
counts, task state, notification behavior, contract aggregation, audit,
permissions, schema, or implementation.

Containing-page captures used for the Wave D prompt:

- `wave-d-phase-0-containing-page-1440x1000.png`;
- `wave-d-phase-0-containing-page-1024x768.png`;
- `wave-d-phase-0-containing-page-768x1024.png`;
- `wave-d-phase-0-containing-page-390x844.png`.

## Wave D DRAFT design references

The product owner authorized design-prompt execution on 2026-08-16. The
selected ready-state studies are:

- `wave-d-design-draft-1440x1000-01.png`;
- `wave-d-design-draft-1024x768-01.png`;
- `wave-d-design-draft-768x1024-01.png`;
- `wave-d-design-draft-390x844-01.png`.

The 1440 and 1024 studies use a restrained two-group row. The 768 study stacks
the groups while retaining the desktop shell. The selected 390 study preserves
the real one-card-per-row metric layout and stacks each item action. The first
mobile generation was rejected because it changed those existing metric cards
to three columns; that rejected output is not stored here.

All four images remain DRAFT presentation evidence with fictional names and
values. Their visual direction was approved on 2026-08-16 for a route-local
typed-fixture prototype only. They are not an as-built baseline and do not
authorize real data, enabled actions, contract, schema, query, permission,
audit, API/action, notification, or production work.

## Wave D Phase 1 local prototype evidence

Signed-in local OWNER browser QA captured the implemented typed-fixture
prototype on 2026-08-16:

- `wave-d-phase-1-prototype-1440x1000.png`;
- `wave-d-phase-1-prototype-1024x768.png`;
- `wave-d-phase-1-prototype-768x1024.png`;
- `wave-d-phase-1-prototype-390x844.png`;
- `wave-d-phase-1-prototype-390x844-detail.png`.

The viewport checks found no horizontal overflow and no console warning or
error. Every capture retains exactly three summary cards, two prototype
groups, and three disabled actions. The additional 390 px detail capture shows
the complete stacked prototype after scrolling past the existing page header
and metrics. These captures evidence local presentation only; they do not
authorize a real overview read or enabled resolving action.

## Wave D Phase 5 local as-built evidence

Signed-in local OWNER QA captured the real development-only overview on
2026-08-17:

- `wave-d-phase-5-as-built-1440x1000.png`;
- `wave-d-phase-5-as-built-1024x768.png`;
- `wave-d-phase-5-as-built-768x1024.png`;
- `wave-d-phase-5-as-built-390x844.png`.

The desktop and tablet captures show the real containing page, three existing
metrics, one current missing-contract action, and a truthful empty departure
group. The mobile capture is taken after scrolling the page-owned main region
to the complete stacked Wave D card. All four widths have equal document
scroll/client width and no horizontal page overflow. The local record shown is
existing configured development data; no employee or document mutation was
performed for these captures.

The DRAFT design and Phase 1 fixture captures remain historical discovery
evidence only. This Phase 5 set is the current Wave D as-built reference and
does not authorize production delivery.

## F02 Phase 1 as-built evidence

Authenticated local OWNER QA captured the current `Ajouter un salarié` dialog
with fictional LUNA data on 2026-08-23:

- `f02-phase-1-as-built-1440x1000.png`;
- `f02-phase-1-as-built-1024x768.png`;
- `f02-phase-1-as-built-768x1024.png`;
- `f02-phase-1-as-built-390x844.png`;
- `f02-phase-1-duplicate-1440x1000.png`;
- `f02-phase-1-dirty-close-390x844.png`; and
- `f02-phase-1-success-1440x1000.png`.

The four responsive captures are the current normal-dialog baseline after the
controlled CDD-reason and contractual-weekly-duration work. The additional
captures prove existing same-establishment duplicate review, the new explicit
discard decision, and the committed success with `Fermer` and
`Ouvrir le dossier`. Interactive QA separately confirmed the CDD branch and
that the returned employee ID resolves to the full dossier route.

The browser reported no warning/error. At 1440, 1024, 768, and 390 CSS pixels,
the page and visible dialog each have equal client and scroll widths. One
clearly fictional record, `Nina F02-Sierra`, was created through the existing
atomic flow to produce truthful success evidence. These captures contain no
real employee data and do not authorize new fields, document-first creation,
provider work, real employee QA, or production.

## Wave F Phase 0 containing-surface and DRAFT design evidence

The current approved Documents/Wave C Phase 5 as-built drawer captures remain
the containing-surface authority. They evidence the existing contract card,
document tab, drawer width, shell, responsive behavior, and real secure-document
actions only.

The separately approved design prompt produced these subordinate DRAFT
references on 2026-08-18:

- `wave-f-design-draft-1440x1000-01.png`;
- `wave-f-design-draft-1024x768-01.png`;
- `wave-f-design-draft-768x1024-01.png`;
- `wave-f-design-draft-390x844-01.png`.

The viewport names describe the requested responsive concepts; generated raster
canvas dimensions may differ. The 1024 reference was regenerated after review
so the analysis action belongs only to the signed base contract, never an
amendment.

They do not evidence or authorize OCR, AI analysis, suggestions, an apply
action, a provider, a new employee file-first flow, amendment extraction, or
production processing. These generated references guide hierarchy and states
only, use distinct `wave-f-design-draft-*` names, and remain subordinate to
repository behavior.

## Wave F Phase 5 local as-built evidence

Signed-in local OWNER QA captured the completed synthetic review on 2026-08-18:

- `wave-f-phase-5-as-built-1440x1000.png`;
- `wave-f-phase-5-as-built-1024x768.png`;
- `wave-f-phase-5-as-built-768x1024.png`;
- `wave-f-phase-5-as-built-390x844.png`.

The captures show an existing signed-contract card together with the explicit
`Local — PDF synthétique` and `Test local avec données fictives` disclosure.
The mobile capture is intentionally scrolled to the review so its stacked
content is visible. At all four widths the page and review fit without
horizontal overflow, and browser logs contain no warning/error.

The employee name and document metadata shown are existing local development
data. The extraction result is fictional and generated independently; the
signed PDF was not read or transmitted, and no suggestion was applied. These
captures supersede the Wave F DRAFT images only as local as-built presentation
evidence. They do not authorize real-file analysis, an external provider, or
production use.

Wave G Phase 6 changes only the server-side development adapter selection and
therefore adds no visual reference. These Wave F Phase 5 captures continue to
represent the unchanged fictional-data review UI; they are not evidence of a
real-file or production OpenAI flow.
