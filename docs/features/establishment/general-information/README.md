# Informations generales Page Product Knowledge

Visibility: Engineering

Owner: YUTA product and engineering

Approved: 2026-08-30

Route: `/etablissement/informations-generales`

Application: `apps/backoffice`

## 1. Purpose

`Informations generales` is a composed page in the Establishment product and
navigation domain. It brings together bounded capabilities without making the
page a single data owner:

```text
Informations generales
|- Establishment Profile
`- Restaurant Knowledge
```

The Establishment Profile is the existing approved and implemented capability.
Restaurant Knowledge is newly approved Product Intent and is not implemented.

This page-level Product Knowledge home does not replace the canonical
[Establishment Product Knowledge home](../README.md). It must be read with
[ADR-006](../../../decisions/ADR-006-cloud-establishment-profile-context.md),
[ADR-007](../../../decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md),
the Module Registry, relevant security/runtime authorities, and current
implementation evidence for Implemented State questions.

## 2. Composed-page responsibility

A route or page can present several capabilities while each capability retains
its own Product Intent, data boundary, permissions, implementation evidence,
and lifecycle.

Page composition therefore does not:

- transfer Restaurant Knowledge into the current `establishments` profile row;
- make Establishment Profile permissions authorize Restaurant Knowledge;
- copy data from another module into either capability; or
- prove that an approved capability is implemented or enabled.

## 3. Establishment Profile

### Current approved boundary

The existing profile boundary and ownership remain unchanged. It covers:

- name and description;
- structured address;
- primary phone, email, and website;
- separately modeled public contacts;
- supported logo and cover HTTP(S) URL references;
- languages;
- supported service modes; and
- supported visibility settings.

Slug, active status, locale, and timezone remain Establishment-owned context
but are not currently edited on this page. Completion and the in-page preview
are derived presentation state, not persisted profile records.

### Current ownership and permissions

- Runtime owner: `apps/backoffice` for the authenticated editor.
- Data owner: `packages/db-cloud`, with the bounded profile stored in
  `establishments`.
- Trusted scope: active organization, establishment, membership, role,
  permissions, entitlements, locale, and timezone are derived on the server.
- Read: `OWNER`, `MANAGER`, and `STAFF` through
  `establishment.profile.read`.
- Manage: `OWNER` and `MANAGER` through
  `establishment.profile.manage`; `STAFF` is read-only.

ADR-006 and the current Establishment home remain authoritative. This Product
Decision integration does not change any Establishment Profile lifecycle
dimension.

## 4. Restaurant Knowledge

### Approved Product Intent

Restaurant Knowledge is a separate bounded capability in the Establishment
domain at product and navigation level. Its initial approved knowledge families
are:

- Concept & histoire;
- Cuisine & savoir-faire;
- Experience client;
- Equipe & culture;
- Identite de communication; and
- validated restaurant knowledge.

Restaurant Knowledge may be enriched gradually over time. A restaurant
operator may add knowledge directly. Content suggested by a system or AI must
not become validated restaurant knowledge automatically; human validation is
required before promotion to validated knowledge.

### Required separate boundary

Restaurant Knowledge must have its own:

- canonical data owner and persistence boundary;
- operation-level permissions;
- approved initial data shape and behavior scope; and
- lifecycle and evidence independent from the Establishment Profile.

These details remain `NEEDS REVIEW`. Page placement does not assign them, and
Restaurant Knowledge does not inherit the profile repository, schema, or
permissions.

### Ownership invariant

```text
One datum -> one canonical owner -> multiple consumers
```

Restaurant Knowledge owns only knowledge explicitly assigned to this
capability. It must not duplicate:

- Booking settings, service periods, exceptions, availability, or
  reservations;
- Personnel employee dossiers or employment facts;
- menu, catalog, price, or restaurant-local POS operational data;
- Reputation reviews, feedback, replies, settings, or connector records; or
- Organization, membership, session, role, permission, or entitlement data.

## 5. Lifecycle

The two capability rows are intentionally independent.

| Capability            | Product Decision | Implementation | Environment   | Production Readiness | External Dependency | Review Marker                                                                                        |
| --------------------- | ---------------- | -------------- | ------------- | -------------------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| Establishment Profile | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED`  | `NOT_READY`          | `NOT_ASSESSED`      | `OK`                                                                                                 |
| Restaurant Knowledge  | `APPROVED`       | `NOT_STARTED`  | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `NEEDS REVIEW` — data owner/boundary, permissions, and initial data shape/behavior remain unresolved |

Approval of Restaurant Knowledge does not prove implementation, environment
availability, production readiness, or provider selection.

## 6. Explicitly out of initial scope

The following are not approved current behavior:

- company/legal data, including legal name, legal form, SIREN/SIRET, VAT
  number, registered office, legal representative, and administrative legal
  contacts;
- automatic knowledge detection or candidate creation from reviews, comments,
  corrections, replies, or other modules;
- detailed history, provenance, retention, source metadata, or audit behavior;
- Marketing, Facebook, or Instagram consumption;
- ownership of social-profile links;
- AI/provider, prompt, embedding, vector database, storage, job, model, or API
  implementation;
- a detailed Restaurant Knowledge role/permission matrix; and
- detailed fields, schema, requiredness, enums, limits, or validation rules.

Company/legal ownership across Organization, Establishment, a possible
employer/legal configuration, and Formalites remains `NEEDS REVIEW`.

## 7. Relationships and source-module boundaries

- Booking remains the owner of booking-specific data and behavior.
- Personnel remains the owner of individual employee dossiers and employment
  facts. Approval of `Equipe & culture` does not transfer Personnel data.
- Reputation remains the owner of reviews, feedback, replies, connectors, and
  audit records. No automatic Reputation-to-Knowledge flow is approved.
- Menus/catalog and restaurant-local POS remain separate owners. No cloud/POS
  synchronization is approved.
- Display remains an independent runtime and persistence boundary.
- No Marketing/social-content consumer contract is approved.

A future consumer must read an explicitly approved, minimized projection from
the canonical owner. Consumption does not transfer ownership.

## 8. Roles, security, and runtime boundaries

Current Establishment Profile permissions apply only to that capability.
Restaurant Knowledge read, add, edit, validate, reject, classify, and
administrative operations remain `NEEDS REVIEW` and must be defined separately.

Any future cloud implementation must preserve trusted server-derived
organization-and-establishment scope and fail closed. Browser-provided
organization, establishment, membership, role, permission, entitlement, or
tenant values are not authority.

Cloud, restaurant-local POS, and Display persistence remain separate under
ADR-003. This page-level decision does not select a Restaurant Knowledge
database, schema, provider, storage system, or runtime adapter.

## 9. OpenSpec readiness

### Canonical analysis context

An OpenSpec analysis for a change on this page must read, in order:

1. the [Establishment Product Knowledge home](../README.md);
2. this page-level Product Knowledge home;
3. the relevant Module Registry row;
4. ADR-006, ADR-007, and other applicable accepted decisions; and
5. current implementation evidence when the question concerns Implemented
   State.

### Restaurant Knowledge blocker

Restaurant Knowledge is not ready for an implementation specification. At
minimum, Product, architecture, and security review must resolve:

- the canonical data owner and boundary;
- operation-level permissions; and
- the initial knowledge data shape and behavior scope.

The resolution must be sufficient to write requirements without inventing a
schema, permission, workflow, provider, or storage design.

### Pilot recommendation

A first pilot may use a genuinely bounded enhancement of the existing
Establishment Profile only if separately approved and if its current owner and
permissions remain intact. A Restaurant Knowledge pilot should wait until the
three blockers above are resolved.

No OpenSpec change or specification is created by this Product Knowledge
integration.

## 10. Source map

| Question                                    | Read this source                                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| What makes the page composed?               | ADR-007 and this page home.                                                         |
| What owns the existing profile?             | ADR-006 and the Establishment Product Knowledge home.                               |
| What lifecycle values apply?                | `docs/MODULE_REGISTRY.md` and `docs/LIFECYCLE_STATUS_MODEL.md`.                     |
| How is trusted cloud scope enforced?        | `docs/architecture/TENANCY.md` and Identity / Access Product Knowledge.             |
| What does the current profile UI implement? | `docs/ui/pages/establishment-general-information/README.md` and tracked code/tests. |
| How are conflicts handled?                  | `docs/AUTHORITY_MODEL.md`.                                                          |
| What was reconciled before approval?        | `docs/INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_REVIEW.md`.                 |

## 11. Status

Status: APPROVED
