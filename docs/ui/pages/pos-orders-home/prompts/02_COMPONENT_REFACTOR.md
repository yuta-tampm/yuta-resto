# Phase 02 — POS Orders Home Component Refactor

Run only after explicit Phase 2 approval and after the approved Phase 1 baseline is stable.

Extract components by operational responsibility only when it improves ownership/testability: Home view/search navigation, order presentation, status/action mapping, and truthful empty/error states are candidates. Reuse POS-wide shell components and `@yuta/ui`; keep Home business UI under the route's `_components`/`_lib` as appropriate.

Do not change loader calls, service-day/search/status semantics, Server/Client boundaries, routes, actions, contracts, health polling, auth, or transaction ownership. Do not refactor adjacent `/pos`, items, detail, kitchen, payment, or management routes opportunistically.
