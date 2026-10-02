# Codex Prompt — Phase 2: Component Refactor

For the active receipt initiative, Phase 1 is approved and Phase 2 boundary
documentation is complete. Do not refactor runtime code until PB2-01 through
PB2-14 and Phase 3 are explicitly approved. Preserve the current Server
Component route, shared shell behavior, service-time trust boundary, and
site-agent printer ownership.

The approved Phase 2 proposal is:

- add an optional additive `pageMenuActions` slot without copying navigation;
- isolate controlled disclosure/focus behavior in a small POS-wide
  `PosHeaderMenu` client component;
- keep `PosPageShell`, `PosHeader`, and `page.tsx` server-owned;
- keep receipt presentation and interaction route-local;
- use a thin validated Server Action and server-only POS adapter;
- enable only paid order/check targets and never infer equal-split items;
- poll only the selected pending/printing job while its status UI is visible;
- distinguish queue, printer availability, failure, printed, retry, and
  immutable-snapshot reprint.

Refactor only after the Phase 1 visual baseline is reviewed. Preserve the
approved appearance and all Phase 0 protected behavior.

Extract components by business responsibility, state/mutation ownership,
testability, or server/client/runtime boundary. Keep page-specific components
near the route, keep Server Components by default, isolate minimal client
boundaries, and reuse `@yuta/ui`.

Do not create thin wrappers solely to reduce line count or promote a component
to `@yuta/ui` before independent reuse is demonstrated.

Do not move trusted data loading, authorization/local-session checks,
transaction logic, printer/device ownership, or domain calculations into
client presentation code.

Run affected existing typechecks/tests and provide browser evidence. Do not
perform Phase 3 automatically.
