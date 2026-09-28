# Avis & commentaires

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-09-28

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

Google belongs to the current implementation footprint, but its inclusion in a
current Product V1 remains `UNRESOLVED`. Existing code, persisted Google rows,
OAuth/location support, UI labels, schemas, backlog language, and historical
implementation work do not establish a Human-approved Google V1 decision.

Public direct-feedback collection is separately approved by
[ADR-004](../../decisions/ADR-004-independent-public-feedback-application.md)
and implemented in `apps/feedback-web`.

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
| AVIS-01 | Is Google part of the current Product V1?                                                                               | Google implementation exists, but no explicit Human-approved current V1 decision was found; legacy evidence explicitly corrects the earlier broad classification.             | Google import, inbox positioning, draft, publish and roadmap. Do not infer approval from code, schema, UI, backlog, or archived work.                                              | Human Product decision through Control Tower.                                                         |
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
- Control Tower owns shaping, genuine conflict resolution, Human Decision
  routing, cross-module reasoning, and governance coordination; and
- Coding Agents use repository discovery for analysis and perform only
  separately authorized execution and verification.

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
| Customer follow-up    | Contact data and consent can be stored, but no customer-response channel, message delivery, case conversation, or approved follow-up workflow is implemented.                                                                                                                                           |
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

| Capability or data           | Product state                                                                                           | Implementation state                                                                                                                   | Validation and visibility                                         | Owner and scope                                               | Exclusions / unresolved                                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direct public collection     | `APPROVED`                                                                                              | `IMPLEMENTED` with two trusted-boundary conflicts                                                                                      | Public form; shared schema; server-owned tenant context           | Reputation; `apps/feedback-web`; organization + establishment | No production authorization; no broad public-site ownership transfer                                                                                            |
| Rating                       | Current public collection uses required integer `1..5`                                                  | Persisted on the feedback item                                                                                                         | Zod validation; private inbox visibility                          | Reputation; organization + establishment                      | Does not authorize rating-based routing or public solicitation gates                                                                                            |
| Topics and comment           | Optional current form data                                                                              | Topics persist on direct detail; comment persists as feedback content                                                                  | Bounded enum and length validation                                | Reputation; organization + establishment                      | No AI processing approval and no public display                                                                                                                 |
| Identity and contact         | Optional first name and email are exposed; contact requires consent                                     | Contract/schema also support phone; persistence stores supplied contact and consent timestamp                                          | Private restaurant access only; contact values are not sent to AI | Reputation; organization + establishment                      | Exact follow-up purpose, lawful basis, retention, rights handling, phone exposure, and marketing use are unresolved                                             |
| Visit/order/source context   | No complete current Product requirement                                                                 | Contract/schema can hold order reference, visit date, service period, and source tag; current public form does not expose them         | Contract validation only when supplied                            | Reputation; organization + establishment                      | Schema capacity must not be promoted to approved collection                                                                                                     |
| Derived operational fields   | No AI generation is approved                                                                            | Repository derives sentiment, urgency, and initial status deterministically from rating/topics; UI can display persisted values        | Server-side implementation                                        | Reputation; organization + establishment                      | Formulas are implementation evidence, not an approved analytics or AI product                                                                                   |
| Abuse controls               | Fail-closed production protection is required                                                           | Honeypot and per-hash window exist; raw IP is not persisted; missing trusted client identity can currently bypass the per-client limit | Public generic error boundary                                     | `apps/feedback-web`; salted hash in `packages/db-cloud`       | Trusted client-IP provenance, atomicity, idempotency, duplicates, body limits, monitoring, and incident policy are unresolved or outside current implementation |
| Inbox operations             | Direct-only private processing is in current scope                                                      | List/detail, counters, filters, status, assignment, and notes are implemented                                                          | Authenticated Backoffice only                                     | Reputation; trusted organization + active establishment       | No customer reply delivery and no external provider publication                                                                                                 |
| Social/review links          | Three optional safe destinations are approved                                                           | OWNER settings and public safe projection are implemented                                                                              | Provider-purpose URL validation; public CTA only                  | Reputation settings; organization + establishment             | No connector, click tracking, score gate, publication confirmation, or provider ownership inference                                                             |
| Notifications, analytics, AI | No current approval beyond operational counters and the separate provider-independent Avis AI direction | No Satisfaction notification, advanced analytics, or AI workflow is established                                                        | Not applicable                                                    | Undecided                                                     | Requires separate Product, privacy, security, and data-owner decisions                                                                                          |

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

### Reconciliation disposition

Material legacy claims were assigned one primary disposition:

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
