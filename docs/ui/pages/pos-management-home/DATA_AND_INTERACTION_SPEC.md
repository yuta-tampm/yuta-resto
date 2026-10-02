# POS Management Home - Data and Interaction Specification

Status: Phase 3 verified

Visibility: Engineering

## Data mapping

| UI value                              | Owner                 | Notes                                   |
| ------------------------------------- | --------------------- | --------------------------------------- |
| Signed-in name and role               | trusted local session | resolved server-side                    |
| Module title, description, icon, tone | hub route             | static repository configuration         |
| Available/unavailable status          | hub route             | derived from whether a real href exists |
| Module destination                    | hub route             | four real local routes only             |

## Interactions

- Module links navigate to users, catalog, combos, or printing.
- Return-to-POS navigates to `/`.
- Sign-out revokes the bearer session when possible, clears the cookie, and
  redirects to `/management/login`.
- The reports card has no action and must not appear enabled.

## Required states

- Authenticated populated hub.
- Expired/missing session redirect to management login.
- Narrow responsive hub.
- Clear focus and activation feedback for links and sign-out.

There is no hub loading query, empty business-data state, write validation,
success toast, polling, offline queue, printer operation, or transaction.

## Phase 3 verification

- The four available module links use native anchors and keep their exact hrefs.
- `Rapports locaux` is text-only state with no enclosing link or button.
- The account menu opens through Enter; Escape closes it and returns focus to
  the trigger.
- The visible sign-out menu item remains a native submit button inside the
  existing Server Action form and measures 44 pixels high.
- Missing-cookie requests fail closed with a redirect to `/management/login`.
- Narrow module, account, and Return-to-POS controls meet the 44-pixel target.

The shared header brand/home link remains 40 pixels high. It is owned by the
approved cross-route management shell and requires a separate shared-shell
decision if it is to change across all management screens.

## Phase 4 integration trace

### Session read

1. `requireLocalManagementSession()` reads the HttpOnly management cookie on
   the Next.js server.
2. `siteAgentClient.getLocalSession()` forwards it only as a bearer header to
   `GET /api/v1/auth/session` with `cache: no-store`.
3. `@yuta/contracts/local-pos` strictly parses the session response.
4. Site-agent hashes the presented token and queries `local_auth_sessions` plus
   `local_users` in db-pos.
5. The session must be unrevoked, unexpired, active, and version-current. The
   POS management resolver also requires role `admin` or `manager`.
6. Failure at any step returns no trusted session and redirects to login.

### Sign-out

1. The shared menu submits `signOutManagementAction` on the Next.js server.
2. When a cookie token exists, the server sends bearer
   `DELETE /api/v1/auth/session`.
3. Site-agent hashes the token and sets `local_auth_sessions.revoked_at`.
4. The Server Action deletes the cookie and redirects to login even when the
   site-agent revoke request is unavailable.

The logout response is the strict `{ success: true }` contract. The endpoint is
idempotent without a bearer. Raw tokens are never persisted; only their
64-character hashes cross into db-pos.
