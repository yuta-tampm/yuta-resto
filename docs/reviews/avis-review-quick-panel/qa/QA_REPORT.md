# Browser QA

Change: avis-review-quick-panel

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA status: PASS

Route(s): /visibilite-reputation/avis; internal-profile /visibilite-reputation/satisfaction.

## Data/test setup

Actual production Backoffice build started on localhost:3104 with release-a exposure, normal owner login and establishment selection. The bounded internal regression used a second owned server on localhost:3105 against the same synthetic DB. PostgreSQL 17 ran in a task-labelled container with loopback port 54338 and tmpfs-only storage. Database and username identity were verified as yuta_avis_quick_panel_test before migrations/fixture writes. Forty synthetic Google items, one direct-feedback item, owner and STAFF memberships and a synthetic connector with no provider tokens exercised existing server reads/actions. Credentials were random and process-only. Google retrieval was disabled; browser non-loopback traffic was blocked and zero outbound attempts were observed. Other development databases were preserved.

Harness command: node .tmp-avis-quick-panel/runner.mjs; enter setup, dev, qa. Full qa run passed on its first generation. The earlier dev navigation race and resolving authenticated-heading wait are retained in Tasks and the Technical verification report. Only the ignored harness changed during that correction, with no auth/session weakening or product source change.

Runtime helper provenance (exact local bytes, outside the commit; these hashes identify the observed harness rather than a permanent test runner):

- Ignored local helper .tmp-avis-quick-panel/runner.mjs: e7d4dbce60902cb222562ca25d3284ccd53b4bad162ee103063880e9efbe12f1
- Ignored local helper .tmp-avis-quick-panel/browser.mjs: 9ebf4ee53fd33c39df4d01f9adee4b73c2395f6f319775c2fe5256aa84e0c0dd
- Ignored local helper .tmp-avis-quick-panel/fixture.ts: 7fe5a98c395173e4c50f19655f502c7893667401b145b07987f3144d0db97fc8

## Roles/states and viewports

OWNER editable review/draft/note/status; STAFF assigned draft editable with management disabled; STAFF unassigned review unavailable through real server scope; internal Satisfaction inline detail. Viewports: 1440x900, 1024x768, 768x1024 and 390x844.

## Scenarios tested

All 32 named scenarios in [qa-results.json](qa-results.json) passed:

- 1440: list-only with no inline editor.
- 1440: immediate named loading without old-item forms.
- 1440: correct requested item, right edge and zero horizontal overflow.
- 1440: keyboard containment, internally scrolling editor and accessible fixed close.
- 1440: Escape retains page/filter/scroll and restores opening-row focus.
- 1024: list-only with no inline editor.
- 1024: immediate named loading without old-item forms.
- 1024: correct requested item, right edge and zero horizontal overflow.
- 1024: keyboard containment, internally scrolling editor and accessible fixed close.
- 1024: Escape retains page/filter/scroll and restores opening-row focus.
- 768: list-only with no inline editor.
- 768: immediate named loading without old-item forms.
- 768: correct requested item, right edge and zero horizontal overflow.
- 768: keyboard containment, internally scrolling editor and accessible fixed close.
- 768: Escape retains page/filter/scroll and restores opening-row focus.
- 390: list-only with no inline editor.
- 390: immediate named loading without old-item forms.
- 390: correct requested item, right edge and zero horizontal overflow.
- 390: keyboard containment, internally scrolling editor and accessible fixed close.
- 390: Escape retains page/filter/scroll and restores opening-row focus.
- Direct selected URL opens the same modal.
- Note pending/success, same selection and unsaved draft preserved.
- Draft pending/success remains in same modal.
- Status treatment Save remains usable.
- Saved draft/note/status persist across reload; publication stays disabled.
- Named close button dismisses.
- Backdrop dismisses.
- Inaccessible selected ID shows unavailable with no stale forms.
- STAFF assigned review opens, draft enabled and management disabled.
- STAFF unassigned review denied by unchanged server scope.
- 1440: internal Satisfaction retains inline detail without modal.
- 390: internal Satisfaction retains inline detail without modal.

Pending was observed by delaying the actual local RSC/Save requests, without substituting responses or forms. Draft, internal-note and status Saves passed with the modal open. Reload retained saved values. Direct SQL readback additionally verified the synthetic draft and note bodies in the expected test database. Five query regression tests and existing full Backoffice tests independently cover URL semantics, rejected validation/server operations and reused error feedback. ErrorState retry is source-mapped; a full database outage was not induced in Browser QA.

## Accessibility checks

French dialog name/description; title initial focus; fifteen consecutive Tab steps remain contained; Escape, named close and backdrop work; closing restores the opening row focus with exact list-scroll ancestor positions. Fixed header/close remain available while the modal body scrolls. Keyboard/basic accessibility passed; screen-reader speech was not evaluated.

## Visual/responsive findings

All twelve actual screenshots inspected: full list before selection; right-anchored desktop/tablet panel; full-width mobile panel; internally scrolling existing editor/forms with reachable Save and close. No unexpected horizontal overflow or clipping of processing controls. Zero page/console errors.

## Regression findings

Filtered page 2, order/rating/search and exact scroll positions survive opening/closing. No modal opens on first-item loader fallback without explicit selection. Inaccessible selection never exposes old-item forms. Notes revalidation preserves an unsaved draft for the same review. Publication stays disabled. Internal Satisfaction retains inline detail at desktop and mobile.

## Known limitations

Local synthetic data proves the bounded UI and existing app/persistence flow; it does not prove real Google retrieval/publication, OAuth/provider readiness, production deployment or Human Product acceptance. Dismissal exits the editor without automatically saving unsaved edits, as approved in Design/current documentation. Existing server permissions and persistence implementations were not changed. No unrelated cloud/local suite or environment prerequisite was enabled.

## Screenshot evidence

[screenshot-manifest.md](screenshot-manifest.md) lists every file, viewport, role/state, scenario and exact lowercase SHA-256. Representative images: [desktop panel](panel-1440.png), [tablet panel](panel-768.png), [mobile panel](panel-390.png), [mobile editor](editor-390.png). The machine results contain all 32 checks, image capture metadata and persisted readback booleans.
