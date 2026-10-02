# Gate 2b — Sensitive Technical Design Review

Change: `reputation-review-social-links-configuration`

Review status: `APPROVED`

Approval source: `explicit current-user instruction`

Approval recorded by: `Codex workflow`

Approved: `2026-09-05T20:42:41.8460440+02:00`

Technical Design: `READY_FOR_REVIEW`

Sensitive Design: `AWAITING_HUMAN_REVIEW`

Tasks: `NOT_STARTED`

Apply: `NOT_AUTHORIZED`

Production: `NOT_AUTHORIZED`

Created: `2026-09-05T19:53:30.7231465+02:00`

Regenerated: `2026-09-05T20:31:13.1296158+02:00`

Schema: `yuta-spec-driven`

Classification: `CROSS_MODULE`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES — final Integration/Regression only`

## Approved authority and integrity

Gate 1 and the targeted Gate 2 amendment are approved. Exact bytes were
rechecked before Design:

| Artifact                                                                                                                   | SHA-256                                                            | Disposition                               |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| `openspec/changes/reputation-review-social-links-configuration/proposal.md`                                                | `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61` | Approved Gate 1 bytes unchanged           |
| `openspec/changes/reputation-review-social-links-configuration/analysis.md`                                                | `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d` | Approved Gate 1 bytes unchanged           |
| `openspec/changes/reputation-review-social-links-configuration/specs/reputation/review-social-links-configuration/spec.md` | `ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07` | Approved: 15 Requirements / 103 Scenarios |
| `docs/reviews/reputation-review-social-links-configuration/01-analysis-review.md`                                          | `2106185211b2db18a5164a2c721b14a08bba89be22a8f80f03abdbd9c74fe873` | Gate 1 APPROVED                           |
| `docs/reviews/reputation-review-social-links-configuration/02-specs-review.md`                                             | `28d2b28af0f2da0f4db1b4a374d55734951707daa9497d8b5686ee9ae1fb802c` | Gate 2 amendment APPROVED                 |
| `openspec/changes/reputation-review-social-links-configuration/design.md`                                                  | `3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582` | 16 decisions; regenerated for SD-R1/SD-R2 |

Approved missing-row decision is preserved exactly:

```text
FAIL_CLOSED / NO_AUTO_CREATE
Provisioning = OUT_OF_SCOPE / SEPARATE_PRODUCT_DECISION
```

No Proposal, Analysis, Spec, Gate 1 or Gate 2 semantic content was changed by
Technical Design.

## Targeted Sensitive Design correction

The prior packet SHA-256
`d0ef5b51b107dd87c42bc21ed4615dd176d55984e7697c6de82068833a1b2b42`
received `CHANGES_REQUESTED — TARGETED AUDIT-MARKER INTEGRITY CORRECTION
ONLY`.

The SD-R1-regenerated packet SHA-256
`416250f1f99cf66b9362eac6570efc3eb8c40f2a26ea634b6074796822804734`
then received `CHANGES_REQUESTED — TARGETED NULLABLE-ACTOR INTEGRITY
CLARIFICATION ONLY`.

| Item                                     | Requested correction                                                                                                                                                       | Regenerated result                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SD-R1 — audit-marker retention/integrity | Remove the overclaim that total qualified-history deletion is always detectable. Prove the current append-only invariant and make no-schema correctness conditional on it. | Design distinguishes `BASELINE_NO_EVENT`, valid event, malformed/ambiguous event and unsupported total-history deletion. Existing malformed/ambiguous evidence fails closed; total external deletion is explicitly not detectable and is an `UNSUPPORTED_INTEGRITY_VIOLATION`. Current repository append-only invariant is proven. |
| SD-R2 — nullable actor integrity         | Separate state-marker validity from replay attribution when the existing FK later nullifies `actorUserId`.                                                                 | A qualified event with `actorUserId === null` remains valid for token/predecessor/ABA when scope/action/metadata/state checks pass. D1 still requires positive same-actor proof; null/different actor cannot receive D1 and falls to D2 when current values equal proposed. State token remains actor-independent.                 |

All Technical Design decisions remain semantically unchanged. SD-R1 adjusts
D4/D7/D14/D16 integrity limits; SD-R2 clarifies D4/D6/D7/D8 plus direct D5/D13
consistency wording. No Product/Spec boundary was revised.

## Repository evidence

| Evidence                                                                                                                                                                                | Current repository fact used by Design                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`packages/db-cloud/src/schema/reputation.ts`](../../../packages/db-cloud/src/schema/reputation.ts)                                                                                     | Existing `reputation_settings` has three nullable URL columns and composite scope; Reputation audit supports `SETTINGS`, with nullable actor using `onDelete: 'set null'`. |
| [`packages/db-cloud/drizzle/0000_initial.sql`](../../../packages/db-cloud/drizzle/0000_initial.sql)                                                                                     | Existing timestamps are PostgreSQL `timestamp with time zone`; no revision column exists; Reputation actor FK is `ON DELETE set null`.                                     |
| [`packages/db-cloud/src/reputation-repository.ts`](../../../packages/db-cloud/src/reputation-repository.ts)                                                                             | Existing trusted scoped public read and transaction + audit patterns; no private writer for the three links.                                                               |
| [`packages/db-cloud/src/seed.ts`](../../../packages/db-cloud/src/seed.ts)                                                                                                               | Seed provisions full settings rows but does not write the three links; Design does not reuse seed as runtime provisioning.                                                 |
| [`packages/db-cloud/test/reputation-repository.integration.test.ts`](../../../packages/db-cloud/test/reputation-repository.integration.test.ts)                                         | The only repository delete of Reputation audit rows is fixture teardown in a test-only path; it is not exported or runtime-imported.                                       |
| [`apps/backoffice/src/server/auth/session.ts`](../../../apps/backoffice/src/server/auth/session.ts)                                                                                     | `requireReputationTenant` composes authenticated tenant, entitlement and `reputation.read`.                                                                                |
| [`apps/backoffice/src/server/auth/permissions.ts`](../../../apps/backoffice/src/server/auth/permissions.ts)                                                                             | `reputation.settings.manage` is OWNER-only; MANAGER/STAFF have base read only.                                                                                             |
| [`apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx`](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx>) | Existing route and direct-feedback inbox seam; no new route is needed.                                                                                                     |
| [`apps/feedback-web/src/app/[tenantSlug]/page.tsx`](../../../apps/feedback-web/src/app/%5BtenantSlug%5D/page.tsx)                                                                       | Missing public settings/config already yields `notFound()`; no public fallback/synthesis is needed.                                                                        |
| [`apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx`](../../../apps/feedback-web/src/app/%5BtenantSlug%5D/_components/feedback-form.tsx)                             | Existing CTA hides null but currently lacks provider validation and explicit `noopener`.                                                                                   |
| [`docs/ui/PAGE_PACK_PROTOCOL.md`](../../ui/PAGE_PACK_PROTOCOL.md)                                                                                                                       | New stable existing-page pack must be created with revision-4 structure/provenance before UI Apply.                                                                        |

Repository-supported `SELECT ... FOR UPDATE` already exists in db-cloud
repositories, and `REPEATABLE READ` is already used for coherent multi-read
snapshots. Design reuses those patterns rather than creating a concurrency
framework.

### Append-only inventory result

Search across `apps`, `packages`, `scripts` and `.github` found:

- runtime `packages/db-cloud/src/reputation-repository.ts` only inserts
  `reputationAuditEvents`;
- no runtime update/delete/truncate of `reputation_audit_events`;
- no generic Reputation audit cleanup, retention/purge job or administrative
  cleanup path;
- no runtime delete of `reputationSettings`;
- one test-only delete in
  `packages/db-cloud/test/reputation-repository.integration.test.ts` used to
  tear down isolated fixtures;
- package exports point to `src`, and no runtime file imports the test path;
- organization FK uses `ON DELETE no action`; actor FK uses `ON DELETE set
null`; neither cascades deletion of audit events;
- audit `entityId` has no cascade FK to the settings row.

Audit marker append-only invariant: `PROVEN` for the current supported
application lifecycle while the settings row remains an active configuration
source.

Nullable-actor evidence: `PROVEN`. Both executable schema and initial migration
allow `reputation_audit_events.actor_user_id` to become `null` through `ON
DELETE SET NULL`. This changes attribution availability, not the existence or
scope/action/metadata/state contents of the audit marker.

## Numbered Technical Decision review

| Decision | Bounded choice                                                                                   | Sensitive review assessment                                                                |
| -------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| D1       | Reputation remains owner; contracts/db-cloud/Backoffice/feedback-web keep current roles          | No owner, runtime or tenancy change                                                        |
| D2       | One strict pure provider policy in `@yuta/contracts/reputation`                                  | Prevents private/public policy drift; no provider calls                                    |
| D3       | Private read composes existing auth then distinguishes row missing from integrity/server failure | Missing row does not masquerade as authorization and creates nothing                       |
| D4       | Opaque SHA-256 token binds current values to latest qualified SETTINGS audit marker              | Token excludes actor; supported actor nullification does not change state version          |
| D5       | One scoped transaction + row lock + explicit decision table                                      | Prevents last-write-wins and partial settings/audit writes                                 |
| D6       | Exact predecessor transition + positive same-actor proof establishes equivalent replay           | Different/null actor remains valid marker but cannot establish D1 attribution              |
| D7       | Audit marker change detects A→B→A while the proven append-only invariant holds                   | Actor FK nullification preserves the event; future marker purge requires review            |
| D8       | One versioned action and minimal strict delta metadata                                           | New mutations record actor; later nullable actor does not invalidate strict state evidence |
| D9       | Discriminated safe transport outcomes; auth errors remain separate                               | UI can recover without DB/audit/tenant internals                                           |
| D10      | Public safe projection uses the same policy; existing missing-row 404 is preserved               | No new public Product behavior or tenant fallback                                          |
| D11      | One OWNER-only section on current Satisfaction route                                             | No route/navigation/permission expansion; MANAGER/STAFF inbox preserved                    |
| D12      | Stable pack `backoffice-visibilite-reputation-satisfaction` before UI Apply                      | Current UI authority process is respected                                                  |
| D13      | Layered tests + disposable PostgreSQL + final Browser QA                                         | Real concurrency/atomicity cannot be replaced by mocks                                     |
| D14      | Audit retention is not invented; present malformed/ambiguous evidence fails closed               | Total-history deletion is unsupported and not falsely claimed detectable                   |
| D15      | Google/social connector behavior remains independent                                             | No OAuth/provider/write ownership expansion                                                |
| D16      | No migration; ordered future implementation and preserve-data/roll-forward behavior              | No production operation or destructive rollback                                            |

Technical Design status: `READY_FOR_REVIEW`. Approval of this packet would
authorize Tasks planning only; it would not authorize Apply.

## Requirement-to-Design coverage — all 15 Requirements

|   # | Approved Requirement title                                                   | Design coverage    | Scenario count | Status  |
| --: | ---------------------------------------------------------------------------- | ------------------ | -------------: | ------- |
|   1 | Reputation sở hữu cấu hình theo trusted organization và active establishment | D1, D3, D5, D10    |              8 | COVERED |
|   2 | Settings dùng authority Reputation hiện hành và chỉ OWNER được truy cập      | D1, D3, D9, D11    |              5 | COVERED |
|   3 | Capability chỉ quản lý đúng ba giá trị nullable                              | D2, D9, D11        |              3 | COVERED |
|   4 | Thay đổi chỉ xảy ra qua một explicit Save                                    | D5, D9, D11        |              8 | COVERED |
|   5 | Save nhiều field là all-or-nothing                                           | D5, D8, D13        |              3 | COVERED |
|   6 | Normalized no-op không ghi và success trả authoritative state                | D2, D5, D9         |              3 | COVERED |
|   7 | Stale conflict và response-loss replay phải recoverable                      | D4, D5, D6, D7, D9 |              6 | COVERED |
|   8 | Mọi provider URL tuân thủ normalization và safety chung                      | D2, D8, D13        |             12 | COVERED |
|   9 | Google URL chỉ chấp nhận destination phục vụ review hoặc Maps                | D2, D13            |             17 | COVERED |
|  10 | Facebook URL có bounded provider-host policy                                 | D2, D13            |              8 | COVERED |
|  11 | Instagram URL có bounded provider-host policy                                | D2, D13            |              6 | COVERED |
|  12 | Google review URL là manual-only và độc lập GBP connector                    | D15                |              5 | COVERED |
|  13 | feedback-web chỉ render safe configured CTA theo trusted public scope        | D2, D10, D13       |              7 | COVERED |
|  14 | Real mutation và SETTINGS audit phải thành công hoặc thất bại cùng nhau      | D4, D5, D8, D14    |              8 | COVERED |
|  15 | Capability không mở rộng sang provider workflow hoặc production operation    | D1, D12, D15, D16  |              4 | COVERED |

Coverage: `15/15 Requirements`, `103/103 Scenarios` through traceable test
families. Design does not rewrite any behavioral requirement.

## Scenario-family and later evidence map — 103 Scenarios

| Family                               | Scenarios | Primary later evidence                                       |
| ------------------------------------ | --------: | ------------------------------------------------------------ |
| Trusted scope + missing settings row |         8 | db-cloud integration + Backoffice loader/action              |
| OWNER-only settings authority        |         5 | server authorization/action tests + UI absence tests         |
| Exact three nullable values          |         3 | contracts + repository + component model                     |
| Explicit add/replace/remove Save     |         8 | action/component + db-cloud integration                      |
| Atomic all-or-nothing                |         3 | disposable PostgreSQL failure injection                      |
| No-op + authoritative response       |         3 | repository/action integration                                |
| Conflict/replay/retry                |         6 | real concurrent PostgreSQL transactions + action recovery    |
| Common URL safety                    |        12 | contracts exhaustive table + persistence-negative assertions |
| Google exact hosts/paths             |        17 | contracts table tests                                        |
| Facebook exact hosts                 |         8 | contracts table tests                                        |
| Instagram exact hosts                |         6 | contracts table tests                                        |
| Manual Google/GBP independence       |         5 | repository inventory + regression tests                      |
| Safe feedback-web projection         |         7 | repository/public component/route tests                      |
| SETTINGS audit semantics             |         8 | disposable PostgreSQL transaction/audit assertions           |
| Explicit exclusions                  |         4 | scoped diff/inventory + architecture/docs evidence           |
| **Total**                            |   **103** | **Traceable later evidence required**                        |

Later evidence must additionally prove the runtime append-only inventory,
valid baseline-with-no-event behavior, malformed/ambiguous event fail-closed
behavior and a static guard against introducing a cleanup path. No test or
Browser QA is claimed as executed during Design.

## Missing-row matrix

| Surface/operation                 | Row exists                                         | Row missing                                           | Forbidden side effects                                            |
| --------------------------------- | -------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| Private OWNER read                | Return three authoritative values + state token    | `CONFIGURATION_UNAVAILABLE`                           | No synthetic values, cross-establishment fallback or row creation |
| Private OWNER Save                | Evaluate normal validation/concurrency transaction | `CONFIGURATION_UNAVAILABLE` under scoped lock attempt | No update/upsert/audit/default fields                             |
| MANAGER/STAFF                     | Settings section not loaded/rendered               | Same absence; no settings read attempted              | Missing row cannot grant or conceal authorization                 |
| Public feedback page              | Safe project existing row                          | Preserve existing fail-closed `notFound()` path       | No synthesis, changed tenant resolution or provisioning           |
| After separate valid provisioning | Reload may see authoritative row                   | Not applicable until row exists                       | This Design does not define or invoke provisioning                |

`brandVoice`, `publicFeedbackSlug` and every unrelated settings field are never
defaulted by this capability.

## Concurrency and replay decision table

`CURRENT == EXPECTED` means normalized values **and** opaque history-bound token
match.

| Case    | Predicate                                                                                                          | Result                                         | Write/audit                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ----------------------------------------------------------- |
| A       | Current equals expected; proposed equals current                                                                   | `NO_CHANGE`                                    | None                                                        |
| B       | Current equals expected; proposed differs                                                                          | Real `SUCCESS`                                 | One settings update + one SETTINGS audit in one transaction |
| C       | Current differs from expected; current values differ from proposed                                                 | `CONFLICT`                                     | None                                                        |
| D1      | Current differs; current values equal proposed; newest strict event proves same-actor exact predecessor transition | Equivalent replay `SUCCESS`                    | None; return committed authoritative state                  |
| D2      | Current differs; current values equal proposed; no exact replay proof, another actor produced it, or actor is null | `NO_CHANGE`, explicitly not replay attribution | None; return authoritative state                            |
| ABA     | Values equal old expected after A→B→A, token differs, proposed differs from current                                | `CONFLICT`                                     | None                                                        |
| Missing | Exact scoped settings row absent                                                                                   | `CONFIGURATION_UNAVAILABLE`                    | No create/upsert/update/audit                               |

### Same-state-by-different-actor analysis

`CURRENT VALUES == PROPOSED` alone never proves response-loss replay. If the
latest exact transition belongs to another actor, the server returns
`NO_CHANGE` because the desired state already exists, but does not claim that
the current caller's previous request committed. This honors no-op behavior,
avoids duplicate audit, and does not overwrite the other actor's state.

The same attribution limit applies when the latest event's `actorUserId` has
become `null` through the existing FK. The event remains valid state evidence,
but positive same-actor proof is unavailable: D1 MUST NOT be used, and
`CURRENT VALUES == PROPOSED` resolves as D2 `NO_CHANGE`. The system does not
infer which historical actor committed it.

### ABA analysis

For A(`T0`)→B(`E1`)→A(`E2`), current values are A but current token binds `E2`
and differs from `T0`. A stale caller proposing another state cannot pass the
mutation predicate and receives `CONFLICT`. A caller proposing A causes no
write and receives `NO_CHANGE`. Thus no stale mutation silently overwrites the
intervening history.

This conclusion depends on intact append-only qualified history. If all
qualified events are deleted outside the supported lifecycle, current durable
state cannot distinguish that violation from a legitimate no-event baseline;
the runtime does not claim otherwise.

## State-evidence distinction

| Evidence state                         | Runtime interpretation                                                                                                                                                       |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BASELINE_NO_EVENT`                    | No qualified event and no current evidence of prior qualified history. Legitimate initial token uses settings identity + null marker + current values.                       |
| `EVENT_PRESENT_VALID`                  | Strict scope/action/metadata and current/predecessor reconstruction pass; use for token/predecessor/ABA even when actor is null. Replay attribution is evaluated separately. |
| `EVENT_PRESENT_MALFORMED_OR_AMBIGUOUS` | Matching evidence exists but parse/chain/reconstruction fails; `SERVER_ERROR`, no write/audit.                                                                               |
| `ALL_HISTORY_EXTERNALLY_DELETED`       | Indistinguishable from baseline with current approved state. Classified `UNSUPPORTED_INTEGRITY_VIOLATION`; not guaranteed runtime-detectable.                                |

## No-schema concurrency proof

| Existing durable/current element | Design use                                                          | Why sufficient / limitation                                                                     |
| -------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Scoped `reputation_settings` row | Authoritative three values, locked by org + establishment           | Composite scope and row lock serialize supported link writers                                   |
| Three nullable URL columns       | Current and proposed normalized state                               | Exact value comparison handles normal stale/no-op cases                                         |
| `updatedAt`                      | Co-stamped informational timestamp only                             | Explicitly **not** trusted as sole revision because shared/millisecond behavior is insufficient |
| `reputation_audit_events`        | Required mutation evidence and new marker ID per real link mutation | Existing marker changes across A→B→A while append-only invariant holds; no new table/column     |
| `SETTINGS` + versioned action    | Isolates this capability's strict events                            | Unknown actions do not affect token; malformed matching events fail closed                      |
| Nullable audit actor             | New-mutation attribution and D1 proof while retained                | Actor is not in token; FK nullification preserves marker validity but disables D1 attribution   |
| Transaction + row lock           | Serializes read/decision/update/audit                               | Prevents concurrent writers sharing one predecessor and guarantees rollback                     |

The token is a derived SHA-256 digest, not stored state. The audit row is not
added solely for idempotency: the approved Spec independently requires exactly
one audit for every real mutation. New audit ID + current values supplies the
missing version evidence without schema. Qualified events get strictly
increasing millisecond-aligned recorded timestamps under the same row lock so
newest/previous ordering is deterministic; the token binds event ID, not the
timestamp alone.

This proof covers all current repository-supported mutations because this
becomes the single writer for the three link fields, current seed does not write
them, and qualified events are append-only in runtime. It does **not** claim
correctness after unsupported deletion of all marker history. A future second
writer, any cleanup/purge that may remove qualified markers, or a need for
durable request identity is a return-to-Product/Design stop condition.

This proof does not require actor identity in the canonical token. User
deletion may nullify the actor without changing the event ID, strict metadata
or reconstructed transition, so private read and a later normal authorized
Save remain valid. Only D1 same-actor attribution becomes unavailable.

Conclusion: no schema/migration is required for the **current repository
capability provided the proven append-only invariant remains true**.
`SCHEMA_OR_MIGRATION_REQUIRED_NEEDS_REVIEW` is not triggered by this current
scope.

## Transaction and failure matrix

| Stage/failure                                     | Required result                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Auth/session/membership/establishment deny        | Existing 400/403/redirect semantics; repository mutation not called                        |
| Strict payload or any provider validation fails   | `VALIDATION_ERROR`; no transaction write/audit; rejected value not logged                  |
| Scoped row missing after lock attempt             | `CONFIGURATION_UNAVAILABLE`; no upsert/default/audit                                       |
| State token stale and proposed materially differs | `CONFLICT`; current state preserved                                                        |
| Normalized no-op                                  | `NO_CHANGE`; no update/audit                                                               |
| Settings update fails                             | Transaction rollback; no audit                                                             |
| Audit insert fails                                | Transaction rollback settings update; no orphan/partial state                              |
| Commit succeeds                                   | Exactly one mutation-level audit and authoritative values/token returned                   |
| Response lost then exact replay                   | Strict predecessor proof; return outcome without duplicate write/audit                     |
| Qualified event actor belongs to another user     | Valid marker; no D1 attribution; same desired current state returns D2 `NO_CHANGE`         |
| Qualified event actor was nullified by FK         | Valid marker/read/token; no D1 attribution; normal authorized mutation remains available   |
| Matching-action audit metadata corrupt            | Private concurrency path `SERVER_ERROR`/fail closed; no write; no raw metadata exposed     |
| All qualified history externally deleted          | Unsupported integrity violation; not guaranteed detectable and not an authorized lifecycle |

## Authorization and tenancy matrix

| Actor/context                                                  | `reputation.read`              | `reputation.settings.manage` | Settings result                                 |
| -------------------------------------------------------------- | ------------------------------ | ---------------------------- | ----------------------------------------------- |
| OWNER + valid active membership/org/establishment              | Yes                            | Yes                          | Visible; scoped read/Save allowed if row exists |
| MANAGER + valid scope                                          | Yes                            | No                           | Base inbox remains; settings absent/denied      |
| STAFF + valid scope                                            | Yes                            | No                           | Base inbox remains; settings absent/denied      |
| Public/service/system role without valid restaurant membership | No valid private authority     | No                           | Denied; no bypass                               |
| Missing active establishment                                   | Base trusted composition fails | Not evaluated as success     | Existing fail-closed behavior                   |
| Wrong organization/establishment                               | No scoped match                | No resource authority        | Fail closed; no cross-scope disclosure          |
| Browser claims OWNER/tenant/permission                         | No effect                      | No effect                    | Trusted server context controls                 |
| Authorized OWNER + row missing                                 | Yes                            | Yes                          | `CONFIGURATION_UNAVAILABLE`, not auth denial    |

No permission constant or grant map is modified.

## URL-policy architecture and public-boundary review

The same pure contracts policy handles private validation and public safe
projection. Exact host sets are immutable in this change; no wildcard exists.
Parsed hostname is checked, while persisted output remains the trimmed original
string so path/query semantics are not rewritten. No network, redirect, OAuth
or provider verification occurs.

Public behavior remains:

```text
trusted server hostname/tenant resolution
→ scoped settings + slug read
→ per-provider safe projection
→ render only non-null accepted CTA
```

Missing settings row already returns public unavailable/not-found and needs no
new Product decision. Stored legacy invalid URL is hidden only; it is not
mutated. CTA uses `target="_blank"` plus exact `rel="noopener noreferrer"`.

The active `feedback-public-trusted-boundary-hardening` change does not own this
URL policy. Before Apply, any shared-file drift must be reconciled against both
approved artifacts; this Design does not alter its hostname/client-IP scope.

## Audit data inventory and minimization

| Audit element                                            | Source                                   | Included?            | Reason                                                                   |
| -------------------------------------------------------- | ---------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| Organization                                             | Trusted context / existing column        | Yes                  | Tenant scope                                                             |
| Establishment                                            | Trusted context / strict metadata        | Yes                  | Location attribution                                                     |
| Actor user                                               | Authenticated session / nullable column  | Yes for new mutation | Recorded at commit; may later become null through supported FK lifecycle |
| Timestamp                                                | Transaction / existing column            | Yes                  | Recorded time and deterministic ordering                                 |
| Changed provider                                         | Server-derived delta                     | Yes                  | Explain mutation                                                         |
| Previous/new accepted URL                                | Authoritative/proposed normalized values | Yes                  | Approved historical delta and replay proof                               |
| Unchanged providers                                      | N/A                                      | No                   | Minimize history duplication                                             |
| Rejected URL/credentials                                 | Browser invalid input                    | No                   | Never persist/audit unsafe input                                         |
| State token, request body, session/OAuth/connector token | Internal/browser                         | No                   | Not approved and unnecessary                                             |
| IP, user-agent, browser tenant/role claims               | Browser/request                          | No                   | Not part of settings audit purpose                                       |

URLs may contain business identifiers/query data. There is no new audit UI or
export. Repository has no approved Reputation audit cleanup contract; this
change neither promises keep-forever nor adds purge/legal-hold. Production
retention/access/cleanup remains `NOT_AUTHORIZED`. Any future mechanism capable
of deleting qualified markers must return to Product/Design before activation.
Possible later directions include preserving required markers, adding durable
checkpoint/version evidence, or disabling mutation before destructive cleanup;
none is selected here.

## UI state and page-pack review

One OWNER-only section is added later to the existing Satisfaction route. It
must cover loading, empty, populated, dirty, invalid, saving, saved/no-change,
server retry, conflict/reload and `Configuration indisponible`. One explicit
Save submits the whole slice; no autosave, partial Save, implicit creation or
provisioning CTA. Recoverable errors retain browser draft; successful outcome
resets baseline from authoritative response.

MANAGER/STAFF keep the current inbox without settings content. No shared
`@yuta/ui` primitive change is designed.

Before UI Apply, create and approve the stable pack:

```text
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/
```

It must be `EXISTING_PAGE`, capture authenticated baseline, follow protocol
revision 4, run the design prompt and reference shared UI governance. Design
does not create the page pack in this gate.

## Later test and QA obligations

- Missing row: private read/Save unavailable, no insert/upsert/audit/default;
  reload after separately provisioned row.
- Concurrency: ordinary success, concurrent writers, stale different conflict,
  exact response-loss replay, different retry, same state by other actor, ABA,
  valid no-event baseline, malformed matching audit and ambiguous chain
  fail-closed.
- Nullable actor: active same actor is a valid marker and may prove D1;
  different actor is a valid marker but cannot prove D1 and same desired state
  uses D2; actor nullified through the real PostgreSQL FK remains valid for
  private read/token, permits a later normal authorized mutation when expected
  state matches, and uses D2 rather than D1 when current equals proposed.
- Atomicity: invalid input, settings failure, audit failure, rollback/no orphan.
- Authorization: OWNER allow; MANAGER/STAFF/public/service/system deny; browser
  claims ignored; cross-org/establishment denial.
- Providers: traceable exhaustive matrix for all common + Google + Facebook +
  Instagram positive/negative scenarios.
- Public: valid/null/legacy malformed/unsupported CTAs, trusted tenant and safe
  external attributes.
- GBP/manual-only: connector operations never mutate Google review URL.
- Integrity inventory: no supported qualified-audit update/delete/purge path;
  a static guard fails if one is introduced. Total-history deletion, if used as
  a negative fixture, is classified unsupported rather than falsely expected
  to be runtime-detectable.
- Final Browser QA: authenticated local OWNER, safe synthetic data, widths 1440,
  1024, 768 and 390; all UI states, focus/keyboard, no overflow, no leaked IDs.

Disposable real PostgreSQL is mandatory for concurrency/rollback. Design-stage
review does not substitute mocks or claim QA completion.

## Production and explicit exclusions

No Tasks, Apply, code, contracts, schema, migration, seed, data mutation,
page-pack, UI or production operation is authorized by this packet. No row
provisioning, new permission, route, connector, social workflow, AI, analytics,
QR, generic engine, retention executor or deployment is designed.

Production remains blocked on separate authority for at least settings-row
provisioning coverage, audit retention/access/cleanup/backup, environment
verification, cross-app release coordination and final QA/release approval.
Future deletion/purge of qualified markers is forbidden until an approved
replacement concurrency/version mechanism or mutation-disable policy exists.

## Stop-condition assessment

| Potential stop condition                                  | Result                                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Schema/migration required for approved concurrency/replay | `NO` for current repository capability, conditional on proven append-only qualified-audit invariant |
| New permission/grant required                             | `NO` — existing OWNER-only `reputation.settings.manage` is sufficient                               |
| Row provisioning/default invention required               | `NO` — missing row fails closed                                                                     |
| New public missing-row Product behavior required          | `NO` — current scoped null/not-found behavior is clear and preserved                                |
| Connector behavior change required                        | `NO`                                                                                                |
| New route/navigation required                             | `NO`                                                                                                |
| Replay/conflict guarantee weakened                        | `NO` inside supported append-only lifecycle; unsupported total deletion is explicitly excluded      |
| Nullable actor requires schema/migration                  | `NO` — current nullable FK is supported; actor is excluded from token and only gates D1 proof       |

Unresolved blocker: `NONE`.

Audit marker append-only invariant: `PROVEN`.

Nullable actor: `VALID_STATE_MARKER / NOT_REPLAY_ATTRIBUTION`.

## Design-stage validation

Only planning validations are required. Results are recorded after formatting
the exact Design and this packet:

- scoped Prettier: `PASS` — exact Design và regenerated packet đúng format;
- strict OpenSpec validation: `PASS` — change hợp lệ;
- documentation consistency: `PASS` — 36 current documents consistent;
- architecture check: `PASS` — runtime imports, database URLs, client
  boundaries và migration baselines hợp lệ.

No application test, typecheck, build, database mutation or Browser QA is
claimed during Design.

## Human review decision

Current return state:

- Technical Design: `READY_FOR_REVIEW`
- Sensitive Design: `AWAITING_HUMAN_REVIEW`
- SD-R1: `RESOLVED`
- SD-R2: `RESOLVED`
- Audit marker append-only invariant: `PROVEN`
- Nullable actor: `VALID_STATE_MARKER / NOT_REPLAY_ATTRIBUTION`
- Schema/migration: `NOT_REQUIRED`
- Tasks: `NOT_STARTED`
- Apply: `NOT_AUTHORIZED`
- Production: `NOT_AUTHORIZED`

Human approval is required before Tasks + Implementation Plan. STOP at this
gate.
