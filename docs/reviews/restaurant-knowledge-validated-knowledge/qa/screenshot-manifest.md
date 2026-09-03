# Browser QA Screenshot Manifest

Change: `restaurant-knowledge-validated-knowledge`

QA status: `PASS`

Hash algorithm: `SHA-256`, lowercase hexadecimal over exact JPEG bytes.

| Path                                  | Viewport width | Principal/state                           | Scenario                                                               | SHA-256                                                            |
| ------------------------------------- | -------------: | ----------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `manager-editable-1440.jpg`           |           1440 | MANAGER / persisted                       | Authenticated Manager route and Establishment Profile regression       | `47244c137ffcaae6d9b179e3addd19dce71c3939dd5f8b117304851e3a70f63c` |
| `manager-update-success-1440.jpg`     |           1440 | MANAGER / success                         | Editable validated item and semantic update success                    | `850d6aa492ea26cb685d612236d2415dfab34d2700ad6fa0dbf5c033a51864c4` |
| `no-access-platform-admin-1440.jpg`   |           1440 | platform-admin / no restaurant membership | No establishment access; section and mutation controls absent          | `f090fa1da405fecfe9e8032f98253ca492b5e23374e5df1e4bc9c5b3fd24d31b` |
| `owner-blank-edit-validation-768.jpg` |            768 | OWNER / invalid edit                      | Field-associated blank validation; save disabled; no remove conversion | `a15ebd6b631bb12edb6a0364491f6bb2bc886bc92e9c9d96522033184b713976` |
| `owner-empty-1440.jpg`                |           1440 | OWNER / initial route                     | Authenticated OWNER route and Establishment Profile regression         | `66441165eaadc2065d4cc9ce82a8065b0fdd8bdf0f22edf1b269f966df0c6282` |
| `owner-keyboard-focus-768.jpg`        |            768 | OWNER / keyboard                          | Visible focus ring on keyboard-reached `Retirer` control               | `fc1110c159a8c5df5a8a5c93d143a0b237830e4179f2d1d0bbe0c5224183718e` |
| `owner-multiple-items-1024.jpg`       |           1024 | OWNER / two persisted items               | Multiple independent items and one add control                         | `238556a96e70270c27476d5dd57a7866c0e22823c8b7b0d333f88ee635b3b997` |
| `owner-one-item-1440.jpg`             |           1440 | OWNER / one persisted item                | Successful create and exact statement display                          | `c382cbdc962225006faa04844c431f10fb7bef650c17e672e91d4c178f8af9ee` |
| `owner-pending-create-1024.jpg`       |           1024 | OWNER / local draft                       | Pending create before save; no-autosave evidence                       | `c243d95fccc5b425e4dcd7267fa4dd4ea3d8e3ee3746a2ab0d61bac604697959` |
| `owner-pending-remove-390.jpg`        |            390 | OWNER / pending remove                    | Warning, undo and separate explicit remove confirmation                | `18e60044a393e7ed4f580ade51860db1abe28dc3cbe5440be31689ef0fbe8a8d` |
| `owner-update-success-1024.jpg`       |           1024 | OWNER / success                           | Update success status and accepted surrounding whitespace              | `662b8f5b2a02f362e93b8d528303da04acd6fc503b40d4a45ad9c6ce365dcdc2` |
| `owner-whitespace-validation-768.jpg` |            768 | OWNER / invalid create                    | Whitespace-only create validation and disabled save                    | `9512ac5ba8e83ebe29e096ed02815a46ad5570ba863aa1531ba84ef86384431c` |

Screenshot count: `12`.
