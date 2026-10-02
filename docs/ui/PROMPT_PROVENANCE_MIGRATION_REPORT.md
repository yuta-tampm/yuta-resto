# UI Prompt Provenance Migration Report

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-28

## Summary

- Page packs migrated: 18.
- Prompt snapshots inventoried and sealed: 108.
- `PROVEN`: 22.
- `PARTIAL`: 0.
- `NEEDS_REVIEW`: 86.
- Homogeneous proven template sets: `backoffice-equipe-formalites-personnel` and `pos-management-printing`.
- Mixed-revision pack: `pos-management-catalog` (multiple proven historical revisions plus one unresolved phase).
- Page-specific variants preserved: Registre Phase 0 and POS Catalog Phase 1.
- Unresolved cohorts: every prompt without an exact historical canonical match remains visible as `NEEDS_REVIEW`; no source, revision, template hash, or modification state was invented.

The inventory compared each local SHA-256 with the current canonical SHA-256 and with canonical prompt blobs in Git history. Equality with the current template alone was not treated as generation proof. A prompt is `PROVEN` only when its current body exactly matches the canonical body at an identified Git commit. The generation evidence records the Git commit that introduced the page-pack README; it does not claim an unproved template revision.

## Per-pack classification

| Pack                                     | Root template revision                                         | PROVEN | PARTIAL | NEEDS_REVIEW | Notes                                                                                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------- | -----: | ------: | -----------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backoffice-equipe-formalites-personnel` | `prompt-template-git-0e8058df0bdb6c2544eb710d41f16c522c2ab322` |      6 |       0 |            0 | All six bodies match canonical Git snapshot `0e8058df`.                                                                                                        |
| `backoffice-equipe-registre-personnel`   | `null`                                                         |      5 |       0 |            1 | Phase 0 is a reviewed page-specific variant with unresolved exact source; Phases 1-5 match canonical Git history.                                              |
| `backoffice-equipe-salaries`             | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `establishment-general-information`      | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `hours-services`                         | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-kitchen`                            | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-management-catalog`                 | `null`                                                         |      5 |       0 |            1 | Phases 0 and 2-4 match canonical history; Phase 5 matches the older Printing cohort; Phase 1 is a reviewed page-specific variant with unresolved exact source. |
| `pos-management-combos`                  | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-management-establishment`           | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-management-home`                    | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-management-printing`                | `prompt-template-git-49e4258173b4e8767d240fa3cd4b3df0afb92fe0` |      6 |       0 |            0 | All six bodies match the historical canonical cohort at `49e42581`.                                                                                            |
| `pos-management-reports`                 | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-management-users`                   | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-order-detail`                       | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-order-entry`                        | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-order-items`                        | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `pos-orders-home`                        | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |
| `today`                                  | `null`                                                         |      0 |       0 |            6 | Local Git history does not establish an exact canonical source revision.                                                                                       |

## Proven historical cohorts

- Formalités: all six snapshots match the canonical template tree at commit `0e8058df`; the root and per-prompt revision record that exact Git snapshot.
- Registre: Phases 1-5 match the canonical template tree at commit `36c8a515`; Phase 0 remains unresolved.
- POS Printing: all six snapshots match the canonical template tree at commit `49e42581`, including the older Phase 5 cohort.
- POS Catalog: Phase 0 matches canonical Git history at `70b77938`; Phases 2-4 match `37cf43f9`; Phase 5 matches the older `49e42581` cohort shared with POS Printing; Phase 1 remains unresolved.

## Unresolved provenance

For every row below, Git proves the current local snapshot and its file history, but does not prove an exact canonical source and revision. The recommended future review is to inspect predecessor branches, commits, or external generation records without modifying the sealed body. `UNKNOWN` means the repository does not prove whether the body was locally modified; `PRE_SEAL` is used only for the two variants explicitly classified as deliberate by the approved topology review.

| Pack                                   | Phase prompt                | Snapshot SHA-256                                                   | Local modification | Missing evidence / future review                                                                                       |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `backoffice-equipe-registre-personnel` | `00_REPOSITORY_ANALYSIS.md` | `1b451a6c567fe08900889520bfa84daeba46d5af12b5990a8f45d816ed544ff5` | `PRE_SEAL`         | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `backoffice-equipe-salaries`           | `00_REPOSITORY_ANALYSIS.md` | `81a6b69bb8bdf1e9ad0916d684d518a2677bea0e871115480ca6e86fd106ce7b` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `backoffice-equipe-salaries`           | `01_VISUAL_BASELINE.md`     | `e413b4d12749b223b1e2eba0d442ffcfc585466b9354d04a996d8a9796bf409f` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `backoffice-equipe-salaries`           | `02_COMPONENT_REFACTOR.md`  | `6306b154c1fb4ad6e9dd54c8eff4c7befff3c8aa6f09c5d7e224bdbe0d00fe37` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `backoffice-equipe-salaries`           | `03_INTERACTIONS.md`        | `7e3a7bc7b0688f22f95326b12392ca965a55a8573361d413253256cfbba0966c` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `backoffice-equipe-salaries`           | `04_DATA_INTEGRATION.md`    | `27d3138837903049b58eb0f56ac842e9b123abdd910642f246838cb1ab70613a` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `backoffice-equipe-salaries`           | `05_VISUAL_QA.md`           | `be70755afbacba47b306470e084dd76daa0122ea2740cb02322bf79b3d1fcfe4` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `establishment-general-information`    | `00_REPOSITORY_ANALYSIS.md` | `17117b7609e7c0d47416ba2844a16bd9955f6a6c29c2a8997052503996886eae` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `establishment-general-information`    | `01_VISUAL_BASELINE.md`     | `8e97f8d9cd6f70ea0b43430a7e99e829eb375c84ab0c85a1874bf9262a907e82` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `establishment-general-information`    | `02_COMPONENT_REFACTOR.md`  | `79039020d833d4df79a5f00dc332c3d7d803b8a44aab8130e7489765a484f7d2` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `establishment-general-information`    | `03_INTERACTIONS.md`        | `cee585eb8b3fac5981ba9e5dad33a1416e86b5ec2f3dd1415055bbb13dd1de30` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `establishment-general-information`    | `04_DATA_INTEGRATION.md`    | `0827f11ee34c77ba1d085b5df50afb40fefb83456c791b44de3cb1a4d035fa0b` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `establishment-general-information`    | `05_VISUAL_QA.md`           | `3036c467b6a38ab7079596959ccf04a1bcd033cc4716a60d368cd65933c1e1da` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `hours-services`                       | `00_REPOSITORY_ANALYSIS.md` | `c2b52e83d16a3cfbb942b8fd05d8ebc31626fa17ff8e87b67d9cc825f64dff46` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `hours-services`                       | `01_VISUAL_BASELINE.md`     | `7fa194f13da7fa4d0fbd5ff2c306baa5edfae12db998659e5033d2864897acf0` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `hours-services`                       | `02_COMPONENT_REFACTOR.md`  | `0fa285bde7fb49031ee5ebf3f339ad7d0a195528cb0bfe388653dd6d3d92680a` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `hours-services`                       | `03_INTERACTIONS.md`        | `2ec1cf943c2a66a559561dc9b102c6f81d30cd3e7073e39aee8d95431d285ea1` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `hours-services`                       | `04_DATA_INTEGRATION.md`    | `527b45c67684abfed5f9825efc9b4a861e9759e0bc5bf703db13013b4c107955` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `hours-services`                       | `05_VISUAL_QA.md`           | `01fe08d11bab3d724f519bc68bcfc410491ab295f3cb68f1f3e4fc02fc853512` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-kitchen`                          | `00_REPOSITORY_ANALYSIS.md` | `8c72e16a28289ed2409d93a0fc9c476af7501fbea3c82b972ec3b1062d938aef` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-kitchen`                          | `01_VISUAL_BASELINE.md`     | `cd68779ee3b0b7dcc1c7e405c397b27b7703d1a0cd73d1e46bccecee997bb41a` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-kitchen`                          | `02_COMPONENT_REFACTOR.md`  | `c6892a0bbf288dc8447d610cf4648619e7b1c485bd4eab9a99729ee8b251e708` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-kitchen`                          | `03_INTERACTIONS.md`        | `0933646f149d7b8137d73b83228fbf78b8c9864ef9084053428c7ea4a4d53270` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-kitchen`                          | `04_DATA_INTEGRATION.md`    | `c5767a73f8c87a9320e54a5bdc74545420bc0e19a824a98560a99e451e1b5391` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-kitchen`                          | `05_VISUAL_QA.md`           | `5d989ba8fae0a44c98524370bb659ede30528e24190561bcac326722928f244c` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-catalog`               | `01_VISUAL_BASELINE.md`     | `e3db0f4087ca5b38109c6d595c0c30ee30bff35dfef4773fef6d6c8f9b360edf` | `PRE_SEAL`         | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-combos`                | `00_REPOSITORY_ANALYSIS.md` | `4317945ce4541d027a6ad6a612e657b7ceef36971a3ae0108df0f1b422109132` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-combos`                | `01_VISUAL_BASELINE.md`     | `5136e92c3322cb7d2e2e6fd1f80106c81c05746a47bffe5d22375b85eacfaa7c` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-combos`                | `02_COMPONENT_REFACTOR.md`  | `019d5ed3a6b06b5a1783aef3910f4743595629cbf98991737084884d2347405f` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-combos`                | `03_INTERACTIONS.md`        | `56a6533ef1bb065e4f88f50706204884905ba8ab86c68f2aec8c1492d5b17001` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-combos`                | `04_DATA_INTEGRATION.md`    | `b528242522259338512beec0a8630105ed29278a173af10ce28a8231d0390e07` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-combos`                | `05_VISUAL_QA.md`           | `b387f393d2192da4b646f5a5c81a7f5c9680ef1880cf54be2bab264b08b50c80` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-establishment`         | `00_REPOSITORY_ANALYSIS.md` | `401d2128c96d9f4e43c8b43e1aad03aa5c4e3a9845a0ba4418807f5e368b557b` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-establishment`         | `01_VISUAL_BASELINE.md`     | `59f96d8abaaa44cc7a8d935ccc1334d0e60800559953621ef825c5d01f6b8336` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-establishment`         | `02_COMPONENT_REFACTOR.md`  | `f0a739c1ab94e36cc796a259bbdcfbae40f955be7daf7378c2d3bc19c0198bdd` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-establishment`         | `03_INTERACTIONS.md`        | `d3a43f906cf369883c746038f882620aea0810829013f035d080b634386a59f1` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-establishment`         | `04_DATA_INTEGRATION.md`    | `c171e69dc97d19a982bba4abac4a8b4552ec73796e84ff9e48df851867c1d50a` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-establishment`         | `05_VISUAL_QA.md`           | `233853967b28293b1baec688d94e52c5b4527fd01e054beb5585c5bc332fdfc5` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-home`                  | `00_REPOSITORY_ANALYSIS.md` | `6ddf86b4481f95c3714a2e558d31879e7b397ed5f9123eaa07e395e5acfb27f3` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-home`                  | `01_VISUAL_BASELINE.md`     | `fb03d6901da64e6bf46ba13a8c6b700ea76ce13440b7fa6a19b2f8607d6ba608` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-home`                  | `02_COMPONENT_REFACTOR.md`  | `d0f8d9aa8d16bcb045c27f7dd9e9a25cc2d83c7d0563fe73014f3f885cc7adb8` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-home`                  | `03_INTERACTIONS.md`        | `10f6713dba84af42101fcf542064c192dd49e392fa92d4d3922686533ce8acf0` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-home`                  | `04_DATA_INTEGRATION.md`    | `28008254663d376eef12aba9863d03c9b0c6dc2b37824cb16229f2f1e1b272c8` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-home`                  | `05_VISUAL_QA.md`           | `be6e60cb77d9947faed7370cad8c8f22c04215a2c6bf2ff1f9032829e902da70` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-reports`               | `00_REPOSITORY_ANALYSIS.md` | `a61ec5499260f781eb846ccba87047a3e53ec907e64e53ad877ff217aa25c139` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-reports`               | `01_VISUAL_BASELINE.md`     | `e21c28f890fbf5891f373fcc02696ce63d22bd8f298de58ce6d958c050d811e4` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-reports`               | `02_COMPONENT_REFACTOR.md`  | `0639f5c297fdbac9c302288b28dc5802ce5db128ea638486432b1ec25326805c` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-reports`               | `03_INTERACTIONS.md`        | `1254e41090852461ad3cde5399522e84243eec1d4d65add43370977a9dc663b8` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-reports`               | `04_DATA_INTEGRATION.md`    | `774df8dc3f71bfb667b7e072f15201a53fa9f2810fd7921bbbc4b1d66ffe76da` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-reports`               | `05_VISUAL_QA.md`           | `87c52b29b25e944fddf65b01963d5d514a498f3c707c152ba8597adc42addf44` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-users`                 | `00_REPOSITORY_ANALYSIS.md` | `b6ff8fadca8373217d67d200b171c73814f1c02ac014276324aefd038621bf32` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-users`                 | `01_VISUAL_BASELINE.md`     | `b9db608ee39b860accf69571bc740f95e64c6890ecfbec0506e7bd0f80f1bd4f` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-users`                 | `02_COMPONENT_REFACTOR.md`  | `4b5375a955062416a666c156cd9d59f24badc1f05b4cd18bd6ef4ec05a9d1d01` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-users`                 | `03_INTERACTIONS.md`        | `899c5875b19b68862124ab72d29db2600dfc8ae2f5d12c2108c188c72a8349a2` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-users`                 | `04_DATA_INTEGRATION.md`    | `7af4b1ff05f55f435563e9074170351d3248dcc243040c1baa018c7204275cc9` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-management-users`                 | `05_VISUAL_QA.md`           | `f697f4006ddf7d574a9e58d8236dccfa042b8bad23eddcf803dc16c2a7373127` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-detail`                     | `00_REPOSITORY_ANALYSIS.md` | `2f7a47fd894c34f7f77b9980a557254fef85daf08a64dc1449406651b5ebbc68` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-detail`                     | `01_VISUAL_BASELINE.md`     | `a8666a60e93b2ab6481a2911f14988e91f1f603cc71471b6200a9f52dee32f41` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-detail`                     | `02_COMPONENT_REFACTOR.md`  | `838a699b05f8bfa749ae8aae2c3bb4cc007661e0a469caf62eec2a1a933e5fde` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-detail`                     | `03_INTERACTIONS.md`        | `a53a9958d8c19fe39c4cb4c1b5129e647a2e785313829d6c32a42905cc41655e` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-detail`                     | `04_DATA_INTEGRATION.md`    | `170afacf304436751d46925e6cddad092c5057cb0e4bf9e2cf500ff970e66fc2` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-detail`                     | `05_VISUAL_QA.md`           | `774e9c448809ae15c7f1a1e5cad939160acd4864b5bb4c99d1b78f8af3997dc0` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-entry`                      | `00_REPOSITORY_ANALYSIS.md` | `7d6b435d99a573660c830b44098e48fd9dfb8c7f416ea38349e7fac74bd70be6` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-entry`                      | `01_VISUAL_BASELINE.md`     | `68f636a4fef2403496074a697a6b7728b6bb06d61c3527011b2ea872eae9e54a` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-entry`                      | `02_COMPONENT_REFACTOR.md`  | `b2b44baefc22731b4a24ac87fb14d576fdf510a52774b251c6884072643e066e` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-entry`                      | `03_INTERACTIONS.md`        | `ba71ad24139f6bcffcf3e2ee07d34d41811824b8a1e9bce4e6fc76c609f904a3` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-entry`                      | `04_DATA_INTEGRATION.md`    | `24b1d6d53fc780393eb82f43e2542640ef2f660532b5da96033015840770939d` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-entry`                      | `05_VISUAL_QA.md`           | `daef6753a3340015a1939b23d3a072bf9930c542839c4f9e3a899668b45774fd` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-items`                      | `00_REPOSITORY_ANALYSIS.md` | `86600299e219e4b0ca4736682674bc6f4d85ea28ff017b394302f6653e7cfe84` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-items`                      | `01_VISUAL_BASELINE.md`     | `84241b28235a55fcc7e4c81d913b833b33cf76c48a496aea29679fe2a7e5a0ad` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-items`                      | `02_COMPONENT_REFACTOR.md`  | `4dcb767d87a858be26ab3e81a5b993afefcd96b08e3ab2b163b188cf075195a9` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-items`                      | `03_INTERACTIONS.md`        | `ad3356cd31e867b37999193a686315fc4ee98c45147dce53b83f5b4f5b7a423f` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-items`                      | `04_DATA_INTEGRATION.md`    | `2ed73a250818abdd534ab642d876a9a92eae2ff09809bb65cd2aa72c89c0dc8e` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-order-items`                      | `05_VISUAL_QA.md`           | `79fcd169edecf27fa37cc9cef4a95207048952fc4d22123f7345408ca8ca6aa4` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-orders-home`                      | `00_REPOSITORY_ANALYSIS.md` | `84dbc196b3e2453c2f9ba9d0ef6d19eb7ba0308ebbf0a39c9fcf24742672c09f` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-orders-home`                      | `01_VISUAL_BASELINE.md`     | `5c1ad831bf1df6b54164c6a16af22a0afa6499ecfbac75fd17f4f439dc9b4d16` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-orders-home`                      | `02_COMPONENT_REFACTOR.md`  | `978bc414b65c75bab5adc784b89679d2999ec5dea6223231a10bea7008a02253` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-orders-home`                      | `03_INTERACTIONS.md`        | `ad640e12c90c2ebf3ec5f7f5d4221ce1b67aaf987f44f9a8e1459a676f98f9da` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-orders-home`                      | `04_DATA_INTEGRATION.md`    | `38a281f71422767263f79c40b858f30f60cbbad6b3b658071f12df30fd123fd6` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `pos-orders-home`                      | `05_VISUAL_QA.md`           | `f64ee89afc574b4c3666e1f875d7fe76aff9d9c4d3c0b203c9d81d5e5239458c` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `today`                                | `00_REPOSITORY_ANALYSIS.md` | `c0b9f66a166acdbddfe673b59762c39045096be5612d0899266ca44f2b2f0229` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `today`                                | `01_VISUAL_BASELINE.md`     | `efa409e68647dd5388b656b5c7e24f44e2673ed5361e97a76ed658313d887cf2` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `today`                                | `02_COMPONENT_REFACTOR.md`  | `a198e36586bccab82a6eb7fb2314658de3122a10ca7fe018dea7e3a42d765f96` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `today`                                | `03_INTERACTIONS.md`        | `15f05a5a4221dc378e6b128292ca0553454f344b021b28f8c4527a2dea9a799a` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `today`                                | `04_DATA_INTEGRATION.md`    | `14b937dbc09d86201ebf99cfadd33964f94455e0978fffc06afe2a92a4cb2f49` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |
| `today`                                | `05_VISUAL_QA.md`           | `2326260c23b360324560c8e4b7051c7448e26ba650782fe98c3897fe110f1daf` | `UNKNOWN`          | No exact canonical source/revision match in available Git history; inspect predecessor branches or generation records. |

## Integrity confirmation

- All 108 pre-migration prompt SHA-256 values were captured before metadata writes.
- The same 108 prompt bodies remain byte-for-byte unchanged after migration.
- No prompt was regenerated, merged, deleted, normalized, or replaced.
- No validator or migration step auto-repaired a snapshot.
- The 19 previously identified byte-identical copies remain in place.
- Snapshot hashes are recorded per phase and are enforced by the validator.

## Validation

- UI pack validation passed for all 18 packs with 90 warnings: 86 expected
  `unresolved-prompt-provenance` warnings and 4 pre-existing legacy lifecycle or
  shared-context warnings.
- No `missing-prompt-provenance`, structural provenance, or snapshot-hash error
  remains.
- Tooling tests passed: 12/12.
- `pnpm docs:check`, `pnpm architecture:check`, and workspace typecheck passed.
- Targeted Prettier passed for every E3 file, and `git diff --check` passed.
- Repository-wide `pnpm format:check` remains non-zero because 28 pre-existing,
  out-of-scope skill, archived-task, and task files are not Prettier-formatted;
  none is an E3 output.

The migration exposed one validator compatibility bug: unresolved history could
not be represented without inventing a template hash and modification state.
The validator and its test were minimally extended to allow a null template
hash and `UNKNOWN` local-modification state only for `PARTIAL` or
`NEEDS_REVIEW`; `PROVEN` retains strict source, revision, hash, and known-state
requirements.
