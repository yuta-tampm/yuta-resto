# Pointage employee — Design Handoff

Status: APPROVED / IMPLEMENTED / VERIFIED / BROWSER-QA-PASS — production blocked

Visibility: Engineering

## Phase 0 source and Implementation Inventory

Target: implemented `apps/backoffice/src/app/pointage/[establishmentSlug]/page.tsx`.
Classification: NEW_PAGE / NEW_CAPABILITY_DISCOVERY. Implementation class:
integrated. Inventory status: COMPLETE (current implementation inspected).

Current repository evidence:

- `apps/backoffice/src/app/layout.tsx` supplies root fonts/styles and document
  structure. The authenticated restaurant shell belongs to a different subtree.
- The employee Pointage page and strict raw-clocking handlers are implemented.
- `apps/backoffice/src/server/pointage/authorization.ts` owns the closed six
  operations; `service.ts` owns scoped credential authentication and trusted
  client-address requirements; `raw-clocking-service.ts` owns the consumer and
  Pointage-specific continuation composition.
- `packages/db-cloud/src/pointage-repository.ts` already locks a scoped Personnel
  dossier for issue/reset. Existing Pointage schema has credentials, rate limits
  and minimized audit. Raw attendance events, retry receipts and continuations
  are implemented only in the guarded disposable test extension; the canonical
  production migration stream intentionally excludes them.
- `packages/db-cloud/src/schema/personnel.ts` supplies scoped dossier,
  givenNames/familyName and entry/departure dates. Own display-name projection is
  approved; no Personnel management permission is granted to this page.
- `packages/ui/src/index.ts` supplies Button, Input, FormField, Card, Alert,
  Skeleton and StatusBadge. Existing shared styles/fonts remain unchanged.
- Current unit/integration evidence covers the page, continuation, raw events,
  receipts, transport and shared-device behavior. Formal VERIFY and Browser QA
  passed with the three retained browser-evidence limitations.

Sources: [approved scope](PRODUCT_SCOPE.md), [Sensitive Design](../../../../openspec/changes/archive/2026-09-23-pointage-usable-raw-clocking/design.md).
Goal: identify self, observe minimal current state, submit one explicit raw
transition, receive a committed receipt and clear the shared device.

## Shared UI context resolution

Shared context status: RESOLVED

| Layer        | Owner/source                                         | Reference status | Reuse exactly                                                  | May adapt                | Excluded                                  | Decision/blocker                                     |
| ------------ | ---------------------------------------------------- | ---------------- | -------------------------------------------------------------- | ------------------------ | ----------------------------------------- | ---------------------------------------------------- |
| YUTA global  | YUTA_FRONTEND_RULES, shared UI styles/export catalog | APPROVED         | Geist/Inter, semantic tokens, accessibility, shared primitives | Page-local composition   | New framework/raw color system            | No shared primitive changes                          |
| Application  | BACKOFFICE_FRONTEND_RULES, root layout               | APPROVED         | Root typography/styles                                         | Public employee content  | Cloud account/restaurant shell/navigation | NO_APPLICATION_SHELL                                 |
| Section/flow | Approved raw/auth Specs                              | APPROVED         | Pointage-specific self-only online authority                   | Draft state presentation | Manager/Personnel navigation              | No missing section shell to invent                   |
| Page/screen  | This handoff and UI_SPEC                             | APPROVED         | Approved behavioral scope                                      | Browser QA evidence      | History/totals/payroll/manager UI         | Browser QA PASS; three residual evidence limitations |

Shell mode: NO_APPLICATION_SHELL.

Shell owner/reference: existing Backoffice root document only. No application
header, primary navigation, sidebar, mobile navigation, account/session area or
establishment selector. A small page title is content, not a new shared header.
The employee destination is `/pointage/[establishmentSlug]`; it is implemented
without an application shell. Do not link placeholder manager routes,
cloud login, Personnel, Planning or any invented route.

Curated shared constraints: [global rules](../../YUTA_FRONTEND_RULES.md),
[Backoffice rules](../../BACKOFFICE_FRONTEND_RULES.md), existing root typography
and the small component set above. No full token/catalog dump is needed.

## Design-time baseline capture

Baseline status: NOT_APPLICABLE

At the Design gate this was a new employee route with no screen to capture.
Repository inspection was not a visual baseline, and no synthetic screenshot
claim was made. The route was implemented later in the approved delivery.

## Design-generation prompt

Design prompt status: READY

### Ready-to-use prompt

Prepare a written visual/state design proposal, not implementation code, for
YUTA Backoffice's new employee Pointage page
`/pointage/[establishmentSlug]`. It is used on a shared restaurant tablet and
a narrow phone-sized viewport. Review at 1440x900, 1024x768, 768x1024 and 390x844.

Use NO_APPLICATION_SHELL: root Geist Sans / Inter fallback and existing YUTA
semantic tokens only. Do not add sidebar, restaurant selector, account avatar,
cloud-user login, navigation links or manager controls. Reuse shared Button,
Input, FormField, Card, Alert, Skeleton and StatusBadge with Lucide only when
an icon adds meaning. No images are necessary for this state-driven proposal;
the no-image direction remains subject to explicit human approval.

The hierarchy is page title, neutral credential entry or minimal identified
state, one state-appropriate action, and an end-interaction control. French
visible copy; accessible labels, visible focus, keyboard submission, generous
touch targets and text that does not rely on color.

Only an eight-digit Pointage credential identifies an eligible scoped employee.
Show own display name, NOT_CLOCKED_IN/CLOCKED_IN and current open-session start
when applicable. An accepted operation shows only its immediate committed
receipt. No today history, totals, prior clock-out, corrections or payroll.
No raw-event browser timestamp input or Planning rounding.

Design credential entry, identify pending, both current states, mutation
pending, clock-in/clock-out receipt, conflict, unknown-result recovery,
non-enumerating access failure, rate limit, cloud unavailable and neutral
interaction end. A timeout is not success or failure proof: preserve the same
request identity in live memory for recovery/retry. Never silently repeat a
mutation with a fresh identity or rebase a stale action.

Follow Sensitive Design D2/D3: the browser-held continuation token and protected
state are memory-only, while the server persists the bounded validation record;
absolute 120 seconds, idle 60 seconds, receipt display 10 seconds then end;
explicit end available. Clear all employee-specific browser state on end,
hidden/navigation, expiry or restart. Late responses cannot restore identity.
Local clearing while offline does not claim confirmed server termination. No
durable browser identity/credential/context storage, service worker, offline
acceptance or generic employee session.

Only synthetic/disposable data was used in implementation, tests, and QA. No
real attendance is authorized anywhere for this change. No production
client-address provider or production enablement. The delivery introduced no
unapproved schema, permission, field, business policy, or runtime/device
capability through visual design. The approved Specs and technical Design remain
authority.

This handoff delivered the state hierarchy, responsive/keyboard behavior, and
French copy proposal for review against exact scopes, recovery honesty, and
shared-device isolation. At its Design gate it did not authorize implementation
code, tasks, or execution prompts; those later followed the approved workflow.

## Handoff result

Written design: [UI_SPEC](UI_SPEC.md) and
[DATA_AND_INTERACTION_SPEC](DATA_AND_INTERACTION_SPEC.md), APPROVED and
implemented/test-evidenced. No image generated. No-image direction: APPROVED.
Rejected directions: generic cloud login, manager shell, attendance history,
daily total and offline fallback.
Final evidence owner: the approved Gate 3 review and linked Browser QA report.
Production enablement and real attendance remain NOT_AUTHORIZED.
