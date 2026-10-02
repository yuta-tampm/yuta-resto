# Sensitive Design Gate — revised Federated Control Towers foundation

Current status: TRIGGERED; APPROVED for the separate Sensitive Design Gate. Approval permits Tasks/TIC planning only.
Approval source: explicit current-user `APPROVE SENSITIVE DESIGN`, relayed as `CURRENT_USER_DECISION: APPROVE_SENSITIVE_DESIGN` in bridge result `BRIDGE-ARCH-20260925-F9R2:12`.
Approval recorded: 2026-09-25T23:19:53+02:00.
Pre-approval Sensitive Design packet SHA-256: `ec154e28892d5798f2e7699b48ebe7467539a38a98c688bad7f0411313735e3b`.
Design review status: APPROVED in `docs/reviews/federated-control-towers-foundation/02-design-review.md` by explicit current-user `APPROVE REVISED DESIGN` relayed in bridge command `BRIDGE-ARCH-20260925-F9R2:10`.
Revised Design path: `openspec/changes/federated-control-towers-foundation/design.md`.
Revised Design SHA-256: `5235f719d253e487766f5e6fb6302183ed17a3eaa9b2ad52208c0f7336608ec9`.
Pre-approval Design review packet SHA-256: `de41d64914f0ad84f2c8e8f972903640326b3966c5fad0c5af19d30693633797`.
Approved Design review packet SHA-256: `7c645be5325c4576782a44dd472742712807bcc1b07e75dea0f9b364e2d9d5ae`.

## Current-user Design change request and historical evidence

The current Human explicitly requested `REQUEST DESIGN CHANGES` against prior Design SHA-256 `d6d672b3b6b17c52f3862e215dfea4fc25792de32c958a0eb3f3d9842723ef67` and prior review packet SHA-256 `eb16b82ebc77253005ba092655e492465b04b50ca9dbf47a5e733b07667dfa7f`. Those were **not approved**. The original packet and its exact prior Design snapshot remain below as historical evidence; its `AWAITING_HUMAN_REVIEW` text is historical, not current approval. Approved Gate 1/Gate 2 scope and Spec SHA-256 `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` remain unchanged.

The current Human subsequently approved the revised Design at SHA-256 `5235f719d253e487766f5e6fb6302183ed17a3eaa9b2ad52208c0f7336608ec9`. That approval satisfied the normal Design prerequisite only. The separate current-user Sensitive Design approval recorded above now authorizes Tasks/TIC planning, but not Apply, local state creation, live activation, VERIFY or Browser QA.

## Sensitive boundary for separate Human review

The approved planning boundary is **one local Windows host, one NTFS checkout, all Codex executors using the same helper and lock path**. It includes ignored local activation/handoff/journal records, a held `FileStream` exclusive handle, monotonic activation/fencing epoch, exact Page/Global conversation targets, minimal conversation ID/title metadata, crash fail-closed, and separate live federation Browser QA. The boundary is approved for Tasks/TIC planning only; no implementation, runtime or QA result is claimed.

| Risk                                              | Reviewed mitigation and residual limitation                                                                                                                                                                                                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Split-brain / dual executable tower               | One activation projection under held NTFS lock; old `ACTIVE→FENCING` commit revokes old, later `ACTIVATING→ACTIVE` commit grants new. This excludes overlap only inside the supported local boundary after implementation proves lock/write semantics.                                              |
| Stale instance / replay                           | Exact conversation/run/epoch binding and immutable command journal; old instance or same-conversation old run rejected. Browser/provider can still display old chat; Codex authority is fenced, not provider-side conversation state.                                                               |
| Ambiguous activation / crash                      | Read-only probe precedes active commit; nine crash windows have no automatic execution and unknown state blocks. `File.Replace`/flush behavior and browser observation are not a single atomic event; runtime proof remains outstanding.                                                            |
| Handoff loss / drift / replay                     | Immutable `HANDOFF_ID`, required fields, hash and source/target checks, once-only consumption; missing/corrupt records stop. Local ignored files can be lost with checkout deletion or host change.                                                                                                 |
| Forged or stale Human approval / scope escalation | Approval references are rechecked at canonical review/source hashes; handoff and role labels grant no gate, Product or side-effect authority. Page Product intent stays with owning Page Chat; Global coordinates CROSS_MODULE/UNCERTAIN.                                                           |
| Recovery/evaluator budget reset                   | Causal lineage and counts survive fresh `RUN_ID`, rotation and restart; unknown execution remains unresolved, not a free retry.                                                                                                                                                                     |
| Privacy / retention                               | Store exact conversation ID/title and bounded references only in local ignored state, no transcript/customer content/credentials; close-context cleanup requires separate safe authorization and cannot erase uncertain history. Metadata still needs local access control and minimization review. |
| Cross-checkout or multi-host                      | Not supported. A second checkout must fail context-root binding; different hosts have independent locks and no distributed guarantee. Known or suspected parallel host use blocks execution.                                                                                                        |

### Remains prohibited

No multi-host/distributed coordination; private transcript persistence/export; credential, token, cookie or session persistence; unrelated customer data; new Product authority; auth/provider control or external APIs; automatic Human Gate/Apply approval; destructive rights; changed Workflow v3/Page Chat authority; Bridge v1 QA promotion; browser/filesystem/network permission beyond the reviewed local records and exact selected conversations. Any newly required prohibited capability returns `NEEDS_REVIEW` to its authority gate.

### Decision boundary

The normal revised Design and separate Sensitive Design decisions are `APPROVED` for the exact Design SHA-256 above. The Sensitive Design approval permits progression only to Tasks/TIC planning; it does not authorize Apply, lock or runtime-state creation, live Page/Global activation, Browser QA, or a Bridge v1 change. This packet does not declare lock, crash, live activation or Browser QA evidence PASS.

---

## Historical pre-revision Gate 2b packet — not approved

# Gate 2b — Federated Control Towers Sensitive Design review

Change: federated-control-towers-foundation
Gate: Sensitive Design Gate / Design review
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-25T22:18:55.5092837+02:00
Schema: yuta-spec-driven
Sensitive change: YES — SENSITIVE_DESIGN_GATE TRIGGERED
Approval source: PENDING current-user Design decision

## Authority và reviewed bytes

- Gate 1: APPROVED; approved packet SHA-256 `72d62468666dc3a2962b33e390f436028eb27f2cce43d8deaa167298448eaa25`.
- Gate 2: APPROVED by explicit current-user `APPROVE Gate 2` for pre-approval packet SHA-256 `f01f9e3f5cdb51981f56242f22e914f54462326d274027f53330353cb6856a77`; approved packet SHA-256 `46b69d158eca331fa4dbbdf70ab1f5a617eab2fee02d364065e0ee542372de20`.
- Proposal SHA-256 `ea8b97bd5a65fe9fa12ca049cad1bf9118ebf7675711fca809019bf81848a5ed`; Analysis SHA-256 `7508d09b3815992e73412fb121f1cf26f4c26e84002131be522daadaf86d4dc9`.
- Delta Spec SHA-256 `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` — 14 Requirements / 39 Scenarios, unchanged.
- Design path `openspec/changes/federated-control-towers-foundation/design.md`; exact file-byte SHA-256 `d6d672b3b6b17c52f3862e215dfea4fc25792de32c958a0eb3f3d9842723ef67`. Exact snapshot below must be checked against these bytes before approval.
- Bridge v1 QA report SHA-256 `6a3a7979b64617cb30d162f5a6e5ca853ad26d2bd084f01339023e8f475c8d83`; QA remains PAUSED, `BLOCKED_BY_ENVIRONMENT`, 16 PASS / 6 PARTIAL_EVIDENCE / 2 NOT_RUN, Gate 3 NOT_READY.

## Decisions và implementation boundary

| Design | Decision for Human review                                                                                                                                                                             | Requirement coverage |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| D1     | Federation explicit by context; Page/Global role, scope, exact instance; no inferred Page authority.                                                                                                  | F1–F3, F13           |
| D2     | Separate future skill, PowerShell state helper, tracked conversation instruction source, ignored local record owner, OS lock + intent journal; single-host only; fail closed if exclusivity unproven. | F4, F5, F7, F9, F11  |
| D3     | INACTIVE → ACTIVATING → ACTIVE → FENCING → TERMINAL/REVOKED; old fenced before new; one read-only activation probe.                                                                                   | F4, F5, F8, F10, F14 |
| D4     | Durable non-executable handoff, Page→Global escalation, terminal old run and fresh RUN_ID.                                                                                                            | F6–F9                |
| D5     | Existing v1 wire grammar and at-most-once/delivery rules unchanged across towers.                                                                                                                     | F8, F9, F13          |
| D6     | Separate Page/Global rotation, provenance-based restart and canonical source comparison.                                                                                                              | F10, F11             |
| D7     | Provenance-based PAGE_CONTEXT_INTAKE and Page Chat Product authority.                                                                                                                                 | F2, F3, F11–F13      |
| D8     | Human Gates, conversation-local live acceptance, federation Browser QA, no Product UI impact.                                                                                                         | F1, F13, F14         |

Expected implementation owner boundary after a separate Tasks/TIC approval: `.agents/skills/yuta-federated-control-towers/SKILL.md`, `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`, `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`, ignored local `tmp/yuta-federated-control-towers/<EXECUTION_CONTEXT_ID>/` state/lock, and change/review/QA evidence. Human applies the tracked instruction source only to exact selected Page/Global tower conversations. Design does not authorize editing those owners now. No v1 skill/prompt, Workflow v3, Page Chat prompt/rules, global Project Instructions, Product code, API, auth, schema, provider or deployment change is authorized.

## Sensitive Design analysis

- **Authority/security:** Split-brain, stale instance, replay, command double execution, ambiguous target, unauthorized scope escalation, Human approval spoofing and budget reset are the sensitive boundary. Local lock, epoch, durable intent/outcome, exact target and quiescent transfer are the selected design; Browser QA must prove them. A chat message, Markdown record alone, or Human assertion is insufficient for atomic exclusivity.
- **Data/privacy:** Activation/handoff keep local target metadata, hashes, approval references and completeness flags, not transcript, private Product content, credentials or secrets. The ignored workspace can be lost; loss blocks federation. A need for transcript export, new sensitive storage or credentials returns `NEEDS_REVIEW`.
- **Runtime ownership:** Single local Codex executor/host and one checkout only. Cross-host execution or a second executor outside the lock contract is unsupported and must fail closed. No claim that ChatGPT can deactivate a conversation at provider level; fencing removes Codex executable authority.
- **Migration/rollback:** No automatic migration from Bridge v1. Federation needs explicit mode selection, reviewed Tasks/TIC, implementation, Human live-context update, live verification and separate Browser QA. Rollback fences the active instance; does not replay uncertain delivery or silently switch to v1. Human handles live conversation context separately.
- **Residual limitations:** OS/filesystem lock/flush and crash-recovery claims remain unproven until implementation/QA. Live prompt bytes may not be inspectable; acceptance requires observable exact-conversation behavior. Bridge v1 QA blockers remain independent.
- **Design gate conclusion:** `SENSITIVE_DESIGN_GATE: AWAITING_HUMAN_REVIEW`. No Tasks/Apply/VERIFY/QA until explicit approval of this exact Design hash. No unresolved architectural choice is delegated to implementation; any need for cross-host coordination, protocol extension, private transcript storage, credential/provider control or authority change requires separate review.

## Exact questions for Human Design review

1. D1: Có duyệt hai role Page/Global với scope và exact instance identity, không thêm Product authority không?
2. D2: Có duyệt `ACTIVE_CONTROL_TOWER` là một executable target cho từng local execution context không?
3. D2: Có duyệt single-host OS lock, epoch, durable intent/outcome và fail closed nếu exclusivity chưa chứng minh không?
4. D3: Có duyệt activation/fencing state machine và read-only activation probe trước executable work không?
5. D4: Escalation Page→Global có dừng Page trước, giữ blocker/approval/budget và không dual execution không?
6. D4: Có duyệt terminal old run rồi fresh `RUN_ID` với cùng causal lineage khi đổi instance không?
7. D4: `handoff.json` đủ field/provenance và giữ là evidence không cấp quyền không?
8. D6: OpenSpec/review, repository, Page Chat, VERIFY/QA, Knowledge và activation/handoff có giữ đúng authority từng loại không?
9. D6: Page/Global rotation và restart khi record/old-instance state thiếu có dừng an toàn không?
10. D7: PAGE_CONTEXT_INTAKE đủ bốn status, direct retrieval optional và read-only handoff không chuyển authority không?
11. D1/D7: PAGE_LOCAL vẫn do owning Page Chat Product/shaping quyết; CROSS_MODULE/UNCERTAIN lên Global theo Workflow v3 không?
12. D5: Bridge v1 wire grammar và single-gateway mode giữ nguyên, không chuyển QA PASS sang federation không?
13. D2/D8: Future implementation owners, live context và local metadata storage có phù hợp giới hạn scope không?
14. D8: Federated Browser QA riêng có đủ các chứng minh thực tế trước QA PASS/Gate 3 không?
15. Sensitive risks: Có chấp nhận single-host boundary, metadata local, record-loss fail closed và các residual risks chưa được QA chứng minh không?
16. Có duyệt exact Design snapshot/hash dưới đây để sau đó mới xem xét Tasks/TIC, hay yêu cầu sửa/hoãn Design?

## Validation và trạng thái

- `pnpm exec openspec validate federated-control-towers-foundation --strict`: PASS — `Change 'federated-control-towers-foundation' is valid`.
- `pnpm docs:check`: PASS — 36 current documents.
- `pnpm architecture:check`: PASS — runtime imports, database URLs, client boundaries and migration baselines valid.
- Scoped `pnpm exec prettier --check` for Proposal, Analysis, Spec, Design and three review packets: PASS.
- Exact Design snapshot comparison (excluding terminal newline): PASS; Proposal, Analysis, approved Gate 1 packet and Spec retained reviewed SHA-256; approved Gate 2 packet hash recorded above.
- `UI_AFFECTING: NO`; Product UI QA `NOT_APPLICABLE`; federated Browser QA `REQUIRED` but `NOT_RUN`. Implementation `NOT_RUN`; formal VERIFY `NOT_RUN`; Gate 3 `NOT_READY`. Approval remains pending.

## Exact Design snapshot

```markdown
## Context

Gate 1 và Gate 2 đã duyệt capability `tooling/federated-control-tower-transport` riêng với Bridge v1. Delta Spec có 14 Requirements / 39 Scenarios. Bridge v1 hiện là một gateway, Browser QA vẫn PAUSED và `BLOCKED_BY_ENVIRONMENT` (16 PASS, 6 PARTIAL_EVIDENCE, 2 NOT_RUN), Gate 3 `NOT_READY`. Không có implementation federation hoặc bằng chứng live federation. Design này mô tả contract cho một executor Codex cục bộ và các conversation được Human chọn; nó không kích hoạt mode, tạo record vận hành, sửa prompt/skill hoặc chạy QA.

## Goals / Non-Goals

- Cho `PAGE_LOCAL` dùng đúng `PAGE_CONTROL_TOWER` đã active, và chuyển `CROSS_MODULE`/`UNCERTAIN` tới `GLOBAL_CONTROL_TOWER`, trong khi Product/shaping authority của owning Page Chat và Human Gates giữ nguyên Workflow v3.
- Ràng buộc role/scope/instance, chứng minh một executable active target trong một execution context cục bộ, fence lệnh cũ, duy trì at-most-once/lineage/budgets và handoff có provenance ngoài lịch sử chat.
- Giữ Bridge v1 là mode mặc định độc lập; một thay đổi mode cần authorization riêng. Browser QA federation phải chứng minh runtime, không kế thừa PASS của Bridge v1.
- Không đổi Workflow v3, Page Chat rules, Product code/UI, API, auth, schema, provider, deployment, Bridge v1 owner hoặc QA. Không export transcript, lưu credential/secret, thêm executable protocol block, tự cấp side-effect authority hay hỗ trợ đồng thời nhiều host.

## Decisions

### D1. Mode, role, scope và target identity

Một `EXECUTION_CONTEXT_ID` là token opaque duy nhất do Codex tạo cho một công việc đã được Human/workflow xác định; nó không phải `RUN_ID`. Mode mặc định của context mới là `BRIDGE_V1`. Federation chỉ được chọn sau current-user decision hoặc workflow đã review nêu rõ context, mode và scope, cộng activation hợp lệ. `CONTROL_TOWER_ROLE` có đúng `PAGE_CONTROL_TOWER` hoặc `GLOBAL_CONTROL_TOWER`; `CONTROL_TOWER_SCOPE` là page/capability owner cụ thể cho Page, hoặc `CROSS_MODULE`/`UNCERTAIN`/shared/foundation cho Global; `CONTROL_TOWER_INSTANCE` là exact conversation ID, không phải title. Target binding gồm Project identity, exact visible title, URL/conversation ID, role, scope và owning Page Chat reference nếu là Page. Codex xác minh title + URL/ID ngay trước mỗi send. Rename, title trùng, focused tab hoặc Project membership không chuyển binding. PAGE_LOCAL chỉ đi thẳng Page tower khi impact check, owner và activation đều khớp; nếu thiếu, dừng phần phụ thuộc. Global là escalation coordinator, không thành Product authority của page. Loại phương án tự chọn Page Chat hoặc suy role từ title vì không chứng minh owner/authority. (F1–F3, F13)

### D2. Durable state owner và giới hạn exclusivity

Owner implementation tương lai là `.agents/skills/yuta-federated-control-towers/SKILL.md`, helper `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` và tracked instruction source riêng `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`. Human chỉ áp dụng instruction source vào đúng conversation Page/Global được chọn; nó tham chiếu Workflow v3 và không sửa Page Chat prompt, global Project Instructions hoặc Bridge v1 skill/prompt. Helper PowerShell giữ lock và journal cho local Windows executor; nếu không thể giữ lock liên tục suốt một command, implementation phải dừng thay vì hạ bảo đảm. Non-executable operational state nằm trong ignored local workspace `tmp/yuta-federated-control-towers/<EXECUTION_CONTEXT_ID>/`: `activation.json`, `handoff.json` khi có transfer, và `lock` cho OS-exclusive lock. Đây là execution state, không phải Product/review/approval canonical source; OpenSpec/review artifacts vẫn lưu quyết định và evidence đã duyệt. Record có schema version, monotonic `ACTIVATION_EPOCH`, timestamps, mode, role/scope/instance, exact conversation ID và title cùng digest kiểm chứng của chúng, source/target references, state, last accepted command/result/delivery, lineage/budget/approval/hash references và record SHA-256. Chỉ lưu metadata target cần thiết trong workspace cục bộ; không chứa transcript, private Product content, token hoặc credential. Context ID không tái sử dụng; record mất, hỏng, stale, chưa được rehydrate hoặc source mâu thuẫn thì context không executable.

Một executor trên cùng host giữ exclusive OS file lock từ preflight qua ghi intent, side effect/observation và ghi outcome cho mỗi command; activation/transfer cũng giữ lock tới khi durable record được atomic replace và flush. Hash record là SHA-256 của canonical payload không chứa chính field hash, để tránh self-reference. Sau crash, intent chưa có outcome là `EXECUTION_UNCERTAIN`, không replay. Epoch trong record chỉ tăng dưới lock; command phải khớp epoch/active instance đã ghi và được kiểm lại ngay trước execution. Lock, atomic replace và flush là yêu cầu implementation/QA, không được suy từ Markdown hoặc browser. Nếu filesystem không bảo đảm lock/atomic write/flush, nếu một host/executor khác có thể thao tác cùng context mà không chia sẻ lock, hoặc nếu không thể khẳng định chỉ một executor cục bộ sở hữu context, federation là `BLOCKED`/`HUMAN_REQUIRED` và không active. Không tuyên bố bảo đảm cross-host. Loại phương án chỉ dùng chat history, title, Markdown file, in-memory flag hoặc Human attestation để chứng minh atomic exclusivity. (F4, F5, F7, F9, F11)

### D3. Activation/fencing state machine

Mỗi context có `INACTIVE`, `ACTIVATING`, `ACTIVE`, `FENCING`, `TERMINAL` hoặc `REVOKED`. Chỉ `ACTIVE` có một instance được quyền phát command cho work thực thi; `ACTIVATING` và `FENCING` là quiescent, ngoại trừ đúng một probe read-only/không side effect để kiểm protocol live trong `ACTIVATING`. Initiator là Human hoặc workflow đã review; Codex chỉ ghi/kiểm state. Trình tự: xác minh authorization và exact target; khóa context; chứng minh không có command/delivery outstanding; ghi old instance `FENCING`; dừng nhận/gửi cho old instance; ghi terminal/revoked với last identity, delivery và epoch; tạo handoff; đối chiếu nguồn canonical; ghi target `ACTIVATING` với epoch mới; Human chọn/xác nhận đúng conversation nếu cần; xác minh title/URL/ID và live operating context; fresh handshake/run; chỉ sau một probe command/result/evaluation hợp lệ mới xác lập `ACTIVE` cho work thực thi tiếp theo. Probe được kiểm đúng grammar/identity, không sửa repository/environment hay gọi external side effect; nó không cấp Apply. Nếu một bước thiếu/uncertain, giữ quiescent và dừng. Không có giai đoạn cả hai active. Command của old epoch/instance bị từ chối cả khi chat cũ vẫn hiển thị hoặc phát message. Loại phương án active target mới ngay sau đổi tab hoặc timeout. (F4, F5, F8, F10, F14)

### D4. Escalation, handoff và fresh run

Impact check trước command và khi evidence đổi phân loại. Khi Page chuyển sang `CROSS_MODULE`/`UNCERTAIN`, Page tower ngừng phần phụ thuộc, không tự mở scope; Codex fence Page trước khi Global có quyền. `handoff.json` là non-executable evidence, versioned và hashed, gồm source/target role, scope, instance và exact conversation ID; owner Page Chat; reason; terminal/delivery state; previous `RUN_ID`, `ROUND_ID`, `COMMAND_ID`, `CAUSAL_LINEAGE_ID`, activation epoch; blocker/root cause, recovery attempts, evaluator purpose/generation, evidence-stop disposition; Human approval references và artifact hashes; Product context source/completeness/gaps; next _candidate_ action và unresolved limits. Missing field, stale hash, contradictory approval/budget, uncertain delivery hoặc unclosed old execution dừng transfer. Handoff không duyệt next action. Không tạo block executable mới hoặc field mới trong v1 grammar; handoff được kiểm từ artifact và tóm tắt bằng value multiline hợp lệ ở handshake/command hiện có khi một run mới đã được cho phép.

Mọi switch conversation instance, kể cả Page→Global và rotation cùng role, terminal old run trước, fresh unique `RUN_ID` và handshake ở target mới. `CAUSAL_LINEAGE_ID`, budget và last command identity nối qua handoff; stage/title/run rename không reset. Same-`RUN_ID` switch bị từ chối. Cho đến khi new target active và đúng authority tiếp nhận, không tower nào chạy phần phụ thuộc. Loại chuyển lệnh đang bay, copy nguyên chat hoặc reset budget. (F6–F9)

### D5. V1 protocol, at-most-once và delivery

Giữ nguyên ba block và grammar Bridge v1: `YUTA_BRIDGE_HANDSHAKE`, `YUTA_CODEX_COMMAND`, `YUTA_CODEX_RESULT`; version `1`; exact run, positive sequential round, `COMMAND_ID = RUN_ID:ROUND_ID`, `CAUSAL_LINEAGE_ID`, one accepted command/one bound result. Không bổ sung role/scope/epoch vào wire grammar v1; chúng là activation preflight và durable state ngoài block. Trước execution, so exact active instance/epoch, latest complete command, approval/scope và durable last-command ledger. Ghi accepted intent trước side effect; `COMMAND_ID` đã accepted hoặc có thể đã thực thi không bao giờ chạy lần hai. Result A không được dùng cho command B. Prose, partial/unknown/duplicate block, stale round/run/epoch/lineage, wrong target và replay đều non-executable.

Với outbound delivery, dùng sáu state Bridge v1. `DELIVERY_UNCERTAIN` hoặc `EXECUTION_UNCERTAIN` chặn transfer và resend; timeout, reload, no response, chat reopen hay title change không chứng minh non-delivery. Chỉ bằng chứng dương tính rằng Send chưa kích hoạt hoặc thất bại trước post mới cho phép gửi lại theo v1, sau recheck target/lineage. Mất login, interrupted generation hoặc malformed response lặp lại theo fail-closed/evidence-stop v1. Loại retry tự động và dùng tower mới để né uncertainty. (F8, F9, F13)

### D6. Rotation, restart và canonical rehydration

Page rotation giữ owning Page Chat/Product authority và page scope; Global rotation giữ cross-module blockers và coordination scope. Cả hai theo D3/D4, không kế thừa quyền nhờ cùng title. Sau restart, Codex kiểm record integrity/epoch, lock ownership, exact target do Human/workflow đã chọn, approval/hashes, old terminal/delivery và latest command intent trước khi resume. Nếu record bị mất, executor khác không xác định, old instance không thể fence, hoặc command outcome không rõ, dừng `HUMAN_REQUIRED`/`BLOCKED`; Human không thể đơn phương biến một execution uncertain thành safe replay. OpenSpec/review kiểm planned decision/approval; repository kiểm implemented state; owning Page Chat kiểm PAGE_LOCAL intent; VERIFY/QA kiểm observation; Knowledge Consolidation chỉ kiểm knowledge sau lifecycle; activation/handoff kiểm transfer. Mâu thuẫn được báo, không lấy chat memory làm nguồn ghi đè. (F10, F11)

### D7. Page context intake và ranh giới authority

`PAGE_CONTEXT_INTAKE` ghi `AVAILABLE`, `PARTIAL`, `UNKNOWN` hoặc `NOT_APPLICABLE` với owning Page Chat identity, nguồn, phạm vi câu hỏi, completeness và gaps. Page tower chỉ ghi `AVAILABLE` khi context page-local của chính owner đủ và có provenance; direct cross-chat retrieval là optional. Khi thiếu, Human có thể cung cấp explicit read-only handoff do owning Page Chat phát ra; Control Tower xác minh nguồn/scope và giữ handoff là evidence, không phải Product quyết định mới hay Apply authorization. `PARTIAL` chặn quyết định phụ thuộc gap; `UNKNOWN` không có nghĩa không có requirement cũ và không được thay source gần giống. Codex chỉ vào Page Chat khi đúng mode federation, đúng Page tower đã active và Human/workflow cho phép; Bridge v1 vẫn cấm Codex trực tiếp vào Page Chats. Page tower không tự quyết `CROSS_MODULE`/`UNCERTAIN`; Global không thay owning Page Chat cho PAGE_LOCAL. So intent với repository read-only và báo discrepancy theo từng authority. (F2, F3, F11–F13)

### D8. Human Gate, live acceptance và QA

Mọi Human Gate cần exact current-user decision gắn artifact hash, scope và pending command; activation/handoff/role label không phải approval. Side effects cần authorization riêng. Machine block/diagnostic English, cập nhật Human tiếng Việt. Full runtime protocol chỉ nằm trong operating context của đúng tower conversation được duyệt; global Project Instructions chỉ chứa shared rules/routing boundary ngắn, không phát protocol cho Page Chats nói chung. Tracked prompt không tự đồng bộ live. Mỗi instance active cần Human live-context update khi áp dụng, exact conversation verification và fresh valid handshake→command→result→evaluation; static hash không đủ. Nếu live chưa quan sát, `NOT_VERIFIED` và không executable.

QA sau implementation có matrix federation riêng: v1 fallback; Page/Global role/scope/instance; direct PAGE_LOCAL; CROSS_MODULE/UNCERTAIN escalation; concurrent/ambiguous activation; lock/write/crash/old-instance fencing; target mismatch; handoff complete/missing/stale; fresh run/lineage/budget; replay/duplicate/stale/result binding; real delivery uncertainty; Page/Global rotation/restart; Human Gate; page context AVAILABLE/PARTIAL/UNKNOWN/NOT_APPLICABLE; repository discrepancy; live target; Bridge v1 compatibility. Real browser/record evidence phải chứng minh acceptance; configuration/prose-only không thành PASS. `UI_AFFECTING: NO`, Product UI QA `NOT_APPLICABLE`, federated Browser QA `REQUIRED`. (F1, F13, F14)

## Risks / Trade-offs

- **Sensitive Design Gate: TRIGGERED.** Rủi ro gồm split-brain, stale instance/command, replay, lost/incomplete handoff, giả approval, budget reset, scope escalation gián tiếp, privacy của target metadata và record mất sau cleanup. Exclusive lock + intent journal + quiescent transfer giảm rủi ro trên một host; implementation/Browser QA vẫn phải chứng minh. Trước bằng chứng đó, federation không active.
- `tmp/` là ignored workspace; bền qua process restart trên cùng checkout nhưng không qua xóa workspace, đổi host hoặc worktree. Mất record nghĩa là dừng, không tái dựng từ chat. Review/approval/hashes vẫn ở canonical artifacts, không dựa vào `tmp/` làm nguồn authority.
- Record local chứa exact conversation ID/title là metadata nhạy cảm trong giới hạn workspace, không chứa nội dung chat. Cần so exact Human-selected target và UI khi resume. Nếu cần raw transcript, credential, private conversation export, auth/provider control, cross-host distributed lock, destructive operation hoặc protocol extension, `NEEDS_REVIEW` tại gate có thẩm quyền; không giao Tasks tự mở scope.
- Không có bảo đảm rằng ChatGPT có API để atomic deactivate một conversation. Fencing ở đây là quyền thực thi của Codex dưới local lock/epoch, không phải quyền UI của chat. Nếu có một executor khác không theo contract, dừng federation; không báo exclusivity đã chứng minh.

## Migration Plan

Sau Sensitive Design approval riêng: tạo Tasks/TIC với allowlist cho ba implementation owner D2, ignored `tmp/` record và evidence/review artifacts; implement rồi validate static, Human cập nhật từng live conversation, chạy live verification và federated Browser QA; sau đó mới formal VERIFY/Gate 3 theo workflow. Bridge v1 giữ nguyên cho context không kích hoạt federation. Rollback federation bằng fencing/terminal state; không tự bật v1 giữa một run hoặc dùng v1 để giải cứu delivery uncertain. Live conversation rollback cần Human thực hiện riêng. Design này chưa thực hiện bước nào của migration.

## Open Questions

Không còn lựa chọn owner/grammar/activation cơ bản để Tasks tự quyết. Human tại Sensitive Design Gate cần duyệt rõ local single-host boundary, ignored durable record và lock/intent model, quyền Page tower trực tiếp trong mode mới, live update, residual risk khi record mất và QA nghĩa vụ. Nếu các giới hạn này không được chấp nhận, dừng trước Tasks/TIC và sửa Design qua review.
```
