# POS management combos — Product Scope

Status: Reviewed repository scope; visual direction pending approval

Visibility: Engineering

## User goal

Allow an authenticated local administrator or manager to configure payment
combo rules quickly and safely without changing kitchen production items or
leaving the local restaurant runtime.

## Current approved capabilities

- list active and inactive rules with pricing summary, priority, groups, and
  eligible items;
- create rules inactive and edit current rule fields;
- activate or deactivate rules with confirmation and service validation;
- create, edit, and remove groups while their rule is inactive;
- add, edit, and remove eligible catalogue-item mappings while inactive;
- configure fixed pricing or base-item-plus-delta pricing;
- configure group quantities, sort order, per-item extra price, priority, and
  optional maximum applications;
- preserve real pending, error, conflict, confirmation, empty, disabled, and
  service-unavailable behavior.

## Protected product boundaries

- Combos are automatic payment discounts, not menu items and not kitchen
  production rules.
- The optimizer and persisted discount snapshots remain authoritative outside
  this page.
- Paid-order history is not rewritten by later combo edits.
- Rules are retired by deactivation; this UI does not hard-delete rules.
- Group and item structure can change only while a rule is inactive.
- All data and authorization remain local to POS through site-agent and db-pos.

## Out of scope

No cloud sync, tenant/establishment switcher, analytics, kitchen routing,
rule duplication, bulk edit, drag-and-drop persistence, import/export, new
roles, new endpoints, new fields, hard delete, or payment-engine change.

Collapsible rule/group presentation may be explored as page-local UI state in
the visual proposal. It is not approved behavior until the design and relevant
phase are explicitly approved.
