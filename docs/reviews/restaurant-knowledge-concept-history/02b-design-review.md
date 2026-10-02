Change: restaurant-knowledge-concept-history
Gate: 2b — Design Review
Review status: APPROVED
Created: 2026-08-30T23:15:16.8194802+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — tenant-owned data boundary, database migration, authorization consumption, and canonical ownership
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-08-30T23:34:21.5560250+02:00

# Gate 2b — Design Review

## Approved upstream gates

Gate 1 and Gate 2 were approved by explicit current-user instructions. Their reviewed artifacts were recomputed before Design and remain intact.

| Repository-relative path                                                                                   | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-concept-history/01-analysis-review.md`                                  | `48a9a7584c69addae404c8385444cbfff58be19fd17ff8a823c3e5a58097551e` |
| `docs/reviews/restaurant-knowledge-concept-history/02-specs-review.md`                                     | `f70b7d440b8803fdf57c12eeb1211fdd4e1352e7066c2493b0c72411b253773f` |
| `openspec/changes/restaurant-knowledge-concept-history/analysis.md`                                        | `3e79cd9d7f8464edf9d5eda3d2c03da1f5716af024ab3717465df467afce7ea8` |
| `openspec/changes/restaurant-knowledge-concept-history/proposal.md`                                        | `071b1300029075719d69954f2fafe707173145d6e75a54c17251eb2c0be46ddc` |
| `openspec/changes/restaurant-knowledge-concept-history/specs/restaurant-knowledge/concept-history/spec.md` | `6a9b186070a8b2d9b02072ca109f256fed188babd1817726438f02bf8bc9893b` |

Gate 1 packet status: `APPROVED`.
Gate 2 packet status: `APPROVED`.

## Design artifact hash

Command:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'openspec/changes/restaurant-knowledge-concept-history/design.md'
```

| Repository-relative path                                          | SHA-256                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-concept-history/design.md` | `89afc116d25482e91b40efc299bf32ac5168d960b3369abf62746b089a85b295` |

## Design decision summary

- Add a bounded cloud table dedicated to `restaurant_knowledge_concept_history`, not fields on `establishments`.
- Use composite `(organization_id, establishment_id)` primary/foreign-key scope and a Restaurant Knowledge repository that accepts only trusted `TenantContext`.
- Represent Concept and Histoire as independent nullable text values; absence of a row maps to the valid empty state.
- Save the whole slice with one composite-key upsert.
- Keep browser/server parsing route-local with type-only Zod validation; do not add a shared `@yuta/contracts` contract or Product content constraints.
- Keep the existing Establishment Profile form/action/permissions unchanged and compose a separate Restaurant Knowledge section, form, server action, and permission checks.
- Gate view/load with Restaurant Knowledge READ and edit/save with Restaurant Knowledge MANAGE; server action re-derives tenant context and fails closed.
- Keep draft state browser-local until one explicit submit; no timer, effect, blur handler, or background persistence.

## Guardrail evaluation

Repository discovery found no need for a new shared contract, changed tenancy boundary, additional permission, changed canonical ownership, or cross-runtime behavior:

- route-local Zod boundary parsing is an existing Backoffice pattern and is not exported;
- `@yuta/contracts` remains unchanged;
- accepted Restaurant Knowledge READ/MANAGE is reused exactly;
- organization and establishment continue through the existing trusted server-derived `TenantContext`;
- persistence remains in the existing cloud runtime and is owned by Restaurant Knowledge;
- Establishment Profile data and permission boundaries are not inherited.

If Apply discovery contradicts any point above, the change must stop and return to review.

## Security, data, and runtime implications

**Security:** The composed page must not require Restaurant Knowledge READ at page entry because STAFF retains approved profile-read access. Instead, the Restaurant Knowledge slice is not loaded or exposed without READ. UI visibility is not enforcement: the independent save action always requires MANAGE after re-authentication and `requireEstablishment`. No profile permission can substitute for either operation.

**Data:** A new bounded table and forward Drizzle migration are required. Composite scope constraints prevent an organization/establishment mismatch. No Concept/Histoire column is added to Establishment Profile, no generic future-section model is introduced, and no row is required for empty initial state.

**Runtime:** Only cloud Backoffice and `@yuta/db-cloud` are affected. No public app, POS, Site Agent, Display, external provider, AI runtime, vector infrastructure, or synchronization path is added.

**UI:** The stable existing page is extended in place with a separate section/form. Existing profile loading, form state, explicit profile save, preview, permissions, validation, and error handling remain protected.

## Migration and rollback review

Deployment order:

1. generate and review the forward cloud migration;
2. run schema and tenant-isolation integration tests on a disposable database;
3. apply the migration;
4. deploy repository, server action and UI;
5. verify OWNER/MANAGER access, STAFF denial, cross-tenant isolation and profile regression.

No backfill is required because a missing row is the approved empty state.

Application rollback removes use of the new section/action while leaving the new table and any saved data intact. Emergency rollback must not drop the table. Any future schema/data removal requires a separate reviewed migration.

## Unresolved choices

No unresolved choice remains that would alter Specs, the selected architecture, security boundary, migration shape, or later task breakdown.

Product validation limits, concurrency/versioning, provenance/history, shared transport, API exposure and other Restaurant Knowledge sections are intentionally not designed. Adding any of them requires separate Product/review authority.

## Exact Design content

```markdown
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
```

## Validation evidence

Commands and results:

```text
pnpm exec prettier --check <Gate 1, Gate 2, Spec, and Design artifacts>
All matched files use Prettier code style!

openspec validate restaurant-knowledge-concept-history --strict
Change 'restaurant-knowledge-concept-history' is valid
```

## Scope checkpoint

Only `design.md` and this mandatory Design Gate packet were created after Gate 2 approval. No Tasks, implementation, migration, sync, or archive action was performed.

## Recommendation and required human action

Recommendation: approve Design only if the dedicated Restaurant Knowledge persistence boundary, route-local transport choice, composed permission model, migration/rollback plan, and explicit non-goals preserve the reviewed Product and authorization contract.

Approval authorizes creation of Tasks followed by Apply/Verify under this exact Design. It does not authorize sync or archive.

Required approval phrase: `APPROVE Gate 2b`
