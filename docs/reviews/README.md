# YUTA OpenSpec Review Packets

Status: Proposed

Visibility: Engineering

Owner: YUTA product and engineering

## Purpose

`docs/reviews/<change-name>/` stores self-contained review packets, QA
artifacts, and provenance evidence for the human gates in the
[Workflow v3 protocol](../YUTA_AUTOMATED_CHANGE_WORKFLOW.md).

Packets are not Product Knowledge, accepted decisions, lifecycle evidence by
themselves, normative specs, deployment evidence, or Production Readiness.
They record what a reviewer saw and the exact bytes a bounded approval covered.

## Packet sequence

```text
01-analysis-review.md
02-specs-review.md                         omitted for approved no-spec path
02b-design-review.md                       conditional sensitive gate
qa/                                        conditional; mandatory for UI
├── QA_REPORT.md
├── screenshot-manifest.md
└── *.png
03-final-review.md
04-knowledge-consolidation-review.md       conditional post-archive gate
```

Create an artifact only when its workflow stage is reached. Do not pre-create
empty packets or QA directories.

## Gate packet integrity

Every gate packet records change, gate, review status, creation time, schema,
analysis conclusion, sensitivity, and SHA-256 hashes for the exact reviewed
artifacts or diffs.

Allowed gate review statuses are:

- `AWAITING_HUMAN_REVIEW`;
- `APPROVED`;
- `CHANGES_REQUESTED`;
- `INVALIDATED_BY_ARTIFACT_CHANGE`.

Approval is valid only for the recorded change, gate, path set, hashes, and
bounded decision. Any reviewed byte drift, including an added, removed, or
renamed artifact, invalidates approval. Mark the packet
`INVALIDATED_BY_ARTIFACT_CHANGE` and stop; never carry approval to revised
content.

Approval records use:

```text
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
```

Never infer approval from packet existence, tests, OpenSpec/Git/PR state, or
prior assistant text.

## QA evidence

QA follows [`YUTA_QA_PROTOCOL.md`](../YUTA_QA_PROTOCOL.md). UI-affecting
changes require Browser QA, responsive checks, and actual screenshot evidence
before Gate 3 can be ready.

`QA_REPORT.md` records the exact QA status, route, setup, roles/states,
viewports, scenarios, accessibility checks, visual/responsive findings,
regressions, limitations, and screenshot links.

`screenshot-manifest.md` records each screenshot's relative path, viewport,
role/state, scenario, and SHA-256. Screenshots are runtime QA evidence, not
authority for Product behavior, permissions, schema, persistence, or lifecycle.

Gate 3 links and hashes the QA report, screenshot manifest, and screenshots.
Required QA status `FAIL` or `BLOCKED_BY_ENVIRONMENT`, or missing required
responsive/screenshot evidence, prevents a ready Gate 3.

## Gate 3 content

Gate 3 keeps technical verification and QA separate:

```text
TECHNICAL IMPLEMENTATION COMPLIANCE
TECHNICAL VERIFY
QA
```

It records the phase contracts used, Technical Compliance Matrix source/hash,
`TECHNICAL IMPLEMENTATION COMPLIANCE`, `UI_AFFECTING`,
`BROWSER_QA_REQUIRED`, exact VERIFY and QA statuses, planning hashes,
implementation attribution, scoped diff evidence, deviations, lifecycle truth,
and `Sync authorization: PENDING`.

A packet is never ready without `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`
and `VERIFY: PASS`. A UI-affecting packet additionally requires `QA: PASS`.
Passing technical compliance or VERIFY never substitutes for Browser QA.

## Knowledge Review packet

After archive, Knowledge Consolidation classifies the completed change as
`NO_UPDATE_REQUIRED` or `UPDATE_REQUIRED`.

The Knowledge Review packet exists only for `UPDATE_REQUIRED`. It contains:

- the exact completed-change evidence and reason for updating current knowledge;
- target files and authority classification;
- exact proposed diff or replacement text;
- target-file hashes and proposed-diff hash;
- confirmation that Product Decisions, durable boundaries, ownership,
  permissions, lifecycle/readiness, and normative specs are not changed without
  their own authority;
- `Review status: AWAITING_HUMAN_REVIEW`.

Canonical knowledge is not edited until explicit approval. Before applying, the
workflow rechecks the complete target path set and hashes. Drift invalidates the
Knowledge Review approval. Only the approved diff may be applied.

## Retention and authority

Packets and QA evidence remain review/provenance evidence after archive. The
authoritative relationship remains defined by `docs/AUTHORITY_MODEL.md`, the
OpenSpec normativity policy, and current Product Knowledge routing.

A packet may support a separately authorized decision, but it does not by
itself update Product Knowledge, ADRs, lifecycle values, main specs, code
status, environment state, deployment, or readiness.
