# Phase 04 — Real Local Read Vertical Slice

Run only after separate Phase 4 approval of exact semantics, contract/API
impact, and Phase 00 repository revalidation.

Implement one protected read-only vertical slice:

- strict local-pos query/response schemas with integer cents and ISO times;
- one admin/manager-authorized site-agent report endpoint/service;
- one captured 05:00 service window per request;
- paid payment principal, final paid-order count, service-day open count, and
  bounded/deduplicated activity rows using approved predicates;
- server-only POS client and Management Server Component;
- loading, zero/empty, local outage, expired/forbidden, retry, pagination, and
  correct `/orders/<orderId>` navigation;
- focused contract, service, database integration, auth-denial, split,
  cancel/refund, boundary, pagination, client, and UI tests;
- removal of every prototype fixture before enabling the hub card.

Preserve POS -> site-agent -> db-pos ownership. Do not add cloud sync, schema,
migration, report table, client aggregation, export, fiscal/accounting claims,
polling/cache, mutations, or device behavior. Stop if an index/schema or broader
authorization decision becomes necessary.
