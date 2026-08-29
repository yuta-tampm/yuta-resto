# YUTA Knowledge Audit

Status: Audit draft for review

Visibility: Engineering

Owner: YUTA product and engineering

Audit date: 2026-08-25

## Executive summary

YUTA has substantial and generally careful knowledge coverage, but it is not
yet normalized into a consistent Product Knowledge system. The strongest
qualities are the explicit separation of cloud, restaurant-local POS, and
standalone Display runtimes; server-trusted tenancy rules; feature documents
that distinguish implemented scope from future direction; and UI page packs
that preserve implementation evidence and approval gates.

The main problem is not a lack of documentation. It is fragmentation and
uneven authority. The repository contains 311 Markdown files under `docs/` at
audit time, of which 277 are under `docs/ui/`. Current behavior, product intent,
delivery history, design evidence, operational readiness, and future proposals
are sometimes present in the same document or repeated across several
documents. This makes it difficult for an agent to answer a simple question
without first deciding which status vocabulary and authority order applies.

Four high-confidence normalization issues should be reviewed first:

1. authority orders conflict between the audit task, `docs/README.md`,
   `docs/ui/README.md`, and `docs/architecture/DATA_MODEL.md`;
2. `docs/features/public-website/README.md` still assigns tenant-facing public
   feedback routes to `apps/web`, although ADR-004 and the code place them in
   `apps/feedback-web`;
3. `docs/CURRENT_STATE.md` describes the implemented development Formalités
   prototype and later also lists personnel formalities among planned empty
   surfaces;
4. `docs/ui/pages/README.md` and `docs/README.md` do not consistently reflect
   the current page-pack inventory and lifecycle states.

The code inspection supports the documented primary runtime boundaries. Seven
active applications and eight active shared packages have manifests. The old
`packages/db` has no tracked files and is not an active package. Public booking,
public feedback, Backoffice, POS, Site Agent, and Display routes exist in their
documented runtime families. The future `apps/platform-admin` does not exist,
as documented.

This audit therefore concludes **READY WITH QUESTIONS**. Normalization can
start after the authority model, lifecycle vocabulary, and treatment of
development-only personnel capabilities are approved. No documentation or code
was changed during the audit apart from the two outputs authorized by the task.

## Audit method and definitions

This report uses the following distinctions throughout:

- **Product Intent**: an approved or proposed statement about what YUTA should
  do. A document alone is not evidence that the behavior exists.
- **Implemented State**: behavior evidenced by current routes, contracts,
  schemas, repositories, tests, package manifests, or runtime code.
- **Unknown / Unverified**: a claim for which this bounded audit found
  insufficient or conflicting evidence.

Confidence means confidence in the audit conclusion, not production readiness:

- **High**: directly supported by matching authoritative documents and code, or
  by an explicit contradiction.
- **Medium**: supported by repository evidence, but the intended authority or
  semantic interpretation is not explicit.
- **Low**: preliminary signal requiring deeper domain or runtime validation.

The audit was read-only until creation of this report and
`docs/PRODUCT_KNOWLEDGE.md`. It did not run applications, mutate databases,
invoke providers, create OpenSpec changes, or attempt production verification.

## Sources reviewed

### Repository instructions and policy

- Root `AGENTS.md` and every nested `AGENTS.md` under `apps/` and `packages/`.
- `docs/README.md`, `docs/DOCUMENTATION_POLICY.md`,
  `docs/DEVELOPMENT_WORKFLOW.md`, and `docs/REPOSITORY_MAP.md`.
- The audit task at `docs/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md`.

### Documentation corpus

- All 311 Markdown files under `docs/` were included in a full-text inventory
  (approximately 2.6 million characters and 50,863 physical lines).
- All 270 PNG/JPG/WebP assets under `docs/` were inventoried by path and owning
  page pack. Their reference manifests were reviewed. Raster content was not
  treated as product, data, authorization, or implementation authority.
- All architecture, decision, feature, product, operations, UI-governance, UI
  page-index, and page-pack README sources were examined. High-risk and
  high-claim documents were inspected directly against code.
- The relative Markdown-link scan found no unresolved local link targets.

### Repository and code evidence

- Application manifests, Next.js `page.tsx` and `route.ts` inventory, relevant
  redirects, prototype/fixture markers, and selected runtime guards.
- Package manifests and workspace dependency declarations.
- Cloud, POS, and Display schema entry points.
- Relevant Site Agent, Backoffice, booking, feedback, public web, POS, and
  Display source structure and tests where needed to verify important claims.
- Git tracked/untracked state, including the untracked OpenSpec bootstrap and
  the absence of tracked files under the legacy `packages/db` path.

### OpenSpec state

- `openspec/config.yaml` only. It currently declares `schema: spec-driven` and
  Vietnamese artifacts while retaining OpenSpec structural headings and
  SHALL/MUST keywords in English.
- No `openspec/specs/` or `openspec/changes/` content exists at audit time.
- The entire `openspec/` directory and `.agents/` directory are untracked in the
  current worktree. This audit does not interpret them as approved repository
  Product Knowledge.

## Product/app map

| Runtime family      | Application           | Product intent                                                                                                                   | Implemented state evidence                                                                                                                                                                         | Conclusion                                                                                       | Confidence |
| ------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| Cloud/public        | `apps/web`            | Public YUTA marketing, legal, integration, SEO, and approved public tenant flows                                                 | Manifest and public marketing/legal routes exist. A public tenant API exists, but no direct-feedback form/API route exists here.                                                                   | Implemented public website; direct feedback is not owned here.                                   | High       |
| Cloud/authenticated | `apps/backoffice`     | Restaurant administration scoped to organizations and establishments, never platform-wide administration or local POS operations | Authenticated routes exist for Today, reservations, reputation, establishment settings, access, personnel, prototypes, and planned surfaces. Server auth/tenant code and cloud repositories exist. | Broad Backoffice shell with mixed integrated, prototype, development-only, and planned maturity. | High       |
| Cloud/public        | `apps/booking-web`    | Independent anonymous public booking application                                                                                 | Public booking pages and availability/create/detail/cancel APIs exist, plus health/readiness routes.                                                                                               | Phase 0/1 implementation exists; production readiness remains separately blocked.                | High       |
| Cloud/public        | `apps/feedback-web`   | Independent anonymous direct-feedback application                                                                                | Tenant-slug page and public feedback POST route exist; manifest depends on contracts, cloud DB, tenant, and UI.                                                                                    | Implemented direct-feedback runtime; production/external readiness is separate.                  | High       |
| Restaurant local    | `apps/yuta-pos`       | Fast local POS client for orders, kitchen, payments, printing, management, and reporting                                         | Service, order, payment, kitchen, management, health, and SSE proxy routes exist. Manifest has no database package dependency.                                                                     | Substantial integrated local client. It is not a cloud/public service capability.                | High       |
| Restaurant local    | `apps/site-agent`     | Sole POS API, persistence, transaction, realtime, printing, and device boundary                                                  | Manifest depends on contracts/core/db-pos; route and service structure exists.                                                                                                                     | Implemented local service boundary and runtime owner of db-pos.                                  | High       |
| Standalone local    | `apps/yuta-display`   | Independent signage administration and resilient playback                                                                        | Admin/display pages, upload/media APIs, and app-owned Display schema exist.                                                                                                                        | Implemented standalone local product.                                                            | High       |
| Reserved            | `apps/platform-admin` | Future platform-wide YUTA administration                                                                                         | No application directory or manifest exists.                                                                                                                                                       | Product intent only; correctly documented as not implemented.                                    | High       |

### Runtime and data relationships

The following relationship is consistently supported by ADRs, architecture,
manifests, and code:

```text
web / backoffice / booking-web / feedback-web
  -> server-side cloud boundary -> packages/db-cloud

yuta-pos -> HTTP/contracts -> site-agent -> packages/db-pos

yuta-display -> app-owned server persistence
```

POS operational data is intentionally not synchronized to cloud persistence.
Display persistence is separate from both cloud and POS. Browser code must not
receive database URLs, drivers, secrets, or trusted tenant scope.

**Sources:** `AGENTS.md`, ADR-001, ADR-003,
`docs/architecture/OVERVIEW.md`,
`docs/architecture/DATABASE_BOUNDARIES.md`, package manifests, schema entry
points. **Conclusion:** the primary runtime/data boundary is coherent in docs
and implementation structure. **Confidence: High.**

## Shared package map

| Package           | Knowledge role                                             | Implementation evidence                                                               | Confidence |
| ----------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| `@yuta/auth`      | Portable authentication primitives                         | Manifest, source, tests; no framework or DB dependency declared                       | High       |
| `@yuta/contracts` | Serialization-safe Zod transport boundaries                | Manifest, contract modules, tests                                                     | High       |
| `@yuta/core`      | Pure deterministic shared logic                            | Manifest, source, tests                                                               | High       |
| `@yuta/booking`   | Pure booking availability/capacity/state rules             | Manifest, source, tests; consumed by db-cloud booking repository                      | High       |
| `@yuta/tenant`    | Trusted cloud context and guards                           | Manifest, source, tests; consumed by Backoffice/db-cloud                              | High       |
| `@yuta/db-cloud`  | Cloud schemas, migrations, repositories, seeds             | Auth, tenancy, booking, reputation, personnel schema modules and repository tests     | High       |
| `@yuta/db-pos`    | Local POS schemas, migrations, repositories, seeds         | Local auth, catalog, combo, establishment, order, payment, printing schemas and tests | High       |
| `@yuta/ui`        | Shared business-neutral presentation primitives and tokens | Export catalog and component/token source                                             | High       |

The filesystem still contains an empty legacy `packages/db` directory tree and
ignored local residue such as `node_modules`/`.env.local`, but `git ls-files
packages/db` returns no tracked source and no active manifest was found.
**Conclusion:** it is not an active package and must not be treated as Product
Knowledge or implementation evidence. **Confidence: High.**

## Feature/module map

### Public website

- **Product Intent:** communicate YUTA as a modular restaurant-management
  suite while distinguishing pilot, planned, and implemented capabilities.
- **Implemented State:** marketing, solution, integration, legal, privacy,
  data-management, company, and contact routes exist in `apps/web`.
- **Unknown / Unverified:** production publication, legal-company completeness,
  Search Console, OAuth review, and production domain evidence were not
  verified by this audit.
- **Primary sources:** `docs/features/public-website/README.md`, `apps/web/src/app`.
- **Confidence:** High for route existence; Low for external production state.

### Public booking and Backoffice reservation administration

- **Product Intent:** direct mobile-first restaurant booking with trusted
  establishment resolution, capacity protection, token-based management, and
  restaurant administration.
- **Implemented State:** public availability/create/detail/cancel APIs;
  Backoffice list/detail/settings/service-period flows; cloud schema,
  repositories, domain logic, contracts, and guarded tests are present.
- **Not implemented / blocked:** provider email worker, production operational
  evidence, broader target features in the master specification, and several
  release gates remain open.
- **Primary sources:** public-booking `README.md`, `PRODUCT_SPEC.md`, `STATUS.md`,
  ADR-002, booking routes, `packages/booking`, db-cloud booking schema/repository.
- **Confidence:** High.

### Reputation, Google Business Profile, and direct feedback

- **Product Intent:** unified Google/direct feedback operations, connector,
  reviewed reply workflow, and later AI assistance without automatic
  publication.
- **Implemented State:** direct-feedback collection, persisted Backoffice
  inbox/mutations, authentication/tenant enforcement, OAuth credential and
  location-selection foundation are present.
- **Not implemented / blocked:** Google review synchronization, remote reply
  reconciliation/publication, AI provider service, broader incidents,
  analytics, jobs, and production approvals.
- **Primary sources:** reputation `README.md` and `STATUS.md`, ADR-004,
  feedback-web routes, Backoffice reputation routes, db-cloud reputation
  schema/repository.
- **Confidence:** High.

### Backoffice identity, tenancy, and access

- **Product Intent:** database-backed sessions, trusted membership-derived
  organization/establishment scope, role/permission checks, safe switching,
  and tenant-scoped user/access management.
- **Implemented State:** auth routes, session resolution, switching, membership
  administration, and persisted access-audit history code exist.
- **Primary sources:** authentication, tenancy, identity/membership, data model,
  access-management route and repository code.
- **Confidence:** High.

### Establishment profile, booking hours, and Today

- **Product Intent:** canonical establishment identity/profile, booking-owned
  service periods/settings, and a truthful current-day operational summary.
- **Implemented State:** the profile editor, hours/services route, Today
  dashboard, server loaders/actions, and cloud data sources exist.
- **Primary sources:** `docs/CURRENT_STATE.md`, corresponding UI page packs,
  Backoffice routes, db-cloud establishment/booking repositories.
- **Confidence:** High.

### Personnel, documents, register, Formalités, and extraction

- **Product Intent:** an OWNER-scoped personnel foundation that may later
  support controlled Formalités, signed documents, register evidence, and
  reviewed extraction, subject to legal/privacy/security/operations gates.
- **Implemented State:** employee dossiers and bounded mutations/history exist;
  local-development document and register slices exist; Formalités and
  extraction surfaces are development/fixture/prototype bounded and fail closed
  according to their runtime guards.
- **Not implemented / blocked:** production enablement, qualified legal
  templates, full durable Formalités lifecycle, generated contracts,
  production OCR/AI, signature, and required external gates.
- **Primary sources:** personnel sections in `CURRENT_STATE.md`, three personnel
  UI page packs, `PRODUCTION_READINESS.md`, Backoffice personnel routes and
  guards, db-cloud personnel schema/repositories.
- **Confidence:** High for repository-local implementation boundaries; Low for
  any legal/compliance conclusion.

### Backoffice fixture prototypes and planned surfaces

- **Product Intent:** explore or reserve future modules without implying
  persistence or product availability.
- **Implemented State:** room/table, stock, compliance, and creative surfaces
  contain explicit fixture/prototype evidence. Menu content, resources,
  technical sheets, planning, time tracking, daily tasks, marketing content,
  and subscription include planned-page routes.
- **Primary sources:** `CURRENT_STATE.md`, Backoffice fixture files,
  `PrototypeBackofficeNotice`, and `PlannedBackofficePage` usages.
- **Confidence:** High, except for the conflicting Formalités classification
  reported below.

### Restaurant-local POS

- **Product Intent:** local-first restaurant operation covering order entry,
  order items, kitchen, payments/splits, durable print jobs, local management,
  and bounded reports; no cloud synchronization or fiscal claim.
- **Implemented State:** all principal routes exist. Current product docs and
  page packs provide extensive evidence for the service-day, payment,
  snapshot, kitchen, print, local-auth, idempotency, and management boundaries.
- **Known gaps:** the payment and management-login routes lack dedicated page
  packs; physical printer acceptance and release-specific evidence remain
  environment-dependent; offline browser emergency mode/cloud sync remain
  deferred.
- **Primary sources:** `docs/products/pos/*`, POS UI page packs, POS/Site Agent
  routes, contracts, db-pos schema, tests.
- **Confidence:** High for structure and documented behavior; Medium for claims
  that require live hardware or deployed Luna evidence.

### Standalone Display

- **Product Intent:** upload/manage a playlist and continue playback through
  transient backend/database failure, using separate persistence.
- **Implemented State:** admin/display routes, media/upload APIs, and the
  app-owned `display_media` schema exist.
- **Knowledge gap:** there is no dedicated current product document comparable
  to the POS product set.
- **Primary sources:** Display `AGENTS.md`, repository map, current state,
  operations docs, Display code/schema.
- **Confidence:** High for implemented structure; Medium for complete product
  behavior because the knowledge is distributed.

## Documentation quality findings

### DQ-01 — Strong runtime and trust-boundary documentation

**Sources:** ADR-001 through ADR-004, architecture documents, root and nested
instructions, package manifests.  
**Conclusion:** Cloud/POS/Display ownership, server-only database access,
tenant trust, and public-versus-local product visibility are repeated
consistently and supported by code structure. This is a strong foundation for
normalization.  
**Confidence:** High.

### DQ-02 — The corpus is dominated by UI delivery evidence

**Sources:** full `docs/` inventory; `docs/ui/` contains 277 of 311 Markdown
files and all 18 current page-pack directories.  
**Conclusion:** Product intent, current UI behavior, implementation plans,
acceptance history, prompts, and screenshots are richly documented, but the
volume makes page packs difficult to use as a concise module-level Product
Knowledge source.  
**Confidence:** High.

### DQ-03 — Exact duplication exists in page-pack prompts

**Sources:** content-hash inventory found seven duplicate groups covering
template and page-pack phase prompts, with groups of two to five identical
files.  
**Conclusion:** Some duplication is deliberate packaging mechanics, but it
conflicts with the protocol statement “Do not copy shared rules into every page
package” unless the intended exception for executable phase prompts is made
explicit. It also increases drift risk.  
**Confidence:** High for duplication; Medium for whether it is undesirable.

### DQ-04 — Status vocabulary is fragmented

**Sources:** feature `Status: Current`, page-pack `Status`, `Package status`,
phase statuses, production-readiness vocabulary, and implementation matrices.  
**Conclusion:** “implemented”, “implemented locally”, “integrated”, “approved”,
“current runtime”, “production blocked”, and “not ready” describe different
dimensions but are often adjacent without a shared lifecycle model. Product
maturity, code existence, environment availability, and production approval
should be separate fields.  
**Confidence:** High.

### DQ-05 — `CURRENT_STATE.md` is accurate in many areas but overloaded

**Sources:** `docs/CURRENT_STATE.md`, `DOCUMENTATION_POLICY.md`, feature docs,
and personnel page packs.  
**Conclusion:** The current-state summary contains durable state plus a long
chronology of phases, waves, F03-F08 reconciliations, QA notes, and approval
history. This duplicates page packs and makes internal drift more likely. It is
still current authority under `docs/README.md`, so the risk is material.  
**Confidence:** High.

### DQ-06 — Feature documentation is uneven by module

**Sources:** docs directory map.  
**Conclusion:** Public booking, reputation, and POS have strong feature/product
homes. Display, Site Agent, Backoffice access, establishment, Today, and
personnel knowledge are primarily spread across architecture, current state,
operations, and UI packs. A future agent cannot use one consistent module
routing convention.  
**Confidence:** High.

## Docs ↔ code inconsistencies

### DC-01 — Public feedback is assigned to the wrong app in the website feature doc

**Sources:** `docs/features/public-website/README.md` lines 11-12; ADR-004;
`apps/feedback-web/src/app/[tenantSlug]/page.tsx` and its public POST route;
absence of equivalent routes under `apps/web/src/app`.  
**Conclusion:** The website document says `apps/web` serves tenant-facing public
feedback routes. The accepted decision and current code place that capability
in `apps/feedback-web`. The statement is outdated.  
**Confidence:** High.

### DC-02 — Booking-web dependency direction is overstated in the repository map

**Sources:** `docs/REPOSITORY_MAP.md`; `apps/booking-web/package.json`;
`packages/db-cloud/package.json`; db-cloud booking repository imports.  
**Conclusion:** The map draws `booking-web -> tenant / booking`, and the nested
instructions tell booking-web to use `@yuta/booking`. The app manifest does not
declare either package directly; the current direct consumer of both is
`@yuta/db-cloud`. This may be intended as a logical dependency rather than a
package dependency, but that distinction is undocumented.  
**Confidence:** Medium.

### DC-03 — Legacy `packages/db` exists only as local residue

**Sources:** filesystem inspection, `git ls-files packages/db`, active package
manifests, architecture checks documented in the repository.  
**Conclusion:** The docs correctly say the legacy package was removed from
tracked source. Empty directories and ignored local residue remain on disk, so
filesystem-only agents could misclassify it unless they check the manifest and
Git tracking state. This is not a tracked-code contradiction.  
**Confidence:** High.

### DC-04 — Major implementation claims otherwise align at structural level

**Sources:** route inventory, schema entry points, manifests, fixture markers,
runtime guards, and redirects.  
**Conclusion:** The audit found structural evidence for the principal claims in
`CURRENT_STATE.md`: canonical reservation/reputation routes, integrated Today
and establishment pages, personnel foundations, fixture prototypes, planned
surfaces, local POS workflows, and separate Display persistence. This does not
prove every behavioral or production claim, but no contrary structural
evidence was found beyond the findings listed here.  
**Confidence:** Medium to High, depending on module.

## Conflicts / ambiguities

### CA-01 — No single source-precedence model

**Sources and conflict:**

- the audit task says decisions → features → UI → architecture → code →
  current state → tasks for Product Knowledge;
- `docs/README.md` says current state → architecture → feature/product →
  operations → accepted decisions → code;
- `docs/ui/README.md` puts instructions first, then current
  state/architecture/product docs, then code, then page packs;
- `docs/architecture/DATA_MODEL.md` puts executable schemas first, then database
  boundaries/tenancy, current docs, ADRs, and older proposals.

**Conclusion:** These orders answer different questions—intent, implementation,
UI delivery, and executable data reality—but the distinction is not stated in
one place. An agent can reach different conclusions while following a valid
local rule.  
**Confidence:** High.

### CA-02 — Formalités has two maturity classifications in `CURRENT_STATE.md`

**Sources:** `docs/CURRENT_STATE.md` “Integrated personnel foundation” and
“Planned empty surfaces”; Formalités page pack and route code.  
**Conclusion:** The specific route has a development-bounded interactive and
connected-read prototype, while the broad planned list still includes
“personnel formalities.” It is unclear whether the planned label means the full
production capability or the route itself. The wording should not be resolved
by assumption.  
**Confidence:** High.

### CA-03 — Page-pack index lifecycle drift

**Sources:** `docs/ui/pages/README.md` and individual page-pack READMEs.  
**Conclusion:** The index calls Formalités a Phase 1 prototype while its pack
says Phase 4 is current runtime; it says printing and catalog design approval
is pending while their packs say implemented; and it describes combo design as
pending while the combo pack records a completed implemented extension but
still has `Package status: approved`. The base-page versus extension status is
not modeled clearly.  
**Confidence:** High.

### CA-04 — Main documentation index is not exhaustive for page packs

**Sources:** `docs/README.md` and the 18 directories under `docs/ui/pages/`.  
**Conclusion:** Eleven page packs are not linked directly from the main index:
`pos-kitchen`, `pos-management-catalog`, `pos-management-combos`,
`pos-management-establishment`, `pos-management-home`,
`pos-management-printing`, `pos-management-reports`, `pos-management-users`,
`pos-order-entry`, `pos-order-items`, and `pos-orders-home`. They are discoverable
through `docs/ui/pages/README.md`, but the main index does not say its page list
is selective.  
**Confidence:** High.

### CA-05 — OpenSpec has configuration but no approved knowledge artifacts

**Sources:** `openspec/config.yaml`, Git status, absence of `openspec/specs/`
and `openspec/changes/`.  
**Conclusion:** OpenSpec is bootstrapped but not yet integrated as a Product
Knowledge authority. The configuration is also untracked, so its intended
governance and review status are unknown.  
**Confidence:** High.

### CA-06 — Naming is inconsistent

**Sources:** document titles and product copy use `YUTA`, `YuTa`, and `YuTa
POS`.  
**Conclusion:** The canonical brand spelling for technical documentation and
product-facing text is not defined in one discoverable terminology source.  
**Confidence:** High for inconsistency; Low for the intended canonical form.

## Missing Product Knowledge

### MK-01 — Canonical glossary and bounded contexts

There is no concise glossary covering YUTA/YuTa, organization,
establishment, tenant context, restaurant user, local POS user, service day,
reservation versus order, feedback versus review, employee dossier, document,
register, and Formalités. Meanings can be inferred, but an agent should not have
to infer them.  
**Sources:** architecture, feature, product, and UI docs.  
**Conclusion:** missing normalized cross-product terminology.  
**Confidence:** High.

### MK-02 — One capability registry with separate maturity dimensions

No current source lists every capability with separate fields for product
approval, code state, data owner, runtime, environment availability,
production readiness, and primary knowledge source. `CURRENT_STATE.md` comes
closest but mixes prose, chronology, and status types.  
**Confidence:** High.

### MK-03 — Consistent module-level knowledge homes

Display, Site Agent, identity/access, establishment profile, Today, and
personnel lack the same feature-level structure used by public booking and
reputation. Personnel is especially rich in delivery detail but lacks a small
canonical product overview separate from UI wave history.  
**Confidence:** High.

### MK-04 — Cross-module dependency and ownership map

Dependency direction exists at application/package level, but the business
relationships are scattered: establishment profile feeds booking; service
periods feed public availability and Today; signed Documents and employee
dossiers feed future Formalités; feedback settings feed public feedback;
site-agent owns all POS mutations. A normalized module graph should name the
source of truth and allowed direction for each relationship.  
**Confidence:** High.

### MK-05 — Role/permission matrices by capability

Authorization rules exist, but they are distributed across authentication,
feature docs, page packs, code, and tests. There is no concise index from a
capability to its server-trusted role/permission source and denial behavior.  
**Confidence:** High.

### MK-06 — State and transition catalogs

Booking, reputation, POS, personnel, print, and readiness states are defined in
different formats. A normalized system needs a module-level pointer to the
authoritative state machine or enum plus transition owner, without copying
schema catalogs into general docs.  
**Confidence:** Medium.

### MK-07 — Environment and evidence semantics

“Implemented locally”, “development-only”, “production blocked”, “deployed”,
and “production ready” are not governed by one shared definition. This is
critical for personnel and provider-backed capabilities.  
**Confidence:** High.

### MK-08 — OpenSpec authority and lifecycle policy

Before custom workflow work, YUTA must decide when `openspec/specs/` becomes
normative, how it relates to current `docs/features`/`docs/products`, when a
change becomes current knowledge, how archived deltas are synchronized, and
whether generated artifacts may repeat or only link to existing knowledge.  
**Confidence:** High.

## Potentially outdated documents

| Source                                              | Potentially outdated content                                                                       | Evidence                                    | Confidence |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------- |
| `docs/features/public-website/README.md`            | Says `apps/web` serves public feedback routes                                                      | ADR-004 and current feedback-web routes     | High       |
| `docs/CURRENT_STATE.md`                             | Planned-empty list includes personnel formalities despite earlier current prototype description    | Same file, Formalités page pack, route code | High       |
| `docs/ui/pages/README.md`                           | Several page lifecycle descriptions lag individual pack status                                     | Individual pack READMEs                     | High       |
| `docs/README.md`                                    | UI page-pack list is incomplete or silently selective                                              | 18 page-pack directories versus linked list | High       |
| `docs/REPOSITORY_MAP.md`                            | Booking-web arrow may imply direct package dependencies that do not exist                          | Current manifests/imports                   | Medium     |
| Large personnel sections of `docs/CURRENT_STATE.md` | Chronological delivery narrative may duplicate newer page-pack detail and obscure current boundary | Page-pack/current-state comparison          | Medium     |

The broader target requirements in public-booking `PRODUCT_SPEC.md` and the
roadmap content in POS `OFFLINE_STRATEGY.md` are not classified as outdated
merely because they are not implemented. Those documents explicitly separate
future intent from current behavior.

## Recommendations for the next normalization step

1. **Approve a question-specific authority matrix.** Define separate orders for
   product intent, implemented behavior, executable data shape, UI delivery,
   and production readiness. Do not force one universal order to answer all
   questions.
2. **Approve a shared lifecycle vocabulary.** Keep at least these dimensions
   independent: product decision, implementation, integration/data backing,
   environment enablement, production readiness, and external dependency
   readiness.
3. **Reconcile only the high-confidence drift first.** Review the public-web
   feedback ownership statement, Formalités planned wording, page-pack index
   statuses, and main-index coverage before broader rewriting.
4. **Create a concise capability registry or module index.** Each row should
   point to—not duplicate—the product source, implementation evidence, data
   owner, role/permission source, operational source, and current status.
5. **Create module-level knowledge homes where missing.** Prioritize personnel,
   Display, Site Agent/local POS boundary, and Backoffice foundation modules.
   Preserve page packs as delivery/UX evidence rather than making them carry all
   module Product Knowledge.
6. **Add a glossary and relationship map.** Normalize terminology and identify
   source-of-truth relationships between establishment, booking, reputation,
   personnel, Formalités, Documents, POS, and Display.
7. **Define OpenSpec governance before custom schema work.** Decide how
   `openspec/specs/` references or supersedes current product documents, how
   changes represent deltas, and when applied/archived changes become current
   knowledge. Until then, OpenSpec artifacts should be treated as workflow
   proposals rather than repository truth.
8. **Normalize in small reviewed batches.** Suggested sequence: authority and
   vocabulary → product/app registry → cloud public modules → Backoffice
   foundation/personnel → local POS/Site Agent → Display → OpenSpec custom
   workflow.

## Readiness for Product Knowledge normalization

Status: READY WITH QUESTIONS

### Blocking questions

- Which authority order applies separately to Product Intent, Implemented
  State, executable schema/data shape, UI delivery, and production readiness?
- Should development-only personnel routes be cataloged as implemented
  capabilities, experimental capabilities, or both with separate dimensions?
- Are UI page packs Product Knowledge sources, delivery evidence, or a mixture
  that must be split during normalization?
- Is `docs/README.md` intended to enumerate every current document/page pack or
  only top-level entry points?
- What is the canonical brand and terminology spelling: `YUTA`, `YuTa`, or a
  context-dependent rule?
- When will `openspec/specs/` become normative, and what event makes an OpenSpec
  change part of current Product Knowledge?

### Recommended next step

- Review and approve this audit, then decide the authority matrix and shared
  lifecycle vocabulary before editing existing documentation or customizing
  the OpenSpec schema/workflow.
