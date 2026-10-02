## Context

Change `product-version-management-foundation` thuộc `CROSS_MODULE`, `UI_AFFECTING: YES`. Gate 1 đã duyệt Product Release đầu tiên và owner `@yuta/core`; Gate 2 đã duyệt delta Spec tại `specs/product-release/identity/spec.md`, SHA-256 `bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d` (7 requirements, 21 scenarios). Gate 2 hiện được ghi `APPROVED` trong `docs/reviews/product-version-management-foundation/02-specs-review.md`; các packet `02-specs-review-preclarification.md` và `02-specs-review-preapproval.md` giữ nguyên lịch sử `AWAITING_HUMAN_REVIEW`.

Hiện `packages/core/src/index.ts` chỉ export `tools`, `combos`, `formatting`, `dates`; Core không có runtime dependencies, dùng TypeScript và Vitest. `apps/web` và `apps/backoffice` đã phụ thuộc trực tiếp vào `@yuta/core`. `MarketingFooter` trong `apps/web/src/components/marketing/MarketingShell.tsx` là component không đánh dấu client, với dòng `Projet pilote · Déployé sur Vercel`. `BackofficeFrame` trong `apps/backoffice/src/components/backoffice/backoffice-frame.tsx` là client component và dùng `@yuta/ui` `AppFooter`, hiện chứa `Espace restaurateur YUTA v1.0.0`; layout xác thực ở server render frame đó. Các literal này là hiện trạng triển khai, không phải Product Version authority.

Authority: root và Core/Web/Backoffice/UI `AGENTS.md`; `docs/AUTHORITY_MODEL.md`, `docs/PRODUCT_KNOWLEDGE.md`, `docs/LIFECYCLE_STATUS_MODEL.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, `docs/YUTA_QA_PROTOCOL.md`, `docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`, architecture/operations documents và approved Proposal/Analysis/Spec. Product Release label không chứng minh capability readiness, deployment hoặc production authorization.

## Goals / Non-Goals

### Goals

- Một record Product Release hiện hành, một stage set/label mapping canonical và validator xác định trong Core; Web và Backoffice dẫn xuất cùng Product Version/label từ đó.
- Thay đúng wording Product Maturity tại Web footer và hardcoded release wording tại authenticated Backoffice footer; giữ shell/layout hiện hữu.
- Cho phép future release update bằng một chỉnh sửa record hiện hành, với test và review thông thường; package versions độc lập.

### Non-Goals

- Không có stable release ID, persistence, API, environment/configuration, tenant/auth, provider, capability flags, maturity inference, release CLI, GitHub Actions hoặc deployment automation.
- Không đổi package/workspace versions, deployment/readiness claim, footer hosting wording, các runtime khác hay `@yuta/ui` chỉ vì hai consumer hiển thị cùng text.

## Decisions

### 1. Core module và API thuần

Khi Apply được cấp quyền, thêm đúng `packages/core/src/product-release.ts`, export công khai qua `packages/core/src/index.ts`; test tập trung tại `packages/core/test/product-release.test.ts`. Không tạo package, module registry chạy runtime, hay generic release-management framework. Module không đọc filesystem, environment, package manifest, clock, database hoặc framework; cùng input luôn cho cùng kết quả. Các export dự kiến:

- `PRODUCT_MATURITY_STAGES`: tuple chỉ chứa đúng sáu stage canonical theo thứ tự Spec;
- `ProductMaturityStage`: union suy từ tuple, không phải `string` mở;
- `PRODUCT_MATURITY_LABELS`: mapping exhaustive kiểu `Record<ProductMaturityStage, string>` với sáu label đã duyệt;
- `ProductRelease`: readonly shape `{ product: 'YUTA'; maturityStage: ProductMaturityStage; version: string; releaseName: string }`;
- `CURRENT_YUTA_PRODUCT_RELEASE`: một readonly record `{ product: 'YUTA', maturityStage: 'ALPHA', version: '0.1.0-alpha.1', releaseName: 'Foundation' }`, kiểm tra type bằng `satisfies ProductRelease`;
- `isValidProductVersion(value: string): boolean`, `parseProductRelease(value: unknown): ProductRelease`, `getProductMaturityLabel(stage: ProductMaturityStage): string`, `formatProductRelease(release: ProductRelease): string` và `formatCompactProductRelease(release: ProductRelease): string`.

Không lưu `publicLabel` trong current-release record: label dẫn xuất duy nhất từ canonical mapping. Không có release ID. Union type ngăn unsupported stage trong typed code; `parseProductRelease` kiểm tra ở runtime trước khi chấp nhận giá trị `unknown`, từ chối stage lạ và metadata không hợp lệ thay vì fallback. Formatter kiểm tra metadata qua cùng validation trước khi dựng text, nên cast/boundary không âm thầm xuất ra nhãn đoán. Parser chỉ chấp nhận bốn field sản phẩm nêu trên, `product: 'YUTA'`, release name không rỗng sau trim; không phát minh thêm định danh. Tính hợp lệ của Product Version không suy ra hoặc sửa `maturityStage`.

### 2. Product Version validation

`isValidProductVersion` kiểm tra toàn chuỗi theo subset được duyệt: ba numeric ASCII identifiers bắt buộc, không leading zero trừ `0`; optional `-` rồi ít nhất một prerelease identifier phân cách bằng `.`, mỗi identifier chỉ gồm ASCII letter/digit/hyphen, không rỗng, numeric-only identifier không leading zero. Không nhận `v` prefix hoặc `+` build metadata. Không cần external SemVer dependency; không so sánh/sort version, không đặt giới hạn kích thước số tùy ý và không diễn giải `alpha`/`beta`/`rc` thành maturity. Validator nhận `0.1.0-alpha.1`, `0.2.0-beta.1`, `0.9.0-rc.1`, `1.0.0`; từ chối `v0.1.0-alpha.1`, `01.0.0`, `1.0`, `0.1.0-alpha..1`, `0.1.0-alpha.01`, `1.0.0+build.42` như Spec. Parser dùng validator này trước khi tạo release object dùng cho hiển thị.

### 3. Metadata, text và presentation

Core chỉ giữ metadata và pure derived text. `formatProductRelease(CURRENT_YUTA_PRODUCT_RELEASE)` tạo `YUTA Alpha · v0.1.0-alpha.1`; `formatCompactProductRelease(...)` tạo `Alpha · v0.1.0-alpha.1`. Dấu `v` và dấu phân tách thuộc presentation text, không thuộc metadata `version`. `releaseName` được giữ trong record cho consumer tương lai nhưng không chèn vào hai representation đã duyệt. App quyết định vị trí/copy phụ trợ, không hardcode Product Version hoặc stage label. Product Release không được dùng như status/readiness input hay authorization decision.

### 4. Web footer

Tại `MarketingFooter` hiện hữu, import current release và full formatter từ `@yuta/core`; thay duy nhất `Projet pilote` bằng derived full representation. Giữ `· Déployé sur Vercel` và © text vì deployment wording không thuộc quyết định này; chỉ xử lý khác nếu Apply chứng minh cần điều chỉnh tối thiểu về kỹ thuật. Không thay grid, navigation hoặc marketing claims. `MarketingShell.tsx` hiện không có `'use client'`, nên Core module thuần có thể dùng trong Server Component; không tạo client boundary hay runtime fetch.

### 5. Authenticated Backoffice footer

Trong `BackofficeFrame`, import current release và compact formatter từ `@yuta/core`, thay đoạn hardcoded `YUTA v1.0.0` bằng text dẫn xuất; giữ `AppFooter` và copy bản quyền ngoài release wording. `BackofficeFrame` hiện là client component; Core module mới không có server-only import, secret, I/O hoặc environment access, nên import trực tiếp không phá Server/Client boundary và không cần truyền thêm prop qua authenticated layout. Không đụng session, tenant, navigation hoặc authorization. Nếu future Core import graph không còn browser-safe, phải đánh giá lại trước Apply thay vì chuyển server data vào client một cách ngầm định.

### 6. UI package và runtimes khác

`UI_PACKAGE_DECISION: NO_CHANGE_TO_UI_PACKAGE`. Web dùng footer hiện hữu; Backoffice đã dùng `AppFooter` từ `@yuta/ui`. Không có visual behavior mới cần một primitive trung lập; Product Release copy thuộc Core/app, không thuộc UI package. Không tạo dependency relationship mới.

`booking-web` và `feedback-web` hiện không phụ thuộc Core, nên export mới không chạm build/import graph của chúng và không thêm dependency hoặc footer. `yuta-pos`, `yuta-display` và `site-agent` đã phụ thuộc Core; export mới additive, không sửa export cũ hoặc runtime operation, nên không thấy compatibility concern từ API hiện tại. Không biến local POS/Display/site-agent release indicator thành public YUTA claim. Những consumer này chỉ là follow-up compatibility, không phải implementation target.

### 7. Release update và documentation owner

Future Product Release decision thay đúng một record `CURRENT_YUTA_PRODUCT_RELEASE` trong Core; mapping chỉ đổi khi một change riêng phê duyệt canonical labels/stages. Sau chỉnh sửa, chạy tests/typechecks/build/Browser QA và review theo workflow tương ứng trước khi dùng bản phát hành; không tự sửa package versions hoặc tự promote readiness. Không thêm CLI/CI automation trong foundation. Nếu thao tác thủ công sau này tạo lỗi lặp lại, ghi nhận nhu cầu automation như improvement mới.

Khi Apply được duyệt, tạo một Product Knowledge home có scope hẹp tại `docs/features/product-release/README.md` để giải thích ý nghĩa Product Version, sự độc lập với package versions/maturity/capability lifecycle, stage mapping, vị trí hai consumer và procedure update; document chỉ trỏ đến `CURRENT_YUTA_PRODUCT_RELEASE` cho current value thay vì lưu một release record thứ hai. `docs/PRODUCT_KNOWLEDGE.md` và `docs/README.md` chỉ thêm đường dẫn routing nếu cần; `docs/MODULE_REGISTRY.md` ghi owner/evidence/lifecycle đúng trạng thái thực tế sau Apply, không tự promote `READY`. Normative behavior ở approved delta Spec và chỉ chuyển vào main specs sau gate/sync được ủy quyền. `docs/operations/DEPLOYMENT.md` tiếp tục sở hữu deployment procedure; không sao chép sang Product Release doc. Không sửa documentation owner nào trong Design turn này.

### 8. Automated checks và Browser QA sau Apply

`packages/core/test/product-release.test.ts` nên kiểm tra đầy đủ sáu stage và đúng labels (bao gồm `GENERAL_AVAILABILITY → Stable`), unsupported runtime stage rejection, bốn field release hiện hành không có ID/label lặp, valid/invalid Product Version cases của Spec, numeric prerelease leading-zero cases, independence của `beta.1` với `PRIVATE_BETA`/`PUBLIC_BETA`, formatter full/compact và validation trước formatting. Expected values trong test là literal độc lập, không gọi cùng formatter để tự xác nhận. Focused consumer checks xác nhận Web và Backoffice đều import cùng Core authority, không còn hai literal cũ; kiểm tra render nếu test infrastructure phù hợp, không thêm test framework cho Web chỉ để làm việc này. Package versions không phải input của formatter; test Core giữ bất biến đó và scoped review kiểm tra không bulk-update manifests.

Các command hiện có cho later VERIFY: `pnpm --filter @yuta/core test`, `pnpm --filter @yuta/core typecheck`, `pnpm --filter @yuta/web typecheck`, `pnpm --filter @yuta/web build`, `pnpm --filter @yuta/backoffice test`, `pnpm --filter @yuta/backoffice typecheck`, `pnpm --filter @yuta/backoffice build`, `pnpm architecture:check`, `pnpm docs:check`, `pnpm -r --if-present typecheck`; `pnpm format:check` nếu format-sensitive. Chạy trong Apply/VERIFY với scoped attribution đối với checkout đang dirty; chưa command nào trong nhóm này được chạy ở Design. Web không có test script; không gọi một `@yuta/web test` không tồn tại.

`BROWSER_QA_REQUIRED: YES`. Sau implementation, dùng real routes ở Web và Backoffice đã xác thực, ít nhất desktop `1366x768` và mobile `390x844`; thêm viewport trung gian khi breakpoint/layout đòi hỏi. Web: footer visible, full representation đúng, `Projet pilote` không còn, nội dung khác và layout không regress, readable/accessible, không overflow. Backoffice: `AppFooter` visible, compact text đúng, `v1.0.0` không còn, navigation/auth shell không đổi, responsive/readability/accessibility/overflow. So sánh label/version của hai app với cùng record Core. Browser QA phải lập `docs/reviews/product-version-management-foundation/qa/QA_REPORT.md`, `screenshot-manifest.md` và ảnh thật kèm viewport, role/state, scenario, SHA-256 theo QA Protocol. Chưa thực hiện Browser QA hoặc tạo QA evidence trong Design.

## Risks / Trade-offs

- Static current-release record có nghĩa mỗi release decision cần source edit/review/build mới; đây là ergonomic minimum được duyệt, không phải config động. Nếu Web/Backoffice deploy ở thời điểm khác nhau, runtime có thể tạm hiển thị hai release khác nhau; deployment sequencing/verification thuộc release lane riêng, không được giải quyết bằng API hay DB trong change này.
- Formatter dùng chung giảm release-literal drift nhưng thêm Core code vào Backoffice client bundle. Module mới chỉ chứa constants và pure functions, không kéo server dependency; later VERIFY cần xác nhận import graph/build.
- Product Maturity Stage và capability lifecycle/readiness vẫn là hai authority độc lập. Không có logic tự promote stage từ prerelease token hoặc capability status; representation không phải production claim.
- `UI_UX_PRO_MAX_USAGE: OPTIONAL`, external advisory `NOT USED` như Analysis được duyệt; thay đổi copy nhỏ tại footer hiện hữu không cần advisory mới.

`SENSITIVE_DESIGN_GATE = NOT_TRIGGERED`. Design chỉ thêm pure static Core API và hai existing presentation consumers. Không đổi security/authorization, data/runtime owner, database/migration, payment/fiscal, personnel/legal/privacy, provider, POS transaction, irreversible operation hoặc cross-module durable boundary. `CROSS_MODULE`, shared Product Version và UI effect riêng chúng không kích hoạt gate. Nếu Apply sau này cần qualifying durable boundary, phải quay lại Design/authority review trước thay đổi đó.

## Migration Plan

Không có data migration hoặc rollback dữ liệu. Later authorized Apply: (1) thêm Core module/export/tests; (2) thay hai footer literals bằng derived text; (3) cập nhật Product Knowledge routing/owner theo quyết định trên; (4) chạy targeted checks, VERIFY và Browser QA theo workflow. Nếu cần rollback code, hoàn nguyên source change qua kiểm soát release bình thường; không suy ra production deployment từ code review. Trong Design turn chỉ ghi quyết định này, không thực hiện các bước Apply.

## Open Questions

Không có Product, owner hoặc sensitive-boundary decision chưa giải quyết trong phạm vi approved Spec. Các cải tiến ngoài phạm vi như release automation, consumer bổ sung và future immutable release ID cần change/approval riêng khi có nhu cầu cụ thể.
