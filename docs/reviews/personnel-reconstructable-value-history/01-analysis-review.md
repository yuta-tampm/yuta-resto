# Gate 1 — Analysis Review

Change: `personnel-reconstructable-value-history`

Gate: `1 — Proposal + Analysis`

Review status: `APPROVED`

Created: `2026-09-03T11:19:14.7085233+02:00`

Regenerated: `2026-09-03T12:18:05.0558614+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `YES — Personnel historical values, privacy and retention`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-03T13:08:00.4192298+02:00`

Previous approval source: explicit current-user instruction

Previous approval recorded by: Codex workflow

Previous approval timestamp: `2026-09-03T11:25:43.7321789+02:00`

Previous Gate 1 approval: `SUPERSEDED_FOR_EFFECTIVE_DATE_RULE`

Superseded: `2026-09-03T12:18:05.0558614+02:00`

## Provenance

- Origin: YUTA Control Tower handoff supplied by the current user.
- Classification: `PAGE_LOCAL`.
- Repository revision at packet regeneration: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- The earlier Gate 1 review cycle resolved five Product questions and was approved on `2026-09-03T11:25:43.7321789+02:00`.
- The current user has now superseded only its rule allowing future business-effective dates for Role, Contract terms and Work time `CHANGE`.
- The revised Product Decision limits effective dates to the past or today, explicitly excludes scheduled/future Personnel changes, and clarifies per-changed-group classification and conditional metadata.
- Immediately before this targeted revision, Proposal and Analysis matched the prior approved hashes exactly.
- The existing delta Spec and Gate 2 packet remain byte-identical and are not revised or re-approved by this Gate 1 regeneration. They require a separate post-Gate-1 workflow step before they can represent the revised Product Decision.
- OpenSpec root: nearest repository root at `D:\working\yuta\yuta-resto`.
- The change remains pinned to `yuta-spec-driven`.
- This packet stops before specs, design, tasks, schema, migration, API and implementation.

## Integrity hashes

Hashes cover the exact artifact bytes reviewed. They were generated with:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'openspec/changes/personnel-reconstructable-value-history/analysis.md','openspec/changes/personnel-reconstructable-value-history/proposal.md'
```

The hexadecimal output was rendered in lowercase and sorted by repository-relative path.

Prior approved Gate 1 artifact hashes before this targeted revision were:

- Proposal: `103b4809344e78dfdead5016376b459456245176a30e2b115347106a75d831f4`
- Analysis: `73304502020c7941bc7728228fc3bc4b13e7dc3da3f6510cdd276e4889c48b8a`

| Reviewed artifact                                                      | SHA-256                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/personnel-reconstructable-value-history/analysis.md` | `09d50e50cb9a37af7df402025319078ddff446c146c67284f56278131dd25445` |
| `openspec/changes/personnel-reconstructable-value-history/proposal.md` | `9aa477361db22e88bfd6ceefd22b4a7975c1792daee3013da849116244fc913c` |

Protected later artifacts were not edited:

- Existing delta Spec: `51d253bdb2358d37c76cdf261afed928468eeaaf260eceb28768c186940c18e2`
- Existing Gate 2 packet: `58dc08b115dccd6a21fb7dac48f70a22553fcdab241404de23f3efe725868e00`

## Request and bounded change summary

F07 extends the existing Personnel history so future approved mutations preserve reconstructable previous/new authoritative values. It preserves Personnel ownership, OWNER-only authorization, trusted organization and establishment scope, the current F03 flow, revision conflict semantics, idempotency, current history loading and departure behavior.

The revised Product decisions define identity and entry classification, per-changed-group classification and conditional metadata, effective-date validation, correction-reason requirements, eager exactly-once cutover baseline behavior and the details visible to OWNER in the existing newest-50 `Historique`.

For Role, Contract terms and Work time `CHANGE`, effective date is required and may be in the past or today only. It may not precede the authoritative entry date applicable to the mutation or follow an existing departure date. Future effective dates and scheduled/pending Personnel changes are out of scope; `CORRECTION` has no separate business-effective date.

The change does not reconstruct missing past values; merge Documents, Register, Formalités, AI, consultation or auth audit; add MANAGER access; cross runtimes; release production; or change the approved retention/privacy baseline.

## Exact proposal

```text
## Why

Lịch sử hồ sơ nhân viên hiện chỉ cho biết loại sự kiện và các trường đã thay đổi, nên không thể tái dựng các giá trị có thẩm quyền trước và sau một lần sửa thông thường. F07 mở rộng đúng capability Personnel hiện hữu để các thay đổi được phê duyệt trong tương lai có bằng chứng giá trị có thể tái dựng, đồng thời giữ nguyên ranh giới quyền, tenant, xung đột phiên bản, chống gửi trùng và ý nghĩa nghỉ việc hiện có. F07 chỉ ghi lịch sử có thể tái dựng cho các mutation có thẩm quyền trở thành current khi commit thành công; future effective date bị loại vì sẽ cần một scheduled/pending Personnel state model riêng với activation, cancellation/change và conflict semantics chưa thuộc scope này.

## What Changes

- Ghi nhận giá trị có thẩm quyền trước và sau cho các nhóm dữ liệu Personnel được duyệt: danh tính, vai trò, điều khoản hợp đồng, thời gian làm việc, ngày vào làm và nghỉ việc.
- Phân biệt `CORRECTION` (giá trị đã lưu trước đó là sai) với `CHANGE` (giá trị cũ từng đúng và giá trị mới có hiệu lực từ một thời điểm nghiệp vụ khác). Với danh tính, `OWNER` chọn ý nghĩa cho mutation; ngày vào làm chỉ được sửa dưới dạng `CORRECTION` và không có ngoại lệ trong F07. Khi một mutation thay đổi nhiều semantic group, classification và conditional metadata được đánh giá riêng cho từng changed group; đây là clarification của multi-group requirement hiện hữu và không đổi ownership hoặc scope.
- Bắt buộc ngày có hiệu lực nghiệp vụ cho `CHANGE` thuộc vai trò, điều khoản hợp đồng và thời gian làm việc. Ngày này chỉ có thể ở quá khứ hoặc hôm nay, không được trước authoritative entry date áp dụng cho mutation và không được sau departure date nếu đã có ngày nghỉ. Future effective dates và scheduled/pending Personnel changes nằm ngoài F07. `CORRECTION` không dùng ngày có hiệu lực riêng.
- Bắt buộc lý do cho correction ngày vào làm, điều khoản hợp đồng, giá trị thời gian làm việc theo hợp đồng và sửa/hủy ngày nghỉ việc. Lý do là tùy chọn cho correction danh tính và vai trò; `CHANGE` không yêu cầu lý do.
- Tạo eager cutover baseline cho mọi dossier Personnel hiện hữu khi F07 được kích hoạt, chính xác một baseline cho mỗi dossier áp dụng. Baseline chỉ thể hiện các giá trị có thẩm quyền hiện hành tại cutover và không bao giờ được trình bày như sự thật lịch sử trước cutover.
- Bảo đảm một mutation Personnel thành công và bằng chứng lịch sử bắt buộc của mutation đó được ghi nhận cùng nhau, không thể âm thầm lệch nhau.
- Giữ lịch sử tái dựng trong khi nhân viên còn gắn với establishment và 5 năm sau ngày nghỉ; sau đó dữ liệu phải đủ điều kiện xóa hoặc ẩn danh không thể đảo ngược theo quy trình privacy Personnel được duyệt, trừ nghĩa vụ pháp lý hoặc legal hold được phê duyệt riêng.
- Mở rộng Historique hiện hữu; không xây dựng lại timeline và không trộn Documents, Registre du personnel, Formalités, gợi ý AI, lịch sử truy cập hoặc audit xác thực.
- Cho phép `OWNER` xem nhóm ngữ nghĩa, `CORRECTION`/`CHANGE`, giá trị trước/sau, ngày có hiệu lực và lý do khi áp dụng, actor và thời điểm ghi nhận trong `Historique`. Giữ giới hạn 50 mục mới nhất; không thêm tìm kiếm, bộ lọc, phân trang hoặc xuất dữ liệu.
- Không mở quyền cho `MANAGER`, không thay đổi ranh giới organization/establishment, không phát hành production và không tái dựng các giá trị quá khứ còn thiếu.

## Capabilities

### New Capabilities

- `personnel/reconstructable-value-history`: Lịch sử giá trị có thể tái dựng cho các dữ liệu nhân viên và quan hệ lao động hiện tại do Personnel sở hữu.

### Modified Capabilities

Không có. Repository hiện chưa có main spec Personnel để sửa đổi.

## Impact

- Hành vi bị ảnh hưởng: luồng sửa hồ sơ F03, luồng nghỉ việc hiện hữu và tab `Historique` tại `/equipe/salaries`.
- Ranh giới kỹ thuật dự kiến cần thay đổi sau khi planning được duyệt: contract Personnel, schema/migration và repository trong `packages/db-cloud`, server action và UI/test liên quan trong `apps/backoffice`.
- Dữ liệu vẫn do Personnel sở hữu trong cloud, luôn được giới hạn bằng organization và establishment đáng tin cậy; quyền `personnel.employee.read/manage` hiện hữu tiếp tục chỉ dành cho `OWNER`.
- Không thêm dịch vụ ngoài, không ghi vào Documents/Register/Formalités, không thay đổi runtime khác và không tạo tuyên bố tuân thủ pháp lý hoặc production readiness.
```

## Exact analysis

```text
# Change Analysis

## Scope and Change Type

F07 là thay đổi hành vi và dữ liệu nhạy cảm trong capability `Personnel → Employee dossier / Historique`. Phạm vi chỉ mở rộng lịch sử hiện hữu để các mutation Personnel được duyệt trong tương lai có thể giữ giá trị có thẩm quyền trước/sau; không xây dựng lại timeline, không tái dựng quá khứ còn thiếu và không hợp nhất lịch sử của module khác. Mutation có thẩm quyền trở thành current khi commit thành công; F07 không tạo scheduled/pending Personnel state hoặc future activation semantics.

Change tác động UI, contract và dữ liệu lưu trữ; có yêu cầu về privacy/retention và atomicity. Nó không phải refactor hoặc tài liệu thuần túy, không đủ điều kiện dùng `skip_specs: true`.

## Sources Consulted

- Product Intent và ownership: [Personnel Product Knowledge](../../../docs/features/personnel/README.md), [Salariés page pack — F07](../../../docs/ui/pages/backoffice-equipe-salaries/README.md), cùng handoff Control Tower đã được người dùng cung cấp cho change này.
- Authority và lifecycle: [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [OpenSpec Normativity Policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
- Security/runtime boundaries: [Tenancy](../../../docs/architecture/TENANCY.md), [Authentication](../../../docs/architecture/AUTHENTICATION.md), [Database Boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md).
- Implemented State: [Personnel contracts](../../../packages/contracts/src/personnel/index.ts), [Personnel executable schema](../../../packages/db-cloud/src/schema/personnel.ts), [Personnel repository](../../../packages/db-cloud/src/personnel-repository.ts), [Salariés server actions](<../../../apps/backoffice/src/app/(authenticated)/equipe/salaries/actions.ts>), [Personnel permissions](../../../apps/backoffice/src/server/auth/permissions.ts), và [repository integration tests](../../../packages/db-cloud/test/personnel-repository.integration.test.ts).

## Authority and Product Decision

Handoff hiện tại là Product input cụ thể cho F07 và phù hợp với ownership đã được Personnel Product Knowledge chấp nhận: Personnel sở hữu hồ sơ nhân viên, dữ liệu quan hệ lao động hiện tại và lịch sử tái dựng của chính các dữ liệu đó.

Các ranh giới được xác nhận:

- chỉ `OWNER` có quyền đọc/quản lý Personnel; không mở cho `MANAGER`;
- mọi thao tác dùng organization và establishment từ session đáng tin cậy;
- Documents, Register, Formalités, AI extraction, consultation/access history và auth audit giữ owner và ý nghĩa riêng;
- không thay đổi runtime cloud Backoffice / `packages/db-cloud`;
- không phát hành production và không tuyên bố tuân thủ pháp lý;
- lịch sử không mang nghĩa giữ vĩnh viễn: baseline sản phẩm là khi còn gắn với establishment cộng 5 năm sau departure, sau đó đủ điều kiện xóa hoặc ẩn danh không thể đảo ngược, trừ nghĩa vụ/legal hold được duyệt riêng.

Product decisions bổ sung tại Gate 1 xác định đầy đủ hành vi F07:

- identity có thể là `CORRECTION` hoặc `CHANGE`, do `OWNER` chọn ý nghĩa cho mutation; entry date chỉ là `CORRECTION`;
- classification và conditional metadata được đánh giá riêng cho từng changed semantic group trong một multi-group mutation; clarification này không đổi ownership hoặc scope;
- `CHANGE` của Role, Contract terms và Work time bắt buộc business-effective date; ngày chỉ có thể ở quá khứ hoặc hôm nay, không trước authoritative entry date áp dụng cho mutation và không sau departure date nếu departure đã tồn tại; future effective date bị từ chối và `CORRECTION` không dùng effective date riêng;
- correction reason bắt buộc cho Entry, Contract terms, Work-time contractual values và departure correction/cancellation; tùy chọn cho Identity và Role; không yêu cầu cho `CHANGE`;
- activation tạo eager baseline đúng một lần cho từng dossier hiện hữu áp dụng, chỉ mang nghĩa current-at-cutover;
- `OWNER` xem các chi tiết tái dựng được trong `Historique`, vẫn giới hạn 50 event mới nhất và không có search/filter/pagination/export.

Không phát hiện `CONFLICT` về owner, authorization, tenant hoặc runtime. Không cần permission mới theo bằng chứng repository hiện tại.

Future effective date không thể được thêm như một biến thể validation đơn giản: nó sẽ cần một scheduled/pending Personnel state model riêng, gồm activation semantics, cancellation hoặc thay đổi future mutation, conflict handling và quan hệ với current authoritative values. Toàn bộ model đó nằm ngoài F07; lịch sử F07 chỉ ghi nhận authoritative mutation trở thành current khi commit thành công.

## Current Implemented State

Repository hiện thực hiện:

- hồ sơ nhân viên có các trường F03 được nêu trong handoff và một `revision` hiện tại;
- update thông thường kiểm tra full tenant scope, stale revision và idempotency, sau đó cập nhật dossier và thêm audit event trong cùng transaction;
- audit thông thường chỉ lưu nhóm trường đã đổi và revision trước/sau, không lưu giá trị trước/sau, classification `CORRECTION`/`CHANGE`, ngày có hiệu lực hoặc lý do sửa thông thường;
- một update có thể tạo riêng event identity và employment nhưng dùng chung operation ID nội bộ;
- departure đã lưu previous/new departure date và bắt buộc lý do khi sửa hoặc hủy;
- tab `Historique` đọc theo yêu cầu, giới hạn 50 event mới nhất, tách khỏi `Consultations`, và được làm mới đúng sau khi F03 save thành công;
- contract công khai của history hiện chỉ chiếu nhãn event, trường đổi, actor, thời gian và dữ liệu departure giới hạn.

Repository chưa thực hiện phần F07 mới:

- lịch sử giá trị đầy đủ cho identity/role/contract/work-time/entry;
- classification `CORRECTION`/`CHANGE` cho các mutation thông thường;
- business-effective date hoặc correction reason cho F03;
- cutover baseline cho hồ sơ hiện hữu;
- eager cutover baseline và cơ chế thực thi retention/anonymization cho lịch sử F07;
- projection `Historique` chứa nhóm ngữ nghĩa, classification, previous/new values, effective date và correction reason theo các quy tắc vừa được duyệt.

Các integration test hiện có chứng minh atomic update/audit, idempotent replay, stale-revision conflict, cross-establishment denial và departure correction trong repository. Đây là bằng chứng repository, không phải bằng chứng deployed runtime hoặc production readiness.

## Affected Boundaries

- **Runtime owner:** giữ nguyên `apps/backoffice`.
- **Data owner:** giữ nguyên Personnel trong `packages/db-cloud`; không dùng Register history làm mẫu sở hữu chung và không tạo shared history contract.
- **Tenancy:** giữ full `organizationId + establishmentId + employeeId` cho read/write; resource ID đơn lẻ không đủ thẩm quyền.
- **Authorization:** tái sử dụng `personnel.employee.read/manage`, hiện chỉ `OWNER`; client visibility không thay server guard.
- **Public/local boundary:** capability cloud Backoffice, không liên quan POS, Site Agent hoặc Display.
- **External provider/device:** không bị ảnh hưởng.
- **Cross-module:** không ghi vào Documents, Register hoặc Formalités và không đưa event truy cập/xác thực vào business history.
- **Sensitive data:** previous/new values làm tăng lượng dữ liệu Personnel nhạy cảm được giữ lại; Sensitive Design Gate là bắt buộc trước implementation.

Không có stop condition nào của Control Tower đã xảy ra trong repository analysis.

## Lifecycle Baseline

Theo Personnel Product Knowledge và Module Registry cho bounded employee dossier:

- **Product Decision:** `APPROVED` cho capability hiện hữu; F07 là thay đổi mới đang ở OpenSpec review, chưa tự động đổi lifecycle.
- **Implementation:** capability dossier hiện hữu là `IMPLEMENTED`; phần reconstructable value history của F07 là `NOT_IMPLEMENTED` theo bằng chứng code/schema.
- **Environment:** `UNVERIFIED`.
- **Production Readiness:** `BLOCKED` bởi các gate Personnel, gồm privacy/retention/security/operations.
- **External Dependency:** `BLOCKED` ở mức Personnel production; F07 không thêm provider ngoài.

Việc tạo proposal/analysis không thay đổi bất kỳ giá trị lifecycle nào và các artifact trong `openspec/changes/**` vẫn non-normative.

## Requirement Readiness

`READY_FOR_SPECS`

Các quyết định Product hiện đã đủ để viết behavioral specs có thể kiểm thử mà không đoán:

- phạm vi các nhóm dữ liệu và classification hợp lệ;
- người chọn ý nghĩa mutation;
- classification và conditional metadata theo từng changed semantic group;
- điều kiện bắt buộc, miền quá khứ/hôm nay và việc từ chối future effective date;
- ma trận correction reason;
- eager cutover, tính duy nhất và giới hạn ý nghĩa của baseline;
- dữ liệu F07 được hiển thị cho `OWNER` trong timeline hiện hữu;
- giới hạn newest-50 và các chức năng không được thêm;
- atomicity, tenancy, authorization, retention/privacy baseline và module exclusions.

Change có hành vi quan sát được và cần delta spec tại `personnel/reconstructable-value-history`. Delta spec hiện hữu vẫn giữ bytes của quyết định trước và phải được targeted-revise sau khi Gate 1 này được phê duyệt; không dùng `skip_specs: true`.

## UI / UX Applicability

UI/UX bị ảnh hưởng vì F03 cần thu thập classification và có điều kiện thu thập effective date/reason theo từng changed semantic group. Effective date chỉ chấp nhận quá khứ hoặc hôm nay; UI không được biểu diễn scheduled/pending future change. Tab `Historique` phải trình bày cho `OWNER` nhóm ngữ nghĩa, classification, previous/new values, effective date khi áp dụng, correction reason khi áp dụng, actor và recorded timestamp. Authority UI là shared/backoffice rules và [Salariés page pack](../../../docs/ui/pages/backoffice-equipe-salaries/README.md). Screenshot hoặc mockup không được dùng để thay đổi các quyết định Product này.

Không tạo design prompt hoặc UX artifact trong Gate 1 này. Sau khi các quyết định requirement được duyệt và specs được chấp thuận, thiết kế phải đi qua Sensitive Design Gate riêng.

## Conflicts and Unknowns

- Không còn `CONFLICT` hoặc requirement-level `NEEDS REVIEW` sau các quyết định Product Gate 1 hiện tại.
- Delta spec và Gate 2 packet hiện hữu vẫn phản ánh quy tắc effective date cũ. Chúng được giữ nguyên theo yêu cầu của current user, không phải bằng chứng cho Product Decision mới, và phải được revise/regenerate ở bước riêng sau Gate 1 approval.
- **Deferrable to Sensitive Design Gate:** cách lưu, migration/cutover execution, bảo đảm exactly-once baseline, cơ chế cleanup/anonymization, rollback và backup interaction. Các quyết định kỹ thuật này không được làm thay đổi hành vi specs hoặc retention/privacy Product baseline đã phê duyệt.
- Nếu thiết kế cần permission mới, owner mới, shared history/retention contract, ghi vào module khác, thay đổi tenant/runtime boundary hoặc thay đổi retention/privacy Product boundary, workflow phải dừng và quay lại Control Tower.

## Analysis Conclusion

Bounded scope và capability mới `personnel/reconstructable-value-history` được xác nhận; không có yêu cầu mở rộng owner, permission, tenant boundary, runtime hoặc module khác. Future effective dates và scheduled/pending Personnel changes bị loại khỏi F07; multi-group classification/metadata tiếp tục được đánh giá theo từng changed semantic group. Không phát hiện conflict, unresolved requirement hoặc Control Tower stop condition mới. Change có spec-level behavior nên không được dùng `skip_specs: true`.

Kết luận là `READY_FOR_SPECS`. Workflow vẫn phải dừng tại Gate 1 để con người duyệt Proposal và Analysis đã sửa cùng hash mới. Chỉ explicit Gate 1 re-approval trên packet hiện tại mới cho phép targeted revision của delta spec hiện hữu và regeneration của Gate 2 packet; chưa được phép tạo design, tasks, schema, migration, API hoặc implementation.
```

## Authorities consulted

- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`
- `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`
- `docs/features/personnel/README.md`
- `docs/ui/pages/backoffice-equipe-salaries/README.md`
- `docs/architecture/TENANCY.md`
- `docs/architecture/AUTHENTICATION.md`
- `docs/architecture/DATABASE_BOUNDARIES.md`
- `apps/backoffice/AGENTS.md`
- Current Personnel contracts, executable schema, repository, server actions, permissions and integration tests listed in `analysis.md`.
- The current user's targeted effective-date Product Decision and multi-group clarification supplied on 2026-09-03.

## Resolved Product decisions

1. Identity supports `CORRECTION` and `CHANGE`; OWNER selects the meaning. Entry date is correction-only with no F07 exception.
2. Classification and conditional metadata are evaluated independently for each changed semantic group in a multi-group mutation; this changes neither ownership nor scope.
3. Effective date is required for Role, Contract terms and Work time `CHANGE`. It may be in the past or today only, not before the authoritative entry date applicable to the mutation and not after an existing departure. Future effective dates and scheduled/pending Personnel changes are out of scope. Correction has no separate effective date.
4. Correction reason is required for Entry, Contract terms, contractual Work-time values and departure correction/cancellation; optional for Identity and Role; never required for `CHANGE`.
5. Activation creates exactly one eager cutover baseline for every applicable existing dossier. It is current-at-cutover only and never represents earlier historical truth.
6. OWNER can see semantic group, classification, previous/new values, applicable effective date/reason, actor and recorded timestamp in the existing `Historique`. The newest-50 limit remains and no search/filter/pagination/export is added.

## Conflicts and NEEDS REVIEW

- No `CONFLICT` was found.
- No requirement-level `NEEDS REVIEW` remains.
- No Control Tower repository-analysis stop condition was triggered.
- The existing delta Spec and Gate 2 packet intentionally remain byte-identical and still reflect the superseded effective-date rule. This is controlled workflow divergence pending Gate 1 review, not unresolved Product uncertainty; neither artifact is current evidence for the revised rule.
- Sensitive implementation choices remain for the mandatory Design Gate: storage shape, migration and cutover execution, exactly-once enforcement, retention cleanup/anonymization integration, rollback and backup interaction. These choices may not alter the approved Product behavior or boundaries.

## Analysis conclusion and recommendation

Conclusion: `READY_FOR_SPECS`.

The bounded new capability path is `personnel/reconstructable-value-history`. The change has observable behavior and must not use `skip_specs: true`.

Recommended next action: approve this exact regenerated Gate 1 packet. A valid explicit Gate 1 re-approval permits only the targeted revision of the existing delta Spec and regeneration of the Gate 2 packet. It does not approve design, tasks, schema, migration, API, implementation, production release, sync or archive. Because the change is Personnel/privacy-sensitive and data-affecting, it will require a separate Sensitive Design Gate after the revised Gate 2 approval.
