# Personnel Reconstructable Value History Specification

## Purpose

Capability này bảo toàn lịch sử giá trị có thể tái dựng cho các dữ liệu nhân viên và quan hệ lao động do Personnel sở hữu, đồng thời giữ nguyên quyền OWNER, tenant scope, giới hạn timeline và các ranh giới module hiện có.

## Requirements

### Requirement: Approved Personnel semantic groups

Hệ thống SHALL chỉ tạo lịch sử giá trị F07 cho sáu nhóm ngữ nghĩa đã duyệt: Identity gồm given names và family name; Role gồm position và qualification; Contract terms gồm contract type, expected end date và controlled CDD reason; Work time gồm work-time classification và contractual weekly duration; Entry gồm entry date; Departure gồm departure date theo semantics hiện hữu.

#### Scenario: Một trường thuộc nhóm đã duyệt thay đổi

- **WHEN** một mutation Personnel được phép thay đổi ít nhất một trường trong một nhóm ngữ nghĩa đã duyệt
- **THEN** hệ thống tạo bằng chứng lịch sử F07 cho đúng nhóm đó

#### Scenario: Một mutation thay đổi nhiều nhóm

- **WHEN** một mutation được phép thay đổi các trường thuộc nhiều nhóm ngữ nghĩa đã duyệt
- **THEN** hệ thống tạo chi tiết lịch sử có thể phân biệt cho từng nhóm đã thay đổi

### Requirement: Per-group validation for multi-group mutations

Trong một mutation thay đổi nhiều nhóm ngữ nghĩa, hệ thống SHALL đánh giá classification và conditional metadata riêng cho từng nhóm đã thay đổi. Mỗi nhóm SHALL độc lập thỏa classification được phép, effective-date requirement và correction-reason requirement áp dụng cho nhóm đó. Nếu bất kỳ nhóm nào không hợp lệ, hệ thống MUST từ chối toàn bộ authoritative mutation và MUST không tạo lịch sử F07 cho bất kỳ nhóm nào trong mutation.

#### Scenario: Mỗi nhóm có metadata riêng hợp lệ

- **WHEN** một atomic F03 mutation chứa Identity `CORRECTION`, Role `CHANGE` với effective date hợp lệ và Work time `CORRECTION` với reason bắt buộc
- **THEN** hệ thống đánh giá metadata riêng của từng nhóm và chỉ cam kết toàn bộ mutation khi cả ba nhóm đều hợp lệ

#### Scenario: Một nhóm trong multi-group mutation không hợp lệ

- **WHEN** ít nhất một nhóm đã thay đổi không thỏa classification, effective-date requirement hoặc correction-reason requirement của chính nhóm đó
- **THEN** hệ thống từ chối toàn bộ authoritative mutation và không tạo lịch sử F07 cho bất kỳ nhóm đã thay đổi nào

### Requirement: CORRECTION and CHANGE semantics

Hệ thống SHALL phân loại mỗi thay đổi F07 áp dụng là `CORRECTION` khi giá trị đã lưu trước đó là sai, hoặc `CHANGE` khi giá trị trước đó từng hợp lệ và giá trị mới trở thành giá trị có thẩm quyền từ điểm hiệu lực được áp dụng. Hệ thống MUST từ chối mutation nếu classification được yêu cầu cho một nhóm nhưng không hợp lệ hoặc bị thiếu.

#### Scenario: Lưu một correction

- **WHEN** OWNER gửi một thay đổi hợp lệ với classification `CORRECTION`
- **THEN** lịch sử ghi nhận rằng giá trị trước đã bị sửa vì không chính xác

#### Scenario: Lưu một change

- **WHEN** OWNER gửi một thay đổi hợp lệ với classification `CHANGE`
- **THEN** lịch sử ghi nhận rằng giá trị trước từng hợp lệ và giá trị mới được áp dụng theo semantics hiệu lực của nhóm

#### Scenario: Thiếu classification bắt buộc

- **WHEN** một nhóm thay đổi yêu cầu OWNER chọn `CORRECTION` hoặc `CHANGE` nhưng mutation không cung cấp lựa chọn hợp lệ
- **THEN** hệ thống từ chối toàn bộ mutation và không tạo lịch sử F07

### Requirement: Identity and Entry classification

Hệ thống SHALL cho phép OWNER chọn `CORRECTION` hoặc `CHANGE` cho mutation của Identity. Hệ thống SHALL chỉ chấp nhận `CORRECTION` cho Entry và MUST không cung cấp ngoại lệ F07 cho một Entry `CHANGE`. Identity không yêu cầu business-effective date riêng; một Identity `CHANGE` trở thành giá trị hiện tại khi mutation thành công.

#### Scenario: OWNER sửa sai danh tính

- **WHEN** OWNER thay đổi given names hoặc family name và chọn `CORRECTION`
- **THEN** hệ thống áp dụng mutation theo correction semantics cho nhóm Identity

#### Scenario: OWNER thay đổi danh tính hợp lệ

- **WHEN** OWNER thay đổi given names hoặc family name và chọn `CHANGE`
- **THEN** hệ thống áp dụng mutation theo change semantics cho nhóm Identity mà không yêu cầu business-effective date riêng

#### Scenario: Entry được gửi dưới dạng change

- **WHEN** OWNER thay đổi entry date với classification `CHANGE`
- **THEN** hệ thống từ chối toàn bộ mutation và không tạo lịch sử F07

### Requirement: Effective date for prospective changes

Hệ thống SHALL yêu cầu business-effective date cho mọi `CHANGE` thuộc Role, Contract terms hoặc Work time. Hệ thống SHALL chỉ cho phép ngày này ở quá khứ hoặc ngày làm việc hiện tại; ngày đó MUST không ở tương lai, MUST không trước entry date có thẩm quyền áp dụng cho mutation và MUST không sau departure date nếu dossier đã có departure date. Hệ thống SHALL không dùng business-effective date riêng cho `CORRECTION`. F07 MUST không hỗ trợ scheduled Personnel changes, pending future values hoặc future activation; authoritative current value mới được cam kết khi mutation thành công.

#### Scenario: Change có effective date hợp lệ trong quá khứ

- **WHEN** OWNER gửi một Role, Contract terms hoặc Work time `CHANGE` với effective date trong quá khứ nhưng không trước entry date và không sau departure date hiện có
- **THEN** hệ thống chấp nhận effective date đó

#### Scenario: Change có effective date hôm nay

- **WHEN** OWNER gửi một Role, Contract terms hoặc Work time `CHANGE` với effective date là ngày làm việc hiện tại và ngày đó nằm trong ranh giới entry/departure
- **THEN** hệ thống chấp nhận effective date đó

#### Scenario: Effective date ở tương lai

- **WHEN** effective date sau ngày làm việc hiện tại
- **THEN** hệ thống từ chối toàn bộ mutation và không tạo lịch sử F07 cho bất kỳ nhóm đã thay đổi nào

#### Scenario: Change thiếu effective date

- **WHEN** OWNER gửi một Role, Contract terms hoặc Work time `CHANGE` mà không có effective date
- **THEN** hệ thống từ chối toàn bộ mutation và không tạo lịch sử F07

#### Scenario: Effective date trước entry date

- **WHEN** effective date của `CHANGE` trước entry date có thẩm quyền áp dụng cho mutation
- **THEN** hệ thống từ chối toàn bộ mutation và không tạo lịch sử F07

#### Scenario: Effective date sau departure date

- **WHEN** dossier đã có departure date và effective date của `CHANGE` sau ngày đó
- **THEN** hệ thống từ chối toàn bộ mutation và không tạo lịch sử F07

#### Scenario: Correction kèm effective date riêng

- **WHEN** một nhóm được gửi dưới dạng `CORRECTION`
- **THEN** hệ thống xử lý correction mà không sử dụng business-effective date riêng làm bằng chứng lịch sử

### Requirement: Correction reason policy

Hệ thống SHALL yêu cầu correction reason cho Entry correction, Contract terms correction, Work-time correction làm thay đổi work-time classification hoặc contractual weekly duration, và Departure correction hoặc cancellation. Hệ thống SHALL cho phép correction reason là tùy chọn cho Identity correction và Role correction. Hệ thống SHALL không yêu cầu correction reason cho `CHANGE`.

#### Scenario: Correction bắt buộc có reason

- **WHEN** OWNER gửi Entry, Contract terms hoặc contractual Work-time `CORRECTION` mà không có reason hợp lệ
- **THEN** hệ thống từ chối toàn bộ mutation và không tạo lịch sử F07

#### Scenario: Identity hoặc Role correction không có reason

- **WHEN** OWNER gửi Identity hoặc Role `CORRECTION` hợp lệ mà không cung cấp reason
- **THEN** hệ thống cho phép mutation tiếp tục

#### Scenario: Identity hoặc Role correction có reason

- **WHEN** OWNER gửi Identity hoặc Role `CORRECTION` hợp lệ kèm reason
- **THEN** hệ thống giữ reason đó trong chi tiết lịch sử F07

#### Scenario: Change không có reason

- **WHEN** OWNER gửi một `CHANGE` hợp lệ mà không cung cấp reason
- **THEN** hệ thống không từ chối mutation chỉ vì thiếu reason

### Requirement: Authoritative previous and new values

Với mỗi nhóm thay đổi, hệ thống SHALL giữ đúng các giá trị có thẩm quyền ngay trước mutation và các giá trị có thẩm quyền sau mutation, bao gồm giá trị rỗng khi một trường được xóa hợp lệ. Bằng chứng SHALL đủ để tái dựng trạng thái trước/sau của toàn bộ nhóm ngữ nghĩa mà không suy đoán từ nhãn trường đã đổi.

#### Scenario: Một phần của nhóm coupled thay đổi

- **WHEN** một mutation chỉ thay đổi một trường trong Contract terms hoặc Work time
- **THEN** bằng chứng lịch sử chứa trạng thái trước và sau của toàn bộ nhóm tương ứng, gồm cả các trường companion không thay đổi

#### Scenario: Một giá trị được xóa hợp lệ

- **WHEN** một mutation hợp lệ chuyển một giá trị có thẩm quyền thành rỗng
- **THEN** lịch sử phân biệt rõ giá trị trước với giá trị mới rỗng

### Requirement: Mutation and history atomicity

Hệ thống MUST bảo đảm mutation Personnel có thẩm quyền, mọi bằng chứng lịch sử F07 bắt buộc và bằng chứng chống gửi trùng liên quan cùng thành công hoặc cùng không được áp dụng. Stale revision, validation failure, authorization failure hoặc lỗi ghi lịch sử MUST không để lại giá trị Personnel mới thiếu bằng chứng lịch sử bắt buộc.

#### Scenario: Mutation và history cùng thành công

- **WHEN** một mutation F07 hợp lệ được ghi nhận thành công
- **THEN** giá trị Personnel mới và toàn bộ bằng chứng lịch sử bắt buộc đều có thể đọc được

#### Scenario: Không thể ghi bằng chứng lịch sử

- **WHEN** hệ thống không thể ghi đầy đủ bằng chứng lịch sử bắt buộc của mutation
- **THEN** mutation không làm thay đổi các giá trị Personnel có thẩm quyền

#### Scenario: Stale revision conflict

- **WHEN** OWNER gửi mutation với revision đã cũ
- **THEN** hệ thống giữ nguyên conflict semantics hiện hữu và không tạo lịch sử F07 cho mutation bị từ chối

#### Scenario: Idempotent replay

- **WHEN** cùng một mutation đã thành công được gửi lại với cùng idempotency identity và cùng payload
- **THEN** hệ thống trả lại kết quả đã cam kết mà không tạo thêm lịch sử F07 hoặc cutover baseline trùng lặp

### Requirement: Eager exactly-once cutover baseline

Khi F07 được kích hoạt, hệ thống SHALL tạo eager cutover baseline cho mọi dossier Personnel hiện hữu áp dụng và SHALL tạo chính xác một baseline cho mỗi dossier đó. Baseline SHALL thể hiện các giá trị có thẩm quyền hiện tại của các nhóm F07 tại thời điểm cutover, SHALL được nhận diện rõ là baseline cutover và SHALL không được phân loại như một mutation `CORRECTION` hoặc `CHANGE` của người dùng.

#### Scenario: Dossier tồn tại tại activation

- **WHEN** F07 được kích hoạt và một dossier Personnel áp dụng đã tồn tại
- **THEN** dossier đó có đúng một cutover baseline chứa các giá trị có thẩm quyền tại cutover

#### Scenario: Cutover được thực hiện lại an toàn

- **WHEN** quá trình activation/cutover được chạy lại cho một dossier đã có baseline
- **THEN** hệ thống không tạo baseline thứ hai cho dossier đó

#### Scenario: Dossier được tạo sau cutover

- **WHEN** một dossier Personnel mới được tạo sau khi F07 đã được kích hoạt
- **THEN** hệ thống không trình bày dossier đó như một dossier đã tồn tại tại cutover và không tạo cutover baseline giả cho nó

### Requirement: Current-at-cutover limitation

Cutover baseline SHALL chỉ được trình bày như snapshot của các giá trị có thẩm quyền tại thời điểm cutover. Hệ thống MUST không suy diễn, tạo hoặc trình bày baseline này như bằng chứng về giá trị, thay đổi, classification, effective date, actor hoặc sự thật lịch sử trước cutover.

#### Scenario: OWNER xem cutover baseline

- **WHEN** OWNER xem baseline trong `Historique`
- **THEN** giao diện xác định rõ đây là giá trị hiện tại tại cutover và không mô tả nó như một thay đổi trước đó

#### Scenario: Thiếu lịch sử trước cutover

- **WHEN** repository không có previous/new values cho một mutation xảy ra trước cutover
- **THEN** hệ thống không tái dựng hoặc phát minh các giá trị còn thiếu từ baseline hay trạng thái hiện tại

### Requirement: OWNER-only reconstructable Historique projection

Trong `Historique` hiện hữu, hệ thống SHALL chỉ cho OWNER đã được xác thực và được phép xem các chi tiết F07: semantic group, `CORRECTION` hoặc `CHANGE`, previous value, new value, effective date khi áp dụng, correction reason khi áp dụng, actor và recorded timestamp. Cutover baseline SHALL được trình bày với attribution trung lập nếu không có human actor, thay vì gán sai cho một OWNER.

#### Scenario: OWNER xem mutation F07

- **WHEN** OWNER mở `Historique` của employee trong trusted scope và một mutation F07 nằm trong kết quả
- **THEN** timeline hiển thị mọi chi tiết F07 áp dụng cho mutation đó

#### Scenario: Chi tiết tùy điều kiện không áp dụng

- **WHEN** mutation không dùng effective date hoặc không có correction reason
- **THEN** timeline không phát minh giá trị cho chi tiết không áp dụng

#### Scenario: MANAGER hoặc STAFF yêu cầu history

- **WHEN** MANAGER, STAFF hoặc actor không có quyền Personnel yêu cầu chi tiết F07
- **THEN** hệ thống từ chối theo authorization hiện hữu và không trả về dữ liệu lịch sử nhạy cảm

### Requirement: Existing history window remains bounded

Hệ thống SHALL tiếp tục trả tối đa 50 event mới nhất trong business-history timeline hiện hữu, theo thứ tự mới nhất trước và với thông báo truncation hiện hữu khi có thêm event. F07 MUST không thêm search, filter, pagination hoặc export cho `Historique`.

#### Scenario: Có hơn 50 event phù hợp

- **WHEN** employee có hơn 50 business-history event được phép hiển thị
- **THEN** OWNER nhận 50 event mới nhất cùng trạng thái cho biết timeline bị cắt ngắn

#### Scenario: OWNER xem Historique sau F07

- **WHEN** OWNER sử dụng timeline có F07 entries
- **THEN** không có control search, filter, pagination hoặc export mới do F07 cung cấp

### Requirement: Departure compatibility

Hệ thống SHALL giữ semantics nghỉ việc hiện hữu. Lần ghi departure date đầu tiên tiếp tục là departure recording hiện hữu. Sửa departure date hoặc hủy departure tiếp tục là correction, bắt buộc reason, giữ previous/new departure values và không dùng business-effective date riêng. F07 MUST không biến departure thành hard deletion hoặc thay đổi quy tắc trạng thái nhân viên hiện tại.

#### Scenario: Ghi departure lần đầu

- **WHEN** OWNER ghi departure date lần đầu theo luồng hiện hữu
- **THEN** hệ thống giữ semantics departure recording hiện tại và lưu bằng chứng previous/new departure tương thích

#### Scenario: Sửa departure date

- **WHEN** OWNER sửa departure date đã tồn tại với reason hợp lệ
- **THEN** hệ thống ghi correction với previous/new departure dates và reason

#### Scenario: Hủy departure

- **WHEN** OWNER xóa departure date đã tồn tại với reason hợp lệ
- **THEN** hệ thống ghi correction/cancellation với previous departure date, new value rỗng và reason mà không xóa dossier

### Requirement: Tenant and authorization preservation

Mọi read và mutation F07 SHALL tái sử dụng authority Personnel chỉ dành cho OWNER và MUST bị giới hạn bằng trusted organization, establishment và employee scope. Browser-provided organization, establishment, role, permission hoặc employee scope MUST không tạo thẩm quyền. Một yêu cầu bị từ chối MUST không trả dữ liệu cross-tenant và không tạo mutation/history evidence.

#### Scenario: OWNER trong đúng establishment

- **WHEN** OWNER có session hợp lệ yêu cầu F07 cho employee thuộc organization và active establishment hiện tại
- **THEN** hệ thống xử lý yêu cầu trong đúng trusted scope

#### Scenario: Employee thuộc establishment khác

- **WHEN** actor yêu cầu F07 bằng employee identifier thuộc organization hoặc establishment khác
- **THEN** hệ thống từ chối hoặc trả not-found theo fail-closed behavior mà không tiết lộ dữ liệu hay tạo history

#### Scenario: Scope do browser cung cấp

- **WHEN** browser gửi giá trị organization, establishment, role hoặc permission khác trusted session context
- **THEN** hệ thống bỏ qua các giá trị đó như bằng chứng authorization

### Requirement: Personnel reconstructable-history retention baseline

Lịch sử F07 SHALL được giữ trong khi employee còn gắn với establishment và trong 5 năm sau establishment departure. Sau thời hạn đó, lịch sử MUST đủ điều kiện để xóa hoặc ẩn danh không thể đảo ngược theo quy trình privacy Personnel được phê duyệt; nghĩa vụ pháp lý hoặc legal hold được phê duyệt riêng SHALL trì hoãn việc này trong phạm vi override được duyệt. F07 MUST không tạo semantics giữ vĩnh viễn.

#### Scenario: Employee còn gắn với establishment

- **WHEN** employee chưa departure khỏi establishment
- **THEN** lịch sử F07 của employee vẫn thuộc retention window

#### Scenario: Chưa quá 5 năm sau departure

- **WHEN** chưa đủ 5 năm kể từ establishment departure
- **THEN** lịch sử F07 vẫn thuộc retention window

#### Scenario: Hết 5 năm và không có override

- **WHEN** đã đủ 5 năm sau establishment departure và không có nghĩa vụ hoặc legal hold được duyệt riêng
- **THEN** lịch sử F07 đủ điều kiện để xóa hoặc ẩn danh không thể đảo ngược theo quy trình privacy Personnel được duyệt

#### Scenario: Có legal hold được duyệt

- **WHEN** một nghĩa vụ pháp lý hoặc legal hold được duyệt riêng áp dụng khi retention window thông thường kết thúc
- **THEN** việc đủ điều kiện xóa hoặc ẩn danh được trì hoãn theo override đó mà không biến thành keep-forever mặc định

### Requirement: Explicit module and history exclusions

F07 SHALL chỉ sở hữu lịch sử tái dựng của employee và current-employment facts thuộc Personnel. Hệ thống MUST không đưa Documents versions, Registre du personnel history, Formalités history, AI extraction suggestions, consultation/access history hoặc unrelated authentication audit vào lịch sử giá trị F07, và MUST không ghi dữ liệu F07 vào các module đó.

#### Scenario: Module khác có event

- **WHEN** Documents, Register, Formalités, AI extraction, consultation hoặc authentication tạo event riêng
- **THEN** event đó giữ ownership và projection riêng, không trở thành reconstructable value event của F07

#### Scenario: Mutation Personnel thành công

- **WHEN** một mutation F07 được ghi nhận thành công
- **THEN** mutation không tạo write vào Documents, Register hoặc Formalités
