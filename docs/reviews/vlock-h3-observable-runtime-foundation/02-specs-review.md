# Gate 2 — V-LOCK H3 Observable Runtime Foundation

Change: vlock-h3-observable-runtime-foundation  
Gate: 2 — Specs Review  
Review status: AWAITING_HUMAN_REVIEW  
Created: 2026-09-24  
Schema: yuta-spec-driven  
Analysis conclusion: READY_FOR_SPECS  
Sensitive change: YES; `SENSITIVE_DESIGN_GATE = REQUIRED` after Gate 2 approval

## Decision boundary

Gate 1 approved the exact Proposal and Analysis recorded in `01-analysis-review.md`, the bounded objective and the new `repository/vlock-native-tooling` capability. This packet asks for human review of the normal delta Spec below. A PASS from OpenSpec validation is technical evidence, not Gate 2 approval. No Design, Tasks, Apply, runtime/image/observer work, dependency or lockfile change, real graph computation, real V-LOCK, parent continuation or Product Version work is authorized by this packet. If Gate 2 approves these exact Spec bytes, proceed only to Design and its required Sensitive Design Gate under the YUTA workflow.

## Integrity and scope

SHA-256 exact file bytes were calculated with `Get-FileHash -Algorithm SHA256`. Paths are repository-relative and sorted. The review packet's own hash is omitted because it is self-referential.

| Path                                                                                                    | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/vlock-h3-observable-runtime-foundation/.openspec.yaml`                                | `cec1610026e12fc030fd84ede0ac13191bb7557e09b629936f7e73cbed209f3e` |
| `openspec/changes/vlock-h3-observable-runtime-foundation/analysis.md`                                   | `ae33992f46a63c436a76ae309e782b28d6e7bd6ad5edc23f856a3ebcb5e80a80` |
| `openspec/changes/vlock-h3-observable-runtime-foundation/proposal.md`                                   | `a2846ef20519bab20581652e9cb0cefb4f4c853f8f41e03446824996a64ab6b6` |
| `openspec/changes/vlock-h3-observable-runtime-foundation/specs/repository/vlock-native-tooling/spec.md` | `127877b21025fa5c1677b6484c1faf23e7d9a570d1554acfac815e10e3a18b12` |

Only the child change's Gate 1 review status and this child delta Spec/review packet were changed after Gate 1. The existing three dirty parent files were not edited. The parent remains 10/29 with Task 3.3 `BLOCKED / UNCHECKED` and historical H3 smoke `FAIL`; the Product Version change remains `VERIFY: FAIL`, Phase 6 `BLOCKED`. Those records have not been relabeled.

## Gate 1 decision to Spec mapping

| Approved boundary                                               | Delta requirements | Review assessment                                                                                                                                                                                         |
| --------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deterministic H3 extraction; AST semantic direction             | R1–R2              | Exact source/tool identity, semantic closure, raw-byte ranges, canonical serialization/hash and fail-closed ambiguity are observable obligations. Parser owner/version/algorithm remain Design decisions. |
| Narrow safe non-CLI native caller                               | R3–R4              | Caller operations, explicit input/settings provenance, no CLI/install/autofix/registry or ambient config execution; lack of safe exposure blocks.                                                         |
| Identity-bound isolated Linux runtime                           | R5–R6              | All Gate 1 material identity domains are bound; source is read-only and native scratch operations keep normal filesystem semantics.                                                                       |
| Enforcement distinct from truthful observation                  | R6–R7              | Denial and attempted-event evidence are separate; zero attempts needs complete child-tree trace; incomplete coverage fails closed.                                                                        |
| Synthetic proof harness                                         | R8                 | Positive and negative native/observer cases, including reproducible logical evidence, are required without real lock writes or registry resolution.                                                       |
| Stable parent handoff, no authority transfer                    | R9                 | Deterministic identity/evidence record cannot approve parent graph, real V-LOCK or Task 3.3.                                                                                                              |
| Focused non-browser runtime QA                                  | R10                | Executable behavior requires runtime QA distinct from Technical VERIFY; Browser QA is not required and no final QA status is assigned.                                                                    |
| No Product/deployment authority; overall fail-closed acceptance | R11                | Tooling evidence cannot promote Product Version, lifecycle, restaurant runtime, deployment or production; missing mandatory evidence blocks acceptance.                                                   |

The Spec contains 11 requirements and 34 WHEN/THEN scenarios: R1 4, R2 3, R3 3, R4 3, R5 2, R6 3, R7 3, R8 5, R9 3, R10 3, R11 2. It adds only `repository/vlock-native-tooling`; no modified capability or `skip_specs` exception is used. It specifies observable behavior and failure outcomes without choosing an exact parser package, observer asset, image, tracing mechanism, manifest shape or implementation path. No `@yuta/ui` or browser behavior is in scope.

## Explicit non-requirements and authority limits

This child does not build a generic sandbox SDK, resolver, CI runner, security-monitoring platform or production runtime infrastructure. It does not compute the real YUTA graph, approve the parent's exact input/graph closure, run real repository V-LOCK, remediate formatting, modify Product Version, promote Product maturity/lifecycle or authorize deployment/production. No restaurant app behavior or UI is specified. These limits are captured by R8–R11 and remain in force even if the child tooling later passes its own synthetic QA.

## Design decisions deferred to the required sensitive gate

- Parser owner, exact version/bytes and deterministic AST extraction and closure algorithm, including raw-byte fidelity.
- Exact pnpm exports, native asset/loader closure and safe caller input/settings/return contract. If safe exposure is impossible without CLI/install or unreviewed manipulation, Design must stop and return for review.
- Exact digest-bound Linux image/config/platform, Node/pnpm/parser/observer/library supply, sanitized environment, command and mount topology.
- Observer mechanism and complete attempted-event coverage, including path/descriptor attribution, denial, lost/truncated trace detection and deliberate negative tests. Configuration-only enforcement is insufficient observation.
- Focused non-browser runtime QA cases and evidence, separately from Technical VERIFY. Gate 1 approved applicability only, not a final QA result.
- A dependency declaration that changes `pnpm-lock.yaml` requires separate review before mutation; Design permission to propose a supplied observer or different image does not authorize obtaining or building one.

No controlling-source conflict is identified at this Spec gate. The exact parser/version/owner, native caller feasibility, runtime/observer supply and full observation mechanics remain unresolved Design decisions; they are not limitations accepted as PASS.

## Actual validation evidence

| Check                                                                                                                              | Result                       | Meaning                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| `openspec instructions specs --change vlock-h3-observable-runtime-foundation --json`                                               | exit 0                       | Normal delta Spec path and structural requirements obtained.              |
| `openspec validate vlock-h3-observable-runtime-foundation --strict --no-interactive`                                               | exit 0: change is valid      | Current child artifact structure and delta syntax pass strict validation. |
| `pnpm exec prettier --check openspec/changes/vlock-h3-observable-runtime-foundation/specs/repository/vlock-native-tooling/spec.md` | exit 0                       | Scoped Spec formatting passes.                                            |
| `pnpm docs:check`                                                                                                                  | exit 0, 36 current documents | Current documentation check passes.                                       |
| `pnpm architecture:check`                                                                                                          | exit 0                       | Repository architecture check passes.                                     |

No code, runtime, image, observer or dependency was implemented. No runtime synthetic test, recursive typecheck, build, Browser QA or focused non-browser runtime QA was run. Recursive typecheck is deferred for this planning-only gate because its generated Next prerequisite and exclusive checkout would create effects outside this Spec review. No QA status is claimed. The root validation commands above do not establish native feasibility or complete observation.

## Gate 2 review request

Approve or request changes to the exact delta Spec snapshot below. Approval authorizes Design only, with `SENSITIVE_DESIGN_GATE = REQUIRED` before Tasks/Apply. Review these exact questions:

1. Do R1–R2 adequately require deterministic, byte-provenant H3 extraction and canonical identity without selecting a parser implementation?
2. Do R3–R4 bind a safe non-CLI native caller and its effective inputs/settings, with fail-closed behavior when safe exposure is unavailable?
3. Do R5–R7 correctly require exact Linux runtime identity, external isolation, and truthful complete attempted-event observation separate from enforcement?
4. Do R8 and R10 cover synthetic positive/negative proof and focused non-browser runtime QA separately from Technical VERIFY, without assigning a final QA result?
5. Do R9 and R11 preserve parent Task 3.3, real graph/input approval, Product Version, lifecycle and deployment authority outside this child?
6. May the deferred parser, caller, runtime, observer and QA decisions proceed to Design under the required Sensitive Design Gate, subject to separate review before any dependency change affecting `pnpm-lock.yaml`?

Until that human decision, workflow status is `AWAITING_HUMAN_REVIEW` at Gate 2 even though raw OpenSpec status reports Design as ready.

## Exact delta Spec

<!-- prettier-ignore -->
````markdown
## Purpose

Định nghĩa hành vi tooling nội bộ có thể kiểm chứng để trích xuất H3 từ nguồn pnpm đã ràng buộc, gọi native logic an toàn trong runtime Linux cô lập, quan sát đầy đủ side-effect attempts và bàn giao bằng chứng synthetic cho change tiêu thụ mà không tự chấp nhận lockfile/graph repository thật.

## ADDED Requirements

### Requirement: R1 Nguồn và công cụ H3 có identity chính xác

Foundation SHALL chỉ nhận pnpm source/bundle, parser và extractor khi exact bytes cùng identity của từng thành phần khớp binding đã được review. Cùng input và cùng thuật toán SHALL tạo cùng kết quả và identity H3; version label hoặc local path đơn lẻ SHALL NOT là bằng chứng identity. H3 output SHALL có canonical serialization, stable hash và inventory của exact source, extracted assets, caller/export, loader closure cùng gaps/errors. Unresolved required field SHALL ngăn approved H3 identity; mọi drift, thiếu hoặc identity không thể xác minh MUST fail closed, không silent refresh.

#### Scenario: R1.1 Cùng nguồn tạo cùng identity

- **WHEN** cùng exact pnpm source, parser, extractor và selection contract được cung cấp hai lần
- **THEN** foundation SHALL trả cùng asset inventory, canonical output và H3 composite identity

#### Scenario: R1.2 Source hoặc tool drift

- **WHEN** bất kỳ source, parser hoặc extractor byte nào khác binding đã review dù version label không đổi
- **THEN** foundation SHALL báo thành phần drift và MUST NOT xuất kết quả H3 được chấp nhận

#### Scenario: R1.3 Identity thiếu

- **WHEN** một material source/tool không có exact identity hoặc chỉ có tag/path không đủ authority
- **THEN** foundation SHALL fail closed trước khi dùng output của thành phần đó

#### Scenario: R1.4 Canonical output và unresolved field

- **WHEN** asset inventory được tạo từ exact source với caller/export và loader closure đã xác minh
- **THEN** canonical serialization và stable hash SHALL tái lập không phụ thuộc thứ tự phát hiện; missing hoặc unresolved required field SHALL xuất gap/error và MUST NOT có approved H3 identity

### Requirement: R2 Semantic extraction có closure và raw-byte fidelity

Foundation SHALL chọn duy nhất các native asset cần cho caller đã review theo semantic anchors từ exact bound source, đóng đầy đủ transitive assets/loader dependencies, và ghi exact raw source ranges, hashes và output inventory. Emitted asset bytes SHALL khớp các source ranges đã ghi; foundation MUST NOT thay hoặc sửa thủ công native semantics để làm closure PASS. Ambiguous anchor/export, overlap không nhất quán, missing dependency, incomplete closure hoặc raw mismatch MUST fail closed.

#### Scenario: R2.1 Closure đầy đủ

- **WHEN** toàn bộ semantic anchors và dependencies của native caller được xác định duy nhất từ exact source
- **THEN** output SHALL liệt kê toàn bộ selected assets, source ranges, raw hashes, emitted hashes và loader dependencies cần thiết

#### Scenario: R2.2 Ambiguous selection

- **WHEN** một module anchor, symbol hoặc export khớp nhiều selection hợp lệ hoặc không có selection hợp lệ
- **THEN** extraction SHALL FAIL với affected anchor và MUST NOT tự chọn một candidate

#### Scenario: R2.3 Closure hoặc byte mismatch

- **WHEN** dependency chưa được giải quyết, range chồng lấn mâu thuẫn hoặc emitted bytes khác exact source slice
- **THEN** extraction SHALL FAIL và MUST NOT phát hành H3 identity hợp lệ

### Requirement: R3 Caller pnpm-native an toàn, không khởi chạy CLI/install

Foundation SHALL cung cấp một caller giới hạn cho native read/project, frozen-consistency và scratch-roundtrip obligations đã review, với exact caller/export/loader identity, argument schema, settings schema và return/error contract tường minh. Caller MUST NOT khởi động pnpm CLI, install/update commands, scripts, registry/dependency resolution, repair hoặc ambient store/config execution. Nếu exact pnpm internals không thể được expose an toàn mà không đổi native semantics hoặc dùng manipulation chưa review, caller SHALL fail closed thay vì dùng đường CLI.

#### Scenario: R3.1 Native call hợp lệ

- **WHEN** approved caller nhận input và settings hợp lệ trong reviewed closure
- **THEN** caller SHALL trả native result và evidence của đúng operation được yêu cầu, không đi qua CLI/install path

#### Scenario: R3.2 Không có safe export

- **WHEN** native asset/loader không thể expose operation cần thiết mà không kích hoạt CLI/install hoặc sửa native semantics
- **THEN** caller SHALL báo unsupported/blocking reason và MUST NOT chạy fallback CLI

#### Scenario: R3.3 Autofix hoặc resolution bị yêu cầu

- **WHEN** input hoặc caller path đòi conflict autofix, package resolution hay source repair
- **THEN** caller SHALL từ chối operation, không sửa source hay lấy dữ liệu từ registry/store

### Requirement: R4 Input và effective settings của caller được ràng buộc

Mỗi invocation SHALL nhận closed input-path và settings record với provenance đủ để phân biệt giá trị explicit, recorded, runtime default và absence cho các field caller thực sự tiêu thụ. Foundation SHALL kiểm tra schema và binding trước invocation, bảo toàn native parsed values cần cho consumer, và MUST NOT chạy pnpmfile/config JavaScript để suy diễn giá trị. Missing, conflicting, unsupported hoặc environment-derived value không được approved MUST block native consistency result; child SHALL NOT tự chốt effective YUTA repository settings thay parent.

#### Scenario: R4.1 Settings đầy đủ

- **WHEN** mọi caller-material field có value/provenance hợp lệ và input paths nằm trong reviewed closure
- **THEN** caller SHALL so sánh/ghi native outcome cùng identity của settings và inputs đã sử dụng

#### Scenario: R4.2 Settings không xác định

- **WHEN** caller-material field thiếu, mâu thuẫn hoặc chỉ suy ra từ ambient configuration
- **THEN** invocation SHALL FAIL với affected field, không thay bằng guessed default

#### Scenario: R4.3 Config code không được chạy

- **WHEN** effective value chỉ có thể lấy bằng thực thi pnpmfile hoặc config JavaScript chưa review
- **THEN** foundation SHALL báo unresolved input và MUST NOT thực thi code đó

### Requirement: R5 Runtime và supply identity tái lập

Foundation SHALL bind và kiểm tra các material runtime domains trước khi gọi native code: Linux image/index/platform manifest/config, platform, Node executable, pnpm source, extractor/parser, native assets/loader, observer và material libraries, sanitized environment, command và mount topology. Changed hoặc incomplete identity SHALL tạo candidate cần review mới, không tự rebaseline hoặc kế thừa approval của host/OS khác.

#### Scenario: R5.1 Runtime khớp binding

- **WHEN** tất cả material runtime bytes, platform, command, environment và mounts khớp reviewed binding
- **THEN** foundation SHALL ghi exact runtime identity trong execution evidence

#### Scenario: R5.2 Runtime drift

- **WHEN** image, Node, parser, observer, library, command, environment hoặc mount khác binding
- **THEN** execution SHALL block với affected domain và MUST NOT dùng tag/version tương tự làm thay identity

### Requirement: R6 External isolation giữ nguồn chỉ đọc và scratch thuộc quyền

Native operation SHALL chỉ đọc reviewed source/input và SHALL chỉ ghi vào owned scratch theo reviewed paths; real repository `pnpm-lock.yaml` MUST NOT là write target. Runtime SHALL chặn network access, registry/store dependency, host socket, subprocess escape và unexpected/source writes. Prohibited attempt SHALL làm aggregate execution FAIL dù enforcement đã từ chối access. Native scratch open/write/fsync/rename/cleanup SHALL vận hành với filesystem semantics bình thường; foundation MUST NOT stub writer/fsync để tạo PASS. Denial và PRE/POST source integrity SHALL được ghi riêng với evidence quan sát attempt.

#### Scenario: R6.1 Scratch roundtrip hợp lệ

- **WHEN** native writer cần tạo temporary file, fsync, rename và cleanup trong owned scratch
- **THEN** runtime SHALL cho phép các event đúng phạm vi và giữ reviewed source bytes không đổi

#### Scenario: R6.2 Ghi ngoài scratch

- **WHEN** child hoặc descendant thử ghi repository source, runtime root hoặc path ngoài owned scratch
- **THEN** isolation SHALL chặn attempt và evidence SHALL chỉ ra attempted target cùng outcome

#### Scenario: R6.3 Network/store attempt

- **WHEN** child hoặc descendant thử dùng network, registry hoặc mutable store ngoài reviewed input closure
- **THEN** isolation SHALL chặn access và evidence SHALL ghi attempt, không coi denial là zero attempt

### Requirement: R7 Observation phải chứng minh cả attempts và native scratch events

Foundation SHALL tạo evidence hoàn chỉnh cho child/subprocess attempts, network attempts, registry/store access attempts, unexpected/source write attempts và native scratch write/fsync/rename/cleanup events, gồm denied attempts. Observation SHALL bao phủ complete child tree và nhận diện path/descriptor đủ để quy event về đúng boundary. Enforcement configuration, absence of visible error hoặc counter khởi tạo bằng zero MUST NOT được báo là proof của zero attempts. Missing, truncated, timed-out hoặc không thể quy thuộc observation SHALL fail closed.

#### Scenario: R7.1 Zero attempts có proof hoàn chỉnh

- **WHEN** run kết thúc với complete observation coverage và không có prohibited attempt
- **THEN** evidence SHALL báo zero cho từng prohibited class cùng coverage/trace integrity, tách biệt với enforcement result

#### Scenario: R7.2 Denied attempt vẫn được thấy

- **WHEN** một deliberate prohibited attempt bị isolation từ chối
- **THEN** observation SHALL ghi attempt và denial; kết quả MUST NOT là zero cho class đó

#### Scenario: R7.3 Trace không hoàn chỉnh

- **WHEN** child/descendant event, descriptor/path mapping hoặc trace bytes không thể kiểm tra đầy đủ
- **THEN** foundation SHALL FAIL evidence thay vì khẳng định isolation PASS

### Requirement: R8 Synthetic proof kiểm tra cơ chế mà không dùng lock repository thật

Foundation SHALL cung cấp synthetic input và positive/negative cases đủ để chứng minh native parse, normal scratch write/fsync/rename/cleanup, reread, settings/importer behavior, fail-closed malformed/conflicted/incompatible input, và khả năng phát hiện deliberate process/network/forbidden-write attempts. Cùng approved tooling/runtime/input identities SHALL cho reproducible synthetic result và logical evidence; thay đổi material identity SHALL vô hiệu hóa dependent evidence, không silent refresh. Synthetic run MUST NOT dùng real `pnpm-lock.yaml` làm write target, sửa repository source hoặc resolve packages từ registry. Synthetic PASS SHALL NOT là approval của real YUTA graph, lock hoặc parent Task 3.3.

#### Scenario: R8.1 Positive native roundtrip

- **WHEN** synthetic valid lock và complete synthetic context được chạy trong reviewed runtime
- **THEN** native parse, scratch write/fsync/rename, reread và expected semantic comparison SHALL PASS với complete observation và source PRE/POST equality

#### Scenario: R8.2 Malformed và incompatible negatives

- **WHEN** synthetic lock malformed, conflicted hoặc incompatible được đưa vào caller
- **THEN** operation SHALL fail closed không autofix, install hoặc source mutation

#### Scenario: R8.3 Importer/settings negatives

- **WHEN** synthetic importer/specifier hoặc caller-material settings không khớp native obligation
- **THEN** native result SHALL báo mismatch và synthetic aggregate MUST NOT PASS

#### Scenario: R8.4 Observer negatives

- **WHEN** synthetic child cố tình spawn, connect hoặc ghi forbidden path
- **THEN** evidence SHALL phân biệt attempted event, denial và expected negative outcome cho từng class

#### Scenario: R8.5 Reproducible synthetic evidence

- **WHEN** synthetic run được lặp lại với cùng exact approved tooling, runtime, inputs và expected outcomes
- **THEN** logical result và evidence SHALL đối chiếu tương đương; material identity drift SHALL vô hiệu hóa prior evidence thay vì silent refresh

### Requirement: R9 Handoff contract không tự cấp parent approval

Foundation SHALL bàn giao một closed, deterministic record của source/tool/parser/caller/runtime/observer identities, selected assets, invocation input/settings schema, synthetic results, observation completeness, failures/gaps, tooling contract/version và output identities. Consumer SHALL có thể phát hiện stale/missing/unsupported fields; changed material identity SHALL vô hiệu hóa handoff cũ. Handoff MUST NOT chứa hoặc tự phê duyệt real YUTA input closure, resolved graph identity, graph/input approval, real V-LOCK PASS hay Task 3.3 completion. Child completion SHALL NOT hoàn tất hoặc phê duyệt parent Task 3.3; parent giữ riêng quyền exact input/graph approval và real repository execution.

#### Scenario: R9.1 Handoff hợp lệ

- **WHEN** mọi foundation requirement và synthetic proof có complete evidence
- **THEN** record SHALL cung cấp các identities/results cần để parent review độc lập mà không tự đánh dấu parent PASS

#### Scenario: R9.2 Stale hoặc partial handoff

- **WHEN** material identity đổi hoặc required evidence/gap field thiếu, partial hay unsupported
- **THEN** handoff SHALL FAIL validation và MUST NOT biểu diễn child output như approved real-lock evidence

#### Scenario: R9.3 Parent graph không thuộc child

- **WHEN** consumer yêu cầu child tự tính/chấp nhận real repository resolved graph hoặc thực hiện real V-LOCK
- **THEN** child SHALL từ chối operation và giữ quyền quyết định/execution ở parent change

### Requirement: R10 Focused runtime QA tách khỏi Technical VERIFY

Executable behavior của foundation SHALL có focused non-browser runtime QA dimension riêng với Technical VERIFY, bao gồm native caller, scratch semantics, enforcement và attempted-event observation trên positive/negative synthetic cases. `BROWSER_QA_REQUIRED = NO` cho capability không có UI. Spec này SHALL NOT ấn định final QA status; thiếu, blocked hoặc failed required runtime QA evidence MUST NOT được diễn giải thành QA PASS. Technical VERIFY result SHALL được ghi riêng và SHALL NOT thay thế QA evidence.

#### Scenario: R10.1 Runtime QA hoàn chỉnh

- **WHEN** executable candidate được đánh giá sau implementation
- **THEN** focused non-browser QA SHALL ghi actual runtime outcomes và evidence cho positive/negative cases, tách khỏi Technical VERIFY mapping

#### Scenario: R10.2 QA evidence thiếu hoặc blocked

- **WHEN** required runtime QA case chưa chạy, bị blocked hoặc evidence không đầy đủ
- **THEN** QA SHALL giữ truthful status và MUST NOT được báo PASS vì OpenSpec validation hoặc Technical VERIFY PASS

#### Scenario: R10.3 Browser QA applicability

- **WHEN** QA plan đánh giá capability tooling không có UI/browser flow này
- **THEN** plan SHALL ghi `BROWSER_QA_REQUIRED = NO` mà không loại bỏ focused runtime QA

### Requirement: R11 Tooling không cấp Product hoặc deployment authority

Foundation SHALL chỉ cung cấp repository tooling và synthetic evidence. H3, native caller, runtime hoặc QA result SHALL NOT cấp quyền thay đổi Product maturity/lifecycle, Product Version, restaurant runtime behavior, deployment hoặc production readiness. Missing identity, closure, safe caller, runtime/observer binding, required observation hoặc synthetic evidence MUST block acceptance; known limitation SHALL NOT được chuyển thành bằng chứng thành công.

#### Scenario: R11.1 Consumer yêu cầu authority ngoài tooling

- **WHEN** một consumer diễn giải handoff hoặc synthetic PASS thành Product Version promotion, restaurant runtime change, deployment hay production approval
- **THEN** foundation SHALL từ chối claim đó và chỉ cung cấp bounded tooling evidence

#### Scenario: R11.2 Required evidence thiếu hoặc mơ hồ

- **WHEN** source, extractor/parser, asset closure, caller, runtime, observer, attempted-event observation hoặc synthetic proof thiếu hay không xác minh được
- **THEN** aggregate foundation acceptance SHALL FAIL và SHALL giữ limitation/uncertainty tường minh
````
