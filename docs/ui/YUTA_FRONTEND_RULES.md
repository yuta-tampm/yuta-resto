# YUTA Frontend Rules

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-08-15

Protocol revision: 3

## Scope

These shared rules apply to UI work in:

- `apps/web`;
- `apps/backoffice`;
- `apps/booking-web`;
- `apps/feedback-web`;
- `apps/yuta-pos`;
- `apps/yuta-display`.

`apps/site-agent` is an infrastructure and local API boundary, not a frontend
application.

The nearest application `AGENTS.md` and current product, feature, architecture,
or page documentation define application-specific language, routes,
typography, runtime ownership, authorization, and required states. They extend
these rules and take precedence when they are more specific.

Backoffice UI work must also follow `BACKOFFICE_FRONTEND_RULES.md`.

POS UI work must also follow `POS_FRONTEND_RULES.md`.

## Governance model

UI work resolves authority through three layers when a page package exists or
the requested scope warrants one:

```text
repository and shared rules
        ↓
application rules and current product/runtime docs
        ↓
page or screen package
```

A page package may specialize presentation and approved interactions. It may
not override architecture, runtime ownership, implemented business invariants,
authorization/session rules, or current contracts without explicit approval.
Small maintenance changes do not require creating a page package solely to
satisfy this model.

## Required reading

Before editing:

1. read the root `AGENTS.md`;
2. read `docs/README.md` and `docs/CURRENT_STATE.md`;
3. read the nearest application `AGENTS.md`;
4. read the relevant current architecture, product, feature, and page docs;
5. inspect `packages/ui/src/index.ts` and
   `packages/ui/src/styles/global.css`;
6. inspect the current implementation and tests.

## Runtime and product boundaries

- Preserve the repository's cloud, local POS, and standalone Display runtime
  and database boundaries.
- UI code must not invent or override authentication, authorization, tenant,
  public-resolution, persistence, device, or provider ownership.
- Browser-provided identifiers, roles, permissions, entitlements, and runtime
  scope are untrusted unless the current server boundary explicitly validates
  them.
- Browser bundles receive no database drivers, database URLs, secrets, or
  server-only environment modules.
- Describe implemented capabilities accurately. Label prototype, pilot,
  planned, unavailable, and externally blocked behavior truthfully.
- Do not infer product scope, navigation, permissions, or data fields from a
  visual reference.

## Repository-first implementation

Before changing UI:

- classify the target as `NEW_PAGE` or `EXISTING_PAGE`;
- classify the implementation as visual-only, interactive, integrated, or
  device-coupled;
- inspect the real route or entry point, application shell, page container, and
  nearby screens;
- inspect current runtime scope, authorization, data access, mutations, forms,
  device boundaries, and tests as applicable;
- search `packages/ui/src/index.ts` and current usage before creating a
  primitive;
- inspect existing semantic tokens before adding styling;
- identify whether the target is new, static, interactive, or integrated;
- report conflicts between current behavior, documentation, and the requested
  design.

When a page package is used, Phase 0 produces a read-only Implementation
Inventory before implementation. It records the applicable trust/session
boundary, data owner, transport/contracts, mutations, polling/offline/device
behavior, protected invariants, tests, current visual baseline, and exact
verification commands.

Improve an existing integrated screen in place. Do not replace real data or
working behavior with fixtures merely to match a visual-baseline workflow.

For an existing integrated or device-coupled screen, preserve current loading,
transport, mutations, validation, transactions, polling, retry, recovery,
hardware boundaries, and behavior-protecting tests. Do not reimplement domain
calculations in presentation code when an established domain or service owner
already exists.

For a new page, typed fixtures may establish a visual baseline only when the
page specification explicitly permits them. Fixtures must not simulate an
integrated capability as if it were implemented.

## Reference-image policy

Reference images may guide:

- visual hierarchy;
- relative proportions;
- density;
- spacing direction;
- visual tone.

They do not authorize copying or inventing:

- navigation or sample modules;
- domain models or persistence;
- labels unsupported by current product documentation;
- permissions or API assumptions;
- controls without approved behavior;
- raw color values.

## Components and ownership

### Shared ownership

- Reuse `@yuta/ui` and `lucide-react` where applicable.
- Do not introduce another UI, icon, validation, state-management, or
  data-access framework without an accepted ADR.
- Search the shared export catalog and existing usage before creating a
  primitive. Do not assume a primitive exists.
- Only domain-neutral presentation primitives belong in `@yuta/ui`.
- Keep business-specific components route-local or feature-local until reuse
  across independent features is proven.
- Change a shared primitive only for a general need after assessing current
  consumers.
- Prefer composition over page-specific boolean props on shared primitives.
- Do not maintain a second component export catalog in documentation.

When implementation needs a component, decide in this order:

1. reuse an existing target-feature component;
2. reuse an existing target-application component;
3. compose existing components and `@yuta/ui` primitives;
4. extend an existing application component when the need is genuinely shared;
5. create a feature/application component;
6. create or change a shared primitive only for proven domain-neutral reuse
   across independent consumers.

### Page and screen composition

A route-level page or screen entry should primarily orchestrate its current
runtime responsibilities. These may include resolving parameters, preserving
authentication and authorization, loading data, handling redirects or missing
resources, and composing meaningful sections.

Do not make an entry file the default home for every field, dialog, list,
mutation, validation rule, and interaction on a complex screen.

A long file is not automatically wrong. Extract a component when separation
clarifies business responsibility, state ownership, data flow, testability, or
server/client boundaries. Extract by responsibility, not visual position.

Good candidates include sections that own focused state, a dialog or editor, a
mutation or validation flow, a substantial list or filter group, or an isolated
client boundary. Avoid tiny pass-through wrappers created only to reduce line
count.

Keep one-route components near that route. Add `_components`, `_hooks`, `_lib`,
or similar folders only when the implementation needs them and the convention
fits nearby code. Do not create empty folders preemptively.

### Next.js application structure

For Next.js applications, use ownership scope to choose component placement:

```text
src/app
  routing, layouts, actions, and route-owned code

src/components/<domain>/
  components reused across the application

src/app/<route-group>/_components/
  components shared by the nearest route group or route subtree

src/app/<route>/_components/
  components used by one route
```

Route-local non-UI logic may use `_lib`, `_utils`, or another name that makes
its ownership clear. Do not create a generic `src/app/components` folder.
Existing application-wide component folders should be organized by meaningful
domain rather than becoming a second shared primitive library.

Business-specific components remain in the owning application even when they
are reused by several routes. Promote a component to `@yuta/ui` only when it
is a reusable, business-domain-neutral presentation primitive with proven
independent consumers.

### Server and client boundaries

In Next.js applications, use Server Components by default and isolate the
smallest necessary Client Component for state, effects, events, or browser
APIs.

Do not move secure data loading or trusted scope derivation into the browser
because one subsection is interactive. Client presentation code must not
become the source of truth for trusted identifiers, roles, permissions, or
entitlements.

### Forms and decomposition

Large forms may be split into meaningful business sections while keeping one
coherent form and submission model when the domain requires one save operation.
Do not create separate mutations merely because JSX was split.

Preserve the current form state, validation contract, mutation and transaction
semantics, error behavior, persistence, and tests. A child component owns an
independent mutation only when the underlying business interaction is genuinely
independent.

## Styling

- Use semantic tokens defined by `@yuta/ui`.
- Never use raw color values in class names or inline styles.
- Do not introduce provisional page-only token vocabularies.
- Avoid arbitrary values when the existing scale expresses the layout.
- Do not change global CSS for one page.
- Preserve the typography approved for the target application.
- Preserve visible focus and accessible target sizes.
- Do not communicate status by color alone.
- Prevent horizontal page overflow at supported widths.

## Interaction, time, and data

- Validate untrusted boundary input with Zod.
- Keep side effects at application or infrastructure boundaries.
- Follow the target application's established form, mutation, routing, and
  data-access conventions.
- Associate validation errors with fields and preserve user input after failed
  submissions where applicable.
- Use the configured runtime locale, timezone, and canonical time
  representation.
- Map current domain fields to UI fields before proposing persistence changes.
- Stop and request approval when a design requires an unapproved domain field,
  constraint, enum value, route, permission, contract, provider, or migration.

## Required states

Implement truthful states as applicable to the target application and feature:

- loading or initialization;
- empty, unavailable, or first configuration;
- load or device error;
- forbidden or unresolved scope;
- validation error;
- conflict;
- pending or submitting;
- persisted success;
- save or playback error;
- retry and recovery.

Static design documentation must not claim these states are implemented.

## Scope control

Unless explicitly authorized, do not:

- change unrelated routes or domain vocabulary;
- infer features from reference navigation;
- add API routes, server actions, contracts, permissions, providers, or
  migrations during visual work;
- refactor unrelated code;
- combine visual correction with backend redesign;
- discard working authorization, runtime boundaries, or data integration;
- create duplicate `v2`, `new`, `final`, or `latest` documents.

Stop for review when a UI change unexpectedly requires architecture, database,
contract, authorization, cross-application, runtime, provider, or device
changes outside the approved impact boundary.

## Responsive design and accessibility

There is no project-wide fixed viewport matrix. Use, in order, the target
application's rules, current product/operator documentation, and the page
package. If none defines a matrix, record a reasonable QA assumption during
repository analysis before implementation.

Verify the widths and input conditions relevant to the target product. Include
mobile, tablet, and desktop coverage when the application supports them, and
restaurant touch or playback conditions for local products where applicable.

Requirements include:

- no horizontal page overflow or clipped primary actions;
- keyboard-operable controls and visible focus;
- accessible names for icon-only controls;
- textual status labels;
- associated field errors;
- managed dialog focus;
- touch-accessible controls where required;
- responsive layouts based on primitives that actually exist.

## Documentation maintenance

When behavior, flow, route, validation, persistence, runtime ownership, or
operational rules change:

- update current documentation in the same change;
- update an existing page package in place;
- update `docs/README.md` when a current document path changes;
- remove obsolete links after moving files;
- do not add overlapping completion reports.
- synchronize the stable page package and intentional deviations with the
  as-built implementation before marking it implemented.

Durable behavior belongs in current product, feature, architecture, and page
documentation. Completed implementation history belongs in Git history.

## Verification

Always use repository commands that exist:

```text
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
```

Run `pnpm format:check` for formatting-sensitive changes, plus the target
application's relevant tests and build. Run affected contract, tenant,
database, domain, device, and integration tests when their behavior changes.

Use browser or device-level QA when visual layout or interaction changes.
Report exact results, failures, skipped checks, screenshots or observations,
and remaining risks. Never claim visual parity without visual evidence.
Never report lint or another check unless the corresponding repository command
exists and was actually run.
