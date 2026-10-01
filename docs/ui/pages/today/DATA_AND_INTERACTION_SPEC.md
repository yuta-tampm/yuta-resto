# Today dashboard — Data and interaction specification

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-10-01

## Exposure applicability

The Booking source mapping, suggested broader view model and Booking
interactions below apply to `internal`. `release-a` keeps trusted context/date
and Reputation grants but does not call Booking repositories or serialize
Booking, DIRECT or AI projections. The server owns selection and the
[Today Product home](../../../features/today/README.md#accepted-release-a-projection)
owns its accepted A queue; browser query/props cannot widen that scope.

## Trusted context

The page uses the authenticated server session and active tenant context. The
browser never supplies authoritative organization, establishment, membership,
role, permission, entitlement, locale, or timezone values.

## Current source mapping

| Section          | Current source                                 | Required boundary                           |
| ---------------- | ---------------------------------------------- | ------------------------------------------- |
| Greeting         | authenticated session                          | active user session                         |
| Local date       | establishment locale and timezone              | trusted tenant establishment                |
| Reservations     | `listReservations` in `@yuta/db-cloud`         | `booking.enabled` and `booking.read`        |
| Booking services | `getBookingAdministration` in `@yuta/db-cloud` | booking entitlement and current read policy |
| Reviews          | `listFeedback` in `@yuta/db-cloud`             | `reputation.enabled` and `reputation.read`  |

Application server composition may adapt these current repository results into
a serialization-safe page view model. It must not duplicate booking or
reputation business rules.

## Suggested view model

```ts
type TodaySection<T> =
  | { state: 'ready'; data: T }
  | { state: 'empty' }
  | { state: 'forbidden' }
  | { state: 'unavailable'; retryable: boolean };

type TodayDashboardViewModel = {
  generatedAt: string;
  localDate: string;
  timezone: string;
  locale: string;
  displayName: string;
  reservations: TodaySection<TodayReservationsData>;
  bookingServices: TodaySection<TodayBookingServicesData>;
  reviews: TodaySection<TodayReviewsData> | { state: 'hidden' };
  actions: readonly TodayDashboardAction[];
};
```

These names are guidance, not permission to create duplicate domain types or a
new transport contract.

## Today boundary

- Determine the calendar date in the establishment timezone.
- In internal, query reservations using that local date as both range endpoints.
- In internal, compare service periods using the weekday of that same local date.
- Format date and time using the trusted locale and timezone.
- Do not use browser time or `new Date().toISOString().slice(0, 10)` as the
  establishment-local date.

## Reservation semantics

This section applies to `internal` only.

- Reuse current reservation status values and current cancellation behavior.
- Sort visible rows by local time.
- Derive counters from the same scoped result as the list.
- Exclude or classify terminal statuses according to current booking behavior;
  do not invent a dashboard-only status.
- Link to `/reservations` with a date filter and to current detail
  routes where permitted.
- Do not expose phone, email, special requirements, or other guest data unless
  the summary explicitly needs it and current privacy conventions allow it.

## Booking-service semantics

This section applies to `internal` only.

- Filter current persisted service periods by local weekday and enabled state.
- Display only existing fields such as name, start/end, capacity, and enabled
  state.
- Current/upcoming/completed is a presentation derivation from local time, not
  persisted completion.
- Do not infer cleaning, opening, closing, cut-off, last-arrival, or team events.

## Review semantics

- Load only when reputation is entitled and readable.
- Reuse the current profile's feedback status and counter semantics.
- In internal, “requires attention” follows current unanswered/new behavior
  rather than treating every feedback item as unanswered.
- Rating and source-dependent information remain optional.
- In internal, a reputation failure must not block booking sections.

For A, server-derived repository options enforce Google with organization,
establishment and actor predicates. STAFF sees assigned reviews only. Attention
is `NEW`, `TO_PROCESS`, `DRAFTED`, `FOLLOW_UP`; new is `NEW`. Count, preview
and `/visibilite-reputation/avis?queue=attention` use the same base scope;
preview/page limits never reduce counts. A local `PUBLISHED` reply does not
exclude an active queue row or establish a remote reply. New links use
`/visibilite-reputation/avis?status=NEW`. Additional list filters only narrow
the permitted queue.

The setup summary reads only scoped, token-free connector metadata and makes no
provider call. OWNER gets permitted Integrations setup; other roles get an
operator handoff. No available import operation/evidence is inferred from a
bound empty inbox or synthetic/stored rows. Unavailable data stays unavailable,
not a successful zero.

## Unsupported sections

Do not query, type, render, or add mutations for tasks, team planning, generic
email, or content approval until those modules have approved current domain
implementations. Their placeholder routes are not data sources.

## Loading and failure isolation

- Load independent supported sections in parallel on the server.
- Catch and map section failures independently without exposing internal errors.
- Avoid client-side waterfalls for server-owned cloud data.
- Do not add polling or realtime behavior.
- Preserve the current global route loading and error boundaries while adding
  truthful section states where useful.

## Interactions

- Summary and `Voir tout` links use real current routes.
- In internal, Booking-service management links to
  `/etablissement/horaires-services#horaires-hebdomadaires`, the canonical
  owner of weekly schedules and service periods.
- In internal, the reservation action navigates to the existing reservation
  creation workflow or uses its established mutation path.
- Do not add reservation filter chips until their URL or local-filter semantics
  are defined.
- Do not render overflow menus with no supported actions.
- No task checkbox or cross-module add menu is part of current scope.

## Testing focus

- establishment-local date near midnight;
- booking entitlement and read permission;
- reputation enabled, hidden, and unavailable states;
- reservation sorting and status summaries;
- enabled service-period selection by local weekday;
- empty booking data;
- one supported section failing while another remains truthful;
- cross-tenant denial through existing repository and authorization tests;
- A loaders omit Booking/DIRECT/AI reads and serialization, with no deferred CTA;
- A Google/actor/status consistency, uncapped counts, local PUBLISHED reply,
  new/attention links and truthful empty/setup/unavailable recovery;
- separate A observation/Browser QA and internal regression evidence.
