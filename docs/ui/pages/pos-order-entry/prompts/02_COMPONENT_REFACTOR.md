# Codex Prompt - Phase 2: POS Order Entry Component Refactor

Run only after Phase 1 approval. Preserve its approved appearance and every
Phase 0 invariant.

Extract route-local components only for meaningful form/state/action or
server/client responsibilities. Keep trusted loading and creation in Server
Components/Server Actions, reuse `@yuta/ui`, and do not promote order-entry
business UI to the shared package without independent reuse.

Do not alter fields, validation, employee eligibility, redirect, contracts,
site-agent/db-pos ownership, shell, or tests. Run affected checks and provide
browser evidence. Stop before Phase 3.
