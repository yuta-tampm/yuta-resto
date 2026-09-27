# Live Tower Selection Authority Binding — bounded Design proposal

- Change: `federated-control-towers-foundation`
- Status: `AWAITING_HUMAN_REVIEW` — proposal only; no Design, Sensitive Design, Tasks/TIC, helper or live authority is approved by this packet.
- Bridge command: `BRIDGE-ARCH-20260925-F9R2:128`
  Trigger: material Human Gate bypass/misbinding risk B recorded in `03u-phase5-implementation-correction-blocker.md` SHA-256 `3379117427a764fb0c71e7c45add96759a590ac472ec677fb15e491a084d5629`.

## Finding and exact source boundary

Design D1, D4, D6 and D8 require a Human or reviewed-workflow choice of the exact context, Page/Global role and scope, conversation instance and fresh run before executable activation. Spec F2/F4/F5 already requires exact role/instance binding, single active authority and explicit Human/reviewed-workflow target selection. Current Design D3 provides a machine-readable one-way Human decision chain, but its immutable `APPROVAL_TOKEN_MAPPING_VERSION=1` and exact helper verifier accept only evaluator material classification, positive budget maximum exception and budget freeze transition. None proves a live tower choice. `AUTHORIZATION_REFERENCE`, a caller JSON field, title, handoff, probe, or `DECISION_SOURCE=CURRENT_USER` string cannot close this gap. RC1 would otherwise permit an unverified choice to reach `ACTIVE`; that is material risk B, not an ordinary implementation detail. This is a targeted security-sensitive Design gap, not a new Product decision or Spec requirement.

Current baselines: Design `a95090df877f582f35c8743913ae0569144c6e7589676c573e97909bcf8c7c77`; Spec `a7596e0cc7286afcad959a951e3250fd649d850949721cd565e8542ec90301c0`; Tasks/TIC `822aeb0d8fa25327eaf294bee0a36362e2f01905d5adc036006542eeccebc0da`; helper `c8a9086991bb4dd9e43be006bb80c3a1a27e1af5679d340e317272bb63c12719`. Historical T18 `03r` and T19 `03s` remain `FAIL`, hashes `9bf01c74a952df9beede6c6e4e9799f110039e1b9ac9dfc51999c49e9d2bda7c` and `1d5957902bd809688759155f77a4a6f7fa96b82202f738186d77782ba3985775`.

## Proposed minimum typed authority

Add exactly one `DECISION_TYPE: LIVE_TOWER_SELECTION` to the existing chain. This authorizes **one exact activation transaction**, not Product work, Apply, a browser send, a side effect, or a later command. Its pre-Human `DECISION_ID` is also the sole stable selection-request identity; no second `SELECTION_REQUEST_ID`, `ACTIVATION_REQUEST_ID` or `APPLICATION_ID` is introduced. The later Bridge activation command carries this exact `DECISION_ID` as an input and must be separately authorized for its own action. It does not need a future `COMMAND_ID` in the descriptor. An unknown future command/hash in the descriptor would be circular; the exact run, target, action and source-state binding below constrain any later command to this one transaction, and the command ledger separately enforces its own `COMMAND_ID` at most once.

The existing exact descriptor envelope remains unchanged. For this type its repeated `EXECUTION_CONTEXT_ID` and `CAUSAL_LINEAGE_ID` equal the scope; its `BUCKET_KEY` is `NONE`; `PURPOSE_REFERENCE` is the canonical reviewed selection proposal reference. Its exact `DECISION_SCOPE` retains the current four-field common shape:

```json
{
  "BUDGET_TYPE": "NONE",
  "BUCKET_KEY": "NONE",
  "CAUSAL_LINEAGE_ID": "<reviewed non-NONE work lineage>",
  "EXECUTION_CONTEXT_ID": "<approved context>"
}
```

No budget is granted by these `NONE` sentinels. For first activation, the reviewed non-`NONE` lineage is proposed before the source `INACTIVE` snapshot establishes a lineage; `ACTIVATION_INTENT` must establish exactly that lineage and its zero-used default budgets. For an established source lineage, the decision must match it exactly. All target-specific values are in the following exact `PROPOSED_DECISION_PAYLOAD`; both scope and payload are included in `DECISION_ID`. `TOWER_ID` is the structured D3 role/scope/owner tuple, not a title-derived token. `CONTROL_TOWER_INSTANCE` must equal `CONVERSATION_ID`. `OWNING_PAGE_CHAT_ID` is the exact approved owner for Page, and `NONE` for Global. `CONVERSATION_URL` is the exact selected ChatGPT Project/conversation URL; title is comparison metadata and must still match visibly before each send.

```json
{
  "INTENDED_ACTION": "FIRST_ACTIVATION|PAGE_ROTATION|GLOBAL_ROTATION|PAGE_TO_GLOBAL_ESCALATION|REACTIVATION",
  "EXPECTED_SOURCE_RECORD_HASH": "<lowercase SHA-256 of reviewed activation snapshot>",
  "EXPECTED_SOURCE_STATE": "INACTIVE|ACTIVE|TERMINAL|REVOKED",
  "EXPECTED_SOURCE_EPOCH": 0,
  "TARGET_ACTIVATION_EPOCH": 1,
  "TARGET_RUN_ID": "<fresh run>",
  "TARGET_TOWER": {
    "TOWER_ID": {
      "CONTROL_TOWER_ROLE": "PAGE_CONTROL_TOWER|GLOBAL_CONTROL_TOWER",
      "CONTROL_TOWER_SCOPE": "<exact approved scope>",
      "OWNING_PAGE_CHAT_ID": "<exact Page Chat ID or NONE>"
    },
    "CONTROL_TOWER_ROLE": "PAGE_CONTROL_TOWER|GLOBAL_CONTROL_TOWER",
    "CONTROL_TOWER_SCOPE": "<exact approved scope>",
    "OWNING_PAGE_CHAT_ID": "<exact Page Chat ID or NONE>",
    "CONTROL_TOWER_INSTANCE": "<exact conversation ID>",
    "PROJECT_ID": "<exact Project ID>",
    "CONVERSATION_ID": "<exact conversation ID>",
    "CONVERSATION_TITLE": "<exact selected title>",
    "CONVERSATION_URL": "<exact selected URL>"
  },
  "REVIEWED_SELECTION_ARTIFACT_PATH": "<checkout-relative immutable review packet>",
  "REVIEWED_SELECTION_ARTIFACT_SHA256": "<lowercase SHA-256>"
}
```

The displayed alternatives above are type enumerations, never literal runtime values. The final Design must specify the exact D3 `TOWER_ID` structured serialization and all field/value constraints without adding a second equivalent identity. `TARGET_ACTIVATION_EPOCH` equals source epoch +1 for `INACTIVE`/`TERMINAL`/`REVOKED`, or source epoch +2 after the required `ACTIVE→FENCING→TERMINAL|REVOKED` fence. The reviewed source record hash/epoch must be the exact current snapshot when the decision is consumed. Any drift before consumption is stale and requires a new review; no timestamp or renamed title restores freshness. A Page owner/impact classification and Global escalation reason must be supported by the referenced reviewed selection artifact and checked against D1/D6; the helper verifies references and values, not Product reasoning.

`DECISION_ID = lowercase SHA-256(CANONICAL_JSON_V1({DECISION_TYPE,DECISION_SCOPE,PROPOSED_DECISION_PAYLOAD}))`, using existing D3 recursive key sorting and exact bytes. It is known before Human approval and later matched by the activation command. The same semantic content produces the same ID and cannot authorize a second activation. A fresh run, changed instance, role, scope, source state or reviewed artifact requires a new descriptor and Human decision; changing a title alone grants nothing.

## Accepted result, token and one-time consumption

The existing `PRE_DECISION_DESCRIPTOR → accepted HUMAN_GATE_RESULT → ACCEPTED_GATE_RESULT_RECORD → APPROVAL_RECORD → SEMANTIC_DECISION_RECORD → CONSUMED_AUTHORITY_PROOF_V1` order and paths remain. Extend the private immutable token mapping to **version 2** by adding only `LIVE_TOWER_SELECTION → APPROVE_LIVE_TOWER_SELECTION`; the three version-1 mappings retain their exact tokens and meaning. Version 1 remains a historical mapping; no caller-configurable token or alias is accepted. The runtime gate must present this descriptor path/hash, exact reviewed selection packet path/preapproval SHA-256, scope and payload. The bound `RESULT_CORE_V1` must have `STATUS: COMPLETED`, exact `CURRENT_USER_DECISION: APPROVE_LIVE_TOWER_SELECTION`, valid run/round/command/item/lineage and packet hash. The accepted-result record remains the sole machine-readable source for that result. The immutable approval record binds the same ID/item/type/scope/result and packet bytes; the later semantic record binds the same payload and exact approval-record hash. Existing exact record schemas, ID/hash formulas and causal recording order remain unchanged. A review prose statement, a generic reference and a syntactically well-formed but unaccepted result have zero authority. This inherits the approved workflow/repository provenance trust boundary, not cryptographic Human attestation.

`CONSUMED_AUTHORITY_PROOF_V1` retains its exact eight fields. The new type is consumed once under the existing exclusive lock through one `AUTHORITY_CONSUMED` journal event with a complete `STATE_PAYLOAD` and exactly one new proof. Journal flush/read-back is the replay-prevention commit; snapshot replacement/read-back follows before any dependent operation. For this type the post-state keeps the old activation role/run/state and all budgets/freezes intact, appending only the proof and ordinary revision/journal metadata. It does **not** grant ACTIVE. The subsequent fenced/activation transaction must match this proof's resolved exact semantic target, run, source ancestor and intended action. `AUTHORIZATION_REFERENCE` remains the existing six-field provenance metadata and may point to the semantic record after activation intent; it is never sufficient authority without the consumed proof. No new top-level journal field, activation projection field, handoff field or proof field is proposed.

The selection proof authorizes exactly the first matching `ACTIVATION_INTENT` sequence for its approved target/run. A consumed ID cannot start another sequence. If the source was ACTIVE, old authority must be fenced and terminal under the same lock before target `ACTIVATING`; the immutable handoff must carry the exact proof set and match the approved target and reserved run. Same-role Page/Global rotation and Page→Global escalation each require a **new** live-selection decision and fresh target run; a handoff merely carries prior proofs. A Page selection cannot be used for Global, a different Page, context, Project, conversation, instance or run. A probe is separately required in the exact target conversation while non-executable `ACTIVATING`, followed by `ACTIVE_COMMIT` only after complete valid handshake→command→result→evaluation evidence. Human approval does not prove the probe; the probe does not prove Human approval. The selected Control Tower conversation ID is decision data, not a hardcoded global target. PAGE_LOCAL Product/shaping stays with its Page Chat.

If the journal flush completes but snapshot replacement is interrupted, recovery under lock reconstructs the exact committed proof/post-state and never consumes the approval again. If that committed proof has no activation intent yet, bounded recovery may continue **the same** target/run transaction only after exact source, packet, proof, command ledger and no-pending-execution checks; it may not select a new target or issue a browser command automatically. If an activation intent/probe may have occurred, existing D6 crash and uncertain-delivery rules govern; no replay, no automatic `ACTIVE`, and any restarted activation requires the prescribed fresh run and, when target/run changes, a fresh decision. A completed, abandoned or terminal activation makes its selection proof permanently non-reusable. Missing, corrupt, conflicting, stale or partially written proof/journal/record evidence yields zero new executable authority and `BLOCKED`/`NEEDS_REVIEW`. SelfTest fixtures stay outside canonical live authority paths and cannot pass this production proof check.

## Planning delta and review boundary

- **Spec Gate 2:** no change. F2/F4/F5/F6/F7/F8 already demand exact target, Human/reviewed-workflow selection, one executable authority, fencing and non-authorizing handoff.
- **Design:** targeted D1/D3/D4/D6/D8 additions for this typed scope/payload, private token version, proof consumption before activation, source/target/run checks, restart and transfer behavior. Existing budget, freeze and material-classification semantics remain byte-for-byte in meaning.
- **Sensitive Design:** required because a missing or forged Human selection can create executable authority. Review replay, source drift, crash, role/context/target substitution and single-active behavior before implementation.
- **Tasks/TIC:** add focused RC1/RC2 dependency and negative tests for wrong token, target/role/instance/run/context, stale source, duplicate proof, interrupted commit and handoff; no new task or phase authorization.
- **Implementation owners:** after separate approval, the existing three-owner allowlist is sufficient in principle: helper enforces typed proof and lock transaction; skill and tracked protocol expose the exact bounded handshake/selection workflow. Immutable authority records under the existing review `decisions/` data paths are evidence artifacts, not new implementation owners. No owner is changed by this packet.
- **Privacy:** persist only bounded context, role/scope, Page Chat/conversation/Project IDs, run, state/epoch, reviewed path/hash, decision/result/proof IDs and journal references. No transcript, customer content, private chat content, credential, token, cookie or session.

No Bridge v1 wire grammar, Workflow v3 authority, Page Chat prompt/rules, Product code, API, auth, database/schema, business logic, distributed locking or global Project Instructions change is proposed. No formal T18/T19 reassessment or Q01–Q35 Browser QA was run. RC1 remains `BLOCKED`, RC2 `NOT_STARTED`, Phase 6 `NOT_AUTHORIZED`, Gate 3 `NOT_READY`.

**Next Human boundary:** targeted Design review for this exact packet first; targeted Sensitive Design and Tasks/TIC reviews follow separately. Proposed Design decision labels, subject to the Control Tower's exact gate issue, are `APPROVE LIVE TOWER SELECTION AUTHORITY BINDING DESIGN`, `REQUEST LIVE TOWER SELECTION AUTHORITY BINDING DESIGN CHANGES`, and `DEFER LIVE TOWER SELECTION AUTHORITY BINDING DESIGN`, with exact machine tokens `APPROVE_LIVE_TOWER_SELECTION_AUTHORITY_BINDING_DESIGN`, `REQUEST_LIVE_TOWER_SELECTION_AUTHORITY_BINDING_DESIGN_CHANGES`, and `DEFER_LIVE_TOWER_SELECTION_AUTHORITY_BINDING_DESIGN`. These planning labels do not authorize a runtime live selection or RC1/RC2. The Human Gate is **not opened** by this packet.
