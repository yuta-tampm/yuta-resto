# Proposed Knowledge Consolidation Replacements

Change: `personnel-reconstructable-value-history`

Application rule: every `Before` block below MUST match exactly once in its
named target and MUST be replaced by the corresponding `After` block. No other
canonical knowledge bytes are authorized by this proposal.

## `docs/features/personnel/README.md`

### Replacement 1

Before:

```text
production-readiness evidence, or future normative OpenSpec specifications.
```

After:

```text
production-readiness evidence, or the approved normative Personnel OpenSpec specification.
```

### Replacement 2

Before:

```text
| What is the detailed Salariés UI delivery and as-built evidence? | [Salariés page pack](../../ui/pages/backoffice-equipe-salaries/README.md).                                                                                                                                                                                                                                                |
```

After:

```text
| What is the detailed Salariés UI delivery and as-built evidence? | [Salariés page pack](../../ui/pages/backoffice-equipe-salaries/README.md).                                                                                                                                                                                                                                                |
| What precise reconstructable-history behavior is normative?      | [Personnel reconstructable-value-history specification](../../../openspec/specs/personnel/reconstructable-value-history/spec.md).                                                                                                                                                                                         |
```

### Replacement 3

Before:

```text
7. OpenSpec is not currently normative for Personnel.
```

After:

```text
7. The approved Personnel reconstructable-value-history main spec is normative for precise F07 behavior; this file remains the broader Product Knowledge source.
```

### Replacement 4

Before:

```text
There is no normative Personnel specification under `openspec/specs/` today.
This file remains broader Product Knowledge context. After YUTA explicitly
approves OpenSpec specifications as normative, approved Personnel specs may
become the primary authority for specific behavioral requirements inside the
accepted product, architecture, and security boundaries. No OpenSpec artifact
is created or modified by this step.
```

After:

```text
The approved [Personnel reconstructable-value-history specification](../../../openspec/specs/personnel/reconstructable-value-history/spec.md)
is normative for precise observable F07 behavior inside the accepted Personnel,
tenancy, privacy, and runtime boundaries. This file remains the broader Product
Knowledge context and does not claim production enablement.

The completed planning evidence is archived at
`openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history`.
Sync and archive do not authorize production migration, cutover, cleanup,
anonymization, deployment, or Production Readiness.
```

## `docs/ui/pages/backoffice-equipe-salaries/README.md`

### Replacement 1

Before:

```text
The current editor does not own
remuneration, payroll, documents, work authorization, Formalités, personnel-
register corrections, departure, or contract-document lifecycle. It also does
not provide reconstructable old/new values for ordinary identity and employment
changes. Those audit events expose changed field names only; F07 remains the
separate decision point for durable value-level history.
```

After:

```text
The original F03 slice does not own
remuneration, payroll, documents, work authorization, Formalités, personnel-
register corrections, departure, or contract-document lifecycle. Before F07,
its audit events exposed changed field names only. The completed F07 extension
now adds reconstructable old/new values for its approved Personnel facts while
reusing this same editor.
```

### Replacement 2

Before:

```text
F03 continues to own the shared current-value editor, F05 owns signed PDFs and
amendments, and F07 owns any future reconstructable value history.
```

After:

```text
F03 continues to own the shared current-value editor, F05 owns signed PDFs and
amendments, and F07 owns reconstructable value history for its approved
Personnel facts.
```

### Replacement 3

Before:

```text
Status: `LOCAL AS-BUILT — GATE 3 EVIDENCE IN PROGRESS`.
```

After:

```text
Status: `LOCAL AS-BUILT — GATE 3 APPROVED, NORMATIVE SPEC SYNCED; PRODUCTION BLOCKED`.
```

### Replacement 4

Before:

```text
blocked and outside this local change.

## F08 Phase 0 — generate-formality reconciliation
```

After:

```text
blocked and outside this local change.

The precise observable F07 behavior is normative in the
[Personnel reconstructable-value-history specification](../../../../openspec/specs/personnel/reconstructable-value-history/spec.md).
Its completed planning evidence is archived under
`openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history`.
Neither sync nor archive changes this page pack's local-only environment and
production-readiness boundary.

## F08 Phase 0 — generate-formality reconciliation
```

## `docs/PRODUCT_KNOWLEDGE.md`

### Replacement 1

Before:

```text
Last reviewed: 2026-08-27
```

After:

```text
Last reviewed: 2026-09-03
```

### Replacement 2

Before:

```text
File existence
alone is not authority. The directory is currently empty, so the normative role
is enabled but no normative main-spec content exists yet.
```

After:

```text
File existence
alone is not authority. The directory now contains successfully gated, synced,
and validated main specs; use the current tree and capability links rather than
a historical empty-tree assumption.
```

### Replacement 3

Before:

```text
- Canonical Product Knowledge home: `docs/features/personnel/README.md`
```

After:

```text
- Canonical Product Knowledge home: `docs/features/personnel/README.md`
- Normative F07 behavior:
  `openspec/specs/personnel/reconstructable-value-history/spec.md`
```

### Replacement 4

Before:

```text
normative main-spec count      0
```

After:

```text
normative main-spec count      9
```

## `docs/MODULE_REGISTRY.md`

### Replacement 1

Before:

```text
[Personnel Product Knowledge](features/personnel/README.md), [Salariés page pack](ui/pages/backoffice-equipe-salaries/README.md)
```

After:

```text
[Personnel Product Knowledge](features/personnel/README.md), [Salariés page pack](ui/pages/backoffice-equipe-salaries/README.md), [normative F07 spec](../openspec/specs/personnel/reconstructable-value-history/spec.md)
```

### Replacement 2

Before:

```text
The main-spec count is currently zero, so no capability-specific spec link or
registry row is added by this activation. Add a spec link only when an approved
normative main spec actually exists for that bounded capability.
```

After:

```text
Approved normative main specs now exist. Capability-specific links are added
only when an exact bounded spec has completed approval, authorized sync, diff
review, and strict validation; their presence does not change lifecycle values.
```

## `docs/AUTHORITY_MODEL.md`

### Replacement 1

Before:

```text
- The current `openspec/specs/` tree is empty, so no normative main-spec content
  exists yet.
```

After:

```text
- The current `openspec/specs/` tree contains successfully gated, synced, and
  validated normative main specs; each remains bounded to its accepted durable
  product, architecture, security, runtime, and data-ownership boundaries.
```
