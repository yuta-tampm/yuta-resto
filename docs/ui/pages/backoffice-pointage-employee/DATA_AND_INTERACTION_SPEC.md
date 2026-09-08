# Pointage employee — Data and Interaction Spec

Status: DRAFT — AWAITING_HUMAN_REVIEW

Visibility: Engineering

## Sources and ownership

Canonical attendance: proposed immutable Pointage raw events only.
Session/current state: deterministic server derivation, never canonical tables.
Personnel owns dossier/lifecycle and minimal scoped display-name projection.
Authorization owns credential/current continuation validation and exact grants.
Tenancy is server-resolved from the establishment locator, never browser IDs.

All new handlers, contracts, raw/receipt/continuation tables and page consumers
are Design proposals, not current implementation. Existing foundation
credentials/rate/audit do not prove usable clocking exists.

## Exact transport boundary

See Sensitive Design D8 for authoritative proposed strict DTOs/statuses.
Prefix: /api/pointage/[establishmentSlug].

- context GET: neutral availability only; no tenant IDs or employee list.
- identify POST: exact eight-digit credential; separately authorize identify
  and state.read, including current scoped Personnel checks for each, before
  deriving initial state and committing continuation issuance. Neither token nor
  protected state is returned on partial authorization/derivation failure.
  Only the combined committed result is successful; no plaintext persistence.
- state POST: memory-only continuation, own minimal state after current checks.
- clock-in / clock-out POST: stable UUIDv4 requestId and opaque observedStateGuard.
- recover POST: same requestId, kind, guard; original joined committed receipt
  or UNCONFIRMED, with current operation.create authority.
- end POST: terminate own continuation only; no credential revocation operation.

Personal endpoints require exact configured Origin, strict JSON and dedicated
Authorization header. No generic cookie auth, trust of forwarded address
headers, browser tenant authority or URL secrets. Missing/untrusted trusted
client-address provider fails closed before credential processing.

## State flow and ownership

CREDENTIAL_ENTRY -> IDENTIFY_PENDING -> ACTIVE_STATE -> MUTATION_PENDING ->
RECEIPT -> ENDING -> NEUTRAL. ACTIVE_STATE is NOT_CLOCKED_IN or CLOCKED_IN.

The browser holds only live interaction state in memory. It never serializes a
trusted PointageEmployeeContext. Continuation is opaque, self-only, bound on the
server to scope/dossier/current credential version. Server expiry and Personnel
eligibility govern identify, state and mutation/replay.
Continuation scope/dossier/digest/credential-version/issue/absolute-expiry
bindings are immutable after INSERT. Only monotonic bounded idle extension and
one-way server-timestamp own-end are writable, under D6 database triggers and
column-restricted writer privileges. No rebind, ended revival or generic update.

Every user mutation freezes requestId + kind + stateGuard before first dispatch.
Double submit uses the same tuple. A timeout retains that tuple only while the
interaction is live. UNCONFIRMED may still be in flight: recover or resend the
exact tuple, never generate a fresh identity automatically.
A stale-state conflict requires refreshed state and explicit new action.
Same identity/different intent conflicts. No optimistic attendance evidence.

A raw event and technical receipt commit atomically. Receipt fields are joined
from that raw event, not duplicated attendance authority. Successful replays
still recheck current scope, credential version and lifecycle. After credential
reset, old continuation is denied; fresh identification can authorize recovery
only with an exact known tuple. There is no receipt search/history API.

## End, expiry and adverse navigation

On end/hidden/pagehide/navigation/expiry: immediately cover and remove personal
DOM, increment generation and clear all personal memory including pending tuple.
Abort callbacks; ignore every late response from the old generation. Best-effort
end sends the live token only for that request, without retaining it afterward.

Local clearing is immediate. Server-confirmed end occurs only when ended_at
commits or server expiry applies. If the network is unavailable, do not claim
instant remote revocation; remaining authority expires by the 60-second idle /
120-second absolute server deadlines. Requests linearized before server end may
already commit. End acknowledgement follows the shared dossier lock; afterward
the old continuation cannot authorize operations. No attendance auto-close.

Refresh/back/forward/pageshow/tab duplication/restart starts neutral with no
previous token or identity. pagehide must clear before a bfcache snapshot and
pageshow must reset before personal render. Cache-Control alone is insufficient.
No localStorage/sessionStorage/IndexedDB/history.state/service-worker employee
state; no BroadcastChannel/postMessage token sharing.

Receipt auto-end after 10 seconds; absolute or idle expiry may end sooner.
New employee use always requires identification. Losing a pending tuple at end
does not create a new command or imply the previous command failed.

## Failure and privacy boundaries

Invalid credential, continuation, eligibility or employee authority share a
generic access failure; no lifecycle classification. Candidate/client throttling
does not identify the key or a matching employee. Authorized conflicts may be
distinct; unavailable/corrupt-chain errors never expose raw rows.
Network ambiguity is a local unknown result, not invented success.

HTML/RSC is neutral. Page/data no-store, no personal SSR props, no analytics,
URL secrets, auth/body logging or personal diagnostic payloads. Late responses
cannot repopulate the screen after clearing. No real credentials in screenshots.

## Data / environment policy

Implementation, integration and real-route Browser QA use synthetic/disposable
attendance only. The explicit loopback disposable-database test factory in D1
injects a deterministic server-owned trusted-address provider; never a browser
provider selector. Production composition remains unavailable and has no
provider default. No synthetic employee field/classifier.
D1 requires the exact full-name rule
`^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$`, loopback URL host, and
`SELECT current_database()` exactly matching the parsed expected name and the
same rule. General development/staging/production/non-loopback databases are
rejected. Browser QA cannot override or weaken this guard.

Real attendance is NOT_AUTHORIZED in development/staging/production. Retention,
deletion/anonymization, legal hold, backup-retention, employee notice, detailed
audit visibility and production client provenance remain unresolved. Technical
auth deadlines do not define deletion or legal retention.

## Future evidence

Use actual Next route plus disposable PostgreSQL, not fabricated screenshots
or mocked attendance success. Exercise two tabs and concurrent requests, reset,
expiry, departure midnight, unavailable server, hidden/bfcache/refresh/restart,
late callbacks and sequential shared-device users. Capture synthetic-only
screenshots and command traces with secret-free hashes/manifests after Apply;
none is claimed complete now.
