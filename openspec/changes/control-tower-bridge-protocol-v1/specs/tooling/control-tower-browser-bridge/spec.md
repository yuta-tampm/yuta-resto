## Purpose

Quy định hành vi của browser bridge giữa Codex và YUTA Control Tower để lệnh, kết quả, bằng chứng và điểm dừng có thể được đối chiếu theo phiên, đồng thời giữ nguyên thẩm quyền Product của Page Chat và các gate hiện hành trong YUTA Workflow v3.

## ADDED Requirements

### Requirement: R1 Bảo toàn thẩm quyền workflow

Bridge v1 SHALL phân biệt thẩm quyền điều phối browser transport của Control Tower với thẩm quyền Product/page của YUTA Workflow v3. Control Tower SHALL là điểm kết nối bridge và coordinator của Codex, nhưng SHALL NOT nhận thẩm quyền Product/shaping mới đối với `PAGE_LOCAL`. Owning Page Chat SHALL tiếp tục phụ trách `PAGE_LOCAL`; `CROSS_MODULE` và `UNCERTAIN` SHALL được chuyển Control Tower theo Workflow v3. Human SHALL tiếp tục quyết định các human gate và Product decision bắt buộc; repository authority và bằng chứng hiện tại SHALL quyết định trạng thái implementation hiện hành.

#### Scenario: R1.1 Yêu cầu PAGE_LOCAL

- **WHEN** một yêu cầu bridge được xác định là `PAGE_LOCAL`
- **THEN** Control Tower SHALL giữ vai trò browser gateway/coordinator và SHALL bảo toàn owning Page Chat làm Product/shaping authority trước khi ra lệnh cho Codex

#### Scenario: R1.2 Yêu cầu CROSS_MODULE hoặc UNCERTAIN

- **WHEN** việc phân loại hiện hành cho kết quả `CROSS_MODULE` hoặc `UNCERTAIN`
- **THEN** việc escalation SHALL tuân theo YUTA Workflow v3 và Control Tower SHALL điều phối phạm vi tương ứng mà không coi bridge là một quy tắc routing Product mới

#### Scenario: R1.3 Thiếu bối cảnh Page Chat

- **WHEN** yêu cầu theo trang không lấy đủ bối cảnh Page Chat
- **THEN** Control Tower SHALL giữ thẩm quyền PAGE_LOCAL của Page Chat, ghi trạng thái bối cảnh thiếu và SHALL NOT tự tạo Product decision thay Page Chat

#### Scenario: R1.4 Hội thoại khác với bằng chứng repository

- **WHEN** ký ức hoặc bối cảnh hội thoại mô tả implementation khác với bằng chứng repository hiện tại
- **THEN** Codex SHALL báo sai khác, repository evidence SHALL kiểm soát kết luận về current implemented state, và Control Tower SHALL giữ lại bối cảnh lịch sử để đối chiếu intended behavior

### Requirement: R2 PAGE_CONTEXT_INTAKE chỉ bổ sung đối chiếu

Với yêu cầu theo trang/module/capability, Bridge Mode SHALL có `PAGE_CONTEXT_INTAKE` để xác định owning context, quyết định Page Chat liên quan, trạng thái bối cảnh và bằng chứng repository trước khi shaping; bước này SHALL NOT thay thế Page Chat authority. Trạng thái bối cảnh SHALL dùng đúng một vocabulary: `AVAILABLE` khi bối cảnh cần thiết đã lấy được, `PARTIAL` khi chỉ lấy được một phần, `UNKNOWN` khi chưa xác định được, và `NOT_APPLICABLE` cho việc không theo trang. `AVAILABLE` SHALL NOT tự chứng minh rằng mọi lịch sử Project đã được truy xuất.

#### Scenario: R2.1 Bối cảnh có sẵn

- **WHEN** Control Tower có bối cảnh Page Chat liên quan và bằng chứng repository cho yêu cầu theo trang
- **THEN** intake SHALL ghi nguồn và quyết định liên quan cùng `AVAILABLE`, đối chiếu xung đột, rồi giữ routing thẩm quyền theo Workflow v3

#### Scenario: R2.2 Bối cảnh một phần hoặc không rõ

- **WHEN** bối cảnh Project/Page Chat thiếu, chưa lấy được hoặc không thể xác minh đủ
- **THEN** intake SHALL ghi `PARTIAL` hoặc `UNKNOWN`, nêu phần còn thiếu và SHALL NOT suy ra rằng yêu cầu hay quyết định trước đó không tồn tại

#### Scenario: R2.3 Việc không theo trang

- **WHEN** nhiệm vụ chỉ thuộc tooling/workflow bridge và không có page/module Product owner cần lấy bối cảnh
- **THEN** intake SHALL ghi `NOT_APPLICABLE` với lý do, không bịa page context

### Requirement: R3 Handshake chỉ kích hoạt intake cho một phiên

`YUTA_BRIDGE_HANDSHAKE` SHALL là machine block mở Bridge Mode cho một `RUN_ID` sau khi Codex đã xác minh đúng cuộc trò chuyện Control Tower do người dùng chọn. Block SHALL cung cấp `PROTOCOL_VERSION`, `RUN_ID`, nhiệm vụ/yêu cầu, vai trò Control Tower/Codex/Human, browser transport context, kết quả mong muốn và ranh giới an toàn liên quan. Handshake SHALL chỉ cho phép Existing-State Intake và điều phối bước kế tiếp; nó SHALL NOT tự cấp quyền sửa repository hoặc thực hiện side effect.

#### Scenario: R3.1 Handshake hợp lệ

- **WHEN** Control Tower nhận handshake có version, run ID và nhiệm vụ rõ ràng từ đúng bridge conversation đã xác minh
- **THEN** Bridge Mode SHALL gắn intake và các command tiếp theo với phiên đó, chưa coi handshake là lệnh implementation

#### Scenario: R3.2 Handshake thiếu lineage hoặc quyền

- **WHEN** handshake thiếu version/run ID rõ ràng hoặc chỉ yêu cầu thực hiện side effect mà chưa có authorization áp dụng
- **THEN** bridge SHALL yêu cầu làm rõ hoặc dừng phạm vi phụ thuộc và SHALL NOT coi handshake là quyền thực thi

### Requirement: R4 Chỉ command block hợp lệ mới có thể thực thi

`YUTA_CODEX_COMMAND` SHALL mang `PROTOCOL_VERSION`, `RUN_ID`, `ACTION`, `STAGE`, `INSTRUCTIONS`, `RETURN_EVIDENCE` và `STOP_CONDITION`. Codex SHALL chỉ thực thi command block tường minh có version/run ID khớp phiên đang hoạt động và lineage không mơ hồ. Prose ngoài block SHALL không thể thực thi.

#### Scenario: R4.1 Command hợp lệ

- **WHEN** Control Tower phát một command block đầy đủ, khớp phiên và có phạm vi được phép
- **THEN** Codex SHALL xử lý đúng `ACTION`/`STAGE` trong ranh giới `INSTRUCTIONS`, `RETURN_EVIDENCE` và `STOP_CONDITION`

#### Scenario: R4.2 Chỉ có prose hoặc block không hợp lệ

- **WHEN** phản hồi chỉ có lời giải thích hoặc thiếu một trường command bắt buộc
- **THEN** Codex SHALL NOT suy ra lệnh thực thi từ prose và SHALL yêu cầu command hợp lệ hoặc dừng với lý do

### Requirement: R5 Result block truyền bằng chứng thực

`YUTA_CODEX_RESULT` SHALL mang `PROTOCOL_VERSION`, `RUN_ID`, `STAGE`, `STATUS`, kết quả/bằng chứng của hành động và yêu cầu bước tiếp theo khi phù hợp. Nó SHALL tách `VERIFY_EVIDENCE`, `QA_EVIDENCE`, `KNOWN_EVIDENCE_LIMITATIONS` và `BLOCKERS` khi các nhóm này áp dụng; khi chưa chạy hoặc không áp dụng, SHALL ghi `NOT_RUN`, `NOT_APPLICABLE` hoặc lý do vắng mặt tương đương thay vì tạo dữ liệu giả.

#### Scenario: R5.1 Hành động có bằng chứng

- **WHEN** Codex hoàn tất một command
- **THEN** result SHALL nêu trạng thái và bằng chứng thật của đúng stage/run, đồng thời phân biệt VERIFY, QA, limitation và blocker nếu liên quan

#### Scenario: R5.2 Chưa có kiểm tra áp dụng

- **WHEN** một nhóm bằng chứng chưa được chạy hoặc không thuộc stage hiện tại
- **THEN** result SHALL ghi tình trạng đó rõ ràng và SHALL NOT báo `PASS` cho nhóm đó

### Requirement: R6 Lineage sai phải dừng an toàn

Bridge v1 SHALL fail closed khi `PROTOCOL_VERSION` hoặc `RUN_ID` không khớp, command/result lineage mơ hồ, hoặc command thuộc phiên khác/đã cũ. Codex SHALL NOT thực thi command sai lineage; Control Tower SHALL NOT dùng result sai lineage làm bằng chứng của phiên hiện tại.

#### Scenario: R6.1 Version hoặc RUN_ID không khớp

- **WHEN** command hoặc result có version/run ID khác phiên đang hoạt động
- **THEN** bên nhận SHALL từ chối áp dụng cho phiên đó và SHALL ghi lý do mismatch mà không thực thi hoặc chấp nhận bằng chứng

#### Scenario: R6.2 Command cũ hoặc lineage mơ hồ

- **WHEN** không thể xác định một command/result thuộc đúng stage và vòng hiện tại
- **THEN** bridge SHALL dừng phần việc phụ thuộc để làm rõ, không replay command theo suy đoán

### Requirement: R7 Xác minh đúng hội thoại browser trước khi gửi

Trước mỗi lần gửi block qua browser, Codex SHALL xác minh cuộc trò chuyện Control Tower do người dùng chọn bằng các định danh mạnh nhất có sẵn, gồm tiêu đề chính xác và URL/conversation ID khi có. Skill tái sử dụng SHALL NOT hardcode URL lịch sử. Khi target không chắc chắn, Codex SHALL NOT gửi tới hội thoại phỏng đoán hoặc tự đổi hội thoại; nó SHALL trả `HUMAN_REQUIRED` hoặc blocker có giới hạn theo tình huống.

#### Scenario: R7.1 Target khớp

- **WHEN** tiêu đề và URL/conversation ID quan sát được khớp target người dùng đã chọn
- **THEN** Codex SHALL được phép gửi block hợp lệ của đúng phiên theo các authorization còn lại

#### Scenario: R7.2 Target sai hoặc không xác minh được

- **WHEN** tiêu đề, URL hoặc conversation ID sai, đổi bất ngờ hoặc không thể xác minh
- **THEN** Codex SHALL dừng việc gửi, nêu bất định và yêu cầu chọn/xác nhận lại khi cần

### Requirement: R8 Delivery không chắc chắn không được gửi trùng âm thầm

Nếu trạng thái gửi/nhận qua browser không chắc chắn, bridge SHALL cho phép xác minh có giới hạn nhưng SHALL NOT gửi trùng âm thầm hoặc chuyển sang hội thoại khác khi chưa được phép. Result SHALL phân biệt delivery uncertainty với lỗi thực thi repository.

#### Scenario: R8.1 Không biết message đã gửi hay chưa

- **WHEN** browser UI không xác nhận rõ message đã được gửi hoặc đã được Control Tower nhận
- **THEN** Codex SHALL kiểm tra có giới hạn, báo trạng thái bất định nếu chưa giải quyết và SHALL NOT tự gửi lại cùng block

#### Scenario: R8.2 Delivery thất bại trước thực thi

- **WHEN** transport thất bại mà chưa có command hợp lệ được nhận
- **THEN** result hoặc handoff SHALL nêu lỗi delivery riêng, SHALL NOT ghi repository execution failure hoặc đổi sang chat khác để tiếp tục

### Requirement: R9 Mỗi vòng chỉ có một command và một result

Bridge v1 SHALL dùng một command tường minh → một result thực tế → Control Tower đánh giá. Vòng thực thi mới SHALL cần một command tường minh mới, khớp phiên. Bridge SHALL tái sử dụng anti-loop, evidence-stop, iteration-stop và recovery/evaluator limits hiện hành khi chúng áp dụng; Bridge v1 SHALL NOT tự đặt numeric cap phổ quát mới cho số vòng chat.

#### Scenario: R9.1 Tiếp tục sau một result

- **WHEN** Codex đã gửi result cho command hiện tại
- **THEN** Codex SHALL đợi Control Tower đánh giá và phát command mới trước khi thực thi vòng tiếp theo

#### Scenario: R9.2 Lặp lại mà không có bằng chứng mới

- **WHEN** cùng blocker/evaluator được đề xuất lặp lại trong phạm vi có anti-loop/evidence-stop hiện hành
- **THEN** bridge SHALL giữ lineage và stop/budget hiện hành, không reset bằng cách đổi tên stage hoặc mở phiên chat mới

### Requirement: R10 Terminal bridge state không thay lifecycle

Bridge v1 SHALL hỗ trợ `DONE`, `HUMAN_REQUIRED`, `BLOCKED` và `STOP` như action/state điều phối transport. Các trạng thái đó SHALL NOT tạo gate mới, duyệt gate, đổi QA status, hoặc ngụ ý archive, deploy hay release.

#### Scenario: R10.1 DONE

- **WHEN** Control Tower phát `ACTION: DONE` hợp lệ cho phiên hiện tại
- **THEN** Codex SHALL kết thúc bridge run và SHALL NOT tự tiếp tục repository mutation

#### Scenario: R10.2 HUMAN_REQUIRED

- **WHEN** một bước cần current-user decision hoặc xác nhận target
- **THEN** bridge SHALL tạm dừng phần việc phụ thuộc, trình bày yêu cầu cho người dùng và chỉ resume sau quyết định tường minh cùng command hợp lệ tiếp theo

#### Scenario: R10.3 BLOCKED hoặc STOP

- **WHEN** Control Tower phát `BLOCKED` hoặc `STOP` hợp lệ
- **THEN** Codex SHALL dừng phần việc tương ứng, báo blocker/điểm dừng thực tế và SHALL NOT coi đó là `DONE` hay QA result

### Requirement: R11 Human gate không được tự phê duyệt

Codex SHALL NOT tự duyệt human gate, suy diễn Product decision, coi prose Control Tower là approval, hoặc coi bằng chứng thiếu là `PASS`. Khi repository yêu cầu quyết định của người dùng hiện tại, Bridge v1 SHALL giữ yêu cầu đó và SHALL kiểm lại artifact/bằng chứng được ràng buộc trước khi resume stage tiếp theo.

#### Scenario: R11.1 Gate đang chờ review

- **WHEN** repository packet là `AWAITING_HUMAN_REVIEW` và không có quyết định tường minh của người dùng cho exact packet hiện tại
- **THEN** Codex SHALL dừng ở `HUMAN_REQUIRED` dù Control Tower prose hoặc file presence nói bước kế tiếp đã sẵn sàng

#### Scenario: R11.2 Resume sau approval

- **WHEN** người dùng duyệt gate tường minh cho artifact hiện tại
- **THEN** bridge SHALL chuyển quyết định với nguồn rõ ràng, kiểm lại bound evidence và chỉ thực thi stage tiếp theo theo command hợp lệ

### Requirement: R12 Bằng chứng, QA và limitation phải trung thực

Bridge result SHALL báo bằng chứng đã thực sự thu thập, tách VERIFY khỏi QA, nêu limitation và blocker riêng, và SHALL NOT chuyển bằng chứng bắt buộc còn thiếu thành `PASS`. Bridge SHALL giữ các trạng thái và điều kiện `BLOCKED_BY_ENVIRONMENT` hoặc tương đương của workflow sở hữu, không tạo taxonomy QA cạnh tranh.

#### Scenario: R12.1 VERIFY và QA độc lập

- **WHEN** một stage có VERIFY pass nhưng QA chưa chạy hoặc bị chặn
- **THEN** result SHALL ghi từng trục đúng trạng thái, SHALL NOT coi VERIFY pass là QA pass

#### Scenario: R12.2 Limitation còn tồn tại

- **WHEN** một giới hạn bằng chứng đã biết vẫn chưa giải quyết
- **THEN** result SHALL ghi phạm vi, bằng chứng và ảnh hưởng của giới hạn tách khỏi PASS/FAIL, không che blocker bắt buộc

#### Scenario: R12.3 Bằng chứng cũ thuộc change khác

- **WHEN** có kết quả thử bridge hoặc QA lịch sử của một Product change khác
- **THEN** Bridge v1 SHALL giữ chúng như bối cảnh lịch sử và SHALL NOT tự nhập thành VERIFY/QA hiện tại của protocol change

### Requirement: R13 Scope và working tree được bảo toàn

Codex SHALL chỉ thực thi phạm vi được người dùng, Control Tower và repository authority cho phép đồng thời. Codex SHALL NOT mở rộng scope âm thầm, xóa/sửa các thay đổi working tree không liên quan, hoặc tiếp tục khi authorization không đủ.

#### Scenario: R13.1 Working tree có thay đổi khác

- **WHEN** repository có file dirty hoặc untracked ngoài phạm vi command
- **THEN** Codex SHALL giữ nguyên chúng và chỉ quy attribution cho các path thực sự thuộc Bridge v1

#### Scenario: R13.2 Command vượt scope

- **WHEN** command yêu cầu sửa owner, Product behavior hoặc file không nằm trong authorization đã duyệt
- **THEN** Codex SHALL dừng phần vượt scope và yêu cầu review/authorization phù hợp

### Requirement: R14 Side effect cần quyền riêng

Khả năng gửi command qua bridge SHALL NOT tự cấp quyền cho commit, push, tạo PR, merge, deploy, release hoặc thao tác môi trường/dữ liệu mang tính phá hủy. Những hành động này SHALL tuân theo authorization riêng của YUTA workflow áp dụng.

#### Scenario: R14.1 Command có side effect chưa được duyệt

- **WHEN** command yêu cầu commit, push, PR, merge, deploy hoặc release mà thiếu quyền riêng phù hợp
- **THEN** Codex SHALL dừng hành động đó và báo quyền còn thiếu, dù command đúng phiên

#### Scenario: R14.2 Thao tác phá hủy

- **WHEN** command đề xuất thao tác môi trường hoặc dữ liệu phá hủy thuộc phạm vi cần approval theo workflow
- **THEN** bridge SHALL giữ yêu cầu approval hiện hành và SHALL NOT coi transport capability là quyền bỏ qua

### Requirement: R15 Ngôn ngữ machine và human được phân biệt

Các protocol block và field machine-to-machine SHALL dùng tiếng Anh. Tóm tắt, tiến độ, blocker, câu hỏi duyệt và báo cáo hướng tới người dùng SHALL dùng tiếng Việt. Quy tắc ngôn ngữ SHALL chỉ ảnh hưởng cách giao tiếp, không đổi workflow authority.

#### Scenario: R15.1 Một vòng có cả block và giải thích

- **WHEN** Control Tower hoặc Codex cần gửi block giao thức và trình bày trạng thái cho người dùng
- **THEN** block/field SHALL dùng tiếng Anh còn phần giải thích hướng tới người dùng SHALL dùng tiếng Việt; prose giải thích vẫn không thể thực thi

### Requirement: R16 Skill chỉ sở hữu transport

Skill Bridge v1 tương lai SHALL giới hạn ở xác minh handshake/target/version/run, chuyển command hợp lệ, thực thi trong scope được phép, trả result và xử lý terminal/browser/working-tree safety. Skill SHALL NOT thay Page Chat, định nghĩa lại Workflow v3, quyết định Product requirement, duyệt gate, bịa VERIFY/QA, hoặc chạy `yuta-run-change`/`yuta-finish-change` khi thiếu authorization rõ ràng.

#### Scenario: R16.1 Skill xử lý lệnh bridge hợp lệ

- **WHEN** skill nhận command hợp lệ và phạm vi workflow đã được cho phép
- **THEN** skill SHALL điều phối transport và trả result mà không tạo Product/page decision

#### Scenario: R16.2 Skill gặp quyết định Product hoặc gate

- **WHEN** việc tiếp tục cần Page Chat Product decision, human gate hoặc authorization finalization riêng
- **THEN** skill SHALL chuyển tới authority hiện hành và SHALL NOT tự quyết thay

### Requirement: R17 Control Tower Bridge Mode là phần tích hợp tối thiểu

Phần Bridge Mode trong Control Tower prompt SHALL chỉ định activation, vai trò bridge, PAGE_CONTEXT_INTAKE bổ sung, ba block protocol, ranh giới command/prose, vòng command/result và cách dừng khi target/delivery không chắc chắn. Nó SHALL tham chiếu authority hiện có và SHALL NOT chép lại hoặc định nghĩa lại Gate, Existing-State Intake, VERIFY, QA, lifecycle hay finish-change semantics.

#### Scenario: R17.1 Nhận handshake

- **WHEN** Control Tower nhận handshake hợp lệ trong browser bridge
- **THEN** Bridge Mode SHALL áp dụng contract transport cho `RUN_ID` đó và SHALL dùng workflow authority hiện hành để quyết định bước tiếp theo

#### Scenario: R17.2 Gặp quy tắc workflow sẵn có

- **WHEN** bridge cần xử lý gate, Existing-State Intake, VERIFY, QA hoặc finalization
- **THEN** Bridge Mode SHALL viện dẫn quy tắc sở hữu hiện hành thay vì tạo một bản sao hoặc trạng thái mới

### Requirement: R18 Prompt repository không chứng minh prompt live

Control Tower prompt được theo dõi trong repository SHALL chỉ là bằng chứng/authority của repository. Bridge v1 SHALL NOT tuyên bố sửa file đó đã tự đồng bộ cấu hình ChatGPT Project live; mọi thiếu bằng chứng đồng bộ hoặc xác minh live SHALL được ghi rõ.

#### Scenario: R18.1 File prompt được cập nhật nhưng live chưa xác minh

- **WHEN** file Control Tower prompt trong repository có Bridge Mode nhưng không có bằng chứng cấu hình Project live tương ứng
- **THEN** kết quả SHALL chỉ nhận diện trạng thái repository và SHALL ghi live synchronization là chưa xác minh, không báo live deployment hoặc acceptance thành công

### Requirement: R19 Browser transport QA là nghĩa vụ sau implementation

Bridge v1 SHALL phân loại `UI_AFFECTING = NO` và Product UI QA là `NOT_APPLICABLE`, nhưng implementation sau các gate SHALL có Browser QA thực tế cho transport. QA SHALL kiểm tra ít nhất đúng hội thoại, version/run ID, command/result round, prose non-execution, `HUMAN_REQUIRED`, `BLOCKED`, `DONE`, lineage mismatch và delivery uncertainty/no silent duplicate khi có thể kiểm tra an toàn. Kết quả thử trước change này SHALL NOT tự thay thế QA hiện tại.

#### Scenario: R19.1 Browser QA của protocol

- **WHEN** implementation Bridge v1 được đưa tới stage QA sau các gate
- **THEN** QA SHALL chứng minh các hành vi transport bắt buộc trong browser thật và báo riêng mọi tình huống không thể kiểm tra an toàn

#### Scenario: R19.2 Không có bằng chứng Browser QA bắt buộc

- **WHEN** một hành vi transport bắt buộc chưa được kiểm tra hoặc bị chặn
- **THEN** QA SHALL không báo `PASS` cho nghĩa vụ đó và SHALL giữ blocker/limitation theo workflow hiện hành

## Explicit Non-requirements

Bridge v1 SHALL NOT tạo orchestration web app hoặc API thay browser bridge; SHALL NOT đổi YUTA Workflow v3 hay Page Chat authority; SHALL NOT tạo Gate 4, Product UI, auth/schema/business change hoặc QA status mới; SHALL NOT tự commit/push/PR/merge/deploy/release; SHALL NOT hardcode URL hội thoại lịch sử hoặc chuyển các bridge test cũ thành normative Product evidence.
