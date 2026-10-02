# QA report — Reputation review/social links

Change: `reputation-review-social-links-configuration`

QA status: `PASS`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES`

Date: `2026-09-06` (Europe/Paris)

## Environment and data boundary

- Backoffice: real local route on `http://localhost:3001`.
- Feedback Web: real local route on `http://localhost:3006/luna`.
- Database: disposable PostgreSQL 17 container on loopback port `56061`,
  database `yuta_reputation_browser_test`.
- Users: synthetic seed OWNER and MANAGER; the synthetic MANAGER membership was
  changed to STAFF only inside the disposable database for the STAFF check.
- Feedback submissions: three synthetic local submissions without customer
  identity/contact data.
- No Google, Facebook, or Instagram destination was opened. No production data,
  provider call, deployment, or production configuration was used.

## Responsive implementation

| Viewport | Result | Evidence                                                                                                   |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| 1440×900 | PASS   | Header and metrics precede the two-column inbox; the compact full-width settings card follows the inbox.   |
| 1024×768 | PASS   | Inbox remains first; Google uses the full row, Facebook/Instagram share the next row, Save is lower-right. |
| 768×1024 | PASS   | Inbox remains first; all three fields stack; settings remain reachable in normal document flow.            |
| 390×844  | PASS   | Mobile shell is usable; fields stack; Save is full width; no footer/navigation overlap blocks the form.    |

At every width, measured browser state reported one settings region, one form,
aligned DOM/visual order, and no horizontal overflow. No CSS order or duplicate
desktop/mobile form was found.

## OWNER states

| State                     | Result                       | Evidence                                                                                                                                                                                                   |
| ------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empty/null                | PASS                         | Seeded scoped settings row with all three values null; Save disabled until a valid change.                                                                                                                 |
| Populated                 | PASS                         | Three accepted provider URLs render after a successful Save.                                                                                                                                               |
| Dirty                     | PASS                         | Visible “Modifications non enregistrées”; Save enabled only for a valid dirty draft.                                                                                                                       |
| Invalid after blur        | PASS                         | Invalid HTTP Google value remained in the field; visible associated error; `aria-invalid=true`; `aria-describedby=review-social-links-googleReviewUrl-error`; Save disabled.                               |
| Corrected valid           | PASS                         | Editing to approved HTTPS URLs removed the stale field error and enabled Save.                                                                                                                             |
| Saving/pending            | PASS with technical evidence | The real local transition completed too quickly for a distinct truthful screenshot. Component/model tests prove pending disablement and duplicate-submit prevention; no screenshot is labelled as pending. |
| Saved                     | PASS                         | Database-backed action committed and the UI displayed authoritative values with Save disabled.                                                                                                             |
| No change                 | PASS                         | Browser normalization kept Save disabled for an equivalent trimmed value; repository D2 tests prove no mutation/audit for authoritative no-change.                                                         |
| Conflict/reload           | PASS                         | Two OWNER tabs produced a stale conflict. No overwrite occurred; Enter on “Recharger les valeurs” loaded the authoritative Google/Facebook values and cleared conflict state.                              |
| Server error/retry        | PASS                         | A temporary test-only PostgreSQL update trigger forced failure. The draft was preserved and Retry was shown. After removing the trigger, Retry committed successfully.                                     |
| Configuration unavailable | PASS                         | Removing only the scoped disposable settings row produced “Configuration indisponible”; fields and Save remained disabled; no row was synthesized.                                                         |

## Role behavior

- OWNER: inbox and settings available under trusted active LUNA membership.
- MANAGER: existing Direct Customer Feedback inbox remained available; no
  settings model, heading, region, or form appeared.
- STAFF: route kept its current scoped behavior; no settings heading, region,
  form, or settings value appeared. The synthetic STAFF had no assigned current
  feedback, so the inbox correctly showed zero visible records.
- Browser claims were not used. Focused server-action tests separately prove
  authorization-before-parse, ignored browser scope/role claims, and preserved
  403/tenant denial behavior.

## Public success rendering

| Configuration      | Result                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------- |
| All three accepted | PASS — exactly three correctly labelled CTAs.                                                 |
| Mixed              | PASS — valid Google shown; null Facebook hidden; deliberately unsafe legacy Instagram hidden. |
| All null           | PASS — no provider CTA or public-sharing prompt.                                              |

For all three accepted links, DOM inspection confirmed the exact safe projected
URL, `target="_blank"`, and `rel="noopener noreferrer"`. No raw unsafe fallback
was present. The normal five-step feedback flow completed three times with HTTP
201 responses from the local endpoint.

## Accessibility and interaction

- Major DOM order equals visual order: header → metrics → inbox → settings.
- Keyboard Tab moved away from an invalid Google field without a focus loop.
- Invalid fields expose visible text plus field-associated ARIA attributes.
- Conflict reload was operated with Enter and recovered authoritative state.
- Focus rings were visible on fields and the Save action.
- Conflict, unavailable, dirty, and server-error states all include explicit
  text; none relies on color alone.
- Mobile controls and Save remained reachable without horizontal scrolling.
- Internal state tokens, organization/establishment IDs, audit IDs, and raw
  persistence JSON did not appear in visible page content.

## Supporting non-browser evidence

- Contracts provider-policy test: 54/54 focused tests PASS.
- Backoffice action/component/model tests: 27/27 focused tests PASS.
- Public CTA render test: 7/7 tests PASS.
- Disposable PostgreSQL Reputation suite: 15/15 tests PASS with zero skipped.
- Backoffice and Feedback Web builds: PASS.

The screenshot inventory and exact SHA-256 values are in
[`screenshot-manifest.md`](screenshot-manifest.md).

## Deviations and limitations

- A distinct pending screenshot was intentionally not retained because the
  local transition completed before a truthful pending frame could be captured;
  executable interaction tests are the evidence for that transient state.
- Three redundant/mislabelled intermediate screenshots created during capture
  were removed before finalizing the manifest. No accepted evidence image was
  deleted.
- Repository-wide formatting remains separate from scoped formatting and is
  reported in VERIFY; this QA result does not claim repository-wide format
  cleanliness.
