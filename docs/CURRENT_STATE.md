# YUTA Current State

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-27

## Purpose and how to read this document

This document is the concise, repository-wide summary and routing layer for
YUTA's current products and runtimes. It gives cross-product orientation; it
does not replace scoped Product Knowledge, lifecycle records, architecture
decisions, UI evidence, or production-readiness evidence.

Use the sources according to the question:

- product context and intent: [`PRODUCT_KNOWLEDGE.md`](PRODUCT_KNOWLEDGE.md)
  and the owning Product Knowledge Home;
- lifecycle assignments: [`MODULE_REGISTRY.md`](MODULE_REGISTRY.md) and the
  vocabulary in [`LIFECYCLE_STATUS_MODEL.md`](LIFECYCLE_STATUS_MODEL.md);
- authority and conflict resolution:
  [`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md);
- production gates:
  [`operations/PRODUCTION_READINESS.md`](operations/PRODUCTION_READINESS.md);
  and
- UI delivery evidence: the [`ui/pages` index](ui/pages/README.md) and the
  relevant page pack.

Current tracked code and tests describe repository implementation. They do not
prove which version is deployed or enabled in production. Claims about a live
runtime require dated deployment and runtime evidence.

## Runtime families

| Runtime family                      | Current repository boundary                                                                                                                                | Durable routing                                                                                                                                                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloud and public                    | Public Website, independent Booking and Direct Feedback applications, cloud server foundations, and shared cloud persistence.                              | [Architecture overview](architecture/OVERVIEW.md), [ADR-001](decisions/ADR-001-runtime-families-and-product-visibility.md), and [ADR-003](decisions/ADR-003-database-ownership-boundaries.md). |
| Backoffice                          | Authenticated restaurant administration over trusted organization and active-establishment context.                                                        | [Product Knowledge](PRODUCT_KNOWLEDGE.md), [Identity / Access](features/identity-access/README.md), and the [Module Registry](MODULE_REGISTRY.md).                                             |
| Restaurant-local POS and Site Agent | POS is the operator client; Site Agent owns local APIs, `packages/db-pos`, transactions, realtime, printing, and device boundaries.                        | [POS Product Knowledge](products/pos/README.md), [Site Agent Product Knowledge](products/pos/site-agent/README.md), and ADR-003.                                                               |
| Standalone Display                  | Display owns its application, app-local database access, media files, administration, and playback; it shares no cloud or POS persistence.                 | [Display Product Knowledge](products/display/README.md) and ADR-003.                                                                                                                           |
| Reserved Platform Admin             | `apps/platform-admin` is a reserved platform-wide administration boundary; no tracked application or approved capability scope currently exists within it. | [Architecture overview](architecture/OVERVIEW.md) and the [Module Registry](MODULE_REGISTRY.md).                                                                                               |

Local POS and Display products are first-class maintained components, not
legacy. Their local operational capabilities are not public YUTA service
claims.

## Current product snapshot

| Product or module                | Bounded current state                                                                                                                                                                                                                                                                                                                  | Read next                                                                                                                                                                                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public Website                   | Marketing, legal, SEO, and integration-information pages are implemented in the repository. Its bounded Product Decision remains unresolved, and repository presence is not evidence of production publication, hosting, domain, or legal readiness.                                                                                   | [Public Website](features/public-website/README.md) and [Module Registry](MODULE_REGISTRY.md).                                                                                               |
| Identity / Access                | Password authentication, scoped sessions, tenant selection, trusted organization/establishment context, and membership administration foundations are implemented. The tenancy boundary is approved; Authentication and Access workflow Product Decisions remain unresolved.                                                           | [Identity / Access Product Knowledge](features/identity-access/README.md) and the authentication/tenancy architecture.                                                                       |
| Public Booking / Reservations    | The independent public booking flow and establishment-scoped Backoffice reservation operations are implemented in the repository with bounded limitations. Notification delivery, target-environment acceptance, provider configuration, and launch gates remain open.                                                                 | [Public Booking README](features/public-booking/README.md), [Booking Status](features/public-booking/STATUS.md), and [ADR-002](decisions/ADR-002-independent-public-booking-application.md). |
| Reputation / Direct Feedback     | Direct public feedback collection, tenant-scoped Backoffice inboxes, persisted mutations, and the Google connector foundation are implemented. End-to-end review import, scheduled synchronization, and reply reconciliation remain partial and production-gated.                                                                      | [Reputation README](features/reputation/README.md), [Reputation Status](features/reputation/STATUS.md), and [ADR-004](decisions/ADR-004-independent-public-feedback-application.md).         |
| Establishment                    | The bounded cloud establishment profile and editor are implemented for identity, address, contact, media, language, service-mode, and visibility data. Booking-owned schedules and restaurant-local POS establishment data remain separate. Rooms/Tables is not approved by this bounded scope.                                        | [Establishment Product Knowledge](features/establishment/README.md) and [ADR-006](decisions/ADR-006-cloud-establishment-profile-context.md).                                                 |
| Today                            | The current dashboard implements trusted establishment context, local date, Reservations, enabled service periods and exceptions, and entitled Reputation attention. Its approved broader information families are future intent: Tâches, handover, Pointage, Stock, Suppliers, internal knowledge, and Compliance are not integrated. | [Today Product Knowledge](features/today/README.md) and [ADR-005](decisions/ADR-005-today-operational-steering.md).                                                                          |
| Personnel                        | The bounded OWNER-only establishment employee dossier is implemented. Personnel Documents and Register are development-only slices. External OCR/AI evidence is local or synthetic only. Detailed fields, Documents, Register, Formalités, and AI boundaries live in the Personnel Home and page packs.                                | [Personnel Product Knowledge](features/personnel/README.md) and the [UI page-pack index](ui/pages/README.md).                                                                                |
| Formalités development prototype | An approved, employee-connected development prototype reads an allowlisted Personnel projection and keeps its interaction state in memory. It creates no durable Formalités record, generated artifact, signature request, delivery, or automatic Documents link.                                                                      | [Personnel Product Knowledge](features/personnel/README.md) and the [Formalités page pack](ui/pages/backoffice-equipe-formalites-personnel/README.md).                                       |
| Durable Formalités lifecycle     | A separate durable draft, generation, version, signature, and signed-artifact handoff lifecycle is proposed but is not implemented or enabled. Its durable data ownership and legal, privacy, template, storage, signature, and operational gates remain unresolved.                                                                   | [Personnel Product Knowledge](features/personnel/README.md), [Module Registry](MODULE_REGISTRY.md), and [Production Readiness](operations/PRODUCTION_READINESS.md).                          |
| POS / Site Agent                 | Restaurant-local ordering, catalog, payments, kitchen, printing, management, reports, and local-user foundations are implemented behind Site Agent and `packages/db-pos`. This does not prove a particular host, migration state, timezone, printer, device, or restaurant release is ready.                                           | [POS Product Knowledge](products/pos/README.md), [Site Agent Product Knowledge](products/pos/site-agent/README.md), and the [UI page-pack index](ui/pages/README.md).                        |
| Display                          | Standalone media administration, app-owned metadata/files, and resilient playback are implemented in the repository. Application authentication, media-file reconciliation and retention, backup/restore, target device behavior, and site readiness remain unresolved or unverified.                                                  | [Display Product Knowledge](products/display/README.md).                                                                                                                                     |
| Platform Admin                   | Only the platform-wide runtime boundary is reserved. The application is not started, not enabled, and has no approved capability scope.                                                                                                                                                                                                | [Module Registry](MODULE_REGISTRY.md) and [Architecture overview](architecture/OVERVIEW.md).                                                                                                 |

These summaries are bounded orientation, not a duplicated lifecycle table.
Use the Module Registry for the five independent lifecycle dimensions.

## Backoffice maturity at a glance

Navigation visibility does not prove product approval, implementation,
persistence, environment enablement, or readiness.

- **Integrated or data-backed repository slices:** trusted authentication and
  tenancy foundations, membership administration, Reservations, Reputation,
  the bounded Establishment profile, the current Today dashboard, the bounded
  Personnel dossier, Personnel Documents, and Register. Their Product Decision,
  environment, and readiness scopes differ; use the Module Registry and owning
  Product Knowledge.
- **Fixture-backed prototypes:** Rooms/Tables, Stock Inventory, Stock
  Movements, Suppliers, Compliance, and Creative Studio expose demonstration
  UI/local presentation state rather than a persisted capability. Stock
  Product Decisions remain unresolved; the other unmapped surfaces remain
  `NEEDS REVIEW` below.
- **Development-only slices:** Personnel Documents and Register use real
  bounded repository persistence but fail closed outside their approved
  development scope. The employee-connected Formalités prototype is a separate
  in-memory development slice.
- **Planned placeholders:** Planning, Pointage, Tâches du jour, Technical
  Sheets, and the additional planned surfaces below are not implemented merely
  because a route or navigation item exists.

## Readiness and external dependencies

Repository implementation, local QA, synthetic evidence, a configured local
service, or a passing page pack does not establish production readiness.
Detailed company, legal/privacy, security, infrastructure, vendor, Personnel,
AI, Booking, Reputation, and local-release gates live only in
[`operations/PRODUCTION_READINESS.md`](operations/PRODUCTION_READINESS.md).

- Global cloud and Backoffice production gates remain open.
- Public Booking and Public Feedback/Reputation remain blocked by their
  capability-specific registers and the global cloud gates.
- Personnel production use remains blocked by legal/privacy, templates,
  retention, storage/scanning, signature, audit, security, and operations
  evidence. Real personnel files must not be sent to an external AI/OCR
  provider until all applicable Personnel and AI gates are approved.
- POS/Site Agent readiness is release-, restaurant-, host-, migration-,
  timezone-, printer-, and device-specific. Evidence from one scope cannot
  authorize another.
- Display repository behavior does not prove database, upload storage,
  network, application, playback, or device readiness at a named site.

The repository records that the product owner authorized and confirmed a
private OpenAI Sales-form submission on 2026-08-18, but it does not record an
OpenAI response. That submission authorizes no account, key, SDK, API request,
spend, synthetic benchmark, or production processing. Preserve this bounded
statement unless newer dated, authorized repository evidence exists; provider
details belong in
[`OPENAI_PROVIDER_ELIGIBILITY.md`](operations/OPENAI_PROVIDER_ELIGIBILITY.md).

## Unresolved / NEEDS REVIEW areas

No Product Decision is inferred for the surfaces below.

| Area                                                 | Preserved current boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rooms / Tables                                       | Fixture-backed UI prototype only. ADR-006 does not approve its detailed lifecycle. Keep unresolved until a dedicated Product Knowledge/Registry mapping exists.                                                                                                                                                                                                                                                                                                                                                            |
| Compliance                                           | Fixture/demo presentation exists, and Compliance is an approved future Today information family, but no current Compliance capability or integration is thereby approved or implemented. A dedicated source/Registry mapping is still needed.                                                                                                                                                                                                                                                                              |
| Creative Studio                                      | Fixture/demo presentation exists without a dedicated current Registry row or approved capability mapping.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Menu / internal Resources / Marketing / Subscription | Planned placeholder surfaces remain unresolved. Do not remove or promote them until dedicated Product Knowledge/Registry mappings exist.                                                                                                                                                                                                                                                                                                                                                                                   |
| Planning / Pointage / Tâches du jour                 | The source-module Product Decisions remain unresolved where currently recorded, and no current Personnel or Today integration with these modules is implemented. ADR-005 separately approves future Today aggregation of Tâches du jour / operational tasks and actionable Pointage anomalies; that Today Product Intent neither approves the Pointage or Tâches du jour source modules nor means those integrations are implemented. Planning gains no Today relationship from ADR-005 and remains separately reviewable. |
| Stock and Technical Sheets                           | Inventory, Suppliers, and Movements are fixture-backed prototypes; Technical Sheets is a planned placeholder. Their Product Decisions remain unresolved.                                                                                                                                                                                                                                                                                                                                                                   |
| Personnel Documents and durable Formalités ownership | Personnel Documents lacks a dedicated approved Registry row, and durable Formalités data ownership remains under review.                                                                                                                                                                                                                                                                                                                                                                                                   |

### Preserved historical note — NEEDS REVIEW

The Wave G Phase 8 fragment `no-external-call disclosure` remains without a
verified destination. Repository search and Git history locate the exact
fragment only in `CURRENT_STATE.md`; they do not establish its intended source
or context. Preserve this note until provenance is positively identified from
a current source or Git history and the information is verified at a durable
destination. Do not rely on Git-only recovery.

## Source map

| Question or scope                    | Authoritative next source                                                                                                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authority and conflicts              | [`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md)                                                                                                                                                    |
| Lifecycle vocabulary and assignments | [`LIFECYCLE_STATUS_MODEL.md`](LIFECYCLE_STATUS_MODEL.md) and [`MODULE_REGISTRY.md`](MODULE_REGISTRY.md)                                                                                       |
| Product Knowledge routing            | [`PRODUCT_KNOWLEDGE.md`](PRODUCT_KNOWLEDGE.md)                                                                                                                                                |
| Personnel                            | [Personnel Product Knowledge](features/personnel/README.md)                                                                                                                                   |
| Today                                | [Today Product Knowledge](features/today/README.md)                                                                                                                                           |
| Establishment                        | [Establishment Product Knowledge](features/establishment/README.md)                                                                                                                           |
| Identity / Access                    | [Identity / Access Product Knowledge](features/identity-access/README.md)                                                                                                                     |
| Site Agent                           | [Site Agent Product Knowledge](products/pos/site-agent/README.md)                                                                                                                             |
| Display                              | [Display Product Knowledge](products/display/README.md)                                                                                                                                       |
| Public Booking / Reservations        | [Public Booking README](features/public-booking/README.md) and [Status](features/public-booking/STATUS.md)                                                                                    |
| Reputation / Direct Feedback         | [Reputation README](features/reputation/README.md) and [Status](features/reputation/STATUS.md)                                                                                                |
| POS                                  | [POS Product Knowledge](products/pos/README.md), [Site Agent Product Knowledge](products/pos/site-agent/README.md), and the [UI page-pack index](ui/pages/README.md)                          |
| UI delivery and chronology evidence  | [`ui/pages/README.md`](ui/pages/README.md) and the owning page pack                                                                                                                           |
| Production and external dependencies | [`operations/PRODUCTION_READINESS.md`](operations/PRODUCTION_READINESS.md), then the capability-specific status or operations source                                                          |
| Runtime and database ownership       | [Architecture overview](architecture/OVERVIEW.md), [ADR-001](decisions/ADR-001-runtime-families-and-product-visibility.md), and [ADR-003](decisions/ADR-003-database-ownership-boundaries.md) |
| Deployment and live-runtime evidence | [`operations/DEPLOYMENT.md`](operations/DEPLOYMENT.md) plus dated evidence for the exact environment, version, site, and device                                                               |
