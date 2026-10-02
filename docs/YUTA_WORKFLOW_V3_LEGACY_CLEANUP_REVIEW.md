# YUTA Workflow v3 — Legacy Cleanup Review

Status: APPROVED

Reviewed: 2026-09-03

## Result and authorization

The current user approved Phase B and authorized deletion of four superseded
legacy resources subject to repository-reference safety checks. Those checks
found no active dependency, and all four files were removed. No deletion was
skipped and no replacement stub was created.

The [Phase B review](YUTA_WORKFLOW_V3_HISTORY_CLEANUP_REVIEW.md) now records
APPROVED while preserving HISTORY_CLEANUP_READY_FOR_HUMAN_REVIEW as its historical
recommendation. Its candidate list and validation history were not rewritten.

## Deleted resources and current replacements

Deleted paths below are historical identifiers, not links to existing files.

| Deleted file                                          | Current replacement                                                           |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT.md`     | [Page Chat v3](chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md)                 |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT.md` | [Control Tower v3](chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md)         |
| `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE.md` | [Control Tower handoff v3](chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md) |
| `docs/chatGPT/YuTa_Workflow_v2.pdf`                   | [Canonical human-readable Workflow v3 guide](YUTA_WORKFLOW_V3.md)             |

All replacements were confirmed present before deletion. All deleted resources
were tracked and had no difference from Git HEAD before removal. They remain
recoverable from Git history; no history rewrite, commit, or staging operation
was performed. No directory or broader collection was deleted.

## Repository-reference safety check

Before deletion, searched for all four filenames with fixed-string repository
search, including hidden and ignored source material while excluding Git
internals, installed dependencies, and generated build/cache directories.
An independent scan enumerated all 2,177 existing tracked and non-ignored
untracked repository files, without source-directory or file-extension limits,
and checked case-insensitive legacy basename references, including extensionless
and encoded-extension forms while excluding the v3 replacement names.

Both searches identified only the references below. Locations are pre-edit
line numbers, retained here as search evidence; Phase B approval metadata added
later shifts its line numbers. The new cleanup report's own inventory is also
historical evidence, not a new active dependency.

| Legacy resource                                                                                                   | Every pre-deletion reference                                                                                 | Classification                                                                            |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Page Chat prompt                                                                                                  | `docs/YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md:96`; `docs/YUTA_WORKFLOW_V3_HISTORY_CLEANUP_REVIEW.md:171`     | HISTORICAL_REFERENCE — superseded-resource inventory and deletion-candidate record        |
| Control Tower prompt                                                                                              | `docs/YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md:97`; `docs/YUTA_WORKFLOW_V3_HISTORY_CLEANUP_REVIEW.md:172`     | HISTORICAL_REFERENCE — superseded-resource inventory and deletion-candidate record        |
| Handoff template                                                                                                  | `docs/YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md:98`; `docs/YUTA_WORKFLOW_V3_HISTORY_CLEANUP_REVIEW.md:173`     | HISTORICAL_REFERENCE — superseded-resource inventory and deletion-candidate record        |
| Workflow v2 PDF                                                                                                   | `docs/YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md:99,164`; `docs/YUTA_WORKFLOW_V3_HISTORY_CLEANUP_REVIEW.md:174` | HISTORICAL_REFERENCE — inventory, supersession explanation, and deletion-candidate record |
| Active documentation/index links, source/config references, and other searched repository files for each resource | No matches outside the nine historical occurrences above                                                     | NO_REFERENCE                                                                              |

ACTIVE_REFERENCE count: 0. HISTORICAL_REFERENCE occurrences: 9.
Git history and historical path literals were not treated as active dependencies.
These checks concern the repository; external ChatGPT workspaces or personal
copies were not inspected or claimed to be updated.

## Routing changes

Links redirected: none required. Existing active routing already uses the v3
prompts/templates and canonical Markdown guide. No legacy compatibility stub
was justified. The only new routing link is the Phase B approval record's link
to this Phase C review.

The documentation audit and hash-bound historical product-change evidence were
not rewritten to remove historical path text. No archive index edit was needed.

## Intentionally retained

- All three current Page Chat / Control Tower v3 prompts/templates, unchanged.
- `docs/YUTA_WORKFLOW_V3.md`, the primary operating guide, unchanged.
- `docs/archive/yuta-workflow/reference/YuTa_Workflow_v3.pdf`, unchanged.
- All 26 Phase B moved files and their archive index, unchanged.
- Active supporting protocols and policies, including their approved statuses.
- The normativity activation report retained at its original path by Phase B.
- All product-change review packets, QA evidence, and active/archived change artifacts.
- YUTA skills, generated OpenSpec skills, schema/config, Product Knowledge,
  lifecycle, ADRs, normative specs, and product code.
- Unrelated active tasks and all remaining historical reports/instructions.

## Validation and bounded diff

- Targeted Prettier formatting/check on the Phase B approval record and this
  review: PASS.
- `pnpm docs:check`: PASS.
- `pnpm architecture:check`: PASS.
- `pnpm -r --if-present typecheck`: PASS.
- `git diff --check`: PASS.
- Relative-link regression scan: PASS — no newly unresolved inline relative
  file targets versus the pre-deletion baseline; both edited/new documents'
  relative file links resolve. Existing unresolved example/template or historic
  path candidates elsewhere remain outside scope. External URLs and heading
  anchors were not validated by this file-target scan.
- Pre/post repository hash comparison: only the four authorized removals,
  Phase B approval metadata/history framing, and this new report belong to
  Phase C. Protected and unrelated existing files remain unchanged.

An unrelated new `docs/reviews/formalites-authorization/02b-design-review.md`
appeared after the baseline during concurrent work. It was not created, edited,
reviewed, or attributed to Phase C. No action was taken on that packet.

No Workflow v3 semantics, active protocol content/status, operating instructions,
or archived hash-bound evidence changed. No dependency installation, product
tests/builds, Browser QA, PDF rendering, workflow sync/archive, or deployment was
performed; no product or media content was edited.

## Historical recommendation

LEGACY_CLEANUP_READY_FOR_HUMAN_REVIEW
