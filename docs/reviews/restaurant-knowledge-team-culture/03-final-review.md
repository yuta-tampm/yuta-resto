# Gate 3 — Final Review

Change: `restaurant-knowledge-team-culture`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-02T15:31:44.4350874+02:00`

Approved review packet SHA-256:
`02fc61e3367458d25aef758eca4e9b262b53f9866139f03119840cf54b1fedad`

Sync authorization: `AUTHORIZED_BY_CURRENT_USER`

Finish outcome: `COMPLETED`

Workflow status: `DONE`

## Pre-sync snapshot

- captured before the first normative-spec write
- HEAD: `01e6ca74186f5cda389f5ca8c0700274b29d18d0`
- sorted `git status --short` entry count: `69`
- sorted status snapshot SHA-256 (UTF-8, LF):
  `5645c95a861512c15bff1913c39febd90a314ab821ce344d05320592fdc3592a`
- intended normative target:
  `openspec/specs/restaurant-knowledge/team-culture/spec.md`
- target state before sync: `MISSING`

## Gate result

- `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`
- `VERIFY: PASS`
- `QA: PASS`
- attribution and protected-file verification: `PASS`
- remaining `CONFLICT`: `NONE`
- remaining `NEEDS REVIEW`: `NONE`

The current user approved Gate 3 and explicitly authorized spec sync and
archive. The finish workflow synced and strictly validated the approved delta,
then archived the completed change. It did not commit, push, deploy, enable an
environment, assess production readiness or apply Product Knowledge changes.

## Sync and archive outcome

- Gate 3: `APPROVED`
- sync authorization: `AUTHORIZED_BY_CURRENT_USER`
- synced capability: `restaurant-knowledge/team-culture`
- normative spec:
  `openspec/specs/restaurant-knowledge/team-culture/spec.md`
- normative spec SHA-256:
  `e4af63e50baed2262a18868fd8072ea050d494ce168cc1d0860322651f4d3166`
- normative comparison: exact delta content with only the required
  `## ADDED Requirements` to `## Requirements` structural conversion;
  14 requirements and 38 scenarios preserved
- strict main-spec validation:
  `pnpm exec openspec validate --specs --strict` — `6 passed, 0 failed`
- archive:
  `openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture`
- active change path absent after archive: `PASS`
- archived metadata, proposal, analysis, delta spec, design and completed tasks
  retained: `PASS`
- completed: `2026-09-02T15:38:54.6106100+02:00`

## Post-archive Knowledge Consolidation scan

- classification: `UPDATE_REQUIRED`
- review packet:
  `docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md`
- review packet SHA-256:
  `c2ec96123ca08b5e78c682e2fe5d0f87a13a1f543c3cff390c0399a7e4cea1f3`
- review status: `APPROVED`
- apply status: `COMPLETED`
- approved payload SHA-256:
  `3b4f08c1c8b05793e42ff53b2b2e2381f7f938de26abe25e34ee21e1e91e1fc9`
- approved replacements applied: `23/23` across the exact four reviewed
  targets
- `pnpm docs:check`: `PASS`
- `pnpm architecture:check`: `PASS`
- unrelated dirty-file manifest: unchanged (`PASS`)
- canonical Product Knowledge / Module Registry changes applied: `YES`, only
  through the separately approved exact Knowledge Consolidation payload
- completed: `2026-09-02T16:35:55.5626062+02:00`
- release follow-up: `NOT_REQUIRED`; no deployment or environment action is
  authorized by this finish

## Planning and task hashes

| Artifact                      | SHA-256                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `proposal.md`                 | `1538e96384b77c3cbc37a119dff4251b797744ab338175bb4d5e1c8cc8dc83d0` |
| `analysis.md`                 | `7c0372d810a33b6828ad1014976d0685b35e112de6af8fedd7fdf016cf92ec95` |
| delta `spec.md`               | `0e7aa521a264b03cde23eefab5034d2b69019537809dd5a34f9b2b584d5b4d44` |
| `design.md`                   | `fe99db86abcbafa624da5a7c2a272f31d1f5a85b38ccd125202afff3a872d76d` |
| approved pre-Apply `tasks.md` | `6206c8ab42b7d60d5ae4a2ffa1c21ae7826f071be3b177ec6e6ccebe6229de05` |
| current completed `tasks.md`  | `363cfb9bcb9521c77d9b51b018df7d2cbc85e11e8c53d7d70d1ab9351942f200` |

Gate 1, Gate 2 and Sensitive Design Gate packet hashes remain respectively
`9bbe1d2fd1bfb4dbb12fce77d2fec893e70a4831898b95bb6a535f3ec8869994`,
`b1e0c9aa253e9c2e3fa0c4ee66758ee7d2f04dae1b6edf8ce6a5e7ba3c0b0496`
and `9b39cb0ed1f4b0d7c6b7be32e17555c0d270b9383a8041077f8532141edbfbfd`.

## Technical evidence and scoped diffs

- Technical Compliance Matrix source:
  `docs/reviews/restaurant-knowledge-team-culture/03-verify-evidence.md`;
  SHA-256 `faf5757f1367a62b94bdd14533a9bf43a5d87ab670e173f9d1cb62f73114390d`.
- Implementation diff: exactly 20 attributable non-migration paths and 20
  `diff --git` sections, including seven proper new-file diffs; SHA-256
  `bbf72495533f176e0f2454ce2de2e581882b053f9427d4431a31ffa53319766b`.
- Migration diff: exactly three paths and three `diff --git` sections: SQL and
  snapshot as new-file diffs plus the baseline-to-current journal diff;
  SHA-256 `55e752347d9b1eb0aa2bb0fd46f6e68a0240164a5f3b274e218f66491e36122f`.
- The exact inventories are enumerated in `03-verify-evidence.md`. Both diffs
  were regenerated from saved pre-Apply bytes plus attributable new files,
  pass apply-checks against reconstructed baseline trees, and pass reverse
  checks against current bytes.
- Exact HEAD remains `01e6ca74186f5cda389f5ca8c0700274b29d18d0`.
- All 14 saved shared-file baselines reproduce their hashes; all 98 protected
  existing files reproduce their hashes after generated `next-env.d.ts` was
  attributed to the QA/build server and restored to SHA-256
  `83a6738771334a63124c8acf38250eccd39fd0aba62846bb0815d952a7936205`.

## Requirement-to-code and test mapping

| Approved requirement group                                                                 | Implementation                                           | Evidence                                                                            |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Restaurant Knowledge ownership and establishment scope                                     | dedicated schema, migration and tenant-scoped repository | schema 11/11, live PK/FK inspection, repository 9/9                                 |
| Exactly three optional values and valid all-empty state                                    | Team Culture model, fields, projection and atomic upsert | model/form tests plus real all-empty and populated QA                               |
| READ view; MANAGE edit/save; OWNER/MANAGER; STAFF default denial; Profile non-substitution | loader and server action permission guards               | focused authorization/loader/action suite 40/40 and real OWNER/MANAGER/no-access QA |
| Manual entry, one whole-slice save and no autosave                                         | page-local form/action                                   | focused interaction tests and explicit-save/reload browser round-trip               |
| Canonical dirty semantics                                                                  | `canonicalTeamCultureValue` and `isTeamCultureDirty`     | focused canonical-equivalence tests and real pristine/dirty states                  |
| Personnel, Planning, Pointage, Today, Tâches, Formalités and onboarding exclusions         | no imports, events, links or persistence relationships   | attributable-diff scans and Technical Compliance Matrix                             |
| POS, Site Agent, Display, Marketing/social and provider exclusions                         | cloud-only page-local implementation                     | architecture check, attributable-diff and migration scans                           |
| No required content, taxonomy, score, analytics, AI/inference or shared contract           | exact local three-value model and boundary parser        | schema/model/action tests and source scans                                          |

All 14 delta requirements and 38 scenarios are covered by the detailed matrix
and named technical/browser evidence.

## Browser QA evidence

- QA report:
  `docs/reviews/restaurant-knowledge-team-culture/qa/QA_REPORT.md`;
  SHA-256 `e2ec61852dcea0edfdc4632d3ae85cbf12a328828be479590aceb31b9ddbbb9f`.
- Screenshot manifest:
  `docs/reviews/restaurant-knowledge-team-culture/qa/screenshot-manifest.md`;
  SHA-256 `80d9222516322e84d5a73e97a719a5d0af762c03f297e41163a8f8bc42d582ce`.
- Eight real screenshots cover OWNER, MANAGER, an existing authenticated
  no-access principal, populated/all-empty/dirty/save/reload states and the four
  mandatory responsive widths.
- READ-without-MANAGE, induced persistence failure/recovery and a stable pending
  screenshot are each recorded as
  `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` with focused automated evidence.

## Post-VERIFY deviations and fixes

Browser QA identified duplicate React keys among preceding Restaurant Knowledge
forms. The shared page now namespaces those three existing keys. The Team
Culture form also preserves canonical dirty correctness without depending on a
server-derived remount key and exposes success/error messages through
`role="status"`/`role="alert"`. Focused tests increased from 38 to 40, the full
Backoffice regression increased from 295 to 297, all technical checks were
rerun, and fresh captures contain no Next.js issue badge.

## Lifecycle preservation

- Product Decision: `APPROVED`
- Implementation: unchanged from current repository authority; no lifecycle
  promotion is made by this packet
- Environment: `NOT_ENABLED`
- Production Readiness: `NOT_ASSESSED`
- External Dependency: `NOT_ASSESSED`

Product Knowledge and Module Registry were read-only during Apply. Any drift is
reserved for the post-archive Knowledge Consolidation workflow and is not
promoted or rewritten here.

## Workflow completion

The exact Knowledge Consolidation packet and payload received separate human
approval and were applied successfully. No further human decision is pending
for this repository workflow. Deployment remains outside this workflow.
