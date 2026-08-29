# YUTA Lifecycle Status Model

Visibility: Engineering

Owner: YUTA product and engineering

Proposed: 2026-08-26

## 1. Purpose

YUTA currently uses terms such as `planned`, `approved`, `prototype`,
`integrated`, `implemented locally`, `current runtime`, and `production
blocked` to describe different aspects of a capability. A single phrase often
mixes product approval, repository implementation, environment availability,
production gates, and external dependencies.

This model separates those concerns into independent status dimensions. A
capability can therefore be product-approved and implemented in the repository,
while remaining development-only and blocked from production.

This document defines vocabulary only. It does not assign or change the status
of any current feature, rewrite existing documents, or authorize an OpenSpec
workflow. The examples below are illustrative applications of the proposed
model, not adopted status migrations.

## 2. Current vocabulary findings

The repository vocabulary falls into several overlapping groups:

- **Product and review language:** `planned`, `proposed`, `approved`,
  `deferred`, and `accepted` appear in feature/product docs, personnel decision
  records, UI scopes, references, and production gates. `approved` does not say
  what was approved.
- **Repository implementation language:** `prototype`, `implemented`,
  `partial`, `integrated`, and `data-backed` appear in
  [`CURRENT_STATE.md`](CURRENT_STATE.md), feature docs, and UI page packs.
  `integrated` may refer to real persistence, route composition, a provider
  foundation, or UI delivery.
- **Environment language:** `development`, `development-only`, `local`, and
  `implemented locally` are prominent in personnel page packs. “Local” can mean
  a development restriction or the intentional restaurant-local POS runtime.
- **Readiness language:** `production blocked`, `not ready`, `ready for review`,
  and `approved` appear in
  [`PRODUCTION_READINESS.md`](operations/PRODUCTION_READINESS.md). These terms
  concern gates and evidence, not code completeness.
- **UI delivery language:** `Package status`, `Scope status`, `Reference
status`, `Inventory status`, and numbered `Phase` values are defined by UI
  page-pack governance. They track deliverables and workflow progress, not the
  complete capability lifecycle.
- **Runtime-summary language:** phrases such as `current runtime` and
  `implemented locally — production gates remain open` combine several
  dimensions in one line. Representative examples occur in the Formalités,
  personnel register, and Salariés page packs.

The scan found these terms across architecture, product, feature, operations,
and UI delivery sources. Their meaning cannot be normalized safely from the
word alone. The authority and evidence must be selected using
[`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md).

## 3. Canonical status dimensions

Statuses apply to a **named, bounded capability and scope**. The record must
identify the capability slice, runtime, and relevant environment. “Google
connector foundation” and “Google review synchronization”, for example, must
not share one undifferentiated status.

| Dimension                  | Question answered                                                                     | Allowed values                                                                                  | Authority / verification                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product Decision Status    | Has YUTA made a product decision for this bounded capability?                         | `NOT_DECIDED`, `PROPOSED`, `APPROVED`, `REJECTED`, `DEPRECATED`                                 | Product Intent authority: accepted durable decisions, then approved normative OpenSpec behavioral specs when they exist, then current specific feature/product sources |
| Implementation Status      | How much real repository implementation has been verified for the bounded capability? | `NOT_STARTED`, `PROTOTYPE`, `PARTIAL`, `IMPLEMENTED`                                            | Implemented State authority: current tracked code, tests, contracts, guards, repositories, and manifests                                                               |
| Environment Availability   | In which environment class is the capability evidenced as enabled?                    | `NOT_ENABLED`, `DEVELOPMENT_ONLY`, `NON_PRODUCTION_ENABLED`, `PRODUCTION_ENABLED`, `UNVERIFIED` | Environment configuration plus dated runtime/deployment evidence; repository code alone is insufficient for deployed claims                                            |
| Production Readiness       | Have the mandatory production gates for this capability and scope been satisfied?     | `NOT_ASSESSED`, `NOT_READY`, `BLOCKED`, `READY_FOR_REVIEW`, `READY`                             | Production Readiness authority: readiness register, capability gates, required reviewers, and dated evidence                                                           |
| External Dependency Status | Are the named required external dependencies ready for this capability?               | `NOT_APPLICABLE`, `NOT_ASSESSED`, `PENDING`, `PARTIAL`, `BLOCKED`, `READY`, `UNVERIFIED`        | Owning provider/legal/hardware/template authority plus current configuration and dated external evidence                                                               |

External Dependency Status remains a top-level dimension because YUTA has
material capabilities gated by OAuth/API approval, email and AI providers,
legal review, signed templates, storage/scanning services, and physical
hardware. It must be recorded per named dependency where dependencies differ;
`PARTIAL` is available only for an aggregate view with a documented mixture.

## 4. Status definitions

### Product Decision Status

#### `NOT_DECIDED`

No authoritative product decision for the bounded capability was found. A
route, mockup, schema field, task, or code path does not change this status.

#### `PROPOSED`

A reviewable product proposal exists, but the required product authority has
not accepted it.

#### `APPROVED`

The required product authority explicitly accepted the bounded capability,
behavior, or scope. This does not imply implementation, environment enablement,
or production readiness.

#### `REJECTED`

The required product authority explicitly declined the proposal. Historical
implementation may still exist and must be described separately.

#### `DEPRECATED`

A previously accepted capability or behavior is no longer approved for new or
continued product use, or has an accepted superseding direction. Deprecation
does not prove removal from code or deployed environments.

“Deferred” is not a canonical Product Decision Status. A deferred item must
still be classified as `PROPOSED`, `APPROVED`, or `NOT_DECIDED` according to
its actual decision evidence; scheduling belongs outside this model.

### Implementation Status

#### `NOT_STARTED`

No current repository implementation for the bounded capability is verified.
Planning documents, contracts without consumers, placeholder routes, and
reserved schemas are not implementation.

#### `PROTOTYPE`

A deliberately bounded discovery or evaluation implementation exists, such as
typed fixtures, demonstration data, in-memory interaction, synthetic input, or
a guarded experimental slice. It must not be described as a complete real-data
capability.

#### `PARTIAL`

Real repository implementation exists for part of the approved bounded
capability, but one or more required implementation slices remain absent or
unverified. The missing scope must be named.

#### `IMPLEMENTED`

The defined repository scope has real implementation verified through current
tracked code and proportionate tests/evidence. This status says nothing about
which commit is deployed, where the capability is enabled, or whether
production gates are satisfied.

### Environment Availability

#### `NOT_ENABLED`

There is evidence that the capability is not enabled in any runtime
environment. Repository artifacts may still exist.

#### `DEVELOPMENT_ONLY`

The capability is intentionally available only in development and fails closed
outside development. This requires configuration/guard evidence, not merely
the word “local”.

#### `NON_PRODUCTION_ENABLED`

The capability is evidenced as enabled in a named test, preview, evaluation,
or other non-production environment. This value does not assert that YUTA has
a formal staging environment; the actual environment must be named.

#### `PRODUCTION_ENABLED`

Dated deployment/runtime evidence shows the capability is enabled in a real
production environment for the stated scope. Repository code, a production
build, or readiness approval alone is insufficient.

#### `UNVERIFIED`

The repository or documents claim or imply availability, but current dated
runtime evidence is absent, inaccessible, or conflicting.

### Production Readiness

#### `NOT_ASSESSED`

The applicable production gates and required evidence have not been identified
or evaluated for the bounded capability.

#### `NOT_READY`

The applicable gates were identified and one or more remain incomplete, but
the record does not establish an external blocking condition. Work can proceed
under an assigned owner.

#### `BLOCKED`

At least one mandatory gate cannot progress without a missing external
decision, provider, document, authority, environment, or other named blocking
condition.

#### `READY_FOR_REVIEW`

Required evidence is assembled, but the accountable reviewer has not yet
accepted it.

`READY_FOR_REVIEW` means the required evidence has been assembled and is
awaiting the accountable reviewer. It must never, by itself, authorize
production enablement or deployment. Only `READY`, together with any required
deployment/runtime evidence, can support a production enablement decision.

#### `READY`

Every mandatory gate for the stated scope is approved or has a dated
`NOT_APPLICABLE` decision, and the required reviewers accepted the evidence.
`READY` does not mean deployed.

These capability-level values complement, but do not rewrite, the existing
per-gate vocabulary in
[`PRODUCTION_READINESS.md`](operations/PRODUCTION_READINESS.md).

### External Dependency Status

#### `NOT_APPLICABLE`

A dated scoped decision confirms that no external dependency is required.

#### `NOT_ASSESSED`

Required external dependencies have not been identified or evaluated.

#### `PENDING`

A named dependency and owner exist, and setup, review, or approval is actively
awaiting completion without a documented impasse.

#### `PARTIAL`

For an explicitly aggregated view, some named required dependencies are ready
and others are not. The individual dependency statuses must be listed.

#### `BLOCKED`

A required provider, legal approval, API access, hardware capability, signed
template, third-party configuration, or equivalent dependency cannot currently
be obtained or completed for a named reason.

#### `READY`

The named dependency is approved, configured, and evidenced for the stated
scope. This does not prove the YUTA capability is deployed or healthy now.

`READY` applies only to the explicitly named dependency, scope, and
environment. A dependency proven `READY` in development does not imply
`READY` in production. A dependency proven `READY` for one restaurant, site,
or device does not imply `READY` for another restaurant, site, or device.
Reusing `READY` evidence requires evidence that the relevant scope and
environment are equivalent.

For example, Google OAuth `READY` in development does not imply `READY` in
production, and a printer validated at one restaurant does not prove that the
same printer/device setup is validated at another restaurant.

#### `UNVERIFIED`

A dependency is claimed to be present or active, but current evidence is
absent, inaccessible, or conflicting.

## 5. Invalid combinations / interpretation rules

- Product Decision `APPROVED` with Implementation `NOT_STARTED` is valid.
  Approval does not imply delivery.
- Implementation `IMPLEMENTED` with Environment `DEVELOPMENT_ONLY` is valid for
  a precisely bounded real implementation. It is not production-enabled.
- Production Readiness `READY` with Environment other than
  `PRODUCTION_ENABLED` is valid. Ready does not mean deployed.
- Product Decision `PROPOSED`, `REJECTED`, or `DEPRECATED` with Production
  Readiness `READY` is a governance conflict and requires `NEEDS REVIEW`.
- Implementation `NOT_STARTED` with an evidenced enabled environment is
  invalid for the same bounded scope. Recheck scope and deployed-version
  evidence.
- Implementation `PROTOTYPE` with Production Readiness `READY` or Environment
  `PRODUCTION_ENABLED` is a governance error unless the explicitly approved
  production capability is itself the bounded prototype. Mark `NEEDS REVIEW`.
- A required External Dependency `BLOCKED` with Production Readiness `READY`
  is invalid. Optional dependencies must be marked outside the required set.
- Environment `PRODUCTION_ENABLED` with Production Readiness `NOT_READY` or
  `BLOCKED` can describe an unsafe real-world state; do not rewrite either
  value to make the record consistent. Escalate it as `NEEDS REVIEW`.
- `PRODUCTION_ENABLED` does not prove the deployed version matches repository
  `IMPLEMENTED`. Record the dated deployed version separately.

## 6. Mapping from legacy vocabulary

| Existing term         | Likely dimension                                                      | Canonical interpretation                                                                                       | Automatic mapping allowed?              |
| --------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `planned`             | Product Decision / Implementation                                     | Could mean `NOT_DECIDED`, `PROPOSED`, or `APPROVED` with `NOT_STARTED`                                         | No — `NEEDS REVIEW`                     |
| `approved`            | Product Decision, UI delivery, readiness gate, or external dependency | Map only after identifying what was approved, by whom, for which scope                                         | No — ambiguous across authorities       |
| `prototype`           | Implementation                                                        | Usually `PROTOTYPE` when fixture/in-memory/synthetic/experimental boundaries are evidenced                     | Conditional; never from the label alone |
| `development-only`    | Environment Availability                                              | `DEVELOPMENT_ONLY` when a current fail-closed environment guard is verified                                    | Conditional                             |
| `implemented`         | Implementation                                                        | `IMPLEMENTED` only for a bounded scope verified in tracked code/tests                                          | No — wording alone is insufficient      |
| `integrated`          | Implementation / UI delivery / external dependency                    | Could mean `PARTIAL` or `IMPLEMENTED`, or only route/data/provider integration                                 | No — `NEEDS REVIEW`                     |
| `implemented locally` | Implementation and Environment Availability                           | Could be `PROTOTYPE`, `PARTIAL`, or `IMPLEMENTED`; “local” may mean development or restaurant-local production | No — split and verify both dimensions   |
| `production blocked`  | Production Readiness / External Dependency                            | Usually `BLOCKED` when a mandatory named gate or dependency supplies the reason                                | Conditional on readiness authority      |
| `production ready`    | Production Readiness                                                  | `READY` only with approved gates and dated evidence; does not mean deployed                                    | No — phrase alone is insufficient       |
| `not ready`           | Production Readiness                                                  | Could be `NOT_ASSESSED`, `NOT_READY`, or `BLOCKED`                                                             | No — `NEEDS REVIEW`                     |
| `current runtime`     | Implementation / Environment Availability / deployed version          | May identify the current repository slice, an enabled environment, or a deployed version                       | No — scope and dated evidence required  |
| `package status`      | UI delivery metadata                                                  | Retain as page-pack workflow state; do not map directly to capability implementation or readiness              | No                                      |
| `phase`               | Work sequence / delivery history                                      | A phase number identifies sequencing, not Product Decision, Implementation, Environment, or Readiness          | No                                      |

## 7. Examples from current repo

These examples demonstrate the model without changing any source status.

### Formalités connected development prototype

Scope: the bounded employee-connected, in-memory development prototype—not a
durable or generated Formalités capability.

```text
Product Decision: APPROVED
Implementation: PROTOTYPE
Environment Availability: DEVELOPMENT_ONLY
Production Readiness: BLOCKED
External Dependency: BLOCKED
```

Evidence: the Formalités section of
[`CURRENT_STATE.md`](CURRENT_STATE.md), its page pack, runtime guard, and the
open personnel/legal/template/privacy gates in
[`PRODUCTION_READINESS.md`](operations/PRODUCTION_READINESS.md). This
classification must not be reused for the separately proposed durable
generation capability.

### Public booking Phase 0/1 bounded scope

```text
Product Decision: APPROVED
Implementation: IMPLEMENTED
Environment Availability: UNVERIFIED
Production Readiness: BLOCKED
External Dependency: BLOCKED
```

Evidence: the accepted booking decision and current booking feature docs
describe the bounded implementation, while `BOOK-01` and global cloud gates
remain blocked. This audit has no dated evidence proving which repository
version, if any, is live in production, so environment availability remains
`UNVERIFIED` in this illustration.

### Google review synchronization capability

Scope: end-to-end Google review import/synchronization, not only the OAuth and
credential foundation.

```text
Product Decision: APPROVED
Implementation: PARTIAL
Environment Availability: UNVERIFIED
Production Readiness: BLOCKED
External Dependency: BLOCKED
```

Evidence: the reputation docs record implemented OAuth, encrypted credentials,
account/location selection, and recovery UI, while import, scheduled sync, and
reply reconciliation remain incomplete. Google API approval/configuration and
the broader reputation production gate remain external blockers. A narrower
“OAuth connector foundation” capability could have a different Implementation
Status and must be recorded separately.

### Restaurant-local POS operational capability

Scope: the bounded repository POS/Site Agent operational workflows, not a
specific Luna release.

```text
Product Decision: APPROVED
Implementation: IMPLEMENTED
Environment Availability: UNVERIFIED
Production Readiness: NOT_READY
External Dependency: UNVERIFIED
```

Evidence: current POS product docs and repository evidence support real local
implementation. The production-readiness register makes local readiness
release-specific and records `POS-01` as not started. Without a dated target
server, journal, health, device, and release snapshot in this task, deployment
and external hardware availability remain `UNVERIFIED`.

## 8. Relationship with Authority Model

- Product Decision Status follows the **Product Intent** authority row.
- Implementation Status follows **Implemented State** and describes repository
  state, not the live deployed version.
- Production Readiness follows the **Production Readiness** authority row and
  required dated approvals/evidence.
- Environment Availability and deployed-version claims require dated runtime
  or deployment evidence under **Operational Behavior**.
- External Dependency Status uses the owning provider, legal, hardware,
  template, or third-party authority and current scoped evidence.
- When sources conflict or evidence is insufficient, apply `CONFLICT`,
  `UNVERIFIED`, and `NEEDS REVIEW` as defined by
  [`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md). These are evidence/conflict
  markers, not substitutes for the canonical lifecycle values.

## 9. Relationship with OpenSpec

YUTA's normative main-spec role is enabled under the approved
[OpenSpec Normativity Policy](OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
Successfully gated, synced, and validated main specs may define precise
behavioral requirements inside accepted durable boundaries.

Normative spec state does not promote a lifecycle dimension:

- a normative behavioral spec does not automatically set Product Decision
  Status to `APPROVED` globally;
- it does not set Implementation Status to `IMPLEMENTED`;
- it does not enable an Environment;
- it does not set Production Readiness to `READY`; and
- it does not set an External Dependency to `READY`.

Spec approval and sync may provide evidence for a separately bounded Product
Decision update, but that lifecycle update is a distinct governance action.
Apply and verification may provide Implementation evidence, but they do not
replace repository verification, dated deployment/runtime evidence, or
production and external-dependency gates.

This document does not create or modify any OpenSpec schema, spec, change, or
configuration, and this update does not change any lifecycle value.

## 10. Adoption rule

After this model is approved:

1. Adopt it in small, reviewable module/capability batches; do not rewrite the
   documentation corpus at once.
2. Define the bounded capability and scope before assigning any dimension.
3. Preserve existing wording until its owning normalization batch is approved.
4. When a legacy status is ambiguous, mark the proposed mapping
   `NEEDS REVIEW`; do not infer a value from a filename, heading, phase number,
   or wording alone.
5. Verify each dimension through its Authority Model source and record evidence
   separately from the value.
6. Do not auto-promote one dimension because another changes.
7. The future Module Registry should store these dimensions independently and
   link to their evidence sources.

This adoption rule does not authorize Step 3 or any current status migration.

## 11. Status of this document

Status: APPROVED
