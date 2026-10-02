# Browser QA Report

Change: `personnel-reconstructable-value-history`

Route under test: `/equipe/salaries`

Date: `2026-09-03`

Status: `QA: PASS`

## Environment and safe data

- Next.js `16.2.9` development server at `http://localhost:3001`.
- Disposable PostgreSQL 17 database with the complete cloud migration chain
  through new migration `0017`; no production database or employee data was
  used.
- Authenticated synthetic OWNER: `owner@luna-restaurant.fr`, using the seeded
  LUNA organization and establishment.
- `Camille Durand` was created before the synthetic cutover and therefore
  received exactly one baseline. `Julien Moreau` was created after cutover and
  received no fake baseline.
- Fifty-one safe legacy identity events were added for Julien to exercise the
  newest-50 window. A deliberately invalid F07 payload was inserted only long
  enough to verify fail-closed error/retry, then deleted by its exact IDs.

## Required scenarios

| Scenario                    | Real-browser observation                                                                                                                                                                                                                | Result |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Single-group success        | Identity Correction changed Camille to `Camille-Marie`; the saved dossier and open surface refreshed immediately.                                                                                                                       | PASS   |
| Multi-group success         | One submit committed Identity and Role Corrections together; the resulting F07 event grouped both previous/new snapshots.                                                                                                               | PASS   |
| Per-group validation        | Role Change exposed its required effective date while Work-time Correction exposed its required reason; save remained unavailable while either group was incomplete.                                                                    | PASS   |
| Future-date rejection       | The effective-date input exposed `max=2026-09-03`; attempted `2026-09-04` did not become the form value and save stayed unavailable. Server/domain tests separately prove whole-mutation rejection and zero history.                    | PASS   |
| Stale revision and recovery | A full-dossier tab committed a concurrent change while the drawer held an older revision. The drawer showed `Une version plus récente existe`, preserved the draft, then `Recharger la version actuelle` restored authoritative values. | PASS   |
| Error and retry             | An invalid versioned history fixture produced `Historique indisponible`; after exact fixture cleanup, `Réessayer` restored all 50 safe events.                                                                                          | PASS   |
| Cutover baseline            | Camille's timeline displayed `Début de l’historisation`, `Système`, and `Valeurs actuelles au début de l’historisation.` without previous values or human attribution.                                                                  | PASS   |
| Mixed history               | The same timeline displayed legacy dossier creation, a single-group F07 mutation, a multi-group F07 mutation, and the baseline without duplicate compatibility events.                                                                  | PASS   |
| Newest 50                   | Julien's history rendered exactly 50 event cards and `Seuls les 50 événements les plus récents sont affichés.`; no cutover baseline appeared for this post-cutover dossier.                                                             | PASS   |
| Loading, error, success     | `Chargement de l’historique…`, the fail-closed error panel, and recovered timeline were each observed on the real route.                                                                                                                | PASS   |
| Dirty close                 | Cancel with unsaved per-group input opened `Abandonner les modifications ?`; continuing preserves the form and abandoning returns safely.                                                                                               | PASS   |
| Keyboard and focus          | Enter opened the editor from `Modifier`; Escape closed a clean editor; after discard, focus returned to `Modifier`.                                                                                                                     | PASS   |
| Drawer and full dossier     | Mutation, concurrent conflict, reload, and refreshed dossier behavior were exercised across the drawer and `/equipe/salaries/[employeeId]`.                                                                                             | PASS   |
| Responsive widths           | 1440 x 1000, 1024 x 768, 768 x 1024, and 390 x 844 were captured. Content stayed readable; at 390 the document width was 390 and the tab strip used its intentional internal horizontal scroll.                                         | PASS   |
| Sensitive/internal data     | The Historique dialog contained zero inputs/selects, no UUID, raw JSON, payload version, tenant ID, operation ID, or internal revision.                                                                                                 | PASS   |
| Excluded controls/state     | No Historique search, filter, pagination, or export control was present. No scheduled, pending, future-value, or activation UI appeared.                                                                                                | PASS   |

## Authorization evidence boundary

Browser QA used the required authenticated OWNER only. MANAGER/STAFF,
cross-organization, cross-establishment, and foreign-employee denial are proven
by focused server/repository tests; no role, permission, or production-like
principal was invented for visual QA.

## Browser-found defect and retest

The initial QA run exposed a React warning when a per-group classification
Select moved from an absent value to `Correction` or `Changement`. The
route-local component passed `undefined` for its empty state, then a string for
its selected state. It now remains controlled for its whole lifetime by using
the existing empty-string draft value.

After the fix, the focused history UI suite passed 5/5, Backoffice typecheck
passed, the full Backoffice suite passed 377 tests with its one existing gated
file skipped, and the production build passed. A fresh authenticated browser
run opened the editor, created a changed Role group, and switched its
classification Correction -> Change -> Correction without reproducing the
warning. The QA draft was discarded and no additional employee mutation was
saved.

## Visual review

- The wide drawer keeps grouped history readable without exposing storage
  structure.
- At tablet and mobile widths the drawer becomes the usable full surface; the
  employee header, action controls, tabs, cards, labels, and values remain
  readable.
- The mobile tab bar scrolls inside its own region and does not create document
  overflow.
- Baseline wording is neutral and does not imply employee-start or pre-cutover
  truth.

## Conclusion

All required real-route Browser QA scenarios passed using authenticated OWNER
access and safe disposable data. Screenshot dimensions and lowercase SHA-256
hashes are recorded in `screenshot-manifest.md`.
