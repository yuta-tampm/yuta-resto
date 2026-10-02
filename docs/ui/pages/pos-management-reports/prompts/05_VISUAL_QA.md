# Phase 05 — Functional, Visual, and As-Built QA

Run only after Phase 04 functional/regression checks pass and Phase 00 confirms
no drift.

Verify approved payment/order/service-day semantics and admin/manager denial
tests before visual review. Run the exact commands in `IMPLEMENTATION_PLAN.md`,
using a documented disposable database only for guarded integration tests.

Capture authenticated, non-sensitive evidence at 1366×768, 1024×768,
768×1024, and 390×844. Verify Management-shell fidelity, correct metrics and
interval, zero/empty, local-service/database error, expired session, pagination,
refresh, direct order link, keyboard/focus, 44px touch targets, and no
horizontal overflow. Do not mutate orders/payments merely to manufacture visual
states; use safe existing test infrastructure or deterministic authorized test
data only.

Synchronize this stable pack and current POS product/operator/QA docs with the
actual implementation. Record exact checks, browser evidence, deviations,
deferred risks, and fixture removal before marking the pack `implemented`.
