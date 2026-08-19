# Codex Prompt — Phase 2: POS Kitchen Component Refactor

Run only after approved Phase 1 is reviewed. Extract route-local units by real
responsibility: station/status navigation, order-group presentation, item
details/allergy, and transition feedback where justified. Keep data loading in
the Server Component and the 10-second client refresh boundary minimal.

Reuse current `@yuta/ui` primitives. Do not force the unused shared
`KitchenTicket` into the route or change it without proven cross-consumer need.
Do not move contracts, service validation, order recalculation, transaction
logic, polling authority, or device behavior into React. Preserve markup,
actions, focus, and behavior; run scoped tests/evidence and stop before Phase 3.
