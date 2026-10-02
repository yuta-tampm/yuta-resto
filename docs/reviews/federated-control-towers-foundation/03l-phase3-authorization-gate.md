# Human decision recorded after review

Decision: `AUTHORIZE APPLY PHASE 3` (`AUTHORIZE_APPLY_PHASE_3`).
Source: exact current-user decision relayed to YUTA Control Tower in Bridge round 115; valid bounded execution command `BRIDGE-ARCH-20260925-F9R2:116` followed.
Approved pre-decision packet SHA-256: `0259392694524233c6344bdd36753400be1d3e48669f241d4fa884552d779b73`.
Authorization: Phase 3 / T10–T14 only. This review record is not runtime Human Gate authority and does not authorize live tower activation or Phase 4–6.

---

# Federated Control Towers — Phase 3 Apply Human Gate

Change: `federated-control-towers-foundation`

Status: `AWAITING_HUMAN_REVIEW`
Prepared from YUTA Control Tower command `BRIDGE-ARCH-20260925-F9R2:114`. This packet requests a separate Human decision; its existence does not authorize Apply. Phase 3 remains `NOT_AUTHORIZED`, T10–T14 remain unchecked, and progress remains 9/24.

## Exact reviewed baseline

| Artifact                               | SHA-256                                                            | Meaning                                                                             |
| -------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Gate 2 delta Spec                      | `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` | Approved scope; unchanged.                                                          |
| Current Design                         | `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77` | Approved current contract.                                                          |
| Design approval review `03g`           | `ed55d3101dab53c2dc00d051a2c527ba8d7875a59ccebf2d756dd1c81b5bc60a` | Current-user approval relayed in Bridge round 105.                                  |
| Sensitive Design approval review `03h` | `86fa4ed037beb7fe60f0ea63a50efd1b993701950caf951e314abc4398eb3d7c` | Current-user approval relayed in Bridge round 107.                                  |
| Tasks/TIC approval review `03i`        | `98746bf1667eeea82b029ac62166fe3114b9b69beb06fd4790e91918e5a9a7b3` | Current-user approval relayed in Bridge round 109.                                  |
| Helper authorization review `03j`      | `fe3392197b2e0fa486a98b53d4c001d1802acfb2637d1b4f59372ba2dab86862` | Exact bounded helper authorization relayed in Bridge round 111.                     |
| Helper convergence evidence `03k`      | `481603b29f22e313f51ce4fb0d2fbd8da58d05b01158f919c48302979f03acf5` | Round 112 correction; round 113 accepted bounded synthetic convergence, 83/83 PASS. |
| Current `state-helper.ps1`             | `8db153def5189fdc69a78350437280a963531a8e8b091d94307d0d88476feb31` | Accepted helper baseline for Phase 3.                                               |
| Current `tasks.md`                     | `517de3a6dfc211579968e4725b108192a3ba8f9190fb05a51054ee0f7d5203d7` | T01–T09 checked; T10–T24 unchecked.                                                 |
| Bridge v1 skill                        | `149e48785980fd16affbade76e7c50957b6ae5f0e7e5f71954f19f4d8031aa3e` | Isolation baseline; its wire grammar and QA are unchanged.                          |

The current-user DEV_USABLE anti-loop directive was relayed in Bridge round 107. It requires deterministic, Design-consistent resolution of ordinary implementation details, with documented assumptions and focused tests when useful. A new planning cycle is reserved for a material risk of (A) duplicate command or Human-authority execution/consumption, (B) bypassed, forged, unsupported or misbound Human Gate approval, or (C) multiple executable Control Towers for one execution context. Historical `FAIL`/`BLOCKED` evidence remains historical; acceptance criteria are not weakened.

## Apply scope if separately authorized

Only Phase 3 / T10–T14 of the approved Tasks/TIC may proceed. The three implementation owners remain `.agents/skills/yuta-federated-control-towers/SKILL.md`, `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`, and `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`; bounded change/review/evidence artifacts and isolated ignored synthetic local state may support the work. Preserve unrelated dirty and untracked changes. No other implementation owner is approved by this packet.

1. **T10 / Task 3.1:** Bind the federated skill to helper preflight and the exact visible Project, title, URL and conversation before every send. Preserve Bridge v1 grammar, six delivery states, `RUN_ID`/`ROUND_ID`/`COMMAND_ID`/`CAUSAL_LINEAGE_ID`, one outstanding command and at-most-once behavior. Provide static trace and safe local fixtures for wrong target, prose, stale/replayed command and uncertain delivery.
2. **T11 / Task 3.2:** Implement the first Human-approved exact-target lifecycle: `INACTIVE → ACTIVATING →` read-only fresh handshake/command/result/evaluation probe `→ ACTIVE` only after a verified commit. A probe is evidence, not execution authority. Do not activate a real tower during Phase 3 Apply without a separate exact Human live-target decision and later QA authorization.
3. **T12 / Task 3.3:** Implement ordered `ACTIVE → FENCING → TERMINAL|REVOKED`, immutable handoff, a fresh target `RUN_ID`, Page→Global escalation and approved Page/Global instance rotation. Old epoch/instance must be denied before new executable authority. Preserve lineage, budgets, active freezes, consumed authority proofs, pending command, blocker ancestry and evidence-stop across transfer.
4. **T13 / Task 3.4:** Implement recovery/stop for the approved nine crash windows, session loss, delivery/execution uncertainty, mismatched canonical sources and `PAGE_CONTEXT_INTAKE` `AVAILABLE`, `PARTIAL`, `UNKNOWN` and `NOT_APPLICABLE`. No timeout-based resend or invented Product decision.
5. **T14 / Task 3.5:** Inspect exact scoped diff, owner allowlist, hashes, privacy, unchanged Bridge v1 grammar and unchanged Workflow v3/Page Chat authority. Run targeted repository checks and report post-Apply evidence before later formal Technical Compliance, VERIFY or Federated Browser QA.

## Authority, safety and evidence boundaries

There is exactly one executable `ACTIVE_CONTROL_TOWER` per supported execution context. Ambiguous or conflicting authority means zero executable authority until reviewed reconciliation. The owning Page Chat remains Product/shaping authority for `PAGE_LOCAL`; the Global Control Tower coordinates `CROSS_MODULE`, `UNCERTAIN`, shared, cross-page and foundation concerns under Workflow v3. Human Gates remain Human decisions; Codex is executor/evidence collector. Missing Page Chat context, including `PAGE_CONTEXT_INTAKE: UNKNOWN`, never means there are no prior requirements. Codex does not directly orchestrate Page Chats.

A tower-instance transfer requires a fresh `RUN_ID`; same-run switching is forbidden. The old tower must be fenced before the new tower gains executable authority. Immutable handoff transfers verified evidence and does not itself grant authority. No dual execution or budget reset is allowed. The existing helper contract stays intact: `CURRENT_ACTIVE_FREEZES`, `CONSUMED_AUTHORITY_PROOFS`, `AUTHORITY_CONSUMED` journal commit point, consumed-proof replay protection, exact freeze transitions, approval-token mapping, Exact Accepted Result chain, strict-positive maximum exception, reviewed SAME/DISTINCT classification, `PENDING_COMMAND_ID`, `EXECUTION_UNCERTAIN`, `EVIDENCE_STOP`, privacy allowlist and isolated SelfTest. Do not resend when delivery or execution is uncertain.

The supported runtime boundary remains one Windows host, one canonical NTFS checkout and the approved helper. Cross-host coordination is unsupported. Do not add Product behavior, modules, permissions, auth, API, database/schema, provider operations, deployment configuration, cryptographic Human attestation, Page Chat Product decisions, Bridge v1 wire changes or Workflow v3 authority changes. Do not commit, push, create a PR, merge, deploy or release.

Phase 3 implementation and synthetic local checks do not prove a live browser target, real Page/Global orchestration, escalation or rotation. Live operations require their later explicit Human/QA boundaries. Phase 3 output must report T10–T14 separately, changed files, owner allowlist, test commands/results and any A/B/C stop; browser/live operations, formal Technical Compliance, formal VERIFY and Federated Browser QA remain `NOT_RUN` unless separately authorized. Gate 3 remains `NOT_READY` until all later required stages pass. If an A/B/C issue appears, stop with `NEEDS_REVIEW` rather than weakening the contract.

## Exact Human decision boundary

The labels follow the existing `AUTHORIZE APPLY PHASE 1` / `AUTHORIZE APPLY PHASE 2` convention and the historical Phase-3 scope-change decision recorded in `02f`. Choose exactly one for this packet:

1. `AUTHORIZE APPLY PHASE 3`
2. `REQUEST APPLY PHASE 3 SCOPE CHANGES`
3. `DEFER APPLY PHASE 3`

Corresponding normalized `CURRENT_USER_DECISION` tokens, in the same order:

1. `AUTHORIZE_APPLY_PHASE_3`
2. `REQUEST_APPLY_PHASE_3_SCOPE_CHANGES`
3. `DEFER_APPLY_PHASE_3`

These labels and tokens are unique within this packet. No decision is inferred from round-113 acceptance, this packet, earlier phase authorizations or synthetic tests. Remain `AWAITING_HUMAN_REVIEW` until the exact current-user choice is relayed in a valid bound Bridge result. This review packet is not itself runtime Human Gate authority.
