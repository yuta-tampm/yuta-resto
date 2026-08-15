# POS Order Items - Acceptance Checklist

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
- [x] Existing target baseline is captured with route, state, viewport/device,
      date, and runtime/session conditions, or a precise blocker is recorded.
- [x] `DESIGN_HANDOFF.md` contains a ready-to-use design-generation prompt based
      on the Phase 0 inventory and protected invariants.
- [x] Global, application, section/flow, and page UI context layers are
      inventoried with owner, source, approval state, reuse/adaptation rules,
      exclusions, and blockers.
- [x] `Shared context status` is `RESOLVED` before design generation or design
      approval.
- [x] Exactly one shell/navigation mode is recorded, with real allowed routes
      and forbidden invented elements.
- [x] The design tool receives the curated baseline/shared-reference bundle,
      not only a prose description.

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

- [x] Existing-page baseline status is `CAPTURED` (`NEW_PAGE` may use
      `NOT_APPLICABLE`).
- [x] Design prompt status is `READY`.
- [x] Product scope is `APPROVED`.
- [x] Reference status is `APPROVED`, or `NONE` has an explicit no-image reason.
- [x] Package status becomes `implementation-ready` only after inventory,
      invariants, impact, commands, scope, and reference gates are complete.

## UI

- [x] Existing application shell is reused unless shell work is explicitly in
      scope.
- [x] A page-local design does not create or redefine shared header, sidebar,
      navigation, account area, or common state patterns.
- [x] Every visible navigation item maps to an approved real route or is
      explicitly presented as unavailable; no dead link is invented.
- [x] `@yuta/ui` and semantic tokens are reused where applicable.
- [x] No raw colors are copied from references.
- [x] No duplicate shared primitive is created.
- [x] Core actions match target-application interaction priorities.
- [x] Loading, disabled, pending, error, success, and recovery states are
      truthful.

## Behavior

- [x] Unsupported mockup concepts remain proposals.
- [x] No new destructive behavior was added; existing pending-item soft-removal
      and kitchen confirmation behavior remain authoritative.
- [x] Validation is truthful.
- [x] No new save workflow was added; existing Server Action recovery semantics
      are preserved and the lack of a new persistence/retry capability is
      recorded as an intentional boundary.
- [x] The post-send success screen appears only after trusted kitchen-send
      success, never from a browser-provided success flag alone.
- [x] `Créer une autre commande` navigates to `/pos`, `Retour aux commandes`
      navigates to `/`, and the approved five-second timer returns to `/`.
- [x] The success screen confirms the kitchen-send transaction without claiming
      physical printer success.

## Responsive, touch, and accessibility

- [x] Target application/page viewport or device matrix was used; Backoffice
      widths were not assumed globally.
- [x] No horizontal overflow.
- [x] Keyboard/focus behavior works where supported.
- [x] Touch targets and touch feedback work for touch-oriented screens.
- [x] Status includes text.
- [x] Icon-only controls have accessible names.

## Verification

- [x] `pnpm docs:check` was run if documentation changed.
- [x] `pnpm format:check` was run; its existing repository-wide formatting
      failures are recorded in the Phase 3 delivery evidence.
- [x] `pnpm architecture:check` was run when relevant.
- [x] Target-application typecheck, tests, and build commands were discovered
      and run as required.
- [x] The Phase 4 audit confirmed no runtime, domain, contract, database,
      offline, or device behavior change; boundary typechecks and architecture
      checks passed, so integration tests were not required for this phase.
- [x] Browser/device evidence is attached.
- [x] No lint result is claimed unless a real lint command exists.

## Completion

- [x] Functional/regression QA completed before final visual parity review.
- [x] Intentional deviations and deferred risks are recorded.
- [x] Stable page package matches the as-built implementation.
- [x] Package status is `implemented` only after as-built synchronization.
