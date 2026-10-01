# backoffice/release-a-customer-exposure Specification

## Purpose

Capability này giới hạn các bề mặt Backoffice của instance khách hàng Release A theo profile phía server, giữ authorization độc lập, Google-only resource scope và recovery nhất quán; chế độ nội bộ tiếp tục giữ các capability hiện hành.

## Requirements

### Requirement: Instance exposure profile có trusted server authority

Hệ thống SHALL xác định một profile `release-a` hoặc `internal` cho toàn instance Backoffice từ server-owned configuration. Profile SHALL độc lập với active user/establishment, browser input, permission/entitlement và Product Release metadata. Browser query, form, cookie hoặc headers SHALL NOT chọn, thay đổi hoặc mở rộng profile. Invalid selection, hoặc thiếu selection tại môi trường yêu cầu cấu hình rõ ràng, MUST fail closed; không fallback sang profile rộng hơn. Việc triển khai capability SHALL NOT tự bật A ở staging/production hoặc promote lifecycle/version/readiness.

#### Scenario: Actor đổi establishment trong A

- **WHEN** user chuyển sang một establishment khác qua trusted switching flow trong instance `release-a`
- **THEN** availability SHALL vẫn là A, còn tenant/record authorization SHALL được đánh giá lại cho context mới

#### Scenario: Browser giả mạo internal

- **WHEN** browser gửi input yêu cầu profile `internal` tới instance A
- **THEN** server SHALL giữ profile A và SHALL NOT mở capability ngoài A

#### Scenario: Invalid server selection

- **WHEN** server configuration có selection không được hỗ trợ hoặc thiếu selection bắt buộc
- **THEN** hệ thống MUST từ chối protected capability entry trước data/provider effects, không diễn giải selection đó thành internal

### Requirement: A có đúng các permitted slices đã chốt

Profile A SHALL expose Aujourd'hui, Google Avis & commentaires, basic Informations générales, OWNER Google Integrations và Users & Access cho actor có quyền hiện hành. Auth/context/recovery và static presentation resources cần thiết SHALL tiếp tục phục vụ các flow này. Availability SHALL là điều kiện thêm, không thay thế valid server session, active matching membership, organization/establishment, permission, entitlement hoặc record visibility. Hệ thống SHALL NOT thêm grant hoặc dùng browser-provided scope làm authority.

#### Scenario: OWNER có prerequisite hợp lệ

- **WHEN** OWNER có trusted context và applicable entitlements/grants vào A
- **THEN** menu và entry SHALL cung cấp năm permitted slices, bao gồm link tới Google Integrations

#### Scenario: MANAGER hoặc STAFF vào A

- **WHEN** MANAGER hoặc STAFF có valid trusted context vào A
- **THEN** menu và direct entry SHALL giữ existing role constraints; Integrations SHALL chỉ cho OWNER, Users & Access SHALL chỉ cho các role được phép hiện hành
- **AND** STAFF SHALL chỉ có Google record access cho assigned items, basic profile theo existing read grant và không nhận edit/publish/connector grants mới

#### Scenario: Stale hoặc revoked membership

- **WHEN** membership/session không còn đáp ứng existing trusted prerequisites
- **THEN** protected entry SHALL bị từ chối hoặc đi qua existing safe context/access recovery; profile A SHALL NOT bypass denial

### Requirement: Deferred hosted entry bị chặn cả direct call và action replay

Trong A, hosted Booking, Satisfaction/Direct Feedback, Restaurant Knowledge, Team/Personnel/Formalités/Pointage, Stock, Compliance, Marketing và Modules/subscription entry SHALL không khả dụng. Hệ thống SHALL enforce availability trên direct pages, APIs và Server Actions, kể cả action được replay tại một allowed page URL hoặc Knowledge action nằm chung basic-profile route. Việc từ chối SHALL xảy ra trước read/serialization/mutation/provider effects của deferred capability. Hidden navigation hoặc disabled control riêng lẻ SHALL NOT thay thế server enforcement. Unknown future product entry SHALL NOT tự mở trong A.

#### Scenario: Direct deferred page hoặc legacy redirect

- **WHEN** user mở một deferred path trực tiếp hoặc qua legacy redirect trong A
- **THEN** hệ thống SHALL đưa tới permitted recovery mà không render deferred data hay tạo redirect loop

#### Scenario: Action ID gửi tới allowed URL

- **WHEN** valid user replay một deferred Server Action qua URL của allowed A surface
- **THEN** server SHALL vẫn từ chối theo invoked capability, không đọc hoặc mutate dữ liệu deferred

#### Scenario: API ngoài authenticated layout

- **WHEN** caller yêu cầu Personnel export/download hoặc bất kỳ trong bảy Pointage API operations của Backoffice trong A
- **THEN** server SHALL trả safe unavailable/denial trước protected data hoặc operation effects, kể cả có valid independent employee authority

### Requirement: A entry và recovery giữ permitted destination

Hệ thống SHALL dùng existing operator-assisted authentication, context selection/switching và reset/recovery flows. Allowed in-release deep link SHALL được giữ qua supported auth/context recovery khi actor có prerequisites; out-of-release return destination SHALL được thay bằng permitted safe destination. Missing trusted context hoặc basic profile SHALL hướng dẫn approved operator/support recovery; missing Google connection SHALL cung cấp authorized OWNER setup step hoặc handoff cho role khác. Recovery SHALL không hứa automated email/signup/wizard hoặc tự tạo context/setup state, và SHALL không loop qua destination không khả dụng.

#### Scenario: Allowed deep link cần sign-in

- **WHEN** user chưa sign-in mở một allowed A destination rồi hoàn tất supported sign-in/context selection
- **THEN** destination SHALL vẫn thuộc A và chỉ được phục vụ sau existing authorization

#### Scenario: Deferred returnTo

- **WHEN** auth hoặc switching flow nhận deferred return destination trong A
- **THEN** flow SHALL quay về permitted A entry với bounded recovery thay vì mở deferred capability

#### Scenario: Missing context hoặc profile

- **WHEN** existing trusted prerequisites không thể cung cấp usable establishment context/profile
- **THEN** user SHALL nhận safe operator/support recovery mà không được cấp context từ browser input hoặc báo setup thành công

### Requirement: A Avis read scope luôn Google và actor-scoped

Trong A, inbox/list, counts, selected detail và detail deep link SHALL chỉ cung cấp Google records readable bởi current actor trong trusted organization/establishment. Source/query/filter errors hoặc fallback SHALL NOT mở rộng sang DIRECT. Request DIRECT ID SHALL nhận cùng safe unavailable/not-found outcome như inaccessible resource, trước khi đọc/serialize protected DIRECT detail. STAFF SHALL chỉ thấy assigned Google records. A SHALL không expose Direct Feedback selectors, copy, private details hoặc AI analysis surface; existing internal presentation giữ nguyên.

#### Scenario: Forged source và invalid filters

- **WHEN** user gửi `source=DIRECT`, `ALL` hoặc malformed filters tới Avis trong A
- **THEN** server result SHALL vẫn chỉ chứa permitted Google records và counts

#### Scenario: Selected DIRECT hoặc foreign tenant ID

- **WHEN** selected query hoặc detail path chứa DIRECT, foreign-tenant hoặc actor-inaccessible ID
- **THEN** protected detail SHALL không được cung cấp; outcome SHALL không tiết lộ existence, author, contact hoặc nội dung của resource đó

#### Scenario: STAFF selected unassigned Google item

- **WHEN** STAFF yêu cầu Google item không assigned cho mình
- **THEN** list/detail SHALL deny item đó theo existing record scope, dù profile cho phép Avis

### Requirement: A mutations giữ Google source trong persistence boundary

A status/assignment update, internal note và manual draft SHALL chỉ tác động Google record readable theo existing actor scope và permitted operation grant. Browser-provided source SHALL NOT quyết định phạm vi; forged DIRECT/foreign/inaccessible IDs MUST không tạo thay đổi, note, reply hoặc successful mutation audit. OWNER/MANAGER feedback management và STAFF assigned note/draft constraints SHALL giữ nguyên. Explicit draft Save SHALL chỉ lưu draft, giữ existing validation/busy/result behavior và SHALL NOT approve/publish hoặc gọi external provider.

#### Scenario: DIRECT status hoặc note action

- **WHEN** authorized A user gửi DIRECT ID qua status/assignment hoặc note action
- **THEN** mutation MUST bị từ chối mà không thay đổi record, tạo note/reply hoặc success audit

#### Scenario: Assigned STAFF draft Save

- **WHEN** STAFF có assigned Google record và lưu valid manual draft
- **THEN** draft SHALL được persist theo existing scoped flow, không tạo approval/publication/provider call

#### Scenario: STAFF management hoặc inaccessible target

- **WHEN** STAFF cố status management, hoặc bất kỳ actor nào gửi foreign/inaccessible target
- **THEN** existing grant/record denial SHALL tiếp tục áp dụng và không có forbidden mutation effects

### Requirement: Today A dùng cùng Google local handling queue

Today A SHALL chỉ project Google records readable theo actor scope. `new` SHALL nghĩa local status `NEW`; `requiring attention` SHALL nghĩa status trong `NEW`, `TO_PROCESS`, `DRAFTED`, `FOLLOW_UP`. Attention total, preview và linked full list SHALL dùng cùng source/status/actor predicate; preview cap SHALL không giảm total. STAFF SHALL chỉ thấy assigned items. Local reply `PUBLISHED` SHALL không tự loại một item khỏi queue nếu handling status vẫn trong tập này, không được suy ra remote unanswered, reply status hoặc response rate. Booking, Direct Feedback và AI projections SHALL không được đọc/serialize hoặc hiển thị cho Today A.

#### Scenario: Preview nhỏ hơn queue

- **WHEN** permitted attention queue có nhiều records hơn preview cap
- **THEN** total SHALL là toàn queue, preview SHALL là subset, linked full list pagination SHALL có đúng cùng queue total

#### Scenario: Status và local published reply

- **WHEN** readable Google records có các attention statuses, terminal statuses và local PUBLISHED reply
- **THEN** selection/count SHALL phụ thuộc accepted handling statuses, không remote/publication inference; `new` SHALL chỉ đếm NEW

#### Scenario: STAFF queue khác OWNER

- **WHEN** STAFF và OWNER tải Today cho cùng establishment
- **THEN** mỗi actor SHALL nhận count/preview/linked list nhất quán với record scope của mình, không dùng OWNER count cho STAFF

### Requirement: A profile chỉ đọc và expose basic information

Trong A, Informations générales SHALL giữ existing Establishment Profile read/edit validation, explicit save và contact-copy behavior theo permission hiện có. Page SHALL không đọc/serialize/render sáu Knowledge sections; tám Knowledge mutation exports SHALL bị từ chối dù cùng allowed route và actor có Knowledge grant. Minimum preparation SHALL là valid context/membership, tên nhà hàng, valid locale/timezone và current permissions/entitlements; address/images/Knowledge/completion percentage SHALL không trở thành entry prerequisites hoặc persisted setup enum mới.

#### Scenario: OWNER basic profile load

- **WHEN** OWNER tải Informations générales trong A
- **THEN** basic profile SHALL khả dụng theo existing grant, còn Knowledge reads/serialization/sections SHALL không xảy ra

#### Scenario: Knowledge Save replay

- **WHEN** OWNER/MANAGER có Knowledge MANAGE gọi bất kỳ Knowledge save/create/edit/remove action trong A
- **THEN** availability SHALL từ chối trước Knowledge data operations; grant mapping SHALL không bị thay đổi

#### Scenario: STAFF basic profile

- **WHEN** STAFF có existing profile READ tải A profile
- **THEN** basic read-only behavior SHALL giữ nguyên, không cấp Profile MANAGE hoặc Knowledge access

### Requirement: Setup và empty states không bịa import evidence

A SHALL phân biệt missing Google connection/setup handoff, unavailable read và usable stored Google records. Khi chưa có importer/import-run evidence, bound connector cùng empty inbox SHALL NOT được trình bày như successful zero-review import, failed/running import hoặc verified provider reply state. Hệ thống SHALL diễn đạt import operation/provenance chưa khả dụng hoặc chưa xác định một cách trung thực, không bịa timestamp/progress/success. Stored reviews SHALL vẫn readable nếu actor có prerequisites. Customer-facing recovery SHALL dùng actionable operator/setup guidance, không database/migration/seed instructions.

#### Scenario: Missing connection không có stored reviews

- **WHEN** Google connection thiếu và không có readable stored reviews
- **THEN** OWNER SHALL nhận permitted setup step; MANAGER/STAFF SHALL nhận appropriate owner/operator handoff, không báo imported zero

#### Scenario: Bound connector và empty inbox

- **WHEN** connector có location binding nhưng không có stored reviews hoặc import-run evidence
- **THEN** UI SHALL nêu bounded unavailable/unknown import state, không khẳng định import thành công/thất bại hoặc review total tại provider

#### Scenario: Stored records với provenance chưa xác định

- **WHEN** có readable stored Google records nhưng không có import-run evidence
- **THEN** inbox/queue SHALL vẫn hiển thị records theo accepted scope mà không gán claimed import/provider readiness

### Requirement: Internal và independent apps giữ boundary hiện hành

Profile internal SHALL giữ existing module navigation, mixed-source Avis/Satisfaction, composed profile Knowledge, applicable entry/actions và source guards. Availability A SHALL chỉ giới hạn Backoffice-hosted exposure, không shutdown public Booking/Feedback hoặc local POS/Site Agent/Display. Không schema, runtime/data ownership, permission-grant hay provider-operation contract mới SHALL được suy ra từ exposure. Switching server profile SHALL không copy/migrate/erase data hoặc tự tạo onboarding/approval state.

#### Scenario: Internal mixed-source và composed profile

- **WHEN** instance chạy internal và actor có existing prerequisites
- **THEN** mixed-source Avis/Satisfaction và Knowledge composition SHALL giữ current behavior, cùng existing record/grant denials

#### Scenario: Profile đổi nhưng persistence giữ nguyên

- **WHEN** operator chọn profile khác qua separately authorized environment configuration
- **THEN** canonical records/grants SHALL giữ nguyên; availability SHALL không migrate/copy/delete data hoặc approve deployment/readiness
