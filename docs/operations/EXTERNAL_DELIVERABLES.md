# External Deliverable Files

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-08-23

## Purpose

This document defines one repository-wide convention for files prepared for an
external recipient, such as a lawyer, accountant, vendor, partner, investor, or
administrative body. It applies to generated PDF, DOCX, XLSX, PPTX, and similar
handoff formats.

The editable source remains in its authoritative repository location. An export
is a delivery artifact, not a new source of truth.

## Canonical locations

```text
docs/ or another owning source directory
└── authoritative editable source

tmp/artifacts/<matching-deliverable-path>/
└── builders, renders, screenshots, and other disposable QA files

exports/
├── README.md
└── external/
    └── <recipient-class>/
        └── <domain>/
            └── <deliverable-slug>/
                └── <version>-<status>/
                    ├── YUTA_<Domain>_<Deliverable>_<LANG>_<Version>_<STATUS>.docx
                    ├── YUTA_<Domain>_<Deliverable>_<LANG>_<Version>_<STATUS>.pdf
                    └── MANIFEST.md
```

Examples of `recipient-class` are `legal`, `accounting`, `vendor`, `partner`,
and `administration`. Use a stable business domain such as `personnel`,
`booking`, or `company` rather than an application package name.

Do not place external handoff files in `docs/`, `output/`, Downloads, a page-pack
reference folder, or an arbitrary task-specific directory.

## File naming

Use this exact order:

```text
YUTA_<Domain>_<Deliverable>_<LANG>_<Version>_<STATUS>.<extension>
```

Rules:

- use ASCII letters, digits, and underscores in file names;
- use a short PascalCase domain and deliverable name;
- use an uppercase ISO language code such as `FR` or `EN`;
- use a semantic version such as `v0.1`, `v1.0`, or `v1.1`;
- use one of `DRAFT`, `FOR_REVIEW`, `APPROVED`, or `FINAL`;
- keep the same base name for every format in one delivery set; and
- never use ambiguous suffixes such as `new`, `latest`, `final2`, or `corrected`.

Status meanings:

- `DRAFT`: incomplete metadata or internal review remains; do not send yet;
- `FOR_REVIEW`: prepared for the named external reviewer through an approved
  channel;
- `APPROVED`: external approval evidence exists, but the artifact may still need
  operational finalization; and
- `FINAL`: frozen delivery copy for the recorded recipient and purpose.

Changing content, recipient scope, or approval evidence requires a new version.
Changing only the output format does not.

## Manifest

Every version directory must contain `MANIFEST.md` with:

- deliverable title and purpose;
- source path;
- recipient class, language, version, and status;
- generation date;
- included file names and SHA-256 checksums;
- whether the set contains real personal, legal, financial, or confidential
  data;
- required fields still missing before sending;
- review/approval evidence reference when applicable; and
- the approved transfer channel, once decided.

The manifest must not copy secrets, personal values, contract contents, provider
credentials, or private evidence into the repository.

## Security and repository boundary

`exports/` is ignored by Git except for its instructional `README.md`. It is a
local preparation area, not an archive, backup, production file store, legal
record system, or secure transfer channel.

Synthetic and public-safe artifacts may be prepared locally. A file containing
real employee, customer, company, legal, financial, identity, or signature data
must instead use separately approved private storage and an approved transfer
channel. It must not be committed to this repository or left in an ordinary
developer checkout as its system of record.

Before sending, verify the recipient, purpose, status, missing fields, checksum,
and transfer channel. Sending or uploading remains a separate user-authorized
action.

## Current legal-review example

The Phase 5 CDI legal-review draft uses:

```text
exports/external/legal/personnel/cdi-phase-5-review/v0.1-draft/
├── YUTA_Personnel_CDIPhase5LegalReview_FR_v0.1_DRAFT.docx
├── YUTA_Personnel_CDIPhase5LegalReview_FR_v0.1_DRAFT.pdf
└── MANIFEST.md
```

It remains `DRAFT` while the contact field is incomplete. Moving it to
`FOR_REVIEW` requires completing the recipient/contact metadata, regenerating
the formats, recording new checksums, and confirming the transfer channel.
