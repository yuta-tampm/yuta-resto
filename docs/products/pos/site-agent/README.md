# YUTA Site Agent Product Knowledge

Visibility: Engineering

Owner: YUTA engineering and restaurant operations

Proposed: 2026-08-27

## 1. Purpose

Site Agent is the authoritative restaurant-local service boundary for YUTA
POS. The POS client calls it over local HTTP using
`@yuta/contracts/local-pos`; Site Agent validates the boundary, executes
service-owned reads and mutations, owns local persistence through
`packages/db-pos`, and coordinates realtime notifications, printing, and the
currently supported printer device integration.

Site Agent is not a cloud API. It receives no cloud database ownership and
must not turn restaurant-local operational data into cloud data.

This file is the canonical Product Knowledge entry point for Site Agent. It
does not replace POS Product Knowledge, runtime/database architecture,
executable schemas, code and tests, deployment and operations procedures,
site/device evidence, or future normative OpenSpec specifications.

## 2. Runtime boundary

```text
apps/yuta-pos -> local HTTP / @yuta/contracts/local-pos
              -> apps/site-agent -> packages/db-pos -> local PostgreSQL
```

- `apps/yuta-pos` is the local client and operator UI. Its Next.js server
  forwards validated requests but owns neither POS persistence nor service
  transactions.
- `apps/site-agent` is the authoritative local API and service boundary for
  current POS persistence, mutations, read models, realtime notifications,
  printing, and device access.
- `packages/db-pos` owns the executable local schema, migrations,
  repositories, and seed data. Site Agent is its only runtime owner.
- Browser and POS UI code receive no database URL, database driver, trusted
  device path, or ownership of service transaction logic.

## 3. Current bounded scope

Verified repository implementation includes:

- a versioned local HTTP API with Zod-validated transport contracts and
  origin restrictions;
- local PostgreSQL reads, persistence, migrations, and service-owned
  transactions through `packages/db-pos`;
- order creation, item mutations, cancellation/restore, kitchen transitions,
  and atomic send-to-kitchen plus print-job creation;
- full-order and split-check payment transactions, persisted discounts and
  allocations, row locking, and idempotent command handling;
- bounded Kitchen read models plus notification-only SSE that prompts the POS
  client to reload authoritative state;
- local catalog, combo, instruction/allergen, establishment-profile, user, and
  print-setting administration;
- durable print jobs, queue state transitions, ESC/POS rendering, worker
  coordination, printer status, test printing, and the configured local
  character-device write boundary;
- local PIN authentication, revocable local management sessions, and
  admin/manager authorization for protected management operations;
- an admin/manager-protected operational reports read model derived from local
  orders and payments for one `Europe/Paris` 05:00 service window; and
- a health probe that reports local database readiness, with printer/device
  status exposed separately.

This scope does not claim every Site Agent route is protected by a management
session. The local-user list remains available for pre-session identity
selection, and existing operator service endpoints remain on their current
authorization boundary until an operator-login cutover is separately designed.

## 4. Capability map

| Capability / Scope | Site Agent responsibility                                                                                             | Consumer                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Orders             | Own order reads and transactional item/order commands, snapshots, locking, and retry semantics.                       | POS Home, order entry, and order detail.      |
| Payments           | Own combo allocation persistence, checks, payment capture, paid-state transitions, locking, and idempotency.          | POS payment and split-payment flows.          |
| Kitchen            | Own bounded service-day queue reads and authoritative kitchen/order-item transitions.                                 | POS Kitchen.                                  |
| Printing           | Own durable jobs, settings, status, rendering, retry/reprint state, worker coordination, and device writes.           | Kitchen send, receipts, and print management. |
| Catalog            | Own local catalog, instructions, allergens, combos, availability, station assignment, and historical snapshot inputs. | POS order entry and local management.         |
| Reports            | Derive a bounded read model from local orders and payments; create no report table or cloud export.                   | Local admin/manager reports.                  |
| Local users / auth | Own local PIN verification, login attempts, hashed sessions, revocation, and protected management-role checks.        | POS identity selection and management shell.  |
| Realtime           | Publish notification-only Kitchen SSE after relevant committed mutations; durable data remains in PostgreSQL.         | POS Kitchen refresh logic.                    |
| Health             | Probe local database availability and return service/database health without claiming deployment readiness.           | POS health aggregation and local operations.  |
| Device integration | Inspect and write only the trusted configured printer device through Site Agent-owned status/worker paths.            | Printing worker and management status.        |

## 5. Lifecycle summary

The bounded status below reuses the approved Module Registry. It describes
repository scope, not a particular restaurant deployment or device setup.

| Capability / Scope       | Product Decision | Implementation | Environment  | Production Readiness | External Dependency                                           | Review Marker                          |
| ------------------------ | ---------------- | -------------- | ------------ | -------------------- | ------------------------------------------------------------- | -------------------------------------- |
| Site Agent local runtime | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED` | `NOT_READY`          | `UNVERIFIED` — target host/devices/release not evidenced here | `OK` for repository ownership boundary |

## 6. Data ownership

| Data / concern                  | Owner                                                    | Notes                                                                                                                 |
| ------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Local POS establishment/config  | `packages/db-pos` through Site Agent                     | `pos_establishment_profiles` is a local receipt-display context, not cloud Establishment identity.                    |
| Local users and sessions        | `packages/db-pos` through Site Agent local auth services | Local users, PIN/login attempts, and revocable sessions are independent of cloud identity.                            |
| Catalog and combo configuration | `packages/db-pos` through Site Agent management services | Categories, items, instructions, allergens, combo rules/groups, and eligibility remain restaurant-local.              |
| Orders and kitchen state        | `packages/db-pos` through Site Agent order services      | Orders and order items persist the authoritative lifecycle and snapshots; Kitchen is a bounded projection of them.    |
| Payments and checks             | `packages/db-pos` through Site Agent financial services  | Checks, payments, discounts, and allocation snapshots are mutated transactionally.                                    |
| Print jobs and settings         | `packages/db-pos` plus Site Agent print services/worker  | Queue state and payload/settings snapshots are durable; device configuration and physical state are runtime concerns. |
| Reports                         | Site Agent read model over `packages/db-pos`             | Derived from orders and payments; no report persistence, cloud synchronization, or accounting/fiscal claim.           |
| Kitchen realtime notifications  | Site Agent in-memory event hub                           | Notifications carry bounded revision metadata; they are not durable order data or an alternative source of truth.     |

`packages/db-pos` is the Site Agent persistence boundary. The POS browser/UI
does not own a database. `packages/db-cloud` does not own POS operational data,
and the standalone Display database has no role in Site Agent persistence.

## 7. Cloud boundary

- Orders, order items, payments, checks, discounts, kitchen state, print jobs,
  local users, sessions, catalog, and operational reports remain local and are
  never automatically synchronized to cloud persistence.
- Site Agent is not a cloud synchronization worker. Any future analytics,
  export, or synchronization product requires a separate approved decision,
  contracts, consent boundary, and data model.
- Cloud users and memberships do not replace local POS users or sessions.
- Cloud Establishment and the singleton local POS establishment profile are
  separate bounded contexts. The local profile has no cloud identity,
  licensing, legal, fiscal, address, or contact meaning.
- Site Agent receives neither `CLOUD_DATABASE_URL` nor Display database
  ownership. Agents must not invent joins or synchronization between these
  boundaries.

## 8. Failure and resilience boundary

Site Agent is a restaurant-local failure boundary. Normal POS, Kitchen,
payment-recording, and local printing operation can continue when Internet and
YUTA cloud services are unavailable, provided the restaurant LAN, POS server,
Site Agent, local PostgreSQL, and required devices remain healthy.

A Site Agent or local PostgreSQL outage is different from a cloud outage: the
POS UI cannot complete authoritative operational reads or mutations while its
local service boundary is unavailable. Durable print jobs and committed data
survive browser refreshes and service restarts, but printer/device failures are
handled locally and may leave jobs pending or failed for recovery.

The current installable PWA is not a browser-offline POS. Page navigation and
operational actions still require the local Next.js server and Site Agent.
Browser standby suppresses selected automatic refreshes only; it does not stop
Site Agent, PostgreSQL, durable jobs, or the printer worker.

## 9. Printing and device boundary

Site Agent owns print-job creation and maintenance, ESC/POS rendering, queue
worker coordination, printer-device inspection, and physical writes to the
trusted `POS_PRINTER_DEVICE` configured in its environment. The browser can
manage safe persisted ticket settings and commands through authenticated
routes, but it never receives or selects the device path and never writes to
the printer directly.

Queue acceptance, worker/device availability, successful byte transfer, and
physical paper output are distinct facts. Repository `IMPLEMENTED` status does
not prove a printer is configured, writable, loaded, cutting correctly, or
ready at a particular restaurant. Printer evidence is specific to the named
site, device, host, configuration, and environment; evidence from one site or
device cannot silently authorize another.

## 10. Security and local-auth boundary

Local identities use `admin`, `manager`, `staff`, and `kitchen` roles plus
local PIN credentials and revocable Site Agent sessions. They are not cloud
users, memberships, roles, or sessions.

Site Agent validates HTTP payloads through local POS contracts and enforces
protected management authority server-side. Admins and managers can access the
management shell; additional service rules constrain which user roles a
manager may manage and preserve the last active admin. Role, active-state, and
PIN changes invalidate affected sessions through `authVersion`.

Browser-provided identity, role, status, authorization, device path, or
transaction result is not authoritative. A valid server-resolved local session
and service-owned rules are required where the current route is protected.
There is no approved cloud identity federation, shared session, or cloud-role
bypass for local POS access.

## 11. Related modules and runtimes

| Related module/runtime | Relationship                                                                                               | Source of truth / direction                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| YUTA POS               | Client/operator UI that consumes Site Agent through local HTTP contracts; it owns no POS database.         | POS Product Knowledge and `apps/yuta-pos`.                       |
| Orders                 | Site Agent owns authoritative order/item mutations, snapshots, and persistence.                            | Order services and `packages/db-pos` order schema.               |
| Payments               | Site Agent owns checks, financial transactions, locking, idempotency, and persisted allocation results.    | Financial service and payment schema.                            |
| Kitchen                | Reads and changes persisted order-item state; SSE only signals that authoritative data should be reloaded. | Kitchen/order services, event hub, and Kitchen page pack.        |
| Printing               | Consumes committed order/receipt snapshots and owns queue, rendering, worker, and printer-device behavior. | Print services, printing schema, and print-management page pack. |
| Catalog                | Supplies current item/configuration inputs that Site Agent validates and snapshots during operations.      | Catalog/combos schema and management services.                   |
| Reports                | Reads bounded order/payment projections without new persistence or cloud export.                           | Management reports service and reports page pack.                |
| Local users / auth     | Supplies local actor/session authority for protected management flows.                                     | Local auth/user services and db-pos auth/user schema.            |
| Cloud Backoffice       | Separate cloud runtime; it neither owns nor administers POS operational data.                              | Runtime/database ADRs and cloud architecture.                    |
| Display                | Separate standalone runtime and persistence; it shares no Site Agent database or device boundary.          | Display architecture and app-owned schema.                       |

## 12. Current limitations and non-goals

- No cloud synchronization of POS operational data is approved or
  implemented.
- No direct browser or POS-client database access is allowed.
- Repository implementation does not prove Site Agent is deployed, healthy,
  or running the same version at a named restaurant.
- Repository printer/device code does not prove site-specific hardware
  readiness or physical output.
- No cloud identity federation or replacement of local POS users exists.
- Display persistence is not shared with Site Agent or `packages/db-pos`.
- Site Agent being local does not create browser-only emergency operation; the
  local server, Site Agent, and PostgreSQL remain required.
- Health/database readiness is not Production Readiness and does not replace
  release-specific migration, backup, timezone, rollback, host, and device
  evidence.
- Site Agent is not a fiscal/certified cash-register service, cloud reporting
  service, or generic hardware platform.

## 13. Source map

| Question                                            | Read this source                                                                                                                                                                                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What is the Site Agent product/runtime boundary?    | This Product Knowledge home.                                                                                                                                                                                                                |
| What does the POS product do?                       | [POS Product Knowledge](../README.md) and [POS Product Specification](../PRODUCT_SPEC.md).                                                                                                                                                  |
| Who owns POS persistence and runtime boundaries?    | [`DATABASE_BOUNDARIES.md`](../../../architecture/DATABASE_BOUNDARIES.md), [ADR-001](../../../decisions/ADR-001-runtime-families-and-product-visibility.md), and [ADR-003](../../../decisions/ADR-003-database-ownership-boundaries.md).     |
| What failure/offline behavior is approved?          | [`OFFLINE_STRATEGY.md`](../OFFLINE_STRATEGY.md).                                                                                                                                                                                            |
| What lifecycle assignment is approved?              | [`MODULE_REGISTRY.md`](../../../MODULE_REGISTRY.md) and [`LIFECYCLE_STATUS_MODEL.md`](../../../LIFECYCLE_STATUS_MODEL.md).                                                                                                                  |
| How should conflicting evidence be interpreted?     | [`AUTHORITY_MODEL.md`](../../../AUTHORITY_MODEL.md).                                                                                                                                                                                        |
| What is implemented now?                            | [`apps/site-agent`](../../../../apps/site-agent), [`packages/db-pos`](../../../../packages/db-pos), [`apps/yuta-pos`](../../../../apps/yuta-pos), and [`@yuta/contracts/local-pos`](../../../../packages/contracts/src/local-pos).          |
| What UI-specific evidence exists?                   | [POS page-pack index](../../../ui/pages/README.md), [Kitchen](../../../ui/pages/pos-kitchen/README.md), [printing](../../../ui/pages/pos-management-printing/README.md), and [reports](../../../ui/pages/pos-management-reports/README.md). |
| What acceptance coverage is expected?               | [`QA_CHECKLIST.md`](../QA_CHECKLIST.md) and current Site Agent/db-pos/POS tests.                                                                                                                                                            |
| Is a particular restaurant release or device ready? | [`PRODUCTION_READINESS.md`](../../../operations/PRODUCTION_READINESS.md), [`DEPLOYMENT.md`](../../../operations/DEPLOYMENT.md), and dated release/site/device evidence.                                                                     |

## 14. Agent interpretation rules

1. Treat `apps/yuta-pos` as the client/UI, never as the POS database owner.
2. Treat `apps/site-agent` as the authoritative restaurant-local service
   boundary.
3. Do not use `packages/db-pos` directly from browser or POS UI code.
4. Do not sync POS operational data to cloud persistence without an accepted
   decision defining the new boundary.
5. Do not merge cloud users or memberships with POS local users or sessions.
6. Do not treat repository implementation, a health response, or local QA as
   deployment, site, printer, or hardware readiness.
7. Do not infer Product Decision from code, routes, schemas, or tests.
8. When sources conflict or evidence is insufficient, apply the Authority
   Model and retain `NEEDS REVIEW`; do not normalize by assumption.
9. OpenSpec is not currently normative for Site Agent.

## 15. OpenSpec position

There is no normative Site Agent specification under `openspec/specs/` today.
This home retains broader runtime, data-ownership, device, and failure-boundary
context. After YUTA explicitly approves OpenSpec specifications as normative,
approved specs may become the primary authority for specific behavioral
requirements inside accepted boundaries. Accepted runtime and database
decisions remain the highest authority for their durable boundaries. No
OpenSpec artifact is created or modified by this step.

## 16. Status

Status: APPROVED
