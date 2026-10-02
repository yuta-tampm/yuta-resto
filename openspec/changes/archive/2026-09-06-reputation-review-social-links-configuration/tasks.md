## Implementation Plan

Change: `reputation-review-social-links-configuration`

Classification: `CROSS_MODULE`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES`

Approved authority:

- Proposal SHA-256: `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61`
- Analysis SHA-256: `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d`
- Spec SHA-256: `ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07` — 15 Requirements / 103 Scenarios
- Design SHA-256: `3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582` — D1–D16, SD-R1 và SD-R2
- Sensitive Design approval packet SHA-256: `c267b2d9b58458c87e4844cd8fce8547d245f9ce2b5984353bdcd57953c3526f`

Kế hoạch chỉ chuẩn bị implementation local/disposable sau từng phê duyệt riêng.
Không task nào authorize production, provisioning settings row, schema,
migration, retention cleanup hoặc deployment.

## 1. Foundation / Data — Contracts and Provider Policy

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 1

**Authority**

- Approved Spec Requirements 3, 6, 8–13 và Design D1–D2, D8–D10, D15–D16.
- Root `AGENTS.md`, `packages/contracts/package.json` và current contract conventions; không có nested `packages/contracts/AGENTS.md` trong current repository.

**Scope and owner**

- Reputation tiếp tục sở hữu semantic của ba link; `@yuta/contracts/reputation` sở hữu serialization-safe schemas/types và pure provider policy dùng chung.
- Chuẩn hóa đúng ba nullable values, exact approved host/path rules, typed private read/Save/outcomes và public safe projection.
- Không schema, migration, provider registry, network lookup, redirect following hoặc generic social-link engine.

**Likely allowed paths**

- `packages/contracts/src/reputation/index.ts`.
- `packages/contracts/test/reputation.test.ts` (new).
- Bounded export file chỉ khi current package structure thực sự yêu cầu; nếu cần một path ngoài inventory này thì STOP và cập nhật review trước Apply.
- Review/progress evidence của change này.

**Invariants**

- Policy là một pure implementation cho private validation và public safe projection; không được tạo hai allowlist độc lập.
- Trim outer whitespace; blank → `null`; giới hạn 2048 application string units; exact HTTPS; không username/password; exact hosts/paths theo approved Spec/Design; không semantic URL rewrite.
- Private payload chứa đúng expected/proposed three-value slice và opaque state token; extra tenant, role, permission, provider hoặc settings fields fail closed.
- State token là transport evidence, không phải authority; raw settings/audit IDs không xuất hiện trong public/UI contract.

**Required evidence and commands**

- Exhaustive provider matrix: Google/Facebook/Instagram accepted/rejected hosts, paths, HTTP, credentials, malformed/lookalike/generic shortener, trim/blank/null và 2048 boundary.
- `pnpm --filter @yuta/contracts test`.
- `pnpm --filter @yuta/contracts typecheck`.
- Scoped Prettier trên attributed files.

**Stop conditions**

- Cần wildcard host, provider call, redirect verification, new dependency/framework, browser tenant authority hoặc schema/migration.
- Shared private/public policy không thể dùng cùng pure implementation.

- [x] 1.1 Chụp pre-Apply exact-byte/hash inventory cho contract paths, package exports, approved artifacts và mọi intended path; verify không có overlap không thể tách, nếu có drift hoặc cần path ngoài contract thì STOP trước khi sửa.
- [x] 1.2 Mở rộng `@yuta/contracts/reputation` với đúng ba nullable URL schemas và một pure provider policy theo D2; verify exhaustive positive/negative matrix cho exact Google/Facebook/Instagram host/path, trim/blank/null, 2048, HTTPS, credentials, malformed, lookalike và shortener.
- [x] 1.3 Thêm typed private read model, strict Save input, expected/proposed values, opaque 64-hex state token và discriminated safe outcomes theo D3/D9; verify extra tenant/role/permission/internal-ID keys bị reject và serialization không lộ persistence internals.
- [x] 1.4 Thêm public safe-projection helper dùng chính policy của task 1.2; verify invalid legacy value trở thành `null` độc lập theo provider, không network call, redirect-follow, mutation hoặc URL rewrite.
- [x] 1.5 Hoàn thiện focused contract tests trace toàn bộ Requirements 3, 6, 8–13 và verify private/public policy không thể drift qua separate allowlists.
- [x] 1.6 Chạy contract test/typecheck và scoped formatting, lập Phase 1 evidence với exact files/hashes/results và đánh giá Technical Implementation Contract `PASS / FAIL / BLOCKED`; STOP cho human review, không tự bắt đầu Phase 2.

## 2. Service / Domain — db-cloud and Trusted Operations

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 2

**Authority**

- Approved Spec, Design D1, D3–D10, D14–D16, SD-R1 và SD-R2; Phase 1 phải `PASS` và còn current.
- Root `AGENTS.md`, `packages/db-cloud/AGENTS.md`, current cloud tenancy/database architecture, schema và Reputation repository conventions.

**Scope and owner**

- `@yuta/db-cloud` sở hữu scoped private read, strict audit-marker reconstruction, derived state token, locked Save transaction, SETTINGS audit và public safe projection.
- Reuse existing `reputation_settings` và `reputation_audit_events`; không thay schema, migration hoặc provisioning.

**Likely allowed paths**

- `packages/db-cloud/src/reputation-review-social-links.ts` (new bounded repository/domain operation).
- `packages/db-cloud/src/reputation-repository.ts` (public safe projection only).
- `packages/db-cloud/src/index.ts` (bounded export only; current unrelated dirty preimage phải được hash và phần attributable phải tách chính xác).
- `packages/db-cloud/test/reputation-review-social-links.integration.test.ts` (new).
- `packages/db-cloud/test/reputation-review-social-links-inventory.test.ts` (new static inventory guard) hoặc cùng focused test file nếu repository conventions ưu tiên một file.
- Review/progress evidence của change này.

**Trusted scope and authorization boundary**

- Repository nhận trusted `organizationId + establishmentId`; lookup settings hoặc audit bằng resource ID đơn lẻ bị cấm.
- Browser scope/role/permission không tạo authority. Application layer phải authorize `reputation.settings.manage` trước mutation parsing; Phase 2 không sửa grant map.
- Missing exact row → `CONFIGURATION_UNAVAILABLE`; không create/upsert/default/brandVoice/publicFeedbackSlug/audit.

**State-token and audit invariants**

- Canonical token chỉ gồm fixed domain/version marker, internal settings-row identity, latest qualified audit event ID hoặc `null`, và ba authoritative URL values; actor không nằm trong token.
- Qualified event phải strict scope, `SETTINGS`, settings entity ID, exact `settings.review-social-links.updated.v1`, establishment metadata, ordered unique deltas, accepted previous/new values và reconstructable transition.
- `actorUserId` current/different/`null` đều có thể là valid marker. D1 chỉ khi positive same-current-actor proof + exact predecessor transition; nếu current equals proposed mà không có D1 proof thì D2 `NO_CHANGE`.
- Malformed/ambiguous/mismatched observable evidence → `SERVER_ERROR`, no write/audit. Total external deletion không được claim detectable.
- Current supported lifecycle phải không có runtime update/delete/purge cho qualified events; phát hiện path mới là STOP.

**Atomicity and failure injection**

- Real mutation: một scoped settings update + đúng một mutation-level SETTINGS audit trong cùng row-lock transaction; no-op/invalid/conflict/missing/failure không audit.
- Settings/audit timestamps và predecessor ordering theo Design; `updatedAt` không phải revision authority.
- Failure evidence dùng disposable PostgreSQL test-only fault injection, ví dụ temporary trigger/function trong isolated test database để ép settings update hoặc audit insert fail; không thêm production hook, migration hoặc persistent test artifact.
- Actor nullification phải dùng real FK: tạo qualified event với active actor, xóa test user theo fixture-safe order, verify `ON DELETE SET NULL` và giữ marker/token validity.

**Required evidence and commands**

- Guarded real PostgreSQL suite chỉ PASS khi test thực chạy với `CLOUD_DATABASE_URL` và `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`; skipped suite là `BLOCKED`.
- `pnpm --filter @yuta/db-cloud test`.
- `pnpm --filter @yuta/db-cloud typecheck`.
- Focused integration invocation qua existing Vitest binary, scoped Prettier, docs/architecture checks khi imports/boundaries đổi.

**Stop conditions**

- Cần new writer, schema/migration, persistent token, request/receipt table, permission change, cleanup/purge, unsupported actor assumption hoặc unisolatable overlap ở `packages/db-cloud/src/index.ts`.
- Real PostgreSQL concurrency/rollback/nullable-actor evidence bị skip hoặc environment không sẵn sàng.

- [x] 2.1 Chụp Phase 2 preimage/hashes, đặc biệt dirty `packages/db-cloud/src/index.ts`, schema/migration journal và Reputation writers; verify export addition có attributable diff riêng, nếu không tách được thì STOP.
- [x] 2.2 Implement scoped private read trong short `REPEATABLE READ` snapshot theo D3: exact row + two newest qualified markers, `CONFIGURATION_UNAVAILABLE` khi thiếu row và generic `SERVER_ERROR` cho observable malformed/ambiguous evidence; verify no synthesis/cross-scope read.
- [x] 2.3 Implement strict qualified-event parser/state classification và actor-independent SHA-256 token theo D4/D7/D8/SD-R1/SD-R2; verify baseline, valid marker, malformed/ambiguous marker, ABA và token không đổi khi actor bị FK-nullify.
- [x] 2.4 Implement scoped `SELECT ... FOR UPDATE` Save transaction và D5 decision table gồm success, no-op, conflict, ABA, missing row, rollback và exactly-one versioned SETTINGS audit; verify chỉ ba link + `updatedAt` được write và không field Reputation khác đổi.
- [x] 2.5 Implement D6 replay attribution: same active actor + exact predecessor cho D1, different actor và nullable actor không được D1 và dùng D2 khi current equals proposed; verify subsequent normal authorized mutation vẫn chạy sau actor nullification.
- [x] 2.6 Apply shared safe projection vào existing public Reputation read; verify unsafe legacy URL chỉ thành `null`, existing trusted org/establishment + missing-row behavior giữ nguyên và không stored-data cleanup.
- [x] 2.7 Thêm static inventory guard phát hiện second writer, qualified-audit runtime update/delete/purge, GBP write vào `googleReviewUrl`, schema/migration addition và private/public policy divergence; verify guard chỉ bảo vệ inventory, không thay thế executable transaction tests.
- [x] 2.8 Chạy real disposable-PostgreSQL matrix cho normal/multi-provider mutation, one audit, no-op, missing row, invalid/transaction faults, concurrent writers, stale conflict, D1/D2, materially different retry, ABA, malformed/ambiguous evidence và real actor-FK nullification; ghi row snapshots/counts chứng minh rollback và không production data.
- [x] 2.9 Chạy db-cloud tests/typecheck, contracts regression, docs/architecture và scoped formatting; lập Phase 2 evidence với exact results/static guard/protected schema hashes và verdict `PASS / FAIL / BLOCKED`; STOP cho human review, không tự bắt đầu Phase 3.

## 3. UI / Components — Page Authority, Backoffice and Public Rendering

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 3

**Authority**

- Approved Spec, Design D1–D3, D9–D13, D15–D16; Phase 1–2 phải `PASS` và current.
- Root/app `AGENTS.md`, `docs/ui/PAGE_PACK_PROTOCOL.md` revision 4, shared YUTA/Backoffice UI rules, `@yuta/ui` exports và current route behavior.

**Scope and owner**

- Phase 3A tạo stable page authority cho existing Satisfaction route và phải được human duyệt trước mọi Backoffice UI code.
- Phase 3B mở rộng đúng `/visibilite-reputation/satisfaction` bằng OWNER-only settings section và trusted server action; không route/navigation/grant mới.
- Phase 3C chỉ harden public CTA rendering bằng safe projection đã có; không đổi tenant resolution hoặc provider behavior.
- Interaction/state work được gộp vào phase này vì thuộc cùng route-local component ownership; không tạo phase rỗng riêng.

**Likely allowed paths after the page-pack gate**

- `docs/ui/pages/backoffice-visibilite-reputation-satisfaction/**` theo exact protocol structure.
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx`.
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/actions.ts` (new).
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings.tsx` (new).
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state.ts` (new, nếu extraction có ích).
- `apps/backoffice/test/reputation-review-social-links-actions.test.ts` (new).
- `apps/backoffice/test/reputation-review-social-links-component.test.tsx` (new).
- `apps/feedback-web/src/app/[tenantSlug]/page.tsx` chỉ nếu typed projection consumption cần adjustment.
- `apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx` cho exact safe links/attributes.
- Review/progress evidence của change này.

**UI and security invariants**

- OWNER-only model load/action qua existing trusted auth helpers; MANAGER/STAFF giữ inbox hiện có nhưng không nhận settings model/section.
- Server authorize trước khi parse browser mutation; browser org/establishment/role/permission không tạo authority. Auth errors giữ existing semantics; capability outcomes không che auth errors.
- Một explicit Save cho whole slice; không autosave, partial Save, implicit provisioning hoặc provider/OAuth UI.
- States: loading, empty, populated, dirty, invalid, saving, saved/no-change, server error/retry, conflict/reload và `Configuration indisponible`; recoverable failures giữ draft.
- Không render state token, internal IDs, audit metadata hoặc rejected credential.
- Reuse current `@yuta/ui`; nếu cần sửa shared primitive, navigation, auth/grant hoặc route structure thì STOP.
- Public chỉ render accepted non-null CTA với exact `target="_blank"` và `rel="noopener noreferrer"`; missing row/notFound và trusted public scope giữ nguyên.

**Required evidence and commands**

- Page pack: `pnpm ui:pack:new backoffice-visibilite-reputation-satisfaction`, sau đó `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction`.
- Backoffice: `pnpm --filter @yuta/backoffice test`, `pnpm --filter @yuta/backoffice typecheck`.
- feedback-web không có package-local test script hiện tại; plan dùng contract/db-cloud executable tests, `pnpm --filter @yuta/feedback-web typecheck`, final build và Browser QA thay vì invent lint/test claim.
- Scoped Prettier; Browser QA chưa chạy trong phase này.

**Stop conditions**

- `PAGE_PACK_APPROVED_BEFORE_UI_CODE` chưa được human phê duyệt.
- Auth/grant/schema/route/navigation/shared UI change mới; concurrent `feedback-public-trusted-boundary-hardening` drift không thể reconcile; current inbox hoặc public trusted scope phải đổi.

### Phase 3A — Stable page-pack prerequisite

- [x] 3.1 Tạo pack `backoffice-visibilite-reputation-satisfaction` bằng current generator và verify đúng protocol revision 4, `EXISTING_PAGE`, đủ file/prompts/provenance, không tạo UI code.
- [x] 3.2 Chạy read-only Phase 0 inventory cho route hiện có, shared shell/auth/data/actions/tests và capture authenticated current baseline với safe local data; nếu app/session không khả dụng thì ghi `Baseline status: BLOCKED` và STOP thay vì giả lập ảnh.
- [x] 3.3 Hoàn thiện Product/UI/Data/Interaction/Design Handoff/Acceptance documents, current prompt snapshots và design prompt grounded in approved Spec/Design; verify không invent route, navigation, permission, schema, provider workflow hoặc business logic.
- [x] 3.4 Chạy `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction`, lập page-pack evidence và STOP tại `PAGE_PACK_APPROVED_BEFORE_UI_CODE`; không đánh dấu gate hoàn tất hoặc viết Phase 3B code trước explicit human approval.

### PAGE_PACK_APPROVED_BEFORE_UI_CODE

Phase 3B/3C bị khóa cho đến khi current user phê duyệt exact page-pack bytes và
visual/design handoff. Page-pack approval không tự authorize production hoặc
shared UI changes.

### Phase 3B — Backoffice UI and server action

- [x] 3.5 Sau page-pack approval, implement OWNER-only trusted settings load và server action trên route Satisfaction hiện có; verify authorization chạy trước mutation parse, missing-row/auth/capability outcomes tách biệt và MANAGER/STAFF vẫn dùng inbox không settings data.
- [x] 3.6 Implement ba field và one explicit Save theo approved visual authority, gồm empty/populated/dirty/invalid/saving/saved/no-change/server-error/conflict/unavailable; verify no autosave/partial/provisioning/internal-token leakage.
- [x] 3.7 Implement recoverable client interaction: pending/double-submit protection, authoritative response baseline, reload after conflict, retry giữ draft, keyboard/focus/visible errors và responsive conditional layout; verify không sửa shared modal/select/UI primitive.
- [x] 3.8 Thêm focused action/component/model tests cho auth-before-parse, browser claims ignored, all states, validation, success/no-op/conflict/retry/unavailable, MANAGER/STAFF absence, current inbox preservation và accessibility semantics.

### Phase 3C — feedback-web minimal safe rendering

- [x] 3.9 Revalidate shared-file hashes và reconcile current `feedback-public-trusted-boundary-hardening` artifacts trước edit; consume shared safe projection và render chỉ accepted CTA với exact external-link attributes, giữ trusted tenant/missing-row behavior và không cleanup/provider call/fallback.
- [x] 3.10 Chạy Backoffice tests/typecheck, feedback-web typecheck, page-pack check, contracts/db-cloud regressions cần thiết và scoped formatting; lập Phase 3 evidence với shared-file attribution và verdict `PASS / FAIL / BLOCKED`; STOP cho human review, chưa chạy final Browser QA và không tự bắt đầu Phase 4.

## 4. Integration / Regression — Compliance, VERIFY and QA

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 4

**Authority**

- Toàn bộ approved Proposal/Analysis/15 Requirements/103 Scenarios/Design D1–D16/SD-R1/SD-R2, accepted page pack và Phase 1–3 contracts/evidence.
- Current `openspec-verify-change`, `docs/YUTA_QA_PROTOCOL.md`, repository validation scripts và application build commands.

**Scope**

- Chỉ hoàn tất cross-boundary regression, Technical Compliance Matrix, VERIFY và mandatory Browser QA; sửa technical defect chỉ trong approved behavior rồi rerun affected evidence.
- Không deploy, production mutation/provisioning, schema/migration, retention operation hoặc lifecycle promotion.

**Required executable evidence**

- Contracts/provider exhaustive matrix; real disposable PostgreSQL for atomicity/concurrency/D1/D2/ABA/failure injection/nullable actor; trusted authorization/tenancy tests; public safe projection; static writer/purge/GBP/no-schema guards.
- Full relevant package tests/typechecks/builds; strict OpenSpec, docs, architecture và formatting disposition reported truthfully.
- Technical Compliance Matrix maps every applicable phase contract and each Requirement/Design decision to implementation + executable evidence.

**Browser QA contract**

- Real authenticated local OWNER route with safe synthetic/local data at 1440, 1024, 768 và 390 px.
- Cover empty, populated, dirty, invalid, saving, saved/no-change, server error, conflict/reload, unavailable, keyboard/focus/basic accessibility/no overflow/no ID-token leak.
- Verify MANAGER/STAFF keep usable inbox without settings section; public feedback configured and hidden CTA states; screenshots, manifest và SHA-256 required.
- Environment block → `QA: BLOCKED_BY_ENVIRONMENT`; không chuẩn bị ready Gate 3.

**Exact current commands planned**

- `pnpm typegen:next` trước Next-app typechecks/builds.
- `pnpm --filter @yuta/contracts test` và `typecheck`.
- `pnpm --filter @yuta/db-cloud test` và `typecheck`; guarded focused PostgreSQL invocation với existing Vitest + approved env gate.
- `pnpm --filter @yuta/backoffice test`, `typecheck`, `build`.
- `pnpm --filter @yuta/feedback-web typecheck`, `build`.
- `pnpm -r --if-present typecheck`, `pnpm docs:check`, `pnpm architecture:check`, `pnpm format:check`, scoped Prettier, `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction` và `pnpm exec openspec validate reputation-review-social-links-configuration --strict`.
- Không có lint command hoặc feedback-web test command để claim; không invent chúng.

**Stop conditions**

- Bất kỳ required DB/Browser QA evidence `FAIL/BLOCKED`, unapproved scope drift, page-pack drift, second writer/purge path, auth/schema/migration/provider change, concurrent shared-file conflict hoặc non-reproducible scoped diff.
- Gate 3 chỉ được tạo khi `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`, `VERIFY: PASS`, `QA: PASS` độc lập.

- [x] 4.1 Chạy complete contract + disposable-PostgreSQL matrix cho provider policy, baseline, real/multi-provider mutation, exactly-one audit, no-op, missing row, faults/rollback, concurrency, stale conflict, D1/D2, different retry, ABA, malformed/ambiguous evidence, actor FK nullification và subsequent authorized mutation; verify không suite skipped.
- [x] 4.2 Chạy trusted authorization/tenancy matrix: OWNER allow, MANAGER/STAFF no settings access, browser claims ignored, wrong/missing establishment fail closed, auth failure không bị map thành missing row và cross-scope không disclosure.
- [x] 4.3 Chạy public/regression/static evidence cho accepted/hidden CTAs, exact link attributes, trusted public scope, existing inbox, GBP/OAuth/location không ghi Google URL, không Facebook/Instagram connector, không second writer, không qualified-audit purge, không schema/migration và không excluded runtime/module writes.
- [x] 4.4 Chạy current full relevant tests/typegen/typechecks/builds, strict OpenSpec, UI pack, docs/architecture, `git diff --check`, repository format check và scoped Prettier; report exact results, kể cả unrelated/pre-existing failure, không sửa ngoài scope.
- [x] 4.5 Cập nhật stable page pack và current Reputation knowledge chỉ theo as-built approved behavior; verify không promote Environment/Production Readiness, không invent provisioning/retention/provider authority và không sửa unrelated docs.
- [x] 4.6 Tạo Technical Compliance Matrix: Requirement → Design/SD decision → phase contract/task → implementation path → executable evidence → `PASS / FAIL / BLOCKED`; chạy current verify workflow và ghi riêng `TECHNICAL IMPLEMENTATION COMPLIANCE` với `VERIFY`.
- [x] 4.7 Chạy mandatory Browser QA trên real local OWNER route tại 1440/1024/768/390 cùng MANAGER/STAFF và public CTA states; tạo `qa/QA_REPORT.md`, `qa/screenshot-manifest.md`, screenshots + exact SHA-256, chỉ ghi `QA: PASS` khi mọi required state/accessibility/overflow/leak check hoàn tất.
- [x] 4.8 Nếu và chỉ nếu compliance/VERIFY/QA đều PASS, tạo Gate 3 packet với exact scoped implementation diff/hash, verify evidence hash, page-pack/QA links, all artifacts/hashes và `Sync authorization: PENDING`; STOP cho human Gate 3 review, không sync/archive/deploy.

## Pre-Apply candidate and production boundary

- Current HEAD provenance tại planning: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- `packages/db-cloud/src/index.ts` đang modified bởi concurrent/unrelated work;
  Phase 2 phải hash current preimage và chứng minh bounded export attribution,
  nếu không thì STOP.
- Existing likely contract, Reputation repository, Satisfaction route và
  feedback-web render paths không có scoped Git modification tại planning;
  chúng vẫn phải được rechecked ngay trước từng Apply phase.
- `feedback-public-trusted-boundary-hardening` đang ở planning trước Tasks; mọi
  shared-file drift sau planning phải reconcile, không overwrite.
- Schema/migration: `NOT_REQUIRED`; mọi schema/journal/migration diff là blocker.
- Settings-row provisioning, audit cleanup/retention, external provider calls,
  production migration, production data mutation, route enablement và deploy:
  `NOT_AUTHORIZED`.
