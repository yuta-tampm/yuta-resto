# YUTA Workflow v3 — Hướng dẫn vận hành

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-27

## 1. Workflow này là gì

YUTA Workflow v3 là mô hình vận hành một thay đổi từ ý tưởng đến khi repository
được đóng lại có kiểm soát. Mục tiêu là giúp Product, reviewer và engineering
cùng nhìn một thay đổi qua các lớp bằng chứng khác nhau, thay vì để một bản mô
tả, một lệnh kiểm tra hoặc một trạng thái kỹ thuật tự thay thế quyết định của
con người.

Nguyên tắc xuyên suốt là:

```text
Understand broadly
→ decide narrowly
→ implement narrowly
→ verify independently
→ consolidate knowledge
```

Workflow tách riêng sáu việc:

1. **Product thinking** xác định vấn đề, phạm vi và authority (nguồn có thẩm
   quyền cho loại câu hỏi đang xét).
2. **Specs** mô tả hành vi quan sát được cần có.
3. **Implementation** hiện thực phạm vi đã duyệt trong code, database hoặc UI.
4. **VERIFY** chứng minh implementation khớp Specs/Design và quy tắc kỹ thuật.
5. **QA** chứng minh hành vi thực tế trong ngữ cảnh người dùng/runtime phù hợp.
6. **Normative sync và Knowledge Consolidation** lần lượt quảng bá yêu cầu đã
   duyệt vào main specs và đối soát lại knowledge hiện hành.

Release, deploy và Production Readiness không nằm trong định nghĩa repository
`DONE`; chúng thuộc một lane vận hành riêng.

## 2. Vai trò và trách nhiệm

| Vai trò / lớp authority             | Trách nhiệm chính                                                                                                                                                                       | Không được tự suy ra                                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Page Chat / Local Control Tower** | Giữ Product/shaping authority của scope chưa migration PASS; sau PASS chỉ còn legacy evidence cho đúng scope đó. Có thể làm việc trực tiếp với Codex khi Human chọn và xác minh bridge. | Không khởi tạo change page-local khi kết quả là `CROSS_MODULE` hoặc `UNCERTAIN`; không giữ Product authority của scope đã migration PASS. |
| **Global Control Tower**            | Điều phối cross-page/module/runtime và shaping của scope đã migration PASS; làm rõ owner, authority, shared contract và review routing.                                                 | Không thay Product context của Page Chat ở scope chưa migration PASS hoặc tự chuyển chat/quyền thực thi.                                  |
| **Codex**                           | Đọc authority, tạo/tiếp tục artifact, implement, kiểm tra, tập hợp evidence và dừng đúng gate.                                                                                          | Không phải Product approver; không tự tạo approval, permission, owner hoặc durable boundary.                                              |
| **OpenSpec**                        | Giữ proposal, analysis, delta specs, design và tasks của một change có cấu trúc.                                                                                                        | Change trong `openspec/changes/**` không phải normative authority.                                                                        |
| **Product Knowledge**               | Giải thích WHY, broader WHAT, mục đích module, quan hệ, scope và non-goals.                                                                                                             | Không tự chứng minh code hiện tại, deployment hoặc readiness.                                                                             |
| **Normative main specs**            | Sau approved sync, định nghĩa yêu cầu hành vi chính xác trong durable boundaries đã chấp nhận.                                                                                          | Không thay thế ADR, security/runtime/data authority, code hoặc bằng chứng production.                                                     |
| **Code/tests**                      | Chứng minh repository Implemented State và mức độ test coverage.                                                                                                                        | Không tự tạo Product approval hoặc chứng minh bản nào đang chạy production.                                                               |
| **QA evidence**                     | Chứng minh hành vi người dùng/runtime, responsive, accessibility và visual khi áp dụng.                                                                                                 | Screenshot không định nghĩa business rule, permission, schema, owner hoặc lifecycle.                                                      |
| **Human reviewer / current user**   | Ra quyết định tại đúng gate trên đúng artifact/hashes; cấp authorization rõ ràng khi cần.                                                                                               | Một approval không tự mở rộng sang gate, change, path hoặc phiên bản artifact khác.                                                       |

Các lớp này bổ sung cho nhau. Khi chúng mâu thuẫn, dùng
[`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md) để phân loại câu hỏi, ghi `CONFLICT`
và `NEEDS REVIEW`, rồi dừng ở authority phù hợp; không âm thầm chọn lớp thuận
tiện nhất.

## 3. Tổng quan end-to-end

```text
IDEA
→ Discovery/Shaping [conditional]
→ Proposal
→ Analysis
→ Gate 1
→ Specs
→ Gate 2
→ Design [when applicable]
→ Sensitive Design Gate [conditional]
→ Tasks + Implementation Plan
→ Apply
→ Verify
→ QA
→ Gate 3
→ Human Approval
→ $yuta-finish-change
→ Sync or valid no-spec finalization
→ Validate Main Specs when applicable
→ Archive
→ Knowledge Consolidation
→ Done
```

`Discovery/Shaping`, `Sensitive Design Gate`, Gate 2 và normative promotion có
điều kiện; các nhánh được giải thích bên dưới. Song song về mặt quản trị, nhưng
chỉ bắt đầu sau khi có authorization phù hợp:

```text
RELEASE / DEPLOY / POST-DEPLOY VERIFY / MONITOR / ROLLBACK
= separate operational lane
```

Design conditionality là chính sách controlled-adapter của YUTA, không phải
native conditional dependency của OpenSpec: raw graph vẫn phụ thuộc Design.
Khi không applicable, ghi rõ lý do và authority/evidence trong `tasks.md`, giữ
bằng chứng qua resume/review/finalization và không tạo placeholder `design.md`.
Chỉ đi tiếp khi các prerequisite/gate khác đã thỏa mãn; raw planning có thể vẫn
báo incomplete. Sensitive Design Gate được đánh giá độc lập theo tiêu chí nhạy
cảm, không tự phát sinh chỉ vì có Design. `skip_specs: true` không tự bỏ Design.

## 4. Routing cross-module trước một change

Trước feature/change mới thuộc scope chưa migration PASS, owning Page Chat thực
hiện `CROSS-MODULE IMPACT CHECK` theo
[`YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`](chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md)
và chọn đúng một kết quả:

| Kết quả        | Cách xử lý                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `PAGE_LOCAL`   | Ở lại owning Page Chat. Xác nhận capability, lý do page-local, nhu cầu Discovery/Shaping và OpenSpec readiness.                           |
| `CROSS_MODULE` | Không tạo/tiếp tục local change. Lập handoff theo [Control Tower Handoff Template v3](chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md). |
| `UNCERTAIN`    | Xử lý như `CROSS_MODULE` cho đến khi ownership và scope được làm rõ.                                                                      |

### Human chọn Control Tower theo phạm vi công việc

Với `PAGE_LOCAL` chưa migration PASS, owning Page Chat giữ Product/shaping
authority và có thể là Local Control Tower giao việc trực tiếp cho Codex trong
phạm vi page đó. Với scope đã PASS, agent lấy Product Knowledge từ repository;
Control Tower làm shaping, Human Decision, giải quyết conflict và điều phối
governance. Page Chat cũ chỉ còn legacy evidence cho đúng scope đã PASS, không
là Product/shaping gate. Phân loại impact và các gate của Product Change vẫn
áp dụng; không dùng migration PASS làm Apply authorization. Với scope chưa PASS,
khi cần chuyển từ Global Control Tower sang Local Control Tower, dừng phần việc
phụ thuộc và nêu rõ Page Chat đích, mục tiêu, change/gate, bằng chứng và blocker.
Human tự chọn và chuyển sang đúng chat; Global Control Tower không cần truy
xuất lịch sử Page Chat để Local Control Tower ra quyết định.
Để khởi động một chat mới, Human dán **toàn bộ một file** tương ứng: [Page Chat
Operating Prompt](chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md) cho Local
Control Tower hoặc [Control Tower Operating
Prompt](chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md) cho Global Control
Tower. Mỗi file tự chứa Bridge Mode v1; không cần dán thêm prompt thứ hai.
Mỗi chat phải được xác minh bằng một vòng bridge chỉ đọc mới trước việc phụ
thuộc; prompt trong repository không tự đồng bộ sang chat đang mở.

Codex chỉ nhận lệnh từ chat Control Tower mà Human đã chọn và Codex đã xác minh
đúng title, URL/conversation ID, role và scope cho run hiện tại. Local Control
Tower có thể tiếp tục cùng Codex qua browser bridge sau khi operating context
và protocol ở chính chat đó được xác minh. Không lấy lệnh từ hai chat cùng lúc,
không coi việc đổi tab là approval hoặc tự động chuyển executable authority,
không tái dùng command đã thực thi hay bỏ qua Human Gate/Apply authorization.
Nếu target, quyền thực thi hoặc lịch sử chưa rõ, dừng trước khi gửi hay thực thi.
Giữ nguyên causal lineage, budget, evidence, VERIFY/QA và các giới hạn chống
replay. Bàn giao thủ công không biến QA federation còn thiếu thành `PASS`.
Luồng chọn chat thủ công dùng browser bridge đã xác minh của từng chat; nó
không phụ thuộc việc hoàn tất cơ chế chuyển quyền tự động của change
`federated-control-towers-foundation`. Change đó giữ nguyên tiêu chí và trạng
thái QA riêng cho đến khi được xử lý qua gate của chính nó.

Với `CROSS_MODULE` hoặc `UNCERTAIN`, Local Control Tower dừng phần việc phụ
thuộc và lập handoff có nguồn; Human chọn Global Control Tower để điều phối.
Codex xác minh lại target và authorization trước khi tiếp tục. Hai chat không
tự giao tiếp với nhau, và Global Control Tower không thay Page Chat quyết định
Product cho `PAGE_LOCAL` thuộc scope chưa migration PASS.

Một thay đổi cần Control Tower khi nó đọc/ghi data của nhiều owner, thay đổi
shared permission/security/tenancy, đi qua nhiều runtime, cần provider/legal/
privacy review, chạm durable boundary, hoặc cần contract và QA phối hợp giữa
nhiều module. Control Tower dùng
[`YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`](chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md)
để chọn một cross-module change, parent coordination với nhiều bounded changes,
hoặc trả lại Page Chat nếu thực tế là page-local.

Phân loại `PAGE_LOCAL` không phải miễn trừ kiểm tra sau đó. OpenSpec `analysis`
là lớp bảo vệ thứ hai: nếu Codex phát hiện cross-module ownership, `CONFLICT`
hoặc requirement-level `NEEDS REVIEW`, workflow dừng và chuyển coordination
sang Control Tower.

## 5. Hướng dẫn vận hành từng bước

| Step                        | Main question                                                                  | Key work                                                                                                                                                                         | Input                                                                | Output                                                                                 | Stop condition / next gate                                                                     |
| --------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Discovery/Shaping**       | Request đã đủ rõ và đúng owner chưa?                                           | Đọc authority và implementation read-only; làm rõ scope, owner, runtime/data/provider/cross-module uncertainty.                                                                  | Idea/request và current repository knowledge.                        | Câu hỏi cần quyết định, bounded request, hoặc kết luận không tạo change.               | Conditional; dừng nếu chưa thể bound an toàn, nếu rõ thì Proposal.                             |
| **Proposal**                | Tại sao cần change và capability nào thay đổi?                                 | Ghi Why, What Changes, Capabilities, Impact; xác định behavior-changing hay no-spec candidate.                                                                                   | Bounded request.                                                     | `proposal.md`.                                                                         | Sang Analysis; chưa phải approval.                                                             |
| **Analysis**                | Authority và evidence hiện tại có cho phép viết requirements không?            | Phân loại Product Intent, Implemented State, runtime/data/security, lifecycle và unknowns.                                                                                       | Proposal, Product Knowledge, authority/registry, code/tests khi cần. | `analysis.md` với một kết luận hợp lệ.                                                 | Gate 1; blocker thì `BLOCKED_NEEDS_REVIEW`.                                                    |
| **Gate 1**                  | Scope và authority có đúng để đi tiếp không?                                   | Review exact Proposal + Analysis, conflicts, unknowns và hashes.                                                                                                                 | `proposal.md`, `analysis.md`.                                        | `docs/reviews/<change>/01-analysis-review.md`.                                         | Dừng chờ human review. Approval mở Specs hoặc no-spec branch.                                  |
| **Specs**                   | Hệ thống phải có hành vi quan sát được nào?                                    | Viết delta requirements/scenarios, không đưa implementation plan vào spec.                                                                                                       | Approved Gate 1 và artifact instructions.                            | `specs/<capability>/spec.md` deltas.                                                   | Strict validation rồi Gate 2.                                                                  |
| **Gate 2**                  | Requirements có đúng, đủ và trong approved boundaries không?                   | Review exact deltas, scenarios, edge cases, assumptions, validation và hashes.                                                                                                   | Delta specs + Gate 1 evidence.                                       | `docs/reviews/<change>/02-specs-review.md`.                                            | Dừng chờ human review; bỏ qua chỉ trên approved `skip_specs: true`.                            |
| **Design**                  | Cách hiện thực nào giữ đúng requirements và boundaries?                        | Ghi decisions, alternatives, risks, migration/rollback và safe open questions khi design cần thiết.                                                                              | Approved requirements hoặc approved no-spec path.                    | `design.md` khi applicable.                                                            | Sensitive classification; unresolved decision quay lại gate sở hữu nó.                         |
| **Sensitive Design Gate**   | Thiết kế nhạy cảm có được authority phù hợp chấp nhận không?                   | Review security/auth, runtime/data owner, migration, payment/fiscal, Personnel/legal/privacy, provider, POS transaction, irreversible hoặc cross-module durable-boundary impact. | Exact Design + earlier approvals.                                    | `docs/reviews/<change>/02b-design-review.md`.                                          | Conditional; dừng trước Tasks/Apply cho đến explicit approval.                                 |
| **Tasks**                   | Làm việc gì, theo dependency nào, và chứng minh completion ra sao?             | Chọn phase cần thiết; thêm checkbox outcomes và embedded `TECHNICAL IMPLEMENTATION CONTRACT`.                                                                                    | Approved Specs/Design hoặc no-spec path.                             | `tasks.md` + implementation plan; `UI_AFFECTING`/`BROWSER_QA_REQUIRED` classification. | Dừng nếu owner/boundary/constraint chưa giải quyết; nếu sẵn sàng thì Apply.                    |
| **Apply**                   | Implementation có tạo đúng approved outcome không?                             | Thực hiện code/DB/UI/tests theo phases và contracts; đánh dấu task chỉ khi outcome + evidence tồn tại.                                                                           | Approved planning artifacts, clean scoped baseline.                  | Scoped implementation + task evidence.                                                 | Durable/Product discovery quay lại gate; technical defect trong scope có thể sửa rồi tiếp tục. |
| **Verify**                  | Repository implementation có khớp Specs/Design và technical authorities không? | Mapping requirements, tests, typecheck/build, architecture/security, migration/schema, diff và Compliance Matrix.                                                                | Implementation + approved planning.                                  | `TECHNICAL IMPLEMENTATION COMPLIANCE` và `VERIFY` result.                              | Không PASS thì sửa trong approved behavior hoặc quay lại gate phù hợp.                         |
| **QA**                      | Hành vi có hoạt động đúng trong user/runtime context không?                    | Chạy Browser QA hoặc non-browser QA phù hợp; lưu report/evidence.                                                                                                                | Verified implementation và realistic environment/data.               | `PASS`, `FAIL`, `BLOCKED_BY_ENVIRONMENT`, hoặc `NOT_APPLICABLE`.                       | Required QA chưa PASS thì chưa được tạo ready Gate 3.                                          |
| **Gate 3**                  | Exact implementation đã đủ an toàn để final approval chưa?                     | Independent review planning hashes, attributed diff, Technical Compliance, VERIFY, QA, deviations và lifecycle truth.                                                            | Toàn bộ current evidence.                                            | `docs/reviews/<change>/03-final-review.md`.                                            | Dừng chờ explicit Gate 3 approval và explicit sync/archive authorization.                      |
| **Sync**                    | Approved deltas nào được mechanical promotion?                                 | Recheck hashes; sync đúng `existingOutputPaths`; review exact main-spec diff.                                                                                                    | Approved Gate 3 + explicit authorization.                            | Updated normative main specs, hoặc không có promotion trên no-spec path.               | Partial/unexpected sync dừng và rollback có ghi nhận; thành công thì Validate.                 |
| **Validate**                | Main-spec result có hợp lệ và đúng approved delta không?                       | Strict main-spec validation và diff review.                                                                                                                                      | Synced main specs.                                                   | Validated main-spec state.                                                             | Failure: không archive như thành công; success: Archive.                                       |
| **Archive**                 | Change history có thể đóng an toàn chưa?                                       | Reconfirm task/artifact completion và sync state; archive đồng bộ.                                                                                                               | Validated sync hoặc valid no-spec finalization.                      | Recorded archive.                                                                      | Archive thành công mới sang Knowledge Consolidation.                                           |
| **Knowledge Consolidation** | Current knowledge có cần cập nhật từ completed evidence không?                 | Scan đúng các knowledge authorities có thể bị ảnh hưởng; không tự promote status.                                                                                                | Archived completed change.                                           | `NO_UPDATE_REQUIRED` hoặc `UPDATE_REQUIRED` + review packet.                           | Update required thì dừng chờ Knowledge Review; no update thì Done.                             |
| **Done**                    | Repository workflow đã đóng trung thực chưa?                                   | Ghi workflow outcome và `RELEASE_FOLLOW_UP`.                                                                                                                                     | Completed consolidation path.                                        | `Workflow status: DONE`.                                                               | Chỉ chuyển sang release/deploy lane nếu được yêu cầu và authorized.                            |

## 6. Analysis gate

YUTA thêm `analysis` để ngăn việc một request đi thẳng từ ý tưởng sang
requirements bằng assumption. Analysis phải kiểm tra:

- Product Knowledge cho broader intent và scope;
- Authority Model để chọn nguồn kiểm soát theo loại câu hỏi;
- Module Registry và Lifecycle Status Model cho owner, relationship và trạng
  thái bounded hiện tại;
- code/tests/contracts/executable schemas chỉ để xác minh Implemented State;
- runtime, data ownership, security/authorization và production evidence theo
  đúng authority;
- mọi `CONFLICT` và `NEEDS REVIEW` còn tồn tại.

Kết luận Analysis hợp lệ **chính xác** là:

```text
READY_FOR_SPECS
BLOCKED_NEEDS_REVIEW
NO_SPEC_BEHAVIOR_CHANGE
```

`CONFLICT` là một finding (phát hiện), không phải Analysis conclusion. Nếu
conflict ảnh hưởng requirement readiness, conclusion phải là
`BLOCKED_NEEDS_REVIEW`; approval chung chung không giải quyết được blocker.

### Giữ yêu cầu gốc và đưa change đến kết quả

Với change mới, Proposal/Analysis và Gate 1 ghi ngắn gọn yêu cầu current-user
đã đối chiếu authority (`AUTHORITATIVE_USER_REQUIREMENT`), ràng buộc cứng
(`HARD_CONSTRAINTS`), phần ngoài phạm vi (`OUT_OF_SCOPE`) và kết quả quan sát
được cần đạt (`SUCCESS_OUTCOMES`), cùng nguồn của chúng. Đây là phần của
artifact/gate hiện có, không tạo artifact hoặc approval mới. Design phục vụ
yêu cầu đã duyệt; approval Design, Tasks hoặc implementation không tự đổi
baseline. Muốn đổi một phần của baseline phải có quyết định Human rõ ràng tại
gate sở hữu và review lại các artifact/hash bị ảnh hưởng. Không dựng lại
baseline như thể nó đã có trong hồ sơ lịch sử.

Trước khi thêm subsystem, dependency lớn hoặc thay một khả năng sẵn có của
Codex/nền tảng, kiểm tra việc đó có cần cho `SUCCESS_OUTCOMES`, có phù hợp
`HARD_CONSTRAINTS` và `OUT_OF_SCOPE` không; dùng khả năng sẵn có khi đủ.
Khả năng nền tảng như built-in browser là transport sẵn có, nhưng không tự
chứng minh authorization, trusted
observation hoặc kết quả QA của YUTA. Nếu giải pháp đổi requirement/scope hoặc
vượt ràng buộc, dừng phần mở rộng và trình đúng thay đổi cần Human quyết định;
không tự mở nhánh kiến trúc mới.
Ví dụ hồi quy: nếu Gate 1 yêu cầu Codex dùng built-in browser, đề xuất thêm
Playwright/Chrome và quản lý session riêng phải dừng để xét scope; bằng chứng
browser do caller tự khai vẫn không đủ chứng minh quyền thực thi hay QA.

Sau khi Design, Sensitive Design khi áp dụng, Tasks và phạm vi Apply đã được
duyệt, bước mặc định là implement phạm vi được cấp quyền và kiểm tra tập trung.
`FAIL` trước hết được phân loại: defect trong approved behavior thì sửa tại
Apply; chỉ quay lại Design/gate sở hữu khi evidence cho thấy Design không thể
đạt requirement/acceptance, phải đổi scope/authority, hoặc vi phạm một bất
biến an toàn trọng yếu được nêu đích danh. Ghi vì sao correction trong scope
hiện tại không đủ. Naming, field placement, fixture hoặc implementation
mechanics tương đương không tự là lý do mở lại Design.

Ưu tiên đường đi sản phẩm nhỏ nhất đạt `SUCCESS_OUTCOMES` và bằng chứng/an toàn
bắt buộc. Không mở rộng task để hoàn thiện Windows, Linux, công cụ nền tảng,
thư viện bên thứ ba hoặc tương thích đa nền tảng khi chúng không chặn kết quả
đã duyệt. Chỉ điều tra ngắn và sửa ở lớp đó khi có bằng chứng về blocker thực
sự; nếu việc sửa làm đổi scope hoặc authority, trình Human quyết định ngắn tại
gate sở hữu. Ghi giới hạn không chặn và hardening còn lại để xử lý sau, không
đổi `FAIL`/`BLOCKED` thành `PASS` khi chưa có bằng chứng mới.

Trước một vòng planning hoặc chạy lại tương đương, hỏi: điều gì đã thay đổi,
evidence mới nào sẽ có và quyết định nào có thể thay đổi? Hai vòng planning
liên tiếp cho cùng mục tiêu mà không có executable evidence mới là tín hiệu
dừng planning, dùng `ITERATION_STOP_CONTROL` hiện có và chọn bước thực thi đã
được cấp quyền hoặc một quyết định còn thiếu tại gate hiện có. Không thêm gate,
bộ đếm hoặc QA status. Khi outcome được yêu cầu và evidence bắt buộc đã đủ,
dừng công việc trong scope; hardening suy đoán để sau. Báo tiến triển bằng
outcome quan sát được và evidence, không chỉ đếm task hoàn thành; giữ riêng
Technical Compliance, VERIFY, QA và FAIL/BLOCKED lịch sử. Khi cần Human quyết
định, tóm tắt bằng lời ngắn: quyết định gì, vì sao, lựa chọn và hệ quả chính;
bằng chứng/hash chi tiết vẫn nằm trong review packet.

## 7. Review gates và integrity

| Gate                                    | Reviewer đang quyết định gì?                                                                                | Review packet           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------- |
| **Gate 1 — Product / Authority Review** | Proposal/Analysis có đúng scope, owner, authority và đủ rõ để viết Specs hoặc đi no-spec không?             | `01-analysis-review.md` |
| **Gate 2 — Requirements Review**        | Exact requirements/scenarios có đúng approved behavior, không chứa hidden assumption và strict-valid không? | `02-specs-review.md`    |
| **Sensitive Design Gate**               | Thiết kế nhạy cảm có giữ đúng durable, security, data/runtime, legal/provider và rollback boundaries không? | `02b-design-review.md`  |
| **Gate 3 — Final Independent Review**   | Exact implementation/evidence có đủ để approve finalization và cho phép sync/archive không?                 | `03-final-review.md`    |

`PASS`, test xanh, file tồn tại, commit/PR approval hoặc recommendation của
Codex không thay thế human decision. Mỗi approval bị ràng buộc bởi exact path
set và SHA-256 của bytes đã review. Khi thêm, xóa, đổi tên hoặc thay bytes của
artifact/evidence, packet liên quan trở thành
`INVALIDATED_BY_ARTIFACT_CHANGE` và phải được review lại.

Các trạng thái review packet là `AWAITING_HUMAN_REVIEW`, `APPROVED`,
`CHANGES_REQUESTED`, và `INVALIDATED_BY_ARTIFACT_CHANGE`. Approval phải đến từ
current user, ghi rõ change/gate đang duyệt; Gate 3 còn cần authorization rõ
ràng cho sync và archive.

## 8. Tasks, phased implementation và Technical Implementation Contract

Các phase sau là nhãn lập kế hoạch tùy chọn, không phải chuỗi stage bắt buộc:

| Phase tùy chọn             | Khi nào cần                                    | Nội dung cần làm rõ khi liên quan                                                                                               |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Foundation / Data`        | Có thay đổi nền tảng dữ liệu hoặc persistence. | Owner/canonical owner, schema/migration khi áp dụng, tenant/isolation concerns và required evidence/checks từ phase contract.   |
| `Service / Domain`         | Có thay đổi nghiệp vụ hoặc service.            | Domain behavior, trusted boundaries, validation, authorization khi áp dụng và targeted tests/checks.                            |
| `UI / Components`          | Có thay đổi cấu trúc hoặc presentation UI.     | Component ownership, Server/Client boundary, reuse approved UI patterns và evidence rằng approved UI outcome đã được hiện thực. |
| `Interaction / States`     | Có thay đổi tương tác hoặc trạng thái.         | Edit/read-only, loading/error/pending/success/recovery, keyboard/basic accessibility và relevant state behavior.                |
| `Integration / Regression` | Cần chứng minh phối hợp hoặc tránh regression. | Relevant integration/end-to-end/regression checks và evidence cho affected behavior.                                            |

Các concerns trong bảng chỉ áp dụng khi liên quan đến change, không phải
requirements bắt buộc cho mọi phase. Quy tắc chọn phase:

- Chỉ chọn phase change thực sự cần.
- Sắp các phase được chọn theo dependency.
- Không buộc change nhỏ đi qua đủ năm phase.
- Một phase có thể chứa nhiều task cụ thể.
- Không tạo phase rỗng.

### Technical Implementation Contract

Trong mỗi phase được chọn của `tasks.md`, nhúng một
`TECHNICAL IMPLEMENTATION CONTRACT`. Đây là một phần của Tasks /
Implementation Plan, không phải OpenSpec artifact mới. Contract ghi rõ:

- affected boundary;
- canonical owner;
- applicable scoped authorities, gồm root/nearest scoped `AGENTS.md` và các
  repository authority áp dụng;
- applicable constraints;
- intended files/packages;
- required targeted checks;
- completion evidence.

Code, DB, UI và test thật được thay đổi ở `APPLY`, không phải khi viết contract.
Không bắt đầu APPLY khi technical owner, boundary, authority hoặc constraint
cần thiết còn chưa giải quyết. Classification QA được ghi trong Tasks /
Implementation Plan trước APPLY (xem mục 9.A).

### Vòng thực hiện APPLY

Trong mỗi phase được chọn:

```text
Đọc task + contract + authority được dẫn chiếu
→ implement approved scope
→ chạy targeted checks khi phù hợp trước khi đi tiếp
→ đánh giá mọi contract item áp dụng
→ ghi evidence
→ chỉ đánh dấu complete khi implementation outcome VÀ compliance evidence tồn tại
```

Code đã thay đổi chưa đủ để complete task. Một checkbox chỉ complete khi
implementation outcome **và** compliance evidence cùng tồn tại; trước khi hoàn
tất phase phải đánh giá mọi contract item áp dụng. Vòng này không thêm human
approval sau mỗi phase. UI checks trong APPLY không thay thế Browser QA sau
VERIFY.

### Phản hồi phát triển có điều kiện sau Apply

Trong đường Apply hiện có, trước khi kết luận Technical Implementation
Compliance và formal VERIFY/QA, đánh giá hai assertion độc lập:
`DEV_USABLE` và `MANUAL_TEST_READY`. Đây không phải stage, gate, QA status hoặc
đường tắt qua một evidence bắt buộc. Cả hai ở trạng thái vận hành `pending`
trước khi được đánh giá; kết quả assessed chỉ là `YES | NO | NOT_APPLICABLE`.
Ghi kết quả cùng scope, candidate và evidence/lý do trong `tasks.md` theo
[`YUTA_AUTOMATED_CHANGE_WORKFLOW.md`](YUTA_AUTOMATED_CHANGE_WORKFLOW.md).

`DEV_USABLE = YES` chỉ khi feature áp dụng có thể dùng an toàn trong local/dev
qua intended real boundaries, với dev/test data và identity thích hợp. `NO`
ghi blocker thật; `NOT_APPLICABLE` cần lý do vì không có flow dev/runtime có
thể tương tác. Không suy applicability từ UI: một service không có browser vẫn
có thể có manual dev flow. `MANUAL_TEST_READY = YES` đòi handoff mà con người
có thể dùng: command/runtime, route/entry, safe data, test identity khi cần,
basic flow, reset/retry và dev-only limitations. Thiếu setup của flow có thật
là `NO`, không phải `NOT_APPLICABLE`. Handoff này không phải Browser QA,
Technical Compliance, VERIFY hoặc Gate 3 evidence.

Một assertion còn `pending` hoặc `NO` khi applicable giữ post-Apply work mở;
không đi tiếp bằng cách gán `NOT_APPLICABLE` giả. Lý do N/A hợp lệ phải được
ghi cho từng assertion trước khi tiếp tục.

Với interactive Product flow áp dụng, chờ human feedback cho đúng candidate:
`HUMAN_PRODUCT_VALIDATION = ACCEPTED | CHANGES_REQUESTED | BLOCKED`; trước
human decision là awaiting response. `ACCEPTED` không là VERIFY PASS, QA PASS,
Gate 3 approval hay Production Readiness. `CHANGES_REQUESTED` chỉ dùng vòng
`LOCAL_CORRECTION` khi giữ nguyên approved requirement, Product scope,
authorization/role/permission, schema, API/contract, data owner, business
semantics, sensitive durable boundary và acceptance criteria. Sau correction,
chạy targeted checks rồi human retest phần bị ảnh hưởng. Copy, layout, focus,
loading hoặc label không tự được miễn boundary này. Nếu cần đổi một boundary
đã duyệt, ghi `SCOPE_CHANGE_REQUIRES_REVIEW` và quay về gate sở hữu.
`CHANGES_REQUESTED`, `BLOCKED` hoặc awaiting response chưa hoàn tất Product
validation cho candidate hiện hành; chỉ tiếp tục sau disposition và human
look cần thiết, trong khi formal VERIFY/QA vẫn độc lập.

`DEV_USABLE != PRODUCTION_READY`: local/dev usable không cấp quyền Release,
Deploy, staging, legal hoặc Production Readiness. Các authority vận hành tại
[`operations/DEPLOYMENT.md`](operations/DEPLOYMENT.md) và
[`operations/PRODUCTION_READINESS.md`](operations/PRODUCTION_READINESS.md)
vẫn độc lập; `DEV_USABLE = YES` có thể cùng tồn tại với production blocked.

### Dừng vòng lặp tại gate hiện có

`ITERATION_STOP_CONTROL` là conditional stop/handoff trong anti-loop/evidence-stop
rule hiện có của [Control Tower](chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md),
không là Gate 4, stage hoặc QA status. Blocker lineage dựa trên affected claim,
blocker class và evidenced causal root cause; stage/evaluator purpose chỉ là
context của occurrence. Đổi câu chữ hoặc chuyển stage không xoá history. Mặc
định tối đa hai recovery attempts thất bại trên cùng lineage và ba actual
execution generations cho cùng lineage/stage/evaluator purpose, gồm initial run
là generation 1. Read-only diagnosis và rejected preflight không tự tiêu
counter. Agent không tự cấp thêm budget.

Khi hết budget, retry không an toàn hoặc evidence cho thấy không còn useful
progress, automation dừng tại gate bị ảnh hưởng để human chọn đúng một trong
`FIX`, `ACCEPT_LIMITATION`, `SPLIT_CHANGE`, `DEFER_OR_CLOSE`. `FIX` cần defect
Product/implementation đã xác lập; split không xoá dependency còn bắt buộc;
defer/close không giả completion. `ACCEPT_LIMITATION` chỉ disposition cho
`KNOWN_EVIDENCE_LIMITATION` được approved criteria cho phép: không tạo PASS,
không đổi FAIL/BLOCKED, không waive mandatory Browser QA/security/legal/payment/
fiscal evidence, không sửa history hoặc làm yếu criteria. Thiếu evidence bắt
buộc vẫn giữ gate blocked. Accounting và handoff record cụ thể nằm trong
Automated Workflow và Control Tower owner, không tạo rule cạnh tranh tại đây.

### Adoption theo finalization

Quy tắc trên chỉ bắt đầu áp dụng sau **successful human-authorized finalization
and archive of `development-usability-and-iteration-control`**, sau khi
canonical workflow edits được Apply và VERIFY thành công. Draft hoặc partial
edit, ngày trên lịch và file timestamp không phải adoption event. Chính
governance change này dùng pre-adoption workflow; không tự đòi các checkpoint
hoặc iteration ledger mới để hoàn tất nó.

DONE/archived và completed no-spec work giữ lịch sử, không dựng lại checkpoint
hoặc relabel PASS/FAIL/BLOCKED. Active pre-Apply change tại adoption dùng
checkpoint mới khi applicable. Active change đã vào Apply/VERIFY/QA không tự
rewind; chỉ opt-in bằng human instruction rõ ràng. Đây là ngoại lệ hẹp cho
**checkpoint mới**; earliest missing/unapproved/invalidated gate rule của các
gate cũ vẫn nguyên. Nếu không xác định được phase tại adoption bằng evidence
hiện hữu, dừng `NEEDS_REVIEW`, không suy từ timestamp.

### Technical defect trong approved behavior

- Có thể sửa implementation defect trong approved scope.
- Chạy lại relevant targeted checks.
- Tiếp tục khi contract và evidence đã được đáp ứng; không tự tạo Product
  decision mới.

### Discovery cần thay đổi quyết định

Nếu implementation cho thấy cần thay đổi:

- Product behavior;
- requirement;
- permission/security;
- canonical owner;
- API/contract;
- runtime/data/durable boundary;

thì **STOP** và quay lại Product/authority/Design gate phù hợp. Không làm yếu
hoặc âm thầm viết lại Specs/Design để khớp code; không bỏ qua technical rule để
hoàn tất phase.

## 9. VERIFY khác QA

### VERIFY — technical correctness

Checks trong APPLY hỗ trợ triển khai từng task/phase. VERIFY đối chiếu toàn bộ
implementation trong scope với approved planning và technical authorities;
QA kiểm tra hành vi trong user/runtime context. Ba việc này không thay thế nhau.

VERIFY trả lời “implementation trong repository có khớp approved Specs/Design
và technical authorities không?”. Evidence có thể gồm:

- Specs/Design → code/test mapping;
- targeted và broader tests;
- typecheck, build và strict OpenSpec validation;
- architecture, security, schema và migration checks;
- scoped diff, deviations và blockers.

`TECHNICAL COMPLIANCE MATRIX` nằm trong VERIFY evidence hiện có, không phải
artifact mới. Mỗi constraint áp dụng được truy vết theo:

```text
constraint → authoritative source → affected implementation
→ check/evidence → PASS | FAIL
```

Matrix chỉ chứa constraints áp dụng và traceability tới các phase thực sự dùng;
không thêm dòng rỗng cho phase không cần. Chỉ ghi
`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` khi mọi dòng áp dụng đều PASS.
`VERIFY: PASS` còn đòi hỏi implementation khớp approved Specs/Design và không
còn deviation/blocker ngăn technical verification. Nếu không đạt, ghi `FAIL`
hoặc blocker cụ thể; sửa trong approved behavior rồi chạy lại, hoặc quay về
gate phù hợp nếu cần quyết định ngoài scope. Không tạo status mới cho finding.

VERIFY không chứng minh browser UX, visual/responsive correctness, deployment,
environment enablement hoặc Production Readiness.

### QA — user/runtime correctness

QA trả lời “hành vi có hoạt động đúng trong ngữ cảnh người dùng/runtime không?”.
Các nhóm A–E dưới đây chỉ tổ chức phần giải thích, không phải QA phases, states
hoặc gates mới. Chi tiết dùng [`YUTA_QA_PROTOCOL.md`](YUTA_QA_PROTOCOL.md).

#### A. QA scope classification

Tasks / Implementation Plan ghi trước APPLY:

```text
UI_AFFECTING: YES | NO
BROWSER_QA_REQUIRED: YES | NO
```

Thay đổi UI-visible, interaction, responsive, role/edit/read-only state hoặc
loading/error/success presentation đặt cả hai giá trị là `YES` và bắt buộc
Browser QA. Non-UI dùng non-browser QA khi có user/runtime QA dimension;
`NOT_APPLICABLE` chỉ khi thật sự không có dimension đó, không hợp lệ với
`UI_AFFECTING: YES`. Backend/data-only không cần Browser QA vô nghĩa;
correctness của schema, migration, repository, tenancy, authorization và
integration thuộc VERIFY.

#### B. Environment/data preparation

QA dùng verified implementation. Browser QA chạy real/local route với dữ liệu
realistic an toàn gần thực tế nhất, giữ đúng authorization, tenancy, persistence
và runtime boundaries. Không thay integrated page bằng fixtures để làm QA PASS.

Nếu môi trường/dependency không sẵn sàng, chỉ thử safe bounded recovery theo
repository; ghi exact commands, failures và hành động môi trường cần thiết.
Không che blocker hoặc tự chuyển thành PASS (xem nhóm E).

#### C. Applicable behavior checks

Kiểm tra các trường hợp áp dụng cho change, không ép mọi scenario lên mọi change
nhưng không bỏ scenario liên quan:

- primary happy path và meaningful before/after state;
- role/permission, editable và read-only states;
- loading, error, saving, success và recovery presentation;
- keyboard operation và basic accessibility;
- overflow/clipping, responsive behavior và regression quanh vùng thay đổi.

Viewport của page pack được ưu tiên; nếu không có, tối thiểu desktop `1366x768`
và mobile `390x844`, thêm intermediate/tablet khi layout hoặc target yêu cầu.
Không tạo screenshot trùng lặp không chứng minh layout/state khác biệt.

#### D. Evidence

UI-affecting change lưu evidence tại:

```text
docs/reviews/<change-name>/qa/
├── QA_REPORT.md
├── screenshot-manifest.md
└── *.png
```

`QA_REPORT.md` ghi scope/classification, route, data/test setup, roles/states,
viewports, scenarios, accessibility, visual/responsive/regression findings,
limitations và screenshot evidence. Mỗi screenshot phải đến từ actual Browser
QA; manifest ghi repository-relative path, viewport, role/state, scenario cùng
lowercase SHA-256 của exact file bytes. Gate 3 liên kết và hash report, manifest
và screenshots theo review integrity ở mục 7.

Screenshot không thay thế kiểm tra tương tác và không định nghĩa Product
behavior, permission, schema, persistence, ownership hoặc lifecycle.

#### E. Status and next action

QA status giữ nguyên đúng bốn giá trị:

| Status                   | Ý nghĩa và hành động tiếp theo                                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `PASS`                   | Mọi required QA và evidence đã hoàn tất; vẫn phải thỏa các điều kiện Gate 3 khác.                                                        |
| `FAIL`                   | Có lỗi behavior/visual/responsive/accessibility áp dụng; ghi finding và xử lý theo phạm vi bên dưới.                                     |
| `BLOCKED_BY_ENVIRONMENT` | Required QA không chạy được sau safe bounded recovery vì environment/dependency; ghi blocker và dừng với hành động môi trường cần thiết. |
| `NOT_APPLICABLE`         | Không có user/runtime QA dimension; không hợp lệ với UI-affecting change.                                                                |

Với QA `FAIL`:

- Implementation defect trong approved behavior → sửa trong scope → rerun
  VERIFY **và** QA.
- Cần thay đổi behavior/requirement/permission/owner/API hoặc durable boundary
  → **STOP** và quay lại authority/gate phù hợp, không tự đổi requirements để
  làm QA PASS.

## External design reference routing

Trong Analysis/plan và TECHNICAL VERIFY hiện có, dùng
[External Design Intelligence](ui/EXTERNAL_DESIGN_INTELLIGENCE.md) để ghi usage,
provenance và disposition. Không thêm phase; Gate 3 vẫn đánh giá riêng Technical
Implementation Compliance, VERIFY và QA. Không sửa approved Analysis bytes.

## 10. Gate 3 readiness

Gate 3 chỉ ready khi:

```text
TECHNICAL IMPLEMENTATION COMPLIANCE = PASS
VERIFY = PASS
required QA = PASS
```

Với non-UI change, applicable non-browser QA phải `PASS`; `QA: NOT_APPLICABLE`
chỉ hợp lệ khi thật sự không có user/runtime QA dimension. `FAIL`,
`BLOCKED_BY_ENVIRONMENT`, thiếu role/state, responsive coverage hoặc evidence
bắt buộc đều ngăn ready Gate 3. Dùng phạm vi QA và evidence ở mục 9; readiness
không thay thế human approval hoặc sync/archive authorization ở mục 7.

## 11. Normative specs và sync

```text
approval permits sync
sync performs mechanical promotion
```

`openspec/changes/**` luôn là proposed/in-progress và non-normative. Nội dung
main spec chỉ trở thành normative cho precise observable behavior sau khi exact
delta qua accountable approval gate, current user cấp explicit sync
authorization, sync thành công, và resulting main specs qua validation + diff
review.

Sync không tạo Product approval, không thay accepted durable boundaries và
không tự cập nhật lifecycle. Main specs cũng không chứng minh implementation,
deployment, database shape hoặc Production Readiness. Xem
[`OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`](OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
cho conflict, rollback và modification policy chi tiết.

## 12. `$yuta-run-change`

Đây là workflow hằng ngày để bắt đầu một bounded change, resume một change hoặc
adopt một in-flight change. Nó luôn tìm gate sớm nhất còn thiếu, chưa duyệt,
changes-requested hoặc invalidated; artifacts về sau không được bypass gate
trước. Nó tự làm việc giữa các gate, dừng ở human review kế tiếp, và **không bao
giờ sync hoặc archive**.

Ví dụ bắt đầu:

```text
$yuta-run-change <mô-tả bounded change>
```

Ví dụ resume sau một approval cụ thể:

```text
$yuta-run-change <change-name>
Analysis review approved. Continue.
```

```text
$yuta-run-change <change-name>
Specs review approved. Continue.
```

Với in-flight change, workflow giữ nguyên bytes hiện có, tạo packet cho gate
sớm nhất cần review và không tự “sửa cho đẹp” artifact đã tồn tại.

## 13. `$yuta-finish-change`

Hai mode có precondition và integrity scope riêng, không được trộn.

### Branch A — Active finalization

```text
Gate 3 approval + explicit sync/archive authorization
→ integrity recheck
→ sync (hoặc no normative promotion trên valid no-spec path)
→ validate
→ archive
→ knowledge scan
```

Lệnh/resume intent điển hình:

```text
$yuta-finish-change <change-name>
Final review approved. I authorize spec sync and archive.
```

Workflow recheck planning artifacts, attributed implementation diff, VERIFY,
Technical Compliance, earlier gates và applicable QA hashes trước khi ghi
approval. Drift dừng finalization và trả change về `$yuta-run-change`.

### Branch B — Archived Knowledge Review resume

```text
Gate 3 already approved + archive completed
→ approve exact knowledge diff
→ recheck target path/hashes + proposed-diff hash
→ apply exact approved documentation update
→ validate docs
→ DONE
```

Ví dụ intent:

```text
$yuta-finish-change <change-name>
Knowledge consolidation review approved. Apply and close.
```

Branch B không tái tạo active change, không yêu cầu Gate 3 approval mới, không
rerun sync/archive và không dùng lại authorization cũ để cấp quyền sửa docs.

## 14. Knowledge Consolidation

Archive chưa phải bước cuối. Sau archive, scan có giới hạn:

- Page Product Knowledge và page-pack/as-built;
- Module Product Knowledge;
- `docs/PRODUCT_KNOWLEDGE.md` routing;
- Module Registry và lifecycle/current-state;
- ADR/durable decisions;
- `CURRENT_STATE.md` khi broad summary thay đổi thực chất;
- `NEEDS REVIEW` thật sự được completed change giải quyết;
- limitation hoặc future work mới phát hiện.

```text
NO_UPDATE_REQUIRED
→ record reason + sources inspected
→ DONE

UPDATE_REQUIRED
→ docs/reviews/<change>/04-knowledge-consolidation-review.md
→ human review
→ recheck exact hashes
→ apply approved docs diff
→ validate
→ DONE
```

Knowledge Consolidation không tự approve Product Decision, đổi durable
boundary/owner/permission/API, promote lifecycle/readiness, rewrite normative
specs hoặc giải quyết `NEEDS REVIEW` bằng assumption. Chi tiết nằm trong
[`YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`](YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md).

### Legacy Page Knowledge Migration — separate governance maintenance

Migration knowledge của một scope cũ không tự mở Product Change, OpenSpec
change, Gate 1/2/3, sync hay archive. Nó không thay Knowledge Consolidation
sau archive cho các Product Changes bình thường. Dùng discovery spine hiện có:
`docs/README.md` → `docs/PRODUCT_KNOWLEDGE.md` → `docs/MODULE_REGISTRY.md`
→ owning module/capability home → ADR/main specs/UI knowledge → code/schema/tests.
Giữ Product Truth và Implementation Truth riêng; không dump transcript vào repo
hoặc tạo knowledge system thứ hai.

Cho từng scope được phép migration: lấy legacy extract một lần, inventory các
claim, reconcile với Product Knowledge, accepted decisions, normative main
specs, active/archive provenance, architecture/authorization, code và tests;
classify `CONFIRMED`, `IMPLEMENTED`, `DECIDED_NOT_IMPLEMENTED`, `PROPOSED`,
`UNRESOLVED`, `CONFLICT` hoặc `OBSOLETE`. Canonicalize vào owning repository
sources; chỉ Human quyết định conflict hoặc Product/authority gap thật sự.
Sau đó cho fresh agent chỉ dùng repository và không có Page Chat history tìm
đúng bounded knowledge. Ghi exact scope, evidence và PASS trong owning source,
link từ Module Registry. Chỉ sau PASS mới retire Product/shaping authority của
Page Chat cho scope đó; Page Chat vẫn là legacy evidence. Scope khác chưa PASS
giữ authority cũ. Nếu fresh agent cần Page Chat để thiết lập canonical knowledge,
chưa đạt PASS và chưa cutover. Việc đã lấy extract cho phép tiếp tục công việc
đối soát mà không phải liên tục quay lại Page Chat, nhưng không tự retire authority.

## 15. No-spec path

`skip_specs: true` chỉ dùng khi thật sự không có spec-level behavior change,
ví dụ pure refactor, tooling hoặc docs. Không tạo requirement giả để vượt
validation.

```text
Gate 1 approved
→ no Gate 2
→ no normative spec promotion
→ continue applicable Design/Tasks/Apply/Verify/QA
→ Gate 3
→ Human Approval
→ $yuta-finish-change
→ valid no-spec finalization
→ Archive
→ Knowledge Consolidation
→ DONE
```

Gate 3 vẫn cần human approval và explicit finalization authorization; mọi
Technical Compliance, VERIFY và applicable QA rule vẫn áp dụng. Nếu delta specs
tồn tại trên một claimed no-spec path, đó là conflict và workflow phải dừng.

## 16. Release / Deploy lane

Sau repository `DONE`, ghi đúng một giá trị:

```text
RELEASE_FOLLOW_UP: NOT_REQUIRED | REQUIRED | UNKNOWN
```

Nếu required, xác định runtime/environment, deployment authorization, migration
hoặc provider/readiness evidence, post-deploy verification, monitoring và
rollback. Đây là operational work riêng; Workflow v3 không tự deploy và không
dùng QA repository để tuyên bố production enabled.

## 17. Ví dụ hằng ngày

### Example A — small page-local UI change

Với scope chưa migration PASS, Page Chat xác nhận `PAGE_LOCAL`; nếu scope đã rõ
thì bỏ Discovery/Shaping. Với scope đã PASS, dùng repository knowledge và
Control Tower/Human routing theo mục 4.
Change đi qua Proposal → Analysis → Gate 1 → Specs → Gate 2; Design chỉ tạo khi
applicable và không có Sensitive Design Gate nếu không chạm boundary nhạy cảm.
Tasks chọn `UI / Components`, `Interaction / States` và regression cần thiết.
Sau Apply, VERIFY chứng minh mapping/code/tests; Browser QA chạy real route ở
viewport theo page pack, kiểm tra relevant state/accessibility và lưu screenshot
hashes. Gate 3 chỉ ready khi Technical Compliance, VERIFY và QA đều PASS.

### Example B — backend/data-only change

Sau các Product/requirements/design gate applicable, Tasks có thể dùng
`Foundation / Data`, `Service / Domain` và `Integration / Regression`. VERIFY
phải chứng minh schema/migration, repository behavior, tenant isolation,
authorization, integration và rollback concerns. Không ép Browser QA nếu không
có UI; `QA: NOT_APPLICABLE` chỉ dùng khi cũng không có distinct runtime/user QA
dimension. Gate 3 vẫn review exact technical evidence và diff.

### Example C — cross-module feature

Với scope chưa migration PASS, Page Chat thực hiện impact check và trả
`CROSS_MODULE` hoặc `UNCERTAIN`, lập handoff rồi dừng local change. Với scope đã
PASS, Control Tower dựa vào repository để phân loại impact. Control Tower map
owning/consumer capabilities, data owners, authority, shared contract và quyết định một coordinated change
hay nhiều bounded changes. Chỉ sau khi Product/durable blockers được giải quyết,
Control Tower mới cấp bounded `$yuta-run-change` request và routing cho các
gate/QA liên quan.

## 18. Quick reference

```text
CORE
IDEA → [Discovery] → Proposal → Analysis → Gate 1
→ Specs → Gate 2
→ Design [when applicable]
→ Sensitive Design Gate [conditional]
→ Tasks → Apply → Verify → QA
→ Gate 3 → Human Approval → $yuta-finish-change
→ Sync or valid no-spec finalization
→ Validate Main Specs when applicable → Archive
→ Knowledge Consolidation → DONE

PACKETS
01-analysis-review.md
02-specs-review.md
02b-design-review.md            conditional
qa/QA_REPORT.md                 required for UI-affecting
qa/screenshot-manifest.md       required for UI-affecting
03-final-review.md
04-knowledge-consolidation-review.md   conditional after archive

COMMANDS
$yuta-run-change     = start/resume/adopt; stop at next human gate
$yuta-finish-change  = authorized finalization OR archived knowledge resume

ESCALATION
PAGE_LOCAL chưa migration PASS → owning Page Chat / Local Control Tower → Codex
Scope đã migration PASS → repository knowledge + Global Control Tower → Codex
CROSS_MODULE / UNCERTAIN → Global Control Tower → Codex
Human chọn chat đích; hai chat không tự giao tiếp hoặc tự chuyển quyền
Codex finding CONFLICT / requirement-level NEEDS REVIEW → stop and route

QA
UI-affecting → Browser QA + responsive/state/accessibility + hashed screenshots
Backend/data-only → technical correctness in VERIFY; no meaningless Browser QA

KNOWLEDGE
Archive → scan → NO_UPDATE_REQUIRED or reviewed exact knowledge diff → DONE
```

Các bất đẳng thức phải giữ nguyên:

```text
APPROVED != IMPLEMENTED
IMPLEMENTED != PRODUCTION_ENABLED
VERIFY != QA
QA PASS != PRODUCTION_READINESS
ARCHIVE != KNOWLEDGE_CURRENT
SYNC != PRODUCT_APPROVAL
WORKFLOW_PROGRESS != LIFECYCLE_PROMOTION
```
