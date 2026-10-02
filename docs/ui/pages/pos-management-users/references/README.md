# POS management users references

Status: Final as-built evidence captured

Visibility: Engineering

Reference status: APPROVED

- `current-baseline-1366x768.png`: authenticated populated page at 1366x768.
- `current-baseline-edit-user-dialog-1366x768.png`: authenticated edit-admin
  dialog opened and cancelled without mutation.
- `design-proposal-01-desktop.png`: draft desktop overview generated from the
  current page and approved shared-shell references.
- `design-proposal-02-edit-user.png`: draft edit-user dialog and
  last-active-admin warning treatment.
- `design-proposal-03-narrow.png`: draft stacked narrow composition.
- `phase-01-implementation-1366x768.png`: authenticated Phase 1 desktop table.
- `phase-01-edit-admin-1366x768.png`: protected last-active-admin editor.
- `phase-01-implementation-390x844.png`: authenticated Phase 1 narrow cards.
- `phase-05-as-built-1366x768.png`: final desktop as-built overview.
- `phase-05-as-built-1024x768.png`: final compact landscape overview.
- `phase-05-as-built-768x1024.png`: final portrait tablet overview.
- `phase-05-as-built-390x844.png`: final narrow cards.
- `phase-05-edit-admin-390x844.png`: final protected admin editor.
- `phase-05-success-1366x768.png`: persisted no-op edit success feedback.
- `phase-05-validation-390x844.png`: mismatched-PIN validation with the editor
  retained; no PIN mutation occurred.

Captured 2026-08-13 from the real local stack and seed-backed data. These images
are implementation evidence, not authority for contracts, permissions, copy,
data, colors, or persistence. Shared shell evidence remains owned by the
printing, catalog, and combos packages and is linked from `DESIGN_HANDOFF.md`.

The generated proposals are approved for hierarchy, density, proportions,
spacing, and tone. Known non-authoritative details include exact raster
dimensions/styles and the enabled-looking last-admin deactivation action in
overview images; Phase 1 correctly renders that action disabled.

Phase 5 evidence was captured from the authenticated production build after
functional regression passed. The four viewport captures have no horizontal
document overflow. The final users-page actions and editor controls meet the
44 CSS-pixel POS target; browser warning/error logs were empty. The success
capture submitted an unchanged Kitchen user, and validation used mismatched PIN
values, so no user was created, deactivated, or assigned a new PIN.
