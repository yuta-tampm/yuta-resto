# Préparer un projet de contrat CDI — Implementation Plan

Status: Phase 1 implemented and verified

Visibility: Engineering

## Phase 0 — Complete

Repository analysis confirmed a placeholder route with no Formalités domain,
data, action, contract, permission, persistence, provider, or test. The target
is `NEW_PAGE`; the current Backoffice shell is reused; no image is required.

## Phase 1 — Approved fictional read-only prototype

1. Reuse server-side personnel authorization and active-establishment guard.
2. Add one typed route-local fictional fixture without identifiers.
3. Render reusable-versus-missing CDI readiness with permanent disclaimer.
4. Disable generation and add no actions, APIs, providers, or persistence.
5. Hide the navigation item when personnel access is unavailable.
6. Add component and navigation regression tests.

## Deferred phases

Phase 2 may connect the entry from a full employee dossier only after approval
to read trusted employee facts. Phase 3 may add contract-specific inputs only
after an approved model and validation. F5-07/F5-08 gate any lifecycle,
persistence, generation, legal, privacy, security, audit, and production work.

## Verification

```text
pnpm ui:pack:check backoffice-equipe-formalites-personnel
pnpm docs:check
pnpm architecture:check
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice test
pnpm --filter @yuta/backoffice build
pnpm -r --if-present typecheck
pnpm format:check
```

Browser QA targets: authenticated OWNER at 1440, 1024, 768, and 390 CSS pixels.
