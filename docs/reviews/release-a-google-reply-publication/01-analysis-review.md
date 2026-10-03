Change: release-a-google-reply-publication
Gate: 1 — Analysis
Review status: APPROVED
Created: 2026-10-02
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES

# Analysis review

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW.
Mode selection source: current user CODEX_ONLY / YES and "Hoàn thiện Release A trên local trước".
Independent reviewer: /root/review_google_publication_analysis (fresh context, read-only).
Independent review evidence: historical APPROVED at 2026-10-02T21:37:52Z; proposal/analysis identities matched. The packet SHA was transcribed with one extra character; correct original packet identity was 5fc81757c16b567418cac56fd68a981f52c9327de573fa484889ddf6b0f78a9b. A combined orchestration incorrectly continued to approval metadata after the hash preflight exited nonzero. No Specs or Apply followed. Current packet bookkeeping is awaiting an independent integrity correction review before further work; the earlier verdict and exact unchanged artifact identities remain historical.
Approval recorded by: Codex workflow.
Prior verdict time: 2026-10-02T21:37:52Z. Current approval: PENDING integrity correction review.

Replacement approval: APPROVED at 2026-10-02T21:40:54Z by /root/review_google_publication_analysis. Current reviewed packet identity 4f87b7cb93e98cf4b025c4e8b71369471c3c2ddc631139156c51ef62d1ddd119 and both unchanged source artifact identities rechecked successfully by reviewer and author before this record. Reviewer reconstructed the original packet byte identity by preserving its mixed line endings. The earlier orchestration failure remains recorded; no Specs/Apply had followed it. Approval source remains USER_DELEGATION_WITH_INDEPENDENT_REVIEW; all retained obligations still apply.
Approved: 2026-10-02T21:40:54Z.

Retained reviewer obligations: separate provider acknowledgment/moderation/reconciliation; enforce the 4096-byte provider limit without changing normal 4000-character draft Save; resolve durable uncertain outcome, exact version/session/binding fences, operation-specific credentials and disclosed remote race in Sensitive Design. Real target/text consent and provider eligibility remain absent. No real dispatch or readiness follows from this verdict.

Reviewer verified live HEAD f211026c0b598702506c7680230b360b197c757b; intervening POS/public source decomposition has no Backoffice/db-cloud/Reputation source drift. Historical local trial summaries: `.tmp-google-connect/retrieval-completion-reviewed.json` and `.tmp-google-connect/retrieval-completion-review.json`; 14 referenced evidence hashes matched. These ignored, sanitized summaries qualify the one-page/internal-only historical claim, not current A acceptance.

The current user requests completion of Google Release A on local before any customer environment. Current task selection is CODEX_ONLY / COMMIT_AFTER_TASK YES, both sourced to the explicit current-user answer. The repository already accepts A-only OWNER/MANAGER explicit publication under RR-02, including final-text confirmation separate from draft Save. This packet asks independent review of bounded requirement readiness, not permission to dispatch a real reply.

Task scope: local Backoffice 3101, real Google retrieval qualification plus a bounded manual publication feature with reconciliation and safe recovery. No staging/production, AI, scheduled provider synchronization, bulk publication, reply deletion, account changes or lifecycle promotion. No real reply has a Human-approved target/text yet. Later actual dispatch must stop for that specific decision.

Baseline HEAD: 3e5f5738c17e8f9139bd64dea5a64c94d49ad789. Unrelated dirty work in public apps/POS/Site Agent/contracts local-pos and the POS operator change is outside scope. Backoffice/db-cloud/Reputation target paths are clean; only this change's new planning artifacts exist. No implementation or database mutation in this change yet.

## Reviewed artifact identities

Command: `Get-FileHash <exact paths> -Algorithm SHA256`, lowercase output recorded below.

| Path                                                            | SHA-256                                                          |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/release-a-google-reply-publication/analysis.md | 4ccd371270602f9ec7f8d929ff66ffbeed26b37efe5b69bc33dd593538d58673 |
| openspec/changes/release-a-google-reply-publication/proposal.md | 5cc995c3143cf467eb4cda009a38884548717f17783349418b2ea1daec525cad |

## Authorities and review criteria

Read root/scoped AGENTS; `docs/AUTHORITY_MODEL.md`; `docs/PRODUCT_RELEASE_ROADMAP.md` RR-02/RR-03; Reputation README/STATUS; ADR-009; main Google retrieval, A exposure and draft pending specs; current provider client, token accessor, reply form/actions and db-cloud schema/repository. Exact sources are linked in Analysis.

Check the sourced four-part requirement baseline, A-only authority versus broad V1/lifecycle, retained security/runtime/cache boundaries, explicit final Human consent, absence of requirement-changing assumptions and the proposed OPTIONAL/NOT USED UI advisory classification. Inspect provider PUT create/replace semantics and the disclosed absence of documented remote CAS/idempotency. Review pending design questions independently; do not treat source presence or earlier one-page internal-profile QA as full A completion. Historical failures/blockers remain historical.

No requirement-level conflict is claimed by the author; unresolved technical fencing/timeout/remote-race choices are Design concerns. No exact real publication consent exists. Recommendation: independent reviewer to decide APPROVED, CHANGES_REQUESTED or BLOCKED before Specs. Author cannot self-approve.

## Exact proposal content

## Why

Google đã kết nối và lần thử local đã lấy 50 đánh giá thật, nhưng lần thử dùng profile `internal`; nút đăng trả lời vẫn bị khóa và chưa có thao tác provider hay đối chiếu kết quả. Người dùng yêu cầu hoàn thiện toàn bộ Google Release A trên local trước, theo chuỗi A-only đã chốt tại RR-02/RR-03.

## What Changes

- Bổ sung xác nhận văn bản cuối cùng và đăng từng bản nháp Google bằng OWNER/MANAGER; Save vẫn chỉ lưu bản nháp. STAFF chỉ chuẩn bị bản nháp cho đánh giá được giao.
- Ràng buộc xác nhận với đúng phiên bản bản nháp, người thao tác, phiên đăng nhập, tổ chức, nhà hàng và binding Google còn hiệu lực.
- Ghi nhận lần thử đăng và kết quả; đối chiếu bằng đọc Google trước khi xác nhận thành công hoặc cho phép thử lại sau kết quả không rõ. Không tự đăng lại.
- Giao diện hiển thị đúng trạng thái đang đăng, đã được Google xác nhận, thất bại, chưa xác định và bản nháp đã thay đổi; dùng đúng profile `release-a` trong bàn giao local.
- Kiểm chứng chuỗi lấy trang gần đây/lịch sử, làm mới không trùng trong thời hạn mapping, chi tiết, Save, xác nhận và phục hồi trong phạm vi local. Đăng thật chỉ thực hiện sau khi Human duyệt đúng đánh giá và nội dung cụ thể.

### REQUIREMENT_BASELINE

- Authoritative user requirement: "ok, tiếp theo làm gì, tôi muốn hoàn thành hết phần GG này"; lựa chọn phạm vi "Hoàn thiện Release A trên local trước".
- Hard constraints: local Backoffice 3101 và cloud DB local; kế thừa RR-02/RR-03, tenant/session/role guards, temporary provider cache, local work độc lập; không đụng thay đổi đang dở ngoài task.
- Out of scope: staging/production, customer activation, AI, scheduled provider sync, bulk publication, xóa trả lời Google, thay đổi tài khoản Google, rộng hơn Google A hoặc tự nâng readiness/version/lifecycle.
- Observable success outcomes: menu và direct access đúng A; dữ liệu Google có receipt và cache hợp lệ; bản nháp không tự đăng; người có quyền xác nhận đúng nội dung; không báo thành công khi outcome chưa rõ; replay/stale/cross-tenant/STAFF bị từ chối; thao tác tiếp theo rõ ràng.

COLLABORATION_MODE: CODEX_ONLY.
MODE_SELECTION_SOURCE: current user reply "CODEX_ONLY, YES" for this completion task.
COMMIT_AFTER_TASK: YES.
COMMIT_SELECTION_SOURCE: same explicit current-user reply. Commit chỉ sau nghĩa vụ hoàn thành, chỉ phần task được cô lập.

## Capabilities

### New Capabilities

- `reputation/google-reply-publication`: xác nhận và đăng một phiên bản bản nháp Google, ràng buộc quyền và binding, ghi lần thử, đối chiếu kết quả, retry thủ công an toàn.

### Modified Capabilities

Không thay đổi yêu cầu retrieval/exposure hoặc Save pending hiện có. Mọi khóa bổ sung khi đang đăng hoặc outcome chưa rõ thuộc capability publication mới; cơ chế lưu bản nháp thông thường phải giữ hợp đồng hiện tại.

## Impact

Backoffice sở hữu server actions/provider client và giao diện Avis hiện có; `@yuta/contracts` sở hữu payload an toàn; `@yuta/db-cloud` sở hữu persistence và migration của publication. Không thêm runtime/package/framework. Đây là sensitive external-effect/data/security change, cần independent Analysis, Specs, Sensitive Design và final reviews trước các bước phụ thuộc.

Authority: `docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions`, `docs/features/reputation/README.md`, ADR-009, main retrieval/exposure/draft specs và scoped AGENTS. Google `reviews.updateReply` tạo hoặc thay thế một trả lời; thiết kế phải tránh ghi đè thay đổi remote chưa được Human xác nhận. Real publication phải có đúng target/text cụ thể được người dùng duyệt.

## Exact analysis content

# Change Analysis

## Scope and Change Type

Behavioral, UI/data/security/external-provider sensitive; PAGE_LOCAL presentation và CROSS_MODULE Backoffice/contracts/db-cloud ownership. Phạm vi là Google A trên local 3101 theo yêu cầu và lựa chọn hiện tại, không phải toàn bộ Reputation/Google V1 hoặc production. Mode/commit và REQUIREMENT_BASELINE tại [Proposal](proposal.md) là sticky cho task này.

## Sources Consulted

- [RR-02/RR-03](../../../docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions), [Reputation home](../../../docs/features/reputation/README.md#bounded-release-a-google-review-retrieval), [tracker](../../../docs/features/reputation/STATUS.md).
- [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Authentication](../../../docs/architecture/AUTHENTICATION.md), [ADR-009](../../../docs/decisions/ADR-009-release-a-customer-exposure.md).
- Root/scoped `AGENTS.md`, [workflow delegation](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review), active OpenSpec activation/normativity policies.
- Main specs: [retrieval](../../specs/reputation/google-review-retrieval/spec.md), [A exposure](../../specs/backoffice/release-a-customer-exposure/spec.md), [draft Save](../../specs/reputation/reply-draft-pending-feedback/spec.md).
- Current provider client/token access, Avis reply form/actions/loaders, db-cloud reputation schema/repository và existing targeted tests.
- [Google updateReply](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/updateReply), [review guide](https://developers.google.com/my-business/content/review-data), [API policies](https://developers.google.com/my-business/content/policies), checked 2026-10-02. API PUT creates/replaces a reply for a verified location; policy requires business-owner authorization. Không suy ra provider readiness từ docs.

## Authority and Product Decision

RR-02 đã chốt A-only Google và OWNER/MANAGER explicit approve/publish, author được tự approve nếu có role; STAFF chỉ assigned drafts. Save không approve, nội dung đã đổi không kế thừa approval. RR-03 chốt năm surfaces, Google-only Today và local handling metrics. Current user yêu cầu hoàn tất trên local, CODEX_ONLY/YES, cung cấp bounded delivery authority; không cấp quyền tự chọn nội dung rồi đăng vào Google.

Các AVIS/global V1 và registry values chưa được chốt rộng hơn vẫn giữ nguyên. RR-02 là ngoại lệ có attribution cho A, không thay thế rộng hơn Product home. Publication tạo hoặc thay thế reply tại đúng target được xác nhận; UI phải làm rõ khi target đang có remote reply. Một remote update mới phát hiện trước dispatch phải yêu cầu xem/xác nhận lại; không hứa API có atomic precondition mà Google không tài liệu hóa.

## Current Implemented State

OAuth, mã hóa token, token refresh, discovery/binding và một retrieval pipeline default-disabled đã có. Một local trial có 50 reviews/receipt thật, independent APPROVED, nhưng dùng `internal`, chỉ một recent page, sau đó đã tắt retrieval và dọn provider cache. Receipt/work/drafts/notes giữ lại. Đây không phải full A runtime QA, history, refresh-token, live publication hay operational disposal proof.

Reply Save persist local Google drafts; permission `reputation.reply.publish` đã có OWNER/MANAGER, nhưng button disabled, không có provider PUT, attempt/outcome fencing hay publication reconciliation. Cached remote reply hiện là provider copy có deadline, không phải local PUBLISHED evidence. Token accessor cho captured binding hiện gắn với retrieval admission/grant; reuse cho publication phải được review đúng operation-specific boundary, không làm yếu guard retrieval.

## Affected Boundaries

Backoffice server sở hữu external effect; db-cloud sở hữu scoped transactions và attempt persistence; contracts sở hữu browser-safe validated requests. Valid session, active membership, entitlement, role, target visibility và current binding phải được enforce độc lập availability. Provider reference/content giữ deadlines hiện hành; user-input drafts/notes/work giữ lifetime độc lập. Không ảnh hưởng POS, Display, public Feedback/Booking hoặc grant mới.

## Lifecycle Baseline

Registry bounded inbox: APPROVED / IMPLEMENTED / UNVERIFIED / BLOCKED / BLOCKED. Connector: NOT_DECIDED / IMPLEMENTED / UNVERIFIED / BLOCKED / BLOCKED. Broad synchronization slice: NOT_DECIDED / NOT_STARTED / UNVERIFIED / BLOCKED / BLOCKED. Những giá trị này phân biệt scope broad với bounded implemented A retrieval; change này không promote chúng. Real local receipt là scoped evidence, không readiness.

## Requirement Readiness

READY_FOR_SPECS. Có thể viết yêu cầu cho exact-content confirmation, single explicit dispatch, truthful confirmed/failed/uncertain states, read-before-retry và guards mà không invent Product role, batching hay scheduler. Thiết kế phải review version binding, concurrency, persistence, timeout, provider result validation và rollback; không chọn technical architecture trong Analysis.

## UI / UX Applicability

EXISTING_PAGE, integrated interaction trong Avis reply section; giữ shell và French UI, reusable `@yuta/ui`, semantic tokens/lucide. UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES. Shared/app UI rules đã đọc; không có page pack publication riêng, không tạo pack chỉ để đáp ứng nghi thức.

UI_UX_PRO_MAX_USAGE: OPTIONAL.
Reason: bounded existing form/confirmation/outcome interaction; existing UI catalog và standards đủ, không redesign.
Scope: Avis manual Google publication.
Decision source: current accepted RR-02 và bounded task; Gate 1 reviewer xác nhận classification.
Usage: NOT USED.

## Conflicts and Unknowns

- NEEDS REVIEW (Design): Google PUT không công bố conditional compare-and-swap hay idempotency key. Không được hứa exactly-once hoặc chống mọi remote race. Outcome không rõ phải giữ riêng, đọc xác nhận trước retry, không tự PUT lại; phải trình bày giới hạn residual dispatch race.
- NEEDS REVIEW (Design): approval/version/attempt fencing và stale authority trước dispatch/result; provider identifiers không được trở thành permanent attempt history.
- NEEDS REVIEW (QA/operations): actual local history/replay/refresh/detail recovery, token expiry recovery và disposal. Không repoint guarded integration tests vào persistent local DB.
- Human-required final action: một real publication cần người dùng chọn target/text và approve cụ thể. Chưa có target/text được duyệt; tác vụ đó chưa được phép thực hiện. Chuẩn bị feature và kiểm thử an toàn vẫn được phép.
- Staging/production, API project qualification, unattended cleanup/backups và rộng hơn V1 nằm ngoài local delivery; giữ trạng thái thiếu chứng cứ tương ứng.

## Analysis Conclusion

READY_FOR_SPECS cho `reputation/google-reply-publication`; skip_specs không áp dụng. Sensitive Design independent approval cần trước migration/source Apply. Existing lịch sử FAIL/BLOCKED và other dirty work giữ nguyên. Gate 1 chỉ review scoped requirement readiness, không thực hiện external publication hoặc promote readiness.
