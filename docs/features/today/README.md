# YUTA Today Product Knowledge

Visibility: Engineering

Owner: YUTA product and engineering

Approved: 2026-08-26

## 1. Purpose

Today (`Aujourd'hui`) is the Backoffice operational aggregation and
decision-support surface for the active establishment and local day. It is the
restaurant's central operational steering page: it reduces operational mental
load by surfacing only information that requires someone to prepare, do,
decide, correct, verify, or anticipate something.

This file is the canonical Product Knowledge entry point for Today. The
approved Product Intent is recorded in
[ADR-005](../../decisions/ADR-005-today-operational-steering.md). This home does
not replace source-module knowledge, the Today page pack, tracked code and
tests, production-readiness evidence, or future normative OpenSpec
specifications.

## 2. Product Intent

Today is an aggregation and decision-support surface. It must not replace
source modules, become a second source of truth, duplicate canonical records
merely for dashboard purposes, bypass source-module permissions, or silently
take ownership of source-module mutations.

### Role context

The approved intent is contextual by role:

- the team executes the current service;
- the manager supervises service execution and operational blockers;
- the restaurant owner sees items that require a decision, intervention,
  correction, or follow-up.

This is approved Product Intent, not evidence that separate role-specific
dashboards are implemented. Current sections remain governed by their source
entitlements and permissions.

### Approved information families

Today is approved to surface relevant operational information from:

1. Reservations, including service, cover or group, applicable table, special
   request, and operational-consequence information.
2. Tâches du jour and checklists relevant to the employee, post, or service,
   including pending or blocked work.
3. Relevant service handover information from a previous service or team.
4. Actionable Pointage anomalies, without general Personnel duplication.
5. Actionable Stock or Inventaire situations, including inventories to perform
   and insufficient stock.
6. Fournisseurs or purchasing situations requiring attention, including
   purchase needs, orders, deliveries, timing, and supply issues.
7. Reputation feedback requiring a response or operational attention.
8. Internal operational announcements or procedures requiring awareness or
   action.
9. Applicable and actionable Compliance items or alerts.

These families are approved Product Intent. Approval is not proof that a source
capability, integration, separate role view, or production deployment exists.

### Explicit boundaries

- No direct Planning-to-Today relationship is approved by the current
  authoritative sources.
- Direct Personnel aggregation is not approved. Personnel may be indirectly
  relevant through approved source capabilities such as Pointage or Tâches du
  jour, while Personnel remains the employee identity and current-employment
  source.
- Local POS ordering, kitchen, printing, payments, cash management, and
  financial KPIs remain outside Today's cloud Backoffice boundary.

## 3. Current Implemented State

The current implementation is limited to:

- an authenticated greeting and current date derived from the active
  establishment's trusted locale and timezone;
- establishment-scoped reservations for the local day, with bounded status
  counts and links to current reservation workflows;
- enabled weekly booking service periods for the local weekday, reconciled with
  dated exceptions and presented as current, upcoming, or completed;
- Reputation feedback requiring attention when the entitlement and read
  permission apply;
- independent ready, empty, hidden, and unavailable states so one source
  failure does not make another section misleading; and
- navigation to current owning workflows, without Today-owned source-record
  mutation or business state.

The current route requires an authenticated restaurant membership and active
establishment. `OWNER`, `MANAGER`, and `STAFF` can read the current booking and
Reputation sections because the corresponding source permissions include those
roles. Booking settings management remains restricted to `OWNER` and `MANAGER`.
Today grants no additional source authority.

No Tâches du jour, service handover, Pointage, Stock, Inventaire, Fournisseurs,
internal operational knowledge, Compliance, Planning, or Personnel integration
is currently implemented.

## 4. Capability map

| Capability / scope                     | Product boundary                                                           | Current implementation                                                         |
| -------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Daily operational summary              | Approved central steering and aggregation surface; owns no source records. | Implemented for the active establishment and local day.                        |
| Reservations summary                   | Approved source-owned information family.                                  | Implemented with scoped counts, bounded rows, and links.                       |
| Service-period and exception awareness | Current booking-owned operational context.                                 | Implemented from booking administration data and trusted local time.           |
| Reputation / feedback attention        | Approved source-owned information family.                                  | Implemented when entitled and readable.                                        |
| Role-contextual presentation           | Approved intent for team, manager, and owner contexts.                     | No separate role-specific dashboard implementation is established.             |
| Tâches du jour / checklists            | Approved future source-owned information family.                           | Not started; the route is currently a planned placeholder.                     |
| Service handover                       | Approved future source-owned information family.                           | Not started; no source capability or Today integration exists.                 |
| Pointage anomalies                     | Approved future source-owned information family.                           | Not started; the route is currently a planned placeholder.                     |
| Stock / Inventaire                     | Approved future source-owned information family.                           | Not started; current Stock surfaces are fixture prototypes, not Today sources. |
| Fournisseurs / purchasing              | Approved future source-owned information family.                           | Not started; the current prototype establishes no Today feed.                  |
| Internal operational knowledge         | Approved future source-owned information family.                           | Not started; no Today integration is evidenced.                                |
| Compliance                             | Approved future source-owned information family.                           | Not started; the current prototype establishes no canonical Today alert feed.  |

## 5. Lifecycle summary

Product approval and implementation maturity are independent. The current row
retains its existing environment, readiness, and external-dependency evidence.
Future rows record approved categories without promoting implementation or
deployment status.

| Capability / Scope                                                                      | Product Decision | Implementation | Environment   | Production Readiness | External Dependency | Review Marker                                                      |
| --------------------------------------------------------------------------------------- | ---------------- | -------------- | ------------- | -------------------- | ------------------- | ------------------------------------------------------------------ |
| Current Today bounded aggregation                                                       | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED`  | `NOT_READY`          | `NOT_ASSESSED`      | `OK`                                                               |
| Future Tâches du jour, service handover, and internal operational knowledge aggregation | `APPROVED`       | `NOT_STARTED`  | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `OK` — category intent only; detailed behavior remains future work |
| Future Pointage anomaly aggregation                                                     | `APPROVED`       | `NOT_STARTED`  | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `OK` — category intent only; no direct Personnel aggregation       |
| Future Stock / Inventaire and Fournisseurs aggregation                                  | `APPROVED`       | `NOT_STARTED`  | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `OK` — category intent only; current sources remain prototypes     |
| Future Compliance aggregation                                                           | `APPROVED`       | `NOT_STARTED`  | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `OK` — category intent only; current source remains a prototype    |

Planning and direct Personnel aggregation are not included in these approved
future rows.

## 6. Source-of-truth boundaries

| Data / concern                          | Owning module/source                                             | Today relationship                                                                                                                                               |
| --------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reservations                            | Booking / Reservations in `packages/db-cloud`                    | Currently reads the active establishment's local-day rows and derives a bounded summary; it does not copy or mutate reservations.                                |
| Service periods and dated exceptions    | Booking administration under Establishment hours/services        | Currently reads enabled periods and applicable exceptions, then derives display state from trusted local time.                                                   |
| Reputation feedback                     | Reputation in `packages/db-cloud`                                | Currently reads entitled, permitted attention data and links to Reputation; it does not own feedback or reply status.                                            |
| Establishment context                   | Authenticated tenant context and canonical Establishment sources | Currently uses trusted organization, establishment, locale, timezone, entitlements, and role without persisting a second context.                                |
| Daily tasks and checklists              | Future Tâches du jour source                                     | Approved future aggregation; the source module must own task records and state.                                                                                  |
| Service handover                        | Future owning operational source                                 | Approved future aggregation; no source capability, persistence, or integration is established yet.                                                               |
| Pointage anomalies                      | Future Pointage source                                           | Approved future aggregation of actionable anomalies; Pointage must own attendance facts and anomaly semantics.                                                   |
| Personnel identity and employment facts | Personnel                                                        | No direct Today aggregation is implemented or approved. Future indirect use must go through an approved owning capability and must preserve Personnel ownership. |
| Inventory and stock situations          | Future approved Stock / Inventaire source                        | Approved future aggregation; current fixture prototypes are not canonical Today inputs.                                                                          |
| Supplier and purchasing situations      | Future approved Fournisseurs source                              | Approved future aggregation; current fixture prototypes establish no supplier-order feed or Today action ownership.                                              |
| Internal announcements and procedures   | Future owning internal operational knowledge source              | Approved future aggregation when awareness or action is required; no current Today integration is established.                                                   |
| Compliance items and alerts             | Future approved Compliance source                                | Approved future aggregation; current fixture prototypes establish no canonical compliance-alert feed.                                                            |
| Planning                                | Future Planning source                                           | No direct Today relationship is currently approved or implemented.                                                                                               |

Today may read, aggregate, and surface only data allowed by the owning module.
It must not bypass source permissions, duplicate canonical records, or become a
write owner merely to populate a dashboard card.

## 7. Attention and deduplication principles

- Today surfaces the current relevant situation rather than an unfiltered
  succession of events.
- Where the owning module supports it, Today should avoid duplicate alerts for
  the same unresolved situation.
- The distinction between a task, anomaly, alert or information item, and
  action is approved as a conceptual Product Intent boundary.
- Detailed states, transitions, persistence, deduplication keys, and
  source-specific behavior remain future module or approved normative OpenSpec
  specification work.
- Current reservation counters, Reputation attention, and service-period labels
  continue to derive from their existing source semantics; Today creates no
  dashboard-only source state.

## 8. Data and ownership

- **Runtime owner:** `apps/backoffice`.
- **Today data owner:** none. Today is a server-side read and aggregation
  surface with no dedicated schema, repository, persistence, or mutation
  boundary.
- **Current reads:** `listReservations`, `getBookingAdministration`, and
  `listFeedback` through server-only `@yuta/db-cloud`, under trusted tenant
  scope and source permissions.
- **Persistence owners:** Booking/Reservations and Reputation retain their
  respective `packages/db-cloud` records. Establishment and session sources
  retain trusted context ownership.

The Today view model is a bounded presentation projection, not a new transport
or persistence source of truth.

## 9. Related modules

| Related module                  | Current relationship                                                                              | Approved future relationship / boundary                                                                                                                                       | Source of truth                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Reservations                    | Reads local-day reservations, derives bounded counts, and links to current reservation workflows. | May surface approved operational reservation consequences without acquiring ownership.                                                                                        | Booking / Reservations documentation, repositories, and permissions.                              |
| Establishment / service periods | Uses trusted locale/timezone and reads booking periods with dated exceptions.                     | Future changes remain owned by Establishment or Booking.                                                                                                                      | Authenticated tenant context and booking administration under `/etablissement/horaires-services`. |
| Reputation                      | Reads entitled unanswered/attention data and links to Reputation.                                 | May surface reviews or comments requiring response or operational attention; unfinished import/publication work remains outside Today.                                        | Reputation documentation, repository, entitlement, and permissions.                               |
| Tâches du jour                  | No current integration; the route is a planned placeholder.                                       | Approved future aggregation of relevant pending or blocked tasks; the task module retains records and state.                                                                  | Future Tâches du jour source.                                                                     |
| Service handover                | No current integration or source capability.                                                      | Approved future aggregation of relevant information from a previous service or team.                                                                                          | Future owning operational source.                                                                 |
| Pointage                        | No current integration; the route is a planned placeholder.                                       | Approved future aggregation of actionable anomalies; no general Personnel duplication.                                                                                        | Future Pointage source.                                                                           |
| Stock / Inventaire              | No current integration; current Stock data is fixture-backed prototype state.                     | Approved future aggregation of actionable inventory or stock situations.                                                                                                      | Future approved Stock / Inventaire source.                                                        |
| Fournisseurs                    | No current integration; current Suppliers data is fixture-backed prototype state.                 | Approved future aggregation of purchasing, order, delivery, timing, or supply situations requiring attention.                                                                 | Future approved Fournisseurs source.                                                              |
| Internal operational knowledge  | No current Today integration is evidenced.                                                        | Approved future aggregation of relevant announcements or procedures requiring awareness or action.                                                                            | Future owning internal operational knowledge source.                                              |
| Compliance                      | No current integration; current Compliance data is fixture-backed prototype state.                | Approved future aggregation of applicable, actionable compliance items or alerts.                                                                                             | Future approved Compliance source.                                                                |
| Personnel                       | No direct integration or data consumption.                                                        | No direct integration is approved. If indirectly relevant through Pointage or tasks, Today must consume the owning capability rather than become an employee identity source. | Personnel remains the employee identity and current-employment source.                            |
| Planning                        | No integration; the route is a planned placeholder.                                               | No Today relationship is currently approved.                                                                                                                                  | Future Planning source and ownership require separate approval.                                   |

## 10. Current limitations and non-goals

- Today does not replace any current or future source module.
- Today cannot bypass a source entitlement, permission, tenant scope, or
  source-specific business rule.
- Approved future information families are not current implementation evidence.
- Today has no general alert store, task engine, acknowledgement, assignment,
  notification, polling, realtime subscription, or dashboard-owned mutation.
- Repository implementation and local checks do not prove which version is
  deployed or that Backoffice is production-ready.
- Navigation, a placeholder route, prototype fixture, or visual reference does
  not prove implementation.

## 11. Source map

| Question                                                         | Read this source                                                                                                                             |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| What Product Intent is approved for Today?                       | [ADR-005](../../decisions/ADR-005-today-operational-steering.md).                                                                            |
| What is Today's product boundary and relationship map?           | This Product Knowledge home.                                                                                                                 |
| What is the Today UI delivery and detailed interaction evidence? | [Today page pack](../../ui/pages/today/README.md) and its scoped documents.                                                                  |
| What owns reservations and booking behavior?                     | [Public Booking](../public-booking/README.md), its adjacent status source, and current booking repositories.                                 |
| What owns weekly service periods and exceptions?                 | [Hours and services page pack](../../ui/pages/hours-services/README.md) and Booking administration sources.                                  |
| What owns feedback and attention semantics?                      | [Reputation](../reputation/README.md) and its adjacent status source.                                                                        |
| What are the approved lifecycle assignments?                     | [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and [`LIFECYCLE_STATUS_MODEL.md`](../../LIFECYCLE_STATUS_MODEL.md).                         |
| How should conflicting sources be interpreted?                   | [`AUTHORITY_MODEL.md`](../../AUTHORITY_MODEL.md).                                                                                            |
| Is Today or Backoffice production-ready?                         | [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md).                                                                       |
| What is implemented now?                                         | [Current Today route and loader](<../../../apps/backoffice/src/app/(authenticated)/aujourdhui>) plus relevant source repositories and tests. |

## 12. Agent interpretation rules

1. Apply ADR-005 as the approved Product Decision, while treating category
   approval and implementation evidence as separate lifecycle dimensions.
2. Treat Today as an aggregation surface, not a new source of truth.
3. Do not infer implementation from navigation, a placeholder, prototype data,
   a planned card, task text, or a visual reference.
4. Do not copy or persist source-module records in Today merely to render a
   summary.
5. Do not bypass source-module entitlements, permissions, trusted tenant scope,
   or business rules.
6. Do not infer a Planning relationship or direct Personnel integration from
   the approved information families.
7. If a future Today integration is implemented, consume its owning module or
   source of truth and retain source ownership and mutation authority.
8. When sources conflict, apply the Authority Model and retain `CONFLICT` or
   `NEEDS REVIEW`; do not normalize by assumption.
9. OpenSpec is not currently normative for Today.

## 13. OpenSpec position

There is no normative Today specification under `openspec/specs/` today. This
file retains broader Product Knowledge context and module relationships. After
YUTA explicitly approves OpenSpec specifications as normative, approved Today
specs may become the primary authority for specific behavioral requirements
inside accepted product, architecture, and security boundaries. No OpenSpec
artifact is created or modified by this step.

## 14. Status

Status: APPROVED
