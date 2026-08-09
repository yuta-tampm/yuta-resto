# <Page or screen name> — Acceptance Checklist

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

## UI

- [ ] Existing application shell is reused unless shell work is explicitly in
      scope.
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
