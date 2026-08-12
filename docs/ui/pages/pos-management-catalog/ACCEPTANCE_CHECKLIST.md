# POS management catalog — Acceptance Checklist

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
- [x] Shared UI context is `RESOLVED` across global, application, section/flow,
      and page layers before design approval or implementation.
- [x] Exactly one shell/navigation mode is recorded with real routes,
      responsive behavior, account/session treatment, and forbidden elements.
- [x] Target type and expected change impact are recorded.
- [x] Existing target baseline is captured with route, state, viewport/device,
      date, and runtime/session conditions, or a precise blocker is recorded.
- [x] `DESIGN_HANDOFF.md` contains a ready-to-use design-generation prompt based
      on the Phase 0 inventory and protected invariants.

## Scope and invariants

- [ ] Product scope is preserved.
- [ ] Current auth/session/trust boundary is preserved.
- [ ] Current data owner and transport boundary are preserved.
- [ ] Existing business, transaction, polling, offline, and device invariants
      are preserved where applicable.
- [ ] No unsupported mockup module, field, permission, API, schema, or device
      capability is implemented as fact.

## Existing-page protection

- [ ] Real data was not replaced with fixture data.
- [ ] Existing loading, actions, mutations, validation, and transactions are
      preserved or deliberately changed with approval.
- [ ] Existing polling, offline, retry, and device behavior is preserved where
      applicable.
- [ ] Existing tests protecting the screen remain valid.

## Design approval

- [x] Existing-page baseline status is `CAPTURED` (`NEW_PAGE` may use
      `NOT_APPLICABLE`).
- [x] Design prompt status is `READY`.
- [x] Product scope is `APPROVED`.
- [x] Reference status is `APPROVED`, or `NONE` has an explicit no-image reason.
- [x] Package status becomes `implementation-ready` only after inventory,
      invariants, impact, commands, scope, and reference gates are complete.

## UI

- [ ] Existing application shell is reused unless shell work is explicitly in
      scope.
- [ ] The approved POS Management top header is used without inventing a left
      sidebar, mobile drawer, module tab bar, or unavailable route.
- [ ] `@yuta/ui` and semantic tokens are reused where applicable.
- [ ] No raw colors are copied from references.
- [ ] No duplicate shared primitive is created.
- [ ] Core actions match target-application interaction priorities.
- [ ] Loading, disabled, pending, error, success, and recovery states are
      truthful.

## Behavior

- [ ] Unsupported mockup concepts remain proposals.
- [ ] Destructive behavior is confirmed.
- [ ] Validation is truthful.
- [ ] Save errors preserve input.

## Responsive, touch, and accessibility

- [ ] Target application/page viewport or device matrix was used; Backoffice
      widths were not assumed globally.
- [ ] No horizontal overflow.
- [ ] Keyboard/focus behavior works where supported.
- [ ] Touch targets and touch feedback work for touch-oriented screens.
- [ ] Status includes text.
- [ ] Icon-only controls have accessible names.

## Verification

- [ ] `pnpm docs:check` was run if documentation changed.
- [ ] `pnpm format:check` was run.
- [ ] `pnpm architecture:check` was run when relevant.
- [ ] Target-application typecheck, tests, and build commands were discovered
      and run as required.
- [ ] Affected runtime, domain, contract, database, offline, and device tests
      were run when behavior changed.
- [ ] Browser/device evidence is attached.
- [ ] No lint result is claimed unless a real lint command exists.

## Completion

- [ ] Functional/regression QA completed before final visual parity review.
- [ ] Intentional deviations and deferred risks are recorded.
- [ ] Stable page package matches the as-built implementation.
- [ ] Package status is `implemented` only after as-built synchronization.
