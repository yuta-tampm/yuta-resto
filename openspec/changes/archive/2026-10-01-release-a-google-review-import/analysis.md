# Change Analysis

## Scope and Change Type

This is the Google retrieval/work-continuity slice of Release A, retaining the task name `release-a-google-review-import`. The current user selected `chốt luồng 3` after considering immediate cached work, retrieval when needed, manual refresh, history loading and retention of independent local notes/drafts. This supersedes the initial-import-only planning candidate; it is behavioral, UI/data-affecting, security-sensitive and external-provider-sensitive.

Task context is `CODEX_ONLY`, selected prospectively by the actual user after original Human Gate 1 approval; `COMMIT_AFTER_TASK: YES`, local `main`, no push/deploy. Baseline: `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57`, 2026-10-01. The actual user subsequently approved freeform notes with separate Google cache, then instructed implementation. This authorized planning revision returns to fresh independent Gates 1/2/2b before Tasks/Apply. Historical approvals and the GI-07 BLOCKED verdict are preserved in their existing packets.

### REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** latest actual user instruction `chốt luồng 3`, adopting the supplied flow and our explicit bounded assessment: immediate valid cache/local work, first retrieval after confirmed connection, visit-triggered retrieval when needed, `Actualiser`, up to 50 per page plus requested history, scoped duplicate handling, and preserved independently authored local work after Google expiry. User-entered notes/drafts remain freeform and survive cache expiry; automatically fetched Google content stays separate. Exact review restoration depends on permitted reference retention; Product selection grants no provider permission. RR-02/RR-03 remain controlling actor/source/queue boundaries.
- **HARD_CONSTRAINTS:** mode-defined independent gate review; server-trusted session/membership/scope/resource authority; no credentials in browser/evidence; secure temporary Google copies with actual cleanup; preserve independent local work without a blanket exemption for quotations or identifiers. Completed isolated local commit on `main` only.
- **OUT_OF_SCOPE:** scheduled provider sync, reply approval/publication, AI, other providers, DIRECT/local products, public entry, live activation, global backup changes, lifecycle promotion, legacy/demo purge and remote Git operations. No guaranteed permanent review mapping. The attachment's 15-minute interval is illustrative, not an accepted exact threshold.
- **SUCCESS_OUTCOMES:** immediate work continuity and truthful first/refresh/page/detail outcomes, within explicit role/resource scope; no unauthorized effect, duplicate while permitted identity exists, or overwritten local work; honest partial coverage and freshness; expired Google content denied and removed while independent local work remains; conditional recovery with a concrete unavailable-content fallback; technical/synthetic, actual provider eligibility and live readiness reported separately.

## Sources Consulted

- Instructions and authority: [root instructions](../../../AGENTS.md), [Backoffice](../../../apps/backoffice/AGENTS.md), [db-cloud](../../../packages/db-cloud/AGENTS.md), [contracts](../../../packages/contracts/AGENTS.md), [docs index](../../../docs/README.md), [current state](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- Product/behavior: [release roadmap](../../../docs/PRODUCT_RELEASE_ROADMAP.md), [Reputation home](../../../docs/features/reputation/README.md), [tracker](../../../docs/features/reputation/STATUS.md), [Today home](../../../docs/features/today/README.md), [exposure spec](../../specs/backoffice/release-a-customer-exposure/spec.md), [draft pending spec](../../specs/reputation/reply-draft-pending-feedback/spec.md).
- Boundaries: [database ownership](../../../docs/architecture/DATABASE_BOUNDARIES.md), [tenancy](../../../docs/architecture/TENANCY.md), [authentication](../../../docs/architecture/AUTHENTICATION.md).
- Implementation: [Google adapter](../../../apps/backoffice/src/server/reputation/google-business-profile-client.ts), [token accessor](../../../apps/backoffice/src/server/reputation/google-connector-access.ts), [selection action](<../../../apps/backoffice/src/app/(authenticated)/parametres/integrations/actions.ts>), [selection UI](<../../../apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx>), [setup summary](../../../apps/backoffice/src/server/reputation/release-a-setup.ts), [schema](../../../packages/db-cloud/src/schema/reputation.ts), [repository](../../../packages/db-cloud/src/reputation-repository.ts), [transport](../../../packages/contracts/src/reputation/index.ts).
- Inspected test seams: [setup-loader tests](../../../apps/backoffice/test/release-a-reputation-loaders.test.tsx), [Google security tests](../../../apps/backoffice/test/google-connector-security.test.ts), [integration tests](../../../packages/db-cloud/test/reputation-repository.integration.test.ts), [exposure denial tests](../../../packages/db-cloud/test/reputation-release-a-exposure.integration.test.ts).
- UI: [UI guide](../../../docs/ui/README.md), [shared rules](../../../docs/ui/YUTA_FRONTEND_RULES.md), [Backoffice rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [Today pack](../../../docs/ui/pages/today/README.md), [external advisory policy](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- Official provider sources, fetched 2026-10-01: [API policies](https://developers.google.com/my-business/content/policies), [reviews.list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list), [Review resource](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews). These define constraints and API behavior; they are not project-specific Google approval.

Additional official source fetched 2026-10-01: [reviews.get](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/get). It permits requesting an individual review at a verified location but establishes no long-term identifier-storage exception.

The user-supplied UX attachment is proposal provenance, not independent authority. Its SHA-256 is `d453fd135d7c96742422ce89e2743170008fe5fdaff608ea5e53f3f6dcc9877c`. Only the actual current-user `chốt luồng 3` adopts the flow; the embedded “I choose” statement did not approve a gate.

## Authority and Product Decision

RR-02 accepts Google-only A, OWNER connector management, OWNER/MANAGER manual refresh and assigned STAFF read/note/draft. RR-03 keeps five surfaces and a local handling queue. Broader AVIS/provider questions remain separate. The latest user decision changes this task's earlier initial-only scope; it does not change those existing permissions or claim later publication implementation.

GI-03 is resolved at Product level: up to 50 reviews per requested page, with additional history on demand, not a 50-work-item cap. GI-04 is resolved at Product level: retain independent YUTA work and authored text; expire Google copies, not entire work records. The earlier attached-text deletion proposal was never approved and is superseded.

The accepted role application is retained for fresh independent review:

| Actor   | Retrieval behavior                                                                                                                                                                                  | Work/read behavior                                                                                        |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| OWNER   | Verify/bind connection and explicitly continue to first retrieval, including an already-bound connector. Request stale visit refresh, manual refresh, older pages and eligible individual recovery. | Existing scoped permissions apply.                                                                        |
| MANAGER | Request stale visit refresh, manual refresh, older pages and eligible individual recovery for an already-established connector; no connector management or new OAuth entry.                         | Existing scoped permissions apply.                                                                        |
| STAFF   | Opening a route or changing local work does not initiate provider retrieval. Missing Google content offers an OWNER/MANAGER handoff.                                                                | Assigned-only eligible cached content and independent local work; no connector/refresh/publication grant. |

An actual visit to the Avis list/detail can initiate retrieval for an eligible OWNER/MANAGER under the stale rule. Rendering Today, changing filters, assigning a review, editing a note or saving a draft does not initiate it. No unattended provider polling or scheduled synchronization is introduced. Exact freshness threshold, request consolidation and implementation technique belong to sensitive Design. Integrations remains OWNER-only.

Google's published policy limits secure performance-oriented cached API content to at most 30 calendar days and restricts manipulation/aggregation. It does not name a safe numeric cache quantity or an indefinite `reviewId` exemption. Page size does not establish cache permission. This candidate makes no blanket retention claim for copied Google text.

## Accepted Flow and Observable Boundaries

1. OWNER confirms the intended server-discovered account/location and explicitly continues toward Avis. Verified binding alone is not a retrieval receipt. Provide a usable first-fetch/retry path for existing bindings and reconnects.
2. Render permissible cached Google content and saved scoped work immediately. First visit without usable Google content shows a truthful pending/setup state; local work remains usable if it exists. Eligible stale visits may check Google without blocking existing work.
3. First/recent retrieval requests up to 50 reviews in provider-update order. Label recent updates, not necessarily recently authored reviews. `Voir plus d’avis` requests another page. Coverage/freshness describes the actual page/batch, never all history.
4. Deduplicate by provider review identity at the correct bound location and YUTA scope while a permitted mapping exists. New records enter local `NEW` without invented assignment. Existing records retain status/assignment/notes/drafts/history; absence from a recent page is not deletion. After a mapping is no longer permitted/available, do not guess linkage using author name or text, claim complete historical deduplication, or silently reattach preserved work.
5. Provider rating/comment edits produce a review-needed indication while preserving local handling state and draft; fetched remote replies stay distinct from local drafts and local publication states. A fetched reply is not proof that YUTA approved/published it or that provider moderation completed.
6. Retrieval does not jump selection, reorder the active working context under the cursor or replace unsaved draft/note input. Announce added items and preserve the existing explicit local Save result and pending semantics.
7. Persist never-run, pending, failure, completed-empty and completed-with-content outcomes at the right binding/scope. An empty older page is not proof that the location has no reviews. Failures do not change successful freshness, erase work, or become zero-review success.
8. Each actually retrieved Google copy receives its own deadline no later than 30 calendar days. Refreshing recent reviews does not renew omitted older copies; local edits and retry alone do not renew any copy. Expired content is unreadable and physically removed, including subject copies, through a verified cleanup lifecycle.
9. Preserve independently authored notes/drafts, local status/assignment/history and internal YUTA work identity after cache expiry. Keep readable scoped work accessible even when its Google part is absent; Today follows the same local-work eligibility and RR-03 statuses. Cache expiry alone does not mark work handled, drop its queue status, or destroy it.
10. Individual recovery uses only a currently permitted trusted provider reference and verified binding, with the actor contract above. If unavailable, keep local work and show missing Google content with OWNER/MANAGER/support recovery; do not promise automatic exact recovery forever. Provider NOT_FOUND means unavailable, without inventing the reason.
11. Keep existing freeform note/draft input, validation and explicit Save semantics. Import/refresh/get/cleanup never inserts API text into, rewrites, rejects by inferred origin, or expires these user-input fields. No quotation editor, clipboard control, universal paste detector or source checkbox is required. This application source boundary does not certify every pasted character as independently authored or grant a Google retention exemption. Source implementation and synthetic verification may proceed after fresh Design approval; actual provider-use/retention permission remains a separate mandatory prerequisite before real Google data use.

Today `new` remains local status `NEW`; attention remains `NEW`, `TO_PROCESS`, `DRAFTED`, `FOLLOW_UP`, with matching actor/source/status total, preview and linked list. These count readable local work, including retained work with an unavailable Google part, not all Google history or remote unanswered reviews. STAFF remains assigned-only.

## Current Implemented State

- OAuth, encrypted tokens, refresh and accessible account/location discovery exist; reviews.list/get and persisted retrieval evidence do not.
- Integrations/binding is OWNER-only. Existing selected-location cards hide the bind form; first-fetch/continuation must support already-bound and same-location reconnect cases. No review-refresh grant/operation is implemented.
- The feedback schema mixes provider fields with local workflow, lacks expiry/current-binding provenance, and uses organization/source/external-ID uniqueness. Conflict with another establishment or legacy row must not reassign/adopt it. Rebinding during retrieval must fence out stale results.
- `lastSyncedAt`, local `updatedAt` and seeded Google rows are not retrieval receipts or content lifetime proof. Current credential/binding updates retain old data/timestamps.
- Existing reads/mutations scope organization/establishment and assigned STAFF, but have no provider expiry/binding eligibility. New temporary-content rules apply across shared consumers, including internal mode, without changing DIRECT behavior or internal module availability.
- Whole feedback-item deletion cascades to notes/replies. It cannot implement the adopted expiry contract. Independent local work must survive provider cleanup.
- Local draft Save never publishes. Existing local `PUBLISHED` cannot represent fetched remote reply presence/moderation. Current setup copy says import unavailable; legacy unknown-provenance rows remain readable under their existing authority.

Tests were inspected only. No actual provider access, verified location eligibility, permitted cache/quote/reference/backup contract, integration run or Browser QA was exercised. Historical synthetic exposure evidence does not establish any of these facts.

## Affected Boundaries

- **Runtime/data:** Backoffice server orchestrates, db-cloud persists, contracts transports minimized outcomes. No browser credential/database access, new service or public endpoint; local POS/Site Agent/Display and public Booking/Feedback ownership is unchanged.
- **Authorization:** operation-specific OWNER/MANAGER eligibility and verified resource authority precede token/provider/storage access. STAFF route visits cannot cause establishment-wide retrieval. Forged scope, cursor/reference, foreign record, stale binding and revoked membership fail closed.
- **Provider/privacy:** fetched fields, identifiers, derived fingerprints, quotes, pagination references, logs/audits and backups each need explicit classification. Conditional recovery is not identifier-retention permission. Physical cleanup must run without an active visit and must not fetch reviews. Restoration must not resurrect expired provider content; no global backup mutation is authorized.
- **Projection/work:** separate provider content eligibility from independent scoped work eligibility. No 50-work-item cap, false all-history coverage, provider aggregation/readiness claim or local publication inference.
- **Normative compatibility:** exposure delta must define new temporary-copy/local-work states while preserving unknown legacy readability, five surfaces, source denials and internal availability. Draft pending spec remains unchanged for eligible local forms; do not alter its Save/busy labels.

## Lifecycle Baseline

| Slice                              | Product decision                                                                     | Implementation                                          | Environment                       | Production / dependency                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| A Google retrieval/work continuity | Flow 3 and freeform/cache Product direction selected; fresh delegated review pending | NOT_STARTED                                             | UNVERIFIED                        | BLOCKED; actual provider permitted-use/access not verified |
| Connector foundation               | Existing RR-02 A exception                                                           | OAuth/discovery/binding implemented                     | UNVERIFIED                        | Source is not live eligibility proof                       |
| Inbox/Today                        | Existing bounded A plus proposed separate work/content eligibility                   | Current scopes; retrieval/expiry/work separation absent | UNVERIFIED outside dated evidence | No promotion                                               |

The registry's broad Google rows and older synchronization narratives do not replace the current A decision or source reality. No maturity, lifecycle, rollout or provider readiness is promoted.

## Requirement Readiness

`READY_FOR_SPECS`

Precise bounded Product specs can be written for the selected flow, scoped role proposal, independent-work retention, conditional recovery and explicit unavailable-reference fallback. This conclusion is not Human Gate 1 approval, permission for unrestricted quotes/references, implementation readiness or real-provider authorization.

GI-07 Product handling is resolved by actual Human direction: freeform user input and separate application-managed provider cache. GI-05/GI-08 and actual permitted use of copied content remain real-provider prerequisites. Specs must carry these distinct limits; a concrete fail-closed real-provider admission guard belongs in Design. If Design cannot meet them without changing Product behavior, stop the dependent Apply and return to Human review; do not treat a generic later PASS as resolving them. `skip_specs: true` is inappropriate.

## UI / UX Applicability

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Reuse existing French Backoffice components/semantic tokens on Integrations, Avis and Today. Cover first visit, usable cache/work, pending, stale refresh, load-more coverage, edit notice, zero/error, expired/missing Google content, conditional recovery, reconnect and unauthorized actions. Desktop/mobile keyboard/focus and in-progress editing continuity require later QA. No shell redesign, new UX artifact or sealed-pack rewrite.

UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE

Reason: a functional provider/work-lifecycle change using current UI patterns, without an external visual-design question.

Scope: first retrieval, visit/manual update, requested history, conditional detail recovery and work continuity on the existing A surfaces.

Decision source: latest actual Human freeform/cache approval and implementation instruction, accepted flow 3 and repository UI rules. Fresh delegated review is required.

## Conflicts and Unknowns

| ID      | Classification                                 | Bounded disposition                                                                                                                                                                                                        | Required boundary                                                                                                                             |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| GI-03   | Product resolved                               | User selected 50 per first/requested page plus on-demand history; no total work cap or safe-cache-volume claim.                                                                                                            | Carry into Specs; cache minimization/operations stay reviewed separately.                                                                     |
| GI-04   | Product resolved                               | Preserve independent local work and authored text; expire provider copies. Earlier wholesale attached-text expiry proposal was unapproved and superseded.                                                                  | No automatic whole-note/draft purge.                                                                                                          |
| GI-05   | NEEDS REVIEW: real-provider eligibility        | Actual project/location access, permissible cache/use quantity and secure cleanup/backup/restoration contract are unverified.                                                                                              | Required before real-provider data use; Product/synthetic checks are insufficient.                                                            |
| GI-06   | NEEDS REVIEW: sensitive Design                 | Role grant seam, freshness threshold, field minimization, cursor/binding concurrency, scoped identity/conflicts, receipt/transaction, cleanup reliability and content-free audit/logging.                                  | Resolve inside accepted Product scope before Apply; material scope changes return to Human.                                                   |
| GI-07   | Product resolved; real-use permission separate | Human approves freeform notes/drafts and separate Google cache. Preserve user-input fields; no automatic API insertion, source detector or blanket permission claim.                                                       | Fresh Specs/Design review before source Apply; actual provider/use conditions verified before real data use.                                  |
| GI-08   | NEEDS REVIEW: provider reference lifetime      | No published indefinite reviewId exemption verified. Exact recovery/deduplication requires a still-permitted trusted identity; missing identity shows preserved local work + Google unavailable, without guessing linkage. | Design defines reference expiry/cleanup and missing-mapping behavior. Longer retention needs separate verified provider authority before use. |
| GI-09   | Accepted role application                      | OWNER first continuation/binding; OWNER/MANAGER visit/manual/page/detail retrieval; STAFF assigned cached/local work and handoff only.                                                                                     | Preserve RR-02/RR-03 and obtain fresh delegated review; no new Product role choice.                                                           |
| LANG-01 | Resolved instruction conflict                  | OpenSpec context asks for Vietnamese; current user root instructions require English technical docs. French product copy/Vietnamese explanations retained.                                                                 | User instruction controls; do not alter config or history.                                                                                    |

The deadline concerns the fetched copy, not the age of the original review. No completed page refresh renews all historical copies. No note edit or restoration renews provider-content lifetime.

## Analysis Conclusion

`READY_FOR_SPECS`

The revised bounded candidate supports `reputation/google-review-retrieval` and `backoffice/release-a-customer-exposure` after fresh independent Gate 1 approval on exact hashes. The former replaces the proposed, never-created `reputation/google-review-initial-import` capability name because the adopted scope includes refresh/history/recovery.

Preserve the earlier unapproved initial candidate, original Human Gate 1, delegated Gate 2 and independent GI-07 BLOCKED history in existing review packets. The user authorizes source implementation within this revised scope after fresh sequential reviews; no real-provider use, deployment, sync/archive or remote Git authority follows. No Tasks or Apply precedes current sensitive Design approval.
