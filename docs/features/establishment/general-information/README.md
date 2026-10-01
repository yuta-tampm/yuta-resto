# Informations generales Page Product Knowledge

Visibility: Engineering

Owner: YUTA product and engineering

Approved: 2026-08-30

Route: `/etablissement/informations-generales`

Application: `apps/backoffice`

## 1. Purpose

`Informations generales` is a composed page in the Establishment product and
navigation domain. It brings together bounded capabilities without making the
page a single data owner:

```text
Informations generales
|- Establishment Profile
`- Restaurant Knowledge
```

The Establishment Profile is the existing approved and implemented capability.
Restaurant Knowledge is approved Product Intent. Its bounded `Concept &
histoire`, `Cuisine & savoir-faire`, `Expérience client`, `Équipe & culture`
and `Identité de communication` descriptive slices and its `Connaissances
validées` item collection are implemented in the repository; the other
knowledge families remain unimplemented.

This page-level Product Knowledge home does not replace the canonical
[Establishment Product Knowledge home](../README.md). It must be read with
[ADR-006](../../../decisions/ADR-006-cloud-establishment-profile-context.md),
[ADR-007](../../../decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md),
the Module Registry, relevant security/runtime authorities, and current
implementation evidence for Implemented State questions.

## 2. Composed-page responsibility

A route or page can present several capabilities while each capability retains
its own Product Intent, data boundary, permissions, implementation evidence,
and lifecycle.

Page composition therefore does not:

- transfer Restaurant Knowledge into the current `establishments` profile row;
- make Establishment Profile permissions authorize Restaurant Knowledge;
- copy data from another module into either capability; or
- prove that an approved capability is implemented or enabled.

## 3. Establishment Profile

### Current approved boundary

The existing profile boundary and ownership remain unchanged. It covers:

- name and description;
- structured address;
- primary phone, email, and website;
- separately modeled public contacts;
- supported logo and cover HTTP(S) URL references;
- languages;
- supported service modes; and
- supported visibility settings.

Slug, active status, locale, and timezone remain Establishment-owned context
but are not currently edited on this page. Completion and the in-page preview
are derived presentation state, not persisted profile records.

### Current ownership and permissions

- Runtime owner: `apps/backoffice` for the authenticated editor.
- Data owner: `packages/db-cloud`, with the bounded profile stored in
  `establishments`.
- Trusted scope: active organization, establishment, membership, role,
  permissions, entitlements, locale, and timezone are derived on the server.
- Read: `OWNER`, `MANAGER`, and `STAFF` through
  `establishment.profile.read`.
- Manage: `OWNER` and `MANAGER` through
  `establishment.profile.manage`; `STAFF` is read-only.

ADR-006 and the current Establishment home remain authoritative. This Product
Decision integration does not change any Establishment Profile lifecycle
dimension.

## 4. Restaurant Knowledge

### Approved Product Intent

Restaurant Knowledge is a separate bounded capability in the Establishment
domain at product and navigation level. Its initial approved knowledge families
are:

- Concept & histoire;
- Cuisine & savoir-faire;
- Experience client;
- Equipe & culture;
- Identite de communication; and
- validated restaurant knowledge.

Restaurant Knowledge may be enriched gradually over time. A restaurant
operator may add knowledge directly. Content suggested by a system or AI must
not become validated restaurant knowledge automatically; human validation is
required before promotion to validated knowledge.

### Required separate boundary

Restaurant Knowledge must have its own:

- canonical data owner and persistence/domain boundary;
- operation-level permissions independent from Establishment Profile;
- approved initial data shape and behavior scope; and
- lifecycle and evidence independent from the Establishment Profile.

The initial permission boundary is resolved through distinct
`restaurant-knowledge.read` and `restaurant-knowledge.manage` operations. Both
currently grant `OWNER` and `MANAGER`; `STAFF` is denied by default. Restaurant
Knowledge owns their semantic meaning, while Identity / Access owns their
representation, grant mapping, and enforcement integration. They do not
inherit Establishment Profile permissions, and `YUTA_ADMIN` or `YUTA_SUPPORT`
does not bypass active tenant membership or these grants.

Restaurant Knowledge is the canonical owner of `Concept` and `Histoire` and of
their persistence/domain boundary. Establishment Profile owns neither datum.
This knowledge is semantically scoped to an establishment; Organization is the
tenancy/access envelope rather than the semantic owner. Page placement does
not change these decisions, and Restaurant Knowledge does not inherit the
profile repository or schema.

Restaurant Knowledge is also the canonical owner of `Description de la
cuisine`, `Savoir-faire & particularités` and `Fait maison`, together with
their persistence/domain boundary. These values have the same establishment
semantic scope and Organization tenancy/access envelope, but form a separate
slice with its own whole-slice save lifecycle.

Restaurant Knowledge is also the canonical owner of `Expérience souhaitée`,
`Accueil & service` and `Attention particulière au client`, together with
their persistence/domain boundary. These establishment-level descriptive
values form a third independent slice; they are not operational/customer data
and establish no dependency or consumer relationship with another module.

Restaurant Knowledge is also the canonical owner of `Valeurs & état d’esprit`,
`Façon de travailler ensemble` and `Transmission & intégration`, together with
their persistence/domain boundary. These establishment-level descriptive
values form a fourth independent slice and create no employee-specific state,
training/onboarding status or operational-module/provider relationship.

Restaurant Knowledge is also the canonical owner of `Ton & style de
communication`, `Façon de s’adresser aux clients` and `Éléments de langage &
choses à éviter`, together with their persistence/domain boundary. These
establishment-level descriptive values form a fifth independent slice and
create no Profile, Marketing/Content, Reviews/Reputation, AI, Social/public,
provider, CRM/customer, legal/compliance/moderation or cross-runtime
relationship.

Restaurant Knowledge is also the canonical owner of current validated
knowledge items manually accepted by authorized restaurant humans, together
with their persistence/domain boundary. These independently understandable
statements form an establishment-scoped collection and create no canonical
ownership, provenance/history, automation, publishing, consumer, module,
runtime or provider relationship outside Restaurant Knowledge.

### Approved initial Concept & histoire behavior

- view Concept;
- manually input and edit Concept;
- view Histoire;
- manually input and edit Histoire; and
- explicitly save the complete `Concept & histoire` slice once.

Concept and Histoire are independent and optional. An empty initial state is
valid, and the initial behavior does not autosave. The implementation uses a
dedicated `restaurant_knowledge_concept_history` cloud table and Restaurant
Knowledge repository, scoped by trusted organization and establishment
context. It uses a page-local server action rather than a shared transport
contract or API route, and adds no Product content-validation limits.

### Approved initial Cuisine & savoir-faire behavior

- view and manually edit `Description de la cuisine`;
- view and manually edit `Savoir-faire & particularités`;
- view and manually edit `Fait maison`; and
- explicitly save the complete `Cuisine & savoir-faire` slice once.

The three descriptive values are independent and optional. Their all-empty
state is valid and changes remain browser-local until the explicit save. The
implementation uses a dedicated
`restaurant_knowledge_cuisine_know_how` cloud table and whole-slice Restaurant
Knowledge repository operations under trusted organization and establishment
scope. It adds no Product validation or taxonomy and does not read, write,
link, copy or synchronize `Carte & menus` or POS operational data.

### Approved initial Expérience client behavior

- view and manually edit `Expérience souhaitée`;
- view and manually edit `Accueil & service`;
- view and manually edit `Attention particulière au client`; and
- explicitly save the complete `Expérience client` slice once.

The three descriptive values are independent and optional. Their all-empty
state is valid and changes remain browser-local until the explicit save. The
implementation uses the dedicated
`restaurant_knowledge_customer_experience` cloud table and whole-slice
Restaurant Knowledge repository operations under trusted organization and
establishment scope. It adds no Product validation, taxonomy, CRM/customer
profile, provider or operational-module relationship.

### Approved initial Équipe & culture behavior

- view and manually edit `Valeurs & état d’esprit`;
- view and manually edit `Façon de travailler ensemble`;
- view and manually edit `Transmission & intégration`; and
- explicitly save the complete `Équipe & culture` slice once.

The three descriptive values are independent and optional. Their all-empty
state is valid and changes remain browser-local until the explicit save. The
implementation uses the dedicated `restaurant_knowledge_team_culture` cloud
table and whole-slice Restaurant Knowledge repository operations under trusted
organization and establishment scope. It adds no Product validation, taxonomy,
employee state, workflow, operational-module or provider relationship.

### Approved initial Identité de communication behavior

- view and manually edit `Ton & style de communication`;
- view and manually edit `Façon de s’adresser aux clients`;
- view and manually edit `Éléments de langage & choses à éviter`; and
- explicitly save the complete `Identité de communication` slice once.

The three descriptive values are independent and optional. Their all-empty
state is valid and changes remain browser-local until the explicit save. The
implementation uses the dedicated
`restaurant_knowledge_communication_identity` cloud table and whole-slice
Restaurant Knowledge repository operations under trusted organization and
establishment scope. It adds no Product validation, taxonomy, customer state,
AI/provider, publishing, moderation/legal, operational-module or cross-runtime
relationship.

### Approved initial Connaissances validées behavior

- list/view zero, one or multiple current validated statements;
- manually create a pending statement and explicitly save that item;
- manually edit an existing item and explicitly save that item; and
- mark one item for removal, undo locally or explicitly save its physical
  removal without replacing the whole list.

Each saved statement must contain at least one non-whitespace character.
Accepted surrounding whitespace is preserved exactly; blank create/edit fails
server-side validation and blank edit never means remove. Pending create,
edit, removal and failed save remain non-canonical, and no interaction
autosaves. The implementation uses the dedicated
`restaurant_knowledge_validated_items` cloud table, item-scoped Restaurant
Knowledge repository operations and server-generated technical identity under
trusted organization and establishment scope. It adds no provenance/history,
semantic duplicate detection, taxonomy, ordering, AI/provider, downstream
consumer, publishing, operational-module or cross-runtime relationship.

### Ownership invariant

```text
One datum -> one canonical owner -> multiple consumers
```

Restaurant Knowledge owns only knowledge explicitly assigned to this
capability. It must not duplicate:

- Booking settings, service periods, exceptions, availability, or
  reservations;
- Personnel employee dossiers or employment facts;
- menu, catalog, price, or restaurant-local POS operational data;
- Reputation reviews, feedback, replies, settings, or connector records; or
- Organization, membership, session, role, permission, or entitlement data.

## 5. Lifecycle

The two capability rows are intentionally independent.

| Capability            | Product Decision | Implementation | Environment   | Production Readiness | External Dependency | Review Marker                                                                                                                                                                                                                                         |
| --------------------- | ---------------- | -------------- | ------------- | -------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Establishment Profile | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED`  | `NOT_READY`          | `NOT_ASSESSED`      | `OK`                                                                                                                                                                                                                                                  |
| Restaurant Knowledge  | `APPROVED`       | `PARTIAL`      | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture, Identité de communication and Connaissances validées capabilities; other knowledge families and every excluded integration remain unimplemented |

Approval of Restaurant Knowledge does not prove implementation, environment
availability, production readiness, or provider selection.

## 6. Explicitly out of initial scope

The following are not approved current behavior:

- company/legal data, including legal name, legal form, SIREN/SIRET, VAT
  number, registered office, legal representative, and administrative legal
  contacts;
- automatic knowledge detection or candidate creation from reviews, comments,
  corrections, replies, or other modules;
- detailed history, provenance, retention, source metadata, or audit behavior;
- Marketing, Facebook, or Instagram consumption;
- ownership of social-profile links;
- AI/provider, prompt, embedding, vector database, storage, job, model, or API
  implementation;
- additional validated-statement fields, requiredness, enums, length or
  formatting limits, or validation rules beyond at least one non-whitespace
  character.

Company/legal ownership across Organization, Establishment, a possible
employer/legal configuration, and Formalites remains `NEEDS REVIEW`.

## 7. Relationships and source-module boundaries

- Booking remains the owner of booking-specific data and behavior.
- Personnel remains the owner of individual employee dossiers and employment
  facts. Approval of `Equipe & culture` does not transfer Personnel data.
- Reputation remains the owner of reviews, feedback, replies, connectors, and
  audit records. No automatic Reputation-to-Knowledge flow is approved.
- Menus/catalog and restaurant-local POS remain separate owners. No cloud/POS
  synchronization is approved.
- Display remains an independent runtime and persistence boundary.
- No Marketing/social-content consumer contract is approved.

A future consumer must read an explicitly approved, minimized projection from
the canonical owner. Consumption does not transfer ownership.

## 8. Roles, security, and runtime boundaries

Current Establishment Profile permissions apply only to that capability.
Restaurant Knowledge READ and MANAGE are separately implemented for `OWNER`
and `MANAGER`, with `STAFF` denied. Additional validate, reject, classify, or
administrative operations remain `NEEDS REVIEW` and require separate Product
decisions.

The current cloud implementation preserves trusted server-derived
organization-and-establishment scope and fails closed. Browser-provided
organization, establishment, membership, role, permission, entitlement, or
tenant values are not authority.

Cloud, restaurant-local POS, and Display persistence remain separate under
ADR-003. Restaurant Knowledge owns the Concept/Histoire, Cuisine/savoir-faire,
Expérience client, Équipe & culture, Identité de communication and validated-
item persistence/domain boundaries in `packages/db-cloud`; their dedicated
tables and repository operations are not part of Establishment Profile. No API,
provider, shared contract, local-runtime adapter, history/provenance model,
operational-module relationship or cross-runtime synchronization exists for
these capabilities.

## 9. OpenSpec readiness

### Canonical analysis context

An OpenSpec analysis for a change on this page must read, in order:

1. the [Establishment Product Knowledge home](../README.md);
2. this page-level Product Knowledge home;
3. the relevant Module Registry row;
4. ADR-006, ADR-007, and other applicable accepted decisions; and
5. current implementation evidence when the question concerns Implemented
   State.

### Restaurant Knowledge readiness

The approved Product decisions resolve the bounded Concept & histoire, Cuisine
& savoir-faire, Expérience client, Équipe & culture and Identité de
communication descriptive-slice behavior and the item-scoped Connaissances
validées list/create/edit/remove behavior. The separate authorization
capability resolves the initial READ/MANAGE permission mapping.

The bounded implementation selects dedicated cloud tables, repository
operations and page-local server actions without changing canonical ownership,
tenant scope or approved behavior. Validated statements add only the approved
non-whitespace rule while preserving accepted text exactly. Shared/API
transport, expanded validation, history/provenance, providers and other
knowledge families remain outside these capabilities.

### Pilot recommendation

The bounded Concept & histoire, Cuisine & savoir-faire, Expérience client,
Équipe & culture and Identité de communication descriptive slices and the
Connaissances validées item collection are implemented as Restaurant Knowledge,
not as enhancements of Establishment Profile. Repository implementation does
not prove environment enablement or production readiness. This documentation
does not authorize any excluded knowledge family, consumer or integration.

## 10. Source map

| Question                                         | Read this source                                                                                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What makes the page composed?                    | ADR-007 and this page home.                                                                                                                                                   |
| What owns the existing profile?                  | ADR-006 and the Establishment Product Knowledge home.                                                                                                                         |
| What lifecycle values apply?                     | `docs/MODULE_REGISTRY.md` and `docs/LIFECYCLE_STATUS_MODEL.md`.                                                                                                               |
| How is trusted cloud scope enforced?             | `docs/architecture/TENANCY.md` and Identity / Access Product Knowledge.                                                                                                       |
| What does the current profile UI implement?      | `docs/ui/pages/establishment-general-information/README.md` and tracked code/tests.                                                                                           |
| What Restaurant Knowledge behavior is normative? | `openspec/specs/authorization/restaurant-knowledge/` and the six current specifications under `openspec/specs/restaurant-knowledge/`.                                         |
| What Restaurant Knowledge shape is implemented?  | `packages/db-cloud/src/schema/restaurant-knowledge.ts`, `packages/db-cloud/src/restaurant-knowledge-repository.ts`, the route-local loaders/actions/forms, and focused tests. |
| What verification evidence exists?               | Current review packets under `docs/reviews/restaurant-knowledge-*`; historical failures remain provenance and do not override later PASS evidence.                            |
| Is the capability production-ready?              | `docs/MODULE_REGISTRY.md` and `docs/operations/PRODUCTION_READINESS.md`; repository workflow completion does not establish deployment or readiness.                           |
| How are conflicts handled?                       | `docs/AUTHORITY_MODEL.md`.                                                                                                                                                    |
| What was reconciled before approval?             | `docs/INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_REVIEW.md`.                                                                                                           |

## 11. Knowledge migration control

### Reconciliation source and exact scope

The Human-supplied
`ETABLISSEMENT_RESTAURANT_KNOWLEDGE_LEGACY_EXTRACT.md` with SHA-256
`b49222ad7fe2c199437e9c07c597605c616ca7133d29820facc446be3ab79afd`
was used only as legacy evidence for the 2026-09-28 reconciliation. Its claims
were checked against current question-specific repository authority; its prose
and tenant examples were not copied into this home.

The migrated candidate scope is limited to this composed page, the independent
Establishment Profile and Restaurant Knowledge boundaries, Restaurant
Knowledge authorization, the five descriptive slices and `Connaissances
validées`, and the ownership, tenancy, implementation, verification,
lifecycle and readiness evidence required to understand them.

This reconciliation does not migrate or assign Product Truth for Carte &
menus, Reservations, Personnel, Planning, Pointage, Stock, Suppliers, Today,
Reputation, Marketing, Website, POS, Site Agent, Display, YUTA Assistant, AI,
or document ingestion. Those capabilities may appear only as separate owners,
excluded sources, possible future consumers, or unresolved contracts.

### Reconciled cross-dimension model

- **Current Product behavior:** the page composes two owners. Restaurant
  Knowledge owns the five exact descriptive slices and the manual validated
  item collection described above. Shared placement does not merge their data
  or permissions.
- **Current implementation:** the profile and all six Restaurant Knowledge
  capabilities have tracked Backoffice loaders/actions/forms, dedicated cloud
  persistence and focused tests. The broader Restaurant Knowledge capability
  remains `PARTIAL` because no other family or excluded integration is thereby
  implemented.
- **Tenant data:** concrete names, stories, cuisine, addresses, hours, menus,
  social URLs, media and example copy belong to a particular tenant or another
  canonical owner. They do not define generic Product fields.
- **Source and validation:** the five descriptive slices use manual human
  entry, optional values, valid all-empty state, whole-slice explicit save and
  no autosave. Validated items use manual MANAGE-gated acceptance and
  item-scoped explicit save. `Validated` means authorized restaurant-human
  acceptance; it is not factual, external, legal or regulatory certification.
- **Provenance and candidates:** current V1 has no candidate lifecycle, source
  enum, detailed provenance, revision/history, staleness or automatic learning
  model. Non-manual sources cannot gain validated authority without a separate
  Product change and Human review boundary.
- **Visibility and publication:** Restaurant Knowledge is permission-gated on
  the authenticated page. No per-slice or per-item `Public / Interne /
Administratif` field, public projection, publication right or synchronization
  contract is approved. Establishment Profile visibility controls do not apply
  to Restaurant Knowledge.
- **Consumers:** repository search finds only the current Backoffice page as a
  consumer of the Restaurant Knowledge repository. Reputation, Marketing,
  Website, assistants, agents and local runtimes have no approved current read
  projection merely because the knowledge exists.
- **Environment and readiness:** the Registry records Restaurant Knowledge as
  `NOT_ENABLED`, Production Readiness as `NOT_ASSESSED` and External Dependency
  as `NOT_ASSESSED`. The broader Backoffice scope is `NOT_READY`. No production
  deployment or production authorization is established by implementation,
  verification, Browser QA, sync, archive or Knowledge Consolidation.

### Confirmed high-level long-term direction

Current authority confirms two high-level directions without making either a
current requirement:

1. YUTA may progressively enrich its understanding of a restaurant. Any future
   system- or AI-suggested knowledge must remain non-canonical until an
   authorized human explicitly reviews and accepts it.
2. One canonical datum may serve multiple future consumers, including future
   YUTA agents, only through separately approved minimized projections and
   consumer authorization. No current consumer is approved by this direction.

For both: `DISPOSITION: CONFIRMED`,
`DIRECTION_TYPE: HIGH_LEVEL_LONG_TERM`, and `CURRENT_REQUIREMENT: NO`.
Candidate sources, storage, workflows, AI behavior, provider use and consumer
projections remain proposed or unresolved as recorded below.

### Human decisions still required

These eight decision packets remain open. They are not authorization to create
an OpenSpec change or implementation.

| ID      | Decision required                                                                                                                                            | An agent must not infer                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `RK-01` | Which correction, review, document, usage, external or direct-entry sources may create candidate knowledge?                                                  | That any current module may feed Restaurant Knowledge automatically.                        |
| `RK-02` | What candidate states, storage, review, promotion, rejection and failure behavior apply?                                                                     | A candidate queue, automatic promotion or current implementation.                           |
| `RK-03` | What provenance, attribution, revision, retention, deletion, stale-review and restore model applies?                                                         | A source enum, history table, expiry rule or audit UI.                                      |
| `RK-04` | What `Public / Interne / Administratif` classification, public projection and publication rights apply per family or item?                                   | That current knowledge is public, uniformly internal or has a visibility field.             |
| `RK-05` | Which consumer may read which minimized projection, for what purpose and under which authorization?                                                          | Access for Reputation, Marketing, Website, assistants, agents or another module.            |
| `RK-06` | Whether AI is used and, if so, which provider, prompt/retrieval boundary, privacy/security controls and Human review contract apply?                         | Embeddings, vector storage, RAG, inference, document/review ingestion or AI-use permission. |
| `RK-07` | Which additional families, fields, validation, governance operations or permission tiers enter a future scope?                                               | Fields from tenant examples, mockups, future consumers or unapproved categories.            |
| `RK-08` | What evidence and accountable approvals establish environment enablement, consumer readiness, production readiness, deployment and production authorization? | Production status from repository completion, QA, archive or local runtime evidence.        |

### Historical evidence and authority state

Current repository evidence supersedes earlier statements that validated
knowledge was unimplemented, that the page had only five Restaurant Knowledge
slices, that blank-item semantics were unresolved, or that the latest Browser
QA remained environment-blocked. Historical remount and dirty-state defects
remain implementation provenance only; they are not current Product behavior.

No genuine current-authority conflict remains in the reconciled scope. The
apparent conflicts about `validated`, visibility and future consumers resolve
by keeping manual acceptance, publication/visibility and consumer authority as
separate dimensions. The unresolved decisions above remain unresolved.

Repository reconciliation and bounded canonicalization are `COMPLETE` on
2026-09-28.

### Fresh-agent acceptance evidence

The repository-only
`GENERAL_INFORMATION_RESTAURANT_KNOWLEDGE_FRESH_AGENT_ACCEPTANCE_REPORT.md` has
SHA-256
`9e22481b3e400f37d69757aa324601ffa8faccfc148eebe5b814f23dc9daf951`.
The fresh agent used no Page Chat history, legacy extract, reconciliation
report, agent memory, or external research. It reported:

```text
REPOSITORY_MUTATED: NO
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
RECONCILIATION_REPORT_USED: NO
EXTERNAL_RESEARCH_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 0
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The report establishes repository discoverability for the exact migrated scope
defined above. It is acceptance evidence rather than Product authority, is not
copied into this home, and does not add a field, family, visibility rule,
consumer contract, AI behavior, environment state, readiness claim, production
authorization, or resolution of `RK-01` through `RK-08`.

### Authority state after cutover

Repository reconciliation, bounded canonicalization, fresh-agent acceptance,
and the Human-authorized cutover are `COMPLETE` for the exact migrated General
Information / Restaurant Knowledge scope defined above. Under the
[Authority Model](../../../AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition):

- the repository is canonical knowledge for this exact migrated scope;
- the responsible General Information / Restaurant Knowledge Page Chat is
  `LEGACY EVIDENCE ONLY` for this exact scope and remains available for
  historical or forensic lookup;
- Codex owns repository discovery, shaping, cross-module reasoning and
  governance coordination under
  [task collaboration](../../../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review).
  CT advice is optional in `CT_BRIDGE` or `HUMAN_CT_BRIDGE`; unresolved
  Product/authority decisions still require the owning Human.
- Coding Agents execute and verify only the selected task's authorized scope;
  routine gates use the mode-defined review mechanism.

This cutover does not migrate Establishment Profile beyond the composition and
boundary knowledge recorded here, retire another Page Chat, change another
module's authority, close an unresolved decision, or authorize Product work,
public exposure, AI or downstream consumption, environment enablement,
production readiness, deployment, or production use.

## 12. Status

Status: APPROVED
