# Satisfaction client — Data and Interaction Specification

Status: Approved behavior mapped for design; UI integration not authorized

Visibility: Engineering

## Runtime and trust boundary

The Backoffice server resolves the authenticated user, verified active
membership, trusted organization and required active establishment. Existing
`requireReputationTenant` keeps `reputation.enabled` and `reputation.read` as the
base Satisfaction boundary. The new settings model/action additionally requires
`reputation.settings.manage`, granted to OWNER only.

MANAGER and STAFF may continue to use the inbox but must not receive the
settings read model, opaque state token or settings section. Public, service and
system actors without valid restaurant membership do not bypass this boundary.
Browser-provided organization, establishment, role, membership, permission or
tenant context is never authorization evidence.

## Data ownership and transport

- Reputation owns the three nullable settings values for the exact trusted
  organization and establishment.
- `@yuta/contracts` owns the shared provider policy, normalized read model,
  strict Save input and safe discriminated outcomes.
- `@yuta/db-cloud` owns scoped read, row-locking mutation, qualified SETTINGS
  audit, state evidence, conflict/no-op/replay decisions and public safe
  projection.
- The Backoffice route will own presentation and server-action composition only
  after Phase 3B authorization.
- The browser may submit expected values, proposed values and the opaque state
  token, but none establishes tenant or permission authority.
- Raw audit data, internal identifiers, actor identifiers and token internals
  never become UI contracts.

## Current domain mapping

| Current field/model/contract                                    | UI presentation                                   | Existing transformation                                           | Gap                                   |
| --------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| `ReputationReviewSocialLinks.googleReviewUrl: string \| null`   | “Lien Google” URL input                           | Trim; blank to null; strict approved Google policy                | OWNER settings component not rendered |
| `ReputationReviewSocialLinks.facebookReviewUrl: string \| null` | “Lien Facebook” URL input                         | Trim; blank to null; strict approved Facebook policy              | OWNER settings component not rendered |
| `ReputationReviewSocialLinks.instagramUrl: string \| null`      | “Lien Instagram” URL input                        | Trim; blank to null; strict approved Instagram policy             | OWNER settings component not rendered |
| `stateToken` in the approved private read model                 | Not displayed                                     | Opaque lowercase 64-hex concurrency evidence                      | Route action/component not wired      |
| `SUCCESS` / `NO_CHANGE`                                         | Saved/no-change status and new authoritative base | Return authoritative values and refreshed token                   | UI state not implemented              |
| `VALIDATION_ERROR`                                              | Provider-specific field error                     | Safe issue code; rejected credential/raw request is not echoed    | UI mapping not implemented            |
| `CONFLICT`                                                      | Recoverable conflict with reload action           | No write/audit; authoritative current model or reload instruction | UI recovery not implemented           |
| `CONFIGURATION_UNAVAILABLE`                                     | “Configuration indisponible”; Save unavailable    | Missing exact settings row; no create/upsert/default              | UI unavailable state not implemented  |
| `SERVER_ERROR`                                                  | Generic retry while preserving draft              | No stack, database or audit internals                             | UI recovery not implemented           |
| Existing `ReviewsPageModel` in `avis/reviews-model.ts`          | Metrics, filters, list/detail and permissions     | Server-fixed Direct Feedback load on Satisfaction route           | Must remain unchanged                 |

## Current interactions

The current page supports query-backed search, status/rating filters, sorting,
pagination, list selection, detail navigation and current management actions.
The Satisfaction loader forces `DIRECT` source and defaults to the first result
when no explicit review is selected.

The approved future settings interaction adds one three-field local draft and
one explicit Save. It does not add navigation, a modal, autosave, per-provider
Save, provider calls or background work.

## Mutations / actions / transactions

Current inbox mutations remain owned by `avis/actions.ts` and the Reputation
repository. Phase 3A does not change them.

For the approved settings Save, later Phase 3B composition must:

1. resolve and authorize trusted context before parsing browser mutation;
2. submit the normalized three-field draft with expected authoritative values
   and opaque state token as one mutation;
3. consume the already implemented repository decision without duplicating its
   concurrency or audit logic;
4. replace the form baseline only with authoritative returned values/token;
5. preserve the entire draft on validation, conflict or server failure.

The repository already owns the atomic settings update plus exactly one
qualified SETTINGS audit for a real mutation. No-op, equivalent replay,
conflict, missing row and failures create no partial write or extra audit.

## Validation

The shared provider policy is the single private/public implementation. It
trims outer whitespace, maps blank to null, limits input to 2048 application
string units, requires HTTPS, forbids credentials, applies exact approved host
and Google path allowlists, performs no network/redirect call and returns the
trimmed original accepted URL without path/query/fragment rewriting.

Client validation may provide immediate feedback, but the trusted server result
is authoritative. One invalid provider rejects the whole Save. The UI must keep
all three entered values and map safe provider errors without echoing rejected
credentials or internal details.

## Operational and UI states

| State                        | Observable UI behavior                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| Loading                      | Settings skeleton/busy state; no active Save.                                            |
| Empty                        | Three authoritative null values shown as empty inputs; no placeholder is persisted.      |
| Populated                    | Three authoritative normalized values shown.                                             |
| Dirty                        | Draft differs from the current authoritative baseline; explicit Save may enable.         |
| Invalid                      | Provider/field message visible; draft retained; no partial submit.                       |
| Saving                       | Single pending submit; duplicate Save disabled.                                          |
| Saved                        | Authoritative response becomes the new baseline; dirty clears; short text confirmation.  |
| No change                    | Current authoritative response retained; no mutation/audit claim.                        |
| Server error / retry         | Generic recoverable message; all draft values retained.                                  |
| Conflict / reload            | No overwrite; explain current data changed and offer authoritative reload.               |
| Configuration unavailable    | Bounded unavailable message; fields/Save unavailable; retry after external provisioning. |
| Unauthorized settings access | Settings model and section absent; inbox access remains governed by `reputation.read`.   |

Leaving or reloading with unsaved input performs no write or audit. Any
dirty-close warning must use an existing approved page pattern; if none is
available, stop for design review instead of adding a global primitive.

## Polling / offline / device behavior

Not applicable. The current page has no approved polling contract, offline
queue or device ownership. Do not invent one for settings.

## Public interaction boundary

`apps/feedback-web` currently receives a trusted public configuration and shows
only non-null external links after successful direct-feedback submission. The
shared public projection maps unsafe legacy URLs to null and does not clean the
stored value.

The concurrent `feedback-public-trusted-boundary-hardening` change owns
verified/active hostname resolution and production client-identity
configuration. It explicitly excludes external URL/settings behavior. Later
Phase 3C must reconcile current bytes before any public edit and must not change
hostname, slug, organization/establishment or missing-row authority.

## Decisions that must not be guessed

- Do not create a settings row when it is missing or infer unrelated settings.
- Do not derive Google URLs from Google Business Profile configuration.
- Do not interpret a conflict as success or silently overwrite current data.
- Do not treat browser state/token as tenant authority.
- Do not expose internal state-token, audit or operation details.
- Do not add autosave, OAuth, analytics, QR, provider verification or social
  publishing.
- Do not reinterpret concurrent public trusted-boundary work.

## Proposed persistence/contract changes

None. Approved Phase 1 and Phase 2 contracts/repository behavior already exist.
Phase 3A creates documentation and visual baseline evidence only.
