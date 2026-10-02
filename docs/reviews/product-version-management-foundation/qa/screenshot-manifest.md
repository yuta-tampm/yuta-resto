# Product Release Browser QA screenshot manifest

Change: `product-version-management-foundation`  
Captured: 2026-09-27, Europe/Paris  
Source: actual local production-build browser sessions at `localhost:3000` and `localhost:3001`.

SHA-256 values are exact PNG file bytes, computed with `Get-FileHash -Algorithm SHA256` and rendered in lowercase.

| Repository-relative path                                                             | Viewport | Role/state                          | Scenario                                                 | SHA-256                                                            |
| ------------------------------------------------------------------------------------ | -------- | ----------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/product-version-management-foundation/qa/web-desktop.png`              | 1366×768 | Public Web, footer visible          | Full Product Release label and surrounding footer        | `1bf2c98b753e38ced57ad89cca49a1efc6fcc6ea8fb2fda5f04faed77bfa8b87` |
| `docs/reviews/product-version-management-foundation/qa/web-mobile.png`               | 390×844  | Public Web, footer visible          | Mobile label visibility and no horizontal overflow       | `9782cb937f60402515268c1ca34038b38ea1aaad6370e98e5610caa530bd2005` |
| `docs/reviews/product-version-management-foundation/qa/backoffice-auth-required.png` | 1366×768 | Unauthenticated Backoffice redirect | Required authenticated route unavailable for footer QA   | `e56c70d4da562032665bae3e3d421dc8e2ea898aedd2fb56d9063fc32951d600` |
| `docs/reviews/product-version-management-foundation/qa/backoffice-desktop.png`       | 1366×768 | Authenticated owner, LuNa Poitiers  | Compact Product Release footer in existing desktop shell | `51dc2604c4d81eafb860a73eda29b98bbd3a7ff3173fe386083d8563c9e0efb5` |
| `docs/reviews/product-version-management-foundation/qa/backoffice-mobile.png`        | 390×844  | Authenticated owner, LuNa Poitiers  | Compact footer wraps visibly without horizontal overflow | `96276961adc8bee612800d9596e51196d83b00ae73e3fbd618df95aabe1a21e8` |

The unauthenticated Backoffice screenshot records the initial environment blocker only. The later authenticated desktop/mobile screenshots are the Backoffice acceptance evidence.
