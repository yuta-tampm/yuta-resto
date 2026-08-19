# POS Management Establishment — Data and Interaction Specification

Status: Phase 0 proposal awaiting approval

Visibility: Engineering

## Runtime and trust boundary

```text
browser form
  -> Next.js Server Component / Server Action
  -> server-only site-agent client with local management bearer
  -> protected site-agent route/service
  -> packages/db-pos
  -> local PostgreSQL
```

The browser supplies only untrusted form input. Active local role/session is
derived server-side. No cloud IDs or roles are accepted.

## Current and proposed mapping

| Source                                  | UI/payload use              | Current truth                   | Approval gap              |
| --------------------------------------- | --------------------------- | ------------------------------- | ------------------------- |
| Proposed `displayName`                  | settings field              | Absent                          | storage and validation    |
| Proposed revision token                 | stale-save guard            | Absent                          | token and CAS semantics   |
| Local management session                | authorize read/edit         | Implemented admin/manager shell | edit-role decision        |
| `customer_receipt` payload              | immutable name snapshot     | Version 1 has no name           | optional field/versioning |
| Receipt renderer                        | optional centered name line | no name line                    | typography/placement      |
| Source receipt payload on retry/reprint | exact reuse                 | implemented                     | must remain unchanged     |

## Nearby persistence patterns

`print_settings` and `pos_instruction_settings` are fixed-id `default`
singletons with database checks and ensure/upsert services. They demonstrate a
repository-supported singleton approach but do not settle the profile table's
semantic scope. They also do not implement optimistic concurrency, so their
last-write-wins behavior must not be copied silently.

## Proposed interactions

1. Route load validates the local management session, then reads the local
   profile through site-agent.
2. Unconfigured response returns `displayName: null` rather than a fake value.
3. Edit submits the field plus an approved revision token if optimistic
   concurrency is selected.
4. Trusted Zod validation runs again at the contract/service boundary.
5. Success returns the authoritative saved value/revision and revalidates the route.
6. Conflict preserves submitted input and offers explicit reload/retry.
7. A new receipt command reads the current profile within the existing locked
   receipt-creation transaction and writes the normalized value, or absence,
   into the immutable payload.
8. Retry/reprint copies the old payload and never rereads the profile.
9. Preview uses the same payload builder and renderer read-only, with no job.

## Required failure semantics

- Invalid input: field error; preserve input; no write.
- Expired session: existing fail-closed redirect; no write.
- Forbidden role if approved: 403/error state; no client-trusted role.
- Stale revision: 409 with reload/retry recovery; no silent overwrite.
- Site-agent/database unavailable: truthful error; preserve input where safe.
- Receipt profile read failure: fail the new receipt command atomically rather
  than create a partially authoritative payload; exact product behavior needs approval.
- Unconfigured name: successful receipt creation with the name line omitted.

## Decisions that must not be guessed

Table/resource shape, maximum length, Unicode/control-character policy,
admin/manager rights, clearing/rename behavior, audit/history, optimistic
concurrency, receipt payload versioning, and later consumers.

## Expected protected tests after approval

- contract parse/trim/length/Unicode/null/revision cases;
- protected GET/PATCH route and role denial cases;
- db singleton/check/CAS/integration behavior;
- POS server action input preservation, success, conflict, session expiry, and outage;
- receipt creation snapshots the current name or absence;
- rename does not change queued/printed/retried/reprinted jobs;
- preview and production renderer use the same optional field;
- renderer omits the line when absent and retains non-fiscal/no-VAT assertions.
