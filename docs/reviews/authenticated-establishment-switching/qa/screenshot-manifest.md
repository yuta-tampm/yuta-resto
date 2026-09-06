# Authenticated Establishment Switching Screenshot Manifest

All screenshots were captured from the authenticated local Backoffice browser
session on 2026-09-05. Hashes are lowercase SHA-256 of exact PNG bytes.

| Path                                                                                 | Viewport  | Role/state                   | Scenario                                                                   | SHA-256                                                            |
| ------------------------------------------------------------------------------------ | --------- | ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/authenticated-establishment-switching/qa/desktop-luna-before.png`      | 1215x1272 | OWNER / LUNA active          | Desktop before A -> B; scoped `Avis à traiter` count is 6                  | `05ab4a550b1b682f5b712bf481979c9b0b73f1b19fc33dc79f4a350781b8c85c` |
| `docs/reviews/authenticated-establishment-switching/qa/desktop-poitiers-after.png`   | 1215x1272 | OWNER / LuNa Poitiers active | Desktop after one-gesture A -> B; scoped count is 3                        | `629c4a3c2be2ac3899a7620cfaa051490866933de3b6ea10b909f85e60ff1366` |
| `docs/reviews/authenticated-establishment-switching/qa/desktop-poitiers-refresh.png` | 1215x1272 | OWNER / LuNa Poitiers active | Desktop after browser refresh; selector and scoped count remain Poitiers/3 | `629c4a3c2be2ac3899a7620cfaa051490866933de3b6ea10b909f85e60ff1366` |
| `docs/reviews/authenticated-establishment-switching/qa/desktop-luna-switch-back.png` | 1215x1272 | OWNER / LUNA active          | Desktop after B -> A; scoped count restored to 6                           | `05ab4a550b1b682f5b712bf481979c9b0b73f1b19fc33dc79f4a350781b8c85c` |
| `docs/reviews/authenticated-establishment-switching/qa/mobile-luna-before.png`       | 319x1272  | OWNER / LUNA active          | Mobile drawer open before A -> B; selector displays LUNA                   | `76f637ab1c603a5bb991f2c5cfc132c49179a30c7b54f48a6933a1f89357bb51` |
| `docs/reviews/authenticated-establishment-switching/qa/mobile-poitiers-after.png`    | 319x1272  | OWNER / LuNa Poitiers active | Mobile drawer open after A -> B; selector displays LuNa Poitiers           | `49abba679e0f76e767dda43275272f30637f4647e338c5333e2f9a9ee09ee04f` |
