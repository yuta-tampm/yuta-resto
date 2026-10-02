```text
Change: release-a-google-review-import
Gate: 2 — Specs
Review status: APPROVED
Created: 2026-10-01
Schema: yuta-spec-driven
COLLABORATION_MODE: CODEX_ONLY
COMMIT_AFTER_TASK: YES
Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Workflow state: REVISED_GATE_2_APPROVED_CONTINUE_DESIGN
```

## Independent revised Gate 2 approval

Reviewer `/root/google_import_gate2_revision_review` returned APPROVED on pending packet `9490ae03ef198b0ba58f4392fe4983a35b0be0fd637e01030b977cc9503d1b4d`. All eight current identities, both exact deltas and controlling Gate 1 identities/embeddings matched. Recorded by Codex workflow at 2026-10-01T19:04:27.471Z. No material findings. Approval permits sensitive Design revision only; no Tasks/Apply or real-provider operation.

## Exact candidate and authority

Revised Gate 1 is APPROVED by `/root/google_import_gate1_revision_review`, after rechecking exact identities. Actual Human freeform/cache approval and implementation instruction own the changed Product boundary; routine gate review is independently delegated. Current main HEAD remains `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57`. No Tasks or implementation exists. Gate 2 permits sensitive Design revision only; no live data, activation, deployment or publication.

The retrieval delta has 11 requirements / 42 scenarios. The exposure delta remains unchanged at 4 modified requirements / 19 scenarios and retains all earlier compatibility cases. The revised requirement retains existing freeform user-input Save/validation and prevents importer/cleanup from inserting or changing durable note/draft text. No origin detector, quotation editor, API permission exemption or local-work purge. Original YUTA replies remain local work even if later published; publication implementation stays outside this task.

A separate real-provider-admission condition now fails closed before token/provider effects when actual environment/provider-use prerequisites remain unverified. Source implementation and guarded synthetic verification may proceed after required planning reviews; this is not actual provider permission. Temporary references, conditional recovery, role/queue/legacy/DIRECT/expiry/cleanup/continuity contracts remain. Old GI-07 and approval history are preserved below.

## Verification

`openspec validate release-a-google-review-import --type change --strict --json`: PASS, exit0, validtrue, issues[], one item passed. Docs and architecture checks PASS in this revision; source/synthetic tests and Browser QA belong to later implementation. No DB/provider/environment change.

## Current exact identities

Node crypto SHA-256 over raw file bytes.

| Path                                                                                                 | SHA-256                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/release-a-google-review-import/01-analysis-review.md                                    | 44567dd42a690644a3225aa3c4afd228e654a44c777075d1ce85788e2b26a6e7 |
| openspec/changes/release-a-google-review-import/.openspec.yaml                                       | edbcd0b0cb2d4619b326f4293e56c1d31f5ce6be37dda83923ff58267b46f1ab |
| openspec/changes/release-a-google-review-import/analysis.md                                          | 99ce35d5324ef36d96706158940e2d33a36d42442e8914fffaa7080c8100aaa9 |
| openspec/changes/release-a-google-review-import/proposal.md                                          | 5ecaaf8176c0812c99e18bfb8a20b1b3057f8c6c634a3ca8cd51f46c4b96fa2f |
| openspec/changes/release-a-google-review-import/specs/backoffice/release-a-customer-exposure/spec.md | 5af09c087c4dc567e70320d20f952240094573a69a92e6a0894f734e2521fab8 |
| openspec/changes/release-a-google-review-import/specs/reputation/google-review-retrieval/spec.md     | c23135db729e2cc0819cd4e2fea597c4c197299a8efad89e47d00aaabd25b16c |
| openspec/specs/backoffice/release-a-customer-exposure/spec.md                                        | b3e726a1f6102e399b8a319a72570610898028b21074ff7e1472afae53c379db |
| openspec/specs/reputation/reply-draft-pending-feedback/spec.md                                       | 252430fecf4732ca55de0fd5c564870d7ddd43ad6fe3a37a502b36acefff36d6 |

## Exact delta — openspec/changes/release-a-google-review-import/specs/reputation/google-review-retrieval/spec.md

```markdown
## Purpose

Define authorized Google review retrieval and scoped work continuity for Release A, including requested history, truthful outcomes and temporary provider content without a permanent linkage or publication promise.

## ADDED Requirements

### Requirement: Trusted actor and provider resource authority precede retrieval

Google review retrieval SHALL require a validated server session, active membership, trusted organization and establishment, the existing Reputation prerequisites, and a server-verified current Google account/location binding. OWNER SHALL manage and confirm the connector and first continuation. OWNER/MANAGER SHALL be eligible for visit/manual refresh, requested older pages and conditional detail recovery through an established connector. STAFF SHALL NOT initiate provider retrieval, manage the connector or gain access beyond assigned local work. Browser-provided scope, role, binding, cursor and review identity SHALL NOT establish authority. Authorization denial SHALL occur before credential, provider and mutation access.

#### Scenario: OWNER confirms and continues

- **WHEN** an eligible OWNER confirms a server-verified location and continues to Avis
- **THEN** YUTA SHALL offer first retrieval for that binding with a distinct persisted retrieval outcome; binding alone SHALL NOT mean retrieval succeeded

#### Scenario: Existing binding or reconnect

- **WHEN** an eligible OWNER returns to an already-bound connector, including a same-location reconnect without a successful retrieval
- **THEN** a permitted first-retrieval/retry path SHALL remain available without requiring a different location selection

#### Scenario: MANAGER uses established connection

- **WHEN** an eligible MANAGER requests refresh, older history or individual recovery for the established connector
- **THEN** YUTA SHALL enforce the retrieval contract without granting connector management, OAuth setup or access to the OWNER-only Integrations route

#### Scenario: STAFF or revoked access attempts retrieval

- **WHEN** STAFF, an unauthenticated actor or an actor with stale/revoked membership invokes any review retrieval operation
- **THEN** YUTA SHALL deny it before credential/provider/persistence effects, including when a permitted page route is otherwise readable

#### Scenario: Forged foreign resources

- **WHEN** an actor supplies another organization's or establishment's review, binding or pagination reference
- **THEN** YUTA SHALL deny it without disclosing protected resource existence/content or causing provider/storage effects

### Requirement: Eligible saved work renders before visit-triggered retrieval

The Avis list/detail SHALL render actor-readable local work and still-eligible cached Google content without waiting for Google. An actual eligible OWNER/MANAGER visit SHALL request retrieval when the current content is absent or stale under the reviewed freshness rule. Manual `Actualiser` SHALL remain available for an established connector. STAFF visits, Today rendering, route prefetch, filter changes, assignment, notes and draft Save SHALL NOT initiate provider retrieval. No unattended provider polling or scheduled synchronization SHALL be introduced. Pending/failure SHALL preserve usable local work and eligible cached content.

#### Scenario: Cache is usable while retrieval is pending

- **WHEN** an eligible OWNER/MANAGER opens Avis with stale but unexpired cached content and saved work
- **THEN** existing work/content SHALL render before Google completes, with a visible pending indicator and no false success timestamp

#### Scenario: Cache is sufficiently fresh

- **WHEN** an eligible actor opens Avis while the current content satisfies the reviewed freshness rule
- **THEN** the visit SHALL use the eligible saved view without an unnecessary provider retrieval; an eligible OWNER/MANAGER SHALL still have manual refresh

#### Scenario: First visit has no usable Google content

- **WHEN** the established connector has no usable fetched copy or successful retrieval evidence
- **THEN** Avis SHALL show the truthful first-retrieval/pending/retry state and any readable local work, without representing an empty persisted inbox as zero reviews at Google

#### Scenario: Non-visit interaction

- **WHEN** a route is prefetched, Today is rendered, STAFF opens an assigned item, or an actor changes a filter/assignment/note/draft
- **THEN** the interaction SHALL cause no Google review retrieval

### Requirement: Requested coverage is paginated and truthfully described

First/recent retrieval SHALL request up to 50 reviews per page in provider-update-time order. The UI SHALL describe recently updated reviews, not promise that they were recently authored. `Voir plus d’avis` SHALL request the next older page only when an eligible OWNER/MANAGER requests it with a valid current scoped continuation. The loaded page size SHALL NOT cap retained independent YUTA work. Coverage and successful freshness SHALL refer to the actual page/batch, not all provider history. Provider cache quantity SHALL remain limited under its separately verified permitted-use contract; page-size support SHALL NOT be represented as permission to retain unlimited history.

#### Scenario: More provider history exists

- **WHEN** a first/recent page succeeds and has a valid next-page continuation
- **THEN** YUTA SHALL expose requested more-history behavior and indicate partial coverage without claiming all reviews are loaded or handled

#### Scenario: Older review was recently edited

- **WHEN** an older review appears in the recent page because of its provider update time
- **THEN** the presentation SHALL describe recent updates without identifying it as newly authored solely from its position

#### Scenario: No further page

- **WHEN** a valid requested older page has no further continuation
- **THEN** YUTA SHALL indicate the current coverage end; an empty older page SHALL NOT become a claim that the location has zero reviews

#### Scenario: Wrong or stale pagination continuation

- **WHEN** a requested continuation belongs to another binding/scope or is no longer valid
- **THEN** YUTA SHALL deny/recover safely, preserving work and prior successful evidence without fetching or attaching foreign content

### Requirement: Validated scoped identity prevents destructive replay

YUTA SHALL validate provider responses and associate a review only through its trusted provider identity, current location binding and YUTA organization/establishment while the identity mapping is permitted and available. A newly encountered review SHALL create local `NEW` work without an invented assignee. Retrieval replay SHALL NOT duplicate a review under an available permitted mapping, overwrite local status/assignment/independent notes/drafts/history, reassign another establishment's record, or silently adopt an unknown-provenance legacy/demo record. Absence from the recent page SHALL NOT mean deletion. Invalid responses, stale-binding results and conflicting scope SHALL NOT be persisted as successful retrieval.

#### Scenario: Repeated retrieval with unchanged reviews

- **WHEN** a valid review is returned again under the same permitted scoped mapping
- **THEN** YUTA SHALL update only its fetched provider copy/provenance, preserve local work and avoid another work record

#### Scenario: First retrieval contains old reviews

- **WHEN** a valid first page contains reviews not previously represented by a permitted scoped mapping
- **THEN** they SHALL enter local NEW work without invented assignment, while presentation SHALL NOT call all of them newly authored at Google

#### Scenario: Review is absent from current recent page

- **WHEN** a previously encountered review is omitted from the newly retrieved page
- **THEN** its local work SHALL remain and its old provider copy SHALL keep its own existing expiry deadline

#### Scenario: Binding changes before result commit

- **WHEN** the active account/location binding or relevant authorization changes while retrieval is in flight
- **THEN** obsolete results SHALL NOT be committed or presented as success for the new binding

#### Scenario: Cross-establishment or legacy identity collision

- **WHEN** an incoming identity conflicts with another establishment or an unknown-provenance legacy row
- **THEN** retrieval SHALL not reassign/adopt the row or overwrite protected content/work; the result SHALL offer a scoped safe conflict/recovery outcome

#### Scenario: Invalid provider response

- **WHEN** provider data fails boundary validation or contradicts the current verified resource
- **THEN** YUTA SHALL report failure without partial success, fabricated zero or unauthorized content persistence

### Requirement: Provider edits and remote replies remain separate from local work

A retrieved change to provider rating/comment SHALL produce a review-needed indication for the local work without automatically resetting its handling state or overwriting its draft. Retrieved remote replies SHALL be presented separately from YUTA notes/drafts and local approval/publication states. Remote reply presence SHALL NOT establish YUTA publication or completed provider moderation. Local draft Save SHALL retain its existing explicit persisted-result/pending semantics and SHALL NOT approve/publish or call the provider.

#### Scenario: Customer edits rating or text

- **WHEN** a subsequent permitted fetch changes the rating/comment of a known review
- **THEN** YUTA SHALL indicate `Avis modifié — à vérifier` or equivalent, keep existing local handling/draft and invite rechecking it

#### Scenario: Remote reply changes

- **WHEN** a valid fetched reply differs from the earlier eligible provider copy
- **THEN** YUTA SHALL update the remote-reply presentation without overwriting the local draft or inferring a local approval/publication

#### Scenario: Draft Save

- **WHEN** an authorized actor saves valid independent local draft content
- **THEN** YUTA SHALL use the existing local Save/pending/result behavior, with `Brouillon — non publié` or equivalent truthful copy and no external effect

### Requirement: Retrieval preserves the active writing context

Review retrieval SHALL NOT change the selected work item, replace unsaved note/draft input, or reorder the active working context under the cursor. New items SHALL be announced through an accessible non-disruptive indication; users SHALL control when to inspect the updated list. Loading, error and success indicators SHALL preserve keyboard/focus behavior and accessible names.

#### Scenario: New reviews arrive while writing

- **WHEN** an actor is editing unsaved input and a retrieval brings new reviews
- **THEN** the selected item and input SHALL remain unchanged and an accessible added-items notice SHALL permit later inspection

#### Scenario: Retrieval fails while writing

- **WHEN** a pending retrieval fails during local editing
- **THEN** the UI SHALL preserve input/focus and show actionable retry/reconnect without converting the form or list to a successful empty state

### Requirement: Outcomes and freshness have persisted truthful evidence

YUTA SHALL distinguish never performed, pending, failed, completed-empty, completed-with-content and expired/unavailable content outcomes for the current binding/scope and retrieval kind. Successful freshness SHALL advance only when the corresponding validated result is persisted. Seeded rows, a redirect, OAuth/binding success and local edit timestamps SHALL NOT prove provider retrieval. An empty older page, expired cache or failed call SHALL NOT establish a zero-review location. Receipts/logs SHALL be minimized and SHALL NOT retain provider content or credentials outside their reviewed retention class.

#### Scenario: True first/recent empty success

- **WHEN** a validated first/recent retrieval genuinely returns no reviews and its scoped successful outcome is persisted
- **THEN** YUTA SHALL show a completed-empty outcome distinct from never-run/error, with truthful successful retrieval time

#### Scenario: Failed refresh after prior success

- **WHEN** retrieval fails after an earlier successful page
- **THEN** YUTA SHALL preserve the earlier successful freshness, retain work and only unexpired content, and show failure/retry rather than zero

#### Scenario: Bound connector or seeded rows only

- **WHEN** a binding or stored legacy rows exist but no actual current retrieval receipt exists
- **THEN** YUTA SHALL not invent pending, failure, success or verified provider freshness from them

### Requirement: Temporary provider copies expire independently from local work

Each actually retrieved Google copy SHALL have verified provenance, actual retrieval time and a secure temporary deadline no later than 30 calendar days from retrieval. Expired provider content SHALL NOT be read, serialized, displayed or used from any shared consumer, including internal mode. Actual physical removal of expired subject content/references/copies SHALL occur through the reviewed unattended cleanup lifecycle and SHALL NOT fetch Google reviews. Local edits, failed retries, page omissions or restoration SHALL NOT renew fetched copies. Independent local work SHALL survive expiry/cleanup without cascading deletion or an automatic handling-status change.

#### Scenario: Expired content requested before physical cleanup

- **WHEN** the provider copy has expired but its cleanup has not yet removed the stored bytes
- **THEN** every consumer SHALL deny that provider content while returning only the actor-readable independent work and unavailable-content state

#### Scenario: Cleanup without active users

- **WHEN** provider content reaches its deadline while no user visits YUTA
- **THEN** the reviewed cleanup lifecycle SHALL physically remove subject provider bytes/references without requiring a user visit or performing a provider fetch, preserving independent work

#### Scenario: Recent page refresh leaves older work

- **WHEN** only the recent page is fetched again
- **THEN** fetched copies SHALL receive new provenance/deadlines, omitted copies SHALL retain their own deadlines, and older independent work SHALL not be removed

#### Scenario: Restored old provider copy

- **WHEN** an older persisted copy is restored under the reviewed backup/restoration contract
- **THEN** it SHALL not regain eligibility or have its deadline reset; expired subject copies SHALL remain denied and be physically removed

### Requirement: Individual recovery is conditional on a permitted trusted reference

OWNER/MANAGER individual recovery SHALL require readable local work, a still-permitted trusted provider reference and verified current account/location authority. A successful fetch SHALL attach only a validated matching review and create a new temporary copy. If a reference is no longer permitted/available, YUTA SHALL preserve local work, mark its Google content unavailable and offer role-appropriate OWNER/MANAGER/support recovery without guessing linkage. YUTA SHALL NOT promise indefinite reviewId retention, permanent exact recovery or complete historical deduplication after permitted identity mapping expires.

#### Scenario: Expired content with a usable reference

- **WHEN** an eligible OWNER/MANAGER opens work whose Google content is unavailable but a permitted trusted matching reference exists
- **THEN** YUTA SHALL attempt the eligible single-review retrieval and preserve local work throughout pending/error/success

#### Scenario: No permitted provider reference remains

- **WHEN** the associated provider reference has expired, been removed or cannot be authorized
- **THEN** YUTA SHALL show the preserved scoped work with unavailable Google content and recovery guidance; it SHALL not guess association from author names or text or claim a fetch succeeded

#### Scenario: Google cannot find the referenced review

- **WHEN** an authorized individual request returns NOT_FOUND
- **THEN** YUTA SHALL show `Avis indisponible sur Google` or equivalent and retain local work, without inventing whether the customer deleted it

#### Scenario: STAFF opens retained work

- **WHEN** STAFF opens assigned retained work whose Google copy is absent
- **THEN** YUTA SHALL offer the permitted local-work view and OWNER/MANAGER handoff without an automatic/provider retry grant

### Requirement: User-entered work stays separate from automatically retrieved provider copies

YUTA SHALL retain existing freeform user-input notes/drafts, validation and explicit Save behavior. Import, refresh, detail recovery and cleanup SHALL NOT insert API content into, overwrite, rewrite, classify/reject by inferred origin or expire these saved user-input bodies. No quotation editor, clipboard restriction, source checkbox or universal pasted-text detector SHALL be introduced by this capability. The application source boundary SHALL distinguish explicit user-input persistence from automatically retrieved provider copies without certifying the origin or permitted use of every pasted character. Provider-use permission SHALL remain a separate mandatory real-data prerequisite; Product input selection SHALL NOT create a blanket Google retention exemption.

#### Scenario: Saved user work survives cache cleanup

- **WHEN** valid freeform notes/drafts have been explicitly saved and their associated Google copy expires
- **THEN** provider cleanup SHALL retain the saved strings, local state/assignment/history and actor-scoped usability without source guessing or whole-field deletion

#### Scenario: A user saves pasted or mixed text

- **WHEN** an authorized actor submits valid freeform input containing pasted or mixed text
- **THEN** YUTA SHALL preserve existing explicit Save and validation without a universal origin detector, while making no claim that pasting grants provider permission or certifies independent authorship

#### Scenario: Importer cannot populate durable user-input text

- **WHEN** a retrieved Google review or remote reply is committed or updated
- **THEN** its text SHALL enter only eligible temporary provider storage and SHALL NOT be inserted into or replace saved notes/drafts/local published reply bodies

### Requirement: Provider use and legacy compatibility retain separate authority

Actual Google access, permitted cache/use quantity, identifier/quotation treatment, cleanup and backup/restoration behavior SHALL be verified for the actual project/location before real-provider data use. Source implementation, synthetic tests, Product selection and workflow review SHALL NOT establish provider eligibility or production activation. Existing unknown-provenance Google records SHALL retain their existing authorized readability and SHALL NOT be silently adopted, re-dated, purged or represented as retrieval proof. DIRECT and local/public application boundaries SHALL remain unchanged.

#### Scenario: Synthetic verification succeeds

- **WHEN** synthetic candidate checks pass without actual provider prerequisites
- **THEN** the report SHALL identify repository evidence and leave actual provider use/readiness unverified or blocked, without enabling it from that result

#### Scenario: Legacy records are displayed

- **WHEN** authorized legacy Google records have no importer-owned provenance
- **THEN** their existing readability SHALL remain, without silently adopting them into the new cache lifecycle or claiming actual retrieval evidence

#### Scenario: Real-provider prerequisites remain unverified

- **WHEN** actual provider/use/retention/cleanup/backup conditions have not been verified for the environment
- **THEN** real-provider retrieval SHALL remain disabled and deny token/provider access; source implementation and isolated synthetic verification MAY proceed after valid sequential planning gates without claiming real-provider eligibility

#### Scenario: Disabled real-provider admission

- **WHEN** an eligible actor requests retrieval in an environment where the separate reviewed provider-admission setting is absent, invalid or disabled
- **THEN** YUTA SHALL return a truthful unavailable outcome before token/provider effects and SHALL preserve existing readable work/cache under their own eligibility rules
```

## Exact delta — openspec/changes/release-a-google-review-import/specs/backoffice/release-a-customer-exposure/spec.md

```markdown
## MODIFIED Requirements

### Requirement: A Avis read scope luôn Google và actor-scoped

In A, inbox/list, counts, selected detail and deep-link detail SHALL expose only actor-readable Google work in the trusted organization/establishment. Provider content and independent local work SHALL have separate eligibility under `reputation/google-review-retrieval`: an expired/unavailable importer-owned Google copy SHALL not be read/serialized/displayed, while permitted independent work SHALL remain readable with a truthful unavailable-content state. Unknown-provenance legacy Google rows SHALL retain their existing authorized readability without silent adoption, re-dating or purge. Source/query/filter errors or fallback SHALL NOT broaden to DIRECT. A DIRECT/foreign/inaccessible ID SHALL receive the same safe unavailable/not-found outcome before protected detail access. STAFF SHALL see assigned Google work only. A SHALL not expose Direct Feedback selectors/copy/details or AI; internal module presentation/availability SHALL remain.

#### Scenario: Forged source và invalid filters

- **WHEN** a user supplies `source=DIRECT`, `ALL` or malformed Avis filters in A
- **THEN** server results SHALL remain limited to actor-permitted Google work and counts

#### Scenario: Selected DIRECT hoặc foreign tenant ID

- **WHEN** a selected query or detail path contains a DIRECT, foreign-tenant or actor-inaccessible ID
- **THEN** protected detail SHALL not be provided and the outcome SHALL not disclose its existence, author, contact or content

#### Scenario: STAFF selected unassigned Google item

- **WHEN** STAFF requests Google work not assigned to that actor
- **THEN** list/detail SHALL deny it under the existing record scope, even when Avis is an available route

#### Scenario: Expired Google copy with retained work

- **WHEN** permitted Google work has an expired/absent importer-owned provider copy
- **THEN** Avis SHALL present only readable independent work and missing-content recovery, without the expired provider text/rating/author/reply or an automatic STAFF fetch

#### Scenario: Legacy Google content without provenance

- **WHEN** a permitted Google row lacks importer-owned provenance
- **THEN** its existing authorized view SHALL remain without being claimed as current retrieval or silently moved into cleanup ownership

### Requirement: A mutations giữ Google source trong persistence boundary

A status/assignment change, internal note and manual draft SHALL target only Google work readable under the actor's trusted scope and permitted operation grant. Independent local-work mutations SHALL remain eligible when the provider copy is unavailable, subject to the reviewed quoted/freeform-content contract; expiry SHALL not grant new privileges or require destruction of authored work. Browser source SHALL not determine scope. Forged DIRECT/foreign/inaccessible IDs SHALL cause no record change, note, reply or successful mutation audit. OWNER/MANAGER management and assigned STAFF note/draft constraints SHALL remain. Explicit draft Save SHALL use the existing validation/busy/persisted-result behavior and SHALL NOT approve/publish or call Google.

#### Scenario: DIRECT status hoặc note action

- **WHEN** an authorized A user sends a DIRECT ID through status/assignment/note
- **THEN** the mutation SHALL be denied without changing the record, creating a note/reply or successful mutation audit

#### Scenario: Assigned STAFF draft Save

- **WHEN** STAFF saves a valid independently authored manual draft for assigned Google work
- **THEN** the draft SHALL persist through the existing scoped flow without approval/publication/provider calls

#### Scenario: STAFF management hoặc inaccessible target

- **WHEN** STAFF attempts management, or any actor supplies a foreign/inaccessible target
- **THEN** existing grant/record denial SHALL remain and no forbidden mutation effect SHALL occur

#### Scenario: Local work after Google expiry

- **WHEN** an actor has the existing grant and scoped work access while its provider copy is absent
- **THEN** permitted independent local-work editing SHALL remain available without treating Save as retrieval or renewing provider-content lifetime

### Requirement: Today A dùng cùng Google local handling queue

Today A SHALL project only Google local work readable in the actor's scope. Importer-owned expired provider copies SHALL not be read/serialized for the projection, while retained readable independent work SHALL remain in its handling queue with honest missing-content presentation. `new` SHALL mean local status `NEW`; attention SHALL mean `NEW`, `TO_PROCESS`, `DRAFTED` or `FOLLOW_UP`. Attention total, preview and linked full list SHALL share the same source/status/actor/work-eligibility predicate; preview limits SHALL not reduce the total. STAFF SHALL see assigned work only. Expiry or a local `PUBLISHED` reply SHALL not remove attention work or imply remote reply/response-rate truth. Booking, Direct Feedback and AI SHALL not be read/serialized/displayed in A Today. Today rendering SHALL not initiate provider retrieval. Loaded Google coverage SHALL not be described as complete provider history or all-history handled.

#### Scenario: Preview nhỏ hơn queue

- **WHEN** the permitted attention queue exceeds the preview limit
- **THEN** total SHALL cover the entire local queue, preview SHALL be a subset and the linked paginated list SHALL share that total

#### Scenario: Status và local published reply

- **WHEN** readable work has attention/terminal statuses or a local PUBLISHED reply
- **THEN** counts/selection SHALL follow accepted handling statuses without remote/publication inference, and new SHALL count NEW only

#### Scenario: STAFF queue khác OWNER

- **WHEN** STAFF and OWNER load Today for the same establishment
- **THEN** each actor SHALL receive internally consistent totals/preview/list for their record scope without sharing the OWNER total with STAFF

#### Scenario: Provider content expires while work remains actionable

- **WHEN** readable local NEW/TO_PROCESS/DRAFTED/FOLLOW_UP work loses its importer-owned Google content
- **THEN** its local queue membership SHALL remain, expired provider fields SHALL not be used, and Today SHALL not attempt retrieval or claim remote completeness

### Requirement: Setup và empty states không bịa import evidence

A SHALL distinguish missing Google connection, no actual retrieval evidence, pending/failed/current-binding successful retrieval, genuinely successful empty recent retrieval, usable partial content, expired/unavailable content and retained independent work. A binding, seed row, redirect or local edit timestamp SHALL NOT prove retrieval. Successful freshness SHALL describe only the persisted corresponding page/batch and SHALL not advance after failure. An empty older page, expiry or an empty persisted inbox SHALL not imply zero reviews at Google. Unknown-provenance stored Google rows SHALL retain their existing scoped readability without claimed retrieval/provider readiness. OWNER SHALL manage connector setup; MANAGER/STAFF SHALL receive the appropriate handoff. Eligible OWNER/MANAGER SHALL receive the established-connector retrieval/retry/history/detail actions under the retrieval contract; STAFF SHALL not gain them. Recovery copy SHALL be actionable without database/migration/seed instructions or permanent exact-linkage promises.

#### Scenario: Missing connection không có stored reviews

- **WHEN** no Google connection or readable work exists
- **THEN** OWNER SHALL receive the permitted setup step and MANAGER/STAFF the appropriate OWNER/operator handoff, without an imported-zero claim

#### Scenario: Bound connector và empty inbox

- **WHEN** a location binding exists without usable stored work or actual retrieval evidence
- **THEN** A SHALL distinguish first retrieval/pending/error from genuine empty success, with role-appropriate action and no invented outcome

#### Scenario: Stored records với provenance chưa xác định

- **WHEN** readable stored Google rows lack actual retrieval provenance
- **THEN** inbox/queue SHALL remain available under their existing scope without a claimed provider-ready retrieval time

#### Scenario: Actual recent empty retrieval

- **WHEN** a validated recent retrieval really returns no reviews and its current-binding outcome is persisted
- **THEN** A SHALL present truthful successful-empty evidence distinct from not-run/failure or an empty older page

#### Scenario: Refresh fails or provider copy expires

- **WHEN** a prior successful page later fails to refresh or its content expires
- **THEN** A SHALL retain readable independent work, preserve truthful earlier success time, deny expired content and show actionable role-scoped retry/reconnect/unavailable-content recovery

#### Scenario: Provider reference unavailable

- **WHEN** retained work has no still-permitted authorized provider reference
- **THEN** A SHALL show the local work plus Google unavailable and OWNER/MANAGER/support recovery without guessing or promising exact permanent restoration
```

## Historical invalidation and prior Gate 2 packet

Full normalized preservation of previous packet, including earlier approval and invalidation. Prior raw SHA-256 `a6482f024150dcd0ab3d11a5f0816261ec255a51c3e4bb2748611274e8c5f72c`.

`````text
```text
Change: release-a-google-review-import
Gate: 2 — Specs
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

Prior raw-byte SHA-256: `eb6ae177af0fed48a6df2e47101c261e7dd96dff55c57b0d021ad642e403eb3c`. Complete line-ending-normalized textual preservation:

````text
```text
Change: release-a-google-review-import
Gate: 2 — Delta requirements
Review status: APPROVED
Created: 2026-10-01
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
COLLABORATION_MODE: CODEX_ONLY
MODE_SELECTION_SOURCE: explicit current-user instruction, duyệt, đổi lựa chọn codex làm với tôi thành codex có thể làm 1 mình
COMMIT_AFTER_TASK: YES
COMMIT_SELECTION_SOURCE: actual current-user named-task intake, YES — commit local khi task hoàn tất
Commit destination: isolated completed task changes, local main
Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Independent reviewer: /root/google_retrieval_gate2_independent
Independent review evidence: APPROVED, no actionable requirement-level findings; exact identities below
Approval recorded by: Codex workflow
Approved: 2026-10-01T17:54:30.3025855Z
Workflow state: GATE_2_APPROVED_PREPARE_SENSITIVE_DESIGN
```

## Independent approval record

Fresh-context read-only reviewer `/root/google_retrieval_gate2_independent` returned APPROVED for this exact Gate 2 candidate. The reviewer inspected both deltas, their embeddings, the approved Gate 1 content, canonical RR-02/RR-03 and preserved main-spec requirements/scenarios. No actionable requirement-level findings were reported. The author rechecked every reviewed candidate identity and the pending packet hash before recording this verdict.

Pending Gate 2 packet reviewed SHA-256: `2259fb7e4a879746354335b92f96904d9aab3c1f0ed1f4af689cb8f472dd0ebd`. The six candidate identities in this packet remain unchanged. Both delta embeddings and Gate 1 artifact embeddings matched. The change path-set was metadata/Proposal/Analysis plus the two declared deltas; review path-set was Gate 1 and Gate 2 only.

The reviewer confirmed 11 new requirements/40 scenarios and four modified exact existing requirements/19 scenarios, preserving all 12 original scenarios and adding seven. Actor/resource denials, assigned STAFF scope, Google-only A, Today queue semantics, local Save behavior and internal availability were assessed as coherent.

This delegated approval permits sensitive Design preparation only. GI-06/07/08 remain pre-dependent-Apply blockers; GI-05 actual project/location, permitted cache/use and backup/restoration remain real-provider prerequisites. A changed retention UX requires actual Human Product review. Earlier pending/request language below is the presented candidate context, superseded by this exact approval record.

## Scope and earlier authority

The Human approved [Gate 1](01-analysis-review.md) on its exact Proposal/Analysis identities, then explicitly changed this same task to CODEX_ONLY. The frozen approved artifacts retain historical Human-mode context. This packet carries the prospective mode override from that existing approval record. The author cannot self-approve this Gate 2; the independent reviewer needs a fresh context and must inspect the candidate directly.

Baseline remains local `main` at `936da4723ceafc2f5ff5bcfddbeaa15a92a69b57`. No branch/worktree, runtime/source/schema/environment/data/provider operation, staging/commit or remote operation was performed. New task delivery at this gate is exactly the two declared delta specs and this packet. Complete repository delivery remains the task intent, subject to required authority and operational prerequisites; no deployment/live enablement is delegated.

- New capability: `reputation/google-review-retrieval`.
- Modified existing capability: `backoffice/release-a-customer-exposure`.
- No `skip_specs`, capability rename of existing main specs, new package/app, AI, publication or scheduled provider synchronization.

## Requirements and scenarios

The new capability contains **11 requirements / 40 scenarios**. It covers actor/resource authorization, confirmed first continuation and established-connector retrieval, immediate saved work and real stale visits, manual refresh, requested 50-sized pages, scoped idempotence/conflict/bind fencing, provider edits and separate remote replies, editing continuity, persisted truthful outcomes, secure temporary cache/physical cleanup, conditional individual recovery, quotation handling and separate real-provider/legacy authority.

The exposure delta modifies **4 exact existing requirements / 19 scenarios**, including their complete updated scenario blocks. Existing Vietnamese titles are preserved for exact requirement matching; new technical bodies follow the current root English instruction. It distinguishes Google work from provider-content eligibility on Avis/mutations/Today/setup without changing the five surfaces, DIRECT denials, assigned STAFF, local NEW/attention semantics or internal module availability.

Current flow 3 boundaries are retained:

- OWNER verifies/manages the connector and confirmed first continuation. OWNER/MANAGER retrieve for an established connector. STAFF works with assigned eligible cache/independent work and receives handoff; no STAFF/provider grant.
- 50 is a page size with requested more history, not a total work limit or a permitted unlimited cache volume.
- A failed/expired/older-empty result is not a genuine zero-review location; freshness reflects only actual persisted success.
- Independent work/text survives expiry. Google-derived fields/references/copies have reviewed temporary retention and physical cleanup.
- Exact recovery/deduplication depends on still-permitted scoped mapping. Missing mapping keeps local work + Google unavailable, without author/text matching or permanent linkage promises.
- Retrieved reply presence/moderation remains separate from local draft Save/approval/publication.
- No provider call from Today, STAFF route visits, prefetch, local filters/assignment/note/draft Save. Real stale Avis visits and eligible manual actions are distinct.
- New importer-owned rows have explicit lifecycle; unknown-provenance legacy/demo rows are not adopted, re-dated or purged.

## Canonical review sources

- Root/scoped [instructions](../../../AGENTS.md), [Backoffice](../../../apps/backoffice/AGENTS.md), [db-cloud](../../../packages/db-cloud/AGENTS.md), [contracts](../../../packages/contracts/AGENTS.md).
- [Task collaboration/delegated review](../../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review), [Authority Model](../../AUTHORITY_MODEL.md), [current state](../../CURRENT_STATE.md).
- [Roadmap RR-02/RR-03](../../PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions), [Reputation](../../features/reputation/README.md), [Today](../../features/today/README.md).
- Existing [exposure spec](../../../openspec/specs/backoffice/release-a-customer-exposure/spec.md), [draft pending spec](../../../openspec/specs/reputation/reply-draft-pending-feedback/spec.md).
- Exact approved Proposal/Analysis content and the controlling-source hashes are in Gate 1. No later source read turns absent provider operations into implemented/live behavior.
- Official provider sources: [policies](https://developers.google.com/my-business/content/policies), [reviews.list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list), [reviews.get](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/get). The candidate treats actual project/location eligibility and permitted retention/use as separate prerequisites, not inferred Google approval.

## Remaining ambiguity and authority limits

No new Product assumption is introduced to resolve a requirement-level conflict. The following approved conditional blockers remain:

- **GI-05:** real project/location access, permissible cache/use quantity and cleanup/backup/restoration contract remain unverified; no real-provider use.
- **GI-06:** sensitive Design must resolve exact stale interval, field minimization, grants/seams, cursor/binding concurrency, scoped identity conflicts, outcome/transaction, cleanup and logging.
- **GI-07:** arbitrary single-string notes/drafts have no authored/quoted provenance today. There is no feasible verified freeform quotation-handling contract yet. The spec does not exempt all pasted text or authorize whole-note purge. Resolve before dependent Apply; changed Product consequences require Human review.
- **GI-08:** no indefinite reviewId exemption is verified. Exact recovery is conditional, with a concrete missing-reference fallback; Design must implement retention/cleanup without a permanent-linkage promise.
- **LANG-01:** exact existing main-spec titles stay unchanged for modified-requirement matching; English technical bodies comply with higher-priority current user root instructions. OpenSpec config and history remain unchanged.

Read-only storage discovery established that separate temporary provider copies and stable internal work are technically feasible, while current freeform text is an evidenced pre-Apply constraint. That advice is not a gate verdict, permission or provider interpretation. The reviewer must evaluate the candidate independently.

## Exact reviewed identities

Hash command: `Get-FileHash -LiteralPath <path> -Algorithm SHA256`, exact bytes, lowercase hexadecimal, ordinal sorted paths. Review packet itself is not self-hashed. Gate 1 approval and its six controlling identities must also be rechecked before later progression.

| Path                                                                                                 | SHA-256                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/release-a-google-review-import/01-analysis-review.md                                    | 59a23ca97f2a3cd55287828acbfb97babd02c94313f3111d6cca7f3f8f4290a1 |
| openspec/changes/release-a-google-review-import/.openspec.yaml                                       | edbcd0b0cb2d4619b326f4293e56c1d31f5ce6be37dda83923ff58267b46f1ab |
| openspec/changes/release-a-google-review-import/analysis.md                                          | 3a469d3de814956f04bc983a76a9471be70af8a0f98f6ed7a80abd68aaa442f1 |
| openspec/changes/release-a-google-review-import/proposal.md                                          | 36e44c32654a027fe13290491b4e0bf12cfbdc1cbbe2ed2245b5716b68195414 |
| openspec/changes/release-a-google-review-import/specs/backoffice/release-a-customer-exposure/spec.md | 5af09c087c4dc567e70320d20f952240094573a69a92e6a0894f734e2521fab8 |
| openspec/changes/release-a-google-review-import/specs/reputation/google-review-retrieval/spec.md     | 83121b2f96bc914b230206f5ffc2ca54739f5b968c84df1f6c8924a8a2ad4f1e |

## Validation and evidence limits

Command:

```text
openspec validate release-a-google-review-import --type change --strict --json --no-interactive
```

Result: exit code **0**, `valid: true`, `issues: []`; summary `items: 1, passed: 1, failed: 0`; actual schema `yuta-spec-driven`.

- `pnpm docs:check`: PASS, 36 current documents.
- `pnpm architecture:check`: PASS.
- `pnpm -r --if-present typecheck`: PASS, every workspace script completed.
- `pnpm format:check`: PASS; preservation passed for 67 protected exact paths and all matched files passed Prettier. Packet generation was followed by its own exact-path formatting check.
- Exact-path Prettier and identity/embedding recheck follow packet generation.

Application/cloud/local/provider/database tests, builds and Browser QA are not run at this requirements-only gate because implementation is absent. Strict validation checks syntax/coherence, not runtime behavior, provider permission or gate approval. Existing runtime/services/environment/secrets and DB schemas are untouched.

## Exact delta: reputation/google-review-retrieval

```markdown
## Purpose

Define authorized Google review retrieval and scoped work continuity for Release A, including requested history, truthful outcomes and temporary provider content without a permanent linkage or publication promise.

## ADDED Requirements

### Requirement: Trusted actor and provider resource authority precede retrieval

Google review retrieval SHALL require a validated server session, active membership, trusted organization and establishment, the existing Reputation prerequisites, and a server-verified current Google account/location binding. OWNER SHALL manage and confirm the connector and first continuation. OWNER/MANAGER SHALL be eligible for visit/manual refresh, requested older pages and conditional detail recovery through an established connector. STAFF SHALL NOT initiate provider retrieval, manage the connector or gain access beyond assigned local work. Browser-provided scope, role, binding, cursor and review identity SHALL NOT establish authority. Authorization denial SHALL occur before credential, provider and mutation access.

#### Scenario: OWNER confirms and continues

- **WHEN** an eligible OWNER confirms a server-verified location and continues to Avis
- **THEN** YUTA SHALL offer first retrieval for that binding with a distinct persisted retrieval outcome; binding alone SHALL NOT mean retrieval succeeded

#### Scenario: Existing binding or reconnect

- **WHEN** an eligible OWNER returns to an already-bound connector, including a same-location reconnect without a successful retrieval
- **THEN** a permitted first-retrieval/retry path SHALL remain available without requiring a different location selection

#### Scenario: MANAGER uses established connection

- **WHEN** an eligible MANAGER requests refresh, older history or individual recovery for the established connector
- **THEN** YUTA SHALL enforce the retrieval contract without granting connector management, OAuth setup or access to the OWNER-only Integrations route

#### Scenario: STAFF or revoked access attempts retrieval

- **WHEN** STAFF, an unauthenticated actor or an actor with stale/revoked membership invokes any review retrieval operation
- **THEN** YUTA SHALL deny it before credential/provider/persistence effects, including when a permitted page route is otherwise readable

#### Scenario: Forged foreign resources

- **WHEN** an actor supplies another organization's or establishment's review, binding or pagination reference
- **THEN** YUTA SHALL deny it without disclosing protected resource existence/content or causing provider/storage effects

### Requirement: Eligible saved work renders before visit-triggered retrieval

The Avis list/detail SHALL render actor-readable local work and still-eligible cached Google content without waiting for Google. An actual eligible OWNER/MANAGER visit SHALL request retrieval when the current content is absent or stale under the reviewed freshness rule. Manual `Actualiser` SHALL remain available for an established connector. STAFF visits, Today rendering, route prefetch, filter changes, assignment, notes and draft Save SHALL NOT initiate provider retrieval. No unattended provider polling or scheduled synchronization SHALL be introduced. Pending/failure SHALL preserve usable local work and eligible cached content.

#### Scenario: Cache is usable while retrieval is pending

- **WHEN** an eligible OWNER/MANAGER opens Avis with stale but unexpired cached content and saved work
- **THEN** existing work/content SHALL render before Google completes, with a visible pending indicator and no false success timestamp

#### Scenario: Cache is sufficiently fresh

- **WHEN** an eligible actor opens Avis while the current content satisfies the reviewed freshness rule
- **THEN** the visit SHALL use the eligible saved view without an unnecessary provider retrieval; an eligible OWNER/MANAGER SHALL still have manual refresh

#### Scenario: First visit has no usable Google content

- **WHEN** the established connector has no usable fetched copy or successful retrieval evidence
- **THEN** Avis SHALL show the truthful first-retrieval/pending/retry state and any readable local work, without representing an empty persisted inbox as zero reviews at Google

#### Scenario: Non-visit interaction

- **WHEN** a route is prefetched, Today is rendered, STAFF opens an assigned item, or an actor changes a filter/assignment/note/draft
- **THEN** the interaction SHALL cause no Google review retrieval

### Requirement: Requested coverage is paginated and truthfully described

First/recent retrieval SHALL request up to 50 reviews per page in provider-update-time order. The UI SHALL describe recently updated reviews, not promise that they were recently authored. `Voir plus d’avis` SHALL request the next older page only when an eligible OWNER/MANAGER requests it with a valid current scoped continuation. The loaded page size SHALL NOT cap retained independent YUTA work. Coverage and successful freshness SHALL refer to the actual page/batch, not all provider history. Provider cache quantity SHALL remain limited under its separately verified permitted-use contract; page-size support SHALL NOT be represented as permission to retain unlimited history.

#### Scenario: More provider history exists

- **WHEN** a first/recent page succeeds and has a valid next-page continuation
- **THEN** YUTA SHALL expose requested more-history behavior and indicate partial coverage without claiming all reviews are loaded or handled

#### Scenario: Older review was recently edited

- **WHEN** an older review appears in the recent page because of its provider update time
- **THEN** the presentation SHALL describe recent updates without identifying it as newly authored solely from its position

#### Scenario: No further page

- **WHEN** a valid requested older page has no further continuation
- **THEN** YUTA SHALL indicate the current coverage end; an empty older page SHALL NOT become a claim that the location has zero reviews

#### Scenario: Wrong or stale pagination continuation

- **WHEN** a requested continuation belongs to another binding/scope or is no longer valid
- **THEN** YUTA SHALL deny/recover safely, preserving work and prior successful evidence without fetching or attaching foreign content

### Requirement: Validated scoped identity prevents destructive replay

YUTA SHALL validate provider responses and associate a review only through its trusted provider identity, current location binding and YUTA organization/establishment while the identity mapping is permitted and available. A newly encountered review SHALL create local `NEW` work without an invented assignee. Retrieval replay SHALL NOT duplicate a review under an available permitted mapping, overwrite local status/assignment/independent notes/drafts/history, reassign another establishment's record, or silently adopt an unknown-provenance legacy/demo record. Absence from the recent page SHALL NOT mean deletion. Invalid responses, stale-binding results and conflicting scope SHALL NOT be persisted as successful retrieval.

#### Scenario: Repeated retrieval with unchanged reviews

- **WHEN** a valid review is returned again under the same permitted scoped mapping
- **THEN** YUTA SHALL update only its fetched provider copy/provenance, preserve local work and avoid another work record

#### Scenario: First retrieval contains old reviews

- **WHEN** a valid first page contains reviews not previously represented by a permitted scoped mapping
- **THEN** they SHALL enter local NEW work without invented assignment, while presentation SHALL NOT call all of them newly authored at Google

#### Scenario: Review is absent from current recent page

- **WHEN** a previously encountered review is omitted from the newly retrieved page
- **THEN** its local work SHALL remain and its old provider copy SHALL keep its own existing expiry deadline

#### Scenario: Binding changes before result commit

- **WHEN** the active account/location binding or relevant authorization changes while retrieval is in flight
- **THEN** obsolete results SHALL NOT be committed or presented as success for the new binding

#### Scenario: Cross-establishment or legacy identity collision

- **WHEN** an incoming identity conflicts with another establishment or an unknown-provenance legacy row
- **THEN** retrieval SHALL not reassign/adopt the row or overwrite protected content/work; the result SHALL offer a scoped safe conflict/recovery outcome

#### Scenario: Invalid provider response

- **WHEN** provider data fails boundary validation or contradicts the current verified resource
- **THEN** YUTA SHALL report failure without partial success, fabricated zero or unauthorized content persistence

### Requirement: Provider edits and remote replies remain separate from local work

A retrieved change to provider rating/comment SHALL produce a review-needed indication for the local work without automatically resetting its handling state or overwriting its draft. Retrieved remote replies SHALL be presented separately from YUTA notes/drafts and local approval/publication states. Remote reply presence SHALL NOT establish YUTA publication or completed provider moderation. Local draft Save SHALL retain its existing explicit persisted-result/pending semantics and SHALL NOT approve/publish or call the provider.

#### Scenario: Customer edits rating or text

- **WHEN** a subsequent permitted fetch changes the rating/comment of a known review
- **THEN** YUTA SHALL indicate `Avis modifié — à vérifier` or equivalent, keep existing local handling/draft and invite rechecking it

#### Scenario: Remote reply changes

- **WHEN** a valid fetched reply differs from the earlier eligible provider copy
- **THEN** YUTA SHALL update the remote-reply presentation without overwriting the local draft or inferring a local approval/publication

#### Scenario: Draft Save

- **WHEN** an authorized actor saves valid independent local draft content
- **THEN** YUTA SHALL use the existing local Save/pending/result behavior, with `Brouillon — non publié` or equivalent truthful copy and no external effect

### Requirement: Retrieval preserves the active writing context

Review retrieval SHALL NOT change the selected work item, replace unsaved note/draft input, or reorder the active working context under the cursor. New items SHALL be announced through an accessible non-disruptive indication; users SHALL control when to inspect the updated list. Loading, error and success indicators SHALL preserve keyboard/focus behavior and accessible names.

#### Scenario: New reviews arrive while writing

- **WHEN** an actor is editing unsaved input and a retrieval brings new reviews
- **THEN** the selected item and input SHALL remain unchanged and an accessible added-items notice SHALL permit later inspection

#### Scenario: Retrieval fails while writing

- **WHEN** a pending retrieval fails during local editing
- **THEN** the UI SHALL preserve input/focus and show actionable retry/reconnect without converting the form or list to a successful empty state

### Requirement: Outcomes and freshness have persisted truthful evidence

YUTA SHALL distinguish never performed, pending, failed, completed-empty, completed-with-content and expired/unavailable content outcomes for the current binding/scope and retrieval kind. Successful freshness SHALL advance only when the corresponding validated result is persisted. Seeded rows, a redirect, OAuth/binding success and local edit timestamps SHALL NOT prove provider retrieval. An empty older page, expired cache or failed call SHALL NOT establish a zero-review location. Receipts/logs SHALL be minimized and SHALL NOT retain provider content or credentials outside their reviewed retention class.

#### Scenario: True first/recent empty success

- **WHEN** a validated first/recent retrieval genuinely returns no reviews and its scoped successful outcome is persisted
- **THEN** YUTA SHALL show a completed-empty outcome distinct from never-run/error, with truthful successful retrieval time

#### Scenario: Failed refresh after prior success

- **WHEN** retrieval fails after an earlier successful page
- **THEN** YUTA SHALL preserve the earlier successful freshness, retain work and only unexpired content, and show failure/retry rather than zero

#### Scenario: Bound connector or seeded rows only

- **WHEN** a binding or stored legacy rows exist but no actual current retrieval receipt exists
- **THEN** YUTA SHALL not invent pending, failure, success or verified provider freshness from them

### Requirement: Temporary provider copies expire independently from local work

Each actually retrieved Google copy SHALL have verified provenance, actual retrieval time and a secure temporary deadline no later than 30 calendar days from retrieval. Expired provider content SHALL NOT be read, serialized, displayed or used from any shared consumer, including internal mode. Actual physical removal of expired subject content/references/copies SHALL occur through the reviewed unattended cleanup lifecycle and SHALL NOT fetch Google reviews. Local edits, failed retries, page omissions or restoration SHALL NOT renew fetched copies. Independent local work SHALL survive expiry/cleanup without cascading deletion or an automatic handling-status change.

#### Scenario: Expired content requested before physical cleanup

- **WHEN** the provider copy has expired but its cleanup has not yet removed the stored bytes
- **THEN** every consumer SHALL deny that provider content while returning only the actor-readable independent work and unavailable-content state

#### Scenario: Cleanup without active users

- **WHEN** provider content reaches its deadline while no user visits YUTA
- **THEN** the reviewed cleanup lifecycle SHALL physically remove subject provider bytes/references without requiring a user visit or performing a provider fetch, preserving independent work

#### Scenario: Recent page refresh leaves older work

- **WHEN** only the recent page is fetched again
- **THEN** fetched copies SHALL receive new provenance/deadlines, omitted copies SHALL retain their own deadlines, and older independent work SHALL not be removed

#### Scenario: Restored old provider copy

- **WHEN** an older persisted copy is restored under the reviewed backup/restoration contract
- **THEN** it SHALL not regain eligibility or have its deadline reset; expired subject copies SHALL remain denied and be physically removed

### Requirement: Individual recovery is conditional on a permitted trusted reference

OWNER/MANAGER individual recovery SHALL require readable local work, a still-permitted trusted provider reference and verified current account/location authority. A successful fetch SHALL attach only a validated matching review and create a new temporary copy. If a reference is no longer permitted/available, YUTA SHALL preserve local work, mark its Google content unavailable and offer role-appropriate OWNER/MANAGER/support recovery without guessing linkage. YUTA SHALL NOT promise indefinite reviewId retention, permanent exact recovery or complete historical deduplication after permitted identity mapping expires.

#### Scenario: Expired content with a usable reference

- **WHEN** an eligible OWNER/MANAGER opens work whose Google content is unavailable but a permitted trusted matching reference exists
- **THEN** YUTA SHALL attempt the eligible single-review retrieval and preserve local work throughout pending/error/success

#### Scenario: No permitted provider reference remains

- **WHEN** the associated provider reference has expired, been removed or cannot be authorized
- **THEN** YUTA SHALL show the preserved scoped work with unavailable Google content and recovery guidance; it SHALL not guess association from author names or text or claim a fetch succeeded

#### Scenario: Google cannot find the referenced review

- **WHEN** an authorized individual request returns NOT_FOUND
- **THEN** YUTA SHALL show `Avis indisponible sur Google` or equivalent and retain local work, without inventing whether the customer deleted it

#### Scenario: STAFF opens retained work

- **WHEN** STAFF opens assigned retained work whose Google copy is absent
- **THEN** YUTA SHALL offer the permitted local-work view and OWNER/MANAGER handoff without an automatic/provider retry grant

### Requirement: Provider-derived quotations do not receive a blanket local-text exemption

Independently authored YUTA notes/drafts SHALL survive provider cache expiry. Copied, quoted or derived Google content SHALL remain subject to its verified provider/privacy retention contract, including when pasted into freeform input. A whole-note/draft purge and unrestricted quotation retention SHALL NOT be inferred from this capability. A feasible explicit classification/handling contract SHALL be resolved in sensitive Design before dependent implementation or real-provider use. Any outcome that changes the accepted work-retention UX SHALL return to the owning Human Product review.

#### Scenario: Independent operational note

- **WHEN** a note contains independently authored operational work and the associated Google copy expires
- **THEN** provider cleanup SHALL retain the note and its actor-scoped usability

#### Scenario: Provider quotation or pasted text

- **WHEN** a local field contains copied/derived Google content
- **THEN** YUTA SHALL not classify it as exempt solely because a user pasted it or silently delete the whole independent work record; dependent delivery SHALL remain blocked until its feasible explicit handling contract is reviewed

### Requirement: Provider use and legacy compatibility retain separate authority

Actual Google access, permitted cache/use quantity, identifier/quotation treatment, cleanup and backup/restoration behavior SHALL be verified for the actual project/location before real-provider data use. Source implementation, synthetic tests, Product selection and workflow review SHALL NOT establish provider eligibility or production activation. Existing unknown-provenance Google records SHALL retain their existing authorized readability and SHALL NOT be silently adopted, re-dated, purged or represented as retrieval proof. DIRECT and local/public application boundaries SHALL remain unchanged.

#### Scenario: Synthetic verification succeeds

- **WHEN** synthetic candidate checks pass without actual provider prerequisites
- **THEN** the report SHALL identify repository evidence and leave actual provider use/readiness unverified or blocked, without enabling it from that result

#### Scenario: Legacy records are displayed

- **WHEN** authorized legacy Google records have no importer-owned provenance
- **THEN** their existing readability SHALL remain, without silently adopting them into the new cache lifecycle or claiming actual retrieval evidence

#### Scenario: Unresolved permitted-use or text contract

- **WHEN** a required provider/retention contract remains unverified or conflicts with adopted Product behavior
- **THEN** dependent Apply or real data use SHALL stop at its owning review boundary; reviewer approval SHALL not fabricate missing authority
```

## Exact delta: backoffice/release-a-customer-exposure

```markdown
## MODIFIED Requirements

### Requirement: A Avis read scope luôn Google và actor-scoped

In A, inbox/list, counts, selected detail and deep-link detail SHALL expose only actor-readable Google work in the trusted organization/establishment. Provider content and independent local work SHALL have separate eligibility under `reputation/google-review-retrieval`: an expired/unavailable importer-owned Google copy SHALL not be read/serialized/displayed, while permitted independent work SHALL remain readable with a truthful unavailable-content state. Unknown-provenance legacy Google rows SHALL retain their existing authorized readability without silent adoption, re-dating or purge. Source/query/filter errors or fallback SHALL NOT broaden to DIRECT. A DIRECT/foreign/inaccessible ID SHALL receive the same safe unavailable/not-found outcome before protected detail access. STAFF SHALL see assigned Google work only. A SHALL not expose Direct Feedback selectors/copy/details or AI; internal module presentation/availability SHALL remain.

#### Scenario: Forged source và invalid filters

- **WHEN** a user supplies `source=DIRECT`, `ALL` or malformed Avis filters in A
- **THEN** server results SHALL remain limited to actor-permitted Google work and counts

#### Scenario: Selected DIRECT hoặc foreign tenant ID

- **WHEN** a selected query or detail path contains a DIRECT, foreign-tenant or actor-inaccessible ID
- **THEN** protected detail SHALL not be provided and the outcome SHALL not disclose its existence, author, contact or content

#### Scenario: STAFF selected unassigned Google item

- **WHEN** STAFF requests Google work not assigned to that actor
- **THEN** list/detail SHALL deny it under the existing record scope, even when Avis is an available route

#### Scenario: Expired Google copy with retained work

- **WHEN** permitted Google work has an expired/absent importer-owned provider copy
- **THEN** Avis SHALL present only readable independent work and missing-content recovery, without the expired provider text/rating/author/reply or an automatic STAFF fetch

#### Scenario: Legacy Google content without provenance

- **WHEN** a permitted Google row lacks importer-owned provenance
- **THEN** its existing authorized view SHALL remain without being claimed as current retrieval or silently moved into cleanup ownership

### Requirement: A mutations giữ Google source trong persistence boundary

A status/assignment change, internal note and manual draft SHALL target only Google work readable under the actor's trusted scope and permitted operation grant. Independent local-work mutations SHALL remain eligible when the provider copy is unavailable, subject to the reviewed quoted/freeform-content contract; expiry SHALL not grant new privileges or require destruction of authored work. Browser source SHALL not determine scope. Forged DIRECT/foreign/inaccessible IDs SHALL cause no record change, note, reply or successful mutation audit. OWNER/MANAGER management and assigned STAFF note/draft constraints SHALL remain. Explicit draft Save SHALL use the existing validation/busy/persisted-result behavior and SHALL NOT approve/publish or call Google.

#### Scenario: DIRECT status hoặc note action

- **WHEN** an authorized A user sends a DIRECT ID through status/assignment/note
- **THEN** the mutation SHALL be denied without changing the record, creating a note/reply or successful mutation audit

#### Scenario: Assigned STAFF draft Save

- **WHEN** STAFF saves a valid independently authored manual draft for assigned Google work
- **THEN** the draft SHALL persist through the existing scoped flow without approval/publication/provider calls

#### Scenario: STAFF management hoặc inaccessible target

- **WHEN** STAFF attempts management, or any actor supplies a foreign/inaccessible target
- **THEN** existing grant/record denial SHALL remain and no forbidden mutation effect SHALL occur

#### Scenario: Local work after Google expiry

- **WHEN** an actor has the existing grant and scoped work access while its provider copy is absent
- **THEN** permitted independent local-work editing SHALL remain available without treating Save as retrieval or renewing provider-content lifetime

### Requirement: Today A dùng cùng Google local handling queue

Today A SHALL project only Google local work readable in the actor's scope. Importer-owned expired provider copies SHALL not be read/serialized for the projection, while retained readable independent work SHALL remain in its handling queue with honest missing-content presentation. `new` SHALL mean local status `NEW`; attention SHALL mean `NEW`, `TO_PROCESS`, `DRAFTED` or `FOLLOW_UP`. Attention total, preview and linked full list SHALL share the same source/status/actor/work-eligibility predicate; preview limits SHALL not reduce the total. STAFF SHALL see assigned work only. Expiry or a local `PUBLISHED` reply SHALL not remove attention work or imply remote reply/response-rate truth. Booking, Direct Feedback and AI SHALL not be read/serialized/displayed in A Today. Today rendering SHALL not initiate provider retrieval. Loaded Google coverage SHALL not be described as complete provider history or all-history handled.

#### Scenario: Preview nhỏ hơn queue

- **WHEN** the permitted attention queue exceeds the preview limit
- **THEN** total SHALL cover the entire local queue, preview SHALL be a subset and the linked paginated list SHALL share that total

#### Scenario: Status và local published reply

- **WHEN** readable work has attention/terminal statuses or a local PUBLISHED reply
- **THEN** counts/selection SHALL follow accepted handling statuses without remote/publication inference, and new SHALL count NEW only

#### Scenario: STAFF queue khác OWNER

- **WHEN** STAFF and OWNER load Today for the same establishment
- **THEN** each actor SHALL receive internally consistent totals/preview/list for their record scope without sharing the OWNER total with STAFF

#### Scenario: Provider content expires while work remains actionable

- **WHEN** readable local NEW/TO_PROCESS/DRAFTED/FOLLOW_UP work loses its importer-owned Google content
- **THEN** its local queue membership SHALL remain, expired provider fields SHALL not be used, and Today SHALL not attempt retrieval or claim remote completeness

### Requirement: Setup và empty states không bịa import evidence

A SHALL distinguish missing Google connection, no actual retrieval evidence, pending/failed/current-binding successful retrieval, genuinely successful empty recent retrieval, usable partial content, expired/unavailable content and retained independent work. A binding, seed row, redirect or local edit timestamp SHALL NOT prove retrieval. Successful freshness SHALL describe only the persisted corresponding page/batch and SHALL not advance after failure. An empty older page, expiry or an empty persisted inbox SHALL not imply zero reviews at Google. Unknown-provenance stored Google rows SHALL retain their existing scoped readability without claimed retrieval/provider readiness. OWNER SHALL manage connector setup; MANAGER/STAFF SHALL receive the appropriate handoff. Eligible OWNER/MANAGER SHALL receive the established-connector retrieval/retry/history/detail actions under the retrieval contract; STAFF SHALL not gain them. Recovery copy SHALL be actionable without database/migration/seed instructions or permanent exact-linkage promises.

#### Scenario: Missing connection không có stored reviews

- **WHEN** no Google connection or readable work exists
- **THEN** OWNER SHALL receive the permitted setup step and MANAGER/STAFF the appropriate OWNER/operator handoff, without an imported-zero claim

#### Scenario: Bound connector và empty inbox

- **WHEN** a location binding exists without usable stored work or actual retrieval evidence
- **THEN** A SHALL distinguish first retrieval/pending/error from genuine empty success, with role-appropriate action and no invented outcome

#### Scenario: Stored records với provenance chưa xác định

- **WHEN** readable stored Google rows lack actual retrieval provenance
- **THEN** inbox/queue SHALL remain available under their existing scope without a claimed provider-ready retrieval time

#### Scenario: Actual recent empty retrieval

- **WHEN** a validated recent retrieval really returns no reviews and its current-binding outcome is persisted
- **THEN** A SHALL present truthful successful-empty evidence distinct from not-run/failure or an empty older page

#### Scenario: Refresh fails or provider copy expires

- **WHEN** a prior successful page later fails to refresh or its content expires
- **THEN** A SHALL retain readable independent work, preserve truthful earlier success time, deny expired content and show actionable role-scoped retry/reconnect/unavailable-content recovery

#### Scenario: Provider reference unavailable

- **WHEN** retained work has no still-permitted authorized provider reference
- **THEN** A SHALL show the local work plus Google unavailable and OWNER/MANAGER/support recovery without guessing or promising exact permanent restoration
```

## Independent review request and boundary

Return APPROVED, CHANGES_REQUESTED or BLOCKED with specific findings and exact reviewed identities. Inspect approved scope/authority and the full deltas rather than treating validation or this summary as approval. An APPROVED exact Gate 2 permits sensitive Design preparation, not Apply or actual provider use. No Design/Tasks/implementation, sync/archive, staging or commit before the required gate is actually approved.

````

`````
