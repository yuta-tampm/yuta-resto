# License / Provenance Review Input — Evidence Completion

Change: ui-ux-pro-max-integration
Gate: PRE-APPLY license/provenance review
Review status: APPROVED
Created: 2026-09-08T15:18:13Z
Evidence refreshed: 2026-09-08T15:52:00.672Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
Planning: APPROVED — current-user decision, exact Tasks/block hashes unchanged
Input result: LICENSE_REVIEW_INPUT_COMPLETE
LICENSE_PROVENANCE_ACCEPTANCE_REQUIRED: SATISFIED
LICENSE_PROVENANCE: ACCEPTED_FOR_EXACT_ARTIFACT_AND_BOUNDED_USE
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-08T20:48:41Z
Apply: NOT AUTHORIZED
Artifact procurement: NOT AUTHORIZED
Production: NOT AUTHORIZED

## 0. Control Tower bounded acceptance — current decision

The current user accepted the exact reviewed packet preimage SHA-256:
`8623f5d4bc7d3fef2dacc72c6a4ae1b9a105794ea22e93e24334ab324a9c1a03`.
It matched before this status-only recording. Planning remains APPROVED and
LICENSE_REVIEW_INPUT remains COMPLETE. This records a bounded governance/risk
acceptance, not `LICENSE=MIT`, universal legal clearance, full upstream
provenance, a reproducible source build or permission to redistribute/vendor
all assets.

### Exact accepted artifact and output

- npmName: `ui-ux-pro-max-cli`.
- npmVersion: `2.15.0`.
- Tarball SHA-256:
  `50966c6c1cf99db6c9706222df6a3094e8043413e8b94a477ff8339ebc3fef52`.
- npm integrity:
  `sha512-D0J/C40xrzzi5si6ZLtRGbEE5v3QjL7d4wJNnasmP3yfDSrGiuqVCdwQiqCNnIkbqOuVoA/uonR2o1WKXh3urw==`.
- Retained projection: exactly 67 members from approved Design Appendix A,
  retaining raw upstream bytes unchanged; 129 members excluded.
- Accepted output contract: exactly 70 files, including the YUTA-owned local
  adapter and the reviewed NOTICE; ignored local installed payload only.
- Accepted NOTICE candidate SHA-256:
  `1c0d756bc8feeb1d6dd3dfffe9644f8f812581ae6cb53d6f06c50284bbb0451c`.
  Its embedded bytes remain unchanged; no actual NOTICE/template is created.

### Scope and exclusions

Acceptance is limited to project-local internal YUTA/Codex tooling using those
exact candidate bytes, projection, adapter and NOTICE. No upstream installer
execution or sibling skill installation is accepted.

Not covered: another tarball/digest, latest/future version, upstream main,
vendoring the 67 files into Git, public redistribution, changed NOTICE content,
71 or more output files, sibling skills, npm/npx/pnpm dlx/uipro execution,
font/icon package installation, persistent MASTER/design-system output, or
production/runtime use. Each requires a new review; this acceptance must not
be silently carried into vendoring or redistribution decisions.

### Known bounded residual risk accepted by the user

1. The published README still contains historical CC-BY-NC-4.0 wording although
   the package manifest, pinned LICENSE and later exact upstream correction
   indicate MIT.
2. Google Fonts metadata contains OFL/APACHE2/UFL lineage and does not preserve
   every family-specific copyright/RFN notice.
3. The Phosphor Core 2.1.1 immutable source relationship is not established.

These factual limitations remain documented, not resolved or erased by
acceptance. They are accepted only for the bounded internal local-tooling use
above. The evidence and historical review-stage wording in sections 1 onward
are preserved byte-for-byte; this section records the later human decision
without changing those findings or the exact NOTICE candidate.

### Recording integrity and next authorization boundary

Pre-write snapshot: 2026-09-08T20:48:19.991Z, 2584 tracked/nonignored-untracked
paths. Reviewed packet preimage, all 29 Gate 1 protected table entries, current
Gate 2/Gate 2b packets, Proposal/Analysis/Specs/Design/Tasks, both embedded
planning blocks and the accepted NOTICE hash match their approved values.
Concurrent Pointage paths in earlier review tables are attribution-only, not
protected authority; no such work is edited, approved or silently rebaselined.

Concurrent attribution at 2026-09-08T20:49:49.521Z, relative to the recording
baseline above (not this change's delivery or authority):

- `openspec/changes/pointage-usable-raw-clocking/design.md`:
  `e9c4f77bffa6b3b2024c97c25271625e60c4b15b1f1ed813ac2cf54cc96cb169`
  became `9a50dd1e76ce950b137d107ad66cb8e56fcb541ec882ef002379f26207606197`.
- `openspec/changes/pointage-usable-raw-clocking/tasks.md`:
  `3c0b7a3f6c5117ae204a74574ec2049528782262ef1610647470a9bfca0f513f`
  became `7488d05ebc11dce56f64de5c21f6f6866a01893f53c532d14be5efaf35996574`.

Recording checks actually ran: `pnpm docs:check`, `pnpm architecture:check`,
`pnpm -r --if-present typecheck`, strict OpenSpec change validation and scoped
Prettier check each exited 0. `pnpm format:check` exited 1 with 67 inherited
warning paths; no global formatter write occurred. Scoped no-index diff check
exited 1 for the added-file difference with no whitespace-error diagnostics.
No application tests/builds, tooling smoke, installation or artifact retrieval
were run; this is status recording only, not implementation verification.

Only this review/status packet is authorized for this recording. Tasks semantics
and bytes, all planning artifacts, canonical governance, source and package
files remain untouched. No artifact is procured/downloaded, installed or
executed in this recording step. Target and staging paths remain absent.

LICENSE_PROVENANCE_ACCEPTANCE_REQUIRED: SATISFIED.
Apply: STILL NOT AUTHORIZED.
Artifact procurement: STILL NOT AUTHORIZED.
Production: NOT AUTHORIZED.
STOP: wait for explicit bounded Apply and artifact-procurement authorization.
The updated packet hash and actual recording checks are returned externally.

## 1. Scope, method and meaning of COMPLETE

COMPLETE chỉ nghĩa là bounded factual evidence acquisition/review được yêu cầu
đã hoàn tất: verified candidate bytes, 67 member hashes/marker review, all three
JSON structures/material fields, independently pinned LICENSE, exact PR
correction và revised exact NOTICE candidate. Không nghĩa license clearance,
NOTICE legally sufficient, reproducible upstream build, permission to Apply/
procure/install hoặc production. Unresolved legal/provenance questions vẫn ở
section 10; không biến source assertion thành legal-certification claim.

Current user explicitly authorized in-memory public artifact retrieval for
review only. No tgz file, extracted member, staging, installer or generated skill
was written to disk. Each short-lived Node process used built-in fetch,
crypto and zlib; it verified SHA-256/SHA-512 SRI before parsing member evidence.
In-memory tar inspection checked header checksums, regular-file types,
duplicates, length bounds and exact Design Appendix A path/size mapping.
No extractall, package code/hooks/upstream Python/npm/npx/pnpm dlx/uipro ran.
Process exit released the archive/member buffers; no temporary artifact file
remains to remove. Persisted evidence is only this explicitly allowed packet.

Marker scan (case-insensitive): SPDX, license, copyright, attribution, source,
upstream, author, notice; follow-up also checked licence and whole-word legal
terms. All 67 complete member texts were scanned, not first-N-byte sampling.
Counts are matching **lines**, not permission conclusions. Large JSONs were
parsed in full; summaries account for every top-level/record field and all
license categories, rather than omitting inconvenient large fields.

Only allowed repository edit:
`docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md`.
Tasks/Proposal/Analysis/Specs/Design/canonical files remain byte-identical.

## 2. FACTUAL_PROVENANCE_EVIDENCE — exact candidate

| Field                           | Verified observation                                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| npmName                         | ui-ux-pro-max-cli                                                                                                                      |
| version                         | 2.15.0                                                                                                                                 |
| gitHead                         | a38d04c3d5c298c851dbe5e6ee1965ee3de42cb5                                                                                               |
| publish timestamp               | 2026-08-13T17:10:39.965Z                                                                                                               |
| tarball URL                     | https://registry.npmjs.org/ui-ux-pro-max-cli/-/ui-ux-pro-max-cli-2.15.0.tgz                                                            |
| tarball SHA-256                 | 50966c6c1cf99db6c9706222df6a3094e8043413e8b94a477ff8339ebc3fef52                                                                       |
| npm integrity / computed SRI    | sha512-D0J/C40xrzzi5si6ZLtRGbEE5v3QjL7d4wJNnasmP3yfDSrGiuqVCdwQiqCNnIkbqOuVoA/uonR2o1WKXh3urw==                                        |
| compressed / regular-file bytes | 862011 / 4656556                                                                                                                       |
| regular-file entries            | 196                                                                                                                                    |
| retained / excluded             | 67 / 129                                                                                                                               |
| retained bytes                  | 3511280                                                                                                                                |
| target contract                 | 67 unchanged upstream members + SKILL.md + NOTICE.md + installation.json = 70                                                          |
| Registry response SHA-256       | f8d82fef1e740be764b009d6c73b1213227a66c76594ce5ee279e916f86fdbd8                                                                       |
| Verification result             | SHA-256 PASS; SRI PASS; sizes/counts PASS; Design Appendix A exact path/size equality PASS                                             |
| bundled skill / local adapter   | ui-ux-pro-max; frontmatter version not separately present per approved Design; yuta-adapter-1 is YUTA identity, not npm/skill equality |

Registry source: https://registry.npmjs.org/ui-ux-pro-max-cli .
Registry version metadata and the actual archive were independently compared.
Registry signature fields were observed but cryptographic publisher-signature/
build-provenance verification was NOT performed; SHA/SRI matching does not
make that claim. No mutable main/latest selected as payload.

## 3. LICENSE_TEXT_OBSERVED — published and pinned upstream

| Source                       | Exact bytes | SHA-256                                                          | Observation                                   |
| ---------------------------- | ----------- | ---------------------------------------------------------------- | --------------------------------------------- |
| package/package.json         | 2242        | 4d4c12409f4cfb3a782cc70cf96ff1563afbc3b873a95a461c2b89488e487321 | name/version match; license MIT; author empty |
| package/README.md            | 3380        | d6dc217b6145033c398617a3f181d82ce83b06360d9767590a1113a21344ba4a | License section says CC-BY-NC-4.0             |
| LICENSE at package gitHead   | 1075        | 738f69dfa83db5c347c678fb9d90e560877059f0de93a327c39001bff92dc014 | MIT, Copyright (c) 2024 Next Level Builder    |
| LICENSE at correction commit | 1075        | 738f69dfa83db5c347c678fb9d90e560877059f0de93a327c39001bff92dc014 | Exact same bytes as at package gitHead        |

Pinned sources, independently fetched in this evidence turn:

- https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/a38d04c3d5c298c851dbe5e6ee1965ee3de42cb5/LICENSE
- https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/b2ac9b2aa1c3bd6bb748b4b0f79c90319d50e0da/LICENSE

Exact published manifest field: `"license": "MIT"`.
Exact published README section:

```text
## License

CC-BY-NC-4.0
```

Full independently retrieved MIT text is preserved without edits in the NOTICE
candidate below. Repository LICENSE at a matching gitHead is strong source
context, not proof that it governs every third-party catalog or resolves the
contradictory published README. Package-level MIT is not substituted for
per-dataset evidence.

## 4. UPSTREAM_CORRECTION_EVIDENCE — PR 486

Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/pull/486

- Exact title: `docs(cli): correct cli/README.md license from CC-BY-NC-4.0 to MIT`.
- state: closed; merged: true.
- merged_at: 2026-09-06T03:59:28Z.
- merge commit: `b2ac9b2aa1c3bd6bb748b4b0f79c90319d50e0da`.
- parent: `f3ac195224eac1eb0dfe1a3059c2a6add78ffbe3`.
- PR response SHA-256: `e2080a3a2f1cf580fd9ff0bd68a459717fba86fe9681be9cf67d9cd6ef023deb`.
- Commit response SHA-256: `4a9f833ce3aea291c5f8d033898911f024d79ce756e5ae13242ccc22fe9cf6d4`.
- Exact changed path count: 1, cli/README.md, +1/-1.
- Parent README: 3380 bytes, SHA-256
  `d6dc217b6145033c398617a3f181d82ce83b06360d9767590a1113a21344ba4a`.
- Correction README: 3371 bytes, SHA-256
  `6f2e02fa25aff521ca94f7ba103a825fba2478012e4a52b4af94984e172d2d73`.
- Independent full-text equality: replace only CC-BY-NC-4.0 with MIT in
  parent README -> exact correction README bytes.

Exact fetched diff (179 bytes; SHA-256
`a7bed28cd811b269e01feb07bc6d285169832851a930311f0f7e75d92a2d784d`), source https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/b2ac9b2aa1c3bd6bb748b4b0f79c90319d50e0da.diff:

```diff
diff --git a/cli/README.md b/cli/README.md
index cd63222ea..20ad3c37e 100644
--- a/cli/README.md
+++ b/cli/README.md
@@ -98,4 +98,4 @@ bun link

 ## License

-CC-BY-NC-4.0
+MIT
```

Published README SHA equals **parent** README SHA, not corrected README SHA.
Today reviewed tarball SHA/SRI still equal user-approved investigated candidate.
Thus upstream corrected documentation later; observed published 2.15.0 bytes
did not acquire the correction. No claim about republishing or future registry
immutability, and no Control Tower license acceptance inferred from PR merge.

## 5. Three retained JSON members — complete structural/material review

| Member                                           | Bytes  | Exact member SHA-256                                             |
| ------------------------------------------------ | ------ | ---------------------------------------------------------------- |
| package/assets/data/data-provenance.json         | 36686  | e82fb33ed49375a300e93d9c11ccd1c1493c999e84ee7ee295e527634786e2e0 |
| package/assets/data/google-font-licenses.json    | 433127 | 35688523f2955795caa1a47c53b83099e60c1708461476f9cc3a050cf3b0148a |
| package/assets/data/phosphor-icons-upstream.json | 823933 | 2399325233b277b5c97a80e6a5e8941154f5d057beee4e7613db87c87d700236 |

### 5.1 data-provenance.json

schemaVersion=1; generatedAt=2026-08-13T00:00:00Z.
freshnessPolicy: manual-verifiedDays=365, needs-reviewDays=90.
51 records: 31 reasoning, 6 style, 12 dataset-contract, 2 catalog-snapshot.
Sources: 62 derived references + 52 official references. These are upstream
assertions, not independent copyright/license grants or YUTA review approval.

Every record field is accounted for: entityKind, entityId, sourceFile,
sourceKey (including Scope/Boundary/Compatibility/ConformanceBoundary/Count/
Snapshot where present), status, verifiedAt, sla, appliesTo, optional confidence,
sources with type/ref. No SPDX/license/copyright/attribution grant field occurs.
The apparently legal words in technical source URLs are not legal terms.

All source mappings and scope limitations are preserved below, including
31 internal products/colors derivations; no source family is omitted.
Exact sourceKey values remain record data, not activated UI behavior.

| Entity kind / ID                                        | File and exact sourceKey                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Status / verifiedAt / SLA / confidence / appliesTo                                   | All source type/ref values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| reasoning / academic-journal-scholarly-publishing       | ui-reasoning.csv; {"UI_Category":"Academic Journal / Scholarly Publishing"}                                                                                                                                                                                                                                                                                                                                                                                                                                 | active; 2026-08-12; needs-review; 0.88; ["design-system"]                            | derived: products.csv#Product Type=Academic Journal / Scholarly Publishing<br>derived: colors.csv#Product Type=Academic Journal / Scholarly Publishing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| reasoning / api-developer-portal                        | ui-reasoning.csv; {"UI_Category":"API Developer Portal"}                                                                                                                                                                                                                                                                                                                                                                                                                                                    | active; 2026-08-12; needs-review; 0.92; ["design-system"]                            | derived: products.csv#Product Type=API Developer Portal<br>derived: colors.csv#Product Type=API Developer Portal                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| reasoning / forum-discussion-board                      | ui-reasoning.csv; {"UI_Category":"Forum / Discussion Board"}                                                                                                                                                                                                                                                                                                                                                                                                                                                | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=Forum / Discussion Board<br>derived: colors.csv#Product Type=Forum / Discussion Board                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| reasoning / directory-listing-site                      | ui-reasoning.csv; {"UI_Category":"Directory / Listing Site"}                                                                                                                                                                                                                                                                                                                                                                                                                                                | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=Directory / Listing Site<br>derived: colors.csv#Product Type=Directory / Listing Site                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| reasoning / status-page-incident-management             | ui-reasoning.csv; {"UI_Category":"Status Page / Incident Management"}                                                                                                                                                                                                                                                                                                                                                                                                                                       | active; 2026-08-12; needs-review; 0.94; ["design-system"]                            | derived: products.csv#Product Type=Status Page / Incident Management<br>derived: colors.csv#Product Type=Status Page / Incident Management                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| reasoning / wiki-encyclopedia                           | ui-reasoning.csv; {"UI_Category":"Wiki / Encyclopedia"}                                                                                                                                                                                                                                                                                                                                                                                                                                                     | active; 2026-08-12; needs-review; 0.91; ["design-system"]                            | derived: products.csv#Product Type=Wiki / Encyclopedia<br>derived: colors.csv#Product Type=Wiki / Encyclopedia                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| reasoning / auction-platform                            | ui-reasoning.csv; {"UI_Category":"Auction Platform"}                                                                                                                                                                                                                                                                                                                                                                                                                                                        | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=Auction Platform<br>derived: colors.csv#Product Type=Auction Platform                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| reasoning / changelog-release-notes                     | ui-reasoning.csv; {"UI_Category":"Changelog / Release Notes"}                                                                                                                                                                                                                                                                                                                                                                                                                                               | active; 2026-08-12; needs-review; 0.9; ["design-system"]                             | derived: products.csv#Product Type=Changelog / Release Notes<br>derived: colors.csv#Product Type=Changelog / Release Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| reasoning / citizen-science-platform                    | ui-reasoning.csv; {"UI_Category":"Citizen Science Platform"}                                                                                                                                                                                                                                                                                                                                                                                                                                                | active; 2026-08-12; needs-review; 0.89; ["design-system"]                            | derived: products.csv#Product Type=Citizen Science Platform<br>derived: colors.csv#Product Type=Citizen Science Platform                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| reasoning / classifieds-buy-sell                        | ui-reasoning.csv; {"UI_Category":"Classifieds / Buy-Sell"}                                                                                                                                                                                                                                                                                                                                                                                                                                                  | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=Classifieds / Buy-Sell<br>derived: colors.csv#Product Type=Classifieds / Buy-Sell                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| reasoning / conference-symposium-landing-page           | ui-reasoning.csv; {"UI_Category":"Conference / Symposium Landing Page"}                                                                                                                                                                                                                                                                                                                                                                                                                                     | active; 2026-08-12; needs-review; 0.9; ["design-system"]                             | derived: products.csv#Product Type=Conference / Symposium Landing Page<br>derived: colors.csv#Product Type=Conference / Symposium Landing Page                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| reasoning / crowdfunding-platform                       | ui-reasoning.csv; {"UI_Category":"Crowdfunding Platform"}                                                                                                                                                                                                                                                                                                                                                                                                                                                   | active; 2026-08-12; needs-review; 0.92; ["design-system"]                            | derived: products.csv#Product Type=Crowdfunding Platform<br>derived: colors.csv#Product Type=Crowdfunding Platform                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| reasoning / digital-signage-kiosk                       | ui-reasoning.csv; {"UI_Category":"Digital Signage / Kiosk"}                                                                                                                                                                                                                                                                                                                                                                                                                                                 | active; 2026-08-12; needs-review; 0.88; ["design-system"]                            | derived: products.csv#Product Type=Digital Signage / Kiosk<br>derived: colors.csv#Product Type=Digital Signage / Kiosk                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| reasoning / e-signature-document-workflow               | ui-reasoning.csv; {"UI_Category":"E-signature / Document Workflow"}                                                                                                                                                                                                                                                                                                                                                                                                                                         | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=E-signature / Document Workflow<br>derived: colors.csv#Product Type=E-signature / Document Workflow                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| reasoning / feature-flag-config-management              | ui-reasoning.csv; {"UI_Category":"Feature Flag / Config Management"}                                                                                                                                                                                                                                                                                                                                                                                                                                        | active; 2026-08-12; needs-review; 0.91; ["design-system"]                            | derived: products.csv#Product Type=Feature Flag / Config Management<br>derived: colors.csv#Product Type=Feature Flag / Config Management                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| reasoning / government-portal-civic-services            | ui-reasoning.csv; {"UI_Category":"Government Portal / Civic Services"}                                                                                                                                                                                                                                                                                                                                                                                                                                      | active; 2026-08-12; needs-review; 0.95; ["design-system"]                            | derived: products.csv#Product Type=Government Portal / Civic Services<br>derived: colors.csv#Product Type=Government Portal / Civic Services                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| reasoning / grant-funding-portal                        | ui-reasoning.csv; {"UI_Category":"Grant / Funding Portal"}                                                                                                                                                                                                                                                                                                                                                                                                                                                  | active; 2026-08-12; needs-review; 0.92; ["design-system"]                            | derived: products.csv#Product Type=Grant / Funding Portal<br>derived: colors.csv#Product Type=Grant / Funding Portal                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| reasoning / lms-learning-management-system              | ui-reasoning.csv; {"UI_Category":"LMS (Learning Management System)"}                                                                                                                                                                                                                                                                                                                                                                                                                                        | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=LMS (Learning Management System)<br>derived: colors.csv#Product Type=LMS (Learning Management System)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| reasoning / no-code-low-code-builder                    | ui-reasoning.csv; {"UI_Category":"No-code / Low-code Builder"}                                                                                                                                                                                                                                                                                                                                                                                                                                              | active; 2026-08-12; needs-review; 0.89; ["design-system"]                            | derived: products.csv#Product Type=No-code / Low-code Builder<br>derived: colors.csv#Product Type=No-code / Low-code Builder                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| reasoning / open-source-project-landing                 | ui-reasoning.csv; {"UI_Category":"Open Source Project Landing"}                                                                                                                                                                                                                                                                                                                                                                                                                                             | active; 2026-08-12; needs-review; 0.9; ["design-system"]                             | derived: products.csv#Product Type=Open Source Project Landing<br>derived: colors.csv#Product Type=Open Source Project Landing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| reasoning / patient-portal-health-records               | ui-reasoning.csv; {"UI_Category":"Patient Portal / Health Records"}                                                                                                                                                                                                                                                                                                                                                                                                                                         | active; 2026-08-12; needs-review; 0.94; ["design-system"]                            | derived: products.csv#Product Type=Patient Portal / Health Records<br>derived: colors.csv#Product Type=Patient Portal / Health Records                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| reasoning / patent-ip-database                          | ui-reasoning.csv; {"UI_Category":"Patent / IP Database"}                                                                                                                                                                                                                                                                                                                                                                                                                                                    | active; 2026-08-12; needs-review; 0.89; ["design-system"]                            | derived: products.csv#Product Type=Patent / IP Database<br>derived: colors.csv#Product Type=Patent / IP Database                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| reasoning / q-and-a-community-platform                  | ui-reasoning.csv; {"UI_Category":"Q&A Community Platform"}                                                                                                                                                                                                                                                                                                                                                                                                                                                  | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=Q&A Community Platform<br>derived: colors.csv#Product Type=Q&A Community Platform                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| reasoning / research-lab-university-department          | ui-reasoning.csv; {"UI_Category":"Research Lab / University Department"}                                                                                                                                                                                                                                                                                                                                                                                                                                    | active; 2026-08-12; needs-review; 0.91; ["design-system"]                            | derived: products.csv#Product Type=Research Lab / University Department<br>derived: colors.csv#Product Type=Research Lab / University Department                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| reasoning / resume-cv-builder                           | ui-reasoning.csv; {"UI_Category":"Resume / CV Builder"}                                                                                                                                                                                                                                                                                                                                                                                                                                                     | active; 2026-08-12; needs-review; 0.92; ["design-system"]                            | derived: products.csv#Product Type=Resume / CV Builder<br>derived: colors.csv#Product Type=Resume / CV Builder                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| reasoning / review-platform                             | ui-reasoning.csv; {"UI_Category":"Review Platform"}                                                                                                                                                                                                                                                                                                                                                                                                                                                         | active; 2026-08-12; needs-review; 0.94; ["design-system"]                            | derived: products.csv#Product Type=Review Platform<br>derived: colors.csv#Product Type=Review Platform                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| reasoning / rpa-automation-dashboard                    | ui-reasoning.csv; {"UI_Category":"RPA / Automation Dashboard"}                                                                                                                                                                                                                                                                                                                                                                                                                                              | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=RPA / Automation Dashboard<br>derived: colors.csv#Product Type=RPA / Automation Dashboard                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| reasoning / survey-form-builder                         | ui-reasoning.csv; {"UI_Category":"Survey / Form Builder"}                                                                                                                                                                                                                                                                                                                                                                                                                                                   | active; 2026-08-12; needs-review; 0.92; ["design-system"]                            | derived: products.csv#Product Type=Survey / Form Builder<br>derived: colors.csv#Product Type=Survey / Form Builder                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| reasoning / telemedicine-platform                       | ui-reasoning.csv; {"UI_Category":"Telemedicine Platform"}                                                                                                                                                                                                                                                                                                                                                                                                                                                   | active; 2026-08-12; needs-review; 0.88; ["design-system"]                            | derived: products.csv#Product Type=Telemedicine Platform<br>derived: colors.csv#Product Type=Telemedicine Platform                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| reasoning / testimonial-and-social-proof-widget         | ui-reasoning.csv; {"UI_Category":"Testimonial & Social Proof Widget"}                                                                                                                                                                                                                                                                                                                                                                                                                                       | active; 2026-08-12; needs-review; 0.91; ["design-system"]                            | derived: products.csv#Product Type=Testimonial & Social Proof Widget<br>derived: colors.csv#Product Type=Testimonial & Social Proof Widget                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| reasoning / ticketing-box-office                        | ui-reasoning.csv; {"UI_Category":"Ticketing / Box Office"}                                                                                                                                                                                                                                                                                                                                                                                                                                                  | active; 2026-08-12; needs-review; 0.93; ["design-system"]                            | derived: products.csv#Product Type=Ticketing / Box Office<br>derived: colors.csv#Product Type=Ticketing / Box Office                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| style / liquid-glass                                    | styles.csv; {"Style ID":"liquid-glass"}                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | active; 2026-08-13; manual-verified; 0.94; ["style-search","gallery"]                | official: https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| style / material-you-md3-mobile                         | styles.csv; {"Style ID":"material-you-md3-mobile"}                                                                                                                                                                                                                                                                                                                                                                                                                                                          | active; 2026-08-13; manual-verified; 0.94; ["style-search","gallery"]                | official: https://m3.material.io/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| style / fluent-2                                        | styles.csv; {"Style ID":"fluent-2"}                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | active; 2026-08-13; manual-verified; 0.94; ["style-search","gallery"]                | official: https://fluent2.microsoft.design/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| style / shopify-polaris                                 | styles.csv; {"Style ID":"shopify-polaris"}                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | active; 2026-08-13; manual-verified; 0.94; ["style-search","gallery"]                | official: https://shopify.dev/docs/api/polaris/index                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| style / spectrum-design-system                          | styles.csv; {"Style ID":"spectrum-design-system"}                                                                                                                                                                                                                                                                                                                                                                                                                                                           | active; 2026-08-13; manual-verified; 0.94; ["style-search","gallery"]                | official: https://opensource.adobe.com/spectrum-design-data/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| style / spectrum-2                                      | styles.csv; {"Style ID":"spectrum-2"}                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | supplemental; 2026-08-13; manual-verified; 0.94; ["style-search","gallery"]          | official: https://s2.spectrum.adobe.com/index.html                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| dataset-contract / core-colors-accessibility            | colors.csv; {"Scope":"No 1-192; contrast-threshold wording in Notes only","Boundary":"Does not attest that every palette pair was measured"}                                                                                                                                                                                                                                                                                                                                                                | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum<br>official: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| dataset-contract / core-charts-accessibility            | charts.csv; {"Scope":"No 1-25; Color Guidance, Accessibility Notes, and A11y Fallback fields","Boundary":"Does not claim that a named chart library enforces the guidance"}                                                                                                                                                                                                                                                                                                                                 | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color<br>official: https://carbondesignsystem.com/data-visualization/chart-anatomy/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| dataset-contract / core-landing-accessibility           | landing.csv; {"Scope":"No 1, 2, 9, 15, 21, 22, 24, 25, 29, and 33; Color Strategy and Conversion Optimization accessibility text"}                                                                                                                                                                                                                                                                                                                                                                          | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://www.w3.org/WAI/tutorials/carousels/<br>official: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html<br>official: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| dataset-contract / core-wcag-22-guidance                | ux-guidelines.csv; {"Scope":"No 100-107; Issue, Description, Do, Don't, and code-example fields","ConformanceBoundary":"Rows 100, 103, 104, and 107 are AA; rows 101-102 are AAA; rows 105-106 are A. Accessible Authentication (Enhanced) AAA is not represented."}                                                                                                                                                                                                                                        | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/<br>official: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| dataset-contract / core-typography-imports              | typography.csv; {"Scope":"No 20, 39, 59, 63, 66-68, 70, and 71; named families, Google Fonts URL, CSS Import, Tailwind Config, and stated weight/style availability"}                                                                                                                                                                                                                                                                                                                                       | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://developers.google.com/fonts/docs/css2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| dataset-contract / core-icon-semantics                  | icons.csv; {"Scope":"No 1-105; Allowed Contexts and contextual accessibility guidance in Usage; No 105 library/import examples","Compatibility":"Semantic Role remains a legacy recommended-default field, not an immutable semantic classification"}                                                                                                                                                                                                                                                       | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://www.w3.org/WAI/tutorials/images/decorative/<br>official: https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/<br>official: https://www.w3.org/WAI/ARIA/apg/patterns/button/<br>official: https://github.com/phosphor-icons/react                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| dataset-contract / core-motion-accessibility            | motion.csv; {"Scope":"No 1-17; GSAP API identifiers in GSAP Snippet/Framework Notes and reduced-motion handling in Framework Notes","Boundary":"Does not verify product-specific duration, count, or performance recommendations"}                                                                                                                                                                                                                                                                          | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://gsap.com/docs/v3/GSAP/<br>official: https://gsap.com/docs/v3/Plugins/ScrollTrigger/<br>official: https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html<br>official: https://www.w3.org/WAI/tutorials/carousels/animations/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| dataset-contract / core-native-input                    | app-interface.csv; {"Scope":"No 6, 31, and 32; Description, Do, Don't, and code-example fields"}                                                                                                                                                                                                                                                                                                                                                                                                            | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://developer.apple.com/design/human-interface-guidelines/accessibility<br>official: https://developer.android.com/guide/topics/ui/accessibility/apps                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| dataset-contract / core-react-effects                   | react-performance.csv; {"Scope":"No 43-44; Description, Do, Don't, and code-example fields"}                                                                                                                                                                                                                                                                                                                                                                                                                | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://react.dev/reference/react/useEffectEvent<br>official: https://react.dev/learn/referencing-values-with-refs<br>official: https://react.dev/reference/react/useEffect                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| dataset-contract / core-form-validation-errors          | ux-guidelines.csv; {"Scope":"No 55 and 109; Description, Do, Don't, and code-example fields"}                                                                                                                                                                                                                                                                                                                                                                                                               | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://design-system.service.gov.uk/components/error-summary/<br>official: https://design-system.service.gov.uk/components/error-message/<br>official: https://www.w3.org/WAI/tutorials/forms/notifications/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| dataset-contract / core-text-layout-resilience          | ux-guidelines.csv; {"Scope":"No 8, 14, 19, 78, and 110-119; Issue, Platform, Description, Do, Don't, code-example, and Severity fields","Boundary":"Heading balance is a progressive browser-controlled heuristic and does not guarantee an orphan-free or exact line break; timing and loading choices remain platform- and component-specific; compact-label guidance does not authorize blanket nonbreaking spaces, hardcoded line breaks, inaccessible truncation, or status announced by color alone"} | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://www.w3.org/TR/css-text-4/<br>official: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html<br>official: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html<br>official: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html<br>official: https://fluent2.microsoft.design/components/web/react/core/tag/usage<br>official: https://fluent2.microsoft.design/components/web/react/core/skeleton/usage<br>official: https://fluent2.microsoft.design/motion<br>official: https://fluent2.microsoft.design/wait-ux<br>official: https://m3.material.io/foundations/interaction/states/overview<br>official: https://www.w3.org/TR/web-animations-1/<br>official: https://www.w3.org/TR/css-animations-1/ |
| dataset-contract / html-tailwind-text-layout-resilience | stacks/html-tailwind.csv; {"Scope":"No 57-59; Guideline, Description, Do, Don't, Code Good, Code Bad, Docs URL, Applies To, Status, and Verified At fields","Boundary":"Balanced wrapping is progressive enhancement; wrap-anywhere is limited to unpredictable long tokens; compact-label truncation is a last resort after collection reflow and requires a bounded shrink path"}                                                                                                                         | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://tailwindcss.com/docs/text-wrap<br>official: https://tailwindcss.com/docs/overflow-wrap<br>official: https://tailwindcss.com/docs/flex-wrap<br>official: https://tailwindcss.com/docs/min-width<br>official: https://tailwindcss.com/docs/white-space                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| catalog-snapshot / google-fonts-catalog-2026-08-13      | google-fonts.csv; {"Snapshot":"catalog-summary.json","Count":1934}                                                                                                                                                                                                                                                                                                                                                                                                                                          | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://developers.google.com/fonts/docs/developer_api<br>official: https://github.com/google/fonts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| catalog-snapshot / phosphor-icons-catalog-2.1.1         | phosphor-icons-upstream.json; {"Snapshot":"catalog-summary.json","Count":1512}                                                                                                                                                                                                                                                                                                                                                                                                                              | active; 2026-08-13; manual-verified; confidence ABSENT; ["search","design-guidance"] | official: https://github.com/phosphor-icons/core<br>official: https://github.com/phosphor-icons/react                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

NOTICE_REQUIREMENT_FINDING: preserve the complete unchanged provenance JSON
alongside datasets, including source refs and boundaries, not just this summary.
Official reference ≠ copying permission. Apple, Google Material, Microsoft
Fluent, Shopify, Adobe, W3C, Carbon, GSAP, Android, React, GOV.UK, Tailwind and
catalog sources are identified above; their links do not grant all original
documentation rights to YUTA. No external guidance becomes Product authority.

### 5.2 google-font-licenses.json

All root fields: schemaVersion=1; source; familyCount=1934; families[1934];
excludedFamilies[8]. Source exactly:

```json
{
  "repository": "https://github.com/google/fonts",
  "metadataFile": "METADATA.pb",
  "revision": "038b637da7b3fd956a4ed93ffc607c3d5e4ce172"
}
```

Every active-family object uses name, license, date_added, designer (array),
status, verifiedAt. All 1,934 are active and upstream-marked verifiedAt
2026-08-13; zero missing/empty designer arrays. These are recorded attribution
names, not proof each designer is a copyright holder. No copyright text,
reserved-font-name statement, complete license text or per-family license-file
path occurs in this JSON.

| Exact label           | Count |
| --------------------- | ----- |
| OFL                   | 1894  |
| APACHE2               | 35    |
| UFL                   | 5     |
| Other / unknown label | 0     |

All 40 non-OFL entries are listed to preserve the complete alternative-license
set; the other 1,894 entries retain their individual designer/name/date fields
in the exact-hashed unchanged JSON, not collapsed into an asserted MIT grant.

| Name                   | License | date_added | All designer values     |
| ---------------------- | ------- | ---------- | ----------------------- |
| Aclonica               | APACHE2 | 2011-04-27 | ["Astigmatic"]          |
| Calligraffitti         | APACHE2 | 2011-01-06 | ["Open Window"]         |
| Cherry Cream Soda      | APACHE2 | 2011-01-06 | ["Font Diner"]          |
| Chewy                  | APACHE2 | 2011-01-06 | ["Sideshow"]            |
| Coming Soon            | APACHE2 | 2011-01-06 | ["Open Window"]         |
| Crafty Girls           | APACHE2 | 2011-01-06 | ["Tart Workshop"]       |
| Crushed                | APACHE2 | 2011-01-06 | ["Astigmatic"]          |
| Fontdiner Swanky       | APACHE2 | 2011-01-06 | ["Font Diner"]          |
| Homemade Apple         | APACHE2 | 2011-01-06 | ["Font Diner"]          |
| Irish Grover           | APACHE2 | 2011-03-16 | ["Sideshow"]            |
| Just Another Hand      | APACHE2 | 2010-12-20 | ["Astigmatic"]          |
| Kosugi                 | APACHE2 | 2016-01-21 | ["MOTOYA"]              |
| Kosugi Maru            | APACHE2 | 2016-01-21 | ["MOTOYA"]              |
| Kranky                 | APACHE2 | 2011-01-06 | ["Sideshow"]            |
| Luckiest Guy           | APACHE2 | 2011-01-06 | ["Astigmatic"]          |
| Maiden Orange          | APACHE2 | 2010-12-20 | ["Astigmatic"]          |
| Montez                 | APACHE2 | 2011-08-17 | ["Astigmatic"]          |
| Mountains of Christmas | APACHE2 | 2010-12-14 | ["Tart Workshop"]       |
| Permanent Marker       | APACHE2 | 2011-01-06 | ["Font Diner"]          |
| Rancho                 | APACHE2 | 2011-10-12 | ["Sideshow"]            |
| Redressed              | APACHE2 | 2011-06-21 | ["Astigmatic"]          |
| Roboto Slab            | APACHE2 | 2013-04-10 | ["Christian Robertson"] |
| Rochester              | APACHE2 | 2011-08-03 | ["Sideshow"]            |
| Rock Salt              | APACHE2 | 2011-01-06 | ["Sideshow"]            |
| Satisfy                | APACHE2 | 2011-10-12 | ["Sideshow"]            |
| Schoolbell             | APACHE2 | 2011-01-06 | ["Font Diner"]          |
| Slackey                | APACHE2 | 2011-01-06 | ["Sideshow"]            |
| Smokum                 | APACHE2 | 2011-08-03 | ["Astigmatic"]          |
| Special Elite          | APACHE2 | 2011-04-20 | ["Astigmatic"]          |
| Sunshiney              | APACHE2 | 2011-01-06 | ["Sideshow"]            |
| Syncopate              | APACHE2 | 2011-04-27 | ["Astigmatic"]          |
| Ubuntu                 | UFL     | 2010-12-15 | ["Dalton Maag"]         |
| Ubuntu Condensed       | UFL     | 2011-10-05 | ["Dalton Maag"]         |
| Ubuntu Mono            | UFL     | 2011-10-05 | ["Dalton Maag"]         |
| Ubuntu Sans            | UFL     | 2024-05-01 | ["Dalton Maag"]         |
| Ubuntu Sans Mono       | UFL     | 2024-05-01 | ["Dalton Maag"]         |
| Ultra                  | APACHE2 | 2011-05-09 | ["Astigmatic"]          |
| Unkempt                | APACHE2 | 2011-12-05 | ["Sideshow"]            |
| Walter Turncoat        | APACHE2 | 2011-01-06 | ["Sideshow"]            |
| Yellowtail             | APACHE2 | 2011-07-20 | ["Astigmatic"]          |

Every excluded-family field is preserved in the following table. All are
status=needs-review, verifiedAt=2026-08-13; none is an accepted active family.

| Name                   | Exact reason                                                                       | Exact source                                             |
| ---------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Edu NSW ACT Cursive    | No exact-family METADATA.pb entry in the official google/fonts repository snapshot | https://fonts.google.com/specimen/Edu+NSW+ACT+Cursive    |
| Edu NSW ACT Hand Pre   | No exact-family METADATA.pb entry in the official google/fonts repository snapshot | https://fonts.google.com/specimen/Edu+NSW+ACT+Hand+Pre   |
| Edu QLD Hand           | No exact-family METADATA.pb entry in the official google/fonts repository snapshot | https://fonts.google.com/specimen/Edu+QLD+Hand           |
| Edu SA Hand            | No exact-family METADATA.pb entry in the official google/fonts repository snapshot | https://fonts.google.com/specimen/Edu+SA+Hand            |
| Edu VIC WA NT Hand     | No exact-family METADATA.pb entry in the official google/fonts repository snapshot | https://fonts.google.com/specimen/Edu+VIC+WA+NT+Hand     |
| Edu VIC WA NT Hand Pre | No exact-family METADATA.pb entry in the official google/fonts repository snapshot | https://fonts.google.com/specimen/Edu+VIC+WA+NT+Hand+Pre |
| Google Sans            | No exact-family METADATA.pb entry in the official google/fonts repository snapshot | https://fonts.google.com/specimen/Google+Sans            |
| Google Sans Flex       | No exact-family METADATA.pb entry in the official google/fonts repository snapshot | https://fonts.google.com/specimen/Google+Sans+Flex       |

Independent sources at pinned Google revision
038b637da7b3fd956a4ed93ffc607c3d5e4ce172:

| Source                                                                                                              | Bytes | SHA-256                                                          | Material observation                                                                             |
| ------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| https://raw.githubusercontent.com/google/fonts/038b637da7b3fd956a4ed93ffc607c3d5e4ce172/README.md                   | 4793  | 99b7fb7a8be1ad77e3138e94cdb342fce0d978002119b447513bbd571e6f1a5a | README: top-level directory license applies to all files; per-family license/authorship metadata |
| https://raw.githubusercontent.com/google/fonts/038b637da7b3fd956a4ed93ffc607c3d5e4ce172/ofl/abeezee/OFL.txt         | 4516  | f0376d04eb58fb19e9f1690a99a1eb37380ad0246f7d503f2abd8e8a74ed12be | ABeeZee OFL1.1: copyright + reserved name; full text inspected                                   |
| https://raw.githubusercontent.com/google/fonts/038b637da7b3fd956a4ed93ffc607c3d5e4ce172/apache/aclonica/LICENSE.txt | 11358 | cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30 | Aclonica Apache2.0: reproduction/notice conditions; full text inspected                          |
| https://raw.githubusercontent.com/google/fonts/038b637da7b3fd956a4ed93ffc607c3d5e4ce172/ufl/ubuntu/UFL.txt          | 4673  | 2f0015108d68627bd788d313f529c21ff4da2c2c42a5e1f3883acc83480f9002 | Ubuntu UFL1.0: copy/notice/name/non-endorsement conditions; full text inspected                  |

LICENSE_TEXT_OBSERVED: pinned README states, exactly:
“The top-level directories indicate the license of all files found within them.”
This is material for derived METADATA.pb records; **no font binaries** in the
67-member projection does not by itself remove metadata-license questions.
Independent examples demonstrate OFL 1.1, Apache 2.0, Ubuntu Font Licence 1.0,
not 1,934 separately cleared original notices. Full fetched example texts,
including ABeeZee copyright/reserved name, appear in the NOTICE candidate;
raw hashes above retain original CRLF/LF distinctions.

NOTICE_REQUIREMENT_FINDING:
OFL clause 2 and UFL clause 1 require their applicable copyright/license notices
to accompany covered copies and permit text/header/accessible metadata forms.
Apache 2.0 section 4 covers license copies, modified-file notices, retained
attributions and NOTICE content where present. These observed conditions must
be reviewed for **this metadata projection**; no automatic blanket application
or exemption is decided. Preserve every JSON attribution/license/exclusion field.
Designer values alone do not reconstruct all original copyright/RFN notices.
No font fetch, install, rendering or font application was performed/authorized.

UNRESOLVED_LICENSE_QUESTION: whether copied/derived metadata requires additional
family-specific notices, and the sufficiency of proposed notice preservation,
remain human legal/business acceptance questions. Example license texts cannot
be represented as every family's original notice. Metadata lineage is declared
by source.revision; a complete independent rebuild of 1,934 records is not
claimed or required to label this bounded evidence collection complete.

### 5.3 phosphor-icons-upstream.json

Complete root metadata (icons array summarized separately without dropping
schema fields):

```json
{
  "schemaVersion": 1,
  "source": {
    "package": "@phosphor-icons/core",
    "version": "2.1.1",
    "repository": "https://github.com/phosphor-icons/core",
    "reactPackage": "@phosphor-icons/react",
    "reactVersion": "2.1.10"
  },
  "status": "active",
  "verifiedAt": "2026-08-13",
  "iconCount": 1512,
  "weights": ["thin", "light", "regular", "bold", "fill", "duotone"],
  "reactImports": {
    "clientModule": "@phosphor-icons/react",
    "ssrModule": "@phosphor-icons/react/ssr"
  },
  "curatedValidatedCount": 100
}
```

Actual icons length=1512. All encountered icon fields:
`alias`, `categories`, `clientImport`, `codepoint`, `component`, `figmaCategory`, `name`, `publishedIn`, `ssrImport`, `tags`, `updatedIn`.
Optional alias is retained along with tags/categories/figmaCategory,
codepoint, component, version markers and client/SSR import strings.
No SVG/font binary is present in approved retained mapping.

No actual license/copyright/author/attribution/notice grant field exists in
this JSON. Marker hits are icon name/component/import `Copyright` or catalog
tags such as `license`; they are not copyright statements. The source object
declares Core2.1.1/React2.1.10 but no immutable core commit or catalog digest
at its upstream source.

Independent npm metadata:

- https://registry.npmjs.org/@phosphor-icons/core/2.1.1: name @phosphor-icons/core, version 2.1.1, license MIT,
  author Tobias Fried; declared repository git+https://github.com/phosphor-icons/phosphor-core.git;
  response SHA-256 f2b1251fdd4ac33d43fbb8e2cdfeb6268bf8c8a2562d40d57b60507ffe93c62a; gitHead ABSENT.
- https://registry.npmjs.org/@phosphor-icons/react/2.1.10: name @phosphor-icons/react, version 2.1.10, license MIT,
  author Tobias Fried; declared repository git+https://github.com/phosphor-icons/react.git;
  response SHA-256 b548b1b4e24b2ba6aa634f2f9f74fc4827dba8ee19541cfc25ea40fb2750ba8a; gitHead ABSENT.

React v2.1.10 resolves to commit 57424d5f99b793b585f5c6f5cab76f79772510e5;
pinned LICENSE https://raw.githubusercontent.com/phosphor-icons/react/57424d5f99b793b585f5c6f5cab76f79772510e5/LICENSE, 1071 bytes,
SHA-256 6918b72504641180600cbbd4a86b0dfa9dfccf788775694325b71b9a029f6eb4: MIT, Copyright (c) 2020 Phosphor Icons.
Exact full text is included in NOTICE, with its observed scope labelled.

Core2.1.1 immutable tag relationship NOT_ESTABLISHED:
GitHub commit lookups for v2.1.1 and 2.1.1 both returned HTTP422
“No commit found”; tags endpoint returned v2.0.8/v2.0.6/v2.0.2/v2.0.1/v2.0.0.
No current main substituted. These are actual read-only findings, not execution
failures. npm Core repository URL phosphor-core versus JSON core URL is recorded,
not silently equated as artifact-byte proof. React LICENSE is not asserted to
bind the Core2.1.1 snapshot automatically.

NOTICE_REQUIREMENT_FINDING: preserve all source/catalog fields unchanged and
Phosphor attribution; include independently observed MIT text labelled as
React evidence. Fixture license=MIT is not licensing authority for actual data.
UNRESOLVED_LICENSE_QUESTION: exact Core snapshot lineage and applicable copyright/
notice coverage remain explicit; package-level MIT alone is insufficient proof.

## 6. All-67 marker scan and additional relevant members

52/67 files have at least one requested substring marker; 15 additional files
outside the three main JSONs have whole-word legal/notice or licence/license
hits. No retained member contains SPDX. All member hashes are in section 8.

| Retained target                                             | SPDX | license | copyright | attribution | source | upstream | author | notice |
| ----------------------------------------------------------- | ---- | ------- | --------- | ----------- | ------ | -------- | ------ | ------ |
| data/app-interface.csv                                      | 0    | 0       | 0         | 0           | 1      | 0        | 0      | 0      |
| data/catalog-summary.json                                   | 0    | 2       | 0         | 0           | 0      | 2        | 0      | 0      |
| data/charts.csv                                             | 0    | 0       | 0         | 1           | 2      | 0        | 0      | 0      |
| data/colors.csv                                             | 0    | 0       | 0         | 0           | 1      | 0        | 1      | 0      |
| data/data-provenance.json                                   | 0    | 0       | 0         | 0           | 158    | 1        | 1      | 0      |
| data/google-font-licenses.json                              | 0    | 1934    | 0         | 0           | 12     | 0        | 0      | 0      |
| data/google-fonts.csv                                       | 0    | 0       | 0         | 0           | 3      | 0        | 0      | 0      |
| data/icons.csv                                              | 0    | 0       | 0         | 0           | 1      | 0        | 0      | 1      |
| data/landing.csv                                            | 0    | 0       | 0         | 0           | 2      | 0        | 4      | 0      |
| data/motion.csv                                             | 0    | 1       | 0         | 0           | 0      | 0        | 0      | 0      |
| data/phosphor-icons-upstream.json                           | 0    | 2       | 4         | 0           | 10     | 0        | 0      | 0      |
| data/products.csv                                           | 0    | 3       | 0         | 3           | 4      | 0        | 12     | 0      |
| data/react-performance.csv                                  | 0    | 0       | 0         | 0           | 1      | 0        | 0      | 0      |
| data/stacks/angular.csv                                     | 0    | 0       | 0         | 0           | 1      | 0        | 2      | 1      |
| data/stacks/astro.csv                                       | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| data/stacks/avalonia.csv                                    | 0    | 0       | 0         | 0           | 9      | 0        | 0      | 0      |
| data/stacks/flutter.csv                                     | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| data/stacks/html-tailwind.csv                               | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| data/stacks/javafx.csv                                      | 0    | 0       | 0         | 0           | 6      | 0        | 0      | 0      |
| data/stacks/jetpack-compose.csv                             | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| data/stacks/laravel.csv                                     | 0    | 0       | 0         | 0           | 3      | 0        | 3      | 0      |
| data/stacks/nextjs.csv                                      | 0    | 0       | 0         | 0           | 1      | 0        | 1      | 0      |
| data/stacks/nuxt-ui.csv                                     | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| data/stacks/nuxtjs.csv                                      | 0    | 0       | 0         | 0           | 1      | 0        | 0      | 0      |
| data/stacks/react-native.csv                                | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| data/stacks/react.csv                                       | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| data/stacks/shadcn.csv                                      | 0    | 0       | 0         | 0           | 3      | 0        | 1      | 0      |
| data/stacks/svelte.csv                                      | 0    | 0       | 0         | 0           | 1      | 0        | 0      | 0      |
| data/stacks/swiftui.csv                                     | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| data/stacks/threejs.csv                                     | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| data/stacks/uno.csv                                         | 0    | 0       | 0         | 0           | 9      | 0        | 0      | 0      |
| data/stacks/uwp.csv                                         | 0    | 0       | 0         | 0           | 11     | 0        | 0      | 0      |
| data/stacks/vue.csv                                         | 0    | 0       | 0         | 0           | 1      | 0        | 0      | 0      |
| data/stacks/winui.csv                                       | 0    | 0       | 0         | 0           | 14     | 0        | 0      | 0      |
| data/stacks/wpf.csv                                         | 0    | 0       | 0         | 0           | 14     | 0        | 0      | 0      |
| data/styles.csv                                             | 0    | 0       | 0         | 0           | 4      | 0        | 1      | 0      |
| data/typography.csv                                         | 0    | 0       | 0         | 0           | 3      | 0        | 2      | 0      |
| data/ui-reasoning.csv                                       | 0    | 0       | 0         | 1           | 1      | 0        | 13     | 0      |
| data/ux-guidelines.csv                                      | 0    | 0       | 0         | 0           | 0      | 0        | 2      | 0      |
| scripts/core.py                                             | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| scripts/design_system.py                                    | 0    | 0       | 0         | 0           | 2      | 0        | 1      | 0      |
| scripts/reasoning_contract.py                               | 0    | 0       | 0         | 0           | 0      | 0        | 1      | 0      |
| scripts/search.py                                           | 0    | 0       | 0         | 0           | 1      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/google-api.json             | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/google-catalog.json         | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/google-existing.csv         | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/google-metadata.json        | 0    | 2       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/google-overrides.json       | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/icons-curated.csv           | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/phosphor-core.json          | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/phosphor-package.json       | 0    | 1       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/phosphor-react-exports.json | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/catalogs/phosphor-react-package.json | 0    | 1       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/fixtures/relevance-baseline.json              | 0    | 0       | 0         | 0           | 5      | 0        | 6      | 0      |
| scripts/tests/fixtures/relevance-cases.json                 | 0    | 0       | 0         | 0           | 1      | 0        | 6      | 0      |
| scripts/tests/fixtures/relevance-thresholds.json            | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/test_catalog_refresh.py                       | 0    | 24      | 0         | 0           | 14     | 3        | 0      | 0      |
| scripts/tests/test_core_data_quality.py                     | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/test_core.py                                  | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/test_data_contracts.py                        | 0    | 12      | 0         | 0           | 32     | 2        | 0      | 0      |
| scripts/tests/test_design_system_mode.py                    | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/test_native_desktop_stack_freshness.py        | 0    | 0       | 0         | 0           | 1      | 0        | 0      | 0      |
| scripts/tests/test_relevance_evaluator.py                   | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/test_style_taxonomy.py                        | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| scripts/tests/test_text_layout_resilience.py                | 0    | 0       | 0         | 0           | 0      | 0        | 0      | 0      |
| scripts/tests/test_web_stack_freshness.py                   | 0    | 0       | 0         | 0           | 2      | 0        | 0      | 0      |
| scripts/validate_data.py                                    | 0    | 25      | 0         | 0           | 76     | 4        | 0      | 0      |

### Additional potentially material findings — exact snippets

Every path below resolves to its SHA-256 in section 8. Only relevant excerpt
is quoted; the complete file was scanned. This avoids treating instructions
or unrelated example Product vocabulary as license terms.

| Member target                                               | Exact relevant excerpt / field                                                   | Review finding                                                                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| data/catalog-summary.json                                   | `"unlicensedFamiliesExcluded": true`; snapshots.google-font-licenses.json.sha256 | Upstream gating assertion and four embedded file digests, not legal clearance; all four match actual member hashes |
| scripts/tests/fixtures/catalogs/google-metadata.json        | `"license": "APACHE2"`, `"license": "OFL"`; Zeta Serif / Alpha Sans              | Synthetic catalog metadata; not real font licensing authority                                                      |
| scripts/tests/fixtures/catalogs/phosphor-package.json       | `"name": "@phosphor-icons/core"`, `"version": "2.1.1"`, `"license": "MIT"`       | Fixture, not publisher evidence; actual npm metadata independently checked                                         |
| scripts/tests/fixtures/catalogs/phosphor-react-package.json | `"name": "@phosphor-icons/react"`, `"version": "2.1.10"`, `"license": "MIT"`     | Same limitation; not an executed package                                                                           |
| scripts/validate_data.py                                    | `FONT_LICENSES = {"OFL", "APACHE2", "UFL"}`                                      | Validator allowset and source-revision checks; no legal grant; never executed                                      |
| scripts/tests/test_catalog_refresh.py                       | `"invalid or missing official license"`; `"fixture-catalogs-v1"`                 | Tests describe data-validation rules, not clearance; never executed                                                |
| scripts/tests/test_data_contracts.py                        | `licenses["families"][0]["license"] = "UNKNOWN"`                                 | Negative fixture mutation in source text, not performed                                                            |
| data/motion.csv                                             | `review the current GSAP license`                                                | Explicit caution for a recommended third-party tool; no GSAP install/use authorized                                |
| data/charts.csv                                             | `attribution` in root-cause analytics keywords                                   | Non-legal analytics vocabulary                                                                                     |
| data/icons.csv                                              | `Info notice alert`                                                              | UI label, not legal notice                                                                                         |
| data/landing.csv                                            | `About Author`                                                                   | Suggested page content, not code/data authorship notice                                                            |
| data/products.csv                                           | `License management`, `Creator attribution`, `Licensed music library`            | Suggested product features, not rights granted by retained dataset                                                 |
| data/stacks/angular.csv                                     | `Depending on ZoneJS to notice arbitrary state mutation`                         | Technical recommendation, not legal notice                                                                         |
| data/ui-reasoning.csv                                       | `constraint:creator-attribution`                                                 | Suggested product behavior, not actual attribution owner                                                           |
| data/ux-guidelines.csv                                      | `author-created content`, `author-controlled drag operations`                    | Accessibility guidance, not copyright-owner declarations                                                           |

Source/upstream/author marker hits elsewhere were reviewed as provenance URLs,
code identifiers, example terms or technical guidance. Preserve all unchanged
source references; no additional embedded copyright or complete license notice
was discovered. This is a scoped marker/text finding, not a legal guarantee.

Excluded `package/assets/skills/ui-styling/LICENSE.txt` is 11357 bytes,
SHA-256 58d1e17ffe5109a7ae296caafcadfdbe6a7d176f0bc4ab01e12a689b0499d8bd.
It has no Design Appendix A mapping. No direct provenance relation to retained
core was demonstrated; its text is NOT used as retained-core authority.

## 7. NOTICE_REQUIREMENT_FINDING — preservation and 70-file contract

Revised NOTICE candidate below includes observed repository MIT notices,
complete Phosphor React MIT text and the three independently verified Google
license examples, with exact source scope/discrepancies identified.
All original JSON/CSV/Python records remain unmodified in the 67-file projection;
their individual metadata/attribution fields must not be dropped or rewritten.
NOTICE and review completion do not assign blanket MIT to third-party data.

No inspected text establishes that an additional output **filename** outside
D4/T10 is mandatory for this exact bounded use. MIT inclusion, OFL/UFL allowed
notice forms and Apache documentation/NOTICE alternatives can be represented
within NOTICE plus existing unchanged members. This is structural feasibility,
NOT a finding of legal sufficiency for every derived record.

Fixed70: **STRUCTURALLY_PRESERVED; LEGAL_ACCEPTANCE_PENDING**.
No path/count expansion requested or performed. If human notice review concludes
a separate original notice file is required, return NEEDS_DESIGN_REVIEW before
Apply; do not add a 71st path. If only notice text needs revision, rehash/review
that candidate; no automatic adoption.

## 8. Exact 67 / 129 inventory and all retained hashes

Approved Design Appendix A was read from unchanged Design hash
77fcbdc9938f48c7414d037e5216a2d5f0d2b725561b55ed08d5e80db47dde33.
Each source/destination/size matched exactly. No path regenerated from latest/
main. Every source is literal `package/assets/` + target below; no generic
prefix extraction was executed. Each row is the exact explicit mapping.

| Exact archive source                                                       | Exact target relative path                                  | Bytes  | SHA-256                                                          |
| -------------------------------------------------------------------------- | ----------------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| package/assets/data/app-interface.csv                                      | data/app-interface.csv                                      | 11046  | 331e7cf2c0b222d80c566c5f255c63cb339f65bfd02e471a720f28e4864a9f08 |
| package/assets/data/catalog-summary.json                                   | data/catalog-summary.json                                   | 2392   | 65fe0b64480a8a827738297d0a64ca55c627d4afcb774fe4555c59cea8dd6905 |
| package/assets/data/charts.csv                                             | data/charts.csv                                             | 23365  | 4115cf1120680f2cedef0676cb648f30c7ef4699e2a947535d4113e71ed3b12a |
| package/assets/data/colors.csv                                             | data/colors.csv                                             | 37940  | 8162429222bce22df62b564085946a30d07cc9722c58d0a3a494bd0d1d00841c |
| package/assets/data/data-provenance.json                                   | data/data-provenance.json                                   | 36686  | e82fb33ed49375a300e93d9c11ccd1c1493c999e84ee7ee295e527634786e2e0 |
| package/assets/data/google-font-licenses.json                              | data/google-font-licenses.json                              | 433127 | 35688523f2955795caa1a47c53b83099e60c1708461476f9cc3a050cf3b0148a |
| package/assets/data/google-fonts.csv                                       | data/google-fonts.csv                                       | 747241 | 1c8c3b2ea1faf6a1012da463756def8b3889db33f2226f0343bb4daa80307d03 |
| package/assets/data/icons.csv                                              | data/icons.csv                                              | 57945  | 50816c6012030178195a16ee481ebf58b47bd985d70e8ec58886cc83f6eddafc |
| package/assets/data/landing.csv                                            | data/landing.csv                                            | 25449  | 9a2edd3bb676c2a58f00ade7a062e285222d4297bfd847c8d5b056f0dbbf52d0 |
| package/assets/data/motion.csv                                             | data/motion.csv                                             | 14679  | 381affe8df8ea1f66fbbda2598827f9f54299107bbe6a1b4e9b68f6b62091ceb |
| package/assets/data/phosphor-icons-upstream.json                           | data/phosphor-icons-upstream.json                           | 823933 | 2399325233b277b5c97a80e6a5e8941154f5d057beee4e7613db87c87d700236 |
| package/assets/data/products.csv                                           | data/products.csv                                           | 75623  | 42473f75e8dde5987bdf89ce55d8c168091b80a356cae691dd60247d80720b70 |
| package/assets/data/react-performance.csv                                  | data/react-performance.csv                                  | 15080  | 3d925802539abac5afeb63ae8aa1960b7229ad271b3a47caed40ab2d97ad0734 |
| package/assets/data/stacks/angular.csv                                     | data/stacks/angular.csv                                     | 19863  | 704be83f2bad30c7e6de01afb113ffa01e0c458762f48b7102f31ba2367b5553 |
| package/assets/data/stacks/astro.csv                                       | data/stacks/astro.csv                                       | 14591  | 2c2f55fadaafc05e04cc321c8194a1a28b656e6757fe2ba316f41b16428299c6 |
| package/assets/data/stacks/avalonia.csv                                    | data/stacks/avalonia.csv                                    | 27327  | 442fca14675a020683473e7e49f08abb27b9df0765c80efe54aef61f1a4ac258 |
| package/assets/data/stacks/flutter.csv                                     | data/stacks/flutter.csv                                     | 14192  | 64dba0ac17349f28bce517a0f5f48c54d9ed2e487ec0c0258303463b382f41a0 |
| package/assets/data/stacks/html-tailwind.csv                               | data/stacks/html-tailwind.csv                               | 16551  | d05a581d20af57b8ca0104a6d31d90a07c437d500662a96c3029fc2f9a4678ee |
| package/assets/data/stacks/javafx.csv                                      | data/stacks/javafx.csv                                      | 33577  | 2e819b8d5abdd23ad4dae0991650fdb57af497aabd68b37463aa9c442944c869 |
| package/assets/data/stacks/jetpack-compose.csv                             | data/stacks/jetpack-compose.csv                             | 12295  | 699de218b286948eaec7d15767b6e1350ee299167e49bf476d82e3ff58724e0a |
| package/assets/data/stacks/laravel.csv                                     | data/stacks/laravel.csv                                     | 20163  | 854ea4daa5fc61292d22235ad33b49ba3fe22423c3de8d3cb03758ffed3b59f9 |
| package/assets/data/stacks/nextjs.csv                                      | data/stacks/nextjs.csv                                      | 18687  | ecd2c27b2ea0127d203ae726060efcdd7335b5e83f96b99e4f3befbbfeebd5a4 |
| package/assets/data/stacks/nuxt-ui.csv                                     | data/stacks/nuxt-ui.csv                                     | 24106  | c36ee8470926b4a0748d241363c71664c9969c2edbc62f7f72de0db73880fac6 |
| package/assets/data/stacks/nuxtjs.csv                                      | data/stacks/nuxtjs.csv                                      | 23014  | 3d9b54ed2d151bd9c86e9e5609b8a6f88a00c4c52fa601a30af96c49b2c4d176 |
| package/assets/data/stacks/react-native.csv                                | data/stacks/react-native.csv                                | 14049  | ba31dd9c0c04da6bc02a74448bf121f9c0728ae5ba3b4d47b487778b0a1135b5 |
| package/assets/data/stacks/react.csv                                       | data/stacks/react.csv                                       | 19036  | 2d2b9c198e875106a30f7ee68341a9ee0033cad60a7e130cf23152783e08aeda |
| package/assets/data/stacks/shadcn.csv                                      | data/stacks/shadcn.csv                                      | 23184  | e56cfde5b74907836ac3582a4779d5b7f3d206a702ab81b8669a1b668c3eeb51 |
| package/assets/data/stacks/svelte.csv                                      | data/stacks/svelte.csv                                      | 15078  | f6e379ba802941ba26b01d4ffbe3cd39120f2587659a1d93851c707f66bc13db |
| package/assets/data/stacks/swiftui.csv                                     | data/stacks/swiftui.csv                                     | 15323  | bdd9231ff3ad658f4e7c063e1eb49df2fd09ac8d90631a86df899b39833b9623 |
| package/assets/data/stacks/threejs.csv                                     | data/stacks/threejs.csv                                     | 46051  | 97542e0ba34915a0ff7578be20e1619495df47c95c8c1c39b83e3785e1de771f |
| package/assets/data/stacks/uno.csv                                         | data/stacks/uno.csv                                         | 30091  | a0474363e4225b5367214d5675fd3e075f137026f9500f0d04357882ef4f6d48 |
| package/assets/data/stacks/uwp.csv                                         | data/stacks/uwp.csv                                         | 24692  | c409f08c1fbba1f1029f1acaa554e7b4471cc85517a5751c9f2e62465badcd5c |
| package/assets/data/stacks/vue.csv                                         | data/stacks/vue.csv                                         | 12813  | b655f1ebb9dff2652d15981f31b1784c8a6d4759efd2815a14f3088257569f95 |
| package/assets/data/stacks/winui.csv                                       | data/stacks/winui.csv                                       | 27890  | e676dc1c13ee6c205c40b0746f1335150a346c7a49a0616d2545bc3d2c930c85 |
| package/assets/data/stacks/wpf.csv                                         | data/stacks/wpf.csv                                         | 24158  | 9781a9950b20333637b30a02e498b7efca21b618a3eeb8665836f3ac6e974da7 |
| package/assets/data/styles.csv                                             | data/styles.csv                                             | 149478 | a93a4d9d7025856575d7b7583bda020be9043013432c5af7c58af9dbdfb206b7 |
| package/assets/data/typography.csv                                         | data/typography.csv                                         | 49997  | 321fc446e89024488ebae96dda93efc4d2307bd8bddb240857ad51364f6782c8 |
| package/assets/data/ui-reasoning.csv                                       | data/ui-reasoning.csv                                       | 77360  | f0774dd741cecdad5eec842034bd6d5e9ea50e9f220a1910069748daa0bb8e9a |
| package/assets/data/ux-guidelines.csv                                      | data/ux-guidelines.csv                                      | 27516  | ff81ec613f70ba9fc3fcce52dbe4ae35d44b2079dbe6dc066d2d6e38c28facd5 |
| package/assets/scripts/core.py                                             | scripts/core.py                                             | 41234  | e544826963efefce3c59b65e18d83d92a5baf571f05458025bf1fa9021eced42 |
| package/assets/scripts/design_system.py                                    | scripts/design_system.py                                    | 70937  | 6a94743c3362c9c7e6d1450b94f4014d9ea752e7b4e151f6f0bdb217e0544bf7 |
| package/assets/scripts/reasoning_contract.py                               | scripts/reasoning_contract.py                               | 5824   | b8bac1af82aa280d3e06f00aabaeac4337e632996b07fed874e2b6ee6e9c5913 |
| package/assets/scripts/search.py                                           | scripts/search.py                                           | 9123   | 8373e2dd2d560d9853ec116140de0e0d5bee45a6abe5e041173c84e1c36a7f87 |
| package/assets/scripts/tests/fixtures/catalogs/google-api.json             | scripts/tests/fixtures/catalogs/google-api.json             | 1079   | 22d8dc81a7d6827b7e8b64b53e7d184210fb9759e8e294e0d5133c81cc460176 |
| package/assets/scripts/tests/fixtures/catalogs/google-catalog.json         | scripts/tests/fixtures/catalogs/google-catalog.json         | 1772   | c608ad5c4084ebc50a4bbbfb69ea2456c01fd5519c457e18410fffd250ae948f |
| package/assets/scripts/tests/fixtures/catalogs/google-existing.csv         | scripts/tests/fixtures/catalogs/google-existing.csv         | 480    | 4e0761b839dc6b2187a370e82eddc0aed8a7ff10c09e28dd814bb3656dac595b |
| package/assets/scripts/tests/fixtures/catalogs/google-metadata.json        | scripts/tests/fixtures/catalogs/google-metadata.json        | 328    | 30bffc29ae348416a2de2f9c6c418e768e4578f136b0f4bac5d2f70124f2e9ba |
| package/assets/scripts/tests/fixtures/catalogs/google-overrides.json       | scripts/tests/fixtures/catalogs/google-overrides.json       | 97     | 6243a48a4619986768c4628e2d0c98ff195beba71ba9be5df8f0c52fc6d90c0b |
| package/assets/scripts/tests/fixtures/catalogs/icons-curated.csv           | scripts/tests/fixtures/catalogs/icons-curated.csv           | 495    | 68362c9a700c13b96f000784a0198c1c7e117a7088a01c85744e44233038fe9d |
| package/assets/scripts/tests/fixtures/catalogs/phosphor-core.json          | scripts/tests/fixtures/catalogs/phosphor-core.json          | 571    | ae4d0bb076240824e1b643c2270d1f8cc0952a69502ec1e622b7dedd85b930bb |
| package/assets/scripts/tests/fixtures/catalogs/phosphor-package.json       | scripts/tests/fixtures/catalogs/phosphor-package.json       | 370    | 500588c757d6de03e3d7e69b27a8b8b1f88ccf6bb0333e4c1e9b0d6a4f112475 |
| package/assets/scripts/tests/fixtures/catalogs/phosphor-react-exports.json | scripts/tests/fixtures/catalogs/phosphor-react-exports.json | 87     | d79f2ee0afdbc2f87776733e145df3538a16a25d7c2fba0056bb48295dad0ded |
| package/assets/scripts/tests/fixtures/catalogs/phosphor-react-package.json | scripts/tests/fixtures/catalogs/phosphor-react-package.json | 81     | 1c57a1d76bcc0cdd3632d4c18b9c0e79576b4591df39831c9607e5d0eb4f2cec |
| package/assets/scripts/tests/fixtures/relevance-baseline.json              | scripts/tests/fixtures/relevance-baseline.json              | 89436  | 38398452985116e74e31bd6bccca0f4decd1bbfe4eebc1ac99f7a1836baaf77f |
| package/assets/scripts/tests/fixtures/relevance-cases.json                 | scripts/tests/fixtures/relevance-cases.json                 | 36734  | e77d36eebbf6ddc2860946a02cdb659351da6c09f2688f1ed30939a418099646 |
| package/assets/scripts/tests/fixtures/relevance-thresholds.json            | scripts/tests/fixtures/relevance-thresholds.json            | 5079   | 9d738e11c6b82fecc8d0946e7b38515518ded5ed3294a7eb19a021c4edb5b57d |
| package/assets/scripts/tests/test_catalog_refresh.py                       | scripts/tests/test_catalog_refresh.py                       | 19466  | 3e2ca5d12702318f641ae62d0c14f22a3bcc84d84e79b863c0e947d475604adb |
| package/assets/scripts/tests/test_core_data_quality.py                     | scripts/tests/test_core_data_quality.py                     | 8954   | 3ffc6b4905c9ea26d7ac4527ab154d153584231aee71b2ae4bd017977fa09cc5 |
| package/assets/scripts/tests/test_core.py                                  | scripts/tests/test_core.py                                  | 16680  | 3527fe2f4b852f69f07c17ddc0d615d9a6e025c924e45a33985579a94a8d2118 |
| package/assets/scripts/tests/test_data_contracts.py                        | scripts/tests/test_data_contracts.py                        | 19513  | 0360d6e10080c0bca214f2b0bbad582ba50702a542ce21013351aca54938df3a |
| package/assets/scripts/tests/test_design_system_mode.py                    | scripts/tests/test_design_system_mode.py                    | 7690   | 517ba1ba6195c94811126d1162139c51aff77fc68c3e320c7bb6c1e89e76bc9b |
| package/assets/scripts/tests/test_native_desktop_stack_freshness.py        | scripts/tests/test_native_desktop_stack_freshness.py        | 8170   | 904f90bc6d364763673fa6067d98a4227d535760fa8b6d26abe22208176997ca |
| package/assets/scripts/tests/test_relevance_evaluator.py                   | scripts/tests/test_relevance_evaluator.py                   | 8430   | 2fe56a4d6fe5fff15ff592274b0eeaba925146cefea6c0fa29d8f1b77c9aca1f |
| package/assets/scripts/tests/test_style_taxonomy.py                        | scripts/tests/test_style_taxonomy.py                        | 7425   | cd14d0092e8a454d213aa104b53e4e70ba698491fa00fde9fdec5ca8a3d70011 |
| package/assets/scripts/tests/test_text_layout_resilience.py                | scripts/tests/test_text_layout_resilience.py                | 5874   | b51d32ee8a15505b87cb81957fb2d1b385e041e8beb4463c311d236bfd29ebd4 |
| package/assets/scripts/tests/test_web_stack_freshness.py                   | scripts/tests/test_web_stack_freshness.py                   | 7699   | becc5fa40e7516613d4e9930f226aa483e3796090c17cb16542c93d1927e680d |
| package/assets/scripts/validate_data.py                                    | scripts/validate_data.py                                    | 52064  | 718ad4cbb227436015c9c2bc80fc583d6ed738b01c1a940ef85e350780d99f58 |

Excluded groups (all have no destination):

| Group                   | Count |
| ----------------------- | ----- |
| sibling assets          | 104   |
| CLI dist                | 1     |
| templates               | 22    |
| package metadata/README | 2     |
| TOTAL                   | 129   |

Excluded entry identity manifest (path, byte length, SHA-256) is reproduced
below for complete 196-entry auditability; entries are never extracted/placed.
This is metadata evidence, not vendored payload.

| Excluded archive path                                                      | Bytes  | SHA-256                                                          |
| -------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| package/assets/skills/design-system/scripts/embed-tokens.cjs               | 2558   | 23a9ce214e3c0d2fb4c5442b3bf1222c66721f7988a181ab29dcb549a5e5f511 |
| package/assets/skills/brand/scripts/extract-colors.cjs                     | 9328   | 36d21f3905e5762cfc8054b3f3b7276f6bc656884fe57c6bfa539526044778ed |
| package/assets/skills/design-system/scripts/generate-tokens.cjs            | 4968   | aac8a0f4ec4dccf0d371f9ee5a9111e44977bb0cad7e40a3754aba5571aa1231 |
| package/assets/skills/brand/scripts/inject-brand-context.cjs               | 9677   | 5b98abdeb5c636f247102cd235f1d3421db7a4de53fd853360feaa0c471b5c96 |
| package/assets/skills/brand/scripts/sync-brand-to-tokens.cjs               | 9545   | 390a760570fdba6d6ecfdfd8907fc802b64659b6178f8920349b0c6a2c822106 |
| package/assets/skills/brand/scripts/validate-asset.cjs                     | 10173  | 4546c9109fb0f4f767426508cb29e60d02b301f8897cf16d8e378b7ce9d997fc |
| package/assets/skills/design-system/scripts/validate-tokens.cjs            | 5942   | 65f03a29290b9029d8cc27537701f226de7bcffc303b3bc361648fadfa09b77d |
| package/assets/skills/design/data/logo/colors.csv                          | 10674  | d60218f0705bb0f0b892a10468a5c8d9a44eef3d0262ef8df8970ba3fbab567a |
| package/assets/skills/design/data/cip/deliverables.csv                     | 13385  | 229912f35c2f5a790508ddd62270cc7a92a84694027025ea5a30f1fb5ba84b70 |
| package/assets/skills/design/data/cip/industries.csv                       | 4935   | 729b1dea6d6f39b0bc22a1e659584e7ca5cead75841146d599c9f8dc00d4da46 |
| package/assets/skills/design/data/logo/industries.csv                      | 13274  | e58dda4b9d28851f70914f82c1d2a2cff626a991ca41076f64122f33cc8a6525 |
| package/assets/skills/design/data/cip/mockup-contexts.csv                  | 5205   | 15d61cef16e6746d5aa665976f4de8074fedb64bfc5c7313a40eec1112a1d499 |
| package/assets/skills/design-system/data/slide-backgrounds.csv             | 1038   | d1bb701b87bef493d72974d6fac1087c8ba4e2df14185fe3e0c36a13fe35f3d1 |
| package/assets/skills/design-system/data/slide-charts.csv                  | 8631   | 12ef876cd76e67a6553444bfa2ebf1d5d4d6216289d34db052a6e87421135033 |
| package/assets/skills/design-system/data/slide-color-logic.csv             | 877    | ea68c737075f1615b2a7e461e2878c06bfe8f803dcabfbcc2977ffe5f9ec9ded |
| package/assets/skills/design-system/data/slide-copy.csv                    | 6427   | 43152937a0e598b3fbfdd418684311c105d44e3c5b333703ddb0b8cb28e40658 |
| package/assets/skills/design-system/data/slide-layout-logic.csv            | 981    | 26b5b75782d5aba89836c0479acd3111cc69b67853db9c2259b30ac1e966bc62 |
| package/assets/skills/design-system/data/slide-layouts.csv                 | 8760   | 95d558c1b7d2552d7a75402dc68facbd16125e574985851db5729d1145e14896 |
| package/assets/skills/design-system/data/slide-strategies.csv              | 8232   | f656be0ab0b3a85fa7fc74202e9701a7236220412d67d5f63eb6dbb100bb2639 |
| package/assets/skills/design-system/data/slide-typography.csv              | 735    | b96cd11dd4ff1dea8a9454b0b9e898e7f82f9243182f8f237af1f2c9b8824ce5 |
| package/assets/skills/design/data/cip/styles.csv                           | 5967   | 4e7f9e209bc90b60df62fd9843a1a73b365e54161dbd820b82817a8e512af4c4 |
| package/assets/skills/design/data/icon/styles.csv                          | 2250   | a4aa7d326ffe1e50961eb70e25a6351f45c0247cd245461fa1a27cdc72f903b4 |
| package/assets/skills/design/data/logo/styles.csv                          | 13678  | ea08bdfb7aa557f08d1b6299222423f948700f8e4029321acb58c8f83197bdf2 |
| package/dist/index.js                                                      | 344257 | 9519bdaaa9c8fdaef4aa6759d0a76e856d55e3ae550a21bc9133738b89b99d94 |
| package/assets/templates/platforms/agent.json                              | 1475   | d71d8ae39564e822d81c33ef33f1d34159e34761dd8a6e91648aef38397b7c7d |
| package/assets/templates/platforms/augment.json                            | 905    | 77c7f25eba8494ebf6fc82dfa31cdd467b0b0434ae18e27f56c2b4fa67bc4351 |
| package/assets/templates/platforms/claude.json                             | 1475   | c110561938c664aa6fa2c6fbaf741e672979e1a5e763992ad23cc9505a4d56f9 |
| package/assets/templates/platforms/codebuddy.json                          | 1458   | 937001e2bb35744553c9880fd9d551ce451facfdc2bcc1df2a7ee637b4d79a2c |
| package/assets/templates/platforms/codewhale.json                          | 1458   | 24f6777a8e3e0ec71c90ed7743e91ad0192e9100a99d8eb63c830196f236af39 |
| package/assets/templates/platforms/codex.json                              | 1446   | 97ca4be26361548521c2ce4f72a7daea335903b7ccb4e64240e9d18b18e9751c |
| package/assets/templates/platforms/continue.json                           | 1455   | 0fcedd157f854b6d1f5642f38c0b6bd702769edd30d59f2b5340de8b23945629 |
| package/assets/templates/platforms/copilot.json                            | 1497   | aa71708a896fc6e362897a9d64fda930b9740193199b15d7139d19dba653f1f8 |
| package/assets/skills/ui-styling/scripts/tests/coverage-ui.json            | 35121  | 33bdc1f5998db9a38cac8e6128a82711f8f8b65fbb3dcb0c1680ae260441cbce |
| package/assets/templates/platforms/cursor.json                             | 1449   | 8f783ad4354f0ca1ce4056427bcb15e7562e16e636d5718c04d2da2e113268f4 |
| package/assets/skills/design-system/templates/design-tokens-starter.json   | 7184   | 5444f477b06bab9c72e2cc289d4a9104efef653391c9639972bcb712d5f2d81e |
| package/assets/templates/platforms/droid.json                              | 1480   | 58d1486592188359d9adcac2efbb7f35efe28ffc1e9081272e76a1b8b5958758 |
| package/assets/templates/platforms/gemini.json                             | 1453   | b41c822671d2125c7e88348cac41ecafa1feb974234c1cf2175d433728836ddd |
| package/assets/templates/platforms/kilocode.json                           | 1455   | aabae12888c874c81ce0b6c360df0d4bcf8e22f059fbac22a59a6767efdafbb0 |
| package/assets/templates/platforms/kiro.json                               | 1450   | cc358cadf0da87e0b476ef376cec404e6e7634bd4af77d651c06eaac5a2e2115 |
| package/assets/templates/platforms/opencode.json                           | 1455   | 21bdfb4ad8a4d6463bec360a875daf9b02cfb58054fdd2e1dbe240c408495e47 |
| package/package.json                                                       | 2242   | 4d4c12409f4cfb3a782cc70cf96ff1563afbc3b873a95a461c2b89488e487321 |
| package/assets/templates/platforms/qoder.json                              | 1446   | a1e179f95ba9693488cfd76ae8dfdcf380f85b6257859204c527fd1aabab995d |
| package/assets/templates/platforms/roocode.json                            | 1452   | 715c6cc4c7b761676be2d21744887ff19020ae5fde85eff0ca31250e319ad937 |
| package/assets/templates/platforms/trae.json                               | 1443   | 430643d17c82f6e3f39da7276df8f0493756b32c65c9e5ad2dfd7ce8a20a9ba9 |
| package/assets/templates/platforms/universal.json                          | 1472   | 2436c0b1191fa1a9a25f1f5c052d84f8102459634aa9a29da51a55890616d64f |
| package/assets/templates/platforms/warp.json                               | 896    | ee6e2f0d4707875519b5b11178a79761f52e47817c288d7a0130a473e1d1794e |
| package/assets/templates/platforms/windsurf.json                           | 1455   | 73d8f6efc134653793fcf051230befb51a215090be017856e6b4f8aecb1bf8fd |
| package/assets/skills/brand/references/approval-checklist.md               | 4245   | 4bf8549687f53a7b9684005b4b87de93c26f018e00609b4c506a5812abd13d20 |
| package/assets/skills/brand/references/asset-organization.md               | 5110   | de98123417e9c5a1cc71a78131bba979c4c8ed2e5289e6c7a7f166576e488101 |
| package/assets/skills/banner-design/references/banner-sizes-and-styles.md  | 4993   | c8906fb1073a576ee8c680d9bc8586249cbc4ed36690da960d65a1c9c37143b7 |
| package/assets/skills/design/references/banner-sizes-and-styles.md         | 4993   | c8906fb1073a576ee8c680d9bc8586249cbc4ed36690da960d65a1c9c37143b7 |
| package/assets/skills/brand/references/brand-guideline-template.md         | 3572   | 392db8cf10fef492221c15a86e68590074bf5716de1f2982f41c01fbe30567cc |
| package/assets/skills/brand/templates/brand-guidelines-starter.md          | 6638   | d157a57b15f0b458c79636d11de42f3c89f03d8c0bbea1bdd3cf1c3542b2140d |
| package/assets/skills/ui-styling/references/canvas-design-system.md        | 7888   | f5de85ff39d9f3a8275c4164b921ba72d5e1d34b8d7a9243d9ee34b3870a4f5f |
| package/assets/skills/design/references/cip-deliverable-guide.md           | 1735   | 1424e120b967288e2334f24fcfa5cdc7f238420326a7444f4c5597efecfabc41 |
| package/assets/skills/design/references/cip-design.md                      | 4589   | 47a3b2e445bc07185edd0cd24ba8a417229baf86717dcdff7c4e403adbceb3f1 |
| package/assets/skills/design/references/cip-prompt-engineering.md          | 2493   | 4bf3a0c858f38c230e43e872857b72d9eb692e066e8de5920da75aac733e753c |
| package/assets/skills/design/references/cip-style-guide.md                 | 2357   | f3e15408cd981e93804440c1159c12e02d001bc37a3945f455b3fc13729ed4e1 |
| package/assets/skills/brand/references/color-palette-management.md         | 4254   | c429298ffe3955edb8b22c9f51426fef75e83d02848cd4300e89c0d3fc34b44a |
| package/assets/skills/design-system/references/component-specs.md          | 6914   | b265d979a741dd748d4e595e6898ae430faeef4f6d13d7a634fa6241b91d2da4 |
| package/assets/skills/design-system/references/component-tokens.md         | 4986   | e27f8f5999badee425c98235eabbd2cb3ebe2a1a364766d5c7a6b3134ceaaec8 |
| package/assets/skills/brand/references/consistency-checklist.md            | 1926   | 56d8b2d4852cda11e600adec4b9dd68fc89a1b8265382359953bec5c5e5e2c36 |
| package/assets/skills/slides/references/copywriting-formulas.md            | 2604   | 03733d5916ab771834745550045b736deeb94a08226f2b200f7953009c35b219 |
| package/assets/skills/slides/references/create.md                          | 153    | 792d647a5d4f87d765cf417f7ac54dd0b2fc4d229cc23ea9df56282d4c1ee086 |
| package/assets/skills/design/references/design-routing.md                  | 5826   | 32914a913f4f20d4cb1e497e5a87cfc04b71af4e6d75db72ecf50e4f060201c8 |
| package/assets/skills/slides/references/html-template.md                   | 9004   | fd5b051a37365fc6059c75bb388ec6f64daf1bd9ae938b287b6d762dc83c0c35 |
| package/assets/skills/design/references/icon-design.md                     | 4343   | 39281931d070918b4e51ecd71054da99493cabe06a07dfa8f1f682e48637c83f |
| package/assets/skills/slides/references/layout-patterns.md                 | 3691   | 0a967ca3bd829d3234e6f1802bade6c76447fabbaddbc8117c41adbae7dfb6df |
| package/assets/skills/design/references/logo-color-psychology.md           | 3341   | 3fd0e93e24c3b2ea7f3be778e8f2d03b1c62c7c6eab3ade478c8fca332bff287 |
| package/assets/skills/design/references/logo-design.md                     | 3163   | 2e845fe165c845fd9582c1d74204fa31de607380982a6ea0b5f8db4e293afa3a |
| package/assets/skills/design/references/logo-prompt-engineering.md         | 4314   | e50f55bf323263eb27b4cd4c5172383a787fb894581d5d2befb3f6e0180b253e |
| package/assets/skills/design/references/logo-style-guide.md                | 3435   | 611baa841eedab101f45c113c6bfbd4d7e16e859c9d6ebd2cf941827a6e8dd15 |
| package/assets/skills/brand/references/logo-usage-rules.md                 | 5464   | 044c5ddf30cfe0eea047451cfce6ea654939198ffdd8968a19161c97066a5a26 |
| package/assets/skills/brand/references/messaging-framework.md              | 1763   | 24b2500a72867b55dd10f4bf359178b0eb347fddd852659ce47b69d9f597d4e6 |
| package/assets/skills/design-system/references/primitive-tokens.md         | 4562   | 91e6caa12646c08c8aadf8e09399aed65760a25c8d80595936d81a9131118fc3 |
| package/assets/templates/base/quick-reference.md                           | 27418  | 0a6da6ef08190792fa2d55eaa44ddaac0c071ff2cf9a087d372924c2a99e942f |
| package/README.md                                                          | 3380   | d6dc217b6145033c398617a3f181d82ce83b06360d9767590a1113a21344ba4a |
| package/assets/skills/design-system/references/semantic-tokens.md          | 4245   | 97e16d8061bbc22e82b51966a7015e3fc990932902e4647843506669a1cdebcc |
| package/assets/skills/ui-styling/references/shadcn-accessibility.md        | 9976   | a22cd4ccf82b635b2b2c4f12416a0c4f7edcd825d219d6089450fa797a0d9511 |
| package/assets/skills/ui-styling/references/shadcn-components.md           | 11155  | 79c4f91cbf68993a43fa3a95889c35db73de45bdd3dfd83a6830863c01aa598a |
| package/assets/skills/ui-styling/references/shadcn-theming.md              | 8672   | d17d641474221123ff0e0288043ca2f2dab3ac96908a19eed28d82f9e58865ed |
| package/assets/templates/base/skill-content.md                             | 26501  | f4a6ccac8552024baa7543420ba96f0587e7234f52a3c2216a576a9f1bf944e4 |
| package/assets/skills/banner-design/SKILL.md                               | 8326   | 913d9c4b2a3b405d638d50131e0dd3fe2787c839423d79287b7858ac29255acc |
| package/assets/skills/brand/SKILL.md                                       | 2939   | 6a450ee1a83a403d47cec2ede9030feb60a67a81fc425d2406e975339313bd44 |
| package/assets/skills/design-system/SKILL.md                               | 6875   | 655468bb723a6bc9d17fcb09a6a005e10e313d63b879f4d74fb2abdc3041ae3f |
| package/assets/skills/design/SKILL.md                                      | 12322  | 413f4ab913d07f7fd92acbadc25d71aad63443be0c40d11234944aea688603b6 |
| package/assets/skills/slides/SKILL.md                                      | 1137   | 2b90bdaf63f231919a01f4962f374ecd84af101a7e7545f8d9c68e049025accb |
| package/assets/skills/ui-styling/SKILL.md                                  | 10045  | f8b6c3832d2af51f67b3932e3c4a79bcd8a8596cc61ce1547a686fc951e5c62d |
| package/assets/skills/slides/references/slide-strategies.md                | 2715   | 27ee3e53ffa0ea679ec83ebeacb0bcfbce498df57277e99f574b9c139dc44286 |
| package/assets/skills/design/references/slides-copywriting-formulas.md     | 2604   | 03733d5916ab771834745550045b736deeb94a08226f2b200f7953009c35b219 |
| package/assets/skills/design/references/slides-create.md                   | 153    | 792d647a5d4f87d765cf417f7ac54dd0b2fc4d229cc23ea9df56282d4c1ee086 |
| package/assets/skills/design/references/slides-html-template.md            | 9004   | fd5b051a37365fc6059c75bb388ec6f64daf1bd9ae938b287b6d762dc83c0c35 |
| package/assets/skills/design/references/slides-layout-patterns.md          | 3691   | 0a967ca3bd829d3234e6f1802bade6c76447fabbaddbc8117c41adbae7dfb6df |
| package/assets/skills/design/references/slides-strategies.md               | 2715   | 27ee3e53ffa0ea679ec83ebeacb0bcfbce498df57277e99f574b9c139dc44286 |
| package/assets/skills/design/references/slides.md                          | 1742   | 5630d5daec947ff58ab1ac97c7a1ee77a21cf6f5dce5155535b65d291691979f |
| package/assets/skills/design/references/social-photos-design.md            | 11251  | 2544c143ff3a4471a775e2271797a3871480f94de91b267178da92e8952192a0 |
| package/assets/skills/design-system/references/states-and-variants.md      | 4771   | 8dacb95d57d4bb37d8a99cc55515ff26da272056f837d29abc74aedcaa3ba104 |
| package/assets/skills/ui-styling/references/tailwind-customization.md      | 10171  | 4c5adeed6263a274f74f6eb2c816ca420fd6ef4f35683582988bacd404799afe |
| package/assets/skills/design-system/references/tailwind-integration.md     | 5633   | 6d01092db1479dbd2060567b4232bb2b4bc16e89730ab07e1f87a3e7f5c406b9 |
| package/assets/skills/ui-styling/references/tailwind-responsive.md         | 8270   | 8d00ae620df26daea4623c7bf996d6e612e09d359305fcfa2b40cab757ed840c |
| package/assets/skills/ui-styling/references/tailwind-utilities.md          | 9980   | aba1c40ef84f43beea142ae310371e332541f39d973df90a71f1854823effda1 |
| package/assets/skills/design-system/references/token-architecture.md       | 5365   | 925f4049c4c4313d9fd5df98cdfd52004112aca49fba1664ad85e76bc9dce4d3 |
| package/assets/skills/brand/references/typography-specifications.md        | 5042   | 921c3d9e6ddfde2677b9a3e32eee94c7922f54f22c1f380c5ed2eb25a7d5bfa9 |
| package/assets/skills/brand/references/update.md                           | 3365   | 537cb55ebe260e1de127bd6288b19d8d7b15b6c893545442a58b739cbd342b37 |
| package/assets/skills/brand/references/visual-identity.md                  | 1884   | 63f0cfc5d95403d8e12aca4d839cc28471515574d9a431334bfbb96c15407c31 |
| package/assets/skills/brand/references/voice-framework.md                  | 1997   | 08c15ac79f81cd964c5efbe593131b61a093c7e1b060d5dd28b17f3cc5b331fb |
| package/assets/skills/design/scripts/cip/core.py                           | 8062   | 78a78a51f12d2382b2854414df395dc62b68532626ef724ddd5de713507911e4 |
| package/assets/skills/design/scripts/logo/core.py                          | 6023   | 4f8b36ffe538e5995d0e0b740053a0899a1adf445ffdf484bd47f94e71ade8d0 |
| package/assets/skills/design-system/scripts/fetch-background.py            | 12287  | cecedad0a9054e6e65f31ab7ba7d07eb6af2179e237c5632bc962dad69fd6d66 |
| package/assets/skills/design-system/scripts/generate-slide.py              | 28595  | 0463c98efea54870816925015fe5819e42a29aaba57408c2c38bacb33e2605b9 |
| package/assets/skills/design/scripts/cip/generate.py                       | 19430  | 2745040c9b534cf4113d2f7f4d7a52bc96a9fbfa12204c4f8460be4e15449069 |
| package/assets/skills/design/scripts/icon/generate.py                      | 17151  | 1a6be99dc233f6d9f8b558c26148203418be5b47c677cd83e48e41e78e38780c |
| package/assets/skills/design/scripts/logo/generate.py                      | 14630  | 6e4358f21cd85fec51c8d01b03e3696d6db180815309d7e10a19c623d4d4462c |
| package/assets/skills/design-system/scripts/html-token-validator.py        | 11894  | 9556a65e7aacda23388478294ee9a5cb84b315d964fbbf754aa0dcdbcfee58e6 |
| package/assets/skills/design/scripts/cip/render-html.py                    | 13941  | a49a89a017ea4a2c492438055f05dfba3dfb4f91563f5f913359939beeaeccab |
| package/assets/skills/design-system/scripts/search-slides.py               | 9210   | fded9548bc1bbe1303da67fabe34006c6a7c57934c9d171ea3dc3eb5f6eee010 |
| package/assets/skills/design/scripts/cip/search.py                         | 4524   | 6619fbbe71983003a858c5eb79bc59c607b342610a1178b6976c687c2932161b |
| package/assets/skills/design/scripts/logo/search.py                        | 4745   | 693b3a1824831f120d4c60ed72477847604da1f6b654343381f8e9d3800a28f2 |
| package/assets/skills/ui-styling/scripts/shadcn_add.py                     | 8799   | 0c11d28ce9f12217df2c3306f24ae1f73527d5116db63707ab55cbe1a8bcf28c |
| package/assets/skills/design-system/scripts/slide_search_core.py           | 14756  | 2464050ae338eb50728086046b644845fa7ae943f32efead3908fdbe1473edbe |
| package/assets/skills/design-system/scripts/slide-token-validator.py       | 973    | 66da5da5e8e659d405a89b342e13dd1e469e79726c46002d9d2368c3c7aaf945 |
| package/assets/skills/ui-styling/scripts/tailwind_config_gen.py            | 14418  | 2e264ec871499681aecd6111f60743fba31b5ceb7e9ccb2b71b7346039285f89 |
| package/assets/skills/ui-styling/scripts/tests/test_shadcn_add.py          | 9919   | 35f60ac5d74c4a7f950854a0337883c3e8dd812c58fcf6c5153876e43a6effa2 |
| package/assets/skills/brand/scripts/tests/test_sync_brand_to_tokens.py     | 1970   | 0ace0cf7c6a8c12c0b9154f317e847b1084eb00b065b6f22431e37b7c7e948d6 |
| package/assets/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py | 14658  | 4efa59fdbe318d55e6a452d85401db5d1aa4504f93739878bb40d8bb504af585 |
| package/assets/skills/design-system/scripts/tests/test_validate_tokens.py  | 1619   | a32f34a9e89542a341b6ff3ee4392494b48dea622b22b99652d3cf0c1a1ee966 |
| package/assets/skills/ui-styling/LICENSE.txt                               | 11357  | 58d1e17ffe5109a7ae296caafcadfdbe6a7d176f0bc4ab01e12a689b0499d8bd |
| package/assets/skills/ui-styling/scripts/requirements.txt                  | 444    | 09402d2d274248e18bb5fd0a0267fd7cbf99b7a2440e73e87f054aa8f259f9da |
| package/assets/skills/ui-styling/scripts/tests/requirements.txt            | 52     | 80846c98ee02a7e9651ec4eee6709f840b785646b469aad5284ab7ab9b344f17 |

## 9. Revised exact NOTICE.md candidate — review only

No actual NOTICE.md or template file is generated. Hash the exact UTF-8 bytes
inside the following text fence, excluding fence/marker lines and including
one terminal LF. Candidate bytes=28547;
SHA-256 `1c0d756bc8feeb1d6dd3dfffe9644f8f812581ae6cb53d6f06c50284bbb0451c`.
Fetched source hashes bind original bytes; ABeeZee CRLF is explicitly represented
as LF in this assembled candidate, without changing wording. Scoped formatting
removed one trailing space after "bundled, embedded," in the OFL preamble;
the candidate hash above binds that reviewed representation, not upstream bytes.

<!-- NOTICE_CANDIDATE_BEGIN -->

```text
# UI/UX Pro Max — YUTA local adaptation notice

REVIEW CANDIDATE ONLY. No license acceptance, installation permission,
legal certification or production authorization is recorded by this notice.

## Candidate identity and adaptation

Upstream package: ui-ux-pro-max-cli 2.15.0
Repository: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
Package gitHead: a38d04c3d5c298c851dbe5e6ee1965ee3de42cb5
Tarball SHA-256: 50966c6c1cf99db6c9706222df6a3094e8043413e8b94a477ff8339ebc3fef52
Tarball integrity: sha512-D0J/C40xrzzi5si6ZLtRGbEE5v3QjL7d4wJNnasmP3yfDSrGiuqVCdwQiqCNnIkbqOuVoA/uonR2o1WKXh3urw==

The proposed projection keeps exactly 67 upstream core data/script files
unchanged. SKILL.md is a YUTA-owned local adaptation, yuta-adapter-1, not an
upstream skill version or a byte-identical upstream instruction entrypoint.
NOTICE.md and installation.json are the other two YUTA-owned generated files.
No sibling skill or upstream CLI installer is part of the supported output.
External recommendations remain DESIGN_REFERENCE; YUTA authority controls.

## Published license discrepancy

The exact published package manifest declares MIT. Its README still states
CC-BY-NC-4.0. PR 486 changed cli/README.md to MIT at upstream commit
b2ac9b2aa1c3bd6bb748b4b0f79c90319d50e0da on 2026-09-06.
The selected published tarball has not acquired that correction.
The repository license text below was independently verified at both the
package gitHead and the correction commit. Including it does not decide
which terms govern every bundled third-party item or resolve the discrepancy.

## Next Level Builder — observed repository license

MIT License

Copyright (c) 2024 Next Level Builder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Retained provenance records — preserve unchanged

data/data-provenance.json
SHA-256: e82fb33ed49375a300e93d9c11ccd1c1493c999e84ee7ee295e527634786e2e0
Preserve all 51 records, source references, scope/boundary fields, dates,
statuses, confidence values and freshness-policy data.
Official-source links and internal derived references are provenance,
not independent license grants or YUTA correctness approval.

data/google-font-licenses.json
SHA-256: 35688523f2955795caa1a47c53b83099e60c1708461476f9cc3a050cf3b0148a
Source: https://github.com/google/fonts
Revision: 038b637da7b3fd956a4ed93ffc607c3d5e4ce172
Metadata source: METADATA.pb
Preserve all 1,934 family records and their designer/name/license/date/status/
verifiedAt fields, plus all eight excluded-family names, reasons and sources.
Observed family labels: OFL 1,894; APACHE2 35; UFL 5.
These labels are not complete copyright notices or license texts.
Designer names are not automatically copyright-holder declarations.
No font binary is included in this projection. The upstream README states
that top-level directory licences govern all files in those directories;
absence of font binaries alone does not settle derived metadata obligations.
Family-specific copyright/reserved-name requirements and the applicability of
those terms to this metadata projection remain for explicit human review.
Do not promote excluded families or install/use recommended fonts by this notice.

data/phosphor-icons-upstream.json
SHA-256: 2399325233b277b5c97a80e6a5e8941154f5d057beee4e7613db87c87d700236
Declared sources: @phosphor-icons/core 2.1.1 and @phosphor-icons/react 2.1.10
Repositories: https://github.com/phosphor-icons/core
and https://github.com/phosphor-icons/react
Preserve the complete 1,512-icon metadata catalog, aliases, tags, categories,
codepoints, version markers, imports, weights, counts and source identifiers.
This JSON contains no license grant or copyright notice; icon names such as
Copyright and licence-related tags are catalog data, not legal notices.
The two npm versions declare MIT. The following text was independently read
from the React v2.1.10 commit 57424d5f99b793b585f5c6f5cab76f79772510e5.
It is not proof that the Core 2.1.1 catalog is byte-derived from that commit.

## Phosphor Icons — observed React repository license

MIT License

Copyright (c) 2020 Phosphor Icons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Other retained references

Retain catalog-summary.json hashes and exclusion/promotion-policy data.
Retain every source URL and embedded attribution in all selected CSV/JSON/
Python files. Test fixture license fields are fixture data, not licensing
authority for the actual catalogs. No upstream tests or refresh scripts are
authorized to execute. Recommendations about GSAP or other third-party
software do not authorize installation or use of that software.
The excluded ui-styling/LICENSE.txt is not used as the core license.

## Google Fonts — observed license texts for review

The texts below were read at the pinned Google Fonts revision above:
ofl/abeezee/OFL.txt; apache/aclonica/LICENSE.txt; ufl/ubuntu/UFL.txt.
They show the three observed license families and notice conditions.
The ABeeZee notice is specific to ABeeZee, not all 1,894 OFL families.
This is not a claim that these three files contain every family-specific
copyright or reserved-name notice, or that a license label alone licenses
the derived metadata. Those questions remain for human acceptance.

### ABeeZee — exact text with CRLF represented as LF in this candidate

Copyright 2011 The ABeeZee Project Authors (https://github.com/googlefonts/abeezee), with Reserved Font Name 'ABeeZee'

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
https://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.

### Apache License 2.0 — text from the pinned Aclonica license file


                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

### Ubuntu Font Licence 1.0 — text from the pinned Ubuntu license file

-------------------------------
UBUNTU FONT LICENCE Version 1.0
-------------------------------

PREAMBLE
This licence allows the licensed fonts to be used, studied, modified and
redistributed freely. The fonts, including any derivative works, can be
bundled, embedded, and redistributed provided the terms of this licence
are met. The fonts and derivatives, however, cannot be released under
any other licence. The requirement for fonts to remain under this
licence does not require any document created using the fonts or their
derivatives to be published under this licence, as long as the primary
purpose of the document is not to be a vehicle for the distribution of
the fonts.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this licence and clearly marked as such. This may
include source files, build scripts and documentation.

"Original Version" refers to the collection of Font Software components
as received under this licence.

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to
a new environment.

"Copyright Holder(s)" refers to all individuals and companies who have a
copyright ownership of the Font Software.

"Substantially Changed" refers to Modified Versions which can be easily
identified as dissimilar to the Font Software by users of the Font
Software comparing the Original Version with the Modified Version.

To "Propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy. Propagation includes copying,
distribution (with or without modification and with or without charging
a redistribution fee), making available to the public, and in some
countries other activities as well.

PERMISSION & CONDITIONS
This licence does not grant any rights under trademark law and all such
rights are reserved.

Permission is hereby granted, free of charge, to any person obtaining a
copy of the Font Software, to propagate the Font Software, subject to
the below conditions:

1) Each copy of the Font Software must contain the above copyright
notice and this licence. These can be included either as stand-alone
text files, human-readable headers or in the appropriate machine-
readable metadata fields within text or binary files as long as those
fields can be easily viewed by the user.

2) The font name complies with the following:
(a) The Original Version must retain its name, unmodified.
(b) Modified Versions which are Substantially Changed must be renamed to
avoid use of the name of the Original Version or similar names entirely.
(c) Modified Versions which are not Substantially Changed must be
renamed to both (i) retain the name of the Original Version and (ii) add
additional naming elements to distinguish the Modified Version from the
Original Version. The name of such Modified Versions must be the name of
the Original Version, with "derivative X" where X represents the name of
the new work, appended to that name.

3) The name(s) of the Copyright Holder(s) and any contributor to the
Font Software shall not be used to promote, endorse or advertise any
Modified Version, except (i) as required by this licence, (ii) to
acknowledge the contribution(s) of the Copyright Holder(s) or (iii) with
their explicit written permission.

4) The Font Software, modified or unmodified, in part or in whole, must
be distributed entirely under this licence, and must not be distributed
under any other licence. The requirement for fonts to remain under this
licence does not affect any document created using the Font Software,
except any version of the Font Software extracted from a document
created using the Font Software may only be distributed under this
licence.

TERMINATION
This licence becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF
COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER
DEALINGS IN THE FONT SOFTWARE.

## Bounded-use and review status

All retained upstream files and their embedded records remain unchanged.
This notice records observed sources and proposed preservation, not a blanket
MIT relicensing of datasets, a legal opinion, or a guarantee of completeness
for later font/icon distribution. No product/runtime/font installation,
generation or production capability is granted.

No independently required extra output filename has been established by this
review. If human review requires additional terms, attribution or separate
files, revise and review this notice and, if output count changes, return to
Design before installation. Do not silently broaden the fixed 70-file output.
```

<!-- NOTICE_CANDIDATE_END -->

## 10. UNRESOLVED_LICENSE_QUESTION — human decisions still required

- Published MIT/CC-BY-NC discrepancy: whether exact bounded use is acceptable
  in light of independently verified later correction, not automatic relicensing.
- Scope of original metadata/derived data rights, including Google source
  README's all-files statement, family-specific copyright/RFN notices absent
  from retained JSON, and whether proposed preservation is sufficient.
- Phosphor Core2.1.1 immutable source relationship not established; React's
  verified LICENSE and npm MIT labels are separate evidence, not interchangeable.
- Official-source URLs/derived recommendations in 51 provenance records are
  not proof of rights in all source documentation/excerpts.
- Local copying/adaptation/use and any later redistribution: human must approve
  bounded scope; no installer/pinning exception to licensing obligations.
- Exact NOTICE candidate is proposed, not a claim of universal/commercial legal
  clearance. Additional legal terms or files may require reviewed revision.

These questions do not erase collected facts. LICENSE_REVIEW_INPUT_COMPLETE
means ready for human **evidence review**, not ACCEPTED or Apply-ready.
No license acceptance recorded. No new system/runtime/Product authority.

## 11. Current repository integrity and validation

Before first write, all user-bound hashes matched, including packet preimage
b269828be08b71eafd9b262c38158900085e00a01c666fb810f3eb7c132ea8e5.
Planning approval is recorded only here because the user's only allowed write
is this packet; Tasks bytes/status text remain historical and unchanged.

| Protected artifact / block   | SHA-256                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| Proposal                     | 04454de85462b9f571b18022f250a9fdb996b43636eb22a3a7710897b2ba5d45 |
| Analysis                     | 88198e944804810a145e463513127e498a9e7dfccb19ef0656dcea019bb235d7 |
| Specs                        | 568d37a253878fee2a9f853b027a21f95f708af77c8df496ae99fa67f38b2646 |
| Design                       | 77fcbdc9938f48c7414d037e5216a2d5f0d2b725561b55ed08d5e80db47dde33 |
| Tasks                        | 9e58474ba55cd6242741d4fc7db1a8af5b1708ba76481e2045362fe044928157 |
| Implementation Plan embedded | 576d8ce8cb9ae117ae4b9a068fa10c47a1c9e12e76e1035360e0fe4fda0f4382 |
| Technical Contract embedded  | c51f4560fb8241d6cb92df6877ae6e046932e3e12b9c047f05c8fc4f89b13a9c |

Fresh baseline 2026-09-08T15:50:58.634Z, 2584 tracked/
untracked nonignored files; HEAD defbc50eba3952fa2e7b1c016637daf083b18c65. 29/29 protected Gate1
table hashes match. Existing Pointage/Formalités/async-interaction dirty work
is outside delivery; no silent merge/rebaseline/revert.

Current evidence-completion checks actually run:

| Command / check                                                                                          | Exit / exact result                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec validate ui-ux-pro-max-integration --strict --no-interactive`                                  | 0; change valid                                                                                                                                                                                         |
| `pnpm docs:check`                                                                                        | 0; consistency passed, 36 current documents                                                                                                                                                             |
| `pnpm architecture:check`                                                                                | 0; runtime imports, database URLs, client boundaries and migration baselines valid                                                                                                                      |
| `pnpm -r --if-present typecheck`                                                                         | 0; 15 of 16 workspace projects completed                                                                                                                                                                |
| `pnpm exec prettier --write docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md`         | 0; only this authorized packet formatted; no repository-wide write                                                                                                                                      |
| `pnpm exec prettier --check docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md`         | 0; all matched files use Prettier style                                                                                                                                                                 |
| `pnpm format:check`                                                                                      | 1; 67 inherited warning paths, NOT PASS; every warning path has unchanged exact bytes against this turn's pre-write baseline                                                                            |
| `git diff --check -- docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md`                | 0; ordinary tracked diff alone is not sufficient for untracked evidence                                                                                                                                 |
| `git diff --no-index --check -- NUL docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md` | 1; added-file difference, no whitespace-error diagnostic; Git warns about future LF-to-CRLF conversion, no conversion performed                                                                         |
| Read-only Node exact-byte integrity checks                                                               | 0; all 29 protected Gate 1 rows match; Proposal/Analysis/Specs/Design/Tasks and both embedded blocks retain approved hashes; 23 tasks unchecked, 0 completed                                            |
| Full path/hash snapshot comparison                                                                       | 2584 tracked/nonignored-untracked paths; only this authorized packet changed between pre-write baseline and 2026-09-08T16:00:24.783Z; HEAD unchanged; no concurrent new drift observed in that interval |
| Read-only target/staging existence checks                                                                | `.agents/skills/ui-ux-pro-max` and `.yuta-tooling/ui-ux-pro-max` remain absent                                                                                                                          |

Acquisition/parser/hash/marker inspection ran in short-lived Node processes,
without upstream execution or tarball file creation. No cleanup of repository or
user files was needed. A local orchestration helper initially hit JavaScript
template-string syntax parsing before any shell action; rewriting the helper
resolved it and the actual integrity command above exited 0. A NOTICE pre/post
format comparison detected the single trailing-space normalization documented
above; the candidate length/hash were recomputed from its final embedded bytes.

No installation, dependency mutation, Python execution, generated payload,
Tasks completion, Apply, Sync, Archive, Knowledge or production action occurred.
Application tests/builds, UI-pack tests and tooling smoke were not run: this is
evidence acquisition only, with no executable implementation; they are not
claimed PASS. Final packet SHA-256 is returned externally to avoid self-hashing.
The following appendix preserves historical planning evidence and is NOT
current rerun evidence or a current approval-status override.

## Appendix — preserved historical planning handoff and validation

The following material records the earlier planning turn, before the present
read-only evidence acquisition permission and planning approval. Its historical
NOT RUN/awaiting-review statements do not override the current header.

Tasks: openspec/changes/ui-ux-pro-max-integration/tasks.md.
23 tasks / 0 completed; six subgroups of Integration / Regression; embedded
Implementation Plan and T1–T25 contract. Exact D11 allowlist (20 future source
paths + bounded ignored target/staging) and baseline hashes in Tasks.
Coverage: exact R01–R18/S01–S42 mapping and D1–D18 task mapping.
All planning semantic artifacts remain byte-for-byte approved.

Baseline captured 2026-09-08T15:17:53.789Z: 2581 tracked/untracked
nonignored files, HEAD defbc50eba3952fa2e7b1c016637daf083b18c65.
29/29 Gate 1 hash-table entries matched before writes; exact Specs/Design/
pre-metadata Gate 2b hashes match current-user approval.
Gate 2b changes are approval metadata only; embedded historical Design preserved.

| Artifact             | Approved SHA-256                                                 |
| -------------------- | ---------------------------------------------------------------- |
| Proposal             | 04454de85462b9f571b18022f250a9fdb996b43636eb22a3a7710897b2ba5d45 |
| Analysis             | 88198e944804810a145e463513127e498a9e7dfccb19ef0656dcea019bb235d7 |
| Specs                | 568d37a253878fee2a9f853b027a21f95f708af77c8df496ae99fa67f38b2646 |
| Design               | 77fcbdc9938f48c7414d037e5216a2d5f0d2b725561b55ed08d5e80db47dde33 |
| Gate 2b pre-metadata | 3d8ae1cb987e814ce70c3be5c686c5ec835024fc20b03145c42aa2d68d6a8967 |

Concurrent changes since final Design snapshot (attribution only):

| Path                                                                          | Previous observed SHA-256                                          | Planning baseline SHA-256                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `apps/backoffice/src/server/pointage/raw-clocking-manager.ts`                 | `ABSENT`                                                           | `209183808c72c1a9c677d57b2603dd5030336ad864d1ff542df1f0d06f27d948` |
| `apps/backoffice/test/pointage-raw-clocking-manager.test.ts`                  | `ABSENT`                                                           | `a36e3beaf3ee38da51eae92dafdb923a2d4d7364a45e58a3d4cdf3af338d1db7` |
| `apps/backoffice/test/pointage-raw-clocking-service.test.ts`                  | `d8388eaf88802a1a1f02652d48758073ad67790d8fb8efcbd8111b5e94e2a51f` | `6727c34fb9659f54068eccc8bc01dbf97f837a9142695fa821a032969ccdc0d4` |
| `docs/reviews/pointage-usable-raw-clocking/apply-c17-service-checkpoint.diff` | `ABSENT`                                                           | `6363a602f65dbc85df9a3da0f4e72ea1ed33540a14e9256ac142e19a7476dec4` |
| `packages/db-cloud/src/pointage-raw-clocking-repository.ts`                   | `40ae8e2d63de53a8ede46b3e7154d3953a27147b5563b3f312ff1a6400da04a6` | `fa73b8431af57b3f066869750350ac7f8f716b2ad0debd86ac69f4c15d43b106` |

All five are Pointage context, not this change's delivery/authority/approval.
Existing dirty Formalités and async-interaction work retained unchanged at
planning baseline; no automatic rebaseline or cleanup. Before Apply recheck
all sources, including any new concurrent drift.

## Final planning validation

| Command / check actually run                                                                                                                                                                                     | Exit / result                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec validate ui-ux-pro-max-integration --strict --no-interactive`                                                                                                                                          | 0; Change is valid                                                                                                                                             |
| `pnpm docs:check`                                                                                                                                                                                                | 0; Documentation consistency check passed (36 current documents); rerun after packet creation also 0                                                           |
| `pnpm architecture:check`                                                                                                                                                                                        | 0; runtime imports, database URLs, client boundaries, migration baselines valid                                                                                |
| `pnpm -r --if-present typecheck`                                                                                                                                                                                 | 0; 15 of 16 workspace projects completed                                                                                                                       |
| `pnpm exec prettier --write openspec/changes/ui-ux-pro-max-integration/tasks.md`                                                                                                                                 | 0; only newly authored Tasks formatted                                                                                                                         |
| `pnpm exec prettier --write docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md`                                                                                                                 | 0; only newly authored review input formatted                                                                                                                  |
| `pnpm exec prettier --check openspec/changes/ui-ux-pro-max-integration/tasks.md docs/reviews/ui-ux-pro-max-integration/02b-design-review.md docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md` | 0; all matched files use Prettier style                                                                                                                        |
| `pnpm format:check`                                                                                                                                                                                              | 1; 67 inherited warnings, NOT PASS                                                                                                                             |
| `git diff --check -- openspec/changes/ui-ux-pro-max-integration/tasks.md docs/reviews/ui-ux-pro-max-integration/02b-design-review.md docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md`        | 0; ordinary Git diff excludes untracked content, not sufficient alone                                                                                          |
| `git diff --no-index --check -- NUL <path>` separately for the same three exact paths                                                                                                                            | 1 for each; added-file differences, no whitespace-error diagnostics; Git warns LF will be replaced by CRLF when it touches files. No file conversion performed |
| `openspec status --change ui-ux-pro-max-integration --json`                                                                                                                                                      | 0; schema yuta-spec-driven; isPlanningComplete true; operational Apply still blocked                                                                           |
| Node exact-byte hash/table/preimage checks                                                                                                                                                                       | 0; 29/29 protected entries match; Tasks 23 unchecked / 0 completed; Gate 2b stripped metadata reconstructs exact approved preimage                             |
| Target/staging existence read-only                                                                                                                                                                               | Both absent: .agents/skills/ui-ux-pro-max and .yuta-tooling/ui-ux-pro-max                                                                                      |

Global formatting warning-set comparison with previous Design output: 67
unchanged inherited paths, zero new warning paths; two prior Pointage warnings
no longer present (raw-clocking-service.test.ts and
pointage-raw-clocking-test-database.ts). No Pointage formatter/source write
performed here. Global command ran before final packet text; final three-file
scoped check is required again after evidence finalization.

No install/download/upstream Python/tooling smoke/activation/Apply performed.
No `pnpm test:ui-pack`, `pnpm ui:pack:check`, app builds,
`pnpm test:cloud` or `pnpm test:local` run in this planning-only turn:
no implementation/routing/runtime changes. They are future checks per D18
where applicable, not claimed PASS. No fresh Next type generation needed:
this was not clean install/route/config/generated-output removal; existing
generated types supported the actual recursive check. No lint invented.

### Final delivery and block hashes

Exact bytes, Node crypto.createHash("sha256") + fs.readFileSync, lowercase hex.
Embedded blocks are UTF-8 content strictly between BEGIN/END marker lines
(excluding marker lines; terminal LF retained), as defined in Tasks.

| Delivery / block                                  | SHA-256                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| tasks.md full file                                | 9e58474ba55cd6242741d4fc7db1a8af5b1708ba76481e2045362fe044928157 |
| Embedded Implementation Plan                      | 576d8ce8cb9ae117ae4b9a068fa10c47a1c9e12e76e1035360e0fe4fda0f4382 |
| Embedded Technical Implementation Contract T1–T25 | c51f4560fb8241d6cb92df6877ae6e046932e3e12b9c047f05c8fc4f89b13a9c |
| Gate 2b packet after approval metadata only       | d4c670941f459a4727d66ed5c699d24cd0fc611e097796af823fd0b7cf04a4f3 |

This review packet hash is returned externally to avoid self-hash recursion.
Exact Tasks path holds Implementation Plan, contract, D11 path set and all
mapping; no standalone plan/contract/verify-evidence artifact is created.

### Concurrent attribution during planning

Snapshot 2026-09-08T15:23:45.720Z; own delivery exactly Tasks + this review input +
Gate 2b approval metadata. Additional concurrent changes observed:

| Path                                                                          | Pre-planning SHA-256                                               | Observed SHA-256                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md` | `dc52fc6f4ea3ddfe68dc7e3f80e9116bd8550368391c12e012f5a2b33db7e539` | `66720cc6515033cc999c157192f1fec25c866117cd8e2a87bfef277424a37d88` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`                      | `945e6734e415c8e197bd43acb72ada4f8a5184cf8e0e0676f2229f28ad2bbc84` | `7bf96f696edc16578e36e157fc6b3a2d2390b461898077be633f2c810d79bbe8` |
| `docs/reviews/pointage-usable-raw-clocking/apply-c17-service-checkpoint.json` | `ABSENT`                                                           | `9a42a0f9952e218842106d0d1ebc29b9a3175c11359b2640e35f1dbe7a52a4cc` |

These are Pointage-owned task/review/checkpoint evidence, not reviewed authority
for this change. Protected sources and Proposal/Analysis/Specs/Design unchanged.
No Formalités/async-interaction source drift observed within this snapshot.
No unrelated changes reverted, merged, normalized or included in delivery.

## Stop and next authority

Final read-only traceability audit checked all 18 requirement titles / 42 scenario
titles, 18 Design rows, 25 contract rows, exact D11 20-path set and M01–M13
table-cell equivalence. Initial audit helper exited 1 because its unanchored
Markdown regex also captured the hash column; anchoring to the first column
corrected the checker, with no artifact change required. Corrected audit exited 0. This is a planning-audit helper correction, not a passed implementation test.
Final strict OpenSpec, docs, architecture and scoped Prettier reruns exited 0.

Tasks planning: AWAITING_HUMAN_REVIEW.
License review input: LICENSE_REVIEW_INPUT_INCOMPLETE.
Remaining blocker: LICENSE_PROVENANCE_ACCEPTANCE_REQUIRED.
Apply: NOT AUTHORIZED.
Production: NOT AUTHORIZED.
No Sync, Archive or Knowledge action.
