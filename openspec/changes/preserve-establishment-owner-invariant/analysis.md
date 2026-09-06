# Change Analysis

## Scope and Change Type

Change: `preserve-establishment-owner-invariant`.

Behavior-changing, security-sensitive repair trong Cloud Identity & Access /
Access Management. Phạm vi là các production membership mutations tại
`/parametres/utilisateurs-acces`: edit và existing-user attachment. Không phải
refactor thuần túy; thao tác đang thành công sai sẽ bị từ chối khi làm mất active
OWNER cuối cùng. Không tạo Product workflow mới hoặc mở rộng quyền quản trị.

Classification: `PAGE_LOCAL` trong owning Access Management capability.
`Sensitive change: YES` vì authorization invariant và concurrency integrity.
Không quyết định cơ chế khóa, kiến trúc implementation hoặc tasks ở Analysis.

## Sources Consulted

- [Proposal hiện tại](proposal.md), giữ nguyên byte khi tiếp nhận change.
- Root [AGENTS.md](../../../AGENTS.md), [documentation index](../../../docs/README.md),
  [CURRENT_STATE](../../../docs/CURRENT_STATE.md) và
  [db-cloud instructions](../../../packages/db-cloud/AGENTS.md).
- [Authority Model](../../../docs/AUTHORITY_MODEL.md), đặc biệt Authorization /
  Security, conflict handling và specificity.
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md),
  [Module Registry](../../../docs/MODULE_REGISTRY.md), các dòng Authentication,
  Tenancy và Access / membership; [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [DATA_MODEL](../../../docs/architecture/DATA_MODEL.md), mục Tenant roles;
  [IDENTITY_AND_MEMBERSHIP](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md),
  mục Implemented scope; [AUTHENTICATION](../../../docs/architecture/AUTHENTICATION.md),
  mục User and membership administration.
- [Production membership repository](../../../packages/db-cloud/src/tenant-user-repository.ts),
  [Backoffice actions](<../../../apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/actions.ts>)
  và [server session boundary](../../../apps/backoffice/src/server/auth/session.ts).
- [Membership schema](../../../packages/db-cloud/src/schema/tenancy.ts),
  [foundation repository](../../../packages/db-cloud/src/tenant-foundation-repository.ts),
  [foundation integration tests](../../../packages/db-cloud/test/tenant-foundation.integration.test.ts)
  và [foundation unit tests](../../../packages/tenant/test/foundation.test.ts).
- [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md),
  [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md),
  [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
  và [review-packet protocol](../../../docs/reviews/README.md).

Main-spec path inventory được kiểm tra; chưa có owner-preservation spec.
Hai authorization capabilities đang có là Restaurant Knowledge và Formalités,
không phải authority cho việc thay đổi membership lifecycle trong change này.

## Authority and Product Decision

Controlling question: Authorization / Security, không chỉ Product Intent.

DATA_MODEL dòng 119 cấm downgrade/suspend active OWNER cuối cùng của
establishment. IDENTITY_AND_MEMBERSHIP dòng 32–35 yêu cầu mỗi establishment
giữ một active OWNER. Đây là authority hiện hữu cho bounded repair; code hoặc
diagnostic chỉ chứng minh implementation không bảo vệ đầy đủ yêu cầu đó.

AUTHENTICATION dòng 127–128 diễn đạt last-owner theo organization.
Ghi `WORDING CONFLICT` về cách mô tả scope, nhưng chưa tìm thấy requirement nào
cho phép establishment có zero active OWNER khi organization vẫn còn OWNER.
Giữ OWNER theo từng establishment trong organization đáp ứng yêu cầu cụ thể
hơn; câu ở cấp organization không được dùng để bỏ bảo vệ establishment.
Analysis không sửa các nguồn authority hoặc thông báo UI để tự giải quyết wording.

Scope đề xuất cho review là `organizationId + establishmentId`, đếm
`role = OWNER AND membership.status = active`. OWNER tại establishment khác
không thay thế OWNER của target establishment. Khái niệm usable principal,
global account disable hoặc availability của một con người không được thêm
vào invariant trong change này.

Broader Authentication / Access workflow Product Decision vẫn chưa rõ trong
Module Registry. Khôi phục security invariant không phê duyệt toàn bộ attach,
invitation, reactivation, account lifecycle hoặc support workflow. Yêu cầu
giữ compatibility của các transition hợp lệ là giới hạn của repair, không
biến implementation hiện có thành Product authority mới.

User đã cho phép diagnostic và soạn planning. Chưa có Gate 1 approval cho
exact proposal/analysis bytes, Specs approval hoặc implementation authorization.

## Current Implemented State

### Production paths

- `createOrAttachUser`, repository dòng 112–235: kiểm tra requested role,
  requested establishments trong allowlist và active organization-scoped
  establishment rows; existing global user phải ACTIVE; chặn self-attachment;
  MANAGER không được sửa existing OWNER/MANAGER.
- Existing-membership conflict branch dòng 212–219 ghi đè role và status active
  trên khóa user/organization/establishment, không thực thi last-owner check.
  Membership suspended có thể được reactivate qua nhánh này.
- `updateMembership`, dòng 237–368: chặn current-session membership; kiểm tra
  target trong organization/establishment allowlist và role restrictions;
  đếm OWNER active khác theo đúng target establishment trước demotion/suspension.
  Không có OWNER khác thì ném `LAST_OWNER_REQUIRED`.
- Edit update, scoped session revocation khi suspend và
  `tenant.membership.updated` audit cùng transaction. Attach ghi
  `tenant.user.attached`; existing identity/password không được thay thế.
- Action lấy actor, organization, current membership và management scope từ
  trusted context. OWNER có scope các active establishments trong current
  organization; MANAGER chỉ STAFF tại selected establishment. System role
  không tự cấp quyền và browser claims không phải authority.

Membership schema có composite uniqueness user/organization/establishment,
không có constraint bảo vệ tổng số OWNER. Owner-count không join global users.
Foundation repository có target-row lock và guard tương tự qua tenant service,
nhưng không phải production mutation path được Backoffice action gọi.

### Existing test evidence

Tìm thấy last-owner suspension tests qua foundation unit/integration paths.
Không tìm thấy focused tests cho `createTenantUserRepository`,
`createOrAttachUser`, production last-owner demotion hoặc concurrency của hai
production mutation paths. Test coverage ở foundation không thay thế bằng
chứng cho production Access Management repository.

Không chạy lại test suites trong bước Analysis; không tuyên bố chúng PASS.

### Dated diagnostic evidence and limits

Diagnostic trong task ngày 2026-09-06, sử dụng fixtures tổng hợp và database
dùng một lần, đã ghi nhận:

| Scenario                             | Observed result                                                  |
| ------------------------------------ | ---------------------------------------------------------------- |
| Attach sole OWNER thành STAFF        | OWNER count `1 -> 0`; membership khác của target user không đổi  |
| Hai edits tuần tự, ban đầu hai OWNER | `SUCCESS / LAST_OWNER_REQUIRED`; còn một OWNER; một audit commit |
| Hai edits đồng thời có kiểm soát     | `SUCCESS / SUCCESS`; OWNER count `2 -> 0`; hai audit commits     |

Concurrency diagnostic chạy actual production repository trên PostgreSQL
17.10, isolation `read committed`, với actor được sign-in, session validation
và trusted tenant resolution. Actor OWNER tại A được phép quản lý targets tại B
trong cùng organization; không cần membership của actor tại B.

PostgreSQL quan sát hai backend riêng cùng chờ tại actual UPDATE trước khi
khóa tạm do diagnostic giữ được thả. Hai guard đã đi qua trước khi mutations
hoàn tất. Vì vậy classification là `CONFIRMED_RACE`, không chỉ suy luận từ
count-then-update hoặc một stress loop ngẫu nhiên.

Đây là bằng chứng runtime disposable đã ghi trong task và được tóm tắt vào
planning; không có standalone diagnostic script/log artifact được commit.
Containers đã bị hủy. Không phải production observation, HTTP-action/browser
QA hoặc regression coverage đã được lưu trong repository.

Attach STAFF và edit–edit đã được runtime kiểm chứng. Attach MANAGER,
edit–attach và attach–attach chưa chạy riêng; chúng cần future regression
coverage, không được ghi như kết quả đã PASS.

## Affected Boundaries

| Boundary                     | Assessment                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Runtime / data owner         | Cloud Backoffice server / db-cloud; không thay owner                                                        |
| Tenant scope                 | Giữ trusted organization và establishment scope, fail closed                                                |
| Membership authorization     | Giữ role enum, grant mapping, MANAGER restrictions và self-protection                                       |
| Identity / authentication    | Không đổi global user, credential, reset, session hoặc selection contract                                   |
| Persistence                  | Giữ schema/migration; chỉ bounded membership transaction behavior dự kiến thay đổi                          |
| Audit / session side effects | Giữ event semantics và scoped revocation hiện có; failed transaction không để lại committed success effects |
| Other modules                | Không đổi Personnel, Booking, Reputation, Establishment Profile hoặc authorization operations của chúng     |
| Public / local / provider    | Không public surface mới, local runtime, provider hoặc external delivery                                    |

`PAGE_LOCAL` là routing theo capability, không phải khẳng định chỉ sửa một file
UI. Nếu Design đòi thay shared permission semantics, data ownership, schema
hoặc module khác, phải dừng và reclassify; Analysis không cấp quyền mở rộng.

## Lifecycle Baseline

Giữ nguyên các giá trị hiện tại của Module Registry:

| Bounded capability                 | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review marker |
| ---------------------------------- | ---------------- | -------------- | ----------- | -------------------- | ------------------- | ------------- |
| Authentication foundation          | —                | IMPLEMENTED    | UNVERIFIED  | NOT_READY            | NOT_ASSESSED        | NEEDS REVIEW  |
| Tenant / membership boundary       | APPROVED         | IMPLEMENTED    | UNVERIFIED  | NOT_READY            | NOT_ASSESSED        | OK            |
| Access / membership administration | —                | IMPLEMENTED    | UNVERIFIED  | NOT_READY            | NOT_ASSESSED        | NEEDS REVIEW  |

Dấu `—` không được tự chuyển thành `APPROVED` hoặc một lifecycle value khác.
`IMPLEMENTED` của broader capability không có nghĩa invariant này đã an toàn.
Diagnostic synthetic không promote Environment hoặc Production Readiness.
Không sửa Registry hoặc Product Knowledge trong bước này.

## Requirement Readiness

`READY_FOR_SPECS`, nhưng chỉ sau explicit Gate 1 approval trên exact artifacts.

Có thể mô tả behavioral requirements mà không chọn cơ chế implementation:
giữ active OWNER của target establishment; áp dụng nhất quán cho edit/attach;
không để các concurrent successful transitions loại bỏ tất cả OWNER; failed
batch không commit một phần; giữ existing authorization và identity boundaries.

Capability duy nhất: `authorization/establishment-owner-preservation`.
Đây là main-spec coverage mới cho invariant hiện hữu. Không dùng
`skip_specs: true`; không thêm requirement cho unresolved Product workflows.

## UI / UX Applicability

Không có thay đổi layout, component, navigation, form fields hoặc action
signature được đề xuất. Tuy nhiên các thao tác trước đây thành công sai sẽ
nhận error hiện có: có ảnh hưởng tới kết quả tương tác, cần đánh giá
`UI_AFFECTING` / `BROWSER_QA_REQUIRED` theo QA protocol trước Apply, không tự
miễn Browser QA chỉ vì production diff có thể nằm ở repository.

Gate 1 không tạo page pack hoặc UX artifact, không sửa error copy từ
organization sang establishment. Bất kỳ copy/interaction redesign nào cần
được bound và review riêng trước khi đưa vào implementation allowlist.

## Conflicts and Unknowns

1. `WORDING CONFLICT` — establishment versus organization: retained for
   explicit Gate 1 review. Kết luận đề xuất là bảo vệ từng establishment;
   không tìm thấy opposing requirement cho phép zero OWNER tại establishment.
   Không âm thầm chuẩn hóa authority docs hoặc error copy.
2. `NEEDS REVIEW` — broader Access Product Decision: scoped out. Gate 1 chỉ
   review bounded invariant repair và compatibility, không approve lifecycle.
3. `RELATED SECURITY QUESTION / NEEDS SECURITY / PRODUCT DECISION` — active
   OWNER membership của DISABLED global user vẫn được count. Scoped out;
   không đổi phép đếm thành usable-principal policy.
4. Attach có nên thay đổi/reactivate existing membership: Product workflow
   decision riêng. Repair giữ behavior hợp lệ hiện tại, không quyết định lại.
5. Cơ chế concurrency control và lock ordering: technical decision dành cho
   Design sau approved requirements, không phải authority blocker cho việc
   mô tả observable invariant.
6. Production incidence, tần suất race và dữ liệu đã zero OWNER:
   `UNVERIFIED` và ngoài scope. Không có remediation/backfill được cho phép.

Không có unresolved requirement-level conflict bắt buộc chọn một policy mới
để viết bounded invariant. Nếu reviewer bác scope establishment hoặc đòi đổi
các exclusions trên, phải revise Analysis và review lại trước Specs.

## Analysis Conclusion

`READY_FOR_SPECS`.

Bounded scope được xác định cho review: `PAGE_LOCAL`, Cloud Access Management,
security-sensitive, cả attachment bypass lẫn confirmed edit concurrency race.
Chỉ capability `authorization/establishment-owner-preservation` có thể đi tiếp
sau Gate 1 approval; `skip_specs: true` không phù hợp.

Khuyến nghị review xác nhận establishment-scoped active-membership invariant,
giữ compatibility và exclusions đã nêu, rồi cho phép viết delta Specs.
Không viết Specs/Design/Tasks, implement, sync/archive hoặc promote lifecycle
trong lượt này. Gate 1 packet phải giữ `AWAITING_HUMAN_REVIEW`.
