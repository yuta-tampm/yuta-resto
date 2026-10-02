# Browser QA Screenshot Manifest

Change: `restaurant-knowledge-communication-identity`

All paths are repository-relative and all hashes are lowercase SHA-256.

| Path                                                                                                     | Viewport   | Principal/state                            | Scenario                                                                         | SHA-256                                                            |
| -------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-communication-identity/qa/owner-populated-saved-1440x900.png`         | 1440 x 900 | OWNER, populated after save                | Visible Communication Identity slice with all three persisted values             | `8b410696d7ba4e51a21833c70e1a76321e8a7cdb29fdaa672db38f2823b45139` |
| `docs/reviews/restaurant-knowledge-communication-identity/qa/owner-success-status-1440x900.png`          | 1440 x 900 | OWNER, successful save                     | Whole-slice save with visible `role="status"` confirmation                       | `d49f5be534561e10aff3939d3faaf6aca4e77328207d20b256e040aea2838ee4` |
| `docs/reviews/restaurant-knowledge-communication-identity/qa/owner-all-empty-1024x768.png`               | 1024 x 768 | OWNER, initial all-empty route             | Full protected route at the valid initial all-empty state                        | `eb155360cd223a0c8753718c9676ec41c39d3d3e900d398bd141c4b4422745da` |
| `docs/reviews/restaurant-knowledge-communication-identity/qa/owner-all-empty-section-1024x768.png`       | 1024 x 768 | OWNER, all-empty saved                     | Communication Identity section after explicit canonical all-empty save           | `5dd2f0f950d104758babd5e0ce1f99c8bf35d23005d9fa832e5db326cac15f31` |
| `docs/reviews/restaurant-knowledge-communication-identity/qa/manager-editable-dirty-768x1024.png`        | 768 x 1024 | MANAGER, dirty draft                       | Enabled fields, visible focus and exactly one save control                       | `016ca49f6a3473cb28941f15217f45ad2f40c8b1d0d7f19c4a4fba05177fa441` |
| `docs/reviews/restaurant-knowledge-communication-identity/qa/owner-dirty-focus-390x844.png`              | 390 x 844  | OWNER, dirty draft                         | Unsaved draft, keyboard focus and enabled explicit save                          | `5f28f03dfe10f79531fedfa885103006a612a2dd9b452386818b326372afeefa` |
| `docs/reviews/restaurant-knowledge-communication-identity/qa/no-establishment-no-access-390x844.png`     | 390 x 844  | Existing authenticated no-access principal | Fail-closed no-establishment state; no Communication Identity section or control | `5680dfc02cb9bf030958dedd26465980a05856e5b9b400309b6f58ecb841c4f9` |
| `docs/reviews/restaurant-knowledge-communication-identity/qa/no-restaurant-knowledge-access-390x844.png` | 390 x 844  | No-access route redirect                   | Protected route produced no Communication Identity section or control            | `d7bb2db5d14048bf29b2227899d39b3ee45d9abda9269fe2f3d5b796fa8f9497` |

The no-access captures truthfully use an existing principal with no active
restaurant establishment membership. They do not claim that this principal has
the STAFF role. The accepted STAFF denial is additionally proven by focused
server authorization tests without creating a production role, principal,
permission or grant for QA.
