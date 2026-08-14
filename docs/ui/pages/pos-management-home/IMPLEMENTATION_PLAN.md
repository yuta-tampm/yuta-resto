# POS Management Home - Implementation Plan

Status: Complete

Visibility: Engineering

## Phase 0 - Repository analysis and design handoff

Complete the read-only inventory, shared-context decision, authenticated
baseline, and design prompt. Do not change runtime code. Stop for approval.

## Phase 1 - Visual baseline renewal

After explicit approval, renew the existing hub in place using the approved
shared shell and reviewed design direction. Preserve auth, routes, availability,
copy meanings, and sign-out behavior. Stop for approval.

Completed on 2026-08-13 without an API, contract, permission, persistence, or
device change.

## Phase 2 - Responsibility-based component review

Extract only a coherent reusable or route-local responsibility proven by the
implemented design; do not split by line count. Stop for approval.

Completed on 2026-08-13 by extracting only the route-local module inventory and
card-grid presentation into `ManagementModules.tsx`. Visual and runtime behavior
are unchanged.

## Phase 3 - Interaction and state QA

Verify keyboard, touch, focus, sign-out, unavailable state, responsive behavior,
and expired-session routing. Stop for approval.

Completed on 2026-08-13 as authenticated production-build QA. No hub runtime
change was required; the shared 40-pixel brand/home link is recorded as a
cross-route shell follow-up rather than changed locally.

## Phase 4 - Integration audit

Trace session resolution and sign-out through the existing server/site-agent
boundary. No API, contract, schema, or permission change is expected. Stop for approval.

Completed on 2026-08-13. The audit confirmed the existing server-only bearer,
strict-contract, site-agent, token-hash, revocation, expiry, active-user,
`authVersion`, and role boundaries. One site-agent HTTP boundary test was added;
production behavior remains unchanged.

## Phase 5 - Functional, visual, responsive, and as-built QA

Run exact checks, capture the viewport matrix, reconcile docs with the final
implementation, and mark the package implemented only after approval.

Completed on 2026-08-13. Functional regression preceded the clean-origin
production-build visual pass at 1366x768, 1024x768, 768x1024, and 390x844. The
package and references now match the as-built implementation.
