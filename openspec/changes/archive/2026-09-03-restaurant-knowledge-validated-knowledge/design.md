# Technical Design

Design readiness: `READY_FOR_SENSITIVE_DESIGN_REVIEW`

## Context

Xem `proposal.md` — Why và delta Spec đã được Gate 2 phê duyệt cho Product
behavior. Current repository có năm fixed Restaurant Knowledge slice, mỗi
slice dùng một row theo establishment. Capability mới khác về bản chất: nó là
một collection gồm zero, one hoặc multiple independently addressable items.

Current Cloud boundary là `packages/db-cloud`; Backoffice route
`/etablissement/informations-generales` derive trusted `TenantContext` trên
server và đã có hai operation `restaurant-knowledge.read` và
`restaurant-knowledge.manage`. Không có current flexible-item table,
repository, contract, provenance/history abstraction hoặc downstream consumer
để reuse.

Design phải bảo vệ hai rủi ro chính:

1. whole-list replacement từ stale browser state có thể vô tình xóa item do
   một user khác vừa tạo; và
2. create/update phải reject mọi statement không chứa non-whitespace character
   mà không trim hoặc thay đổi accepted text.

Revised Gate 2 đã phê duyệt chính xác non-blank rule và giữ surrounding
whitespace nguyên vẹn. Design này reconcile server/client validation và test
strategy với requirement đó; collection, concurrency, delete, tenant và
authorization decisions trước đó không thay đổi.

## Goals / Non-Goals

**Goals:**

- biểu diễn zero/one/multiple establishment-scoped items bằng model nhỏ nhất;
- tạo stable internal item identity mà không tạo Product identity concept;
- dùng item-scoped explicit mutations để không ghi đè/xóa unrelated concurrent
  items;
- enforce trusted tenant scope và authorization trước data access;
- giữ browser draft/pending state tách khỏi canonical server state;
- chuẩn bị additive migration, focused verification và mandatory Browser QA.

**Non-Goals:**

- whole-list replacement, version/history, optimistic-lock UI hoặc revision;
- category, tag, ranking, priority, manual ordering hoặc grouping;
- semantic/text uniqueness, duplicate detection, owner-resolution service hoặc
  cross-module lookup;
- source/origin/provenance, validated-by UI, candidate, approval queue, AI,
  confidence hoặc audit/history;
- API route, shared contract, new permission, item-level grant, provider,
  downstream consumer hoặc cross-runtime integration;
- archive, restore, trash hoặc retention workflow;
- Product Knowledge, Module Registry hoặc lifecycle promotion trong Apply.

## Decisions

### 1. Dedicated item collection table

Chọn một dedicated cloud table kỹ thuật tên
`restaurant_knowledge_validated_items` trong existing Restaurant Knowledge
schema owner. Planned columns:

| Column             | Technical shape | Purpose                                      |
| ------------------ | --------------- | -------------------------------------------- |
| `organization_id`  | UUID, NOT NULL  | trusted tenancy envelope                     |
| `establishment_id` | UUID, NOT NULL  | semantic/resource scope                      |
| `id`               | UUID, NOT NULL  | stable internal item identifier inside scope |
| `statement`        | TEXT, NOT NULL  | exact accepted non-blank statement           |

Exact planned constraints:

- composite primary key
  `(organization_id, establishment_id, id)`;
- composite foreign key `(organization_id, establishment_id)` referencing
  `establishments(organization_id, id)` with `ON DELETE RESTRICT`;
- no additional UNIQUE constraint;
- specifically no semantic uniqueness, text-equality uniqueness, source,
  category, ordering, score, status, version, provenance or history column.

The composite primary key keeps item identity scoped by organization and
establishment and supplies the prefix index needed by list and item-scoped
mutation queries. A single nullable/JSON collection row was rejected because
it would create whole-list replacement and stale-write deletion risk. Reusing
one of the five fixed-slice tables was rejected because ownership and cardinality
differ. A shared generic knowledge table was rejected because no shared
contract or multi-owner model is approved.

The `statement` column being NOT NULL prevents absence of the technical value.
Non-blank Product validation is enforced at the server boundary before
repository persistence. Không thêm database CHECK: một second implementation
of whitespace classification ở PostgreSQL có thể lệch với route-local
validator và tạo rule khác. Repository chỉ nhận statement đã qua server
validation và lưu exact accepted string, không trim hoặc normalize.

### 2. Server-generated stable item identifier

Create generates a UUIDv7 inside the trusted db-cloud repository using the
repository's existing `uuid` dependency. The browser does not select or assert
the canonical identifier. `id` is returned only as the opaque technical handle
needed to edit/remove the same item; it has no user-facing identity meaning.

Update, delete and any single-item lookup always constrain all three values:

```text
organization_id = trusted context organization
AND establishment_id = trusted context establishment
AND id = parsed item id
```

An item ID alone is never sufficient authority. A UUID from another
establishment or organization produces no match and no mutation.

### 3. Repository surface and establishment existence

Add collection-specific functions to the existing db-cloud Restaurant
Knowledge repository ownership:

- list current items for trusted context;
- create one item and return its canonical server representation;
- update one scoped item and return its canonical representation;
- physically delete one scoped item and report whether a row matched.

Every function first calls `requireEstablishment(context)` and verifies the
scoped establishment exists using both trusted organization and establishment
IDs before accessing item data. List never accepts a browser scope. Create
derives both tenant columns and the UUIDv7 server-side. Update/delete parse an
opaque item ID but constrain it with the trusted scope. Missing/mismatched rows
return a not-found outcome; they are not upserted or recreated.

The returned app-facing value is a route/domain-owned technical projection of
`{ id, statement }`, not a public API or shared transport contract. Database
rows are not exported as browser contracts.

### 4. Item-scoped explicit-save model

Chọn item-scoped explicit persistence thay vì whole-list save:

- a new local draft has its own explicit create-save action;
- each existing item has an independent draft and explicit update-save action;
- marking an item for removal changes only browser-local state; the same
  item's explicit save invokes the scoped physical delete;
- no action receives or replaces the entire collection.

This is the smallest save model that satisfies pending-before-save and avoids
unrelated lost updates. It does not add an approval workflow: a successful
MANAGE-gated item create/update is the manual acceptance defined by the Spec.
The selected UI may expose one save control for the active new draft and one
for each editable existing item. This is a Design-level presentation choice,
not a new whole-collection Product transaction.

Alternatives:

- whole-list save was rejected because a stale list can delete concurrent
  items absent from the browser snapshot;
- whole-list compare-and-merge was rejected because removal intent cannot be
  distinguished safely from stale absence without adding a revision/change-set
  protocol;
- optimistic versioning was not selected because item-scoped operations solve
  unrelated-item safety and the approved Product does not define conflict UX.

### 5. Concurrent and stale mutation semantics

Item-scoped operations guarantee:

- creating C never updates/deletes A or B;
- editing A never updates/deletes B or a concurrently created C;
- removing B never removes A or C;
- a stale edit after another user physically removed the same item matches zero
  rows, returns an error/not-found state and never recreates it;
- two concurrent edits to the same item use last successful item-scoped write
  wins. No version, history or conflict UI is introduced.

Last-successful-write-wins for the same item is a trade-off, but it does not
create the prohibited unrelated-item loss. If Product later requires same-item
conflict detection, that is a separate observable concurrency decision and
must return to Product/Spec review.

### 6. Physical delete for saved removal

Chọn physical delete of the exact scoped row. It is the smallest representation
of the Spec's only observable postcondition: the item is no longer current
active knowledge. The delete returns success only when the trusted-scope row
matched; a zero-row result is not presented as a successful canonical change.

Inactive/tombstone was rejected because it adds status/retention semantics and
invites archive/restore/history behavior. No archive, restore, trash,
deletion-provenance or retention UI/data is introduced.

### 7. Deterministic technical read order

List reads use ascending UUIDv7 `id` as a deterministic technical tie-free
order. UUIDv7 makes this approximately creation ordered while the identifier
itself remains opaque. The UI does not expose rank, priority or ordering
controls, and no Product guarantee is made about user-controlled ordering.

No `sort_order`, created-time display, drag-and-drop or reorder mutation is
added. The composite primary-key index supports the scoped ordered read.

### 8. Authorization and server-action boundary

Loader flow:

1. derive authenticated trusted tenant and require active establishment;
2. test `restaurant-knowledge.read` before any validated-knowledge repository
   call;
3. return no section and perform zero repository reads when READ is absent;
4. derive presentation-only `canManage` from
   `restaurant-knowledge.manage`.

Create/update/remove flow:

1. re-derive authenticated trusted tenant and require active establishment;
2. require `restaurant-knowledge.manage` before parsing item ID/content and
   before persistence;
3. parse only the operation-specific route-local input;
4. for create/update, reject a statement without any non-whitespace character
   before any repository call;
5. invoke only the matching tenant-scoped create, update or remove operation;
6. revalidate `/etablissement/informations-generales` only after successful
   persistence.

Invalid create/update returns a clear validation error, performs zero
repository mutation and does not run success revalidation. Remove has its own
explicit operation and never derives from blank statement content.

Browser-provided organization, establishment, membership, role, permission or
item ownership is ignored as authority and is not forwarded. Establishment
Profile permissions do not substitute for Restaurant Knowledge permissions.
No item-level permission, role, principal or support/admin bypass is added.

### 9. Route-local non-blank input validation

Create/update route-local input schemas accept a string only when it contains
at least one non-whitespace character. The validator returns the original
accepted string unchanged; it does not trim, normalize or rebuild it.

Required examples:

- invalid: `""`, `"   "`, `"\n\t "`;
- valid and persisted exactly: `"abc"`, `" abc "`, `"  a  "`.

The schema adds no minimum character count beyond non-whitespace existence, no
maximum length, format, language, semantic, duplicate, category or taxonomy
rule. It remains operation-specific and route-local, not a shared contract.
Update/remove `id` remains a UUID-shaped opaque input with no authority outside
trusted tenant scope.

Server enforcement is canonical and occurs after MANAGE authorization but
before repository persistence. Client-side validation may reuse the same
meaning only for UX; bypassing it still cannot persist invalid content.

Rejected create behavior:

- return a field-associated validation error;
- perform no repository create and create no canonical row;
- retain the browser pending draft as non-canonical;
- do not run successful route revalidation.

Rejected edit behavior:

- return the same clear validation class;
- perform no repository update or delete;
- preserve the previously saved canonical row unchanged;
- retain the invalid browser draft for correction;
- do not report success or run successful route revalidation.

Blank is never converted to null, remove, delete, cancel or successful no-op.
Physical remove stays the separate explicit operation from Decision 6.

### 10. Page-local UI and pending-state architecture

The capability is an independent route-local section after the five current
Restaurant Knowledge slices. Existing Profile and knowledge sections, data,
forms and actions remain untouched except for page composition required to add
the new section.

READ presentation renders only the current active list or valid no-item state.
When `canManage` is false, no add, edit, remove or save control is rendered.

MANAGE presentation uses one route-local client section with:

- canonical server items received from the Server Component;
- one local baseline and draft per current item;
- local pending-removal flag per item with an undo path before save;
- a local new-item draft created by an explicit add control;
- operation-local pending, success and error feedback;
- exact item-scoped save controls described in Decision 4.

A new draft uses a browser-only key such as `draft:<random>` solely for React
identity. It is never sent as canonical item ID or tenant authority. Successful
create replaces the draft key with the server-returned item. Successful update
replaces that item's accepted baseline with the canonical response. Successful
remove removes the item from current client projection. Server revalidation
refreshes route data but correctness does not depend solely on a remount/key
change.

Failed create/update/remove preserves local draft/pending state and displays a
recoverable error; it does not update the accepted canonical baseline. Change,
blur, timer, effect and background synchronization invoke no mutation.

For blank or whitespace-only create/edit, client validation may immediately
show the field-associated French message
`Saisissez une connaissance contenant au moins un caractère autre qu’un espace.`
and disable that item's save attempt. The draft remains visible and editable.
Server rejection remains authoritative if client validation is bypassed. A
rejected edit continues to display the pending draft for correction while the
accepted canonical baseline stays unchanged; it never toggles the pending
remove path or removes the item.

The section reuses current `@yuta/ui` primitives and `lucide-react`, French UI
copy, keyboard operation, visible focus, accessible names and semantic
status/error alerts. It adds no giant catch-all textarea, category/tag/reorder,
AI/suggestion or provenance/history UI.

### 11. Cross-module and runtime isolation

Repository, loader, actions and UI do not read, write, copy, link, infer,
synchronize or resolve ownership against Establishment Profile, Carte & menus,
Personnel/Salariés, Planning, Pointage, Reservations, Stock, Suppliers,
Tasks/Today, AI, Reviews, Marketing, YUTA Assistant, website answers, staff
assistant, POS, Site Agent, Display or external providers.

The implementation remains Cloud/db-cloud/Backoffice only and introduces no
shared contract or downstream consumer. Discovery of any such dependency,
permission/tenancy change or cross-runtime behavior is an immediate
`CROSS_MODULE / NEEDS REVIEW` stop.

### 12. Additive migration and rollback posture

After Design approval and immediately before future Apply, re-read the current
Drizzle journal and generate the next migration through repository tooling; do
not assume its numeric tag in Design. Migration is additive: create only the
dedicated table, composite PK/FK and no backfill. It does not alter or delete
existing Restaurant Knowledge data.

Verification later must inspect generated SQL/snapshot/journal and run the
complete blank-to-current migration chain against disposable PostgreSQL. It
must verify exact constraints plus cross-organization and cross-establishment
denials.

Application rollback is deploy-old-code-first: older code ignores the additive
table, so data can remain safely unused. Physical table removal is not part of
normal application rollback; any later destructive schema rollback requires a
separate reviewed migration and data-retention decision.

### 13. VERIFY strategy

Later VERIFY must map every Spec requirement/scenario and every Technical
Implementation Contract to exact code/tests and produce the Technical
Compliance Matrix. Minimum evidence:

- exact table columns, composite PK/FK, `ON DELETE RESTRICT`, absence of
  prohibited uniqueness/metadata and full migration chain;
- zero, one and multiple item list behavior with deterministic reads;
- item-scoped create, edit and physical remove plus failed/no-match paths;
- no autosave and correct successful/failed reconciliation;
- concurrent unrelated-item safety, stale edit-after-delete behavior and
  documented same-item last-successful-write-wins behavior;
- organization, establishment, mismatched-scope, cross-establishment ID and
  cross-organization ID isolation;
- READ-before-repository and zero reads on denial;
- MANAGE-before-parse/persistence and zero writes on denial;
- OWNER and MANAGER success, STAFF denial and Profile permission
  non-substitution;
- no semantic/text duplicate enforcement, cross-module lookup,
  provenance/AI/candidate behavior or downstream/runtime dependency;
- regression tests for all existing page sections.

Focused non-blank evidence must cover:

- create rejects exact empty, spaces-only and newline/tab/space-only content;
- rejected create performs no repository create, creates no canonical item,
  returns a validation error and does not run success revalidation;
- blank edit performs no repository update/delete, preserves the previous
  canonical statement, retains the pending invalid draft and does not run
  success revalidation;
- `"abc"`, `" abc "` and `"  a  "` pass, with surrounding whitespace persisted
  exactly and no trim;
- bypassing client validation still fails at the server boundary;
- UI keeps invalid drafts editable, shows the clear French validation message
  and keeps remove as a separate explicit operation.

### 14. Mandatory real Browser QA strategy

`UI_AFFECTING: YES` and `BROWSER_QA_REQUIRED: YES`.

Before Gate 3, QA must use authenticated real route
`/etablissement/informations-generales` with real persisted data and cover:

- OWNER MANAGE and MANAGER MANAGE;
- safe no-access principal when current auth/environment provides it;
- no-item, one-item and multiple-item states;
- pending create, edit and remove before save;
- successful explicit item-scoped save and persisted reload round-trip;
- no autosave;
- failed-save recovery when safely observable without damaging the
  environment;
- widths 1440, 1024, 768 and 390;
- keyboard navigation, visible focus, accessible labels/names and observable
  status/error semantics;
- no horizontal overflow/clipping;
- regression visibility/layout for Establishment Profile and all five existing
  Restaurant Knowledge sections.

Unavailable auth/error states must be reported truthfully and never fabricated.
QA evidence later includes real screenshots and a lowercase SHA-256 manifest.

### 15. Dirty-worktree attribution before Apply

Immediately before any future Apply, capture current HEAD, sorted status,
exact intended shared-path allowlist, byte baselines and lowercase SHA-256 for
every existing intended path, `MISSING` for intended new paths, and a protected
inventory of all unrelated dirty files.

Gate 3 evidence must be generated from saved pre-Apply baseline to current
bytes, not raw HEAD diff. It must include every attributable existing change,
every new implementation/test file as `/dev/null -> current`, and every new
migration artifact similarly. Declared path count must equal actual
`diff --git` count, with apply/reverse integrity and no unrelated attribution.

### 16. Knowledge and lifecycle

Product Knowledge and Module Registry remain read-only during Apply/VERIFY.
Post-archive Knowledge Consolidation remains a separate reviewed workflow.
Design does not alter these lifecycle dimensions:

- Product Decision: `APPROVED`;
- Implementation: current repository-authoritative state;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

## Risks / Trade-offs

- **[Client/server whitespace validation could diverge]** → keep server
  enforcement authoritative, cover the approved examples at both boundaries
  and preserve the original valid string unchanged.
- **[Same-item concurrent edits can overwrite]** → retain documented
  last-successful-item-write behavior; any conflict/version UX requires a new
  Product decision.
- **[Physical deletion is irreversible]** → keep removal explicitly pending
  until save and provide local undo before save; no false success on zero-row
  delete.
- **[Opaque UUID ordering could be mistaken for Product priority]** → expose no
  ordering controls or ordering claim; use it only for deterministic reads.
- **[Client draft identity could be mistaken for authority]** → prefix/localize
  draft keys and never accept them in create persistence.
- **[Repository existence check adds a query]** → accept the small overhead for
  explicit fail-closed tenant/resource verification; no cross-module lookup is
  involved.
- **[Additive table may remain after application rollback]** → old code ignores
  it; do not perform destructive rollback without separate review.

## Migration Plan

1. After explicit Sensitive Design Gate approval, create Tasks only; do not
   start Apply without separate approval.
2. Immediately before Apply, capture deterministic dirty-worktree attribution
   and re-read the Drizzle journal.
3. Add the scoped schema/repository and generate the additive migration through
   current repository tooling.
4. Add server authorization/parsing/actions and the page-local UI/pending-state
   behavior in dependency order.
5. Run focused tests, repository checks, full disposable PostgreSQL migration
   verification, VERIFY/Technical Compliance Matrix and mandatory Browser QA.
6. Stop at Gate 3. Sync/archive, deployment, lifecycle promotion and Knowledge
   Consolidation remain separately authorized workflows.

## Resolved Product Decision

Revised Gate 2 resolves the prior empty-item blocker:

- a saved statement must contain at least one non-whitespace character;
- blank/whitespace-only create or edit fails validation;
- accepted valid text, including surrounding whitespace, is preserved exactly;
- blank edit never means remove or another successful canonical operation;
- server-side enforcement is mandatory.

Status: `RESOLVED`.

There is no remaining `CONFLICT`, `NEEDS REVIEW`, cross-module requirement or
deviation from the approved Spec. Design is ready for Sensitive Design review,
but Tasks/Apply remain forbidden until explicit human Gate 2b approval.
