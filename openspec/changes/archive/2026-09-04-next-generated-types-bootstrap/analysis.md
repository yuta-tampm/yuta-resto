# Change Analysis

## Scope and Change Type

- Change: `next-generated-types-bootstrap`.
- Origin: YUTA Control Tower; Discovery/Shaping: COMPLETED theo yêu cầu hiện tại.
- Classification: CROSS_MODULE / REPOSITORY_TOOLING; owner là YUTA engineering ở repository root.
- Đây là tooling/bootstrap maintenance, không thay đổi behavioral contract của sản phẩm. Không thêm runtime, quyền, data owner hoặc external provider.
- Chỉ Proposal, Analysis và Gate 1 được phép trong lượt này. Không sinh types ở checkout chính, không untrack/ignore, không sửa CI/scripts/app code lúc phân tích.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [current-state routing](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge entry](../../../docs/PRODUCT_KNOWLEDGE.md).
- [Activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [run-change skill](../../../.agents/skills/yuta-run-change/SKILL.md), [OpenSpec config](../../config.yaml), CLI proposal/analysis instructions và current main-spec path inventory.
- [Architecture overview](../../../docs/architecture/OVERVIEW.md), [ADR-001](../../../docs/decisions/ADR-001-runtime-families-and-product-visibility.md), [Lifecycle Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Module Registry](../../../docs/MODULE_REGISTRY.md).
- [Development workflow](../../../docs/DEVELOPMENT_WORKFLOW.md), [local development](../../../docs/operations/LOCAL_DEVELOPMENT.md), [root README](../../../README.md), [root manifest](../../../package.json), [workspace config](../../../pnpm-workspace.yaml), [CI](../../../.github/workflows/ci.yml), [.gitignore](../../../.gitignore), [.prettierignore](../../../.prettierignore).
- Sáu scoped instructions: [Backoffice](../../../apps/backoffice/AGENTS.md), [Web](../../../apps/web/AGENTS.md), [Booking](../../../apps/booking-web/AGENTS.md), [Feedback](../../../apps/feedback-web/AGENTS.md), [POS](../../../apps/yuta-pos/AGENTS.md), [Display](../../../apps/yuta-display/AGENTS.md). Package manifests và `next.config.ts` tương ứng đã được đọc.
- [POS offline acceptance tooling](../../../scripts/test-pos-offline.mjs), [Formalités integrity manifest](../../../docs/reviews/formalites-authorization/03-integrity.json) và các file được manifest bảo vệ.
- Next 16.2.9 đã cài tại mỗi app: `next/package.json`, `next typegen --help`; source `next/dist/cli/next-typegen.js`, `next/dist/server/config.js`, `next/dist/lib/typescript/writeAppTypeDeclarations.js` và tài liệu TypeScript đi kèm package. Đây là implementation evidence của version hiện có, không suy từ version mới trên Internet.

## Authority and Product Decision

Quyết định Control Tower trong yêu cầu hiện tại xác định `next-env.d.ts` là generated tooling output, non-authoritative, không tiếp tục tracked làm implementation evidence. Việc thiếu generated types là dependency về thứ tự bootstrap, không phải lý do duy trì tracking.

Quyết định này không nới integrity: mọi tracked source khác vẫn phải được phát hiện khi thay đổi; không có ngoại lệ Formalités. ADR-001 cho phép engineering/tooling dùng chung trong monorepo nhưng runtime/data vẫn độc lập. Root và sáu AGENTS không yêu cầu `next-env.d.ts` phải tracked. Development workflow đã phân loại generated Next declarations là formatting-excluded qua `.prettierignore`; đó không phải Git ignore.

Artifact này không phê duyệt implementation hoặc thay thế quyết định duyệt Gate 1. Không cần Product decision bổ sung cho phạm vi tooling đã bounded.

## Current Implemented State

### Exact six-app inventory

Tất cả sáu app: manifest `next: ^16.2.9`, installed `16.2.9`, `build: next build`, `typecheck: tsc --noEmit`. Cả sáu `next-env.d.ts` đang tracked. Không có app script `typegen`, `pretypecheck` hoặc `postinstall` sinh Next types.

| App path            | Package              | dev                    | start                    | Các scripts còn lại ngoài build/typecheck                                                            |
| ------------------- | -------------------- | ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `apps/backoffice`   | `@yuta/backoffice`   | `next dev -p 3001`     | `next start -p 3001`     | `test: vitest run`; `test:openai:synthetic: vitest run test/personnel-contract-openai-smoke.test.ts` |
| `apps/web`          | `@yuta/web`          | `next dev`             | `next start`             | Không có                                                                                             |
| `apps/booking-web`  | `@yuta/booking-web`  | `next dev -p 3005`     | `next start -p 3005`     | `test: vitest run --exclude e2e/**`; `test:e2e: playwright test`                                     |
| `apps/feedback-web` | `@yuta/feedback-web` | `next dev -p 3006`     | `next start -p 3006`     | Không có                                                                                             |
| `apps/yuta-pos`     | `@yuta/pos`          | `next dev -p 3003`     | `next start -p 3003`     | `test: vitest run`                                                                                   |
| `apps/yuta-display` | `@yuta/display`      | `next dev --port 3002` | `next start --port 3002` | `db:generate`, `db:migrate`, `db:push`, `db:studio`: các lệnh `drizzle-kit` tương ứng                |

Lệnh read-only đã chạy từ repository root, exit 0 và trả sáu help outputs:

```powershell
pnpm --filter @yuta/backoffice --filter @yuta/web --filter @yuta/booking-web --filter @yuta/feedback-web --filter @yuta/pos --filter @yuta/display exec next typegen --help
```

Điều này chứng minh cả sáu CLI hỗ trợ `typegen` và pnpm hiện có có thể dispatch đúng sáu app. Không phải bằng chứng generation/typecheck PASS trên sáu app.

Source `next-typegen.js` dùng config phase production-build, kiểm tra TypeScript setup, khám phá routes và sinh `routes.d.ts`, `validator.ts`, cache-life types; không chạy full application build. Cấu hình sáu app chỉ có redirects/headers tĩnh, transpilePackages, standalone output và allowedDevOrigins; không import DB/provider hoặc custom type generator. Không có `distDir` tùy chỉnh. Typegen/dev/build dùng Next sở hữu declarations; dev dùng `.next/dev`, build/typegen dùng `.next`.

**Feasibility:** một entry point root dispatch đúng sáu package bằng CLI hiện có là phương án tối thiểu có căn cứ, không cần custom generator hoặc sửa từng business app. Chưa chốt implementation script/name tại Analysis. Phải kiểm chứng execution và lỗi dừng đúng trước khi dùng kết luận này cho Apply; CLI support không bảo đảm sạch toàn bộ routes ở mọi app.

### Existing root commands and CI ordering

Root manifest dùng `pnpm --filter` cho app-specific dev/build/typecheck; `build:cloud` nối bốn cloud builds. Root `typecheck` chỉ kiểm tra Web, không phải toàn repo. Không âm thầm đổi nghĩa alias này hoặc để tên tương tự che coverage thiếu.

`.github/workflows/ci.yml`, job `architecture-and-typecheck`: checkout → Node 24.17.0/pnpm 11.8.0 → `pnpm install --frozen-lockfile` → `pnpm docs:check` → `pnpm format:check` → `pnpm architecture:check` → ba Compose config checks và `pnpm db:reset:dev --dry-run` → `pnpm -r --if-present typecheck`.

Không có typegen/dev/build trước recursive typecheck. `cloud-builds` ở checkout/job riêng nên không tạo prerequisite cho job typecheck. README chạy install → dev env sync → dev (chỉ Web); development quality flow cũng chạy recursive typecheck không generation. `dev:env:sync` không sinh Next types và không nên biến thành prerequisite có quyền DB/seed cho type generation.

Theo convention root orchestration, generation prerequisite nên sống ở root tooling/package scripts và được gọi rõ trước recursive TypeScript trong CI cùng hướng dẫn development. Không đặt trong auth module, Next runtime route, database setup, install side effect hoặc Formalités workflow. Design sẽ quyết định wiring cụ thể; Analysis không tạo implementation plan.

### Ignore and existing generated-file handling

`.gitignore` hiện có `node_modules`, `.next`, `.turbo`, `dist`, `coverage`, `playwright-report`, `test-results`, `*.tsbuildinfo`, `*.log`, `.tmp-*` cùng env/private/output rules. Không có `next-env.d.ts` rule. `.prettierignore` có `**/.next/**` và `**/next-env.d.ts`.

`scripts/test-pos-offline.mjs` lưu nội dung POS next-env khi file tồn tại và phục hồi trong cleanup. Đây là housekeeping cũ có điều kiện, không chứng minh tracking bắt buộc; không dùng vòng restore/build/restore để giải quyết issue mới. Test này vẫn cần regression sau khi file không tracked. Chưa phê duyệt refactor offline business/DB flow hoặc mở rộng sang generated artifacts khác.

### Earlier faithful Backoffice experiment, not six-app verification

Control Tower đã chấp nhận phân tích trước: worktree `D:/working/yuta/.tmp-next-env-196baccc`, snapshot `c78789a887ae6635e6ea21a1043e2fb2c9f14f17`, đủ 2.188 file; không copy `.next`, env hoặc node_modules. `pnpm install --frozen-lockfile` exit 0 nhưng không sinh types. `pnpm --filter @yuta/backoffice typecheck` lỗi TS2307 ở `packages/ui/src/yuta-brand.tsx` do thiếu declarations cho SVG có thật. `pnpm --filter @yuta/backoffice exec next typegen` exit 0; typecheck sau đó exit 0; build với CI synthetic env exit 0. Dạng import sinh ra là `./.next/types/routes.d.ts`.

Đây là evidence trước lượt này, không được trình bày như vừa chạy lại. Lượt Gate 1 chỉ kiểm tra manifests/config/source/help và integrity. Full clean-state generation/typecheck cho sáu app và recursive repo verification còn phải được thực hiện ở Apply/Verify sau phê duyệt, không được suy diễn PASS.

## Affected Boundaries

- Tooling chung điều phối các process trong từng app directory; không ghép runtime cloud, POS hoặc Display.
- Không đổi DB ownership, app imports, session, tenancy, auth, API, provider, device, product visibility hoặc business logic.
- Integrity bảo vệ tracked sources giữ nguyên. Bỏ tracking chỉ cho sáu generated declaration paths sau bootstrap proof; không ignore toàn bộ `*.d.ts` hoặc bỏ source paths khỏi integrity.
- Formalités: bốn approved implementation hashes và 18 mục approved integrity manifest khớp ở đầu lượt; snapshot bổ sung toàn bộ 17 file planning/review bao gồm Gate 3 invalidated và metadata. Recheck khi kết thúc và trước mỗi Apply/later gate. Không sửa code/spec/design/tasks/review của change đó; không tự tiếp tục sync/archive.

## Lifecycle Baseline

Module Registry không có bounded product capability cho Next generated-type bootstrap. Không tạo hoặc gán lifecycle mới chỉ để phục vụ tooling. Decision hiện tại là chỉ đạo Control Tower cho phạm vi này; implementation chưa làm, environment/production không được thay đổi hoặc suy từ local proof. External provider không thuộc phạm vi. Các lifecycle Formalités/Personnel và mọi module hiện có giữ nguyên.

## Requirement Readiness

`NO_SPEC_BEHAVIOR_CHANGE`.

Không có precise product/API/security requirement thay đổi; inventory main specs không có tooling capability bị sửa. CLI proposal instruction nêu tooling không đổi spec-level behavior dùng `skip_specs: true`, không tạo placeholder requirement. Đã ghi marker ở metadata của change mới; phải xác nhận CLI nhận Specs skipped. Gate 1 cần duyệt rõ lựa chọn nhánh này; không hiểu yêu cầu “trước Specs” là quyền tạo một spec không có hành vi sản phẩm.

Acceptance của tooling đã bounded: generation có trước recursive typecheck, đủ sáu app, failure không bị bỏ qua, clean-checkout proof, untrack chỉ sau proof, local regeneration không tracked drift, source drift khác vẫn bị phát hiện và Formalités bytes không đổi. Các điều kiện này phải trở thành technical contracts/evidence ở các gate sau, không bị mất vì skip Specs.

## UI / UX Applicability

UI_AFFECTING: NO.

BROWSER_QA_REQUIRED: NO.

Không chỉnh UI hoặc user interaction. QA phù hợp là non-browser CLI/bootstrap/Git regression; không cần tạo page pack hay screenshot QA. Actual dev/build smoke ở giai đoạn sau không phải production enablement.

## Conflicts and Unknowns

- Requirement-level CONFLICT: NONE. Không có instruction yêu cầu tracking. Chênh lệch current CI với desired bootstrap là implementation gap đã được Control Tower xác định, không phải lý do giữ tracking.
- NEEDS REVIEW — Gate 1: duyệt nhánh no-spec tooling. User yêu cầu không tạo Specs trước approval; workflow cũng không cho invent Specs. Marker không tự cấp quyền vượt Gate 1.
- Verification pending, không phải Product blocker: generation/typecheck từng app từ clean state; recursive typecheck trước untrack; dev/build/typegen Git stability; negative tracked-source drift detection; POS offline housekeeping regression. Không claim đã hoàn tất.
- Design-only: root command wiring/name, direct app typecheck usage guidance, bounded ignore form, failure propagation và repeatability evidence. Không cần authority mới; nếu cần đổi runtime/auth/business logic, broad ignore/integrity exception hoặc dependencies thì STOP.
- Attribution risk: HEAD `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`, worktree có nhiều thay đổi unrelated. Backoffice next-env đã drift từ dev import sang build import trước change này. Các source/workflow/docs modifications khác không được nhận làm tooling implementation. Recheck scope trước Apply; không revert drift chỉ để khớp hash.
- Documentation observation: Product Knowledge entry còn câu “no current change artifact” dù có active Formalités; đó là routing text stale, không phải lifecycle authority hoặc permission sửa Formalités. Không normalize trong change này.

## Analysis Conclusion

`NO_SPEC_BEHAVIOR_CHANGE` — phạm vi repository tooling đã rõ; `skip_specs: true` phù hợp. Không có capability được chuyển sang delta Specs. Chưa có implementation hoặc bootstrap verification sáu app được hoàn thành.

Dừng tại Gate 1 `AWAITING_HUMAN_REVIEW`. Sau approval hợp lệ, workflow no-spec phải đánh giá Design applicability riêng; không bỏ Design/Sensitive Design Gate chỉ vì skip Specs. Cross-module generated-evidence convention là điểm cần đánh giá thận trọng ở bước đó. Không tạo Design/Tasks trong lượt này; không sync/archive Formalités hoặc thay đổi production.
