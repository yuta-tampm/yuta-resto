Change: platform-admin-formalites-template-authority-foundation
Gate: 3 — Final Implementation Review
Review status: APPROVED
Created: 2026-09-06T22:34:02.0626362+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — authorization/security and cross-module durable boundary
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-06T22:49:13.9762751+02:00
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Finish outcome: COMPLETED
Archive location: openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation
Knowledge consolidation: UPDATE_REQUIRED
Knowledge review: docs/reviews/platform-admin-formalites-template-authority-foundation/04-knowledge-consolidation-review.md — APPROVED
Knowledge apply: COMPLETED — semantic update plus approved format-only remediation validated
Formatting remediation: docs/reviews/platform-admin-formalites-template-authority-foundation/05-formatting-remediation-review.md — APPROVED / COMPLETED
Completed: 2026-09-06T23:25:35.2588797+02:00
Workflow status: DONE
RELEASE_FOLLOW_UP: NOT_REQUIRED

# Gate 3 — Final Implementation Review

## Approved prerequisite gates

| Gate    | Packet                                                                                       | Status     | Packet SHA-256                                                     |
| ------- | -------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| Gate 1  | `docs/reviews/platform-admin-formalites-template-authority-foundation/01-analysis-review.md` | `APPROVED` | `1b613c4898cfbbb0e0ac139bc51c772ff85268b598e971863e95962a56bdb53c` |
| Gate 2  | `docs/reviews/platform-admin-formalites-template-authority-foundation/02-specs-review.md`    | `APPROVED` | `4054de5e90f3ec0b2aa37cf51adf3f76d3c90f467ae28cc98e93d9338f7a4c49` |
| Gate 2b | `docs/reviews/platform-admin-formalites-template-authority-foundation/02b-design-review.md`  | `APPROVED` | `b18dd0e7e9423d906950beed2a25e3b3839b57304e0084c9f753d065e1c36c25` |

Tất cả prerequisite artifact path-sets và hashes đã được recompute trước Apply
và trước Gate 3; chúng khớp exact approved values.

## Current planning artifact hashes

Hash command/tool:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <path>
```

| Path                                                                                                                                                     | SHA-256                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/analysis.md`                                                                   | `6f39ed1cb07ccc2b1db66c7cad920d97c01e4183d23bcbad5783c419dc3ec73b` |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/design.md`                                                                     | `c165a8ae8b21f78dd33dbd12d634bf52e9cf6acd65d4385e36ce5656981fd07d` |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/proposal.md`                                                                   | `ef4ce308839aa02bf15f89254bce366a65fe115c35eeec04da367ffcfc7efa91` |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/specs/authorization/platform-admin-formalites-template-administration/spec.md` | `c2ff7c618b2d050f0fa259f2e01d226870446638c1138a9cf2a7cd0a6bb45dfb` |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/tasks.md`                                                                      | `d669403109e378954abed0f9ac4ce219b64312387436710a69ab89fc43378db9` |

## Design and implementation summary

Implementation follows approved D1–D6:

- one capability-specific portable module in `@yuta/auth`;
- exactly five closed Formalités template operations;
- exhaustive explicit grants: `YUTA_ADMIN` receives those five,
  `YUTA_SUPPORT` receives none;
- trusted active internal-user composition in existing `createAuthService`;
- minimized four-field GLOBAL YUTA Formalités context, separate from
  `TenantContext`;
- stable denial-only security audit signal, distinct from legal evidence;
- focused in-memory auth tests with no application/database/browser runtime.

Design D7 is also preserved: Apply/Verify changed no canonical Product
Knowledge, `CURRENT_STATE`, `MODULE_REGISTRY`, lifecycle or current architecture
summary. Canonical reconciliation is deferred to post-archive reviewed
Knowledge Consolidation.

## Tasks and phase completion

OpenSpec apply status: `all_done`.

| Phase                    | Contract rows | Tasks   | Result         |
| ------------------------ | ------------- | ------- | -------------- |
| Foundation / Data        | F1–F6         | 1.1–1.3 | `3/3 COMPLETE` |
| Service / Domain         | S1–S7         | 2.1–2.3 | `3/3 COMPLETE` |
| Integration / Regression | R1–R8         | 3.1–3.6 | `6/6 COMPLETE` |

Total: `12/12 COMPLETE`.

## Attributed implementation files

| Path                                                                  | Change   | SHA-256                                                            |
| --------------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| `packages/auth/src/formalites-template-system-authorization.ts`       | New      | `816b912b7cd4b9408d50f4ae4d01832499e87b452661143cac6dbcb0886cace2` |
| `packages/auth/src/index.ts`                                          | Modified | `f435cc08b5151437621b6cd5fda61715b0760451631bff3d1b8fd39316cb5ce7` |
| `packages/auth/src/session.ts`                                        | Modified | `278d08effc39d90cfe147bd45182a6e80d76ff5641f94d3d1bc302fd8063f5a1` |
| `packages/auth/test/formalites-template-system-authorization.test.ts` | New      | `93911ec279fa61f20f2f9af3b0fdb6cc591d1ba88fd6eb1ae2f344f45c52de89` |

No additional implementation path was used. Existing
`packages/auth/test/session.test.ts`, Backoffice, tenant, contracts, database,
Platform Admin, template and canonical documentation paths remain unchanged by
this change.

## Requirement and scenario coverage

[Canonical VERIFY evidence](verify-evidence.md) maps all `7/7` requirements and
`19/19` scenarios to implementation plus executable or structural evidence.

| Requirement family                           | Primary implementation                       | Primary evidence                                                 |
| -------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| Exact independent operation catalog          | policy module                                | exact tuple/unknown-prefix-wildcard tests                        |
| Explicit initial grant matrix                | policy module                                | five admin allow and five support denial cases                   |
| Trusted system-only context                  | auth service composition                     | missing/unknown/disabled/active and extra-membership-field cases |
| Fail-closed prerequisites                    | auth service denial branches                 | exact error/reason/actor assertions                              |
| Tenant non-bypass                            | isolated context and dependency boundary     | no tenant import/fields plus restaurant-role denial cases        |
| Security audit vs legal evidence             | normalized denial logger and success context | audit payload and no-success-side-effect assertions              |
| No template lifecycle/general Platform Admin | context-only return                          | source/dependency inspection and side-effect test                |

## Scoped implementation diff

Full exact diff: [03-implementation.diff](03-implementation.diff).

SHA-256:
`fa89abc96319fb126596c0ff7afe70f6e5a7ec4cc533aa9f1b3f3f35541627cb`.

Deterministic generation concatenated binary Git diffs in sorted attributed
path order, using `core.safecrlf=false`, `core.autocrlf=false`, `--no-ext-diff`
and `--binary`; untracked files used `diff --no-index -- NUL <path>`.

```text
 .../formalites-template-system-authorization.ts    |  52 +++
 packages/auth/src/index.ts                         |   1 +
 packages/auth/src/session.ts                       | 136 +++++++-
 ...ormalites-template-system-authorization.test.ts | 338 ++++++++++++++++++++
 4 files changed, 514 insertions(+), 13 deletions(-)
```

Key reviewed hunks are the closed tuple/exhaustive role map, discriminated
internal-user resolver, exact system-operation method, normalized denial event,
bounded barrel export and focused authorization suite. The attached diff is the
complete review source; no untracked implementation file is omitted.

## TECHNICAL VERIFY

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

Canonical evidence source:
[verify-evidence.md](verify-evidence.md).

Evidence SHA-256:
`644cc48f2b7fd4327e3e3d73642f42c0ae83a086cd939e5ac45fe78a04fe3d59`.

The evidence source contains the complete F1–F6, S1–S7 and R1–R8 Technical
Compliance Matrix. All `21/21` rows are `PASS` with authority, affected
implementation and test/check traceability.

### Verification commands and results

| Command / check                      | Result                                                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/auth test`      | PASS — 4 files, 40 tests.                                                                                                                |
| `pnpm --filter @yuta/auth typecheck` | PASS.                                                                                                                                    |
| `pnpm test:cloud`                    | PASS — complete defined cloud chain, including 518 Backoffice tests. Existing environment-gated skips remain visible in evidence.        |
| `pnpm docs:check`                    | PASS — 36 current documents.                                                                                                             |
| `pnpm architecture:check`            | PASS.                                                                                                                                    |
| `pnpm -r --if-present typecheck`     | PASS — all 15 participating projects.                                                                                                    |
| strict OpenSpec validation           | PASS — one change, zero issues.                                                                                                          |
| scoped Prettier and diff checks      | PASS.                                                                                                                                    |
| `pnpm format:check`                  | FAIL — exactly 70 pre-existing/out-of-scope findings; none belongs to attributed implementation/change paths. No global write performed. |

`@yuta/auth` defines no build script, so no invented build command was run.
The repository-wide formatter result is an unrelated baseline failure and is
not represented as PASS.

Initial focused testing found one test-only expectation mismatch for wildcard
audit normalization. The test was corrected to expect the approved `invalid`
marker; production authorization behavior did not change. Final focused and
broader results pass.

## QA

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

QA: NOT_APPLICABLE

Evidence: the entire implementation diff is confined to portable auth
code/tests. It adds no runtime caller, application, route, UI, browser behavior,
database, provider or template side effect. Authorization behavior is fully
exercised by technical tests, and artificial Browser QA would not validate an
approved user/runtime dimension.

This QA classification does not claim deployment, environment enablement,
Production Readiness, legal approval or template publication.

## Deviations, issues and exclusions

- Approved Spec/Design deviation: none.
- Unresolved critical issue: none.
- New role, permission family, tenant bypass or runtime owner: none.
- Schema/migration/persistence/API/UI/legal evidence/template lifecycle: none.
- Production operation/deployment/enablement: none.
- Canonical Knowledge/lifecycle/architecture update: none.
- Unrelated global formatting baseline: 70 findings, preserved and separately
  attributed.

## Finish lifecycle — Sync result

Pre-sync main-spec target:
`openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md`
was `ABSENT`; its path had no tracked or untracked overlap. The only selected
delta was the exact `artifactPaths.specs.existingOutputPaths` entry reviewed by
Gate 2.

Sync created one main spec with the delta Purpose copied verbatim and all seven
ADDED requirements intelligently merged under one canonical `## Requirements`
section. No delta operation header was copied. Exact comparison confirmed
`7/7` requirements and `19/19` scenarios, with no content left to apply.

| Evidence                                    | Result                                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Main spec SHA-256                           | `3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2`                            |
| Full sync diff                              | `docs/reviews/platform-admin-formalites-template-authority-foundation/03-main-spec-sync.diff` |
| Sync diff SHA-256                           | `88b83e723bce6b9032b6615a8f95681dbcd4b355d7a36a213e2765d8d23947a5`                            |
| Scoped Prettier                             | PASS                                                                                          |
| `openspec validate --specs --strict --json` | PASS — 13 specs passed, 0 failed; informational long-text notices only                        |

Sync completed: 2026-09-06T22:50:15.6561286+02:00.

Sync was mechanical promotion of approved behavior. It did not change Product
Knowledge, lifecycle, environment, production readiness or deployment state.

## Finish lifecycle — Archive and Knowledge Consolidation

Archive completed: 2026-09-06T22:55:26.9414587+02:00.

The completed change was moved to:

`openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation`

The active change path is absent. Post-archive Knowledge Consolidation is
classified `UPDATE_REQUIRED` because current sources still claim that no
Platform Admin capability scope exists. The exact bounded proposal and current
target hashes are recorded in
`docs/reviews/platform-admin-formalites-template-authority-foundation/04-knowledge-consolidation-review.md`.

The exact approved Knowledge diff and separately approved format-only
remediation were applied to the same five reviewed targets. All five final
hashes match, scoped Prettier passes, `docs:check` and `architecture:check`
pass, the normative main spec is unchanged, and the exact five operation
identifiers remain intact. Knowledge Consolidation is `COMPLETED` and workflow
status is `DONE`. No lifecycle/readiness value was automatically promoted. No
release follow-up is required because this change adds no application or
runtime caller and production remains not authorized.

## Recommendation

`APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY`

Gate 3 approval alone is not sync authorization. `$yuta-run-change` will not
sync or archive this change.
