# Authenticated Establishment Switching QA Report

Change: Authenticated Backoffice establishment switching

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA status: PASS

Route(s): `http://localhost:3001/aujourdhui`

Data/test setup: Existing local `yuta_cloud` development database and the
existing active `owner@luna-restaurant.fr` OWNER identity. No seed, fixture,
membership, authorization, schema, or production-code change was made for QA.

Roles/states: Active OWNER with active memberships in LUNA and LuNa Poitiers.
The browser was returned to LUNA at the end of QA.

Viewport(s):

- Desktop render path: 1215x1272.
- Mobile render path: 319x1272. This is narrower than the documented 390px
  reference width and exercises the same `md:hidden` mobile shell path.

Scenarios tested:

- Desktop LUNA -> LuNa Poitiers from one selection gesture.
- Desktop pending state: `aria-busy=true`, selector disabled, visible
  `Changement d’établissement…` copy, and no secondary submit control.
- Desktop LuNa Poitiers persisted after a full browser refresh.
- Desktop LuNa Poitiers -> LUNA switch-back.
- Desktop LUNA -> LUNA selected-value no-op: no busy state or transition.
- Mobile selector reachability through the mobile navigation drawer.
- Mobile LUNA -> LuNa Poitiers from one selection gesture with the same
  pending/disabled/loading behavior.
- Mobile LuNa Poitiers persisted after a full browser refresh.
- Mobile LuNa Poitiers -> LUNA switch-back.
- Establishment-scoped `Avis à traiter` data changed from 6 for LUNA to 3 for
  LuNa Poitiers and returned to 6 after switch-back on both render paths.
- Read-only database evidence confirmed each switch created a new session for
  the selected membership, revoked the preceding session, and left the final
  active session scoped to LUNA.

Accessibility checks:

- The active-establishment control exposes the accessible name
  `Établissement actif` on desktop and mobile.
- The mobile drawer exposes `Ouvrir le menu` and `Fermer le menu` controls.
- The pending form exposes `aria-busy=true`, disables the selector, and
  supplies visible loading text.
- Duplicate interaction is prevented while the transition is pending.

Visual/responsive findings: The selector is directly reachable in the desktop
header and reachable at the top of the mobile drawer. No clipping or unusable
layout was observed in the switching path. The mobile viewport was narrower
than the documented reference and remained functional.

Regression findings: No selector/trusted-scope mismatch was observed. The
selector label, server-rendered scoped data, and persisted session scope agreed
after every completed transition and refresh.

Authorization/entitlement sanity: Both memberships use the same active OWNER
role, so entitlement differences cannot be distinguished visually. The OWNER
navigation remained available and no stale cross-establishment data was
observed.

Error behavior: NOT_SAFELY_REPRODUCIBLE. Membership, session, and database state
were not intentionally corrupted to force an error.

Database integration follow-up: BLOCKED_BY_ENVIRONMENT. The targeted command
`pnpm --filter @yuta/db-cloud exec vitest run test/auth-selection.integration.test.ts`
was executed, but the file and all four tests were skipped because the required
explicit guard was absent. The current `yuta_cloud` database is persistent
development data, not a disposable integration database.

Known limitations:

- Exact 1366x768 and 390x844 viewport dimensions were not available from the
  in-app browser panel. The actual desktop and mobile responsive render paths
  were exercised at the dimensions recorded above.
- The failure path was not safely reproducible at runtime; existing unit tests
  remain the evidence for that branch.

Screenshot evidence: See `screenshot-manifest.md` in this directory.
