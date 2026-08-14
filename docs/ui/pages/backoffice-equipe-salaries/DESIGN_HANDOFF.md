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
