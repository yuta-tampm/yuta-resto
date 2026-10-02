# ADR-007: Define Informations generales as a composed Establishment page

Status: Accepted

Date: 2026-08-30

Decision owners: YUTA

Decision type: Product

Product Decision: APPROVED

## Context

The current `/etablissement/informations-generales` route is an implemented
editor for the bounded Cloud Establishment Profile approved by ADR-006. Product
has also approved a separate Restaurant Knowledge capability for contextual
knowledge about the restaurant.

A page may compose more than one capability without becoming the owner of all
data displayed on that page. The two capabilities therefore need an explicit
boundary before Restaurant Knowledge is specified or implemented.

## Decision

Approve `Informations generales` as a composed page in the Establishment
product and navigation domain. It composes:

1. the existing Establishment Profile capability; and
2. the new Restaurant Knowledge capability.

The page is not a single data owner.

### Establishment Profile

ADR-006 remains authoritative for the Establishment Profile. This decision
does not change its scope, ownership, permissions, implementation, environment,
readiness, or external-dependency status.

### Restaurant Knowledge

Restaurant Knowledge is a new bounded capability in the Establishment domain
at product and navigation level. Its approved initial Product Intent covers:

- concept and history;
- cuisine and know-how;
- customer experience;
- team and culture;
- communication identity; and
- validated restaurant knowledge.

Restaurant Knowledge may be enriched gradually. A restaurant operator may add
knowledge directly. System- or AI-suggested content must not become validated
knowledge without human validation.

Before implementation, Restaurant Knowledge must have its own defined data
boundary, canonical owner, and operation-level permissions. It does not inherit
the Establishment Profile data owner or `establishment.profile.*` permissions
by page composition.

### Ownership invariant

One datum has one canonical owner and may have multiple consumers. Restaurant
Knowledge must not copy Booking, Personnel, menu/POS, Reputation, or other
source-module data into a parallel source of truth.

## Excluded and unresolved scope

This decision does not approve:

- company/legal fields or their owner, including legal name, legal form,
  SIREN/SIRET, VAT number, registered office, legal representative, or
  administrative legal contacts;
- automatic candidate detection from reviews, comments, corrections, replies,
  or other modules;
- a detailed history, provenance, retention, source-metadata, or audit model;
- Marketing, Facebook, or Instagram consumption contracts;
- ownership of social-profile links;
- an AI provider, prompt, embedding, vector database, storage, job, model, or
  API design;
- detailed Restaurant Knowledge roles or permissions; or
- a detailed schema, required fields, enums, limits, or validation rules.

These items remain `NEEDS REVIEW` and require separate approval where they
change a durable boundary or observable behavior.

## Consequences

### Positive

- The existing profile stays stable and independently authoritative.
- Restaurant Knowledge has approved Product Intent without being represented as
  implemented.
- Future specifications can target one capability without treating the page as
  a shared persistence boundary.
- Source-module ownership remains explicit.

### Negative

- Restaurant Knowledge cannot proceed to implementation specifications until
  its data owner/boundary, operation-level permissions, and initial data
  shape/behavior scope are resolved.
- Page composition does not remove the need for capability-specific loading,
  error, authorization, privacy, and readiness decisions.

## Follow-up

Resolve the Restaurant Knowledge data boundary, canonical owner,
operation-level permissions, and initial data shape/behavior scope through
Product, architecture, and security review before starting an implementation
specification.

## Supersedes

None.

## Superseded by

None.
