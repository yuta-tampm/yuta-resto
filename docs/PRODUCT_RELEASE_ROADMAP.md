# YUTA Product Release Roadmap

Status: PROPOSED — awaiting cross-module Human / Control Tower review

Visibility: Engineering

Owner: Proposed YUTA product and engineering; Control Tower ownership decision pending

Last updated: 2026-10-01

## 1. Purpose, ownership and authority

This is the single proposed repository destination for release sequencing,
customer journey and capability exposure planning. It is a reviewable draft,
not approved Product policy, a customer-facing roadmap, a normative spec, a
release record or authorization to implement or deploy. Repository discovery
found Product Release identity documentation and capability-specific plans, but
no existing cross-product release-roadmap owner. Keep the identity home as its
own authority; confirm this destination through Control Tower before adoption.

The supplied direction is Foundation -> A: Reputation Core -> B: Direct
Feedback -> C: AI Reputation. Every future scope and exposure target below is
`PROPOSED`. The user authorized repository analysis, proposal preparation and
necessary index links only. Existing approved obligations are preserved.

Use these classifications throughout:

| Classification      | Meaning                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Repository evidence | Current source, contract, code/test inventory or recorded dated evidence; its limits are stated. |
| Supplied direction  | The current-user roadmap request dated 2026-10-01, awaiting reconciliation and approval.         |
| Proposal            | A suggested release, journey, exposure or acceptance decision; no approval is inferred.          |
| Unresolved          | Missing decision, contradictory source or unavailable environment evidence.                      |

Authority routing remains [Authority Model](AUTHORITY_MODEL.md),
[Product Knowledge](PRODUCT_KNOWLEDGE.md), [Module Registry](MODULE_REGISTRY.md),
[Lifecycle Status Model](LIFECYCLE_STATUS_MODEL.md),
[Workflow v3](YUTA_WORKFLOW_V3.md) and
[Automated Workflow](YUTA_AUTOMATED_CHANGE_WORKFLOW.md). These sources are
linked rather than restated as new governance. Current code proves repository
behavior; dated target-environment evidence is needed for a deployed claim.

Avis, Today and the bounded Satisfaction reconciliation have repository
authority records in their homes. Satisfaction's supplemental Expérience client
reconciliation has a separately recorded Human-exception cutover; its strict
delta fresh-agent result remains blocked and formal PASS remains NO. These
records grant no release approval. Unmigrated adjacent Page Chats retain their
authority. No live Page Chat or Human-selected Control Tower context was supplied
or consulted; missing chat context does not mean missing requirements. Conflicts
and scope decisions go through the [Control Tower handoff](chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md).

The current review and exact next decision are recorded in
[the discovery handoff](reviews/release-roadmap-foundation/discovery-handoff.md).
No active `release-roadmap-foundation` OpenSpec change has been created.

## 2. Five independent release concepts

| Concept              | Existing authority and treatment                                                                                                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Product maturity     | The approved stages are `PROTOTYPE`, `ALPHA`, `PRIVATE_BETA`, `PUBLIC_BETA`, `RELEASE_CANDIDATE`, `GENERAL_AVAILABILITY`. Use the [Product Release home](features/product-release/README.md) for canonical public labels; GA is displayed as `Stable`. |
| Release scope        | Foundation, Reputation Core, Direct Feedback and AI Reputation name proposed capability sets. A scope name is not a stage, permission or availability gate.                                                                                            |
| Product version      | Read [CURRENT_YUTA_PRODUCT_RELEASE](../packages/core/src/product-release.ts); package versions and this roadmap are not current-version authorities.                                                                                                   |
| Capability lifecycle | Preserve the independent Product Decision, Implementation, Environment, Production Readiness and External Dependency values in the Registry and owning homes.                                                                                          |
| Release availability | A separately approved decision about which capability slices customers may use in a named release; implementation or an entitlement alone does not approve this decision.                                                                              |

A roadmap target proves neither implementation nor readiness. A maturity label
grants no authorization. A version change enables no capability. One ready
capability does not promote product maturity. This draft assigns no new
canonical lifecycle value.

### Version foundation: verified repository status

`product-version-management-foundation` is archived at
[`2026-09-27-product-version-management-foundation`](../openspec/changes/archive/2026-09-27-product-version-management-foundation).
Its metadata pins `yuta-spec-driven`; all 22 Tasks are checked. Its active path
is absent, so an active `openspec status` lookup reports `change_error`, not
evidence that the foundation was never delivered. Proposal, Analysis, Design,
Tasks, archived delta and current main-spec hashes match the recorded final
review values. The [final review](reviews/product-version-management-foundation/03-final-review.md)
records explicit Gate 3 and sync/archive authorization, completed archive,
technical reassessment PASS and local Browser QA PASS. The
[knowledge review](reviews/product-version-management-foundation/04-knowledge-consolidation-review.md)
records separately approved consolidation and DONE. Git records implementation
in `fc63fef5` and completion in `83e9a4c3`; both are ancestors of the audited HEAD.

The current Core record still matches the supplied initial identity example.
Consult that record and the
[manual update procedure](features/product-release/README.md#manual-release-update)
for its values and any later approved update. Do not copy illustrative future
versions into release commitments or overwrite a newer identity. Existing
historical VERIFY FAIL and global-format failures remain preserved alongside
the later scoped reassessment. The foundation's deployment follow-up is still
separate; no live release identity was verified by this audit.

## 3. Proposed sequence and calendar policy

| Milestone           | Supplied scope / proposed outcome                                                                                                                                                                        | Maturity treatment                                                           | Exit dependency                                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Foundation          | Make invited customer access, trusted context, minimum establishment setup, shell, release identity and cloud operations usable.                                                                         | Alpha preparation; current maturity remains controlled by Core.              | Foundation gaps below resolved and scope-approved evidence assembled.                                                 |
| A — Reputation Core | Small invited restaurant cohort; Google connect, discover, explicit bind, import, inbox/detail, manual refresh, human-authored reply, explicit publication, recovery and small Reputation Today surface. | Target `PRIVATE_BETA`, subject to a separate readiness and Product decision. | End-to-end provider, customer, security and operations acceptance. No POS, Booking, Stock or Team dependency imposed. |
| B — Direct Feedback | QR/link entry, short private collection, direct-only inbox/handling and bounded operational satisfaction follow-up.                                                                                      | No automatic new maturity stage; decide separately.                          | Satisfaction decisions, public trusted-boundary hardening, privacy and actual QR/collection evidence.                 |
| C — AI Reputation   | Assisted review analysis, suggested editable replies and useful summaries from approved inputs; Human review before publication.                                                                         | No automatic stage promotion.                                                | Approved provider/model/data/grounding contract and evaluation; A's publication controls retained.                    |
| Later               | Reservations, Personnel, Planning, Pointage, Formalités, Stock and other independent capabilities.                                                                                                       | No dates, release numbers or implementation order assigned.                  | Owning requirements and readiness retained; dependencies or production blockers may justify bounded exceptions.       |

Planning date: **2026-10-01**. No delivery dates are committed. Earlier
September–December 2026 examples are hypotheses, not completion or approval
evidence. Do not backfill September completion, fix Public Beta to December or
GA to 2027. Revisit optional tentative dates only after scope, provider access,
capacity, support and acceptance work are estimated. Public Beta, RC and GA
each require a separately scoped readiness decision.

Proposed near-term priority rule: during Foundation and A–C, work outside
Reputation is prioritized only for a necessary customer-release dependency or
a security, privacy/legal or production-blocking issue. Record the affected
release, concrete reason, bounded scope and owning decision for each exception.
This neither deletes requirements nor overrides Page Chat Product authority.

## 4. Foundation readiness audit and release matrix

This is a dated planning snapshot. Lifecycle cells reproduce bounded owning
records; `no dedicated row` means no status is invented for that finer slice.
`UNVERIFIED` environment does not mean a failed deployment. Test sources below
were inspected; no runtime tests or Browser QA were executed for this draft.

| Capability / canonical owner                                     | Release      | Current lifecycle evidence                                                                                                | Implementation / data / provider evidence                                                                                                                                  | Exposure target                                     | Prerequisite / blocker or decision                                                                                                      | Acceptance proposed for release                                                                                           |
| ---------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Password login / Identity–Access                                 | Foundation   | Authentication: Product `—` unresolved; `IMPLEMENTED / UNVERIFIED / NOT_READY / NOT_ASSESSED`.                            | [Identity home](features/identity-access/README.md), server password login and cloud sessions exist.                                                                       | SHOW authentication entry.                          | Bounded access Product decision; cohort provisioning and support ownership.                                                             | Invited user signs in; invalid, expired and revoked access fail safely without trusted browser scope.                     |
| Password recovery / Identity–Access                              | Foundation   | No separate recovery row; Authentication record above remains bounded.                                                    | Reset-token processing exists; [forgot-password page](<../apps/backoffice/src/app/(public)/mot-de-passe-oublie/page.tsx>) directs to support. No automated email delivery. | SHOW supported recovery with accurate next step.    | Approve and exercise operational secure-link issuance/delivery and support response; email provider only if selected.                   | Real invited user recovers access, token is single-use/time-bounded and sessions are revoked; no automated email promise. |
| Tenant and active membership / Identity–Access                   | Foundation   | `APPROVED / IMPLEMENTED / UNVERIFIED / NOT_READY / NOT_ASSESSED`.                                                         | [Tenancy](architecture/TENANCY.md), scoped sessions, one-time selection and recovery code; organization + establishment cloud ownership.                                   | SHOW only authorized contexts.                      | Current-target denial and revoked-membership evidence.                                                                                  | Zero/one/many memberships, cross-organization selection, stale access and isolated reads/actions verified.                |
| Access administration / Identity–Access                          | Foundation   | Product `—` unresolved; `IMPLEMENTED / UNVERIFIED / NOT_READY / NOT_ASSESSED`.                                            | User creation/attachment and membership management exist; no automatic invitation, public registration or self-service organization creation.                              | Permitted access settings only.                     | Decide operator-assisted cohort creation, initial credential channel and minimum roles.                                                 | Restaurant joins without POS or deferred modules; no invitation flow inferred from schema.                                |
| Minimum establishment / Establishment Profile                    | Foundation   | `APPROVED / IMPLEMENTED / UNVERIFIED / NOT_READY / NOT_ASSESSED`.                                                         | [Establishment home](features/establishment/README.md); scoped profile editor exists. Completion indicator is presentation, not onboarding state.                          | SHOW minimum profile; permission-limited edits.     | Required setup fields, provisioning and missing-profile recovery undecided; slug/status/locale/timezone not editable in current editor. | Correct active restaurant, locale/timezone and necessary profile configured; missing setup has an approved next step.     |
| Shell, landing and safe return / Backoffice + Today              | Foundation/A | No independent release-shell row; Today bounded row `APPROVED / IMPLEMENTED / UNVERIFIED / NOT_READY / NOT_ASSESSED`.     | Root redirects to `/aujourdhui`; session guards, selection and shell exist. Current navigation is broader than A.                                                          | Limited A shell after separate runtime approval.    | Release availability infrastructure absent; exact nested allowlist and return behavior needed.                                          | No deferred surface reachable through navigation, CTA, deep link or action; authorized return retains correct context.    |
| Product Release identity / Product Release–Core                  | Foundation   | `APPROVED / IMPLEMENTED / UNVERIFIED / NOT_ASSESSED / NOT_APPLICABLE` for metadata.                                       | [Identity home](features/product-release/README.md); verified archive and main spec above; Web and authenticated Backoffice consumers.                                     | Existing approved identity presentation.            | Named-target deployment/post-deploy evidence absent from this audit.                                                                    | Consumers show approved metadata; identity does not authorize availability or stage promotion.                            |
| Deployment/environment / Cloud operations                        | Foundation   | Production register: `GLOBAL_CLOUD` and `BACKOFFICE` `NOT_READY`; do not assign capability lifecycle from this aggregate. | [Deployment](operations/DEPLOYMENT.md): manual cloud releases, separate app projects and cloud migration ownership.                                                        | No customer rollout until operational approval.     | Target config, secrets without values, migration journal, DNS/TLS and candidate release evidence not established.                       | Exact target/candidate/config and cloud-only persistence recorded with successful smoke/post-deploy checks.               |
| Monitoring, support, backup/restore, rollback / Operations       | Foundation   | `OPS-01/02/04 NOT_STARTED`; `OPS-03`, `DATA-01 BLOCKED` in [readiness register](operations/PRODUCTION_READINESS.md).      | Documented cloud recovery/release procedures are not completed drills.                                                                                                     | Available support and recovery before customer use. | Named owners, privacy-safe alerts, representative restore/PITR and rollback evidence missing.                                           | Alert/support exercise, dated isolated cloud restore and reviewed rollback procedure for actual architecture.             |
| Privacy, security, company/vendor obligations / Owning reviewers | Foundation/A | Relevant global register rows remain `NOT_STARTED` or `BLOCKED`; `REPUTATION-01 BLOCKED`.                                 | [Production Readiness](operations/PRODUCTION_READINESS.md) owns approvals and private opaque evidence references.                                                          | Only release-approved data processing.              | Legal notices, purposes/rights/retention, provider/vendor/access/incident controls require appropriate review.                          | Applicable rows approved or dated scoped N/A by required reviewer; free Beta does not waive them.                         |

Billing depends on the commercial model. An invited free Beta does not imply a
subscription implementation prerequisite. Commercial, support and legal
responsibilities still need their applicable decisions; this roadmap does not
waive `CORP-04` or expose the subscription placeholder.

## 5. Reputation release matrix

The [Reputation home](features/reputation/README.md) and
[tracker](features/reputation/STATUS.md) control slice meanings. The Registry's
implemented operational inbox does not make all provider stages implemented.

| Capability / canonical owner                                           | Release | Current lifecycle evidence                                                                                                                                  | Implementation / data / provider evidence                                                                                                                                                                                                                                              | Exposure target                                                                       | Prerequisite / blocker or decision                                                                                        | Acceptance proposed for release                                                                                                                                               |
| ---------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google OAuth and encrypted tokens / Reputation                         | A       | Connector foundation `NOT_DECIDED / IMPLEMENTED / UNVERIFIED / BLOCKED / BLOCKED`.                                                                          | [Google server boundary](../apps/backoffice/src/server/reputation), tenant-bound OAuth, AES-GCM storage and token refresh; setup discovery only.                                                                                                                                       | SHOW authorized setup or LOCK with next step.                                         | AVIS-01/08/09, actual project/API/OAuth approval, valid configuration and access.                                         | Authorized OWNER connects correct restaurant; denied/stale/config errors and reconnection verified without token disclosure.                                                  |
| Account/location discovery and explicit binding / Reputation           | A       | Same foundation row only; no import readiness follows.                                                                                                      | [integration loader](<../apps/backoffice/src/app/(authenticated)/parametres/integrations/google-integration-loader.ts>) and [selection action](<../apps/backoffice/src/app/(authenticated)/parametres/integrations/actions.ts>) re-list Google resources before saving scoped binding. | SHOW permitted OWNER selection.                                                       | Multiple/no locations, correct account ownership and provider verification; configured provider Browser QA still blocked. | Server rejects inaccessible/wrong location; Human explicitly binds the intended establishment and sees confirmed result.                                                      |
| Initial Google review import / Reputation                              | A       | Synchronization slice `NOT_DECIDED / NOT_STARTED / UNVERIFIED / BLOCKED / BLOCKED`.                                                                         | No import in current Google client; persisted/seeded Google inbox rows are not imported evidence.                                                                                                                                                                                      | HIDE until delivered and release-approved; then distinct progress/error/empty states. | AVIS-01/04; paginated import, identity/deduplication, provider storage/retention decision.                                | Verified bound location imports real authorized reviews without duplicates; zero-success differs from failure and no connection.                                              |
| Inbox and review detail / Reputation                                   | A       | Operational inbox `APPROVED / IMPLEMENTED / UNVERIFIED / BLOCKED / BLOCKED`; Google V1 unresolved.                                                          | [Avis loader](<../apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-loader.tsx>) currently accepts Google AND direct rows; detail is persisted and tenant-scoped.                                                                                 | SHOW A-approved public-provider review slice only.                                    | Enforced Google scope through reads/detail/actions; existing mixed view cannot establish A approval.                      | Correct scoped imported reviews, permitted detail, loading/error/empty and STAFF assignment isolation.                                                                        |
| Manual Google refresh / Reputation                                     | A       | Within unstarted synchronization slice; no independent ready row.                                                                                           | `Synchroniser` is disabled; no review refresh pipeline.                                                                                                                                                                                                                                | HIDE unfinished control; SHOW with honest progress/retry when accepted.               | AVIS-04; quota, concurrency, stale-data and retry semantics.                                                              | Manual refresh updates safely and confirms timestamp/result; failure retains only permitted data; no realtime promise.                                                        |
| Human-authored draft / Reputation                                      | A       | Bounded inbox implementation; separate [draft pending spec](../openspec/specs/reputation/reply-draft-pending-feedback/spec.md) and local candidate QA PASS. | Manual Google drafts persist; no AI generator or approval lifecycle.                                                                                                                                                                                                                   | SHOW permitted manual editing when A ready.                                           | AVIS-05/08; draft Save is not publication approval.                                                                       | Save/reload preserves draft and accurate pending/success/error; no claim of external reply.                                                                                   |
| Human approval, publish and reconciliation / Reputation                | A       | No dedicated approved lifecycle row; provider scope unresolved and runtime absent.                                                                          | `Publier sur Google` disabled; publish permission constant exists, no provider publisher or remote reconciliation.                                                                                                                                                                     | HIDE until accepted; then explicit permitted publication with result.                 | AVIS-04/05/08/09; approval actor/action, provider consent, attempt audit, safe retry and remote truth.                    | Human approves exact text; publication confirms Google result; pending/failure/uncertain outcome cannot be shown as success.                                                  |
| Today Reputation projection / Today consuming Reputation               | A       | Existing Today `APPROVED / IMPLEMENTED / UNVERIFIED / NOT_READY / NOT_ASSESSED`; A-only projection has no dedicated row.                                    | [Today loader](<../apps/backoffice/src/app/(authenticated)/aujourdhui/today-data.ts>) reads mixed-source unanswered items; Booking cards/CTAs are entitlement-controlled.                                                                                                              | SHOW small permitted A Reputation attention only.                                     | TODAY source/attention/freshness decisions; AVIS metric decisions; suppress B data and deferred sections.                 | Counts/previews use approved A scope and permissions; links go to owning review flow; no Today mutation or source-state ownership.                                            |
| QR/link entry and private collection / Reputation + Feedback Web       | B       | Direct collection `APPROVED / IMPLEMENTED / UNVERIFIED / BLOCKED / BLOCKED`; managed QR absent.                                                             | [Satisfaction authority](features/reputation/README.md#13-satisfaction-client--feedback-direct-knowledge-migration-control); five-stage private form and atomic cloud persistence; QR creation/download/distribution unfinished.                                                       | HIDE during A; SHOW only B-approved entry/form.                                       | SAT-01/02/03/04 and trusted-boundary hardening; verified hostname/client-address evidence.                                | Real printed/linked mobile journey resolves correct restaurant, validates/limits input and privately acknowledges persistence.                                                |
| Direct inbox and operational follow-up / Reputation                    | B       | Bounded operational inbox implemented; no complete follow-up/action lifecycle row.                                                                          | `/visibilite-reputation/satisfaction` forces DIRECT; status/assignment/notes exist, no customer message delivery or improvement-action engine.                                                                                                                                         | HIDE during A; SHOW accepted B handling slice.                                        | SAT-03/05/07/08/10; request-first contact conflicts with current ungated fields.                                          | Private direct-only handling with approved statuses/contact purpose; no external publication, provider merge, notification/SLA or outbound response promise without approval. |
| AI review analysis / Reputation, approved AI adapter owner unresolved  | C       | No approved Reputation AI implementation/lifecycle row.                                                                                                     | Schema and displayed sentiment/summary fields do not prove AI. No Mistral foundation found in inspected docs/code.                                                                                                                                                                     | HIDE until C contracts and evaluation approved.                                       | AVIS-06/07/09, provider/model/minimized input/output, privacy and cost limits.                                            | Accepted structured analysis, source traceability, failures and Human review; deterministic direct-feedback derivation is not AI evidence.                                    |
| AI suggested replies and summaries / Reputation + Restaurant Knowledge | C       | AI runtime absent; Restaurant Knowledge aggregate `APPROVED / PARTIAL / NOT_ENABLED / NOT_ASSESSED / NOT_ASSESSED`.                                         | Six Knowledge slices exist, including manual validated statements; no approved Reputation consumption/grounding contract.                                                                                                                                                              | HIDE AI in A/B; separate C approval.                                                  | AVIS-06; model/prompt/source validation, correction and summary meaning; provider content-use restrictions.               | Draft stays editable and reviewable; grounded claims use approved minimized projection; no automatic Knowledge write-back or publication.                                     |

Existing implemented Booking, Team or other capabilities stay in their
repository owners while outside A–C exposure. Facebook/Instagram high-level
inclusion remains confirmed and current V1 unresolved (AVIS-02/03); deferral in
this proposal is not rejection. Later capability lifecycle remains in the
Registry, not collapsed into a module-wide readiness claim.

### Provider and AI evidence limits

Official Google sources were checked on 2026-10-01. These requirements are
provider documentation, not confirmation of YUTA's actual account:

| Provider prerequisite              | Official source / finding                                                                                                                                                                                                                                                                                                  | YUTA evidence still required                                                                                                                                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API project access                 | [Prerequisites](https://developers.google.com/my-business/content/prereqs): API application/approval, active verified GBP eligibility and an owner/manager applicant. [Basic setup](https://developers.google.com/my-business/content/basic-setup): approval and API enablement.                                           | Dated approved project and enabled services, retained privately by provider owner.                                                                                                                                       |
| Quota and API access               | [Limits](https://developers.google.com/my-business/content/limits): zero quota means access has not been granted; quota exhaustion can return 429.                                                                                                                                                                         | Actual assigned quotas for each used service and proportionate retry/monitoring evidence; no console access in this audit.                                                                                               |
| OAuth and credentials              | [OAuth app states](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview) distinguish testing and production/verification. [OAuth token rules](https://developers.google.com/identity/protocols/oauth2) document external Testing token expiry, generally seven days for non-basic scopes. | Client/secret/key configuration without values, matching approved HTTPS callback, consent/domain/brand/scope review as applicable, cohort/account access and reconnection evidence.                                      |
| Real location and reviews          | [Review list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list) and [reply update](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/updateReply) require a verified location and appropriate OAuth authorization.                         | Restaurant's actual resource permissions and verification, connect/bind/read evidence and separately authorized publication evidence.                                                                                    |
| Authorized use and content storage | [Google API policies](https://developers.google.com/my-business/content/policies) require client authorization for replies, disassociation support, specific consent for triggered actions and constrained temporary content storage (including a 30-day limit and restrictions on manipulation/aggregation).              | Provider/privacy review of proposed persisted review inbox, cached-data recovery, summaries and AI transmission before accepting an import/AI contract. No blanket permission to retain/read imported data indefinitely. |

The existing Backoffice client requests `business.manage` and implements OAuth,
account and location operations only. Environment-file presence, API code and
Google location IDs do not prove project approval, quotas or usable live access.
The recorded [async feedback QA](reviews/async-interaction-feedback-foundation/qa/QA_REPORT.md)
remains `BLOCKED_BY_ENVIRONMENT` for configured Google selection states; other
executed local scenarios must not be generalized to Release A.

The [OpenAI eligibility dossier](operations/OPENAI_PROVIDER_ELIGIBILITY.md)
records submission on 2026-08-18, awaiting a response, and no production provider
selection. The Reputation tracker says the dossier is not submitted. This is a
source disagreement to reconcile through the owning operations/Product workflow;
the dated dossier is the specific recorded submission evidence, not a verified
current provider response. Personnel's bounded synthetic OpenAI evaluation is
not a Reputation or Mistral foundation. No account, SDK, API use, spending or
provider selection is authorized here.

## 6. Intended entry and context journey

Supplied direction: login -> validate access -> resolve authorized organization
and establishment -> identify required setup -> enter permitted application.
The following maps to existing routes/contracts without creating an onboarding
route, enum or state field.

| Situation                                         | Current repository mapping                                                                                                                                                              | Proposed release experience / gap                                                                                                                                                                                |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unauthenticated or expired session                | `/connexion`; [session guard](../apps/backoffice/src/server/auth/session.ts) uses a sanitized `returnTo`.                                                                               | Sign in or recover access; retain an authorized deep link where the exact candidate supports it.                                                                                                                 |
| No valid membership / no accessible establishment | Login `NO_ACTIVE_MEMBERSHIP` -> `/acces/aucun-etablissement`; scope recovery also handles zero options.                                                                                 | Explain contact/support next step; no self-service organization creation inferred.                                                                                                                               |
| Several organizations/establishments              | `/selection-etablissement` groups active membership options by organization; single-use selection ticket; server validates selected membership. Shell switching rotates scoped session. | Choose a permitted restaurant, never trust submitted organization/role IDs; stale selection has recovery. No extra organization onboarding page assumed.                                                         |
| Revoked/suspended or invalid scope                | `/resolution-etablissement` recovers usable membership, issues selection, redirects to no-establishment, or clears cookies and returns to login.                                        | Explain changed access and available next action; selection cannot bypass revocation.                                                                                                                            |
| Incomplete establishment setup                    | `/etablissement/informations-generales` reads bounded profile; absent profile currently `notFound()`. No onboarding completeness gate exists.                                           | Define minimum required fields and authorized operator repair. Completion bar is not trusted persisted setup state.                                                                                              |
| Valid returning user                              | Root `/` -> `/aujourdhui`; trusted establishment/timezone loaded server-side.                                                                                                           | Default home remains **Aujourd’hui**; show only permitted release scope and honest source states.                                                                                                                |
| Authorized deep link / safe return                | `safeReturnTo` permits local paths and rejects absent/external/protocol-relative/backslash values with Today fallback. Route guards still authorize the destination.                    | Exact deep-link preservation needs acceptance: authenticated layout calls its default guard, and sanitization is not an A release-route allowlist. Denied/out-of-release targets need bounded approved recovery. |

Access/onboarding proposal: use existing authorized user/membership operations
with an approved operator-assisted provisioning and recovery process for a small
cohort. Automated invites, email delivery, public signup and organization
creation are gaps, not implied requirements or existing journeys. Confirm the
minimum free-Beta commercial model and operations owner.

## 7. Google setup and daily use

These are conceptual journey states, not new persisted fields or provider
contracts. Existing connector presentation and statuses must not be stretched
to represent review import or publication. A blocked action needs a clear reason
and a permitted next step; a non-owner receives an appropriate handoff rather
than an unauthorized setup action.

| Conceptual state                      | Existing mapping / missing evidence                                                                             | Proposed reason and next step                                                                                                                           |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Not connected                         | Integrations page/presentation `Non connecté`; configuration alert and OWNER OAuth link.                        | Explain setup or missing service configuration; OWNER connects, others contact authorized owner/support.                                                |
| Authorized, location not bound        | OAuth `authorized` result; `À finaliser`; account/location selector.                                            | Explicitly select and verify correct restaurant; do not treat OAuth as completed import.                                                                |
| No accessible locations               | Discovery returns empty arrays; selector has empty presentation; provider errors separately recorded by loader. | Explain account/location access; choose another authorized account or fix GBP access with owner/support. Never label discovery failure as zero reviews. |
| Bound, initial import pending/running | Binding exists; no import implementation or separate running contract.                                          | Explain pending work and progress/recovery once approved implementation exists.                                                                         |
| Initial import failed                 | No importer/failure recovery exists.                                                                            | Explain failure, allow authorized retry/support after bounded cause; never show a successful empty inbox.                                               |
| Import succeeded, zero reviews        | Current empty persisted inbox does not prove successful Google import.                                          | Show verified successful import/zero result distinctly; manual refresh or revisit Google as appropriate.                                                |
| Reviews available                     | Persisted list/detail exist; real import is missing.                                                            | Open authorized imported review detail and write manual reply.                                                                                          |
| Refresh running/failed                | Disabled control; no refresh process.                                                                           | Honest progress, retry and last permitted successful result; no realtime implication.                                                                   |
| Connection revoked/reconnect needed   | Token refresh and `auth_expired`/discovery recovery exist; no full review pipeline recovery.                    | OWNER reconnects; block affected external actions. Existing data stays readable only under current access, provider, privacy and retention contracts.   |
| Publication pending/succeeded/failed  | No provider publisher; button disabled; stored reply statuses do not prove external execution.                  | Approve exact text and publish explicitly; confirm provider response or expose failure/uncertain result with safe recovery.                             |

Daily target: login -> Aujourd’hui -> reviews requiring attention -> existing
`/visibilite-reputation/avis/[reviewId]` detail entry (redirects to selected
inbox item) -> write/edit draft -> explicit Human approval/publication ->
confirmed provider result. Draft Save and provider publication remain distinct.

Current metric evidence in [the repository](../packages/db-cloud/src/reputation-repository.ts):
`new` counts `status = NEW`; it is not “since last visit.” `unanswered` counts
items without a stored `PUBLISHED` reply. Today previews additionally exclude
`RESOLVED`, `ARCHIVED`, `SPAM` and published replies; its attention count uses
the broader unanswered counter, so count/preview scope can differ. Counters use
trusted scope, STAFF visibility and optional source, rather than all list
filters. No current publisher proves that local `PUBLISHED` equals remote truth.
Product definitions for “requiring attention,” “replied,” response rate, timing,
negative/urgent summaries and count/preview alignment require AVIS/Today review.
No new metric or automatic status meaning is adopted in this roadmap.

## 8. Proposed Release A customer navigation

Use the existing French names/routes. “Avis & Réputation” is descriptive wording,
not permission to rename **Avis & commentaires** or its independent Page Chat.

| Intended A surface                    | Existing canonical route                                   | Bounded proposal                                                                                                                                                                                                       |
| ------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aujourd’hui                           | `/aujourdhui`                                              | Small A Reputation attention; remove customer exposure to Booking/service summaries and CTAs outside release.                                                                                                          |
| Avis & commentaires                   | `/visibilite-reputation/avis`; existing detail entry above | A-approved Google slice only; direct data/filter/detail/actions and unfinished controls stay hidden until their release/contract is approved.                                                                          |
| Établissement: Informations générales | `/etablissement/informations-generales`                    | Minimum profile only; decide separately whether any existing descriptive Knowledge section is necessary. `Équipe & culture` is Restaurant Knowledge, not Personnel, but is still outside the default A dependency set. |
| Paramètres: Intégrations              | `/parametres/integrations`                                 | Existing OWNER-only Google setup; release-approved server protection and discoverable setup link needed. This route is currently absent from the sidebar and Avis's settings button is disabled.                       |
| Paramètres: Utilisateurs & accès      | `/parametres/utilisateurs-acces`                           | Only operations required for cohort access and allowed by current OWNER/MANAGER rules; no new role matrix.                                                                                                             |

Current [navigation](../apps/backoffice/src/components/backoffice/backoffice-navigation.ts)
filters some entitlements/role capabilities but exposes Stock, Planning,
Pointage, Compliance, Marketing, resources/menu placeholders and subscription
without an A allowlist. Hiding parent entries alone is insufficient. Also audit:

- Today summary cards, reviews, Booking panels, service-settings links and
  “Ajouter une réservation”;
- Avis source selector, mixed counters, direct-detail links, draft/publish and
  disabled synchronize/settings controls;
- all composed Establishment Knowledge sections and Booking-owned hours/tables;
- settings routes, access-management controls, shell switches/logout/footer,
  shortcuts, mobile navigation, empty/error recovery links and direct URLs;
- API endpoints and Server Actions, including shared inbox mutations and Google
  OAuth callbacks; and
- retirement redirects, which still need availability and authorization checks
  at their destination.

HIDE Direct Feedback during A, AI before C, and Booking, Team/Personnel,
Pointage, Formalités, Stock, Marketing, Compliance, resources/menu placeholders
and subscription unless a specifically approved dependency exception applies.
Preserve repository implementations and independent Product obligations.

## 9. Proposed capability exposure policy

These are six independent decisions: navigation visibility; server page/route
availability; API/action availability; authorization; user/establishment
prerequisites; temporary operational health. Current entitlements and role
filters are not a complete release-availability mechanism.

| Condition                                    | Proposed customer experience                                                                                                                             |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Outside active customer release              | HIDE navigation, subsections, shortcuts and actions; separately approved server availability denies direct route/API/action entry with bounded recovery. |
| In release, permitted, configured and usable | SHOW the real capability and permitted operations.                                                                                                       |
| In release, permitted, missing prerequisite  | Visible setup/LOCK with understandable reason and authorized next action.                                                                                |
| User lacks permission                        | Hide unavailable navigation/actions; existing server authorization fails closed independently of availability.                                           |
| Temporary provider failure                   | Keep appropriate visible failure/retry/support state; do not fabricate data or success.                                                                  |
| Revoked connection                           | Explain reconnection and block affected external operations; read access remains subject to independent data/retention rules.                            |
| Prototype, fixture-only or unfinished slice  | HIDE from the invited customer release.                                                                                                                  |

COMING SOON needs a specific Product decision; the Beta navigation is not filled
with future modules. Hiding menus is not a security control. Availability never
replaces, broadens or weakens authorization. Release metadata must not become
the gate input by implication. The trusted server must scope every applicable
read and mutation to organization + establishment and revalidate permissions.
No flag infrastructure, server gate or navigation edit is implemented here.

### Actual permission baseline, not a new Product role matrix

The [server permission map](../apps/backoffice/src/server/auth/permissions.ts)
and [Reputation authority](features/reputation/README.md#5-authorization-and-trusted-scope)
currently grant read, draft-create and note-create to OWNER/MANAGER/STAFF;
feedback-manage and reply-publish to OWNER/MANAGER; connector/settings-manage to
OWNER. STAFF records/mutations are limited to assigned items. Publish permission
exists without an implemented or approved provider publication workflow.
Profile read grants all three roles, profile manage OWNER/MANAGER, and Restaurant
Knowledge read/manage OWNER/MANAGER only. Access administration has additional
target-role/establishment constraints, not unrestricted MANAGER administration.
All remain subject to current server-derived active membership, context and
capability entitlements. Confirm Product approver role separately (AVIS-05/08).

## 10. Proposed maturity readiness gates

The [production register](operations/PRODUCTION_READINESS.md) remains the only
global gate register; the table below proposes release acceptance evidence,
not replacement gate statuses. Private approvals use opaque evidence references.
No documentation check, local test or earlier foundation QA approves rollout.

| Target                 | Proportionate proposed evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Existing evidence / missing evidence                                                                                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Invited Private Beta A | End-to-end access/recovery/provisioning and zero/one/many context; Google connect/discover/bind/import/manual refresh/draft/Human publish/confirmed reconciliation; tenant/role/assignment denial; empty/failure/retry/reconnect; absence of unfinished exposure across all entry points; representative desktop/mobile real Browser QA; support/alert exercise; cloud backup/restore and rollback; applicable global/provider/privacy approvals and separately approved release identity/cohort. | Foundation code/tests and bounded draft QA exist. Full A scope, real Google provider path, release availability, customer journey QA, operational drills and required approvals are missing or blocked. Configured Google setup QA is historically environment-blocked. |
| Public Beta            | Private-Beta scope accepted, observed invited-cohort operation and bounded defects resolved; approve wider acquisition/onboarding/recovery/support model; capacity/quota/cost/privacy evidence for expected load; rerun affected responsive and denial scenarios; explicit public audience, stage and rollout approval.                                                                                                                                                                           | No complete A baseline or dated cohort/public rollout evidence established. No calendar target approved.                                                                                                                                                                |
| Release Candidate      | Approve exact candidate scope/identity and acceptance inventory; close blockers or explicitly disposition eligible residual defects; representative regression/security/provider tests, responsive QA, migration/config and rollback/restore evidence match candidate; named monitoring/support/release owners.                                                                                                                                                                                   | No RC candidate, freeze decision or release evidence established. Criteria must be scoped at its own decision, not inferred from a version suffix.                                                                                                                      |
| General Availability   | Accepted RC and evidence of sustainable customer operation, proportionate reliability/capacity/support and vendor/privacy/retention controls; commercial/billing readiness matching actual offering; reviewed recovery/exit/rollback and explicit GA/Stable identity and deployment authorization.                                                                                                                                                                                                | No GA decision or evidence established. Free invited Beta does not decide future paid billing.                                                                                                                                                                          |

Future UI/runtime changes require their own Technical VERIFY and Browser QA
under current workflow. This documentation diff is `UI_AFFECTING: NO`,
`BROWSER_QA_REQUIRED: NO`; Browser QA is not applicable to the draft itself.

## 11. Decisions, conflicts and next workflow step

| Decision / finding                       | Evidence / concrete approval choice needed                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RR-01: owner and cross-module routing    | Accept this single proposed Engineering destination and Product/engineering ownership through Control Tower, or name an existing controlling owner. Decide readiness and a documentation-only OpenSpec strategy; do not bypass Discovery.                                                                                                                                            |
| RR-02: A Google scope                    | Supplied A direction proposes Google; AVIS-01 still says V1 unresolved. Explicitly approve the A-only Google sequence or revise it. This proposal is not a silent replacement for current capability authority. Facebook/Instagram deferral must preserve confirmed high-level inclusion and unresolved AVIS-02/03.                                                                  |
| RR-03: exact journey and exposure        | Approve Today landing, minimum profile and permitted settings; specify required setup, operator-assisted access/recovery, A-only source/metric scope, Human publish approval and deep-link recovery. Approve the policy as a roadmap decision; any implementation remains separately bounded.                                                                                        |
| RR-04: B boundaries                      | Follow Satisfaction SAT-01–10 and supplemental Expérience client directions. Reconcile request-first contact conflict and trusted domain/client-address conflicts; decide bounded follow-up/actions. No unified provider/private inbox or summary is approved by this roadmap. Restaurant Knowledge Expérience client remains descriptive Knowledge, separate from private feedback. |
| RR-05: C dependencies                    | No verified Mistral/Reputation AI foundation found; do not assume one from conversation. Resolve AVIS-06/provider and Knowledge consumption decisions and Google content-use limits before planning a deliverable AI contract. Automatic publication remains excluded.                                                                                                               |
| CONFLICT: dossier submission description | Reputation tracker says not submitted; dated OpenAI operations dossier records submitted/awaiting response. Route factual documentation reconciliation to operations/Product; neither source approves production provider use.                                                                                                                                                       |
| Potential provider constraint            | Official Google storage/content restrictions require provider/privacy interpretation for intended persistence, continued read access, summaries and AI. No compliance claim or technical storage design chosen.                                                                                                                                                                      |
| Unavailable evidence                     | Live Page Chats/selected Control Tower, private provider console/approval, production credentials/quotas, deployed candidate, customer cohort, live monitoring, restore and rollback exercises were not inspected. Preserve their unknown status.                                                                                                                                    |

Current stage: **Discovery / Shaping — awaiting Human / Control Tower
ownership, Product reconciliation and OpenSpec-readiness decision**. Suggested
bounded name: `release-roadmap-foundation`, currently unused. This is not a
Gate 1 approval packet. Control Tower first decides owner, conflicts, strategy
and readiness; a later change must use CLI-resolved `yuta-spec-driven`
instructions, then exact Proposal/Analysis Gate 1 review before dependent work.
Whether a no-spec documentation path is valid must be decided from the eventual
bounded request; no `skip_specs` value, later artifact or approval is invented.

## 12. Maintenance and verification boundaries

After approval, update this owner in place for changed sequencing, availability
intent and evidenced blockers. Keep version updates at Product Release,
capability requirements at owning homes/main specs, and operational approvals
in Production Readiness. Do not turn CURRENT_STATE into an implemented future
catalog or publish this roadmap on the public website.

The initial authorized edit scope is this proposed draft, its discovery handoff
and the documentation index link. No runtime, schema, API, onboarding enum,
feature flag, dependency, provider, version, deployment or readiness value is
changed. Exact executed checks, results, skipped checks, file hashes and dirty
checkout attribution are recorded in the handoff. That evidence is not Product,
Technical VERIFY, Browser QA or production acceptance.
