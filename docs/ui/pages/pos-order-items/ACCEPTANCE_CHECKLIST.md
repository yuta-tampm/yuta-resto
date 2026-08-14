# POS Order Items - Acceptance Checklist

## Repository and application

- [ ] Root and nearest application instructions were read.
- [ ] `docs/CURRENT_STATE.md` and relevant current product, feature, operations,
      and QA docs were read.
- [ ] Target application, route/screen, runtime boundary, and app-specific UI
      rules are identified.
- [ ] Page is classified `NEW_PAGE` or `EXISTING_PAGE`.
- [ ] Implementation class is recorded.
- [ ] Phase 0 Implementation Inventory and current visual baseline are complete
      before code changes.
- [ ] Target type and expected change impact are recorded.
- [ ] Existing target baseline is captured with route, state, viewport/device,
      date, and runtime/session conditions, or a precise blocker is recorded.
- [ ] `DESIGN_HANDOFF.md` contains a ready-to-use design-generation prompt based
      on the Phase 0 inventory and protected invariants.
- [ ] Global, application, section/flow, and page UI context layers are
      inventoried with owner, source, approval state, reuse/adaptation rules,
      exclusions, and blockers.
- [ ] `Shared context status` is `RESOLVED` before design generation or design
      approval.
- [ ] Exactly one shell/navigation mode is recorded, with real allowed routes
      and forbidden invented elements.
- [ ] The design tool receives the curated baseline/shared-reference bundle,
      not only a prose description.

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

- [ ] Existing-page baseline status is `CAPTURED` (`NEW_PAGE` may use
      `NOT_APPLICABLE`).
- [ ] Design prompt status is `READY`.
- [ ] Product scope is `APPROVED`.
- [ ] Reference status is `APPROVED`, or `NONE` has an explicit no-image reason.
- [ ] Package status becomes `implementation-ready` only after inventory,
      invariants, impact, commands, scope, and reference gates are complete.

## UI

- [ ] Existing application shell is reused unless shell work is explicitly in
      scope.
- [ ] A page-local design does not create or redefine shared header, sidebar,
      navigation, account area, or common state patterns.
- [ ] Every visible navigation item maps to an approved real route or is
      explicitly presented as unavailable; no dead link is invented.
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
- [ ] The post-send success screen appears only after trusted kitchen-send
      success, never from a browser-provided success flag alone.
- [ ] `Créer une autre commande` navigates to `/pos` and
      `Retour aux commandes` navigates to `/` without automatic redirect.
- [ ] The success screen confirms the kitchen-send transaction without claiming
      physical printer success.

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
