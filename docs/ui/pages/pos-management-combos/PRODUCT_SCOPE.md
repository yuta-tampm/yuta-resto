# POS management combos — Product Scope

Status: Suggestion-eligibility management and consumption implemented; Phase 5 complete

Visibility: Engineering

## User goal

Allow an authenticated local administrator or manager to configure payment
combo rules quickly and safely without changing kitchen production items or
leaving the local restaurant runtime.

The 2026-08-23 extension adds one bounded goal: explicitly choose which active
combo rules may produce order-entry completion suggestions when broad eligible
item sets make the shelf operationally noisy.

## Suggestion-eligibility capability

- persist one boolean preference per combo rule;
- expose its text-backed state and control on `/management/combos`;
- allow the existing local `admin` and `manager` roles to change it;
- exclude opted-out rules only from `/orders/[orderId]/items` suggestions;
- preserve discount calculation, payment/check optimization, active state,
  structural locks, and historical snapshots;
- default existing and new rules to enabled.

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

No automatic item-count/name heuristic, candidate cap, browser-local setting,
cloud sync, tenant/establishment switcher, analytics, kitchen routing,
rule duplication, bulk edit, drag-and-drop persistence, import/export, new
roles, separate endpoints, additional domain fields, hard delete, or
payment-engine change.

Collapsible rule/group presentation may be explored as page-local UI state in
the visual proposal. It is not approved behavior until the design and relevant
phase are explicitly approved.
