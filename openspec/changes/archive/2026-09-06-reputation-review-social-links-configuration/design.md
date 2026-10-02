## Context

Xem [proposal.md](proposal.md) để biết động cơ và
[delta Spec](specs/reputation/review-social-links-configuration/spec.md) để biết
hợp đồng hành vi đã được duyệt. Design này chỉ mô tả cách triển khai capability
`reputation/review-social-links-configuration` trên các boundary hiện có:

- `reputation_settings` đã có đúng ba cột nullable `google_review_url`,
  `facebook_review_url`, `instagram_url`, khóa duy nhất theo organization và
  establishment, cùng `created_at`/`updated_at`;
- `reputation_audit_events` đã có `SETTINGS`, actor, organization, entity,
  metadata và timestamp;
- Backoffice đã có route `/visibilite-reputation/satisfaction`, trusted session,
  `reputation.read` và OWNER-only `reputation.settings.manage`;
- feedback-web đã đọc settings bằng trusted public organization + establishment
  và hiện trả `notFound()` khi settings row không tồn tại hoặc public feedback
  không enabled;
- Google Business Profile connector không ghi ba link này;
- chưa có stable page pack cho Satisfaction/Reputation.

`updatedAt` hiện do Drizzle `$onUpdateFn(() => new Date())` quản lý. Nó không có
contract compare-and-swap, dùng độ phân giải `Date` của JavaScript và còn phản
ánh thay đổi của các settings field khác. Vì vậy Design không coi `updatedAt`
đơn lẻ, hoặc snapshot ba giá trị đơn lẻ, là bằng chứng đủ cho concurrency/ABA.

Change đồng thời `feedback-public-trusted-boundary-hardening` sở hữu trusted
hostname và production client-identity boundary, đồng thời loại trừ external
review URL/settings. Hai change không đổi authority của nhau; nếu bytes ở một
file chung drift trước Apply thì phải reconcile theo current approved artifacts
thay vì overwrite.

## Goals / Non-Goals

**Goals:**

- Tạo một provider policy dùng chung, typed và fail-closed cho ba URL.
- Đọc và ghi đúng settings row theo trusted organization + active
  establishment, với OWNER-only settings authority.
- Thực hiện explicit Save nguyên tử, chống silent last-write-wins, nhận diện
  equivalent replay và phát hiện ABA mà không thêm schema.
- Ghi đúng một audit `SETTINGS` cho mỗi real mutation và không ghi dữ liệu bị
  reject hoặc dữ liệu nội bộ ngoài phạm vi.
- Làm public projection ẩn stored legacy URL không còn an toàn.
- Thiết kế đầy đủ UI states và page-pack prerequisite cho route hiện có.

**Non-Goals:**

- Không tạo/upsert/provision `reputation_settings`, không suy ra `brandVoice`,
  `publicFeedbackSlug` hoặc field Reputation khác.
- Không thêm permission, schema, migration, revision/receipt/request-id table,
  provider registry hoặc generic social-link engine.
- Không thay đổi Google/Facebook/Instagram OAuth, GBP location selection,
  provider calls, redirects, review import, social publishing, AI, analytics
  hoặc QR.
- Không tạo route/navigation mới và không đổi POS, Site Agent, Display,
  Personnel hoặc Establishment ownership.
- Không định nghĩa retention cleanup, production provisioning, production
  rollout hoặc deployment.

## Decisions

### D1 — Giữ Reputation là owner và dùng các runtime boundary hiện có

`@yuta/db-cloud` sở hữu read/mutation/audit. Backoffice là private writer qua
route Satisfaction hiện có. feedback-web chỉ nhận safe public projection.
`@yuta/contracts/reputation` sở hữu serialization-safe input/output và pure URL
policy dùng chung. Không package hoặc runtime mới được tạo.

Mọi private repository query dùng cả `organizationId` và `establishmentId` từ
trusted `TenantContext`; lookup bằng settings ID đơn lẻ bị cấm. Public read giữ
server-resolved `PublicTenantContext`. Browser không gửi scope có authority.

**Alternatives considered:** chuyển fields sang Establishment/Integrations hoặc
tạo generic link service bị loại vì làm đổi canonical owner và vượt scope.

### D2 — Một pure provider policy làm nguồn kỹ thuật duy nhất

`@yuta/contracts/reputation` sẽ cung cấp ba schema/helper typed, cùng một helper
projection fail-closed. Mỗi non-null input được xử lý theo thứ tự:

1. trim outer whitespace; blank trở thành `null`;
2. giới hạn 2048 JavaScript application string units theo convention Zod hiện
   có;
3. parse bằng `URL`, yêu cầu protocol chính xác `https:`;
4. yêu cầu `username === ''` và `password === ''`;
5. so khớp `URL.hostname` đã parse với allowlist chính xác;
6. áp dụng path rule chính xác, case-sensitive;
7. persist/return chuỗi đã trim, không serialize lại bằng `URL` và không đổi
   path/query/fragment semantics.

Allowlist:

| Provider  | Exact host                                                    | Path rule                    |
| --------- | ------------------------------------------------------------- | ---------------------------- |
| Google    | `g.page`, `maps.app.goo.gl`                                   | Không thêm path restriction  |
| Google    | `google.com`, `www.google.com`, `google.fr`, `www.google.fr`  | Bắt đầu `/maps/`             |
| Google    | `search.google.com`                                           | Bắt đầu `/local/writereview` |
| Facebook  | `facebook.com`, `www.facebook.com`, `m.facebook.com`, `fb.me` | Không thêm path restriction  |
| Instagram | `instagram.com`, `www.instagram.com`                          | Không thêm path restriction  |

Không wildcard/dot-bound fallback. `mail.google.com`, `accounts.google.com`,
`docs.google.com`, `maps.google.com`, unlisted subdomains, lookalikes và generic
shorteners đều bị reject. Helper không gọi mạng hoặc follow redirect.

Private Save dùng strict mutation schema chứa đúng ba proposed values, ba
expected normalized values và một opaque state token. Extra provider/status
keys bị reject. Public projection dùng cùng policy theo chế độ safe-parse:
invalid stored legacy value trở thành `null`, không sửa database.

**Alternatives considered:** validator riêng ở từng app bị loại vì dễ drift;
URL canonicalization bị loại vì có thể đổi destination semantics.

### D3 — Private read phân biệt authorization, missing row và integrity failure

Backoffice composition giữ thứ tự hiện có:

```text
authenticated session
→ verified active membership
→ trusted organization
→ required active establishment
→ reputation entitlement + reputation.read
→ reputation.settings.manage
→ scoped settings read
```

Chỉ OWNER vượt qua `reputation.settings.manage`. MANAGER/STAFF vẫn được dùng base
Satisfaction inbox theo `reputation.read`, nhưng settings section không được load
hoặc render. Public/service/system actor không có restaurant membership phù hợp
không bypass. Auth/tenant errors tiếp tục dùng cơ chế hiện tại và không bị map
thành configuration unavailable.

Private settings read chạy trong một short `REPEATABLE READ` transaction để
settings row và hai audit markers mới nhất thuộc cùng database snapshot.

- Có row và state evidence hợp lệ: trả ba normalized authoritative values cùng
  opaque `stateToken`.
- Không có exact scoped row: trả `CONFIGURATION_UNAVAILABLE`; không synthesize,
  create, upsert, audit hoặc đọc row khác.
- Có row nhưng state evidence dành cho capability bị malformed/ambiguous: trả
  generic `SERVER_ERROR` và fail closed cho Save; không lộ audit internals.

Provisioning vẫn là capability riêng. Reload chỉ quan sát row nếu một flow được
duyệt khác đã tạo nó.

### D4 — Dùng audit marker hiện có làm opaque state token, không dùng timestamp làm revision

Mỗi real social-link mutation tạo một audit event có action versioned riêng:

```text
settings.review-social-links.updated.v1
```

`stateToken` không được persist. Server tính SHA-256 trên canonical tuple:

```text
[
  "review-social-links-state",
  1,
  internalSettingsRowId,
  latestQualifiedAuditEventIdOrNull,
  googleReviewUrlOrNull,
  facebookReviewUrlOrNull,
  instagramUrlOrNull
]
```

Tuple dùng fixed positional JSON/UTF-8 encoding; không object-key ordering tùy
ý. Browser chỉ nhận lowercase 64-hex digest, không nhận settings ID, audit ID,
timestamp nội bộ hoặc raw metadata. Token là concurrency evidence, không phải
authorization. Token giả/malformed không cấp quyền và chỉ dẫn tới no-change an
toàn hoặc conflict/fail-closed.

`actorUserId` không nằm trong canonical tuple và không tham gia state-token
validity. Schema hiện cho phép actor trở thành `null` khi user bị xóa qua FK
`ON DELETE SET NULL`; lifecycle được hỗ trợ này không làm thay đổi settings
state, audit event ID hoặc token của một state vốn không đổi. Actor chỉ được
dùng ở bước chứng minh D1 same-actor replay tại D6.

State token giải quyết hai thiếu sót:

- value snapshot phát hiện current-value drift nhưng không phát hiện A→B→A;
- `updatedAt` không đủ vì shared row, JavaScript millisecond behavior và không
  có monotonic/version contract.

Audit ID là durable marker mới sau mỗi real mutation đã bắt buộc bởi Spec. Vì
marker nằm trong audit row hiện có, Design không thêm durable state. Audit event
được lấy theo exact organization, entity type `SETTINGS`, settings entity ID và
exact action. Unknown action không tham gia token. Event khớp action nhưng
metadata invalid làm private concurrency path fail closed.

State evidence được phân loại chính xác:

| State evidence                         | Ý nghĩa và hành vi                                                                                                                                                                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BASELINE_NO_EVENT`                    | Không có qualified event và current repository evidence không chứng minh từng có qualified history. Đây là baseline hợp lệ; token dùng settings row identity, marker `null` và ba current values.                                                        |
| `EVENT_PRESENT_VALID`                  | Có qualified event; strict scope/action/metadata/state reconstruction thành công. Event được dùng cho token/predecessor/ABA dù `actorUserId` còn active hay đã thành `null`; replay attribution được đánh giá riêng ở D6.                                |
| `EVENT_PRESENT_MALFORMED_OR_AMBIGUOUS` | Có matching event nhưng strict parse hoặc newest/previous reconstruction thất bại. Trả `SERVER_ERROR`, không write/audit.                                                                                                                                |
| `ALL_HISTORY_EXTERNALLY_DELETED`       | Toàn bộ qualified events từng tồn tại đã bị xóa ngoài supported capability lifecycle. Current durable state không phân biệt được trường hợp này với `BASELINE_NO_EVENT`; runtime **không** claim tự phát hiện. Đây là `UNSUPPORTED_INTEGRITY_VIOLATION`. |

Do đó fail-closed runtime chỉ áp dụng khi malformed/ambiguous/mismatched evidence
còn quan sát được. Việc xóa toàn bộ history không được mô tả sai thành một lỗi
có thể luôn tự động phát hiện.

Một `actorUserId === null` do FK lifecycle đã biết không phải malformed hoặc
ambiguous state evidence. Private read/Save không được fail chỉ vì actor đã bị
nullify; các checks về organization, entity, action/version, establishment,
ordered deltas, previous/new values và event/state reconstruction vẫn phải
strict và fail closed như cũ.

Để newest/previous event có thứ tự xác định, mutation lấy row lock trước rồi gán
`createdAt` của audit mới là millisecond-aligned instant lớn hơn cả clock hiện
tại và qualified event trước ít nhất 1 ms. PostgreSQL `timestamp with time zone`
giữ được millisecond-aligned instant này. `updatedAt` của settings được set cùng
instant cho real mutation nhưng chỉ là timestamp quan sát/phòng vệ, không phải
nguồn quyết định concurrency. Row lock serialize mọi repository-supported
writer của ba link; một writer mới không dùng cùng repository path là stop
condition cho design sau này.

**Alternatives considered:** expected values only và values+`updatedAt` bị loại
do ABA/precision; `xmin` bị loại vì không phải durable application contract;
revision column hoặc receipt table bị loại vì cần migration ngoài authority;
HMAC/request ID bị loại vì cần secret/identity contract mới mà Spec không yêu
cầu.

### D5 — Một transaction, một row lock và decision table fail-closed

Save input gồm expected values, expected token và proposed values; tất cả đều là
transport data không có tenant authority. Server thực hiện:

1. resolve trusted user/org/active establishment và authorize
   `reputation.settings.manage`;
2. strict-parse, normalize và validate toàn bộ proposed/expected payload trước
   write; invalid proposed field làm toàn bộ Save thất bại;
3. mở transaction và `SELECT ... FOR UPDATE` exact settings row theo org +
   establishment;
4. missing row → `CONFIGURATION_UNAVAILABLE` ngay trong transaction;
5. đọc/strict-parse hai qualified audit events mới nhất và tính current token;
6. áp dụng bảng quyết định;
7. real mutation chỉ update đúng ba link fields cùng `updatedAt`, sau đó insert
   đúng một audit trong cùng transaction;
8. return authoritative values và token được tính từ committed candidate;
9. bất kỳ failure nào rollback settings và audit.

Trong bảng dưới đây, `CURRENT == EXPECTED` nghĩa là **cả normalized values và
opaque token** đều khớp. Equality của values mà token không khớp được nêu riêng.

| Case | Current/expected/proposed sau normalization                                                                                      | Kết quả                                                                                        |
| ---- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| A    | `CURRENT == EXPECTED` và `PROPOSED == CURRENT`                                                                                   | `NO_CHANGE`; không update, không audit; trả authoritative current                              |
| B    | `CURRENT == EXPECTED` và `PROPOSED != CURRENT`                                                                                   | Real `SUCCESS`; một atomic settings update + một audit                                         |
| C    | Current token/values không khớp expected và `CURRENT VALUES != PROPOSED`                                                         | `CONFLICT`; không write/audit; cho phép reload                                                 |
| D1   | Current khác expected, `CURRENT VALUES == PROPOSED`, và newest event chứng minh exact same-actor predecessor→proposed transition | Equivalent replay `SUCCESS`; không duplicate update/audit; trả authoritative current           |
| D2   | Current khác expected, `CURRENT VALUES == PROPOSED`, nhưng exact replay proof không tồn tại, actor khác hoặc actor là `null`     | `NO_CHANGE`; không claim request trước đã commit, không write/audit; trả authoritative current |
| ABA  | Values quay lại expected nhưng current token đã đổi, và proposed khác current                                                    | `CONFLICT`; không silent overwrite                                                             |
| M    | Exact scoped settings row không tồn tại                                                                                          | `CONFIGURATION_UNAVAILABLE`; không create/upsert/default/audit                                 |

Một state-token mismatch không bị bỏ qua để thực hiện mutation. Trường hợp D2
được trả `NO_CHANGE`, không phải replay success: desired state đã tồn tại nên
không có overwrite, nhưng hệ thống không gán nhầm công lao cho request hiện tại.

### D6 — Equivalent replay được chứng minh từ exact predecessor transition

Để nhận diện D1, server strict-parse newest và previous qualified events:

- newest event có `actorUserId` đúng current trusted user;
- ordered `changes` của event mô tả chính xác expected→proposed cho mọi field đã
  đổi, và không mô tả field không đổi;
- event new values khớp current authoritative values;
- token tái dựng từ previous event ID (hoặc baseline `null`) + event previous
  values khớp expected token;
- current token tái dựng từ newest event ID + current values khớp database state.

Nếu bất kỳ điều kiện nào thiếu, đó không phải proven replay. Một actor khác tạo
cùng proposed state nhận D2 `NO_CHANGE`, không D1. Một materially different
retry có proposed values khác current sẽ nhận `CONFLICT` theo C.

Replay attribution nghiêm ngặt hơn state-marker validity:

- actor đúng current trusted user và exact predecessor/proposed proof pass → D1
  equivalent replay `SUCCESS`;
- actor thuộc user khác → event vẫn là valid state marker nhưng không chứng minh
  replay cho caller hiện tại; nếu current values bằng proposed thì dùng D2
  `NO_CHANGE`;
- actor là `null` → event vẫn là valid state marker nhưng same-actor proof không
  còn; không dùng D1, không suy đoán actor lịch sử và dùng D2 `NO_CHANGE` khi
  current values bằng proposed.

Actor `null` cũng không chặn một normal subsequent mutation: khi caller hiện tại
đã được authorize và expected token/current values vẫn khớp, decision table D5
tiếp tục xử lý mutation bình thường. Chỉ nhánh D1 attribution không khả dụng.

Hai thao tác độc lập của cùng actor với exact predecessor và exact proposed
state là behaviorally equivalent vì Product contract không định nghĩa request
identity. Cả hai đều đã đạt cùng authoritative outcome; không tạo event thứ hai
khi không còn state change là đúng no-op semantics. Design không tự tạo
idempotency key/request ID contract.

### D7 — ABA được phát hiện cho mọi repository-supported social-link mutation

Ví dụ caller load A với token `T0`; writer khác commit A→B (`E1`) rồi B→A
(`E2`). Values lại là A nhưng current token chứa `E2`, nên khác `T0`:

- caller proposed C/B: conflict, vì mutation dựa trên state trước vòng ABA;
- caller proposed A: no-change an toàn, không write/audit và không claim replay.

Row lock ngăn hai real mutations đánh giá cùng predecessor đồng thời. Audit
insert và settings update commit cùng nhau nên không tồn tại marker không có
state hoặc state không có marker. Repository search hiện tại cho thấy không có
writer nào khác cho ba link ngoài seed khởi tạo settings; seed không ghi ba
link.

Current repository inventory cũng chứng minh
`CURRENT_APPLICATION_INVARIANT`: runtime `packages/db-cloud/src` chỉ insert
`reputationAuditEvents`; không có update/delete/truncate, generic Reputation
audit cleanup, retention/purge job hoặc administrative cleanup path. Migration
FK từ audit tới organization dùng `ON DELETE no action`; user deletion chỉ
`ON DELETE set null` cho actor và không xóa event. Audit `entityId` không có FK
casade tới settings. Lệnh delete duy nhất tìm thấy nằm trong
`packages/db-cloud/test/reputation-repository.integration.test.ts` để teardown
fixture; test path không nằm trong package export và không được runtime import.

Vì vậy qualified `settings.review-social-links.updated.v1` events là append-only
trong supported lifetime hiện tại của capability khi settings row vẫn là active
configuration source. Mọi writer tương lai phải dùng cùng repository operation;
mọi cleanup/delete/purge tương lai có khả năng xóa qualified marker phải dừng và
quay lại Product/Design trước khi enable. Manual database mutation/production
provisioning nằm ngoài application behavior và không được change này cho phép.

ABA guarantee chỉ đúng khi append-only invariant này còn nguyên. Nếu toàn bộ
qualified history bị xóa trái invariant, runtime có thể thấy một
`BASELINE_NO_EVENT` giả và không có đủ current durable evidence để phát hiện.
Đó là unsupported integrity violation, không phải một trạng thái được Design
hứa tự recover/fail-close.

FK actor nullification không vi phạm append-only invariant: audit row, event ID,
scope, action, metadata và recorded timestamp vẫn tồn tại. Vì actor không nằm
trong state token, nullification không tạo concurrency version mới và không làm
mất predecessor/ABA evidence; nó chỉ loại bỏ khả năng positive same-actor proof
cho D1.

### D8 — Audit payload tối thiểu, strict và versioned qua action

Real mutation dùng:

- `entityType`: `SETTINGS`;
- `entityId`: internal scoped `reputation_settings.id`;
- `action`: `settings.review-social-links.updated.v1`;
- `organizationId`: trusted context;
- `actorUserId`: authenticated trusted user tại thời điểm commit; FK hiện có có
  thể đổi giá trị này thành `null` nếu user bị xóa sau đó;
- `createdAt`: transaction-generated monotonic recorded instant;
- metadata strict:

```ts
{
  establishmentId: string;
  changes: Array<{
    provider: 'GOOGLE' | 'FACEBOOK' | 'INSTAGRAM';
    previousUrl: string | null;
    newUrl: string | null;
  }>;
}
```

`changes` có 1–3 phần tử duy nhất, theo thứ tự Google/Facebook/Instagram, và chỉ
chứa delta thật. Action suffix `.v1` là discriminator version; raw JSON được
strict-parse ở db-cloud trước khi dùng làm replay/state evidence và không trở
thành public/UI contract.

Strict state-marker validation không yêu cầu actor vẫn non-null. Actor equality
chỉ là điều kiện bổ sung của D1 replay attribution; organization/entity/action,
establishment, metadata deltas và reconstructed previous/new state vẫn là các
điều kiện bắt buộc độc lập. Mỗi real mutation mới vẫn ghi authenticated
`actorUserId` trong cùng transaction với settings update và audit insert.

Không lưu rejected value, embedded credential, session/OAuth/connector token,
request body, state token, IP, user-agent hoặc browser claim. Organization,
actor và timestamp dùng cột hiện có; establishment là metadata context hiện có.
No-op, validation error, conflict và missing row không audit.

### D9 — Typed transport giữ auth failure tách khỏi capability outcomes

Shared contracts sẽ định nghĩa serialization-safe read model, strict Save input
và discriminated outcomes:

| Outcome                     | Nội dung an toàn cho UI                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `SUCCESS`                   | Ba authoritative values + fresh opaque token; dùng cho real commit hoặc proven replay       |
| `NO_CHANGE`                 | Ba authoritative current values + fresh token; không khẳng định mutation trước thuộc caller |
| `VALIDATION_ERROR`          | Provider/field issue code an toàn; không echo rejected credential/raw request               |
| `CONFLICT`                  | Recoverable conflict + authoritative current model hoặc reload instruction                  |
| `CONFIGURATION_UNAVAILABLE` | Scoped row thiếu; không lộ row của tenant khác                                              |
| `SERVER_ERROR`              | Generic recoverable error; không stack/DB/audit internals                                   |

Authorization/tenant failures tiếp tục throw/redirect/deny theo current server
mechanism, không bị che thành `CONFIGURATION_UNAVAILABLE`. Server action luôn
authorize trước khi parse browser mutation và không nhận org/establishment/role
hoặc permission làm input authority.

### D10 — Public projection dùng cùng policy và giữ missing-row behavior hiện có

`findPublicFeedbackConfiguration` vẫn query bằng trusted public org +
establishment + slug. Trước khi trả link, repository áp dụng D2 safe projection
độc lập cho từng provider:

- accepted stored value → normalized safe URL;
- `null`, malformed, credentials, HTTP, unlisted host hoặc wrong path → `null`;
- không database write, audit, redirect-follow hoặc provider request.

Nếu settings row thiếu, repository tiếp tục trả `null`; production page đã có
trusted tenant nhưng nhận null sẽ `notFound()`. Development slug resolver cũng
không tạo tenant từ row thiếu. Không fallback/synthesis, public error state mới
hoặc tenant-resolution change được thêm. Đây là clear existing fail-closed
behavior nên không cần Product decision mới.

CTA chỉ render non-null safe projected links, với `target="_blank"` và
`rel="noopener noreferrer"`. Browser slug/tenant values không tạo authority.

### D11 — UI mở rộng route Satisfaction hiện có, không tạo settings route khác

OWNER nhận một section “Liens d’avis et réseaux sociaux” trong
`/visibilite-reputation/satisfaction`, dùng ba field có label rõ và một nút
`Enregistrer`. Section không thay thế inbox hiện có và không autosave.

| UI state                  | Hành vi                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Loading                   | Skeleton/busy state; không Save                                                                            |
| Empty                     | Ba field trống từ ba `null`; không persist placeholder                                                     |
| Populated                 | Ba normalized authoritative values                                                                         |
| Dirty                     | Browser draft khác baseline; explicit Save enabled nếu client checks hợp lệ                                |
| Invalid                   | Field message theo provider; giữ toàn bộ draft; không submit partial                                       |
| Saving                    | Một pending submit; Save disabled để tránh double submit                                                   |
| Saved / no-change         | Baseline thay bằng authoritative response; clear dirty; thông báo ngắn                                     |
| Server failure            | Generic retry; giữ draft                                                                                   |
| Conflict                  | Không overwrite; thông báo dữ liệu đã đổi và action reload authoritative state                             |
| Configuration unavailable | “Configuration indisponible”; fields/read state unavailable hoặc disabled; Save disabled; không create CTA |

Đóng/unmount/navigate mà chưa Save không ghi data/audit. Recoverable validation
hoặc server error giữ input trong mounted form. Reload sau conflict hoặc external
provisioning lấy lại server state. MANAGER/STAFF không nhận settings model hoặc
section; đây không thay đổi quyền dùng direct-feedback inbox hiện có.

UI tái sử dụng `@yuta/ui`, semantic tokens và `lucide-react`; không đổi shared UI
primitive nếu không có review riêng. French copy và keyboard/focus/visible-error
behavior tuân theo Backoffice rules. Không scheduled/provider/OAuth UI.

### D12 — Stable page pack là prerequisite trước UI Apply

Vì không có pack hiện tại, phase đầu tiên có UI authority sau khi Tasks/Apply
được duyệt phải tạo:

```text
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/
```

Slug gồm app + route vocabulary để không mơ hồ repository-wide. Pack tuân thủ
PAGE_PACK_PROTOCOL revision 4, phân loại `EXISTING_PAGE`, capture authenticated
baseline của route hiện hành, chạy design prompt, chứa generated prompt
provenance, và link shared YUTA/Backoffice UI governance thay vì copy. Pack
không tạo route/navigation/permission và phải được duyệt trước khi code UI.

### D13 — Test strategy tách contract, repository, authorization, component và Browser QA

Kế hoạch Tasks sau này phải trace toàn bộ 103 scenarios:

- contracts: normalization, 2048 boundary, credentials, exact hosts/paths,
  wildcard/lookalike/HTTP/shortener rejection, safe projection;
- disposable PostgreSQL: missing row, scoped read, transaction rollback,
  exactly-one audit, no-op, concurrent writers, D1/D2 replay, materially
  different retry, ABA, valid no-event baseline và malformed/ambiguous audit
  fail-closed; additionally prove active same actor gives valid marker + D1,
  different actor gives valid marker + D2, and an actor nullified through the
  real FK remains a valid marker/read/token, permits a later authorized normal
  mutation, and uses D2 rather than D1 when current equals proposed;
- Backoffice action/auth: OWNER allow, MANAGER/STAFF/public/service/system-role
  deny, browser claims ignored, wrong org/establishment, safe outcomes;
- component/model: all UI states, one explicit Save, no autosave, add/replace/
  clear/mixed, pending, validation, conflict/reload, unavailable, keyboard/focus;
- feedback-web: valid CTAs, null/legacy invalid/unlisted host hidden, trusted
  tenant preserved, exact external-link attributes;
- regression: GBP connector paths/hashes do not write `googleReviewUrl`, existing
  inbox behavior remains, no excluded runtime/module writes; static inventory
  proves no supported qualified-audit update/delete/purge path và phát hiện nếu
  một cleanup path mới xuất hiện.

Không test nào được phép xóa toàn bộ qualified history rồi claim runtime sẽ tự
phát hiện. Nếu total-history deletion được dùng như negative fixture, expected
classification là `UNSUPPORTED_INTEGRITY_VIOLATION`, không phải guaranteed
runtime error.

Concurrency/atomicity evidence phải dùng disposable real PostgreSQL; mocks chỉ
được dùng cho action/component boundaries. Browser QA chỉ chạy ở final
Integration/Regression trên authenticated real local route với safe synthetic
data, tối thiểu 1440, 1024, 768 và 390 px, gồm empty/populated/dirty/invalid/
saving/saved/error/conflict/unavailable và no-overflow/focus/keyboard. Design
phase không chạy test hoặc Browser QA.

### D14 — Audit history là integrity evidence; retention không được tự suy ra

Previous/new URLs là public destinations nhưng có thể chứa stable business
identifiers/query data. Audit duplication được giới hạn đúng delta đã được
Product duyệt và chỉ nằm trong server-side Reputation audit boundary. Không có
audit UI/export mới trong change này.

Repository hiện không có Reputation audit cleanup/retention contract được duyệt.
Change không tạo timer, purge, anonymization, legal-hold hoặc keep-forever flag.
Current no-schema correctness phụ thuộc proven append-only invariant ở D7.

Malformed event, ambiguous chain hoặc mismatch còn tồn tại được phát hiện và
fail closed. Ngược lại, nếu một unsupported external process xóa **toàn bộ**
qualified history, runtime không phân biệt được nó với legitimate
`BASELINE_NO_EVENT`; Design không claim automatic detection. Vì vậy production
retention/access/cleanup vẫn `NOT_AUTHORIZED`. Mọi future mechanism có thể xóa
qualified markers phải quay lại Product/Design trước khi activation và chọn một
hướng được duyệt, ví dụ giữ marker cần thiết, thêm durable checkpoint/version,
hoặc disable mutation trước destructive cleanup. Không hướng nào được chọn hoặc
triển khai trong change này.

### D15 — Không đổi Google connector hoặc writer ownership

Google URL chỉ được ghi bởi explicit settings Save ở D5. Connector OAuth,
location selection, refresh và credentials tiếp tục dùng `reputationConnectors`
và audit `CONNECTOR`; chúng không derive/write link. Facebook/Instagram không có
connector mới. Static repository inventory và regression tests phải phát hiện
nếu một writer khác xuất hiện cho ba columns.

### D16 — Không schema migration; rollout/rollback phải giữ safe projection và audit

Không tạo migration hoặc backfill cho **current repository capability**, với
điều kiện proven append-only qualified-audit invariant ở D7 được giữ nguyên.
Design không claim correctness sau unsupported total-history deletion. Future
authorized implementation có thứ tự:

1. shared provider policy/contracts;
2. db-cloud private read/mutation/audit/token và public safe projection;
3. stable page-pack discovery/design approval;
4. Backoffice UI/action;
5. focused/integration/regression tests và final Browser QA.

Nếu sau này được release, public safe projection nên được đưa vào trước hoặc cùng
Backoffice writer. Production preflight phải đánh giá settings-row provisioning
coverage; missing row vẫn hiển thị unavailable, không được auto-fix. Rollback
trước khi có production mutation là code-only. Sau khi có audit/link mutation,
không xóa audit hoặc sửa data tự động; ưu tiên roll-forward. Revert public safe
projection có thể tái lộ legacy unsafe URLs nên cần security review riêng.

OpenSpec planning/implementation completion không authorize deploy, production
data mutation, provisioning, retention operation hoặc production enablement.

## Risks / Trade-offs

- **[Risk] Qualified audit hiện hữu bị corrupt/ambiguous** → private settings
  read/Save fail closed. Nếu toàn bộ history bị xóa trái append-only invariant,
  runtime không thể phân biệt với baseline; đó là
  `UNSUPPORTED_INTEGRITY_VIOLATION`, nên cleanup phải bị cấm cho tới khi có
  review và replacement evidence.
- **[Risk] Writer mới bypass repository operation** → static inventory và
  integration coverage bảo vệ single-writer rule; phát hiện writer mới là stop
  condition, không mở rộng im lặng.
- **[Risk] Same actor thực hiện hai intent giống hệt nhau không phân biệt được
  với replay** → behavior là equivalent/no duplicate state effect theo current
  Product contract; không claim request identity mà Product chưa định nghĩa.
- **[Risk] User lịch sử bị xóa làm audit actor thành null** → giữ event làm
  state/predecessor/ABA evidence, không đổi token và không fail private read;
  không dùng event đó để claim D1 same-actor replay hoặc suy đoán attribution.
- **[Risk] Public legacy URL bị ẩn sau policy hardening** → fail-closed đúng Spec;
  không tự sửa data, OWNER có thể thay bằng URL hợp lệ qua explicit Save.
- **[Risk] Audit lưu previous/new public URLs làm tăng dữ liệu lịch sử** → chỉ
  changed provider, strict metadata, không credential/request dump; production
  retention/access vẫn là gate riêng.
- **[Risk] Missing settings rows khiến OWNER không cấu hình được** → bounded
  unavailable + retry after separate provisioning; không tạo default sai owner.
- **[Risk] Cross-change drift ở public feedback files** → so sánh approved
  artifacts và reconcile trước Apply; không overwrite concurrent trusted-boundary
  work.
- **[Risk] Hai cloud app release lệch nhịp** → safe projection first/together,
  no production authorization trong change, roll-forward nếu đã có mutation.

## Migration Plan

Không có database migration hoặc data cutover.

1. Trong một Apply được duyệt sau này, triển khai và chứng minh D2–D10 trên
   disposable/local data; không production-enable.
2. Hoàn tất page pack D12 trước UI code và duyệt visual authority riêng theo
   workflow.
3. Chạy technical compliance, VERIFY và Browser QA ở phase cuối; không dùng test
   mock thay real transaction evidence.
4. Production rollout, settings provisioning coverage, audit retention/access,
   backup/restore và deployment cần authority riêng. Bất kỳ cleanup nào có thể
   xóa qualified audit markers đều bị cấm trước Product/Design review.
5. Nếu rollback local code, giữ nguyên settings/audit rows; không chạy cleanup.
   Nếu production data đã tồn tại trong một future release, ưu tiên roll-forward
   vì audit marker là concurrency evidence và public safe projection là security
   boundary.

Không có Open Question nào có thể được hoãn mà không ảnh hưởng approach/tasks.
No-schema concurrency, missing-row behavior, public fail-closed behavior,
authorization, audit shape và page-pack prerequisite đều đã được chốt trong
Design này để Sensitive Design review.
