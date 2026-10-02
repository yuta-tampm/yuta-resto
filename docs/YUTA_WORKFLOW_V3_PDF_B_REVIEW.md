# YUTA Workflow v3 — PDF B Review

Status: PROPOSED FOR REVIEW

## Artifact and source

- Content source: [approved Workflow v3 guide](YUTA_WORKFLOW_V3.md), unchanged.
- Output: [Official Operating Guide — Alternative Layout](reference/YUTA_Workflow_v3_Official_Guide_B.pdf).
- PDF B: 11 A4 pages (595.28 × 841.89 points).
- Source Markdown SHA-256: `51995c998d5bc1010b9e936551dc2daf494aae2a3eed99edb052841d1f6e0dc4`.
- PDF B SHA-256: `a9a00466f4df49bdf6458275b412d06aa6c08176fed2e09113edbd7e9a535036`.
- Visual comparison reference: `C:/Users/Tam/Downloads/YUTA_Workflow_v3_Official_Guide.pdf`, 14 US Letter pages; SHA-256 `aad16afd230bd33da17d18689aeee9f24b550fa9fb4a91fbc74c6b668496ff02`.

The comparison PDF was used only for visual comparison, never as the content source. Neither source document was modified. APPROVED on the PDF cover describes the canonical source; this alternative presentation remains subject to human comparison and review.

## Content fidelity and coverage

The complete current Markdown was read and a section-to-page coverage plan was prepared before PDF generation. All 137 parsed source blocks were assigned to the output. Text extraction matched all 300 source text items (including table cells and code blocks), after normalizing Unicode and layout whitespace and removing Markdown presentation markers. No source item was missing.

No wording was condensed, summarized, translated, or rewritten. Reflow changes line breaks, column placement, and table presentation, not the words or their meaning. Source section numbering and order remain intact. Section 5 retains all six fields for all 18 stages, arranged as compact field grids across three pages. Section 7 retains its packet information in a two-column arrangement. Section 17 spans two pages, keeping every example intact.

Added presentation text consists of navigation, page furniture, field labels, the requested alternative-layout subtitle, and the user-requested sentence “one authority layer does not silently replace another.” These are not new workflow rules. Markdown links retain their labels and point to the same repository targets relative to the PDF location.

| Section | Canonical topic                                  | PDF B pages | Coverage                                 |
| ------- | ------------------------------------------------ | ----------- | ---------------------------------------- |
| 1       | Workflow purpose                                 | 1           | Complete                                 |
| 2       | Roles and responsibilities                       | 2           | Complete                                 |
| 3       | End-to-end overview                              | 3           | Complete                                 |
| 4       | Cross-module routing                             | 3           | Complete                                 |
| 5       | Step-by-step operating guide                     | 4–6         | Complete; all 18 stages and six fields   |
| 6       | Analysis gate                                    | 7           | Complete                                 |
| 7       | Review gates and integrity                       | 7           | Complete                                 |
| 8       | Tasks, phases, Technical Implementation Contract | 7           | Complete                                 |
| 9       | VERIFY versus QA                                 | 8           | Complete                                 |
| 10      | Gate 3 readiness                                 | 8           | Complete                                 |
| 11      | Normative specs and sync                         | 8           | Complete                                 |
| 12      | `$yuta-run-change`                               | 9           | Complete                                 |
| 13      | `$yuta-finish-change`                            | 9           | Complete                                 |
| 14      | Knowledge Consolidation                          | 10          | Complete                                 |
| 15      | No-spec path                                     | 10          | Complete                                 |
| 16      | Release / Deploy lane                            | 10          | Complete                                 |
| 17      | Everyday examples                                | 10–11       | Complete; all three examples             |
| 18      | Quick reference                                  | 11          | Complete; final invariant block retained |

### Semantic confirmation

The presentation preserves the canonical guide's semantics without importing additional protocol rules:

- Conditional Design, justified omission evidence, the adapter path, and Sensitive Design Gate independence remain explicit (pages 3, 5, and 7).
- `PAGE_LOCAL`, `CROSS_MODULE`, and `UNCERTAIN` routing remain unchanged (page 3).
- Gate sequence, Analysis conclusions, packet/hash integrity, Technical Implementation Contract, and phase selection remain intact (pages 3–7).
- VERIFY and QA remain separate; Technical Compliance Matrix, Browser QA, non-UI QA, QA status enum, screenshot/hash evidence, and Gate 3 readiness are preserved (pages 6–8).
- Sync authorization, validation, archive, and both isolated finish branches remain intact; Branch B does not become active-change finalization (pages 6, 8–9).
- Knowledge Consolidation, `skip_specs` interaction with Design, Release/Deploy separation, and all final invariants remain intact (pages 10–11).

## Render and layout validation

All 11 final pages were rendered to images at 110 dpi and inspected individually. The complete comparison reference was also rendered, with overview and selected full-page inspection for visual comparison.

| Check                               | Result                                                                                                                                                                     |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clipping, overlap, missing glyphs   | PASS; none observed                                                                                                                                                        |
| Orphan titles and footer collisions | PASS; headings accompany content and body remains clear of footers                                                                                                         |
| Table and text margins              | PASS; text bounding-box scan found no margin violations; side margins are 38 points                                                                                        |
| Text size                           | PASS for visual comparison; body generally 10.2 points, dense body/table text at least 9.4 points, code 9.1 points, small field labels 8.5 points, page furniture 8 points |
| Workflow arrows and labels          | PASS; legible conditional paths, gates, and release separation                                                                                                             |
| Page balance                        | PASS; no blank pages or unexplained large empty areas; remaining whitespace separates topic groups                                                                         |
| Navigation                          | PASS; 18 clickable section entries, 11 page bookmarks, and page/section footers                                                                                            |
| Repository link targets             | PASS; all eight relative URI annotations resolve to existing targets                                                                                                       |
| Extracted source text               | PASS; 300 of 300 source items found, no missing items                                                                                                                      |

Fonts are embedded. Link opening depends on the PDF viewer's local-file security settings. PDF B is not a tagged PDF and has not been certified for PDF/UA or screen-reader accessibility; the comparison reference is tagged. Print assessment is based on A4 geometry and rendered pages, not a physical printer proof.

## Comparison with the existing Official Guide

| Criterion        | Existing reference                                                        | Alternative B                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Readability      | More presentation-like separation, colored cards, and generous whitespace | Continuous technical handbook with compact field grids and side-by-side comparisons; denser pages require closer reading        |
| Density          | 14 Letter pages; dedicated cover and contents pages                       | 11 A4 pages; cover, purpose, and navigation share page 1; no source wording removed                                             |
| Navigation       | Separate contents page and section headings                               | Clickable section/page map on page 1, bookmarks, running labels, and numbered footers                                           |
| Visual hierarchy | Large dark cover panel, colored status blocks, and boxed stages           | Text-led cover, restrained blue headings, thin rules, consistent table labels, and fewer decorative surfaces                    |
| Print usability  | More filled color areas and presentation spacing                          | A4 layout, mostly white background, light rules, embedded fonts, and restrained ink coverage; labels do not rely on color alone |

The lower page count is a presentation result, not a claim of an equivalent percentage reduction in printed area: the two PDFs use different paper sizes. B offers a materially different, denser operating-handbook presentation. Human preference between the two remains open; this review does not replace the canonical Markdown entry point or approve B as the preferred edition.

## Repository validation and scope

- Targeted formatting: `pnpm exec prettier --write docs/YUTA_WORKFLOW_V3_PDF_B_REVIEW.md`.
- `pnpm docs:check`: PASS.
- `pnpm architecture:check`: PASS.
- `pnpm -r --if-present typecheck`: PASS.
- `git diff --check`: PASS.
- PDF source coverage, rendered-page review, margin checks, and relative-link target checks: PASS as described above.

Repository-wide formatting, product tests, and builds were not run: only the PDF and this review were authored, with no product or workflow implementation change. Existing unrelated working-tree changes were preserved. No canonical guide, active protocol, skill, OpenSpec schema/config, Product Knowledge, lifecycle, ADR, normative spec, or product code was edited by this task.

## Recommendation

PDF_B_READY_FOR_HUMAN_COMPARISON
