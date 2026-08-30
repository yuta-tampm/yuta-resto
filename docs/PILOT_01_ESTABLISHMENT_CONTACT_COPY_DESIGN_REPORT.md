# Pilot 01 — Establishment Contact Copy Design Report

## 1. Chosen implementation approach

Keep the change entirely inside the existing Backoffice client-form boundary. Add a pure conditional-copy helper to the general-information model, invoke it through one functional draft update owned by `GeneralInformationForm`, and pass a callback to the existing public-information section.

The copy control does not call a server action. Persistence continues exclusively through the existing explicit save flow, contract validation, server permission check, and tenant-scoped repository.

## 2. UI placement decision

Place a shared `Button` with `type="button"` above the `publicEmail` and `publicPhone` inputs in the contact column of the Informations publiques section. Use visible French action text such as `Utiliser les coordonnées principales`; any existing-system copy icon is decorative.

This placement keeps the action next to its destination fields and avoids implying an ongoing link from the primary-contact section. The control remains keyboard/touch accessible through the shared button primitive.

## 3. Form-state strategy

Use one functional update against the latest current draft. A pure model helper independently applies the reviewed rules:

- non-empty `phone` replaces `publicPhone`;
- empty/null `phone` preserves `publicPhone`;
- non-empty `email` replaces `publicEmail`;
- empty/null `email` preserves `publicEmail`;
- all unrelated fields remain unchanged.

No new dirty-state mechanism is needed. The existing draft-versus-profile comparison marks a real copy change as dirty and leaves a no-op unchanged. No effect or subscription links later primary changes to public fields.

## 4. Permission/read-only handling

Render the copy control only when the existing server-derived `canEdit` value is true, matching the current save-control behavior. Read-only users do not receive a mutating copy action. No permission is added, and explicit save continues to enforce `establishment.profile.manage` on the server.

## 5. Test strategy

- Extend the existing general-information model test with the full conditional-copy matrix, overwrite preservation, unrelated-field preservation, and one-time/no-linkage behavior.
- Add a focused static-render test using current Vitest and `renderToStaticMarkup` conventions to assert the accessible visible action, `type="button"`, and absence in read-only state.
- Retain the current permission matrix tests as regression coverage.
- Protect no-auto-persist through the pure client-only transformation and the non-submit button assertion; retain existing server validation and authorization coverage for explicit save.

No new test framework or dependency is required.

## 6. Migrations/API/schema changes required?

**NO.**

No database migration, API, server action, repository contract, schema, permission, provider, or external dependency change is required.

## 7. Spec conflict/blocker

None. The current form structure supports every approved scenario without changing the delta spec. Empty/null handling, draft-only behavior, explicit save, no ongoing synchronization, and read-only behavior remain intact.

## 8. Recommendation

`READY_FOR_TASKS`

Proceed to tasks only after design review and approval. No `tasks.md` or implementation code was created in this step.

Status: PROPOSED FOR REVIEW
