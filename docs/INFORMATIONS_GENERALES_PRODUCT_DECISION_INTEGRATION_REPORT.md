# Informations generales Product Decision Integration Report

Visibility: Engineering

Owner: YUTA product and engineering

Report date: 2026-08-30

## 1. Approved decisions integrated

The integration records `Informations generales` as a composed Establishment
page containing two independently bounded capabilities:

1. **Establishment Profile** — its approved ownership, permissions, and
   lifecycle remain unchanged.
2. **Restaurant Knowledge** — a newly approved Product Intent capability in the
   Establishment product/navigation domain, with a required separate data and
   permission boundary and no current implementation.

The approved Restaurant Knowledge families are concept/history,
cuisine/know-how, customer experience, team/culture, communication identity,
and validated restaurant knowledge. Gradual enrichment, direct operator input,
and mandatory human validation before suggested content becomes validated
knowledge are also recorded.

The one-datum/one-canonical-owner/multiple-consumers invariant is retained.
Page composition does not transfer source-module data or make the page a single
data owner.

## 2. Canonical page path

Created:

`docs/features/establishment/general-information/README.md`

It is the page-level Product Knowledge home. It does not replace
`docs/features/establishment/README.md`, which remains the canonical module
home.

## 3. Decision record

Created the next verified decision number:

`docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md`

ADR-007 is `Accepted` with Product Decision `APPROVED`. It records the composed
page, unchanged ADR-006 profile boundary, separate Restaurant Knowledge
boundary, source-ownership invariant, and excluded/unresolved scope.

## 4. Routing and authority updates

Updated only the necessary current documentation routers and authorities:

- `docs/features/establishment/README.md` routes to the page home and records
  the separate capability without changing the profile lifecycle;
- `docs/PRODUCT_KNOWLEDGE.md` routes Establishment page questions to ADR-007 and
  the page-level home;
- `docs/MODULE_REGISTRY.md` adds a separate Restaurant Knowledge capability
  row; and
- `docs/README.md` indexes the new current page home and ADR-007.

The Product-discussion source and prior integration review remain in place as
provenance/reconciliation evidence. They were not promoted by location,
renamed, moved, archived, or deleted.

## 5. Lifecycle result

| Capability            | Product Decision | Implementation | Environment   | Production Readiness | External Dependency | Review Marker  |
| --------------------- | ---------------- | -------------- | ------------- | -------------------- | ------------------- | -------------- |
| Establishment Profile | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED`  | `NOT_READY`          | `NOT_ASSESSED`      | `OK`           |
| Restaurant Knowledge  | `APPROVED`       | `NOT_STARTED`  | `NOT_ENABLED` | `NOT_ASSESSED`       | `NOT_ASSESSED`      | `NEEDS REVIEW` |

The existing Establishment Profile row and all its lifecycle values remain
unchanged. Restaurant Knowledge uses `NOT_ASSESSED` for External Dependency
because provider and external-dependency requirements have not been selected
or evaluated; `NOT_APPLICABLE` is not supported by current evidence.

## 6. Remaining NEEDS REVIEW

- concrete Restaurant Knowledge schema, repository/table choice, API, field
  validation, and storage implementation;
- operation-level permissions beyond the approved READ and MANAGE operations,
  including validate, reject, classify, and administrative access;
- company/legal data ownership across Organization, Establishment, a possible
  employer/legal configuration, and Formalites;
- social-profile link ownership;
- detailed history, provenance, retention, source metadata, and audit model;
- automatic knowledge detection from reviews, comments, corrections, replies,
  or other modules;
- Marketing, Facebook, and Instagram consumer ownership/contracts; and
- any AI/provider, prompt, embedding, vector database, storage, job, model, or
  API decision.

## 7. OpenSpec readiness

The page's canonical Product Knowledge context is now integrated. Any future
analysis must read the Establishment module home, the page home, the relevant
Module Registry row, accepted decisions, and implementation evidence when
needed.

Subsequent Control Tower decisions establish Restaurant Knowledge as the
canonical owner of Concept and Histoire and their persistence/domain boundary.
The data is semantically establishment-scoped, with Organization as the
tenancy/access envelope; Establishment Profile owns neither datum. Concept and
Histoire are independently optional, an empty initial state is valid, and the
initial behavior permits manual input, view, and edit followed by one explicit
save for the complete slice, with no autosave. Dedicated READ and MANAGE
authorization is defined separately.

A resumed bounded implementation specification may select concrete schema,
repository/table, API, field validation, and storage implementation without
changing those Product decisions or inventing additional behavior.

No OpenSpec change, main spec, schema, configuration, or skill was created or
modified.

## 8. Recommended first pilot candidate

The approved Concept & histoire slice must remain a Restaurant Knowledge
capability and must not be implemented as an Establishment Profile
enhancement. It may proceed only through its separately reviewed change after
the authorization prerequisite is accepted. This report update does not resume
or implement that dependent change.

Status: APPROVED
