# Phase 3 remediation — non-browser QA report

Change: next-generated-types-bootstrap

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

QA status: FAIL

Review status: AWAITING_HUMAN_REVIEW

## Setup and evidence

Actual Windows Node 24.17.0 / pnpm 11.8.0 / Next 16.2.9 and actual Linux container from `node:24.17.0-bookworm`, image digest `sha256:733e1c06ada118ed9f6133a31aa1290be6929664026fb28821500437c61f2c6f`.

Exact-byte-qualified snapshot `0314828cb3ef26331f457bd772129f240726ac1b`, 2215 files including approved uncommitted candidate. Actual public CLI and CI conjunction in separate disposable fixtures; trace/fault injection is test infrastructure only, never canonical code or a custom generator.

[Raw results](../../03-phase3-remediation-evidence.json), [matrix](../../03-phase3-remediation-matrix.md), [stopped review](../../03-phase3-remediation-review.md).

## Observed results

- Windows: 12 completed negative cases PASS — six config positions, async rejection, premature zero with stale real outputs, four invalid-output variants.
- Linux: 24 completed negative cases PASS — the same 12 plus real spawn/signal/default-120s timeout, EISDIR output write, links/hard link/nonregular/tracked target and foreign/Next locks.
- Linux missing-package case is NOT accepted: proper bootstrap denial, but undeclared pnpm lockfile drift invalidates fixture evidence.
- Six direct typechecks and six actual builds PASS with normal snapshot source unchanged.
- Full POS offline acceptance PASS twice, first without POS next-env and then with it already generated. Disposable PostgreSQL/test process cleanup completed; no production data.
- Focused harness: 49/50, exit 1. This agent incorrectly overlapped it with build in the same checkout; the real preflight test correctly rejected the build lock. No serial rerun after the stop condition.

## Missing coverage after stop

All six dev smokes were not attempted. They are NOT_RUN_AFTER_STOP, not environment-unavailable and not inferred PASS. README negative control, actual overlapping-bootstrap matrix case, remaining Windows cases, remaining Linux N8 variants and full Linux N9 normal recursive path remain unexecuted.

The prepared disposable dev-smoke helper was never run. No browser QA, screenshots or user-facing route claims apply.

## Failure interpretation / preservation

R1 is a fixture-integrity finding requiring bounded evidence review, not proof that the accepted orchestrator changes canonical lockfiles during a normal run. R2 is agent scheduling error. The 62 pre-existing format failures remain disclosed separately; no unrelated formatting repair.

Docker/Linux were available. Therefore this is not `BLOCKED_BY_ENVIRONMENT`. Current QA does not pass, and TECHNICAL IMPLEMENTATION COMPLIANCE / VERIFY remain BLOCKED by required evidence.

Formalités 4/4 + 18/18 + 17/17 MATCH, including after the failed Linux fixture. Normal source, canonical index and all implementation/Design hashes preserved.

STOP. No Gate 3, sync/archive, deployment or production enablement.
