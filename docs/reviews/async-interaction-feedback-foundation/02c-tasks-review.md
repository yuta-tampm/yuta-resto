# Tasks + Implementation Plan Review

Change: `async-interaction-feedback-foundation`

Gate: `Tasks / Pre-Apply`

Review status: `APPROVED`

Approval source: `explicit current-user instruction`

Approval recorded by: `Codex workflow`

Approved: `2026-09-06T18:44:08.8431803+02:00`

Created: `2026-09-06T18:35:58.4980436+02:00`

Schema: `yuta-spec-driven`

Classification: `CROSS_MODULE`

Strategy: `Strategy B — shared foundation + bounded Backoffice adoption`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES`

Tasks: `APPROVED`

Implementation Plan: `APPROVED`

Technical Implementation Contracts: `APPROVED`

Apply: `AUTHORIZED`

Production: `NOT_AUTHORIZED`

## Approved Authority and Exact Integrity

| Artifact                                                                                                   | SHA-256                                                            | Status                                                               |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `openspec/changes/async-interaction-feedback-foundation/proposal.md`                                       | `c973917e01917c17bb9399330312a9c7b7003ae920a11f0e0e50f876d879908e` | Gate 1 approved, unchanged                                           |
| `openspec/changes/async-interaction-feedback-foundation/analysis.md`                                       | `7535665d3bfac7bc328217fa418d045750eaeaa4d8da852613a351b030f3df39` | Gate 1 approved, unchanged                                           |
| `openspec/changes/async-interaction-feedback-foundation/specs/frontend/async-interaction-feedback/spec.md` | `46840b69a936b96e9e6c49bee6330ea1a6206774f7aea7483dbabda4f159cb8e` | Gate 2 approved; 10 Requirements / 29 Scenarios                      |
| `openspec/changes/async-interaction-feedback-foundation/design.md`                                         | `0aa7c42257e6e9e11827c1e41a1d8dd61e96cc5391561ba75e51cbe546224138` | Design approved, exact current-user hash matched                     |
| `docs/reviews/async-interaction-feedback-foundation/02b-design-review.md`                                  | `52a893cf59c6169fb0cf2897a10910903ea054c1539a635007b2f42ac99dc5c9` | Approval metadata and record updated; embedded Design body unchanged |
| `openspec/changes/async-interaction-feedback-foundation/tasks.md`                                          | `20b49c57bf72341e4232b642f8fed2fc4b48643a41f7b6366c3b1692460e73fd` | 19 unchecked tasks; awaiting review                                  |

Hashes are lowercase SHA-256 of exact formatted bytes. All implementation checkboxes remain unchecked. The Design was rehashed before Tasks creation and matched the exact approved value.

## Selected Implementation Phases

| Phase                       | Why required                                                                                                        | Owner                                              | Human stop                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| 1. UI / Components          | Establish the package-owned native Button busy contract and only the approved Google/logout presentation components | `packages/ui`, `apps/backoffice`                   | Shared contract and exact-file diff must pass before interaction evidence |
| 2. Interaction / States     | Verify each pilot's own pending, outcome, recovery and accessibility ownership without unifying state machines      | `apps/backoffice` and existing route/domain owners | Focused tests and Formalités non-regression must pass before integration  |
| 3. Integration / Regression | Combine technical regression, mandatory responsive Browser QA and future Verify traceability                        | `packages/ui`, `apps/backoffice`, review owner     | Gate 3 only after Compliance, Verify and QA independently pass            |

`Foundation / Data` and `Service / Domain` are absent. Discovery of work in either area is not an invitation to add a phase; it is a boundary stop.

## Requirement Coverage

| Approved requirement                             | Primary tasks         | Future evidence  |
| ------------------------------------------------ | --------------------- | ---------------- |
| Mutation Pending Feedback                        | 1.4–1.5, 2.1–2.4      | 3.1, 3.4–3.7     |
| Duplicate Activation Prevention                  | 1.3–1.5, 2.2–2.3      | 3.1, 3.4–3.6     |
| Accessible Pending Semantics                     | 1.2–1.5, 2.1–2.3, 2.6 | 3.4–3.7          |
| Delegated and Non-Native Control Boundary        | 1.2–1.3               | 3.3, 3.7         |
| Error and Recovery Feedback                      | 2.1–2.4, 2.6          | 3.4–3.7          |
| Authoritative Success Feedback                   | 1.4–1.5, 2.1–2.4      | 3.4–3.7          |
| Custom-State Compatibility and Domain Precedence | 2.4–2.5               | 3.1, 3.4–3.7     |
| Shared Primitive Pending Contract                | 1.1–1.3               | 3.1–3.3, 3.7     |
| Bounded Backoffice Pilot Adoption                | 1.4–1.5, 2.1–2.5      | 3.1, 3.4–3.7     |
| Cross-Module Ownership Guardrail                 | Every phase contract  | 3.2–3.3, 3.7–3.8 |

All 10 Requirements / 29 Scenarios have a bounded implementation or non-regression path. Scenario groups remain in their owning pilot rather than being duplicated as 29 artificial tasks.

## Design Coverage

| Design area                                    | Planned tasks                     | Binding outcome                                                             |
| ---------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| D1 — narrow native `Button loading` extension  | 1.1–1.3                           | Derived busy semantic only; children and existing native contract preserved |
| D2 — delegated boundary                        | 1.2–1.3, 3.3                      | No normative `asChild + loading` guarantee; zero current consumer inventory |
| D3 — compose existing primitives               | 1.4–1.5                           | `Button`/`IconButton` reused; no new primitive                              |
| D4 — local truthful accessibility              | 2.1–2.3, 2.6, 3.5                 | Action-specific meaning; no global live/focus abstraction                   |
| D5 — smallest client boundaries                | 1.4–1.5                           | Google route-local and logout shell-local islands only                      |
| D6 — preserve outcomes and duplicate semantics | 2.1–2.5                           | Existing return/redirect/custom-state authority remains intact              |
| Four-pilot adoption table                      | 1.4–1.5, 2.1–2.5                  | Exact categories retained; no extra page adoption                           |
| Testing strategy                               | 1.1–1.3, 2.1–2.6, 3.1–3.3         | Package-local UI test plus current Backoffice Vitest patterns               |
| Compatibility and stop conditions              | all phase contracts, 3.3, 3.7–3.8 | No migration; Control Tower on durable/runtime boundary                     |

## Exact Intended Files

### Modify

- `packages/ui/src/button.tsx`
- `packages/ui/package.json`
- `pnpm-lock.yaml`
- `apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx`
- `apps/backoffice/src/components/backoffice/backoffice-frame.tsx`

### Create

- `packages/ui/test/button.test.tsx`
- `apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx`
- `apps/backoffice/src/components/backoffice/logout-submit-button.tsx`
- `apps/backoffice/test/general-information-form.test.tsx`
- `apps/backoffice/test/google-location-submit-button.test.tsx`
- `apps/backoffice/test/logout-submit-button.test.tsx`

### Execute Unchanged as Compatibility Evidence

- `apps/backoffice/test/formalites-persistent-draft-state.test.ts`
- `apps/backoffice/test/formalites-persistent-draft-component.test.tsx`
- `apps/backoffice/test/tenant-switcher.test.tsx`

### Future Evidence

- `docs/reviews/async-interaction-feedback-foundation/qa/QA_REPORT.md`
- `docs/reviews/async-interaction-feedback-foundation/qa/screenshot-manifest.md`
- `docs/reviews/async-interaction-feedback-foundation/qa/<viewport>-<pilot>-<state>.png`
- `docs/reviews/async-interaction-feedback-foundation/03-final-review.md` only at the separately authorized final review stage

General Information and Formalités production files are explicitly inspect-only. Google and logout Server Actions are explicitly unchanged. The complete allowlist and deviation rules are canonical in `tasks.md`.

## Technical Implementation Contract Review

| Phase                    | Authority and owned boundary                                                                                    | Must preserve                                                                                                             | Stop conditions                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| UI / Components          | Shared primitive, accessibility/delegation, bounded pilot Specs; Design decisions 1–5                           | Button children/native behavior; Google provider/action/redirect; logout session/action/redirect; smallest client islands | Root tooling convention, new primitive/abstraction, delegated guarantee, action/runtime/auth/data change |
| Interaction / States     | Pending, duplicate, error/recovery, authoritative outcome and custom-state Specs; Design pilot/testing sections | Field values, validation, route outcomes, Formalités operation/conflict/retry identity and focus                          | Flattened state machine, changed result taxonomy, operation key, persistence, auth or runtime sequencing |
| Integration / Regression | All Specs; Design compatibility/risks/stops; Workflow v3 and QA protocol                                        | Artifact integrity, safe local data, exact pilot allowlist, separate Compliance/Verify/QA                                 | Artifact drift, unsafe environment, unexpected durable boundary, missing or fabricated evidence          |

Every phase contract in `tasks.md` also names exact files, targeted commands, completion evidence and prohibited additions.

## Pilot Review

1. **Existing-good baseline — General Information:** test-only pilot delta; production form remains unchanged and inherits the Button busy semantic.
2. **Missing feedback — Google location:** one route-local pending submit component; current action, provider behavior, Alerts and redirects remain unchanged.
3. **Shell/navigation — logout:** one shell-local pending submit component; current session revocation and `/connexion` redirect remain unchanged.
4. **Complex compatibility — Formalités:** no production delta; existing tests and Browser QA prove the shared change does not flatten its state machine.

Binding phrase: `SHARED FOUNDATION MUST NOT FLATTEN OR REPLACE ROUTE-SPECIFIC STATE MACHINE`.

## Shared UI Contract Test Wiring

- Location: `packages/ui/test/button.test.tsx`.
- Runner: existing repository Vitest version family, wired only in `@yuta/ui`.
- Full command: `pnpm --filter @yuta/ui test`.
- Focused command: `pnpm --filter @yuta/ui exec vitest run test/button.test.tsx`.
- Manifest/lock scope: `packages/ui/package.json` and `pnpm-lock.yaml`; no root script.
- Direct assertions: native loading disabled/busy/data marker and preserved text; explicit disabled without loading; caller busy state while not loading; no automatic spinner/label replacement.
- Delegated boundary: inventory current consumers and avoid asserting an unsupported native-disabled guarantee for `asChild + loading`.

Current repository evidence supports this wiring: Backoffice and other workspaces already use Vitest, the Backoffice package-local runner resolves, and no root Vitest convention exists. No different framework or Control Tower-level convention is planned.

## Browser QA Plan

Browser QA is mandatory after implementation and before Gate 3.

- Viewports: `1440x900`, `1024x768`, `768x1024`, `390x844`.
- General Information: idle, pending, validation/operation error, confirmed success, keyboard and focus.
- Google: idle, pending before redirect, selected result, invalid/provider failure, responsive cards, keyboard and focus. If no safe provider environment exists, verdict is `BLOCKED_BY_ENVIRONMENT`, never PASS.
- Logout: normal/pending icon semantics, repeated activation prevention, redirect to sign-in, desktop/mobile shell.
- Formalités: pending, uncertain, conflict, retry/recovery, reload, operation identity, focus and authoritative settlement with safe development data.
- Accessibility: action-specific accessible name; native disabled/busy behavior; keyboard activation; local versus region busy semantics; current error association and route-owned focus recovery.
- Evidence: images at `qa/<viewport>-<pilot>-<state>.png`; manifest records route, state, viewport, safe context, timestamp and lowercase SHA-256; `QA_REPORT.md` records a protocol verdict per row.

QA screenshots are evidence, not authority. No production or unsafe provider mutation is authorized for evidence collection.

## Planned Verification Commands

```text
pnpm --filter @yuta/ui exec vitest run test/button.test.tsx
pnpm --filter @yuta/ui test
pnpm --filter @yuta/backoffice exec vitest run test/general-information-form.test.tsx test/google-location-submit-button.test.tsx test/logout-submit-button.test.tsx test/formalites-persistent-draft-state.test.ts test/formalites-persistent-draft-component.test.tsx
pnpm --filter @yuta/backoffice exec vitest run test/tenant-switcher.test.tsx
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice test
pnpm --filter @yuta/backoffice build
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
pnpm format:check
pnpm exec prettier --check <exact changed source-test-artifact paths>
openspec validate async-interaction-feedback-foundation --strict --json
rg -n "<Button[^>]*asChild[^>]*loading|<Button[^>]*loading[^>]*asChild" apps packages
git diff --check
git status --short
```

These are planned Apply/Verify checks, not Tasks-phase execution claims. A repository-wide baseline failure must be recorded separately; it does not authorize unrelated repair.

## Pre-Apply Scoped Cleanliness

Before a future Apply:

1. Match reviewed Proposal, Analysis, Spec, Design and Tasks hashes.
2. Record HEAD and `git status --short`.
3. Require `SCOPED CLEANLINESS`, not an invented globally clean checkout: identify and exclude every unrelated path; review overlap in any intended file before editing.
4. Bind implementation to the exact allowlist; record and review path-only variations before use.
5. Separate baseline failures and generated noise from change failures.
6. Stop on Specs/Design ambiguity or drift; implementation cannot redesign the change.
7. Obtain explicit Apply authority for this exact change and scope. Tasks approval alone remains insufficient.

Current Tasks-phase status is scoped: only `openspec/changes/async-interaction-feedback-foundation/` and `docs/reviews/async-interaction-feedback-foundation/` are reported by `git status --short`, both untracked and attributable to the current planning workflow. No application, package, lockfile or production path was modified.

## Deviation and Boundary Handling

- A minor implementation detail may proceed only when it is presentation-only, within an intended file and fully implied by approved Specs/Design; record it.
- A path variation must be recorded and shown ownership/behavior equivalent before editing.
- A Design decision stops Apply and returns to Design review.
- Any Product, authorization, tenant, security, runtime, API, provider, persistence, transaction or data decision stops with `CONTROL_TOWER_REVIEW_REQUIRED` and, when criteria apply, `SENSITIVE_DESIGN_GATE_REQUIRED`.
- Inexpressible package-local test wiring stops with `DESIGN_IMPLEMENTATION_GAP`.

The Tasks remain within presentation/shared test/adoption boundaries. Current result: `SENSITIVE_DESIGN_GATE_NOT_REQUIRED`; `CONTROL_TOWER_REVIEW_REQUIRED: NO`.

## Verify and Gate 3 Readiness

Tasks 1.1–3.8 are granular enough for a future `TECHNICAL COMPLIANCE MATRIX` to map every Spec requirement/scenario group and Design decision to task, exact code/test path, command, status and evidence.

This packet does not perform Verify or prepare final Gate 3 approval. Gate 3 will separately decide:

1. `TECHNICAL IMPLEMENTATION COMPLIANCE`
2. `VERIFY`
3. `QA`

Because `UI_AFFECTING: YES`, Gate 3 cannot pass without Browser QA `PASS`.

## Tasks-Phase Validation Plan

Only OpenSpec/docs/artifact validation is authorized now:

- `openspec validate async-interaction-feedback-foundation --strict --json`
- `pnpm docs:check`
- scoped Prettier check of `tasks.md`, this packet and the approval-metadata update
- `git diff --check -- openspec/changes/async-interaction-feedback-foundation docs/reviews/async-interaction-feedback-foundation`
- SHA-256 recomputation for approved artifacts and current Tasks/review packet
- `git status --short`

No implementation test, build or Browser QA is part of this gate.

## Validation Performed During Tasks Phase

| Command                                                                                                                         | Result                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec prettier --check <tasks-and-review-artifact paths>`                                                                  | `PASS` — all three scoped artifacts match repository style                                                                                              |
| `openspec validate async-interaction-feedback-foundation --strict --json`                                                       | `PASS` — one change, zero issues                                                                                                                        |
| `pnpm docs:check`                                                                                                               | `PASS` — 36 current documents passed consistency checks                                                                                                 |
| `git diff --check -- openspec/changes/async-interaction-feedback-foundation docs/reviews/async-interaction-feedback-foundation` | `PASS`, with limitation — paths are currently untracked, so scoped Prettier and an explicit whitespace scan provide the effective untracked-file checks |
| `openspec status --change async-interaction-feedback-foundation --json`                                                         | `PASS` — all five planning artifacts are `done`; this describes artifact completeness, not Apply authority                                              |
| `git status --short`                                                                                                            | `SCOPED` — only the current change and review directories are reported, both untracked                                                                  |
| SHA-256 recomputation                                                                                                           | `PASS` — approved Design remains the exact expected hash; Tasks and reviewed authority hashes are recorded above                                        |

Implementation tests, builds and Browser QA were deliberately not run. No production, application, `@yuta/ui`, package manifest or lockfile change was made.

Baseline issues: none encountered in the authorized artifact checks.

Delta issues: none.

## Unresolved Before Apply

None at planning level. Apply remains separately unauthorized and must begin with the hash/scoped-cleanliness checks above. Environmental availability for safe Google Browser QA is a later QA risk, not permission to use production data or waive QA.

## Recommendation

`APPROVE_TASKS_FOR_APPLY`

This is a recommendation for human review only. It does not approve Tasks, authorize Apply, change production, sync or archive.
