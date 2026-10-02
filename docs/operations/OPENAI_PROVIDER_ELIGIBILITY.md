# OpenAI Provider Eligibility Dossier

Status: Phase 1 submitted — awaiting OpenAI response

Visibility: Engineering

Owner: YUTA product, privacy, security, and engineering

Last updated: 2026-08-18

## Purpose

This dossier records one organization-level eligibility request to evaluate
OpenAI as YUTA's single external AI provider across four proposed use cases. It
authorizes a YUTA representative to submit the eligibility questions to OpenAI
Sales. It does not select OpenAI for production, create an account or project,
authorize an API key, approve API spend, or permit an API request.

The repository is public. Do not add personal contact details, contract terms,
account identifiers, API keys, security evidence, or other confidential values
to this file. Complete those fields in the private submission copy.

## Applicant details to complete outside the repository

| Field                         | Value                                     |
| ----------------------------- | ----------------------------------------- |
| Legal entity                  | Pre-incorporation project; no entity yet  |
| Registered EU address         | Not applicable before incorporation       |
| Public website                | `https://yutapro.fr`                      |
| Commercial contact            | `TO BE COMPLETED IN PRIVATE COPY`         |
| Privacy/DPO contact           | `TO BE COMPLETED IN PRIVATE COPY`         |
| Security contact              | `TO BE COMPLETED IN PRIVATE COPY`         |
| Billing owner                 | `TO BE COMPLETED IN PRIVATE COPY`         |
| Existing OpenAI organization  | `NONE OR TO BE CONFIRMED`                 |
| Intended production countries | France first; broader scope not approved  |
| Planning horizon              | 24 months                                 |
| Target scale                  | 100 restaurant establishments at month 24 |
| Requested response language   | English or French                         |

## YUTA provider strategy

YUTA intends to use one external AI provider while retaining ownership of:

- prompts and their versions;
- strict input and output contracts;
- domain validation and safe rejection;
- tenant authorization and server-side scope resolution;
- rate limits, per-request limits, and monthly budgets;
- human review and confirmation;
- minimized audit events and incident controls;
- provider-neutral adapters so business logic and UI do not depend on a vendor.

AI output is never an authoritative write by itself. Each product flow retains
its normal authorization, validation, conflict, and human-confirmation rules.

## Proposed use-case portfolio

| ID  | Use case                              | Current repository state                                                                       | Proposed provider input                                                                       | Human control                                                           | Sensitive-data position                                                                                                |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| U1  | Review analysis                       | Planned provider-independent service; strict analysis fields already exist                     | Review rating and review text; no customer email or phone                                     | User reviews operational conclusions                                    | Customer text may contain personal data even when contact fields are excluded                                          |
| U2  | Reply drafting and tone adjustment    | Planned; manual drafts exist, AI generation and publication do not                             | Review context plus tenant-approved brand voice                                               | User edits and explicitly approves; AI never publishes                  | Same customer-text boundary as U1                                                                                      |
| U3  | Marketing visual generation           | Fixture-backed Creative Studio prototype; generation controls are disabled                     | Restaurant prompt and later approved brand assets such as logo or product imagery             | User reviews before download or publication                             | Must exclude employee/customer data; asset rights and moderation remain separate gates                                 |
| U4  | Signed employment-contract extraction | Luna/v4 selected from synthetic evaluation; development integration remains fictional-PDF only | In production, a complete signed PDF could be transmitted through Responses direct-file input | OWNER reviews each suggestion; no automatic employee or register update | Highest-risk use case; contracts may contain identity, signature, address, salary, social, bank, health, or union data |

The four use cases are disclosed together so OpenAI can assess the intended
organization, regional configuration, modalities, expected volume, and support
needs. Approval or eligibility for U1-U3 must not be treated as approval for U4.

## Two-year capacity-planning basis

YUTA's product target is 100 restaurant establishments by the end of the next
24 months. This is a planning target, not a current customer count, guaranteed
commercial commitment, or authorization to process data. No linear onboarding
ramp is inferred; the month-by-month active-establishment forecast remains to be
approved.

The OpenAI submission should disclose the 100-establishment target and the
approved planning baseline below. These figures support provider eligibility
and capacity discussions; they are not a production commitment or permission
to process data.

| Use case | Steady-state monthly formula at 100 establishments         |
| -------- | ---------------------------------------------------------- |
| U1       | Provider requests: `100 × R × A`                           |
| U2       | Provider requests: `100 × R × D × V`                       |
| U3       | Provider requests: `100 × G`; image outputs: `100 × G × I` |
| U4       | Provider requests: `100 × E`                               |

| Variable | Meaning                                                            | Approved planning value |
| -------- | ------------------------------------------------------------------ | ----------------------: |
| `R`      | Average new reviews per restaurant per month                       |                      50 |
| `A`      | Share of eligible reviews sent for analysis                        |                    100% |
| `D`      | Share of reviews for which a reply draft is requested              |                     60% |
| `V`      | Average draft/tone variants requested per drafted reply            |                       1 |
| `G`      | Average visual-generation sessions per restaurant per month        |                      10 |
| `I`      | Average generated image candidates per visual-generation session   |                       4 |
| `E`      | Average employment-contract extraction events per restaurant/month |                       5 |

Peak requests per minute must be estimated separately from monthly totals. A
restaurant-wide campaign, review synchronization, or onboarding event can
produce bursts even when average monthly volume is low. YUTA will request
project-level rate limits and hard spend limits rather than treating the
100-establishment target as permission for unlimited usage.

## Proposed project separation

YUTA requests confirmation that one OpenAI API organization may use separate
EU projects with independent access, retention, and spend controls:

1. `YUTA Reputation` for U1 and U2;
2. `YUTA Creative` for U3;
3. `YUTA Personnel Documents` for U4.

The personnel project must remain disabled until its additional legal, DPO,
privacy, security, retention, rights, incident, and operations gates are closed.
No key or service account should be shared between these project boundaries.

## Requested OpenAI capabilities and written confirmation

YUTA requests a written answer for each project and use case covering:

1. eligibility for European regional storage and regional processing through
   `eu.api.openai.com`;
2. the required Modified Retention amendment and eligibility for Zero Data
   Retention or Modified Abuse Monitoring;
3. whether enhanced retention-control approval is required and available for
   PDF, image, and file inputs used by U3 or U4;
4. the exact documented safety-scanning and exceptional-retention behavior for
   file and image inputs, including when manual review can occur;
5. eligible endpoints and pinned model snapshots for:
   - Responses with strict structured output and text input for U1;
   - Responses with strict structured output for U2;
   - image generation for U3;
   - Responses direct-PDF input with strict structured output for U4;
6. whether every eligible endpoint above performs both storage and inference
   inside Europe, and which system data may remain outside the selected region;
7. application-state retention for each endpoint and whether `store: false`
   changes that behavior under the approved project control;
8. DPA availability, subprocessors, processing locations, support access,
   deletion assistance, data-subject-rights assistance, audit evidence, and
   incident-notification commitments;
9. organization/project access controls, service accounts, hard spend limits,
   rate limits, usage reporting, and emergency project/key disablement;
10. commercial eligibility, minimum commitment, regional-processing surcharge,
    support plan, and expected onboarding lead time.

OpenAI eligibility and documentation may change. Every endpoint, snapshot,
modality, regional-processing claim, and retention control must be verified
again immediately before a production approval.

## YUTA controls presented to the provider

- Server-side requests only; browser clients never receive provider keys.
- Trusted organization and establishment scope is resolved from the server
  session, never from browser-provided roles or identifiers.
- Provider responses pass strict YUTA schemas and domain validation.
- Unsupported keys, malformed results, and instruction-like source content are
  rejected or treated as inert evidence.
- No automatic review publication, employee update, register update, or
  marketing publication.
- Prompts, raw responses, document text, excerpts, names, and business values
  are excluded from generic logs and minimized audit events.
- No provider Files store, vector store, File Search, background mode, batch,
  fine-tuning, embeddings, web search, or tools are proposed for personnel PDFs.
- Production employee files remain in private EU object storage outside Neon;
  an AI request is transient processing and never becomes document storage.
- Each use case has independent quotas, budget, kill switch, and production gate.

## Data-volume and budget planning draft

The 100-establishment target and usage variables are approved as a month-24
planning baseline. The following input, burst, onboarding, and budget values are
a reviewable planning draft, not a provider quote, production approval, model
selection, guaranteed spend, or minimum commitment.

| Use case | Month-24 provider requests/month | Additional output volume | Planning peak requests/minute | Typical input            | YUTA maximum input                     | Target monthly allocation |
| -------- | -------------------------------: | ------------------------ | ----------------------------: | ------------------------ | -------------------------------------- | ------------------------: |
| U1       |                            5,000 | —                        |                           100 | About 2 KiB review text  | 20 KiB text                            |                       €60 |
| U2       |                            3,000 | —                        |                            60 | About 4 KiB context      | 32 KiB text                            |                       €90 |
| U3       |                            1,000 | 4,000 image outputs      |                             5 | About 1 KiB prompt       | 8 KiB prompt + one 10 MiB source image |                      €700 |
| U4       |                              500 | —                        |                             5 | About 1.5 MiB/8-page PDF | 10 MiB/40-page PDF                     |                      €150 |

The month-24 baseline therefore contains 9,500 provider requests per month.
The 4,000 U3 image outputs are results of the 1,000 generation requests and
must not be added again to the provider-request total.

The internal month-24 target envelope is €1,000/month before VAT. Proposed
project hard stops are deliberately higher than the target to absorb pricing,
exchange-rate, retry, quality, and eligible EU-processing variation without
allowing unbounded spend:

| Proposed project           | Target/month | Hard stop/month |
| -------------------------- | -----------: | --------------: |
| `YUTA Reputation`          |         €150 |            €300 |
| `YUTA Creative`            |         €700 |          €1,400 |
| `YUTA Personnel Documents` |         €150 |            €300 |
| **Total**                  |   **€1,000** |      **€2,000** |

No production model is selected. These envelopes assume cost-conscious models,
bounded output, and no background, batch, search, hosted tool, or Files-store
usage. They must be recalculated from the accepted OpenAI quote and benchmark
measurements before any paid experiment or production approval.

The draft onboarding curve does not claim existing customers or a guaranteed
commercial ramp. At the approved 95 provider requests per active establishment
per month, it produces:

| Month | Active establishments | Provider requests/month |
| ----: | --------------------: | ----------------------: |
|     1 |                     1 |                      95 |
|     2 |                     2 |                     190 |
|     3 |                     3 |                     285 |
|     4 |                     5 |                     475 |
|     5 |                     7 |                     665 |
|     6 |                    10 |                     950 |
|     7 |                    13 |                   1,235 |
|     8 |                    16 |                   1,520 |
|     9 |                    20 |                   1,900 |
|    10 |                    23 |                   2,185 |
|    11 |                    26 |                   2,470 |
|    12 |                    30 |                   2,850 |
|    13 |                    34 |                   3,230 |
|    14 |                    39 |                   3,705 |
|    15 |                    44 |                   4,180 |
|    16 |                    49 |                   4,655 |
|    17 |                    54 |                   5,130 |
|    18 |                    60 |                   5,700 |
|    19 |                    66 |                   6,270 |
|    20 |                    72 |                   6,840 |
|    21 |                    79 |                   7,505 |
|    22 |                    86 |                   8,170 |
|    23 |                    93 |                   8,835 |
|    24 |                   100 |                   9,500 |

## Internal approval and submission gate

- [x] Product confirms all four use cases and their priority.
- [x] Product records a target of 100 restaurant establishments at month 24.
- [x] Product approves the `R/A/D/V/G/I/E` values as planning estimates.
- [x] Product supplies expected month-24 volume per use case.
- [x] A draft onboarding ramp, peak rates, input limits, and budget envelope are recorded.
- [x] Product approves the draft capacity and budget envelope for submission.
- [ ] Privacy/DPO confirms the data descriptions and required questions.
- [ ] Security confirms the project-separation and access-control questions.
- [ ] Legal confirms the DPA, subprocessor, and retention questions.
- [ ] Operations names private contacts and the future account/project owners.
- [x] An authorized YUTA representative approves external submission.
- [x] The private copy is checked to contain no real customer, employee, review,
      contract, prompt, response, key, or production identifier.
- [x] The authorized representative confirms submission through the OpenAI
      Sales contact form on 2026-08-18.
- [ ] OpenAI's written response is retained outside the public repository.
- [ ] Accepted non-confidential conclusions are synchronized into current YUTA
      documentation before any account, key, SDK, experiment, or production use.

## Ready-to-send request draft

Complete the bracketed values in a private copy.

```text
Subject: Eligibility request — EU regional processing and retention controls for YUTA API use cases

Hello OpenAI team,

YUTA is a France-based modular restaurant software platform evaluating OpenAI
as its single external AI provider. We are currently at documentation and
synthetic-evaluation planning stage. We have not sent customer or employee data
to OpenAI. Our planning target is 100 restaurant establishments within 24
months; this is a target scale rather than a guaranteed usage commitment.

We are assessing four use cases:
1. structured analysis of restaurant customer reviews;
2. human-reviewed reply drafting and tone adjustment, with no automatic publication;
3. human-reviewed restaurant marketing visual generation;
4. OWNER-reviewed extraction of allowlisted employment facts from signed PDF
   contracts, with no automatic employee or personnel-register update.

The employment-contract use case is separately gated and must not be inferred
as approved from the other use cases. Production personnel files would remain
in private EU storage outside our PostgreSQL database. OpenAI would be used only
as a transient processor through a YUTA-owned provider adapter.

Could you confirm our eligibility and required commercial/contractual steps for:
- European regional storage and processing through eu.api.openai.com;
- project-level separation, retention controls, access controls, and hard spend limits;
- Zero Data Retention or Modified Abuse Monitoring and the required Modified Retention amendment;
- enhanced approval and exceptional-retention behavior for PDF/image/file inputs;
- eligible endpoints and pinned model snapshots for Responses structured output,
  direct PDF input, and image generation in Europe;
- DPA, subprocessors, processing locations, support access, deletion/rights
  assistance, incident notification, audit evidence, and onboarding lead time.

Our initial synthetic evaluation would use only generated fictional data. We
will not use real personnel files without separate legal, DPO, privacy,
security, and operations approval.

Our month-24 planning estimates at 100 establishments are:
- U1 review analysis: 5,000 API requests/month;
- U2 reply drafting: 3,000 API requests/month;
- U3 visual generation: 1,000 generation requests/month producing about 4,000
  image outputs;
- U4 contract extraction: 500 PDF requests/month.

This represents 9,500 provider requests/month. Our current internal planning
envelope is EUR 1,000/month before VAT across the three projects, with a
combined proposed hard stop of EUR 2,000/month. Planning burst ceilings are 100
requests/minute for review analysis, 60 for reply drafting, 5 for visual
generation, and 5 for contract extraction. These figures are planning controls,
not a guaranteed usage or minimum-spend commitment. Exact pricing, eligible EU
models, and commercial terms remain subject to your written confirmation.

Organization details and contacts:
[COMPLETE IN PRIVATE COPY]

Kind regards,
[AUTHORIZED YUTA REPRESENTATIVE]
```

## Official OpenAI documentation reviewed

- Data controls, default retention, Zero Data Retention, Modified Abuse
  Monitoring, and data residency:
  https://developers.openai.com/api/docs/guides/your-data
- File and PDF inputs:
  https://developers.openai.com/api/docs/guides/file-inputs
- Structured outputs:
  https://developers.openai.com/api/docs/guides/structured-outputs
- Project-level data retention and spend controls:
  https://developers.openai.com/api/reference/typescript/resources/admin/subresources/organization/subresources/projects
- Current API pricing and model catalog used only to size the draft envelope:
  https://developers.openai.com/api/docs/pricing
  https://developers.openai.com/api/docs/models

## Current stop condition

The product owner authorized and confirmed submission of the private eligibility
request through the OpenAI Sales contact form on 2026-08-18. An OpenAI response
is not yet recorded. Product separately authorized the offline fictional-corpus
starter slice and temporary-account design preparation on 2026-08-19. This does
not authorize creating an account/project/key, installing an SDK, approving API
spend, making an API request, or processing a real file. Retain any provider
response privately and synchronize only accepted non-confidential conclusions
into current YUTA documentation before Phase 3 execution or any provider
experiment.
