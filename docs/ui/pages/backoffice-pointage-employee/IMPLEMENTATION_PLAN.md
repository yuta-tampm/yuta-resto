# Pointage employee — Implementation Plan

Status: AWAITING_HUMAN_REVIEW

Visibility: Engineering

Application: apps/backoffice

Route: /pointage/[establishmentSlug]

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Apply authorization: NOT_GRANTED

Production enablement: NOT_AUTHORIZED

## Authority and exact phase mapping

The [master Tasks / Implementation Plan](../../../../openspec/changes/pointage-usable-raw-clocking/tasks.md)
owns the four Apply phases, 32 unchecked tasks, embedded contracts and complete
20-requirement / 62-scenario traceability. This page plan specializes the
Employee Transport / UI phase; it creates neither an additional Apply phase nor
new Product/security authority. The [approved Design](../../../../openspec/changes/pointage-usable-raw-clocking/design.md)
and byte-locked PRODUCT_SCOPE, UI_SPEC, DATA_AND_INTERACTION_SPEC,
DESIGN_HANDOFF and ACCEPTANCE_CHECKLIST remain the reviewed sources.
The README records current approval; historical DRAFT/pre-approval labels and
unchecked planning boxes in those five documents are preserved by explicit
user instruction, not a request to reopen their approved content.

| Canonical UI checkpoint | Placement in this change                                                    | Execution boundary                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 00 Repository analysis  | Read-only pre-Apply refresh of DESIGN_HANDOFF inventory and approved hashes | Stop on drift/conflict; do not rewrite locked documents or generate an image.                                                        |
| 01 Visual baseline      | Apply phase 3, task 3.4, after phases 1-2 supply the actual consumer        | Approved written no-image direction; no fixture-success route. Retain prompt's review stop.                                          |
| 02 Component refactor   | Apply phase 3, task 3.4                                                     | Meaningful route-local responsibilities only; no shared primitive/global-shell changes.                                              |
| 03 Interactions         | Apply phase 3, tasks 3.5-3.7                                                | Exact state/clearing/recovery behavior; no extra domain rules.                                                                       |
| 04 Data integration     | Apply phase 3, tasks 3.1-3.3/3.8 coordinated with master phases 1-2         | Approved Design binds the exact new DTO/API/schema boundaries; stop for any new/unapproved boundary and for missing Apply authority. |
| 05 Visual QA            | Separate post-Apply QA, after formal VERIFY PASS                            | Not an Apply checkbox. Real-route evidence at all four viewports; no automatic lifecycle promotion.                                  |

The prompt snapshots refer to current shared governance instead of copying it.
Read this plan and master Tasks before executing a prompt. A sealed prompt,
implementation-ready package or passing pack validator never grants Apply.
Keep per-prompt human stops; the combined phase label does not waive them.
The user's four-phase grouping takes precedence over optional template labels.

## Phase 0 — repository analysis refresh

Current target is NEW_PAGE / integrated / NEW_CAPABILITY_DISCOVERY.
The existing root document owns fonts/styles; the authenticated restaurant
shell is a different subtree. NO_APPLICATION_SHELL is approved.
Foundation credential service/repository and Personnel fields exist; the new
employee route, raw evidence, continuation consumer and browser transport do not
exist at this planning checkpoint. Baseline is NOT_APPLICABLE, not a fabricated
screen capture. Inventory details remain in DESIGN_HANDOFF.

Before any Apply, reread root/scoped AGENTS, docs/README.md, CURRENT_STATE,
AUTHORITY_MODEL, current architecture/auth/tenancy/database/Personnel docs and
the approved change. Follow docs/ui/README.md, YUTA_FRONTEND_RULES.md,
BACKOFFICE_FRONTEND_RULES.md, DESIGN_TO_CODE_WORKFLOW.md,
DELIVERY_WORKFLOW_MODES.md and PAGE_PACK_PROTOCOL.md. Resolve current shared
exports/tokens from packages/ui/src/index.ts and styles/global.css.
Do not reproduce their component/token catalog here.

Recompute all approved hashes/path sets and fresh Git status. The checkout has
unrelated tracked edits and untracked foundation files. Preserve the exact
Formalités export hunk in packages/auth/src/index.ts, existing journal/history,
shared async UI work, Google selector and backoffice-frame changes. Save exact
pre-Apply bytes, distinguish new raw-clocking files from pre-existing untracked
foundation and stop if overlapping work cannot be isolated.

## Expected change impact

Files expected to modify: only isolated exports and foundation integration
listed in master Tasks AUTH/DATA/DOMAIN/DTO/UI_TEST; no shared UI, global CSS,
root layout, manager placeholder or authenticated shell modifications.

Files expected to create: exact PAGE, HTTP, HEADERS, DTO and UI_TEST paths in
master Tasks. The page entry orchestrates neutral content; route-local client
owns only the live interaction. Server-only handlers/services own trusted
scope, auth, persistence and transactions. No generic app/components folder.

Packages affected: @yuta/backoffice, @yuta/contracts, @yuta/auth, @yuta/db-cloud.
Cross-application impact: NO; no other app/runtime modification.
Database change: YES, approved additive cloud Design, future Apply only.
API or contract change: YES, only approved D8 employee endpoints.
Permission/auth change: YES, bounded Pointage continuation; no new grant.
Runtime/device change: NO new runtime/device; guarded cloud local-test composition.

## Approved visual implementation

Use UI_SPEC's French copy and written layout: one centered responsive content
column, narrow gutters at least16px, maximum480px visual target using existing
spacing conventions, controls at least48px, long names wrap. Existing Geist
Sans/Inter fallback and semantic tokens; shared primitives only as needed.
No-image reference is intentional and human-approved, recorded in
[references/README.md](references/README.md). No screenshot/mockup provenance
is claimed. Do not generate an image merely to populate references.

Reuse in order: current feature/app component where suitable, compose shared
primitives, then create meaningful route-local components. No speculative
shared component/API or new library. The PAGE ownership list separates
credential entry, active state/receipt and interaction/client logic. Keep
database/auth primitives out of browser imports. No application shell,
account area, navigation, establishment/employee chooser or manager control.

## Interaction and integration implementation

| State family                        | Implementation obligation                                                                                                               | Planned proof                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Credential entry / identify pending | Mask eight digits, explicit French-labelled submit, no duplicate request; clear PIN when identify settles; no prior employee data.      | DTO/UI_TEST and real-route QA.                                       |
| NOT_CLOCKED_IN / CLOCKED_IN         | Own name, current state and open-session start only; no previous departure/history/totals.                                              | Current scoped Personnel/state tests and response field allowlist.   |
| Mutation pending                    | Freeze UUIDv4 requestId + kind + stateGuard; disable duplicate action, keep Terminer available; no optimistic success.                  | Interaction tests and real DB delayed-response QA.                   |
| CLOCK_IN / CLOCK_OUT receipt        | Render only committed joined receipt; at most10s then end, or earlier expiry.                                                           | Real receipt with original server instant and UI timer tests.        |
| State / request conflict            | Distinct approved French messages; refresh current state and require explicit new action; never rebase automatically.                   | Stale OUT A/B and same-ID/different-intent tests.                    |
| Unknown result                      | Live tuple recovery/resend only, same identity; UNCONFIRMED does not prove no commit; no auto new ID.                                   | Real commit/lost response/recover, DB count remains one.             |
| Access failure / rate limit         | Non-enumerating messages; no credential/dossier/lifecycle disclosure; no automatic retry or employee residue.                           | Provider/limiter/authority tests and real-route UI checks.           |
| Cloud unavailable                   | Neutral unavailable or explicit unconfirmed mutation; never offline accepted evidence or queued mutation.                               | Actual unavailable connection/server observations.                   |
| End / neutral                       | Clear personal DOM/token/tuple synchronously and increment generation; abort/drop late callbacks. Local clearing is not remote end ACK. | Timer/event tests, two-user browser inspection and end/commit races. |

Successful identify must separately authorize pointage.employee.identify and
pointage.employee.state.read with current scope/Personnel/version guards,
validate/derive the raw chain, and commit continuation before exposing combined
token/state. Do not render an identify-only partial response. All state/mutation/
replay checks remain current; reset/expiry/end deny old continuation.
No merging exact operation IDs or broader employee/session grants.

Token is ptc1\_ opaque256-bit, memory-only; server absolute120s/idle60s,
no background heartbeat or durable browser state. On Terminer, expiry, hidden,
pagehide, navigation, refresh, back/forward, pageshow, bfcache, duplicate tab or
restart return to neutral and reject old-generation responses. Clear before
bfcache snapshot as well as pageshow; Cache-Control alone is insufficient.
No localStorage/sessionStorage/IndexedDB/history.state/URL/cookie/channel
identity/token persistence or handoff.

Use D8's strict4KiB JSON allowlists and dedicated Authorization header, exact
configured Origin, credentials omit and cross-site rejection. All personal
endpoints POST and no-store; context GET/HTML/RSC neutral only. Apply route-only
nonce CSP and security/cache headers; no existing unrelated route effects.
No raw rows, trusted context, secrets, identity payload logs or analytics.

After local tuple clearing, fresh identification can display current state
only; no restored receipt history/search. Server-confirmed own end serializes
with command locks; lost network means only local clearing is confirmed until
server expiry/end commit. Never fabricate an attendance auto-close.

## Functional and integration completion checks — Apply only

Run exact focused commands C8-C11 and negative inventory from master Tasks,
then broader C12/C13 with safe environment boundaries. Check component
ownership/imports, strict DTO serialization, cache/nonce behavior and
generation/timer logic. These are implementation checks, not formal VERIFY
or completed Browser QA. Do not create QA_REPORT or Gate3 during Apply.

Actual current command families:

- `pnpm --filter @yuta/contracts test`
- `pnpm --filter @yuta/auth test`
- `pnpm --filter @yuta/db-cloud test`
- `pnpm --filter @yuta/backoffice test`
- `pnpm test:cloud`
- `pnpm build:cloud`
- `pnpm docs:check`
- `pnpm architecture:check`
- `pnpm -r --if-present typecheck`
- `pnpm ui:pack:check backoffice-pointage-employee`
- `pnpm format:check`

Scoped Prettier is check-only for approved bytes. Exact planned focused file
selectors, migration commands and separated disposable databases are in master
Tasks; do not use ordinary .env.local or broad integration opt-in indiscriminately.
Future QA server command: `pnpm --filter @yuta/backoffice dev --hostname 127.0.0.1`.
Do not run it during planning or imply the page exists.

## POST-APPLY VERIFY PLAN

After32 Apply tasks complete, independently re-evaluate approved Specs/Design
against actual current code, tests, exact scoped diff and changed artifact
hashes. Master Tasks defines the Technical Compliance Matrix F1-F8, S1-S9,
U1-U8, R1-R7, migration/privilege/time proof and command/results/deviations.
Apply checks are inputs to a fresh evaluation, not automatic formal PASS.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

## QA PLAN — after formal VERIFY

UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES. QA has not been evaluated.
Use docs/YUTA_QA_PROTOCOL.md. QA NOT_APPLICABLE is not valid here.

Real implemented Next route plus migrated disposable PostgreSQL, actual
restricted writer and approved injected synthetic trusted-address provider are
mandatory. Require `NODE_ENV` development/test and all other Design D1 environment gates.
The URL hostname allowlist is `localhost`, `127.0.0.1`, `[::1]`; the exact
case-sensitive whole-string database-name rule is
`^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$`.
After the URL guard, `SELECT current_database()` must exactly equal the parsed
name and independently match that same exact rule. No provider instantiation,
fixture, migration or attendance write before all guards pass. Reject
`yuta_cloud`, staging/production, non-loopback, malformed/prefix/suffix/
whitespace/newline/encoded aliases, query/fragment overrides, name mismatch or
probe failure; no normalization. Browser QA may not bypass or weaken this guard.
No mocked-success screen is final evidence. No production provider or real data.

| Required viewport | Evidence                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| 1440x900          | All applicable state families, keyboard/focus and column hierarchy.        |
| 1024x768          | Shared-tablet landscape, touch targets, pending/end/conflict/recovery.     |
| 768x1024          | Shared-tablet portrait, two-user clearing/navigation and state layout.     |
| 390x844           | Narrow layout, long-name wrap/zoom/reflow, no overflow or clipped actions. |

Cover all14 UI state rows from UI_SPEC, both committed mutations, multiple
sessions, stale two-tab OUT, same-tuple timeout recovery, reset/expiry/departure,
10s receipt/end, hidden/pagehide/pageshow/bfcache/back/refresh/duplicate/restart,
late response after clearing and subsequent employee isolation.
Inspect storage/cache/HTML/RSC/URLs/history/network diagnostics for prohibited
residue without recording secrets. Capture truthful local versus remote end.

Create real QA_REPORT.md, screenshot-manifest.md and actual PNGs only later
under docs/reviews/pointage-usable-raw-clocking/qa/. Manifest requires path,
SHA-256, viewport/state/scenario/role/route/capture conditions and synthetic-only
provenance. Nonvisual auth/DB claims need tests, not screenshots alone.
If environment is unavailable, report BLOCKED_BY_ENVIRONMENT; do not fabricate
PASS. In-scope defects require re-VERIFY and affected QA again.

## Stop conditions and delivery

Stop for artifact/hash drift, unsafe dirty-hunk overlap, changed Product/
Personnel authority, new grant/provider/runtime, unsafe database/role,
unapproved UI/data read or inability to preserve shared-device isolation.
No stage can clear the seven legal/privacy/provenance blockers.
No real attendance in development/staging/production; no synthetic classifier.
No manager UI, history/totals, raw mutation, Planning/payroll/local/offline scope.

The existing five reviewed UI documents stay byte-locked under current
authority. Later as-built synchronization must record evidence in allowed
metadata/review locations and request explicit permission before touching their
locked content. Do not mark Package status implemented until implementation,
VERIFY, mandatory QA and authorized as-built synchronization are complete.
Planning review now: AWAITING_HUMAN_REVIEW. Apply authorization: NOT_GRANTED.
