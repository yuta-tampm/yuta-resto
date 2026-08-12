# Backoffice Équipe — Salariés — Implementation Plan

Status: Draft

Visibility: Engineering

## Delivery mode

Use `NEW_CAPABILITY_DISCOVERY`. Deliver approved vertical slices rather than a
complete frontend or backend in isolation.

## Phase 0 — Repository analysis gate

Status: complete, documentation only. The package records classification,
boundaries, repository gaps, MVP/deferred scope, sensitive-data gates, shared
context, shell mode, and a ready prompt. No runtime/schema/API change occurred.

Stop for product approval.

## Design-generation and approval gate

After approval, run `DESIGN_HANDOFF.md`, store generated references under
`references/` as `DRAFT`, remove unsupported concepts, and obtain explicit
scope/reference approval. An image alone never makes the package approved or
implementation-ready.

## Phase 1 — Typed-fixture UI discovery prototype

After scope/reference approval, compose the responsive page in the current
shell with typed fictional fixtures and a prototype-data notice. Cover approved
local interactions and required states. Create no contracts, repositories,
mutations, permissions, entitlements, schema, migrations, or providers.

## Phase 2 — Interaction map and data dictionary

Map each action/state; distinguish stored, derived, transient, and integration-
owned values; finalize aggregate, multiple-establishment, duplicate, conflict,
and departure semantics. Never turn fixture view types directly into tables.

## Phase 3 — Domain/security/privacy approval

Approve ownership, aggregate rules, role/action/field matrix, entitlement,
sensitive-data purpose, audit, retention, documents if applicable, register
scope, and concurrency/cross-tenant tests before integration.

## Phase 4 — Production vertical slices

```text
approved flow -> domain rule -> reviewed schema/migration when required
-> establishment-scoped repository/authorization -> Zod transport contract
-> security/domain tests -> integrated UI/truthful states -> fixture removal
```

Recommended order: list/read, create minimum relationship, edit with conflict
handling, non-destructive departure, then minimal audit history. Documents,
OCR, Formalités, apprenticeship, and register/PDF remain separate waves.

## Verification gate

Use exact affected commands including:

```text
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
pnpm format:check
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice test
pnpm --filter @yuta/backoffice build
pnpm test:auth
pnpm --filter @yuta/tenant test
pnpm --filter @yuta/contracts test
pnpm test:db-cloud
```

Schema work additionally requires guarded integration tests and reviewed SQL.
The Backoffice has no lint script.

## Phase 5 — Functional, security, visual, and as-built QA

Run functional/security checks before visual review. Verify 1440/1024/768/390,
shell fidelity, hierarchy, states, keyboard/focus, overflow, dialogs, and input
recovery. Test tenant/authorization denial cases, remove completed-slice
fixtures, and synchronize docs before marking the package `implemented`.
