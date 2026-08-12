# POS management combos — Acceptance Checklist

Status: Phase 0 review checklist

Visibility: Engineering

## Phase 0

- [x] Existing real route and integrated implementation identified.
- [x] Local session, bearer transport, site-agent, db-pos, and contract
      boundaries mapped.
- [x] Current actions, validation, transactions, states, and tests inventoried.
- [x] Approved shared UI context from catalog/printing resolved.
- [x] Shell mode is `REUSE_APPROVED_SHARED_SHELL` with real routes and forbidden
      invented navigation recorded.
- [x] Authenticated populated baseline captured at `1366 × 768`.
- [x] Rule editor captured without submitting data.
- [x] ChatGPT/ImageGen prompt set is self-contained and uses distinct prompts
      for distinct assets.
- [x] Runtime application code unchanged in Phase 0.
- [ ] Product owner approves Phase 0 and authorizes design generation.
- [ ] Generated reference is reviewed and approved before Phase 1.

## Later implementation acceptance

- [ ] Real local data and Server Actions remain in place; no fixture replacement.
- [ ] `admin`/`manager` session validation and HttpOnly cookie flow are unchanged.
- [ ] Site-agent/db-pos ownership and bearer forwarding are unchanged.
- [ ] Active rule structural locks and activation validation remain enforced.
- [ ] Rule hard delete remains unavailable and paid discount history is preserved.
- [ ] Fixed and base-item-plus-delta modes remain accurate.
- [ ] All current rule/group/item fields and actions remain reachable.
- [ ] Empty, pending, error, conflict, confirmation, disabled, success, session,
      and local-service failure states are truthful.
- [ ] Approved shared header is used without sidebar/drawer/module-tab invention.
- [ ] `1366 × 768`, `1024 × 768`, `768 × 1024`, and `390 × 844` have no
      essential clipping or horizontal overflow.
- [ ] Keyboard, focus, dialog scrolling, and touch targets pass review.
- [ ] Relevant tests/build/checks pass and skipped checks are reported.
- [ ] Authenticated as-built evidence and page docs match implementation.
