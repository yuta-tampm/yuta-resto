# Gate 3 Final Review — Reputation Review Social Links Configuration

Change: `reputation-review-social-links-configuration`

Gate: `GATE 3`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-06T15:27:47.2061407+02:00`

Approved Gate 3 packet SHA-256:
`43905542f19b3b7c9f5d60d61c61c3240a2e98aa6e1e3813ba4450df1cb40d1c`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `YES — Sensitive Design Gate APPROVED`

Recommendation: `APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY`

Sync authorization: `AUTHORIZED_BY_CURRENT_USER`

Finish outcome: `COMPLETED`

Production: `NOT_AUTHORIZED`

Created: `2026-09-06` (Europe/Paris)

Provenance HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`

Classification: `CROSS_MODULE`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES`

TECHNICAL IMPLEMENTATION COMPLIANCE: `PASS`

VERIFY: `PASS`

QA: `PASS`

## Gate authority and integrity

| Gate/artifact           | Current SHA-256                                                    | Result                                 |
| ----------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| Proposal                | `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61` | MATCH / Gate 1 approved                |
| Analysis                | `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d` | MATCH / Gate 1 approved                |
| Gate 1 packet           | `2106185211b2db18a5164a2c721b14a08bba89be22a8f80f03abdbd9c74fe873` | APPROVED                               |
| Delta Spec              | `ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07` | MATCH / 15 Requirements, 103 Scenarios |
| Gate 2 packet           | `28d2b28af0f2da0f4db1b4a374d55734951707daa9497d8b5686ee9ae1fb802c` | APPROVED                               |
| Design                  | `3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582` | MATCH / D1–D16, SD-R1, SD-R2           |
| Sensitive Design packet | `c267b2d9b58458c87e4844cd8fce8547d245f9ce2b5984353bdcd57953c3526f` | APPROVED                               |
| Tasks review packet     | `0f344b91ede7d484565025a9a83d6e05cd1e9069108a9c7d43bc631d25d1581d` | APPROVED                               |
| Current Tasks           | `4782ceb0b2279bbc30227a0bdf8c767a8fe47a3c5b6a43bfbbf3f29bcd979590` | 33/33 COMPLETE                         |

The approved Product and technical boundaries remain unchanged. No schema,
migration, permission grant, new route, navigation, provider connector, shared
UI primitive, or production configuration was introduced.

## Phase approvals and completion

| Phase                                 | Review/evidence SHA-256                                                                                                  | Result                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Phase 1 — contracts/provider policy   | `e22cdcd5d486042373110b3a22fb3670e4f4846bba9f28f0782bfafa593fa838`                                                       | APPROVED after independent review / contract PASS                            |
| Phase 2 — db-cloud/trusted operation  | `facf87f046de165d133ab1233887db1b448a6b2c3689ed87361eea07f94c6584`                                                       | Out-of-sequence implementation accepted after reconciliation / contract PASS |
| Phase 3A — page-pack visual authority | `c96a117ce94b7207db2945c01a082676417e9d17bdfd761a4259856dee618dc8`                                                       | APPROVED                                                                     |
| Phase 3B — Backoffice                 | `63ca4318365c4b083868ad0ba50565ca3f7b723fd7a08f8df55ae44360c99f7d`                                                       | APPROVED / contract PASS                                                     |
| Phase 3C — public rendering           | `ca0edbbf4fdbb24b7076b03829143be8a1677ebb5ab7aaa0652479425457ae7f`                                                       | APPROVED / contract PASS                                                     |
| Phase 4 — integration, VERIFY, QA     | [`03-verify-evidence.md`](03-verify-evidence.md), SHA `730650169c14375a28b6bd7b9ab7f04ac129641e8e74e7c79fcea58d021f6ccb` | PASS                                                                         |

Tasks: `33/33 COMPLETE`.

All four Technical Implementation Contracts are `PASS`.

## Design summary

- A single pure contracts policy validates private input and projects public
  safe links using exact approved provider host/path rules.
- Reputation owns the three nullable values. Private reads and writes stay
  scoped by trusted organization plus establishment and reuse the current
  OWNER-only `reputation.settings.manage` authority.
- A state token and strict qualified-audit reconstruction support no-change,
  response-loss recovery, stale conflict, and ABA detection without browser
  authority.
- A real mutation locks the scoped settings row and commits the three-link
  update plus exactly one bounded `SETTINGS` audit in one transaction.
- Missing scoped settings rows fail closed; this change never creates or
  provisions the row or invents unrelated Reputation settings.
- The existing Satisfaction inbox remains primary. One OWNER-only form follows
  it at every viewport, with aligned DOM/visual order.
- feedback-web renders only safe projected CTAs and hides null or unsafe legacy
  values.

## Exact implementation inventory

The complete exact attributed patch is
[`03-implementation.diff`](03-implementation.diff), SHA-256
`0faa1b118f6b7104f1463c83c9279a99cbf138b31eea13c4aea51d1cb75f327f`,
117125 bytes, 14 valid `diff --git` sections.

Scoped diff stat: `14 files changed, 3405 insertions(+), 6 deletions(-)`.

Sorted implementation paths:

1. `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings.tsx`
2. `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state.ts`
3. `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/actions.ts`
4. `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx`
5. `apps/backoffice/test/reputation-review-social-links-actions.test.ts`
6. `apps/backoffice/test/reputation-review-social-links-component.test.tsx`
7. `apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx`
8. `packages/contracts/src/reputation/index.ts`
9. `packages/contracts/test/reputation.test.ts`
10. `packages/db-cloud/src/index.ts`
11. `packages/db-cloud/src/reputation-repository.ts`
12. `packages/db-cloud/src/reputation-review-social-links.ts`
13. `packages/db-cloud/test/reputation-review-social-links-inventory.test.ts`
14. `packages/db-cloud/test/reputation-review-social-links.integration.test.ts`

The `packages/db-cloud/src/index.ts` attributed hunk is exactly one export
line. The full patch parses successfully with `git apply --stat` and
`git apply --numstat`; unrelated dirty-worktree changes are not absorbed.

The exact deterministic PowerShell recipe used to reproduce the patch is:

```powershell
$map = @{}
$accepted = @(
  'docs/reviews/reputation-review-social-links-configuration/evidence/phase-1-attributed-implementation.diff',
  'docs/reviews/reputation-review-social-links-configuration/evidence/phase-2-attributed-implementation.diff'
)
foreach ($source in $accepted) {
  $raw = [IO.File]::ReadAllText((Resolve-Path $source)).Replace("`r`n", "`n")
  $parts = [regex]::Split($raw, '(?m)(?=^diff --git )') |
    Where-Object { $_ -match '^diff --git ' }
  foreach ($part in $parts) {
    [void]($part -match '^diff --git a/(.+?) b/')
    $map[$Matches[1]] = $part.TrimEnd("`r", "`n") + "`n"
  }
}
$phase3 = @(
  'apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings.tsx',
  'apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state.ts',
  'apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/actions.ts',
  'apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx',
  'apps/backoffice/test/reputation-review-social-links-actions.test.ts',
  'apps/backoffice/test/reputation-review-social-links-component.test.tsx',
  'apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx'
)
foreach ($path in $phase3) {
  git ls-files --error-unmatch -- $path 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    $lines = & git diff --no-ext-diff --no-textconv HEAD -- $path
  } else {
    $lines = & git diff --no-index --no-ext-diff --no-textconv -- /dev/null $path 2>$null
    if ($LASTEXITCODE -notin @(0, 1)) { throw "git diff failed for $path" }
  }
  $map[$path] = ($lines -join "`n").TrimEnd("`r", "`n") + "`n"
}
$output = 'docs/reviews/reputation-review-social-links-configuration/03-implementation.diff'
[IO.File]::WriteAllText(
  $output,
  (($map.Keys | Sort-Object | ForEach-Object { $map[$_] }) -join ''),
  [Text.UTF8Encoding]::new($false)
)
```

Reproduction in a temporary file matched the attached patch exactly:
`0faa1b118f6b7104f1463c83c9279a99cbf138b31eea13c4aea51d1cb75f327f`.

## Technical Compliance Matrix

The canonical detailed matrix and exact executable evidence are in
[`03-verify-evidence.md`](03-verify-evidence.md). Every Scenario is covered by
its parent Requirement row.

| Spec Requirement                           | Design          | Implementation/evidence                                          | Result |
| ------------------------------------------ | --------------- | ---------------------------------------------------------------- | ------ |
| Trusted Reputation ownership and scope     | D1, D3, D5, D10 | Scoped db operation, action guards, PostgreSQL cross-scope tests | PASS   |
| Existing authority; OWNER-only settings    | D1, D9, D11     | Existing permission reused; role action tests and Browser QA     | PASS   |
| Exactly three nullable values              | D2, D9          | Contracts/read model/form state                                  | PASS   |
| One explicit Save; no autosave             | D5, D11         | One form/action/repository mutation                              | PASS   |
| Multi-field all-or-nothing                 | D5, D8          | One transaction; invalid and fault rollback tests                | PASS   |
| Normalized no-op and authoritative success | D5, D6, D9      | Shared normalization and D2 branch                               | PASS   |
| Conflict and response-loss replay          | D4–D7, D9       | State token, marker parser, D1/D2/ABA, two-tab QA                | PASS   |
| Common URL safety                          | D2              | One pure 54-test contracts policy                                | PASS   |
| Google exact hosts/paths                   | D2              | Exhaustive Google matrix                                         | PASS   |
| Facebook bounded hosts                     | D2              | Exhaustive Facebook matrix                                       | PASS   |
| Instagram bounded hosts                    | D2              | Exhaustive Instagram matrix                                      | PASS   |
| Manual Google URL / GBP independence       | D15             | Inventory guard and scoped diff                                  | PASS   |
| Safe public projection                     | D10, D13        | Shared projection, 7 render tests, public Browser QA             | PASS   |
| Atomic SETTINGS audit                      | D5, D8, D14     | Locked transaction, fault/concurrency/nullable-actor tests       | PASS   |
| No provider/production expansion           | D1, D15, D16    | 14-path scope and architecture review                            | PASS   |

TECHNICAL IMPLEMENTATION COMPLIANCE: `PASS`.

## Technical VERIFY

Canonical evidence SHA-256:
`730650169c14375a28b6bd7b9ab7f04ac129641e8e74e7c79fcea58d021f6ccb`.

Key exact outcomes:

| Command/evidence                                         | Result                                                                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Contracts focused provider-policy suite                  | PASS — 54/54                                                                  |
| `pnpm --filter @yuta/contracts test`                     | PASS — 98/98                                                                  |
| Focused disposable-PostgreSQL Reputation suite           | PASS — 15/15, zero skipped                                                    |
| `pnpm --filter @yuta/db-cloud test` default guarded run  | PASS — 47 tests; guarded integration suites truthfully skipped without opt-in |
| Backoffice focused action/component suite                | PASS — 27/27                                                                  |
| `pnpm --filter @yuta/backoffice test`                    | PASS — 511 tests; 92 files passed, 1 skipped                                  |
| Public CTA render suite                                  | PASS — 7/7                                                                    |
| Contracts, db-cloud, Backoffice, feedback-web typechecks | PASS                                                                          |
| `pnpm typegen:next`                                      | PASS — all six Next applications                                              |
| `pnpm -r --if-present typecheck`                         | PASS — all declared workspace typechecks                                      |
| Backoffice build                                         | PASS — Next 16.2.9                                                            |
| Feedback-web build                                       | PASS — Next 16.2.9                                                            |
| `pnpm docs:check`                                        | PASS — 36 current documents                                                   |
| `pnpm architecture:check`                                | PASS                                                                          |
| strict OpenSpec change validation                        | PASS                                                                          |
| page-pack validation                                     | PASS — 1 package, 0 warnings                                                  |
| scoped Prettier                                          | PASS                                                                          |
| `git diff --check`                                       | PASS; line-ending advisories only                                             |
| `pnpm format:check`                                      | FAIL outside scope — exactly 67 pre-existing unrelated files                  |

The real feature integration suite used a disposable PostgreSQL 17 database on
loopback only. It proved scoped read/write, missing row, public projection,
single/multi-provider mutation, one ordered audit, invalid/no-op, D1/D2,
response-loss replay, stale conflict, ABA, concurrent writers, malformed and
ambiguous evidence, nullable actor, and settings/audit fault rollback.

A broad all-integration diagnostic run found two unrelated failures: one suite
requires its dedicated database-name prefix and then passed 27/27 on that
database; one Personnel newest-50 assertion uses fixed September 4 timestamps
that are older than its September 6 setup event. Neither is in the 14-path
scope or replaces the zero-skip Reputation evidence.

No approved Product/Design deviation or blocked required evidence remains.

VERIFY: `PASS`.

## QA

QA report:
[`qa/QA_REPORT.md`](qa/QA_REPORT.md), SHA-256
`83898d670ef654a092c3c623cd4ea054490768d25b5ec8cadb2394ec7dd23774`.

Screenshot manifest:
[`qa/screenshot-manifest.md`](qa/screenshot-manifest.md), SHA-256
`9561b1763ad39abe6dc11ba52b6b410e5f1e1f068571e5be06aaa99b679681f2`.

Browser QA used authenticated synthetic OWNER, MANAGER, and STAFF states on the
real local `/visibilite-reputation/satisfaction` route, the real local
feedback-web `/luna` route, and a disposable PostgreSQL database. Required
viewports 1440×900, 1024×768, 768×1024, and 390×844 passed without horizontal
overflow or form duplication.

| Screenshot                                            | SHA-256                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| `qa/manager-settings-absent-1024x768.png`             | `49219a479986b800f78f8466eb52c0a5d753d0fe0eb8f402292e83b1aee10c8b` |
| `qa/owner-configuration-unavailable-390x844.png`      | `3031656d27d20988e6193e6f29c841d161b19948d579205370655ec84b0a750f` |
| `qa/owner-conflict-390x844.png`                       | `0ffb49894b845c1b29df9a4ef51d80747c20396ea24f0e7d9c83fec55c282a14` |
| `qa/owner-dirty-valid-390x844.png`                    | `6e9fc7abb33627ff56f4962760dab4b7e9b13b693d6336b4fc02fa4793a4c9ff` |
| `qa/owner-empty-1440x900.png`                         | `b7c0ce50338a19b1c4b89f64a03f71957949b12dd406723fcb5cf689068ae755` |
| `qa/owner-empty-settings-1440x900.png`                | `29f4a7c5a9e6ffcf98fd9d40549f1f5666f5f2a6df4d3c92eff3ff2edc55d13b` |
| `qa/owner-empty-settings-768x1024.png`                | `9b7403aa234ae863698127fb0de9ea5abcfa5b2e9e49520ae120d7bdfe333e3f` |
| `qa/owner-empty-settings-visible-1024x768.png`        | `5a16ebefe45617a2ec13ac35f2d4dd2d93f7b1548b49f170a2808c8b11b5b1d9` |
| `qa/owner-empty-settings-visible-390x844.png`         | `900098843e3d55d0e9885fb2b90799ef5d531f9052f0e645d276aa4a363df5ca` |
| `qa/owner-invalid-google-390x844.png`                 | `e7fbff2221e390b5ccfca81e5202af0bc6bc50f838927e266b98f8dd68536700` |
| `qa/owner-saved-390x844.png`                          | `28e20bded9c0f8667ad58711cd4c8b6d93ca0f989eba29efebfce5547363d7a3` |
| `qa/owner-server-error-retry-390x844.png`             | `3d3b787b24c630bbaf6ccd9cf94e07229898e644c80e81ece1eafba34305b68c` |
| `qa/public-success-all-providers-390x844.png`         | `42218bd23d95dfdb363f4c5920ccb793287d97794db7e54178fad4be056c06e1` |
| `qa/public-success-mixed-safe-projection-390x844.png` | `d48b8ea3120c7357bcd32442a783800a080e50ba9e9f2546f11c095abc112354` |
| `qa/public-success-no-providers-390x844.png`          | `351407721eb9113639fa57af4c339b8e0e654776f59f1ac60547b0bc2dbb0e6d` |
| `qa/staff-settings-absent-1024x768.png`               | `7d71193a5cfac58d0c99faaf78deb6ed0f20f814fd5142dc2c1345a11690e41d` |

Verified states include empty, populated, dirty, invalid-on-blur, corrected
valid, saved, normalized no-change, two-tab conflict/reload, forced server
error/retry, missing settings row, OWNER visibility, MANAGER/STAFF absence,
public all/mixed/null projection, keyboard traversal, ARIA relationships,
focus, and responsive order. The transient pending state completed too quickly
for a truthful screenshot; focused component/model tests prove pending
disablement and duplicate-submit prevention. No screenshot is mislabelled as
pending.

No raw state token, tenant/internal/audit identifier, unsafe URL fallback, or
provider credential was rendered. Provider links were inspected but not
opened. No production or external provider data was used.

QA: `PASS`.

## Documentation and as-built state

Current Reputation knowledge and the stable Satisfaction page pack now describe
the implemented local behavior, accepted visual order, real QA evidence, and
the still-deferred provisioning/production boundary. The page pack validates
with one package and zero warnings.

No Environment, Production Readiness, provider readiness, or deployment status
was promoted.

## Deviations, warnings, and unresolved items

- Approved-scope Product/Design deviation: `NONE`.
- Required evidence blocked: `NONE`.
- Repository-wide formatting: `FAIL` for exactly 67 unrelated pre-existing
  files; all attributable files pass scoped Prettier.
- Missing `reputation_settings` provisioning remains a separate Product and
  rollout dependency. It is not implemented here.
- Production enablement, provisioning, deployment, and data operations remain
  `NOT_AUTHORIZED`.

## Gate 3 disposition

TECHNICAL IMPLEMENTATION COMPLIANCE: `PASS`

VERIFY: `PASS`

QA: `PASS`

Gate 3: `APPROVED`

Sync authorization: `AUTHORIZED_BY_CURRENT_USER`

At Gate 3 packet creation, no spec sync, archive, deployment, production
migration, production data mutation, or production enablement had occurred.

## Finish lifecycle outcome

Specs: synced and strictly validated at
`openspec/specs/reputation/review-social-links-configuration/spec.md`

Main Spec SHA-256:
`80a228f2fad6431d817218e9fde147159f583fab4f6bfd495e73d9d9e0d2c756`

Archive location:
`openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration`

Completed: `2026-09-06T15:33:24.1810836+02:00`

Knowledge consolidation: `COMPLETED`

Knowledge review:
`docs/reviews/reputation-review-social-links-configuration/04-knowledge-consolidation-review.md`
— `APPROVED_AND_APPLIED`

Knowledge completed: `2026-09-06T15:43:19.9291424+02:00`

Workflow status: `DONE`

RELEASE_FOLLOW_UP: `REQUIRED` — production rollout still needs separate
readiness authority and evidence for Backoffice, feedback-web, and db-cloud;
coverage or provisioning of missing `reputation_settings` rows remains a
separate Product decision. No release action is authorized by this finish.

No deployment, production migration, production data mutation, settings-row
provisioning, or production enablement occurred.
