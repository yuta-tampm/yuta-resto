## Purpose

Quy định hành vi của mode transport Federated Control Towers để Codex có thể làm việc qua một Control Tower đang hoạt động đúng scope, chuyển giao giữa Page và Global Control Tower hoặc luân chuyển instance có bằng chứng, đồng thời giữ nguyên thẩm quyền YUTA Workflow v3 và các bảo vệ của Bridge v1.

## ADDED Requirements

### Requirement: F1 Mode federation độc lập và tương thích Bridge v1

Federated Control Towers SHALL là mode transport/điều phối được kích hoạt tường minh cho đúng execution context; nó SHALL NOT tự thay thế mode một gateway của `control-tower-bridge-protocol-v1`. Khi federation chưa được kích hoạt và xác minh, browser bridge hiện hành SHALL tiếp tục tuân theo Bridge v1. Bằng chứng và trạng thái QA của hai mode SHALL được tách riêng.

#### Scenario: F1.1 Chưa kích hoạt federation

- **WHEN** không có activation federation hợp lệ cho execution context
- **THEN** Codex SHALL giữ routing một Control Tower theo Bridge v1 và SHALL NOT chọn một Page Chat làm endpoint mới

#### Scenario: F1.2 Federation được chọn

- **WHEN** Human hoặc workflow đã được review chọn mode federation cho một context và activation được xác minh
- **THEN** transport SHALL áp dụng các ràng buộc federation cho đúng context đó mà SHALL NOT diễn giải lại lịch sử hoặc trạng thái QA của Bridge v1

#### Scenario: F1.3 Bằng chứng QA baseline

- **WHEN** một kết quả QA của Bridge v1 được dùng để đánh giá federation
- **THEN** kết quả đó SHALL chỉ được ghi là baseline hoặc historical context và SHALL NOT tự làm một case federation thành PASS

### Requirement: F2 Role, scope và instance không tạo Product authority

Mode federation SHALL phân biệt `CONTROL_TOWER_ROLE`, `CONTROL_TOWER_SCOPE` và `CONTROL_TOWER_INSTANCE` trong quyết định chọn target và bằng chứng handoff. `GLOBAL_CONTROL_TOWER` SHALL là vai trò điều phối `CROSS_MODULE`, `UNCERTAIN`, cross-page, shared architecture và foundation. `PAGE_CONTROL_TOWER` SHALL được ràng buộc với owning Page Chat và scope `PAGE_LOCAL` của một page/module/capability. Vai trò tower SHALL NOT tự cấp thêm Product/shaping, Human Gate, escalation, recovery-budget hoặc side-effect authority.

#### Scenario: F2.1 Page Chat kiêm Page Control Tower

- **WHEN** một owning Page Chat được đề xuất làm `PAGE_CONTROL_TOWER`
- **THEN** mode SHALL đòi bằng chứng ràng buộc role, scope, instance và Page Chat owner trước activation, và SHALL giữ nguyên Product/shaping authority hiện có của Page Chat đó

#### Scenario: F2.2 Nhiều instance cùng tên

- **WHEN** hai conversation có title giống hoặc gần giống nhưng conversation identity khác nhau
- **THEN** mode SHALL coi đó là các `CONTROL_TOWER_INSTANCE` riêng và SHALL NOT cho instance mới kế thừa quyền từ tên gọi

#### Scenario: F2.3 Scope vượt khỏi page

- **WHEN** một Page Control Tower nhận yêu cầu cross-page, shared/foundation, `CROSS_MODULE` hoặc `UNCERTAIN`
- **THEN** nó SHALL NOT tự mở rộng scope hoặc quyết định Product thay Global Control Tower; việc phụ thuộc SHALL dừng để escalation

### Requirement: F3 Routing PAGE_LOCAL trực tiếp nhưng giữ escalation

Trong mode federation đã kích hoạt, transport cho một yêu cầu `PAGE_LOCAL` SHALL có thể dùng đúng `PAGE_CONTROL_TOWER` đang active mà không bắt buộc đi qua Global transport. Owning Page Chat SHALL tiếp tục là Product/shaping authority. `CROSS_MODULE` và `UNCERTAIN` SHALL được chuyển cho `GLOBAL_CONTROL_TOWER` theo YUTA Workflow v3; chọn endpoint transport SHALL NOT thay quy tắc phân loại Product.

#### Scenario: F3.1 PAGE_LOCAL có Page tower hợp lệ

- **WHEN** impact check cho `PAGE_LOCAL`, owning Page Chat được xác định và đúng Page tower đã active
- **THEN** Codex SHALL chỉ nhận lệnh transport qua Page tower đó trong scope được phép, còn Product/shaping quyết định SHALL tiếp tục thuộc owning Page Chat

#### Scenario: F3.2 PAGE_LOCAL chưa có Page tower hợp lệ

- **WHEN** không chứng minh được owner, scope, instance hoặc activation của Page tower
- **THEN** Codex SHALL NOT tự truy cập hoặc điều phối một Page Chat bất kỳ và SHALL dừng phần phụ thuộc với lý do rõ ràng

#### Scenario: F3.3 CROSS_MODULE hoặc UNCERTAIN

- **WHEN** impact check hoặc bằng chứng mới phân loại việc là `CROSS_MODULE` hoặc `UNCERTAIN`
- **THEN** Page tower SHALL ngừng thực thi phần phụ thuộc và SHALL chuyển theo escalation Workflow v3 tới Global Control Tower

### Requirement: F4 Chỉ một active tower có quyền thực thi

Một bridge execution context đang hoạt động SHALL có đúng một `ACTIVE_CONTROL_TOWER` được xác minh tại một thời điểm. Nếu chưa thể xác định một active tower duy nhất, context SHALL không có quyền thực thi. Tuyên bố trong browser hoặc Markdown đơn lẻ SHALL NOT được coi là bằng chứng bảo đảm loại trừ đồng thời.

#### Scenario: F4.1 Active tower duy nhất

- **WHEN** activation record hoặc cơ chế tương đương được duyệt xác định một target đúng role, scope và instance, không có xung đột
- **THEN** chỉ target đó SHALL được gửi và phát command có thể thực thi cho context

#### Scenario: F4.2 Hai tower nhận active

- **WHEN** hai instance cùng tuyên bố active hoặc bằng chứng active-tower mâu thuẫn
- **THEN** Codex SHALL dừng thực thi ở cả hai target và SHALL yêu cầu giải quyết qua Human hoặc workflow có thẩm quyền

#### Scenario: F4.3 Không chứng minh được exclusivity

- **WHEN** browser/record hiện có không chứng minh được tower cũ đã mất quyền thực thi trước khi tower mới active
- **THEN** mode SHALL fail closed và SHALL NOT suy ra atomic exclusivity từ việc đổi tab, đổi title hoặc timeout

### Requirement: F5 Activation, fencing và xác minh target

Activation tower mới SHALL cần target selection tường minh của Human hoặc workflow được review cho phép, ràng buộc đúng role/scope/instance và xác minh chính xác title cùng URL/conversation identity mạnh nhất có sẵn trước mỗi lần gửi. Tower cũ SHALL terminal, frozen, revoked hoặc được chứng minh không còn quyền thực thi theo cơ chế được duyệt trước khi tower mới có quyền thực thi. Command cũ sau transfer SHALL bị từ chối.

#### Scenario: F5.1 Chuyển target an toàn

- **WHEN** tower cũ đã có trạng thái không thực thi được chứng minh, handoff hợp lệ và target mới được chọn/xác minh
- **THEN** mode SHALL chỉ kích hoạt tower mới sau khi các điều kiện đó được đối chiếu và SHALL ghi nguồn activation

#### Scenario: F5.2 Target sai hoặc mơ hồ

- **WHEN** title, URL/conversation identity, role, scope hoặc instance của target mới sai hay không chắc chắn
- **THEN** Codex SHALL NOT gửi handshake, command hoặc result tới target phỏng đoán và SHALL dừng có bằng chứng

#### Scenario: F5.3 Command từ tower cũ

- **WHEN** tower cũ phát command sau khi quyền thực thi đã được chuyển hoặc không thể chứng minh nó còn active
- **THEN** Codex SHALL từ chối command đó trước execution và SHALL NOT dùng result của nó cho tower mới

### Requirement: F6 Escalation Page sang Global bảo toàn lineage

Khi một yêu cầu `PAGE_LOCAL` thành `CROSS_MODULE` hoặc `UNCERTAIN`, Page Control Tower SHALL dừng phần thực thi phụ thuộc và tạo handoff có provenance trước khi Global Control Tower được kích hoạt. Escalation SHALL bảo toàn causal blocker lineage, recovery attempts, evaluator/execution generations, evidence-stop disposition, approvals và limitation; SHALL NOT cho hai tower thực thi đồng thời.

#### Scenario: F6.1 Scope chuyển CROSS_MODULE

- **WHEN** Page tower phát hiện ảnh hưởng cross-module trong một run đang xử lý
- **THEN** phần thực thi page-local phụ thuộc SHALL dừng, handoff SHALL nêu lý do và state chưa giải quyết, và Global SHALL chỉ tiếp nhận sau activation hợp lệ

#### Scenario: F6.2 Escalation đang chuyển giao

- **WHEN** handoff đã được tạo nhưng Global chưa được xác minh và active
- **THEN** không tower nào SHALL thực thi command phụ thuộc; Human Gate hoặc blocker hiện có SHALL tiếp tục chờ với cùng causal lineage

### Requirement: F7 Handoff bền là bằng chứng, không phải authorization

Mỗi escalation hoặc instance rotation cần chuyển execution context SHALL có handoff bền với provenance hoặc một cơ chế tương đương được repository/workflow phê duyệt. Handoff SHALL mang source/target role, scope, instance và conversation identity; terminal/delivery state của run trước; `RUN_ID`, `ROUND_ID`, `COMMAND_ID`, `CAUSAL_LINEAGE_ID`; recovery/evaluator budgets và evidence-stop state; Human approval references; artifact hashes; Product context provenance, completeness và gaps; cùng action kế tiếp được phép. Handoff SHALL là context/execution-state evidence, SHALL NOT tự cấp quyền implementation hoặc Human Gate approval.

#### Scenario: F7.1 Handoff đủ nguồn

- **WHEN** tower đích nhận handoff có nguồn, identity, approvals, hashes và state đầy đủ, còn hiện hành
- **THEN** tower đích SHALL đối chiếu chúng với canonical sources trước khi quyết định bước tiếp theo và SHALL giữ mọi giới hạn chưa giải quyết

#### Scenario: F7.2 Handoff thiếu hoặc cũ

- **WHEN** thiếu identity, terminal/delivery state, lineage, approval hoặc artifact hash cần thiết, hay bằng chứng đã stale
- **THEN** tower đích SHALL NOT tự điền bằng suy đoán hoặc tiếp tục execution; nó SHALL báo `HUMAN_REQUIRED` hoặc `BLOCKED` theo blocker thực tế

#### Scenario: F7.3 Handoff được coi như quyền Apply

- **WHEN** handoff ghi một next action có side effect nhưng chưa có quyền Human/workflow áp dụng
- **THEN** Codex SHALL giữ action đó chưa thực thi và SHALL yêu cầu authorization riêng

### Requirement: F8 Chuyển instance dùng RUN_ID mới và giữ causal lineage

Theo contract federation ban đầu, khi đổi Control Tower conversation instance, run cũ SHALL terminal trước, tower mới SHALL bắt đầu bằng `RUN_ID` mới và handshake hợp lệ sau activation. Handoff SHALL giữ `CAUSAL_LINEAGE_ID`, recovery/evaluator budgets và identity cuối của run cũ để chống replay. Chuyển target instance trong cùng `RUN_ID` SHALL NOT được phép nếu chưa có một protocol-semantic extension được duyệt riêng.

#### Scenario: F8.1 Chuyển sang instance mới

- **WHEN** tower cũ đã terminal và một target instance khác được kích hoạt hợp lệ
- **THEN** tower mới SHALL dùng `RUN_ID` mới, giữ causal lineage có provenance từ handoff, rồi mới nhận command mới

#### Scenario: F8.2 Tái sử dụng RUN_ID cũ

- **WHEN** command cho target instance mới dùng `RUN_ID` của tower cũ hoặc không chứng minh được lineage
- **THEN** Codex SHALL từ chối command và SHALL NOT xem rename/stage change là một transfer hợp lệ

### Requirement: F9 Identity, delivery và at-most-once xuyên tower

Mode federation SHALL giữ các bảo vệ Bridge v1 về protocol framing, version, `RUN_ID`/`ROUND_ID`/`COMMAND_ID`/causal lineage, result binding, một command/một result, at-most-once, stale/replay rejection, delivery uncertainty và không resend khi chưa rõ đã giao hay chưa. Các bảo vệ SHALL áp dụng cả trước và sau handoff; đổi tower SHALL NOT reset cùng causal budget hoặc cho cùng command thực thi lần hai.

#### Scenario: F9.1 Command cũ xuất hiện sau transfer

- **WHEN** một `COMMAND_ID` đã nhận hoặc có thể đã thực thi xuất hiện lại ở tower mới hay cũ
- **THEN** Codex SHALL NOT thực thi lại command đó và SHALL giữ result ràng buộc với command ban đầu

#### Scenario: F9.2 Delivery uncertain tại lúc chuyển

- **WHEN** delivery của command/result trước transfer không chắc chắn
- **THEN** Codex SHALL NOT resend hoặc kích hoạt execution phụ thuộc ở tower mới chỉ do timeout/reload; việc chuyển SHALL dừng đến khi trạng thái được xác minh hoặc Human/workflow xử lý blocker

#### Scenario: F9.3 Prose hoặc lineage sai

- **WHEN** tower phát prose-only, block malformed, sai run/round/command/lineage hoặc result không thuộc command hiện tại
- **THEN** Codex SHALL không thực thi prose hay command sai và SHALL không dùng result A làm bằng chứng cho command B

### Requirement: F10 Rotation và restart không kế thừa quyền theo title

Replacement `PAGE_CONTROL_TOWER` hoặc `GLOBAL_CONTROL_TOWER` SHALL là instance mới cần exact target verification, rehydration từ nguồn có provenance, fencing instance cũ và replay protection. Restart hoặc mất instance cũ SHALL NOT tự khôi phục executable authority từ title giống nhau hay toàn bộ lịch sử chat.

#### Scenario: F10.1 Page tower rotation

- **WHEN** Page tower cũ quá dài hoặc không còn dùng được và một Page conversation khác được đề xuất thay thế
- **THEN** owner/page scope, instance mới, handoff, approvals và old-instance state SHALL được xác minh trước activation; Product authority vẫn ở owning Page Chat

#### Scenario: F10.2 Global tower rotation

- **WHEN** Global tower được thay instance
- **THEN** cross-module scope, blockers, evaluator budgets, approvals và handoff SHALL được bảo toàn trước khi instance mới điều phối; old-instance command SHALL bị chặn

#### Scenario: F10.3 Không khôi phục được state

- **WHEN** instance cũ không còn truy cập được và canonical handoff/current-state không đủ để chứng minh authority hoặc lineage
- **THEN** mode SHALL dừng với `HUMAN_REQUIRED` hoặc `BLOCKED`, không phát lại toàn bộ chat làm nguồn duy nhất

### Requirement: F11 Canonical state nằm ngoài lịch sử chat

Federation SHALL đối chiếu từng loại thông tin với nguồn có thẩm quyền: OpenSpec và review/hashes cho planned capability và approvals; repository cho current implemented state; owning Page Chat cho `PAGE_LOCAL` Product/shaping intent; VERIFY/QA artifacts cho bằng chứng quan sát; Knowledge Consolidation cho knowledge sau lifecycle khi áp dụng; handoff/activation đã duyệt cho execution transfer. Lịch sử chat SHALL NOT là kho canonical duy nhất cho activation, recovery hoặc rotation.

#### Scenario: F11.1 Resume từ handoff

- **WHEN** tower mới cần tiếp tục một context
- **THEN** nó SHALL đối chiếu approval, artifact hashes, implementation evidence, context provenance và handoff/activation state theo đúng nguồn trước khi phát lệnh

#### Scenario: F11.2 Nguồn có mâu thuẫn

- **WHEN** handoff/chat memory khác approved artifact hoặc repository evidence hiện tại
- **THEN** tower SHALL báo discrepancy, giữ authority của từng nguồn cho loại quyết định tương ứng và SHALL NOT tự coi ký ức chat là state mới

### Requirement: F12 PAGE_CONTEXT_INTAKE có provenance trong federated mode

Federated `PAGE_CONTEXT_INTAKE` SHALL ghi owning Page Chat/source, context cần thiết, completeness và gaps bằng đúng vocabulary `AVAILABLE`, `PARTIAL`, `UNKNOWN`, `NOT_APPLICABLE`. Truy xuất trực tiếp xuyên chat SHALL là optional/best effort; Page tower có thể dùng context page-local đã có provenance hoặc explicit read-only handoff được Human cho phép. `UNKNOWN` SHALL NOT nghĩa là không tồn tại quyết định hay requirement trước đó; context handoff SHALL NOT chuyển Product authority.

#### Scenario: F12.1 Context page-local đủ

- **WHEN** đúng Page tower có bối cảnh Product/shaping của owning Page Chat được xác minh và đủ cho câu hỏi hiện tại
- **THEN** intake SHALL ghi `AVAILABLE` cùng nguồn/phạm vi, không đòi Global tự truy xuất cùng Page Chat theo conversation ID

#### Scenario: F12.2 Context một phần

- **WHEN** chỉ một phần context được xác minh hoặc handoff bỏ sót quyết định liên quan
- **THEN** intake SHALL ghi `PARTIAL`, nêu phần thiếu và SHALL dừng quyết định phụ thuộc phần thiếu

#### Scenario: F12.3 Context không rõ

- **WHEN** nguồn Page Chat, identity hoặc quyết định liên quan không thể xác minh
- **THEN** intake SHALL ghi `UNKNOWN`, SHALL NOT thay bằng cuộc trò chuyện tương tự, và SHALL NOT suy ra không có prior requirement

#### Scenario: F12.4 Không theo page

- **WHEN** nhiệm vụ chỉ liên quan tooling/workflow và không cần Product context của page
- **THEN** intake SHALL ghi `NOT_APPLICABLE` kèm lý do

### Requirement: F13 Authority, Human Gate, evidence và side effects được giữ

Federation SHALL giữ YUTA Workflow v3 authority semantics và các Human Gates hiện hành. Codex SHALL chỉ là executor/evidence collector, SHALL chỉ thực thi explicit validated command từ đúng active tower và trong quyền Human/workflow đã có. Handoff, activation, handshake, role label hoặc prose SHALL NOT tự cấp quyền Product, Apply, commit, push, PR, merge, deploy, release, sync hoặc archive. Machine protocol SHALL dùng English và giải thích cho Human SHALL dùng tiếng Việt theo Bridge v1.

#### Scenario: F13.1 Human Gate đang chờ

- **WHEN** một bước cần Human Gate nhưng chưa có quyết định current-user cho artifact đúng hash
- **THEN** cả Page và Global tower SHALL dừng phần phụ thuộc, và Codex SHALL NOT tự duyệt hoặc suy quyền từ handoff

#### Scenario: F13.2 Command vượt quyền

- **WHEN** đúng active tower phát command vượt scope, side-effect authorization hoặc approved artifact
- **THEN** Codex SHALL từ chối phần vượt quyền, báo bằng chứng và SHALL NOT xem role tower là nguồn cấp quyền mới

#### Scenario: F13.3 Kết quả và ngôn ngữ

- **WHEN** một vòng federation hoàn tất hoặc bị chặn
- **THEN** result SHALL phân biệt VERIFY, QA, limitation, blocker trung thực; machine fields SHALL dùng English và cập nhật Human SHALL dùng tiếng Việt

### Requirement: F14 Live acceptance và Browser QA riêng cho federation

Federated mode SHALL NOT được coi là live verified chỉ từ tracked prompt, artifact hash hoặc global Project Instructions. Mỗi tower instance được kích hoạt SHALL được kiểm trong đúng conversation operating context của nó bằng target identity, role/scope, activation và một vòng protocol có identity hợp lệ. Sau implementation, federated Browser transport QA SHALL chứng minh routing, single-active/fencing, escalation, handoff, fresh-run identity, stale/replay/dual-execution rejection, delivery uncertainty, rotation/restart, lineage, Human Gate, context states, discrepancy và Bridge v1 compatibility. Product UI QA SHALL là `NOT_APPLICABLE` khi không đổi Product UI.

#### Scenario: F14.1 Tracked prompt khác live context

- **WHEN** tracked prompt hoặc artifact federation đã cập nhật nhưng target conversation chưa được xác minh live
- **THEN** live federated mode SHALL giữ `NOT_VERIFIED` và SHALL NOT dựa vào hash repository để tuyên bố activation thành công

#### Scenario: F14.2 QA chưa đủ

- **WHEN** implementation đã có nhưng một Browser QA case bắt buộc chưa PASS hoặc chỉ có partial/blocked evidence
- **THEN** federation SHALL NOT được báo QA PASS hay Gate 3 READY; Bridge v1 QA SHALL giữ trạng thái riêng

## Explicit Non-Requirements

- Change này SHALL NOT chuyển `PAGE_LOCAL` Product/shaping authority khỏi owning Page Chat, sửa authority semantics của Workflow v3, tự nâng một Page Chat thành tower, tự chọn tower, hoặc cho hai tower cùng có executable authority.
- Change này SHALL NOT cho phép same-`RUN_ID` switch giữa conversation instances theo contract ban đầu, Codex tự truy cập/điều phối Page Chats không được kích hoạt đúng mode, hoặc hardcode conversation ID.
- Handoff SHALL NOT là executable protocol block mới, quyền Human Gate hoặc quyền side effect chỉ vì nó tồn tại. Grammar hoặc field thực thi mới, nếu cần, phải được duyệt như semantic extension riêng.
- Change này SHALL NOT cho phép tự commit, push, PR, merge, deploy, release, sync, archive; không thay thế hoặc nâng bằng chứng QA lịch sử của Bridge v1.
- Spec này SHALL NOT cấp quyền xử lý credential, export/lưu trữ hội thoại riêng tư, thay auth, destructive authority, external-provider control hoặc secret management. Nhu cầu như vậy phải trở về `NEEDS_REVIEW`.
