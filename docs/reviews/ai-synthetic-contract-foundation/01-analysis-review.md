Change: ai-synthetic-contract-foundation
Gate: Gate 1 — Proposal / Analysis
Review status: APPROVED
Created: 2026-10-03
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — Personnel, authorization and provider boundary

# Analysis Review

Visibility: Engineering

Owner: YUTA engineering

## Delegation and bounded request

COLLABORATION_MODE: CODEX_ONLY

Mode selection source: Current-user intake reply on 2026-10-03: `Codex một mình (CODEX_ONLY)`.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: Current-user intake reply on 2026-10-03: `YES` for a local commit after completing the authorized planning task.

The current user said `ok, triển khai` after the immediate exchange confirmed that the next step is implementation planning without runtime code changes. Scope: Proposal, Analysis, delta Specs, sensitive Design, Tasks and review evidence for Slice 1 synthetic Personnel extraction only. No Apply, Storage implementation, new provider/model/prompt, live API call, real-data processing, sync/archive, lifecycle promotion or remote delivery.

The four-part REQUIREMENT_BASELINE is reproduced as part of the exact Proposal below. The author proposes one capability, `ai/synthetic-personnel-contract-extraction`; the reviewer must determine readiness independently.

## Authorities and findings to assess

Use `AGENTS.md`, `apps/backoffice/AGENTS.md`, `docs/AUTHORITY_MODEL.md`, OpenSpec activation/normativity policies, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, Personnel Product Knowledge, current tenancy/runtime architecture, ADR-009, and readiness/provider gates. Exact consulted source links and implementation evidence are in Analysis.

Analysis reports no blocking authority conflict. Assess this claim independently, including existing upload attestation limits, stored-fixture/provider-once guards, review/apply preservation, synthetic-only classification and planning-only authorization. Production/provider qualification is unverified and excluded, not approved.

No current-user Product question is claimed unresolved within Slice 1 planning. This packet requests Gate 1 only. Approval permits Specs planning within the baseline, not runtime implementation.

## Candidate identity

Baseline HEAD: `700341eda059fff4fed93417d874cf769a4aaba7`

Branch at intake: `codex/backoffice-clean-code`

Unrelated Formalités working-tree changes are excluded. Review is against exact working-tree planning files, including untracked artifacts, rather than a HEAD-only diff.

Hash command: PowerShell `Get-FileHash -LiteralPath <path> -Algorithm SHA256`, lowercase hexadecimal; exact bytes; paths sorted.

| Path                                                             | SHA-256                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/ai-synthetic-contract-foundation/.openspec.yaml | eb984f1a844433fcf686b11b57962c6db65a3260148771b10c6a5388a1c446b8 |
| openspec/changes/ai-synthetic-contract-foundation/analysis.md    | 4ee0680244238b3fc00f8aedda75cf3c0c9b7e7c4eef4ad76b06258c23c1b728 |
| openspec/changes/ai-synthetic-contract-foundation/proposal.md    | 3fa579534aec953238ac60c5bd98f6e55763487cebb2933e47d22feb0e64cec4 |

## Review history — candidate 1

Verdict: CHANGES_REQUESTED by `/root/ai_gate1_review` on 2026-10-03. P2: Proposal overstated verified fictional content. Existing upload attestation/PDF guards cannot prove the absence of real data. Required correction: describe server validation of approved source controls, preserve real-data prohibition/current upload guards, and introduce no classifier. No other blocking findings reported. No tests/provider/CT calls were made by the reviewer.

Reviewed identities: metadata `eb984f1a844433fcf686b11b57962c6db65a3260148771b10c6a5388a1c446b8`; Proposal `ca884013bb072411e31a94f07f5442f37c053988af2950dc0ebb6bd4e38fe5a6`; Analysis `4ee0680244238b3fc00f8aedda75cf3c0c9b7e7c4eef4ad76b06258c23c1b728`; packet at review `d616f69d8240808d522796a2851543ed48334856a53a700100ab17fb47f44749`.

Correction: Proposal now distinguishes approved source-control validation from proof of fictional content. Policy rejects real/unknown classification and non-development execution; source workflow is unchanged. Candidate 1 is not approved. Candidate 2 below awaits a fresh independent verdict.

## Exact proposal

```text
## Why

Personnel hiện có adapter trích xuất hợp đồng synthetic nhưng feature vẫn gắn với cấu hình runtime/provider cụ thể. Slice 1 đưa một capability typed và kiểm tra eligibility vào luồng hiện có để thay deployment sau này mà giữ hợp đồng nghiệp vụ, authorization và review/apply.

## What Changes

- Lập kế hoạch capability `personnel.contract.extract_fields@1` trong `apps/backoffice/src/server/ai/`, dùng request/result Personnel hiện có.
- Purpose và classification do domain xác định sau khi server kiểm tra các điều kiện nguồn synthetic được phép. Với upload, attestation và PDF guards không chứng minh nội dung là fictional; dữ liệu thật vẫn bị cấm theo policy, không thêm content classifier. Eligibility từ chối real/unknown classification và mọi môi trường ngoài development.
- Deployment config, policy và capability có version riêng; lựa chọn deployment bằng mapping tĩnh, chỉ trong tập eligible.
- Giữ deterministic synthetic mặc định và adapter OpenAI synthetic hiện có, model `gpt-5.6-luna`, prompt `v4`, timeout, schema validation, audit và Human review/apply. Không thực hiện provider call trong tác vụ này.
- Lập kế hoạch observation tối thiểu đã loại nội dung nhạy cảm, các test offline và cập nhật tài liệu hiện hành khi implementation được cho phép.

## Capabilities

### New Capabilities

- `ai/synthetic-personnel-contract-extraction`: hợp đồng typed, eligibility, lựa chọn deployment và observation cho một consumer Personnel synthetic.

### Modified Capabilities

Không có. Không sửa requirements của các main spec hiện có, gồm `personnel/reconstructable-value-history`.

## Impact

- Owner: Backoffice server. Domain Personnel tiếp tục sở hữu authorization, nguồn dữ liệu, validation nghiệp vụ và apply; AI foundation không cấp quyền hay ghi Personnel state.
- Implementation dự kiến chạm `apps/backoffice/src/server/ai/`, `src/server/personnel-contract-extraction/{service,runtime}.ts`, extraction actions và test tương ứng. Adapter, prompt, contracts công khai, persistence và UI giữ semantics hiện tại.
- Không package/dependency/schema/migration/API/UI mới; không ảnh hưởng POS, Site Agent hoặc Display.
- Change artifacts là kế hoạch chưa normative; không sync/archive hoặc nâng lifecycle/readiness.

## REQUIREMENT_BASELINE

### AUTHORITATIVE_USER_REQUIREMENT

Nguồn: cuộc trao đổi hiện tại ngày 2026-10-03. Sau khi thống nhất Slice 1 và xác nhận bước kế tiếp chưa sửa runtime code, người dùng nói `ok, triển khai`. Phạm vi thực thi được ghi nhận là **implementation planning cho Slice 1 only**; tạo Proposal, Analysis, Specs, Design, Tasks và review evidence, chưa Apply.

Tài liệu phản biện được người dùng đưa vào cuộc trao đổi là đề xuất tham khảo. Phạm vi dưới đây được đối chiếu với repository; tài liệu đó không phải provider/legal approval hay một quyết định triển khai production.

### HARD_CONSTRAINTS

- Synthetic only; real personnel data và production SHALL bị từ chối.
- Authorization và exact employee/document version checks trước đọc/chuẩn bị bytes và provider effect; giữ review expiry, audit và Human apply.
- Capability literal SHALL suy ra input/result ở compile time; runtime schema validation vẫn bắt buộc tại trust boundaries.
- Không provider mới, model/prompt mới, tài khoản/key mới, spend hoặc live API call.
- Tác vụ hiện tại chỉ ghi planning/review artifacts của change này; giữ nguyên thay đổi không liên quan trong checkout.

### OUT_OF_SCOPE

Runtime implementation; Storage port/lifecycle/provider; dữ liệu thật; production qualification/enablement; fallback/shadow; benchmark service; tools/jobs; shared `packages/ai`; registry DB; admin selector; framework/dependency mới; main-spec sync/archive; push/PR/merge/deploy.

### SUCCESS_OUTCOMES

1. Bộ kế hoạch có đầy đủ behavioral scenarios, design và tasks có thể triển khai theo đúng giới hạn Slice 1.
2. Test plan chứng minh authorization denial chặn bytes/provider; eligibility denial chặn provider; selection không ra ngoài eligible set; typed mock thay deployment mà consumer giữ nguyên.
3. Test plan bảo vệ schema/version/timeout, review/apply/audit và observation không chứa bytes, prompt, response, secrets hay tenant/personnel identifiers.
4. Gate 1, Gate 2 và sensitive Design Gate có review độc lập trên exact bytes; planning validation và checks được ghi trung thực; local commit chỉ chứa phần kế hoạch được duyệt.

## Task Context

COLLABORATION_MODE: CODEX_ONLY

MODE_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `Codex một mình (CODEX_ONLY)`.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `YES` cho local commit sau khi hoàn tất tác vụ được duyệt; không bao gồm remote Git hoặc deployment.

Delegation: review độc lập cho các gate thường lệ trong planning-only scope theo `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`; không mở rộng quyền sang Apply hoặc quyết định pháp lý/provider.
```

## Exact analysis

```text
# Change Analysis

## Scope and Change Type

Planning-only cho Slice 1 trong [Proposal](proposal.md#requirement_baseline). Change dự kiến thêm behavioral boundary cho `ai/synthetic-personnel-contract-extraction`: eligibility trước provider effect, selection không vượt eligible set và API typed theo capability.

Impact: `CROSS_MODULE` ở mức domain Personnel và AI foundation bên trong một app cloud; không thêm consumer hoặc runtime. Đây là thay đổi security/Personnel/provider-sensitive nên cần sensitive Design Gate. Không database hoặc UI change. Tác vụ hiện tại chỉ tạo change artifacts và review packets, không Apply.

COLLABORATION_MODE: CODEX_ONLY

MODE_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `Codex một mình (CODEX_ONLY)`.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `YES` cho local commit phần planning đã hoàn tất.

## Sources Consulted

- [Root AGENTS](../../../AGENTS.md), [Backoffice AGENTS](../../../apps/backoffice/AGENTS.md), [docs index](../../../docs/README.md), [current-state routing](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md) và [workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md).
- [Personnel Product Knowledge](../../../docs/features/personnel/README.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [lifecycle vocabulary](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Architecture](../../../docs/architecture/OVERVIEW.md), [tenancy](../../../docs/architecture/TENANCY.md), [database/runtime separation](../../../docs/architecture/DATABASE_BOUNDARIES.md), [accepted ADR-009 exposure](../../../docs/decisions/ADR-009-release-a-customer-exposure.md).
- [Production readiness](../../../docs/operations/PRODUCTION_READINESS.md), [OpenAI eligibility planning/evaluation history](../../../docs/operations/OPENAI_PROVIDER_ELIGIBILITY.md).
- [Personnel request/result schemas](../../../packages/contracts/src/personnel/index.ts), [service](../../../apps/backoffice/src/server/personnel-contract-extraction/service.ts), [runtime](../../../apps/backoffice/src/server/personnel-contract-extraction/runtime.ts), [upload loader](../../../apps/backoffice/src/server/personnel-contract-extraction/synthetic-upload.ts), [extraction actions](../../../apps/backoffice/src/app/%28authenticated%29/equipe/salaries/contract-extraction-actions.ts), [service tests](../../../apps/backoffice/test/personnel-contract-extraction-service.test.ts), [runtime tests](../../../apps/backoffice/test/personnel-contract-extraction-runtime.test.ts), và package manifests.

## Authority and Product Decision

Yêu cầu hiện tại đã giới hạn planning cho capability synthetic ở Proposal. Existing Personnel scope chỉ cho phép synthetic/development extraction; không có authority cho gửi real personnel files. Accepted runtime/tenancy/exposure boundaries tiếp tục kiểm soát change. Không cần quyết định provider mới để viết Slice 1 requirements.

Artifact review theo delegated mode là approval của exact planning candidate, không thay thế legal/privacy/provider/production approval. Change specs chưa normative; chỉ sync đã được cho phép riêng và validated mới có thể tạo main-spec authority. Không có sync trong tác vụ này.

## Current Implemented State

- Service parse request, gọi `authorizeAndResolve`, đối chiếu document/version và employee revision, consume rate limit rồi mới load/prepare PDF và invoke adapter. Result được strict-validate và đối chiếu request/page count.
- Runtime từ chối khi `NODE_ENV` khác `development`; deterministic synthetic là mặc định. Nhánh explicit `openai-synthetic` dùng adapter hiện có với Luna/v4; các scenario khác `complete` ở lại deterministic.
- Extraction actions sở hữu exposure/session/permissions, scoped repositories, requested/completed audit, review store và Human apply. Stored source có fixture allowlist và provider-once QA gate riêng. Không được bỏ những gate này khi tích hợp capability.
- Upload loader yêu cầu attestation `fictional-only`, giới hạn PDF và trì hoãn `arrayBuffer()` tới sau authorization. **Attestation không chứng minh nội dung đã anonymized hoặc thực sự không có dữ liệu thật.** Slice 1 không mở rộng loại nguồn được phép; chỉ server domain mới tạo classification sau các guard hiện có, browser không được truyền classification/purpose/deployment có authority.
- Chưa có capability registry typed, eligibility set hoặc selection invariant riêng. Existing tests xác lập nhiều guard nhưng chưa chứng minh các boundary mới.
- Tests chỉ được đọc ở giai đoạn discovery; chưa chạy regression hoặc provider trong tác vụ này. Repo evidence không chứng minh deployment hay qualification hiện hành.

## Affected Boundaries

- Runtime owner: Backoffice server; provider/config/secrets server-only.
- Data owner: Personnel tiếp tục sở hữu metadata, structured facts, authorization và Human apply; AI không mở DB/repository hoặc ghi domain state.
- Tenancy: validated session và active membership; organization + establishment predicates và document/employee revision không thay đổi. AI policy không thể cấp thêm Personnel permission.
- Exposure: ADR-009 giữ Personnel unavailable trong profile `release-a`; capability không được mở direct bypass.
- Provider: adapter hiện có chỉ trong synthetic development branch; planning/test offline không tạo provider request. Không suy ra retention/region/DPA từ model name hoặc `store:false`.
- POS/Site Agent/Display, canonical storage, migrations và transport/UI contract: không thay đổi.

## Lifecycle Baseline

Theo Personnel Home/Registry, employee dossier bounded có Product `APPROVED`, Implementation `IMPLEMENTED`, Environment `UNVERIFIED`, Production Readiness/External Dependency `BLOCKED`. Personnel Documents có implementation development-only nhưng dedicated Product/Registry decision chưa được xác lập (`NEEDS REVIEW`). Extraction hiện chỉ có local/synthetic evidence, không một production AI qualification.

Baseline này không chặn planning trong existing synthetic boundary. Foundation mới chưa implementation; không gán lifecycle chính thức hoặc nâng bất kỳ dimension nào. `VEND-01`, `AI-01`–`AI-04` và HR storage/scanning/readiness tiếp tục là governance authority cho các slice tương lai, không phải task checkbox của Slice 1.

## Requirement Readiness

`READY_FOR_SPECS`. Có thể viết precise scenarios cho typed capability, denial, eligibility/selection invariant, observation và bảo toàn review/apply bằng offline mocks. Đây là behavioral change dự kiến, không dùng `skip_specs: true`; planning-only delivery không biến behavioral target thành docs-only/no-spec target.

REQUIREMENT_BASELINE được giữ nguyên trong [Proposal](proposal.md#requirement_baseline); Specs/Design/Tasks không được tự mở rộng nó.

## UI / UX Applicability

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

Không đổi UI, routes, public action payload/result/error mapping hoặc interaction. Server denial mới được ánh xạ về safe failure/unavailable có sẵn. Nếu implementation cần đổi một observable UI contract, phải quay lại review scope trước khi sửa.

## Conflicts and Unknowns

- Không có requirement-level `CONFLICT` hoặc `NEEDS REVIEW` cho planning Slice 1. Đề xuất broader AI/Storage đã thống nhất không tạo quyền triển khai Storage, real-data qualification hoặc production.
- Provider qualification/live deployment chưa xác minh: cố ý ngoài scope và không cần để planning/offline acceptance. Không biến unknown thành approval.
- Synthetic-upload attestation là giới hạn trust hiện tại, không automated content classification. Giữ guard và operational fictional-data obligation; không tuyên bố khả năng phát hiện mọi file thật bị gắn nhãn sai.
- Dirty checkout đang có Formalités changes không liên quan; chỉ planning/review path allowlist của change mới được ghi và commit. Before Apply phải kiểm tra lại implementation path status.

## Analysis Conclusion

`READY_FOR_SPECS`

Bounded scope xác định; một new capability `ai/synthetic-personnel-contract-extraction` có thể đi tiếp sau Gate 1 độc lập. Không có requirement blocker. `skip_specs: false`. Sensitive Design bắt buộc trước Tasks. Kết thúc tác vụ ở planning-ready; Apply, sync/archive và production vẫn chưa được cho phép.
```

## Independent approval — candidate 2

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW

Mode selection source: Current-user intake reply on 2026-10-03, `Codex một mình (CODEX_ONLY)`, for Slice 1 implementation planning only.

Independent reviewer: `/root/ai_gate1_rereview` (fresh context).

Independent review evidence: APPROVED; no blocking findings. Candidate correctly distinguishes upload source controls from proof of fictional content; preserves server classification, stored checksum/provider-once controls, authorization/version-before-effects, audit/expiry/review/Human apply and ADR-009. Reviewer inspected exact metadata/Proposal/Analysis hashes in Candidate identity; packet at review was `d896b09385f9874f78a8958a5bca4f80a093cdc24fa246c631e7bea5c4c7c88c`. No reviewer writes, tests, provider or CT calls.

Approval recorded by: Codex workflow

Approved: 2026-10-03T12:39:12.6575096+00:00

Integrity: exact three-path set and all hashes rechecked unchanged after verdict. Approval permits Specs planning only; no Apply, sync/archive or operational authority.
