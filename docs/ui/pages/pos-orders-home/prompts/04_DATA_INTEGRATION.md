# Phase 04 — POS Orders Home Data Integration

No data-layer change is expected for the approved UI renewal. Run this phase only if explicitly approved after a new proposal records why the current read path is insufficient.

Preserve `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`, `@yuta/contracts/local-pos`, 05:00 service-day rules, stored totals/statuses, and all service-owned locks/transactions. The known repeated `3 × (1 + N)` local HTTP pattern and 200-order cap may be measured, but changing aggregation, filters, pagination, contracts, APIs, schema, indexes, or caching is separate scope.

Stop before any database/API/contract/auth/runtime/device change and obtain product/engineering approval with tests and documentation impact.
