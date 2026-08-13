# POS management combos — Acceptance Checklist

Status: Implemented and approved

Visibility: Engineering

## Phase 0

- [x] Existing real route and integrated implementation identified.
- [x] Local session, bearer transport, site-agent, db-pos, and contract
      boundaries mapped.
- [x] Current actions, validation, transactions, states, and tests inventoried.
- [x] Approved shared UI context from catalog/printing resolved.
- [x] Shell mode is `REUSE_APPROVED_SHARED_SHELL` with real routes and forbidden
      invented navigation recorded.
- [x] Authenticated populated baseline captured at `1366 × 768`.
- [x] Rule editor captured without submitting data.
- [x] ChatGPT/ImageGen prompt set is self-contained and uses distinct prompts
      for distinct assets.
- [x] Three selected generated references are saved as `DRAFT` with rejected
      deviations and remaining review decisions documented.
- [x] Runtime application code unchanged in Phase 0.
- [x] Product owner approves Phase 0 and authorizes design generation.
- [x] Generated direction is reviewed and approved before Phase 1.

## Later implementation acceptance

- [x] Real local data and Server Actions remain in place; no fixture replacement.
- [x] `admin`/`manager` session validation and HttpOnly cookie flow are unchanged.
- [x] Site-agent/db-pos ownership and bearer forwarding are unchanged.
- [x] Active rule structural locks and activation validation remain enforced.
- [x] Rule hard delete remains unavailable and paid discount history is preserved.
- [x] Fixed and base-item-plus-delta modes remain accurate.
- [x] All current rule/group/item fields and actions remain reachable.
- [x] Empty, pending, error, conflict, confirmation, disabled, success, session,
      and local-service failure states are truthful.
- [x] Approved shared header is used without sidebar/drawer/module-tab invention.
- [x] `1366 × 768`, `1024 × 768`, `768 × 1024`, and `390 × 844` have no
      essential clipping or horizontal overflow.
- [x] Keyboard, focus, dialog scrolling, and touch targets pass review.
- [x] Relevant tests/build/checks pass; the unrelated repository-wide format
      baseline remains reported separately.
- [x] Phase 1 desktop and narrow authenticated evidence matches implementation.

## Phase 2 component responsibilities

- [x] Page-level client orchestration and the empty state remain in
      `ComboManagement.tsx`.
- [x] Rule/group disclosure and eligible-item presentation are isolated in a
      route-local overview component.
- [x] Rule and group/item editor flows have focused route-local owners.
- [x] Repeated feedback, confirmation, footer, and close-on-success behavior is
      composed through route-local dialog support.
- [x] Shared serialized types and pure display formatting are centralized
      without duplicating combo calculation or service validation.
- [x] No speculative `@yuta/ui` primitive or new framework was introduced.
- [x] Existing Server Actions, auth, API/contracts, persistence, and runtime
      ownership are unchanged.
- [x] POS typecheck, tests, production build, and scoped formatting pass after
      extraction.

## Phase 3 interactions and states

- [x] Rule and group disclosures use native buttons with explicit accessible
      names, `aria-expanded`, and `aria-controls`.
- [x] Active rules retain disabled group/item structure actions and explanatory
      text while rule edit and deactivation remain reachable.
- [x] Rule, group, and item editors stay within the viewport with independently
      scrollable fields and persistent action footers.
- [x] Every route-local editor label is programmatically associated with its
      input or select.
- [x] Pending editors prevent dismiss/cancel; pending confirmations guard
      repeated submission and expose processing copy.
- [x] Validation, name/item conflict, active-lock, invalid structure/base group,
      invalid quantity, stale/not-found, and unavailable-service mappings are
      covered by focused tests.
- [x] Stale/not-found errors expose an `Actualiser` recovery without changing
      mutation semantics.
- [x] Authenticated desktop and 390 px browser QA verifies initial focus,
      required-field blocking, confirmation cancellation, focus return, dialog
      containment, and no horizontal overflow without intentional mutation.
- [x] Site-agent-unavailable behavior was verified read-only and the local
      service was restored afterward.
- [x] Existing close-on-success and route revalidation paths remain unchanged;
      no live mutation was submitted solely to manufacture QA evidence.

## Phase 4 data integration

- [x] The page validates the local management session before loading real
      catalogue and combo data.
- [x] Server Actions recover the HttpOnly token, parse `FormData`, and preserve
      existing `/management/combos` and `/orders` layout revalidation.
- [x] POS client mutations validate request/response contracts and forward the
      bearer token; site-agent routes independently require management auth.
- [x] Contract tests cover signed delta, non-negative money, positive
      application caps, non-empty updates, and valid group quantities.
- [x] Guarded database integration covers inactive creation, activation
      structure/base-group checks, case-insensitive conflicts, duplicate items,
      active structural locks, and transactional group deletion.
- [x] Guarded persistence integration covers deterministic order/check
      discounts, item applications, transaction executors, totals, and retained
      name/amount snapshots after rule changes.
- [x] `@yuta/core` remains the only combo-matching calculator; presentation code
      contains formatting only.
- [x] No schema, contract, auth, cloud, device, or runtime code changed in Phase 4.
- [x] The shared-DB financial integration failure was traced to unrelated print
      queue cardinality and reported without deleting operator data.
- [ ] Concurrent management-write hardening requires separate approval because
      current uniqueness/activation validation is not DB-atomic.

## Phase 5 visual and accessibility QA

- [x] Authenticated populated as-built captures exist for all four POS QA
      viewports.
- [x] Document-level horizontal overflow is zero at every captured viewport.
- [x] Rule disclosure responds to keyboard activation and retains truthful
      `aria-expanded` state.
- [x] Visible focus, initial dialog focus, Escape dismissal, and focus return
      are browser-verified.
- [x] The narrow rule editor remains inside `390 × 844`; fields scroll while
      its action footer remains visible.
- [x] Empty required submission is blocked locally and focuses the invalid name
      input without issuing a mutation.
- [x] Route-local rule, group, item, activation, and delete actions have a
      minimum `44 × 44` target after Phase 5 polish.
- [x] Active structural controls remain visibly disabled and unavailable.
- [x] POS typecheck, 34 tests, production build, scoped formatting, UI pack,
      docs, and architecture checks pass after the final adjustment.
- [x] Intentional differences from generated imagery are recorded as repository
      component, semantic-token, real-data, and stronger narrow-stacking
      fidelity.
- [x] Product owner approved Phase 5 and the final as-built delivery on
      2026-08-13.
