# Avis & commentaires

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-09-30

This is the canonical Product Knowledge home for the bounded Reputation domain:
the Backoffice `Avis & commentaires` and `Satisfaction client` surfaces, public
direct feedback, Reputation-owned settings, and provider foundations. It keeps
Product intent, implementation evidence, provider capability, environment
state, and production readiness separate.

The operational implementation tracker is [STATUS.md](STATUS.md). A backlog
item, schema field, connector, UI control, or archived change does not approve a
provider for the current Product scope.

## 1. Purpose and current Product boundaries

`Avis & commentaires` is intended to reduce the restaurant operator's work when
handling customer interactions that may need a response. The established
provider-independent Product direction is to:

- centralize recent interactions and make unanswered items easy to find;
- prepare AI-assisted reply drafts from real, approved restaurant information;
- let the operator adjust tone and structure and avoid unnecessary repetition
  of the customer's words;
- keep the proposed reply manually editable; and
- require Human validation before any external publication.

The efficiency objective is qualitative. It does not approve batch handling,
automatic triage, automatic publication, or autonomous replies.

Facebook and Instagram have confirmed Human-decided high-level inclusion in
this functionality. For both providers, `CURRENT_V1_STATUS: UNRESOLVED`: exact
interaction types, contracts, authentication, import, display semantics, AI
draft linkage, manual editing, Human approval, publication, synchronization,
retry, permissions, and release sequencing remain unresolved. Their configured
public links are a separate implemented settings capability, not connectors.
Confirmed inclusion does not approve any provider-specific behavior or
production enablement.

Outside the bounded Release A decision below, Google's inclusion in a current
Product V1 remains `UNRESOLVED`. Existing code, persisted Google rows,
OAuth/location support, UI labels, schemas, backlog language, and historical
implementation work do not establish a Human-approved Google V1 decision.

Public direct-feedback collection is separately approved by
[ADR-004](../../decisions/ADR-004-independent-public-feedback-application.md)
and implemented in `apps/feedback-web`.

### Accepted Foundation / Release A exception

The Human accepted [RR-01–RR-03](../../PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions)
for Release A only. Google is the A provider: connect/discover/explicit bind,
later import/update without duplicates, inbox/detail, manual drafts, manual
refresh, explicit final-text approve/publish and failure/reconnect recovery.
OWNER manages the connector; OWNER/MANAGER refresh and approve/publish; STAFF
reads, notes and drafts assigned reviews only. An authorized author may approve
their own reply through the separate publication action. Save is never approval
or publication; changed text cannot inherit approval of an older draft.

A excludes AI, batch approval/publication, scheduled synchronization and Direct
Feedback customer exposure. Facebook/Instagram high-level inclusion and broader
AVIS questions remain. Where matrices below say Google V1 or approval roles are
unresolved, they describe the broader capability outside this accepted A-only
exception. Implementation absence and provider/privacy prerequisites remain.

For `release-a-customer-exposure-foundation`, the current Human separately chose
a server-selected A profile for the whole customer Backoffice instance, with
internal mode kept separately; build/test only, without staging/production
activation. The [task decision record](../../reviews/release-a-customer-exposure-foundation/01-analysis-review.md#request-and-delegation)
attributes that choice. Exposure must include page/API/action and Google resource
scope, independently from authorization; internal mixed-source behavior remains.
This decision does not implement import, refresh or publication. A bound
connector and an empty persisted inbox do not prove a successful zero-review
import, a failed import or remote reply state.

## 2. Provider-independent flow stages

Each stage has its own state. No aggregate “review management” label promotes
one stage from another.

| Stage                             | Product status                                                                                      | Current implementation                                                                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Receive/import interaction        | Direct-feedback collection is approved. Provider-specific social/Google import scope is unresolved. | Direct submissions persist. Google import is absent. No Facebook or Instagram connector exists.                                           |
| Display in YUTA                   | A centralized view of recent interactions is confirmed.                                             | `/visibilite-reputation/avis` displays persisted Google and direct items; `/visibilite-reputation/satisfaction` forces direct-only scope. |
| Identify items needing a response | Recent and unanswered visibility is confirmed.                                                      | Server-backed counters, status filters, newest ordering, and `unanswered` sorting exist.                                                  |
| Generate an AI reply draft        | Human-supported direction; exact AI and grounding contract unresolved.                              | Not implemented. Stored/displayed analysis fields and AI-ready schema do not constitute an AI service.                                    |
| Manually edit a draft             | Confirmed.                                                                                          | A persisted manual draft form exists only for persisted Google items. It does not generate an AI draft.                                   |
| Human review/approval             | Required before any external publication. Exact approval state and role remain unresolved.          | No distinct approval workflow is implemented.                                                                                             |
| Publish to provider               | Provider-specific current scope is unresolved.                                                      | Not implemented. The Google publication button is disabled.                                                                               |
| Synchronize publication state     | Unresolved.                                                                                         | Not implemented.                                                                                                                          |
| Provider error/retry              | Unresolved.                                                                                         | Connector setup has bounded recovery states; review import/publication retry does not exist.                                              |
| Automation/auto-reply             | Not approved.                                                                                       | Not implemented.                                                                                                                          |
| Analytics/reputation insights     | Proposed or unresolved beyond existing operational counters.                                        | No approved analytics capability is implemented; inbox counters are operational presentation only.                                        |

## 3. Provider and flow matrix

`UNKNOWN` and `UNRESOLVED` indicate that repository evidence cannot safely fill
the cell.

| Provider/source | Product status                                                 | Read/import                                                             | Display                                                               | AI draft        | Manual edit                                        | Human approval                   | Publish                                             | Sync            | Retry                                             | Automation   | Unresolved boundary                                                          |
| --------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------- | -------------------------------------------------- | -------------------------------- | --------------------------------------------------- | --------------- | ------------------------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| Direct feedback | Approved collection and private Backoffice processing          | Implemented through `apps/feedback-web` submission                      | Implemented; direct-only Satisfaction view also exists                | Not implemented | No provider-reply editor                           | No external publication workflow | Not applicable to the current private-feedback flow | Not applicable  | Submission and UI recovery are bounded separately | Not approved | Whether a future customer-response channel exists                            |
| Google          | Current Product V1 `UNRESOLVED`; implementation footprint only | Not implemented; OAuth/account/location foundation is not review import | Implemented for persisted Google rows, including development evidence | Not implemented | Implemented persisted manual draft for Google rows | No distinct approval workflow    | Not implemented; UI control disabled                | Not implemented | Review import/publication retry absent            | Not approved | V1 inclusion, import, publish, reconciliation, provider operations           |
| Facebook        | High-level inclusion `CONFIRMED`; current V1 `UNRESOLVED`      | Not implemented                                                         | Not implemented                                                       | Not implemented | Not implemented                                    | Unresolved                       | Not implemented                                     | Not implemented | Not implemented                                   | Not approved | Recommendations/reviews, post/reel comments, auth and all provider contracts |
| Instagram       | High-level inclusion `CONFIRMED`; current V1 `UNRESOLVED`      | Not implemented                                                         | Not implemented                                                       | Not implemented | Not implemented                                    | Unresolved                       | Not implemented                                     | Not implemented | Not implemented                                   | Not approved | Comments, mentions, other interaction types, auth and all provider contracts |

The OWNER-managed `googleReviewUrl`, `facebookReviewUrl`, and `instagramUrl`
fields are safe public destinations shown after direct-feedback submission.
They do not read provider interactions, authenticate a provider, publish a
reply, or prove a connector exists.

## 4. Current implemented model

### Product surfaces

- Backoffice inbox: `/visibilite-reputation/avis`.
- Direct-feedback-only Backoffice inbox:
  `/visibilite-reputation/satisfaction`.
- Review detail route: `/visibilite-reputation/avis/[reviewId]`, redirecting to
  the inbox with the item selected.
- Public feedback landing and form: `/` and `/{tenantSlug}` in
  `apps/feedback-web`.
- Public submission endpoint: `POST /api/public/feedback/{tenantSlug}`.
- Google connector configuration: `/parametres/integrations`.

The `/visibilite-reputation` route group is canonical. Former `/clients/*`
Backoffice routes have permanent redirects.

### Inbox and operational mutations

The inbox implements tenant-scoped list/detail reads, filters, search, sorting,
pagination, new/unanswered/negative counters, status changes, assignment,
manual Google draft persistence, and internal notes. Material mutations repeat
authorization checks on the server and create Reputation audit events.

The UI can display persisted sentiment, urgency, summary, topics, and suggested
action. Their schema and presentation do not prove that current runtime code
generates them with AI.

### Direct public feedback

The five-stage mobile flow collects a required 1–5 rating plus optional topics,
comment, and contact information. Contact data requires consent. The raw IP is
not stored. When a client address is available, a salted hash supports a
five-submissions-per-15-minute database rate limit. A honeypot provides basic
bot protection.

The approved production boundary requires a verified hostname, a matching
configured public slug, mandatory security configuration, and a trusted client
identity. The current implementation cross-checks active domain, organization,
establishment, and slug state, but it does not check domain verification
evidence. It also validates `PUBLIC_FEEDBACK_IP_HASH_SALT` only when a client
address is present, so a missing address can bypass the database rate limit.
These two divergences are tracked by the unfinished
`feedback-public-trusted-boundary-hardening` change and remain unresolved; its
Apply phase is blocked pending trusted production client-IP provenance.
Localhost slug lookup remains development-only. Customer email and phone are
not sent to an AI provider.

### Reputation-owned settings

The accepted
[review/social-link specification](../../../openspec/specs/reputation/review-social-links-configuration/spec.md)
implements one OWNER-only atomic Save for three nullable public destinations.
It uses one fail-closed provider URL policy, conflict/retry-safe persistence,
and mutation audit. Google remains manual-only and independent of Google
Business Profile OAuth/location state. This capability performs no provider
request and provisions no missing settings row.

### Google connector foundation

OAuth start/callback, AES-256-GCM credential storage, account and location
discovery, server-verified selection, token refresh, and recovery UI are
implemented. Review import, scheduled synchronization, reply publication, and
remote/local reply reconciliation are not implemented. This implementation
foundation does not decide Google Product V1 scope or production readiness.

## 5. Authorization and trusted scope

Backoffice access requires a database-backed server session, active membership,
`reputation.enabled`, and `reputation.read`. Trusted organization,
establishment, role, entitlement, and permission values are derived server-side
and never accepted from browser input.

Current authorization and implementation evidence establish:

- `reputation.read`: `OWNER`, `MANAGER`, and `STAFF`;
- `reputation.feedback.manage`: `OWNER` and `MANAGER`;
- `reputation.reply.create`: `OWNER`, `MANAGER`, and `STAFF`;
- `reputation.note.create`: `OWNER`, `MANAGER`, and `STAFF`;
- `reputation.settings.manage`: `OWNER` only; and
- `reputation.connector.manage`: `OWNER` only.

`STAFF` repository reads and mutations are restricted to items assigned to the
authenticated user. Every Backoffice read is scoped by organization and active
establishment. Public direct-feedback scope comes from verified server-side
hostname resolution.

The authorization map also defines `reputation.reply.publish` for `OWNER` and
`MANAGER`, but no provider publication path exists. A permission constant is
not proof that publication is approved for a provider. The exact Product role
that performs Human approval, the approval state transition, and provider
account ownership remain unresolved.

See [Authentication](../../architecture/AUTHENTICATION.md) for the current
authorization authority.

## 6. AI and Restaurant Knowledge boundary

Product direction calls for AI-assisted drafts grounded in real restaurant
information, with tone/structure adjustment and avoidance of unnecessary
repetition. That direction is `DECIDED_NOT_IMPLEMENTED`.

Restaurant Knowledge remains owned by the Establishment capability and is
discoverable from the
[Informations générales Product Knowledge home](../establishment/general-information/README.md)
and [ADR-007](../../decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md).
Reputation must consume approved knowledge through a separately reviewed
contract; it must not duplicate Restaurant Knowledge or treat unvalidated
content as fact.

No AI provider, model, prompt, embedding/vector store, retrieval contract,
grounding contract, correction-learning mechanism, persistence policy, or
autonomous action is approved or implemented for Reputation.

## 7. Bounded pending-state capability

The archived `review-reply-form-pending-state` change proves only the local
Google manual-draft Save feedback:

- idle label `Enregistrer`;
- pending label `Enregistrement du brouillon…`;
- the existing submit remains disabled and exposes Button-owned busy semantics;
- the textarea is not additionally locked by this pending behavior; and
- existing success/error presentation remains intact.

The current
[main specification](../../../openspec/specs/reputation/reply-draft-pending-feedback/spec.md),
[archived change](../../../openspec/changes/archive/2026-09-25-review-reply-form-pending-state),
[final review](../../reviews/review-reply-form-pending-state/03-final-review.md),
and [Browser QA](../../reviews/review-reply-form-pending-state/qa/QA_REPORT.md)
record `8/8` tasks and candidate-scoped Technical/VERIFY/QA PASS. Those results
do not cover AI, provider import/publication/synchronization, analytics, the
whole Reputation page, environment enablement, or production readiness.

## 8. Environment and production state

- Repository implementation: present for the bounded capabilities described
  above.
- Environment: `UNVERIFIED` outside recorded local evidence.
- Production readiness: `BLOCKED`.
- External provider readiness: `BLOCKED` or `UNRESOLVED` by provider/stage.

Production still requires verified hostnames and privacy/release controls for
public feedback, approved provider configuration and operations where
applicable, deployment evidence, and separately approved Product/provider
scope. Repository implementation and historical local QA do not authorize
production use.

## 9. Explicit exclusions

Current canonical knowledge confirms Facebook and Instagram as high-level
Product direction. It does not approve:

- Facebook or Instagram current V1/release inclusion, connectors, or exact
  interaction types;
- Google as a current Product V1 requirement;
- provider publication, publication-state synchronization, or review retry;
- batch approval or batch publication;
- automatic triage, autonomous replies, or automatic publication;
- DMs, WhatsApp, broad social listening, or social scheduling;
- AI model/provider/prompt/retrieval/learning contracts;
- Reputation analytics or notifications beyond current operational counters;
- a provider-derived Restaurant Knowledge write path; or
- production deployment or enablement.

## 10. Human decisions still required

| ID      | Exact question                                                                                                          | Current evidence and why unresolved                                                                                                                                           | Affected scope and prohibited assumption                                                                                                                                           | Required authority/review                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| AVIS-01 | Is Google part of the current Product V1?                                                                               | Google implementation exists, but no explicit Human-approved current V1 decision was found; legacy evidence explicitly corrects the earlier broad classification.             | Google import, inbox positioning, draft, publish and roadmap. Do not infer approval from code, schema, UI, backlog, or archived work.                                              | Owning Human Product decision; CT advice optional.                                                    |
| AVIS-02 | Which Facebook interactions are in scope, and is Facebook approved for the current V1/release?                          | High-level Facebook inclusion is confirmed; current V1 status, Recommendations/reviews versus post/reel comments, and release sequencing are unresolved.                      | Read/import, display, AI draft linkage, manual edit, Human approval, publish, sync, retry, auth, account ownership and permissions. Do not treat a configured link as a connector. | Human Product decision plus provider/security review.                                                 |
| AVIS-03 | Which Instagram interactions are in scope, and is Instagram approved for the current V1/release?                        | High-level Instagram inclusion is confirmed; current V1 status, comments, mentions, other interaction types, and release sequencing are unresolved.                           | Read/import, display, AI draft linkage, manual edit, Human approval, publish, sync, retry, auth, account ownership and permissions. Do not treat a configured link as a connector. | Human Product decision plus provider/security review.                                                 |
| AVIS-04 | Which providers support import, publication, state reconciliation, and manual or automatic retry in the approved scope? | No complete provider flow exists; provider-specific contracts and feasibility were deliberately not researched in this migration.                                             | External effects and failure recovery. Do not infer support from a button or permission constant.                                                                                  | Human Product decision followed by provider, security and operations review.                          |
| AVIS-05 | What is the exact Human approval workflow?                                                                              | Human validation-before-publication is confirmed, but approval state, draft-without-publish behavior, approver role, batch approval and batch publication are undefined.      | Reply lifecycle and authorization. Do not equate manual draft Save with approval.                                                                                                  | Human Product and authorization decision.                                                             |
| AVIS-06 | What AI and Restaurant Knowledge consumption contract is approved?                                                      | Grounded AI drafting is desired; no provider/model, prompt, retrieval, grounding, tone command, correction-learning, persistence or validated-source contract exists.         | AI drafting and cross-module Restaurant Knowledge use. Do not invent technical architecture or learning.                                                                           | Human Product decision plus AI, data, privacy and Restaurant Knowledge owner review.                  |
| AVIS-07 | Which analytics and notification behaviors belong to current scope?                                                     | Advanced analytics, search and notifications are proposal/backlog material; current counters do not decide an analytics product.                                              | Metrics, alerts and reporting. Do not promote proposed measures to V1.                                                                                                             | Human Product decision.                                                                               |
| AVIS-08 | What provider-account ownership and Product-level approve/publish role policy applies?                                  | Trusted implementation is establishment-scoped and has role grants, but provider-account ownership and the Product approval role are not explicitly decided.                  | Organization/establishment/provider account, approval and publication. Do not infer Product policy from tenant-scoped code.                                                        | Human Product, authorization and tenancy review.                                                      |
| AVIS-09 | What provider credential, webhook, retention and operational recovery policy applies?                                   | Google credential encryption and refresh exist, but final token lifecycle, retention, webhook semantics, provider incident handling and production operations are incomplete. | Security, privacy, provider operations and production readiness. Do not treat implementation foundation as an approved operating policy.                                           | Security, privacy, provider and operations review with Human approval where Product behavior changes. |

## 11. Authority and discovery map

### Product, lifecycle and decisions

- [Product Knowledge map](../../PRODUCT_KNOWLEDGE.md)
- [Module Registry](../../MODULE_REGISTRY.md)
- [Current State](../../CURRENT_STATE.md)
- [Reputation implementation tracker](STATUS.md)
- [ADR-004: independent public feedback](../../decisions/ADR-004-independent-public-feedback-application.md)
- [ADR-007: Restaurant Knowledge ownership](../../decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)

### Normative specifications and UI knowledge

- [Review/social-link configuration](../../../openspec/specs/reputation/review-social-links-configuration/spec.md)
- [Reply-draft pending feedback](../../../openspec/specs/reputation/reply-draft-pending-feedback/spec.md)
- [Satisfaction page pack](../../ui/pages/backoffice-visibilite-reputation-satisfaction/README.md)
- No canonical Avis page pack currently exists; route code and the bounded
  pending-state spec/reviews remain the current evidence.

### Implementation and tests

- [`apps/backoffice/src/app/(authenticated)/visibilite-reputation`](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation>)
- [`apps/backoffice/src/server/reputation`](../../../apps/backoffice/src/server/reputation)
- [`apps/feedback-web/src/app`](../../../apps/feedback-web/src/app)
- [`packages/contracts/src/reputation`](../../../packages/contracts/src/reputation)
- [`packages/db-cloud/src/reputation-repository.ts`](../../../packages/db-cloud/src/reputation-repository.ts)
- [`packages/db-cloud/src/schema/reputation.ts`](../../../packages/db-cloud/src/schema/reputation.ts)
- [`apps/backoffice/test`](../../../apps/backoffice/test),
  [`packages/contracts/test/reputation.test.ts`](../../../packages/contracts/test/reputation.test.ts),
  and [`packages/db-cloud/test`](../../../packages/db-cloud/test)

### Historical provenance

- [Archived pending-state change](../../../openspec/changes/archive/2026-09-25-review-reply-form-pending-state)
- [Pending-state review evidence](../../reviews/review-reply-form-pending-state)
- [Archived review/social-link change](../../../openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration)
- [Review/social-link review evidence](../../reviews/reputation-review-social-links-configuration)

Archived changes and reviews explain provenance. Current main specs, accepted
decisions, current Product Knowledge, implementation, and question-specific
authorities determine current truth.

## 12. Knowledge migration control

The Human-supplied `AVIS_COMMENTAIRES_LEGACY_KNOWLEDGE_EXTRACT.md` with SHA-256
`4827f1193aafb9555bdadfd816d41d8a60dfd319dbff23f1b288c51da3f7aece`
was used only as legacy evidence for the 2026-09-28 reconciliation. Its claims
were checked against current question-specific repository authority. Export
markers were ignored, and the extract was not copied into the repository.

### Migrated Avis & commentaires scope

The scope-bound migration covers the knowledge needed to recover:

- the provider-independent Avis & commentaires purpose, recent and unanswered
  visibility, and relationship to Direct feedback;
- the separate Google implementation foundation and unresolved V1 status,
  confirmed high-level Facebook and Instagram inclusion, and unresolved
  Facebook and Instagram current V1 and provider-specific behavior;
- the AI-assisted drafting and Restaurant Knowledge grounding direction,
  unresolved consumption contract, tone/structure/repetition-avoidance
  direction, manual editing, and mandatory Human validation before external
  publication;
- unresolved provider import, publication, synchronization and retry behavior,
  current technical permissions, unresolved Product approve/publish policy,
  and organization/establishment implementation scope;
- current implementation, environment, production-readiness and authorization
  states, the candidate-scoped `review-reply-form-pending-state` evidence, all
  nine Human-decision clusters, and the explicit non-inferences above.

This migration includes only the relationship of Satisfaction client, public
feedback, social-link settings, and other shared Reputation capabilities to
Avis & commentaires. It does not migrate or retire Page Chat authority for
those capabilities, Marketing, Visibility, or any other Reputation scope.

### Fresh-agent acceptance evidence

The repository-only
`AVIS_COMMENTAIRES_FRESH_AGENT_ACCEPTANCE_REPORT.md` has SHA-256
`1fc49dc598e00aa63a9b98beb1a77430ef5aca9907fdf1ab562b137d481eb258`.
The fresh agent used no Page Chat history, legacy extract, reconciliation
report, prior agent memory, or web research. It reported:

```text
REPOSITORY_MUTATED: NO
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
RECONCILIATION_REPORT_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 0
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The report establishes repository discoverability for the exact migrated scope
only. It is acceptance evidence rather than Product authority, is not copied
into this home, and does not resolve or promote any Product, provider,
authorization, implementation, environment, readiness, or production state.

### Authority state after cutover

Repository reconciliation, bounded canonicalization, fresh-agent acceptance,
and the Human-authorized cutover are complete for the migrated Avis &
commentaires scope above. Under the
[Authority Model](../../AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition):

- the repository is canonical knowledge for this exact migrated scope;
- the Avis & commentaires Page Chat is `LEGACY EVIDENCE ONLY` for this exact
  scope and remains available for historical or forensic lookup;
- Codex owns repository discovery, shaping, cross-module reasoning and
  governance coordination under
  [task collaboration](../../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review).
  CT advice is optional in `CT_BRIDGE` or `HUMAN_CT_BRIDGE`; unresolved
  Product/authority decisions still require the owning Human.
- Coding Agents execute and verify only the selected task's authorized scope;
  routine gates use the mode-defined review mechanism.

This cutover does not delete or invalidate historical evidence, change another
Page Chat's authority, close an unresolved item, authorize Product work or
provider behavior, promote the pending-state PASS, or authorize environment,
production-readiness, production, or deployment state.

## 13. Satisfaction client / Feedback direct knowledge migration control

The Human-supplied
`SATISFACTION_CLIENT_FEEDBACK_DIRECT_LEGACY_KNOWLEDGE_EXTRACT.md` with SHA-256
`8a1af102380f40082c3a96f287528013fc5d801acc162743926cc7d6a457781c`
was used only as legacy evidence for the 2026-09-28 reconciliation. The complete
extract was checked against current repository authority and implementation.
Export markers were ignored, and the extract was not copied into the
repository. It does not replace Product authority or authorize conflict
resolution, implementation, production use, fresh-agent acceptance, or Page
Chat retirement.

### Scope and canonical boundary

Satisfaction client / Feedback direct is the private direct-feedback capability
inside Reputation. It is separate from external Avis/provider review ingestion,
reply drafting, approval, publication, synchronization, and provider account
operations. It may share the Reputation inbox, settings, contracts, persistence,
and trusted tenancy foundation without acquiring provider behavior.

| Dimension             | Canonical current state                                                                                                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product purpose       | Collect direct customer feedback for private restaurant processing. Public collection and the independent runtime boundary are `APPROVED`.                                                                                                                                                              |
| Semantic owner        | Reputation owns direct-feedback meaning, settings, inbox processing, and the relationship to external review destinations.                                                                                                                                                                              |
| Runtime owner         | `apps/feedback-web` owns the public customer experience and submission route. `apps/backoffice` owns authenticated restaurant processing.                                                                                                                                                               |
| Data owner            | `packages/db-cloud` owns cloud persistence. Direct feedback is organization- and establishment-owned and must not enter POS or Display persistence.                                                                                                                                                     |
| Public entry          | Restaurant-owned links and QR entry are accepted at the architectural level. Exact QR creation, management, printing, distribution, and source-attribution workflow is not implemented or release-approved.                                                                                             |
| Trusted public scope  | Production authority must come from a verified server-resolved hostname and matching configured slug. Localhost slug lookup is development-only. The current missing `verifiedAt` enforcement is a preserved implementation conflict.                                                                   |
| Submission            | The current public UI uses a five-stage journey with a required 1–5 rating, optional topics and comment, and optional contact data with consent. The shared contract accepts additional optional fields that the current UI does not expose; contract capacity does not approve a broader Product form. |
| Persistence           | A successful real submission creates a `DIRECT` / `DIRECT_FEEDBACK` item plus direct-detail data in the same cloud transaction. The customer receives an acknowledgment and identifier response, not an authenticated history or readback surface.                                                      |
| Visibility            | Submitted content is private by default. It is visible only through the authenticated, tenant-scoped Reputation inbox. There is no customer-facing publication, testimonial, or public feedback feed.                                                                                                   |
| Restaurant processing | `/visibilite-reputation/satisfaction` fixes the source to `DIRECT` and supports the current tenant-scoped inbox, counters, search, filters, detail, status, assignment, and internal notes. It has no provider reply editor.                                                                            |
| Customer follow-up    | Contact data and consent can be stored; the request-first direction below conflicts with ungated fields. No customer-response channel, message delivery, case conversation or approved exact follow-up workflow is implemented.                                                                         |
| Review solicitation   | After a successful submission, safe configured Google, Facebook, or Instagram destinations may be shown independently of rating. They are optional outbound links owned by Reputation settings, not connectors, publication, score gating, or proof of an external review.                              |
| External publication  | Direct feedback is not published to an external provider. Conversion into a testimonial or provider review, automated routing, and any rating-based gate require a separate Human Product decision and privacy/provider review.                                                                         |

### Customer and restaurant flow

| Stage                      | Current evidence                                                                                                                              | Classification and boundary                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Entry                      | Public `apps/feedback-web` routes `/` and `/{tenantSlug}`; restaurant-owned link/QR context is accepted by ADR-004.                           | `CONFIRMED`; operational QR management and production distribution remain unresolved.                                                        |
| Tenant resolution          | Server hostname resolution plus slug cross-check; localhost slug fallback only outside production.                                            | Approved fail-closed direction; current missing domain-verification enforcement is `CONFLICT`.                                               |
| Submission                 | Shared Zod contract validates the payload; the visible form exposes rating, topics, comment, first name, email, consent, and honeypot fields. | `IMPLEMENTED`; hidden contract-only fields are not automatically Product-approved UI requirements.                                           |
| Persistence                | One transaction creates the feedback item and direct-detail row under trusted organization and establishment.                                 | `IMPLEMENTED`; no schema or migration is authorized by this reconciliation.                                                                  |
| Acknowledgment             | The endpoint returns `received`; the UI shows a success state and can start another submission.                                               | `IMPLEMENTED`; no customer account, history, receipt delivery, or follow-up promise exists.                                                  |
| Inbox                      | The direct-only Backoffice route reads persisted `DIRECT` items under trusted scope.                                                          | `IMPLEMENTED`; shared Reputation storage does not merge this Product scope with Avis providers.                                              |
| Processing                 | Current list/detail, operational counters, search/filter/sort, status, assignment, and internal notes are available.                          | `IMPLEMENTED`; schema/UI status availability does not settle every lifecycle meaning or service policy.                                      |
| Follow-up                  | Contact and consent evidence may be persisted.                                                                                                | `UNRESOLVED`; no approved outbound customer-contact channel, SLA, role policy, or delivery evidence exists.                                  |
| Resolution                 | Status values include processing, resolved, archived, and spam states.                                                                        | Transport/schema and UI support are `IMPLEMENTED`; exact Product semantics, retention effects, and reopen/delete behavior remain unresolved. |
| Public review solicitation | Safe configured external destinations may appear after success without rating-based branching.                                                | `IMPLEMENTED` under the accepted social-link specification; no provider call or outcome tracking occurs.                                     |
| External publication       | No path publishes the submitted direct feedback or a reply to Google, Facebook, Instagram, or another public destination.                     | `NOT_IMPLEMENTED` and not approved by this migration.                                                                                        |

### Capability and data model

| Capability or data           | Product state                                                                                                     | Implementation state                                                                                                                    | Validation and visibility                                         | Owner and scope                                               | Exclusions / unresolved                                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direct public collection     | `APPROVED`                                                                                                        | `IMPLEMENTED` with two trusted-boundary conflicts                                                                                       | Public form; shared schema; server-owned tenant context           | Reputation; `apps/feedback-web`; organization + establishment | No production authorization; no broad public-site ownership transfer                                                                                            |
| Rating                       | Current public collection uses required integer `1..5`                                                            | Persisted on the feedback item                                                                                                          | Zod validation; private inbox visibility                          | Reputation; organization + establishment                      | Does not authorize rating-based routing or public solicitation gates                                                                                            |
| Topics and comment           | Optional current form data                                                                                        | Topics persist on direct detail; comment persists as feedback content                                                                   | Bounded enum and length validation                                | Reputation; organization + establishment                      | Assistive AI direction is reconciled below; no exact processing contract or public display                                                                      |
| Identity and contact         | Request-first collection direction conflicts with current optional name/email fields; email/phone require consent | Contract/schema also support phone; persistence stores supplied contact and consent timestamp                                           | Private restaurant access only; contact values are not sent to AI | Reputation; organization + establishment                      | Exact follow-up purpose, lawful basis, retention, rights handling, phone exposure, and marketing use are unresolved                                             |
| Visit/order/source context   | Reliable context direction is reconciled below; exact trusted source and fields remain open                       | Order reference, visit date and service period have no rendered input; allowlisted browser sourceTag is submitted as untrusted metadata | Contract validation only when supplied                            | Reputation; organization + establishment                      | Schema capacity must not be promoted to approved collection                                                                                                     |
| Derived operational fields   | Assistive AI intent is reconciled below; no executable AI contract is approved                                    | Repository derives sentiment, urgency, and initial status deterministically from rating/topics; UI can display persisted values         | Server-side implementation                                        | Reputation; organization + establishment                      | Formulas are implementation evidence, not an approved analytics or AI product                                                                                   |
| Abuse controls               | Fail-closed production protection is required                                                                     | Honeypot and per-hash window exist; raw IP is not persisted; missing trusted client identity can currently bypass the per-client limit  | Public generic error boundary                                     | `apps/feedback-web`; salted hash in `packages/db-cloud`       | Trusted client-IP provenance, atomicity, idempotency, duplicates, body limits, monitoring, and incident policy are unresolved or outside current implementation |
| Inbox operations             | Direct-only private processing is in current scope                                                                | List/detail, counters, filters, status, assignment, and notes are implemented                                                           | Authenticated Backoffice only                                     | Reputation; trusted organization + active establishment       | No customer reply delivery and no external provider publication                                                                                                 |
| Social/review links          | Three optional safe destinations are approved                                                                     | OWNER settings and public safe projection are implemented                                                                               | Provider-purpose URL validation; public CTA only                  | Reputation settings; organization + establishment             | No connector, click tracking, score gate, publication confirmation, or provider ownership inference                                                             |
| Notifications, analytics, AI | Bounded attention, analytics and assistive AI direction is reconciled below; exact contracts remain unresolved    | No Satisfaction notification, advanced analytics, or AI workflow is established                                                         | Not applicable                                                    | Undecided                                                     | Requires separate Product, privacy, security, and data-owner decisions                                                                                          |

Environment remains `UNVERIFIED`, production readiness remains `BLOCKED`, and
the external/release dependency remains `BLOCKED`. Local implementation and
test evidence do not promote those lifecycle axes.

### Authorization, tenancy, and privacy boundary

- Public submission has no authenticated customer account. Tenant authority
  comes only from trusted server context; route slug, form data, cookie, browser
  organization, and browser establishment values cannot grant scope.
- Backoffice access requires a database-backed session, active membership,
  `reputation.enabled`, and `reputation.read`. Reads and writes remain scoped by
  organization and active establishment.
- `OWNER`, `MANAGER`, and `STAFF` can read under the current map; `STAFF` is
  restricted to assigned items. `OWNER` and `MANAGER` have
  `reputation.feedback.manage`; status/assignment mutations repeat server-side
  authorization and audit real changes. Internal notes use
  `reputation.note.create` under the existing role map.
- Review/social-link settings require `reputation.settings.manage`, currently
  `OWNER` only. Link settings do not grant connector, publication, customer
  follow-up, or provider-account authority.
- Direct feedback, contact data, consent evidence, hashed client identity, and
  request metadata stay in cloud persistence. Raw client IP must not be stored.
  Retention, erasure, access/export handling, legal basis, privacy notice,
  incident response, and operational access review remain subject to Human and
  privacy/security decisions; this repository reconciliation is not legal or
  compliance evidence.

### Preserved trusted-boundary conflicts

The active, unfinished `feedback-public-trusted-boundary-hardening` change is
planning evidence only and is not canonical Product authority. This
reconciliation does not advance or apply it.

1. **Domain verification conflict:** accepted authority requires an active,
   verified hostname, but the current cloud domain adapter does not read
   `verifiedAt`. Active organization, establishment, and domain status alone can
   therefore produce trusted public context.
2. **Production client-identity conflict:** the route validates the production
   salt only after obtaining a client address. A request without one can persist
   without a salted identity or per-client rate-limit check. The exact trusted
   production client-IP source is also unevidenced.

Both conflicts have an authority direction to fail closed, but implementation
is outside this mission and remains blocked by the existing change workflow and
its required security/environment evidence. No conflict was auto-resolved.

### Human decisions still required for Satisfaction client

| ID     | Exact decision                                                                                                                                                                   | Why it is still required                                                                                                      | Review required                                                |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| SAT-01 | What exact V1 entry and distribution workflow is approved for links, QR codes, printed material, and source attribution?                                                         | ADR-004 accepts link/QR entry, while QR management, printing, ownership, and rollout are incomplete.                          | Product, operations, and release                               |
| SAT-02 | Which current contract fields belong to the approved Product form, and which are required, optional, hidden, or prohibited?                                                      | The visible form and shared contract/schema expose different field sets; capacity is not Product approval.                    | Product, privacy, contracts, and data owner                    |
| SAT-03 | What customer identity/contact purpose, consent wording, lawful basis, follow-up channel, role, SLA, and marketing exclusion apply?                                              | Data can be stored, but no approved customer-response workflow or compliance basis is recorded.                               | Product, privacy/legal, authorization, and operations          |
| SAT-04 | What retention, erasure, anonymization, access/export, legal-hold, audit, and incident policy applies to feedback, contact data, consent, hashes, and metadata?                  | Persistence exists without a complete approved lifecycle policy.                                                              | Privacy/legal, security, data owner, and operations            |
| SAT-05 | What do direct-feedback statuses mean, who may transition them, and what are the reopen, archive, spam, deletion, and resolution effects?                                        | Enums and mutations exist, but implementation does not settle the complete Product service lifecycle.                         | Product and authorization                                      |
| SAT-06 | May direct feedback ever become a public testimonial or external provider review, and under what explicit customer choice and provider policy?                                   | Current feedback is private; outbound links are neutral destinations and do not authorize conversion, gating, or publication. | Product, privacy/legal, provider, and security                 |
| SAT-07 | Which notifications, escalation rules, recipients, thresholds, and delivery providers are approved?                                                                              | Settings/schema/backlog evidence does not establish an operating notification product.                                        | Product, privacy, authorization, and operations                |
| SAT-08 | Which analytics, metrics, benchmarks, aggregation scopes, exports, and retention are approved?                                                                                   | Operational counters exist; advanced Satisfaction analytics and cross-establishment reporting are not approved.               | Product, privacy, tenancy, and data owner                      |
| SAT-09 | Is any AI or Restaurant Knowledge use approved for direct feedback, and what grounding, data-minimization, provider, persistence, Human-review, and automation contract applies? | The Avis AI direction must not be imported into Satisfaction; no direct-feedback AI contract exists.                          | Product, AI, privacy, security, and Restaurant Knowledge owner |

The trusted hostname/client-identity implementation gaps additionally require
the pre-existing security change's evidence and gate approvals. They are
repository conflicts rather than new Product decisions and are not counted as
additional SAT decision packets.

### Original reconciliation disposition — 2026-09-28 baseline

The original legacy claims were assigned one primary disposition. These counts
and the original acceptance/cutover below describe that baseline; the later
[supplemental reconciliation](#14-satisfaction-supplemental-experience-client-reconciliation)
has separate dispositions and a separately recorded Human-exception authority
update; the original PASS and cutover are not extended or repeated:

- `CONFIRMED`: 13 claim groups covering the private direct-feedback purpose,
  Reputation ownership, independent public runtime, direct/provider separation,
  trusted organization/establishment scope, current entry context, private
  inbox relationship, no public publication, and Page Chat governance boundary.
- `IMPLEMENTED`: 17 claim groups covering public routes and form, validation,
  persistence, acknowledgment, direct-only inbox, current mutations, role
  enforcement, audit, settings links, abuse controls, and current data shapes.
- `DECIDED_NOT_IMPLEMENTED`: 1 claim group covering the accepted QR/link entry
  direction whose managed QR and printed operational workflow is incomplete.
- `PROPOSED`: 5 claim groups covering future follow-up, notifications,
  analytics, automation/AI, and expanded operational tooling.
- `UNRESOLVED`: 9 claim groups, recorded as `SAT-01` through `SAT-09`.
- `CONFLICT`: 2 claim groups covering verified-domain enforcement and
  production trusted client identity/rate-limit fail-closed behavior.
- `OBSOLETE`: 8 claim groups where legacy uncertainty was superseded by current
  repository evidence for owner, runtime placement, routes, persistence,
  tenancy, inbox availability, authorization foundation, and test locations.

No `PROPOSED` claim was promoted, no implementation was inferred from Product
intent, and no Human-classified legacy claim was accepted without repository
reconciliation.

### Discovery path and migration state

Start with this README for Satisfaction client / Feedback direct semantics and
boundaries, then use:

- [Product Knowledge map](../../PRODUCT_KNOWLEDGE.md) and
  [Module Registry](../../MODULE_REGISTRY.md) for discovery and lifecycle axes;
- [ADR-004](../../decisions/ADR-004-independent-public-feedback-application.md)
  for the independent public boundary;
- [Satisfaction page pack](../../ui/pages/backoffice-visibilite-reputation-satisfaction/README.md)
  for the approved Backoffice page scope and local QA evidence;
- [Reputation status](STATUS.md) for non-authoritative implementation progress;
- [review/social-link specification](../../../openspec/specs/reputation/review-social-links-configuration/spec.md)
  for the current OWNER settings and safe public projection;
- `apps/feedback-web`, the Backoffice Reputation routes,
  `packages/contracts/src/reputation`, and `packages/db-cloud` for current
  implementation evidence; and
- the unfinished `feedback-public-trusted-boundary-hardening` change only for
  its preserved conflict and workflow status, never as implemented or synced
  authority.

### Fresh-agent acceptance evidence

The repository-only
`SATISFACTION_CLIENT_FEEDBACK_DIRECT_FRESH_AGENT_ACCEPTANCE_REPORT.md` has
SHA-256
`895250659ab743cd0380713ea140ecf5bc9b39f805b734cef4c04dc9cec0dc32`.
The fresh agent used no Page Chat history, legacy extract, reconciliation
report, prior-agent memory, web research, or external legal/privacy research.
It reported:

```text
REPOSITORY_MUTATED: NO
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
RECONCILIATION_REPORT_USED: NO
EXTERNAL_RESEARCH_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 2
AVIS_PROVIDER_SCOPE_REOPENED: NO
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The report establishes repository discoverability for the exact Satisfaction
client / Feedback direct scope only. It is acceptance evidence rather than new
Product authority, privacy or legal advice, compliance evidence, hardening
Apply authority, lifecycle promotion, production authorization, or conflict
resolution.

### Authority state after cutover

Repository reconciliation, bounded canonicalization, fresh-agent acceptance,
and the Human-authorized cutover are complete for the Satisfaction client /
Feedback direct scope above. Under the
[Authority Model](../../AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition):

- the repository is canonical knowledge for this exact migrated scope;
- the shared Avis Page Chat is `LEGACY EVIDENCE ONLY` for the known migrated
  Avis & commentaires and Satisfaction client / Feedback direct scopes;
- the two trusted-boundary conflicts remain open and keep environment and
  production readiness blocked;
- the unfinished `feedback-public-trusted-boundary-hardening` change remains at
  its existing review gate, with no Tasks, Apply, lifecycle, deployment, or
  production authorization;
- Control Tower retains Human-decision and conflict-routing authority for
  `SAT-01` through `SAT-09` and the trusted-boundary review; and
- Coding Agents use repository discovery and require separate authorization for
  implementation or workflow progression.

This cutover does not reopen Avis/provider scope, resolve a conflict, create a
privacy or legal conclusion, change another Page Chat's authority, authorize
hardening Apply, or alter Product, implementation, environment, readiness, or
production state.

## 14. Satisfaction supplemental Experience client reconciliation

### Provenance, authority and naming

On 2026-09-30, the complete Human-supplied
`SATISFACTION_CLIENT_EXPERIENCE_CLIENT_SUPPLEMENTAL_KNOWLEDGE_EXTRACT.md`
(SHA-256 `5ce212e4b90947ca5e48819dcacb29eb7165b2ca95272e388f36a372330e881c`;
50,028 bytes; 2,213 logical lines; no final newline) was read and reconciled
as supplemental legacy evidence. Its exact heading, 57 final control fields,
record inventory and confidences were verified; no transport marker was found.
Available Page Chat history was read by the extractor, but physical Page Chat
history exhaustiveness remains `UNVERIFIED`. The source supplies no durable
implementation evidence; that absence does not establish repository absence.

The current Human mapping is `Expérience client v` -> `Satisfaction client`.
The menu remains **Satisfaction client** and the route remains
`/visibilite-reputation/satisfaction`. The historical rename in HD-02/HIST-01
is provenance only, superseded by this mapping; no second page, route, owner
or knowledge home is created. Reputation remains the semantic owner, with
`apps/feedback-web` for public collection, `apps/backoffice` for restaurant
processing and `packages/db-cloud` for organization/establishment persistence.

The existing Satisfaction repository authority and original shared Avis Page
Chat cutover remain intact. Supplemental reconciliation and the
[Human-exception authority update](#supplemental-human-exception-authority-update)
are complete. The repository is now also canonical for this exact supplemental
delta; `Expérience client v` is **LEGACY_EVIDENCE_ONLY** for it, with historical
and forensic access retained. The original PASS does not cover this delta;
formal delta fresh-agent PASS remains **NO**. No other Page Chat authority,
completed migration, Product code, OpenSpec artifact or readiness axis changes.

### Supplemental Human-exception authority update

On 2026-09-30, the Human explicitly accepted repository-only delta knowledge
sufficiency as PASS with zero material knowledge gaps and authorized only the
supplemental knowledge-authority update for `Expérience client v` ->
`Satisfaction client`. The accepted recovery covers all 33 primary records,
fourteen HIGH-confidence Human items, one MEDIUM-confidence future-only
direction, four unapproved proposals, eight unresolved questions, ten
capabilities, twelve concepts, unchanged SAT-01–09, unresolved SAT-10 and all
three open conflicts. The assessment reported no repository mutation.

The following axes record that Human-accepted delta assessment and exception,
not a new acceptance run or the tool/context history of this maintenance task:

```text
DELTA_REPOSITORY_KNOWLEDGE_SUFFICIENCY: PASS
MATERIAL_KNOWLEDGE_GAPS: 0
STRICT_DELTA_FRESH_AGENT_STATUS: BLOCKED_BY_ENVIRONMENT
AUTOMATIC_PROHIBITED_CONTEXT_ACCESS_DETECTED: YES
PROHIBITED_CONTEXT_CONTENT_USED_AS_EVIDENCE: NO
MEMORY_INDEX_INTENTIONALLY_USED: NO
PERSONAL_CONTEXT_INTENTIONALLY_USED: NO
PAGE_CHAT_HISTORY_USED: NO
SUPPLEMENTAL_LEGACY_EXTRACT_USED: NO
SUPPLEMENTAL_RECONCILIATION_REPORT_USED: NO
ORIGINAL_SATISFACTION_MIGRATION_ARTIFACT_USED: NO
PRIOR_AGENT_REPORT_USED: NO
EXTERNAL_RESEARCH_USED: NO
FORMAL_DELTA_FRESH_AGENT_PASS_RECORDED: NO
HUMAN_EXCEPTION_GATE: APPROVED
ADDITIONAL_DELTA_FRESH_AGENT_RERUN_REQUIRED: NO
```

The accepted assessment records that the environment automatically supplied
prohibited memory context; its content was excluded from evidence, and no
memory-index or personal-context access was intentionally performed in that
assessment. Repository-only delta recovery independently passed, but strict
execution remained BLOCKED_BY_ENVIRONMENT and formal delta fresh-agent PASS
was not achieved. The Human explicitly requires no additional rerun. This
authority update does not rerun acceptance or relabel the exception as formal
acceptance.

Before this update, the repository contained the reconciled supplemental
candidate and `Expérience client v` remained ACTIVE for that exact scope.
The authorized update is now performed and the supplemental consolidation
workflow is complete. Original Satisfaction authority and its earlier cutover
remain unchanged; Avis/provider and Restaurant Knowledge authority remain
separate and unchanged. Control Tower retains Product shaping, conflict and
Human Decision routing, and governance. Coding Agents use repository discovery
and analysis; implementation requires separate authorization.

This exception changes only where the bounded supplemental knowledge is
authoritative. It does not delete historical evidence, certify physical Page
Chat exhaustiveness, resolve SAT-01–10 or any of the three conflicts, advance
hardening Gate 2b, approve a Product/executable contract or implementation,
change authorization, qualify legal/privacy/security/provider status, enable
an environment, promote readiness or authorize production. All reconciled
records, inventories, implementation distinctions and boundaries below retain
their meanings.

### Reconciled Human direction and implementation

All fourteen `EXP-SAT-HD-*` records retain source confidence **HIGH**, including
the superseded naming record. One primary disposition applies to each source
record; partial executable evidence is stated separately. `IMPLEMENTED` below
means the bounded capability exists, not that every Product detail is settled.
`DECIDED_NOT_IMPLEMENTED` includes directions with partial existing foundations.

Evidence keys refer to current repository sources in the evidence map below.
Every row is canonicalized here at its stated classification; rejected current
effects remain discoverable as history, proposals or exclusions. All rows share
the privacy, authorization and non-inference rules below; no row creates a
legal conclusion or an executable contract.

| Source record (confidence) | Reconciled claim and repository comparison                                                                                                                                                                                                                             | Primary disposition     | Secondary classification                                | Open SAT mapping and exact boundary                                                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EXP-SAT-HD-01 (HIGH)       | Private feedback should help understand customer experience, find recurring operational problems, prioritize attention and follow improvement. Existing collection/private inbox already serve the core purpose (E1/E2/E3); broader outcomes remain bounded direction. | CONFIRMED               | ALREADY_CANONICAL + SUPPLEMENTAL_PRODUCT_DIRECTION      | SAT-05/07/08/09/10. No generic quality platform, CRM, autonomous incident management or employee scoring.                                                                                       |
| EXP-SAT-HD-02 (HIGH)       | Historical page rename from Satisfaction client to Expérience client; current Human mapping and navigation (E3) retain Satisfaction client.                                                                                                                            | OBSOLETE                | Historical provenance + NAVIGATION_LIMITATION           | No SAT packet. No current rename, new owner or route; source confidence is not downgraded.                                                                                                      |
| EXP-SAT-HD-03 (HIGH)       | Short, fast form: required 1–5 rating, quick reasons and optional free text. Existing five-stage form implements this bounded capture (E1/E2). Eight visible choices and fourteen transport topic values are implementation, not approval of the exact taxonomy.       | IMPLEMENTED             | ALREADY_CANONICAL + EXECUTABLE_SHAPE_ONLY               | SAT-02. No new field/enum or text-length Product decision.                                                                                                                                      |
| EXP-SAT-HD-04 (HIGH)       | Anonymous by default; customer separately requests follow-up; details are requested only then. Current form always shows optional first name/email and a consent checkbox, with no separate request controlling collection (E1/E2).                                    | CONFLICT                | SUPPLEMENTAL_PRODUCT_DIRECTION + EXECUTABLE_SHAPE_ONLY  | SAT-03, with SAT-04 retention. Product/UI divergence remains open; consent is not a contact request, marketing consent or public attribution.                                                   |
| EXP-SAT-HD-05 (HIGH)       | A neutral Google CTA may follow private feedback regardless of rating. Existing safe success links and normative specification agree (E1/E5).                                                                                                                          | IMPLEMENTED             | ALREADY_CANONICAL                                       | SAT-06. No satisfied-only gate, complaint suppression, testimonial consent, provider call, conversion, import, synchronization or publication.                                                  |
| EXP-SAT-HD-06 (HIGH)       | QR entry and automatic date/time/service/zone context when reliable data exists. ADR-004 accepts QR/link entry; public routes exist, but managed QR and trusted contextual attachment are incomplete (E1/E2/E5).                                                       | DECIDED_NOT_IMPLEMENTED | SUPPLEMENTAL_PRODUCT_DIRECTION + EXECUTABLE_SHAPE_ONLY  | SAT-01. Browser source tag and stored timestamps do not prove visit context. No token, table/order/POS linkage, employee attribution or distribution contract.                                  |
| EXP-SAT-HD-07 (HIGH)       | Simple feedback inbox with conceptual Nouveau / À suivre / Traité. Current direct inbox, status/assignment/notes and audit implement bounded processing (E2/E3).                                                                                                       | IMPLEMENTED             | ALREADY_CANONICAL + EXECUTABLE_SHAPE_ONLY               | SAT-05. The three labels are not an enum or full transition graph; reopen, archive, delete, spam, assignment and resolution meaning stay open.                                                  |
| EXP-SAT-HD-08 (HIGH)       | Attention/alerts for low ratings or explicit customer contact requests. Existing counters and deterministic urgency provide partial attention; no delivered alert/contact-request workflow exists (E2/E3/E4).                                                          | DECIDED_NOT_IMPLEMENTED | SUPPLEMENTAL_PRODUCT_DIRECTION + DERIVED_IMPLEMENTATION | SAT-07, SAT-03 for contact. No selected threshold, email/push channel, recipient, reminder, escalation or SLA.                                                                                  |
| EXP-SAT-HD-09 (HIGH)       | Assistive AI may classify comments, summarize recurring problems and surface attention. No Satisfaction AI service exists; stored shapes and deterministic fields do not supply one (E2/E3).                                                                           | DECIDED_NOT_IMPLEMENTED | SUPPLEMENTAL_PRODUCT_DIRECTION + DERIVED_IMPLEMENTATION | SAT-09. No provider/model/prompt, retrieval, RK use, persistence, confidence, correction, Human-review or retention contract; no autonomous contact, sanction, task, write-back or publication. |
| EXP-SAT-HD-10 (HIGH)       | Recurring-problem analysis and trends by day, service and period. Operational counters and filters exist; that analysis is absent (E2/E3).                                                                                                                             | DECIDED_NOT_IMPLEMENTED | SUPPLEMENTAL_PRODUCT_DIRECTION + DERIVED_IMPLEMENTATION | SAT-08. No KPI, formula, bucket, benchmark, sample minimum, aggregation window, export or multi-establishment analytics approved.                                                               |
| EXP-SAT-HD-11 (HIGH)       | Support a simple improvement action for a relevant/recurring problem and observe its later effect. No action capability or assigned canonical action owner exists (E3/E6).                                                                                             | DECIDED_NOT_IMPLEMENTED | SUPPLEMENTAL_PRODUCT_DIRECTION                          | SAT-10; related SAT-05/07/08/09. No project-management platform, action entity, assignee, lifecycle, task creation, source mutation or causal conclusion.                                       |
| EXP-SAT-HD-12 (HIGH)       | Minimal configuration for questionnaire, contact, alerts, Google and QR. Only the OWNER social-link slice is currently implemented (E3/E5).                                                                                                                            | DECIDED_NOT_IMPLEMENTED | SUPPLEMENTAL_PRODUCT_DIRECTION + EXECUTABLE_SHAPE_ONLY  | SAT-01/02/03/06/07. No survey builder, arbitrary custom fields, conditional engine, settings schema or new role grant.                                                                          |
| EXP-SAT-HD-13 (HIGH)       | Target information architecture: Vue d’ensemble / Retours / Analyse / Actions / Paramètres. Current page has header/counters, inbox/detail and OWNER links; the complete five-part organization is absent (E3/E5).                                                     | DECIDED_NOT_IMPLEMENTED | SUPPLEMENTAL_PRODUCT_DIRECTION + NAVIGATION_LIMITATION  | SAT-02/03/05/07/08/09/10 and settings mappings above. This is page organization, not AI, five routes/modules or an approved tab/navigation contract.                                            |
| EXP-SAT-HD-14 (HIGH)       | V1 excludes complex surveys, advanced NPS, SMS/email satisfaction campaigns, multi-restaurant benchmarking, elaborate conditional questionnaires and employee scoring. No canonical requirement contradicts those exclusions (E3/E5/E6).                               | CONFIRMED               | SUPPLEMENTAL_PRODUCT_DIRECTION                          | SAT-02/03/07/08/09 boundaries. Exclusion is neither a permanent rejection nor a roadmap/release commitment.                                                                                     |

#### Contact conflict and executable evidence limits

HD-04 is a Product-versus-current-UI conflict, not a dispute between competing
Human decisions. Empty contact defaults permit an anonymous submission, but
the general comment step still requests optional first name and email without
a separate request for follow-up. The checkbox permits contact if necessary;
it does not express that separate request. The contract requires consent when
email or phone is supplied, while a name alone does not trigger that condition.
No repair or exact contact workflow is approved here; SAT-03 stays unresolved.
This adds one recorded Product/UI conflict to the two unchanged security
conflicts; it does not assert legal noncompliance.

The contract also accepts phone, order reference, visit date and service period,
which have no current rendered input. `sourceTag` is different: the form reads
an allowlisted browser `?source=` value and persists it; this is untrusted
collection metadata, not verified source attribution or tenant authority.
There is no zone or distinct contact-request field. Creation time is not proof
of visit time. Current `findFeedbackDetail` reads feedback items, replies and
notes without joining direct-detail contact/consent/selected-topic/visit data;
schema storage does not prove those values are displayed to the operator.

Rating/topic-derived sentiment, urgency and initial status are deterministic
implementation rules. They do not select Product alert thresholds or analytics
formulas. The current detail loader returns `analysis: null` and empty incidents.
Contract/read-model shapes for summary, suggestions or confidence prove no AI
generation.
Notification settings fields without an operating consumer prove no delivery.

### Long-term direction, proposals, questions and history

EXP-SAT-PROP-01 through EXP-SAT-PROP-04 retain source status
`PROPOSED_NOT_APPROVED`; `PROPOSED` below is their primary reconciliation
disposition. All eight EXP-SAT-UQ records remain `UNRESOLVED`.

| Source record   | Preserved payload and current evidence                                                                                                                                                                               | Primary / secondary classification                                                         | Open SAT mapping and prohibited inference                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| EXP-SAT-LTD-01  | Complex surveys, advanced NPS, satisfaction campaigns, benchmarking and conditional questionnaires may be future directions. Source confidence MEDIUM; current bounded implementation does not deliver them (E1/E3). | CONFIRMED as future-only provenance / SUPPLEMENTAL_PRODUCT_DIRECTION + EVIDENCE_LIMITATION | SAT-02/03/07/08. No current requirement, roadmap, priority, date, commitment or implementation authorization; no extra packet.         |
| EXP-SAT-PROP-01 | Illustrative reasons: food quality, waiting time, welcome/service, cleanliness, value for money, ordering/payment, other. Current UI/transport lists differ (E1/E2).                                                 | PROPOSED / EXECUTABLE_SHAPE_ONLY                                                           | SAT-02. Exact list remains unapproved; quick reasons are approved only at capability level. No topic enum or cloud payment capability. |
| EXP-SAT-PROP-02 | Ask a preferred contact channel when the customer requests follow-up; no implemented request-first journey (E1/E2).                                                                                                  | PROPOSED / SUPPLEMENTAL_PRODUCT_DIRECTION                                                  | SAT-03. No channel, exact fields, recipient or workflow approved.                                                                      |
| EXP-SAT-PROP-03 | Dashboard proportions for satisfied/mixed/dissatisfied feedback and trend visualization; current counters are narrower (E2/E3).                                                                                      | PROPOSED / DERIVED_IMPLEMENTATION                                                          | SAT-08. No selected bucket, threshold, formula or KPI contract.                                                                        |
| EXP-SAT-PROP-04 | Explicitly separate any future marketing consent from feedback follow-up consent. No marketing flow exists in current Satisfaction evidence (E1/E2).                                                                 | PROPOSED / EVIDENCE_LIMITATION                                                             | SAT-03/04. Privacy design proposal requiring qualified review, not current legal advice or marketing authorization.                    |
| EXP-SAT-UQ-01   | Exact quick-reason taxonomy; visible list and transport enum are implementation evidence (E1/E2).                                                                                                                    | UNRESOLVED / EXECUTABLE_SHAPE_ONLY                                                         | SAT-02; Human Product and contract review, no taxonomy selected.                                                                       |
| EXP-SAT-UQ-02   | Exact allowed/required/optional follow-up contact fields; contract capacity does not settle purpose (E1/E2).                                                                                                         | UNRESOLVED / EXECUTABLE_SHAPE_ONLY                                                         | SAT-03, related SAT-04; Product/privacy/legal review, no contact-field contract.                                                       |
| EXP-SAT-UQ-03   | Exact low-rating attention/alert threshold; current deterministic rules are not Product approval (E2).                                                                                                               | UNRESOLVED / DERIVED_IMPLEMENTATION                                                        | SAT-07; Human Product, no threshold chosen.                                                                                            |
| EXP-SAT-UQ-04   | Alert channels and recipients; role grants/settings fields do not authorize delivery (E2/E3).                                                                                                                        | UNRESOLVED / SCHEMA_ONLY                                                                   | SAT-07; authorization/privacy/operations review, no channel or recipient contract.                                                     |
| EXP-SAT-UQ-05   | Trusted date/service/zone source and retained attribution; browser tag cannot establish it (E1/E2/E4).                                                                                                               | UNRESOLVED / EXECUTABLE_SHAPE_ONLY                                                         | SAT-01; security/tenancy review, no trusted-context contract or POS linkage.                                                           |
| EXP-SAT-UQ-06   | Analytics formulas, windows and minimum sample sizes; operational counters are insufficient (E2/E3).                                                                                                                 | UNRESOLVED / DERIVED_IMPLEMENTATION                                                        | SAT-08; Product/privacy/tenancy review, no analytic policy selected.                                                                   |
| EXP-SAT-UQ-07   | Improvement-action owner, lifecycle, effect observation and possible Today/Tâches relationship; no existing packet owns the action question (E6).                                                                    | UNRESOLVED / SUPPLEMENTAL_PRODUCT_DIRECTION                                                | SAT-10; adjacent-owner review if a relationship is proposed, no action entity/integration/write-back.                                  |
| EXP-SAT-UQ-08   | AI model/provider, persistence, confidence, Human review and derived-label behavior; no AI service exists (E2/E3/E7).                                                                                                | UNRESOLVED / EXECUTABLE_SHAPE_ONLY + EVIDENCE_LIMITATION                                   | SAT-09; AI/privacy/security review, no provider or autonomy selected.                                                                  |
| EXP-SAT-HIST-01 | Historical Satisfaction client -> Expérience client rename; current Human mapping and menu restore/retain Satisfaction client (E3).                                                                                  | OBSOLETE / Historical provenance                                                           | No SAT packet. Preserve chronology, not a current menu change or competing owner.                                                      |
| EXP-SAT-HIST-02 | Initial generic hotline/direction, name, phone and email idea was narrowed to anonymous default and details only on explicit follow-up request. Current ungated fields do not revive it (E1/E2).                     | OBSOLETE / Historical provenance                                                           | SAT-03. Never evidence that name, phone and email must all be required.                                                                |
| EXP-SAT-OUT-01  | Public-review management, reputation and replies belong to Avis (sections 1–12).                                                                                                                                     | OUT_OF_SCOPE / ALREADY_CANONICAL                                                           | No Satisfaction packet; AVIS-01–09 unchanged. No authority transfer from shared storage/UI.                                            |
| EXP-SAT-OUT-02  | Google provider synchronization/import/replies/connectors/automatic publication beyond a neutral CTA remain outside this scope (E5 and Avis home).                                                                   | OUT_OF_SCOPE / ALREADY_CANONICAL                                                           | SAT-06 boundary only; Avis/provider authority retained, no provider qualification.                                                     |
| EXP-SAT-OUT-03  | Generic CRM/marketing automation and campaigns are outside Satisfaction; no customer-master ownership is established (E1/E6).                                                                                        | OUT_OF_SCOPE / EVIDENCE_LIMITATION                                                         | SAT-03/07 boundaries; future owner/authorization separate, no marketing reuse or profiling.                                            |
| EXP-SAT-OUT-04  | Restaurant Knowledge Expérience client is separate descriptive establishment knowledge (E6), not feedback, complaint, rating, analytics, AI output or improvement actions.                                           | OUT_OF_SCOPE / ALREADY_CANONICAL                                                           | SAT-09 boundary only; no RK migration, consumption contract or automatic write-back.                                                   |

No proposal payload is promoted by resemblance to executable code. Privacy,
retention, contact purpose, free text, AI processing, recipients and source
trust remain subject to the applicable SAT review; historical/naming items
create no legal rule and excluded scopes receive no new authority.

### SAT packet preservation and the bounded action question

SAT-01 through SAT-09 above retain their exact wording, order and unresolved
status. Their reference to undecided behavior concerns exact executable policy:
HD-08/09/10 now establishes bounded attention, assistive AI and analysis intent,
without resolving notification, AI/RK or analytics contracts. The original
Satisfaction acceptance/counts remain historical baseline evidence.

**SAT-10 — UNRESOLVED:** Who owns simple improvement actions, what lifecycle
and effect-observation semantics apply, and what separately approved
relationship, if any, exists with Today or Tâches du jour?

This single added packet is necessary because HD-11 preserves approved
high-level intent, while UQ-07 cannot be represented faithfully by SAT-05
(feedback status), SAT-07 (notifications), SAT-08 (analytics) or SAT-09 (AI).
No current canonical packet assigns the improvement-action owner or lifecycle;
the adjacent Today/Tâches homes do not supply that missing contract. Those four
packets are related cross-references, not substitutes. Required review is Human
Product, operations, authorization/data owners and any affected adjacent owner.
No entity, task integration, schema, operation, assignee, state machine,
write-back or automatic causal interpretation is approved. No packet after
SAT-10 is created and no packet is resolved.

### Ten derived capabilities

These are views over the primary records, not ten additional claims. All
remain under Reputation/Satisfaction semantics, public `feedback-web` and
authenticated Backoffice as applicable, cloud organization + establishment
scope, and the authorization/privacy/readiness limits below. The broader
direction does not grant roles beyond current executable operations.

| Capability                           | Supplemental / canonical Product state                                  | Current implementation and shape                                                          | Actors and remaining authority                                                                            | SAT mapping             |
| ------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| Direct feedback capture              | HD-03 confirmed bounded current direction; existing collection approved | Rating/topics/comment persist; exact contract and visible fields differ                   | Customer submits; restaurant reads privately; taxonomy/validation/privacy still reviewed                  | 02/04                   |
| Customer contact request             | HD-04 approved request-first direction; open Product/UI conflict        | Optional name/email and consent exist, separate request and conditional collection absent | Customer choice; follow-up actor/channel not approved; purpose, retention and fields open                 | 03/04                   |
| Neutral external review solicitation | HD-05 agrees with approved normative links                              | Safe configured success destinations; no provider effect                                  | Customer chooses outbound link; OWNER configures current slice; exact future wording/use needs review     | 06                      |
| QR / feedback entry                  | HD-06 high-level direction; ADR-004 accepts entry                       | Routes exist; managed QR and trusted context incomplete; browser tag is metadata          | Customer/operator; distribution, source trust and release decisions open                                  | 01                      |
| Feedback inbox                       | HD-07 agrees with private processing                                    | Direct-only list/detail/counters/status/assignment/notes; conceptual labels are not enums | Current read/manage/note grants below; complete service lifecycle open                                    | 05/04                   |
| Negative/contact attention           | HD-08 approved high-level direction                                     | Derived urgency/counters only; no contact-request alert/delivery contract                 | Recipient unresolved; threshold/channel/escalation/privacy open                                           | 07/03                   |
| AI feedback analysis                 | HD-09 approved assistive direction                                      | No AI runtime; deterministic fields and analysis shape only                               | Assistive system and Human user; model, review, confidence, persistence/data handling open                | 09                      |
| Satisfaction analytics               | HD-10 approved high-level direction                                     | Counters exist; recurring-problem/day/service/period analysis absent                      | Restaurant user; formula, aggregation, sample, exports and tenancy open                                   | 08                      |
| Improvement actions                  | HD-11 approved high-level direction                                     | No action entity, operation or integration                                                | Restaurant user at shaping level; canonical action owner, role, lifecycle and effect semantics unresolved | 10; related 05/07/08/09 |
| Satisfaction configuration           | HD-12 approved minimal direction                                        | OWNER links implemented; questionnaire/contact/alert/QR configuration incomplete          | Current OWNER link grant only; exact settings, scope and roles open                                       | 01/02/03/06/07          |

### Twelve derived concepts

These are conceptual distinctions, not twelve entities or new persistence
requirements. Retention is unresolved for every concept (SAT-04); no cross-scope
write-back is authorized. Consumers below express bounded intent where their
workflow is absent, not existing access grants or processing authorization.

| Concept                      | Product meaning / current shape                                                     | Privacy, source and mutation boundary                                                            | Consumers and unresolved mapping                                             |
| ---------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Feedback submission          | Human-decided private raw submission; existing DIRECT item + detail                 | Customer submits through trusted public server context; no CRM/public conversion                 | Private inbox current; analytics/AI direction only; SAT-01/02/04/05/09       |
| Direct rating                | Private raw required 1–5 value, currently persisted                                 | Customer supplies; not public/provider rating or review gate                                     | Inbox/current derivation; future analytics/attention; SAT-02/07/08           |
| Feedback topic               | Quick reason approved conceptually; user-selected raw data persists                 | Exact taxonomy open; separate from an AI label; no approved employee score                       | Detail storage is not inbox exposure; analytics/AI future; SAT-02/09         |
| Free-text comment            | Optional private raw text, currently persisted/displayed                            | Customer supplies; free-text privacy, moderation and retention unresolved                        | Human reader current, AI classification/summary future; SAT-02/04/09         |
| Contact request              | Explicit raw customer choice approved at high level; no distinct field/workflow     | Separate from consent and identity; no CRM or marketing write-back                               | Authorized follow-up actor/channel/SLA unresolved; SAT-03/07                 |
| Contact details              | Conditional private data direction; current name/email visible, phone contract-only | Customer supplies; exact fields, purpose, rights/export/deletion open; no AI contact payload     | Follow-up actor unresolved; storage does not prove detail display; SAT-03/04 |
| Visit context                | Reliable attached/derived date/time/service/zone intent                             | Trusted source/mutation authority open; browser tag and createdAt do not establish visit context | Inbox/analytics/AI potential use only; SAT-01/08/09                          |
| Processing status            | Internal operational state; current enum/mutations broader than three labels        | Current manager operation grants do not settle Product transition meaning                        | Inbox; no cross-module lifecycle effects; SAT-05                             |
| Attention/alert signal       | Internal derived attention; current deterministic urgency/counters                  | Recipient and trigger policies unresolved; counter is not notification                           | Restaurant visibility current; delivery/reminder/escalation absent; SAT-07   |
| AI classification            | Internal derived assistive concept; shape does not prove generation                 | Provider, confidence, correction, Human review/persistence open                                  | Human/analytics presentation direction; SAT-09                               |
| AI recurring-problem summary | Internal assistive derived summary; runtime absent                                  | Validation, minimization, retention and persistence open                                         | Restaurant user direction only; no RK write-back; SAT-09                     |
| Improvement action           | Simple Human operational action direction; canonical owner/model absent             | Internal; role/lifecycle/effect observation unresolved, no automatic task/projection             | Restaurant user direction only; SAT-10                                       |

### Authorization, adjacent scopes and readiness

Current executable reads require a database-backed session, active membership,
`reputation.enabled` and `reputation.read`; OWNER/MANAGER/STAFF read, with STAFF
restricted to assigned items. OWNER/MANAGER manage feedback status/assignment;
notes use the current note grant; real changes audit. Only OWNER manages current
social links. Those grants do not decide future follow-up, alerts, AI or action
roles. Organization and active establishment remain server-derived on reads and
writes; no resource-ID-only or browser-asserted scope is approved.

The two original trusted-boundary conflicts remain unresolved: the domain
adapter does not enforce `verifiedAt`, and absence of a client address skips
production salt validation and per-client hash limiting. Trusted production IP
provenance remains unevidenced. The existing hardening change remains at Gate 2b
`AWAITING_HUMAN_REVIEW`, design `BLOCKED_BEFORE_APPLY`, with no Tasks/Apply
authorization. This consolidation neither repairs nor waives either conflict.

Today already has a bounded read-only Reputation attention projection which
can include direct feedback. It owns no source records/lifecycles/mutations.
This delta adds no Today item/projection and no Tâches du jour task generation,
assignment or write-back. Future daily task records belong to the separately
bounded Tâches scope; that does not assign Satisfaction improvement actions.
Attention does not create a Notifications delivery/reminder/escalation contract.

Avis/provider scope and AVIS-01–09 remain unchanged. Restaurant Knowledge
Expérience client remains descriptive establishment knowledge; neither an
RK-to-Satisfaction AI consumer nor feedback-to-RK enrichment is approved.
Contact choice does not create customer-master records, CRM profiling,
newsletters, marketing campaigns, cross-establishment identity, public
attribution, testimonials or provider publication. Reservations, Content,
Visual, Establishment, Personnel, POS, Display and all other owners/authority
remain unchanged.

No external research, current legal/privacy/security conclusion or provider
qualification was performed. Purpose, lawful basis, consent language,
retention/erasure/export, free-text and AI handling, recipients and operating
follow-up require the applicable Product and qualified privacy/security/legal
review. The OpenAI eligibility dossier is inquiry evidence only, not account,
model, API, spend or production processing authority. Environment remains
`UNVERIFIED`; Satisfaction readiness and external/release dependency remain
`BLOCKED`; global cloud, Backoffice and public-feedback gates remain `NOT_READY`.
Repository code, prior local QA and this documentation do not prove deployment
or authorize production.

### Evidence and discovery map

- **E1 — Public journey:**
  [`feedback-form.tsx`](../../../apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx)
  (topic choices, browser source tag, contact fields/consent, safe success links),
  [`submission route`](../../../apps/feedback-web/src/app/api/public/feedback/[tenantSlug]/route.ts)
  and public page/tenant resolution in `apps/feedback-web/src`.
- **E2 — Shape/persistence:**
  [`Reputation contracts`](../../../packages/contracts/src/reputation/index.ts),
  [`schema`](../../../packages/db-cloud/src/schema/reputation.ts),
  [`repository`](../../../packages/db-cloud/src/reputation-repository.ts).
  Existing evidence includes [`contract tests`](../../../packages/contracts/test/contracts.test.ts),
  [`shared repository tests`](../../../packages/db-cloud/test/reputation-repository.integration.test.ts),
  Backoffice action/component tests and
  [dated local CTA QA](../../reviews/reputation-review-social-links-configuration/qa/QA_REPORT.md).
  Shared repository denial tests use a GOOGLE/PUBLIC_REVIEW fixture; the local
  CTA run used synthetic submissions without contact data. Neither proves
  conditional contact, supplemental workflows or production. No focused test
  or Browser QA was rerun here; schema acceptance is not Product approval.
- **E3 — Restaurant UI/auth:**
  [`Satisfaction route`](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx>),
  [`shared direct loader`](<../../../apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-loader.tsx>),
  shared inbox/actions/components and `apps/backoffice/src/server/reputation`,
  [`navigation`](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts),
  [Authentication](../../architecture/AUTHENTICATION.md).
- **E4 — Security conflict:**
  [`tenant adapter`](../../../packages/db-cloud/src/tenant-adapters.ts), E1 route,
  [Gate 2b packet](../../reviews/feedback-public-trusted-boundary-hardening/02b-design-review.md)
  and [unfinished design](../../../openspec/changes/feedback-public-trusted-boundary-hardening/design.md).
  These planning artifacts are not synced or implemented authority.
- **E5 — Normative/UI scope:**
  [ADR-004](../../decisions/ADR-004-independent-public-feedback-application.md),
  [social-link spec](../../../openspec/specs/reputation/review-social-links-configuration/spec.md),
  [existing Satisfaction page pack](../../ui/pages/backoffice-visibilite-reputation-satisfaction/README.md).
  Its as-built inbox/social-link scope does not deliver the five-part future
  organization or supplement-specific capabilities.
- **E6 — Adjacent ownership:**
  [Today](../today/README.md), [Tâches du jour](../daily-tasks/README.md),
  [Restaurant Knowledge home](../establishment/general-information/README.md),
  [descriptive customer-experience spec](../../../openspec/specs/restaurant-knowledge/customer-experience/spec.md)
  and [Reputation backlog](STATUS.md). Backlog incident/action wording does not
  approve an improvement-action owner.
- **E7 — Readiness:** [Current State](../../CURRENT_STATE.md),
  [Production Readiness](../../operations/PRODUCTION_READINESS.md),
  [Deployment](../../operations/DEPLOYMENT.md),
  [OpenAI eligibility](../../operations/OPENAI_PROVIDER_ELIGIBILITY.md).

Repository-only discovery starts at `docs/README.md` -> Authority Model ->
Product Knowledge -> Module Registry -> this existing home -> this supplemental
section -> unchanged SAT-01–09 and unresolved SAT-10 -> E1–E7. The
Human-accepted delta sufficiency assessment recovered all 33 classified records,
fourteen HIGH confidences,
the future-only MEDIUM direction, four unapproved proposal payloads, eight
mapped questions, naming/contact history, four exclusions, ten capabilities,
twelve concepts, three open conflicts, exact hardening gate and all ownership,
privacy, implementation and readiness non-inferences without external history.
The separate exception record above preserves the strict execution limitation;
formal delta fresh-agent PASS remains NO and no further rerun is required.

Supplemental primary counts (33 records): `CONFIRMED: 3`, `IMPLEMENTED: 3`,
`DECIDED_NOT_IMPLEMENTED: 7`, `PROPOSED: 4`, `UNRESOLVED: 8`, `CONFLICT: 1`,
`OBSOLETE: 3`, `OUT_OF_SCOPE: 4`. The source has zero implementation, duplicate
or possible-conflict records; repository findings are separate. The ten
capabilities and twelve concepts are not counted again. No original migration
is repeated and no SAT packet is resolved.
