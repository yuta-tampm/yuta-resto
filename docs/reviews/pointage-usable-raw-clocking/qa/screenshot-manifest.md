# Pointage usable raw clocking — screenshot manifest

QA status: PASS

Workflow result: QA_TARGETED_EVIDENCE_COMPLETE

Historical full generation: `e9546feb-7497-4420-890b-03bfa7fcc946`

Final targeted generation: `6d3608c7-98fe-445a-91ef-cfe874972d62`

Browser: Microsoft Edge `153.0.4234.48` via Playwright `1.51.1`, channel
`msedge`

Actual screenshot files: 19

Manifest rows: 19

The first table preserves the 12 screenshots from the historical full Edge QA
generation. The second table records seven screenshots from the separately
authorized final targeted Edge generation. Every image came from the real
local route, disposable PostgreSQL and synthetic Pointage runtime. No fixture,
mock or generated image is included.

| Repository-relative path                                                                 | Viewport | Role/state                              | Scenario                          | SHA-256                                                            |
| ---------------------------------------------------------------------------------------- | -------- | --------------------------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/qa/01-neutral-1440x900.png`                   | 1440x900 | Synthetic employee / neutral            | Initial Pointage route            | `ab53a1cc8eceb53285123f7589c67508542aad3d8b8701851a982d67dd8262cc` |
| `docs/reviews/pointage-usable-raw-clocking/qa/02-employee-a-not-clocked-in-1440x900.png` | 1440x900 | Synthetic employee A / identified       | Own current state before clock-in | `aaa7160eaace44e1ef304e781744ba54811c5042a6fdb6b957e46756a4304ab8` |
| `docs/reviews/pointage-usable-raw-clocking/qa/03-clock-in-receipt-1440x900.png`          | 1440x900 | Synthetic employee A / receipt          | Accepted clock-in                 | `cd496e496e1a048bc52cb2bb1608b4d4358c15e95b0554d6b860ac471636c281` |
| `docs/reviews/pointage-usable-raw-clocking/qa/04-clock-out-receipt-1024x768.png`         | 1024x768 | Synthetic employee A / receipt          | Accepted clock-out                | `9fa21c07573c9209e8f93fa49aaf0d769206cd1125e4a5bc80d4160ed5231e75` |
| `docs/reviews/pointage-usable-raw-clocking/qa/05-employee-b-long-name-390x844.png`       | 390x844  | Synthetic employee B / identify pending | Mobile long-name/reflow path      | `f104c4e78a1a6e625ed26c5dc0d4ff1e47bf91e0e9c4e897814556217282b948` |
| `docs/reviews/pointage-usable-raw-clocking/qa/06-state-conflict-1024x768.png`            | 1024x768 | Synthetic employee A / conflict         | Explicit refresh required         | `c0dba52b5c0bd2ac4c24f12a0d1c21baeae707f9adbac7dea4533f460adbab0c` |
| `docs/reviews/pointage-usable-raw-clocking/qa/07-result-unknown-1024x768.png`            | 1024x768 | Synthetic employee A / unknown result   | Explicit recovery                 | `d9875ea43c3c756ae2593c75c183b07ea2baa31269d9f3def9353eff7eadd3a8` |
| `docs/reviews/pointage-usable-raw-clocking/qa/08-mobile-touch-receipt-390x844.png`       | 390x844  | Synthetic employee B / receipt          | Touch mutation                    | `9406b7e73819f872652288f51b2c35b12084d09a37819bc8d60076cadda51fd4` |
| `docs/reviews/pointage-usable-raw-clocking/qa/neutral-1440x900.png`                      | 1440x900 | Synthetic employee / neutral            | Desktop reflow baseline           | `ab53a1cc8eceb53285123f7589c67508542aad3d8b8701851a982d67dd8262cc` |
| `docs/reviews/pointage-usable-raw-clocking/qa/neutral-1024x768.png`                      | 1024x768 | Synthetic employee / neutral            | Intermediate reflow baseline      | `852ba41f0494a7b205e95b10719c1855ce649dcc17f9174adcf7995315a2710f` |
| `docs/reviews/pointage-usable-raw-clocking/qa/neutral-768x1024.png`                      | 768x1024 | Synthetic employee / neutral            | Tablet reflow baseline            | `263bef8726cb8bf37d7bc0ebcf9e411246b7faad863cb789e02ea62485981985` |
| `docs/reviews/pointage-usable-raw-clocking/qa/neutral-390x844.png`                       | 390x844  | Synthetic employee / neutral            | Mobile reflow baseline            | `031ad6fa71a2cdf2684eb47da4e15c2261eb79144b1b390377c42da73cc1bef0` |

## Final targeted generation

| Repository-relative path                                                                   | Viewport | Role/state                            | Scenario                               | SHA-256                                                            |
| ------------------------------------------------------------------------------------------ | -------- | ------------------------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/qa/targeted-invalid-credential-1440x900.png`    | 1440x900 | Synthetic employee / failure          | Application-owned invalid credential   | `da3cbcaffe31cf9f9496c14c269146ba604d1798f052274a783b9e394c1a3acb` |
| `docs/reviews/pointage-usable-raw-clocking/qa/targeted-sequential-employee-b-1440x900.png` | 1440x900 | Synthetic employee B / active         | Employee B after Employee A `Terminer` | `ea2731bc51806f8d8f56764293514455febe23b806a15060080355dd721d6598` |
| `docs/reviews/pointage-usable-raw-clocking/qa/targeted-long-name-1440x900.png`             | 1440x900 | Synthetic long-name employee / active | Identified active responsive state     | `ea2731bc51806f8d8f56764293514455febe23b806a15060080355dd721d6598` |
| `docs/reviews/pointage-usable-raw-clocking/qa/targeted-long-name-1024x768.png`             | 1024x768 | Synthetic long-name employee / active | Identified active responsive state     | `1f75cb3448768005a43aee80d37b349846ee136db95463abbcd61a8c1c8d5202` |
| `docs/reviews/pointage-usable-raw-clocking/qa/targeted-long-name-768x1024.png`             | 768x1024 | Synthetic long-name employee / active | Identified active responsive state     | `addc86076ad34a587c10fc301d31f8f83a931b423a5456727f76b1974a828389` |
| `docs/reviews/pointage-usable-raw-clocking/qa/targeted-long-name-390x844.png`              | 390x844  | Synthetic long-name employee / active | Identified active responsive state     | `eee0d980b8e5299dcb99add145e26e06fd46c10e581580a9b03b52c2e41f9a06` |
| `docs/reviews/pointage-usable-raw-clocking/qa/targeted-keyboard-receipt-1440x900.png`      | 1440x900 | Synthetic employee B / receipt        | Keyboard-only committed clock action   | `18f8228032f7ecfc40148daa089d0101237732e10b8717c243d1a7b96f32c74c` |

The combined evidence covers all four required viewports and the targeted
failure, sequential-user, keyboard-only and active long-name states. The
explicitly retained hidden/background, BFCache and absolute-expiry browser
limitations remain documented through complementary U6, absolute-deadline and
E5-ABSOLUTE evidence; no screenshot is claimed for an untriggered lifecycle.
