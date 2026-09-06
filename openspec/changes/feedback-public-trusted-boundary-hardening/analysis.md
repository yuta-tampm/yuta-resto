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
