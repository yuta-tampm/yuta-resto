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
Restaurant Knowledge is approved Product Intent. Its bounded `Concept &
histoire` slice is implemented in the repository; the other knowledge families
remain unimplemented.

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

- canonical data owner and persistence/domain boundary;
- operation-level permissions independent from Establishment Profile;
- approved initial data shape and behavior scope; and
- lifecycle and evidence independent from the Establishment Profile.

The initial permission boundary is resolved through distinct
`restaurant-knowledge.read` and `restaurant-knowledge.manage` operations. Both
currently grant `OWNER` and `MANAGER`; `STAFF` is denied by default. Restaurant
Knowledge owns their semantic meaning, while Identity / Access owns their
representation, grant mapping, and enforcement integration. They do not
inherit Establishment Profile permissions, and `YUTA_ADMIN` or `YUTA_SUPPORT`
does not bypass active tenant membership or these grants.

Restaurant Knowledge is the canonical owner of `Concept` and `Histoire` and of
their persistence/domain boundary. Establishment Profile owns neither datum.
This knowledge is semantically scoped to an establishment; Organization is the
tenancy/access envelope rather than the semantic owner. Page placement does
not change these decisions, and Restaurant Knowledge does not inherit the
profile repository or schema.

### Approved initial Concept & histoire behavior

- view Concept;
- manually input and edit Concept;
- view Histoire;
- manually input and edit Histoire; and
- explicitly save the complete `Concept & histoire` slice once.

Concept and Histoire are independent and optional. An empty initial state is
valid, and the initial behavior does not autosave. The implementation uses a
dedicated `restaurant_knowledge_concept_history` cloud table and Restaurant
Knowledge repository, scoped by trusted organization and establishment
context. It uses a page-local server action rather than a shared transport
contract or API route, and adds no Product content-validation limits.

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

| Capability            | Product Decision | Implementation | Environment   | Production Readiness | External Dependency | Review Marker                                                                                                                                                                                                       |
| --------------------- | ---------------- | -------------- | ------------- | -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Establishment Profile | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED`  | `NOT_READY`          | `NOT_ASSESSED`      | `OK`                                                                                                                                                                                                                |
| Restaurant Knowledge  | `APPROVED`       | `PARTIAL`      | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `OK` for the implemented Concept/Histoire slice; Cuisine/savoir-faire, Experience client, Equipe/culture, communication identity, validated-knowledge workflows and every excluded integration remain unimplemented |

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
Restaurant Knowledge READ and MANAGE are separately implemented for `OWNER`
and `MANAGER`, with `STAFF` denied. Additional validate, reject, classify, or
administrative operations remain `NEEDS REVIEW` and require separate Product
decisions.

The current cloud implementation preserves trusted server-derived
organization-and-establishment scope and fails closed. Browser-provided
organization, establishment, membership, role, permission, entitlement, or
tenant values are not authority.

Cloud, restaurant-local POS, and Display persistence remain separate under
ADR-003. Restaurant Knowledge owns the Concept/Histoire persistence/domain
boundary in `packages/db-cloud`; the dedicated table/repository is not part of
Establishment Profile. No API, provider, shared contract, local-runtime adapter,
history/provenance model, or cross-runtime synchronization exists for this
slice.

## 9. OpenSpec readiness

### Canonical analysis context

An OpenSpec analysis for a change on this page must read, in order:

1. the [Establishment Product Knowledge home](../README.md);
2. this page-level Product Knowledge home;
3. the relevant Module Registry row;
4. ADR-006, ADR-007, and other applicable accepted decisions; and
5. current implementation evidence when the question concerns Implemented
   State.

### Restaurant Knowledge readiness

The Control Tower-approved Product decisions resolve the bounded Concept &
histoire owner, semantic scope, optionality, empty state, manual view/edit, and
explicit-save behavior. The separate authorization prerequisite resolves the
initial READ/MANAGE permission mapping.

The bounded implementation selects its dedicated cloud table, repository and
page-local server action without changing canonical ownership, tenant scope or
approved behavior. Product content validation, shared/API transport, history,
providers and other knowledge families remain outside this slice.

### Pilot recommendation

The bounded Concept & histoire slice is implemented as Restaurant Knowledge,
not as an enhancement of Establishment Profile. Repository implementation does
not prove environment enablement or production readiness. This documentation
does not authorize any excluded knowledge family, consumer or integration.

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
