# Change Analysis

## Scope and Change Type

F07 là thay đổi hành vi và dữ liệu nhạy cảm trong capability `Personnel → Employee dossier / Historique`. Phạm vi chỉ mở rộng lịch sử hiện hữu để các mutation Personnel được duyệt trong tương lai có thể giữ giá trị có thẩm quyền trước/sau; không xây dựng lại timeline, không tái dựng quá khứ còn thiếu và không hợp nhất lịch sử của module khác. Mutation có thẩm quyền trở thành current khi commit thành công; F07 không tạo scheduled/pending Personnel state hoặc future activation semantics.

Change tác động UI, contract và dữ liệu lưu trữ; có yêu cầu về privacy/retention và atomicity. Nó không phải refactor hoặc tài liệu thuần túy, không đủ điều kiện dùng `skip_specs: true`.

## Sources Consulted

- Product Intent và ownership: [Personnel Product Knowledge](../../../docs/features/personnel/README.md), [Salariés page pack — F07](../../../docs/ui/pages/backoffice-equipe-salaries/README.md), cùng handoff Control Tower đã được người dùng cung cấp cho change này.
- Authority và lifecycle: [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [OpenSpec Normativity Policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
- Security/runtime boundaries: [Tenancy](../../../docs/architecture/TENANCY.md), [Authentication](../../../docs/architecture/AUTHENTICATION.md), [Database Boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md).
- Implemented State: [Personnel contracts](../../../packages/contracts/src/personnel/index.ts), [Personnel executable schema](../../../packages/db-cloud/src/schema/personnel.ts), [Personnel repository](../../../packages/db-cloud/src/personnel-repository.ts), [Salariés server actions](<../../../apps/backoffice/src/app/(authenticated)/equipe/salaries/actions.ts>), [Personnel permissions](../../../apps/backoffice/src/server/auth/permissions.ts), và [repository integration tests](../../../packages/db-cloud/test/personnel-repository.integration.test.ts).

## Authority and Product Decision

Handoff hiện tại là Product input cụ thể cho F07 và phù hợp với ownership đã được Personnel Product Knowledge chấp nhận: Personnel sở hữu hồ sơ nhân viên, dữ liệu quan hệ lao động hiện tại và lịch sử tái dựng của chính các dữ liệu đó.

Các ranh giới được xác nhận:

- chỉ `OWNER` có quyền đọc/quản lý Personnel; không mở cho `MANAGER`;
- mọi thao tác dùng organization và establishment từ session đáng tin cậy;
- Documents, Register, Formalités, AI extraction, consultation/access history và auth audit giữ owner và ý nghĩa riêng;
- không thay đổi runtime cloud Backoffice / `packages/db-cloud`;
- không phát hành production và không tuyên bố tuân thủ pháp lý;
- lịch sử không mang nghĩa giữ vĩnh viễn: baseline sản phẩm là khi còn gắn với establishment cộng 5 năm sau departure, sau đó đủ điều kiện xóa hoặc ẩn danh không thể đảo ngược, trừ nghĩa vụ/legal hold được duyệt riêng.

Product decisions bổ sung tại Gate 1 xác định đầy đủ hành vi F07:

- identity có thể là `CORRECTION` hoặc `CHANGE`, do `OWNER` chọn ý nghĩa cho mutation; entry date chỉ là `CORRECTION`;
- classification và conditional metadata được đánh giá riêng cho từng changed semantic group trong một multi-group mutation; clarification này không đổi ownership hoặc scope;
- `CHANGE` của Role, Contract terms và Work time bắt buộc business-effective date; ngày chỉ có thể ở quá khứ hoặc hôm nay, không trước authoritative entry date áp dụng cho mutation và không sau departure date nếu departure đã tồn tại; future effective date bị từ chối và `CORRECTION` không dùng effective date riêng;
- correction reason bắt buộc cho Entry, Contract terms, Work-time contractual values và departure correction/cancellation; tùy chọn cho Identity và Role; không yêu cầu cho `CHANGE`;
- activation tạo eager baseline đúng một lần cho từng dossier hiện hữu áp dụng, chỉ mang nghĩa current-at-cutover;
- `OWNER` xem các chi tiết tái dựng được trong `Historique`, vẫn giới hạn 50 event mới nhất và không có search/filter/pagination/export.

Không phát hiện `CONFLICT` về owner, authorization, tenant hoặc runtime. Không cần permission mới theo bằng chứng repository hiện tại.

Future effective date không thể được thêm như một biến thể validation đơn giản: nó sẽ cần một scheduled/pending Personnel state model riêng, gồm activation semantics, cancellation hoặc thay đổi future mutation, conflict handling và quan hệ với current authoritative values. Toàn bộ model đó nằm ngoài F07; lịch sử F07 chỉ ghi nhận authoritative mutation trở thành current khi commit thành công.

## Current Implemented State

Repository hiện thực hiện:

- hồ sơ nhân viên có các trường F03 được nêu trong handoff và một `revision` hiện tại;
- update thông thường kiểm tra full tenant scope, stale revision và idempotency, sau đó cập nhật dossier và thêm audit event trong cùng transaction;
- audit thông thường chỉ lưu nhóm trường đã đổi và revision trước/sau, không lưu giá trị trước/sau, classification `CORRECTION`/`CHANGE`, ngày có hiệu lực hoặc lý do sửa thông thường;
- một update có thể tạo riêng event identity và employment nhưng dùng chung operation ID nội bộ;
- departure đã lưu previous/new departure date và bắt buộc lý do khi sửa hoặc hủy;
- tab `Historique` đọc theo yêu cầu, giới hạn 50 event mới nhất, tách khỏi `Consultations`, và được làm mới đúng sau khi F03 save thành công;
- contract công khai của history hiện chỉ chiếu nhãn event, trường đổi, actor, thời gian và dữ liệu departure giới hạn.

Repository chưa thực hiện phần F07 mới:

- lịch sử giá trị đầy đủ cho identity/role/contract/work-time/entry;
- classification `CORRECTION`/`CHANGE` cho các mutation thông thường;
- business-effective date hoặc correction reason cho F03;
- cutover baseline cho hồ sơ hiện hữu;
- eager cutover baseline và cơ chế thực thi retention/anonymization cho lịch sử F07;
- projection `Historique` chứa nhóm ngữ nghĩa, classification, previous/new values, effective date và correction reason theo các quy tắc vừa được duyệt.

Các integration test hiện có chứng minh atomic update/audit, idempotent replay, stale-revision conflict, cross-establishment denial và departure correction trong repository. Đây là bằng chứng repository, không phải bằng chứng deployed runtime hoặc production readiness.

## Affected Boundaries

- **Runtime owner:** giữ nguyên `apps/backoffice`.
- **Data owner:** giữ nguyên Personnel trong `packages/db-cloud`; không dùng Register history làm mẫu sở hữu chung và không tạo shared history contract.
- **Tenancy:** giữ full `organizationId + establishmentId + employeeId` cho read/write; resource ID đơn lẻ không đủ thẩm quyền.
- **Authorization:** tái sử dụng `personnel.employee.read/manage`, hiện chỉ `OWNER`; client visibility không thay server guard.
- **Public/local boundary:** capability cloud Backoffice, không liên quan POS, Site Agent hoặc Display.
- **External provider/device:** không bị ảnh hưởng.
- **Cross-module:** không ghi vào Documents, Register hoặc Formalités và không đưa event truy cập/xác thực vào business history.
- **Sensitive data:** previous/new values làm tăng lượng dữ liệu Personnel nhạy cảm được giữ lại; Sensitive Design Gate là bắt buộc trước implementation.

Không có stop condition nào của Control Tower đã xảy ra trong repository analysis.

## Lifecycle Baseline

Theo Personnel Product Knowledge và Module Registry cho bounded employee dossier:

- **Product Decision:** `APPROVED` cho capability hiện hữu; F07 là thay đổi mới đang ở OpenSpec review, chưa tự động đổi lifecycle.
- **Implementation:** capability dossier hiện hữu là `IMPLEMENTED`; phần reconstructable value history của F07 là `NOT_IMPLEMENTED` theo bằng chứng code/schema.
- **Environment:** `UNVERIFIED`.
- **Production Readiness:** `BLOCKED` bởi các gate Personnel, gồm privacy/retention/security/operations.
- **External Dependency:** `BLOCKED` ở mức Personnel production; F07 không thêm provider ngoài.

Việc tạo proposal/analysis không thay đổi bất kỳ giá trị lifecycle nào và các artifact trong `openspec/changes/**` vẫn non-normative.

## Requirement Readiness

`READY_FOR_SPECS`

Các quyết định Product hiện đã đủ để viết behavioral specs có thể kiểm thử mà không đoán:

- phạm vi các nhóm dữ liệu và classification hợp lệ;
- người chọn ý nghĩa mutation;
- classification và conditional metadata theo từng changed semantic group;
- điều kiện bắt buộc, miền quá khứ/hôm nay và việc từ chối future effective date;
- ma trận correction reason;
- eager cutover, tính duy nhất và giới hạn ý nghĩa của baseline;
- dữ liệu F07 được hiển thị cho `OWNER` trong timeline hiện hữu;
- giới hạn newest-50 và các chức năng không được thêm;
- atomicity, tenancy, authorization, retention/privacy baseline và module exclusions.

Change có hành vi quan sát được và cần delta spec tại `personnel/reconstructable-value-history`. Delta spec hiện hữu vẫn giữ bytes của quyết định trước và phải được targeted-revise sau khi Gate 1 này được phê duyệt; không dùng `skip_specs: true`.

## UI / UX Applicability

UI/UX bị ảnh hưởng vì F03 cần thu thập classification và có điều kiện thu thập effective date/reason theo từng changed semantic group. Effective date chỉ chấp nhận quá khứ hoặc hôm nay; UI không được biểu diễn scheduled/pending future change. Tab `Historique` phải trình bày cho `OWNER` nhóm ngữ nghĩa, classification, previous/new values, effective date khi áp dụng, correction reason khi áp dụng, actor và recorded timestamp. Authority UI là shared/backoffice rules và [Salariés page pack](../../../docs/ui/pages/backoffice-equipe-salaries/README.md). Screenshot hoặc mockup không được dùng để thay đổi các quyết định Product này.

Không tạo design prompt hoặc UX artifact trong Gate 1 này. Sau khi các quyết định requirement được duyệt và specs được chấp thuận, thiết kế phải đi qua Sensitive Design Gate riêng.

## Conflicts and Unknowns

- Không còn `CONFLICT` hoặc requirement-level `NEEDS REVIEW` sau các quyết định Product Gate 1 hiện tại.
- Delta spec và Gate 2 packet hiện hữu vẫn phản ánh quy tắc effective date cũ. Chúng được giữ nguyên theo yêu cầu của current user, không phải bằng chứng cho Product Decision mới, và phải được revise/regenerate ở bước riêng sau Gate 1 approval.
- **Deferrable to Sensitive Design Gate:** cách lưu, migration/cutover execution, bảo đảm exactly-once baseline, cơ chế cleanup/anonymization, rollback và backup interaction. Các quyết định kỹ thuật này không được làm thay đổi hành vi specs hoặc retention/privacy Product baseline đã phê duyệt.
- Nếu thiết kế cần permission mới, owner mới, shared history/retention contract, ghi vào module khác, thay đổi tenant/runtime boundary hoặc thay đổi retention/privacy Product boundary, workflow phải dừng và quay lại Control Tower.

## Analysis Conclusion

Bounded scope và capability mới `personnel/reconstructable-value-history` được xác nhận; không có yêu cầu mở rộng owner, permission, tenant boundary, runtime hoặc module khác. Future effective dates và scheduled/pending Personnel changes bị loại khỏi F07; multi-group classification/metadata tiếp tục được đánh giá theo từng changed semantic group. Không phát hiện conflict, unresolved requirement hoặc Control Tower stop condition mới. Change có spec-level behavior nên không được dùng `skip_specs: true`.

Kết luận là `READY_FOR_SPECS`. Workflow vẫn phải dừng tại Gate 1 để con người duyệt Proposal và Analysis đã sửa cùng hash mới. Chỉ explicit Gate 1 re-approval trên packet hiện tại mới cho phép targeted revision của delta spec hiện hữu và regeneration của Gate 2 packet; chưa được phép tạo design, tasks, schema, migration, API hoặc implementation.
