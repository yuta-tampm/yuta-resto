# Satisfaction client — UI Specification

Status: Approved visual authority and verified as-built reference

Visibility: Engineering

## Authority and target

- Application: `apps/backoffice`
- Route: `/visibilite-reputation/satisfaction`
- Classification: `EXISTING_PAGE`
- Implementation class: `integrated`
- Shell mode: `REUSE_CURRENT_TARGET`

The approved Spec and Design for
`reputation-review-social-links-configuration` define behavior. Current code
and captures define the existing-page baseline. Images guide hierarchy,
proportions, spacing, density and tone only.

## Shared UI context

| Layer        | Reuse exactly                                                                | May adapt                                            | Excluded                                                    |
| ------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| YUTA global  | Geist typography, semantic tokens, `@yuta/ui`, `lucide-react`, visible focus | Route-local spacing and responsive composition       | Raw brand colors, new framework or duplicate primitive      |
| Backoffice   | Authenticated shell, top bar, sidebar/mobile menu, account and establishment | Main-content stacking at approved Backoffice widths  | Shell, navigation or account/session redesign               |
| Reputation   | Existing Satisfaction navigation and Direct Customer Feedback inbox          | An OWNER-only secondary settings section             | New dashboard, provider center or route                     |
| Current page | Header, metrics, filter/list/detail model and current actions                | Placement and density of the approved three-field UI | Replacing inbox, fixtures or changing current inbox actions |

## Current baseline

The route currently displays:

1. “Satisfaction client” heading and Direct Customer Feedback description;
2. five counters for total, new, without response, negative and incident;
3. search, status, rating and sort controls;
4. a paginated feedback list;
5. selected feedback detail and existing management/analysis/note sections;
6. the current authenticated Backoffice shell and establishment context.

At 1440 px the list and detail use a two-column work area. At 1024 px the
existing content becomes more compact and the detail falls below the visible
area. At 768 px the inbox stacks into a narrower main column. At 390 px the
mobile shell, stacked metrics and above-fold controls are visible; the current
long content continues below the fold. These observations remain baseline
facts. Final responsive QA for the implemented settings surface is recorded in
the change review evidence.

## Visual hierarchy

The Direct Customer Feedback inbox remains the primary page task. The new
“Liens d’avis et réseaux sociaux” section is secondary configuration for OWNER
only and must not visually replace metrics, list or detail.

The visual proposal:

- keep the existing page header and context;
- introduce one clearly titled settings surface using current card/form
  patterns;
- present Google, Facebook and Instagram with equal semantic weight;
- provide one primary action labelled “Enregistrer” for the entire slice;
- keep validation, conflict, unavailable and server errors adjacent to the
  affected settings surface;
- avoids implying provider connection, verification, synchronization or
  analytics;
- uses one stable semantic and visual order at every viewport: page header,
  metrics, existing Satisfaction inbox, then the compact settings card; and
- keeps the inbox reachable before secondary configuration without responsive
  CSS reordering or duplicate form instances.

This placement is the exact visual authority candidate. It must not be changed
during Phase 3B without returning to page-pack review.

## Content and copy

Required French labels and messages:

- Section: “Liens d’avis et réseaux sociaux”
- Fields: “Lien Google”, “Lien Facebook”, “Lien Instagram”
- Primary action: “Enregistrer”
- Missing settings row: “Configuration indisponible”
- Conflict: explain that settings changed and offer a reload of authoritative
  values; do not overwrite silently.
- Saved/no-change: short textual confirmation using the authoritative response.

Field help may explain that only approved HTTPS destinations are accepted. It
must not promise network verification, redirect resolution, Google Business
Profile discovery or legal/provider approval.

## Interaction density

This is a restaurant administration page, not a point-of-sale surface. Favor a
compact, scannable card with persistent field labels, readable helper/error
text and one unambiguous Save action. Preserve the current inbox density and do
not make the settings card dominate the page.

## Responsive behavior

Review at the Backoffice matrix: 1440, 1024, 768 and 390 px.

- 1440: keep the existing two-column list/detail inbox as the primary work area,
  then place one compact full-width settings card after it. Use one horizontal
  row for the three fields and align Save at the right edge.
- 1024: keep the existing inbox before settings. After the list/pagination,
  render Google at full width, Facebook and Instagram in a second two-column
  row, and align Save at the lower right. This avoids adding more above-fold
  pressure to the already wrapped metrics.
- 768: keep the inbox and pagination first, then the settings card. Stack all
  three fields vertically, keep long URLs and inline errors wrapping within the
  card, and align one Save at the lower right.
- 390: keep the mobile inbox and pagination first, then a single-column settings
  card. Stack all fields, use one full-width Save, and keep the card in normal
  document flow above the footer with no overlap.
- No fixed settings panel may cover the existing footer, list, detail or mobile
  navigation.

The semantic and DOM content order is identical at 1440, 1024, 768 and 390 px:
page header, metrics, existing Satisfaction inbox, then settings. The 1024, 768
and 390 proposal images intentionally show a downward-scrolled viewport with
the end of the inbox above the settings card. The baseline images remain the
authority for the top-of-page shell/header/metric composition.

## Visual state treatment

Every state uses the same card position and dimensions; state changes must not
reorder the inbox or move configuration into another surface.

| State                     | Required visual treatment                                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading                   | Keep the section heading; show three input-shaped skeletons and a disabled Save area with a section-level busy status.                                     |
| Empty                     | Render three labelled empty inputs. Do not persist or present a placeholder as a value. Save stays inactive until a valid draft differs from the baseline. |
| Populated                 | Render the three authoritative normalized values in the normal field arrangement for the viewport.                                                         |
| Dirty                     | Keep fields unchanged, enable the single Save, and show a restrained text cue “Modifications non enregistrées”.                                            |
| Invalid field             | Place a semantic danger message directly below the affected field, set the field invalid state, retain all values and focus the first invalid field.       |
| Saving                    | Disable all duplicate submission paths, retain visible values, show a small pending indicator and change the button text to “Enregistrement…”.             |
| Saved                     | Show a compact positive status row under the heading: “Liens enregistrés.” Replace the draft baseline only with authoritative returned values.             |
| No change                 | Show the neutral status “Aucune modification à enregistrer.” Do not imply a write or audit occurred.                                                       |
| Server error / retry      | Show a compact danger alert above the fields with generic text and a secondary “Réessayer” action; preserve the draft.                                     |
| Conflict / reload         | Show a warning alert above the fields: the settings changed elsewhere. Provide “Recharger les valeurs”; never overwrite silently.                          |
| Configuration unavailable | Keep the card title and three disabled empty fields, show “Configuration indisponible”, disable Save and provide only the approved reload/retry recovery.  |

Status text is route-local and never exposes the opaque token, tenant IDs,
audit/event IDs, actor IDs, internal revisions or rejected credentials.

## Accessibility

- Use visible labels linked to each URL input; placeholders are not labels.
- Preserve keyboard tab order and visible focus.
- Keep DOM order and visual order aligned for the major focusable regions at
  every viewport. Keyboard traversal must not jump between the inbox and a
  visually earlier or later settings region because of responsive CSS order.
- Render exactly one settings form instance; do not duplicate desktop and
  mobile forms to achieve breakpoint placement.
- Error and status messages must use text, not color alone, and be associated
  with the relevant field or section.
- While saving, expose pending/busy state and disable duplicate submission.
- On validation failure, focus the first invalid field while preserving all
  draft values.
- On conflict, provide a keyboard-operable reload action; do not overwrite the
  user's draft without explicit recovery.
- On `CONFIGURATION_UNAVAILABLE`, fields and Save are absent or disabled and
  retry/reload remains possible.

## Visual acceptance

Reference status: `DRAFT`.

The four baseline captures preserve current-page evidence. The four
`proposed-owner-*` images are the responsive visual authority candidates:

- `proposed-owner-1440x900.png`
- `proposed-owner-1024x768.png`
- `proposed-owner-768x1024.png`
- `proposed-owner-390x844.png`

They preserve the existing shell/inbox hierarchy and add only the approved
section. Reference status remains `DRAFT` until human approval. Browser QA has
not started because no UI code exists.

## Out of scope

Backend or schema redesign, new permission/grant, new route/navigation, shell
changes, public-page redesign, provider/OAuth UI, QR, analytics, social
publishing, AI, autosave, implicit provisioning and production behavior are
excluded.
