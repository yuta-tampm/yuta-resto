Change: pointage-usable-raw-clocking
Gate: GATE 3 — FINAL INDEPENDENT REVIEW
Review status: APPROVED
Created: 2026-09-23T13:47:43.3253230+02:00
Approved: 2026-09-23T14:16:57.9492388+02:00
Approval source: Explicit current-user Gate 3 decision in the 2026-09-23 `$yuta-finish-change pointage-usable-raw-clocking` request
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — cross-module Personnel, authorization, immutable attendance evidence, cloud persistence and employee-facing UI/runtime

Sync authorization: AUTHORIZED_BY_CURRENT_USER
Finish outcome: COMPLETED
Finish completed: 2026-09-23T14:24:53.2178853+02:00

# Gate 3 — Final Independent Review

## 1. Executive result

```text
CROSS-MODULE IMPACT CHECK: CROSS_MODULE

APPLY: COMPLETE
Tasks: 32/32

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS

UI_AFFECTING: YES
BROWSER_QA_REQUIRED: YES
QA: PASS
QA stopping classification: QA_TARGETED_EVIDENCE_COMPLETE
Product FAIL: 0

IMPLEMENTATION QUALITY: PASS
PRODUCTION READINESS: BLOCKED

GATE_3_READY_FOR_HUMAN_APPROVAL
Gate 3 approval: NOT_YET_AUTHORIZED
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED
```

Recommendation:

`APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY`

Recommendation này không tự approve Gate 3, không cấp sync/archive, không cấp
deployment hoặc production enablement. Packet dừng để chờ quyết định hiện tại
của con người trên đúng bytes/evidence bên dưới.

## 2. Authority and reviewed baseline

Gate 3 authority thuộc
`docs/reviews/pointage-usable-raw-clocking/03-final-review.md` theo current YUTA
Workflow v3 và executable `yuta-run-change` workflow. Gate 3 review độc lập ba
lớp: Technical Implementation Compliance, formal VERIFY và QA/Browser QA; không
gộp ba lớp thành một PASS chung.

Current HEAD: `14dd0f35645586abc5877da28df0fcd16eba971d`.

Protected Product/source/test manifest:
`ca13b2cc30e26a1f75c9c35f206a9b0c3ffe69872699ac8bde2c67fa2ba3fdfd`.

Product/source drift: `0`.

| Reviewed artifact                                                                    | Current exact-byte SHA-256                                         | Disposition                                 |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------- |
| `openspec/changes/pointage-usable-raw-clocking/proposal.md`                          | `d42975cd06290431701e39d499edac93774275c1bb0f28f8474f6ff0e61816f1` | Gate 1 scope preserved                      |
| `openspec/changes/pointage-usable-raw-clocking/analysis.md`                          | `f04e66f9f2307dc92aa9cdbd134fb4a35f9c1089459440c0ccfdb40c4a3e9146` | `READY_FOR_SPECS` preserved                 |
| `docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md`                    | `ee18fdbf3b9802978eb7d71000d001c1b32eb7672f333bf8fe452005414f3557` | `APPROVED`                                  |
| `openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md` | `1ba6a0e6bfd3d82fb0f0d010f62e01dd2eacd7e934158ea3144c84ecf203fd66` | approved delta preserved                    |
| `openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md`  | `4bfa64e863ad465a144341c18aa5d0db3ce0806ada52ad40183cf9a4e321f90e` | approved delta preserved                    |
| `docs/reviews/pointage-usable-raw-clocking/02-specs-review.md`                       | `c5a7fd21c9fb04ea8f3617463241fc0ec8b41ea6e69b6074da5fefe98f0da566` | `APPROVED`                                  |
| `openspec/changes/pointage-usable-raw-clocking/design.md`                            | `01b2b7b870d7793a8277fda83c87586c673a3edc2a0f63e405b5b6d27e3534b7` | final approved Sensitive Design             |
| `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md`                     | `a6d41924a4a073962fb63213ab1695448f502afa60e3148274b7e89bcc14aac4` | current approved review/evidence history    |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`                             | `0e07e5ecc2539dfcb54badfeb5ba8bae2cb55b96822e1216a22b75907e068b6c` | 32/32 complete; current execution evidence  |
| `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md`        | `04f3f3307848c0846f9103731f1f1c41a7b978821d63b82896df9211ffd5e040` | current approved planning/execution history |

Hash method: SHA-256 over exact file bytes using PowerShell
`Get-FileHash -LiteralPath <path> -Algorithm SHA256`, lowercase hexadecimal;
no newline normalization.

OpenSpec reports schema `yuta-spec-driven`, every planning artifact `done`,
planning complete, and 32/32 Apply tasks complete. The delta Specs still contain
20 requirements and 62 scenarios. No main Spec sync or archive has occurred.

## 3. Technical Implementation Compliance

```text
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
```

The final implementation conforms to the approved Specs, Sensitive Design and
all four embedded Technical Implementation Contracts:

1. Foundation / Data — F1–F8;
2. Service / Domain — S1–S9;
3. Employee Transport / UI — U1–U8;
4. Integration / Regression — R1–R7.

All 32/32 tasks are complete. No applicable contract row remains failed,
partial or unevaluated. The approved 20/62 requirement/scenario mapping is
implemented and test-traced. Protected implementation bytes remained stable
through final VERIFY and QA; QA harness/oracle remediation changed no Product
source, Product test semantics, Spec, Design or DB schema. Product drift during
QA is zero.

### Requirement/scenario traceability summary

| Approved area                                                                | Implementation owners                                 | Primary verification owners                                         | Result                                                       |
| ---------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Pointage-specific continuation, self-only authority and lifecycle recheck    | `@yuta/auth`, Backoffice raw-clocking runtime/service | auth, runtime, service and actual-process suites                    | PASS                                                         |
| Immutable raw events, derived state/session, time/calendar and state machine | `@yuta/db-cloud`, raw chain and service               | schema, migration, DB integration, raw-chain/service suites         | PASS                                                         |
| Idempotency, receipt replay, unknown result and concurrency                  | repository/service transaction boundary               | DB multi-connection, lost-ack, Selector A and interaction tests     | PASS                                                         |
| Minimal employee state and manager read                                      | Backoffice service/manager/HTTP DTOs                  | manager/service/contracts/HTTP tests                                | PASS                                                         |
| Shared-device interaction and employee UI                                    | Pointage page/components/interaction controller       | interaction tests and Browser QA                                    | PASS with retained lifecycle evidence limitations below      |
| Trusted client provenance, rate limits and non-enumeration                   | injected runtime boundary and foundation limiter      | hostile admission, distributed limiter and browser/network evidence | PASS for implementation; production provider remains blocked |

## 4. Formal VERIFY

```text
VERIFY: PASS
```

Formal VERIFY was completed before QA and was not rerun during this Gate 3
preparation. Final material evidence:

- repository/static checks: PASS;
- auth: 24/24 PASS;
- contracts: 14/14 PASS;
- focused Pointage: 366 executed PASS, 0 fail; guarded cases separately
  evidenced;
- schema: 8/8 PASS;
- migration: 5/5 PASS;
- DB integration: 63/63 PASS;
- lost-ack selected evidence: PASS;
- Selector A: PASS;
- Selector B: PASS;
- full guarded service file: 125/125 PASS;
- runtime/admission: 36/36 PASS;
- distributed candidate/client rate limiting: PASS;
- interaction/recovery: 111/111 PASS;
- actual Next process/listener/admission/lifetime evidence: PASS;
- secret/PII audit: `NO_LEAK_FOUND`;
- cleanup: PASS;
- canonical cloud migration topology remains 0000–0020; test-only 0021 remains
  isolated.

`FILTERED_BY_SELECTOR` and `DECLARED_SKIP` are distinct classifications.
Selector-filtered tests are outside a selector command's requested scope and
are not counted as PASS. Declared guarded skips are also not counted as PASS;
their required behavior is supported only by separately executed evidence.

### Canonical VERIFY evidence block

Exact UTF-8/LF block SHA-256:
`e391dafc1e0c2e358344bd8e5fae7fde885107828de2d7ca40d34c8e2c391cfd`.

<!-- VERIFY_EVIDENCE_BEGIN -->

```text
VERIFY_EVIDENCE_V1
assessment_source=explicit current-user Gate 3 preparation authority; final Formal VERIFY generation; no rerun in Gate 3 preparation
technical_implementation_compliance=PASS
verify=PASS
openspec=pnpm exec openspec validate pointage-usable-raw-clocking --strict | exit=0 | PASS
static=pnpm docs:check; pnpm architecture:check; pnpm --filter @yuta/backoffice typecheck; pnpm -r --if-present typecheck; pnpm ui:pack:check backoffice-pointage-employee | exit=0 | PASS
auth=pnpm --filter @yuta/auth test test/pointage-continuation.test.ts test/pointage-credential.test.ts | 24/24 PASS
contracts=pnpm --filter @yuta/contracts test test/pointage.test.ts | 14/14 PASS
focused_pointage=C11 exact nine-file invocation | 366 executed PASS; 0 fail; guarded cases separately evidenced; filtered tests not counted as PASS
schema=pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts | 8/8 PASS
migration=pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-migration.integration.test.ts | 5/5 PASS
db_integration=pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking.integration.test.ts | 63/63 PASS
lost_ack=approved isolated selector | selected=1; passed=1; failed=0; FILTERED_BY_SELECTOR excluded from PASS
selector_a=approved isolated concurrency selector | selected=1; passed=1; failed=0; FILTERED_BY_SELECTOR excluded from PASS
selector_b=approved isolated manager-read selector | selected=1; passed=1; failed=0; FILTERED_BY_SELECTOR excluded from PASS
service_full=pnpm --filter @yuta/backoffice test test/pointage-raw-clocking-service.test.ts | 125/125 PASS; 0 fail; 0 DECLARED_SKIP
runtime_admission=approved runtime/admission suite | 36/36 PASS
distributed_rate_limit=approved distributed candidate/client limiter evidence | PASS
interaction=pnpm --filter @yuta/backoffice test test/pointage-interaction.test.ts | 111/111 PASS
actual_next_process=approved actual-Next child/listener/admission/lifetime evidence | PASS
cloud_regression=pnpm test:cloud | PASS; guarded omissions classified separately
cloud_build=pnpm build:cloud | PASS under approved non-empty poison/loopback deny-sink profile; no DB provisioning; not production enablement
secret_pii_audit=NO_LEAK_FOUND
migration_topology=canonical 0000-0020; terminal 0020_formalites_legal_template_foundation; test-only 0021 isolated
cleanup=owned clients/processes/container/listeners removed or closed | PASS
classification_rule=PASS_EXECUTED is distinct from DECLARED_SKIP and FILTERED_BY_SELECTOR; neither skipped nor selector-filtered tests are counted as PASS
```

<!-- VERIFY_EVIDENCE_END -->

The assessment source is the explicit current-user Gate 3 authority carrying
forward the final Formal VERIFY generation. Historical Apply checks alone were
not promoted into this PASS.

## 5. QA / Browser QA

```text
QA: PASS
QA stopping classification: QA_TARGETED_EVIDENCE_COMPLETE
Product FAIL: 0
```

Final targeted generation:
`6d3608c7-98fe-445a-91ef-cfe874972d62`.

Browser: Microsoft Edge `153.0.4234.48`, Playwright `1.51.1`, channel
`msedge`.

Runtime: `DEVELOPMENT_MODE_WITH_APP_SCOPED_ORACLES`.

Final targeted result: 12 PASS / 0 FAIL. The final generation proved the
remaining mandatory sequential Employee A → B, application-owned invalid
credential, keyboard-only and active long-name responsive scenarios at the
four page-pack viewports.

The complete QA report also retains successful evidence for neutral state,
application-owned no-shell oracle, credential entry/identify, CLOCK_IN,
CLOCK_OUT, receipt lifecycle, `Terminer`, navigation/reload/back-forward,
duplicate tab, unknown-result recovery, conflict, idle expiry, late response,
touch/mobile, French surface, storage and URL audits, network/cache behavior,
CSP/nonce, and employee-only role/surface boundaries. Claims are limited to
what the report and screenshots actually evidence.

### QA artifact integrity

| Artifact                                                              | Exact-byte SHA-256                                                 | Result |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| `docs/reviews/pointage-usable-raw-clocking/qa/full-browser-qa.mts`    | `9b5bb445175a37bacc7ebf1666afb6c24155388b907fdcba0bd864a92f7a5e01` | MATCH  |
| `docs/reviews/pointage-usable-raw-clocking/qa/browser-qa-oracles.mjs` | `34d2bbc977b74d597db485ccbe42bfd53e4fc0b3af432e8e837e4c41e45fb5a8` | MATCH  |
| `docs/reviews/pointage-usable-raw-clocking/qa/QA_REPORT.md`           | `8ece6035fe9a0d16c8e67064e85d6c0d8d5e777d12425dd1aaf363bd53209de2` | MATCH  |
| `docs/reviews/pointage-usable-raw-clocking/qa/screenshot-manifest.md` | `85bac3364dc0e4abc5f9336387773b50a879063d9af388cd803d5dd3fd9d3608` | MATCH  |

Screenshot inventory: 19 files / 19 manifest rows / 19 valid hashes.

`SCREENSHOT_HASH_DRIFT: 0`.

Key current-generation screenshots:

- [Invalid credential — application-owned alert](qa/targeted-invalid-credential-1440x900.png)
- [Sequential Employee B after Employee A Terminer](qa/targeted-sequential-employee-b-1440x900.png)
- [Keyboard-only committed receipt](qa/targeted-keyboard-receipt-1440x900.png)
- [Long-name desktop](qa/targeted-long-name-1440x900.png)
- [Long-name intermediate](qa/targeted-long-name-1024x768.png)
- [Long-name tablet](qa/targeted-long-name-768x1024.png)
- [Long-name mobile](qa/targeted-long-name-390x844.png)

The complete 19-image inventory, viewports, role/state, scenario and hashes are
in [screenshot-manifest.md](qa/screenshot-manifest.md). Historical and final
results are in [QA_REPORT.md](qa/QA_REPORT.md).

## 6. Material failure and resolution history

The workflow did not pass on its first attempt. Material history retained for
independent review:

1. Earlier VERIFY attempts were blocked by orchestration-generation drift,
   parse/start binding issues and insufficient current-generation evidence.
2. A selector-result classification blocker was found: tests excluded by `-t`
   are `FILTERED_BY_SELECTOR`, not `DECLARED_SKIP` and not PASS. The final
   generation used the corrected classification and completed formal VERIFY.
3. Initial Browser QA was blocked while actual Next runtime readiness was not
   established. Context-driven readiness later proved the real route and
   admission lifecycle.
4. Playwright's configured Chromium distribution was absent. An authorized
   environment recovery stalled during Chromium extraction; no fabricated
   browser evidence was accepted.
5. QA moved to the already-installed Microsoft Edge through the supported
   `msedge` channel.
6. One historical Edge generation returned `QA_FAIL` for
   `NO_APPLICATION_SHELL` because a broad `nav, aside` oracle matched a `nav`
   inside the Next.js development overlay's `nextjs-portal` shadow DOM.
7. Bounded oracle review classified this as
   `QA_ENVIRONMENT_DEV_TOOLING_ARTIFACT`, not a Product shell. No Product
   implementation was changed. The corrected application-owned oracle then
   passed.
8. Harness/oracle correction passed, but an intermediate generation remained
   `QA_BLOCKED_BY_EVIDENCE` for still-open real-browser rows.
9. The separately authorized final targeted generation completed those rows:
   12 PASS / 0 FAIL, yielding final `QA: PASS` and
   `QA_TARGETED_EVIDENCE_COMPLETE`.

This disposition does not suppress a Product failure: the false failure's
matched node ownership was identified, Product bytes remained unchanged and a
more precise application-owned oracle subsequently executed and passed.

## 7. Residual browser evidence limitations

These are `RESIDUAL_EVIDENCE_LIMITATION`, not Product failures and not
`PASS_EXECUTED` browser claims.

| Area                        | Browser evidence                               | Reason                                                                                                           | Complementary accepted evidence                                                                               | Classification                 |
| --------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Hidden/background lifecycle | `EVIDENCE_UNAVAILABLE`                         | Current Edge automation could not create a genuine hidden visibility lifecycle                                   | Executed U6 visibilitychange, hidden clearing, pagehide/pageshow and no-restoration interaction/test evidence | `RESIDUAL_EVIDENCE_LIMITATION` |
| BFCache                     | `BFCache_NOT_TRIGGERED`                        | Playwright Edge launch disables BFCache                                                                          | Executed U6 persisted false/true pagehide/pageshow handling and neutral restoration                           | `RESIDUAL_EVIDENCE_LIMITATION` |
| Absolute expiry             | `ABSOLUTE_EXPIRY_BROWSER_EVIDENCE_UNAVAILABLE` | Idle expiry occurs before an independently observable absolute-expiry browser scenario under the current harness | Fixed absolute-deadline tests, E5-ABSOLUTE actual-process evidence and interaction coverage                   | `RESIDUAL_EVIDENCE_LIMITATION` |

No browser simulation, timeout weakening or lifecycle monkey-patching was used
to convert these rows into PASS.

## 8. Security and authorization integrity

Final implementation preserves:

- a dedicated Pointage credential and Pointage-specific continuation model;
- the exact closed Pointage operation catalog and self-only employee authority;
- Personnel eligibility rechecks for identify, state read, mutation and replay;
- dedicated OWNER/MANAGER establishment authority and STAFF denial;
- no Personnel permission, generic cloud-user session or broad admin alias;
- immutable raw attendance evidence as the sole canonical attendance source;
- derived session/current state only, with no canonical session table;
- organization + establishment + dossier isolation;
- fail-closed trusted client-address provenance and distributed candidate/client
  brute-force protection;
- no plaintext credential, trusted employee context or employee identity in
  durable browser storage; and
- cloud/online-only ownership, with no POS, Site Agent, `db-pos`, local
  persistence, offline acceptance or sync authority.

No new permission, generic API, standalone credential revoke/suspend operation,
Planning/payroll authority or correction capability is inferred by Gate 3.
Trusted production client-address provenance remains a prerequisite, not an
implemented production provider.

## 9. Migration and data integrity

Canonical cloud migrations end at:

`0020_formalites_legal_template_foundation`.

The raw-clocking extension remains test-only:

`packages/db-cloud/test/fixtures/pointage-raw-clocking/0021_abandoned_black_queen.sql`.

The test-only snapshot and extension manifest remain under the same guarded
fixture directory. The production cloud schema manifest excludes raw-clocking
extension objects. Canonical development/staging/production migration topology
does not include the test-only 0021 fixture. Clean canonical, guarded extension,
upgrade and no-op evidence passed on disposable PostgreSQL only.

No real employee attendance data, persistent environment migration or
production role/provider composition was authorized or performed.

## 10. Production-policy blockers

All seven items remain `PRODUCTION_POLICY_BLOCKED`:

1. exact retention duration;
2. deletion/anonymization execution;
3. legal hold;
4. backup-retention interaction;
5. employee notice wording;
6. detailed audit visibility;
7. trusted production client-address provenance.

Therefore:

```text
QA PASS != PRODUCTION READINESS
Gate 3 approval != production activation
Real employee attendance: NOT_AUTHORIZED
Production runtime enablement: NOT_AUTHORIZED
```

The feature remains authorized only for synthetic/disposable attendance data
under the approved local/test boundary.

## 11. Final Gate 3 matrix

| Layer                               | Requirement                                                                                            | Evidence                                                                 | Result                                 | Open limitation                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | -------------------------------------- | --------------------------------------------------------- |
| Technical Implementation Compliance | F1–F8, S1–S9, U1–U8, R1–R7 and 32/32 tasks                                                             | Current tasks evidence, protected manifest, formal compliance evaluation | PASS                                   | None for implementation quality                           |
| Authorization/security              | Dedicated credential/continuation, exact operations, lifecycle recheck, STAFF denial, tenant isolation | Auth/contracts/service/runtime/hostile tests and static inventory        | PASS                                   | Production address provenance not approved                |
| DB/schema/migrations                | Immutable raw/receipt atomicity, restricted writer, guarded canonical-plus-extension topology          | 8/8 schema, 5/5 migration, 63/63 DB integration                          | PASS                                   | Test-only 0021 must stay outside canonical topology       |
| Idempotency/concurrency             | Same-ID replay, different-intent conflict, at-most-one transition, lost ACK                            | DB/service evidence, lost-ack, Selector A                                | PASS                                   | None                                                      |
| Runtime/admission                   | Dual clients, exact roles, injected provider, listener/lifetime/re-consumer                            | 36/36 runtime/admission and actual-process evidence                      | PASS                                   | No production provider                                    |
| Actual-process behavior             | Real Next handlers/listener, cache/CSP/nonce and failure/cleanup behavior                              | Actual Next process evidence plus Browser QA                             | PASS                                   | Local synthetic runtime only                              |
| Interaction/recovery                | Shared-device clearing, receipt, conflict, unknown result, stale-response isolation                    | 111/111 interaction and browser flows                                    | PASS                                   | Hidden/BFCache/absolute rows bounded below                |
| Browser functional QA               | Real employee route, identify, IN/OUT, receipt, Terminer, sequential users, recovery                   | QA report; final 12/0 targeted; 19 screenshots                           | PASS                                   | Three explicit residual lifecycle evidence limitations    |
| Accessibility/keyboard/touch        | Focus, keyboard-only, alerts/status, mobile touch                                                      | Current Edge real-route evidence                                         | PASS                                   | No claim of exhaustive assistive-technology certification |
| Responsive behavior                 | Neutral and active long-name states at 1440x900, 1024x768, 768x1024, 390x844                           | Hashed screenshot manifest and measurements                              | PASS                                   | None in tested matrix                                     |
| Browser security/storage/network    | No durable protected state, URL/token leak, unsafe cache, shell authority or CSP/nonce regression      | Storage, URL, network/cache and CSP/nonce QA                             | PASS                                   | Development runtime diagnostics classified in report      |
| Lifecycle evidence                  | Hidden/background, BFCache and absolute expiry                                                         | Genuine attempts plus U6/E5 complementary evidence                       | PASS_WITH_RESIDUAL_EVIDENCE_LIMITATION | Not browser `PASS_EXECUTED` for the three named rows      |
| Production policy                   | Seven legal/privacy/deployment prerequisites                                                           | Explicit preserved blocker inventory                                     | PRODUCTION_POLICY_BLOCKED              | All seven remain unresolved                               |

No matrix row is `FAIL`. Production-policy blockers do not become an
implementation FAIL, but they prevent production readiness and real-attendance
authorization.

## 12. Exact implementation attribution and diff integrity

The change-exclusive tracked comparison from pre-Apply baseline
`defbc50eba3952fa2e7b1c016637daf083b18c65` reports 42 files, 18,044 insertions
and one deletion. That stat intentionally excludes shared-path hunk attribution
and current untracked test-only fixture files; it is not used alone as the
implementation boundary.

The canonical attributed implementation-diff manifest below contains 54 exact
current paths. `EXCLUSIVE_PATH` paths are wholly owned by this change;
`ISOLATED_SHARED_HUNK` paths contain bounded change-owned hunks while preserving
foundation/Formalités content. It explicitly includes current untracked
test-only fixture/schema-manifest files so `git diff` cannot hide them.

Exact UTF-8/LF implementation-diff manifest SHA-256:
`4a4394734b2e6ca2d01f3f441cb26f8b656be9000a34fdd70c1416bf212a4142`.

```text
ATTDIF1
baseline_head=defbc50eba3952fa2e7b1c016637daf083b18c65
current_head=14dd0f35645586abc5877da28df0fcd16eba971d
protected_manifest=ca13b2cc30e26a1f75c9c35f206a9b0c3ffe69872699ac8bde2c67fa2ba3fdfd
apps/backoffice/src/app/api/pointage/[establishmentSlug]/clock-in/route.ts	EXCLUSIVE_PATH	29c16cfd705d7bef4b156b92ac1cad2186bf2ce17ac7fc7c9ca66f4b84444299
apps/backoffice/src/app/api/pointage/[establishmentSlug]/clock-out/route.ts	EXCLUSIVE_PATH	1c0fa864ae27a4d1f7a7940aaa8ba0d7394db3e2f1da2bff01cc1e4537218c69
apps/backoffice/src/app/api/pointage/[establishmentSlug]/context/route.ts	EXCLUSIVE_PATH	45043e139c0c7e5f0740acc7d7b9da4d0ed4d59d87dcffa8069f9a1ee1dfe2b6
apps/backoffice/src/app/api/pointage/[establishmentSlug]/end/route.ts	EXCLUSIVE_PATH	93f5428e2e700f528dbde1464a31a9d5811dfacfb5531674fb605faf978a7ae0
apps/backoffice/src/app/api/pointage/[establishmentSlug]/identify/route.ts	EXCLUSIVE_PATH	8f6504f6fbd4207e34e5f06ccca1d88b266c6a52ebd1d4232697004be7cd2be5
apps/backoffice/src/app/api/pointage/[establishmentSlug]/recover/route.ts	EXCLUSIVE_PATH	0714021059b92505345cc94886358474a3125bb832f38bb20a8ee6a47332f77e
apps/backoffice/src/app/api/pointage/[establishmentSlug]/state/route.ts	EXCLUSIVE_PATH	7d199ac7aa8a40f3e7c10614a32429c0e0ee48f49dc4c806d036e501e2cdcb5d
apps/backoffice/src/app/pointage/[establishmentSlug]/_components/pointage-active-interaction.tsx	EXCLUSIVE_PATH	c29916ab7f157959cc5a07c67d4a09dce07cc3d33503e51db98b122930b3430f
apps/backoffice/src/app/pointage/[establishmentSlug]/_components/pointage-credential-entry.tsx	EXCLUSIVE_PATH	82c2326d2f230d5de7e72a058187b1266fe822122604f45167b01b9dd8350d69
apps/backoffice/src/app/pointage/[establishmentSlug]/_components/pointage-employee.tsx	EXCLUSIVE_PATH	e6aacd7d31746ae9d8e0d5d935381620600abbddfb4ee84ce6abe11f6ab7d728
apps/backoffice/src/app/pointage/[establishmentSlug]/_lib/pointage-client.ts	EXCLUSIVE_PATH	3cfc03d51f801866f8a528f671a92a17a4b1e630e1c801c82210809cff117188
apps/backoffice/src/app/pointage/[establishmentSlug]/_lib/pointage-interaction.ts	EXCLUSIVE_PATH	8d35dc54d47120e7ed3c4f5847b0743a1f676ea59cdd07b62babbb10c2a7e105
apps/backoffice/src/app/pointage/[establishmentSlug]/page.tsx	EXCLUSIVE_PATH	8f3153a5aa08764a1a97633aceb162905e6e56fea15fa41f480dbb301bd8bd6e
apps/backoffice/src/proxy.ts	EXCLUSIVE_PATH	73b39a64d316155b7bc526a5f2dc5a1735624dbfa0a07ce2d596e53e46ce7aee
apps/backoffice/src/server/pointage/raw-chain.ts	EXCLUSIVE_PATH	0b8446a543cad544614ae7c7d366cfa771d0011d16adc7bc7d1d00405731f83c
apps/backoffice/src/server/pointage/raw-clocking-bootstrap.ts	EXCLUSIVE_PATH	17733bc004725c88a6aa506dbefdfadf7a3aa204005af2343413f5a770792e13
apps/backoffice/src/server/pointage/raw-clocking-http.ts	EXCLUSIVE_PATH	b4f57b8aeda30995f41a1a29008e9dae5c767d1e413a071488301aaae169e0ff
apps/backoffice/src/server/pointage/raw-clocking-manager.ts	EXCLUSIVE_PATH	209183808c72c1a9c677d57b2603dd5030336ad864d1ff542df1f0d06f27d948
apps/backoffice/src/server/pointage/raw-clocking-runtime.ts	EXCLUSIVE_PATH	ab9e7f157b53265ebcf62da8c7f8392018b8211c2d76e1ba467a6b2be8b53d57
apps/backoffice/src/server/pointage/raw-clocking-service.ts	EXCLUSIVE_PATH	a144202f2b7af2955b458fc445b699342bb4ed8cdbda33a4d46905452dcd3d37
apps/backoffice/src/server/pointage/raw-clocking-test-boundary.ts	EXCLUSIVE_PATH	4aa15e7f9695b85ae418b1098b7bd57c14d4c39bcd8b81eb9093660eeeb8cc28
apps/backoffice/src/server/pointage/service.ts	ISOLATED_SHARED_HUNK	00d26799bf2fa8213161e221a28fbf75b4024fd88f549293e814e90dd935aff1
apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts	EXCLUSIVE_PATH	e18841622c4f2ba5df8b72b54d387a4b093c79d344230cb685c5aa46c5a56dea
apps/backoffice/test/helpers/pointage-raw-clocking-next-child.ts	EXCLUSIVE_PATH	0a0bc64479f9a62b5135d1036a7320d18eece0dd105fa27a31703b0c293994da
apps/backoffice/test/pointage-foundation-inventory.test.ts	ISOLATED_SHARED_HUNK	1a8d4d2f026d6444de11f1afc5d47e38a4098eedbd0059e330cb78d102242daa
apps/backoffice/test/pointage-foundation.test.ts	ISOLATED_SHARED_HUNK	faed5a8899600b40f69ac0330ff16b3a7161b7619c73575a408ade831875d72b
apps/backoffice/test/pointage-interaction.test.ts	EXCLUSIVE_PATH	5203b664056fc883a36d8818f8c3f144fd50f0716fad31e2e9ed8a74f8a269b8
apps/backoffice/test/pointage-raw-chain.test.ts	EXCLUSIVE_PATH	b0fe2395ed36d944b911bafcf6dd51d20f08e3723d772189867c4f53d4a13277
apps/backoffice/test/pointage-raw-clocking-bootstrap.test.ts	EXCLUSIVE_PATH	d7fe2d0de72a4e5432c6979537ae6d6de1764f8e2ff6a1dffc848ebbf0b240f9
apps/backoffice/test/pointage-raw-clocking-http.test.ts	EXCLUSIVE_PATH	3e463e902b2e40d1fde2703c607902f5d704e32955e6f1c749b250c400623e1d
apps/backoffice/test/pointage-raw-clocking-inventory.test.ts	EXCLUSIVE_PATH	e11484f3773a4f8ab049e344b51046b3f867ee617c29424aa11699f8a52ef40a
apps/backoffice/test/pointage-raw-clocking-manager.test.ts	EXCLUSIVE_PATH	b6baba22d9e56adb42f0f9573f0066f59e59d5d697bc47dea5f318c49648ef8e
apps/backoffice/test/pointage-raw-clocking-runtime.test.ts	EXCLUSIVE_PATH	6571033fc2e98faf75951eccd19729b40de0b9db887d7b3e61952e22d9b38f47
apps/backoffice/test/pointage-raw-clocking-service.test.ts	EXCLUSIVE_PATH	6c020fea3e5db3a57a2ae611492239034e658531f3251134c6c09d097a4f868a
packages/auth/src/index.ts	ISOLATED_SHARED_HUNK	464739729900d884af3ab82159151d7df5de6a0f8ee0a3a23feed7bc285a1c2a
packages/auth/src/pointage-continuation.ts	EXCLUSIVE_PATH	f2c829c33030ae3550350ff4b5eac3d5dce774e5bd4774a5e46a0dd621465172
packages/auth/test/pointage-continuation.test.ts	EXCLUSIVE_PATH	6d9e78b745c47a96e4d59e256e67090ede1258860b140e28b6210fca57b07b4a
packages/contracts/src/index.ts	ISOLATED_SHARED_HUNK	cf72d2593fa90ffe590e2963f15160b232d069d1bf8848ec06d91946b18d95bd
packages/contracts/src/pointage/index.ts	EXCLUSIVE_PATH	2bc3d6d491ce94864c2bae22a5ce96b66e052ce131be852328b4b68c2f0ba974
packages/contracts/test/pointage.test.ts	EXCLUSIVE_PATH	4fff5b366e61c94098dc3e4238edfd4b61a2e9b5e62527465546db760f83a013
packages/db-cloud/drizzle.config.ts	EXCLUSIVE_PATH	4111bcf035b323755d3ecb69298d63504c3bf12b9643dc1d9fa76a07a73dc6a7
packages/db-cloud/src/index.ts	ISOLATED_SHARED_HUNK	b1de68581dbb366e51d5387867d0724e897edd1e52832b3d356bfbc7e6e05122
packages/db-cloud/src/pointage-raw-clocking-repository.ts	EXCLUSIVE_PATH	2c7b2f9a4d52871acd6e963ca6fb06d0bcc4f3422baffa0367f87014153b856c
packages/db-cloud/src/schema/cloud.ts	EXCLUSIVE_PATH	1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15
packages/db-cloud/src/schema/index.ts	ISOLATED_SHARED_HUNK	d9d69490b5bfb8afe7d1a4f7ebcc2293adc0a2acfc3d3da3237034de2a56a0fb
packages/db-cloud/src/schema/pointage-raw-clocking.ts	EXCLUSIVE_PATH	d19c5c84c9b3352437aa839d97b54e800211bc956d28e70445e6b1247c5e4754
packages/db-cloud/src/schema/pointage.ts	ISOLATED_SHARED_HUNK	8f4f12cf76773dfca6f99ba59e37e5ee7d0a18ef13827f78caebddd51400de29
packages/db-cloud/test/fixtures/pointage-raw-clocking/0021_abandoned_black_queen.sql	EXCLUSIVE_PATH	7794a5c02f2fa809a9985848bc455dbd3a5762415b5d96c216fb49ff4fd01ed9
packages/db-cloud/test/fixtures/pointage-raw-clocking/0021_snapshot.json	EXCLUSIVE_PATH	a6ccaa77bf4445c0336366708763ade2410ecca6faceca52db26242886fbc4bb
packages/db-cloud/test/fixtures/pointage-raw-clocking/extension.json	EXCLUSIVE_PATH	15f3e7be616bdf7ae4a8a03cbc20272bd5fe138ae5f72e1b664e9248bb985eae
packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts	EXCLUSIVE_PATH	a2dee8453e09be3794a4b0d07316d845bc85fead131d7a196af37ee47ada0d87
packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts	EXCLUSIVE_PATH	6342ecf4f6d1868f473999c500b83f41cfeacf4b98b52a21f7474d1869fe1e90
packages/db-cloud/test/pointage-raw-clocking-schema.test.ts	EXCLUSIVE_PATH	212ba98a5183dcd152352e12ac65c6c093680111b3c1e8ff56cfe839622faf42
packages/db-cloud/test/pointage-raw-clocking.integration.test.ts	EXCLUSIVE_PATH	964ad9d0ada5d5e7878cfce5dd4db117c95612736aec34e518efe16d7e8c19a5
```

Reproduction method: sort the exact path set; hash every current file's exact
bytes; emit `path<TAB>mode<TAB>lowercase-sha256` with the fixed four-line header
and final LF; hash the UTF-8/LF block. Shared hunk isolation is backed by the
approved pre-Apply byte baselines and the existing cumulative checkpoint diffs.
No unrelated dirty path is attributed to this change.

The full source patch is large; this packet includes the deterministic complete
path/hash attribution plus key functional hunk summaries rather than duplicating
18k+ lines. The reviewer may request the exact full reconstructed scoped patch
before approval.

Key reviewed hunks are: Pointage continuation primitives; raw schema/repository
and guarded test-only migration extension; reducer/service/manager/runtime;
actual-process bootstrap and HTTP handlers; route-scoped CSP/cache proxy;
employee page/interaction; strict DTOs; concurrency/lost-ack/manager/security
tests; and isolated shared exports/integration hooks.

## 13. Deviations and unresolved issues

Approved Product/Spec/Design deviation: `NONE`.

Unresolved implementation defect: `NONE`.

Unresolved evidence limitations: exactly the three Browser QA rows in section 7. They are explicitly bounded and accepted as complementary evidence in the
final QA stopping policy; they do not authorize broader browser claims.

Unresolved production issues: exactly the seven `PRODUCTION_POLICY_BLOCKED`
items in section 10.

Explicit functional non-scope remains unchanged: no manager UI, correction,
auto-close, employee history/totals, Planning reconciliation, Today integration,
HS/HC, absences, jours fériés, avantages en nature, payroll/TESE/PDF,
POS/Site Agent/offline/sync, production provider or production enablement.

## 14. Gate 3 readiness conclusion and next human decision

All Gate 3 implementation-quality prerequisites are satisfied:

- Technical Implementation Compliance: PASS;
- VERIFY: PASS;
- required Browser QA: PASS;
- Product FAIL: 0;
- Product/source drift: 0;
- residual browser evidence is explicit and bounded;
- no unresolved implementation defect; and
- all seven production blockers remain visible.

Therefore:

```text
GATE_3_READY_FOR_HUMAN_APPROVAL
```

Exact next approval required:

```text
Gate 3 final independent review approved.
Decision:
- TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
- VERIFY: PASS
- QA: PASS
- GATE 3: APPROVED
- Sync authorization: GRANTED
```

Human approval may instead request changes or withhold sync authorization.
The explicit current-user Gate 3 decision has now been received:

```text
Review status: APPROVED
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED
```

The approved finish sequence may sync and validate the exact delta Specs,
archive the change and run the required post-archive Knowledge Scan. It does
not authorize deployment, production migration, production enablement or real
employee attendance.

## 15. Finish, archive and Knowledge Scan outcome

The two exact delta Specs selected only from OpenSpec
`artifactPaths.specs.existingOutputPaths` were synced into the normative main
Specs:

- `openspec/specs/authorization/pointage/spec.md` —
  `e1a0e2414cfbb59168370edb9ef691c6ce93023662283b2b7a863a7d9dc1a6fc`;
- `openspec/specs/pointage/raw-clocking/spec.md` —
  `ac0fea1564d2b8c949d751b4f87d8b5b59a6c46b783de5889e39f5ee7e6a396d`.

The merge preserved the existing authorization Spec and added exactly the
approved seven authorization requirements. The new raw-clocking main Spec was
created from the approved Purpose and thirteen requirements. No delta-operation
header remains in a main Spec. Strict main-Spec validation passed 18/18.

The change was then archived at:

`openspec/changes/archive/2026-09-23-pointage-usable-raw-clocking`

The active change path no longer exists. All artifacts and 32/32 tasks moved
with the archive.

The mandatory post-archive Knowledge Scan found stale current-state/as-built
statements in six knowledge targets, so the result is `UPDATE_REQUIRED`.
At that scan, canonical knowledge was not edited. The initial proposal was:

`docs/reviews/pointage-usable-raw-clocking/04-knowledge-consolidation-review.md`

Initial Knowledge Review packet SHA-256 (superseded before Apply):
`277c6c64f03c6e72ecbcc8271d8973d7f6cbec49852b8fe6a52e69678f403bb8`.

```text
Knowledge consolidation: UPDATE_REQUIRED
Knowledge Review status: AWAITING_HUMAN_REVIEW
Workflow status: AWAITING_KNOWLEDGE_REVIEW
RELEASE_FOLLOW_UP: NOT_REQUIRED
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED
```

The seven production/legal/privacy blockers and three accepted Browser QA
residual evidence limitations remain unchanged. No deployment, production
migration, provider composition, real-attendance use, re-sync or re-archive was
performed or authorized.

## 16. Approved Knowledge Consolidation completion

The current-user decision approved the revised Knowledge Review packet
SHA-256 `d43a5c80f6abbb7fea174c3037e75c06b5c899f834420fd450bbdc909cfab1cc`
and proposed-diff SHA-256
`e84ea437f95e763c910261a4d0df60558d88ea8102a0298a10602f0a6ab03c13`.
Its six baseline target hashes matched. All 21 exact replacements were applied
to those six targets, including the omitted Personnel future-scope paragraph;
complete target bytes matched the expected in-memory outputs.

Post-apply SHA-256:

- `docs/PRODUCT_KNOWLEDGE.md`:
  `33c7498883a1c8405612aeedbe6e1ab906abcd096860153b1aa77a17963a3f67`;
- `docs/MODULE_REGISTRY.md`:
  `9c454d370e50e6c5950d03a9614ee14699d42640aa05e9e3bbbae6320457c764`;
- `docs/CURRENT_STATE.md`:
  `fb333c2ee1a62a6c164032b00c6f783a74cbb1ab367db73459586a2fc338bf6b`;
- `docs/features/personnel/README.md`:
  `e65055c69904b0f81c603dbf7a29ee790ba98ccb430cdf8a6f5d489028a6bae2`;
- `docs/ui/pages/backoffice-pointage-employee/README.md`:
  `17ece99411d9e0c22e79366ae1f15e0158899268128e87ba5ec56c79046e8ce0`;
- `docs/architecture/AUTHENTICATION.md`:
  `db523eb430039583ad62f378205e760e8042e4a4ef8a683d8711385149ff97a7`.

`pnpm docs:check` and `pnpm architecture:check` passed. Scoped Prettier
check-only diagnostics warned on four hash-locked Knowledge targets; no
formatter write was made. The revised packet and this Gate 3 record passed
their own scoped formatting check. Whitespace/diff integrity passed. See the
approved [Knowledge Review packet](04-knowledge-consolidation-review.md) for
the exact command outcomes and unchanged production blockers.

Completed: 2026-09-23T13:53:02Z

```text
Knowledge consolidation: UPDATE_REQUIRED / COMPLETE
Knowledge Review status: APPROVED
Workflow status: DONE
RELEASE_FOLLOW_UP: NOT_REQUIRED
Production readiness: BLOCKED
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED
```

This documentation completion does not promote any lifecycle value, resolve
the seven production/legal/privacy/provenance blockers, rerun Gate 3/VERIFY/QA,
or authorize deployment, production migration or real attendance.
