# Release A customer exposure foundation — Browser QA

Status: Current generation 3 FAIL; generations 1–2 failure history retained

Visibility: Engineering

Owner: YUTA engineering

Change: `release-a-customer-exposure-foundation`

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA status: FAIL

Task mode: CODEX_ONLY

COMMIT_AFTER_TASK: NOT_SELECTED

HUMAN_PRODUCT_VALIDATION: NOT_REQUESTED

## Current result and retained executions

Current rebuilt-runtime **QA: FAIL**. Generation 3 completed all 103 scenarios
with **100 PASS, 3 FAIL and 0 NOT_RUN**. Three OWNER missing-binding guidance
navigation assertions failed. Current visual evidence also needs the bounded
targeted observation described below. Passing accessibility/replay facts do not
override those executed failures or independently approve Gate 3.

| Execution    | Actual result                          | PNGs | Build                                                                                      |
| ------------ | -------------------------------------- | ---: | ------------------------------------------------------------------------------------------ |
| Generation 1 | 50 PASS / 14 FAIL / 3 NOT_RUN; QA FAIL |   46 | `Ua4NAe8wBHfuSW6lCYqSp`                                                                    |
| Generation 2 | 53 PASS / 11 FAIL / 3 NOT_RUN; QA FAIL |   49 | `Ua4NAe8wBHfuSW6lCYqSp`, unchanged pre-fix runtime                                         |
| Generation 3 | 100 PASS / 3 FAIL / 0 NOT_RUN; QA FAIL |   79 | `dpcEq5-sJWwIz7A8Zi3FU`, bounded A accessibility/toolbar and forwarding-marker corrections |

All 174 retained PNGs match the screenshot hashes in their original observation
records. Original observation bytes are preserved in immutable `.json.raw`
copies; the `.json` reading paths were subsequently formatted. The historical
Users & Access mobile FAIL remains preserved.

## Observation byte preservation and reading representations

[observation-representations.json](observation-representations.json) records the
exact original/raw/reading paths and hashes. The parent copied four original
observation files byte-for-byte to `.json.raw`, then formatted the `.json`
reading representations under the unchanged repository format policy. The
immutable raw copies are authoritative for original execution bytes and the
historical hashes below; existing `.json` paths no longer have those raw hashes.

| Original-byte archive                                                                                | Original SHA-256                                                   | Formatted reading copy                                                                       | Current reading SHA-256                                            |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [browser-results.json.raw](browser-results.json.raw)                                                 | `616828cd09b5848f69292d27231a4f1687a27c93af293d2426c8897232d7a7bd` | [browser-results.json](browser-results.json)                                                 | `f6ffcca0b97054d0fce75e9a4368bb68e50f4b1df2b45f36d83480c0c7c32fe3` |
| [browser-results-generation1.json.raw](browser-results-generation1.json.raw)                         | `616828cd09b5848f69292d27231a4f1687a27c93af293d2426c8897232d7a7bd` | [browser-results-generation1.json](browser-results-generation1.json)                         | `f6ffcca0b97054d0fce75e9a4368bb68e50f4b1df2b45f36d83480c0c7c32fe3` |
| [generation2/browser-results-generation2.json.raw](generation2/browser-results-generation2.json.raw) | `0a374820d76c31d337ac1cf18d6ef736c698df2cbaecd85b991072af71ef4035` | [generation2/browser-results-generation2.json](generation2/browser-results-generation2.json) | `db94f3289b2d9b9f4860387f0523a763dcea40a216fa7f8546820bdf5d603588` |
| [generation3/browser-results-generation3.json.raw](generation3/browser-results-generation3.json.raw) | `011c5e29318f5f37391f139c1c1a71c70404a201c446acaebce13b6288b7b398` | [generation3/browser-results-generation3.json](generation3/browser-results-generation3.json) | `3d76981de5a053e53ef226caa4af266a8e1827e0bf0dd90365d508456f0a65c0` |

All four records report `rawByteEquality: true` and `parsedDataEquality: true`.
This evidence author rehashed all eight files and independently confirmed
parsed data equality. No original FAIL bytes, scenario outcome or screenshot
was lost. Formatting is a derived reading representation; it creates no new
QA execution, outcome, budget, approval or gate decision. Frozen planning
artifacts and repository formatter policy were not changed by this correction.

## Generation 1 — retained actual failure

The following initial-session sections preserve their original evidence and
limitations. Their pending assessments describe generation 1; the later
execution records provide current observations without rewriting that history.

### Scope and evidence identity

This report records actual generation 1 Browser QA under the approved
[Design](../../../../openspec/changes/release-a-customer-exposure-foundation/design.md),
[Tasks](../../../../openspec/changes/release-a-customer-exposure-foundation/tasks.md)
and [QA Protocol](../../../YUTA_QA_PROTOCOL.md). It covers the five existing
Backoffice A surfaces and the required internal comparison. It is evidence for
this task, not a Product, lifecycle, readiness, activation or gate decision.

The immutable original-byte initial result is [browser-results-generation1.json.raw](browser-results-generation1.json.raw),
SHA-256 `616828cd09b5848f69292d27231a4f1687a27c93af293d2426c8897232d7a7bd`.
It contains 67 scenarios: **50 PASS, 14 FAIL, 3 NOT_RUN**. Those are individual
evaluator outcomes; the applicable accessibility and visual defects establish
the overall **QA: FAIL**. No aggregate PASS is inferred from the passing cases.

The recorded session ran from `2026-10-01T12:51:42.474Z` to
`2026-10-01T12:52:44.173Z` (`14:51:42.474`–`14:52:44.173` Europe/Paris).
Real installed Chrome ran headless against the actual Next.js `16.2.9`
Backoffice runtime, with normal synthetic password login, persisted sessions
and establishment selection. No integrated page was replaced with a fixture.

The runner's runtime observation associates this session with local branch
`codex/release-a-customer-exposure-foundation`, base HEAD
`2dd5a02ba076a65928e2a80afe0b36d0d10284fd`, and production build ID
`Ua4NAe8wBHfuSW6lCYqSp` (the second completed pre-QA build). The result JSON
does not embed a complete dirty-source candidate manifest or the runtime/DB
identity; these identities are recorded by the parent runner and the Tasks
iteration record. Later source fixes require a rebuilt candidate and fresh
observations. This initial evidence cannot verify those fixes.

### Route(s)

Customer A used `http://localhost:3101`; internal comparison used
`http://localhost:3102` with explicit server-selected profiles and the same
verified disposable synthetic database.

| Surface / request                                         | Actual route                                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Today                                                     | `/aujourdhui`                                                                                           |
| Avis list, selected detail and real draft/note forms      | `/visibilite-reputation/avis` and its existing detail entry                                             |
| Basic Establishment Profile                               | `/etablissement/informations-generales`                                                                 |
| Google Integrations                                       | `/parametres/integrations`                                                                              |
| Users & Access                                            | `/parametres/utilisateurs-acces`                                                                        |
| Normal authentication and selection                       | `/connexion` and the existing establishment-selection flow                                              |
| Deferred route recovery and internal Booking comparison   | `/reservations/parametres`                                                                              |
| Genuine deferred Knowledge / Booking Server Action replay | Internal form POST captured before admission, then forwarded to an allowed A URL with a valid A session |

### Data/test setup

The parent runner verified the owned disposable PostgreSQL target before
migration, seed, fixtures or runtime use:

| Identity                                             | Observed value                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| Container name                                       | `yuta-release-a-16448043`                                                 |
| Exact container ID                                   | `6ee4d137193ec452dba05695d1e55a2d6923d3b2821ddd66d213e8575f06747e`        |
| Image                                                | `postgres:17`                                                             |
| Image digest                                         | `sha256:7958605b474b3d264a969cb3a123d6aa00ad1e1fe9da8a69984dabb704d93317` |
| Persistence mount                                    | `/var/lib/postgresql/data`, `tmpfs:rw`; inspected mounts were tmpfs only  |
| Published database listener                          | `127.0.0.1:54329` only                                                    |
| `current_database()`, `current_user`, `session_user` | All `yuta_release_a_exposure_test`                                        |
| PostgreSQL `server_version_num`                      | `170010`                                                                  |

The runner used new DB/auth secrets in process memory and explicitly blanked
provider configuration. No secret, cookie, action body or token is included in
this evidence. Existing development databases/environment files, provider
accounts and deployed instances were outside this execution. These fixtures
prove local persisted behavior, not live import, synchronization or publication.

Synthetic normal-login identities were `owner@luna-restaurant.fr`,
`manager@luna-restaurant.fr` and `staff@release-a.test`. The fixture contained
Google and DIRECT records, active/terminal statuses, a local reply record,
assigned and unassigned records, and foreign-tenant/other-establishment data.
The generation 1 browser fixture manifest omitted the exact foreign record ID,
so the three browser foreign-selection scenarios did not run. Previously
passing persisted technical isolation tests do not substitute for those cases.

The initial observed Google counters were total/new/attention `12/2/8` for
OWNER and MANAGER, and `4/1/4` for assigned-only STAFF. The scoped attention
queue narrowed OWNER/MANAGER total to 8 and retained new 2 / attention 8;
STAFF remained `4/1/4`. Browser source-query forging did not add a source
selector or expose DIRECT detail. DIRECT-selected and STAFF-unassigned detail
entry displayed the safe unavailable state.

### Roles/states and viewport(s)

OWNER, MANAGER and STAFF exercised desktop/mobile navigation, the five route
entries, scoped counters/queue, source-query forging and unavailable recovery.
OWNER could enter Google setup; MANAGER/STAFF received permission recovery.
STAFF's basic profile was read-only and Users & Access entry received permission
recovery. Passing role scenarios record their specific assertions; only OWNER
received the ten automated Axe route/viewport scans in this generation.

Viewports were `1366×768` desktop and `390×844` mobile. OWNER Today additionally
ran at `1536×864`, `1024×768`, `768×1024` and `390×844`. Real form states
included keyboard focus, pending, success and reload, plus filtered empty
results, clearing filters, source denial and deferred-route recovery.

For deterministic pending observation, browser routing held one genuine local
POST before server admission and then forwarded it unchanged. Observed
`aria-busy`, disabled state, focus and control geometry describe the real form
while held; this delay is an evaluator technique, not natural runtime latency.

### Scenarios tested

The exact scenario names, assertions and initial outcomes remain in the linked
JSON. The following groups summarize their implications without changing them:

| Group                                                   | Initial observation                                                                                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Desktop/mobile A navigation, all three roles            | PASS for the expected role-filtered hrefs; mobile keyboard-open/Escape recorded true. Desktop `keyboardOpenAndEscape: false` is not mobile keyboard evidence.            |
| OWNER five surfaces, desktop/mobile                     | Ten FAIL outcomes from actual Axe violations; geometry alone did not detect all clipping.                                                                                |
| MANAGER/STAFF five surfaces, desktop/mobile             | Route/permission/profile/counter assertions PASS; no equivalent Axe scan was recorded for these roles.                                                                   |
| Queue/source/selected DIRECT/STAFF unassigned           | Recorded assertions PASS; the three foreign-selected cases remain NOT_RUN.                                                                                               |
| Today four additional widths                            | Counter assertions PASS; some initial preview arrays were empty after early observation and need a stable rendered-content assertion.                                    |
| Empty search and clear-filter recovery                  | PASS for real filtered empty presentation and recovery; bound connector with zero rows was not exercised.                                                                |
| OWNER basic profile Save                                | FAIL: the evaluator did not find the expected value after reload. Hydration/value stabilization correction is pending actual retest.                                     |
| MANAGER basic profile Save                              | PASS: pending/success and persistence after reload recorded.                                                                                                             |
| OWNER/MANAGER/STAFF manual draft and internal note Save | Six PASS outcomes; actual success and reload persistence recorded, with publication disabled for drafts.                                                                 |
| OWNER rejected draft and recovery                       | FAIL: generic browser-operation failure. Controlled forged-ID injection occurred before a rerender and requires evaluator correction, not a fabricated rejection result. |
| OWNER deferred route and recovery                       | PASS: browser query did not open internal exposure and recovery remained permitted.                                                                                      |
| Internal Knowledge and Booking composition              | FAIL: generic browser-operation failure. Exact owned selectors and stable composition assertions require retest.                                                         |
| Genuine Knowledge action replay into A                  | PASS for actual HTTP 303 with action redirect to unavailable; DB equality metadata omission is qualified below.                                                          |
| Genuine Booking action replay into A                    | FAIL: expected unavailable response was absent. Forwarded action produced outer HTTP 200 with an empty object; wire verification/correction remains pending.             |

### Accessibility checks

Axe scanned the actual OWNER routes at both primary viewports. Serious
`color-contrast` violations occurred on every surface. The counts below are
reported Axe targets, not distinct application defects:

| OWNER route    | Desktop contrast targets | Mobile contrast targets | Mobile `aria-hidden-focus` targets |
| -------------- | -----------------------: | ----------------------: | ---------------------------------: |
| Today          |                       11 |                       2 |                                  1 |
| Avis           |                       19 |                      10 |                                  1 |
| Basic profile  |                       12 |                       3 |                                  1 |
| Integrations   |                       15 |                       6 |                                  1 |
| Users & Access |                       13 |                       4 |                                  1 |

The closed mobile drawer remained focusable beneath `aria-hidden`. The exact
target was the fixed menu container. Some Axe rules were incomplete: Avis
`aria-prohibited-attr` on desktop/mobile, and profile `color-contrast` on
desktop/mobile. Incomplete rules are unresolved observations, not passes.

Mobile menus recorded keyboard open and Escape close for all three roles.
The OWNER draft button also recorded actual keyboard focus before Enter
submitted the real form. Passing saves recorded busy/disabled semantics and
focused controls; this does not establish exhaustive screen-reader or keyboard
coverage of every route.

### Visual/responsive findings

All 34 captured document/main/control geometry records reported no horizontal
overflow and no overflowing controls. That evaluator did not inspect nested
list-panel clipping. The actual desktop Avis screenshot shows Search/Chercher
clipped at the list-card boundary by four viewport-based grid tracks in a
narrow panel. This is an additional observed visual FAIL, even though it is
absent from the JSON's 14 scenario failures. The number of raw scenario
failures remains 14.

The initial contrast/focus findings and Avis toolbar clipping remain historical
observations. The historical Users & Access mobile Browser QA FAIL also remains
preserved; the present no-horizontal-overflow observation does not erase it.

### Regression findings and replay evidence limits

The three A role diagnostics recorded no console errors/warnings, page errors,
hydration errors or blocked external requests. Internal OWNER recorded two
network diagnostics on profile and Booking settings while genuine deferred
POSTs were intentionally aborted for capture. There were no internal page or
hydration errors; these expected capture aborts must be distinguished from
unexpected runtime failures. Zero hydration errors does not mean the evaluator
always waited for stable interactive state.

Knowledge replay was captured from a genuine internal form and forwarded with
the valid A session. Its actual response was HTTP 303 with an unavailable
action redirect. The parent runner executed a stable, sorted before/after
comparison over all six Knowledge table groups (including the actual
`validated_items` table), Booking periods/settings/reservations and Reputation
audit state on this verified database. Its equality assertion completed in the
passing scenario. The JSON contains `parentDbComparisonRequested: true` but
omits the comparator's returned equality flag and counts. Therefore this JSON
independently proves transport denial, not a self-contained persisted
no-effect/audit proof. Re-observation must retain the returned comparator facts.

Booking's outer HTTP 200/empty-object response is not proof of protected
execution, persistence or successful denial. Installed Next.js `16.2.9` action
worker forwarding can discard a non-RSC proxy denial response. Source
inspection rejected the earlier swallowed-redirect hypothesis. The actual wire
probe and any bounded transport correction are pending; no no-write/audit claim
or replay PASS is made here.

### Known limitations and authorized correction

The actual current Human authorized `FIX — cho phép sửa accessibility giới hạn
và chạy lại VERIFY/QA` for semantic adequate-contrast text and a closed inert
mobile menu across only the QA-affected five surfaces, preserving existing
grants/business behavior. The Tasks record also retains the observed A-only
Avis toolbar defect and bounded container-width correction. These source
corrections are pending rebuilt-runtime VERIFY/QA and do not change this
generation's failure result.

Evaluator correction must wait for hydration/stable content and exact controlled
values, target the owned internal headings, inject the DIRECT ID after textarea
rerender, wait for the drawer's final transform, verify complete preview IDs,
measure nested search controls and retain the comparator return values. The
new exact foreign synthetic ID is for a later session; it does not retroactively
execute generation 1's three NOT_RUN cases.

No real provider connection/import/publication, connector-bound zero-row state,
exhaustive role-specific Axe scan or full internal regression was established
by this generation. Optional Human Product validation is NOT_REQUESTED. The
initial UI defects and mandatory outstanding cases prevent QA PASS and ready
Gate 3. Separate activation, sync, archive, commit and production authorities
are not created by this report.

### Screenshot evidence

[screenshot-manifest.md](screenshot-manifest.md) records all 46 actual generation
1 PNGs in path order, with viewport, role/state, scenario and lowercase SHA-256.
Before authoring the manifest, all 46 current files were rehashed against the
immutable initial JSON: **46 matches, zero mismatches**. The duplicate bytes of
`07-owner-mobile-today.png` and `26-owner-today-390.png` are retained as captured
initial history; no new duplicate screenshot was manufactured.

The desktop Avis and mobile Users screenshots were inspected when preparing
this initial packet; the parent QA/finding review provides the wider screenshot
assessment. Hash verification of every file is not itself visual review.

## Generation 2 — retained actual failure

Source: [generation2/browser-results-generation2.json.raw](generation2/browser-results-generation2.json.raw),
SHA-256 `0a374820d76c31d337ac1cf18d6ef736c698df2cbaecd85b991072af71ef4035`.
The actual session ran `2026-10-01T13:03:18.334Z`–`2026-10-01T13:05:04.252Z`
(`15:03:18.334`–`15:05:04.252` Europe/Paris). It recorded **53 PASS, 11 FAIL,
3 NOT_RUN** across 67 scenarios, with 49 PNGs. All 49 exact screenshot hashes
match the retained JSON. QA remains **FAIL** for this generation.

The intended wire-only diagnostic became the full corrected harness when
delegated helper preparation overwrote the root-owned supplement before import.
That coordination error consumed a real generation 2 execution; it was not a
rejected preflight and did not reset the evaluator budget. The runtime still
served pre-fix build `Ua4NAe8wBHfuSW6lCYqSp`, before the authored A accessibility
and proxy-marker corrections were built. Its ten inherited Axe failures are
real observations of that old runtime and do not evaluate activation of the
new source fixes. The three foreign-selected scenarios remained NOT_RUN
because the overwritten supplement again omitted the exact record ID.

| Corrected evaluator / observed request                    | Actual generation 2 outcome                                                                                                                                                                                                                     |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OWNER basic profile Save, pending/success and real reload | PASS; the expected controlled value survived reload.                                                                                                                                                                                            |
| OWNER forged DIRECT draft and recovery                    | PASS; actual action error, controls recovered, rejected draft absent after reload.                                                                                                                                                              |
| Internal Knowledge / Booking composition                  | PASS; Knowledge and Booking visible, existing source selector retained.                                                                                                                                                                         |
| Genuine Knowledge replay                                  | PASS; captured real form, matching worker route `/etablissement/informations-generales`, HTTP 303 `text/x-component` safe-unavailable action redirect, `persistedBeforeAfterEqual: true`, `callbackReturned: true`.                             |
| Genuine Booking replay                                    | FAIL; matching worker route `/reservations/parametres`, outer HTTP 200 `application/json; charset=utf-8`, exact empty-object response, no unavailable/not-found marker, `denied: false`; comparator returned `persistedBeforeAfterEqual: true`. |
| OWNER desktop/mobile five surfaces                        | Ten actual Axe FAIL outcomes remained; pre-fix contrast/closed-drawer defects not corrected in this running build.                                                                                                                              |
| Foreign-selected details, all three roles                 | Three NOT_RUN cases remained; technical isolation checks do not execute them.                                                                                                                                                                   |

The replay comparator now retained its returned equality fact. The Booking
wire defect concerned denial disposition: equality confirms no compared
persisted effect during the request, while the expected safe response still
failed. It is not converted to PASS. Action bodies, credentials and raw IDs
were not added to the evidence; safe worker-route metadata identifies the
actual invoked capability.

The three A role diagnostics again recorded zero console errors/warnings,
page/hydration errors or blocked external requests. Internal recorded the two
intentional capture-abort network diagnostics, with zero page/hydration errors.
All 34 recorded geometry entries had no document/main/control overflow, but
nested Avis clipping still required the corrected geometry evaluator.
Generation 2 retains the initial provider/fixture/visual-review limitations.
Its screenshots are retained under `generation2/`; no original observation
byte or generation 1 PNG was lost. Original JSON bytes are now in the raw
archives; formatted reading copies are identified above. Historical Users & Access mobile FAIL remains preserved.

## Generation 3 — current rebuilt candidate

Source: [generation3/browser-results-generation3.json.raw](generation3/browser-results-generation3.json.raw),
SHA-256 `011c5e29318f5f37391f139c1c1a71c70404a201c446acaebce13b6288b7b398`.
Execution purpose: `browser-qa-generation3`. Actual session:
`2026-10-01T13:15:15.721Z`–`2026-10-01T13:17:49.158Z`
(`15:15:15.721`–`15:17:49.158` Europe/Paris).

Real Chrome/Next.js `16.2.9` used rebuilt candidate
`dpcEq5-sJWwIz7A8Zi3FU`, which contains the authorized A-only
contrast/inert/toolbar corrections and the narrow standard forwarding-denial
marker. It used the same parent-verified exact container
`6ee4d137193ec452dba05695d1e55a2d6923d3b2821ddd66d213e8575f06747e`
(`yuta-release-a-16448043`) and database/user/tmpfs/loopback identities recorded
above. The branch/base HEAD, local origins and process-only synthetic runtime
recipe were unchanged. No deployed instance or provider configuration was
activated. Raw outcomes: **100 PASS, 3 FAIL, 0 NOT_RUN; QA FAIL**.

### Executed mandatory behavior

| Group                                                              | Actual generation 3 observation                                                                                                                |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal authentication and allowed deep link, OWNER/MANAGER/STAFF   | Three PASS outcomes: normal authentication, permitted return path preserved and tenant context usable.                                         |
| Actual OWNER establishment switch and safe return                  | PASS: switched through the actual control, allowed route preserved, other-establishment selected target unavailable, original scope recovered. |
| Deferred return path through normal authentication                 | PASS: deferred return path cleared to `/aujourdhui`.                                                                                           |
| Five A surfaces, desktop/mobile, all three roles                   | Applicable route, permission, read-only, navigation, source and queue assertions PASS; all three foreign-selected cases now executed and PASS. |
| Today desktop/mobile and four OWNER breakpoints                    | PASS: current expected counters and all three preview IDs matched exactly; no early empty-preview observation accepted.                        |
| Actual profile/draft/note Save and real reload                     | All eight Save outcomes PASS with real pending/success/reload facts; STAFF profile remained read-only and draft publication remained disabled. |
| Forged DIRECT draft error and recovery                             | PASS: actual action error, controls recovered, rejected draft absent after reload.                                                             |
| Filtered empty results and clear-filter recovery                   | PASS.                                                                                                                                          |
| Internal Knowledge, Today Booking and mixed-source Avis comparison | Composition regression PASS; screenshots retain the broader internal surfaces.                                                                 |
| Bound-empty / missing-binding state cases                          | All 28 executed: 25 PASS, 3 FAIL listed below.                                                                                                 |
| Two setup fixture transitions and final restoration                | Three PASS outcomes; root callbacks verified owned DB, reported no attempted provider operation and returned exact restoration equality.       |

Current expected new/attention values were `1/8` for OWNER/MANAGER and `0/4`
for assigned-only STAFF. Each was compared with the parent-supplied current
persisted expectation; historical generation 1 counters were not reused as
the current oracle. All observed Today preview arrays matched exactly three
expected IDs, including at OWNER widths 1536/1024/768/390.

### Accessibility, geometry and diagnostics

All 22 actual OWNER Axe scans reported zero violations: the five primary
surfaces at both viewports plus the OWNER Today/Avis/Integrations setup states.
Avis `aria-prohibited-attr` and profile `color-contrast` remained incomplete
at both primary viewports. No equivalent exhaustive Axe scan was performed
for MANAGER/STAFF; functional role assertions do not replace it. No claim of
formal accessibility certification is made.

All 62 recorded geometry observations showed no document/main/control
horizontal overflow. The corrected evaluator measured nested Avis controls
against the actual list-card bounds: status, rating, sort, Search and Chercher
were inside the card for each recorded role/viewport. For OWNER, desktop card
width was 557 px and search width 257 px; mobile card width was 350 px and
search width 316 px. This actual geometry observation resolves the initial
nested clipping finding while preserving its historical FAIL.

Four A browser diagnostic contexts recorded zero console errors/warnings,
page errors, hydration errors or blocked external requests. Internal retained
two expected capture-abort network diagnostics, with zero page/hydration errors.
The A server separately logged an uncaught Next framework cancellation
diagnostic (`aborted` / `ECONNRESET`) during controlled action forwarding.
Both replay response/equality assertions passed and the servers continued
through all subsequent setup states. The parent classified this as a narrow
framework cancellation diagnostic; zero browser errors is not a claim of
empty server logs. The held-POST pending technique retains its initial limits.

### Genuine replay and persisted comparison

| Invoked capability                                                            | Actual transport / comparison facts                                                                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Knowledge, matching real worker route `/etablissement/informations-generales` | HTTP 303 `text/x-component`, action redirect to safe unavailable, `denied: true`, `persistedBeforeAfterEqual: true`, `callbackReturned: true`.        |
| Booking, matching real worker route `/reservations/parametres`                | HTTP 404 `text/plain`, standard not-found header and error markers true, `denied: true`, `persistedBeforeAfterEqual: true`, `callbackReturned: true`. |

Both requests were captured from genuine internal forms and replayed at an
allowed A URL with a valid A session. The parent-owned comparator covered
the same six Knowledge groups, Booking state and Reputation audit scope
described above. The final Booking denial and no-compared-effect facts were
actually observed, rather than inferred from the proxy unit assertion/source
fix. The HTTP 200 empty-object failure remains retained in generations 1–2.
No cookie, raw action body, credential or token is included in evidence.

### Setup states, exact restoration and remaining failure

Root-owned synthetic transitions executed after owned-database verification.
All 14 bound-empty route/role/viewport cases passed. Today showed zero
new/attention and no preview; Avis showed zero total/new/attention and no
selected detail. The bound setup title remained `Établissement Google associé`,
import outcome stayed `UNKNOWN`, and no import result was confirmed.

For missing binding, 11 of 14 cases passed. MANAGER/STAFF received an OWNER
handoff instead of a setup link. OWNER's setup title was `Connexion Google à
finaliser`; the mobile Avis case recorded a visible OWNER setup link and
actual Integrations navigation. The following three navigation assertions
failed and remain unresolved; screenshots captured before the assertion do
not turn these outcomes into passes:

| Scenario                                      | Recorded failure                                        |
| --------------------------------------------- | ------------------------------------------------------- |
| `Setup missing-binding OWNER desktop today`   | OWNER setup guidance did not reach actual Integrations. |
| `Setup missing-binding OWNER desktop reviews` | OWNER setup guidance did not reach actual Integrations. |
| `Setup missing-binding OWNER mobile today`    | OWNER setup guidance did not reach actual Integrations. |

The parent's source/evaluator diagnosis found that a Next Link click followed
by settle did not wait for the destination URL. The fourth such case passed.
That diagnosis identifies a possible early assertion; it does not retroactively
produce the three missing actual observations or change their FAIL results.

The final restore callback completed with `restoredBeforeAfterEqual: true`.
Root-owned setup changes were restored to their exact pre-transition synthetic
state. Both transitions recorded `providerOperationAttempted: false`.
No provider import, synchronization, publication or live connector proof was
created by these fixtures.

### Current usability and visual evidence limits

The rebuilt candidate's actual normal authentication/context flow, basic
profile Save, manual draft Save and internal note Save were successfully
observed in this QA session. These are current-candidate usability facts;
they do not independently assess the whole manual handoff or optional Human
Product validation. Separately owned development-feedback assertions stay
in Tasks; this report creates no competing authority.

Current visual review is partial. The parent's read-only visual reviewer
assessed visible portions of 68 generation 3 PNGs (01–36, 43, 45, 47–48 and
52–79). Menu captures 06/16/21 remain transient/clipped. Users 11 shows only
the first member header; lower role/status/Save controls remain unobserved.
Mobile Avis search is inside the card in geometry but not visually captured,
and some empty-state lower CTAs are outside the current captures. The parent
also directly inspected desktop Avis 02 and mobile-menu 06 and agreed.
The parent's diagnosis found that Tailwind 4 uses the individual CSS `translate`
property: polling computed `transform: none` did not wait for the actual drawer
translation. That early-state check does not establish the final open-menu
layout. This evidence author has verified all 79 generation 3 PNG hashes and
has not claimed inspection of every current image. Initial generation 1
inspection does not substitute for current visual coverage.

Overall **QA: FAIL** remains. A bounded current-Human budget request for one
targeted observation is pending; no equivalent full generation 4, Product
mutation or automatic retry is authorized by these results. Its expected
evidence home is `qa/supplement1/`, but no supplement result/count/image has
been created or inferred in this report. Only actual separately authorized
evidence can resolve the navigation/visual gaps; historical results remain.

All 174 retained screenshots are recorded in the manifest with exact hashes.
Required provider/readiness/activation decisions and fresh independent Gate 3
review remain separate. No commit, sync, archive or gate approval is supplied.
Historical Users & Access mobile FAIL remains preserved even though the current
geometry and Axe observations pass.
