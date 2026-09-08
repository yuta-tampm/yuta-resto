# Pointage employee — Product Scope

Status: Approved requirements; Design proposal awaiting review

Visibility: Engineering

## Exact authority

Change: pointage-usable-raw-clocking. CROSS_MODULE.
Gate 2: APPROVED_FOR_DESIGN. P1-P14 preserved.

| Approved delta                                                                                                           | SHA-256                                                          | Requirements / scenarios |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------ |
| [pointage/raw-clocking](../../../../openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md)   | 4bfa64e863ad465a144341c18aa5d0db3ce0806ada52ad40183cf9a4e321f90e | 13 / 41                  |
| [authorization/pointage](../../../../openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md) | 1ba6a0e6bfd3d82fb0f0d010f62e01dd2eacd7e934158ea3144c84ecf203fd66 | 7 / 21                   |

The exact Specs remain normative change requirements. This page proposal does
not rewrite them. Technical representation belongs to
[Design](../../../../openspec/changes/pointage-usable-raw-clocking/design.md).

## Employee goal and approved scope

Identify with the Pointage credential in a trusted establishment; see own
display name and minimal current state; explicitly CLOCK_IN or CLOCK_OUT;
receive the committed immediate receipt; end the interaction and leave no
employee state/authority available to the next shared-device user.

Only CLOCK_IN/CLOCK_OUT, exact four transition outcomes, immutable canonical raw
events, derived sessions/current state and at most one open session.
Multiple sequential sessions, cross-midnight session and CLOCK_IN business-date
grouping. No automatic close, including a departure-boundary denied CLOCK_OUT.
Server time only. Stable request identity, current-authority replay and at most
one acceptance for competing requests. Current Personnel eligibility governs
identify, state.read and mutation/replay.

Employee output: own display name, NOT_CLOCKED_IN/CLOCKED_IN, current
open-session start if any and immediate operation receipt. No historical
attendance or prior clock-out.

Manager scope is server-only: exact establishment.read under active matching
OWNER/MANAGER grants, current-day raw events and current open session. No manager
UI or manager browser transport is part of this page.

## Explicit non-scope

No employee history, daily totals, manager UI, correction/edit/delete,
Planning/Today integration or rounding, canonical/materialized session table,
HS/HC, absences, jours fériés, avantages en nature, payroll/TESE/PDF,
POS/Site Agent/Display/local persistence/offline/sync or new runtime.
No generic employee/cloud session, new Personnel permission, global employee
identity, standalone credential revoke/suspend or upcoming-issuance rule.

## Current data and readiness authority

P13/P14 constrain this change's implementation/integration/Browser QA to
synthetic/disposable data and an approved injected synthetic trusted-address
provider. They are not permanent capability invariants or a runtime employee
classifier. Real attendance remains NOT_AUTHORIZED in development, staging and
production. Production enablement: NOT_AUTHORIZED. No production provider.

Unresolved: exact retention, deletion/anonymization, legal hold,
backup-retention interaction, employee notice, detailed audit visibility,
trusted production client-address provenance. Design selects technical auth
expiry, not a legal deletion/retention policy.

## Review boundary

UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES.
Design only; no Tasks, Implementation Plan, Technical Implementation Contract,
migration, implementation, deployment, enablement, sync or archive.
