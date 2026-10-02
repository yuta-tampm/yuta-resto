# Phase 1 — Foundation / Data

Change: `formalites-persistent-draft-foundation`

Schema: `yuta-spec-driven`

Review status: `AWAITING_HUMAN_REVIEW`

Evidence recorded: `2026-09-05T00:15:28.4015458+02:00`

Authorized scope: tasks `1.1`–`1.8` only.

Phase 1 Technical Implementation Contract: `PASS`

Phase 2: `NOT_STARTED`

Production migration / route enablement / deployment: `NOT_AUTHORIZED`

## Authority and pre-Apply integrity

Trước khi ghi, ba artifact đã duyệt đều khớp byte:

| Artifact    | Approved SHA-256                                                   | Result |
| ----------- | ------------------------------------------------------------------ | ------ |
| `tasks.md`  | `5b8a6e8ccc4297e22bee4fb95e800df707054df04e6895673de89ca04f588c3c` | MATCH  |
| Delta Spec  | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` | MATCH  |
| `design.md` | `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610` | MATCH  |

HEAD tại pre-Apply là
`07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`. Worktree đã có thay đổi ngoài
change này; không reset hoặc ghi đè chúng. Overlap được phân loại như sau:

- `packages/contracts/src/index.ts` và
  `packages/db-cloud/src/schema/index.ts` là file tồn tại, không có diff trước
  Phase 1; preimage lần lượt là
  `199bb5c1e86df3182fffed26c803e0e7567c91a6664ed05e119fe46ca0791072`
  và `f5c1c8189ab69a77fe0aee3784585e311745bb8271b242b47ad1eb448c72fb42`.
- Bảy implementation/test target còn lại chưa tồn tại.
- Migration head `0017_whole_warbound.sql`, snapshot `0017_snapshot.json` và
  journal đã có từ Personnel F07 được duyệt. Hash preimage lần lượt là
  `da44f6697cbf3933fd95484fef2727e48a88ac5cd1d421780ecb789b5ec7b623`,
  `617681b23ddea95f13cfc5d82fac6e3649499515d546d5ee10ff67a8324f9ea6`
  và `a6e2f8c10bae551d8ac91bdf9aa85eaaea103e3a265b606d51e402da31c290f5`.
- Chuỗi journal SHA bị thiếu hai ký tự trong một bản tóm tắt hội thoại; đối
  chiếu trực tiếp với F07 evidence và các manifest hiện hành xác nhận preimage
  64 ký tự ở trên là authority thực và byte không drift.
- Bốn file prerequisite `formalites-authorization` khớp đúng approved hashes ở
  cả đầu và cuối Phase 1.

## Exact implementation inventory

| Path                                                                           | Change                                  | Final SHA-256                                                      |
| ------------------------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------ |
| `packages/contracts/src/formalites/index.ts`                                   | New bounded contracts                   | `cd09c92e05c5e12e74a9c6d7746cf698911c4359c7c8a3ef25521b02bf91cd04` |
| `packages/contracts/src/index.ts`                                              | Export Formalités contracts             | `ce44e688cea68cee2291db00a89207b5ae95086c3ef9de2df649858aa7378a44` |
| `packages/contracts/test/formalites.test.ts`                                   | New focused contract tests              | `6e27637c05e7c04d9a68d0e621f608267c2aca66d2177f421bfad177a113c772` |
| `packages/db-cloud/src/formalites-personnel-draft-domain.ts`                   | New pure reconciliation helper          | `117d22ae1f3a5ff92a926a615dd6fae75989e61d0f1d9ef88365b4aba09e1043` |
| `packages/db-cloud/src/schema/formalites.ts`                                   | New draft and receipt schema            | `bf7be60d7c9957683e84ad990c513e91e023ae1ab8096d8c7e5d50eb8ea694c8` |
| `packages/db-cloud/src/schema/index.ts`                                        | Export new schema                       | `c701826c9712e62958acab13e1a2827951e1cb37f8080f64631d66a0d76e4359` |
| `packages/db-cloud/test/formalites-personnel-draft-domain.test.ts`             | New pure-domain tests                   | `6d7c6118b47749363fe72be1ffc2f94418a954558f445443b20717c3419cbafd` |
| `packages/db-cloud/test/formalites-personnel-draft-schema.integration.test.ts` | New schema/real-PostgreSQL tests        | `4ae58e5991069b06f6ef81e8e65df2b554506352147cca2bd0afa54f3992cebc` |
| `packages/db-cloud/drizzle/0018_elite_hardball.sql`                            | New generated additive migration        | `98ab37e9c9b13ebea5503b30f7ace60cc25fd14758cddeb6ef144844ef10cf75` |
| `packages/db-cloud/drizzle/meta/0018_snapshot.json`                            | New generated snapshot                  | `07ede7f42b4f1f744e700d5603b6dbfd69d867aefc86d498295251628035e0ee` |
| `packages/db-cloud/drizzle/meta/_journal.json`                                 | One `0018` append after approved `0017` | `04a7ddfe1c91d0acf54eee402d6e2e762780c9a13433c25d37dcc2534ee3e765` |
| `openspec/changes/formalites-persistent-draft-foundation/tasks.md`             | Check tasks `1.1`–`1.8` only            | `f0711c7ce3ea610d839defd82dbc6d76b910add253e7efad00dd367c7eaf4162` |
| `docs/reviews/formalites-persistent-draft-foundation/phase-1-review.md`        | This evidence packet                    | Self-hash intentionally not embedded                               |

`docs/reviews/formalites-persistent-draft-foundation/02c-tasks-review.md` was
changed before Apply only to record the explicit Tasks approval. Phase 1 did not
alter its substantive approved plan.

## Contract and domain evidence

- Contracts allowlist exactly one formality type, two lifecycle states, three
  probation choices and seven Personnel facts. Weekly minutes remain
  `integer | null`; no combined identity field exists.
- CREATE/SAVE/RECONCILE/ABANDON inputs require a bounded opaque operation key.
  Missing or malformed values fail parsing. It appears only in mutation input,
  never in read/display models.
- Read models and mutation outcomes are strict, typed unions. Tests reject
  tenant IDs, actor IDs, operation-key hashes, receipt fingerprints and stack
  internals in public models.
- Pure helpers normalize and compare only the seven facts, create a stable
  SHA-256 source-state fingerprint, implement KEEP/REFRESH, leave inputs
  unmodified, suppress already-acknowledged divergence and detect a later source
  change. Personnel is never written.

Focused results:

- `@yuta/contracts`: 1 file, 6 tests, all PASS, no skips.
- `@yuta/db-cloud` domain + schema: 2 files, 13 tests, all PASS, no skips when
  the disposable DB guard is enabled.

## Schema and migration review

Final generated migration: `0018_elite_hardball.sql`.

It contains only:

- four bounded Formalités technical enums;
- `formalites_personnel_drafts` with 27 columns;
- `formalites_personnel_draft_command_receipts` with 11 columns;
- full organization/establishment/employee/draft foreign keys;
- positive revision/source-revision checks;
- exact `cdi_preparation` check;
- normalized 1–250 abandonment-reason plus lifecycle time consistency;
- nullable weekly-minute bounds;
- one-active partial unique index;
- scoped receipt uniqueness and 64-character lower-hex hash checks.

There is no INSERT/UPDATE/DELETE/backfill. No draft was created for an existing
employee. No old migration changed: tracked `0000`–`0016` have no diff, and
approved uncommitted `0017` SQL/snapshot retain their exact F07 hashes shown
above.

During migration verification, the first generated candidate exposed a real
PostgreSQL ordering defect: a receipt composite FK was emitted before the
referenced composite unique index. The schema was corrected to use an inline
composite unique constraint; the failing generated candidate was discarded
before acceptance. A later generated candidate was also replaced before final
acceptance to make the DB backstop require an already-trimmed abandonment
reason. Neither discarded candidate remains in the repository or journal. The
final candidate is the only `0018` artifact and passed both migration paths.

## Disposable PostgreSQL evidence

Runtime: local disposable Docker container `postgres:16-alpine`, server
PostgreSQL 16, loopback port only. It was not production data.

### A. Clean database

`pnpm --filter @yuta/db-cloud db:migrate` applied `0000`–`0018` successfully.
The migration ledger contained 19 rows and both new tables existed. The guarded
schema suite executed rather than skipped: 1 file / 7 tests PASS.

### B. Existing Personnel database

The fixture applied the exact 18 prior SQL migrations, copied the first 18
Drizzle ledger entries from the clean proof, and inserted one scoped Personnel
dossier. Before `0018`, Formalités table count was zero. The normal repository
`db:migrate` command applied only the new migration; ledger count became 19.

Before and after values stayed exactly:

`Jeanne|Durand|Serveuse|revision 1`

After the real suite cleaned its synthetic rows:

- pre-existing Personnel dossier: unchanged;
- Formalités drafts: `0`;
- Formalités receipts: `0`.

The same guarded schema suite executed on this upgraded database: 1 file / 7
tests PASS.

Together the real tests cover table existence, nullable minutes, probation
enum rejection, bounded type/revision/minutes, trimmed lifecycle reason/time,
organization/establishment and employee composite scope, invalid cross-scope
insert denial, one-active uniqueness, create-after-abandon, bounded receipt
uniqueness/hash constraints and a successful insert followed by injected
transaction failure leaving no partial row.

## Commands and results

| Exact command                                                                                                                                                                               | Result                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/db-cloud db:generate`                                                                                                                                                  | Final run exit 0; generated `0018_elite_hardball.sql` and matching snapshot/journal append                            |
| `pnpm --filter @yuta/db-cloud db:migrate` against clean DB                                                                                                                                  | Exit 0; 19 migrations applied                                                                                         |
| `pnpm --filter @yuta/db-cloud db:migrate` against existing-Personnel DB                                                                                                                     | Exit 0; `0018` applied after 18 recorded migrations                                                                   |
| `pnpm --filter @yuta/contracts exec vitest run test/formalites.test.ts`                                                                                                                     | Exit 0; 1 file / 6 tests PASS                                                                                         |
| `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-personnel-draft-domain.test.ts test/formalites-personnel-draft-schema.integration.test.ts` with guarded disposable DB enabled | Exit 0; 2 files / 13 tests PASS                                                                                       |
| Schema integration suite on clean DB                                                                                                                                                        | Exit 0; 1 file / 7 tests PASS, no skip                                                                                |
| Schema integration suite on existing-Personnel DB                                                                                                                                           | Exit 0; 1 file / 7 tests PASS, no skip                                                                                |
| `pnpm --filter @yuta/contracts typecheck`                                                                                                                                                   | Exit 0                                                                                                                |
| `pnpm --filter @yuta/db-cloud typecheck`                                                                                                                                                    | Exit 0                                                                                                                |
| `pnpm -r --if-present typecheck`                                                                                                                                                            | Exit 0; 15 of 16 workspace projects completed                                                                         |
| `pnpm docs:check`                                                                                                                                                                           | Exit 0; 36 current documents PASS                                                                                     |
| `pnpm architecture:check`                                                                                                                                                                   | Exit 0                                                                                                                |
| `pnpm exec openspec validate formalites-persistent-draft-foundation --strict`                                                                                                               | Exit 0; valid                                                                                                         |
| Scoped `pnpm exec prettier --check` over Phase 1 implementation/planning paths                                                                                                              | Exit 0                                                                                                                |
| `pnpm format:check`                                                                                                                                                                         | Exit 1; exactly 62 unrelated pre-existing files, none in Phase 1 scope. Repository-wide format is truthfully NOT PASS |
| `pnpm exec openspec instructions apply --change formalites-persistent-draft-foundation --json`                                                                                              | Exit 0; 8/31 complete, exactly tasks 1.1–1.8                                                                          |

The first clean migration diagnostic failed before the inline unique-constraint
fix. Its failure was reproduced with the direct Drizzle migrator as PostgreSQL
error `42830` (“no unique constraint matching given keys”). The final migration
rerun passed; this resolved defect is reported rather than hidden.

## Protected boundaries

| Protected Formalités authorization file                         | Final SHA-256                                                      | Result |
| --------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| `apps/backoffice/src/server/auth/formalites.ts`                 | `60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626` | MATCH  |
| `apps/backoffice/src/server/auth/permissions.ts`                | `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` | MATCH  |
| `apps/backoffice/test/formalites-authorization-context.test.ts` | `af3a2bd48565cec5afb559602626b16c563f21ca3ec660b7943e4e49327f4537` | MATCH  |
| `apps/backoffice/test/formalites-permissions.test.ts`           | `9e9888461c4154df90802f3d9021956dba3731cd34a9d27aa110d08ba9bc42e6` | MATCH  |

No Phase 1 attributed diff touches Personnel schema/repository/history,
Personnel authorization, generic Formalités prototype, development gate,
navigation, Backoffice UI, production configuration, server action or lifecycle
repository.

## N4 and production exclusions

Search and schema inspection confirm no address, remuneration, departure,
document, raw JSON form payload, raw operation key, request dump, IP,
user-agent, expiry, cleanup, purge, anonymization or legal-hold field/job was
introduced. The bounded draft and receipt technical state has no automatic
expiry and makes no infinite-retention guarantee.

Only disposable local databases were migrated. No production migration,
cutover, route enablement, deployment, sync or archive occurred.

## Verdict

Required Phase 1 evidence blocked: `NONE`.

Approved-scope deviation: `NONE` in final repository state. The discarded
generated migration candidates are disclosed diagnostic iterations; final
state contains exactly one additive migration and no old-migration edit.

Phase 1 — Foundation / Data: `PASS`.

Phase 1 Technical Implementation Contract: `PASS`.

STOP for human Phase 1 review. Do not begin Phase 2.
