## Context

Revision 2026-09-04: user accepted Phase 3 F1/F2 and requested bounded Technical Design return only. Gate 1/no-spec decision unchanged; Tasks and Apply remain frozen until a new Sensitive Design approval. Prior successful Phase 3 clean/install/typegen/typecheck/build/stability evidence is preserved, not relabeled invalid by this design revision. No Phase 3 continuation or retracking.

Xem [Proposal](proposal.md) và [Analysis](analysis.md). Gate 1 đã được user duyệt cho `NO_SPEC_BEHAVIOR_CHANGE`, `skip_specs: true`; không có delta Specs hoặc Gate 2. Technical Design áp dụng vì thay đổi orchestration và generated-evidence convention xuyên sáu app. Sensitive Technical Design Gate bắt buộc; tài liệu này không cho phép Apply.

Authority: [Gate 1](../../../docs/reviews/next-generated-types-bootstrap/01-analysis-review.md), [root instructions](../../../AGENTS.md), sáu scoped AGENTS và các source dẫn trong Analysis; [development workflow](../../../docs/DEVELOPMENT_WORKFLOW.md), [CI](../../../.github/workflows/ci.yml), [runtime ADR](../../../docs/decisions/ADR-001-runtime-families-and-product-visibility.md), [workflow integrity](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md). Package manifests là authority cho script/version; Next đã cài là 16.2.9.

## Goals / Non-Goals

**Goals:** một prerequisite tường minh, nhỏ, fail-fast, dùng Next-owned generator; clean-checkout reproducibility cho sáu app; Git chỉ theo dõi source authority, không generated next-env; bằng chứng source-integrity không yếu đi.

**Non-Goals:** sửa Formalités, Product behavior, application business logic, auth/tenancy, runtime/data ownership, schema/migration, providers, deployment/production, broad integrity exception; không đổi Next/pnpm version hoặc custom declarations. Không tạo Tasks, tests hoặc scripts trong lượt Design. Không đồng nhất local build với production readiness.

## Decisions

### D1 — Exact six-app root orchestration (revised after F1/F2)

**SUPERSEDED_FOR_FAILURE_PROPAGATION:** D1/D2 của Design SHA-256 `0526ad7cb18000d76d27588bda469e6a5522ef7744268b491b1236baff5c2dc9` cho rằng raw `next typegen` luôn trả nonzero khi lỗi và chỉ cần nối shell `&&`. Investigation đã đo actual Next 16.2.9 trả **0** sau config rejection. Chỉ giả định này và wiring phụ thuộc nó bị thay thế; quyết định generated/non-authoritative, six-app scope và các happy-path findings đã đạt vẫn giữ nguyên.

Giữ public repository command `pnpm typegen:next`. Revision đề xuất đổi duy nhất implementation của alias thành `node scripts/generate-next-types.mjs`: một script Node nhỏ chỉ orchestration/validation, không declaration generator, package/runtime mới hoặc dependency mới. Chưa tạo file/script thật trong lượt Design.

Fixed allowlist và thứ tự giữ nguyên:

| Thứ tự | App path            | Exact package        |
| ------ | ------------------- | -------------------- |
| 1      | `apps/backoffice`   | `@yuta/backoffice`   |
| 2      | `apps/web`          | `@yuta/web`          |
| 3      | `apps/booking-web`  | `@yuta/booking-web`  |
| 4      | `apps/feedback-web` | `@yuta/feedback-web` |
| 5      | `apps/yuta-pos`     | `@yuta/pos`          |
| 6      | `apps/yuta-display` | `@yuta/display`      |

Root lấy từ vị trí script, không browser/input hoặc tùy ý cwd. Preflight exact sáu app manifests/name và installed Next version 16.2.9; missing/mismatched target hoặc version ngoài đã review làm nonzero trước generation. Resolve public CLI qua installed `next/package.json` bin metadata theo từng app; không import/call `nextTypegen` private API. Resolve installed TypeScript ở mỗi app để parse output; không install thêm.

Mỗi child được spawn bằng `process.execPath`, argument array, `shell:false`, cwd app:

```text
node --unhandled-rejections=strict <resolved installed Next CLI> typegen
```

Node option chỉ áp dụng child generator, không đặt global NODE_OPTIONS hoặc thay process error behavior của app/server/pnpm/typecheck. Không sửa config/business source để ép Next exit đúng. stdout/stderr được chuyển tiếp để chẩn đoán; **không** grep log/success string để quyết định kết quả. Không tự scan/reimplement route generation, viết declaration content hoặc patch Next.

So với raw pnpm six-chain, fixed manifest/name preflight thay trách nhiệm missing-target fail-closed của `--fail-if-no-match`; không có generic filter input hoặc skip target. Giữ negative pnpm filter command V6 như compatibility diagnostic, nhưng proof cho bootstrap mới phải test chính preflight mới. Không cần thêm tùy chọn single-app: mọi supported bootstrap dùng sáu-app entrypoint; raw Next CLI chỉ là diagnostic low-level.

**Alternatives evaluated:** raw CLI status-only thất bại F1; strict process status-only bắt được config/async rejection nhưng chấp nhận premature exit 0 + stale files; chọn strict + fresh bounded output validation D2. Full build làm bootstrap nặng và cần env; private generator API/log-string matching không được chọn. Không nâng Next/pnpm.

Chi tiết executable research, exact commands/exits và limitations trong [bounded investigation](../../../docs/reviews/next-generated-types-bootstrap/02b-investigation.md). Đây là design feasibility evidence, không thay Phase 3 QA hoặc Tasks/Apply approval.

### D2 — Fail-closed process and fresh-result boundary

Giữ root `typecheck` chỉ Web, mọi app `typecheck: tsc --noEmit`, các `typecheck:*`, dev/build aliases. CI job `architecture-and-typecheck` và step `Type-check workspaces` tiếp tục chính expression đã có:

```sh
pnpm typegen:next && pnpm -r --if-present typecheck
```

Không cần diff CI bổ sung nếu expression vẫn đúng. Không ignore failure, không later cloud-build prerequisite. `&&` nay phụ thuộc exit của **validated orchestrator**, không coi raw Next exit 0 là đủ.

**Mỗi app, trước khi cho chạy app kế tiếp:**

1. Preflight chỉ đúng default `.next` generated paths, không linked/reparse parents, không tracked artifact, không path ngoài app. Fail closed nếu unexpected file kind/path/config-output layout. Không theo symlink tới source/ngoài repo.
2. Loại đúng bốn generated regular files dưới đây nếu tồn tại, bằng non-recursive unlink sau path checks; sau đó xác nhận absent. Không remove toàn bộ `.next`, không xóa `*.d.ts`, không chạm source/tsconfig/caches khác. Đây là invalidation để chứng minh freshness, không cleanup job hoặc cách làm sạch Git.
3. Spawn actual Next CLI với strict flag. Nonzero, signal, spawn error hoặc timeout 120s đều làm bootstrap nonzero; không chạy later generator hoặc recursive typecheck. Timeout phải chờ child được terminate, không báo thành công khi child còn chạy.
4. Chỉ khi child exit 0, đọc lại output mới dưới đúng app, regular-file/non-linked/nonempty; dùng TypeScript parser đã cài, reject parse diagnostics; validate bounded structure/reference trong bảng.
5. Chỉ sau tất cả điều kiện PASS mới chấp nhận app và chạy app kế tiếp. Chỉ cả sáu PASS mới bootstrap exit 0. Một failure có thể để lại partial ignored output; không rollback/reuse nó như success. Rerun từ đầu theo cùng freshness checks.

| Exact per-app artifact        | Bounded validation for current six Next 16.2.9 configs                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `next-env.d.ts`               | Type references `next`, `next/image-types/global`; import chính xác `./.next/types/routes.d.ts`; parseable TypeScript                                  |
| `.next/types/routes.d.ts`     | Nonempty parseable declarations, expected `AppRoutes` alias và `ParamMap` interface; module exports expected route/param types referenced by validator |
| `.next/types/validator.ts`    | Nonempty parseable TypeScript, type import `./routes.js`, expected `AppPageConfig` / `LayoutConfig`; Next-owned page/layout validation structure       |
| `.next/types/cache-life.d.ts` | Nonempty parseable TypeScript, declaration module `next/cache` với `cacheLife` declarations theo current default config                                |

Cả bốn hiện được sinh bởi sáu app; source Next cho thấy cache-life conditional theo config. Thiết kế **fail closed**, không tùy ý skip artifact nếu config/version sau này thay đổi. DistDir, disabled image typing, cache-life/route layout thay đổi cần review bounded validation trước; không tự sửa app config. Validator kiểm tra output structure, không tạo/so sánh lại complete route semantics; Next vẫn sở hữu generation và downstream TypeScript vẫn sở hữu type correctness.

Freshness không dựa mtime, old hashes, log marker hoặc file chỉ “đã tồn tại”. Prime stale files rồi premature exit 0 vẫn phải bị reject vì old files đã bị loại trước child. Không khôi phục old output khi lỗi. Test cả missing/empty/malformed/wrong-reference output, lỗi ghi file, actual async rejection và premature exit 0.

Serial orchestration không là transaction. Dùng single-run lock riêng `.tmp-next-typegen.lock` ở root để reject concurrent bootstrap trước unlink; release owned lock trong finally. Không chạy cùng Next dev/build/typegen trên checkout đó: detect current `.next/lock` và `.next/dev/lock`, document exclusive-checkout prerequisite. Không tự kill process người dùng hoặc force-remove unknown lock. Uncooperative external process sửa output đồng thời không thuộc trusted tooling assumption; không claim lock này kiểm soát mọi Next process.

Cross-platform: Node public CLI/argument arrays/fs/TypeScript APIs chung Windows và POSIX, không shell env syntax/cmd quoting trong implementation, không pnpm shim dependency trong child. CI outer conjunction vẫn POSIX/Windows package script convention; thực nghiệm lượt này trên Windows, Linux execution còn phải được chứng minh ở verification sau approval. Không thể suy Linux PASS từ inspection.

### D3 — Direct app typecheck: documented prerequisite

Chọn **documented prerequisite**, áp dụng cùng quy tắc ở local và CI. Trước raw app/recursive typecheck sau checkout sạch, sau đổi route/config hoặc sau xóa generated output, developer chạy validated `pnpm typegen:next`, kể cả khi chỉ cần một app. Raw `next typegen` không còn là supported fail-closed prerequisite; chỉ dùng để diagnostic có giới hạn. Không thêm single-app option trong remediation này.

Không hứa raw `tsc --noEmit` tự bootstrap. Nếu chạy trực tiếp trước generation, có thể lỗi thiếu Next declarations; lỗi này không được xử lý bằng cách commit file generated. Một app tình cờ PASS trước generation cũng không chứng minh prerequisite đã đủ cho all-app flow.

Tài liệu dùng cùng chuỗi `pnpm typegen:next && pnpm -r --if-present typecheck` như CI; trong PowerShell cũ không hỗ trợ `&&`, chỉ chạy lệnh thứ hai khi `$LASTEXITCODE -eq 0`. Package script chạy qua package-manager shell trên Windows/POSIX. Không chỉ chạy hai lệnh độc lập rồi bỏ qua exit code.

Trade-off: developer có trách nhiệm bootstrap trước lệnh low-level. Tránh dependency vào cấu hình pnpm pre/post hook và tránh implicit generation trong mỗi recursive app typecheck. Không thay đổi global shell hoặc pnpm settings.

### D4 — Faithful clean-state proof before untracking

Trước Apply, tạo snapshot có provenance và isolated disposable checkout phản ánh **current approved source**, gồm các file chưa commit cần thiết; không dùng HEAD cũ thiếu implementation. Không stage/commit unrelated work vào branch chính. Lưu HEAD/tree, source inventory/hashes, pnpm/Node versions và EOL policy. Xác nhận mọi tracked asset hiện diện; không dùng compiler simulation hoặc node_modules symlink từ checkout chính.

Trong bản thử: loại đúng sáu next-env files để mô phỏng checkout sau untracking; không có `.next` ở sáu app hoặc `.tsbuildinfo` cũ. Cài `pnpm install --frozen-lockfile`; không copy ignored env/generated output. Xác nhận install chưa sinh types. Sau đó chạy root generator dự kiến, từng app typecheck, rồi recursive typecheck. Không dùng build để lén chuẩn bị một app trước khi đo typegen.

Mỗi app phải có: path/package/Next version, absent-before states, command/exit, `next-env.d.ts` generated references, `routes.d.ts` và `validator.ts` present, actual typecheck exit và tracked-diff review (đặc biệt `tsconfig.json`). File `cache-life.d.ts` ghi nhận khi generator sinh. Không cho tắt compiler checks hoặc nới tsconfig để thành PASS. Original assets hash đúng; lỗi khác phải tách riêng và không dùng làm bằng chứng giữ tracking.

Sau proof tiền untrack, kiểm chứng lại từ **checkout mới với candidate untrack+ignore diff**: không next-env trong Git, không `.next`, frozen install → generator → từng app typecheck → recursive check. Bằng chứng warm checkout không thay thế một trong hai mốc này.

**Fixture protocol correction — bắt buộc trước mọi negative invocation:** dùng đúng current-candidate snapshot method đã chứng minh ở main Phase 3: temporary Git index, stage exact working bytes bằng `git -c core.autocrlf=false -c core.safecrlf=false add -A`, detached snapshot checkout bằng `git -c core.autocrlf=false worktree add --detach <isolated-root> <snapshot>`. Không stage/commit vào branch/index chính. Record nguồn/path/hash, tree/commit, EOL settings và original index before/after. Frozen install không copy env/node_modules/generated caches.

Trước synthetic mutation, compare **toàn bộ candidate path set + raw SHA-256**, rồi Formalités 4/4 implementation + 18/18 integrity + 17/17 supplemental. Sau đó mới inject đúng intended failure trong disposable fixture; record exact injected diff/hash. Trước invocation kiểm lại mọi path ngoài injection + Formalités; sau test kiểm lại. Nếu reuse một fixture cho investigation matrix, conditional injections phải được ghi nhận từ đầu, từng case chỉ bật đúng synthetic mode, hash source ngoài injected allowlist vẫn nguyên. Final acceptance V5 cần isolated per-case initial state, không dựa fixture cũ chưa qualified. Bất kỳ mismatch/error hoặc baseline chưa đầy đủ: không chạy. Không dùng CRLF-normalized equality hoặc Git-clean thay raw bytes. PowerShell hash path dùng `-LiteralPath` (routes có dấu `[]`), assertion errors terminate. Fixture âm tính cũ F2 chỉ diagnostic; không nâng thành acceptance.

### D5 — Six exact ignore rules and local retention

Chỉ sau D4 proof tiền untrack: bỏ tracking đúng sáu paths bằng scoped `git rm --cached -- <exact paths>` và thêm sáu rule root-anchored:

```gitignore
/apps/backoffice/next-env.d.ts
/apps/web/next-env.d.ts
/apps/booking-web/next-env.d.ts
/apps/feedback-web/next-env.d.ts
/apps/yuta-pos/next-env.d.ts
/apps/yuta-display/next-env.d.ts
```

Giữ local files, không xóa để ép clean status; nếu Git từ chối do staged/unrelated thay đổi thì STOP để isolate, không force. Giữ nguyên `.next`, `*.tsbuildinfo`, `.prettierignore` rules hiện có. Không ignore `*.d.ts`, source trees, tests hoặc reviews.

Bằng chứng: `git ls-files -- <six paths>` rỗng; `git check-ignore -v -- <six paths>` trỏ sáu rule exact; file tồn tại sau generation và `git status --short -- <six paths>` không báo local regeneration drift. Trong checkout đang Apply, staged deletion là **expected tooling diff**, không phải regeneration noise; dùng post-change disposable snapshot để chứng minh clean status sau regenerate. Không sửa evidence manifest của Formalités để giấu deletion.

### D6 — Generated-state stability and source-integrity negative control

Trong isolated post-change checkout, ghi inventory tracked source hash trước/sau `next typegen`, `next build` và dev smoke. next-env được phép đổi dev/build import; không cần stable bytes cho ignored output. Tracked files khác, gồm tsconfig/manifest/source, không được tự thay đổi mà không giải thích/approval. Dừng và report nếu Next tự chỉnh tsconfig ngoài scope; không restore/build/restore.

Mandatory source-integrity negative control dùng một file **không thuộc Formalités**, ví dụ root `README.md`, trong disposable snapshot: ghi baseline byte SHA-256 và path set, thêm một marker harmless, xác nhận `git diff --exit-code -- README.md` exit 1, `git status` thấy đúng path, SHA-256 khác baseline và phép so sánh review-integrity hiện có đánh dấu mismatch. Check `git check-ignore --no-index README.md` không match. Generated next-env cùng lúc vẫn ignored; control không đạt nếu chỉ test next-env hoặc chỉ đọc rule text. Bỏ disposable fixture sau test, không sửa/khôi phục source chính, không sửa workflow skill hoặc tạo broad exception.

Gate 3 vẫn dùng exact scoped implementation inventory, diff, hashes và path-set equality theo current workflow. Negative test không giả vờ user phê duyệt drift hoặc chỉnh Formalités review status. Không cần tạo integrity framework mới.

### D7 — POS offline housekeeping

`scripts/test-pos-offline.mjs` hiện chỉ dùng `readFileSync`/`writeFileSync` cho snapshot/restore next-env; `existsSync` còn dùng kiểm tra dependencies. Sau untracking, housekeeping này không còn cần và có thể ghi đè generated state mới bằng state cũ.

Bounded adjustment: bỏ `posNextEnvPath`, `originalPosNextEnv`, capture block trước POS build, restore block trong cleanup và hai import read/write không còn dùng. Giữ `existsSync`, toàn bộ container lifecycle, seed/migration test setup, ports, process cleanup, offline/auth/order/report assertions, env và business behavior. Không thêm thao tác xóa generated file.

Đây là tooling-only deletion được user yêu cầu đánh giá tại Design, không refactor POS. Phải chạy offline regression từ isolated state có file absent và có generated file sẵn; generated file được phép còn sau cleanup. Database/container không sẵn: bằng chứng required BLOCKED, không claim QA/VERIFY PASS. Existing disposable migration bên trong acceptance test không phải quyền chạy production migration.

### D8 — Minimum documentation and file surface

Implementation surface giữ nguyên root `package.json`, CI expression, `.gitignore`, sáu tracking deletions, bounded POS housekeeping, README/Development Workflow và focused harness. Delta sau F1 chỉ thêm planned `scripts/generate-next-types.mjs` (Node orchestration/output validation, không generator), đổi `typegen:next` implementation và cập nhật trực tiếp docs/harness cần thiết. CI expression hiện đúng, không sửa nếu không cần. Đây là surface để Tasks được sửa sau Sensitive Design approval; chưa cấp quyền Apply.

README cập nhật setup/quality snippet và direct-app prerequisite. Development workflow giải thích command/ordering, raw typecheck không tự sinh types, sáu-app scope, rerun khi routes đổi và generated files không commit. Không sửa unrelated stale Product Knowledge, module lifecycle hoặc database-development instructions vì typegen không cần DB bootstrap. Không sửa sáu app manifests, shared UI, tsconfig, dependencies, lockfile hoặc auth consumers.

Test mới dùng Node built-in test/fs/process/assert hiện có; chỉ fixtures trong temp, không production/real data. Không thêm dependency, package hoặc root test framework; exact implementation tasks sẽ được tạo sau approval riêng.

### D9 — Formalités protection and evidence scope

Before/after design và mỗi mutation/verification stage của Apply: đối chiếu bốn implementation hashes, 18/18 entries của `docs/reviews/formalites-authorization/03-integrity.json` và 17-file supplementary review/planning baseline trong Gate 1. So sánh exact bytes và path set, không chỉ Git status vì có untracked files. Bất kỳ mismatch: STOP, report expected/actual, không regenerate approval evidence để che drift.

Không sửa Formalités code/spec/design/tasks hoặc packet, không regenerate Gate 3, không sync/archive. Tooling completion chỉ gỡ nguyên nhân kỹ thuật; không tự phê duyệt lại Formalités. Không promote Environment/Production Readiness.

## Technical Verification Plan

Các mục dưới là **planned evidence**, chưa thực thi trong lượt Design. Mỗi command phải lưu working directory, target snapshot, exact exit và output; không gộp TECHNICAL IMPLEMENTATION COMPLIANCE, VERIFY và QA thành một PASS.

| ID  | Exact command / method after implementation                                                                                                                                                                                      | Required result and evidence                                                                                                                                                                                                                                                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V1  | `pnpm install --frozen-lockfile` ở hai clean checkpoints D4                                                                                                                                                                      | Install PASS; đủ tracked assets; sáu next-env/.next absent trước generation; không reused build state                                                                                                                                                                                                                   |
| V2  | `pnpm typegen:next` với revised orchestrator                                                                                                                                                                                     | Sáu actual CLI invocations strict mode; mỗi child exit 0 và bốn fresh artifacts D2 valid; no unintended source changes                                                                                                                                                                                                  |
| V3  | `pnpm --filter <package> typecheck` cho đúng sáu package D1                                                                                                                                                                      | Sáu exit 0 sau generation; ghi riêng từng app; direct-before-generation result ghi nhận nhưng không dùng làm success criterion                                                                                                                                                                                          |
| V4  | `pnpm typegen:next && pnpm -r --if-present typecheck`                                                                                                                                                                            | Exit 0 trên faithful clean source; all applicable workspaces; không dựa job build sau                                                                                                                                                                                                                                   |
| V5  | Exact-byte qualified per-case fixtures: mỗi app config throw/rejected promise; chạy revised root/CI conjunction                                                                                                                  | Sáu vị trí lỗi: child/bootstrap nonzero, no later generator/no recursive invocation (trace). Thêm premature exit 0 với stale outputs primed, missing/empty/malformed/wrong-reference fresh output, write failure, spawn error/timeout và concurrent-run denial; không dùng harness simulation thay actual Next evidence |
| V6  | Bootstrap preflight thiếu/mismatch một fixed package; giữ `pnpm --filter @yuta-no-such-bootstrap-probe --fail-if-no-match exec next typegen --help` diagnostic                                                                   | Missing target fail closed trước generation; record actual bootstrap evidence độc lập với pnpm diagnostic                                                                                                                                                                                                               |
| V7  | `pnpm --filter @yuta/backoffice build`; `pnpm --filter @yuta/web build`; `pnpm --filter @yuta/booking-web build`; `pnpm --filter @yuta/feedback-web build`; `pnpm --filter @yuta/pos build`; `pnpm --filter @yuta/display build` | Sáu build exits recorded và PASS required: tất cả affected entry declarations cùng config/transpile/standalone variants cần regression. CI synthetic env/local isolated env theo owning app, không secrets/DB/provider production; ngoại lệ/blocker phải report, không fix business logic                               |
| V8  | `pnpm --filter <package> exec next dev --hostname 127.0.0.1 --port <free-test-port>` từng app                                                                                                                                    | Dev Ready và Next declarations generated; dừng đúng process. Không cần authenticated browser/API mutation. Thực hiện cả sáu khi local port/process environment cho phép; unavailable phải ghi rõ app/lý do, không coi source inspection là runtime PASS                                                                 |
| V9  | D5 Git checks + tracked-byte inventory, trước/sau mode runs và fresh-artifact invalidation                                                                                                                                       | Six files untracked/ignored, freshness không lấy cache cũ; chỉ bốn generated files/app được invalidated, linked/tracked/out-of-root output rejected; no tracked drift                                                                                                                                                   |
| V10 | README negative control D6                                                                                                                                                                                                       | Tracked source vẫn visible trong Git và SHA mismatch làm integrity comparison reject                                                                                                                                                                                                                                    |
| V11 | `pnpm test:pos:offline` trong disposable setup của script, hai initial states D7                                                                                                                                                 | Full offline acceptance PASS; process/container cleanup còn đúng; no restoration of obsolete next-env; unrelated POS byte/diff review                                                                                                                                                                                   |
| V12 | `node --test scripts/next-generated-types-bootstrap.test.mjs` sau approved remediation                                                                                                                                           | Exact mapping, manifest preflight, strict process options, output freshness/structure, failure/signal/timeout, lock/path safety, CI conjunction, unchanged aliases/ignores/POS. Bổ sung real V5; không giữ shell-simulation PASS như toàn bộ failure proof                                                              |
| V13 | `pnpm docs:check`; `pnpm architecture:check`; `pnpm -r --if-present typecheck`; `pnpm format:check`; `openspec validate next-generated-types-bootstrap --strict`                                                                 | Exact results; format failures pre-existing tách riêng, không normalize unrelated files. No-spec validation remains valid                                                                                                                                                                                               |
| V14 | Gate 1/D9 hashes, D4 exact-byte fixture protocol, scoped diff                                                                                                                                                                    | Proposal/Analysis/metadata/Tasks preserved trong design revision; Formalités 4/4 + 18/18 + 17/17 và full candidate checked before injection/invocation, outside-injection hashes after; old F2 fixture never acceptance                                                                                                 |

Build/dev chứng cứ chỉ là local tooling, không deploy. Nếu không thể chạy required clean-bootstrap/build/offline evidence an toàn: đánh dấu BLOCKED và không đưa Gate 3 ready. Dev smoke thiếu phải report là coverage limitation để review, không tự mở rộng quyền môi trường.

## Risks / Trade-offs

- [Root list có thể stale] → exact six mapping test, fail-if-no-match, future Next app phải có tooling review; không silently target mọi app wildcard.
- [Developer quên prerequisite] → cùng documented command local/CI, không lén đổi alias; thiếu declarations dẫn compiler failure có hướng dẫn recovery.
- [Raw Next false-success / stale output] → strict child process + D2 fresh validated artifacts; outer `&&` tin validated bootstrap exit, không tin riêng raw Next. Partial output không là success/transaction; rerun từ đầu. Generated cleanup chỉ bốn exact files sau safety checks.
- [Current warm tree che thiếu bootstrap] → hai faithful clean checkpoints, assets inventory và no generated cache.
- [Untracking làm source bị ignore quá rộng] → sáu root-anchored paths + negative source/hash control, giữ nguyên general Gate 3 rule.
- [Next/dev/compiler hoặc Windows EOL tạo unrelated drift] → byte snapshots, log exact before/after, STOP để review nếu tracked source đổi; không restore loop.
- [Dirty Formalités/workflow files] → exact protected manifest checks; chỉ scoped change diff; không nhận unrelated work làm own implementation.

## Migration Plan

Đây là source/tooling transition local, không deployment hoặc database migration. Sau riêng approval Tasks/Apply: dựng orchestration và docs/CI prerequisite trong candidate; chứng minh D4 tiền untrack; sau đó scoped index removals + ignores + D7 housekeeping cùng coherent tooling diff; kiểm chứng post-change clean checkpoint và full verification matrix. Không chuyển bước untrack lên trước proof.

Nếu proof thất bại trước untracking: giữ tracking hiện có tạm thời, report blocker và sửa tooling trong phạm vi duyệt; không kết luận tracking là canonical solution. Nếu thất bại sau candidate untracking: chưa commit/release/finish, giữ evidence, roll forward bootstrap hoặc xin review. Không tự tái tracking, không restore generated output lặp lại, không chạy destructive reset hoặc restore unrelated data. Production không thuộc migration plan này.

## Open Questions

Không còn lựa chọn remediation bắt buộc bị bỏ ngỏ: validated Node orchestrator D1/D2 dùng actual Next CLI, strict rejection mode và fresh structural output checks. Giữ documented prerequisite, CI conjunction, exact six ignores và bounded POS housekeeping. Linux execution, concurrency/timeout/output corruption matrix và full Phase 3 coverage vẫn là verification obligations sau approval, không phải PASS từ investigation. Không đổi decision, retrack hoặc làm production operation để né verification.

Dừng tại Sensitive Technical Design Gate; chưa tạo Tasks hoặc Apply.
