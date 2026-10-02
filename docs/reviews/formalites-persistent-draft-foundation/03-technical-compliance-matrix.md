# Technical Compliance Matrix — Formalités Persistent Draft Foundation

Change: `formalites-persistent-draft-foundation`

Spec authority: 22 requirements / 70 scenarios, SHA-256
`c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850`.

Design authority: D1–D16, SHA-256
`83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610`.

## Spec to implementation and evidence

|   # | Spec requirement                                                  | Design           | Implementation location                                                      | Executable evidence                                                                               | Result |
| --: | ----------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------ |
|   1 | Eligibility uses current Personnel and trusted scope              | D7, D8, D12      | draft repository; Backoffice actions                                         | real DB eligible/non-CDI and CDI-to-CDD cases; action auth suite; browser eligible/non-CDI states | PASS   |
|   2 | Formalités and Personnel authorization are independent            | D1, D12          | Backoffice actions; existing Formalités guard                                | Formalités permission/context suites and action suite; protected auth hashes                      | PASS   |
|   3 | Browser identifiers and claims create no authority                | D12, D13         | contracts; actions; full-scope repository predicates                         | action untrusted-input tests, cross-establishment DB denial, browser forbidden-rendering audit    | PASS   |
|   4 | Explicit persisted draft lifecycle                                | D3, D9, D11, D14 | schema, repository, employee-connected workspace                             | schema/repository DB suites; create/save/reopen browser flow                                      | PASS   |
|   5 | Abandonment requires reason and retains record                    | D3, D4, D9, D11  | schema lifecycle checks; abandon repository/action/workspace                 | domain/schema/repository tests; browser required-reason and read-only retained record             | PASS   |
|   6 | New draft may follow abandonment                                  | D3, D8, D11      | partial unique active index; create repository                               | real DB create-after-abandon; browser create-after-abandon                                        | PASS   |
|   7 | At most one active draft per full scope                           | D3, D8, D11      | scoped unique partial index; transactional create                            | schema constraints; concurrent CREATE real DB evidence                                            | PASS   |
|   8 | Three approved probation states                                   | D3, D4, D13, D14 | contracts, schema, workspace radio group                                     | contract/domain tests; browser UNDECIDED/INCLUDE/EXCLUDE                                          | PASS   |
|   9 | INCLUDE is preparation, not legal advice                          | D2, D14          | literal `cdi_preparation`; French workspace copy                             | component tests; browser content audit; page-pack review                                          | PASS   |
|  10 | Exact Personnel reference, anchor and source snapshot             | D3–D6, D13       | schema dual snapshots; pure domain; repository read model                    | exact-seven-facts contract/domain/schema tests; DB reopen/reconcile tests                         | PASS   |
|  11 | Reopen detects relevant Personnel divergence                      | D5, D6, D13      | domain comparison and repository projection                                  | changed-source DB tests; browser reconciliation-required state                                    | PASS   |
|  12 | Reconciliation is explicit per divergent fact                     | D5, D6, D11, D14 | typed KEEP/REFRESH choices; reconcile transaction; workspace                 | missing/extra/duplicate/mixed DB tests; browser validation/focus and mixed choice                 | PASS   |
|  13 | Reconciliation resolves the exact acknowledged source state       | D5, D6, D11      | acknowledged source snapshot/fingerprint behavior in repository              | unchanged-source no-reprompt, KEEP truth isolation, REFRESH and changed-again tests/browser paths | PASS   |
|  14 | Stale reconciliation fails visibly                                | D6, D9, D11, D13 | expected source fingerprint; safe stale outcome                              | stale-source DB/action/component tests and screenshot                                             | PASS   |
|  15 | Current eligibility is independent of reconciliation              | D5, D7, D13, D14 | current Personnel lock/revalidation in mutation transactions                 | CDI-to-CDD both serial orders; non-CDI browser recovery                                           | PASS   |
|  16 | Restored CDI eligibility does not skip reconciliation             | D5, D7, D13      | current source comparison on reload and mutation                             | repository eligibility/reconciliation cases; browser restore-to-CDI flow                          | PASS   |
|  17 | Save failure preserves authoritative saved state                  | D9–D11, D14      | atomic draft-plus-receipt transactions; recoverable client state             | injected failure rollback DB tests; browser server-error/retry                                    | PASS   |
|  18 | Concurrent/stale mutations have no silent last-write-wins         | D8–D11           | optimistic draft revision, lock order, command receipts                      | CREATE/SAVE/ABANDON races, stale editor and replay tests; two-tab browser path                    | PASS   |
|  19 | Every resource access has full tenant scope                       | D3, D8, D10, D12 | composite FKs/indexes; scoped queries and receipt key                        | schema and repository cross-org/cross-establishment tests; auth context suites                    | PASS   |
|  20 | Formalités never writes back to Personnel                         | D1, D5, D7, D11  | read-only Personnel access inside Formalités transactions                    | before/after Personnel row/history/receipt assertions in real DB suite                            | PASS   |
|  21 | Employee-connected capability extends without breaking prototypes | D14              | connected route selection; persistent workspace; preserved generic prototype | prototype/connected/navigation regressions and protected hashes; Backoffice build                 | PASS   |
|  22 | Retained draft does not promise infinite retention                | D4, D10, D15, N4 | bounded stored lifecycle/receipt data only                                   | schema inventory and exclusion audit: no expiry, cleanup job, legal hold or keep-forever field    | PASS   |

## Design decision coverage

| Design | Implemented decision                                                | Primary evidence                                                 | Result |
| ------ | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ------ |
| D1     | Formalités cloud ownership; Personnel remains source owner          | import/architecture review; no-Personnel-write DB assertions     | PASS   |
| D2     | One typed `cdi_preparation` formality                               | contract, schema and migration literal checks                    | PASS   |
| D3     | One minimum full-scope aggregate                                    | schema constraints and scoped repository tests                   | PASS   |
| D4     | Exact minimized field inventory                                     | contract/schema inventory tests and sensitive-rendering audit    | PASS   |
| D5     | Source-state acknowledgement supports KEEP/REFRESH                  | domain/repository reconciliation suite and browser flows         | PASS   |
| D6     | Reconciliation binds to presented source state                      | stale fingerprint tests and stale-source browser state           | PASS   |
| D7     | Active mutations atomically revalidate CDI                          | both CDI-to-CDD orders and non-CDI mutation rejection            | PASS   |
| D8     | Database enforces one active draft                                  | partial unique index and concurrent-create test                  | PASS   |
| D9     | Optimistic revision prevents silent overwrite                       | concurrent save/abandon and two-tab stale evidence               | PASS   |
| D10    | Receipts provide replay safety without raw key                      | replay/fingerprint/rollback tests and schema audit               | PASS   |
| D11    | Mutations and receipts are atomic                                   | injected failures for create/save/reconcile/abandon              | PASS   |
| D12    | Existing independent trusted authorization composition              | auth/context/action suites; MANAGER and anonymous browser states | PASS   |
| D13    | Only typed safe contracts cross boundaries                          | Zod/action tests and forbidden-rendering browser audit           | PASS   |
| D14    | Existing employee-connected route is extended, prototypes preserved | connected/prototype tests, protected hashes and production build | PASS   |
| D15    | Additive migration, no backfill                                     | clean and 0017-to-0018 upgrade proofs; migration review          | PASS   |
| D16    | Verification spans unit, PostgreSQL, regression and browser layers  | command evidence, this matrix and QA report                      | PASS   |

## Phase Technical Implementation Contracts

| Phase                        | Scope and invariants                                                                                 | Required evidence                                                                                     | Result |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------ |
| 1 — Foundation / Data        | additive typed contracts/schema/migration; full scope; minimized facts; no backfill                  | approved Phase 1 report, clean/upgrade DB migration, contract/domain/schema tests                     | PASS   |
| 2 — Service / Domain         | trusted scoped operations, atomic receipts, current eligibility, reconciliation and concurrency      | approved Phase 2 report, 26/26 real DB tests, auth/action and rollback matrices                       | PASS   |
| 3 — UI / Components          | one connected persistent workspace, safe typed data, recoverable French states, prototypes preserved | approved Phase 3 report, 44/44 focused and 478 full Backoffice tests                                  | PASS   |
| 4 — Integration / Regression | full DB/regression/repository checks, stable page pack, real-route QA and exact integrity packet     | 26/26 guarded DB tests, focused regressions, repository checks, QA report/screenshots and scoped diff | PASS   |

## Migration and exclusion audit

- New migration only: `packages/db-cloud/drizzle/0018_elite_hardball.sql`.
- No older migration was edited by this change.
- Clean database and an existing 0017 Personnel database both upgraded to
  0018 successfully; existing Personnel bytes and values were preserved and no
  draft was backfilled.
- No address, remuneration, PDF, template, signature, provider, Documents,
  Personnel write-back, cleanup scheduler, expiry, legal-hold authority,
  keep-forever field or production configuration was introduced.
- Rollback remains preserve-data plus stop writers/roll forward; no automatic
  destructive rollback is planned.

## Independent outcomes

`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`

`VERIFY: PASS`

`QA: PASS`

The repository-wide formatting command remains truthfully failing for exactly
62 unrelated pre-existing files; all attributable scoped formatting passes.
