## Purpose

Capability cho phép người có quyền xác nhận và đăng một phiên bản bản nháp tới đúng Google review của nhà hàng đang hoạt động, với evidence và phục hồi trung thực. Việc gửi, Google ghi nhận, moderation và local draft là các sự kiện độc lập.

## ADDED Requirements

### Requirement: Publication admission is explicit and independent

Publication SHALL default-disabled và chỉ được admit bằng server-owned cấu hình hợp lệ. Missing/false/invalid admission SHALL từ chối preview, dispatch và reconciliation trước credential/provider effects. Availability và authorization SHALL được enforce độc lập; setup, retrieval, Save, page load, Today và prefetch SHALL NOT đăng trả lời. Bật local SHALL NOT activate staging/production.

#### Scenario: Publication disabled

- **WHEN** caller invoke publication khi admission chưa bật
- **THEN** server SHALL không lấy token, gọi Google hoặc ghi publication attempt; UI SHALL hiển thị chưa khả dụng đúng trạng thái

### Requirement: Final saved version receives separate explicit confirmation

Save SHALL giữ hợp đồng bản nháp hiện tại và SHALL NOT approve/publish. Publication SHALL yêu cầu một thao tác riêng xác nhận đúng persisted draft version và final text cho đúng local review/active establishment. Server SHALL bind preview/confirmation với chính original actor, validated session, membership, organization/establishment và connector generation đã tạo preview; một valid actor/session khác SHALL không reuse authority đó. Preview SHALL cung cấp exact final text, giải thích công khai trên Google và hiển thị reply remote đang có nếu thao tác sẽ thay thế nó. Unsaved edits, changed draft, expired preview hoặc changed target/binding SHALL không dùng approval cũ. Không tự cắt/ngầm chỉnh nội dung.

#### Scenario: Draft edited after preview

- **WHEN** persisted content/version đổi sau preview nhưng caller gửi confirmation cũ
- **THEN** server SHALL từ chối dispatch và yêu cầu xem/xác nhận lại version mới

#### Scenario: Another actor or replacement login reuses confirmation

- **WHEN** một OWNER/MANAGER khác, phiên khác của cùng actor hoặc replacement login session gửi confirmation tạo dưới authority gốc
- **THEN** server SHALL từ chối trước credential/provider effects dù caller hiện có publication grant; caller SHALL cần fresh preview và explicit confirmation dưới authority hiện tại

#### Scenario: Save only

- **WHEN** actor lưu bản nháp hợp lệ
- **THEN** chỉ local draft/workflow SHALL được lưu; không provider reply effect hay publication approval

#### Scenario: Existing remote reply

- **WHEN** permitted actor chuẩn bị thay thế reply đang có
- **THEN** preview SHALL phân biệt reply hiện tại với exact final text mới; changed remote reply phát hiện trước dispatch SHALL hủy confirmation và yêu cầu preview mới

### Requirement: Trusted actor and live resource fences precede effects

Only authenticated active OWNER/MANAGER with existing publication/read grants, reputation entitlement và trusted active scope SHALL approve/publish/reconcile. STAFF SHALL chỉ giữ assigned-read/draft/note quyền hiện hành. Server SHALL validate session, membership, role, organization/establishment, draft ownership, current verified connector generation và eligible server-owned review reference before credential access/dispatch và before result persistence. Plain browser provider identifiers hoặc foreign/stale UUIDs SHALL NOT chọn target. Legacy/unmanaged rows without a verified permitted mapping SHALL không được đăng.

#### Scenario: Cross-tenant or STAFF action replay

- **WHEN** caller dùng foreign review/confirmation hoặc STAFF replay action
- **THEN** deny SHALL xảy ra trước token/provider effect và không disclose foreign draft, preview, receipt hay coverage

#### Scenario: Binding or authority revoked

- **WHEN** connector generation, session, membership hoặc grants mất hiệu lực trước dispatch/result persistence
- **THEN** server SHALL deny stale authority, không ghi success vào binding/scope mới và không tiếp tục bằng token của binding mới

### Requirement: Provider input and output validation preserve exact text

Publication SHALL validate Google's 4096-byte UTF-8 limit độc lập với existing 4000-character draft Save. Provider request SHALL nhắm server-verified scoped review và gửi exact confirmed text, có bounded timeout và không cache/log token/raw payload. Invalid/mismatched output SHALL NOT thành công. Google's acknowledgement SHALL không tự chứng minh public visibility.

#### Scenario: Multibyte draft exceeds provider limit

- **WHEN** bản nháp lưu hợp lệ nhưng UTF-8 vượt 4096 byte
- **THEN** publication SHALL bị từ chối trước provider call, giữ nguyên bản nháp và giải thích cần rút ngắn; không truncate

#### Scenario: Invalid provider result

- **WHEN** response malformed hoặc không xác nhận exact target/text
- **THEN** application SHALL không hiển thị published; outcome đã có dispatch SHALL giữ trạng thái chưa xác định để đối chiếu

### Requirement: One explicit dispatch has durable concurrency and replay fences

Before potential external write, YUTA SHALL persist một scoped attempt gắn đúng approval/version/actor/binding và có concurrency fence cho review. Concurrent clicks/replay SHALL không tự tạo PUT thứ hai. Dispatched text SHALL immutable cho attempt; một saved version mới SHALL không thừa hưởng approval/result cũ. Timeout, lost response, process exit hoặc ambiguous provider error SHALL giữ durable uncertain outcome thay vì definitive failure/success. Không hứa exactly-once remote semantics.

#### Scenario: Concurrent or replayed confirmation

- **WHEN** hai request cùng xác nhận một version hoặc request cũ được replay
- **THEN** tối đa một request SHALL claim dispatch; request còn lại SHALL nhận trạng thái persisted an toàn, không gửi PUT mới

#### Scenario: Save during publication

- **WHEN** user lưu text mới trong lúc version trước có dispatched/pending/uncertain attempt
- **THEN** dispatched version SHALL không đổi; bản nháp mới SHALL độc lập và không được báo đã approve/publish bởi attempt trước

#### Scenario: Caller disappears after dispatch

- **WHEN** process/request kết thúc khi outcome chưa được persist
- **THEN** expired local lease SHALL trở thành uncertain/reconcile-required, không automatically retry hoặc reset thành draft-only evidence

### Requirement: Reconciliation is a read and retry needs fresh consent

Permitted actor SHALL có explicit read-only reconciliation cho pending/uncertain result, dùng đúng verified binding/reference và immutable approved version. Matching exact remote text SHALL xác nhận trạng thái observed từ Google, không chứng minh actor duy nhất đã tạo text đó. Missing/different reply hoặc failed read SHALL không chứng minh previous PUT chưa xảy ra. Retry SHALL không tự chạy; chỉ fresh confirmation của cùng unresolved exact version sau reconciliation SHALL có thể gửi lại. Một khác-version publication SHALL bị chặn khi prior dispatched outcome vẫn chưa được giải quyết. Changed remote text SHALL cần new preview và consent; không overwrite âm thầm.

#### Scenario: Uncertain attempt now matches remote

- **WHEN** explicit reconciliation đọc được exact text đã xác nhận trên đúng review
- **THEN** YUTA SHALL cập nhật observed result/moderation, không PUT và không thay nội dung bản nháp mới hơn

#### Scenario: Uncertain attempt still absent or different

- **WHEN** đọc Google chưa xác nhận exact version
- **THEN** outcome SHALL vẫn trung thực chưa xác định; không gửi lại tự động hoặc tuyên bố thất bại chắc chắn; khác-version publication SHALL bị chặn

#### Scenario: Explicit same-version retry

- **WHEN** actor sau reconciliation xem lại cùng unresolved exact version và xác nhận retry riêng
- **THEN** server SHALL revalidate fences và remote preview trước một bounded explicit PUT; lịch sử attempt trước SHALL không bị biến thành success giả

### Requirement: Moderation and publication evidence remain distinct

UI/persistence SHALL phân biệt dispatching, uncertain, definite provider rejection/failure, remote-confirmed pending moderation, rejected moderation, approved moderation và unspecified/future state. Chỉ exact text được observed và Google state APPROVED SHALL được trình bày là đã được Google duyệt/PUBLISHED. PENDING SHALL nói chờ Google duyệt; REJECTED SHALL không published; absent/unknown state SHALL không hứa public visibility. Local reply/feedback status SHALL không làm bằng chứng remote. Publication SHALL không tự xử lý/reassign/close local work.

#### Scenario: Google accepts but pending moderation

- **WHEN** Google trả exact text với state PENDING
- **THEN** YUTA SHALL nói Google đã ghi nhận và đang chờ duyệt, không hiển thị published/public-visible success

#### Scenario: Rejected or unspecified moderation

- **WHEN** Google state REJECTED, absent hoặc unknown
- **THEN** UI SHALL thể hiện rejected hoặc visibility-unconfirmed tương ứng; không suy ra APPROVED

### Requirement: Minimized receipts and temporary provider metadata preserve work

Publication SHALL audit explicit confirmation, dispatch attempt, result và reconciliation với scoped actor/local identities và safe categories, không tokens/raw provider bodies. Provider IDs, review/reply content, fingerprints và preview metadata SHALL không trở thành permanent audit/attempt copies; eligible references/content SHALL giữ lifetime/disposal boundary hiện hành, preview chỉ còn hiệu lực trong bounded interval. Cleanup, failures, rebind và restoration SHALL không renew copied data hoặc xóa/ghi đè independent drafts, notes, assignments/work. Expired references SHALL chặn publication/reconciliation với honest recovery.

#### Scenario: Preview or reference expires

- **WHEN** confirmation metadata hoặc permitted review reference hết hạn
- **THEN** old confirmation SHALL không dispatch; maintenance SHALL dọn expired provider-derived preview fields, giữ local user-input work và minimized attempt receipt

#### Scenario: Cache cleanup after publication

- **WHEN** provider cache/metadata bị purge
- **THEN** independent draft/note/work and own audit receipt SHALL giữ nguyên; UI SHALL không invent permanent provider identity/publication visibility

### Requirement: Local Release A handoff reports actual scope and consent

Local QA/handoff SHALL dùng explicit `release-a` instance, preserved local DB/runtime boundary, canonical mounted retrieval và publication entry. Real provider retrieval evidence SHALL tách khỏi mocked publication tests và fixture rows. Full-history/refresh/reconciliation/denial/disposal limitations SHALL ghi đúng đã chạy/chưa chạy. A real publication trial SHALL chỉ dispatch sau Human xác nhận exact target/text; chưa có consent SHALL giữ task action pending, không fabricate QA PASS cho live publication, local commit completion hay readiness.

#### Scenario: Live reply consent missing

- **WHEN** feature/tests sẵn sàng nhưng chưa có Human-approved real target/text
- **THEN** YUTA/Codex SHALL bàn giao concrete usable flow, giữ live dispatch pending và báo rõ phần acceptance còn thiếu, không tự đăng test reply
