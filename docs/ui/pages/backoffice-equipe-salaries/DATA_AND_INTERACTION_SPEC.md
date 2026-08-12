# Backoffice Équipe — Salariés — Data and Interaction Specification

Status: Draft

Visibility: Engineering

## Runtime and trust boundary

The server validates the Backoffice session and active membership, then resolves
trusted organization and establishment context. Browser state, form fields,
URLs, cookies, roles, permissions, entitlements, and identifiers are never
authorization proof. Future employee access fails closed for wrong or missing
scope, suspended/stale membership, or missing personnel authorization.

## Data ownership and transport

No employee owner or transport exists today. Proposed future boundary:

```text
apps/backoffice server -> approved @yuta/contracts schemas
-> establishment-scoped @yuta/db-cloud repository -> cloud PostgreSQL
```

All employee queries include `organizationId` and `establishmentId`, including
resource-ID lookups. Browser bundles receive no database or trusted scope.

`users` and `tenant_memberships` are login/access records, not employees.
Employee creation must not create login access implicitly, or vice versa.

## MVP UI data dictionary proposal

This is not a database schema.

| UI concept          | Kind                | Proposed meaning                  | Gap                           |
| ------------------- | ------------------- | --------------------------------- | ----------------------------- |
| Employee ID         | Stored              | Opaque employee resource ID       | Contract/schema proposal      |
| Family/given names  | Stored              | Minimum legal identity            | Validation approval needed    |
| Poste               | Stored              | Operational job label             | Vocabulary owner unresolved   |
| Qualification       | Stored              | Employment qualification          | Vocabulary owner unresolved   |
| Entry date          | Stored              | Establishment-local start date    | Required                      |
| Departure date      | Stored, nullable    | Effective end date                | Non-destructive flow          |
| Contract summary    | Stored/derived      | Minimal approved concepts         | Exact model unresolved        |
| Expected end date   | Stored, conditional | Relevant finite-contract end      | Model-dependent               |
| Full/part time      | Stored              | Contractual category              | Distribution deferred         |
| Operational status  | Derived             | Upcoming/active/former from dates | Avoid status enum by default  |
| Completeness issues | Derived             | Explainable missing MVP data      | Avoid opaque boolean          |
| Search/filter       | Transient UI        | List presentation state           | Not trusted domain data       |
| Register order      | Deferred            | Establishment hiring order        | Requires legal/history design |

Excluded: NIR, RIB, documents, health/disciplinary data, remuneration, payroll,
work-authorization files, apprenticeship, interns, and provider/Formalités data.

## Discovery interactions

- select active/upcoming/former views;
- search/filter approved fields;
- open details and manual add/edit flows;
- review field validation;
- confirm a non-destructive departure date;
- illustrate conflict, retry, and recovery.

These are design targets, not implemented behavior.

## Future mutation proposals

1. create minimum employee relationship;
2. list/read by trusted establishment scope;
3. edit approved fields with conflict handling;
4. record departure without deletion;
5. append minimal audit events without sensitive metadata.

No mutation is authorized by this document.

## Validation proposal

- Zod validates untrusted transport input server-side;
- dates use canonical representation and establishment locale for display;
- departure cannot erase the relationship;
- conditional fields follow an approved domain, not UI guesses;
- validation/conflict/save failures preserve input;
- duplicate-person semantics are unresolved;
- justified free text is length-bounded.

## States

Loading, empty, forbidden, scope unavailable, validation, conflict, pending,
persisted success, service/database error, retry/recovery, derived employment
status, and actionable completeness. Prototype states must be labelled.

## Authorization proposal

Safest first slice: `OWNER` read/manage, `STAFF` deny. `MANAGER` access and any
entitlement require explicit approval. Security tests later cover allowed,
wrong organization/establishment, suspended/stale access, missing permission or
entitlement, and resource-ID-only lookup.

## Sensitive data and retention

Before restricted fields/documents enter scope, approve purpose/legal basis,
role/field/action access, encryption, storage/download and malware scanning,
read/download/mutation audit, active/archive separation, retention and
deletion/legal hold, employee rights, backup/restore, and incident handling.
No blanket retention duration is approved.

## Polling / offline / device behavior

Not applicable. No polling, offline queue, provider, local service, printer,
worker, or hardware owner exists.

## Decisions that must not be guessed

Aggregate boundaries, multiple-establishment/duplicate semantics, manager
delegation, entitlement, contract vocabulary, concurrent edits, audit/history,
archive/deletion/retention, secure documents, register compliance, and
Formalités integration.

## Proposed persistence/contract changes

All domain, contracts, repositories, schema, migrations, authorization, and
audit changes remain `PROPOSAL` until data, security, privacy, retention,
migration, and cross-tenant test plans are approved.
