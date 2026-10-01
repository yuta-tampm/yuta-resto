## Why

RR-01–RR-03 đã chốt phạm vi Foundation/Release A, nhưng Backoffice hiện vẫn mở các module và dữ liệu ngoài A qua menu, deep link, API và Server Actions. Cần một profile khách hàng A do server chọn cho instance, độc lập với quyền truy cập, để năm bề mặt đã chốt có phạm vi nhất quán. Đây là nền tảng exposure, chưa phải toàn bộ Release A đã sẵn sàng.

## What Changes

- Thêm policy availability phía server cho profile `release-a` và chế độ `internal` riêng; browser không chọn hoặc mở rộng profile. Giữ các kiểm tra session, membership, permission, entitlement và record scope hiện có.
- Profile A chỉ mở Aujourd'hui, Google Avis, profile cơ bản, OWNER Google Integrations và Users & Access theo quyền hiện có. Chặn page/API/action ngoài A và cung cấp recovery phù hợp; bảo vệ cả các thao tác Knowledge nằm chung route profile.
- Google Avis chỉ đọc/chỉnh sửa bản ghi Google được phép, kể cả selected detail và gọi action trực tiếp. Today chỉ có Google: `new = NEW`; queue `NEW/TO_PROCESS/DRAFTED/FOLLOW_UP`; count, preview và linked list cùng source/status/actor scope.
- Profile cơ bản không đọc/serialize các section Restaurant Knowledge trong A. Menu, subsection, liên kết, return-to và trạng thái setup/empty dùng cùng phạm vi; không suy diễn import đã chạy hoặc provider reply từ dữ liệu local.
- Reconcile quyết định A trong các Product homes hiện có, bổ sung denial/regression tests và Browser QA cho candidate local với dữ liệu tổng hợp. Giữ chế độ nội bộ và các nguồn sự thật hiện có.

## Capabilities

### New Capabilities

- `backoffice/release-a-customer-exposure`: policy availability cho instance khách hàng A, các slice dữ liệu/thao tác và recovery nhất quán của năm bề mặt đã chốt.

### Modified Capabilities

- `restaurant-knowledge/concept-history`
- `restaurant-knowledge/cuisine-know-how`
- `restaurant-knowledge/customer-experience`
- `restaurant-knowledge/team-culture`
- `restaurant-knowledge/communication-identity`
- `restaurant-knowledge/validated-knowledge`
- `pointage/raw-clocking`
- `formalites/persistent-draft-foundation`
- `reputation/review-social-links-configuration`
- `authorization/formalites`
- `authorization/pointage`

Các capability trên nhận tiền điều kiện availability rõ ràng cho entry/UI/action/API do Backoffice host. Trong A các entry này không khả dụng; internal giữ requirements hiện có. Không đổi grants, data/domain semantics, public Feedback consumer hoặc independent employee authority. Chỉ tạo delta specs sau review, không sửa main specs trực tiếp.

## Impact

Ảnh hưởng `apps/backoffice` và query Google/queue có scope trong `packages/db-cloud`, tests và current docs liên quan. UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES. Sensitive: authorization-adjacent, dữ liệu cloud và boundary giữa module. Không thay đổi database shape, package/dependency, runtime ownership hoặc permission grants. Các owning Product homes được reconcile trước Specs; chưa có runtime edits.

## REQUIREMENT_BASELINE

1. **Authoritative user requirement:** tiếp `release-a-customer-exposure-foundation`; RR-01–RR-03 trong `docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions`; câu trả lời hiện tại: “Chốt profile A cho instance khách hàng; giữ chế độ nội bộ riêng”. Task xây dựng/kiểm chứng, chưa bật staging/production.
2. **Hard constraints:** CODEX_ONLY, gate qua reviewer read-only độc lập với fresh context; trusted server context và tenant/role/record boundaries giữ nguyên; French UI, reuse UI hiện có. COMMIT_AFTER_TASK: NOT_SELECTED; COMMIT_SELECTION_SOURCE: câu hỏi task hiện tại chưa được trả lời; không kế thừa YES từ task roadmap. Baseline clean `main`, HEAD `2dd5a02ba076a65928e2a80afe0b36d0d10284fd` trước khi tạo change.
3. **Out of scope:** importer/manual review sync/publisher Google, AI/Booking/Direct Feedback customer exposure, schema/migration, signup/wizard/email, sửa UI Users & Access ngoài tác động exposure, provider/compliance approval, deployment/activation, lifecycle/version promotion hoặc remote Git.
4. **Observable success outcomes:** A menu và direct entry chỉ cho phép slice đã chốt; deferred/API/action và DIRECT detail/mutation bị từ chối an toàn; Today count/preview/list đồng nhất kể cả STAFF assigned-only; A profile không tải Knowledge; setup/empty/recovery trung thực; internal regression giữ nguyên; required checks và Browser QA có evidence thật, không tuyên bố toàn bộ Foundation/customer readiness.
