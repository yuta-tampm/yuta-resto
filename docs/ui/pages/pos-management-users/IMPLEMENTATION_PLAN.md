# POS management users - Implementation Plan

Status: Complete

Visibility: Engineering

## Phase 0 - Repository and design handoff

Complete the read-only inventory, resolve the shared shell, capture the
authenticated baseline, and prepare the design prompt. No runtime code changes.

## Phase 1 - Approved visual baseline

After explicit approval of a reviewed visual direction, refactor the real route
in place to reuse the approved management shell and responsive hierarchy.
Preserve loaders, actions, authorization, data, and tests. No fixtures.

Completed on 2026-08-13. The route now uses the approved shell, responsive
table/card composition, contextual last-admin protection, and real integrated
data without changing any service or persistence boundary.

## Phase 2 - Component responsibilities

Extract route-local pieces only where dialog, row/list, feedback, or pure model
ownership becomes clearer. Do not split by line count or promote domain logic
to `@yuta/ui`.

Completed on 2026-08-13. `UsersManagement.tsx` now composes a route-local
overview; responsive row/card ownership lives in `UsersOverview.tsx`, dialog
and form/action-state ownership lives in `UserDialogs.tsx`, and pure role plus
last-admin presentation decisions live in `users-model.ts`. Runtime behavior
and the approved Phase 1 visual baseline remain unchanged.

## Phase 3 - Interaction and truthful states

Verify accessible dialogs, pending/error/success recovery, preserved input,
conflict handling, and responsive actions. Any behavioral gap requires approval.

Completed on 2026-08-13. Inputs remain controlled for error preservation,
success is announced after dialog close, stale/load failures expose refresh or
retry recovery, expired credentials redirect through the existing login flow,
pending activation is guarded, and every users-dialog control meets the local
44-pixel touch target. Focus, Escape, narrow overflow, and error/success paths
were verified against the authenticated production build.

## Phase 4 - Integration audit

Trace every field/action through contracts, server credential forwarding,
site-agent authorization/service logic, and db-pos. Make no schema/API change
unless separately approved.

Completed on 2026-08-13. The full field/mutation path is reconciled and focused
contract plus database integration coverage now protects transport secrecy,
manager limits, normalized email uniqueness, concurrent last-admin safety, PIN
hashing, and session invalidation. No runtime contract, API, schema, permission,
or persistence code changed. The pre-session full-user listing remains a
documented existing boundary pending any separate API/auth-flow decision.

## Phase 5 - Functional and visual QA

Run functional checks before visual QA at 1366x768, 1024x768, 768x1024, and
390x844; verify focus, touch targets, no horizontal overflow, and as-built docs.

Completed on 2026-08-13. Functional regression passed before authenticated
visual review. Final evidence covers the full viewport matrix plus protected
edit, success, and validation states. Users-page actions and editor controls
meet the 44-pixel POS target, no viewport overflows horizontally, the narrow
editor remains contained, browser logs are clean, and the stable package is
synchronized as implemented.

Each phase stops for explicit product-owner approval.
