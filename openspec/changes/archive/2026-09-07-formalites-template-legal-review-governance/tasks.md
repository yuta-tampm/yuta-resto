# Tasks / Implementation Plan

Change: `formalites-template-legal-review-governance`.
Schema: `yuta-spec-driven`.
Planning review status: `APPROVED`.
Gate 1 / Gate 2 / Gate 2b: `APPROVED`, với integrity-only rebaseline do current user duyệt.
Apply: `AUTHORIZED — DOCUMENTARY CONFORMANCE ONLY`. Production: `NOT_AUTHORIZED`.

Đây là kế hoạch documentary conformance, không phải software implementation.
Các premises/results trong approved planning tables bên dưới là expected verification
targets, không là completed review, test PASS, published template hay legal opinion.
Không có unresolved Design question ảnh hưởng bounded delivery; các future
privacy/persistence decisions không được chuyển thành task implementation.

## 1. Integration / Regression

### Phase applicability and execution boundary

Chỉ phase này được dùng, cho documentary verification và preservation checks.

| Phase                    | Applicability                 | Rationale                                                                                             |
| ------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| Foundation / Data        | NOT_APPLICABLE                | Không schema, migration, persistence, data model hoặc template resource.                              |
| Service / Domain         | NOT_APPLICABLE                | Không evaluator, service, repository/API, runtime hoặc lifecycle implementation.                      |
| UI / Components          | NOT_APPLICABLE                | Không UI, rendering, Platform Admin app hoặc page-pack change.                                        |
| Interaction / States     | NOT_APPLICABLE                | Không interaction, executable state machine hay publication orchestration.                            |
| Integration / Regression | APPLICABLE — documentary only | Traceability, symbolic counterexamples, authority compatibility, source integrity và truthful checks. |

`UI_AFFECTING: NO`. `BROWSER_QA_REQUIRED: NO`.
Planned QA classification: `NOT_APPLICABLE`, phải được xác nhận lại bằng final
path/diff evidence rằng không có user-facing/runtime dimension. Không tạo Browser
QA, screenshots hoặc mock resources để lấp phase không áp dụng.

### TECHNICAL IMPLEMENTATION CONTRACT — IR

Repository/root: `D:/working/yuta/yuta-resto`; nearest instructions cho
`openspec/changes` và `docs/reviews` là root `AGENTS.md`; không có nested
`AGENTS.md` trong hai subtree khi inventory. `packages/auth/AGENTS.md` áp dụng
cho việc kiểm tra compatibility của auth package, không cho phép edit package.

Canonical owner: Formalités sở hữu legal-template governance semantics;
Identity / Access sở hữu existing operation authority; Platform Admin chỉ là
future internal access/runtime boundary. Change review evidence không thay thế
canonical Product Knowledge, normative main specs hoặc external human opinion.

Affected boundary: chỉ documentary governance/verification; security, tenant,
runtime và data boundaries được bảo vệ không đổi. Không có affected executable
package, runtime, database hoặc transport contract.

Authorities đã đối chiếu: approved [Proposal](proposal.md), [Analysis](analysis.md),
[Specs](specs/formalites/template-legal-review-governance/spec.md), [Design](design.md)
D1–D8; root `AGENTS.md`; `docs/README.md`; `docs/AUTHORITY_MODEL.md`;
`docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`;
`docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`;
`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`; `docs/YUTA_QA_PROTOCOL.md`;
`docs/operations/PRODUCTION_READINESS.md`;
`docs/features/personnel/README.md`; `docs/features/identity-access/README.md`;
`docs/architecture/IDENTITY_AND_MEMBERSHIP.md`; `docs/CURRENT_STATE.md`;
`docs/MODULE_REGISTRY.md`; existing normative authorization spec trong protected
table. Các nguồn được route theo question type, không lấy code làm Product/legal approval.

| Contract item | Constraint / authoritative source                                    | Required evidence after authorized Apply/Verify                                                                                                                                               |
| ------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IR1           | Design D1/D8; workflow integrity protocol; approved packets          | Exact artifact inventory/hash equality, attributable allowlist diff, 13 requirements/32 unique scenarios, không thiếu/đổi title hoặc mệnh đề WHEN/THEN/AND.                                   |
| IR2           | R1; Design D5; existing authorization main spec và auth source/tests | Exact five-operation set và explicit grants giữ nguyên; support/tenant-only/missing/disabled/unknown denied; no inheritance/caller policy/context merge.                                      |
| IR3           | R2/R3; Design D2/D5                                                  | External accountable person + evidenced authority/competence; author/source/content/envelope binding riêng; no YUTA account requirement; missing evidence fail closed.                        |
| IR4           | R4/R5/R6; Design D3/D4                                               | Three outcomes only; mọi qualification premise cùng đạt; conditions/effective dates/envelope được giữ; allow hoặc review alone không thành completion.                                        |
| IR5           | R7; Design D4/D5                                                     | Reviewer khác publisher về người thật, không chỉ label; recorder có thể là publisher; no independent evidence CRUD hoặc sixth operation; atomicity chỉ là result invariant.                   |
| IR6           | R8/R9; Design D6                                                     | Content OR applicability change → new version/new review; supersession giữ historical attribution, không automatic qualification/republication; retirement chặn future use.                   |
| IR7           | R10/R11; Design D7; Production Readiness                             | Exact bounded phrase/qualifier; no certification/guarantee; không actual/private evidence trong Git; privacy/retention là prerequisite trước processing/persistence, không invented duration. |
| IR8           | R12; Design D7; authorization audit requirement                      | Ba audit families khác meaning/attribution; security signal không chứng minh legal review/publication và không chứa legal content.                                                            |
| IR9           | R13; Design D1/D8; normativity/workflow protocols                    | No code/runtime/schema/API/UI/provider/upload/generation; no canonical Knowledge/lifecycle edit; không production hoặc main-spec promotion.                                                   |
| IR10          | Root/auth validation instructions; workflow VERIFY/QA                | Actual commands/exit/output và skipped checks; scoped format/diff; unrelated failures attributed bằng baseline; QA rationale; no documentary PASS-as-runtime claim.                           |

### Intended files and stop boundary

Trong planning turn, chỉ tạo file này và refresh integrity records trong ba
existing review packets. Proposal/Analysis/Specs/Design không được sửa.

Sau **separate explicit Apply authorization**, documentary delivery chỉ được
update progress/evidence trong file này và hoàn thiện existing workflow review
evidence tại `docs/reviews/formalites-template-legal-review-governance/03-final-review.md`
khi Gate 3 đạt readiness. Không tạo artifact type mới, verification script/package,
fixture, real template, example legal opinion hoặc separate standalone report.
Trong quá trình kiểm chứng, task completion evidence được ghi change-local ở file
này; Gate 3 sẽ tham chiếu exact path/hash và chứa final Technical Compliance Matrix,
TECHNICAL VERIFY và QA sections. Không tạo ready Gate 3 trước đủ evidence.

Runtime/source/canonical paths có thể **read/check**, không được edit. Muốn thêm
delivery path hoặc sửa approved artifact phải STOP để review scope trước; không
dùng formatter để normalize canonical files. Shared dirty checkout không phải
fresh source baseline: capture exact tracked/untracked nonignored path/hash set
và `git status --short` trước Apply; unknown reviewed drift STOP, unrelated work
giữ nguyên. Trước Apply kiểm tra `03-final-review.md` vẫn absent hoặc có separately
reviewed provenance; không overwrite một file được task khác tạo.

### Ordered tasks and completion criteria

- [x] 1.1 Capture fresh pre-Apply inventory/status, recheck all current Gate 1/2/2b references và protected hashes; ghi exact allowlist/baseline. Verify: mọi approved pair khớp, không unexpected artifact/path, không canonical/source drift bị nhận làm implementation.
- [x] 1.2 Kiểm chứng documentary rows R1–R2/S01–S05 về global authority và reviewer. Verify: exact spec premises/consequences được đối chiếu; five operations/support denial/no account/no tenant merge được chứng minh bằng references và compatibility evidence, không gọi publication.
- [x] 1.3 Kiểm chứng rows R3–R4/S06–S10 về evidence và applicability. Verify: missing/unknown/source mismatch/checksum mismatch/condition/effective-date cases giữ non-eligible outcome, content checksum không bị xem là reviewer authenticity.
- [x] 1.4 Kiểm chứng rows R5–R7/S11–S20 về three outcomes, qualification và attribution/linkage. Verify: conjunction không thiếu premise; reviewer != publisher, recorder có thể = publisher; no fourth outcome/sixth operation/standalone CRUD; no transaction/orchestration mechanism.
- [x] 1.5 Kiểm chứng rows R8–R9/S21–S24 về version evolution/history. Verify: content hoặc envelope đổi đều new version/new review; superseded/retired/inapplicable evidence không hỗ trợ current use, historical meaning được giữ, không automatic republication.
- [x] 1.6 Kiểm chứng rows R10–R13/S25–S32 về wording/privacy/audit/exclusions. Verify: exact wording qualifier và negative claims; deferred retention không authorize processing; ba audit families riêng; không scope/lifecycle/Knowledge promotion.
- [x] 1.7 Tổng hợp documentary conformance 13/13 requirements và 32/32 scenarios; thực chạy required checks bên dưới và lập Technical Compliance Matrix IR1–IR10. Verify: mỗi row có authoritative source → exact documentary evidence → actual check/result PASS/FAIL; unknown không được ghi PASS; failures ngoài scope có attribution.
- [x] 1.8 Recheck final protected hashes/path-set và scoped diff; kết luận QA applicability và prepare Gate 3 packet chỉ khi đủ technical evidence. Verify: exact delivery hashes, exact final SHA-256 của `openspec/changes/formalites-template-legal-review-governance/tasks.md` chứa completed documentary evidence và exact final SHA-256 của `docs/reviews/formalites-template-legal-review-governance/03-final-review.md` chứa Technical Compliance Matrix, TECHNICAL VERIFY và QA sections; không tạo `verify-evidence.md` hoặc standalone evidence artifact khác; no unauthorized source drift, truthful QA NOT_APPLICABLE rationale, mọi task có evidence và STOP Gate 3 với Sync authorization PENDING; không sync/archive/deploy.

Dependency order: 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 → 1.8.
Task numbering chỉ là documentary delivery units, không tạo service/lifecycle phases.

### Exact requirement mapping — planned coverage, not execution results

R1–R13 và S01–S32 là local traceability labels theo thứ tự approved delta; không
đổi normative identifiers/titles. Mọi exact title phải so sánh với approved spec,
không chỉ so số lượng. Evidence sau Apply phải cover cả các mệnh đề requirement
không lặp đầy đủ trong scenario narrative.

| Label | Exact requirement title                                             | Scenarios | Task | Design / contract |
| ----- | ------------------------------------------------------------------- | --------- | ---- | ----------------- |
| R1    | Global governance giữ nguyên ownership và authorization boundary    | S01–S03   | 1.2  | D1/D5; IR2        |
| R2    | Reviewer external có identity và evidenced authority phù hợp        | S04–S05   | 1.2  | D2/D5; IR3        |
| R3    | Minimum evidence ràng buộc đúng immutable version và review         | S06–S08   | 1.3  | D2/D4; IR3        |
| R4    | Applicability envelope và binding conditions được bảo toàn          | S09–S10   | 1.3  | D3/D4; IR4        |
| R5    | Review outcomes có đúng ba semantic kết quả                         | S11–S13   | 1.4  | D3; IR4           |
| R6    | Qualification yêu cầu đủ review và completed authorized publication | S14–S16   | 1.4  | D4; IR4           |
| R7    | Recorder và publisher không trở thành external opinion author       | S17–S20   | 1.4  | D4/D5; IR5        |
| R8    | Content hoặc applicability change cần version mới và new review     | S21–S22   | 1.5  | D6; IR6           |
| R9    | Supersession và retirement không ghi đè historical evidence         | S23–S24   | 1.5  | D6; IR6           |
| R10   | Legal wording chỉ mô tả bounded template qualification              | S25–S26   | 1.6  | D7; IR7           |
| R11   | Private evidence và retention prerequisites đứng trước persistence  | S27–S28   | 1.6  | D7; IR7           |
| R12   | Ba audit families giữ semantics riêng biệt                          | S29–S30   | 1.6  | D7; IR8           |
| R13   | Governance contract không triển khai excluded capabilities          | S31–S32   | 1.6  | D1/D8; IR9        |

### Symbolic premises and expected governance outcomes

Ký hiệu narrative: A = external reviewer, B = internal publisher, C = recorder,
V = immutable version, H = content checksum, E = reviewed envelope, U = declared
use. Đây không phải dữ liệu thật, representation/algorithm, objects, enum,
executable predicate hoặc API input. A != B nghĩa là evidence xác lập hai người
khác nhau; hai labels tự chúng không chứng minh điều đó. Không chọn cách identity
matching hoặc checksum canonicalization.

Mỗi future evidence row phải giữ exact title dưới đây, full WHEN/THEN/AND mapping,
symbolic premises, expected vs assessed result, rationale, source section/hash và
PASS/FAIL cho **documentary conformance only**. Chưa có assessed result trong planning.

| ID / requirement | Exact scenario title                                           | Symbolic premise                                                                                                                                                        | Expected governance outcome                                                                                                |
| ---------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| S01 / R1         | Internal publisher không có restaurant membership              | B là trusted active YUTA_ADMIN, exact publish request, không membership.                                                                                                | Evaluate exact publish grant; không deny vì thiếu membership; mọi domain premise vẫn bắt buộc.                             |
| S02 / R1         | Support hoặc restaurant-only actor yêu cầu publication         | B là support hoặc membership-only, không granted system authority.                                                                                                      | Deny publication; evidence tốt/tenant permission không bù missing authority.                                               |
| S03 / R1         | Global allow không cấp tenant access hoặc additional operation | Global allow nhưng request tenant resource hoặc operation khác.                                                                                                         | Global grant không authorize; tenant authorization độc lập tiếp tục bắt buộc.                                              |
| S04 / R2         | Accepted external reviewer không có YUTA account               | A có identity, evidenced authority/competence, dated exact-scope confirmation; không account.                                                                           | Xét review theo evidence/domain premises; không tạo/yêu cầu YUTA role/account.                                             |
| S05 / R2         | Reviewer identity hoặc authority không được chứng minh         | Chỉ firm/title hoặc thiếu authority/competence evidence của A.                                                                                                          | Review không eligible; YUTA_ADMIN không tự chứng nhận legal competence.                                                    |
| S06 / R3         | Complete evidence khớp exact version                           | Required evidence đầy đủ, external confirmation bind V/H/E.                                                                                                             | Có thể xét cùng outcome/authority/prerequisites; completeness alone không publication/qualification.                       |
| S07 / R3         | Missing evidence hoặc mismatched checksum                      | Thiếu field, không đối chiếu source, hoặc review khác V/H.                                                                                                              | Không qualified/successfully published; similarity/internal assurance không thay exact binding.                            |
| S08 / R3         | Checksum có nhưng opinion author chưa xác thực                 | H khớp nhưng A/authority/confirmation chưa chứng minh.                                                                                                                  | Không eligible; content identity không là opinion authenticity.                                                            |
| S09 / R4         | Declared use ngoài envelope hoặc chưa xác định                 | U ngoài E/effective dates hoặc thiếu applicability facts.                                                                                                               | Không qualified cho U; publication cũ không mở envelope.                                                                   |
| S10 / R4         | Binding condition chưa được đáp ứng                            | APPROVED trong E nhưng binding condition chưa đạt cho U.                                                                                                                | Deny qualification; không bỏ condition để allow.                                                                           |
| S11 / R5         | Approved review có conditions trong envelope hiện tại          | A chấp nhận V; conditions nằm trong E, không sửa version.                                                                                                               | APPROVED; mọi condition vẫn là premise, không outcome thứ tư.                                                              |
| S12 / R5         | Reviewer yêu cầu chỉnh sửa                                     | Cần sửa content/applicability hoặc condition chưa biểu đạt trong E.                                                                                                     | CHANGES_REQUIRED, chưa qualified; new version/new review sau thay đổi.                                                     |
| S13 / R5         | Review bị rejected hoặc outcome không hợp lệ                   | REJECTED, missing, unknown hoặc APPROVED_WITH_CONDITIONS.                                                                                                               | Không qualification/publication từ outcome đó; không silent map thành APPROVED.                                            |
| S14 / R6         | Mọi qualification prerequisites được thỏa mãn                  | V/H immutable, accepted completed APPROVED review, complete bound evidence; U/E/conditions/dates đạt; current review, successful authorized publication, V non-retired. | Qualified chỉ cho U/reviewed scope; không guarantee final contract hoặc input correctness.                                 |
| S15 / R6         | Authorization allow nhưng publication chưa hoàn thành          | Publish allow, nhưng chưa domain completion hoặc bất kỳ premise thiếu.                                                                                                  | Authorization alone không tạo published/qualified result.                                                                  |
| S16 / R6         | Completed review chưa được publication                         | APPROVED/evidence đầy đủ, chưa successful authorized publication.                                                                                                       | Không tự qualified use.                                                                                                    |
| S17 / R7         | Recorder đồng thời là authorized publisher                     | C = B, A != B được chứng minh, attribution và mọi domain premise đạt.                                                                                                   | C = B không ngăn publication; opinion vẫn của A.                                                                           |
| S18 / R7         | Publisher cũng là reviewer hoặc sửa external opinion           | A = B hoặc B sửa outcome/conditions/opinion để đạt qualification.                                                                                                       | Deny publication/qualification.                                                                                            |
| S19 / R7         | Evidence linkage thất bại                                      | Publish authority hợp lệ, evidence không bind được V.                                                                                                                   | Không successful publication/qualification; all-or-nothing về result, không chọn transaction.                              |
| S20 / R7         | Caller yêu cầu independent evidence management                 | Standalone evidence create/read/update/delete/approval request.                                                                                                         | Capability không cung cấp; submit/publish không suy ra CRUD.                                                               |
| S21 / R8         | Nội dung thay đổi dù được xem là nhỏ                           | Canonical content của reviewed V đổi.                                                                                                                                   | New V/new checksum/new review; không kế thừa approval dù minor change.                                                     |
| S22 / R8         | Applicability thay đổi nhưng content giữ nguyên                | E mở/thu hẹp/đổi, content bytes và H giữ nguyên.                                                                                                                        | New V/new review; H giống không cho kế thừa qualification.                                                                 |
| S23 / R9         | Review mới supersede review đã approved                        | New review explicitly supersedes prior approved review cho V.                                                                                                           | Giữ historical author/outcome/version; prior không current basis; new review phải đạt đủ publication premises dù APPROVED. |
| S24 / R9         | Review không còn applicable hoặc version retired               | Review inapplicable cho future U hoặc V retired.                                                                                                                        | Chặn future qualified use; không viết lại historical meaning/artifacts.                                                    |
| S25 / R10        | Truthful qualification wording                                 | Giả định U thực sự dùng exact qualified V.                                                                                                                              | Giữ exact approved phrase và qualifier gần claim; không chứng nhận/guarantee final contract.                               |
| S26 / R10        | Claim không có actual qualification hoặc vượt scope            | Chỉ governance/authority approved hoặc claim final contract compliant/certified.                                                                                        | Không chấp nhận claim.                                                                                                     |
| S27 / R11        | Governance được định nghĩa khi duration còn deferred           | Duration chưa chốt, chỉ documentary governance.                                                                                                                         | Có thể review governance; không invent duration; processing/persistence vẫn gated.                                         |
| S28 / R11        | Evidence riêng tư được đưa vào public repository               | Giả định proposed record chứa actual opinion/personal data/private URL/vault path.                                                                                      | Reject nội dung; chỉ opaque reference phù hợp; không tạo mẫu dữ liệu riêng tư/upload/store.                                |
| S29 / R12        | Authorization signal không là publication evidence             | Chỉ security signal hoặc successful system context.                                                                                                                     | Không suy ra review/publication/qualification completion.                                                                  |
| S30 / R12        | Publication audit tham chiếu legal evidence                    | Giả định completed action có external evidence reference.                                                                                                               | Internal actor/action khác external author/opinion; không copy legal content vào security logs.                            |
| S31 / R13        | Governance spec được approved hoặc validated                   | Artifacts được approved hoặc strict validation pass.                                                                                                                    | Chỉ governance/workflow progress; không runtime/actual qualification/lifecycle/production promotion.                       |
| S32 / R13        | Future work cần persistence hoặc authority expansion           | Cần runtime/persistence, CRUD, role/principal/operation hoặc tenant merge.                                                                                              | STOP về owning authority; không implicit authorization.                                                                    |

### Supplemental negative coverage and exact sets

Các subcases sau không tạo requirement/scenario mới: expand existing R1/R6/R7
premises để kiểm tra missing authenticated/internal user, disabled user, missing
system role, browser-supplied authority, unknown/prefix/wildcard operation, tenant
membership present nhưng no system grant, và dual-role actor không merge scope.
Auth source/tests hiện có chỉ chứng minh compatibility của prerequisite; không
được mô tả như tests của một legal governance engine chưa được implementation.

Đối với R6, thay từng premise trong S14 bằng missing/false/unknown khi phù hợp:
exact immutable V/H, accepted completed review, approved outcome, complete bound
evidence, matching E, conditions, dates, non-superseded/non-invalidated review,
successful authorized publication, non-retired V. Không premise nào được ngầm
đặt true. A/B separation không chứng minh được cũng fail closed, không nhận hai
labels làm proof. Đây là logical counterexample review, không code execution.

Exact operation set phải giữ nguyên:

- `formalites.template.read`
- `formalites.template.draft.manage`
- `formalites.template.review.submit`
- `formalites.template.publish`
- `formalites.template.retire`

Exact accepted outcome set: `APPROVED`, `CHANGES_REQUIRED`, `REJECTED`.
`APPROVED_WITH_CONDITIONS` chỉ xuất hiện như forbidden negative example.
Không wildcard, prefix matching, implication, role hierarchy hoặc caller policy.
YUTA_ADMIN chỉ có explicit grants hiện hữu; YUTA_SUPPORT none. Không reviewer
role/account, new principal hoặc sixth operation.

Atomic publication không cho phép DB transactions, locks, outbox, retry,
idempotency, API orchestration hoặc publication service. Không evidence CRUD,
upload/storage, provider, generated CDI/PDF/signature/Documents handoff. Không
actual template content/version implementation hoặc Platform Admin runtime.

### Required verification commands and result attribution

Sau Apply authorization, run repository-defined checks với exact command,
start/end time, exit code, output summary và scope. Chưa claim các checks này
đã thực hiện task delivery ở planning stage:

- `pnpm --filter @yuta/auth test` và `pnpm --filter @yuta/auth typecheck`:
  regression của unchanged authority foundation, không legal-review execution.
- `pnpm docs:check`.
- `pnpm architecture:check`.
- `pnpm -r --if-present typecheck`.
- `pnpm exec openspec validate formalites-template-legal-review-governance --strict`.
- `pnpm format:check`: báo exact global result và baseline attribution; không
  repository-wide formatter write. Pre-existing failures không biến thành PASS.
- `pnpm exec prettier --check` chỉ với explicit changed documentation paths.
- Scoped `git diff --check` cho tracked paths; với untracked review/tasks files,
  `git -c core.autocrlf=false diff --no-index --check -- NUL <exact-path>` và
  inspect diagnostics (exit 1 vì file khác NUL không tự là whitespace failure).
- Node/PowerShell read-only hash/title/path comparisons cho toàn bộ approved
  baseline, 13/32 exact mapping và no unauthorized source drift. Không thêm
  executable policy/script vào repo.

Nếu clean checkout thiếu ignored Next outputs, dùng existing `pnpm typegen:next`
trước recursive typecheck khi cần; không mở lại tooling hoặc tracked source.
Build/cloud/local suites và Browser QA: `NOT_APPLICABLE` cho documentary-only
delivery, report là not run với rationale, không claim PASS. Nếu có bất kỳ
runtime edit cần chúng, STOP vì outside approved scope thay vì mở rộng plan.

Technical Compliance Matrix cuối cùng có đủ IR1–IR10:
constraint → authoritative path/section/hash → affected documentary evidence →
actual check/result → PASS/FAIL. Không row rỗng cho N/A phases. Mọi skip/failure
phải được nêu; chỉ unrelated baseline failure có bằng chứng mới được tách riêng.

### Protected integrity and lifecycle

Gate 1 active baseline bảo vệ metadata, Proposal, Analysis và mười source files;
Gate 2/Gate 2b bảo vệ thêm exact delta/Design và preceding packet hashes.
Ba hashes được rebaseline lần này là:

| Protected path                      | Approved SHA-256                                                   |
| ----------------------------------- | ------------------------------------------------------------------ |
| `docs/CURRENT_STATE.md`             | `ad5f744b3758079f1fb55024cf85f4185d32acf51a7488e210c41a2b418f993b` |
| `docs/MODULE_REGISTRY.md`           | `880bda34f9bbcae3ac361669d0a3d175e7ec510b636f374e93e5f5df882165d0` |
| `docs/features/personnel/README.md` | `7fce8f42319534032e67c8b98b91ad6e7384362cfad039c5063ed66aee45439b` |

Existing authorization spec SHA-256:
`3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2`.
Source `packages/auth/src/formalites-template-system-authorization.ts`:
`816b912b7cd4b9408d50f4ae4d01832499e87b452661143cac6dbcb0886cace2`.
Source `packages/auth/src/session.ts`:
`278d08effc39d90cfe147bd45182a6e80d76ff5641f94d3d1bc302fd8063f5a1`.
Test `packages/auth/test/formalites-template-system-authorization.test.ts`:
`93911ec279fa61f20f2f9af3b0fdb6cc591d1ba88fd6eb1ae2f344f45c52de89`.
Các baseline khác nằm nguyên trong active Gate 1 table; không dùng historical
drift table làm expected baseline và không silently rebaseline lần nữa.

Apply/Verify không chỉnh canonical Product Knowledge, CURRENT_STATE, Module
Registry, architecture summaries, lifecycle/readiness hoặc normative main specs.
Chỉ sau Gate 3 → finish → authorized Sync → Validate Main Specs → Archive mới
được chạy reviewed Knowledge Consolidation; nguồn cập nhật phải do reviewed
process xác định. Không tự promote lifecycle từ implementation/sync/archive;
không main-spec link trước successful authorized sync/validation.

### Planning validation evidence — not Apply / Verify completion

Repository HEAD tại resume: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Review packet chain sau approved rebaseline/scoped formatting:

| Packet                                                                           | Current SHA-256                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md` | `8df6f016533a9a208273d36d5bd985f568fb63492fb1de670fceb0bf392dda05` |
| `docs/reviews/formalites-template-legal-review-governance/02-specs-review.md`    | `14346c42610b10425bddbc60abe2680e981c58aba2a6b321177758f97c533ab5` |
| `docs/reviews/formalites-template-legal-review-governance/02b-design-review.md`  | `5499d592d752b45a1a8804b6256aa57df7461155b56823c9cee60e4d8f4c20f1` |

Resume audit đọc active table rows bắt đầu bằng path, hash raw bytes qua Node
`crypto.createHash('sha256')`; historical drift không là active baseline.
Gate 1: 13/13; Gate 2: 5/5; Gate 2b: 7/7, không mismatch.
Read-only heading/table comparison xác nhận 13/13 exact requirement titles và
32/32 exact scenario titles theo đúng thứ tự. Checkbox inventory: 8 open, 0 completed.
Đây chỉ là kiểm tra planning structure, chưa là execution của tasks 1.1–1.8.

Checks thực sự chạy trong planning turn:

- `pnpm docs:check`: exit 0, 36 current documents passed.
- `pnpm architecture:check`: exit 0.
- `pnpm -r --if-present typecheck`: exit 0, recursive package checks completed.
- `pnpm exec openspec validate formalites-template-legal-review-governance --strict`:
  exit 0, change valid.
- `pnpm exec prettier --check` với đúng ba packet paths trên và `tasks.md`:
  exit 0. Formatter write chỉ chạy cho bốn paths này.
- Scoped no-index whitespace check cho bốn paths: PASS, không diagnostic;
  wrapper chấp nhận exit 0/1 chỉ khi không có whitespace error.
- `pnpm format:check`: exit 1, 67 existing out-of-scope formatting warnings.
  Không sửa các file cảnh báo hoặc báo global PASS.
- `openspec status`: pinned `yuta-spec-driven`, `isPlanningComplete: true`;
  raw artifact completeness không là YUTA Apply readiness.

Preservation check dùng `git ls-files --cached --others --exclude-standard -z`,
sorted unique paths và SHA-256 raw file bytes; group digest của sorted
`[path, hash]` pairs cho 91 repository prefix groups, loại đúng bốn authored paths.
Before/after groups khớp toàn bộ: không file ngoài allowlist thêm/xóa/đổi bytes,
bao gồm canonical Knowledge, protected auth, normative main specs và warning files.
Ignored generated outputs không được tính là source authority. Three-source
Pointage Knowledge state đã tồn tại tại resume, không phải thay đổi của turn này.

Không chạy auth tests, broad cloud/local tests, builds hoặc Browser QA trong
planning-only turn; không thực hiện documentary Apply/Verify/QA. Auth regression
checks vẫn nằm trong planned verification sau separate Apply authorization.
Không có Gate 3 packet được tạo.

### Historical planning review stop — superseded by Documentary Apply evidence

Planning delivery: chờ Control Tower review exact file hash.
Documentary task completion: `0/8`.
Technical Implementation Compliance: `NOT_ASSESSED`.
VERIFY: `NOT_STARTED`.
QA: planned `NOT_APPLICABLE`, final evidence chưa được lập.
Gate 3: `NOT_REACHED`; không có ready final review packet.
Sync authorization: `PENDING`. Apply/Production: `NOT_AUTHORIZED`.

Next explicit authorization needed: review Tasks / Implementation Plan /
embedded IR contract; nếu approved, cấp riêng Apply cho documentary tasks này.
Planning completeness hoặc CLI readiness không là Apply authorization.

## Documentary Apply evidence

### E1 — Approval, pre-Apply inventory and source integrity

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T20:23:31Z
Scope: DOCUMENTARY CONFORMANCE ONLY, tasks 1.1–1.8
Approved planning SHA-256: `f19099518265a7269a1c96e8f53cc4e8e6934c0349c9507853da651094ba2c3a`

Trước edit, exact Tasks hash khớp approved hash. Gate 1 active table: 13/13;
Gate 2: 5/5; Gate 2b: 7/7; tất cả match, bao gồm metadata,
Proposal/Analysis/Specs/Design và ba rebaselined canonical hashes. Không refresh
hoặc sửa earlier review packet; không unexplained protected drift.

Baseline HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Inventory: 2.504 existing tracked/untracked nonignored files; Tasks đã tồn tại,
`03-final-review.md` absent. Fresh exact path/hash/status snapshot đọc bằng
`git ls-files --cached --others --exclude-standard -z`, `git status --short`,
Node `fs.readFileSync` + `crypto.createHash('sha256')`; sorted unique paths.
SHA-256 của UTF-8 JSON array sorted `[path, raw-file-sha256]` pairs:
`61b5a8329ba396ec311e6c347d487117021d2ac9e7e81e66093a0288794be131`.
Digest cùng serialization, loại đúng hai delivery paths:
`ee1540ec7748fc27298824a6bddd123989548296b7fbbddcc0005bd04573ad42`.

Authoring allowlist trong turn này chỉ:
`openspec/changes/formalites-template-legal-review-governance/tasks.md` và
`docs/reviews/formalites-template-legal-review-governance/03-final-review.md`.
Không cần workflow metadata edit ngoài Tasks. Dirty checkout của các changes
khác được giữ nguyên; không lấy HEAD diff làm implementation attribution.
Full status provenance được giữ trong Gate 3 packet; final preservation so
toàn bộ exact path/hash inventory, không chỉ protected subset.
Task 1.1: PASS — initial approval/inventory/integrity đủ để documentary execution;
final integrity được kiểm tra riêng ở task 1.8.

### E2 — Documentary conformance assessment, tasks 1.2–1.6

Method: đọc toàn bộ approved requirement prose và mỗi WHEN/THEN/AND, đối chiếu
với symbolic premise/expected outcome ở planning table bằng cùng R/S label,
rồi đánh giá không bỏ premise, không thêm success hoặc authority. Result
PASS dưới đây là **documentary conformance**, không runtime/legal review PASS.
Không evaluator, fixture/template, external opinion, API hoặc publication được tạo.

Source G = `openspec/changes/formalites-template-legal-review-governance/specs/formalites/template-legal-review-governance/spec.md`,
SHA-256 `9105bd3d7eace661169fda7717a8fb934916c4fc35209ccffc2264f1755e370e`.
Source D = `openspec/changes/formalites-template-legal-review-governance/design.md`,
SHA-256 `9759d0fc4487fa0e037622e16f24308054480eb453a44ac027579a084e6ea6b1`.
Các `G:L...` là line numbers trong exact hashed G, không một source mới.
Exact title comparison của cả R và S tables PASS, 13/13 và 32/32 đúng thứ tự.

#### Requirement-level assessment

| Evidence / source | Exact requirement title                                             | Assessed conformance / rationale                                                                                                                                                                                                                                                                                                                                                                                  | Result |
| ----------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| E-R1; G:L7        | Global governance giữ nguyên ownership và authorization boundary    | Formalités ownership/global scope tách organization/establishment; system active user + exact grant không cần TenantContext. Existing five-operation list/grants được đối chiếu exact với auth source và main spec; không caller policy/inheritance.                                                                                                                                                              | PASS   |
| E-R2; G:L33       | Reviewer external có identity và evidenced authority phù hợp        | Reviewer là accountable person external/manual; default avocat Pháp hoặc EU lawyer được phép tư vấn pháp luật Pháp, competence phù hợp. Juriste khác cần exact professional/legal authority và competence evidence. Identity, firm nếu có, capacity, registration/equivalent reference, jurisdiction, competence, engagement/matter và dated confirmation đều được giữ; account/system role không thay thế.       | PASS   |
| E-R3; G:L53       | Minimum evidence ràng buộc đúng immutable version và review         | Minimum evidence giữ identity/version, immutable checksum + algorithm, review date, reviewer identity/authority/qualification, outcome, E, conditions/reservations/exclusions, deliverable/confirmation, received/recorded time và recorder; conditional effective date, requested legal/conventional snapshot, supersedes reference được phân biệt với missing/unknown. Source binding không suy ra từ H đơn lẻ. | PASS   |
| E-R4; G:L78       | Applicability envelope và binding conditions được bảo toàn          | E giữ jurisdiction, contract category, full/part-time, employee/employer category, collective-agreement assumptions, exclusions và effective dates; unknown/contradictory U fail closed, conditions không bị bỏ/mở rộng.                                                                                                                                                                                          | PASS   |
| E-R5; G:L96       | Review outcomes có đúng ba semantic kết quả                         | Đúng APPROVED / CHANGES_REQUIRED / REJECTED; conditions đã thuộc E và không sửa V mới có thể APPROVED. Source opinion/author được giữ, không diễn giải unknown hoặc forbidden fourth outcome thành success.                                                                                                                                                                                                       | PASS   |
| E-R6; G:L122      | Qualification yêu cầu đủ review và completed authorized publication | Qualification là conjunction của exact V/H, accepted completed APPROVED review, complete evidence, E/conditions/dates, non-superseded/non-invalidated current review, successful authorized publication và non-retired V; không guarantee inputs hoặc final contract.                                                                                                                                             | PASS   |
| E-R7; G:L144      | Recorder và publisher không trở thành external opinion author       | Evidence linkage bên trong future publish prerequisite, không standalone CRUD. A khác B về người; C có thể bằng B; submit không intake/edit/approve evidence. Invalid authority/evidence không domain success; không transaction design.                                                                                                                                                                          | PASS   |
| E-R8; G:L174      | Content hoặc applicability change cần version mới và new review     | Canonical content OR applicability đổi đều new V/new review, dù minor content hoặc H không đổi khi E đổi; không mutate immutable reviewed V hoặc transplant old approval.                                                                                                                                                                                                                                         | PASS   |
| E-R9; G:L190      | Supersession và retirement không ghi đè historical evidence         | Supersession explicit, preserve historical author/outcome/version; old review không current basis; new APPROVED không tự republish. Legal/conventional/date/re-review inapplicability hoặc retirement chặn future use, không overwrite history/generated artifacts, không new suspension/provider.                                                                                                                | PASS   |
| E-R10; G:L208     | Legal wording chỉ mô tả bounded template qualification              | Chỉ bounded model/version/scope phrase kèm qualifier khi actual qualification có thật. Governance/implementation/allow không được nói thành actual qualified template; no compliant/certified guarantee, no rendering.                                                                                                                                                                                            | PASS   |
| E-R11; G:L225     | Private evidence và retention prerequisites đứng trước persistence  | Personal/confidential evidence không vào Git. Purpose/legal basis, minimization, recipients/access, private storage/confidentiality, active/archive, rights, legal hold, deletion/backups và justified retention duration/criteria là trước processing. Deferred duration không indefinite retention/upload authority.                                                                                            | PASS   |
| E-R12; G:L243     | Ba audit families giữ semantics riêng biệt                          | Authorization security, external opinion và publication/retirement attribution có ba meanings riêng; correlation/reference không merge. Security signal không chứa opinion/template hoặc domain completion, publisher không thành opinion author; no audit schema/storage.                                                                                                                                        | PASS   |
| E-R13; G:L260     | Governance contract không triển khai excluded capabilities          | Only documentary boundary; no schema/runtime/API/UI/evidence store/provider/generation/customization; tenant sessions/draft và canonical/main specs giữ nguyên. Future manual handling không actual engagement/data-transfer authority; no lifecycle/readiness promotion.                                                                                                                                         | PASS   |

#### Scenario-level assessment

Premise và expected governance outcome cho mỗi E-S label là đúng row S cùng số
trong approved planning table ở trên; không đổi chúng. Cột clauses bên dưới
trace **toàn bộ** WHEN/THEN/AND của exact scenario, theo thứ tự source lines.
Assessed result đối chiếu cả THEN lẫn AND, không chỉ matched title.
Source/hash G và D áp dụng cho mọi row; rationale nêu cách giữ boundary.

| Evidence / requirement | Exact scenario title                                           | G clause lines, theo thứ tự WHEN / THEN / AND nếu có | Assessed result and rationale                                                                                                            | Documentary result |
| ---------------------- | -------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| E-S01 / R1             | Internal publisher không có restaurant membership              | L17 / L18 / L19                                      | Expected outcome được giữ: Grant evaluation và domain eligibility tách biệt: thiếu membership không deny, cũng không miễn prerequisites. | PASS               |
| E-S02 / R1             | Support hoặc restaurant-only actor yêu cầu publication         | L23 / L24 / L25                                      | Expected outcome được giữ: Support/restaurant role không có global grant; legal evidence không thể bù authority.                         | PASS               |
| E-S03 / R1             | Global allow không cấp tenant access hoặc additional operation | L29 / L30 / L31                                      | Expected outcome được giữ: Global grant bị giới hạn scope; tenant request cần independent evaluation, không merge.                       | PASS               |
| E-S04 / R2             | Accepted external reviewer không có YUTA account               | L43 / L44 / L45                                      | Expected outcome được giữ: Account absence không phải missing reviewer competence; evidence vẫn phải được xét.                           | PASS               |
| E-S05 / R2             | Reviewer identity hoặc authority không được chứng minh         | L49 / L50 / L51                                      | Expected outcome được giữ: Firm/title không chứng minh responsible person/authority; internal role không legal credential.               | PASS               |
| E-S06 / R3             | Complete evidence khớp exact version                           | L63 / L64 / L65                                      | Expected outcome được giữ: Completeness chỉ đủ để xét, không tự thành completed publication.                                             | PASS               |
| E-S07 / R3             | Missing evidence hoặc mismatched checksum                      | L69 / L70 / L71                                      | Expected outcome được giữ: Mỗi missing/source/version/checksum mismatch branch đều chặn success; similarity không exact binding.         | PASS               |
| E-S08 / R3             | Checksum có nhưng opinion author chưa xác thực                 | L75 / L76                                            | Expected outcome được giữ: Content H không chứng minh author/source authenticity, nên review chưa eligible.                              | PASS               |
| E-S09 / R4             | Declared use ngoài envelope hoặc chưa xác định                 | L86 / L87 / L88                                      | Expected outcome được giữ: Các outside category/date và unknown use đều không qualified; historical publication không mở E.              | PASS               |
| E-S10 / R4             | Binding condition chưa được đáp ứng                            | L92 / L93 / L94                                      | Expected outcome được giữ: Approved finding không bỏ requirement condition; chưa đạt condition phải deny U.                              | PASS               |
| E-S11 / R5             | Approved review có conditions trong envelope hiện tại          | L106 / L107 / L108                                   | Expected outcome được giữ: Conditions preserved trong E không tạo fourth outcome và không tự satisfy qualification.                      | PASS               |
| E-S12 / R5             | Reviewer yêu cầu chỉnh sửa                                     | L112 / L113 / L114                                   | Expected outcome được giữ: Change request đòi new version/review; chưa biểu đạt condition trong E không được coi unconditional approval. | PASS               |
| E-S13 / R5             | Review bị rejected hoặc outcome không hợp lệ                   | L118 / L119 / L120                                   | Expected outcome được giữ: REJECTED và invalid/missing/unknown/fourth value đều không đủ để publish/qualify; không silent mapping.       | PASS               |
| E-S14 / R6             | Mọi qualification prerequisites được thỏa mãn                  | L130 / L131 / L132                                   | Expected outcome được giữ: Chỉ tất cả premises cùng đạt mới qualified U; outcome không certify contract/input.                           | PASS               |
| E-S15 / R6             | Authorization allow nhưng publication chưa hoàn thành          | L136 / L137                                          | Expected outcome được giữ: Allow là authority proof, không publication completion; một failed premise vẫn chặn qualification.            | PASS               |
| E-S16 / R6             | Completed review chưa được publication                         | L141 / L142                                          | Expected outcome được giữ: Review/evidence completed vẫn thiếu publication prerequisite.                                                 | PASS               |
| E-S17 / R7             | Recorder đồng thời là authorized publisher                     | L154 / L155 / L156                                   | Expected outcome được giữ: C = B được phép khi A khác B thực sự và mọi domain premise đạt; opinion attribution vẫn A.                    | PASS               |
| E-S18 / R7             | Publisher cũng là reviewer hoặc sửa external opinion           | L160 / L161                                          | Expected outcome được giữ: A = B hoặc internal rewrite opinion/outcome/condition đều vi phạm separation, deny.                           | PASS               |
| E-S19 / R7             | Evidence linkage thất bại                                      | L165 / L166                                          | Expected outcome được giữ: Exact authority không bù linkage thất bại; result invariant không partial success.                            | PASS               |
| E-S20 / R7             | Caller yêu cầu independent evidence management                 | L170 / L171 / L172                                   | Expected outcome được giữ: Read/submit/publish không imply independent evidence create/read/update/delete/approval.                      | PASS               |
| E-S21 / R8             | Nội dung thay đổi dù được xem là nhỏ                           | L180 / L181 / L182                                   | Expected outcome được giữ: Không minor-change exemption: canonical bytes mới cần V/H và review mới.                                      | PASS               |
| E-S22 / R8             | Applicability thay đổi nhưng content giữ nguyên                | L186 / L187 / L188                                   | Expected outcome được giữ: H giống không đồng nghĩa applicability identity; changed E vẫn cần V mới/review mới.                          | PASS               |
| E-S23 / R9             | Review mới supersede review đã approved                        | L198 / L199 / L200                                   | Expected outcome được giữ: Historical record được giữ nhưng old review không current proof; new APPROVED chưa automatic publication.     | PASS               |
| E-S24 / R9             | Review không còn applicable hoặc version retired               | L204 / L205 / L206                                   | Expected outcome được giữ: Inapplicability và retired là hai negative cases; cả hai chặn future use, không rewrite history.              | PASS               |
| E-S25 / R10            | Truthful qualification wording                                 | L216 / L217 / L218                                   | Expected outcome được giữ: Claim gắn exact model/scope và qualifier; không biến symbolic example thành actual legal approval.            | PASS               |
| E-S26 / R10            | Claim không có actual qualification hoặc vượt scope            | L222 / L223                                          | Expected outcome được giữ: Governance approval và contract certification là hai loại sai claim được reject.                              | PASS               |
| E-S27 / R11            | Governance được định nghĩa khi duration còn deferred           | L233 / L234 / L235                                   | Expected outcome được giữ: Governance có thể tiến khi duration deferred, nhưng processing/persistence chưa được phép.                    | PASS               |
| E-S28 / R11            | Evidence riêng tư được đưa vào public repository               | L239 / L240 / L241                                   | Expected outcome được giữ: Chỉ xem xét loại nội dung bị cấm theo symbolic premise; không tạo actual private record/URL.                  | PASS               |
| E-S29 / R12            | Authorization signal không là publication evidence             | L251 / L252                                          | Expected outcome được giữ: Security signal không chứng minh external opinion hoặc domain action hoàn tất.                                | PASS               |
| E-S30 / R12            | Publication audit tham chiếu legal evidence                    | L256 / L257 / L258                                   | Expected outcome được giữ: Internal action attribution và external author/evidence reference giữ riêng; no legal copy in security logs.  | PASS               |
| E-S31 / R13            | Governance spec được approved hoặc validated                   | L268 / L269 / L270                                   | Expected outcome được giữ: Artifact progress không chứng minh runtime/template/legal/privacy/production readiness.                       | PASS               |
| E-S32 / R13            | Future work cần persistence hoặc authority expansion           | L274 / L275 / L276                                   | Expected outcome được giữ: Requested excluded work phải qua owning authority, không tự cấp thêm quyền.                                   | PASS               |

#### Qualification conjunction and fail-closed counterexamples

Cùng positive premise set của S14, lần lượt thay **chỉ** một premise bằng
false/missing/unknown khi có nghĩa. Không thực hiện lifecycle transition.
Mọi row được so với G R6, D4 và nguồn bổ sung ghi bên dưới.

| Counterexample | Changed premise                                                     | Assessed governance outcome                                         | Source / result  |
| -------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------- |
| Q01            | Không xác lập exact immutable V/H                                   | Không qualified; no similarity substitute.                          | R3/R6; PASS      |
| Q02            | External reviewer chưa accepted/competent                           | Không qualified; internal role không bù evidence.                   | R2/R6; PASS      |
| Q03            | Review chưa completed                                               | Không qualified; publish allow không tạo review completion.         | R6; PASS         |
| Q04            | Outcome CHANGES_REQUIRED/REJECTED hoặc missing/unknown/fourth value | Không qualified; không convert thành APPROVED.                      | R5/R6; PASS      |
| Q05            | Missing required evidence hoặc source/linkage không bind V          | Không qualified; invalid linkage không successful publication.      | R3/R6/R7; PASS   |
| Q06            | U không matching E hoặc E chưa biết                                 | Không qualified cho U, dù content H khớp.                           | R4/R6; PASS      |
| Q07            | Binding condition chưa thỏa                                         | Không qualified cho U; không xóa condition.                         | R4/R6; PASS      |
| Q08            | Effective date không applicable                                     | Không future qualified use dựa trên review đó.                      | R4/R6/R9; PASS   |
| Q09            | Review superseded                                                   | Old review không current qualification basis; giữ history.          | R6/R9; PASS      |
| Q10            | Review invalidated                                                  | Không current qualification basis, không automatic requalification. | R6/R9; PASS      |
| Q11            | Chỉ có allow, chưa successful authorized publication                | Không published/qualified từ allow hoặc approved opinion đơn lẻ.    | R6/S15/S16; PASS |
| Q12            | Version retired                                                     | Không future qualified use; không rewrite historical artifacts.     | R6/R9; PASS      |

Positive control S14 giữ đủ tất cả premises, chỉ cho qualified U trong reviewed
scope, không final-contract guarantee. Các nhánh negative không thêm outcome
review thứ tư hoặc database transaction/idempotency/lock/outbox/retry mechanism.

Separation counterexamples: A = B → deny; không chứng minh được A khác B →
fail closed; A/B chỉ là hai labels → chưa proof; C = B với A khác B và đủ
prerequisites → không deny vì recorder/publisher trùng. S17/S18 và D5 khớp;
không yêu cầu third person, second internal approver hoặc reviewer account.

#### Authority and compatibility assessment

Existing source giữ đúng năm operations ở approved exact-set section. Static
source/plan list comparison PASS (5/5 exact ordered identifiers); approved G
giữ cùng identifiers và ba outcomes. Test source checks explicit grants,
no prefix/wildcard/inheritance, admin không membership, support even with
membership-like data, missing identity/internal user, disabled user, null
system role, unknown/malformed operations, minimized context và no lifecycle
side effect. `pnpm --filter @yuta/auth test`: exit 0, 5 files / 45 tests PASS.
Đây là entire auth-suite count, không phải 45 legal-governance tests.

Session source `packages/auth/src/session.ts` L78–96 và L174–213 resolve
trusted adapter/userLookup, deny missing/disabled/unknown/ungranted, trả minimized
exact-operation/global scope; không TenantContext. Browser-supplied role,
membership-like facts và dual-role actor không merge authority theo existing
normative authorization contract. Không sửa runtime hoặc nói rằng một
legal-review engine đã được chạy; tenant isolation ở đây là documentary
contract + unchanged-source preservation, không new end-to-end tenant test.

#### Wording, privacy and audit assessment

R10 exact phrase: “préparé à partir d’un modèle qualifié pour ce cas d’usage”.
Qualifier: “La qualification concerne uniquement la version du modèle et le
périmètre déclarés. Elle ne constitue ni un avis juridique sur la situation
individuelle, ni une garantie de conformité du contrat final.”
Đối chiếu G R10: wording giữ exact text; chỉ trích governance contract, không
claim đã có qualified template. “contrat conforme”, “juridiquement conforme”,
“validé juridiquement”, certification/guarantee hoặc governance-only-as-qualified
đều là negative examples, không approved marketing/output.

| Authorization/security audit                                                                                | External legal-review evidence                                                                                   | Publication/retirement audit                                                                                            |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Trusted actor khi resolved, exact requested operation, security decision/denial; no legal/template content. | External author/authority, exact V/H, opinion/outcome/E/conditions và private reference; không internal opinion. | Internal actor, exact V, completed action/time, reason khi liên quan và evidence reference; không reviewer attribution. |

Ba meanings không thay thế nhau. H/opaque reference không tự authentic opinion;
history preservation không retention vô hạn. Privacy prerequisite list ở E-R11
đầy đủ; chưa chọn duration/storage/provider, chưa thu thập personal/private
evidence. G R13 exclusions và D1–D8 được giữ; no code/source/canonical write.

Tasks 1.2–1.6: PASS cho documentary delivery theo các rows đã đối chiếu.

### E3 — Required command evidence and technical assessment

Observation window ngày 2026-09-07; UTC timestamps là command dispatch và
completion-observed time, không giả định process hoàn tất đúng thời điểm poll.
Exact commands/result được ghi dưới đây. Những historical planning results ở
phần trước không được dùng thay cho các execution results trong section này.

| Command                                                                                                                           | Start UTC    | Completion observed UTC | Exit | Result / attribution                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------- | ---- | ------------------------------------------------------------------------------------------------------------ |
| `pnpm --filter @yuta/auth test`                                                                                                   | 20:23:53 UTC | 20:24:04 UTC            | 0    | PASS — 5 test files / 45 tests; unchanged auth suite, không legal-review engine.                             |
| `pnpm --filter @yuta/auth typecheck`                                                                                              | 20:23:53 UTC | 20:24:04 UTC            | 0    | PASS — tsc --noEmit.                                                                                         |
| `pnpm docs:check`                                                                                                                 | 20:25:10 UTC | 20:25:21 UTC            | 0    | PASS — 36 current documents.                                                                                 |
| `pnpm architecture:check`                                                                                                         | 20:25:10 UTC | 20:25:21 UTC            | 0    | PASS — runtime imports, database URLs, client boundaries, migration baselines.                               |
| `pnpm -r --if-present typecheck`                                                                                                  | 20:25:10 UTC | 20:26:49 UTC            | 0    | PASS — recursive workspace typechecks completed; ignored Next output đã có, không cần bootstrap.             |
| `pnpm exec openspec validate formalites-template-legal-review-governance --strict`                                                | 20:25:10 UTC | 20:25:21 UTC            | 0    | PASS — selected change valid.                                                                                |
| `pnpm format:check`                                                                                                               | 20:23:53 UTC | 20:24:55 UTC            | 1    | FAIL — 67 pre-existing warning paths ngoài delivery scope; all baseline hashes preserved, không remediation. |
| `pnpm exec prettier --check openspec/changes/formalites-template-legal-review-governance/tasks.md`                                | 20:27:44 UTC | 20:27:46 UTC            | 0    | PASS — Tasks formatted.                                                                                      |
| `git -c core.autocrlf=false diff --no-index --check -- NUL openspec/changes/formalites-template-legal-review-governance/tasks.md` | 20:27:44 UTC | 20:27:46 UTC            | 1    | PASS whitespace — exit 1 denotes nonempty file vs NUL, không diagnostics.                                    |

Static read-only title/set comparison: exit 0; 13 requirement titles / 32 scenario
titles match exact approved planning order; source+plan five-operation arrays
match; G contains exact three-outcome declaration. Review G/D prose và E2
scenario/requirement assessments không phát hiện divergence hoặc omitted clause.
12 conjunction counterexamples và separation branches đều preserve fail-closed
semantics. Technical Compliance Matrix IR1–IR10 được tổng hợp trong Gate 3
TECHNICAL VERIFY, tham chiếu exact completed Tasks evidence này.

Global format warnings: 67/67 paths tồn tại trước Apply, không thuộc hai delivery
paths; final raw-byte/path inventory chứng minh không đổi. Exact warning list
và attribution nằm trong Gate 3; không coi failed command là PASS hoặc sửa
canonical files. Đây là unrelated baseline failure, không documentary conformance defect.

Not run: `pnpm test:cloud`, `pnpm test:local`, build suites và Browser QA,
theo approved documentary-only N/A plan; không runtime/schema/UI đổi. Không
install dependencies, bootstrap, migration, database access, provider operation,
legal review engagement, Sync, Archive, Knowledge Consolidation hoặc production
action. Auth tests dùng existing test doubles của unchanged suite; không tạo
fixture/mock template trong delivery.

Task 1.7: PASS — 13/13 requirements, 32/32 scenarios và IR1–IR10 có evidence;
không runtime-enforcement hoặc legal-qualification claim.

### E4 — Documentary closure and Gate 3 stop

Final delivery chỉ hai paths trong E1; unchanged semantic planning, earlier
packets, protected authority/auth/tenant source và toàn bộ non-delivery inventory
được recheck. Reconstruct approved Tasks preimage từ final Tasks bằng cách bỏ
section Documentary Apply evidence, phục hồi approval/status wording và mở lại
checkboxes: raw UTF-8 SHA-256 phải bằng approved
`f19099518265a7269a1c96e8f53cc4e8e6934c0349c9507853da651094ba2c3a`.
Phép so này chứng minh phần approved task wording, phase applicability, mapping
và IR constraints không đổi ngoài status/progress và evidence bổ sung.

Hash ordering: hoàn thiện Tasks evidence/checkboxes, hash final Tasks, đưa hash
đó vào Gate 3; sau hoàn thiện/scoped-check Gate 3, compute exact final packet
hash và trả cùng Tasks hash trong Control Tower return. Không nhúng self-hash
hoặc tạo circular Tasks/packet hash reference; không standalone hash/evidence file.
Gate 3 là `docs/reviews/formalites-template-legal-review-governance/03-final-review.md`,
chứa Technical Compliance Matrix, TECHNICAL VERIFY và QA; không artifact thay thế.

UI_AFFECTING: NO
BROWSER_QA_REQUIRED: NO
QA: NOT_APPLICABLE — hai Markdown delivery files, không route/rendering,
interaction, runtime/service/persistence hoặc distinct user/runtime QA dimension.
Không browser screenshot hoặc actual legal-review/publication evidence được claim.

Task 1.8: PASS — final closure checks và exact two-file hashes được xác nhận khi
phát hành Gate 3 packet/Control Tower return; packet phải được rehash nếu sửa bytes.
Documentary task completion: 8/8.
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS.
VERIFY: PASS — DOCUMENTARY CONFORMANCE ONLY.
Gate 3 review status: AWAITING_HUMAN_REVIEW.
Sync authorization: PENDING.
Production: NOT AUTHORIZED.
STOP tại Gate 3; chưa Sync, Archive, Knowledge Consolidation hoặc deployment.
