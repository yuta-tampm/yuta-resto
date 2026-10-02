# Shared UI References

Status: Current

Visibility: Engineering

This directory contains visual evidence shared by several page packages.

Shared references may belong to one of these ownership layers:

```text
YUTA global
application
section, feature, or multi-page flow
```

Each shared reference entry must record its owner, scope, review status,
elements to reuse exactly, allowed responsive adaptations, excluded elements,
and the implementation/documentation sources that remain behavioral authority.
Page packages link the applicable shared references in `DESIGN_HANDOFF.md` and
include them in the curated design-tool input bundle.

Current shared reference:

- `yuta-shell-brand-reference.png` — visual direction for YUTA branding and the Backoffice shell.

These images are subordinate to:

- root and application `AGENTS.md`;
- current architecture and feature documentation;
- current application shell;
- `@yuta/ui` exports and semantic tokens.

Do not infer navigation, modules, permissions, data fields, or raw color values from these images.

Do not treat a route-local header, sidebar, navigation, account area, or common
state pattern as application-wide solely because it appears in a screenshot.
Cross-page ownership and approval must be explicit.

Page-specific images belong under:

```text
docs/ui/pages/<page-slug>/references/
```
