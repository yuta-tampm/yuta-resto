# Gate 1 — Federated Control Towers Proposal và Analysis

Change: federated-control-towers-foundation
Gate: Gate 1 — Proposal + Analysis
Review status: APPROVED
Created: 2026-09-25T21:51:23.1628536+02:00
Approved: 2026-09-25T22:04:50.9329880+02:00
Approval source: explicit current-user instruction `APPROVE Gate 1`
Approval recorded by: Codex workflow
Pre-approval packet SHA-256: 6a491de2f87f95cff4a1438781ed06abbfa5f62ec4c46ddae686eacbcb869e85
Approval scope: bounded federated delta Spec and Gate 2 review only; Design, Tasks/TIC, implementation and Bridge v1 changes remain unauthorized.
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — SENSITIVE_DESIGN_GATE provisionally TRIGGERED

## Yêu cầu và ranh giới

Quyết định Human `CREATE_SEPARATE_FEDERATED_CONTROL_TOWERS_CHANGE` cho phép tạo change riêng và dừng ở Gate 1. Change đề xuất federation cho transport Codex ↔ các Control Tower conversation mà không sửa thẩm quyền Product của owning Page Chat, Workflow v3 hoặc Bridge v1 đang chạy. `PAGE_CONTEXT_INTAKE: NOT_APPLICABLE` cho chính change shaping kiến trúc này.

Bridge v1 vẫn là single-gateway baseline độc lập. Browser QA của Bridge v1 vẫn `BLOCKED_BY_ENVIRONMENT`, gồm 16 PASS, 6 PARTIAL_EVIDENCE, 2 NOT_RUN; QA PAUSED; Gate 3 NOT_READY. Không case nào của v1 được chuyển thành PASS federation.

Phạm vi review này chỉ gồm Proposal, Analysis và packet Gate 1. Chưa có Spec, Design, Tasks/TIC, handoff grammar, activation record, implementation, skill/prompt edit, live configuration, formal VERIFY, Browser QA, Gate 3, sync, archive, commit, push, PR, merge, deploy hay release.

## Nguồn thẩm quyền và tình trạng

- Root AGENTS.md; README/CURRENT_STATE/AUTHORITY_MODEL; YUTA Workflow v3; Automated Change Workflow; Page Chat và Control Tower operating prompts; Knowledge Consolidation protocol; OpenSpec config/schema; Bridge v1 Spec/Design/Tasks, skill, tracked prompt và QA report.
- Exact active/archive equivalent-change recheck: không có change federated/Page Control Tower/multi-tower tương đương; Bridge v1 không phải change tương đương vì chỉ có một gateway.
- HEAD tại lúc shaping: `fc63fef58345a4d99d07b1a4c9a427c679122bb3`. Working tree có thay đổi không liên quan, được giữ nguyên.
- Proposal: done; Analysis: done. Tại lúc tạo hồ sơ, Specs: ready nhưng chưa tạo; Design và Tasks: blocked theo artifact graph. Trước approval, `GATE_1_STATUS: AWAITING_HUMAN_REVIEW`; approval hiện chỉ cho phép delta Spec và Gate 2, Apply vẫn không được phép.

## Tóm tắt và quyết định kiến trúc cần review

1. Federation là capability riêng. Bridge v1 và toàn bộ QA/evidence của nó vẫn nguyên trạng; quan hệ tích hợp và khả năng dependency vào readiness của v1 chỉ được quyết ở các gate sau.
2. `PAGE_CONTROL_TOWER` là vai trò transport/điều phối ứng viên cho đúng page scope, có thể cùng conversation với owning Page Chat. Product/shaping authority của `PAGE_LOCAL` vẫn thuộc Page Chat đó; Codex không thành Product authority.
3. `GLOBAL_CONTROL_TOWER` vẫn nhận `CROSS_MODULE`/`UNCERTAIN` và shared/foundation concerns. Normal `PAGE_LOCAL` có thể đi trực tiếp tới Page Control Tower nếu mode tương lai được duyệt. Escalation phải dừng/fence tower cũ, xác minh tower mới, chuyển lineage và không cho dual execution.
4. Một bridge run có đúng một active tower tại một thời điểm là bất biến ứng viên; Markdown/browser tự nó chưa bảo đảm atomic exclusivity. Target switch mặc định cần terminal old run, fresh `RUN_ID` cho target mới và durable handoff có causal lineage, nhưng grammar/cơ chế chưa được duyệt.
5. Cross-chat retrieval là optional/best effort; handoff có provenance có thể là nguồn context khác. `UNKNOWN` không bao giờ nghĩa là không có requirement cũ. Repository là authority cho implemented state; Page Chat là authority cho page-local Product intent; discrepancy được báo, không tự giải.
6. Handoff/activation/current-state cần bằng chứng bền ngoài chat; không dùng toàn bộ lịch sử chat làm nguồn duy nhất. Record owner, format, writer/reader, fencing và rotation còn chờ Spec/Design.
7. `UI_AFFECTING: NO`; Product UI QA `NOT_APPLICABLE`; federated Browser transport QA `REQUIRED` sau implementation. Sensitive Design Gate được phân loại `TRIGGERED` do durable cross-module boundary, cần Human review trước Tasks/Apply nếu scope giữ nguyên.

## CONFLICT / NEEDS REVIEW / giới hạn

- Không có xung đột authority đã chứng minh ngăn Gate 1 review. Có căng thẳng tương thích cần quyết định ở Gate 1: Bridge v1 cấm Codex trực tiếp truy cập Page Chats, còn mode federation đề xuất Page Control Tower. Không được tự mở ngoại lệ trong skill v1.
- Chưa có cơ chế chắc chắn cho single-active, chống split-brain, stale command, double execution hoặc recovery xuyên tower. Nếu Design không thể chứng minh hoặc fail closed, không được Apply.
- Chưa quyết định grammar handoff, activation record, durable-state owner, rotation và QA acceptance. Việc chưa truy xuất được Page Chat đã chọn là evidence limitation, không chứng minh context vắng mặt.
- Mọi nhu cầu xử lý credential, export conversation riêng tư, durable storage mới, auth change, destructive authority hoặc external-provider control là `NEEDS_REVIEW` và ngoài quyền Gate 1 hiện tại.
- Tracked prompt không tự chứng minh live conversation context. Không có federated implementation hoặc federated Browser QA.

## Câu hỏi quyết định chính xác tại Gate 1

1. Có duyệt federation thành capability OpenSpec **riêng**, giữ Bridge v1 làm single-gateway baseline độc lập không?
2. Có duyệt `PAGE_CONTROL_TOWER` chỉ thêm transport/coordination cho owning Page Chat, không thêm Product/shaping, gate, recovery hay side-effect authority không?
3. Có giữ `GLOBAL_CONTROL_TOWER` làm coordinator/escalation cho `CROSS_MODULE`, `UNCERTAIN`, cross-page/shared/foundation không?
4. Có chấp nhận normal `PAGE_LOCAL` đi trực tiếp tới đúng Page Control Tower trong mode tương lai, thay vì bắt buộc qua Global transport, với Page Chat vẫn là Product authority không?
5. Có chọn bất biến một `ACTIVE_CONTROL_TOWER` mỗi bridge run tại một thời điểm và yêu cầu chứng minh fencing/fail-closed trước Apply không?
6. Có chấp nhận direct cross-chat retrieval là tùy chọn/best effort, còn `PAGE_CONTEXT_INTAKE` phải giữ provenance và `AVAILABLE`/`PARTIAL`/`UNKNOWN`/`NOT_APPLICABLE` trung thực không?
7. Có chọn mặc định terminal old run rồi dùng fresh `RUN_ID` khi đổi tower, chuyển causal lineage qua handoff bền, và chỉ chốt wire grammar tại Spec/Design không?
8. Có yêu cầu durable handoff record với source/target identity, terminal/delivery state, run/round/command, lineage/budgets, approvals, hashes, Product provenance/gaps và next action không?
9. Có yêu cầu durable activation/current-state record hoặc cơ chế tương đương để chọn/fence active tower, đồng thời ghi rõ giới hạn atomicity của browser/Markdown không?
10. Có yêu cầu canonical state cần thiết nằm ngoài lịch sử chat, dùng OpenSpec/review/hashes, repository evidence, QA/VERIFY và handoff với đúng authority từng loại không?
11. Có giữ Bridge v1 hiện hành và QA của nó nguyên trạng, `BLOCKED_BY_ENVIRONMENT`, QA PAUSED, Gate 3 NOT_READY; không dùng evidence đó để cho federation PASS không?
12. Có giữ nguyên authority semantics của YUTA Workflow v3, owning Page Chat cho `PAGE_LOCAL`, Human Gates và Codex executor-only không?
13. Có xác nhận `SENSITIVE_DESIGN_GATE: TRIGGERED` vì durable cross-module activation/authority boundary và yêu cầu Human duyệt Design trước Tasks/Apply không?
14. Có yêu cầu delta Spec bình thường sau Gate 1 (`skip_specs: false`), review Gate 2 riêng, rồi Browser transport QA federation sau implementation không?
15. Có yêu cầu escalation/rotation fail closed khi target, active state, delivery, lineage hoặc context provenance không chắc chắn, thay vì suy đoán/hồi phục tự động không?

## Kết luận và khuyến nghị

`READY_FOR_SPECS` chỉ là readiness cho Human review Gate 1. Human đã duyệt đúng Proposal/Analysis và pre-approval packet hash ở đầu hồ sơ. Bước tiếp theo chỉ là delta Spec và Gate 2 review; không tự cho phép Design/Tasks/Apply. Nếu một câu trả lời thay đổi authority Workflow v3 hoặc mở scope nhạy cảm, quay lại Analysis/Gate 1 thay vì tự suy diễn. Đề xuất trước approval là `AWAITING_HUMAN_REVIEW`.

## Validation và evidence

- `pnpm exec openspec status --change federated-control-towers-foundation --json`: PASS; pinned `yuta-spec-driven`; Proposal/Analysis done; Specs ready/chưa có; Design/Tasks blocked.
- `pnpm exec openspec validate federated-control-towers-foundation --strict`: EXPECTED PRE-SPEC INCOMPLETE, exit 1 vì “Change must have at least one delta. No deltas found.” Không thêm `skip_specs: true`; delta Spec chỉ được tạo sau Gate 1 approval.
- `pnpm docs:check`: PASS, 36 current documents.
- `pnpm architecture:check`: PASS.
- `pnpm exec prettier --check openspec/changes/federated-control-towers-foundation/proposal.md openspec/changes/federated-control-towers-foundation/analysis.md`: PASS.
- Implementation tests, formal VERIFY và Browser QA: NOT_RUN theo Gate 1 scope.

## Hash exact-byte của artifact được review

Phương pháp: `Get-FileHash -LiteralPath <path> -Algorithm SHA256`, chuyển hex thành lowercase. Đường dẫn repository-relative được xếp theo thứ tự từ điển.

| Repository-relative path                                         | SHA-256                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/federated-control-towers-foundation/analysis.md | 7508d09b3815992e73412fb121f1cf26f4c26e84002131be522daadaf86d4dc9 |
| openspec/changes/federated-control-towers-foundation/proposal.md | ea8b97bd5a65fe9fa12ca049cad1bf9118ebf7675711fca809019bf81848a5ed |

## Exact Proposal

```markdown
## Why

Bridge v1 dùng một cuộc trò chuyện YUTA — Control Tower làm browser gateway cho mọi yêu cầu. Browser QA đã cho thấy gateway này không thể truy xuất chắc chắn bối cảnh của một Page Chat theo conversation ID; các case `PAGE_CONTEXT_INTAKE` thực với nguồn Page Chat vì vậy còn bị chặn. Cần xem xét một topology transport theo page mà vẫn giữ nguyên thẩm quyền Product và các gate hiện hành, thay vì diễn giải lại Bridge v1 đã được duyệt.

## What Changes

- Đề xuất một capability **Federated Control Towers** riêng để đánh giá hai vai trò transport/điều phối: `GLOBAL_CONTROL_TOWER` cho `CROSS_MODULE`, `UNCERTAIN`, shared architecture và foundation; `PAGE_CONTROL_TOWER` cho một page/module/capability `PAGE_LOCAL`. `CONTROL_TOWER_ROLE`, `CONTROL_TOWER_SCOPE` và `CONTROL_TOWER_INSTANCE` hiện là khái niệm ứng viên, chưa phải field hoặc cú pháp protocol được duyệt.
- Đánh giá khả năng Page Chat phụ trách vận hành vai trò `PAGE_CONTROL_TOWER` trong chính bối cảnh page đó. Vai trò này không cấp thêm thẩm quyền Product/shaping, gate, escalation, recovery hoặc side effect cho Page Chat. Human vẫn quyết định Human Gates; Codex vẫn chỉ thực thi và thu thập bằng chứng.
- Đề xuất bất biến an toàn: **một bridge run chỉ có một `ACTIVE_CONTROL_TOWER` tại một thời điểm**. Cần chứng minh cơ chế chọn target, dừng tower cũ, handoff có nguồn, kích hoạt tower mới, bảo toàn lineage và chống replay trước khi chấp nhận bất biến này.
- Tách context retrieval khỏi authority routing. Truy xuất xuyên chat trực tiếp là nguồn bổ sung khi thật sự khả dụng, không được mặc định là điều kiện duy nhất cho `PAGE_LOCAL`; `PARTIAL`/`UNKNOWN` giữ nguyên ý nghĩa thiếu bằng chứng, và `UNKNOWN` không chứng minh rằng chưa từng có yêu cầu hoặc quyết định.
- Xem xét luân chuyển instance khi hội thoại dài hoặc không còn dùng được. OpenSpec, review/hashes, repository evidence, Knowledge Consolidation và handoff/current-state có nguồn phải mang tính liên tục cần thiết; không dùng toàn bộ lịch sử chat làm kho trạng thái duy nhất.
- Giữ `control-tower-bridge-protocol-v1` làm baseline một gateway độc lập. Change này sẽ xác định quan hệ phụ thuộc/tương thích và mọi extension cần duyệt sau; không tự sửa Spec, Design, Tasks/TIC, skill, prompt, QA hay live behavior của Bridge v1.

### Non-goals

Không fork YUTA Workflow v3, chuyển `PAGE_LOCAL` Product/shaping authority khỏi owning Page Chat, chuyển `CROSS_MODULE`/`UNCERTAIN` khỏi Global Control Tower, tự duyệt Human Gate, hoặc tạo Product authority mới cho Codex. Không tạo protocol handoff grammar, activation ledger, Page Chat prompt, implementation, Product UI/code, API, auth, schema, business logic, provider behavior, deployment hay release ở Gate 1. Không coi các Browser QA case còn thiếu của Bridge v1 là PASS.

## Capabilities

### New Capabilities

- `tooling/federated-control-tower-transport`: Hành vi quan sát được của việc chọn một tower đang hoạt động, routing theo scope, handoff/escalation, luân chuyển instance và bảo toàn identity, evidence, authority khi nhiều Control Tower conversation có thể tham gia.

### Modified Capabilities

Không có trong Gate 1 này. Bridge v1 là active change chưa được sync thành main spec; nếu federation sau này cần sửa hoặc thay thế requirement của baseline, phải được review rõ trong Spec/Gate tương ứng, không âm thầm sửa delta hiện tại.

## Impact

- Phân loại: `CROSS_MODULE / TOOLING + WORKFLOW_GOVERNANCE + CONTROL_TOWER_FEDERATION`; `PAGE_CONTEXT_INTAKE: NOT_APPLICABLE` cho change kiến trúc này.
- Nguồn liên quan: YUTA Workflow v3, Page Chat/Control Tower operating prompts, Bridge v1 protocol và bằng chứng QA hiện có. Các owner implementation và artifact activation/handoff tương lai chưa được chốt; Design và Tasks/TIC sau các gate mới được quyết định.
- Không đổi Product runtime, data, auth, API, shared UI, provider, cấu hình deployment hoặc live ChatGPT context trong bước Proposal/Analysis. Browser transport QA riêng sẽ bắt buộc nếu capability này được triển khai; Product UI QA dự kiến `NOT_APPLICABLE`.
```

## Exact Analysis

```markdown
# Change Analysis

## Scope and Change Type

- **Phân loại:** `CROSS_MODULE / TOOLING + WORKFLOW_GOVERNANCE + CONTROL_TOWER_FEDERATION`. Đây là capability transport riêng, chưa phải phần sửa đổi Bridge v1.
- Bridge v1 hiện dùng một cuộc trò chuyện `YUTA — Control Tower` làm browser endpoint. Browser QA không truy xuất chắc chắn được Page Chat đã chọn theo conversation ID; `PAGE_CONTEXT_INTAKE` trở thành `UNKNOWN` và kiểm tra routing phụ thuộc đã dừng. Đây là lý do cần shaping, chưa phải bằng chứng topology liên bang an toàn hoặc đã triển khai.
- Mô hình ứng viên có `GLOBAL_CONTROL_TOWER` điều phối `CROSS_MODULE`/`UNCERTAIN` và `PAGE_CONTROL_TOWER` giới hạn trong một page/module/capability `PAGE_LOCAL`. Role, scope, instance và active-tower identity hiện chỉ là khái niệm ứng viên, chưa phải field protocol hay activation record được duyệt.
- Gate này chỉ tạo Proposal, Analysis và hồ sơ Gate 1. Không cho phép Spec, Design, Tasks/TIC, implementation, sửa prompt/skill, cập nhật live context, test hoặc nâng lifecycle.

## Sources Consulted

- Authority và workflow: [`AGENTS.md`](../../../AGENTS.md), [`docs/README.md`](../../../docs/README.md), [`docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md), [`docs/AUTHORITY_MODEL.md`](../../../docs/AUTHORITY_MODEL.md), [`docs/YUTA_WORKFLOW_V3.md`](../../../docs/YUTA_WORKFLOW_V3.md), [`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [`docs/LIFECYCLE_STATUS_MODEL.md`](../../../docs/LIFECYCLE_STATUS_MODEL.md), [`docs/MODULE_REGISTRY.md`](../../../docs/MODULE_REGISTRY.md) và [`docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`](../../../docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md).
- Nguồn vận hành/transport: [Control Tower prompt](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md), [Page Chat prompt](../../../docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md), Bridge v1 [Spec](../control-tower-bridge-protocol-v1/specs/tooling/control-tower-browser-bridge/spec.md), [Design](../control-tower-bridge-protocol-v1/design.md), [Tasks/TIC](../control-tower-bridge-protocol-v1/tasks.md), [skill](../../../.agents/skills/yuta-control-tower-bridge/SKILL.md) và [Browser QA report](../../../docs/reviews/control-tower-bridge-protocol-v1/qa/QA_REPORT.md).
- Đã kiểm tra OpenSpec config/schema và active/archive inventory theo scope tương đương. Không thấy change federation tương đương; change này được pin vào `yuta-spec-driven`.
- Quyết định hiện tại của người dùng `CREATE_SEPARATE_FEDERATED_CONTROL_TOWERS_CHANGE` cho phép shaping riêng đến Gate 1; chưa duyệt kiến trúc ứng viên hoặc gate tiếp theo.

## Authority and Product Decision

- Workflow v3 giữ Product/shaping của `PAGE_LOCAL` tại owning Page Chat. `CROSS_MODULE`/`UNCERTAIN` được chuyển lên Control Tower toàn cục; Human quyết định các Human Gate. Nếu một Page Chat kiêm `PAGE_CONTROL_TOWER`, vai trò transport tương lai chỉ cùng tồn tại với thẩm quyền page đã có, không sinh quyền Product rộng hơn.
- `PAGE_CONTROL_TOWER` chỉ có thể gửi chỉ dẫn thực thi cho Codex sau khi một protocol federation được duyệt riêng xác định identity, provenance, scope và authorization. Điều này sẽ khác rule Bridge v1 “Codex chỉ liên lạc với một Control Tower và không trực tiếp truy cập Page Chats”. Vì vậy Spec/gate mới phải nêu rõ ngoại lệ tương lai; skill Bridge v1 hiện tại không được tự nhận quyền này.
- `GLOBAL_CONTROL_TOWER` vẫn là coordinator/escalation authority cho việc cross-module/uncertain. Page Control Tower phải dừng và handoff khi impact check hoặc bằng chứng sau đó đòi escalation. Không vai trò nào tự duyệt Human Gate, bịa Product decision còn thiếu hoặc coi handoff là quyền Apply.
- `PAGE_LOCAL` có thể kết nối trực tiếp đến đúng Page Control Tower theo mô hình transport ứng viên, không cần đi vòng qua Global cho mọi lượt. Global vẫn nhận handoff khi scope thành `CROSS_MODULE`/`UNCERTAIN` hoặc phát sinh shared architecture/foundation. Chọn target mới cần Human xác nhận hoặc workflow đã được review cho phép, rồi kiểm đúng title và conversation identity.
- Nếu federation đòi sửa authority semantics của Workflow v3, Product authority của Page Chat hoặc chủ thể gate, phải dừng để review governance có thẩm quyền. Gate này không cho phép các sửa đổi đó.

## Current Implemented State

- Bridge v1 Spec R1–R19, skill và tracked prompt mô tả một Control Tower conversation được chọn cho một run. Hội thoại live `YUTA — Control Tower` từng chứng minh một vòng protocol hợp lệ; file prompt trong repository không tự đồng bộ hoặc chứng minh live conversation context.
- Bridge v1 QA hiện `BLOCKED_BY_ENVIRONMENT`: **16 PASS, 6 PARTIAL_EVIDENCE, 2 NOT_RUN**; Gate 3 `NOT_READY`, QA đang tạm dừng. Đây là baseline của Bridge v1, không phải QA federation. Chưa có federation prompt, skill, activation record, implementation hoặc Browser QA.
- Human đã cung cấp định danh Page Chat chính xác. Codex không tự truy cập Page Chat; Control Tower không lấy được nguồn đó một cách chắc chắn và đã loại các cuộc trò chuyện tương tự. `PAGE_CONTEXT_INTAKE = UNKNOWN` và kiểm tra `PAGE_LOCAL` phụ thuộc dừng. Quan sát này chứng minh fail-closed trong tình huống đó, không chứng minh retrieval `AVAILABLE`/`PARTIAL` hoặc handoff authority.
- Working tree có thay đổi dirty/untracked không liên quan. Gate 1 này chỉ sở hữu thư mục OpenSpec mới và review packet của chính nó.

## Affected Boundaries

| Boundary                 | Kết luận Gate 1 và nghĩa vụ chứng minh sau này                                                                                                                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Active tower             | Bất biến ứng viên: một bridge run chỉ có một `ACTIVE_CONTROL_TOWER` tại mỗi thời điểm. Tuyên bố trong browser/Markdown không bảo đảm loại trừ đồng thời; Design phải định nghĩa activation quan sát được, revocation/fencing và dừng khi không chắc chắn.                                                          |
| Target và identity       | Command/result vẫn phải ràng buộc đúng conversation, `RUN_ID`, round, command và causal lineage. Chuyển tower cần xác minh target mới và nhiều khả năng một `RUN_ID` mới; contract handoff chính xác để giai đoạn sau quyết định. Command/result của tower cũ không được chấp nhận sau handoff.                    |
| Delivery và replay       | Giữ an toàn at-most-once và không resend khi delivery uncertain. Federation phải ngăn split-brain, stale-command replay và double execution xuyên tower, kể cả khi activation/delivery không chắc chắn. Không tự recovery theo phỏng đoán.                                                                         |
| Page context             | Product/shaping context có provenance từ owning Page Chat có thể đến trực tiếp qua transport page-scoped tương lai hoặc explicit read-only handoff được Human cho phép. Cross-chat retrieval ngầm chỉ là nguồn tùy chọn, không phải điều kiện duy nhất. `PARTIAL`/`UNKNOWN` không có nghĩa là không có yêu cầu cũ. |
| Durable state ngoài chat | OpenSpec/review và hash, bằng chứng implementation repository, knowledge sau archive giữ authority cho từng loại câu hỏi. Handoff/activation record có nguồn nằm ngoài lịch sử chat là yêu cầu ứng viên; owner, durability và format chưa chốt. Không dùng toàn bộ lịch sử chat làm kho trạng thái duy nhất.       |
| Instance rotation        | Instance hội thoại mới cần identity rõ, chỉ nạp state có provenance, vô hiệu hóa/fence instance cũ, bảo toàn quyết định Human và causal lineage. Cơ chế thuộc Design sau khi requirements được duyệt.                                                                                                              |
| Authority và lifecycle   | Routing transport không cấp Product authority, gate approval hay lifecycle advancement. Repository evidence kiểm soát implemented state; quyết định Human phải tường minh.                                                                                                                                         |
| Product/runtime          | Gate 1 không đổi Product UI, API, auth, database/schema, business logic, shared UI, provider hoặc deployment topology.                                                                                                                                                                                             |

## Lifecycle Baseline

- Change mới chỉ có Proposal/Analysis. Không nâng `Product Decision`, `Implementation`, `Environment`, `Production Readiness` hoặc `External Dependency` cho module Product nào; không tạo Module Registry row từ bước planning này.
- Bridge v1 vẫn là baseline một gateway độc lập với QA/Gate 3 hiện hữu. Federation không giải quyết blocker QA của v1 và không thừa hưởng bằng chứng PASS của v1. Shaping có thể tiến riêng; mọi quan hệ tích hợp, thay thế hoặc phụ thuộc Bridge v1 readiness sau này cần quyết định tường minh tại Spec/Design/Tasks.

## Requirement Readiness

- Requirements ứng viên có thể bao gồm role/scope/instance identity, chọn một active tower, routing `PAGE_LOCAL` và escalation, handoff/activation có giới hạn, identity phiên mới khi đổi target, chống replay/double execution, durable evidence/state, provenance của page context, instance rotation và backward compatibility. Chúng chưa là normativity.
- Bridge v1 R1/R3/R7/R16 chứa các giả định single gateway và cấm Codex trực tiếp truy cập Page Chat; federated mode tương lai phải **sửa/extend tường minh** đúng phần áp dụng cho mode mới. R2 là context/evidence intake, không hứa cross-chat retrieval tất định. R6/R8/R9 về lineage, delivery fail-closed và một command/một result phải được giữ và mở rộng xuyên tower. R4/R5/R10–R15 về command/result, gate, evidence, scope và language vẫn là baseline. R17–R19 về tracked/live prompt và Browser QA cần acceptance theo từng tower. Mapping này không sửa Bridge v1.
- Khi đổi tower, một `RUN_ID` mới cho conversation mới là yêu cầu ứng viên phù hợp ràng buộc run/target của v1; causal lineage phải liên kết handoff. Gate 1 chưa đặt wire grammar mới. Payload, acknowledgment, thứ tự activation, fencing record và identity fields thuộc Spec/Design sau duyệt.
- Handoff durable tối thiểu cần được đánh giá theo nguồn và đích: role, scope, instance và exact conversation identity; trạng thái terminal/delivery của run cũ; `RUN_ID`/`ROUND_ID`/`COMMAND_ID` và causal lineage; blocker, recovery/evaluator/evidence-stop budgets; Human approvals; artifact hashes; provenance Product/context và gaps; action kế tiếp được phép. Không tạo grammar hay record thật tại Gate 1.
- Với Page Control Tower giữ chính context page của mình, `AVAILABLE` chỉ khi đúng nguồn/đủ provenance và phạm vi context cần thiết quan sát được; `PARTIAL` khi thiếu một phần; `UNKNOWN` khi nguồn/identity hoặc nội dung cần thiết chưa xác minh; `NOT_APPLICABLE` cho việc không theo page. Không trạng thái nào tự trao quyền implementation. Nếu Page Chat Product intent mâu thuẫn current repository implementation, phải báo discrepancy theo hai authority tương ứng, không tự hợp nhất.
- Rotation cần xem riêng Page Control Tower và Global Control Tower: mỗi bên có scope, context và escalation role khác nhau, nhưng cùng đòi target identity mới, handoff provenance, old-instance freeze và stale-command rejection. Restart khi source cũ mất phải dừng nếu không khôi phục được state có thẩm quyền.
- Điều kiện dừng ứng viên: target mơ hồ, delivery uncertain, hai tower cùng nhận active, lineage sai/thiếu, provenance authority/handoff thiếu, context không truy xuất được, activation không chắc chắn. Chọn Human intervention hoặc `BLOCKED`, không suy đoán.
- Behavior federation cần delta Spec riêng; `skip_specs: true` không phù hợp. Gate 1 approval nếu có chỉ cho phép bước Spec tiếp theo và review Gate 2 riêng.

## UI / UX Applicability

- `UI_AFFECTING: NO`; `PRODUCT_UI_QA: NOT_APPLICABLE`. Việc chọn conversation/transport trong browser là bề mặt QA vận hành, không đổi YUTA Product UI. Không cần tư vấn UI/UX ở Gate 1.
- `FEDERATED_BROWSER_QA: REQUIRED` sau implementation: quan sát role routing, đúng target/instance, single-active, switch và fresh run identity, handoff provenance, stale-command rejection, chống replay/double execution, uncertainty stop, Page Chat authority, global escalation, Human Gates và instance rotation. Case chưa hoàn tất của Bridge v1 không được tính là federation QA.
- `SENSITIVE_DESIGN_GATE: TRIGGERED` tạm phân loại vì boundary durable cross-module về authority/activation. Theo Automated Workflow, nếu scope này tiếp tục thì cần Human duyệt `02b-design-review.md` trước Tasks/Apply. Gate 1 cần xác nhận phân loại; chưa tạo Design packet.

## Conflicts and Unknowns

- **Căng thẳng tương thích rõ ràng với v1:** Bridge v1 yêu cầu một Control Tower được chọn và cấm Codex trực tiếp vào Page Chats. Page Control Tower tương lai cần mode mới được duyệt và quy tắc migration/compatibility an toàn. Bridge v1 đang chạy phải giữ nguyên đến khi mode đó được duyệt và triển khai.
- **Chưa có cơ chế exclusivity:** hai chat live có thể cùng tin mình active. Browser-only observation không tự chứng minh atomic ownership. Design tương lai phải có fencing/deduplication hoặc fail closed; nếu không thì không được Apply federation.
- **Cross-chat retrieval không tất định:** QA không truy cập được Page Chat đã chọn bằng conversation ID. Nguồn handoff fallback, Human authorization, provenance và tiêu chí `AVAILABLE`/`PARTIAL` cần requirements; không được thay bằng cuộc trò chuyện tương tự.
- **Durable-state ownership chưa rõ:** nơi lưu, writer/reader, xử lý conflict và staleness cho handoff/activation/current-state chưa được duyệt. Knowledge Consolidation chỉ áp dụng sau archive, không tự làm live activation ledger.
- **Rotation và backward compatibility chưa chốt:** fencing instance cũ/mới, command đang bay, recovery khi chat cũ mất, quan hệ với Bridge v1 QA/Gate 3 cần gate quyết định rõ. Rename không làm đổi causal lineage.
- **Giới hạn live config:** tracked prompt không auto-sync sang conversation operating context. Acceptance tương lai phải kiểm bằng hành vi live tại đúng từng tower được phép, không bằng repo hash hoặc global Project Instructions đơn lẻ.
- **Scope nhạy cảm chưa được duyệt:** nếu Design tương lai đòi xử lý credential, export hội thoại riêng tư, lưu trữ bền mới, thay auth, quyền destructive hoặc điều khiển external provider, ghi `NEEDS_REVIEW` và quay lại gate có thẩm quyền.

## Analysis Conclusion

`READY_FOR_SPECS`

Capability riêng có thể đưa đến Gate 1 vì boundary authority, evidence gap và nghĩa vụ an toàn đã được nêu rõ. Kết luận này phụ thuộc Human review các câu hỏi Gate 1; chưa chốt grammar, implementation architecture hay activation. Nếu federation không thể bảo toàn Workflow v3/Page Chat authority hoặc single-active safety, bước sau phải trả `BLOCKED_NEEDS_REVIEW` thay vì tự suy đoán. Analysis này không cho phép Spec, Design, Tasks/TIC, sửa skill/prompt, implementation, VERIFY, QA hoặc live activation.
```
