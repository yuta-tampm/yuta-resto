Change: pointage-usable-raw-clocking
Stage: KNOWLEDGE CONSOLIDATION REVIEW
Review status: APPROVED
Created: 2026-09-23
Revised: 2026-09-23
Approved: 2026-09-23T13:51:54Z
Approval source: Explicit current-user Knowledge Consolidation decision for the revised packet
Approved packet SHA-256: `d43a5c80f6abbb7fea174c3037e75c06b5c899f834420fd450bbdc909cfab1cc`
Approved proposed-diff SHA-256: `e84ea437f95e763c910261a4d0df60558d88ea8102a0298a10602f0a6ab03c13`
Knowledge Scan: UPDATE_REQUIRED
Knowledge consolidation: COMPLETE
Workflow status: DONE

# Knowledge Consolidation Review

## 1. Completed-change evidence

Gate 3 was explicitly approved on the exact packet whose pre-approval SHA-256
was `77ddc9b7dfc4f663a5aaa9c983079a30480f8b503f1c013a16b5b9dc20bf8074`.
Technical Implementation Compliance, formal VERIFY and mandatory Browser QA
were `PASS`; Product failures and Product/source drift were zero.

The exact delta Specs were synced and the resulting main Specs strictly
validated 18/18:

- `openspec/specs/authorization/pointage/spec.md`:
  `e1a0e2414cfbb59168370edb9ef691c6ce93023662283b2b7a863a7d9dc1a6fc`;
- `openspec/specs/pointage/raw-clocking/spec.md`:
  `ac0fea1564d2b8c949d751b4f87d8b5b59a6c46b783de5889e39f5ee7e6a396d`.

The active change was archived at
`openspec/changes/archive/2026-09-23-pointage-usable-raw-clocking` with all
32/32 tasks and reviewed evidence intact.

## 2. Why an update is required

The previous packet (SHA-256
`277c6c64f03c6e72ecbcc8271d8973d7f6cbec49852b8fe6a52e69678f403bb8`)
is `SUPERSEDED_BEFORE_APPLY` for `INCOMPLETE_KNOWLEDGE_PROPOSAL`.
Its 20-replacement payload omitted the `Future or proposed scope` paragraph
in `docs/features/personnel/README.md` that still calls usable Pointage
planned, Product-unresolved and a placeholder. No Knowledge target was edited
under that packet; all six pre-apply hashes still match. This revised packet
adds exactly that missing replacement without applying any target edit.

Six current knowledge sources still state that Pointage is a placeholder,
usable raw clocking/raw evidence does not exist, Browser QA is pending, or the
usable workflow is unapproved/not started. The proposed reconciliation records
only the approved bounded implementation and preserves:

- Pointage ownership of immutable canonical raw events;
- Personnel ownership of dossier/lifecycle and the scoped display projection;
- no manager UI, correction, history/totals, Planning/Today/payroll
  integration, POS/Site Agent/offline/sync or canonical production
  raw-clocking migration;
- the three accepted Browser QA residual evidence limitations;
- real employee attendance and production enablement as `NOT_AUTHORIZED`;
- all seven legal/privacy/provenance blockers.

The added Personnel wording is supported by the approved archived
`pointage-usable-raw-clocking` Proposal and raw-clocking Spec and by the
Gate-3-approved 32/32 implementation, formal VERIFY and Browser QA evidence.
It records bounded employee `CLOCK_IN`/`CLOCK_OUT`, immutable raw evidence and
derived sessions, not a Personnel workflow or production authorization.

### Bounded six-target consistency scan

| Current target / potential contradiction                                                                    | Classification after proposed replacements                                                                     |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Product Knowledge says the visible Pointage route remains a placeholder and raw evidence absent             | `ALREADY_COVERED_BY_PACKET` — owning section replacement                                                       |
| Module Registry Pointage foundation/usable rows say no usable workflow or `NOT_STARTED`                     | `ALREADY_COVERED_BY_PACKET` — two row replacements                                                             |
| Current State Pointage row, planned-placeholder bullet and unresolved Pointage row                          | `ALREADY_COVERED_BY_PACKET` — three replacements; future Today aggregation remains `NO_CONTRADICTION`          |
| Personnel `Future or proposed scope` paragraph calls usable Pointage planned/placeholder/Product-unresolved | `NEW_OMISSION` — added replacement below                                                                       |
| Personnel capability/lifecycle rows, business boundary, related-module row and limitation paragraph         | `ALREADY_COVERED_BY_PACKET` — six original replacements; future Today relationship remains `NO_CONTRADICTION`  |
| Employee page-pack status, QA, Design link, delivery checkpoint and final status                            | `ALREADY_COVERED_BY_PACKET` — six original replacements; historical Batch C context is `NO_CONTRADICTION`      |
| Authentication opening consumer paragraph says Browser QA pending                                           | `ALREADY_COVERED_BY_PACKET` — opening-paragraph replacement; unchanged security details are `NO_CONTRADICTION` |

No other `NEW_OMISSION` was found in the exact six-target scan. This scan is
not a request to change another source or to expand Product scope.

## 3. Exact target set

| Target                                                 | Current exact-byte SHA-256                                         | Authority classification                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------- |
| `docs/PRODUCT_KNOWLEDGE.md`                            | `7723a19aa5ffd7afe0c01d67d45ee352ea33dc0dec3892a2e6f423747e715c2d` | Current-state routing and bounded as-built reconciliation |
| `docs/MODULE_REGISTRY.md`                              | `7205d06cd76e1e89f3fb0f755dbd295fe8191ec31ef97b8eafb8d69b06a1a5b3` | Existing lifecycle rows; no readiness promotion           |
| `docs/CURRENT_STATE.md`                                | `d279d0d2e76de9498d2266c742cc3408f9be471174f04cb5413fd62d3c80b105` | Broad repository summary correction                       |
| `docs/features/personnel/README.md`                    | `33214c8a8699b4fffda22afd15d6360f8d4f90c4548adfe98955db772fccdd9d` | Existing cross-module relationship correction             |
| `docs/ui/pages/backoffice-pointage-employee/README.md` | `984c2550fa31e607aad6975a71fa6849ea23b72f88afef4662c23de79a15954b` | Final as-built and Browser QA status                      |
| `docs/architecture/AUTHENTICATION.md`                  | `5708b9c270fcea8e28549505c24e5f4b34cba7f198585761ffe77b6927825b9b` | Existing security section status correction only          |

Target count: exactly 6.

No normative Spec, archived artifact, implementation/test code, schema,
migration, QA evidence, ownership, grant, runtime topology, Product behavior or
production-readiness value is modified by this proposal.

## 4. Exact proposed replacement text

The block between the markers is the exact UTF-8/LF proposal payload. Each
`REPLACE` selector identifies a unique current section or row in the
hash-locked target. The text following it, up to the next `REPLACE` line, is the
complete replacement text. Target-native newline style must be preserved when
applying; formatter write over the six targets is forbidden.

Exact proposed-diff payload SHA-256:
`e84ea437f95e763c910261a4d0df60558d88ea8102a0298a10602f0a6ab03c13`

<!-- PROPOSED_DIFF_BYTES_BEGIN -->

```text
KCPROPOSAL1
targets=6
replacements=21

REPLACE docs/PRODUCT_KNOWLEDGE.md :: section `### Pointage authority and access foundation` through before `### Local POS and Site Agent`
### Pointage authority, access and usable raw clocking

- Precise normative ownership and behavioral boundaries:
  `openspec/specs/pointage/authority-foundation/spec.md`
- Precise normative credential, continuation and authorization behavior:
  `openspec/specs/authorization/pointage/spec.md`
- Precise normative raw-clocking behavior:
  `openspec/specs/pointage/raw-clocking/spec.md`
- Current implementation: portable primitives in `packages/auth`, guarded
  credential/raw-event/receipt/continuation persistence in `packages/db-cloud`,
  and employee transport/UI plus server composition in `apps/backoffice`
- Employee page and QA evidence:
  `docs/ui/pages/backoffice-pointage-employee/README.md`
- Personnel relationship: `docs/features/personnel/README.md`
- Security architecture: `docs/architecture/AUTHENTICATION.md`

The cloud/online authority foundation and bounded employee raw-clocking slice
are approved and implemented. The employee route
`/pointage/[establishmentSlug]` supports identification, `CLOCK_IN`,
`CLOCK_OUT`, immutable canonical raw evidence, derived current state/session,
shared-device clearing and a minimal server-only manager read. Browser QA passed
with the three recorded residual lifecycle-evidence limitations.

Canonical production migrations still exclude raw-clocking persistence. The
implemented attendance path remains synthetic/disposable-only; real employee
attendance and production enablement are not authorized. There is no manager UI,
correction, history/total view, Planning/Today/payroll integration, POS/Site
Agent/offline/sync behavior or production trusted-client-address provider.
Legal/privacy gates and trusted production client-address provenance remain
blocked.

REPLACE docs/MODULE_REGISTRY.md :: row starting `| Backoffice        | Pointage foundation`
| Backoffice | Pointage foundation | Cloud/online-only credential, trusted scope, dedicated authorization and Personnel employment-period eligibility foundation; usable raw clocking remains a separate bounded capability | [Pointage authority spec](../openspec/specs/pointage/authority-foundation/spec.md), [Pointage authorization spec](../openspec/specs/authorization/pointage/spec.md), [Authentication](architecture/AUTHENTICATION.md) | [`packages/auth/src/pointage-credential.ts`](../packages/auth/src/pointage-credential.ts), [`packages/db-cloud/src/pointage-repository.ts`](../packages/db-cloud/src/pointage-repository.ts), [`apps/backoffice/src/server/pointage`](../apps/backoffice/src/server/pointage) | `apps/backoffice` | `packages/db-cloud` foundation persistence; raw attendance belongs to the separate usable capability | Pointage -> Personnel lifecycle / Shared Authorization / Tenancy; no downstream/local integration | `APPROVED` | `IMPLEMENTED` | `NOT_ENABLED` | `BLOCKED` | `BLOCKED` — trusted address provenance and legal/privacy gates | `OK` — foundation remains production-disabled; usable raw clocking tracked separately |

REPLACE docs/MODULE_REGISTRY.md :: row starting `| Backoffice        | Pointage usable workflow`
| Backoffice | Pointage usable raw clocking | Bounded employee identification, `CLOCK_IN`/`CLOCK_OUT`, immutable canonical raw events, derived state/session, shared-device UI and minimal server-only manager read | [Raw-clocking spec](../openspec/specs/pointage/raw-clocking/spec.md), [Pointage authorization spec](../openspec/specs/authorization/pointage/spec.md), [employee page pack](ui/pages/backoffice-pointage-employee/README.md) | [`apps/backoffice/src/app/pointage`](../apps/backoffice/src/app/pointage), [`apps/backoffice/src/app/api/pointage`](../apps/backoffice/src/app/api/pointage), [`apps/backoffice/src/server/pointage`](../apps/backoffice/src/server/pointage), [`packages/db-cloud/src/pointage-raw-clocking-repository.ts`](../packages/db-cloud/src/pointage-raw-clocking-repository.ts) | `apps/backoffice` | Pointage owns raw attendance; raw tables/roles remain guarded synthetic/disposable test extension only | Pointage -> Personnel lifecycle / Shared Authorization / Tenancy; no Today, Planning, payroll or local integration | `APPROVED` | `IMPLEMENTED` | `NOT_ENABLED` | `BLOCKED` | `BLOCKED` — seven legal/privacy/provenance gates | `OK` — Browser QA passed with bounded residual limitations; real attendance and production enablement unauthorized |

REPLACE docs/CURRENT_STATE.md :: table row starting `| Pointage foundation`
| Pointage | The cloud/online authority foundation and bounded employee raw-clocking slice are approved and implemented: dedicated credential/continuation authority, `/pointage/[establishmentSlug]`, `CLOCK_IN`/`CLOCK_OUT`, immutable canonical raw evidence, derived state/session, shared-device behavior and a minimal server-only manager read. Browser QA passed with three bounded residual lifecycle-evidence limitations. Canonical production migrations exclude raw-clocking persistence; real attendance and production enablement remain blocked. | [Pointage authority spec](../openspec/specs/pointage/authority-foundation/spec.md), [Pointage authorization spec](../openspec/specs/authorization/pointage/spec.md), [raw-clocking spec](../openspec/specs/pointage/raw-clocking/spec.md), [employee page pack](ui/pages/backoffice-pointage-employee/README.md), [Authentication](architecture/AUTHENTICATION.md), and [Module Registry](MODULE_REGISTRY.md). |

REPLACE docs/CURRENT_STATE.md :: planned-placeholders bullet containing `usable Pointage clocking workflow`
- **Planned placeholders:** Planning, Tâches du jour, Technical Sheets, and
  the additional planned surfaces below are not implemented merely because a
  route or navigation item exists. Pointage raw clocking is a separate bounded
  implemented slice; this does not implement Planning, Today aggregation,
  corrections, payroll or another planned surface.

REPLACE docs/CURRENT_STATE.md :: unresolved row starting `| Planning / Pointage / Tâches du jour`
| Planning / Tâches du jour | Their source-module Product Decisions remain unresolved where currently recorded, and no current Personnel or Today integration with them is implemented. ADR-005 separately approves future Today aggregation of Tâches du jour / operational tasks and actionable Pointage anomalies; that intent does not implement either integration. The bounded Pointage source capability is approved and implemented separately, but has no Today, Planning or payroll integration. |

REPLACE docs/features/personnel/README.md :: future-or-proposed-scope bullet starting `- Planning, the usable Pointage clocking workflow`
- Planning and Tâches du jour remain planned surfaces with unresolved Product
  Decision status. Pointage has a separately approved and implemented bounded
  employee raw-clocking slice with `CLOCK_IN`/`CLOCK_OUT`, immutable raw
  attendance evidence and derived sessions; it is not a Personnel workflow.
  This does not implement corrections or Planning/Today/payroll integration.
  Real employee attendance and production enablement remain `NOT_AUTHORIZED`;
  all seven legal/privacy/provenance blockers remain unresolved.

REPLACE docs/features/personnel/README.md :: capability row `Pointage authority/access foundation`
| Pointage authority/access foundation | Implemented cloud foundation reads the scoped Personnel dossier and employment period without transferring ownership or writing Personnel state; no Today integration. |

REPLACE docs/features/personnel/README.md :: capability row `Future usable Pointage workflow`
| Pointage usable raw clocking | Implemented bounded employee route and raw-clocking service recheck current Personnel eligibility; Pointage owns immutable raw attendance evidence. Real attendance and production remain unauthorized. |

REPLACE docs/features/personnel/README.md :: lifecycle row `Pointage authority/access foundation`
| Pointage authority/access foundation | `APPROVED` | `IMPLEMENTED` | `NOT_ENABLED` | `BLOCKED` | `BLOCKED` — trusted production client-address provenance and legal/privacy gates | `OK` — bounded foundation only; no readiness promotion |

REPLACE docs/features/personnel/README.md :: lifecycle row `Future usable Pointage workflow`
| Pointage usable raw clocking | `APPROVED` | `IMPLEMENTED` | `NOT_ENABLED` | `BLOCKED` | `BLOCKED` — trusted production client-address provenance and six legal/privacy gates | `OK` — synthetic/disposable evidence only; real attendance unauthorized |

REPLACE docs/features/personnel/README.md :: business-boundary paragraph starting `- The Pointage authority/access foundation`
- Pointage authority and usable raw clocking read only the trusted scoped
  Personnel dossier, display-name projection and employment period. Personnel
  remains the canonical employee/lifecycle source; Pointage credentials,
  continuations and raw events do not create a second employee identity or
  write Personnel state. Pointage owns immutable actual-work evidence. Planning,
  corrections, payroll, Tâches du jour and Today integration remain separately
  reviewable and are not implemented by this slice.

REPLACE docs/features/personnel/README.md :: related-module row starting `| Pointage              | The server-only foundation`
| Pointage | The foundation and bounded employee raw-clocking slice resolve trusted scoped dossier/employment period and minimal display name; they do not write Personnel or integrate Today. | Personnel owns employee dossier/lifecycle; Pointage owns its credentials/authority and immutable raw actual-work evidence. Planning, corrections and downstream integrations require separate approval. |

REPLACE docs/features/personnel/README.md :: limitation paragraph starting `- Planning, the usable Pointage workflow`
- Planning and Tâches du jour are not implemented Personnel capabilities merely
  because routes or navigation entries exist. Pointage now has a bounded usable
  employee raw-clocking slice, but it remains a separate capability: it does not
  add a Personnel workflow, correction, history/total view, Today/Planning/
  payroll integration, real-attendance authorization or production readiness.

REPLACE docs/ui/pages/backoffice-pointage-employee/README.md :: status line
Status: IMPLEMENTED / VERIFIED / BROWSER-QA-PASS — production blocked

REPLACE docs/ui/pages/backoffice-pointage-employee/README.md :: package-status line
Package status: `implemented`

REPLACE docs/ui/pages/backoffice-pointage-employee/README.md :: current-implementation section body
The employee route `/pointage/[establishmentSlug]`, employee Pointage UI,
Pointage-specific continuation and employee transport/API endpoints are
implemented, formally verified and Browser-QA-evidenced. The browser keeps the
continuation only in memory for the current interaction; it does not durably
store the plaintext credential, trusted employee context or employee identity.
Immutable raw events exist as the canonical attendance evidence in the approved
guarded synthetic/disposable implementation.

Mandatory Browser QA passed in Microsoft Edge with zero Product failures and
the accepted residual evidence limitations for genuine hidden/background
lifecycle, BFCache triggering and independently observable absolute expiry.
Production enablement and real employee attendance remain `NOT_AUTHORIZED`;
trusted production client-address provenance and the other six legal/privacy
blockers remain unresolved. Package status is `implemented`, not
`PRODUCTION_READY`.

REPLACE docs/ui/pages/backoffice-pointage-employee/README.md :: Technical Design link
[Archived Technical Design](../../../../openspec/changes/archive/2026-09-23-pointage-usable-raw-clocking/design.md)

REPLACE docs/ui/pages/backoffice-pointage-employee/README.md :: delivery checkpoint in Design approval
The completed delivery preserved the approved Product/UI/Design behavior.
All 32 Apply tasks, formal Technical Implementation Compliance, formal VERIFY
and mandatory Browser QA passed. The exact change is archived at
`openspec/changes/archive/2026-09-23-pointage-usable-raw-clocking`.

Current repository checkpoint: Gate 3 approved; Specs synced and strictly
validated; change archived. Production enablement and real employee attendance
remain `NOT_AUTHORIZED`. Package status is `implemented` because final
functional/regression and visual/browser evidence is complete; this status does
not promote production readiness.

REPLACE docs/ui/pages/backoffice-pointage-employee/README.md :: Final delivery and as-built status body
Implementation: COMPLETE (32/32).
Technical Implementation Compliance: PASS.
Formal VERIFY: PASS.
Visual/browser evidence: PASS with three accepted residual evidence limitations.
Gate 3: APPROVED.
Main Specs: SYNCED / STRICTLY VALIDATED.
Archived change: `2026-09-23-pointage-usable-raw-clocking`.
As-built technical documentation status: CURRENT after approved consolidation.
Real employee attendance: NOT_AUTHORIZED.
Production enablement: NOT_AUTHORIZED.
Seven legal/privacy/provenance blockers: UNRESOLVED.

REPLACE docs/architecture/AUTHENTICATION.md :: first paragraph under `## Pointage authority and raw-clocking consumer`
The Backoffice cloud runtime contains the server-only Pointage authentication
and authorization foundation plus the implemented employee raw-clocking
consumer at `/pointage/[establishmentSlug]`. The implementation, formal VERIFY
and Browser QA cover strict employee transport, a Pointage-specific
continuation, immutable raw-event/receipt behavior, derived current state, the
shared-device UI, and the bounded server-only manager read. Browser QA passed
with the accepted residual evidence limitations for hidden/background
lifecycle, BFCache triggering and independently observable absolute expiry.
This is implemented but not production-enabled: real employee attendance is
not authorized, and no production trusted-client-address provider exists.
```

<!-- PROPOSED_DIFF_BYTES_END -->

Replacement count: exactly 21.

## 5. Review boundary

This packet replaces the superseded 20-replacement proposal and requires a new
explicit human approval on its own exact hash. Approval may authorize only the
same six hash-locked targets and exact 21-replacement payload above. Branch B
must recompute all six target hashes and the exact revised proposed-diff
payload hash; any drift invalidates this packet.

After approved apply, verify the complete targets, run scoped formatting
diagnostics without formatter-writing the six targets, then run
`pnpm docs:check` and `pnpm architecture:check`.

No deployment, database operation, production provider, real attendance,
production enablement, lifecycle promotion, re-sync or re-archive is authorized.

## 6. Approved apply and completion evidence

The current-user decision approved the revised packet SHA-256
`d43a5c80f6abbb7fea174c3037e75c06b5c899f834420fd450bbdc909cfab1cc`
and payload SHA-256
`e84ea437f95e763c910261a4d0df60558d88ea8102a0298a10602f0a6ab03c13`.
All six baseline hashes in section 3 matched before writing. Exactly 21
replacements were applied in packet order to exactly those six targets. Each
complete target matched the byte-for-byte expected in-memory output; target-
native line endings and all bytes outside replacement regions were preserved.
The Personnel `Future or proposed scope` omission was corrected by the added
replacement. No seventh Knowledge target or 22nd replacement was introduced.

| Applied target                                         | Post-apply exact-byte SHA-256                                      |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/PRODUCT_KNOWLEDGE.md`                            | `33c7498883a1c8405612aeedbe6e1ab906abcd096860153b1aa77a17963a3f67` |
| `docs/MODULE_REGISTRY.md`                              | `9c454d370e50e6c5950d03a9614ee14699d42640aa05e9e3bbbae6320457c764` |
| `docs/CURRENT_STATE.md`                                | `fb333c2ee1a62a6c164032b00c6f783a74cbb1ab367db73459586a2fc338bf6b` |
| `docs/features/personnel/README.md`                    | `e65055c69904b0f81c603dbf7a29ee790ba98ccb430cdf8a6f5d489028a6bae2` |
| `docs/ui/pages/backoffice-pointage-employee/README.md` | `17ece99411d9e0c22e79366ae1f15e0158899268128e87ba5ec56c79046e8ce0` |
| `docs/architecture/AUTHENTICATION.md`                  | `db523eb430039583ad62f378205e760e8042e4a4ef8a683d8711385149ff97a7` |

Validation on 2026-09-23:

- `pnpm exec prettier --check` on the six targets and this packet: diagnostic
  exit 1. The hash-locked exact proposal is not formatter-written. Before
  Apply, `PRODUCT_KNOWLEDGE.md` and Personnel README already warned; after
  Apply, those two plus `MODULE_REGISTRY.md` and `CURRENT_STATE.md` warned.
  This is a recorded check-only style diagnostic, not a content/architecture
  validation pass or permission to alter approved replacement bytes.
- `pnpm exec prettier --check` on this packet and Gate 3: PASS.
- `pnpm docs:check`: PASS, 36 current documents.
- `pnpm architecture:check`: PASS, including migration baselines.
- `git diff --check` on the six target paths: PASS; Git emitted only its
  existing LF-to-CRLF working-copy advisory on four paths.
- Exact output-byte equality and six post-apply SHA-256 checks: PASS.

The normative main Specs retain their synced hashes, the active change is
absent, and the recorded archive remains present. No Product source, tests,
Design, Spec, schema, or migration was modified by this Knowledge apply.
Canonical migration terminal remains `0020_formalites_legal_template_foundation`;
Pointage 0021 remains a test-only fixture. Implementation workflow is `DONE`,
but production readiness is `BLOCKED`. Retention duration,
deletion/anonymization, legal hold, backup-retention interaction, employee
notice, detailed audit visibility and trusted production client-address
provenance remain unresolved. No real employee attendance or production
enablement is authorized.

Completed: 2026-09-23T13:53:02Z
KNOWLEDGE_CONSOLIDATION: COMPLETE
FINISH_CHANGE: COMPLETE
WORKFLOW_STATUS: DONE

RELEASE_FOLLOW_UP: NOT_REQUIRED
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

KNOWLEDGE CONSOLIDATION REVIEW
Review status: APPROVED
Workflow status: DONE
