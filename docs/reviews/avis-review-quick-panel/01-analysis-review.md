Change: avis-review-quick-panel
Gate: 1
Review status: APPROVED
Created: 2026-10-03
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: NO

## Request and delegation

The current user requested opening a review in a modal sliding from the right for quick viewing/processing, replacing inline detail, then selected CODEX_ONLY and COMMIT_AFTER_TASK: YES. Scope: Avis only; preserve existing forms, tenant/security/provider semantics, list context and Satisfaction. No spec sync/archive or remote/production action.

## Authorities and review criteria

Use the sources in Analysis; verify sourced requirement, four-part baseline, scope/ownership, lifecycle separation and requirement readiness. No unresolved Product authority question was identified by author; reviewer must decide independently.

## Exact candidate

| Path                                                 | SHA-256                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/avis-review-quick-panel/proposal.md | e3e7f15fc00eeded6794895d094df89cb40fd29fb6606f215aa0c06d76b6cbb1 |
| openspec/changes/avis-review-quick-panel/analysis.md | 626934bbc9b49bfc53d4f1f5f0538ffde08d347144da4d2efa67e311f0a4e779 |

Hash command: Get-FileHash -Algorithm SHA256 over exact bytes.

## Exact proposal content

## Why

Ở trang Avis, phần chi tiết xếp dưới danh sách trên màn hình hẹp khiến người dùng phải cuộn xuống để xử lý rồi cuộn lên để chọn avis tiếp theo. Người dùng yêu cầu chọn một review để mở modal trượt từ phải vào cho việc xem và xử lý nhanh.

## What Changes

- Trang `/visibilite-reputation/avis` dùng modal bên phải thay cho detail trong bố cục trang, với nội dung và các form hiện có.
- Modal mở khi chọn avis hoặc truy cập URL có `selected`; hiển thị trạng thái đang tải đúng avis, hỗ trợ đóng và quay lại danh sách.
- Giữ bộ lọc, trang phân trang, vị trí cuộn và focus khi mở/đóng; mobile dùng chiều rộng màn hình.
- Cập nhật tài liệu hiện hành, kiểm thử và Browser QA cho phạm vi này.

## Capabilities

### New Capabilities

- `reputation/review-quick-panel`: Trình bày và tương tác xem/xử lý nhanh avis qua modal bên phải.

### Modified Capabilities

Không thay đổi yêu cầu của retrieval, notes, status hoặc draft persistence hiện có.

## Impact

`PAGE_LOCAL`: Backoffice Avis UI, kiểm thử và tài liệu Reputation. Dùng `DialogContent variant="right-panel"` đã được export từ `@yuta/ui`. Không thêm dependency, API, schema, permission hoặc provider action; Satisfaction giữ bố cục hiện tại.

## Task context and REQUIREMENT_BASELINE

- `COLLABORATION_MODE: CODEX_ONLY`; nguồn: câu trả lời hiện tại `CODEX_ONLY — COMMIT_AFTER_TASK: YES`.
- `COMMIT_AFTER_TASK: YES`; `COMMIT_SELECTION_SOURCE`: cùng câu trả lời của người dùng.
- Yêu cầu: chọn review mở modal trượt từ phải để xem/xử lý nhanh, thay phần detail bên dưới list.
- Ràng buộc: reuse UI/form; French UI; server auth/tenant và provider semantics giữ nguyên.
- Ngoài phạm vi: Satisfaction redesign, AI/publication, retrieval redesign, DB/API/permission, production/deploy/push, spec sync/archive.
- Kết quả quan sát: modal đúng avis trên 1440/1024/768/390; đóng trở lại đúng trang/bộ lọc/vị trí/focus; lưu xử lý hiện có hoạt động và có feedback; không overflow, console/hydration error.

## Exact analysis content

# Change Analysis

## Scope and Change Type

Thay tương tác trình bày detail của trang Avis bằng modal bên phải. `PAGE_LOCAL`, behavioral/UI-affecting, không thay data/security/provider contract. Task dùng `CODEX_ONLY`, `COMMIT_AFTER_TASK: YES` từ câu trả lời hiện tại của người dùng; phạm vi và REQUIREMENT_BASELINE ở `proposal.md` giữ nguyên.

## Sources Consulted

- [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Reputation home](../../../docs/features/reputation/README.md), [Google retrieval spec](../../specs/reputation/google-review-retrieval/spec.md).
- [Root instructions](../../../AGENTS.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md), [UI workflow](../../../docs/ui/README.md), [Frontend rules](../../../docs/ui/YUTA_FRONTEND_RULES.md), [Backoffice UI rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [External advice](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- `reviews-page.tsx`, `reviews-list-panel.tsx`, `reviews-loader.tsx`, `review-detail.tsx`, `review-reply-form.test.tsx`, `packages/ui/src/dialog.tsx` và public export catalog.
- [Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [QA protocol](../../../docs/YUTA_QA_PROTOCOL.md), activation/normativity policy hiện hành.

## Authority and Product Decision

Yêu cầu hiện tại của người dùng quyết định modal cho xem/xử lý nhanh. Các quyết định Reputation hiện hành tiếp tục chi phối dữ liệu, quyền và xử lý. Không suy ra quyền publish, AI hoặc hoạt động Google mới từ thay đổi UI. Satisfaction không thuộc yêu cầu này.

## Current Implemented State

`ReviewsPage` dùng grid hai cột tại `xl`, trước breakpoint đó detail nằm sau toàn bộ list. Chọn review cập nhật `selected` với `scroll: false` nhưng xóa `page` khi không cung cấp page mới. Loader mặc định lấy detail đầu tiên khi URL không chọn review; dữ liệu và forms đã có. `@yuta/ui` đã export Dialog có variant `right-panel`. Không có Page Pack riêng cho Avis; pack Satisfaction có scope riêng và không được chỉnh sửa. Browser QA cũ không chứng minh UX mới hoặc runtime đang triển khai.

## Affected Boundaries

Owner là `apps/backoffice`; persisted work vẫn thuộc `@yuta/db-cloud` qua server actions hiện có. Session/membership/tenant và STAFF assigned-only giữ nguyên. Không đổi contract, migration, retrieval admission, provider gọi thực, UI package hay shell/navigation. Khắc phục mất page khi chọn/đóng là phần bảo toàn ngữ cảnh danh sách của tương tác mới.

## Lifecycle Baseline

Theo Reputation home/registry: nền tảng inbox và manual draft có implementation; broader provider V1 chưa được giải quyết ngoài bounded A. Environment vẫn chưa được xác minh bởi task; production/provider prerequisites không thay đổi. Không cập nhật lifecycle/readiness từ kết quả UI.

## Requirement Readiness

Có thể mô tả yêu cầu cụ thể từ yêu cầu modal hiện tại và hành vi xử lý đã có. Đây là thay đổi interaction, dùng capability mới `reputation/review-quick-panel`; không dùng `skip_specs`.

## UI / UX Applicability

`UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES`.

`UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE`

Reason: Yêu cầu đã chọn pattern modal cụ thể, primitive và application precedent đã có; không có câu hỏi external design cần giải quyết.

Scope: Avis quick panel.

Decision source: Yêu cầu người dùng và current shared Dialog contract.

## Conflicts and Unknowns

Không có requirement-level conflict. Modal close là hành động thoát, không Save hoặc publish; chỉ các Save hiện có mới persist. Design xác định mechanics loading/focus và giữ query. QA dùng dữ liệu local synthetic với server route thật, không thử Google thật; không có claim provider readiness.

## Analysis Conclusion

`READY_FOR_SPECS`. Bounded capability `reputation/review-quick-panel` được phép gửi independent Gate 1 review. Sensitive change: NO. Chưa có approval ở đây.

## Independent approval

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Mode selection source: current user CODEX_ONLY — COMMIT_AFTER_TASK: YES for Avis quick panel.
Independent reviewer: /root/quick_panel_gate1
Independent review evidence: APPROVED; no material scope, authority or readiness blocker; exact two artifact hashes rechecked after verdict.
Approval recorded by: Codex workflow
Approved: 2026-10-03T08:22:30.2099714+02:00

## Language correction and current candidate

Historical approval above applies only to the older Vietnamese bytes. Current-user English technical-documentation instructions take precedence over CLI context; wording translated without behavior/scope changes. Historical Gate 1 approval INVALIDATED_BY_ARTIFACT_CHANGE. Fresh independent review required.

Current path: openspec/changes/avis-review-quick-panel/proposal.md
Current SHA-256: 3a6af2fb08ab7cc6c6ae98fa74bebdd3b39041f89c29845949123d2fadce8c62

## Why

On Avis, detail appears after the entire list below the wide-screen breakpoint. Users must scroll down to process an item and back up to choose another. The current user requested a modal sliding in from the right for quick viewing and processing.

## What Changes

- Replace inline detail on `/visibilite-reputation/avis` with a right-side modal containing the existing review information and forms.
- Open it on explicit selection or a `selected` URL, with truthful loading and unavailable states.
- Preserve filters, ordering, pagination, list scroll and return focus when opening/closing; use full width on mobile.
- Update current Reputation documentation, tests and responsive Browser QA.

## Capabilities

### New Capabilities

- `reputation/review-quick-panel`: Quick viewing and processing of an Avis item in a right-side modal.

### Modified Capabilities

Existing retrieval, notes, status and draft-persistence requirements remain unchanged.

## Impact

`PAGE_LOCAL`: Backoffice Avis presentation, tests and Reputation documentation. Reuse the exported `DialogContent` right-panel variant. No dependency, API, schema, permission or provider-action change. Satisfaction retains its current layout.

## Task context and REQUIREMENT_BASELINE

- `COLLABORATION_MODE: CODEX_ONLY`; source: current-user reply `CODEX_ONLY — COMMIT_AFTER_TASK: YES`.
- `COMMIT_AFTER_TASK: YES`; `COMMIT_SELECTION_SOURCE`: the same current-user reply.
- Requirement: choosing a review opens a modal sliding from the right for quick viewing/processing, replacing inline detail.
- Hard constraints: reuse existing UI/forms; French UI; preserve server auth/tenancy and provider semantics.
- Out of scope: Satisfaction redesign, AI/publication, retrieval redesign, DB/API/permissions, production/deployment/push, spec sync/archive.
- Observable outcomes: correct item in the modal at 1440/1024/768/390; closing preserves page/filter/scroll/focus; existing explicit Saves persist with feedback; no overflow or console/hydration errors.

Current path: openspec/changes/avis-review-quick-panel/analysis.md
Current SHA-256: 8c1143c0c07fd9e9af68baa44ec60554c6f4e81b48ed8a47cf2409b329e2e332

# Change Analysis

## Scope and Change Type

Replace the Avis inline detail presentation with a right-side modal. `PAGE_LOCAL`, behavioral and UI-affecting; no data/security/provider-contract change. `CODEX_ONLY` and `COMMIT_AFTER_TASK: YES` come from the current user's reply. The Proposal's bounded scope and REQUIREMENT_BASELINE apply.

## Sources Consulted

- [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Reputation home](../../../docs/features/reputation/README.md), [Google retrieval spec](../../specs/reputation/google-review-retrieval/spec.md).
- [Root instructions](../../../AGENTS.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md), [UI workflow](../../../docs/ui/README.md), [Frontend rules](../../../docs/ui/YUTA_FRONTEND_RULES.md), [Backoffice UI rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [External advice](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- `reviews-page.tsx`, `reviews-list-panel.tsx`, `reviews-loader.tsx`, `review-detail.tsx`, `review-reply-form.test.tsx`, `packages/ui/src/dialog.tsx` and its public export catalog.
- [Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [QA protocol](../../../docs/YUTA_QA_PROTOCOL.md), current activation/normativity policy.

## Authority and Product Decision

The current user's request chooses the modal for quick viewing/processing. Current Reputation decisions still govern data, authorization and processing. This presentation change grants no new publication, AI or Google activity. Satisfaction is outside the request.

## Current Implemented State

`ReviewsPage` uses two columns at `xl`; narrower screens render detail after the entire list. Selection updates `selected` with `scroll: false` but deletes `page` unless a new page is supplied. The loader defaults to the first item's detail without explicit URL selection; existing data and forms are implemented. `@yuta/ui` already exports Dialog with a right-panel variant. Avis has no separate Page Pack; the Satisfaction pack has its own excluded scope. Earlier Browser QA does not verify the new UX or the currently deployed runtime.

## Affected Boundaries

`apps/backoffice` owns presentation; persisted work remains in `@yuta/db-cloud` through existing server actions. Session/membership/tenant and STAFF assigned-only restrictions remain. No contract, migration, retrieval-admission, real-provider request, shared UI, shell or navigation change. Preserving pagination during opening/closing is part of the requested list-context continuity.

## Lifecycle Baseline

The Reputation home/registry record implemented inbox and manual-draft foundations, with broader provider V1 unresolved outside bounded A. Environment is not verified by this task and production/provider prerequisites remain. UI evidence does not promote lifecycle/readiness.

## Requirement Readiness

The current modal request and existing processing semantics support precise observable requirements. This interaction change introduces `reputation/review-quick-panel`; it does not use `skip_specs`.

## UI / UX Applicability

`UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES`.

`UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE`

Reason: The user selected a concrete modal pattern, and the primitive/application precedent already exists; there is no external design question to resolve.

Scope: Avis quick panel.

Decision source: Current-user request and existing shared Dialog contract.

## Conflicts and Unknowns

No unresolved requirement-level conflict. Closing leaves the editor and never Saves or publishes; existing explicit Saves remain the persistence boundary. Design resolves loading/focus/query mechanics. QA uses synthetic local data with the real server route, without real Google access or provider-readiness claims.

The CLI requests Vietnamese artifacts, while the current user's root instructions require English technical documentation. The current-user instruction controls these artifacts; they are written in English with French product UI. This resolves language only and changes no requirement.

## Analysis Conclusion

`READY_FOR_SPECS`. Submit bounded `reputation/review-quick-panel` to independent Gate 1 review. Sensitive change: NO. This analysis is not approval.

## Current English candidate approval

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Independent reviewer: /root/quick_panel_gate1_english
Independent review evidence: APPROVED; no material findings; exact current English proposal/analysis hashes rechecked.
Approval recorded by: Codex workflow
Approved: 2026-10-03T08:27:12.8034708+02:00
