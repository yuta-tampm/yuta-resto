# Phase 00 — POS Orders Home Repository Analysis

Work on `apps/yuta-pos` route `/` using `docs/ui/pages/pos-orders-home/`. This is a read-only hard gate.

1. Check `git status` first and preserve unrelated work.
2. Re-read root/app instructions, current UI workflows/POS rules, POS product/operator/offline/QA/local-development/deployment docs, and this stable page pack.
3. Re-confirm from repository evidence: `PAGE`, `EXISTING_PAGE`, `integrated`, `EXISTING_CAPABILITY_RENEWAL`.
4. Re-audit `page.tsx`, `orders-service-day.ts`, `posApi.listOrderDetails`, site-agent client/contracts/routes/services, db-pos order schema, POS shell/health, adjacent routes, and tests.
5. Reconfirm service-day membership/sorting, search/query handling, totals/item count/allergy/status mapping, responsive renderers, all visible routes/actions, and dead `Filtres`/`Options` controls.
6. Reconfirm the reviewed full-width/prominent desktop header direction can reuse the existing `/pos` shell variant without copying `/pos` content or changing Home routes; preserve the compact menu below `lg`.
7. Reconfirm the unauthenticated Home GET boundary, staff attribution versus authorization, management-session separation, no cloud sync, and service-owned transactions/locks.
8. Compare current real-data baseline with Phase 0 evidence. Do not create or mutate operational data.
9. Report repository drift, exact commands, change flags, blockers, and whether the approved later phase can proceed.

Make no runtime-code change in this phase. Stop if classification, shell, behavior, or any database/API/auth/runtime flag has changed.
