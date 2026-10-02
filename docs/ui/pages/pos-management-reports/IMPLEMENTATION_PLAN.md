# POS Management Reports — Implementation Plan

Status: Phase 5 complete

Visibility: Engineering

## Delivery principle

Follow `NEW_CAPABILITY_DISCOVERY`. Deliver one tested local read-only vertical
slice after product/data and design approval. Do not build cloud reporting,
report persistence, accounting exports, or a broad analytics backend.

## Phase 0 — Repository and product discovery

Complete in this package:

- confirm route absence and hub placeholder;
- inventory Management session/shell and local runtime ownership;
- map service day, order, payment, split, cancel, refund, and offline semantics;
- define minimum scope, proposed data dictionary, states, tests, and prompts;
- update canonical POS backlog;
- record `R0-01` through `R0-10` approval and stop before visual generation.

No runtime, schema, API, contract, operational-data, or fixture change belongs
to Phase 0.

## Phase 1 — Approved visual discovery

Completed after explicit approval on 2026-08-20:

- run the prompt in `DESIGN_HANDOFF.md`;
- create desktop/narrow references using only fictional values;
- review shell fidelity, hierarchy, states, and truthful terminology;
- save the desktop and narrow DRAFT references in this package.

The product owner approved the visual direction on 2026-08-20 and separately
authorized the optional Phase 2 prototype on the same date.

No route/component/fixture/backend change is implied by image generation.

## Phase 2 — Optional typed-fixture UI prototype

Completed after separate approval on 2026-08-20:

- create a development-only, visibly labelled route-local prototype;
- reuse `ManagementHeader`; keep the hub card unavailable;
- use typed fictional values and no site-agent request;
- cover metric/list responsive structure and truthful state switching;
- prevent production rendering and remove fixtures before integration.

Actual files are route-local under `apps/yuta-pos/src/app/management/reports`,
with one focused `apps/yuta-pos/test/reports-prototype.test.tsx` suite. The
prototype uses a fictional Management identity because Phase 2 permits no
site-agent request; it returns `notFound()` outside development. The hub card
remains unavailable. No contracts, APIs, schema, migrations, report auth, or
operational data were added.

Phase 2 verification on 2026-08-20 passed the focused test (3 tests), full POS
test suite (76 tests), POS and recursive workspace typechecks, POS production
build, page-pack, documentation, architecture, scoped formatting, and scoped
diff checks. HTTP probes returned the labelled prototype with no order link in
development and a content-free 404 in production. Full-repository
`pnpm format:check` was also run and remains red on 23 pre-existing files
outside this page scope; none was reformatted.

This phase adds no contract, API, schema, migration, authorization, or real-data
claim. It may be skipped if approved design is sufficient.

## Phase 3 — Approved interaction prototype

Completed after separate approval on 2026-08-20:

- validate refresh, pagination, narrow row disclosure, keyboard focus, and
  order-link interaction with fictional IDs that cannot reach real orders;
- finalize the interaction map and response data dictionary;
- keep all mutation/export/date-range controls absent.

The prototype now uses browser-local state for a 500 ms simulated refresh,
three-item pages across seven fictional rows, a single expanded narrow row,
and focused status recovery. Activating `Ouvrir (démo)` focuses a warning and
never renders or follows `/orders/*`. Pagination focuses the activity heading
after a page change. The hub card remains unavailable and no operational data
is queried.

The production interaction proposal remains manual refresh, bounded server
pagination, standard real order links, and no polling/cache/export/range. The
fixture page size of three and simulated timing are test devices, not contract
defaults; the approved production default remains 50 with maximum 100.

Development browser QA on 2026-08-20 confirmed refresh pending/disabled and
completion announcements, page-2 content with focus restored to the activity
heading, blocked demo-order navigation with focused warning and unchanged URL,
and zero `/orders/*` links. At 390×844, disclosure state and controls matched,
only one row expanded, and document width had no horizontal overflow. This is
interaction evidence for the fictional prototype, not Phase 5 production
visual evidence.

## Phase 4 — First real authorized vertical slice

Completed after explicit approval on 2026-08-20.

1. Add strict local-pos query/response schemas with integer cents and ISO times.
2. Add one protected read-only site-agent route and report service.
3. Reuse current service-day helpers/predicates; capture one window per request.
4. Aggregate paid payment principal, final paid orders, service-day open orders,
   and bounded activity rows at site-agent.
5. Enforce active admin/manager bearer authorization before any query/response.
6. Add service, route, contract, auth-denial, boundary, split, cancellation,
   refunded-row, and pagination tests.
7. Add the server-only POS client method and authenticated Server Component.
8. Replace/remove every prototype fixture and development gate.
9. Add loading/error/empty/session recovery and real order links.
10. Make the Management hub card available only when the integrated route is
    truthful.
11. Update POS product, operator, QA, and this page pack.

No schema/migration is expected. Stop if query evidence proves an index or
stored aggregate is necessary; review that as separate data scope.

The implementation matches all eleven steps. It adds one strict contract and
protected endpoint, captures one service window per request, performs bounded
database aggregates/ordering, reuses the existing local bearer guard, removes
all prototype artifacts, and makes the hub card available. The POS renders
authenticated loading, empty, error/retry, manual refresh, pagination, and real
order-link behavior.

Site-agent configuration now requires `TZ=Europe/Paris` and fails startup when
the runtime resolves another zone. Deployment documentation separately requires
the Luna host to use `Europe/Paris`; no machine setting or production service
was changed by this phase. No schema, migration, index, report table, cloud
integration, export, fiscal/accounting behavior, polling/cache, mutation, or
device behavior was added.

Phase 4 verification passed the contracts, POS, site-agent, recursive
typechecks, production POS build, offline acceptance, documentation,
architecture, page-pack, scoped formatting, and diff checks. The offline
harness now supplies the required timezone and runs the guarded report
integration test only against its disposable PostgreSQL instance. The final
offline runs used isolated non-default ports because port `3003` was already
occupied; no existing process was stopped. Full-repository formatting remains
red on 23 pre-existing out-of-scope files, while every Phase 4 file passes.

## Phase 5 — Functional and visual QA

Completed after explicit authorization on 2026-08-20. Production-build browser
QA covered 1366×768, 1024×768, 768×1024, and 390×844 with no horizontal
overflow and 44px report actions. It also verified refresh completion,
pagination and heading-focus recovery, the exact order destination, accessible
logout/login recovery, real-zero empty content, route-specific local database
failure, retry recovery, textual statuses, and empty browser warning/error
logs. Browser QA found and resolved the stuck refresh transition, missing
pagination focus handoff, and missing programmatic login field names.

Run functional/regression checks before visual claims:

```text
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
pnpm typecheck:pos
pnpm typecheck:site-agent
pnpm typecheck:db-pos
pnpm test:pos
pnpm test:site-agent
pnpm test:db-pos
pnpm test:pos:offline
pnpm build:pos
pnpm ui:pack:check pos-management-reports
```

Run guarded database integration tests only against a documented disposable
database and with explicit test authorization. Do not query production or local
operational data for visual evidence.

Browser QA uses 1366×768, 1024×768, 768×1024, and 390×844 and verifies shell,
metrics, real bounded data, empty/error/login recovery, pagination, link target,
keyboard focus, touch size, and no horizontal overflow.

## As-built synchronization

After delivery, record actual files, checks, browser evidence, deviations,
deferred decisions, and fixture removal. Set `Package status: implemented` only
when real integration and current documentation match.

## Stop conditions

Stop for approval on any change to service-day/timezone, revenue/refund meaning,
order/check counting, roles/session behavior, schema/migration, cloud scope,
fiscal/accounting/export capability, polling/cache, or devices.
