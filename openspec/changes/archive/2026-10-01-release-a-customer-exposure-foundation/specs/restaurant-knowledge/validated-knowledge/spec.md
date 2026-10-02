## ADDED Requirements

### Requirement: Backoffice availability là tiền điều kiện riêng cho Connaissances validées

Hệ thống SHALL áp dụng profile availability do server chọn cho toàn instance Backoffice trước mọi entry, subsection, UI, read, serialization hoặc mutation của slice `Connaissances validées` do `apps/backoffice` host, kể cả khi slice nằm chung page với basic Establishment Profile. Điều kiện này SHALL áp dụng cho mọi hosted observable scenario của capability, bao gồm view/list/detail hoặc empty state, manual input/edit, explicit save và mọi create/remove tương ứng của slice; permission hợp lệ SHALL NOT làm một entry không khả dụng trở thành khả dụng.

Trong profile `release-a`, slice SHALL không khả dụng: navigation, subsection và thao tác SHALL không được expose; page composition SHALL không đọc hoặc serialize giá trị slice; direct entry, API hoặc Server Action SHALL bị từ chối trước capability read/mutation và SHALL không tiết lộ payload của slice. Basic profile permission hoặc việc basic profile vẫn khả dụng SHALL NOT mở slice này.

Trong `internal`, availability SHALL cho phép entry được đánh giá theo các prerequisites hiện hành, SHALL NOT cấp thêm quyền, và các requirements hiện hành SHALL tiếp tục áp dụng đầy đủ. Restaurant Knowledge canonical ownership, establishment semantic scope, trusted organization/access envelope, READ/MANAGE và current grant mapping, content semantics, validation, explicit-save/no-autosave cùng mọi non-scope domain/runtime boundary SHALL giữ nguyên. Các invariant pure/domain/persistence SHALL không phụ thuộc exposure và SHALL không bị bãi bỏ khi entry không khả dụng.

#### Scenario: Release A không tải slice dù actor có READ

- **WHEN** instance dùng profile `release-a` và principal có Restaurant Knowledge READ mở composed basic profile hoặc thử gọi trực tiếp entry đọc slice
- **THEN** hệ thống SHALL không expose subsection, không đọc hoặc serialize giá trị slice và SHALL từ chối direct read trước capability operation
- **AND** denial SHALL không tiết lộ content, item hoặc empty/populated state của slice

#### Scenario: Release A không cho MANAGE mở mutation trực tiếp

- **WHEN** instance dùng profile `release-a` và principal có Restaurant Knowledge MANAGE gọi trực tiếp API hoặc Server Action để nhập, sửa, save hoặc thực hiện create/remove mà slice hỗ trợ
- **THEN** hệ thống SHALL từ chối hosted operation trước capability mutation, không đọc payload được bảo vệ và không thay đổi canonical state
- **AND** knowledge đang có hoặc quyền basic profile SHALL không bypass availability

#### Scenario: Internal giữ authorization và behavior hiện hành

- **WHEN** instance dùng `internal` và entry slice khả dụng
- **THEN** hệ thống SHALL đánh giá mọi hosted view/list hoặc mutation bằng trusted scope và đúng READ/MANAGE hiện hành
- **AND** current grant mapping, manual content/save behavior và các domain/persistence boundaries SHALL tiếp tục áp dụng; availability SHALL không tự làm một principal thiếu quyền được truy cập

## MODIFIED Requirements

### Requirement: READ và MANAGE là các operation độc lập

Hệ thống SHALL yêu cầu `restaurant-knowledge.read` để view/list current active validated knowledge và SHALL yêu cầu `restaurant-knowledge.manage` để create, edit, remove hoặc save. OWNER và MANAGER SHALL có READ + MANAGE theo accepted grant hiện tại; STAFF SHALL không có Restaurant Knowledge access theo mặc định. Profile permission SHALL NOT thay thế Restaurant Knowledge permission. Capability SHALL NOT bổ sung item-level permission, permission, role, principal hoặc admin/support bypass mới.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Connaissances validées` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: READ cho phép view và list

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có `restaurant-knowledge.read` trong trusted scope yêu cầu xem validated knowledge
- **THEN** hệ thống SHALL cho phép view/list current active items của establishment đó

#### Scenario: OWNER và MANAGER có thể quản lý

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal là OWNER hoặc MANAGER trong trusted scope và thực hiện create, edit, remove hoặc save
- **THEN** hệ thống SHALL áp dụng quyền READ + MANAGE hiện có cho operation đó

#### Scenario: STAFF bị từ chối

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal là STAFF theo accepted default grant matrix yêu cầu view/list hoặc mutation validated knowledge
- **THEN** hệ thống SHALL từ chối Restaurant Knowledge access

#### Scenario: READ không thay thế MANAGE

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một authorization context thỏa `restaurant-knowledge.read` nhưng không thỏa `restaurant-knowledge.manage` yêu cầu create, edit, remove hoặc save
- **THEN** hệ thống SHALL từ chối mutation operation đó

#### Scenario: Profile permission không thay thế Restaurant Knowledge permission

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal chỉ có Establishment Profile permission nhưng không có Restaurant Knowledge permission cần thiết
- **THEN** hệ thống SHALL NOT cho phép view/list hoặc mutation validated knowledge dựa trên Profile permission

### Requirement: Current active list hỗ trợ trạng thái không có item

Hệ thống SHALL hỗ trợ trạng thái không có validated knowledge item. Với authorized READ user, list/view SHALL chỉ biểu diễn current active validated knowledge items; pending create, edit hoặc removal chưa được save thành công SHALL NOT thay đổi canonical current list/view.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Connaissances validées` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: No-item state hợp lệ

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và establishment không có current active validated knowledge item
- **THEN** authorized READ user SHALL thấy một trạng thái danh sách không có item hợp lệ

#### Scenario: List current active items

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và establishment có một hoặc nhiều current active validated knowledge items
- **THEN** authorized READ user SHALL có thể list/view các item hiện hành đó mà không bao gồm pending changes chưa save

### Requirement: Saved statement phải chứa nội dung non-whitespace

Hệ thống SHALL chỉ chấp nhận explicit create hoặc edit save khi statement chứa ít nhất một ký tự non-whitespace. Exact empty string và mọi content chỉ gồm whitespace SHALL không hợp lệ. Accepted non-blank text SHALL được giữ nguyên chính xác, bao gồm surrounding whitespace; hệ thống SHALL NOT trim hoặc normalize text đó.

Khi blank create hoặc edit bị reject, pending draft SHALL vẫn non-canonical và user SHALL nhận clear validation error. Blank content SHALL NOT được diễn giải là remove, delete, cancel, successful no-op hoặc canonical null. Server SHALL enforce rule này ngay cả khi client-side validation không có hoặc bị bypass. Đây là Product content validation duy nhất được capability V1 định nghĩa; hệ thống SHALL NOT thêm minimum character count khác, maximum length, formatting, semantic, language, duplicate, taxonomy hoặc category validation.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Connaissances validées` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Create với exact empty string bị reject

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user explicit-save pending create có statement bằng `""`
- **THEN** save SHALL fail validation, không canonical item nào được tạo, pending draft SHALL vẫn non-canonical và user SHALL nhận clear validation error

#### Scenario: Create với whitespace-only content bị reject

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user explicit-save pending create có statement chỉ gồm whitespace như `"   "` hoặc `"\n\t "`
- **THEN** save SHALL fail validation, không canonical item nào được tạo, pending draft SHALL vẫn non-canonical và user SHALL nhận clear validation error

#### Scenario: Edit existing item thành blank bị reject

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user thay pending statement của existing item bằng content không có ký tự non-whitespace rồi explicit-save
- **THEN** save SHALL fail validation, pending draft SHALL vẫn non-canonical và user SHALL nhận clear validation error

#### Scenario: Rejected blank edit giữ nguyên canonical statement trước đó

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một blank edit của existing item bị reject
- **THEN** previously saved canonical statement SHALL giữ nguyên không thay đổi

#### Scenario: Accepted surrounding whitespace được giữ nguyên

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user explicit-save thành công non-blank statement như `" abc "` hoặc `"  a  "`
- **THEN** canonical saved statement SHALL giữ nguyên chính xác surrounding whitespace và SHALL NOT bị trim hoặc normalize

#### Scenario: Blank không kích hoạt remove

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user explicit-save blank content cho existing item
- **THEN** hệ thống SHALL reject validation và SHALL NOT remove, delete, cancel, báo no-op success hoặc chuyển canonical statement thành null

#### Scenario: Server bắt buộc enforce non-blank rule

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và blank create hoặc edit request đến server trong khi client-side validation không có hoặc đã bị bypass
- **THEN** server SHALL reject request trước khi blank statement trở thành canonical validated knowledge

### Requirement: Manual create chỉ trở thành canonical sau explicit save

Một MANAGE user SHALL có thể tạo thủ công một pending knowledge item. Việc nhập hoặc thay đổi draft SHALL NOT tự làm item trở thành canonical current validated knowledge. Sau explicit save thành công, created item SHALL trở thành current active validated knowledge.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Connaissances validées` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Create còn pending trước save

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user nhập một item mới nhưng chưa explicit-save thành công
- **THEN** item đó SHALL vẫn là pending và SHALL NOT thuộc canonical current validated knowledge

#### Scenario: Create save thành công

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user explicit-save thành công pending created item
- **THEN** saved item SHALL thuộc current active validated knowledge và có thể được authorized READ user list/view

### Requirement: Manual edit chỉ thay đổi canonical value sau explicit save

Một MANAGE user SHALL có thể chỉnh sửa một existing current validated item. Draft edit SHALL không thay đổi canonical current item trước explicit save thành công. Sau explicit save thành công, current active item SHALL phản ánh nội dung đã save.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Connaissances validées` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Edit còn pending trước save

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user thay đổi draft của existing current item nhưng chưa explicit-save thành công
- **THEN** canonical current item SHALL vẫn giữ nội dung đã được save trước đó

#### Scenario: Edited save thành công

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user explicit-save thành công pending edit
- **THEN** current active validated item SHALL phản ánh nội dung đã được save

### Requirement: Remove chỉ có hiệu lực sau explicit save

Một MANAGE user SHALL có thể mark một existing current item để remove. Pending removal SHALL không thay đổi canonical current knowledge trước explicit save thành công. Sau explicit save thành công, removed item SHALL không còn thuộc, được list hoặc được view như current active validated knowledge. Capability SHALL NOT cung cấp restore workflow trong V1.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Connaissances validées` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Removal còn pending trước save

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user mark một current item để remove nhưng chưa explicit-save thành công
- **THEN** item đó SHALL vẫn thuộc canonical current active validated knowledge

#### Scenario: Saved removal loại item khỏi current active knowledge

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user explicit-save thành công pending removal
- **THEN** item đó SHALL không còn thuộc, được list hoặc được view như current active validated knowledge

### Requirement: Explicit save là persistence boundary duy nhất

Pending create, edit hoặc remove SHALL chỉ trở thành canonical sau một explicit save thành công. Typing, blur, timer, background persistence hoặc automatic synchronization SHALL NOT làm pending change trở thành canonical. Nếu save thất bại, hệ thống SHALL NOT trình bày pending changes như canonical current validated knowledge.

Requirement này SHALL không quyết định whole-list, per-item hay batch save, số lượng hoặc vị trí save controls, hoặc transaction granularity.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Connaissances validées` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Không autosave

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một user tạo, sửa hoặc mark remove rồi xảy ra typing, blur, timer hoặc background activity mà không có explicit save thành công
- **THEN** canonical current validated knowledge SHALL không thay đổi

#### Scenario: Save thất bại không trở thành canonical

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một explicit save cho pending create, edit hoặc remove thất bại
- **THEN** hệ thống SHALL NOT trình bày pending change đó như canonical current validated knowledge

### Requirement: Hỗ trợ nhiều item độc lập mà không tự động xử lý semantic duplicates

Một establishment SHALL có thể có nhiều current active validated knowledge items, mỗi item là một independently understandable semantic statement. Product intent SHALL không chủ động tạo cùng một semantic fact thành nhiều active duplicate items, nhưng hệ thống SHALL NOT phải phát hiện similarity, tự động merge, chấm duplicate score, dùng AI, hoặc áp dụng uniqueness dựa trên semantic meaning hay text equality.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Connaissances validées` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Nhiều item độc lập

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và authorized users đã explicit-save thành công nhiều semantic statements độc lập và đủ điều kiện ownership
- **THEN** authorized READ user SHALL có thể list/view chúng như nhiều current active items

#### Scenario: Anti-duplication không tạo runtime enforcement

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và một MANAGE user nhập nội dung có khả năng trùng semantic information
- **THEN** hệ thống SHALL NOT phải đọc module khác, suy luận semantic similarity, tự động merge hoặc áp dụng technical text-equality uniqueness để enforce anti-duplication
