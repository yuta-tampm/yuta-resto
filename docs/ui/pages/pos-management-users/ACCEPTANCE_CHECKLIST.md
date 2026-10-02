# POS management users - Acceptance Checklist

Status: Complete

Visibility: Engineering

- [x] Existing integrated local POS screen identified; fixture replacement forbidden.
- [x] Authenticated desktop and dialog baselines captured without mutation.
- [x] Shared context resolved as `REUSE_APPROVED_SHARED_SHELL`.
- [x] Local session, site-agent, db-pos, contract, role, PIN, and history boundaries mapped.
- [x] Ready design prompt and unsupported concepts recorded.
- [x] Product owner reviews generated design and explicitly approves Phase 1.
- [x] Real loaders/actions and admin/manager enforcement remain unchanged.
- [x] No hard delete, PIN exposure, cloud sync, invented role, or new permission.
- [x] Populated, empty, unavailable, pending, validation, conflict, forbidden,
      stale, success, and expired-session states are truthful.
- [x] Phase 1 keyboard focus, accessible names, touch targets, and dialog
      containment pass at captured states.
- [x] No horizontal overflow at the POS viewport matrix.
- [x] Phase 1 targeted tests, POS typecheck, and POS build pass.
- [x] Route-local composition, responsive overview, dialog/form state, and pure
      model responsibilities are separated without changing runtime behavior.
- [x] Phase 2 focused model tests, POS typecheck, POS build, authenticated
      desktop/narrow regression, and clean browser console pass.
- [x] Phase 3 errors preserve entered values and expose assertive feedback plus
      stale/load recovery where applicable.
- [x] Phase 3 success, expired-session redirect, focus return, Escape close,
      pending guard, 44-pixel dialog targets, and narrow containment pass.
- [x] Every field and mutation is traced through contract, server-only client,
      site-agent authorization/service, and db-pos ownership.
- [x] Focused database integration proves manager limits, normalized email
      uniqueness, concurrent last-admin safety, PIN hashing, and authVersion
      invalidation with fixture/state cleanup.
- [x] Strict contract coverage rejects PIN hashes from user responses.
- [x] The current unauthenticated pre-session user listing is documented; any
      narrower login-candidate API remains outside this approved phase.
- [x] Final browser evidence and as-built package are synchronized.
