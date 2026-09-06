# Avis & commentaires

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-09-06

This document tracks the Phase 1 reputation module implemented across
`apps/backoffice`, `apps/feedback-web`, `packages/contracts`, and the cloud
database boundary. General marketing and legal content remains in `apps/web`.

The persistence package is `packages/db-cloud`; back-office and feedback-web
server code use it through `CLOUD_DATABASE_URL`. Reputation data is cloud-only
and always scoped by `organization_id` and, where applicable,
`establishment_id`.

The implementation sequence and current task status are maintained in
`docs/features/reputation/STATUS.md`. Update that tracker whenever Phase 1 work
is completed, added, deferred, or reordered.

## Product surfaces

- Back-office inbox: `/visibilite-reputation/avis` in `apps/backoffice`.
- Direct customer feedback inbox: `/visibilite-reputation/satisfaction`, restricted to
  feedback submitted through the public YUTA feedback website.
- OWNER-only review and social-link settings are appended to that Satisfaction
  page after the inbox. The settings manage exactly the Google review,
  Facebook, and Instagram destinations for the active establishment.
- Review detail route: `/visibilite-reputation/avis/[reviewId]`, which redirects
  to the inbox with that review selected.
- Public YUTA Avis landing page: `/` in `apps/feedback-web`.
- Public feedback form: `/{tenantSlug}` in `apps/feedback-web`.
- Public submission endpoint:
  `POST /api/public/feedback/{tenantSlug}`.

All customer-facing UI is French. Code, schemas, contracts, logs, and technical
documentation are English.

The `/visibilite-reputation` route group is canonical. Permanent redirects
preserve former `/clients/*` Backoffice URLs.

## Implemented foundation

Migration `0007_overjoyed_spencer_smythe.sql` adds the Phase 1 persistence
model:

- Unified Google and direct-feedback inbox records.
- AI analyses and version metadata.
- Reply drafts and publication states.
- Direct feedback, contact consent, and collection source tags.
- Operational incidents and internal notes.
- Google connector state with encrypted-token storage fields.
- Location-specific reputation settings.
- Reputation audit events.

Every operational record is scoped by `organizationId`; location-owned records
also contain `establishmentId`. Repository reads require a trusted tenant
context. Public submissions resolve their tenant from the request hostname and
verify that the route slug matches the location reputation settings.

For local development only,
`http://localhost:3006/{tenantSlug}` may resolve the seeded tenant by
its public feedback slug. This fallback is disabled in production. Production
must use a verified hostname in `tenant_domains` routed to `apps/feedback-web`.

## Public feedback behavior

- The restaurant feedback UI is a five-step mobile-first flow: welcome, rating,
  topics, private comment/contact details, and confirmation.
- Rating is required and must be between 1 and 5.
- Topics and the comment are optional.
- Contact information is optional.
- Consent is mandatory when an email address or phone number is supplied.
- Contact consent and its timestamp are stored.
- The raw client IP address is not stored. A salted SHA-256 hash is used for
  database-backed rate limiting.
- A hidden honeypot field provides basic bot protection.
- A client may submit at most five feedback records per 15-minute window.
- Safe configured external review links are displayed after submission
  independently of the submitted score. Null or invalid stored destinations are
  hidden, and rendered links open in a new tab with `noopener noreferrer`.
- Customer email and phone are not sent to an AI provider.

Set `PUBLIC_FEEDBACK_IP_HASH_SALT` to a long random value in every production
feedback-web environment. Production submissions fail closed if it is missing.

## Development data

The idempotent foundation seed creates reputation settings for both LUNA
establishments, with public slugs `luna` and `luna-poitiers`. It does not insert
feedback records.

The separately guarded `pnpm db:cloud:seed:demo` command preserves the existing
LUNA reputation sample and adds two synthetic direct-feedback records for LuNa
Poitiers: one positive and one negative. Both Poitiers records include their
private direct-feedback detail, contain no customer contact data, and are
distinguished by the standard demo marker.

After migrating and seeding, use:

```text
http://localhost:3006/luna
http://localhost:3006/luna-poitiers
http://localhost:3001/visibilite-reputation/avis
http://localhost:3001/visibilite-reputation/satisfaction
```

The hostname-scoped public URL is also available through
`http://luna.localhost:3006/luna` when the local environment resolves
`luna.localhost`.

## Authentication boundary

The back-office inbox now requires a database-backed server session. The authenticated
layout resolves the session user, validates the active membership, creates a
trusted tenant context, checks `reputation.enabled`, and enforces
`reputation.read` before the repository is called.

The back-office shell can switch to another active establishment membership. The
server validates the target and rotates the session before reloading the inbox,
so review queries always use the newly authenticated organization and
establishment scope.

The inbox filters, sorts, and paginates through server-backed URL parameters.
Managers can persist status and assignment changes, save or edit a manual
Google reply draft, and add internal notes. These mutations validate input with
shared contracts, repeat authorization checks on the server, and create
reputation audit events. Employees can read and act only on feedback assigned
to their own user account.

Only OWNER can load or mutate the three review/social-link settings through
`reputation.settings.manage`. MANAGER and STAFF keep their existing inbox
behavior but receive no settings model or settings surface. The server derives
organization, active establishment, membership, role, and permission from the
authenticated context before interpreting a mutation payload.

No production development-tenant fallback remains in the back-office application.
Organization, establishment, role, entitlement, and permission values are never
accepted from the browser. See `docs/architecture/AUTHENTICATION.md`.

## Review and social-link configuration

The repository now implements and locally verifies the bounded configuration
slice for `googleReviewUrl`, `facebookReviewUrl`, and `instagramUrl` without a
schema or migration change. One explicit Save updates the three-field slice
atomically and records one scoped `SETTINGS` audit for a real mutation.
Normalized no-op, invalid input, stale conflict, missing settings row, and
transaction failure do not create a partial mutation or audit.

The shared contract owns one exact HTTPS provider policy used by private
validation and the public safe projection. Google remains manual-only and
independent of Google Business Profile OAuth/location state. The capability
does not call providers, follow redirects, provision missing
`reputation_settings` rows, or infer other Reputation settings. A missing row
fails closed as configuration unavailable until a separate provisioning flow
creates it.

This behavior has passed local disposable-database and real-route Browser QA.
That evidence does not authorize production provisioning, configuration,
deployment, or enablement.

## Google Business Profile connector

Owners and administrators configure Google Business Profile from
`/parametres/integrations`. The OAuth start and callback routes bind a signed,
short-lived state value to the current user, organization, and establishment.
The callback rejects mismatched or expired state before storing credentials.

Access and refresh tokens are encrypted with AES-256-GCM before database
storage. Tokens are never returned to the browser or included in application
logs. Access tokens are refreshed server-side when they approach expiration.
The account and location selected in the UI are fetched from Google again before
the connector is marked `CONNECTED`.

Back-office environments require:

```env
GOOGLE_BUSINESS_PROFILE_CLIENT_ID=...
GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=...
GOOGLE_BUSINESS_PROFILE_REDIRECT_URI=https://app.yutapro.fr/api/reputation/google/oauth/callback
REPUTATION_CREDENTIAL_ENCRYPTION_KEY=...
```

Generate `REPUTATION_CREDENTIAL_ENCRYPTION_KEY` as 32 random bytes encoded with
base64. Never reuse `AUTH_SECRET` as the credential-encryption key. Register the
redirect URI exactly in Google Cloud, request Business Profile API access, and
enable the Account Management and Business Information APIs. The connector uses
the non-deprecated `https://www.googleapis.com/auth/business.manage` scope.

Current connector boundary: OAuth, credential storage, account discovery,
location discovery, selection, token refresh, and recovery UI are implemented.
Review import, synchronization scheduling, and Google reply reconciliation are
the next connector tasks.

## Remaining Phase 1 work

- Google review synchronization and reply publication.
- AI analysis and reply services with versioned prompts and strict structured
  output validation.
- Incidents, notifications, audit timeline, analytics, jobs, and connector
  monitoring. Each mutation must use the implemented server-side permission
  boundary.
- QR PNG/SVG downloads.
- Integration and end-to-end tests for external connectors.
