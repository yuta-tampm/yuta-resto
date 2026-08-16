# Phase 01 — Approved POS Orders Home Visual Baseline

Run only after Phase 0 and a `DRAFT` design proposal have been explicitly approved for Phase 1.

Renew the real `/` implementation in place using current persisted local data. Preserve `PosPageShell`, `PosHeader`, `PosConnectivityStatus`, three service-day views, query-string search, current real routes/status actions, internal scroll, and service-owned values. Implement the reviewed full-width/prominent desktop header direction using the existing `/pos` shell variant, while keeping Home-specific title/actions and the compact menu below `lg`. Follow any approved full-page reference only for hierarchy, density, spacing, and responsive presentation.

Remove dead `Filtres` and desktop `Options` affordances if that is the approved direction; do not invent behavior. Add no fixture, API, contract, schema, permission, cloud, realtime, offline-queue, customer, fiscal, or printer-control capability. Keep Home specific components route-local. Stop and report any required impact outside `apps/yuta-pos` UI.
