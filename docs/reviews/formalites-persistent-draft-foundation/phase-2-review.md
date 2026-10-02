# Phase 2 — Service / Domain

Change: `formalites-persistent-draft-foundation`

Schema: `yuta-spec-driven`

Review status: `AWAITING_HUMAN_REVIEW`

Authorized scope: tasks `2.1`–`2.8` only.

Phase 2 Technical Implementation Contract: `PASS`

Phase 3: `NOT_STARTED`

Production migration / route enablement / deployment: `NOT_AUTHORIZED`

## Pre-Apply integrity

Trước khi ghi, approved Spec và Design khớp byte:

| Artifact    | Approved SHA-256                                                   | Result |
| ----------- | ------------------------------------------------------------------ | ------ |
| Delta Spec  | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` | MATCH  |
| `design.md` | `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610` | MATCH  |

Toàn bộ 11 implementation/migration hashes ghi trong `phase-1-review.md` đều
MATCH. Migration `packages/db-cloud/drizzle/0018_elite_hardball.sql` vẫn có
SHA-256
`98ab37e9c9b13ebea5503b30f7ace60cc25fd14758cddeb6ef144844ef10cf75`.
Không có Phase 1 contract/schema/migration nào bị sửa trong Phase 2.

Fresh preimage của shared path `packages/db-cloud/src/index.ts` là
`3e69703fa7194abc660c0fde7972636900febe280938280201e2801a44a6bc0b`.
Preimage này đã chứa approved F07 exports; Phase 2 chỉ thêm đúng một export
`./formalites-personnel-draft-repository` và giữ nguyên phần concurrent đó.

Bốn file prerequisite `formalites-authorization` khớp approved hashes trước
Apply và được xác nhận lại ở cuối Phase 2.

## Exact implementation inventory

| Path                                                                                          | Change                                | Final SHA-256                                                      |
| --------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| `packages/db-cloud/src/formalites-personnel-draft-repository.ts`                              | New scoped repository                 | `d3c371c6e3b22ba4ffa3bccc4cf77f83493ca58bebe8e2a48974ff6b9d054418` |
| `packages/db-cloud/src/index.ts`                                                              | One bounded repository export         | `4a48127a97360420e60cda9f96fd685ed6634d432308952ca07aa20440d75904` |
| `packages/db-cloud/test/formalites-personnel-draft-repository.integration.test.ts`            | New real-PostgreSQL integration suite | `726b6fc077e09cbe679be150f7bdbfdeeccd7ddad48034727f2268b5e11d9861` |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/actions.ts` | New employee-connected server actions | `41d0ed0dbf7bb71e8c0d111e154a1daefc8c86ceb96b744b8bd0282694644b76` |
| `apps/backoffice/test/formalites-persistent-draft-actions.test.ts`                            | New action/auth/safe-output tests     | `8702fa3de1821fc6929454a5a5f6bd33dde1f726def74c984b68dac33166c9d9` |
| `openspec/changes/formalites-persistent-draft-foundation/tasks.md`                            | Check tasks `2.1`–`2.8` only          | `d285bfe9c66d940a165b57ba6d48e1bfcdfc9a48f2d6b26e667bdb4246ead822` |
| `docs/reviews/formalites-persistent-draft-foundation/phase-2-review.md`                       | This evidence packet                  | Self-hash intentionally not embedded                               |

Không có file implementation nào ngoài Phase 2 allowlist bị sửa bởi phase
này. Không có UI, route page, navigation, development gate, auth/grant,
Personnel repository/schema/history hoặc production config nào bị đổi.

## Repository behavior

### READ / REOPEN và CREATE

- READ lookup Personnel trước bằng full organization + establishment +
  employee scope, sau đó chỉ đọc active draft hoặc retained abandoned draft
  trong cùng scope. Wrong scope trả `not_found`/`null` mà không lộ existence.
- Current Personnel là nguồn authoritative. Read model chỉ chứa typed values
  từ approved contracts; raw row, tenant IDs, actor IDs, receipt internals và
  hashes không được trả ra.
- CREATE khóa scoped Personnel row, kiểm tra duy nhất
  `employmentTermType = indefinite`, capture coherent seven-fact draft/source
  snapshots rồi ghi draft + receipt trong một transaction.
- Part-time, departure hoặc trạng thái không upcoming không trở thành
  eligibility gate. Concurrent create kết thúc với đúng một active draft; prior
  abandoned record không bị sửa và không chặn eligible create mới.

### SAVE / EDIT

- Canonical lock order là `PERSONNEL → FORMALITES DRAFT`.
- Current CDI eligibility, full resource scope, active lifecycle và expected
  revision được kiểm tra lại trong transaction.
- `UNDECIDED`, `INCLUDE`, `EXCLUDE` đều save được. Relevant Personnel
  divergence buộc reconciliation trước normal save; stale editor không
  last-write-wins.
- Save/save và save/abandon races cho đúng một mutation thành công; mutation
  còn lại nhận bounded stale/abandoned outcome và không ghi partial state.

### RECONCILE

- Server tự đọc current seven facts, derive exact divergent set và fingerprint;
  browser không gửi Personnel truth.
- Missing, duplicate, extra/non-divergent choices, empty reconciliation hoặc
  stale fingerprint đều bị từ chối không ghi.
- KEEP giữ draft value nhưng advance acknowledged source. REFRESH advance cả
  draft value lẫn acknowledged source. Unchanged source không prompt lại;
  Personnel đổi lần nữa tạo divergence mới.

### ABANDON

- ABANDON chỉ lock scoped Formalités draft và không dùng current CDI làm
  eligibility gate. Personnel chỉ được scoped-read để tạo safe current read
  model trả về, không bị lock hoặc mutate.
- Reason được contract trim/validate 1–250, active status + expected revision
  là bắt buộc. Status, reason, abandoned timestamp, revision và receipt commit
  atomically.
- Existing non-CDI recovery draft vẫn abandon được. Abandoned draft không được
  save/reconcile/reactivate; create mới là record mới.

## Replay and receipt matrix

| Case                                     | Evidence / outcome                                             | Result |
| ---------------------------------------- | -------------------------------------------------------------- | ------ |
| Same key + same normalized mutation      | `success`, `replayed: true`, revision không tăng lần hai       | PASS   |
| Same key + materially different mutation | `replay_conflict`, no write                                    | PASS   |
| Different key + stale prior revision     | chạy lại current rules và nhận `stale_draft`                   | PASS   |
| Operation-key storage                    | chỉ SHA-256 one-way hash, không có raw key                     | PASS   |
| Request evidence                         | canonical SHA-256 fingerprint, không raw Personnel/reason body | PASS   |
| Receipt scope                            | organization + establishment + actor + command + key hash      | PASS   |
| Receipt rollback                         | injected FK failure để lại 0 orphan receipt                    | PASS   |

Operation key/hash không được dùng làm authority, không có `expiresAt`, cleanup
job hoặc Product-visible field.

## Transaction, concurrency and rollback evidence

Real PostgreSQL matrix chạy trên disposable local `postgres:16-alpine`, database
`yuta_formalites_phase2`, loopback port `56041`. Repository migration command
applied `0000`–`0018` successfully trước test; không có production data hoặc
production operation.

| Matrix                               | Evidence                                                               | Result |
| ------------------------------------ | ---------------------------------------------------------------------- | ------ |
| Concurrent CREATE                    | two callers → one `success`, one `active_draft_exists`, one active row | PASS   |
| SAVE/SAVE                            | one `success`, one `stale_draft`                                       | PASS   |
| SAVE/ABANDON                         | one success, loser stale/abandoned, no half lifecycle                  | PASS   |
| CDI→CDD, CDD commits first           | SAVE waits, then `ineligible_recovery`; prior draft revision unchanged | PASS   |
| CDI→CDD, Formalités commits first    | draft lock fixture proves SAVE holds Personnel; SAVE commits then CDD  | PASS   |
| CREATE receipt failure               | inserted draft rolled back                                             | PASS   |
| SAVE receipt failure                 | probation/revision rolled back                                         | PASS   |
| RECONCILE receipt failure            | draft/source acknowledgement/revision rolled back                      | PASS   |
| ABANDON receipt failure              | status/reason/time/revision rolled back                                | PASS   |
| Stale fingerprint / invalid decision | no draft change, no receipt                                            | PASS   |

The real guarded Formalités suite executed 3 files / 26 tests PASS with no
skipped test: 13 repository, 7 schema and 6 pure-domain tests.

## Personnel no-write proof

For CREATE, SAVE, RECONCILE and ABANDON, integration tests capture before/after
real database evidence and require exact equality of:

- complete Personnel current row SHA-256;
- Personnel revision;
- Personnel audit-event count;
- Personnel history-event count;
- Personnel command-receipt count;
- Personnel register entry, correction, receipt and audit counts.

All four mutation classes PASS. Repository source contains Personnel
`SELECT`/row-lock only; runtime evidence, not source inspection alone, is the
acceptance proof.

## Authorization and safe action evidence

Server actions call `requireFormalitesTenant('formalites.read' | 'formalites.manage')`
before parsing/using browser input and independently require
`personnel.employee.read` wherever current Personnel source is returned or
consulted.

| Boundary                                           | Actual outcome                                       | Result |
| -------------------------------------------------- | ---------------------------------------------------- | ------ |
| Valid active OWNER membership                      | READ and MANAGE allowed                              | PASS   |
| Missing session / invalid session                  | existing login redirect                              | PASS   |
| Missing/inactive/mismatched membership/scope       | existing establishment-resolution recovery redirect  | PASS   |
| Missing establishment                              | `ESTABLISHMENT_REQUIRED`, status 400                 | PASS   |
| Valid MANAGER / STAFF membership                   | `CROSS_TENANT_ACCESS_DENIED`, status 403             | PASS   |
| Public / service actors                            | denied by preserved Formalités permission suite      | PASS   |
| YUTA_ADMIN / YUTA_SUPPORT without OWNER membership | no bypass; recovery or 403 at the existing boundary  | PASS   |
| Browser tenant/org/establishment/role/permission   | ignored as authority; strict contract rejects extras | PASS   |
| Formalités vs Personnel permission                 | independently evaluated                              | PASS   |
| Invalid repository response / infrastructure error | safe `server_error`; no internal values returned     | PASS   |

Focused Backoffice authorization/action/prototype run: 5 files / 87 tests PASS.
Full Backoffice test run: 86 files PASS, 1 file skipped by its own existing
guard, 457 tests PASS.

Four protected authorization files remain exact:

| Path                                                            | Approved SHA-256                                                   | Result |
| --------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| `apps/backoffice/src/server/auth/formalites.ts`                 | `60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626` | MATCH  |
| `apps/backoffice/src/server/auth/permissions.ts`                | `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` | MATCH  |
| `apps/backoffice/test/formalites-authorization-context.test.ts` | `af3a2bd48565cec5afb559602626b16c563f21ca3ec660b7943e4e49327f4537` | MATCH  |
| `apps/backoffice/test/formalites-permissions.test.ts`           | `9e9888461c4154df90802f3d9021956dba3731cd34a9d27aa110d08ba9bc42e6` | MATCH  |

## Commands and exact results

| Exact command                                                                                                                             | Result                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `pnpm --filter @yuta/db-cloud db:migrate` against disposable PostgreSQL                                                                   | Exit 0; migrations `0000`–`0018` applied                               |
| Guarded `vitest` for Formalités repository + schema + domain with `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`                            | Exit 0; 3 files / 26 tests PASS, no skips                              |
| Targeted Personnel scope regressions on real PostgreSQL                                                                                   | Exit 0; 3 selected tests PASS                                          |
| `pnpm --filter @yuta/backoffice exec vitest run` over action/auth/prototype files                                                         | Exit 0; 5 files / 87 tests PASS                                        |
| `pnpm --filter @yuta/backoffice test`                                                                                                     | Exit 0; 86 files PASS, 1 guarded file skipped, 457 tests PASS          |
| `pnpm --filter @yuta/db-cloud test` with DB integration guard deliberately false (broad compile/unit regression; not counted as DB proof) | Exit 0; 8 files / 42 tests PASS, 16 guarded files / 87 tests skipped   |
| `pnpm --filter @yuta/contracts exec vitest run test/formalites.test.ts`                                                                   | Exit 0; 1 file / 6 tests PASS                                          |
| `pnpm --filter @yuta/contracts typecheck`                                                                                                 | Exit 0                                                                 |
| `pnpm --filter @yuta/db-cloud typecheck`                                                                                                  | Exit 0                                                                 |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                | Exit 0                                                                 |
| `pnpm -r --if-present typecheck`                                                                                                          | Exit 0; 15 of 16 workspace projects completed                          |
| Scoped Prettier over Phase 2 implementation/planning paths                                                                                | Exit 0; all matched files use Prettier style                           |
| `pnpm docs:check`                                                                                                                         | Exit 0; 36 current documents PASS                                      |
| `pnpm architecture:check`                                                                                                                 | Exit 0; runtime/import/database/migration boundaries PASS              |
| `pnpm exec openspec validate formalites-persistent-draft-foundation --strict`                                                             | Exit 0; change valid                                                   |
| `pnpm exec openspec instructions apply --change formalites-persistent-draft-foundation --json`                                            | Exit 0; 16/31 complete, exactly tasks 1.1–2.8                          |
| `pnpm format:check`                                                                                                                       | Exit 1; exactly 62 unrelated pre-existing files, none in Phase 2 scope |

### Unrelated existing regression finding

Một broad Personnel integration run (23 tests across Personnel repository và
register suites) produced 22 PASS và một failure trong existing test
`preserves a stable newest-50 window and truncation`. Test hard-code inserted
timestamps at `2026-09-04T12:00:00Z`, nhưng employee creation audit uses current
runtime time (`2026-09-04T22:42:42.106Z`), nên audit đó đứng trước expected
fixture item. Phase 2 không sửa Personnel source/test; three scoped tenant/read/
cross-establishment Personnel regressions được chạy riêng và PASS. Finding này
được giữ nguyên, không sửa ngoài allowlist và không dùng để che giấu evidence.

## Exclusions and verdict

No external/network/provider call occurs in transaction. Không có address,
remuneration, document, PDF, signature, provider, AI/OCR, Personnel write-back,
new permission/grant, UI consumer wiring, production migration, route enablement,
sync, archive hoặc deploy.

Required Phase 2 evidence blocked: `NONE`.

Approved-scope deviation: `NONE`.

Phase 2 — Service / Domain: `PASS`.

Phase 2 Technical Implementation Contract: `PASS`.

STOP for human Phase 2 review. Do not begin Phase 3.
