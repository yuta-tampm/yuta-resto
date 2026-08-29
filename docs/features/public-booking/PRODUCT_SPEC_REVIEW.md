# Public Booking Product Spec Authority Review

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-27

## 1. Executive summary

[`PRODUCT_SPEC.md`](PRODUCT_SPEC.md) still has an important current role: it is
the only consolidated source for Public Booking's broader product vision,
future-phase intent, durable experience principles, non-goals, and open design
space. It must not be removed, archived, or reduced to the already implemented
Phase 0/1 boundary without first preserving that intent.

The document is not a reliable authority for current implementation,
executable data shape, runtime ownership, route structure, deployment, or
production readiness. It mixes durable Product Intent with suggested TypeScript
models, API paths, package layouts, feature flags, rollout steps, and a final
architecture summary. Those technical sections are substantially superseded
or qualified by accepted ADRs, current architecture, executable schemas and
contracts, current code, [`README.md`](README.md), and
[`STATUS.md`](STATUS.md).

The bounded Phase 0/1 Product Decision and repository implementation are
recorded in the Module Registry. The broader Phase 2-7 material remains useful
Product Intent/context, but this review does not assign a canonical Product
Decision to each future capability and does not call it implemented or
production-ready.

**Recommendation: `UPDATE IN PLACE`.** Preserve the stable file path and unique
Product Intent, remove or simplify superseded technical prescriptions, label
future and unresolved intent precisely, and route current implementation,
architecture, data shape, and readiness to their owning sources. A split is not
recommended now because it would create another active Product Intent document
without a clearer ownership boundary.

## 2. Section inventory

The classification is the primary treatment for each section. A section marked
`ROUTE_TO_CURRENT_SOURCE` may still contribute a short durable principle; a
section marked `SUPERSEDED_ARCHITECTURE` may contain product intent that must be
extracted before its technical prescription is simplified.

| PRODUCT_SPEC section                                 | Current role                                                                                                                                                                           | Classification            | Current source / destination                                                                                                 | Confidence |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Preamble and metadata                                | Declares a master product/technical reference and points implementation to adjacent sources.                                                                                           | `ROUTE_TO_CURRENT_SOURCE` | Authority Model, Product Knowledge routing, Booking README/STATUS.                                                           | High       |
| 0. Current Phase 0/1 reconciliation                  | Summarizes known differences between the broad target and repository implementation.                                                                                                   | `ROUTE_TO_CURRENT_SOURCE` | Booking README and STATUS; Module Registry for lifecycle.                                                                    | High       |
| 1. Document purpose                                  | Defines the intended breadth and audience of the master specification.                                                                                                                 | `KEEP_CURRENT_INTENT`     | Retain as a narrower Product Intent/context purpose.                                                                         | High       |
| 2. Product vision                                    | Owns the direct, restaurant-branded booking proposition and broad long-term outcomes.                                                                                                  | `KEEP_CURRENT_INTENT`     | Keep here; route implemented subset to README/STATUS.                                                                        | High       |
| 3. Position inside the YUTA ecosystem, including 3.1 | Mixes a valid independent-product rationale with repository/package ownership.                                                                                                         | `SUPERSEDED_ARCHITECTURE` | Keep the public-product rationale; route ownership to ADR-002, ADR-003, Repository Map, and architecture.                    | High       |
| 4. Domain and URL strategy                           | Defines the current target domain/slug experience and future subdomain/custom-domain intent; also proposes a technical identity interface.                                             | `KEEP_CURRENT_INTENT`     | Keep product-facing URL intent; route resolution and executable shape to ADR-002, Tenancy, schema, and current code.         | High       |
| 5. Core user roles                                   | Captures guest and restaurant outcomes, but the organization-admin and YUTA super-admin authority is not fully reconciled with current roles and the reserved Platform Admin boundary. | `NEEDS_REVIEW`            | Identity / Access Product Knowledge, Booking README, current permissions, Module Registry.                                   | High       |
| 6. Product principles                                | Contains durable mobile, friction, branding, availability, progressive-complexity, isolation, and status-clarity principles.                                                           | `KEEP_CURRENT_INTENT`     | Keep here; security/tenancy enforcement routes to current architecture.                                                      | High       |
| 7.1 Phase 0                                          | Historical target foundation now represented by current implementation evidence.                                                                                                       | `ROUTE_TO_CURRENT_SOURCE` | Booking README/STATUS, ADR-002, code/tests.                                                                                  | High       |
| 7.2 Phase 1                                          | Durable MVP outcome and simplifications mixed with targets that differ from the implemented bounded scope.                                                                             | `KEEP_CURRENT_INTENT`     | Keep target/non-goals; route current behavior and blockers to README/STATUS.                                                 | High       |
| 7.3 Phase 2                                          | Unique future communication and conversion intent.                                                                                                                                     | `KEEP_CURRENT_INTENT`     | Keep here, clearly future and without inferred lifecycle assignment.                                                         | High       |
| 7.4 Phase 3                                          | Unique waitlist and demand-management intent.                                                                                                                                          | `KEEP_CURRENT_INTENT`     | Keep here, clearly future.                                                                                                   | High       |
| 7.5 Phase 4                                          | Unique table/floor-plan intent mixed with a proposed data design.                                                                                                                      | `KEEP_CURRENT_INTENT`     | Keep outcomes and separation principle; remove proposed entities from architecture authority.                                | High       |
| 7.6 Phase 5                                          | Unique embedding, branding, and custom-domain intent plus security constraints.                                                                                                        | `KEEP_CURRENT_INTENT`     | Keep product intent; route security to current security architecture when implemented.                                       | High       |
| 7.7 Phase 6                                          | Unique external-integration intent mixed with a speculative package tree.                                                                                                              | `KEEP_CURRENT_INTENT`     | Keep adapter/non-coupling intent; do not retain the package tree as authority.                                               | High       |
| 7.8 Phase 7                                          | Unique explainable, overrideable intelligence intent.                                                                                                                                  | `KEEP_CURRENT_INTENT`     | Keep here as future intent, not an approved provider or implementation.                                                      | High       |
| 8. Public guest journey                              | Broader target experience with explicit current deltas.                                                                                                                                | `KEEP_CURRENT_INTENT`     | Keep durable journey outcomes; README/STATUS and current UI own Phase 0/1 behavior.                                          | High       |
| 9. Availability model                                | Mostly current bounded business behavior plus future duration/table evolution and implementation strategies.                                                                           | `ROUTE_TO_CURRENT_SOURCE` | `packages/booking`, db-cloud repository/schema, contracts, README/STATUS.                                                    | High       |
| 10. Booking configuration model                      | Product configuration ideas expressed as a suggested TypeScript interface.                                                                                                             | `SUPERSEDED_ARCHITECTURE` | Preserve unresolved product knobs separately; executable schema/contracts own current fields.                                | High       |
| 11. Weekly service periods                           | Current behavior expressed through a suggested structure.                                                                                                                              | `ROUTE_TO_CURRENT_SOURCE` | Booking README/STATUS, contracts, booking schema/repository.                                                                 | High       |
| 12. Exceptions and closures                          | Current and future override intent mixed with a suggested model.                                                                                                                       | `ROUTE_TO_CURRENT_SOURCE` | Booking README/STATUS, `packages/booking`, contracts, executable schema.                                                     | High       |
| 13. Reservation lifecycle                            | Durable status clarity and transition intent now represented more precisely in executable logic and contracts.                                                                         | `ROUTE_TO_CURRENT_SOURCE` | `packages/booking`, reservation contracts, db-cloud schema/repository, README/STATUS.                                        | High       |
| 14. Data model                                       | Conceptual and suggested entities mixed with a current reconciliation note.                                                                                                            | `SUPERSEDED_ARCHITECTURE` | Active db-cloud schema, migrations, Data Model reference, contracts.                                                         | High       |
| 15. Reservation identifiers                          | Durable security intent substantially represented by current schema/contracts and implementation.                                                                                      | `ROUTE_TO_CURRENT_SOURCE` | Booking schema/repository, contracts, README/STATUS, security tests.                                                         | High       |
| 16. API architecture                                 | Suggested endpoint shapes conflict with or predate current route structure.                                                                                                            | `SUPERSEDED_ARCHITECTURE` | Current Booking and Backoffice routes, contracts, ADR-002, code/tests.                                                       | High       |
| 17. Shared contracts                                 | Suggested catalog predates current `@yuta/contracts/reservations` exports.                                                                                                             | `SUPERSEDED_ARCHITECTURE` | Current contracts package and consumers.                                                                                     | High       |
| 18. Public UI structure                              | Durable experience, state, mobile, and accessibility intent.                                                                                                                           | `KEEP_CURRENT_INTENT`     | Keep target principles; README/STATUS and current UI/tests own implemented evidence.                                         | High       |
| 19. Restaurant branding                              | Unique broader branding intent with a useful current implementation qualification.                                                                                                     | `KEEP_CURRENT_INTENT`     | Keep future product options; Establishment Product Knowledge and Booking README own current fields/rendering.                | High       |
| 20. Back-office information architecture             | Broader operational information architecture, partly implemented under different current routes.                                                                                       | `KEEP_CURRENT_INTENT`     | Keep outcomes/future views; current Backoffice routes and README/STATUS own implementation.                                  | Medium     |
| 21. Source attribution                               | Unique broader attribution/analytics intent with a current bounded-source note.                                                                                                        | `KEEP_CURRENT_INTENT`     | Keep future intent; README/STATUS, contracts, and schema own current bounded enum.                                           | High       |
| 22. Notifications                                    | Durable product outcomes and post-commit principle mixed with a suggested service interface.                                                                                           | `KEEP_CURRENT_INTENT`     | Keep notification outcomes; current outbox and blockers route to README/STATUS and readiness.                                | High       |
| 23. Security and abuse protection                    | Durable public-surface, privacy, minimization, and progressive-protection requirements.                                                                                                | `KEEP_CURRENT_INTENT`     | Keep product/security requirements; current authorization/security architecture and readiness gates remain higher authority. | High       |
| 24. Multi-tenancy and authorization                  | Repeats durable trust rules and proposes permission names.                                                                                                                             | `SUPERSEDED_ARCHITECTURE` | Tenancy, Authentication, Identity / Membership, ADR-002, server guards/tests.                                                | High       |
| 25. Timezone, date, and locale rules                 | Durable booking behavior, mostly represented by current domain logic and implementation.                                                                                               | `ROUTE_TO_CURRENT_SOURCE` | Booking README, `packages/booking`, repository/schema, tests.                                                                | High       |
| 26. SEO and public metadata                          | Unique public indexing and private-management-page intent.                                                                                                                             | `KEEP_CURRENT_INTENT`     | Keep here; current app metadata and STATUS verify implementation.                                                            | High       |
| 27. Performance requirements                         | Durable priorities but mostly non-normative recommendations without approved production SLOs.                                                                                          | `KEEP_CURRENT_INTENT`     | Keep product priorities; STATUS/readiness own measured evidence and target-environment acceptance.                           | Medium     |
| 28. Observability and auditability                   | Useful desired signals and actor distinctions, not current operations/readiness proof.                                                                                                 | `KEEP_CURRENT_INTENT`     | Keep desired outcomes; STATUS and Production Readiness own current gaps/evidence.                                            | High       |
| 29. Error handling                                   | Durable guest-facing safe-error outcomes.                                                                                                                                              | `KEEP_CURRENT_INTENT`     | Keep intent; contracts/current routes/tests own implemented codes and states.                                                | High       |
| 30. Testing strategy                                 | Target verification coverage mixed with tests already implemented and still-open acceptance.                                                                                           | `ROUTE_TO_CURRENT_SOURCE` | STATUS, current test suites, Production Readiness.                                                                           | High       |
| 31. Suggested code architecture                      | Package tree conflicts with current package-purity and persistence ownership rules.                                                                                                    | `SUPERSEDED_ARCHITECTURE` | ADR-002, package AGENTS, current manifests/exports, current code.                                                            | High       |
| 32. Suggested route structure                        | Historical proposed layout differs from current `src/app` routes and component-placement rules.                                                                                        | `SUPERSEDED_ARCHITECTURE` | Current route tree, root/app instructions, README/STATUS.                                                                    | High       |
| 33. Feature flags                                    | Mixes current entitlement intent with speculative future flag names.                                                                                                                   | `NEEDS_REVIEW`            | Current entitlement schema/guards and capability-specific future decisions.                                                  | High       |
| 34. Migration and rollout strategy                   | A generic rollout proposal is not current deployment authority.                                                                                                                        | `SUPERSEDED_ARCHITECTURE` | Deployment, Production Readiness, Booking STATUS, migrations/journal.                                                        | High       |
| 35. Historical MVP implementation sequence           | Completed or superseded execution ordering retained as provenance.                                                                                                                     | `HISTORICAL_CONTEXT`      | Git history and current README/STATUS/code for outcomes.                                                                     | High       |
| 36. Definition of done for Phase 1                   | Target checklist already reconciled more precisely as current blockers.                                                                                                                | `ROUTE_TO_CURRENT_SOURCE` | Booking STATUS, Module Registry, Production Readiness.                                                                       | High       |
| 37. Non-goals for the initial release                | Unique durable scope control for the initial product.                                                                                                                                  | `KEEP_CURRENT_INTENT`     | Keep here.                                                                                                                   | High       |
| 38. Future design decisions that must remain open    | Unique extensibility/non-lock-in intent.                                                                                                                                               | `KEEP_CURRENT_INTENT`     | Keep here, without implying approval of each future capability.                                                              | High       |
| 39. Final architecture summary                       | Mixes a durable guest-to-restaurant flow with superseded technical authority and an unimplemented notification outcome.                                                                | `SUPERSEDED_ARCHITECTURE` | Extract the product flow; route architecture to ADR-002/003, current architecture/code, and notification status.             | High       |
| 40. Durable implementation guardrails                | Mixes durable behavioral/non-goal constraints with rules already owned by security, tenancy, contracts, and package boundaries.                                                        | `ROUTE_TO_CURRENT_SOURCE` | Keep only unique Booking behavior; route invariant ownership to ADRs, architecture, contracts, and package rules.            | High       |

## 3. Unique Product Intent map

| Intent / requirement group                                                                               | Still current?                                                                            | Already represented elsewhere?                                                     | Recommended home                                                          |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Direct, restaurant-branded booking rather than a marketplace experience                                  | Yes, as broad product positioning.                                                        | Partly in Booking README; not with the same long-term framing.                     | Retain in Product Spec.                                                   |
| Mobile-first, low-friction guest journey with clear confirmed versus pending outcomes                    | Yes.                                                                                      | Current subset exists in README/STATUS and UI/tests.                               | Retain durable intent in Product Spec; route current evidence.            |
| Progressive evolution from slot capacity without requiring tables for MVP                                | Yes.                                                                                      | Current capacity behavior is elsewhere; long-term evolution remains mostly unique. | Retain as Product Intent, not data architecture.                          |
| Communication, reminder, modification, verification, and message-template direction                      | Yes as future context; individual lifecycle assignments are not established here.         | Current outbox limitation is in README/STATUS.                                     | Retain future outcomes in Product Spec.                                   |
| Waitlist and demand-management outcomes                                                                  | Yes as future context.                                                                    | Not represented as current implementation.                                         | Retain in Product Spec pending scoped decisions.                          |
| Table/floor-plan, assignment, pacing, and turn-time outcomes                                             | Yes as future context.                                                                    | Establishment sources explicitly do not approve Rooms/Tables detail.               | Retain outcomes in Product Spec; mark future and separately reviewable.   |
| Widget, custom branding/domain, multilingual, and white-label direction                                  | Yes as future context.                                                                    | Current branding limitations are in README/STATUS.                                 | Retain product intent; avoid prescribing route/deployment implementation. |
| External channel, adapter, export, webhook, and analytics direction                                      | Yes as future context.                                                                    | Only bounded source attribution and calendar download exist currently.             | Retain outcomes; route current behavior to README/STATUS.                 |
| Explainable and operator-overrideable recommendations                                                    | Yes as a future guardrail.                                                                | Not otherwise consolidated for Booking.                                            | Retain in Product Spec without provider or implementation claims.         |
| Operational capacity override for staff                                                                  | Unresolved as a specific capability; the current implementation has no approved override. | STATUS records the absence.                                                        | Preserve as `NEEDS_REVIEW`; do not present it as current authority.       |
| Broader Backoffice views, filters, notification history, analytics, and page management                  | Yes as broader direction, with details requiring later decisions.                         | Current routes/limits are in README/STATUS.                                        | Retain bounded outcomes, not a mandatory route tree.                      |
| Broader source attribution and campaign/conversion tracking                                              | Yes as future direction.                                                                  | Current bounded enum is represented elsewhere.                                     | Retain future intent in Product Spec.                                     |
| Public SEO/indexing, private management noindex, performance priorities, and safe error outcomes         | Yes.                                                                                      | Partly evidenced by current code/STATUS, but broader intent remains unique.        | Retain in Product Spec and route implementation evidence.                 |
| Privacy minimization, progressive abuse protection, explainable audit actors, and no PII in metrics/logs | Yes, subject to higher security/privacy authority.                                        | Distributed across current implementation and readiness sources.                   | Retain Booking-specific outcomes; route enforcement and approval.         |
| Initial-release non-goals and future design decisions that must remain open                              | Yes and materially unique.                                                                | Not fully represented elsewhere.                                                   | Retain in Product Spec.                                                   |
| YUTA super-admin Booking capabilities                                                                    | Not sufficiently authorized. Platform Admin is only a reserved boundary.                  | Identity / Access and Module Registry do not approve this capability set.          | `NEEDS_REVIEW`; do not silently retain as approved Product Intent.        |

## 4. Superseded architecture map

| Technical/architecture topic                          | Why superseded                                                                                                                                                           | Current authority                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Public Booking runtime ownership                      | The independent application boundary is now an accepted decision, not a recommendation in a product spec.                                                                | ADR-002; Architecture Overview; Repository Map.                                                           |
| Public versus Backoffice ownership                    | Anonymous Booking belongs to `apps/booking-web`; authenticated reservation administration belongs to `apps/backoffice`.                                                  | ADR-002 and current application roots.                                                                    |
| Cloud persistence ownership                           | Suggested models cannot define database ownership or exact columns. Cloud Booking uses server-only `packages/db-cloud`.                                                  | ADR-003, Database Boundaries, active booking schema/migrations.                                           |
| Tenant and public-context resolution                  | The trusted hierarchy and fail-closed scoping rules are now explicit; browser-provided scope is never authority.                                                         | Tenancy, Data Model, Authentication, ADR-002, server guards/tests.                                        |
| Browser/server database boundary                      | Browser bundles receive no DB driver, URL, credential, or trusted tenant scope.                                                                                          | ADR-002, Database Boundaries, root instructions, architecture check.                                      |
| Exact data entities and TypeScript interfaces         | The Product Spec's recommended shapes are conceptual and differ from the implemented tables/columns.                                                                     | `packages/db-cloud/src/schema/booking.ts`, migrations, Data Model reference.                              |
| API and route layout                                  | Suggested routes omit the current `/api/public/booking/...` shape and current `src/app` placement.                                                                       | Current Booking/Backoffice route trees, contracts, tests.                                                 |
| Shared-contract catalog                               | Suggested schema names do not define the current export surface.                                                                                                         | `packages/contracts/src/reservations` and its consumers.                                                  |
| `packages/booking` internal architecture              | The proposed `application` and `infrastructure` folders conflict with the current pure/deterministic package boundary; db adapters belong to db-cloud/application edges. | Root and `packages/booking/AGENTS.md`, ADR-002/003, current package exports.                              |
| Notification implementation                           | A suggested service interface does not reflect the current provider-neutral persisted outbox or missing worker/provider.                                                 | Booking README/STATUS, db-cloud schema/repository, Production Readiness.                                  |
| Feature-flag names                                    | The list combines current and speculative flags without proving entitlements or implementation.                                                                          | Current entitlement schema, server guards, Module Registry, scoped future decisions.                      |
| Migration, rollout, domain enablement, and deployment | A product spec cannot authorize migrations or establish that the target domain/environment is live.                                                                      | Deployment authority, Production Readiness, Booking STATUS, migration journal and dated runtime evidence. |
| Final architecture summary                            | It compresses target flow, implementation, and unimplemented notification delivery into one apparently current diagram.                                                  | ADR-002/003, current architecture/code, README/STATUS, readiness evidence.                                |

## 5. Current-vs-future separation

### Implemented bounded scope

The Module Registry records the bounded Phase 0/1 Public Booking and Backoffice
Reservations capabilities as product-approved and implemented in the
repository, with environment unverified and readiness blocked. The exact
implemented behavior belongs to README/STATUS, current code/tests, contracts,
and the executable booking schema. This review does not change those values.

### Current broader and future intent

The Product Spec remains the broader source for the product vision, experience
principles, future phases, initial non-goals, and extensibility guardrails.
Calling that content current Product Intent does not prove that each future
capability has its own `APPROVED` Product Decision. In particular, Phases 2-7
must remain visibly future and must not be summarized as implemented,
environment-enabled, or production-ready.

### Proposed or unresolved

The following need scoped product or authority review before execution:

- optional email versus the currently required email contract;
- staff capacity override and its permission/audit model;
- YUTA super-admin Booking capabilities;
- speculative feature flags and new integration packages;
- table/floor-plan ownership and its relationship to Establishment;
- custom domains, embedding modes, waitlists, group requests, notifications,
  external integrations, intelligence/provider use, and production SLOs; and
- exact future fields, entities, permissions, API shapes, and deployment model.

### Historical context

Section 35 is an implementation sequence, not a progress tracker. Suggested
package/route trees and the old final architecture summary also have provenance
value, but they must not remain presented as current technical authority after
an execution step. This review does not decide an archive destination or move
them.

## 6. Recommended treatment

### Option A — UPDATE IN PLACE

Update the existing Product Spec in a later approved execution step:

1. keep its stable path and role as broader Public Booking Product Intent;
2. preserve the unique intent mapped above, including future phases,
   non-goals, and open design space;
3. retain a short current-versus-future disclaimer and route current behavior
   to README/STATUS and lifecycle to the Module Registry;
4. replace exact schemas, API paths, package trees, route trees, permission
   catalogs, flags, and rollout prescriptions with concise intent plus links to
   their current authorities;
5. mark unresolved capability choices rather than treating recommended details
   as approved; and
6. preserve historical implementation sequencing as provenance until a later
   archive treatment is separately approved.

This is safer than `SPLIT`: the unique product intent is distributed throughout
the current document, and creating another active Product Intent file would
temporarily increase routing ambiguity. `KEEP AS-IS` is unsafe because agents
can mistake suggested architecture and current-looking diagrams for authority.
`NEEDS REVIEW` is unnecessary as the treatment can be selected without deciding
the unresolved product capabilities themselves.

## 7. OpenSpec future role

If YUTA later explicitly makes `openspec/specs/` normative, approved OpenSpec
specs should own specific behavioral requirements inside accepted durable
boundaries. The Product Spec can continue to own broader product intent,
non-goals, future context, and product rationale. OpenSpec does not silently
supersede accepted ADRs, architecture, or security boundaries, and an OpenSpec
change remains non-normative until the approved lifecycle promotes it.

## 8. Proposed execution scope

### Default file to modify

- `docs/features/public-booking/PRODUCT_SPEC.md` only.

Because the path remains stable, no current inbound link needs to change by
default. Update `README.md`, `STATUS.md`, `PRODUCT_KNOWLEDGE.md`, or an index only
if execution discovers a specific inaccurate routing statement; any such change
must be explicitly approved before expanding scope.

### Protected content and files

- preserve every unique Product Intent group until its destination is explicit;
- do not change lifecycle values or production gates;
- do not change Booking README/STATUS behavior claims during the spec cleanup;
- do not edit accepted ADRs, architecture, schemas, contracts, code, tests,
  page packs, operations, OpenSpec, or other Product Knowledge; and
- do not review or modify the POS Product Spec in the same step.

### Required execution validation

- compare every retained current-state statement to README/STATUS and the
  Module Registry;
- compare every runtime/data/tenancy/security statement to accepted ADRs and
  current architecture;
- map all removed technical prescriptions to a current authority or preserve
  them as clearly historical context;
- confirm no unique Product Intent is lost;
- run `pnpm docs:check`, `pnpm architecture:check`, targeted Prettier, Markdown
  link checks, and `git diff --check`; and
- confirm only the separately approved execution files changed.

## 9. Review validation

- Only this review file is created by Step 6.2D1.
- `PRODUCT_SPEC.md` remains unchanged at SHA-256
  `B98EE0F6BF9515922E43D0377428A2E33483A14EE6F08EF36A094183F24D4317`.
- No lifecycle assignment is changed or newly inferred.
- Accepted ADR-002/003 and current architecture control runtime, persistence,
  tenancy, client/server, and deployment questions.
- Unique Product Intent is assigned a retained home or marked `NEEDS_REVIEW`;
  none is proposed for deletion.

Status: APPROVED
