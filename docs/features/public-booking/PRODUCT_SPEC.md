# YUTA Public Booking — Product Intent and Future Direction

Status: Current product reference

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-28

## 1. Document role and authority

This document owns the broader Product Intent and future context for YUTA
Public Booking:

- the long-term product vision;
- guest and restaurant outcomes;
- experience and product principles;
- future capability direction;
- initial-release non-goals; and
- open product design space.

It does not define current Implemented State, executable database shape,
runtime ownership, exact APIs or routes, package layout, implemented
permissions, deployment, or Production Readiness.

Use the current sources according to the question:

| Question                                                  | Current authority                                                                                                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What bounded Phase 0/1 behavior exists in the repository? | [`README.md`](README.md), [`STATUS.md`](STATUS.md), current code, contracts, schemas, and tests.                                                                             |
| What remains incomplete or blocked?                       | [`STATUS.md`](STATUS.md) and [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md).                                                                          |
| What lifecycle status applies?                            | [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) using [`LIFECYCLE_STATUS_MODEL.md`](../../LIFECYCLE_STATUS_MODEL.md).                                                       |
| Who owns the runtime and persistence boundaries?          | [ADR-002](../../decisions/ADR-002-independent-public-booking-application.md), [ADR-003](../../decisions/ADR-003-database-ownership-boundaries.md), and current architecture. |
| What is the exact executable data or transport shape?     | Active db-cloud schemas/migrations, reservation contracts, repository code, and tests.                                                                                       |
| Is a target environment deployed and ready?               | Production Readiness, Deployment, capability status, and dated environment/runtime evidence.                                                                                 |
| How should a conflict be resolved?                        | [`AUTHORITY_MODEL.md`](../../AUTHORITY_MODEL.md).                                                                                                                            |

Current tracked code and tests prove repository implementation only. They do
not prove which version is deployed, externally enabled, or production-ready.
This Product Spec does not promote any lifecycle value.

## 2. Product vision

YUTA gives each restaurant a direct, restaurant-branded public booking
experience that can be linked from its website, Google Business Profile,
social profiles, QR codes, email campaigns, and other approved digital
channels.

The experience should feel like the restaurant's own booking page rather than
a marketplace listing. YUTA branding remains secondary and discreet. The
guest journey must be simple, fast, clear about its outcome, and useful to the
restaurant's actual service operation.

The long-term direction includes:

- multiple organizations and establishments;
- establishment-specific availability and booking rules;
- automatic or manual confirmation;
- multiple service periods and exceptional schedules;
- capacity-based availability that can evolve toward table-aware operation;
- communication and reminder workflows;
- source attribution and conversion understanding;
- multilingual and restaurant-controlled presentation;
- waitlists, group requests, and demand-management tools;
- embedding, custom-domain, and external-channel options;
- operational analytics and explainable recommendations; and
- clear separation between guest access, restaurant administration, and YUTA
  platform support.

These are product directions. They are not claims that every capability is
individually approved, implemented, enabled, deployed, or ready.

## 3. Product boundary

Public Booking is an anonymous public product with an independent experience
and release boundary. Restaurant reservation administration belongs to the
authenticated Backoffice. The public marketing site is not the Booking
runtime, and the reserved Platform Admin boundary is not an implemented
Booking administration product.

The product-level reasons for the independent public experience remain:

- no guest account or Backoffice session is required;
- mobile speed, traffic spikes, indexing, and social sharing matter;
- public abuse and privacy risks differ from authenticated administration;
- the restaurant must be resolved before private or bookable information is
  exposed; and
- public availability must remain usable independently of a staff browser
  session.

ADR-002 and ADR-003 own the durable runtime and data boundaries. Current
Tenancy, Authentication, Data Model, and Database Boundary documents own trust,
scope, server/client, and persistence rules. This Product Spec does not redefine
those boundaries.

### Public URL intent

The current target experience uses a shared booking domain with a stable,
restaurant-specific slug, for example:

```text
reservation.yutapro.fr/{establishmentSlug}
```

The slug is a public identifier, never trusted organization or establishment
authorization input. A documented target domain does not prove DNS, TLS,
deployment, or production enablement.

Restaurant subdomains and custom domains remain future, separately reviewable
directions. Any implementation must preserve trusted server-side resolution,
privacy-safe failure behavior, canonical URL handling, and operational
ownership.

## 4. Product users and roles

### Guest

A guest should be able to:

- discover valid dates and time slots;
- submit a reservation without creating an account;
- understand whether the result is confirmed or pending;
- access the reservation through a secure public management link;
- cancel when policy allows; and
- later request changes, join a waitlist, or submit a group enquiry when those
  capabilities are separately approved and available.

### Restaurant team

An authorized restaurant team member should be able, within current role and
permission boundaries, to:

- understand upcoming demand;
- create and manage reservations received through approved channels;
- perform valid lifecycle actions;
- configure availability, service periods, closures, and booking policy;
- understand booking source and communication state; and
- later manage waitlists, tables, areas, and operational recommendations when
  those scopes are approved.

Exact role mappings and permissions are not defined here. Current server-side
authorization and denial behavior are authoritative.

### Organization administration

Cross-establishment configuration may be useful for an organization, but it
remains subject to trusted membership, establishment scope, entitlements, and
explicit permissions. Organization scope must never become implicit
cross-tenant access.

### YUTA platform support — NEEDS REVIEW

Potential YUTA support or platform-administration outcomes include module
enablement, configuration troubleshooting, technical evidence, and reserved
slug/domain management with strict minimization. The reserved Platform Admin
boundary does not approve these Booking capabilities or any access to guest
data. Exact capabilities, identity, permissions, audit, and operating model
remain separately reviewable.

## 5. Product principles

### Mobile-first and low friction

The complete public flow must work comfortably on small screens. The core
journey should remain four conceptual steps:

1. party size;
2. date and time;
3. guest details; and
4. confirmation.

The interface should preserve entered information during correction and back
navigation, use accessible touch targets, avoid unnecessary modal stacking,
and keep progress and loading understandable.

### Restaurant-first presentation

The restaurant's identity, policy, and permitted public information are
primary. Theme options must remain controlled and accessible; arbitrary custom
CSS is not a product requirement.

### Server-authoritative availability

Displayed availability is informative until the server revalidates the
request at creation time. The guest must never receive a successful outcome
for capacity that cannot be committed safely.

### Progressive capacity evolution

The initial experience must not require table allocation. Capacity can begin
at service-period/time-slot level while preserving room for later duration,
area, table, combination, pacing, and turn-time concepts. Future table-aware
behavior must not silently alter reservation identity or lifecycle meaning.

### Explainable reservation outcomes

Guests and staff must be able to distinguish pending, confirmed, declined,
cancelled, seated, completed, and no-show outcomes where those states apply.
The UI must never imply confirmation when the server recorded a pending
request.

### Progressive complexity

Future capabilities should add value without forcing every restaurant to adopt
the same operational model. Disabled or unavailable capabilities must not
appear actionable.

## 6. Current bounded Phase 0/1

Phase 0/1 establishes the current bounded public creation, secure management,
cancellation, and Backoffice reservation foundation. The implemented scope,
known limits, tests, and remaining release work are intentionally not repeated
here:

- read [`README.md`](README.md) for current bounded behavior;
- read [`STATUS.md`](STATUS.md) for feature reconciliation, limitations,
  evidence, open product decisions, dependencies, and release blockers;
- read [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) for lifecycle status;
  and
- inspect current contracts, schemas, code, and tests for executable behavior.

Material boundaries that future work must not silently reinterpret include:

- email is currently required across the bounded Phase 0/1 flow;
- current branding, attribution, abuse protection, and Backoffice operation
  implement only bounded subsets of the broader intent;
- manual creation does not currently establish an approved capacity override;
- current notification persistence does not prove message delivery; and
- local or automated acceptance does not prove production deployment or
  readiness.

Changing one of these boundaries requires a scoped product decision and
coherent contract, schema, UI, implementation, test, and readiness work where
applicable.

## 7. Future Product Intent

The capabilities in this section are future direction. They are not described
as implemented, enabled, production-ready, or individually product-approved.
Each bounded capability still requires the authority, ownership, lifecycle,
security, provider, and operational decisions appropriate to its scope.

### Phase 2 — Communication and conversion

Future outcomes may include:

- email and SMS reminders;
- confirmation resend;
- guest modification requests with explicit restaurant approval or an
  separately approved self-service policy;
- alternative time suggestions;
- multilingual presentation;
- optional email or phone verification;
- configurable cancellation and late-arrival policies;
- branded message templates;
- communication timelines and preferences;
- conversion and source reporting; and
- establishment-specific reminder schedules.

A modification request is not permission to silently alter a confirmed
reservation. Provider choice, delivery guarantees, consent, retention,
templates, retries, observability, and operator ownership remain unresolved.

### Phase 3 — Waitlist and demand management

Future outcomes may include:

- guest waitlist registration by date, service, party size, and preferred time
  range;
- manual or automated invitations when suitable capacity becomes available;
- invitation expiry and alternative-slot suggestions;
- a restaurant waitlist board;
- conversion from a waitlist entry to a reservation;
- waitlist and conversion analytics; and
- service pacing and capacity controls.

A waitlist entry is not a reservation and must not consume confirmed capacity
before a valid conversion. Waitlist ownership, messaging, expiry, fairness,
privacy, and automation remain separately reviewable.

### Phase 4 — Areas, tables, and floor-plan outcomes

Future outcomes may include:

- dining areas and floor plans;
- table capacities, attributes, and combinations;
- manual or suggested assignment;
- conflict detection and occupancy views;
- duration and turn-time rules; and
- explicitly controlled overbooking behavior.

This direction does not assign data ownership, approve a Rooms/Tables source
module, or prescribe entities. Its relationship to Establishment, Booking,
restaurant operation, and future source modules remains `NEEDS REVIEW`.

### Phase 5 — Embedding, domains, branding, and multilingual experience

Future outcomes may include:

- an embeddable widget or approved iframe experience;
- a restaurant booking button;
- custom domains;
- controlled advanced theming and white-label options;
- multilingual public content;
- safe cross-origin resizing and conversion callbacks; and
- origin, content-security, and anti-clickjacking controls suited to the
  approved embedding mode.

No embedding mechanism, SDK, domain model, or deployment method is selected by
this intent. Custom domains and white-label behavior remain separately
reviewable.

### Phase 6 — External channels and integrations

Future direction may include:

- Google Business Profile booking links or eligible booking-provider
  integration;
- approved social-profile links;
- restaurant website or CMS integration;
- calendar export;
- email-marketing and customer-relationship integrations;
- business-intelligence exports; and
- bounded automation webhooks.

External providers must remain adapters at an application/infrastructure
boundary so core Booking behavior is not coupled to one SDK. This principle
does not approve a provider, package, credential, data transfer, webhook
contract, or production integration.

### Phase 7 — Intelligence and optimization

Future outcomes may include:

- explainable no-show risk indicators;
- alternative-slot, duration, capacity, and pacing suggestions;
- demand forecasts and anomaly detection;
- table-assignment recommendations;
- natural-language operational summaries; and
- assistance interpreting special requests.

Recommendations must remain explainable and operator-overrideable. They must
not silently change a confirmed reservation. Provider use, training/evaluation
data, accuracy thresholds, human review, privacy, cost, failure behavior, and
production authority remain separately reviewable.

## 8. Guest experience direction

### Entry and restaurant context

The page should present only approved public restaurant identity, contact,
policy, locale, and branding information. When booking is unavailable, the
guest should receive a safe, branded explanation and permitted contact path
without learning private configuration.

### Party size

Selection should be quick for common groups and accessible for other permitted
sizes. When a request exceeds the online threshold, the product should offer an
approved alternative such as restaurant contact, a future group request, or a
future waitlist rather than an unexplained generic error.

Group requests and the alternative path remain separately reviewable.

### Date and time

The guest should see relevant local dates and time slots grouped in a way that
matches the restaurant's service model. Exact remaining capacity is private
unless a separate product decision permits bounded availability messaging.

### Guest information

Collect only what is required for the bounded booking purpose. The broader
direction may support locale, accessibility needs, dietary or allergy notes,
celebrations, high-chair or stroller needs, and later area preference, but each
structured field needs an explicit purpose, owner, retention rule, and
interface decision.

### Review and result

Before submission, show a clear summary of restaurant, local date/time, party
size, contact information, and important policy. After a successful commit,
show the actual confirmed or pending outcome. A notification failure must not
turn a committed reservation into a false creation failure.

### Public reservation management

A secure public link may support viewing and cancellation today and later
modification requests, resend, calendar access, or restaurant contact. A human-
readable reference is never a public authorization credential.

### Accessibility and resilience

The flow should provide semantic labels, keyboard operation, visible focus,
sufficient contrast, non-color-only meaning, locale-aware dates/times, status
announcements, clear errors, preserved correctable input, and no horizontal
overflow. Automated checks do not replace target-device or assistive-
technology acceptance.

## 9. Availability and reservation principles

Booking availability must be calculated from establishment-owned rules and
current reserving states under the authoritative local date/time context. The
server must revalidate capacity and safely serialize competing final-capacity
requests before committing a reservation and its history.

The current executable behavior belongs to `packages/booking`, reservation
contracts, db-cloud schemas/repositories, and tests. This document preserves
only these product principles:

- capacity consumption and lifecycle transitions must be explicit;
- invalid transitions must fail rather than be guessed by a client;
- exception and closure behavior must take precedence predictably;
- public responses must not expose private capacity detail;
- reservation creation must be idempotent where retries can occur;
- guest management access must use an unguessable, revocable credential; and
- notification work must follow a successful reservation commit.

### Staff capacity override — NEEDS REVIEW

The broader intent allows for a clearly warned, explicitly permissioned,
reasoned, and audited staff override. The current bounded implementation has no
approved capacity override. Exact eligibility, limits, conflict behavior,
permission, audit reason, and reporting remain unresolved.

## 10. Booking configuration and restaurant operations

Each establishment should be able to express its approved booking policy
without inheriting another establishment's configuration. Product outcomes may
include:

- enabled/disabled public booking;
- local timezone and locale presentation;
- booking horizon and minimum notice;
- accepted party-size range;
- automatic or manual confirmation;
- service periods and per-period capacity;
- dated closures, modified hours, blocked periods/slots, or special events;
- cancellation and late-arrival policy;
- public booking policy and confirmation copy; and
- later communication, branding, source, and analytics settings.

This list is product direction, not an executable field catalog. Current
fields, constraints, edit behavior, and data ownership come from schemas,
contracts, repositories, README/STATUS, and current UI.

Broader Backoffice outcomes may include:

- day, week, service, list, and later floor-plan perspectives;
- pending, arrival, cancellation, no-show, and exception attention;
- search and filtering by approved reservation attributes;
- reservation detail, internal notes, lifecycle history, and allowed actions;
- manual creation with a truthful source;
- availability and exception management;
- communication history and resend operations; and
- source, conversion, and operational analytics.

These outcomes do not mandate a navigation tree or route layout.

## 11. Branding, attribution, and communication

### Restaurant branding

Future branding may include logo, cover image, controlled colors and surface
styles, public description, visible contact/address information, map and social
links, accessibility information, policy copy, and supported locales. The
canonical Establishment profile owns shared establishment facts; Booking owns
only Booking-specific policy and presentation choices within approved
boundaries.

### Source attribution and conversion

The product should distinguish approved direct, website, Google, social, QR,
Backoffice, phone, walk-in, partner, and other channels where useful and
truthful. Future attribution may include sanitized campaign and referrer
context plus conversion reporting.

Attribution must be bounded, length-limited, privacy-safe, and separate from
authorization. Current supported values and persistence belong to executable
contracts/schema and README/STATUS.

### Communication

Guests and restaurants should receive timely, truthful communication for
creation, pending/confirmation, cancellation, later reminders, modification,
and waitlist outcomes when those channels are approved. Delivery should be
asynchronous after the reservation transaction and resilient to provider
failure.

No provider, credential, template set, retry policy, delivery SLO, or operator
is selected by this document. Persisted notification intent is not evidence of
successful delivery.

## 12. Booking-specific safety, privacy, and trust outcomes

Current trust, tenancy, authorization, and data ownership are defined by
accepted ADRs and current architecture. Booking-specific product outcomes are:

- resolve public restaurant context on the server and expose only permitted
  fields;
- never treat browser-provided organization, establishment, membership, role,
  permission, or entitlement values as authority;
- scope restaurant-owned data to the trusted organization and establishment;
- use secure, revocable public reservation access;
- protect public creation with server validation, bounded input, idempotency,
  and proportionate rate/abuse controls;
- prefer progressive/risk-based challenges rather than forcing CAPTCHA on
  every guest without evidence;
- minimize guest data and keep personal data out of ordinary logs, analytics
  labels, public metadata, and unnecessary notifications;
- provide clear privacy information and approved controller/contact context;
- support approved retention, rights, deletion/anonymization, restricted
  access, and audit operations before production reliance; and
- fail safely without revealing whether a private reservation or tenant record
  exists.

Exact roles, permissions, security headers, rate-limit implementation,
retention periods, legal bases, providers, and production controls remain with
their current authorities and readiness gates.

## 13. SEO, performance, observability, and error principles

### SEO and public metadata

The public restaurant booking page should support an appropriate canonical URL,
restaurant-aware title/description, social preview metadata, and structured
data where approved. Private reservation-management pages must not be indexed,
listed in sitemaps, or leak guest information through metadata.

### Performance

Priorities are fast mobile rendering, minimal initial client work, optimized
public media, efficient server-side availability, separation from Backoffice
bundles, and resilience under campaign-driven traffic. Specific production
SLOs, cache policy, target volume, and alert thresholds remain separately
reviewable and require dated target-environment evidence.

### Observability and auditability

The product should make availability failures, creation outcomes, rejected
capacity attempts, duplicate submissions, cancellations, invalid access,
rate-limit events, notification failures, and transaction failures
operationally understandable without exposing guest data.

Auditable actions should distinguish guest, restaurant user, system automation,
and approved YUTA support actors. Exact events, metrics, labels, retention,
provider, dashboards, alerts, and response ownership belong to current
operations/readiness decisions.

### Safe error outcomes

- A stale slot should refresh and offer safe alternatives.
- Disabled booking should explain unavailability and show permitted contact
  details.
- Invalid or expired public access should not reveal reservation existence.
- Rate limiting should give a safe retry/contact path.
- A committed reservation with failed notification delivery should remain a
  committed reservation and expose an appropriate recovery path.

## 14. Initial-release non-goals

The initial release must not be delayed by:

- automatic table assignment or room-layout optimization;
- predictive demand or no-show modeling;
- custom-domain automation;
- complete multilingual content management;
- third-party marketplace synchronization;
- advanced customer profiles;
- complex group-event contracts; or
- a full white-label SDK.

The core initial outcome remains:

> A guest can find a valid time, submit a booking request, receive a clear
> result, and the restaurant can manage that reservation without ambiguity.

This product outcome does not itself establish production readiness; use the
current readiness and release sources.

## 15. Open design space and unresolved capabilities

Future design must not hardcode assumptions that prevent:

- several establishments in one organization;
- several areas in one establishment;
- table-aware inventory;
- custom reservation durations;
- separate online and total capacity;
- multiple confirmation policies;
- multiple notification providers;
- multiple languages;
- custom domains and embedding;
- external adapters and webhooks;
- per-source rules;
- waitlists and group requests; or
- restaurant-specific bounded fields.

The following remain explicitly separately reviewable:

| Area                           | Unresolved decision boundary                                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Staff capacity override        | Eligibility, permission, limits, reason, audit, conflict behavior, and reporting.                                             |
| YUTA super-admin/support       | Capability scope, identity, minimization, permission, audit, and relationship to reserved Platform Admin.                     |
| Rooms/Tables/floor plans       | Product and data ownership, relationship to Establishment/Booking, lifecycle, authorization, and failure behavior.            |
| Exact future permissions       | Role-to-permission mappings and server enforcement for each future capability.                                                |
| Feature flags/entitlements     | Which capabilities need a flag, its owner, scope, default, lifecycle, and server evaluation.                                  |
| Providers                      | Email, SMS, integration, intelligence, domain, analytics, and other vendor selection plus legal/security/operations evidence. |
| Custom domains and embedding   | Tenant resolution, domain verification, security policy, support, deployment, and incident ownership.                         |
| Waitlists and group requests   | Ownership, lifecycle, capacity relationship, communications, privacy, and operational workflow.                               |
| External integrations/webhooks | Provider eligibility, contracts, authentication, retries, reconciliation, data minimization, and exit behavior.               |
| Intelligence                   | Provider/model boundary, evaluation, privacy, explainability, human control, cost, monitoring, and prohibited automation.     |
| Production SLOs                | Target traffic, latency, availability, notification delivery, queue backlog, monitoring, and accountable owner.               |

No exact future capability is approved merely because it is preserved as
Product Intent in this document.

## 16. Technical authority routing

This Product Spec intentionally does not contain exact database tables or
columns, TypeScript models, API endpoint inventories, route trees, package
trees, contract catalogs, permission-name catalogs, feature-flag lists,
migration instructions, or deployment steps.

Use:

- [ADR-002](../../decisions/ADR-002-independent-public-booking-application.md)
  for the independent Public Booking runtime and Backoffice administration
  boundary;
- [ADR-003](../../decisions/ADR-003-database-ownership-boundaries.md) and
  [Database Boundaries](../../architecture/DATABASE_BOUNDARIES.md) for cloud
  persistence ownership;
- [Tenancy](../../architecture/TENANCY.md),
  [Authentication](../../architecture/AUTHENTICATION.md), and
  [Data Model](../../architecture/DATA_MODEL.md) for current trusted context,
  authorization, and schema routing;
- `packages/db-cloud/src/schema/booking.ts` and active migrations for executable
  database shape;
- `packages/contracts/src/reservations` for current transport contracts;
- `packages/booking`, current Booking/Backoffice routes, and tests for current
  repository behavior;
- [`README.md`](README.md) and [`STATUS.md`](STATUS.md) for bounded feature
  reconciliation; and
- [Deployment](../../operations/DEPLOYMENT.md) and
  [Production Readiness](../../operations/PRODUCTION_READINESS.md) for
  procedures, gates, and dated evidence.

If a proposed implementation differs from these current authorities, record
the conflict and obtain the appropriate decision; do not use this Product Spec
to silently override them.

## 17. Historical context — non-authoritative

The original master specification proposed a nine-step MVP sequence:

1. domain and schema;
2. tenant-safe services;
3. availability engine;
4. reservation creation;
5. public UI;
6. Backoffice MVP;
7. notifications;
8. security and observability; and
9. QA and pilot.

This sequence is preserved only as implementation provenance. It is not a
current progress tracker, delivery plan, package architecture, migration
procedure, or deployment authority. Current outcomes and remaining work belong
to README/STATUS; Git history preserves the detailed former prescriptions.

## 18. OpenSpec future role

This Product Spec remains the broader Product Intent, non-goal, rationale, and
future-context source. If YUTA later explicitly makes `openspec/specs/`
normative, approved OpenSpec specs may own precise behavioral requirements
inside accepted durable boundaries.

Accepted ADRs and security/runtime decisions remain higher authority for
durable product, architecture, data, and security boundaries. OpenSpec changes
remain non-normative until the approved lifecycle promotes them, and no
OpenSpec artifact by itself proves implementation, deployment, external
enablement, or Production Readiness.

---

This document deliberately describes product intent rather than replacement
architecture. Always route implementation, lifecycle, ownership, and readiness
questions to the current authorities listed above.
