# VERIFY Evidence

Change: `restaurant-knowledge-communication-identity`

Schema: `yuta-spec-driven`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES`

## Verification assessment

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

Implementation covers all `16` approved requirements and `45` scenarios.
There are no CRITICAL, WARNING or SUGGESTION findings against the approved Spec
or Design. All `29/29` implementation-plan tasks are complete, including the
separate real Browser QA and Gate 3 evidence preparation.

## Pre-Apply attribution and protected state

- Captured HEAD:
  `01e6ca74186f5cda389f5ca8c0700274b29d18d0`.
- `03-pre-apply-manifest.md` records the exact 14-path shared allowlist,
  seven missing implementation/test paths, conditional migration paths,
  evidence paths, and `148` protected existing dirty files.
- Base64 decoding reproduces all 14 shared baseline hashes with zero mismatch.
- Final protected-file recomputation after build restoration: `0` missing,
  `0` hash mismatch.
- `pnpm --filter @yuta/backoffice build` regenerated
  `apps/backoffice/next-env.d.ts`; the generated import line was restored
  immediately to the captured pre-Apply bytes and exact SHA-256
  `83a6738771334a63124c8acf38250eccd39fd0aba62846bb0815d952a7936205`.
- Proposal, Analysis, delta Spec, Design and all approved Gate packets remain
  byte-identical to the recorded hashes. `tasks.md` changed only for explicit
  Apply authorization, progress checkboxes and workflow evidence.

## Foundation / Data evidence

1. Journal recheck found terminal entry
   `0014_restaurant_knowledge_team_culture` at index `14`; SQL and snapshot
   inventories ended at `0014`; both intended `0015` files were `MISSING`.
2. `pnpm --filter @yuta/db-cloud exec drizzle-kit generate --name restaurant_knowledge_communication_identity`
   — exit `0`; generated only SQL, snapshot and journal entry `15`.
3. `pnpm --filter @yuta/db-cloud exec vitest run test/schema.test.ts` —
   exit `0`; 1 file, 12 tests passed.
4. Disposable full-chain database:
   `yuta_rk_comm_verify_20260902_1938`, created explicitly in
   `yuta-cloud-db-dev`, used only with
   `postgres://yuta_cloud:yuta_cloud@localhost:56031/<disposable-db>`, then
   dropped successfully.
5. From `packages/db-cloud`,
   `$env:CLOUD_DATABASE_URL=<guarded-disposable-url>; pnpm exec drizzle-kit migrate`
   — exit `0`; all migrations through `0015` applied successfully.
6. Live PostgreSQL inspection returned exactly five columns:
   `organization_id uuid NOT NULL`, `establishment_id uuid NOT NULL`, and
   the three approved nullable `text` columns. It returned the composite
   primary key and the composite establishment foreign key with
   `ON DELETE RESTRICT`; the migrated schema contained 46 tables.
7. `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true` plus the disposable URL:
   - repository integration — exit `0`; 1 file, 11 tests passed;
   - schema integration — exit `0`; 1 file, 3 tests passed.

Generated artifact hashes:

- SQL:
  `6ce2782ca102009597a7fb5d7cb73b60c63bc3c24a259ca72a7efc8a8af5e524`;
- snapshot:
  `b4ad465af34ff105074fe72e26260863c10cff38725562ac0242127b8c2ade8f`.

The SQL is additive: it creates only
`restaurant_knowledge_communication_identity` and adds its approved FK. It
contains no backfill, alteration of an existing table, drop, destructive
rollback, timestamp, ID, history or provenance field.

## Service / Domain evidence

The internal projection/input contains exactly:

- `toneAndCommunicationStyle`;
- `customerAddressing`;
- `languageElementsAndThingsToAvoid`.

All are `string | null`. Repository reads require an establishment context and
predicate both `organizationId` and `establishmentId`. Missing rows project
to three nulls. Save uses one insert/upsert statement with the composite
conflict target, updates all three values together and returns the canonical
projection.

The integration suite covers missing/all-null, each single-value state, full
three-value round-trip, overwrite, separate establishments, separate
organizations, wrong organization, wrong establishment and mismatched pairs.
Denied writes fail through the composite FK and do not change the valid
establishment row.

Loader tests prove READ is checked before repository access, OWNER and MANAGER
load with `canManage=true`, and STAFF receives `null` with zero Communication
Identity repository calls. The action re-derives tenant context, requires the
active establishment and MANAGE before parsing or persistence, reads only the
three approved FormData entries, strict-parses the constructed object, and
forwards only those values. Browser-supplied scope, role, Profile/Marketing
permission and unrelated entries are ignored as authority and not forwarded.

The action normalizes only exact `''` to `null`, preserves whitespace, calls
the repository exactly once, revalidates only after success, returns the
canonical saved projection, retains the previous accepted baseline on error
and logs only the error name. OWNER and MANAGER success, STAFF denial, Profile
non-substitution and an independently denied MANAGE boundary are all covered
without inventing a production role, principal, permission or grant.

## UI / Interaction evidence

The page-local model exposes exactly the three approved properties. Fields use
the exact French labels and matching names:

1. `Ton & style de communication`;
2. `Façon de s’adresser aux clients`;
3. `Éléments de langage & choses à éviter`.

Each is optional and programmatically labelled. `canManage=false` disables all
three and renders no submit. MANAGE renders exactly one whole-slice submit.
The independent card follows `Équipe & culture`; Profile, Concept/Histoire,
Cuisine/savoir-faire, Expérience client and Équipe & culture retain their own
loaders, props, actions, forms and repositories.

`canonicalCommunicationIdentityValue` maps only `''` to `null`. Dirty
comparison canonicalizes both the draft and accepted baseline, preserves
whitespace, and passes all required cases. The canonical projection returned
by a successful action becomes the accepted baseline in the mounted component,
so `'' -> null` becomes pristine without a key change or remount. The page does
not key the Communication Identity form from server values; this preserves the
mounted action success state across route revalidation.

Manual changes only update local React state. There is no `useEffect`,
`onBlur`, timer, background request, optimistic canonical write or autosave.
Pending state uses the same submit; success is `role=status`; recoverable error
is `role=alert` and retains the failed draft.

Focused command:

```text
pnpm --filter @yuta/backoffice exec vitest run test/communication-identity-action.test.ts test/communication-identity-model.test.ts test/communication-identity-fields.test.tsx test/communication-identity-form.test.tsx test/restaurant-knowledge-loader.test.ts test/restaurant-knowledge-permissions.test.ts
```

Result: exit `0`; 6 files and 43 tests passed.

After Browser QA removed the page-local remount key, the five directly affected
focused files were rerun: exit `0`; 5 files and 35 tests passed. The full
Backoffice suite and production build were also rerun successfully.

## Requirement and scenario coverage

| #   | Approved requirement                                         | Implementation and test evidence                                                         |
| --- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | Restaurant Knowledge ownership and establishment scope       | dedicated schema/repository, composite trusted scope, repository integration             |
| 2   | Exactly three descriptive values                             | exact model, schema columns, action object and fields tests                              |
| 3   | READ for view                                                | READ-first loader and OWNER/MANAGER/STAFF tests                                          |
| 4   | MANAGE for edit/save                                         | server MANAGE guard, role and independent-denial tests                                   |
| 5   | Optional and independent values                              | missing/all-null and three single-value integration cases                                |
| 6   | Manual input/edit                                            | controlled local textareas and fields/model tests                                        |
| 7   | One explicit whole-slice save                                | one form submit, one action call and one-statement repository upsert                     |
| 8   | No autosave                                                  | source scan and render/form tests                                                        |
| 9   | No Establishment Profile source/consumer                     | separate imports/repository/action and Profile non-substitution test                     |
| 10  | No Marketing/Content/social/publishing/provider relationship | added-import/runtime scans return no match                                               |
| 11  | No Reviews/Reputation relationship                           | added-import/runtime scans return no match                                               |
| 12  | No AI/learning/inference relationship                        | added-import/runtime scans return no match                                               |
| 13  | No CRM/customer-specific data                                | exact three-field shape and added-import/runtime scans                                   |
| 14  | No legal/compliance/moderation enforcement                   | plain nullable text, no validation/control/dependency                                    |
| 15  | No cross-runtime relationship                                | no POS/Site Agent/Display import, FK, API, event, job or sync                            |
| 16  | No content requirement/classification                        | nullable text, exact-empty normalization only, no trim/length/format/enum/taxonomy/score |

All 45 scenarios are covered by these implementation boundaries, focused tests,
integration cases and deterministic scans. No scenario relies on Browser QA to
prove server authorization, tenant isolation or persistence.

## Dependency and non-relationship scan

Deterministic scans over the added lines in `03-implementation.diff`:

- prohibited added imports for db-pos, POS, Site Agent, Display, Marketing,
  Reputation/Reviews, CRM/customer data, provider, Social or AI — no match
  (rg exit `1`);
- added fetch/API/provider/event/job/schedule/sync/autosave hooks — no match
  (rg exit `1`);
- added shared-contract import or API route — no match (rg exit `1`);
- migration FK targets — exactly one match, to
  `public.establishments(organization_id, id)` with `ON DELETE RESTRICT`.

No Profile-data, Marketing, Reviews, AI, Social/public publishing, provider,
CRM/customer, legal/moderation, POS, Site Agent or Display dependency was
introduced.

## Repository checks

| Command                                                                            | Exact result                                                                                                        |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/db-cloud test`                                                | exit 0; 4 files passed, 14 skipped; 16 tests passed, 52 guarded tests skipped                                       |
| `pnpm --filter @yuta/backoffice test`                                              | exit 0; 78 files passed, 1 skipped; 320 tests passed                                                                |
| `pnpm --filter @yuta/db-cloud typecheck`                                           | exit 0                                                                                                              |
| `pnpm --filter @yuta/backoffice typecheck`                                         | exit 0                                                                                                              |
| `pnpm -r --if-present typecheck`                                                   | exit 0; all 15 participating workspace projects passed                                                              |
| `pnpm --filter @yuta/backoffice build`                                             | exit 0; production build, TypeScript and route generation passed, including `/etablissement/informations-generales` |
| `pnpm docs:check`                                                                  | exit 0; 36 current documents passed                                                                                 |
| `pnpm architecture:check`                                                          | exit 0                                                                                                              |
| `pnpm exec openspec validate restaurant-knowledge-communication-identity --strict` | exit 0; valid                                                                                                       |
| scoped Prettier check over 25 supported attributable/workflow files                | exit 0; all matched                                                                                                 |
| `pnpm format:check`                                                                | exit 1 only on 63 pre-existing files outside this change; no attributable file is listed                            |

The repository has no Backoffice lint script, so no lint result is invented.
The global format baseline remains an unrelated protected-worktree condition;
it does not weaken the passing scoped formatter evidence.

## Deterministic diff evidence

`03-implementation.diff` contains exactly `20` globally sorted
`diff --git` sections: 13 shared non-migration paths compared from exact
saved baseline bytes and seven new implementation/test paths represented as
proper `/dev/null -> current` diffs.

Exact implementation inventory:

1. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-fields.tsx`
2. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx`
3. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`
4. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/communication-identity-model.ts`
5. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`
6. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`
7. `apps/backoffice/test/communication-identity-action.test.ts`
8. `apps/backoffice/test/communication-identity-fields.test.tsx`
9. `apps/backoffice/test/communication-identity-form.test.tsx`
10. `apps/backoffice/test/communication-identity-model.test.ts`
11. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`
12. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`
13. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
14. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
15. `docs/ui/pages/establishment-general-information/README.md`
16. `docs/ui/pages/establishment-general-information/UI_SPEC.md`
17. `packages/db-cloud/src/restaurant-knowledge-repository.ts`
18. `packages/db-cloud/src/schema/restaurant-knowledge.ts`
19. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`
20. `packages/db-cloud/test/schema.test.ts`

SHA-256:
`d8fb9be29b2e072768db75d37fc92b545deca9d7702677fc3099ebb51708adb4`.

`03-migration.diff` contains exactly three `diff --git` sections:

1. `packages/db-cloud/drizzle/0015_restaurant_knowledge_communication_identity.sql`
2. `packages/db-cloud/drizzle/meta/0015_snapshot.json`
3. `packages/db-cloud/drizzle/meta/_journal.json`

SQL and snapshot are full new-file diffs; journal is exact
baseline-to-current. SHA-256:
`3ae21ff7313ac21222d969e3e71345edb8e54874ca69a75e51b8d97ddfeddd15`.

Integrity checks used `git -c core.autocrlf=false -c core.eol=lf apply`:

- implementation apply-check/apply/current-byte comparison:
  `0 / 0 / 0 mismatches`;
- implementation reverse-check/reverse/baseline comparison/new-file removal:
  `0 / 0 / 0 mismatches / 0 remaining`;
- migration apply-check/apply/current-byte comparison:
  `0 / 0 / 0 mismatches`;
- migration reverse-check/reverse/journal-baseline comparison/new-file removal:
  `0 / 0 / MATCH / 0 remaining`.

## Technical Compliance Matrix

| Phase / technical rule                                                                                    | Authoritative source                                        | Affected implementation                         | Check / evidence                                                                                 | Result |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| Foundation/Data: dedicated five-column table, composite establishment PK/FK, RESTRICT, additive migration | root and db-cloud AGENTS, approved Design 1–3               | schema, 0015 SQL/snapshot/journal, schema tests | generated SQL review, schema unit, full blank-DB migration, live catalog inspection              | PASS   |
| Foundation/Data: tenant isolation and no destructive/backfill fields                                      | TENANCY, DATABASE_BOUNDARIES, Design                        | schema and repository integration               | exact column scan, wrong org/establishment/mismatched writes, 46-table full chain                | PASS   |
| Service/Domain: trusted TenantContext, READ before repository, MANAGE before parse/persist                | Backoffice AGENTS, authorization normative spec, Design 4–5 | repository, loader, action                      | OWNER/MANAGER success, STAFF denial, independent MANAGE denial, zero denied calls                | PASS   |
| Service/Domain: exact constructed input, empty-only normalization, one atomic upsert                      | Design 4–5                                                  | action and repository                           | action forwarding/whitespace tests, repository round-trip/overwrite tests                        | PASS   |
| UI/Components: page-local independent section, exact labels/order, no client auth enforcement             | frontend rules, page pack, Design 6                         | model, fields, form, page                       | fields/form tests, source composition review, Backoffice build                                   | PASS   |
| Interaction/States: canonical dirty state, saved projection baseline, one submit, no autosave             | Design 7–8                                                  | model, form, action                             | four canonical cases, mounted success baseline test, pending/success/error/retry tests and scans | PASS   |
| Integration/Regression: five page-pack files only, no Product Knowledge/Module Registry write             | approved Tasks 5.1 and page-pack protocol                   | five page-pack files                            | deterministic path inventory, docs check, protected hashes                                       | PASS   |
| Integration/Regression: no prohibited cross-module/runtime/provider relationship                          | Spec non-relationships, Design 9–10                         | full attributable implementation/migration      | added-line import/API/event/job/sync/FK scans, architecture check                                | PASS   |
| Integration/Regression: reproducible attribution and repository verification                              | YUTA workflow, Design 11–13                                 | baseline, two evidence diffs, tests/checks      | 20/20 and 3/3 counts, apply/reverse integrity, hashes, full checks                               | PASS   |

## Real Browser QA

`QA: PASS` on the authenticated real route with real persisted data.

- OWNER and MANAGER each rendered three editable labelled fields and exactly
  one Communication Identity save control.
- An existing authenticated principal without an active restaurant
  establishment failed closed and exposed neither the section nor its save
  control. Focused server tests independently prove STAFF denial.
- Populated, explicitly saved all-empty, dirty draft, successful explicit save,
  reload/persisted round-trip and no-autosave behavior passed.
- Widths 1440 x 900, 1024 x 768, 768 x 1024 and 390 x 844 passed with no
  horizontal overflow. Keyboard navigation, visible focus, exact accessible
  names, visible success `role="status"` and all six page sections passed.
- Fresh final browser logs contained no warning/error and no Next.js issue
  overlay.

Conditional READ-without-MANAGE, deliberately induced persistence failure and
a stable pending screenshot are each
`NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`; focused automated tests provide
the approved technical evidence without fabricating authorization or failures.

Browser QA report: `qa/QA_REPORT.md`. Screenshot evidence and lowercase hashes:
`qa/screenshot-manifest.md`.

## Post-VERIFY deviation and correction

The first browser save proved persistence but exposed that a server-value-
derived React key remounted the Communication Identity form after revalidation,
removing the success message before it remained observable. The page-local key
was removed; canonical dirty correctness continues to use the returned saved
projection and never depended on the key. Focused tests, Backoffice typecheck,
the full 320-test Backoffice suite, production build and real success/save/
reload browser scenarios passed after the correction. The regenerated
implementation diff and integrity checks cover the corrected current bytes.

## Lifecycle and remaining workflow

Lifecycle remains:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

Gate 3 evidence preparation does not enable an environment, deploy or assess
Production Readiness. No sync, archive, deploy, lifecycle promotion or Knowledge
Consolidation has occurred. Gate 3 review and sync authorization both remain
human decisions; sync authorization is `PENDING`.
