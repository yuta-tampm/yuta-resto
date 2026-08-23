# POS Order Items - Implementation Plan

Status: Phase 5 combo-completion delivery complete

Visibility: Engineering

## 2026-08-23 suggestion-eligibility extension

Extension Phase 4 is complete. The route-local adapter now excludes active
rules whose persisted `isSuggestionEnabled` preference is false before calling
the existing completion projection. The payment facade and payment/item-split
consumers retain the unchanged full active-rule list, so configuration cannot
disable a discount. Focused POS regression covers enabled and opted-out rules;
no endpoint, contract, schema, permission, category heuristic, or hard-coded
combo identity was added. Stop for Extension Phase 5 authenticated responsive
QA approval.

Extension Phase 5 consumer QA is complete at the four required production
viewports with zero document overflow. Search hiding/restoration, category
dismissal, unrelated-item stability, and renewed same-rule eligibility after
another Gua Bao pass without a QA-only mutation. Cross-route completion now
includes authenticated `/management/combos` desktop and narrow evidence.

## Reopened initiative — combo-completion suggestions

### Phase 0 — Repository analysis and design handoff

Audit the current order/catalog/combo loader, optimizer ownership, add-item
action, locks, tests, and local runtime boundaries. Capture a real order with a
partial combo without submitting controls. Update this stable page package and
prepare a self-contained design prompt. Do not change runtime code or data
models. Stop for product-owner approval.

### Phase 1 — Approved visual direction

Generate and review desktop and narrow studies for the compact suggestion
shelf and its required states. Preserve the current three-panel desktop and
stacked narrow composition. Do not implement runtime behavior, duplicate menu
items, or invent management configuration. Stop after design approval.

Delivered for review on 2026-08-22: corrected desktop and 390x844 narrow
references add only the approved shelf. Repository review corrected generated
candidate initials and restored the real two-row narrow category pattern and
`Plat du jour` label. The product owner approved both references by authorizing
Phase 2 on 2026-08-22.

### Phase 2 — Pure completion projection

After approval, add a tested pure domain projection that shares authoritative
combo-optimizer semantics. Cover one-item completion, overlap/priority,
bounded applications, unavailable and stale candidates, and deduplication.
Keep catalog availability mapping in POS and calculation ownership outside
React presentation. Stop for behavior review.

Delivered for review on 2026-08-22:
`calculateComboCompletionSuggestions` lives with the authoritative core combo
calculator and simulates one candidate unit through
`calculateComboDiscounts`. Qualification requires both an additional positive
application and an increased total discount. The result carries only rule
identity/priority and candidate menu-item identity; POS catalog filtering and
presentation remain deferred to Phase 3. Nine core tests pass, including the
new suggestion scenarios. No UI or integration boundary changed.

### Phase 3 — Route-local interaction

Render the approved shelf from real loader data and submit candidates through
the existing `addOrderItemAction`. Preserve pending/error behavior, current
locks, snapshots, validation, and non-optimistic reload. Do not add a new
command or persistence. Stop for operator review.

Delivered for operator review on 2026-08-22: the Server Component maps real
non-cancelled order items, active rules, and active/available catalog items
through a route-local presentation adapter into the pure core projection. The
approved shelf is rendered below search and above the catalog grid, disappears
during active search and for locked orders, and groups candidates by combo with
catalog ordering inside each group. Each candidate submits the existing
`addOrderItemAction` with a visible disabled pending state; no optimistic price
or order state is introduced. Focused POS tests pass. No transport,
persistence, authorization, kitchen, payment, printing, offline, or device
boundary changed. The product owner approved this interaction by authorizing
Phase 4 on 2026-08-22.

### Phase 4 — Integration and boundary audit

Map the as-built projection to current catalog and order contracts. Confirm no
API, contract, site-agent, db-pos, schema, authorization, payment, kitchen,
printing, offline, or device extension occurred. Run the functional/regression
gate before visual QA.

Delivered on 2026-08-22: the diff audit confirms no change in contracts,
site-agent, db-pos, migrations, POS transport/facade, Server Action schemas,
manifests, or the lockfile. The suggestion uses existing loader fields and the
existing add-item mutation; service-owned locks, availability, snapshots,
ordering policy, totals, and transactions remain authoritative. The complete
local test gate, production POS build, offline disposable-database acceptance,
workspace typechecks, architecture, docs, page-pack, scoped formatting, and
diff checks pass. Repository-wide formatting is blocked only by two unrelated
dirty Backoffice formalities files, which remain untouched. No Phase 4 runtime
change was required. Stop for product-owner approval before Phase 5.

### Phase 5 — Visual and operational QA

Verify real data at 1366x768, 1024x768, 768x1024, and 390x844. Check catalog
density, three-column preservation, mobile containment, 44px actions, search
ownership, pending behavior, overlap correctness, and zero horizontal overflow.
Synchronize product/operator docs and this package with the as-built result.

Operator-feedback correction on 2026-08-22: mobile QA found that the implicit
category grid row stretched into unused viewport space and that normal catalog
cards lacked visible pending feedback. The route now start-aligns mobile grid
content while retaining desktop stretch, and item cards show a disabled
`Ajout...` overlay during the existing Server Action. Focused 390x844 browser
verification and POS regression checks pass. The full Phase 5 viewport and
operational matrix remains pending.

Category-visibility correction on 2026-08-22: suggestions remain eligible in
every catalog category. Category navigation dismisses the current shelf using
an ephemeral token containing each combo-rule ID and its relevant item
quantities. Unrelated item changes keep that state dismissed, while another
rule-relevant item creates a new suggestion state. No
persisted dismissal, catalog duplication, or service contract was added.

Delivered on 2026-08-22: production-build browser QA passed at 1366x768,
1024x768, 768x1024, and 390x844 with zero document overflow and no browser
warning or error. Phase 5 corrected the suggestion group layout at 1024px so
the first 44px add action is visible without horizontal discovery while the
required three-panel workspace remains intact. Search hiding/restoration,
category dismissal, direct-category eligibility, 44px targets, mobile order
reachability, and real multiple-group rendering pass. Deterministic tests
cover the states that would otherwise require unnecessary operational data
mutation. Evidence and the stable package are synchronized as implemented.

## Phase 0 — Repository analysis gate

Run `prompts/00_REPOSITORY_ANALYSIS.md`. Produce the complete Implementation
Inventory. Make no code changes.

Do not continue while the target application/runtime, classification,
data/session boundary, protected invariants, current visual baseline, or
required commands remain ambiguous.

Resolve the YUTA-global, application, section/flow, and page UI context. Record
the shell/navigation mode, real routes, approved shared references, reusable
patterns, allowed adaptations, and explicit exclusions. Set
`Shared context status: RESOLVED` before the design prompt becomes `READY`.

After the inventory, complete `DESIGN_HANDOFF.md`: capture the current visual
baseline for an existing target (or record a truthful blocker), then prepare a
self-contained design-generation prompt for ChatGPT/ImageGen or another
approved design tool. This handoff is documentation/design preparation, not UI
implementation.

## Phase 1 — Approved visual baseline implementation

For `NEW_PAGE`, typed fixtures may be used only when explicitly approved.

For `EXISTING_PAGE`, improve the real implementation in place. Preserve real
data, authorization/session, mutations/actions, validation, transport,
polling/offline/device behavior, and tests.

Do not change contracts, permissions, schema, or unrelated routes.

For this route, renew the existing three-column/narrow-dialog composition in
place against real order and catalog data. Preserve every loader, Server Action,
edit lock, order state, and send behavior. Start only after Phase 0 and the
generated design direction are explicitly approved.

## Phase 2 — Component refactor

Extract meaningful units by responsibility while preserving appearance and
behavior. Reuse `@yuta/ui`; do not prematurely promote feature-specific
components to the shared package.

Keep the existing route-local responsibility components unless later evidence
proves a clearer boundary. Shared shell changes require separate impact review.

Delivered for review: the desktop summary and narrow dialog now share a
route-local order-item presentation model, detail renderer, and quantity
controls. Trusted loading and presentation mapping remain in the Server
Component, while action-bearing forms stay in the existing client boundary.
After product-owner review, the category submenu remains the first column of
the fixed three-column desktop workspace and changes to a horizontal scroller
only on narrow layouts. Its existing query-route behavior, real data, and
operational ownership are unchanged.

## Phase 3 — Approved interactions

Implement only approved interactions and current state transitions. Preserve
authoritative business logic and the current trusted boundary.

Limit work to approved improvements around existing add/update/remove,
instruction/allergy, search/category, mobile summary, and kitchen-send
interactions. Do not add optimistic transaction claims or new commands.

Implement the approved post-send success state from a confirmed Server Action
result, with `/pos` and `/` as the only actions. Preserve site-agent command
ownership and UUIDv7 replay. Do not treat an untrusted query parameter or
physical printer state as proof of kitchen-send success.

Delivered for review: a typed Server Action result activates a route-scoped
success boundary only after the existing site-agent command resolves. The
pending, allergy-confirmation, and service-error paths remain intact. The
success view moves focus to its status region, counts down for five seconds
before navigating to the approved home route `/`, keeps the immediate `/pos`
and `/` actions, and does not claim that durable transaction or print-job
creation proves physical printing. Other consumers of the shared send button
retain their existing refresh behavior.

## Phase 4 — Data integration or extension

Map the current domain and transport first. Existing pages normally require no
data rewrite for a visual refactor. Stop for approval before adding fields,
enums, permissions, contracts, APIs, schema/migrations, runtime dependencies,
or privileged device settings.

Expected result for this existing integrated page is a no-change integration
audit. Any new API/contract/schema/auth/runtime requirement stops the phase.

Delivered for review: the audit maps every renewed UI state back to the current
payment-summary, order-detail, catalog, and order-command transports. The
presentation model and category scroller consume existing serialized data; the
post-send action result and redirect timer are ephemeral UI state. No diff
exists in contracts, site-agent, db-pos, manifests, or the lockfile, and no
schema, API, auth, transaction, offline, printer, or runtime extension is
required.

## Functional and regression verification gate

Before Phase 5, run applicable behavior-protecting tests, target-application
typecheck/tests/build, and affected contract/domain/database/runtime/device
checks. Resolve regressions before declaring visual parity.

## Phase 5 — Visual and responsive QA

Use the target application's viewport/device matrix and operational QA
requirements only after the functional/regression gate. Run exact existing
repository checks, attach evidence, and synchronize the page package with the
as-built result.

Delivered: final clean-production browser QA passed at 1366x768, 1024x768,
768x1024, and 390x844 with zero document overflow and no browser warning or
error. A Phase 5 correction changes only the 1024px catalog from three
over-compressed cards to two readable cards while preserving the required
three-panel layout. Four as-built screenshots are attached, the functional and
repository gates pass, deviations/limitations are recorded, and the stable
package is synchronized as implemented.

## Delivery evidence

Report files changed, protected invariants, commands/results, browser/device
evidence, deviations, blocked proposals, and risks.
