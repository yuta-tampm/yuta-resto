# Satisfaction client — Design Handoff

Status: Approved and implemented

Visibility: Engineering

## Phase 0 source

The implementation inventory is recorded across this pack. The target is the
existing cloud Backoffice page `/visibilite-reputation/satisfaction`, classified
`EXISTING_PAGE` with implementation class `integrated`. Its primary user task is
the current Direct Customer Feedback inbox. The approved addition is one
OWNER-only three-link settings section; the current inbox, navigation,
authorization, tenant scope, data and actions must remain intact.

Inspected implementation includes:

- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx`
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/reviews-model.ts`
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/actions.ts`
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-loader.tsx`
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-page.tsx`
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-list-panel.tsx`
- `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-detail.tsx`
- `apps/backoffice/src/components/backoffice/backoffice-frame.tsx`
- `apps/backoffice/src/components/backoffice/backoffice-navigation.ts`
- `apps/backoffice/src/server/auth/session.ts`
- `apps/backoffice/src/server/auth/permissions.ts`
- `apps/backoffice/test/backoffice-navigation.test.ts`
- `packages/contracts/src/reputation/index.ts`
- `packages/db-cloud/src/reputation-review-social-links.ts`
- `packages/db-cloud/src/reputation-repository.ts`
- `apps/feedback-web/AGENTS.md`
- `apps/feedback-web/src/app/[tenantSlug]/page.tsx`
- `apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx`
- current Proposal, Analysis, Spec and Design for
  `feedback-public-trusted-boundary-hardening`

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer        | Owner/source                                                         | Reference status | Reuse exactly                                                    | May adapt                                              | Excluded                                                        | Decision/blocker         |
| ------------ | -------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- | ------------------------ |
| YUTA global  | `YUTA_FRONTEND_RULES.md`, `@yuta/ui`, global semantic styles         | APPROVED         | Typography, tokens, accessible primitives, Lucide icon language  | Page-local composition                                 | Raw brand colors, new UI framework, duplicate primitive         | None                     |
| Application  | `BACKOFFICE_FRONTEND_RULES.md`, current `BackofficeFrame`            | APPROVED         | Auth shell, top bar, sidebar/mobile menu, account and switcher   | Responsive main-content flow                           | Shell/navigation/account redesign                               | None                     |
| Section/flow | Current Reputation navigation and shared Direct Feedback review page | APPROVED         | Satisfaction route, inbox hierarchy, current actions and states  | Secondary OWNER settings surface                       | Dashboard/provider center/new route                             | None                     |
| Page/screen  | Approved social-links Spec/Design, baseline and proposed captures    | APPROVED         | Exactly three fields, one Save, approved state/permission matrix | State styling within the recorded responsive placement | New capability, autosave, provisioning, provider/OAuth workflow | Implemented and verified |

Shell mode: `REUSE_CURRENT_TARGET`.

The shell owner is `BackofficeFrame`. Preserve the current page header,
primary/sidebar and mobile navigation, establishment switcher, account/session
area, footer and all existing real routes. The only allowed target is the
existing Satisfaction content area. Do not invent breadcrumbs, provider tabs,
a social dashboard, a settings route, disabled navigation destinations or new
account controls.

Curated shared inputs for design are the current YUTA/Backoffice UI rules,
`@yuta/ui` primitives, semantic tokens, existing route captures and the approved
social-links Spec/Design. Raw component catalogs and raw token files are not
copied into the prompt.

## Current baseline capture

Baseline status: `CAPTURED`

Capture date: `2026-09-06` (Europe/Paris).

Runtime/session: local Backoffice on `http://localhost:3001`, local cloud
PostgreSQL on the repository's current development port, authenticated synthetic
OWNER `owner@luna-restaurant.fr`, active establishment `LUNA`. The route loaded
two persisted synthetic Direct Customer Feedback records. No production or
external data was used and no data was mutated for capture.

| File                          | Viewport | Route/state                                                                                          |
| ----------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `baseline-owner-1440x900.png` | 1440×900 | Authenticated OWNER; full shell, five counters, filters, two-item list and selected-detail workspace |
| `baseline-owner-1024x768.png` | 1024×768 | Authenticated OWNER; compact shell, wrapped metrics and current inbox below                          |
| `baseline-owner-768x1024.png` | 768×1024 | Authenticated OWNER; current narrow layout and stacked inbox content                                 |
| `baseline-owner-390x844.png`  | 390×844  | Authenticated OWNER; mobile top bar, stacked counters and above-fold controls                        |

Important states not shown: no settings section exists yet; settings loading,
empty, populated, dirty, invalid, saving, saved/no-change, error/retry,
conflict/reload, configuration unavailable and MANAGER/STAFF absence are not
current UI states. The 768 and 390 captures also reveal current below-fold/footer
pressure; they are discovery evidence, not final no-overflow QA.

## Design-generation prompt

Design prompt status: `READY`

### Ready-to-use prompt

Design a repository-native visual proposal for the existing authenticated YUTA
Backoffice route `/visibilite-reputation/satisfaction`. This is design only: do
not write code, schema, API, migration or provider integration.

Context:

- Product: YUTA restaurant Backoffice, French user-facing language.
- User: restaurant OWNER configuring public destinations while managing the
  existing Direct Customer Feedback inbox.
- Existing page: “Satisfaction client” with the current Backoffice shell, five
  feedback counters, search/filters/sort, paginated feedback list, selected
  detail, management, analysis and notes.
- Existing-page classification: `EXISTING_PAGE`; preserve current real data and
  behavior. Do not replace it with fixtures.
- Shell mode: `REUSE_CURRENT_TARGET`. Reuse the exact current top bar,
  sidebar/mobile menu, establishment switcher, account area, footer, content
  width and current “Satisfaction client” navigation. Do not add a route,
  navigation item, breadcrumb, provider center or dashboard.
- Review the attached authenticated baselines at 1440×900, 1024×768, 768×1024
  and 390×844. They guide hierarchy, proportions, spacing, density and tone only;
  they do not define permissions, routes, data, API or business logic.

Approved addition:

- Add one secondary section named “Liens d’avis et réseaux sociaux”. Keep the
  inbox as the primary page task.
- Show exactly three fields: “Lien Google”, “Lien Facebook” and “Lien
  Instagram”.
- Provide one explicit primary action: “Enregistrer”, covering all three fields.
- Do not autosave and do not provide per-provider Save.
- The settings section exists only for OWNER. MANAGER and STAFF continue to see
  the current inbox with no settings section or settings data.

Required states to design:

- loading;
- empty values;
- populated values;
- dirty draft;
- provider-specific invalid value while preserving every field;
- saving with duplicate submission disabled;
- saved and no-change confirmation using authoritative returned values;
- generic server error with retry and retained draft;
- conflict explaining that authoritative settings changed, with an explicit
  reload action and no silent overwrite;
- “Configuration indisponible” with fields/Save unavailable and reload/retry
  possible after a separate provisioning flow.

Protected behavior:

- The server owns authenticated user, membership, organization, active
  establishment and permissions; browser values never create authority.
- Base inbox access remains `reputation.read`; settings require the independent
  OWNER-only `reputation.settings.manage`.
- Exactly three nullable Reputation-owned values are edited as one atomic Save.
- Missing settings rows fail closed. Do not create a row, infer defaults or
  invent `brandVoice`, `publicFeedbackSlug` or another Reputation field.
- Shared validation accepts only approved provider destinations, performs no
  network/redirect verification and does not imply OAuth, synchronization or
  provider connection.
- Public hostname/client-identity hardening belongs to the concurrent
  `feedback-public-trusted-boundary-hardening` change. Do not reinterpret it.
- Do not expose opaque tokens, tenant IDs, internal row/event/actor IDs, audit
  metadata, stack traces or raw rejected credentials.

Visual and interaction constraints:

- Reuse Geist typography, YUTA semantic tokens, `@yuta/ui` and `lucide-react`.
  Do not introduce raw hardcoded brand colors or a new component library.
- Keep the settings surface compact, calm and subordinate to inbox operations.
- Keep one stable semantic, DOM and visual order at every viewport: page header,
  metrics, existing Satisfaction inbox, then the settings section.
- Do not use CSS order to move major focusable regions across the inbox, and do
  not render duplicate desktop/mobile form instances. Keyboard traversal must
  follow the same order users see.
- Use persistent field labels, readable help/errors and text status in addition
  to color.
- Preserve visible keyboard focus. Associate errors with their fields. Focus the
  first invalid field after validation. Make conflict reload and retry actions
  keyboard accessible.
- At 1440/1024/768/390 widths, let inputs, helper text and long URLs reflow
  without horizontal overflow. On mobile stack fields and keep the single Save
  clearly associated with the section. Do not use a fixed panel that covers the
  inbox, footer or mobile navigation.

Forbidden concepts:

- autosave, partial/per-provider Save, implicit settings provisioning;
- Google Business Profile URL discovery, OAuth, provider verification, sync or
  connection status;
- analytics, click counts, QR codes, social publishing, AI;
- new permission, MANAGER/STAFF settings access, route/navigation/module;
- schema/API changes, public-page redesign, production rollout claims.

Return a visual hierarchy and responsive design proposal for the current page,
including all required states and any measured spacing/layout recommendations.
Do not return implementation code. Clearly label any idea outside the approved
scope as rejected rather than incorporating it.

Review criteria: the existing shell and inbox remain recognizable and usable;
only the approved three-field OWNER section is added; every required state is
truthful and recoverable; no forbidden provider/product concept appears; the
layout is coherent and accessible at all four widths.

## Generated visual proposal

Generation method: built-in ImageGen edit flow using each authenticated
baseline as the visual reference. The generated outputs were mechanically
resampled to the exact requested viewport dimensions without changing their
content and copied into this page pack. Original baseline files were not
overwritten.

| Proposed reference                       | Viewport | Visual decision                                                                                                                                  |
| ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `references/proposed-owner-1440x900.png` | 1440×900 | Two-column inbox remains primary; compact full-width card follows it; three fields in one row; Save right-aligned.                               |
| `references/proposed-owner-1024x768.png` | 1024×768 | Scrolled view proves the inbox/list and pagination precede settings; Google full-width; Facebook/Instagram share the next row; Save lower right. |
| `references/proposed-owner-768x1024.png` | 768×1024 | Scrolled view proves inbox first; all fields stack in one column; Save lower right.                                                              |
| `references/proposed-owner-390x844.png`  | 390×844  | Mobile scroll view proves inbox first; single-column empty form; one full-width Save; no footer overlap.                                         |

All four designs use the same major content order: header, metrics, inbox, then
settings. The 1024, 768 and 390 designs intentionally show the card in a
downward-scrolled viewport so the existing metric wrapping and mobile
above-fold pressure are not made worse. No CSS region reordering, duplicate
form, modal, drawer, disclosure, tab or new navigation is needed.

The base references show populated desktop/narrow states and an empty mobile
state. `UI_SPEC.md` fixes the route-local visual treatment for loading, dirty,
invalid, saving, saved/no-change, server error/retry, conflict/reload and
configuration unavailable. Separate full-page images are not required because
these states retain the same card position and change only field/status/action
treatment.

## Handoff result

The four proposed references are `DRAFT` visual authority ready for current
human review. The exact next gate is `PAGE_PACK_APPROVED_BEFORE_UI_CODE`.
Phase 3B/3C, UI code and Browser QA remain unauthorized.
