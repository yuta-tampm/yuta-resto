# POS Management Establishment — Data and Interaction Specification

Status: Phase 4 real local integration implemented

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

## Phase 3 prototype boundary

The implemented development-only client interaction never crosses the browser
boundary. It compares the draft to the fixture exactly, enables reset and a
simulated-submit status, preserves the draft, and performs no request or write.
It intentionally does not normalize or validate input, infer role-specific edit
rights, confirm clear/rename, or model concurrency. Those remain real vertical
slice decisions below.

Phase 3 is historical. Phase 4 removed the fixture-only boundary.

## Current and proposed mapping

| Source                                  | UI/payload use              | Current truth             | Approval gap |
| --------------------------------------- | --------------------------- | ------------------------- | ------------ |
| `displayName`                           | settings field              | singleton row or null     | implemented  |
| integer revision                        | stale-save guard            | response and PATCH CAS    | implemented  |
| Local management session                | authorize read/edit         | active admin/manager      | implemented  |
| `customer_receipt` payload              | immutable name snapshot     | optional version-1 field  | implemented  |
| Receipt renderer                        | optional centered name line | omitted when absent       | implemented  |
| Source receipt payload on retry/reprint | exact reuse                 | keeps old name or absence | implemented  |

## Nearby persistence patterns

`print_settings` and `pos_instruction_settings` are fixed-id `default`
singletons with database checks and ensure/upsert services. They demonstrate a
repository-supported singleton approach but do not settle the profile table's
semantic scope. They also do not implement optimistic concurrency, so their
last-write-wins behavior must not be copied silently.

## Implemented interactions

1. Route load validates the local management session, then reads the local
   profile through site-agent.
2. Unconfigured response returns `displayName: null` rather than a fake value.
3. Edit submits the field plus its integer revision token.
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

## Durable decisions

The table/resource, validation, admin/manager rights, no-clear rule, no-audit
scope, revision CAS, optional compatible receipt field, and initial snapshot
point are approved for this slice. Later consumers and any additional fields
remain separately approval-gated.

## Expected protected tests after approval

- contract parse/trim/length/Unicode/null/revision cases;
- protected GET/PATCH route and role denial cases;
- db singleton/check/CAS/integration behavior;
- POS server action input preservation, success, conflict, session expiry, and outage;
- receipt creation snapshots the current name or absence;
- rename does not change queued/printed/retried/reprinted jobs;
- preview and production renderer use the same optional field;
- renderer omits the line when absent and retains non-fiscal/no-VAT assertions.
