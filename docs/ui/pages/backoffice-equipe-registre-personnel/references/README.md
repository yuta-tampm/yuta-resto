# Backoffice Équipe — Registre du personnel — Reference Metadata

Status: Approved Phase 1 presentation references and final Phase 5 local as-built evidence

Visibility: Engineering

Generated and checked for obvious scope violations on 2026-08-17. Product
approved the corrected set for the local typed-fixture prototype on 2026-08-18.

| File                                   | Target viewport | Purpose                                            |
| -------------------------------------- | --------------- | -------------------------------------------------- |
| `wave-e-design-draft-1440x1000-01.png` | 1440 x 1000     | Desktop hierarchy, canonical table, shell fidelity |
| `wave-e-design-draft-1024x768-01.png`  | 1024 x 768      | Compact desktop/table composition                  |
| `wave-e-design-draft-768x1024-01.png`  | 768 x 1024      | Narrow shell and ordered card adaptation           |
| `wave-e-design-draft-390x844-01.png`   | 390 x 844       | Mobile topbar, stacking, touch and wrapping study  |

Reference status: APPROVED

This approval covers Phase 1 presentation only.

The initial desktop generation was rejected because it added a register sidebar
item and unapproved deletion copy. The retained correction removes both. All
names, counts, dates, and missing-field examples are fictional. Images guide
hierarchy, proportions, density, responsive behavior, and visual tone only;
they do not define routes, fields, authorization, schemas, APIs, persistence,
legal compliance, raw colors, or production behavior.

## Phase 5 local as-built evidence

Captured on 2026-08-18 from the authenticated development route using the
persisted empty register and existing candidate metadata. No inscription,
correction, PDF export, or operational-data mutation was performed for these
captures.

| File                                              | State and viewport                    | SHA-256                                                            |
| ------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| `wave-e-phase-5-as-built-1440x1000.png`           | empty register, desktop               | `e4379d2e165abb8336e1cd2f9585a82a4520b00a6a5f15fa0a2ca5a698d4c3b2` |
| `wave-e-phase-5-as-built-1024x768.png`            | empty register, compact desktop       | `dc67e846d77aed5eae473897a47355c68db3d17d7a4c646a27950a276fd6f5bc` |
| `wave-e-phase-5-as-built-768x1024.png`            | empty register, tablet                | `5d2d9c54bb5413adc434d4ebd19f10ecc657c8e1cafdfd59f309b65b4cc22edf` |
| `wave-e-phase-5-as-built-390x844.png`             | empty register, narrow                | `a6318043f2eb719146f45ad8a3842cdea2121570c146cca695bd444b2a7889b2` |
| `wave-e-phase-5-as-built-inscription-390x844.png` | non-mutating inscription review modal | `70a779230c1d2e5d4e71bdc7b43e853137703966b4164e287353ec200bdb9c1f` |

Measured document widths equal their target widths at all four viewports; no
horizontal overflow or browser warning/error was observed. The narrow modal is
viewport-contained and scrolls internally. After the Phase 5 accessibility
correction, Escape returns focus to `Vérifier et inscrire`.
