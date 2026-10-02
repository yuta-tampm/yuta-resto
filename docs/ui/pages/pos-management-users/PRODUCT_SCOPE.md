# POS management users - Product Scope

Status: Implemented within approved scope

Visibility: Engineering

## User goal

An authenticated local administrator or manager can maintain the POS identities
needed for restaurant operation without cloud access.

## Current approved capabilities

- List real local users and their name, optional email, role, and active state.
- Create a user with a 4-8 digit local PIN.
- Edit name, optional email, role, and active state.
- Reset a PIN and activate or deactivate a user.
- Preserve admin/manager role limits, session invalidation, last-active-admin
  protection, unique email, and no-hard-delete history.

## Out of scope

Cloud accounts or memberships, invitations, employee HR records, schedules,
payroll, documents, granular permissions, audit history UI, last-login UI,
physical deletion, bulk actions, and authentication methods other than the
current local PIN session are out of scope.

The screen is local POS management. It must not be represented as cloud
Backoffice employee management.
