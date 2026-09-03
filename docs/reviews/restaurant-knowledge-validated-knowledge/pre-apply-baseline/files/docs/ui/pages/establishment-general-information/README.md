# Establishment general information

Status: Current implemented page package

Visibility: Engineering

Owner: YUTA product and engineering

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

Last updated: 2026-09-02

Route: `/etablissement/informations-generales`

Application: `apps/backoffice`

## Current status

The authenticated route is a composed establishment-scoped editor. The
existing Establishment Profile remains backed by canonical profile fields on
`establishments`; OWNER and MANAGER may edit it and STAFF remains read-only.
The separate Restaurant Knowledge `Concept & histoire`, `Cuisine &
savoir-faire`, `Expérience client`, `Équipe & culture` and `Identité de
communication` sections are backed by dedicated cloud tables and repository
operations, require Restaurant Knowledge READ to be visible, and require MANAGE
to edit or explicitly save. OWNER and MANAGER have both operations; STAFF
receives no Restaurant Knowledge access.

Concept and Histoire are independently optional, including a valid both-empty
state. The three Cuisine/savoir-faire, three Expérience client, three Équipe &
culture and three Identité de communication values are likewise independent
and optional, including a valid all-empty state for each slice. Each
browser-local slice has one explicit whole-slice save and no autosave. The
profile and all five Restaurant Knowledge sections retain separate forms,
actions and canonical data boundaries.

Weekly service periods are managed independently under
`/etablissement/horaires-services`.

General profile ownership includes identity, structured address, primary and
public contacts, website, description, logo and cover URLs, languages, service
modes, and public visibility. Booking settings retain booking-only rules,
welcome copy, and booking policy.

The migration copies legacy public contact, address, logo, and cover values from
`booking_settings` before removing those columns. Public booking continues to
read the canonical establishment profile and respects its visibility settings.

## Intentional reference deviations

- Media is edited as validated HTTP(S) URLs because no approved upload/storage
  lifecycle exists.
- Address verification is omitted because there is no approved geocoding
  provider.
- The preview is local and read-only; no separate public establishment-profile
  route is claimed.
- Completion is derived locally from current supported fields and is not stored.

## Authority

Read root and Backoffice instructions, current architecture and product docs,
the implemented schema/contracts/repositories,
`docs/ui/YUTA_FRONTEND_RULES.md`,
`docs/ui/BACKOFFICE_FRONTEND_RULES.md`, this package, then the visual reference.
The image controls hierarchy and visual direction only.

## Documents

- [`PRODUCT_SCOPE.md`](PRODUCT_SCOPE.md)
- [`UI_SPEC.md`](UI_SPEC.md)
- [`DATA_AND_INTERACTION_SPEC.md`](DATA_AND_INTERACTION_SPEC.md)
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md)
- [`ACCEPTANCE_CHECKLIST.md`](ACCEPTANCE_CHECKLIST.md)

## References

- [`references/establishment-general-information-desktop-reference.png`](references/establishment-general-information-desktop-reference.png)
- [`references/README.md`](references/README.md)
- [`../../references/yuta-shell-brand-reference.png`](../../references/yuta-shell-brand-reference.png)

## Prompt order

The prompts under `prompts/` remain the phased maintenance workflow. The route
is `EXISTING_PAGE`; fixture replacement is forbidden.

## Stop conditions

Stop for approval before adding a storage/geocoding provider, public profile
route, new service-mode value, Restaurant Knowledge shared/API contract,
Product content-validation rule, unapproved additional knowledge section, or
changing profile/knowledge ownership or role policy.
