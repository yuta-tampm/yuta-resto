# YUTA OpenSpec Review Packets

Status: Proposed

Visibility: Engineering

Owner: YUTA product and engineering

## Purpose

`docs/reviews/<change-name>/` stores self-contained review packets and provenance evidence for the human gates in the [automated change workflow](../YUTA_AUTOMATED_CHANGE_WORKFLOW.md).

Packets are not Product Knowledge, accepted decisions, lifecycle evidence by themselves, normative specs, implementation authority, deployment evidence, or production-readiness evidence. They document what an independent reviewer saw and which exact content a bounded approval covered.

## Packet sequence

- `01-analysis-review.md` — proposal and analysis review.
- `02-specs-review.md` — delta-spec and strict-validation review; omitted for an approved no-spec path.
- `02b-design-review.md` — conditional review for sensitive changes.
- `03-final-review.md` — planning, implementation, tests, verification, and sync-authorization review.

Create a packet only when its gate is reached. Do not pre-create empty gate files.

## Required status and integrity

Every packet records its change, gate, review status, creation time, schema, analysis conclusion, sensitive-change classification, and SHA-256 hashes for the exact reviewed artifacts or diff.

Allowed review statuses are:

- `AWAITING_HUMAN_REVIEW`
- `APPROVED`
- `CHANGES_REQUESTED`
- `INVALIDATED_BY_ARTIFACT_CHANGE`

Approval is valid only for the recorded change, gate, path set, hashes, and bounded decision. If any reviewed content changes, including an added, removed, or renamed artifact, the approval is invalid. The workflow must mark the packet `INVALIDATED_BY_ARTIFACT_CHANGE` and stop for re-review; it must not carry approval forward to revised content.

Approval records must say:

```text
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
```

Do not infer approval from packet existence, tests, OpenSpec status, Git state, pull-request state, or prior assistant text. Do not invent a universal approver name or role.

## Retention and authority

Packets remain review/provenance evidence after archive. The authoritative relationship remains defined by `docs/AUTHORITY_MODEL.md` and the approved OpenSpec normativity policy. A packet may support a separately authorized decision, but it does not update Product Knowledge, ADRs, lifecycle values, main specs, code status, environment state, or readiness on its own.
