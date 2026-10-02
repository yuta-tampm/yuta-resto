# Back-office Agent Instructions

`apps/backoffice` is the authenticated restaurant-facing cloud application. UI
text is French; code and technical documentation are English.

For design-to-code work, also read `docs/ui/README.md`,
`docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/BACKOFFICE_FRONTEND_RULES.md`, and
any current page specification under `docs/ui/pages/`. Visual references are
subordinate to current repository architecture, behavior, and authorization.

- Authenticate and authorize on the server.
- Derive organization, establishment, membership, role, permissions, and
  entitlements from trusted session state; never trust browser-provided scope.
- Every tenant-owned repository read or mutation receives trusted tenant scope.
- Tenant switching validates membership and refreshes trusted session state.
- Keep `@yuta/db-cloud` and provider integrations behind server boundaries.
- Do not put platform-wide YUTA administration or local POS operations here.
- Prefer Server Components and reuse `@yuta/ui`; implement loading, empty,
  error, forbidden, validation, and persisted-success states as applicable.
- Decide capability availability, Reputation data scope (including ordering
  and counters derived from gated data) and denial recovery through the
  exposure policy table in `src/lib/backoffice-exposure.ts`, read via
  `src/server/backoffice-exposure.ts`. Use `isReleaseAExposure()` only for the
  release's presentation shape: copy, layout, preview size, setup summary,
  model discriminant and recovery pages.
- Import from `src` with the `@/` alias (for example `@/server/auth/session`)
  instead of relative paths that climb three or more directory levels; keep
  short relative imports for nearby files. Tests mirror this alias through
  `vitest.config.ts`.

Normally validate with:

```bash
pnpm architecture:check
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice test
pnpm --filter @yuta/backoffice build
```

Also run affected auth, tenant, contract, booking, and cloud-database tests.
