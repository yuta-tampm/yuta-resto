# YUTA Establishment Product Knowledge

Visibility: Engineering

Owner: YUTA product and engineering

Approved: 2026-08-30

## 1. Purpose

Establishment represents one restaurant, site, or branch inside a YUTA cloud
organization. It provides the trusted restaurant context and owns the bounded
cloud profile used by authenticated Backoffice workflows and approved public
consumers.

An Establishment is not the platform-wide Organization above it, and `tenant`
is not another persisted entity: tenant context is the server-derived
organization, establishment, membership, role, permission, entitlement,
locale, and timezone scope for a request. Cloud Establishment is also not the
restaurant-local POS installation identity; those are separate bounded
contexts with separate persistence.

This file is the canonical Product Knowledge entry point for Cloud
Establishment. The bounded profile Product Intent is approved in
[ADR-006](../../decisions/ADR-006-cloud-establishment-profile-context.md).
[ADR-007](../../decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)
approves `Informations generales` as a composed page and Restaurant Knowledge
as a separate capability in the Establishment product/navigation domain. The
[page-level Product Knowledge home](general-information/README.md) owns that
composed-page context. This home does not replace executable schemas, tenant
and authentication architecture, Booking knowledge, UI page packs, code and
tests, production-readiness evidence, or future normative OpenSpec
specifications.

## 2. Users and roles

Current authenticated access is enforced on the server from an active
establishment membership, not from route visibility or browser-supplied scope.

| Operation                                                  | Current authority                                                                                                                                           |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Read the general establishment profile                     | `OWNER`, `MANAGER`, and `STAFF` through `establishment.profile.read`.                                                                                       |
| Edit the general establishment profile                     | `OWNER` and `MANAGER` through `establishment.profile.manage`; `STAFF` remains read-only.                                                                    |
| Manage weekly booking service periods and dated exceptions | `OWNER` and `MANAGER` through Booking's `booking.settings.manage`; this is Booking mutation authority, not Establishment profile authority.                 |
| Read establishment context in other modules                | The authenticated or public server boundary resolves the relevant trusted context, then the owning module applies its own entitlement and permission rules. |

Public visitors have no Backoffice role. Public Booking and Direct Feedback
resolve bounded establishment context on the server and expose only data
allowed by their owning public flow and the applicable profile visibility
rules.

## 3. Scope

### Approved Product Intent

Cloud Establishment represents one restaurant, site, or branch inside an
Organization. Its bounded profile is approved to own appropriate cloud
restaurant/site identity, address and contact information, locale/timezone
context, description, supported public contact/profile fields, languages,
supported service modes, visibility settings, and supported logo/cover
references.

This approval is limited by ADR-006. It does not transfer Booking, Reputation,
Authentication, Access, Tenancy, Today, POS, or Display ownership into
Establishment and does not approve the detailed Rooms and Tables capability or
provider-backed media and external services.

ADR-007 separately approves Restaurant Knowledge at Product Intent level. It
belongs to the Establishment domain at product/navigation level but is not part
of the current Establishment Profile data or permission boundary.

### Current bounded scope

The verified Cloud Establishment profile owns:

- restaurant identity: name, globally unique establishment slug, active status,
  locale, and timezone;
- description and structured address;
- primary phone, email, and website;
- separately modeled public phone and email;
- HTTP(S) logo and cover-image references;
- languages and approved service modes; and
- visibility flags for supported optional public profile fields.

The current general-information editor mutates the supported profile fields
under trusted organization-and-establishment scope. It does not currently edit
the establishment slug, status, locale, or timezone. Its completion indicator
and in-page preview are derived presentation state, not persisted records.

### Related but separately owned scope

- Weekly booking service periods and dated booking exceptions are persisted and
  mutated by Booking administration, even though their current route is under
  `/etablissement/horaires-services`.
- Reservation rules, booking policy, confirmation mode, capacity rules, notice
  and booking windows belong to Booking settings under
  `/reservations/parametres`.
- Public booking availability and reservation records belong to Booking.
- Reputation settings, feedback, replies, connectors, and Direct Feedback
  behavior belong to Reputation.
- Users, memberships, roles, sessions, entitlements, and hostname mappings
  belong to Authentication, Access, and Tenancy rather than the Establishment
  profile.
- Today consumes trusted Establishment context but owns neither profile data nor
  Booking/Reputation records.

Route grouping does not change these ownership boundaries.

### Future, not-started, or proposed scope

Restaurant Knowledge is approved by ADR-007 but not started. Its canonical
data owner/boundary, operation-level permissions, and initial data
shape/behavior remain `NEEDS REVIEW` before implementation specifications.

Media upload/storage, image processing, address verification/geocoding, an
external public profile route, expanded service-mode values, external profile
synchronization, and third-party providers still require separate approval.

`CURRENT_STATE.md` describes room/table structure as core establishment product
context, but this task found no dedicated bounded Establishment lifecycle row
or specific current Product Knowledge source that authorizes this home to
classify that capability. Its detailed ownership and maturity remain
`NEEDS REVIEW` rather than being inferred here.

## 4. Capability map

| Capability / scope                      | Current boundary                                                                                                                                                      | Owner                                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| General establishment profile           | Implemented read/edit scope for supported identity, address, contact, media-reference, language, service-mode, and visibility fields.                                 | Establishment in `packages/db-cloud`.                                                                         |
| Restaurant Knowledge                    | Approved not-started capability for concept/history, cuisine/know-how, customer experience, team/culture, communication identity, and validated restaurant knowledge. | Establishment domain at product/navigation level; canonical data owner and permissions remain `NEEDS REVIEW`. |
| Establishment context                   | Identity, locale, timezone, active scope, and entitlements are resolved into trusted server context.                                                                  | Establishment records plus Tenancy/Auth resolution.                                                           |
| Hours / service periods                 | Implemented Booking administration shown under the Establishment UI area.                                                                                             | Booking.                                                                                                      |
| Dated exceptions                        | Implemented Booking exception records and mutations.                                                                                                                  | Booking.                                                                                                      |
| Public-facing establishment information | Supported profile fields are filtered by visibility rules for approved public consumers; no general public-profile route is claimed.                                  | Establishment profile; each public flow owns its presentation and eligibility.                                |
| Service modes / visibility              | Implemented profile arrays and visibility flags exposed by the general-information editor.                                                                            | Establishment.                                                                                                |
| Logo and cover references               | Implemented validated HTTP(S) references; upload, storage, deletion, and cleanup lifecycles are not approved.                                                         | Establishment owns references; no media-storage owner is selected.                                            |

## 5. Lifecycle summary

The bounded statuses below reflect ADR-006, ADR-007, and repository
implementation evidence. The existing Establishment Profile lifecycle remains
unchanged. Booking-owned capabilities retain their separate Booking lifecycle
assignments.

| Capability / Scope                    | Product Decision | Implementation | Environment   | Production Readiness | External Dependency | Review Marker                                                                                        |
| ------------------------------------- | ---------------- | -------------- | ------------- | -------------------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| Current general Establishment profile | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED`  | `NOT_READY`          | `NOT_ASSESSED`      | `OK`                                                                                                 |
| Restaurant Knowledge                  | `APPROVED`       | `NOT_STARTED`  | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `NEEDS REVIEW` — data owner/boundary, permissions, and initial data shape/behavior remain unresolved |

## 6. Source-of-truth boundaries

| Data / concern                              | Owning module/source                                                                                                                                                | Establishment relationship                                                                                                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Organization identity                       | `organizations` and Tenancy architecture                                                                                                                            | An Establishment belongs to one Organization; it does not replace or duplicate the organization record.                                                                                          |
| Establishment identity and profile          | `establishments` through the Establishment profile repository                                                                                                       | Canonical cloud owner for the bounded restaurant/site profile. Reads and writes use both organization and establishment scope.                                                                   |
| Restaurant Knowledge                        | `NEEDS REVIEW`; ADR-007 requires a boundary separate from the Establishment Profile                                                                                 | Approved Product Intent in the Establishment domain at product/navigation level; no schema, repository, permission mapping, or implementation is approved.                                       |
| Locale and timezone                         | `establishments`, projected into trusted tenant context                                                                                                             | Establishment-owned context consumed by date/time presentation and source modules; not currently editable in the general-information form.                                                       |
| Booking service periods                     | `booking_service_periods` and Booking repository/actions                                                                                                            | Establishment-scoped relation only; Booking owns period records and behavior.                                                                                                                    |
| Booking exceptions                          | `booking_exceptions` and Booking repository/actions                                                                                                                 | Establishment-scoped relation only; Booking owns exception records and behavior.                                                                                                                 |
| Reservation settings                        | `booking_settings` and Booking administration                                                                                                                       | Booking owns availability and policy. It does not own profile address, contacts, logo, cover, languages, or service modes.                                                                       |
| Public booking tenant resolution            | Public Booking repository resolves the globally unique establishment slug and verifies active organization/establishment, entitlement, and enabled Booking settings | Establishment supplies bounded identity/profile context; Booking owns eligibility, availability, and reservation behavior. Browser-supplied organization or establishment IDs are not authority. |
| Reputation / Direct Feedback tenant context | Tenancy hostname resolution and Reputation sources                                                                                                                  | Verified server-side hostname context identifies organization and establishment. Reputation owns settings, feedback, replies, and connector behavior.                                            |
| Access and membership                       | Authentication, `tenant_memberships`, sessions, permissions, and entitlements                                                                                       | Membership grants scoped access to an Establishment; the Establishment profile does not own users, roles, or membership lifecycle.                                                               |
| Today context                               | Trusted authenticated tenant context and canonical Establishment profile                                                                                            | Today consumes locale, timezone, identity, and scope without becoming another profile owner.                                                                                                     |
| Public website tenant context               | Verified hostname resolution and the bounded public tenant API where used                                                                                           | Current code can expose bounded identity context; this does not establish a general public Establishment profile or transfer profile ownership to Marketing.                                     |

## 7. Cloud Establishment versus restaurant-local POS establishment

Cloud Establishment and the POS establishment profile are separate bounded
contexts, not two interfaces over one canonical row.

| Boundary                           | Runtime and data owner                                | Current meaning                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Cloud Establishment                | Cloud server code through `packages/db-cloud`         | Organization-owned restaurant/site profile, trusted tenant context, and profile information used by approved cloud modules.                |
| Restaurant-local POS establishment | `apps/yuta-pos -> apps/site-agent -> packages/db-pos` | Fixed local `pos_establishment_profiles` singleton containing a local display name used by POS management and immutable receipt snapshots. |

The local profile is intentionally non-legal, non-fiscal, and not a cloud
identity. POS operational data and configuration are not stored in or
synchronized to cloud persistence. There is no approved cloud-to-POS or
POS-to-cloud Establishment synchronization. Agents must not join, copy, or
reconcile these records without a separately accepted decision.

Display is a third independent runtime and persistence boundary. No current
source establishes Display as an Establishment profile consumer or a sync
target.

## 8. Data and ownership

- **Runtime owner:** `apps/backoffice` owns the authenticated general-profile
  flow; approved public cloud applications consume bounded profile context from
  their own server boundaries.
- **Data owner:** `packages/db-cloud`, with the canonical profile stored in
  `establishments`.
- **Trusted scope:** authenticated operations derive active organization,
  establishment, membership, role, permissions, entitlements, locale, and
  timezone from validated server session state. Public operations use their
  documented server-side resolution boundary.
- **Profile repository:** `getEstablishmentProfile` and
  `updateEstablishmentProfile` repeat both organization and establishment
  predicates.
- **Booking administration:** `getBookingAdministration` and the Booking
  service-period, exception, and settings mutations remain Booking-owned and
  tenant-scoped.

This home intentionally does not reproduce the schema field catalog.

The ownership bullets above describe the current Establishment Profile only.
They must not be reused to assign Restaurant Knowledge to `establishments`, its
profile repository, or `establishment.profile.*` permissions.

## 9. Related modules

| Related module                | Current relationship                                                                                                                                                   | Source of truth / direction                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Organization / Tenancy        | Organization is the parent account; Tenancy derives immutable request scope for one active establishment.                                                              | Tenancy architecture, tenant adapters, and `organizations` / `establishments`.              |
| Authentication / Access       | Active membership and server session authorize Establishment access; profile data does not own users or roles.                                                         | Authentication, identity/membership architecture, permissions, and membership repositories. |
| Reservations / Public Booking | Booking reads allowed profile identity/contact/media context and establishment locale/timezone; it owns settings, periods, exceptions, availability, and reservations. | Public Booking knowledge and Booking repositories.                                          |
| Today                         | Today uses trusted Establishment identity, locale, timezone, and scope while aggregating source-owned operational information.                                         | Today Product Knowledge and authenticated tenant context.                                   |
| Reputation / Direct Feedback  | Reputation uses establishment scope and tenant resolution but owns its feedback, settings, connector, and reply records.                                               | Reputation knowledge, hostname resolution, and Reputation repositories.                     |
| POS / Site Agent              | Separate local profile and local operational context; no cloud synchronization.                                                                                        | POS Product Knowledge, Site Agent, `packages/db-pos`, and ADR-003.                          |
| Display                       | No current Establishment profile relationship or synchronization is established.                                                                                       | Display app-owned persistence and runtime boundary.                                         |
| Public website                | A bounded hostname-resolved public tenant endpoint exists, but no general public Establishment profile route is approved.                                              | Public website source and current server route; Establishment remains profile owner.        |

## 10. Current limitations and non-goals

- Establishment does not own Organization identity, users, membership, roles,
  sessions, permissions, or entitlements.
- Establishment does not own reservations, Booking settings, service periods,
  dated exceptions, or availability behavior.
- Establishment does not own Reputation or Direct Feedback records and
  settings.
- A route under `/etablissement/*` is not by itself Establishment-domain
  evidence.
- The general-information editor has no approved media upload/storage lifecycle,
  geocoding provider, or external public profile route.
- Cloud Establishment is not the POS local profile, and no synchronization is
  implemented or approved.
- Repository implementation and tests describe repository Implemented State;
  they do not prove which version is deployed or that Backoffice is
  production-ready.
- Restaurant Knowledge has no approved data owner, operation-level permission
  matrix, detailed data shape, provider, or implementation. Company/legal data,
  automatic cross-module inference, detailed history/provenance, Marketing or
  social-content consumption, and social-profile link ownership remain outside
  its initial approved scope or `NEEDS REVIEW`.

## 11. Source map

| Question                                                       | Read this source                                                                                                                                                                                                                          |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What Product Intent is approved for Establishment?             | [ADR-006](../../decisions/ADR-006-cloud-establishment-profile-context.md) for the profile and [ADR-007](../../decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md) for the composed page and Restaurant Knowledge. |
| Where should Establishment questions start?                    | This canonical Product Knowledge home.                                                                                                                                                                                                    |
| What composes the general-information page?                    | [Informations generales page Product Knowledge](general-information/README.md).                                                                                                                                                           |
| What does the general-information page currently support?      | [Establishment general-information page pack](../../ui/pages/establishment-general-information/README.md).                                                                                                                                |
| Who owns hours, service periods, and exceptions?               | [Hours and services page pack](../../ui/pages/hours-services/README.md) and current Booking administration sources.                                                                                                                       |
| How is trusted cloud scope resolved?                           | [`TENANCY.md`](../../architecture/TENANCY.md), authentication architecture, and `packages/tenant`.                                                                                                                                        |
| What owns Booking behavior and public eligibility?             | [Public Booking](../public-booking/README.md), its status source, and Booking repositories.                                                                                                                                               |
| How does Today consume Establishment context?                  | [Today Product Knowledge](../today/README.md).                                                                                                                                                                                            |
| How do Reputation and Direct Feedback use establishment scope? | [Reputation](../reputation/README.md) and ADR-004.                                                                                                                                                                                        |
| What are the current lifecycle assignments?                    | [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and [`LIFECYCLE_STATUS_MODEL.md`](../../LIFECYCLE_STATUS_MODEL.md).                                                                                                                      |
| How should conflicts be resolved?                              | [`AUTHORITY_MODEL.md`](../../AUTHORITY_MODEL.md).                                                                                                                                                                                         |
| What is implemented now?                                       | [Backoffice Establishment routes](<../../../apps/backoffice/src/app/(authenticated)/etablissement>), the profile and Booking repositories, permissions, schemas, and focused tests.                                                       |
| Is the capability production-ready?                            | [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md).                                                                                                                                                                    |
| What owns the separate local POS profile?                      | [POS Product Knowledge](../../products/pos/README.md) and [POS Establishment page pack](../../ui/pages/pos-management-establishment/README.md).                                                                                           |

## 12. Agent interpretation rules

1. Apply ADR-006 as the approved Product Decision for only the bounded Cloud
   Establishment profile/context, and ADR-007 for the composed page and
   separate Restaurant Knowledge capability.
2. Do not infer domain ownership from route or path placement.
3. Do not merge Organization, Establishment, membership, Booking, Reputation,
   or POS-local data into one model.
4. Use trusted server-derived tenant context; browser-provided scope is not
   authority.
5. Do not infer cloud-to-POS or POS-to-cloud synchronization.
6. Do not infer approval or lifecycle status for Rooms and Tables from ADR-006.
7. Separate Product Intent from repository Implemented State.
8. Do not infer Product Decision from code, schema fields, navigation, or page
   implementation.
9. When sources conflict or authority is insufficient, apply the Authority
   Model and retain `NEEDS REVIEW` rather than choosing silently.
10. Do not infer Restaurant Knowledge data ownership or permissions from its
    Establishment product/navigation placement or from current profile code.
11. OpenSpec is not currently normative for Establishment.

## 13. OpenSpec position

There is no normative Establishment specification under `openspec/specs/`
today. This home retains broader Product Knowledge context and ownership
boundaries. After YUTA explicitly approves OpenSpec specifications as
normative, approved Establishment specs may define specific behavioral
requirements inside accepted product, architecture, and security boundaries.
Restaurant Knowledge is not ready for an implementation specification until
its data owner/boundary, operation-level permissions, and initial data
shape/behavior scope are resolved. No OpenSpec artifact is created or modified
by this step.

## 14. Status

Status: APPROVED
