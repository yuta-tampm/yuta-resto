# POS Order Detail - Acceptance Checklist

## Active receipt-printing Phase 0 gate

- [x] Git status was inspected and unrelated Backoffice/personnel and existing
      POS order-detail work was preserved.
- [x] Root, POS, site-agent, contracts, db-pos, architecture, product,
      operator, offline, QA, operations, UI workflow, and stable page-pack
      authorities were reviewed.
- [x] Containing target remains `PAGE` / `EXISTING_PAGE`; the receipt flow is
      `NEW_CAPABILITY_DISCOVERY` and `device-coupled`.
- [x] Current enum/schema/contract scaffolding was distinguished from missing
      route/action/snapshot/renderer/worker behavior.
- [x] Payment and integration-test truth confirms no current receipt job.
- [x] Service-time staff attribution was distinguished from authorization;
      management PIN/bearer was not assumed.
- [x] Existing final paid-order screenshots were accepted as the current
      containing-page baseline; no active order was opened.
- [x] Live printer status was read-only and reported `not_configured`, worker
      `disabled`, and 13 pending jobs; no new job was created.
- [x] Stale POS documentation claiming receipt creation and no physical printer
      integration was reconciled with current code/tests and device docs.
- [x] Proposed change impact is recorded as contract/API/auth/device/database
      `PROPOSAL`, not approved implementation.
- [x] Fixture replacement remains forbidden and no runtime/operational data was
      changed.
- [x] Product approved a paid non-fiscal receipt; addition and fiscal/VAT
      documents remain excluded.
- [x] Product approved whole paid `single` orders and each paid split check.
- [x] Product approved explicit printing only, outside payment capture.
- [x] Product approved service-time local access without invented role claims.
- [x] Product approved authoritative local snapshot content and a neutral
      non-fiscal heading, with merchant legal/VAT identity excluded.
- [x] Product approved one current-printer copy, durable degraded enqueue, and
      immutable-snapshot reprint behavior.
- [x] Product placed the route-owned action in the existing three-line menu,
      separated from shared Commandes/Cuisine/Gestion navigation.
- [x] Receipt-specific design prompt is `READY` after those decisions.
- [x] Design generation received separate explicit approval on 2026-08-18.
- [x] Desktop, landscape-tablet, portrait-tablet, mobile, and state-board draft
      references were generated and saved in the page pack.
- [x] Targeted review removed unsupported refund content and retained the
      three-line trigger on tablet.
- [x] Designs distinguish queued/unavailable/failed/printed states and label
      the proposed capability as not implemented.
- [x] Product approved the selected Phase 1 design direction on 2026-08-18.
- [x] Phase 2 received separate explicit approval on 2026-08-18.
- [x] All current `PosPageShell` consumers and custom secondary navigation were
      audited before proposing a shared composition change.
- [x] `pageMenuActions` is additive; order detail does not replace or copy
      Commandes/Cuisine/Gestion navigation.
- [x] The proposed controlled client boundary owns menu behavior only;
      `PosPageShell`, `PosHeader`, and the route stay Server Components.
- [x] Receipt UI/model/action ownership remains route-local and no business
      component is promoted to `@yuta/ui`.
- [x] Paid single/check targets, disabled unpaid-check context, equal-split
      limits, UUIDv7 intent, polling, terminal states, retry, and reprint are
      specified.
- [x] Service-time availability remains distinct from management auth and staff
      attribution remains non-authorizing.
- [x] Phase 2 changed documentation only; no runtime or operational data changed.
- [x] Product approved PB2-01 through PB2-14 for Phase 3 implementation on
      2026-08-18.
- [x] Phase 3 received separate explicit approval on 2026-08-18.
- [x] Contracts define paid receipt targets, print/retry/reprint intent,
      UUIDv7 operation identity, target view, command result, and job status.
- [x] Site-agent validates the paid order/check target, snapshots authoritative
      local data, creates a durable idempotent `customer_receipt` job, and owns
      retry/reprint from the immutable source snapshot.
- [x] The local worker claims and renders one neutral, non-fiscal `REÇU DE PAIEMENT` copy.
- [x] `pageMenuActions` is implemented additively and the route-owned receipt
      action appears before shared navigation in the three-line menu.
- [x] The client distinguishes unpaid, queued, printer-unavailable, failed,
      printed, retry, and reprint states and polls only a visible pending job.
- [x] Payment capture remains uncoupled and no schema, migration, cloud lookup,
      management authorization, merchant identity, VAT, or fiscal claim was
      added.
- [x] Contract, POS, site-agent, db-pos, HTTP-boundary, renderer, disposable-
      PostgreSQL integration, production build, offline acceptance, page-pack,
      docs, architecture, and workspace typechecks pass.
- [x] No receipt command was submitted and no physical output was claimed.
- [x] Phase 5 browser/device QA received separate approval on 2026-08-18.
- [x] Functional, responsive, degraded-printer, and disposable production-worker
      verification passed without submitting an operational receipt command.
- [ ] Physical Linux/TM-m30 output remains deferred because no configured local
      device is available; physical success is not claimed.

The receipt slice is implemented and Phase 5 browser QA is complete. Physical
printer verification and merchant-profile configuration remain separately
deferred. The completed checks below also retain the previous visual-renewal
lifecycle evidence.

## Phase 0 repository and scope

- [x] Git status was inspected first; unrelated work was preserved.
- [x] Root/app instructions and current product, operator, offline, QA,
      local-development, deployment, and UI workflow docs were read.
- [x] Target is `PAGE`, `EXISTING_PAGE`, `integrated`,
      `EXISTING_CAPABILITY_RENEWAL`.
- [x] Real loaders, contracts, site-agent/db-pos ownership, actions,
      transactions, tests, polling, offline, and printer boundaries were mapped.
- [x] Staff attribution was distinguished from authentication/authorization.
- [x] Database/API-contract/permission-auth/runtime-device flags are recorded.
- [x] Fixture replacement is forbidden.
- [x] No runtime code or operational order/payment/kitchen/print data changed.

## Shared context and baseline

- [x] Shared context is `RESOLVED` with exactly
      `REUSE_APPROVED_SHARED_SHELL`.
- [x] Global/app/flow/page layers and real routes are documented.
- [x] Management/login/Backoffice shell behavior is excluded.
- [x] Real desktop and narrow baselines include route, state, viewports, date,
      health, data, session, overflow, and loader-safety conditions.
- [x] Unsafe/unavailable real states are recorded as truthful blockers.
- [x] Baseline images are evidence, not approved design authority.

## Behavior protection

- [x] Loader optimization side effect and request shape are documented/deferred.
- [x] Totals, locks, state transitions, allergies, idempotency, exact kitchen
      batch, print jobs, soft cancellation, and health truthfulness are protected.
- [x] Every visible navigation/action and its current condition is mapped.
- [x] Placeholder creator/printer rows and heuristic history limitations are
      identified.
- [x] Unsupported concepts are explicit and were not invented.

## Design handoff

- [x] Design prompt is self-contained and `READY`.
- [x] Prompt covers real fields/states, desktop/tablet/mobile, routes/actions,
      empty/loading/error/degraded states, touch/accessibility, shell, invariants,
      and explicit exclusions.
- [x] Product owner approved Phase 0 and design generation.
- [x] Product owner requested a read-only `Remise` disclosure, collapsed by
      default with real discount detail available when expanded.
- [x] Product scope is `APPROVED` for Phase 1.
- [x] The responsive `v2` references and discount study are `APPROVED`.
- [x] Package is `implementation-ready`.

## Later implementation and QA gates

- [x] Existing implementation is renewed without fixtures or data-access rewrite.
- [x] Focused rendered-component tests cover the approved disclosure behavior.
- [x] Functional/regression checks pass before visual QA.
- [x] Desktop/tablet/narrow production-browser evidence is attached.
- [x] Horizontal overflow is zero and disclosure focus/touch behavior is
      verified on the safe paid state; unavailable mutation/error states remain
      documented rather than fabricated.
- [x] `pnpm ui:pack:check pos-order-detail` passes.
- [x] `pnpm docs:check`, `pnpm architecture:check`, and
      `pnpm -r --if-present typecheck` pass.
- [ ] Full `pnpm format:check` remains blocked outside this page scope by the
      generated `apps/backoffice/.next-codex-stale-20260817-1/` tree and other
      pre-existing unrelated files; scoped Prettier passes.
- [x] `pnpm typecheck:pos`, `pnpm test:pos`, and `pnpm build:pos` pass.
- [ ] Affected site-agent/db-pos/contracts/offline checks pass if those
      boundaries are explicitly approved to change.
- [x] Stable pack matches as-built implementation before status `implemented`.

## Phase 2 component boundary gate

- [x] Product owner explicitly approved Phase 2 on 2026-08-17.
- [x] Loader, action eligibility, and layout orchestration remain in the route
      Server Component.
- [x] Meaningful page-owned presentation responsibilities were extracted into
      the nearest route `_components` folder.
- [x] Deterministic labels and progression derivation live in route-local
      `_lib` with no persistence, transport, or side effects.
- [x] No new client boundary, shared-shell change, app-wide promotion, or
      `@yuta/ui` business component was introduced.
- [x] Phase 1 visuals, the default-collapsed `Remise` disclosure, and all
      loader/action/runtime invariants are preserved.
- [x] Phase 2 scoped checks and safe paid-order browser evidence pass.
- [x] Phase 3 has separate explicit approval.

## Phase 3 discount-detail gate

- [x] Product owner explicitly approved Phase 3 on 2026-08-17.
- [x] Expanded discount rows use only persisted discount and order-item
      snapshots already present in the local order-detail contract.
- [x] Applied quantities and snapshot names are visible beneath the matching
      discount name/amount; missing item detail is not inferred from catalog.
- [x] Disclosure remains closed by default, semantic, read-only, and contains
      no apply/edit/remove/recalculate control.
- [x] No loader, contract, database, combo-engine, action, client boundary, or
      runtime ownership change was introduced.
- [x] Phase 3 scoped checks and safe paid-order browser evidence pass; native
      keyboard automation remains limited by the in-app driver's focus target.
- [x] Phase 4 has separate explicit approval.

## Phase 4 data-integration gate

- [x] Product owner explicitly approved Phase 4 on 2026-08-17.
- [x] db-pos discount/item persistence ownership was traced without mutation.
- [x] Site-agent join and strict local POS contract already expose applied
      quantities and historical item-name snapshots.
- [x] The server-only POS adapter passes validated data through without catalog
      inference or combo recalculation in presentation.
- [x] Safe paid-order detail payload matches the Phase 3 rendered composition.
- [x] No field, contract, API, schema/migration, auth, transaction, runtime,
      device, printer, or persistence change is required.
- [x] Loader optimization and request reduction remain separately deferred.
- [x] Phase 5 has separate explicit approval.

## Approved visual-correction gate

- [x] Product owner identified substantial visual drift and approved correction
      before Phase 5.
- [x] Desktop summary, four metrics, three locked actions, item list, connected
      progression, totals, information, and destructive separation follow the
      approved `v2` hierarchy.
- [x] Narrow summary, three compact metrics, paid-state banner, action row,
      stacking, and touch density follow the approved `v2` direction.
- [x] Real table/status/item/discount values override generated artifacts.
- [x] Existing action conditions and shared-header ownership remain preserved.
- [x] No data, contract, schema, calculation, mutation, auth, runtime, device,
      printer, or client-boundary change was introduced.
- [x] Safe paid-order QA passes at 1366x768, 1024x768, 768x1024, and 390x844
      with zero horizontal overflow.
- [x] Phase 5 has separate explicit approval after correction review.

## Approved summary/action state design

- [x] Product owner approved the generated summary/action mockup before code
      implementation.
- [x] Completed kitchen send is gray with a check and explicit completed label.
- [x] The current primary action is solid green; available secondary actions use
      pale green so they do not blend into the white page.
- [x] Existing action eligibility and runtime/data boundaries remain unchanged.

## Phase 5 visual and operational QA

- [x] Product owner explicitly approved Phase 5 on 2026-08-18.
- [x] Final production-browser evidence uses only the established safe paid
      order; no active order or command action was opened/submitted.
- [x] Exact 1366x768, 1024x768, 768x1024, and 390x844 viewports have zero
      document/body horizontal overflow and contained vertical scrolling.
- [x] The 768px summary uses a readable 2x2 fact layout with no truncated value.
- [x] Completed and unavailable actions render neutral gray; desktop/tablet
      controls are 48px high and narrow controls are 64px high.
- [x] `Remise` is closed by default and click/touch expansion shows the persisted
      discount name, amount, and item composition without changing totals.
- [x] Native summary focusability and visible focus styling remain present; the
      in-app driver limitation for synthetic Enter activation is documented.
- [x] Health reports local service/database available and printer unconfigured;
      unsupported creator/printer placeholders remain absent.
- [x] Browser warnings/errors are empty and final as-built screenshots are
      attached to the page pack.
- [x] No data, contract, schema, calculation, mutation, authorization, runtime,
      device, printer, or client-boundary change was introduced.
- [x] Package status is `implemented`; loader optimization/request reduction and
      unavailable safe non-paid/error/allergy states remain deferred.
