# POS Management Establishment — Implementation Plan

Status: Phase 5 complete

Visibility: Engineering

## Phase 0 — Repository analysis gate

Complete. Documentation only; no runtime/schema/data mutation. Stop at the
product-owner gate.

## Phase 1 — Approved discovery design

After explicit approval, generate and review the responsive proposal from
`DESIGN_HANDOFF.md`. If a typed-fixture prototype is approved, keep it clearly
labelled, development-only, and disconnected from site-agent/db-pos. Do not add
the working hub route/card merely to make a mockup navigable.

Design generation was authorized and completed on 2026-08-19. The product owner
approved the desktop and mobile visual direction on 2026-08-20. The remaining
product/data decisions are still required before real integration.

## Phase 2 — Component structure

After design approval, define route-local components by responsibility. Reuse
`ManagementHeader` and `@yuta/ui`; keep trusted loading in the Server Component
and interactive form state in the smallest client boundary.

Completed on 2026-08-20 as an explicitly labelled, development-only fixture
prototype. No client boundary was needed because the field is read-only and the
save action is disabled. The route validates the existing local Management
session, fails closed outside development, is not linked from the hub, and has
no site-agent, contract, schema, persistence, printing, or receipt integration.

## Phase 3 — Approved interactions

Implement only approved validation, edit rights, dirty state, save feedback,
clear/rename confirmation, conflict recovery, and session-expiry behavior.

Completed on 2026-08-20 for the development-only prototype boundary. The client
component supports editing, exact dirty-state comparison, reset, simulated-save
feedback, retained input, and the existing server-derived session gate. It does
not implement domain validation, role-specific rights, clear/rename
confirmation, pending persistence, conflict, outage, or retry behavior because
those require the still-unapproved real data/runtime contract.

## Phase 4 — Real vertical slice

Requires a second explicit data/runtime approval. Deliver end-to-end: approved
domain rule, singleton schema/migration, repository/service authorization and
CAS if selected, local-pos contract, protected site-agent route, server-only
POS client/action, real UI states/tests, receipt snapshot field, renderer, and
preview parity. Never use cloud establishment data.

Receipt integration must read the profile at initial receipt-job creation,
store the optional value in the immutable payload, omit it when absent, and
copy old payloads unchanged for retry/reprint.

Completed on 2026-08-20 after explicit product-owner approval. The delivered
slice includes the dedicated singleton migration, validated local-pos contract,
authenticated admin/manager GET/PATCH route, revision CAS, server-only POS
client/action, real form states, hub card, optional receipt snapshot field,
renderer omission/line behavior, preview parity, and guarded disposable-DB
tests. No operational database migration was run during implementation.

## Functional/regression gate

Run page-pack/docs/architecture/workspace checks plus scoped contracts, db-pos,
site-agent, POS, guarded database integration, receipt preview, and POS build
checks. No operational database may be used for test setup.

## Phase 5 — Visual and operational QA

After functional checks, test the four POS viewports, keyboard/touch/focus,
overflow, all truthful states, session denial, conflict recovery, and receipt
preview. Do not create a print job or use live operational data solely for QA.

Completed on 2026-08-20 after explicit product-owner approval. The configured
production build passed at 1366x768, 1024x768, 768x1024, and 390x844 with zero
horizontal overflow, empty browser warning/error logs, and 48px form controls.
Read-only draft/reset/invalid-state checks restored `LUNA` without a save. The
product owner separately confirmed the real save flow. Conflict, session
denial, outage, receipt snapshot, and immutable reprint behavior remain covered
by the Phase 4 automated and guarded disposable-database suites; no live print
job or active order was created for QA.
