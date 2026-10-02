## 1. Foundation / Data

### Technical Implementation Contract — Phase 1

**Authority**

- Spec đã duyệt SHA-256 `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850`.
- Design đã duyệt SHA-256 `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610`, đặc biệt D1–D10, D15 và D16.
- `packages/contracts/AGENTS.md`, `packages/db-cloud/AGENTS.md` và các migration/schema hiện hành của repository.

**Scope**

- Thêm typed contracts và pure domain helpers cho đúng một `cdi_preparation` draft.
- Thêm hai bảng `formalites_personnel_drafts` và `formalites_personnel_draft_command_receipts`, full tenant/resource constraints, lifecycle checks, optimistic revision và partial unique active-draft constraint.
- Tạo đúng một migration cộng thêm và nền tảng integration test trên PostgreSQL dùng một lần; không backfill.

**Allowed paths**

- `packages/contracts/src/formalites/index.ts` (new), `packages/contracts/src/index.ts`, `packages/contracts/test/formalites.test.ts` (new).
- `packages/db-cloud/src/formalites-personnel-draft-domain.ts` (new), `packages/db-cloud/src/schema/formalites.ts` (new), `packages/db-cloud/src/schema/index.ts`, `packages/db-cloud/test/formalites-personnel-draft-domain.test.ts` (new), `packages/db-cloud/test/formalites-personnel-draft-schema.integration.test.ts` (new).
- Một migration mới theo quy tắc `packages/db-cloud/drizzle/<next-sequence>_<generated-slug>.sql`, snapshot cùng sequence và entry tương ứng trong `packages/db-cloud/drizzle/meta/_journal.json`; tên thực tế phải do `pnpm --filter @yuta/db-cloud db:generate` sinh ra và được ghi vào evidence.
- Artifact review/progress của change này.

**Forbidden paths**

- Migration cũ; Personnel schema/repository/history; Formalités authorization prerequisite; app/UI; generic prototype; seed; production configuration; module ngoài allowlist.
- Không thêm address, remuneration, departure, CDD reason, expected end date, documents, raw JSON payload, cleanup/expiry/legal-hold fields hoặc audit timeline.

**Preconditions**

- Chụp exact-byte inventory của toàn bộ allowed paths, migration journal/latest migration và bốn file prerequisite `formalites-authorization`; phân loại mọi overlap trong dirty worktree trước khi sửa.
- Xác nhận current migration head và next sequence từ repository; nếu journal hoặc export file đổi sau baseline hoặc không thể tách đúng attribution thì STOP.
- Apply Phase 1 và local/disposable migration phải được human cho phép riêng; production migration vẫn không được phép.

**Data/security invariants**

- Đúng bảy facts trong cả `draft*` và `source*`: `givenNames`, `familyName`, `position`, `qualification`, `employmentTermType`, `entryDate`, `contractWeeklyMinutes`; nullable minutes giữ `null`.
- Full `organizationId + establishmentId + employeeId` integrity; `formalityType = cdi_preparation`; status chỉ `draft | abandoned`; probation chỉ `undecided | include | exclude`.
- Một active draft tối đa cho full business scope; abandoned record không bị overwrite; revision dương; reason trim 1–250 và lifecycle reason/time nhất quán.
- Receipt chỉ chứa scope, actor, bounded command, operation-key hash, request fingerprint, resulting draft reference/revision/outcome và `createdAt`; không raw values/reason/request/IP/user-agent/`expiresAt`.
- Mutation contracts nhận một opaque operation key tối thiểu và serialization-safe: key không chứa tenant/Personnel/business data, không phải authority, không xuất hiện trong read model/UI và không được persist raw; chỉ one-way hash đi vào receipt.
- N4: giữ DRAFT/ABANDONED và receipt, không timer, purge, anonymization, hard delete, cleanup job hay keep-forever guarantee.

**Failure behavior**

- Invalid contract/schema/lifecycle/scope phải fail closed; database constraint là backstop, không được bỏ qua để thuận tiện test.
- Migration failure không được sửa migration cũ hoặc xóa dữ liệu; trước khi có durable data có thể tạo forward migration mới sau review, sau khi có data chỉ preserve-data + stop writers/roll forward.

**Required tests**

- Contract/domain: literal allowlists, exact seven facts, nullable minutes, deterministic normalized fingerprint, KEEP/REFRESH transformation, reason bounds, safe typed outcomes.
- Disposable PostgreSQL: clean migration, migration trên schema Personnel hiện có, composite establishment/employee scope FK, lifecycle checks, one-active constraint, create-after-abandon và rollback khi transaction lỗi.
- Guarded suite bị skip vì thiếu database không được tính PASS.

**Required evidence**

- Exact changed-file list, generated SQL/snapshot/journal diff, xác nhận không migration cũ nào đổi, scoped formatter, contracts/db-cloud tests và typechecks, guarded DB output với số test thực chạy.
- Before/after hashes cho overlap và authorization prerequisite; schema inspection chứng minh không field ngoài allowlist và không production operation.

**Exit criteria**

- Mọi task 1.x hoàn tất, disposable DB evidence PASS, migration review PASS, no scope drift và Phase 1 contract được đánh giá `PASS`; nếu không thì `FAIL` hoặc `BLOCKED` và STOP trước Phase 2.

- [x] 1.1 Lập pre-Apply exact-byte provenance cho allowed paths, current migration head, dirty overlaps và bốn file Formalités authorization; verify bằng manifest SHA-256 và `git diff --no-ext-diff` có attribution rõ, STOP nếu drift/overlap không tách được.
- [x] 1.2 Tạo `@yuta/contracts/formalites` với schemas/types serialization-safe cho formality type, lifecycle, ba probation choices, seven-fact values, per-fact KEEP/REFRESH commands, read states, mutation outcomes và opaque technical operation-key input tối thiểu; verify malformed/missing key bị từ chối khi applicable và read models không expose raw key/hash/receipt internals.
- [x] 1.3 Tạo pure domain helper chuẩn hóa/so sánh đúng bảy facts, tạo `sourceStateFingerprint`, derive divergence và áp dụng KEEP/REFRESH mà không ghi Personnel; verify bằng unit tests cho null, unchanged source, mixed choices, changed-again source và fingerprint ổn định.
- [x] 1.4 Thêm schema `formalites_personnel_drafts` với typed dual snapshots, full scope, lifecycle/probation/revision/reason/time checks, composite tenant/resource FKs và partial unique active-draft index; verify bằng schema inspection và focused schema tests.
- [x] 1.5 Thêm schema `formalites_personnel_draft_command_receipts` với đúng bounded technical fields và scoped uniqueness/FKs; verify rằng schema/test không có raw Personnel values, abandonment reason, request dump, network metadata, expiry hoặc cleanup marker.
- [x] 1.6 Sinh đúng một additive Drizzle migration và snapshot từ current candidate, không backfill và không sửa migration cũ; verify exact SQL tạo hai bảng/constraints/indexes và migration history trước đó byte-identical.
- [x] 1.7 Chạy migration trên database dùng một lần ở cả clean state và state đã có Personnel data, rồi verify composite scope, lifecycle, one-active, create-after-abandon và transaction rollback bằng test thực chạy, không chấp nhận suite skipped.
- [x] 1.8 Chạy contracts/db-cloud focused tests, typechecks, architecture/docs checks và scoped Prettier; lập Phase 1 evidence report gồm exact commands/results, migration inventory, protected hashes và contract verdict rồi STOP cho human review.

## 2. Service / Domain

### Technical Implementation Contract — Phase 2

**Authority**

- Spec đã duyệt và Design D5–D13, D16; Phase 1 contract/evidence phải PASS và còn current.
- Existing `formalites.read` / `formalites.manage`, Personnel read permission và trusted tenant/session conventions là prerequisite bất biến.

**Scope**

- Thêm scoped repository và Backoffice server actions cho READ/REOPEN, CREATE, SAVE/EDIT, RECONCILE và ABANDON.
- Thực thi eligibility, source comparison, reconciliation acknowledgement, optimistic concurrency, replay receipts và typed safe outcomes theo một transaction.

**Allowed paths**

- `packages/db-cloud/src/formalites-personnel-draft-repository.ts` (new), `packages/db-cloud/src/index.ts` (bounded export only), `packages/db-cloud/test/formalites-personnel-draft-repository.integration.test.ts` (new).
- `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/actions.ts` (new), `apps/backoffice/test/formalites-persistent-draft-actions.test.ts` (new).
- Phase 1 contract/domain/schema files chỉ khi một lỗi trực tiếp trong Phase 1 được chứng minh và human review cho phép; artifact review/progress của change này.

**Forbidden paths**

- `apps/backoffice/src/server/auth/formalites.ts`, `apps/backoffice/src/server/auth/permissions.ts`, session/tenant packages, Personnel repository/schema/history, generic prototype/routes, UI components, navigation, dev gate, production configuration và mọi module bị loại trừ.

**Preconditions**

- Phase 1 PASS; migration đã chỉ chạy trên disposable/local environment; exact-byte baseline mới cho `packages/db-cloud/src/index.ts` vì file này có concurrent work.
- Bốn authorization implementation hashes và semantic tests MATCH; nếu cần sửa grant/helper hoặc Personnel semantics thì STOP về review.

**Data/security invariants**

- Browser IDs chỉ là references; repository luôn dùng trusted organization + establishment + employee + draft scope và không tiết lộ wrong-scope existence.
- READ/REOPEN yêu cầu `formalites.read` và Personnel READ khi đọc source; mọi mutation yêu cầu `formalites.manage`, thêm Personnel READ nơi source/eligibility cần thiết.
- Canonical lock order duy nhất: CREATE `PERSONNEL → insert draft`; SAVE/EDIT/RECONCILE `PERSONNEL → FORMALITES DRAFT`; ABANDON chỉ lock Formalités draft.
- Server re-derive current CDI eligibility, exact divergences và source values; browser không tạo authority hoặc supply Personnel truth.
- Draft mutation + receipt cùng commit/rollback; no Personnel writes/history/receipts; no silent last-write-wins hoặc half-reconciliation.
- Một logical mutation dùng đúng một opaque operation key. Retry sau response loss hoặc recoverable uncertainty phải reuse key đó; deliberate mutation mới phải dùng key mới. Repository/action hash key, lookup receipt và so normalized request fingerprint; key/hash không tạo authority.

**Failure behavior**

- Invalid one-field reconciliation, stale source/draft, non-CDI, active conflict, replay conflict hoặc transaction fault phải giữ prior persisted draft nguyên vẹn và không tạo receipt/effect dở dang.
- Same key + same normalized logical mutation trả committed outcome một lần; same key + materially different payload trả `replay_conflict`; different key đi qua lại toàn bộ auth/eligibility/revision/conflict rules như mutation mới.
- Authorization giữ nguyên actual trusted-stack semantics: thiếu/invalid authenticated user đi qua login redirect; invalid/missing membership hoặc invalid authenticated tenant scope đi qua current recovery/fail-closed path; thiếu establishment trả `ESTABLISHMENT_REQUIRED`/400; authenticated caller thiếu requested Formalités operation nhận permission denial/403. Public/service/system roles không bypass nhưng không bị ép thành universal 403 nếu trusted stack dừng sớm hơn.
- Missing scoped resource vẫn fail closed không disclosure; action chỉ trả safe typed business errors, không raw row/key/hash/tenant/actor/stack.

**Required tests**

- Real disposable PostgreSQL cho all commands, full scope denial, CREATE race, save/save, save/abandon, stale editor/source, response-loss replay/different payload, rollback injection, mixed reconciliation và both serial orders của CDI→CDD race.
- Authorization/action tests giữ đúng từng nhánh hiện có: no valid user → login redirect; invalid/missing membership hoặc invalid tenant scope → current recovery/fail-closed behavior; missing establishment → exact 400; authenticated OWNER allow; authenticated membership thiếu operation (MANAGER/STAFF) → exact 403; public/service/system roles không bypass ở bất kỳ nhánh nào; browser claims ignored; Formalités và Personnel permissions độc lập.

**Required evidence**

- Exact SQL transaction/lock evidence, tests thực chạy, row-count/snapshot chứng minh no Personnel write/history/receipt, safe action payload inspection, existing auth hashes và regression suites.
- Guarded DB suite skipped không được tính PASS.

**Exit criteria**

- Tất cả task 2.x PASS, atomicity/concurrency/security matrices đầy đủ, không auth/grant/Personnel drift; Phase 2 verdict `PASS` rồi STOP trước UI.

- [x] 2.1 Tạo scoped repository READ/REOPEN và CREATE với current Personnel row lock, exact CDI eligibility, coherent dual snapshot và partial-unique conflict mapping; verify real DB tests cho eligible/ineligible, wrong scope, concurrent create và create-after-abandon.
- [x] 2.2 Tạo SAVE/EDIT với Personnel-first lock, current eligibility revalidation, expected draft revision và atomic receipt; verify UNDECIDED/INCLUDE/EXCLUDE, save/save, stale editor, CDI→CDD both serial orders và injected rollback giữ persisted draft nguyên vẹn.
- [x] 2.3 Tạo RECONCILE server-derived per divergent fact với exact presented fingerprint, KEEP/REFRESH, complete-choice validation và coherent source acknowledgement; verify mixed choices, unchanged-source no-reprompt, changed-again divergence, missing/extra/duplicate choices và stale source không ghi gì.
- [x] 2.4 Tạo ABANDON draft-only transaction với expected revision, trimmed 1–250 reason, lifecycle immutability và receipt; verify non-CDI abandon, save/abandon race, abandoned mutation rejection và reason/time constraint.
- [x] 2.5 Hoàn thiện command receipt orchestration: action/repository nhận bounded opaque operation key, persist chỉ one-way hash, lookup theo approved scope/actor/command/hash và so normalized fingerprint; verify same key + same mutation phục hồi đúng một committed effect, same key + different payload trả `replay_conflict`, different key là mutation mới chịu current rules, response-loss retry không tăng revision lần hai và rollback không để lại receipt.
- [x] 2.6 Tạo server actions dùng `requireFormalitesTenant` và independent Personnel READ, parse mọi untrusted input bằng contracts và map safe typed outcomes; verify actual trusted-context composition bằng mocked infrastructure boundaries gồm login redirect, scope recovery/fail-closed, establishment 400 và permission 403 đúng nơi hiện hữu, không ép public/service/system-role thành universal 403 và không dùng prebuilt/browser tenant.
- [x] 2.7 Chạy full repository integration matrix cho tenant/cross-establishment denial, all races/rollbacks, no Personnel writes/history/command receipts và canonical lock order; verify suite thực chạy trên disposable PostgreSQL và ghi exact pass counts.
- [x] 2.8 Chạy focused auth/action/db-cloud tests, contracts/db-cloud/Backoffice typechecks, docs/architecture và scoped Prettier; lập Phase 2 evidence report với protected hashes, exact results và contract verdict rồi STOP cho human review.

## 3. UI / Components

### Technical Implementation Contract — Phase 3

**Authority**

- Spec đã duyệt, Design D13–D16, Phase 1–2 contracts PASS và current Backoffice/page-pack rules.

**Scope**

- Mở rộng đúng employee-connected route `/equipe/formalites-personnel/[employeeId]` thành persistent draft workspace bằng existing server actions/read models.
- Cung cấp French UI cho create, save/reopen, reconciliation, ineligible recovery, abandon và recoverable interaction states.

**Allowed paths**

- Existing: `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/page.tsx`, `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-connected-read-model.ts`, `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-connected-read-prototype.tsx`.
- New: `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace.tsx`, `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-state.ts`.
- Tests: `apps/backoffice/test/formalites-persistent-draft-component.test.tsx` và `apps/backoffice/test/formalites-persistent-draft-state.test.ts` (new); Phase 2 action test chỉ bổ sung khi direct interaction gap được chứng minh.
- Artifact review/progress của change này.

**Forbidden paths**

- Generic `/equipe/formalites-personnel/page.tsx`, `cdi-draft-prototype.ts`, `cdi-draft-readiness-prototype.tsx`, development gate runtime, navigation, Personnel UI, shared `@yuta/ui`, auth/grants, schema/migrations, production config.
- Không UI address/remuneration, legal advice, PDF/template/signature/provider, scheduled/autosave, hard delete hoặc production enablement.

**Preconditions**

- Phase 2 typed APIs/outcomes stable và PASS; existing generic prototype/dev-gate files có exact-byte baseline.
- Nếu UX cần sửa shared modal/select primitive hoặc route/navigation gate thì STOP cho review, không tự mở rộng scope.

**Data/security invariants**

- UI chỉ render safe typed model, phân biệt rõ `Valeur du brouillon` và `Valeur actuelle du dossier salarié`; không render tenant/actor IDs, fingerprints, operation hashes, revisions nội bộ hay raw rows.
- Browser metadata không quyết định source facts, eligibility, divergence hoặc permission; all successful views được reload từ authoritative server state.
- Generic fictional prototype và existing dev gate giữ nguyên; route không production-enable.
- Client tạo một opaque operation key cho một logical mutation và giữ nguyên key qua pending, response loss hoặc retry khi commit status chưa rõ. Success hoặc deliberate mutation mới kết thúc operation cũ và tạo key mới; key/hash không render hoặc trở thành Product-visible field.

**Failure behavior**

- Validation/stale/replay/server error giữ unsaved input và relevant choices, không reset form hoặc báo partial success.
- Pending khóa accidental double-submit mà không tạo logical command/key thứ hai; recoverable retry giữ key hiện tại, còn deliberate new mutation dùng key mới. Conflict yêu cầu reload/recovery rõ ràng; dirty close bảo vệ thao tác chưa lưu.
- Sau success reload authoritative draft/current source; abandoned state read-only; ineligible recovery chỉ cho xem/reconcile info phù hợp và abandon theo Spec.

**Required tests**

- Component/state/action interaction: no draft, editable, saved/reopened, reconciliation required, ineligible recovery, abandoned; all probation states; KEEP/REFRESH/mixed; validation/stale/replay/server errors; pending/double-submit; same-key retry; new-mutation new-key; dirty close; focus/keyboard.
- Assert absence của operation key/hash, address/remuneration/legal claim/raw internals và generic prototype/dev gate non-regression.

**Required evidence**

- Focused test output, semantic/accessibility assertions, route render model, exact shared UI changes (expected NONE), protected prototype hashes và screenshot-free component evidence.
- Browser QA chưa chạy ở Phase 3.

**Exit criteria**

- Tất cả task 3.x PASS ở component/model level, không overflow issue rõ từ structure, shared UI/auth/schema untouched, contract verdict `PASS`; STOP trước final Integration/Regression.

- [x] 3.1 Mở rộng employee-connected server route để dùng development gate, `formalites.read`, independent Personnel READ và scoped persistent read model; verify OWNER states render đúng, denied/wrong-scope không tải/leak data và generic route bytes không đổi.
- [x] 3.2 Tạo workspace/client state cho explicit Create và one-submit Save của `probationChoice` gồm UNDECIDED/INCLUDE/EXCLUDE, tạo đúng một opaque operation key cho mỗi logical mutation và giữ key qua pending/uncertain retry; verify saved/reopened values, accidental double-submit không tạo command/key thứ hai, success hoặc deliberate mutation mới dùng key mới và không autosave.
- [x] 3.3 Render reconciliation per server-derived divergent fact với draft/current labels và KEEP/REFRESH/mixed controls; verify stale source, missing choices, unchanged-source no-reprompt và later Personnel change tạo episode mới.
- [x] 3.4 Render ineligible recovery, abandoned read-only và Abandon dialog với reason 1–250; verify non-CDI chặn normal edit/save/refresh/create mới nhưng vẫn cho read/reopen/abandon theo bounded behavior.
- [x] 3.5 Hoàn thiện recoverable validation, stale draft, replay conflict, generic server error, same-key retry khi commit status chưa rõ, deliberate-new-mutation new-key lifecycle, dirty-close, focus recovery, keyboard và responsive layout; verify input không mất, accidental double-submit không tạo duplicate effect và success reload model.
- [x] 3.6 Chạy focused component/state/action tests cho toàn bộ states/interactions và operation-key lifecycle, assert French labels, accessible names, visible focus hooks, operation key/hash không render, no raw internals/address/remuneration/legal claim và prototype/dev-gate non-regression.
- [x] 3.7 Chạy Backoffice test/typecheck/build, docs/architecture và scoped Prettier; lập Phase 3 evidence report gồm exact UI file inventory, shared UI changes `NONE`, protected hashes và contract verdict rồi STOP cho human review, chưa Browser QA.

## 4. Integration / Regression

### Technical Implementation Contract — Phase 4

**Authority**

- Toàn bộ approved Proposal, Analysis, 22 Requirements/70 Scenarios, D1–D16 và Phase 1–3 contracts/evidence.
- Current YUTA Verify, QA và Gate 3 workflow; phase này không cấp sync/archive/release authority.

**Scope**

- Hoàn tất real disposable-db integration, regression, scoped documentation, Technical Compliance/VERIFY và mandatory real-route Browser QA.
- Chỉ chuẩn bị Gate 3 khi Technical Implementation Compliance, VERIFY và QA đều PASS độc lập.

**Allowed paths**

- Implementation/test paths đã được duyệt ở Phase 1–3 chỉ để sửa defect trực tiếp được evidence phát hiện, với exact attribution và rerun affected phase contract.
- Stable page pack tối thiểu: `docs/ui/pages/backoffice-equipe-formalites-personnel/README.md`, `PRODUCT_SCOPE.md`, `DATA_AND_INTERACTION_SPEC.md`, `UI_SPEC.md`, `ACCEPTANCE_CHECKLIST.md` khi cần phản ánh as-built behavior, không promote production/readiness.
- `docs/reviews/formalites-persistent-draft-foundation/03-final-review.md`, `03-integrity.json`, `03-implementation.diff`, `QA_REPORT.md`, `screenshot-manifest.md` và screenshot directory/files theo current QA protocol.
- `openspec/changes/formalites-persistent-draft-foundation/tasks.md` chỉ cập nhật checkbox/progress sau evidence thực; không sửa approved requirements/design.

**Forbidden paths**

- Canonical main specs, archive, Product/Module Registry/CURRENT_STATE knowledge trước finish workflow; unrelated modules; production env/deploy/migration/route flag; cleanup/retention/legal-hold mechanism.
- Không sửa auth grants, Personnel behavior/history, generic prototype, shared UI hoặc migration cũ để làm test PASS.

**Preconditions**

- Phase 1–3 human-approved PASS; exact current implementation manifest và protected prerequisite/prototype hashes MATCH.
- Disposable PostgreSQL, authenticated local OWNER và safe synthetic data available; nếu required DB/Browser evidence unavailable thì VERIFY/QA phải BLOCKED và không chuẩn bị Gate 3.

**Data/security invariants**

- Full tenant isolation, independent permissions, Personnel ownership/no-write, canonical lock order, dual snapshots, typed safe UI và N4 bounded behavior giữ nguyên trong mọi end-to-end path.
- Route vẫn development-only; local QA không tạo production enablement/readiness.

**Failure behavior**

- Một required test/viewport/state thiếu hoặc skipped là BLOCKED/FAIL, không suy diễn PASS.
- Defect sửa trong allowlist phải được quy về owning phase, cập nhật exact diff/evidence và rerun required affected checks; scope conflict hoặc new Product decision phải STOP.
- Rollback preserve-data + stop writers/roll forward; không drop tables/records hoặc chạy production command.

**Required tests**

- Full DB/concurrency/security matrix của Phase 1–2, regression auth/Personnel history/prototype/dev gate/navigation/tenancy, all package/repository checks.
- Real authenticated Browser QA tại 1440/1024/768/390 cho create, all probation choices, reload, KEEP/REFRESH/mixed, non-CDI recovery, abandon/read-only, validation/stale/replay/server errors, actual login/recovery/permission-denial states where safely reachable, repeat-submit no-duplicate evidence, loading/success, dirty close, keyboard/focus, responsive/no overflow.

**Required evidence**

- Technical Compliance Matrix: Requirement → Design → task → implementation → executable evidence → PASS/FAIL/BLOCKED.
- Separate Technical Implementation Compliance, VERIFY và QA outcomes; exact commands/results/skips; scoped diff/migration review; screenshot hashes/manifest; aggregate implementation hash.

**Exit criteria**

- Chỉ khi ba verdict đều PASS, 100% tasks complete và no drift/blocker mới tạo Gate 3 `AWAITING_HUMAN_REVIEW`, `Sync authorization: PENDING`, rồi STOP; không sync/archive/deploy.

- [x] 4.1 Chạy full disposable PostgreSQL suite cho clean/existing migration, all constraints, CRUD/reconciliation/replay/rollback/concurrency/CDI→CDD both orders/full-scope denial/no-Personnel-write; verify không test required nào skipped và lưu exact database evidence.
- [x] 4.2 Chạy regression cho formalites authorization, Personnel permissions/history, connected Personnel reads, generic Formalités prototype, development gate, Backoffice route/navigation và tenancy; verify login redirect, membership/scope recovery/fail-closed, establishment 400, permission 403 và no-bypass semantics vẫn đúng theo current auth stack, cùng protected hashes không đổi ngoài approved consumer path.
- [x] 4.3 Chạy contracts/db-cloud/Backoffice focused tests và typechecks, Backoffice build, `pnpm docs:check`, `pnpm architecture:check`, validated Next type bootstrap + recursive typecheck, strict OpenSpec validation, scoped Prettier và truthful `pnpm format:check`; report mọi unrelated/pre-existing failure, không sửa ngoài scope.
- [x] 4.4 Cập nhật tối thiểu stable Formalités Personnel page pack theo as-built local behavior, vẫn ghi route development-only và production deferred; verify docs/architecture checks và không promote Environment/Product/Production Readiness.
- [x] 4.5 Lập Technical Compliance Matrix đủ 22 Requirements và D1–D16, phase-contract matrix, scoped implementation inventory/diff, migration review và production/N4 exclusion audit; verify mọi row applicable có executable evidence.
- [x] 4.6 Chạy real Browser QA trên `/equipe/formalites-personnel/[employeeId]` bằng synthetic local data ở 1440/1024/768/390 cho required states/interactions/accessibility/responsive; verify repeat-submit/retry không tạo duplicate effect nơi tái hiện an toàn, actual login/recovery/permission denial không bị diễn giải sai, operation key/hash và raw internals không xuất hiện; tạo QA report, screenshots, manifest và SHA-256 hashes.
- [x] 4.7 Đánh giá riêng `TECHNICAL IMPLEMENTATION COMPLIANCE`, `VERIFY` và `QA`; nếu bất kỳ verdict không PASS thì STOP với exact blocker, không chuẩn bị Gate 3.
- [x] 4.8 Nếu và chỉ nếu 4.7 đều PASS, regenerate exact integrity/change hash và Gate 3 packet ở `AWAITING_HUMAN_REVIEW`, `Sync authorization: PENDING`; verify không sync, archive, production migration, route enablement hay deploy rồi STOP cho human review.

## Dependency order and rollout boundary

`Phase 1 → human review → Phase 2 → human review → Phase 3 → human review → Phase 4 → Gate 3 human review`.

- LOCAL / DEVELOPMENT APPLY: chỉ được thực hiện sau một phê duyệt Apply riêng cho từng phase.
- PRODUCTION MIGRATION: `NOT_AUTHORIZED`.
- PRODUCTION ROUTE ENABLEMENT: `NOT_AUTHORIZED`.
- PRODUCTION DEPLOYMENT: `NOT_AUTHORIZED`.
- Không task nào chạy production command, backfill prototype/fixture hoặc tự động cleanup/expiry/anonymization.
