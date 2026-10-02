```text
Change: release-a-google-review-import
Gate: 1 — Proposal / Analysis
Review status: APPROVED
Created: 2026-10-01
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
COLLABORATION_MODE: CODEX_ONLY
COMMIT_AFTER_TASK: YES
Commit destination: isolated completed task changes, local main
Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Workflow state: REVISED_GATE_1_APPROVED_CONTINUE_SPECS
Revision source: actual Human freeform/cache approval followed by ok, đồng ý. triển khai
```

## Independent revised Gate 1 approval

Reviewer `/root/google_import_gate1_revision_review` returned APPROVED on pending packet `a14bbaf5443848ea860c922603decc388b33f502fa9c8c58ba5595917456419d`. All six current identities and both embeddings matched again before recording. Approval recorded by Codex workflow at 2026-10-01T18:59:51.957Z. No material findings remain after the preserved three-phrase correction; approval permits revised Specs only. CODEX_ONLY selection source: actual current-user prospective mode change for this task. No real-provider, activation or deployment authority.

## Request and bounded revision

The actual current user approves freeform note/draft input with separate Google cache, confirms original locally saved replies survive cache expiry, and instructs implementation. Routine gate progression remains CODEX_ONLY with separate fresh-context review; COMMIT_AFTER_TASK YES remains local main after requested completion, without push/deploy. Baseline main HEAD: `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57`.

The old classification-before-Apply obligation is revised explicitly under this Human Product direction. Keep the current editors, validation and explicit Save; the importer/refresh/cleanup cannot write API text into, rewrite or expire user-input bodies. Do not certify arbitrary pasted text as independently authored or claim an API-content exemption. Real-provider use/retention permissions, long-term review-reference treatment and cleanup/backup operations remain separately verified prerequisites before actual Google data. Design must provide concrete fail-closed real-provider admission; synthetic source delivery is the bounded implementation lane.

Flow 3, RR-02/RR-03 actors/queue, provider-copy deadlines, legacy/DIRECT isolation, no indefinite mapping, no publication/AI/scheduled retrieval or deployment remain unchanged. No Tasks or Apply precedes fresh sequential Gates 1/2/2b. Later Specs/Design currently contain the superseded obligation and are invalidated until revised and freshly reviewed.

## Exact revision and expected outcome

Previously GI-07 required content-origin classification before dependent Apply despite single-string inputs. Now the application source boundary is explicit: user-entered local work stays unchanged; automatically retrieved provider data only enters temporary cache. There is no new quote editor or detector. The accepted revision resolves the Product UX blocker, while provider-use permission remains a real-data blocker. Approval of this packet allows only the coherent next Specs revision, not actual provider use.

UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES; UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE. Mandatory later synthetic persisted and Browser QA remain.

## Current exact identities

Hash tool: Node crypto SHA-256 over exact raw file bytes.

| Path                                                           | SHA-256                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/PRODUCT_RELEASE_ROADMAP.md                                | 8ebdc933ad5ae363b0c438193e8a029686186bee82a8d0961d3f5c62034279ee |
| docs/features/reputation/README.md                             | 2e2d14e33698bb667d1ea6f140930c1a593d65ee927ce7c4470b7187cd6f303c |
| docs/features/today/README.md                                  | 666315bc75371625bee357f94fc9a4fc5eb35af30e57b735615c79f88d4f8cd3 |
| openspec/changes/release-a-google-review-import/.openspec.yaml | edbcd0b0cb2d4619b326f4293e56c1d31f5ce6be37dda83923ff58267b46f1ab |
| openspec/changes/release-a-google-review-import/analysis.md    | 99ce35d5324ef36d96706158940e2d33a36d42442e8914fffaa7080c8100aaa9 |
| openspec/changes/release-a-google-review-import/proposal.md    | 5ecaaf8176c0812c99e18bfb8a20b1b3057f8c6c634a3ca8cd51f46c4b96fa2f |

## Exact Proposal

```markdown
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
```

## Exact Analysis

```markdown
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
```

## Gate 1 revision review correction history

Reviewer `/root/google_import_gate1_revision_review` returned CHANGES_REQUESTED on packet SHA-256 `12d5b301ae9f623aabedb7269a2e6f53935ab02d8bede712dacca519fb39c335`, Proposal `a29be39597e1adbe309315e9e12484cde012f4ad65029ac057c0f00d640df6b4` and unchanged Analysis `99ce35d5324ef36d96706158940e2d33a36d42442e8914fffaa7080c8100aaa9`. One material finding: three stale Human-gate phrases contradicted selected CODEX_ONLY. These were corrected to mode-defined independent review while keeping actual Human scope/authority decisions and real-provider prerequisites. No behavior/scope expansion. Current packet awaits a fresh verdict; the previous non-approval remains history.

## Historical prior Gate 1 packet

Prior raw-byte SHA-256: `59a23ca97f2a3cd55287828acbfb97babd02c94313f3111d6cca7f3f8f4290a1`. Its original Human approval and prospective CODEX_ONLY change remain historical truth; the reviewed artifact identity is superseded by the authorized revision, not retroactively approved. The following is a line-ending-normalized complete textual preservation.

`````text
```text
Change: release-a-google-review-import
Gate: 1 — Proposal / Analysis
Review status: APPROVED
Created: 2026-10-01
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
COLLABORATION_MODE: CODEX_ONLY
MODE_SELECTION_SOURCE: explicit current-user task-mode change, duyệt, đổi lựa chọn codex làm với tôi thành codex có thể làm 1 mình
Gate 1 review mode: HUMAN_COLLABORATION
COMMIT_AFTER_TASK: YES
COMMIT_SELECTION_SOURCE: actual current-user named-task intake, YES — commit local khi task hoàn tất
Commit destination: isolated completed task changes, local main
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-10-01T17:45:03.3239126Z
Workflow state: GATE_1_APPROVED_CONTINUE_SPECS
Revision source: actual current-user instruction, chốt luồng 3
```

## Human approval and prospective mode change

The actual current user instructed `duyệt, đổi lựa chọn codex làm với tôi thành codex có thể làm 1 mình`. Before recording approval, all six current identities and both exact artifact embeddings matched, with the planning path-set still metadata/Proposal/Analysis. Gate 1 is approved by the Human on those exact bytes.

The same instruction explicitly changes this existing task to CODEX_ONLY for subsequent routine gates. Separate fresh-context read-only reviewers must approve Gates 2, sensitive 2b and 3; author/helper advice is not approval. Material Product/authority changes and separately authorized operations remain Human-owned. COMMIT_AFTER_TASK remains YES, local main only after completion; no push/deploy.

Approved Proposal/Analysis keep their reviewed HUMAN_COLLABORATION context byte-for-byte as historical decision provenance. This existing packet records the prospective mode override; later artifacts/reviews carry CODEX_ONLY without modifying the approved content. Pre-approval request/recommendation language below describes the candidate when presented and is superseded only by this approval record, not silently rewritten.

## Request, decision and candidate

The actual current user selected `chốt luồng 3` after our bounded assessment of the supplied UX flow. This authorizes the present revision of existing Proposal/Analysis, adopting immediate eligible cache/local work, first retrieval after confirmed connection, retrieval on a stale visit, manual `Actualiser`, 50 per page plus requested history, and retention of independently authored local notes/drafts after Google expiry.

This supersedes the earlier separate-button-only and initial-import-only candidate. The user did not approve the earlier 50-total window or attached-text deletion proposal. They also did not approve a yet-unwritten Gate 1 candidate, long-lived Google identifiers, unrestricted quoted-text retention or actual provider use.

Baseline remains `main`, HEAD `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57`. The exact candidate is three planning artifacts plus this review packet, all task-owned and currently untracked. No implementation or canonical Product/spec file is changed. Helpers performed read-only discovery/consistency advice; they cannot approve this Human gate.

The revised new capability is `reputation/google-review-retrieval`, replacing the never-created `reputation/google-review-initial-import` proposal. The modified capability remains `backoffice/release-a-customer-exposure`. The task name does not change and no second task/branch is created.

## REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** latest user-selected flow 3; immediate valid cache and saved scoped work; retrieve when needed; manual refresh; 50 per page plus requested history; preserve independent authored work. RR-02/RR-03 retain A/actor/queue scope.
- **HARD_CONSTRAINTS:** actual Human approvals, trusted server/resource scope, secure temporary provider content and physical cleanup, no wholesale local-work deletion, no blanket quotation/reference exemption, completed isolated local commit on `main` only.
- **OUT_OF_SCOPE:** scheduled provider sync, reply approval/publication, AI, other providers, DIRECT/local products, public entry, live activation, global backup changes, lifecycle promotion, legacy/demo purge and remote Git operations. The 15-minute example is not an exact approved rule.
- **SUCCESS_OUTCOMES:** usable work continuity, truthful partial retrieval/zero/error/freshness states, authorized scoped deduplication while permitted mapping exists, no lost or overwritten local work, enforced provider expiry/cleanup, conditional exact recovery and an explicit missing-reference fallback. Product, technical evidence, actual provider eligibility and live readiness are distinct.

## Exact changes and consequences for Human review

| Item              | Earlier pending candidate                                    | Revised candidate                                                                                                                                                      | Consequence / boundary                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trigger and scope | Separate OWNER import button; refresh after success deferred | OWNER confirmed continuation/first retrieval, including already-bound path; OWNER/MANAGER stale-visit refresh, Actualiser, older pages and conditional detail recovery | No extra import-only screen. This adds retrieval contracts, not connector access for MANAGER or provider access for STAFF.                                                                |
| GI-03 coverage    | Unapproved 50-total recent window                            | Up to 50 per page, ordered by provider update time, with Voir plus d’avis                                                                                              | No cap on retained independent work; loaded coverage is not all-history coverage or permissible cache-volume proof.                                                                       |
| GI-04 local work  | Unapproved conservative deletion of attached draft/note text | Retain independent authored work; expire Google copies                                                                                                                 | Whole-item/whole-note purge is not authorized. Quotes and freeform pasted Google text need a feasible verified contract before dependent Apply.                                           |
| In-progress work  | Minimal first-import presentation                            | Retrieval preserves active selection and unsaved input; new-item/edit indications                                                                                      | No automatic local-state reset or replacement of the draft.                                                                                                                               |
| Remote reply      | Deferred                                                     | Minimized separate fetched-reply read state                                                                                                                            | No approval/publication contract or claim that local PUBLISHED equals remote publication/moderation.                                                                                      |
| Expiry recovery   | Later refresh deferred                                       | Scoped work remains visible; exact re-fetch only with still-permitted trusted reference                                                                                | If reference unavailable, show work + missing Google content and role-appropriate recovery. No guaranteed permanent linkage or historical deduplication after permitted identity expires. |
| Capability path   | reputation/google-review-initial-import, never created       | reputation/google-review-retrieval                                                                                                                                     | Names the selected refresh/history/recovery scope; no duplicate capability/spec exists.                                                                                                   |

The exact actor application is part of this current review candidate: OWNER manages/validates binding and performs confirmed first continuation; OWNER/MANAGER may request retrieval for an established connection. STAFF only reads assigned eligible cache/local work, writes permitted notes/drafts and receives OWNER/MANAGER handoff for unavailable Google content. STAFF route opening, Today rendering, filters, assignment, notes and draft Save do not cause provider retrieval. Integrations stays OWNER-only.

Local Today `new = NEW` and attention statuses remain unchanged; counts/preview/linked list share readable local-work scope, including retained work with missing provider content. A queue total is not a remote Google total or unanswered metric. Legacy unknown-provenance Google rows retain authorized readability and are not silently adopted/re-dated/purged.

## Remaining review items and stop boundaries

- **GI-03/GI-04:** current Human flow selection resolves Product direction; old unapproved proposals are superseded.
- **GI-05:** actual project/verified location access, permissible cache/use quantity, secure cleanup and backup/restoration contract remain unverified. Required before any real-provider data use.
- **GI-06:** exact freshness interval, grant seam, minimal fields, cursor/identity/conflicts, bind concurrency, persisted receipt and cleanup/audit design must pass sensitive Gate 2b before Apply.
- **GI-07:** copied/derived Google text in freeform notes/drafts remains unresolved at implementation/provider-contract level. No blanket retention exemption and no wholesale note deletion; concrete feasible handling required before dependent Apply. Any changed Product consequence returns to Human.
- **GI-08:** no indefinite reviewId exception verified. Design must classify and expire references and define missing-mapping behavior. Exact recovery uses a still-permitted reference only; fallback retains local work and marks Google unavailable, without guessing identity.
- **GI-09:** Human reviews the concrete OWNER/MANAGER retrieval versus assigned STAFF cached/local-work contract above. The author's analysis/helper recommendation is not a grant.
- **LANG-01:** root user instructions require English technical docs despite Vietnamese OpenSpec context. French product copy and Vietnamese explanations remain; no config/history correction.

`READY_FOR_SPECS` means the bounded conditional behavior can be specified; it does not erase these separate Design/provider-use blockers. A generic later PASS cannot establish provider permission. If the conditional limits cannot be implemented without changed Product behavior, stop and return to Human review.

## Authorities and provenance

Controlling Product authority is the actual current user's latest instruction plus RR-02/RR-03 in the release roadmap and current Reputation/Today homes. Behavior compatibility comes from the existing exposure/draft-pending main specs. Runtime/data/security authority comes from root/scoped instructions and database/tenant/auth architecture. Analysis below links the consulted sources.

Official sources rechecked 2026-10-01: [Google API policies](https://developers.google.com/my-business/content/policies), [reviews.list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list), [reviews.get](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/get). Policy states a limited secure temporary cache and a 30-calendar-day maximum; list supports pages up to 50 and update-time ordering; get supports individual retrieval at verified locations. These are no project-specific approval, numeric cache allowance or indefinite identifier exemption.

User attachment SHA-256: `d453fd135d7c96742422ce89e2743170008fe5fdaff608ea5e53f3f6dcc9877c`. It is a proposal source; its embedded choice did not approve the workflow. Actual user selection is `chốt luồng 3`.

UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES; UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE. Sensitive Gate 2b is required after prior Human gates. No lifecycle/readiness promotion.

## Current exact identities

Command: `Get-FileHash -LiteralPath <path> -Algorithm SHA256`, exact bytes, lowercase hexadecimal. Current rows sorted by ordinal repository path. Only this current identity section is used for later candidate equality; historical tables below describe superseded bytes and must not be compared as current.

### Planning artifacts

| Path                                                           | SHA-256                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/release-a-google-review-import/.openspec.yaml | edbcd0b0cb2d4619b326f4293e56c1d31f5ce6be37dda83923ff58267b46f1ab |
| openspec/changes/release-a-google-review-import/analysis.md    | 3a469d3de814956f04bc983a76a9471be70af8a0f98f6ed7a80abd68aaa442f1 |
| openspec/changes/release-a-google-review-import/proposal.md    | 36e44c32654a027fe13290491b4e0bf12cfbdc1cbbe2ed2245b5716b68195414 |

### Controlling source snapshot

| Path                                                          | SHA-256                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/PRODUCT_RELEASE_ROADMAP.md                               | 8ebdc933ad5ae363b0c438193e8a029686186bee82a8d0961d3f5c62034279ee |
| docs/features/reputation/README.md                            | 2e2d14e33698bb667d1ea6f140930c1a593d65ee927ce7c4470b7187cd6f303c |
| openspec/specs/backoffice/release-a-customer-exposure/spec.md | b3e726a1f6102e399b8a319a72570610898028b21074ff7e1472afae53c379db |

## Current revision checks and limits

- `pnpm docs:check`: PASS, 36 current documents.
- `pnpm architecture:check`: PASS.
- `pnpm -r --if-present typecheck`: PASS, every workspace package with a typecheck script completed.
- `pnpm format:check`: PASS; preservation passed for 67 protected exact paths and all matched files passed Prettier.
- Current packet integrity: all six current identities match; Proposal/Analysis embeddings are exact; the artifact path-set is metadata/Proposal/Analysis only. The complete superseded packet text is preserved with normalized line endings.
- Final check-result annotation is followed by an exact-path Prettier check and integrity recheck; no runtime/source artifact is changed by that annotation.

Prior check history below is retained and is not current-revision evidence. Read-only helper consistency advice identified no contradiction; it is not Human approval. Current state remains AWAITING_HUMAN_GATE_1.

Current packet is not self-hashed. Strict OpenSpec validation is deferred until Specs exist and the Human gate permits them. No application/provider/database tests, builds, Browser QA, provider calls, runtime restarts, schema generation, environment/secret inspection, staging or commit belong to this planning revision.

## Exact proposal

```markdown
## Why

Release A needs a useful Google review inbox beyond OAuth and verified location binding. Users should continue saved work immediately while YUTA retrieves reviews when needed, without losing local work or treating an incomplete or failed retrieval as a complete Google history.

## What Changes

- Adopt the current user's `chốt luồng 3`: show eligible cached Google content and saved YUTA work immediately; retrieve the first batch after OWNER confirmation/continuation; allow OWNER/MANAGER visit-triggered stale refresh, `Actualiser`, requested older pages and eligible single-review recovery. Retrieval remains a separate provider operation with persisted evidence; no additional import-only screen is required.
- Retrieve up to 50 reviews per page ordered by provider update time, with `Voir plus d’avis` on demand. This is a page size, not a total workflow cap or Google permission to accumulate unlimited cached history. Show loaded coverage and truthful recent-batch freshness.
- Deduplicate by trusted scoped provider review identity while that mapping is permitted and available. Update the Google copy only; preserve local status, assignment, independently authored notes/drafts and history. Mark provider edits for review, keep remote replies separate from local drafts, and do not infer deletion from absence in a recent page.
- Preserve selection and unsaved input during retrieval. Distinguish never performed, pending, error, successful empty, usable partial coverage, expired content, reconnect and unavailable-review outcomes. Failed retrieval does not advance successful freshness or become an empty result.
- Keep Google copies secure and temporary, with actual retrieval provenance and a deadline no later than 30 calendar days. Deny expired content and physically remove it without deleting independent YUTA work. Unfetched records do not receive a new deadline.
- Recover an expired review only with a still-permitted trusted reference and verified current binding. If such a reference is unavailable, retain the scoped local work and explain the missing Google content; do not promise perpetual exact linkage or an indefinite `reviewId` exemption.
- Keep pasted/quoted Google content subject to an explicitly verified provider-content contract. Do not classify all freeform text as independent or authorize blanket note/draft deletion. Sensitive Design must resolve feasible quotation/reference handling before dependent Apply; changed Product consequences return to Human review.
- Retain Google-only A, OWNER connector management, OWNER/MANAGER retrieval and assigned-only STAFF cached/local work. STAFF route opening, filters, notes and draft Save do not trigger provider retrieval. Add scoped tests and Browser QA only after the applicable Human gates.

## Capabilities

### New Capabilities

- `reputation/google-review-retrieval`: first retrieval, visit/manual refresh, requested pagination, conditional detail recovery, actor/resource authorization, scoped deduplication, persisted outcomes, provider/local separation, temporary content and physical cleanup.

### Modified Capabilities

- `backoffice/release-a-customer-exposure`: truthful retrieval/coverage/expiry states and separately eligible local work on Avis/Today/Integrations, preserving the five A surfaces and role/source constraints. Legacy unknown-provenance Google rows retain their existing authorized readability; retrieval does not silently adopt, re-date or purge them.

## Impact

- Runtime owner: authenticated `apps/backoffice`, server-only provider access. Persistence owner: `packages/db-cloud`. Transport owner: `packages/contracts`. Reuse existing Reputation UI and trusted cloud boundaries.
- Affected areas: Google client/orchestration, confirmed binding/continuation, Avis retrieval/presentation and shared read/mutation eligibility, Today queue projection, schema/repositories/migration, contracts/tests, current Reputation/Today and operations documentation. Sensitive Design defines the exact implementation allowlist.
- No new app/package/framework/public endpoint; no POS/Display/Booking/Direct Feedback changes, AI, reply approval/publication, scheduled provider synchronization, customer/production activation, global backup changes, lifecycle promotion, legacy/demo cleanup or remote Git operation.
- **Sensitive:** provider permitted use, personal review data, identifiers, quotation handling, persistence and physical cleanup require Human Specs and Design review. Product approval does not prove actual Google access or permit real-provider use.

### REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** `release-a-google-review-import`, latest decision `chốt luồng 3`, adopting immediate cached/local work, retrieval when needed, manual refresh, first page of 50 plus requested history, and retention of independent local work. This replaces the earlier separate-button-only proposal and its unapproved total-window/text-deletion options. RR-02/RR-03 retain the accepted A actor/queue constraints.
- **HARD_CONSTRAINTS:** `HUMAN_COLLABORATION`; actual Human approvals at applicable gates; `COMMIT_AFTER_TASK: YES`, isolated local commit on `main` after completion; trusted authorization/resource scope, secure temporary provider copies, physical cleanup and verified permitted use. No blanket local-work deletion, unrestricted quoted-text retention or permanent provider-reference promise.
- **OUT_OF_SCOPE:** the exclusions above. Exact stale interval is a Design decision; the supplied 15-minute value is an example. Provider permission, operational access, later gates and live activation are not granted by choosing this flow.
- **SUCCESS_OUTCOMES:** permitted users can continue saved work, retrieve first/recent/older coverage without duplicate or overwritten local work while permitted identity exists, and see truthful outcomes. Unauthorized actors cause no provider/storage effects. Expired Google copies disappear while independent local work remains available; conditional recovery and missing-reference fallback are honest. Checks/QA, permitted-use/access evidence and production readiness stay distinct.
```

## Exact analysis

```markdown
# Change Analysis

## Scope and Change Type

This is the Google retrieval/work-continuity slice of Release A, retaining the task name `release-a-google-review-import`. The current user selected `chốt luồng 3` after considering immediate cached work, retrieval when needed, manual refresh, history loading and retention of independent local notes/drafts. This supersedes the initial-import-only planning candidate; it is behavioral, UI/data-affecting, security-sensitive and external-provider-sensitive.

Task context remains `HUMAN_COLLABORATION`, `COMMIT_AFTER_TASK: YES`, local `main`, no push/deploy. Baseline: `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57`, 2026-10-01. Only existing Proposal/Analysis and Gate 1 evidence are revised. No implementation, schema generation, provider call, database activity or later artifact belongs to this gate.

### REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** latest actual user instruction `chốt luồng 3`, adopting the supplied flow and our explicit bounded assessment: immediate valid cache/local work, first retrieval after confirmed connection, visit-triggered retrieval when needed, `Actualiser`, up to 50 per page plus requested history, scoped duplicate handling, and preserved independently authored local work after Google expiry. Exact review restoration depends on permitted reference retention; copied Google text needs its own contract. RR-02/RR-03 remain controlling actor/source/queue boundaries.
- **HARD_CONSTRAINTS:** Human gate approval; server-trusted session/membership/scope/resource authority; no credentials in browser/evidence; secure temporary Google copies with actual cleanup; preserve independent local work without a blanket exemption for quotations or identifiers. Completed isolated local commit on `main` only.
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

The following precise role application is proposed for current Human Gate 1 review:

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
11. Quotes/API-derived content do not become independent merely because pasted into a note/draft. No whole-note deletion or unrestricted quoted-text persistence is authorized. Sensitive Design must establish feasible classification/handling before dependent implementation; if its outcome changes local-work UX/retention, return to Human Product review rather than decide silently.

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

| Slice                              | Product decision                                                   | Implementation                                          | Environment                       | Production / dependency                                    |
| ---------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| A Google retrieval/work continuity | Flow 3 selected; exact bounded candidate awaiting Human Gate 1     | NOT_STARTED                                             | UNVERIFIED                        | BLOCKED; actual provider permitted-use/access not verified |
| Connector foundation               | Existing RR-02 A exception                                         | OAuth/discovery/binding implemented                     | UNVERIFIED                        | Source is not live eligibility proof                       |
| Inbox/Today                        | Existing bounded A plus proposed separate work/content eligibility | Current scopes; retrieval/expiry/work separation absent | UNVERIFIED outside dated evidence | No promotion                                               |

The registry's broad Google rows and older synchronization narratives do not replace the current A decision or source reality. No maturity, lifecycle, rollout or provider readiness is promoted.

## Requirement Readiness

`READY_FOR_SPECS`

Precise bounded Product specs can be written for the selected flow, scoped role proposal, independent-work retention, conditional recovery and explicit unavailable-reference fallback. This conclusion is not Human Gate 1 approval, permission for unrestricted quotes/references, implementation readiness or real-provider authorization.

GI-05/GI-07/GI-08 remain separately enforced Design/provider-use blockers below. Specs must carry their conditional limits. If Design cannot meet them without changing Product behavior, stop the dependent Apply and return to Human review; do not treat a generic later PASS as resolving them. `skip_specs: true` is inappropriate.

## UI / UX Applicability

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Reuse existing French Backoffice components/semantic tokens on Integrations, Avis and Today. Cover first visit, usable cache/work, pending, stale refresh, load-more coverage, edit notice, zero/error, expired/missing Google content, conditional recovery, reconnect and unauthorized actions. Desktop/mobile keyboard/focus and in-progress editing continuity require later QA. No shell redesign, new UX artifact or sealed-pack rewrite.

UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE

Reason: a functional provider/work-lifecycle change using current UI patterns, without an external visual-design question.

Scope: first retrieval, visit/manual update, requested history, conditional detail recovery and work continuity on the existing A surfaces.

Decision source: latest user-selected flow plus repository UI rules; precise candidate awaiting Human Gate 1.

## Conflicts and Unknowns

| ID      | Classification                               | Bounded disposition                                                                                                                                                                                                        | Required boundary                                                                                                                             |
| ------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| GI-03   | Product resolved                             | User selected 50 per first/requested page plus on-demand history; no total work cap or safe-cache-volume claim.                                                                                                            | Carry into Specs; cache minimization/operations stay reviewed separately.                                                                     |
| GI-04   | Product resolved                             | Preserve independent local work and authored text; expire provider copies. Earlier wholesale attached-text expiry proposal was unapproved and superseded.                                                                  | No automatic whole-note/draft purge.                                                                                                          |
| GI-05   | NEEDS REVIEW: real-provider eligibility      | Actual project/location access, permissible cache/use quantity and secure cleanup/backup/restoration contract are unverified.                                                                                              | Required before real-provider data use; Product/synthetic checks are insufficient.                                                            |
| GI-06   | NEEDS REVIEW: sensitive Design               | Role grant seam, freshness threshold, field minimization, cursor/binding concurrency, scoped identity/conflicts, receipt/transaction, cleanup reliability and content-free audit/logging.                                  | Resolve inside accepted Product scope before Apply; material scope changes return to Human.                                                   |
| GI-07   | NEEDS REVIEW: quoted/freeform Google content | Retain independent authored work; no blanket exemption for quotations, derived content or pasted API text and no whole-note deletion. Handling remains unimplemented and unverified.                                       | Concrete feasible provider/text-retention contract required before dependent Apply; no silent deletion or indefinite retention fallback.      |
| GI-08   | NEEDS REVIEW: provider reference lifetime    | No published indefinite reviewId exemption verified. Exact recovery/deduplication requires a still-permitted trusted identity; missing identity shows preserved local work + Google unavailable, without guessing linkage. | Design defines reference expiry/cleanup and missing-mapping behavior. Longer retention needs separate verified provider authority before use. |
| GI-09   | Precise Gate 1 role proposal                 | OWNER first continuation/binding; OWNER/MANAGER visit/manual/page/detail retrieval; STAFF assigned cached/local work and handoff only.                                                                                     | Human Gate 1 reviews this application; the author's/helper's analysis grants no permission.                                                   |
| LANG-01 | Resolved instruction conflict                | OpenSpec context asks for Vietnamese; current user root instructions require English technical docs. French product copy/Vietnamese explanations retained.                                                                 | User instruction controls; do not alter config or history.                                                                                    |

The deadline concerns the fetched copy, not the age of the original review. No completed page refresh renews all historical copies. No note edit or restoration renews provider-content lifetime.

## Analysis Conclusion

`READY_FOR_SPECS`

The revised bounded candidate supports `reputation/google-review-retrieval` and `backoffice/release-a-customer-exposure` after valid Human Gate 1 approval on exact hashes. The former replaces the proposed, never-created `reputation/google-review-initial-import` capability name because the adopted scope includes refresh/history/recovery.

Record the old pending `BLOCKED_NEEDS_REVIEW` candidate and its check history inside the existing Gate 1 evidence as superseded by authorized flow revision, never as previously approved. No Specs, Design, Tasks, implementation, provider use, cleanup, sync, archive, staging or commit is authorized at this pending gate.
```

## Recommendation and Human boundary

Approve this exact revised Proposal/Analysis candidate to permit creation of the two declared delta Specs and a fresh Gate 2 review. Changes requested must name the bounded adjustment; revised hashes need review again. Do not implement, call Google, modify data/cleanup, sync/archive or commit while Gate 1 is pending.

## Superseded candidate history

Disposition: `CHANGES_REQUESTED` for the earlier pending candidate, then replaced through the explicit `chốt luồng 3` revision authorization. It was never approved. Earlier analysis `BLOCKED_NEEDS_REVIEW`, GI-03/GI-04 proposals and original formatting FAIL/repaired PASS remain historical evidence.

Original packet SHA-256 before revision: `f7f058f2ec396152736b3876e627186398f2a1a18fa7eebc9a4938256f0c3b30`. Before revision, all six recorded hashes and both exact artifact embeddings matched. Below is the complete superseded packet text, with line endings normalized for inclusion; its old current-status/identity statements are historical only.

````text
```text
Change: release-a-google-review-import
Gate: 1 — Proposal / Analysis
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-10-01
Schema: yuta-spec-driven
Analysis conclusion: BLOCKED_NEEDS_REVIEW
Sensitive change: YES
COLLABORATION_MODE: HUMAN_COLLABORATION
MODE_SELECTION_SOURCE: actual current-user named-task intake, HUMAN_COLLABORATION — Codex chuẩn bị, bạn duyệt các gate
COMMIT_AFTER_TASK: YES
COMMIT_SELECTION_SOURCE: actual current-user named-task intake, YES — commit local khi task hoàn tất
Commit destination: local main after requested completion obligations
Approval source: NONE — actual Human Gate 1 decision required
Workflow state: AWAITING_HUMAN_PRODUCT_ANSWERS
```

## Request, accepted choices and bounded candidate

The current user authorized the next `release-a-google-review-import` slice, selected Human collaboration and local commit after completion on `main`, then chose exactly `đồng ý nút riêng và lưu tạm`. This accepts a separate OWNER initial-import button and temporary Google cache capped at 30 days. It does not approve an all-history limit, deletion of local text, real-provider eligibility or a workflow gate.

Clean starting checkout: `main`, HEAD `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57`, aligned with `origin/main`. Current candidate consists only of new change metadata, Proposal, Analysis and this review packet. No existing file, code, schema, migration, environment, database, service or historical evidence was changed. Discovery helpers were read-only; they are not approvers. No independent verdict replaces the Human in this mode.

The new capability is `reputation/google-review-initial-import`; the modified capability is `backoffice/release-a-customer-exposure`. Existing role, cloud/tenant, Google-only A and source ownership boundaries remain. No implementation, Specs, Design, Tasks, provider calls, runtime QA, sync, archive, staging, commit, push or deploy follows from this packet.

## REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** initial Google review import for Release A; separate OWNER button after verified binding; temporary content at most 30 days; expiry and local draft/note consequences must be presented before implementation. RR-02/RR-03 retain A scope and existing role/queue boundaries.
- **HARD_CONSTRAINTS:** actual Human approvals; server-trusted session/membership/scope and provider resource authority; no secret exposure; physical cleanup plus expiry denial; no implicit local-text destruction; completed isolated local commit on `main` only.
- **OUT_OF_SCOPE:** refresh after first success, scheduled provider sync, reply publication/approval, AI, other providers, DIRECT/local products, public entry, production activation, backup topology changes, lifecycle promotion, legacy/demo cleanup and remote Git operations.
- **SUCCESS_OUTCOMES:** approved initial coverage with persisted truthful zero/error/success; no unauthorized effects; no duplicates or loss of local work during replay; Avis/Today eligibility agrees; approved temporary lifecycle is enforced; technical/synthetic and real-provider evidence remain separate.

## Product questions and exact consequences

| ID    | Previous accepted content                                                  | Proposed new content                                                                                                                                                 | Why needed now / scope and impact                                                                                                                                             | Alternatives and approval boundary                                                                                                                                                        |
| ----- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GI-03 | Separate initial import; no approved numerical history limit               | Up to **50 reviews most recently updated at Google**; clearly indicate a bounded subset if more remain; never claim all-history import                               | Google allows only limited temporary cache, without naming a numeric safe amount. Coverage changes what the customer sees and how success is described                        | Human may choose 50 or specify another coverage. Any amount still needs permitted-use review; 50 is not Google approval.                                                                  |
| GI-04 | Temporary Google content; **no authority to delete local draft/note text** | Conservative proposal: attached draft/note bodies expire with the Google content, by the same 30-day deadline; preserve only approved minimal YUTA workflow metadata | Notes/drafts can quote Google content. Whole-review deletion currently cascades to all replies/notes. This is customer work loss and must not be inferred from cache approval | Alternative: keep local drafts/notes after provider content expires; resolve permitted quotation/derived-content retention before relevant Specs/use. No indefinite exemption is assumed. |

Neither row is adopted. This packet requests explicit answers and permission to revise Proposal/Analysis accordingly. A generic “approved” cannot unblock `BLOCKED_NEEDS_REVIEW`. After authorized revision, Codex must generate a fresh exact Gate 1 packet; that packet still needs Human approval before Specs.

GI-05 (actual project access, verified location, permitted content/use and backup/restoration retention) remains a provider/privacy/operations prerequisite before real data use. GI-06 (field minimization, binding/identity conflict handling, transaction/receipt, cleanup implementation and content-free audit/logging) belongs to sensitive Design inside approved Product choices. No global backup changes or new runtime topology are requested.

## Authorities and conflicts

Controlling Product sources: current user's exact task decisions and the accepted A exception in `docs/PRODUCT_RELEASE_ROADMAP.md`, Reputation and Today homes. Specific observable compatibility authority: current exposure and draft-pending main specs. Runtime/security/data authority: root/scoped instructions, Authority Model and cloud/tenancy/authentication architecture. The exact consulted sources are linked in Analysis below.

Official sources fetched 2026-10-01: [Google API policies](https://developers.google.com/my-business/content/policies), [reviews.list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list), [Review resource](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews). Provider constraints include a limited secure temporary cache, a 30-calendar-day maximum and restrictions on content manipulation/aggregation. The numeric window and local-text treatment above are YUTA proposals, not compliance findings or project-specific permission.

- `NEEDS REVIEW`: GI-03 and GI-04 block requirement readiness; GI-05 blocks real-provider use; GI-06 requires sensitive Design.
- `LANG-01`: OpenSpec context requests Vietnamese artifacts; the current user-supplied root AGENTS requires English technical documentation. Higher-priority user instructions control this candidate. No config/historical artifact repair is performed.
- Broad registry/lifecycle narratives do not override the current A-only decision or turn the absent importer into implemented/live behavior. No lifecycle promotion or broad V1 resolution.

UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES; UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE (functional existing-pattern change, proposed for Human review). Sensitive Gate 2b is required after valid prior gates.

## Current exact identities

Commands: `Get-FileHash -LiteralPath <path> -Algorithm SHA256`; exact raw file bytes, lowercase hexadecimal, sorted paths. Review evidence is not self-hashed. Recheck exact artifact path-set and hashes before accepting any later decision. Authority hashes record the consulted baseline and are not approval of those sources' unrelated scope.

### Planning artifacts

| Path                                                           | SHA-256                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/release-a-google-review-import/.openspec.yaml | edbcd0b0cb2d4619b326f4293e56c1d31f5ce6be37dda83923ff58267b46f1ab |
| openspec/changes/release-a-google-review-import/analysis.md    | 24d4d4675858e8b0f35c7bbed071a6d2d1c4f42a0af8b303efe8103d64ed233e |
| openspec/changes/release-a-google-review-import/proposal.md    | ccc8bb3befa5910fbfadcf9d3dd0ced177b1c1cf3b1f5f01bd171e8a4eefeffe |

### Controlling source snapshot

| Path                                                          | SHA-256                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/features/reputation/README.md                            | 2e2d14e33698bb667d1ea6f140930c1a593d65ee927ce7c4470b7187cd6f303c |
| docs/PRODUCT_RELEASE_ROADMAP.md                               | 8ebdc933ad5ae363b0c438193e8a029686186bee82a8d0961d3f5c62034279ee |
| openspec/specs/backoffice/release-a-customer-exposure/spec.md | b3e726a1f6102e399b8a319a72570610898028b21074ff7e1472afae53c379db |

## Check results and evidence limits

- `pnpm docs:check`: PASS, 36 current documents.
- `pnpm architecture:check`: PASS, runtime imports, database URLs, client boundaries and migration baselines.
- `pnpm -r --if-present typecheck`: PASS, every workspace package with a typecheck script completed.
- `pnpm format:check`: initial FAIL, solely formatting of this newly generated review packet; exact-path formatting repair followed. Protected-artifact preservation passed for 67 paths.
- Final full formatting rerun: PASS.
- Packet integrity: all six recorded hashes match; Proposal and Analysis are embedded exactly; no Specs exist.
- OpenSpec: actual pinned schema `yuta-spec-driven`, Proposal/Analysis done (2/5). Raw CLI offers Specs; YUTA operational state remains BLOCKED_NEEDS_REVIEW at Human Gate 1.

No application/provider/database tests, builds or Browser QA ran at this planning gate. No existing-runtime restart, provider call, environment/secret inspection or schema generation occurred. Strict change validation is deferred because Specs are absent and Analysis is blocked; raw CLI readiness is not YUTA gate permission.

## Exact proposal

```markdown
## Why

Release A accepts Google review handling, but the repository currently stops at OAuth and an explicitly verified account/location binding. An empty inbox cannot establish that an import succeeded, and the existing durable review model does not enforce temporary provider-content storage.

## What Changes

- Add a separate OWNER-only `Importer les avis` action after server-verified Google binding, including an entry for an already-bound establishment and retry after an unsuccessful initial attempt. Binding alone does not import. Post-success manual refresh remains a later change.
- Read reviews through the existing server-only credential boundary, validate provider responses, and persist a scoped initial-import outcome. Distinguish not performed, failure, completed-empty, completed-with-reviews and expired content; never infer these from a redirect, seed data or connection status.
- Introduce temporary Google content with explicit provider/binding provenance, fetch time and a deadline no later than 30 calendar days after retrieval. Separate its lifecycle from YUTA workflow identity. Read denial at expiry and physical cleanup are both required; the cleanup does not fetch Google reviews.
- Preserve organization/establishment/actor authorization, assigned-only STAFF access, Google-only A projections, local workflow changes and provider/local reply separation. Reject stale-binding results and cross-establishment identity conflicts.
- Present two unresolved Product choices at Gate 1: the amount of history cached initially and the lifecycle of attached draft/note text. The bounded-window proposal is up to 50 reviews ordered by most recent provider update, explicitly labeled as a subset if more exist. The conservative text-retention proposal expires attached draft/note bodies with the Google content while preserving minimal workflow metadata. Neither proposal is approved by the user's cache choice.
- Add implementation tests and candidate Browser QA after applicable Human gates. Real-provider use additionally requires verified access and a permitted storage/use/backup contract; synthetic evidence does not substitute for them.

## Capabilities

### New Capabilities

- `reputation/google-review-initial-import`: explicit initial-import authorization, verified binding, provider response validation, bounded coverage, deduplication, persisted outcomes, temporary content, expiry/cleanup and failure recovery.

### Modified Capabilities

- `backoffice/release-a-customer-exposure`: integrate truthful persisted import/expiry states and the approved temporary-content eligibility rules into Avis/Today/Integrations without changing the five A surfaces or existing role constraints. Legacy stored Google records remain readable under their existing scope with unknown import provenance; they are not silently adopted or purged by this importer.

## Impact

- Runtime owner: authenticated `apps/backoffice`; provider adapter stays server-only. Persistence owner: `packages/db-cloud`; transport outcomes: `packages/contracts`. Reuse existing Reputation UI and the cloud boundary.
- Affected delivery areas: Google client/orchestration, integration action/presentation, Reputation read/mutation eligibility, schema/repositories/new migration, contract/test seams, existing Reputation/Today Product homes and operations documentation. The exact implementation allowlist belongs to sensitive Design review.
- No new package, app, independent service, provider, UI framework, or public data endpoint. No POS/Display/Booking/Direct Feedback data changes, AI, reply publication, post-success refresh, scheduled provider sync, production activation, lifecycle promotion or remote Git operation.
- **Sensitive:** external-provider contract, customer review data, persistence and potentially destructive text cleanup require Human Specs and Design review before implementation.

### REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** implement `release-a-google-review-import` as the next Google Release A slice. The current user's exact shaping decision is `đồng ý nút riêng và lưu tạm`: separate OWNER import button and temporary Google content, maximum 30 days, with the expiry and draft/note consequences presented before implementation. RR-02/RR-03 supply the existing A/role/queue boundaries.
- **HARD_CONSTRAINTS:** `HUMAN_COLLABORATION`; actual current-user approvals at applicable gates; `COMMIT_AFTER_TASK: YES`, local commit on `main` only after completion. Trusted server scope/resource authority, existing permission/entitlement checks and provider permitted-use conditions remain prerequisites. This planning gate authorizes no runtime or destructive operation.
- **OUT_OF_SCOPE:** the exclusions above; production/provider enablement, backup configuration changes and cleanup of legacy/demo rows are not implied. A Product answer is not Google permission or approval of later gates.
- **SUCCESS_OUTCOMES:** an authorized OWNER can explicitly initiate the approved initial coverage; unauthorized actors cause no provider/storage effects; successful and zero/error outcomes have persisted evidence; replay does not duplicate or overwrite local work; Avis/Today agree on actor/source/content eligibility; imported content expires and is physically removed through the approved lifecycle; tests/QA and real-provider evidence are reported separately.
```

## Exact analysis

```markdown
# Change Analysis

## Scope and Change Type

This is the initial Google import slice of Release A, following completed customer-exposure work. It is behavioral, UI-affecting, data-affecting, security-sensitive and external-provider-sensitive. The separate OWNER action and temporary cache direction are accepted; the initial coverage limit and attached-text lifecycle remain Product choices. No implementation, schema generation, provider calls or database activity belongs to this gate.

Task context: `HUMAN_COLLABORATION`; `COMMIT_AFTER_TASK: YES`; local `main`; no push/deploy. These choices come from the current user's named-task intake, not the preceding exposure task. Baseline: clean `main` at `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57` on 2026-10-01.

### REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** implement the next initial Google review import slice. Exact shaping decision: `đồng ý nút riêng và lưu tạm`. Use a separate OWNER button after verified binding and temporary provider content with a maximum 30-day lifetime; present expiry and draft/note consequences before implementation. [RR-02/RR-03](../../../docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions) retain Google-only A and the accepted actor/queue rules.
- **HARD_CONSTRAINTS:** real Human approval at each applicable gate; trusted server session/membership/scope and verified provider resource authority; no provider credentials in browser/evidence; temporary cache and physical cleanup; all existing cloud/local boundaries. Commit only isolated completed task changes locally on `main`. New quantity/text-retention choices are proposals, not implied approvals.
- **OUT_OF_SCOPE:** post-success manual refresh, scheduled Google sync, approve/publish, AI, other providers, Direct Feedback changes, new public entry, customer/production activation, backup topology changes, lifecycle promotion, legacy/demo deletion and remote Git operations.
- **SUCCESS_OUTCOMES:** authorized explicit initial import with approved coverage and persisted zero/error/success evidence; no unauthorized provider/database effect; idempotent replay without losing local work; consistent scoped Avis/Today; content expiry and actual cleanup through the approved lifecycle; truthful separation of synthetic verification and real-provider acceptance.

## Sources Consulted

- Instructions and authority: [root instructions](../../../AGENTS.md), [Backoffice](../../../apps/backoffice/AGENTS.md), [db-cloud](../../../packages/db-cloud/AGENTS.md), [contracts](../../../packages/contracts/AGENTS.md), [docs index](../../../docs/README.md), [current state](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- Product/behavior: [release roadmap](../../../docs/PRODUCT_RELEASE_ROADMAP.md), [Reputation home](../../../docs/features/reputation/README.md), [tracker](../../../docs/features/reputation/STATUS.md), [Today home](../../../docs/features/today/README.md), [exposure spec](../../specs/backoffice/release-a-customer-exposure/spec.md), [draft pending spec](../../specs/reputation/reply-draft-pending-feedback/spec.md).
- Boundaries: [database ownership](../../../docs/architecture/DATABASE_BOUNDARIES.md), [tenancy](../../../docs/architecture/TENANCY.md), [authentication](../../../docs/architecture/AUTHENTICATION.md).
- Implementation: [Google adapter](../../../apps/backoffice/src/server/reputation/google-business-profile-client.ts), [token accessor](../../../apps/backoffice/src/server/reputation/google-connector-access.ts), [selection action](<../../../apps/backoffice/src/app/(authenticated)/parametres/integrations/actions.ts>), [selection UI](<../../../apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx>), [setup summary](../../../apps/backoffice/src/server/reputation/release-a-setup.ts), [schema](../../../packages/db-cloud/src/schema/reputation.ts), [repository](../../../packages/db-cloud/src/reputation-repository.ts), [transport](../../../packages/contracts/src/reputation/index.ts).
- Inspected test seams: [setup-loader tests](../../../apps/backoffice/test/release-a-reputation-loaders.test.tsx), [Google security tests](../../../apps/backoffice/test/google-connector-security.test.ts), [integration tests](../../../packages/db-cloud/test/reputation-repository.integration.test.ts), [exposure denial tests](../../../packages/db-cloud/test/reputation-release-a-exposure.integration.test.ts).
- UI: [UI guide](../../../docs/ui/README.md), [shared rules](../../../docs/ui/YUTA_FRONTEND_RULES.md), [Backoffice rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [Today pack](../../../docs/ui/pages/today/README.md), [external advisory policy](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- Official provider sources, fetched 2026-10-01: [API policies](https://developers.google.com/my-business/content/policies), [reviews.list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list), [Review resource](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews). These define constraints and API behavior; they are not project-specific Google approval.

## Authority and Product Decision

RR-02 accepts Google for A, OWNER connector management, assigned STAFF read/note/draft and later OWNER/MANAGER refresh/publication. RR-03 requires truthful setup/import outcomes and a Google local handling queue. Broader `AVIS` questions outside this exception remain unresolved.

The current user accepted the separate button and temporary-storage direction only. They did not approve a numerical history limit, deletion of drafts/notes, provider eligibility or Gate 1. The proposals below require specific answers before precise specs can be written.

Google's current content-storage policy permits only limited performance-oriented temporary storage, capped at 30 calendar days, with secure storage and restrictions on manipulation/aggregation. The policy does not define a numerical safe amount or exempt local text quoting provider content. Choosing 50 or separating workflow does not establish Google compliance. The API offers paginated reviews for verified locations, at most 50 per page, ordered by provider update time by default. A page-size limit is not permission to cache an entire history indefinitely.

## Current Implemented State

- OAuth, encrypted tokens, refresh and account/location discovery exist. Selection checks accessible server-discovered resources before persisting the binding. Reviews are not fetched or imported.
- Integrations and connector management are OWNER-only. There is no import operation contract. A separate button can serve an already-bound location; a bind-only trigger misses existing bindings and same-location reconnects because selected cards hide their bind form.
- The schema mixes provider content with workflow fields. It lacks enforced content expiry and location provenance. `lastSyncedAt` and demo rows do not prove an actual import. `updatedAt` can change during local edits and cannot define content lifetime.
- The uniqueness key is organization/source/external ID. Imported review identity must be stable and must not reassign another establishment's record on conflict. A rebind during fetching must invalidate the result; current selection does not reset prior timestamps/data.
- Existing list/detail/mutations enforce organization, establishment, Google restriction where applicable, and assigned-only STAFF access. They do not check content expiry or current Google binding. Imported-content eligibility must also apply to every shared consumer, including internal mode, without changing Direct Feedback.
- Deleting `feedback_items` cascades to replies and notes. Therefore physical cleanup of the whole review is a destructive local-work decision, not an innocent cache implementation detail. Text-only cleanup versus full deletion must follow the chosen Product outcome.
- Draft Save is local and does not publish. Existing local `PUBLISHED` state cannot represent a fetched Google reply. The minimal import must not synthesize local publication/approval; any remote reply display would require an explicit read contract and remains deferred here.
- Setup copy currently states that import is unavailable. Existing stored legacy Google rows remain readable with unknown provenance; do not silently claim ownership, re-date, adopt or purge them through this import.

Tests were inspected only. No current provider access, project approval, configuration, verified review eligibility, import, database integration or Browser QA was exercised. Historical exposure QA used synthetic data and cannot establish these facts.

## Affected Boundaries

- **Runtime/data:** Backoffice server orchestrates; db-cloud persists; contracts transport minimized serializable outcomes. POS, Site Agent, Display and public Booking/Feedback ownership are unchanged.
- **Authorization:** import is OWNER-only under existing connector authority and valid Reputation prerequisites. Browser resource/scope values are not trusted. Denial must precede token/provider/persistence access. Read/note/draft grants and STAFF assignment remain unchanged for eligible records.
- **Provider/privacy:** content, author/rating/timestamps, identifiers, cache copies, logs/audits and quoted local text need explicit retention classification. Deadline checks alone cannot remove persisted content; unattended cleanup is necessary and is distinct from scheduled provider synchronization. Backups/PITR/restoration must not silently resurrect expired content. No global backup configuration change is authorized.
- **Projection:** Today remains a minimized consumer of Reputation local handling state. Cache window coverage must not be presented as total Google history or remote response metrics. This analysis establishes no permission for aggregating Google content.
- **Normative compatibility:** modify the exposure spec's Google read/mutation/Today/setup eligibility for importer-owned temporary content. Preserve unknown-provenance legacy rows, five surfaces, internal module availability, DIRECT isolation and unconditional denials. Draft pending behavior remains unchanged for eligible forms; no delta is needed for its labels/busy semantics.

## Lifecycle Baseline

| Slice                         | Product decision                                                            | Implementation                                         | Environment                       | Production / dependency                             |
| ----------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------- | --------------------------------------------------- |
| A initial import              | Direction and trigger/cache accepted; exact coverage/text lifecycle pending | NOT_STARTED                                            | UNVERIFIED                        | BLOCKED; provider/permitted-use/access not verified |
| Existing connector foundation | RR-02 accepts A use; broader V1 remains separate                            | IMPLEMENTED for OAuth/discovery/binding                | UNVERIFIED                        | BLOCKED; source is not live access proof            |
| Existing inbox/Today          | Accepted bounded A behavior                                                 | Existing implementation; no importer provenance/expiry | UNVERIFIED outside dated evidence | No promotion from this planning change              |

The Module Registry's broad Google rows and the Lifecycle Model's older synchronization example do not replace the more specific A decisions or current implementation evidence. Preserve those documents; no lifecycle normalization is performed.

## Requirement Readiness

`BLOCKED_NEEDS_REVIEW`

The current accepted direction is sufficient to create this bounded proposal, but not to specify the two customer-visible decisions below. A generic approval word cannot resolve them. After explicit answers authorize revising Proposal/Analysis, regenerate the exact Gate 1 packet and obtain Human approval before Specs. `skip_specs: true` is inappropriate because this changes observable behavior.

## UI / UX Applicability

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Reuse current French Backoffice components and semantic tokens on Integrations/Avis/Today. Cover pending, forbidden, no binding, never run, retry/error, successful zero, limited coverage, usable content, expiry and recovery; desktop/mobile keyboard/focus coverage is required. The Today pack's internal reference does not define the new A import behavior. No shell redesign or sealed-pack rewriting is proposed.

UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE

Reason: a functional provider/retention change using existing UI patterns; no external visual-design question.

Scope: initial import and truthful cache/outcome presentation on the existing A surfaces.

Decision source: current bounded request and repository UI rules; proposed for Human Gate 1 review.

## Conflicts and Unknowns

| ID      | Classification / question                                                | Concrete proposal and consequence                                                                                                                                                                                                                                                                                                               | Required disposition                                                                                                            |
| ------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| GI-03   | NEEDS REVIEW: how much history is included initially?                    | Cache up to 50 reviews ordered by most recent Google update, with a visible subset indication when more remain. This is a new limit, not all-history completion. Zero is valid only when Google actually returns no reviews for the verified binding.                                                                                           | Human chooses this window or specifies another coverage; no silent cap.                                                         |
| GI-04   | NEEDS REVIEW: retain attached draft/note text after Google cache expiry? | Conservative option: expire Google content and attached draft/note bodies together by the cache deadline, retaining only approved minimal YUTA workflow metadata. This loses local text. Alternative: retain local drafts/notes; permitted quotations/derived content and retention need provider/privacy review before the relevant specs/use. | Human chooses the desired Product outcome. No local-text deletion or indefinite exemption is currently authorized.              |
| GI-05   | NEEDS REVIEW: project access and permitted cache/use/backup behavior     | Real-provider use requires dated proof for the actual project, verified location and storage/use/backup lifecycle. Neither Product approval nor synthetic tests supplies it.                                                                                                                                                                    | Provider/privacy/operations prerequisite before real data use; not a request to change global backups.                          |
| GI-06   | NEEDS REVIEW: technical implementation details                           | Provider field minimization; stable identity; concurrent bind/token fencing; same Google location bound to another establishment; import transaction/receipt; deadline calculation and cleanup reliability; non-content audit/log policy.                                                                                                       | Sensitive Design must resolve these inside approved Product boundaries before Apply. No schema/table/job layout is chosen here. |
| LANG-01 | Resolved instruction conflict                                            | OpenSpec context requests Vietnamese artifacts; the current user-supplied root AGENTS requires English technical documentation. Use English artifacts, French product copy and Vietnamese user explanations.                                                                                                                                    | Higher-priority user instruction controls; do not edit config or historical artifacts.                                          |

The deadline is a limit on the fetched copy, not a filter to reviews authored within the last 30 days. Local editing/retry/restore must not silently extend an old fetched copy's lifetime. After the first successful import, this task supplies no refresh; expiry recovery must truthfully explain that later refresh delivery remains separate.

## Analysis Conclusion

`BLOCKED_NEEDS_REVIEW`

Prepare only the exact Proposal/Analysis Gate 1 packet. GI-03 and GI-04 require Human Product answers and an authorized artifact revision before Specs; GI-05 remains a real-provider prerequisite and GI-06 belongs to sensitive Design. The proposed capability paths remain `reputation/google-review-initial-import` and `backoffice/release-a-customer-exposure`. No Specs, Design, Tasks, implementation, destructive cleanup, provider use, main-spec sync, archive or commit is authorized at this pending gate.
```

## Recommendation and stop boundary

Resolve GI-03 and GI-04 explicitly and authorize the bounded artifact revision. Preserve BLOCKED_NEEDS_REVIEW until a revised candidate supports READY_FOR_SPECS. Obtain Human Gate 1 approval on the revised exact hashes before creating Specs. Commit preference remains sticky and unexercised until task completion.
````

`````
