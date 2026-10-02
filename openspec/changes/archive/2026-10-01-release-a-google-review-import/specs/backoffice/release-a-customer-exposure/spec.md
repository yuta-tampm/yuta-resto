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
