# YUTA Today / Aujourd'hui Product Knowledge

Status: Current canonical repository knowledge

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-29

## 1. Purpose, authority, and migration scope

Today (`Aujourd'hui`) is the Backoffice operational aggregation and
decision-support surface for the active establishment and local day. Its
approved purpose is to reduce operational mental load by surfacing information
that requires someone to prepare, do, decide, correct, verify, or anticipate
something. It is not a general dashboard or an exhaustive event feed.

This file is the canonical repository entry point for the bounded Today Product
Knowledge. The durable Product boundary is approved in
[ADR-005](../../decisions/ADR-005-today-operational-steering.md). Current code,
source repositories, authorization, the [Today page pack](../../ui/pages/today/README.md),
tests, and readiness sources retain authority for their own evidence axes.

The reconciliation covers Today only. Reservations, Tâches du jour, Planning,
Personnel, Pointage, Formalités, Establishment, Restaurant Knowledge, Carte &
menus, Fiches techniques, Inventaire, Mouvements de stock, Fournisseurs,
Reputation, Satisfaction, Compliance, internal resources, Marketing, Website,
Site Agent, POS, Display, Notifications, Paramètres, and payment/accounting are
referenced only to preserve ownership and integration boundaries. Their Product
Truth is not migrated or changed here.

Today owns no source record, lifecycle, mutation, permission, history, evidence,
or readiness state. The governing flow is:

```text
source capability -> separately approved minimized projection -> Today presentation
```

A card, count, badge, section, link, button, or view-model field is not a source
record, source state, permission, projection contract, or mutation authority.

## 2. Human-decided Product directions

The following 17 directions are current, bounded Product intent. They do not by
themselves approve an exact V1, source contract, schema, permission, algorithm,
environment, or production release.

| ID    | Confirmed direction                                                                                                                                  | Required boundary                                                                                                                                                     |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HD-01 | Today is the central daily operational-steering surface. It aggregates what is genuinely useful for action.                                          | It is not a general dashboard or exhaustive activity feed.                                                                                                            |
| HD-02 | Source ownership remains intact.                                                                                                                     | Every source retains its records, lifecycle, operations, permissions, history, evidence, and readiness.                                                               |
| HD-03 | Attention-based selection surfaces something still needing preparation, action, decision, correction, verification, or anticipation.                 | Normal events do not automatically enter Today.                                                                                                                       |
| HD-04 | Presentation is contextual: team members execute, managers supervise, and the restaurateur identifies decisions, anomalies, and recovery work.       | Relevance does not establish roles, permissions, or separate implemented dashboards.                                                                                  |
| HD-05 | The team-facing experience is narrower and more operational than the restaurateur-facing experience.                                                 | It may focus on current service, poste-relevant information, tasks, useful reservation information, and handoff; no STAFF matrix is inferred.                         |
| HD-06 | Today must not bypass source permissions.                                                                                                            | Today visibility, source read access, source mutation access, and sensitive-field visibility remain separate.                                                         |
| HD-07 | Reservations should be presented operationally by service, including directional reservation/cover, group, and preparation or reception information. | Exact fields, filters, masking, and grouping require a projection decision.                                                                                           |
| HD-08 | Today should directionally expose useful Tâches du jour progress by poste.                                                                           | Tâches du jour owns task records and state; no completion or write-back follows.                                                                                      |
| HD-09 | Today should surface still-relevant anomalies or reminders.                                                                                          | Inventory, Pointage, review, compliance, and prior-service examples do not create source enums, thresholds, or contracts.                                             |
| HD-10 | `Passage de service` is included as a presentation concept for the next team.                                                                        | Canonical owner, persistence, authors, audience, retention, and sensitive-data policy remain unresolved.                                                              |
| HD-11 | Resolved situations normally leave the actionable view.                                                                                              | Today does not invent source resolution or transition rules.                                                                                                          |
| HD-12 | Signals describing the same operational situation should not appear as contradictory or redundant attention items.                                   | No situation identity, precedence, or deduplication algorithm is approved.                                                                                            |
| HD-13 | Product intent distinguishes current service / `Maintenant`, `Aujourd'hui`, `Depuis votre dernière visite`, and important near-term `À venir`.       | Exact labels, windows, order, and visit tracking remain unresolved.                                                                                                   |
| HD-14 | An intermittently present restaurateur should distinguish normal activity, team-resolved matters, and matters still requiring attention.             | No persisted visit or digest model is approved.                                                                                                                       |
| HD-15 | Relevant information may change before, during, between, and after services.                                                                         | No daypart enum, threshold, or ranking formula is approved.                                                                                                           |
| HD-16 | Task, anomaly, information/alert, and action remain distinct concepts.                                                                               | A problem is not automatically a task, an alert a notification, information an action, or a card a source record.                                                     |
| HD-17 | An unresolved situation may gain visibility from team to manager to restaurateur according to persistence or importance.                             | Exact owner, trigger, threshold, severity, notification, persistence, audit, and source-state relationship remain unresolved; no heavy escalation engine is approved. |

### Accepted Release A projection

The Human accepted [RR-03](../../PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions)
for A only: Google records readable by the actor; `new` means local status
`NEW`; attention means `NEW`, `TO_PROCESS`, `DRAFTED` or `FOLLOW_UP`.
Count, preview and linked full list share this source/status/actor scope.
Preview limits do not reduce the total; STAFF sees assigned records only.
This is a local handling queue, not remote unanswered or provider response-rate
truth. A local `PUBLISHED` reply does not establish a remote reply.

Booking, Direct Feedback and AI projections are hidden in A. The current Human
selected a server-chosen A profile for the customer Backoffice instance and a
separate internal mode, build/test only; see the [task decision record](../../reviews/release-a-customer-exposure-foundation/01-analysis-review.md#request-and-delegation).
Internal aggregation and source ownership remain. This accepted projection
does not resolve broader TODAY questions or promote implementation/readiness.
Missing setup/context must offer permitted OWNER/support recovery without
inventing import outcomes.

Today remains a read projection and never retrieves Google reviews or loads
the provider retrieval summary. For importer-managed rows, unavailable Google
content is explicit while permitted local work remains visible; it is not
rendered as an anonymous review with an empty comment or invented rating.
STAFF retains assigned-only work and an OWNER/MANAGER handoff, without global
retrieval counts, cursors or provider coverage. Temporary content/reference
deadlines belong to [Reputation](../reputation/README.md#bounded-release-a-google-review-retrieval).
Existing legacy, DIRECT and internal aggregation semantics remain unchanged.

## 3. Current implemented state

The current tracked repository implements six grouped Today behaviors:

1. `/aujourdhui` is the sole current Today route and appears under `Accueil` in
   Backoffice navigation. Its Server Component requires a validated server
   session, active membership, and active establishment.
2. The route derives the local calendar date, local clock time, weekday, and
   display formatting from the trusted establishment timezone and locale. It
   does not establish a general business-day or overnight-service rule.
3. Reservations reads are organization- and establishment-scoped for that
   local date. Current presentation keeps `PENDING`, `CONFIRMED`, and `SEATED`
   rows, reports reservation counts, shows up to six chronological rows, and
   links to owning Reservation routes. Counts are reservation counts, not an
   approved cover-total or service-grouping contract.
4. Booking-service presentation reads enabled weekly periods for the local
   weekday, applies dated closure or modified-hours exceptions, and derives
   current/upcoming/completed display labels from local clock time. Those labels
   are presentation state, not persisted service lifecycle.
5. Reputation reads run only when `reputation.enabled` and `reputation.read`
   apply. The route requests unanswered feedback, excludes published replies
   and resolved, archived, or spam items from previews, shows up to three
   previews, and links to the owning Reputation workflow. It cannot reply,
   publish, assign, resolve, or archive from Today.
6. Reservations, services, and Reputation load independently in parallel.
   Each maps source failure to an unavailable state; source absence or disabled
   entitlement is not represented as fabricated operational data. Route-level
   loading and error recovery also exist.

Current interactions are navigation or links to source-owned workflows. The
route contains no Today action, source write-back, generic alert store, task
engine, notification delivery, polling, realtime subscription, cache policy,
acknowledgment, dismissal, snooze, history, escalation, or AI scoring.

The current Today projection is an application-owned serialization-safe view
model. It is not a transport contract or persisted `TodayItem` domain model.

## 4. Source projection matrix

| Source or context                      | Canonical owner                                   | Today Product status                                                        | Current contract and implementation                                                      | Read/write boundary                                                                 | Remaining decision                                                                       |
| -------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Trusted establishment context          | Authenticated tenant and Establishment sources    | Required current context                                                    | Implemented locale, timezone, organization, establishment, role, and entitlement context | Read-only; no duplicated profile                                                    | Business-date and cross-establishment Today behavior                                     |
| Reservations                           | Reservations / Booking                            | Approved source family; bounded current relationship independently approved | Implemented local-day rows and source-owned status presentation                          | Read-only links; no confirm, edit, cancel, arrival, completion, or no-show mutation | Covers, service grouping, groups/particularities, masking, exact filters, freshness      |
| Booking service periods and exceptions | Booking administration                            | Current operational context                                                 | Implemented enabled local-weekday periods plus dated exceptions                          | Read-only; settings link only for current manager/owner grant                       | Universal service, overnight, rollover, and capacity presentation rules                  |
| Reputation / direct feedback           | Reputation                                        | Approved source family                                                      | Implemented entitled/readable unanswered attention summary and previews                  | Read-only links; no reply, publish, assignment, resolution, or archive              | Exact provider/direct distinction, field masking, attention and freshness contract       |
| Tâches du jour                         | Tâches du jour                                    | Approved future source family                                               | No Today projection contract or integration; source route is a placeholder               | No read or write integration                                                        | Facts, states, poste/employee filtering, permissions, links, completion boundary         |
| Passage de service                     | Owner unresolved                                  | Approved Today presentation concept                                         | No source, contract, persistence, or integration                                         | No mutation authority                                                               | Owner, author, audience, period, editing, acknowledgment, retention, sensitivity         |
| Pointage                               | Pointage                                          | Approved future actionable-anomaly family                                   | No Today integration; Pointage specs grant no downstream access automatically            | No correction, creation, deletion, reinterpretation, or fault inference             | Qualified anomaly, minimized fields, role masking, effective date, resolution, link      |
| Stock / Inventaire                     | Inventaire or separately approved stock source    | Approved future actionable family                                           | No Today integration; current Inventory is a fixture-backed prototype                    | No count, threshold, adjustment, movement, or order mutation                        | Canonical fact, threshold, due state, freshness, fields, authorization                   |
| Fournisseurs / purchasing / delivery   | Fournisseurs and the applicable purchasing source | Approved future attention family                                            | No Today integration; current Suppliers is a fixture-backed prototype                    | No list submission, provider acknowledgment, receipt, or price update               | Purchase need, prepared list, ordered declaration, acknowledgment, delivery, receipt     |
| Internal operational knowledge         | Future owning capability                          | Approved future awareness/action family                                     | No Today integration; Ressources internes route is a planned placeholder                 | No acknowledgment or content mutation                                               | Owner, audience, qualification, freshness, history, permissions                          |
| Compliance                             | Future qualified Compliance source                | Approved future actionable family                                           | No Today integration; current Compliance route is fixture/demo presentation              | No legal conclusion, task, verification, evidence, or source mutation               | Qualified source, applicability/version, fields, permissions, freshness, external review |
| Planning                               | Planning                                          | Direct relationship explicitly not approved                                 | No projection contract or integration; Planning route is a placeholder                   | No read, mutation, staffing generation, or assignment change                        | Requires separate Product and source-owner approval before any relationship              |
| Personnel / Formalités                 | Personnel / Formalités                            | Direct Today aggregation is not approved                                    | No Today integration                                                                     | No dossier, contract, workflow, evidence, or employment-fact mutation               | Any minimized indirect projection must come through an approved owning capability        |

Other protected capabilities, including Carte & menus, Fiches techniques,
Mouvements de stock, General Information / Restaurant Knowledge, Satisfaction,
POS, Display, Website, Site Agent, Marketing, Notifications, Paramètres, and
payment/accounting, have no current Today projection contract created by this
reconciliation.

## 5. Capability and lifecycle matrix

| Capability                                    | Product status                   | Implementation                                                                 | Legal/privacy/security                                                                   | Environment   | Readiness / production                                             | Owner and exclusions                                               |
| --------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Current bounded Today aggregation             | `APPROVED`                       | `IMPLEMENTED`                                                                  | Existing source authorization is enforced; broader qualification remains unverified      | `UNVERIFIED`  | Today `NOT_READY`; Backoffice `NOT_READY`; production unauthorized | `apps/backoffice`; no Today data owner or source mutation          |
| Reservations summary                          | `APPROVED` bounded relationship  | `IMPLEMENTED`                                                                  | Guest-field minimization and final masking policy unresolved                             | `UNVERIFIED`  | `NOT_READY`                                                        | Reservations owns facts and lifecycle                              |
| Booking-service context                       | Current implemented context      | `IMPLEMENTED`                                                                  | No new regulated conclusion                                                              | `UNVERIFIED`  | `NOT_READY`                                                        | Booking administration owns periods/exceptions                     |
| Reputation attention                          | `APPROVED` source family         | `IMPLEMENTED` bounded read                                                     | Provider/direct data, masking, and production provider status remain independently gated | `UNVERIFIED`  | `NOT_READY`                                                        | Reputation owns items, replies, and status                         |
| Role-contextual team/manager/owner experience | `APPROVED` direction             | `DECIDED_NOT_IMPLEMENTED` beyond source-specific visibility and settings links | Sensitive-field rules require current review                                             | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | Exact actor views and Today permission model unresolved            |
| Tâches du jour                                | `APPROVED` future family         | `DECIDED_NOT_IMPLEMENTED`                                                      | Requires current legal/privacy/security review for employee-linked data                  | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | Tâches du jour owns task truth                                     |
| Passage de service                            | `APPROVED` concept               | `DECIDED_NOT_IMPLEMENTED`                                                      | Requires current privacy/security review                                                 | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | Canonical owner unresolved                                         |
| Pointage anomalies                            | `APPROVED` future family         | `DECIDED_NOT_IMPLEMENTED`                                                      | Requires current employment/privacy/security review                                      | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | Pointage owns attendance evidence and anomaly semantics            |
| Stock / Inventaire attention                  | `APPROVED` future family         | `DECIDED_NOT_IMPLEMENTED`                                                      | Regulated/accounting/food-safety meaning requires current review where applicable        | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | Source capability retains truth; fixture prototypes are not inputs |
| Fournisseurs attention                        | `APPROVED` future family         | `DECIDED_NOT_IMPLEMENTED`                                                      | Commercial/provider/accounting meaning requires current review where applicable          | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | Fournisseurs and purchasing owners remain separate                 |
| Internal operational knowledge                | `APPROVED` future family         | `DECIDED_NOT_IMPLEMENTED`                                                      | Audience, sensitivity, and acknowledgment unresolved                                     | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | Future owner unresolved                                            |
| Compliance attention                          | `APPROVED` future family         | `DECIDED_NOT_IMPLEMENTED`                                                      | `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                                       | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | Qualified source must own applicability and evidence               |
| Cross-source deduplication                    | `APPROVED` direction             | `DECIDED_NOT_IMPLEMENTED`                                                      | Depends on minimized approved source data                                                | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | No Today situation identity or precedence                          |
| Multi-temporal digest and upcoming view       | `APPROVED` direction             | `DECIDED_NOT_IMPLEMENTED`                                                      | Visit tracking and history require privacy/security review                               | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | No visit or digest persistence                                     |
| Time-contextual priority                      | `APPROVED` direction             | `DECIDED_NOT_IMPLEMENTED`                                                      | No current legal/operational qualification                                               | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | No daypart or ranking model                                        |
| Progressive escalation                        | `APPROVED` lightweight direction | `DECIDED_NOT_IMPLEMENTED`                                                      | Actors, audit, notifications, and sensitive data require current review                  | `NOT_ENABLED` | `NOT_ASSESSED`; unauthorized                                       | No escalation engine or lifecycle                                  |

## 6. Today concept matrix

| Concept                        | Product and owner                                           | Classification                                           | Time / visibility                                       | Mutation, retention, and implementation                                                  |
| ------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Operational steering           | Approved Today presentation purpose; sources retain records | Derived aggregate                                        | Active establishment; actor-contextual direction        | No write-back or Today persistence; bounded current aggregate implemented                |
| Attention item                 | Approved relevance concept                                  | Derived presentation, not a task or source state         | Current relevance; exact actor visibility unresolved    | No universal state machine, retention, or implementation                                 |
| Local day header               | Current implementation from Establishment context           | Derived presentation                                     | Establishment timezone/locale                           | Request-time only; implemented                                                           |
| Reservations summary and rows  | Reservations-owned facts                                    | Count/list/card presentation                             | Current local calendar date; current source permissions | Read-only links; implemented bounded projection                                          |
| Service-period cards           | Booking-owned periods/exceptions                            | Derived presentation state                               | Local weekday and local clock time                      | No persisted completion; implemented                                                     |
| Reputation attention           | Reputation-owned facts                                      | Count/list/card presentation                             | Entitled and readable actors                            | Read-only links; implemented bounded projection                                          |
| Role-contextual view           | Approved Today direction                                    | Presentation policy                                      | Team/manager/restaurateur relevance                     | Exact views, fields, and permissions unresolved; not implemented as separate experiences |
| `Maintenant` / current service | Approved conceptual temporality                             | Proposed section semantics beyond current service labels | Exact window and service rule unresolved                | No persistence; no canonical section implementation                                      |
| `Depuis votre dernière visite` | Approved digest direction                                   | Derived summary concept                                  | Last visit to current instant; tracking unresolved      | No visit, snapshot, or digest persistence; not implemented                               |
| `À venir`                      | Approved important-near-term direction                      | Derived section concept                                  | Horizon and maximum items unresolved                    | No persistence; not implemented                                                          |
| Passage de service             | Approved presentation concept; owner unresolved             | Section/message concept                                  | Previous to next service; audience unresolved           | Authoring, editing, acknowledgment, retention, and implementation unresolved             |
| Deduplicated situation         | Approved direction                                          | Derived cross-source presentation                        | While situation remains relevant                        | No identity, precedence, algorithm, persistence, or implementation                       |
| Progressive escalation         | Approved lightweight direction; owner unresolved            | Visibility behavior, not source transition               | Persistence/importance; exact thresholds unresolved     | No write-back, audit, notification, or implementation                                    |
| Quick action                   | Not generally approved                                      | Proposed action shape                                    | Actor and source permission unresolved                  | Current route uses links; no Today inline source mutation                                |
| Acknowledged/dismissed/snoozed | Not approved                                                | Proposed Today-local states                              | Time semantics unresolved                               | No persistence, source effect, history, or implementation                                |
| `TodayItem`                    | `PROPOSED_NOT_APPROVED`                                     | Proposed generic entity/view shape                       | Unresolved                                              | No schema, table, contract, repository, or retention                                     |

## 7. Date, service, and temporal model

Confirmed Product intent distinguishes current service, the local day,
since-last-visit context, important near-term matters, and time-contextual
priority. Current implementation is narrower:

- one `Date` is sampled per request;
- `Intl.DateTimeFormat` derives calendar date and clock time in the trusted
  establishment timezone;
- that local date bounds Reservation reads and selects the booking weekday;
- source event timestamps retain source meaning;
- booking-service current/upcoming/completed is a lexical local-time display
  derivation over same-day start/end times;
- there is no Today date selector, business-day offset, overnight-service rule,
  automatic rollover contract, last-refresh timestamp, visit tracker, digest
  window, upcoming horizon, or universal effective-time rule.

Current code must not be promoted into a universal time contract for every
source.

## 8. Role, visibility, authorization, and tenancy

- Route access requires a validated server session, active membership, trusted
  organization and active establishment. Browser scope, role, permission,
  entitlement, locale, and timezone are untrusted.
- Today has no dedicated permission. Current source sections enforce their own
  entitlement and read permission before querying.
- `booking.read` and `reputation.read` currently include `OWNER`, `MANAGER`, and
  `STAFF`. That executable grant is not adopted as final Today Product policy.
- Booking settings links remain limited by the current manager/owner grant.
- Actor relevance does not grant source read access. Today route visibility
  does not grant source mutation access or sensitive-field visibility.
- Queries remain scoped by both `organizationId` and `establishmentId` through
  trusted tenant context. No cross-establishment Today dashboard or aggregation
  is approved.
- Customer, employee, Pointage, handoff, compliance, provider, and other
  sensitive projections require explicit minimization, masking, and current
  legal/privacy/security review before expansion.

## 9. Attention, resolution, and deduplication

Product intent requires attention-based selection, resolved-item filtering,
and cross-source deduplication. Current implementation provides only
source-specific rules:

- Reservations include current `PENDING`, `CONFIRMED`, and `SEATED` rows for
  the local date and omit terminal source statuses from Today presentation.
- Reputation requests unanswered items and removes published replies and
  resolved, archived, or spam previews.
- Booking periods use current source configuration and dated exceptions.

These rules do not create a universal Today attention or resolution lifecycle.
Hidden is not resolved, dismissed is not completed, acknowledged is not source
resolution, and absent preview data is not a zero result. No shared situation
identity, grouping key, source precedence, reopen rule, stale-source policy, or
deduplication algorithm exists.

## 10. Actions, deep links, and write-back

Current Today actions are links to source-owned workflows:

- Reservations list and detail;
- reservation creation through the existing Reservations workflow;
- booking schedule management for the current authorized manager/owner;
- Reputation list and selected-item views;
- retry by reloading `/aujourdhui`.

Today owns navigation only. It has no delegated source action or inline source
mutation. A link or button does not authorize confirmation, cancellation,
task completion, Pointage correction, review reply/publication, stock movement,
supplier ordering, delivery receipt, compliance verification, or another
source operation.

## 11. Passage de service

`Passage de service` is approved as a Product presentation concept. No current
authority selects its canonical record owner, source, fields, authors, audience,
effective service, creation/edit rules, acknowledgment, relationship to tasks
or procedures, retention, deletion, audit, or sensitive-note policy. It is not
implemented and must not be assigned to Today merely because Today may display
it.

## 12. Escalation, priority, severity, and ordering

HD-17 approves lightweight progressive visibility as direction. No current
authority or implementation defines an escalation engine, threshold, duration,
urgency, severity, legal importance, source priority, actor transition,
notification, audit, de-escalation, or source write-back.

Current route order and badge colors are UI presentation only. They are not a
canonical priority, severity, urgency, or tie-breaking model. Priority is not
severity, and urgency is not legal importance.

## 13. Refresh, freshness, and degraded behavior

Current route composition is request-time server loading. Supported sources run
in parallel and failures are mapped independently to retryable unavailable
sections. The route has loading and route-level error recovery.

No current Product or implementation authority establishes polling, realtime,
event streaming, cache duration, manual freshness timestamp, stale threshold,
source retry schedule, or retained snapshot. Preserve:

```text
zero != unavailable
empty != failed
current != stale
complete != partial
```

The current generic unavailable state does not prove which source failed to an
end user, when its data was last current, or whether a partial summary is safe
for every future source.

## 14. Acknowledgment, dismissal, and history

Today has no viewed, acknowledged, dismissed, snoozed, restored, or locally
resolved state. It has no Today event history, snapshot history, audit record,
analytics, retention, deletion, or legal-hold model. Source-owned status and
history remain authoritative. `Plus tard`, acknowledgment, dismissal, and any
source effect remain unapproved proposals or open decisions.

## 15. Evidence, environment, and readiness

| Axis                   | Current evidence                                                                                                                                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product                | ADR-005 approves the aggregate boundary, 17 reconciled directions, and source-family intent described here. Exact current V1 and detailed contracts remain open.                                                                                                      |
| Implementation         | Current route, loader, view model, components, source repositories, navigation, and focused pure view-model/navigation tests support the bounded implementation above.                                                                                                |
| Executable shape       | Application-local view-model types exist. No Today schema, table, repository, transport contract, migration, or mutation exists.                                                                                                                                      |
| UI shape               | Current page pack and route implement the supported cards, panels, links, loading, empty, hidden, unavailable, and error states. Visual references control visual direction only.                                                                                     |
| Authorization          | Trusted tenant context and source permission checks are implemented. No final Today-specific Product role policy or future-source masking policy is approved.                                                                                                         |
| Legal/privacy/security | Current source boundaries exist; broader customer, employee, handoff, compliance, provider, and history use requires current external review. No compliance conclusion is created here.                                                                               |
| Tests                  | `today-view-model.test.ts` verifies timezone boundary, source status presentation, service state, exceptions, and the canonical schedule link. Navigation tests verify the route entry. No focused loader/component integration or cross-tenant Today test was found. |
| Browser QA             | The page pack contains an unchecked acceptance checklist and visual reference. No completed current Today Browser QA report was found.                                                                                                                                |
| Environment            | `UNVERIFIED`; repository code does not identify a deployed Today version.                                                                                                                                                                                             |
| Readiness              | Today and Backoffice are `NOT_READY`; production authorization is absent.                                                                                                                                                                                             |

## 16. Historical proposals retained without approval

The following 15 payloads remain `PROPOSED_NOT_APPROVED`:

1. exact desktop/mobile layout from historical mockups;
2. exact card order;
3. exact maximum number of `À venir` items;
4. `Plus tard` / snooze;
5. inline Google reply from Today;
6. inline correction of a source anomaly;
7. exact tablet/service route or mode;
8. automatic employee-specific landing page;
9. exact `TodayItem` fields;
10. a persisted `TodayItem` entity or table;
11. exact badges, colors, and priority values;
12. exact escalation threshold;
13. exact realtime or automatic-refresh behavior;
14. exact weekly KPI such as `96 % des tâches réalisées`; and
15. AI or automated scoring and prioritization.

Current code, a route, component, fixture, ADR wording, source implementation,
or visual mockup does not approve these proposals.

## 17. Grouped Human decisions required

| ID       | Decision                                                                                                                                               | Current evidence and prohibited inference                                                                                                                                         | Required authority                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| TODAY-01 | Close exact current V1 and decide which approved information families may be activated.                                                                | ADR-005 approves category intent; current implementation covers only Reservations, booking context, and Reputation. Do not convert every approved family into an active contract. | Human Product and each source owner.                                                                |
| TODAY-02 | Define business date, current service, overnight behavior, rollover, and source effective-time rules.                                                  | Current code uses local calendar date and same-day clock comparison. Do not promote it into a universal time model.                                                               | Human Product, domain architecture, source owners, and operations.                                  |
| TODAY-03 | Define actor-specific relevance, Today visibility, source permission checks, sensitive-field masking, and cross-establishment behavior.                | Current source grants are executable behavior; relevance is not authorization. No cross-establishment Today scope exists.                                                         | Human Product, authorization, tenancy, privacy, and security.                                       |
| TODAY-04 | Define the Reservations projection: counts/covers, service/group/particularity facts, statuses, date filters, masking, freshness, and links.           | Current local-day reservation rows are narrower. Do not expose extra guest details or grant mutation.                                                                             | Today and Reservations Product owners, data, privacy/security, and operations.                      |
| TODAY-05 | Define the Tâches du jour projection, poste/employee filtering, progress, source states, permissions, links, and mutation boundary.                    | ADR-005 approves future aggregation; Tâches du jour has no persistence or Today integration.                                                                                      | Today and Tâches du jour Product owners, Personnel, authorization, privacy/security.                |
| TODAY-06 | Define any Pointage, Personnel, or Formalités minimized projection and anomaly qualification.                                                          | Pointage grants no downstream integration; direct Personnel aggregation is rejected; Formalités evidence remains source-owned. Do not infer employee fault.                       | Owning Product authorities plus employment/legal/privacy/security review.                           |
| TODAY-07 | Define any Stock, Inventaire, Mouvements, Fournisseurs, Fiches techniques, or Carte projection and situation identity.                                 | Current sources are placeholders/prototypes or separate bounded scopes. Do not invent stock formulas, purchase needs, orders, receipts, costs, or movements.                      | Every source Product owner plus data, accounting/food-safety, authorization, and operations review. |
| TODAY-08 | Define Reputation/direct-feedback expansion, qualified Compliance attention, and internal-resource awareness contracts.                                | Current Reputation read is bounded; Compliance is fixture/demo; Resources is a placeholder. Do not create reply, publication, legal, or acknowledgment authority.                 | Source Product owners, provider/legal/privacy/security, and operations.                             |
| TODAY-09 | Define attention selection, due/upcoming meaning, resolved filtering, recurrence, correction, and reopening.                                           | Current rules are source-specific. Do not create a universal Today lifecycle or source transitions.                                                                               | Human Product, domain architecture, and source owners.                                              |
| TODAY-10 | Define cross-source situation identity, grouping, precedence, contradictory-source handling, and deduplication.                                        | HD-12 is direction only. Do not infer an algorithm from the stock/order/delivery example.                                                                                         | Human Product, architecture/data, source owners, and operations.                                    |
| TODAY-11 | Define temporal sections, since-last-visit semantics, visit tracking, digest content, upcoming horizon, and retention.                                 | HD-13/14 are approved; no visit or digest persistence exists.                                                                                                                     | Human Product, privacy/security, data, UX, and operations.                                          |
| TODAY-12 | Decide deep-link-only, delegated-source action, inline mutation, and Today-local action boundaries per source.                                         | Current route uses links. Do not infer mutation from buttons, cards, or source operations.                                                                                        | Human Product, every source owner, authorization/security, and operations.                          |
| TODAY-13 | Select the `Passage de service` owner, fields, author/audience, lifecycle, service period, editing, acknowledgment, retention, and sensitivity policy. | Inclusion is approved; ownership and implementation are absent. Do not assign it to Today.                                                                                        | Human Product, architecture/data, privacy/security, and restaurant operations.                      |
| TODAY-14 | Define escalation, priority, severity, urgency, ordering, personalization, thresholds, notifications, audit, and de-escalation.                        | HD-15/17 are direction only. Do not derive authority from card order, badge color, or duration.                                                                                   | Human Product, source owners, UX, privacy/security, and operations.                                 |
| TODAY-15 | Define refresh, freshness, cache, polling/events, last-updated/stale semantics, partial failure, retries, and degraded-state safety.                   | Current request-time loading and generic unavailable states are implementation evidence only.                                                                                     | Human Product, architecture, security, SRE/operations, and source owners.                           |
| TODAY-16 | Decide viewed, acknowledgment, dismissal, snooze, restore, Today history, audit, analytics, retention, deletion, and source effects.                   | None exists. Hidden, dismissed, completed, and source-resolved remain distinct.                                                                                                   | Human Product, data, privacy/security/legal, source owners, and operations.                         |
| TODAY-17 | Close UI/page-pack acceptance, accessibility/manual Browser QA, deployment, monitoring, support, recovery, readiness, and production authorization.    | Automated evidence is bounded; Browser QA is not recorded complete; environment is unverified and Backoffice is not ready.                                                        | Product, design/accessibility, engineering, security, operations, and release authority.            |

`HUMAN_DECISIONS_REQUIRED` is **17**. A coding agent may not resolve these
packets autonomously.

## 18. Reconciliation accounting and conflict disposition

The counting unit is one grouped material assertion on its primary Product,
implementation, proposal, decision, conflict, or historical axis. Product
approval and implementation absence are counted separately because they answer
different authority questions.

| Disposition               | Count | Grouped material assertions                                                                                                                                                                                                               |
| ------------------------- | ----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONFIRMED`               |    17 | HD-01 through HD-17.                                                                                                                                                                                                                      |
| `IMPLEMENTED`             |     6 | Route/context/date, Reservations, booking services, Reputation, isolated section states, and source-owned links/no-write composition.                                                                                                     |
| `DECIDED_NOT_IMPLEMENTED` |    12 | Role-specific experience; fuller Reservations service projection; tasks; handoff; Pointage; Stock/Inventaire; Suppliers; internal knowledge; Compliance; cross-source deduplication; multi-temporal digest; priority/escalation behavior. |
| `PROPOSED`                |    15 | The exact proposal payloads in section 16.                                                                                                                                                                                                |
| `UNRESOLVED`              |    17 | TODAY-01 through TODAY-17.                                                                                                                                                                                                                |
| `CONFLICT`                |     0 | Four apparent tensions reconcile by separate authority axes or remain unresolved without contradiction.                                                                                                                                   |
| `OBSOLETE`                |     2 | The retired fixture-only Today dashboard implementation and the legacy suggestion that Planning was an accepted Today source, superseded by ADR-005's explicit exclusion.                                                                 |

The possible quick-action/source-mutation tension reconciles because current
Today owns navigation only and future delegated actions remain unresolved.
Passage de service ownership is unresolved rather than contradictory.
Escalation visibility does not change source lifecycle. Role relevance does not
widen source authorization. No genuine current authority conflict remains.

## 19. Explicit non-inferences and cross-module safety

Do not infer that:

- Today owns any source record or creates a generic dashboard/event platform;
- ADR-005 creates every source projection contract;
- a Today-side desire for Planning information creates a Planning contract;
- a current role grant is final Product role policy;
- current local-date code defines business-day or overnight rules;
- a source failure is an empty or zero result;
- a source status is a Today state, or Today visibility changes source state;
- an attention item is a task, warning a notification, or action an automatic
  mutation;
- a review preview grants reply or publication access;
- missing Pointage data proves employee fault;
- a stock warning creates a count, movement, purchase need, or order;
- a supplier card submits an order or acknowledges/receives a delivery;
- Compliance fixture text is legal authority or current evidence;
- a deep link, button, test, or visual reference proves production readiness;
- an approved direction authorizes implementation, deployment, or production.

The following completed packet sets remain unchanged: `RES-01`–`RES-22`,
`TJD-01`–`TJD-15`, `PLAN-01`–`PLAN-14`, `SAL-01`–`SAL-11`, `FORM-01`–`FORM-08`,
`RK-01`–`RK-08`, `CM-01`–`CM-18`, `FT-01`–`FT-19`, `INV-01`–`INV-18`,
`MDS-01`–`MDS-18`, and `FOU-01`–`FOU-18`. Pointage, Reputation/Avis, and
Satisfaction authority remains unchanged. No other Page Chat scope is migrated
or retired.

## 20. Discovery path and fresh-agent test input

A repository-only agent should follow:

1. [`docs/README.md`](../../README.md), the
   [Authority Model](../../AUTHORITY_MODEL.md), and
   [`PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
2. [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and this home;
3. [ADR-005](../../decisions/ADR-005-today-operational-steering.md);
4. the [Today page pack](../../ui/pages/today/README.md), especially Product
   scope, data/interaction, UI, acceptance, and visual-evidence limits;
5. the current `/aujourdhui` route, loader, view model, components, navigation,
   source permission catalog, and focused tests;
6. the canonical homes/specs for Reservations, Tâches du jour, Planning,
   Personnel, Pointage, Formalités, Establishment, Stock scopes, Reputation,
   and other source boundaries; and
7. [`CURRENT_STATE.md`](../../CURRENT_STATE.md) and
   [Production Readiness](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history or the legacy extract, a fresh agent must recover the
exact Today-only scope; HD-01 through HD-17; source-owner invariant; the three
current source/context reads; local-date and service-state implementation;
role/permission separation; current and absent projections; attention,
resolution, deduplication, action, handoff, digest, escalation, freshness,
acknowledgment, and history boundaries; all 15 proposals; TODAY-01 through
TODAY-17; zero genuine conflicts; environment/readiness status; and every
explicit non-inference above.

Do not run that acceptance test as part of reconciliation.

## 21. Migration and authority state

Repository reconciliation and bounded canonicalization: `COMPLETE` on
2026-09-29.

### Fresh-agent acceptance evidence

The repository-only `AUJOURDHUI_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` has
SHA-256
`9f9ca6f6cb0d65c3174381c3e071cf3a3ceb767099bd201b320837868bf6cd55`.
Its exact heading, complete 292 logical lines, and final control block were
verified. The report used no Page Chat history, legacy extract, reconciliation
report, or external research. It recorded zero material knowledge gaps, zero
genuine conflicts, recovery of all 17 HD directions, all 15 proposal payloads,
all 17 `TODAY` decision packets, and both obsolete claims. It also recorded no
projection contract, source write-back, protected-scope reopening, adjacent
scope migration, legal/privacy/security claim or conclusion, OpenSpec change,
or Product code change, with `FRESH_AGENT_ACCEPTANCE: PASS` and
`READY_FOR_AUTHORITY_CUTOVER: YES`.

The PASS covers only the exact bounded Today scope in this home: the Product
purpose and aggregate/source-owner invariant; current, future, and absent source
relationships; date, role, attention, deduplication, action, handoff,
escalation, freshness, and history boundaries; the 15 unapproved proposals;
the two obsolete claims; `TODAY-01` through `TODAY-17`; current implementation,
authorization, privacy/security evidence limits, environment/readiness state,
and explicit non-inferences. The report is acceptance/discovery evidence only;
it creates no Product, implementation, legal, privacy, security, environment,
readiness, or production authority and resolves no `TODAY` packet.

### Authority cutover

Fresh-agent acceptance: `PASS` on 2026-09-29.

Authority cutover: `COMPLETE` on 2026-09-29.

Repository knowledge is canonical for the exact migrated Today scope in this
home. The Today Page Chat is `LEGACY EVIDENCE ONLY` for that exact scope. It
remains available for historical or forensic lookup but is no longer current
Product/shaping authority for the migrated scope. Control Tower retains
shaping, genuine-conflict resolution, Human Decision routing, cross-module
reasoning, and governance coordination. Coding agents retain repository
discovery, analysis, and separately authorized execution and verification.

No OpenSpec change, source projection contract, write-back, Product code,
external research, legal/privacy/security conclusion, production authorization,
or other Page Chat authority change is created by this cutover.
