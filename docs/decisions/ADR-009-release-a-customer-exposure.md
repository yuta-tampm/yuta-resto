# ADR-009: Select Backoffice customer exposure per server instance

Status: Accepted

Visibility: Engineering

Date: 2026-10-01

Decision owners: YUTA product and engineering

Decision source: The current user chose "Chốt profile A cho instance khách
hàng; giữ chế độ nội bộ riêng" for
`release-a-customer-exposure-foundation`, with build/test scope and no
staging/production activation. The [Proposal requirement baseline](../../openspec/changes/release-a-customer-exposure-foundation/proposal.md#requirement_baseline)
and [Gate 1 decision record](../reviews/release-a-customer-exposure-foundation/01-analysis-review.md#current-candidate-3-and-delegation)
attribute that choice. [RR-01–RR-03](../PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions)
provide the accepted release-specific Product baseline. The
[independent Sensitive Design review](../reviews/release-a-customer-exposure-foundation/02b-design-review.md#independent-approval-evidence)
approved the engineering Design for bounded Apply under `CODEX_ONLY`; it does
not approve customer readiness or activation.

## Context

The maintained Backoffice includes broader internal modules, prototypes and
development-only slices. Existing permission and entitlement checks alone do
not express the accepted five-surface Release A customer perimeter. Menu
filtering also cannot protect direct route, API or Server Action invocation.

## Decision

`apps/backoffice` owns a closed availability policy selected for the whole
server instance by `BACKOFFICE_EXPOSURE_PROFILE`. Its only values are
`internal` and `release-a`. Selection is server-only and request-boundary
validated with Zod; it is not tenant persistence, an entitlement, a browser
choice or a `NEXT_PUBLIC_*` setting. Unset development/test selection retains
internal behavior. Invalid selection in any environment, or unset production
selection, fails closed with safe unavailable `503` behavior. Validation is
lazy so building the application does not require a live database or a profile.

`release-a` exposes these existing slices, subject to their current trusted
session, membership, permission, entitlement and record-level guards:

- `/aujourdhui`: Google-only local attention and new-review summaries;
- `/visibilite-reputation/avis` and its permitted detail entry: scoped Google
  reads and existing manual draft, note and status operations;
- `/etablissement/informations-generales`: the basic Establishment Profile;
- `/parametres/integrations`: existing OWNER-only Google setup;
- `/parametres/utilisateurs-acces`: existing permitted membership management.

The root/basic-profile aliases and exact existing authentication, recovery,
Google OAuth and presentation paths have bounded exceptions in the app-owned
policy. Other hosted product routes, APIs and actions are unavailable,
including Booking, Satisfaction/Direct Feedback, Personnel, Formalités and
Pointage. Knowledge is unavailable even where its actions share the allowed
basic-profile path: no six-section Knowledge load or eight Knowledge mutation
is admitted. Availability is enforced at transport and invoked-capability
boundaries before protected reads or effects; safe recovery remains within
the permitted perimeter. It grants no additional permission or provider
authority. Independent public Booking and Feedback applications and local
runtime/database ownership remain separate.

For A, Reputation repositories enforce the server-derived Google source,
organization, establishment and actor scope before parent/child reads or
mutations. STAFF retains assigned-only access. Today attention, preview and
linked Avis queue use statuses `NEW`, `TO_PROCESS`, `DRAFTED` and `FOLLOW_UP`;
new means `NEW`. Pagination/preview limits never cap total counters. A local
`PUBLISHED` reply does not remove an otherwise active row from this local
queue and does not establish a remote reply. Booking, DIRECT and AI
projections are not loaded or serialized for A.

The foundation implements no Google importer, manual synchronization,
publisher or remote reconciliation. Draft Save remains draft persistence.
Token-free connector metadata supports OWNER setup or another role's operator
handoff; an empty bound inbox does not prove an import ran or succeeded.
Stored Google rows are usable within their scope without establishing provider
provenance or publication. Provider/privacy and operational acceptance remain
separate requirements.

`internal` retains the broader maintained modules and their existing guards,
development limitations and readiness boundaries. Switching profiles is an
operational exposure decision; failure must not automatically fall back to
internal. [Deployment](../operations/DEPLOYMENT.md#backoffice-instance-exposure)
owns any separately authorized activation or rollback. This decision changes
no schema, permission grants, lifecycle assignment or deployed topology.

## Alternatives considered

- Client-only hiding: does not deny deep links, APIs or action replay.
- Tenant entitlements or role mutations: mix availability with trusted
  authorization and create unnecessary persistence/ownership changes.
- Duplicate A routes or a generic feature-flag package: introduce competing
  application behavior beyond this bounded instance choice.

## Consequences

Customer exposure is explicit and consistent across navigation, direct entry,
data composition and invoked operations, while current domain ownership and
grants remain authoritative. Production Backoffice deployment now requires an
explicit profile. Internal availability is not production readiness; passing
checks, independent gate review or local QA do not authorize Release A launch.

## Follow-up

Bounded development observation, technical verification and Browser QA belong
to the existing change/review tree. Later importer/publication contracts,
provider/privacy acceptance and customer activation require their own scope
and authority; this ADR supplies none of those approvals.
