# POS management combos

Status: Extension Phase 5 complete; suggestion eligibility implemented

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/management/combos`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Package status: `approved`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

## 2026-08-23 Phase 0 — combo suggestion eligibility

Staff feedback identifies a new local management need: some valid payment
combos contain too many eligible items to produce a useful order-entry
suggestion shelf. Repository evidence confirms that `Menu Gourmand` and
`Menu Express` each currently reference 27 distinct eligible items, while
`Gua Bao Happy` references 5 and `Combo Été` references 3. Candidate count is
not a stable product rule, so the proposal does not infer eligibility from
names, group counts, or item counts.

The target is a cross-route `FLOW` over two existing integrated pages:
`/management/combos` owns configuration and `/orders/[orderId]/items` consumes
it. The capability itself is absent, so the delivery mode is
`NEW_CAPABILITY_DISCOVERY`. This stable management page pack remains the
primary owner; `pos-order-items` records the consumer boundary rather than
creating a duplicate package.

Repository reality requires one persisted boolean on each local combo rule,
provisionally named `isSuggestionEnabled`. It travels through the existing
catalog contract and management PATCH endpoint. The order-entry adapter filters
disabled rules before calling the existing pure completion calculator. Payment
and check optimization continue to receive every active rule, so disabling a
suggestion cannot disable, change, or recalculate the combo discount itself.

Phase 0 proposes a compact, text-backed per-rule setting in the existing rule
header: `Suggestion à la commande`, with `Activée` / `Désactivée`, pending,
success, and error feedback. It remains editable while a rule is active because
it changes presentation eligibility only, not group/item structure or pricing.
The existing `admin` / `manager` management authorization remains sufficient;
no new role or permission is proposed.

Current authenticated recapture was blocked because the fresh browser session
correctly redirected to `/management/login`; no PIN was requested or entered.
The package's existing authenticated desktop and narrow baselines remain valid
implementation context because the target management code has not changed.
A fresh authenticated capture is required before the extension can advance to
approved or implementation-ready status.

### Phase 0 change impact

```text
Files expected to modify: combo schema/migration, local-pos contracts, site-agent catalog mapping and combo service, management combo action/UI, order-items suggestion adapter, focused tests, current POS docs and both stable page packs
Files expected to create: one db-pos migration and focused tests only if current test owners do not already cover the behavior
Packages affected: packages/db-pos, packages/contracts, apps/site-agent, apps/yuta-pos, docs/ui
Cross-application impact: none; local POS family only
Database change: YES / PROPOSAL — one non-null boolean on combo_rules
API or contract change: YES / PROPOSAL — extend existing combo rule shapes and PATCH input
Permission/auth change: NO
Runtime/device change: NO
Payment/kitchen behavior change: NO
```

### Protected invariants

- `isActive` remains the only switch controlling discount calculation.
- Suggestion eligibility affects only the order-entry suggestion shelf.
- Existing combo matching, priority, pricing, maximum applications, order/check
  discount persistence, and historical snapshots remain unchanged.
- Active structural locks remain unchanged; the suggestion switch is not a
  structural edit.
- Configuration remains local through `yuta-pos -> site-agent -> db-pos` and
  requires the existing trusted management session.
- No automatic item-count threshold, name matching, hard-coded combo ID,
  browser-local setting, cloud sync, kitchen behavior, or new permission.

### Approved product decisions

Product-owner authorization to begin Phase 1 on 2026-08-23 approves these
Phase 0 decisions:

1. Existing and newly created combo rules default to suggestion eligibility
   `ON`; managers opt out only rules that are operationally noisy.
2. The setting remains independently editable for active and inactive rules;
   inactive rules are never suggested regardless of the stored preference.
3. Eligibility is entirely explicit; YUTA does not automatically disable long
   combos or cap their candidates as part of this capability.

### Phase 1 design result

Built-in ImageGen produced separate desktop and narrow proposals from the
approved as-built references. The first generation was corrected because it
repeated `Priorité 10` and illustrative pricing across multiple rules. The
selected references now use current catalog metadata: Menu Gourmand
priority 10 / base + 8,00 €, Menu Express priority 30 / base + 4,00 €,
Gua Bao Happy priority 20 / fixed 12,50 €, and Combo Été priority 40 / base +
2,50 €.

Both proposals preserve the approved Management shell and make `Active`
discount state visually independent from `Suggestion à la commande`. Desktop
uses a compact rule-header setting; narrow layouts wrap it into a full-width
44px row without compressing rule names or existing actions. Proposed visual
states show broad Menu Gourmand/Menu Express suggestions disabled and focused
Gua Bao Happy/Combo Été suggestions enabled. These values illustrate the
approved configuration capability; Phase 1 does not persist them.

Selected files, approved by the product owner on 2026-08-23:

- `references/design-proposal-04-suggestion-config-desktop.png`;
- `references/design-proposal-05-suggestion-config-narrow.png`.

No runtime, schema, migration, API, contract, auth, discount, order, or combo
data changed in Phase 1. The product owner explicitly approved the selected
design and authorized Phase 2 despite the fresh-login baseline blocker.
Baseline status therefore remains `BLOCKED`, while reference status is now
`APPROVED`.

### Extension Phase 2 result

Phase 2 adds `combo_rules.is_suggestion_enabled` as a non-null local boolean
with a default of `true`. Generated migration `0011_clever_groot.sql` preserves
existing behavior by backfilling deployed rules through that default. The
field is required in combo responses, defaults to `true` on create, and is an
optional field on the existing authenticated rule PATCH contract.

Site-agent now maps the preference through management responses and the real
catalog projection. Active rules may update this presentation preference
without deactivation; group/item structural locks remain unchanged. A focused
persistence regression stores an active combo with suggestions disabled and
still expects the same order/check discount, protecting `isActive` as the sole
calculation switch.

No management switch or order-entry filtering is implemented in Phase 2.
Migration `0011` is generated and reviewed but is not applied to the current
operational POS database. Phase 3 requires a separate product-owner approval.

Phase 2 verification passes contracts `34/34`, db-pos `15` unit/schema tests,
site-agent `70` unguarded tests, POS `86/86`, the two focused guarded combo
integration tests, full workspace typecheck, docs, architecture, formatting,
and `git diff --check`. The offline disposable acceptance also applied all
migrations through `0011`, seeded real local data, built the production POS,
and passed the offline site-agent/POS flow. All disposable containers were
removed afterward.

### Extension Phase 3 result

The approved route-local `Suggestion à la commande` control now appears in
each real combo-rule header. It uses the existing `@yuta/ui` `Switch`, keeps the
discount `Active` badge visually and semantically independent, and remains
editable for active or inactive rules. An enabled preference on an inactive
rule explicitly says that inactive rules cannot be suggested.

The control submits a dedicated Server Action through the existing trusted
management-session and combo PATCH path. It stays on the persisted server value
while saving, blocks duplicate submissions, announces `Enregistrement…`, and
shows persisted success or recoverable error feedback in the rule surface.
Successful updates revalidate both `/management/combos` and the order layouts.
The narrow layout gives the setting its own full-width row; desktop promotes it
to a separate rule-header column without compressing rule names or existing
actions. The switch retains visible focus and an effective 44px touch target.

Phase 3 adds no order-items filtering, discount-calculation change, endpoint,
permission, schema, fixture, or operational-data mutation. The operational
database remains unmigrated and authenticated browser capture remains deferred
to Phase 5. Phase 4 requires separate product-owner approval.

Phase 3 verification passes POS `90/90`, the full local suite, production build,
full workspace typecheck, docs, architecture, formatting, and
`git diff --check`. Offline acceptance applied migrations through `0011` only
inside its disposable PostgreSQL stack, then verified the production POS and
local site-agent with the Internet probe unavailable. The stack was removed on
completion.

### Extension Phase 4 result

The route-local completion adapter now removes rules with
`isSuggestionEnabled === false` immediately before invoking the authoritative
completion projection. The payment view continues to expose every active combo
rule to payment and item-split discount calculation; its `activeComboRules`
selection is unchanged. This keeps the preference presentation-only.

Focused POS coverage proves an active enabled rule still produces its expected
candidate and an otherwise identical active opted-out rule produces no shelf
entry. The existing guarded persistence regression continues to prove that the
same opted-out active rule calculates and persists normal order/check
discounts. No category/name/item-count heuristic or hard-coded combo identity
was introduced.

Phase 4 requires no new endpoint, contract, schema, authorization, mutation,
payment, kitchen, printing, offline, or device behavior. Phase 5 authenticated
responsive and as-built QA requires separate product-owner approval.

Phase 4 verification passes POS `91/91`, db-pos `15` unguarded tests,
site-agent `70` unguarded tests, production build, and the complete local gate.
Offline acceptance applies migrations through `0011` inside a disposable
PostgreSQL stack and verifies the production POS/site-agent with the Internet
probe unavailable. Repository-wide typecheck, docs, architecture, formatting,
and diff gates also pass.

### Extension Phase 5 result

The product owner authorized Phase 5 on 2026-08-23. Production-browser QA of
the real order-entry consumer passes at `1366 × 768`, `1024 × 768`,
`768 × 1024`, and `390 × 844`, with zero document-level horizontal overflow.
The shelf remains readable, desktop preserves three columns, narrow layouts
retain the two-row category control and reachable order bar, search hides and
restores the shelf, and category navigation dismisses the current rule-state
fingerprint. Read-only QA also confirms that unrelated items retain dismissal
while another rule-relevant Gua Bao permits a fresh suggestion state.

After the operator authenticated locally without sharing the PIN, the real
`/management/combos` route passed the same four-viewport matrix with zero
document-level horizontal overflow. All four persisted controls are present:
Menu Gourmand/Menu Express are suggestion-disabled and Gua Bao Happy/Combo Été
are suggestion-enabled, while all four discount rules remain independently
Active. Desktop keeps the compact rule-header control; `768` and `390` widths
wrap it into a readable full-width row. Each switch has an explicit rule-aware
accessible name and a `44px`-wide control with a pseudo-element extending the
effective vertical target to `44px`. The four authenticated as-built captures
are stored in `references/`. No switch, combo, order, payment, kitchen, or
operational-data mutation was submitted solely for Phase 5 QA.

## Target

- Application: `apps/yuta-pos`
- Route: `/management/combos`
- Page slug: `pos-management-combos`
- Operator language: French
- Runtime boundary: local restaurant POS only

This package governs the existing authenticated combo-rule management page. It
does not authorize a replacement implementation, fixture data, cloud storage,
or a new combo domain.

## Current implementation

The existing Server Component route requires a validated local admin or
manager session and loads the real local catalogue through `site-agent`.
`ComboManagement.tsx` owns page-level client orchestration and the empty state;
`ComboOverview.tsx` owns rule/group disclosure and eligible-item rows;
`ComboSuggestionControl.tsx` owns the independent persisted suggestion setting;
`ComboRuleDialogs.tsx` owns rule editing and activation;
`ComboGroupDialogs.tsx` owns group and eligible-item editors; and
`ComboDialogSupport.tsx` owns route-local feedback, confirmation, and dialog
lifecycle helpers. `combo-model.ts` contains serialization-derived UI types and
pure price-summary formatting only.

This Phase 2 decomposition preserves the Phase 1 hierarchy and every existing
Server Action binding. It does not alter transport, validation, persistence,
pricing, authorization, or mutation semantics, and it adds no shared primitive.

Phase 3 keeps dialog headers and action footers visible while long editor fields
scroll inside the viewport, associates every route-local field label with its
control, prevents dismiss/cancel while a submission is pending, and exposes an
`Actualiser` recovery for stale rule/group/item references. Inline validation,
conflict, unavailable-service, confirmation, and close-on-success semantics
remain driven by the existing Server Actions.

Phase 4 re-audited the complete local integration chain without changing
runtime code: the authenticated page and Server Actions, shared Zod contracts,
bearer-authenticated site-agent mutations, db-pos transaction ownership,
route revalidation, `@yuta/core` calculation, and order/check discount snapshots
remain aligned. Focused contract and guarded database integration tests now
protect combo management and persistence behavior directly.

Phase 5 verified the authenticated as-built page at `1366 x 768`,
`1024 x 768`, `768 x 1024`, and `390 x 844`. All four viewports have zero
document-level horizontal overflow. Keyboard disclosure, visible focus, dialog
initial focus, required-field blocking, Escape dismissal, focus return, active
locks, and viewport-contained dialog scrolling were verified without creating
or changing combo data. Route-local action triggers now expose a minimum
`44 x 44` touch target; shared-shell sizing remains owned by
`ManagementHeader.tsx`.

## Protected invariants

- Preserve the local-only `yuta-pos -> site-agent -> db-pos` ownership chain.
- Keep the trusted HttpOnly management session and server-side bearer
  forwarding unchanged.
- Preserve real runtime data, shared Zod contracts, service validation, and
  route revalidation.
- Keep active-rule structural locks, activation requirements, pricing modes,
  priority, maximum applications, group quantities/order, eligible-item
  supplements, and no-hard-delete behavior.
- Keep combos as payment discounts rather than kitchen production items, and
  preserve historical discount snapshots.

## Authority order

1. root and `apps/yuta-pos/AGENTS.md`;
2. `docs/CURRENT_STATE.md` and `docs/products/pos/*`;
3. `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`, `PAGE_PACK_PROTOCOL.md`,
   `YUTA_FRONTEND_RULES.md`, and `POS_FRONTEND_RULES.md`;
4. current contracts, site-agent services, db-pos schema/repositories, code,
   and tests;
5. this package;
6. visual references for hierarchy, density, proportion, spacing, and tone
   only.

## Implementation Inventory

1. **Target:** local POS page `apps/yuta-pos`, real route
   `/management/combos`.
2. **Target type:** `PAGE`.
3. **Maturity:** `EXISTING_PAGE`.
4. **Implementation class:** `integrated`; it loads real local catalogue and
   combo data and submits real mutations.
5. **Route and container:** `management/combos/page.tsx` owns session gating,
   loading, service failure, page header, and composition;
   `ComboManagement.tsx` owns the client-side rule/group/item UI and dialogs.
6. **Shell:** the page now reuses the approved POS Management
   `management/_components/ManagementHeader.tsx` used by catalog and printing,
   with the route-local title and actions retained in the content area.
7. **Auth/session:** the HttpOnly `yuta_pos_management_session` cookie is read
   on the Next.js server and validated through site-agent. Only active local
   `admin` and `manager` sessions may enter. Browser-supplied roles are not
   trusted.
8. **Data owner:** `apps/site-agent` owns combo management and accesses
   `@yuta/db-pos`; data remains in local PostgreSQL. There is no organization,
   establishment, tenant, or cloud synchronization boundary here.
9. **Load transport:** the protected page calls
   `siteAgentClient.getCatalog()` and consumes the Zod-validated
   `LocalCatalogResponse`, including categories/items and combo rules/groups.
10. **Mutation transport:** Next.js Server Actions validate `FormData` with
    `@yuta/contracts/local-pos`, recover the trusted bearer token server-side,
    call the existing site-agent endpoints, and revalidate
    `/management/combos` and the order layout.
11. **Current mutations:** create/update an inactive rule, update rule-level
    fields, activate/deactivate a rule, create/update/delete a group, and
    create/update/delete an eligible group item. Rules are deactivated rather
    than deleted.
12. **Validation:** names, money, priority, quantities, maximum applications,
    identifiers, and request shapes are validated by shared Zod contracts;
    site-agent also enforces name uniqueness, inactive structural editing,
    valid group quantities, required structure, and valid base pricing group.
13. **Transaction owner:** site-agent owns persistence. Group deletion removes
    its item mappings and group in a db-pos transaction. UI code does not open
    database transactions.
14. **Polling/offline/device:** none. There is no polling, printer, provider, or
    device behavior. When site-agent cannot be loaded, the page truthfully
    renders `Site-agent indisponible`; there is no offline mutation queue.
15. **Current UI:** `PageHeader`, `IconTile`, `Card`, `Badge`, `Button`,
    `Dialog`, `ConfirmDialog`, `FormField`, `Input`, `Select`, `Alert`, semantic
    tokens, and Lucide icons from the approved stack.
16. **Current states:** populated and empty rule lists, rules with/without
    groups, groups with/without eligible items, active/inactive badges,
    disabled structural controls for active rules, pending actions, inline
    validation/service/conflict errors, confirmation dialogs, dialog close on
    success, invalid-session redirect, and site-agent-unavailable fallback.
17. **Baseline:** authenticated populated desktop and rule-editor captures are
    recorded under `references/`; no mutation was submitted for capture.
18. **Tests:** `apps/yuta-pos/test/site-agent-client.test.ts` protects bearer
    forwarding and validated combo endpoints; `apps/site-agent/test/server.test.ts`
    protects authorization and boundary validation; db-pos schema/seed tests
    protect combo persistence; core and payment tests protect combo calculation
    and split-payment behavior.
19. **Current docs:** `docs/products/pos/PRODUCT_SPEC.md`, `README.md`,
    `USER_GUIDE.md`, `QA_CHECKLIST.md`, and the POS UI rules are authoritative.
20. **Protected invariants:** combos are payment discounts, never kitchen
    production items; item quantities are not reused across matches; pricing
    and discount snapshots remain historically accurate; active rules lock
    group/item structure; activation requires a valid structure; rule deletion
    is unavailable; local authorization, bearer forwarding, contract/service
    validation, db-pos ownership, and real revalidation remain unchanged.
21. **Phase 1 resolution:** the route now renders the approved shared
    `ManagementHeader`. Page-local rule/group disclosures reduce scan and
    scroll cost while preserving every real record and action; one rule and
    one group are expanded by default, and long eligible-item lists can be
    expanded from a three-item preview.
22. **Unsupported proposals:** search/filtering, drag ordering, bulk edits,
    rule duplication, analytics, cloud sync, tenant switching, new roles,
    kitchen routing, automatic activation, hard deletion, new routes, and new
    schema/contract fields require separate approval.
23. **Exact shell mode:** `REUSE_APPROVED_SHARED_SHELL`; details and real-route
    inventory are in `DESIGN_HANDOFF.md`.

Fixture replacement remains forbidden. Phase 1 refactored the real route in
place and preserved every loader, action, validation rule, mutation, and test.

## Change impact

```text
Files expected to modify: apps/yuta-pos/src/app/management/combos/page.tsx, apps/yuta-pos/src/app/management/combos/ComboManagement.tsx, packages/contracts/test/contracts.test.ts, and this page package
Files expected to create: route-local overview, editor, dialog-support, presentation-model modules, and focused combo integration tests proven by the phased implementation
Packages affected: apps/yuta-pos and docs/ui only
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Design approval

Product-owner approval to begin Phase 1 was recorded on 2026-08-13. The
generated proposals are approved only for hierarchy, density, disclosure, and
responsive direction. Repository-owned components, semantic tokens, French
copy, live data, permissions, and behavior remain authoritative over raster
details.

## Verification commands

```bash
pnpm ui:pack:check pos-management-combos
pnpm docs:check
pnpm architecture:check
pnpm typecheck:pos
pnpm test:pos
pnpm typecheck:site-agent
pnpm test:site-agent
pnpm typecheck:db-pos
pnpm test:db-pos
pnpm -r --if-present typecheck
pnpm format:check
pnpm build:pos
```

Phase 0 documentation changes use the pack, documentation, architecture,
typecheck, and formatting checks. Behavior tests and the production build are
mandatory when later phases change runtime code.

## Final delivery and as-built status

Product-owner approval of Phase 5 and the final as-built delivery was recorded
on 2026-08-13.

Final implementation remains in the existing
`apps/yuta-pos/src/app/management/combos/` route and its route-local components.
Phase 5 added only touch-target styling to existing rule, group, item, toggle,
and delete triggers; it introduced no field, mutation, contract, API,
permission, schema, persistence, device dependency, or cloud relationship.

Functional/regression QA passes for POS, site-agent, db-pos, contracts, and
core. The POS production build, page-pack validation, documentation check,
architecture check, monorepo typecheck, and scoped formatting also pass. The
guarded database integration evidence from Phase 4 remains authoritative for
management and discount persistence.

Authenticated production-browser evidence covers `1366 x 768`, `1024 x 768`,
`768 x 1024`, `390 x 844`, and the narrow editor. It verifies zero horizontal
overflow, 44 CSS-pixel route-local action targets, visible keyboard focus,
keyboard disclosure, initial and returned dialog focus, required validation,
dialog containment, and active locks. No combo record was mutated for visual
evidence.

Intentional deviations preserve repository truth: generated raster styling is
not copied over semantic tokens or shared components, real local data replaces
sample content, and the narrow layout stacks cards and actions more strongly
than the table-like proposal. Concurrent management-write hardening remains a
separately documented service/database risk requiring separate approval.

As-built documentation status: `COMPLETE`

## Package documents

- `PRODUCT_SCOPE.md` — approved capability and exclusions.
- `UI_SPEC.md` — current baseline and intended visual direction.
- `DATA_AND_INTERACTION_SPEC.md` — real field/action mapping and states.
- `DESIGN_HANDOFF.md` — shared context, baseline metadata, and ready prompt set.
- `IMPLEMENTATION_PLAN.md` — gated six-phase plan.
- `ACCEPTANCE_CHECKLIST.md` — review and delivery gates.
- `references/README.md` — visual evidence inventory.
- `prompts/00_REPOSITORY_ANALYSIS.md` through `05_VISUAL_QA.md` — one prompt per
  phase.

## Stop conditions

- Stop before every phase until the product owner approves it.
- Do not treat generated references as approved until the product owner accepts
  the visual direction and documented deviations.
- Stop if a design changes shell ownership, routes, fields, contracts, auth,
  persistence, pricing semantics, or active-rule locks.
- Stop if real-data/browser evidence cannot be preserved.
