# POS Management Establishment — Product Scope

Status: Phase 4 first vertical slice approved and implemented

Visibility: Engineering

## User goal

Allow an authorized local POS manager to configure the restaurant name used for
operator display and, in the first approved downstream use, snapshot that name
onto newly created non-fiscal customer receipts.

## Proposed first vertical slice

- One local field: `displayName`.
- One protected local management read/edit flow.
- One local authoritative source owned by site-agent/db-pos.
- Snapshot the configured value when a new `customer_receipt` job is created.
- Omit the restaurant-name receipt line when no value is configured.
- Preserve old queued, failed, printed, retried, and reprinted payloads exactly.

This first vertical slice is implemented through the local POS runtime boundary.

## Current boundaries

The POS installation is single-site local infrastructure. No organization,
cloud establishment, membership, or cloud profile participates. The browser
uses a server-only site-agent client; site-agent alone accesses db-pos. Receipt
rendering and physical device I/O stay site-agent-owned.

## Out of scope

- legal name, trading-name/legal-name distinction, address, contacts;
- SIRET, SIREN, VAT number/rates, fiscal invoice or certified receipt behavior;
- cloud Backoffice establishment profile or POS/cloud synchronization;
- merchant onboarding, licensing, backups, multi-site identity;
- kitchen ticket, BAR ticket, POS header, PWA metadata, or public-display reuse;
- printer path/routing/settings changes;
- automatic receipt creation at payment;
- fabricated defaults such as `YUTA` or `Luna`.

## Approved first-slice decisions

1. Dedicated `pos_establishment_profiles` singleton with id `default`.
2. Trimmed Unicode/French accents, 1–80 characters, no control characters or blank value.
3. Active local admin and manager sessions may read and edit.
4. Integer revision CAS with 409 stale-write recovery.
5. No audit/history in this first slice.
6. Clearing is not allowed; unconfigured means no singleton row.
7. Rename saves directly; UI explains that old receipt snapshots do not change.
8. Optional compatible version-1 payload field captured during initial receipt creation.
9. Every later consumer requires separate approval.
10. The value is local operator identity only, never legal, fiscal, or cloud identity.

## Navigation proposal

The available `Établissement` module card on `/management` links to
`/management/establishment` and reuses the current module-card pattern.
Do not enable or otherwise change `Rapports locaux`.

## Relationships

- `/management`: containing navigation and approved shell.
- `/management/login`: local admin/manager session entry.
- `/orders/[orderId]`: deliberate paid non-fiscal receipt command.
- `/management/printing`: immutable local queue, retry, and reprint visibility.
- receipt preview tooling: read-only production-payload/renderer verification.
