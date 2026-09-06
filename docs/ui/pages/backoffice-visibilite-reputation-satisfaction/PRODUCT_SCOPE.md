# Satisfaction client — Product Scope

Status: Approved bounded scope; UI design awaiting review

Visibility: Engineering

## User goal

An authorized restaurant OWNER can maintain the establishment's three approved
public destinations—Google review, Facebook and Instagram—from the existing
Satisfaction page, without leaving or replacing the Direct Customer Feedback
inbox.

MANAGER and STAFF continue to use the existing inbox according to
`reputation.read`; they do not see or receive the settings section.

## Current approved capabilities

### Existing route capability to preserve

- Authenticated Direct Customer Feedback list, counters, search, status/rating
  filters, sorting, pagination, selected detail, assignment, notes and incident
  context on `/visibilite-reputation/satisfaction`.
- Server-fixed `DIRECT` source and trusted organization plus active
  establishment scope.
- Current Backoffice navigation, shell, responsive behavior and Reputation
  access through `reputation.read`.

### Approved settings capability not yet rendered

- One section named “Liens d’avis et réseaux sociaux”.
- Exactly three nullable fields: Google, Facebook and Instagram.
- OWNER-only access through the existing independent
  `reputation.settings.manage` permission.
- One explicit Save for the three-field slice; no autosave or partial Save.
- Shared provider validation and safe public projection already implemented in
  Phase 1.
- Scoped read/write, authoritative response, no-op, conflict/reload,
  `CONFIGURATION_UNAVAILABLE`, atomic audit and no-auto-create behavior already
  implemented in Phase 2.

## Current boundaries

The Backoffice is a cloud application. The server derives the authenticated
user, active membership, organization and active establishment. Browser values
never establish organization, establishment, role, permission or tenant
authority.

The three fields belong to Reputation settings for the exact trusted
organization and establishment. The capability neither owns nor provisions the
whole `reputation_settings` record. If that record is absent, read and Save fail
closed; `brandVoice`, `publicFeedbackSlug` and other Reputation-owned fields are
not synthesized.

The independent public feedback application consumes only the validated safe
projection. Its hostname and production client-identity boundary belongs to the
concurrent `feedback-public-trusted-boundary-hardening` change and is not
redefined here.

## Approved change boundary

Phase 3A changes documentation and current-state reference images only. A later
separately authorized Phase 3B may extend the existing Satisfaction route with
one route-local settings component and server action. A later separately
authorized Phase 3C may make the minimum safe public-link rendering adjustment.

The application shell, header, navigation, sidebar, account/session display,
route structure, permission grants, shared UI primitives, contracts, database
schema and runtime topology are excluded from this page-local design.

## Out of scope

- New route, navigation entry, module or dashboard.
- MANAGER or STAFF settings access.
- Settings-row creation, upsert, seed, provisioning or defaulting unrelated
  Reputation fields.
- Autosave, per-provider Save or silent partial success.
- Google Business Profile link derivation, OAuth, provider API calls or redirect
  verification.
- QR codes, analytics, click tracking, social publishing or AI.
- URL shortening, wildcard provider hosts or network validation.
- Schema, migration, new permission, grant change or tenant-boundary change.
- Public hostname/client identity hardening owned by the concurrent change.
- Production rollout, deployment, data mutation or readiness claims.

## Proposed capabilities requiring approval

No additional Product capability is proposed by this pack. The visual
composition, responsive placement and detailed control hierarchy remain a
design proposal until the exact page-pack bytes and resulting visual reference
are approved.

## Relationships

- `/visibilite-reputation/satisfaction` remains the Direct Customer Feedback
  inbox and settings entry point.
- `/visibilite-reputation/avis` remains the broader review inbox and is not
  redesigned.
- `apps/feedback-web/src/app/[tenantSlug]/page.tsx` currently receives the three
  safe external links from the trusted public configuration and passes them to
  the success screen; Phase 3A does not modify that consumer.
- `feedback-public-trusted-boundary-hardening` may change public hostname and
  client-identity enforcement but explicitly excludes external review URL and
  settings behavior.
