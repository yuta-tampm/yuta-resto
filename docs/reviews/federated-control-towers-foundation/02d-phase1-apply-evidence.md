# Phase 1 Apply evidence — Federated Control Towers foundation

Change: `federated-control-towers-foundation`

Scope: only T01–T04, explicitly authorized by the current user as `AUTHORIZE APPLY PHASE 1` and relayed in bridge result `BRIDGE-ARCH-20260925-F9R2:17`.

Phase 2–6: `NOT_AUTHORIZED`.

Formal VERIFY and Federated Browser QA: `NOT_RUN`.

## T01 preflight and baseline

- Approved pre-Apply Tasks SHA-256: `6e022cfbb1cacef0464888a4974a86cb379e80d17b856423ab40a2d83fe723a6` — MATCH.
- Approved Tasks/TIC review packet SHA-256: `50934fd8ea28e9f262f8a85e30a9d36e834cfbb7588b0fb53d30e11d366a598a` — MATCH.
- Approved Design SHA-256: `5235f719d253e487766f5e6fb6302183ed17a3eaa9b2ad52208c0f7336608ec9` — MATCH.
- Approved Sensitive Design packet SHA-256: `2eec7f8a2222e3d44b2e785ab3a791805b6681c3877f360e9910116ee7eb87c5` — MATCH.
- Approved delta Spec SHA-256: `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0` — MATCH.
- Root `AGENTS.md` and `docs/README.md`, `docs/CURRENT_STATE.md`, `docs/AUTHORITY_MODEL.md`, `docs/YUTA_WORKFLOW_V3.md`, and current workflow authority were inspected. No nested `AGENTS.md` was found under `.agents`, `docs`, or `openspec`.
- `git rev-parse --show-toplevel` and full-path normalization both resolved to `D:\working\yuta\yuta-resto`. The root and inspected ancestor directories have no reparse-point/link attribute. Windows platform: `Win32NT`. Drive D: is local (`DriveType 3`) NTFS. Host label observed: `DESKTOP-2SON6M9`, diagnostic only; it is not cross-host fencing proof.
- `.gitignore` contains `/tmp/`. `tmp/yuta-federated-control-towers/` did not exist. All three future implementation owner files/paths were absent before Phase 1.
- Existing repo skill conventions use Markdown `SKILL.md` with YAML frontmatter. No PowerShell `.ps1` test harness was found in `.agents` or `scripts`; Phase 1 will use bounded in-memory helper invocations and PowerShell parse checks, without adding a test framework or owner.
- Unrelated dirty/untracked baseline was present before this phase: Backoffice review-reply form/test, Control Tower Bridge v1 skill/prompt/reviews/change, repository-format-policy artifacts, review-reply-form, vlock, reputation spec, and other listed workspace changes. They are outside the implementation allowlist and must remain untouched.
- Bridge v1 baseline hashes: skill `149e48785980fd16affbade76e7c50957b6ae5f0e7e5f71954f19f4d8031aa3e`; tracked Control Tower prompt `4f65c0c132ebe566c8fc9094582e8cf2c3cfbe784e2fa8f3b8a3915f3fc92558`; Browser QA report `6a3a7979b64617cb30d162f5a6e5ca853ad26d2bd084f01339023e8f475c8d83`.

These checks establish a supported local static-development environment. They do **not** prove runtime exclusivity, absence of another host, lock lifetime, activation safety, or federated live behavior. Phase 1 does not create or acquire a runtime lock or state.

## Task progress and evidence

| Task      | Status   | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T01 / 1.1 | COMPLETE | Preflight and baseline above; approved hashes, Windows/NTFS/canonical checkout and conventions checked.                                                                                                                                                                                                                                                                                                                                                               |
| T02 / 1.2 | COMPLETE | Created the exact static skill and tracked protocol owners; reviewed mode, structured role/scope/instance, PAGE_LOCAL Page Chat authority, Global escalation, exact target, Human live-context update, privacy, and non-activation against D1/D7/D8 and F1–F3/F12–F14. Scoped Prettier check found both unchanged.                                                                                                                                                    |
| T03 / 1.3 | COMPLETE | Created only the approved `state-helper.ps1` owner. Read-only `Preflight`, `DescribeSchemas`, `ValidateActivation`, `ValidateJournal`, `ValidateHandoff`, and in-memory `SelfTest` parse canonical version-1 records, exact identity fields, ordinal-sorted canonical JSON/SHA-256, approved host/checkout and reserved lock path as a string. Valid in-memory activation genesis, handoff and journal fixtures passed. No runtime path, lock, or record was created. |
| T04 / 1.4 | COMPLETE | PowerShell parser: zero errors. In-memory `SelfTest`: 24/24 pass, including malformed/duplicate/missing/unknown fields, nested duplicate/sensitive fields, activation/journal/handoff hash mismatch, wrong host/checkout, inconsistent `ACTIVE`, stale target run/epoch, and handoff self-approval rejection. Strict OpenSpec, docs, architecture and scoped format checks passed.                                                                                    |

No implementation owner, runtime state, lock or live tower was created at the T01 checkpoint.

## Phase 1 static test provenance

- `pwsh` 7.6.5 ran PowerShell's own `[System.Management.Automation.Language.Parser]::ParseFile` on the new helper: zero parse errors.
- `& .agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1 -Action Preflight -ExpectedCheckoutRoot 'D:\working\yuta\yuta-resto' -ExpectedHostLabel $env:COMPUTERNAME -ExecutionContextId 'FED-QA-PHASE1'`: `Valid=true`, Windows/local NTFS/canonical root checked. The returned `ReservedStatePath` and `ReservedLockPath` were strings only.
- `& .agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1 -Action SelfTest` with the same exact binding: 24/24 in-memory checks passed. Three valid schema fixtures were an `INACTIVE` genesis activation, a Global rotation handoff with fresh target run and epoch, and a journal genesis event. Negative fixtures covered malformed JSON; duplicate, nested duplicate, missing and unknown fields; sensitive field names at root and nested levels; activation, journal and handoff hash mismatches; unsupported event kind; wrong preflight and record host/checkout; `ACTIVE` without selected target; reused target `RUN_ID`; wrong target epoch; and self-approved handoff action.
- `pnpm exec openspec validate federated-control-towers-foundation --strict`: PASS.
- `pnpm docs:check`: PASS (36 current documents).
- `pnpm architecture:check`: PASS.
- `pnpm exec prettier --check` scoped to the two Markdown owner files, `tasks.md`, and this evidence file: PASS.
- Typecheck, build, formal Technical Compliance, formal VERIFY, and Federated Browser QA were not run. Phase 1 changes no TypeScript/Product runtime; Phase 2–6 and live federation are not authorized.

## Scoped change and authority boundary

New implementation owners: `.agents/skills/yuta-federated-control-towers/SKILL.md`, `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`, `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`. The static helper has no file or directory creation, lock acquisition, browser transport, activation transition, or persistence action. `openspec/changes/federated-control-towers-foundation/tasks.md` records the exact Phase 1 authorization and checks T01–T04 only. This review evidence file is the sole new review artifact. No Phase 2–6 task was checked.

`tmp/yuta-federated-control-towers/` was absent after helper/test execution; no activation, journal, handoff, ledger or lock was created. No Page/Global tower or live conversation was changed. Bridge v1 owner files and QA report matched their T01 baseline hashes at Phase 1 close. There is no `NEEDS_REVIEW` condition from the approved single-host/static boundary.

Final implementation-owner SHA-256 values:

| Owner path                                                              | SHA-256                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `.agents/skills/yuta-federated-control-towers/SKILL.md`                 | `58272d40f76b165d366c4f3dda8d5b6da492bf9a0817baae34578a9c13238b3a` |
| `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1` | `3ab80a304ab8393061d4766addaaf53a3cca9e946ba56a057d498924dcbab88b` |
| `docs/chatGPT/YUTA_FEDERATED_CONTROL_TOWERS_OPERATING_PROTOCOL.md`      | `44119d894dfe16396a72bd305cef29601a462bef9b2d63c9fc96aa0246026eee` |

Tasks progress: 4/24 checked, 20/24 unchecked. `tasks.md` SHA-256 after Phase 1: `2d950bb8adf260e49768a77b3991b0ca923f15d3b7bf6715b59906de2ef12b35`. Scoped implementation diff is exactly the three new owner files; task-progress diff is the Phase 1 authorization header plus T01–T04 checkboxes; review diff is this new evidence file. The existing Tasks/TIC contract for Phase 2–6, approved Spec/Design, Workflow v3, Bridge v1, Page Chat rules and Product owners were not edited.

These results do not prove lock exclusivity, activation/fencing linearization, durable file writes, handoff consumption, command replay protection, crash recovery, live target identity, or Browser QA. Phase 2 eligibility requires a separate current-user authorization; Phase 1 completion does not confer it.
