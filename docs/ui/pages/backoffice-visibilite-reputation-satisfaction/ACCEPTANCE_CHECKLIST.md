# Satisfaction client — Acceptance Checklist

Status: Phase 3A page-pack review gate

## Repository and application

- [x] Root and Backoffice instructions were read.
- [x] Current-state, authority, Reputation and current UI workflow documents
      were read.
- [x] Target application, route, cloud runtime boundary and Backoffice UI rules
      are identified.
- [x] Page is classified `EXISTING_PAGE` with implementation class `integrated`.
- [x] Current route, shell, auth, data, actions, tests and public-consumer seams
      were inventoried without UI code changes.
- [x] Authenticated OWNER baseline was captured with route, state, four
      viewports, date and local runtime/session conditions.
- [x] `DESIGN_HANDOFF.md` contains a ready-to-use design-generation prompt.
- [x] Global, application, section/flow and page context layers are resolved.
- [x] Shell mode is exactly `REUSE_CURRENT_TARGET`.
- [x] The prompt uses curated baseline/shared references rather than copied
      shared documentation.

## Scope and invariants

- [x] Approved Product scope is limited to one three-link section and one Save.
- [x] Current auth/session/trusted organization and establishment boundary is
      preserved.
- [x] Current Reputation data, contract and repository ownership are preserved.
- [x] Existing inbox actions and server-fixed `DIRECT` source are preserved.
- [x] MANAGER/STAFF inbox access remains distinct from OWNER-only settings.
- [x] Missing-row fail-closed/no-auto-create behavior is recorded.
- [x] Concurrent public trusted-boundary ownership was inspected and preserved.
- [x] No unsupported field, permission, route, API, schema, provider flow or
      capability is presented as implemented.

## Existing-page protection

- [x] Current route data was observed from safe persisted local records, not
      replaced with fixture behavior.
- [x] Existing loading, query, actions, validation and repository behavior were
      not modified in Phase 3A.
- [x] No polling, offline or device behavior was invented.
- [x] Existing route/navigation tests were identified; no behavioral test claim
      is made for this documentation-only phase.

## Design approval

- [x] Existing-page baseline status is `CAPTURED`.
- [x] Design prompt status is `READY`.
- [x] Product scope is `APPROVED` by the current OpenSpec artifacts.
- [x] Four proposed visual references were generated from the authenticated
      baselines at 1440, 1024, 768 and 390 px without overwriting baseline
      evidence.
- [x] Exact settings placement, field arrangement and Save alignment are
      recorded for every required width.
- [x] One stable header → metrics → inbox → settings DOM/visual order is recorded
      for every viewport, without CSS reordering or duplicate form instances.
- [x] Every required visual state has an unambiguous route-local treatment and
      exposes no internal token or identifier.
- [x] Page-pack/reference bytes are approved by the human reviewer.
- [x] Package progressed through `implementation-ready` before UI code.
- [x] `PAGE_PACK_APPROVED_BEFORE_UI_CODE` is approved.

## UI implementation

- [x] Existing shell reuse is verified after UI implementation.
- [x] OWNER settings section is implemented without changing navigation.
- [x] MANAGER/STAFF absence is verified in the implemented page.
- [x] `@yuta/ui`, semantic tokens and current icon language are verified in code.
- [x] Loading, empty, populated, dirty, invalid, saving, saved/no-change,
      error/retry, conflict/reload and unavailable states are implemented.
- [x] No autosave, partial Save, implicit provisioning or provider UI is
      introduced.

## Responsive and accessibility

- [x] Current baseline was captured at 1440, 1024, 768 and 390 px.
- [x] Proposed references cover the same four exact viewport dimensions.
- [x] Final implementation has no horizontal overflow at required widths.
- [x] Final keyboard order, focus recovery, labels and visible status are
      verified.
- [x] Final DOM order matches visual order at every breakpoint and keyboard
      traversal reaches inbox before settings without duplicate forms.
- [x] Final touch targets and mobile content reachability are verified.

## Phase 3A validation

- [x] `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction` passes.
- [x] Scoped Prettier check passes for attributable page-pack text/provenance.
- [x] `pnpm docs:check` passes.
- [x] `pnpm architecture:check` passes.
- [x] Strict OpenSpec validation passes.
- [x] `git diff --check` passes for attributable Phase 3A paths.
- [x] Repository-wide `pnpm format:check` is intentionally not claimed for
      Phase 3A.
- [x] Browser QA is intentionally not started.

## Completion

- [x] Phase 3B Backoffice UI/action is authorized and completed.
- [x] Phase 3C public safe rendering is authorized and completed.
- [x] Functional/regression verification precedes final Browser QA.
- [x] Page package is synchronized to as-built implementation.
- [x] Package status becomes `implemented` only after final verification.
