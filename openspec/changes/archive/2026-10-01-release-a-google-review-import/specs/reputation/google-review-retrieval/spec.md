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
