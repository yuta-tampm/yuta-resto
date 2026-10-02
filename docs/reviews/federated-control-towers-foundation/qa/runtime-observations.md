# Phase 6 bounded runtime observations

Date: 2026-09-27 00:50 UTC  
Bridge command: `BRIDGE-FRESHGATE-20260927-C11790A1:14`  
Scope: read-only preflight, existing-state inspection, local lock contention, browser target observation, privacy inspection. This file contains no chat transcript, credential, token, cookie or session content.

## Target and authority

- In-app browser exposed one selected tab titled `YUTA — Control Tower`, Project ID `g-p-6a4d778944108191894f8e3657742da4`, conversation ID `6ab40aa1-ea94-83eb-85be-dafbbef3ddef`, URL `https://chatgpt.com/g/g-p-6a4d778944108191894f8e3657742da4-yuta-sarl/c/6ab40aa1-ea94-83eb-85be-dafbbef3ddef`. The complete round-14 command was visible in that exact tab and was not yet answered during these observations.
- Human selected existing Page Chat `Avis & commentaires v`, conversation ID `6a760691-3674-83eb-9347-9e4ef8c60acf`, for safe read-only PAGE_LOCAL QA identity. This selection is not a `LIVE_TOWER_SELECTION` authority proof, does not update the live Page operating context and does not transfer Page Product authority. Codex did not open or access it.
- Round-12 Phase 6 authorization is distinct from a later exact live Page tower selection. Historical round-13 preflight stopped before QA. Round-14 used the actual T19 SHA-256 `e24761b6c7b8d7b122dd4cad49fafe981e817fefb1c06d6e30104a74abc747a2`; the prior 63-character value was a reporting typo, with no 04p edit.

## Commands and observed outcomes

All shell commands ran from `D:\working\yuta\yuta-resto`. `$helper` below is `.agents/skills/yuta-federated-control-towers/scripts/state-helper.ps1`. The existing live context ID is `FEDERATED-CONTROL-TOWERS-FOUNDATION` and host label is `DESKTOP-2SON6M9`.

1. `Get-FileHash -Algorithm SHA256 docs/reviews/federated-control-towers-foundation/04p-fresh-t19-formal-verify.md` → `e24761b6c7b8d7b122dd4cad49fafe981e817fefb1c06d6e30104a74abc747a2`.
2. `& $helper -Action Preflight -ExpectedCheckoutRoot 'D:\working\yuta\yuta-resto' -ExpectedHostLabel $env:COMPUTERNAME -ExecutionContextId 'FEDERATED-CONTROL-TOWERS-FOUNDATION'` → Windows/NTFS/current checkout valid; `RuntimeStateCreated=false`, `LockAcquired=false`.
3. `& $helper -Action ValidateActivation -Json (Get-Content tmp/yuta-federated-control-towers/FEDERATED-CONTROL-TOWERS-FOUNDATION/activation.json -Raw) -ExpectedCheckoutRoot 'D:\working\yuta\yuta-resto' -ExpectedHostLabel $env:COMPUTERNAME -ExecutionContextId 'FEDERATED-CONTROL-TOWERS-FOUNDATION'` → valid. The same `ValidateJournal` action over 12 existing journal files → 12/12 valid.
4. Read-only `Preflight` with `C:\wrong-checkout` → `Checkout root mismatch`; with `WRONG_HOST` → `Host label mismatch`; both returned no state creation. `ValidateActivation -Json '{'` → `Malformed JSON`, `Valid=false`. These are negative input checks, not real corrupt-state crash QA.
5. A PowerShell process (PID 20240) opened the pre-existing live context `lock` file with `FileMode.Open`, `FileAccess.ReadWrite`, `FileShare.None` for 22 seconds. An independent process (PID 11808) attempted the same open while held and received `IOException`/sharing violation. After the holder exited normally, another process acquired and released that same lock. Activation SHA-256 stayed `5a3e39a237a5473f1c72608dbf1c571d3d6cb93d0e74493b9e90e4d8c331ca84` across the contention and release. This proves observed local lock exclusion and release only; it is not a two-activation test or crash/stale-owner recovery.
6. Existing activation snapshot: `ACTIVE`, epoch 2, revision 11, run `FED-LIVE-20260927-RC1-B1`, lineage `BRIDGE-FEDERATED-CONTROL-TOWERS-ARCH`, `RESPONSE_COMPLETE`, `COMPLETED`, two consumed authority proofs, recovery budget 0/2. No new runtime revision was written.
7. Recursive inspection of the existing activation plus 12 journal JSON files found zero key names matching transcript, customer content, credential, access/refresh token, cookie, session or private chat; 870 string values were checked for bearer/JWT-like values, email addresses, cookie headers and private-content markers, with zero hits. Longest string length was 107. This is bounded pattern inspection of current real local records, not proof about future records or arbitrary unknown content.

## Limits

No Page Chat was opened, no live Page tower was activated, no Page or Global transfer/rotation was performed, no crash or delivery interruption was induced, no consumed authority was replayed, and no command was resent. Prior 04m live Global RC1/RC2 supports the history but does not replace Phase 6 case evidence. Current ignored runtime state and historical T18/T19 evidence remain unchanged. The Phase 6 report and matrix are the only new repository artifacts.
