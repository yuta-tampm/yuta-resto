# Gate 2b — Sensitive Design Review

Change: `personnel-reconstructable-value-history`

Gate: `2b — Sensitive Technical Design`

Review status: `APPROVED`

Created: `2026-09-03T13:56:19.5215416+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `YES — Personnel historical values, privacy, retention, migration and cutover`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-03T14:16:06.3244717+02:00`

## Approved prior gates

### Gate 1

- Packet: `docs/reviews/personnel-reconstructable-value-history/01-analysis-review.md`
- Packet SHA-256: `160e328f6c2683c5378e1cdcff01d8fb2a858065cb60b771e698dd8b964517a1`
- Status: `APPROVED`
- Proposal SHA-256: `9aa477361db22e88bfd6ceefd22b4a7975c1792daee3013da849116244fc913c`
- Analysis SHA-256: `09d50e50cb9a37af7df402025319078ddff446c146c67284f56278131dd25445`

### Gate 2

- Packet: `docs/reviews/personnel-reconstructable-value-history/02-specs-review.md`
- Packet SHA-256: `844ca91a33c0403d38be7b2974a6363285053593d0c13efa74660c14c7ad6f4b`
- Status: `APPROVED`
- Delta spec SHA-256: `0841018f7318820ab52bae6685d58ee4227b207d0ce1520f3eb2dcd3aca7f496`

All reviewed Proposal, Analysis and Spec hashes were recomputed before Design and matched their approved packets.

## Design integrity hash

The exact design bytes were hashed with:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'openspec/changes/personnel-reconstructable-value-history/design.md'
```

| Reviewed artifact                                                    | SHA-256                                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/personnel-reconstructable-value-history/design.md` | `d931e22022dc4a047a78d1fb276a60cb2b232797ebb78a68c11a5eb0e703cfd6` |

## Exact technical design

```text
## Context

F07 mở rộng luồng F03 và `Historique` hiện hữu; xem [proposal.md](proposal.md) và [delta spec](specs/personnel/reconstructable-value-history/spec.md) cho động cơ và hành vi đã duyệt. Hiện tại dossier nằm trong `personnel_employee_dossiers`; mutation dùng optimistic revision, command receipt và audit event trong cùng transaction. Audit thông thường chỉ giữ changed fields/revisions trong JSON metadata, có thể tách Identity và Employment thành hai event cùng operation ID, và chỉ Departure giữ previous/new values giới hạn.

Previous/new Personnel values làm tăng mức nhạy cảm của dữ liệu. Thiết kế phải giữ owner `Personnel`, runtime `apps/backoffice` + `packages/db-cloud`, quyền OWNER-only và full organization + establishment + employee scope. Các gate production về privacy, retention, legal hold, backup và operations vẫn đang blocked; thiết kế này không đóng các gate đó.

## Goals / Non-Goals

**Goals:**

- Tạo bằng chứng append-only, có kiểu và có thể tái dựng theo từng semantic group mà không làm `personnel_employee_audit_events` thành kho payload Personnel tổng quát.
- Cam kết dossier, F07 history, audit tương thích và command receipt trong một transaction.
- Hỗ trợ per-group metadata trong một atomic multi-group F03 mutation.
- Tạo eager cutover baseline đúng một lần cho mỗi dossier hiện hữu với đường chạy lại an toàn.
- Chiếu dữ liệu tối thiểu cần thiết cho OWNER trong timeline newest-50 hiện hữu.
- Tạo đường kỹ thuật cho retention eligibility mà không gắn keep-forever semantics hoặc tự phát minh legal-hold authority.

**Non-Goals:**

- Không dùng hoặc ghi vào Documents, Registre du personnel, Formalités, AI extraction suggestions, consultation history hoặc authentication audit.
- Không tạo scheduled Personnel changes, pending values, future activation, timer hoặc job kích hoạt giá trị tương lai.
- Không thêm permission, không mở MANAGER, không tin scope/role/metadata do browser tự khai.
- Không thay đổi cloud/POS/Display runtime ownership và không tạo cross-runtime behavior.
- Không tái dựng previous/new values còn thiếu trước cutover.
- Không thêm history search, filter, pagination hoặc export.
- Không thực thi production migration, cleanup, rollback hoặc backup operation trong design phase.

## Decisions

### 1. Dedicated event aggregate with per-group immutable children

F07 dùng hai bảng Personnel-owned mới thay vì mở rộng JSON metadata của audit hiện hữu:

- `personnel_employee_history_events` là aggregate header cho một authoritative mutation hoặc một cutover baseline. Nó giữ ID, full tenant/employee scope, event kind (`MUTATION` hoặc `CUTOVER_BASELINE`), operation ID, nullable prior revision, new/current dossier revision, nullable actor user ID, recorded timestamp và payload version.
- `personnel_employee_history_group_changes` giữ một child cho mỗi semantic group thuộc event. Nó lặp lại scoped foreign-key identity cần thiết để không thể nối child cross-tenant, đồng thời giữ semantic group, nullable classification, previous values, new values, nullable effective date và nullable correction reason.

Một unique constraint trên event + semantic group ngăn hai child cho cùng group trong một mutation. Một scoped unique constraint trên employee + operation ID ngăn duplicate mutation event. Một scoped foreign key nối event với dossier; một scoped composite foreign key nối child với event. UUIDv7 tiếp tục là ID business mặc định.

Ordinary mutation có prior/new revisions liên tiếp và classification trên từng child. Cutover có đúng một header event cho dossier với `priorRevision = null`, `newRevision` bằng revision hiện hành tại cutover, và một child snapshot cho mỗi nhóm F07; các child baseline có `previousValues = null`, `classification = null`, `effectiveDate = null`, `correctionReason = null`. Một scoped unique partial constraint trên employee với event kind `CUTOVER_BASELINE` bảo đảm đúng một baseline cho mỗi dossier. Database checks phân biệt metadata được phép của `MUTATION` và `CUTOVER_BASELINE` thay vì chỉ dựa vào TypeScript.

**Alternative — lưu payload trong `personnel_employee_audit_events.metadata`:** bị loại vì audit hiện tại gồm nhiều loại event, có split Identity/Employment, có retention/projection khác và metadata không phải typed reconstructable contract.

**Alternative — một flat row cho mỗi group:** bị loại vì không biểu diễn tự nhiên một atomic multi-group mutation hoặc yêu cầu đúng một cutover baseline cho mỗi dossier.

**Alternative — dùng `personnel_register_corrections`:** bị loại vì Register sở hữu history pháp lý riêng; dùng chung sẽ vi phạm module ownership đã duyệt.

### 2. Versioned, allowlisted group snapshots

`previousValues` và `newValues` là JSON object có `payloadVersion` và đúng allowlist của semantic group:

- Identity: given names, family name;
- Role: position, qualification;
- Contract terms: contract type, expected end date, controlled CDD reason;
- Work time: work-time classification, contractual weekly duration;
- Entry: entry date;
- Departure: departure date.

Mỗi child giữ toàn bộ snapshot của group, kể cả companion field không đổi và explicit `null`, để read model không phải suy đoán trạng thái. Zod contracts trong `@yuta/contracts` tạo discriminated union theo group và version; repository xác thực cả trước khi insert và sau khi read. Raw JSON, tenant IDs, operation IDs và revision internals không được trả trực tiếp cho UI.

Các row là business-immutable: repository không cung cấp update cho event/group; sửa sai sau này append một event mới. Database constraints bảo vệ scope, uniqueness và revision relationship. Xóa/ẩn danh theo privacy lifecycle là ngoại lệ quản trị riêng sau retention, không phải mutation lịch sử thông thường.

**Alternative — wide nullable columns:** bị loại vì tạo nhiều cột rỗng, coupling migration cho từng group và vẫn cần một discriminator. Versioned typed JSON giữ projection tối thiểu nhưng cho phép schema evolution được kiểm soát.

### 3. Server derives changed groups and validates metadata per group

Browser gửi proposed current values và một danh sách metadata keyed by semantic group; browser không quyết định changed-fields truth. Trong scoped transaction, repository đọc current dossier, so sánh authoritative current values với proposed values và tự tạo exact changed-group set.

Validation yêu cầu:

1. đúng một metadata entry cho mỗi changed group cần classification;
2. không có duplicate group hoặc metadata cho group không thay đổi;
3. Identity cho phép `CORRECTION`/`CHANGE`; Entry chỉ `CORRECTION`; Departure giữ flow riêng;
4. Role/Contract terms/Work time `CHANGE` có effective date không sau current business date, không trước authoritative entry date áp dụng cho mutation và không sau departure nếu có;
5. `CORRECTION` không dùng effective date riêng;
6. reason matrix đúng như spec.

Mọi group được validate trước update. Một lỗi ở bất kỳ group nào làm toàn input thất bại; không có current-value write hoặc history child nào được commit.

Request fingerprint của command receipt bao gồm normalized proposed values và normalized per-group metadata. Vì vậy cùng idempotency key với metadata khác tiếp tục là conflict, còn replay cùng payload trả committed result mà không insert event/group lần hai.

### 4. One transaction owns mutation, compatibility audit, F07 history and receipt

Luồng update giữ một database transaction trong `packages/db-cloud`:

1. xác thực trusted establishment scope và user actor;
2. kiểm tra command receipt/idempotency;
3. đọc scoped current dossier và kiểm tra expected revision;
4. derive changed groups và validate toàn bộ per-group metadata;
5. update dossier bằng revision compare-and-swap;
6. insert một F07 event header và mọi group child;
7. insert audit event hiện hữu cần giữ để tương thích;
8. insert command receipt;
9. commit.

Bất kỳ lỗi nào từ bước 3–8 rollback toàn bộ transaction. Stale revision không tạo F07 event. Idempotent replay không tạo event mới. No-op mutation không tạo reconstructable history. Departure recording/correction/cancellation dùng cùng transaction pattern; legacy departure audit vẫn được ghi, còn F07 child giữ snapshot Departure tương thích.

Operation ID nội bộ liên kết compatibility audit với F07 event nhưng không được dùng như browser authority hoặc trả thẳng cho UI.

### 5. Eager cutover uses one scoped transaction and a completion marker

Một bảng marker `personnel_history_cutovers` do Personnel sở hữu giữ organization, establishment, cutover version, cutover timestamp và completed timestamp. Unique scope + version bảo đảm một completed cutover cho mỗi establishment/version. Marker là operational activation evidence, không phải scheduled Personnel state.

Cutover chạy theo establishment:

1. lấy exclusive transaction advisory lock cho organization + establishment + F07 cutover version;
2. xác lập một `cutoverAt` cố định;
3. đọc toàn bộ dossier tồn tại trong scope tại cutover;
4. insert một baseline event cho mỗi dossier và group snapshots từ authoritative current row;
5. kiểm tra số dossier áp dụng bằng số unique baseline vừa tồn tại trong scope;
6. insert completion marker;
7. commit tất cả hoặc rollback tất cả.

F07-aware create/update/departure paths dùng shared transaction advisory lock cùng scope trong cửa sổ activation. Shared mutation locks có thể chạy đồng thời với nhau nhưng chặn bởi exclusive cutover lock. Mutation hoàn tất trước cutover được baseline phản ánh; dossier tạo sau completed cutover không nhận baseline. Khi F07 được enable, mutation fail closed nếu completion marker đúng version chưa tồn tại.

Restart sau failure là an toàn vì transaction chưa commit không để lại marker/baseline; retry chạy lại. Nếu caller retry sau commit nhưng mất response, unique marker và unique baseline constraint biến lần chạy thành verified no-op, không tạo baseline thứ hai.

Rollout cần code hỗ trợ lock/marker được deploy nhưng F07 vẫn disabled, sau đó cutover hoàn tất và được kiểm tra, rồi mới enable F07. Một runtime cũ không biết shared lock không được phép tiếp tục ghi trong cutover window; production orchestration vẫn là gate riêng.

**Alternative — lazy baseline ở mutation đầu tiên:** bị loại vì trái eager cutover Product Decision và tạo điểm bắt đầu không đồng nhất.

**Alternative — baseline trong một migration SQL không có marker/coordination:** bị loại vì retry/race với dossier creation không đủ rõ và khó chứng minh exactly-once.

### 6. Historique merges F07 events without duplicating compatibility audit

Read repository tạo một unified business-history candidate set:

- F07 mutation/cutover events;
- legacy allowlisted audit events không có F07 event tương ứng, gồm pre-cutover history và các event ngoài reconstructable mutation;
- loại compatibility audit row đã được đại diện bởi cùng F07 operation để một mutation không hiện hai lần.

Query luôn lặp lại full organization + establishment + employee predicates, order by recorded timestamp rồi stable ID descending, lấy 51 candidate và trả 50 để giữ truncation semantics. Không thêm cursor, search, filter hoặc export.

Projection là discriminated union:

- legacy item giữ shape tối thiểu hiện tại;
- reconstructable mutation item có per-group previous/new values, classification, applicable effective date/reason, actor display name và recorded timestamp;
- cutover item có group current-at-cutover snapshots, nhãn baseline rõ ràng, actor trung lập và không có invented previous values/classification/effective date/reason.

Server action tiếp tục yêu cầu `personnel.employee.read`; permission map vẫn OWNER-only. UI chỉ render safe parsed DTO. Deleted actor hoặc system baseline hiển thị attribution trung lập; actor ID và raw metadata không được lộ.

### 7. Privacy minimization and retention eligibility stay Personnel-owned

Thiết kế chỉ lưu các field trong sáu semantic group, classification, metadata có điều kiện, revision linkage, actor và timestamps cần cho reconstruction/integrity. Nó không lưu form dump, request headers, IP/user-agent, document text, AI prompt/output hoặc unrelated dossier data. Correction reason tiếp tục có giới hạn độ dài và không được dùng để lưu tài liệu tự do.

Retention eligibility không được đóng cứng vào immutable history row vì departure có thể được sửa hoặc hủy. Personnel privacy boundary sẽ tính eligibility từ authoritative establishment departure: giữ khi còn attached và đến đủ 5 năm sau departure. Một legal hold/nghĩa vụ đã được phê duyệt riêng có thể chặn eligibility trong đúng phạm vi quyết định đó; F07 không tự tạo legal-hold source hoặc shared retention contract.

Khi đủ điều kiện và không có override hợp lệ, privacy process được duyệt sau này có thể xóa event/group hoặc áp dụng irreversible anonymization theo policy đã duyệt. Business repository không có keep-forever flag. Apply của F07 không được bật production cleanup khi `HR-RET-01`, `HR-AUDIT-01`, backup/replica propagation và legal-hold authority còn blocked; điều này giữ production fail-closed nhưng không đổi Product baseline.

### 8. Security and tenancy remain fail closed

Mọi repository method nhận trusted `TenantContext`, yêu cầu establishment và lặp lại organization + establishment + employee scope ở dossier, event, child, cutover marker và history query. Composite constraints ngăn cross-establishment linkage ngay cả khi application có lỗi. Resource ID, group metadata, role, permission và tenant values từ browser không bao giờ tạo authority.

Write action tiếp tục yêu cầu `personnel.employee.manage`; history read tiếp tục yêu cầu `personnel.employee.read`; cả hai permission vẫn map duy nhất tới OWNER. MANAGER/STAFF, suspended membership, wrong organization/establishment và stale access fail closed trước khi trả hoặc ghi sensitive history.

### 9. Migration, rollback and backup interaction

Migration design là additive và chia gate:

1. thêm event, group và cutover-marker tables/constraints/indexes khi feature disabled;
2. deploy F07-aware code vẫn disabled;
3. chạy eager scoped cutover và kiểm tra counts/uniqueness/snapshot parsing;
4. chỉ enable F07 cho scope có completed marker;
5. chạy read/mutation verification trước mọi production consideration.

Không sửa migration đã deploy. Không drop hoặc rewrite legacy audit events. Không backfill invented pre-cutover changes.

Rollback trước cutover có thể quay application về behavior cũ trong khi giữ additive tables chưa dùng. Sau khi bất kỳ F07 mutation/baseline đã commit, rollback không được drop history tables hoặc cho old writer tiếp tục mutation thiếu F07 evidence; lựa chọn an toàn là disable Personnel mutation/fail closed và roll forward. Destructive down migration cần phê duyệt riêng và không thuộc F07.

Backup/PITR phải chụp và restore dossier, F07 event/group, compatibility audit, command receipt và cutover marker về cùng một consistency point. Restore test phải chứng minh baseline uniqueness và revision/history linkage. Khi privacy deletion/anonymization được duyệt, backup/replica aging và restore behavior phải theo retention policy tương ứng; local success không chứng minh production backup compliance.

## Risks / Trade-offs

- **[Sensitive-data amplification]** Previous values giữ thêm Personnel PII → allowlist theo group, safe DTO, OWNER-only read, không raw metadata và retention eligibility bắt buộc.
- **[JSON payload drift]** JSON linh hoạt hơn database columns → payload version + discriminated Zod validation on write/read; unknown version fails closed.
- **[Audit duplication]** Compatibility audit và F07 event cùng tồn tại → unified projection suppresses audit represented by the same operation while retaining legacy rows.
- **[Cutover race]** Dossier có thể được tạo hoặc sửa trong snapshot → shared/exclusive scoped advisory locks, completion marker và activation fail-closed.
- **[Cutover transaction size]** Một establishment có thể giữ lock trong thời gian snapshot → chạy từng establishment, đo trước row count và dừng nếu vượt operational threshold; không đổi sang partial commit vì sẽ phá atomic cutover.
- **[Rollback data loss]** Old writer sau activation có thể tạo current values thiếu history → không cho rollback writer; fail closed và roll forward while preserving tables.
- **[Immutability versus privacy erasure]** Retention action phải phá reconstructability một cách có chủ đích → chỉ privacy lifecycle được duyệt mới được xóa/ẩn danh; không có business update API.
- **[Legal-hold authority absent]** Tự phát minh hold source sẽ vượt scope → cleanup không được production-enable đến khi authority riêng được duyệt; Product eligibility rule vẫn được giữ.
- **[Backup resurrection]** Dữ liệu đã xóa có thể còn trong backup → production blocked cho đến khi backup aging/restore process được duyệt và kiểm thử.
- **[Actor deletion]** User actor có thể bị xóa → nullable actor foreign key và neutral attribution, không mất event integrity.

## Migration Plan

1. Ở Apply sau Sensitive Design approval, tạo additive schema/migration và contract/repository tests trên disposable cloud database; chưa enable production.
2. Thêm typed group snapshots, mutation metadata validation và atomic repository write phía sau F07 activation guard.
3. Thêm cutover runner + marker + shared/exclusive locking; kiểm thử fresh run, retry before/after commit, concurrent create và failure rollback.
4. Thêm unified newest-50 history projection và OWNER-only UI; kiểm thử legacy-only, mixed legacy/F07, baseline và no-duplicate operation.
5. Chạy local disposable migration/cutover verification với dữ liệu không thật và evidence count/hash; không dùng Personnel production data.
6. Giữ feature disabled ngoài scope được duyệt. Production rollout, retention executor, legal-hold integration và backup/restore approval là các gate riêng.

Rollback strategy:

- trước cutover: giữ additive schema, disable feature và quay application code nếu cần;
- sau cutover/F07 writes: giữ dữ liệu, chặn mutation nếu writer tương thích không sẵn sàng, và roll forward;
- không tự động drop tables, xóa baseline hoặc rewrite history.

## Open Questions

- Batch/maintenance-window threshold cho một establishment và thời lượng backup/PITR cụ thể được chốt trong production operations review; chúng không thay đổi spec, data model hoặc local task breakdown.
- Approved legal-hold source và lựa chọn cuối giữa deletion với irreversible anonymization thuộc Personnel privacy process/production gate; F07 chỉ cung cấp eligibility boundary và không kích hoạt cleanup trước approval đó.
```

## Sensitive design evaluation

### Privacy exposure

**Assessment:** Controlled in design, still production-gated.

Previous values create a larger and longer-lived Personnel data set than the current minimized audit. The design limits storage to six approved semantic groups plus classification, conditional metadata, actor, revisions and timestamps. It prohibits form dumps, document contents, AI data, request headers and browser telemetry. UI receives only parsed safe DTOs.

The design does not claim that existing privacy/legal gates are closed. Production remains blocked by `HR-RET-01`, `HR-AUDIT-01`, backup/replica propagation and the approved legal-hold source.

### Data minimization

**Assessment:** PASS for the approved reconstructability purpose.

Each history child stores the complete snapshot of only its changed semantic group. Companion fields are retained because reconstructing the coupled Contract terms or Work time state would otherwise require inference. Unchanged groups and unrelated dossier fields are not copied. Conditional effective date/reason fields remain absent when not applicable.

### Immutable-history integrity

**Assessment:** PASS at design level.

Business mutations are append-only. A correction creates a new event instead of editing prior evidence. Event/group uniqueness, scoped foreign keys, revision linkage, typed payload versions and transactional writes prevent partial or cross-scope evidence. Ordinary repositories expose no history update path.

Privacy deletion or irreversible anonymization is a separately authorized lifecycle exception after retention, not a normal history edit.

### Cutover safety

**Assessment:** PASS at design level, subject to migration verification.

The design uses one establishment-scoped transaction, an exclusive advisory lock, a fixed cutover timestamp, unique baseline constraints, count verification and a completion marker. F07-aware mutations use compatible shared locks during activation. A dossier committed before cutover is included; a dossier created after completed cutover receives no fake baseline.

### Retention and anonymization path

**Assessment:** Bounded and non-production.

Eligibility is derived from authoritative departure state rather than stored on immutable events, so departure correction/cancellation cannot leave a stale deletion deadline. History remains in-scope while attached and for five years after departure. An approved legal hold can block eligibility only through the future approved Personnel privacy authority.

The current change does not choose or activate a production deletion/anonymization executor. There is no keep-forever flag; production enablement remains blocked until the privacy process chooses deletion or demonstrably irreversible anonymization and proves backup/replica propagation.

### Rollback and backup implications

**Assessment:** Safe direction defined; operational approval still required.

Schema rollout is additive. Before cutover the feature can remain disabled while unused tables stay present. After baseline or mutation history exists, rollback must retain the new data, prevent an old writer from creating unhistorized mutations and roll forward. Automatic destructive down migration is forbidden.

Backup/PITR must restore dossier, F07 event/group, audit, command receipt and cutover marker to one consistency point. Restore verification must check revision linkage and baseline uniqueness. Privacy-deleted data persisting or reappearing through backups remains a production gate.

### Tenant isolation

**Assessment:** PASS at design level.

Every event, child, marker, read and write retains organization + establishment + employee scope. Composite foreign keys prevent cross-establishment linkage. Resource ID alone is insufficient, and browser-provided scope is ignored.

### Authorization

**Assessment:** PASS at design level.

Mutation continues to require `personnel.employee.manage`; history continues to require `personnel.employee.read`. Both remain OWNER-only. No new permission or MANAGER path is introduced. System cutover attribution is neutral and does not grant a user authority.

### Migration failure and restart behavior

**Assessment:** PASS at design level.

A failure before transaction commit leaves neither partial baselines nor completion marker. Retry re-executes safely. A lost response after commit is handled by unique marker/baseline constraints and verified no-op behavior. F07 mutation remains disabled/fail-closed for a scope without the expected completed marker.

Production execution, maintenance windows and database backup operations are explicitly not authorized by this design.

## Runtime, data and security implications

- Runtime owner remains `apps/backoffice`.
- Canonical data owner remains Personnel in `packages/db-cloud`.
- No external provider or cross-runtime dependency is added.
- Current audit and command-receipt behavior remains for compatibility and idempotency.
- A dedicated Personnel event/group aggregate avoids converting generic audit metadata into a broad PII store.
- Historique merges F07 with legacy business events, suppresses compatibility duplicates and preserves newest-50 behavior.
- No Documents, Register, Formalités, AI, consultation or authentication history write is introduced.

## Migration and rollback summary

Proposed future implementation order, not execution authorization:

1. additive schema with F07 disabled;
2. F07-aware code deployed but disabled;
3. establishment-scoped eager cutover with locks, unique constraints and completion marker;
4. verification of counts, parsing and exactly-once behavior;
5. enable only verified scopes.

Rollback after F07 data exists retains schema/data, prevents old writers and rolls forward. Destructive rollback is outside scope.

## Unresolved but deferrable choices

- Establishment row-count threshold and maintenance-window duration.
- Exact production backup/PITR retention configuration.
- Approved legal-hold source.
- Final approved privacy action: deletion or irreversible anonymization.

These do not change the current Spec, chosen F07 data model or local implementation task breakdown because production cleanup and production release remain outside this change. If any later decision changes the Product retention/privacy boundary, canonical owner, authorization or runtime, the change returns to Control Tower.

## Validation

Command:

```powershell
pnpm exec openspec validate personnel-reconstructable-value-history --strict --json
```

Result: `PASS — 1/1 change valid, zero issues`.

## Recommendation

The design satisfies the approved behavioral Spec without changing Personnel ownership, OWNER-only authorization, trusted tenant scope, departure compatibility, retention Product baseline or module exclusions.

Recommendation: approve the Sensitive Design Gate to permit creation of Tasks only. Approval does not authorize schema, migration, API, UI or implementation work, production release, sync or archive.
