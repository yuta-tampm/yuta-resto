# YUTA Pointage Product Knowledge

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-28

## 1. Purpose

Pointage is the cloud, online-only employee time-clocking capability for a
trusted organization and establishment. Its current bounded employee flow lets
an eligible employee identify with a dedicated Pointage credential, read only
their current clocking state, submit `CLOCK_IN` or `CLOCK_OUT`, receive the
committed result, and end the interaction on a shared device.

This file is the owning repository Product Knowledge entry point for Pointage. It
summarizes the approved module boundary and links to the precise normative
specifications, UI knowledge, implementation, tests, and readiness evidence. It
does not replace those sources or turn implementation evidence into Product
authority.

## 2. Ownership and related modules

- **Personnel** owns the employee dossier, display-name source, and employment
  lifecycle. Pointage reads a trusted, scoped projection and rechecks current
  eligibility; it does not create another employee identity or write Personnel
  state.
- **Pointage** owns its dedicated credentials, bounded continuations, immutable
  raw actual-work events, and technical receipt and security metadata.
- **Planning** owns planned work. Pointage does not derive planned work, write
  Planning state, or compare planned and actual work in the current capability.
- **Today, payroll, POS, and Site Agent** have no implemented Pointage
  integration. ADR-005 approves future Today aggregation of actionable Pointage
  anomalies as a category intent only; its detailed behavior and concrete
  integration design are not approved or implemented. The cloud Pointage
  capability has no local or offline authority, queue, fallback, or
  synchronization path.

## 3. Actors and authorization

Authorization is server-side, establishment-scoped, and fail-closed. Browser
claims for organization, establishment, dossier, membership, role, grant, or
client address are not trusted authority.

| Actor                                                             | Exact current Pointage authority                                                                   | Boundary                                                                                                               |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Eligible employee authenticated by a current dedicated credential | `pointage.employee.identify`, `pointage.employee.state.read`, `pointage.employee.operation.create` | Self only; no other employee, establishment-wide, Personnel, Planning, POS, or cloud-user authority.                   |
| Active scoped `OWNER` or `MANAGER`                                | `pointage.establishment.read`, `pointage.credential.issue`, `pointage.credential.reset`            | Exact grants only. The establishment read is a server capability; no manager attendance UI is approved or implemented. |
| `STAFF`                                                           | None                                                                                               | No broad Pointage grant is derived from restaurant membership.                                                         |

The employee credential is independent from a Backoffice login, restaurant
membership, Personnel permission, POS user, and local PIN. The current employee
consumer accepts exactly eight ASCII digits. Durable plaintext storage and
permanent manager retrieval are forbidden. Reset or regeneration invalidates
the prior credential and removes protected read, mutation, and receipt-replay
authority from a continuation bound to it; bounded cleanup end remains allowed.
Current Personnel eligibility is checked for identification, state read,
mutation, and protected receipt recovery.

In the current transport, the credential is submitted for identification. That
transaction independently authorizes identification and the initial own-state
read before issuing a continuation; later own-state reads and mutations use the
current valid continuation. This sequencing does not change the closed
six-operation catalog.

## 4. Capability and lifecycle state

The lifecycle values below are the approved rows from the
[Module Registry](../../MODULE_REGISTRY.md). Product approval, implementation,
environment enablement, production readiness, and production authorization are
independent facts.

| Capability                           | Product Decision | Implementation | Environment   | Production Readiness | Current boundary                                                                                                                             |
| ------------------------------------ | ---------------- | -------------- | ------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Pointage authority/access foundation | `APPROVED`       | `IMPLEMENTED`  | `NOT_ENABLED` | `BLOCKED`            | Credential, trusted scope, exact authorization, Personnel eligibility, and minimized security evidence only.                                 |
| Pointage usable raw clocking         | `APPROVED`       | `IMPLEMENTED`  | `NOT_ENABLED` | `BLOCKED`            | Employee route and strict raw clocking exist, but raw persistence is available only through the guarded synthetic/disposable test extension. |

The active `pointage-manual-test-environment` change is a tooling proposal, not
a Product capability or current environment status. Its Sensitive Design review
is `AWAITING_HUMAN_REVIEW`; it has no Apply authority and has not established a
normal operator manual-test command.

## 5. Core approved Product rules

- Accepted `CLOCK_IN` and `CLOCK_OUT` raw events are Pointage's sole canonical
  actual-work evidence. Their accepted content is immutable.
- `CLOCK_IN` is valid only with no open session. `CLOCK_OUT` is valid only with
  one open session. State conflicts create no event.
- Current state and sessions are derived from ordered raw events. There is at
  most one open session per scoped dossier; multiple sequential sessions are
  allowed. There is no automatic close or fabricated missing event.
- The server/database timestamp is authoritative. Browser time is not evidence.
- Each mutation uses a stable request identity bound to the trusted scope,
  employee, command kind, and intent. A matching committed retry returns the
  original receipt without another event only after current scope, authority,
  credential or continuation validity, and Personnel eligibility are rechecked;
  reuse for a different intent or scope fails closed.
- A lost or timed-out response is an unknown result, not proof of failure or
  success. Recovery is explicit, bounded, and uses the original request tuple.
- The browser holds the opaque Pointage continuation token and protected
  interaction state in memory only. The server persists the bounded continuation
  digest, binding, and deadlines required to validate it.
- The current approved interaction design uses a 120-second absolute deadline
  and a 60-second idle deadline. Passive pointer or keyboard activity does not
  renew idle time; a successful authorized foreground state read, mutation, or
  receipt replay may advance the idle deadline, while the absolute deadline
  never moves.
- Protected browser identity, state, receipt, pending intent, and token are
  cleared locally immediately on explicit end, expiry, navigation lifecycle,
  hidden/pagehide, and pageshow restoration boundaries. The server continuation
  is ended when the end request commits. If it does not commit, the server record
  remains bounded by its deadlines and current authorization checks; local
  clearing does not claim server revocation. Late results cannot restore cleared
  browser state.

## 6. Approved employee flow and UI boundary

The employee route is `/pointage/[establishmentSlug]`. It is a French,
employee-only shared-device surface without the authenticated Backoffice
application shell.

1. Start from a neutral credential entry.
2. Submit the exact eight-digit Pointage credential. Identification has an
   explicit pending state, duplicate suppression, disabled controls, and
   `aria-busy`; it does not optimistically reveal employee data.
3. After server authorization, show only the employee display name, current
   state, and open-session start time when applicable.
4. Offer only the valid `CLOCK_IN` or `CLOCK_OUT` action. Mutation pending,
   conflict, unavailable, unknown-result, and recovery states remain explicit.
5. Show only a committed immediate receipt, for at most ten seconds or until an
   earlier lifecycle end.
6. End the interaction and return to neutral. The next employee must identify
   independently and must not see prior identity, state, receipt, or authority.

The detailed UI contract and verification scope remain in the
[employee page pack](../../ui/pages/backoffice-pointage-employee/README.md).

## 7. Explicit current exclusions

The approved bounded capability does not provide:

- employee history, daily totals, duration totals, prior clock-out display, or
  arbitrary receipt search;
- a manager attendance dashboard or credential-management UI;
- correction, deletion, destructive raw-event mutation, automatic close,
  break, pause, or meal event flows;
- current Planning, Today, payroll, Personnel write-back, or general reporting
  integration; ADR-005's future Today anomaly category remains `NOT_STARTED`;
- POS, Site Agent, local database, offline queue, fallback, or cloud/local
  synchronization behavior; or
- production enablement or a production trusted-client-address provider.

No production feature-flag mechanism is approved or implemented.

These are current-slice boundaries. A future capability requires its own
authority and must not be inferred from implementation hooks or proposals.

## 8. Verification, usability, and production blockers

Formal implementation verification and Microsoft Edge Browser QA passed for
the approved bounded slice using synthetic, disposable data. Three direct
browser observations remain explicitly limited: a genuine hidden/background
transition was not triggerable, BFCache was not triggered, and absolute expiry
could not be observed independently because idle expiry occurs first. Covered
implementation and interaction evidence supports the required behavior; the
limitations remain evidence qualifications and are not converted into direct
browser PASS results.

The existing synthetic/disposable harness is verification infrastructure. A
normal operator manual-test path is not implemented. The current tooling change
proposes a one-command disposable environment with two synthetic employees, but
it remains awaiting Human review and cannot be treated as `DEV_USABLE` or
`MANUAL_TEST_READY` evidence.

The archived raw-clocking change reached repository workflow `DONE` before the
current `DEV_USABLE` and `MANUAL_TEST_READY` controls were adopted. No
retroactive result is assigned. `DONE` records closure of that bounded workflow;
it does not establish development usability, production readiness, deployment,
or production authorization.

Production remains blocked and unauthorized. Canonical production migrations
do not include the raw-event, receipt, or continuation persistence used by the
bounded test extension. The following seven blockers remain unresolved:

1. retention duration;
2. deletion or anonymization;
3. legal hold;
4. backup-retention interaction;
5. employee notice;
6. detailed audit visibility; and
7. trusted production client-address provenance.

Production also requires separately approved canonical migration, deployment
composition, rollout, and enablement decisions. Repository implementation,
workflow completion, local synthetic evidence, or a future manual-test command
does not grant production authorization or authorize real attendance data.

## 9. Authority and discovery map

### Product and lifecycle

- [Product Knowledge map](../../PRODUCT_KNOWLEDGE.md)
- [Module Registry](../../MODULE_REGISTRY.md)
- [Current State](../../CURRENT_STATE.md)
- [Personnel Product Knowledge](../personnel/README.md)

### Normative and security authority

- [Pointage authority foundation specification](../../../openspec/specs/pointage/authority-foundation/spec.md)
- [Pointage authorization specification](../../../openspec/specs/authorization/pointage/spec.md)
- [Pointage raw-clocking specification](../../../openspec/specs/pointage/raw-clocking/spec.md)
- [Backoffice Authentication](../../architecture/AUTHENTICATION.md)

### UI knowledge

- [Pointage employee page pack](../../ui/pages/backoffice-pointage-employee/README.md)

### Implementation and tests

- [`apps/backoffice/src/app/pointage`](../../../apps/backoffice/src/app/pointage)
- [`apps/backoffice/src/app/api/pointage`](../../../apps/backoffice/src/app/api/pointage)
- [`apps/backoffice/src/server/pointage`](../../../apps/backoffice/src/server/pointage)
- [`packages/auth/src/pointage-credential.ts`](../../../packages/auth/src/pointage-credential.ts)
- [`packages/auth/src/pointage-continuation.ts`](../../../packages/auth/src/pointage-continuation.ts)
- [`packages/db-cloud/src/pointage-repository.ts`](../../../packages/db-cloud/src/pointage-repository.ts)
- [`packages/db-cloud/src/pointage-raw-clocking-repository.ts`](../../../packages/db-cloud/src/pointage-raw-clocking-repository.ts)
- [`apps/backoffice/test`](../../../apps/backoffice/test) and
  [`packages/db-cloud/test`](../../../packages/db-cloud/test)
- [final review and readiness evidence](../../reviews/pointage-usable-raw-clocking/03-final-review.md)
- [Browser QA evidence](../../reviews/pointage-usable-raw-clocking/qa/QA_REPORT.md)

### Current proposal and historical provenance

- [manual-test environment proposal](../../../openspec/changes/pointage-manual-test-environment/proposal.md)
- [archived authority/access change](../../../openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation)
- [archived usable raw-clocking change](../../../openspec/changes/archive/2026-09-23-pointage-usable-raw-clocking)

Archived changes and review records explain provenance. They do not override
current main specs, approved Product Knowledge, or current implementation.

## 10. Knowledge migration and authority cutover

### Reconciliation source

The Human-supplied `POINTAGE_LEGACY_KNOWLEDGE_EXTRACT.md` with SHA-256
`d7e841a15dae1fb7ea5ac700469fac891c2d16f408e99c724ca08ba9a89f376b`
was used only as legacy evidence for the 2026-09-28 reconciliation. Its labels
were checked against question-specific repository authority; its prose was not
copied into this home and it is not a replacement for the sources above.

### Exact migrated scope

The accepted migration covers the bounded Pointage knowledge represented by
this home and its linked current authorities:

- Pointage purpose and ownership of dedicated authority, continuations, and
  immutable actual-work evidence;
- its relationship to Personnel lifecycle, Planning planned work, and the
  absence or approved future status of downstream integrations;
- employee, `OWNER`, `MANAGER`, and `STAFF` authority boundaries, including the
  closed six-operation catalog;
- credential, continuation, raw-event, derived-state/session, request-replay,
  recovery, trusted-address, and shared-device rules;
- the approved employee route and UI flow, the server-only manager read, and
  explicit current exclusions;
- independent Product Decision, implementation, environment, production
  readiness, and production authorization state;
- current main specs, architecture, UI knowledge, implementation, tests, final
  review, Browser QA, active proposal, and archived provenance discovery; and
- the unresolved Pointage policy, security, migration, manual-test, runtime,
  rollout, and future-capability questions recorded above.

This scope does not migrate or retire authority for Personnel generally,
Planning, Today, Avis, Formalités, Establishment, or any other module or Page
Chat. Cross-module references above preserve ownership and status; they do not
expand this Pointage cutover.

### Fresh-agent acceptance evidence

The Human-authorized `YUTA KNOWLEDGE MIGRATION — POINTAGE AUTHORITY CUTOVER`
decision supplied on 2026-09-28 has SHA-256
`77aa36f7723410fbac7e2df7d2d6115ceda5b39f248ad88b43b7ea0de5b79a6c`.
It records two independent fresh-agent repository-only acceptance reports. One
report is sufficient acceptance evidence; the second is independent
corroboration. Both were run without Pointage Page Chat history, the legacy
extract, or prior Control Tower explanation, and both reported:

```text
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 0
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The reports establish repository discoverability only. They are not Product
authority, are not copied into this home, and do not resolve or promote any
Product, security, legal, implementation, environment, or readiness state.

### Authority state after cutover

Repository reconciliation, bounded canonicalization, fresh-agent acceptance,
and Human-authorized cutover are complete for the exact scope above. Under the
[Authority Model](../../AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition):

- the repository is canonical knowledge for this migrated Pointage scope;
- the Pointage Page Chat is `LEGACY EVIDENCE ONLY` for this scope and remains
  available for historical or forensic lookup;
- Codex owns repository discovery, shaping, cross-module reasoning and
  governance coordination under
  [task collaboration](../../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review).
  CT advice is optional in `CT_BRIDGE` or `HUMAN_CT_BRIDGE`; unresolved
  Product/authority decisions still require the owning Human.
- Coding Agents execute and verify only the selected task's authorized scope;
  routine gates use the mode-defined review mechanism.

This cutover does not delete or invalidate historical evidence, grant Product
or implementation authority, close any unresolved item, authorize production or
real attendance, advance `pointage-manual-test-environment`, or change any other
Page Chat's authority.
