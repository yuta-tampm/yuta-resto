# Gate 1 Review — reputation-review-social-links-configuration

Change: `reputation-review-social-links-configuration`

Gate: `GATE 1`

Review status: `APPROVED`

Created: `2026-09-05T17:44:05.0927073+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `YES — Sensitive Design Gate REQUIRED after Gate 2`

Classification: `CROSS_MODULE`

Authorization prerequisite: `NOT_REQUIRED`

Schema/migration: `NOT_REQUIRED`

Provenance HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-05T17:48:32.7054766+02:00`

## Review history

The prior Gate 1 packet with SHA-256
`3c72b2d0148c7ead86c9f6962dbfc54ae30ef61e56da0cd98d8679449f31aa68`
received `CHANGES_REQUESTED — TARGETED URL VALIDATION CORRECTION ONLY`.
This regenerated packet supersedes it for N1 and N2 only. All other bounded
analysis and proposed Product decisions remain unchanged.

## Targeted correction table

| Item                                     | Requested correction                                                                                  | Regenerated result                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N1 — Google review/Maps purpose boundary | Replace broad `google.com`-and-all-subdomains acceptance with bounded Google review/Maps classes.     | `g.page` and `maps.app.goo.gl` are accepted over HTTPS with normal path/query; eligible `google.com` and `google.fr` exact/dot-subdomains require path prefix `/maps/`; `search.google.com` is evaluated only by its dedicated `/local/writereview` rule. `mail.google.com`, `accounts.google.com`, other non-Maps Google properties, generic shorteners, redirects and provider HTTP validation remain rejected/excluded. |
| N2 — embedded URL credentials prohibited | Reject any provider URL containing username or password and never persist/audit rejected credentials. | All accepted provider URLs require parsed `username` and `password` to be empty. The later Spec scenario inventory explicitly covers credential rejection and no persistence/audit.                                                                                                                                                                                                                                        |

## Preserved accepted Gate 1 boundaries

Unchanged: Reputation ownership; existing Satisfaction route/seam; no new
route; OWNER-only `reputation.settings.manage`; broader `reputation.read`;
no MANAGER/STAFF settings access; add/replace/remove-to-null; one atomic
explicit Save; no-op without write/audit; authoritative reload; stale conflict;
response-loss recovery; manual-only Google URL; GBP connector independence;
actual-change-only SETTINGS audit; feedback-web fail-closed projection;
`target="_blank"` plus `rel="noopener noreferrer"`; existing schema/audit
reuse; required Sensitive Design Gate; and every explicit exclusion.

## Repository findings retained

- Three nullable PostgreSQL `text` columns already exist in
  `reputation_settings`, scoped by organization + establishment.
- Backoffice has no writer; `/visibilite-reputation/satisfaction` is the
  existing applicable seam.
- `reputation.settings.manage` already grants OWNER only, so no authorization
  prerequisite or grant-map change is required.
- `reputation_audit_events` already supports SETTINGS evidence.
- Google connector selection does not write or derive `google_review_url`.
- feedback-web already consumes the values but does not enforce the corrected
  provider-purpose/legacy fail-closed boundary.
- Current local LUNA rows have all three URLs `NULL`; no current stored/fixture
  evidence requires an additional Google destination.
- Active `feedback-public-trusted-boundary-hardening` explicitly excludes this
  settings/URL scope.

## Product and authority decisions requiring re-approval

Re-approve the complete bounded decision set with N1 and N2 corrected:

1. Reputation remains owner; use the existing
   `/visibilite-reputation/satisfaction` seam and no new route.
2. Use `reputation.settings.manage` for OWNER-only settings view/mutation;
   retain `reputation.read` as base-page access and add no MANAGER/STAFF grant.
3. Support read/add/replace/remove-to-null with one explicit atomic Save;
   normalized no-op means no write and no audit; successful mutation reloads
   authoritative state.
4. Never silently overwrite stale state; return recoverable conflict for a
   materially different stale save and recover an equivalent already-committed
   result after response loss without duplicate write/audit.
5. Keep trim, blank-to-null, HTTPS-only, malformed rejection, maximum 2048
   application characters and exact/dot-bound hostname matching.
6. Apply corrected Google purpose classes:
   - HTTPS `g.page`, normal path/query;
   - HTTPS `maps.app.goo.gl`, normal path/query;
   - HTTPS `google.com` and `google.fr`, including eligible dot-bound
     subdomains, only when path starts `/maps/`;
   - HTTPS `search.google.com`, evaluated only by its dedicated rule, when
     path starts `/local/writereview`;
   - explicitly reject `mail.google.com`, `accounts.google.com` and other
     Google properties outside the bounded Maps/review purpose;
   - no generic shortener, redirect following, provider HTTP request or exact
     path shape beyond these classes.
7. Require empty parsed URL `username` and `password` for every provider;
   reject credentials before persistence/audit and do not canonicalize
   path/query semantics.
8. Preserve Facebook `facebook.com` plus dot-bound subdomains and `fb.me`;
   preserve Instagram `instagram.com` plus dot-bound subdomains.
9. Keep Google URL manual-only and independent from GBP OAuth/location.
10. Keep actual-change-only atomic SETTINGS audit with bounded non-secret
    fields; no no-op audit or token/credential/request/IP/user-agent logging.
11. On feedback-web, valid configured URL shows CTA; null/unsafe legacy value is
    hidden; external anchors use the approved safe attributes.
12. Reuse existing columns/audit table; no schema/migration unless later Design
    evidence triggers a stop and renewed review.

## Required later Spec scenarios

After approval, Specs must explicitly cover acceptance of `g.page`,
`maps.app.goo.gl`, `google.com/maps`, `google.fr/maps`, and
`search.google.com/local/writereview`; rejection of a non-Maps
`google.com` property, `mail.google.com`, `accounts.google.com`, embedded
username/password, HTTP, hostname lookalikes and generic shorteners.

No Spec is created by this targeted correction.

## Exact Proposal content

Source:
`openspec/changes/reputation-review-social-links-configuration/proposal.md`

SHA-256:
`12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61`

```markdown
## Why

YUTA đã lưu và công khai có điều kiện ba liên kết Google, Facebook và Instagram
theo từng établissement, nhưng Backoffice chưa có luồng đáng tin cậy để OWNER
xem và quản lý các giá trị này. Change này khép kín khoảng trống đó trong
Reputation mà không mở rộng OAuth hoặc biến Integrations thành chủ sở hữu dữ
liệu.

## What Changes

- Bổ sung cấu hình Backoffice trong seam hiện có « Visibilité & réputation / Satisfaction client » để OWNER xem, thêm, thay thế hoặc xóa ba liên kết công khai bằng explicit Save.
- Chuẩn hóa ba giá trị nullable ở server: trim khoảng trắng ngoài, blank thành `null`, chỉ nhận HTTPS, giới hạn 2048 ký tự, cấm username/password nhúng trong URL và kiểm tra destination đúng provider/purpose mà không gọi mạng hoặc theo redirect. Google chỉ nhận `g.page`, `maps.app.goo.gl`, đường dẫn `/maps/` trên `google.com`/`google.fr` cùng dot-bound subdomains đủ điều kiện, hoặc đường dẫn `/local/writereview` trên `search.google.com`; `mail.google.com`, `accounts.google.com` và Google property không phục vụ Maps/review bị loại trừ. Facebook và Instagram giữ provider-host boundary riêng.
- Giữ `google_review_url` là nhập thủ công trong slice đầu tiên; không suy ra URL từ Google Business Profile OAuth hoặc location selection.
- Lưu một hoặc nhiều thay đổi trong một mutation nguyên tử, không tạo audit cho no-op, phát hiện stale/concurrent edit thay vì silent last-write-wins, và cho phép reload/retry sau lỗi.
- Ghi audit Reputation cho mutation thực sự, chỉ chứa actor, organization/establishment, provider đã đổi, giá trị trước/sau và timestamp; không ghi token, credential hoặc request dump.
- Giữ feedback-web là consumer công khai hiện hữu: URL hợp lệ đã cấu hình thì CTA hiển thị, `null` hoặc stored value không an toàn thì CTA ẩn; liên kết mở tab mới với quan hệ an toàn.
- Dùng authority hiện có `reputation.settings.manage` cho slice OWNER-only; không cấp quyền mới cho MANAGER hoặc STAFF.

## Capabilities

### New Capabilities

- `reputation/review-social-links-configuration`: Hành vi xem và quản lý ba liên kết review/social thuộc Reputation theo trusted organization + establishment scope, cùng public projection an toàn sang feedback-web.

### Modified Capabilities

Không có.

## Impact

- **Owner dữ liệu/nghiệp vụ:** Reputation; bản ghi `reputation_settings` tiếp tục thuộc organization + establishment.
- **Writer mới:** Backoffice tại route hiện có `/visibilite-reputation/satisfaction`, sử dụng server-side trusted tenant context và `reputation.settings.manage`.
- **Consumer hiện có:** `apps/feedback-web`, chỉ đọc public configuration đã được server resolve theo trusted hostname/tenant mapping.
- **Shared boundaries:** `@yuta/contracts` nếu cần transport schema, `@yuta/db-cloud` cho repository mutation/audit, và Shared Authorization chỉ được tái sử dụng chứ không đổi grant map.
- **Google integration:** OAuth/location selection ở `/parametres/integrations` giữ nguyên và không ghi `google_review_url`.
- **Không có schema/migration theo evidence hiện tại:** ba nullable PostgreSQL `text` columns, composite location uniqueness, timestamps và `reputation_audit_events` với entity `SETTINGS` đã tồn tại.
- **Không thuộc scope:** OAuth expansion, social publishing/import, AI, analytics, QR, generic social-link engine, unrelated refactor, production enablement, migration, data mutation hoặc deployment.
```

## Exact Analysis content

Source:
`openspec/changes/reputation-review-social-links-configuration/analysis.md`

SHA-256:
`02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d`

```markdown
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
```

## Conflicts and remaining unknowns

- `CONFLICT`: none.
- `NEEDS REVIEW`: explicit human re-approval of the corrected complete
  bounded decision set above.
- Exact no-schema CAS/replay predicate, typed audit representation and
  route-local component/transport composition remain Design-only questions.
- If later evidence requires an additional Google destination, new permission,
  schema/migration, route, connector derivation or changed owner/runtime/public
  tenancy boundary, stop and return to review.

## Analysis conclusion and recommendation

`READY_FOR_SPECS`

Recommendation: approve this regenerated Gate 1 packet and permit creation of
the single delta Spec `reputation/review-social-links-configuration`. Approval
does not authorize Design, Tasks, schema, migration, implementation, sync,
archive or production work.

## Integrity summary

| Artifact                                                                    | SHA-256                                                            |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/reputation-review-social-links-configuration/proposal.md` | `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61` |
| `openspec/changes/reputation-review-social-links-configuration/analysis.md` | `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d` |

Hash method: PowerShell `Get-FileHash -Algorithm SHA256` over exact file bytes,
recorded as lowercase hexadecimal.

## Scope confirmation

- Specs created: `NO`
- Design created: `NO`
- Tasks created: `NO`
- Implementation/contracts/UI/authorization modified: `NO`
- Schema/migration created or modified: `NO`
- Production operation: `NO`

## Required human decision

If accepted, an unambiguous approval is:

> Gate 1 is APPROVED for
> `reputation-review-social-links-configuration`.
>
> Approve the regenerated Product decisions including N1 and N2, and permit
> Specs only. Do not create Design, Tasks, schema, migration or implementation
> yet.
