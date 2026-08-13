# POS Management Home - Data and Interaction Specification

Status: Phase 0 reviewed

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
