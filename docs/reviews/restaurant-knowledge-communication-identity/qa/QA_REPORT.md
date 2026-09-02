# Browser QA Report

Change: `restaurant-knowledge-communication-identity`

Route under test: `/etablissement/informations-generales`

Date: `2026-09-02`

Status: `QA: PASS`

## Environment and data

- Next.js `16.2.9` development server at `http://localhost:3001`.
- Existing local PostgreSQL development data with migration `0015` applied to
  the local QA database; no fixture page or fabricated authorization grant was
  used.
- OWNER: `owner@luna-restaurant.fr`, active LUNA OWNER membership.
- MANAGER: `manager@luna-restaurant.fr`, active LUNA MANAGER membership.
- No-access principal: existing `admin@yutapro.fr` account with no active
  restaurant establishment membership. Authentication succeeds and fails
  closed at `/acces/aucun-etablissement`; the protected establishment route
  cannot expose Communication Identity.

## Mandatory scenarios

| Scenario                                | Real-browser observation                                                                                                                                                                        | Result |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| OWNER editable                          | Three enabled fields and exactly one Communication Identity save control                                                                                                                        | PASS   |
| MANAGER editable                        | Persisted values, three enabled fields and exactly one save control at 768 x 1024; an unsaved MANAGER draft enabled that control                                                                | PASS   |
| STAFF or no Restaurant Knowledge access | Existing authenticated no-access principal reaches `Aucun établissement disponible`; zero Communication Identity heading and zero save control                                                  | PASS   |
| Populated state                         | All three persisted values rendered for OWNER and MANAGER                                                                                                                                       | PASS   |
| All-empty state                         | OWNER explicitly saved all three empty values; the canonical all-empty form became pristine and remained valid                                                                                  | PASS   |
| Dirty draft                             | OWNER and MANAGER unsaved drafts enabled the single save control; reload discarded each draft                                                                                                   | PASS   |
| Explicit save                           | One visible Communication Identity control submitted the whole slice; `Identité de communication enregistrée.` remained visible with `role="status"`                                            | PASS   |
| Persisted round-trip                    | After reload, all three restored values matched exactly and the save control was pristine/disabled                                                                                              | PASS   |
| No autosave                             | Reload after unsaved OWNER and MANAGER edits restored the last explicitly saved values                                                                                                          | PASS   |
| Responsive widths                       | 1440 x 900, 1024 x 768, 768 x 1024 and 390 x 844 exercised                                                                                                                                      | PASS   |
| Keyboard and focus                      | Tab moved from the first textarea to `customerAddressing`; the computed two-pixel focus ring was visible                                                                                        | PASS   |
| Accessible names                        | All three textareas were located by their exact approved labels and the save control by its accessible name                                                                                     | PASS   |
| Status semantics                        | Successful save exposed the French confirmation through `role="status"`                                                                                                                         | PASS   |
| Overflow/clipping                       | `documentElement.scrollWidth === window.innerWidth` at all four widths; captures show no horizontal clipping on the protected route                                                             | PASS   |
| Regression sections                     | Establishment Profile plus Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication headings remained present in the real route DOM and layout | PASS   |

## Browser-found defect and retest

The first successful save persisted correctly but the Communication Identity
form's server-value-derived React key remounted the component after
revalidation, which removed the success message before it remained observable.
The page-local key was removed because canonical dirty-state correctness already
uses the action's accepted saved projection and does not depend on remounting.
Focused form tests and Backoffice typecheck passed after the correction. A fresh
real save then retained `Identité de communication enregistrée.` with
`role="status"`; reload confirmed the final persisted round-trip. Fresh browser
logs contained zero warnings/errors and no Next.js issue overlay.

## Conditional scenarios

- READ without MANAGE:
  `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`. The accepted production grant
  matrix has no such principal. Focused component and server authorization tests
  cover `canManage = false` and independent MANAGE enforcement without inventing
  a role, permission or grant.
- Persistence error/recovery:
  `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`. Producing a real failure would
  require deliberately damaging the environment. Focused form/action tests prove
  `role="alert"`, retained draft state, retry, content-safe failure handling and
  zero persistence on denied paths.
- Visually capturable pending state:
  `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`. Local persistence completed
  before a stable screenshot could be captured. Focused form tests verify the
  same submit control exposes the pending/loading state.

These unavailable conditional states do not block mandatory QA.

## Conclusion

All mandatory real-browser scenarios passed against authenticated routes and
real persisted data. Screenshots and their lowercase SHA-256 values are recorded
in `screenshot-manifest.md`.
