Change: product-version-management-foundation
Gate: Gate 1 — Product / Authority Review
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-23T19:49:30.8488590+02:00
Schema: yuta-spec-driven
Analysis conclusion: BLOCKED_NEEDS_REVIEW
Sensitive change: NO (provisional; re-evaluate if later evidence changes durable boundaries)

# Gate 1 Review — Product Version Management Foundation

## Request and bounded scope
CROSS_MODULE; UI_AFFECTING: YES. Proposal và Analysis chỉ đề xuất Product Release identity YUTA dùng chung cho Web/Backoffice. Current user chỉ authorize qua Gate 1 preparation; không authorize Specs, Apply, sync, archive hay deployment.

## Repository provenance and isolation
Baseline HEAD: 14dd0f35645586abc5877da28df0fcd16eba971d. Baseline command: git status --short. Checkout có nhiều unrelated modified/deleted/untracked paths, đặc biệt Pointage; tất cả được giữ nguyên. Chỉ change shell, Proposal, Analysis và packet Gate 1 của change này được thêm.

## Authorities and findings
Authority routing: root/scoped AGENTS.md; docs/README.md; docs/AUTHORITY_MODEL.md; docs/PRODUCT_KNOWLEDGE.md; docs/MODULE_REGISTRY.md; docs/LIFECYCLE_STATUS_MODEL.md; docs/YUTA_WORKFLOW_V3.md; docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md; docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md; docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md; docs/decisions/ADR-001-runtime-families-and-product-visibility.md; docs/architecture/OVERVIEW.md; docs/operations/PRODUCTION_READINESS.md; docs/operations/DEPLOYMENT.md; docs/ui/YUTA_FRONTEND_RULES.md; docs/ui/BACKOFFICE_FRONTEND_RULES.md; docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md. Detailed code/manifests and boundaries are linked in Analysis.

## Exact Proposal Content

```markdown
## Why

Các `package.json` hiện ghi phiên bản workspace `0.1.0`, trong khi Backoffice hiển thị literal `YUTA v1.0.0` và Web chỉ ghi “Projet pilote”. Chúng không xác lập một danh tính Product Release nhất quán cho người dùng hoặc các ứng dụng; YUTA cần một nguồn thẩm quyền rõ ràng trước khi hiển thị phiên bản sản phẩm.

## What Changes

- Đề xuất một danh tính Product Release YUTA dùng chung, phân biệt phiên bản package/workspace, Product Version, Product Maturity Stage và release name. Candidate ban đầu để Gate 1 xét duyệt: `YUTA`, `ALPHA` / `Alpha`, `0.1.0-alpha.1`, `Foundation`; biểu diễn ngắn `YUTA Alpha · v0.1.0-alpha.1`.
- Đề xuất đúng sáu maturity stages: `PROTOTYPE`, `ALPHA`, `PRIVATE_BETA`, `PUBLIC_BETA`, `RELEASE_CANDIDATE`, `GENERAL_AVAILABILITY`. Public labels tương ứng là `Prototype`, `Alpha`, `Private Beta`, `Public Beta`, `RC` và một nhãn `Stable` hoặc `GA` cần Gate 1 quyết định vì chưa có convention có thẩm quyền.
- Web và Backoffice sẽ đọc cùng Product Release authority và hiển thị dấu hiệu phiên bản kín đáo tại footer/shell hiện hữu; không redesign shell. Maturity Stage của toàn sản phẩm không xác định lifecycle hay availability của bất kỳ capability nào.
- Giữ phiên bản `package.json` là metadata của package/workspace, độc lập với Product Version; không đồng bộ hai loại phiên bản chỉ vì cùng bắt đầu từ `0.1.0`.
- Ngoài scope: capability SHOW/HIDE/LOCK, feature flags, Beta capability matrix, phiên bản theo tenant, database/schema, API chỉ để cung cấp metadata tĩnh, authorization, routing, deployment automation, GitHub Actions, maturity promotion tự động và production authorization.

## Capabilities

### New Capabilities

- `product-release/identity`: Product Release identity, maturity-stage labels và biểu diễn thống nhất cho các consumer trực tiếp, tách khỏi phiên bản package và capability lifecycle.

### Modified Capabilities

- Không có.

## Impact

- Candidate shared authority: `packages/core` vì metadata và validation có thể thuần, xác định và không phụ thuộc runtime. `packages/ui` chỉ là candidate presentation nếu sau review chứng minh cần primitive trung lập; copy Product vẫn thuộc ứng dụng.
- Direct consumers: `apps/web` và `apps/backoffice`, tại marketing footer và authenticated shell/footer hiện hữu. UI thay đổi nên Browser QA desktop/mobile, khả năng đọc, khả năng truy cập và overflow là bắt buộc ở giai đoạn sau.
- `apps/booking-web`, `apps/feedback-web`, `apps/yuta-pos`, `apps/yuta-display`, `apps/site-agent` chỉ được đánh giá compatibility/future consumption; change này không mặc nhiên chỉnh sửa chúng. Không thêm database, API, tenant scope, provider hoặc dependency mới cho metadata tĩnh.
- Rủi ro: literal cũ `v1.0.0` và “Projet pilote” có thể gây sai nghĩa hoặc lệch nhãn Alpha; shared metadata có thể bị hiểu nhầm thành bằng chứng deployment hay readiness. Release/deployment và production authorization tiếp tục là lane riêng theo tài liệu operations, không được cấp bởi Product Version.
```

## Exact Analysis Content

```markdown
# Change Analysis

## Scope and Change Type

`product-version-management-foundation` là change `CROSS_MODULE`, thay đổi hành vi hiển thị và `UI_AFFECTING: YES`. Scope chỉ là một Product Release identity tĩnh của YUTA và hai consumer trực tiếp Web/Backoffice. Không có data, authorization, tenant, provider, device, deployment hoặc capability-availability mutation. Các giá trị ban đầu và stage set trong [proposal](proposal.md) là candidate cần Gate 1 chấp nhận, không phải trạng thái Product đã được duyệt.

## Sources Consulted

- Authority/workflow: [root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [current state](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge Home](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md), [change workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [Control Tower v3.1](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md), [OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [OpenSpec normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [QA Protocol](../../../docs/YUTA_QA_PROTOCOL.md).
- Boundaries: [ADR-001](../../../docs/decisions/ADR-001-runtime-families-and-product-visibility.md), [architecture overview](../../../docs/architecture/OVERVIEW.md), [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md), [Deployment](../../../docs/operations/DEPLOYMENT.md), scoped `AGENTS.md` của Core/UI/Web/Backoffice và [frontend rules](../../../docs/ui/YUTA_FRONTEND_RULES.md), [Backoffice frontend rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [external design policy](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- Implemented State: root và `apps/*/package.json`, `packages/*/package.json`; [Core exports](../../../packages/core/src/index.ts), [UI exports](../../../packages/ui/src/index.ts), [Web marketing shell](../../../apps/web/src/components/marketing/MarketingShell.tsx), [Backoffice frame](../../../apps/backoffice/src/components/backoffice/backoffice-frame.tsx), [authenticated layout](../../../apps/backoffice/src/app/(authenticated)/layout.tsx), và inventory `openspec/specs/**`. Không thấy main spec Product Release.

## Authority and Product Decision

Product Intent của Product Release identity chưa có quyết định được duyệt trong Product Knowledge/Registry/ADR/main specs. Request hiện tại đề xuất `YUTA` / `ALPHA` / `Alpha` / `0.1.0-alpha.1` / `Foundation`, không tự tạo approval. Gate 1 phải chấp nhận Product identity, stage vocabulary, public label, compact representation và quan hệ với package versions. Release name `Foundation` là tên release, không phải stage hoặc Product Version; release identity dự kiến gồm các thành phần này, nhưng việc cần một identifier độc lập là `NEEDS REVIEW`.

Khuyến nghị ownership để Gate 1 xét: `@yuta/core` sở hữu canonical stage type, mapping stage → public label, metadata release hiện hành, deterministic validation và formatting thuần nếu cần; điều này phù hợp package chỉ có pure deterministic domain logic và có thể được Web/Backoffice import. App sở hữu vị trí/copy hiển thị. `@yuta/ui` chỉ sở hữu presentation primitive trung lập nếu chứng minh được reuse thực tế; Product Release semantics không thuộc UI package. Không có căn cứ đồng bộ `package.json` với Product Version: manifest version là package/workspace metadata; Product Version là quyết định sản phẩm độc lập.

## Current Implemented State

- Root, bảy application manifests và tám package manifests được kiểm tra đều ghi `version: 0.1.0`. Đây là package/workspace version, không phải Product Version authority. `apps/web`, `apps/backoffice`, `apps/yuta-pos`, `apps/yuta-display`, `apps/site-agent` đã phụ thuộc `@yuta/core`; `booking-web` và `feedback-web` chưa phụ thuộc Core.
- Web [MarketingFooter](../../../apps/web/src/components/marketing/MarketingShell.tsx) có footer persistent với `Projet pilote · Déployé sur Vercel`, không có Product Version. Backoffice [BackofficeFrame](../../../apps/backoffice/src/components/backoffice/backoffice-frame.tsx) có `AppFooter` persistent chứa literal `Espace restaurateur YUTA v1.0.0`; authenticated layout render frame này. Hai literal không chung authority; `v1.0.0` không khớp candidate `0.1.0-alpha.1`.
- Không tìm thấy Product Release identity/maturity-stage mapping dùng chung, main spec tương ứng, hoặc test cho capability này. Không thực hiện runtime probe: không có bằng chứng phiên bản nào đang deployed, được enable hoặc production-ready.

## Affected Boundaries

| Consumer/boundary | Classification | Căn cứ và giới hạn |
| --- | --- | --- |
| `apps/web` | `DIRECT_CONSUMERS` | Public marketing footer hiện hữu; Product copy phải tuân public visibility, không hàm ý mọi capability đã phát hành. |
| `apps/backoffice` | `DIRECT_CONSUMERS` | Authenticated frame/footer hiện hữu; metadata chung, không đổi session/tenant/navigation. |
| `apps/booking-web`, `apps/feedback-web` | `FOLLOW_UP_CONSUMERS` | Cloud public apps có release boundaries riêng; chỉ kiểm tra compatibility, không tự thêm Core dependency hay UI. |
| `apps/yuta-pos`, `apps/yuta-display` | `FOLLOW_UP_CONSUMERS` | Local/standalone product riêng, hiện có Core dependency; không tự hiển thị cùng claim công khai hoặc thay site/device release evidence. |
| `apps/site-agent` | `UNAFFECTED` | Local API/runtime có Core dependency nhưng không có user-visible footer trong scope; không đổi runtime/operation. |
| `apps/platform-admin` | `UNAFFECTED` | Reserved, chưa implemented. |

`packages/core` là shared authority candidate; `packages/ui` là presentation candidate có điều kiện, chưa là direct consumer. Không cần bảng database, metadata API route, organization/establishment scope hoặc authorization: đây là metadata tĩnh, không phải dữ liệu tenant hay runtime-sourced capability state. Client consumption phải giữ dependency thuần, không kéo server secret/database/module vào bundle. Không thay runtime/data ownership hoặc deployment topology.

## Lifecycle Baseline

Product Release identity cụ thể chưa có Registry row/lifecycle assessment. Trước proposal: Product Decision `NOT_DECIDED`; sau khi tạo proposal: chỉ `PROPOSED`, chờ Gate 1. Implementation `NOT_STARTED` cho authority dùng chung; literal Backoffice và footer Web không chứng minh capability. Environment `UNVERIFIED`; Production Readiness `NOT_ASSESSED` riêng cho capability, trong khi cross-product readiness gates vẫn riêng và chưa được promotion. External Dependency `NOT_ASSESSED` theo status model; không thấy provider cần cho metadata tĩnh. Product Maturity Stage (`ALPHA` v.v.) là vocabulary của Product Release, tuyệt đối không phải Product Decision, Implementation, Environment, Readiness hay External Dependency status của từng capability. `YUTA Alpha · v0.1.0-alpha.1` không chứng minh `IMPLEMENTED`, `READY`, `PRODUCTION_ENABLED` hay external `READY`.

## Requirement Readiness

Đây là behavior-changing path với capability mới `product-release/identity`; `skip_specs: true` không phù hợp. Có đủ ranh giới để review Proposal/Analysis, nhưng requirement-level public GA label và release-identity semantics chưa được authority quyết định. Kết luận hiện tại: `BLOCKED_NEEDS_REVIEW`. Không viết Specs cho đến khi Gate 1 trả lời cụ thể các câu hỏi dưới đây và phê duyệt exact Proposal/Analysis sau revision cần thiết.

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

`UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES` cho giai đoạn sau. Đây là thay đổi nhỏ tại shell/footer hiện hữu, không phải page mới hoặc redesign. Web có vùng footer cuối trang sau ©; Backoffice có `AppFooter` dưới `AppMain` trong authenticated frame. `Projet pilote` trên Web và `v1.0.0` trên Backoffice cần quyết định copy để không tạo release claim sai. Không có page pack riêng cho hai shell trong scope kiểm tra.

`UI_UX_PRO_MAX_USAGE: OPTIONAL`; Reason: chỉ cần hiển thị metadata kín đáo trong footer hiện hữu, YUTA UI authority và Browser QA đủ định hướng; Scope: Web marketing footer và Backoffice authenticated shell; Decision source: Gate 1 review của change này (pending). External advisory `NOT USED`; không có query, installation hoặc external evidence.

## Conflicts and Unknowns

- `NEEDS REVIEW` (requirement-level): Chưa thấy convention có thẩm quyền cho nhãn công khai `GENERAL_AVAILABILITY`; Gate 1 chọn chính xác `Stable` hay `GA` (hoặc chỉ định nguồn authority hiện có). Không đưa cả hai vào Specs như một nhãn thay đổi tùy ý.
- `NEEDS REVIEW` (requirement-level): Xác nhận Product Release identity có chỉ là tuple Product + Stage + Version + release name, hay cần một stable identifier riêng. Không tự thêm ID, storage hoặc cơ chế phân phối.
- `NEEDS REVIEW` (public copy): Xác nhận cách xử lý `Projet pilote · Déployé sur Vercel` tại Web footer khi hiển thị Alpha; có thể giữ claim đúng, sửa, hoặc bỏ nhưng không tự cho rằng “pilot” tương đương Product Stage.
- Existing `Backoffice v1.0.0` là implementation divergence với candidate release, không phải authority chấp thuận `v1.0.0`; phải được thay bằng một authority duy nhất sau Gate 1. Không tìm thấy conflict giữa candidate và accepted ADR/runtime/data boundary.
- Sensitive Design Gate: chưa triggered. `CROSS_MODULE` tự nó không đủ; không thấy security/auth, runtime/data ownership, migration, provider, irreversible operation hoặc durable cross-module boundary cần đổi. Phải tái đánh giá nếu later Specs/Design phát hiện một boundary như vậy.

## Analysis Conclusion

Bounded `CROSS_MODULE` scope và new capability path được xác nhận; owner `@yuta/core`, independent package versions, hai direct UI consumers, và không database/API/tenant scope là khuyến nghị cho Gate 1, chưa là Product approval. `BLOCKED_NEEDS_REVIEW` cho đến khi Product/Control Tower quyết định các câu hỏi requirement-level và chấp nhận exact scope/authority. Gate 1 là điểm dừng hiện tại; không tạo Specs, Design, Tasks hoặc implementation.
```

## Gate 1 questions requiring exact Product/Control Tower decision
1. Chấp nhận hoặc sửa Product Release candidate YUTA / ALPHA / Alpha / 0.1.0-alpha.1 / Foundation và compact representation YUTA Alpha · v0.1.0-alpha.1?
2. Chấp nhận đúng sáu maturity stages, stage → label mapping, và chọn một nhãn canonical cho GENERAL_AVAILABILITY: Stable hay GA?
3. Product Release identity là tuple Product + Stage + Product Version + release name, hay cần một stable identifier riêng? Nếu cần, định nghĩa mục đích/authority trước Specs.
4. Xác nhận package.json versions tiếp tục là package/workspace metadata độc lập, không đồng bộ tự động với Product Version?
5. Xác nhận @yuta/core là shared authority candidate và Web/Backoffice là hai direct consumers; packages/ui chỉ dùng khi có primitive trung lập thực sự; các runtime còn lại không đổi trong scope này?
6. Chọn cách xử lý Web footer Projet pilote · Déployé sur Vercel khi thêm Alpha và thay Backoffice v1.0.0; xác nhận release label không hàm ý capability readiness/deployment?
7. Chấp nhận UI_UX_PRO_MAX_USAGE: OPTIONAL / NOT USED và Browser QA bắt buộc sau Apply/VERIFY?

## Recommendation and stop
Analysis conclusion BLOCKED_NEEDS_REVIEW: các câu hỏi 2, 3, 6 ảnh hưởng precise requirements; generic approval không đủ. Trả lời cụ thể, revise Proposal/Analysis nếu quyết định thay đổi exact content, tạo packet Gate 1 mới và review lại trước Specs. Không có Product Decision, implementation, VERIFY, QA hoặc release authorization được promotion tại gate này.

## Exact artifact hashes
Tool/command: Get-FileHash -Algorithm SHA256 trên exact file bytes; hashes lowercase. Path set chỉ gồm hai artifacts dưới đây.

| Repository-relative path | SHA-256 |
| --- | --- |
| `openspec/changes/product-version-management-foundation/proposal.md` | `818d4cac9302da7fa6b61871d9eaa960dd51dca544b09adba6707db05df59e23` |
| `openspec/changes/product-version-management-foundation/analysis.md` | `54aa1c7d17c7623d45658073f7abee749bbec0fc4b19bc63814d736a5af7a580` |

No approval recorded. Sync authorization: PENDING.
