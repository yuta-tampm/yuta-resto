# Change Analysis

## Scope and Change Type

`product-version-management-foundation` là change `CROSS_MODULE`, thay đổi hành vi hiển thị và `UI_AFFECTING: YES`. Scope chỉ là một Product Release identity tĩnh của YUTA và hai consumer trực tiếp Web/Backoffice. Không có data, authorization, tenant, provider, device, deployment hoặc capability-availability mutation. Các giá trị ban đầu và stage set trong [proposal](proposal.md) đã được current user chấp nhận rõ ràng tại Gate 1 cho scope này; approval không mở rộng sang capability lifecycle hoặc production.

## Sources Consulted

- Authority/workflow: [root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [current state](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge Home](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md), [change workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [Control Tower v3.1](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md), [OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [OpenSpec normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [QA Protocol](../../../docs/YUTA_QA_PROTOCOL.md).
- Boundaries: [ADR-001](../../../docs/decisions/ADR-001-runtime-families-and-product-visibility.md), [architecture overview](../../../docs/architecture/OVERVIEW.md), [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md), [Deployment](../../../docs/operations/DEPLOYMENT.md), scoped `AGENTS.md` của Core/UI/Web/Backoffice và [frontend rules](../../../docs/ui/YUTA_FRONTEND_RULES.md), [Backoffice frontend rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [external design policy](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- Implemented State: root và `apps/*/package.json`, `packages/*/package.json`; [Core exports](../../../packages/core/src/index.ts), [UI exports](../../../packages/ui/src/index.ts), [Web marketing shell](../../../apps/web/src/components/marketing/MarketingShell.tsx), [Backoffice frame](../../../apps/backoffice/src/components/backoffice/backoffice-frame.tsx), [authenticated layout](../../../apps/backoffice/src/app/(authenticated)/layout.tsx), và inventory `openspec/specs/**`. Không thấy main spec Product Release.

## Authority and Product Decision

Trước Gate 1, Product Knowledge/Registry/ADR/main specs chưa có quyết định cho Product Release identity; Analysis đầu tiên ghi `BLOCKED_NEEDS_REVIEW`. Current user đã chấp nhận tại Gate 1 đúng `YUTA` / `ALPHA` / `Alpha` / `0.1.0-alpha.1` / `Foundation`, compact representation `YUTA Alpha · v0.1.0-alpha.1`, sáu stages và mapping trong Proposal. `Stable` là nhãn public canonical duy nhất của `GENERAL_AVAILABILITY`. Release metadata gồm product identity, canonical stage, Product Version và human-readable release name; không có stable release ID riêng trong change này. Future ID chỉ được xem xét khi có consumer hoặc durable contract cụ thể.

Gate 1 chấp nhận `@yuta/core` làm owner cho canonical stage type, mapping stage → public label, metadata release hiện hành, deterministic validation và formatting thuần nếu cần; điều này phù hợp package chỉ có pure deterministic domain logic và có thể được Web/Backoffice import. App sở hữu vị trí/copy hiển thị. `@yuta/ui` chỉ sở hữu presentation primitive trung lập nếu later Design chứng minh reuse thực tế; không ép dependency mới để render Product Version. `package.json` versions tiếp tục là package/workspace metadata, độc lập với Product Version và không được bulk-update/synchronize theo `0.1.0-alpha.1`.

## Current Implemented State

- Root, bảy application manifests và tám package manifests được kiểm tra đều ghi `version: 0.1.0`. Đây là package/workspace version, không phải Product Version authority. `apps/web`, `apps/backoffice`, `apps/yuta-pos`, `apps/yuta-display`, `apps/site-agent` đã phụ thuộc `@yuta/core`; `booking-web` và `feedback-web` chưa phụ thuộc Core.
- Web [MarketingFooter](../../../apps/web/src/components/marketing/MarketingShell.tsx) có footer persistent với `Projet pilote · Déployé sur Vercel`, không có Product Version. Backoffice [BackofficeFrame](../../../apps/backoffice/src/components/backoffice/backoffice-frame.tsx) có `AppFooter` persistent chứa literal `Espace restaurateur YUTA v1.0.0`; authenticated layout render frame này. Hai literal không chung authority; `v1.0.0` không khớp candidate `0.1.0-alpha.1`.
- Không tìm thấy Product Release identity/maturity-stage mapping dùng chung, main spec tương ứng, hoặc test cho capability này. Không thực hiện runtime probe: không có bằng chứng phiên bản nào đang deployed, được enable hoặc production-ready.

## Affected Boundaries

| Consumer/boundary | Classification | Căn cứ và giới hạn |
| --- | --- | --- |
| `apps/web` | `DIRECT_CONSUMERS` | Public marketing footer hiện hữu; thay `Projet pilote` bằng `YUTA Alpha · v0.1.0-alpha.1` từ authority chung, giữ hosting metadata ngoài quyết định; không hàm ý mọi capability đã phát hành. |
| `apps/backoffice` | `DIRECT_CONSUMERS` | Authenticated `AppFooter` hiện hữu; thay `YUTA v1.0.0` bằng metadata chung, có thể dùng `Alpha · v0.1.0-alpha.1`; không đổi session/tenant/navigation. |
| `apps/booking-web`, `apps/feedback-web` | `FOLLOW_UP_CONSUMERS` | Cloud public apps có release boundaries riêng; chỉ kiểm tra compatibility, không tự thêm Core dependency hay UI. |
| `apps/yuta-pos`, `apps/yuta-display` | `FOLLOW_UP_CONSUMERS` | Local/standalone product riêng, hiện có Core dependency; không tự hiển thị cùng claim công khai hoặc thay site/device release evidence. |
| `apps/site-agent` | `UNAFFECTED` | Local API/runtime có Core dependency nhưng không có user-visible footer trong scope; không đổi runtime/operation. |
| `apps/platform-admin` | `UNAFFECTED` | Reserved, chưa implemented. |

`packages/core` là shared authority candidate; `packages/ui` là presentation candidate có điều kiện, chưa là direct consumer. Không cần bảng database, metadata API route, organization/establishment scope hoặc authorization: đây là metadata tĩnh, không phải dữ liệu tenant hay runtime-sourced capability state. Client consumption phải giữ dependency thuần, không kéo server secret/database/module vào bundle. Không thay runtime/data ownership hoặc deployment topology.

## Lifecycle Baseline

Product Release identity cụ thể chưa có Registry row. Trước proposal: Product Decision `NOT_DECIDED`; trong Gate 1 review: `PROPOSED`; sau explicit current-user Gate 1 decision: `APPROVED` chỉ cho bounded Product Intent này, không tự sửa Registry hoặc normative main specs. Implementation `NOT_STARTED` cho authority dùng chung; literal Backoffice và footer Web không chứng minh capability. Environment `UNVERIFIED`; Production Readiness `NOT_ASSESSED` riêng cho capability, trong khi cross-product readiness gates vẫn riêng và chưa được promotion. External Dependency `NOT_ASSESSED` theo status model; không thấy provider cần cho metadata tĩnh. Product Maturity Stage (`ALPHA` v.v.) là vocabulary của Product Release, tuyệt đối không phải Product Decision, Implementation, Environment, Readiness hay External Dependency status của từng capability. `YUTA Alpha · v0.1.0-alpha.1` không chứng minh `IMPLEMENTED`, `READY`, `PRODUCTION_ENABLED` hay external `READY`.

## Requirement Readiness

Đây là behavior-changing path với capability mới `product-release/identity`; `skip_specs: true` không phù hợp. Explicit current-user Gate 1 decision đã giải quyết public GA label (`Stable`), release-identity semantics (không separate ID), package-version independence và hai footer copy boundaries. Kết luận hiện tại: `READY_FOR_SPECS`. Viết chỉ delta spec của capability được Proposal khai báo, strict-validate và dừng tại Gate 2; chưa có quyền Design hoặc Apply.

Future verification matrix đề xuất từ scripts có thật, chưa thực thi:

| Mục đích | Lệnh/evidence sau approval |
| --- | --- |
| Stage mapping exhaustiveness, supported-stage typing, Product Version format, deterministic formatting | `pnpm --filter @yuta/core test`; `pnpm --filter @yuta/core typecheck` |
| Web/Backoffice cùng authority, không lặp release literals, Server/Client import an toàn | focused source/test assertions theo approved Specs; `pnpm --filter @yuta/web typecheck`; `pnpm --filter @yuta/backoffice typecheck`; `pnpm --filter @yuta/backoffice test` |
| Build/architecture/docs | `pnpm --filter @yuta/web build`; `pnpm --filter @yuta/backoffice build`; `pnpm architecture:check`; `pnpm docs:check`; `pnpm -r --if-present typecheck` |
| Formatting nếu artifact/source sau này thay đổi | `pnpm format:check`, với unrelated dirty baseline được attribution riêng |
| UI runtime | Browser QA thật cho Web desktop/mobile và Backoffice desktop/mobile shell: visible indicator, readability/accessibility, no footer/navigation/layout regression, prerelease-string overflow, cùng authority; QA report/hashed screenshot manifest theo QA Protocol. |

Không có `test` script của `@yuta/web` hoặc root `lint` script; không đề xuất lệnh không tồn tại. Không chạy bất kỳ lệnh test/build/VERIFY/Browser QA nào trong Proposal/Analysis.

## UI / UX Applicability

`UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES` cho giai đoạn sau. Đây là thay đổi nhỏ tại shell/footer hiện hữu, không phải page mới hoặc redesign. Web có vùng footer cuối trang sau ©; Backoffice có `AppFooter` dưới `AppMain` trong authenticated frame. Gate 1 yêu cầu thay đúng maturity wording `Projet pilote` và hardcoded `v1.0.0` bằng metadata chung; unrelated hosting/deployment wording ở ngoài quyết định nếu không có nhu cầu technical tối thiểu. Không có page pack riêng cho hai shell trong scope kiểm tra.

`UI_UX_PRO_MAX_USAGE: OPTIONAL`; Reason: chỉ cần hiển thị metadata kín đáo trong footer hiện hữu, YUTA UI authority và Browser QA đủ định hướng; Scope: Web marketing footer và Backoffice authenticated shell; Decision source: explicit current-user Gate 1 decision của change này. External advisory `NOT USED`; không có query, installation hoặc external evidence.

## Conflicts and Unknowns

- Historical pre-Gate 1 `BLOCKED_NEEDS_REVIEW`: GA label, release-ID semantics và Web footer wording chưa được quyết định; current-user Gate 1 approval đã giải quyết lần lượt bằng `Stable`, không separate ID, và thay chỉ `Projet pilote` bằng Product Release representation. Không relabel historical finding thành PASS; xem exact historical hashes trong Gate 1 packet.
- Existing `Backoffice v1.0.0` là implementation divergence với approved release, không phải authority chấp thuận `v1.0.0`; Gate 1 yêu cầu thay bằng một authority duy nhất ở later Apply. Không tìm thấy conflict giữa approved decision và accepted ADR/runtime/data boundary.
- Design-only: exact API/validation representation và có cần neutral UI primitive hay không được đánh giá sau Gate 2; không được đổi Product behavior hoặc tạo dependency trái boundary.
- Sensitive Design Gate: chưa triggered. `CROSS_MODULE` tự nó không đủ; không thấy security/auth, runtime/data ownership, migration, provider, irreversible operation hoặc durable cross-module boundary cần đổi. Phải tái đánh giá nếu later Specs/Design phát hiện một boundary như vậy.

## Analysis Conclusion

Bounded `CROSS_MODULE` scope và new capability path được xác nhận; explicit current-user Gate 1 decision chấp nhận owner `@yuta/core`, independent package versions, hai direct UI consumers, stage/label set, initial release và không database/API/tenant scope. Kết luận hiện tại `READY_FOR_SPECS`; historical `BLOCKED_NEEDS_REVIEW` đã được giải quyết bằng decision cụ thể, không bằng assumption. Tiếp theo chỉ Specs và Gate 2; không tạo Design, Tasks hoặc implementation trước Gate 2 approval.
