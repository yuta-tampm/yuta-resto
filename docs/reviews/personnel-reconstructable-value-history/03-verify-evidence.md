# VERIFY Evidence

Change: `personnel-reconstructable-value-history`

Schema: `yuta-spec-driven`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES`

## Independent assessments

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

QA is assessed independently in `qa/QA_REPORT.md`.

## Approved artifact integrity

The approved planning artifacts and Gate packets were recomputed before final
verification and still match their recorded hashes.

| Artifact                | SHA-256                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `proposal.md`           | `9aa477361db22e88bfd6ceefd22b4a7975c1792daee3013da849116244fc913c` |
| `analysis.md`           | `09d50e50cb9a37af7df402025319078ddff446c146c67284f56278131dd25445` |
| delta `spec.md`         | `0841018f7318820ab52bae6685d58ee4227b207d0ce1520f3eb2dcd3aca7f496` |
| `design.md`             | `d931e22022dc4a047a78d1fb276a60cb2b232797ebb78a68c11a5eb0e703cfd6` |
| Gate 1 review           | `160e328f6c2683c5378e1cdcff01d8fb2a858065cb60b771e698dd8b964517a1` |
| Gate 2 review           | `844ca91a33c0403d38be7b2974a6363285053593d0c13efa74660c14c7ad6f4b` |
| Sensitive Design review | `7453950547cf9374a4c4e136b10ed92c219d2041c54ca0cca90bde05b53b7d4a` |

## Technical Compliance Matrix

| Spec requirement                                                                        | Approved Design decision                                                             | Implementation location                                                                                             | Test/evidence                                                                           | Status |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------ |
| Six allowlisted semantic groups and versioned strict payloads                           | Decisions 1–2: event aggregate, immutable group children, strict versioned snapshots | `packages/contracts/src/personnel/index.ts`; `packages/db-cloud/src/personnel-history-cutover.ts`; migration `0017` | Contracts 38/38; domain/cutover tests; corrupt-version Browser QA fails closed          | PASS   |
| Per-group classification and metadata                                                   | Decision 3: server derives groups and validates each independently                   | `packages/db-cloud/src/personnel-history-domain.ts`; route metadata fields                                          | Domain tests and multi-group repository integration                                     | PASS   |
| Identity dual classification; Entry Correction-only                                     | Decision 3 classification matrix                                                     | Domain validator and `employee-history-metadata-fields.tsx`                                                         | Focused model/component tests                                                           | PASS   |
| Role/Contract/Work-time Change date required, past-or-today, bounded by entry/departure | Decision 3 effective-date validation; no scheduled state                             | Domain validator; date input max/helper                                                                             | Future/missing/boundary unit and integration tests; real date-input rejection           | PASS   |
| Approved correction-reason matrix                                                       | Decision 3 conditional reason validation                                             | Domain validator and route metadata UI                                                                              | Domain matrix plus focused UI tests                                                     | PASS   |
| Authoritative coupled previous/new values, including explicit null                      | Decisions 1–4: server snapshots current and proposed values in one transaction       | Domain snapshots and repository event/group inserts                                                                 | Domain coupled-snapshot tests; repository integration; rendered history QA              | PASS   |
| Mutation/history/audit/receipt atomicity                                                | Decision 4: one database transaction                                                 | `updatePersonnelEmployee`, departure commands, history insert helpers                                               | Success and injected history-write rollback integration cases                           | PASS   |
| Revision conflict, replay, and fingerprint conflict preserved                           | Decision 4 preserves CAS and receipt semantics                                       | Personnel repository and action mapping                                                                             | Stale/replay/fingerprint integration tests; real two-tab recovery                       | PASS   |
| Multi-group all-or-nothing                                                              | Decisions 3–4: validate before one atomic write                                      | Domain derivation and repository mutation path                                                                      | Multi-group success and one-invalid-group total rollback                                | PASS   |
| Eager exactly-once cutover and retry/concurrency safety                                 | Decision 5: scoped lock, fixed cutover time, completion marker                       | `personnel-history-cutover.ts`; migration constraints                                                               | Guarded cutover integration matrix covers all nine approved cases                       | PASS   |
| Current-at-cutover limitation and no fake baseline                                      | Decision 5: eligibility captured at locked cutover; post-cutover dossiers excluded   | Cutover runner and unique partial index                                                                             | Pre/post-cutover disposable data plus real baseline/no-baseline QA                      | PASS   |
| OWNER-only unified Historique, compatibility dedup, stable newest-50                    | Decision 6 and Decision 8                                                            | Repository unified projection; Backoffice action/component                                                          | Repository merge/dedup/51-event tests; Browser QA exactly 50                            | PASS   |
| Safe typed projection and neutral system attribution                                    | Decisions 2, 6, and 8                                                                | Personnel contracts, repository projection, presentation helper                                                     | UI tests; DOM scan found no raw/internal identifiers; baseline QA                       | PASS   |
| Departure record/correct/cancel compatibility                                           | Decision 4 retains departure command semantics                                       | Personnel repository departure paths                                                                                | Guarded integration covers first record, correction, and null cancellation              | PASS   |
| Organization, establishment, employee, and OWNER authority                              | Decision 8: trusted session scope only                                               | Existing permission guard, actions, composite FKs/predicates                                                        | OWNER success; MANAGER/STAFF, suspended, wrong-scope, and foreign employee denial tests | PASS   |
| Five-year post-departure retention eligibility only                                     | Decision 7: Personnel-owned eligibility, no executor/authority invention             | Pure retention eligibility behavior in cutover module                                                               | Attached/before-five/at-five tests; source/schema scan                                  | PASS   |
| Exclusions and no pre-cutover reconstruction                                            | Goals/Non-goals; Decisions 5, 7, 9                                                   | Scoped change inventory                                                                                             | Diff/path/import scans; no excluded module, scheduler, cleanup, or cross-runtime change | PASS   |

## Technical Implementation Contract compliance

| Phase contract              | Required outcome                                                                         | Evidence                                                       | Status |
| --------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------ |
| 1. Foundation / Data        | Additive versioned storage, strict payloads, exactly-once cutover, retention eligibility | New `0017` only; schema/contracts tests; guarded cutover suite | PASS   |
| 2. Service / Domain         | Server-derived groups, per-group rules, atomic writes, unified safe history              | Domain/repository code; full disposable-db integration         | PASS   |
| 3. UI / Components          | Extend existing editor/History; safe typed rendering; no global primitive change         | Route-local files and focused Backoffice tests                 | PASS   |
| 4. Interaction / States     | One submit, recoverable validation/error/conflict, refresh both surfaces                 | Edit/history-flow tests and real drawer/full-dossier QA        | PASS   |
| 5. Integration / Regression | Complete checks, scoped review, current docs, Browser QA, Gate packet                    | This evidence, QA report/manifest, final review packet         | PASS   |

## Disposable database evidence

- Migration command completed with exit `0` against a PostgreSQL 17 disposable
  database. PostgreSQL emitted only identifier-truncation notices for long
  constraint names.
- Guarded focused integration command ran both Personnel repository and cutover
  files: 2 files, 29 tests passed, exit `0`.
- Guarded full `@yuta/db-cloud` suite: 20 files passed, 1 separately gated
  booking-reliability file skipped; 101 tests passed, 2 skipped; exit `0`.
- Repository coverage includes atomic dossier/history/audit/receipt success,
  multi-group success, one-invalid-group rollback, injected history-write
  rollback, stale revision, replay, fingerprint conflict, tenant denial,
  departure record/correct/cancel, legacy/F07/baseline merge, compatibility
  deduplication, newest-50, and truncation.
- Cutover coverage includes initial cutover, exactly one baseline, retry before
  commit, retry after committed/lost response, concurrent employee creation,
  concurrent update, concurrent departure, transaction rollback, and missing
  completion marker fail-closed behavior. Corrupt payload and cross-scope
  linkage cases add defense-in-depth beyond the required nine.

## Repository checks

| Command                                                                               | Exact result                                                                           |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/contracts test`                                                  | PASS — 2 files, 38 tests; exit 0                                                       |
| `pnpm --filter @yuta/contracts typecheck`                                             | PASS; exit 0                                                                           |
| `pnpm --filter @yuta/db-cloud typecheck`                                              | PASS; exit 0                                                                           |
| guarded `pnpm --filter @yuta/db-cloud test`                                           | PASS — 20 files passed, 1 skipped; 101 tests passed, 2 skipped; exit 0                 |
| `pnpm --filter @yuta/backoffice test`                                                 | PASS — 83 files passed, 1 skipped; 377 tests passed; exit 0                            |
| `pnpm --filter @yuta/backoffice typecheck`                                            | PASS; exit 0                                                                           |
| `pnpm --filter @yuta/backoffice build`                                                | PASS — Next.js 16.2.9 production build and dynamic `/equipe/salaries`; exit 0          |
| `pnpm docs:check`                                                                     | PASS after as-built documentation update; exit 0                                       |
| `pnpm ui:pack:check`                                                                  | PASS — 18 packages; 90 preserved historical-provenance/lifecycle warnings; exit 0      |
| `pnpm architecture:check`                                                             | PASS; exit 0                                                                           |
| `pnpm -r --if-present typecheck`                                                      | PASS across 15 of 16 participating projects; exit 0                                    |
| `pnpm exec openspec validate personnel-reconstructable-value-history --strict --json` | PASS — 1 item, 0 issues; exit 0                                                        |
| scoped Prettier check over all attributable text/code artifacts                       | PASS; exit 0                                                                           |
| `pnpm format:check`                                                                   | FAIL — 69 pre-existing/out-of-scope files; no attributable F07 file was listed; exit 1 |

The repository-wide formatting failure is reported without alteration. It is
not an F07 compliance failure because every attributable text/code file passes
the same formatter and none of the 69 reported paths belongs to this change.

## Scoped diff and migration review

- Captured HEAD for this Phase 5 review:
  `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- Exactly 30 implementation/as-built documentation files are attributable to
  F07; their current SHA-256 values are recorded below.
- Migration `0017_whole_warbound.sql` and its `0017_snapshot.json` are new.
  No existing SQL migration or old snapshot was modified. Only `_journal.json`
  gained the generated `0017` entry.
- The migration is additive and creates only Personnel-owned history event,
  group, and cutover-marker structures plus their constraints/indexes/FKs.
- No Documents, Registre, Formalités, Planning, Pointage, AI/OCR,
  authentication, or consultation-history implementation path changed.
- The permission map is byte-unchanged; no MANAGER grant or new permission was
  added.
- No cleanup cron/job, keep-forever field, invented legal-hold source,
  scheduled/pending/future state, or cross-runtime behavior exists in the
  scoped diff.
- Rollback remains preserve-data and roll-forward: once cutover is complete,
  missing completion evidence or an incompatible writer fails closed; there is
  no destructive automatic rollback plan or code.

### Attributable file manifest

| Path                                                                                                       | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-edit-dialog.tsx`             | `2d9f00c5cfd3c5ff82aea290e297cdda50b41d871ce46159eddf84f976b9a8e5` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-history-metadata-fields.tsx` | `5c0fc96862a6be7e0d9b64d73bc819df502e83412e84d506c1a941e83a0a0cd5` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-history.tsx`                 | `c3cc34819b7ad786f7b17201384df9682faddb2feab4a84807664a17373ebdf0` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/salaries-page.tsx`                    | `75dd06e0e53681c452e0e877dcaa3f657b6a622b0a8c2437529e101aff6f6d6c` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow.test.ts`                  | `d7516ae5ed1bd52f41ff16ba7f6c3260faa098bb9d216fcaf5349c929287ad7b` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow.ts`                       | `84e9b4c827bfbb23cc880e3681918d577a159a1021e11f850cb55aabd75bee5b` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-action-errors.ts`           | `49902e23f172425b835c995a40e18ef856269972ec73e49a2ec0e26fd4974c9c` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-presentation.ts`            | `54c7fbb2c10d9f80968736fee39da2d2c38aec75c5168cf24b1d4a58f0ee34a9` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-refresh.test.ts`            | `6d91d38d1b2352291f8fdd9ef700a92370d29328fc753196aa9b3265fbb02efc` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-refresh.ts`                 | `eaf639c4b14c6871b27955585d0e21bd2638444989e8f45c7c4b00e2e040e616` |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/actions.ts`                                       | `21a48e154ad23ec84c4cf0e0b828f6cb3741b3e8b0a92bc33e7c65388e99c240` |
| `apps/backoffice/test/personnel-history-action.test.ts`                                                    | `6a4155ad622fb9178754ac9274b36ae918d66b21f6f86102ec60535270c84e83` |
| `apps/backoffice/test/personnel-reconstructable-history-ui.test.tsx`                                       | `579f8873c063e38cbbd217cfa7190e1a3f7f6936ca7b6285362843a32f02a87e` |
| `packages/contracts/src/personnel/index.ts`                                                                | `833d0017753b4a1bb245e5c01473d4c34ccf8ffaf77c572105d414b845308690` |
| `packages/contracts/test/personnel.test.ts`                                                                | `c0de46cf385c42921b31d0c638ed0648900f01ebb51958ae0016d865c5c11a2d` |
| `packages/db-cloud/drizzle/0017_whole_warbound.sql`                                                        | `da44f6697cbf3933fd95484fef2727e48a88ac5cd1d421780ecb789b5ec7b623` |
| `packages/db-cloud/drizzle/meta/0017_snapshot.json`                                                        | `617681b23ddea95f13cfc5d82fac6e3649499515d546d5ee10ff67a8324f9ea6` |
| `packages/db-cloud/drizzle/meta/_journal.json`                                                             | `a6e2f8c10bae551d8ac91bdf9aa85eaaea103e3a265b606d51e402da31c290f5` |
| `packages/db-cloud/src/index.ts`                                                                           | `3e69703fa7194abc660c0fde7972636900febe280938280201e2801a44a6bc0b` |
| `packages/db-cloud/src/personnel-history-cutover.ts`                                                       | `68242dd4a1f7dab648be83d0a1ac0257480ea85493dee23160f25127afec928b` |
| `packages/db-cloud/src/personnel-history-domain.ts`                                                        | `c68739ed397596493821eb2025c7b3ef73551f28713c288a442d18395aafb156` |
| `packages/db-cloud/src/personnel-repository.ts`                                                            | `28cbb0fb44b28bec110c32486ca99d6c64215918d9e8114e2d340b63e2e499c0` |
| `packages/db-cloud/src/schema/personnel.ts`                                                                | `a6a5ccc7949bc80cf80d05be13a01e67d7f5d6494663d497294d30c6afed23cf` |
| `packages/db-cloud/test/personnel-history-cutover.integration.test.ts`                                     | `00e70b83b109b11e106d45e73ac58c11e10c6fbb7b799fcd6b458803eb7c87a8` |
| `packages/db-cloud/test/personnel-history-cutover.test.ts`                                                 | `fbd6ff55478922b8239bd216c361f184b12987f6bf3581819a3402267d9dd6f9` |
| `packages/db-cloud/test/personnel-history-domain.test.ts`                                                  | `b51dce0a88f8ebb9da51c497d052b48b238d803f81f1f94fdb56a887a18c86cd` |
| `packages/db-cloud/test/personnel-repository.integration.test.ts`                                          | `cdfa71ef0c39c4ace3015848c3a4168d547a203e005b7bc18bebc97e15c129eb` |
| `packages/db-cloud/test/schema.test.ts`                                                                    | `55a4a6e3147216132d036e03968b34243bff34bdf07c5bd515b9572e6c693bc1` |
| `docs/features/personnel/README.md`                                                                        | `56f35fae713b25445fde248708ec8e2f314a586227151d7e7bb5ed6b5c972b0d` |
| `docs/ui/pages/backoffice-equipe-salaries/README.md`                                                       | `243a0516dc0ae3ecb9a0aacf1e2ac6af6c13c01b7b43d5f12a57a29bb7be3211` |

## Deviations and blocked evidence

- Approved Product/Design deviation: `NONE`.
- Required technical evidence blocked: `NONE`.
- Required Browser QA blocked: `NONE`.
- Unrelated repository-wide formatter debt remains visible and untouched.
- Browser QA found one route-local controlled/uncontrolled Select warning. The
  controlled empty-state fix passed the focused 5-test UI suite, Backoffice
  typecheck, the full 377-test Backoffice suite, production build, and fresh
  authenticated browser retest without the warning.
- No production environment, migration, cutover, cleanup, backup, deploy,
  spec sync, or archive was executed.
