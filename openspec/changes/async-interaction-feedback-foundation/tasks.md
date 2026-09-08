# Implementation Plan

Change: `async-interaction-feedback-foundation`

Classification: `CROSS_MODULE`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES`

Apply authorization: `NOT_GRANTED`

Sensitive Design Gate: `SENSITIVE_DESIGN_GATE_NOT_REQUIRED`

This plan implements the approved frontend-only Specs through the exact approved Design. It creates no Foundation / Data or Service / Domain phase because no schema, persistence, API, authorization, tenant, provider, transaction or runtime work is approved.

## Exact Intended Files

### Existing files expected to be modified

- `packages/ui/src/button.tsx`
- `packages/ui/package.json`
- `pnpm-lock.yaml`
- `apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx`
- `apps/backoffice/src/components/backoffice/backoffice-frame.tsx`

### New files expected to be created

- `apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx`
- `apps/backoffice/src/components/backoffice/logout-submit-button.tsx`

### Tests expected to be created or executed

- Create `packages/ui/test/button.test.tsx`.
- Create `apps/backoffice/test/general-information-form.test.tsx`.
- Create `apps/backoffice/test/google-location-submit-button.test.tsx`.
- Create `apps/backoffice/test/logout-submit-button.test.tsx`.
- Execute unchanged `apps/backoffice/test/formalites-persistent-draft-state.test.ts`.
- Execute unchanged `apps/backoffice/test/formalites-persistent-draft-component.test.tsx`.
- Execute unchanged `apps/backoffice/test/tenant-switcher.test.tsx` as additional shell compatibility evidence when its current test interface permits the focused run without modification.

### Production files inspected but not intended to change

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx`
- `apps/backoffice/src/app/(authenticated)/parametres/integrations/actions.ts`
- `apps/backoffice/src/app/(authenticated)/actions.ts`
- `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace.tsx`
- `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-state.ts`

### Future review and evidence locations

- `docs/reviews/async-interaction-feedback-foundation/qa/QA_REPORT.md`
- `docs/reviews/async-interaction-feedback-foundation/qa/screenshot-manifest.md`
- `docs/reviews/async-interaction-feedback-foundation/qa/<viewport>-<pilot>-<state>.png`
- `docs/reviews/async-interaction-feedback-foundation/03-final-review.md` only after implementation, Technical Compliance, Verify and QA are independently complete; it is not created by this Tasks phase.

Any production or test path outside this allowlist is a deviation. A path-only variation may proceed only after it is recorded and proven behaviorally equivalent; a boundary or Design change must stop for review.

## Dependency-Aware Implementation Order

1. Establish package-local `@yuta/ui` test wiring and its direct contract test so the shared owner can verify the approved observable behavior.
2. Apply the narrow native `Button loading` change and pass the focused shared contract test.
3. Add the Google route-local and logout shell-local client boundaries without changing either Server Action.
4. Add pilot interaction tests and prove the existing General Information and Formalités patterns remain intact.
5. Run integration/regression checks, then execute mandatory Browser QA on the as-built candidate.
6. Prepare the Technical Compliance Matrix and Verify evidence for later Gate 3 review. Gate 3 remains separate and cannot start from this Tasks authorization.

Each step depends on the preceding completion evidence. No later phase may compensate for a failed earlier contract.

## 1. UI / Components

Why required: the approved Design adds one domain-neutral native `Button loading` semantic and two bounded Backoffice submit components at their existing presentation boundaries.

### TECHNICAL IMPLEMENTATION CONTRACT — UI / Components

**Phase:** `UI / Components`

**Owner:** `packages/ui` for the native Button contract; `apps/backoffice` for route-local and shell-local composition.

**Authority:** approved Specs requirements `Shared Primitive Pending Contract`, `Accessible Pending Semantics`, `Delegated and Non-Native Control Boundary`, `Bounded Backoffice Pilot Adoption` and `Cross-Module Ownership Guardrail`; approved Design decisions 1–5, Pilot Adoption Design and Shared primitive contract ownership.

**Scope:** add package-local test wiring, derive native `aria-busy` from `loading`, and create only the approved Google and logout submit components.

**Intended files:** `packages/ui/src/button.tsx`, `packages/ui/package.json`, `pnpm-lock.yaml`, `packages/ui/test/button.test.tsx`, `apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx`, `apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx`, `apps/backoffice/src/components/backoffice/backoffice-frame.tsx`, and `apps/backoffice/src/components/backoffice/logout-submit-button.tsx`.

**Must preserve:** named exports; current variants, sizes, ref and native attribute forwarding; visible children; `disabled={disabled || loading}`; `data-loading`; caller-supplied `aria-busy` when `loading=false`; existing Google fields, provider lookup, permission and trusted tenant scope, redirect/revalidation behavior; existing logout session revocation, cookie deletion, auth rules and `/connexion` redirect; current Server Component boundaries outside the smallest client submit islands.

**Must not introduce:** automatic shared spinner or label replacement; a new UI primitive; a global async provider; toast convention; global state/focus management; a runtime workaround; root test script; new test framework; a normative guarantee for `asChild + loading`; Server Action, route, API, authorization, data or runtime changes.

**Targeted verification:** `pnpm --filter @yuta/ui exec vitest run test/button.test.tsx`; `pnpm --filter @yuta/ui test`; focused Backoffice tests in Phase 2; `rg -n "<Button[^>]*asChild[^>]*loading|<Button[^>]*loading[^>]*asChild" apps packages` for the delegated-loading inventory; scoped Prettier and `git diff --check`.

**Completion evidence:** package-local test command resolves and passes; direct markup assertions cover only approved behavior; zero current `asChild + loading` consumers remains recorded; code diff is confined to intended files; each Backoffice component composes the unchanged action.

**Stop conditions:** test wiring requires a root/repository-wide convention; a new shared abstraction becomes necessary; `asChild + loading` needs a guarantee or migration; either action contract or runtime completion sequence must change; any auth, tenant, provider, persistence, transaction or data boundary is implicated. These stop with `DESIGN_IMPLEMENTATION_GAP` or `CONTROL_TOWER_REVIEW_REQUIRED` as applicable.

- [x] 1.1 Add package-local `"test": "vitest run"` wiring in `packages/ui/package.json`, add only direct test dependencies required by server-rendered component tests (`vitest`, `react-dom` and matching types only if TypeScript resolution requires them) using the repository's current version family, and update only `pnpm-lock.yaml`; verify no root script or new framework is introduced.
- [x] 1.2 Create `packages/ui/test/button.test.tsx` and assert native `loading=true` yields disabled, `aria-busy="true"` and `data-loading` while preserving children/action text; assert explicit disabled behavior without loading; assert caller `aria-busy` preservation while not loading; assert no automatic spinner or label replacement. Protect the `asChild + loading` boundary through the zero-consumer inventory and an explicit statement that delegated markup is not a normative disabled guarantee, not by codifying accidental Slot output.
- [x] 1.3 Modify only `packages/ui/src/button.tsx` so native `Button loading=true` derives `aria-busy="true"`, while `loading=false` preserves the caller's `aria-busy`; retain current disabled, data attribute, children, variants, refs and native props, then pass both exact `@yuta/ui` test commands.
- [x] 1.4 Create `google-location-submit-button.tsx` as the smallest route-local client submit boundary using existing form pending context and `Button`; while pending expose `Sélection en cours…`, loading/busy semantics and duplicate prevention, then compose it from `google-location-selector-panel.tsx` without modifying `actions.ts`, form fields, provider logic, Alerts, redirect results or revalidation.
- [x] 1.5 Create `logout-submit-button.tsx` as the smallest shell-local client submit boundary and compose it from `backoffice-frame.tsx`; reuse `IconButton`, expose the action-specific pending accessible name `Déconnexion en cours…`, bounded loading indication and duplicate prevention, without modifying the logout action, auth/session behavior or redirect target.

## 2. Interaction / States

Why required: the four approved pilots use different state ownership patterns, so their pending, outcome, recovery and accessibility behavior must be verified without forcing one implementation technique.

### TECHNICAL IMPLEMENTATION CONTRACT — Interaction / States

**Phase:** `Interaction / States`

**Owner:** `apps/backoffice`; existing route/domain owners retain authoritative outcomes and custom state machines.

**Authority:** approved Specs requirements `Mutation Pending Feedback`, `Duplicate Activation Prevention`, `Accessible Pending Semantics`, `Error and Recovery Feedback`, `Authoritative Success Feedback`, `Custom-State Compatibility and Domain Precedence` and `Bounded Backoffice Pilot Adoption`; approved Design Pilot Adoption Design and Backoffice tests.

**Scope:** add focused presentation tests for General Information, Google selection and logout; rerun the existing Formalités state/component suites as compatibility evidence.

**Intended files:** create only `apps/backoffice/test/general-information-form.test.tsx`, `apps/backoffice/test/google-location-submit-button.test.tsx` and `apps/backoffice/test/logout-submit-button.test.tsx`; execute the existing Formalités and tenant-switcher test files without modifying them unless a separately reviewed, Design-consistent assertion-only deviation is recorded.

**Must preserve:** validation and field-value context; authoritative returned result or redirect; action inputs/outputs; permissions and trusted organization/establishment context; persistence and transaction behavior; provider behavior; logout session semantics; Formalités operation identity, pending/uncertain state, same-operation retry, conflict/reconciliation, reload and authoritative settlement; route-specific focus behavior.

**Must not introduce:** common mutation state, common retry identity, global busy region, generic-only `Loading` accessible name, global focus abstraction, mocked domain outcomes presented as integration proof, or a refactor of General Information or Formalités production code.

**Targeted verification:** `pnpm --filter @yuta/backoffice exec vitest run test/general-information-form.test.tsx test/google-location-submit-button.test.tsx test/logout-submit-button.test.tsx test/formalites-persistent-draft-state.test.ts test/formalites-persistent-draft-component.test.tsx`; add `test/tenant-switcher.test.tsx` to a separate focused compatibility run when unchanged.

**Completion evidence:** the three new tests pass; existing Formalités suites pass unchanged; assertions distinguish local pending from authoritative success/error; accessible names remain action-specific; field and focus ownership remain route-local; no production Formalités diff exists.

**Stop conditions:** tests reveal that feedback requires changing an action result/redirect, validation taxonomy, operation key, retry/conflict identity, persistence, authorization or runtime sequencing; a route-specific state machine would need flattening; a new shared interaction abstraction is proposed. Stop with `CONTROL_TOWER_REVIEW_REQUIRED` or return to Design review.

- [x] 2.1 Create `general-information-form.test.tsx` for the existing-good baseline without changing `general-information-form.tsx`: verify the existing action-specific pending label, native disabled/busy behavior inherited from `Button`, validation/failure value preservation and authoritative returned success/error rendering at the component boundary.
- [x] 2.2 Create `google-location-submit-button.test.tsx`: verify idle label, pending `Sélection en cours…`, disabled/busy duplicate prevention, action-specific accessible name and preserved children/indicator behavior. Keep redirect success, invalid input and provider failure authoritative to existing route Alerts/action tests rather than redefining them.
- [x] 2.3 Create `logout-submit-button.test.tsx`: verify normal icon-only accessible name, pending `Déconnexion en cours…`, disabled/busy duplicate prevention and bounded indicator. Do not invent a success state because successful navigation replaces the initiating shell.
- [x] 2.4 Rerun `formalites-persistent-draft-state.test.ts` and `formalites-persistent-draft-component.test.tsx` as non-regression evidence for pending, uncertain operation, conflict/reconciliation, retry, reload, operation identity, focus and authoritative settlement. `SHARED FOUNDATION MUST NOT FLATTEN OR REPLACE ROUTE-SPECIFIC STATE MACHINE`.
- [x] 2.5 Rerun unchanged `tenant-switcher.test.tsx` when compatible with the current focused runner as additional evidence that shell redirect ownership remains intact; failure here may justify an assertion-only, Design-consistent review, never tenant-switcher production adoption.
- [x] 2.6 Review the three new tests and pilot markup for native disabled semantics, truthful `aria-busy`, action-specific pending meaning, local rather than whole-region busy scope, keyboard activation, existing error association and route-owned focus/recovery; record any item requiring a new focus or live-region abstraction as a Design stop rather than implementing it.

## 3. Integration / Regression

Why required: the shared primitive and bounded Backoffice adoption require combined regression evidence, mandatory responsive Browser QA and granular future Verify mapping before Gate 3.

### TECHNICAL IMPLEMENTATION CONTRACT — Integration / Regression

**Phase:** `Integration / Regression`

**Owner:** `packages/ui` and `apps/backoffice` for technical checks; the change review owner for QA/Verify evidence.

**Authority:** all approved Specs requirements and scenarios; approved Design Testing Strategy, Compatibility / Migration, Risks / Trade-offs, Control Tower Stop Conditions and Sensitive Design Gate Assessment; `docs/YUTA_QA_PROTOCOL.md` and `docs/YUTA_WORKFLOW_V3.md`.

**Scope:** run focused and package-level tests/checks, inspect the scoped diff, execute Browser QA only after an as-built candidate exists, and assemble traceable evidence for later Technical Compliance, Verify and QA decisions.

**Intended files:** no additional production files; future evidence only under `docs/reviews/async-interaction-feedback-foundation/qa/`, followed later by `docs/reviews/async-interaction-feedback-foundation/03-final-review.md` when authorized and complete.

**Must preserve:** approved hashes and artifact authority; unrelated dirty-checkout work; production data; safe local/provider boundaries; four-pilot allowlist; distinction among Technical Compliance, Verify and QA; all runtime/data/security/domain invariants from earlier contracts.

**Must not introduce:** extra pilot pages; POS, Display, Booking or Feedback adoption; production/provider mutation solely to obtain screenshots; fabricated success evidence; treating skipped or `BLOCKED_BY_ENVIRONMENT` QA as PASS; sync, archive, deployment or self-approval.

**Targeted verification:** exact commands in `Planned Verification Commands`; Browser QA at 1440x900, 1024x768, 768x1024 and 390x844; SHA-256 screenshot manifest; Technical Compliance Matrix mapping each requirement, Design decision and task to code/tests/evidence.

**Completion evidence:** all delta checks pass; baseline issues are separate; QA report and manifest are complete and hashed; each relevant state has real-route evidence or an explicit non-PASS environment verdict; future Technical Compliance and Verify matrices are unambiguous; no out-of-scope diff exists.

**Stop conditions:** unsafe or unavailable provider/data environment; any unexpected schema/API/auth/runtime/provider/transaction change; artifact drift; unrelated modifications cannot be isolated; Browser QA exposes a Design contradiction; any final verdict would rely on missing or synthetic evidence.

- [x] 3.1 Run the focused shared UI command, full package-local UI command, focused Backoffice pilot command and unchanged tenant-switcher compatibility command; record exact command, result and failure attribution.
- [x] 3.2 Run scoped typecheck/build and repository checks from `Planned Verification Commands`; record root baseline failures separately from change-caused failures and do not repair unrelated baseline or generated-file noise.
- [x] 3.3 Inspect `git status --short`, the intended-file diff, package/lockfile delta, `git diff --check`, and the `asChild + loading` inventory; prove every code change belongs to the reviewed allowlist or stop for deviation review.
- [ ] 3.4 Execute real-route Browser QA after Apply at 1440x900, 1024x768, 768x1024 and 390x844 for the four pilots: General Information idle/pending/validation or operation error/authoritative success; Google idle/pending-before-redirect/selected result/invalid or provider failure; logout normal/pending/navigation to sign-in; Formalités pending/uncertain/conflict/retry or recovery/reload/focus compatibility. Use only safe local development data; report Google evidence `BLOCKED_BY_ENVIRONMENT` if safe provider exercise is unavailable.
- [ ] 3.5 During Browser QA verify action-specific accessible names, native disabled and busy behavior, prevention of repeated keyboard/pointer activation, local versus region busy scope, error association, focus after route-owned error/recovery, and responsive layout. Do not invent authorization cases or global screen-reader behavior.
- [ ] 3.6 Save screenshots under `docs/reviews/async-interaction-feedback-foundation/qa/` using `<viewport>-<pilot>-<state>.png`, write `screenshot-manifest.md` with route, viewport, state, safe-data description, capture time and lowercase SHA-256 for every image, and write `QA_REPORT.md` with `PASS`, `FAIL`, `BLOCKED_BY_ENVIRONMENT` or `NOT_APPLICABLE` per matrix row. Screenshots are evidence, not authority.
- [x] 3.7 Prepare the future `TECHNICAL COMPLIANCE MATRIX` mapping every approved Spec requirement/scenario group and Design decision to these numbered tasks, exact code/test paths, commands, status and evidence. Do not perform Verify or create the Gate 3 packet during Tasks or Apply.
- [ ] 3.8 Before Gate 3, independently establish `TECHNICAL IMPLEMENTATION COMPLIANCE`, `VERIFY` and `QA`; because `UI_AFFECTING: YES`, Gate 3 is ineligible unless Browser QA is `PASS`. Await a separate human review and never sync or archive from this plan.

## Pilot Coverage Contract

| Pilot category                               | Current pattern                                                                                             | Required delta                                                                                         | Must remain unchanged                                                                                                                     | Targeted tests                                                                                    | Browser QA states                                                                                          |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Existing-good baseline — General Information | Client form with returned action state, `useFormStatus`, action-specific pending label and `Button loading` | No route production edit; inherit shared native busy semantic and add focused evidence                 | Save action, validation, draft values, permissions, transaction/persistence and authoritative result                                      | `general-information-form.test.tsx`; shared Button test                                           | Idle, pending, validation/operation error, confirmed success, keyboard/focus                               |
| Missing feedback — Google location           | Server-rendered cards and native form invoking redirect-based action                                        | Small client submit island with `Sélection en cours…`, disabled/loading/busy and duplicate prevention  | Provider lookup, fields, permission, tenant scope, action return, revalidation, redirects and existing Alerts                             | `google-location-submit-button.test.tsx`; existing action/security coverage remains authoritative | Idle, pending before redirect, selected result, invalid/provider failure, keyboard/focus, responsive cards |
| Shell/navigation — logout                    | Client shell form with icon-only native submit and redirect action                                          | Shell-local pending component with `Déconnexion en cours…`, bounded indicator and duplicate prevention | Session revoke, cookie deletion, auth rules and `/connexion` redirect                                                                     | `logout-submit-button.test.tsx`; existing auth coverage remains authoritative                     | Normal, pending, repeated activation prevention, redirect to sign-in, desktop/mobile shell                 |
| Complex compatibility — Formalités           | Route-owned operation-key state machine with pending, uncertain, reconciliation, focus and refresh          | No production delta; regression evidence only                                                          | Operation identity, uncertain retry, conflict/reconciliation, draft preservation, authorization, persistence and authoritative settlement | Existing Formalités state and component suites                                                    | Pending, uncertain, conflict, retry/recovery, reload and focus with safe development data                  |

## Browser QA Evidence Plan

- Viewports: `1440x900` desktop, `1024x768` intermediate, `768x1024` tablet and `390x844` mobile.
- Roles: only the currently authorized Backoffice role/context required by each existing route; no new role or authorization scenario.
- Capture minimum: one idle and one pending screenshot per visible pilot at desktop and mobile; one outcome/recovery screenshot for each applicable General Information, Google and Formalités state; responsive layout screenshots at 1024x768 and 768x1024 where the relevant cards, form or shell changes layout.
- Manifest: every screenshot entry records exact route, viewport, state, safe local fixture/context, timestamp and lowercase SHA-256.
- Verdict: missing safe Google provider state is `BLOCKED_BY_ENVIRONMENT`, never PASS; QA must later reach PASS for Gate 3.

## Planned Verification Commands

These are future Apply/Verify commands, not claims of execution during Tasks:

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

If the repository-wide format check reports a pre-existing failure, retain its exact baseline evidence and require the scoped Prettier check plus `git diff --check` to pass; do not repair unrelated files.

## Pre-Apply Scoped Cleanliness Contract

Before any separately authorized Apply:

1. Recompute and match the reviewed Proposal, Analysis, Spec, Design and Tasks SHA-256 values; any drift stops with `REVIEW_ARTIFACT_DRIFT`.
2. Inspect `git status --short`, record the current HEAD and distinguish this change's untracked/planned artifacts from unrelated user work.
3. Require `SCOPED CLEANLINESS`: the tree need not be globally clean, but every unrelated path must be identified and excluded; overlapping intended-file modifications require review before editing.
4. Bind Apply to the exact intended-file allowlist above. Do not silently include cleanup, generated-file noise or broader adoption.
5. Record existing repository/check failures separately from delta failures. A baseline issue does not authorize a repair outside scope.
6. Do not resolve Specs/Design ambiguity during implementation. Return to the relevant human review gate.
7. Confirm Apply authority names this exact change and phase/scope. Tasks approval alone is not Apply authority.

## Deviation Handling

- **Minor implementation detail:** may proceed only when fully implied by approved Specs/Design, presentation-only and within an intended file; record it in implementation evidence.
- **File-path variation:** record the old/new exact path and repository reason, verify no ownership or behavior change, and update the scoped allowlist before editing.
- **Design-level decision:** stop and return to Design review; do not amend Design during Apply by assumption.
- **Product, authorization, security, tenant, runtime, API, provider, persistence, transaction or data boundary:** stop with `CONTROL_TOWER_REVIEW_REQUIRED`; add `SENSITIVE_DESIGN_GATE_REQUIRED` when workflow criteria are met.
- **Test-tooling mismatch:** stop with `DESIGN_IMPLEMENTATION_GAP`; do not invent a root or alternative framework convention.

## Future Verify and Gate 3 Preparation

Tasks are intentionally granular so a future `TECHNICAL COMPLIANCE MATRIX` can map:

- each of the ten approved Spec requirements and their scenario groups;
- Design decisions 1–6, the four pilot decisions, testing ownership, compatibility and stop conditions;
- tasks 1.1–3.8;
- exact source/test paths and commands;
- implementation status and immutable evidence references.

The future Gate 3 review must separately assess `TECHNICAL IMPLEMENTATION COMPLIANCE`, `VERIFY` and `QA`. No final review, sync, archive, deploy or production operation is authorized by this document.
