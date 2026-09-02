## 1. Cloud schema and migration

- [x] 1.1 Add the dedicated `restaurant_knowledge_cuisine_know_how` schema with exact composite tenant scope and three nullable descriptive values; verify schema tests prove columns, nullability, keys, and Establishment Profile separation.
- [x] 1.2 Generate and review one additive cloud migration plus journal snapshot changes; verify a disposable database applies the migration successfully without changing existing Restaurant Knowledge tables.

## 2. Restaurant Knowledge repository

- [x] 2.1 Add whole-slice get/save repository operations using trusted organization and establishment scope; verify focused repository tests cover missing-row empty projection and full round trip.
- [x] 2.2 Add disposable-database integration coverage for all-empty, each single-value state, whole-slice persistence, wrong organization, wrong establishment, and mismatched composite scope; verify the integration suite passes.

## 3. Page-local authorization and server boundary

- [x] 3.1 Add a READ-gated Cuisine/know-how loader and MANAGE-derived edit capability without changing permission mappings; verify OWNER/MANAGER load and STAFF denial tests pass without unauthorized repository reads.
- [x] 3.2 Add a MANAGE-gated page-local whole-slice save action with boundary-only parsing and empty-to-null normalization; verify OWNER/MANAGER save exactly once, STAFF is denied before persistence, and no Profile/menu repository is invoked.

## 4. UI and interaction

- [x] 4.1 Add a route-local three-value draft model and focused tests proving independent updates and valid empty/single-value states.
- [x] 4.2 Add the dedicated `Cuisine & savoir-faire` fields/form with exactly three labels, one whole-slice submit, read-only behavior without MANAGE, failure recovery, and no autosave; verify component tests cover dirty, pending, submit-count, and field-change behavior.
- [x] 4.3 Compose the new READ-visible section into `Informations générales` independently of Establishment Profile and Concept/Histoire forms; verify page/loader tests preserve each capability boundary.

## 5. Boundary and regression verification

- [x] 5.1 Verify Restaurant Knowledge READ/MANAGE, OWNER/MANAGER grants, STAFF denial, and Profile-permission non-inheritance through focused authorization and page tests.
- [x] 5.2 Verify the implementation has no import, query, foreign key, write, link, sync, or canonical duplication involving `Carte & menus`, POS, `@yuta/db-pos`, or Site Agent; run architecture checks and record source/diff evidence.
- [x] 5.3 Run Concept/Histoire and Establishment Profile focused regression suites and verify their persistence, forms, actions, permissions, and page behavior remain unchanged.

## 6. Documentation and lifecycle truth

- [x] 6.1 Update current Product Knowledge, Module Registry, and the existing general-information page pack for the implemented slice and fix the documented stale Concept/Histoire state; verify Restaurant Knowledge remains `PARTIAL` and Environment/Production Readiness are not promoted.

## 7. Final validation

- [x] 7.1 Run strict OpenSpec validation, docs, architecture, formatting, recursive typechecks, focused/full relevant tests, cloud build, and the OpenSpec verification workflow; record exact truthful results and any unavailable checks for Gate 3 evidence.
