# Pointage usable raw clocking — QA report

Change: `pointage-usable-raw-clocking`

Date: 2026-09-20

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA status: PASS

Workflow result: QA_TARGETED_EVIDENCE_COMPLETE

Route: `/pointage/[establishmentSlug]`

## Authority and preflight

Formal QA and mandatory Browser QA were explicitly authorized after Technical
Implementation Compliance and VERIFY passed. Source, test, Product, Spec,
Design, Gate 3, deployment, production enablement and real employee attendance
were outside this QA authority.

The current protected 12-path source/test manifest recomputed exactly to:

`ca13b2cc30e26a1f75c9c35f206a9b0c3ffe69872699ac8bde2c67fa2ba3fdfd`

The approved Design, both delta Specs, `tasks.md`, `02b-design-review.md`,
`02c-implementation-plan-review.md`, fixture artifacts and all 13 protected
production owners matched their approved hashes. Unauthorized worktree changes
were zero and `03-final-review.md` was absent.

## Data and environment setup

Only the repository-approved synthetic runtime path was attempted:

- `NODE_ENV=test` at the parent boundary;
- no `VERCEL`, `DOCKER_HOST` or `DOCKER_CONTEXT` override;
- one local Docker Desktop `postgres:17` target at a time;
- a generated database matching
  `^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$`;
- loopback-only PostgreSQL and Next listeners;
- canonical migrations followed by the guarded test-only raw-clocking
  extension;
- generated synthetic organization, establishment, Personnel dossier and
  Pointage credential;
- approved injected synthetic trusted-client-address provider;
- no production provider, production data, real PIN or real attendance.

The launch family was:

`pnpm --filter @yuta/backoffice exec tsx -e <in-memory orchestration using provisionPointageNextFixture and launchPointageNextChild>`

No orchestration or credential was serialized to a repository file. Secret
values are not included in this report.

## Bounded recovery and blocker

| Attempt | Target                                                               | Readiness limit | Observed                                                                        | Cleanup                                                                                                           |
| ------- | -------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1       | One fresh disposable PostgreSQL target and one actual Next child     | 180 seconds     | No `READY` status before the limit; no browser was opened                       | Child was interrupted; the exact owned container `9aa206b4d4ed` was removed; port 3001 was released               |
| 2       | One new fresh disposable PostgreSQL target and one actual Next child | 360 seconds     | No `READY` status before the repository-aligned limit; child remained non-ready | Orchestrator emitted `QA_RUNTIME_CLEANED`, closed the child/database client and removed its exact owned container |

### Context-driven recovery attempt 3

The separately authorized in-memory recovery corrected only the readiness
sequence. No repository source, test, Spec, Design or VERIFY evidence changed.

The protected manifest and authority preflight passed before execution:

`ca13b2cc30e26a1f75c9c35f206a9b0c3ffe69872699ac8bde2c67fa2ba3fdfd`

One new disposable PostgreSQL target, synthetic establishment, two synthetic
Personnel dossiers and child-local synthetic trusted-address provider were
used. The first Pointage context request triggered runtime admission as
intended. Sanitized observations were:

```text
HTTP: CONNECT_PENDING -> 503 POINTAGE_UNAVAILABLE -> 200
Lifecycle: LISTENING -> INITIALIZING -> READY
Admission: foundation client PASS; raw client PASS; provider PASS;
runtime factory PASS; READY emission PASS
```

The `200` response matched the strict Pointage context contract. The helper's
valid-message, re-consumer and READY evidence checks passed.

```text
QA_RUNTIME_RECOVERY: PASS
```

Browser QA then attempted to start the repository-resolved Playwright 1.51.1
Chromium engine. Browser launch failed before any page or scenario was created
because Playwright's configured headless-shell executable was absent from the
local browser installation. No browser request, assertion or screenshot was
produced. Installing a browser, selecting a different executable and creating
a second runtime generation were outside this bounded recovery authority.

The actual Next child was stopped, both runtime clients were closed, the exact
QA-owned disposable target was removed and port 3001 was released. No second
runtime recovery was attempted.

The second attempt ended with `QA_RUNTIME_FAILED timeout`. This establishes an
environment/evidence blocker, not an implementation behavior failure. QA did
not replace the integrated route with fixtures, mocks or a production provider.
No further recovery or workaround was attempted.

### Browser generation attempt 4 — executable preflight stop

The newly authorized Browser QA generation started again from the protected
baseline. Before any PostgreSQL target, Next child or application page was
created, the following preflight evidence was collected:

```text
Protected source/test manifest: MATCH
Protected manifest SHA-256:
ca13b2cc30e26a1f75c9c35f206a9b0c3ffe69872699ac8bde2c67fa2ba3fdfd
Design/Specs/planning authority hashes: MATCH
Unauthorized source/test change: 0
Playwright package: @playwright/test 1.51.1
chromium.executablePath():
C:\Users\Tam\AppData\Local\ms-playwright\chromium-1161\chrome-win\chrome.exe
Executable validation: FAIL — ENOENT / file absent
```

The executable path was obtained from the installed Playwright API, not from a
hard-coded or guessed browser location. Because that API-selected path did not
exist as a regular file, the required result is:

```text
CHROMIUM_EXECUTABLE_RESOLUTION: FAIL
QA_CHROMIUM_EXECUTABLE_MISSING
BROWSER_LAUNCH_PREFLIGHT: NOT_RUN
BROWSER_CAPABILITY_PREFLIGHT: NOT_RUN
```

The mandated stop condition was applied immediately. No alternative executable
was guessed or selected, no browser was installed or downloaded, and no launch
was attempted. Consequently this generation created no disposable database,
synthetic dossier, credential, Pointage provider, Next child, HTTP request,
browser context, screenshot or Product QA result. The previously proven
context-driven runtime recovery remains historical evidence only and was not
reused as current Browser QA evidence.

### Browser generation attempt 5 — Microsoft Edge mandatory neutral-state failure

The current-user decision selected the installed stable Microsoft Edge instead
of the partial Playwright-managed Chromium cache. The protected manifest,
Design, Specs, package manifests, lockfile and prior QA artifact hashes matched
before setup. Playwright 1.51.1 launched Microsoft Edge 153.0.4234.48 through
the supported `msedge` channel in headless mode. Harmless launch and capability
preflights passed for viewports, multiple contexts/pages, keyboard, touch,
navigation/history, network/console/page-error observation, storage inspection
and screenshot capture. The partial `chromium-1161` cache was neither used nor
modified.

One new guarded disposable PostgreSQL target then provisioned two synthetic
Personnel dossiers and two synthetic Pointage credentials. The child-local
trusted-address provider and test-only Pointage extension were used. Readiness
completed with the following sanitized evidence:

```text
HTTP: CONNECT_PENDING -> 503 POINTAGE_UNAVAILABLE -> 200
Lifecycle: LISTENING -> INITIALIZING -> READY
Admission trace: VALID; all required stages PASS
QA_RUNTIME_RECOVERY: PASS
```

The real employee route opened in Edge at 1440x900. The neutral masked
credential entry was present, but the mandatory `NO_APPLICATION_SHELL`
assertion found at least one `nav` or `aside` element and stopped the generation
before screenshot capture, credential submission or any attendance mutation.
The assertion did not preserve the matched element identity before cleanup.
Read-only source review afterward confirmed that the Pointage page and root
layout do not intentionally compose the Backoffice frame; therefore this QA
failure must be reviewed as an exact browser-oracle/runtime finding before any
application repair is inferred. It is not evidence authorizing a code change.

```text
QA browser: Microsoft Edge 153.0.4234.48
Playwright engine/channel: chromium / msedge
Mandatory scenario: neutral / NO_APPLICATION_SHELL
Observed assertion: nav or aside count was non-zero
Current generation result: QA_FAIL
```

All Edge contexts and the Playwright-launched browser were closed. The actual
Next child and database clients were stopped, the exact disposable PostgreSQL
target was removed, and port 3001 was released. The user's normal Edge profile
was not used or terminated.

## Current Edge browser matrix

| Scenario                         | Browser/version              | Viewport                              | Expected                                   | Observed                                                                 | Status               | Evidence                              |
| -------------------------------- | ---------------------------- | ------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ | -------------------- | ------------------------------------- |
| Launch and capability preflight  | Microsoft Edge 153.0.4234.48 | Neutral probe                         | Supported Playwright mechanics             | Launch, contexts, pages, input, observers, storage and screenshot passed | PASS                 | Edge preflight                        |
| Context-driven runtime readiness | Server + Edge generation     | Server                                | Strict context 200, admission and READY    | CONNECT_PENDING, transient 503, strict 200 and READY                     | PASS                 | Admission trace attempt 5             |
| Neutral employee route           | Microsoft Edge 153.0.4234.48 | 1440x900                              | French neutral state; NO_APPLICATION_SHELL | Neutral credential entry appeared; broad `nav, aside` assertion matched  | FAIL                 | Attempt 5 mandatory stop              |
| Remaining mandatory scenarios    | Microsoft Edge 153.0.4234.48 | 1440x900, 1024x768, 768x1024, 390x844 | Complete current Browser QA evidence       | Not executed after the first mandatory failure                           | EVIDENCE_UNAVAILABLE | Attempt 5 stop before further actions |

## Historical pre-Edge browser matrix

| Scenario family                                          | Required browser/viewport                                      | Preconditions                                                  | Expected                                                                                   | Observed                                                                                                      | Status               | Evidence                                            |
| -------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------- |
| Neutral route and credential entry                       | Chromium-family browser; 1440x900, 1024x768, 768x1024, 390x844 | Actual route `READY` with disposable DB and synthetic provider | Neutral French no-shell route; input, focus and pending behavior usable                    | Current generation stopped before runtime creation because the Playwright API-selected executable was missing | EVIDENCE_UNAVAILABLE | Browser generation attempt 4                        |
| Successful identify and current state                    | Same matrix                                                    | Ready route and synthetic credential                           | Own identity/state only; no token/URL/cookie leak                                          | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |
| `CLOCK_IN` and `CLOCK_OUT`                               | Same matrix                                                    | Identified synthetic employee                                  | Pending suppression, committed receipt and correct resulting state                         | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |
| Receipt, expiry and late-response lifecycle              | Same matrix                                                    | Ready controllable interaction                                 | Receipt clears by 10 seconds or earlier authority end; stale response cannot restore state | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |
| Sequential employees and explicit `Terminer`             | 768x1024 and 390x844 minimum                                   | Two synthetic employees                                        | No identity, state, tuple, receipt or error residue                                        | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |
| Hidden tab, navigation, reload, back/forward and BFCache | Browser lifecycle support                                      | Active synthetic interaction                                   | Return neutral without protected restoration                                               | Browser execution not started                                                                                 | NOT_TRIGGERED        | Runtime readiness blocker                           |
| Duplicate tab                                            | Browser with multiple tabs                                     | Active or recently active interaction                          | Second tab starts neutral; no authority transfer                                           | Browser execution not started                                                                                 | NOT_TRIGGERED        | Runtime readiness blocker                           |
| Unknown result/recovery and conflict                     | Existing authorized synthetic controls only                    | Ready route and inducible state                                | Explicit bounded recovery/conflict refresh; no automatic mutation retry                    | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker; no instrumentation added |
| Keyboard, focus, live regions and touch                  | All applicable viewports                                       | Ready route                                                    | Complete keyboard path, visible focus, usable announcements and touch controls             | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |
| Responsive/reflow and long name                          | 1440x900, 1024x768, 768x1024, 390x844                          | Ready route and synthetic long name                            | No overflow, clipping or overlap; safe wrapping and reachable controls                     | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |
| French copy and role/state boundary                      | Same matrix                                                    | Ready route                                                    | French-only employee surface; no manager/history/edit/chooser/credential UI                | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |
| Storage, URL, network, HTTP cache and CSP/nonce audit    | Real browser/devtools                                          | Ready route                                                    | No protected durable residue; no token/PIN URL leak; private no-store; valid nonce/CSP     | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |
| Console/runtime diagnostics                              | All executed browser scenarios                                 | Ready route                                                    | No unexpected console, hydration, CSP or network errors                                    | Browser execution not started                                                                                 | EVIDENCE_UNAVAILABLE | Runtime readiness blocker                           |

No mandatory Browser QA row is marked PASS. `NOT_TRIGGERED` and
`EVIDENCE_UNAVAILABLE` are not treated as PASS.

## Non-browser QA reconciliation

| Area                                                      | Status               | Basis                                                                                                      |
| --------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------- |
| QA authority and protocol classification                  | PASS                 | UI-affecting change requires real Browser QA and hashed screenshots                                        |
| Protected-byte preflight                                  | PASS                 | Exact protected manifest and approved authority hashes matched before setup                                |
| Synthetic/disposable data boundary                        | PASS                 | Only guarded local synthetic setup was attempted                                                           |
| Real-route runtime preparation                            | PASS                 | Context-driven request returned strict context `200`; admission and `READY` evidence passed                |
| Browser behavior, visual, responsive and accessibility QA | EVIDENCE_UNAVAILABLE | Runtime became ready, but the required Chromium executable was unavailable before browser launch           |
| Current browser executable preflight                      | EVIDENCE_UNAVAILABLE | Playwright 1.51.1 returned a missing Chromium executable; mandatory stop occurred before runtime           |
| Microsoft Edge launch/capability preflight                | PASS                 | Edge 153.0.4234.48 launched through channel `msedge`; all required neutral probe mechanics passed          |
| Current Edge real-route neutral state                     | FAIL                 | Runtime recovered, but the first mandatory `NO_APPLICATION_SHELL` assertion found a `nav` or `aside` match |
| Production readiness                                      | DEFERRED_BY_POLICY   | Seven legal/privacy/provenance blockers remain unresolved                                                  |

## Findings and limitations

- The Edge generation established a mandatory neutral-state assertion failure,
  but did not retain the matched DOM element identity. Source evidence excludes
  an intentional Pointage/RootLayout Backoffice frame, so no implementation
  repair is authorized from this result alone.
- Mandatory browser behavior, accessibility, responsive, storage, network,
  cache and CSP evidence is missing.
- No PNG was captured. The screenshot manifest intentionally records zero
  evidence rows; this is not Gate 3-ready evidence.
- Browser generation attempt 4 did not create a database or runtime and did not
  reach launch/capability preflight, because executable validation failed.
- Browser generation attempt 5 launched Edge and recovered the runtime, then
  stopped at the first mandatory UI assertion before any attendance mutation.
- Formal VERIFY remains a separate prior PASS and is not relabeled by this QA
  environment failure.

## Cleanup

QA-owned Next child processes and all QA-created disposable PostgreSQL targets
were stopped/removed. Port 3001 was released. Historical stopped
containers from older runs were not modified. No deployment, sync, archive,
production provider or real attendance was created.

## Preserved production blockers

1. exact retention duration;
2. deletion/anonymization;
3. legal hold;
4. backup-retention interaction;
5. employee notice;
6. detailed audit visibility;
7. trusted production client-address provenance.

All remain `PRODUCTION_POLICY_BLOCKED`.

QA result: `QA_FAIL`

Gate 3: `NOT_CREATED`

Production enablement: `NOT_AUTHORIZED`

Real employee attendance: `NOT_AUTHORIZED`

## Later corrective action — application-owned shell oracle

The historical Browser QA generation above remains `QA_FAIL`. A later bounded
QA-harness review established that its whole-browser `locator("nav, aside")`
oracle crossed the application ownership boundary and matched a hidden
`nav.error-overlay-pagination` inside the shadow root of `nextjs-portal`. The
light DOM contained no `nav` or `aside`; source authority also keeps the
Pointage route outside the authenticated `BackofficeFrame` layout.

The QA-only replacement in `browser-qa-oracles.mjs` anchors the application
root to the nearest light-DOM `main` containing the unique
`aria-label="Interaction de pointage"` region and exact `Pointage` level-one
heading. It checks application-owned shell landmarks, known Backoffice shell
controls and nested-main composition in light DOM. Framework/tooling shadow DOM
is collected only as provenance evidence, not treated as Pointage UI. Failure
diagnostics retain tag, id/class, visibility, ancestors, shadow host, nearest
application root and `data-*` attributes.

The current synthetic Pointage runtime is programmatically composed by the
test-only child with `next({ dev: true, ... })`. There is no current
production-mode synthetic provider/bootstrap composition; adding one would
require an unauthorized Product/test-runtime change. The selected runtime for
the next full QA generation is therefore
`DEVELOPMENT_MODE_WITH_APP_SCOPED_ORACLES`, still using Playwright 1.51.1 with
Microsoft Edge stable through channel `msedge`.

Bounded harness validation only (not Product QA) proved that the source-shaped
Pointage root passes, a Next-style shadow-root `nav` is excluded by ownership,
and deliberate light-DOM `aside` plus nested Backoffice-style `main` wrappers
both fail with provenance diagnostics. Static source review confirms the real
route renders `PointageEmployeeView` directly under the root layout, while the
authenticated layout separately owns `BackofficeFrame`.

A separate neutral-only current-route check opened
`/pointage/[establishmentSlug]` in Edge at 1440x900 under deliberately poisoned
environment values and a non-serving loopback database sink. It returned 200,
established the same Pointage root and passed with zero application-shell
matches. No credential was submitted, no Pointage provider/runtime was admitted
and no attendance mutation occurred. The exact React development eval/CSP
diagnostic was observed and is narrowly classed as
`NEXT_DEV_TOOLING_CONSOLE_ERROR`; unknown errors, application errors,
`pageerror` and functional CSP violations remain failure candidates.

```text
PRODUCTION_MODE_BROWSER_QA_NOT_SUPPORTED
BROWSER_QA_RUNTIME: DEVELOPMENT_MODE_WITH_APP_SCOPED_ORACLES
SHELL_ORACLE_FALSE_NEGATIVE_REVIEW: PASS
QA_HARNESS_CORRECTION_PASS
```

No Product/source/test/Spec/Design bytes, screenshot evidence or historical QA
status were changed. Full Browser QA must start from zero under new explicit
authority; this corrective action is not a Browser QA PASS and does not create
Gate 3.

## Full QA generation from zero — 2026-09-21

The historical failures and their later oracle correction above remain part of
the chronology. Under the subsequent explicit authorization, one new complete
generation started from zero and used only QA-owned orchestration and evidence
files. It did not modify Product implementation, Product tests, Specs, Design,
or formal VERIFY evidence.

```text
Generation: e9546feb-7497-4420-890b-03bfa7fcc946
Playwright: 1.51.1
Browser: Microsoft Edge 153.0.4234.48
Channel: msedge
BROWSER_QA_RUNTIME: DEVELOPMENT_MODE_WITH_APP_SCOPED_ORACLES
EDGE_LAUNCH_PREFLIGHT: PASS
EDGE_CAPABILITY_PREFLIGHT: PASS
```

### Protected authority and synthetic provenance

- The protected ordered 12-path Product/source/test manifest matched
  `ca13b2cc30e26a1f75c9c35f206a9b0c3ffe69872699ac8bde2c67fa2ba3fdfd`
  before execution; Product, Design, Spec and application-test drift were zero.
- The corrected QA-only oracle matched
  `34d2bbc977b74d597db485ccbe42bfd53e4fc0b3af432e8e837e4c41e45fb5a8`.
- The fresh disposable fixture contained one synthetic organization, one
  synthetic establishment, two synthetic Personnel dossiers and two synthetic
  Pointage credentials. The trusted-client-address provider was injected only
  into the child synthetic runtime. No real employee, real attendance,
  production provider or production credential was used.
- Readiness was context-driven:
  `CONNECT_PENDING -> 503 POINTAGE_UNAVAILABLE -> INITIALIZING -> context 200 -> READY`.
  The strict context contract, DB/client admission, provider admission,
  admission trace and READY/re-consumer evidence passed.

```text
QA_RUNTIME_RECOVERY: PASS
NO_APPLICATION_SHELL: PASS
```

The shell oracle anchored the employee Pointage application root and reported
zero application-owned shell matches. Hidden Next development shadow tooling
was retained only as provenance and was not treated as Product UI.

### Current Browser QA matrix

| Scenario                                 | Browser/version    | Viewport                              | Expected                                                                                              | Observed                                                                                                                                                  | Status               | Evidence                                                                |
| ---------------------------------------- | ------------------ | ------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| Neutral route and no application shell   | Edge 153.0.4234.48 | 1440x900                              | Neutral French employee surface without Backoffice shell or protected residue                         | Root, heading, credential interaction and empty state present; no application-owned shell/history/totals/manager controls                                 | PASS                 | `01-neutral-1440x900.png`                                               |
| Required neutral viewport/reflow set     | Edge 153.0.4234.48 | 1440x900, 1024x768, 768x1024, 390x844 | No Product overflow/clipping; 48px primary controls                                                   | All four neutral viewport checks passed                                                                                                                   | PASS                 | `neutral-*.png`                                                         |
| Long-name active-state reflow            | Edge 153.0.4234.48 | 390x844                               | Long employee name wraps safely in an identified state                                                | The named screenshot was captured while identification was still pending and does not establish active long-name layout                                   | EVIDENCE_UNAVAILABLE | `05-employee-b-long-name-390x844.png`                                   |
| Credential shape and successful identify | Edge 153.0.4234.48 | 1440x900                              | Masked numeric eight-digit entry, pending/disabled/aria-busy, own identity only                       | Shape guard, keyboard Enter, click, pending state and successful Employee A identify passed; no URL/cookie token                                          | PASS                 | `02-employee-a-not-clocked-in-1440x900.png`                             |
| Invalid credential feedback              | Edge 153.0.4234.48 | 1440x900                              | Visible generic French non-enumerating feedback and correct focus                                     | The harness selected an empty alert and retained no provenance proving it was the application alert; visible feedback/focus was not established           | EVIDENCE_UNAVAILABLE | Sanitized DOM trace                                                     |
| `CLOCK_IN`                               | Edge 153.0.4234.48 | 1440x900                              | One accepted mutation, no optimistic receipt, duplicate activation suppressed                         | Pending control disabled; one request accepted; committed French receipt shown                                                                            | PASS                 | `03-clock-in-receipt-1440x900.png`                                      |
| `CLOCK_OUT`                              | Edge 153.0.4234.48 | 1024x768                              | One accepted close with committed receipt                                                             | Accepted and receipt displayed                                                                                                                            | PASS                 | `04-clock-out-receipt-1024x768.png`                                     |
| Receipt lifecycle                        | Edge 153.0.4234.48 | 1440x900                              | Current receipt only, clear by 10 seconds or earlier lifecycle end                                    | Automatic 10-second ceiling and lifecycle clearing passed                                                                                                 | PASS                 | `03-clock-in-receipt-1440x900.png`, `04-clock-out-receipt-1024x768.png` |
| Sequential shared-device employees       | Edge 153.0.4234.48 | 390x844 and 1440x900                  | Employee B sees no Employee A state/residue after successful identification                           | The harness read the neutral level-two heading before Employee B identification completed; the screenshot is still pending                                | EVIDENCE_UNAVAILABLE | `05-employee-b-long-name-390x844.png` and harness trace                 |
| `Terminer`                               | Edge 153.0.4234.48 | 390x844 and 1440x900                  | Explicit end clears protected UI and restores neutral credential focus                                | The end control eventually appeared, was activated, and neutral focused entry returned                                                                    | PASS                 | Current-generation browser trace                                        |
| Hidden/background lifecycle              | Edge 153.0.4234.48 | 1440x900                              | Genuine hidden lifecycle clears protected interaction                                                 | A second page did not make the tested page report `hidden`; Edge rejected the attempted CDP visibility override                                           | EVIDENCE_UNAVAILABLE | Runtime observation `visibilityState=visible`                           |
| Navigation away/return                   | Edge 153.0.4234.48 | 1440x900                              | Protected state is not restored                                                                       | Returned neutral                                                                                                                                          | PASS                 | Current-generation browser trace                                        |
| Hard reload                              | Edge 153.0.4234.48 | 1440x900                              | No identity/receipt restoration                                                                       | Returned neutral                                                                                                                                          | PASS                 | Current-generation browser trace                                        |
| Browser back/forward                     | Edge 153.0.4234.48 | 1440x900                              | No stale protected restoration                                                                        | Returned neutral through back/forward sequence                                                                                                            | PASS                 | Current-generation browser trace                                        |
| BFCache                                  | Edge 153.0.4234.48 | 1440x900                              | If restored from BFCache, lifecycle clearing must be observed                                         | Edge did not report a BFCache restoration in this generation                                                                                              | NOT_TRIGGERED        | `pageshow`/`pagehide` lifecycle probe                                   |
| Duplicate tab                            | Edge 153.0.4234.48 | 1440x900                              | Second tab starts neutral with no authority transfer                                                  | Neutral; employee identity absent                                                                                                                         | PASS                 | Current-generation browser trace                                        |
| Unknown result and recovery              | Edge 153.0.4234.48 | 1024x768                              | No fabricated success; explicit bounded recovery returns original committed receipt                   | Synthetic acknowledgement loss returned unknown state; recovery returned the committed receipt                                                            | PASS                 | `07-result-unknown-1024x768.png`                                        |
| Conflict                                 | Edge 153.0.4234.48 | 1024x768                              | Explicit refresh; no automatic mutation retry                                                         | Conflict stopped mutation and required refresh plus a fresh action                                                                                        | PASS                 | `06-state-conflict-1024x768.png`                                        |
| Idle expiry                              | Edge 153.0.4234.48 | 1440x900                              | Protected interaction clears at supported idle limit                                                  | Neutral after the server/UI 60-second idle boundary                                                                                                       | PASS                 | Current-generation browser trace                                        |
| Absolute expiry                          | Edge 153.0.4234.48 | 1440x900                              | Exercise only through an existing supported mechanism                                                 | Idle expiry necessarily occurred first; changing Product constants or suppressing idle was prohibited                                                     | EVIDENCE_UNAVAILABLE | No prohibited instrumentation used                                      |
| Late response                            | Edge 153.0.4234.48 | 1440x900                              | Old-generation result cannot restore a cleared interaction                                            | Delayed result did not restore identity or receipt after `Terminer`                                                                                       | PASS                 | Current-generation browser trace                                        |
| Live regions and labelled controls       | Edge 153.0.4234.48 | 1440x900                              | Labelled controls and announced pending state                                                         | Zero unlabeled inputs plus status/live/atomic and aria-busy checks passed                                                                                 | PASS                 | Current-generation DOM trace                                            |
| Keyboard-only and visible-focus flow     | Edge 153.0.4234.48 | 1440x900                              | Complete essential flow and logical visible focus through mutations, conflict/recovery and `Terminer` | Only Enter identification ran keyboard-only; the recorded three-item tab order contained empty labels and no visible-focus proof                          | EVIDENCE_UNAVAILABLE | Current-generation focus trace                                          |
| Touch/mobile                             | Edge 153.0.4234.48 | 390x844                               | Touch mutation, duplicate suppression, usable target                                                  | Touch action accepted; primary control height 48px                                                                                                        | PASS                 | `08-mobile-touch-receipt-390x844.png`                                   |
| French and role/surface boundary         | Edge 153.0.4234.48 | all required                          | French employee-only surface; no debug/internal/manager/history/editor UI                             | Required boundary passed                                                                                                                                  | PASS                 | Screenshot set and rendered-text audit                                  |
| Storage and URL                          | Edge 153.0.4234.48 | 1440x900                              | No durable protected authority/state and no secret tuple in URL                                       | No Pointage data in localStorage, IndexedDB, Cache Storage, cookies, service workers, history state or window name; only Next debug session keys observed | PASS                 | Current-generation storage/URL audit                                    |
| Network, HTTP cache and cookie boundary  | Edge 153.0.4234.48 | all required                          | Pointage mutations private/no-store, no protected URL/third party/cookie fallback                     | Pointage API responses used `private, no-store, max-age=0`; no Set-Cookie or unexpected third-party transfer                                              | PASS                 | Current-generation network trace                                        |
| CSP/nonce                                | Edge 153.0.4234.48 | 1440x900                              | CSP present, matching nonces, independent-request nonce rotation, no unsafe-inline/eval               | All assertions passed; 32 rendered nonce-bearing scripts observed                                                                                         | PASS                 | Current-generation header/DOM trace                                     |
| Console/page/network diagnostics         | Edge 153.0.4234.48 | all executed                          | No unknown/application error                                                                          | No pageerror or unexpected console/failed request; exact Next dev diagnostic and deliberate synthetic 403/409/lost-ack aborts were narrowly classified    | PASS                 | Sanitized diagnostics trace                                             |

### Result reconciliation

The raw harness completed with 41 recorded `PASS`, 0 `FAIL`, 2 recorded
`EVIDENCE_UNAVAILABLE`, and 1 `NOT_TRIGGERED`. Independent evidence review did
not accept four of those raw PASS labels: invalid-credential feedback,
post-identification sequential-user isolation/long-name reflow, and the complete
keyboard-only/visible-focus flow were not actually demonstrated by the retained
observations. No genuine Product, accessibility, security, role-boundary,
storage or visual failure was established, but these gaps join the already
recorded hidden/background and absolute-expiry evidence gaps. Genuine BFCache
restoration was also not triggered. Under `YUTA_QA_PROTOCOL`, missing mandatory
current-generation evidence cannot be converted to PASS.

Non-browser QA owned by this stage passed for authority classification,
protected-byte preflight, synthetic/disposable provenance, runtime recovery,
current screenshot capture/hashing, and QA cleanup. Technical VERIFY was not
rerun. Production readiness remains `DEFERRED_BY_POLICY`.

### Cleanup and preserved boundaries

Edge pages/context/process were closed, the Next child and DB clients were
closed, the exact disposable PostgreSQL target was removed, and QA-owned port
3001 listeners were zero after execution.

```text
QA_EDGE_BROWSER: CLOSED
QA_RUNTIME_CHILDREN: REMOVED
QA_DB_TARGET: REMOVED
QA_OWNED_LISTENERS: 0
```

The seven unresolved production blockers remain unchanged: retention duration,
deletion/anonymization, legal hold, backup-retention interaction, employee
notice, detailed audit visibility, and trusted production client-address
provenance. They remain `PRODUCTION_POLICY_BLOCKED`. Production enablement and
real employee attendance remain `NOT_AUTHORIZED`.

```text
QA result: QA_BLOCKED_BY_EVIDENCE
Gate 3: NOT_CREATED
```

## Subsequent bounded remaining-evidence harness correction — 2026-09-23

Authority was limited to QA-owned harness/evidence correction. Historical QA
rows above remain unchanged and no full QA generation, Product test, formal
VERIFY, database, Next runtime, screenshot or Gate 3 work ran.

```text
QA_HARNESS_EDIT_ALLOWLIST:
- docs/reviews/pointage-usable-raw-clocking/qa/full-browser-qa.mts
- docs/reviews/pointage-usable-raw-clocking/qa/QA_REPORT.md

Protected Product/source/test manifest:
ca13b2cc30e26a1f75c9c35f206a9b0c3ffe69872699ac8bde2c67fa2ba3fdfd

PRODUCT_SOURCE_DRIFT: 0
DESIGN_DRIFT: 0
SPEC_DRIFT: 0
APPLICATION_TEST_DRIFT: 0
DB_SCHEMA_DRIFT: 0
```

The sequential-user root cause was a harness race: `identify()` submitted the
credential but returned before the response settled, after which the harness
read the first level-two heading. The corrected sequence now waits for the
pending copy to disappear, the exact Employee B heading and expected state to
be visible, `Terminer` to be available and the credential input to be absent.
Only then may it assert that Employee A name, exact prior state, receipt,
alert, continuation/request tuple and stale success/error residue are absent.

Invalid-credential evidence is now anchored to the unique application-owned
`main` containing the level-one `Pointage` heading and the exact
`aria-label="Interaction de pointage"` region. Within that region, the harness
requires one visible `role="alert"` whose complete text is exactly
`Accès au pointage impossible. Veuillez vous identifier à nouveau.` It also
records focus on the interaction region, proves the alert belongs to that root,
ends the failed interaction and proves the neutral credential field is focused
and reusable. A global alert, Next development overlay or console text cannot
satisfy this selector.

The dedicated keyboard function uses only `keyboard.type`, `keyboard.press`
and native Tab progression after the page-provided initial focus. It performs
credential entry, Enter submit, completed identify, the current primary clock
action and `Terminer`, recording the active element at each transition. Its
source validation rejects `.click(`, `.tap(`, `mouse.` and `dispatchEvent(`.

The existing synthetic dossier fields already support the long display name;
no Product field or schema change is needed. After completed Employee B
identification, the corrected harness checks 1440x900, 1024x768, 768x1024 and
390x844 for document/interaction/name overflow, name wrapping, overlap,
reachable primary action and readable status region. New screenshot names are
reserved for a later authorized QA generation; no screenshot was created or
modified during this correction.

Absolute-expiry browser evidence remains
`ABSOLUTE_EXPIRY_BROWSER_EVIDENCE_UNAVAILABLE`: the current UI exposes no
supported foreground state-read action that can renew idle until the fixed
absolute deadline. Product constants, hidden configuration and idle
suppression remain prohibited. Complementary accepted evidence is the
interaction coverage for repeated state reads not moving the absolute
deadline, the exact fixed absolute timer, coincident idle/absolute boundaries
and old timer callbacks not clearing a later generation, plus accepted actual
process `E5-ABSOLUTE` evidence.

The hidden-tab probe now observes only genuine browser events through an
external read-only lifecycle collector. It tries real page/background-tab
switching and records `document.visibilityState`; it has no visibility monkey
patch, direct lifecycle event dispatch or CDP visibility override. If Edge
continues to keep the page visible, the honest result is
`HIDDEN_LIFECYCLE_NOT_TRIGGERABLE_IN_CURRENT_EDGE_AUTOMATION` and
`EVIDENCE_UNAVAILABLE`, mapped to the already executed U6 interaction coverage.

BFCache collection now preserves real `pagehide`/`pageshow` `persisted` values
outside the navigated document and records navigation type plus
`notRestoredReasons` when the browser exposes them. It never simulates BFCache.
The current Playwright 1.51.1 Edge launch transcript includes
`--disable-back-forward-cache`; therefore the current automation mode is
classified `BFCACHE_NOT_TRIGGERABLE_IN_CURRENT_QA_RUNTIME`, rather than a
Product failure or fabricated PASS.

### Open-row QA protocol disposition

| Open row                          | Browser evidence requirement                                                        | Existing complementary evidence                                                          | Can close without fake browser evidence?                                                  | Final requirement                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Sequential users                  | A — real Browser QA PASS                                                            | Lower-level generation clearing supports, but cannot prove two rendered identities       | No                                                                                        | Corrected real-route Employee A then Employee B sequence must PASS                         |
| Hidden/background tab             | B — genuine browser attempt; non-triggerability may be recorded                     | Executed U6 visibility/pagehide/pageshow controller evidence                             | Yes, compositionally when the genuine attempt and current-runtime limitation are retained | Real attempt plus explicit Edge limitation and U6 mapping                                  |
| Absolute expiry                   | C — existing accepted runtime/interaction evidence may compose                      | Fixed timer, no sliding, coincident boundaries, stale-callback isolation and E5-ABSOLUTE | Yes                                                                                       | Retain browser unavailability and exact complementary mapping; do not alter Product timing |
| Keyboard-only                     | A — real Browser QA PASS                                                            | Component/interaction tests do not prove actual focus order                              | No                                                                                        | Corrected no-click browser sequence must PASS                                              |
| Active long-name responsive       | A — real Browser QA PASS at all four page-pack viewports                            | CSS/source checks do not prove rendered reflow                                           | No                                                                                        | Completed identify plus four-viewport measurements/screenshots must PASS                   |
| Invalid credential feedback/focus | A — real Browser QA PASS                                                            | Source establishes copy/role/focus intent only                                           | No                                                                                        | Owned alert, exact French copy, focus and reusable input must PASS                         |
| BFCache                           | B — genuine attempt; NOT_TRIGGERED allowed for a browser mode that disables BFCache | Executed U6 persisted true/false pageshow/pagehide interaction cases                     | Yes, compositionally for this runtime                                                     | Preserve NOT_TRIGGERED, launch diagnostic and U6 mapping; never simulate BFCache           |

This mapping follows `YUTA_QA_PROTOCOL`: real-route UI, responsive, keyboard,
error and role/state evidence cannot be replaced by technical VERIFY. A genuine
browser limitation may be retained only with exact provenance and relevant
executed lower-level evidence.

### Bounded harness self-validation

Formatting and transpilation reached the Edge-owned selector probe. Static
validation passed for deterministic Employee B settlement, exact Product
copy/ownership source, the supported long-name fixture, no click/tap/mouse or
synthetic event in the keyboard function, unavailable absolute-expiry strategy,
and absence of lifecycle monkey-patching/CDP visibility override.

The required harmless application-alert ownership probe then could not run:
Microsoft Edge was launched twice by Playwright, but each process closed before
a page/context became available with `Target page, context or browser has been
closed`. Neither attempt created a database, Next child, Product route, fixture
or screenshot. Because the dynamic selector-resolution assertion did not
complete, the mandatory result cannot honestly be recorded as PASS.

```text
QA_REMAINING_EVIDENCE_HARNESS_VALIDATION:
BLOCKED_BY_EDGE_PREFLIGHT

Current historical QA generation:
QA_BLOCKED_BY_EVIDENCE

QA_EVIDENCE_HARNESS_CORRECTION_BLOCKED
```

No next QA generation is authorized from this blocked correction. The exact
next authority needed is one bounded retry of the harmless Edge harness
self-validation only. If that validation passes, a separate human decision may
authorize exactly one fresh targeted Edge/msedge generation using the corrected
app-scoped oracle, context-driven readiness, corrected harness and fresh
synthetic runtime, with no Product change. STOP before either retry or QA rerun.

## Final targeted QA generation — 2026-09-23

The subsequent human decision superseded only the prior recommendation for a
separate harmless probe and authorized exactly one final targeted generation.
It did not authorize another full matrix, retry loop, Product change, VERIFY
rerun or Gate 3 creation.

```text
Generation: 6d3608c7-98fe-445a-91ef-cfe874972d62
Mode: FINAL_TARGETED_REMAINING_EVIDENCE
Browser: Microsoft Edge 153.0.4234.48
Channel: msedge
Playwright: 1.51.1
Runtime: DEVELOPMENT_MODE_WITH_APP_SCOPED_ORACLES
Corrected oracle SHA-256:
34d2bbc977b74d597db485ccbe42bfd53e4fc0b3af432e8e837e4c41e45fb5a8
Approved pre-generation harness SHA-256:
0aa2a2e8b14664d8d6e78d19e10fe29309d2968d68db5911acc4117ed744fc58
Targeted-entrypoint harness SHA-256:
9b5bb445175a37bacc7ebf1666afb6c24155388b907fdcba0bd864a92f7a5e01
```

The targeted entrypoint was added only to avoid rerunning already-proven
Browser QA rows. It retained the corrected application-owned selectors and
ran Edge preflight, synthetic/disposable setup, context-driven readiness, the
four authorized scenarios and cleanup in one generation.

### Prerequisite smoke and runtime readiness

- Edge launch, page, keyboard and screenshot preflight: PASS.
- One disposable synthetic fixture with two Personnel dossiers and two
  credentials: PASS.
- Runtime lifecycle: `LISTENING -> INITIALIZING -> READY`.
- Context sequence: transient `503`, connection transition, strict `200`.
- Context response: `{ available: true }`.
- Admission trace and re-consumer/READY evidence: PASS.
- Real route and app-scoped `NO_APPLICATION_SHELL` oracle: PASS; one Pointage
  interaction and heading, zero application-owned shell matches.

### Targeted scenario results

| Scenario                    | Result | Current evidence                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sequential employees        | PASS   | Employee A identified, completed `CLOCK_IN`, used `Terminer` and returned neutral. Employee B then settled fully with the exact long display name and `Non pointé`; A identity, exact prior state, receipt, alert and authority tuple residue were absent.                                                                                                                            |
| Invalid credential          | PASS   | Pending `aria-busy` and disabled submit were observed before response. The exact French `role="alert"` belonged to the Pointage interaction root; the global alert count was two, proving the global selector would have been ambiguous. Focus was on the owned interaction, `Terminer` restored neutral focus and the credential input accepted and cleared a new eight-digit value. |
| Keyboard-only               | PASS   | Active-element trace was input -> interaction -> primary `Enregistrer mon arrivée` button -> receipt interaction -> `Terminer` button -> empty password input. Forbidden operation inventory was empty: no click, tap, mouse or dispatched synthetic event.                                                                                                                           |
| Active long-name responsive | PASS   | 1440x900, 1024x768, 768x1024 and 390x844 all had document/body/interaction width within viewport, safe wrapping, no overlap, reachable primary action and readable status region. The name occupied two lines at the first three viewports and three lines at 390x844.                                                                                                                |

Seven current-generation screenshots were captured and hashed in
`screenshot-manifest.md`: invalid feedback, settled Employee B, four long-name
viewports and the keyboard-only committed receipt.

### Diagnostics

No page error or Product behavior failure occurred. The observed console rows
were limited to the already classified React development CSP/eval diagnostic,
the expected synthetic invalid-credential `403`, and development font-preload
warnings. Two `/end` browser request observations reported abort while the
network evidence retained both server `204` responses and the UI reached the
required neutral/focused state; this is not a failed Product outcome.

### Retained browser-evidence limitations

| Limitation                  | Final browser disposition                                                             | Complementary accepted evidence                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hidden/background lifecycle | `EVIDENCE_UNAVAILABLE`; no further attempt or simulation                              | Executed U6 interaction coverage proves genuine `visibilitychange`, hidden clearing, pagehide/pageshow clearing and no restoration/fan-out.                      |
| BFCache                     | `BFCache_NOT_TRIGGERED`; Playwright Edge launches with `--disable-back-forward-cache` | Executed U6 persisted false/true pagehide/pageshow cases clear the generation and remain neutral.                                                                |
| Absolute expiry             | `ABSOLUTE_EXPIRY_BROWSER_EVIDENCE_UNAVAILABLE`; no timeout/config alteration          | Fixed absolute timer, no sliding under activity/state reads, coincident idle/absolute boundary, stale timer isolation and accepted actual-process `E5-ABSOLUTE`. |

These are explicit evidence limitations, not Product failures. The final human
policy for this generation accepted complementary interaction/runtime evidence
instead of additional browser-perfection attempts.

### Cleanup and integrity

- Edge pages, context and process: closed.
- Next child and fixture database clients: closed.
- Current disposable PostgreSQL target: removed; no current-generation target
  remains. Older pre-existing exited containers were not touched.
- QA-owned port 3001 listeners after completion: zero.
- Protected Product/source/test manifest remains
  `ca13b2cc30e26a1f75c9c35f206a9b0c3ffe69872699ac8bde2c67fa2ba3fdfd`.
- Product/source, Design, Specs, application tests and DB schema drift: zero.
- Formal Technical Implementation Compliance and VERIFY were not rerun or
  relabeled.

```text
Targeted checks: 12 PASS / 0 FAIL
Confirmed Product FAIL: 0

QA: PASS
QA stopping classification: QA_TARGETED_EVIDENCE_COMPLETE

Gate 3: NOT_CREATED
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED
PRODUCTION_POLICY_BLOCKED

NO FURTHER QA RETRY AUTHORIZED
```

The next permitted workflow action is human authorization to prepare Gate 3.
Gate 3 must preserve the historical QA failures, this final targeted evidence,
the three residual browser limitations and all seven production-policy
blockers. No remediation, deployment, sync or archive is authorized here.
