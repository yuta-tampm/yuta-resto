# Gate 2 — Requirements Review

Change: `restaurant-knowledge-validated-knowledge`

Gate: `GATE 2 — REQUIREMENTS REVIEW`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-02T23:19:39.7179980+02:00`

Created: `2026-09-02T23:15:13.9960452+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `YES`

## Phạm vi review

Gate 2 được reopen theo explicit Human Product decision để revise duy nhất
delta Spec cho empty validated-item semantics. Proposal, Analysis, Design và
mọi implementation surface giữ nguyên. Không có Tasks, schema, migration,
implementation, tests hoặc QA được tạo.

Previous Gate 2 approval và Sensitive Design review không còn cho phép tiến
tiếp vì reviewed Spec bytes đã thay đổi. Design và Gate 2b packet vẫn được giữ
byte-identical để làm provenance; chúng chỉ được revisit sau explicit approval
của Gate 2 packet này.

## Gate 1 vẫn hợp lệ

| Repository-relative path | SHA-256 |
| --- | --- |
| `docs/reviews/restaurant-knowledge-validated-knowledge/01-analysis-review.md` | `38ec43a4f9ae0a05922aa4a08209ab76dbbbac56d28ccfd1f852667bf4442b8d` |
| `openspec/changes/restaurant-knowledge-validated-knowledge/analysis.md` | `adfc226bc6cf2804833a099c1317bcad7f6e9939262accbe1da5bb23188d01e6` |
| `openspec/changes/restaurant-knowledge-validated-knowledge/proposal.md` | `dc874fbeb79d43ef31e9d109360033a46aea5c8f97beebb73abd538e300764e8` |

Proposal và Analysis vẫn byte-identical với Gate 1 review. Capability path,
ownership, tenancy, authorization, manual-only scope, explicit save,
non-relationships và lifecycle boundaries không thay đổi.

## Targeted Product decision incorporated

Một saved validated knowledge statement phải chứa ít nhất một non-whitespace
character. Exact empty và whitespace-only content không hợp lệ. Accepted
non-blank text được giữ nguyên chính xác, bao gồm surrounding whitespace; không
trim.

Blank create/edit phải fail validation, giữ pending draft non-canonical và
không thay canonical server state. Blank edit không có nghĩa remove/delete,
cancel, no-op success hoặc canonical null. Server-side enforcement là bắt buộc
và đây là Product content validation duy nhất của V1.

## Exact Spec change

Chỉ một requirement mới được thêm:

- `Saved statement phải chứa nội dung non-whitespace`.

Bảy scenarios mới:

1. `Create với exact empty string bị reject`;
2. `Create với whitespace-only content bị reject`;
3. `Edit existing item thành blank bị reject`;
4. `Rejected blank edit giữ nguyên canonical statement trước đó`;
5. `Accepted surrounding whitespace được giữ nguyên`;
6. `Blank không kích hoạt remove`;
7. `Server bắt buộc enforce non-blank rule`.

Không requirement/scenario cũ nào bị sửa hoặc xóa. Không thêm trimming,
minimum count ngoài non-whitespace rule, maximum length, formatting, semantic,
language, duplicate, taxonomy hoặc category validation.

## Delta Spec hash và counts

SHA-256 được tính trên exact file bytes bằng PowerShell
`Get-FileHash -Algorithm SHA256`, với hexadecimal output lowercase.

| Repository-relative path | Previous SHA-256 | Revised SHA-256 |
| --- | --- | --- |
| `openspec/changes/restaurant-knowledge-validated-knowledge/specs/restaurant-knowledge/validated-knowledge/spec.md` | `36ad2a488d3fd4ec2ab6e27f0822ebaf70e5cf222a0d12c3054f5342797e1260` | `9fd953a0a931593137dcc3f2d7c420906e087fa395251e17fe7bfd7328e7445c` |

Exact delta-spec path count: `1`.

- revised requirement count: `13` (previously `12`);
- revised scenario count: `36` (previously `29`).

## Preserved Design evidence

| Repository-relative path | Preserved SHA-256 |
| --- | --- |
| `docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md` | `f141f177e969875a732fbc3cf9da33298d9f148a65003cdc45371e50fd20d818` |
| `openspec/changes/restaurant-knowledge-validated-knowledge/design.md` | `879e8b210c3423f1f7fd8ccf0cb52920508ebf0c934c73b04f8a4cec14b8020f` |

Design was not modified. Its previous blocking question has now received a
Product answer, but updating Design is explicitly deferred until this revised
Spec receives new Gate 2 approval.

## Strict validation

Command:

`pnpm exec openspec validate restaurant-knowledge-validated-knowledge --strict`

Expected/current result after revision:

`PASS — Change 'restaurant-knowledge-validated-knowledge' is valid`

## Changed assumptions from Analysis

Một targeted Product requirement được added after Sensitive Design identified
the gap: individual saved statements must contain a non-whitespace character
and accepted surrounding whitespace is preserved exactly.

Đây là refinement duy nhất. It does not alter ownership, permissions, tenancy,
save granularity, removal flow, anti-duplication, provenance, non-relationships
or any lifecycle dimension.

## CONFLICT

`NONE`.

## NEEDS REVIEW

`NONE` at requirement level after the explicit Human Product decision.

The Design remains intentionally unrevised and therefore cannot be approved or
used for Tasks until Gate 2 is re-approved and the Design is reconciled in a
later authorized run.

## UI and sensitive-change routing

- `UI_AFFECTING: YES`;
- `BROWSER_QA_REQUIRED: YES`;
- real Browser QA remains mandatory before Gate 3;
- Gate 2 approval permits Design reconciliation only;
- Sensitive Design Gate remains mandatory before Tasks or Apply.

## Exact revised spec.md content

Path:
`openspec/changes/restaurant-knowledge-validated-knowledge/specs/restaurant-knowledge/validated-knowledge/spec.md`

SHA-256:
`9fd953a0a931593137dcc3f2d7c420906e087fa395251e17fe7bfd7328e7445c`

<!-- BEGIN EXACT spec.md -->
~~~markdown
## Purpose

Định nghĩa hành vi cho danh sách các phát biểu Restaurant Knowledge cấp establishment được người có thẩm quyền chấp nhận thủ công, với ranh giới ownership rõ ràng và persistence chỉ qua explicit save.

## ADDED Requirements

### Requirement: Item thuộc đúng ownership và có ngữ nghĩa độc lập

Hệ thống SHALL coi một validated knowledge item là một phát biểu ngữ nghĩa mô tả cấp establishment, có thể hiểu và tái sử dụng độc lập, được một authorized restaurant human tạo hoặc chấp nhận thủ công. Restaurant Knowledge SHALL chỉ canonically own item khi không có capability YUTA hiện hữu nào đã canonically own cùng semantic information và việc lưu item không tạo competing source of truth. Semantic meaning SHALL quyết định ownership, không phải hình thức lưu trữ.

Capability SHALL NOT biến thành một trường `Autres informations` chung chứa nhiều chủ đề không liên quan. Ranh giới một item bằng một semantic statement là ranh giới Product/modeling; hệ thống SHALL NOT phải tự động phân loại nội dung hoặc chứng minh bằng máy rằng text chứa đúng một semantic fact.

#### Scenario: Item đủ điều kiện thuộc Restaurant Knowledge

- **WHEN** một authorized restaurant human tạo thủ công một phát biểu mô tả cấp establishment có thể hiểu độc lập, không thuộc canonical ownership của capability khác và không tạo competing source of truth
- **THEN** item đó có thể được chấp nhận làm Restaurant Knowledge validated knowledge

#### Scenario: Semantic information đã có canonical owner khác

- **WHEN** semantic information của nội dung đã được một capability YUTA khác canonically own
- **THEN** nội dung đó SHALL NOT trở thành một nguồn sự thật cạnh tranh trong validated knowledge, bất kể hình thức lưu trữ của nó

#### Scenario: Không có automated semantic validation

- **WHEN** một MANAGE user nhập thủ công nội dung cho một item
- **THEN** hệ thống SHALL NOT phải tự động phân loại nội dung, đếm semantic facts hoặc chứng minh rằng nội dung chỉ chứa đúng một semantic statement

### Requirement: Validated là sự chấp nhận thủ công của người có thẩm quyền

Một item SHALL trở thành current validated knowledge chỉ sau khi một authorized restaurant human có quyền MANAGE chủ động chấp nhận item qua manual create hoặc edit và explicit save thành công. Từ `validated` SHALL NOT được trình bày hoặc diễn giải là factual guarantee, independent verification hay certification bởi YUTA, legal hoặc regulatory verification, hoặc external-source verification.

#### Scenario: Manual acceptance tạo validated meaning

- **WHEN** một MANAGE user explicit-save thành công một item được tạo hoặc chỉnh sửa thủ công
- **THEN** item kết quả được coi là đã được người có thẩm quyền chấp nhận làm Restaurant Knowledge

#### Scenario: Không hàm ý YUTA chứng nhận

- **WHEN** một authorized user xem một current validated knowledge item
- **THEN** trạng thái validated SHALL NOT hàm ý YUTA bảo đảm tính đúng đắn, xác minh độc lập, chứng nhận pháp lý hoặc quy định, hay xác minh nguồn bên ngoài

### Requirement: Scope establishment và trusted tenancy

Validated knowledge SHALL có semantic scope là establishment và canonical owner là Restaurant Knowledge. Organization SHALL chỉ là tenancy/access envelope. User, organization, establishment, active membership, role và permission dùng để cấp quyền SHALL xuất phát từ trusted server context; giá trị do browser cung cấp SHALL NOT là authority.

#### Scenario: Truy cập trong trusted establishment scope

- **WHEN** một authorized user truy cập validated knowledge trong trusted organization và active establishment context của họ
- **THEN** hệ thống SHALL chỉ áp dụng hành vi list/view hoặc mutation cho establishment scope đó

#### Scenario: Browser input không cấp authority

- **WHEN** browser gửi organization, establishment, membership, role hoặc permission value
- **THEN** hệ thống SHALL NOT dùng các value đó để tự xác lập tenant scope hoặc authorization authority

### Requirement: READ và MANAGE là các operation độc lập

Hệ thống SHALL yêu cầu `restaurant-knowledge.read` để view/list current active validated knowledge và SHALL yêu cầu `restaurant-knowledge.manage` để create, edit, remove hoặc save. OWNER và MANAGER SHALL có READ + MANAGE theo accepted grant hiện tại; STAFF SHALL không có Restaurant Knowledge access theo mặc định. Profile permission SHALL NOT thay thế Restaurant Knowledge permission. Capability SHALL NOT bổ sung item-level permission, permission, role, principal hoặc admin/support bypass mới.

#### Scenario: READ cho phép view và list

- **WHEN** principal có `restaurant-knowledge.read` trong trusted scope yêu cầu xem validated knowledge
- **THEN** hệ thống SHALL cho phép view/list current active items của establishment đó

#### Scenario: OWNER và MANAGER có thể quản lý

- **WHEN** principal là OWNER hoặc MANAGER trong trusted scope và thực hiện create, edit, remove hoặc save
- **THEN** hệ thống SHALL áp dụng quyền READ + MANAGE hiện có cho operation đó

#### Scenario: STAFF bị từ chối

- **WHEN** principal là STAFF theo accepted default grant matrix yêu cầu view/list hoặc mutation validated knowledge
- **THEN** hệ thống SHALL từ chối Restaurant Knowledge access

#### Scenario: READ không thay thế MANAGE

- **WHEN** một authorization context thỏa `restaurant-knowledge.read` nhưng không thỏa `restaurant-knowledge.manage` yêu cầu create, edit, remove hoặc save
- **THEN** hệ thống SHALL từ chối mutation operation đó

#### Scenario: Profile permission không thay thế Restaurant Knowledge permission

- **WHEN** principal chỉ có Establishment Profile permission nhưng không có Restaurant Knowledge permission cần thiết
- **THEN** hệ thống SHALL NOT cho phép view/list hoặc mutation validated knowledge dựa trên Profile permission

### Requirement: Current active list hỗ trợ trạng thái không có item

Hệ thống SHALL hỗ trợ trạng thái không có validated knowledge item. Với authorized READ user, list/view SHALL chỉ biểu diễn current active validated knowledge items; pending create, edit hoặc removal chưa được save thành công SHALL NOT thay đổi canonical current list/view.

#### Scenario: No-item state hợp lệ

- **WHEN** establishment không có current active validated knowledge item
- **THEN** authorized READ user SHALL thấy một trạng thái danh sách không có item hợp lệ

#### Scenario: List current active items

- **WHEN** establishment có một hoặc nhiều current active validated knowledge items
- **THEN** authorized READ user SHALL có thể list/view các item hiện hành đó mà không bao gồm pending changes chưa save

### Requirement: Saved statement phải chứa nội dung non-whitespace

Hệ thống SHALL chỉ chấp nhận explicit create hoặc edit save khi statement chứa ít nhất một ký tự non-whitespace. Exact empty string và mọi content chỉ gồm whitespace SHALL không hợp lệ. Accepted non-blank text SHALL được giữ nguyên chính xác, bao gồm surrounding whitespace; hệ thống SHALL NOT trim hoặc normalize text đó.

Khi blank create hoặc edit bị reject, pending draft SHALL vẫn non-canonical và user SHALL nhận clear validation error. Blank content SHALL NOT được diễn giải là remove, delete, cancel, successful no-op hoặc canonical null. Server SHALL enforce rule này ngay cả khi client-side validation không có hoặc bị bypass. Đây là Product content validation duy nhất được capability V1 định nghĩa; hệ thống SHALL NOT thêm minimum character count khác, maximum length, formatting, semantic, language, duplicate, taxonomy hoặc category validation.

#### Scenario: Create với exact empty string bị reject

- **WHEN** một MANAGE user explicit-save pending create có statement bằng `""`
- **THEN** save SHALL fail validation, không canonical item nào được tạo, pending draft SHALL vẫn non-canonical và user SHALL nhận clear validation error

#### Scenario: Create với whitespace-only content bị reject

- **WHEN** một MANAGE user explicit-save pending create có statement chỉ gồm whitespace như `"   "` hoặc `"\n\t "`
- **THEN** save SHALL fail validation, không canonical item nào được tạo, pending draft SHALL vẫn non-canonical và user SHALL nhận clear validation error

#### Scenario: Edit existing item thành blank bị reject

- **WHEN** một MANAGE user thay pending statement của existing item bằng content không có ký tự non-whitespace rồi explicit-save
- **THEN** save SHALL fail validation, pending draft SHALL vẫn non-canonical và user SHALL nhận clear validation error

#### Scenario: Rejected blank edit giữ nguyên canonical statement trước đó

- **WHEN** một blank edit của existing item bị reject
- **THEN** previously saved canonical statement SHALL giữ nguyên không thay đổi

#### Scenario: Accepted surrounding whitespace được giữ nguyên

- **WHEN** một MANAGE user explicit-save thành công non-blank statement như `" abc "` hoặc `"  a  "`
- **THEN** canonical saved statement SHALL giữ nguyên chính xác surrounding whitespace và SHALL NOT bị trim hoặc normalize

#### Scenario: Blank không kích hoạt remove

- **WHEN** một MANAGE user explicit-save blank content cho existing item
- **THEN** hệ thống SHALL reject validation và SHALL NOT remove, delete, cancel, báo no-op success hoặc chuyển canonical statement thành null

#### Scenario: Server bắt buộc enforce non-blank rule

- **WHEN** blank create hoặc edit request đến server trong khi client-side validation không có hoặc đã bị bypass
- **THEN** server SHALL reject request trước khi blank statement trở thành canonical validated knowledge

### Requirement: Manual create chỉ trở thành canonical sau explicit save

Một MANAGE user SHALL có thể tạo thủ công một pending knowledge item. Việc nhập hoặc thay đổi draft SHALL NOT tự làm item trở thành canonical current validated knowledge. Sau explicit save thành công, created item SHALL trở thành current active validated knowledge.

#### Scenario: Create còn pending trước save

- **WHEN** một MANAGE user nhập một item mới nhưng chưa explicit-save thành công
- **THEN** item đó SHALL vẫn là pending và SHALL NOT thuộc canonical current validated knowledge

#### Scenario: Create save thành công

- **WHEN** một MANAGE user explicit-save thành công pending created item
- **THEN** saved item SHALL thuộc current active validated knowledge và có thể được authorized READ user list/view

### Requirement: Manual edit chỉ thay đổi canonical value sau explicit save

Một MANAGE user SHALL có thể chỉnh sửa một existing current validated item. Draft edit SHALL không thay đổi canonical current item trước explicit save thành công. Sau explicit save thành công, current active item SHALL phản ánh nội dung đã save.

#### Scenario: Edit còn pending trước save

- **WHEN** một MANAGE user thay đổi draft của existing current item nhưng chưa explicit-save thành công
- **THEN** canonical current item SHALL vẫn giữ nội dung đã được save trước đó

#### Scenario: Edited save thành công

- **WHEN** một MANAGE user explicit-save thành công pending edit
- **THEN** current active validated item SHALL phản ánh nội dung đã được save

### Requirement: Remove chỉ có hiệu lực sau explicit save

Một MANAGE user SHALL có thể mark một existing current item để remove. Pending removal SHALL không thay đổi canonical current knowledge trước explicit save thành công. Sau explicit save thành công, removed item SHALL không còn thuộc, được list hoặc được view như current active validated knowledge. Capability SHALL NOT cung cấp restore workflow trong V1.

#### Scenario: Removal còn pending trước save

- **WHEN** một MANAGE user mark một current item để remove nhưng chưa explicit-save thành công
- **THEN** item đó SHALL vẫn thuộc canonical current active validated knowledge

#### Scenario: Saved removal loại item khỏi current active knowledge

- **WHEN** một MANAGE user explicit-save thành công pending removal
- **THEN** item đó SHALL không còn thuộc, được list hoặc được view như current active validated knowledge

### Requirement: Explicit save là persistence boundary duy nhất

Pending create, edit hoặc remove SHALL chỉ trở thành canonical sau một explicit save thành công. Typing, blur, timer, background persistence hoặc automatic synchronization SHALL NOT làm pending change trở thành canonical. Nếu save thất bại, hệ thống SHALL NOT trình bày pending changes như canonical current validated knowledge.

Requirement này SHALL không quyết định whole-list, per-item hay batch save, số lượng hoặc vị trí save controls, hoặc transaction granularity.

#### Scenario: Không autosave

- **WHEN** một user tạo, sửa hoặc mark remove rồi xảy ra typing, blur, timer hoặc background activity mà không có explicit save thành công
- **THEN** canonical current validated knowledge SHALL không thay đổi

#### Scenario: Save thất bại không trở thành canonical

- **WHEN** một explicit save cho pending create, edit hoặc remove thất bại
- **THEN** hệ thống SHALL NOT trình bày pending change đó như canonical current validated knowledge

### Requirement: Hỗ trợ nhiều item độc lập mà không tự động xử lý semantic duplicates

Một establishment SHALL có thể có nhiều current active validated knowledge items, mỗi item là một independently understandable semantic statement. Product intent SHALL không chủ động tạo cùng một semantic fact thành nhiều active duplicate items, nhưng hệ thống SHALL NOT phải phát hiện similarity, tự động merge, chấm duplicate score, dùng AI, hoặc áp dụng uniqueness dựa trên semantic meaning hay text equality.

#### Scenario: Nhiều item độc lập

- **WHEN** authorized users đã explicit-save thành công nhiều semantic statements độc lập và đủ điều kiện ownership
- **THEN** authorized READ user SHALL có thể list/view chúng như nhiều current active items

#### Scenario: Anti-duplication không tạo runtime enforcement

- **WHEN** một MANAGE user nhập nội dung có khả năng trùng semantic information
- **THEN** hệ thống SHALL NOT phải đọc module khác, suy luận semantic similarity, tự động merge hoặc áp dụng technical text-equality uniqueness để enforce anti-duplication

### Requirement: V1 là manual-only và không có provenance workflow mở rộng

Current validated items trong V1 SHALL chỉ phát sinh qua manual MANAGE-gated flow được định nghĩa trong capability này. Capability SHALL NOT tạo candidate/suggestion state, approval queue, automatic promotion, source/origin enum, detailed provenance, revision history, audit/history UI, confidence score hoặc source-verification flow. Mọi future non-manual origin SHALL cần một Product change riêng trước khi có thể nhận validated authority.

#### Scenario: Không có candidate hoặc AI flow

- **WHEN** capability vận hành trong V1
- **THEN** hệ thống SHALL NOT tạo candidate, suggestion, inferred item hoặc automatic promotion path vào current validated knowledge

#### Scenario: Future origin không tự nhận validated authority

- **WHEN** một future source như AI, review, document, usage pattern hoặc external source tạo ra knowledge candidate
- **THEN** source đó SHALL NOT tự động trở thành current validated knowledge theo capability V1 này

### Requirement: Capability độc lập với module, runtime và consumer ngoài scope

Capability SHALL vận hành mà không có required read, write, synchronization, ownership lookup hoặc consumer relationship với Establishment Profile; Carte & menus; Personnel / Salariés; Planning; Pointage; Réservations; Stock; Suppliers; Tasks / Today; AI; Reviews / Reputation; Marketing / Content; YUTA Assistant; website/customer-facing answers; staff assistant; POS; Site Agent; Display; hoặc external providers.

Capability SHALL NOT tạo shared contract, downstream consumer, publishing, automatic learning, inference, review/comment ingestion, document extraction, usage-pattern learning, correction mining, embeddings/vector database, semantic owner detection, semantic duplicate detection, taxonomy, categories, tags, ranking, manual ordering workflow, scoring, confidence, automatic canonical update hoặc cross-runtime synchronization.

#### Scenario: Không đọc hoặc ghi canonical data của module khác

- **WHEN** authorized user create, view, edit, remove hoặc save validated knowledge
- **THEN** capability SHALL hoàn thành behavior đó mà không yêu cầu đọc, ghi, lookup owner, copy hoặc synchronize canonical data của các module được liệt kê

#### Scenario: Không có downstream consumer hoặc publishing

- **WHEN** một item trở thành current active validated knowledge
- **THEN** capability SHALL NOT tự động publish, gửi sang provider, tạo customer-facing answer, cung cấp cho staff assistant hoặc kích hoạt module khác

#### Scenario: Không có dependency với runtime local

- **WHEN** capability vận hành trong Cloud/Backoffice scope ban đầu
- **THEN** POS, Site Agent và Display SHALL không phải là dependency, persistence owner, synchronization target hoặc consumer bắt buộc
~~~
<!-- END EXACT spec.md -->

## Recommendation and required human decision

Recommendation:
`APPROVE_REVISED_GATE_2_FOR_TARGETED_DESIGN_RECONCILIATION_IF_ACCEPTED`.

Explicit human Gate 2 approval is required before Design may be revised. This
packet does not authorize Tasks or Apply.
