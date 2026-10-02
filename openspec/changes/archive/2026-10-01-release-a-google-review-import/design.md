## Context

See [Proposal](proposal.md), [Analysis](analysis.md) and the freshly approved [retrieval](specs/reputation/google-review-retrieval/spec.md) / [exposure](specs/backoffice/release-a-customer-exposure/spec.md) deltas. Revised Gates 1 and 2 have fresh delegated independent approval. The actual Human chose freeform user input with separate provider cache and instructed implementation. CODEX_ONLY and COMMIT_AFTER_TASK YES remain local main after requested completion. Historical Human/delegated approvals and the original GI-07 BLOCKED verdict remain preserved in existing packets.

DESIGN_APPLICABILITY: APPLICABLE

SENSITIVE_DESIGN_GATE: REQUIRED

DESIGN_READINESS: AWAITING_REVISED_SENSITIVE_GATE

Backoffice owns server provider access and cloud UI; db-cloud owns scoped persistence; contracts owns serializable transport. Current feedback parents mix Google fields and local state; parent deletion cascades to notes/replies. Notes and drafts are single arbitrary 1–4,000-character strings with no authored/quotation provenance. Provider access, allowed cache/use quantity and backup/restoration are not verified for real data. Source implementation follows this pending sensitive gate; no real-provider use or live operation is authorized.

Canonical sources: [root](../../../AGENTS.md), [Backoffice](../../../apps/backoffice/AGENTS.md), [db-cloud](../../../packages/db-cloud/AGENTS.md), [contracts](../../../packages/contracts/AGENTS.md), [database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), [tenancy](../../../docs/architecture/TENANCY.md), [authentication](../../../docs/architecture/AUTHENTICATION.md), [deployment](../../../docs/operations/DEPLOYMENT.md), [Reputation](../../../docs/features/reputation/README.md), [Today](../../../docs/features/today/README.md), [provider policy](https://developers.google.com/my-business/content/policies). Current code seams are the scoped Reputation repository/schema, Google client/token accessor, auth grants and route-owned review components.

## Goals / Non-Goals

**Goals:** preserve the work parent and existing local operation grants; isolate new provider content/references behind a temporary lifecycle; fence retrieval by trusted authorization and current binding; provide immediate usable views and truthful persisted outcomes; make new data distinguishable from legacy rows; define focused migration/test/QA seams.

**Non-Goals:** no new app/package/data runtime, broad repository refactor, legacy adoption/purge, actual Google enablement, production scheduler/backup mutation, publication, AI or scheduled provider retrieval. No automatic proof of authorship from arbitrary text. No task-level commit before requested completion.

## Decisions

### D1 — Stable local work with separate temporary provider cache

Keep `feedback_items` as the independent local-work identity/status/assignment parent. Add an importer-ownership marker that defaults to legacy/unmanaged, valid only for GOOGLE. For new importer-owned work, do not copy provider identifiers, author/rating/comment, original provider timestamps, URLs, remote replies or provider metadata into permanent parent fields; they remain null. Its local received/created time describes YUTA work creation, not provider authorship.

Add a scoped Google cache relation owned by db-cloud, attached to the work parent, carrying only minimized validated provider content, review resource identity, current connector/binding generation, fetchedAt and expiry. Provider identity/fingerprints/cursors receive the same temporary classification unless separate actual authority permits otherwise. Stable mapping lasts only while its cache/reference is eligible. Use one Google cache relation and one per-connector retrieval-state relation for attempt/lease, success and short continuation; no append-only receipt framework.

Queries distinguish managed work from legacy rows. Read provider fields only through an eligible cache join; expired/binding-obsolete data is not selected, searched, sorted or serialized. Local-work filters/counts/notes/drafts remain scoped and independent. Legacy DIRECT and unknown-provenance Google queries retain their existing behavior, not automatic migration into the cache.

Alternative rejected: delete the feedback parent at expiry. It cascades user work and violates the approved retention outcome. Alternative rejected: keep API identifiers/content in permanent parent fields or hashes; this bypasses the temporary classification rather than resolving it.

### D2 — Operation-specific grants and scoped resource fencing

Add an explicit server-owned Google-retrieval operation grant for OWNER/MANAGER under existing Reputation entitlement/read/context prerequisites; do not reuse connector-manage for MANAGER or infer retrieval from STAFF read. OWNER remains the connector/binding owner. All route actions derive scope and actor from the validated server session; record/reference lookups use organization + establishment and assigned scope as applicable.

A connector binding generation changes on account/location rebind and invalidating credential/connection changes. A retrieval captures the authorized binding/generation and validated server-session identity before provider access. Credential lookup/refresh uses that captured connector/generation, and token writes are fenced against a rebind. Commit checks active membership/role, entitlement, organization/establishment, user/auth-version and unrevoked/unexpired captured session plus binding generation. The browser never supplies session authority. No token is returned to browser contracts or logs.

Use a short persisted scoped attempt/lease to consolidate concurrent stale visits/refreshes. Network calls happen outside DB transactions. Commit validated content and the corresponding success receipt atomically after binding/actor fencing; failure records do not overwrite prior successful freshness. Lease expiry/retry is bounded and content-free. Do not hold DB locks across provider latency.

Alternative rejected: browser-supplied account/location/role and token calls during the first render. Both weaken authority/work continuity. Alternative rejected: treating a read grant as authority to retrieve the entire establishment.

### D3 — Validated provider pages and temporary deduplication

Extend the current server-only Google adapter with reviews.list and reviews.get, Zod validation and no framework/shared response cache. Request pageSize 50 and updateTime-desc order. Validate every review name/identity belongs to the server-authorized account/location; reject mismatching/malformed/duplicate inconsistent payloads as failure rather than partial success.

Cache identity uniqueness is scoped to organization/current provider location/review identity. Before creating work, reject conflicts with another establishment or a legacy identity; never reassign/adopt a row. New work gets local NEW and no assignee. A permitted existing identity updates its provider copy only. Previous content for change detection is eligible temporary content; do not retain a permanent provider-derived fingerprint after its deadline.

Pagination uses server-held short-lived continuation linked to organization/establishment/connector generation and the current retrieval sequence. Browser transports an opaque handle, not provider resource authority. On new recent refresh or rebind, obsolete continuations become invalid and the user can retry current coverage. Only explicit Voir plus retrieves another page.

If all permitted mapping has been removed, exact historical linkage is unavailable. Do not guess association from names/text. A new encounter cannot claim to be deduplicated against unlinked historical work; preserve old work and truthful coverage. No long-lived reviewId exception is assumed.

Alternative rejected: deduplicate by reviewer name/comment, copy every page automatically or accumulate complete history indefinitely.

### D4 — Independent temporary content/reference deadlines and content-only cleanup

Use 29 days for provider-content usability/physical content cleanup, leaving a buffer below the 30-calendar-day maximum. A separately timed trusted reference may remain at most 30 days from its own actual retrieval, creating a bounded individual-recovery window after content removal. No identifier is exempt or retained indefinitely. Store content expiresAt and referenceExpiresAt separately. A successful actual fetch renews only fetched copies; user edits, failed calls, omitted pages and restoration do not extend either deadline.

Deny expired content in all shared projections, searches, filters, sorts and serialization, including internal mode. Content cleanup clears every provider content field (including remote reply/provider timestamps/comparison material), preserving only a still-eligible temporary reference; reference expiry removes the mapping. Obsolete bindings make content and references immediately unusable and eligible for cleanup. Continuations/provider counts follow their own short deadline and are cleared independently of durable own operational attempt outcomes. Preserve feedback parent, status, assignment, replies, notes and history. No provider call or remote deletion occurs during purge.

Add a bounded POST-only maintenance route at `apps/backoffice/src/app/api/internal/reputation/google-cache-maintenance/route.ts`. Authenticate a dedicated `REPUTATION_CACHE_MAINTENANCE_SECRET` bearer credential safely before any DB access. Missing/invalid secrets fail closed. The exact machine path may pass the existing exposure availability layer while keeping proxy security intact; it does not grant browser/tenant access. After machine authentication, enumerate due importer-owned scope pairs and purge bounded explicit organization/establishment batches. Emit only minimized own counts, no provider IDs/text or secrets. This route is independent of retrieval admission so cleanup can continue when new fetches are disabled.

No production credential/scheduler/backup operation is configured by source delivery. Unattended execution, permitted-use and backup/restoration evidence remain mandatory before real data.

### D5 — Persisted outcomes and minimized read contracts

Persist scoped attempt kind (recent/history/detail), binding generation, own attempt state/time and sanitized error category. Content-derived returned counts, provider totals/cursors and comparison material remain temporary under their reviewed classification; durable operational receipts must not retain raw content, resource names or secret-bearing provider errors.

Contracts add explicit provider-content availability and local-work availability, current-page coverage and truthful last successful batch retrieval time. Null Google fields and an availability state are serializable rather than fake empty strings/ratings. Today reads only the minimized local-work projection and never triggers retrieval. Legacy state is explicit unknown provenance.

Remote reply fields stay in the temporary provider view, never in `feedback_replies` as local PUBLISHED. Preserve unknown provider moderation states without inventing publication success. Do not import photos/contacts/AI/analytics fields beyond the approved minimized read purpose.

Alternative rejected: setting lastSyncedAt or receipt success from OAuth, seed rows, redirect, local update or an empty older page.

### D6 — Visit retrieval and writing continuity

Keep route data loaders as Server Components without external review retrieval during server render/prefetch. A route-owned client controller requests eligible retrieval after a real mounted Avis visit, using server-side stale checks; proposed short stale threshold is 15 minutes. Actor guards apply regardless of controller visibility. Manual Actualiser and requested Voir plus/detail retry use the same server operation boundary.

Merge retrieval outcome notices into the view without replacing active input or jumping selection. Announce additions through an accessible live region. Defer list replacement/reordering until the user explicitly inspects it; key the active local work by stable internal UUID. Preserve draft/note state and existing local Save result/busy behavior.

STAFF does not mount a retrieval trigger or receive provider-retry actions. Missing Google content keeps assigned local work with OWNER/MANAGER handoff. OWNER first confirmed continuation may navigate to Avis and initiate the distinct retrieval; already-bound paths remain available. Integrations remains OWNER-only.

Alternative rejected: retrieval during Today render, every filter change, router prefetch or a periodic background timer when no user visits. No additional UI framework or shell redesign.

### D7 — Missing-reference fallback and binding changes

Content for a binding no longer authorized is unavailable. Binding changes invalidate temporary mappings/continuations through the reviewed scoped lifecycle while retaining independent local work. A permitted single-review reference can be used by OWNER/MANAGER; NOT_FOUND shows Google unavailable without attributing deletion to a specific cause.

If the reference is absent, expired or unauthorized, show local work plus `Le contenu Google n’est pas disponible. Votre travail dans YUTA est conservé.` and a role-appropriate handoff/support path. Do not add a browser field to paste a resource ID or a fuzzy “find the same review” operation.

Alternative rejected: permanent identifiers, fabricated restored links or automatic deletion of local work after a rebind.

### D8 — Human-selected freeform user input and explicit application source boundary

Keep current `saveReplySchema` / `createInternalNoteSchema`, textareas, explicit Save and user-input repositories unchanged. They accept the existing valid 1–4,000-character strings without an origin detector, extra quotation editor, checkbox, clipboard restriction or inferred-source rejection. Application import/refresh/get/cleanup only writes provider cache; it never writes raw API text into or rewrites/expires local user-input note/draft bodies. Existing Google display remains separate from Notes internes/Brouillon de réponse; do not duplicate it in a second editor.

Provider cleanup preserves saved user-input strings, local workflow and actor readability. An original locally saved reply remains local work even if a later separately approved publication task sends it to Google; a `reviewReply` fetched from Google remains temporary provider data. This task neither implements nor performs publication.

The source boundary classifies application operations, not the authorship/rights of every arbitrary pasted character. It is not a blanket Google retention exemption. Actual provider/use and copied-content handling remain mandatory separate real-use conditions enforced by D9, rather than an impossible universal input detector before source/synthetic implementation. The actual Human Product decision resolves the prior GI-07 editor/handling choice; all earlier BLOCKED evidence remains historical and the revised contract requires fresh review.

### D9 — Fail-closed admission before any real-provider retrieval

Add server-only `GOOGLE_REVIEW_RETRIEVAL_ENABLED`, default disabled. Only exact `true` enables the retrieval admission path; absent, invalid or false returns a truthful unavailable outcome before credential/token/provider access. Normal actor/entitlement/resource validation still applies. This opt-in flag is an operational admission control, not proof that prerequisites passed: operations may enable it only after actual Google access, permitted cache quantity/use, identifier/copied-content treatment, unattended cleanup and backup/restoration conditions are verified for that environment. This task leaves all existing environments unchanged and does not set the flag or provider credentials.

Synthetic tests may inject reviewed dependencies/process-only fixtures with strict denial of unrecognized external calls; they report synthetic evidence, never actual project eligibility. No product-configurable provider URL, browser test mode or production fixture endpoint is added. Existing OAuth/binding foundation remains separately owned; D9 gates only new review retrieval. Cleanup must remain available under its own machine credential.

## Risks / Trade-offs

- [Arbitrary freeform text may contain copied content] → preserve selected freeform UX; no authorship/permission claim. D9 blocks real-provider use until the actual permitted-use contract is verified.
- [Expiry removes the provider mapping] → preserve internal work and truthful unavailable-reference fallback; no permanent historical deduplication promise.
- [Concurrent fetch/rebind or membership revocation] → operation grants, captured generation and commit-time authority fence.
- [Incomplete recent coverage] → explicit page/batch coverage; local queue counts are not provider-history completion.
- [Maintenance/backup failures] → unconditional read denial, content-only cleanup evidence and separate real-use operations prerequisites; no physical-erasure/readiness claim from code alone.
- [Legacy data already contains provider fields] → default unmanaged marker and exact exclusions; no existing-row cleanup/migration adoption.
- [Refresh overwrites typing] → stable local UUID/form state and explicitly applied list updates; Browser QA during active editing.

## Migration Plan

No migration is generated or run before sensitive Design approval.

After fresh sensitive Design approval, add one additive cloud migration for the importer marker, temporary cache and retrieval-state relations and required scoped indexes/constraints; use the existing db-cloud migration tooling and inspect generated SQL. Default every existing row to unmanaged/legacy; do not backfill provider ownership or change existing text/children.

Tests use a fresh guarded task-labelled PostgreSQL17 tmpfs database at exact loopback `127.0.0.1:54339`, database/user `yuta_google_review_import_test`, with explicit test flags and verified actual DB/user/session-user/version before effects. Preserve earlier QA container/DB on54329 and all dev DBs. Use injected provider/clock fixtures with no real credentials. Prove new data separation, scoped uniqueness/conflicts, expiry masking across list/detail/search/sort/count/mutations, actual content-only purge without child loss, pagination/receipt atomicity and membership/bind races. Verify DIRECT and legacy behavior unchanged.

Rollback disables new retrieval entry points while retaining local work and mandatory cache cleanup. Do not reverse ownership by turning managed copies into legacy-readable data. Do not drop temporary data/columns with active content or remove cleanup before retained-copy disposal is addressed. Production deployment/migration/backup scheduling remains separately authorized.

## Validation and exact implementation scope

Before Apply, obtain fresh sensitive Gate 2b review under CODEX_ONLY. Only then create Tasks and phase Technical Implementation Contracts with exact allowlists. D8 is the explicit Human-selected source boundary; D9 keeps real-provider use closed.

Expected owners/seams: db-cloud Reputation schema/repository/index/new migration and focused integration tests; contracts Reputation input/outcome schemas/tests; Backoffice server Google client/orchestration/auth grant/setup/loaders, existing Integrations actions/components and route-owned Avis/Today components/tests; bounded authenticated maintenance entry; current Reputation/Today/operations docs. Generated migration identities are isolated before Data Apply.

Candidate implementation allowlist, inactive until fresh sensitive Design approval:

- `packages/db-cloud/src/schema/reputation.ts`, `packages/db-cloud/src/reputation-repository.ts`, `packages/db-cloud/src/index.ts`, new `packages/db-cloud/src/google-review-retrieval-repository.ts`, and focused new `packages/db-cloud/test/google-review-retrieval.integration.test.ts` plus existing Reputation regression tests. One newly generated numbered cloud SQL migration and its exact journal/snapshot entries are isolated/reviewed before Data Apply; existing deployed SQL is never edited.
- `packages/contracts/src/reputation/index.ts` and `packages/contracts/test/reputation.test.ts`.
- `apps/backoffice/src/server/reputation/google-business-profile-client.ts`, new `google-review-retrieval.ts` / `google-review-lifecycle.ts` / `google-review-retrieval-config.ts`, existing `google-connector-access.ts` / `release-a-setup.ts`, `apps/backoffice/src/server/auth/permissions.ts`, and the scoped connector-binding repository seam.
- Existing route-owned Avis loaders/model/actions/detail/list/draft/note components; new `_components/google-review-retrieval-panel.tsx`; existing Integrations actions and Google selector; existing Today loader/presentation. Existing note/draft editors and Save semantics remain unchanged; surrounding unavailable-content presentation may change.
- The authenticated maintenance route named above and a dedicated server-only configuration/auth helper; the exact machine path in `apps/backoffice/src/lib/backoffice-exposure.ts`; Backoffice environment example and current operations documentation only for the new credential contract, with no secret value or production setting.
- Focused Backoffice tests for provider validation, operation roles/denials, retrieval orchestration, copy/continuity/expiry and maintenance denial; current Reputation/Today/operations knowledge updates attributable to actual implementation only.

Tasks must expand route-owned existing component/model paths and generated migration identities from actual repository inventory before Apply. This allowlist does not authorize unrelated files or a source change while this Design remains blocked.

A process-only Browser QA runner may copy the exact source candidate into an ignored temporary app directory with isolated Next build output and new loopback ports, maintaining source hashes. It uses normal synthetic session/login and the verified disposable DB. A strict server-fetch preload returns fixed reviewed Google fixtures and rejects every unrecognized external request; browser interception alone is insufficient for server provider calls. This is test infrastructure, not a customer route or substitute UI. No existing runtime is restarted.

Required later checks: docs, architecture, workspace typecheck, format, affected contracts/db-cloud/Backoffice tests and cloud build as applicable; synthetic persisted integration evidence and browser QA of roles, expiry/recovery, history and editing continuity. Real-provider tests remain prohibited until GI-05 and all permitted-use prerequisites are satisfied.

## Current decision and review boundary

GI-07 Product direction is resolved by the actual Human: freeform saved user input and separate automatic Google cache. This revised Design awaits fresh independent sensitive review; no Tasks/Apply until APPROVED. GI-05/GI-08 and actual provider/use/cleanup/backup conditions remain separate real-provider blockers enforced by disabled-by-default D9. No source/synthetic PASS authorizes live use or indefinite reference retention.
