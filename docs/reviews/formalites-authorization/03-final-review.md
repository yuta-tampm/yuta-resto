Change: formalites-authorization

Gate: 3 — Final Review

Review status: APPROVED

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-04T18:23:11.9115064+02:00

Approval scope: preserved substantive Gate 3 approval and current conditional finish authorization for formalites-authorization only, after integrity-only revalidation PASS; aggregate 214702ed3c8a8b7a93fd17366b9491923295409d8ca2817c6233101c88e2e5bd, exactly four implementation files.

Finish outcome: COMPLETED

Finish stopping point: Branch B approved Knowledge Consolidation applied and validated; DONE. No production operation authorized.

Invalidated: 2026-09-03T23:22:56.5407198+02:00

Invalidation reason: additional tracked generated-file change in apps/backoffice/next-env.d.ts was omitted from the reviewed four-file implementation inventory.

Created: 2026-09-03T23:07:48.7849242+02:00

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — authorization / cross-module semantic boundary

Sync authorization: AUTHORIZED_BY_CURRENT_USER

Production release: NOT AUTHORIZED

## Finish result — 2026-09-04

Finish outcome: COMPLETED

Specs: synced and strictly validated — authorization/formalites

Archive location: openspec/changes/archive/2026-09-04-formalites-authorization

Completed: 2026-09-04T18:24:44.7487343+02:00

Knowledge consolidation: COMPLETED

Knowledge consolidation assessment: UPDATE_REQUIRED — approved exact update applied through Branch B.

Knowledge review: [04-knowledge-consolidation-review.md](04-knowledge-consolidation-review.md) — APPROVED_AND_APPLIED

Workflow status: DONE

RELEASE_FOLLOW_UP: NOT_REQUIRED — unconnected authorization prerequisite; no production release or consumer wiring authorized.

Current-user instruction explicitly preserves substantive approval and
authorizes finish on integrity-only PASS. No approval was inferred from tooling
completion. Branch A accepted that bounded authorization only after rechecking
the original aggregate, all 18 manifest entries and 12 earlier-gate references.

Sync used current generated openspec-sync-specs instructions and the one
successful specs-rule snapshot, selecting only the delta path returned by
OpenSpec status. The target did not exist before sync and had no overlapping
edits. It now contains exactly the approved Purpose, eight requirements and
27 scenarios under a canonical Requirements section, with no delta-operation
header. Main spec SHA-256:
`1815f4dcdd4236d08176b45377e08e9e72a7d187de89172458d7e796a6a05616`.

The exact change to main-spec bytes is addition of the Formalités spec only.
These nine pre-sync main specs remain raw-byte unchanged:

| Existing main spec                                                   | Pre-sync raw SHA-256                                               |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/specs/authorization/restaurant-knowledge/spec.md`          | `f924222ae59f13937da91c5272a26a6050e16dbe3b2ee994b823297d5e393322` |
| `openspec/specs/establishment-profile/spec.md`                       | `d435e2e9bbaa4dd49e177fdaf0b0f19fbaad50f2b010d7cd1257eed097bd0dba` |
| `openspec/specs/personnel/reconstructable-value-history/spec.md`     | `67c9dff9f78d80f8a9669763e718229df931e8d8f5395fc9284c6aac964abb63` |
| `openspec/specs/restaurant-knowledge/communication-identity/spec.md` | `156e0e05aa4a3b72145ffad5c3dc38ae5a73213a1744d679777850ace4cd7323` |
| `openspec/specs/restaurant-knowledge/concept-history/spec.md`        | `93ece2037955b7b208f506cf7581a9adf45ffe9570783828e159a5fef2fc25c1` |
| `openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md`       | `90e46a1a4e0c2f13679c3eb15cbb560b84b7b4206b1a09ff926f01b7f6624928` |
| `openspec/specs/restaurant-knowledge/customer-experience/spec.md`    | `1fd47662b8122bde0b2a5029af246f39bf78efad6796b9712f2cff6dc6a254f8` |
| `openspec/specs/restaurant-knowledge/team-culture/spec.md`           | `e4af63e50baed2262a18868fd8072ea050d494ce168cc1d0860322651f4d3166` |
| `openspec/specs/restaurant-knowledge/validated-knowledge/spec.md`    | `203d674ad3f0afc1b4462b5584ca597412e09bf0a2c40f9b7937d736d7a73a70` |

Validation and lifecycle evidence:

- `openspec validate --specs --strict`: exit 0, 10/10, before archive.
- `openspec instructions archive --change formalites-authorization --json`:
  exit 0; Vietnamese artifact context retained, no additional operation guidance.
- `openspec status --change formalites-authorization --json`: exit 0,
  yuta-spec-driven, all five artifacts done; 8/8 tasks, no incomplete warnings.
- Current archive skill step 5: native PowerShell scoped Move-Item from the
  resolved active root to the exact dated archive above. Resolved source and
  archive parent were validated; target absent. Six files, including hidden
  .openspec.yaml and the delta, retained exact hashes. No CLI replacement
  workflow, no asynchronous sync, no copy/recreation of the active change.
- `openspec validate --archived --strict`: exit 0, 11/11 after archive.
- `openspec validate --specs --strict`: exit 0, 10/10 after archive.

Original 03-integrity.json and supplemental evidence retain their historical
active paths. For post-archive verification only, map the exact prefix
`openspec/changes/formalites-authorization/` to the recorded archive.
No hashes are rewritten to hide relocation or to excuse implementation drift.
Gate 3 metadata changes and the added integrity/Knowledge review records are
explicitly authorized lifecycle evidence, not implementation scope.

Knowledge assessment requires four bounded documentation targets. The exact
proposed patch and target hashes are recorded in the pending review. No
canonical knowledge file or lifecycle value was edited. No production,
persistence, provider, permission, Personnel or parent-feature operation ran.

### Final post-finish checks

- `pnpm docs:check`: exit 0, 36 current documents after archive/review assembly.
- `pnpm architecture:check`: exit 0 after archive/review assembly.
- `openspec validate --specs --strict`: exit 0, 10/10, repeated after scoped formatting.
- `openspec validate --archived --strict`: exit 0, 11/11, repeated after scoped formatting.
- `pnpm exec prettier --check docs/reviews/formalites-authorization/03-final-review.md docs/reviews/formalites-authorization/03-integrity-revalidation.md docs/reviews/formalites-authorization/04-knowledge-consolidation-review.md openspec/specs/authorization/formalites/spec.md`: exit 0.
- Initial scoped formatting reported two files. Only the newly added Gate 3
  completion block/table was formatted (historical body compared unchanged),
  and the newly synced main spec's extra trailing blank line was removed.
  Requirements/Purpose remain exactly equal to the approved delta; final main
  hash is recorded above. No archived planning or original QA/VERIFY changed.
- `pnpm format:check`: rerun exit 1, exactly the same 62 pre-existing unrelated
  paths as archived tooling closure evidence. All 62 raw hashes MATCH. No debt
  repair, ignore exception, or full-format PASS is claimed.
- Read-only proposed patch preimage validation: four target files, seven unique
  exact matching hunks, PASS. No canonical application performed.
- Final 2,231-path inventory compared with the 2,227-path starting inventory:
  six exact planning relocations to archive; one authorized Gate 3 metadata
  update; four additions (integrity record, Knowledge Review, proposed patch,
  normative main spec). No other source, documentation, index or tooling drift.
- Four implementation files remain MATCH; all 18 original integrity entries
  MATCH with explicit archive-prefix relocation. Original supplemental 17/17
  matched before metadata changes; afterward its only changed bytes are the
  authorized Gate 3 record, with six planning paths relocated unchanged.
- Six next-env files remain untracked and resolve to the six exact root ignore
  rules; generated local files remain present and non-authoritative.

An attempted metadata patch against a nonmatching sentence failed before any
write; the completion checks were then inserted at this exact existing section
boundary. No protected file or failed-evidence record was overwritten.

## Branch B application and closure — 2026-09-04

Knowledge Consolidation: COMPLETED

Knowledge Review: APPROVED_AND_APPLIED

Workflow status: DONE

Completed: 2026-09-04T19:04:01.9626399+02:00

RELEASE_FOLLOW_UP: NOT_REQUIRED

Production: NOT_AUTHORIZED

The current user approved the exact four targets, seven hunks and recorded
preimages of 04-proposed-knowledge.patch, SHA-256
`9ab888b661144b7956b66c0944ed193a9e9b83295da1a43fc116ff87df3d26b0`.
Before any application: patch hash MATCH; four target preimage hashes MATCH;
four exact target paths / seven unique exact-preimage hunks MATCH. Branch B
preconditions passed: approved Gate 3, completed archive, pending Knowledge
Review, active change absent, recorded archive present. The user-requested
normative-spec and four implementation preservation checks also matched.
No Branch A reapproval or planning/VERIFY/QA integrity lifecycle was repeated.

Applied the existing patch bytes directly through apply_patch, without fuzzy
matching or reconstructing text. Independently derived expected target bytes
from the seven exact preimage replacements, then compared each entire resulting
file: 4/4 exact MATCH. No formatter write or additional canonical edit was
needed. Every lifecycle table and status line remains exactly unchanged.

### Final target raw SHA-256

| Applied target                            | Post-application SHA-256                                           |
| ----------------------------------------- | ------------------------------------------------------------------ |
| `docs/features/identity-access/README.md` | `8683fbf189f16fdc31515c7e8bc0133dee78bfb374b73d1fe156caccbd5d591d` |
| `docs/features/personnel/README.md`       | `1eb553ae5f6b2d866c9120a982903d27e3f5bced92b52f76c0ef5f314f1c9c7d` |
| `docs/PRODUCT_KNOWLEDGE.md`               | `6b08e2ec8aa677c5aa5259f9517f35c85eb811f30ca57f8dd4f8d5c68b51aea5` |
| `docs/MODULE_REGISTRY.md`                 | `d1a4a3dbe76932ae611dcdbed4c971f49a6ab029582b19715e7226f07d6f14b3` |

### Actual validation in this Branch B resume

- `pnpm exec prettier --check docs/features/identity-access/README.md docs/features/personnel/README.md docs/PRODUCT_KNOWLEDGE.md docs/MODULE_REGISTRY.md`:
  exit 0, all matched files use Prettier code style.
- `pnpm docs:check`: exit 0, 36 current documents.
- `pnpm architecture:check`: exit 0, boundaries and migration baselines valid.
- Raw path/hash inventory before/after: 2,231 files; only the four approved
  canonical files and the two permitted review/completion records change.
  No fifth canonical file, implementation/test, main spec, archived planning,
  CURRENT_STATE, page pack, architecture source, ADR or tooling file changes.
- Formalités implementation: 4/4 unchanged; normative main spec unchanged at
  `1815f4dcdd4236d08176b45377e08e9e72a7d187de89172458d7e796a6a05616`.
  Archive remains present and active change remains absent.
- Existing full `pnpm format:check` disposition is preserved, not rerun here:
  FAIL, exactly 62 pre-existing unrelated paths. All 62 current raw hashes
  still match the recorded tooling closure evidence. No repair or full-format
  PASS is claimed.
- No full implementation/test/QA suite, build or recursive typecheck was rerun
  for this documentation-only application. Branch B does not require new
  OpenSpec validation for unchanged normative specs; no OpenSpec command,
  second sync or second archive was executed.

Review-record formatting: the first two-record check returned exit 1 for new
completion tables. Formatting was confined to the newly added Branch B evidence
blocks (all other record content compared unchanged). The subsequent scoped
Prettier check of the four canonical targets plus both review records returned
exit 0. No canonical target bytes were changed by formatting.

### Preserved authority

Gate 3 substantive approval, earlier sync/main validation/archive/post-archive
evidence and implementation aggregate remain historical, unchanged authority.
This separate Knowledge Review approval alone authorizes the bounded knowledge
edits. No new permission, grants, tenancy, owner, field, durable draft consumer,
persistence, provider, lifecycle or readiness state is introduced. No deployment
or production operation occurred. Persistent Draft Foundation is not started.

## Current integrity-only revalidation — 2026-09-04

Gate 3 substantive approval: PRESERVED

Gate 3 integrity revalidation: PASS

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS — preserved

VERIFY: PASS — preserved

QA: PASS — preserved

Record: [03-integrity-revalidation.md](03-integrity-revalidation.md), SHA-256
`5a3ec738852a5619665045094c9072dd05039572689e0d2ee9ba8d0ac3e5f7c1`.
All original implementation 4/4, integrity 18/18 and supplemental 17/17 raw
hashes matched before this authorized metadata update. Original aggregate and
substantive evidence remain unchanged. Current user explicitly authorized
integrity-only reconciliation followed by finish if it passes. The old tooling
blocker is resolved by the separately approved archived tooling change.

## Historical finish preflight invalidation — superseded by revalidation

The following records the prior failed attempt, not the current controlling
state. It is retained for provenance; no historical test output is rewritten.

Current user requested Gate 3 approval and sync/archive for the recorded
four-file aggregate hash. That approval has NOT been accepted by finish-change
because scoped-inventory review found an additional tracked-file difference.
The prior PASS assessments below remain historical reviewed evidence, not a
current finalization-ready result.

All 18 manifest hashes and 12 earlier-gate hash references still MATCH, and the
recorded four-file implementation diff reverse-check passes. However, current
`git status --short` additionally reports `apps/backoffice/next-env.d.ts`, absent
from the pre-Apply status and omitted from Gate 3 scope. `git diff --
apps/backoffice/next-env.d.ts` shows exactly:

```diff
-import "./.next/dev/types/routes.d.ts";
+import "./.next/types/routes.d.ts";
```

This is consistent with Next.js-generated route-type configuration after the
Phase 2 build. Attribution to that build is an inference from the clean earlier
status and the generated-file difference, not a proven exclusive writer trace.
Expected reviewed scope: four implementation/test files. Current additional
unaccounted tracked path: `apps/backoffice/next-env.d.ts`. No authority to silently
extend the reviewed inventory or restore this file is inferred at finalization.

No final approval metadata was applied. No main spec was created, no sync or
archive ran, no canonical knowledge was edited, and no production operation was
performed. Current file is preserved unchanged. Return to
`$yuta-run-change formalites-authorization` for bounded attribution/reconciliation
of this generated file, scoped verification and a fresh Gate 3 packet before
attempting finish again. Historical hashes and evidence below are retained.

## Independent review results — historical Gate 3 packet

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

QA: PASS

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

Browser QA: NOT_APPLICABLE

Tasks: 8/8 complete, Phase 1 Service / Domain and Phase 2 Integration / Regression.
Current user approved Phase 1; this packet requests human Gate 3 review only.

## Design and implemented scope

Formalités owns READ/MANAGE semantics; Shared Authorization represents and
enforces them in existing cloud Backoffice. Exactly `formalites.read` and
`formalites.manage`, separate OWNER-only grants. MANAGER/STAFF/public/service
deny, system roles do not bypass restaurant membership. Small server-only
helper reuses actual session/membership/tenant/establishment resolution, preserves
400/403 and redirects. No browser-provided authority, Personnel alias, new
runtime/package, schema, draft state or consumer wiring.

Personnel/RK/other existing authorization blocks remain byte-identical.
Generic/connected prototypes, source reads, development gate, navigation, UI,
session.ts and packages/tenant remain unchanged. Phase 2 introduced no
implementation/test edits. Canonical knowledge/lifecycle values were not edited.

## Reviewed scope and aggregate implementation/change hash

Exact full diff: [03-implementation.diff](03-implementation.diff).

Aggregate implementation/change SHA-256:
`214702ed3c8a8b7a93fd17366b9491923295409d8ca2817c6233101c88e2e5bd`

This is the current workflow's **exact full scoped implementation diff** hash,
not an ad-hoc hash-list aggregate. Four sorted paths, one tracked additive edit
and three new files, 527 insertions and zero deletions. Exact diff size:
19479 bytes.
`git apply --reverse --check docs/reviews/formalites-authorization/03-implementation.diff`:
exit 0, PASS. Full diff is attached, not just selected hunks.

Deterministic generation: sorted paths below; tracked section uses
`git -c core.quotepath=false diff --no-ext-diff --no-color --binary HEAD -- "<path>"`;
new sections use `git -c core.quotepath=false diff --no-index --no-ext-diff --no-color --binary -- /dev/null "<path>"`.
Exit 1 for new-file differences is expected. Join stdout diff sections in
ordinal path order, CRLF → LF, UTF-8 no BOM, one final LF. Exclude stderr warnings.
Baseline confirms tracked permissions.ts was clean relative to HEAD.

Sorted implementation inventory:

- `apps/backoffice/src/server/auth/formalites.ts`
- `apps/backoffice/src/server/auth/permissions.ts`
- `apps/backoffice/test/formalites-authorization-context.test.ts`
- `apps/backoffice/test/formalites-permissions.test.ts`

Scoped stat (`git apply --stat` on attached diff; tracked-only Git stat would
omit new files and is not used as the complete inventory):

```text
apps/backoffice/src/server/auth/formalites.ts                       | 20
apps/backoffice/src/server/auth/permissions.ts                      | 37
apps/backoffice/test/formalites-authorization-context.test.ts        | 330
apps/backoffice/test/formalites-permissions.test.ts                 | 140
4 files changed, 527 insertions(+), 0 deletions(-)
```

HEAD provenance: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
Baseline and full pre-Apply dirty-status inventory: [phase-1-baseline.json](phase-1-baseline.json).
499/500 protected file hashes unchanged; only tracked permissions.ts differs.
Its entire legacy suffix remains exact-byte equal. New-symbol import inventory
returns only the two auth modules. No unrelated F07/workflow work is attributed.

## TECHNICAL VERIFY

Source and Technical Compliance Matrix:
[03-verify-evidence.md](03-verify-evidence.md), SHA-256
`87bdc43572c7429b9a696619389cd254b7b548a770bd4b49bef0a3dfeeba5c93`.

The exact source is included below; it contains 27 scenario mappings, both
phase-contract matrices, commands, limitations, and assessment. Hash covers
exact UTF-8 source file bytes, not a paraphrased summary.

Execution output: [03-command-results.md](03-command-results.md).
Backoffice: 436 tests PASS, 85 files PASS, one external OpenAI smoke file skipped
by existing explicit-run guard. Tenant: 11/11 PASS. Named seven-suite regression:
26/26 PASS. Backoffice build, typecheck, recursive typecheck, docs, architecture
and strict OpenSpec validation PASS.

Known non-blocking repository result: `pnpm format:check` FAIL (exit 1) on 62
unrelated files. Current user explicitly authorized leaving this debt unchanged;
all attributable implementation/planning/review files pass scoped Prettier.
No full-repository formatting PASS is claimed.

## QA

[qa/QA_REPORT.md](qa/QA_REPORT.md), SHA-256
`90419ff3a4baea4f630abfa95f140cfc05d8cc742934b00cfdc9e6853690276a`.

Required non-browser authorization/runtime QA: 59/59 PASS, 2 files, no skips.
Explicit allow/deny/recovery matrix and exact verbose execution output included.
Actual session.ts/tenant resolver/guards run with mocked infrastructure;
these are not database integration, browser or production authorization tests.
No screenshots/viewport evidence applies, no UI was added for QA.

## Integrity and approval references

Gate 1, Gate 2 and Sensitive Design Gate are APPROVED. Phase 1 acceptance recorded
from the current user. Earlier artifact path sets and all 12 embedded hash
references match; one delta spec only. Proposal/Analysis/Spec/Design unchanged.
Restoring completed checkboxes to unchecked reproduces approved Tasks hash
`51fc898a0f961f769f17cf30235868aa060a49e4915123949a02a8f197afbdb0`;
no planning prose or contract drift.

Hashes: `Get-FileHash -Algorithm SHA256 -LiteralPath <path>`, exact bytes,
lowercase hex. Machine-readable inventory: [03-integrity.json](03-integrity.json).

| Repository-relative path                                                           | SHA-256                                                            |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/server/auth/formalites.ts`                                    | `60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626` |
| `apps/backoffice/src/server/auth/permissions.ts`                                   | `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` |
| `apps/backoffice/test/formalites-authorization-context.test.ts`                    | `af3a2bd48565cec5afb559602626b16c563f21ca3ec660b7943e4e49327f4537` |
| `apps/backoffice/test/formalites-permissions.test.ts`                              | `9e9888461c4154df90802f3d9021956dba3731cd34a9d27aa110d08ba9bc42e6` |
| `docs/reviews/formalites-authorization/01-analysis-review.md`                      | `b6fc2871222a750ebaa2ffba99a717203fbf41f15bfdc7ff33634bc1a100bb57` |
| `docs/reviews/formalites-authorization/02-specs-review.md`                         | `7deebcd29f6b3d0e9a1f005c45f7966cd1f593dd77532ac75474a34baca78286` |
| `docs/reviews/formalites-authorization/02b-design-review.md`                       | `3a621ae86e916c072cd31373931a51b29d5dbdc9d6374bf2193e9cbef8321fa8` |
| `docs/reviews/formalites-authorization/03-command-results.md`                      | `4859c3c85f9a3b47caadad55cedcdc8683b21c646d929e439420d165959d9318` |
| `docs/reviews/formalites-authorization/03-implementation.diff`                     | `214702ed3c8a8b7a93fd17366b9491923295409d8ca2817c6233101c88e2e5bd` |
| `docs/reviews/formalites-authorization/03-verify-evidence.md`                      | `87bdc43572c7429b9a696619389cd254b7b548a770bd4b49bef0a3dfeeba5c93` |
| `docs/reviews/formalites-authorization/phase-1-baseline.json`                      | `8bebe87ce43d365177e330eb2ac3a38f86a5b53dfa11bd777011d3e7c5017168` |
| `docs/reviews/formalites-authorization/phase-1-review.md`                          | `9892aa686e12b910072af0fffbe6116137979af185c5a7e927c9aef990dd95ab` |
| `docs/reviews/formalites-authorization/qa/QA_REPORT.md`                            | `90419ff3a4baea4f630abfa95f140cfc05d8cc742934b00cfdc9e6853690276a` |
| `openspec/changes/formalites-authorization/analysis.md`                            | `c3d1babc03b1bb3088fe2178065e4fa6b2975c329050c3de847f59ca359794c4` |
| `openspec/changes/formalites-authorization/design.md`                              | `4f8b77b216fb820bd637a6661d164bcf998fde5c26a76e4d236d1652ab1b194d` |
| `openspec/changes/formalites-authorization/proposal.md`                            | `2da37c1b35c5450318ed051e1dec4b23941102e324dc4d453d8a932794b04613` |
| `openspec/changes/formalites-authorization/specs/authorization/formalites/spec.md` | `601dd1417ac25527f201fdb3b95488b98474f6514ecfb0c428f68584d118ba46` |
| `openspec/changes/formalites-authorization/tasks.md`                               | `3d22add75fccb9ab2d48ff808afd1a0e23d81b7119f9bc54cfb14c4dd4595dc4` |

## Final checks after evidence assembly

Executed:

- `pnpm --filter @yuta/backoffice typecheck`: rerun exit 0.
- `openspec validate formalites-authorization --strict`: exit 0, valid.
- `pnpm docs:check`: rerun exit 0, 36 documents.
- `pnpm architecture:check`: rerun exit 0.
- `git apply --reverse --check docs/reviews/formalites-authorization/03-implementation.diff`: exit 0.
- `pnpm exec prettier --check apps/backoffice/src/server/auth/permissions.ts apps/backoffice/src/server/auth/formalites.ts apps/backoffice/test/formalites-permissions.test.ts apps/backoffice/test/formalites-authorization-context.test.ts openspec/changes/formalites-authorization docs/reviews/formalites-authorization`: exit 0 before packet, repeated after packet.
- PowerShell hash comparisons: earlier packets MATCH; Tasks only eight checkboxes;
  no implementation drift from Phase 1.

Initial regression command with parentheses in the route path failed in the
Windows launcher before tests (exit 1). The retry with unique runtime-test
basename passed all seven intended suites. Both exact commands/results retained.

## Deviation / recommendation

Approved-scope conflict: NONE.
Implementation scope drift: NONE.
Approved Product/Design deviation: NONE.
Blocked required evidence: NONE.

No sync, archive, deploy, production migration/cutover, Formalités persistence,
provider activation or production enablement performed. Passing this gate does
not promote Environment/Production Readiness or authorize durable draft work.

Recommendation: APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY

STOP for human Gate 3 review. Sync authorization remains PENDING.

## Exact canonical VERIFY evidence

```markdown
# Technical VERIFY — formalites-authorization

Assessment source: this file, approved Proposal/Analysis/Spec/Design/Tasks,
current four-file implementation, [command results](03-command-results.md),
[baseline](phase-1-baseline.json) and [full scoped diff](03-implementation.diff).

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

## Completeness / correctness / coherence

8 requirements / 27 scenarios covered below; Design D1–D7 preserved. Phase 1
accepted by current user, Phase 2 evidence complete. Final Tasks has 8/8 completed
checkboxes; original planning prose remains untouched. No code/test edits were
needed in Phase 2. No Product or durable-boundary deviation.

Proposal: exactly two independent Formalités operations, cloud Backoffice only,
no durable draft consumer. Analysis: READY_FOR_SPECS assumptions still hold;
known broader Identity/Access documentation drift is not normalized here.
Spec: every scenario mapped. Design: separate private grant map, existing
TenantError semantics, small composition helper, no session refactor. Tasks:
both embedded contracts assessed independently below; no unused UI/data phase.

## Exact location key

Locations below are repository-relative; line numbers refer to reviewed bytes.

- P = `apps/backoffice/src/server/auth/permissions.ts`:6 (type), :8 (map),
  :16 (boolean), :28 (throwing); legacy blocks start :42.
- F = `apps/backoffice/src/server/auth/formalites.ts`:10 (request composition).
- S = `apps/backoffice/src/server/auth/session.ts`:59 (session requirement),
  :71 (trusted resolution), :99 (scope recovery), unchanged.
- T = `packages/tenant/src/index.ts`: `resolveAuthenticatedTenant` and
  `requireEstablishment`, unchanged; exact baseline file hash retained.
- U = `apps/backoffice/test/formalites-permissions.test.ts`:52 (operation suite),
  :99 (literal/Personnel isolation suite).
- C = `apps/backoffice/test/formalites-authorization-context.test.ts`:101 (OWNER),
  :134 (missing cookie), :142 (invalid session), :150 (invalid metadata),
  :157 (membership matrix), :174 (scope 400), :192 (roles), :204 (system roles),
  :225 (browser claims), :270 (forwarding), :299 (Personnel independence),
  :315 (safe return), :322 (failure propagation).
- REG = seven explicitly executed regression suites in 03-command-results.md;
  26/26 PASS, plus full Backoffice 436 PASS and Tenant 11 PASS.
- DIFF = 03-implementation.diff, reverse-check PASS; baseline comparison
  preserves 499/500 files and every legacy permission block byte.

## Technical Compliance Matrix — every Spec scenario

R1–R8 refer to the eight requirements in
`openspec/changes/formalites-authorization/specs/authorization/formalites/spec.md`,
in document order. Spec line identifies the exact scenario, not a new requirement.

| Spec requirement / scenario line             | Approved Design | Exact implementation                                | Exact executable test / evidence                                                                                                     | Result |
| -------------------------------------------- | --------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| R1 :17 requested operation                   | D1–D3, D7       | P:6/8/16, F:10                                      | U exact two operations/separate map; C:270 forwards each operation without reusing another result                                    | PASS   |
| R2 :29 OWNER READ                            | D2–D4           | P:16/28, F:10                                       | U formalites.read allows OWNER independently; C:101 read composition                                                                 | PASS   |
| R2 :34 OWNER MANAGE                          | D2–D4           | P:16/28, F:10                                       | U formalites.manage allows OWNER independently; C:101 manage composition                                                             | PASS   |
| R2 :39 MANAGER denial                        | D2–D4           | P:8/16, F:10                                        | U denies MANAGER with exact error; C:192 valid MANAGER denied, both operations                                                       | PASS   |
| R2 :44 STAFF denial                          | D2–D4           | P:8/16, F:10                                        | U denies STAFF with exact error; C:192 valid STAFF denied, both operations                                                           | PASS   |
| R3 :59 no authenticated user                 | D4–D5           | S:59/71 → F:10                                      | C:134 missing cookie and :142 null upstream session → exact login redirect                                                           | PASS   |
| R3 :64 missing membership                    | D4–D5           | S:71 → T resolver                                   | C:157 missing case → exact recovery redirect; no permission evaluation                                                               | PASS   |
| R3 :69 inactive membership                   | D4–D5           | S:71 → T resolver                                   | C:157 inactive case, real status validation                                                                                          | PASS   |
| R3 :74 wrong user                            | D4–D5           | S:71 → T resolver                                   | C:157 wrong-user case, real matching validation                                                                                      | PASS   |
| R3 :79 missing establishment                 | D3–D5           | F:15, P:32 → T guard                                | U null/empty false + exact 400; C:174 org-only malformed upstream rejected                                                           | PASS   |
| R3 :84 wrong organization                    | D4–D5           | S:71 → T resolver                                   | C:157 wrong-organization case denied before authorization                                                                            | PASS   |
| R3 :89 wrong establishment                   | D4–D5           | S:71 → T resolver                                   | C:157 wrong-establishment case denied before authorization                                                                           | PASS   |
| R3 :94 inactive user/org/establishment       | D4–D5, D7       | S:59/71 existing repository boundaries              | C:142 null-session and :150 null-metadata outcomes; actual SQL active-status implementation unchanged, no database integration claim | PASS   |
| R3 :99 browser authority claims              | D4–D5           | F:10 signature, S:71 lookups                        | C:225 hostile cookie/header/query claims ignored; identifiers from validated session; STAFF cannot elevate                           | PASS   |
| R4 :111 public actor                         | D2–D3           | P:16/28                                             | U public each operation false/403 with exact message/code/status                                                                     | PASS   |
| R4 :116 service actor                        | D2–D3           | P:16/28                                             | U service each operation false/403 with exact message/code/status                                                                    | PASS   |
| R4 :121 system role lacks membership         | D4–D5           | S:71 → T resolver                                   | C:204 YUTA_ADMIN/YUTA_SUPPORT missing membership recovery                                                                            | PASS   |
| R4 :126 system role cannot raise grant       | D2–D5           | P:16, F:10                                          | U does not elevate each system role; C:204 MANAGER/STAFF both operations denied                                                      | PASS   |
| R5 :139 Personnel allow is not proof         | D1–D2, D6       | P:16, F:10                                          | C:299 Personnel allow spies unused, STAFF remains denied; U source isolation                                                         | PASS   |
| R5 :145 MANAGE does not use Personnel        | D1–D2, D6       | P:8/16, F:10                                        | U forbids delegation and denies Personnel literal; C:299 manage denial                                                               | PASS   |
| R6 :159 Personnel unchanged                  | D2, D6–D7       | P:67 onward legacy map/guards unchanged             | REG personnel-permissions 2/2; DIFF exact legacy byte equality                                                                       | PASS   |
| R6 :164 Restaurant Knowledge unchanged       | D2, D6–D7       | P:63 and :187 legacy map/guards unchanged           | REG restaurant-knowledge-permissions 8/8; DIFF                                                                                       | PASS   |
| R6 :169 session/membership/scope unchanged   | D4–D7           | S/T unchanged                                       | Tenant 11/11, C real resolver tests, 499 protected hashes preserved                                                                  | PASS   |
| R7 :182 generic prototype unchanged          | D6–D7           | existing generic route/components unchanged         | REG formalites-cdi-prototype 5/5; DIFF/no imports, no extra development gate                                                         | PASS   |
| R7 :187 connected/source/dev gates unchanged | D6–D7           | existing connected route and runtime gate unchanged | REG connected-read 2/2 + runtime gate 1/1; six-fact projection/source-read preserved; DIFF                                           | PASS   |
| R8 :203 no workflow side effect              | D5–D7           | F:1–20 only auth composition                        | U source/import allowlist; C mocked adapters perform existing auth reads only; four-file DIFF has no data/provider/API code          | PASS   |
| R8 :209 no extra roles/production            | D2, D6–D7       | P:8 map, F unconnected                              | U/C deny MANAGER/STAFF, DIFF no wiring/env/schema/production changes                                                                 | PASS   |

## Phase Technical Implementation Contract matrix

| Phase / rule                                | Authority                                         | Implementation / evidence                                                                                                      | Result |
| ------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 1 — exact allowlist, baseline isolation     | Tasks 1 contract; root/Backoffice AGENTS          | phase-1-baseline.json, four-file diff and 499 protected files; no Phase 2 implementation edits                                 | PASS   |
| 1 — canonical ownership/runtime             | approved Proposal/Analysis, Design D1/D4/D5       | server-only Backoffice helper, no package/runtime changes                                                                      | PASS   |
| 1 — typed independent operations/grants     | Spec R1/R2; Design D1–D3                          | P + U + C:270; only OWNER                                                                                                      | PASS   |
| 1 — scope/denial semantics                  | Spec R3/R4; Design D3–D5                          | P/F + real S/T; U exact false/400/403 and C denial matrix                                                                      | PASS   |
| 1 — trusted input, system roles             | tenancy/authentication architecture; Design D4/D5 | C:134–225, no browser TenantContext parameter                                                                                  | PASS   |
| 1 — Personnel/RK isolation                  | Spec R5/R6; Design D2/D6                          | U/C isolation, exact legacy bytes, regression suites                                                                           | PASS   |
| 1 — no consumer/UI change                   | Spec R7; Design D6                                | source inventory only two auth modules; prototype/gate suites and baseline hashes                                              | PASS   |
| 1 — tests/typecheck/evidence limitations    | Design D7; Tasks 1.4                              | 59/59 executable tests, typecheck PASS; mocks explicitly bounded                                                               | PASS   |
| 1 — no persistence/provider/excluded scope  | Spec R8; Tasks exclusions                         | four-file diff contains only auth declarations/helper/tests                                                                    | PASS   |
| 2 — full regressions                        | Tasks 2.1; Design D7                              | Backoffice 436 PASS, Tenant 11 PASS, explicit regression 26 PASS; one external OpenAI smoke file skipped as designed           | PASS   |
| 2 — repository checks                       | Tasks 2.2; current-user formatting allowance      | typecheck/build/docs/architecture/strict PASS; scoped format PASS; full format FAIL on 62 unrelated files disclosed, no repair | PASS   |
| 2 — scoped diff, stable earlier authority   | Tasks 2.3; integrity protocol                     | exact 4-file manifest, reverse diff check, 12 approved hash refs MATCH                                                         | PASS   |
| 2 — separate technical assessment           | Tasks 2.3/2.4; VERIFY skill                       | this 27-scenario + phase-rule matrix, completeness/correctness/coherence assessment                                            | PASS   |
| 2 — non-browser authorization QA            | Tasks 2.4; QA protocol                            | qa/QA_REPORT.md: 59/59, no database/browser/deployment claim                                                                   | PASS   |
| 2 — rollback/exclusions/canonical knowledge | Design Migration Plan, Tasks 2 contract           | no consumer exists, no destructive rollback, no canonical edits or lifecycle promotions                                        | PASS   |
| 2 — Gate 3 boundary                         | run-change State 8; current user                  | packet pending human review and sync authorization; no sync/archive/deploy                                                     | PASS   |

## Commands and exact results

Full output and exact commands are in 03-command-results.md. Summary:

- `pnpm --filter @yuta/backoffice test`: exit 0, 85 passed files + 1 skipped,
  436 tests passed. Skipped `personnel-contract-openai-smoke.test.ts` selects no
  fixtures without explicit `YUTA_OPENAI_EVALUATION_RUN`; no external call enabled.
- `pnpm --filter @yuta/tenant test`: exit 0, 2 files, 11 tests passed.
- Explicit seven-suite regression: exit 0, 7 files, 26 tests, no skips/failures.
  Initial path with `(authenticated)` failed in the Windows pnpm launcher before
  Vitest ran (exit 1); retry uses the unique runtime-test basename, same script.
- `pnpm --filter @yuta/backoffice typecheck`: tsc completed without errors.
- `pnpm -r --if-present typecheck`: all applicable projects Done.
- `pnpm --filter @yuta/backoffice build`: exit 0, compiled/static generation
  complete, existing Formalités generic and connected routes remain dynamic.
- `pnpm docs:check`: passed 36 documents; `pnpm architecture:check`: passed.
- `openspec validate formalites-authorization --strict`: valid.
- `pnpm format:check`: exit 1, 62 unrelated files, no attributed-file warnings.
  Current user explicitly permits reporting this debt without fixing it.
- Scoped Prettier checks cover all four files plus current change/review artifacts;
  exact final command/result is recorded with Gate 3 integrity evidence.

No failure is hidden behind a focused PASS. Full repository formatting is NOT
PASS. That disclosed, authorized unrelated debt is not an approved-scope defect.

## Scoped diff and integrity

Sorted implementation inventory (all and only these four paths):

1. `apps/backoffice/src/server/auth/formalites.ts` — new.
2. `apps/backoffice/src/server/auth/permissions.ts` — additive tracked change.
3. `apps/backoffice/test/formalites-authorization-context.test.ts` — new.
4. `apps/backoffice/test/formalites-permissions.test.ts` — new.

Aggregate implementation/change hash is SHA-256 of exact **full scoped diff**
bytes, per run-change State 8 implementation-diff protocol, not a newly invented
concatenation of file hashes. Deterministic generation: paths ordinally sorted;
tracked section from `git -c core.quotepath=false diff --no-ext-diff --no-color --binary HEAD -- "<path>"`;
new sections from `git -c core.quotepath=false diff --no-index --no-ext-diff --no-color --binary -- /dev/null "<path>"`
(exit 1 means differences, expected); join stdout diff sections in that order,
normalize CRLF to LF, UTF-8 without BOM, final LF. Warnings before `diff --git`
are excluded. Baseline permissions.ts was clean against HEAD before Apply.

`git apply --reverse --check docs/reviews/formalites-authorization/03-implementation.diff`
exit 0. `git apply --stat` reports 4 files changed, 527 insertions, 0 deletions.
The three new files are explicitly included, not omitted by tracked-only diff.
`Get-FileHash -Algorithm SHA256` over exact artifact bytes supplies packet hashes.

Phase 1 reviewed implementation hashes still match. Comparing 500 baseline
tracked hashes yields only permissions.ts changed, 499 unchanged, including
session, tenant package, existing auth tests, prototype/gate/navigation/UI.
Legacy permissions suffix beginning `export type ReputationPermission` equals
the original bytes exactly. New-symbol rg inventory returns only P and F.
No attributable schema/migration/database/domain writes/provider/production code.
Unrelated dirty F07/workflow files remain outside this diff.

## Issues / limitations

CRITICAL: NONE. Approved-boundary deviation: NONE. Missing scenario: NONE.
WARNING: full repository format debt (62 unrelated files), expressly disclosed.
No database integration was run. Null repository outcomes test upstream contract
composition, not live SQL expiry/active checks. No browser rendering, real HTTP
route access, provider, production migration or deploy was executed. Browser QA
is NOT_APPLICABLE, but non-browser authorization QA is required and separate.

As-built scope is documented here; no canonical Product Knowledge or lifecycle
promotion. No durable draft behavior follows from these logical permissions.
```
