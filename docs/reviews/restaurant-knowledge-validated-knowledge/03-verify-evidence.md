# VERIFY Evidence

Change: `restaurant-knowledge-validated-knowledge`

Technical VERIFY: `PASS`

Browser QA: `PASS`

Gate 3 readiness: `YES`

## Deterministic attribution

The evidence was generated from the saved pre-Apply byte copies, not from an
unscoped HEAD diff.

- `03-implementation.diff`: 18 declared paths, 18 actual `diff --git`
  sections, SHA-256
  `34f6a657202216d3e8e5bfcc20167b64dfe8581604f7c3d37b095bbe76b0840a`.
- `03-migration.diff`: 3 declared paths, 3 actual `diff --git` sections,
  SHA-256
  `f0e58c0d65c20a79f11b059bbe9038528002ab1a4ec01547654570a20f34ab4e`.
- All seven attributable new files are represented as `/dev/null -> current`:
  five implementation/test files in the implementation diff and SQL plus
  snapshot in the migration diff.
- Implementation forward check/apply/current-byte comparison: `PASS`.
- Implementation reverse check/apply/baseline-byte comparison: `PASS`.
- Migration forward check/apply/current-byte comparison: `PASS`.
- Migration reverse check/apply/baseline-byte comparison: `PASS`.
- Protected unrelated files match their pre-Apply hashes: `PASS (2/2)`.
- Product Knowledge, Module Registry and feature authority targets changed by
  Apply: `NONE`.

Exact sorted implementation path inventory:

1. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/validated-knowledge-section.tsx`
2. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`
3. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`
4. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`
5. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/validated-knowledge-model.ts`
6. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`
7. `apps/backoffice/test/validated-knowledge-action.test.ts`
8. `apps/backoffice/test/validated-knowledge-model.test.ts`
9. `apps/backoffice/test/validated-knowledge-section.test.tsx`
10. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`
11. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
12. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
13. `docs/ui/pages/establishment-general-information/README.md`
14. `docs/ui/pages/establishment-general-information/UI_SPEC.md`
15. `packages/db-cloud/src/restaurant-knowledge-repository.ts`
16. `packages/db-cloud/src/schema/restaurant-knowledge.ts`
17. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`
18. `packages/db-cloud/test/schema.test.ts`

Exact sorted migration path inventory:

1. `packages/db-cloud/drizzle/0016_restaurant_knowledge_validated_items.sql`
2. `packages/db-cloud/drizzle/meta/0016_snapshot.json`
3. `packages/db-cloud/drizzle/meta/_journal.json`

## Requirement and scenario traceability

| Requirement                                                             | Approved scenarios                                                                                                                                                                        | Implementation and verification evidence                                                                                                           |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Item has Restaurant Knowledge ownership and independent semantics       | eligible item; canonical information owned elsewhere; no automated semantic validation                                                                                                    | Dedicated schema/repository and route-local UI; schema and repository integration tests; no cross-module lookup or classifier.                     |
| Validated means manual acceptance by an authorized person               | manual acceptance creates validated meaning; no YUTA certification implication                                                                                                            | Explicit create action and item-local save UI; action and component tests; page-pack copy preserves the approved meaning.                          |
| Establishment scope and trusted tenancy                                 | access in trusted establishment scope; browser input grants no authority                                                                                                                  | Trusted `TenantContext` loader/action boundaries and composite repository predicates; cross-tenant integration and action tests.                   |
| READ and MANAGE are independent operations                              | READ view/list; OWNER and MANAGER manage; STAFF denied; READ does not replace MANAGE; Profile permission does not substitute                                                              | READ before repository and MANAGE before parsing/persistence; loader/action tests cover denial and zero repository calls; no grant-matrix changes. |
| Current active list supports no-item state                              | valid no-item state; list current active items                                                                                                                                            | Empty/list UI and repository tests cover zero, one and multiple deterministic rows.                                                                |
| Saved statement contains non-whitespace content                         | exact empty create rejected; whitespace-only create rejected; blank edit rejected; prior canonical preserved; surrounding whitespace preserved; blank does not remove; server enforcement | Server action schema and focused action/model/component tests cover every listed case; repository mutation is not called on rejection.             |
| Manual create becomes canonical only after explicit save                | pending create; successful create save                                                                                                                                                    | Local draft model/component and create action; focused tests verify no pre-save mutation and server UUIDv7 creation.                               |
| Manual edit changes canonical value only after explicit save            | pending edit; successful edit save                                                                                                                                                        | Item-scoped edit state/action and tests; update returns no stale-row recreation.                                                                   |
| Remove takes effect only after explicit save                            | pending removal; saved removal leaves active list                                                                                                                                         | Pending remove/undo UI and physical delete action/repository; component and integration tests.                                                     |
| Explicit save is the only persistence boundary                          | no autosave; failed save remains non-canonical                                                                                                                                            | Event-bound server actions only; model/component/action tests cover recovery and no implicit persistence.                                          |
| Multiple independent items without semantic duplicate enforcement       | multiple independent items; no runtime anti-duplication                                                                                                                                   | Composite item identity, deterministic list and independent mutation tests; no unique statement constraint or duplicate check.                     |
| V1 is manual-only without provenance workflow                           | no candidate/AI flow; future origin grants no validated authority                                                                                                                         | Exact four-column table and source scans; no provenance, history, AI, provider or inference dependency.                                            |
| Capability is independent from excluded modules, runtimes and consumers | no canonical read/write in other modules; no downstream consumer/publishing; no local-runtime dependency                                                                                  | Architecture check and implementation diff review; Backoffice plus db-cloud only, with page-pack documentation and no consumer hook.               |

All 13 requirements and all 36 scenarios are represented above.

## Technical Implementation Contract matrix

| Contract                 | Result | Evidence                                                                                                                                                                                                                     |
| ------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation / Data        | `PASS` | Exact additive four-column table, composite PK/FK with `ON DELETE RESTRICT`, migration `0016`, blank-to-current migration and schema inspection.                                                                             |
| Service / Domain         | `PASS` | Trusted scoped repository, UUIDv7 create, item-scoped update/remove, authorization ordering, tenant/stale/concurrency tests.                                                                                                 |
| UI / Components          | `PASS` | Page-local section after five slices, independent drafts, read-only/manage presentation tests, no shared contract.                                                                                                           |
| Interaction / States     | `PASS` | Pending create/edit/remove, undo, item-local pending and failure recovery; exact non-blank and whitespace-preservation tests.                                                                                                |
| Integration / Regression | `PASS` | Technical suites and page-pack checks pass; repository-supported migration restored the actual local QA database, then mandatory OWNER, MANAGER and truthful no-access real-browser coverage passed with hashed screenshots. |

Matrix rows: `5/5`.

## Commands and results

- Focused Backoffice loader/action/model/component suites: `PASS`, 4 files,
  39 tests.
- db-cloud schema unit suite: `PASS`, 13 tests.
- Disposable PostgreSQL full migration chain plus guarded repository suites:
  `PASS`, 2 files, 17 tests; exact four NOT NULL columns and only approved
  PK/FK constraints observed. The disposable container was removed.
- Full Backoffice suite: `PASS`, 81 files passed, 1 skipped, 344 tests passed.
- Normal db-cloud suite: `PASS`, 4 files passed, 14 guarded files skipped,
  17 tests passed, 55 skipped; guarded integrations were run separately above.
- `pnpm test:cloud`: `PASS`.
- `pnpm docs:check`: `PASS`.
- `pnpm architecture:check`: `PASS` after removing a prohibited client import
  discovered during implementation.
- `pnpm -r --if-present typecheck`: `PASS`.
- Backoffice production build: `PASS`.
- Scoped Prettier check: `PASS`.
- `pnpm exec openspec validate restaurant-knowledge-validated-knowledge --strict`:
  `PASS`.
- Actual Backoffice QA database migration through `0016`: `PASS`; exact four
  columns and approved PK/FK verified directly.
- Post-QA focused Backoffice regression: `PASS`, 4 files, 39 tests.
- Real Browser QA: `PASS`; OWNER and MANAGER persisted scenarios, actual
  no-membership principal denial, widths `1440`, `1024`, `768`, `390`,
  keyboard/focus/accessibility/overflow and page regression evidence are in
  `qa/QA_REPORT.md` and `qa/screenshot-manifest.md`.

## Lifecycle and review state

- Product Decision: `APPROVED`.
- Implementation: current repository-authoritative state.
- Environment: `NOT_ENABLED`.
- Production Readiness: `NOT_ASSESSED`.
- External Dependency: `NOT_ASSESSED`.
- `CONFLICT`: `NONE`.
- `NEEDS REVIEW`: `NONE`.
- Sync/archive/deploy/Knowledge Consolidation: not performed.
- Gate 3 packet may be created after final artifact/hash recomputation.
