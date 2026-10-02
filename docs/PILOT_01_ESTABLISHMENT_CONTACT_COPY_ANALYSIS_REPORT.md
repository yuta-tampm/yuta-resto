# Pilot 01 — Establishment Contact Copy Analysis Report

## 1. Change name

`establishment-copy-primary-contact-to-public`

The change was created with the active project schema, `yuta-spec-driven`. Only `proposal.md` and `analysis.md` were produced inside the change.

## 2. Proposal summary

The proposal adds one explicit UI action to the existing Establishment Profile form. The action copies the current primary `phone` and `email` draft values to `publicPhone` and `publicEmail`, respectively. It is a one-time convenience action; the existing explicit save flow remains responsible for persistence.

The proposal explicitly excludes new database fields, ownership or permission changes, ongoing synchronization, visibility changes, company/legal data, Restaurant Knowledge, and external dependencies.

Because no normative main specs currently exist, the proposal declares `establishment-profile` as a new OpenSpec capability path for the existing Product capability. It does not create a new Product capability.

## 3. Authorities consulted

- [Establishment Product Knowledge](features/establishment/README.md)
- [Informations générales page Product Knowledge](features/establishment/general-information/README.md)
- [Module Registry](MODULE_REGISTRY.md)
- [Authority Model](AUTHORITY_MODEL.md)
- [Lifecycle Status Model](LIFECYCLE_STATUS_MODEL.md)
- [OpenSpec Normativity Policy](OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
- [ADR-006](decisions/ADR-006-cloud-establishment-profile-context.md) and [ADR-007](decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)
- [Current page pack](ui/pages/establishment-general-information/README.md), [Product Scope](ui/pages/establishment-general-information/PRODUCT_SCOPE.md), and [Data and Interaction Spec](ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md)
- Current Backoffice route/form/actions, contracts, cloud schema/repository, and relevant tests.

## 4. Current implementation findings

- The exact primary fields are `phone` and `email`; the exact public fields are `publicPhone` and `publicEmail`.
- Corresponding primary and public fields have compatible nullable validation and database shapes.
- The form already uses client-side draft state, dirty-state detection, and an explicit save action.
- Persistence already passes through contract validation, the `establishment.profile.manage` server permission, trusted organization-and-establishment scope, and the tenant-scoped cloud repository.
- `OWNER` and `MANAGER` can manage the profile; `STAFF` is read-only.
- No equivalent copy or same-as-primary behavior was found.
- Existing tests cover model behavior, permission roles, and tenant-scoped persistence, but not contact copying, dirty state after copying, or read-only availability of the new action.
- No new persistence shape, owner, provider, API, or cross-module dependency is required.

Repository evidence does not establish deployed behavior. The current Environment value remains `UNVERIFIED` and Production Readiness remains `NOT_READY`.

## 5. Conflicts / NEEDS REVIEW

No Product, ADR, ownership, permission, field-semantics, runtime, data, or security conflict was found.

No requirement-level `NEEDS REVIEW` item blocks specs. Detailed control presentation and test structure are deferrable design/task questions. Review and approval of the proposal and analysis remain required before starting specs; this report does not provide that approval.

## 6. Analysis conclusion

`READY_FOR_SPECS`

The proposed behavior is a precise, bounded enhancement of the approved Establishment Profile capability. It is a real behavior change and must not use `skip_specs: true`. All current lifecycle values remain unchanged.

## 7. Recommendation

Proceed to specs only after this proposal and analysis pass the current review gate. The future delta should remain limited to the `establishment-profile` capability and must preserve explicit save, validation, trusted authorization, ownership, visibility, and no-ongoing-sync constraints.

Status: PROPOSED FOR REVIEW
