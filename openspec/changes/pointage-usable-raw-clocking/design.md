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

#### D1b — Actual Next process bootstrap (task 3.2 alignment proposal)

Đây là bounded Sensitive Design / Tasks alignment tại checkpoint 18/32,
task 3.2 PARTIAL (18/32); checkpoint đã có 15 protected implementation paths.
Chỉ planning được sửa; Apply PAUSED đến human approval
exact revised Design/Tasks hashes và exact implementation allowlist trong
Tasks. D1/D1a, D4a/D4b, F6/F8, S9, U1, Product, hai Specs, migration 0021,
sealed UI pack và bảy blockers giữ nguyên. Các checkpoint trước trong Design
là historical review context, không reset completed tasks hoặc UI-pack status.

##### Repository evidence and alternatives

Inspected baseline: Backoffice declares Next ^16.2.9, installed 16.2.9;
Node v24.17.0. Existing scripts: dev = next dev -p 3001, start = next start
-p 3001, build = next build. next.config.ts không có bootstrap hook;
không có Pointage instrumentation/startup owner. Existing typed development
review-store global không là authority cho generic registry mới.
createCloudDatabaseClient mặc định pool không chứng minh max:1; không sửa
shared factory. Existing guarded Pointage test helper đã có independently
authenticated postgres-js max:1 + Drizzle clients và exact-target probe.
Factory raw-clocking-runtime.ts mới có injected clients, không route accessor.
Existing child-process tests chỉ là implementation pattern, không runtime proof.

Official documentation tại exact tag 16.2.9 được kiểm tra, không dùng latest:
[custom server](https://raw.githubusercontent.com/vercel/next.js/v16.2.9/docs/01-app/02-guides/custom-server.mdx)
mô tả public next/prepare/getRequestHandler và httpServer option; entry file
không qua Next compiler. Custom server có optimization/standalone trade-offs,
nên chỉ test entry, không thay production startup.
[instrumentation](https://raw.githubusercontent.com/vercel/next.js/v16.2.9/docs/01-app/03-api-reference/03-file-conventions/instrumentation.mdx)
await register trước readiness, chạy mỗi server instance và có Node/Edge
distinction; không chứng minh socket ownership/teardown cho D1.
Installed next/dist/server/next.js, next.d.ts xác nhận public API, custom
prepare/getRequestHandlers và close lifecycle. Không import Next private APIs.
Version drift phải re-review lifecycle evidence; không upgrade để làm test pass.

- A, process-local module alone: bounded cache khả thi nhưng standard CLI không
  cấp actual listener owner, cleanup hoặc cross-reload guarantee. Không chọn
  module-cache-only hay environment-driven lazy default.
- B, dedicated test launcher + in-process bootstrap: CHOSEN, kết hợp narrowly
  typed process-local promise của A. Cha chỉ chuẩn bị disposable infrastructure
  và ephemeral inputs; actual Next child tạo/prove hai clients của chính nó.
- C, instrumentation: không chọn. Hook existence không cung cấp actual socket,
  shutdown hoặc cache-reload proof; thêm shared startup path không cần thiết.
- D, plain next dev + env-only, private Next hooks hoặc proxy/sidecar: reject.
  Không actual socket proof, hoặc tăng topology/registry/secret contract.
  Không separate Pointage server, app, containerized app runtime hay new port.

##### Owner and exact launch channel

Launcher test-only khởi chạy MỘT Node child hosting existing apps/backoffice
Next app bằng public next({ dev: true, dir: absoluteBackofficePath,
hostname: '127.0.0.1', port: 3001, httpServer, quiet: true }).
Tất cả page/API vẫn do Next file-system router; không implement HTTP business
routes trong launcher, không reverse proxy hoặc second HTTP service. Chỉ
test invocation thay CLI invocation; normal dev/start/build/config không đổi.
Higher-risk process-wide effect nằm trong dedicated test child: listener
ownership và lifecycle, không shared source/config path. Không launch cùng
Backoffice khác trên port 3001; EADDRINUSE -> STOP, không auto-select port.

Parent validates existing D1/F6 guards trên target trước provisioning/migration/
fixtures; admin chỉ ở parent. Parent không gửi admin URL, open JS client,
parent SQL proof hoặc runtime object qua process boundary. Parent-generated
role passwords và encodedAuthSecret chỉ memory. Không .env write, command-line secrets,
NEXT_PUBLIC inputs, durable production config hoặc implicit .env.local fallback.

Child uses Node fork IPC, one strict INIT message <= 16 KiB, exact keys:
type = POINTAGE_TEST_INIT; version = 1; runId = UUIDv4;
parentPid / childPid = positive integers matching process.ppid / process.pid;
origin = http://127.0.0.1:3001; listenHost = 127.0.0.1; listenPort = 3001;
foundationDatabaseUrl / rawDatabaseUrl = role-specific URLs for SAME D1 tuple;
encodedAuthSecret = canonical base64url 32 random bytes (existing auth format).
Unknown keys, oversized/malformed/repeated INIT, wrong PID/channel or missing
IPC reject. No browser/control endpoint can supply INIT or choose provider.
After INIT only exact STOP { type: POINTAGE_TEST_STOP, version: 1, runId }
is accepted from this same parent channel; unexpected messages fail closed.

INIT không có stateGuardKeyBase64; nếu supplied thì reject như unknown key.
Parent chỉ gửi encodedAuthSecret, không gửi independently generated hoặc derived
stateGuard key. Trong actual Next child, strict validate/decode encodedAuthSecret
bằng existing decodePointageAuthSecret, rồi gọi existing
derivePointageStateGuardKey(decodedAuthSecret) với approved HKDF label
yuta/pointage/raw-state-guard/v1. Child pass derived key đó vào
createPointageRawClockingRuntime trong existing admission order; decode/derive
failure giữ terminal fail-closed behavior, không publish runtime. Không nhận
stateGuard key từ IPC, environment, CLI, request, browser hoặc process khác;
không thêm secret contract hay viết lại crypto primitive của F1/D5.

Planned D1b proof: reject INIT chứa stateGuardKeyBase64; inventory không có
environment/CLI/browser stateGuard-key input; actual runtime nhận đúng output
của existing derivation trên decoded auth secret; đổi auth secret phải cho
corresponding domain-separated derived key; parent không gửi derived key riêng.
Existing F1 vectors trong packages/auth/test/pointage-continuation.test.ts là
authority, không duplicate thuật toán mới. Đây là planned tests, chưa chạy.

Child environment is explicit allowlist: required Windows OS launch keys
SystemRoot, WINDIR, COMSPEC, PATH, PATHEXT, TEMP, TMP only when present;
NODE_ENV = development, YUTA_POINTAGE_SYNTHETIC_TEST_MODE = true,
POINTAGE_TEST_ORIGIN = exact origin, NEXT_TELEMETRY_DISABLED = 1.
Never inherit NODE_OPTIONS, arbitrary application secrets or NEXT_PUBLIC keys.
Parent production/VERCEL check occurs BEFORE environment sanitization; cannot
erase VERCEL to make an unsafe launch eligible. Child repeats live checks.
Private projected D1 environment uses foundationDatabaseUrl as
CLOUD_DATABASE_URL target descriptor; raw URL is separately checked against it.
Neither URL is installed in process.env or read from Next dotenv loading.
Normal CLI/build/start has no IPC owner/anchor and remains unavailable even
with flags. No production provider is constructed; deterministic synthetic
provider is fixed in server-owned child code, never derived from headers.

##### Actual listener, admission and consumer handoff

Order in actual child:

1. Validate INIT/environment/URL tuples/roles and main-thread process identity,
   before creating either client. Bind owned node:http server to exact IPv4
   127.0.0.1:3001 with generic 503 gate. Inspect server.listening and address()
   for exact address/port; derive origin from that socket tuple and compare
   exact POINTAGE_TEST_ORIGIN. Config or successful parent fetch alone is not
   listener proof. No credentials processed at this stage.
2. Prepare existing Next against that exact httpServer. Before delegating any
   request, verify socket.localAddress/localPort, live listener and process
   generation; Host/Forwarded/X-Forwarded-\* never prove provenance. Origin
   remains separate D8 CSRF check. No extra public health/bootstrap endpoint.
3. Install one non-enumerable, non-writable, non-configurable property on Node
   process keyed Symbol.for('yuta.pointage.raw-clocking.test-bootstrap.v1').
   Value is frozen, Pointage-only typed admission accessor; private closure
   owns INIT, listener, clients, state and promise. No mutable globalThis bag,
   arbitrary keys, generic get/set/register or replace-client method.
4. Server-only raw-clocking-bootstrap.ts, compiled by Next, supplies exactly
   createPointageRawClockingRuntime to that one typed accessor. The child
   DOES NOT import server-only application modules outside Next compilation
   or enable global react-server conditions. The constructor callback is
   fixed in this module, never supplied by handlers/request/browser.
5. On the first accessor call, synchronously reserve the one initialization
   promise, then create two distinct postgres-js max:1/Drizzle clients in this
   actual process, reusing guarded test-client construction. On each actual
   authenticated handle prove current_database() and session_user/current_user:
   foundation = yuta_pointage_foundation_runtime; raw = yuta_pointage_raw_writer.
   Both actual names equal the exact D1 target and independently pass the
   whole-string rule. Rerun foundation D1a effective inventory and raw D4b/F8
   body/owner/ACL/OID proof on these handles. No SET ROLE, parent proof,
   admin/C17/default DB client, ACL repair or silently replaced connection.
6. Only then instantiate fixed synthetic trusted-address provider and the
   runtime; publish READY only after complete factory admission. Factory's
   current per-operation requireReady and final raw transaction rechecks stay.
   Neutral context availability additionally runs requireReady and existing
   active-entry scope resolution, returning only { available: true } or 503;
   it adds no authorization operation, dossier projection or credential work.

Exact dependency: seven Node route.ts handlers -> raw-clocking-http.ts ->
server-only getPointageRawClockingConsumer() in raw-clocking-bootstrap.ts ->
typed process admission accessor -> existing admitted runtime.
Consumer exposes only context/identify/readState/mutate/recover/end functions,
not clients, URLs, admin/owner, provisioning, fixtures or generic DB factories.
Internal constructor types are not consumer exports. Enforce import inventory
and browser/RSC negative tests. The immutable process anchor is a narrowly
scoped in-process capability, NOT a security sandbox against hostile server
code/OS users; existing trusted-repository/host assumption remains explicit.

No anchor, failed admission, wrong environment/listener/DB/role/privilege/helper/
provider, connection failure or different worker/process -> D8 generic 503
POINTAGE_UNAVAILABLE without credential work or partial identity. Readiness
in another route never authorizes a bypass. Every accessor/dispatch checks
live generation/listener/environment; every service call retains requireReady.
A reconnect on either fixed max:1 client repeats identity/effective proof before
use; reconnect failures cannot create a replacement pair or fallback identity.

##### Concurrency, reload and failure lifetime

Generation = child PID + parent-generated runId; main thread only. State starts
INITIALIZING on the first call; all concurrent calls await the SAME promise.
No partially admitted pair is cached/published. READY holds one bounded runtime.
Initialization failure becomes terminal FAILED/UNAVAILABLE for that generation;
close any opened client, drop input references, return only generic failure.
No automatic retry, second factory invocation or in-process replacement.
Live prerequisite failure also marks FAILED and initiates teardown; ordinary
403/409/429 business outcomes do not. New admission needs a fresh child launch.

Do not rely on Next module cache/HMR semantics. Immutable owner closure remains
with actual process, while route module reload may obtain only its same typed
promise. No pool lives only in an evictable module. Source/config/dependency
change invalidates the generation: parent watches and child checks exact
launch inventory hashes before each admission/dispatch. Inventory covers
Backoffice src + test bootstrap entry files, imported auth/contracts/db-cloud/
tenant source, their manifests, Backoffice config/tsconfig and pnpm-lock.yaml;
path additions/removals also invalidate. Exclude .next generated output.
Changes -> deny new work and teardown, no hot replacement or automatic restart;
fresh manual launch recaptures and proves. A harmless module-cache reload with
unchanged inventory must reuse the same promise/pair, never duplicate pools.
Watch events alone are not proof; checksum validation is authoritative.

Actual Next process/thread/generation agreement must be demonstrated by future
real-route tests, independent re-consumer evidence E3 and process restart E5. Documentation
does not establish this application-specific result. If Next executes the
accessor in another worker/realm without the owned anchor, it is unavailable:
STOP rather than global env fallback, cross-process registry or mocked proof.
After restart the old runtime is dead; new clients require full admission.
Existing continuation rows alone confer no authority; D2-D4 validation and
shared-device clearing still apply.

##### D1b evidence reopen — runtime invariant versus proof trigger

Current-user attachment d055cb8b-1584-42bc-8634-b5c93cd16cdb chỉ authorize
Design reopen về proof methodology. APPLY: PAUSED; Tasks: 18/32;
task 3.2 PARTIAL. Không sửa 15 implementation paths, không chạy DB/Next/QA.
Đề xuất dưới đây cần explicit approval của exact revised Design/Tasks hashes;
không coi previous Apply grant là authorization cho seam mới.

RUNTIME INVARIANT: trong một generation gồm child PID + runId + main thread +
owned listener, mọi valid independent bootstrap consumer MUST resolve cùng
immutable process anchor, đúng một initialization promise, một admitted
runtime/facade, một foundation client và một raw client. Client wrapper và
underlying postgres-js connection objects phải giữ identity riêng tương ứng.
Module reevaluation không được tạo runtime/pair thứ hai. Fresh PID/runId MUST
chạy lại toàn bộ D1/D1a/F8; missing anchor ở worker/realm khác vẫn fail closed.

Observable Next HMR itself is NOT a security/runtime requirement; it is only
one possible evidence mechanism. Đây là proposed clarification của D1b,
không nới singleton invariant và không tuyên bố HMR đã được quan sát.
mtime touch, HTTP 200, READY status hoặc pool count không đổi riêng lẻ không
chứng minh module evaluation. Source BYTE drift vẫn là terminal negative E4,
không phải unchanged-inventory test E3.

**Version-pinned public-interface findings.** Installed Next 16.2.9,
Node v24.17.0; inspected package main/index declarations và
next/dist/server/next.d.ts. Public source
[NextWrapperServer at v16.2.9](https://raw.githubusercontent.com/vercel/next.js/v16.2.9/packages/next/src/server/next.ts)
phân biệt custom-server surface và internal methods. Public next(), prepare(),
getRequestHandler(), close() cho phép hosting/request lifecycle; không tìm thấy
documented deterministic API để đánh giá lại unchanged server module trong
same process. Có method hiện diện trong .d.ts không đồng nghĩa với public
reevaluation contract; getServer/load-config/setup-dev-bundler, private cache,
getRequestHandlerWithMetadata và internal upgrade machinery không được dùng.

[Custom-server guide v16.2.9](https://raw.githubusercontent.com/vercel/next.js/v16.2.9/docs/01-app/02-guides/custom-server.mdx)
giữ approved hosting API; không cần thay dev/start/build/config.
[Fast Refresh v16.2.9](https://raw.githubusercontent.com/vercel/next.js/v16.2.9/docs/03-architecture/fast-refresh.mdx)
mô tả edit-driven refresh/re-run/reload, không hứa mtime-only server evaluation.
[revalidatePath v16.2.9](https://raw.githubusercontent.com/vercel/next.js/v16.2.9/docs/01-app/03-api-reference/04-functions/revalidatePath.mdx)
và [router.refresh v16.2.9](https://raw.githubusercontent.com/vercel/next.js/v16.2.9/docs/01-app/03-api-reference/04-functions/use-router.mdx)
là data/render/cache behavior, không module-instantiation proof.
[Instrumentation v16.2.9](https://raw.githubusercontent.com/vercel/next.js/v16.2.9/docs/01-app/03-api-reference/03-file-conventions/instrumentation.mdx)
register gắn với server initialization, không unchanged-module trigger.
Kết luận A là bounded finding từ các public interfaces/docs đã inspect, không
claim mọi cơ chế Next đều bất khả thi. Không upgrade, private API invocation,
cache deletion, eval/VM/compiler transform hoặc experimental loader.

**Options for evidence (distinct from earlier launch options).**

- Evidence A — actual public Next reevaluation trigger: NOT SELECTED. Không
  tìm thấy API đáp ứng unchanged bytes + same generation + documented public
  surface; mtime attempt đã fail. Chỉnh nguồn để ép refresh vi phạm E3.
- Evidence B — decomposed proof: SELECTED. E1 chứng minh actual routes dùng
  owned anchor; E2/E3 kiểm tra independent consumer instances từ đúng resolver
  code trong cùng child. Không claim mô phỏng Next compiler/HMR behavior.
- Evidence C — structural proof: REQUIRED SUPPORT, NOT SUFFICIENT ALONE.
  Descriptor flags/frozen sole admit, stable Symbol, closure-owned promise/
  clients, route import graph và no constructors ở consumers giải thích vì sao
  mọi consumer cùng converge. E1-E5 dynamic assertions vẫn bắt buộc.
- Evidence D — fixed test-only re-consumer seam: SELECTED only as the bounded
  mechanism for B, defined below. Không HTTP/browser endpoint, test header,
  generic IPC command, registry, runtime reset/replacement hoặc production hook.

**Exact selected seam — equivalent independent consumer instantiation.**

1. Trong existing raw-clocking-bootstrap.ts, một non-exported
   createIndependentPointageAccessor() tạo một fresh zero-argument closure.
   Mỗi closure chứa đầy đủ actual descriptor lookup/validation của native
   node:process + stable Symbol và gọi fixed anchor.admit; không đóng trên
   runtime/client/promise đã cache, không gọi lại cached get function.
   Nó dùng fixed imported createPointageRawClockingRuntime như hiện tại.
   Normal getPointageRawClockingConsumer dùng một closure tạo từ chính factory
   này. Chỉ bounded consumer entry được export, không export probe/client.
2. Một non-exported fixed createPointageAccessorPair() trả đúng hai fresh
   closures từ factory đó, không argument/options/operation/input. Bridge
   truyền function này làm second typed argument của sole admit method:
   admit(fixedRuntimeFactory, fixedAccessorPairFactory). Đây là proposed
   internal test-child signature alignment, không thêm method vào anchor,
   public operation, consumer output hoặc replace/install API. Handler không
   supply callback; child không import server-only bridge ngoài Next compiler.
   Callback được Next-compiled bridge chuyển trong process, không serialize.
3. Child owner reserve original admission promise đồng bộ trước mọi callback/
   await như hiện tại. Một private one-shot proof state được reserve trước
   gọi pair factory để recursive admit không khởi động probe lần hai.
   E2 tạo pair A/B ngay sau reservation, trước initialize microtask hoàn tất:
   A !== B; A và B đều chạy resolver riêng; cả hai returned promises phải ===
   chính reserved promise (không async wrapper/.then tạo promise mới trong
   accessor). Recursive admit vẫn chạy live guards, không skip validation.
   Only initial fixed runtime factory có thể initialize; reentry không gọi lại.
4. Sau promise thành công, owner giữ private reference tới returned facade,
   underlying admitted service runtime, foundation wrapper/db/connection và
   raw wrapper/db/connection. E3 tạo pair C/D MỚI bằng cùng fixed pair factory;
   cả bốn closures A/B/C/D phải pairwise distinct. Invoke C/D independently
   và concurrently; từng returned promise === original; mỗi resolved facade
   === original facade. Trước/sau E2/E3 kiểm tra same native process anchor
   object/descriptor, PID/runId/main-thread/listener và exact inventory hash.
   Factory/client construction counters mỗi loại đúng một; từng reference
   runtime, wrapper, db, connection giữ === baseline. DB pool count chỉ là
   supporting observation, không thay object/consumer identity assertions.
5. Đây là genuine independent consumer instantiation được option B cho phép,
   KHÔNG phải genuine Next module reevaluation. Factory body có thể cached
   nhưng closures mới phải có own identity và thực thi toàn bộ resolver;
   gọi cached get hai lần hoặc hai wrapper chỉ delegate cached get không đủ.
   Static source check MUST chứng minh real route getter và pair factory dùng
   đúng cùng resolver constructor; không copy algorithm riêng cho test.
   Separate module top-level side effects ngoài bounded accessor không được
   claim covered; route/source inventory MUST chứng minh không có constructor/
   mutable runtime owner khác. Nếu cần proof rộng hơn -> STOP review, không
   tự chuyển sang private Next cache.
6. Probe tự chạy đúng một lần từ owned test-child admission lifecycle, không
   có command/route/query/body/header/browser selector để invoke hoặc repeat.
   Sau original promise resolves, proof awaits re-consumers, KHÔNG await probe
   trong promise mà probe đang kiểm tra (tránh self-await deadlock).
   READY vẫn chỉ phản ánh runtime admission; proof result là evidence riêng.
   Missing pair, reused closure, wrong identity, drift, timeout/exception hoặc
   missing result không PASS: terminal failure/teardown hoặc test failure theo
   existing bounded lifetime; không reset/retry/replace trong generation.
7. Parent-to-child IPC giữ nguyên exact INIT một lần rồi STOP; không RELOAD,
   second INIT hoặc extra parameter/key. Child-to-parent thêm đúng ONE typed
   evidence receipt sau successful E2/E3: type POINTAGE_TEST_RECONSUMER_PROOF,
   version 1, runId, childPid, result PASS. Không arbitrary payload/record,
   function/object identity, counts, path, URL, key/hash of secret, credential,
   token, employee hoặc attendance. PASS chỉ emit sau tất cả assertions ở
   owner thành công; failure dùng existing generic FAILED status/teardown.
   Parent validates exact keys/generation/sole occurrence và phải observe
   receipt để pass E2/E3. Receipt không runtime authority hoặc readiness grant.
   Không thay READY counter thành artificial HMR evaluation counter.
8. Future tests trong existing bootstrap.test MUST có detector sensitivity:
   riêng isolated child-owner unit tests đưa reused closures, mismatched
   promise/facade hoặc altered descriptor/reference vào bounded proof logic
   -> no PASS; test mock chỉ chứng minh detector, không thay E1-E3 actual-child
   positive. Không thêm hostile callback selector vào real launch/IPC/HTTP.

Path impact: NO PATH CHANGE. Future evidence-only changes dự kiến đúng bốn
existing paths thuộc approved 15: raw-clocking-bootstrap.ts (private closure
constructor/signature), test/helpers/pointage-raw-clocking-next-child.ts (owner
assertions/receipt), test/helpers/pointage-raw-clocking-launcher.ts (strict
receipt parsing and proposed fixed E5 launch argv only), test/pointage-raw-clocking-bootstrap.test.ts (E1-E5
and detector tests), tất cả dưới apps/backoffice với src/server/pointage cho
bridge. Exact full paths/hashes nằm trong review/Tasks. Không sửa runtime.ts,
HTTP adapter, seven routes, shared startup/config/package hoặc migration.
Nếu implementation cần thêm path/argument channel/runtime owner -> STOP.
Không file nào trong 15 paths được sửa ở lượt Design này.

##### D1b E4/E5 evidence alignment — current proposed review

Authority: current-user attachment 946adbba-621a-4644-af70-e4a0c6b56685.
Human evidence review chấp nhận E1/E2/E3/E4 PASS; E5 vẫn PARTIAL.
Đây là bounded Design/Tasks alignment, chưa cho phép implementation.
APPLY: PAUSED; Tasks: 18/32; Task 3.2: PARTIAL. Không task 3.3/UI/DB/Next/QA.
Không đổi Product, hai Specs (20 requirements / 62 scenarios), D1/D1a/F8,
D4a/D4b/F6, migration 0021, singleton authority hoặc seven production blockers.
Các approval/execution statements trước đây là lịch sử, không Apply grant mới.

**E4 terminal response.** Nếu request đã tới owned listener / Pointage dispatch
trước khi terminal teardown tiếp quản, failure MUST là
503 POINTAGE_UNAVAILABLE, không protected payload. Nếu teardown do source
drift đóng owned listener trước khi có thể tạo HTTP response, transport refusal/
closure là valid fail-closed outcome. MUST NOT giữ listener sống, trì hoãn
teardown hoặc tạo response window chỉ để ép quan sát HTTP 503.
Mọi trường hợp vẫn deny new work, terminal generation, không replacement
admission/runtime, đóng cả hai DB clients, kết thúc đúng owned child, giữ
evidence DB và restore controlled bytes chính xác sau confirmed child exit.
Historical observed CLOSED_TRANSPORT / exit 1 / one admission / clients 0 /
no replacement / exact restored source được human review chấp nhận E4 PASS;
không đổi observation đó thành HTTP 503 và không coi là E3/HMR proof.

**Launch-only independent listener-loss mechanism.** Chỉ existing TEST_ONLY
pointage-raw-clocking-next-child.ts entry nhận exact process argument
`--serve-listener-loss-proof`. Parse một lần trước INIT: normal child dùng
empty argument list; proof child dùng đúng singleton argument list này.
Unknown/duplicate/combined arguments fail closed trước listener/client creation.
Không chuyển flag vào INIT, process.env, app config, request hoặc browser.
Existing launcher chọn fixed argument list trước fork; sau fork không có
setter, trigger hoặc post-READY control method. Existing parent --serve mode
không đổi; không thêm root/package script hay app/runtime topology.

1. Child chạy cùng entry, strict INIT đúng một lần, cùng D1/F6 parent preflight,
   child D1/D1a/F8 identity/privilege/helper proofs, exact owned IPv4 listener,
   dual-client admission, fixed synthetic provider và runtime. Neutral actual
   context request có thể kích hoạt lazy admission; không credential/mutation
   nào cần để kích hoạt fault.
2. Sau READY và complete E2/E3 owner proof, one-shot child lifecycle code kiểm
   tra same PID/runId/main thread, exact source inventory/native anchor,
   owned server.listening/address và runtime/foundation/raw counts đúng 1.
   E3 receipt vẫn chỉ chứng minh E2/E3, không đổi schema hay meaning để giả
   một listener-loss receipt. Missing E3 proof không qualify E5.
3. Child-owned lifecycle đóng CHỈ exact httpServer đang sở hữu bằng public
   Node server.close(). Không gọi STOP trước để giả independent listener loss.
   Không await drain callback trước phát hiện mất listener: ngay sau close,
   assert server.listening false và address() null; kiểm tra lại existing
   requirePointageListener/live-prerequisite guard từ lifecycle code, không
   đợi một Pointage operation. Guard MUST detect lost listener và chuyển vào
   existing terminal failure/teardown path. Không auto-rebind/restart.
4. Same bounded teardown giữ 10-second drain / 5-second client-close /
   20-second parent ownership deadline. Đóng mỗi foundation/raw connection
   đúng một lần; counter/reference assertions trước khi drop references
   chứng minh không thêm listener/runtime/client pair. Không đổi raw/receipt/
   continuation rows; parent kiểm tra scoped persisted evidence unchanged.
5. Existing sanitized LISTENING -> INITIALIZING -> READY -> FAILED và existing
   E3 receipt, cùng exact PID/runId, private assertions, refused subsequent
   HTTP connections, parent SQL role counts 0/0 và bounded child exit là
   evidence phối hợp; status FAILED đơn lẻ không chứng minh listener loss.
   Parent không gửi STOP/disconnect trước khi observed terminal outcome;
   watchdog cleanup không được tính là successful independent proof.
6. Để assertion failure không giả thành expected negative: proof-mode expected
   listener-loss lifecycle kết thúc exit 1, signal null; private proof assertion
   failure phải drain/close theo cùng lifecycle nhưng kết thúc test exit 2,
   không được test chấp nhận như exit 1. Đây chỉ là local test-process verdict,
   không thêm IPC payload, stage hay application error code. Normal mode/E4
   exit semantics không đổi. Detector negatives MUST chứng minh missing close,
   failed precondition hoặc guard không phát hiện loss không thể pass.
   Bất kỳ assertion/teardown timeout, forced exit hoặc missing evidence đều FAIL.

INIT exact schema và STOP exact schema ở D1b giữ nguyên. Không LISTENER_LOSS,
second INIT, generic fault IPC, HTTP/debug/fault endpoint, query/header/body
selector, browser control, environment fault variable, registry, listener
export, private Next API, HMR/cache hook hoặc instrumentation.
Không thêm outbound receipt. Nếu actual implementation không thể chứng minh
kết quả bằng private assertions + existing statuses/process exit/SQL evidence
và cần payload mới, STOP xin review, không tự thêm hoặc repurpose E3 receipt.

**E5 retained-continuation matrix — future Apply only.**

Current human CHANGES_REQUESTED clarification: mọi retained-continuation case
phải cross-generation A issues / A exits without Pointage end / B re-admits /
B consumes A's continuation. Các accepted E4/listener/IPC/exit/path decisions
giữ nguyên; không Product/Specs/task-count change hoặc Apply authorization.

Tất cả cases dùng actual file routes, guarded migrated synthetic PostgreSQL,
final approved source hashes; không mock clock, sửa TTL, rewrite deadline,
production/runtime clock override hoặc privileged child. Mỗi fresh-process
case phải record new PID/new runId, fresh native anchor và full D1/D1a/F8 trên
hai actual child-owned handles trước provider/runtime. Không transfer Promise,
runtime/client từ child cũ; persisted continuation rows chỉ là data.
Sau setup/identity hoặc authorized reset, chụp scoped raw events/receipts và
đối chiếu sau denied request; không insert/update/delete attendance để tạo proof.

Cross-generation MUST cho TỪNG case DEPARTURE, RESET, IDLE và ABSOLUTE:
Generation A tự admit rồi actual identify cấp continuation. Parent chỉ giữ token
đó trong memory; A kết thúc bằng bounded bootstrap STOP (không gọi Pointage end,
không clear/end continuation row), confirm child exit và cả hai clients đóng.
Sau đó Generation B mới launch, new PID khác A / new runId khác A / fresh
process anchor; B independently chạy full D1/D1a/F8 trên own actual clients
và đúng approved target/security configuration trước nhận protected request.
B MUST dùng chính continuation do A cấp, không identify lại hoặc cấp token
thay thế ở B. Không chuyển Promise/runtime/client/trusted context giữa A/B.
Read-only evidence xác nhận continuation chưa ended do teardown và original
issuedAt/absolute deadline vẫn của A; restart không reset/extend TTL. Thời gian
startup/teardown đều tính vào real lifetime. Nếu B không kịp prerequisite
deadline của case, test FAIL/inconclusive, không đổi TTL/clock/deadline.

- E5-DEPARTURE: Generation A identify hợp lệ cấp continuation rồi kết thúc
  không Pointage end; sau confirmed A exit, parent dùng existing guarded
  disposable Personnel setup đặt departure ngoài eligibility. Generation B
  independently re-admit và actual state dùng continuation do A cấp phải
  403 POINTAGE_ACCESS_DENIED, không
  protected identity/state, không raw event/receipt side effect. Kiểm tra token
  chưa idle/absolute-expired để không gán nhầm expiry failure cho departure.
- E5-RESET: Generation A identify cấp token, kết thúc không Pointage end;
  sau confirmed A exit, parent dùng existing authorized disposable admin
  boundary và existing reset/regeneration repository operation, không
  standalone revoke/suspend và không widen foundation runtime grants. Confirm
  superseded old version/current new version; Generation B independently
  re-admit và actual state dùng OLD continuation do A cấp
  trả 403 POINTAGE_ACCESS_DENIED, không protected output/event/receipt. Old
  token không regain authority. Child không nhận admin URL/client/proof.
  Assert Personnel vẫn eligible và token chưa expired để isolate reset.
- E5-IDLE: Generation A identify cấp continuation, record original DB-issued/
  idle/absolute deadlines read-only tại parent, rồi A kết thúc không Pointage
  end. Generation B independently re-admit, không identify hoặc foreground
  touch; B dùng continuation do A cấp cho actual state. Dùng real elapsed
  server/database time đợi vượt approved 60-second idle deadline, vẫn trước
  absolute deadline; actual state phải 403 POINTAGE_ACCESS_DENIED. Expired
  continuation không được revive/touch, raw/receipt unchanged. Không sửa DB
  deadline hoặc clock để rút ngắn test; check current credential/lifecycle
  hợp lệ để isolate idle.
- E5-ABSOLUTE: Generation A identify cấp continuation, record original
  issuedAt/absoluteExpiresAt (120 seconds), rồi A kết thúc không Pointage end.
  Generation B independently re-admit trước idle deadline của A, không identify
  lại; B dùng continuation do A cấp cho mọi foreground state read, kể cả final
  denial. Trước mỗi idle deadline, B thực hiện explicit valid authorized
  foreground state reads; đây là test user actions, không background heartbeat.
  Read-only DB assertions chứng minh idle advance theo existing rules nhưng
  không vượt và không di chuyển original absolute deadline. Tiếp tục bằng
  real elapsed time tới sau original 120-second deadline; actual state phải
  403 POINTAGE_ACCESS_DENIED dù đã có valid touches. Không revive/touch sau
  expiry, không raw/receipt side effect, không TTL/clock override. Nếu idle đã
  hết trước intended touch thì case không chứng minh absolute và phải FAIL.

Mỗi case có own result/assertions, exact source set/commands/elapsed durations,
sanitized generation/target provenance, no protected response payload và
no raw/receipt side effects. Được phép test lâu hơn; timeout budget phải chứa
real 60/120-second waits và bounded teardown, không đổi lifetime để pass.
Không in token/credential/URL/secret/employee/attendance; deadline equality
có thể record boolean/duration evidence, không dump row.

E5-LISTENER-LOSS là named result độc lập, không EADDRINUSE/STOP/IPC/E4 substitute.
Giữ các E5 prerequisites khác: fresh-process readmission, clean STOP, IPC loss,
partial start, normal Next no-owner denial và non-Pointage route smoke.
No skipped case counts. Full E5 chưa PASS thì task 3.2 vẫn PARTIAL / 18/32.

Path impact: NO NEW PATH. Future code/test chỉ trong existing bốn evidence paths:
apps/backoffice/src/server/pointage/raw-clocking-bootstrap.ts;
apps/backoffice/test/helpers/pointage-raw-clocking-next-child.ts;
apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts;
apps/backoffice/test/pointage-raw-clocking-bootstrap.test.ts.
Bridge không cần thêm capability; launcher chỉ launch-time fixed argv/validation,
child giữ private loss lifecycle/assertions, existing test file giữ named matrix.
Không cần sửa eleven U2 paths còn lại, runtime/HTTP/routes, contracts, migration,
UI pack, shared startup hay auth/Personnel code. Nếu cần path khác -> STOP.
UI_UX_PRO_MAX_USAGE OPTIONAL / NOT_USED; bảy production/legal/privacy blockers
và synthetic-only / real attendance NOT_AUTHORIZED giữ nguyên.

##### Teardown, diagnostics and disposable lifetime

SIGINT/SIGTERM, IPC disconnect/STOP, listener failure, source drift or terminal
admission failure stop new requests immediately. Drain owned in-flight work
for at most 10 seconds, then close remaining owned HTTP/HMR sockets and call
Next close. End both postgres clients exactly once, including partial startup,
with a 5-second close deadline; drop runtime/promise/secret references.
Parent gives child 20 seconds to exit, then may terminate ONLY that positively
identified owned child PID; never broad node/process/container kills.
A timeout/forced exit leaves possible commit outcome unknown, not false rollback.
No teardown deletes raw events, receipts or continuations inside active DB.

Drop INIT message references after construction. Child sở hữu decoded auth
secret và derived stateGuard material của generation; không log/persist, đặt
trong process.env, serialize vào RSC/browser hoặc expose qua diagnostics.
Chỉ clear owned mutable buffers best-effort khi ownership thực sự kết thúc,
đặc biệt lúc teardown; không zero buffer mà live runtime vẫn phụ thuộc.
Không claim xóa được immutable JS strings hoặc driver/runtime copies;
driver credentials remain private until pool/process termination.
Raw child stdout/stderr are piped, drained and discarded, not persisted or
relayed via regex redaction. Only strict sanitized IPC diagnostics and the sole bounded re-consumer proof
receipt defined above are exposed:
type = POINTAGE_TEST_STATUS, version = 1, runId, childPid,
stage in LISTENING/INITIALIZING/READY/FAILED/STOPPED and optional bounded
code = POINTAGE_UNAVAILABLE. No input echo, exception/SQL stack, headers,
URL, auth material, hashes of secrets, Personnel or attendance payload.
Quiet mode supplements, never replaces, output suppression. Parent follows
the same no-secret-output rule for driver/provision commands.

Default shutdown retains positively identified disposable DB/container for
evidence; no automatic destructive cleanup. Separate explicitly authorized
cleanup uses existing F6 ownership/name/loopback/current_database guards and
exact owned container/volume identity after child exit. Unknown identity or
shared yuta_cloud/yuta_resto -> STOP. No real attendance or production activation.

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

U2 handler dependency bắt buộc đi qua D1b server-only consumer accessor.
Không handler/RSC nào tạo client hoặc đọc bootstrap inputs. Context GET cũng
phải qua current runtime admission và active-scope resolution; no partial
availability từ parent proof hoặc cached successful route. D1b listener proof
không thay Origin/CSRF/operation guards dưới đây.

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

D1b IPC/owner closure là nơi duy nhất giữ ephemeral bootstrap secrets; no
process.env credential fallback, stdout/stderr relay hoặc serialized RSC input.
Owned runtime/client teardown và output suppression theo D1b, không sửa
foundation audit taxonomy hoặc legal retention. Không log Next request errors
với body/header/SQL context; raw process diagnostics không thành QA evidence.

Employee page HTML/RSC chứa neutral entry shell only. force-dynamic, revalidate
0, no cached personal fetch/unstable_cache. Deployable page final responses and
data responses require private, no-store, max-age=0; Pragma no-cache, Expires 0.
The Next 16.2.9 DEV-only diagnostic exception and mandatory actual local
production-mode page proof are bounded below; data-response policy is unchanged.
No CDN caching/s-maxage,
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

### D10a — Final page cache evidence: DEV versus local production mode

This technical clarification changes neither Product nor Specs. The exact
Next 16.2.9 development observation remains
`Cache-Control: no-cache, must-revalidate`. In installed `BaseServer.pipeImpl`,
the `this.dev` branch replaces the page header and clears payload cacheControl
before sending the rendered result. This is an accepted DEV-only diagnostic,
not final D10 compliance and not a YUTA defect requiring a response interceptor.
The historical failed final-header test remains FAIL as originally observed.

Deployable dynamic employee-page final HTTP responses MUST include `private`,
`no-store`, `max-age=0` and MUST NOT include `public` or `s-maxage`;
`no-cache` and `must-revalidate` may additionally be present. Evidence must
inspect the response after the complete Next render pipeline, not merely proxy
intent, a mocked response or a framework source claim. DEV still must prove no
public/shared or user-controlled cache directive, neutral HTML/RSC, per-request
nonce correctness and Pointage-only isolation.

The selected future proof is `LOCAL_PRODUCTION_MODE_IMPLEMENTATION_EVIDENCE`:
build the existing Backoffice and request the real filesystem page at
`http://127.0.0.1:3001/pointage/synthetic-establishment` through its actual
supported production-mode Next server. From the repository root, use only:

```text
pnpm --filter @yuta/backoffice build
pnpm --filter @yuta/backoffice start --hostname 127.0.0.1
```

The existing package scripts resolve to `next build` and
`next start -p 3001 --hostname 127.0.0.1`; root aliases are
`build:backoffice` and `start:backoffice`. No new script, path, app, listener
wrapper or preview mechanism is approved. These commands are a future plan:
do not run them until explicit human approval of the revised Design/Tasks hashes.

For both future commands, require process-local `NODE_ENV=production`,
`NEXT_TELEMETRY_DISABLED=1`, `VERCEL` absent, loopback-only listener and no
external ingress. Use synthetic slug/neutral payload only, no real Personnel
or attendance data, no production trusted-client-address provider, no production
DB configuration and no shared development DB fallback. This rendering proof
does not admit the D1/D1b usable runtime: do not bootstrap dual DBs, instantiate
a provider, run fixtures/migrations or create attendance merely to test the page.

Preflight both inherited environment and Next-autoloaded environment files
without logging values. Existing Backoffice `.env` and `.env.local` must not
silently supply a DB/provider/bootstrap configuration; clearing inherited
variables alone is insufficient. If safe effective configuration cannot be
established using current approved mechanisms without editing environment files,
adding a path/script or weakening guards, STOP for environment authority.
Do not rename environment files or manufacture fallback credentials. If build
or the built neutral page unexpectedly needs Pointage DB/provider composition,
STOP for review. A standard no-owner API must remain unavailable.

Actual HTML MUST return 200 with all three required cache directives and neither
forbidden directive. Actual RSC/Flight MUST return 200 with neutral payload and
an equally non-cacheable final policy: assert the same directive set first,
record the exact final header, and document any different framework-owned form.
Do not silently accept an alternative by weakening the test. If RSC is cacheable
or the alternative's equivalence is ambiguous, STOP for human review. Preserve
`Pragma` / `Expires` evidence where applicable, no neutral-page `Set-Cookie`,
and no protected personal payload in either representation.

Re-run production-mode CSP evidence independently: final CSP/nonce present,
every applicable rendered framework script matches the response nonce,
independent requests have distinct nonces, inbound CSP/report-only/x-nonce
cannot select that nonce, no `unsafe-inline` and no `unsafe-eval` workaround.
Recheck unrelated-route isolation and normal no-owner API denial. DEV PASS
cannot substitute for this production-mode proof; neither is Browser QA.

Reject node_modules/Next patches, ServerResponse monkey-patches, global Next
handler wrappers, custom reverse proxies/listeners, D1b bootstrap changes,
instrumentation/private Next APIs, root-layout changes, global middleware/proxy
expansion, next.config/global headers workarounds, service workers, CDN/proxy
simulation and artificial production-only page branches. The existing proxy
remains unchanged; do not compensate for a DEV override. If actual production
final responses fail D10, STOP and report before correction. Any future proxy
edit requires that genuine scoped defect and review within the approved U3
boundary; no speculative interceptor is authorized.

This proof is not deployment, staging, production enablement, real attendance,
provider approval or readiness promotion. All seven production/legal/privacy
blockers and P13/P14 synthetic/disposable-only authority remain unchanged.

### D10b — PROCESS_ENV_SHADOW_ISOLATION_V1

Impact classification: CROSS_MODULE. Profile áp dụng cho toàn bộ Backoffice
Next build/start process, không chỉ Pointage. Đây chỉ là evidence/test boundary:
Product change NO, Specs change NO, application runtime architecture change NO,
production enablement NO. D10a final HTML/RSC/CSP assertions không đổi.

FRAMEWORK FACT: Next/@next/env 16.2.9 snapshot initial process.env.
replaceProcessEnv xóa current keys có sourceEnv undefined hoặc chuỗi rỗng,
sau đó gán lại mọi entry của sourceEnv; empty string trong snapshot có thể
được khôi phục. Điều kiện chọn file key vào parsed là
`typeof parsed[key] === 'undefined' && typeof origEnv[key] === 'undefined'`.
Presence trong origEnv, không phải truthiness/non-empty, quyết định eligibility.
Key có empty-string value vẫn ngăn file key được chọn vào parsed. Không tuyên
bố empty string làm giá trị .env thắng. Source và public precedence được pin
16.2.9 trong review packet.

YUTA POLICY: EMPTY STRING SHADOWING IS FORBIDDEN. Đây là safety policy được
human duyệt, không phải kết luận Next precedence: empty value mơ hồ giữa các
consumer/validator, có thể bị hiểu là missing/invalid và cho evidence yếu hơn
một intentional non-empty poison/deny override. Mọi shadow MUST deliberately
non-empty trước Next initialization.

Production-load order: process.env, .env.production.local, .env.local,
.env.production, .env. Trước mỗi future build và start, inventory lại đủ bốn
file tại apps/backoffice: existence, key counts, union và duplicate names.
Không lấy .env.development.local làm shadow source. Không in, persist hoặc
hash giá trị file/secret. Inventory hiện tại: production-specific files vắng;
.env.local có 5 keys, .env có 6 keys; union 8 keys và 3 duplicates
AUTH_SECRET/CLOUD_DATABASE_SSL/CLOUD_DATABASE_URL. Key/category profile dưới
đây bao phủ toàn bộ union, kể cả tên chưa có current consumer.

| Key                            | Category           | Giá trị evidence được đề xuất, không lấy từ env file                       |
| ------------------------------ | ------------------ | -------------------------------------------------------------------------- |
| AUTH_SECRET                    | POISON_SECRET      | `!U3_DENY!`                                                                |
| CLOUD_DATABASE_SSL             | DENY_SINK_SSL      | `false`                                                                    |
| CLOUD_DATABASE_URL             | LOOPBACK_DENY_SINK | `postgresql://u3_env_poison:!U3_DENY!@127.0.0.1:65431/yuta_u3_env_blocked` |
| GOOGLE_CLIENT_ID               | POISON_PROVIDER    | `!U3_DENY!`                                                                |
| GOOGLE_CLIENT_SECRET           | POISON_PROVIDER    | `!U3_DENY!`                                                                |
| GOOGLE_TOKEN_ENCRYPTION_KEY    | POISON_SECRET      | `!U3_DENY!`                                                                |
| NEXT_PUBLIC_APP_URL            | LOOPBACK_ORIGIN    | `http://127.0.0.1:3001`                                                    |
| YUTA_OPENAI_EVALUATION_API_KEY | POISON_API_KEY     | `!U3_DENY!`                                                                |
| NODE_ENV                       | EVIDENCE_MODE      | `production`                                                               |
| NEXT_TELEMETRY_DISABLED        | TELEMETRY_DISABLED | `1`                                                                        |

Poison markers là public negative-test literals, không phải credentials,
không tăng độ dài/encode/generate để qua credential validator. AUTH*SECRET
marker có 9 ký tự, cố ý không đạt getAuthSecret production minimum 32.
Nếu build gọi validator đó, STOP tại consumer, không tạo secret 32 ký tự.
Ba GOOGLE*_ trong union không có exact-name reader được tìm thấy trong current
Backoffice/packages source; connector đọc GOOGLE*BUSINESS_PROFILE*_ và
REPUTATION_CREDENTIAL_ENCRYPTION_KEY. Không alias hoặc thêm các tên đó.
Personnel extraction chặn ngoài development trước API-key use; không thêm mode
hay enablement để qua guard. Recheck consumers trước future execution.

CLOUD_DATABASE_URL chỉ là syntactically parseable deny target vì
packages/db-cloud/src/env.ts yêu cầu URL; CLOUD_DATABASE_SSL chấp nhận literal
false. Backoffice cloud-database module tạo client khi import; parsing/client
object không phải permission connect. Không provision sink, dùng shared DB,
retained evidence DB, yuta_cloud/yuta_resto hoặc copied username/password.
Trước build/start phải xác nhận port 65431 không có listener/service; nếu có
hoặc không chứng minh được non-serving, STOP, không chọn port khác ngầm.
Mọi DB connection attempt là unexpected dependency và phải fail/STOP; không
coi connection refusal bị nuốt như successful isolation evidence. Chỉ dựa vào
không thấy log là chưa đủ để khẳng định không có attempt. Không sửa driver,
bootstrap, firewall hay tạo listener để bù thiếu bằng chứng.

Dùng một frozen in-memory profile cho một evidence generation. Không spread
parent process.env. Chỉ copy các OS/runtime keys cần thiết:
SystemRoot, WINDIR, COMSPEC, PATH, PATHEXT, TEMP, TMP; tìm tên Windows không
phân biệt hoa/thường, từ chối aliases/collisions không rõ ràng. Sau đó thêm
đúng 10 reviewed entries trên. Không inherit USERPROFILE/APPDATA/LOCALAPPDATA,
NODE_OPTIONS, NODE_PATH, proxy/token/provider variables theo suy đoán. Nếu cần
thêm inherited key, ghi exact name/reason và STOP để review trước khi thêm.
Current pnpm.CMD có thể tự thiết lập NODE_PATH cho installed pnpm; đó là tool-
generated resolution metadata, không phải inherited application configuration.
Phải kiểm tra resolved Node/pnpm identity và shim trước future execution.

Cả hai command MUST nhận cùng dedicated env object qua child-process env option;
không launch từ broad developer/Codex shell environment. Future in-memory
orchestration dùng Node child_process.spawn với COMSPEC đã xác minh, args
`/d /v:off /s /c` và một trong đúng command literals sau, cwd repository root,
windowsHide true, không tạo source wrapper/script:

```text
pnpm --filter @yuta/backoffice build
pnpm --filter @yuta/backoffice start --hostname 127.0.0.1
```

/d tắt cmd AutoRun, /v:off không expand poison marker như delayed expansion;
profile values chỉ đi qua env, không nội suy vào command text. Same generation
giữ nguyên tất cả profile entries và NEXT_PUBLIC_APP_URL qua build và start.
Nếu orchestration kết thúc, profile/inventory drift hoặc tool-added application
key xuất hiện, STOP; không tái dùng build từ profile khác. Các Next-generated
internal runtime keys không phải permission tự inject private bypass.

Trước mỗi command: require full file union coverage/non-empty shadows, đúng
key/category set, same profile equality, NODE_ENV production, telemetry off,
VERCEL absent và không có **NEXT_PROCESSED_ENV, **NEXT_PRIVATE\* hoặc private
env-skip option do launcher cung cấp. Không thêm Pointage synthetic/provider/
bootstrap enablement; file union có forbidden key hoặc unknown key phải STOP.
Unknown/future keys cần exact consumer/read-path classification và review
safe poison trước khi mở rộng profile; không copy file value. Functional
credential, external endpoint hoặc shared target requirement luôn STOP.
Chỉ ghi names/categories, counts, equality assertions; không persist/hash
secret values. Public profile literals không được trình bày như real secrets.

Separate @next/env admission probe: NOT_PROPOSED trong V1 packet này.
Không gọi private loader API hoặc probe ngầm; inventory dùng read-only parsing,
không load env vào application. Future admission phải kiểm tra dedicated launch
object và propagation; một probe bổ sung cần exact mechanism/output được review
trước. Probe không bao giờ thay actual build/start evidence của D10a.

Threat boundary: V1 chứng minh file values không thành effective Next process
configuration/active provider/DB hoặc bundled NEXT_PUBLIC value. Nó KHÔNG hứa
Next CLI không mở/parse env-file bytes; public loader vẫn có thể đọc chúng.
Điều này được human chấp nhận cho U3. Nếu yêu cầu không đọc file bytes, STOP:
cần filesystem/workspace isolation design riêng. Không nâng claim ngầm.

Mọi build/start failure do valid credential, provider, DB/shared data hoặc key
không safely poisonable đều STOP, giữ task PARTIAL; không copy real values,
tạo functional dummy credential, provision DB/provider, sửa env/Next config/
node_modules/launcher/bootstrap hoặc dùng private skip flag. Không dump raw
diagnostics chứa env/header/body; chỉ sanitized failure category/consumer.
D10a neutral page, loopback-only listener ownership/shutdown proof, no-owner
denial, no real attendance và cả bảy production blockers giữ nguyên.
V1 chỉ là proposal trong alignment: chưa probe/build/start, chưa U3 PASS;
đợi explicit approval của exact Design/Tasks hashes và profile mới.

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

### U3 final-page evidence — mode-separated and pending approval

D10b PROCESS_ENV_SHADOW_ISOLATION_V1 admission/profile propagation là prerequisite
của D10a future build/start proof. Framework presence và YUTA non-empty policy
phải được đánh giá riêng; profile/probe không thay final HTML/RSC/CSP evidence.

D10a controls final HTML/RSC cache and CSP evidence. Preserve the historical DEV
observations and failed exact-cache assertion; do not relabel them as production
proof. After explicit approval of the revised exact Design/Tasks hashes, collect
the actual local production-mode commands, sanitized effective-environment
admission result, status/headers, nonce/script assertions, route isolation,
no-owner denial and shutdown evidence. Record exact source/test hashes and any
deviation; failure or ambiguous RSC cacheability stops U3.

A passing approved U3 proof may complete only 3.3 (20/32); then finish the
already-approved remaining U4 work (at most 21/32) and STOP before 3.5. No task
completion is granted by this planning alignment. Formal post-Apply VERIFY
must independently re-evaluate U3 against current bytes and D10a; QA remains
a subsequent separate mandatory Browser QA stage, not this HTTP evidence.

### D1b actual-process bootstrap proof — planned, not executed

U2/U8 và R3/R6/R7 MUST bổ sung actual Next file-route evidence sau Apply approval:

1. Same child PID/runId/main thread owns actual 127.0.0.1:3001 listener, two
   independently authenticated max:1 handles và all D1/D1a/F8 SQL proofs.
   Parent-only probe, direct factory/adapter call hoặc mocked handler không đủ.
2. Concurrent initial context/identify/state requests publish one runtime only
   after both proofs; failed second client/provider closes partial resources.
   No credential processing or protected output before complete admission.
3. Missing/malformed/replayed IPC; production/VERCEL; wrong/mismatched/C17/shared
   DB; role/member/ACL/helper/body drift; listener/port mismatch; lost socket;
   forged Host/Forwarded headers; missing provider/connection all fail closed.
   Standard dev/start/build without owner never instantiate fallback runtime.
4. Prove independent re-consumer behavior E3 with unchanged inventory, not
   mtime/HMR inference. Source BYTE drift E4 and fresh-process readmission E5
   are separate cases; IPC disconnect remains a separate teardown negative.
   Old continuation rows do not bypass current authority.
5. Exercise actual migrated synthetic Next context/identify/state/IN/OUT/recover/
   end routes, dual identify/state.read and raw+receipt atomicity. Keep current
   20/62 mapping; startup tests supplement, never replace behavioral scenarios.
6. End/failed startup/forced shutdown closes both clients; capture sanitized
   process/listener and SQL assertions, source hashes and exact command/exits.
   DB evidence remains intact; logs/browser/RSC contain no bootstrap secrets.
   Non-Pointage route smoke test shows no default/global startup modification.

This reopen runs planning checks only. Prior partial actual-route results and
failed mtime assertion remain historical evidence, not current completion.
Revised E1-E5/socket/SQL proof is NOT_RUN and mandatory before task 3.2/3.8
completion; neither Next docs nor this proposal supply dynamic PASS.

#### D1b E1-E5 — separate future acceptance evidence

E1 — actual Next route binding: drive all seven existing file routes over the
owned listener in the actual child. Preserve method/auth/lifecycle/transaction
assertions; correlate child PID/runId and anchor admission with real requests,
plus exact route -> HTTP -> bridge import graph. Direct factory calls/mock
routes cannot satisfy E1. No employee UI/3.3+ is needed for this U2 evidence.

E2 — same-generation singleton: first real request lazily admits, with concurrent
independent real requests plus independent A/B closures before initialization
settles. Assert exact promise identity, one construction per runtime/client,
both authenticated same-database proofs before credential work; failed second
client/provider closes partial resources. Same-generation success is not HMR.

E3 — deterministic re-consumer: C/D distinct from A/B and each other, full
resolver body from real bridge, same PID/runId/main thread/listener/inventory,
same anchor/promise/facade/service runtime/two wrapper/db/connection references.
Require owner assertions and the single strictly parsed private PASS receipt;
also detector-negative unit tests. No source write/mtime trigger, module cache
operation or browser interaction. Proof does not assert actual Next HMR occurred.

E4 — actual source BYTE drift: separate future explicitly approved negative on
exact raw-clocking-bootstrap.ts in the owned launch inventory after READY.
Capture original bytes/hash; append a fixed harmless comment, record the changed
hash and assert deny new work with terminal child failure: dispatched requests
before teardown ownership fail with generic 503 POINTAGE_UNAVAILABLE and no
protected payload; closure/refusal before an HTTP response can be created is
also valid fail closed. Do not delay teardown or keep a response window merely
to manufacture HTTP 503. Require bounded teardown, both runtime clients closed,
zero remaining owned clients, owned child termination, retained evidence DB
and no replacement/admission. Historical CLOSED_TRANSPORT remains unchanged
and is accepted as E4 PASS by current human evidence review.
This is intentionally a changed generation, never evidence of E3. Only after
confirmed child exit restore the original bytes IF current bytes exactly equal
the controlled changed preimage; unexpected edits -> STOP, never overwrite.
No temporary change is hidden; record before/changed/restored hashes, child exit
and retained DB evidence. No active shared developer app may use this inventory.
Missing safe ownership blocks this test, not permission for another target.
This Design turn performs none of these writes/launches.

E5 — fresh process: after old child exit, launch fresh PID and fresh runId with
unchanged/restored approved source. Full D1/D1a/F8 on NEW child-created handles
must precede provider/runtime publish; old promise/anchor is not transferred.
Retained continuation still requires D2-D4 current lifecycle/credential checks,
including departure/reset/expiry denials; raw/receipt history is unchanged.
Standard Next without owner remains unavailable. Separately prove STOP,
IPC-loss, listener-loss, partial-start failure and bounded clean process exit;
previous forced shutdown is not accepted as clean final evidence.

All five need independent named results, exact final source hashes, commands,
exits/skips and sanitized observations. E1 partial history does not pre-pass E2-E5.
Apply evidence is re-evaluated during formal VERIFY; QA stays a separate later
real-browser stage. Missing/failing case leaves 3.2 PARTIAL, no 3.3+ or Gate 3.

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
