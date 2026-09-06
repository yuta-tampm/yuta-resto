# Screenshot manifest — Reputation review/social links

Change: `reputation-review-social-links-configuration`

QA date: `2026-09-06` (Europe/Paris)

Environment: local Backoffice `http://localhost:3001`, local Feedback Web
`http://localhost:3006`, disposable PostgreSQL database
`yuta_reputation_browser_test` in container
`yuta-reputation-qa-db-20260906` on loopback port `56061`.

All records and submissions were synthetic. No production database, customer
record, provider endpoint, or public review destination was used.

SHA command: `Get-FileHash -Algorithm SHA256 -LiteralPath <path>` with lowercase
hexadecimal output.

| File                                               | Route                                 | Viewport | Role/state                                                                  | SHA-256                                                            |
| -------------------------------------------------- | ------------------------------------- | -------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `owner-empty-1440x900.png`                         | `/visibilite-reputation/satisfaction` | 1440×900 | OWNER; header, metrics, primary inbox                                       | `b7c0ce50338a19b1c4b89f64a03f71957949b12dd406723fcb5cf689068ae755` |
| `owner-empty-settings-1440x900.png`                | `/visibilite-reputation/satisfaction` | 1440×900 | OWNER; empty settings after inbox                                           | `29f4a7c5a9e6ffcf98fd9d40549f1f5666f5f2a6df4d3c92eff3ff2edc55d13b` |
| `owner-empty-settings-visible-1024x768.png`        | `/visibilite-reputation/satisfaction` | 1024×768 | OWNER; approved Google full row and Facebook/Instagram pair                 | `5a16ebefe45617a2ec13ac35f2d4dd2d93f7b1548b49f170a2808c8b11b5b1d9` |
| `owner-empty-settings-768x1024.png`                | `/visibilite-reputation/satisfaction` | 768×1024 | OWNER; stacked settings                                                     | `9b7403aa234ae863698127fb0de9ea5abcfa5b2e9e49520ae120d7bdfe333e3f` |
| `owner-empty-settings-visible-390x844.png`         | `/visibilite-reputation/satisfaction` | 390×844  | OWNER; mobile settings and full-width Save                                  | `900098843e3d55d0e9885fb2b90799ef5d531f9052f0e645d276aa4a363df5ca` |
| `owner-invalid-google-390x844.png`                 | `/visibilite-reputation/satisfaction` | 390×844  | OWNER; invalid Google URL after blur                                        | `e7fbff2221e390b5ccfca81e5202af0bc6bc50f838927e266b98f8dd68536700` |
| `owner-dirty-valid-390x844.png`                    | `/visibilite-reputation/satisfaction` | 390×844  | OWNER; corrected valid dirty values and enabled Save                        | `6e9fc7abb33627ff56f4962760dab4b7e9b13b693d6336b4fc02fa4793a4c9ff` |
| `owner-saved-390x844.png`                          | `/visibilite-reputation/satisfaction` | 390×844  | OWNER; authoritative populated values after Save                            | `28e20bded9c0f8667ad58711cd4c8b6d93ca0f989eba29efebfce5547363d7a3` |
| `owner-conflict-390x844.png`                       | `/visibilite-reputation/satisfaction` | 390×844  | OWNER; stale conflict and reload action                                     | `0ffb49894b845c1b29df9a4ef51d80747c20396ea24f0e7d9c83fec55c282a14` |
| `owner-server-error-retry-390x844.png`             | `/visibilite-reputation/satisfaction` | 390×844  | OWNER; injected disposable-DB failure, draft preserved, retry visible       | `3d3b787b24c630bbaf6ccd9cf94e07229898e644c80e81ece1eafba34305b68c` |
| `owner-configuration-unavailable-390x844.png`      | `/visibilite-reputation/satisfaction` | 390×844  | OWNER; exact scoped row absent, fields and Save unavailable                 | `3031656d27d20988e6193e6f29c841d161b19948d579205370655ec84b0a750f` |
| `manager-settings-absent-1024x768.png`             | `/visibilite-reputation/satisfaction` | 1024×768 | MANAGER; inbox retained, settings absent                                    | `49219a479986b800f78f8466eb52c0a5d753d0fe0eb8f402292e83b1aee10c8b` |
| `staff-settings-absent-1024x768.png`               | `/visibilite-reputation/satisfaction` | 1024×768 | STAFF; current scoped inbox behavior, settings absent                       | `7d71193a5cfac58d0c99faaf78deb6ed0f20f814fd5142dc2c1345a11690e41d` |
| `public-success-all-providers-390x844.png`         | `/luna`                               | 390×844  | Public success; Google, Facebook, Instagram safe CTAs                       | `42218bd23d95dfdb363f4c5920ccb793287d97794db7e54178fad4be056c06e1` |
| `public-success-mixed-safe-projection-390x844.png` | `/luna`                               | 390×844  | Public success; valid Google, null Facebook, unsafe legacy Instagram hidden | `d48b8ea3120c7357bcd32442a783800a080e50ba9e9f2546f11c095abc112354` |
| `public-success-no-providers-390x844.png`          | `/luna`                               | 390×844  | Public success; all provider values null, no CTA block                      | `351407721eb9113639fa57af4c339b8e0e654776f59f1ac60547b0bc2dbb0e6d` |

The browser viewport override reported exact `window.innerWidth` and
`window.innerHeight` for every required size. At 1440, 1024, 768, and 390 the
document `scrollWidth` equaled the client width, so no horizontal overflow was
present.
