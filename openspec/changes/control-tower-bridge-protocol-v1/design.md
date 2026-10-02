## Context

Gate 1 đã duyệt 13 quyết định; Gate 2 đã duyệt [delta Spec](specs/tooling/control-tower-browser-bridge/spec.md) gồm 19 Requirements / 41 Scenarios, SHA-256 `b6784468976d1637f0223cc87c9c0c49e5e929757ff28353465419eaeb192be8`. Người dùng đã yêu cầu sửa Design được review ở SHA-256 `078a62d138245d6e1cf8a44172a19205034a7173d6916498fa770c8edaadff33`. Bản này cụ thể hóa R4/R6/R8/R18/R19 của Spec đã duyệt; không sửa Spec, Gate 1 hoặc Gate 2. Bridge Tests 001–003 là bằng chứng lịch sử, không thay QA của change này.

Ranh giới thiết kế: Control Tower là browser gateway/coordinator duy nhất của Codex, không có Product authority mới đối với `PAGE_LOCAL`. Owning Page Chat vẫn là Product/shaping authority cho `PAGE_LOCAL`; `CROSS_MODULE`/`UNCERTAIN` escalate theo [YUTA Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md). Codex không tự truy cập hoặc điều phối Page Chat. Human quyết định human gate và Product decision bắt buộc; repository evidence quyết định current implemented state. Browser bridge không tạo Product runtime, data, auth hoặc UI change. `SENSITIVE_DESIGN_GATE: NOT_TRIGGERED` được đánh giá lại bên dưới.

## Goals / Non-Goals

**Goals:**

- Chốt identity, framing và grammar của ba machine block để hai implementation tuân thủ đưa ra cùng quyết định execute/do-not-execute.
- Chốt at-most-once, result binding, browser delivery state và recovery an toàn trong giới hạn anti-loop hiện hành.
- Chốt trách nhiệm cập nhật operating context của live Control Tower conversation, điều kiện Gate 3 của capability dùng được ngay và Browser QA transport bắt buộc.

**Non-Goals:**

- Không fork hoặc sửa Workflow v3, Page Chat prompt, `yuta-run-change`, `yuta-finish-change`, Product Knowledge hoặc authority hiện có.
- Không sửa Product code/UI, API, auth, database/schema, business logic, shared UI, runtime ownership hoặc QA taxonomy.
- Không tạo web app, parser service, background store, provider API, tự đồng bộ Project live hoặc tự cấp quyền commit/push/PR/merge/deploy/release.
- Design này không thực hiện live update, implementation, Tasks/TIC, Browser QA hoặc Gate 3.

## Decisions

### 1. Hai owner Markdown, không tạo runtime bridge riêng

Implementation chỉ dự kiến thêm `.agents/skills/yuta-control-tower-bridge/SKILL.md` và một section Bridge Mode nhỏ trong `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`, cộng artifact OpenSpec/review/QA evidence. Skill ở biên browser/repository; prompt phát command và đánh giá result. Chúng tham chiếu workflow hiện hữu thay vì chép lại. Phương án app/API/parser service/background worker hoặc sửa workflow core bị loại vì vượt Gate 1. Nếu không thể thực hiện an toàn trong hai owner này, dừng `NEEDS_REVIEW`; không mở scope âm thầm.

### 2. Identity, result binding và at-most-once

`RUN_ID` xác định một bridge run duy nhất, được tạo ở handshake, gắn với đúng Control Tower conversation đã xác minh và không tái sử dụng cho run khác. Trong run, `ROUND_ID` là số thập phân dương không có số 0 ở đầu, bắt đầu từ `1` và tăng đúng `1` sau mỗi command hợp lệ đã có đúng một result/Control Tower evaluation. `COMMAND_ID` phải bằng chuỗi `RUN_ID:ROUND_ID` (dấu hai chấm literal); cặp này là identity của một executable command. `STAGE` mô tả công đoạn, không phải identity hoặc khóa reset ngân sách. Result bắt buộc lặp đúng `PROTOCOL_VERSION`, `RUN_ID`, `ROUND_ID`, `COMMAND_ID`, `STAGE` và `CAUSAL_LINEAGE_ID` của command đã chấp nhận. Control Tower chỉ gắn result cho command đó, không dùng result này để thỏa command khác.

Command chỉ được **accept** sau khi response hoàn tất và toàn bộ cú pháp, target, version, run, expected round, ID, stage, causal lineage và authorization được kiểm tra. Command trùng `COMMAND_ID`, round cũ/nhảy cóc, version/run sai, nhiều block hoặc lineage không xác lập được đều bị từ chối trước mọi execution. Một command đã accept/executed không bao giờ chạy lại, kể cả khi result gửi thất bại, trang reload, conversation mở lại, stage đổi tên hoặc message được thấy lại trong history. Nếu không thể chứng minh từ transcript phiên hiện tại cộng repository/review evidence rằng command chưa chạy, mặc định **có thể đã chạy** và dừng `HUMAN_REQUIRED`/`BLOCKED`; không replay. Duplicate result cũng không được dùng làm một vòng mới.

`CAUSAL_LINEAGE_ID` là ID ổn định cho blocker/evaluator đang được xử lý, hoặc literal `NONE` nếu chưa có causal blocker. Nó không thay thế `RUN_ID`/`COMMAND_ID`. Cùng nguyên nhân, phạm vi và evaluator purpose giữ lineage/budget cũ dựa trên evidence, kể cả khi Control Tower cấp ID mới, `ROUND_ID` mới, `STAGE` khác hoặc mở chat/run mới. Nếu transcript/evidence không đủ nối ancestry, fail closed. Skill chỉ giữ trạng thái phiên cần thiết từ conversation và repository evidence; không ghi transcript, credentials hoặc ledger nền mới. Phương án lấy `STAGE` hoặc chat URL làm identity, reset lineage bằng đổi tên, hoặc tự retry command bị loại.

### 3. Grammar chung của ba machine block

Delimiters là các dòng top-level nguyên văn, không có khoảng trắng đầu/cuối:

| Block     | Dòng mở                   | Dòng đóng                  |
| --------- | ------------------------- | -------------------------- |
| Handshake | `[YUTA_BRIDGE_HANDSHAKE]` | `[/YUTA_BRIDGE_HANDSHAKE]` |
| Command   | `[YUTA_CODEX_COMMAND]`    | `[/YUTA_CODEX_COMMAND]`    |
| Result    | `[YUTA_CODEX_RESULT]`     | `[/YUTA_CODEX_RESULT]`     |

Trong đúng **một** block mỗi message, mỗi field là một dòng `UPPER_SNAKE_CASE: value` ở cột 0. Field order không mang nghĩa; mọi field chỉ xuất hiện một lần. `value` là một dòng không rỗng, không có khoảng trắng thừa đầu/cuối, hoặc literal `|` để mở multiline. Khi dùng `FIELD: |`, mỗi dòng nội dung tiếp theo (kể cả dòng trống) phải có đúng hai dấu cách đầu dòng; bỏ hai dấu cách khi đọc. Nội dung multiline kết thúc ở field cột 0 kế tiếp hoặc closing delimiter cột 0. Markdown/code/evidence nhiều dòng nằm trong value này, từng dòng đều thụt hai dấu cách. Dòng literal giống delimiter/field phải thụt hai dấu cách như nội dung; nếu xuất hiện ở cột 0, nó có nghĩa cú pháp protocol và có thể làm block sai. Không cho nested protocol block, field lồng field hoặc continuation không đúng thụt lề.

Chỉ scan **message hoàn tất mới nhất của đúng bên gửi** trong đúng target; không gộp prose, message cũ, streaming text hoặc trích dẫn. Chỉ nhận một block đúng loại và không có marker top-level dư, block trùng, duplicate field hoặc unknown field. Một marker trong prose, quote, code fence hay text trích dẫn không trở thành lệnh; nếu không phân biệt chắc nó có phải top-level protocol hay không, từ chối. Prose ngoài block luôn `NON_EXECUTABLE`; prose chỉ nhắc tên marker, field hoặc action cũng không cấp lệnh. Block thiếu mở/đóng, sai cặp, không hoàn tất, malformed line/field, field rỗng hoặc duplicate/unknown đều fail closed. Không tự sửa, bỏ qua field lỗi, chọn block “đầu tiên”, hoặc suy ý từ prose. Version mới phải được review nếu cần field/syntax mới. Reasoning của Codex có thể áp dụng checklist này mà không tạo parser app, nhưng quyết định accept/reject phải theo quy tắc trên.

| Block                   | Required fields (mỗi field một lần)                                                                                                                                                  | Optional allowlist                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `YUTA_BRIDGE_HANDSHAKE` | `PROTOCOL_VERSION`, `RUN_ID`, `TASK`, `ROLES`, `BROWSER_TARGET`, `REQUESTED_OUTCOME`, `CONTEXT_DECLARATION`, `SAFETY_BOUNDARIES`                                                     | `CHANGE`, `PAGE_CONTEXT_INTAKE`                        |
| `YUTA_CODEX_COMMAND`    | `PROTOCOL_VERSION`, `RUN_ID`, `ROUND_ID`, `COMMAND_ID`, `CAUSAL_LINEAGE_ID`, `ACTION`, `STAGE`, `INSTRUCTIONS`, `RETURN_EVIDENCE`, `STOP_CONDITION`                                  | `CHANGE`, `ARTIFACT_SHA256`, `AUTHORIZATION_REFERENCE` |
| `YUTA_CODEX_RESULT`     | `PROTOCOL_VERSION`, `RUN_ID`, `ROUND_ID`, `COMMAND_ID`, `CAUSAL_LINEAGE_ID`, `STAGE`, `STATUS`, `RESULT`, `VERIFY_EVIDENCE`, `QA_EVIDENCE`, `KNOWN_EVIDENCE_LIMITATIONS`, `BLOCKERS` | `NEXT_REQUEST`, `ARTIFACT_SHA256`                      |

`PROTOCOL_VERSION` phải là `1`. `RUN_ID` dùng `[A-Z0-9][A-Z0-9-]*`; `ROUND_ID` theo quy tắc ở Decision 2; `COMMAND_ID` đúng công thức. `STAGE` dùng `[A-Z][A-Z0-9_]*`. `ACTION` chỉ nhận `EXECUTE`, `HUMAN_REQUIRED`, `BLOCKED`, `STOP`, `DONE`. `STATUS` chỉ nhận `COMPLETED`, `NO_ACTION`, `BLOCKED`, `FAILED`, `DEFERRED`, `STOPPED`. `CAUSAL_LINEAGE_ID` dùng cùng cú pháp với `RUN_ID` hoặc `NONE`. Text machine-to-machine trong value dùng tiếng Anh; diễn giải hướng tới Human bằng tiếng Việt ngoài block. Các trường evidence bắt buộc có thể dùng `NOT_RUN`, `NOT_APPLICABLE`, `NONE` hoặc lý do cụ thể trung thực; không bắt buộc tạo evidence không tồn tại. Nếu không có command được accept, không phát một `YUTA_CODEX_RESULT` giả gắn ID đó; chỉ có thể gửi chẩn đoán prose tiếng Anh có giới hạn trong đúng target khi delivery chắc chắn.

### 4. Handshake kích hoạt intake, không cấp quyền

Codex gửi handshake một lần sau xác minh exact target title và URL/conversation ID của cuộc trò chuyện người dùng đã chọn. `TASK` nêu yêu cầu, `ROLES` nêu Human gate authority / Control Tower gateway / Codex executor, `BROWSER_TARGET` định danh target, `REQUESTED_OUTCOME` và `CONTEXT_DECLARATION` nêu phạm vi/bối cảnh, `SAFETY_BOUNDARIES` nêu giới hạn. Handshake sai version/run, thiếu hoặc mâu thuẫn context thì chỉ làm rõ có giới hạn hoặc `HUMAN_REQUIRED`; không mutation. Một handshake trùng/replayed không khởi tạo run mới. Nó không tự duyệt gate hay cấp quyền side effect. Phương án coi handshake là implementation command bị loại.

### 5. Command acceptance, authorization và result là các kiểm tra riêng

`EXECUTE` chỉ chạy `INSTRUCTIONS` sau kiểm tra toàn bộ grammar/lineage ở trên, stage và phạm vi người dùng/Control Tower/repository authority. Preflight đọc exact packet/hash/gate và working tree; path ngoài scope được giữ nguyên. `HUMAN_REQUIRED` dừng phần phụ thuộc; quyết định của người dùng hiện tại được relay trong **một** result gắn command đang chờ, rồi chờ command mới và recheck artifact/hash trước resume. `BLOCKED`, `STOP`, `DONE` là terminal bridge action; không tạo QA/Gate/lifecycle outcome. Command hợp lệ không tự cho phép commit, push, PR, merge, deploy, release hoặc destructive action. Result báo `RESULT` thực tế và tách VERIFY/QA/limitations/blockers; sai run/round/command/stage/causal ID không được nhập làm evidence. Phương án command đúng cú pháp là quyền tối cao hoặc result “PASS” khi QA chưa chạy bị loại.

### 6. Một command, một result, rồi Control Tower đánh giá

Chỉ một accepted command outstanding trong run. Sau result tương ứng và Control Tower evaluation mới được accept `ROUND_ID` tiếp theo. `HUMAN_REQUIRED` có thể giữ round đang chờ cho tới khi current user quyết định; không phát result tạm rồi result thứ hai. Nếu người dùng defer, result `DEFERRED` vẫn gắn đúng command và bridge dừng. `DONE` kết thúc run; `STOP` dừng phạm vi command; `BLOCKED` nêu blocker; chúng không thay Gate, VERIFY/QA hoặc release status. Một result không ủy quyền vòng mới. Không đặt numeric cap phổ quát cho số bridge rounds. Anti-loop, evidence-stop, iteration-stop, recovery/evaluator limits hiện có tiếp tục áp dụng theo causal lineage. Phương án auto-continue từ prose hoặc kết quả tốt bị loại.

### 7. Target browser được xác minh trước từng send

Skill không hardcode URL. Trước handshake, result, diagnostic hoặc send hợp lệ khác, Codex so sánh user-selected conversation, exact title và URL/conversation ID quan sát được. Target sai hoặc mơ hồ sau navigation/reload: không gửi, không đổi sang chat/Page Chat khác, `HUMAN_REQUIRED` nếu cần chọn/xác nhận lại; `BLOCKED` nếu transport/session không hoạt động. Xác nhận lại target không xóa command history hoặc blocker lineage. Phương án lấy focused tab làm đủ bằng chứng bị loại.

### 8. Delivery là state machine quan sát được

Mỗi outbound message (handshake, result hoặc diagnostic) có một trạng thái; trạng thái delivery không phải QA status và không chứng minh repository execution. Chỉ tiến trạng thái bằng UI evidence ở đúng target:

| State                   | Observable evidence                                                                              | Allowed; forbidden                                                         | Retry/budget, stop/escalation                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `NOT_SENT`              | Chưa kích hoạt Send; draft còn nguyên, không có event send/post.                                 | Có thể gửi **một lần** sau target check; không nhận command từ draft.      | Chưa dùng delivery retry; nếu target không chắc, `HUMAN_REQUIRED`.                                                    |
| `SENDING`               | Send đã kích hoạt, UI chưa xác nhận posted message hoặc lỗi trước khi post.                      | Chỉ quan sát cùng target; cấm click Send lần hai hoặc chuyển chat.         | Nếu chứng minh không delivery, quay `NOT_SENT`; nếu không, `DELIVERY_UNCERTAIN`.                                      |
| `SENT_WAITING_RESPONSE` | Outbound message hiện rõ trong đúng conversation; response chưa bắt đầu.                         | Chờ/kiểm tra read-only; cấm resend và không suy command từ thiếu phản hồi. | Dùng stop/recovery hiện hành nếu chờ không tiến triển; báo `BLOCKED` nếu transport hỏng.                              |
| `RESPONSE_GENERATING`   | UI báo đang tạo phản hồi/Stop button hoặc block còn streaming.                                   | Chỉ chờ/quan sát; cấm parse/execution từ partial response, cấm resend.     | Nếu generation bị ngắt, kiểm tra có giới hạn rồi `DELIVERY_UNCERTAIN` hoặc `BLOCKED`.                                 |
| `RESPONSE_COMPLETE`     | UI không còn generating; message hoàn chỉnh được thấy trong đúng target.                         | Parse đúng message hoàn chỉnh một lần; cấm dùng message cũ/duplicate.      | Nếu malformed, chẩn đoán có giới hạn; không execution.                                                                |
| `DELIVERY_UNCERTAIN`    | Không chứng minh được message đã post, đã nhận hoặc response hoàn chỉnh sau bounded observation. | Chỉ read-only verification; cấm resend, alternate chat và replay command.  | `HUMAN_REQUIRED` khi cần người xác nhận target/delivery; `BLOCKED` khi session/transport unavailable hoặc budget hết. |

Resend **chỉ** được phép khi bằng chứng dương tính chứng minh message trước **không** được delivery (ví dụ Send chưa kích hoạt hoặc UI báo thất bại trước post cùng draft còn nguyên, và không có posted message trong đúng target). Chỉ không thấy message sau reload/loading **không** đủ. Sau khi chứng minh non-delivery, xác minh lại target/lineage, quay `NOT_SENT` rồi gửi cùng message trong giới hạn recovery hiện hành; nếu còn nghi ngờ thì không resend. Một command đã executed không bao giờ re-execute để “sửa” delivery của result. Phương án retry theo timer hoặc “no response means unsent” bị loại.

### 9. Interruption và anti-loop kế thừa

Reload chỉ cho read-only recheck target, message visibility và run/round/command history; không reset identity. Login/session loss dừng gửi/nhận với `BLOCKED` về môi trường, không đổi account hoặc target tự động. Response bị ngắt/partial không tạo command; nếu completion không chứng minh được, `DELIVERY_UNCERTAIN`. Malformed Control Tower response không được execute; có thể gửi **một chẩn đoán prose không thực thi** nếu target/delivery chắc chắn, yêu cầu block mới. Block malformed không consume round; corrected command phải vẫn dùng next expected round. Repeated malformed response cùng cause/evaluator purpose giữ lineage và áp dụng evidence-stop; đến giới hạn hoặc không tiến triển thì `BLOCKED`/`HUMAN_REQUIRED`, không lặp yêu cầu vô hạn. Target ambiguity sau navigation: không gửi/chuyển chat, `HUMAN_REQUIRED` để người dùng xác nhận lại.

Việc quan sát read-only hoặc preflight bị từ chối không tiêu `execution generation`. Một evaluator/browser execution thực sự tiêu generation theo prompt hiện hành; `MAX_EXECUTION_GENERATIONS=3` cho cùng causal lineage + stage + materially same evaluator purpose, kể cả stage được đổi tên chỉ để reset. `Recovery attempt` chỉ tính sau corrective action rồi quan sát lại cùng blocker vẫn còn, với `MAX_RECOVERY_ATTEMPTS=2` theo causal lineage hiện hành. Không tạo ngân sách mới cho delivery; mỗi case map vào các control này, anti-loop/evidence-stop/iteration-stop và stop khi không còn tiến bộ. Mở lại chat, reload hoặc cấp round mới không làm mới budget/lineage. Nếu không chứng minh được ancestry, dừng trước execution. Phương án một retry framework bridge riêng bị loại.

### 10. PAGE_CONTEXT_INTAKE bảo toàn Page Chat authority

Control Tower đối chiếu owner, Project/Page Chat context mà nó thực sự truy xuất, quyết định Page Chat có nguồn và repository evidence; ghi `AVAILABLE` khi đủ cho yêu cầu, `PARTIAL` khi chỉ một phần, `UNKNOWN` khi chưa xác lập, `NOT_APPLICABLE` cho change tooling không theo trang. `AVAILABLE` không chứng minh toàn bộ lịch sử Project đã được lấy. Thiếu context không chứng minh quyết định Page Chat không tồn tại. `PAGE_LOCAL` chờ owning Page Chat định hình Product; `CROSS_MODULE`/`UNCERTAIN` escalate theo Workflow v3; Codex không tự truy cập Page Chat. Repository evidence kiểm soát current implementation, còn context hội thoại giải thích intended behavior; discrepancy được báo rõ. Phương án Control Tower tự tạo Product decision hoặc dùng bridge để đổi routing bị loại.

### 11. Section Bridge Mode trong tracked prompt là tối thiểu

Sau các gate, section nằm sau `## Authority and routing`, trước `## Existing-state intake` trong prompt hiện hành. Nó nêu handshake activation, vai trò gateway/Page Chat, PAGE_CONTEXT_INTAKE, exact three-block contract, command identity/framing, prose non-execution, round/result, delivery fail closed và machine English/human Vietnamese; trỏ tới Workflow v3 và các mục Gate/VERIFY/QA/finalization sẵn có. Không chép lại workflow, định nghĩa Gate mới hoặc cập nhật live Project bằng file write. Phương án duplicate workflow trong prompt bị loại.

### 12. Tracked Control Tower prompt khác live conversation context; live là Gate 3 prerequisite

Codex chỉ sửa tracked Control Tower prompt sau authorization Apply riêng. Prompt này là repository representation của Control Tower operating instructions, không tự đồng bộ live conversation. Human chịu trách nhiệm áp dụng full Bridge Mode v1 đã review vào operating context của đúng conversation **YUTA — Control Tower** bằng thao tác thủ công; Design không giả định API hoặc tự sync. Global YuTa SARL Project Instructions chỉ chứa shared Project-wide rules và có thể chứa boundary ngắn về Bridge authority/routing; chúng không nhận full Bridge runtime protocol và không truyền protocol đó tới Page Chats. Codex hỗ trợ đối chiếu và Browser QA sau authorization; không tự coi file diff hay global Project settings là live conversation update.

Bằng chứng live cần định danh đúng Project và exact title/URL của user-selected Control Tower conversation, timestamp, evidence Human đã cập nhật operating context của chính conversation đó và quan sát full Bridge Mode v1 hoạt động qua một fresh handshake → valid command → bound result → Control Tower evaluation. Command/result phải đúng protocol v1 grammar, `RUN_ID`, `ROUND_ID`, `COMMAND_ID` và `CAUSAL_LINEAGE_ID`; malformed command và prose không được execute. So sánh nội dung/fingerprint của live context với tracked section khi UI hỗ trợ, nhưng không bịa byte parity nếu UI không phơi bày instructions; lưu evidence tối thiểu không chứa secret. Human attestation hỗ trợ provenance, không thay runtime observation. Một round live chứng minh activation ở conversation này, không thay 24-case Browser QA hoặc chứng minh mọi human-stop behavior. Evidence dispositions `VERIFIED`, `NOT_VERIFIED`, `OUTSIDE_REPOSITORY_CONTROL` không phải QA status mới. Với change này, `LIVE_CONTROL_TOWER_BRIDGE_MODE = VERIFIED` là live-target-specific claim và tương ứng `LIVE_BRIDGE_MODE = VERIFIED` trong records hiện có; điều kiện đó bắt buộc trước Gate 3 ready. `NOT_VERIFIED` hoặc `OUTSIDE_REPOSITORY_CONTROL` không đủ; nếu không thể kiểm chứng, ghi blocker/canonical QA disposition, không tự duyệt Gate 3. Phương án suy live từ tracked file, yêu cầu full global Project Instructions parity, hoặc báo Gate 3 ready chỉ nhờ static PASS bị loại.

### 13. Static validation, Browser QA và side effects

Static contract review sau Apply kiểm tra owner files, exact markers/field allowlist, identity/result binding, fail-closed cases, prompt diff, authority references và docs/format. Browser QA phải dùng browser thật và lưu bằng chứng/limitation từng case; `UI_AFFECTING = NO`, Product UI QA `NOT_APPLICABLE`, Bridge transport Browser QA `REQUIRED`. Bridge Tests 001–003 chỉ là `HISTORICAL / NON-NORMATIVE EVIDENCE`. Nếu case không thể tái hiện an toàn, ghi blocker/limitation theo QA taxonomy hiện hành; không PASS giả. Không tạo harness/browser framework mới nếu static checks và QA hiện hành đủ. Trước repository action, baseline working tree và exact paths được kiểm tra; dirty/untracked unrelated được giữ nguyên. Commit/push/PR/merge/deploy/release và destructive actions luôn cần authorization riêng. Phương án dùng technical executability làm quyền side effect bị loại.

| Browser QA case sau Apply                  | Evidence bắt buộc                                                                                                                                                                                                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correct target                             | Exact selected title và URL/conversation ID trước từng send; message ở đúng chat.                                                                                                                                       |
| Wrong/ambiguous target                     | Không send khi title/URL/ID sai hoặc thiếu.                                                                                                                                                                             |
| RUN_ID mismatch                            | Không accept command/result khác run.                                                                                                                                                                                   |
| ROUND_ID / COMMAND_ID mismatch hoặc replay | Không accept stale/gap/duplicate; command không execute lần hai; result không gắn command khác.                                                                                                                         |
| Prose-only response                        | Không suy command từ prose.                                                                                                                                                                                             |
| Malformed command                          | Thiếu marker/field, unknown/duplicate field, incomplete hoặc multiline sai đều không execute.                                                                                                                           |
| Duplicate command block                    | Không chọn một block; fail closed.                                                                                                                                                                                      |
| Multi-round flow                           | Command → đúng một result → CT evaluation → command mới với ID kế tiếp.                                                                                                                                                 |
| `HUMAN_REQUIRED`                           | Dừng phần phụ thuộc, không tự duyệt.                                                                                                                                                                                    |
| Human decision relay                       | Nguồn current-user, exact verdict, đúng command ID; không fabricated approval.                                                                                                                                          |
| Artifact/hash recheck                      | So exact reviewed bytes trước resume.                                                                                                                                                                                   |
| Resume valid new command                   | Sau Human decision, chỉ command mới đúng round/lineage mới chạy.                                                                                                                                                        |
| `BLOCKED`                                  | Dừng blocker, không tự chuyển thành PASS/DONE.                                                                                                                                                                          |
| `STOP`                                     | Dừng ngay đúng scope, không auto-continue.                                                                                                                                                                              |
| `DONE`                                     | Đóng bridge run, không ngụ ý archive/release/Gate 3.                                                                                                                                                                    |
| Delivery uncertainty                       | Bounded read-only check, không duplicate resend/alternate chat; resend chỉ sau chứng minh non-delivery.                                                                                                                 |
| Reload / login loss / interrupted response | Recheck target/identity; partial không execute; blocker/limitation trung thực nếu không tái hiện an toàn.                                                                                                               |
| `PAGE_LOCAL` authority                     | Owning Page Chat tiếp tục Product/shaping; CT chỉ gateway.                                                                                                                                                              |
| PAGE_CONTEXT_INTAKE `AVAILABLE`            | Nguồn đủ cho yêu cầu, vẫn giữ Page Chat authority.                                                                                                                                                                      |
| PAGE_CONTEXT_INTAKE `PARTIAL`              | Ghi phần thiếu, không bịa quyết định.                                                                                                                                                                                   |
| PAGE_CONTEXT_INTAKE `UNKNOWN`              | Không suy không có lịch sử/context.                                                                                                                                                                                     |
| Repository/context discrepancy             | Repository evidence kiểm soát current implementation; báo xung đột intended state.                                                                                                                                      |
| Live Bridge Mode verification              | Đúng Control Tower conversation, full v1 operating context và một fresh handshake → valid command → bound result → evaluation; grammar/identity/fail-closed được quan sát; `LIVE_CONTROL_TOWER_BRIDGE_MODE = VERIFIED`. |
| Scope/working tree                         | Không sửa file ngoài authorization; side effect riêng không tự phát sinh.                                                                                                                                               |

## Risks / Trade-offs

- Reasoning-based contract không có executable parser proof; grammar/top-level visibility mơ hồ phải fail closed. Nếu cần parser runtime mới, quay lại review scope.
- UI có thể đổi title, URL, rendering hoặc delivery signal; target verification và resend chỉ dựa trên evidence dương tính, nên có thể dừng dù message thực ra đã gửi.
- Không có background ledger; khi transcript/lineage sau reopen không đủ, at-most-once đạt bằng cách dừng, không bằng đoán.
- Live conversation operating context có thể không phơi bày đầy đủ instructions để so sánh byte-level; phải dùng provenance Human cộng hành vi quan sát được, ghi limitation đúng mức. Nếu không chứng minh được activation, `LIVE_CONTROL_TOWER_BRIDGE_MODE` giữ `NOT_VERIFIED` và Gate 3 không ready.
- Page Chat context có thể `PARTIAL`/`UNKNOWN`; không chuyển thiếu context thành Product decision.
- Design review là stop riêng của phiên bridge, không tự tạo gate canonical mới hoặc kích hoạt Sensitive Design Gate.

## Migration Plan

Không có data/runtime migration. Sau approval riêng: implement skill và tracked Control Tower prompt section, validate static contract, Human cập nhật operating context của đúng live Control Tower conversation, Codex kiểm chứng tại conversation đó và chạy Browser QA transport, rồi đi qua VERIFY/QA/Gate 3 hiện hành. Global Project Instructions giữ shared rules/boundary ngắn; Page Chats không nhận full protocol. Current experimental browser messages thiếu ID mới là lịch sử trước implementation; không retroactively accept chúng như Bridge v1 hay QA. Run `BRIDGE-LIVE-20260925-7F6C` là historical runtime observation của một round conversation-local, chỉ được re-evaluate làm live activation evidence sau khi revised Design/Tasks được Human duyệt; nó không thay 24-case Browser QA. Rollback tracked files không tự rollback live conversation context; cần Human xử lý live context riêng. Design này không thực hiện bước nào trong kế hoạch đó.

## Open Questions

Không còn assumption kỹ thuật chưa chốt để implementation tự quyết. Có thể còn limitation môi trường ở stage QA: không thể đọc toàn bộ live conversation instructions hoặc không thể tái hiện an toàn một lỗi delivery. Khi đó report đúng phần đã quan sát và limitation/blocker; không báo Gate 3 ready hoặc tự chuyển QA PASS. Nếu một field/syntax mới cần thiết, quay lại review trước Apply.

## Sensitive Design Gate reassessment

`SENSITIVE_DESIGN_GATE: NOT_TRIGGERED`: Design không xử lý secrets/credentials, auth boundary, private conversation export/storage, provider API replacement, destructive authority hoặc Product data migration. Live Control Tower conversation context do Human cập nhật và evidence tối thiểu; nếu Apply về sau cần một boundary nhạy cảm mới, dừng `NEEDS_REVIEW` trước khi mở scope.
