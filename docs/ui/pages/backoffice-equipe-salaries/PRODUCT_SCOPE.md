# Backoffice Équipe — Salariés — Product Scope

Status: Draft

Visibility: Engineering

## User goal

An authorized restaurant owner or personnel manager needs one establishment-
scoped place to maintain the minimum employee and employment-relationship
information required for daily personnel administration.

## Recommended MVP

- minimum legal identity: family name and given names;
- poste and qualification;
- employment start and optional departure date;
- minimal approved contract summary;
- full-time or part-time indicator;
- expected end date when relevant;
- derived upcoming, active, and former views;
- search, practical filters, and explainable completeness;
- manual create/edit and non-destructive departure;
- minimal auditable create, update, and departure events.

Remuneration, bank/social-security data, documents, and legal-generation flows
are excluded. This scope remains `DRAFT` until product approval.

## Current approved capabilities

The repository currently approves only the canonical placeholder route inside
the authenticated Backoffice shell and the existing cloud session/tenant
foundations. Route presence is not approval of employee management.

## Product and runtime boundaries

- authenticated cloud Backoffice;
- proposed owner: current establishment using trusted `organizationId` and
  `establishmentId`;
- future persistence owner after approval: server-only `@yuta/db-cloud`;
- POS local users and data are separate and never synchronized;
- Display/public apps have no ownership;
- multiple-establishment person merging/transfers are deferred.

## Users and authorization proposal

- `OWNER`: proposed read/manage for the first vertical slice;
- `MANAGER`: requires explicit personnel-management authorization approval;
- `STAFF`: deny;
- system roles never bypass active restaurant membership;
- navigation visibility is not authorization;
- an entitlement may be proposed, but no key is invented here.

## Sensitive-data boundary

Before restricted fields enter scope, approve purpose/legal basis, field-level
access, encryption, storage/download behavior, logging, retention, archive
separation, deletion/legal hold, backup/restore, and data-subject workflows.

## Approved change boundary

Phase 0 creates documentation only. Shell/navigation changes are excluded.
Typed fixtures, employee domain/persistence, database, API/contracts, and
permissions remain proposals requiring separate approval.

## Deferred capabilities

- secure documents and OCR;
- RIB, NIR, identity/work-authorization documents, remuneration, and payroll;
- contract/amendment generation and Formalités integration;
- DPAE, DSN, signature, government, or provider integration;
- detailed part-time and apprenticeship workflows;
- interns/stagiaires and personnel-register PDF;
- electronic-register compliance claims;
- alerts, bulk import/export, organization-wide HR, transfers/deduplication;
- employee self-service, recruitment, leave, absence, disciplinary, or medical management.

## Relationships

Formalités, Planning, Pointage, and other Équipe routes remain planned surfaces.
Future Formalités should consume approved employee data rather than duplicate
it. `Utilisateurs & accès` manages login identities and memberships, not employees.
