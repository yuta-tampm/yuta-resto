# Pointage employee — Acceptance Checklist

Status: IMPLEMENTED / VERIFIED / BROWSER-QA-PASS — production blocked

Visibility: Engineering

## Planning evidence

- [x] Read-only repository inventory and NEW_PAGE classification recorded.
- [x] Shared UI context resolved as NO_APPLICATION_SHELL.
- [x] Exact revised approved Specs bound to this draft.
- [x] Design-generation prompt prepared before the written UI proposal.
- [x] Human approval of Sensitive Design, page proposal and no-image direction.
- [x] Authorized final pack / execution planning after the Sensitive Design gate.

## Implemented and test-evidenced functional/security acceptance

- [x] Exactly two kinds and all four transition outcomes.
- [x] Atomic immutable event/receipt; orphan commit attempts fail.
- [x] Stable retry, same-intent replay and different-intent conflict.
- [x] Competing requests accept at most one; stale OUT cannot close later session.
- [x] Scoped isolation and current Personnel eligibility on all three operations.
- [x] Reset/expiry/end deny protected read, mutation, and replay through the
      previous continuation; bounded cleanup end remains allowed; no generic
      cloud-user alias.
- [x] Server instants, equal-time ordering, DST and cross-midnight grouping.
- [x] Departure-boundary denied OUT leaves open session without fabrication.
- [x] Employee output limited to own name/state/open start/immediate receipt.
- [x] Manager server read has exact grant/membership and no manager UI.
- [x] Missing/untrusted provider fails closed; no production/default fallback.
- [x] Synthetic/disposable-only fixtures and runtime, no real attendance.
- [x] No raw history/totals/correction/Planning/payroll/offline scope expansion.
- [x] No secret/identity persistence, URL leakage or diagnostic leakage.

## Browser QA — completed with residual evidence limitations

UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES.

- [x] Actual employee route with disposable DB and approved test provider.
- [x] Four viewports: 1440x900, 1024x768, 768x1024, 390x844.
- [x] Credential entry, loading, both states, and both committed receipts.
- [x] Conflict, non-enumerating failure, and unknown-result behavior.
- [x] Rate-limit and cloud-unavailable behavior covered by accepted
      implementation and interaction evidence.
- [x] Same-request recovery, no optimistic success, and no automatic new identity.
- [x] Explicit end, receipt timeout, and idle expiry.
- [x] Credential-reset invalidation covered by accepted service and
      actual-process/runtime evidence.
- [ ] Direct browser observation of absolute expiry; complementary accepted
      evidence exists, but idle expiry occurs first.
- [x] Navigation away/return, refresh, back/forward, and duplicate-tab clearing.
- [x] Pagehide/pageshow and restart-neutral semantics covered by accepted
      interaction and runtime evidence.
- [ ] Genuine hidden/background transition; unavailable in the current Edge
      automation runtime and retained as an evidence limitation.
- [ ] BFCache restoration; not triggered in the current Edge automation runtime
      and retained as an evidence limitation.
- [x] Late response cannot restore the previous employee; the next employee is isolated.
- [x] Keyboard, focus, labels, touch, long-name reflow, and announcements.
- [x] Browser storage, cache, URLs, and network logs inspected for prohibited residue.
- [x] Hashed secret-free synthetic screenshot and evidence manifest.
- [x] Honest QA report under the current YUTA QA protocol after formal VERIFY.

## Delivery boundary

The functional/security boxes above are supported by automated Apply evidence.
Formal VERIFY and mandatory Browser QA passed; the three unchecked observations
are the accepted residual evidence limitations and are not converted into
executed browser PASS results. Gate 3 was approved, the main Specs were synced,
and the change was archived. Production enablement and real attendance remain
NOT_AUTHORIZED, and the seven legal/privacy/provenance blockers remain open.
