# Codex Prompt — Phase 2: Component Refactor

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

For the approved combo-completion slice, implement a pure, tested projection
that shares the authoritative combo optimizer semantics. It may return rule and
candidate item identifiers, but catalog availability/copy mapping remains in
POS. Cover overlap/priority, maximum applications, already-complete rules,
multi-step exclusion, duplicate candidates, and stale references. Do not place
matching or pricing logic in React.
