# QA Report — Formalités Persistent Draft Foundation

Change: `formalites-persistent-draft-foundation`

Date: 2026-09-05

Environment: local Backoffice development runtime, authenticated synthetic
accounts, disposable PostgreSQL 16.14 database, no production or Neon data.

Route under test:
`/equipe/formalites-personnel/[employeeId]`

## Verdict

`QA: PASS`

`UI_AFFECTING: YES`

`BROWSER_QA_REQUIRED: YES`

All mandatory viewports, supported lifecycle states, recovery paths and
security rendering checks passed. No production route, migration, data or
configuration was used.

## Browser and data setup

- Browser: installed Google Chrome driven by the repository's existing
  Playwright and Axe dependencies.
- Locale: `fr-FR`.
- Backoffice: local development server on loopback port 3101 with the existing
  development-only Formalités route flag enabled.
- Database: disposable Docker `postgres:16-alpine`, actual PostgreSQL 16.14,
  loopback port 56042.
- Users: synthetic OWNER and MANAGER memberships from the local seed only.
- Employees and Formalités records: synthetic rows created solely in the
  disposable database.

## Required viewport evidence

| Width | Representative state                                    | Horizontal overflow  | Result |
| ----: | ------------------------------------------------------- | -------------------- | ------ |
|  1440 | Eligible employee, no draft                             | None (`1440 / 1440`) | PASS   |
|  1024 | Created editable draft, stale and server-error recovery | None (`1024 / 1024`) | PASS   |
|   768 | Reconciliation, stale source and abandoned read-only    | None (`768 / 768`)   | PASS   |
|   390 | Validation, non-CDI recovery and abandon dialog         | None (`390 / 390`)   | PASS   |

## Functional scenarios

| Scenario                            | Evidence                                                                                | Result |
| ----------------------------------- | --------------------------------------------------------------------------------------- | ------ |
| Eligible OWNER, no draft            | Real route loads trusted current Personnel values                                       | PASS   |
| Create draft                        | One active `cdi_preparation` draft persisted                                            | PASS   |
| SAVE while `UNDECIDED`              | Reload preserves `undecided`                                                            | PASS   |
| INCLUDE and EXCLUDE                 | Both values persist and reopen correctly                                                | PASS   |
| Reload/reopen                       | Persisted draft replaces in-memory prototype behavior                                   | PASS   |
| Reconciliation                      | Per-fact KEEP, REFRESH and mixed decisions                                              | PASS   |
| KEEP acknowledgement                | Unchanged Personnel source does not prompt again; Personnel truth stays unchanged       | PASS   |
| Changed source after reconciliation | New divergence is presented                                                             | PASS   |
| Stale source                        | Mutation rejected; recoverable reload is shown                                          | PASS   |
| Stale draft                         | Concurrent-tab update is detected; no silent overwrite                                  | PASS   |
| Recoverable server error            | Unsaved input retained; same logical retry commits exactly once (`revision 7 -> 8`)     | PASS   |
| Replay conflict                     | Same operation identity with different logical payload is rejected                      | PASS   |
| Double submit                       | Pending controls prevent a duplicate revision/effect                                    | PASS   |
| Non-CDI recovery                    | Existing draft remains recoverable; normal save is blocked                              | PASS   |
| Abandon                             | Reason required; non-CDI abandonment allowed; retained record is read-only              | PASS   |
| Create after abandon                | Allowed after current Personnel returns to CDI                                          | PASS   |
| Dirty close                         | Browser confirmation protects unsaved values                                            | PASS   |
| Keyboard/focus                      | Tab navigation works; per-fact error returns focus to the missing reconciliation choice | PASS   |
| OWNER access                        | Authorized route and operations work                                                    | PASS   |
| MANAGER access                      | Data is denied and no draft/Personnel values leak                                       | PASS   |
| Anonymous access                    | Existing login recovery is preserved                                                    | PASS   |

## Loading, success and error states

- Pending buttons become disabled/loading during an authoritative mutation;
  the real double-submit scenario created only one effect.
- Successful create/save/reconcile/abandon operations reload the authoritative
  read model and display the committed state immediately.
- Validation, stale source, stale draft, replay conflict and generic server
  errors remain visible and recoverable without false partial success.
- A deliberately unavailable command-receipt table produced the generic error
  path; restoring the disposable table and retrying the same logical operation
  committed once.

## Accessibility and sensitive rendering

- Feature-workspace Axe scan: zero serious or critical violations after the
  scoped contrast correction.
- Abandon dialog has an accessible name.
- Visible focus and keyboard traversal remain usable.
- The rendered route contains none of: raw operation key,
  `sourceStateFingerprint`, `requestFingerprint`, actor/organization/
  establishment IDs, remuneration or employee address.
- The UI contains no PDF, template, signature, provider, legal-decision or
  production-readiness behavior.

## Defects found and corrected within approved scope

1. At 1024px the three probation-choice cards were too compressed. The
   three-column breakpoint was moved from `md` to `xl` in the existing Phase 3
   workspace component.
2. Feature success descriptions inherited insufficient contrast through local
   opacity. The feature-local alert descriptions now use the semantic primary
   foreground at full opacity.

No shared `@yuta/ui` primitive was modified. The full focused component/state
suite and the complete browser matrix were rerun after both corrections.

## Truthful known limitations

- The Formalités helper returns the existing `TenantError` permission denial
  with code `CROSS_TENANT_ACCESS_DENIED` and status 403. In the local Next.js
  development route, the shared error boundary renders the generic French
  permission message while the development HTTP request is logged as 500.
  Authorization denial and no-data-leak behavior are verified; this change did
  not alter the shared Next error-to-HTTP mapping.
- Repository-wide `pnpm format:check` remains failing for exactly 62
  pre-existing, unrelated files. Every attributable implementation, page-pack
  and review-text path checked in this change passes scoped Prettier.

## Evidence

- Browser runner: `browser-qa.mjs`
- Machine-readable results: `browser-qa-results.json`
- Screenshot inventory and hashes: `screenshot-manifest.md`

Production migration, route enablement and deployment remain
`NOT_AUTHORIZED`.
