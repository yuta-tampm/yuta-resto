# Tasks + Implementation Plan Review

Change: `reputation-review-social-links-configuration`

Gate: `Tasks / Pre-Apply`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-06T14:26:40+02:00`

Created: `2026-09-05T20:44:49.1656183+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `YES`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES`

Tasks: `APPROVED`

Implementation Plan: `APPROVED`

Technical Implementation Contract: `APPROVED`

Apply: `NOT_AUTHORIZED`

Production: `NOT_AUTHORIZED`

## Approved authority and exact integrity

| Artifact                                                                                                                   | SHA-256                                                            | Status                                           |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `openspec/changes/reputation-review-social-links-configuration/proposal.md`                                                | `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61` | Gate 1 approved                                  |
| `openspec/changes/reputation-review-social-links-configuration/analysis.md`                                                | `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d` | Gate 1 approved                                  |
| `openspec/changes/reputation-review-social-links-configuration/specs/reputation/review-social-links-configuration/spec.md` | `ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07` | Gate 2 approved; 15 Requirements / 103 Scenarios |
| `openspec/changes/reputation-review-social-links-configuration/design.md`                                                  | `3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582` | Sensitive Design approved; D1–D16, SD-R1/SD-R2   |
| `docs/reviews/reputation-review-social-links-configuration/02b-design-review.md`                                           | `c267b2d9b58458c87e4844cd8fce8547d245f9ce2b5984353bdcd57953c3526f` | `APPROVED` metadata recorded                     |
| `openspec/changes/reputation-review-social-links-configuration/tasks.md`                                                   | `b7ae379fbbad0b9d9011f712177aa373bce4901fe278cb88e5483d1fddd065ce` | 33 unchecked tasks; awaiting review              |

Hashes are lowercase SHA-256 of exact formatted file bytes. Proposal, Analysis,
Spec and Design match the exact approved values supplied by the current user.

## Selected implementation phases

| Phase                       | Purpose                                                                                                   | Required stop                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1. Foundation / Data        | Shared typed Reputation contracts, one exact provider policy, safe private/public transport models        | Human Phase 1 review before db-cloud Apply                              |
| 2. Service / Domain         | Scoped db-cloud read/Save, audit-marker token, D1/D2/ABA, nullable actor, atomicity and public projection | Human Phase 2 review before UI authority work                           |
| 3. UI / Components          | Page-pack authority, then current Backoffice route and minimal feedback-web rendering                     | Separate `PAGE_PACK_APPROVED_BEFORE_UI_CODE`, then human Phase 3 review |
| 4. Integration / Regression | Full cross-boundary evidence, Technical Compliance, VERIFY and required Browser QA                        | Gate 3 only when Compliance/VERIFY/QA independently PASS                |

Interaction/states are intentionally included in Phase 3 because they belong to
the same route-local component/action boundary. No schema/migration or
production phase is created.

## Requirement and scenario coverage

|   # | Approved Requirement                                                         | Scenarios | Primary tasks                           | Final evidence    |
| --: | ---------------------------------------------------------------------------- | --------: | --------------------------------------- | ----------------- |
|   1 | Reputation sở hữu cấu hình theo trusted organization và active establishment |         8 | 2.1–2.6, 3.5, 3.9                       | 4.1–4.3, 4.6–4.7  |
|   2 | Settings dùng authority Reputation hiện hành và chỉ OWNER được truy cập      |         5 | 3.5, 3.8                                | 4.2, 4.6–4.7      |
|   3 | Capability chỉ quản lý đúng ba giá trị nullable                              |         3 | 1.2–1.4, 2.4                            | 4.1, 4.3, 4.6     |
|   4 | Thay đổi chỉ xảy ra qua một explicit Save                                    |         8 | 1.3, 2.4, 3.5–3.7                       | 4.1–4.2, 4.7      |
|   5 | Save nhiều field là all-or-nothing                                           |         3 | 2.4, 2.8, 3.6                           | 4.1, 4.6–4.7      |
|   6 | Normalized no-op không ghi và success trả authoritative state                |         3 | 1.2–1.3, 2.4–2.5, 3.6–3.7               | 4.1, 4.6–4.7      |
|   7 | Stale conflict và response-loss replay phải recoverable                      |         6 | 1.3, 2.3–2.5, 3.6–3.8                   | 4.1, 4.6–4.7      |
|   8 | Mọi provider URL tuân thủ normalization và safety chung                      |        12 | 1.2, 1.4–1.5, 2.6                       | 4.1, 4.3, 4.6–4.7 |
|   9 | Google URL chỉ chấp nhận destination phục vụ review hoặc Maps                |        17 | 1.2, 1.5                                | 4.1, 4.6–4.7      |
|  10 | Facebook URL có bounded provider-host policy                                 |         8 | 1.2, 1.5                                | 4.1, 4.6–4.7      |
|  11 | Instagram URL có bounded provider-host policy                                |         6 | 1.2, 1.5                                | 4.1, 4.6–4.7      |
|  12 | Google review URL là manual-only và độc lập GBP connector                    |         5 | 2.7, 3.5–3.9                            | 4.3, 4.6–4.7      |
|  13 | feedback-web chỉ render safe configured CTA theo trusted public scope        |         7 | 1.4, 2.6, 3.9                           | 4.3, 4.6–4.7      |
|  14 | Real mutation và SETTINGS audit phải thành công hoặc thất bại cùng nhau      |         8 | 2.2–2.5, 2.8                            | 4.1, 4.6          |
|  15 | Capability không mở rộng sang provider workflow hoặc production operation    |         4 | All phase contracts and stop conditions | 4.3–4.8           |

Total coverage: `15 Requirements / 103 Scenarios`. Scenario groups are mapped
to implementation-sized test matrices rather than 103 duplicate one-line tasks.

## Design D1–D16 coverage

| Design decision                        | Planned tasks                       | Acceptance focus                                                            |
| -------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| D1 Ownership/runtime                   | 1.2–1.4, 2.2–2.6, 3.5, 3.9          | Reputation contracts/db-cloud/private/public boundaries only                |
| D2 Shared provider policy              | 1.2, 1.4–1.5, 2.6, 2.7              | One exact pure policy, no wildcard/network/provider registry                |
| D3 Private read/missing row            | 1.3, 2.2, 3.5–3.6                   | Trusted scoped read; unavailable without synthesis                          |
| D4 Actor-independent state token       | 1.3, 2.3, 2.8                       | Exact canonical tuple; actor excluded; no persistent token                  |
| D5 Transaction/decision table          | 2.4, 2.8, 3.6–3.7                   | Row lock, A/B/C/D1/D2/ABA/M, no partial write                               |
| D6 Exact replay proof                  | 2.5, 2.8                            | Positive same-current-actor proof only; no request-id invention             |
| D7 ABA and append-only invariant       | 2.3, 2.7–2.8                        | Token detects intact history; static guard catches new runtime purge/writer |
| D8 Strict minimal audit                | 2.3–2.5, 2.8                        | One `.v1` SETTINGS event; strict ordered delta; new mutation records actor  |
| D9 Safe transport outcomes             | 1.3, 3.5–3.8                        | Auth errors distinct; no IDs/token/audit internals in UI                    |
| D10 Public safe projection             | 1.4, 2.6, 3.9                       | Invalid legacy links hidden without mutation/fallback                       |
| D11 Existing Satisfaction UI           | 3.1–3.10                            | No new route/navigation; OWNER section; inbox preserved                     |
| D12 Page-pack prerequisite             | 3.1–3.4                             | Explicit human gate before any Backoffice UI code                           |
| D13 Layered tests and QA               | 1.5–1.6, 2.7–2.9, 3.8–3.10, 4.1–4.7 | Contracts, real DB, auth, components, builds and browser evidence           |
| D14 Audit integrity/retention boundary | 2.3, 2.7, 4.1, 4.3                  | No purge/keep-forever; unsupported total deletion not falsely detectable    |
| D15 Connector independence             | 2.7, 3.9, 4.3                       | GBP/OAuth/location never writes Google review URL                           |
| D16 No migration/roll-forward boundary | Every phase contract, 4.3–4.8       | Schema/journal diff blocks; no production operation                         |

## Sensitive corrections coverage

| Sensitive correction                                     | Tasks/evidence              | Result required                                                                                                                      |
| -------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| SD-R1 — total-history deletion and append-only integrity | 2.3, 2.7–2.8, 4.1, 4.3, 4.6 | `BASELINE_NO_EVENT`, valid, malformed/ambiguous and unsupported total deletion remain distinct; current append-only inventory proven |
| SD-R2 — nullable actor                                   | 2.3, 2.5, 2.8, 4.1, 4.6     | Actor current/different/null remains valid marker; only positive current actor may prove D1; real FK nullification evidence          |

Audit marker append-only invariant: `PROVEN` and protected by a planned static
inventory guard plus executable transaction tests.

Nullable actor: `VALID_STATE_MARKER / NOT_REPLAY_ATTRIBUTION`.

## Technical Implementation Contract review

| Contract area     | Binding plan                                                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ownership         | Reputation remains owner; contracts define transport/policy, db-cloud owns persistence, Backoffice owns private UI/action, feedback-web consumes safe public projection |
| Trusted scope     | Every private repository access uses server-derived organization + active establishment; browser claims never create authority                                          |
| Authorization     | Settings requires existing `reputation.settings.manage`; no grant/helper change planned                                                                                 |
| Missing row       | `CONFIGURATION_UNAVAILABLE`; create/upsert/default/provision forbidden                                                                                                  |
| Provider policy   | One shared pure policy referencing exact approved Spec/Design allowlist; no wildcard or network verification                                                            |
| State token       | Fixed domain/version + settings identity + latest qualified event ID/null + three values; actor excluded; token not authority                                           |
| Qualified audit   | Exact `.v1` action, scope/entity/establishment/ordered deltas/previous-new reconstruction strict; actor affects D1 attribution only                                     |
| D1/D2/ABA         | D1 needs positive same-current-actor predecessor proof; otherwise same desired state is D2; intact marker changes prevent ABA overwrite                                 |
| Append-only       | No qualified runtime update/delete/purge path; discovery of one is an immediate STOP                                                                                    |
| Atomicity/audit   | One settings update + exactly one audit; every non-real-mutation outcome has no audit                                                                                   |
| Public/GBP        | Invalid legacy public URL hidden only; no DB cleanup; GBP connector does not derive/write link                                                                          |
| Schema/production | No schema/migration; no production provisioning, retention, mutation, enablement or deployment                                                                          |

Each phase embeds its own allowed areas, invariants, commands, evidence, exit
criteria and stop conditions. Apply requires a separate current-user approval
naming the exact phase.

## Page-pack-before-UI gate

`PAGE_PACK_APPROVED_BEFORE_UI_CODE` is mandatory:

1. Tasks 3.1–3.4 create/complete/validate the revision-4 `EXISTING_PAGE` pack
   and capture an authenticated baseline.
2. Phase 3 stops for human review.
3. Tasks 3.5–3.10 cannot start until exact page-pack bytes and handoff are
   explicitly approved.

The planning run did not create the pack because the current workflow does not
require it before Tasks and the user expressly prohibited creating it now.

## Real PostgreSQL and failure-injection plan

- Disposable PostgreSQL is mandatory for row locks, concurrency, rollback,
  audit ordering, D1/D2/ABA and actor FK nullification.
- Test-only temporary database trigger/function injection will force settings
  update and audit insert failures without production hooks or migration files.
- A skipped guarded suite is `BLOCKED`, not PASS.
- Actor evidence deletes only a disposable test user in fixture-safe order and
  verifies the existing `ON DELETE SET NULL` behavior.

## Static integrity guards

The plan adds focused inventory checks for:

- any second writer to the three URL columns;
- any runtime update/delete/purge of qualified Reputation audit markers;
- any GBP connector write to `googleReviewUrl`;
- any migration/schema change attributed to this change;
- wildcard provider hosts or separate private/public policies.

Static inventory does not substitute for executable PostgreSQL, authorization,
contract or Browser QA evidence.

## Browser QA obligation

Mandatory final QA uses the real authenticated local route with safe local data
at 1440, 1024, 768 and 390 px. It covers all approved form states, conflict and
unavailable recovery, keyboard/focus/accessibility/no-overflow, no internal
token/ID leakage, MANAGER/STAFF inbox-without-settings behavior, and public
configured/hidden CTA states. Gate 3 requires `QA_REPORT.md`, screenshot
manifest and exact screenshot SHA-256 values.

## Expected implementation inventory and current overlap

| Area                   | Expected paths                                                                                         | Planning status                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Contracts              | `packages/contracts/src/reputation/index.ts`; new `packages/contracts/test/reputation.test.ts`         | Existing source clean; test absent                                                                                          |
| db-cloud private       | New `packages/db-cloud/src/reputation-review-social-links.ts`; new focused integration/inventory tests | New paths absent                                                                                                            |
| db-cloud public/export | `packages/db-cloud/src/reputation-repository.ts`; `packages/db-cloud/src/index.ts`                     | Repository source clean; `src/index.ts` already dirty from unrelated/concurrent work and requires exact attribution or STOP |
| Backoffice             | Existing Satisfaction `page.tsx`; new route-local action/component/lib and focused tests               | Existing route clean; new paths absent                                                                                      |
| feedback-web           | Existing tenant page/feedback form only as needed                                                      | Existing paths clean at planning; concurrent trusted-boundary change must be reconciled before edit                         |
| Page pack              | `docs/ui/pages/backoffice-visibilite-reputation-satisfaction/**`                                       | Absent; created only in approved Phase 3A                                                                                   |

Planning HEAD provenance:
`07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

No implementation path was modified by this Tasks step.

## Planned existing commands

| Area         | Commands                                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contracts    | `pnpm --filter @yuta/contracts test`; `pnpm --filter @yuta/contracts typecheck`                                                                                                             |
| db-cloud     | `pnpm --filter @yuta/db-cloud test`; `pnpm --filter @yuta/db-cloud typecheck`; focused guarded Vitest with `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true` and disposable `CLOUD_DATABASE_URL` |
| Backoffice   | `pnpm --filter @yuta/backoffice test`; `pnpm --filter @yuta/backoffice typecheck`; final `pnpm --filter @yuta/backoffice build`                                                             |
| feedback-web | `pnpm --filter @yuta/feedback-web typecheck`; final `pnpm --filter @yuta/feedback-web build`                                                                                                |
| Page pack    | `pnpm ui:pack:new backoffice-visibilite-reputation-satisfaction`; `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction`                                                        |
| Repository   | `pnpm typegen:next`; `pnpm -r --if-present typecheck`; `pnpm docs:check`; `pnpm architecture:check`; `pnpm format:check`; scoped Prettier; strict OpenSpec validation                       |

feedback-web currently has no package-local test script, and the repository has
no lint command. The plan does not invent or claim either command.

## Planning validation

| Check                         | Result                                                                                                                                                                                                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tasks/review scoped Prettier  | `PASS` — all three planning/review files match Prettier style                                                                                                                                                                                                               |
| Strict OpenSpec validation    | `PASS` — change is valid                                                                                                                                                                                                                                                    |
| Documentation consistency     | `PASS` — 36 current documents consistent                                                                                                                                                                                                                                    |
| Architecture check            | `PASS` — runtime/import/database/migration boundaries valid                                                                                                                                                                                                                 |
| Recursive workspace typecheck | `PASS` — exit 0; all 15 invoked workspace projects completed                                                                                                                                                                                                                |
| Next type generation attempt  | `BLOCKED_BY_LIVE_DEV_LOCK` — Backoffice `.next/dev/lock` exists; no app was stopped. This is not required to validate planning bytes, and current generated state allowed recursive typecheck to pass. Apply must run generation from an exclusive checkout where required. |
| Tasks count                   | 33 unchecked / 0 checked                                                                                                                                                                                                                                                    |

No test, build, database operation or Browser QA is claimed for this
planning-only step. The typecheck result above is repository validation, not
implementation evidence.

## Scope confirmation

- No application, contract, test, schema, migration or page-pack implementation
  was created.
- Proposal, Analysis, Spec and Design bytes remain unchanged.
- Only Design approval metadata, `tasks.md` and this planning review packet are
  attributable to the current workflow step.
- Schema/migration: `NOT_REQUIRED`.
- Apply and production remain `NOT_AUTHORIZED`.

## Human review required

Review the 33-task Implementation Plan and four embedded Technical
Implementation Contracts. Explicit Phase 1 Apply authorization is required to
start implementation; approval of this packet alone must name that phase and
does not authorize any production operation.
