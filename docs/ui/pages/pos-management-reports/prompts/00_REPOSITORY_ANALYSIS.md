# Phase 00 — Repository Analysis Gate

Re-run this read-only gate immediately before any later phase.

1. Inspect `git status` and preserve unrelated work.
2. Read root and nested POS/site-agent/contracts/db-pos instructions, current
   docs, full UI workflow authority, and this entire page pack.
3. Confirm whether `/management/reports`, its hub card, contract, protected
   site-agent read, db-pos query, or tests changed since Phase 0.
4. Re-inventory `ManagementHeader`, local Management cookie/bearer session,
   admin/manager authorization, POS client, report-adjacent orders/payment
   services, service-day helper, schema, contracts, and tests.
5. Re-confirm payment source, paid/open/activity predicates, split/cancel/refund
   semantics, pagination, timezone configuration, and offline behavior.
6. Report repository drift and do not silently preserve stale decisions.
7. Confirm `R0-01` through `R0-10` and the requested next phase have explicit
   approval.

Do not edit runtime code, create fixtures, add routes/contracts/schema, query or
mutate operational data, seed/reset a database, or begin another phase during
this gate. Stop on missing approval or conflicting repository reality.
