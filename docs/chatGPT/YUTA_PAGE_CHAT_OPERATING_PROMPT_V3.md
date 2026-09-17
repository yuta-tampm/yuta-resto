Update `YUTA — Page Chat Operating Prompt v3` to `v3.1`.

This is a bounded operating-prompt hardening only.

Do NOT change YUTA Workflow v3 stages or normative authority.

Preserve the current page-local / cross-module routing model.

Required updates:

1. Add an Existing Change / Workflow State / Evidence State check before creating
   or continuing OpenSpec work.

   Include:

   Existing OpenSpec change:
   YES / NO / UNKNOWN

   Current workflow state:
   IDEA / DISCOVERY / PROPOSAL / ANALYSIS / GATE 1 / SPECS / GATE 2 /
   DESIGN / TASKS / APPLY / VERIFY / QA / GATE 3 / FINISH / ARCHIVED /
   DONE / UNKNOWN

   Current evidence state:
   implementation / VERIFY / QA / known limitations / historical FAIL-BLOCKED.

   Do not create a new change merely because a new chat lacks context.

2. Update Gate 3 semantics to allow:

   TECHNICAL IMPLEMENTATION COMPLIANCE:
   PASS or PASS_WITH_KNOWN_LIMITATIONS

   VERIFY:
   PASS or PASS_WITH_KNOWN_LIMITATIONS

   QA:
   PASS / PASS_WITH_KNOWN_LIMITATIONS / valid NOT_APPLICABLE

   Known limitations must never hide established implementation/behavioral
   failures or be relabeled PASS.

3. Add an Evidence / Revalidation Stop Rule:

   Do not repeatedly cycle
   attribution → correction → revalidation
   for the same evaluator/runtime/tooling limitation.

   After bounded investigation/correction/retry, unresolved evaluator/runtime
   limitations without an established implementation failure should be recorded
   as KNOWN_EVIDENCE_LIMITATION when approved criteria permit continuation.

4. Add a Historical Truth Rule:

   - do not reconstruct missing lifecycle artifacts as though they previously
     existed;
   - do not relabel historical FAIL/BLOCKED evidence;
   - do not create an OpenSpec change merely to make tooling green;
   - missing lifecycle history must be escalated to Control Tower;
   - present-day reconciliation requires explicit Control Tower authorization.

5. Add Finish / Closure Integrity rules:

   - after Gate 3 + human approval, use `$yuta-finish-change`;
   - verify active change and required lifecycle inputs exist;
   - if finish is blocked by missing canonical lifecycle artifacts, do not
     reconstruct history or skip Sync/Archive;
   - classify as FINISH_CHANGE_BLOCKED or
     LIFECYCLE_RECONCILIATION_REQUIRED and hand off to Control Tower.

6. Expand Control Tower routing so lifecycle/governance issues also escalate even
   when the implementation itself is PAGE_LOCAL.

   Examples:
   - missing original OpenSpec change;
   - missing archive/lifecycle record;
   - required governance exception;
   - present-day reconciliation;
   - ambiguous finish/archive chronology.

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

8. Preserve unchanged:

   - Mandatory Cross-Module Impact Check
   - PAGE_LOCAL / CROSS_MODULE / UNCERTAIN routing
   - Conditional Discovery/Shaping
   - Workflow v3 stage order
   - Gate 1 / Gate 2
   - Sensitive Design Gate
   - Browser QA requirement for UI_AFFECTING changes
   - Technical Implementation Contract
   - Technical Compliance Matrix
   - Knowledge Consolidation
   - Release/Deploy separation
   - Second-Line Protection
   - final authority-layer model

Do not introduce new workflow stages.

Do not modify `YUTA_WORKFLOW_V3.md` semantics.

Return:
- exact changed sections;
- rationale for each;
- confirmation that no workflow stage was added or removed.