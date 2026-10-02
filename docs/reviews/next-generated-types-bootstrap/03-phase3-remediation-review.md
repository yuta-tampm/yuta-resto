Change: next-generated-types-bootstrap

Gate: Phase 3 stopped evidence review — NOT Gate 3

Review status: AWAITING_HUMAN_REVIEW

Created: 2026-09-04

Schema: yuta-spec-driven

Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE

Sensitive change: YES — repository bootstrap/integrity

## Independent outcomes

TECHNICAL IMPLEMENTATION COMPLIANCE: BLOCKED

VERIFY: BLOCKED

QA: FAIL

**STOP condition: Linux N8 missing-package fixture changed a tracked lockfile outside its declared injection.** No Gate 3 packet or aggregate implementation/change hash is prepared. Sync/archive/production remain unauthorized.

The user-approved Phase 1 implementation and revalidation remain accepted. This turn introduced no canonical implementation edit, permission/runtime change or Design/Tasks requirement revision.

Current progress: **21/26 tasks**. Only **3.6** newly completes: both full POS offline runs passed. Tasks 3.3/3.4/3.5/3.7/3.8 remain unchecked.

## R1 — missing-package fixture integrity failure

Fixture: `/.tmp-next-matrix-linux-missing-package` in the local Linux test container.

Source snapshot: `0314828cb3ef26331f457bd772129f240726ac1b`.

Before injection and again before invocation: **2215 exact candidate paths/raw hashes MATCH; Formalités 4/4 + 18/18 + 17/17 MATCH**.

Only intended synthetic source delta: remove `apps/backoffice/package.json`. The actual command was:

`pnpm typegen:next && pnpm -r --if-present typecheck`

Observed result:

- pnpm performed an additional dependency installation/update first, reporting 15 workspace projects and removing seven packages;
- the accepted bootstrap then returned nonzero with `Missing package: apps/backoffice`;
- actual trace: **zero Next generator starts, zero recursive typecheck starts**;
- the after-test raw-SHA comparison rejected an additional `pnpm-lock.yaml` change;
- no later Linux case ran. The separate Windows launcher was stopped at its owned PID/tree; its incomplete spawn-error case is not counted PASS.

| Lockfile bytes                            | SHA-256                                                            |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Approved candidate / canonical, unchanged | `bebba4709d2f5fc893921c475a6149788f25f5ffcb439e4a62257a73bf78bbdb` |
| Invalid Linux fixture after command       | `d52e37bac7881ea118cfa3819cfc88b31efac90f9c979fe451fc0ba0dab421c0` |

The exact diff removes the Backoffice importer and orphaned PDF/font dependency entries. It is included in [raw evidence](03-phase3-remediation-evidence.json). The expected hash printed by the failing assertion is the baseline; the actual after hash above was measured independently.

This is **not** evidence of a canonical bootstrap implementation defect: its own preflight denied correctly. It is an invalid acceptance fixture because the outer package-manager command produced an undeclared side effect. It cannot be promoted to PASS by silently allowing the lockfile, disabling integrity checks, restoring it after the command, or relabeling byte equality.

Independent post-failure verification confirmed Formalités still MATCH in that same Linux fixture. Canonical `pnpm-lock.yaml` and every implementation file remain unchanged.

Required review: determine the bounded negative-fixture treatment for package-manager pre-run dependency side effects before retrying N8. No remedy was applied and no Design/Tasks contract was reopened.

## R2 — focused harness scheduling error

`node --test scripts/next-generated-types-bootstrap.test.mjs`: **49/50 PASS, exit 1**, 51611.8174ms.

The test at line 226, “preflight resolves installed real Next and TypeScript for all six canonical apps read-only,” overlapped this agent's Backoffice build in the same normal snapshot and correctly rejected its `.next/lock`. Other 49 tests passed.

This was an agent scheduling mistake, not authority to bypass the lock or change implementation. The harness needs a serial rerun on an exclusive checkout. It was not rerun after R1 required a stop.

Initial Windows probe D0 also failed before bootstrap because a preload path used backslashes in NODE_OPTIONS. The disposable trace helper switched to forward slashes; config-1 was retried in a new, fully qualified fixture and passed. Original diagnostic failure is preserved separately, never counted as acceptance.

## Preserved successful evidence

| Evidence                                 | Actual result                                                                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Fresh Windows snapshot frozen install    | exit 0, 13.8s                                                                                                                |
| Validated normal root typegen            | exit 0, 6/6 real Next 16.2.9, 24 fresh outputs                                                                               |
| Six direct app typechecks                | 6/6 exit 0                                                                                                                   |
| Actual Windows CI conjunction            | exit 0; validated generation followed by recursive typecheck                                                                 |
| Six builds                               | 6/6 exit 0; full source/protection checks before/after each                                                                  |
| Windows negative cases                   | 12 PASS: six config positions, async, premature zero/stale outputs, four output-invalidity cases                             |
| Linux negative cases                     | 24 PASS: the above plus spawn/signal/actual 120s timeout, output-write/path/link/tracked-target and known/foreign lock cases |
| POS offline, next-env initially absent   | exit 0, 83373ms                                                                                                              |
| POS offline, next-env already generated  | exit 0, 104476ms                                                                                                             |
| Normal snapshot tracked-source stability | 2215/2215 raw path/SHA unchanged                                                                                             |
| Six next-env tracking/ignore state       | zero tracked entries, exact root rules at .gitignore lines 3–8                                                               |
| Formalités                               | 4/4 implementation + 18/18 integrity + 17/17 supplemental MATCH                                                              |
| Canonical index                          | same six previously approved staged removals, unchanged SHA                                                                  |

Builds and both POS runs completed before stop handling; no new runtime test was started after R1. POS acceptance used its existing random disposable PostgreSQL container and synthetic seed with local ports 18473/18474. Its test containers/processes cleaned up. The Linux helper container was stopped without deleting its filesystem; snapshots/probes remain for review.

### Exact build commands

| Command                                  | Exit | Duration |
| ---------------------------------------- | ---- | -------- |
| `pnpm --filter @yuta/backoffice build`   | 0    | 75066ms  |
| `pnpm --filter @yuta/web build`          | 0    | 46647ms  |
| `pnpm --filter @yuta/booking-web build`  | 0    | 50784ms  |
| `pnpm --filter @yuta/feedback-web build` | 0    | 35916ms  |
| `pnpm --filter @yuta/pos build`          | 0    | 64391ms  |
| `pnpm --filter @yuta/display build`      | 0    | 38160ms  |

Direct checks used the same six package names with `typecheck`, individually, each exit 0. Cloud build configuration used synthetic CI-style values; no real environment files or credentials were copied. POS/Display received only their own isolated fake service/database configuration. Local production-mode compilation is not production enablement.

## Snapshot and Linux provenance

- Canonical source HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- Candidate tree: `979d503d72ce6767292eb6553437e0680b65d952`.
- Snapshot: `0314828cb3ef26331f457bd772129f240726ac1b`.
- Normal Windows root: `D:/working/yuta/.tmp-bootstrap-phase3r-20260904`.
- Canonical index before/after: `cb06e0450599f335de1d95e90b075824c9043cd15db6cab4a354b4fc77b17d8a`.
- Temporary-index staging: `core.autocrlf=false`, `core.safecrlf=false`; no branch/index commit.
- Actual Linux runtime: Docker image `node:24.17.0-bookworm`, digest `sha256:733e1c06ada118ed9f6133a31aa1290be6929664026fb28821500437c61f2c6f`; Node 24.17.0, pnpm 11.8.0.
- Exact snapshot exported with `git bundle create <evidence>/candidate.bundle HEAD`, cloned in Linux with autocrlf=false; each case then used detached `git -c core.autocrlf=false worktree add` and full raw-byte qualification.
- All cases installed dependencies frozen from a fresh no-generated-state checkout; no copied node_modules/env/.next/incremental cache. N3 alone deliberately primed real outputs after qualification.

Docker/Linux were available. No Linux PASS is inferred from Windows. Complete Linux N9 normal recursive acceptance remains unexecuted despite successful Linux priming generations.

## Missing coverage / no inferred PASS

- Windows remaining process/path/preflight/lock matrix; interrupted spawn-error case not accepted.
- Remaining Linux N8 variants and full normal N9 recursive conjunction.
- Actual overlapping-bootstrap owner/contender acceptance on both platforms; known-lock checks/focused overlap do not replace it.
- Dev smoke: **Backoffice, Web, Booking, Feedback, POS, Display — all NOT_RUN_AFTER_STOP**. Not environment-unavailable; prepared helper never executed.
- Approved tracked README negative control.
- Serial focused harness rerun.
- Final complete VERIFY/QA acceptance, full attributed implementation diff and aggregate Gate 3 change hash.

## Repository checks and known debt

| Command                                                                                                                                                                                                                | Exact result                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `pnpm docs:check`                                                                                                                                                                                                      | exit 0; 36 current documents                    |
| `pnpm architecture:check`                                                                                                                                                                                              | exit 0                                          |
| `openspec validate next-generated-types-bootstrap --strict`                                                                                                                                                            | exit 0; valid no-spec change                    |
| `cmd /d /c "pnpm typegen:next && pnpm -r --if-present typecheck"`                                                                                                                                                      | exit 0 in normal new snapshot                   |
| `pnpm format:check`                                                                                                                                                                                                    | exit 1; exactly 62 pre-existing unrelated paths |
| `pnpm exec prettier --check package.json scripts/generate-next-types.mjs scripts/next-generated-types-bootstrap.test.mjs README.md docs/DEVELOPMENT_WORKFLOW.md .github/workflows/ci.yml scripts/test-pos-offline.mjs` | exit 0                                          |
| Focused bootstrap harness                                                                                                                                                                                              | exit 1; 49/50 as R2                             |

The [raw evidence](03-phase3-remediation-evidence.json) includes every warning path, not just the count. No formatting debt was fixed. Review-only formatting/docs/architecture/strict checks are performed at closeout; these do not resume runtime acceptance after STOP.

Auxiliary read-only diagnostics: two initial policy filename lookups without the `_REVIEW` suffix failed and were corrected to the repository's actual files; an attempted installed pnpm source lookup used an unavailable path. `pnpm config get verifyDepsBeforeRun` reported undefined. No claim about an explicit repository setting or undocumented default is inferred from those lookups; R1 attribution uses actual command output and exact lockfile diff.

## Compliance / QA and scope

[Technical and phase-contract matrix](03-phase3-remediation-matrix.md).

[Separate non-browser QA report](qa/phase3-remediation/QA_REPORT.md).

Implementation locations, executed cases, gaps and PASS/FAIL/BLOCKED rows are mapped there. Compliance and VERIFY are BLOCKED by required invalid/missing evidence; QA is FAIL for current acceptance, not BLOCKED_BY_ENVIRONMENT. No claim that the accepted implementation has an established Product/Design deviation.

All accepted implementation files, Design, Proposal, Analysis, metadata and Formalités remain unchanged. No Phase 2 action, retracking, ignore edit, POS housekeeping edit, app/source/config/tsconfig/dependency upgrade, schema, permission, production or sync/archive operation.

Only review/progress edits this turn:

1. `phase-1-remediation-revalidation-review.md` — record current user approval.
2. `openspec/changes/next-generated-types-bootstrap/tasks.md` — status/3.6 checkbox progress only; SHA `7919cf17c7b9f343e295ce4a5bc3e899b04c94bb0c9434ad291eaf2fc4a6c553`.
3. `02b-design-review.md` — current progress/Tasks hash metadata only; embedded Design unchanged.
4. `03-phase3-remediation-evidence.json` — new raw evidence, source inventory and disposable probe source.
5. `03-phase3-remediation-matrix.md` — new partial compliance/gap matrix.
6. `qa/phase3-remediation/QA_REPORT.md` — new separate QA assessment.
7. `03-phase3-remediation-review.md` — this stopped-review packet.

Raw evidence SHA-256: `14b5adc084665e1ff74a31995932c676c3ed545f0b36887ca1efdc3280f2ba6d`.

Prior historical Phase 1/2/3 reports and evidence are preserved. No `03-final-review.md` was created.

**STOP for bounded fixture/evidence review.** Do not silently accept lockfile drift or continue remaining tests. No Gate 3 readiness, sync/archive, deployment or automatic Formalités continuation.
