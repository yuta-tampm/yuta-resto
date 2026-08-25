# POS management printing — Data and Interaction Specification

Status: Draft

Visibility: Engineering

## Runtime and trust boundary

The trusted boundary is the local management session validated by the
site-agent. Only local `admin` and `manager` users reach this route. This screen
does not accept or derive cloud organization/establishment context.

## Data ownership and transport

The site-agent owns queue, settings, status computation, and hardware work;
`@yuta/db-pos` owns persistence. The YUTA POS server layer forwards a validated
bearer token through the existing site-agent client. The browser receives only
serialization-safe local POS contract data and never database or device access.

## Current domain mapping

| Current field/model/contract        | UI presentation                                         | Existing transformation                            | Gap                                                  |
| ----------------------------------- | ------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| `LocalPrintJob`                     | Recent ticket row, status, summary, error, actions      | French labels and date formatting                  | None identified                                      |
| `LocalPrintJobsResponse.summary`    | Four complete-queue counters                            | Status-keyed counts                                | None identified                                      |
| `LocalPrintJobsResponse.pagination` | Previous/next and page count                            | Ten jobs per page                                  | None identified                                      |
| `LocalPrintSettings`                | Cuisine/BAR enablement, copies, font, spacing, previews | Boolean/numeric values represented as form strings | At least one destination must remain enabled         |
| `LocalPrinterStatus`                | Safe channel/device/queue metrics and warning           | Status/device presentation mapping                 | Physical paper success is intentionally not inferred |

## Current interactions

Back navigation returns to management. Order-linked jobs navigate to their
order. Users paginate, independently enable Cuisine or BAR printing, edit
settings with live ticket previews, create a test job, transition eligible
jobs, reprint/retry, and record a required failure reason in a dialog. Empty
failure submission displays an accessible inline error without calling the
server action. Invalid-status and missing-job
conflicts offer an explicit page refresh while preserving the existing polling
rules.

## Mutations / actions / transactions

Server actions validate with `@yuta/contracts/local-pos`, require fresh local
management credentials, call site-agent endpoints, and revalidate this route.
The site-agent service validates state transitions and persists changes. New
order sends create only enabled destination tickets; existing queued and
printed jobs keep their immutable payload. Test jobs render only enabled
destinations. The worker owns automatic claiming, rendering, and device writes.

## Validation

Settings and commands are parsed by Zod at the server-action boundary and again
at the site-agent route/service boundary. The failure reason is required and
limited by the current input. Client validation mirrors the required trimmed
value and connects its inline error to the field; server validation remains
authoritative. Cuisine and BAR cannot both be disabled; the UI prevents the
last active switch from being turned off, while contract and database checks
enforce the same invariant. Client state retains submitted values while action
errors are shown; command conflicts instruct the operator to refresh and expose an
`Actualiser` recovery action.

## Operational and UI states

Current states include invalid-session redirect, site-agent unavailable, empty
queue, pending buttons, validation error, invalid-status conflict, missing job,
success feedback, printer attention/unavailable/not-configured, failed job with
reason, and retry/reprint recovery. Job command success uses a status message;
recoverable conflicts use the existing client router refresh. No new offline UI
state is approved.

## Polling / offline / device behavior

Refresh every five seconds only while visible and the browser-local screen
schedule permits automatic refresh, plus immediate refresh on focus or
visibility restoration under the same condition. Status polling must not open
or claim RFCOMM. The site-agent worker exclusively claims supported pending
jobs and performs explicit print/test hardware I/O; failures remain queued for
recovery even while the browser is in standby.

## Decisions that must not be guessed

Do not guess new printer routing, device configuration/discovery, destructive
or bulk queue behavior, alternate role access, dirty-form navigation handling,
offline editing semantics, or changes to automatic worker transitions.

## Proposed persistence/contract changes

None proposed or approved in Phase 0.

## Phase 4 integration reconciliation

Completed on 2026-08-09 with no implementation gap:

| UI responsibility              | Contract / transport                                          | Runtime / persistence owner                   | Result   |
| ------------------------------ | ------------------------------------------------------------- | --------------------------------------------- | -------- |
| Recent jobs and total counters | `LocalPrintJobsResponse`, `GET /api/v1/print-jobs`            | site-agent print-job service / `print_jobs`   | Complete |
| Pagination                     | `PrintJobsQuery`, response `pagination`, fixed page size `10` | site-agent print-job service                  | Complete |
| Job transitions and recovery   | `PrintJobCommand`, `POST /print-jobs/:id/commands`            | site-agent transition validation / db-pos     | Complete |
| Ticket settings and previews   | `LocalPrintSettings`, `GET/PATCH /api/v1/print-settings`      | settings service / singleton `print_settings` | Complete |
| Explicit test printing         | `POST /api/v1/print-jobs/test`, `LocalPrintJob`               | print-job service / worker-owned device flow  | Complete |
| Safe printer state             | `LocalPrinterStatus`, `GET /api/v1/printer-status`            | printer-status service                        | Complete |

The POS client parses requests and responses with the same contracts used by
the site-agent routes. Jobs, settings, and mutations require the validated
local management token. Printer status intentionally remains a safe
observational endpoint: it reads queue/device metadata and never opens, claims,
reads, or writes the RFCOMM channel. The browser receives no database driver,
database URL, raw payload snapshot, or privileged device path.

Phase 4 therefore introduces no persistence or contract change. Printer
pairing/discovery, new fields or states, mutable page size, cloud sync, bulk
commands, and device configuration remain unapproved and excluded.
