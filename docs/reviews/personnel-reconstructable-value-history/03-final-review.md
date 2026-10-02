# Gate 3 — Final Review

Change: `personnel-reconstructable-value-history`

Gate: `3 — Final Review`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-03T17:58:44.6817957+02:00`

Approved review packet SHA-256:
`99d3efebd2a6572a1bc5afcf2d89eb673b3098985857edf6a7c34e8f437336e3`

Created: `2026-09-03T17:46:15.1238323+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `YES — Personnel historical data, privacy, retention,
migration/cutover and tenant-scoped sensitive storage`

Sync authorization: AUTHORIZED_BY_CURRENT_USER

Finish outcome: COMPLETED

Specs: synced and strictly validated
`personnel/reconstructable-value-history`

Archive location:
`openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history`

Completed: `2026-09-03T18:04:17.0712860+02:00`

Knowledge consolidation: UPDATE_REQUIRED

Knowledge review:
`docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md`
— `APPROVED`; exact diff applied; authorized formatting recovery validated

Workflow status: DONE

RELEASE_FOLLOW_UP: REQUIRED

Production release: `NOT AUTHORIZED`

## Regeneration boundary

This packet replaces the earlier substantively valid Gate 3 packet only to
conform to the current `$yuta-run-change` evidence format. Application code,
schema, migration, tests, QA evidence, Proposal, Analysis, delta Spec, Design
and Tasks remain byte-identical. No Apply phase was rerun.

No main spec was synced, no change was archived, and no production migration,
cutover, deployment, cleanup/anonymization or F07 enablement occurred.

## Gate result

- `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`
- `VERIFY: PASS`
- `QA: PASS`
- `UI_AFFECTING: YES`
- `BROWSER_QA_REQUIRED: YES`
- completed Tasks: `25/25`
- completed Technical Implementation Contracts: `5/5`
- remaining approved-scope conflict: `NONE`
- blocked required evidence: `NONE`

The required ready-state conjunction is satisfied. This packet requests a new
bounded human Gate 3 decision; it does not reuse the earlier approval or sync
authorization.

## Approved Gate and planning integrity

Hash command: `Get-FileHash -Algorithm SHA256 -LiteralPath <path>` with the
hexadecimal output normalized to lowercase.

| Repository-relative path                                                                                         | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/personnel-reconstructable-value-history/01-analysis-review.md`                                     | `160e328f6c2683c5378e1cdcff01d8fb2a858065cb60b771e698dd8b964517a1` |
| `docs/reviews/personnel-reconstructable-value-history/02-specs-review.md`                                        | `844ca91a33c0403d38be7b2974a6363285053593d0c13efa74660c14c7ad6f4b` |
| `docs/reviews/personnel-reconstructable-value-history/02b-design-review.md`                                      | `7453950547cf9374a4c4e136b10ed92c219d2041c54ca0cca90bde05b53b7d4a` |
| `openspec/changes/personnel-reconstructable-value-history/analysis.md`                                           | `09d50e50cb9a37af7df402025319078ddff446c146c67284f56278131dd25445` |
| `openspec/changes/personnel-reconstructable-value-history/design.md`                                             | `d931e22022dc4a047a78d1fb276a60cb2b232797ebb78a68c11a5eb0e703cfd6` |
| `openspec/changes/personnel-reconstructable-value-history/proposal.md`                                           | `9aa477361db22e88bfd6ceefd22b4a7975c1792daee3013da849116244fc913c` |
| `openspec/changes/personnel-reconstructable-value-history/specs/personnel/reconstructable-value-history/spec.md` | `0841018f7318820ab52bae6685d58ee4227b207d0ce1520f3eb2dcd3aca7f496` |
| `openspec/changes/personnel-reconstructable-value-history/tasks.md`                                              | `64a432441091321be49d72b964c078d94b3f0726fedc0ad3a67b5f2d6ba387a6` |

All path sets and hashes from Gate 1, Gate 2 and the Sensitive Design Gate were
recomputed and match. Proposal, Analysis, delta Spec and Design hashes are
unchanged. Tasks still contain exactly 25 checked and zero unchecked items.

Provenance HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

## Design and implementation summary

- Six allowlisted Personnel semantic groups retain immutable, strictly
  versioned previous/new snapshots.
- The server derives changed groups and validates classification, effective
  date and correction reason independently per changed group.
- Authoritative dossier mutation, all required F07 evidence, compatibility
  audit and command receipt remain one atomic transaction with existing
  revision and idempotency behavior.
- The eager cutover records exactly one neutral current-at-cutover baseline per
  applicable existing dossier and does not create fake history for later
  dossiers.
- The existing OWNER-only Historique merges legacy, F07 and cutover evidence,
  deduplicates compatibility events and preserves the newest-50 boundary.
- The five-year post-departure rule is represented only as retention
  eligibility; no cleanup executor or legal-hold authority was added.

No Documents, Registre, Formalités, Planning, Pointage, AI/OCR,
authentication/consultation-history, shared UI primitive, permission map or
cross-runtime behavior was changed.

## Requirements, scenarios and Technical Compliance

The approved delta Spec contains 16 requirements and 49 scenarios. Their exact
requirement/scenario-to-implementation-and-test mapping and the phase Technical
Implementation Contract matrix are in the unchanged canonical source:

`docs/reviews/personnel-reconstructable-value-history/03-verify-evidence.md`

Canonical VERIFY evidence and Technical Compliance Matrix source SHA-256:
`0fa41ad20593c1a639599cb0a0efd2c78020e6ee27feb8f1649870b73ada2874`.

That hash covers the exact file bytes containing the assessment source, exact
commands/results, 16-row Technical Compliance Matrix, five-row phase-contract
matrix, disposable-database evidence, scoped migration review and attributable
file manifest. The source remains unchanged and is incorporated into this
packet by exact path and hash rather than being rewritten.

## Scoped implementation diff

The exact full scoped implementation diff is attached as
[`03-implementation.diff`](03-implementation.diff).

- aggregate implementation/change SHA-256:
  `a3fea5c48c56945043551572c3db082f5683a9f2ab18647ca1c813cbf7f17a88`;
- exact size: `487393` bytes;
- exact `diff --git` sections: `30`;
- scope composition: `17` tracked paths and `13` untracked paths;
- scoped stat: `30 files changed, 13985 insertions(+), 263 deletions(-)`;
- reverse apply check against current bytes: `PASS` (exit `0`).

Deterministic generation method:

1. obtain the exact 30-path scope from the unchanged sorted attributable-file
   manifest in `03-verify-evidence.md`;
2. sort those repository-relative paths ordinally;
3. generate tracked sections with
   `git --no-pager diff --binary HEAD -- <explicit tracked paths>`;
4. append each untracked section in sorted scope with
   `git --no-pager diff --no-index --binary -- /dev/null <explicit path>`;
5. concatenate the exact standard output in that order and write UTF-8 without
   BOM to `03-implementation.diff`;
6. hash the exact resulting file bytes with SHA-256.

The resulting 30 sections correspond one-to-one with the unchanged 30-file
manifest. Recomputed current file hashes report `30/30 MATCH`; implementation
scope is unchanged. Planning artifacts, review packets, QA evidence and
unrelated Workflow v3 documentation work are excluded from the implementation
diff.

### Sorted changed-file inventory

1. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-edit-dialog.tsx`
2. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-history-metadata-fields.tsx`
3. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-history.tsx`
4. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/salaries-page.tsx`
5. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow.test.ts`
6. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow.ts`
7. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-action-errors.ts`
8. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-presentation.ts`
9. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-refresh.test.ts`
10. `apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-refresh.ts`
11. `apps/backoffice/src/app/(authenticated)/equipe/salaries/actions.ts`
12. `apps/backoffice/test/personnel-history-action.test.ts`
13. `apps/backoffice/test/personnel-reconstructable-history-ui.test.tsx`
14. `docs/features/personnel/README.md`
15. `docs/ui/pages/backoffice-equipe-salaries/README.md`
16. `packages/contracts/src/personnel/index.ts`
17. `packages/contracts/test/personnel.test.ts`
18. `packages/db-cloud/drizzle/0017_whole_warbound.sql`
19. `packages/db-cloud/drizzle/meta/0017_snapshot.json`
20. `packages/db-cloud/drizzle/meta/_journal.json`
21. `packages/db-cloud/src/index.ts`
22. `packages/db-cloud/src/personnel-history-cutover.ts`
23. `packages/db-cloud/src/personnel-history-domain.ts`
24. `packages/db-cloud/src/personnel-repository.ts`
25. `packages/db-cloud/src/schema/personnel.ts`
26. `packages/db-cloud/test/personnel-history-cutover.integration.test.ts`
27. `packages/db-cloud/test/personnel-history-cutover.test.ts`
28. `packages/db-cloud/test/personnel-history-domain.test.ts`
29. `packages/db-cloud/test/personnel-repository.integration.test.ts`
30. `packages/db-cloud/test/schema.test.ts`

## TECHNICAL VERIFY

`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`

`VERIFY: PASS`

The unchanged canonical VERIFY source records:

- guarded focused Personnel database coverage: `29/29 PASS`;
- full db-cloud coverage: `101 PASS`, two unrelated gated booking tests
  skipped;
- contracts: `38/38 PASS`;
- Backoffice: `377 PASS`, one existing gated file skipped;
- contracts, db-cloud, Backoffice and recursive workspace typechecks: `PASS`;
- Backoffice production build: `PASS`;
- documentation, architecture, page-pack and strict OpenSpec checks: `PASS`;
- all F07-attributable formatting: `PASS`;
- repository-wide format baseline: exit `1` for 69 pre-existing out-of-scope
  files, with no F07-attributable path listed.

The full disposable-database evidence covers atomic success and rollback,
multi-group all-or-nothing behavior, revision/idempotency conflicts, tenant and
authorization denial, departure compatibility, unified history and all nine
approved cutover cases. No required technical evidence is blocked.

## QA

`QA: PASS`

| Evidence path                                                                                                    | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/personnel-reconstructable-value-history/qa/QA_REPORT.md`                                           | `e026c0fa10f6df9b5aaaac4cf8824d7925d703d6c7ab05e66fa9d9f99dc81ec1` |
| `docs/reviews/personnel-reconstructable-value-history/qa/screenshot-manifest.md`                                 | `53ad4eade6c4e2c9789ca1e08e8ba23c0e37c38682de56eab1301a02bd98e4fa` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-dirty-close-1440x1000.png`                          | `c6cdd9fe32bed87cf68e14fb57ab49a355a1e1ef6e393a215a1cc725dbc46a9b` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-error-retry-1440x1000.png`                  | `03c2b863a510a4ff422d302ac68eb246c953ac30ad4e4636d295adfbeb8ba89b` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-loading-1440x1000.png`                      | `2d07386feb9355308aa789db744ef8f0bc96eca8d8cd1fca296231a821389ea2` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-mixed-baseline-1440x1000.png`               | `0e8e8afee497b660285380df957fe9f62df8085ed53d3735bc9b0b8ee7fb27c4` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-newest-50-1440x1000.png`                    | `4a4cff3fd9d67262f5b2dfac15d8aaaccc931b56977a818bbec375fff5dcb2e6` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-1024x768.png`                    | `dedcdd1155cef56646eaeb661759c14a0355168590439d2265a044405757e8c3` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-390x844.png`                     | `3c327014ef4a5e0036baf60e8100d6058ad5aaa9a7304a552ee77de3ff7bedfe` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-768x1024.png`                    | `d3fa5675fee43b758ef2b455c14ed2ac7e7a9b997ca7259977af04c4cbfd1fbf` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-per-group-validation-future-boundary-1440x1000.png` | `75bd45e88cfe618212a0dae6c4872b794cb27cef5480aa2137e1b4995cfc6050` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-stale-revision-recovery-1440x1000.png`              | `aff4c745524f97d4a70e660389e426d3924ed38d1b644d411aa9ecaf2d6df97d` |

Real-route Browser QA used authenticated OWNER access and safe disposable data
at 1440, 1024, 768 and 390 widths. It covers single/multi-group success,
per-group and future-date validation, stale conflict/recovery, error/retry,
cutover baseline, mixed history, newest-50, loading, dirty-close, keyboard and
focus behavior, both dossier surfaces and responsive overflow. No raw internal
data or prohibited history/future-state control was visible. No unresolved
visual or accessibility issue remains.

## Deviations and unresolved issues

- approved Product/Design deviation: `NONE`;
- required technical evidence blocked: `NONE`;
- required Browser QA blocked: `NONE`;
- implementation-scope drift since the substantive review: `NONE`;
- unrelated repository-wide formatter debt remains visible and untouched;
- production release, migration/cutover, enablement, cleanup and readiness
  remain outside this Gate 3 authorization.

## Sync, validation and archive result

- delta selection came only from
  `artifactPaths.specs.existingOutputPaths` and contained one capability;
- pre-sync target
  `openspec/specs/personnel/reconstructable-value-history/spec.md` was absent;
- the main spec was created with the approved Purpose and all 16 requirements
  under canonical `## Requirements`;
- normalized main-spec-to-delta comparison: `MATCH`;
- main-spec SHA-256:
  `67c9dff9f78d80f8a9669763e718229df931e8d8f5395fc9284c6aac964abb63`;
- `openspec validate --specs --strict`: `PASS — 9 passed, 0 failed`;
- the other eight pre-existing main specs retained their exact pre-sync
  hashes;
- the active change was moved synchronously to the archive location recorded
  above with `.openspec.yaml`, Proposal, Analysis, delta Spec, Design and
  completed Tasks intact;
- rollback activity: `NONE`;
- lifecycle promotion: `NONE`.

## Previous knowledge-validation stop (resolved below)

Knowledge Consolidation is `UPDATE_REQUIRED`. The current user approved the
exact five-target, 15-replacement proposal, and it was applied without scope
expansion. Recorded at `2026-09-03T20:36:31.9714726+02:00`: pre-apply hashes
matched; reverse-replacement verification reproduced all five approved hashes.
Applied paths, post-apply hashes and exact validation results are recorded in
the Knowledge Review packet above.

`pnpm docs:check` and `pnpm architecture:check` passed (exit `0`). The targeted
Prettier check recorded in that packet failed (exit `1`) for
`docs/MODULE_REGISTRY.md` only. Exact approved bytes are preserved; no additional
formatting write was authorized or performed. Workflow closure is blocked
pending bounded formatting-only authorization for that file and revalidation;
`Workflow status: AWAITING_KNOWLEDGE_REVIEW` is not `DONE`.

Gate 3 approval and all prior implementation, sync, validation and archive
evidence remain unchanged. This resume did not edit main specs, reopen the
archive, repeat sync/archive, modify application code or promote lifecycle.

`RELEASE_FOLLOW_UP: REQUIRED` for the cloud Backoffice / `packages/db-cloud`
production environment. A separately authorized release must establish
production-readiness evidence for migration `0017`, controlled F07 cutover,
privacy/retention, backup/PITR and recovery, then perform post-deploy tenant,
authorization, atomicity, history and cutover verification. This finish
workflow did not deploy, migrate, cut over, enable F07, or enable cleanup.

## Knowledge Consolidation completion

Completed: `2026-09-03T20:44:23.5186875+02:00`.

Knowledge review: `APPROVED`; Knowledge validation: `PASS`.

Workflow status: `DONE`.

The current user authorized a formatting-only recovery for
`docs/MODULE_REGISTRY.md`. Prettier changed only padding/separator widths in
16 table lines. Every table cell is unchanged; all non-table lines are
byte-identical. All 15 approved knowledge replacements remain semantically
intact. No other canonical knowledge file was written during recovery.

Final registry SHA-256:
`2e69ac6e8b76008bf729ddcf152680ba9a8f12acd5a70c00084ceeb58f9c114c`.
The Knowledge Review records the exact formatting diff, five applied paths,
original/post-apply hashes, final hash and command results.

The targeted five-file Prettier check, `pnpm docs:check` (36 current documents)
and `pnpm architecture:check` all passed. No additional application or
active-finalization checks were required for this documentation-only recovery.

Gate 3 remains approved. Main spec remains normative and untouched; archive
remains closed and untouched. No sync/archive, production migration/cutover,
deploy, F07 enablement, cleanup/anonymization or lifecycle promotion occurred.
`RELEASE_FOLLOW_UP: REQUIRED` retains the separately authorized production
readiness and post-deploy verification requirements above.
