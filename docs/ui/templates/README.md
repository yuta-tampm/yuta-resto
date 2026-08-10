# UI Page Package Templates

Status: Current

Visibility: Engineering

Last updated: 2026-08-10

Use `page/` as the application-neutral starting structure for a new current
page package.

The templates are not product authority. Before using them:

- read root and nearest application `AGENTS.md`;
- read `docs/CURRENT_STATE.md` and current product, feature, operations, and QA
  documentation;
- read shared UI rules and target-application UI rules;
- inspect the real route, current implementation, and tests;
- classify the target as `NEW_PAGE` or `EXISTING_PAGE` and as visual-only,
  interactive, integrated, or device-coupled;
- resolve YUTA-global, application, section/flow, and page UI context; choose
  the exact shell/navigation mode; and block design generation when shared
  context is missing or conflicting;
- assemble the curated target-baseline and approved shared-reference bundle
  that will be supplied to the design tool;
- replace all placeholders;
- capture the current baseline for an existing target and prepare the
  repository-grounded design prompt in `DESIGN_HANDOFF.md`;
- keep lifecycle metadata in the exact form defined by
  `../PAGE_PACK_PROTOCOL.md`;
- remove non-applicable sections rather than filling them with Backoffice
  assumptions;
- do not copy unsupported behavior from visual references.

The canonical packaging rules are in `../PAGE_PACK_PROTOCOL.md`.
