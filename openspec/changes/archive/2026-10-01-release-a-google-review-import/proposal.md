## Why

Release A needs a useful Google review inbox beyond OAuth and verified location binding. Users should continue saved work immediately while YUTA retrieves reviews when needed, without losing local work or treating an incomplete or failed retrieval as a complete Google history.

## What Changes

- Adopt the current user's `chốt luồng 3`: show eligible cached Google content and saved YUTA work immediately; retrieve the first batch after OWNER confirmation/continuation; allow OWNER/MANAGER visit-triggered stale refresh, `Actualiser`, requested older pages and eligible single-review recovery. Retrieval remains a separate provider operation with persisted evidence; no additional import-only screen is required.
- Retrieve up to 50 reviews per page ordered by provider update time, with `Voir plus d’avis` on demand. This is a page size, not a total workflow cap or Google permission to accumulate unlimited cached history. Show loaded coverage and truthful recent-batch freshness.
- Deduplicate by trusted scoped provider review identity while that mapping is permitted and available. Update the Google copy only; preserve local status, assignment, independently authored notes/drafts and history. Mark provider edits for review, keep remote replies separate from local drafts, and do not infer deletion from absence in a recent page.
- Preserve selection and unsaved input during retrieval. Distinguish never performed, pending, error, successful empty, usable partial coverage, expired content, reconnect and unavailable-review outcomes. Failed retrieval does not advance successful freshness or become an empty result.
- Keep Google copies secure and temporary, with actual retrieval provenance and a deadline no later than 30 calendar days. Deny expired content and physically remove it without deleting independent YUTA work. Unfetched records do not receive a new deadline.
- Recover an expired review only with a still-permitted trusted reference and verified current binding. If such a reference is unavailable, retain the scoped local work and explain the missing Google content; do not promise perpetual exact linkage or an indefinite `reviewId` exemption.
- Apply the actual Human freeform/cache decision: preserve existing note/draft inputs and explicit Save, and keep automatically fetched Google content in separate temporary storage. Import/refresh/cleanup never inserts provider text into or rewrites/expires user-input bodies. No quotation editor or universal pasted-text detector. This Product decision is not a provider-retention exemption; real-use permission remains separate and real-provider admission must fail closed until verified.
- Retain Google-only A, OWNER connector management, OWNER/MANAGER retrieval and assigned-only STAFF cached/local work. STAFF route opening, filters, notes and draft Save do not trigger provider retrieval. Add scoped tests and Browser QA only after the applicable mode-defined independent gates.

## Capabilities

### New Capabilities

- `reputation/google-review-retrieval`: first retrieval, visit/manual refresh, requested pagination, conditional detail recovery, actor/resource authorization, scoped deduplication, persisted outcomes, provider/local separation, temporary content and physical cleanup.

### Modified Capabilities

- `backoffice/release-a-customer-exposure`: truthful retrieval/coverage/expiry states and separately eligible local work on Avis/Today/Integrations, preserving the five A surfaces and role/source constraints. Legacy unknown-provenance Google rows retain their existing authorized readability; retrieval does not silently adopt, re-date or purge them.

## Impact

- Runtime owner: authenticated `apps/backoffice`, server-only provider access. Persistence owner: `packages/db-cloud`. Transport owner: `packages/contracts`. Reuse existing Reputation UI and trusted cloud boundaries.
- Affected areas: Google client/orchestration, confirmed binding/continuation, Avis retrieval/presentation and shared read/mutation eligibility, Today queue projection, schema/repositories/migration, contracts/tests, current Reputation/Today and operations documentation. Sensitive Design defines the exact implementation allowlist.
- No new app/package/framework/public endpoint; no POS/Display/Booking/Direct Feedback changes, AI, reply approval/publication, scheduled provider synchronization, customer/production activation, global backup changes, lifecycle promotion, legacy/demo cleanup or remote Git operation.
- **Sensitive:** provider permitted use, personal review data, identifiers, quotation handling, persistence and physical cleanup require fresh independent Specs and sensitive Design review under `CODEX_ONLY`. Product approval does not prove actual Google access or permit real-provider use.

### REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** `release-a-google-review-import`, latest decision `chốt luồng 3`, adopting immediate cached/local work, retrieval when needed, manual refresh, first page of 50 plus requested history, and retention of independent local work. This replaces the earlier separate-button-only proposal and its unapproved total-window/text-deletion options. RR-02/RR-03 retain the accepted A actor/queue constraints.
- **HARD_CONSTRAINTS:** `CODEX_ONLY`; sequential fresh independent gate review; actual Human decisions remain required for material scope/authority changes and separately confirmed operations; `COMMIT_AFTER_TASK: YES`, isolated local commit on `main` after completion; trusted authorization/resource scope, secure temporary provider copies, physical cleanup and verified permitted use. No blanket local-work deletion, unrestricted quoted-text retention or permanent provider-reference promise.
- **OUT_OF_SCOPE:** the exclusions above. Exact stale interval is a Design decision; the supplied 15-minute value is an example. Provider permission, operational access, later gates and live activation are not granted by choosing this flow.
- **SUCCESS_OUTCOMES:** permitted users can continue saved work, retrieve first/recent/older coverage without duplicate or overwritten local work while permitted identity exists, and see truthful outcomes. Unauthorized actors cause no provider/storage effects. Expired Google copies disappear while independent local work remains available; conditional recovery and missing-reference fallback are honest. Checks/QA, permitted-use/access evidence and production readiness stay distinct.

## Subsequent Product decision

The actual user approved freeform notes with separate Google cache, confirmed original locally saved replies survive provider-cache expiry, then instructed implementation. Publication remains a separate future task: this retention distinction neither implements nor performs publication. This existing change returns through fresh independent review on revised Proposal/Analysis, Specs and sensitive Design; preserve previous approvals and the GI-07 BLOCKED verdict as historical evidence.
