# POS management printing — Acceptance Checklist

## Repository and application

- [x] Root and nearest application instructions were read.
- [x] `docs/CURRENT_STATE.md` and relevant current product, feature, operations,
      and QA docs were read.
- [x] Target application, route/screen, runtime boundary, and app-specific UI
      rules are identified.
- [x] Page is classified `NEW_PAGE` or `EXISTING_PAGE`.
- [x] Implementation class is recorded.
- [x] Phase 0 Implementation Inventory and current visual baseline are complete
      before code changes.
- [x] Target type and expected change impact are recorded.
- [x] Current authenticated baseline images and capture conditions are recorded.
- [x] `DESIGN_HANDOFF.md` contains a repository-grounded design-generation
      prompt ready for ChatGPT/ImageGen.

## Scope and invariants

- [x] Product scope is preserved.
- [x] Current auth/session/trust boundary is preserved.
- [x] Current data owner and transport boundary are preserved.
- [x] Existing business, transaction, polling, offline, and device invariants
      are preserved where applicable.
- [x] No unsupported mockup module, field, permission, API, schema, or device
      capability is implemented as fact.

## Existing-page protection

- [x] Real data was not replaced with fixture data.
- [x] Existing loading, actions, mutations, validation, and transactions are
      preserved or deliberately changed with approval.
- [x] Existing polling, offline, retry, and device behavior is preserved where
      applicable.
- [x] Existing tests protecting the screen remain valid.

## Design approval

- [x] Existing-page baseline status is `CAPTURED`.
- [x] Design prompt status is `READY`.
- [x] Product scope is `APPROVED`.
- [x] Reference status is `APPROVED`, or `NONE` has an explicit no-image reason.
- [x] Package status becomes `implementation-ready` only after inventory,
      invariants, impact, commands, scope, and reference gates are complete.

## UI

- [x] Existing application shell is reused unless shell work is explicitly in
      scope.
- [x] `@yuta/ui` and semantic tokens are reused where applicable.
- [x] No raw colors are copied from references.
- [x] No duplicate shared primitive is created.
- [x] Core actions match target-application interaction priorities.
- [x] Loading, disabled, pending, error, success, and recovery states are
      truthful.

## Behavior

- [x] Automatic five-second and focus/visibility refreshes stop while the
      browser-local screen schedule is in standby and resume after wake.
- [x] Browser standby does not stop or claim the site-agent print worker or
      RFCOMM device.

- [x] Unsupported mockup concepts remain proposals.
- [x] Destructive behavior is confirmed.
- [x] Validation is truthful.
- [x] Save errors preserve input.

## Responsive, touch, and accessibility

- [x] Target application/page viewport or device matrix was used; Backoffice
      widths were not assumed globally.
- [x] No horizontal overflow.
- [x] Keyboard dialog dismissal, accessible inline validation, and visible
      focus treatment were verified.
- [x] Touch targets and touch feedback work for touch-oriented screens.
- [x] Status includes text.
- [x] Icon-only controls have accessible names.

## Verification

- [x] `pnpm docs:check` was run if documentation changed.
- [x] `pnpm format:check` was run; it reports the pre-existing unrelated
      `apps/web/tsconfig.json` formatting issue.
- [x] `pnpm architecture:check` was run when relevant.
- [x] Target-application typecheck, tests, and build commands were discovered
      and run as required.
- [x] Affected runtime, domain, contract, database, offline, and device tests
      were run when behavior changed.
- [x] Desktop, tablet, and narrow browser evidence is attached; the unexecuted
      physical-device check is explicitly recorded and not claimed as passed.
- [x] No lint result is claimed unless a real lint command exists.

## Completion

- [x] Functional/regression QA completed before final visual parity review.
- [x] Intentional deviations and deferred risks are recorded.
- [x] Stable page package matches the as-built implementation.
- [x] Package status is `implemented` only after as-built synchronization.
