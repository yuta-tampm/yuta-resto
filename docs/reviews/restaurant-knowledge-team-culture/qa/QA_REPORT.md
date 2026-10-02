# Browser QA Report

Change: `restaurant-knowledge-team-culture`

Route under test: `/etablissement/informations-generales`

Date: `2026-09-02`

Status: `QA: PASS`

## Environment and data

- Next.js `16.2.9` development server at `http://localhost:3001`.
- Existing local PostgreSQL development data; no fixture page or fabricated
  authorization grant was used.
- OWNER: `owner@luna-restaurant.fr`, active LUNA OWNER membership.
- MANAGER: `manager@luna-restaurant.fr`, active LUNA MANAGER membership.
- No-access principal: existing `admin@yutapro.fr` account with no active
  restaurant establishment membership. Authentication succeeds and fails
  closed at `/acces/aucun-etablissement`; the protected establishment route
  cannot expose Team Culture.

## Mandatory scenarios

| Scenario                                | Real-browser observation                                                                                                                                             | Result |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| OWNER editable                          | Three enabled fields and exactly one Team Culture save control                                                                                                       | PASS   |
| MANAGER editable                        | Persisted values, three enabled fields and exactly one Team Culture save control at 768 x 1024                                                                       | PASS   |
| STAFF or no Restaurant Knowledge access | Existing no-access principal reaches `Aucun établissement disponible`; zero Team Culture heading and zero Team Culture save control                                  | PASS   |
| Populated state                         | All three persisted values render for OWNER and MANAGER                                                                                                              | PASS   |
| All-empty state                         | OWNER explicitly saved three empty values; success status appeared and save became pristine/disabled                                                                 | PASS   |
| Dirty draft                             | OWNER unsaved draft enabled the single save control; reload discarded the draft                                                                                      | PASS   |
| Explicit save                           | One visible Team Culture save control submitted the whole slice; `Équipe et culture enregistrées.` rendered with `role="status"`                                     | PASS   |
| Persisted round-trip                    | After reload, all three saved values matched exactly and the save control was pristine/disabled                                                                      | PASS   |
| Responsive widths                       | 1440 x 900, 1024 x 768, 768 x 1024 and 390 x 844 exercised                                                                                                           | PASS   |
| Keyboard and focus                      | Tab moved from the first Team Culture textarea to `workingTogether`, then from the last textarea to the Team Culture submit button; computed focus ring was visible  | PASS   |
| Accessible names                        | All three textareas were located by their exact approved labels and the save control by its accessible name                                                          | PASS   |
| Overflow/clipping                       | `documentElement.scrollWidth === window.innerWidth` at all four widths; visual captures show no horizontal clipping                                                  | PASS   |
| Regression sections                     | Establishment Profile plus Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture headings remained present in the real route DOM and layout | PASS   |

## Runtime issue investigation

Earlier OWNER captures showed Next.js red issue badges caused by duplicate React
keys shared by the three preceding Restaurant Knowledge forms. The page now
namespaces those existing keys by slice. Focused tests and typecheck were rerun,
and every fresh mandatory capture reported zero `Issue`/`Issues` overlay nodes.
The notification badge showing `3` is application data, not a Next.js issue
badge. No unexplained browser, runtime or accessibility issue remains.

## Conditional scenarios

- READ without MANAGE:
  `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`. The accepted production grant
  matrix has no such principal. Focused component and authorization tests cover
  `canManage = false` and independent server MANAGE enforcement without
  inventing a role, permission or grant.
- Persistence error/recovery:
  `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`. Producing a real failure would
  require deliberately damaging the environment. Focused form/action tests
  prove `role="alert"`, retained draft state, retry, safe error content and zero
  persistence on denied paths.
- Visually capturable pending state:
  `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`. Local persistence completed
  before a stable screenshot could be captured. Focused form tests verify the
  same submit control exposes the pending/loading state.

These unavailable conditional states do not block mandatory QA.

## Conclusion

All mandatory real-browser scenarios passed against authenticated routes and
real persisted data. Screenshots and their lowercase SHA-256 values are recorded
in `screenshot-manifest.md`.
