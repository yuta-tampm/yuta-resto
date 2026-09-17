Update `YUTA — Control Tower Operating Prompt v3` to `v3.1`.

This is a bounded operating-prompt hardening only.

Do NOT change YUTA Workflow v3 stages or normative authority.

Preserve the current structure and existing sections unless required by the
changes below.

Required changes:

1. Add Existing OpenSpec Change / Current Workflow State / Current Evidence State
   intake before creating or continuing a change.

2. Correct the post-Gate-3 lifecycle sequence to:

   Gate 3
   → Human Approval
   → $yuta-finish-change
   → Sync
   → Validate Main Specs
   → Archive
   → Knowledge Consolidation
   → Done

3. Update Gate 3 acceptance semantics to support:

   PASS
   PASS_WITH_KNOWN_LIMITATIONS
   valid NOT_APPLICABLE for QA where appropriate

   Known limitations must never hide an established implementation/behavioral
   failure or be relabeled PASS.

4. Add an Anti-loop / Evidence Stop Rule:

   Do not repeatedly cycle
   attribution → correction → revalidation
   for the same evaluator/runtime/tooling limitation.

   After bounded investigation/correction/retry, unresolved evaluator/runtime
   limitations without an established implementation failure should be recorded
   as KNOWN_EVIDENCE_LIMITATION when approved criteria permit continuation.

5. Add a Historical Truth Rule:

   - do not reconstruct missing historical artifacts as though they existed;
   - do not relabel historical FAIL/BLOCKED evidence;
   - do not create changes merely to make workflow tooling green;
   - missing lifecycle history requires explicit Control Tower governance.

6. Add Finish / Closure Integrity rules:

   - verify active change and lifecycle inputs before `$yuta-finish-change`;
   - missing original OpenSpec change blocks normal closure;
   - present-day lifecycle reconciliation is permitted only when explicitly
     authorized by Control Tower;
   - reconciliation must never impersonate original history.

7. Add evidence-disposition vocabulary:

   CURRENT_BEHAVIORAL_PASS
   CURRENT_DETERMINISTIC_SUFFICIENT
   NO_FRESH_RUN_REQUIRED_NO_MATERIAL_DEPENDENCY
   KNOWN_EVIDENCE_LIMITATION
   DEFERRED_SECURITY_CLAIM
   BLOCKED
   FAIL
   INVALID_EVIDENCE

   Make clear these are not all equivalent to PASS.

8. Preserve:

   - Capability map
   - Authority map
   - OpenSpec Strategy A/B/C
   - Gate 1
   - Gate 2
   - Sensitive Design Gate
   - TIC / Technical Compliance Matrix
   - QA coordination
   - Knowledge Consolidation
   - Release/Deploy lane
   - Review routing
   - final authority-layer model

Do not introduce new workflow stages.

Do not modify `YUTA_WORKFLOW_V3.md` semantics.

Return:
- exact changed sections;
- rationale for each;
- confirmation that no workflow stage was added or removed.