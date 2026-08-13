# POS Management Home - Product Scope

Status: Phase 0 reviewed

Visibility: Engineering

## User goal

Give an authorized local administrator or manager a fast, truthful entry point
to the implemented POS management modules and a clear return to live POS work.

## Current approved capabilities

- Identify the signed-in local user and role.
- Open users, catalog, combos, and printing management.
- Show local reports as unavailable without an actionable route.
- Return to the POS or sign out of the management session.

## Out of scope

- Implementing reports, analytics, notifications, search, favorites, or recent activity.
- Adding routes, module permissions, roles, tenancy, cloud data, or device controls.
- Changing session lifetime, sign-in/sign-out semantics, contracts, APIs, or persistence.
- Redesigning the POS application shell outside the approved management shell.

## Product boundary

This is a single-site local POS hub. It is not the cloud Backoffice and does not
read or synchronize organization, establishment, membership, or cloud data.
