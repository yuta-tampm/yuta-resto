# POS Management Establishment — Product Scope

Status: Phase 0 draft awaiting product approval

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

This describes the requested scope, not implemented behavior. The persistence,
contract, permissions, validation, and receipt payload changes remain proposals.

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

## Decisions requiring approval

1. Dedicated profile singleton versus broader local-installation singleton.
2. Exact normalization and validation: trim, minimum, maximum, line breaks,
   control characters, Unicode/French accents, and whitespace-only input.
3. Whether admin and manager may both edit, or manager is read-only/forbidden.
4. Optimistic revision/`updatedAt` contract and stale-write recovery.
5. Audit/history requirement, actor identity, reason, retention, and visibility.
6. Whether clearing a configured name is allowed and whether it needs confirmation.
7. Rename confirmation and copy explaining that old receipts do not change.
8. Receipt payload field optionality, versioning, and exact snapshot point.
9. Whether later consumers require separate approval (recommended: yes).
10. Confirmation that the first slice is non-legal and non-fiscal.

## Navigation proposal

After approval, add an available `Établissement` module card on `/management`
that links to `/management/establishment`. Reuse the current module-card pattern.
Do not enable or otherwise change `Rapports locaux`.

## Relationships

- `/management`: containing navigation and approved shell.
- `/management/login`: local admin/manager session entry.
- `/orders/[orderId]`: deliberate paid non-fiscal receipt command.
- `/management/printing`: immutable local queue, retry, and reprint visibility.
- receipt preview tooling: read-only production-payload/renderer verification.
