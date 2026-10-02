```text
Change: release-a-google-review-import
Gate: 2b - Sensitive Design
Review status: APPROVED
Created: 2026-10-01T19:07:44.848Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
COLLABORATION_MODE: CODEX_ONLY
COMMIT_AFTER_TASK: YES
Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Workflow state: REVISED_DESIGN_APPROVED_CONTINUE_TASKS_APPLY
```

## Independent revised sensitive approval

Reviewer /root/google_import_gate2b_revised returned APPROVED with no material findings on exact pending packet 29a20bd071721818fe67eb09a699f7d08138e8b6be71e45d78861a8cb3014ebd and Design acb5dcb44f897997863004c5199a7eeaf0ed54523f358c8dee9069c608e2d19d. Final reviewer identity check 2026-10-01T19:11:02.9341686Z; author rechecked all current earlier and candidate rows before recording at 2026-10-01T19:11:40.737Z. Approval is Design only, permitting Tasks and bounded source/synthetic Apply; no actual provider use or production action.

Recommendation: CONTINUE_TASKS_AND_BOUNDED_APPLY.

## Authority and exact scope

Actual Human chose freeform user notes/drafts and separate automatic Google cache, then instructed implementation. The same task has CODEX_ONLY delegation and local main COMMIT_AFTER_TASK YES after full completion. Revised Gates 1 and 2 are independently APPROVED; they do not approve this Design. No Tasks or source implementation exists. This gate reviews source/synthetic design only; no actual Google use, permanent identifier exception, publication, activation, deployment or production operations.

D1-D9 implement stable local work, separate temporary content/reference storage, actor/session/binding fences, requested one-page retrieval, persisted outcomes, editing continuity and a machine-authenticated bounded cleanup route. Existing freeform Save validation and user-input bodies remain untouched by provider operations. All real-provider prerequisites remain mandatory; new review retrieval defaults disabled before token/provider access. Only exact server setting true admits the path after separate verified environment authority. Cleanup has independent machine authentication. The proposed 29-day content buffer and at-most-30-day temporary reference are bounded deadlines, never a permanent ID exemption. Additive migration only after approval; no legacy adoption or purge.

## Scope and evidence limits

Exact allowlist, migration strategy, rollback, guarded synthetic DB on 127.0.0.1:54339, isolated browser app copy and strict process-only fetch fixtures are in Design below. Preserve existing QA DB 54329 and all user runtimes. Actor/session/binding races, expired-field masking across queries, content-only cleanup, copied freeform input and legacy/DIRECT compatibility require real persisted synthetic evidence later. No source/tests/build/QA are claimed here. Current strict OpenSpec validation, docs and architecture checks passed in this planning revision; focused formatting passed. Historical GI-07 BLOCKED and prior approvals remain below and do not govern the revised candidate. GI-05/GI-08 actual provider/use and operations remain unresolved for real data and enforced through D9.

## Current exact identities

Node crypto SHA-256 over raw file bytes, sorted paths. Earlier Gate 1/2 current source rows must match; historical embedded tables are preserved evidence, not current rows.

| Path                                                                                                 | SHA-256                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/release-a-google-review-import/01-analysis-review.md                                    | 44567dd42a690644a3225aa3c4afd228e654a44c777075d1ce85788e2b26a6e7 |
| docs/reviews/release-a-google-review-import/02-specs-review.md                                       | 6ab727218433203ed3f80ad6cfc791c58a98c3ed9aedd423acb34e44da1fb1d5 |
| openspec/changes/release-a-google-review-import/.openspec.yaml                                       | edbcd0b0cb2d4619b326f4293e56c1d31f5ce6be37dda83923ff58267b46f1ab |
| openspec/changes/release-a-google-review-import/analysis.md                                          | 99ce35d5324ef36d96706158940e2d33a36d42442e8914fffaa7080c8100aaa9 |
| openspec/changes/release-a-google-review-import/design.md                                            | acb5dcb44f897997863004c5199a7eeaf0ed54523f358c8dee9069c608e2d19d |
| openspec/changes/release-a-google-review-import/proposal.md                                          | 5ecaaf8176c0812c99e18bfb8a20b1b3057f8c6c634a3ca8cd51f46c4b96fa2f |
| openspec/changes/release-a-google-review-import/specs/backoffice/release-a-customer-exposure/spec.md | 5af09c087c4dc567e70320d20f952240094573a69a92e6a0894f734e2521fab8 |
| openspec/changes/release-a-google-review-import/specs/reputation/google-review-retrieval/spec.md     | c23135db729e2cc0819cd4e2fea597c4c197299a8efad89e47d00aaabd25b16c |

## Exact Design

```markdown
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
```

## Historical prior Gate 2b packet

Prior packet raw-byte SHA-256: b87d885238055516f16e8991957227641de6a2fe2824e0baf9d5726595434f37. Its GI-07 BLOCKED verdict remains true for that superseded exact candidate. Current Product revision invalidates its candidate applicability, without rewriting that history. Snapshot below normalizes CRLF to LF for display only.

`````text
```text
Change: release-a-google-review-import
Gate: 2b — Sensitive Design
Review status: INVALIDATED_BY_ARTIFACT_CHANGE
COLLABORATION_MODE: CODEX_ONLY
COMMIT_AFTER_TASK: YES
Approval source: NONE FOR CURRENT REVISION
Workflow state: AWAITING_REVISED_PRIOR_GATE
Invalidation recorded: 2026-10-01T18:54:56.066Z
```

## Current revision invalidation

Actual Human-approved freeform/cache direction changes reviewed Proposal/Analysis and their requirements. Prior approval/verdict is preserved below; it does not approve revised artifacts. Fresh sequential prior/own reviews are required. No Tasks or Apply.

| Artifact                                                    | Previously reviewed SHA-256                                      | Current SHA-256                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/release-a-google-review-import/proposal.md | 36e44c32654a027fe13290491b4e0bf12cfbdc1cbbe2ed2245b5716b68195414 | a29be39597e1adbe309315e9e12484cde012f4ad65029ac057c0f00d640df6b4 |
| openspec/changes/release-a-google-review-import/analysis.md | 3a469d3de814956f04bc983a76a9471be70af8a0f98f6ed7a80abd68aaa442f1 | 99ce35d5324ef36d96706158940e2d33a36d42442e8914fffaa7080c8100aaa9 |

## Historical prior packet

Prior raw-byte SHA-256: `8708f7498e524e5857c2a7da8999de0d372808d28a2f5e4bea66e4daea46a105`. Complete line-ending-normalized textual preservation:

````text
```text
Change: release-a-google-review-import
Gate: 2b — Sensitive Design
Review status: CHANGES_REQUESTED
Created: 2026-10-01
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
COLLABORATION_MODE: CODEX_ONLY
MODE_SELECTION_SOURCE: explicit current-user instruction, duyệt, đổi lựa chọn codex làm với tôi thành codex có thể làm 1 mình
COMMIT_AFTER_TASK: YES
COMMIT_SELECTION_SOURCE: actual current-user named-task intake, YES — commit local khi task hoàn tất
Approval source: NONE
Independent reviewer: /root/google_retrieval_gate2b_independent
Independent verdict: BLOCKED — unresolved GI-07 freeform quotation handling
Verdict recorded by: Codex workflow
Verdict recorded: 2026-10-01T18:05:27.3072269Z
Workflow state: BLOCKED_PENDING_GI07_CONTRACT_REVISION_AND_REVIEW
```

## Independent verdict — BLOCKED

Fresh-context read-only reviewer `/root/google_retrieval_gate2b_independent` returned **BLOCKED** on the exact candidate. One mandatory finding: GI-07 has no feasible selected handling contract. Design D8 leaves Q1/Q2 unselected and Q2 leaves pasted/mixed text unresolved, contrary to the approved requirement to resolve it before dependent implementation.

The reviewer confirmed the evidence seam: the input schemas/actions/draft and note repositories persist a single arbitrary string without authored/quoted provenance; submitter identity cannot resolve mixed-content retention. Obtain actual bounded Product/handling disposition and required provider/privacy authority, then review fresh Design bytes. Changed approved retention UX/requirements return to the affected earlier gate. No Tasks or partial Apply permission is granted.

No additional material core scope/authority drift was identified: storage separation, operation grants, binding fencing, temporary identity, content-only cleanup, rollback, work continuity, legacy exclusions and RR-02/RR-03 queue semantics were coherent. GI-05 remains separate actual-provider/cache/cleanup/backup evidence before live use.

Reviewed pending Gate 2b packet SHA-256: `5a858ca5d195c4dc73ebda5862ef0da6ae784ff0596e324a41f6b97c153aa0ba`. All nine candidate identities and eight supporting-source identities matched again before recording the verdict; both earlier artifact embeddings, both delta embeddings and the Design embedding were exact. No Tasks exist.

Current status is CHANGES_REQUESTED with an independent BLOCKED verdict, not approval. No auto-approval review rejection occurred; this is the named separate reviewer enforcing the approved mandatory contract.

## Subsequent Human Product direction — freeform work and separate cache

Recorded: 2026-10-01T18:42:49.7598245Z. Source: actual current-user instruction, `Hướng Product của bạn rõ rồi: giữ note tự do và tách cache Google -> đồng ý.`

The Human selects freeform notes with separately managed Google cache. This supersedes the need to ask the same UX choice again: retain the familiar authored-work inputs; do not make a new quotation editor or universal pasted-text detector a Product requirement. The application must keep automatically fetched Google content separate from durable local work rather than copy it into local note/draft bodies. The requested Product direction is received; a revised coherent handling contract and fresh affected reviews remain outstanding.

This is bounded Product direction, not Google permission, Sensitive Design approval or permission to preserve all API-derived copies indefinitely. The published provider/use conditions, unresolved long-term review-reference permission, historical independent BLOCKED verdict and reviewed artifact identities remain intact. Approved Proposal/Analysis/Specs and the exact unapproved Design below have not been rewritten by this annotation.

The user also asks a hypothetical retention question about a reply authored in YUTA and then published to Google. That question does not authorize implementing or performing publication. Its distinction for the pending revision is original locally authored saved work versus a `reviewReply` retrieved through the Google API. Provider-cache expiry is measured from actual retrieval and must not cascade-delete original local work or invoke remote deletion. The import task's existing publication exclusion remains unchanged.

No Tasks, Apply, provider/DB operation, gate approval or completion commit follows from this annotation. Next planning revision must reconcile the affected accepted requirements and obtain mode-defined fresh review rather than treat this record as an approved replacement contract.

### Supporting identities checked for this verdict

| Path                                                                          | SHA-256                                                          |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/actions.ts | 7e09be772e9a21658e3b377eb244f2ae932bdd0fc8f837ec56d3c9ba25c9d4b9 |
| docs/PRODUCT_RELEASE_ROADMAP.md                                               | 8ebdc933ad5ae363b0c438193e8a029686186bee82a8d0961d3f5c62034279ee |
| docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md                                        | 9a88ff5142567562779e783948ce8bcebfc16ae2ffa179bb2a94907e22298708 |
| docs/features/reputation/README.md                                            | 2e2d14e33698bb667d1ea6f140930c1a593d65ee927ce7c4470b7187cd6f303c |
| docs/features/today/README.md                                                 | 666315bc75371625bee357f94fc9a4fc5eb35af30e57b735615c79f88d4f8cd3 |
| packages/contracts/src/reputation/index.ts                                    | d0b67b273b94dfb9f262de9a133bdcbc69d65c86880d1fc6adf6a4447a0df752 |
| packages/db-cloud/src/reputation-repository.ts                                | 5a859833faa0848d6547d1ce51fce52e097453ae62e09115ff2f54f191ef000a |
| packages/db-cloud/src/schema/reputation.ts                                    | 3a5da535dda36c409092a3f25422c90bdc17bafab8c8cfbfa7f17da52884c02e |

Pre-review request language below is preserved candidate context. The exact current Design remains unchanged and unapproved; next revision requires the actual bounded decision and fresh independent review.

## Scope and gate authority

The actual Human approved [Gate 1](01-analysis-review.md) and prospectively selected CODEX_ONLY. Fresh-context reviewer `/root/google_retrieval_gate2_independent` approved [Gate 2](02-specs-review.md) on its exact identities. Review approval does not provide missing provider/Product authority.

This sensitive Design affects authorized external-provider access, scoped customer-review storage, physical cleanup, credentials/machine maintenance and independent local-work retention. It preserves local `main` at baseline `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57`, approved Proposal/Analysis/Specs and source/data ownership. No implementation, schema generation, migration run, DB/provider call, environment/secret inspection, service restart, Browser QA, staging/commit, sync/archive or remote operation has occurred.

The exact candidate is existing task planning plus `design.md` and this packet. No Tasks exist. The Design declares BLOCKED_BEFORE_TASKS_BY_GI_07; an independent reviewer must assess the actual boundaries and unresolved decision rather than approve an incomplete contract.

## Design summary and implications

- Retain independent work in its stable feedback parent. New importer-managed work stores provider fields/references in temporary scoped cache rather than durable parent fields; legacy rows default unmanaged and retain existing behavior.
- Add OWNER/MANAGER retrieval grant; keep connector OWNER-only and STAFF assigned cached/local-work-only. Capture binding generation/authorization before calls and fence them before atomic content/receipt commit. Network latency stays outside DB transactions.
- Use validated list/get, 50-sized requested pages, temporary opaque continuations and permitted scoped identity. Reject foreign/legacy conflicts, malformed responses and obsolete binding results. Missing mapping gives retained work + Google unavailable; no permanent/fuzzy linkage.
- Conditional cache checks apply across shared consumers/search/sort/projections. Proposed usable lifetime is 29 days, below the maximum, with independently timed fetched copies. Physical content-only cleanup preserves work/children and never fetches Google.
- A dedicated authenticated maintenance boundary in the existing Backoffice runtime rejects missing/wrong credentials before DB effects. It accepts no browser scope, enumerates due trusted scope pairs and purges bounded batches. A production secret/scheduler/backup change is not performed or delegated.
- Provider replies stay temporary and separate from local PUBLISHED/drafts. Receipts/logs retain minimized own outcomes, not raw provider content or secrets.
- Actual mounted Avis visits and manual actions use server stale checks; proposed stale interval is 15 minutes. Current work/input renders immediately and selection/typing is preserved. Today/prefetch/STAFF/local edits do not fetch.
- An additive cloud migration is proposed only after actual Design approval; existing SQL/data/legacy text remain unchanged. Rollback must preserve local work and cleanup and must not turn managed expired content into legacy-readable content.

Migration/rollback, risks, candidate owners/allowlist and later synthetic persisted/QA evidence are included in exact Design below. No new local runtime/app/framework, publication, AI or scheduled provider retrieval.

## Blocking Product/authority issue — GI-07

Current notes/drafts are a single arbitrary 1–4,000-character string with no authored/quoted provenance. Created-by identity, exact/fuzzy matching, hashes, clipboard controls or a checkbox do not prove independence or provide provider permission. The approved flow retains independent text but does not exempt all pasted Google content or permit a whole-note purge.

Design D8 presents two **unselected** bounded paths with exact old/new consequences:

| Path                                              | Customer impact                                                                              | Missing authority / consequence                                                                                                                                               |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1: retain current freeform UX                    | Familiar one-field notes/drafts remain                                                       | A feasible explicit permitted handling contract for copied/mixed content is still required before dependent Apply. No blanket exemption or whole-text expiry can be inferred. |
| Q2: separate temporary Google quotation/reference | Authored note/draft stays durable; a separate Google excerpt can expire without rewriting it | Changes input/retention UX and needs actual Human Product choice. It does not automatically solve pasted/mixed text in the authored field or prove Google compliance.         |

Concrete Q2 copy/placement proposal is in D8. No source classification control, silent Save rejection, partial text removal or whole-field expiry is selected. Core technical choices do not waive this blocker. If resolving it changes Specs, update only authorized planning scope and obtain fresh earlier review; never amend approved artifacts silently.

GI-05 actual project/location access, permitted cache/use amount, unattended cleanup and backup/restoration remain prerequisites before real-provider use. GI-08 permanent review identity is not assumed; Design chooses temporary references and truthful missing-mapping fallback. These are not compliance/readiness approvals.

## Exact reviewed identities

Command: `Get-FileHash -LiteralPath <path> -Algorithm SHA256`, exact bytes, lowercase hexadecimal, ordinal sorted paths. This packet is not self-hashed. Recheck every earlier Gate 1/Gate 2 identity and approved status as well as these candidate rows.

| Path                                                                                                 | SHA-256                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/release-a-google-review-import/01-analysis-review.md                                    | 59a23ca97f2a3cd55287828acbfb97babd02c94313f3111d6cca7f3f8f4290a1 |
| docs/reviews/release-a-google-review-import/02-specs-review.md                                       | eb6ae177af0fed48a6df2e47101c261e7dd96dff55c57b0d021ad642e403eb3c |
| openspec/changes/release-a-google-review-import/.openspec.yaml                                       | edbcd0b0cb2d4619b326f4293e56c1d31f5ce6be37dda83923ff58267b46f1ab |
| openspec/changes/release-a-google-review-import/analysis.md                                          | 3a469d3de814956f04bc983a76a9471be70af8a0f98f6ed7a80abd68aaa442f1 |
| openspec/changes/release-a-google-review-import/design.md                                            | 5b117d25a21e23e2b714fc2c46a843a5b1644f4f94ed90cf3c7f47a73ca4006b |
| openspec/changes/release-a-google-review-import/proposal.md                                          | 36e44c32654a027fe13290491b4e0bf12cfbdc1cbbe2ed2245b5716b68195414 |
| openspec/changes/release-a-google-review-import/specs/backoffice/release-a-customer-exposure/spec.md | 5af09c087c4dc567e70320d20f952240094573a69a92e6a0894f734e2521fab8 |
| openspec/changes/release-a-google-review-import/specs/reputation/google-review-retrieval/spec.md     | 83121b2f96bc914b230206f5ffc2ca54739f5b968c84df1f6c8924a8a2ad4f1e |

## Validation and evidence limits

- Strict OpenSpec change validation after Design creation: PASS, exit code 0, valid true, issues [], one item passed.
- Docs, architecture, workspace typecheck and full format passed in this same requirements/planning turn. Final docs and full format after Design/packet generation also PASS; packet identities and exact Design embedding PASS. Verdict annotation is followed by a task-path format check.
- Protected formatting preservation passed for 67 exact paths. New Design/packet formatting is scoped to task-owned paths.
- No application/cloud/local/provider/database tests, builds or Browser QA were run because no implementation exists. No actual provider/operations evidence is claimed.
- CLI may offer Tasks because Design exists. YUTA state remains before Tasks/Apply, pending a valid sensitive gate and GI-07 resolution. No placeholder Tasks or partial implementation bypass.

## Exact Design

```markdown
## Context

See [Proposal](proposal.md) for motivation and the approved [retrieval](specs/reputation/google-review-retrieval/spec.md) / [exposure](specs/backoffice/release-a-customer-exposure/spec.md) deltas for behavior. Gate 1 has actual Human approval; Gate 2 has fresh-context delegated approval from `/root/google_retrieval_gate2_independent`. This task now uses CODEX_ONLY, with COMMIT_AFTER_TASK YES on local main after completion. Approved Proposal/Analysis remain immutable historical Human-mode snapshots.

DESIGN_APPLICABILITY: APPLICABLE

SENSITIVE_DESIGN_GATE: REQUIRED

DESIGN_READINESS: BLOCKED_BEFORE_TASKS_BY_GI_07

Backoffice owns server provider access and cloud UI; db-cloud owns scoped persistence; contracts owns serializable transport. Current feedback parents mix Google fields and local state; parent deletion cascades to notes/replies. Notes and drafts are single arbitrary 1–4,000-character strings with no authored/quotation provenance. Provider access, allowed cache/use quantity and backup/restoration are not verified for real data. No implementation or live operation is authorized by this draft.

Canonical sources: [root](../../../AGENTS.md), [Backoffice](../../../apps/backoffice/AGENTS.md), [db-cloud](../../../packages/db-cloud/AGENTS.md), [contracts](../../../packages/contracts/AGENTS.md), [database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), [tenancy](../../../docs/architecture/TENANCY.md), [authentication](../../../docs/architecture/AUTHENTICATION.md), [deployment](../../../docs/operations/DEPLOYMENT.md), [Reputation](../../../docs/features/reputation/README.md), [Today](../../../docs/features/today/README.md), [provider policy](https://developers.google.com/my-business/content/policies). Current code seams are the scoped Reputation repository/schema, Google client/token accessor, auth grants and route-owned review components.

## Goals / Non-Goals

**Goals:** preserve the work parent and existing local operation grants; isolate new provider content/references behind a temporary lifecycle; fence retrieval by trusted authorization and current binding; provide immediate usable views and truthful persisted outcomes; make new data distinguishable from legacy rows; define focused migration/test/QA seams.

**Non-Goals:** no new app/package/data runtime, broad repository refactor, legacy adoption/purge, actual Google enablement, production scheduler/backup mutation, publication, AI or scheduled provider retrieval. No automatic proof of authorship from arbitrary text. No task-level commit before requested completion.

## Decisions

### D1 — Stable local work with separate temporary provider cache

Keep `feedback_items` as the independent local-work identity/status/assignment parent. Add an importer-ownership marker that defaults to legacy/unmanaged, valid only for GOOGLE. For new importer-owned work, do not copy provider identifiers, author/rating/comment, original provider timestamps, URLs, remote replies or provider metadata into permanent parent fields; they remain null. Its local received/created time describes YUTA work creation, not provider authorship.

Add a scoped Google cache relation owned by db-cloud, attached to the work parent, carrying only minimized validated provider content, review resource identity, current connector/binding generation, fetchedAt and expiry. Provider identity/fingerprints/cursors receive the same temporary classification unless separate actual authority permits otherwise. Stable mapping lasts only while its cache/reference is eligible.

Queries distinguish managed work from legacy rows. Read provider fields only through an eligible cache join; expired/binding-obsolete data is not selected, searched, sorted or serialized. Local-work filters/counts/notes/drafts remain scoped and independent. Legacy DIRECT and unknown-provenance Google queries retain their existing behavior, not automatic migration into the cache.

Alternative rejected: delete the feedback parent at expiry. It cascades user work and violates the approved retention outcome. Alternative rejected: keep API identifiers/content in permanent parent fields or hashes; this bypasses the temporary classification rather than resolving it.

### D2 — Operation-specific grants and scoped resource fencing

Add an explicit server-owned Google-retrieval operation grant for OWNER/MANAGER under existing Reputation entitlement/read/context prerequisites; do not reuse connector-manage for MANAGER or infer retrieval from STAFF read. OWNER remains the connector/binding owner. All route actions derive scope and actor from the validated server session; record/reference lookups use organization + establishment and assigned scope as applicable.

A connector binding generation changes on account/location rebind and invalidating credential/connection changes. A retrieval captures the authorized binding and generation before provider access and rechecks current authority/generation before committing. No token is returned to browser contracts or logs.

Use a short persisted scoped attempt/lease to consolidate concurrent stale visits/refreshes. Network calls happen outside DB transactions. Commit validated content and the corresponding success receipt atomically after binding/actor fencing; failure records do not overwrite prior successful freshness. Lease expiry/retry is bounded and content-free. Do not hold DB locks across provider latency.

Alternative rejected: browser-supplied account/location/role and token calls during the first render. Both weaken authority/work continuity. Alternative rejected: treating a read grant as authority to retrieve the entire establishment.

### D3 — Validated provider pages and temporary deduplication

Extend the current server-only Google adapter with reviews.list and reviews.get, Zod validation and no framework/shared response cache. Request pageSize 50 and updateTime-desc order. Validate every review name/identity belongs to the server-authorized account/location; reject mismatching/malformed/duplicate inconsistent payloads as failure rather than partial success.

Cache identity uniqueness is scoped to organization/current provider location/review identity. Before creating work, reject conflicts with another establishment or a legacy identity; never reassign/adopt a row. New work gets local NEW and no assignee. A permitted existing identity updates its provider copy only. Previous content for change detection is eligible temporary content; do not retain a permanent provider-derived fingerprint after its deadline.

Pagination uses server-held short-lived continuation linked to organization/establishment/connector generation and the current retrieval sequence. Browser transports an opaque handle, not provider resource authority. On new recent refresh or rebind, obsolete continuations become invalid and the user can retry current coverage. Only explicit Voir plus retrieves another page.

If all permitted mapping has been removed, exact historical linkage is unavailable. Do not guess association from names/text. A new encounter cannot claim to be deduplicated against unlinked historical work; preserve old work and truthful coverage. No long-lived reviewId exception is assumed.

Alternative rejected: deduplicate by reviewer name/comment, copy every page automatically or accumulate complete history indefinitely.

### D4 — Cache eligibility and physical cleanup

Use an injectable clock in provider-lifecycle/domain checks and DB integration tests. Proposed cache usable lifetime is 29 days from actual retrieval, leaving an operational buffer below the 30-calendar-day maximum. Per-copy expiresAt is independent; failed fetches and local edits never renew it. Short-lived continuations expire earlier.

Create a content-only, idempotent scoped purge operation for importer-owned rows and cache/reference/continuation copies. It removes provider bytes and references, not parents/notes/drafts. A separately authenticated maintenance entry point in the existing Backoffice runtime invokes bounded scoped batches without any provider request; it is not a public data endpoint or a browser operation. No all-tenant request scope is accepted from a browser.

The source implementation and synthetic invocation can be verified in this task. Actual unattended scheduling, timely removal, monitoring and backup/PITR/restoration handling require the separately verified operations contract before real-provider content is used. No production scheduler or global backup settings are changed. A failed job is not reported as successful removal; read denial remains unconditional and operational use stays blocked if the physical deadline cannot be met.

Restored importer-owned copies preserve original fetchedAt/deadlines and are denied/purged when expired; restoration does not transform them into legacy/unmanaged rows. Provider content in backups/copies needs actual approved handling, not an assertion that primary-row deletion proves global erasure.

Alternative rejected: request-only cleanup, relying on browser activity, full-work deletion or claiming physical deletion from read masking. Exact maintenance invocation/schedule is part of GI-05 operations evidence before live use, not an authorization to deploy.

Maintenance boundary proposal: `apps/backoffice/src/app/api/internal/reputation/google-cache-maintenance/route.ts`, POST only, with a dedicated `REPUTATION_CACHE_MAINTENANCE_SECRET` bearer credential validated server-side and compared safely. Missing/invalid credentials fail before DB access. No ordinary user role or browser-supplied organization/establishment authorizes this route. After authentication, the repository enumerates only due importer-owned scope pairs, then purges each explicit trusted organization/establishment in bounded batches. Responses/logs contain only minimized own cleanup outcomes, never review IDs/text, account/location names or secret values. A new operational credential/scheduler is not configured here; real use requires its reviewed operations evidence. This adds no public data read and does not contact Google.

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

### D8 — Freeform quotation handling is NOT SELECTED

This is an evidenced blocking Product/retention decision, not a deferrable Open Question. Current `saveReplySchema`/`createInternalNoteSchema` and their textareas/actions/repositories carry one arbitrary string, with no authored/quoted segments or origin. `createdByUserId` identifies the submitter only. Exact/fuzzy matching, hashes, clipboard blocking and an authorship checkbox cannot establish that every character is independent or provide provider permission.

The approved contract retains independent local text and forbids a blanket quotation exemption or whole-note deletion. This design therefore does not authorize dependent Apply using the current unclassified fields. Two bounded paths are prepared for actual Human Product/authority disposition:

| Path                                                    | Exact current behavior                                                   | Proposed behavior and consequence                                                                                                                                                                                                                                                                                                                                                       | Approval / evidence boundary                                                                                                                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1 — Keep current freeform UX pending verified handling | Notes/drafts are a single 1–4,000-character string, stored verbatim      | Keep the familiar textareas. Do not implement the dependent real-content path until an explicit permitted handling contract determines quoted/mixed content retention without whole-note deletion or blanket exemption.                                                                                                                                                                 | No new UX change; requires actual scoped provider/privacy handling authority, not Product saying Google permits it.                                                                            |
| Q2 — Explicit separate quotation channel                | Google text can be pasted into the same note/draft as user-authored text | Add a source-bound temporary Google quotation/reference outside the independently authored note/draft field. The application quote channel never persists raw Google text in the durable note/draft body. On expiry only the temporary quotation disappears; authored work remains. Pasted/mixed freeform content still requires an explicit handling rule, not an automatic exemption. | This changes input/retention UX and requires actual Human decision plus review of feasible pasted-text handling. It alone does not establish Google compliance or detect all arbitrary copies. |

Concrete Q2 presentation proposal (not approved): retain `Notes internes` / `Brouillon de réponse` with authored content; display a separate `Extrait Google — temporaire` block referencing the eligible copy, with `Cet extrait peut devenir indisponible. Votre texte rédigé dans YUTA est conservé.` The quote expires without rewriting the authored draft. No mandatory source checkbox, silent input rejection, text-span removal or whole-field expiry is chosen here.

Independent Design review must identify this unresolved blocker rather than approve an incomplete contract. A Human may choose the desired UX or supply scoped handling authority; neither answer is itself Google permission. If the selected outcome changes behavioral Specs, return to the appropriate earlier review with fresh hashes rather than amend approved artifacts silently.

## Risks / Trade-offs

- [Arbitrary freeform text may mix independent work and copied API content] → GI-07 blocks dependent Tasks/Apply; no automatic deletion/exemption or hidden UI choice.
- [Expiry removes the provider mapping] → preserve internal work and truthful unavailable-reference fallback; no permanent historical deduplication promise.
- [Concurrent fetch/rebind or membership revocation] → operation grants, captured generation and commit-time authority fence.
- [Incomplete recent coverage] → explicit page/batch coverage; local queue counts are not provider-history completion.
- [Maintenance/backup failures] → unconditional read denial, content-only cleanup evidence and separate real-use operations prerequisites; no physical-erasure/readiness claim from code alone.
- [Legacy data already contains provider fields] → default unmanaged marker and exact exclusions; no existing-row cleanup/migration adoption.
- [Refresh overwrites typing] → stable local UUID/form state and explicitly applied list updates; Browser QA during active editing.

## Migration Plan

No migration is generated or run at this blocked Design gate.

After actual Design approval and a resolved GI-07 contract, add one additive cloud migration for the importer marker, temporary cache/continuation/attempt relations and required scoped indexes/constraints; use the existing db-cloud migration tooling and inspect generated SQL. Default every existing row to unmanaged/legacy; do not backfill provider ownership or change existing text/children.

Tests use a fresh guarded disposable cloud database and injected provider/clock fixtures with no real credentials. Prove new data separation, scoped uniqueness/conflicts, expiry masking across list/detail/search/sort/count/mutations, actual content-only purge without child loss, pagination/receipt atomicity and membership/bind races. Verify DIRECT and legacy behavior unchanged.

Rollback disables new retrieval entry points while retaining local work and mandatory cache cleanup. Do not reverse ownership by turning managed copies into legacy-readable data. Do not drop temporary data/columns with active content or remove cleanup before retained-copy disposal is addressed. Production deployment/migration/backup scheduling remains separately authorized.

## Validation and exact implementation scope

Before Apply, resolve D8 and sensitive Gate 2b with fresh-context independent review under CODEX_ONLY. Only then create Tasks and the Technical Implementation Contract/phase allowlists; do not implement a partial guessed quotation policy.

Expected owners/seams: db-cloud Reputation schema/repository/index/new migration and focused integration tests; contracts Reputation input/outcome schemas/tests; Backoffice server Google client/orchestration/auth grant/setup/loaders, existing Integrations actions/components and route-owned Avis/Today components/tests; bounded authenticated maintenance entry; current Reputation/Today/operations docs. Generated migration identities are isolated before Data Apply.

Candidate implementation allowlist, inactive until D8 is resolved and sensitive Design approved:

- `packages/db-cloud/src/schema/reputation.ts`, `packages/db-cloud/src/reputation-repository.ts`, `packages/db-cloud/src/index.ts`, new `packages/db-cloud/src/google-review-retrieval-repository.ts`, and focused new `packages/db-cloud/test/google-review-retrieval.integration.test.ts` plus existing Reputation regression tests. One newly generated numbered cloud SQL migration and its exact journal/snapshot entries are isolated/reviewed before Data Apply; existing deployed SQL is never edited.
- `packages/contracts/src/reputation/index.ts` and `packages/contracts/test/reputation.test.ts`.
- `apps/backoffice/src/server/reputation/google-business-profile-client.ts`, new `google-review-retrieval.ts` / `google-review-lifecycle.ts`, existing `google-connector-access.ts` / `release-a-setup.ts`, `apps/backoffice/src/server/auth/permissions.ts`, and the scoped connector-binding repository seam.
- Existing route-owned Avis loaders/model/actions/detail/list/draft/note components; new `_components/google-review-retrieval-panel.tsx`; existing Integrations actions and Google selector; existing Today loader/presentation. D8-specific input changes require their separate actual decision, not this general allowlist.
- The authenticated maintenance route named above and a dedicated server-only auth helper; Backoffice environment example and current operations documentation only for the new credential contract, with no secret value or production setting.
- Focused Backoffice tests for provider validation, operation roles/denials, retrieval orchestration, copy/continuity/expiry and maintenance denial; current Reputation/Today/operations knowledge updates attributable to actual implementation only.

Tasks must expand route-owned existing component/model paths and generated migration identities from actual repository inventory before Apply. This allowlist does not authorize unrelated files or a source change while this Design remains blocked.

Required later checks: docs, architecture, workspace typecheck, format, affected contracts/db-cloud/Backoffice tests and cloud build as applicable; synthetic persisted integration evidence and browser QA of roles, expiry/recovery, history and editing continuity. Real-provider tests remain prohibited until GI-05 and all permitted-use prerequisites are satisfied.

## Blocking Decision

GI-07 remains unresolved. This Design is reviewable but **not ready for Tasks/Apply**. Core storage/grant/pagination/cache/continuity decisions above can be examined independently; they do not waive D8 or permit implementation. Ask the actual Human for the smallest needed UX/handling disposition, explain exact consequences, then update only authorized planning scope with fresh review.
```

## Independent review request and stop boundary

Return APPROVED, CHANGES_REQUESTED or BLOCKED with actionable findings and exact reviewed identities. Independently assess technical completeness, security/data/runtime implications, migration/rollback, scope and unresolved Product/authority conditions. Do not treat Gate 2 approval or strict validation as Design approval. No Tasks/Apply while this sensitive gate is unapproved or a required Product/authority contract is unresolved.

````
`````
