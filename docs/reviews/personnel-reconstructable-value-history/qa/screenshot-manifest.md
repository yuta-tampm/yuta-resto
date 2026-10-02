# Browser QA Screenshot Manifest

Change: `personnel-reconstructable-value-history`

All paths are repository-relative and all hashes are lowercase SHA-256.

| Path                                                                                                             | Viewport    | Principal/state             | Scenario                                                     | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-mixed-baseline-1440x1000.png`               | 1440 x 1000 | OWNER, Camille              | Mixed legacy/F07 timeline and neutral cutover baseline       | `0e8e8afee497b660285380df957fe9f62df8085ed53d3735bc9b0b8ee7fb27c4` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-1024x768.png`                    | 1024 x 768  | OWNER, Camille              | Tablet-width mixed history                                   | `dedcdd1155cef56646eaeb661759c14a0355168590439d2265a044405757e8c3` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-768x1024.png`                    | 768 x 1024  | OWNER, Camille              | Narrow-tablet mixed history                                  | `d3fa5675fee43b758ef2b455c14ed2ac7e7a9b997ca7259977af04c4cbfd1fbf` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-390x844.png`                     | 390 x 844   | OWNER, Camille              | Mobile full-surface drawer and readable grouped event        | `3c327014ef4a5e0036baf60e8100d6058ad5aaa9a7304a552ee77de3ff7bedfe` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-stale-revision-recovery-1440x1000.png`              | 1440 x 1000 | OWNER, concurrent tabs      | Stale revision conflict with explicit reload recovery        | `aff4c745524f97d4a70e660389e426d3924ed38d1b644d411aa9ecaf2d6df97d` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-newest-50-1440x1000.png`                    | 1440 x 1000 | OWNER, Julien               | Exactly 50 visible events and truncation behavior            | `4a4cff3fd9d67262f5b2dfac15d8aaaccc931b56977a818bbec375fff5dcb2e6` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-per-group-validation-future-boundary-1440x1000.png` | 1440 x 1000 | OWNER, incomplete edit      | Independent Role/Work-time metadata and future-date boundary | `75bd45e88cfe618212a0dae6c4872b794cb27cef5480aa2137e1b4995cfc6050` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-dirty-close-1440x1000.png`                          | 1440 x 1000 | OWNER, dirty edit           | Explicit discard confirmation                                | `c6cdd9fe32bed87cf68e14fb57ab49a355a1e1ef6e393a215a1cc725dbc46a9b` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-loading-1440x1000.png`                      | 1440 x 1000 | OWNER, Julien               | On-demand history loading state                              | `2d07386feb9355308aa789db744ef8f0bc96eca8d8cd1fca296231a821389ea2` |
| `docs/reviews/personnel-reconstructable-value-history/qa/f07-history-error-retry-1440x1000.png`                  | 1440 x 1000 | OWNER, safe corrupt fixture | Fail-closed error state and visible retry control            | `03c2b863a510a4ff422d302ac68eb246c953ac30ad4e4636d295adfbeb8ba89b` |

The invalid history fixture used for the error capture was removed by exact ID
before retry. The recovered timeline returned 50 events and no error state.
