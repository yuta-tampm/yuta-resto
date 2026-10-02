# Release A customer exposure foundation — technical verification

Status: Technical contract verification PASS; Browser QA PASS; final review pending

Visibility: Engineering

Owner: YUTA engineering

Change: `release-a-customer-exposure-foundation`

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

QA: PASS after independent consolidation, separately recorded in [QA_REPORT.md](qa/QA_REPORT.md)

## Scope and attribution

CODEX_ONLY, actual current-user selection. Customer-instance A and separate
internal profile are approved; build and local verification only. Current-user
bounded accessibility FIX covers A contrast tokens and closed-mobile-menu inert
without changing grants or business behavior. COMMIT_AFTER_TASK: YES, from the
current user's explicit request to locally commit the completed QA closeout on
`main`; the unanswered intake choice remains historical. This commit covers only
the QA evidence and its mutable task/verification context. Gate 3 remains pending.
No activation, provider operation, push, main-spec sync or archive is authorized.

Baseline HEAD `2dd5a02ba076a65928e2a80afe0b36d0d10284fd`, branch
`codex/release-a-customer-exposure-foundation`; no staged paths. The exact
[implementation diff](implementation.diff) and
[file inventory](implementation-files.json) cover tracked unstaged changes and
untracked additions in the affected Backoffice, db-cloud and current-doc owners.
Planning and review evidence are separately identified in the existing packets.
No schema, migration, dependency, permission-map, POS, Display or public-app
source changed. Prior approved Proposal, Analysis, twelve Specs, Design and four
Product-home identities remain unchanged; hashes are in Gate 2b.

## Technical Compliance Matrix

Every row maps an actual contract to implementation and meaningful evidence.
Runtime UX and screenshot obligations remain independently subject to QA.
`R1`–`R10` are the ordered named requirements in
[the approved exposure delta](../../../openspec/changes/release-a-customer-exposure-foundation/specs/backoffice/release-a-customer-exposure/spec.md).

| Phase / rule                                       | Authority                                        | Implementation                                                                                                                    | Technical evidence                                                                                                                                                                                               | Result |
| -------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1 / R1 trusted whole-instance profile              | Exposure R1; Design1                             | Pure exposure policy, Zod server config and server capability helpers                                                             | `backoffice-exposure.test.ts`: explicit profiles, development/test defaults, production missing/invalid denial, browser forgery and closed catalog                                                               | PASS   |
| 1 / R2 exact slices and existing grants            | Exposure R2; Design1/4                           | Authenticated layout/frame/navigation and actual session helpers                                                                  | Exposure navigation tests and `release-a-profile-auth.test.tsx`: OWNER/MANAGER/STAFF, entitlement and suspended/mismatched membership denial before repositories                                                 | PASS   |
| 1 / R3 deferred admission and invoked capability   | Exposure R3; Design2                             | Proxy, common Booking/Personnel auth guards, eight explicit Knowledge action guards, registry early guards, Pointage page/handler | All42 exported deferred actions × development/test, actual dependencies not availability mocked; seven Pointage operations deny before body/bootstrap; API/no-store/security-header/internal regression          | PASS   |
| 1 / actual Next forwarding denial                  | Exposure R3; Design2/6                           | Standard deferred proxy POST denial plus `x-nextjs-action-not-found`, unchanged Pointage posture; common capability guards        | Gen3 genuine Knowledge action303 safe unavailable and Booking forwarded action404 standard unavailable, both private persisted before/after snapshots including audit exactly equal; direct typed403 tests       | PASS   |
| 1 / R4 permitted entry/recovery                    | Exposure R4; Design2/4                           | `safeBackofficeReturnTo`, authenticated/context helpers, basic-profile support recovery                                           | Closed local returnTo tests, missing profile/context/entitlement tests; gen3 all-role normal allowed deep-link auth, OWNER actual context switch/other-establishment selected denial, deferred returnTo recovery | PASS   |
| 2 / R5 Google-only scoped reads                    | Exposure R5; Design3                             | Repository forced-source/list/scoped-parent predicates and Avis loader, including malformed-query fallback                        | Loader tests; guarded persisted source/org/establishment/STAFF tests; gen3 forged DIRECT/urgency query, selected DIRECT/foreign/unassigned unavailable without detail                                            | PASS   |
| 2 / R6 scoped Google mutations                     | Exposure R6; Design3                             | Avis actions and transactional repository scoped parent locks, child org/verified-parent predicates and checked final writes      | Action tests; persisted denied-target row/reply/note/status/success-audit equality and foreign-child isolation; assigned STAFF save; actual three-role draft/note persistence and rejected DIRECT draft          | PASS   |
| 2 / R7 same local handling queue                   | Exposure R7; Design3/4                           | Shared NEW/TO_PROCESS/DRAFTED/FOLLOW_UP set, Today Google composition and repository same-WHERE aggregates                        | Persisted uncapped counts, page/preview caps, terminal exclusion, local PUBLISHED reply retained, filter narrowing and STAFF assignment; gen3 exact persisted preview IDs/order and count/linked queue agreement | PASS   |
| 1 / R8 basic-profile-only composition              | Exposure R8; Design2/4                           | Profile skips six Knowledge reads/render/serialization; explicit loader/action availability                                       | Profile/auth and Knowledge-loader tests, all eight same-profile-path actions denied; actual OWNER/MANAGER basic Save, STAFF read-only, A sentinel absent/internal sentinel present                               | PASS   |
| 2 / R9 truthful setup/provenance                   | Exposure R9; Design4                             | Token-free scoped setup metadata and A Integration/customer recovery copy                                                         | Setup/copy tests; gen3 root-verified bound-empty and missing-binding states, zero local scoped counters, OWNER vs other-role guidance, no import outcome invented, exact fixture restoration                     | PASS   |
| 2 / R10 internal and ownership regression          | Exposure R10; Design3–5                          | Conditional current compositions and untouched independent owners/grants                                                          | Internal loader/menu/persisted regressions; gen3 internal Knowledge/Booking/mixed-source UI; architecture, typecheck and unchanged schema/dependency/owner diff                                                  | PASS   |
| 1 / six Knowledge compatibility deltas             | Six approved Restaurant Knowledge Specs; Design2 | Six hosted loader guards and eight actions, A basic composition only                                                              | `restaurant-knowledge-loader.test.ts`, profile/auth tests and all42-action matrix; existing internal domain/qualification tests preserved                                                                        | PASS   |
| 1 / Pointage raw and authorization deltas          | Two approved Pointage Specs; Design2             | Hosted page/seven operations denied before admission, security headers retained                                                   | Pointage exposure8 cases, prior inventory/transport/client clearing/reset regressions; no successful end/invalidation commit claimed in A                                                                        | PASS   |
| 1 / Formalités persistent and authorization deltas | Two approved Formalités Specs; Design2           | Common Personnel/Formalités capability guard and filtered navigation                                                              | All42-action matrix, protected persistent-draft/source tests and internal menu preserved; no qualification or generation authority changed                                                                       | PASS   |
| 1 / social-settings compatibility delta            | Approved review-social-links Spec; Design2/4     | Deferred Satisfaction hosted entry/action unavailable                                                                             | Actual satisfaction action in42-export matrix and closed route policy; independent feedback-web/outbound URL contracts unchanged                                                                                 | PASS   |
| 3 / current documentation and engineering boundary | Design5; AGENTS                                  | ADR-009, current index/state/operations and Today-pack internal/A applicability                                                   | docs consistency36 documents; source diff; four reviewed Product-home hashes unchanged; no sealed/reference/lifecycle rewrite                                                                                    | PASS   |
| 3 / safe actual development and handoff            | Design6; workflow post-Apply controls            | Verified disposable recipe, actual normal auth/save flow, local manual handoff in Tasks                                           | Current DEV_USABLE YES reassessed from gen3; MANUAL_TEST_READY YES separately inspected; optional HUMAN_PRODUCT_VALIDATION NOT_REQUESTED; no provider/deployed acceptance inferred                               | PASS   |
| 4 / mandatory source and evidence checks           | Design6; AGENTS; workflow VERIFY                 | Current source/build and attributed review evidence                                                                               | Commands below; final formatter-compliant reading copies retain original raw observation bytes and parsed equality                                                                                               | PASS   |

## Executed checks and limits

| Command / evaluator                                                                                                        | Actual result                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm docs:check`                                                                                                          | exit0;36 current documents PASS                                                                                                                                                                                                                                                                                                         |
| `pnpm architecture:check`                                                                                                  | exit0; runtime imports, DB URLs, client boundaries and migration baselines PASS                                                                                                                                                                                                                                                         |
| `pnpm -r --if-present typecheck`                                                                                           | exit0; full workspace PASS on final corrected runtime source                                                                                                                                                                                                                                                                            |
| `pnpm --filter @yuta/backoffice test`                                                                                      | exit0;116 files/1328 tests PASS,54 guarded skips                                                                                                                                                                                                                                                                                        |
| `pnpm test:cloud` initial consolidated run                                                                                 | exit1; auth64/core41/contracts112/booking3/booking-web3/tenant11/db-cloud157 PASS, Backoffice21 historical source-shape assertions failed; those failures were retained and corrected, followed by the full final Backoffice PASS above                                                                                                 |
| Guarded `vitest run test/reputation-release-a-exposure.integration.test.ts` on verified task DB with both explicit opt-ins | exit0;13/13 PASS, including four actual persisted cases; target identity checked before effects                                                                                                                                                                                                                                         |
| Final narrow exposure/Pointage/Formalités checks                                                                           | exit0;107 PASS/5 guarded HTTP skips after proxy marker; earlier exact compatibility focus68 PASS/5 skips; final full Backoffice subsequently PASS                                                                                                                                                                                       |
| Backoffice production build via installed Next CLI and process-only verified environment                                   | exit0; build3 PASS, Next16.2.9, BUILD_ID `dpcEq5-sJWwIz7A8Zi3FU`; explicit provider variables blank                                                                                                                                                                                                                                     |
| `openspec validate release-a-customer-exposure-foundation --strict --json`                                                 | exit0; validtrue/issues[], latest35ms                                                                                                                                                                                                                                                                                                   |
| `pnpm format:check`                                                                                                        | Prior source/style pass retained. Current new raw observations caused4 style failures; attempted ignore additions were refused by exact policy guard and fully reverted. Original bytes retained under `.json.raw`, formatted `.json` copies verified parsed-equal; final full check exit0/globalstyle PASS and67 exact paths preserved |

Unchanged `test:local` and public web/booking-web/feedback-web builds were not run;
their runtime owners, sources and dependencies were unchanged. Opt-in OpenAI,
older Pointage HTTP and other database suites remained guarded outside their
approved environments;228 db-cloud integration skips,4 booking-web opt-in skips
and54 Backoffice skips are not live-provider or operational evidence. No lint
script/result is invented. No `db:push`, generated migration or provider QA ran.

## Runtime and remaining completion

Two local Next instances used the same build and exact disposable PostgreSQL17
tmpfs/loopback database, task label and process-only secrets. Canonical current
migrations/seed applied only after container/database/user/session/image/mount
identity checks. Gen3 target was container `6ee4d137193ec452dba05695d1e55a2d6923d3b2821ddd66d213e8575f06747e`,
name `yuta-release-a-16448043`, DB/user/session
`yuta_release_a_exposure_test`, server version170010. Provider configuration was
explicitly blank; fixtures token-free. Existing development DBs and environment
files were untouched. Owned runtime cleanup completed; exact task container and servers removed, all three owned ports free; persistent cloud/POS/Display containers unchanged.

QA remains FAIL: gen3 `100 PASS / 3 FAIL / 0 NOT_RUN`,79 PNGs. Original
contrast/focus/forwarding defects resolved; three setup-click immediate-path
assertions and settled-menu/lower-control evidence remain. Human budget
exception is pending; no fourth full harness or supplemental execution has
been authorized. All histories and exact raw observations remain preserved.
No Gate3 approval or readiness is recorded. See current Tasks iteration ledger
and QA report for bounded decisions and screenshot coverage limits.

Final observation: owner-helper verified exact6ee4... container identity before removal; servers21332/13752 stopped, 54329/3101/3102 no longer listen. Persistent containers cloud84e666169d19/POS0d243ec9556b/Display57842b202f19 remain unchanged. Globalformat:checkexit0; final scoped evidence Markdown formatting checked separately. QA budget remains pending, no supplemental execution or Gate3 approval.

## Current authorized supplemental QA closeout

The preceding runtime/QA pending statements describe the generation 3 stop.
The current user subsequently approved exactly one targeted QA observation.
On unchanged main `ad97a0f2df5dcce2adc7f8bf48e44a30226d3f61` and the same
build, it executed `2026-10-01T14:05:10.742Z` to
`2026-10-01T14:05:32.107Z`: **10 PASS / 0 FAIL / 0 NOT_RUN**, including seven
behavior cases, two verified setup transitions and exact restoration.
The original result SHA-256 is
`b9ed12095917c79f3add4801a1da68435960b106f0ffdda07919689b4e70f682`.
The four actual OWNER navigation observations resolve the three generation 3
FAIL findings; settled mobile-menu/scrolled Avis/Users images close the visual
gaps. Historical results are not rewritten.

Fresh read-only `qa_supplement_evidence_review` inspected all11new PNGs;
`qa_consolidation_review` approved current Browser QA only after the exact
manifest closeout and inspected the remaining11generation3images. All185PNG
hashes, original committed historical LF bytes and parsed reading-copy
equality were verified. Current **QA: PASS**, task4.4 complete; fullQA3/3 and
extra1/1 remain consumed. Inherited internal toolbar clipping, incomplete
Axe rules, OWNER-only supplemental scope and checkout-EOL byte distinctions
remain explicit. No provider, replay or pending-Save rerun is inferred.

The exact new temporary target and unchanged47runtime-source attribution are
in `qa/supplement1/preflight.json`. Supplemental populated-fixture restoration
and the original manual pre-run snapshot comparison across feedback,
connectors, replies, notes, audits and memberships both passed; safe facts are
in `qa/supplement1/restoration.json`. QA browser contexts closed, while the
existing manual local runtime remains available as requested. No secret or
private snapshot is in retained evidence.

Documentation consistency, architecture and changed-evidence formatting pass;
full workspace typecheck passed during evaluator preparation on unchanged
runtime source. Product tests/build were not repeated for the evaluator and
evidence-only correction. Current global formatting retains the checkout
LF/CRLF limitation described in the QA report, despite its diagnostic exact-LF
PASS; no formatter/Git settings were changed. This QA closeout does not supply
Gate3 or overall task approval, waive that technical/format limitation, commit,
sync/archive, Product acceptance, lifecycle promotion or deployment authority.

## Current final-review preparation after exact-byte restoration

Actual current user approved prerequisite LF restoration and review continuation (steps1+2). Temporary CRLF invalidation is retained in Tasks; original Gate1/2/2b packet bytes were recovered with all21frozen references and Gate2b packet identity exact. Each gate requires its own fresh independent revalidation, recorded in Tasks. The restored source inventory matches61/61original raw file hashes, and all8raw observations preserve their recorded original identities. Current BrowserQA remains PASS on the unchanged build; there is no new QA execution or budget.

Current checks: pnpm docs:check exit0/36documents; pnpm architecture:check exit0; pnpm -r --if-present typecheck exit0; pnpm format:check exit0 with67exact preserved paths and global Prettier PASS; openspec validate release-a-customer-exposure-foundation --strict --json exit0/validtrue/issues[]. These resolve the historical checkout-EOL formatter limitation. Product tests/build were not repeated because exact implementation/test bytes match the already evaluated candidate. No migration, provider, local-product test/build or deployment action was performed.

Completeness:23/23implementation tasks,10exposure requirements/29scenarios and11compatibility deltas accounted for. Correctness and coherence retain the approved contract mapping above, with no substantive defect in the independent bounded preparation audit. Phase4 implementation/VERIFY/QA evidence is complete; independent Gate3 remains pending. Final approval must cover the exact cumulative implementation diff, current evidence and all restored planning identities; no sync/archive authorization is supplied by this preparation.
