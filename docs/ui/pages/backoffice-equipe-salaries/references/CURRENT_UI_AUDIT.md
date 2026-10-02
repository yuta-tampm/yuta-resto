# Backoffice Équipe — Salariés — Current UI Audit

Status: Draft review

Visibility: Engineering

Review date: 2026-08-13

Sources:

- current repository Phase 0 package;
- `design-proposal-desktop-01.png` and `design-proposal-mobile-01.png`;
- external feedback pack under
  `C:\Users\Tam\Downloads\yuta-salaries-ui-codex-pack\docs\ui\pages\salaries`.

The external pack was reviewed as feedback, not copied or treated as approval.
Repository authority, protocol revision 4, and `NEW_CAPABILITY_DISCOVERY`
remain unchanged. At the time of this audit, the references were `DRAFT`; they
were subsequently approved by the product owner as Phase 1 visual direction.

## Accepted now for visual/product review

- preserve the three compact summary-card direction;
- preserve search, restrained filters, active/upcoming/former views, compact
  desktop list/table, selected-row treatment, and right-side quick view;
- keep the quick view a fast consultation surface, not a large editor;
- use mobile employee cards and full-width detail rather than squeezing the
  desktop split layout;
- make completeness explainable and actionable;
- separate missing data from future expiry/contract/formality events;
- keep operational sorting independent from future register order;
- do not infer configurable page size from `10 / page`;
- do not infer qualification, contract, or employee-status enums from fixtures.

These accepted findings refine the draft package. They do not approve the
reference or authorize Phase 1.

## Retained as future-wave UX intent

### Documents

Potential first-class dossier section after secure capability approval. Future
actions may be view, add/upload, replace, and download. Requirements include
server authorization, secure storage/download, malware scanning, access audit,
retention/archive/deletion, failure/retry, and privacy review. OCR is optional
and never bypasses review/validation.

### Extended employment and Formalités

Salariés may later expose approved structured employment/contract data for
reuse. Formalités retains template, clause, legal validation, generation, and
document-lifecycle ownership. A real route, authorization, and handoff contract
are prerequisites for status or navigation actions.

### Actionable issues

A compact `À traiter` surface may later show concrete missing-data or upcoming
events. Do not add a fourth KPI, reserve an empty panel, or show issues without
an employee, reason/date, and supported resolution.

### Personnel register and PDF

A future discoverable action requires its own route/domain, stable
establishment hiring order, retained former-employee position, dated history,
stagiaire scope, retention, and legal/immutability review. PDF is presentation,
not the data source or proof of compliance. One employee per page remains a
future presentation proposal.

## Rejected or corrected feedback

- the desktop raster was still `DRAFT` at feedback-review time and was not
  automatically approved by the external pack;
- package slug remains `backoffice-equipe-salaries`, not `salaries`;
- canonical Phase 0–5 workflow is retained; the external Phase 0–10 plan is not adopted;
- Documents, Formalités, apprenticeship, register, and PDF are not required
  functional completion for Phase 1;
- document-first onboarding is deferred until a secure document capability exists;
- there are no existing employee entities, document storage, HR audit model,
  Formalités integration, or PDF engine to reuse;
- the raster does not define routes, permissions, fields, enums, pagination,
  storage, API/schema, business rules, legal calculations, or exact copy.

## Approval state

Scope status: `APPROVED`

Reference status: `APPROVED`

Product-owner approval date: 2026-08-13. Approval covers the Phase 1
typed-fixture prototype only and does not authorize production integration.
