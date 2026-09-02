# Browser QA Screenshot Manifest

Change: `restaurant-knowledge-team-culture`

All paths are repository-relative and all hashes are lowercase SHA-256.

| Path                                                                                       | Viewport   | Principal/state                            | Scenario                                                               | SHA-256                                                            |
| ------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-team-culture/qa/owner-populated-1440x900.png`           | 1440 x 900 | OWNER, populated                           | Visible Team Culture slice with all three persisted values             | `3cd3d9441a60b6cbe4e4bd65530db79c6f3f780be529151a4c8180739055d69b` |
| `docs/reviews/restaurant-knowledge-team-culture/qa/owner-all-empty-1024x768.png`           | 1024 x 768 | OWNER, all-empty saved                     | Valid all-empty state and successful explicit save status              | `75041c300c23066f5acab9c21b97c0bfd80166d097e061630fe76abab21d57c2` |
| `docs/reviews/restaurant-knowledge-team-culture/qa/manager-editable-768x1024.png`          | 768 x 1024 | MANAGER, populated                         | Enabled fields and exactly one Team Culture save control               | `793a4982b6c2b6b1821ba169df8bfd3a3efac2ab72963fe4b5c91ba5edf44911` |
| `docs/reviews/restaurant-knowledge-team-culture/qa/owner-dirty-390x844.png`                | 390 x 844  | OWNER, dirty draft                         | Unsaved draft, keyboard focus and enabled explicit save                | `e41770d4a6308eca02d746c02ac7075279024eda34b4bb78a2ea478933ab88d5` |
| `docs/reviews/restaurant-knowledge-team-culture/qa/owner-saved-1440x900.png`               | 1440 x 900 | OWNER, save success                        | Whole-slice save success with visible status message                   | `215ad3cfe687aa3fdc29fe181ae2839c99521786ac0631d04638f9db26bea303` |
| `docs/reviews/restaurant-knowledge-team-culture/qa/owner-reloaded-1440x900.png`            | 1440 x 900 | OWNER, reloaded                            | Persisted round-trip after reload                                      | `3cd3d9441a60b6cbe4e4bd65530db79c6f3f780be529151a4c8180739055d69b` |
| `docs/reviews/restaurant-knowledge-team-culture/qa/owner-persisted-roundtrip-1440x900.png` | 1440 x 900 | OWNER, reloaded                            | Additional visible persisted-slice evidence                            | `3cd3d9441a60b6cbe4e4bd65530db79c6f3f780be529151a4c8180739055d69b` |
| `docs/reviews/restaurant-knowledge-team-culture/qa/staff-no-access-390x844.png`            | 390 x 844  | Existing authenticated no-access principal | Fail-closed no-establishment state; no Team Culture section or control | `32c11ee11492b1e1ea8f1a212950597eaadeabb6f0ceb62c63e588e692893f07` |

The filename `staff-no-access-390x844.png` is the reserved evidence path from
the approved plan. It truthfully captures the allowed alternative mandatory
case: an existing principal with no Restaurant Knowledge access. It does not
claim that the principal has the STAFF role.
