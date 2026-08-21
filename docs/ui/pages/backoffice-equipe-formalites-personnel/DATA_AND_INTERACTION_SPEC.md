# Préparer un projet de contrat CDI — Data and Interaction Specification

Status: Approved and implemented Phase 1 boundary

Visibility: Engineering

## Runtime and trust boundary

The server requires an authenticated tenant, active establishment, and existing
`personnel.employee.read` permission. Browser scope is never trusted. The page
then renders only a compile-time fictional fixture.

## Data ownership and transport

There is no runtime transport or persistence. A route-local typed object owns
all Phase 1 display values. It contains no employee, organization,
establishment, document, or request identifier.

## Current domain mapping

| Prototype group         | UI presentation               | Runtime source                    | Gap                                          |
| ----------------------- | ----------------------------- | --------------------------------- | -------------------------------------------- |
| reusable employee facts | six read-only labelled values | fictional fixture                 | future authorized Salariés mapping           |
| contract-specific facts | three missing values          | fictional fixture                 | future Formalités input model and validation |
| readiness               | blocked summary               | derived from fixed missing values | future approved lifecycle                    |

The model is a presentation fixture, not a contract or database schema.

## Current interactions

The page is read-only. The generation button is disabled. There is no selection,
edit, submit, retry, preview, download, or dossier handoff.

## Mutations / actions / transactions

None.

## Validation

No input exists. Tests assert the bounded fixture, explicit fictional-data
notice, absence of an employee identifier, and disabled generation control.

## Operational and UI states

Authenticated OWNER: fictional readiness screen. Unauthorized: existing
server authorization fails closed before rendering the page. No loading,
database, provider, success, or recovery state exists because no service runs.

## Polling / offline / device behavior

Not applicable.

## Decisions that must not be guessed

Real field mapping, form fields/enums, validation rules, draft identity,
versioning, save/resume, overwrite/conflict handling, template owner, legal
approval, signature, audit, retention, and production ownership.

## Proposed persistence/contract changes

None approved. Any such change requires a later phase.
