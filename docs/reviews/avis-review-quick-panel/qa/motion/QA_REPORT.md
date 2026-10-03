# Motion correction Browser QA

Change: avis-review-quick-panel

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA status: PASS

Human retest status: ACCEPTED on 2026-10-03 by the current user's actual reply, "Đã thấy trượt vào/ra, tương tác ổn" (translation: sliding in/out is visible and interaction works). This affected open/close acceptance is separate from automated QA and applies to review-quick-panel.tsx fa9c1ee99c0e07ec5b59643e03e8792e312aa9eb55ae3e6eb0bf807c39259056 and review-quick-panel.module.css 11743c7dfa347f7dcf0fd720b316f0e71b03248a1667de32784c048a51dfbefc. It does not approve Gate 3, provider actions or production readiness.

Route(s): /visibilite-reputation/avis; internal-profile /visibilite-reputation/satisfaction.

## Data/test setup

Correction base c2981864dbf91a192c89f93e1b75f3a166a59827. Rebuilt production Backoffice used normal synthetic OWNER/STAFF authentication on an owned release-a server localhost:3104 and temporary internal server localhost:3105. A new task-labelled PostgreSQL 17 container yuta-avis-motion-60531c05, exact ID 6c916f41529bf9949a59b5bdc5e8396297dadba1e9e9ff9d6d82eceb194bdd88, exposed only loopback 54338 and used tmpfs-only storage. DB and username yuta_avis_quick_panel_test were verified before migrations/fixture writes. Forty synthetic Google reviews, one DIRECT item, current tenant/roles and token-free connector used existing app repositories/actions. Random credentials were process-only, retrieval disabled, provider env blanked, all non-loopback browser traffic blocked. Other databases and the user's dev process localhost:3001 were preserved. Owned servers/container stopped and removed after QA.

Harness command: node .tmp-avis-quick-panel/motion-runner.mjs; setup, dev, qa, stop. Correction dev generation 1 PASS and full motion QA generation 1 PASS; no failed correction or recovery run. Original historical harness and evidence were not overwritten. Helper identities: motion-runner.mjs c212d2c26f9148d87a2ff4e4541414c31f2b7fe5e4996d728e6432f3f606bf41; motion-browser.mjs 3441f94953dfd06c4768e89b612fb26fa28c39dac371ecf1307d4bc7932f5eb9; fixture.ts 7fe5a98c395173e4c50f19655f502c7893667401b145b07987f3144d0db97fc8. Helpers are ignored local observation tools, not production code or a permanent test framework.

## Roles/states and viewports

OWNER editable draft/note/status; STAFF assigned draft editable and management disabled; STAFF unassigned unavailable through real server; internal Satisfaction inline. Viewports 1440x900, 1024x768, 768x1024, 390x844; mobile reduced-motion also observed.

## Scenarios tested

All 47 named scenarios PASS in [qa-results.json](qa-results.json):

- 1440: list-only with no inline editor.
- 1440: immediate named loading without old-item forms.
- 1440: correct requested item, right edge and zero horizontal overflow.
- 1440: keyboard containment, internally scrolling editor and accessible fixed close.
- 1440: Escape retains page/filter/scroll and restores opening-row focus.
- 1440: actual 280ms entrance moves from right to settled panel.
- 1440: actual 200ms exit moves right before DOM removal.
- 1440: exiting editor remains mounted without loading/unavailable flash and cannot receive pointer input.
- 1024: list-only with no inline editor.
- 1024: immediate named loading without old-item forms.
- 1024: correct requested item, right edge and zero horizontal overflow.
- 1024: keyboard containment, internally scrolling editor and accessible fixed close.
- 1024: Escape retains page/filter/scroll and restores opening-row focus.
- 1024: actual 280ms entrance moves from right to settled panel.
- 1024: actual 200ms exit moves right before DOM removal.
- 1024: exiting editor remains mounted without loading/unavailable flash and cannot receive pointer input.
- 768: list-only with no inline editor.
- 768: immediate named loading without old-item forms.
- 768: correct requested item, right edge and zero horizontal overflow.
- 768: keyboard containment, internally scrolling editor and accessible fixed close.
- 768: Escape retains page/filter/scroll and restores opening-row focus.
- 768: actual 280ms entrance moves from right to settled panel.
- 768: actual 200ms exit moves right before DOM removal.
- 768: exiting editor remains mounted without loading/unavailable flash and cannot receive pointer input.
- 390: list-only with no inline editor.
- 390: immediate named loading without old-item forms.
- 390: correct requested item, right edge and zero horizontal overflow.
- 390: keyboard containment, internally scrolling editor and accessible fixed close.
- 390: Escape retains page/filter/scroll and restores opening-row focus.
- 390: actual 280ms entrance moves from right to settled panel.
- 390: actual 200ms exit moves right before DOM removal.
- 390: exiting editor remains mounted without loading/unavailable flash and cannot receive pointer input.
- 390: reduced-motion disables entrance/exit without blocking close.
- Already available first-item detail opens directly without artificial loading delay.
- Closing during delayed selection remains closed after the pending response settles.
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

## Actual motion measurements

A document observer records computed CSS and transform translation on animation frames of the named review modal in the real page; it does not alter component/response data. Four entrance and four exit traces are retained in qa-results.json, with compact readback in [motion-summary.json](motion-summary.json).

| Width | State  | Frames | CSS duration | Min X | Max X | Stable noninteractive exit content |
| ----- | ------ | ------ | ------------ | ----- | ----- | ---------------------------------- |
| 1440  | open   | 35     | 0.28s        | 0     | 672   | N/A                                |
| 1440  | closed | 17     | 0.2s         | 0     | 672   | true                               |
| 1024  | open   | 35     | 0.28s        | 0     | 672   | N/A                                |
| 1024  | closed | 18     | 0.2s         | 0     | 672   | true                               |
| 768   | open   | 35     | 0.28s        | 0     | 672   | N/A                                |
| 768   | closed | 17     | 0.2s         | 0     | 672   | true                               |
| 390   | open   | 35     | 0.28s        | 0     | 390   | N/A                                |
| 390   | closed | 17     | 0.2s         | 0     | 390   | true                               |

Entrance moves from 672px (desktop/tablet) or 390px (mobile) to 0 over 280ms. Exit moves from 0 to the same width over 200ms before DOM removal; closing content retains its editor with pointer-events none and no loading/unavailable replacement. Reduced-motion selects animation none and dismissal remains usable. Actual selected-item RSC responses were delayed locally by 500ms, with no substituted response, to observe named loading/no old forms; POSTs were delayed by 250ms for pending feedback. An already loaded first item opens directly without fake loading. Closing while a selection request is delayed remains closed after its response settles.

## Accessibility, visual and regression findings

French name/description; title focus; fifteen Tab steps contained; Escape/X/backdrop work; focus and exact list scroll/filter/page return. Body scroll and fixed close/header remain accessible, with no horizontal overflow. All thirteen screenshots inspected. Existing note/draft/status Saves and same-item unsaved input continuity passed; reload and direct SQL readback confirmed synthetic saved draft/note. Publication stayed disabled. OWNER/STAFF and internal Satisfaction regression passed. Zero page/console errors and zero outbound attempts.

## Known limitations and history

The prior user's complaint and observed animation none/0s are a proven implementation defect: current Tailwind emits no CSS for shared animation utility classes. Original static/state PASS was insufficient for motion and remains historical rather than relabelled. The correction supplies explicit route-local keyframes and does not edit shared Dialog, dependencies, server scope, persistence, provider actions or Product requirements. Automated QA PASS and the separately accepted affected Human retest do not approve independent Gate 3, production readiness or real provider actions. Screen-reader speech and full DB outage were not tested. Reused validation/error/denial coverage belongs to source and existing Backoffice tests.

## Screenshot evidence

[screenshot-manifest.md](screenshot-manifest.md) gives exact paths, viewports, roles/states/scenarios and lowercase SHA-256. Key images: [desktop](panel-1440.png), [tablet](panel-768.png), [mobile editor](editor-390.png), [reduced-motion mobile](reduced-motion-390.png). The motion trace is the primary evidence for sliding; screenshots alone never prove it.
