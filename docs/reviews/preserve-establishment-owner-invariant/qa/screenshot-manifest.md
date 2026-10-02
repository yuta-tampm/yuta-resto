# Browser QA screenshot manifest

Change: preserve-establishment-owner-invariant

Captured: 2026-09-06

QA status: FAIL

Real Backoffice route, authenticated synthetic OWNER; exact PNG bytes captured
by browser screenshot API. Hash command: `Get-FileHash -Algorithm SHA256`.
Paths below are relative to `docs/reviews/preserve-establishment-owner-invariant/qa/`.

| Path                            | Viewport | Role/state/scenario                                                  | SHA-256                                                          |
| ------------------------------- | -------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| desktop-owner-edit-denied.png   | 1366x768 | OWNER; sole-owner edit denied; existing error/role restored          | 9817f139c3707a33c79bbfdbc7cbff0abe5846f41149908df5c6a2860f3b47fe |
| mobile-owner-layout-failure.png | 390x844  | OWNER; same error; heading/description clipped by fixed-width search | e6647df8f65c458425166fa782624ec2eac4f71023ed8e74aca6b048218338d5 |

Coverage incomplete after STOP; no MANAGER, attachment or intermediate-width
screenshots claimed. These screenshots do not replace deterministic DB tests.
