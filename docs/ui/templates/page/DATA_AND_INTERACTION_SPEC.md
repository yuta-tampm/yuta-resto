# <Page or screen name> — Data and Interaction Specification

Status: Draft

Visibility: Engineering

## Runtime and trust boundary

Describe only the boundary that applies to this application, such as cloud
authorization/tenant resolution, public-resource resolution, local POS
installation/session, standalone-local ownership, or an external provider.

Do not populate organization, establishment, or membership fields unless the
current target actually uses them.

## Data ownership and transport

State the current data owner/source, transport/contracts, trusted server or
local-service boundary, and browser constraints.

## Current domain mapping

| Current field/model/contract | UI presentation | Existing transformation | Gap |
| ---------------------------- | --------------- | ----------------------- | --- |

Use current contracts and schema. A UI model is not a database schema.

## Current interactions

List current navigation, selection, create/update/delete, command, preview,
confirmation, retry, polling, and device interactions that apply.

## Mutations / actions / transactions

Document the existing owner and semantics. Do not move transactional or
authoritative behavior into presentation code during UI refactoring.

## Validation

List current client and trusted-boundary validation and how input is preserved
or recovered after failure.

## Operational and UI states

Define applicable loading, empty, unauthorized/forbidden, validation, conflict,
pending, success, service/database/device unavailable, offline/degraded, retry,
and recovery states. Include only states that exist or are explicitly approved
for the target runtime.

## Polling / offline / device behavior

Document current cadence, visibility/focus rules, fallback behavior, queues,
hardware ownership, or provider behavior when applicable. Write `Not
applicable` when none exists.

## Decisions that must not be guessed

List unclear destructive, merge/replace, dirty-state, preview, persistence,
authorization/session, offline, device, printer-routing, or transaction
semantics.

## Proposed persistence/contract changes

Describe separately. Require approval before changing fields, enums,
permissions, contracts, APIs, schema, migrations, or privileged device
configuration.
