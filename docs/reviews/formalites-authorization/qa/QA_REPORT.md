# Authorization QA — formalites-authorization

Change: formalites-authorization

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

Browser QA: NOT_APPLICABLE

QA: PASS

Route(s): none invoked; prerequisite has no new consumer.

Data/test setup: synthetic memberships/session facts; actual session.ts and
tenant resolver, actual permission guards. Infrastructure mocks replace cookies,
auth repository/metadata/membership factories, redirect transport and React
request cache. No real database or external provider connection.

## Executable scenario coverage

| Required scenario             | Result / exact test evidence below                                         |
| ----------------------------- | -------------------------------------------------------------------------- |
| OWNER READ                    | PASS — formalites.read allows OWNER independently                          |
| OWNER MANAGE                  | PASS — formalites.manage allows OWNER independently                        |
| MANAGER both operations       | PASS — denies MANAGER with exact error + valid membership denial           |
| STAFF both operations         | PASS — denies STAFF with exact error + valid membership denial             |
| Public / service              | PASS — each actor denied for each operation                                |
| YUTA_ADMIN / YUTA_SUPPORT     | PASS — no elevation and no missing-membership/grant bypass                 |
| Missing session               | PASS — missing cookie and invalid upstream session login redirect          |
| Missing membership            | PASS — actual resolver recovery redirect                                   |
| Inactive membership           | PASS — suspended record denied by actual resolver                          |
| Mismatched user               | PASS — wrong-user record denied                                            |
| Wrong organization            | PASS — mismatched org record denied                                        |
| Wrong establishment           | PASS — mismatched establishment record denied                              |
| Missing establishment 400     | PASS — null/empty unit contexts; org-only composition fixture, exact error |
| Permission denied 403         | PASS — exact TenantError code/status/message checks                        |
| Browser claims                | PASS — forged cookie/header/query claims ignored, STAFF cannot elevate     |
| READ/MANAGE independence      | PASS — distinct grants and controlled per-operation forwarding             |
| Personnel allow not authority | PASS — Personnel spies unused, Formalités still denied                     |
| Valid trusted OWNER           | PASS — real frozen resolved context, session identifiers verified          |
| Recovery / upstream failure   | PASS — safeReturnTo preserved; repository exception propagates             |

Accessibility/visual/responsive/screenshots: NOT_APPLICABLE; no UI changed.
Generic/connected prototype regression was separately executed (26-test
regression selection includes both and the development gate). No UI was added
merely to produce QA.

## Exact executed command

```text
pnpm --filter @yuta/backoffice test test/formalites-permissions.test.ts test/formalites-authorization-context.test.ts --reporter=verbose
```

Exit code: 0. 2 test files, 59 passed, 0 failed, 0 skipped.

## Exact execution output

```text
$ vitest run "test/formalites-permissions.test.ts" "test/formalites-authorization-context.test.ts" "--reporter=verbose"

 RUN  v4.1.9 D:/working/yuta/yuta-resto/apps/backoffice

 ✓ test/formalites-permissions.test.ts > formalites.read > allows OWNER independently 3ms
 ✓ test/formalites-permissions.test.ts > formalites.read > denies MANAGER with exact error 1ms
 ✓ test/formalites-permissions.test.ts > formalites.read > denies STAFF with exact error 0ms
 ✓ test/formalites-permissions.test.ts > formalites.read > denies 'public' with exact error 0ms
 ✓ test/formalites-permissions.test.ts > formalites.read > denies 'service' with exact error 0ms
 ✓ test/formalites-permissions.test.ts > formalites.read > does not elevate YUTA_ADMIN 0ms
 ✓ test/formalites-permissions.test.ts > formalites.read > does not elevate YUTA_SUPPORT 0ms
 ✓ test/formalites-permissions.test.ts > formalites.read > returns false/400 for missing establishment null 0ms
 ✓ test/formalites-permissions.test.ts > formalites.read > returns false/400 for missing establishment  0ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > allows OWNER independently 1ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > denies MANAGER with exact error 0ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > denies STAFF with exact error 0ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > denies 'public' with exact error 0ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > denies 'service' with exact error 0ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > does not elevate YUTA_ADMIN 0ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > does not elevate YUTA_SUPPORT 0ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > returns false/400 for missing establishment null 0ms
 ✓ test/formalites-permissions.test.ts > formalites.manage > returns false/400 for missing establishment  0ms
 ✓ test/formalites-permissions.test.ts > Formalites operation and Personnel isolation > has exactly two typed operations 0ms
 ✓ test/formalites-permissions.test.ts > Formalites operation and Personnel isolation > fails closed for runtime operation unknown 0ms
 ✓ test/formalites-permissions.test.ts > Formalites operation and Personnel isolation > fails closed for runtime operation personnel.employee.manage 0ms
 ✓ test/formalites-permissions.test.ts > Formalites operation and Personnel isolation > fails closed for runtime operation toString 0ms
 ✓ test/formalites-permissions.test.ts > Formalites operation and Personnel isolation > fails closed for runtime operation __proto__ 0ms
 ✓ test/formalites-permissions.test.ts > Formalites operation and Personnel isolation > fails closed for runtime operation constructor 0ms
 ✓ test/formalites-permissions.test.ts > Formalites operation and Personnel isolation > keeps independent literal grants and no Personnel delegation in Formalites blocks 1ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > returns the real resolved OWNER establishment context 6ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > rejects missing session cookie without looking up scope 2ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > preserves login redirect for upstream invalid/expired session or inactive user 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > preserves scope recovery for missing/inactive organization or establishment metadata 1ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > rejects missing membership through actual resolver 1ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > rejects inactive membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > rejects wrong user membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > rejects wrong organization membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > rejects wrong establishment membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > rejects organization-only resolution with exact 400 rather than selecting scope 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > denies valid MANAGER membership 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > denies valid STAFF membership 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > does not bypass membership/grants for YUTA_ADMIN 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > does not bypass membership/grants for YUTA_SUPPORT 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.read > ignores browser authority claims in cookies, headers and returnTo query 16ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > returns the real resolved OWNER establishment context 1ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > rejects missing session cookie without looking up scope 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > preserves login redirect for upstream invalid/expired session or inactive user 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > preserves scope recovery for missing/inactive organization or establishment metadata 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > rejects missing membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > rejects inactive membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > rejects wrong user membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > rejects wrong organization membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > rejects wrong establishment membership through actual resolver 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > rejects organization-only resolution with exact 400 rather than selecting scope 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > denies valid MANAGER membership 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > denies valid STAFF membership 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > does not bypass membership/grants for YUTA_ADMIN 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > does not bypass membership/grants for YUTA_SUPPORT 0ms
 ✓ test/formalites-authorization-context.test.ts > trusted composition: formalites.manage > ignores browser authority claims in cookies, headers and returnTo query 0ms
 ✓ test/formalites-authorization-context.test.ts > composition independence and recovery > forwards each operation without reusing another operation result 1ms
 ✓ test/formalites-authorization-context.test.ts > composition independence and recovery > does not inherit Personnel allow or call Personnel authorization 0ms
 ✓ test/formalites-authorization-context.test.ts > composition independence and recovery > preserves safeReturnTo sanitization 0ms
 ✓ test/formalites-authorization-context.test.ts > composition independence and recovery > propagates infrastructure failure instead of returning authorized context 0ms

 Test Files  2 passed (2)
      Tests  59 passed (59)
   Start at  23:05:05
   Duration  536ms (transform 219ms, setup 0ms, import 367ms, tests 47ms, environment 0ms)
```

## Limitations

These are executable authorization/composition tests, NOT database integration.
Upstream null-session/null-metadata results simulate existing rejected states;
they do not prove live SQL filtering, real-cookie security or browser navigation.
Public/service denial is evaluated at the typed guard boundary; no new public or
service endpoint exists. Operation-independence injection is a test-only
controlled evaluator, not a changed Product grant map. All other context cases
exercise actual guards/resolver. No production authorization claim is made.
