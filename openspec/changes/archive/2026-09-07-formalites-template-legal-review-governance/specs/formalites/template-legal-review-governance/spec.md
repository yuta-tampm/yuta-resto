## Purpose

Định nghĩa governance contract cho external human legal review và qualification của exact GLOBAL YUTA Formalités template version trong reviewed applicability envelope. Contract này xác lập future publication prerequisites, không triển khai persistence, runtime hoặc legal-template lifecycle.

## ADDED Requirements

### Requirement: Global governance giữ nguyên ownership và authorization boundary

Formalités SHALL là semantic owner của GLOBAL YUTA Formalités templates; Platform Admin SHALL chỉ là future internal administration runtime/access boundary. Template scope SHALL NOT thuộc organization hoặc establishment và restaurant membership SHALL NOT tạo global authority.

Governance SHALL sử dụng nguyên trạng đúng năm existing independent operations: `formalites.template.read`, `formalites.template.draft.manage`, `formalites.template.review.submit`, `formalites.template.publish`, `formalites.template.retire`. `YUTA_ADMIN` SHALL chỉ nhận các explicit per-operation grants hiện có; `YUTA_SUPPORT` SHALL nhận none. Governance SHALL NOT thêm operation thứ sáu, role/principal, wildcard, prefix matching, implication, role hierarchy hoặc caller-defined policy.

Trusted system authorization SHALL yêu cầu authenticated active internal user và exact approved operation grant, không yêu cầu restaurant membership hoặc `TenantContext`. Global authority SHALL NOT được merge với, fallback sang hoặc thay thế tenant authorization.

#### Scenario: Internal publisher không có restaurant membership

- **WHEN** trusted active `YUTA_ADMIN` không có restaurant membership yêu cầu publication cho global template version
- **THEN** authority SHALL được đánh giá bằng exact `formalites.template.publish` grant
- **AND** thiếu restaurant membership SHALL NOT tự tạo denial hoặc bỏ qua bất kỳ domain qualification prerequisite nào

#### Scenario: Support hoặc restaurant-only actor yêu cầu publication

- **WHEN** actor là `YUTA_SUPPORT` hoặc chỉ có OWNER/MANAGER/STAFF membership và không có exact granted system authority
- **THEN** publication SHALL bị từ chối
- **AND** valid legal-review evidence hoặc tenant permissions SHALL NOT thay thế missing authority

#### Scenario: Global allow không cấp tenant access hoặc additional operation

- **WHEN** caller có global template authorization nhưng yêu cầu tenant resource hoặc operation ngoài năm identifiers
- **THEN** global grant SHALL NOT authorize yêu cầu đó
- **AND** tenant resource SHALL tiếp tục chịu independent trusted tenant authorization

### Requirement: Reviewer external có identity và evidenced authority phù hợp

Legal review SHALL được thực hiện external/manual bởi một cá nhân xác định được, có evidenced authority tư vấn pháp luật Pháp và competence phù hợp với French employment law trong exact review scope. Reviewer SHALL NOT cần YUTA identity, system role hoặc tenant membership. Firm/entity name đơn lẻ SHALL NOT thay thế accountable reviewer identity.

Default acceptance SHALL là avocat đăng ký tại barreau Pháp, hoặc luật sư EU được phép tư vấn pháp luật Pháp, có competence phù hợp. Juriste khác SHALL chỉ được chấp nhận khi có documented professional/legal authority cho exact type/scope of consultation và competence evidence tương ứng; nhãn “juriste qualifié” đơn lẻ SHALL NOT đủ.

Reviewer evidence SHALL xác định identity, firm/entity nếu có, professional capacity, registration hoặc equivalent authority reference, jurisdiction, competence, engagement/matter reference và dated review confirmation. `YUTA_ADMIN` status SHALL NOT cung cấp legal-review authority hoặc biến internal actor thành opinion author.

#### Scenario: Accepted external reviewer không có YUTA account

- **WHEN** external reviewer có đủ identity, authority, competence và dated confirmation cho exact review scope nhưng không có YUTA account
- **THEN** review SHALL được xét theo evidence và domain prerequisites
- **AND** governance SHALL NOT yêu cầu tạo account hoặc system role cho reviewer

#### Scenario: Reviewer identity hoặc authority không được chứng minh

- **WHEN** evidence chỉ ghi tên firm, nhãn “juriste qualifié”, hoặc thiếu căn cứ authority/competence phù hợp
- **THEN** review SHALL không đủ điều kiện hỗ trợ qualification
- **AND** publisher SHALL NOT dùng system role để tự xác nhận legal competence thay cho evidence

### Requirement: Minimum evidence ràng buộc đúng immutable version và review

Review evidence SHALL bao gồm exact template identity/version, immutable canonical-content checksum kèm thuật toán, review date, reviewer identity/authority/qualification references, review outcome, reviewed applicability envelope, binding conditions/reservations/exclusions, external deliverable hoặc confirmation reference, evidence received/recorded time và internal recorder identity.

Evidence SHALL bao gồm effective date khi liên quan, legal/conventional reference snapshot khi reviewer yêu cầu, và superseded evidence reference khi có supersession. Không applicable SHALL được phân biệt với missing hoặc unknown information; thiếu dữ liệu SHALL NOT được hiểu là không có điều kiện.

Evidence SHALL cho phép đối chiếu external opinion/confirmation thực sự áp dụng cho exact version/checksum và envelope được publication xét đến. Checksum SHALL chỉ chứng minh content identity, không tự chứng minh reviewer identity, authority hoặc authenticity của opinion. Một reference không xác lập được review source/binding SHALL NOT đủ điều kiện qualification.

#### Scenario: Complete evidence khớp exact version

- **WHEN** evidence có đủ required information và external confirmation đối chiếu được với exact immutable version/checksum/envelope
- **THEN** evidence SHALL đủ điều kiện được xét cùng outcome, publication authority và các qualification prerequisites khác
- **AND** evidence completeness SHALL NOT tự tạo publication hoặc qualification

#### Scenario: Missing evidence hoặc mismatched checksum

- **WHEN** required evidence thiếu, review source không đối chiếu được, hoặc checksum/version trong review khác publication candidate
- **THEN** candidate SHALL không được qualified hoặc successfully published
- **AND** similarity của nội dung hoặc internal assurance SHALL NOT thay thế exact binding

#### Scenario: Checksum có nhưng opinion author chưa xác thực

- **WHEN** content checksum khớp nhưng reviewer identity, authority hoặc external confirmation chưa được chứng minh
- **THEN** review SHALL không đủ điều kiện qualification

### Requirement: Applicability envelope và binding conditions được bảo toàn

Reviewed envelope SHALL xác định jurisdiction, contract category, full/part-time boundary, employee/employer categories, collective-agreement assumptions, exclusions và effective-date constraints liên quan. Declared use SHALL được đánh giá trong đúng envelope đó; unknown hoặc contradictory applicability SHALL fail closed.

Binding conditions/reservations SHALL được giữ nguyên và phải được thỏa mãn cho declared use. Internal actor SHALL NOT bỏ, mở rộng hoặc diễn giải lại conditions để cho phép một use chưa được review.

#### Scenario: Declared use ngoài envelope hoặc chưa xác định

- **WHEN** declared use nằm ngoài reviewed categories, ngoài effective dates, hoặc thiếu thông tin cần thiết để xác định applicability
- **THEN** version SHALL không được coi là qualified cho use đó
- **AND** previous publication SHALL NOT mở rộng reviewed envelope

#### Scenario: Binding condition chưa được đáp ứng

- **WHEN** external review là approved trong một envelope có binding condition nhưng condition đó chưa được thỏa mãn cho declared use
- **THEN** qualification SHALL bị từ chối cho declared use
- **AND** publisher SHALL NOT loại bỏ condition để chuyển kết quả thành qualified

### Requirement: Review outcomes có đúng ba semantic kết quả

Governance SHALL sử dụng đúng ba Product review outcomes: `APPROVED`, `CHANGES_REQUIRED`, `REJECTED`. Governance SHALL NOT tạo outcome `APPROVED_WITH_CONDITIONS` hoặc coi unknown/missing outcome là approved. Các tên này SHALL biểu đạt Product semantics, không yêu cầu enum implementation trong change này.

`APPROVED` SHALL chỉ biểu thị external reviewer chấp nhận exact version trong declared reviewed envelope; binding conditions chỉ phù hợp với outcome này khi đã thuộc envelope và không yêu cầu sửa version. `CHANGES_REQUIRED` SHALL biểu thị version cần thay đổi và chưa qualified. `REJECTED` SHALL biểu thị version không được chấp nhận cho proposed scope và không eligible cho publication đó.

Việc hiểu source opinion có conditions SHALL bảo toàn nguyên văn opinion và author attribution; internal classification SHALL NOT giả mạo hoặc sửa external reviewer outcome. Conditions yêu cầu sửa content/applicability hoặc chưa biểu diễn được trong envelope SHALL được xử lý là `CHANGES_REQUIRED`, không qualified.

#### Scenario: Approved review có conditions trong envelope hiện tại

- **WHEN** reviewer chấp nhận exact version với conditions đã nằm trong envelope và không yêu cầu sửa version
- **THEN** Product outcome SHALL là `APPROVED`
- **AND** mọi condition SHALL tiếp tục là prerequisite cho qualification, không tạo outcome thứ tư

#### Scenario: Reviewer yêu cầu chỉnh sửa

- **WHEN** reviewer yêu cầu thay đổi content/applicability hoặc condition chưa thể được biểu diễn trong envelope của exact version
- **THEN** Product outcome SHALL là `CHANGES_REQUIRED`
- **AND** version SHALL chưa qualified và cần version mới cùng new review sau thay đổi

#### Scenario: Review bị rejected hoặc outcome không hợp lệ

- **WHEN** outcome là `REJECTED`, missing, unknown hoặc được đưa vào như `APPROVED_WITH_CONDITIONS`
- **THEN** version SHALL không được qualified hoặc published dựa trên outcome đó
- **AND** governance SHALL NOT silently map outcome không hợp lệ thành `APPROVED`

### Requirement: Qualification yêu cầu đủ review và completed authorized publication

Một version SHALL chỉ được coi là qualified cho declared use khi đồng thời có exact immutable version/checksum, completed review bởi accepted external reviewer, outcome `APPROVED`, complete bound evidence, matching reviewed envelope, satisfied binding conditions/effective dates, review chưa bị supersede/invalidate, và successful authorized publication của version chưa retired.

Thiếu bất kỳ prerequisite nào SHALL ngăn qualification. Authorization allow alone SHALL NOT tạo review completion, successful publication hoặc qualification. Qualification SHALL NOT chứng minh final contract compliant/valid, employee/employer inputs chính xác hoặc legal suitability ngoài reviewed scope.

#### Scenario: Mọi qualification prerequisites được thỏa mãn

- **WHEN** exact version có accepted approved review/evidence, declared use đáp ứng toàn bộ envelope/conditions và successful authorized publication vẫn applicable, version chưa retired
- **THEN** version SHALL được coi là qualified chỉ cho declared use trong reviewed scope đó
- **AND** kết quả SHALL NOT là guarantee cho final contract hoặc input correctness

#### Scenario: Authorization allow nhưng publication chưa hoàn thành

- **WHEN** `formalites.template.publish` được allow nhưng domain publication chưa hoàn thành hoặc một qualification prerequisite không đạt
- **THEN** version SHALL không trở thành published hoặc qualified chỉ từ authorization result

#### Scenario: Completed review chưa được publication

- **WHEN** review `APPROVED` và evidence đầy đủ nhưng chưa có successful authorized publication
- **THEN** review SHALL không tự đưa version vào qualified use

### Requirement: Recorder và publisher không trở thành external opinion author

`YUTA_ADMIN` có exact publication authority SHALL được record/link evidence nhận từ external reviewer như prerequisite bên trong future atomic publication action qua `formalites.template.publish`. Evidence recording/linkage SHALL phân biệt external opinion author, internal recorder/publisher và external source reference; internal actor SHALL NOT author, sửa hoặc thay thế legal opinion.

External reviewer SHALL khác internal publisher. Recorder SHALL được phép trùng publisher; governance SHALL NOT yêu cầu reviewer YUTA identity, ba người riêng biệt hoặc hai internal approvers. `formalites.template.review.submit` SHALL chỉ đại diện submission, không cấp independent evidence intake/edit/approval authority.

Governance SHALL NOT cung cấp standalone evidence CRUD hoặc additional authorization operation. Atomic publication SHALL biểu thị semantic all-or-nothing completion: required evidence/authority không hợp lệ thì không có successful publication hoặc qualification; contract này SHALL NOT chọn transaction/storage implementation.

#### Scenario: Recorder đồng thời là authorized publisher

- **WHEN** authorized internal publisher record/link external evidence với đầy đủ attribution, reviewer là người khác và mọi domain prerequisites đạt
- **THEN** việc recorder trùng publisher SHALL NOT ngăn publication
- **AND** legal opinion SHALL vẫn thuộc external reviewer

#### Scenario: Publisher cũng là reviewer hoặc sửa external opinion

- **WHEN** internal publisher được ghi là reviewer của chính review dùng cho publication, hoặc sửa outcome/conditions/opinion để đáp ứng qualification
- **THEN** publication và qualification SHALL bị từ chối theo governance boundary

#### Scenario: Evidence linkage thất bại

- **WHEN** publication authority hợp lệ nhưng required external evidence không được liên kết hợp lệ với exact version
- **THEN** domain action SHALL không báo successful publication hoặc qualification

#### Scenario: Caller yêu cầu independent evidence management

- **WHEN** caller yêu cầu standalone evidence create/read/update/delete hoặc evidence approval dưới authority của governance capability này
- **THEN** capability SHALL không cung cấp operation đó
- **AND** existing submit/publish grant SHALL NOT được suy diễn thành independent evidence CRUD

### Requirement: Content hoặc applicability change cần version mới và new review

Bất kỳ thay đổi nào đối với canonical template content hoặc reviewed applicability SHALL tạo version mới và yêu cầu new external review cho exact new version trước qualification. Governance SHALL NOT mutate qualified immutable version hoặc chuyển evidence của version cũ sang version mới như automatic approval.

#### Scenario: Nội dung thay đổi dù được xem là nhỏ

- **WHEN** canonical content của một reviewed version thay đổi
- **THEN** changed content SHALL thuộc version mới với content checksum tương ứng và phải được review lại
- **AND** approval/evidence của version cũ SHALL NOT qualify version mới

#### Scenario: Applicability thay đổi nhưng content giữ nguyên

- **WHEN** envelope được mở rộng, thu hẹp hoặc thay đổi trong khi content bytes giữ nguyên
- **THEN** envelope mới SHALL thuộc version mới và cần new review
- **AND** content checksum giống nhau SHALL NOT cho phép kế thừa qualification

### Requirement: Supersession và retirement không ghi đè historical evidence

New review superseding earlier evidence SHALL có explicit supersession linkage và giữ historical author/outcome/version attribution. Superseded hoặc invalidated review SHALL không tiếp tục hỗ trợ current qualification. Evidence mới SHALL vượt đầy đủ prerequisites và SHALL NOT tự thực hiện publication hoặc qualification.

Khi legal/conventional change, effective-date boundary hoặc reviewer re-review trigger làm review không còn applicable, version SHALL không còn eligible cho future qualified use dựa trên review đó. Retirement qua existing authorized boundary SHALL loại version khỏi future use, không sửa ngược historical evidence hoặc previously generated artifacts. Governance SHALL NOT thêm suspension operation hoặc tự động legal-change detection/provider.

#### Scenario: Review mới supersede review đã approved

- **WHEN** earlier approved review được supersede bởi new review cho exact version
- **THEN** earlier evidence SHALL được giữ như lịch sử nhưng không tiếp tục là căn cứ current qualification
- **AND** new review SHALL phải đáp ứng đầy đủ acceptance/publication prerequisites, kể cả khi outcome mới cũng là `APPROVED`

#### Scenario: Review không còn applicable hoặc version retired

- **WHEN** review không còn applicable cho future use hoặc version đã retired
- **THEN** version SHALL không được dùng như qualified version cho future use đó
- **AND** historical publication/evidence SHALL không bị viết lại thành một review khác

### Requirement: Legal wording chỉ mô tả bounded template qualification

Khi mô tả kết quả thực sự đã đáp ứng qualification cho declared use, YUTA SHALL giới hạn wording vào “préparé à partir d’un modèle qualifié pour ce cas d’usage” và kèm qualifier gần claim: “La qualification concerne uniquement la version du modèle et le périmètre déclarés. Elle ne constitue ni un avis juridique sur la situation individuelle, ni une garantie de conformité du contrat final.”

YUTA SHALL NOT dùng qualification làm căn cứ cho “contrat conforme”, “juridiquement conforme”, “validé juridiquement” hoặc legal-compliance/certification/guarantee claims. Governance approval, authorization allow hoặc completed implementation SHALL NOT được trình bày như actual legal template qualification. Change này SHALL NOT triển khai UI/document rendering.

#### Scenario: Truthful qualification wording

- **WHEN** YUTA mô tả một declared use thực sự dựa trên exact qualified version
- **THEN** wording SHALL gắn qualification với model/version/scope và giữ qualifier nêu trên gần claim
- **AND** SHALL NOT tuyên bố final contract được chứng nhận hoặc bảo đảm pháp lý

#### Scenario: Claim không có actual qualification hoặc vượt scope

- **WHEN** chỉ governance/authorization được approved hoặc claim mô tả final contract là compliant/certified
- **THEN** claim SHALL không được chấp nhận theo wording contract

### Requirement: Private evidence và retention prerequisites đứng trước persistence

Reviewer identity/professional data và legal evidence SHALL được xử lý như potentially personal/confidential information. Public repository SHALL chỉ chứa governance descriptions/status và opaque evidence references; SHALL NOT chứa actual legal opinions, reviewer personal records, real employee data, private URLs hoặc vault paths.

Trước corresponding evidence processing/persistence, SHALL có quyết định về purpose/legal basis, minimization, recipients/access, private storage/confidentiality, active/archive separation, rights handling, legal hold, deletion/backup propagation và justified retention duration hoặc criteria. Retention duration SHALL được defer trong governance-only change này; defer SHALL NOT authorize indefinite retention, actual collection/upload hoặc persistence.

#### Scenario: Governance được định nghĩa khi duration còn deferred

- **WHEN** retention duration chưa được chốt và công việc chỉ định nghĩa governance contract
- **THEN** governance SHALL có thể được review mà không invent duration
- **AND** corresponding processing/persistence SHALL vẫn chờ đầy đủ privacy/retention decisions

#### Scenario: Evidence riêng tư được đưa vào public repository

- **WHEN** proposed evidence record chứa actual opinion, personal data, private URL hoặc vault path trong Git
- **THEN** nội dung đó SHALL không được chấp nhận
- **AND** repository SHALL chỉ giữ opaque reference phù hợp, không thực hiện upload/storage trong capability này

### Requirement: Ba audit families giữ semantics riêng biệt

Authorization/security audit SHALL mô tả actor khi resolved, exact requested operation và security decision/denial, không chứa legal opinion/template content hoặc đại diện cho domain completion. Legal-review evidence SHALL mô tả external reviewer, exact version/checksum, opinion/outcome/envelope/conditions và private evidence reference. Publication/retirement audit SHALL mô tả internal actor, exact version, completed action/time, reason khi liên quan và evidence reference.

Ba families SHALL giữ distinct attribution và meaning; security allow/deny SHALL NOT được dùng thay legal-review evidence hoặc publication completion, và publication record SHALL NOT biến internal actor thành opinion author. Contract SHALL NOT chọn audit schema, storage hoặc retention implementation.

#### Scenario: Authorization signal không là publication evidence

- **WHEN** chỉ có successful authorization context hoặc security audit signal
- **THEN** governance SHALL không suy ra completed legal review, publication hoặc qualification

#### Scenario: Publication audit tham chiếu legal evidence

- **WHEN** completed publication được ghi nhận cùng external evidence reference
- **THEN** audit SHALL giữ internal publisher/action attribution và tham chiếu riêng external opinion author/evidence
- **AND** legal opinion SHALL không được sao chép vào security log như authorization evidence

### Requirement: Governance contract không triển khai excluded capabilities

Capability SHALL chỉ định nghĩa governance semantics. Nó SHALL NOT tạo schema/migration, repository/API/UI, Platform Admin runtime, evidence persistence/upload, actual template content, generation/PDF/signature/Documents handoff, provider integration, restaurant customization hoặc production enablement. Existing tenant authorization, Backoffice sessions và persistent draft behavior SHALL không thay đổi.

Manual/private external review handling SHALL là permitted future direction, không phải provider integration hoặc authorization thực hiện actual engagement/data transfer. Workflow/spec completion SHALL NOT tự promote lifecycle/readiness, thay canonical Knowledge hoặc đóng production/legal/privacy gates.

#### Scenario: Governance spec được approved hoặc validated

- **WHEN** governance artifacts được review hoặc strict validation thành công
- **THEN** kết quả SHALL chỉ xác lập artifact/governance progress trong authorized workflow
- **AND** SHALL không tạo runtime, actual review/template qualification, lifecycle/readiness promotion hoặc production permission

#### Scenario: Future work cần persistence hoặc authority expansion

- **WHEN** việc tiếp tục yêu cầu persistence/runtime, independent evidence CRUD, new role/principal/operation hoặc tenant-authority merge
- **THEN** yêu cầu đó SHALL nằm ngoài bounded capability và cần quay lại owning Product/authority decision
- **AND** governance contract SHALL NOT cung cấp implicit permission để thực hiện
