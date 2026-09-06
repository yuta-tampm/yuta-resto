Change: feedback-public-trusted-boundary-hardening
Gate: Gate 1 — Product / Authority Review
Review status: APPROVED
Created: 2026-09-05T09:14:49.4423844Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-05T10:32:35.4292573Z

# Gate 1 Review — Public Feedback Trusted Boundary Hardening

## Approval Record

Current user approved Gate 1 for `feedback-public-trusted-boundary-hardening` and authorized progression to Specs only. The approval confirms:

1. active + verified hostname là trusted public boundary bắt buộc;
2. production submission không được silently bypass abuse protection khi required salt/configuration không hợp lệ hoặc trusted client identity không thể được thiết lập;
3. không mặc định schema migration, domain-management workflow hoặc shared contract change; Design phải chọn enforcement point nhỏ nhất đúng đắn;
4. trusted proxy/header provenance vẫn là environment requirement và không được suy đoán deployment topology/header source;
5. nếu Design/Sensitive Design review không xác lập được provenance, workflow phải dừng trước Apply;
6. Google/Facebook/Instagram connectors, external review integration và general production-readiness work vẫn ngoài scope.

Approval này không authorize Design, Tasks, Apply, sync, archive, deployment hoặc lifecycle promotion.

## Request and Bounded Change Summary

Change này gia cố đúng trusted public runtime boundary của Direct Customer Feedback theo classification `CROSS_MODULE` đã được Control Tower cung cấp. Runtime owner vẫn là `apps/feedback-web`; `packages/tenant` và `packages/db-cloud` chỉ tham gia trong phạm vi trusted resolution/domain lookup do chúng sở hữu. `packages/contracts` chỉ được chạm nếu exact observable API contract thật sự cần.

Phạm vi gồm:

- DCF-01: xác minh `active => verified` tại mọi tracked authorized tenant-domain write path và bảo đảm public resolution fail closed khi domain chưa verified;
- DCF-02: làm rõ production-required salt validation, missing client-IP behavior và trusted proxy/header assumptions;
- focused allow/denial tests cho các invariant được duyệt.

Không bao gồm rate-limit atomicity, idempotency, duplicate feedback, body limits, contact workflow, retention, Backoffice settings, external review URL policy, QR, UI/accessibility, analytics, composite tenant ownership hoặc Google/Facebook/Instagram connectors. Repository implementation không được coi là production deployment evidence.

## Repository Provenance and Isolation

- Baseline HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- Baseline command: `git status --short`.
- Checkout đang có nhiều modified/deleted/untracked paths không thuộc change, chủ yếu trong Workflow/Personnel/Formalités và generated Next declarations.
- Change này chỉ thêm shell/artifacts dưới `openspec/changes/feedback-public-trusted-boundary-hardening/` và packet hiện tại dưới `docs/reviews/feedback-public-trusted-boundary-hardening/`.
- Không có implementation, schema, contract, migration, test hoặc canonical Product Knowledge nào được sửa ở Gate 1.
- Pre-Apply scoped cleanliness phải được kiểm tra lại sau các approval bắt buộc; mọi overlap không thể isolate là stop condition.

## Exact Proposal Content

```markdown
## Why

Direct Customer Feedback đang có hai khoảng lệch tại public trusted boundary: runtime lookup chưa chứng minh miền `active` đồng thời đã được xác minh, và yêu cầu production fail-closed cho IP-hash salt chưa được thực thi khi không tìm thấy client IP. Change này làm rõ và gia cố đúng hai invariant đó trước khi coi public submission boundary là nhất quán với authority hiện hành.

## What Changes

- Làm cho production public tenant resolution chỉ chấp nhận hostname ánh xạ tới domain đang active, đã được xác minh, thuộc organization/establishment đang active và khớp public feedback slug.
- Giữ nguyên write-path hiện có khi đã bảo đảm `active => verified`; nếu repository không có invariant bền vững trên mọi authorized write path, thực thi fail-closed tại điểm đọc/resolution nhỏ nhất thay vì mở rộng thành domain-management workflow hoặc migration không cần thiết.
- Định nghĩa contract cấu hình production cho `PUBLIC_FEEDBACK_IP_HASH_SALT`, gồm độ dài tối thiểu hiện hành và validation fail-closed không phụ thuộc việc request có cung cấp client IP hay không.
- Định nghĩa client-IP source chỉ được tin cậy theo runtime/deployment contract đã cấu hình; khi repository chưa chứng minh header provenance, giữ đó là environment requirement và không tự suy đoán topology.
- Bổ sung focused tests cho verified/active domain resolution, unverified/inactive/malformed hostname denial, thiếu production salt và thiếu trusted client-IP source.
- Không thay đổi rate-limit atomicity, idempotency, duplicate handling, body limits, contact workflow, retention, Backoffice settings, external review URL/QR policy, UI/accessibility, analytics, composite tenant ownership hoặc Google/Facebook/Instagram connectors.

## Capabilities

### New Capabilities

- `public-feedback/trusted-boundary`: Yêu cầu quan sát được cho verified public hostname resolution và production client-IP hashing/configuration fail-closed của Direct Customer Feedback.

### Modified Capabilities

- Không có.

## Impact

- Runtime owner: `apps/feedback-web`.
- Cross-module consumers/owners: `packages/tenant` cho trusted public tenant resolution; `packages/db-cloud` cho domain lookup/schema evidence; focused tests trong các boundary này và contracts chỉ khi thật sự cần.
- Data shape: chưa đề xuất schema hoặc migration; Analysis/Design phải chứng minh có cần hay không trước Apply.
- Deployment: không deploy và không tuyên bố production readiness; exact trusted proxy/header provenance còn là environment evidence requirement nếu repository không định nghĩa.
- Security: change ảnh hưởng public trusted boundary, vì vậy Design và Sensitive Design Gate là bắt buộc trước Tasks/Apply.
```

## Exact Analysis Content

```markdown
# Change Analysis

## Scope and Change Type

Change này chỉ gia cố trusted public runtime boundary của Direct Customer Feedback. Đây là behavior-changing, security-sensitive và `CROSS_MODULE`: runtime owner là `apps/feedback-web`, còn trusted tenant resolution và domain persistence evidence lần lượt thuộc `packages/tenant` và `packages/db-cloud`.

Phạm vi hành vi gồm hai invariant:

1. production public tenant chỉ được resolve từ hostname active và verified;
2. production rate-limit identity/configuration phải rõ ràng và fail closed khi thiếu điều kiện bắt buộc.

Change không ảnh hưởng UI, không thêm provider connector, không thay đổi feedback domain workflow và không mở rộng thành production-readiness tổng quát. Data-affecting chưa được kết luận: schema/migration chỉ được cân nhắc ở Design nếu thật sự là enforcement point nhỏ nhất; không được mặc định từ việc `verifiedAt` tồn tại.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [feedback-web instructions](../../../apps/feedback-web/AGENTS.md), [tenant instructions](../../../packages/tenant/AGENTS.md), [db-cloud instructions](../../../packages/db-cloud/AGENTS.md).
- [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md), [OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [OpenSpec normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
- [Current State](../../../docs/CURRENT_STATE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Reputation Product Knowledge](../../../docs/features/reputation/README.md), [Reputation status](../../../docs/features/reputation/STATUS.md), [ADR-004](../../../docs/decisions/ADR-004-independent-public-feedback-application.md).
- [Tenancy architecture](../../../docs/architecture/TENANCY.md), [Database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), [Deployment authority](../../../docs/operations/DEPLOYMENT.md), [Production readiness](../../../docs/operations/PRODUCTION_READINESS.md).
- Implemented State: [feedback submission route](../../../apps/feedback-web/src/app/api/public/feedback/%5BtenantSlug%5D/route.ts), [feedback tenant resolver](../../../apps/feedback-web/src/server/resolve-public-feedback.ts), [tenant resolution package](../../../packages/tenant/src/index.ts), [cloud tenant adapter](../../../packages/db-cloud/src/tenant-adapters.ts), [tenancy schema](../../../packages/db-cloud/src/schema/tenancy.ts), [cloud seed](../../../packages/db-cloud/src/seed.ts), [tenant tests](../../../packages/tenant/test/tenant.test.ts).

## Authority and Product Decision

Product Decision cho Direct Customer Feedback và independent runtime owner đã là `APPROVED`. ADR-004, scoped instructions, Tenancy architecture và Deployment authority cùng yêu cầu production request phải resolve từ active verified hostname, không tin slug/header/form/cookie làm tenant scope, và phải fail closed khi thiếu trusted context.

Reputation Product Knowledge và Deployment authority yêu cầu `PUBLIC_FEEDBACK_IP_HASH_SALT` trong mọi production feedback-web environment; Deployment còn quy định tối thiểu 32 random characters. Đây là security/operational contract hiện hành, không phải capability/provider mới.

Các authority này đủ để viết precise behavioral requirements cho việc từ chối unverified/inactive/malformed hostname và từ chối production submission khi mandatory rate-limit security configuration/identity không khả dụng. Exact proxy/header provenance không được authority hiện tại mô tả; nó phải là một environment requirement được chứng minh tại Sensitive Design/operational review, không được suy ra từ tên provider.

## Current Implemented State

### DCF-01 — verified tenant-domain invariant

- Inventory toàn repository cho thấy authorized code path duy nhất đang ghi `tenant_domains` là idempotent cloud seed. Path này đặt đồng thời `status: 'active'` và `verifiedAt: new Date()` khi insert/update. Vì vậy seed hiện tại giữ `active => verified` cho chính dữ liệu seed.
- Không tìm thấy tenant-domain creation/update API, Backoffice workflow hoặc verification workflow khác trong tracked code. Điều này không chứng minh production provisioning bên ngoài repository cũng giữ invariant.
- Executable schema cho phép `status = 'active'` trong khi `verified_at` là `NULL`; không có check constraint buộc hai field nhất quán.
- `createDomainLookup` đọc domain/organization/establishment status nhưng không đọc `verifiedAt`; nó có thể trả record active cho một row active chưa verified.
- `resolvePublicTenant` normalize hostname, yêu cầu lookup result active và exact hostname match, nhưng `DomainTenantRecord` hiện không mang verification evidence.
- Existing tenant tests chứng minh normalize, unknown host và mismatched host behavior ở mức port mock; chưa chứng minh unverified/inactive/verified-active behavior của database adapter.

Kết luận invariant: repository chỉ bảo đảm `active => verified` trong seed path hiện có, không bảo đảm như một durable executable invariant hoặc tại public read boundary. Vì production write/provisioning evidence là `UNKNOWN`, không thể coi invariant đã được bảo đảm ở mọi authorized production path. Yêu cầu fail-closed tại public resolution là cần thiết; điểm enforcement nhỏ nhất được để cho Design quyết định, không mặc định phải là schema hay `packages/tenant`.

### DCF-02 — production fail-closed configuration

- Submission route hiện lấy phần tử đầu của `x-forwarded-for`, fallback sang `x-real-ip`.
- Nếu không có client address, hashing trả `null` trước khi đọc/validate salt. Kết quả là production request thiếu client IP có thể tiếp tục, không có database-backed per-client rate limit.
- Nếu có client address, production chỉ kiểm tra salt có tồn tại; code chưa enforce minimum 32 characters như Deployment authority.
- `apps/feedback-web` chưa có centralized environment schema hoặc startup/build validation tương đương public-booking. Salt được đọc trực tiếp trong request path.
- Repository xác nhận deployment target là một Vercel project riêng nhưng không xác nhận header nào được platform/proxy sanitize, append hoặc overwrite, không định nghĩa trusted proxy chain và không chứng minh direct-origin bypass bị chặn.

Kết luận configuration: production-required salt phải được validate độc lập với presence của request IP; thiếu hoặc không đạt contract phải fail closed. Vì behavior đã cam kết rate limit theo client, production submission không có trusted client identity không được phép silently bypass protection. Exact trusted header/source vẫn là environment contract cần bằng chứng trước Apply.

## Affected Boundaries

### CROSS-MODULE IMPACT CHECK

| Boundary                        | Classification            | Current owner / impact                                                                                                          |
| ------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Public runtime                  | Affected                  | `apps/feedback-web` sở hữu request handling, production configuration consumption và submission failure behavior.               |
| Trusted tenant resolution       | Affected                  | `packages/tenant` sở hữu portable resolution contract; không được import DB, HTTP framework hoặc environment.                   |
| Cloud domain persistence/lookup | Affected                  | `packages/db-cloud` sở hữu `tenant_domains`, adapter và focused integration evidence.                                           |
| Shared transport contracts      | Conditionally affected    | `packages/contracts` chỉ thay đổi nếu approved observable error contract thật sự cần; không mặc định thêm contract.             |
| Backoffice / domain management  | Not affected              | Không tạo tenant-domain management hay verification workflow.                                                                   |
| Feedback persistence behavior   | Not affected              | Không thay đổi feedback payload, contact consent, retention, idempotency, duplicate handling hoặc rate-limit atomicity.         |
| External providers              | Not affected              | Google/Facebook/Instagram connectors ngoài scope; configured review URL vẫn chỉ là redirect/link capability.                    |
| POS / Display / local data      | Not affected              | Không đổi runtime hoặc database ownership.                                                                                      |
| Deployment / readiness          | Evidence requirement only | Không deploy và không promote Environment/Production Readiness; proxy/header provenance vẫn phải có dated environment evidence. |

Analysis không quyết định portable resolution contract có cần thay đổi hay không. Mọi cross-module contract change phải được chứng minh là cần thiết, giữ phạm vi nhỏ, fail closed và được review tại Sensitive Design Gate.

## Lifecycle Baseline

| Dimension            | Current bounded baseline                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| Product Decision     | `APPROVED` cho Direct Customer Feedback và independent `apps/feedback-web` boundary.                            |
| Implementation       | `IMPLEMENTED` cho direct collection, nhưng hai hardening gaps nêu trên là implemented-state divergence cần sửa. |
| Environment          | `UNVERIFIED`; không có dated proxy/header provenance hoặc production configuration evidence trong repository.   |
| Production Readiness | `BLOCKED` / `NOT_READY` theo Public Feedback và global cloud gates.                                             |
| External Dependency  | Không thay đổi; connector work ngoài scope.                                                                     |

Workflow progress của change này không tự thay đổi bất kỳ lifecycle value nào.

## Requirement Readiness

`READY_FOR_SPECS`

Các authority hiện hành đủ rõ để đặc tả:

- unverified, inactive, unknown hoặc malformed hostname không được tạo trusted public tenant context;
- verified active hostname chỉ hợp lệ khi organization/establishment và slug cross-check cũng hợp lệ;
- production salt phải hiện diện và đạt contract tối thiểu trước khi submission được xử lý;
- production request thiếu trusted client-IP identity không được bypass per-client abuse protection;
- chỉ client-IP source đã được environment/deployment contract chứng minh mới được tin cậy.

Đây là spec-level behavior change nên không được dùng `skip_specs: true`. Exact enforcement location, error-shaping detail không làm lộ security internals, startup-vs-request validation composition và proxy/header binding thuộc Design + Sensitive Design Gate.

## UI / UX Applicability

`UI_AFFECTING: NO`.

Change không sửa visible UI, interaction, responsive layout hoặc presentation components. Public API có thể tiếp tục dùng generic unavailable/failure response; nếu Specs yêu cầu observable error contract mới thì đó là API behavior, không phải UI redesign. Browser QA không được mặc định từ change này; non-browser runtime QA applicability sẽ được phân loại trong Tasks.

## Conflicts and Unknowns

### CONFLICT — DCF-01 implemented resolver vs accepted security boundary

ADR-004, scoped app instructions, Tenancy architecture và Deployment authority yêu cầu active verified hostname. Current adapter có thể đánh dấu active mà không đọc `verifiedAt`, còn schema cho phép active + null. Seed path phù hợp nhưng không đủ chứng minh durable/production invariant. Conflict này có hướng requirement rõ từ higher authority và không cần Product decision mới; Specs phải giữ fail-closed boundary thay vì normalize code hiện tại.

### CONFLICT — DCF-02 fail-closed documentation vs current conditional check

Reputation Product Knowledge yêu cầu production submission fail closed khi thiếu salt, và Deployment yêu cầu salt tối thiểu 32 characters. Current code bỏ qua toàn bộ salt/rate-limit identity path khi không tìm thấy IP và chỉ kiểm tra presence khi có IP. Conflict này có hướng requirement rõ từ current security/operations authority.

### NEEDS REVIEW — trusted proxy/header environment contract

Repository chưa định nghĩa source header nào đáng tin, proxy chain nào hợp lệ, hoặc Vercel/origin protection nào bảo đảm client không tự spoof giá trị được dùng. Không chọn `x-forwarded-for`, `x-real-ip` hay thứ tự ưu tiên như một production fact. Gate 1 cần chấp nhận việc Specs chỉ nêu trusted-source/fail-closed behavior; Sensitive Design Gate phải review exact configuration contract, và Apply phải dừng nếu environment assumption vẫn chưa có bằng chứng đủ dùng.

### UNKNOWN — current production deployment state

Không có dated evidence rằng production feedback hostname, salt hoặc proxy/header contract đã được cấu hình. Đây là Environment/Production Readiness unknown, không phải blocker để viết desired repository behavior và không được change này tự promote.

## Analysis Conclusion

Bounded scope được xác nhận là `CROSS_MODULE`, behavior-changing và security-sensitive. Capability `public-feedback/trusted-boundary` có thể đi tiếp tới Specs sau Gate 1 vì accepted authorities đã xác định hướng fail-closed cho verified hostname và production abuse-protection configuration.

Không có requirement-level Product blocker. Gate 1 reviewer cần xác nhận ba giới hạn: không tạo domain-management workflow/schema migration mặc định; production không được bypass rate limiting khi thiếu trusted identity/config; exact proxy/header provenance được giữ là environment requirement và phải được giải quyết trong Design/Sensitive Design Gate trước Apply.

Analysis conclusion: `READY_FOR_SPECS`.
```

## Authorities Consulted

- Working rules: root `AGENTS.md`, `apps/feedback-web/AGENTS.md`, `packages/tenant/AGENTS.md`, `packages/db-cloud/AGENTS.md`.
- Workflow/authority: `docs/AUTHORITY_MODEL.md`, `docs/YUTA_WORKFLOW_V3.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, OpenSpec activation and normativity policies.
- Product/lifecycle: `docs/CURRENT_STATE.md`, `docs/MODULE_REGISTRY.md`, `docs/LIFECYCLE_STATUS_MODEL.md`, Reputation README/STATUS, accepted ADR-004.
- Security/runtime/data/operations: Tenancy architecture, Database Boundaries, Deployment, Production Readiness.
- Implemented State/evidence: feedback-web route/resolver, tenant package/tests, db-cloud tenant adapter/schema/seed, migrations and repository-wide tenant-domain write-path search.

## Conflicts, NEEDS REVIEW, and UNKNOWN

### CONFLICT

1. DCF-01: authority yêu cầu active verified hostname; adapter không đọc `verifiedAt`, schema cho phép active + null. Current seed là tracked write path duy nhất và đặt active+verified, nhưng không chứng minh production provisioning.
2. DCF-02: authority yêu cầu production salt fail closed và tối thiểu 32 characters; current request path có thể bỏ qua salt/rate limit khi client IP không có và chỉ kiểm tra salt presence khi IP có.

Hai conflict có hướng requirement rõ từ higher/current authority nên không chặn viết Specs; Specs không được normalize implementation hiện tại.

### NEEDS REVIEW

- Exact trusted proxy/header contract: repository chưa chứng minh header provenance, proxy chain hoặc direct-origin protection. Đây là environment/design requirement, không được giải quyết bằng suy đoán.

### UNKNOWN

- Current production hostname, salt và proxy/header configuration/deployment state. Change không được dùng để claim Environment hoặc Production Readiness.

## Product / Authority Decisions Requested at Gate 1

Gate 1 reviewer được yêu cầu xác nhận exact bounded direction sau:

1. Approved active-verified hostname authority được dùng làm basis cho fail-closed Specs; seed compliance hiện tại không đủ để bỏ public read-boundary requirement.
2. Production submission không được silently bypass abuse protection khi salt thiếu/không hợp lệ hoặc khi trusted client identity không thể resolve.
3. Không mặc định thêm domain-management workflow, schema constraint/migration hoặc shared contract; Design phải chọn enforcement nhỏ nhất sau Specs.
4. Exact trusted proxy/header provenance được giữ là environment requirement, phải được mô tả và review tại Sensitive Design Gate; Apply phải dừng nếu contract này còn là assumption.
5. Toàn bộ connector, review-sync/publication và general production-readiness work giữ ngoài scope.

Không có câu hỏi Product requirement nào khác phải được trả lời để viết Specs. Approval Gate 1 chấp nhận các direction trên; nó không approve Design, implementation, environment configuration, deployment, lifecycle promotion, sync hoặc archive.

## Analysis Conclusion and Recommendation

Analysis conclusion: `READY_FOR_SPECS`.

Recommendation: `APPROVE_GATE_1_TO_AUTHORIZE_SPECS_ONLY`.

Sensitive Design Gate vẫn bắt buộc sau Gate 2 vì change ảnh hưởng authorization/security boundary và cross-module trusted contract. Không được tạo Design, Tasks hoặc Apply trước các gate tương ứng.

## Artifact Integrity

Hash command/tool used:

```powershell
$paths = @(
  'openspec/changes/feedback-public-trusted-boundary-hardening/analysis.md',
  'openspec/changes/feedback-public-trusted-boundary-hardening/proposal.md'
) | Sort-Object
foreach ($path in $paths) {
  $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLowerInvariant()
  "$path`t$hash"
}
```

| Repository-relative path                                                  | SHA-256                                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/feedback-public-trusted-boundary-hardening/analysis.md` | `3d41d7ad9664a3468d6956fccec4a486a779e87b7debad2d63776d2a2573c2ba` |
| `openspec/changes/feedback-public-trusted-boundary-hardening/proposal.md` | `89d08d9ddf5ea11af8c7eb5b6530c27e4b359167150bc45641d5750d8c42b9c1` |

## Gate 1 Validation Evidence

| Command                                                     | Result                    | Notes                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec prettier --check <proposal> <analysis> <packet>` | PASS                      | Ba file Gate 1 dùng đúng repository formatting.                                                                                                                                                                                                                                  |
| `pnpm docs:check`                                           | PASS                      | `Documentation consistency check passed (36 current documents).`                                                                                                                                                                                                                 |
| `pnpm architecture:check`                                   | PASS                      | Runtime imports, database URLs, client boundaries và migration baselines hợp lệ.                                                                                                                                                                                                 |
| `pnpm -r --if-present typecheck`                            | FAIL — unrelated baseline | Feedback-web, tenant và db-cloud đều PASS. Backoffice fail tại hai untracked pre-existing Formalités files: `cdi-draft-workspace.tsx` thiếu return path và `formalites-persistent-draft-state.test.ts` thiếu symbol `FormalitesPersonnelFact`. Change này không sửa hai file đó. |

Không có product/runtime test nào được chạy vì workflow đang dừng trước Specs/Design/Apply và Gate 1 không thay implementation.

## Required Next Approval

Để tiếp tục tới Specs, current user phải gửi explicit approval gắn với đúng change và Gate 1 hiện tại:

```text
$yuta-run-change feedback-public-trusted-boundary-hardening
Analysis review approved. Continue.
```
