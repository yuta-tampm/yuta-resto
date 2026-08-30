# YUTA Identity / Access Product Knowledge

Visibility: Engineering

Owner: YUTA product and engineering

Proposed: 2026-08-27

## 1. Purpose

Identity / Access is the Cloud Backoffice foundation that identifies a user,
maintains an authenticated session, connects that user to an organization and
establishment, and enforces access within trusted server-derived scope.

The concepts remain distinct:

- **Authentication** verifies credentials and maintains or revokes a server
  session.
- **Identity** is the global cloud user account being authenticated.
- **Membership** connects that user to an organization and, in the current
  Backoffice flow, an establishment with a role and membership status.
- **Access** is the server-side decision that combines trusted membership scope
  with the permission and entitlement required by the owning capability.
- **Tenant context** is the immutable organization, establishment, actor,
  locale, timezone, and entitlement context resolved by a trusted server
  boundary. It is not a persisted `tenant` entity.

This file is the canonical Product Knowledge entry point for Identity / Access.
It does not replace Authentication, Tenancy, or Identity and Membership
architecture; executable schemas; code and tests; module-specific permission
rules; or future normative OpenSpec specifications.

## 2. Core concepts

| Concept              | Meaning                                                                                                                        | Owner/source                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| User identity        | Global cloud account with authentication identity, email, status, and authentication version.                                  | `users` in `packages/db-cloud`; portable contracts and primitives in `packages/auth`. |
| Session              | Revocable, hashed-token server session bound to one user, organization, establishment, and authentication version.             | `auth_sessions` through the cloud auth repository and Backoffice server boundary.     |
| Organization         | Cloud account boundary above one or more establishments.                                                                       | `organizations` in `packages/db-cloud`; Tenancy architecture.                         |
| Establishment        | One restaurant, site, or branch inside an organization.                                                                        | `establishments` and the Establishment Product Knowledge home.                        |
| Membership           | The relation granting a user scoped participation in an organization and establishment, with role and active/suspended status. | `tenant_memberships` and the tenant membership repositories.                          |
| Role                 | Current membership classification: `OWNER`, `MANAGER`, or `STAFF`.                                                             | Membership record and `@yuta/tenant` role schema.                                     |
| Permission           | Capability-specific operation allowed for a role after trusted context is resolved.                                            | Owning application/module server guard; current Backoffice mappings are code-defined. |
| Entitlement          | Establishment-scoped feature enablement checked independently of permission.                                                   | `tenant_entitlements`, projected into trusted tenant context.                         |
| Active establishment | Establishment selected from an active membership and bound into the current Backoffice session.                                | Validated membership selection/switch flow and `auth_sessions`.                       |
| Tenant context       | Server-derived immutable request context containing trusted scope, actor, locale, timezone, and entitlements.                  | `@yuta/tenant`, backed by server-only adapters and `packages/db-cloud`.               |

Organization, Establishment, Membership, and tenant context are related but
are not one entity. An entitlement enables a feature for an establishment; it
does not by itself authorize a user operation.

## 3. Users and roles

The current cloud membership roles are:

| Role      | Current general meaning                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| `OWNER`   | Organization-level access-management authority across manageable active establishments, subject to capability guards. |
| `MANAGER` | Establishment-scoped management authority; in user management, may manage `STAFF` for the selected establishment.     |
| `STAFF`   | Bounded operational access where an owning capability explicitly grants it.                                           |

A role is not a permission. Each owning capability maps operations to allowed
roles and may also require an entitlement. For example, Booking, Reputation,
Establishment, and Personnel apply different permission mappings. Navigation
or route visibility is presentation, not authorization. Organization,
establishment, membership, role, permission, and entitlement values supplied
by the browser are untrusted and cannot establish access.

`YUTA_ADMIN` and `YUTA_SUPPORT` are global system-role values, but they do not
bypass restaurant membership checks. No current Platform Admin product
behavior is established by their schema presence.

### Restaurant Knowledge authorization

Restaurant Knowledge owns the semantic meaning of two separate operations:
`restaurant-knowledge.read` and `restaurant-knowledge.manage`. Identity /
Access owns their representation, grant mapping, and integration with the
existing tenant mechanism. Both operations currently grant `OWNER` and
`MANAGER`; `STAFF` has no Restaurant Knowledge access by default. The two
operations remain distinct even though their initial grant sets are identical.

These grants do not inherit `establishment.profile.read` or
`establishment.profile.manage`. They are evaluated only after the existing
server-derived active user, organization, establishment, and membership scope
has been established. `YUTA_ADMIN` and `YUTA_SUPPORT` do not bypass that scope
or the Restaurant Knowledge grant mapping.

## 4. Current bounded scope

Verified repository implementation includes:

- password sign-in with server-side credential verification and rate limiting;
- hashed, revocable Backoffice sessions bound to user, organization, and
  establishment scope;
- a single-use, time-limited tenant-selection ticket when multiple active
  memberships are available;
- server-validated establishment selection and switching with session
  rotation;
- logout through session revocation;
- password-reset token storage, reset processing, authentication-version
  invalidation, and reset pages;
- tenant user creation or existing-account attachment, membership role/status
  administration, and active-establishment scoping;
- protections against changing the current session's membership, removing the
  last active owner, or assigning roles outside the actor's authority;
- owner-only, tenant-scoped access history for user creation, account
  attachment, and membership updates; and
- trusted authenticated and public tenant resolution plus fail-closed role,
  entitlement, establishment, membership, and module-permission checks.

The password-reset foundation does not include automated email delivery.
Likewise, creating a Backoffice user does not send an automated invitation;
initial credentials use an approved operational channel.

## 5. Product Intent versus implementation

### Approved / durable boundaries

Accepted runtime and database decisions keep cloud identity in the cloud
runtime family and keep cloud, POS, and Display persistence separate. Current
approved architecture requires server-derived tenant scope, active membership,
organization-and-establishment scoping, untrusted browser scope, fail-closed
authorization, and module-owned permission enforcement. System roles do not
implicitly grant restaurant access.

These durable security and tenancy boundaries do not, by themselves, approve
every Authentication or Access product workflow.

### Current implementation

The repository implements the bounded session, membership selection,
membership administration, access-audit, tenant-context, entitlement, and
capability-guard behavior described above, including the distinct Restaurant
Knowledge READ and MANAGE mapping. Code and tests are evidence of repository
Implemented State; they do not prove which version is deployed or that a
production environment is ready.

### Future / incomplete

Current sources explicitly defer or leave incomplete:

- automated invitation and password-reset delivery;
- external identity-provider and SSO flows beyond the current provider-neutral
  identity field;
- custom roles or a richer RBAC/ABAC administration model;
- public account registration, organization creation, ownership transfer,
  support tooling, impersonation, account deletion, and billing-linked access;
- implemented Platform Admin identity and access behavior; and
- production provider configuration and dated deployment/runtime evidence.

These items are not approved or implemented merely because the schema or
architecture can accommodate future work.

## 6. Lifecycle summary

The statuses below reuse the approved Module Registry. This approved canonical
home does not promote unresolved Product Decisions or change environment and
readiness evidence.

| Capability / Scope                  | Product Decision | Implementation | Environment  | Production Readiness | External Dependency                                                           | Review Marker                                                                         |
| ----------------------------------- | ---------------- | -------------- | ------------ | -------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Authentication / session foundation | `—`              | `IMPLEMENTED`  | `UNVERIFIED` | `NOT_READY`          | `NOT_ASSESSED` — no required delivery provider has been selected or evaluated | `NEEDS REVIEW` — architecture is current but bounded product approval is not explicit |
| Tenant / membership boundary        | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED` | `NOT_READY`          | `NOT_ASSESSED`                                                                | `OK`                                                                                  |
| Access / membership administration  | `—`              | `IMPLEMENTED`  | `UNVERIFIED` | `NOT_READY`          | `NOT_ASSESSED`                                                                | `NEEDS REVIEW` — explicit Product Decision evidence is weak                           |

## 7. Trust and authority boundaries

1. Authenticated cloud scope is derived on the server from a validated session,
   active user, active organization and establishment, and matching active
   membership.
2. Public cloud scope is resolved by the owning public server flow through its
   verified identifier or hostname boundary; public visitors do not acquire a
   Backoffice membership.
3. Browser-provided organization, establishment, membership, role, permission,
   entitlement, or tenant values are never authorization evidence.
4. Selecting or switching an establishment requires server-side membership
   validation and session rotation; a submitted membership identifier is only
   a lookup candidate.
5. Each source module enforces its own capability permission and, where
   applicable, entitlement after tenant context is resolved.
6. Identity / Access grants no ownership over Personnel, Booking, Reputation,
   Establishment, Today, or other domain records.
7. Route visibility, a navigation item, a hidden control, or client state does
   not authorize a read or mutation.
8. Tenant-owned reads and mutations repeat organization scope and, for
   establishment-owned data, establishment scope. Required checks fail closed.
9. Global system-role values do not bypass restaurant membership or
   module-specific authorization.

## 8. Source-of-truth boundaries

| Data / concern           | Owning module/source                                                          | Identity / Access relationship                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Cloud user identity      | `users` in `packages/db-cloud`                                                | Authentication resolves the global account; membership grants tenant participation.                                  |
| Backoffice session       | `auth_sessions` and the cloud auth repository                                 | Stores only hashed session tokens and trusted selected scope; server validation is required on every use.            |
| Organization             | `organizations` and Tenancy architecture                                      | Parent scope used by membership and tenant context; not owned by the user account.                                   |
| Establishment            | `establishments` and Establishment Product Knowledge                          | Selected membership scope and feature context; profile ownership remains with Establishment.                         |
| Membership               | `tenant_memberships` and membership repositories                              | Connects a cloud user to tenant scope, role, and membership status.                                                  |
| Role                     | Membership record and `@yuta/tenant`                                          | Input to capability permission checks; not itself a complete authorization decision.                                 |
| Permission               | Owning module's server-side guards                                            | Evaluated after trusted context resolution; no browser value is authoritative.                                       |
| Entitlement              | `tenant_entitlements`                                                         | Enables a module for an establishment; remains distinct from a user's permission.                                    |
| Employee dossier         | Personnel schema, repositories, and Product Knowledge                         | May reference a cloud account only through an explicitly approved relation; it is not the cloud identity record.     |
| Reservation              | Booking contracts, domain logic, and `packages/db-cloud` booking persistence  | Identity / Access supplies authenticated scope; Booking owns reservation behavior and data.                          |
| Reputation data          | Reputation sources and `packages/db-cloud` reputation persistence             | Identity / Access supplies authenticated scope; Reputation owns feedback, reviews, replies, settings, and incidents. |
| POS local user           | `local_users` and local auth tables in `packages/db-pos`, owned by Site Agent | Separate restaurant-local identity/session model; not a cloud membership.                                            |
| Anonymous public visitor | Public Booking or Feedback server boundary                                    | Has no Backoffice session or membership; the public flow resolves tenant context and applies its own eligibility.    |

## 9. Cloud identity versus POS local users

Cloud and POS identity are separate models in separate failure and persistence
domains.

| Boundary         | Runtime and data owner                        | Current identity model                                                                                      |
| ---------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Cloud Backoffice | Cloud server code through `packages/db-cloud` | Global `users`, organization/establishment memberships, cloud roles, entitlements, and Backoffice sessions. |
| Local POS        | `apps/site-agent` through `packages/db-pos`   | Restaurant-local `local_users`, local roles (`admin`, `manager`, `staff`, `kitchen`), and local sessions.   |

There is no approved or implemented cloud-to-POS identity federation or user
sync. POS operational data must not be stored in or synchronized to cloud
persistence. Agents must not merge, join, copy, or treat these user models as
equivalent without a separately accepted decision.

## 10. Related modules

| Related module            | Current relationship                                                                                                                        | Source of truth / direction                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Establishment             | Active membership selects establishment scope; profile data and establishment identity remain Establishment-owned.                          | Establishment Product Knowledge, Tenancy, and `establishments`.                     |
| Personnel                 | A cloud account is not an employee dossier; current employee identity and employment facts remain Personnel-owned.                          | Personnel Product Knowledge and personnel repositories.                             |
| Today                     | Today requires authenticated tenant context and source-module permissions; it owns no identity or access data.                              | Today Product Knowledge and Backoffice server guards.                               |
| Reservations / Booking    | Backoffice operations require active tenant scope, `booking.enabled`, and Booking permissions.                                              | Public Booking knowledge, Booking repositories, and Booking permission guards.      |
| Reputation                | Backoffice operations require active tenant scope, `reputation.enabled`, and Reputation permissions.                                        | Reputation knowledge, repositories, and permission guards.                          |
| Restaurant Knowledge      | READ and MANAGE require active tenant scope and their dedicated capability permissions; Establishment Profile grants do not authorize them. | Restaurant Knowledge semantics and Identity / Access permission guards.             |
| POS / Site Agent          | Uses an independent local user and session model; no cloud identity synchronization exists.                                                 | POS Product Knowledge, Site Agent, and `packages/db-pos`.                           |
| Public Booking / Feedback | Anonymous visitors have no Backoffice membership; server-side public resolution establishes bounded tenant context.                         | Public Booking/Reputation knowledge, ADR-002/ADR-004, and public tenant resolution. |
| Platform Admin            | `apps/platform-admin` is reserved and not implemented; global system-role schema values do not create its product behavior.                 | Repository model, Authentication architecture, and current implementation evidence. |

## 11. Current limitations and non-goals

- Repository auth code and tests do not prove production deployment or
  readiness; dated deployment/runtime evidence remains required.
- Password-reset and initial-access foundations do not provide automated email
  or invitation delivery.
- Membership is tenant access, not employee identity or an employment record.
- Entitlement, permission, role, and membership remain distinct even when a
  current guard evaluates more than one of them.
- No cloud/POS identity synchronization, federation, or shared session is
  approved.
- No implemented Platform Admin, public signup, custom-role editor,
  impersonation, or support bypass is claimed.
- This home does not define module-specific business permissions or transfer
  their data ownership into Identity / Access.

## 12. Source map

| Question                                                  | Read this source                                                                                                                                                                                                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What is the Identity / Access product and trust boundary? | This Product Knowledge home.                                                                                                                                                                                                                                    |
| How do credentials, sessions, selection, and reset work?  | [`AUTHENTICATION.md`](../../architecture/AUTHENTICATION.md).                                                                                                                                                                                                    |
| How is trusted tenant context resolved and enforced?      | [`TENANCY.md`](../../architecture/TENANCY.md).                                                                                                                                                                                                                  |
| How do users and memberships relate?                      | [`IDENTITY_AND_MEMBERSHIP.md`](../../architecture/IDENTITY_AND_MEMBERSHIP.md).                                                                                                                                                                                  |
| What owns Establishment profile and context?              | [Establishment Product Knowledge](../establishment/README.md).                                                                                                                                                                                                  |
| What owns employee dossiers and employment facts?         | [Personnel Product Knowledge](../personnel/README.md).                                                                                                                                                                                                          |
| What lifecycle assignments are approved?                  | [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and [`LIFECYCLE_STATUS_MODEL.md`](../../LIFECYCLE_STATUS_MODEL.md).                                                                                                                                            |
| How should conflicting sources be interpreted?            | [`AUTHORITY_MODEL.md`](../../AUTHORITY_MODEL.md).                                                                                                                                                                                                               |
| What is implemented now?                                  | [`apps/backoffice/src/server/auth`](../../../apps/backoffice/src/server/auth), [`packages/auth`](../../../packages/auth), [`packages/tenant`](../../../packages/tenant), and auth/membership repositories in [`packages/db-cloud`](../../../packages/db-cloud). |
| Is the cloud runtime production-ready?                    | [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md).                                                                                                                                                                                          |

## 13. Agent interpretation rules

1. Do not trust browser-provided tenant, organization, establishment,
   membership, role, permission, or entitlement scope.
2. Do not infer authorization from route, navigation, UI visibility, or client
   state.
3. Do not merge cloud user identity with Personnel employee dossiers.
4. Do not merge cloud user identity or membership with POS local users.
5. Keep role, permission, entitlement, membership, and tenant context separate
   where the current model does.
6. Separate Product Intent, repository Implemented State, environment evidence,
   and Production Readiness.
7. Do not infer a Product Decision, deployment, or provider readiness from code
   or tests.
8. When sources conflict or explicit product approval is absent, apply the
   Authority Model and retain `NEEDS REVIEW`; do not resolve by assumption.
9. OpenSpec is not currently normative for Identity / Access.

## 14. OpenSpec position

There is no normative Identity / Access specification under `openspec/specs/`
today. This home retains broader Product Knowledge plus security and trust
context. After YUTA explicitly approves OpenSpec specifications as normative,
approved specs may become the primary authority for specific behavioral
requirements inside accepted boundaries. Accepted durable security, tenancy,
runtime, and data decisions remain the highest authority for those boundaries.
No OpenSpec artifact is created or modified by this step.

## 15. Status

Status: APPROVED
