# Gate 3 — Final Review

Change: `formalites-persistent-draft-foundation`

Gate: `3 — Final Review`

Review status: `APPROVED`

Approval source: `explicit current-user instruction`

Approval recorded by: `Codex workflow`

Approved: `2026-09-05T14:27:34.3530756+02:00`

Created: `2026-09-05T14:12:38.4271602+02:00`

Schema: `yuta-spec-driven`

Sensitive change: `YES — employee-connected Formalités persistence,
authorization, tenancy, reconciliation, retained abandonment data and additive
migration`

Sync authorization: `AUTHORIZED_BY_CURRENT_USER`

Finish outcome: `COMPLETED`

Production migration: `NOT_AUTHORIZED`

Production route enablement: `NOT_AUTHORIZED`

Production deployment: `NOT_AUTHORIZED`

## Gate result

- `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`
- `VERIFY: PASS`
- `QA: PASS`
- `UI_AFFECTING: YES`
- `BROWSER_QA_REQUIRED: YES`
- completed tasks: `31/31`
- completed Technical Implementation Contracts: `4/4`
- approved-scope conflict: `NONE`
- blocked required evidence: `NONE`
- Gate 3 substantive implementation assessment: `PRESERVED`
- Gate 3 attribution/integrity revalidation: `PASS`

The three substantive assessments above are independent and were preserved,
not rerun, during the attribution-only correction. The explicit current-user
instruction approved this exact packet and authorized sync and archive for this
change only. It granted no release or production authority.

## Approved authority integrity

Raw SHA-256 was recomputed over each current artifact.

| Artifact                | SHA-256                                                            | Result |
| ----------------------- | ------------------------------------------------------------------ | ------ |
| Proposal                | `2166d890b0449b63c925c798724e9e66432a8bff5debbccab238851ade73db18` | MATCH  |
| Analysis                | `11f11ee989b339dad2286fd6e2bc34e3119514a55dd4717123bea529a28ad693` | MATCH  |
| Delta Spec              | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` | MATCH  |
| Design                  | `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610` | MATCH  |
| Gate 1 packet           | `17bf41fa36705e6ec96c93b08d9a0419aff1c88fb9e1ba84178f9c96f7462815` | MATCH  |
| Gate 2 packet           | `12c341f511e0cbd79e4ee567002bfa0d814fa238c63386c97ea17a06ceaa61b5` | MATCH  |
| Sensitive Design packet | `5f0e6e5f214de8fe322f4f8c952c92f223a205682bcb8bab1553db5fe422d996` | MATCH  |
| Approved Tasks packet   | `a0dc009f48e8d043098336a0aae49f92d9a4d82bf96d6a01cc1cdf1b3f101316` | MATCH  |

Current Tasks SHA-256 after evidence-backed completion of all 31 tasks:
`3088d958c101ae3184638451d3e2cefe1d2c53d7fe2d9c35fe3cac42beca1d35`.

Provenance HEAD:
`07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

## Implementation summary

- Adds one typed `cdi_preparation` Formalités draft with three probation
  choices and exactly seven Personnel source/draft facts.
- Persists a full organization + establishment + employee scoped draft and
  bounded command receipts through the cloud database runtime.
- Revalidates current CDI eligibility at mutation time, preserves optimistic
  revision semantics and commits draft effect plus receipt atomically.
- Supports create, save/reopen, explicit per-fact KEEP/REFRESH reconciliation,
  non-CDI recovery and reasoned abandonment in the existing employee-connected
  development route.
- Preserves independent `formalites.read` / `formalites.manage` and Personnel
  source-read authorization. OWNER is allowed; MANAGER/STAFF/public/service and
  system roles without restaurant membership do not bypass the boundary.
- Keeps Personnel authoritative and read-only from this capability. No
  Personnel row/history/receipt is written.
- Preserves the generic Formalités prototype, development gate, navigation and
  shared UI primitives.

No address, remuneration, PDF, legal template, signature, provider, Documents
integration, hard delete, cleanup scheduler, expiry, legal-hold authority,
production flag or production operation was added.

## Technical Compliance and VERIFY

The complete 22-requirement and D1–D16 mapping, four phase-contract rows,
migration review and exclusions are recorded in
`03-technical-compliance-matrix.md`.

Technical Compliance Matrix SHA-256:
`9f3512ac11c1aedee365f50ff4863d752ff922bd607d847c4a31338af22d9520`.

### Disposable PostgreSQL evidence

- Local disposable container: `postgres:16-alpine`, actual PostgreSQL 16.14,
  loopback only; synthetic data only.
- Clean migration applied migrations 0000–0018 successfully.
- Existing-state upgrade applied 0000–0017, inserted synthetic Personnel,
  then applied 0018. The existing Personnel values were byte/value stable,
  migration ledger reached 19, and no draft/receipt was backfilled.
- Guarded Formalités suite: 3 files / 26 tests PASS, zero skipped (13
  repository, 7 schema, 6 domain).
- Covered constraints, all commands, mixed reconciliation, replay,
  fingerprint conflict, injected rollbacks, concurrent CREATE, SAVE/SAVE,
  SAVE/ABANDON, both CDI-to-CDD serial orders, wrong tenant/establishment and
  no-Personnel-write assertions.
- The disposable container and both synthetic databases were removed after
  evidence capture.

### Regression and repository checks

| Exact command or bounded invocation                                                                                                                                                           | Exact result                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/db-cloud db:migrate` against clean disposable DB                                                                                                                         | PASS; migrations 0000–0018                                                             |
| `pnpm --filter @yuta/db-cloud db:migrate` against prepared 0000–0017 upgrade DB                                                                                                               | PASS; only 0018 added, existing Personnel unchanged                                    |
| guarded `vitest run test/formalites-personnel-draft-domain.test.ts test/formalites-personnel-draft-schema.integration.test.ts test/formalites-personnel-draft-repository.integration.test.ts` | PASS; 3 files / 26 tests, zero skipped                                                 |
| focused Backoffice Formalités/auth/prototype/Personnel-history/navigation invocation                                                                                                          | PASS; 11 files / 136 tests                                                             |
| focused real-DB Personnel register history invocation                                                                                                                                         | PASS; 2 tests                                                                          |
| focused real-DB Personnel F07 cutover invocation                                                                                                                                              | PASS; 8 tests                                                                          |
| focused real-DB tenant-foundation invocation                                                                                                                                                  | PASS; 4 tests                                                                          |
| `pnpm --filter @yuta/tenant test`                                                                                                                                                             | PASS; 2 files / 11 tests                                                               |
| `pnpm --filter @yuta/contracts exec vitest run test/formalites.test.ts`                                                                                                                       | PASS; 1 file / 6 tests                                                                 |
| `pnpm --filter @yuta/contracts typecheck`                                                                                                                                                     | PASS                                                                                   |
| `pnpm --filter @yuta/db-cloud test`                                                                                                                                                           | PASS; 8 unit files / 42 tests; 16 DB-guarded files skipped and not counted as DB proof |
| `pnpm --filter @yuta/db-cloud typecheck`                                                                                                                                                      | PASS                                                                                   |
| `pnpm --filter @yuta/backoffice test`                                                                                                                                                         | PASS; 88 files, 1 existing guarded file skipped, 478 tests                             |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                                                                    | PASS                                                                                   |
| `pnpm --filter @yuta/backoffice build`                                                                                                                                                        | PASS; Next 16.2.9 production build and dynamic connected route                         |
| `pnpm typegen:next`                                                                                                                                                                           | PASS; 6/6 Next apps, 4/4 fresh outputs each                                            |
| `pnpm -r --if-present typecheck`                                                                                                                                                              | PASS; every applicable workspace project                                               |
| `pnpm docs:check`                                                                                                                                                                             | PASS; 36 current documents                                                             |
| `pnpm architecture:check`                                                                                                                                                                     | PASS                                                                                   |
| `pnpm exec openspec validate formalites-persistent-draft-foundation --strict`                                                                                                                 | PASS                                                                                   |
| scoped Prettier over implementation, page pack, Tasks and Gate 3 text artifacts                                                                                                               | PASS                                                                                   |
| `git diff --check`                                                                                                                                                                            | PASS                                                                                   |
| `pnpm format:check`                                                                                                                                                                           | FAIL; exactly 62 pre-existing unrelated files; no attributable path listed             |

One broader pre-existing Personnel integration test remains time-dependent: it
expected the hard-coded timestamp `2026-09-04T12:00:00.050Z` but the current
fixture generated `2026-09-05T10:38:05.176Z` in the newest-50 assertion. The
focused Personnel register, F07 cutover, tenant-scope and no-write regressions
all pass. This change neither touches nor masks that unrelated test debt.

## Browser QA

`QA: PASS`

The real authenticated local route was exercised with safe synthetic data at
1440, 1024, 768 and 390 pixels. Thirteen exact screenshots cover eligible,
editable, reconciliation, validation, stale source/draft, generic retry,
non-CDI recovery, abandonment, replay conflict, MANAGER denial and anonymous
login recovery states.

- QA report SHA-256:
  `f23db03ea8090f595eb545936c9047e0acce57a3916821ef1f77cd1c9b20895e`.
- screenshot manifest SHA-256:
  `faa661c8dc75d1f6267f53bf29115f78c02e2408246067e3059b50b2c84e9c21`.
- machine-readable browser result SHA-256:
  `b6794aa5b1273aea32d56092ad3887536052e51978f3e3bf0e6aa6f8f148126d`.

The rendered feature contains no raw operation key/hash/fingerprint, tenant or
actor IDs, address or remuneration. It has no horizontal overflow at required
widths and no serious/critical Axe issue in the feature workspace.

Two direct UI defects were found and fixed in the approved Phase 3 component:
probation cards remain readable at 1024px, and feature success text now has
sufficient contrast. No shared UI file changed; focused tests and the complete
browser matrix were rerun after the fixes.

Truthful limitation: the authorization helper preserves a 403
`CROSS_TENANT_ACCESS_DENIED` denial for MANAGER, and the browser shows a generic
permission-denied state without data leakage. The local Next development
server logs that unhandled Server Component request as HTTP 500 through the
existing shared error boundary. This change does not alter the shared
error-to-HTTP mapping and does not reinterpret it as a route-level 403.

## Scoped implementation diff

The exact full attributed change is attached as `03-implementation.diff`.

- aggregate implementation/change SHA-256:
  `73688e1e1ca8d02669bf71b07c23401e1fb344b9d1ab3280242350818aaedf9f`;
- exact size: `497444` bytes;
- exact paths/sections: `28`;
- tracked paths: `12`;
- untracked new paths: `16`;
- reverse-apply check against current bytes in the disposable evidence
  repository: PASS.

Deterministic generation method:

1. sort the exact 28-path attributable implementation/page-pack inventory;
2. create a disposable Git repository containing the exact proven pre-change
   bytes for the 12 tracked paths;
3. overlay the 28 current files byte-for-byte and mark the 16 new paths with
   intent-to-add;
4. run one sorted-path
   `git --no-pager diff --binary --unified=0 --no-ext-diff` invocation;
5. verify reverse application with
   `git apply -R --check --unidiff-zero` against the current overlay;
6. hash the exact diff bytes without BOM.

Planning artifacts, review packets, screenshots and unrelated dirty-worktree
changes are excluded from this implementation aggregate. Every one of the 28
sections maps one-to-one to the inventory in `03-integrity.json`.

### Tracked-path attribution audit

Every tracked path was compared as exact pre-change/pre-owning-phase bytes
against current bytes. `HEAD` was used only where the owning-phase evidence
proved that path was clean at that point.

| Repository path                                                                                                          | Exact pre-change SHA-256                                           | Preimage evidence                                                                     | Final SHA-256                                                      | Classification                | Attributed hunk scope                                               |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------------- |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/page.tsx`                              | `2b6df3845dc9061793132939b40200dc7b272861bb764c11f37528ee676606e9` | `phase-3-review.md` exact Pre-Apply hash; equals exact HEAD bytes                     | `f79f9cc3c86cca0dafaaa2bd79f0fb2fad9c28a7d3c7f3e8012940fa50fb8c72` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Phase 3 route-loader/action wiring delta                            |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-connected-read-prototype.tsx` | `a24be129f95e6e85fcd6ad9324f50163fe76fee2b0cb53cafd0e32f7785e6f95` | `phase-3-review.md` exact Pre-Apply hash; equals exact HEAD bytes                     | `4a7a9272d145e8f887c1a72a4dda0a43773b2713ee7721a7c268f16b21d5e406` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Phase 3 connected-workspace selection delta                         |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-connected-read-model.ts`             | `e2037a3bb38432733076231253e20ea3e3bb62ab85c30a7bae4bbb943c994bb4` | `phase-3-review.md` exact Pre-Apply hash; equals exact HEAD bytes                     | `bb2679be6919f0af8bd9a9b3a925387cd5031edfa63005a8eddaf5cdee5ddf31` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Phase 3 persistent read-model adapter delta                         |
| `docs/ui/pages/backoffice-equipe-formalites-personnel/ACCEPTANCE_CHECKLIST.md`                                           | `98de28642152b564f05614849a149e28d4cb8586b101fcb715d24e9f3236f0fb` | Phase 4 pre-Apply status omitted the path; exact HEAD bytes match                     | `8dfe06c11a3c1db078eb58d0261016c6815d8188bceb688c4fd3dc778937b1d6` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Phase 4 as-built checklist delta only                               |
| `docs/ui/pages/backoffice-equipe-formalites-personnel/DATA_AND_INTERACTION_SPEC.md`                                      | `6af07dacd06fb931d39893ab43295a0e3257c9f74eb0eed44093b8ab2923ef03` | Phase 4 pre-Apply status omitted the path; exact HEAD bytes match                     | `3952dc1ad05e8303da133e5ef3f7e2a71452eed780bcdccfe02b62c6dc52e8d1` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Phase 4 as-built data/interaction delta only                        |
| `docs/ui/pages/backoffice-equipe-formalites-personnel/PRODUCT_SCOPE.md`                                                  | `1d34906c0da8a4ec77e969e4f949bc77062600c0d703f4217a3f47e05e694ee7` | Phase 4 pre-Apply status omitted the path; exact HEAD bytes match                     | `c338d12c183bb8f813818f8a98a7df50d98bcffaeeb20db4243827e5aced4023` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Phase 4 as-built Product-scope delta only                           |
| `docs/ui/pages/backoffice-equipe-formalites-personnel/README.md`                                                         | `f2fbc3b4ad57aa27a3e16f1bae8e90186f374597dd6296b29137e45fd5d0dd1f` | Phase 4 pre-Apply status omitted the path; exact HEAD bytes match                     | `cb1391626ee478bb2ddb6ff31c5d7e38e825c89c875f9a8c835d0b42c53e3a92` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Phase 4 as-built page summary delta only                            |
| `docs/ui/pages/backoffice-equipe-formalites-personnel/UI_SPEC.md`                                                        | `edf9e4b8cce5cebed8c861198141b9d48073f398299acdba529f1c3c77ecd84b` | Phase 4 pre-Apply status omitted the path; exact HEAD bytes match                     | `abb907107354f94caa6b9de8958257c243cde4dc0b08aad54a1697eb0fa610d3` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Phase 4 as-built UI delta only                                      |
| `packages/contracts/src/index.ts`                                                                                        | `199bb5c1e86df3182fffed26c803e0e7567c91a6664ed05e119fe46ca0791072` | `phase-1-review.md` exact preimage; equals exact HEAD bytes                           | `ce44e688cea68cee2291db00a89207b5ae95086c3ef9de2df649858aa7378a44` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Add the Formalités contract export only                             |
| `packages/db-cloud/drizzle/meta/_journal.json`                                                                           | `a6e2f8c10bae551d8ac91bdf9aa85eaaea103e3a265b606d51e402da31c290f5` | `phase-1-review.md` exact preimage, already containing `0017_whole_warbound`          | `04a7ddfe1c91d0acf54eee402d6e2e762780c9a13433c25d37dcc2534ee3e765` | `PREEXISTING_DIRTY_OVERLAP`   | Append only journal entry `18` / `0018_elite_hardball`              |
| `packages/db-cloud/src/index.ts`                                                                                         | `3e69703fa7194abc660c0fde7972636900febe280938280201e2801a44a6bc0b` | `phase-2-review.md` exact preimage, already containing approved Personnel F07 exports | `4a48127a97360420e60cda9f96fd685ed6634d432308952ca07aa20440d75904` | `PREEXISTING_DIRTY_OVERLAP`   | Add only `export * from './formalites-personnel-draft-repository';` |
| `packages/db-cloud/src/schema/index.ts`                                                                                  | `f5c1c8189ab69a77fe0aee3784585e311745bb8271b242b47ad1eb448c72fb42` | `phase-1-review.md` exact preimage; equals exact HEAD bytes                           | `c701826c9712e62958acab13e1a2827951e1cb37f8080f64631d66a0d76e4359` | `CLEAN_AT_HEAD_BEFORE_CHANGE` | Add the Formalités schema export only                               |

The regenerated zero-context aggregate contains no added or removed
`personnel-history-cutover` line and no added or removed
`0017_whole_warbound` line. The two pre-existing changes remain in current
source bytes but are not attributed to this change. All five page-pack paths
were clean at the exact Phase 4 pre-Apply baseline, so their full current
delta is attributable and no earlier page-pack content was absorbed.

### Integrity-only revalidation disposition

- Gate 3 substantive implementation assessment: `PRESERVED`.
- `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS — preserved`.
- `VERIFY: PASS — preserved`.
- `QA: PASS — preserved`.
- Gate 3 attribution/integrity revalidation: `PASS`.
- Substantive tests, disposable-database evidence and Browser QA were not rerun;
  their exact source/evidence hashes remain unchanged.
- Source implementation, migration, page-pack, authority, protected boundary,
  QA and screenshot bytes remain unchanged.

## Protected-state and scope review

- Formalités authorization prerequisite: 4/4 approved hashes MATCH.
- Generic Formalités prototype, development runtime gate, navigation,
  Personnel dossier route and `@yuta/ui` export catalog: MATCH.
- Six `next-env.d.ts` files remain untracked and match their six exact
  root-anchored ignore rules; validated type generation creates no tracked
  source drift.
- Migration 0018 is the only migration attributed to this change; no old
  migration was modified.
- Page-pack updates describe only as-built local/development behavior and keep
  production deferred.
- The approved delta was synced to
  `openspec/specs/formalites/persistent-draft-foundation/spec.md`, strictly
  validated and archived. No production migration, route enablement or deploy
  occurred.

## Finish lifecycle

- Specs: `synced and validated — formalites/persistent-draft-foundation`.
- Main Spec SHA-256:
  `b4c8077df69c7da638627836255b0a64a3b9b342751964bebe6860183c1b768e`.
- Main-spec validation:
  `pnpm exec openspec validate --specs --strict` — PASS, 11 passed, 0 failed.
- Archive location:
  `openspec/changes/archive/2026-09-05-formalites-persistent-draft-foundation`.
- Archived-change validation:
  `pnpm exec openspec validate --archived --strict` — PASS, 12 passed, 0
  failed.
- Post-archive all-current validation:
  `pnpm exec openspec validate --all --strict` — PASS, 12 passed, 0 failed.
- Finish outcome: `COMPLETED`.
- Completed: `2026-09-05T14:35:22.4536670+02:00`.
- Knowledge consolidation: `COMPLETED`.
- Knowledge review:
  `docs/reviews/formalites-persistent-draft-foundation/04-knowledge-consolidation-review.md`
  — `APPROVED`.
- Proposed Knowledge diff:
  `docs/reviews/formalites-persistent-draft-foundation/04-proposed-knowledge.patch`
  — SHA-256
  `2cafb3ef49d6255d0ba94936cdbe640c95884842c2d929f214b0979717759a40`.
- Knowledge byte-integrity revalidation: `APPROVED`.
- Formatting-only correction: `APPROVED_AND_APPLIED`.
- Formatting closure: `PASS`.
- Knowledge completion: `2026-09-05T16:17:16.8808399+02:00`.
- Workflow status: `DONE`.
- `RELEASE_FOLLOW_UP: NOT_REQUIRED` for this development-only repository
  change; no production consumer or release was authorized.

## Human approval record

Gate 3 is approved by the explicit current-user instruction dated
`2026-09-05T14:27:34.3530756+02:00`. The authorized sync and archive completed
without warning or rollback. Production migration, production route enablement
and deployment remain `NOT_AUTHORIZED`.

## Final workflow disposition

- Change: `formalites-persistent-draft-foundation`.
- Final status: `DONE`.
- Gate 3: `APPROVED`.
- Sync: `COMPLETED`.
- Archive: `COMPLETED`.
- Knowledge Consolidation: `COMPLETED`.
- Knowledge Review: `APPROVED`.
- Knowledge byte-integrity revalidation: `APPROVED`.
- Formatting closure: `PASS`.
- Workflow status: `DONE`.
- `RELEASE_FOLLOW_UP: NOT_REQUIRED`.
- Production migration: `NOT_AUTHORIZED`.
- Production route enablement: `NOT_AUTHORIZED`.
- Production deployment: `NOT_AUTHORIZED`.
- Production retention / backup / PITR: `DEFERRED / NOT_AUTHORIZED`.
