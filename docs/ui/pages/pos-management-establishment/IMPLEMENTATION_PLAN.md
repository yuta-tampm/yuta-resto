# POS Management Establishment — Implementation Plan

Status: Approval-gated proposal

Visibility: Engineering

## Phase 0 — Repository analysis gate

Complete. Documentation only; no runtime/schema/data mutation. Stop at the
product-owner gate.

## Phase 1 — Approved discovery design

After explicit approval, generate and review the responsive proposal from
`DESIGN_HANDOFF.md`. If a typed-fixture prototype is approved, keep it clearly
labelled, development-only, and disconnected from site-agent/db-pos. Do not add
the working hub route/card merely to make a mockup navigable.

Design generation was authorized and completed on 2026-08-19. The desktop and
mobile outputs remain `DRAFT`; product review and the remaining product/data
decisions are still required. No fixture prototype was authorized.

## Phase 2 — Component structure

After design approval, define route-local components by responsibility. Reuse
`ManagementHeader` and `@yuta/ui`; keep trusted loading in the Server Component
and interactive form state in the smallest client boundary.

## Phase 3 — Approved interactions

Implement only approved validation, edit rights, dirty state, save feedback,
clear/rename confirmation, conflict recovery, and session-expiry behavior.

## Phase 4 — Real vertical slice

Requires a second explicit data/runtime approval. Deliver end-to-end: approved
domain rule, singleton schema/migration, repository/service authorization and
CAS if selected, local-pos contract, protected site-agent route, server-only
POS client/action, real UI states/tests, receipt snapshot field, renderer, and
preview parity. Never use cloud establishment data.

Receipt integration must read the profile at initial receipt-job creation,
store the optional value in the immutable payload, omit it when absent, and
copy old payloads unchanged for retry/reprint.

## Functional/regression gate

Run page-pack/docs/architecture/workspace checks plus scoped contracts, db-pos,
site-agent, POS, guarded database integration, receipt preview, and POS build
checks. No operational database may be used for test setup.

## Phase 5 — Visual and operational QA

After functional checks, test the four POS viewports, keyboard/touch/focus,
overflow, all truthful states, session denial, conflict recovery, and receipt
preview. Do not create a print job or use live operational data solely for QA.
