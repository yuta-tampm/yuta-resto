# Gate 3 — Final Review

Change: `establishment-copy-primary-contact-to-public`

Gate: `3 — Implementation + Verification`

Review status: `APPROVED`

Created: `2026-08-30T17:06:34.7592778+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `NO`

Approval source: explicit current-user instruction

Approval recorded: `Final review approved. I authorize spec sync and archive.`

Approved: `2026-08-30T17:29:51.1423329+02:00`

Sync authorization: `AUTHORIZED_BY_CURRENT_USER`

Finish outcome: `COMPLETED`

Specs: synced and validated: `openspec/specs/establishment-profile/spec.md`

Archive location: `openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public`

Completed: `2026-08-30T17:31:17.5134296+02:00`

## Approved review-gate evidence

Both earlier packets remain `APPROVED`. Their reviewed artifact path sets and hashes were recomputed before apply and matched exactly. No conditional design gate was required because this change does not alter authorization/security boundaries, runtime or data ownership, database shape, payment/fiscal behavior, Personnel/legal/privacy data, external-provider contracts, POS transactions, destructive operations, or a cross-module durable boundary.

| Approved evidence                                                                 | SHA-256                                                            |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/establishment-copy-primary-contact-to-public/01-analysis-review.md` | `336d9b3e18dc2669064d1c9597d10f13e489196801d867a77da4c8f2d1535275` |
| `docs/reviews/establishment-copy-primary-contact-to-public/02-specs-review.md`    | `118441e628dfbd9f538b134b868227ac38ba2effab549b679e067a4cf4d197a0` |

Hashes were generated with PowerShell `Get-FileHash -Algorithm SHA256 -LiteralPath <path>` and rendered in lowercase.

## Current planning artifact hashes

| Planning artifact                                                                                   | SHA-256                                                            |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/establishment-copy-primary-contact-to-public/analysis.md`                         | `cc46c4f9d3881f6fb930f88264f8a7c4021c0afe05a9b6dd48b899fbf3aaa0a2` |
| `openspec/changes/establishment-copy-primary-contact-to-public/design.md`                           | `6dbac8106a80165a7e7bb7ec8c3346980199a70e2ee13fc44a78822da37be873` |
| `openspec/changes/establishment-copy-primary-contact-to-public/proposal.md`                         | `77fd805c12a72d659f118cd813bb8a197ff57cd6fb6e363449e74fd3048f7eb3` |
| `openspec/changes/establishment-copy-primary-contact-to-public/specs/establishment-profile/spec.md` | `2253f7791b9feef29534f363d8e16612f9a8ffb4e03888948f6795269add5939` |
| `openspec/changes/establishment-copy-primary-contact-to-public/tasks.md`                            | `eb08d5a1a0049981f4dac900809dd27536d010971a9703383d4e8f7b67ee4031` |

Proposal, analysis, delta spec, and design remain byte-for-byte identical to their pre-apply content. Only the seven task checkboxes changed in `tasks.md`, as required by the apply workflow after each task was completed and verified.

## Design summary

- A shared `Button` with `type="button"` and the visible French label `Utiliser les coordonnées principales` is placed beside the public-contact destination fields and appears only for editors.
- `GeneralInformationForm` retains ownership of the draft and applies one functional state update at click time.
- A named pure model helper performs independent phone/email copy semantics and preserves every unrelated field.
- Existing dirty-state comparison, explicit submit, validation, server authorization, tenant scope, persistence, and visibility behavior remain unchanged.
- Tests follow existing Vitest and `renderToStaticMarkup` conventions; no framework or dependency was added.

## Tasks summary

OpenSpec apply state reports `all_done`: **7/7 tasks complete**.

| Task group                      | Completion evidence                                                                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pure helper and matrix coverage | Helper added; both-populated, empty/null, overwrite/preserve, no-op, unrelated-field, and no-linkage tests pass.                                    |
| Form-state integration          | Functional `setDraft` callback added; existing dirty comparison and submit action remain in place.                                                  |
| UI and read-only behavior       | Shared non-submit button added; editable and read-only static-render tests pass.                                                                    |
| Bounded verification            | Targeted tests, typechecks, build, strict OpenSpec validation, documentation, architecture, formatting, and diff checks executed as recorded below. |

## Implementation files changed

The pre-apply scoped status was clean for all existing implementation paths; the new component test did not exist. The isolated implementation path set is:

1. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx`
2. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx`
3. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts`
4. `apps/backoffice/test/general-information-model.test.ts`
5. `apps/backoffice/test/public-information-section.test.tsx`

No database migration, API, repository, schema, permission, server action, save flow, Product Knowledge, ADR, lifecycle, OpenSpec schema/config, generated skill, main spec, sync, or archive path is included in the implementation diff.

## Requirement and scenario mapping

| Requirement                                   | Implementation evidence                                                                                                                                                       | Test / verification evidence                                                                                                                                                                                                                      |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conditional primary-to-public copy            | `general-information-model.ts:67` handles phone and email independently; `general-information-form.tsx:62` applies it to the latest draft snapshot.                           | `general-information-model.test.ts:36` through `:148` covers both populated, each empty/null combination, both empty/null, overwrite/preserve, no-op, unrelated fields, and no linkage.                                                           |
| Draft-only behavior and explicit save         | `general-information-form.tsx:43` retains derived dirty state; `:68` retains the existing form action; `public-information-section.tsx:30` makes the copy control non-submit. | Static-render test asserts `type="button"`; Backoffice typecheck, full test suite, and production build pass. No server action or persistence file changed.                                                                                       |
| No ongoing synchronization                    | The pure helper runs only from the explicit callback; primary and public inputs continue using independent draft updates.                                                     | `general-information-model.test.ts:135` proves later primary changes do not change copied public values; existing public inputs remain bound to `setText` at `public-information-section.tsx:43` and `:52`.                                       |
| Existing permission and capability boundaries | `public-information-section.tsx:28` renders the action only when `canEdit`; all other fields are preserved by the helper. Existing save authorization remains unchanged.      | `public-information-section.test.tsx:46` and `:53` cover editable/read-only rendering; `establishment-profile-permissions.test.ts:39` preserves OWNER/MANAGER manage and STAFF denial; unrelated-field preservation is covered in the model test. |

All four requirements and all twelve scenarios have implementation and/or regression evidence. No CRITICAL completeness or correctness issue was found.

## Verification evidence

Canonical verify-evidence SHA-256: `d96e47842f9d9ae13aab7dff56da148efe621267271f9282d06d2f1721b32fa5`

The hash covers the exact UTF-8 bytes inside the following block, without a trailing newline. Its summary source is the Codex verification comparison of every OpenSpec apply `contextFiles` artifact against the scoped implementation and the listed command outputs.

```text
Verification source: Codex comparison of the OpenSpec apply contextFiles against the scoped implementation diff, targeted and full test results, build output, repository checks, and the attempted local browser run.

1. `pnpm --filter @yuta/backoffice exec vitest run test/general-information-model.test.ts test/public-information-section.test.tsx test/establishment-profile-permissions.test.ts`
   Exit: 0
   Result: 3 test files passed; 20 tests passed; no targeted test skipped.
2. `pnpm --filter @yuta/backoffice test`
   Exit: 0
   Result: 56 test files passed, 1 baseline test file skipped; 207 tests passed.
3. `pnpm --filter @yuta/backoffice typecheck`
   Exit: 0
   Result: TypeScript completed with no errors.
4. `pnpm --filter @yuta/backoffice build`
   Exit: 0
   Result: Next.js 16.2.9 production build compiled, typechecked, generated static pages, and finalized successfully; `/etablissement/informations-generales` was included as a dynamic route.
5. `pnpm exec prettier --check general-information-model.ts _components/general-information-form.tsx _components/public-information-section.tsx` from `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales`, plus `pnpm exec prettier --check test/general-information-model.test.ts test/public-information-section.test.tsx` from `apps/backoffice`
   Exit: 0 for both commands
   Result: all scoped implementation and test files use Prettier code style.
6. `pnpm exec openspec validate establishment-copy-primary-contact-to-public --type change --strict --json --no-interactive`
   Exit: 0
   Result: 1 change passed; 0 failed; 0 issues.
7. `pnpm docs:check`
   Exit: 0
   Result: documentation consistency passed for 36 current documents.
8. `pnpm architecture:check`
   Exit: 0
   Result: runtime imports, database URLs, client boundaries, and migration baselines are valid.
9. `pnpm -r --if-present typecheck`
   Exit: 0
   Result: all 15 participating workspace projects completed successfully.
10. `git diff --check`
    Exit: 0
    Result: no whitespace errors; Git emitted only line-ending conversion warnings.
11. `pnpm format:check`
    Exit: 1
    Result: bounded pre-existing failure in 51 out-of-scope generated-skill, archived-task, task, analysis, and schema-template files; none of the five scoped implementation/test files or review packets was reported.
12. Local browser QA: start the production Backoffice with `pnpm --filter @yuta/backoffice start` and open `http://localhost:3001/etablissement/informations-generales`.
    Result: environment blocked. The route rendered its generic Server Components error because PostgreSQL at localhost port 55431 was unavailable; server output reported `ECONNREFUSED`. The temporary server and browser tab were closed. No interaction or responsive-layout claim is made.

Verification assessment:
- Completeness: PASS - 7/7 tasks complete; 4/4 requirements mapped; 12/12 scenarios mapped to implementation and/or regression evidence.
- Correctness: PASS - conditional field-by-field copy, empty/null preservation, draft-only behavior, no ongoing synchronization, and the existing permission/save boundaries match the delta spec.
- Coherence: PASS - implementation follows the existing design, uses the shared Button, keeps state in GeneralInformationForm, keeps the transformation pure, and adds no persistence or authorization path.
- Critical issues: 0.
- Warnings: 1 - browser interaction and responsive QA remain unverified because the local database dependency was unavailable.
- Suggestions: 0.
```

## Deviations and unresolved issues

- Spec deviation: none.
- Design deviation: none.
- Task deviation: none.
- Authority or durable-boundary conflict: none.
- Environment limitation: browser interaction and responsive visual QA could not proceed because the configured local PostgreSQL endpoint at port `55431` was unavailable. This does not convert into environment or readiness evidence, and no runtime-visual pass is claimed.
- Repository-wide formatting remains a bounded pre-existing failure in 51 out-of-scope files. Every file attributed to this implementation and all three review packets are checked separately.

## Scoped diff summary

```text
 .../_components/general-information-form.tsx       |   4 +
 .../_components/public-information-section.tsx     |  14 +++
 .../general-information-model.ts                   |  10 ++
 .../test/general-information-model.test.ts         | 116 +++++++++++++++++++++
 4 files changed, 144 insertions(+)
 .../test/public-information-section.test.tsx       | 59 ++++++++++++++++++++++
 1 file changed, 59 insertions(+)
```

Total isolated implementation change: **5 files, 203 insertions, 0 deletions**.

## Canonical implementation diff

SHA-256: `ddf47ab066962be6688db7dd9d2c7ea050a1c845b9d52cd679b8e11499ee28bf`

Byte length: `10420`

The hash covers the exact UTF-8 bytes of the following diff including one final LF. The canonical representation trims trailing whitespace from each Git diff line so Markdown formatting cannot alter its bytes. The diff was assembled deterministically with this PowerShell procedure; exit code `1` from the untracked `--no-index` command is the expected “differences exist” result:

```powershell
$trackedPaths = @(
  'apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx',
  'apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx',
  'apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts',
  'apps/backoffice/test/general-information-model.test.ts'
)
$newPath = 'apps/backoffice/test/public-information-section.test.tsx'
$trackedLines = @(git -c core.safecrlf=false diff --no-color --no-ext-diff -- $trackedPaths)
$newLines = @(git -c core.safecrlf=false diff --no-color --no-ext-diff --no-index -- /dev/null $newPath)
$parts = @(
  ($trackedLines -join "`n").TrimEnd("`n"),
  ($newLines -join "`n").TrimEnd("`n")
)
$rawDiff = ($parts -join "`n") + "`n"
$implementationDiff = ((($rawDiff -split "`n") | ForEach-Object { $_.TrimEnd() }) -join "`n")
[Security.Cryptography.SHA256]::HashData(
  [Text.UTF8Encoding]::new($false).GetBytes($implementationDiff)
)
```

```text
diff --git a/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx b/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx
index 9fbec47..45d1819 100644
--- a/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx
+++ b/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx
@@ -15,6 +15,7 @@ import { IdentitySection } from './identity-section';
 import { LanguagesServiceModesSection } from './languages-service-modes-section';
 import {
   calculateCompletion,
+  copyPrimaryContactToPublic,
   type GeneralInformationProfile,
 } from '../general-information-model';
 import { PublicInformationSection } from './public-information-section';
@@ -58,6 +59,8 @@ export function GeneralInformationForm({
         ? [...current.serviceModes, value]
         : current.serviceModes.filter((item) => item !== value),
     }));
+  const copyPrimaryContact = () =>
+    setDraft((current) => copyPrimaryContactToPublic(current));

   return (
     <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
@@ -98,6 +101,7 @@ export function GeneralInformationForm({
             fieldErrors={state.fieldErrors}
             setText={setText}
             setBoolean={setBoolean}
+            onCopyPrimaryContact={copyPrimaryContact}
           />
           <LanguagesServiceModesSection
             draft={draft}
diff --git a/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx b/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx
index a67999b..667bc75 100644
--- a/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx
+++ b/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx
@@ -1,3 +1,4 @@
+import { Button } from '@yuta/ui';
 import { ProfileSection, TextInput } from './general-information-fields';
 import type {
   GeneralInformationProfile,
@@ -11,17 +12,30 @@ export function PublicInformationSection({
   fieldErrors,
   setText,
   setBoolean,
+  onCopyPrimaryContact,
 }: {
   draft: GeneralInformationProfile;
   canEdit: boolean;
   fieldErrors: Record<string, string>;
   setText: SetProfileText;
   setBoolean: SetProfileBoolean;
+  onCopyPrimaryContact: () => void;
 }) {
   return (
     <ProfileSection number="3" title="Informations publiques">
       <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:divide-x lg:divide-border-default">
         <div className="grid content-start gap-4 lg:pr-5">
+          {canEdit && (
+            <Button
+              type="button"
+              variant="secondary"
+              size="sm"
+              className="justify-self-start"
+              onClick={onCopyPrimaryContact}
+            >
+              Utiliser les coordonnées principales
+            </Button>
+          )}
           <TextInput
             label="E-mail public (visible par les clients)"
             field="publicEmail"
diff --git a/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts b/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts
index beea21b..b7c374b 100644
--- a/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts
+++ b/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts
@@ -64,6 +64,16 @@ export const countryOptions = [
   ['CA', 'Canada'],
 ] as const;

+export function copyPrimaryContactToPublic(
+  profile: GeneralInformationProfile,
+): GeneralInformationProfile {
+  return {
+    ...profile,
+    publicPhone: profile.phone || profile.publicPhone,
+    publicEmail: profile.email || profile.publicEmail,
+  };
+}
+
 export function calculateCompletion(
   profile: GeneralInformationProfile,
 ): number {
diff --git a/apps/backoffice/test/general-information-model.test.ts b/apps/backoffice/test/general-information-model.test.ts
index 5a14aaa..ed9ed7f 100644
--- a/apps/backoffice/test/general-information-model.test.ts
+++ b/apps/backoffice/test/general-information-model.test.ts
@@ -1,6 +1,7 @@
 import { describe, expect, it } from 'vitest';
 import {
   calculateCompletion,
+  copyPrimaryContactToPublic,
   safeHttpUrl,
   type GeneralInformationProfile,
 } from '../src/app/(authenticated)/etablissement/informations-generales/general-information-model';
@@ -32,6 +33,121 @@ const profile: GeneralInformationProfile = {
 };

 describe('general information model', () => {
+  it('copies both populated primary contacts over existing public values', () => {
+    const result = copyPrimaryContactToPublic({
+      ...profile,
+      phone: '+33102030405',
+      email: 'primary@example.com',
+      publicPhone: '+33999999999',
+      publicEmail: 'public@example.com',
+    });
+
+    expect(result.publicPhone).toBe('+33102030405');
+    expect(result.publicEmail).toBe('primary@example.com');
+  });
+
+  it.each([
+    {
+      sourceLabel: 'null phone',
+      phone: null,
+      email: 'primary@example.com',
+      expectedPhone: '+33999999999',
+      expectedEmail: 'primary@example.com',
+    },
+    {
+      sourceLabel: 'empty phone',
+      phone: '',
+      email: 'primary@example.com',
+      expectedPhone: '+33999999999',
+      expectedEmail: 'primary@example.com',
+    },
+    {
+      sourceLabel: 'null email',
+      phone: '+33102030405',
+      email: null,
+      expectedPhone: '+33102030405',
+      expectedEmail: 'public@example.com',
+    },
+    {
+      sourceLabel: 'empty email',
+      phone: '+33102030405',
+      email: '',
+      expectedPhone: '+33102030405',
+      expectedEmail: 'public@example.com',
+    },
+  ])(
+    'copies each field independently when the source has $sourceLabel',
+    ({ phone, email, expectedPhone, expectedEmail }) => {
+      const result = copyPrimaryContactToPublic({
+        ...profile,
+        phone,
+        email,
+        publicPhone: '+33999999999',
+        publicEmail: 'public@example.com',
+      });
+
+      expect(result.publicPhone).toBe(expectedPhone);
+      expect(result.publicEmail).toBe(expectedEmail);
+    },
+  );
+
+  it.each([
+    { phone: null, email: null },
+    { phone: '', email: '' },
+    { phone: null, email: '' },
+    { phone: '', email: null },
+  ])(
+    'keeps both public values when both sources are empty',
+    ({ phone, email }) => {
+      const current = {
+        ...profile,
+        phone,
+        email,
+        publicPhone: '+33999999999',
+        publicEmail: 'public@example.com',
+      };
+
+      expect(copyPrimaryContactToPublic(current)).toEqual(current);
+    },
+  );
+
+  it('preserves unrelated profile fields', () => {
+    const result = copyPrimaryContactToPublic({
+      ...profile,
+      name: 'LUNA Paris',
+      description: 'Restaurant vietnamien',
+      phone: '+33102030405',
+      email: 'primary@example.com',
+      publicPhone: null,
+      publicEmail: null,
+      languages: ['fr', 'vi'],
+      publicDescription: true,
+    });
+
+    expect(result).toMatchObject({
+      name: 'LUNA Paris',
+      description: 'Restaurant vietnamien',
+      languages: ['fr', 'vi'],
+      publicDescription: true,
+    });
+  });
+
+  it('does not link public contacts to later primary-contact changes', () => {
+    const copied = copyPrimaryContactToPublic({
+      ...profile,
+      phone: '+33102030405',
+      email: 'primary@example.com',
+    });
+    const laterDraft = {
+      ...copied,
+      phone: '+33111111111',
+      email: 'updated@example.com',
+    };
+
+    expect(laterDraft.publicPhone).toBe('+33102030405');
+    expect(laterDraft.publicEmail).toBe('primary@example.com');
+  });
+
   it('keeps the existing completion calculation based on supported fields', () => {
     expect(calculateCompletion(profile)).toBe(7);
     expect(
diff --git a/apps/backoffice/test/public-information-section.test.tsx b/apps/backoffice/test/public-information-section.test.tsx
new file mode 100644
index 0000000..201360f
--- /dev/null
+++ b/apps/backoffice/test/public-information-section.test.tsx
@@ -0,0 +1,59 @@
+import { renderToStaticMarkup } from 'react-dom/server';
+import { describe, expect, it, vi } from 'vitest';
+import { PublicInformationSection } from '../src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section';
+import type { GeneralInformationProfile } from '../src/app/(authenticated)/etablissement/informations-generales/general-information-model';
+
+const profile: GeneralInformationProfile = {
+  name: 'LUNA',
+  description: null,
+  addressLine1: null,
+  addressLine2: null,
+  postalCode: null,
+  city: null,
+  countryCode: null,
+  phone: '+33102030405',
+  email: 'primary@example.com',
+  website: null,
+  publicPhone: '+33999999999',
+  publicEmail: 'public@example.com',
+  logoUrl: null,
+  coverImageUrl: null,
+  languages: [],
+  serviceModes: [],
+  publicDescription: false,
+  publicAddress: false,
+  publicPhoneVisible: false,
+  publicEmailVisible: false,
+  publicWebsite: false,
+  publicLanguages: false,
+  publicServiceModes: false,
+};
+
+function renderSection(canEdit: boolean): string {
+  return renderToStaticMarkup(
+    <PublicInformationSection
+      draft={profile}
+      canEdit={canEdit}
+      fieldErrors={{}}
+      setText={vi.fn()}
+      setBoolean={vi.fn()}
+      onCopyPrimaryContact={vi.fn()}
+    />,
+  );
+}
+
+describe('PublicInformationSection', () => {
+  it('renders an explicit non-submit copy action for editors', () => {
+    const markup = renderSection(true);
+
+    expect(markup).toContain('Utiliser les coordonnées principales');
+    expect(markup).toContain('type="button"');
+  });
+
+  it('does not render the mutating copy action for read-only users', () => {
+    const markup = renderSection(false);
+
+    expect(markup).not.toContain('Utiliser les coordonnées principales');
+    expect(markup).not.toContain('type="button"');
+  });
+});
```

## Recommendation

No critical completeness, correctness, coherence, authority, or isolation issue remains. The environment limitation and repository-wide formatting baseline are explicitly recorded and do not alter the approved requirement semantics.

Recommendation: `APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY`.

This packet stops at Gate 3. The workflow has not synced main specs or archived the change. Final approval must be a current-user instruction bounded to this exact packet, and any authorization to sync must be explicit; neither is inferred from passing checks or packet creation.
