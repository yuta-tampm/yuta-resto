Change: restaurant-knowledge-concept-history
Gate: 1 — Analysis Review
Review status: APPROVED
Created: 2026-08-30T22:55:37.5659219+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — tenant-owned data boundary, authorization consumption, and canonical ownership
Previous Gate 1 decision: CHANGES_REQUIRED — Proposal corrected; Analysis remained substantively approved
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-08-30T23:03:32.6190165+02:00

# Gate 1 — Analysis Review

## Correction summary

This is the existing `restaurant-knowledge-concept-history` change; no replacement or v2 was created.

The Proposal no longer contains the obsolete authorization blocker. It now consumes the accepted Restaurant Knowledge READ/MANAGE contract: OWNER and MANAGER receive both operations, STAFF receives neither by default, Establishment Profile permissions are not reused, and existing organization/establishment tenant validation remains unchanged.

The Proposal also no longer selects or implies a concrete persistence representation. It preserves only the approved boundary: Restaurant Knowledge owns the Concept/Histoire persistence/domain boundary; the data is semantically establishment-scoped; Organization remains the tenancy/access envelope; concrete schema, repository/table, API, field validation, storage technology, and storage representation remain undecided.

The Analysis previously passed. Its findings are unchanged; one provenance sentence was updated solely so it accurately describes the corrected Proposal.

## Prerequisite acceptance evidence

- Accepted contract: `openspec/specs/authorization/restaurant-knowledge/spec.md`
- Main spec SHA-256: `f924222ae59f13937da91c5272a26a6050e16dbe3b2ee994b823297d5e393322`
- Archived prerequisite: `openspec/changes/archive/2026-08-30-restaurant-knowledge-authorization`
- The prerequisite was synced, strictly validated, and archived before this revision.

## Authorization verification

| Requirement                           | Revised analysis result                                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Restaurant Knowledge READ available   | Verified as `restaurant-knowledge.read`                                                                          |
| Restaurant Knowledge MANAGE available | Verified as `restaurant-knowledge.manage`                                                                        |
| OWNER grants                          | READ and MANAGE                                                                                                  |
| MANAGER grants                        | READ and MANAGE                                                                                                  |
| STAFF default                         | Neither READ nor MANAGE                                                                                          |
| Establishment Profile permissions     | Not reused or inherited                                                                                          |
| Tenant/access validation              | Active user, organization, establishment, matching membership, and server-derived tenant context remain required |
| Semantic scope                        | Establishment-scoped; Organization remains the tenancy/access envelope                                           |

## Preserved Product decisions

- Restaurant Knowledge is canonical owner of Concept and Histoire.
- Establishment Profile owns neither datum.
- Restaurant Knowledge owns their persistence/domain boundary.
- Concept and Histoire are independently optional.
- Empty initial state is valid.
- Manual input supports view/edit of both values.
- One explicit save covers the entire `Concept & histoire` slice.
- No autosave.

## Explicit exclusions and technical guardrails

The change still excludes AI suggestions, automatic learning, detailed provenance/history, Marketing/Facebook/Instagram integration, external providers, embeddings/vector DB, and all other Restaurant Knowledge sections.

No schema, repository/table, storage representation, API, field validation, storage implementation, extra permission, role, principal, tenancy semantic, or cross-runtime behavior is selected by this Gate 1 packet.

## Exact proposal content

```markdown
## Why

`Informations générales` đã được phê duyệt là page tổng hợp có Restaurant Knowledge là capability riêng, nhưng slice đầu tiên `Concept & histoire` chưa có behavior được đặc tả để triển khai. Change này khoanh vùng slice đầu tiên theo classification `PAGE_LOCAL`, đồng thời giữ đúng canonical ownership và persistence/domain boundary của Restaurant Knowledge mà không mở rộng sang các section hay consumer khác.

## What Changes

- Bổ sung khả năng xem và nhập thủ công hai nội dung độc lập `Concept` và `Histoire` trong page `Informations générales`.
- Cả hai nội dung đều optional; empty initial state là hợp lệ.
- Một explicit save lưu toàn bộ slice `Concept & histoire`; không autosave.
- Restaurant Knowledge là canonical owner của dữ liệu và persistence/domain boundary; dữ liệu được scope theo establishment, với Organization chỉ là tenancy/access envelope.
- Establishment Profile không sở hữu, không persist và không cấp quyền mặc định cho hai dữ liệu này.
- Technical schema, repository/table, API, field validation và storage representation chưa được quyết định trong change này.
- Loại trừ AI suggestions, automatic learning, detailed provenance/history, Marketing/social integration, external providers, embeddings/vector DB và mọi section Restaurant Knowledge khác.
- View phải dùng Restaurant Knowledge READ (`restaurant-knowledge.read`); edit và explicit save phải dùng Restaurant Knowledge MANAGE (`restaurant-knowledge.manage`). OWNER và MANAGER có cả hai operation; STAFF mặc định không có access. Hai operation không kế thừa `establishment.profile.read` hoặc `establishment.profile.manage`, và tenant/access validation hiện có không thay đổi.

## Capabilities

### New Capabilities

- `restaurant-knowledge/concept-history`: Behavior page-local cho việc xem, sửa và explicit-save hai nội dung optional, độc lập `Concept` và `Histoire` dưới canonical Restaurant Knowledge ownership và establishment scope.

### Modified Capabilities

Không có.

## Impact

- Product surface dự kiến: `apps/backoffice`, route `/etablissement/informations-generales`.
- Data boundary: Restaurant Knowledge sở hữu Concept/Histoire persistence/domain boundary; dữ liệu có semantic scope theo establishment và Organization vẫn là tenancy/access envelope. Concrete schema, repository/table và storage representation chưa được quyết định; Establishment Profile không phải canonical storage.
- Security boundary: change dùng Restaurant Knowledge READ/MANAGE contract đã được chấp nhận, không tạo permission mới và không thay đổi tenancy semantics. `establishment.profile.read` và `establishment.profile.manage` không được tái sử dụng hoặc kế thừa.
- Không thay đổi Booking, Reputation, Personnel, Marketing, POS, Display, public apps, provider hoặc cross-runtime behavior.
```

## Exact revised analysis content

```markdown
# Change Analysis

## Scope and Change Type

Change behavior mới cho bounded page-local slice `Restaurant Knowledge → Concept & histoire` trên route `/etablissement/informations-generales`.

Phạm vi Product đã được phê duyệt gồm:

- manual input, view và edit `Concept`;
- manual input, view và edit `Histoire`;
- `Concept` và `Histoire` độc lập và optional;
- empty initial state hợp lệ;
- một explicit save cho toàn slice `Concept & histoire`;
- không autosave;
- Restaurant Knowledge là canonical owner của hai dữ liệu và persistence/domain boundary;
- dữ liệu semantically establishment-scoped, với Organization là tenancy/access envelope;
- Establishment Profile không sở hữu hai dữ liệu.

Change vẫn được phân loại `PAGE_LOCAL` theo `Strategy C — bounded page-local OpenSpec change`. Nó consume accepted shared Restaurant Knowledge authorization contract nhưng không tạo hoặc thay đổi permission, role, principal, tenant boundary hay shared authorization architecture.

Ngoài scope: AI suggestions, automatic learning, detailed provenance/history, Marketing/Facebook/Instagram integration, external providers, embeddings/vector DB, các section Restaurant Knowledge khác và cross-runtime behavior.

## Sources Consulted

### Product Intent và lifecycle

- [Establishment Product Knowledge](../../../docs/features/establishment/README.md)
- [Informations générales Page Product Knowledge](../../../docs/features/establishment/general-information/README.md)
- [Page Product Knowledge source](../../../docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md)
- [Module Registry](../../../docs/MODULE_REGISTRY.md)
- [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md)
- [ADR-006 — Cloud Establishment Profile context](../../../docs/decisions/ADR-006-cloud-establishment-profile-context.md)
- [ADR-007 — Composed General Information and Restaurant Knowledge](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)

### Authorization, tenancy và authority

- [Normative Restaurant Knowledge authorization spec](../../specs/authorization/restaurant-knowledge/spec.md)
- [Archived authorization prerequisite](../archive/2026-08-30-restaurant-knowledge-authorization/analysis.md)
- [Authority Model](../../../docs/AUTHORITY_MODEL.md)
- [OpenSpec Normativity Policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
- [Tenancy architecture](../../../docs/architecture/TENANCY.md)
- [Authentication architecture](../../../docs/architecture/AUTHENTICATION.md)
- [Identity and Membership architecture](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md)
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md)
- [Root instructions](../../../AGENTS.md)
- [Backoffice instructions](../../../apps/backoffice/AGENTS.md)

### UI và repository Implemented State

- [General-information page pack](../../../docs/ui/pages/establishment-general-information/README.md)
- [General-information product scope](../../../docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md)
- [`page.tsx`](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx>)
- [`actions.ts`](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts>)
- [`permissions.ts`](../../../apps/backoffice/src/server/auth/permissions.ts)
- [`restaurant-knowledge-permissions.test.ts`](../../../apps/backoffice/test/restaurant-knowledge-permissions.test.ts)
- [`establishment-profile-permissions.test.ts`](../../../apps/backoffice/test/establishment-profile-permissions.test.ts)
- [`establishment-profile-repository.ts`](../../../packages/db-cloud/src/establishment-profile-repository.ts)
- [`packages/db-cloud/src/schema`](../../../packages/db-cloud/src/schema)
- [`packages/contracts/src`](../../../packages/contracts/src)
- [`packages/tenant/src/foundation.ts`](../../../packages/tenant/src/foundation.ts)
- [Normative Establishment Profile spec](../../../openspec/specs/establishment-profile/spec.md)

## Authority and Product Decision

Current Product Knowledge and the approved Control Tower decisions establish:

- Restaurant Knowledge is canonical owner of `Concept` and `Histoire` and owns their persistence/domain boundary;
- Establishment Profile owns neither datum and its schema, repository, and permissions do not become Restaurant Knowledge authority through page composition;
- Restaurant Knowledge is semantically establishment-scoped;
- Organization remains the tenancy/access envelope, not semantic owner;
- `Concept` and `Histoire` are independent, optional, and validly absent in the initial state;
- the bounded interaction is manual input plus view/edit for each value, followed by one explicit save for the complete slice, with no autosave.

The accepted normative authorization contract at `authorization/restaurant-knowledge` resolves the earlier Gate 1 blocker:

- Restaurant Knowledge READ is a distinct accepted operation;
- Restaurant Knowledge MANAGE is a distinct accepted operation;
- `OWNER` and `MANAGER` receive both READ and MANAGE;
- `STAFF` receives no Restaurant Knowledge access by default;
- `establishment.profile.read` and `establishment.profile.manage` are neither reused nor inherited;
- authorization continues to require valid active user, organization, establishment, matching active establishment membership, server-derived tenant context, and the requested Restaurant Knowledge operation permission;
- the organization/establishment tenant boundary remains unchanged;
- Restaurant Knowledge retains establishment-scoped semantics.

For this bounded change, view behavior must use Restaurant Knowledge READ. Edit and explicit-save behavior must use Restaurant Knowledge MANAGE. This mapping consumes the accepted contract and does not add a permission or infer section-specific, field-level, STAFF, admin, or support access.

The proposal now reflects the accepted, synced, validated, and archived `restaurant-knowledge-authorization` prerequisite. Its capability identity and Product scope remain unchanged.

## Current Implemented State

Repository implementation now includes the accepted authorization foundation:

- `RestaurantKnowledgePermission` contains separate `restaurant-knowledge.read` and `restaurant-knowledge.manage` values;
- the two grant-map entries independently grant `OWNER` and `MANAGER`;
- `hasRestaurantKnowledgePermission` and `requireRestaurantKnowledgePermission` evaluate the exact requested operation from trusted `TenantContext` and fail closed;
- focused tests prove READ/MANAGE separation, OWNER/MANAGER grants, STAFF denial, public/service denial, no Establishment Profile inheritance, and no `YUTA_ADMIN`/`YUTA_SUPPORT` bypass;
- the normative authorization spec is synced and strictly validated, and the prerequisite change is archived.

The `Concept & histoire` content capability itself remains unimplemented:

- the current route still loads and saves only Establishment Profile data;
- no Concept/Histoire contract, schema, repository/table, API, validation rule, UI field, save behavior, or persistence implementation exists;
- no deployment/runtime evidence exists for this content slice.

Repository absence does not authorize a technical persistence choice. This Analysis records the approved domain owner and behavior while leaving concrete implementation design open.

## Affected Boundaries

- **Runtime surface:** existing authenticated Backoffice page; no runtime-family change.
- **Canonical owner:** Restaurant Knowledge owns Concept/Histoire and their persistence/domain boundary.
- **Establishment Profile boundary:** unchanged and explicitly not reused as canonical storage or authorization.
- **Semantic scope:** one establishment; Organization remains the parent tenancy/access envelope.
- **Trusted data access:** tenant-owned reads and writes continue to require server-derived organization and establishment scope; browser-provided scope is not authority.
- **Authorization:** view consumes Restaurant Knowledge READ; edit/save consumes Restaurant Knowledge MANAGE. Both allow `OWNER`/`MANAGER`; `STAFF` is denied by default.
- **Tenant/access validation:** existing active user, active organization, active establishment, matching active membership, and server-derived context checks remain unchanged.
- **Technical persistence/transport:** schema, repository/table, API, field validation, and storage implementation are not selected by this Analysis.
- **Public/local/external:** public apps, POS, Site Agent, Display, providers, AI and vector infrastructure are unaffected.

## Lifecycle Baseline

Current Module Registry and Product Knowledge record:

- Product Decision: `APPROVED`;
- Implementation: `NOT_STARTED` for Restaurant Knowledge content;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`;
- Review Marker: ownership, bounded initial behavior, and authorization are resolved; concrete technical schema/repository/API/storage details remain `NEEDS REVIEW`.

The authorization prerequisite is implemented and its behavioral spec is normative. That does not promote the Concept/Histoire content implementation, environment, readiness, external dependency, or any other lifecycle value.

## Requirement Readiness

`READY_FOR_SPECS`

Precise observable behavior can now be specified without guessing:

- Product outcomes, ownership, semantic tenant scope, optionality, empty state, manual input, view/edit behavior, save boundary, and no-autosave rule are approved;
- READ and MANAGE operations and their exact grant matrix are accepted;
- view maps to READ and edit/explicit save map to MANAGE;
- STAFF denial, no Establishment Profile permission inheritance, and unchanged tenant/access validation are explicit;
- exclusions prevent scope expansion into AI, learning, provenance, Marketing/social integrations, providers, vector infrastructure, or other knowledge sections.

Specs must remain behavioral. They must not select or imply a schema, repository/table, API, field validation, storage implementation, additional permission, autosave behavior, or ownership transfer.

This change has observable behavior and is not eligible for `skip_specs: true`.

## UI / UX Applicability

UI/UX applies to the existing `/etablissement/informations-generales` route. Future Specs may define only the approved observable Concept/Histoire manual-input, view/edit, empty-state, explicit-save, and no-autosave behavior. Delivery-state details must follow existing UI governance without adding business semantics not approved here.

The current Establishment Profile page pack does not transfer data or permission ownership. A later Design step must update the existing composed-page delivery source rather than create a parallel page pack, without using UI visibility as authorization.

No screenshot or current profile form is authority for technical data shape, validation, or Restaurant Knowledge permissions.

## Conflicts and Unknowns

### CONFLICT

Không có requirement-level conflict. The accepted authorization prerequisite aligns the normative permission contract, current guards/tests, Tenancy authority, and Product Knowledge.

### NEEDS REVIEW

Không còn requirement-level `NEEDS REVIEW` blocking Specs.

Concrete schema, repository/table, API, field validation, and storage implementation remain deliberately undecided technical matters. They must be resolved later without changing the approved canonical owner, establishment scope, observable behavior, tenant validation, or authorization contract. If repository discovery shows that any technical choice would require a new shared contract, changed tenancy boundary, additional permission, or cross-runtime behavior, the change must stop and return to the appropriate review gate.

## Analysis Conclusion

`READY_FOR_SPECS`

The existing capability `restaurant-knowledge/concept-history` may proceed to delta Specs after explicit approval of this new Gate 1 packet. Specs must preserve:

- Restaurant Knowledge canonical ownership and establishment-scoped persistence/domain boundary;
- Organization as tenancy/access envelope and Establishment Profile non-ownership;
- independent optional Concept/Histoire values and valid empty initial state;
- manual input, view/edit of each value, one explicit save for the whole slice, and no autosave;
- Restaurant Knowledge READ for view and MANAGE for edit/save;
- OWNER/MANAGER grants, STAFF default denial, no `establishment.profile.*` reuse, and unchanged organization/establishment tenant validation;
- every stated exclusion.

No Specs, Design, Tasks, implementation, schema, API, validation rule, persistence choice, or additional permission is created by this Analysis revision.
```

## CONFLICT and NEEDS REVIEW register

- `CONFLICT`: none.
- Requirement-level `NEEDS REVIEW`: none.
- Detailed persistence shape, schema, repository/table, API, validation, and storage representation remain intentionally undecided for later Design work and do not block behavioral Specs.
- Visual evidence remains unavailable at Analysis because the page is not running; the Design Gate must inspect the actual route before UI decisions.

## Artifact hashes

Command:

```powershell
$files=@('openspec/changes/restaurant-knowledge-concept-history/analysis.md','openspec/changes/restaurant-knowledge-concept-history/proposal.md'); Get-FileHash -Algorithm SHA256 -LiteralPath $files | Sort-Object Path | ForEach-Object { '{0}|{1}' -f $_.Path,$_.Hash.ToLowerInvariant() }
```

| Repository-relative path                                            | SHA-256                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-concept-history/analysis.md` | `3e79cd9d7f8464edf9d5eda3d2c03da1f5716af024ab3717465df467afce7ea8` |
| `openspec/changes/restaurant-knowledge-concept-history/proposal.md` | `071b1300029075719d69954f2fafe707173145d6e75a54c17251eb2c0be46ddc` |

## Revision provenance

- Original Proposal hash: `1be1af3add06a4cbacb463e2cd8c2c4a33269d1f6fc5d2f0c3cccc01b579db67`
- Prior approved Analysis hash: `ce3ea07c7311b3ba772a7bd22751c102c7f8399958a32fc727e26d3625243ef5`
- Revised Proposal hash: `071b1300029075719d69954f2fafe707173145d6e75a54c17251eb2c0be46ddc`
- Coherence-only revised Analysis hash: `3e79cd9d7f8464edf9d5eda3d2c03da1f5716af024ab3717465df467afce7ea8`

## Recommendation and required human action

Analysis conclusion remains `READY_FOR_SPECS`.

Approve Gate 1 only if the corrected Proposal and revised Analysis accurately preserve the Product, ownership, tenant, and accepted authorization boundaries. Approval authorizes creation of delta Specs only; it does not authorize Design, Tasks, Apply, sync, or archive.

Required approval phrase: `APPROVE Gate 1`
