# Public Booking / Reservations Product Knowledge

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-09-29

## Purpose and authority

This document is the canonical repository home for the bounded
**Reservations** product scope and the current **Public Booking** implementation.
It reconciles the Human-fixed V1 direction with repository architecture,
contracts, persistence, authorization, routes, tests, and readiness evidence.

The reconciliation is scope-bound:

- Product decisions describe the approved Reservations capability.
- Implementation statements describe only evidence that exists in this
  repository.
- Executable schemas, enums, state transitions, and permissions remain
  implementation contracts unless a Product decision explicitly adopts them.
- The legacy Reservations Page Chat and its extracted report remain provenance
  evidence only. Repository knowledge is canonical for this exact migrated
  scope after repository-only acceptance and Human-authorized cutover.
- This document does not authorize deployment, production use, a provider,
  legal compliance, payment behavior, another module, or a future direction.

Use the following sources by authority:

| Question                                                                                 | Repository authority                                                                                                                                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bounded Reservations Product truth and current repository reconciliation                 | This document                                                                                                                                                 |
| Durable broader Product intent                                                           | [`PRODUCT_SPEC.md`](PRODUCT_SPEC.md)                                                                                                                          |
| Current implementation, evidence, limitations, and release blockers                      | [`STATUS.md`](STATUS.md)                                                                                                                                      |
| Application and package placement                                                        | [ADR-002](../../decisions/ADR-002-independent-public-booking-application.md)                                                                                  |
| Independent Today projection already approved outside the legacy Reservations discussion | [ADR-005](../../decisions/ADR-005-today-operational-steering.md) and [`../today/README.md`](../today/README.md)                                               |
| Planning boundary                                                                        | [`../planning/README.md`](../planning/README.md)                                                                                                              |
| Runtime contracts and persisted behavior                                                 | `packages/contracts`, `packages/booking`, and `packages/db-cloud`                                                                                             |
| Release and production authority                                                         | [`../../operations/PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md) and [`../../operations/DEPLOYMENT.md`](../../operations/DEPLOYMENT.md) |

## Human-fixed current V1

The approved current V1 includes these capability outcomes:

1. a public YUTA reservation page;
2. a public link usable from a restaurant's Google Business Profile;
3. reuse of existing establishment information;
4. reservable services, days, hours, and slots;
5. reservable capacity expressed in covers;
6. guest space preferences without guaranteed resource assignment;
7. an operational guest form;
8. confirmation email;
9. secure guest modification;
10. secure guest cancellation;
11. reminder email;
12. a day view;
13. a service view;
14. reservation and cover counts;
15. manual and telephone entry;
16. restaurant-side modification and cancellation;
17. separate guest requests and internal notes;
18. reservation source;
19. arrival, completion, cancellation, and no-show tracking;
20. search and history; and
21. reservation settings that define how the restaurant accepts reservations.

This is Product scope. It does not mean that every item is implemented, ready,
or legally qualified.

### Current-V1 exclusions and long-term directions

The following directions are explicitly outside current V1. Human approval is
limited to their long-term direction; their design, provider, data model,
permissions, contracts, and delivery are unresolved.

| ID     | Long-term direction                  | Current boundary                                                                                     |
| ------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| LTD-01 | Precise table assignment             | No table/resource model or allocation algorithm is approved.                                         |
| LTD-02 | Interactive floor plan               | No floor-plan capability is approved for current V1.                                                 |
| LTD-03 | Waitlist                             | No waitlist state, priority, notification, or conversion contract is approved.                       |
| LTD-04 | SMS                                  | No provider, consent, template, schedule, delivery, or retry contract is approved.                   |
| LTD-05 | Card imprint or guarantee            | No provider, authorization, capture, fee, cancellation, refund, or legal rule is approved.           |
| LTD-06 | Prepayment                           | No payment, accounting, refund, or settlement contract is approved.                                  |
| LTD-07 | Reserve with Google                  | A normal YUTA booking URL can be used from Google; no Google booking integration is approved.        |
| LTD-08 | Third-party provider synchronization | Provider examples do not approve a provider, API, one-way or two-way synchronization, or write-back. |

## Product decisions reconciled with repository evidence

`HUMAN_DECIDED_CURRENT` records bounded Product direction. The implementation
column is descriptive evidence and cannot narrow or expand that decision.

| ID    | Human-decided Product direction                                                                    | Repository reconciliation                                                                                                                                                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RD-01 | YUTA provides a public reservation page.                                                           | Implemented in `apps/booking-web` for an enabled establishment slug.                                                                                                                                                                                         |
| RD-02 | The restaurant can use the YUTA public link from its Google Business Profile.                      | A normal public URL and bounded `source=GOOGLE` attribution are supported. Reserve with Google and provider synchronization are absent.                                                                                                                      |
| RD-03 | Existing establishment information is reused rather than duplicated in Reservations.               | The public projection resolves canonical establishment name, address, phone, logo, and related public fields server-side. Booking owns booking-specific welcome copy, policy, and rules.                                                                     |
| RD-04 | The restaurant configures reservable services, days, hours, slots, and rules.                      | Weekly service periods, dated exceptions, horizon, notice, slot interval, duration, and cancellation lead time are implemented. Exact Product formulas remain undecided.                                                                                     |
| RD-05 | Availability and operations account for covers as well as reservation count.                       | Party size and service-period capacity are implemented; server-side creation rechecks capacity under an advisory lock.                                                                                                                                       |
| RD-06 | A guest can express a space preference without guaranteed assignment.                              | Decided but not implemented. No space preference, space capacity, table, or resource field exists in the current contract.                                                                                                                                   |
| RD-07 | The flow captures operational guest and reservation information.                                   | Current public creation requires first name, last name, email, phone, date, time, and party size and accepts optional special requirements. Space preference is absent. Current requiredness is implementation evidence, not a general Product field policy. |
| RD-08 | A confirmation email is part of V1.                                                                | Decided but not delivered. Transactions enqueue provider-neutral email intents; no worker or provider sends them. The exact trigger still depends on the request/confirmation decision.                                                                      |
| RD-09 | A guest can securely modify and cancel a reservation.                                              | Secure token-based viewing and cancellation are implemented. Guest modification is decided but not implemented. Token hashes are tenant-bound; Product rules for expiration and modifiable fields remain unresolved.                                         |
| RD-10 | A pre-reservation reminder email is part of V1.                                                    | Decided but not implemented. No reminder schedule, worker, provider, retry policy, or delivery evidence exists.                                                                                                                                              |
| RD-11 | Restaurant users can work by date and by service.                                                  | Day and week lists are implemented. A dedicated service view/filter is decided but not implemented.                                                                                                                                                          |
| RD-12 | Restaurant users can enter reservations received manually or by phone.                             | Manual Backoffice creation is implemented, capacity-checked, and currently records source `BACK_OFFICE`.                                                                                                                                                     |
| RD-13 | Restaurant users can modify or cancel a reservation.                                               | Guest/time/party edits and allowed lifecycle actions are implemented with tenant-scoped server authorization.                                                                                                                                                |
| RD-14 | Guest-supplied requests and internal restaurant notes remain separate.                             | `specialRequirements` is stored on the reservation; internal notes use a separate table and authorization path.                                                                                                                                              |
| RD-15 | YUTA records operational reservation provenance.                                                   | A current source enum is implemented. Its exact values are not adopted here as the permanent Product taxonomy.                                                                                                                                               |
| RD-16 | V1 tracks confirmed, arrived, completed, cancelled, and no-show concepts.                          | The current implementation also has `PENDING` and `DECLINED` and enforces an explicit transition graph. That graph is executable behavior, not a final Product lifecycle decision.                                                                           |
| RD-17 | V1 includes search and reservation history.                                                        | Status history, audit events, and date-bounded listing are implemented. General search and approved retention semantics are absent.                                                                                                                          |
| RD-18 | Reservation settings define acceptance rules rather than serving only as a free-form field editor. | Booking rules, service periods, exceptions, and public copy are implemented. Spaces, field configuration, and delivered communication settings are absent.                                                                                                   |

## Reconciled current implementation

### Product and lifecycle status

| Axis                           | Current state          | Meaning                                                                                                                |
| ------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Reservations Product direction | `APPROVED`             | The bounded V1 and RD-01 through RD-18 above are current Product decisions.                                            |
| Phase 0/1 implementation       | `IMPLEMENTED`          | The repository contains the narrower behavior described below.                                                         |
| Production environment         | `UNVERIFIED`           | Production project, domain, variables, migrations, probes, and provider delivery are not verified here.                |
| Operational readiness          | `BLOCKED`              | Email delivery, target-environment evidence, manual assistive-technology acceptance, and release approval remain open. |
| Legacy Page Chat role          | `LEGACY EVIDENCE ONLY` | The Human-authorized cutover changes knowledge routing only for this exact migrated Reservations scope.                |

### Runtime and routes

`apps/booking-web` is the independent mobile-first public application. It
resolves an establishment from a globally unique slug on the server and is
intended for:

- public creation: `https://reservation.yutapro.fr/<establishment-slug>`;
- secure management:
  `/<establishment-slug>/reservation/<public-token>`.

The target hostname is documented but not production-verified.

Backoffice routes are:

- `/reservations` for day/week lists, manual creation, and reservation detail;
- `/reservations/parametres` for global booking rules;
- `/etablissement/horaires-services` for weekly service periods and dated
  exceptions.

Permanent redirects preserve former `/operations/reservations/*` URLs.

### Public flow

The current public interface has five steps: party size, date, time, required
guest name/phone/email plus optional special requirements, and confirmation.
It supports automatic or manual confirmation, an ICS calendar download,
token-protected detail, and token-protected cancellation.

The page projects establishment name, configured logo or YUTA fallback, welcome
copy, visible phone/address, and booking policy. Cover image and public email
are resolved but are not rendered. Custom themes and multilingual content are
not implemented.

### Eligibility, tenancy, and authorization

Public booking is available only when:

1. the organization is active;
2. the establishment is active;
3. the establishment has the enabled `booking.enabled` entitlement; and
4. booking settings are enabled.

The public client supplies a slug, never trusted organization or establishment
identifiers. Server resolution establishes the tenant. Reservation and
Backoffice queries use both `organizationId` and `establishmentId`.

Backoffice permissions currently map as follows:

- `OWNER`: read, operate, and manage settings;
- `MANAGER`: read, operate, and manage settings;
- `STAFF`: read and operate, but cannot manage settings.

Platform and system roles do not bypass active restaurant membership. These
roles are current implementation evidence; the final Product authorization
matrix remains RES-17.

### Availability and capacity

The pure `packages/booking` domain computes availability from:

- establishment timezone;
- booking horizon and minimum notice;
- weekly service periods;
- dated closures, modified hours, and blocked slots;
- slot interval and reservation duration;
- capacity consumed by `PENDING`, `CONFIRMED`, and `SEATED` reservations.

Local date/time plus a timezone snapshot and UTC start/end instants are
persisted. Overnight periods are rejected. The create transaction obtains a
PostgreSQL advisory lock for establishment/date/time, recalculates capacity,
and atomically writes the reservation, initial history, audit event, and email
outbox intent.

This is the current algorithm. It does not decide the unresolved Product model
for physical versus reservable capacity, overlapping reservations, buffers,
spaces, tables, or authorized overrides.

### Request, confirmation, and lifecycle

The current repository uses one reservation record. Public submission creates:

- `CONFIRMED` when the establishment uses automatic confirmation; or
- `PENDING` when it uses manual confirmation.

Current executable statuses are `PENDING`, `CONFIRMED`, `DECLINED`,
`CANCELLED`, `SEATED`, `COMPLETED`, and `NO_SHOW`. The domain package controls
allowed transitions.

This implementation does not settle whether Product truth should distinguish a
reservation request from a confirmed reservation as separate concepts,
records, or versions. It also does not approve the executable enum as the
permanent Product lifecycle.

### Guest details, notes, and sources

Current reservation persistence keeps reservation-specific guest name, email,
phone, party size, optional special requirements, source, policy acceptance,
and marketing consent. It does not establish a reusable customer profile.

Guest special requirements and internal restaurant notes have separate
persistence and access paths. Their content policy, sensitive-data rules,
retention, deletion, and export behavior remain unresolved.

Current source values are `DIRECT`, `GOOGLE`, `FACEBOOK`, `INSTAGRAM`, `TIKTOK`,
`QR_CODE`, `WEBSITE`, `PHONE`, `BACK_OFFICE`, and `OTHER`. Public query
attribution is bounded to supported public sources; manual creation currently
hardcodes `BACK_OFFICE`. These labels do not prove a provider integration.
UTM, referrer, campaign, and conversion analytics are not persisted.

### Communications

A successful booking transaction creates a provider-neutral email outbox row.
No worker claims records, no approved provider sends mail, and no operational
retry, dead-letter, resend, schedule, or monitoring owner is implemented.
Consequently:

- confirmation email is Product-approved but not delivered;
- reminder email is Product-approved but not implemented; and
- SMS remains a long-term direction outside current V1.

No repository evidence may be described as successful email delivery.

### Restaurant operations

The Backoffice implements day/week lists, manual creation, detail, guest/time/
party edits, internal notes, current lifecycle actions, status history,
settings, service periods, and dated exceptions.

Current limitations include:

- no dedicated service filter/view;
- no general guest/reference search;
- no space preference or space/resource capacity;
- no capacity override;
- manual creation depends on enabled public-booking configuration;
- manual source is not selectable;
- no notification history or resend operation; and
- service periods and exceptions are deleted/recreated rather than edited in
  place.

### Guest modification and cancellation

The secure public token is stored only as a SHA-256 hash. Detail and
cancellation resolve the token within the establishment scope. Cancellation
applies the current deadline and transition rules and records history and an
outbox intent.

Secure guest modification is not implemented. The exact editable fields,
revalidation, cutoffs, token expiry, restaurant approval, and customer
notification behavior remain unresolved.

### Establishment, Today, and Planning

Establishment Profile remains the owner of shared public facts such as name,
address, phone, logo, and public profile data. Reservations owns booking
eligibility, service periods, exceptions, capacity, booking policy, and
reservation records. Opening hours must not be inferred to be reservable hours.

Today has an independently approved, implemented read-only relationship under
ADR-005: it summarizes the current establishment's Reservations data and
booking services/exceptions and links back to Reservations. Reservations
remains the source owner; Today does not write back.

The legacy proposal to project Reservations into Today and Planning remains
`PROPOSED_NOT_APPROVED`. ADR-005 does not approve a combined Today/Planning
contract, and no current Planning projection, staffing forecast, mutation, or
write-back is approved.

### Product directions absent from current implementation

The following current-V1 directions are decided but not fully implemented:

- space preference;
- delivered confirmation email;
- secure guest modification;
- reminder email;
- a dedicated service view/filter;
- general reservation search; and
- the spaces, form-field, and delivered-communication parts of reservation
  settings.

The eight long-term directions are also not implemented as Reservations
capabilities. Repository code in another module must not be used to imply that
they are.

## Proposals retained without approval

This ledger preserves historical assistant shaping so a repository-only reader
can recover its exact payload without treating it as authority. Every entry is
`PROPOSED_NOT_APPROVED`. Current routes, executable contracts, UI, and status
transitions do not retroactively approve a proposal or require implementation.

| ID   | Classification          | Historical proposal payload                                                                                                                               | Boundary and non-inference                                                                                                                                                                                                |
| ---- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-01 | `PROPOSED_NOT_APPROVED` | Exactly two admin pages: `Réservations` and `Paramètres réservations`.                                                                                    | Proposed after `ok on fixe ce périmètre`, with no separate Human approval. Current routes do not approve this structure, it does not prohibit other routes or composition, and it does not authorize a navigation change. |
| P-02 | `PROPOSED_NOT_APPROVED` | Exact `Paramètres réservations` subsections: `Disponibilités`, `Capacité`, `Espaces`, `Formulaire client`, `Confirmation & rappels`, and `Page publique`. | Assistant shaping only. Current settings do not make this list canonical and do not authorize creating or renaming routes, tabs, or sections.                                                                             |
| P-03 | `PROPOSED_NOT_APPROVED` | Open reservation detail in a drawer without changing page.                                                                                                | UI proposal only; it does not establish the current or required detail presentation.                                                                                                                                      |
| P-04 | `PROPOSED_NOT_APPROVED` | Exact list columns: `Heure`, `Client`, `Couverts`, `Espace`, `Note`, `Source`, and `Statut`.                                                              | Mock/UI shaping only. Current columns do not approve this list, and the proposal does not authorize fields or UI changes.                                                                                                 |
| P-05 | `PROPOSED_NOT_APPROVED` | Exact six-step public sequence: 1. `nombre de personnes`; 2. `date`; 3. `heure`; 4. `préférence`; 5. `coordonnées`; 6. `résumé/confirmation`.             | UX proposal only. The executable five-step flow does not make this sequence canonical, and `résumé/confirmation` does not resolve request versus confirmed booking.                                                       |
| P-06 | `PROPOSED_NOT_APPROVED` | Ask for party size before date.                                                                                                                           | UX recommendation only. The current order does not make it a durable rule.                                                                                                                                                |
| P-07 | `PROPOSED_NOT_APPROVED` | Certain structural fields would be required; other fields would be configurable.                                                                          | The exact mandatory/optional policy was not decided. This does not authorize a per-field matrix or override current executable validation; RES-08 remains unresolved.                                                     |
| P-08 | `PROPOSED_NOT_APPROVED` | Apply the same availability engine to public and manual reservations.                                                                                     | Architecture/business-rule proposal only. Current code reuse does not make it Product architecture.                                                                                                                       |
| P-09 | `PROPOSED_NOT_APPROVED` | Allow an authorized user to force a reservation beyond capacity with a warning.                                                                           | Not approved or implemented. It does not authorize an override, permission, warning, or capacity change.                                                                                                                  |
| P-10 | `PROPOSED_NOT_APPROVED` | Exact public URL form such as `reservation.yutapro.fr/<restaurant>`.                                                                                      | No hostname or route received Product approval. The documented target remains environment-unverified and does not become permanent route authority.                                                                       |
| P-11 | `PROPOSED_NOT_APPROVED` | `Copier le lien` and `Voir la page publique` actions in Settings.                                                                                         | UI proposal only; it does not require current actions or page architecture.                                                                                                                                               |
| P-12 | `PROPOSED_NOT_APPROVED` | Exact chain `Confirmée → Arrivée → Terminée`, with `Annulée` and `No-show`.                                                                               | Those operational concepts belong to current V1, but this chain is not the canonical lifecycle. Current enums and transitions do not approve it; RES-01 and RES-02 remain unresolved.                                     |
| P-13 | `PROPOSED_NOT_APPROVED` | Later use expected reservation and cover counts as input to `Aujourd’hui`, `Planning`, or other operational tools.                                        | Assistant proposal only, outside the explicit V1/later table. No projection contract, staffing forecast, mutation, or write-back is approved. Today's separate ADR-005 read-only relationship remains independent.        |

Historical ideas that placed establishment facts inside Reservations, treated
Reservations mainly as a free-form field editor, or treated a space preference
as a guaranteed placement are superseded by RD-03, RD-18, and RD-06.

## Unresolved Human decision packets

Each packet groups decisions that must remain coherent. It is one Product or
governance decision packet, not one implementation task. `Current evidence`
describes the repository and never resolves the open question by itself.

| ID     | Exact question and affected capability                                                                                                                                                     | Current evidence                                                                                                         | Why unresolved, review status, and prohibited inference                                                                                                       | Required authority                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| RES-01 | What is a reservation's canonical identity, and are a request and confirmed reservation distinct concepts, records, or versions?                                                           | One persisted reservation record becomes `PENDING` or `CONFIRMED`; a separate public reference exists.                   | Product semantics remain open. Do not infer that a row or submission is an accepted booking.                                                                  | Product, domain architecture, and data authority.                                  |
| RES-02 | What is the canonical lifecycle, transition graph, actor policy, reversal, and correction behavior?                                                                                        | The executable enum and transition graph cover pending through no-show/completion.                                       | Product adoption and cancellation/no-show correction are open; legal/privacy effects require review. Do not promote the code enum to permanent Product truth. | Product, domain, legal/privacy, and operations authority.                          |
| RES-03 | What are the Product rules for service, local date/time, timezone, duration, slot generation, overnight periods, notice, and horizon?                                                      | The current pure domain implements configurable values and rejects overnight periods.                                    | The current algorithm is implementation evidence. Do not infer universal formulas or that requested and confirmed time differ.                                | Product and domain architecture authority.                                         |
| RES-04 | How are physical and reservable capacity, overlaps, buffers, blocks, party-size edits, overbooking, and override defined?                                                                  | Current capacity is per service period/slot, consumed by three statuses, and protected by a database advisory lock.      | Physical-capacity meaning and overrides are open. Do not infer a capacity hold or table-aware allocation.                                                     | Product, domain/data, security, and operations authority.                          |
| RES-05 | What are spaces, preferences, resources, and tables, and when can a preference become an assignment?                                                                                       | No current space/resource/table contract exists.                                                                         | Current V1 approves only a non-guaranteed preference; table assignment is long-term. Do not invent space capacity or guaranteed placement.                    | Product, domain/data, and restaurant-operations authority.                         |
| RES-06 | Are guest details reservation-specific, or is there a reusable customer/CRM identity or cross-establishment profile?                                                                       | Current details live on each reservation.                                                                                | Privacy/security review is required. Do not infer CRM identity, recognition, sharing, or reuse.                                                               | Product, data, legal/privacy, and security authority.                              |
| RES-07 | What are the canonical public entry points, domain/route, trusted slug contract, link owner, and external-listing behavior?                                                                | Server-side slug resolution and a target hostname/route are implemented/documented but production-unverified.            | A working route does not approve permanent Product URL, deployment, or a Google provider contract.                                                            | Product, architecture, operations, and external-channel authority.                 |
| RES-08 | Which guest-form fields are configurable, required, validated, localized, or tied to contact preference?                                                                                   | Current contracts require name, email, phone, date/time, and party size and allow optional special requirements.         | Legal/privacy/security review is required. Do not convert executable current requiredness into final configurable-form policy.                                | Product, legal/privacy, security, UX, contracts, and data authority.               |
| RES-09 | What triggers confirmation/reminder messages, on what schedule, through which provider/templates, consent, delivery states, retries, resend, and owner?                                    | Only transactional email intents exist; there is no worker, provider, or reminder schedule.                              | Current external legal/privacy/security/provider/operations review is required. Do not infer sent, delivered, read, or acknowledged communication.            | Product, legal/privacy, security, provider, engineering, and operations authority. |
| RES-10 | Which secure guest modifications/cancellations are allowed, until when, with what revalidation, token expiry, reasons, and restaurant approval?                                            | Token-protected view/cancellation exists; guest modification does not.                                                   | Legal/privacy/security review is required. Do not infer editable fields, token lifetime, or silent changes to confirmed bookings.                             | Product, domain, legal/privacy, security, and operations authority.                |
| RES-11 | How should manual/phone entry handle eligibility, source selection, corrections, capacity, and audited override?                                                                           | Current Backoffice entry reuses capacity-checked creation, requires enabled public booking, and hardcodes `BACK_OFFICE`. | Override and source correction are unapproved. Do not infer staff can bypass capacity or choose any source.                                                   | Product, security, domain, and restaurant-operations authority.                    |
| RES-12 | What content, access, sensitive-data, retention, and history rules govern guest requests and internal notes?                                                                               | Separate reservation and internal-note storage exists.                                                                   | Current legal/privacy/security review is required. Do not infer free-form content is safe or retention is approved.                                           | Product, legal/privacy, security, data, and operations authority.                  |
| RES-13 | What is the canonical source taxonomy, campaign model, external-channel meaning, and provider boundary?                                                                                    | A bounded executable enum and public query mapping exist; manual entry uses `BACK_OFFICE`.                               | Product/provider/privacy decisions remain open. Do not infer source labels are integrations or approve tracking.                                              | Product, data, privacy, provider, and analytics authority.                         |
| RES-14 | What is the Establishment projection contract, refresh behavior, opening-hours distinction, and write-back policy?                                                                         | Server-side projection reuses current Establishment fields; booking schedules are separately owned.                      | Contract/version semantics are open. Do not infer opening hours are reservable hours or allow Reservations write-back.                                        | Product owners for both scopes plus architecture/data authority.                   |
| RES-15 | May Reservations project beyond the current ADR-005 Today summary, especially into Planning, and is any write-back allowed?                                                                | Today reads a bounded current-establishment summary; Planning has no integration.                                        | The legacy combined projection is unapproved. Do not infer staffing forecasts, Planning consumption, mutation, or write-back.                                 | Product owners for each scope and cross-module architecture/data authority.        |
| RES-16 | Which search fields, history/audit semantics, retention, deletion, anonymization, and export rules apply?                                                                                  | Status history, audit events, and date-bounded listing exist; general search and approved retention do not.              | Current legal/privacy/security review is required. Do not infer immutable audit, retention duration, deletion, or export rights.                              | Product, legal/privacy, security, data-governance, and operations authority.       |
| RES-17 | What are Product roles, tenant ownership, cross-establishment denial, support access, and sensitive-field permissions?                                                                     | Active membership, entitlement, `organizationId` plus `establishmentId`, and current role permissions are enforced.      | Final Product authorization remains open. Do not infer central multi-establishment access or support bypass.                                                  | Product, security, tenancy architecture, and data authority.                       |
| RES-18 | What future waitlist and walk-in boundary, states, priority, notification, and conversion behavior should exist?                                                                           | No waitlist model exists; manual reservation entry exists.                                                               | Waitlist is long-term and external/privacy review may be required. Do not infer a walk-in or queue model.                                                     | Product, operations, domain/data, privacy, and communications authority.           |
| RES-19 | What future guarantee, prepayment, fee, cancellation, refund, accounting, settlement, and provider model should exist?                                                                     | Reservations contains no payment or guarantee contract.                                                                  | Current legal/consumer/payment/security review is required. Do not infer payment from confirmation or another module.                                         | Product, legal/consumer, payment, accounting, security, and provider authority.    |
| RES-20 | What exact Backoffice/public navigation, list/detail shape, page pack, accessibility, and QA acceptance are approved?                                                                      | Current routes and automated accessibility/browser tests provide implementation evidence.                                | Product/UI approval and manual acceptance remain open. Do not infer current or Page Chat mock shape is canonical.                                             | Product, design, accessibility, QA, and engineering authority.                     |
| RES-21 | What current legal, privacy, consumer, and security qualification applies to contact data, consent, notices, notes, public links, retention, communication, and future providers/payments? | Repository fields and safety controls exist, but no current compliance evidence was produced.                            | External review is required. Do not infer compliance from schemas, links, flags, or tests.                                                                    | Current external legal/privacy/consumer/payment/security authority.                |
| RES-22 | Which environment, provider, deployment, monitoring, operational ownership, target evidence, and production release gates are approved?                                                    | Local checks and readiness endpoints exist; environment and launch gates remain blocked/unverified.                      | Repository success is not production authorization. Do not infer deployment, monitoring, delivery, SLO, or go-live.                                           | Product release, engineering, security, operations, and Human go/no-go authority.  |

`HUMAN_DECISIONS_REQUIRED` is therefore **22**.

## Explicit non-inferences

Do not infer any of the following from this reconciliation:

- submission equals confirmation;
- the current enum or transition graph is permanent Product truth;
- an email outbox proves a sent, delivered, or read email;
- a source label proves a provider integration;
- a Google link means Reserve with Google;
- opening hours equal reservable hours;
- a space preference guarantees a room, zone, table, or resource;
- the current required fields define the final configurable-form policy;
- guest details create a reusable customer profile;
- current repository permissions are the final Product authorization policy;
- history rows establish an approved retention, deletion, or audit policy;
- Today's approved read-only summary approves Planning or another projection;
- local tests prove production readiness;
- an approved Product direction authorizes implementation, deployment, or
  provider procurement;
- any legal, privacy, consumer, payment, or security compliance conclusion; or
- reconciliation retires Page Chat authority.

## Evidence map

### Product and architecture

- [`PRODUCT_SPEC.md`](PRODUCT_SPEC.md)
- [`PRODUCT_SPEC_REVIEW.md`](PRODUCT_SPEC_REVIEW.md)
- [`STATUS.md`](STATUS.md)
- [ADR-002](../../decisions/ADR-002-independent-public-booking-application.md)
- [ADR-005](../../decisions/ADR-005-today-operational-steering.md)
- [`../../MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md)
- [`../../CURRENT_STATE.md`](../../CURRENT_STATE.md)

### Implementation

- `apps/booking-web/src/app/[establishmentSlug]`
- `apps/booking-web/src/app/[establishmentSlug]/reservation/[publicToken]`
- `apps/booking-web/src/app/api/public-booking`
- `apps/backoffice/src/app/(authenticated)/reservations`
- `apps/backoffice/src/app/(authenticated)/etablissement/horaires-services`
- `apps/backoffice/src/features/reservations`
- `packages/contracts/src/reservations`
- `packages/booking/src`
- `packages/db-cloud/src/schema/booking.ts`
- `packages/db-cloud/src/booking-repository.ts`
- `apps/backoffice/src/server/auth/permissions.ts`
- `apps/backoffice/src/features/today/today-data.ts`

### Test and readiness evidence

- `packages/booking/test`
- `packages/contracts/test/reservations-contract.test.ts`
- `packages/db-cloud/test/booking-repository.test.ts`
- `packages/db-cloud/test/booking-concurrency.integration.test.ts`
- `apps/booking-web/src/app/api/public-booking/public-booking.integration.test.ts`
- `apps/booking-web/e2e`
- `apps/backoffice/src/features/reservations`
- `apps/backoffice/src/features/today`
- [`STATUS.md`](STATUS.md)
- [`../../operations/PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md)

Automated coverage confirms only the tested current implementation. It does not
supply Product, legal, provider, target-environment, or release approval.

## Current operational setup

Local commands and production variable requirements remain documented here to
keep implementation discovery intact:

```bash
pnpm db:cloud:migrate
pnpm db:cloud:seed
pnpm dev:booking
YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true pnpm test:booking-web:e2e
YUTA_ALLOW_BOOKING_RELIABILITY_TESTS=true pnpm test:booking:reliability
```

Required production variables for `apps/booking-web` are:

```env
CLOUD_DATABASE_URL=...
CLOUD_DATABASE_SSL=true
PUBLIC_BOOKING_BASE_URL=https://reservation.yutapro.fr
BOOKING_RATE_LIMIT_SECRET=at-least-32-random-characters
```

The application validates these values at server startup and build time. This
does not prove that production values, DNS, TLS, migrations, monitoring, or
provider delivery are configured.

`/api/health` is process liveness. `/api/ready` performs a privacy-safe,
tenant-independent cloud-database readiness probe with a two-second deadline.
Neither endpoint is production acceptance evidence by itself.

## Migration and authority cutover

Repository reconciliation and bounded canonicalization: `COMPLETE` on
2026-09-29.

Repository-only fresh-agent acceptance: `PASS` on 2026-09-29, recorded from
`RESERVATIONS_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` with SHA-256
`1cd04c49301e76600ce73222629147b42c7dc98094bde3a38a6246cb078e759e`.
The accepted report used no Page Chat history, legacy extract, reconciliation
report, or external research. It recovered the 21 current-V1 outcomes, RD-01
through RD-18, eight long-term directions, P-01 through P-13, and RES-01
through RES-22 with zero material knowledge gaps and zero genuine conflicts.

Repository knowledge is `CANONICAL` for this exact migrated Reservations
scope. The Reservations Page Chat role for this scope is
`LEGACY EVIDENCE ONLY`. It may remain provenance for historical shaping, but
it no longer supplies current authority for the migrated scope.

Control Tower continues to coordinate shaping, surface conflicts, route Human
and cross-module decisions, and preserve governance gates. Coding agents use
repository discovery and may execute a later Product or implementation change
only under separate authorization.

This cutover changes knowledge routing only. It does not resolve RES-01 through
RES-22, approve P-01 through P-13, move a long-term direction into current V1,
change Today or Planning, authorize a provider, payment, legal conclusion,
production action, or implementation, or change any other Page Chat's
authority.

Reservations knowledge migration: `COMPLETE` on 2026-09-29.
