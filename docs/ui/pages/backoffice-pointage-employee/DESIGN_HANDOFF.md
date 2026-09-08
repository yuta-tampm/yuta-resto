# Pointage employee — Design Handoff

Status: Draft — AWAITING_HUMAN_REVIEW

Visibility: Engineering

## Phase 0 source and Implementation Inventory

Target: proposed `apps/backoffice/src/app/pointage/[establishmentSlug]/page.tsx`.
Classification: NEW_PAGE / NEW_CAPABILITY_DISCOVERY. Implementation class:
integrated. Inventory status: COMPLETE (repository inspection, not implementation).

Current repository evidence:

- `apps/backoffice/src/app/layout.tsx` supplies root fonts/styles and document
  structure. The authenticated restaurant shell belongs to a different subtree.
- No employee Pointage page or usable raw-clocking handler exists yet.
- `apps/backoffice/src/server/pointage/authorization.ts` owns the closed six
  operations; `service.ts` owns scoped credential authentication and trusted
  client-address composition. Employee continuation is not implemented.
- `packages/db-cloud/src/pointage-repository.ts` already locks a scoped Personnel
  dossier for issue/reset. Existing Pointage schema has credentials, rate limits
  and minimized audit, but no attendance events or retry receipts.
- `packages/db-cloud/src/schema/personnel.ts` supplies scoped dossier,
  givenNames/familyName and entry/departure dates. Own display-name projection is
  approved; no Personnel management permission is granted to this page.
- `packages/ui/src/index.ts` supplies Button, Input, FormField, Card, Alert,
  Skeleton and StatusBadge. Existing shared styles/fonts remain unchanged.
- Current foundation unit/integration tests are evidence for the foundation,
  not proof of this new page, continuation, raw events or Browser QA.

Sources: [approved scope](PRODUCT_SCOPE.md), [Sensitive Design](../../../../openspec/changes/pointage-usable-raw-clocking/design.md).
Goal: identify self, observe minimal current state, submit one explicit raw
transition, receive a committed receipt and clear the shared device.

## Shared UI context resolution

Shared context status: RESOLVED

| Layer        | Owner/source                                         | Reference status | Reuse exactly                                                  | May adapt                | Excluded                                  | Decision/blocker                       |
| ------------ | ---------------------------------------------------- | ---------------- | -------------------------------------------------------------- | ------------------------ | ----------------------------------------- | -------------------------------------- |
| YUTA global  | YUTA_FRONTEND_RULES, shared UI styles/export catalog | APPROVED         | Geist/Inter, semantic tokens, accessibility, shared primitives | Page-local composition   | New framework/raw color system            | No shared primitive changes            |
| Application  | BACKOFFICE_FRONTEND_RULES, root layout               | APPROVED         | Root typography/styles                                         | Public employee content  | Cloud account/restaurant shell/navigation | NO_APPLICATION_SHELL                   |
| Section/flow | Approved raw/auth Specs                              | APPROVED         | Pointage-specific self-only online authority                   | Draft state presentation | Manager/Personnel navigation              | No missing section shell to invent     |
| Page/screen  | This handoff and UI_SPEC                             | DRAFT            | Approved behavioral scope                                      | Layout/copy under review | History/totals/payroll/manager UI         | Human Sensitive Design review required |

Shell mode: NO_APPLICATION_SHELL.

Shell owner/reference: existing Backoffice root document only. No application
header, primary navigation, sidebar, mobile navigation, account/session area or
establishment selector. A small page title is content, not a new shared header.
The only planned employee destination is `/pointage/[establishmentSlug]`;
it is not an implemented route yet. Do not link placeholder manager routes,
cloud login, Personnel, Planning or any invented route.

Curated shared constraints: [global rules](../../YUTA_FRONTEND_RULES.md),
[Backoffice rules](../../BACKOFFICE_FRONTEND_RULES.md), existing root typography
and the small component set above. No full token/catalog dump is needed.

## Current baseline capture

Baseline status: NOT_APPLICABLE

This is a new employee route with no current screen to capture. Repository
inspection is not a visual baseline. No synthetic screenshot claims are made.

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

Follow Sensitive Design D2/D3: memory-only continuation; absolute 120 seconds,
idle 60 seconds, receipt display 10 seconds then end; explicit end available.
Clear all employee-specific state on end, hidden/navigation, expiry or restart.
Late responses cannot restore identity. Local clearing while offline does not
claim confirmed server termination. No durable identity/credential/context
storage, service worker, offline acceptance or generic employee session.

Only synthetic/disposable data may be used in future implementation/tests/QA.
No real attendance is authorized anywhere for this change. No production
client-address provider or production enablement. Do not introduce schema,
permissions, extra fields, business policy or new runtime/device capability
through visual design. The approved Specs and technical Design remain authority.

Deliver a state hierarchy, responsive/keyboard behavior and French copy proposal.
Review against exact scopes, recovery honesty and shared-device isolation.
No implementation code, implementation plan, tasks or execution prompts.

## Handoff result

Written proposal: [UI_SPEC](UI_SPEC.md) and
[DATA_AND_INTERACTION_SPEC](DATA_AND_INTERACTION_SPEC.md), DRAFT.
No image generated. No-image direction: PROPOSED, not approved.
Rejected directions: generic cloud login, manager shell, attendance history,
daily total and offline fallback.
Next approval owner: human Sensitive Design reviewer.
This partial Design-stage pack is not a generated implementation-ready package.
