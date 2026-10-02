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
