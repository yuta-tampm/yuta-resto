# Reputation Phase 1 Backlog

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-10-03

This file is the operational implementation tracker for
the reputation feature. Durable behavior belongs in the adjacent `README.md`.

This tracker records implementation state and historical sequencing. It is not
Product approval. Google V1 remains `UNRESOLVED`. Facebook and Instagram have
confirmed Human-decided high-level inclusion, while each provider's
`CURRENT_V1_STATUS` and all provider-specific behavior remain `UNRESOLVED`.

## Current bounded status

No provider implementation is authorized by this tracker. The accepted A scope
now has a bounded, default-disabled Google retrieval source path: one recent
page after an eligible mounted Avis visit, explicit refresh/history/detail
recovery, temporary provider cache and authenticated maintenance. Its own
receipt is separate from OAuth/binding and retained local work. See the
[durable retrieval boundary](README.md#bounded-release-a-google-review-retrieval).

The broader Google technical track remains incomplete: scheduled
synchronization remains absent. A separate default-disabled publication
candidate adds exact saved-version/session confirmation, durable attempts,
explicit reconciliation and same-version retry. See the
[publication boundary](README.md#bounded-release-a-google-reply-publication).
`release-a-google-reply-publication` remains active: source/mock/disposable
checks are separate from pending complete local acceptance and exact Human
consent for a real Google target/text. The 2026-10-03 local Release A runtime
qualified 207 active mapped review reads, explicit history, a repeat recent
refresh with zero added/changed items and natural expired-token refresh.
These scoped observations are recorded in the active change's verification
evidence; broader target-environment checkboxes below remain open.
The current user explicitly deferred the real reply trial ("Chưa đăng thật").
The proposed reply remains a local draft; no actual confirmed attempt or
provider PUT occurred. Required live acceptance and full completion remain open.
On 2026-10-03, the current user separately authorized delivery and local commit
of the completed implementation/check/qualification phase, while continuing
to defer real publication. This phase handoff passed independent local-phase
completion review; it does not close the active change's live-acceptance or
full Gate 3 obligations, waive full QA, or authorize sync/archive or deployment.
Actual hosted Google project credentials, eligibility, cache/use conditions,
unattended disposal and backup/restoration proof remain operator prerequisites.
Source presence does not close runtime qualification or promote broader Google
V1, environment, lifecycle or production readiness. No completion checkbox or
technical/QA verdict is added by this source-state update.

## Completed foundation

- Shared reputation enums, Zod contracts, database schema, indexes, repository
  reads, permissions, LUNA seed data, and the independent `feedback-web` app.
- Unified inbox list and feedback detail reads.
- Public direct-feedback page with validation, consent handling, external review
  links, tenant resolution, and abuse rate limiting.
- OWNER-only configuration of the active establishment's Google review,
  Facebook, and Instagram destinations through one explicit atomic Save.
- Shared fail-closed URL policy for private validation and public safe projection;
  missing Reputation settings remain unavailable and are not provisioned by this
  capability.
- Database-backed back-office authentication with HttpOnly sessions.
- Tenant and establishment selector with server-side membership validation and
  session rotation.
- `/parametres/utilisateurs-acces` membership administration for owners and administrators.
- Multi-tenant and multi-location persistence model.
- Authentication and membership audit events.
- Canonical `/visibilite-reputation` Backoffice routes with permanent redirects
  from the former `/clients/*` route group.

## Completed operational inbox

`/visibilite-reputation/avis` is now a persistent, tenant-scoped operational inbox:

`/visibilite-reputation/satisfaction` reuses the same tenant-scoped inbox and mutation
boundary while forcing the source to direct feedback submitted through the
public feedback website. Browser query parameters cannot broaden that page to
Google reviews.

- [x] Add repository mutations for feedback status.
- [x] Add repository mutations for assignment to a tenant user.
- [x] Add manual reply draft creation and editing.
- [x] Add internal note creation.
- [x] Add server actions with Zod validation.
- [x] Enforce organization, establishment, entitlement, and role checks on every
      mutation.
- [x] Restrict employees to feedback assigned to their own user account.
- [x] Record reputation audit events for status, assignment, draft, and note
      changes.
- [x] Replace local-only editor state with persisted database state.
- [x] Move filtering, sorting, and pagination to repository-backed queries.
- [x] Complete responsive list/detail behavior for tablet and mobile layouts.
- [x] Add contract and database integration coverage for mutations,
      employee-level visibility, and cross-tenant denial.

Acceptance result: a manager can process feedback, assign it, save a manual
Google reply draft, add an internal note, reload the page, and see every change
persisted. Publishing is disabled by default. Its approved bounded source
implementation requires separate local admission, exact saved-text confirmation
and provider/operational prerequisites; connector completion alone does not enable it.

## Incomplete Google implementation track

The historical sequence below remains open for its broader completion and
operator qualification. The bounded A source path above does not claim those
external prerequisites are complete:

- [ ] Configure Google Cloud and enable the Business Profile APIs.
- [x] Implement tenant-bound OAuth start and callback routes.
- [x] Encrypt access and refresh tokens at rest with AES-256-GCM.
- [x] Refresh expired access tokens server-side when a refresh token is
      available.
- [x] List accessible Google accounts and locations.
- [x] Save a server-verified location to the tenant connector.
- [ ] Qualify the bounded A review import/update path for actual provider use.
- [ ] Qualify bounded A visit/manual retrieval for the target environment.
- [ ] Add scheduled synchronization and retry behavior.
- [x] Display connector status, configuration errors, OAuth errors, and expired
      authorization recovery.
- [ ] Reconcile Google replies with local reply state.

Required external configuration:

- Google OAuth client ID and client secret.
- Approved redirect URI.
- Business Profile API access.
- Production credential-encryption key.

Public application preparation:

- [x] Add a public YUTA homepage that accurately presents the review workflow.
- [x] Add public Google integration, privacy, terms, legal, data-management,
      and contact routes.
- [ ] Publish the website over HTTPS on a verified `yutapro.fr` hostname.
- [ ] Complete the registered publisher and production hosting details.
- [ ] Verify the production domain for the Google OAuth consent screen.

Application-side configuration and connector UI are complete. Google Cloud
project approval, API enablement, OAuth consent configuration, and production
credentials remain operator tasks.

## Remaining milestones

### AI analysis and reply generation

- [ ] Add a provider-independent AI service.
- [ ] Version the analysis and reply prompts.
- [ ] Validate structured analysis output with Zod.
- [ ] Store sentiment, urgency, topics, summary, and suggested action.
- [ ] Generate replies using the tenant brand voice.
- [ ] Support tone transformations.
- [ ] Add retry, timeout, loading, and error states.
- [ ] Ensure AI never publishes automatically.

Required external configuration:

- Selected AI provider and API credentials.
- Approved model and production usage limits.
- Organization/project eligibility, EU processing, retention, and contractual
  questions are prepared in
  [`OPENAI_PROVIDER_ELIGIBILITY.md`](../../operations/OPENAI_PROVIDER_ELIGIBILITY.md).
  The dossier is not submitted and no provider is selected or connected.

### Google reply publication

- [x] Implement fail-closed publish permission, exact session/version and binding fences.
- [x] Implement explicit preview/confirmation and scoped provider PUT source.
- [x] Distinguish dispatch, uncertainty, unconfirmed observation and Google moderation.
- [x] Require reconciliation and fresh same-version consent for unresolved retry.
- [x] Implement explicit read reconciliation and minimized attempt audit.
- [ ] Finish the recorded local A acceptance, including Human-approved real target/text.
- [ ] Qualify environment/provider operations separately before customer activation.

### Public collection completion

- [ ] Add QR-code management UI.
- [ ] Download QR codes as PNG and SVG.
- [ ] Verify the production hostname and printed QR flow.

### Incident workflow

- [ ] Create an incident from feedback.
- [ ] Add incident list and detail routes.
- [ ] Assign owner, category, priority, and status.
- [ ] Record root cause and corrective action.
- [ ] Resolve and close incidents.
- [ ] Keep incidents linked to source feedback.
- [ ] Add in-app notifications.

### Analytics and hardening

- [ ] Average rating, review count, reply rate, and average reply time.
- [ ] Rating distribution and top negative topics.
- [ ] Open incident count.
- [ ] Notification rules.
- [ ] Reputation audit timeline.
- [ ] Connector and background-job observability.
- [ ] Empty, loading, retry, and error states.
- [ ] Unit tests required by the specification.
- [ ] Google and AI integration tests.
- [ ] End-to-end tests for the eight required Phase 1 scenarios.
- [ ] Desktop, tablet, and mobile acceptance verification.

## Outside the current implemented scope

- Facebook and Instagram connectors. Their high-level Product inclusion is
  confirmed, but their current V1/release status, exact interaction types, and
  provider contracts remain unresolved.
- Private social messages.
- Automatic AI publication.
- Advanced approval workflows.
- SMS and email campaigns.
- Automatic customer compensation.
- Competitor monitoring.
- Cross-organization analytics.
- Platform super-admin UI.

## Standing implementation rules

- Code and technical documentation are English; product UI is French.
- Use `@yuta/ui` and `lucide-react`.
- Use server-side authentication, tenant resolution, entitlements, and
  permissions.
- Never trust organization, establishment, role, or permission input from the
  browser.
- Every external action and material workflow mutation must be audited.
- Google and AI provider code must remain outside UI components.
- OAuth tokens and customer contact data must never appear in logs.
- AI generates drafts only and never publishes autonomously.
- Public review links must not depend on the submitted score.
- Update this backlog whenever a task is completed, added, deferred, or
  reordered.
