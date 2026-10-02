# POS Order Items - Acceptance Checklist

## Required-option add flow

- [x] Product owner approved option selection immediately after tapping a
      configured catalog item.
- [x] Items without required variants retain one-tap addition.
- [x] Required options use a focused modal and do not open allergy controls.
- [x] Canceling the modal creates no order item.
- [x] Confirmation sends the item and selected variants in one request.
- [x] Site-agent validates current catalog codes and the exact required count.
- [x] Required-variant items use separate-portion ordering.
- [x] The existing `selected_variants` snapshot field avoids a migration.
- [x] Configured combo candidates reuse the same modal.
- [x] Focused tests, required repository checks, offline acceptance, and
      responsive browser QA pass.

## Combo-completion reopening gate

- [x] The management-owned `isSuggestionEnabled` preference is consumed only
      at the order-items completion-projection boundary.
- [x] Opted-out active rules disappear from suggestions while remaining active
      for payment/check discount calculation.
- [x] Focused regression covers enabled and opted-out presentation behavior.
- [x] Extension Phase 5 production-browser QA passes at `1366 × 768`,
      `1024 × 768`, `768 × 1024`, and `390 × 844` with zero document overflow.
- [x] Search and category dismissal pass, unrelated items do not revive a
      dismissed state, and another Gua Bao creates a fresh eligible state.

- [x] The target is classified as a new `SURFACE` inside an `EXISTING_PAGE`.
- [x] The existing page remains integrated and fixture replacement is forbidden.
- [x] Current order, catalog, active combo rules, and add-item transport are
      sufficient for the expected vertical slice.
- [x] A real 1366x768 partial-combo baseline was captured without submitting a
      control.
- [x] Existing payment-summary optimization side effects are recorded.
- [x] Database, API/contract, permission/auth, and runtime/device flags are `NO`.
- [x] Shared context remains `RESOLVED` with
      `REUSE_APPROVED_SHARED_SHELL`.
- [x] The design prompt is ready and explicitly excludes hard-coded items,
      duplicated products, virtual persisted categories, projected savings,
      analytics, and new management settings.
- [x] Product owner approves the one-item-away qualification policy.
- [x] Product owner approves highest-priority deduplication, suggestion
      placement, active-search hiding, and required visual states.
- [x] Phase 1 desktop and narrow design references are generated and repository
      reviewed.
- [x] Product owner approves the corrected Phase 1 design references.
- [x] Runtime implementation begins only after the above approval gate.
- [x] Phase 2 uses the authoritative combo calculator rather than presentation
      matching logic.
- [x] Phase 2 tests one-step qualification, multi-step exclusion,
      multi-quantity groups, overlap/priority, `maxApplications`, deduplication,
      inactive rules, and non-positive outcomes.
- [x] Phase 2 changes no catalog transport, action, site-agent, db-pos, schema,
      auth, payment, kitchen, printing, offline, or device behavior.
- [x] Product owner approves Phase 2 behavior before Phase 3 route integration.
- [x] Phase 3 filters active categories and available real catalog items in POS,
      while core remains presentation-neutral.
- [x] The shelf is absent for no-result and locked states and hidden during an
      active search.
- [x] Candidate submission reuses `addOrderItemAction`, exposes a disabled
      pending state, and does not update order or pricing optimistically.
- [x] Phase 3 adds no API, contract, site-agent, db-pos, schema, authorization,
      payment, kitchen, printing, offline, or device capability.
- [x] Product owner/operator approves the Phase 3 route interaction before the
      Phase 4 integration audit.
- [x] Phase 4 confirms no diff in contracts, site-agent, db-pos, migrations,
      POS transport/action schemas, manifests, or lockfile.
- [x] Existing order locks, availability checks, snapshots, ordering policy,
      recalculation, and transactions remain site-agent owned.
- [x] Local db-pos, site-agent, POS, production-build, and disposable-database
      offline acceptance gates pass.
- [x] Phase 4 requires no runtime implementation change.
- [x] Product owner approves the Phase 4 audit before Phase 5 visual and
      operational QA.
- [x] Operator-reported mobile category-row stretching is corrected without
      changing the desktop three-column workspace.
- [x] Small or vertical-dominant mouse/pen movement on a category remains a
      click; only a horizontal-dominant drag of at least 16px suppresses link
      activation.
- [x] Normal catalog-card submission exposes visible, accessible pending
      feedback without optimistic order or pricing state.
- [x] Corrective QA passes at 1366x768, 1024x768, 768x1024, and 390x844 with no
      document-level horizontal overflow.
- [x] Combo suggestions may appear in any category; selecting a category hides
      the visible rule-state fingerprints for the current route session. Adding
      unrelated items does not revive them; adding another rule-relevant item,
      such as a second Gua Bao, allows that rule's new state to appear.
- [x] Dynamic category links do not prefetch dismissal-sensitive route
      responses; authenticated navigation from `Toutes` to `Entrées` keeps the
      category items correct and does not restore the dismissed shelf.
- [x] At 1024px the suggestion heading stacks above its candidate scroller so
      the first 44px add action remains immediately visible without changing
      the three-panel workspace.
- [x] Narrow combo suggestion cards show the complete candidate name and price
      above a full-width add action so staff can distinguish product variants.

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
