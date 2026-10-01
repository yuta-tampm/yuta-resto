# YUTA Ressources internes Product Knowledge

Status: APPROVED — KNOWLEDGE MIGRATION COMPLETE

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-29

## Purpose and bounded scope

Ressources internes is the future Backoffice capability for keeping useful
internal restaurant content together and sharing it with the team in a simple,
organized way. The confirmed high-level scope includes internal announcements,
internal documents, general procedures, and `fiches de poste`. The intended
experience should be practical, effective, and easy to use.

Restaurant-created video hosted by an external service is also a confirmed
high-level direction. No provider, upload, embed, access, privacy, security,
copyright, retention, or production contract is approved.

This home is the canonical repository entry point for the exact migrated
Ressources internes knowledge scope. It separates Product direction, proposal
provenance, repository implementation, executable shape, authorization,
external-review status, environment, and readiness. It creates no resource
contract, document contract, projection, write-back, lifecycle, provider
selection, or production authorization.

The scope is Ressources internes only. References to Personnel, Tâches du jour,
Aujourd'hui, Formalités, Documents, Restaurant Knowledge, Conformité,
Marketing, Website, Identity / Access, Notifications, POS, Site Agent, or
Display define boundaries and non-inferences. They do not migrate or change
those capabilities.

## Knowledge reconciliation state

The Human-supplied `RESSOURCES_INTERNES_LEGACY_KNOWLEDGE_EXTRACT.md` with
SHA-256
`d45d67ab044280efb4d7708985cca46bcc287f010aa33ec7d5a878931130e710`
was used only as legacy evidence for the 2026-09-29 reconciliation. Its exact
first heading and final control block were verified, and the complete artifact
was read before classification. The extract was not copied into this home, and
its classifications were checked against question-specific repository
authority.

Repository reconciliation and bounded canonicalization are complete.

All completed scope-bound migrations and their open decision packets remain
unchanged.

## Fresh-agent acceptance and authority cutover

The repository-only
`RESSOURCES_INTERNES_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` has SHA-256
`0148027c101f18dce31edd5451857ff62797ba3e4ddff8405f1cbb3e82dcad6c`.
Its complete 718 logical lines and exact final controls were verified before
cutover. The fresh agent used no Page Chat history, legacy extract,
reconciliation report, or external research and reported:

```text
REPOSITORY_MUTATED: NO
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
RECONCILIATION_REPORT_USED: NO
EXTERNAL_RESEARCH_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 0
HUMAN_CURRENT_ITEMS_RECOVERED: 8
PROPOSAL_FAMILIES_RECOVERED: 13
RI_DECISION_PACKETS_RECOVERED: 20
OBSOLETE_CLAIMS_RECOVERED: 1
EXTERNAL_VIDEO_DIRECTION_RECOVERED: YES
EXACT_V1_STATUS_RECOVERED: UNRESOLVED
EXACT_YOUTUBE_PROVIDER_CONTRACT_APPROVED: NO
RESOURCE_OR_DOCUMENT_CONTRACTS_CREATED: NO
SOURCE_PROJECTION_CONTRACTS_CREATED: NO
SOURCE_WRITEBACKS_CREATED: NO
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The report also recorded that no protected scope was reopened, no adjacent
scope was migrated, no current legal/privacy/security/copyright claim or
conclusion was created, and no OpenSpec change or Product code change occurred.
It is repository-discovery acceptance evidence only and adds no Product,
implementation, provider, legal, authorization, environment, readiness, or
production authority.

Repository reconciliation, proposal-payload remediation, repository-only
fresh-agent acceptance, and the Human-authorized scope-bound authority cutover
are complete for the exact Ressources internes scope in this home. Under the
[Authority Model](../../AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition):

- the repository is canonical knowledge for this exact migrated scope;
- the Ressources internes Page Chat is `LEGACY EVIDENCE ONLY` for this exact
  scope and remains available for historical or forensic lookup;
- Codex owns repository discovery, shaping, cross-module reasoning and
  governance coordination under
  [task collaboration](../../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review).
  CT advice is optional in `CT_BRIDGE` or `HUMAN_CT_BRIDGE`; unresolved
  Product/authority decisions still require the owning Human.
- Coding Agents execute and verify only the selected task's authorized scope;
  routine gates use the mode-defined review mechanism.

This cutover changes knowledge authority only. It does not close the exact V1,
promote a proposal, resolve `RI-01` through `RI-20`, create a resource model or
cross-module contract, enable an environment, change readiness, authorize
production, migrate another scope, or change another Page Chat's authority.

## Confirmed current Product direction

The eight Human-current items below are preserved at conceptual Product level.
The fixed-perimeter statement confirms the high-level boundary and does not
approve every detailed proposal that was discussed inside it.

| Item | Confirmed direction                        | Exact boundary                                                                                                                                                                    | Current implementation                                    |
| ---: | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
|    1 | Internal announcements                     | Announcements are one of the four included content families. Audience, fields, lifecycle, notification behavior, and acknowledgment remain open.                                  | `DECIDED_NOT_IMPLEMENTED`                                 |
|    2 | Internal documents                         | Internal documents are included. File ownership, storage, document taxonomy, access, retention, and relationship to Personnel or Formalités artifacts remain open.                | `DECIDED_NOT_IMPLEMENTED`                                 |
|    3 | General procedures                         | General procedures are included. Structure, versioning, qualification, applicability, and any relationship to tasks or compliance evidence remain open.                           | `DECIDED_NOT_IMPLEMENTED`                                 |
|    4 | `Fiches de poste`                          | `Fiches de poste` are included. Their canonical owner and operational, Personnel, Formalités, Documents, and task relationships remain unresolved.                                | `DECIDED_NOT_IMPLEMENTED`                                 |
|    5 | Practical, effective, and easy use         | This is a qualitative experience objective. It creates no measurable acceptance threshold, workflow, or field.                                                                    | `DECIDED_NOT_IMPLEMENTED`                                 |
|    6 | Simple and organized team sharing          | Team sharing is approved at high level. It does not approve employee self-service, an audience model, or permission grants.                                                       | `DECIDED_NOT_IMPLEMENTED`                                 |
|    7 | Externally hosted restaurant-created video | A restaurant may eventually use video that it created and that an external service hosts. The direction has medium legacy confidence and selects no provider.                     | `DECIDED_NOT_IMPLEMENTED`                                 |
|    8 | High-level perimeter fixed                 | The Human phrase `ok, on fixe périmètre` fixes the high-level family boundary above. It is provenance for the boundary, not item-by-item approval of the proposal payloads below. | Product-boundary provenance; no separate runtime behavior |

## Current repository implementation

| Evidence area       | Current repository state                                                                                                                                                          | What it establishes                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Route               | [`/etablissement/ressources-internes`](<../../../apps/backoffice/src/app/(authenticated)/etablissement/ressources-internes/page.tsx>) exists under the authenticated route group. | The canonical Backoffice route is known. Route placement does not settle domain or data ownership.                                      |
| Renderer            | The route renders [`PlannedBackofficePage`](../../../apps/backoffice/src/components/backoffice/planned-backoffice-page.tsx) with a title and construction copy.                   | Shared placeholder presentation only; no resource list, detail, authoring, upload, audience, acknowledgment, or search behavior exists. |
| Navigation          | [`backoffice-navigation.ts`](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts) links `Ressources internes` under `Établissement`.                      | Discoverable navigation only; the item has no Ressources-internes entitlement or capability predicate.                                  |
| Authenticated shell | The parent [`(authenticated)` layout](<../../../apps/backoffice/src/app/(authenticated)/layout.tsx>) requires a current server-resolved session and tenant context.               | Generic authenticated organization/establishment context only; no resource-specific permission or employee identity is defined.         |
| Tests               | [`backoffice-navigation.test.ts`](../../../apps/backoffice/test/backoffice-navigation.test.ts) asserts the label, order, and canonical href.                                      | Navigation regression evidence only; no focused resource, authorization, upload, or behavior test exists.                               |
| Contracts and shape | Repository search finds no dedicated Ressources-internes transport contract, schema, migration, resource enum, repository, action, or persistence.                                | No executable resource or document shape, data owner, or operation catalog exists.                                                      |
| UI knowledge        | No Ressources-internes page pack exists under [`docs/ui/pages`](../../ui/pages/README.md).                                                                                        | No approved detailed UI scope, accessibility evidence, or Browser QA exists.                                                            |
| Normative behavior  | No accepted ADR or normative OpenSpec main spec targets this capability.                                                                                                          | Detailed behavior remains unresolved; navigation and placeholder code do not create Product approval.                                   |

The capability implementation classification is `NOT_STARTED`. The route,
authenticated shell, navigation, and shared placeholder are implemented; the
Ressources internes capability is not.

## Canonical Product model

The current model is deliberately small:

1. Ressources internes is a bounded future Backoffice capability for internal
   restaurant content and team sharing.
2. Its approved conceptual content perimeter has four families:
   announcements, internal documents, general procedures, and `fiches de
poste`.
3. Practical, effective, and easy use plus simple, organized team sharing are
   qualitative directions, not executable requirements.
4. External-hosted restaurant-created video is a high-level direction only.
5. No canonical resource-type enum, common aggregate, document-management
   model, learning-management model, intranet model, file store, provider,
   lifecycle, permission matrix, or cross-module contract exists.
6. Every source module retains its own data and mutation authority. A future
   projection or link requires a separate Product and trust-boundary decision.

## Capability and state matrix

| Capability                               | Product status                                                                                    | Implementation                  | Legal/privacy/security/copyright status                                                    | Environment   | Readiness / production authorization | Owner / actors                                                                                         | Organization / establishment scope, exclusions, and open boundary                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------ | ------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Internal announcements                   | `APPROVED` at high level; exact V1 unresolved                                                     | `NOT_STARTED`; placeholder only | `UNVERIFIED`                                                                               | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Ressources internes conceptual family; authors, recipients, reviewers, and publishers unresolved       | Both ownership levels unresolved; no notification, mandatory-reading, acknowledgment-proof, or cross-module behavior                                  |
| Internal documents                       | `APPROVED` at high level; exact V1 unresolved                                                     | `NOT_STARTED`                   | `REQUIRES_CURRENT_EXTERNAL_REVIEW` before real files or production use                     | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Ressources internes conceptual family; file owner and every reader/mutator unresolved                  | Both ownership levels unresolved; no storage, access, retention, DMS, Personnel, Formalités, or Documents contract                                    |
| General procedures                       | `APPROVED` at high level; exact V1 unresolved                                                     | `NOT_STARTED`                   | `REQUIRES_CURRENT_EXTERNAL_REVIEW` where legal, safety, or domain compliance is implicated | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Ressources internes conceptual family; authors, reviewers, publishers, and affected team unresolved    | Both ownership levels unresolved; no task, Compliance-evidence, qualification, applicability, or write-back contract                                  |
| `Fiches de poste`                        | Included at high level; canonical owner unresolved                                                | `NOT_STARTED`                   | Employment/legal/privacy/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW`                | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Canonical owner and authors/readers unresolved among Resources, Personnel/Documents, and task concerns | Both ownership levels unresolved; no Personnel `poste`, employment-artifact, signature, task-model, or generation contract                            |
| External-hosted video                    | Confirmed `HIGH_LEVEL_DIRECTION`; provider contract unapproved                                    | `NOT_STARTED`                   | Legal/privacy/security/copyright/provider status `REQUIRES_CURRENT_EXTERNAL_REVIEW`        | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Resource owner, host, uploader, reviewer, publisher, and audience unresolved                           | Both ownership levels unresolved; no selected provider, visibility, embed/link, upload, API, or YUTA-hosting decision                                 |
| Team sharing and employee-context access | `APPROVED` qualitatively; detailed mobile/web and filtering behavior `PROPOSED_NOT_APPROVED`      | `NOT_STARTED`                   | Privacy/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                 | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Team relevance is directional; employee identity, authors, recipients, and permissions unresolved      | Both ownership levels unresolved; no employee self-service, Personnel projection, audience enum, inheritance, or authorization model                  |
| Detailed page, dashboard, and operations | `PROPOSED_NOT_APPROVED`                                                                           | `NOT_STARTED`                   | `UNVERIFIED`                                                                               | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Exact creators, readers, reviewers, publishers, and administrators unresolved                          | Both ownership levels unresolved; no page structure, shortcuts, operation catalog, or data shape approved                                             |
| Read and acknowledgment interactions     | `PROPOSED_NOT_APPROVED`                                                                           | `NOT_STARTED`                   | Legal/privacy/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW`                           | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Readers, acknowledged parties, evidence viewers, and administrators unresolved                         | Both ownership levels unresolved; no viewed/read/acknowledged equivalence, mandatory-reading policy, legal proof, notification, or signature behavior |
| Printable per-resource QR                | `PROPOSED_NOT_APPROVED`                                                                           | `NOT_STARTED`                   | Privacy/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                 | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Resource owner, printer, scanner, resolver, and authorized reader unresolved                           | Both ownership levels unresolved; no public access, bearer authority, payload, resolver, rotation, expiry, or direct-file URL                         |
| AI-assisted authoring                    | `PROPOSED_NOT_APPROVED`                                                                           | `NOT_STARTED`                   | Provider/legal/privacy/security/copyright status `REQUIRES_CURRENT_EXTERNAL_REVIEW`        | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Human author/reviewer remains required if ever approved; AI/provider ownership and actors unresolved   | Both ownership levels unresolved; no provider, model, prompt, retrieval, training, autonomous canonical write, or publication                         |
| Future Today awareness                   | Today already approves internal operational knowledge as a future source-owned information family | `NOT_STARTED`; no integration   | Privacy/security status `UNVERIFIED`                                                       | `NOT_ENABLED` | `NOT_ASSESSED`; none                 | Ressources internes would retain source ownership; Today would be a separately authorized consumer     | Both ownership levels and minimized projection unresolved; no integration, priority, acknowledgment, mutation, or write-back                          |

Backoffice remains `NOT_READY`. Documentation, local checks, later UI delivery,
or environment enablement would not by itself grant production authorization.

## Internal resource concept matrix

| Concept                          | Current status                        | Canonical owner                                                                          | Current shape / implementation                                     | Explicit non-inference                                                                                 |
| -------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Announcement                     | Confirmed content family              | Ressources internes at conceptual family level                                           | No entity, fields, lifecycle, or persistence                       | Not a notification, message delivery, or legal acknowledgment                                          |
| Internal document                | Confirmed content family              | Ressources internes at conceptual family level; exact file/artifact ownership unresolved | No file model, metadata, storage, or persistence                   | Not a Personnel document, Formalités draft, generated contract, signed artifact, or generic DMS object |
| General procedure                | Confirmed content family              | Ressources internes at conceptual family level                                           | No procedure entity, steps, version, qualification, or persistence | Not a task, Compliance control, compliance conclusion, or evidence record                              |
| `Fiche de poste`                 | Confirmed inclusion; owner unresolved | `NEEDS REVIEW`                                                                           | No entity, document model, generator, or persistence               | Not automatically a Personnel position, signed employment artifact, task template, or daily task       |
| External video                   | Confirmed high-level direction        | Resource ownership and host unresolved                                                   | No provider, URL field, embed, upload, OAuth, API, or storage      | YouTube is an unapproved example; external hosting is not public access or YUTA-hosted media           |
| Audience                         | Proposed detail and unresolved model  | `NEEDS REVIEW`                                                                           | No audience entity or filter                                       | Relevance is not authorization; `poste` is Personnel-owned and is not a resource permission            |
| Read / acknowledgment            | Proposed interactions                 | `NEEDS REVIEW`                                                                           | No state or event                                                  | Viewed, read, acknowledged, accepted, approved, and signed are distinct                                |
| QR access                        | Proposed convenience                  | `NEEDS REVIEW`                                                                           | No QR payload or resolver                                          | A QR code would not bypass authentication or authorization                                             |
| Resource category / tag / search | Proposed discovery model              | `NEEDS REVIEW`                                                                           | No taxonomy, index, or query contract                              | Proposal labels are not enums                                                                          |

## Ownership, authorization, and tenancy

- **Ressources internes:** owns only the confirmed conceptual content-family
  boundary in this home. No executable data owner exists.
- **Identity / Access:** owns trusted cloud identity, membership, session,
  role, permission, and entitlement mechanisms. It does not grant
  Ressources-internes operations. Route visibility is not authorization.
- **Trusted scope:** any future tenant-owned cloud operation must derive the
  active organization, establishment, membership, role, permission, and
  entitlement from validated server state, repeat the applicable tenant
  predicates, and fail closed. Browser-provided scope is never authority.
- **Organization and establishment:** the route currently runs inside both
  trusted contexts. Whether a resource is establishment-owned,
  organization-shared, copied, inherited, overridden, or globally templated is
  unresolved.
- **Personnel:** owns employee dossiers, employment facts, and current `poste`.
  No employee or `poste` projection, eligibility rule, audience filter, or
  write-back exists.
- **Tâches du jour:** retains future daily-task record and state ownership under
  its own reconciled boundary. A procedure or `fiche de poste` does not create,
  assign, complete, or mutate a task.
- **Formalités and Documents:** Formalités owns its bounded preparation state;
  signed employment artifacts belong to the separately bounded Documents
  concern. An internal document is not either artifact, and no handoff or
  write-back exists.
- **Aujourd'hui:** may later consume a separately approved, minimized,
  source-owned internal-knowledge projection. It owns no resource and has no
  current read, mutation, acknowledgment, or write-back contract.
- **Restaurant Knowledge:** owns its approved restaurant-description slices
  and validated-item collection. Internal operational content is a separate
  semantic scope; no copy, candidate, projection, or learning flow exists.
- **Conformité:** remains separate and unmigrated. A procedure is not a
  compliance rule, control, proof, conclusion, or legal qualification.
- **Marketing and Website:** public publication is separate from internal
  publication. No internal resource is public, marketing-ready, or projected
  to a public runtime by default.
- **Cloud/local boundary:** no POS, Site Agent, or Display projection,
  synchronization, storage, offline behavior, or write-back is approved.

## Announcement model

Announcements are a confirmed content family and are not implemented. The
proposal for whole-team, `poste`, or individual audience; priority; expiry;
attachments; and read confirmation remains `PROPOSED_NOT_APPROVED`.

Announcement creation, editing, review, approval, publication, scheduling,
expiry, archival, deletion, notification delivery, recipients, access,
history, and acknowledgment are unresolved. An internal announcement is not an
email, SMS, push notification, or proof of receipt merely because it is
published or displayed.

## Procedure model

General procedures are a confirmed content family and are not implemented.
Native structured authoring with text, steps, photos, documents, links, and
video is proposed, as is versioning with notification and renewed
acknowledgment. Neither is approved detailed behavior.

A procedure remains separate from a task, a `fiche de poste`, Restaurant
Knowledge, and Compliance evidence. Applicability, qualification, author,
reviewer, approver, publisher, effective date, versions, supersession,
acknowledgment, archive, retention, and legal or compliance meaning require
Human decisions and applicable external review.

## `Fiche de poste` model

`Fiche de poste` is included in the high-level perimeter. Its canonical owner
is unresolved. The proposed link to positions, missions, responsibilities, and
procedures remains `PROPOSED_NOT_APPROVED`, as does any detailed content model.

The operational description, Personnel `poste` fact, employment document,
signed artifact, task model, task generator, and daily task are distinct
concepts. No reference, copy, projection, generation, signature, employee
acknowledgment, or write-back contract connects them.

## Document, file, and media model

Internal documents are included conceptually, but no document or file contract
exists. The repository establishes no supported MIME type, size, filename,
metadata, checksum, malware scan, encryption, storage provider, URL scheme,
download policy, preview, access log, version, retention, deletion, restore, or
legal hold.

An external URL, externally embedded media, and YUTA-hosted file or media are
different storage and trust boundaries. No existing Establishment media,
Personnel Documents, Formalités, Restaurant Knowledge, POS, or Display store
is assigned to Ressources internes by proximity.

The proposed categorized document library, establishment/audience filters, and
search over shallow organization remain unapproved.

## External video and provider model

The confirmed direction is limited to restaurant-created video hosted by an
external service. It does not select YouTube or any other provider and does not
approve:

- unlisted or public visibility;
- URL or provider-ID fields;
- embedding, cookies, tracking, or third-party requests;
- automatic or manual provider upload;
- OAuth, API credentials, channels, quotas, retries, or moderation;
- a rule that YUTA never hosts media;
- a reliable classification of confidential or non-sensitive content; or
- provider, copyright, privacy, security, retention, accessibility, or
  production compliance.

The exact YouTube proposal and automatic YouTube upload are two of the thirteen
preserved proposal families below. Current external legal, privacy, security,
copyright, provider, and operations review is required before selection or
production use.

## Audience, access, and acknowledgment

Audience, relevance, visibility, and authorization are separate:

- an audience describes intended recipients;
- date, `poste`, establishment, or employee context may affect relevance only
  after an approved source projection;
- visibility describes what an authorized actor may see; and
- authorization is a server-enforced decision over trusted scope and a
  resource-specific operation.

No whole-team, role, `poste`, individual, manager, author, reviewer, publisher,
or administrator grant exists. No employee self-service identity bridge exists.

Viewed, opened, read, acknowledged, accepted, approved, and signed remain
distinct interactions. No mandatory-reading, renewed-acknowledgment,
evidentiary, non-repudiation, escalation, reminder, or legal-proof model is
approved.

## Authoring, review, publication, and versioning

No authoring operation or lifecycle exists. Author, canonical owner, reviewer,
approver, and publisher are distinct responsibilities and cannot be inferred
from `OWNER`, `MANAGER`, `STAFF`, employee `poste`, navigation access, or another
module's permission matrix.

Draft, review, approved, published, effective, expired, superseded, archived,
deleted, restored, and retained states are unapproved concepts. Internal
publication is not notification delivery, public Website publication, external
provider publication, employee acknowledgment, or legal effect.

## Preserved proposal families

The thirteen assistant-originated families below remain discoverable as
`PROPOSED_NOT_APPROVED`. The fixed-perimeter statement does not promote them.

| Stable ID | Preserved historical proposal payload                                                                                                                         | Classification          | Explicit boundary                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `P-01`    | Exact page structure with team home, announcements, procedures, `fiches de poste`, and documents                                                              | `PROPOSED_NOT_APPROVED` | Proposed information architecture only; no route tree or V1 approval                                                                                                               |
| `P-02`    | Resource dashboard with `éléments à lire`, `dernières annonces`, `procédures récemment modifiées`, and `raccourcis de création`                               | `PROPOSED_NOT_APPROVED` | “Recently modified” is historical proposal payload. No dashboard section, query, timestamp, prioritization, permission, or creation action is approved.                            |
| `P-03`    | Detailed announcements with whole-team/`poste`/individual audiences, priority, expiry, attachment, and read confirmation                                      | `PROPOSED_NOT_APPROVED` | Proposed fields and interactions; no schema, enum, or lifecycle                                                                                                                    |
| `P-04`    | Native structured procedures containing text, steps, photos, documents, links, and video                                                                      | `PROPOSED_NOT_APPROVED` | Proposed authoring model; no content contract or storage                                                                                                                           |
| `P-05`    | Procedure versioning with `plusieurs versions`, `date de modification`, `signalement d’une nouvelle version`, and `nouvelle prise de connaissance éventuelle` | `PROPOSED_NOT_APPROVED` | No version entity, effective date, notification behavior, acknowledgment renewal, lifecycle transition, mandatory reading, delivery, or evidence semantics is approved.            |
| `P-06`    | `Fiche de poste` linked to positions, missions, responsibilities, and procedures                                                                              | `PROPOSED_NOT_APPROVED` | Proposed relationships; canonical owner remains unresolved                                                                                                                         |
| `P-07`    | Document library with categories, establishment/audience filters, and search without deep folders                                                             | `PROPOSED_NOT_APPROVED` | Proposed discovery model; no DMS, taxonomy, or storage approval                                                                                                                    |
| `P-08`    | `espace YUTA destiné aux salariés` for `consultation des annonces`, `consultation des procédures`, and `ressources filtrées selon le contexte salarié`        | `PROPOSED_NOT_APPROVED` | No employee account, self-service, role/`poste` permission, audience filter, mobile behavior, Personnel projection, or authorization contract is approved.                         |
| `P-09`    | `vu`, `lu`, and `prise de connaissance` with viewer counts and acknowledgments                                                                                | `PROPOSED_NOT_APPROVED` | Proposed interactions; the terms remain distinct and legally unqualified                                                                                                           |
| `P-10`    | `QR imprimable`, `accès depuis une machine ou zone physique`, and `QR stable pointant vers une ressource mise à jour`                                         | `PROPOSED_NOT_APPROVED` | “Stable” is historical proposal payload, not an identifier model. No generation, resolver, public access, authentication bypass, printing, tracking, expiry, or revocation exists. |
| `P-11`    | `restaurateur écrit en langage naturel`; `YUTA propose annonce ou procédure structurée`; `Human corrige et valide`                                            | `PROPOSED_NOT_APPROVED` | No AI provider, model, prompt, retrieval, transcription, storage, learning, silent canonical write, automatic publication, legal review, long-term direction, or V1 approval.      |
| `P-12`    | Exact YouTube implementation using unlisted videos, embed, URL/ID, no YUTA hosting, and a non-sensitive-content rule                                          | `PROPOSED_NOT_APPROVED` | Proposed provider contract; YouTube is not selected and every stated detail is unapproved                                                                                          |
| `P-13`    | Automatic YouTube upload                                                                                                                                      | `PROPOSED_NOT_APPROVED` | Proposed integration; no OAuth, API, credential, channel, quota, retry, or publication authority                                                                                   |

## Task, Today, and Compliance relationships

- **Tâches du jour:** Ressources internes may provide human-readable knowledge;
  it has no approved projection into task models or daily task instances. A
  procedure step, responsibility, or acknowledgment cannot create or complete
  a task. Tâches du jour cannot edit a procedure or `fiche de poste`.
- **Aujourd'hui:** ADR-005 approves internal operational knowledge as a future
  source-owned information family. No source read model, freshness rule,
  priority, link, permission composition, or write-back is implemented or
  approved.
- **Conformité:** procedure content may someday be relevant to compliance work,
  but it is not a legal requirement, control, attestation, audit record, or
  proof. No Compliance projection or conclusion exists.

## Restaurant Knowledge, Marketing, and public boundaries

Restaurant Knowledge describes the restaurant through its own approved,
establishment-scoped families and validated-item collection. Ressources
internes concerns internal operational content for a team. Similar prose,
photos, links, or media do not merge these owners.

Marketing and Website publication remain separate. No resource is approved for
public display, SEO, campaigns, social media, customer-facing content, or
provider publication. No projection or write-back exists in either direction.

## AI assistance

AI-assisted authoring with Human correction and validation is
`PROPOSED_NOT_APPROVED`. No AI provider, model, prompt, retrieval source,
training use, storage, embedding, moderation, attribution, confidence,
copyright handling, privacy/security control, audit, or failure behavior is
selected.

Any future assistance must keep generated output non-canonical until an
authorized Human explicitly reviews and saves it. This safeguard is a
non-inference boundary for future work, not approval of AI use or a current
operation.

## Product, implementation, shape, external review, and readiness

- **Product Intent:** eight bounded Human-current items are preserved; thirteen
  detailed proposal families are unapproved; twenty grouped decisions remain
  open.
- **Implemented State:** the authenticated route, navigation, shared placeholder,
  and navigation assertions exist. No capability behavior exists.
- **Executable shape:** no resource/document contract, enum, table, migration,
  repository, operation, file store, provider shape, or projection exists.
- **Authorization and tenancy:** generic trusted shell context exists; no
  Ressources-internes entitlement, permission, audience, employee bridge, or
  organization/establishment ownership model exists.
- **Legal/privacy/security/copyright:** no current conclusion exists. Applicable
  current external review is required before real files, employee-related
  content, acknowledgments with claimed effect, external media/provider use,
  regulated procedures, or production operation.
- **Environment:** `NOT_ENABLED`; tracked code does not prove deployment.
- **Production readiness:** `NOT_ASSESSED`; Backoffice is `NOT_READY`; no
  production authorization exists.

## Human decisions still required

The twenty packets below are not implementation tasks and do not authorize an
OpenSpec change. Each requires the named authority before a coding agent may
choose an answer.

| ID      | Exact question and affected concepts                                                                                                                                             | Current evidence and reason unresolved                                                                                                                    | External-review status                                                                                        | A coding agent must not infer                                                                                     | Required authority                                                                                            |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `RI-01` | What exact V1, purpose statement, canonical resource model, and family boundaries apply?                                                                                         | Four families and qualitative goals are confirmed; there is no executable common model, and the fixed-perimeter phrase does not approve proposal details. | Legal/privacy/security/copyright `UNVERIFIED`                                                                 | A generic `Resource` aggregate, enum, DMS, LMS, intranet, or the proposed page structure                          | Human Product, architecture, and data                                                                         |
| `RI-02` | What announcement fields, audiences, priorities, dates, attachments, operations, states, and failure behavior apply?                                                             | Announcement inclusion is confirmed; all detail is proposed and no shape exists.                                                                          | Legal/privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW` where employee communication or evidence is claimed | Schema, notification delivery, expiry, mandatory reading, or acknowledgment proof                                 | Human Product, data, authorization, legal/privacy/security, and operations                                    |
| `RI-03` | What procedure content, structure, qualification, applicability, authoring, effective-state, and supersession model applies?                                                     | Procedure inclusion is confirmed; native structure and version flow are proposals.                                                                        | Legal/privacy/security and applicable domain compliance `REQUIRES_CURRENT_EXTERNAL_REVIEW`                    | Steps, enums, approval, official status, task generation, or compliance evidence                                  | Human Product, domain owners, data, legal/privacy/security, and operations                                    |
| `RI-04` | Who owns `fiche de poste`, what does it mean, and how does it relate to Personnel `poste`, tasks, procedures, Formalités, and Documents?                                         | Inclusion is confirmed; current repositories do not assign an owner or model.                                                                             | Employment/legal/privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                          | Ressources internes, Personnel, Documents, or Tâches du jour ownership; copy/reference/generation; signed meaning | Human Product for every affected owner plus legal/privacy/security and data architecture                      |
| `RI-05` | What document/file/media families, metadata, storage, scanning, encryption, access, download, retention, deletion, and recovery apply?                                           | Internal-document inclusion exists; there is no file contract or assigned storage owner.                                                                  | Legal/privacy/security/copyright/operations `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                | Reuse of another module's store, supported file types, private URLs, immutable versions, or a DMS                 | Human Product, architecture/data, privacy/security, copyright, and operations                                 |
| `RI-06` | Which external-video provider, hosting/link/embed/upload model, visibility, content policy, data handling, accessibility, and recovery apply?                                    | Broad external-hosting direction exists; YouTube details and automatic upload are proposals.                                                              | Provider/legal/privacy/security/copyright/operations `REQUIRES_CURRENT_EXTERNAL_REVIEW`                       | YouTube selection, unlisted privacy, embed, OAuth/API, non-sensitive classification, or no YUTA hosting           | Human Product, provider, architecture, legal/privacy/security/copyright, accessibility, and operations        |
| `RI-07` | What QR payload, resolver, authentication, authorization, rotation, expiry, revocation, print, and failure behavior apply?                                                       | Printable per-resource QR is proposed only.                                                                                                               | Privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                                           | Public access, stable secrets, bearer authorization, or direct file URLs                                          | Human Product, security/privacy, architecture, UI, and operations                                             |
| `RI-08` | How are team, employee, `poste`, individual, date, and establishment relevance represented?                                                                                      | Team sharing is directional; employee-context filters are proposed; Personnel owns employee and `poste` facts.                                            | Privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                                           | A Personnel projection, audience enum, employee self-service, or relevance as permission                          | Human Product, Personnel, data, privacy/security, and authorization                                           |
| `RI-09` | Which actors may read, create, edit, review, approve, publish, acknowledge, export, archive, delete, restore, or administer each family, and at which tenant scope?              | Only generic authenticated tenant context exists; no capability operations or grants exist.                                                               | Privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                                           | OWNER/MANAGER/STAFF mappings, route-based access, entitlement, system-role bypass, or organization sharing        | Human Product, Identity / Access, tenancy, security, and affected owners                                      |
| `RI-10` | What author, owner, reviewer, approver, publisher, delegation, conflict, and failure lifecycle applies?                                                                          | The roles are conceptually distinct; no operation or state exists.                                                                                        | Legal/privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW` where publication has claimed effect                | One actor from a generic role, self-approval, autosave, autonomous publication, or another module's grants        | Human Product, authorization/security, data, legal/privacy, and operations                                    |
| `RI-11` | What do viewed, opened, read, acknowledged, mandatory, accepted, approved, and signed mean, and what reminders or evidence exist?                                                | The detailed interactions are proposed; no state or event exists.                                                                                         | Legal/privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                                     | Synonyms, mandatory-reading policy, legal proof, non-repudiation, escalation, or signature                        | Human Product, legal/privacy/security, data, UX/accessibility, and operations                                 |
| `RI-12` | What categories, tags, filters, folder depth, search, ordering, language, and discovery behavior apply?                                                                          | Library organization and search are proposed only.                                                                                                        | Privacy/security `UNVERIFIED`; copyright may apply to surfaced content                                        | Taxonomy enums, global search, indexing provider, ranking, or cross-tenant discovery                              | Human Product, information architecture, data, privacy/security, and accessibility                            |
| `RI-13` | May resources reference or create task models, routines, or daily tasks, and which owner may mutate what?                                                                        | Tâches du jour preserves separate task ownership; no projection or write-back exists.                                                                     | Legal/privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW` where work instructions or evidence are claimed     | Procedure-to-task generation, completion write-back, task edits to procedures, or shared lifecycle                | Human Product for Ressources internes and Tâches du jour, architecture/data, and external reviewers           |
| `RI-14` | What minimized Today projection, states, freshness, links, permission composition, and source actions apply?                                                                     | Today approves the future information family but has no integration.                                                                                      | Privacy/security `REQUIRES_CURRENT_EXTERNAL_REVIEW` for employee-targeted content                             | Today ownership, universal visibility, priority, acknowledgment, or write-back                                    | Human Product for both owners, architecture, authorization, privacy/security, and operations                  |
| `RI-15` | What references or projections connect resources with Personnel, Formalités, or Documents, and where do official and signed artifacts live?                                      | Current owners are separate and no cross-contract exists.                                                                                                 | Employment/legal/privacy/security/retention `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                | Dossier write-back, draft/source handoff, signed-artifact ownership by Resources, or shared storage               | Human Product for all owners, legal/privacy/security, data architecture, and operations                       |
| `RI-16` | Can procedures relate to Compliance requirements, controls, evidence, attestations, or audits, and through what contract?                                                        | Conformité is separate and unmigrated; no projection exists.                                                                                              | Qualified current legal/compliance/privacy/security review required                                           | That a procedure is current law, a control, proof, compliance status, or auditable evidence                       | Human Product for both owners plus qualified legal/compliance, data, security, and operations                 |
| `RI-17` | What boundary and projections apply among internal resources, Restaurant Knowledge, Marketing, Website, social channels, and public publication?                                 | Current semantic owners are separate; no consumer contract exists.                                                                                        | Legal/privacy/security/copyright/provider review required for external/public use                             | Copying, automatic learning, public visibility, SEO use, campaign use, publication, or write-back                 | Human Product for every owner, architecture/data, legal/privacy/security/copyright, provider, and operations  |
| `RI-18` | Is AI assistance used, and if so what provider, inputs, prompt/retrieval, Human-review, output, attribution, data handling, and failure model apply?                             | Human-corrected AI authoring is proposed only; no implementation exists.                                                                                  | Provider/legal/privacy/security/copyright/operations `REQUIRES_CURRENT_EXTERNAL_REVIEW`                       | Provider/model, embeddings, training, autonomous canonical write, silent publication, or factual/legal validation | Human Product, AI/provider, architecture, legal/privacy/security/copyright, and operations                    |
| `RI-19` | What version, effective-date, history, audit, retention, deletion, restore, legal-hold, data-rights, and analytics rules apply per family?                                       | No persistence, lifecycle, or policy exists; procedure versioning is proposed.                                                                            | Legal/privacy/security/copyright/operations `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                | Event sourcing, immutable audit, retention period, soft delete, renewed acknowledgment, or analytics              | Human Product, data, legal/privacy/security/copyright, and operations                                         |
| `RI-20` | What page scope, responsive/accessibility behavior, states, page pack, QA, environment enablement, deployment, support, monitoring, recovery, and release evidence are required? | Only shared placeholder/navigation evidence exists; environment is not enabled and readiness is not assessed.                                             | All applicable external gates remain open                                                                     | That docs, typecheck, a route, future Browser QA, or deployment alone proves readiness or authorization           | Human Product, UI/accessibility, engineering, security, operations, external reviewers, and release authority |

`HUMAN_DECISIONS_REQUIRED` is **20**. A coding agent may not resolve these
packets autonomously.

## Reconciliation accounting and conflict disposition

The counting unit is one grouped material claim or decision packet assigned one
primary disposition. Human-current items, implementation groups, absent
approved behavior, proposal families, decision packets, and superseded legacy
implementation positions are counted separately.

| Disposition               | Count | Counted material                                                                                                                   |
| ------------------------- | ----: | ---------------------------------------------------------------------------------------------------------------------------------- |
| `CONFIRMED`               |     8 | The eight Human-current items in this home                                                                                         |
| `IMPLEMENTED`             |     2 | Canonical route/navigation/authenticated shell; shared placeholder and navigation assertions                                       |
| `DECIDED_NOT_IMPLEMENTED` |     7 | Four included content families, two qualitative experience directions, and external-hosted video direction                         |
| `PROPOSED`                |    13 | The thirteen exact proposal families preserved above                                                                               |
| `UNRESOLVED`              |    20 | `RI-01` through `RI-20`                                                                                                            |
| `CONFLICT`                |     0 | Ten apparent tensions resolve through separate owners, authority axes, or open decisions rather than conflicting current authority |
| `OBSOLETE`                |     1 | The legacy implementation-`UNKNOWN` position is superseded by current repository evidence of a placeholder-only surface            |

The apparent tensions reconcile as follows:

1. Fixed high-level perimeter and detailed proposals coexist because the Human
   fixed the family boundary without item-by-item approval.
2. Procedure ownership and task ownership remain separate; any link is open.
3. `Fiche de poste` inclusion is settled while its canonical owner is not.
4. Internal documents and Formalités/Documents artifacts are different scopes.
5. Announcement publication and notification delivery are different operations.
6. Read acknowledgment and legal evidence are different authority questions.
7. External-hosted video direction does not select the detailed YouTube design.
8. Internal operational resources and Restaurant Knowledge have separate
   semantic owners.
9. Procedure content and Compliance evidence have different legal and Product
   meanings.
10. Organization-shared and establishment-owned content are alternative open
    tenancy models, not current contradictory implementations.

No genuine current-authority conflict was identified or auto-resolved.

## Completed-migration and separate-scope safety

This reconciliation does not reopen or modify Aujourd'hui (`HD-01` through
`HD-17`, `TODAY-01` through `TODAY-17`), Tâches du jour (`TJD-01` through
`TJD-15`), Reservations (`RES-01` through `RES-22`), Salariés (`SAL-01`
through `SAL-11`), Planning (`PLAN-01` through `PLAN-14`), Pointage,
Formalités (`FORM-01` through `FORM-08`), General Information / Restaurant
Knowledge (`RK-01` through `RK-08`), Carte & menus (`CM-01` through `CM-18`),
Fiches techniques (`FT-01` through `FT-19`), Inventaire (`INV-01` through
`INV-18`), Mouvements de stock (`MDS-01` through `MDS-18`), Fournisseurs
(`FOU-01` through `FOU-18`), Avis / Reputation, or Satisfaction.

Conformité, Marketing, Website / Site Agent, POS, Display, Notifications,
Paramètres, Identity / Access, payment/accounting, and every other Page Chat
scope remain separate and unmigrated by this work. No generic knowledge base,
document-management system, learning-management system, or intranet platform
is created.

## Discovery and fresh-agent acceptance input

A repository-only agent should discover this scope through:

1. [`docs/README.md`](../../README.md);
2. [`docs/PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
3. [`docs/MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md);
4. this Ressources internes home;
5. the [Authority Model](../../AUTHORITY_MODEL.md), [Lifecycle Status
   Model](../../LIFECYCLE_STATUS_MODEL.md), [Tenancy](../../architecture/TENANCY.md),
   and [Identity / Access](../identity-access/README.md);
6. the current route, shared placeholder, navigation, and navigation test linked
   above;
7. the [Personnel](../personnel/README.md), [Tâches du
   jour](../daily-tasks/README.md), and [Today](../today/README.md) boundaries,
   plus Formalités/Documents material in the Personnel home;
8. the [General Information / Restaurant Knowledge](../establishment/general-information/README.md),
   separate Conformité placeholder, and Marketing/public boundaries;
9. [`CURRENT_STATE.md`](../../CURRENT_STATE.md); and
10. [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history, the legacy extract, or the reconciliation report, a
repository-only agent can recover the eight Human-current items, thirteen
unapproved proposal families, placeholder-only implementation, concept and
owner distinctions, absence of contracts and write-backs, all twenty decision
packets, external-review and readiness limits, protected completed migrations,
and the completed scope-bound authority cutover. The accepted repository-only
report records zero material knowledge gaps and zero genuine conflicts.

## Agent interpretation rules

1. Do not infer detailed approval from the fixed-perimeter statement.
2. Do not turn proposal examples into fields, enums, contracts, providers, or
   Product requirements.
3. Do not infer authorization from route, navigation, generic tenant context,
   role names, audience, relevance, or another module's grants.
4. Keep announcements distinct from notifications and procedures distinct from
   tasks and Compliance evidence.
5. Keep `fiche de poste`, Personnel `poste`, employment documents, task models,
   and daily tasks distinct.
6. Keep internal documents distinct from Formalités drafts and signed
   Documents artifacts.
7. Keep external links, embedded external media, and YUTA-hosted files distinct.
8. Keep viewed, read, acknowledged, accepted, approved, and signed distinct.
9. Do not infer organization sharing, establishment inheritance, storage,
   history, retention, deletion, provider, public publication, AI, or production
   readiness.
10. Apply the Authority Model and route unresolved Product, ownership,
    authorization, provider, legal, privacy, security, copyright, and release
    questions to the Human authorities named above.

## Status

Status: APPROVED — KNOWLEDGE MIGRATION COMPLETE; REPOSITORY CANONICAL;
PAGE CHAT LEGACY EVIDENCE ONLY
