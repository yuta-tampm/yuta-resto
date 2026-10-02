## Context

Xem `proposal.md` cho động cơ và `specs/restaurant-knowledge/concept-history/spec.md` cho behavioral contract đã được duyệt.

Route `/etablissement/informations-generales` hiện là một composed Backoffice page nhưng chỉ load và mutate Establishment Profile. `page.tsx` lấy trusted tenant context từ server session, Establishment Profile dùng `establishment.profile.read/manage`, và form hiện tại submit qua một server action riêng. Restaurant Knowledge READ/MANAGE đã tồn tại trong shared Authorization capability nhưng chưa được route consume.

Cloud persistence thuộc `@yuta/db-cloud`. Repository rule hiện hành yêu cầu mọi establishment-owned query dùng đồng thời trusted `organizationId` và `establishmentId`, đồng thời schema có composite identity `(organization_id, id)` cho establishment. Không có Concept/Histoire schema, repository, transport contract hoặc migration hiện hữu để tái sử dụng.

Design này giữ change ở chế độ `PAGE_LOCAL`: một section mới được compose vào page hiện hữu, một server action page-local, và một persistence boundary riêng do Restaurant Knowledge sở hữu. Không cần shared transport contract, API route, permission mới, thay đổi tenant context hoặc cross-runtime integration.

## Goals / Non-Goals

**Goals:**

- tạo persistence/repository boundary riêng cho slice Restaurant Knowledge `Concept & histoire` trong cloud runtime;
- giữ establishment semantic scope bằng trusted organization + establishment context hiện hữu;
- compose section độc lập vào page mà không thay đổi ownership, form hoặc permission của Establishment Profile;
- thực thi READ khi load/view và MANAGE khi edit/save ở server boundary;
- hỗ trợ hai giá trị nullable độc lập, zero-row empty state, một explicit save và không autosave;
- có migration, tenant-isolation tests, authorization integration tests và UI behavior tests đủ để verify các scenarios đã duyệt.

**Non-Goals:**

- không tạo shared `@yuta/contracts` contract, API route hoặc reusable cross-module interface;
- không thêm Product validation về độ dài, format, required content hoặc business semantics;
- không thêm optimistic concurrency, version history, audit/provenance model hoặc autosave;
- không sửa Establishment Profile schema/repository/form/action/permission;
- không thay đổi shell, navigation, tenant selection, authorization architecture hoặc runtime topology;
- không chuẩn bị schema cho các Restaurant Knowledge section tương lai.

## Decisions

### 1. Dùng table riêng cho bounded Restaurant Knowledge slice

Tạo một table cloud riêng, dự kiến `restaurant_knowledge_concept_history`, trong một schema source do Restaurant Knowledge sở hữu. Table chỉ có:

- `organization_id`;
- `establishment_id`;
- nullable `concept` text;
- nullable `history` text.

`(organization_id, establishment_id)` là primary key và đồng thời có composite foreign key tới `(establishments.organization_id, establishments.id)`. Thiết kế này cho phép tối đa một canonical slice cho mỗi establishment và bảo đảm organization chỉ là scope envelope gắn với đúng establishment. Không thêm cột vào `establishments` và không dùng `establishment-profile-repository.ts`.

Không có row được xem như `{ concept: null, history: null }`, nên migration không cần backfill và empty initial state hợp lệ ngay lập tức. Save dùng một upsert trên composite key và ghi cả hai nullable values trong cùng một database statement.

**Alternatives considered:**

- Thêm `concept`/`history` vào `establishments`: bị loại vì chuyển canonical storage vào Establishment Profile boundary.
- Một table Restaurant Knowledge tổng quát hoặc key/value cho section tương lai: bị loại vì mở rộng data model vượt quá slice đã duyệt.
- Hai table hoặc hai mutation độc lập: bị loại vì làm phức tạp một explicit save cho toàn slice và không mang lại boundary cần thiết.

### 2. Repository nhận duy nhất trusted tenant context và toàn bộ slice

Tạo Restaurant Knowledge repository riêng trong `@yuta/db-cloud` với hai operation cấp capability:

- read slice theo `TenantContext` sau `requireEstablishment`;
- upsert toàn bộ `{ concept, history }` theo cùng trusted context.

Mọi read, conflict target và write condition dùng cả `organizationId` lẫn `establishmentId`. Browser không gửi hoặc chọn tenant identifiers. Repository trả model tách khỏi Establishment Profile row; zero-row được adapter thành hai giá trị `null`.

**Alternatives considered:**

- Truyền organization/establishment IDs từ form: bị loại vì browser scope không phải authorization proof.
- Reuse Establishment Profile repository: bị loại vì sai canonical ownership và dễ kéo theo profile permission inheritance.

### 3. Giữ transport page-local, không tạo shared contract

Server action nhận `FormData` và dùng một Zod parser nằm trong route để xác nhận đúng hai string-or-null values. Parser chỉ bảo vệ type/boundary và normalize empty form value thành `null`; nó không trim, giới hạn độ dài, áp format hoặc thêm Product validation.

Repository input type thuộc Restaurant Knowledge repository API và không được export thành public/shared transport schema. Điều này phù hợp với bounded page-local flow và pattern route-local Zod parser đã có trong Backoffice. Nếu một consumer khác cần dùng dữ liệu qua API/process boundary, đó là shared-contract expansion riêng và change này phải quay lại review thay vì tự mở rộng `@yuta/contracts`.

**Alternatives considered:**

- Thêm module mới vào `@yuta/contracts`: không cần cho một server-action-only page-local flow và sẽ kích hoạt cross-module review đã bị guardrail loại trừ.
- Không validate FormData boundary: bị loại vì input browser là untrusted.

### 4. Compose permission theo từng capability, không khóa cả page bằng Restaurant Knowledge READ

Route tiếp tục enforce `establishment.profile.read` cho phần profile hiện hữu. Sau khi trusted tenant context và establishment được xác nhận, route đánh giá Restaurant Knowledge READ riêng:

- nếu có READ, route load và render section `Concept & histoire`;
- nếu không có READ, route không load hoặc expose Restaurant Knowledge slice, nhưng phần Establishment Profile vẫn tuân theo access hiện hữu;
- editability của section được tính riêng bằng Restaurant Knowledge MANAGE;
- server action re-derives authenticated tenant context, gọi `requireEstablishment`, rồi require Restaurant Knowledge MANAGE trước parsing hoặc persistence.

Section visibility không thay thế server authorization. Không có path nào sử dụng `establishment.profile.read/manage` để authorize Restaurant Knowledge. Với grant matrix hiện tại, OWNER và MANAGER có READ/MANAGE; STAFF vẫn chỉ thấy phần profile mà họ đã có quyền và không nhận Restaurant Knowledge access.

**Alternatives considered:**

- Require Restaurant Knowledge READ ở page entry: bị loại vì sẽ vô tình thu hồi quyền xem Establishment Profile hiện tại của STAFF.
- Gộp permission checks với profile permission: bị loại vì READ/MANAGE phải độc lập và không kế thừa.

### 5. Dùng form/action riêng và browser-local draft cho slice

Thêm một route-local `ConceptHistoryForm` riêng bên cạnh form Establishment Profile hiện hữu. Form có hai manual text controls `Concept` và `Histoire`, được initialize từ server data và quản lý draft trong browser state. Không effect, timer, blur handler hoặc background request nào persist draft.

Một submit control duy nhất gửi trạng thái hiện tại của cả hai values tới một server action Restaurant Knowledge riêng. Action persist qua repository, revalidate chính route và trả generic success/error state. Không thêm field-level validation message vì chưa có Product validation rules. Khi user không có MANAGE, section là read-only và không render submit control.

Tách form/action giữ explicit save boundary của Restaurant Knowledge, tránh submit Concept/Histoire qua Establishment Profile action và tránh thay đổi behavior của profile form.

**Alternatives considered:**

- Gộp hai domain vào form/action `saveGeneralInformationAction`: bị loại vì trộn canonical ownership, permission và failure boundary.
- Autosave theo change/blur: bị loại trực tiếp bởi spec.

### 6. Verification tập trung vào boundary và observable behavior

Verification phải gồm:

- schema assertions cho composite primary/foreign key, nullable Concept/Histoire và không có field trên `establishments`;
- guarded db-cloud integration tests cho zero-row empty state, Concept-only, Histoire-only, upsert cả slice, đúng-establishment read/write và wrong-organization/wrong-establishment isolation;
- Backoffice tests chứng minh READ gating, MANAGE gating, STAFF không thấy slice, profile permission không cấp knowledge access và action luôn re-derive trusted context;
- UI/model tests cho independent drafts, valid empty state, một submit payload chứa cả hai values và không có persistence trước submit;
- regression tests cho Establishment Profile form/action và accepted Restaurant Knowledge authorization contract;
- `docs:check`, `architecture:check`, affected typechecks/tests, generated migration review, strict OpenSpec validation và Backoffice build.

Không cần provider, POS, Site Agent, Display hoặc public-app verification vì không runtime nào trong số đó bị thay đổi.

### 7. Cập nhật documentation tại Apply nhưng không promote lifecycle ngoài evidence

Implementation phải cập nhật current Restaurant Knowledge/Product Knowledge và stable `establishment-general-information` page pack để mô tả composed section, data owner, permission mapping, explicit-save/no-autosave behavior và as-built verification. Không tạo page pack mới hoặc report trùng lặp.

Implementation status chỉ được cập nhật theo code/test evidence của change. Environment, Production Readiness và External Dependency không được promote bởi Design, migration generation hoặc local tests.

## Risks / Trade-offs

- [Hai form độc lập cùng nằm trên một page] → Giữ action state, pending state và submit control tách biệt; profile submit không mang Restaurant Knowledge fields và ngược lại.
- [Sai scope trong upsert có thể ghi nhầm tenant] → Composite primary/foreign key, repository API chỉ nhận trusted `TenantContext`, mọi query dùng cả hai scope IDs, và integration tests phủ wrong-organization/wrong-establishment.
- [UI hiding bị hiểu nhầm là authorization] → Server action luôn enforce MANAGE và repository chỉ nhận server-derived context; UI gating chỉ là presentation.
- [Migration được deploy sau application] → Deploy migration trước application code; zero-row semantics loại bỏ nhu cầu backfill.
- [Route-local parser có thể bị tái sử dụng ngoài page] → Không export nó; consumer mới phải quay lại review cho shared contract thay vì import xuyên boundary.
- [Không có Product validation limits] → Dùng PostgreSQL `text` nullable và parser type-only; không tự thêm constraint hoặc copy validation từ Establishment Profile.
- [Change làm drift page pack hiện hữu] → Update stable pack in place trong cùng implementation và giữ toàn bộ profile behavior được bảo vệ.

## Migration Plan

1. Generate và review một forward cloud migration tạo table riêng cùng composite scope constraints; migration không sửa hoặc backfill `establishments`.
2. Chạy schema/repository integration tests trên disposable cloud database trước khi deploy.
3. Apply migration trước khi deploy Backoffice code đọc/ghi table mới.
4. Deploy repository, server action và composed UI. Establishment không có row hiển thị valid empty state.
5. Verify OWNER/MANAGER view-edit-save, STAFF no-access cho slice, tenant isolation và Establishment Profile regression.

Rollback application có thể bỏ section/action mới trong khi giữ table và dữ liệu, vì phần profile hiện hữu không phụ thuộc table này. Không drop table trong emergency rollback để tránh mất Concept/Histoire đã lưu; việc xóa schema/data cần một migration và review riêng.

## Open Questions

Không có open question nào có thể thay đổi specs, approach hoặc task breakdown.

Nếu Apply discovery cho thấy cần `@yuta/contracts` shared contract, permission mới, tenant boundary khác, canonical owner khác hoặc cross-runtime consumer, change SHALL stop và quay lại review; Design này không cấp authority cho các mở rộng đó.
