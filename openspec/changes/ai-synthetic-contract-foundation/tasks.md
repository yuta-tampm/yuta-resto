## Task Context

COLLABORATION_MODE: CODEX_ONLY

MODE_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `Codex một mình (CODEX_ONLY)`.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: current-user intake `YES` ngày 2026-10-03, local commit sau khi hoàn tất planning.

Authorized phase: **PLANNING ONLY**. Checklist dưới đây mô tả implementation tương lai, chưa được thực hiện hoặc cho phép Apply trong tác vụ hiện tại. Gate 1, Gate 2 và sensitive Design approval chỉ cho phép hoàn tất planning. Không tạo Gate 3, sync/archive, qualification/production, Storage hay remote delivery.

Requirement baseline: [Proposal](proposal.md#requirement_baseline); behavioral contract: [Specs](specs/ai/synthetic-personnel-contract-extraction/spec.md); technical decisions: [Design](design.md). Design có `Open Questions: NONE` trong bounded scope.

Review evidence: [Gate 1](../../../docs/reviews/ai-synthetic-contract-foundation/01-analysis-review.md), [Gate 2](../../../docs/reviews/ai-synthetic-contract-foundation/02-specs-review.md), [Sensitive Design](../../../docs/reviews/ai-synthetic-contract-foundation/02b-design-review.md), đều `APPROVED` từ review độc lập. Phải rehash trước resume; raw OpenSpec readiness không phải Apply authorization.

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

## 1. Foundation / Data

Chỉ AI foundation; không persistent data hoặc migration.

### TECHNICAL IMPLEMENTATION CONTRACT

- Root: `D:/working/yuta/yuta-resto`; runtime owner: Backoffice server. Domain types/result semantics: Personnel. Foundation không repository/DB/storage effect.
- Authorities: [root AGENTS](../../../AGENTS.md), [Backoffice AGENTS](../../../apps/backoffice/AGENTS.md), [Architecture Overview](../../../docs/architecture/OVERVIEW.md), [DB boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), approved [Design decisions 1–4](design.md#decisions), và public exports `@yuta/contracts/personnel`.
- Resolved constraints: server-only; one typed capability; existing transport schemas; separate eligibility/selection; no package/dependency/env/schema/registry mới. Domain type reuse bằng type-only imports, không value cycle.
- Intended files: `apps/backoffice/src/server/ai/{contracts,policy}.ts`, `apps/backoffice/test/ai-synthetic-personnel-contract-extraction.test.ts`, `apps/backoffice/test/ai-synthetic-personnel-contract-extraction.types.ts`.
- Required checks: targeted offline Vitest policy tests, Backoffice `tsc --noEmit` để thực sự kiểm tra type fixtures, architecture check và scoped format/diff check.
- Completion evidence: capability input/result inference và rejected invalid input/version; real/unknown/non-development denial; mapping-outside-eligible spy không invoke; no secret/config/browser leakage; exact source diff.

- [ ] 1.1 Tạo one-entry typed capability map, input/result và trusted execution descriptor; kiểm chứng bằng `tsc` fixtures cho literal inference, unsupported capability/version và sai input (`@ts-expect-error`), không dùng public `unknown`/`any`.
- [ ] 1.2 Khai báo readonly versioned deployment/policy records cho đúng bốn existing execution kinds; kiểm chứng config tests giữ Luna/v4/default/scenario behavior, một owner constants và không có credentials trong descriptor/serialized config.
- [ ] 1.3 Tạo eligibility và static selection riêng; kiểm chứng supported-context success, empty-set/mapping-outside-set/unknown purpose/classification/modality/config/non-development denial với adapter spy bằng zero.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT

- Canonical owners: Personnel cho source controls/authorization/audit/validation/Human apply; AI server composition cho execution/config/provider bridge. Cloud tenant scope không đổi.
- Authorities: root/Backoffice AGENTS, [tenancy](../../../docs/architecture/TENANCY.md), [Personnel Home](../../../docs/features/personnel/README.md), [ADR-009](../../../docs/decisions/ADR-009-release-a-customer-exposure.md), [readiness gates](../../../docs/operations/PRODUCTION_READINESS.md), approved Design decisions 2–6 và Specs. Provider eligibility documentation không cấp real-data hoặc API-call authorization.
- Resolved constraints: source provenance từ guarded domain branch, không browser classification; source/load/version/permission denial trước effect; eligibility trước adapter resolution; giữ stored checksum/provider-once trước remap; strict validation, một deadline/terminal observation; no UI/transport/persistence/field-allowlist change.
- Intended write files: `apps/backoffice/src/server/ai/{executor,runtime}.ts`, `apps/backoffice/src/server/personnel-contract-extraction/{service,runtime}.ts`, `apps/backoffice/src/app/(authenticated)/equipe/salaries/contract-extraction-actions.ts`, capability/service/runtime tests và targeted action denial test nếu coverage hiện có chưa đủ.
- Preserve implementations: `openai-adapter.ts`, `synthetic-upload.ts`, `stored-synthetic-document.ts`, `review-store.ts`, extraction prompt/corpus/evaluator và all public contracts. Reuse các adapter/guard đó qua composition; không wholesale rewrite. Nếu cần sửa một protected behavior, quay lại scope/gate thay vì tiện thể refactor.
- Required checks: offline fake-fetch/service/runtime/capability tests, source guard/review-store tests, sensitive cross-scope/action denial tests, Backoffice typecheck, architecture/scoped format checks.
- Completion evidence: mọi application extraction path dùng typed executor; ordering spies và no-effect denial; old source branches/payload/default/timeout/review/apply/audit giữ behavior; exact allowlisted observations và late-timeout negative cases.

- [ ] 2.1 Tích hợp trusted descriptor và typed executor sau authorization/version/source/preparation; kiểm chứng denial cho wrong organization/establishment, permission/membership, stale versions và unavailable exposure không đọc bytes/prepare/invoke, browser values không thành authority.
- [ ] 2.2 Compose các existing default/OpenAI/stored-offline/stored-provider-once paths từ server config; kiểm chứng fake-fetch tests cho Luna/v4 và stored checksum/page/scenario/consumption/remap guards, không resolve adapter ngoài eligible set hoặc sau mapping denial.
- [ ] 2.3 Inject domain-owned result validator và một adapter deadline; kiểm chứng malformed/extra-key/wrong identity/version/page result, timeout và late completion không tạo typed success, review hoặc success observation; giữ rate-limit behavior và existing error mapping.
- [ ] 2.4 Thêm sanitized optional observation callback, bridge existing provider QA diagnostics tại composition; kiểm chứng canary exclusions, sink exception không đổi result, một terminal event và không nuốt mandatory audit/review errors.
- [ ] 2.5 Bảo toàn transient scoped review, 15-minute expiry/completed audit proof và Human apply field allowlist; kiểm chứng expired/fabricated/cross-scope/stale review denial, idempotent bounded apply và không automatic employee/Register update bằng existing hoặc targeted tests.

## 3. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT

- Owner: Backoffice/Personnel integration; current documentation owner: YUTA engineering. No POS/Site Agent/Display changes. QA là backend/non-browser; security denial evidence vẫn mandatory.
- Authorities: root/Backoffice AGENTS, [automated workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), approved earlier gates/Specs/Design, Personnel Home, Architecture Overview và readiness/private-evidence rules.
- Intended files: AI/extraction targeted tests, relevant existing tests nếu phải cập nhật dependency wiring; `docs/features/personnel/README.md`, bounded app-owned provider/capability paragraph trong `docs/architecture/OVERVIEW.md`; existing Tasks và canonical implementation review/evidence paths chỉ khi được cho phép Apply sau này.
- Resolved constraints: offline-only acceptance, no synthetic smoke opt-in/provider calls; preserve current source prompt/adapter/corpus identities, no public-product/region/DPA/readiness/lifecycle promotion. Cập nhật current docs bằng as-built evidence, không duplicate knowledge home hoặc implementation-report doc.
- Required checks: `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck`, scoped Prettier/diff check và `pnpm format:check` với result/attribution trung thực; narrow Backoffice tests/build. Broad cloud/local suites chỉ khi ownership/dependency thực tế bị ảnh hưởng; không chạy live evaluation test.
- Completion evidence: typed substitution end-to-end fake flow; correct deny ordering và source/review regressions; current docs accurately describe bounded implementation; checks/skips/blockers; development assertions, technical compliance, implementation VERIFY và non-browser QA theo workflow. Approval của planning không thể tạo những evidence đó.

- [ ] 3.1 Chạy offline integration matrix cho default/scenario/upload/stored/provider-once/mock-substitution; kiểm chứng consumer/request/result/review/apply không phụ thuộc deployment được chọn và existing guard regressions pass với fake fetch, không live API.
- [ ] 3.2 Cập nhật English current Personnel Home/Architecture Overview theo exact as-built diff; kiểm chứng link/doc consistency, source ownership và synthetic-only/no-readiness-promotion wording, không chỉnh registry/readiness status.
- [ ] 3.3 Chạy required repository checks, targeted Backoffice regression và Backoffice build; kiểm chứng exit/results và ghi rõ mọi skipped/failed/out-of-scope check, không sửa private env/DB/config để vượt blocker chưa được cho phép.
- [ ] 3.4 Chuẩn bị candidate-bound DEV_USABLE/MANUAL_TEST_READY handoff và applicable technical compliance/VERIFY/non-browser QA; kiểm chứng bằng approved local fictional-data flow, denial matrix và evidence, không gán PASS/YES từ typecheck hoặc task count.
- [ ] 3.5 Chuẩn bị exact implementation final review khi được cho phép hoàn tất implementation; kiểm chứng tất cả gates/hashes, actual check/QA evidence và completion obligations. Không suy ra sync/archive hoặc deployment authority từ task checklist; current planning task không thực hiện bước này.

### Planned targeted commands

```text
pnpm --filter @yuta/backoffice exec vitest run test/ai-synthetic-personnel-contract-extraction.test.ts test/personnel-contract-extraction-service.test.ts test/personnel-contract-extraction-runtime.test.ts test/personnel-contract-openai-adapter.test.ts test/personnel-contract-synthetic-upload.test.ts test/personnel-contract-stored-synthetic-document.test.ts test/personnel-contract-review-store.test.ts
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice build
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
pnpm format:check
```

Thêm exact targeted action/security tests khi được tạo; không chạy `test:openai:synthetic`, smoke/full-corpus evaluation hoặc provider-once QA. Type fixture `.types.ts` phải có trong TypeScript include, không dựa vào Vitest transpilation.

## Implementation Baseline and Resume

Historical intake HEAD: `700341eda059fff4fed93417d874cf769a4aaba7`, branch `codex/backoffice-clean-code`. Planning snapshot HEAD sau unrelated Formalités commit: `14fd1f06a3829599cb06661879384fc22a7a9dc2`; unrelated Salariés UI/history changes đang dirty. Review xác minh không có relevant authority/contracts/extraction source drift.

`git status --short -- apps/backoffice/src/server/personnel-contract-extraction 'apps/backoffice/src/app/(authenticated)/equipe/salaries/contract-extraction-actions.ts'` trả empty trong planning snapshot. Đây không phải pre-Apply authorization/baseline. Resume implementation MUST thu lại HEAD/index/status và intended path hashes, bảo toàn dirty work; đổi reviewed artifact thì invalidate/re-review gate tương ứng.

| Source path dưới `apps/backoffice/src/`                              | SHA-256 tại planning snapshot                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `app/(authenticated)/equipe/salaries/contract-extraction-actions.ts` | `72ceb6df2a70824e788015ac8957be275876dd1a854daa1a66851b572508e4e4` |
| `server/personnel-contract-extraction/openai-adapter.ts`             | `d3bcdb5448e5f632d80e9177af73207d5a42e86274e78749dfd996bacf2439f6` |
| `server/personnel-contract-extraction/review-store.ts`               | `793d13c39a9977880b84530764672b870b1228f1332c980dbc91b16b31ca5c56` |
| `server/personnel-contract-extraction/runtime.ts`                    | `e393b0389b85da9feab6bfc804fa6387059104b8f0e1c69b0725c486392097ef` |
| `server/personnel-contract-extraction/service.ts`                    | `63315529ac50479728b0dbdfa54972f5851a70e6252d19bb87abb53d16477d9c` |
| `server/personnel-contract-extraction/stored-synthetic-document.ts`  | `0a95537a0eb12462dc77a6e925037ed5b6f55654f2d78b13a53a642e9ac8570d` |
| `server/personnel-contract-extraction/synthetic-upload.ts`           | `6590743924c69d3f3cb5e601a228a39fa38a540873a3292d406ef93c36a0ffb6` |

## POST_APPLY_DEVELOPMENT_FEEDBACK

Adoption: REQUIRED

Event evidence: [successful Human-authorized finish/archive](../../../docs/reviews/development-usability-and-iteration-control/03-final-review.md), completed 2026-09-24T09:25:12.0063622+02:00, `Finish outcome: COMPLETED`, `Workflow status: DONE`; archived change exists. Change này được tạo sau event, chưa vào Apply.

Current candidate: planning artifacts only; no implementation diff/candidate hoặc runtime observation. Sau Apply cần ghi exact candidate/lineage và reassess applicability theo as-built flow. Không đánh dấu assertions hoàn tất ở planning.

- DEV_USABLE: applicability `YES` dự kiến cho existing local Personnel extraction flow; result `PENDING`; future evidence: internal development instance, trusted OWNER/fictional test target và deterministic/mock extraction qua actual app boundary, denial/review/apply kiểm chứng.
- MANUAL_TEST_READY: applicability `YES` dự kiến; result `PENDING`; future handoff: approved dev command/route `/equipe/salaries`, fictional sources, non-secret test identity reference, expected review/apply, safe retry/reset hướng dẫn và limitations. Không seed/mutate real data hoặc tự bật provider để tạo evidence.
- HUMAN_PRODUCT_VALIDATION: NOT_REQUESTED — CODEX_ONLY, task hiện tại planning; không yêu cầu optional manual feedback. Không phải ACCEPTED/PASS hoặc miễn mandatory security/QA evidence. Nếu acceptance sau này cần actual Human observation, phải thu evidence đó riêng.
- Technical Implementation Compliance, implementation VERIFY và implementation QA: chưa chạy, ngoài authorized planning task. `BROWSER_QA_REQUIRED: NO` không miễn non-browser flow/security checks.

## ITERATION_STOP_CONTROL

Canonical owner/default budgets: automated workflow; `MAX_RECOVERY_ATTEMPTS = 2`, `MAX_EXECUTION_GENERATIONS = 3`. Không reset lineage/budget theo đổi wording, mode hoặc resume; không tự cho retry vượt budget.

Planning history ngày 2026-10-03:

| Lineage / claim / class / root cause                                                                                                   | Actions, executions and evidence                                                                                                                                                                                              | Counts / last outcome                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `SOURCE-WORDING`: source-control claim, artifact defect, CONFIRMED overstatement                                                       | Gate 1 candidate 1 CHANGES_REQUESTED; sửa đúng câu Proposal, candidate 2 fresh independent review APPROVED; exact histories/hashes trong Gate 1 packet                                                                        | 2 review generations; 0 failed recovery attempts; resolved                                                            |
| `DESIGN-COPY-FENCE`: exact evidence copy, packet defect, CONFIRMED nested fence collision                                              | Design review candidate 1 CHANGES_REQUESTED; regenerate longer matching outer fence, compare exact source, fresh candidate 2 APPROVED; artifact hashes không đổi                                                              | 2 review generations; 0 failed recovery attempts; resolved                                                            |
| `COPY-CHECK-REGEX`: exact-copy checker, tooling assertion defect, CONFIRMED assumed five ticks despite formatter normalization to four | First local comparison rejected the fence pattern; read-only diagnosis showed content equal, matcher changed to capture matching outer fence, subsequent comparison MATCH and reviewer independently rechecked UTF-8 equality | 2 checker executions; 0 failed recovery attempts; resolved, not an architecture change                                |
| `GLOBAL-FORMAT`: whole-repo formatting claim, out-of-scope baseline drift, CONFIRMED 150 file warnings                                 | One `pnpm format:check` failed, incl. initial new Gate 1 packet format; scoped formatter corrected own packet and scoped checks passed. Other paths excluded; no broad fix/global retry or waiver                             | 1 global evaluator generation; 0 recovery attempts; global FAIL retained, scoped-format obligation checked separately |

Không còn planning blocker hoặc retry pending trong task scope; không có exhausted budget hoặc Human exception. Global-format failure vẫn được báo trung thực, không relabel PASS hoặc suy ra Human `ACCEPT_LIMITATION`.

## Planning Delivery Evidence

Chỉ đánh giá artifact delivery, không implementation completion. All 13 implementation checkboxes ở trạng thái pending.

- Strict change validation PASS sau Specs, Design và Tasks: `openspec validate "ai-synthetic-contract-foundation" --strict`, exit 0, `Change 'ai-synthetic-contract-foundation' is valid`. Raw status: `isPlanningComplete: true`, cả 5 artifacts `done`; không có implementation completion claim.
- `pnpm docs:check`: PASS, 36 current documents, trong planning run ngày 2026-10-03.
- `pnpm architecture:check`: PASS trong cùng run.
- `pnpm -r --if-present typecheck`: PASS, 15 participating projects trong cùng run; code không do task này sửa và không phải runtime QA.
- `pnpm format:check`: FAIL, 150 warnings; initial owned packet đã được format lại, remaining out-of-scope issues được giữ. Scoped Prettier check cho cả 9 planning/review files PASS; final docs check PASS và tất cả earlier gate path/hash sets khớp. Không claim whole-repo formatting PASS; staged whitespace/exact-byte verification là điều kiện local commit.
- Runtime tests, cloud/local suites, Backoffice/cloud builds, provider evaluation và Browser QA chưa chạy: planning-only, không runtime changes; required implementation checks vẫn ở checklist tương lai.
- Current task write/commit allowlist: `openspec/changes/ai-synthetic-contract-foundation/**`, `docs/reviews/ai-synthetic-contract-foundation/**`. Trước local commit kiểm tra exact staged bytes/path set, gate integrity và preserve unrelated work; commit SHA chỉ báo trong chat, không sửa artifacts để chèn SHA.

YUTA operational target: `READY_FOR_IMPLEMENTATION_PLANNING` đã được hiện thực hóa bằng đầy đủ planning artifacts; sau final validation báo **planning complete / implementation not started**. Apply vẫn cần bounded current-user authorization riêng; không dùng raw CLI readiness hoặc delegated planning gates để tự triển khai.
