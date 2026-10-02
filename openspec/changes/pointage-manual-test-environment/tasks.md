# Tasks / Implementation Plan

Change: `pointage-manual-test-environment`
Schema: `yuta-spec-driven`
Analysis conclusion: `NO_SPEC_BEHAVIOR_CHANGE`
Specs: `skip_specs: true`; không có delta Spec hoặc Gate 2.
Sensitive Design: `APPROVED` theo `02b-design-review.md`, quyết định hiện tại “phê duyệt Design”.
Apply authorization: `GRANTED` — current user “Duyệt Tasks và cho phép Apply.”, 2026-09-30T22:10:21Z; approved planning baseline `ce567c0ade4fd48ddae261667827de5e01cb03535f33e48b64a7c11ba97fbb4f`.
Tasks: `13/14` — Apply remains open for task 3.5, human operator feedback.

## Authority and implementation boundary

Repository: `D:/working/yuta/yuta-resto`. Baseline HEAD: `516e9605ca77e24c3adacf95aafb9501c3438c37`. Git status tại planning: sạch; chưa có CLI hoặc test mới. Trước Apply phải đọc lại status, kiểm tra hash/path set của mọi packet đã duyệt và xác nhận từng đường dẫn triển khai sạch hoặc các thay đổi khác được giữ nguyên chính xác. Baseline này không cho phép ghi đè thay đổi phát sinh sau planning.

Giữ nguyên Proposal/Analysis và Design D1–D7 đã duyệt. Design SHA-256: `75e69ec26104b8ba7988e708e923738eda89d637d82775b2861b8a7d0fbd1e08`. Mục tiêu duy nhất là một lệnh dev/test hỗ trợ người vận hành tự thử route Pointage hiện có bằng hai nhân viên giả và PostgreSQL dùng một lần. Không mở lại `pointage-usable-raw-clocking`.

### Intended implementation allowlist

| Path                                                             | Planning baseline                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/package.json`                                   | `cc0b0843f6eda71064ce81775de568837bd414bac83f33843b4c77c4d77cbf4f` |
| `apps/backoffice/scripts/pointage-manual-test.ts`                | `ABSENT` — CLI mới                                                 |
| `apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts` | `e18841622c4f2ba5df8b72b54d387a4b093c79d344230cb685c5aa46c5a56dea` |
| `apps/backoffice/test/pointage-manual-test.test.ts`              | `ABSENT` — test mới                                                |
| `docs/operations/LOCAL_DEVELOPMENT.md`                           | `4ca99ddc4c3d018817a3f31d79257a664106d96a8100c944183a64188efcdf57` |
| `pnpm-lock.yaml`                                                 | `6b5e098cc08ebff859d5c7f968451e073a7a8434f0a210783c57e206637075c5` |

Hash method: `Get-FileHash -Algorithm SHA256 <exact path>` trên raw bytes, lowercase hexadecimal. Sáu đường dẫn trên là toàn bộ allowlist triển khai dự kiến; Tasks/review evidence thuộc workflow riêng. Không sửa `next-child`, helper db-cloud, mã Product, env files, Specs, schema, migration, UI/page pack hoặc review/archive của change cũ. Nếu cần thêm đường dẫn hoặc thay đổi boundary, dừng để review phần mở rộng có bằng chứng.

### Authorities and classification

- Conduct/ownership: `AGENTS.md`, `apps/backoffice/AGENTS.md`; `packages/db-cloud/AGENTS.md` áp dụng cho việc tái sử dụng helper/database hiện có, không cấp quyền sửa package đó.
- Security/data/runtime: `docs/AUTHORITY_MODEL.md`, `docs/architecture/AUTHENTICATION.md` (Pointage), `docs/architecture/TENANCY.md`, `docs/decisions/ADR-003-database-ownership-boundaries.md`, `docs/operations/LOCAL_DEVELOPMENT.md`.
- Product boundaries: `docs/features/pointage/README.md`, `openspec/specs/pointage/raw-clocking/spec.md`, `openspec/specs/authorization/pointage/spec.md`; Personnel tiếp tục sở hữu dossier/lifecycle. Nguồn knowledge đang ghi trạng thái Design tại ngày trước; packet và phê duyệt hiện tại là nguồn workflow, không tự sửa Product Knowledge trong scope này.
- Workflow/evidence: `.agents/skills/yuta-run-change/SKILL.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, `docs/YUTA_QA_PROTOCOL.md`, `docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`.
- `UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO`. CLI vận hành có runtime QA riêng; không dùng phân loại này để miễn mọi QA.
- `UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE`; Reason: không thay UI hoặc thiết kế trang; Scope: tooling manual-test; Decision source: Analysis và Gate 1 đã duyệt. Không có advisory invocation.

## Implementation Plan

Chỉ cần ba phase: `Foundation / Data` cho ownership fixture và dữ liệu giả; `Service / Domain` cho CLI/preflight/admission/cleanup; `Integration / Regression` cho kiểm chứng tích hợp và hướng dẫn. Không cần `UI / Components` hoặc `Interaction / States`: route và tương tác Pointage đã có, không đổi.

Thứ tự: Phase 1 → Phase 2 → Phase 3 → post-Apply development feedback → formal VERIFY + Technical Compliance Matrix → QA riêng → Gate 3. Các checkbox dưới đây chỉ theo dõi implementation, test và evidence hoàn thành Apply; không tự tuyên bố Compliance/VERIFY/QA PASS và không tạo `03-final-review.md`.

## 1. Foundation / Data

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: fixture synthetic/disposable và resource ownership trong test infrastructure. Canonical owner: `apps/backoffice` điều phối test; `@yuta/db-cloud` sở hữu migration/repository; Personnel sở hữu dossier, Pointage sở hữu credential/evidence. Authority: root/Backoffice/db-cloud AGENTS, ADR-003, Local Development, Authentication và Design D1/D3/D6. Files: launcher helper, CLI và test mới trong allowlist; các helper/migration db-cloud là read-only dependencies.

| ID  | Constraint and completion evidence                                                                                                                                                                                                                                                                                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Giữ nguyên guard: `NODE_ENV` development/test; VERCEL vắng mặt; synthetic mode; loopback; exact case-sensitive whole-string `^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$`; parsed name bằng `SELECT current_database()` và tên thực độc lập khớp cùng rule. Test từ chối shared `yuta_cloud`, remote/malformed/mismatched names; không migrate/fixture/provider trước guard. |
| F2  | Generation và container ownership có trước resource creation; ghi exact container ID ngay khi có, nhận diện failure-before-return bằng exact name + matching generation label. Test lỗi ở từng ranh giới tạo/trả fixture; không cleanup theo wildcard hoặc broad label.                                                                                                           |
| F3  | Tái sử dụng canonical migrations rồi test-only extension `0021`, các role/admission hiện có; không SQL/schema/migration mới. Disposable integration phải chứng minh canonical stage không có raw extension rồi extension chỉ vào DB tmpfs được guard.                                                                                                                             |
| F4  | Hai dossier synthetic, eligible, khác ID/PIN trong cùng organization/establishment mới; credential đi qua primitives/repository hiện có, không plaintext persistence. Xác minh mỗi dossier không có raw event và derive `NOT_CLOCKED_IN`; collision đi qua regeneration/issue mechanics đã có.                                                                                    |
| F5  | Existing fixture callers giữ single-person default và giao diện hoạt động cũ; chỉ thêm input/callback optional, validated cho manual path. Test default caller không bị thay đổi môi trường/admission/cleanup ngoài scope.                                                                                                                                                        |

- [x] 1.1 Bổ sung generation/resource-registration option hẹp vào fixture helper và duy trì default caller; hoàn thành khi test chứng minh exact ownership được giữ cả khi provisioning lỗi trước khi trả fixture (F2/F5).
- [x] 1.2 Tái sử dụng guarded migration/admission và thêm dossier/PIN synthetic thứ hai cho manual path; hoàn thành khi test xác nhận scoped IDs/PIN khác nhau, eligibility và initial raw/current state chính xác (F1/F3/F4).
- [x] 1.3 Thêm test cho guard, fixture collision và default-caller regression; hoàn thành khi focused non-live cases PASS, phần disposable integration được định danh rõ để thực thi ở Phase 3 (F1–F5).

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: CLI dev-only, process environment, child admission và terminal handoff. Canonical owner: Backoffice test/orchestration; không tạo Product service mới. Authority: root/Backoffice AGENTS, Authentication/Tenancy, Local Development và Design D1/D2/D4/D5/D6. Files: CLI/test mới, launcher helper, Backoffice manifest và lockfile.

| ID  | Constraint and completion evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| S1  | Package script là `pnpm --filter @yuta/backoffice pointage:manual:test`; dùng trực tiếp `tsx` devDependency theo resolution hiện có, không framework mới. CLI import được cho tests mà không tự mở Docker/Next; executable boundary rõ.                                                                                                                                                                                                                                                                                                                |
| S2  | Refuse explicit non-dev/test NODE_ENV, VERCEL/CI hiện diện, remote Docker override/context, local Docker Desktop Linux engine không khả dụng, noninteractive credential output, occupied 3001 hoặc serving deny sink 65431. Chỉ absent NODE_ENV của lệnh local explicit được đặt development; không sanitize bỏ dấu hiệu production để được admit. Tests chứng minh không có provisioning sau refusal.                                                                                                                                                 |
| S3  | Một frozen in-memory env profile, OS allowlist nhỏ và nonempty reviewed shadows; không broad inheritance/private Next flags/file serialization. Inventory key names của `.env.development.local`, `.env.local`, `.env.development`, `.env` và relevant original-process key names; revalidate inventory/profile identity ngay trước child start; unknown key hoặc relevant drift dừng. Framework fact là origEnv key presence; nonempty là YUTA policy. Test undefined/empty/unknown/changed key và profile equality, không output/hash secret values. |
| S4  | Giữ 13 application shadow keys của D2: deny DB URL tại 127.0.0.1:65431, SSL false, loopback app URL, deterministic-synthetic extraction, invalid nonempty secrets/API/provider values. Không functional auth/provider credential. Parent Docker env chỉ thêm ephemeral bootstrap vars; actual disposable URLs/auth secret đi qua validated IPC hiện có. Profile phải truyền qua helper vốn strip env, không chỉ đặt ở CLI.                                                                                                                             |
| S5  | Existing Next child, fixed 127.0.0.1:3001, generation-bound IPC/trace/source watcher/reconsumer proof + validated neutral context HTTP 200 cùng slug/scope là điều kiện READY. Test wrong generation/503/timeout/exit/drift/no proof đều từ chối, không lộ PIN. Không thay trusted provider/Pointage authorization.                                                                                                                                                                                                                                    |
| S6  | Sau READY mới in một lần URL/generation/hai tên giả/PIN 8 số/initial NOT_CLOCKED_IN/Ctrl+C. Không log raw stdout/stderr, DB secret, continuation hoặc guard. Test ordering/exact permitted fields/repeated READY; chỉ synthetic PIN hiển thị terminal, giới hạn scrollback được ghi rõ.                                                                                                                                                                                                                                                                |
| S7  | Cleanup idempotent trên handled signal/lỗi: IPC STOP + bounded owned PID fallback, đóng client, xóa exact verified container, kiểm chứng container absence/port release. Không dừng process/container khác; giữ original error và báo cleanup failure riêng, exit nonzero khi lỗi. Hard-kill/power-loss là recovery limitation, không giả lập guarantee.                                                                                                                                                                                               |

- [x] 2.1 Thêm app-owned CLI entrypoint, package script và `tsx` devDependency/lockfile tối thiểu; hoàn thành khi import không có side effect, typecheck và command-resolution test PASS (S1).
- [x] 2.2 Triển khai preflight, key-name inventory, frozen shadow profile và validated optional composition qua launcher; hoàn thành khi test negative matrix và default-caller regression PASS (S2–S4).
- [x] 2.3 Kết nối fixture với existing child và context-driven readiness có timeout; hoàn thành khi tests phân biệt listener/IPC-only với đủ context/trace/reconsumer proof và từ chối mismatch/drift (S5).
- [x] 2.4 Thêm terminal-only one-time handoff cho hai nhân viên giả; hoàn thành khi tests xác nhận không credential trước READY, không extra sensitive fields và không in lại PIN (S6).
- [x] 2.5 Triển khai cleanup/recovery trên mọi trạng thái có owned resource, gồm lỗi bootstrap và signal khi còn provisioning; hoàn thành khi tests xác nhận đúng ownership, duplicate stop an toàn, failed cleanup không bị che và busy port không bị chiếm (S7).
- [x] 2.6 Hoàn tất focused unit/process tests cho CLI và regression helper cũ; hoàn thành khi các nhóm được chỉ định PASS, có báo rõ test nào dùng process/socket, test nào skipped và không gọi toàn bộ live harness ngoài chủ đích (S1–S7).

## 3. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: kiểm chứng command thật và hướng dẫn operator, với synthetic/disposable data. Canonical owner: Backoffice dev tooling; operations guide sở hữu command/recovery instructions. Authority: Design D3–D7, root/Backoffice/db-cloud AGENTS, Local Development, Automated Workflow và QA Protocol. Files: test mới và Local Development; các file còn lại chỉ được sửa cho defect trong approved contract.

| ID  | Constraint and completion evidence                                                                                                                                                                                                                                                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Focused tests và existing bootstrap pure/contract regression dùng safe test process env. Whole bootstrap file có actual child tests và suite DB/Next opt-in; không gọi nó là unit-only, không vô tình bật source-drift mutation scenarios của harness cũ. Command/selector/executed/skipped được ghi thật.                                                            |
| R2  | Chạy disposable integration/command thật sau Apply authorization: canonical + extension proof, hai dossier/PIN riêng, context/admission READY, neutral initial states, handled-stop/container absence/port release. Không dùng existing dev DB, không production provider, không credential persistence; evidence sanitized theo generation và current source hashes. |
| R3  | Local Development hướng dẫn prerequisite, command, URL/PIN handoff, Edge checklist cho hai nhân viên, reset bằng stop/restart generation mới, refusal và exact-resource recovery. Không Playwright dependency; không chạy migration canonical command trên shared DB.                                                                                                 |
| R4  | Scoped diff chỉ sáu target, all prior artifacts/protected Product/Spec/migration/UI unchanged; focused và broader checks có results/deviations. Apply-completion evidence không tự cấp formal VERIFY/QA/Gate 3 hoặc lifecycle.                                                                                                                                        |

- [x] 3.1 Thực thi regression suite có scope cho launcher/CLI và package dependencies liên quan; hoàn thành khi command/results, skipped/live classification được ghi và lỗi thuộc approved scope được sửa (R1/R4).
- [x] 3.2 Thực thi một disposable integration generation bằng đúng guarded composition, chứng minh migration/fixture/READY và handled cleanup; hoàn thành khi có source/generation-bound evidence và không còn owned container/process/port sau lần kiểm tra đó (R2).
- [x] 3.3 Cập nhật `LOCAL_DEVELOPMENT.md` với command, Edge checklist, dữ liệu/PIN giả, reset/retry, stop và scoped recovery; hoàn thành khi hướng dẫn đối chiếu đúng executable behavior, docs check PASS (R3).
- [x] 3.4 Chạy completion checks, kiểm tra exact scoped diff và thu evidence implementation cho F1–F5/S1–S7/R1–R4; hoàn thành khi các task triển khai trước đó có bằng chứng và ghi riêng mọi failure/skip, để human handoff tiếp tục ở 3.5, chưa ghi formal Compliance/VERIFY/QA PASS (R4).
- [ ] 3.5 Chuẩn bị và quan sát handoff manual-test cho đúng candidate theo post-Apply record bên dưới; hoàn thành khi DEV_USABLE/MANUAL_TEST_READY có bằng chứng thực tế và human operator đã phản hồi ACCEPTED cho command/handoff trong scope (R2/R3/R4).

## Commands and evidence plan

Các lệnh thực thi dưới đây là kế hoạch cho Apply/VERIFY/QA sau authorization; chưa chạy runtime/test ở lần planning này. Unit/contract checks chạy trong child test environment không kế thừa flags integration/provider thật. Không source `.env*` hoặc in env values.

| Command                                                                                                                 | Purpose / execution boundary                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/backoffice exec vitest run test/pointage-manual-test.test.ts`                                      | Focused mới; default không DB/Next, seams/process tests có explicit inventory; live cases nếu có phải opt-in riêng và mô tả trước execution.                                                              |
| Existing bootstrap contract selector (lệnh chính xác bên dưới)                                                          | Existing pure/contract regression; giữ synthetic live flag unset, không actual-child/DB suite.                                                                                                            |
| `pnpm --filter @yuta/backoffice test`                                                                                   | Broader regression; chỉ sau rà test effects và safe environment, khai rõ unguarded actual-child/no-DB cases và skipped opt-in suites. Không tự bật live source-mutation suite.                            |
| `pnpm --filter @yuta/auth test` và `pnpm --filter @yuta/db-cloud test`                                                  | Relevant reused credential/DB guard regression, integration flags unset; report skips, không dùng shared DB.                                                                                              |
| `pnpm --filter @yuta/backoffice pointage:manual:test`                                                                   | Actual interactive disposable runtime proof và human handoff; fixed localhost, TTY, frozen safe profile, cleanup; chỉ sau Apply approval.                                                                 |
| `pnpm docs:check`; `pnpm architecture:check`; `pnpm -r --if-present typecheck`                                          | Required repository checks; typecheck cache có thể thay đổi ignored compiler output, không code. Nếu thiếu generated Next types, báo blocker và xem xét setup có authority, không tự build bằng env thật. |
| `pnpm exec prettier --check <exact six implementation paths>`; `pnpm format:check`                                      | Scoped và global diagnostics; không formatter-write unrelated files, global warning giữ provenance riêng.                                                                                                 |
| `pnpm exec openspec validate pointage-manual-test-environment --strict`; `git diff --check -- <exact attributed paths>` | Planning integrity và whitespace evidence.                                                                                                                                                                |

Bootstrap contract selector, giữ nguyên dấu pipe trong shell argument:

```powershell
pnpm --filter @yuta/backoffice exec vitest run test/pointage-raw-clocking-bootstrap.test.ts -t 'ADMISSION_TRACE_V1 pure|D1b independent re-consumer detectors|D1b strict private bootstrap contract'
```

Không cần production `next build/start` để chứng minh CLI dev-only này; Design D1 chạy existing Next dev child. Không sửa app production bundle/source. Ghi build `NOT_RUN — no changed production build target; dev command exercised` với rationale khi formal VERIFY đánh giá applicability. Không chạy `build:cloud`, `test:local`, reset shared DB hoặc archived full-browser QA để lấp chỗ trống evidence không liên quan.

## POST_APPLY_DEVELOPMENT_FEEDBACK

Adoption: `REQUIRED`. Change tạo ngày 2026-09-27, sau sự kiện human-authorized finish/archive của `development-usability-and-iteration-control` lúc `2026-09-24T09:25:12.0063622+02:00`, được ghi tại `docs/reviews/development-usability-and-iteration-control/03-final-review.md`, mục Authorized active-change finalization record; archive là `openspec/changes/archive/2026-09-24-development-usability-and-iteration-control/`. Canonical workflow/skill hiện tại chứa controls đó. Không chỉ suy từ timestamp file.

Current candidate: `manual-dev-20261001-01`, based on HEAD `516e9605ca77e24c3adacf95aafb9501c3438c37`. Exact six-file implementation diff: 91,065 bytes, SHA-256 `5423814f0e48c3df6e2f4ce70d083ccb50afeeff3468f97bb13c77885973a395`, including both untracked files. Raw target hashes, commands, observations and historical failures are recorded in `docs/reviews/pointage-manual-test-environment/apply-evidence.md`. Contracts and approved Design are unchanged.

| Assertion         | Applicability | Result  | Scope / evidence needed                                                                                                                                    |
| ----------------- | ------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEV_USABLE        | YES           | YES | Windows local Docker Desktop Linux + existing Next dev on 127.0.0.1:3001. Fresh generations passed guarded migrations, actual context/identify/end, two eligible independent synthetic employees initially NOT_CLOCKED_IN; generation 2 also passed owned cleanup and port release. No real data. |
| MANUAL_TEST_READY | YES           | YES | Operator terminal PID 25024, generation suffix 04736c859dbe4dc3a042fd04, route http://127.0.0.1:3001/pointage/synthetic-next-04736c859dbe4dc3a042fd04; context 200. Synthetic Next/Deux PINs remain only in terminal. Command, Edge checklist, Ctrl+C/reset/recovery and Windows wrapper limitation are in LOCAL_DEVELOPMENT.md. |

HUMAN_PRODUCT_VALIDATION: `AWAITING_RESPONSE`, requested 2026-10-01 for the exact candidate and live handoff above. Scope: operator command/handoff and the existing synthetic two-employee manual flow, not a new UI review. Ask the user to try identification, in/out and Terminer, then report ACCEPTED, CHANGES_REQUESTED or BLOCKED. No runtime verdict has been inferred from planning approval or the intervening “ok” acknowledgement. Preserve history; a changed affected candidate requires renewed observation. Stop before formal VERIFY until the actual human feedback resolves this record.

ITERATION_STOP_CONTROL: `RESOLVED_LOCAL_CORRECTIONS`; history retained in apply-evidence.md. Preflight Windows Docker context lookup was rejected before resources and resolved by parent-Docker-only USERPROFILE preservation, without configuration/endpoint changes. Cleanup lineage: exact claim = handled Ctrl+C owned cleanup; class = wrapper signal interruption; established cause = tsx CLI relay/one-shot listener lifetime; stage/purpose = Apply disposable command startup/stop proof. Generation 1 (74fb9233-4450-43f0-b004-89a9fdc9ecd6) reached READY but cleanup FAILED and required verified exact-ID recovery. Direct Node loader plus persistent handlers resolved the same blocker in generation 2 (93735f3b-9d09-4c40-8881-55cc838996b4). Execution budget used 2/3; failed recoveries 0/2 because the corrective run resolved the blocker. Proven Product defect: NO; implementation defect: YES, corrected; Windows wrapper exit-status limitation remains disclosed. Mandatory startup/stop evidence: satisfied; human manual feedback: pending. The separate operator handoff generation is not an equivalent failed-cleanup retry. No extra retry authority is inferred. Feedback LOCAL_CORRECTION remains bounded by the unchanged approved contracts; scope changes return to their owning review.

## POST-APPLY VERIFY PLAN

Chỉ sau Apply và applicable development feedback hoàn tất mới đánh giá riêng Technical Implementation Compliance và VERIFY. Lập Technical Compliance Matrix đủ F1–F5, S1–S7 và R1–R4 với authority → Design D1–D7 → implementation line/path → current test/check/evidence → PASS/FAIL. Không có delta requirement count giả; traceability dùng baseline outcomes → D1–D7 → Tasks/TIC, đồng thời kiểm tra hai main Specs được bảo toàn.

Phải review exact six-file scoped diff gồm staged/unstaged và untracked mới, lưu hash/path set và so protected source/migration/UI/Spec bytes với pre-Apply baseline. Re-evaluate evidence hiện có theo current candidate trước khi dùng; Apply tests không mặc nhiên là formal VERIFY. Chạy lại khi code/dependency thay đổi hoặc evidence không còn phù hợp. Ghi focused/broader command results, disposable migration proof, source/generation identity, deviations, skips và blockers. Chỉ mọi matrix row PASS mới ghi `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`; chỉ implementation khớp approved Design, không unresolved critical issue và compliance PASS mới ghi `VERIFY: PASS`.

Current: `TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED`; `VERIFY: NOT_RUN`.

## QA PLAN

Sau VERIFY PASS mới đánh giá QA theo `docs/YUTA_QA_PROTOCOL.md`. Expected classification: `UI_AFFECTING: NO`, `BROWSER_QA_REQUIRED: NO`; không thay Pointage UI. QA áp dụng cho command/operator/runtime: preflight refusal, readable two-person handoff sau READY, giữ process cho thao tác, stop/restart, cleanup và recovery messaging. Quan sát Edge do operator thực hiện hỗ trợ mục tiêu manual-use; không gọi đó là full Browser QA hoặc dùng historical raw-clocking screenshots làm evidence mới.

QA không mặc định NOT_APPLICABLE vì CLI có flow dùng thực tế. Record current candidate, safe setup, expected/observed behavior, limitations và honest `PASS | FAIL | BLOCKED_BY_ENVIRONMENT | NOT_APPLICABLE`; N/A chỉ nếu final diff thật sự không còn runtime/operator QA dimension và rationale phù hợp authority. Current: `QA: NOT_RUN`; `Browser QA: NOT_RUN`.

## Gate 3 and stop boundaries

`03-final-review.md` chỉ được tạo sau Apply hoàn tất, applicable development feedback đã giải quyết, Technical Implementation Compliance đánh giá PASS, formal VERIFY PASS và separate required QA PASS. Gate 3 vẫn `AWAITING_HUMAN_REVIEW` với sync authorization PENDING; không tự sync/archive/deploy.

Giữ bảy blocker: exact retention duration; deletion/anonymization; legal hold; backup-retention interaction; employee notice; detailed audit visibility; trusted production client-address provenance. Real employee attendance: `NOT_AUTHORIZED`. Production enablement: `NOT_AUTHORIZED`. Synthetic/disposable only; không dùng hồ sơ thật kể cả dev. Nếu guard/profile/provenance không đủ, có real target/credential requirement, scope drift hoặc cleanup ownership không xác minh được, fail closed và báo đúng blocker; không workaround để tạo PASS.
