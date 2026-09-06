# Tasks + Implementation Plan Review

Change: `formalites-persistent-draft-foundation`

Gate: `Tasks / Pre-Apply`

Review status: `APPROVED`

Approval source: `explicit current-user instruction`

Approval recorded by: `Codex workflow`

Approved: `2026-09-04T23:59:32.3815389+02:00`

Created: `2026-09-04T23:33:44.4090326+02:00`

Regenerated: `2026-09-04T23:43:45.5399825+02:00`

Schema: `yuta-spec-driven`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES — Phase 4 only`

Sync authorization: `NOT_REQUESTED`

Production: `NOT_AUTHORIZED`

## Approved authority and integrity

| Artifact                                                                                                       | SHA-256                                                            | Status                                          |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `openspec/changes/formalites-persistent-draft-foundation/proposal.md`                                          | `2166d890b0449b63c925c798724e9e66432a8bff5debbccab238851ade73db18` | Gate 1 approved, unchanged                      |
| `openspec/changes/formalites-persistent-draft-foundation/analysis.md`                                          | `11f11ee989b339dad2286fd6e2bc34e3119514a55dd4717123bea529a28ad693` | Gate 1 approved, unchanged                      |
| `openspec/changes/formalites-persistent-draft-foundation/specs/formalites/persistent-draft-foundation/spec.md` | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` | Gate 2 approved; 22 Requirements / 70 Scenarios |
| `openspec/changes/formalites-persistent-draft-foundation/design.md`                                            | `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610` | Sensitive Design approved; D1–D16               |
| `docs/reviews/formalites-persistent-draft-foundation/02-specs-review.md`                                       | `12c341f511e0cbd79e4ee567002bfa0d814fa238c63386c97ea17a06ceaa61b5` | APPROVED                                        |
| `docs/reviews/formalites-persistent-draft-foundation/02b-design-review.md`                                     | `5f0e6e5f214de8fe322f4f8c952c92f223a205682bcb8bab1553db5fe422d996` | APPROVED                                        |
| `openspec/changes/formalites-persistent-draft-foundation/tasks.md`                                             | `5b8a6e8ccc4297e22bee4fb95e800df707054df04e6895673de89ca04f588c3c` | Regenerated; awaiting review; 31 tasks          |

Hash values are lowercase SHA-256 of exact formatted bytes. Tasks are planning
only and all 31 checkboxes remain unchecked.

## Targeted correction

| ID  | Requested correction                                                        | Applied planning change                                                                                                                                                                                                                               | Boundary preserved                                                                           |
| --- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| T1  | Authorization failure semantics aligned with existing auth stack            | Phase 2 contract/tests/task 2.6, Phase 4 regression and authorization matrix now distinguish login redirect, tenant recovery/fail-closed, establishment 400 and permission 403 instead of forcing public/service/system-role denial to universal 403. | No auth/grant/helper change; no bypass added                                                 |
| T2  | Operation-key lifecycle explicitly mapped across contracts/actions/UI/tests | Phase 1 contract/task 1.2, Phase 2 contract/task 2.5, Phase 3 contract/tasks 3.2/3.5/3.6 and Phase 4 QA now define one opaque key per logical mutation, same-key uncertain retry, new-key deliberate mutation and no raw key/hash exposure.           | D10 receipt model unchanged; key is technical input, never authority or Product-visible data |

All other approved phase structure, task numbering, data model, lock order, N4
boundary, PostgreSQL evidence, Browser QA and production exclusions are
unchanged.

## Selected implementation phases

| Phase                       | Why it is required                                                                                                                                                                                                                                    | Human stop                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1. Foundation / Data        | New bounded transport/domain contracts, two new cloud tables, constraints and one additive migration are required before any durable operation can exist.                                                                                             | Required before Service / Domain       |
| 2. Service / Domain         | Trusted authorization, atomic lifecycle operations, reconciliation, replay and concurrency must be enforced server-side and in db-cloud.                                                                                                              | Required before UI                     |
| 3. UI / Components          | The approved employee-connected route becomes an interactive persistent draft surface with recoverable states. Interaction is merged into this phase because it uses the same route-local components/state and does not justify an empty fifth phase. | Required before final integration      |
| 4. Integration / Regression | Real database races, cross-module regressions, documentation, VERIFY and mandatory responsive Browser QA must be proven together against the as-built candidate.                                                                                      | Gate 3 only if all three verdicts PASS |

No separate Interaction phase is created: tasks 3.2–3.5 cover interaction and
state behavior inside the UI ownership boundary. No deployment/production phase
exists because it is explicitly unauthorized.

## Requirement → task coverage

|   # | Approved Requirement                                                       | Primary implementation tasks | Final evidence     |
| --: | -------------------------------------------------------------------------- | ---------------------------- | ------------------ |
|   1 | Eligibility tạo draft dựa trên Personnel hiện tại và trusted scope         | 2.1, 2.2, 2.6                | 4.1, 4.2, 4.5, 4.6 |
|   2 | Formalités authorization và Personnel source authorization độc lập         | 2.6, 3.1                     | 4.2, 4.5, 4.6      |
|   3 | Browser identifiers và claims không tạo authority                          | 2.6, 3.1                     | 4.1, 4.2, 4.5      |
|   4 | Draft lifecycle sử dụng explicit persistence                               | 1.4, 2.1, 2.2, 3.2           | 4.1, 4.6           |
|   5 | Abandonment yêu cầu reason và giữ record                                   | 1.4, 2.4, 3.4                | 4.1, 4.6           |
|   6 | Có thể tạo draft mới sau abandonment                                       | 1.4, 2.1                     | 4.1, 4.6           |
|   7 | Tối đa một active draft trong business scope                               | 1.4, 2.1                     | 4.1, 4.5           |
|   8 | probationChoice có ba trạng thái chuẩn bị đã duyệt                         | 1.2, 1.4, 2.2, 3.2           | 4.1, 4.6           |
|   9 | INCLUDE không phải kết luận hoặc khuyến nghị pháp lý                       | 1.2, 3.2, 3.6                | 4.4, 4.5, 4.6      |
|  10 | Draft giữ đúng Personnel reference, anchor và source snapshot              | 1.3, 1.4, 2.1                | 4.1, 4.5           |
|  11 | Reopen phát hiện relevant Personnel divergence theo source facts           | 1.3, 2.3, 3.3                | 4.1, 4.6           |
|  12 | Reconciliation là explicit và per divergent fact                           | 1.2, 1.3, 2.3, 3.3           | 4.1, 4.6           |
|  13 | Reconciliation thành công giải quyết đúng source state đã đối chiếu        | 1.3, 2.3, 3.3                | 4.1, 4.6           |
|  14 | Reconciliation stale phải fail visibly                                     | 2.3, 3.3, 3.5                | 4.1, 4.6           |
|  15 | Current Personnel eligibility độc lập với reconciliation choice            | 2.2, 2.3, 3.4                | 4.1, 4.6           |
|  16 | CDI eligibility phục hồi không bỏ qua reconciliation                       | 2.3, 3.3, 3.4                | 4.1, 4.6           |
|  17 | Save failure giữ nguyên authoritative saved state                          | 2.2, 2.5, 3.5                | 4.1, 4.6           |
|  18 | Concurrent và stale mutations không dùng silent last-write-wins            | 1.4, 1.5, 2.1–2.5, 3.5       | 4.1, 4.5, 4.6      |
|  19 | Mọi resource access giữ full tenant scope                                  | 1.4, 1.5, 2.1, 2.6           | 4.1, 4.2, 4.5      |
|  20 | Formalités draft không ghi ngược vào Personnel                             | 1.3, 2.1–2.5                 | 4.1, 4.2, 4.5      |
|  21 | Employee-connected capability được mở rộng mà không phá prototype hiện tại | 3.1–3.6                      | 4.2, 4.4, 4.6      |
|  22 | Workflow giữ draft mà không hứa retention vô hạn                           | 1.4, 1.5, 1.6, 2.4, 2.5      | 4.4, 4.5           |

Every Requirement has implementation ownership plus final executable or review
evidence. Task 4.5 must reject a PASS row that lacks executable evidence.

## Design D1–D16 → task coverage

| Design                                    | Planned tasks                      | Acceptance focus                                                                |
| ----------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| D1 Ownership/runtime                      | 1.4–1.7, 2.1–2.8                   | Backoffice + db-cloud only; Personnel remains source owner                      |
| D2 Literal formality type                 | 1.2, 1.4, 2.1                      | Only `cdi_preparation`; no generic engine                                       |
| D3 Minimal full-scope aggregate           | 1.4, 1.7                           | Typed columns, full tenant/resource constraints                                 |
| D4 Field inventory/minimization           | 1.2–1.5                            | Exact seven facts; bounded lifecycle/receipt fields                             |
| D5 Content + acknowledged source          | 1.3, 2.3, 3.3                      | KEEP/REFRESH semantics and no repeated prompt                                   |
| D6 Exact stale-source fingerprint         | 1.3, 2.3                           | Server recomputation; stale fail without write                                  |
| D7 Mutation-time CDI eligibility          | 2.1–2.3, 2.7                       | Personnel-first lock and both CDI→CDD serial orders                             |
| D8 One active draft                       | 1.4, 1.7, 2.1                      | Partial unique index and concurrent CREATE                                      |
| D9 Optimistic revision                    | 1.4, 2.2–2.4                       | CAS, stale draft, save/save and save/abandon                                    |
| D10 Command receipts                      | 1.2, 1.5, 2.5, 3.2, 3.5, 3.6, 4.6  | One-key-per-logical-mutation lifecycle, replay safety, no raw key or expiry job |
| D11 Atomic commands/lock order            | 2.1–2.5, 2.7                       | `PERSONNEL → FORMALITES DRAFT`; ABANDON draft only                              |
| D12 Trusted auth composition              | 2.6, 3.1, 4.2                      | Independent permissions, 400/403 and no browser authority                       |
| D13 Typed safe contracts/outcomes         | 1.2, 2.6, 3.1–3.5                  | No raw rows, hashes, IDs or stack errors in UI                                  |
| D14 Existing route/prototype preservation | 3.1–3.7, 4.2, 4.6                  | Connected route only; generic prototype and dev gate intact                     |
| D15 Additive migration/no backfill        | 1.6, 1.7, 4.5                      | One new migration, no old edit/backfill/production run                          |
| D16 Verification strategy                 | 1.7–1.8, 2.7–2.8, 3.6–3.7, 4.1–4.8 | Separate compliance, VERIFY and QA evidence                                     |

## Operation-key ownership across phases

| Phase                | Owner and behavior                                                                                                                                                                                                                          | Required evidence                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1. Contracts         | Mutation input carries one bounded opaque operation key; malformed/missing applicable values fail parsing; read models expose neither raw key nor persisted hash.                                                                           | Task 1.2 focused contract tests and task 1.5 schema inspection |
| 2. Action/repository | Action/repository hashes the key, uses scoped receipt lookup and compares normalized fingerprint. Same key/same mutation recovers one outcome; same key/different mutation conflicts; different key is re-evaluated as a distinct mutation. | Task 2.5 real disposable-DB replay/rollback tests              |
| 3. Client state      | One logical pending/retryable mutation retains one key. Uncertain retry reuses it; success or deliberate new mutation starts a new key; double submit does not create another command.                                                      | Tasks 3.2, 3.5 and 3.6 component/state evidence                |
| 4. Integration/QA    | Repeat-submit/retry produces no duplicate effect where safely reproducible, and neither operation key nor hash appears in UI/screenshots.                                                                                                   | Tasks 4.1, 4.5 and 4.6                                         |

The operation key is technical orchestration input only: it never supplies
authority, tenant scope, Personnel facts or Product-visible identity, and only
its one-way hash may be persisted in the bounded receipt.

## Expected implementation inventory by phase

### Phase 1 — exact allowlist

| Path                                                                           | Expected action                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `packages/contracts/src/formalites/index.ts`                                   | New bounded Zod contracts/types, including opaque mutation operation-key input |
| `packages/contracts/src/index.ts`                                              | Add one export                                                                 |
| `packages/contracts/test/formalites.test.ts`                                   | New contract tests                                                             |
| `packages/db-cloud/src/formalites-personnel-draft-domain.ts`                   | New pure domain helper                                                         |
| `packages/db-cloud/src/schema/formalites.ts`                                   | New two-table schema                                                           |
| `packages/db-cloud/src/schema/index.ts`                                        | Add schema export                                                              |
| `packages/db-cloud/test/formalites-personnel-draft-domain.test.ts`             | New domain tests                                                               |
| `packages/db-cloud/test/formalites-personnel-draft-schema.integration.test.ts` | New guarded schema/migration tests                                             |
| `packages/db-cloud/drizzle/<next-sequence>_<generated-slug>.sql`               | New generated additive migration only                                          |
| `packages/db-cloud/drizzle/meta/<same-sequence>_snapshot.json`                 | New generated snapshot only                                                    |
| `packages/db-cloud/drizzle/meta/_journal.json`                                 | One generated append; protect current dirty preimage                           |

The migration filename is deliberately a path rule, not an invented slug: the
repository's existing `db:generate` command owns the generated slug and exact
next sequence. The generated paths must be recorded before Phase 1 review.

### Phase 2 — exact allowlist

| Path                                                                                          | Expected action                                                        |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `packages/db-cloud/src/formalites-personnel-draft-repository.ts`                              | New scoped repository with operation-key hashing/receipt orchestration |
| `packages/db-cloud/src/index.ts`                                                              | Add bounded repository export; protect current concurrent preimage     |
| `packages/db-cloud/test/formalites-personnel-draft-repository.integration.test.ts`            | New full disposable-DB suite                                           |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/actions.ts` | New server actions parsing bounded technical operation keys            |
| `apps/backoffice/test/formalites-persistent-draft-actions.test.ts`                            | New trusted-context/action tests                                       |

No auth/permission file is in the Phase 2 allowlist. The existing Formalités
authorization helper is consumed byte-for-byte.

### Phase 3 — exact allowlist

| Path                                                                                                                     | Expected action                                                                    |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/page.tsx`                              | Extend connected loader/surface                                                    |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-connected-read-model.ts`             | Extend safe read-model mapping                                                     |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-connected-read-prototype.tsx` | Route existing connection into durable workspace without deleting prototype assets |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace.tsx`                | New client workspace                                                               |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-state.ts`                  | New interaction state and one-key-per-logical-mutation lifecycle                   |
| `apps/backoffice/test/formalites-persistent-draft-component.test.tsx`                                                    | New component tests                                                                |
| `apps/backoffice/test/formalites-persistent-draft-state.test.ts`                                                         | New state tests                                                                    |

Shared `@yuta/ui`, generic prototype, navigation and dev-gate files are not
allowed. Discovery of a need to modify them is a STOP condition.

### Phase 4 — evidence and bounded documentation

| Path group                                                                                        | Expected action                                                  |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Five current page-pack files named in Phase 4 contract                                            | Minimum as-built update only if required; no readiness promotion |
| `docs/reviews/formalites-persistent-draft-foundation/03-final-review.md`                          | Gate 3 packet only after three PASS verdicts                     |
| `docs/reviews/formalites-persistent-draft-foundation/03-integrity.json`                           | Current workflow integrity manifest                              |
| `docs/reviews/formalites-persistent-draft-foundation/03-implementation.diff`                      | Exact scoped implementation diff                                 |
| `docs/reviews/formalites-persistent-draft-foundation/QA_REPORT.md`                                | Real-route QA report                                             |
| `docs/reviews/formalites-persistent-draft-foundation/screenshot-manifest.md` and screenshot files | Required viewport/state evidence and hashes                      |

Application/test changes in Phase 4 are permitted only to fix a directly
observed defect inside an earlier approved allowlist and require rerunning the
owning phase contract.

## Database and concurrency test matrix

| Case                               | Owning task  | Required observable evidence                                        |
| ---------------------------------- | ------------ | ------------------------------------------------------------------- |
| Migration on clean DB              | 1.7          | Both tables/constraints/indexes exist; no skip                      |
| Migration on existing Personnel DB | 1.7          | Existing employees/data unchanged; no backfill drafts               |
| Scoped employee FK                 | 1.7          | Cross-org/establishment employee reference rejected                 |
| Establishment/org integrity        | 1.7          | Mismatched pair rejected                                            |
| Lifecycle checks                   | 1.7          | DRAFT has null reason/time; ABANDONED has bounded reason/time       |
| One active draft                   | 1.7, 2.1     | Second active insert loses deterministically                        |
| Concurrent CREATE                  | 2.1, 2.7     | One draft; loser gets safe `active_draft_exists`                    |
| Create after abandon               | 1.7, 2.1     | New active draft without overwriting abandoned row                  |
| Revision compare-and-swap          | 2.2–2.4      | Successful mutation increments once; stale update writes nothing    |
| Save/save                          | 2.2, 2.7     | One legal winner, no last-write-wins                                |
| Save/abandon                       | 2.4, 2.7     | One legal serialization, lifecycle remains coherent                 |
| Stale editor                       | 2.2, 3.5     | Typed stale result + authoritative reload model                     |
| Stale reconciliation               | 2.3          | Fingerprint mismatch, zero mutation/receipt                         |
| Response-loss replay               | 2.5          | Same key + same normalized mutation returns one committed effect    |
| Different replay payload           | 2.5          | Same key + different fingerprint returns `replay_conflict`          |
| Distinct intended mutation         | 2.5          | Different key re-evaluates auth/eligibility/revision/conflict       |
| Transaction rollback               | 1.7, 2.2–2.5 | Draft and receipt both unchanged/absent                             |
| CDI→CDD: Personnel first           | 2.2, 2.7     | Stale UI mutation rejected; previous draft unchanged                |
| CDI→CDD: Formalités first          | 2.2, 2.7     | Formalités commit completes before Personnel change becomes current |
| No Personnel side effects          | 2.7          | Personnel row/history/command-receipt counts and bytes unchanged    |

Every database row requires real disposable PostgreSQL execution. Environment
absence or a skipped guarded suite yields `BLOCKED`, not PASS.

## Authorization and security matrix

| Boundary                                                | Permission/context                                             | Expected result                                                             | Evidence task |
| ------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| READ/REOPEN                                             | trusted OWNER + `formalites.read` + independent Personnel READ | Allow inside active org/establishment                                       | 2.6, 4.2      |
| CREATE/SAVE/EDIT/RECONCILE                              | trusted OWNER + `formalites.manage` + Personnel READ           | Allow only current eligible scope                                           | 2.6, 4.1      |
| ABANDON                                                 | trusted OWNER + `formalites.manage`                            | Allow scoped active draft even when current non-CDI                         | 2.4, 4.1      |
| Unauthenticated / invalid authenticated user            | no valid trusted user                                          | Preserve current login redirect; do not reach permission evaluation         | 2.6, 4.2      |
| Missing/inactive/mismatched membership or tenant scope  | trusted tenant resolution fails                                | Preserve current recovery redirect or fail-closed upstream behavior         | 2.6, 4.2      |
| Missing required establishment                          | trusted composition lacks establishment                        | Exact `ESTABLISHMENT_REQUIRED` / 400                                        | 2.6, 4.2      |
| Authenticated MANAGER / STAFF membership                | valid tenant but requested Formalités grant absent             | Exact permission denial / 403; no resource disclosure                       | 2.6, 4.2, 4.6 |
| Public / service / system role                          | cannot supply restaurant authority                             | No bypass; actual earlier login/recovery/fail-closed or later 403 preserved | 2.6, 4.2      |
| Wrong organization/establishment                        | scoped resource mismatch                                       | Not found/fail closed without existence leak                                | 2.1, 2.6, 4.1 |
| Browser tenant/org/establishment/role/permission claims | untrusted                                                      | Ignored; cannot create authority                                            | 2.6, 4.2      |
| Employee ID / draft ID                                  | parsed reference only                                          | Never authority; all repository access repeats scope                        | 2.1–2.6, 4.1  |
| Personnel permission alias                              | forbidden                                                      | Formalités MANAGE remains independent                                       | 2.6, 4.2      |

Grant maps and the four approved Formalités authorization implementation files
must remain byte/semantically unchanged. Any required permission change returns
to Control Tower.

## UI and Browser QA matrix

| Scenario                           | Component evidence | Browser evidence at 1440 / 1024 / 768 / 390          |
| ---------------------------------- | ------------------ | ---------------------------------------------------- |
| OWNER eligible, no draft           | 3.1, 3.6           | 4.6 explicit Create state                            |
| Create                             | 3.2                | 4.6 persisted success                                |
| SAVE UNDECIDED                     | 3.2, 3.6           | 4.6 reload/reopen proof                              |
| INCLUDE                            | 3.2, 3.6           | 4.6 neutral preparation wording                      |
| EXCLUDE                            | 3.2, 3.6           | 4.6 persisted choice                                 |
| Reopen/reload                      | 3.2                | 4.6 same authoritative draft                         |
| KEEP                               | 3.3                | 4.6 draft/current remain visibly distinct            |
| REFRESH                            | 3.3                | 4.6 accepted Personnel value becomes draft value     |
| Mixed reconciliation               | 3.3                | 4.6 per-fact choices                                 |
| Non-CDI recovery                   | 3.4                | 4.6 read/abandon only                                |
| Abandon + required reason          | 3.4                | 4.6 success and retained record                      |
| Abandoned read-only                | 3.4                | 4.6 no content mutation control                      |
| Validation error                   | 3.5                | 4.6 input preserved + focus recovery                 |
| Stale draft/source/replay conflict | 3.3, 3.5           | 4.6 clear reload/recovery                            |
| Generic server error/retry         | 3.5                | 4.6 same-key retry when commit status is uncertain   |
| Login/recovery/permission denial   | 3.1                | 4.6 preserve actual auth-stack outcome, no data leak |
| Pending/double submit              | 3.2, 3.5           | 4.6 one key/command and no duplicate effect          |
| Deliberate new mutation            | 3.2, 3.5           | 4.6 new key and current rules re-evaluated           |
| Dirty close                        | 3.5                | 4.6 keyboard/mouse protection                        |
| Keyboard/focus                     | 3.5, 3.6           | 4.6 accessible traversal and recovery                |
| Responsive/no overflow             | 3.5                | 4.6 all four widths                                  |
| Forbidden content/internals        | 3.6                | 4.6 no operation key/hash or other raw internals     |

Browser QA uses the real authenticated route and safe synthetic local data. It
is not run during Tasks or Phase 3.

## Rollback, migration and N4 boundaries

| Check                                    | Planned disposition                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| Existing migration edits                 | Forbidden; exact byte comparison required                                             |
| New migration                            | One additive generated migration after separately approved Phase 1 Apply              |
| Backfill                                 | None; prototype memory/fixtures are not authoritative drafts                          |
| Local/disposable migration               | May be separately authorized per Apply phase                                          |
| Production migration                     | `NOT_AUTHORIZED`                                                                      |
| Pre-data correction                      | New reviewed forward migration only                                                   |
| After durable data exists                | Preserve tables/data; stop writers or roll forward; no destructive automatic rollback |
| DRAFT / ABANDONED retention              | Persist/retain in bounded slice; no automatic expiry                                  |
| User hard delete / purge / anonymization | Not implemented                                                                       |
| Receipt expiry / cleanup job             | Not implemented                                                                       |
| Legal hold                               | No new authority or mechanism invented                                                |
| Infinite retention promise               | Explicitly absent                                                                     |
| Future retention/deletion                | Separate future Product/privacy change                                                |
| Production backup/PITR/readiness         | Deferred and not authorized                                                           |

N4 is `RESOLVED_FOR_BOUNDED_SLICE`: there is no retention implementation task.
Tasks only prevent automatic deletion/expiry and preserve the approved bounded
data behavior.

## Production exclusion check

- LOCAL / DEVELOPMENT APPLY: `REQUIRES_SEPARATE_HUMAN_AUTHORIZATION_PER_PHASE`.
- PRODUCTION MIGRATION: `NOT_AUTHORIZED`.
- PRODUCTION ROUTE ENABLEMENT: `NOT_AUTHORIZED`.
- PRODUCTION DEPLOYMENT: `NOT_AUTHORIZED`.
- No task runs production migration, cutover, backfill, deploy, environment
  promotion, cleanup/anonymization or release enablement.
- Route remains behind the current development gate.

## Current review evidence

Commands run for this Tasks step:

| Command                                                                              | Result                                                               |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `openspec status --change formalites-persistent-draft-foundation --json`             | Tasks transitioned from ready to done; planning complete             |
| `openspec instructions tasks --change formalites-persistent-draft-foundation --json` | Exit 0; current Vietnamese task template/instructions loaded         |
| Scoped repository/path/script inspection                                             | Exit 0; exact phase allowlists and current dirty overlaps identified |
| `pnpm exec prettier --check` on Tasks and Gate review packets                        | Exit 0; all matched files use Prettier style                         |
| `openspec validate formalites-persistent-draft-foundation --strict`                  | Exit 0; change is valid                                              |
| `pnpm docs:check`                                                                    | Exit 0; 36 current documents consistent                              |
| `pnpm architecture:check`                                                            | Exit 0; runtime/import/database/migration boundaries valid           |
| `pnpm -r --if-present typecheck`                                                     | Exit 0; all 15 invoked workspace projects passed                     |

The broad checks above are preserved from the initial Tasks packet; the
targeted wording correction did not change implementation. Correction-specific
revalidation:

| Check                                                               | Result                                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Scoped Prettier write/check for `tasks.md` and this packet          | PASS                                                                           |
| `openspec validate formalites-persistent-draft-foundation --strict` | PASS; change is valid                                                          |
| Task recount                                                        | 31 unchecked; 0 checked                                                        |
| Approved Spec SHA-256                                               | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` — unchanged |
| Approved Design SHA-256                                             | `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610` — unchanged |
| Regenerated Tasks SHA-256                                           | `5b8a6e8ccc4297e22bee4fb95e800df707054df04e6895673de89ca04f588c3c`             |

No application test, database migration or Browser QA is appropriate at this
planning-only step.

## Scope and mutation confirmation

- No implementation executed.
- No application/test code changed.
- No API or server action created.
- No schema or migration generated/modified.
- No database or production operation executed.
- Gate 1 Proposal/Analysis and approved Spec/Design bytes remain unchanged.
- Only `tasks.md` and review/progress metadata for this authorized workflow step
  were created or updated.

## Human decision required

Approve or request changes to the 31-task Implementation Plan and four embedded
Technical Implementation Contracts. Apply must not begin without a separate
human authorization naming Phase 1.
