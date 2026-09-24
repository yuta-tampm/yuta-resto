# Product Release Identity — Tasks / phased implementation plan

Change: `product-version-management-foundation`  
Schema: `yuta-spec-driven`  
Planning state: Tasks/TIC prepared; `APPLY: NOT AUTHORIZED`; mọi checkbox còn mở.  
`UI_AFFECTING: YES`  
`BROWSER_QA_REQUIRED: YES`  
Sensitive Design Gate: `NOT_TRIGGERED` theo Design hiện hành.

Provenance phải được kiểm lại trước Apply: Gate 1 packet `docs/reviews/product-version-management-foundation/01-analysis-review.md` SHA-256 `fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564`; Gate 2 packet `docs/reviews/product-version-management-foundation/02-specs-review.md` SHA-256 `3d18c72596a250e6ae85a1f75b54ef2f5b0c164a0c2333903cc8f32ede9c25a7`; approved delta Spec `specs/product-release/identity/spec.md` SHA-256 `bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d` (7 requirements/21 scenarios); Design `design.md` SHA-256 `e930bdddf01d0bf7b18490d915df9c5b81c2381e4a32b85827b4f40de8e3408c`. Approved Proposal/Analysis và historical Gate 1 `BLOCKED_NEEDS_REVIEW`, Gate 2 `AWAITING_HUMAN_REVIEW` packets giữ nguyên; Tasks không thay Product Decision, lifecycle hoặc approval nào.

Trước Apply, ghi lại `git status --short`, HEAD, hash và scoped diff của mọi intended file. Baseline lúc lập kế hoạch: `packages/core/src/index.ts`, hai footer source files và `docs/README.md` sạch; `packages/core/src/product-release.ts`, `packages/core/test/product-release.test.ts`, `apps/backoffice/test/product-release-footer.test.tsx`, `docs/features/product-release/README.md` chưa có. `docs/PRODUCT_KNOWLEDGE.md` và `docs/MODULE_REGISTRY.md` đã dirty do công việc khác; không đụng hai file này trước khi có isolated checkout hoặc phương án bảo toàn/attribution có thể kiểm chứng. Toàn bộ target khác cũng phải được kiểm tra lại ngay trước Apply. Nếu không tách được diff hiện hữu, dừng thay vì ghi đè hoặc gán công việc khác cho change này.

## 1. Service / Domain — Core Product Release foundation

- [x] 1.1 Tạo `packages/core/src/product-release.ts` với `PRODUCT_MATURITY_STAGES`, union `ProductMaturityStage` và mapping exhaustive sáu public labels đúng Spec; xác nhận bằng typecheck và test từng stage, gồm `GENERAL_AVAILABILITY → Stable`, đồng thời test stage lạ bị từ chối tại runtime boundary.
- [x] 1.2 Định nghĩa readonly `ProductRelease` chỉ có `product`, `maturityStage`, `version`, `releaseName` và một `CURRENT_YUTA_PRODUCT_RELEASE` chứa `YUTA` / `ALPHA` / `0.1.0-alpha.1` / `Foundation`; xác nhận test field set không có release ID hoặc label lặp, và package manifest versions không bị sửa.
- [x] 1.3 Thêm `isValidProductVersion` và `parseProductRelease` theo chính xác grammar đã duyệt, nhận `unknown` ở parser và từ chối stage/metadata không hợp lệ; xác nhận test mọi valid/invalid case của 7 requirement/21 scenario, gồm `v`, leading zero, thiếu thành phần, prerelease lỗi, `+build` và independence của `beta.1` với hai Beta stages.
- [x] 1.4 Thêm `getProductMaturityLabel`, `formatProductRelease`, `formatCompactProductRelease` thuần, validation trước khi format; xác nhận test literal expected độc lập cho full `YUTA Alpha · v0.1.0-alpha.1`, compact `Alpha · v0.1.0-alpha.1`, và invalid input không tạo nhãn fallback.
- [x] 1.5 Chỉ export public API được Design liệt kê qua `packages/core/src/index.ts`; xác nhận `pnpm --filter @yuta/core typecheck` và review import graph: không có DB, framework, environment, provider, I/O hoặc helper nội bộ được export không cần thiết.
- [x] 1.6 Hoàn tất `packages/core/test/product-release.test.ts` với các case trên và expected values độc lập; xác nhận `pnpm --filter @yuta/core test` PASS cho module mới, không dùng package version hay capability status làm input/authority.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 1

- Boundary/owner: pure Product Release domain API; `@yuta/core` là owner duy nhất của current record, closed stage type, labels, validation và formatting. Không có data/runtime owner mới.
- Authority: root `AGENTS.md`, `packages/core/AGENTS.md`, `docs/AUTHORITY_MODEL.md`, `docs/LIFECYCLE_STATUS_MODEL.md`, approved Proposal/Analysis/Gate 1/Spec/Design, `packages/core/package.json` và current Core source/tests.
- Constraints: TypeScript strict/named exports; đúng sáu stages/labels; chỉ bốn metadata fields, không ID; canonical version không có `v`/build metadata; no stage inference; reject unsupported stage, không fallback; release name độc lập; package versions không đổi. Core không DB, API, tenant, auth, environment, clock, network, filesystem, provider hoặc hidden state. Public API chỉ những tên trong Design; helper validation nội bộ không export khi không cần.
- Intended files: `packages/core/src/product-release.ts`, `packages/core/src/index.ts`, `packages/core/test/product-release.test.ts`.
- Targeted checks (`REQUIRED_FOR_PHASE`): `pnpm --filter @yuta/core test`, `pnpm --filter @yuta/core typecheck`, scoped import/source review. `pnpm architecture:check` bắt buộc khi export/import graph đổi.
- Completion evidence: tests của tất cả cases Spec và current metadata, exact command results, Core API/source diff, no forbidden dependency/import.

## 2. UI / Components — Public Web consumer

- [x] 2.1 Trong `apps/web/src/components/marketing/MarketingShell.tsx`, import `CURRENT_YUTA_PRODUCT_RELEASE` và `formatProductRelease` từ `@yuta/core`, thay chỉ `Projet pilote` bằng derived full representation tại `MarketingFooter`; xác nhận scoped source diff không còn wording cũ ở footer và không thêm hardcoded release literal.
- [x] 2.2 Giữ `· Déployé sur Vercel`, © và footer groups/layout hiện có; xác nhận diff chỉ thay approved product wording/import, trừ điều chỉnh kỹ thuật tối thiểu có bằng chứng cụ thể.
- [x] 2.3 Giữ `MarketingFooter` trên Server Component path, không thêm `'use client'`/fetch/provider; xác nhận `pnpm --filter @yuta/web typecheck`, `pnpm --filter @yuta/web build` và `pnpm architecture:check` sau prerequisite Next typegen; Browser QA ở Phase 6 xác nhận render thực.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 2

- Boundary/owner: Web public presentation tại marketing footer; Core sở hữu semantic text, app sở hữu placement/copy phụ trợ.
- Authority: root `AGENTS.md`, `apps/web/AGENTS.md`, `docs/features/public-website/README.md`, `docs/ui/README.md`, `docs/ui/YUTA_FRONTEND_RULES.md`, approved Spec/Design, current `MarketingShell.tsx`.
- Constraints: full representation phải dẫn xuất từ Core; không duplicate `YUTA Alpha · v0.1.0-alpha.1`; không redesign footer, routing, marketing claim hoặc deployment wording; giữ Server Component boundary. Không thêm browser DB/secret/trusted scope.
- Intended file: `apps/web/src/components/marketing/MarketingShell.tsx`.
- Targeted checks (`REQUIRED_FOR_PHASE`): scoped diff/source inspection, `pnpm typegen:next` prerequisite trong exclusive checkout trước Next typecheck, `pnpm --filter @yuta/web typecheck`, `pnpm --filter @yuta/web build`, `pnpm architecture:check`. Browser evidence ở Phase 6, chưa là phase-completion claim trước QA.
- Completion evidence: source diff, successful command outputs và later real-route Web screenshot/QA record; release literal chỉ tồn tại ở Core current record hoặc independent expected test values.

## 3. UI / Components — Backoffice consumer

- [x] 3.1 Trong `apps/backoffice/src/components/backoffice/backoffice-frame.tsx`, import cùng Core record và `formatCompactProductRelease`, thay `YUTA v1.0.0` bằng derived compact representation trong `AppFooter`; xác nhận scoped diff không tạo app-owned release constant.
- [x] 3.2 Giữ authenticated shell, navigation, tenant switching, session props và Client Component behavior; xác nhận Core import graph browser-safe, không đưa server-only code/secret/database vào client bundle, bằng `pnpm architecture:check`, typecheck và build.
- [x] 3.3 Thêm focused footer render/regression test tại `apps/backoffice/test/product-release-footer.test.tsx` theo pattern Vitest/`renderToStaticMarkup` hiện có; xác nhận `pnpm --filter @yuta/backoffice test` chứng minh derived label/version hiện ra, stale literal vắng mặt, copyright/shell copy liên quan còn giữ, không mock release authority bằng literal app-owned.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 3

- Boundary/owner: authenticated Backoffice `AppFooter` presentation; Core sở hữu metadata và compact formatter. Auth/tenant/security vẫn ở existing server boundary.
- Authority: root `AGENTS.md`, `apps/backoffice/AGENTS.md`, `docs/ui/README.md`, `docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/BACKOFFICE_FRONTEND_RULES.md`, approved Spec/Design, current `backoffice-frame.tsx` và authenticated layout, package manifest/current component tests.
- Constraints: giữ `'use client'`, `AppFooter`, navigation và current authorization/organization/establishment scope; import chỉ pure browser-safe Core; không thêm permission, API hoặc trusted data. Web/Backoffice phải dùng cùng current release semantic source; chỉ full/compact presentation khác nhau như Spec.
- Intended files: `apps/backoffice/src/components/backoffice/backoffice-frame.tsx`, `apps/backoffice/test/product-release-footer.test.tsx`.
- Targeted checks (`REQUIRED_FOR_PHASE`): focused test bằng current Backoffice Vitest script, `pnpm typegen:next` prerequisite trước Next typecheck, `pnpm --filter @yuta/backoffice typecheck`, `pnpm --filter @yuta/backoffice test`, `pnpm --filter @yuta/backoffice build`, `pnpm architecture:check`.
- Completion evidence: exact test/build/typecheck results, scoped source diff và review client bundle/import path; real authenticated Browser QA ở Phase 6.

## 4. Integration / Regression — Product documentation

- [x] 4.1 Tạo `docs/features/product-release/README.md` làm Product Knowledge home cho ý nghĩa Product Version, khác package versions, sáu stage/label, release name, current release dẫn tới `CURRENT_YUTA_PRODUCT_RELEASE`, procedure cập nhật record thủ công và hai UI consumers; xác nhận đọc lại với Spec/Design không lưu current-release record thứ hai hoặc ghi capability readiness thành maturity.
- [x] 4.2 Thêm chỉ đường dẫn routing cần thiết ở `docs/README.md` và `docs/PRODUCT_KNOWLEDGE.md`; xác nhận `pnpm docs:check` và scoped diff không sao chép Deployment/Lifecycle rules sang home mới.
- [x] 4.3 Ghi entry Product Release trong `docs/MODULE_REGISTRY.md` với Core owner, direct consumers và lifecycle/evidence đúng trạng thái thực tế sau implementation; xác nhận `pnpm docs:check`, scoped diff giữ nguyên mọi thay đổi Pointage/pre-existing, và không ghi `READY`/`PRODUCTION_ENABLED` từ Product Release label.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 4

- Boundary/owner: Product Knowledge và registry routing; không thay normative main specs, deployment authority hoặc lifecycle status bằng assumption.
- Authority: root `AGENTS.md`, `docs/README.md`, `docs/PRODUCT_KNOWLEDGE.md`, `docs/MODULE_REGISTRY.md`, `docs/AUTHORITY_MODEL.md`, `docs/LIFECYCLE_STATUS_MODEL.md`, `docs/operations/DEPLOYMENT.md`, approved Spec/Design.
- Constraints: Core record là source of truth cho current release; Product Knowledge mô tả semantics/procedure và trỏ tới code, không tạo current metadata copy độc lập. Registry ghi đúng bounded Product Decision/Implementation/Environment/Readiness evidence, không tự promote. Hai intended indexes hiện dirty do công việc khác: phải isolate/bảo toàn và tạo scoped diff tái lập được trước sửa.
- Intended files: `docs/features/product-release/README.md`, `docs/README.md`, `docs/PRODUCT_KNOWLEDGE.md`, `docs/MODULE_REGISTRY.md`.
- Targeted checks (`REQUIRED_FOR_PHASE`): `pnpm docs:check`, scoped documentation review/attribution; `pnpm format:check` cho formatting-sensitive diff khi chạy ở final check.
- Completion evidence: doc links, current-record reference, release-update steps, exact docs-check result, isolated diff và truthful Registry row.

## 5. Integration / Regression — Technical VERIFY (future, after Apply)

- [x] 5.1 Đối chiếu 7 requirements/21 scenarios với Core tests/API/metadata, chạy `pnpm --filter @yuta/core test` và `pnpm --filter @yuta/core typecheck`; ghi từng case/command/result trong VERIFY evidence, không biến structural validation thành implementation PASS.
- [x] 5.2 Trong exclusive checkout, chạy `pnpm typegen:next` thành công trước Web/Backoffice Next typechecks; chạy `pnpm --filter @yuta/web typecheck`, `pnpm --filter @yuta/web build`, kiểm tra Web không giữ release literal cũ hoặc đổi footer ngoài scope; ghi exact results và source evidence.
- [x] 5.3 Chạy `pnpm --filter @yuta/backoffice test`, `pnpm --filter @yuta/backoffice typecheck`, `pnpm --filter @yuta/backoffice build`; xác nhận Backoffice footer, client import graph và auth/navigation regressions không bị thay đổi; ghi exact results.
- [x] 5.4 Chạy `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck`, `pnpm format:check` và strict OpenSpec validation sau Apply; lập requirement/scenario → implementation/test, phase TIC compliance matrix, scoped diff/hash và kết luận VERIFY trung thực. Nếu baseline dirty gây failure ngoài scope, phân loại/ghi rõ, không gán PASS cho change khi điều kiện cần chưa đạt.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 5

- Boundary/owner: repository technical verification của Core, Web, Backoffice và docs; không phải Browser QA hoặc production evidence.
- Authority: root/scoped `AGENTS.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/AUTHORITY_MODEL.md`, approved Spec/Design và Phase 1–4 TIC.
- Constraints: verify current implementation against exact approved Spec/Design; `pnpm typegen:next` chạm generated outputs của sáu Next apps và cần exclusive checkout, nên không chạy song song dev/build/typegen hoặc xóa lock của run khác. Chỉ typecheck sau typegen thành công. No invented lint command. Mọi failure/historical blocker giữ nguyên truth; `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` và `VERIFY: PASS` chỉ khi đủ evidence theo workflow.
- Intended evidence: current workflow VERIFY record/matrix và scoped diff/hash (tạo ở VERIFY phase theo authority), không tạo bây giờ.
- Required checks (`REQUIRED_FOR_FINAL_VERIFY`): các command ở 5.1–5.4 và bảng Verification matrix dưới đây. `pnpm test:local`/POS/DB migration checks `NOT_APPLICABLE` vì scope không đổi local runtime/persistence; không dùng `pnpm --filter @yuta/web test` vì manifest không có script. Broader cloud tests/builds không thay thế focused Core/Web/Backoffice evidence; mở rộng chỉ nếu VERIFY phát hiện dependency regression cụ thể.
- Completion evidence: exact command/exit outputs, reviewed scoped diff, 7×21 mapping, TIC matrix và truthful VERIFY result. Technical PASS không cấp QA/Gate 3/deploy approval.

## 6. Integration / Regression — Browser QA (future, after VERIFY)

- [ ] 6.1 Trên real/local Public Web route, kiểm tra footer desktop `1366x768` và mobile `390x844`: full release đúng từ Core, không `Projet pilote`, nội dung footer quanh đó giữ nguyên, text readable/accessible theo tokens, không overflow/clipping với prerelease string; xác nhận bằng screenshot thật và observation.
- [ ] 6.2 Trên authenticated Backoffice route, kiểm tra `AppFooter` desktop `1366x768` và mobile/responsive `390x844` khi áp dụng: compact release đúng, không `YUTA v1.0.0`, navigation/auth shell không regress, text readable/accessible, không overflow; xác nhận bằng screenshot thật và observation. Thêm `768x1024` nếu breakpoint có layout/state khác đáng kể.
- [ ] 6.3 Đối chiếu hai app với cùng `CURRENT_YUTA_PRODUCT_RELEASE`, lập `docs/reviews/product-version-management-foundation/qa/QA_REPORT.md`, `screenshot-manifest.md` và ảnh PNG thật; ghi route, role/state, viewport, scenario, screenshot path/SHA-256, accessibility/regression findings và canonical QA status `PASS | FAIL | BLOCKED_BY_ENVIRONMENT`, rồi xác nhận manifest hash khớp file bytes. Không dùng `NOT_APPLICABLE` cho UI-affecting change.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 6

- Boundary/owner: real UI behavior ở Web và authenticated Backoffice; QA độc lập với technical VERIFY và release/deploy lane.
- Authority: root/Web/Backoffice `AGENTS.md`, `docs/YUTA_QA_PROTOCOL.md`, `docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/BACKOFFICE_FRONTEND_RULES.md`, approved Spec/Design; page-pack viewport rules nếu có page pack phù hợp, nếu không dùng QA Protocol default.
- Constraints: real routes và authorization; không fabricated screenshot/credential/provider response/fixture-only page. Chỉ test display/footer scope, keyboard/basic accessibility, contrast/readability, responsive/overflow và surrounding regression; không suy Product Release thành capability readiness/deployment. QA chỉ bắt đầu sau VERIFY theo workflow.
- Intended evidence: `docs/reviews/product-version-management-foundation/qa/QA_REPORT.md`, `screenshot-manifest.md`, actual `*.png`.
- Required checks (`REQUIRED_FOR_FINAL_VERIFY` là tiền đề): `VERIFY: PASS`; Browser QA tự có status độc lập. `BROWSER_QA_REQUIRED: YES` và QA `PASS` là điều kiện Gate 3, không được suy từ typecheck/build.
- Completion evidence: report, manifest, hashed screenshots, viewport/role/state/scenario mapping và exact QA result; environment block/failure giữ nguyên, không fabricate PASS.

## Verification matrix — proposed commands, no results yet

| Command/evidence                                                                                         | Classification                                     | Owner và điều kiện                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/core test`                                                                          | `REQUIRED_FOR_PHASE` / `REQUIRED_FOR_FINAL_VERIFY` | Phase 1, 5; mapping/grammar/metadata/format tests.                                                                                                         |
| `pnpm --filter @yuta/core typecheck`                                                                     | `REQUIRED_FOR_PHASE` / `REQUIRED_FOR_FINAL_VERIFY` | Phase 1, 5; closed types/public exports.                                                                                                                   |
| `pnpm typegen:next`                                                                                      | `REQUIRED_FOR_PHASE` / `REQUIRED_FOR_FINAL_VERIFY` | Prerequisite Phase 2/3/5 trước direct Next typechecks; chạy một lần trong exclusive checkout sau preflight, áp dụng cho cả sáu Next apps theo root script. |
| `pnpm --filter @yuta/web typecheck` và `pnpm --filter @yuta/web build`                                   | `REQUIRED_FOR_PHASE` / `REQUIRED_FOR_FINAL_VERIFY` | Phase 2, 5; Server Component/footer integration.                                                                                                           |
| `pnpm --filter @yuta/backoffice test`                                                                    | `REQUIRED_FOR_PHASE` / `REQUIRED_FOR_FINAL_VERIFY` | Phase 3, 5; focused footer regression và package suite.                                                                                                    |
| `pnpm --filter @yuta/backoffice typecheck` và `pnpm --filter @yuta/backoffice build`                     | `REQUIRED_FOR_PHASE` / `REQUIRED_FOR_FINAL_VERIFY` | Phase 3, 5; Client Component/import safety.                                                                                                                |
| `pnpm architecture:check`                                                                                | `REQUIRED_FOR_PHASE` / `REQUIRED_FOR_FINAL_VERIFY` | Sau Phase 1–3 imports; Phase 5 final.                                                                                                                      |
| `pnpm docs:check`                                                                                        | `REQUIRED_FOR_PHASE` / `REQUIRED_FOR_FINAL_VERIFY` | Phase 4, 5; documentation/routing consistency.                                                                                                             |
| `pnpm -r --if-present typecheck`                                                                         | `REQUIRED_FOR_FINAL_VERIFY`                        | Phase 5 sau successful root typegen; repo-wide gate, attribute unrelated dirty failures.                                                                   |
| `pnpm format:check`                                                                                      | `REQUIRED_FOR_FINAL_VERIFY`                        | Phase 5 vì TS/Markdown formatting-sensitive; phân biệt unrelated dirty baseline, thêm scoped Prettier check nếu cần attribution.                           |
| `openspec validate product-version-management-foundation --type change --strict --json --no-interactive` | `REQUIRED_FOR_FINAL_VERIFY`                        | Phase 5 structural change validation; không chứng minh behavior/QA.                                                                                        |
| `pnpm test:local`, POS/DB migration checks, `pnpm --filter @yuta/web test`                               | `NOT_APPLICABLE`                                   | Không đổi local/persistence; Web không có test script.                                                                                                     |
| `pnpm test:cloud`, `pnpm build:cloud`                                                                    | `NOT_APPLICABLE` cho bounded default               | Bao gồm Auth/Booking/Feedback/DB ngoài direct scope; mở rộng theo concrete regression risk hoặc required gate, không thay thế targeted checks.             |

Trước khi chạy bất kỳ wrapper trong Apply/VERIFY, kiểm tra side effects, cache, subprocess, service/network và trạng thái exclusive checkout theo `docs/DEVELOPMENT_WORKFLOW.md`; không chạy kiểm tra nào chỉ vì nó được ghi trong kế hoạch. Current planning chỉ định command, chưa có kết quả `PASS`/`FAIL` mới.

## Traceability — approved intent to future evidence

| Approved Spec requirement                   | Gate 1 / Design quyết định                       | Task/TIC owner                | Future evidence                                                             |
| ------------------------------------------- | ------------------------------------------------ | ----------------------------- | --------------------------------------------------------------------------- |
| Canonical Product Release metadata          | `@yuta/core`, bốn fields, không release ID       | 1.2, 1.3, 4.1; TIC 1/4        | Core shape/current-record tests, docs pointer, VERIFY 5.1                   |
| Closed maturity stages and public labels    | Sáu stages, `Stable` cho GA                      | 1.1, 1.3; TIC 1               | exhaustive mapping/unknown-stage tests, VERIFY 5.1                          |
| Validated and independent Product Version   | Restricted grammar, package/stage independence   | 1.2, 1.3, 1.6; TIC 1/5        | valid/invalid and independence tests, manifest scoped review, VERIFY 5.1    |
| Deterministic release representation        | Core full/compact formatter                      | 1.4, 2.1, 3.1; TIC 1–3        | Core literal-expected tests, consumer source/render, VERIFY 5.2–5.3, QA 6.3 |
| Public Web footer uses Product Release      | Existing persistent footer, full text            | 2.1–2.3; TIC 2                | diff/typecheck/build, QA 6.1                                                |
| Backoffice footer uses same authority       | Existing authenticated `AppFooter`, compact text | 3.1–3.3; TIC 3                | test/typecheck/build/client graph, QA 6.2–6.3                               |
| Maturity separate from capability lifecycle | No promotion/availability logic                  | 1.3, 1.6, 4.1, 4.3; TIC 1/4/5 | independence tests, docs/registry review, VERIFY 5.4                        |

Trace chain: approved Proposal/Analysis → Gate 1 Product decisions → exact Gate 2 Spec → Design decisions → numbered task/TIC owner → future VERIFY/QA evidence above. Current task checkboxes are planning obligations, not implementation or test results.

## Scope stop and next gate

If Apply discovers need for database state/schema, API route, tenant-scoped versioning, feature flags or SHOW/HIDE/LOCK, release ID, deployment integration, GitHub Actions, runtime release provider, package-version synchronization, Product Release-specific `@yuta/ui` component, maturity inference from Product Version, changed auth/tenant/routing/Server–Client behavior, or a qualifying Sensitive Design boundary, stop with `NEEDS_REVIEW` and return to the owning Product/Design/authority gate. Do not edit approved Specs/Design to fit implementation or infer permission from technical PASS.

Recommended first later Apply phase: **Phase 1 — Core Product Release foundation**, after explicit Control Tower/human Apply authorization, integrity recheck and pre-Apply baseline/isolation. This Tasks/TIC artifact does not authorize Apply, VERIFY, Browser QA, Gate 3, sync/archive or deployment.
