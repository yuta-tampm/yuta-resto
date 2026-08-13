# Backoffice Équipe — Salariés — Product Scope

Status: Read and development create slices implemented; production collection gated

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
are excluded. This scope was approved on 2026-08-13 for the typed-fixture
Phase 1 prototype.

## Current approved capabilities

The repository now contains the approved real read-only foundation inside the
authenticated Backoffice shell: OWNER authorization, minimum personnel
contract/schema, tenant-scoped repository, and list/search/filter UI. It is not
evidence that employee writes, audit history, retention operations, or the
deferred capability waves are implemented.

## Product and runtime boundaries

- authenticated cloud Backoffice;
- proposed owner: current establishment using trusted `organizationId` and
  `establishmentId`;
- future persistence owner after approval: server-only `@yuta/db-cloud`;
- POS local users and data are separate and never synchronized;
- Display/public apps have no ownership;
- multiple-establishment person merging/transfers are deferred.

## Users and authorization proposal

- `OWNER`: proposed `personnel.employee.read` and
  `personnel.employee.manage` for the first production slices;
- `MANAGER`: denied; future personnel-specific delegation requires approval;
- `STAFF`: deny;
- public/service actors: deny;
- system roles never bypass active restaurant membership;
- navigation visibility is not authorization;
- no entitlement is introduced without a separate product/module decision.

## Sensitive-data boundary

Before restricted fields enter scope, approve purpose/legal basis, field-level
access, encryption, storage/download behavior, logging, retention, archive
separation, deletion/legal hold, backup/restore, and data-subject workflows.

## Approved change boundary

Phase 1 may create a truthful responsive UI prototype with typed fictional
fixtures inside the current shell. Employee domain/persistence, database,
API/contracts, real mutations, and new permissions remain proposals requiring
separate approval.

On 2026-08-13, the product boundary was also approved for documentation-only
Phase 4 technical preparation. That approval allows the team to describe a
future data model, request flow, delivery order, and tests. It does not allow
database, migration, API, permission, repository, or real-storage code.

## Deferred capabilities

- secure employee documents and optional OCR;
- RIB, NIR, identity/work-authorization documents, remuneration, and payroll;
- contract/amendment generation and Formalités integration;
- DPAE, DSN, signature, government, or provider integration;
- detailed part-time and apprenticeship workflows;
- interns/stagiaires and personnel-register PDF;
- electronic-register compliance claims;
- alerts, bulk import/export, organization-wide HR, transfers/deduplication;
- employee self-service, recruitment, leave, absence, disciplinary, or medical management.

## Future capability waves

Deferred means retained for later discovery and approval, not discarded. The
following intent is recorded without authorizing Phase 1 implementation.

### Wave A — Secure employee documents

Potential dossier section: `Documents`. Future repository-backed actions may
include view, add/upload, replace, and download. Missing or expiring documents
may produce actionable issues only when the underlying category, requirement,
date, authorization, storage, and resolution workflow are approved.

This wave may cover identity/residence/work-authorization support, rights
certificate, RIB, proof of address when justified, and contract/supporting
documents. It requires the security/privacy/retention gates in
`DATA_AND_INTERACTION_SPEC.md`. OCR remains optional and extracted values must
be reviewed before becoming authoritative.

### Wave B — Extended employment and Formalités reuse

After the contract domain is approved, Salariés may expose the structured
employment data needed by supported Formalités workflows. Formalités owns
document-specific validation, templates, clauses, generation, and lifecycle.
Salariés must not duplicate that engine.

Potential concepts include contract type/motif, working duration and part-time
distribution, contractual remuneration, trial/probation, and apprenticeship-
specific information. Each remains a domain proposal, not an inferred column or enum.

### Wave C — Actionable issues and events

Future `À traiter` behavior should distinguish:

- incomplete dossier data or missing approved documents;
- upcoming expiry, contract, or formality events.

Every item must identify the employee, issue, relevant date when applicable,
and an actually supported resolving action. Do not add a fourth KPI merely to
display alerts or show generic warnings with no resolution.

### Wave D — Personnel register and PDF export

A future register entry point may be discoverable from Salariés, but it requires
approved routing, stable establishment hiring order, retained former employees,
reconstructable dated history, stagiaire semantics where supported, retention,
and legal/immutability review. PDF is an export of structured data, never the
source of truth or evidence by itself of electronic-register compliance.

The preferred one-employee-per-page format remains a future presentation
proposal until that capability wave is reviewed.

## Relationships

Formalités, Planning, Pointage, and other Équipe routes remain planned surfaces.
Future Formalités should consume approved employee data rather than duplicate
it. `Utilisateurs & accès` manages login identities and memberships, not employees.
