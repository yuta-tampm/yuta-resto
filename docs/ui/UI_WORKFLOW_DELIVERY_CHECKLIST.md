# YUTA UI Workflow Delivery Checklist

Status: Current companion checklist

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-12

## Before design

- [ ] Target application is identified from repository evidence.
- [ ] Target type is recorded as `PAGE`, `SCREEN`, `SURFACE`, or `FLOW`.
- [ ] Real route/entry point is located when it exists.
- [ ] Phase 0 repository analysis is read-only.
- [ ] Target is classified `NEW_PAGE` or `EXISTING_PAGE`.
- [ ] The applicable mode from `DELIVERY_WORKFLOW_MODES.md` is recorded as
      `EXISTING_CAPABILITY_RENEWAL` or `NEW_CAPABILITY_DISCOVERY`.
- [ ] Implementation class is identified.
- [ ] Current shell/components/data/actions/tests are inventoried.
- [ ] YUTA-global, application, section/flow, and page context layers identify
      their owners, sources, approval states, exact reuse, allowed adaptation,
      exclusions, and blockers.
- [ ] Exactly one shell/navigation mode is selected and records the header,
      sidebar, mobile navigation, account/session area, real routes,
      unavailable routes, and forbidden invented elements.
- [ ] Missing shared context is blocked or handled as a separate cross-page
      proposal; the page design tool is not asked to invent it.
- [ ] The curated design-tool bundle contains the target baseline, applicable
      approved shared references, common responsive/state constraints, page
      hierarchy, and explicit exclusions.
- [ ] Protected invariants are recorded.
- [ ] Unsupported mockup concepts are separated from current capabilities.
- [ ] Expected change impact is recorded.
- [ ] `Inventory status` is `COMPLETE` before design scope is finalized.
- [ ] Current authenticated browser/device baseline is captured for an existing
      target, including route/state, viewport/device, date, and runtime/session
      conditions; otherwise the exact blocker is recorded.
- [ ] `DESIGN_HANDOFF.md` contains a self-contained prompt ready for
      ChatGPT/ImageGen or another approved design tool.

## Before final package

- [ ] Existing-page `Baseline status` is `CAPTURED`; new-page status is
      `NOT_APPLICABLE`.
- [ ] `Design prompt status` is `READY`.
- [ ] `Shared context status` is `RESOLVED`.
- [ ] Product/interaction scope is approved.
- [ ] `Scope status` is `APPROVED`.
- [ ] Visual direction is approved or an explicit no-image-reference decision
      is recorded.
- [ ] Reference metadata is `APPROVED` where an image is used.
- [ ] Design does not infer new API/schema/permission/runtime/device capability.
- [ ] Existing application shell is preserved unless shell work is in scope.
- [ ] Shared-context fidelity and page-specific fidelity are reviewed
      separately.
- [ ] Every navigation item maps to an approved real route or is explicitly
      unavailable; no page mockup creates application IA or dead links.
- [ ] Final package uses the stable page slug.
- [ ] Required files and six prompts are present.
- [ ] `pnpm ui:pack:check <page-slug>` passes for the declared lifecycle state.
- [ ] Exact existing repository verification commands are documented.
- [ ] Package status is `implementation-ready` only when the inventory,
      invariants, scope, references, implementation plan, and acceptance
      criteria are complete.

## Before implementation

- [ ] Codex re-runs Phase 0 against the current repository state.
- [ ] Repository drift since design approval is reported.
- [ ] For existing integrated/device-coupled targets, fixture replacement is
      forbidden.
- [ ] Component reuse is evaluated before creating new components.
- [ ] Unexpected architecture/data/auth/runtime changes trigger review.

## Before visual parity claim

- [ ] Functional/regression checks pass or failures are explicitly reported.
- [ ] Phase 05 starts only after the functional/regression gate.
- [ ] Target application typecheck/tests/build were run as required.
- [ ] Affected runtime/domain/contract/database/offline/device checks were run
      when behavior changed.
- [ ] Browser/device evidence exists.
- [ ] Approved hierarchy/proportions/density/spacing are reviewed.
- [ ] Responsive/touch/accessibility behavior is reviewed.
- [ ] Protected business/runtime behavior remains intact.

## Before completion

- [ ] Intentional deviations are documented.
- [ ] Deferred proposals and risks are documented.
- [ ] Current product/operator/QA docs are updated when behavior changed.
- [ ] Stable page package matches the as-built implementation.
- [ ] Package status is `implemented` only after as-built sync.
- [ ] Documentation index and consistency checks include every new current
      workflow document.
- [ ] If workflow lifecycle, phases, classifications, fixture rules, approval
      gates, vertical slices, completion criteria, page-pack behavior,
      templates, prompts, checklist, or tooling changed,
      `DELIVERY_WORKFLOW_MODES.md` and every affected canonical workflow
      artifact were updated in the same change.
- [ ] No duplicate `v2`, `v3`, `new`, `final`, or `latest` package was created.
- [ ] No non-existent or unexecuted command is reported as passed.
