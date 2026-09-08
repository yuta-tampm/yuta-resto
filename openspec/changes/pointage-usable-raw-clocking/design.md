## Context

Change `pointage-usable-raw-clocking`, schema `yuta-spec-driven`.
Xem [Proposal](proposal.md), [Analysis](analysis.md) và exact approved
[raw-clocking delta](specs/pointage/raw-clocking/spec.md) /
[authorization delta](specs/authorization/pointage/spec.md).
Gate 2 đã approve 20 requirements / 62 scenarios. Design này là đề xuất cần
Sensitive Design review, chưa cho phép Tasks hoặc Apply.

Current repository: existing Backoffice Next.js cloud, postgres-js/Drizzle
`@yuta/db-cloud`, portable `@yuta/auth`, Zod `@yuta/contracts`.
Foundation đã có credential, distributed rate limiting, audit và closed six
operations; chưa có employee route, continuation, raw events hoặc receipt.

Sources trực tiếp: `apps/backoffice/src/server/pointage/{service,authorization}.ts`;
`packages/db-cloud/src/{pointage-repository,client}.ts`;
`packages/db-cloud/src/schema/{pointage,personnel,tenancy}.ts`;
foundation tests và archived foundation Design. `issueCredential` và
`resetCredential` đã khóa scoped Personnel dossier bằng FOR UPDATE.
Personnel fields hiện có: id, givenNames, familyName, entryDate, departureDate.
Không thêm employee identity hoặc Personnel permission.

Authority: root/scoped AGENTS, docs README/CURRENT_STATE/AUTHORITY_MODEL,
activation/normativity policies, Personnel Product Knowledge, authentication/
tenancy/database architecture, ADR-003, Production Readiness, UI workflow và
QA protocol. Code chứng minh implementation baseline, không thay Product authority.
Gate 1 và hai delta Specs không được sửa.

## Goals / Non-Goals

**Goals:** chốt exact security/transaction/time/UI approach để implement
approved outcomes sau gate; chứng minh atomic evidence/receipt, stale-client
protection và shared-device isolation; giữ P13/P14 đúng authority layer.

**Non-Goals:** toàn bộ explicit non-scope trong Proposal và raw R13 giữ nguyên.
Không generic employee/cloud session, canonical/materialized session table,
manager UI, credential-management UI, correction, Planning/Today/payroll/POS/
Site Agent/Display/offline/sync hoặc production provider. Không Technical
Implementation Contract hay Implementation Plan trong Design này.

## Decisions

### D1 — Placement, trusted entry và test-only composition

Route đề xuất: `apps/backoffice/src/app/pointage/[establishmentSlug]/page.tsx`,
ngoài authenticated restaurant layout; dùng existing root fonts/styles,
`NO_APPLICATION_SHELL`. Không redirect qua cloud login hay consume cloud-user
cookie để authorize employee. Manager placeholder không sửa.

Node-runtime route handlers dưới `/api/pointage/[establishmentSlug]/...`.
Mỗi handler normalize slug và resolve active organization/establishment bằng
existing foundation repository. Request IDs/slug/header không tenant authority.
Mỗi operation re-resolve current active scope, không trust client IDs.

Composition off by default. Current change chỉ có local synthetic test factory:
explicit `YUTA_POINTAGE_SYNTHETIC_TEST_MODE=true`, `NODE_ENV` development/test,
`VERCEL` absent, server bind loopback, explicit
`POINTAGE_TEST_ORIGIN=http://127.0.0.1:3001`. Parse `CLOUD_DATABASE_URL`
bằng URL parser; hostname chỉ trong exact loopback allowlist `localhost`,
`127.0.0.1`, `[::1]`, như foundation integration test hiện có.

Exact disposable database-name rule:
`^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$`.
Case-sensitive whole-string match, không substring/glob/multiline; match phải
tiêu thụ toàn bộ name, kể cả khi regex engine cho `$` khớp trước final newline.
Path URL phải là đúng một leading slash + name hợp lệ, không percent-encoded
alias, extra slash, whitespace/newline hoặc query/fragment database override.
expectedName là exact pathname bỏ một leading slash, không trim/case/Unicode
normalization. Không browser-controlled URL/database selection.

Chỉ sau URL guard mới mở connection cho identity probe:
`SELECT current_database()` MUST trả actualName exactly equal expectedName
(case-sensitive), và actualName cũng phải pass cùng whole-string rule.
Không instantiate usable Pointage/provider hoặc fixture/migration/attendance
write trước cả hai kiểm tra. Reject `yuta_cloud`, staging/production,
non-loopback, prefix/suffix sai, actual-name mismatch hoặc probe failure.
`NODE_ENV=production` hoặc `VERCEL` vẫn deny dù tên DB có vẻ disposable.

Integration và Browser QA dùng cùng guard, không skip/weaken để tiện test.
Convention này giữ anchored allowlist của
`packages/db-cloud/test/pointage-repository.integration.test.ts`,
chỉ đổi capability-specific prefix; không mở quyền real attendance.

Factory inject deterministic trusted-address test provider từ server-owned
test composition, không từ request/body/header/cookie. Browser QA dùng real
Next dev route + real disposable PostgreSQL synthetic fixtures, không mocked
acceptance. Không expose provider selector hoặc spoof-address API cho browser.
Standard production build/composition luôn unavailable; test module không trở
thành production default, kể cả flag tồn tại. Missing/untrusted provider từ chối
trước credential lookup/processing; giữ existing candidate 5/client 30 failures
trong 15-minute window/block, không redesign thresholds.

Không trực tiếp trust Forwarded/X-Forwarded-For/X-Real-IP/Host cho provenance.
Test origin là server config kiểm tra chính xác, không derive từ browser Host.
Origin dùng CSRF check, không client-address hoặc tenant proof.
Future production provider vẫn cần authority riêng; Design không implement nó.

Alternative: generic Backoffice session/cookie hoặc POS runtime bị loại vì
khác authority/runtime. Test-mode switch giới hạn environment/composition,
không field/classifier synthetic versus real employee.

#### D1a — Dual-client / same-database synthetic runtime

Human clarification chỉ cho phép alignment Design/Tasks, chưa resume Apply.
Mô hình này thuộc existing Backoffice cloud, không runtime/app mới hoặc
production credential contract. `CLOUD_DATABASE_URL` đã qua D1 là TARGET
descriptor; bootstrap/migration identity trong URL đó không là runtime client.
Cả hai nguồn kết nối MUST có cùng exact parsed hostname, port, database name
với target D1. Không alias/normalization để làm khớp một nguồn khác.

Runtime nhận hai server-only injected clients, xác thực PostgreSQL độc lập:
`foundationClient` và `rawClient`. Test bootstrap/harness sau D1 identity proof
có thể chuẩn bị ephemeral role-specific connection material để inject; secrets
chỉ process/server memory, không log/commit/browser serialization. Không thêm
production environment credential contract, generic multi-database service
locator, merged pool hoặc untyped interchangeable database handle.

- `foundationClient`: exact `yuta_pointage_foundation_runtime`, LOGIN,
  NOSUPERUSER, NOCREATEDB, NOCREATEROLE, NOREPLICATION, NOBYPASSRLS, NOINHERIT.
  Không membership/MEMBER/USAGE/SET path tới role khác, SET ROLE, database/schema/table/
  function ownership, WITH GRANT OPTION, ACL administration hoặc owner fallback.
  Đây chỉ là test-only DB execution identity, không Product permission,
  employee/manager identity hay production role.
- `rawClient`: exact `yuta_pointage_raw_writer`; giữ nguyên toàn bộ D4b/F8
  attributes, privileges, delegated helper và same-connection admission.
  Không nhận limiter/audit/credential-management quyền từ foundation.

Cả hai MUST dùng SAME exact verified raw-clocking disposable database theo D1,
không chỉ cùng cluster. `yuta_pointage_foundation_test...` chỉ dành C17 8/8
regression evidence, KHÔNG dùng làm runtime foundation DB. Không split credential
validation và raw evidence qua hai databases; không đổi C17 guard/prefix.

##### Exact foundation validation footprint

Nguồn hiện tại: `packages/db-cloud/src/pointage-repository.ts` và
`packages/db-cloud/src/schema/pointage.ts`. Các cột dưới là SQL column names,
bao gồm SELECT predicates/join keys, không chỉ returned fields. Chỉ column grants
được liệt kê, không whole-table grants kể cả khi hiện tại INSERT cần mọi cột.

| Table (public schema) | SELECT columns | INSERT columns | UPDATE columns |
| `---` | `---` | `---` | `---` |
| `organizations` | `id, status` | none | none |
| `establishments` | `id, organization_id, locale, timezone, slug, status` | none | none |
| `personnel_employee_dossiers` | `id, organization_id, establishment_id, entry_date, departure_date` | none | none |
| `pointage_employee_credentials` | `id, organization_id, establishment_id, personnel_dossier_id, credential_version, credential_format_version, algorithm_version, key_version, lookup_digest, salt, verifier, superseded_at` | none | none |
| `pointage_credential_rate_limits` | `organization_id, establishment_id, key_kind, key_digest, window_started_at, failure_count, blocked_until` | `organization_id, establishment_id, key_kind, key_digest, window_started_at, failure_count, blocked_until, updated_at` | `window_started_at, failure_count, blocked_until, updated_at` |
| `pointage_security_audit_events` | none | `id, organization_id, establishment_id, event_type, outcome, reason_code, manager_user_id, personnel_dossier_id, credential_id, credential_version, requested_operation, occurred_at` | none |

Exact method-to-footprint:

1. `resolveActiveEntryScope`: organizations/establishments SELECT ở trên;
   `lower(slug)`, active statuses và organization join, không Tenancy write.
2. `findCredentialCandidate`: credential SELECT ở trên gồm scoped HMAC
   predicate; không issued/superseded-by administrative columns hay mutation.
3. `findPersonnelEmploymentPeriod`: chỉ năm Personnel SELECT columns;
   không names, documents, history hoặc Personnel write.
4. `isRateLimitBlocked`: SELECT organization_id, establishment_id, key_kind,
   key_digest, blocked_until từ limiter.
5. `recordRateLimitFailure`: INSERT tám limiter columns, ON CONFLICT DO NOTHING;
   SELECT bảy limiter columns gồm WHERE keys và locked row's window/count/block,
   FOR UPDATE; UPDATE đúng bốn mutable columns. Không SELECT updated_at.
   Existing four-column UPDATE đủ cho limiter row lock, không source-row UPDATE.
6. `resetCandidateRateLimit`: WHERE organization_id, establishment_id, key_kind,
   key_digest (candidate only); UPDATE window_started_at, failure_count,
   blocked_until, updated_at. Existing behavior không DELETE.
7. `appendAudit`: INSERT đúng mười hai cột của `auditValues`; không RETURNING,
   SELECT hoặc audit visibility. UUID được app tạo; không sequence grant,
   không mở users/Personnel/credential SELECT chỉ vì audit có foreign keys.

Không method nào trong bảy phương thức cần DELETE, credential/source mutation
hoặc helper EXECUTE. Phát hiện footprint khác khi Apply -> STOP, không widen.
Validation facade chỉ expose bảy methods này và employee foundation operations;
existing constructor/repository có administration methods không cho phép publish
hoặc sử dụng chúng từ synthetic employee runtime. DB grants độc lập MUST deny
issueCredential, resetCredential, supersession và manager administration.

Ngoài CONNECT tới exact target và USAGE public schema, không grant mới trên
object khác. Không application-function EXECUTE, đặc biệt exact
`public.pointage_raw_lock_dossier(uuid,uuid,uuid)`; không continuation
SELECT/INSERT/UPDATE, raw/receipt access hoặc mutation, Personnel/Tenancy
mutation, DDL/trigger disable, DELETE/TRUNCATE, schema CREATE hay role/ACL admin.
Ordinary pg_catalog built-ins/catalog inspection phục vụ query/proof không là
grant mở application functions. Không audit SELECT/UPDATE hay attendance copy.
Effective database/schema CREATE và TEMP không được thành DDL bypass.

##### Ordered composition proof and failure behavior

Sau existing D1 environment/URL/actual-target proof, nhưng trước provider và
usable runtime, kiểm tra đúng thứ tự:

1. Foundation source tuple khớp D1; trên chính authenticated connection chạy
   `SELECT current_database(), session_user, current_user`.
   Expected DB đúng D1; cả hai user đúng `yuta_pointage_foundation_runtime`.
2. Raw source tuple khớp D1; độc lập chạy cùng probe; expected DB đúng D1,
   cả hai user đúng `yuta_pointage_raw_writer`.
3. So sánh hai actual names bằng nhau và bằng D1 expected name; mỗi actual name
   độc lập pass exact whole-string D1 regex. Không SET ROLE để giả identity.
   Pool/connection provenance phải áp dụng tới clients thực sự dùng, không lấy
   proof từ connection khác rồi hoán đổi hoặc dùng bootstrap handle.
4. Foundation effective privileges khớp exact inventory; kiểm tra pg_roles,
   pg_auth_members, pg_class, pg_namespace, pg_database ownership, pg_proc,
   pg_default_acl; effective table/column/function/database/schema privileges,
   PUBLIC/default ACL, pg_has_role MEMBER/USAGE/SET paths và grant options.
   Cột thêm mới không tự được grant bởi table-wide privilege.
5. Raw effective proof giữ nguyên D4b/F8; không weaken inventory để cho role
   foundation mới tồn tại, không thêm raw limiter/audit quyền.
6. Chỉ sau cả hai proof mới instantiate approved injected synthetic
   TrustedPointageClientAddressProvider, kiểm tra trusted provenance rồi tạo
   foundation service và raw runtime. Missing/untrusted provider vẫn deny
   trước credential hash/lookup; không forwarded/unknown-client/candidate-only fallback.

Missing client, another database/C17 target, owner/bootstrap identity,
session_user/current_user mismatch, role membership/SET path, unexpected
privilege/default/PUBLIC inheritance, unprovable target hoặc provider -> generic
fail closed. Không runtime ACL repair, ALTER ROLE/GRANT fallback, silent client
swap, production provider, .env/shared-DB fallback hoặc split-database workaround.
Cần proof thực tế sau future Apply approval; planning không claim role đã tồn tại.

Composition: foundationRepository chỉ backed by foundationClient;
createPointageServerFoundation chỉ dùng foundationRepository.
rawClockingRepository chỉ backed by rawClient; createPointageRawClockingService
consume foundation service, raw repository và approved stateGuard key trong
composition có approved synthetic provider. Không tráo clients hoặc expose
administration methods/URLs/credentials vào browser.

Không chia sẻ một PostgreSQL transaction giữa hai clients. Foundation
prevalidation, distributed limiter và minimized audit giữ transaction/behavior
hiện có. Final raw acceptance vẫn ở raw writer transaction: D4a delegated
locks, current credential + Personnel re-read, continuation lock, exact
operation/lifecycle/accepted-time guards, stateGuard và raw+receipt atomic commit.
Stale foundation success không thay raw authority hoặc authorize mutation.
Manager read/auth boundary D9 không được mở rộng bởi validation-only client;
không cấp users/membership reads cho role này để ghép manager runtime cho tiện.

### D2 — Opaque continuation và authenticity

Chọn 32 cryptographically random bytes, base64url không padding (43 chars),
prefix `ptc1_`; secret chỉ có trong HTTPS response rồi browser module memory.
Không JWT, không signed serialized employee context, không cookie/sessionStorage/
localStorage/IndexedDB/service worker/history state/URL storage. Loopback HTTP
chỉ là isolated synthetic test exception, không production policy.

Durable continuation record lưu SHA-256(secret bytes), không token/plaintext
credential. 256-bit random secret chống guessing; digest lookup scoped
organization/establishment, server record bind dossier và exact credential ID/
version. Khi lookup khớp, so sánh digest bằng constant-time primitive,
revalidate current credential và build fresh PointageEmployeeContext cho exact
operation server-side. Không expose record, role/grant hoặc context.

Mỗi identify thành công cấp token mới; không rotate giữa một interaction để
tránh lost-rotation response và parallel retry ambiguity. Không refresh token
hoặc sliding absolute lifetime. Rotation là new identification/new random
token; old interaction phải kết thúc hoặc hết hạn, không alias sang token mới.

Lifetime: absolute 120 seconds từ DB issue time; idle 60 seconds từ latest
successful authorized state/mutation/replay. Idle deadline không vượt absolute
deadline. Failures/polling/background activity không gia hạn; UI không heartbeat
tự động. Mỗi valid foreground state request/user mutation update idle deadline
atomically, trả remaining durations để client dùng monotonic timer cho clearing.
Server deadlines là authority; client clock không được kéo dài TTL.

Reset/regeneration: mỗi authorized employee operation đọc current credential
trong cùng dossier lock với reset. Superseded credential hoặc version mismatch
deny mọi continuation old-version, kể cả receipt replay. Không sửa crypto hoặc
issue/reset policy. Không cần background invalidation job; ended/expired/version
checks chặn ngay future request. Credential reset không phải raw mutation.

Alternative: stateless JWT cần serialize claims, khó immediate end/reset và
shared-device handling; ambient cookie dễ share giữa tabs/next users. Opaque
server-side revocable state phù hợp bounded interaction; không thành canonical
identity hoặc attendance source. XSS/malicious browser extensions có thể đọc
live memory; chống qua D10, không tuyên bố memory là bảo vệ trước compromised
device/TLS endpoint.

### D3 — Shared-device lifecycle và end semantics

State flow:
CREDENTIAL_ENTRY -> IDENTIFY_PENDING -> ACTIVE_STATE -> MUTATION_PENDING ->
RECEIPT -> ENDING -> NEUTRAL.
ACTIVE_STATE có NOT_CLOCKED_IN/CLOCKED_IN; domain mutation chỉ khi server đã
cấp state guard. Mỗi committed receipt hiển thị 10 seconds rồi auto-end; explicit
`Terminer` kết thúc sớm. Muốn mutation khác sau receipt bắt đầu interaction mới;
multiple daily sessions vẫn không quota. Không extra history/totals view.

Credential entry chỉ memory trong password input; clear ngay sau identify
request settle, cả failure. Identity/state chỉ render sau valid identify +
current-state load thành công; không SSR sensitive data.

Explicit end: ngay lập tức phủ neutral UI, clear personal DOM synchronously,
bump interaction-generation counter, abort pending fetch callbacks và gửi
best-effort authenticated end request. Server end khóa dossier rồi continuation,
set ended_at một lần; retry end idempotent. End capability chỉ terminate own
continuation, không thêm operation/grant hoặc revoke/suspend credential.
Own end được xử lý kể cả eligibility/version đã mất; không trả employee data.

Phân biệt local clearing và server-confirmed end:

- ENDING không cho state read/mutation/replay; không hiển thị employee.
- End hoàn tất khi server commit ended_at (hoặc server-enforced expiry);
  không claim network timeout đã revoke trên server.
- Nếu end response mất/cloud unavailable, browser vẫn clear hết secrets/data,
  không retry attendance, không restore interaction; server authorization còn
  giới hạn bởi idle/absolute expiry. Không báo “server đã hủy” khi chưa có proof.
- Any request sau committed end/expiry bị deny. Request đã được linearize trước
  end có thể commit trước end; abort fetch không rollback server. End acknowledgement
  chỉ sau lock order bảo đảm earlier accepted mutation đã settle.
- Không thể hứa remote invalidation tức thì lúc offline; không định nghĩa
  offline “end confirmed”. Đây là explicit failure semantics, không weakening
  quyền sau completed interaction end.

Client clears ngay khi idle deadline, absolute deadline, pagehide, visibility
hidden, navigation/unmount hoặc explicit end. Không gia hạn timer bởi moving
mouse. Khi hidden, best-effort end; bfcache entry lưu neutral DOM, không personal
React tree. pageshow (gồm persisted), refresh, back/forward luôn neutralize trước
render và yêu cầu identify mới; không auto-fetch previous employee bằng token.

Tab duplication mở neutral page; không dùng copyable durable store hoặc
BroadcastChannel/postMessage truyền token. Browser restart không có token để
resume. Outstanding response chỉ apply khi same live generation; late success/
identity không repopulate sau clearing. No-store alone không đủ cho history,
nên bắt buộc synchronous pagehide clearing + pageshow reset.

Khi timeout mutation trong live interaction, giữ request tuple trong memory
cho exact retry; không auto-end vì timeout ngay lập tức. Nếu TTL/end/navigation
xảy ra, purge tuple cùng interaction; không phục hồi lịch sử sau refresh hoặc
tạo replacement mutation tự động. Người dùng identify mới và xem current state;
existing committed receipt vẫn recoverable server-side bằng exact known tuple
và current authority, nhưng không có history/list endpoint.

Tests phải chứng minh tất cả transitions này; không claim UI privacy đối với
ảnh chụp OS, shoulder surfing hoặc compromised browser ngoài app threat model.

### D4 — Trusted Personnel projection và current authorization

Không tạo Personnel contract/grant mới. Scoped query chỉ lấy
id, given_names, family_name, entry_date, departure_date từ
personnel_employee_dossiers với organization_id + establishment_id + id.
Server compose displayName = trimmed givenNames + single separator + familyName;
không persist tên vào Pointage tables hoặc expose từng Personnel field riêng.
P5 approve minimal own projection; Personnel §3 cho downstream projections;
OWNER-only dossier-management không bị mở cho employee/MANAGER.

Identifier + nonempty names + valid entry/departure/date/timezone phải valid.
Missing/cross-scope/unverifiable -> generic access/unavailable failure, không
fabricated name/employee. Pointage không update Personnel.

Identify, state.read, operation.create đều evaluate current lifecycle inclusive
entry/departure theo authoritative current establishment business date.
Không dựa vào CLOCK_IN grouping date cho later CLOCK_OUT.
Missing lifecycle/invalid timezone fail closed, không default Europe/Paris.

Public handlers không nhận PointageEmployeeContext input. Prevalidation dùng
existing credential primitives/provider/rate limits, nhưng trước cấp continuation
hoặc expose state phải transactionally recheck current credential + scoped
Personnel; chỉ lúc đó tạo fresh context cho exact operation. Không dùng
pre-transaction success để bypass reset/departure race.

#### Identify trả initial state — không gộp hai operation authorities

Credential verification vẫn chạy sau trusted scope/provider/rate prerequisites
của foundation. Với verified proof, successful identify + state boundary là:
trusted scope resolution/recheck dưới transaction locks -> exact
`pointage.employee.identify` authorization + current Personnel eligibility ->
continuation issuance candidate -> riêng exact
`pointage.employee.state.read` authorization + current scope/credential/version/
Personnel re-check -> canonical raw-chain validation -> derived minimal own
state -> successful continuation + state response sau commit.

Context mang operation identify không được dùng như state.read context.
Cả hai exact guards phải được gọi và pass, không infer guard thứ hai từ
identify success hoặc continuation existence; không merge identifiers/new grant.
Candidate secret/digest/binding chỉ ở server memory, chưa usable/persisted.
Trong cùng transaction và D4 lock order, derive state/projection trước INSERT
continuation. Final server-time check trước INSERT re-evaluate lifecycle cho
cả hai operations tại current business date (kể cả midnight), giữ current
scope/version prerequisites; DB issue/deadline timestamps theo D2.
Stage payload server-side, COMMIT rồi mới expose token/name/state; không
commit identify-only row rồi gọi state.read ở transaction khác.

State.read denied, lifecycle/scope uncertainty, inconsistent raw chain hoặc DB
failure trước commit -> rollback candidate/insert, discard secret và staged
state; existing generic access/unavailable response, không protected identity/
state/token hoặc partial identify-only success. Identify không tạo raw event/
receipt. Nếu COMMIT outcome/response mất, có thể có orphan continuation đã vượt
đủ cả hai guards; không claim success, re-show secret hoặc bypass state.read.
Token đó hết hạn D2, caller identify mới như D8. Test phải inject failure sau
identify guard nhưng trước state-read/commit để chứng minh response/issuance
không tạo partial authorization.

Lock order không đổi: active organization FOR SHARE -> establishment FOR SHARE
-> scoped Personnel dossier FOR UPDATE -> continuation FOR UPDATE khi có.
READ COMMITTED trên cùng connection/transaction; không autocommit lock call.
Ba lock đầu dùng duy nhất delegated function D4a; sau return, invoker đọc lại
minimal Personnel/current credential và khóa continuation bằng full
org+est+dossier+continuation key. Quyền UPDATE hai cột continuation đủ cho
FOR UPDATE trên chính table đó; không suy ra quyền lock Tenancy/Personnel.
Locks giữ đến outer COMMIT/ROLLBACK, không chỉ đến function return.

Foundation issueCredential/resetCredential (pointage-repository.ts) vẫn dùng
scoped dossier FOR UPDATE trong transaction riêng. Personnel updateEmployee
(entryDate) và setEmployeeDeparture ghi cùng dossier với full scope + revision
predicate; PostgreSQL row UPDATE conflict với FOR UPDATE dù writer không gọi
helper. lockScopedPersonnel của formalites-personnel-draft-repository.ts cũng
FOR UPDATE cùng row. Không sửa các writer này hoặc biến advisory locks
idempotency hiện có thành cross-capability coordination.
Nếu writer khác commit trước lock, Pointage đọc lại current row sau khi chờ;
nếu Pointage lock trước, writer đó chờ đến transaction end. Current parent
status/timezone không đổi dưới FOR SHARE. Lifecycle/version vẫn được kiểm tra
ở D4 và actual accepted instant D7; lock không phải authorization.

Deadlock/lock timeout/statement timeout: abort whole transaction, generic
unavailable; giữ lock_timeout 2s, statement_timeout 5s, không bỏ lock, nới grant
hoặc đổi request identity. Không swallow lock error trong savepoint rồi
tiếp tục; rollback savepoint có thể release locks. Unknown COMMIT vẫn theo D5.

#### D4a — Bounded delegated row locking (reopened proposal)

PostgreSQL 17 yêu cầu UPDATE trên ít nhất một cột của mỗi table bị row-lock;
SELECT-only không đủ. Đây là privilege prerequisite, không permission Product.
[SELECT privilege](https://www.postgresql.org/docs/17/sql-select.html) và
[row-lock compatibility](https://www.postgresql.org/docs/17/explicit-locking.html)
là platform references; actual disposable proof còn bắt buộc.

| Option                                    | Đánh giá                                                                                                                                                                                                                      | Quyết định                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| A — UPDATE một cột để lock                | UPDATE(id) dù hẹp vẫn cho SQL mutate key; convention “code không UPDATE” không chặn alternate writer. Thêm trigger/RLS trên Tenancy/Personnel để biến grant thành lock-only sẽ sửa owning boundary ngoài slice.               | Loại; không cấp cho runtime writer.                                |
| B — SECURITY DEFINER chỉ lock             | Giữ đúng PostgreSQL tuple locks với existing writers, tách quyền lock khỏi quyền application mutate. Thêm một privileged executable boundary có owner/ACL/body cố định, được review trong revision này.                       | Chọn dưới đây; chưa authorize implementation.                      |
| C — transaction advisory lock             | Existing issue/reset không dùng advisory key; Personnel keys hiện là operation/actor/request-specific, không chung dossier lock. Không tự phối hợp với UPDATE hay direct SQL writer.                                          | Loại; muốn dùng phải đổi nhiều writer ngoài scope.                 |
| D — FK KEY SHARE, SERIALIZABLE hoặc mutex | KEY SHARE không chặn non-key lifecycle/timezone UPDATE; isolation alone không giữ nguyên D4 và mọi existing writer không cùng protocol; process mutex không cross-instance. Full-table locks quá rộng, không least privilege. | Loại; không có cơ chế tương đương đã chứng minh tốt hơn row locks. |

Exact signature đề xuất:
`public.pointage_raw_lock_dossier(p_organization_id pg_catalog.uuid,
p_establishment_id pg_catalog.uuid, p_personnel_dossier_id pg_catalog.uuid)
RETURNS pg_catalog.void`.

- Một function, không overload/default/variadic/table-name/column-name/SQL
  argument, không generic lock API; LANGUAGE plpgsql, VOLATILE, PARALLEL UNSAFE,
  SECURITY DEFINER, CALLED ON NULL INPUT. Bất kỳ NULL -> generic exception,
  không dùng STRICT để silently return trước locks.
- Inputs chỉ từ trusted server-resolved scope + verified dossier binding D4,
  không browser DTO/GUC/headers/session claims. Function không authenticate
  employee, không trả context và không thay exact operation guards.
- Trước lock, require session_user là dedicated `yuta_pointage_raw_writer`;
  lỗi caller/null/missing/inactive/mismatched row có cùng SQLSTATE P0001,
  message `POINTAGE_LOCK_UNAVAILABLE`, không DETAIL/HINT chứa IDs/status/data.
  Runtime mapping vẫn D8 generic unavailable, không expose SQL error.
- Ba static PERFORM statements, mỗi statement require FOUND:
  (1) public.organizations WHERE id = p_organization_id AND status = 'active'
  FOR SHARE;
  (2) public.establishments WHERE organization_id = p_organization_id AND
  id = p_establishment_id AND status = 'active' FOR SHARE;
  (3) public.personnel_employee_dossiers WHERE organization_id = p_organization_id
  AND establishment_id = p_establishment_id AND id = p_personnel_dossier_id
  FOR UPDATE. Không filter employment dates trong helper; eligibility và
  own-end exception vẫn D3/D4, không deny end vì former status.
- Return void only; không SELECT INTO result/return name, lifecycle, token,
  credential, row hoặc lock ownership claims. Missing tuple errors abort outer
  transaction; không return partial lock success.
- Fixed function-local `search_path = pg_catalog, pg_temp`; public tables và
  helper call luôn schema-qualified; referenced types/functions/operators dùng
  pg_catalog-qualified identities (UUID equality không resolve qua caller
  schema). Không dynamic SQL, EXECUTE, dblink, filesystem/network, user callbacks,
  SET ROLE/SESSION AUTHORIZATION, mutable request configuration hoặc secret.
- Không INSERT/UPDATE/DELETE/TRUNCATE, DDL hay explicit table lock trong body.
  Row-lock bookkeeping không đổi application columns. Không tự touch/end,
  issue/reset, accept event hoặc commit; tất cả nằm ở invoker bên ngoài.
- Không lock continuation trong helper: invoker có column UPDATE đã duyệt,
  dùng full scoped key sau ba delegated locks. Reentrant helper call từ raw
  INSERT trigger D5/D6 khóa lại cùng tuple trong same outer transaction.

Một coherent foreign tuple từ compromised DB login có thể gây lock contention;
function không phải RLS/tenant-authentication layer. Full predicates ngăn ghép
mismatched tuple; server guards phải chặn chọn foreign tuple trước call.
Không publish function qua browser/manager transport. Direct DB credential
compromise/privileged DBA nằm ngoài employee threat model; không claim function
tự chứng minh tenant authority hoặc loại mọi denial-of-service. Timeouts và
same-session preflight giới hạn fail-closed execution, không thay public limiter.

#### D4b — Owner, ACL và invoker separation

Exact owner: `yuta_pointage_raw_lock_owner`, NOLOGIN, NOSUPERUSER,
NOCREATEDB, NOCREATEROLE, NOREPLICATION, NOBYPASSRLS, NOINHERIT; không member
role khác, không table/database/schema owner. Chỉ owns exact helper function.
Dedicated runtime caller `yuta_pointage_raw_writer` cũng non-superuser,
NOCREATEDB/NOCREATEROLE/NOREPLICATION/NOBYPASSRLS; không membership, inheritance,
ADMIN/GRANT OPTION hoặc SET ROLE path tới lock owner, migration owner hay
existing privileged foundation/Personnel roles.

Exact helper-owner object privileges ngoài inherent function ownership:

| Object                             | Allowed owner privileges                                        |
| ---------------------------------- | --------------------------------------------------------------- |
| public schema                      | USAGE only, no persistent CREATE.                               |
| public.organizations               | SELECT(id, status), UPDATE(id) only.                            |
| public.establishments              | SELECT(id, organization_id, status), UPDATE(id) only.           |
| public.personnel_employee_dossiers | SELECT(id, organization_id, establishment_id), UPDATE(id) only. |
| Other application tables/functions | No new grant, no inherited mutation/execution privileges.       |

UPDATE(id) tồn tại ở inaccessible lock owner chỉ để PostgreSQL cho row locking;
không cấp/inherit cho runtime, không column grants WITH GRANT OPTION. Đây là
explicit delegated DB privilege proposal, không Personnel application permission.
Locked function body không chứa mutation nên caller không sử dụng được owner
UPDATE để đổi Tenancy/Personnel. Owner NOLOGIN alone không đủ: phải chứng minh
không role membership/SET ROLE path và không owner-controlled writable schema.

Runtime giữ F8: SELECT/INSERT cần thiết, continuation UPDATE chỉ idle_expires_at/
ended_at; không thêm UPDATE bất kỳ cột nào của ba source tables, không broad
table UPDATE, DDL/trigger-disable/DELETE/TRUNCATE hoặc owner fallback.
Bổ sung duy nhất EXECUTE trên exact helper signature, không WITH GRANT OPTION.
Existing foundation credential lifecycle/limiter operations giữ own existing
repository/authority; helper không cấp credential-management hoặc limiter
mutation quyền cho raw writer, không hợp nhất runtime writer với privileged
foundation/Personnel connection để lấy quyền lock.

D1a làm rõ riêng synthetic employee runtime: foundation validation dùng exact
validation-only role/client trong cùng database; credential issue/reset vẫn
ngoài runtime này. Không thay helper body/owner/ACL hoặc raw writer inventory.

Migration revokes all function EXECUTE from PUBLIC và mọi non-owner/non-writer
grantee; grant EXECUTE chỉ dedicated writer (owner's inherent right remains).
Không dựa vào default ACL. Function create, ownership transfer, PUBLIC revoke
và final grant nằm trong cùng journaled migration transaction, không window
publicly executable. Final schema không writable bởi writer/PUBLIC/lock owner.
Schema ownership vẫn migration boundary, không Pointage runtime.

[SECURITY DEFINER precautions](https://www.postgresql.org/docs/17/sql-createfunction.html)
giải thích owner execution, safe lookup và default PUBLIC EXECUTE; lựa chọn
tên/ACL/body/role isolation trên là Design của YUTA, không upstream recommendation.

Trước instantiate synthetic provider/runtime và trước mỗi raw dossier
transaction trên chính connection dùng cho operation: verify exact session/
current user; function OID/signature, owner, SECURITY DEFINER/language/volatility/
parallel/null behavior, fixed search_path và body fingerprint khớp reviewed
journaled migration; verify roles, object owners, effective table/column/function/
schema privileges và defaults/PUBLIC/inherited paths. Check pg_catalog.pg_proc,
pg_roles, pg_auth_members, pg_class, pg_namespace, pg_default_acl;
has_table_privilege + has_column_privilege + has_function_privilege;
pg_has_role với MEMBER/USAGE/SET, không chỉ trực tiếp grants.
[Privilege inquiry](https://www.postgresql.org/docs/17/functions-info.html)
là catalog reference; expected body fingerprint được chốt từ generated/reviewed
migration khi Apply được duyệt, không browser/env supplied.

Owner missing/wrong/LOGIN/superuser, extra UPDATE, unsafe schema/search_path,
PUBLIC EXECUTE, missing EXECUTE, changed body/signature hoặc không chứng minh
được effective privileges -> refuse composition/operation before credential/
protected processing, no helper or attendance write; không auto-repair grants,
fallback invoker/owner, hoặc “test-only” bypass. Helper còn deny wrong session
caller nếu accidental EXECUTE grant xuất hiện. Concurrent malicious DBA changing
ACL/body không thể bị app kiểm soát tuyệt đối; privileged migration/admin không
được chạy khi synthetic runtime hoạt động, không giả catalog check là DBA-proof.

Expiry/version/lifecycle deny trước state/receipt lookup response. New current
credential sau reset có thể authorize own original receipt với exact request
tuple; old continuation không thể. Receipt không bound như authorization vào
old continuation, nên reset không phá recoverability sau valid re-identify.

### D5 — Atomic transition, stale guard và linearization

Dùng PostgreSQL transaction READ COMMITTED + scoped dossier row FOR UPDATE
để serialize mọi writer cùng employee, không session/counter/projection table.
Các statement đọc head/history chạy sau khi lock đã acquire; không dựa vào
snapshot đọc trước lock. Invoker gọi D4a trong cùng transaction thay direct
SELECT FOR SHARE/UPDATE trên Tenancy/Personnel. Schema raw INSERT trigger là
SECURITY INVOKER, gọi exact schema-qualified D4a helper bằng NEW full scope trước
chain read/validation; reentrant locks không thay order hoặc end transaction.
Do đó alternate raw writer cũng gặp cùng dossier lock và append enforcement;
không biến trigger thành arbitrary SECURITY DEFINER write executor.

Từ current canonical raw head, server tạo opaque stateGuard =
HMAC-SHA256(dedicated HKDF-SHA256 key, versioned length-delimited encoding của
organization/establishment/dossier + head event ID hoặc START).
Key derive existing Pointage secret bằng label riêng
`yuta/pointage/raw-state-guard/v1`, không đổi credential keys/algorithms.
Browser nhận MAC base64url 43 chars, không nhận head ID/dossier/context.
MAC là stale-state precondition, không employee authority, không serialize
trusted employee context; còn cần valid continuation và current checks.

Command gửi requestId, kind, observedStateGuard. Receipt lookup xảy ra sau
current authorization nhưng trước fresh stateGuard comparison:

1. Re-resolve/lock scope, dossier, continuation; recheck validity/eligibility.
2. Lookup scoped committed receipt by requestId. Same intent fingerprint ->
   return original joined receipt; different intent -> request conflict.
3. Với new request: fully validate existing event chain, compute current guard,
   constant-time compare observed guard. Mismatch -> state conflict/no event.
4. Evaluate exact four transitions. Only no-open+IN hoặc open+OUT accepted.
5. Sample authoritative acceptance clock dưới locks, recheck deadlines/lifecycle
   cho instant này; append raw event và linked receipt, validate constraints.
6. Commit cả hai; chỉ sau successful commit trả committed receipt.
   Nếu DB connection mất tại COMMIT -> unknown outcome, không tự chạy new identity.

Stale OUT sau session A đã close và B open: guard(A head) khác guard(B head),
deny dù kind OUT hợp lệ theo state chung. Stale IN từ một no-open state trước
các sessions khác cũng conflict; UI refresh state rồi explicit new intent,
không rebase request cũ vào head mới.

Same-ID double submit serialize; first commit -> second receipt replay, không
re-evaluate four-state transition. Distinct competing IN/OUT: first thay head,
second stale guard/transition conflict. Không hai request cùng head commit.
No-open induction: empty chain = none; alternation IN/OUT + contiguous ordinal
cho tối đa một open, no overlap. Raw accepted order là dossier ordinal, không
UUID sorting hoặc browser clock.

Concrete DB limits: lock_timeout 2 seconds, statement_timeout 5 seconds cho
bounded transactions; timeout là unavailable/unknown result, không Product quota.
Không tự retry ambiguous commit. Safe pre-commit rollback retry dùng cùng tuple.
Đây là Design choices, không sửa normative business rules.

[PostgreSQL row-lock semantics](https://www.postgresql.org/docs/current/explicit-locking.html)
xác nhận conflicting writers chờ lock tới transaction end; application
serialization/proof ở trên là thiết kế của change, không phụ thuộc process-local mutex.

Alternative: process mutex không bảo vệ multiple server instances; unique
active-session table vi phạm P10; chỉ check latest kind không chống stale OUT.

### D6 — Receipt, request identity và minimum additive persistence

Ba additive tables, đều cloud-only; không fourth session/projection table.
Schema definitions trong @yuta/db-cloud, transport types chỉ ở @yuta/contracts.
Mọi query có trusted organization + establishment; employee query thêm dossier.

#### Raw table: pointage_raw_events

| Field                                                     | Type / purpose                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| id                                                        | UUIDv7 server-generated; event identity, không ordering authority.                   |
| organization_id / establishment_id / personnel_dossier_id | UUID, full tenancy/Personnel reference.                                              |
| ordinal                                                   | bigint > 0, contiguous từ 1 theo dossier; reconstruction order, không counter table. |
| kind                                                      | varchar CHECK IN ('CLOCK_IN','CLOCK_OUT'); chỉ hai raw kinds.                        |
| accepted_at                                               | timestamptz(6), server DB-observed instant.                                          |
| timezone_name                                             | text, validated establishment IANA name snapshot.                                    |
| utc_offset_seconds                                        | integer, observed zone offset tại accepted instant; DST/history reconstruction.      |
| business_date                                             | date, event-local calendar date tại acceptance.                                      |

Không name copy, credential secret, correction, payroll/Planning, synthetic flag,
canonical session ID hoặc expected end date. Unique (scope+dossier+ordinal),
unique (scope+dossier+id), FK establishment và full scoped Personnel, ON DELETE
RESTRICT. Index scoped accepted_at/business_date cho bounded manager reads.

BEFORE INSERT trigger: acquire D4a parent/dossier locks qua exact helper trong
same transaction, rồi invoker validate full existing chain; helper không cấp
UPDATE/DDL cho trigger caller. Reject missing/corrupt scope, compute next
ordinal/allowed kind; không tin
client-supplied accepted_at/calendar/ordinal. DB-owned clock/calendar computation
assign fields; backward clock so với previous event -> fail closed, không clamp.
BEFORE UPDATE/DELETE và statement BEFORE TRUNCATE triggers reject trên raw table.
Repository không export update/delete/truncate/raw-upsert path.

#### Receipt table: pointage_raw_command_receipts

| Field                                                     | Type / purpose                                                                |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| organization_id / establishment_id / personnel_dossier_id | UUID scope; không receipt lookup bằng ID alone.                               |
| request_id                                                | UUIDv4 browser CSPRNG, stable cho mutation intent.                            |
| event_id                                                  | UUID, exactly one corresponding raw event.                                    |
| intent_version                                            | smallint = 1, encoding compatibility.                                         |
| intent_fingerprint                                        | SHA-256 hex của versioned intent bytes; non-authoritative technical metadata. |

PK (org,est,dossier,request_id), UNIQUE (org,est,dossier,event_id).
Fingerprint encoding: ordered JSON array of strings
['pointage-raw-intent-v1', orgUUID, estUUID, dossierUUID, kind, observedStateGuard];
UUID normalized lowercase; allowed kind exact; guard canonical base64url.
UTF-8 SHA-256, server computes; browser không gửi fingerprint hoặc IDs.
Same request ID + different kind/guard -> conflict. Continuation secret/version
không thuộc intent fingerprint để valid re-identification không phá retry.

Receipt FK (scope+dossier+event_id) -> raw (scope+dossier+id);
raw reverse FK (scope+dossier+id) -> receipt (scope+dossier+event_id),
DEFERRABLE INITIALLY DEFERRED, ON DELETE NO ACTION. UNIQUE referenced keys
không deferred. Mutual completeness tại commit: event không thể thiếu receipt,
receipt không thể có missing event. Chỉ successful operations có receipt row;
denial/conflict không tạo raw event hoặc success receipt.

Receipt INSERT/immutability trigger không cho update/delete/truncate; raw và
receipt ở cùng transaction, không event-first asynchronous outbox. Không
persist duplicated timestamp/kind/state/name/JSON success response.
Public receipt luôn join canonical raw event:
{ requestId, result: 'COMMITTED', kind, acceptedAt, timezoneName,
utcOffsetSeconds, businessDate }. Không employee name/ID, grants, credential
version, history hoặc daily total. Bytes/fields ổn định từ original raw event,
không recompute historical calendar từ current timezone. Same-ID retry trả same
receipt fields. Metadata không đủ để tạo attendance fact khi raw chain invalid.

Không eviction hoặc receipt TTL cleanup trong change; đây không phải legal
keep-forever policy. Cần separately approved retention handling trước real data.
Nếu record corrupt/missing do privileged tampering, fail closed/investigate,
không “sửa” bằng new event.

#### Continuation table: pointage_continuations

Fields: id UUIDv7; full scope+dossier; token_digest 64 lowercase hex UNIQUE
within org/est; credential_id UUID; credential_version integer;
issued_at, absolute_expires_at, idle_expires_at timestamptz(6); ended_at nullable.
Không display name, request payload, plaintext token/PIN/IP hoặc attendance state.
Full scoped dossier FK và credential binding FK:
add UNIQUE (org,est,dossier,id,credential_version) trên existing credential table,
rồi reference cả tuple. Existing credential meanings/rows không thay.
Expiry là auth invalidity, không deletion/retention executor.

Fields immutable sau INSERT: `id`, `organization_id`, `establishment_id`,
`personnel_dossier_id`, `token_digest`, `credential_id`,
`credential_version`, `issued_at`, `absolute_expires_at`.
Chỉ bounded mutable: `idle_expires_at`, `ended_at`.
Immutable fields và idle deadline NOT NULL; ended_at nullable. CHECK
absolute_expires_at = issued_at + 120 seconds và
issued_at < idle_expires_at <= absolute_expires_at. INSERT dùng server DB
timestamps, initial idle theo 60-second policy và ended_at NULL.
Rotation dùng row mới, không rebind existing row.

Database/schema enforcement:

- Row BEFORE UPDATE trigger áp dụng mọi UPDATE, không chỉ UPDATE OF two
  columns. Null-safe OLD/NEW IS DISTINCT FROM trên tất cả immutable fields
  (gồm id): có thay đổi -> reject statement.
- Idle deadline chỉ giữ nguyên hoặc tiến lên, không NULL/lùi/vượt absolute.
  Extension chỉ khi OLD.ended_at NULL và OLD còn trong idle/absolute lifetime
  tại DB check; expired continuation không được touch để revive.
- OLD.ended_at non-NULL: chỉ exact row no-op được phép. Không đổi idle,
  ended_at, hoặc chuyển ended_at về NULL; không trở lại usable.
- First end: NULL -> server-owned timestamp. BEFORE UPDATE trigger lấy DB
  clock và assign ended_at, không giữ timestamp caller chọn. First-end
  statement không được đồng thời extend idle. Repeated own-end giữ nguyên
  original ended_at; repository đọc/return idempotent result, không rewrite.
- CHECK/FK/unique enforce shape; trigger enforce OLD-to-NEW transitions.
  Không chỉ dựa vào service convention; không thêm generic session capability.

Runtime writer là non-owner/non-superuser role: SELECT/INSERT cần thiết và
column-level UPDATE CHỈ (`idle_expires_at`, `ended_at`), không table-wide
UPDATE/ALL, immutable-column UPDATE, DDL/trigger-disable/DELETE/TRUNCATE,
owner-role membership hoặc SET ROLE bypass. Kiểm tra effective privileges
gồm PUBLIC, inherited roles và default grants; column restriction không có
tác dụng nếu vẫn tồn tại table-wide grant. Nếu không chứng minh được boundary,
synthetic runtime composition fail closed, không dùng migration-owner fallback.
Không provision hoặc claim production-role readiness trong revision này.
D4a/D4b bổ sung chỉ dedicated lock-function EXECUTE, không source-row UPDATE
cho runtime. Continuation/raw/receipt triggers vẫn SECURITY INVOKER; mọi
application data reads/writes, continuation lock/touch/end, raw+receipt inserts
và final authorization checks chạy invoker sau delegated locks. Existing
foundation/Personnel writers không chuyển owner hoặc đổi grant theo revision.

Repository chỉ expose scoped touch-idle và own-end, không generic
updateContinuation/partial-row patch/upsert. Predicate luôn full trusted
org+est+dossier+continuation key; giữ dossier/continuation lock order D4.
Touch chỉ sau exact authorized foreground state/mutation/replay, compute bằng
DB time theo 60-second policy, capped absolute và không decrease; không nhận
deadline/binding từ browser. Own-end idempotent không credential revoke.
DB column privileges không thay exact service operation/lifecycle authorization.

Future disposable tests: actual runtime-role denial cho từng immutable field;
trigger rejection bằng controlled test writer không disable trigger;
backward/over-absolute idle, ended extension/revival, expired touch, repeated
end và concurrent touch/end. Test setup/teardown không nới runtime role.
[PostgreSQL column grants](https://www.postgresql.org/docs/current/sql-grant.html)
và [OLD/NEW triggers](https://www.postgresql.org/docs/current/plpgsql-trigger.html)
hỗ trợ enforcement đã chọn; tests chưa chạy và không production proof.

Hash collision khi issuing continuation -> regenerate tối đa 3 lần, failure
generic unavailable, không return token trước commit. Event UUID collision
rollback entire command; same request retry vẫn safe. Receipt unique conflict
được đọc lại dưới same dossier lock hoặc rollback/retry, không swallow partial
transaction. Không persist one-time PIN hoặc re-show existing secret.

Future database immutability proof phải chứng minh ordinary application writer không có DDL/table
ownership/TRUNCATE bypass privileges. Disposable migration/test owner tách khỏi
test runtime writer; runtime only SELECT/INSERT cần thiết + column-level
UPDATE continuation idle_expires_at/ended_at theo enforcement ở trên,
không generic table UPDATE hoặc ALTER/DROP/DISABLE TRIGGER/DELETE raw/receipt. Current production role
privileges chưa được verify, không claim hardened deployment. Privileged DBA
tampering nằm ngoài app threat boundary và phải có operations control; trigger
không thể chống superuser. Không provision production role trong change.

[PostgreSQL constraint/trigger mechanics](https://www.postgresql.org/docs/current/sql-createtrigger.html)
là reference cho deferred checking và immutable-event rejection; actual
migration proof phải kiểm thử both raw-only và receipt-only attempted commits.

Alternative: receipt JSON độc lập dễ drift; event-only JSON response lost không
có durable request association; asynchronous receipt tạo forbidden ambiguous state.

### D7 — Time và deterministic reconstruction

Authoritative clock abstraction trả UTC instant dạng integer epoch microseconds

- RFC3339 six fractional digits. Production-independent default của cloud
  repository lấy PostgreSQL clock_timestamp() dưới transaction locks, không
  transaction-start now() hoặc browser Date. Acceptance boundary là DB append
  statement sau current checks, không HTTP arrival hoặc response/commit time.

Raw timestamp dùng full PostgreSQL microseconds; postgres-js Date mapping không
được truncate xuống milliseconds: select/serialize accepted_at bằng explicit UTC
text/epoch-microsecond representation; pure reducer dùng bigint/string. Browser
Date chỉ presentation, không round raw instant hoặc reserialize nó vào mutation.
Cùng microsecond vẫn order bằng ordinal; nếu clock lùi so với last event, deny
unavailable, không tạo negative/overlapping interval, không adjust raw time.

DB tính event business_date và offset_seconds từ accepted_at AT TIME ZONE
validated current establishment timezone. Giữ timezone name + numeric offset +
date trên từng event: historical wall time = UTC instant + stored offset,
không phụ thuộc future tzdb/current establishment zone. DST repeated time có
distinct absolute instant/offset; skipped local time không cần user input
resolution vì input là absolute server instant. Establishment timezone đổi
không rewrite events; new event dùng locked current zone. Session grouping giữ
CLOCK_IN.business_date, kể cả CLOCK_OUT calendar/zone khác.

Trigger lấy đúng một acceptance sample qua server-owned DB clock function
mặc định clock_timestamp, assign NEW.accepted_at và derive calendar từ sample
đó. Trigger kiểm tra lại Personnel entry/departure tại NEW.business_date dưới
các locks đang giữ. Service precheck chỉ preliminary. Repository lấy chính
INSERT RETURNING accepted_at để kiểm tra final continuation absolute/idle
deadlines trước insert receipt/commit; nếu sample >= deadline thì rollback
toàn bộ raw insert. Không gọi clock function lần hai như thể cùng sample,
không return receipt/token trước commit. Credential/version/ended state và scope
vẫn được khóa trong toàn bộ boundary. Vì vậy date và authorization deadlines
cùng dùng một accepted instant, kể cả qua midnight. Không request GUC/body/
header clock override.
Pure tests inject clock; midnight/DST SQL integration dùng replacement clock
function chỉ trong separately verified disposable test database/harness, không
test override branch ở runtime/production composition. Migration proof cuối
cùng chạy lại real clock implementation. Không thêm clock/synthetic field.

Reconstruction (full scoped chain ORDER BY ordinal):

- expected ordinal starts 1, open = null, closed = [] transient.
- IN khi open null -> hold opening raw event.
- OUT khi open exists -> emit derived pair(open, out); open = null.
- Preserve independent instants/offsets; groupedBusinessDate từ opening event.
- Cuối chain còn IN -> open session; không auto-close.
- Reject gap/duplicate ordinal, unknown kind, OUT-first, double IN/OUT, decreasing
  instant, invalid calendar/offset/scope hoặc broken receipt linkage as
  EVIDENCE_INCONSISTENT; no fabricated/repair events. Public generic unavailable,
  privileged diagnostic only minimized reason + safe correlation, không payload.
- Không đọc security audit/receipt như source để reconstruct attendance.

Employee state/read/mutation đều validate chain; manager bounded read không
return partial misleading success nếu related dossier corrupt. Full scans là
correctness-first synthetic implementation; không daily quota/truncation. Nếu
scale cần projection/index redesign beyond this design, đo evidence và review
riêng, không quietly thêm materialized session.

[PostgreSQL time functions](https://www.postgresql.org/docs/current/functions-datetime.html)
phân biệt wall-clock observation với transaction-start clock; timezone snapshots
và reconstruction ở trên là quyết định riêng của change.

### D8 — Employee transport/contracts, CSRF và recovery

`@yuta/contracts` owns strict Zod DTOs; unknown fields
rejected. Body <= 4 KiB, JSON Content-Type only; no cookies used/required for
employee auth, fetch credentials: omit. All personal endpoints POST, không
GET query-secret mutation. Same-origin only, no CORS allow-origin wildcard.
Require Origin exact configured approved test origin; Sec-Fetch-Site cross-site
deny when present; JSON + custom Authorization header prevents ambient form
CSRF, browser preflight không được grant cross-origin. Không dùng forwarded Host
để quyết định origin. Missing Origin on these browser endpoints -> deny.
TLS required outside explicit loopback test, nhưng production vẫn disabled.

Authorization: `Pointage <ptc1_secret>` chỉ trong live memory fetch header,
không cloud Bearer/session aliases. Strict token length/prefix before digest.
Establishment context endpoint là unprivileged locator result, không authority.

| Proposed route suffix under /api/pointage/[establishmentSlug] | Request                                                 | Response / boundary                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| context (GET)                                                 | no identity input                                       | { available: true } hoặc generic unavailable; không tenant IDs/dossier list.                    |
| identify (POST)                                               | { credential: exact eight-digit string }                | { continuation, expiresInMs, idleInMs, state }; token only once after commit; state follows D9. |
| state (POST)                                                  | empty JSON + continuation                               | { state, expiresInMs, idleInMs }; current eligibility và exact state.read.                      |
| clock-in (POST)                                               | { requestId UUIDv4, observedStateGuard } + continuation | committed receipt hoặc scoped conflict/unavailable; operation.create.                           |
| clock-out (POST)                                              | same shape + continuation                               | same boundary; requested kind do endpoint quy định.                                             |
| recover (POST)                                                | { requestId, kind, observedStateGuard } + continuation  | original committed receipt hoặc { result: 'UNCONFIRMED' }; no mutation và không history list.   |
| end (POST)                                                    | empty JSON + continuation                               | 204 after idempotent own-continuation termination; no protected response.                       |

Recover current authority là operation.create (receipt của exact mutation),
không bypass current lifecycle vì endpoint read-only. UNCONFIRMED không hứa
server không in-flight; chỉ retry exact original tuple. Sau conflict, user phải
fetch fresh state, explicit choose new action và requestId mới; không rewrite
intent dưới old ID. End/refresh/expired interaction không restore pending tuple
hoặc auto-replay. API có thể recover khi caller vẫn có exact tuple và new valid
own continuation; không exposed receipt search/history.

| Public outcome                                       | HTTP / public code                                 | Internal distinction                                                                               |
| ---------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Credential/continuation/eligibility/authority denied | 403 POINTAGE_ACCESS_DENIED, identical shape/copy   | internal reason only; không disclose former/upcoming/match.                                        |
| Candidate/client rate limit                          | 429 POINTAGE_TRY_LATER                             | không expose which key, count hoặc matching dossier; same code applies to unsuccessful candidates. |
| Authorized stale head / invalid transition           | 409 POINTAGE_STATE_CONFLICT                        | no raw event; no foreign data.                                                                     |
| Same scoped request ID different intent              | 409 POINTAGE_REQUEST_CONFLICT                      | no new raw event; retain original.                                                                 |
| Malformed non-secret DTO                             | 400 POINTAGE_REQUEST_INVALID                       | generic, không validation echo containing secrets.                                                 |
| Scope/provenance/DB/chain unavailable                | 503 POINTAGE_UNAVAILABLE                           | no partial identity/context/data.                                                                  |
| Client timeout/network loss                          | local RESULT_UNKNOWN, not fabricated HTTP response | retry/recover exact tuple; no success or new ID.                                                   |

Non-enumeration giữ foundation real/dummy verification + rate logic. Error
classification không expose internal lifecycle field, credential ID/version,
raw DB rows hoặc grant claims. Count-based rate response không xác nhận candidate
validity. Identify lost response: token unavailable to browser, expires server-side;
user re-enters credential; không attendance side effect.

Alternative: Server Actions ambient cookies và HTTP redirect login không phù
hợp dedicated no-cookie employee boundary; explicit route handlers rõ retry,
cache và failure contract. Không thêm new application/service.

### D9 — Employee view và manager server read

Employee response state:
{ displayName, status: NOT_CLOCKED_IN | CLOCKED_IN,
openSessionStart: null | { instant, timezoneName, utcOffsetSeconds, businessDate },
stateGuard }.
stateGuard là opaque precondition, không historical display hoặc trusted context.
NOT_CLOCKED_IN không prior OUT. CLOCKED_IN chỉ opening timestamp của current
open session. Receipt riêng D6 không daily total/closed history; no broader name
projection. Lifecycle deny không trả state/name.

Manager chỉ server function nhận validated current cloud session +
fresh tenant context và exact pointage.establishment.read. OWNER/MANAGER active
matching membership, no STAFF/employee continuation. Không manager transport/UI.
Read transaction REPEATABLE READ read-only cho consistent snapshot. Sau khi
materialize bounded result nhưng trước response, chạy lại current server
session/membership/scope/exact-grant guard trong fresh transaction ngoài snapshot
đó; không reuse stale context hoặc gọi lại query trong cùng repeatable snapshot
rồi gọi đó là fresh check. Deny và discard result nếu guard fail/unavailable.
Snapshot data không cấp authority; final fresh guard là read authorization
boundary. Không hứa authority còn tồn tại sau response nếu bị revoke sau đó.
Server now defines today trong current establishment zone; include raw events
có stored business_date = today, cùng current open session của scoped dossiers
dù opening date trước today. Event-local historical context giữ nguyên; timezone
change không reclassify old events. Không closed history ngoài today hoặc
monthly/payroll/correction/audit visibility.

Manager open session derived bằng scoped raw chain, không chỉ today filter
(tránh mất IN từ hôm trước). Return projected event kind/instant/calendar + scoped
dossier reference, current opening reference/time; không credential/security
audit hoặc unrelated Personnel columns. Historical former dossier events/open
session vẫn read theo manager grant, không áp employee self-eligibility lên
manager visibility. No arbitrary daily event quota; timeout -> unavailable,
không silent truncated success.

### D10 — Cache, privacy, logs và leakage defense

Employee page HTML/RSC chứa neutral entry shell only. force-dynamic, revalidate
0, no cached personal fetch/unstable_cache, all page/data responses private,
no-store, max-age=0; Pragma no-cache, Expires 0. No CDN caching/s-maxage,
no service worker/offline store. No personal data in URLs, query, path segments
beyond public establishment slug, history.state, router params, telemetry,
analytics hoặc server component serialized props.

Route-scoped CSP/headers trên /pointage và /api/pointage (existing Backoffice
Next boundary, không global shell change): per-request nonce for Next scripts,
script-src self + nonce; object-src none, base-uri none, frame-ancestors none,
form-action self, connect-src self; Referrer-Policy no-referrer,
X-Content-Type-Options nosniff. Development HMR only needs explicitly
loopback dev connection allowances, không production unsafe-eval policy.
No third-party analytics/scripts trên surface.

D3 synchronous neutral cover/DOM wipe trước pagehide snapshot, pageshow
generation reset và late-response rejection bắt buộc; Cache-Control không
được coi là bfcache/OS erasure guarantee.
[Cache-Control semantics](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
hỗ trợ HTTP no-store boundary; lifecycle clearing phải được Browser QA riêng.

No logging request body, Authorization header, continuation/PIN/digests,
stateGuard, fingerprint, Personnel name, receipt payload hoặc raw event rows.
Use bounded safe error code/correlation ID cho diagnostics; không query/stack
tracing with secrets. Existing foundation audit taxonomy giữ nguyên cho credential/
authorization; không thêm security-audit read UI, retention hoặc legal schema.
Raw event/receipt success là canonical/technical pair, không nhân đôi attendance
vào security audit. Failed audit required by existing auth fails closed; raw
commit không bị báo failed chỉ vì later optional diagnostics sink failure.

No cache warming/prefetch protected state, no credentials in devtool screenshots.
Future QA screenshots only synthetic names, never plaintext PIN or continuation.

### D11 — UI planning boundary and state model

NEW_PAGE, integrated target, NEW_CAPABILITY_DISCOVERY. Stable planning home:
`docs/ui/pages/backoffice-pointage-employee/`. Phase 0 inventory và
DESIGN_HANDOFF precede draft UI spec; shared context NO_APPLICATION_SHELL.
Existing root Geist/Inter, semantic tokens, Button/Input/FormField/Alert/Card/
Skeleton/StatusBadge từ @yuta/ui, Lucide only. Không sửa shared primitive,
sidebar/header/account/establishment selector.

Six pre-approval planning docs only: README, PRODUCT_SCOPE, DESIGN_HANDOFF,
UI_SPEC, DATA_AND_INTERACTION_SPEC, ACCEPTANCE_CHECKLIST. Không generate final
pack vì generator tạo forbidden IMPLEMENTATION_PLAN và implementation prompts.
Current validator mechanically requires những files đó even design; report
specific missing-file/prompt/reference findings, không claim implementation-ready.
Không tạo empty fake plan/provenance hoặc sửa workflow validator.

UI copy French. Text state/action/copy, responsive hierarchy và keyboard/touch
criteria nằm trong draft UI_SPEC; không manager UI. No image reference required
cho written state-driven design; no-image decision vẫn thuộc human design review.
Baseline NOT_APPLICABLE vì employee route chưa tồn tại, không fake screenshots.

### D12 — P13/P14, readiness and failure boundaries

P13/P14 là current change implementation/testing/readiness authority, không
permanent domain rule. Synthetic/disposable attendance ONLY cho implementation,
integration và Browser QA; real attendance NOT_AUTHORIZED ở development,
staging, production. No synthetic/real employee field/enum/permission/classifier.
No production provider; production enablement NOT_AUTHORIZED.

Giữ unresolved exact retention duration, deletion/anonymization, legal hold,
backup-retention interaction, employee notice, detailed audit visibility,
trusted production client-address provenance. No cleanup executor hoặc default
retention; technical TTL chỉ invalidate authentication, không xóa records.
Carry forward nguyên vẹn vào future Tasks/TIC/test data policy/QA/gates.
Runtime DB role privilege evidence cũng phải chứng minh trước immutable-evidence
deployment; current repository chưa chứng minh production role hardening.
Đây là technical readiness evidence gap, không new Product behavior/permission.

Alternative: bật generic developer mode against real cloud DB hoặc classify
employee synthetic để “cho chạy” bị loại; chỉ explicitly guarded disposable
test composition. No production environment or lifecycle promotion.

## Risks / Trade-offs

- [Opaque token trong live memory vẫn bearer] -> short TTL, no ambient cookie,
  CSP, no persistent stores, current credential/lifecycle checks; compromised
  same-origin script/device ngoài khả năng cryptographic memory isolation.
- [Offline end không thể remote-revoke ngay] -> neutral local state lập tức,
  distinguish ENDING/confirmed end, deny UI reuse, server expiry bound 60/120s;
  Browser QA phải verify không restore data và server end ordering.
- [Full raw-chain scan tốn thời gian] -> synthetic bounded evaluation, scoped
  indexes/timeouts, fail closed; không thêm projection hoặc quota khi chưa review.
- [Clock rollback / corrupt chain] -> unavailable, no clamp/repair, preserve
  evidence và minimized diagnostic; cần operational investigation riêng.
- [Mutual FK và custom trigger không đủ được schema diff tool express] ->
  generated additive migration + reviewed explicit SQL, disposable proof cả
  constraints lẫn negative writes; không claim từ TypeScript schema alone.
- [Existing dirty foundation/UI work] -> future pre-Apply fresh hashes/status,
  preserve Formalités auth index hunk; stop nếu intended overlapping hunks
  không thể isolate. Không refactor other feature để làm tests pass.
- [UI pack checker đòi forbidden planning artifacts] -> retain honest partial
  pre-approval design, không đổi lifecycle/tooling hoặc tạo plan sớm.

## Migration Plan

Đây là migration design, không execution authorization.

Sau Sensitive Design và Tasks/Apply approval: generate additive Drizzle migration
bằng current @yuta/db-cloud db:generate; allocate next journal sequence từ live
repo, không assume số 0020 hoặc sửa 0019 đã có. Migration tạo ba tables,
constraints/indexes/functions/triggers và credential composite unique support.
Custom FK/trigger SQL nằm trong cùng new journaled migration với reviewed
generated snapshot; không hand-author journal để bypass generator.
Không seed/backfill raw events, sessions, credentials hoặc Personnel.

D4a helper definition/ACL/owner transfer thuộc chính new generated/journaled
migration, không standalone unjournaled SQL. Không sửa 0019/0020 hoặc prior
snapshots/entries; next name/sequence vẫn để generator resolve sau fresh review.
Không tạo SQL/migration, roles hay database trong Design revision này.
Future guarded disposable harness provision exact lock-owner/writer roles
D4b trước migration, chỉ sau toàn bộ D1 guards; role name đã tồn tại với
unexpected attributes/grants/membership -> STOP, không ALTER unrelated role.
Role provisioning là isolated test-cluster setup, không production migration
default hoặc seed. Migration requires roles tồn tại đúng policy; thiếu -> fail.

Riêng role D1a `yuta_pointage_foundation_runtime` thuộc future task 2.8 guarded
synthetic harness, sau D1 identity proof, không thuộc migration 0021 và không
thay bằng bootstrap runtime. Chỉ provision exact role/column grants D1a trên
cùng raw target sau explicit Apply approval; existing unexpected role/ACL ->
STOP, không repair unrelated role. Giữ nguyên 1.1-1.8/C17 evidence và 0021 bytes;
proof role/client mới phải bổ sung ở 2.8, không suy ra từ completed Foundation.

Migration identity giữ ownership tables/schema/triggers; helper ownership
chuyển sang dedicated NOLOGIN role, không migration-owner SECURITY DEFINER.
Nếu PostgreSQL ownership transfer cần CREATE schema hoặc role membership ở
migration identity/lock owner trong setup, chỉ temporary migration transaction,
revoke trước commit và trước runtime proof; runtime không bao giờ nhận chúng.
Không cấp CREATE/role membership cho writer để generator/migration chạy.
Apply kiểm tra Drizzle transaction boundary thực sự bao trọn create/revoke/
owner/grant; nếu không đảm bảo atomic publication -> STOP trước execution.
Empty và upgrade DB phải có cùng reviewed function body/ACL/owner; rerun no-op.
Rollback disable synthetic composition, giữ rows/history; không DROP data hoặc
rollback destructive để tránh review. Existing future production-role
provisioning vẫn cần separate authority, không được suy ra từ test roles.

Disposable DB proof: exact loopback host/current_database name kiểm tra trước
migrate; new isolated test role/database, không production/general dev data.
Apply full existing journal + new migration trên empty DB, và upgrade test
baseline có synthetic foundation rows. Chạy writer-role concurrent tests,
mutual orphan-FK commit failures, raw UPDATE/DELETE/TRUNCATE denial, same-ID
retry, allowed reads/INSERT, reset/Personnel races; inspect pg_constraint/
pg_trigger và actual migration journal. Rollback-transaction không để raw hoặc
receipt residue. Test-only clock substitutions giới hạn disposable harness;
restore actual clock implementation và validate lại migration result.

Rollback runtime: disable test factory/route before changing application code;
older foundation build bỏ qua additive tables. Giữ raw/receipt/auth metadata
không destructive down migration; no automatic DROP/purge để rollback.
Unknown commit -> exact recover/retry, không rollback committed event.
Deployment/production migration, runtime role provisioning, retention cleanup
hoặc data conversion không được authorize bởi Design hoặc tests.

## Verification Design

Chưa chạy implementation tests/Browser QA. Đây là traceability và future
verification design, không Tasks/Implementation Plan/Technical Implementation
Contract hoặc VERIFY PASS.

| Requirement | Exact approved heading                                                         | Design sections  | Future test family              |
| ----------- | ------------------------------------------------------------------------------ | ---------------- | ------------------------------- |
| A1          | Usable consumer dùng dedicated short-lived Pointage continuation               | D2, D3, D4, D8   | continuation-auth               |
| A2          | Continuation chỉ self-only trong trusted binding và closed catalog             | D1, D2, D4, D8   | scope-and-grants                |
| A3          | Current Personnel eligibility áp dụng cho cả ba employee operations            | D4, D5, D7       | personnel-eligibility           |
| A4          | Committed replay không bypass current authorization                            | D4, D5, D6       | authorized-replay               |
| A5          | Expiry reset và interaction end không để lại stale authority                   | D2, D3, D4       | expiry-reset-end                |
| A6          | Continuation không serialize trusted context hoặc persist plaintext credential | D2, D6, D8, D10  | secret-and-context-minimization |
| A7          | Usable consumer giữ non-enumeration và trusted-address prerequisite            | D1, D8, D10      | trusted-provenance              |
| R1          | Raw clocking sử dụng trusted cloud scope và online acceptance                  | D1, D4, D8       | cloud-and-scope                 |
| R2          | Raw command vocabulary và bốn transition outcomes là đóng                      | D5, D7           | four-transitions                |
| R3          | Raw evidence immutable là sole canonical attendance source                     | D5, D6, D7       | immutable-canonical-source      |
| R4          | Sessions và current state chỉ derived và không overlap                         | D5, D7           | derived-sessions                |
| R5          | Stable request identity bảo toàn committed receipt và replay                   | D4, D5, D6, D8   | idempotent-retry                |
| R6          | Concurrent competing requests có tối đa một acceptance                         | D5, D6           | multi-connection-concurrency    |
| R7          | Accepted event time do server quyết định và giữ historical context             | D5, D7           | server-time                     |
| R8          | Cross-midnight grouping không thay departure eligibility                       | D4, D7           | midnight-departure              |
| R9          | Employee chỉ thấy own minimal current state và receipt                         | D4, D7, D9       | employee-projection             |
| R10         | Manager read chỉ server-side và establishment-scoped                           | D9               | manager-scope                   |
| R11         | Shared-device UI bảo toàn isolation và trung thực về operation state           | D3, D8, D10, D11 | shared-device-browser           |
| R12         | Capability giữ fail-closed provenance và tách biệt production policy           | D1, D10, D12     | authority-separation            |
| R13         | Usable slice không mở rộng explicit non-scope                                  | D1, D12          | negative-scope-inventory        |

Tất cả 62 approved scenarios được map bên dưới. Mỗi row yêu cầu test assert
đúng WHEN/THEN/AND của source scenario; reference không thay scenario semantics.

| Scenario | Exact approved scenario heading                          | Design sections  | Future test family              |
| -------- | -------------------------------------------------------- | ---------------- | ------------------------------- |
| A1.1     | Tiếp tục own Pointage interaction                        | D2, D3, D4, D8   | continuation-auth               |
| A1.2     | Pointage continuation dùng ngoài domain                  | D2, D3, D4, D8   | continuation-auth               |
| A2.1     | Continuation được dùng cho employee khác                 | D1, D2, D4, D8   | scope-and-grants                |
| A2.2     | Continuation yêu cầu privileged operation                | D1, D2, D4, D8   | scope-and-grants                |
| A2.3     | Browser cung cấp trusted-context claims                  | D1, D2, D4, D8   | scope-and-grants                |
| A3.1     | Identify trước entry hoặc sau departure                  | D4, D5, D7       | personnel-eligibility           |
| A3.2     | State read ngoài employment period                       | D4, D5, D7       | personnel-eligibility           |
| A3.3     | Mutation sau departure với session đang mở               | D4, D5, D7       | personnel-eligibility           |
| A3.4     | Ngày entry hoặc final departure hợp lệ                   | D4, D5, D7       | personnel-eligibility           |
| A3.5     | Không xác minh được lifecycle hiện tại                   | D4, D5, D7       | personnel-eligibility           |
| A4.1     | Authorized replay                                        | D4, D5, D6       | authorized-replay               |
| A4.2     | Prior success nhưng current access mất hiệu lực          | D4, D5, D6       | authorized-replay               |
| A5.1     | Continuation hết hạn                                     | D2, D3, D4       | expiry-reset-end                |
| A5.2     | Credential reset nhưng browser còn continuation cũ       | D2, D3, D4       | expiry-reset-end                |
| A5.3     | Interaction đã kết thúc trên shared device               | D2, D3, D4       | expiry-reset-end                |
| A6.1     | Browser nhận continuation và current-state response      | D2, D6, D8, D10  | secret-and-context-minimization |
| A6.2     | Durable browser storage hoặc diagnostics                 | D2, D6, D8, D10  | secret-and-context-minimization |
| A6.3     | Technical metadata được tái dùng làm evidence            | D2, D6, D8, D10  | secret-and-context-minimization |
| A7.1     | Missing hoặc untrusted client-address provider           | D1, D8, D10      | trusted-provenance              |
| A7.2     | Public access failure                                    | D1, D8, D10      | trusted-provenance              |
| A7.3     | Provider composition cần authority riêng                 | D1, D8, D10      | trusted-provenance              |
| R1.1     | Employee operation có đầy đủ prerequisites               | D1, D4, D8       | cloud-and-scope                 |
| R1.2     | Browser đổi scope hoặc dossier                           | D1, D4, D8       | cloud-and-scope                 |
| R1.3     | Cloud hoặc database không xác nhận được kết quả          | D1, D4, D8       | cloud-and-scope                 |
| R2.1     | NO_OPEN_SESSION nhận CLOCK_IN                            | D5, D7           | four-transitions                |
| R2.2     | OPEN_SESSION nhận CLOCK_OUT                              | D5, D7           | four-transitions                |
| R2.3     | OPEN_SESSION nhận CLOCK_IN                               | D5, D7           | four-transitions                |
| R2.4     | NO_OPEN_SESSION nhận CLOCK_OUT                           | D5, D7           | four-transitions                |
| R2.5     | Caller gửi event kind ngoài vocabulary                   | D5, D7           | four-transitions                |
| R3.1     | Derived state được tái dựng                              | D5, D6, D7       | immutable-canonical-source      |
| R3.2     | Actor yêu cầu sửa hoặc xóa raw event                     | D5, D6, D7       | immutable-canonical-source      |
| R3.3     | Technical metadata được dùng làm attendance fact         | D5, D6, D7       | immutable-canonical-source      |
| R4.1     | Employee tạo nhiều sequential sessions                   | D5, D7           | derived-sessions                |
| R4.2     | Session thiếu clock-out                                  | D5, D7           | derived-sessions                |
| R5.1     | Cùng identity và intent sau commit                       | D4, D5, D6, D8   | idempotent-retry                |
| R5.2     | Cùng identity nhưng intent khác                          | D4, D5, D6, D8   | idempotent-retry                |
| R5.3     | Receipt lookup từ employee hoặc establishment khác       | D4, D5, D6, D8   | idempotent-retry                |
| R5.4     | Timeout retry                                            | D4, D5, D6, D8   | idempotent-retry                |
| R5.5     | Replay sau khi lifecycle hoặc authority không còn hợp lệ | D4, D5, D6, D8   | idempotent-retry                |
| R6.1     | Hai distinct CLOCK_IN cạnh tranh từ no-open state        | D5, D6           | multi-connection-concurrency    |
| R6.2     | Hai distinct CLOCK_OUT cạnh tranh đóng cùng session      | D5, D6           | multi-connection-concurrency    |
| R6.3     | Double submit cùng request identity                      | D5, D6           | multi-connection-concurrency    |
| R7.1     | Browser gửi clock hoặc backdated timestamp khác server   | D5, D7           | server-time                     |
| R7.2     | Actual time lệch Planning                                | D5, D7           | server-time                     |
| R7.3     | Local date/time cần được diễn giải lại                   | D5, D7           | server-time                     |
| R8.1     | Session đi qua midnight trong employment period          | D4, D7           | midnight-departure              |
| R8.2     | CLOCK_OUT sau departure date                             | D4, D7           | midnight-departure              |
| R9.1     | Employee chưa clock-in                                   | D4, D7, D9       | employee-projection             |
| R9.2     | Employee đang clock-in                                   | D4, D7, D9       | employee-projection             |
| R9.3     | Minimal Personnel projection                             | D4, D7, D9       | employee-projection             |
| R9.4     | Employee yêu cầu lịch sử                                 | D4, D7, D9       | employee-projection             |
| R10.1    | Authorized manager đọc bounded state                     | D9               | manager-scope                   |
| R10.2    | Manager thiếu scope hoặc exact grant                     | D9               | manager-scope                   |
| R10.3    | STAFF hoặc employee xin manager read                     | D9               | manager-scope                   |
| R11.1    | Interaction kết thúc trên shared tablet                  | D3, D8, D10, D11 | shared-device-browser           |
| R11.2    | Browser khôi phục state cũ                               | D3, D8, D10, D11 | shared-device-browser           |
| R11.3    | Mutation pending, success hoặc conflict                  | D3, D8, D10, D11 | shared-device-browser           |
| R11.4    | Invalid credential, rate limit hoặc lifecycle denial     | D3, D8, D10, D11 | shared-device-browser           |
| R12.1    | Thiếu trusted client-address provenance                  | D1, D10, D12     | authority-separation            |
| R12.2    | Production legal policy chưa được duyệt                  | D1, D10, D12     | authority-separation            |
| R12.3    | Capability được triển khai và kiểm tra thành công        | D1, D10, D12     | authority-separation            |
| R13.1    | Downstream hoặc ngoài phạm vi yêu cầu capability         | D1, D12          | negative-scope-inventory        |

Critical additional technical proofs: same-ID multi-connection commit; distinct
IN/OUT contention; stale OUT across A-close/B-open; reset and lifecycle racing
same dossier lock; direct raw-only/receipt-only transactions cannot commit;
writer cannot destructive mutate; server microseconds/offset/DST and zone-change
stable history; expired/end/replayed token deny; old-response generation dropped;
pagehide/pageshow/back/duplicate/restart/cache isolation; absent/untrusted provider
fails before credential processing; runtime refuses unsafe test environment.

#### Reopened locking/privilege proof — planned, not executed

D1 exact environment/URL/current_database guards không thay. Dedicated
disposable PostgreSQL, distinct owner/writer connections; không mock thay SQL.
Các assertions dưới đây bổ sung F8/S5 proof, chưa đánh dấu task hoàn thành:

1. Catalog/effective ACL proof D4b; actual writer SELECT FOR SHARE/UPDATE trực
   tiếp cả ba source tables bị 42501, nhưng exact helper + invoker continuation
   FOR UPDATE thành công. Helper RETURN void không row/name/lifecycle data.
2. Actual writer UPDATE mỗi column (gồm id, org/est keys, entry/departure,
   status/timezone), INSERT/DELETE/TRUNCATE/ALTER/DROP/GRANT/trigger-disable trên
   source tables bị deny; compare complete source rows before/after helper.
   Continuation chỉ hai UPDATE cột được phép; all existing F5 negatives giữ.
3. Wrong/NULL/mixed org-est-dossier tuple, missing/inactive parents -> generic
   failure and outer rollback. Không partial token/state/event/receipt. Through
   service, coherent foreign tuple bị deny trước helper; không claim SQL
   helper tự xác thực tenant khi DB login đã compromise.
4. Non-writer role không EXECUTE; PUBLIC revoke verified. Writer không SET ROLE/
   SESSION AUTHORIZATION owner/migration role, ALTER function, create overload/
   shadow object, grant EXECUTE hoặc disable trigger. Poisoned caller
   search_path/temp lookalike không đổi referenced public tables; helper fixed
   pg_catalog/pg_temp và qualification được kiểm tra bằng object identities.
5. Controlled disposable misconfiguration tests: wrong/LOGIN/superuser owner,
   owner extra column/table privilege or membership, writer inherited/PUBLIC
   UPDATE, PUBLIC EXECUTE, missing EXECUTE, writable schema, changed body/
   search_path. Runtime refuses before provider/credential processing/write;
   no fallback. Restore exact reviewed setup before final proof.
6. Multi-connection blocking both directions: helper holds locks after return
   until outer commit/rollback; actual issue/reset repository waits on dossier;
   actual Personnel entry/departure UPDATE waits (and vice versa). Later
   Pointage reads current version/lifecycle after lock. Parent status/timezone
   UPDATE and existing Formalités scoped dossier lock conflict as expected.
   Không sửa/import unrelated Formalités test harness hoặc code để pass.
7. Invoker raw INSERT trigger calls helper even without prior repository lock;
   concurrent alternate inserts serialize; invalid chain/raw-only/receipt-only
   commit still fail. Continuation/end/touch ordering, same-ID replay,
   competing IN/OUT, stale OUT across A/B và accepted-instant departure remain
   original D2-D7 tests, not replaced by helper-success test.
8. Force lock_timeout/statement_timeout/deadlock: rollback all work, same tuple
   recovery/no fresh identity; no catch-and-continue savepoint releasing locks.
   Test migration absent/misowned helper and roles fail closed, no-op rerun,
   old history unchanged; all controlled test changes restored and actual DB
   clock rerun before migration proof.

Cần corresponding Tasks/TIC planning correction sau revised Design approval:
task 1.3 delegated lock call, 1.4 raw-trigger helper call, 1.5 F8 role/ACL proof,
1.6 guarded role setup, 1.7 atomic helper publication, 1.8 và S5/R regression
evidence. Không đổi task count, checkbox, code hoặc UI plan trong lượt này;
2/32 checkpoint giữ nguyên và Apply PAUSED đến explicit approval của Design
và required planning correction. Không coi original 02c approval đủ cho
delegated mechanism chưa được review.

Future exact existing command families:
`pnpm --filter @yuta/auth test`,
`pnpm --filter @yuta/contracts test`,
`pnpm --filter @yuta/db-cloud test`,
`pnpm --filter @yuta/backoffice test`,
`pnpm test:cloud`, `pnpm build:cloud`,
`pnpm docs:check`, `pnpm architecture:check`,
`pnpm -r --if-present typecheck`, scoped Prettier.
Integration enable flag `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true` chỉ sau
disposable guards, không dùng existing general .env.local target.

Browser QA sau formal VERIFY theo YUTA_QA_PROTOCOL: 1440x900, 1024x768,
768x1024 shared tablet và 390x844; all approved visible states, French copy,
keyboard/focus/touch/overflow, pending/unknown result và end/cache races.
Real Next local route + migrated synthetic DB, not fixture-success UI.
Hashed screenshot manifest, QA report và console checks; no plaintext secrets
trong evidence. Không QA NOT_APPLICABLE cho UI_AFFECTING YES.

## Open Questions

Không có unresolved Product/authority conflict được phát hiện cần đổi approved
Specs. Technical representation, TTL, transaction/receipt, schema, clocks,
transport, reset/end và UI-state choices đã được chọn để human Sensitive Design
review; không tự coi review là passed.

Các legal/privacy/production provenance và production DB-role evidence ở D12
vẫn blocked, không đủ điều kiện dùng real attendance. Partial UI-pack structural
validation chưa hoàn chỉnh vì current-user cấm Implementation Plan trước gate;
không phải permission vượt gate. Reviewer cần đánh giá rõ offline ENDING versus
confirmed end semantics và no-image UI direction cùng design này.

SENSITIVE DESIGN GATE
Review status: AWAITING_HUMAN_REVIEW
UI_AFFECTING: YES
BROWSER_QA_REQUIRED: YES
Apply authorization: NOT_GRANTED
Production enablement: NOT_AUTHORIZED
