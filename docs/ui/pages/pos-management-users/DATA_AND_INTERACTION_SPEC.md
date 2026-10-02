# POS management users - Data and Interaction Specification

Status: Phase 4 audited

Visibility: Engineering

## Field mapping

| UI field | Contract/source         | Rules                                   |
| -------- | ----------------------- | --------------------------------------- |
| Name     | `LocalUser.name`        | required, trimmed, 1-255 characters     |
| E-mail   | `LocalUser.email`       | optional, normalized, unique, max 320   |
| Role     | `LocalUser.role`        | `admin`, `manager`, `staff`, `kitchen`  |
| State    | `LocalUser.isActive`    | active/inactive; no delete              |
| PIN      | create/reset input only | 4-8 digits; never returned or displayed |

`authVersion`, PIN hash, timestamps, and session tokens are service/database
concerns and must not become editable or exposed UI fields.

## Interaction ownership

- The protected Server Component loads users from `site-agent`.
- Server Actions validate `FormData` with transport schemas, retrieve the
  HttpOnly credential server-side, call the site-agent client, and revalidate.
- Site-agent authorizes the actor, hashes PINs, applies transactions and email
  uniqueness, protects the last active admin, invalidates affected sessions,
  and persists to local PostgreSQL.
- UI pending/error/success state is presentation only and is not authoritative.
- Failed editor submissions retain the entered values and expose assertive
  feedback. A stale user offers route refresh; a blocking load failure offers
  retry. Persisted success closes the dialog and is announced for five seconds.
- Expired credentials follow the existing server redirect to management login;
  they are not reported as a local-service failure.

Admins manage every role. Managers can create or manage only service and
kitchen users. The design must show unavailable actions truthfully and must not
move enforcement into the browser.

## Integration trace

| UI operation            | Contract and POS server                                                  | Site-agent route/service                                                               | db-pos effect                                                          |
| ----------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Load users              | `localUsersResponseSchema`; uncached server request                      | `GET /api/v1/local-users`; response parsed strictly                                    | Reads ordered `local_users` projection only                            |
| Create                  | `createLocalUserInputSchema`; server-only bearer                         | Authenticated `POST`; role authorization, PIN hash, email normalization/conflict check | Transaction/advisory lock inserts UUIDv7 user                          |
| Edit profile/role/state | `updateLocalUserInputSchema`; server-only bearer                         | Authenticated `PATCH`; current/next role authorization and last-admin guard            | Transaction updates fields; role/state change increments `authVersion` |
| Activate/deactivate     | Same update contract with `isActive` only                                | Same authenticated update and last-admin guard                                         | Updates state and increments `authVersion`                             |
| Reset PIN               | `localPinSchema` then `resetLocalUserPinInputSchema`; server-only bearer | Authenticated `/pin` PATCH; target-role authorization and PIN hashing                  | Replaces only hash and increments `authVersion`                        |

All mutation responses pass `localUserResponseSchema`, which exposes only id,
name, nullable email, role, and active state. PIN hashes, authVersion, login
timestamps, database timestamps, and tokens cannot pass the strict response.
Successful actions revalidate `/management/users`.

The current management login must discover candidates before a session exists,
so the shared local-user GET route is unauthenticated and the POS login page
filters active admin/manager users. Mutation routes always require a validated
management session. Narrowing the pre-session payload would require a new or
changed contract/API/auth flow and is not authorized by this package.
