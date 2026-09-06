# Change Analysis

## Scope and Change Type

Change này giới hạn ở capability cấu hình ba liên kết công khai
Google/Facebook/Instagram của một établissement trong Reputation:

- Backoffice trở thành trusted writer mới tại seam Satisfaction hiện có;
- `packages/db-cloud` tiếp tục sở hữu cloud persistence thuộc Reputation;
- `apps/feedback-web` tiếp tục là public read-only consumer;
- Shared Authorization được tái sử dụng, không đổi permission map;
- Google Business Profile connector giữ nguyên là boundary độc lập.

Đây là thay đổi **behavioral**, **UI-affecting**, **data-affecting**,
**security-sensitive**, **public-boundary-sensitive** và **CROSS_MODULE**. Không
có production operation, schema, migration hoặc OAuth expansion trong scope.

## Sources Consulted

### Authority và current knowledge

- [Root agent instructions](../../../AGENTS.md)
- [Backoffice agent instructions](../../../apps/backoffice/AGENTS.md)
- [feedback-web agent instructions](../../../apps/feedback-web/AGENTS.md)
- [db-cloud agent instructions](../../../packages/db-cloud/AGENTS.md)
- [contracts agent instructions](../../../packages/contracts/AGENTS.md)
- [Current State](../../../docs/CURRENT_STATE.md)
- [Product Knowledge Home](../../../docs/PRODUCT_KNOWLEDGE.md)
- [Module Registry](../../../docs/MODULE_REGISTRY.md)
- [Authority Model](../../../docs/AUTHORITY_MODEL.md)
- [Reputation Product Knowledge](../../../docs/features/reputation/README.md)
- [Reputation status](../../../docs/features/reputation/STATUS.md)
- [ADR-004 — independent public feedback application](../../../docs/decisions/ADR-004-independent-public-feedback-application.md)
- [Authentication architecture](../../../docs/architecture/AUTHENTICATION.md)
- [Tenancy architecture](../../../docs/architecture/TENANCY.md)
- [Current UI rules](../../../docs/ui/UI_GENERAL_RULES.md)
- [Backoffice UI rules](../../../docs/ui/BACKOFFICE_UI_RULES.md)

### Implemented-state evidence

- [`reputation_settings` and `reputation_audit_events`](../../../packages/db-cloud/src/schema/reputation.ts)
- [Reputation repository](../../../packages/db-cloud/src/reputation-repository.ts)
- [Cloud seed](../../../packages/db-cloud/src/seed.ts)
- [Backoffice permission map](../../../apps/backoffice/src/server/auth/permissions.ts)
- [Backoffice trusted session composition](../../../apps/backoffice/src/server/auth/session.ts)
- [Satisfaction route](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx>)
- [Reputation inbox loader](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-loader.tsx>)
- [Reputation page component](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-page.tsx>)
- [Google integration route](<../../../apps/backoffice/src/app/(authenticated)/parametres/integrations>)
- [feedback-web tenant page](../../../apps/feedback-web/src/app/[tenantSlug]/page.tsx)
- [feedback-web form/success component](../../../apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx)
- [Concurrent public-boundary change](../../feedback-public-trusted-boundary-hardening/analysis.md)

## Authority and Product Decision

### Controlling authority

Current Product Knowledge establishes Reputation as the owner of direct
feedback, location-specific Reputation settings and its audit records.
ADR-004 establishes `apps/feedback-web` as an independent public application;
it does not transfer canonical setting ownership away from Reputation.

The repository-grounded direction supplied for this change proposes the
following bounded Product decisions for Gate 1 approval:

1. Reputation remains the semantic/data owner of all three values; UI placement
   does not move ownership to Establishment or Integrations.
2. The Backoffice writer is added to the existing
   `/visibilite-reputation/satisfaction` seam; no new route is introduced.
3. The settings section is OWNER-only by reusing existing
   `reputation.settings.manage` for both viewing and mutating this bounded
   configuration. `reputation.read` remains the broader base-page permission;
   MANAGER and STAFF receive no new setting access.
4. The bounded mutation supports read, add, replace and remove-to-`null`, with
   explicit Save. One or several changed providers commit atomically.
5. A normalized no-op succeeds without a persistence mutation and without a
   new audit event. A real mutation is followed by authoritative reload.
6. Stale/concurrent state never silently overwrites newer authoritative data.
   A stale materially different save returns a recoverable conflict; response-
   loss retry may recover the already-committed authoritative result without a
   duplicate mutation or audit. Exact CAS/replay mechanics belong to Design.
7. Server validation trims outer whitespace, converts blank to `null`, accepts
   HTTPS only, rejects malformed input, rejects every URL whose parsed
   `username` or `password` is non-empty, and caps each non-null value at 2048
   application characters. Host checks use exact hostname or dot-bound
   subdomain matching. Accepted Google destinations are purpose-bounded:
   `g.page` and `maps.app.goo.gl` allow normal path/query; `google.com` or
   `google.fr`, including eligible dot-bound subdomains, require a path
   beginning with `/maps/`; `search.google.com` is evaluated only by its
   dedicated rule and requires a path beginning with `/local/writereview`.
   `mail.google.com`, `accounts.google.com` and a Google property not serving
   the bounded Maps/review purpose are rejected regardless of an artificial
   path. Facebook accepts `facebook.com` plus dot-bound
   subdomains and `fb.me`; Instagram accepts `instagram.com` plus dot-bound
   subdomains. Generic shorteners, URL canonicalization that changes path/query
   semantics, redirect resolution and provider HTTP calls are excluded. No
   exact Google review-link shape beyond these bounded classes is required.
8. `google_review_url` is manual-only. Google OAuth/location selection neither
   derives nor writes it.
9. feedback-web shows a CTA only for a currently accepted provider URL and hides
   `null`, malformed or unsupported legacy values. External links use
   `target="_blank"` plus `rel="noopener noreferrer"`.
10. Each actual settings mutation creates one atomic Reputation audit record
    identifying actor, trusted organization/establishment, changed providers,
    previous/new public URLs and timestamp. No event is created for no-op; no
    token, credential, request dump, IP or user-agent is recorded.

These decisions are bounded enough to become behavioral Specs after explicit
Gate 1 approval. They do not authorize an implementation mechanism or release.

## Current Implemented State

### Schema and ownership

`packages/db-cloud/src/schema/reputation.ts` defines the three fields in
`reputation_settings`:

| Field                                       | PostgreSQL/Drizzle type | Nullable | Length constraint | Dedicated index | Current owner/scope                      |
| ------------------------------------------- | ----------------------- | -------- | ----------------- | --------------- | ---------------------------------------- |
| `google_review_url` / `googleReviewUrl`     | `text`                  | Yes      | None              | None            | Reputation; organization + establishment |
| `facebook_review_url` / `facebookReviewUrl` | `text`                  | Yes      | None              | None            | Reputation; organization + establishment |
| `instagram_url` / `instagramUrl`            | `text`                  | Yes      | None              | None            | Reputation; organization + establishment |

The table has `created_at`, ORM-managed `updated_at`, a composite unique index
on `(organization_id, establishment_id)` and no integer revision/version
column. The 2048-character application boundary fits the existing PostgreSQL
`text` capacity. No schema or migration is needed to store this slice.

The local disposable development database was inspected read-only on
2026-09-05. It contains `LUNA` and `LuNa Poitiers` reputation settings; all
three URLs are currently `NULL` for both établissements. The seed creates both
settings rows/slugs but does not populate the three URLs. Therefore no current
repository fixture requires an additional legacy provider domain.

### Reads and public rendering

`PublicFeedbackConfiguration` in
`packages/db-cloud/src/reputation-repository.ts` exposes all three values as
`string | null`. `findPublicFeedbackConfiguration` requires trusted
organization + establishment context and slug, then maps them to the public
configuration. The development-only slug lookup is separately gated and is not
a production authority.

`apps/feedback-web/src/app/[tenantSlug]/page.tsx` forwards the three values to
the success UI. The component filters falsey values, so configured non-empty
values render and `null` values are hidden. It currently renders anchors with
`target="_blank"` and `rel="noreferrer"`; it does not revalidate provider URL
shape before rendering and does not spell out `noopener`. The proposed safe
public projection is therefore a real behavior delta, especially for malformed
or unsupported legacy stored values.

### Backoffice seam and missing writer

The current route
`apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx`
loads the direct-feedback mode of the existing Reputation inbox. The page is
already titled « Satisfaction client » under « Visibilité & réputation » and
is the narrowest existing seam. It has no settings form, action, contract or
repository mutation for the three links. Repository search found no other
Backoffice writer for them.

No Reputation/Satisfaction-specific page pack currently exists under
`docs/ui/pages`. UI discovery and a stable page-pack update will therefore be
required before UI implementation, without changing the approved route.

### Authorization

Current `ReputationPermission` contains:

- `reputation.read`: OWNER, MANAGER, STAFF;
- `reputation.settings.manage`: OWNER only;
- `reputation.connector.manage`: OWNER only.

`reputation.settings.manage` is already semantically specific to Reputation
settings and matches the proposed OWNER-only read/manage section. It avoids
review-response, connector, marketing and Establishment permissions. The
current server helper rejects non-user actors and roles outside the grant map;
trusted tenant composition resolves session, active membership, organization
and active establishment on the server.

**Authorization prerequisite: NOT REQUIRED**, provided Gate 1 approves reuse
of `reputation.settings.manage` for both visibility and mutation of this
settings section. No permission constant or grant map change is needed.

### Google connector relationship

`/parametres/integrations` and current repository operations own Google
Business Profile authorization, encrypted tokens, account/location selection
and connector audit. Repository search found no connector path that writes
`google_review_url`. Selected GBP location evidence does not currently expose a
repository-authoritative customer review URL. Manual-only is therefore the
only evidence-backed first-slice boundary.

### Audit capability

`reputation_audit_events` already supports `SETTINGS` as an entity type, an
action string, actor user, JSON metadata and timestamp. Existing repository
mutations write audit evidence inside the same transaction as connector,
feedback, reply and note changes and place `establishmentId` in metadata.

This is a suitable existing Reputation-owned audit mechanism. A new audit
table or cross-cutting prerequisite is not required. Exact action name, typed
metadata validation and transaction composition remain Design concerns.

### Concurrency, no-op and retry support

There is no existing writer, command receipt or version/revision contract for
these three settings. `updated_at` exists but is not currently an approved
browser concurrency contract. Consequently the desired stale-edit and retry
behavior is not already implemented.

Repository shape permits a no-schema fail-closed approach to be evaluated in
Design: a scoped conditional mutation can compare authoritative current state
and expected state, while exact proposed normalized values distinguish a
replay of an already-committed outcome from a materially different stale
mutation. Whether `updated_at`, the prior three-value snapshot, or a bounded
combination is the precise predicate must be decided and proven in Design.
Analysis does not authorize silent last-write-wins, a new migration, or a new
receipt table.

## Affected Boundaries

| Boundary               | Assessment                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Semantic/data owner    | Reputation remains canonical owner.                                                                                         |
| Backoffice runtime     | New trusted settings read/write UI and server action in existing Satisfaction route.                                        |
| Public runtime         | feedback-web remains read-only consumer; safe projection changes are minimal.                                               |
| Persistence            | Existing `@yuta/db-cloud` table and audit table are sufficient; no schema change established.                               |
| Tenancy                | Every private operation remains scoped by trusted organization + active establishment; public read remains server-resolved. |
| Authorization          | Existing `reputation.settings.manage` is reused; no grant expansion.                                                        |
| Google provider        | Existing OAuth/location connector is unaffected and cannot become implicit URL authority.                                   |
| POS/Site Agent/Display | Not affected; no cross-runtime synchronization.                                                                             |
| Production/environment | Not affected; repository behavior is not release/readiness evidence.                                                        |

### Mandatory CROSS-MODULE IMPACT CHECK

| #   | Criterion                                   | Result                                                                                                                       |
| --- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | Reads/writes another owner’s data           | YES — Backoffice writes Reputation-owned settings and feedback-web consumes them.                                            |
| 2   | Canonical owner changes or is ambiguous     | NO — owner remains Reputation.                                                                                               |
| 3   | Another module consumes/reacts/updates      | YES — feedback-web CTA behavior reacts to settings.                                                                          |
| 4   | Shared permission/security/tenancy/identity | YES — existing shared trusted context and Reputation permission are required, without contract change.                       |
| 5   | Multiple runtime families                   | NO — both applications are Cloud-family; POS/Site Agent/Display are untouched.                                               |
| 6   | Legal/privacy/provider/external integration | YES — public external destinations and provider-host validation are security-sensitive, while provider APIs remain excluded. |
| 7   | Accepted architecture/runtime/data boundary | YES — current Reputation ownership, cloud DB, ADR-004 and tenant rules govern the slice.                                     |
| 8   | Coordinated Product Decision                | YES — writer, owner, public consumer, validation, audit and connector non-relationship must stay coherent.                   |
| 9   | Coordinated rollout/contract across modules | YES — contracts/repository, Backoffice and feedback-web behavior must agree.                                                 |
| 10  | Coordinated multi-page UI/QA                | YES — authenticated settings and public success CTA states require coordinated QA.                                           |

Classification remains **CROSS_MODULE**. It cannot be downgraded to
`PAGE_LOCAL` merely because configuration appears in one Backoffice section.

## Lifecycle Baseline

Current Module Registry/current-state evidence remains unchanged:

| Area                  | Product Decision | Implementation                                                 | Environment | Production Readiness | External dependency                                   |
| --------------------- | ---------------- | -------------------------------------------------------------- | ----------- | -------------------- | ----------------------------------------------------- |
| Backoffice Reputation | APPROVED         | IMPLEMENTED for current inbox/mutations; this writer is absent | UNVERIFIED  | BLOCKED              | Reputation/global gates remain open                   |
| Public Feedback       | APPROVED         | IMPLEMENTED for direct collection/current conditional CTAs     | UNVERIFIED  | BLOCKED              | Production hostname/privacy/release gates remain open |

This OpenSpec planning work does not promote any lifecycle value. Google,
Facebook and Instagram API readiness is not required because the slice stores
manual public URLs and performs no provider request.

## Requirement Readiness

`READY_FOR_SPECS`

Repository evidence supports one new capability,
`reputation/review-social-links-configuration`, without changing canonical
ownership, tenancy, grant mapping or schema. The Product decisions listed above
are precise and testable once the current Gate 1 packet is explicitly approved.

Specs must cover at minimum:

- trusted read and OWNER-only explicit mutation;
- add/replace/remove, multi-provider atomicity, normalized no-op and reload;
- stale conflict, already-committed response-loss recovery and retry safety;
- exact URL normalization/provider boundaries and legacy fail-closed behavior;
- public CTA visibility and safe external-link attributes;
- actual-change-only audit and sensitive-field exclusions;
- Google connector independence and all explicit non-goals.

The URL scenarios must explicitly include:

- accept `g.page` and `maps.app.goo.gl` HTTPS destinations;
- accept `/maps/` destinations on `google.com` and `google.fr`;
- accept `/local/writereview` on `search.google.com`;
- reject a non-Maps property on `google.com`, including `mail.google.com` and
  `accounts.google.com`;
- reject a URL with parsed username or password and ensure rejected credentials
  are neither persisted nor audited;
- reject HTTP, malformed provider-host lookalikes and generic URL shorteners.

This is behavior-changing and cannot use `skip_specs: true`.

## UI / UX Applicability

UI/UX is affected in two surfaces:

1. Backoffice `/visibilite-reputation/satisfaction`: a new OWNER-only settings
   section within the existing route/seam;
2. feedback-web success state: current CTAs are preserved but unsafe legacy
   destinations must fail closed and `rel` becomes explicit.

Current YUTA/Backoffice UI rules and `@yuta/ui` primitives govern later work.
Because no stable Satisfaction page pack exists, later UI discovery must first
capture the current route, settings states, validation/conflict/retry behavior,
public configured/null/legacy-invalid states and required responsive Browser
QA. No UI design or implementation is authorized by this analysis.

## Conflicts and Unknowns

### Conflicts

- **No scope conflict** with active change
  `feedback-public-trusted-boundary-hardening`: its Proposal/Analysis/Design
  explicitly exclude Backoffice settings, external review URL policy and
  Google/Facebook/Instagram connector work. Both changes must preserve each
  other's public hostname/tenant boundary if implemented concurrently.
- **Documentation/implementation gap:** Product Knowledge describes external
  review links and location settings, while no trusted Backoffice writer or
  stored-URL validation exists. This is the intended delta, not evidence that
  the new behavior is already approved or deployed.

### NEEDS REVIEW at Gate 1

1. Approve Reputation as owner and Satisfaction as the existing UI seam.
2. Approve using `reputation.settings.manage` for OWNER-only settings read and
   mutation, with no new MANAGER/STAFF grant and no authorization prerequisite.
3. Approve the exact normalization/HTTPS/2048/provider-purpose rules, including
   Google Maps/review path classes, empty URL username/password and no
   redirect/network validation.
4. Approve Google manual-only and continued separation from GBP OAuth/location.
5. Approve actual-change-only audit content, including previous/new public URLs.
6. Approve fail-closed handling of malformed/unsupported legacy stored URLs in
   feedback-web.
7. Approve no silent last-write-wins and the bounded observable conflict/retry
   semantics; exact no-schema CAS mechanism remains for Sensitive Design.
8. Approve no schema/migration for this change unless later Design evidence
   triggers a stop and renewed review.

### Design-only unknowns after Gate 2

- Exact conditional-update predicate and replay discrimination under database
  timestamp precision/ABA cases.
- Exact typed audit action/metadata representation and atomic transaction
  composition.
- Exact transport schema placement and UI composition within the current route.

These choices must fail closed and may not change the approved behavior. If
Design proves a schema/migration, new permission, connector derivation or new
route is required, the workflow must stop and return to the relevant gate.

## Analysis Conclusion

Bounded scope is confirmed as **CROSS_MODULE** and
`READY_FOR_SPECS` after explicit human Gate 1 approval of the current packet.
No authorization prerequisite, audit prerequisite, schema or migration is
supported by current repository evidence.

The change must use a Sensitive Design Gate after Gate 2 because it crosses a
durable public/private data boundary, authorization, audit integrity,
concurrency and external-link security. This conclusion does not authorize
Specs, Design, Tasks, Apply, sync, archive or production work.
