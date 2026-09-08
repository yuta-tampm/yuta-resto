## Context

Xem [Proposal](proposal.md), [Analysis](analysis.md) và [approved delta](specs/formalites/legal-template-foundation/spec.md). Design này implement đúng 14 requirements / 42 scenarios; không sửa Product semantics. Gate 1 và Gate 2 đã được current user approve. `DESIGN APPLICABILITY: REQUIRED`; Sensitive Design Gate bắt buộc vì cross-module global ownership, authorization, durable concurrency, migration và legal/privacy-sensitive data.

Repository hiện có trusted `AuthService.requireFormalitesTemplateSystemOperation` trong `packages/auth/src/session.ts`; global operation tuple/grants đã được implement và phải giữ nguyên. `@yuta/db-cloud` có PostgreSQL/Drizzle transactions, UUIDv7 và row-lock patterns; current Formalités repository là tenant/employee draft, không phải global template foundation. Không reuse repository đó bằng cách bỏ tenant predicate. Không có Platform Admin runtime hoặc template tables để extend.

Authorities: [database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), [db-cloud instructions](../../../packages/db-cloud/AGENTS.md), [auth instructions](../../../packages/auth/AGENTS.md), [tenancy](../../../docs/architecture/TENANCY.md), [identity/membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md), normative [system authority](../../specs/authorization/platform-admin-formalites-template-administration/spec.md) và [legal-review governance](../../specs/formalites/template-legal-review-governance/spec.md). Code/manifests là mechanism evidence, không là additional Product authorization.

## Goals / Non-Goals

**Goals:** dedicated global schema và authorized server-side repository facade; durable identity/draft/version; exact source-byte preservation; atomic freeze với revision conflict và duplicate prevention; explicit non-executable applicability; bounded migration và real database verification plan.

**Non-Goals:** HTTP/server-action/transport API, browser/UI/app composition, new package/framework/dependency, auth/session redesign, tenant access, actual legal content, publication/qualification/retirement execution, reviewer/evidence storage, legal governance engine, automatic applicability selection, generation/rendering/signature/Documents/provider, production enablement. Design không tạo schema/code/migration trong turn này.

## Decisions

### D1 — Dedicated global boundary và exact-operation entry points

Tạo một server-only facade trong `@yuta/db-cloud`, được compose với `CloudDatabaseClient` và existing `AuthService`. Mỗi public domain method tự gọi `requireFormalitesTemplateSystemOperation` với literal operation cố định trước mọi resource lookup hoặc mutation. Không nhận authorization context, role, operation selector, permission map hoặc policy từ request/domain input. Existing trusted identity adapter và active internal-user lookup của `createAuthService` vẫn là trust source; không thêm bypass constructor dùng caller-supplied context.

| Domain method group                                  | Exact required operation            | Effect trong slice                  |
| ---------------------------------------------------- | ----------------------------------- | ----------------------------------- |
| Read identity, draft, exact version, version history | `formalites.template.read`          | Authorized global read              |
| Create identity, create draft, edit draft            | `formalites.template.draft.manage`  | Bounded mutable persistence         |
| Freeze exact draft revision                          | `formalites.template.review.submit` | Immutable candidate creation/replay |

`formalites.template.publish` và `formalites.template.retire` giữ existing grants nhưng không có facade methods hoặc dispatcher branches. Exact five-operation tuple, explicit `YUTA_ADMIN` grants và `YUTA_SUPPORT` denial không đổi. Không gọi generic `requireSystemRole` thay capability guard; không suy ra submit từ manage/read. Không cache authorization result qua các requests/retries.

Facade chỉ nhận stable global resource IDs và validated bounded input. Draft/version reads và mutations dùng `(templateId, draftId/versionId)` để tránh cross-identity confusion; đây là global resource containment, không tenant scope. Không `TenantContext`, org/establishment fields, fake system organization hoặc tenant repository fallback. Valid system grant không được truyền sang tenant APIs như authority. Trusted server composition là engineering trust boundary, không một callable authentication endpoint; không wire facade vào Backoffice hoặc app nào trong change này.

Implementation phải dùng private transaction helpers, không export alternate unguarded mutation functions. Existing package-level database/schema access của trusted infrastructure không được mô tả là security sandbox hoặc database-user ACL. Typed service injection chỉ dành trusted server code/tests, không là caller-defined role policy.

**Rationale / alternatives:** reuse exact existing system guard thay role-only check, fabricated `TenantContext` hoặc new principal. Dedicated facade giữ fail-closed operation mapping mà không sửa tenant-bound session architecture hoặc tạo Platform Admin app.

### D2 — Ba durable records; không ordinal hoặc mutable identity metadata

Planned tables nằm trong dedicated `formalites-legal-templates` schema module, dùng PostgreSQL public namespace theo current package convention, với global table names riêng:

| Table                                | Stored fields và constraints                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formalites_template_identities`     | UUIDv7 `id` primary key; immutable non-empty `legalPurpose` text assertion; server `createdAt`. Không organization/establishment, lifecycle, editable display metadata hoặc purpose enum.                                                                                                                                                                                                                                          |
| `formalites_template_working_drafts` | UUIDv7 `id`; `templateId` FK; positive integer `revision`; `contentProfile`; canonical `sourceBytes` bytea; validated `applicability` jsonb; server `createdAt`, `updatedAt`; nullable `frozenAt`. Unique `(id, templateId)` cho containment FK. Partial unique index on `templateId` where `frozenAt IS NULL`.                                                                                                                    |
| `formalites_template_versions`       | UUIDv7 `id`; `templateId` FK; `sourceDraftId`, positive `sourceDraftRevision`; immutable `contentProfile`, `sourceBytes` bytea, `checksumAlgorithm`, `contentChecksum`, `applicability` jsonb; server `frozenAt`. Composite FK `(sourceDraftId, templateId)` tới draft; unique `(sourceDraftId, sourceDraftRevision)`. Required binding columns NOT NULL; checksum shape check 64 lowercase hex; initial algorithm check `sha256`. |

Global scope là invariant của dedicated model/facade, không optional scope column có tenant fallback. Identity creation không bắt buộc tạo draft/version cùng lúc. Draft bắt đầu revision 1; successful edit tăng revision đúng một; frozen draft giữ revision đã freeze và không active nữa. Version không được synthesize từ current draft khi read.

`legalPurpose` được khai báo khi create identity, không có edit method. Draft không mang một independently editable purpose/type field. Fundamental purpose mới phải create identity mới; foundation không có legal-language classifier để chứng minh content phù hợp purpose. Human correctness của declaration không được suy diễn thành legal review. Caller không thể gắn nhãn field là presentation-only để sửa frozen binding.

Stable IDs được generate bằng existing UUIDv7 utility, không từ content checksum. **Không thêm ordinal:** chưa có concrete implementation need; history có thể sắp theo `frozenAt`, rồi stable ID để deterministic display/read, tuyệt đối không automatic applicable/latest selection. Conditional ordinal uniqueness scenario được verify bằng evidence rằng ordinal không được cung cấp, không invent ordinal chỉ để có test.

Không cascade-delete identity/draft/version; FKs dùng restrictive deletion. Không có delete/retire method hoặc draft reopening. New draft sau freeze là new record. Retained frozen draft cung cấp exact retry locator, không thành general revision-history/audit subsystem; version vẫn là canonical immutable record. Không unique constraint theo checksum hoặc purpose text.

**Rationale / alternatives:** ba records phân biệt mutable workspace và canonical version; one-row-with-status hoặc checksum-as-version-ID làm yếu identity/retry/applicability semantics. Omit ordinal tránh thêm counter và implicit latest semantics không cần thiết.

### D3 — Draft concurrency: parent lock, partial unique index, revision compare

Mọi create/edit/freeze draft chạy trong một PostgreSQL transaction ở `READ COMMITTED`, lock existing template identity row bằng `SELECT ... FOR UPDATE` trước, rồi mới read/lock draft bằng same containment key. Một operation chỉ tác động một template; không cross-template batch. Lock order luôn identity → draft, không external I/O hoặc identity-provider call trong database transaction.

Create draft: sau parent lock, query active draft; nếu có thì trả conflict `ACTIVE_DRAFT_EXISTS`, không tạo hoặc tự sửa draft hiện có. Partial unique index là durable backstop cho competing inserts. Concurrent create từ hai connections cho một identity phải có tối đa một success và một active row.

Edit draft: bắt buộc `expectedRevision`; validate active draft và equality dưới lock. Update predicate gồm template/draft IDs, `frozenAt IS NULL` và expected revision; require exactly one affected row. Thay source/applicability trong cùng write, tăng revision, không create version. `STALE_DRAFT_REVISION` không tự retry với latest revision hoặc silent merge. Revision overflow fail closed, không wrap counter.

Input buffers/objects được defensive-copy và validate trước write; không giữ caller-owned mutable references. Database rows/read results cũng được map/copy, không expose live object mutable reference như persistence authority. `NOT_FOUND`, `ACTIVE_DRAFT_EXISTS`, `STALE_DRAFT_REVISION`, `DRAFT_FROZEN`, `INVALID_SOURCE`, `INVALID_APPLICABILITY`, `INTEGRITY_FAILURE` là technical outcomes, không Product legal-review outcomes hoặc new auth operations; unauthorized requests giữ existing auth errors trước lookup.

**Rationale / alternatives:** parent row tồn tại ngay khi identity được tạo nên có thể serialize cả create khi chưa có draft row. Không dùng in-memory mutex hoặc check-then-insert ngoài transaction. Row locks + unique constraint + revision predicate reuse package patterns, không cần advisory-lock namespace, distributed coordinator hoặc new transaction library. PostgreSQL row-lock semantics được đối chiếu với [official locking documentation](https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-ROWS).

### D4 — Freeze exact revision, atomic close và durable replay

Freeze input chỉ gồm `templateId`, `draftId`, `expectedRevision`; không gửi replacement source/applicability/checksum trong freeze request. Guard exact `formalites.template.review.submit` chạy cho cả first attempt và replay.

Trong một transaction theo lock order D3:

1. Load exact contained draft; missing hoặc revision khác yêu cầu trả failure, không substitute latest draft/revision.
2. Nếu draft đã frozen, lookup version bằng `(sourceDraftId, sourceDraftRevision)` và cùng template. Verify complete immutable binding và source/applicability equality với frozen draft. Có đúng existing consistent version thì trả same stable Version với technical `replayed: true`. Missing/inconsistent binding là `INTEGRITY_FAILURE`, không repair thành second version.
3. Nếu draft active, verify stored profile/bytes/applicability theo D5–D6; snapshot từ một row revision đang lock. Compute server SHA-256 từ snapshot bytes. Insert complete version với fresh UUIDv7, exact source revision và snapshot applicability.
4. Read back inserted row trong transaction, verify bytes equal snapshot, SHA-256 equal, profile và applicability value equal, template/draft/revision binding equal. Update draft `frozenAt` bằng guarded revision/active predicate; không edit snapshot hoặc increment revision khi close. Require exactly one row. Return success chỉ sau commit.
5. Bất kỳ validation/insert/read-back/close error đều rollback cả version và draft close. Không partial success, receipt notification, legal-review event, publication event hoặc external call.

Unique `(sourceDraftId, sourceDraftRevision)` tồn tại trong database, không chỉ request memory. Concurrent same-revision freeze được serialize; loser sau commit thấy closed draft và returns same version. Response loss sau commit: exact retry đi replay path; không new version. Connection/commit outcome unknown: trả lỗi/unknown outcome, không claim rollback nếu chưa biết; client chỉ retry same locator/revision để resolve durable result. Không đổi revision hoặc new ID như implicit retry strategy.

Unique violation ngoài expected serialized path: transaction rollback; retry/read exact durable locator trong new transaction qua same authorization/lock path, chỉ trả replay khi consistent record tồn tại; otherwise explicit failure. Deadlock/timeout không được biến thành success hoặc stale overwrite. Không cần general command-receipt table, idempotency-key API, outbox hoặc publication orchestration.

Different draft IDs/revisions không deduplicate theo content checksum. Same canonical bytes + changed applicability trong new draft tạo distinct version. Sau freeze, another draft có thể được tạo nhưng không sửa frozen draft hoặc version; retry old frozen draft vẫn resolve old version, không đọc new active draft.

**Rationale / alternatives:** transaction snapshot + unique revision locator đạt atomicity và durable idempotence trực tiếp. Content-hash dedup hoặc client-generated checksum không phân biệt applicability và review identity. Separate write-then-close hoặc best-effort compensation không đáp ứng consistent freeze.

### D5 — Exact profile V1, bytea và SHA-256

Profile identifier: `formalites.legal-source.utf8-lf.v1`. Algorithm identifier: `sha256`; digest là 64 lowercase hex từ Node `createHash('sha256')` trên exact canonical `Uint8Array`/Buffer. Đây là identifiers kỹ thuật, không qualification state.

Internal server-domain input nhận bytes, không arbitrary object/AST/rendered artifact. Tại create/edit draft, canonicalizer thực hiện theo thứ tự:

1. Defensive-copy bytes. Strict decode UTF-8; malformed/truncated/overlong encoding bị reject, không replacement-character repair. Dùng `TextDecoder('utf-8', { fatal: true, ignoreBOM: true })` để BOM không bị silently consumed bởi decoder.
2. Nếu decoded input bắt đầu bằng U+FEFF/UTF-8 BOM, **reject** `INVALID_SOURCE`; không tự strip. Embedded U+FEFF không bị xóa như whitespace/BOM đầu file. Không heuristically decode UTF-16/legacy encodings.
3. Canonicalize CRLF thành LF, sau đó lone CR thành LF. Đây là transform duy nhất; không normalize Unicode, không trim spaces/tabs/blank lines, không thêm final newline, không formatter hoặc replace placeholders.
4. UTF-8 encode và verify resulting bytes decode strictly, không leading BOM hoặc CR. Store resulting bytes và explicit profile. Save/read result cung cấp canonical content để caller thấy saved bytes; không claim raw input bytes và canonical bytes giống nhau khi line endings đã đổi.

Freeze chỉ **validate** canonical draft bytes; không silently sửa stored bytes, không gọi transform để đổi revision đang freeze. Invalid stored canonical state fail closed. Unknown profile bị reject cho new create/edit/freeze; khi future profile được approve, phải giữ original profile-specific validator và exact historical bytes, không migrate/recanonicalize historical content bằng current formatter.

PostgreSQL `bytea` được map bằng scoped Drizzle `customType` với Buffer driver conversion. Không dùng `text` cho canonical bytes: binary persistence tránh text-layer restrictions/transforms và giữ exact bytes, kể cả valid UTF-8 NUL. Roundtrip test phải kiểm chứng current postgres-js/Drizzle driver; không assume hex-string representation tương đương bytes. Không dependency hoặc `pgcrypto` extension mới; no stored caller checksum parameter.

Server recompute digest lúc freeze và trên mỗi full version read/replay; verify stored algorithm/profile/canonical byte rules trước trả consistent binding. Metadata history read không claim content verification nếu chưa load bytes; full version read fail closed trên corruption. Checksum không hash JSON serialization, whole row, normalized string hoặc rendered output. Applicability được bind độc lập theo version identity/D6, không nằm trong content digest và không được suy ra bằng digest equality.

**Rationale / alternatives:** BOM rejection là clear permitted pre-freeze rejection; LF conversion giữ approved canonicalization. Bytea tránh accidental text re-encoding; no trimming/Unicode normalization giữ legal source identity. Server recomputation ngăn caller checksum thành authority nhưng không là digital signature hoặc protection trước privileged attacker sửa cả bytes và digest. Decoder behavior được đối chiếu [Node documentation](https://nodejs.org/api/util.html#new-textdecoderencoding-options); custom mapping theo [Drizzle custom types](https://orm.drizzle.team/docs/custom-types).

### D6 — Applicability declaration, không canonical configuration hoặc matching engine

Dedicated strict Zod domain schema trong db-cloud module validate jsonb declaration, không transport API schema. Chín keys bắt buộc: `jurisdiction`, `contractCategory`, `workingTimeBoundary`, `employeeCategories`, `employerCategories`, `collectiveAgreementAssumptions`, `effectiveDateConstraints`, `exclusions`, `bindingConditions`. Đây là field mapping của approved dimensions, không employer facts fields hoặc Product enums. Missing input dimension được biểu diễn explicit unknown trong saved declaration; không default thành unrestricted hoặc empty/no conditions.

Mỗi dimension dùng technical tagged representation:

- `unknown`: dimension chưa được xác định; không assertion rằng không có restrictions.
- `assertions`: non-empty array của non-empty text assertions/assumptions; preserve supplied strings và array order, không normalize legal categories/dates/conditions. Opaque text không executable predicate hoặc external review evidence.
- `canonicalReferences`: non-empty array của exact owner-qualified reference identifiers; chỉ accepted nếu có repository-approved authoritative owner/binding cho dimension đó. Không raw URL/path/private locator, caller-injected resolver hoặc string prefix tự tạo owner authority.

Trong current sources chưa có approved global applicability-reference binding cho foundation này. Vì vậy initial canonical-reference allowlist **rỗng**: schema có representation để phân biệt, nhưng write attempt dùng unapproved owner/reference trả `INVALID_APPLICABILITY`, không auto-promote hoặc silently downgrade thành canonical truth. Caller có thể khai báo nội dung như explicit assertion/unknown. Existing tenant Personnel contract facts không trở thành global catalog chỉ vì có enum trong contracts. Khi có approved owner về sau, separate reviewed change phải bind exact dimension/owner/reference semantics; không tự tạo catalog, legal enum hoặc resolver trong slice này.

JSONB bảo toàn declared values/array order; object-key order không phải legal source byte identity. Validate/copy snapshot trước draft write và sau version read; compare structurally khi freeze/replay. Không generic extra metadata bag, known reviewer/evidence/publication fields hoặc private locator field. Opaque assertions/canonical source không phải authorized legal-evidence intake: không claim structural validation có thể phát hiện mọi personal data chèn vào arbitrary prose; privacy review/runtime input governance vẫn prerequisite trước actual use.

Applicability version changes được quản lý bằng new draft/version, không mutable reference refresh. Không dereference owner để dynamically sửa historical declaration, không assert external owner availability như legal validity. Không evaluate dates, conditions, exclusions, employee/employer facts hoặc select latest candidate.

**Rationale / alternatives:** tagged assertions/reference/unknown không duplicate owner truth và không tạo executable engine. Plain uncontrolled metadata hoặc synthesized contract/collective enums tạo false authority. Explicitly empty current reference binding phản ánh repository reality; không unresolved permission để implementation tự invent owner.

### D7 — Immutable normal paths và minimized traceability

Version repository helpers chỉ insert/read, không update/upsert/delete; identity purpose cũng create/read only. Draft edits chỉ nhận draft ID + expected revision và require active state. Không generic row patch/exported mutation, no version-to-draft reset. Binding constraints và application validation bảo vệ containment/format; normal facade không có route để mutate version. Read returns copied bytes/value objects; caller mutation không persist back.

Không thêm DB role, blanket RLS policy, privileged maintenance API hoặc version immutability trigger trong bounded design. Guarantee ở **normal repository/domain paths**, đúng approved scope; direct privileged SQL và future migrations vẫn trusted operational boundary, không tamper-proof archive. Nếu future requirement cần chống privileged mutation, quay lại separate authority/security design. Tests phải chứng minh no version update methods và normal-path attempts không đổi toàn bộ binding; byte corruption via controlled disposable-test SQL chỉ dùng để kiểm chứng integrity read failure.

**Optional internal mutation traceability: OMITTED.** Không có concrete need để lưu actor ID history trong slice này; không actor/name/email/contact columns hoặc generic audit table. Source draft/revision và timestamps chỉ là technical data lineage của freeze, không actor attribution/legal evidence/publication audit. Trusted actor ID do auth guard resolve chỉ dùng transient authorization, không persisted bằng cách copy entire context. Existing authorization denial logger giữ nguyên; không suy ra mutation completion từ security allow.

Không lưu review outcomes, reviewer YUTA identity, reviewer competence, opinion, evidence link/upload hoặc qualification/publication/retirement records. Normative three review outcomes giữ nguyên trong governance main spec, không materialize thành fields ở đây. Privacy/retention requirements chưa được close; không promise indefinite retention hoặc define purge policy.

**Rationale / alternatives:** insert/read-only version paths đủ approved normal-path immutability; generic audit/evidence tables hoặc trigger/ACL redesign không cần cho bounded requirement. Omit optional actor persistence giảm personal-data footprint mà không thay authority hoặc version lineage.

### D8 — Intended implementation placement và boundary allowlist

Các paths sau là Design proposal cho future Tasks/Apply, **không tạo trong turn này**:

| Path / bounded pattern                                                                                                                 | Responsibility                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `packages/db-cloud/src/schema/formalites-legal-templates.ts`                                                                           | Dedicated three-table global model, scoped bytea mapping, constraints/indexes                            |
| `packages/db-cloud/src/schema/index.ts`                                                                                                | Minimal additive schema export                                                                           |
| `packages/db-cloud/src/formalites-legal-template-domain.ts`                                                                            | Strict internal domain input/applicability validation, canonical bytes/hash helpers, errors/value models |
| `packages/db-cloud/src/formalites-legal-template-repository.ts`                                                                        | Authorized facade, private global queries, transactions/revision/freeze replay                           |
| `packages/db-cloud/src/index.ts`                                                                                                       | Minimal named facade/value exports; no unguarded mutation alternate                                      |
| `packages/db-cloud/test/formalites-legal-template-domain.test.ts`                                                                      | Pure byte/applicability/checksum tests                                                                   |
| `packages/db-cloud/test/formalites-legal-template-repository.test.ts`                                                                  | Operation mapping/guard-first/no excluded methods; no real database claims from mocks                    |
| `packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts`                                                      | Guarded disposable PostgreSQL persistence/concurrency/rollback/non-browser QA                            |
| `packages/db-cloud/drizzle/<next>_formalites_legal_template_foundation.sql`, matching generated snapshot, `drizzle/meta/_journal.json` | Additive migration only; exact next index resolved at authorized Apply                                   |

No `packages/auth` source/test edits required: reuse existing exported `AuthService`, operation type/guard. No new transport contract/request-response API, so no `@yuta/contracts` transport surface required; internal in-process Buffer/domain types remain server-side. Future serialization boundary belongs to contracts, not improvised here. Existing dependencies already supply Drizzle, postgres, Zod, UUID and Node crypto; package manifest/lockfile changes not expected.

Before Tasks/Apply, recheck shared index/migration dirty state; new generated migration must not collect unrelated Pointage/schema changes. Current journal ends at `0019_pointage_authority_foundation`, evidence only, not reserved next migration number. No changes to tenant Formalités repository/schema, Personnel/Documents sources, app/session files, db-pos/display, normative specs or canonical Knowledge during Apply/Verify. Any required broader scope returns to Control Tower.

### D9 — Focused verification strategy và 14/42 traceability

R/S numbers dưới đây là document-order references tới exact approved delta, không new requirements. Future Tasks phải map exact titles và actual code/tests; Design không claim tests đã execute.

| Requirement / scenarios                     | Mechanism   | Required future evidence                                                                                                                                                                                                                           |
| ------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 / S1–S2 global ownership                 | D1–D2       | Create/read without org/membership; reject tenant-scope input; dedicated model/import inspection; no tenant queries                                                                                                                                |
| R2 / S3–S7 exact operations                 | D1          | Actual existing AuthService with controlled test adapters: active admin, support, restaurant-only/no-system-role, anonymous, missing/disabled user; assert exact op per method and zero DB calls on denial; existing auth/tenant regression suites |
| R3 / S8–S10 stable purpose                  | D2,D7       | Same identity new draft/version; no purpose/metadata-update path; new purpose uses new identity; historical binding unchanged                                                                                                                      |
| R4 / S11–S14 draft cardinality/mutability   | D2–D3       | Identity with zero versions; competing create on independent connections; durable edit; new draft after freeze, multiple frozen candidates                                                                                                         |
| R5 / S15–S17 exact freeze/durability        | D3–D4       | Edit/freeze races, whole-row source/applicability equality; independent client reread; transaction failure injection before close and no partial durable state                                                                                     |
| R6 / S18–S20 immutable binding              | D5,D7       | Normal edit/reopen/version-patch denied/absent; full original tuple unchanged; no formatter/normalization path; unknown future profile cannot rewrite historical V1                                                                                |
| R7 / S21–S24 canonical bytes                | D5          | Valid UTF-8/NUL, invalid/truncated/overlong sequences, leading BOM rejection, CRLF/lone CR→LF, embedded U+FEFF preserved, composed/decomposed Unicode distinct, whitespace/final-newline preservation; bytea actual driver roundtrip               |
| R8 / S25–S27 exact digest                   | D4–D5       | Independent Node SHA-256 over reread bytes; caller checksum input rejected; controlled corrupt row denied; no legal-proof flag                                                                                                                     |
| R9 / S28–S29 applicability version identity | D4,D6       | Same source bytes/checksum with different declaration creates different version; no checksum uniqueness or qualification inference                                                                                                                 |
| R10 / S30–S32 declared applicability        | D6          | All nine dimensions roundtrip; unknown/missing explicit, no unrestricted default; unsupported owner/reference rejected, assertions not promoted; reference representation distinct; no date/condition/matching evaluator                           |
| R11 / S33–S34 duplicate-free freeze         | D3–D4       | Independent concurrent freezes; response-loss replay same ID; retry after new active draft; same locator count=1; different draft IDs same bytes remain distinct                                                                                   |
| R12 / S35–S36 optional ordinal              | D2          | No ordinal field/surface; conditional uniqueness N/A with evidence; deterministic history order never picks applicable/latest                                                                                                                      |
| R13 / S37–S39 privacy/traceability          | D6–D7       | Actor traceability omitted with exact schema evidence; strict unknown/evidence field rejection; no reviewer/identity/evidence/publication records; auth allow then failed write is not freeze success                                              |
| R14 / S40–S42 excluded behavior             | D1,D4,D7–D8 | Successful freeze writes only approved tables; no lifecycle flags, provider calls, publish/retire methods, actual legal content or app/runtime changes; protected source/spec/Knowledge hashes unchanged                                           |

Database concurrency evidence phải dùng real independent connections/transactions, barriers cho race ordering và assertions trên committed rows; `Promise.all` với one mocked transaction không đủ. Cover edit wins→stale freeze; freeze wins→frozen edit denied; duplicate create; same-revision freeze/retry; insert then injected close failure rollback. Synthetic short byte strings/assertions dùng cho tests, không real CDI/CDD/legal opinion/template content hoặc personal data.

Future commands dùng actual repository tooling:

- `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-domain.test.ts test/formalites-legal-template-repository.test.ts`.
- `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-repository.integration.test.ts` trên separately verified disposable cloud test database với `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`. Existing `.env.local` fallback không tự chứng minh database disposable; không enable guard trên unknown/shared/production URL. Report skipped suite là SKIPPED/BLOCKED, không PASS.
- Existing `test:integration` script chỉ target `test/schema.integration.test.ts`, **không đủ** chứng minh new integration file đã chạy. Run schema suite riêng và existing tenant Formalités/Personnel regression suites theo impact; auth + tenant package tests giữ authorization boundary.
- `pnpm --filter @yuta/db-cloud typecheck`, `pnpm -r --if-present typecheck`, `pnpm docs:check`, `pnpm architecture:check`, strict OpenSpec, scoped Prettier/diff checks và global `pnpm format:check` với baseline attribution. Existing `pnpm typegen:next` là bootstrap khi generated Next types chưa có, không sửa tooling hoặc tracked generated files.
- Migration generate/review và apply-to-disposable verification theo D10; broader `pnpm test:cloud` / `pnpm build:cloud` applicability được Tasks chốt từ package/runtime impact. Không invent package build/lint script.

`UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO`. Future executable persistence cần non-browser QA trên real database; không gán QA `NOT_APPLICABLE` chỉ vì no UI. Design-only checks hiện tại không là Apply/VERIFY/QA của implementation chưa tồn tại.

### D10 — Workflow, migration và no premature Knowledge promotion

Sensitive Gate 2b approval chỉ unlock Tasks / Implementation Plan / embedded Technical Implementation Contracts; Apply vẫn cần explicit approval. Không promote Knowledge/lifecycle bằng Design, implementation hoặc passing checks. Canonical reconciliation chỉ sau Gate 3 → `$yuta-finish-change` → authorized Sync → Validate Main Specs → Archive → reviewed Knowledge Consolidation. Không main-spec links cho new capability trước successful authorized sync/validation; không sửa current main authorization/governance specs.

Migration/rollback thực hiện theo section dưới đây; không là approval để run database command, create runtime hoặc deploy trong Design turn.

## Risks / Trade-offs

- Per-template serialization có thể limit concurrent editing → scope là internal bounded administration, không global table lock; one-template transaction ngắn, no external work under lock. Không đổi cardinality để tăng throughput.
- Frozen draft và version giữ duplicate source snapshot → bounded cost đổi lấy exact replay/integrity; không implement purge/retention chưa approved, không cam kết indefinite storage.
- Bytea custom mapping là first local usage → actual driver roundtrip tests bắt buộc; nếu driver không preserve bytes, STOP thay vì silently chuyển text normalization.
- JSONB không giữ original JSON key ordering → applicability identity là structured declaration, không hash của JSON source bytes; content checksum chỉ trên canonical legal source bytes.
- Hash không chống privileged tampering hoặc chứng minh reviewer/legal correctness → scope rõ normal-path immutability, fail-closed reads và separate future governance/evidence.
- Opaque source/assertions có thể chứa inappropriate private text → không evidence schema/CRUD và không actual input runtime; privacy/content handling review trước production, không false automated PII-detection claim.
- Current global reference catalog chưa approved → assertions/unknown là honest non-executable representation; unsupported canonical references fail closed, không invented defaults.
- Current shared db-cloud indexes/journal có unrelated work → fresh path/hash baseline và isolate exact additive edits trước Apply; không rewrite deployed/history migrations hoặc sweep unrelated generated diff.
- Existing architecture summary conflict từ Analysis vẫn còn → không tự sửa canonical summary hoặc lifecycle; post-archive reviewed Knowledge process mới reconcile nếu cần.

## Migration Plan

Đây là future authorized implementation/test plan, **không production rollout authorization**.

1. Trước Apply, hash existing cloud schema/index/journal/migration files và protected auth/tenant/main-spec/Knowledge sources. Xác định exact next unused migration index từ current journal; STOP nếu unrelated changes không isolate được. Không reserve/overwrite concurrent migration.
2. Implement dedicated schema/module và generate bằng existing `pnpm db:cloud:generate` trên approved isolated development context. Review output: chỉ three new tables, own constraints/indexes và new snapshot/journal entry; không alter/drop/backfill existing tenant/auth/Personnel/Pointage/DB-POS/Display data. Không seed actual template content hoặc actor/evidence rows. Không sửa prior migration bytes.
3. Apply bằng existing `pnpm db:cloud:migrate` chỉ tới verified disposable cloud test database sau explicit safe setup approval. Test both clean migration chain và incremental upgrade từ immediately preceding schema; preserve existing tenant records. Validate partial unique index, composite FK, revision uniqueness, bytea roundtrip và all real concurrency tests. Database environmental blockers phải được report, không thay bằng mocked PASS.
4. Compatibility: additive tables không được gọi bởi old application code, không app integration/env variable mới hoặc production toggle. Older code tiếp tục operate tenant resources; new isolated module không alter existing contracts. Không claim tested compatibility trước actual execution.
5. Rollback ứng dụng/package code về previous version có thể để unused additive tables nguyên trạng. Không tự drop tables, reset journal, delete versions hoặc run destructive down migration. Nếu future migration fail, kiểm tra actual transaction/journal state và dùng reviewed forward repair; không assume toàn bộ chain đã rollback. Data-bearing destructive rollback cần separate authorization, verified target/backup và privacy review.

Không còn unresolved mechanism choice bắt buộc để viết Tasks trong bounded scope này. Design decisions vẫn **AWAITING_HUMAN_REVIEW** tại Gate 2b; future deployment environment, actual legal input/privacy/retention và reference-owner activation không được ngầm resolve bằng approval Design. Nếu implementation đòi new role/operation, tenant merge, private evidence, publish/retire execution, invented legal facts, applicability engine hoặc đổi 14/42 semantics: STOP và return Control Tower.
