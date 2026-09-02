# Change Analysis

## Scope and Change Type

Change này bổ sung một behavioral capability mới tại
`restaurant-knowledge/customer-experience` cho page hiện có
`/etablissement/informations-generales`. Bounded slice gồm đúng ba descriptive
knowledge values:

1. `Expérience souhaitée`;
2. `Accueil & service`;
3. `Attention particulière au client`.

Đây là change ảnh hưởng UI, tenant-owned cloud data và authorization
consumption. Nó không thay đổi authorization contract, tenancy boundary,
canonical ownership, runtime ownership hay module contract hiện có. Change có
thể dẫn tới một persistence decision trong Design, nhưng Analysis không chọn
schema, table, repository representation, API hoặc validation.

Phân loại cross-module impact: `PAGE_LOCAL`. Reservations, Reputation, Today,
Personnel/Gestion équipe, POS/orders và Marketing không phải source, consumer
hoặc dependency của initial slice.

## Sources Consulted

### Repository và workflow authority

- [`AGENTS.md`](../../../AGENTS.md)
- [`apps/backoffice/AGENTS.md`](../../../apps/backoffice/AGENTS.md)
- [`packages/db-cloud/AGENTS.md`](../../../packages/db-cloud/AGENTS.md)
- [`docs/README.md`](../../../docs/README.md)
- [`docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md)
- [`docs/AUTHORITY_MODEL.md`](../../../docs/AUTHORITY_MODEL.md)
- [OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md)
- [OpenSpec normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)

### Product, lifecycle và durable boundaries

- [Establishment Product Knowledge](../../../docs/features/establishment/README.md)
- [`Informations générales` Product Knowledge](../../../docs/features/establishment/general-information/README.md)
- [ADR-007](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)
- [Module Registry](../../../docs/MODULE_REGISTRY.md)
- [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md)
- [Tenancy architecture](../../../docs/architecture/TENANCY.md)
- [Authentication architecture](../../../docs/architecture/AUTHENTICATION.md)
- [Identity and membership architecture](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md)
- [Database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md)

### Normative behavior và UI sources

- [Restaurant Knowledge authorization spec](../../../openspec/specs/authorization/restaurant-knowledge/spec.md)
- [Concept/Histoire spec](../../../openspec/specs/restaurant-knowledge/concept-history/spec.md)
- [Cuisine/savoir-faire spec](../../../openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md)
- [`Informations générales` page pack](../../../docs/ui/pages/establishment-general-information/README.md)
- [Page Product Scope](../../../docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md)
- [Page Data and Interaction Spec](../../../docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md)
- [Page UI Spec](../../../docs/ui/pages/establishment-general-information/UI_SPEC.md)
- [Page Acceptance Checklist](../../../docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md)

### Implemented State evidence

- Current page, loaders and server actions under
  `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/`
- `apps/backoffice/src/server/auth/permissions.ts`
- `packages/db-cloud/src/schema/restaurant-knowledge.ts`
- `packages/db-cloud/src/restaurant-knowledge-repository.ts`
- Restaurant Knowledge permission, loader, action, form/model and repository
  tests under `apps/backoffice/test/` and `packages/db-cloud/test/`

## Authority and Product Decision

ADR-007 approves `customer experience` as an initial Restaurant Knowledge
family and keeps Restaurant Knowledge separate from Establishment Profile.
The current page-level approved Product decision supplied for this bounded
change resolves the precise initial behavior and three-value meaning without
adding operational data semantics.

Accepted boundaries:

- Restaurant Knowledge is canonical owner of the three descriptive values and
  their persistence/domain boundary.
- Semantic scope is one establishment. Organization remains the tenancy/access
  envelope, not semantic owner.
- Establishment Profile owns none of these values and its permissions are not
  inherited.
- `restaurant-knowledge.read` controls view;
  `restaurant-knowledge.manage` controls edit and explicit save.
- OWNER and MANAGER receive READ + MANAGE; STAFF receives no Restaurant
  Knowledge access by default.
- The three values are independent and optional; all-empty is valid.
- Input is manual, with one whole-slice explicit save and no autosave.
- No required content, limit, format, enum, taxonomy, checklist, scoring,
  structured service category or operational workflow is approved.

The approved brief does not change any durable boundary established by ADR-007,
the authorization normative spec or tenancy architecture.

## Current Implemented State

The current workspace snapshot implements two separate Restaurant Knowledge
slices on the composed page:

- Concept/Histoire;
- Cuisine/savoir-faire.

Each current slice has its own page-local model/form, READ-gated loader,
MANAGE-gated save action and Restaurant Knowledge repository operations. The
current repository functions use trusted `organizationId` and
`establishmentId`; missing persistence projects to a valid empty state. The
forms keep drafts in browser state until one explicit submit. Focused tests
cover OWNER/MANAGER access, STAFF denial, Profile non-inheritance, empty states,
whole-slice save and separation between the two existing slices.

The accepted authorization implementation defines two distinct typed
operations, maps both to OWNER/MANAGER, denies STAFF, public/service actors and
system-role bypass, and does not reuse Profile permissions.

A scoped source scan of the existing Restaurant Knowledge loader, models,
forms, repository and schema found no imports or references that make
Reservations, Reputation/reviews, Today, Personnel, POS/Site Agent,
Marketing, providers, embeddings or vector processing a dependency.

`Expérience client` itself is not implemented. No current schema field,
repository operation, loader, action, form or test represents its three
values. The current route composes only Profile, Concept/Histoire and
Cuisine/savoir-faire.

Repository-state caveat: HEAD provenance at analysis time is
`01e6ca74186f5cda389f5ca8c0700274b29d18d0`. The completed
Cuisine/savoir-faire implementation, normative spec and archive are present in
the shared working tree but have not been committed into that HEAD. They are
preserved as pre-existing work and are not modified by Gate 1. This evidence
does not prove deployment or environment enablement.

## Affected Boundaries

### Runtime and page ownership

- Runtime owner remains `apps/backoffice` for the authenticated page.
- The page remains composed; route placement does not merge Profile and
  Restaurant Knowledge ownership.
- No public runtime, POS/Site Agent or Display behavior is affected.

### Data ownership

- Restaurant Knowledge owns the new descriptive values and their domain/
  persistence boundary.
- Establishment Profile, Reservations, Reputation, Today, Personnel and POS do
  not own or supply these values.
- Technical persistence representation remains a Design decision. Existing
  slices are compatibility evidence, not an instruction to copy their table or
  form structure mechanically.

### Tenancy and authorization

- The server-derived active user, organization, establishment and matching
  membership validation remains unchanged and fail-closed.
- Establishment-owned cloud access continues to require both organization and
  establishment scope.
- READ/MANAGE are consumed unchanged; no permission, role, principal,
  section-specific tier or admin/support bypass is needed.

### Cross-module relationships

- **Reservations:** no reservation record, guest preference, table preference,
  special request, reservation rule or synchronization is read or written.
- **Reputation:** no review/comment/feedback/provider data is read, modified or
  used to infer knowledge.
- **Today:** no card, alert, anomaly, task or required consumer relationship is
  created.
- **Personnel/Gestion équipe:** no employee procedure, training workflow,
  checklist, task assignment or Personnel datum is created or changed.
- **POS/orders:** no local order, table, catalog or customer-behavior data is
  read or synchronized; cloud and POS boundaries remain separate.
- **External dependencies:** none are required for the approved manual slice.

The repository evidence supports integration inside the accepted Restaurant
Knowledge boundary without a shared contract, additional permission, changed
tenancy/canonical ownership or cross-runtime behavior.

## Lifecycle Baseline

The current Restaurant Knowledge lifecycle row remains:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

`PARTIAL` currently covers the implemented Concept/Histoire and
Cuisine/savoir-faire slices while `Expérience client` and other families remain
unimplemented. Proposal, Analysis, future Specs or implementation work SHALL
NOT automatically promote any lifecycle dimension.

## Requirement Readiness

Precise behavioral Specs can be written without a new Product or durable-boundary
decision. The approved scope identifies:

- the exact three values and their descriptive, non-operational meaning;
- ownership and establishment semantic scope;
- optionality and valid all-empty state;
- manual view/edit, one explicit whole-slice save and no autosave;
- accepted READ/MANAGE behavior and grant matrix;
- explicit non-relationships and exclusions.

No technical schema, repository/table, API, shared contract or Product
validation choice is required to state those observable requirements. Those
questions remain outside Specs or are Design-only when they do not change the
approved behavior.

Workflow conclusion: `READY_FOR_SPECS`.

## UI / UX Applicability

UI/UX is affected because the existing composed page will expose another
Restaurant Knowledge section. Current page-pack governance remains applicable:
the route is an `EXISTING_PAGE`; real loaders, authorization, tenant scope,
profile behavior and both existing knowledge slices must be preserved. Specs
may require the three labels, view/edit states and one explicit save, but SHALL
NOT infer layout, counters, validation, taxonomy or operational controls from
examples or visual references.

The current page pack does not yet describe `Expérience client`. Any page-pack
update belongs to the later approved implementation/documentation scope, not
Gate 1.

## Conflicts and Unknowns

### Requirement-level conflicts

Không có remaining requirement-level `CONFLICT` hoặc `NEEDS REVIEW`.

### Non-blocking documentation drift

- `docs/PRODUCT_KNOWLEDGE.md` still describes Restaurant Knowledge as
  not-started with ownership/permissions unresolved.
- The OpenSpec section of `docs/features/establishment/README.md` still says
  the Cuisine/savoir-faire delta is not normative and one interpretation rule
  still says OpenSpec is not currently normative for Establishment.

These are `CONFLICT` findings for current documentation/Implemented-State or
normativity routing, because the more specific approved page Product Knowledge,
Module Registry, current code and three normative main specs show the accepted
current state. They do not change or obscure the requirements of this new
slice, so they do not block Specs. They require bounded documentation
correction later; this Analysis does not edit those authority sources.

### Design-only unknowns

- Exact persistence shape/table/repository representation.
- Exact page-local component and server-boundary composition.
- Migration and rollback mechanics if persistence requires a schema change.

These choices must preserve the approved boundaries. If Design discovers a
need for a shared contract, new permission, changed tenant semantics, changed
canonical ownership, any prohibited module dependency or cross-runtime
behavior, the change must stop and return to review.

## Analysis Conclusion

`READY_FOR_SPECS`

The bounded capability `restaurant-knowledge/customer-experience` may proceed
to delta Specs after explicit Gate 1 approval. Specs must remain limited to the
three approved descriptive values, manual view/edit, independent optionality,
valid all-empty state, one explicit whole-slice save, no autosave, current
READ/MANAGE authorization and explicit cross-module exclusions.

This is a behavior-changing path and SHALL NOT use `skip_specs: true`. No
Specs, Design, Tasks or implementation are authorized before Gate 1 approval.
