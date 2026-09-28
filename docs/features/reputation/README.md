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

The five-step mobile flow collects a required 1–5 rating plus optional topics,
comment, and contact information. Contact data requires consent. The raw IP is
not stored; a salted hash supports a five-submissions-per-15-minute database
rate limit. A honeypot provides basic bot protection. Production fails closed
without `PUBLIC_FEEDBACK_IP_HASH_SALT`.

Production requests resolve the establishment from a verified hostname and
cross-check the configured public slug. Localhost slug lookup is development
only. Customer email and phone are not sent to an AI provider.

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
