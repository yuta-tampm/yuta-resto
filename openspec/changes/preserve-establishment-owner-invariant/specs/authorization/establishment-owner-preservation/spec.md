## Purpose

Bảo vệ active OWNER membership cuối cùng của từng establishment trong Cloud
Access Management qua membership edit và existing-user attachment, kể cả khi
các yêu cầu chạy đồng thời, mà không thay đổi quyền quản trị hoặc Product
semantics của các transition hợp lệ hiện có.

## ADDED Requirements

### Requirement: Preserve the establishment-scoped active OWNER invariant

Hệ thống SHALL duy trì ít nhất một membership có `role = OWNER` và
`status = active` trong từng cặp `organizationId + establishmentId` khi xử lý
membership edit hoặc existing-user attachment trên establishment đang đáp ứng
invariant này. Một yêu cầu làm mất active OWNER cuối cùng SHALL bị từ chối với
`LAST_OWNER_REQUIRED`, không commit mutation vi phạm. OWNER tại establishment
khác, kể cả cùng organization hoặc cùng user, SHALL NOT thay thế OWNER của
target establishment.

Phép đếm SHALL giữ nghĩa active OWNER membership hiện có; không bổ sung tiêu
chí global account usability, khả năng đăng nhập hoặc sự sẵn sàng của một con
người. Requirement này không quy định provisioning, global account lifecycle
hoặc repair/backfill establishment đã có zero active OWNER trước yêu cầu.

#### Scenario: Reject demotion of the only active OWNER through edit

- **WHEN** actor có quyền edit một target là active OWNER duy nhất của
  establishment và yêu cầu đổi role thành `MANAGER` hoặc `STAFF`
- **THEN** yêu cầu bị từ chối với `LAST_OWNER_REQUIRED`
- **AND** target giữ nguyên role/status và establishment còn một active OWNER

#### Scenario: Reject suspension of the only active OWNER through edit

- **WHEN** actor có quyền edit một target là active OWNER duy nhất và yêu cầu
  chuyển membership sang `suspended`, dù giữ role OWNER hay đổi role
- **THEN** yêu cầu bị từ chối với `LAST_OWNER_REQUIRED`
- **AND** target vẫn là active OWNER

#### Scenario: Do not count owners outside the target establishment

- **WHEN** target là active OWNER duy nhất tại establishment B và actor yêu cầu
  demote target, còn OWNER chỉ tồn tại tại establishment A cùng organization
  hoặc ở organization khác
- **THEN** yêu cầu bị từ chối với `LAST_OWNER_REQUIRED`
- **AND** các OWNER ngoài cặp organization/establishment của B không làm yêu
  cầu trở thành hợp lệ

#### Scenario: A suspended OWNER does not satisfy the active membership count

- **WHEN** target là active OWNER duy nhất, một OWNER khác tại cùng
  establishment có status `suspended`, và actor yêu cầu demote hoặc suspend target
- **THEN** yêu cầu bị từ chối với `LAST_OWNER_REQUIRED`

### Requirement: Apply the same preservation rule to existing-user attachment

Existing-user attachment SHALL kiểm tra kết quả role/status của mọi target
membership theo cùng invariant như edit. Nhánh cập nhật membership đã tồn tại
SHALL NOT bỏ qua bảo vệ chỉ vì thao tác được gửi qua attachment. Một attachment
ghi đè active OWNER cuối cùng thành `MANAGER` hoặc `STAFF` SHALL trả
`LAST_OWNER_REQUIRED` và không commit thay đổi của yêu cầu.

#### Scenario: Reject attachment that replaces the only active OWNER

- **WHEN** actor được phép attach một existing active user vào establishment mà
  user đó đã là active OWNER duy nhất, với requested role `MANAGER` hoặc `STAFF`
- **THEN** attachment bị từ chối với `LAST_OWNER_REQUIRED`
- **AND** existing membership vẫn là active OWNER và không có membership trùng lặp

#### Scenario: Preserve an attachment that keeps the only active OWNER

- **WHEN** attachment hợp lệ nhắm existing active user đang là OWNER duy nhất,
  giữ requested role `OWNER`, và không vi phạm guard hiện có nào khác
- **THEN** attachment thành công theo behavior hiện có
- **AND** membership vẫn active OWNER, không bị từ chối chỉ vì OWNER count là một

### Requirement: Preserve the invariant across concurrent membership mutations

Các yêu cầu edit và attachment đồng thời SHALL cùng bảo vệ invariant của mỗi
target establishment; hệ thống SHALL NOT commit tập hợp các successful
mutations làm mất tất cả active OWNER. Bảo vệ SHALL áp dụng cho cả edit–edit,
edit–attach và attach–attach, kể cả khi các yêu cầu nhắm membership khác nhau.

Với đúng hai active OWNER ban đầu, hai yêu cầu được phép nhắm hai OWNER khác
nhau, mỗi yêu cầu riêng lẻ có thể thành công nhưng cùng nhau sẽ loại bỏ cả hai,
hệ thống SHALL trả đúng một `SUCCESS`, một `LAST_OWNER_REQUIRED` và còn đúng
một active OWNER. Điều kiện này áp dụng khi không có mutation thứ ba, lỗi hạ
tầng hoặc lỗi độc lập khác; `SUCCESS` chỉ kết quả thành công hiện có, không
thêm response field hoặc API contract mới. Không quy định request nào thắng.

#### Scenario: Concurrent edits cannot both remove the two remaining OWNERs

- **WHEN** đúng hai active OWNER tại cùng establishment bị hai yêu cầu edit
  hợp lệ đồng thời nhắm riêng từng người để demote hoặc suspend, trong điều
  kiện concurrency nêu trên
- **THEN** đúng một edit thành công và một edit trả `LAST_OWNER_REQUIRED`
- **AND** membership thắng nhận role/status đã yêu cầu; membership thua giữ
  nguyên active OWNER; final active OWNER count là một

#### Scenario: An edit and an attachment share the same protection

- **WHEN** đúng hai active OWNER tại cùng establishment bị một edit demote hoặc
  suspend người thứ nhất và một attachment đổi người thứ hai thành MANAGER
  hoặc STAFF đồng thời, trong điều kiện concurrency nêu trên
- **THEN** đúng một yêu cầu thành công và một yêu cầu trả `LAST_OWNER_REQUIRED`
- **AND** membership thắng nhận role/status đã yêu cầu; membership thua giữ
  nguyên active OWNER; final active OWNER count là một

#### Scenario: Concurrent attachments cannot both replace the remaining OWNERs

- **WHEN** hai attachment hợp lệ đồng thời nhắm hai existing active users là
  đúng hai active OWNER tại cùng establishment, mỗi attachment yêu cầu
  MANAGER hoặc STAFF, trong điều kiện concurrency nêu trên
- **THEN** đúng một attachment thành công và một attachment trả `LAST_OWNER_REQUIRED`
- **AND** membership thắng nhận role/status đã yêu cầu; membership thua giữ
  nguyên active OWNER; final active OWNER count là một

#### Scenario: Sequential requests preserve the same final-state rule

- **WHEN** hai edit hợp lệ lần lượt yêu cầu loại bỏ hai active OWNER ban đầu
  khỏi cùng establishment, không có mutation khác xen giữa
- **THEN** yêu cầu đầu thành công, yêu cầu sau trả `LAST_OWNER_REQUIRED`
- **AND** establishment còn đúng một active OWNER

### Requirement: Fail atomically without committed success side effects

Một yêu cầu membership mutation SHALL là một kết quả all-or-nothing đối với
membership writes và các side effects thuộc transaction hiện có. Attachment
nhắm nhiều establishments mà một target vi phạm last-OWNER invariant SHALL
trả `LAST_OWNER_REQUIRED` và không commit bất kỳ thay đổi nào của batch, không
phụ thuộc thứ tự requested establishments. Yêu cầu bị từ chối hoặc transaction
thất bại SHALL NOT để lại committed success audit event, membership update,
identity write hoặc session revocation phát sinh từ chính transaction đó.
Requirement này không thêm audit event, delivery hoặc retention policy mới.

#### Scenario: One violating attachment target rolls back the whole batch

- **WHEN** một attachment nhắm nhiều establishments trong scope, có target cho
  phép requested role và có target mà role đó sẽ thay thế active OWNER cuối cùng
- **THEN** toàn bộ attachment trả `LAST_OWNER_REQUIRED`
- **AND** không target nào trong batch được insert, đổi role hoặc reactivate
- **AND** không có success audit event hoặc thay đổi identity/password của yêu cầu
- **AND** đảo thứ tự requested establishments không thay đổi kết quả all-or-nothing

#### Scenario: A losing concurrent batch does not commit other targets

- **WHEN** một attachment batch thua cạnh tranh với edit hoặc attachment khác
  tại target chung và nhận `LAST_OWNER_REQUIRED`, còn các target riêng của
  batch vốn cho phép thay đổi
- **THEN** batch thua không commit thay đổi ở target chung hoặc các target riêng
- **AND** kết quả đã commit hợp lệ của yêu cầu thắng được giữ nguyên

#### Scenario: Rejected suspension does not revoke sessions or record success

- **WHEN** edit suspend active OWNER cuối cùng bị từ chối với `LAST_OWNER_REQUIRED`
- **THEN** membership và sessions không bị thay đổi bởi yêu cầu bị từ chối
- **AND** không commit success audit event của yêu cầu đó

#### Scenario: A transaction failure rolls back its earlier effects

- **WHEN** một membership transaction đã bắt đầu thay đổi dữ liệu nhưng thất
  bại trước khi hoàn tất thành công
- **THEN** mọi membership write và side effect thuộc transaction đó bị rollback
- **AND** không để lại success audit event hoặc session revocation từ transaction lỗi

### Requirement: Preserve valid transition and identity compatibility

Bảo vệ last-OWNER SHALL giữ behavior hiện có của các yêu cầu hợp lệ không vi
phạm invariant hoặc guard khác. Attachment SHALL tiếp tục attach existing
identity, cập nhật membership đã tồn tại hoặc reactivate suspended membership
trong requested scope theo behavior hiện có; SHALL NOT thay password hoặc
thay thế existing global identity. Các membership ngoài requested scope SHALL
không đổi. Successful suspension SHALL giữ session revocation theo đúng user,
organization và establishment hiện có; successful mutations SHALL giữ success
audit semantics hiện có. Không tạo create-only/no-op/reject policy mới cho
attachment hoặc authorization grant mới.

#### Scenario: Demotion or suspension succeeds when another active OWNER remains

- **WHEN** actor có quyền demote hoặc suspend một OWNER và một active OWNER
  khác vẫn còn trong cùng establishment sau yêu cầu
- **THEN** yêu cầu thành công với role/status đã yêu cầu
- **AND** nếu suspend, chỉ sessions thuộc target user/organization/establishment
  bị revoke theo behavior hiện có; success audit semantics được giữ nguyên

#### Scenario: Valid existing-user attachment preserves identity and other memberships

- **WHEN** attachment hợp lệ với existing active user không loại bỏ active
  OWNER cuối cùng ở bất kỳ requested establishment nào
- **THEN** existing identity và password được giữ nguyên
- **AND** requested memberships được tạo hoặc cập nhật thành requested role và active
- **AND** memberships ở establishments hoặc organizations ngoài yêu cầu không đổi

#### Scenario: Valid reactivation remains supported

- **WHEN** attachment hợp lệ nhắm một existing active user có suspended
  membership, requested transition không vi phạm invariant hoặc guard khác
- **THEN** membership được reactivate với requested role theo behavior hiện có
- **AND** không xuất hiện Product policy mới chặn mọi reactivation

### Requirement: Preserve trusted management scope and existing denial boundaries

Hệ thống SHALL lấy actor và management scope từ authenticated server context,
không dùng browser claims làm authority. OWNER SHALL giữ quyền quản lý các
active establishments được phép trong current organization; MANAGER SHALL chỉ
quản lý STAFF tại selected establishment theo guard hiện có. Last-OWNER repair
SHALL NOT cấp quyền qua system role, mở rộng allowlist, hoặc bỏ self-protection
của edit và attachment. Yêu cầu ngoài scope hoặc bị existing guard từ chối
SHALL không commit mutation hay success effects; requirement không thay error
contract hoặc áp đặt precedence mới giữa nhiều validation failures.

#### Scenario: An authorized OWNER can manage another establishment in the organization

- **WHEN** actor OWNER có trusted management scope bao gồm target establishment
  khác selected establishment, và yêu cầu giữ invariant cùng các guard hiện có
- **THEN** không yêu cầu thêm membership của actor tại target establishment
- **AND** thao tác hợp lệ vẫn thành công trong current organization

#### Scenario: Browser scope cannot authorize cross-organization or disallowed targets

- **WHEN** browser gửi target membership/establishment ngoài trusted organization
  hoặc management allowlist qua edit hay attachment
- **THEN** hệ thống từ chối theo denial contract hiện có, không commit thay đổi
- **AND** không dùng OWNER count hoặc browser role claims để cấp quyền ngoài scope

#### Scenario: Manager restrictions remain enforced

- **WHEN** MANAGER yêu cầu assign OWNER/MANAGER, sửa hoặc attach existing
  OWNER/MANAGER, hoặc quản lý ngoài selected establishment
- **THEN** hệ thống giữ existing denial và không commit mutation
- **AND** yêu cầu quản lý STAFF hợp lệ trong selected establishment vẫn được hỗ trợ

#### Scenario: Self-protection and inactive existing-user checks remain enforced

- **WHEN** edit nhắm membership của current session, attachment nhắm chính
  actor, hoặc attachment nhắm existing global user không ACTIVE
- **THEN** hệ thống giữ guard và error behavior tương ứng hiện có
- **AND** last-OWNER repair không tạo bypass cho các trường hợp đó
