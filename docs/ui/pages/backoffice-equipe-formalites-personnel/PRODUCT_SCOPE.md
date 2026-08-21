# Préparer un projet de contrat CDI — Product Scope

Status: Approved Phase 1 prototype

Visibility: Engineering

## User goal

Allow an OWNER to understand which existing employee facts could be reused and
which contract-specific facts would still be required before preparing a CDI
draft.

## Current approved capabilities

- Display one clearly labelled fictional employee.
- Separate reusable Salariés facts from Formalités-owned missing inputs.
- Show a read-only readiness result and a disabled generation endpoint.
- Restrict the route and navigation item with existing OWNER personnel access.

## Current boundaries

This is an authenticated cloud Backoffice page for the active establishment.
Phase 1 contains no tenant-owned personnel read and no transport or persistence.
The shell session is real; every business fact in the prototype is fictional.

## Approved change boundary

Only the route, a route-local model/component, the navigation visibility rule,
tests, and current documentation are in scope. Database, API, contracts, schema,
migrations, providers, files, generation, signature, and production are excluded.

## Out of scope

CDD or amendments, real dossier integration, editing, save/resume, templates,
PDF generation, legal validation, DPAE/DSN, signature, sending, audit, retention,
AI/OCR, and production operation.

## Proposed capabilities requiring approval

F5-07 must define draft/result lifecycle. F5-08 must close legal, privacy,
security, storage, retention, audit, and operational responsibilities. Passing
an employee ID from the full dossier also requires approval for integrated data.

## Relationships

Salariés remains the future source of reusable employee/employment facts.
Formalités will own contract-specific inputs, validation, and eventual document
workflow. No runtime relationship is implemented in Phase 1.
