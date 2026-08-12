# Codex Prompt — Phase 2: Prototype Component Boundaries

After Phase 1 review, preserve the approved fixture truthfulness, shell,
states, and exclusions. Extract route-local components only for meaningful
responsibility, state ownership, testability, or server/client boundaries.
Keep Server Components by default, minimize client surfaces, reuse `@yuta/ui`,
and do not promote employee-specific components prematurely.

Do not create a client-side employee domain, move trusted scope to the browser,
or add production integration. Run affected checks, provide evidence, and stop.
