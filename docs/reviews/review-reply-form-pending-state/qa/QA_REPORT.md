# Browser QA — Review Reply Form Pending State

- Change: `review-reply-form-pending-state`
- Assessed: 2026-09-25 (Europe/Paris)
- `UI_AFFECTING: YES`
- `BROWSER_QA_REQUIRED: YES`
- QA status: **PASS**
- Route: `/visibilite-reputation/avis?selected=019faa29-fe48-70d9-8021-d4f73b4b50bf` on local Backoffice `localhost:3001`
- Browser: installed Chrome, headless, driven by the existing local Playwright dependency; no browser, test, or application dependency was added.
- Viewports: desktop `1366x768`; mobile `390x844`.

## Runtime, data, and scope

The authenticated OWNER seed account selected establishment LUNA and the existing Antoine Petit Google demo review. The real Backoffice, Server Action, and cloud development database were used. The database container retained its named volume and was reachable through the previously approved process-only host port `56431`. The script read the existing local seed credential privately; no credential was added to the repository or QA evidence. The existing 175-character draft was submitted unchanged. No provider publish action was invoked. A read-only post-QA database query returned `GOOGLE|true|DRAFTED|1` (source, demo marker, feedback status, reply count).

The production and focused-test candidate SHA-256 values remained `d219e4d03174b3c41be9a1deae6d65cd32e73e604109e927dc93514cb41b7db8` and `2e793f1b3e094e8fee6038ac019b2c7266cecb8888b4a8904516cae2ef317f6e`. Browser QA changed no implementation, test source, Server Action, provider, schema, auth, or shared UI file.

## Scenarios tested

| State or behavior          | Desktop result                                                                                                        | Mobile result                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Idle                       | `Enregistrer` visible and enabled; no button `aria-busy` or `data-loading`; textarea enabled.                         | Same at `390x844`.                                                                        |
| Genuine save pending       | `Enregistrement du brouillon…` visible; submit disabled; button `aria-busy="true"` and `data-loading` present.        | Same; long label wraps inside the button without clipping or collision.                   |
| After actual Server Action | Existing `Brouillon enregistré.` message visible; idle label and enabled state restored; button busy markers removed. | Same after a separate actual save.                                                        |
| Preserved form controls    | Textarea stayed enabled; form itself did not acquire `aria-busy`; Google publish button stayed disabled.              | Same.                                                                                     |
| Layout                     | Document width equaled viewport width; no horizontal overflow.                                                        | Document width equaled viewport width; both action buttons remained distinct and legible. |

The save button was reachable from the textarea with Tab and had a visible focus outline. Pressing Enter while it was focused submitted the real form and produced the existing success message. No focus trap was observed. The final desktop/mobile run and the additional keyboard-submit run produced zero browser console errors and zero browser console warnings.

## Visual and regression findings

Seven real session screenshots cover idle, pending, completion, and keyboard focus. Their exact-byte SHA-256 hashes and role, state, scenario, and viewport are in [screenshot-manifest.md](screenshot-manifest.md). The desktop and mobile pending captures show the French label in the actual pending interval. The mobile label wraps across two lines within the existing button. The textarea, publication control, surrounding review detail, and saved-result presentation retained their expected appearance. No visual or responsive regression was observed in the changed area.

## Known limitations

- Pending duration is controlled by the real local Server Action and can vary; no artificial delay or network throttling was used.
- The Browser QA role was the authorized OWNER seed identity. The non-pending disabled paths and error message rendering were covered by the focused component tests in Technical VERIFY; no provider failure or permission denial was manufactured in the browser.
- This is a basic keyboard and accessibility check of the changed control, not a full accessibility audit or production/provider readiness assessment.
- The local DB port override is process-only; the Windows-reserved default port `55431` remains unsuitable for this session without that override.

## Conclusion

The approved pending-label behavior passed real-route desktop and mobile Browser QA with persisted draft save, native busy/disabled semantics, preserved textarea/form behavior, keyboard submission, clean console, and screenshot evidence. This QA result is independent of `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`, `VERIFY: PASS`, and the current user's `HUMAN_PRODUCT_VALIDATION: ACCEPTED`. It establishes only Gate 3 eligibility for human review; it does not approve Gate 3.
