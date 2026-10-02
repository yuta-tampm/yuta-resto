Change: preserve-establishment-owner-invariant

Gate: 2 — Delta Specs

Review status: APPROVED

Created: 2026-09-05T23:46:09Z

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — authorization invariant and concurrency integrity

# Gate 2 — Establishment OWNER Preservation

## Gate 2 Approval Record

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-05T23:55:51Z

Người dùng explicit APPROVE Gate 2 cho exact delta path
`openspec/changes/preserve-establishment-owner-invariant/specs/authorization/establishment-owner-preservation/spec.md`,
SHA-256 `44c453a64c40f9f3e2259c99918929e2ffe472ca846e1d1e950128a69fe660a5`.
Đã recheck exact delta path set/hash cùng Gate 1 artifacts và packet reference;
không có drift trong reviewed artifacts.

Quyết định chấp nhận establishment-scoped active OWNER invariant cho edit và
existing-user attachment, edit–edit/edit–attach/attach–attach concurrency và
atomic batch rollback. Giữ nguyên exclusions của Gate 1/Gate 2.

Chỉ cho phép soạn Design và trình Sensitive Design Gate. Serialization,
lock ordering, transaction coordination và concurrency failure handling phải
được giải quyết trong Design để review; Gate 2 không phê duyệt locking
implementation cụ thể. Chưa cho phép Tasks, Apply, deploy, sync hoặc archive.

Các phần về lượt tạo Specs/checks bên dưới là dated provenance; exact delta
content và approved source hashes giữ nguyên, không rewrite để cập nhật gate.

## Review Request

Review delta Specs duy nhất cho capability
`authorization/establishment-owner-preservation`. Đây là behavioral contract
cho bounded repair đã được Gate 1 duyệt, chưa phải implementation hoặc
normative main spec. Lượt này không tạo Design, Tasks hoặc production changes.

## Approved Gate 1 and Integrity

[Gate 1 approved packet](01-analysis-review.md).

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved Gate 1: 2026-09-05T23:43:41Z

Người dùng APPROVE exact Proposal/Analysis hashes bên dưới, xác nhận canonical
invariant theo `organizationId + establishmentId`, cả existing-user attachment
bypass và confirmed concurrent membership-mutation race. Approval chỉ cho phép
delta Specs và chuẩn bị Gate 2. Đã recheck source path set và hashes trước khi
tiếp tục; Proposal, Analysis và metadata được giữ nguyên byte.

Gate 1 packet SHA-256 sau khi ghi approval:
`12954ed85f670655e4efe9ac7caf3427923e104e4f3b04825c7d14a5cb4f4ec0`.

| Approved Gate 1 artifact                                              | SHA-256                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/preserve-establishment-owner-invariant/analysis.md` | `637298cec3d615f583fde9af61b0d73896cda5485f066e9d2a10b158abec78a2` |
| `openspec/changes/preserve-establishment-owner-invariant/proposal.md` | `7cb801d412d936cb717fc87e1882a2870a6ea5d1eb67768cae545592d21730d8` |

Các câu chưa được duyệt trong exact Proposal/Analysis là historical context
của thời điểm soạn. Approval được ghi ở Gate 1 packet, không viết lại source
artifacts đã được hash-bound approval.

## Requirements and Scenarios Summary

Delta có 6 requirements và 21 scenarios:

| Requirement                                                      | Observable contract / review focus                                                                                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Preserve the establishment-scoped active OWNER invariant         | Cặp organization/establishment là partition; từ chối sole-OWNER demotion/suspension; OWNER ở scope khác và suspended OWNER không thay thế active OWNER target.                             |
| Apply the same preservation rule to existing-user attachment     | Không bypass qua existing-membership upsert; attach MANAGER/STAFF làm mất sole OWNER bị từ chối; attach giữ OWNER hợp lệ vẫn thành công.                                                   |
| Preserve the invariant across concurrent membership mutations    | Edit–edit, edit–attach, attach–attach: đúng hai OWNER và hai yêu cầu riêng lẻ hợp lệ loại bỏ họ thì một SUCCESS, một LAST_OWNER_REQUIRED, còn một OWNER; có sequential control.            |
| Fail atomically without committed success side effects           | Batch có một target vi phạm rollback toàn bộ, không phụ thuộc request order; losing batch không commit target riêng; rejected suspension/transaction failure không để lại success effects. |
| Preserve valid transition and identity compatibility             | Giữ valid demotion/suspension, attach/upsert/reactivation, identity/password, membership ngoài scope, existing audit và scoped session-revocation behavior.                                |
| Preserve trusted management scope and existing denial boundaries | Giữ OWNER organization management scope, MANAGER STAFF-only, cross-scope denial, self-protection và inactive-user guard; không thêm grant hoặc error precedence.                           |

Concurrency outcome không áp đặt request nào thắng, scheduler, loại khóa,
isolation level hoặc retry mechanism. Điều kiện exact winner count loại trừ
mutation thứ ba và lỗi hạ tầng/độc lập khác; không biến availability thành
cam kết vô điều kiện. `SUCCESS` là ký hiệu kết quả thành công hiện có, không
phải API response field mới.

Atomicity yêu cầu không có committed success event từ transaction thua/lỗi;
không tạo policy audit event, retention hoặc delivery mới. Successful suspension
giữ revocation đúng target user/organization/establishment, không global revoke.

## Assumptions and Remaining Decisions

Changed assumptions since Analysis: không có thay đổi semantic ngoài quyết
định Gate 1 explicit chấp nhận scope establishment và bounded concurrency
behavior. Wording organization trong current AUTHENTICATION/error copy vẫn
chưa được chỉnh; không dùng wording đó để giảm invariant đã được duyệt.

Giữ exclusions và open questions:

- Không đổi attach/reactivation thành create-only, no-op, reject-all hoặc
  ownership-transfer workflow mới.
- Không đổi active-membership count thành usable-OWNER policy. Câu hỏi
  DISABLED global account vẫn là Security / Product review riêng.
- Không thay global account lifecycle, invitation, recovery delivery,
  multiple-active-reset-token policy, authorization grants hoặc audit policy.
- Không schema/migration, backfill hoặc remediation dữ liệu đã zero OWNER.
  Preservation áp dụng từ trạng thái đang đáp ứng invariant; không tự mở rộng
  sang provisioning hoặc global-account operations.
- Không thay Personnel, local apps, runtime/data ownership, contract hoặc UI
  layout/copy trong bước này; không promote lifecycle.
- Serialization/locking, transaction coordination, lock ordering và xử lý lỗi
  concurrency là quyết định Design sau Gate 2, bắt buộc sensitive-design gate.
  Không mặc định shared validator đơn thuần là đủ.
- Outcome lỗi/thành công có ảnh hưởng tương tác; UI/BROWSER QA applicability
  phải được đánh giá trước Apply theo Analysis và QA protocol. Gate 2 không
  miễn Browser QA hoặc tuyên bố QA PASS.

Không có ambiguity mới buộc mở rộng Product scope để review delta này. Nếu
review yêu cầu thay invariant hoặc exclusions, dừng và quay lại gate thích hợp,
không chọn cơ chế implementation để tự giải quyết requirement khác.

## Authority and Evidence Limits

Nguồn authority và evidence giữ theo
[Analysis](../../../openspec/changes/preserve-establishment-owner-invariant/analysis.md):
[Authority Model](../../AUTHORITY_MODEL.md),
[DATA_MODEL](../../architecture/DATA_MODEL.md),
[IDENTITY_AND_MEMBERSHIP](../../architecture/IDENTITY_AND_MEMBERSHIP.md),
[AUTHENTICATION](../../architecture/AUTHENTICATION.md),
[Identity / Access Home](../../features/identity-access/README.md),
[activation policy](../../OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md),
[normativity policy](../../OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
và [review protocol](../README.md).

Đã đọc lại current production membership repository và test references để
không mô tả sai compatibility. Diagnostic runtime được kế thừa dưới dạng dated
task evidence trong Analysis; không rerun PostgreSQL, tests hoặc browser trong
lượt Specs này. Các scenarios bên dưới là acceptance contract cần được bảo vệ
bởi deterministic regression coverage sau khi implementation được cho phép,
không phải kết quả test PASS hiện tại.

## Verification

| Exact command                                                                        | Result                                                                                                         |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `openspec status --change preserve-establishment-owner-invariant --json`             | Exit 0; schema yuta-spec-driven; sau khi tạo delta: proposal/analysis/specs done, design ready, tasks blocked. |
| `openspec instructions specs --change preserve-establishment-owner-invariant --json` | Exit 0; đọc dependencies và tạo đúng capability path; không lấy Design/Tasks instructions.                     |
| `openspec validate preserve-establishment-owner-invariant --strict`                  | Exit 0: `Change 'preserve-establishment-owner-invariant' is valid`.                                            |
| `pnpm docs:check`                                                                    | Exit 0; 36 current documents checked.                                                                          |
| `pnpm architecture:check`                                                            | Exit 0; runtime imports, database URLs, client boundaries và migration baselines hợp lệ.                       |
| `pnpm -r --if-present typecheck`                                                     | Exit 0.                                                                                                        |
| `pnpm format:check`                                                                  | Repository-wide findings: 67 files, reported exit code 1; ngoài phạm vi các files của lượt này, không sửa.     |

Final scoped checks sau khi tạo packet:

- `pnpm exec prettier --check openspec/changes/preserve-establishment-owner-invariant docs/reviews/preserve-establishment-owner-invariant`:
  exit 0, tất cả matched files PASS, gồm cả hai review packets.
- `git diff --check -- openspec/changes/preserve-establishment-owner-invariant docs/reviews/preserve-establishment-owner-invariant`:
  exit 0. Các paths hiện untracked nên check này không thay thế scoped Prettier
  hoặc exact-byte verification.
- PowerShell `Get-FileHash`, `ReadAllText`, marker extraction và SHA-256 trên
  UTF-8 bytes của embedded content: PASS cho exact Proposal, Analysis và delta;
  Gate 1 packet hash trong Gate 2 khớp; exact delta path set chỉ có một file;
  Design/Tasks vẫn chưa tồn tại. Metadata SHA-256 giữ nguyên:
  `4335374069fa3e46cb56363f52c324d241941b2def3fe11275cce6a577eb2b3f`.
- Strict validation và `pnpm docs:check` đã chạy lại sau khi tạo packet: exit 0.

Không chạy `pnpm test:cloud`, `pnpm test:local`, `pnpm build:cloud`,
db-cloud integration tests hoặc Browser QA: lượt này chỉ lập Specs/review,
không đổi runtime và không tuyên bố implementation/QA đã được verify.
Personnel integration failure đã được ghi trong task history là unrelated;
không rerun hoặc kết luận trạng thái hiện tại của suite đó từ planning checks.

## Change Attribution

HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

Đã inspect `git status --short`; dirty checkout được giữ nguyên. Lượt này chỉ:

1. Cập nhật approval record/status trong
   `docs/reviews/preserve-establishment-owner-invariant/01-analysis-review.md`.
2. Tạo delta Spec tại exact path trong bảng dưới.
3. Tạo `docs/reviews/preserve-establishment-owner-invariant/02-specs-review.md`.

Proposal, Analysis và `.openspec.yaml` không đổi. Không thêm main spec,
Design, Tasks, Design Gate packet, QA artifact hoặc implementation file.
Không stage/commit, deploy, sync/archive, migration hoặc lifecycle promotion.

Tracked working-tree diff fingerprint trước/sau:
`df6b88f7c563e6542ecadf66cac941b8deb265ae`.
Staged diff fingerprint trước/sau:
`54ec0f9242a3248b5bc27e11ea0c0faca26ac2b7`.

Commands: `git -c core.safecrlf=false diff --binary | git hash-object --stdin`
và `git -c core.safecrlf=false diff --cached --binary | git hash-object --stdin`.
Đây là Git fingerprints của tracked diff, không phải SHA-256 của artifact;
các planning/review paths hiện untracked nên được kiểm kê/hash riêng.

## Reviewed Delta Integrity

Hash algorithm: SHA-256 trên exact on-disk bytes, lowercase hexadecimal.

Exact command đã dùng cho mỗi path:

```powershell
(Get-FileHash -LiteralPath <repository-relative-path> -Algorithm SHA256).Hash.ToLowerInvariant()
```

Sorted exact reviewed delta path set (một file):

| Artifact                                                                                                               | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/preserve-establishment-owner-invariant/specs/authorization/establishment-owner-preservation/spec.md` | `44c453a64c40f9f3e2259c99918929e2ffe472ca846e1d1e950128a69fe660a5` |

Mọi thay đổi path set hoặc bytes phải được re-review; approval không tự áp dụng
sang phiên bản khác. Trước gate tiếp theo phải recheck cả Gate 1 source hashes,
Gate 1 packet reference và exact delta hash/path set.

## Exact Delta Spec

<!-- BEGIN EXACT authorization/establishment-owner-preservation/spec.md -->

```text
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
```

<!-- END EXACT authorization/establishment-owner-preservation/spec.md -->

## Recommendation and Stop

Recommendation: REVIEW_GATE_2.

`RAW OPENSPEC STATUS`: 3/5 planning artifacts done; Design ready, Tasks blocked;
planning incomplete.

`YUTA OPERATIONAL READINESS`: Gate 2 — APPROVED trên exact delta path/hash.

Theo approval record, cho phép soạn Design rồi trình sensitive-design Gate 2b.
Approval Gate 2 không phê duyệt cơ chế locking chưa được thiết kế và không cấp
quyền Tasks, Apply, deploy, sync hoặc archive.
