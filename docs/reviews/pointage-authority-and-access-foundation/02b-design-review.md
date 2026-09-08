Change: pointage-authority-and-access-foundation
Gate: 2b — SENSITIVE DESIGN REVIEW
Review status: APPROVED
Created: 2026-09-06T23:17:25.2920339+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — credential/security, authorization, tenancy, personnel/privacy data và cloud migration
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-06T23:28:23.0488680+02:00

# Sensitive Design Gate

## Approved Earlier Gates

| Gate   | Packet                                                                        | Status     | Packet SHA-256                                                     |
| ------ | ----------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| Gate 1 | `docs/reviews/pointage-authority-and-access-foundation/01-analysis-review.md` | `APPROVED` | `0bd04c07e4f1f3967e2155b7b7ed0c0a45194f7f85127f2b31b4c4fd55ebd548` |
| Gate 2 | `docs/reviews/pointage-authority-and-access-foundation/02-specs-review.md`    | `APPROVED` | `6a983e23c34f945389b66550c39e892918ea0a2ea61a870e90dbd65236abe32c` |

Approved artifact path-set và hashes đã được recompute trước Design revision và
khớp các packet đã duyệt.

## Requested Design Corrections Resolved

Sensitive Design review trước nhận current-user decision `CHANGES_REQUIRED`.
Revision này chỉ sửa `design.md`; Proposal, Analysis và cả hai approved delta
Specs giữ nguyên exact bytes.

### Issue 1 — Personnel eligibility nhất quán cho employee operations

- Credential verification chỉ tạo `VerifiedPointageCredential`, không tạo employee authority.
- `pointage.employee.identify` và `pointage.employee.state.read` dùng current business date từ trusted server clock trong establishment timezone.
- `pointage.employee.operation.create` dùng trusted live-evidence business date derive từ cùng server instant.
- Cả ba operations đều require inclusive Personnel employment-period eligibility trước khi tạo `PointageEmployeeContext`.
- Upcoming trước entry và former sau departure fail closed; final departure day vẫn eligible; không historical employee self-service.
- Issue/reset vẫn không gọi lifecycle guard và không tạo Product rule cho upcoming credential issuance.

### Issue 2 — Không có establishment-wide unknown-client fallback

- Repository hiện không có authority chứng minh Backoffice/Vercel client-address provenance.
- Design chọn fail-closed option B với required `TrustedPointageClientAddressProvider`.
- Không production default adapter và không direct trust `Forwarded`, `X-Forwarded-For`, `X-Real-IP` hoặc browser headers.
- Missing/untrusted provider từ chối instantiate/enable credential validation trước credential processing.
- Candidate và client distributed limits vẫn giữ nguyên khi verified provenance tồn tại; không `unknown-client` bucket hoặc candidate-only fallback.

Previous reviewed Design SHA-256:
`635a6c0e894414086955075af6af9bddf8eb07a039bfcb54e7ec50451a6b161f`.

## Reviewed Artifact Integrity

| Path                                                                                                    | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/pointage-authority-and-access-foundation/design.md`                                   | `27537f0287bfec6c5ad6d211e143fdbec6a11ccb0e60fff04ae7dd9c32371dfa` |
| `openspec/changes/pointage-authority-and-access-foundation/specs/authorization/pointage/spec.md`        | `55b550bb449d2fd2c342bb91d328b82c8cc5658252fa460c02de39fcddfd4058` |
| `openspec/changes/pointage-authority-and-access-foundation/specs/pointage/authority-foundation/spec.md` | `3d5dce5f6ed6149655cd29f2fc046b39801e2e3a86376b57abf78cee942cb613` |

Hash command/tool:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <path>
```

Hashes được tính trên exact file bytes, lowercase hexadecimal và sorted theo
repository-relative path.

## Exact Design Content

Path: `openspec/changes/pointage-authority-and-access-foundation/design.md`

````markdown
## Context

Xem [Proposal](proposal.md), [Analysis](analysis.md),
[`pointage/authority-foundation`](specs/pointage/authority-foundation/spec.md) và
[`authorization/pointage`](specs/authorization/pointage/spec.md). Gate 1 và Gate
2 đã được current user duyệt. Design này giải quyết HOW cho authority/access
foundation nhạy cảm; nó không triển khai usable clock-in/clock-out hoặc final UI.

Cloud topology hiện hữu có `apps/backoffice` tại `app.yutapro.fr` và
`@yuta/db-cloud`; tạo app hoặc deployment topology mới không được phép. Backoffice
đã có public route group ngoài authenticated restaurant layout và authenticated
`TenantContext` cho OWNER/MANAGER. `establishments.slug` hiện globally unique;
organization, establishment và Personnel dossier đều có composite ownership
constraints trong cloud schema. Browser input không phải tenant authority.

`@yuta/auth` là portable owner của cryptographic primitives và không được import
persistence, tenant hoặc Next.js. `@yuta/db-cloud` là owner duy nhất của cloud
persistence/repositories. POS PIN thuộc Site Agent/`@yuta/db-pos`; không có code,
state hoặc identity nào từ local boundary được tái sử dụng làm Pointage
authority.

Approved Specs yêu cầu dedicated human-entered credential, non-plaintext durable
state, establishment isolation, issue và reset/regeneration, one-time plaintext
semantics, non-enumerating validation, throttling, explicit grants, Personnel
eligibility và audit attribution. Exact Legal/Privacy retention, deletion,
legal-hold, backup, notice và detailed audit visibility vẫn là production gates,
không phải Design decisions trong change này.

## Goals / Non-Goals

**Goals:**

- Đặt dedicated employee Pointage entry và manager composition trong existing
  `apps/backoffice` cloud runtime mà không tạo app/deployment mới.
- Resolve establishment từ public locator bằng server-owned active-scope lookup;
  locator không mang authorization.
- Định nghĩa exact credential format, generation, protection, lookup,
  collision, reset và one-time presentation behavior.
- Tạo immutable trusted employee/manager Pointage contexts và closed operation
  grant map, không alias POS, Personnel hoặc generic cloud-user authority.
- Persist credential versions, distributed rate-limit state và minimum audit
  attribution trong `@yuta/db-cloud`, luôn có composite tenant/dossier scope.
- Fail closed và non-enumerating cho unknown, wrong-scope, superseded, throttled,
  ineligible hoặc unauthorized requests.
- Giữ raw-evidence model/capture, final UI/API và downstream Pointage workflows
  ngoài implementation foundation hiện tại.

**Non-Goals:**

- Không tạo `apps/pointage`, Vercel project/domain mới, POS/Site Agent/local DB,
  offline queue, cached accepted event hoặc cloud/local synchronization.
- Không tạo final clocking route UI, page pack, manager credential UI,
  employee session UX, raw event kinds/table, work-session projection hoặc
  correction workflow.
- Không tạo global employee identity, cross-establishment credential, dossier
  merge/transfer hoặc browser-controlled tenant context.
- Không tạo standalone credential revoke, suspend, disable hoặc invalidate
  operation. Superseded invalidation chỉ là atomic result của reset/regeneration.
- Không quyết định khi nào upcoming employee được issue credential. Credential
  existence không thay thế employment-period evidence eligibility.
- Không định nghĩa exact legal retention/deletion/anonymization, legal hold,
  backup-retention interaction, employee notice hoặc detailed audit visibility.
- Không promote lifecycle, enable environment/production, sync main Specs hoặc
  archive change.

## Decisions

### D1 — Dùng existing Backoffice cloud application và public establishment slug làm locator

Dedicated employee surface thuộc existing `apps/backoffice` deployment tại
`app.yutapro.fr`, dưới reserved route family `/pointage/[establishmentSlug]`
ngoài `(authenticated)` restaurant layout. Change này chỉ xây server foundation;
route UI và transport handler chưa được tạo.

`establishmentSlug` là untrusted public locator, không phải secret, grant hoặc
tenant authority. Mỗi request tương lai phải gửi locator cho server; server query
`@yuta/db-cloud` join establishment với parent organization và chỉ trả scope khi
cả hai đang active và slug khớp normalized exact lookup. Result gồm đúng
`organizationId`, `establishmentId`, locale và timezone, được freeze thành
server-only `PointageEntryScope`. Unknown, inactive hoặc mismatched parent trả
cùng generic not-found result. Browser không được gửi organizationId hoặc
establishmentId để override result, và scope phải được resolve lại cho mỗi
credential-authenticated request.

Entry scope chỉ chọn credential collision/lookup namespace; nó không identify
employee và không authorize operation. Employee credential validation vẫn bắt
buộc sau resolution. Globally unique existing slug tránh thêm entry-token table,
rotation workflow hoặc capability secret không được Specs authorize.

**Alternative considered:** verified tenant hostname. Bị loại vì restaurant
domains hiện được route tới public Web/Feedback runtimes; đưa chúng tới Backoffice
sẽ đổi deployment topology.

**Alternative considered:** signed/opaque establishment entry token hoặc QR
secret. Bị loại vì cần lifecycle/rotation/manager authority mới và persistence
không được approved Specs yêu cầu.

**Alternative considered:** organization/establishment UUID trong path/form.
Bị loại vì làm browser input dễ bị hiểu sai thành authority và không dùng approved
public-identifier resolution pattern.

### D2 — Credential là tám chữ số được sinh bằng CSPRNG

Canonical credential plaintext là đúng tám ASCII decimal digits (`00000000` tới
`99999999`), không separator và không Unicode digit normalization. Generator dùng
Node `crypto.randomInt(0, 100_000_000)` với zero-padding; entropy space là
`100,000,000`, tương đương khoảng `26.58 bits`. Caller-supplied credential value
không được dùng cho issue/reset.

Tám chữ số cân bằng nhập liệu trên shared tablet/mobile với online-only controls.
Entropy này không đủ nếu đứng một mình, nên D3 và D6 bắt buộc keyed protection,
memory-hard verification và distributed throttling. Format/version được lưu dưới
`credentialFormatVersion = 1`; format khác cần reviewed Design revision.

**Alternative considered:** sáu chữ số. Bị loại vì khoảng 19.93 bits quá nhỏ cho
dedicated cloud credential.

**Alternative considered:** alphanumeric/Base32 dài hơn. Bị loại vì tăng lỗi nhập
trên shared tablet mà không cần thiết khi online rate limit và keyed verifier đều
bắt buộc.

**Alternative considered:** copy POS PIN format/hash. Bị loại vì POS identity,
threat model, persistence và offline runtime là boundary riêng.

### D3 — Keyed lookup digest cộng scrypt verifier; không lưu plaintext

`@yuta/auth` cung cấp pure Pointage credential primitives dùng Node `crypto`:

1. Production secret `POINTAGE_AUTH_SECRET` phải decode thành ít nhất 32 random
   bytes. Server dùng HKDF-SHA-256 với versioned labels riêng để derive lookup,
   verifier-pepper, rate-limit và dummy-verification keys.
2. Lookup digest là
   `HMAC-SHA-256(lookupKey, "v1\0" + organizationId + "\0" + establishmentId + "\0" + credential)`
   và được encode lowercase hex. Scope nằm trong digest input; browser không cung
   cấp trusted IDs.
3. Verifier dùng Node `scrypt` trên credential cộng derived verifier pepper, với
   random 16-byte salt, `N=32768`, `r=8`, `p=1`, output 32 bytes và explicit
   `maxmem=64 MiB`. Durable state lưu algorithm/version, salt và verifier bằng
   base64; comparison dùng `timingSafeEqual`.
4. Plaintext, lookup key, pepper, raw IP, verifier input và dummy material không
   được log, audit hoặc trả từ repository.

Lookup digest cho phép indexed candidate lookup mà không scan toàn establishment;
scrypt verifier giữ defense-in-depth nếu database bị lộ mà runtime secret không
bị lộ. `keyVersion = 1` và `algorithmVersion = scrypt-v1` được persist để một
future reviewed rotation/migration có thể coexist; foundation không tự thiết kế
secret rotation hoặc silently accept unknown versions.

Nếu `POINTAGE_AUTH_SECRET` thiếu/không hợp lệ, Pointage server composition fail
closed và không expose credential operation; phần còn lại của Backoffice không
được fallback sang `AUTH_SECRET`, POS secret hoặc unkeyed hashing.

**Alternative considered:** chỉ HMAC/SHA-256. Bị loại vì eight-digit space có thể
brute-force nhanh khi runtime secret cũng bị compromise.

**Alternative considered:** chỉ salted scrypt và scan active hashes. Bị loại vì
không có indexed non-enumerating lookup và chi phí tăng tuyến tính theo employee.

**Alternative considered:** Argon2 dependency mới. Bị loại vì Node scrypt hiện là
approved repository primitive, đủ cho bounded design và không cần dependency mới.

### D4 — Append-version credential persistence trong `@yuta/db-cloud`

Một additive cloud migration tạo ba Pointage-owned tables; không tạo raw clock
event table.

`pointage_employee_credentials` giữ:

- UUID `id`;
- `organization_id`, `establishment_id`, `personnel_dossier_id`;
- positive `credential_version`;
- `credential_format_version`, `algorithm_version`, `key_version`;
- 64-char lookup digest, salt và verifier;
- `issued_at`, nullable `issued_by_user_id`;
- nullable `superseded_at`, `superseded_by_credential_id` và
  `superseded_by_user_id`.

Composite foreign key
`(organization_id, establishment_id, personnel_dossier_id)` tham chiếu exact
Personnel dossier scope với `ON DELETE RESTRICT`. Composite establishment parent
foreign key cũng được giữ. Database constraints enforce:

- unique `(organization_id, establishment_id, lookup_digest)` trên toàn lịch sử
  để code cũ không được tái sử dụng trong cùng establishment;
- unique active credential cho
  `(organization_id, establishment_id, personnel_dossier_id)` khi
  `superseded_at IS NULL`;
- unique dossier/version;
- superseded fields nhất quán và positive versions.

`pointage_credential_rate_limits` giữ distributed rolling-window state keyed bằng
HMAC digest, không raw IP/credential: scope IDs, key kind `candidate` hoặc
`client`, `key_digest`, `window_started_at`, `failure_count`, nullable
`blocked_until`, `updated_at`; unique scope/kind/digest.

`pointage_security_audit_events` giữ minimum attribution: UUID, scope IDs,
event type, outcome/reason code, nullable manager user ID, nullable Personnel
dossier ID, nullable credential ID/version, nullable requested operation và
timestamp. Nó không có plaintext credential, verifier, lookup digest, IP hash,
raw request payload hoặc Personnel display data. Không có read UI/API hoặc purge
operation trong foundation; absence của purge không được hiểu là keep-forever
policy vì production vẫn blocked bởi Legal/Privacy gates.

Repository surface bị giới hạn ở active establishment resolution, scoped
credential candidate lookup, transactional issue/reset, atomic rate-limit
evaluation/update và append-only audit write. Mọi query chứa organization và
establishment; dossier operations thêm dossier ID. Repository không export rows
như transport contracts.

**Alternative considered:** ghi Pointage credential vào Personnel table. Bị loại
vì Personnel không sở hữu Pointage credential/evidence và sẽ làm mờ module
ownership.

**Alternative considered:** dùng existing cloud user/auth-session tables. Bị loại
vì employee credential không phải YUTA user login hoặc restaurant membership.

**Alternative considered:** in-memory rate limit. Bị loại vì Backoffice cloud
runtime có nhiều/serverless instances và không cung cấp distributed enforcement.

### D5 — Issue và reset/regeneration là atomic commands; plaintext chỉ xuất hiện một lần

Manager command composition luôn bắt đầu từ current validated Backoffice session,
active matching membership và exact Pointage credential-management grant.

`issue` thực hiện trong transaction:

1. authorize exact `pointage.credential.issue`;
2. verify Personnel dossier bằng full trusted scope, không dùng employment period
   làm issuance rule;
3. lock scoped dossier/current credential decision;
4. require chưa có active credential; nếu đã có, trả stable conflict yêu cầu
   reset/regeneration;
5. generate candidate server-side, derive digest/verifier và thử insert; collision
   làm regenerate, tối đa 10 candidates;
6. insert issued audit event trong cùng transaction;
7. sau commit, trả plaintext trong `OneTimePointageCredentialPresentation` đúng
   command result đó.

`reset/regenerate` thực hiện trong một transaction:

1. authorize exact `pointage.credential.reset`;
2. verify và lock full scoped dossier cùng current active credential;
3. generate/insert next credential version với collision retry như issue;
4. update exactly locked prior row với `superseded_at`, new credential ID và actor;
5. append `reset` và resulting `superseded` audit attribution;
6. commit atomically, rồi trả new plaintext one time.

Nếu không có current credential, reset trả stable conflict; nó không silently
become issue. Nếu collision xảy ra 10 lần hoặc transaction/audit write thất bại,
toàn command rollback và không trả plaintext. Concurrent issue/reset dùng row
locks và unique constraints; tối đa một command tạo current version.

Plaintext one-time semantics nghĩa là secret chỉ sống trong server command memory
và success result sau commit; response tương lai phải dùng `Cache-Control:
no-store`, không analytics/logging và không được persist trong cookie/localStorage.
Repository reads không bao giờ trả plaintext. Nếu presentation bị đóng/mất, manager
phải chạy reset/regeneration; không có retrieve-current-secret operation.

Issue không đọc entry/departure để quyết định upcoming/former issuance. Điều này
không tạo Product rule về thời điểm phát credential: foundation chỉ xác nhận
correctly scoped dossier; user-visible availability/policy chưa được triển khai.
Credential existence hoặc successful issue không tạo evidence eligibility.

Không có standalone invalidate/revoke/suspend method, grant, command hoặc audit
action. `superseded` chỉ có thể được ghi như result trong successful reset
transaction.

### D6 — Collision và non-enumerating authentication failure

Collision được đánh giá trong trusted establishment namespace qua unique digest
constraint. Generator retry tối đa 10 lần; exhausted retry trả generic transient
failure và không commit partial credential/audit state. Historical digest vẫn
tham gia uniqueness nên superseded code không được tái sử dụng trong cùng
establishment.

Credential validation order:

1. resolve trusted `PointageEntryScope` từ slug;
2. require verified client address từ injected
   `TrustedPointageClientAddressProvider`; missing/untrusted provenance dừng bằng
   generic unavailable trước khi credential normalization/lookup;
3. normalize/validate tám ASCII digits without revealing format detail;
4. apply client-scope rate limit;
5. compute scoped lookup digest và apply candidate rate limit;
6. query exact scope + digest;
7. nếu không có row, wrong scope, unsupported version hoặc superseded row, chạy
   exactly one scrypt dummy verification với deterministic server-derived dummy
   salt/verifier;
8. nếu có current row, chạy exactly one real scrypt verification và constant-time
   compare;
9. failure trả cùng public `POINTAGE_CREDENTIAL_INVALID` response; cryptographic
   success chỉ tạo server-only `VerifiedPointageCredential`, chưa tạo employee
   authority, và records successful credential-validation outcome;
10. D10 phải xác nhận Personnel eligibility cho exact requested employee operation
    trước khi D8 có thể tạo `PointageEmployeeContext`.

Wrong establishment, unknown credential và superseded credential không khác HTTP
status/body/schema. Internal audit reason có thể khác nhưng không được trả ra
browser. Invalid format cũng đi qua dummy verification sau rate-limit check để
không tạo cheap enumeration path. Rate-limit response là generic
`POINTAGE_TRY_LATER` và không nói candidate có tồn tại.

Foundation không tạo browser-visible employee session/token. Credential được
validate trong cùng server request nhưng validation result chỉ là identity proof;
Personnel eligibility và exact operation authorization vẫn phải pass trước khi
employee context tồn tại. Plaintext không được echo hoặc cache. Một future
multi-request session UX cần separate approved Design revision, không được ngầm
thêm trong Apply này.

### D7 — Distributed throttling có hai independent keys

Rate-limit key material dùng dedicated HKDF-derived rate key:

- candidate key = HMAC của trusted scope + normalized credential;
- client key = HMAC của trusted scope + verified server-trusted client address.

Current repository không có adapter hoặc deployment contract chứng minh client
address nào từ Backoffice/Vercel là server-trusted. Vì vậy Design chọn fail-closed
option B: Pointage credential validator bắt buộc được inject một
`TrustedPointageClientAddressProvider`; foundation không cung cấp production
default implementation và không đọc trực tiếp `Forwarded`, `X-Forwarded-For`,
`X-Real-IP` hay browser-supplied header.

Provider chỉ được cấu hình khi một separately reviewed deployment authority xác
lập exact trusted proxy/platform source, header-chain validation, normalization và
spoofing tests. Nếu provider thiếu, trả null hoặc không chứng minh provenance,
Pointage credential validation MUST refuse initialization/enablement hoặc trả
generic unavailable trước khi xử lý credential. Không tạo `unknown-client`,
shared establishment bucket hoặc candidate-only fallback.

Exact policy:

- candidate: 5 failed attempts trong rolling 15 minutes → block candidate 15
  minutes;
- client/scope: 30 failed attempts trong rolling 15 minutes → block client/scope
  15 minutes;
- successful validation resets candidate failure state; nó không xóa client
  failure history;
- blocked evaluation và failure update là atomic database operations;
- issue/reset không reset rate-limit state của superseded code; new random code có
  candidate key riêng.

Rate rows hết hiệu lực không còn ảnh hưởng quyết định nhưng không bị delete trong
foundation. Exact data deletion/retention job chờ Legal/Privacy approval. Tests
dùng injected clock; production thresholds không configurable từ browser và
invalid environment overrides fail closed.

Tests có thể inject deterministic trusted-address provider; production composition
không được dùng test provider. Candidate và client distributed limiters chỉ chạy
khi verified client provenance đã tồn tại.

**Alternative considered:** candidate-only limiter. Bị loại vì attacker có thể
xoay vòng code guesses.

**Alternative considered:** client-only limiter. Bị loại vì shared/NAT client có
thể gây denial rộng và không bảo vệ riêng một employee credential.

### D8 — Hai immutable actor contexts, không merge authority

Server composition tạo hai discriminated readonly contexts:

```text
PointageEmployeeContext
  actorType: POINTAGE_EMPLOYEE
  organizationId
  establishmentId
  personnelDossierId
  credentialId
  credentialVersion
  operation

PointageManagerContext
  actorType: POINTAGE_MANAGER
  organizationId
  establishmentId
  userId
  membershipId
  role: OWNER | MANAGER
  operation
```

Employee context chỉ được factory nội bộ tạo sau active establishment resolution,
current credential verification, D10 Personnel eligibility cho exact requested
employee operation và exact operation authorization. Credential verification
alone chỉ tạo `VerifiedPointageCredential` và MUST NOT tạo
`PointageEmployeeContext`. Employee context không extend `TenantContext`, không có
membership/role/entitlement và không serialize ra browser. Manager context chỉ
được tạo từ existing validated `TenantContext` với active matching establishment
membership và exact grant. STAFF, public, service hoặc unsupported actors bị
deny.

Mỗi context bind một exact operation; caller không thể reuse result cho operation
khác. Resource repositories vẫn recheck organization + establishment + dossier
scope. Không có fallback hoặc union context cho phép employee credential,
Personnel permission, manager membership hoặc POS identity bổ sung quyền lẫn
nhau.

Placement:

- portable generation/hash/verify primitives trong capability-specific
  `@yuta/auth` module;
- Pointage operations, grants, immutable context factories và server composition
  trong `apps/backoffice/src/server/pointage`;
- persistence adapters trong `@yuta/db-cloud`;
- không thêm `@yuta/contracts` transport schema vì foundation không tạo UI/API,
  event hoặc process boundary. Khi một approved consumer xuất hiện, transport
  schemas phải được thêm riêng trước khi browser data crossing xảy ra.

### D9 — Closed Pointage operation catalog và explicit grants

Concrete operations:

| Operation                            | Actor/grant                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `pointage.employee.identify`         | verified credential + current Personnel eligibility, own dossier only                                 |
| `pointage.employee.state.read`       | verified credential + current Personnel eligibility, own dossier only                                 |
| `pointage.employee.operation.create` | verified credential + Personnel eligibility for trusted live evidence business date, own dossier only |
| `pointage.establishment.read`        | active matching `OWNER` và `MANAGER`                                                                  |
| `pointage.credential.issue`          | active matching `OWNER` và `MANAGER`                                                                  |
| `pointage.credential.reset`          | active matching `OWNER` và `MANAGER`                                                                  |

STAFF được grant none trong catalog này. Không wildcard, prefix match,
inheritance, `pointage.*`, caller-provided grants hoặc implicit mapping từ
Personnel permissions. Cả ba employee operations đều fail closed nếu Personnel
eligibility không pass; verified credential alone không phải employee authority.
`pointage.employee.operation.create` chỉ là authorization semantic prerequisite;
foundation không định nghĩa clock-in/out event kinds hoặc raw event persistence.

Không có `pointage.credential.invalidate`, `revoke`, `suspend`, plaintext read,
raw-evidence overwrite/delete, Planning write-back hoặc global employee
operation. Unknown operation fail closed.

OWNER/MANAGER credential-management grants được giới hạn vào existing active
establishment context. They do not provide Personnel mutation authority hoặc
credential access ở establishment khác. One-time plaintext command result không
là permanent read grant.

**Alternative considered:** reuse `personnel.employee.manage`. Bị loại vì Specs
yêu cầu Pointage authority độc lập.

**Alternative considered:** grant STAFF credential management hoặc
establishment read. Bị loại vì approved initial intent chỉ cho OWNER/MANAGER
establishment-wide scope.

### D10 — Personnel eligibility bắt buộc cho từng employee operation

Pointage repository/service đọc Personnel dossier bằng exact trusted
organization + establishment + dossier scope. Sau credential verification nhưng
trước actor-context creation, authorization phải chạy eligibility guard riêng cho
exact requested employee operation.

Với `pointage.employee.identify` và `pointage.employee.state.read`, guard dùng
current business date từ server clock trong trusted establishment timezone. Với
`pointage.employee.operation.create`, guard dùng trusted live-evidence business
date được derive từ cùng server instant; browser không được chọn hoặc backdate.
Mọi guard so sánh inclusive với Personnel `entryDate`/`departureDate`:

- date trước entry: deny;
- entry ≤ date và chưa có departure: eligible;
- entry ≤ date ≤ departure: eligible, gồm final departure day;
- date sau departure: deny.

Browser date, credential issue time, credential validity hoặc UI label không
được dùng làm eligibility proof. Upcoming employee trước entry và former employee
sau departure không được tạo employee context cho identify, current-state read
hoặc own operation; final departure day vẫn eligible cho cả ba. Foundation không
cung cấp historical former-employee self-service.

Guard trả internal reason nhưng public employee credential flow dùng cùng
non-disclosing failure contract và không tiết lộ whether credential was valid,
dossier lifecycle state hoặc employee existence. Không eligibility result nghĩa
là không partial `PointageEmployeeContext` và không employee authority.

Issue/reset chỉ verify dossier scope/existence và không gọi eligibility guard.
Vì vậy upcoming credential issuance policy không được quyết định. Credential có
thể tồn tại như durable state mà không tạo employee authority; mọi employee
operation vẫn phải pass current applicable Personnel eligibility trong cùng
request.

### D11 — Bounded audit taxonomy, không quyết định visibility hoặc retention

Closed event types:

- `pointage.credential.issued`;
- `pointage.credential.reset`;
- `pointage.credential.superseded` — chỉ cùng successful reset transaction;
- `pointage.credential.authentication_succeeded`;
- `pointage.credential.authentication_denied`;
- `pointage.credential.rate_limited`;
- `pointage.authorization.denied`;
- `pointage.evidence_eligibility.denied`.

Stable internal reason codes bị giới hạn ở `invalid_credential`,
`superseded_credential`, `unsupported_version`, `rate_limited`,
`scope_not_resolved`, `client_address_untrusted`, `operation_not_granted`,
`dossier_not_in_scope`, `before_entry` và `after_departure`. Public response
mapping vẫn non-enumerating; internal reason không xuất ra browser.

Credential lifecycle success events có manager user ID, scoped dossier,
credential ID/version, exact action và outcome. Employee auth success chỉ có
dossier/credential attribution sau successful resolution. Unknown credential
denial không gán employee ID. Không event nào chứa code, hash/verifier, lookup
digest, salt, IP/client digest, display name hoặc arbitrary metadata.

Table là write-only từ foundation: không audit reader, retention cleanup,
employee/manager visibility hoặc legal-evidence projection. Exact retention,
deletion/anonymization, legal hold, backup behavior, notice và detailed audit
visibility tiếp tục block production và không được suy ra từ event taxonomy.

### D12 — Raw evidence và cloud/local boundary vẫn deliberately absent

Foundation chỉ tạo credential/authorization/lifecycle guard. Không raw Pointage
event table, session/total projection, event capture action hoặc correction store
được thêm. Immutable raw-evidence requirement được giữ bằng closed operation map:
không có overwrite/delete operation; future raw-capture change phải dùng
append-only storage và quay qua workflow riêng.

Mọi module chạy trên existing cloud Backoffice + db-cloud boundary. Không import
`@yuta/db-pos`, gọi Site Agent, dùng localStorage/IndexedDB làm accepted state,
enqueue offline event hoặc sync. Cloud/database unavailable trả generic transient
failure; request không được accepted locally và không có later replay.

### D13 — Verification boundaries cho Sensitive implementation

Focused evidence sau future approved Apply phải chứng minh:

- exact format/entropy, HKDF separation, scrypt parameters, constant-time verify,
  no secret logging và dummy verification;
- collision retry/exhaustion, historical non-reuse và concurrent issue/reset;
- atomic supersede + audit, old credential denial và no standalone invalidation;
- one-time result, no repository plaintext retrieval và failure-before-commit
  returns no secret;
- two-key distributed rate limits với injected clock và generic public errors;
- missing trusted-address provider/refused provenance fail-closed trước credential
  processing; arbitrary forwarded headers và shared unknown-client bucket không
  được dùng;
- slug resolution active-parent checks, wrong organization/establishment/dossier
  denial và resource-ID-alone prohibition;
- exact operation catalog/grant matrix, employee self-only context, STAFF deny,
  no Personnel/POS/cloud-user authority alias;
- upcoming/active/final-day/former eligibility cho từng employee identify,
  state-read và own-operation path, cùng proof rằng credential verification alone
  không tạo context và issue không gọi employment-period guard;
- audit allowlist/minimization và no audit visibility/read API;
- db-cloud generated migration, constraints, transactional repository tests và
  absence of raw-evidence/local/sync dependencies.

`UI_AFFECTING: NO`; không có Browser QA hoặc screenshot claim trong foundation.
Technical tests không được claim production readiness hoặc giải quyết Legal /
Privacy gates.

## Risks / Trade-offs

- **[Risk] Tám chữ số có entropy hữu hạn** → CSPRNG 26.58-bit space, keyed
  scrypt verifier, historical non-reuse và distributed candidate/client limits.
- **[Risk] Lookup digest tạo fast equality oracle nếu runtime secret bị lộ cùng DB**
  → dedicated 32-byte secret, HKDF separation, restricted server environment và
  independent scrypt verifier; secret/hash không log.
- **[Risk] Public slug bị enumeration** → slug chỉ là locator; active lookup trả
  không Personnel data và mọi employee operation vẫn cần credential. Unknown /
  inactive scope dùng generic response.
- **[Risk] Shared restaurant/NAT IP gây broad lockout** → client threshold cao hơn
  candidate threshold và candidate limiter vẫn độc lập; chỉ verified
  server-trusted address được dùng, không shared unknown-establishment fallback.
- **[Risk] Vercel/client-address provenance chưa có repository authority** → không
  instantiate/enable Pointage credential validation ở deployment đó; future
  provider cần separately reviewed proxy trust contract và spoofing evidence.
- **[Risk] Timing khác nhau tiết lộ candidate existence** → exactly one real hoặc
  dummy scrypt path, constant-time comparison và identical invalid response.
- **[Risk] Concurrent reset để lại hai current credentials** → row lock,
  transaction, partial unique current constraint và atomic supersede/audit.
- **[Risk] One-time secret bị mất trước giao nhận** → không retrieval; manager dùng
  reset/regeneration, làm previous credential invalid atomically.
- **[Risk] Issue được hiểu là evidence eligibility** → issue không gọi Personnel
  eligibility guard; every employee operation calls applicable eligibility guard
  after credential verification and before context creation.
- **[Risk] Former employee giữ credential còn cryptographically valid** → verifier
  success chỉ tạo identity proof; identify/state/create đều deny without current
  Personnel eligibility và không có historical self-service fallback.
- **[Risk] OWNER/MANAGER Pointage grants bị dùng như Personnel authority** → closed
  operation types, exact context, repository scope checks và no alias tests.
- **[Risk] Audit table bị hiểu là approved legal retention/history** → no reader,
  no retention claim, explicit production blockers và no lifecycle promotion.
- **[Risk] `POINTAGE_AUTH_SECRET` rotation làm credentials unavailable** → persist
  key/algorithm versions và fail closed; rotation cần reviewed future procedure,
  không silently fallback/re-hash.
- **[Trade-off] Foundation persist credential/security state nhưng chưa có final UI**
  → chấp nhận như prerequisite testable boundary; no route consumer hoặc
  production enablement trước later approved change.

## Migration Plan

Sau explicit Sensitive Design Gate approval, future Apply may execute only the
following additive migration approach; Design approval itself performs nothing:

1. Generate the next journaled `@yuta/db-cloud` migration from reviewed schema
   definitions for the three Pointage tables and all composite FKs, checks,
   indexes and partial uniqueness constraints.
2. Review generated SQL; apply first to disposable cloud integration database;
   prove clean migration and repository isolation/concurrency tests. Không seed,
   credential backfill, Personnel mutation hoặc raw-event row.
3. Add auth primitives, db-cloud repository and Backoffice server composition
   behind absent-consumer fail-closed boundary. `POINTAGE_AUTH_SECRET` is required
   only when Pointage server composition is instantiated; a reviewed
   `TrustedPointageClientAddressProvider` is additionally required for credential
   validation. Missing either dependency refuses Pointage composition with no
   fallback secret, forwarded header or unknown-client bucket.
4. Deploy database migration before any separately approved Pointage consumer.
   Foundation does not enable a route, environment or production capability.

Migration failure MUST rollback transactionally and leave no partial tables or
credential. Application failure after schema deployment leaves additive unused
tables and no consumer. Application rollback removes/turns off only the bounded
server code while retaining additive tables and credentials; it MUST NOT drop
data, restore superseded credentials or fallback to POS/Personnel/cloud-user auth.

Production down-migration is not part of rollback because dropping credential,
rate-limit or audit state would be destructive and conflict with unresolved
retention/legal-hold rules. Any future removal requires separate approved
retention/legal migration. In a disposable pre-production database only, the
generated down path may drop the three new tables after exact-target verification.

Secret absence, missing/untrusted client-address provenance, unsupported
key/algorithm version, database outage, collision exhaustion, lock conflict hoặc
audit write failure all fail closed. Issue/reset returns no plaintext before
successful commit. No failure creates local accepted state or queues sync/replay.

## Open Questions

Không còn technical/security question nào cần quyết định trước Tasks. Các mục
sau cố ý không phải Open Questions của implementation foundation và tiếp tục là
separate Legal/Privacy production gates:

- exact retention duration;
- deletion/anonymization execution;
- legal hold;
- backup-retention interaction;
- employee notice wording;
- detailed audit visibility.

Stop-condition assessment:

- existing `apps/backoffice`/`@yuta/db-cloud` topology được giữ nguyên;
- không POS, Site Agent, local persistence, offline hoặc sync fallback;
- không global employee identity hoặc browser-supplied tenant authority;
- không standalone credential revoke/suspend/invalidate operation;
- không Product rule cho upcoming credential issuance;
- employee identify/state/create đều require applicable current Personnel
  eligibility; credential validity alone không tạo employee authority;
- deployment không có trusted client-address provider không thể enable/instantiate
  credential validation và không có unknown-client fallback;
- không destructive raw-evidence mutation;
- không Product/authority decision ngoài approved Specs.

Sensitive Design Gate: `REQUIRED`, `AWAITING_HUMAN_REVIEW`. Không tạo Tasks,
Implementation Plan, Technical Implementation Contract hoặc implementation trước
explicit approval.
````

## Security, Data and Runtime Implications

- **Runtime/entry:** existing `apps/backoffice` tại `app.yutapro.fr`; reserved `/pointage/[establishmentSlug]`; slug chỉ là locator và server re-resolves active scope. Không app/domain/deployment mới.
- **Credential:** tám ASCII digits, CSPRNG khoảng 26.58 bits, server-generated only.
- **Protection:** dedicated 32-byte `POINTAGE_AUTH_SECRET`; HKDF-separated keys; scoped HMAC lookup; salted+peppered scrypt `N=32768, r=8, p=1`; constant-time comparison.
- **Employee authority:** verifier success chỉ tạo identity proof. Identify, current-state read và own-operation đều cần applicable Personnel eligibility trước immutable employee context.
- **Lifecycle:** upcoming trước entry và former sau departure không có employee authority; final departure day eligible. Không historical self-service và không issuance rule theo employment state.
- **Client provenance:** no trusted Backoffice/Vercel source exists in current repository authority. Required provider absence/mismatch refuses Pointage validation; forwarded/browser headers và shared unknown-client bucket bị cấm.
- **Rate limiting:** candidate 5 failures/15 minutes và verified-client/scope 30 failures/15 minutes, block 15 minutes; distributed db-cloud state và generic responses.
- **Credential lifecycle:** atomic issue và reset/regeneration only; successful reset atomically supersedes old credential. Không standalone revoke/suspend/invalidate.
- **Plaintext:** one post-commit result only; no log, persistence, cache hoặc retrieval.
- **Authorization:** closed six-operation catalog; OWNER/MANAGER grants giữ nguyên; STAFF none; no Personnel/POS/cloud-user alias.
- **Isolation:** all data paths require trusted organization + establishment; dossier paths add Personnel dossier ID/composite FK.
- **Persistence/audit:** three additive db-cloud tables; minimized write-only audit taxonomy; không retention/read visibility/legal-evidence decision.
- **Cloud/local:** cloud/online only; no POS, Site Agent, db-pos, offline accepted state, replay hoặc sync.
- **UI:** `UI_AFFECTING: NO`; không final route UI, manager UI, interaction hoặc Browser QA.

## Migration and Rollback Assessment

- Additive next journaled db-cloud migration; no seed, backfill, Personnel mutation hoặc raw evidence table.
- Migration and issue/reset transactions fail atomically; plaintext is returned only after successful commit.
- Pointage composition requires valid `POINTAGE_AUTH_SECRET`; credential validation additionally requires separately reviewed trusted-address provider.
- Missing/untrusted address provenance refuses enablement/instantiation with no forwarded-header, unknown-client or candidate-only fallback.
- Application rollback retains additive state and disables bounded composition; it does not restore superseded credentials.
- Production rollback does not drop tables because retention/legal-hold decisions remain unresolved; disposable down path requires exact-target verification.
- All cloud/database/configuration failures remain fail closed with no local queue, replay or sync.

## Unresolved Choices and Preserved Gates

Không còn technical/security choice cần quyết định trước Tasks. Client-address
provenance is resolved fail closed for current topology: production validation
cannot be enabled until separately reviewed platform trust evidence exists.

Các Legal/Privacy decisions sau tiếp tục unresolved và block production:

- exact retention duration;
- deletion/anonymization execution;
- legal hold;
- backup-retention interaction;
- employee notice wording;
- detailed audit visibility.

Không có standalone revoke/suspend, upcoming issuance rule, new runtime/app, local
persistence, global employee identity, browser tenant authority hoặc destructive
raw-evidence mutation.

## Validation

```text
openspec validate "pointage-authority-and-access-foundation" --type change --strict --json --no-interactive
PASS — one change passed, zero failed, zero issues.

pnpm docs:check
PASS — 36 current documents are consistent.

pnpm architecture:check
PASS — runtime imports, database URLs, client boundaries and migration baselines are valid.

pnpm -r --if-present typecheck
PASS — all 15 participating workspace projects passed.

pnpm exec prettier --write "openspec/changes/pointage-authority-and-access-foundation/design.md" "docs/reviews/pointage-authority-and-access-foundation/02b-design-review.md"
PASS — both reviewed files use Prettier code style.
```

## Provenance and Scope Isolation

- Baseline HEAD remains `defbc50eba3952fa2e7b1c016637daf083b18c65`.
- Pre-existing unrelated work remains outside this change and was not modified.
- Current revision changes only `design.md` and regenerates this review packet.
- Proposal, Analysis, both Specs and their approved hashes remain unchanged.
- Không `tasks.md`, Implementation Plan, Technical Implementation Contract, implementation, migration, sync/archive, lifecycle/readiness promotion hoặc deployment action đã được tạo/chạy.

## Recommendation

`APPROVE_SENSITIVE_DESIGN_GATE_TO_PROCEED_TO_TASKS`

Exact approval needed next:

```text
$yuta-run-change pointage-authority-and-access-foundation
Sensitive Design approved. Continue to Tasks and implementation planning only.
```
