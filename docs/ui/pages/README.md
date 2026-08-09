# YUTA UI Page Packages

Status: Current

Visibility: Engineering

Last updated: 2026-08-09

Page packages under this directory may target any YUTA frontend application.
Every package identifies its application, real route or screen, runtime
boundary, current implementation status, and application-specific rules in its
`README.md`.

Current Backoffice packages remain in their stable folders. Do not rename them
merely because UI governance now applies project-wide.

Current packages:

- `hours-services/` — integrated Backoffice route `/etablissement/horaires-services`.
- `establishment-general-information/` — integrated establishment profile editor
  at `/etablissement/informations-generales`.
- `today/` — integrated authenticated Backoffice dashboard at `/aujourdhui`.
- `pos-management-printing/` — Phase 0 inventory for the existing local POS
  device-coupled screen at `/management/printing`; design approval is pending.

Every package follows `../PAGE_PACK_PROTOCOL.md`.

For new packages, choose a globally unambiguous slug. When route vocabulary
could collide across applications, use an application or feature qualifier
such as `pos-management` or `pos-order-entry`.

Every package also follows `../YUTA_FRONTEND_RULES.md`, the nearest application
`AGENTS.md`, and application-specific UI rules when present.

Do not add flat page specifications directly under `docs/ui/pages/`.

Do not create parallel `v2`, `v3`, `new`, `final`, or `latest` directories.
Update the canonical page package in place.
