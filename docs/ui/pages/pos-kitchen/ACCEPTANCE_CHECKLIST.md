# POS Kitchen — Acceptance Checklist

## Phase 0 completed on 2026-08-18

- [x] Root, POS, site-agent, db-pos, and contracts instructions were read.
- [x] Current state, database boundary, POS product, operator, offline, QA, and
      UI governance documents were read.
- [x] Target recorded as `PAGE`, `/kitchen`, `EXISTING_PAGE`, integrated,
      `EXISTING_CAPABILITY_RENEWAL`.
- [x] Runtime boundary recorded as
      `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`.
- [x] Shared context resolved as `REUSE_APPROVED_SHARED_SHELL` with only the
      real `/`, `/kitchen`, and `/management` shared destinations.
- [x] Service-day, station/status filtering, fallback selection, counts,
      sorting, grouping, notes/options/allergies, transition matrix, polling,
      cancellation visibility, and device truthfulness were inventoried.
- [x] Contracts, Server Actions, site-agent validation, transaction ownership,
      UUIDv7 differences, tests, and coverage gaps were inventoried.
- [x] Current persisted baseline captured at 1366x768 and 390x844.
- [x] No fixtures or operational-data mutation were used for evidence.
- [x] Item-rich and failure/device states that could not be captured safely are
      explicitly recorded.
- [x] Design-generation prompt is ready.
- [x] Phase 1 and runtime implementation were not run during Phase 0.

## TV design generation completed on 2026-08-18

- [x] Product owner approved design generation for a denser wall-mounted TV
      presentation.
- [x] Built-in ImageGen used the real desktop baseline as shared-shell input.
- [x] Current reference uses one selected status queue, an uncapped auto-column
      track, a ten-item command with independent body scrolling, item-level
      actions, neutral elapsed time, and allergy priority.
- [x] Current reference uses an independent vertical scrollbar only on a ticket
      whose body exceeds its viewport-bounded maximum height.
- [x] Allergens and allergy notes render in full before ordinary notes; a
      separate example demonstrates confirmed Kitchen awareness.
- [x] Structured modifiers and ordinary notes wrap completely without
      ellipsis, tooltip, hover, accordion, or `voir plus`.
- [x] Product direction records continuous free horizontal queue scrolling,
      with no fixed-column page snapping or automatic carousel.
- [x] Current interaction DRAFT keeps ready rows in an in-progress ticket,
      moves them below unfinished rows, and communicates completion through check,
      text, strikethrough, and color.
- [x] No fully ready ticket remains in `En préparation`; the proposed ticket
      moves automatically only after every active row becomes ready.
- [x] Current wide-screen DRAFT has no hard visible-column cap and shows six
      complete columns plus continuation on a wider effective viewport.
- [x] Current reference places unfinished `ENTRÉES` before `PLATS`, with
      completed rows remaining last.
- [x] Generated content was not inserted into POS persistence and no runtime
      transition or print action was invoked.
- [x] Product owner approved the current reference and Phase 1 on 2026-08-18.

## Phase 1 visual baseline completed on 2026-08-18

- [x] Real Server Component loader, persisted data, status/station filtering,
      actions, polling, shell, contracts, and runtime boundary remain intact.
- [x] Ticket columns are created automatically from available width with no
      hard maximum, and the queue uses continuous free horizontal scrolling.
- [x] Every ticket is viewport-bounded; only its body scrolls vertically while
      its header remains fixed.
- [x] Short tickets do not require a separate behavior or artificial filler.
- [x] Filter and transition targets use a minimum 44px height.
- [x] No fixture or operational-data mutation was introduced for implementation
      or verification.
- [x] Ready-item retention/grouping was later approved and implemented from
      the existing detail response. Entrées-first was deferred during this
      phase and later approved with a mutable live-catalog join.
- [x] Phase 2 and later phases remain unapproved and unstarted.

## Approval gates still open

- [ ] Product owner resolves whether cancelled orders are visible read-only or
      absent after refresh.
- [ ] Product owner reviews the newest-100/N+1 Kitchen read limitation and
      decides whether a separate data-contract initiative is needed.
- [x] Generated references were reviewed and the current reference is marked
      `APPROVED`.
- [x] Scope status is `APPROVED` for the Phase 1 visual baseline.
- [x] Product owner approved replacing item-status filtering and counts with
      the order-group queue projection.
- [x] Product owner approved current live-catalog category/order metadata for
      Entrées-first presentation; historical ordering may follow catalog edits.
- [x] Phase 1 implementation was separately authorized and completed.

## Phase 2 component refactor completed on 2026-08-18

- [x] Product owner separately authorized Phase 2.
- [x] `page.tsx` retains Server Component data loading and orchestration.
- [x] `KitchenFilters` owns only route-local station/queue navigation.
- [x] `KitchenTickets` owns order-group headers and independently scrolling
      ticket bodies.
- [x] `KitchenItem` owns item detail, allergy confirmation, and the unchanged
      transition forms.
- [x] `_lib/kitchen-view.ts` owns pure parsing, URLs, grouping, counting, and
      display-time helpers.
- [x] `KitchenAutoRefresh` remains the minimal client refresh boundary.
- [x] The unused shared `KitchenTicket` was not forced into the route or
      modified without proven reuse.
- [x] No action, form field, focus target, loader/query, status transition,
      polling behavior, contract, runtime owner, or persisted data changed.
- [x] Populated-state correction removes the visible order number, gives order
      notes and order/item allergy blocks the full usable ticket width, and
      replaces Prepare/Ready text with 44px icon controls retaining explicit
      accessible names and titles.
- [x] No unapproved pending/error interaction, contract, or persistence work
      was started.

## Dense TV implementation completed on 2026-08-18

- [x] Product owner approved the dense content-height ticket design.
- [x] Short tickets pack below one another instead of stretching to the board
      height; viewport width determines the number of readable columns.
- [x] Horizontal overflow remains continuous and unsnapped.
- [x] Ticket metadata, notes, allergy blocks, and item rows use compact spacing
      without truncating safety or preparation content.
- [x] Only a ticket that reaches the board height scrolls its item body.
- [x] Ready rows move below unfinished rows, show `Prêt`, use a muted success
      surface and strikethrough, and retain compact correction controls.
- [x] A mixed ticket remains in `À préparer`; only an all-ready ticket moves to
      `Prêt`.
- [x] Station and queue badges count unique order tickets; multiple item rows
      from the same order count once per station.
- [x] No API, contract, schema, command, transaction, polling, printer, or
      runtime ownership changed.

## Existing-page protection for later phases

- [ ] Real persisted data remains authoritative; no fixtures replace the route.
- [ ] The current shell/header/health strip and real navigation remain intact.
- [ ] Service-day, station/status, grouping, allergy, paid-order correction,
      polling, and command rules remain intact unless separately approved.
- [ ] `send_to_kitchen` transaction/idempotency/printing remains upstream and
      is not moved into the Kitchen page.
- [ ] No new field, status, station, route, permission, API, contract, schema,
      migration, runtime/device setting, or physical-success claim is invented.
- [ ] Route-specific pending/error/recovery states are truthful and tested if
      approved.

## Responsive, touch, and accessibility for later phases

- [ ] Browser evidence covers 1920x1080, 1366x768, 1024x768, 768x1024, and
      390x844.
- [ ] No document-level horizontal overflow; any contained filter scrolling is
      visible and keyboard/touch usable.
- [ ] The TV ticket track scrolls horizontally without snapping and remains at
      the operator-selected position.
- [ ] Each overflowing ticket body scrolls vertically and independently; short
      tickets expose no inactive scrollbar.
- [ ] Ticket header and unconfirmed allergy summary remain visible while its
      item body scrolls; focus and wheel/pointer/touch/keyboard behavior do not
      move the wrong scroll axis.
- [ ] Touch-critical controls meet the POS target; current 36px segmented links
      are deliberately reviewed.
- [ ] Direct transition actions remain reachable without essential hover-only
      behavior.
- [ ] Selected filters and item statuses are communicated by text, not color
      alone.
- [ ] Icon-only controls have accessible names and visible focus.
- [ ] Allergic-item Ready remains disabled until Kitchen confirmation, with a
      visible explanation.
- [ ] Pending controls prevent accidental repeated activation and errors offer
      a safe recovery path.

## Verification

Phase 0 documentation checks to run in this task:

- [x] `pnpm ui:pack:check pos-kitchen` — passed via the underlying repository
      script: 1 package, 0 warnings.
- [x] `pnpm docs:check` — passed via the underlying repository script: 36
      current documents.
- [x] scoped Prettier check for `docs/ui/pages/README.md` and every new
      Markdown file — passed after scoped formatting.
- [x] `git diff --check` for the page index and `pos-kitchen` pack — passed.
- [x] `pnpm architecture:check` — passed.

Repository baseline results recorded separately:

- [ ] `pnpm format:check` — failed on 1024 repository-wide files outside this
      scoped formatting result; no unrelated file was reformatted.
- [ ] `pnpm -r --if-present typecheck` — failed first in the unrelated
      `apps/yuta-display/src/app/page.tsx` Next navigation type resolution.
- [ ] `pnpm typecheck:pos` — failed on existing Next module/type resolution
      errors across POS routes, including `next/cache`, navigation exports,
      font exports, and a local management session nullability error. Phase 0
      changed no runtime TypeScript.

Deferred because runtime code did not change:

- [ ] `pnpm test:pos`
- [ ] `pnpm build:pos`
- [ ] `pnpm typecheck:site-agent`
- [ ] `pnpm test:site-agent`
- [ ] `pnpm typecheck:db-pos`
- [ ] `pnpm test:db-pos`
- [ ] `pnpm test:pos:offline`

Phase 1 verification on 2026-08-18:

- [x] scoped Prettier write/check for the two Kitchen runtime files, page index,
      and changed `pos-kitchen` documents — passed.
- [x] `git diff --check` for the Kitchen runtime files, page index, and pack —
      passed (Git reported only the existing LF-to-CRLF checkout warning).
- [x] `pnpm ui:pack:check pos-kitchen` — passed: 1 package, 0 warnings.
- [x] `pnpm docs:check` — passed: 36 current documents.
- [x] `pnpm architecture:check` — passed.
- [x] `pnpm typecheck:pos` — passed.
- [x] `pnpm -r --if-present typecheck` — passed for all participating workspace
      projects.
- [x] `pnpm build:pos` — passed after restoring missing generated Next/Lucide
      package files from a worktree using the same lockfile; `/kitchen` is
      emitted as a dynamic route.
- [ ] `pnpm test:pos` — 13 suites/56 tests passed; 3 suites/6 tests failed in
      existing shared Link/header tests because the repaired generated Next
      package contains a second React instance (`Invalid hook call`). No
      failure imports or exercises the changed Kitchen page.
- [ ] `pnpm format:check` — unchanged repository baseline failure: 1023 files;
      scoped Kitchen/Page Pack formatting passes.
- [ ] Browser/device evidence — intentionally deferred with Phase 5. No safe
      populated persisted Kitchen state was available and no transition was
      clicked to manufacture one.
- [ ] Site-agent/db-pos/offline suites — not run because Phase 1 changed no
      contract, persistence, command, runtime, or offline behavior.

Phase 2 verification on 2026-08-18:

- [x] `pnpm typecheck:pos` — passed.
- [x] `pnpm -r --if-present typecheck` — passed for all participating workspace
      projects.
- [x] targeted `test/kitchen-view.test.ts` — passed: 2/2 tests.
- [x] `pnpm build:pos` — passed; `/kitchen` remains a dynamic Server Component
      route.
- [x] `pnpm ui:pack:check pos-kitchen`, `pnpm docs:check`, and
      `pnpm architecture:check` — passed.
- [x] Scoped Prettier formatting — passed for every Phase 2 runtime, test, and
      page-pack file.
- [ ] `pnpm test:pos` — 14 suites/58 tests passed; the same 3 shared
      Link/header suites (6 tests) fail with the existing duplicated-React
      `Invalid hook call` dependency condition. The new Kitchen tests pass.
- [ ] `pnpm format:check` — unchanged repository-wide baseline failure: 1023
      files; scoped Phase 2 formatting passes.
- [ ] Full Phase 5 browser/device matrix remains unapproved; the targeted
      populated-state correction check below is not final Phase 5 evidence.

Populated-state correction evidence on 2026-08-18:

- [x] Production build and `pnpm typecheck:pos` passed.
- [x] Read-only browser QA used the ten local demo orders without invoking a
      transition.
- [x] At the browser's 1280px effective viewport, visible tickets measured
      288px wide and their order notes/allergy blocks measured 262px, matching
      the full inner width.
- [x] No visible ticket contained `POS-`; every compact action exposed
      `Préparer` or `Marquer prêt` through its accessible button name.

Dense TV implementation verification on 2026-08-18:

- [x] `pnpm typecheck:pos` — passed.
- [x] targeted `test/kitchen-view.test.ts` — passed: 4/4 tests, including mixed
      completion and projected counters.
- [x] `pnpm build:pos` — passed; `/kitchen` remains a dynamic route.
- [x] `pnpm -r --if-present typecheck` — passed for all participating workspace
      projects.
- [x] `pnpm ui:pack:check pos-kitchen`, `pnpm docs:check`, and
      `pnpm architecture:check` — passed.
- [ ] Full `pnpm test:pos` — 14 suites/60 tests passed; the same 3 shared
      Link/header suites (6 tests) fail with the existing duplicated-React
      `Invalid hook call` condition. Kitchen tests pass.
- [ ] `pnpm format:check` — unchanged repository-wide baseline failure: 1023
      files; scoped Kitchen and page-pack formatting passes.
- [ ] Post-build browser geometry — not claimed. Browser control loaded the
      populated read-only route before restart, but its localhost URL policy
      blocked the post-build 1920x1080 reload; no transition was clicked.

Compact confirmed-allergy correction on 2026-08-18:

- [x] Order-level allergy uses one compact full-width warning row and preserves
      a non-empty legacy allergy note without truncation.
- [x] Acknowledged order allergy and Kitchen-confirmed item allergy use a
      shield icon with an accessible name and title instead of the repeated
      `Cuisine informée` badge.
- [x] Confirmed item allergy reduces spacing while preserving the complete
      allergen, severity, and note summary.
- [x] Unconfirmed item allergy keeps the explicit full-width
      `Confirmer l'allergie` action and the Ready guard.
- [x] `pnpm typecheck:pos`, targeted Kitchen tests (4/4), and
      `pnpm build:pos` passed.

Ticket-level preparation correction on 2026-08-18:

- [x] One icon-only flame action appears in the header while a ticket contains
      `sent` rows and exposes `Tout préparer` as its accessible name.
- [x] The contract accepts only `kitchen`, `bar`, or `dessert` for
      `mark_station_preparing`; `none` is rejected.
- [x] Site-agent locks the order and updates every matching `sent` row in one
      transaction and statement without touching another station.
- [x] Replaying after no matching `sent` rows remain is a state-idempotent
      no-op.
- [x] Unfinished rows keep only the Ready action; ready-row corrections remain.
- [x] Contracts tests pass 30/30, site-agent tests pass 46 with 7 guarded
      integration tests skipped, and targeted POS tests pass 19/19.
- [x] Contracts, site-agent, POS, and full workspace typechecks pass;
      `pnpm build:pos`, UI pack, docs, and architecture checks pass.
- [x] POS and site-agent health return 200 / `ok` with the database `ready`
      after restart. No Kitchen transition was invoked solely for QA.

Two-state Kitchen queue correction on 2026-08-19:

- [x] The separate `En préparation` tab is removed; preparing remains an item
      status and contract state.
- [x] `À préparer` combines sent, preparing, and mixed-completion tickets.
- [x] `Prêt` contains only tickets whose active production rows are all ready.
- [x] Station links preserve the active/ready queue; legacy sent/preparing URL
      values safely resolve to active.
- [x] Station badges count unique order tickets across active and ready rows.
- [x] Targeted Kitchen and site-agent-client tests pass 19/19.
- [x] Read-only production verification shows `Cuisine 10`, `À préparer 10`,
      and `Prêt 0` for 10 persisted QA orders containing 55 item rows. No
      transition was invoked; the counters therefore demonstrate order-ticket
      counting rather than row counting.

Combined counter screen correction on 2026-08-19:

- [x] Station navigation exposes exactly two screen buttons: `Cuisine` and one
      compact two-line `Bar` / `Desserts` button.
- [x] `counter` displays persisted Bar and Dessert rows together; legacy `bar`
      and `dessert` URLs resolve to this combined screen.
- [x] The shared button exposes separate Bar and Desserts order numbers, while
      the combined active/ready queue counter counts that order only once.
- [x] Ticket prepare/undo uses the transactional `counter` command scope for
      both stations and leaves Cuisine rows unchanged.
- [x] Pure Kitchen tests pass 20/20, contracts pass 16/16, and the site-agent
      counter-scope unit tests pass 2/2. Database integration remains opt-in
      and was not run against live operational data.
- [x] Production-browser verification measures the combined button at 44px
      high with separate 12px Bar and Desserts text rows, the expected two
      selected links, and zero console errors.

Course/station ordering correction on 2026-08-19:

- [x] Cuisine unfinished rows sort exact live-catalog `Entrée`/`Entrées`
      categories first, then other categories by catalog and item sort order.
- [x] Counter unfinished rows sort Bar before Desserts regardless of insertion
      order; completed rows remain in the final ready partition.
- [x] Entrées use the warning-soft item surface and Bar uses the info-soft item
      surface; ready styling remains authoritative after completion.
- [x] The route performs one parallel local-catalog read and does not add a
      schema, migration, fixture, or category snapshot.
- [x] Targeted Kitchen tests pass 20/20. Production-browser verification shows
      warning-soft Entrées before Bún rows, info-soft Bar before Dessert rows
      in both mixed QA tickets, and zero console errors.

Ticket preparation undo correction on 2026-08-19:

- [x] A ticket with sent rows shows the flame action; a ticket with only
      preparing unfinished rows keeps the same header position with an undo
      icon and accessible `Annuler la préparation` name.
- [x] `mark_station_sent` accepts only Kitchen production stations and runs
      under the existing order lock/transaction.
- [x] Undo changes only matching preparing rows to sent; ready rows and other
      stations remain unchanged, and replay is state-idempotent.
- [x] Contracts tests pass 30/30, site-agent tests pass 46 with 7 guarded
      integration tests skipped, and targeted POS tests pass 18/18.
- [x] Read-only production-browser verification shows 3 undo controls for the
      three preparing tickets, 7 flame controls for sent tickets, and no
      console error. No Kitchen action was invoked solely for QA.

Compact ticket-header correction on 2026-08-19:

- [x] Service mode is a larger solid semantic badge: green for `Sur place`,
      amber for `À emporter`, and blue for `Livraison`.
- [x] The order note remains a separate full-width panel and omits only the
      redundant `Note commande:` prefix.
- [x] Header padding and note spacing are reduced without truncating content or
      changing any command, transition, or persisted data.
- [x] Read-only production-browser verification measures a 131px populated
      header, confirms 14px white-on-amber takeaway and white-on-green dine-in
      badges, finds no `Note commande:` prefix, and reports no console error.

Preparing-row label correction on 2026-08-19:

- [x] Preparing rows no longer repeat the `En préparation` badge.
- [x] The underlying preparing status, ticket-level undo action, Ready action,
      queue grouping, and transition contracts remain unchanged.
- [x] Read-only production-browser verification finds zero exact
      `En préparation` row labels, while all 3 ticket undo controls and 55 Ready
      controls remain present with no console error.

Header-action balance correction on 2026-08-19:

- [x] Ticket flame and undo controls occupy both header metadata rows as a
      vertically centered 44x44px square; item-level controls remain 44px.
- [x] Accessible names, titles, forms, commands, and status behavior remain
      unchanged.
- [x] The two-row action uses a 20px icon and does not introduce another header
      row or change its command behavior.
- [x] Read-only production-browser geometry confirms flame and undo at 44x44px,
      a 20x20px icon, a 111px populated header, and no console error.

Production-row balance correction on 2026-08-19:

- [x] Item names render in uppercase for stronger TV scanning.
- [x] Quantity uses a 32x32px marker with a 16px bold numeral, balanced against
      the unchanged 44x44px Ready control.
- [x] The denser visual treatment does not add padding or increase the row's
      minimum height.
- [x] Read-only production-browser geometry confirms an uppercase 15px/900 item
      name, 32x32px quantity marker with 16px/900 numeral, 44x44px Ready action,
      a compact 62px simple row, and no console error.
- [x] Quantity, single-line item name, and Ready control share the same measured
      vertical center; wrapped names remain centered as a content block.

Confirmed-allergy icon correction on 2026-08-19:

- [x] Confirmed order and item allergy alerts replace the leading warning
      triangle with the green shield icon.
- [x] No duplicate confirmation icon is appended at the end of either alert.
- [x] Unconfirmed alerts retain the leading warning triangle and explicit
      confirmation action.
- [x] Read-only production-browser verification confirms every acknowledged
      order/item alert has exactly one shield and it is the first icon; the
      unconfirmed alert still exposes its confirmation action with no console
      error.
- [x] The leading warning or confirmation icon is vertically centered against
      the alert text block at both order and item scope.

Ready-row action simplification on 2026-08-19:

- [x] Ready rows omit the redundant `Prêt` badge because their green-gray
      crossed-out treatment already communicates completion.
- [x] Ready rows expose only one correction control, `Réouvrir en préparation`;
      the second direct-to-sent control is removed from Kitchen.
- [x] The underlying service `mark_sent` capability remains unchanged and is
      not presented as a new or removed transport contract.
- [x] Read-only production-browser verification finds one ready row with zero
      `Prêt` badges, exactly one reopen button, no direct-to-sent button, and no
      console error.

Stable active-ticket ordering on 2026-08-19:

- [x] Active tickets sort oldest-first by earliest persisted sent timestamp,
      with order ID as a deterministic tie-breaker.
- [x] Sent, preparing, and mixed-completion states do not participate in the
      active comparator, so partial transitions preserve ticket rank.
- [x] A ticket leaves `À préparer` only when every active row becomes ready.
- [x] Targeted view tests cover identical ordering before and after sent →
      preparing/mixed transitions.
- [x] Read-only production-browser verification shows demo tickets in original
      `01` through `10` order even though ticket `03` is already preparing, with
      no console error and no QA transition invoked.

Ticket separation correction on 2026-08-19:

- [x] The status-colored top border remains 4 px while the neutral side and
      bottom borders are strengthened to 2 px.
- [x] Horizontal and vertical spacing between tickets increases from 10 px to
      14 px without adding internal whitespace.
- [x] Read-only production-browser geometry confirms 4 px top, 2 px side and
      bottom borders, and 14 px column gap and bottom margin on a 400 px ticket.

Interaction-height stability correction on 2026-08-19:

- [x] Completing the first row does not insert a `Terminés · N` heading or any
      other dynamic separator into the ticket body.
- [x] Completed rows still move below unfinished rows, retain crossed-out
      green-gray treatment, and expose the single reopen correction action.
- [x] The fixed header count remains the compact completion summary.
- [x] Read-only production-browser verification on the persisted mixed ticket
      shows `2 à faire · 1 terminé(s)`, exactly three item-body children, no
      `Terminés · N` heading, and the ready/reopen row last.

## Phase 5 visual and responsive QA on 2026-08-19

- [x] Product owner explicitly approved Phase 5.
- [x] The complete functional gate ran: POS/site-agent/db-pos typechecks,
      production POS build, offline disposable acceptance, Kitchen tests,
      site-agent tests, db-pos tests, docs, architecture, and page-pack checks.
- [x] The empty state passed at 1366x768, 1024x768, 768x1024, and 390x844 with
      exact viewport sizing and no document-level horizontal or vertical
      overflow.
- [x] Every visible action/filter target measured at least 44px high at all four
      viewports; desktop shell actions measured 48px or 56px where applicable.
- [x] Every viewport truthfully showed the local server/database available,
      `Service local`, and `Imprimante non configurée` states.
- [x] All six legacy station/queue URL combinations resolved without a browser error
      and showed the real empty state.
- [x] At 390x844, the filter strip measured 649px scroll width over a 390px
      client width, accepted free scrolling to its 259px maximum, and exposed
      the `Prêt` filter fully.
- [x] The responsive menu exposes `Commandes`, `Cuisine`, and `Gestion`; its
      focused trigger displayed the shared visible focus ring.
- [x] The Phase 5 accessibility correction adds `aria-current="page"` to the
      selected screen and selected queue links; production-browser verification
      found exactly the expected two current links in all legacy station/queue
      combinations.
- [x] Production-browser console errors: zero.
- [ ] Populated ticket geometry, horizontal ticket scrolling, independent long
      ticket scrolling, allergy priority, and direct-action states have not yet
      been re-run across the full four-viewport matrix after current-service QA
      orders became available.
- [ ] Hidden-tab refresh browser evidence is blocked because agent-created
      in-app-browser tabs remained `visibilityState=visible`; the source guard
      was inspected but is not claimed as runtime evidence.
- [ ] Full keyboard traversal was not claimed: the browser exposed a visible
      focus ring but did not advance focus through Tab key automation.
- [ ] Pending/error/recovery feedback remains unapproved and was not invented
      during QA.
- [ ] Full `pnpm test:pos` retains the known unrelated React/Next baseline: 60
      tests pass and 6 Link/header tests fail across 3 suites with
      `Invalid hook call`. Kitchen tests pass 19/19.
- [ ] Repository-wide `pnpm format:check` retains its unrelated baseline with
      1015 files; scoped Kitchen and page-pack formatting passes.

## Completion

Notification-driven refresh follow-up on 2026-08-19:

- [x] The strict event contract carries only type, boot-scoped revision,
      affected screen, reason, and timestamp; it contains no order/item payload.
- [x] `site-agent` publishes only after relevant mutation methods complete
      successfully, and station mutations target the matching Kitchen screen.
- [x] `/api/v1/kitchen/events` sends retry guidance, heartbeat comments,
      cache/buffering guards, and removes subscribers when clients close.
- [x] The POS proxies SSE through same-origin `/api/kitchen-events`; browsers do
      not connect to the internal site-agent address directly.
- [x] Matching events debounce refreshes, refreshes are coalesced while pending,
      and a 60-second visible polling fallback remains.
- [x] Hidden tabs disconnect; visibility/focus/online recovery reconnects and
      refreshes persisted state. Browser hidden-state evidence remains blocked
      by the in-app browser visibility limitation and is not overstated.
- [x] No schema, migration, durable event log, cloud synchronization, print job,
      or persistence ownership change was introduced.
- [x] A non-replayed send emits `ticket_created` only for screens represented by
      the pending production stations; idempotent replay never triggers sound.
- [x] The compact `Son` control explicitly unlocks browser audio, exposes
      pressed/accessibility state, persists local preference, and supports mute.
- [x] Only matching `ticket_created` events chime; ordinary state changes are
      silent and a 2.5-second cooldown collapses bursts.
- [x] Pure client tests cover matching screen, reason filtering, and cooldown.

- [x] Scoped functional tests, typecheck, and production build pass.
- [x] Phase 1 intentional deviations and deferred risks are recorded.
- [x] Stable pack matches the current as-built route through the Phase 5
      accessibility correction.
- [x] Package status remains `implemented`.
- [ ] Phase 5 is not fully closed until a safe current-service populated state
      permits the four-viewport ticket/action/allergy/scroll matrix.
