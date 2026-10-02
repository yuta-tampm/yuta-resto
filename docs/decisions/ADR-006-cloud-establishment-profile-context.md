# ADR-006: Define the bounded Cloud Establishment profile and context

Status: Accepted

Date: 2026-08-27

Decision owners: YUTA

Decision type: Product

Product Decision: APPROVED

## Context

YUTA needs one explicit product boundary for the cloud restaurant/site profile
without treating every capability displayed under the Backoffice
`Établissement` navigation area as Establishment-owned. Current repository
implementation already separates the canonical cloud profile from Booking,
Authentication, Access, Tenancy, Reputation, Today, local POS, and Display
data.

## Decision

Approve Cloud Establishment as the concept representing one restaurant, site,
or branch inside an Organization.

The bounded Establishment profile is approved to own appropriate cloud
restaurant/site profile information, including the currently supported
categories:

- establishment identity;
- address and contact information;
- locale and timezone context;
- description;
- supported public contact and profile fields;
- languages;
- supported service modes;
- visibility settings; and
- supported logo and cover references.

Approved normative OpenSpec specifications may later define exact behavioral
requirements and editable fields inside this accepted boundary.

### Ownership boundaries

This decision does not transfer separately owned data into Establishment:

- Organization identity remains outside Establishment.
- Memberships, sessions, roles, permissions, and entitlements remain
  Authentication, Access, and Tenancy concerns.
- Booking settings, service periods, exceptions, availability, and reservation
  records remain Booking-owned.
- Reputation and Direct Feedback data remains Reputation-owned.
- Today may consume trusted Establishment context but does not own the profile.
- Cloud Establishment and restaurant-local POS establishment/configuration
  remain separate bounded contexts.
- No cloud-to-POS or POS-to-cloud Establishment synchronization is approved.
- Display is not made an Establishment consumer by this decision.

Route placement does not determine domain ownership.

### Rooms and tables

This decision does not approve or classify the detailed Rooms and Tables
capability. Its product scope, ownership, lifecycle, and behavior remain
separately reviewable.

### Media and external services

Approval of supported logo and cover references does not approve a media
upload or storage lifecycle, image processing, geocoding, external profile
synchronization, or any third-party provider. Those capabilities require
separate Product Decisions and specifications where applicable.

## Alternatives considered

- Treat every route under `/etablissement/*` as Establishment-owned: rejected
  because it would transfer Booking behavior based on UI placement.
- Merge Cloud Establishment with the restaurant-local POS profile: rejected
  because the cloud and local runtime/data boundaries are intentionally
  separate.
- Include Rooms and Tables or external media/provider behavior in this
  approval: rejected because those are distinct, separately reviewable
  capabilities.

## Consequences

### Positive

- Cloud Establishment has an explicit approved Product Intent boundary.
- Booking, Tenancy, Access, Reputation, Today, POS, and Display ownership stays
  explicit.
- Future behavioral specifications can refine the approved profile without
  silently expanding its domain.

### Negative

- Rooms and Tables, provider-backed media, geocoding, and external profile
  synchronization still require separate decisions.
- Approval of the bounded profile does not establish environment enablement,
  production readiness, or a deployed version.

## Follow-up

Define specific profile behavior in future approved module specifications or
normative OpenSpec specifications. Keep separately owned capabilities and
external-service lifecycles outside this boundary unless independently
approved.

## Supersedes

None.

## Superseded by

None.
