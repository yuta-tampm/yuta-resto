# Informations generales Page Knowledge Integration Review

Visibility: Engineering

Owner: YUTA product and engineering

Review date: 2026-08-30

## Executive conclusion

`PRODUCT_REVIEW_REQUIRED_BEFORE_INTEGRATION`

The Product-discussion source cannot be integrated as current Product
Knowledge without prior Product review. The current approved page is the
bounded Cloud Establishment profile editor described by ADR-006 and the
Establishment Product Knowledge home. The proposed `Restaurant Knowledge Hub`
would materially expand that boundary with narrative restaurant knowledge,
company/legal information, cross-module consumption, and AI-assisted knowledge
suggestions.

Several source principles align with current YUTA boundaries: one canonical
owner per datum, separate Booking and Personnel ownership, trusted
organization-and-establishment scope, Cloud/POS/Display separation, and human
authorization rather than browser-provided role or scope. Those aligned
principles can be retained as context, but they do not approve the proposed
expansion.

No accepted current source was found that assigns the proposed narrative
knowledge store, company/legal profile, knowledge classification, suggestion
workflow, provenance/history, or downstream marketing consumption to this
page. These subjects require bounded Product Decisions before a canonical page
home or an OpenSpec pilot is created.

## Audit boundary and sources

The task and request name
`docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE_SOURCE.md`. That path
is absent. The only matching repository input is the untracked
`docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md`; its content and
source-boundary section identify it as the Product-discussion document intended
by the task. This review used that file as discussion input only and did not
modify or rename it.

Current authority and evidence consulted:

- `docs/AUTHORITY_MODEL.md`, `docs/LIFECYCLE_STATUS_MODEL.md`,
  `docs/MODULE_REGISTRY.md`, `docs/PRODUCT_KNOWLEDGE.md`, and
  `docs/CURRENT_STATE.md`;
- `docs/decisions/ADR-006-cloud-establishment-profile-context.md` and
  `docs/features/establishment/README.md`;
- the current `docs/ui/pages/establishment-general-information/` page pack;
- Tenancy, Identity / Access, and database-boundary authorities, including
  ADR-003;
- current Booking, Reputation, Personnel, Today, and Public Website Product
  Knowledge where the proposed relationships touch those owners; and
- targeted implementation evidence in the Cloud tenancy schema,
  Establishment profile contract/repository, Backoffice permission mapping,
  and relevant tests.

Code and tests were used only for Implemented State and executable-shape
verification. They were not used to infer Product Decisions.

## Reconciliation matrix

| Source section / claim                                                                                                                                                               | Classification              | Current authority/evidence                                                                                                                                                                                                                                                                            | Recommended treatment                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The page is a central `Restaurant Knowledge Hub`, not only a general profile.                                                                                                        | `NEW_PRODUCT_INTENT`        | ADR-006 and the Establishment home approve a bounded Cloud Establishment profile. The Module Registry records that bounded profile as `APPROVED` and `IMPLEMENTED`.                                                                                                                                   | Do not merge as current. Request a Product Decision defining whether the page expands, composes a separately owned knowledge capability, or links to another page/module.                                        |
| Store concept, history, cuisine, know-how, homemade practices, desired experience, team culture, and communication identity.                                                         | `NEW_PRODUCT_INTENT`        | None of these narrative knowledge families is part of the currently approved Establishment profile field boundary or executable profile shape.                                                                                                                                                        | Keep in a proposed-intent register until ownership, scope, lifecycle, and data classification are approved.                                                                                                      |
| One datum has one canonical source and may have multiple consumers.                                                                                                                  | `ALREADY_CURRENT`           | The Establishment home, ADR-006, Tenancy, Booking, Personnel, Today, and database-boundary sources all preserve source-module ownership and reject duplication.                                                                                                                                       | Retain as an integration invariant, with the owner named per datum rather than treating this page as the default owner.                                                                                          |
| Current identity, address, phone, email, website, public contacts, description, logo, languages, service modes, and visibility belong on the page.                                   | `ALREADY_CURRENT`           | ADR-006, the Establishment home, page pack, active profile contract/schema, repository, and tests agree. Logo is currently an HTTP(S) reference, not an upload lifecycle.                                                                                                                             | Carry these forward as current bounded profile context. Use current field names, validation, visibility rules, and owner.                                                                                        |
| Cover reference belongs to the current profile.                                                                                                                                      | `ALREADY_CURRENT`           | ADR-006, the Establishment home, page pack, schema, and contract include a supported cover-image URL reference, although the Product-discussion field table does not list it.                                                                                                                         | Preserve this current field in any future page-level home; do not infer upload/storage behavior.                                                                                                                 |
| Slug, active status, locale, and timezone are part of Establishment context.                                                                                                         | `ALREADY_CURRENT`           | The Establishment home and active schema identify these fields as current Establishment-owned context. The current general-information editor does not edit them.                                                                                                                                     | Add them to canonical context as current read-only/non-editor scope; do not silently make them editable.                                                                                                         |
| `Nom commercial` and `Nom de l'etablissement` are two separate profile fields.                                                                                                       | `NEEDS_REVIEW`              | The current executable profile has one `name` field and the implemented editor labels it as the commercial name. No approved second establishment-name field exists.                                                                                                                                  | Product must decide whether these are synonyms, distinct future concepts, or organization/company data. Do not create a second field by inference.                                                               |
| Main social-network links belong to the general profile.                                                                                                                             | `OTHER_OWNER`               | The current Establishment profile has no social-link fields. Reputation settings own bounded external review/social destinations, and Facebook/Instagram connectors are deferred in Reputation.                                                                                                       | Do not move or duplicate Reputation-owned links. Decide separately whether a general public-social profile capability is needed and who owns it.                                                                 |
| Legal/company data (raison sociale, forme juridique, SIREN/SIRET, VAT number, registered office, legal representative, administrative contacts) belongs in `Informations generales`. | `NEEDS_REVIEW`              | ADR-006 explicitly keeps Organization identity outside Establishment. Neither the current Organization nor Establishment executable shape contains this legal set. The Formalites legal-review brief only proposes a validated employer configuration and leaves its exact source/content unresolved. | Make an explicit Product and data-ownership decision across Organization, Establishment/site, and a possible employer/legal configuration. Do not add these fields to the current page or assign an owner yet.   |
| Legal/company data from this page should feed contracts and Formalites.                                                                                                              | `NEW_PRODUCT_INTENT`        | Personnel Product Knowledge says durable Formalites is proposed, not implemented; its data owner remains `NEEDS REVIEW`. Current Formalites is an OWNER-only, development-only in-memory prototype.                                                                                                   | Retain as a proposed relationship only. First approve the legal-data owner and durable Formalites boundary, then define an allowlisted read projection.                                                          |
| Menus/prices, Booking data, and individual employee dossiers must not be copied into this page.                                                                                      | `ALREADY_CURRENT`           | The current page pack excludes menu/catalog and reservation configuration. ADR-006 and the Establishment, Booking, and Personnel homes retain separate owners.                                                                                                                                        | Preserve as explicit non-goals. A future knowledge capability may reference source-owned facts but must not become a second owner.                                                                               |
| Opening hours and services belong to specialized pages.                                                                                                                              | `OTHER_OWNER`               | Weekly service periods and dated exceptions are Booking-owned under `/etablissement/horaires-services`; current Establishment `serviceModes` are separately profile-owned.                                                                                                                            | Replace the ambiguous word `services` with the exact concepts. Keep Booking service periods separate while retaining Establishment service modes.                                                                |
| Rooms and tables belong outside this page.                                                                                                                                           | `NEEDS_REVIEW`              | ADR-006 deliberately does not approve or classify detailed Rooms and Tables ownership or lifecycle.                                                                                                                                                                                                   | Keep outside the page for now, but do not name a canonical owner until a dedicated decision is approved.                                                                                                         |
| `OWNER`, `MANAGER`, and `STAFF` profile access.                                                                                                                                      | `ALREADY_CURRENT`           | Establishment Product Knowledge, Backoffice permission mapping, and permission tests agree: all three roles have `establishment.profile.read`; only `OWNER` and `MANAGER` have `establishment.profile.manage`; `STAFF` is read-only.                                                                  | Use this current policy for the bounded profile only. Do not extend it to narrative, legal, administrative, or AI-suggestion data.                                                                               |
| A generic `restaurateur` may add knowledge and accept, edit, or ignore suggestions.                                                                                                  | `NEEDS_REVIEW`              | No current capability permission maps these operations. Existing role labels are not a permission, and current module permissions differ.                                                                                                                                                             | Define operation-level permissions after the proposed knowledge owner and data classes are approved.                                                                                                             |
| Organization/establishment and runtime boundaries were not decided in the Product discussion.                                                                                        | `ALREADY_CURRENT`           | Tenancy, ADR-003, ADR-006, Database Boundaries, and the Establishment home already decide these durable boundaries.                                                                                                                                                                                   | Canonical material must incorporate current authority: Cloud data uses `packages/db-cloud` under trusted server-derived organization-and-establishment scope; POS-local and Display remain separate.             |
| Public, internal, and administrative knowledge classes must stay separate.                                                                                                           | `NEW_PRODUCT_INTENT`        | Current Establishment visibility booleans control supported optional public profile fields; they are not a general three-class knowledge taxonomy. Existing security rules prohibit accidental public exposure, but no knowledge-class model is approved.                                             | Retain the separation goal, but do not equate it with current visibility flags. Product/security review must define classification, defaults, viewers, modifiers, and enforcement.                               |
| Public Booking consumes bounded Establishment profile data while owning settings, periods, exceptions, availability, and reservations.                                               | `ALREADY_CURRENT`           | Establishment and Public Booking homes, ADR-006, the repository, and integration tests agree.                                                                                                                                                                                                         | Preserve this exact current relationship; do not generalize it into access to all future knowledge.                                                                                                              |
| Reputation/review replies should consume validated restaurant knowledge and corrections/replies should generate candidate knowledge.                                                 | `NEW_PRODUCT_INTENT`        | Reputation currently owns reviews, feedback, drafts, audit records, and connectors. AI analysis/reply generation is incomplete; no cross-module knowledge-suggestion flow is approved or implemented.                                                                                                 | Treat both consumption and candidate-generation as proposed integrations. Reputation remains owner of source reviews/replies; define consent, minimization, provenance, and human approval before specification. |
| Facebook and Instagram content generation should consume the knowledge and communication identity.                                                                                   | `NEW_PRODUCT_INTENT`        | No current Marketing/content generation capability owns this behavior. Reputation defers Facebook/Instagram connectors, and Public Website does not establish tenant social-content generation.                                                                                                       | Require a separate owner and bounded Product Decision. Do not assign this behavior to Establishment merely because it consumes restaurant context.                                                               |
| Personnel remains owner of individual employee data while the page may own team culture.                                                                                             | `NEW_PRODUCT_INTENT`        | The non-duplication boundary is current; the proposed team-culture knowledge family has no current owner. Personnel explicitly owns dossiers and current-employment facts.                                                                                                                            | Preserve Personnel ownership and review team-culture scope separately, including whether it is establishment knowledge or an internal-operations knowledge source.                                               |
| Today has no relationship approved by the Product discussion.                                                                                                                        | `OTHER_OWNER`               | Current Today authority already consumes trusted Establishment identity/locale/timezone context and separately owns no profile data. Future internal operational knowledge aggregation is approved only as a category and is not started.                                                             | Canonical page context must state the current Today relationship. Do not infer that the proposed Restaurant Knowledge Hub is Today's future knowledge source.                                                    |
| Public Website has no relationship approved by the Product discussion.                                                                                                               | `IMPLEMENTED_EVIDENCE_ONLY` | Current Establishment knowledge records a bounded hostname-resolved public tenant endpoint, but no general public Establishment profile route is approved.                                                                                                                                            | Record only the bounded current context and keep any broader public profile or knowledge consumption as unapproved.                                                                                              |
| POS / Site Agent has no relationship approved by the Product discussion.                                                                                                             | `ALREADY_CURRENT`           | ADR-003, ADR-006, and Establishment Product Knowledge explicitly separate the Cloud Establishment and restaurant-local POS profile; no synchronization is approved.                                                                                                                                   | State the separation explicitly in a future page home. Do not create a relationship, copy, or reconciliation path.                                                                                               |
| Display has no proposed relationship in the source.                                                                                                                                  | `ALREADY_CURRENT`           | ADR-006 and the Establishment home establish no Display consumption or synchronization. Display has independent persistence.                                                                                                                                                                          | Preserve the explicit no-relationship boundary unless a separate decision changes it.                                                                                                                            |
| Avoid a large initial narrative form and allow gradual enrichment.                                                                                                                   | `NEW_PRODUCT_INTENT`        | This concerns the unapproved narrative knowledge capability, not the current four-section profile editor.                                                                                                                                                                                             | Retain as proposed UX/Product intent and validate it only after the capability boundary is approved.                                                                                                             |
| Add `Apprendre quelque chose a YUTA` natural-language entry.                                                                                                                         | `NEW_PRODUCT_INTENT`        | No current Establishment capability, contract, provider boundary, storage model, or permission supports it.                                                                                                                                                                                           | Require a bounded Product Decision; do not design provider, schema, API, or storage during integration review.                                                                                                   |
| Infer potential knowledge from replies/corrections, with add/edit/ignore human validation.                                                                                           | `NEW_PRODUCT_INTENT`        | No current cross-module ingestion or suggestion workflow exists. Existing Reputation audit/reply records are Reputation-owned and do not constitute a knowledge workflow.                                                                                                                             | Define source allowlists, provenance, confidence/representation, human decision states, permissions, retention, and failure behavior before an OpenSpec pilot.                                                   |
| Keep saved knowledge, suggestions, and history/provenance.                                                                                                                           | `NEEDS_REVIEW`              | The source itself leaves history and metadata unresolved. No current owner or general-knowledge persistence exists.                                                                                                                                                                                   | Product must decide whether history is required and distinguish knowledge provenance from module audit events.                                                                                                   |
| Replace the current four-section editor with seven knowledge sections, internal navigation, counters, and knowledge tabs.                                                            | `NEW_PRODUCT_INTENT`        | The current page pack defines and evidences a four-section profile editor with a local preview and derived completion. It does not approve knowledge navigation or suggestion counters.                                                                                                               | Do not replace current UI. After Product approval, decide whether the knowledge capability extends this route, composes a separate surface, or uses another page.                                                |
| Completion, explicit save, validation, loading/error/success, responsive behavior, and local preview are unresolved.                                                                 | `IMPLEMENTED_EVIDENCE_ONLY` | The current page pack and tracked page implementation already evidence these behaviors for the bounded profile. Completion and preview are derived UI state, not persistence.                                                                                                                         | Preserve current bounded behavior. Re-review these interactions separately for any future knowledge capability; current implementation does not decide its UX.                                                   |

## Confirmed current page context

The current page context that a future canonical page home must preserve is:

- Route: `/etablissement/informations-generales` in authenticated Backoffice.
- Product boundary: one Cloud Establishment represents a restaurant, site, or
  branch inside an Organization.
- Runtime/data owner: `apps/backoffice` over `packages/db-cloud`; canonical
  bounded profile data is stored on `establishments`.
- Trusted scope: the server derives active organization, establishment,
  membership, role, permissions, entitlements, locale, and timezone. Browser
  values are not authorization evidence.
- Permissions: `OWNER`, `MANAGER`, and `STAFF` may read; only `OWNER` and
  `MANAGER` may edit the current profile.
- Current profile: name, description, structured address, primary and public
  contacts, website, logo and cover URL references, languages, supported
  service modes, and optional-field visibility flags.
- Current non-editor context: slug, active status, locale, and timezone are
  Establishment-owned but not editable by this page.
- Current UI-derived state: completion and the in-page public preview are not
  persisted.
- Current lifecycle: Product Decision `APPROVED`, repository implementation
  `IMPLEMENTED`, environment `UNVERIFIED`, production readiness `NOT_READY`,
  external dependency `NOT_ASSESSED`.
- Separate owners: Booking owns settings, service periods, exceptions,
  availability, and reservations; Reputation owns feedback/reviews/replies and
  connectors; Identity / Access owns membership and permissions; Today only
  consumes trusted context; Personnel owns employee dossiers.
- Separate runtimes: the Cloud profile is not the POS-local establishment
  profile and is not synchronized with POS. Display remains independent.
- Unapproved current extensions: media upload/storage, geocoding, external
  public profile, expanded service modes, external synchronization, and Rooms
  and Tables classification.

## New Product Intent register

The following Product-discussion items are coherent candidates for Product
review but are not current authority:

1. A restaurant knowledge capability covering narrative identity, history,
   cuisine, know-how, customer experience, team culture, and communication
   identity.
2. Gradual enrichment rather than a large initial narrative form.
3. Direct natural-language submission through an action such as
   `Apprendre quelque chose a YUTA`.
4. Candidate knowledge derived from explicitly allowed product interactions,
   never promoted automatically from customer feedback or restaurateur edits.
5. Human accept/edit/ignore control before a candidate becomes validated
   knowledge.
6. Separation of public, internal, and administrative uses.
7. Bounded downstream consumption by Reputation replies, future
   Marketing/content generation, and future Formalites/contracts.
8. A page-level context document that explains the relationship between the
   current factual profile and any separately approved knowledge capability.

Approval must specify whether these items extend Establishment itself or belong
to a separately owned knowledge module composed into the page.

## Conflicts

No accepted-source conflict needs to be resolved if the Product-discussion
material remains explicitly proposed intent.

The following would become conflicts if the source were merged as current
authority without bounded updates:

- calling the existing page a current `Restaurant Knowledge Hub` would
  contradict its approved/current bounded-profile description;
- placing Organization/company legal identity inside the Establishment profile
  would contradict ADR-006's Organization/Establishment boundary unless a new
  accepted decision deliberately refines that ownership; and
- treating generic `services` as outside the profile would obscure the current
  distinction between Establishment-owned service modes and Booking-owned
  service periods.

These are integration hazards, not decisions made by this review.

## NEEDS REVIEW

Product review must resolve at least the following before integration:

1. Is the proposed knowledge capability owned by Establishment, by a new
   bounded knowledge module, or by several source modules with a composed page?
2. Does `Informations generales` remain a profile page with a linked knowledge
   surface, or does its approved page responsibility expand?
3. Are `nom commercial` and `nom de l'etablissement` one concept or two?
4. Who owns each legal/company fact: Organization, Establishment/site, or a
   dedicated employer/legal configuration? Which facts are organization-wide
   versus establishment-specific?
5. Which roles/permissions may read, create, edit, validate, reject, classify,
   and audit narrative, administrative, and suggested knowledge?
6. What are the approved knowledge categories and visibility rules, and how do
   they differ from current profile visibility flags?
7. Which source events may create candidates? Customer feedback, replies,
   corrections, and direct entry must be decided individually.
8. What provenance, source attribution, retention, deletion, and history are
   required? A module audit trail must not be assumed to be knowledge history.
9. Which downstream modules may consume which approved classes, under what
   minimization and authorization rules?
10. Is team culture Establishment knowledge, Personnel-adjacent internal
    knowledge, or owned elsewhere?
11. Who owns social profile links and future social-content generation?
12. Does a general public Establishment profile exist in future, or do public
    consumers remain bounded module-specific projections?
13. How should existing factual profile editing coexist with narrative
    onboarding, suggestions, and any seven-section information architecture?
14. Are provider-backed AI processing and external data flows in scope at all?
    If later approved, provider eligibility, privacy, security, and readiness
    gates remain separate from Product approval.

## Proposed canonical home

If Product review confirms that this remains page-level context within the
Establishment module, the preferred future location is:

`docs/features/establishment/general-information/README.md`

This review does not create that home. Before creation, Product must approve
the bounded relationship between the current profile and the proposed
knowledge capability. If Product instead assigns the knowledge capability to a
different owner, that owner needs its own canonical home and the
general-information page home should link to it rather than absorb its
authority.

## Relationship to Establishment home

The module home at `docs/features/establishment/README.md` must not be replaced.
It remains the canonical module-level Product Knowledge entry point for Cloud
Establishment and its approved profile/context boundary.

A future page home would provide page-level context only. It should:

- inherit the module's Organization/Establishment, tenant, runtime, and data
  boundaries;
- describe the current factual profile without duplicating the executable
  schema catalog;
- identify separately owned source modules and link to their homes;
- keep proposed knowledge behavior visibly distinct from current approved and
  implemented behavior; and
- never promote Product-discussion claims or page-pack implementation evidence
  into approved Product Intent by file placement alone.

Any future OpenSpec analysis for this page must read both the Establishment
module home and the page home, then the applicable accepted decisions,
security/runtime authorities, source-module homes, and implementation evidence.

## OpenSpec readiness

An OpenSpec pilot based on the proposed `Restaurant Knowledge Hub` must not
start yet.

The blockers are the unresolved capability owner/page boundary, legal/company
data ownership, operation-level permissions, knowledge classification,
candidate-source allowlist, human-validation lifecycle, provenance/history,
downstream consumer contracts, and the relationship with existing profile UI.
These are Product and authority decisions, not technical details to infer in an
OpenSpec analysis.

The existing bounded profile is already approved and implemented; its current
behavior does not authorize a pilot for the new knowledge scope. After the
blockers above are explicitly resolved and the page knowledge is integrated as
approved current context, a narrowly bounded first change may be proposed.

Status: PROPOSED FOR REVIEW
