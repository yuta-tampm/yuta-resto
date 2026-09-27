# Single-host federated state helper. Live actions require an independently
# approved exact tower selection; synthetic contexts never grant live authority.
[CmdletBinding()]
param(
    [ValidateSet('Preflight', 'DescribeSchemas', 'ValidateActivation', 'ValidateJournal', 'ValidateHandoff', 'SelfTest', 'LockProbe', 'LockHold', 'ReconcileLiveReadOnly', 'InitializeFixture', 'ReconcileFixture', 'AdvanceFixture', 'RecordFixtureProbe', 'RecordFixtureCommand', 'MarkFixtureDelivery', 'PersistFixtureHandoff', 'SupersedeFixtureHandoff', 'ConsumeFixtureAuthority', 'InitializeLiveContext', 'RunLiveSelection', 'TerminalizeUncertainLiveSelection', 'PrepareHistoryPreservingRetry')]
    [string]$Action = 'DescribeSchemas',
    [string]$Json,
    [string]$ExpectedCheckoutRoot,
    [string]$ExpectedHostLabel,
    [string]$ExecutionContextId,
    [ValidateRange(0, 120)]
    [int]$HoldSeconds = 0,
    [ValidateSet('ACTIVATING','ACTIVE','FENCING','TERMINAL','REVOKED')]
    [string]$NextState,
    [string]$NewRunId,
    [string]$RunId,
    [int]$RoundId,
    [string]$CommandId,
    [string]$HandoffId,
    [ValidateSet('COMPLETE','FAILED','ACCEPTED_ONLY','EXECUTING_ONLY')]
    [string]$FixtureOutcome = 'COMPLETE',
    [string]$EvaluatorBucketKey,
    [string]$EvaluatorStageKey,
    [string]$EvaluatorPurposeKey,
    [string]$MaterialEquivalenceReference,
    [string]$DecisionId,
    [string]$ExpectedRecordHash,
    [switch]$FixtureSameBlockerObserved,
    [switch]$ProbeIntentOnly,
    [ValidateSet('PAGE_CONTROL_TOWER','GLOBAL_CONTROL_TOWER')]
    [string]$TargetRole,
    [string]$TargetScope,
    [string]$TargetOwningPageChatId,
    [string]$TargetProjectId,
    [string]$TargetConversationId,
    [string]$TargetTitle,
    [string]$ObservedProjectId,
    [string]$ObservedConversationId,
    [string]$ObservedTitle,
    [string]$ObservedUrl,
    [string]$ProbeTraceJson,
    [ValidateSet('AVAILABLE','PARTIAL','UNKNOWN','NOT_APPLICABLE')]
    [string]$PageContextIntake,
    [string]$PageContextSourceReference,
    [string]$PageContextCompleteness,
    [string[]]$PageContextGaps = @()
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$activationFields = [ordered]@{
    SCHEMA_VERSION = 'integer'; EXECUTION_CONTEXT_ID = 'string'; MODE = 'string'
    REVISION = 'integer'; PREVIOUS_RECORD_HASH = 'nullable-string'; RECORD_HASH = 'string'; LAST_EVENT_HASH = 'nullable-string'
    ACTIVATION_EPOCH = 'integer'; STATE = 'string'; HOST_LABEL = 'string'; CHECKOUT_ROOT = 'string'
    HELPER_INVOCATION_ID = 'string'; OWNER_PID = 'integer'; OWNER_START_UTC = 'string'
    TOWER_ID = 'nullable-object'; CONTROL_TOWER_ROLE = 'nullable-string'; CONTROL_TOWER_SCOPE = 'nullable-string'
    OWNING_PAGE_CHAT_ID = 'nullable-string'; CONTROL_TOWER_INSTANCE = 'nullable-string'; PROJECT_ID = 'nullable-string'
    CONVERSATION_ID = 'nullable-string'; CONVERSATION_TITLE = 'nullable-string'; CONVERSATION_URL = 'nullable-string'
    ACTIVE_RUN_ID = 'nullable-string'; CAUSAL_LINEAGE_ID = 'nullable-string'; RUN_BINDING = 'array'
    LAST_ACCEPTED_COMMAND_ID = 'nullable-string'; LAST_RESULT_IDENTITY = 'nullable-object'
    DELIVERY_STATE = 'string'; EXECUTION_STATE = 'string'; RECOVERY_BUDGET = 'object'; EVALUATOR_BUDGET = 'object'
    EVIDENCE_STOP_STATE = 'string'; BLOCKERS = 'array'; KNOWN_LIMITATIONS = 'array'
    AUTHORIZATION_REFERENCE = 'nullable-object'; APPROVAL_REFERENCES = 'array'; ARTIFACT_HASHES = 'array'
    CURRENT_ACTIVE_FREEZES = 'array'; CONSUMED_AUTHORITY_PROOFS = 'array'
    CURRENT_HANDOFF_ID = 'nullable-string'; CONSUMED_HANDOFF_IDS = 'array'
    CREATED_AT_UTC = 'string'; UPDATED_AT_UTC = 'string'
}
$handoffFields = [ordered]@{
    HANDOFF_VERSION = 'integer'; HANDOFF_ID = 'string'; EXECUTION_CONTEXT_ID = 'string'; CREATED_AT_UTC = 'string'
    SOURCE_ACTIVATION_EPOCH = 'integer'; TARGET_ACTIVATION_EPOCH = 'integer'; SOURCE_RECORD_HASH = 'string'
    HANDOFF_HASH = 'string'; SOURCE_TOWER = 'object'; TARGET_TOWER = 'object'
    SOURCE_RUN_ID = 'string'; SOURCE_ROUND_ID = 'integer'; SOURCE_COMMAND_ID = 'string'; TARGET_RUN_ID = 'string'
    CAUSAL_LINEAGE_ID = 'string'; WORKFLOW_STATE = 'object'; DELIVERY_STATE = 'string'; EXECUTION_STATE = 'string'
    EVIDENCE_STOP_STATE = 'string'; RECOVERY_BUDGET = 'object'; EVALUATOR_BUDGET = 'object'
    APPROVAL_REFERENCES = 'array'; ARTIFACT_HASHES = 'array'; EVIDENCE_REFERENCES = 'array'
    CURRENT_ACTIVE_FREEZES = 'array'; CONSUMED_AUTHORITY_PROOFS = 'array'
    PRODUCT_PROVENANCE = 'object'; BLOCKERS = 'array'; KNOWN_LIMITATIONS = 'array'; NEXT_CANDIDATE_ACTION = 'object'
}
$journalFields = [ordered]@{
    SCHEMA_VERSION = 'integer'; REVISION = 'integer'; EVENT_ID = 'string'; EVENT_KIND = 'string'
    EXECUTION_CONTEXT_ID = 'string'; ACTIVATION_EPOCH = 'integer'; TOWER_ID = 'nullable-object'
    RUN_ID = 'string'; ROUND_ID = 'nullable-integer'; COMMAND_ID = 'string'; PREVIOUS_EVENT_HASH = 'nullable-string'
    PREVIOUS_RECORD_HASH = 'nullable-string'; STATE_PAYLOAD = 'object'
    CREATED_AT_UTC = 'string'; AUTHORIZATION_REFERENCE = 'nullable-object'; EVIDENCE_REFERENCES = 'array'; EVENT_HASH = 'string'
}
$statePayloadFields = [ordered]@{}
foreach ($field in $activationFields.Keys) {
    if ($field -cnotin @('RECORD_HASH', 'LAST_EVENT_HASH')) { $statePayloadFields[$field] = $activationFields[$field] }
}
$towerIdFields = [ordered]@{ CONTROL_TOWER_ROLE = 'string'; CONTROL_TOWER_SCOPE = 'string'; OWNING_PAGE_CHAT_ID = 'string' }
$towerFields = [ordered]@{
    TOWER_ID = 'object'; CONTROL_TOWER_ROLE = 'string'; CONTROL_TOWER_SCOPE = 'string'; OWNING_PAGE_CHAT_ID = 'string'
    PROJECT_ID = 'string'; CONTROL_TOWER_INSTANCE = 'string'; CONVERSATION_ID = 'string'; CONVERSATION_TITLE = 'string'
}
$liveTowerFields = [ordered]@{
    TOWER_ID = 'object'; CONTROL_TOWER_ROLE = 'string'; CONTROL_TOWER_SCOPE = 'string'
    OWNING_PAGE_CHAT_ID = 'string'; CONTROL_TOWER_INSTANCE = 'string'; PROJECT_ID = 'string'
    CONVERSATION_ID = 'string'; CONVERSATION_TITLE = 'string'; CONVERSATION_URL = 'string'
}
$runBindingFields = [ordered]@{
    RUN_ID = 'string'; ACTIVATION_EPOCH = 'integer'; TOWER_ID = 'object'; CONTROL_TOWER_INSTANCE = 'string'
    PROJECT_ID = 'string'; CONVERSATION_ID = 'string'; STATE = 'string'
}
$resultIdentityFields = [ordered]@{
    RUN_ID = 'string'; ROUND_ID = 'integer'; COMMAND_ID = 'string'; CAUSAL_LINEAGE_ID = 'string'; STAGE = 'string'; RESULT_HASH = 'string'
}
$recoveryBudgetFields = [ordered]@{
    CAUSAL_LINEAGE_ID = 'string'; ATTEMPTS_USED = 'integer'; APPROVED_MAXIMUM = 'integer'; EVIDENCE_REFERENCES = 'array'
}
$evaluatorBudgetFields = [ordered]@{ CAUSAL_LINEAGE_ID = 'string'; BUCKETS = 'array' }
$evaluatorBucketFields = [ordered]@{
    BUCKET_KEY = 'string'; STAGE_KEY = 'string'; PURPOSE_KEY = 'string'
    MATERIAL_EQUIVALENCE_REFERENCE = 'string'; EXECUTION_GENERATIONS_USED = 'integer'
    APPROVED_MAXIMUM = 'integer'; EVIDENCE_REFERENCES = 'array'; PENDING_COMMAND_ID = 'nullable-string'
}
$approvalFields = [ordered]@{
    DECISION_SOURCE = 'string'; DECISION = 'string'; SCOPE = 'string'; ARTIFACT_PATH = 'string'
    ARTIFACT_SHA256 = 'string'; DECIDED_AT_UTC = 'string'
}
$artifactFields = [ordered]@{ PATH = 'string'; SHA256 = 'string' }
$decisionScopeFields = [ordered]@{ BUDGET_TYPE = 'string'; BUCKET_KEY = 'nullable-string'; CAUSAL_LINEAGE_ID = 'string'; EXECUTION_CONTEXT_ID = 'string' }
$activeFreezeFields = [ordered]@{ DECISION_SCOPE = 'object'; FREEZE_ID = 'string'; RECORD_VERSION = 'integer' }
$consumedProofFields = [ordered]@{
    APPROVAL_RECORD_ID = 'string'; APPROVAL_RECORD_SHA256 = 'string'; DECISION_ID = 'string'
    DECISION_ITEM_ID = 'string'; DECISION_TYPE = 'string'; RECORD_VERSION = 'integer'
    RESULT_HASH = 'string'; SEMANTIC_DECISION_RECORD_SHA256 = 'string'
}
$consumedProofEntryFields = [ordered]@{ CONSUMED_AUTHORITY_PROOF = 'object'; CONSUMED_AUTHORITY_PROOF_SHA256 = 'string' }
$decisionTokens = @{
    EVALUATOR_BUCKET_CLASSIFICATION = 'APPROVE_EVALUATOR_BUCKET_CLASSIFICATION'
    BUDGET_MAXIMUM_EXCEPTION = 'APPROVE_BUDGET_MAXIMUM_EXCEPTION'
    BUDGET_EXECUTION_FREEZE_TRANSITION = 'APPROVE_BUDGET_EXECUTION_FREEZE_TRANSITION'
    LIVE_TOWER_SELECTION = 'APPROVE_LIVE_TOWER_SELECTION'
}
$decisionTokenMappingVersions = @{
    EVALUATOR_BUCKET_CLASSIFICATION = 1
    BUDGET_MAXIMUM_EXCEPTION = 1
    BUDGET_EXECUTION_FREEZE_TRANSITION = 1
    LIVE_TOWER_SELECTION = 2
}

function Test-FieldType([System.Text.Json.JsonElement]$Value, [string]$Type) {
    if ($Type.StartsWith('nullable-') -and $Value.ValueKind -eq [System.Text.Json.JsonValueKind]::Null) { return $true }
    $baseType = $Type.Replace('nullable-', '')
    switch ($baseType) {
        'string' { return $Value.ValueKind -eq [System.Text.Json.JsonValueKind]::String }
        'object' { return $Value.ValueKind -eq [System.Text.Json.JsonValueKind]::Object }
        'array' { return $Value.ValueKind -eq [System.Text.Json.JsonValueKind]::Array }
        'integer' {
            $number = [long]0
            return $Value.ValueKind -eq [System.Text.Json.JsonValueKind]::Number -and $Value.TryGetInt64([ref]$number)
        }
    }
    throw "Unsupported internal schema type: $Type"
}

function Test-ExactShape([System.Text.Json.JsonElement]$Object, [System.Collections.IDictionary]$Fields, [string]$Path, [System.Collections.Generic.List[string]]$Errors) {
    if ($Object.ValueKind -ne [System.Text.Json.JsonValueKind]::Object) { $Errors.Add("$Path must be an object"); return }
    foreach ($property in $Object.EnumerateObject()) {
        if (-not $Fields.Contains($property.Name)) { $Errors.Add("$Path.$($property.Name) is unknown") }
    }
    foreach ($name in $Fields.Keys) {
        $value = [System.Text.Json.JsonElement]::new()
        if (-not $Object.TryGetProperty([string]$name, [ref]$value)) { $Errors.Add("$Path.$name is missing"); continue }
        if (-not (Test-FieldType $value $Fields[$name])) { $Errors.Add("$Path.$name has wrong type") }
    }
}

function Test-StringArray([System.Text.Json.JsonElement]$Array, [string]$Path, [System.Collections.Generic.List[string]]$Errors) {
    if ($Array.ValueKind -ne [System.Text.Json.JsonValueKind]::Array) { return }
    foreach ($item in $Array.EnumerateArray()) {
        if ($item.ValueKind -ne [System.Text.Json.JsonValueKind]::String) { $Errors.Add("$Path must contain only bounded string metadata") }
    }
}

function Test-CountedEvidence([System.Text.Json.JsonElement]$Array, [long]$Count, [string]$Path, [System.Collections.Generic.List[string]]$Errors) {
    Test-StringArray $Array $Path $Errors
    if ($Array.ValueKind -ne [System.Text.Json.JsonValueKind]::Array) { return }
    $items = @($Array.EnumerateArray())
    if ($items.Count -ne $Count) { $Errors.Add("$Path count does not match the durable budget counter") }
    $seen = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $lastRevision = [long]-1
    foreach ($item in $items) {
        if ($item.ValueKind -ne [System.Text.Json.JsonValueKind]::String) { continue }
        $reference = $item.GetString()
        if ($reference -cnotmatch '^JOURNAL:(0|[1-9][0-9]*):([A-Z][A-Z0-9_-]*)$') {
            $Errors.Add("$Path has an invalid counted journal reference")
            continue
        }
        $revision = [long]$Matches[1]
        if (-not $seen.Add($reference) -or $revision -le $lastRevision) {
            $Errors.Add("$Path has duplicate or non-chronological evidence")
        }
        $lastRevision = $revision
    }
}

function Test-BudgetShape([System.Text.Json.JsonElement]$State, [string]$Kind, [string]$CheckoutRoot, [System.Collections.Generic.List[string]]$Errors) {
    $recovery = $State.GetProperty('RECOVERY_BUDGET')
    $evaluator = $State.GetProperty('EVALUATOR_BUDGET')
    $shapeErrorCount = $Errors.Count
    Test-ExactShape $recovery $recoveryBudgetFields "`$.$Kind.RECOVERY_BUDGET" $Errors
    Test-ExactShape $evaluator $evaluatorBudgetFields "`$.$Kind.EVALUATOR_BUDGET" $Errors
    if ($Errors.Count -gt $shapeErrorCount) { return }
    $lineageElement = $State.GetProperty('CAUSAL_LINEAGE_ID')
    $lineage = if ($lineageElement.ValueKind -eq [System.Text.Json.JsonValueKind]::Null) { 'NONE' } else { $lineageElement.GetString() }
    $recoveryLineage = $recovery.GetProperty('CAUSAL_LINEAGE_ID').GetString()
    $evaluatorLineage = $evaluator.GetProperty('CAUSAL_LINEAGE_ID').GetString()
    if ($lineage -cne 'NONE' -and $lineage -cnotmatch '^[A-Z][A-Z0-9_-]*$') { $Errors.Add('Invalid causal budget lineage token') }
    if ($recoveryLineage -cne $lineage -or $evaluatorLineage -cne $lineage) { $Errors.Add('Budget lineage does not match enclosing execution context') }
    $attempts = $recovery.GetProperty('ATTEMPTS_USED').GetInt64()
    $recoveryMaximum = $recovery.GetProperty('APPROVED_MAXIMUM').GetInt64()
    $buckets = @($evaluator.GetProperty('BUCKETS').EnumerateArray())
    if ($attempts -lt 0 -or $recoveryMaximum -lt 0 -or $attempts -gt $recoveryMaximum) { $Errors.Add('Recovery budget count or maximum is invalid') }
    if ($lineage -ceq 'NONE') {
        if ($attempts -ne 0 -or $recoveryMaximum -ne 0 -or $buckets.Count -ne 0 -or
            @($recovery.GetProperty('EVIDENCE_REFERENCES').EnumerateArray()).Count -ne 0) {
            $Errors.Add('Pre-lineage budget must use the exact zero form')
        }
    }
    Test-CountedEvidence $recovery.GetProperty('EVIDENCE_REFERENCES') $attempts "`$.$Kind.RECOVERY_BUDGET.EVIDENCE_REFERENCES" $Errors
    $seenKeys = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $seenPurposes = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $seenMaterialReferences = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $seenPending = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $lastKey = ''
    foreach ($bucket in $buckets) {
        $bucketShapeErrorCount = $Errors.Count
        Test-ExactShape $bucket $evaluatorBucketFields "`$.$Kind.EVALUATOR_BUDGET.BUCKETS[]" $Errors
        if ($Errors.Count -gt $bucketShapeErrorCount) { return }
        $key = $bucket.GetProperty('BUCKET_KEY').GetString()
        $stage = $bucket.GetProperty('STAGE_KEY').GetString()
        $purpose = $bucket.GetProperty('PURPOSE_KEY').GetString()
        foreach ($token in @($key,$stage,$purpose)) {
            if ($token -cnotmatch '^[A-Z][A-Z0-9_-]*$' -or $token -ceq 'NONE') { $Errors.Add('Invalid evaluator bucket identity token') }
        }
        if (-not $seenKeys.Add($key) -or ($lastKey -and [string]::CompareOrdinal($key,$lastKey) -le 0)) {
            $Errors.Add('Duplicate or non-canonical BUCKET_KEY order')
        }
        if (-not $seenPurposes.Add("$stage|$purpose")) { $Errors.Add('Duplicate material stage and evaluator purpose') }
        $lastKey = $key
        $used = $bucket.GetProperty('EXECUTION_GENERATIONS_USED').GetInt64()
        $maximum = $bucket.GetProperty('APPROVED_MAXIMUM').GetInt64()
        if ($used -lt 0 -or $maximum -lt 0 -or $used -gt $maximum) { $Errors.Add('Evaluator generation count or maximum is invalid') }
        Test-CountedEvidence $bucket.GetProperty('EVIDENCE_REFERENCES') $used "`$.$Kind.EVALUATOR_BUDGET.BUCKETS[$key].EVIDENCE_REFERENCES" $Errors
        $materialReference = $bucket.GetProperty('MATERIAL_EQUIVALENCE_REFERENCE').GetString()
        if (-not $seenMaterialReferences.Add($materialReference)) {
            $Errors.Add('A material review reference cannot mint another evaluator bucket')
        }
        if ($materialReference -cnotmatch '^REVIEW:([^:]+):([0-9a-f]{64})$' -or -not $CheckoutRoot) {
            $Errors.Add('Invalid or unbound material equivalence reference')
        } else {
            try { Assert-CurrentArtifactHash $CheckoutRoot $Matches[1] $Matches[2] }
            catch { $Errors.Add('Material equivalence review artifact missing or hash drifted') }
        }
        $pending = $bucket.GetProperty('PENDING_COMMAND_ID')
        if ($pending.ValueKind -eq [System.Text.Json.JsonValueKind]::String) {
            $pendingId = $pending.GetString()
            if ($pendingId -cnotmatch '^[A-Z0-9][A-Z0-9-]*:[1-9][0-9]*$' -or -not $seenPending.Add($pendingId)) {
                $Errors.Add('Invalid or duplicate pending command identity')
            }
            $expectedPending = if ($Kind -eq 'HANDOFF') { $State.GetProperty('SOURCE_COMMAND_ID').GetString() } else { $State.GetProperty('LAST_ACCEPTED_COMMAND_ID').GetString() }
            if ($expectedPending -cne $pendingId -or
                $State.GetProperty('EXECUTION_STATE').GetString() -cnotin @('ACCEPTED','EXECUTING','EXECUTION_UNCERTAIN')) {
                $Errors.Add('Pending command is not bound to accepted or uncertain execution')
            }
        }
    }
    if ($lineage -ceq 'NONE' -and $Kind -eq 'HANDOFF') { $Errors.Add('Handoff cannot use a pre-lineage zero budget') }
}

function Test-RecursiveKeys([System.Text.Json.JsonElement]$Value, [string]$Path, [System.Collections.Generic.List[string]]$Errors) {
    if ($Value.ValueKind -eq [System.Text.Json.JsonValueKind]::Object) {
        $seen = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
        foreach ($property in $Value.EnumerateObject()) {
            if (-not $seen.Add($property.Name)) { $Errors.Add("$Path.$($property.Name) is duplicated") }
            if ($property.Name -match '(?i)(credential|password|secret|token|cookie|session|transcript|customer[_-]?data|auth[_-]?material)') {
                $Errors.Add("$Path.$($property.Name) is forbidden sensitive content")
            }
            Test-RecursiveKeys $property.Value "$Path.$($property.Name)" $Errors
        }
    } elseif ($Value.ValueKind -eq [System.Text.Json.JsonValueKind]::Array) {
        $index = 0
        foreach ($item in $Value.EnumerateArray()) { Test-RecursiveKeys $item "$Path[$index]" $Errors; $index++ }
    } elseif ($Value.ValueKind -eq [System.Text.Json.JsonValueKind]::String) {
        $valueText = $Value.GetString()
        if ($valueText.Length -gt 512 -or $valueText -match '[\r\n]' -or
            $valueText -match '(?i)(bearer\s+[a-z0-9._-]{8,}|sk-[a-z0-9]{10,}|(?:api[_-]?key|password|cookie|session[_-]?token)\s*[:=])') {
            $Errors.Add("$Path contains unapproved sensitive or transcript-like content")
        }
    }
}

function Write-CanonicalJson([System.Text.Json.Utf8JsonWriter]$Writer, [System.Text.Json.JsonElement]$Value, [string]$OmitRootField, [bool]$IsRoot) {
    switch ($Value.ValueKind) {
        Object {
            $Writer.WriteStartObject()
            $properties = @($Value.EnumerateObject())
            $names = [string[]]@($properties | ForEach-Object { $_.Name })
            [array]::Sort($names, [System.StringComparer]::Ordinal)
            foreach ($name in $names) {
                if ($IsRoot -and $name -ceq $OmitRootField) { continue }
                $property = $Value.GetProperty($name)
                $Writer.WritePropertyName($name)
                Write-CanonicalJson $Writer $property $OmitRootField $false
            }
            $Writer.WriteEndObject()
        }
        Array {
            $Writer.WriteStartArray()
            foreach ($item in $Value.EnumerateArray()) { Write-CanonicalJson $Writer $item $OmitRootField $false }
            $Writer.WriteEndArray()
        }
        String { $Writer.WriteStringValue($Value.GetString()) }
        Number {
            $number = [long]0
            if (-not $Value.TryGetInt64([ref]$number)) { throw 'Only integer JSON numbers are permitted' }
            $Writer.WriteNumberValue($number)
        }
        True { $Writer.WriteBooleanValue($true) }
        False { $Writer.WriteBooleanValue($false) }
        Null { $Writer.WriteNullValue() }
        default { throw 'Unsupported JSON value' }
    }
}

function Get-CanonicalHash([System.Text.Json.JsonElement]$Root, [string]$HashField) {
    $stream = [System.IO.MemoryStream]::new()
    $writer = [System.Text.Json.Utf8JsonWriter]::new($stream)
    try {
        Write-CanonicalJson $writer $Root $HashField $true
        $writer.Flush()
        return [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($stream.ToArray())).ToLowerInvariant()
    } finally { $writer.Dispose(); $stream.Dispose() }
}

function Test-AuthorityProjection([System.Text.Json.JsonElement]$State, [string]$Path, [System.Collections.Generic.List[string]]$Errors) {
    $seenScopes = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $lastScope = ''
    foreach ($freeze in $State.GetProperty('CURRENT_ACTIVE_FREEZES').EnumerateArray()) {
        $before = $Errors.Count
        Test-ExactShape $freeze $activeFreezeFields "$Path.CURRENT_ACTIVE_FREEZES[]" $Errors
        if ($Errors.Count -ne $before) { continue }
        if ($freeze.GetProperty('RECORD_VERSION').GetInt64() -ne 1 -or $freeze.GetProperty('FREEZE_ID').GetString() -cnotmatch '^[0-9a-f]{64}$') {
            $Errors.Add('Invalid active freeze version or identity')
        }
        $scope = $freeze.GetProperty('DECISION_SCOPE')
        Test-ExactShape $scope $decisionScopeFields "$Path.CURRENT_ACTIVE_FREEZES[].DECISION_SCOPE" $Errors
        if ($Errors.Count -ne $before) { continue }
        $budgetType = $scope.GetProperty('BUDGET_TYPE').GetString()
        $bucketKey = $scope.GetProperty('BUCKET_KEY')
        if ($budgetType -cnotin @('RECOVERY_BUDGET','EVALUATOR_BUDGET') -or
            ($budgetType -ceq 'RECOVERY_BUDGET' -and $bucketKey.ValueKind -ne [System.Text.Json.JsonValueKind]::Null) -or
            ($budgetType -ceq 'EVALUATOR_BUDGET' -and ($bucketKey.ValueKind -ne [System.Text.Json.JsonValueKind]::String -or $bucketKey.GetString() -cnotmatch '^[A-Z][A-Z0-9_-]*$')) -or
            $scope.GetProperty('EXECUTION_CONTEXT_ID').GetString() -cne $State.GetProperty('EXECUTION_CONTEXT_ID').GetString() -or
            $scope.GetProperty('CAUSAL_LINEAGE_ID').GetString() -cne $State.GetProperty('CAUSAL_LINEAGE_ID').GetString()) {
            $Errors.Add('Active freeze is not bound to an exact current budget scope')
        }
        if ($budgetType -ceq 'EVALUATOR_BUDGET' -and $bucketKey.ValueKind -eq [System.Text.Json.JsonValueKind]::String) {
            $keys = @($State.GetProperty('EVALUATOR_BUDGET').GetProperty('BUCKETS').EnumerateArray() | ForEach-Object { $_.GetProperty('BUCKET_KEY').GetString() })
            if ($bucketKey.GetString() -cnotin $keys) { $Errors.Add('Active freeze refers to unknown evaluator bucket') }
        }
        $scopeText = Get-CanonicalElementText $scope
        if (-not $seenScopes.Add($scopeText) -or ($lastScope -and [string]::CompareOrdinal($scopeText,$lastScope) -le 0)) {
            $Errors.Add('Duplicate or unsorted active freeze scope')
        }
        $lastScope = $scopeText
    }
    $seenDecisions = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $seenApprovals = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $seenItems = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $seenResults = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $lastDecision = ''
    foreach ($entry in $State.GetProperty('CONSUMED_AUTHORITY_PROOFS').EnumerateArray()) {
        $before = $Errors.Count
        Test-ExactShape $entry $consumedProofEntryFields "$Path.CONSUMED_AUTHORITY_PROOFS[]" $Errors
        if ($Errors.Count -ne $before) { continue }
        $proof = $entry.GetProperty('CONSUMED_AUTHORITY_PROOF')
        Test-ExactShape $proof $consumedProofFields "$Path.CONSUMED_AUTHORITY_PROOFS[].CONSUMED_AUTHORITY_PROOF" $Errors
        if ($Errors.Count -ne $before) { continue }
        $decisionId = $proof.GetProperty('DECISION_ID').GetString()
        $approvalId = $proof.GetProperty('APPROVAL_RECORD_ID').GetString()
        $itemId = $proof.GetProperty('DECISION_ITEM_ID').GetString()
        $resultHash = $proof.GetProperty('RESULT_HASH').GetString()
        if ($proof.GetProperty('RECORD_VERSION').GetInt64() -ne 1 -or
            $decisionId -cnotmatch '^[0-9a-f]{64}$' -or $approvalId -cnotmatch '^[0-9a-f]{64}$' -or
            $resultHash -cnotmatch '^[0-9a-f]{64}$' -or $itemId -cnotmatch '^[A-Z0-9][A-Z0-9_-]*:[1-9][0-9]*#[1-9][0-9]*$' -or
            $proof.GetProperty('APPROVAL_RECORD_SHA256').GetString() -cnotmatch '^[0-9a-f]{64}$' -or
            $proof.GetProperty('SEMANTIC_DECISION_RECORD_SHA256').GetString() -cnotmatch '^[0-9a-f]{64}$' -or
            -not $decisionTokens.ContainsKey($proof.GetProperty('DECISION_TYPE').GetString()) -or
            $entry.GetProperty('CONSUMED_AUTHORITY_PROOF_SHA256').GetString() -cne (Get-CanonicalHash $proof '')) {
            $Errors.Add('Invalid durable authority proof')
        }
        if (-not $seenDecisions.Add($decisionId) -or -not $seenApprovals.Add($approvalId) -or
            -not $seenItems.Add($itemId) -or -not $seenResults.Add($resultHash) -or
            ($lastDecision -and [string]::CompareOrdinal($decisionId,$lastDecision) -le 0)) {
            $Errors.Add('Duplicate or unsorted consumed authority identity')
        }
        $lastDecision = $decisionId
    }
    foreach ($freeze in $State.GetProperty('CURRENT_ACTIVE_FREEZES').EnumerateArray()) {
        $id=$freeze.GetProperty('FREEZE_ID').GetString()
        $found=@($State.GetProperty('CONSUMED_AUTHORITY_PROOFS').EnumerateArray() | Where-Object {
            $_.GetProperty('CONSUMED_AUTHORITY_PROOF').GetProperty('DECISION_ID').GetString() -ceq $id -and
            $_.GetProperty('CONSUMED_AUTHORITY_PROOF').GetProperty('DECISION_TYPE').GetString() -ceq 'BUDGET_EXECUTION_FREEZE_TRANSITION'
        })
        if ($found.Count -ne 1) { $Errors.Add('Active freeze lacks one consumed transition proof') }
    }
    $exceptionProofs=@($State.GetProperty('CONSUMED_AUTHORITY_PROOFS').EnumerateArray() | Where-Object {
        $_.GetProperty('CONSUMED_AUTHORITY_PROOF').GetProperty('DECISION_TYPE').GetString() -ceq 'BUDGET_MAXIMUM_EXCEPTION'
    })
    if ($State.GetProperty('RECOVERY_BUDGET').GetProperty('APPROVED_MAXIMUM').GetInt64() -gt 2 -and $exceptionProofs.Count -eq 0) {
        $Errors.Add('Above-default recovery maximum lacks a consumed exception proof')
    }
    foreach ($bucket in $State.GetProperty('EVALUATOR_BUDGET').GetProperty('BUCKETS').EnumerateArray()) {
        if ($bucket.GetProperty('APPROVED_MAXIMUM').GetInt64() -gt 3 -and $exceptionProofs.Count -eq 0) {
            $Errors.Add('Above-default evaluator maximum lacks a consumed exception proof')
        }
    }
}

function Get-CanonicalElementText([System.Text.Json.JsonElement]$Element) {
    $stream = [System.IO.MemoryStream]::new()
    $writer = [System.Text.Json.Utf8JsonWriter]::new($stream)
    try {
        Write-CanonicalJson $writer $Element '' $true
        $writer.Flush()
        return [System.Text.Encoding]::UTF8.GetString($stream.ToArray())
    } finally { $writer.Dispose(); $stream.Dispose() }
}

function Set-InMemoryHash([System.Collections.IDictionary]$Record, [string]$HashField) {
    $json = ConvertTo-Json -InputObject $Record -Depth 30 -Compress
    $document = [System.Text.Json.JsonDocument]::Parse($json)
    try { $Record[$HashField] = Get-CanonicalHash $document.RootElement $HashField }
    finally { $document.Dispose() }
    return (ConvertTo-Json -InputObject $Record -Depth 30 -Compress)
}

function New-ActivationFixture([string]$ContextId, [string]$CheckoutRoot, [string]$HostLabel) {
    $record = [ordered]@{
        SCHEMA_VERSION=1; EXECUTION_CONTEXT_ID=$ContextId; MODE='FEDERATED'; REVISION=0
        PREVIOUS_RECORD_HASH=$null; RECORD_HASH=('0' * 64); LAST_EVENT_HASH=$null
        ACTIVATION_EPOCH=0; STATE='INACTIVE'; HOST_LABEL=$HostLabel; CHECKOUT_ROOT=$CheckoutRoot
        HELPER_INVOCATION_ID='PHASE1_IN_MEMORY'; OWNER_PID=$PID; OWNER_START_UTC='2026-09-25T00:00:00Z'
        TOWER_ID=$null; CONTROL_TOWER_ROLE=$null; CONTROL_TOWER_SCOPE=$null; OWNING_PAGE_CHAT_ID=$null
        CONTROL_TOWER_INSTANCE=$null; PROJECT_ID=$null; CONVERSATION_ID=$null; CONVERSATION_TITLE=$null
        CONVERSATION_URL=$null; ACTIVE_RUN_ID=$null; CAUSAL_LINEAGE_ID=$null; RUN_BINDING=@()
        LAST_ACCEPTED_COMMAND_ID=$null; LAST_RESULT_IDENTITY=$null; DELIVERY_STATE='NOT_SENT'; EXECUTION_STATE='NONE'
        RECOVERY_BUDGET=[ordered]@{ CAUSAL_LINEAGE_ID='NONE'; ATTEMPTS_USED=0; APPROVED_MAXIMUM=0; EVIDENCE_REFERENCES=@() }
        EVALUATOR_BUDGET=[ordered]@{ CAUSAL_LINEAGE_ID='NONE'; BUCKETS=@() }
        EVIDENCE_STOP_STATE='NONE'; BLOCKERS=@(); KNOWN_LIMITATIONS=@(); AUTHORIZATION_REFERENCE=$null
        APPROVAL_REFERENCES=@(); ARTIFACT_HASHES=@(); CURRENT_ACTIVE_FREEZES=@(); CONSUMED_AUTHORITY_PROOFS=@()
        CURRENT_HANDOFF_ID=$null; CONSUMED_HANDOFF_IDS=@()
        CREATED_AT_UTC='2026-09-25T00:00:00Z'; UPDATED_AT_UTC='2026-09-25T00:00:00Z'
    }
    return $record
}

function New-HandoffFixture([string]$ContextId) {
    $towerId = [ordered]@{ CONTROL_TOWER_ROLE='GLOBAL_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='FOUNDATION'; OWNING_PAGE_CHAT_ID='NONE' }
    $tower = [ordered]@{
        TOWER_ID=$towerId; CONTROL_TOWER_ROLE='GLOBAL_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='FOUNDATION'
        OWNING_PAGE_CHAT_ID='NONE'; PROJECT_ID='PROJECT1'; CONTROL_TOWER_INSTANCE='CONVERSATION1'
        CONVERSATION_ID='CONVERSATION1'; CONVERSATION_TITLE='QA global tower'
    }
    $targetTower = [ordered]@{
        TOWER_ID=$towerId; CONTROL_TOWER_ROLE='GLOBAL_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='FOUNDATION'
        OWNING_PAGE_CHAT_ID='NONE'; PROJECT_ID='PROJECT1'; CONTROL_TOWER_INSTANCE='CONVERSATION2'
        CONVERSATION_ID='CONVERSATION2'; CONVERSATION_TITLE='QA replacement global tower'
    }
    return [ordered]@{
        HANDOFF_VERSION=1; HANDOFF_ID='HANDOFF_PHASE1'; EXECUTION_CONTEXT_ID=$ContextId
        CREATED_AT_UTC='2026-09-25T00:00:00Z'; SOURCE_ACTIVATION_EPOCH=2; TARGET_ACTIVATION_EPOCH=3
        SOURCE_RECORD_HASH=('a' * 64); HANDOFF_HASH=('0' * 64); SOURCE_TOWER=$tower; TARGET_TOWER=$targetTower
        SOURCE_RUN_ID='RUN1'; SOURCE_ROUND_ID=1; SOURCE_COMMAND_ID='RUN1:1'; TARGET_RUN_ID='RUN2'
        CAUSAL_LINEAGE_ID='LINEAGE1'; WORKFLOW_STATE=[ordered]@{ CHANGE='fixture'; STAGE='fixture'; GATE_STATUS='PENDING'; SOURCE_REFERENCE='fixture' }
        DELIVERY_STATE='RESPONSE_COMPLETE'; EXECUTION_STATE='COMPLETED'; EVIDENCE_STOP_STATE='NONE'
        RECOVERY_BUDGET=[ordered]@{ CAUSAL_LINEAGE_ID='LINEAGE1'; ATTEMPTS_USED=0; APPROVED_MAXIMUM=1; EVIDENCE_REFERENCES=@() }
        EVALUATOR_BUDGET=[ordered]@{ CAUSAL_LINEAGE_ID='LINEAGE1'; BUCKETS=@() }
        APPROVAL_REFERENCES=@(); ARTIFACT_HASHES=@(); EVIDENCE_REFERENCES=@()
        CURRENT_ACTIVE_FREEZES=@(); CONSUMED_AUTHORITY_PROOFS=@()
        PRODUCT_PROVENANCE=[ordered]@{ OWNING_PAGE_CHAT_ID='NONE'; SOURCE_REFERENCES=@(); PAGE_CONTEXT_INTAKE='NOT_APPLICABLE'; COMPLETENESS='NOT_APPLICABLE'; GAPS=@(); EVIDENCE_REFERENCES=@() }
        BLOCKERS=@(); KNOWN_LIMITATIONS=@()
        NEXT_CANDIDATE_ACTION=[ordered]@{ DESCRIPTION='No action'; EXPECTED_AUTHORITY_SOURCE='Human'; AUTHORIZATION_STATUS='PENDING' }
    }
}

function New-JournalFixture([string]$ContextId) {
    $statePayload = New-ActivationFixture $ContextId 'D:\working\yuta\yuta-resto' $env:COMPUTERNAME
    $statePayload.Remove('RECORD_HASH')
    $statePayload.Remove('LAST_EVENT_HASH')
    return [ordered]@{
        SCHEMA_VERSION=1; REVISION=0; EVENT_ID='EVENT_PHASE1'; EVENT_KIND='ACTIVATION_INTENT'
        EXECUTION_CONTEXT_ID=$ContextId; ACTIVATION_EPOCH=0; TOWER_ID=$null; RUN_ID='NOT_APPLICABLE'
        ROUND_ID=$null; COMMAND_ID='NOT_APPLICABLE'; PREVIOUS_EVENT_HASH=$null; PREVIOUS_RECORD_HASH=$null
        STATE_PAYLOAD=$statePayload
        CREATED_AT_UTC='2026-09-25T00:00:00Z'; AUTHORIZATION_REFERENCE=$null; EVIDENCE_REFERENCES=@()
        EVENT_HASH=('0' * 64)
    }
}

function Test-TowerIdentity([System.Text.Json.JsonElement]$Tower, [string]$Path, [System.Collections.Generic.List[string]]$Errors) {
    Test-ExactShape $Tower $towerIdFields $Path $Errors
    if ($Tower.ValueKind -ne [System.Text.Json.JsonValueKind]::Object) { return }
    $role = $Tower.GetProperty('CONTROL_TOWER_ROLE').GetString()
    $scope = $Tower.GetProperty('CONTROL_TOWER_SCOPE').GetString()
    $owner = $Tower.GetProperty('OWNING_PAGE_CHAT_ID').GetString()
    if ($role -notin @('PAGE_CONTROL_TOWER', 'GLOBAL_CONTROL_TOWER')) { $Errors.Add("$Path has unsupported role") }
    if ($role -eq 'PAGE_CONTROL_TOWER' -and ($scope -cne 'PAGE_LOCAL' -or [string]::IsNullOrWhiteSpace($owner) -or $owner -ceq 'NONE')) {
        $Errors.Add("$Path PAGE_CONTROL_TOWER requires PAGE_LOCAL and an exact owning Page Chat ID")
    }
    if ($role -eq 'GLOBAL_CONTROL_TOWER' -and ($scope -cnotin @('CROSS_MODULE', 'UNCERTAIN', 'CROSS_PAGE', 'SHARED', 'FOUNDATION') -or $owner -cne 'NONE')) {
        $Errors.Add("$Path GLOBAL_CONTROL_TOWER requires an approved global scope and owner NONE")
    }
}

function Test-RunBindingCoherence([System.Text.Json.JsonElement]$Root, [System.Collections.Generic.List[string]]$Errors) {
    $state = $Root.GetProperty('STATE').GetString()
    $activeRunElement = $Root.GetProperty('ACTIVE_RUN_ID')
    $activeRun = if ($activeRunElement.ValueKind -eq [System.Text.Json.JsonValueKind]::String) { $activeRunElement.GetString() } else { $null }
    $bindings = @($Root.GetProperty('RUN_BINDING').EnumerateArray())
    $ids = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $matching = 0
    foreach ($binding in $bindings) {
        $id = $binding.GetProperty('RUN_ID').GetString()
        if (-not $ids.Add($id)) { $Errors.Add('Duplicate RUN_ID binding') }
        if ($binding.GetProperty('STATE').GetString() -ceq 'ACTIVE' -and ($state -cne 'ACTIVE' -or $id -cne $activeRun)) {
            $Errors.Add('Conflicting ACTIVE run binding')
        }
        if ($id -ceq $activeRun) {
            $matching++
            if ($binding.GetProperty('ACTIVATION_EPOCH').GetInt64() -ne $Root.GetProperty('ACTIVATION_EPOCH').GetInt64() -or
                $binding.GetProperty('CONTROL_TOWER_INSTANCE').GetString() -cne $Root.GetProperty('CONTROL_TOWER_INSTANCE').GetString() -or
                $binding.GetProperty('PROJECT_ID').GetString() -cne $Root.GetProperty('PROJECT_ID').GetString() -or
                $binding.GetProperty('CONVERSATION_ID').GetString() -cne $Root.GetProperty('CONVERSATION_ID').GetString()) {
                $Errors.Add('Current run binding does not match epoch/instance')
            }
            $requiredState = if ($state -eq 'ACTIVE') { 'ACTIVE' } else { 'RESERVED' }
            if ($binding.GetProperty('STATE').GetString() -cne $requiredState) { $Errors.Add('Current run binding has wrong state') }
        }
    }
    if ($state -in @('ACTIVATING','ACTIVE') -and ($null -eq $activeRun -or $matching -ne 1)) { $Errors.Add('Exactly one current run binding is required') }
    if ($state -in @('FENCING','TERMINAL','REVOKED') -and $null -ne $activeRun) { $Errors.Add('Fenced or terminal state cannot retain ACTIVE_RUN_ID') }
}

function Test-Record([string]$Content, [ValidateSet('Activation', 'Journal', 'Handoff')][string]$Kind, [string]$ContextId, [string]$CheckoutRoot, [string]$HostLabel) {
    $errors = [System.Collections.Generic.List[string]]::new()
    if ([string]::IsNullOrWhiteSpace($Content)) { return [pscustomobject]@{ Kind = $Kind; Valid = $false; Errors = @('JSON input is empty') } }
    try { $document = [System.Text.Json.JsonDocument]::Parse($Content) }
    catch { return [pscustomobject]@{ Kind = $Kind; Valid = $false; Errors = @('Malformed JSON') } }
    try {
        $root = $document.RootElement
        Test-RecursiveKeys $root '$' $errors
        $fields = switch ($Kind) { Activation { $activationFields } Journal { $journalFields } Handoff { $handoffFields } }
        Test-ExactShape $root $fields '$' $errors
        if ($errors.Count -gt 0) { return [pscustomobject]@{ Kind = $Kind; Valid = $false; Errors = @($errors.ToArray()) } }
        $versionField = if ($Kind -eq 'Handoff') { 'HANDOFF_VERSION' } else { 'SCHEMA_VERSION' }
        if ($root.GetProperty($versionField).GetInt64() -ne 1) { $errors.Add('Unsupported schema version') }
        if ($root.GetProperty('EXECUTION_CONTEXT_ID').GetString() -cnotmatch '^[A-Z][A-Z0-9_-]{2,79}$') { $errors.Add('Invalid EXECUTION_CONTEXT_ID') }
        if ($ContextId -and $root.GetProperty('EXECUTION_CONTEXT_ID').GetString() -cne $ContextId) { $errors.Add('Execution context mismatch') }
        $hashField = switch ($Kind) { Activation { 'RECORD_HASH' } Journal { 'EVENT_HASH' } Handoff { 'HANDOFF_HASH' } }
        $recordedHash = $root.GetProperty($hashField).GetString()
        if ($recordedHash -cnotmatch '^[0-9a-f]{64}$' -or $recordedHash -cne (Get-CanonicalHash $root $hashField)) { $errors.Add('Canonical SHA-256 mismatch') }
        if ($Kind -eq 'Activation') {
            if ($root.GetProperty('MODE').GetString() -cne 'FEDERATED') { $errors.Add('Unsupported mode') }
            $state = $root.GetProperty('STATE').GetString()
            if ($state -cnotin @('INACTIVE', 'ACTIVATING', 'ACTIVE', 'FENCING', 'TERMINAL', 'REVOKED')) { $errors.Add('Unsupported activation state') }
            if ($root.GetProperty('REVISION').GetInt64() -lt 0 -or $root.GetProperty('ACTIVATION_EPOCH').GetInt64() -lt 0) { $errors.Add('Negative revision or epoch') }
            if ($root.GetProperty('REVISION').GetInt64() -eq 0 -and $root.GetProperty('PREVIOUS_RECORD_HASH').ValueKind -ne [System.Text.Json.JsonValueKind]::Null) { $errors.Add('Genesis has previous hash') }
            if ($root.GetProperty('REVISION').GetInt64() -gt 0 -and $root.GetProperty('PREVIOUS_RECORD_HASH').ValueKind -eq [System.Text.Json.JsonValueKind]::Null) { $errors.Add('Non-genesis lacks previous hash') }
            if ($CheckoutRoot -and $root.GetProperty('CHECKOUT_ROOT').GetString() -cne $CheckoutRoot) { $errors.Add('Checkout mismatch') }
            if ($HostLabel -and $root.GetProperty('HOST_LABEL').GetString() -cne $HostLabel) { $errors.Add('Host mismatch') }
            if ($state -in @('ACTIVATING', 'ACTIVE', 'FENCING')) {
                foreach ($name in @('TOWER_ID','CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID','CONTROL_TOWER_INSTANCE','PROJECT_ID','CONVERSATION_ID','CONVERSATION_TITLE','CONVERSATION_URL','AUTHORIZATION_REFERENCE')) {
                    if ($root.GetProperty($name).ValueKind -eq [System.Text.Json.JsonValueKind]::Null) { $errors.Add("$name required for selected target") }
                }
                if ($root.GetProperty('ACTIVE_RUN_ID').ValueKind -eq [System.Text.Json.JsonValueKind]::Null -and $state -ne 'FENCING') { $errors.Add('Active run required') }
            }
            $tower = $root.GetProperty('TOWER_ID')
            if ($tower.ValueKind -eq [System.Text.Json.JsonValueKind]::Object) {
                Test-TowerIdentity $tower '$.TOWER_ID' $errors
                foreach ($name in @('CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID')) {
                    if ($root.GetProperty($name).GetString() -cne $tower.GetProperty($name).GetString()) { $errors.Add("$name does not match TOWER_ID") }
                }
            }
            if ($root.GetProperty('CONTROL_TOWER_INSTANCE').ValueKind -eq [System.Text.Json.JsonValueKind]::String -and
                $root.GetProperty('CONTROL_TOWER_INSTANCE').GetString() -cne $root.GetProperty('CONVERSATION_ID').GetString()) { $errors.Add('Instance/conversation mismatch') }
            foreach ($binding in $root.GetProperty('RUN_BINDING').EnumerateArray()) {
                Test-ExactShape $binding $runBindingFields '$.RUN_BINDING[]' $errors
                if ($binding.ValueKind -eq [System.Text.Json.JsonValueKind]::Object) {
                    Test-TowerIdentity $binding.GetProperty('TOWER_ID') '$.RUN_BINDING[].TOWER_ID' $errors
                    if ($binding.GetProperty('STATE').GetString() -cnotin @('RESERVED','ACTIVE','TERMINAL','REVOKED')) { $errors.Add('Invalid run binding state') }
                }
            }
            Test-RunBindingCoherence $root $errors
            $resultIdentity = $root.GetProperty('LAST_RESULT_IDENTITY')
            if ($resultIdentity.ValueKind -eq [System.Text.Json.JsonValueKind]::Object) {
                Test-ExactShape $resultIdentity $resultIdentityFields '$.LAST_RESULT_IDENTITY' $errors
                if ($resultIdentity.GetProperty('COMMAND_ID').GetString() -cne $root.GetProperty('LAST_ACCEPTED_COMMAND_ID').GetString() -or
                    $resultIdentity.GetProperty('COMMAND_ID').GetString() -cne "$($resultIdentity.GetProperty('RUN_ID').GetString()):$($resultIdentity.GetProperty('ROUND_ID').GetInt64())" -or
                    $resultIdentity.GetProperty('CAUSAL_LINEAGE_ID').GetString() -cne $root.GetProperty('CAUSAL_LINEAGE_ID').GetString() -or
                    $resultIdentity.GetProperty('RESULT_HASH').GetString() -cnotmatch '^[0-9a-f]{64}$') {
                    $errors.Add('Result identity does not bind to latest command and lineage')
                }
            }
            Test-BudgetShape $root 'ACTIVATION' $CheckoutRoot $errors
            Test-AuthorityProjection $root '$' $errors
            foreach ($name in @('BLOCKERS','KNOWN_LIMITATIONS','CONSUMED_HANDOFF_IDS')) { Test-StringArray $root.GetProperty($name) "`$.$name" $errors }
            $auth = $root.GetProperty('AUTHORIZATION_REFERENCE')
            if ($auth.ValueKind -eq [System.Text.Json.JsonValueKind]::Object) { Test-ExactShape $auth $approvalFields '$.AUTHORIZATION_REFERENCE' $errors }
            if ($root.GetProperty('EXECUTION_STATE').GetString() -cnotin @('NONE','ACCEPTED','EXECUTING','COMPLETED','FAILED','EXECUTION_UNCERTAIN')) { $errors.Add('Invalid execution state') }
            if ($root.GetProperty('DELIVERY_STATE').GetString() -cnotin @('NOT_SENT','SENDING','SENT_WAITING_RESPONSE','RESPONSE_GENERATING','RESPONSE_COMPLETE','DELIVERY_UNCERTAIN')) { $errors.Add('Invalid delivery state') }
        } elseif ($Kind -eq 'Handoff') {
            if ($root.GetProperty('TARGET_RUN_ID').GetString() -ceq $root.GetProperty('SOURCE_RUN_ID').GetString()) { $errors.Add('Target run is not fresh') }
            if ($root.GetProperty('TARGET_ACTIVATION_EPOCH').GetInt64() -ne ($root.GetProperty('SOURCE_ACTIVATION_EPOCH').GetInt64() + 1)) { $errors.Add('Target epoch mismatch') }
            if ($root.GetProperty('SOURCE_TOWER').GetProperty('PROJECT_ID').GetString() -ceq $root.GetProperty('TARGET_TOWER').GetProperty('PROJECT_ID').GetString() -and
                $root.GetProperty('SOURCE_TOWER').GetProperty('CONVERSATION_ID').GetString() -ceq $root.GetProperty('TARGET_TOWER').GetProperty('CONVERSATION_ID').GetString()) {
                $errors.Add('Source and target conversation instances are identical')
            }
            foreach ($name in @('SOURCE_TOWER','TARGET_TOWER')) {
                $tower = $root.GetProperty($name)
                Test-ExactShape $tower $towerFields "`$.$name" $errors
                if ($tower.ValueKind -eq [System.Text.Json.JsonValueKind]::Object) {
                    Test-TowerIdentity $tower.GetProperty('TOWER_ID') "`$.$name.TOWER_ID" $errors
                    foreach ($identityName in @('CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID')) {
                        if ($tower.GetProperty($identityName).GetString() -cne $tower.GetProperty('TOWER_ID').GetProperty($identityName).GetString()) {
                            $errors.Add("$name.$identityName does not match TOWER_ID")
                        }
                    }
                    if ($tower.GetProperty('CONTROL_TOWER_INSTANCE').GetString() -cne $tower.GetProperty('CONVERSATION_ID').GetString()) {
                        $errors.Add("$name instance/conversation mismatch")
                    }
                }
            }
            Test-ExactShape $root.GetProperty('WORKFLOW_STATE') ([ordered]@{ CHANGE='string'; STAGE='string'; GATE_STATUS='string'; SOURCE_REFERENCE='string' }) '$.WORKFLOW_STATE' $errors
            Test-BudgetShape $root 'HANDOFF' $CheckoutRoot $errors
            Test-AuthorityProjection $root '$' $errors
            foreach ($name in @('EVIDENCE_REFERENCES','BLOCKERS','KNOWN_LIMITATIONS')) { Test-StringArray $root.GetProperty($name) "`$.$name" $errors }
            $next = $root.GetProperty('NEXT_CANDIDATE_ACTION')
            Test-ExactShape $next ([ordered]@{ DESCRIPTION='string'; EXPECTED_AUTHORITY_SOURCE='string'; AUTHORIZATION_STATUS='string' }) '$.NEXT_CANDIDATE_ACTION' $errors
            if ($next.GetProperty('AUTHORIZATION_STATUS').GetString() -cne 'PENDING') { $errors.Add('Handoff cannot grant authorization') }
            $provenance = $root.GetProperty('PRODUCT_PROVENANCE')
            Test-ExactShape $provenance ([ordered]@{ OWNING_PAGE_CHAT_ID='string'; SOURCE_REFERENCES='array'; PAGE_CONTEXT_INTAKE='string'; COMPLETENESS='string'; GAPS='array'; EVIDENCE_REFERENCES='array' }) '$.PRODUCT_PROVENANCE' $errors
            foreach ($name in @('SOURCE_REFERENCES','GAPS','EVIDENCE_REFERENCES')) { Test-StringArray $provenance.GetProperty($name) "`$.PRODUCT_PROVENANCE.$name" $errors }
            if ($provenance.GetProperty('PAGE_CONTEXT_INTAKE').GetString() -cnotin @('AVAILABLE','PARTIAL','UNKNOWN','NOT_APPLICABLE')) { $errors.Add('Invalid PAGE_CONTEXT_INTAKE') }
        } elseif ($Kind -eq 'Journal') {
            if ($root.GetProperty('REVISION').GetInt64() -lt 0 -or $root.GetProperty('ACTIVATION_EPOCH').GetInt64() -lt 0) { $errors.Add('Negative journal revision or epoch') }
            if ($root.GetProperty('REVISION').GetInt64() -eq 0 -and $root.GetProperty('PREVIOUS_EVENT_HASH').ValueKind -ne [System.Text.Json.JsonValueKind]::Null) { $errors.Add('Genesis journal event has previous hash') }
            if ($root.GetProperty('REVISION').GetInt64() -gt 0 -and $root.GetProperty('PREVIOUS_EVENT_HASH').ValueKind -eq [System.Text.Json.JsonValueKind]::Null) { $errors.Add('Non-genesis journal event lacks previous hash') }
            if ($root.GetProperty('EVENT_KIND').GetString() -cnotin @('ACTIVATION_INTENT','FENCE_COMMIT','RUN_RESERVED','HANDOFF_PERSISTED','HANDOFF_SUPERSEDED','PROBE_INTENT','PROBE_OUTCOME','ACTIVE_COMMIT','COMMAND_ACCEPTED','COMMAND_EXECUTING','COMMAND_OUTCOME','RESULT_DELIVERY','TERMINAL_COMMIT','AUTHORITY_CONSUMED','RETRY_GENESIS')) { $errors.Add('Unknown journal event kind') }
            $journalTower = $root.GetProperty('TOWER_ID')
            if ($journalTower.ValueKind -eq [System.Text.Json.JsonValueKind]::Object) { Test-TowerIdentity $journalTower '$.TOWER_ID' $errors }
            $payload = $root.GetProperty('STATE_PAYLOAD')
            Test-ExactShape $payload $statePayloadFields '$.STATE_PAYLOAD' $errors
            if ($errors.Count -eq 0) {
                Test-BudgetShape $payload 'JOURNAL' $CheckoutRoot $errors
                Test-AuthorityProjection $payload '$.STATE_PAYLOAD' $errors
            }
            Test-StringArray $root.GetProperty('EVIDENCE_REFERENCES') '$.EVIDENCE_REFERENCES' $errors
            if ($payload.GetProperty('REVISION').GetInt64() -ne $root.GetProperty('REVISION').GetInt64() -or
                $payload.GetProperty('ACTIVATION_EPOCH').GetInt64() -ne $root.GetProperty('ACTIVATION_EPOCH').GetInt64() -or
                $payload.GetProperty('EXECUTION_CONTEXT_ID').GetString() -cne $root.GetProperty('EXECUTION_CONTEXT_ID').GetString()) { $errors.Add('Journal state payload identity mismatch') }
            $payloadTower = $payload.GetProperty('TOWER_ID')
            if ($journalTower.ValueKind -ne $payloadTower.ValueKind -or
                ($journalTower.ValueKind -eq [System.Text.Json.JsonValueKind]::Object -and $journalTower.GetRawText() -cne $payloadTower.GetRawText())) {
                $errors.Add('Journal tower identity mismatch')
            }
            if ($root.GetProperty('PREVIOUS_RECORD_HASH').ValueKind -ne $payload.GetProperty('PREVIOUS_RECORD_HASH').ValueKind -or
                ($root.GetProperty('PREVIOUS_RECORD_HASH').ValueKind -eq [System.Text.Json.JsonValueKind]::String -and
                $root.GetProperty('PREVIOUS_RECORD_HASH').GetString() -cne $payload.GetProperty('PREVIOUS_RECORD_HASH').GetString())) {
                $errors.Add('Journal previous record mismatch')
            }
        }
        foreach ($name in @('APPROVAL_REFERENCES','ARTIFACT_HASHES')) {
            if ($Kind -eq 'Journal') { break }
            $shape = if ($name -eq 'APPROVAL_REFERENCES') { $approvalFields } else { $artifactFields }
            foreach ($item in $root.GetProperty($name).EnumerateArray()) { Test-ExactShape $item $shape "`$.$name[]" $errors }
        }
        return [pscustomobject]@{ Kind = $Kind; Valid = ($errors.Count -eq 0); Errors = @($errors.ToArray()) }
    } catch {
        $errors.Add("Invalid or inconsistent $Kind record")
        return [pscustomobject]@{ Kind = $Kind; Valid = $false; Errors = @($errors.ToArray()) }
    } finally { $document.Dispose() }
}

function Get-Preflight([string]$Root, [string]$HostLabel, [string]$ContextId) {
    $errors = [System.Collections.Generic.List[string]]::new()
    if ($ContextId -cnotmatch '^[A-Z][A-Z0-9_-]{2,79}$') { $errors.Add('Invalid execution context ID') }
    if ([string]::IsNullOrWhiteSpace($Root) -or -not [System.IO.Path]::IsPathRooted($Root)) { $errors.Add('Canonical absolute checkout root is required') }
    if ([string]::IsNullOrWhiteSpace($HostLabel) -or $HostLabel -cne $env:COMPUTERNAME) { $errors.Add('Host label mismatch') }
    if ([System.Environment]::OSVersion.Platform -ne [System.PlatformID]::Win32NT) { $errors.Add('Windows required') }
    $actualRoot = (git rev-parse --show-toplevel 2>$null)
    if ($LASTEXITCODE -ne 0 -or -not $actualRoot) { $errors.Add('Git checkout cannot be proven') }
    if ($errors.Count -eq 0) {
        $canonicalExpected = [System.IO.Path]::GetFullPath($Root).TrimEnd('\')
        $canonicalActual = [System.IO.Path]::GetFullPath($actualRoot).TrimEnd('\')
        if ($canonicalExpected -cne $canonicalActual) { $errors.Add('Checkout root mismatch') }
        $helper = [System.IO.Path]::GetFullPath($PSCommandPath)
        $expectedHelper = [System.IO.Path]::Combine($canonicalActual, '.agents', 'skills', 'yuta-federated-control-towers', 'scripts', 'state-helper.ps1')
        if ($helper -cne $expectedHelper) { $errors.Add('Unapproved helper path') }
        $item = Get-Item -LiteralPath $canonicalActual
        while ($null -ne $item) {
            if (($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) { $errors.Add('Checkout ancestry contains a reparse point'); break }
            $item = $item.Parent
        }
        $driveLetter = [System.IO.Path]::GetPathRoot($canonicalActual).Substring(0,1)
        $drive = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='$($driveLetter):'"
        if ($null -eq $drive -or $drive.DriveType -ne 3 -or $drive.FileSystem -cne 'NTFS') { $errors.Add('Local NTFS volume cannot be proven') }
    }
    if ($errors.Count -gt 0) { return [pscustomobject]@{ Valid = $false; Errors = @($errors.ToArray()); RuntimeStateCreated = $false; LockAcquired = $false } }
    $reservedPath = [System.IO.Path]::Combine($canonicalActual, 'tmp', 'yuta-federated-control-towers', $ContextId)
    return [pscustomobject]@{
        Valid = $true; Errors = @(); Platform = 'Windows'; FileSystem = 'NTFS'; CheckoutRoot = $canonicalActual
        HostLabel = $HostLabel; ExecutionContextId = $ContextId; ReservedStatePath = $reservedPath
        ReservedLockPath = [System.IO.Path]::Combine($reservedPath, 'lock')
        RuntimeStateCreated = $false; LockAcquired = $false
    }
}

function Assert-ApprovedFixtureContext([string]$ContextId) {
    if ($ContextId -cnotmatch '^FED-QA-[A-Z0-9_-]{3,60}$') {
        throw 'Phase 2/3 persistence is limited to a synthetic FED-QA execution context'
    }
}

function Assert-PlainPath([string]$Path) {
    $item = Get-Item -LiteralPath $Path -ErrorAction SilentlyContinue
    if ($null -ne $item -and ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
        throw "Reparse point in approved runtime path: $Path"
    }
}

function Get-ApprovedContextPath([string]$Root, [string]$HostLabel, [string]$ContextId, [bool]$Create, [bool]$Live = $false) {
    if ($Live) {
        if ($ContextId -cmatch '^FED-QA-' -or $ContextId -cnotmatch '^[A-Z][A-Z0-9_-]{2,79}$') {
            throw 'BLOCKED: live context must be non-fixture and exact'
        }
    } else { Assert-ApprovedFixtureContext $ContextId }
    $preflight = Get-Preflight $Root $HostLabel $ContextId
    if (-not $preflight.Valid) { throw "Preflight blocked: $($preflight.Errors -join ', ')" }
    $tmp = [System.IO.Path]::Combine($preflight.CheckoutRoot, 'tmp')
    $federationRoot = [System.IO.Path]::Combine($tmp, 'yuta-federated-control-towers')
    foreach ($path in @($tmp, $federationRoot, $preflight.ReservedStatePath)) { Assert-PlainPath $path }
    if ($Create) {
        foreach ($path in @($tmp, $federationRoot, $preflight.ReservedStatePath)) {
            [void][System.IO.Directory]::CreateDirectory($path)
            Assert-PlainPath $path
        }
    }
    return $preflight
}

function Invoke-ExclusiveLocalLock([string]$Root, [string]$HostLabel, [string]$ContextId, [scriptblock]$Body, [bool]$Live = $false) {
    $checked = Get-ApprovedContextPath $Root $HostLabel $ContextId $false $Live
    $contextExisted = [System.IO.Directory]::Exists($checked.ReservedStatePath)
    $lockExisted = [System.IO.File]::Exists($checked.ReservedLockPath)
    $preflight = Get-ApprovedContextPath $Root $HostLabel $ContextId $true $Live
    $preflight | Add-Member -NotePropertyName ContextExistedBeforeLock -NotePropertyValue $contextExisted -Force
    $preflight | Add-Member -NotePropertyName LockExistedBeforeAcquire -NotePropertyValue $lockExisted -Force
    $preflight | Add-Member -NotePropertyName IsLive -NotePropertyValue $Live -Force
    Assert-PlainPath $preflight.ReservedLockPath
    $stream = $null
    try {
        $stream = [System.IO.FileStream]::new(
            $preflight.ReservedLockPath,
            [System.IO.FileMode]::OpenOrCreate,
            [System.IO.FileAccess]::ReadWrite,
            [System.IO.FileShare]::None
        )
        $preflight | Add-Member -NotePropertyName LockStream -NotePropertyValue $stream -Force
        & $Body $preflight
    } catch [System.IO.IOException] {
        throw "BLOCKED: exclusive local lock unavailable or state I/O uncertain for $ContextId"
    } finally {
        if ($null -ne $stream) { $stream.Dispose() }
    }
}

function Invoke-ExistingReadOnlyLock([psobject]$Binding, [scriptblock]$Body) {
    if (-not [System.IO.Directory]::Exists($Binding.ReservedStatePath) -or
        -not [System.IO.File]::Exists($Binding.ReservedLockPath)) {
        throw 'BLOCKED: read-only reconciliation requires existing context and lock file'
    }
    Assert-PlainPath $Binding.ReservedLockPath
    $stream = $null
    try {
        $stream = [System.IO.FileStream]::new(
            $Binding.ReservedLockPath,
            [System.IO.FileMode]::Open,
            [System.IO.FileAccess]::Read,
            [System.IO.FileShare]::None
        )
        $Binding | Add-Member -NotePropertyName LockStream -NotePropertyValue $stream -Force
        & $Body $Binding
    } catch [System.IO.IOException] {
        throw 'BLOCKED: exclusive read-only context lock unavailable or state I/O uncertain'
    } finally {
        if ($null -ne $stream) { $stream.Dispose() }
    }
}

function Copy-JsonRecord([System.Collections.IDictionary]$Record) {
    return (ConvertFrom-Json -InputObject (ConvertTo-Json -InputObject $Record -Depth 40 -Compress) -AsHashtable -Depth 40 -DateKind String)
}

function Get-CanonicalRecordText([System.Collections.IDictionary]$Record) {
    $inputText = ConvertTo-Json -InputObject $Record -Depth 40 -Compress
    $document = [System.Text.Json.JsonDocument]::Parse($inputText)
    $stream = [System.IO.MemoryStream]::new()
    $writer = [System.Text.Json.Utf8JsonWriter]::new($stream)
    try {
        Write-CanonicalJson $writer $document.RootElement '' $true
        $writer.Flush()
        return [System.Text.Encoding]::UTF8.GetString($stream.ToArray())
    } finally { $writer.Dispose(); $stream.Dispose(); $document.Dispose() }
}

function Get-ComparableValueText([object]$Value) {
    return (ConvertTo-Json -InputObject $Value -Depth 40 -Compress)
}

function Assert-ExactAuthorityShape([System.Collections.IDictionary]$Record, [System.Collections.IDictionary]$Fields, [string]$Name) {
    $document=[System.Text.Json.JsonDocument]::Parse((ConvertTo-Json -InputObject $Record -Depth 40 -Compress))
    try {
        $errors=[System.Collections.Generic.List[string]]::new()
        Test-ExactShape $document.RootElement $Fields $Name $errors
        if ($errors.Count) { throw "BLOCKED: invalid $Name shape: $($errors -join ', ')" }
    } finally { $document.Dispose() }
}

function Get-AuthorityArtifact([string]$CheckoutRoot, [string]$RelativePath, [string]$ExpectedHash, [System.Collections.IDictionary]$Fields, [string]$Name) {
    if ($RelativePath -cnotmatch '^docs/reviews/federated-control-towers-foundation/decisions/[A-Za-z0-9_./-]+\.json$') {
        throw "BLOCKED: $Name path is outside the approved authority class"
    }
    if ($ExpectedHash) { Assert-CurrentArtifactHash $CheckoutRoot $RelativePath $ExpectedHash }
    $full=[System.IO.Path]::GetFullPath([System.IO.Path]::Combine($CheckoutRoot,$RelativePath))
    if (-not $full.StartsWith("$CheckoutRoot\",[System.StringComparison]::Ordinal) -or -not [System.IO.File]::Exists($full)) {
        throw "BLOCKED: $Name is absent or outside the exact checkout"
    }
    $bytes=[System.IO.File]::ReadAllBytes($full)
    try { $text=[System.Text.UTF8Encoding]::new($false,$true).GetString($bytes) }
    catch { throw "BLOCKED: $Name is not strict UTF-8" }
    if ($text.StartsWith([char]0xFEFF)) { throw "BLOCKED: $Name contains a BOM" }
    try { $document=[System.Text.Json.JsonDocument]::Parse($text) }
    catch { throw "BLOCKED: malformed $Name JSON" }
    try {
        $errors=[System.Collections.Generic.List[string]]::new()
        Test-RecursiveKeys $document.RootElement '$' $errors
        Test-ExactShape $document.RootElement $Fields '$' $errors
        if ($errors.Count -ne 0 -or $text -cne (Get-CanonicalElementText $document.RootElement)) {
            throw "BLOCKED: $Name is duplicate, unknown or noncanonical"
        }
        $hash=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($bytes)).ToLowerInvariant()
        if ($ExpectedHash -and $hash -cne $ExpectedHash) { throw "BLOCKED: $Name hash mismatch" }
        Assert-CurrentArtifactHash $CheckoutRoot $RelativePath $hash
        return [pscustomobject]@{ Record=(ConvertFrom-Json -InputObject $text -AsHashtable -Depth 40 -DateKind String); Hash=$hash; Path=$RelativePath }
    } finally { $document.Dispose() }
}

function Get-AuthorityDecision([string]$CheckoutRoot, [string]$DecisionId, [string]$ContextId, [string]$LineageId) {
    if ($DecisionId -cnotmatch '^[0-9a-f]{64}$') { throw 'BLOCKED: invalid decision identity' }
    $root='docs/reviews/federated-control-towers-foundation/decisions'
    $semanticFields=[ordered]@{
        RECORD_VERSION='integer'; DECISION_ID='string'; DECISION_TYPE='string'; STATUS='string'; DECISION_SCOPE='object'
        DECISION_PAYLOAD='object'; PRE_DECISION_DESCRIPTOR_PATH='string'; PRE_DECISION_DESCRIPTOR_SHA256='string'
        APPROVAL_RECORD_PATH='string'; APPROVAL_RECORD_SHA256='string'; RESULT_HASH='string'; DECISION_ITEM_ID='string'
    }
    $descriptorFields=[ordered]@{
        DESCRIPTOR_VERSION='integer'; DECISION_TYPE='string'; EXECUTION_CONTEXT_ID='string'; CAUSAL_LINEAGE_ID='string'
        BUCKET_KEY='nullable-string'; DECISION_SCOPE='object'; PROPOSED_DECISION_PAYLOAD='object'; PURPOSE_REFERENCE='string'
    }
    $approvalFieldsExact=[ordered]@{
        APPROVAL_RECORD_VERSION='integer'; APPROVAL_RECORD_ID='string'; APPROVAL_STATUS='string'; DECISION_ID='string'
        DECISION_TYPE='string'; DECISION_SCOPE='object'; PRE_DECISION_DESCRIPTOR_PATH='string'; PRE_DECISION_DESCRIPTOR_SHA256='string'
        ACCEPTED_GATE_RESULT_RECORD_PATH='string'; ACCEPTED_GATE_RESULT_RECORD_SHA256='string'; RESULT_HASH='string'
        DECISION_ITEM_ID='string'; CURRENT_USER_DECISION='string'; REVIEW_PACKET_PATH='string'
        REVIEW_PACKET_PRE_APPROVAL_SHA256='string'; APPROVAL_RECORDING_COMMAND_ID='string'; CREATED_AT_UTC='string'
    }
    $resultFields=[ordered]@{ RECORD_VERSION='integer'; RESULT_HASH='string'; RESULT_CORE='object'; RECORDED_BY_COMMAND_ID='string'; RECORDED_AT_UTC='string' }
    $coreFields=[ordered]@{
        PROTOCOL_VERSION='integer'; RUN_ID='string'; ROUND_ID='integer'; COMMAND_ID='string'; CAUSAL_LINEAGE_ID='string'
        STAGE='string'; STATUS='string'; CURRENT_USER_DECISION='string'; DECISION_ITEM_ID='string'; DECISION_ID='string'
        DECISION_TYPE='string'; DECISION_SCOPE='object'; REVIEW_PACKET_PATH='string'; REVIEW_PACKET_PRE_APPROVAL_SHA256='string'
    }
    $semantic=Get-AuthorityArtifact $CheckoutRoot "$root/$DecisionId.json" '' $semanticFields 'semantic decision'
    $s=$semantic.Record
    if ($s.RECORD_VERSION -ne 1 -or $s.STATUS -cne 'APPROVED' -or $s.DECISION_ID -cne $DecisionId -or -not $decisionTokens.ContainsKey([string]$s.DECISION_TYPE)) {
        throw 'BLOCKED: semantic decision has unsupported version, state or type'
    }
    Assert-ExactAuthorityShape $s.DECISION_SCOPE $decisionScopeFields 'decision scope'
    if ($s.DECISION_SCOPE.EXECUTION_CONTEXT_ID -cne $ContextId -or $s.DECISION_SCOPE.CAUSAL_LINEAGE_ID -cne $LineageId) {
        throw 'BLOCKED: decision scope differs from execution context or lineage'
    }
    $descriptor=Get-AuthorityArtifact $CheckoutRoot $s.PRE_DECISION_DESCRIPTOR_PATH $s.PRE_DECISION_DESCRIPTOR_SHA256 $descriptorFields 'pre-decision descriptor'
    $d=$descriptor.Record
    if ($s.PRE_DECISION_DESCRIPTOR_PATH -cne "$root/descriptors/$DecisionId.json" -or $d.DESCRIPTOR_VERSION -ne 1 -or
        $d.DECISION_TYPE -cne $s.DECISION_TYPE -or $d.EXECUTION_CONTEXT_ID -cne $ContextId -or $d.CAUSAL_LINEAGE_ID -cne $LineageId -or
        (Get-CanonicalRecordText $d.DECISION_SCOPE) -cne (Get-CanonicalRecordText $s.DECISION_SCOPE) -or
        (Get-CanonicalRecordText $d.PROPOSED_DECISION_PAYLOAD) -cne (Get-CanonicalRecordText $s.DECISION_PAYLOAD) -or
        $d.BUCKET_KEY -cne $s.DECISION_SCOPE.BUCKET_KEY) { throw 'BLOCKED: descriptor and semantic decision disagree' }
    $idInput=[ordered]@{ DECISION_TYPE=$d.DECISION_TYPE; DECISION_SCOPE=$d.DECISION_SCOPE; PROPOSED_DECISION_PAYLOAD=$d.PROPOSED_DECISION_PAYLOAD }
    $computedId=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes((Get-CanonicalRecordText $idInput)))).ToLowerInvariant()
    if ($computedId -cne $DecisionId) { throw 'BLOCKED: decision ID does not bind approved semantics' }
    $approval=Get-AuthorityArtifact $CheckoutRoot $s.APPROVAL_RECORD_PATH $s.APPROVAL_RECORD_SHA256 $approvalFieldsExact 'approval record'
    $a=$approval.Record
    if ($a.APPROVAL_RECORD_VERSION -ne 1 -or $a.APPROVAL_STATUS -cne 'APPROVED' -or
        $a.DECISION_ID -cne $DecisionId -or $a.DECISION_TYPE -cne $s.DECISION_TYPE -or
        (Get-CanonicalRecordText $a.DECISION_SCOPE) -cne (Get-CanonicalRecordText $s.DECISION_SCOPE) -or
        $a.PRE_DECISION_DESCRIPTOR_PATH -cne $descriptor.Path -or $a.PRE_DECISION_DESCRIPTOR_SHA256 -cne $descriptor.Hash -or
        $a.RESULT_HASH -cne $s.RESULT_HASH -or $a.DECISION_ITEM_ID -cne $s.DECISION_ITEM_ID -or
        $a.CURRENT_USER_DECISION -cne $decisionTokens[$s.DECISION_TYPE]) { throw 'BLOCKED: approval does not bind exact decision and accepted token' }
    $idInputs=[ordered]@{ DECISION_ID=$DecisionId; RESULT_HASH=$a.RESULT_HASH; DECISION_ITEM_ID=$a.DECISION_ITEM_ID; REVIEW_PACKET_PRE_APPROVAL_SHA256=$a.REVIEW_PACKET_PRE_APPROVAL_SHA256; APPROVAL_RECORDING_COMMAND_ID=$a.APPROVAL_RECORDING_COMMAND_ID }
    $approvalId=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes((Get-CanonicalRecordText $idInputs)))).ToLowerInvariant()
    if ($a.APPROVAL_RECORD_ID -cne $approvalId -or $approval.Path -cne "$root/approvals/$approvalId.json") { throw 'BLOCKED: approval ID is not canonical' }
    $result=Get-AuthorityArtifact $CheckoutRoot $a.ACCEPTED_GATE_RESULT_RECORD_PATH $a.ACCEPTED_GATE_RESULT_RECORD_SHA256 $resultFields 'accepted gate result'
    $r=$result.Record
    Assert-ExactAuthorityShape $r.RESULT_CORE $coreFields 'accepted result core'
    $core=$r.RESULT_CORE
    $resultHash=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes((Get-CanonicalRecordText $core)))).ToLowerInvariant()
    $itemMatch=[regex]::Match([string]$core.DECISION_ITEM_ID,'^(.+:[1-9][0-9]*)#[1-9][0-9]*$',[System.Text.RegularExpressions.RegexOptions]::CultureInvariant)
    $recordingMatch=[regex]::Match([string]$r.RECORDED_BY_COMMAND_ID,'^(.+):([1-9][0-9]*)$',[System.Text.RegularExpressions.RegexOptions]::CultureInvariant)
    if ($r.RECORD_VERSION -ne 1 -or $r.RESULT_HASH -cne $resultHash -or $a.RESULT_HASH -cne $resultHash -or
        $result.Path -cne "$root/gate-results/$resultHash.json" -or $core.PROTOCOL_VERSION -ne 1 -or
        $core.RUN_ID -cnotmatch '^[A-Z0-9][A-Z0-9-]*$' -or
        $core.CAUSAL_LINEAGE_ID -cnotmatch '^[A-Z0-9][A-Z0-9-]*$' -or
        $core.COMMAND_ID -cne "$($core.RUN_ID):$($core.ROUND_ID)" -or $core.ROUND_ID -lt 1 -or
        -not $itemMatch.Success -or $itemMatch.Groups[1].Value -cne $core.COMMAND_ID -or
        $core.CAUSAL_LINEAGE_ID -cne $LineageId -or $core.DECISION_ID -cne $DecisionId -or
        $core.DECISION_TYPE -cne $s.DECISION_TYPE -or
        (Get-CanonicalRecordText $core.DECISION_SCOPE) -cne (Get-CanonicalRecordText $s.DECISION_SCOPE) -or
        $core.CURRENT_USER_DECISION -cne $decisionTokens[$s.DECISION_TYPE] -or
        $core.DECISION_ITEM_ID -cne $a.DECISION_ITEM_ID -or
        $core.REVIEW_PACKET_PATH -cne $a.REVIEW_PACKET_PATH -or
        $core.REVIEW_PACKET_PRE_APPROVAL_SHA256 -cne $a.REVIEW_PACKET_PRE_APPROVAL_SHA256) {
        throw 'BLOCKED: accepted Human result is missing or misbound'
    }
    $approvalRecordingMatch=[regex]::Match([string]$a.APPROVAL_RECORDING_COMMAND_ID,'^(.+):([1-9][0-9]*)$',[System.Text.RegularExpressions.RegexOptions]::CultureInvariant)
    $utcPattern='^20[0-9]{2}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]{1,7})?Z$'
    if ($a.CREATED_AT_UTC -cnotmatch $utcPattern -or $r.RECORDED_AT_UTC -cnotmatch $utcPattern) {
        throw 'BLOCKED: accepted-result and approval timestamps must be canonical UTC'
    }
    $approvalTime=[DateTimeOffset]::Parse($a.CREATED_AT_UTC,[System.Globalization.CultureInfo]::InvariantCulture)
    $resultTime=[DateTimeOffset]::Parse($r.RECORDED_AT_UTC,[System.Globalization.CultureInfo]::InvariantCulture)
    if ($core.STAGE -cnotmatch '^[A-Z][A-Z0-9_]*$' -or $core.STATUS -cne 'COMPLETED' -or
        -not $recordingMatch.Success -or $recordingMatch.Groups[1].Value -cne $core.RUN_ID -or
        [long]$recordingMatch.Groups[2].Value -le [long]$core.ROUND_ID -or
        -not $approvalRecordingMatch.Success -or $approvalRecordingMatch.Groups[1].Value -cne $core.RUN_ID -or
        [long]$approvalRecordingMatch.Groups[2].Value -lt [long]$recordingMatch.Groups[2].Value -or
        $approvalTime -lt $resultTime) {
        throw 'BLOCKED: accepted result or recording command has invalid causal order'
    }
    Assert-CurrentArtifactHash $CheckoutRoot $a.REVIEW_PACKET_PATH $a.REVIEW_PACKET_PRE_APPROVAL_SHA256
    $proof=[ordered]@{
        APPROVAL_RECORD_ID=$approvalId; APPROVAL_RECORD_SHA256=$approval.Hash; DECISION_ID=$DecisionId
        DECISION_ITEM_ID=$a.DECISION_ITEM_ID; DECISION_TYPE=$s.DECISION_TYPE; RECORD_VERSION=1
        RESULT_HASH=$resultHash; SEMANTIC_DECISION_RECORD_SHA256=$semantic.Hash
    }
    $proofHash=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes((Get-CanonicalRecordText $proof)))).ToLowerInvariant()
    return [pscustomobject]@{ Decision=$s; ProofEntry=([ordered]@{ CONSUMED_AUTHORITY_PROOF=$proof; CONSUMED_AUTHORITY_PROOF_SHA256=$proofHash }); Descriptor=$d; Approval=$a }
}

function Assert-LiveSelectionPayload([System.Collections.IDictionary]$Decision, [System.Collections.IDictionary]$Source) {
    if ($Decision.DECISION_TYPE -cne 'LIVE_TOWER_SELECTION' -or $decisionTokenMappingVersions.LIVE_TOWER_SELECTION -ne 2) {
        throw 'BLOCKED: unsupported live-selection authority mapping'
    }
    $scope=$Decision.DECISION_SCOPE
    $payload=$Decision.DECISION_PAYLOAD
    Assert-ExactAuthorityShape $payload ([ordered]@{
        INTENDED_ACTION='string'; EXPECTED_SOURCE_RECORD_HASH='string'; EXPECTED_SOURCE_STATE='string'
        EXPECTED_SOURCE_EPOCH='integer'; TARGET_ACTIVATION_EPOCH='integer'; TARGET_RUN_ID='string'
        TARGET_TOWER='object'; REVIEWED_SELECTION_ARTIFACT_PATH='string'
        REVIEWED_SELECTION_ARTIFACT_SHA256='string'
    }) 'live-selection payload'
    Assert-ExactAuthorityShape $payload.TARGET_TOWER $liveTowerFields 'live-selection target'
    Assert-ExactAuthorityShape $payload.TARGET_TOWER.TOWER_ID $towerIdFields 'live-selection tower ID'
    $tower=$payload.TARGET_TOWER
    if ($scope.BUDGET_TYPE -cne 'NONE' -or $scope.BUCKET_KEY -cne 'NONE' -or
        $scope.EXECUTION_CONTEXT_ID -cne $Source.EXECUTION_CONTEXT_ID -or
        ($null -ne $Source.CAUSAL_LINEAGE_ID -and $scope.CAUSAL_LINEAGE_ID -cne $Source.CAUSAL_LINEAGE_ID) -or
        $scope.CAUSAL_LINEAGE_ID -cnotmatch '^[A-Z][A-Z0-9_-]*$' -or $scope.CAUSAL_LINEAGE_ID -ceq 'NONE' -or
        $payload.EXPECTED_SOURCE_RECORD_HASH -cne $Source.RECORD_HASH -or
        $payload.EXPECTED_SOURCE_STATE -cne $Source.STATE -or
        $payload.EXPECTED_SOURCE_EPOCH -ne $Source.ACTIVATION_EPOCH) {
        throw 'BLOCKED: live-selection scope or source ancestry mismatch'
    }
    if ($Source.STATE -cnotin @('INACTIVE','ACTIVE','TERMINAL','REVOKED') -or
        $Source.EXECUTION_STATE -cin @('ACCEPTED','EXECUTING','EXECUTION_UNCERTAIN') -or
        $Source.DELIVERY_STATE -cin @('SENDING','SENT_WAITING_RESPONSE','RESPONSE_GENERATING','DELIVERY_UNCERTAIN')) {
        throw 'BLOCKED: source is not safe for exact live selection'
    }
    $epochStep=if ($Source.STATE -ceq 'ACTIVE') { 2 } else { 1 }
    if ($payload.TARGET_ACTIVATION_EPOCH -ne ([long]$Source.ACTIVATION_EPOCH+$epochStep) -or
        $payload.TARGET_RUN_ID -cnotmatch '^[A-Z0-9][A-Z0-9-]*$' -or
        $payload.TARGET_RUN_ID -cin @($Source.RUN_BINDING | ForEach-Object { $_.RUN_ID })) {
        throw 'BLOCKED: target epoch or fresh run mismatch'
    }
    if ($payload.INTENDED_ACTION -cnotin @('FIRST_ACTIVATION','PAGE_ROTATION','GLOBAL_ROTATION','PAGE_TO_GLOBAL_ESCALATION','GLOBAL_TO_BOUND_PAGE_QA_TRANSFER','REACTIVATION') -or
        ($Source.STATE -ceq 'INACTIVE' -and $payload.INTENDED_ACTION -cne 'FIRST_ACTIVATION') -or
        ($Source.STATE -cin @('TERMINAL','REVOKED') -and $payload.INTENDED_ACTION -cne 'REACTIVATION') -or
        ($Source.STATE -ceq 'ACTIVE' -and $payload.INTENDED_ACTION -cnotin @('PAGE_ROTATION','GLOBAL_ROTATION','PAGE_TO_GLOBAL_ESCALATION','GLOBAL_TO_BOUND_PAGE_QA_TRANSFER'))) {
        throw 'BLOCKED: action is not bound to source state'
    }
    if ($tower.CONTROL_TOWER_ROLE -cne $tower.TOWER_ID.CONTROL_TOWER_ROLE -or
        $tower.CONTROL_TOWER_SCOPE -cne $tower.TOWER_ID.CONTROL_TOWER_SCOPE -or
        $tower.OWNING_PAGE_CHAT_ID -cne $tower.TOWER_ID.OWNING_PAGE_CHAT_ID -or
        $tower.CONTROL_TOWER_INSTANCE -cne $tower.CONVERSATION_ID -or
        [string]::IsNullOrWhiteSpace($tower.PROJECT_ID) -or
        [string]::IsNullOrWhiteSpace($tower.CONVERSATION_ID) -or
        [string]::IsNullOrWhiteSpace($tower.CONVERSATION_TITLE)) {
        throw 'BLOCKED: live-selection target tuple is inconsistent'
    }
    if ($tower.CONTROL_TOWER_ROLE -ceq 'PAGE_CONTROL_TOWER') {
        if ($tower.CONTROL_TOWER_SCOPE -cne 'PAGE_LOCAL' -or
            [string]::IsNullOrWhiteSpace($tower.OWNING_PAGE_CHAT_ID) -or $tower.OWNING_PAGE_CHAT_ID -ceq 'NONE') {
            throw 'BLOCKED: Page tower requires exact owning Page Chat'
        }
    } elseif ($tower.CONTROL_TOWER_ROLE -ceq 'GLOBAL_CONTROL_TOWER') {
        if ($tower.CONTROL_TOWER_SCOPE -cnotin @('CROSS_MODULE','UNCERTAIN','CROSS_PAGE','SHARED','FOUNDATION') -or
            $tower.OWNING_PAGE_CHAT_ID -cne 'NONE') { throw 'BLOCKED: Global tower has invalid scope or owner' }
    } else { throw 'BLOCKED: unknown live-selection role' }
    $parsed=$null
    if (-not [Uri]::TryCreate([string]$tower.CONVERSATION_URL,[UriKind]::Absolute,[ref]$parsed) -or
        $parsed.Scheme -cne 'https' -or $parsed.Host -cne 'chatgpt.com' -or
        $parsed.AbsolutePath -cnotmatch '^/g/([^/]+)/c/([^/]+)$') {
        throw 'BLOCKED: target URL does not bind exact Project and conversation'
    }
    $urlProject=$Matches[1]
    $urlConversation=$Matches[2]
    if ($urlProject -cnotmatch ('^'+[regex]::Escape([string]$tower.PROJECT_ID)+'(?:-[a-z0-9-]+)?$') -or
        $urlConversation -cne $tower.CONVERSATION_ID -or $parsed.Query -or $parsed.Fragment) {
        throw 'BLOCKED: target URL does not bind exact Project and conversation'
    }
    if ($Source.STATE -ceq 'ACTIVE') {
        if ($payload.TARGET_RUN_ID -ceq $Source.ACTIVE_RUN_ID -or
            ($tower.PROJECT_ID -ceq $Source.PROJECT_ID -and $tower.CONVERSATION_ID -ceq $Source.CONVERSATION_ID) -or
            ($payload.INTENDED_ACTION -ceq 'PAGE_ROTATION' -and
                ($Source.CONTROL_TOWER_ROLE -cne 'PAGE_CONTROL_TOWER' -or $tower.CONTROL_TOWER_ROLE -cne 'PAGE_CONTROL_TOWER' -or
                $tower.OWNING_PAGE_CHAT_ID -cne $Source.OWNING_PAGE_CHAT_ID -or $tower.CONTROL_TOWER_SCOPE -cne 'PAGE_LOCAL')) -or
            ($payload.INTENDED_ACTION -ceq 'PAGE_TO_GLOBAL_ESCALATION' -and
                ($Source.CONTROL_TOWER_ROLE -cne 'PAGE_CONTROL_TOWER' -or $tower.CONTROL_TOWER_ROLE -cne 'GLOBAL_CONTROL_TOWER' -or
                $tower.CONTROL_TOWER_SCOPE -cnotin @('CROSS_MODULE','UNCERTAIN'))) -or
            ($payload.INTENDED_ACTION -ceq 'GLOBAL_ROTATION' -and
                ($Source.CONTROL_TOWER_ROLE -cne 'GLOBAL_CONTROL_TOWER' -or $tower.CONTROL_TOWER_ROLE -cne 'GLOBAL_CONTROL_TOWER' -or
                $tower.CONTROL_TOWER_SCOPE -cne $Source.CONTROL_TOWER_SCOPE)) -or
            ($payload.INTENDED_ACTION -ceq 'GLOBAL_TO_BOUND_PAGE_QA_TRANSFER' -and
                -not (Test-BoundPageQaTransfer $Source $tower))) {
            throw 'BLOCKED: rotation or escalation is not bound to source authority'
        }
    }
    Assert-CurrentArtifactHash $Source.CHECKOUT_ROOT $payload.REVIEWED_SELECTION_ARTIFACT_PATH $payload.REVIEWED_SELECTION_ARTIFACT_SHA256
}

function Test-BoundPageQaTransfer([System.Collections.IDictionary]$Source, [System.Collections.IDictionary]$Target) {
    # This is one reviewed QA direction, not a general Global-to-Page router.
    # Synthetic FED-QA contexts exercise the same target and role constraints
    # without reading or mutating the live federation context.
    if ($Source.EXECUTION_CONTEXT_ID -cne 'FEDERATED-CONTROL-TOWERS-FOUNDATION' -and
        $Source.EXECUTION_CONTEXT_ID -cne 'SYNTHETIC_AUTHORITY_QA') { return $false }
    if ($Source.STATE -cne 'ACTIVE' -or $Source.CONTROL_TOWER_ROLE -cne 'GLOBAL_CONTROL_TOWER' -or
        $Source.CONTROL_TOWER_SCOPE -cne 'FOUNDATION' -or $Source.OWNING_PAGE_CHAT_ID -cne 'NONE' -or
        $Target.CONTROL_TOWER_ROLE -cne 'PAGE_CONTROL_TOWER' -or
        $Target.CONTROL_TOWER_SCOPE -cne 'PAGE_LOCAL' -or
        $Target.OWNING_PAGE_CHAT_ID -cne '6a760691-3674-83eb-9347-9e4ef8c60acf' -or
        $Target.PROJECT_ID -cne 'g-p-6a4d778944108191894f8e3657742da4' -or
        $Target.CONVERSATION_ID -cne '6a760691-3674-83eb-9347-9e4ef8c60acf' -or
        $Target.CONTROL_TOWER_INSTANCE -cne '6a760691-3674-83eb-9347-9e4ef8c60acf' -or
        $Target.CONVERSATION_TITLE -cne 'Avis & commentaires v' -or
        $Target.CONVERSATION_URL -cne 'https://chatgpt.com/g/g-p-6a4d778944108191894f8e3657742da4-yuta-sarl/c/6a760691-3674-83eb-9347-9e4ef8c60acf') { return $false }
    if ($Source.EXECUTION_CONTEXT_ID -ceq 'FEDERATED-CONTROL-TOWERS-FOUNDATION' -and
        ($Source.PROJECT_ID -cne 'g-p-6a4d778944108191894f8e3657742da4' -or
         $Source.CONVERSATION_ID -cne '6ab40aa1-ea94-83eb-85be-dafbbef3ddef' -or
         $Source.CONTROL_TOWER_INSTANCE -cne '6ab40aa1-ea94-83eb-85be-dafbbef3ddef')) { return $false }
    return $true
}

function Get-LiveSelectionDecision([psobject]$Binding, [System.Collections.IDictionary]$Source, [string]$SelectedDecisionId) {
    if ($SelectedDecisionId -cnotmatch '^[0-9a-f]{64}$') { throw 'BLOCKED: exact reviewed live-selection DECISION_ID required' }
    $semanticPath="docs/reviews/federated-control-towers-foundation/decisions/$SelectedDecisionId.json"
    $semanticFields=[ordered]@{
        RECORD_VERSION='integer'; DECISION_ID='string'; DECISION_TYPE='string'; STATUS='string'; DECISION_SCOPE='object'
        DECISION_PAYLOAD='object'; PRE_DECISION_DESCRIPTOR_PATH='string'; PRE_DECISION_DESCRIPTOR_SHA256='string'
        APPROVAL_RECORD_PATH='string'; APPROVAL_RECORD_SHA256='string'; RESULT_HASH='string'; DECISION_ITEM_ID='string'
    }
    $semantic=Get-AuthorityArtifact $Binding.CheckoutRoot $semanticPath '' $semanticFields 'live-selection semantic decision'
    if ($semantic.Record.DECISION_TYPE -cne 'LIVE_TOWER_SELECTION') { throw 'BLOCKED: decision is not typed live selection' }
    $lineage=[string]$semantic.Record.DECISION_SCOPE.CAUSAL_LINEAGE_ID
    $verified=Get-AuthorityDecision $Binding.CheckoutRoot $SelectedDecisionId $Binding.ExecutionContextId $lineage
    Assert-LiveSelectionPayload $verified.Decision $Source
    return $verified
}

function Assert-LiveTransactionContinuation([string]$Line, [System.Collections.IDictionary]$State, [System.Collections.IDictionary]$Decision, [string]$IntentEventHash) {
    # This validates transaction identity and bounded evaluation data only. The
    # caller's JSON cannot authenticate a browser observation or a Human Gate.
    if ([string]::IsNullOrWhiteSpace($Line)) { throw 'BLOCKED: transaction continuation missing' }
    try { $document=[System.Text.Json.JsonDocument]::Parse($Line) }
    catch { throw 'BLOCKED: malformed transaction continuation' }
    try {
        $errors=[System.Collections.Generic.List[string]]::new()
        Test-RecursiveKeys $document.RootElement '$' $errors
        $fields=[ordered]@{
            CONTINUATION_KIND='string'; DECISION_ID='string'; EXECUTION_CONTEXT_ID='string'
            CAUSAL_LINEAGE_ID='string'; TARGET_RUN_ID='string'; ACTIVATION_EPOCH='integer'
            TOWER_ID='object'; CONTROL_TOWER_INSTANCE='string'
            PROJECT_ID='string'; CONVERSATION_ID='string'; CONVERSATION_TITLE='string'; CONVERSATION_URL='string'
            PROTOCOL_VERSION='integer'; ROUND_ID='integer'; COMMAND_ID='string'
            HANDSHAKE_SHA256='string'; COMMAND_SHA256='string'; RESULT_SHA256='string'; EVALUATION_SHA256='string'
            EVALUATION_STATUS='string'; DELIVERY_STATE='string'; EXECUTION_STATE='string'
            ACTION='string'; REPOSITORY_MUTATION='string'
            PROBE_INTENT_EVENT_HASH='string'; OBSERVED_AT_UTC='string'
        }
        Test-ExactShape $document.RootElement $fields '$' $errors
        if ($errors.Count -ne 0 -or $Line -cne (Get-CanonicalElementText $document.RootElement)) {
            throw 'BLOCKED: transaction continuation must be complete canonical metadata'
        }
        $observed=ConvertFrom-Json -InputObject $Line -AsHashtable -Depth 10 -DateKind String
        $target=$Decision.DECISION_PAYLOAD.TARGET_TOWER
        if ($observed.CONTINUATION_KIND -cne 'CONTROL_TOWER_EVALUATION_INPUT' -or
            $observed.DECISION_ID -cne $Decision.DECISION_ID -or
            $observed.EXECUTION_CONTEXT_ID -cne $State.EXECUTION_CONTEXT_ID -or
            $observed.CAUSAL_LINEAGE_ID -cne $State.CAUSAL_LINEAGE_ID -or
            $observed.TARGET_RUN_ID -cne $State.ACTIVE_RUN_ID -or
            $observed.ACTIVATION_EPOCH -ne $State.ACTIVATION_EPOCH -or
            (Get-ComparableValueText $observed.TOWER_ID) -cne (Get-ComparableValueText $target.TOWER_ID) -or
            $observed.CONTROL_TOWER_INSTANCE -cne $target.CONTROL_TOWER_INSTANCE -or
            $observed.PROJECT_ID -cne $target.PROJECT_ID -or
            $observed.CONVERSATION_ID -cne $target.CONVERSATION_ID -or
            $observed.CONVERSATION_TITLE -cne $target.CONVERSATION_TITLE -or
            $observed.CONVERSATION_URL -cne $target.CONVERSATION_URL -or
            $observed.PROTOCOL_VERSION -ne 1 -or $observed.ROUND_ID -ne 1 -or
            $observed.COMMAND_ID -cne "$($State.ACTIVE_RUN_ID):1" -or
            $observed.PROBE_INTENT_EVENT_HASH -cne $IntentEventHash -or
            $observed.ACTION -cne 'READ_ONLY' -or $observed.REPOSITORY_MUTATION -cne 'NONE' -or
            $observed.OBSERVED_AT_UTC -cnotmatch '^20[0-9]{2}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]{1,7})?Z$') {
            throw 'BLOCKED: transaction continuation is stale, uncertain or misbound'
        }
        if ($observed.DELIVERY_STATE -ceq 'DELIVERY_UNCERTAIN') {
            $disposition='DELIVERY_UNCERTAIN'
        } elseif ($observed.EXECUTION_STATE -ceq 'EXECUTION_UNCERTAIN') {
            $disposition='EXECUTION_UNCERTAIN'
        } elseif ($observed.DELIVERY_STATE -ceq 'RESPONSE_COMPLETE' -and
                  $observed.EXECUTION_STATE -ceq 'COMPLETED' -and
                  $observed.EVALUATION_STATUS -cin @('PASS','FAIL')) {
            $disposition=if ($observed.EVALUATION_STATUS -ceq 'PASS') { 'COMPLETE' } else { 'EVALUATION_FAILED' }
        } else {
            throw 'BLOCKED: transaction continuation has no attributable terminal disposition'
        }
        if ($disposition -cin @('COMPLETE','EVALUATION_FAILED')) {
            foreach ($key in @('HANDSHAKE_SHA256','COMMAND_SHA256','RESULT_SHA256','EVALUATION_SHA256')) {
                if ($observed[$key] -cnotmatch '^[0-9a-f]{64}$' -or $observed[$key] -ceq ('0' * 64)) {
                    throw 'BLOCKED: evaluated round hash is missing'
                }
            }
        } else {
            if ($observed.EVALUATION_STATUS -cne 'UNKNOWN') { throw 'BLOCKED: uncertain continuation cannot claim evaluation' }
        }
        $canonical=Get-CanonicalRecordText $observed
        $hash=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes($canonical))).ToLowerInvariant()
        return [pscustomobject]@{ Disposition=$disposition; InputHash=$hash; Input=$observed }
    } finally { $document.Dispose() }
}

function Assert-CurrentArtifactHash([string]$CheckoutRoot, [string]$RelativePath, [string]$ExpectedHash) {
    if ([string]::IsNullOrWhiteSpace($RelativePath) -or [System.IO.Path]::IsPathRooted($RelativePath) -or
        $RelativePath -match '(^|[\\/])\.\.([\\/]|$)' -or $ExpectedHash -cnotmatch '^[0-9a-f]{64}$') {
        throw 'BLOCKED: invalid canonical artifact reference'
    }
    $fullPath=[System.IO.Path]::GetFullPath([System.IO.Path]::Combine($CheckoutRoot,$RelativePath))
    if (-not $fullPath.StartsWith("$CheckoutRoot\",[System.StringComparison]::Ordinal) -or
        -not [System.IO.File]::Exists($fullPath)) { throw 'BLOCKED: reviewed artifact missing or outside checkout' }
    $cursorPath=$fullPath
    while ($cursorPath.StartsWith($CheckoutRoot,[System.StringComparison]::Ordinal)) {
        $cursor=Get-Item -LiteralPath $cursorPath
        if (($cursor.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'BLOCKED: reviewed artifact resolves through reparse point' }
        if ($cursorPath -ceq $CheckoutRoot) { break }
        $cursorPath=[System.IO.Path]::GetDirectoryName($cursorPath)
    }
    $actual=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.IO.File]::ReadAllBytes($fullPath))).ToLowerInvariant()
    if ($actual -cne $ExpectedHash) { throw 'BLOCKED: reviewed artifact SHA-256 drift' }
}

function Write-DurableNewFile([string]$Path, [string]$Text) {
    if ([System.IO.File]::Exists($Path)) { throw "BLOCKED: immutable file already exists: $Path" }
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    $stream = [System.IO.FileStream]::new($Path, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
    try { $stream.Write($bytes, 0, $bytes.Length); $stream.Flush($true) }
    finally { $stream.Dispose() }
    if ([System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8) -cne $Text) { throw 'BLOCKED: durable read-back mismatch' }
}

function Write-AtomicSnapshot([string]$Path, [string]$Text) {
    $temporary = "$Path.tmp-$([Guid]::NewGuid().ToString('N'))"
    $backup = $null
    Write-DurableNewFile $temporary $Text
    if ([System.IO.File]::Exists($Path)) {
        $backup = "$Path.backup-$([Guid]::NewGuid().ToString('N'))"
        [System.IO.File]::Replace($temporary, $Path, $backup)
    } else {
        [System.IO.File]::Move($temporary, $Path)
    }
    if ([System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8) -cne $Text) { throw 'BLOCKED: committed snapshot read-back mismatch' }
    if ($backup) { [System.IO.File]::Delete($backup) }
}

function Test-NoOrphanFiles([string]$ContextPath, [bool]$AllowSnapshotCrashArtifacts = $false) {
    if (-not [System.IO.Directory]::Exists($ContextPath)) { return }
    $known=@('lock','activation.json','journal','handoffs')
    $unknownRoot = @(Get-ChildItem -LiteralPath $ContextPath -Force | Where-Object {
        $_.Name -cnotin $known -and
        (-not $AllowSnapshotCrashArtifacts -or $_.PSIsContainer -or $_.Name -cnotmatch '^activation\.json\.(tmp|backup)-[0-9a-f]{32}$')
    })
    if ($unknownRoot.Count -gt 0) { throw 'BLOCKED: orphan or unknown context-root file' }
    foreach ($member in Get-ChildItem -LiteralPath $ContextPath -Force) {
        if ($member.Name -cin @('lock','activation.json') -and $member.PSIsContainer) { throw 'BLOCKED: runtime file path is a directory' }
        if ($member.Name -cin @('journal','handoffs') -and -not $member.PSIsContainer) { throw 'BLOCKED: runtime directory path is a file' }
        Assert-PlainPath $member.FullName
    }
    $snapshotTemp = @(Get-ChildItem -LiteralPath $ContextPath -File -Filter 'activation.json.tmp-*' -ErrorAction SilentlyContinue)
    if ($snapshotTemp.Count -gt 0 -and -not $AllowSnapshotCrashArtifacts) { throw 'BLOCKED: orphan snapshot temporary file' }
    $journalPath = [System.IO.Path]::Combine($ContextPath, 'journal')
    if ([System.IO.Directory]::Exists($journalPath)) {
        Assert-PlainPath $journalPath
        $unknownJournal = @(Get-ChildItem -LiteralPath $journalPath -Force | Where-Object { $_.Name -cnotmatch '^[0-9]+\.json$' -or $_.PSIsContainer })
        if ($unknownJournal.Count -gt 0) { throw 'BLOCKED: orphan or unknown journal file' }
    }
    $handoffPath = [System.IO.Path]::Combine($ContextPath, 'handoffs')
    if ([System.IO.Directory]::Exists($handoffPath)) { Assert-PlainPath $handoffPath }
}

function Read-ReconciledContext([psobject]$Binding, [string]$PendingHandoffId = '', [bool]$ReadOnlyNoRepair = $false) {
    if ($null -eq $Binding.LockStream -or -not $Binding.LockStream.CanRead -or
        $Binding.LockStream.Name -cne $Binding.ReservedLockPath) {
        throw 'BLOCKED: reconciliation requires the exact held context lock'
    }
    $contextPath = $Binding.ReservedStatePath
    Test-NoOrphanFiles $contextPath $true
    $snapshotPath = [System.IO.Path]::Combine($contextPath, 'activation.json')
    $journalPath = [System.IO.Path]::Combine($contextPath, 'journal')
    $crashArtifacts=@(Get-ChildItem -LiteralPath $contextPath -File -Force | Where-Object { $_.Name -cmatch '^activation\.json\.(tmp|backup)-[0-9a-f]{32}$' })
    if ($ReadOnlyNoRepair -and $crashArtifacts.Count -gt 0) {
        throw 'BLOCKED: read-only reconciliation cannot repair snapshot artifacts'
    }
    $snapshotTemps=@($crashArtifacts | Where-Object { $_.Name -cmatch '^activation\.json\.tmp-' })
    $snapshotExists = [System.IO.File]::Exists($snapshotPath)
    $eventFiles = @()
    if ([System.IO.Directory]::Exists($journalPath)) { $eventFiles = @(Get-ChildItem -LiteralPath $journalPath -File -Filter '*.json') }
    if (-not $snapshotExists -and $eventFiles.Count -eq 0) {
        if ([System.IO.Directory]::Exists($journalPath) -or [System.IO.Directory]::Exists([System.IO.Path]::Combine($contextPath,'handoffs'))) {
            throw 'BLOCKED: empty snapshot with orphan runtime directories'
        }
        return [pscustomobject]@{ Status='MISSING'; Snapshot=$null; LastEvent=$null; ExecutableAuthority=$false }
    }
    if (-not $snapshotExists -or $eventFiles.Count -eq 0) { throw 'BLOCKED: snapshot/journal pair incomplete' }
    $actualText = [System.IO.File]::ReadAllText($snapshotPath, [System.Text.Encoding]::UTF8)
    $actualValidation = Test-Record $actualText Activation $Binding.ExecutionContextId $Binding.CheckoutRoot $Binding.HostLabel
    if (-not $actualValidation.Valid) { throw "BLOCKED: invalid activation snapshot: $($actualValidation.Errors -join ', ')" }
    $actual = ConvertFrom-Json -InputObject $actualText -AsHashtable -Depth 40 -DateKind String
    $pendingAuthoritySnapshot = $eventFiles.Count -eq ([long]$actual.REVISION + 2)
    if ($ReadOnlyNoRepair -and $pendingAuthoritySnapshot) {
        throw 'BLOCKED: read-only reconciliation cannot repair journal-ahead authority state'
    }
    if (-not $pendingAuthoritySnapshot -and $eventFiles.Count -ne ([long]$actual.REVISION + 1)) {
        throw 'BLOCKED: journal revision count does not match snapshot'
    }
    $priorEventHash = $null
    $priorRecordHash = $null
    $priorSnapshot = $null
    $lastEvent = $null
    $reconstructed = $null
    $eventIds = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $commandPhases = [System.Collections.Generic.Dictionary[string,int]]::new([System.StringComparer]::Ordinal)
    $persistedHandoffIds = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $persistedHandoffHashes = [System.Collections.Generic.Dictionary[string,string]]::new([System.StringComparer]::Ordinal)
    $supersededHandoffIds = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $pendingProbeRun = $null
    $pendingProbeHash = $null
    $pendingProbeKind = $null
    $snapshotBeforePendingAuthority = $null
    for ($revision = 0; $revision -lt $eventFiles.Count; $revision++) {
        $expectedPath = [System.IO.Path]::Combine($journalPath, "$revision.json")
        if (-not [System.IO.File]::Exists($expectedPath)) { throw 'BLOCKED: missing or non-contiguous journal revision' }
        $eventText = [System.IO.File]::ReadAllText($expectedPath, [System.Text.Encoding]::UTF8)
        $eventValidation = Test-Record $eventText Journal $Binding.ExecutionContextId $Binding.CheckoutRoot $Binding.HostLabel
        if (-not $eventValidation.Valid) { throw "BLOCKED: invalid journal event: $($eventValidation.Errors -join ', ')" }
        $event = ConvertFrom-Json -InputObject $eventText -AsHashtable -Depth 40 -DateKind String
        if (-not $eventIds.Add([string]$event.EVENT_ID)) { throw 'BLOCKED: replayed journal EVENT_ID' }
        if ($event.EVENT_KIND -ceq 'HANDOFF_PERSISTED') {
            $refs=@($event.EVIDENCE_REFERENCES | Where-Object { $_ -cmatch '^HANDOFF_ID:(.+)$' })
            $hashRefs=@($event.EVIDENCE_REFERENCES | Where-Object { $_ -cmatch '^HANDOFF_HASH:([0-9a-f]{64})$' })
            if ($refs.Count -ne 1 -or $hashRefs.Count -ne 1 -or -not $persistedHandoffIds.Add($refs[0].Substring(11))) {
                throw 'BLOCKED: duplicate or missing persisted handoff journal identity'
            }
            $persistedHandoffHashes[$refs[0].Substring(11)]=$hashRefs[0].Substring(13)
        }
        if ($event.EVENT_KIND -ceq 'HANDOFF_SUPERSEDED') {
            $refs=@($event.EVIDENCE_REFERENCES | Where-Object { $_ -cmatch '^HANDOFF_ID:(.+)$' })
            if ($refs.Count -ne 1 -or -not $persistedHandoffIds.Contains($refs[0].Substring(11))) {
                throw 'BLOCKED: supersede without persisted handoff'
            }
            if (-not $supersededHandoffIds.Add($refs[0].Substring(11))) { throw 'BLOCKED: duplicate handoff supersede event' }
        }
        if ($event.EVENT_KIND -ceq 'PROBE_INTENT') {
            if ($pendingProbeRun) { throw 'BLOCKED: duplicate or overlapping probe intent' }
            if ($event.ROUND_ID -ne 1 -or $event.COMMAND_ID -cne "$($event.RUN_ID):1") {
                throw 'BLOCKED: probe round or command identity mismatch'
            }
            $probeRefs=@($event.EVIDENCE_REFERENCES | Where-Object {
                $_ -cmatch '^(PHASE3_SYNTHETIC_PROBE_TRACE|LIVE_SELECTION_DECISION_ID):[0-9a-f]{64}$'
            })
            if ($probeRefs.Count -ne 1) { throw 'BLOCKED: probe intent lacks one exact identity' }
            $pendingProbeRun=$event.RUN_ID
            $pendingProbeKind=if ($probeRefs[0].StartsWith('LIVE_SELECTION_DECISION_ID:',[System.StringComparison]::Ordinal)) { 'LIVE' } else { 'SYNTHETIC' }
            $pendingProbeHash=$probeRefs[0].Split(':')[1]
        }
        if ($event.EVENT_KIND -ceq 'PROBE_OUTCOME') {
            $expectedRef=if ($pendingProbeKind -ceq 'LIVE') { 'CONTROL_TOWER_EVALUATION_INPUT' } else { 'PHASE3_SYNTHETIC_PROBE_VERIFIED' }
            $outcomeRefs=@($event.EVIDENCE_REFERENCES | Where-Object { $_ -cmatch "^${expectedRef}:[0-9a-f]{64}$" })
            $decisionRefs=@($event.EVIDENCE_REFERENCES | Where-Object { $_ -cmatch '^LIVE_SELECTION_DECISION_ID:[0-9a-f]{64}$' })
            if ($pendingProbeRun -cne $event.RUN_ID -or $event.ROUND_ID -ne 1 -or
                $event.COMMAND_ID -cne "$($event.RUN_ID):1" -or $outcomeRefs.Count -ne 1 -or
                ($pendingProbeKind -ceq 'SYNTHETIC' -and $outcomeRefs[0].Split(':')[1] -cne $pendingProbeHash) -or
                ($pendingProbeKind -ceq 'LIVE' -and ($decisionRefs.Count -ne 1 -or $decisionRefs[0].Split(':')[1] -cne $pendingProbeHash))) {
                throw 'BLOCKED: probe outcome does not bind exact intent and trace hash'
            }
            $pendingProbeRun=$null
            $pendingProbeHash=$null
            $pendingProbeKind=$null
        }
        if ($event.EVENT_KIND -ceq 'RETRY_GENESIS') {
            if ($null -eq $priorSnapshot -or $priorSnapshot.STATE -cne 'TERMINAL' -or
                $priorSnapshot.EXECUTION_STATE -cne 'EXECUTION_UNCERTAIN' -or
                $priorSnapshot.DELIVERY_STATE -cne 'DELIVERY_UNCERTAIN' -or
                $pendingProbeRun -cne ($priorSnapshot.LAST_ACCEPTED_COMMAND_ID -replace ':1$', '') -or
                $pendingProbeKind -cne 'LIVE' -or
                $event.RUN_ID -cin @($priorSnapshot.RUN_BINDING | ForEach-Object { $_.RUN_ID }) -or
                "TARGET_RUN_ID:$($event.RUN_ID)" -cnotin @($event.EVIDENCE_REFERENCES)) {
                throw 'BLOCKED: retry genesis cannot close an unproven terminal probe intent'
            }
            $pendingProbeRun=$null
            $pendingProbeHash=$null
            $pendingProbeKind=$null
        }
        if ($event.EVENT_KIND -cin @('COMMAND_ACCEPTED','COMMAND_EXECUTING','COMMAND_OUTCOME')) {
            $key="$($event.EXECUTION_CONTEXT_ID)|$($event.RUN_ID)|$($event.COMMAND_ID)"
            $phase=if ($commandPhases.ContainsKey($key)) { $commandPhases[$key] } else { 0 }
            $expectedKind=switch ($phase) { 0 { 'COMMAND_ACCEPTED' } 1 { 'COMMAND_EXECUTING' } 2 { 'COMMAND_OUTCOME' } default { 'NONE' } }
            if ($event.EVENT_KIND -cne $expectedKind -or $event.COMMAND_ID -cne "$($event.RUN_ID):$($event.ROUND_ID)") {
                throw 'BLOCKED: duplicate, replayed or out-of-order command ledger event'
            }
            $commandPhases[$key]=$phase+1
        }
        if ($event.REVISION -ne $revision -or $event.PREVIOUS_EVENT_HASH -cne $priorEventHash -or $event.PREVIOUS_RECORD_HASH -cne $priorRecordHash) {
            throw 'BLOCKED: journal or snapshot hash chain mismatch'
        }
        $reconstructed = Copy-JsonRecord $event.STATE_PAYLOAD
        $reconstructed['LAST_EVENT_HASH'] = $event.EVENT_HASH
        $reconstructed['RECORD_HASH'] = '0' * 64
        $null = Set-InMemoryHash $reconstructed 'RECORD_HASH'
        $rebuiltValidation = Test-Record (Get-CanonicalRecordText $reconstructed) Activation $Binding.ExecutionContextId $Binding.CheckoutRoot $Binding.HostLabel
        if (-not $rebuiltValidation.Valid) { throw "BLOCKED: invalid reconstructed state: $($rebuiltValidation.Errors -join ', ')" }
        if ($null -ne $priorSnapshot) {
            Assert-ApprovedTransition $priorSnapshot $reconstructed $event.EVENT_KIND $event.EVENT_ID $event.REVISION $event.COMMAND_ID @($event.EVIDENCE_REFERENCES)
            if ($reconstructed.ACTIVATION_EPOCH -lt $priorSnapshot.ACTIVATION_EPOCH) { throw 'BLOCKED: epoch rollback' }
            if ($priorSnapshot.STATE -eq 'ACTIVE' -and $reconstructed.STATE -eq 'ACTIVE' -and
                ($priorSnapshot.CONTROL_TOWER_INSTANCE -cne $reconstructed.CONTROL_TOWER_INSTANCE -or $priorSnapshot.ACTIVE_RUN_ID -cne $reconstructed.ACTIVE_RUN_ID)) {
                throw 'BLOCKED: direct ACTIVE-to-ACTIVE authority switch'
            }
        } elseif ($event.EVENT_KIND -cne 'ACTIVATION_INTENT' -or $reconstructed.STATE -cne 'INACTIVE' -or
            $reconstructed.CAUSAL_LINEAGE_ID -ne $null -or
            $reconstructed.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -cne 'NONE' -or
            $reconstructed.EVALUATOR_BUDGET.CAUSAL_LINEAGE_ID -cne 'NONE') {
            throw 'BLOCKED: genesis cannot import an established budget or executable state'
        }
        if ($pendingAuthoritySnapshot -and $revision -eq ($eventFiles.Count - 1)) { $snapshotBeforePendingAuthority = $priorSnapshot }
        $priorEventHash = $event.EVENT_HASH
        $priorRecordHash = $reconstructed.RECORD_HASH
        $priorSnapshot = $reconstructed
        $lastEvent = $event
    }
    if ($pendingAuthoritySnapshot) {
        if ($lastEvent.EVENT_KIND -cne 'AUTHORITY_CONSUMED' -or $null -eq $snapshotBeforePendingAuthority -or
            $actual.RECORD_HASH -cne $snapshotBeforePendingAuthority.RECORD_HASH -or
            (Get-CanonicalRecordText $actual) -cne (Get-CanonicalRecordText $snapshotBeforePendingAuthority)) {
            throw 'BLOCKED: journal-ahead state cannot prove a single committed authority transition'
        }
        Write-AtomicSnapshot $snapshotPath (Get-CanonicalRecordText $reconstructed)
        $actual=$reconstructed
    } elseif ($actual.RECORD_HASH -cne $reconstructed.RECORD_HASH -or $actual.LAST_EVENT_HASH -cne $lastEvent.EVENT_HASH -or
        (Get-CanonicalRecordText $actual) -cne (Get-CanonicalRecordText $reconstructed)) {
        throw 'BLOCKED: activation snapshot and final journal projection differ'
    }
    if (($snapshotTemps.Count -gt 0 -and -not $pendingAuthoritySnapshot) -or
        ($crashArtifacts.Count -gt 0 -and $lastEvent.EVENT_KIND -cne 'AUTHORITY_CONSUMED')) {
        throw 'BLOCKED: orphan snapshot artifact cannot be attributed to committed authority recovery'
    }
    foreach ($artifact in $crashArtifacts) {
        [System.IO.File]::Delete($artifact.FullName)
    }
    Test-NoOrphanFiles $contextPath
    $handoffsRoot=[System.IO.Path]::Combine($Binding.ReservedStatePath,'handoffs')
    $foundHandoffIds=[System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    if ([System.IO.Directory]::Exists($handoffsRoot)) {
        Assert-PlainPath $handoffsRoot
        foreach ($entry in Get-ChildItem -LiteralPath $handoffsRoot -Force) {
            $approvedHandoffPattern=if ($Binding.IsLive) { '^LIVE-HANDOFF-[0-9A-F]{64}$' } else { '^FED-QA-HANDOFF-[A-Z0-9_-]{3,60}$' }
            if (-not $entry.PSIsContainer -or $entry.Name -cnotmatch $approvedHandoffPattern) { throw 'BLOCKED: unapproved handoff path' }
            $handoff=Get-FixtureHandoff $Binding $entry.Name
            [void]$foundHandoffIds.Add($handoff.HANDOFF_ID)
            if (-not $persistedHandoffIds.Contains($handoff.HANDOFF_ID) -and $handoff.HANDOFF_ID -cne $PendingHandoffId) {
                throw 'BLOCKED: orphan immutable handoff without journal commit'
            }
            if ($persistedHandoffIds.Contains($handoff.HANDOFF_ID) -and
                $handoff.HANDOFF_HASH -cne $persistedHandoffHashes[$handoff.HANDOFF_ID]) {
                throw 'BLOCKED: immutable handoff hash differs from journal evidence'
            }
            if ($persistedHandoffIds.Contains($handoff.HANDOFF_ID) -and
                -not $supersededHandoffIds.Contains($handoff.HANDOFF_ID) -and
                $handoff.HANDOFF_ID -cnotin @($actual.CONSUMED_HANDOFF_IDS)) {
                Assert-HandoffSourceAndStatus $Binding $handoff $actual
            }
        }
    }
    foreach ($id in $persistedHandoffIds) { if (-not $foundHandoffIds.Contains($id)) { throw 'BLOCKED: persisted handoff file missing' } }
    foreach ($id in $actual.CONSUMED_HANDOFF_IDS) { if (-not $persistedHandoffIds.Contains([string]$id)) { throw 'BLOCKED: consumed handoff has no persisted provenance' } }
    if ($actual.CURRENT_HANDOFF_ID -and $actual.CURRENT_HANDOFF_ID -cnotin @($actual.CONSUMED_HANDOFF_IDS)) { throw 'BLOCKED: current handoff has not been consumed' }
    $recoveryStatus = if ($actual.EXECUTION_STATE -cin @('ACCEPTED','EXECUTING','EXECUTION_UNCERTAIN')) {
        'EXECUTION_UNCERTAIN'
    } elseif ($pendingProbeRun) {
        'PROBE_UNCERTAIN'
    } elseif ($actual.DELIVERY_STATE -ceq 'DELIVERY_UNCERTAIN') {
        'DELIVERY_UNCERTAIN'
    } else { 'RECONCILED_NON_EXECUTING' }
    return [pscustomobject]@{ Status=$recoveryStatus; Snapshot=$actual; LastEvent=$lastEvent; ExecutableAuthority=$false }
}

function Get-ReadOnlyLiveAuthorityProjection([psobject]$Reconciled) {
    if ($Reconciled.Status -cne 'RECONCILED_NON_EXECUTING' -or $null -eq $Reconciled.Snapshot -or
        $null -eq $Reconciled.LastEvent) {
        throw 'BLOCKED: live authority state is missing or execution/delivery is uncertain'
    }
    $state=$Reconciled.Snapshot
    $active=@($state.RUN_BINDING | Where-Object { $_.STATE -ceq 'ACTIVE' })
    $reserved=@($state.RUN_BINDING | Where-Object { $_.STATE -ceq 'RESERVED' })
    $pending=@($state.EVALUATOR_BUDGET.BUCKETS | Where-Object { $null -ne $_.PENDING_COMMAND_ID })
    if ($state.MODE -cne 'FEDERATED' -or $state.STATE -cne 'ACTIVE' -or
        $state.CONTROL_TOWER_ROLE -cne 'GLOBAL_CONTROL_TOWER' -or
        $state.CONTROL_TOWER_SCOPE -cne 'FOUNDATION' -or
        $state.OWNING_PAGE_CHAT_ID -cne 'NONE' -or
        $state.EVIDENCE_STOP_STATE -cne 'NONE' -or
        $state.EXECUTION_STATE -cnotin @('NONE','COMPLETED','FAILED') -or
        $state.DELIVERY_STATE -cin @('SENDING','SENT_WAITING_RESPONSE','RESPONSE_GENERATING','DELIVERY_UNCERTAIN') -or
        $active.Count -ne 1 -or $reserved.Count -ne 0 -or $pending.Count -ne 0 -or
        $active[0].RUN_ID -cne $state.ACTIVE_RUN_ID -or
        $active[0].ACTIVATION_EPOCH -ne $state.ACTIVATION_EPOCH -or
        $active[0].CONTROL_TOWER_INSTANCE -cne $state.CONTROL_TOWER_INSTANCE -or
        $active[0].PROJECT_ID -cne $state.PROJECT_ID -or
        $active[0].CONVERSATION_ID -cne $state.CONVERSATION_ID) {
        throw 'BLOCKED: exactly one current executable Global tower cannot be proven'
    }
    return [pscustomobject]@{
        Status='READ_ONLY_LIVE_GLOBAL_RECONCILED'; ExecutionContextId=$state.EXECUTION_CONTEXT_ID
        TowerRole=$state.CONTROL_TOWER_ROLE; TowerScope=$state.CONTROL_TOWER_SCOPE
        ProjectId=$state.PROJECT_ID; ConversationId=$state.CONVERSATION_ID
        TowerInstance=$state.CONTROL_TOWER_INSTANCE; ActiveRunId=$state.ACTIVE_RUN_ID
        SourceRecordHash=$state.RECORD_HASH; ActivationEpoch=$state.ACTIVATION_EPOCH
        Revision=$state.REVISION; CausalLineageId=$state.CAUSAL_LINEAGE_ID
        ExecutableAuthority=$true; ActiveTowerCount=1; OneActiveTowerInvariant='PASS'
        RuntimeStateChanged=$false; LockReleasedAfterRead=$true
    }
}

function Assert-FreshFixtureCommand([psobject]$Binding, [System.Collections.IDictionary]$Snapshot, [string]$CandidateRunId, [int]$CandidateRoundId, [string]$CandidateCommandId) {
    if ($Snapshot.STATE -cne 'ACTIVE' -or $Snapshot.EXECUTION_STATE -cin @('ACCEPTED','EXECUTING','EXECUTION_UNCERTAIN') -or
        $Snapshot.DELIVERY_STATE -ceq 'DELIVERY_UNCERTAIN' -or $Snapshot.EVIDENCE_STOP_STATE -cne 'NONE') {
        throw 'BLOCKED: no current executable fixture command slot'
    }
    if ($CandidateRunId -cne $Snapshot.ACTIVE_RUN_ID -or $CandidateRoundId -le 0 -or
        $CandidateCommandId -cne "${CandidateRunId}:$CandidateRoundId") { throw 'BLOCKED: command run, round or identity mismatch' }
    $bindingMatches = @($Snapshot.RUN_BINDING | Where-Object {
        $_.RUN_ID -ceq $CandidateRunId -and $_.ACTIVATION_EPOCH -eq $Snapshot.ACTIVATION_EPOCH -and
        $_.CONTROL_TOWER_INSTANCE -ceq $Snapshot.CONTROL_TOWER_INSTANCE -and $_.PROJECT_ID -ceq $Snapshot.PROJECT_ID -and
        $_.CONVERSATION_ID -ceq $Snapshot.CONVERSATION_ID -and $_.STATE -ceq 'ACTIVE'
    })
    if ($bindingMatches.Count -ne 1) { throw 'BLOCKED: command run binding/epoch/instance mismatch' }
    $journalPath = [System.IO.Path]::Combine($Binding.ReservedStatePath,'journal')
    $acceptedRounds = [System.Collections.Generic.List[int]]::new()
    foreach ($path in [System.IO.Directory]::GetFiles($journalPath,'*.json')) {
        $event = ConvertFrom-Json -InputObject ([System.IO.File]::ReadAllText($path)) -AsHashtable -Depth 40 -DateKind String
        if ($event.EVENT_KIND -cin @('PROBE_INTENT','PROBE_OUTCOME') -and $event.RUN_ID -ceq $CandidateRunId) {
            if ($event.COMMAND_ID -ceq $CandidateCommandId) { throw 'BLOCKED: probe COMMAND_ID replay or duplicate' }
            if ($event.EVENT_KIND -ceq 'PROBE_OUTCOME') { $acceptedRounds.Add([int]$event.ROUND_ID) }
        }
        if ($event.EVENT_KIND -ceq 'COMMAND_ACCEPTED' -and $event.RUN_ID -ceq $CandidateRunId) {
            if ($event.COMMAND_ID -ceq $CandidateCommandId) { throw 'BLOCKED: COMMAND_ID replay or duplicate' }
            $acceptedRounds.Add([int]$event.ROUND_ID)
        }
    }
    if ($acceptedRounds.Count -gt 0 -and $CandidateRoundId -ne (($acceptedRounds | Measure-Object -Maximum).Maximum + 1)) {
        throw 'BLOCKED: stale or non-sequential ROUND_ID'
    }
    if ($acceptedRounds.Count -eq 0 -and $CandidateRoundId -ne 1) { throw 'BLOCKED: first ROUND_ID must be 1' }
}

function Get-FixtureHandoff([psobject]$Binding, [string]$Id) {
    $approvedHandoffPattern=if ($Binding.IsLive) { '^LIVE-HANDOFF-[0-9A-F]{64}$' } else { '^FED-QA-HANDOFF-[A-Z0-9_-]{3,60}$' }
    if ($Id -cnotmatch $approvedHandoffPattern) { throw 'BLOCKED: invalid HANDOFF_ID for runtime type' }
    $handoffsRoot = [System.IO.Path]::Combine($Binding.ReservedStatePath,'handoffs')
    $directory = [System.IO.Path]::Combine($handoffsRoot,$Id)
    if (-not [System.IO.Directory]::Exists($directory)) { throw 'BLOCKED: handoff does not exist' }
    Assert-PlainPath $handoffsRoot
    Assert-PlainPath $directory
    $members=@(Get-ChildItem -LiteralPath $directory -Force)
    if ($members.Count -ne 1 -or $members[0].Name -cne 'handoff.json' -or $members[0].PSIsContainer) { throw 'BLOCKED: incomplete or modified handoff directory' }
    $path = [System.IO.Path]::Combine($directory,'handoff.json')
    $content=[System.IO.File]::ReadAllText($path,[System.Text.Encoding]::UTF8)
    $check=Test-Record $content Handoff $Binding.ExecutionContextId $Binding.CheckoutRoot $Binding.HostLabel
    if (-not $check.Valid) { throw "BLOCKED: invalid handoff: $($check.Errors -join ', ')" }
    $record=ConvertFrom-Json -InputObject $content -AsHashtable -Depth 40 -DateKind String
    if ($record.HANDOFF_ID -cne $Id) { throw 'BLOCKED: handoff directory identity mismatch' }
    return $record
}

function New-LiveHandoff([psobject]$Binding, [System.Collections.IDictionary]$Source, [System.Collections.IDictionary]$Decision, [string]$SourceRunId) {
    if (-not $Binding.IsLive -or $Source.STATE -cnotin @('TERMINAL','REVOKED') -or
        $Source.EXECUTION_STATE -cin @('ACCEPTED','EXECUTING','EXECUTION_UNCERTAIN') -or
        $Source.DELIVERY_STATE -cin @('SENDING','SENT_WAITING_RESPONSE','RESPONSE_GENERATING','DELIVERY_UNCERTAIN')) {
        throw 'BLOCKED: live handoff requires fenced, certain source under live lock'
    }
    $payload=$Decision.DECISION_PAYLOAD
    $target=$payload.TARGET_TOWER
    $targetRun=$payload.TARGET_RUN_ID
    $handoffId="LIVE-HANDOFF-$($Decision.DECISION_ID.ToUpperInvariant())"
    $handoffDirectory=[System.IO.Path]::Combine($Binding.ReservedStatePath,'handoffs',$handoffId)
    if ([System.IO.Directory]::Exists($handoffDirectory)) { throw 'BLOCKED: live handoff already exists' }
    if ($targetRun -cin @($Source.RUN_BINDING | ForEach-Object { $_.RUN_ID })) {
        throw 'BLOCKED: live handoff cannot reuse a run'
    }
    $sourceRun=@($Source.RUN_BINDING | Where-Object { $_.RUN_ID -ceq $SourceRunId -and $_.STATE -cin @('REVOKED','TERMINAL') })
    if ($sourceRun.Count -ne 1) { throw 'BLOCKED: exact fenced source run missing' }
    $sourceTower=[ordered]@{}
    foreach ($field in @('TOWER_ID','CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID','PROJECT_ID','CONTROL_TOWER_INSTANCE','CONVERSATION_ID','CONVERSATION_TITLE')) {
        $sourceTower[$field]=$Source[$field]
    }
    $targetTower=[ordered]@{}
    foreach ($field in @('TOWER_ID','CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID','PROJECT_ID','CONTROL_TOWER_INSTANCE','CONVERSATION_ID','CONVERSATION_TITLE')) {
        $targetTower[$field]=$target[$field]
    }
    $reserved=Copy-JsonRecord $Source
    $reserved['RUN_BINDING']=@($reserved.RUN_BINDING)+@([ordered]@{
        RUN_ID=$targetRun; ACTIVATION_EPOCH=$payload.TARGET_ACTIVATION_EPOCH; TOWER_ID=$target.TOWER_ID
        CONTROL_TOWER_INSTANCE=$target.CONTROL_TOWER_INSTANCE; PROJECT_ID=$target.PROJECT_ID
        CONVERSATION_ID=$target.CONVERSATION_ID; STATE='RESERVED'
    })
    $reservation=Commit-LocalRevision $Binding $reserved 'RUN_RESERVED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("TARGET_RUN_ID:$targetRun","LIVE_SELECTION_DECISION_ID:$($Decision.DECISION_ID)")
    $sourceRound=0
    if ($reservation.Snapshot.LAST_ACCEPTED_COMMAND_ID -match ':(\d+)$') { $sourceRound=[int]$Matches[1] }
    $pageOwner=if ($sourceTower.CONTROL_TOWER_ROLE -ceq 'PAGE_CONTROL_TOWER') {
        [string]$sourceTower.OWNING_PAGE_CHAT_ID
    } elseif ($payload.INTENDED_ACTION -ceq 'GLOBAL_TO_BOUND_PAGE_QA_TRANSFER') {
        [string]$targetTower.OWNING_PAGE_CHAT_ID
    } else { 'NONE' }
    $productProvenance=if ($pageOwner -ceq 'NONE') {
        [ordered]@{ OWNING_PAGE_CHAT_ID='NONE'; SOURCE_REFERENCES=@(); PAGE_CONTEXT_INTAKE='NOT_APPLICABLE'; COMPLETENESS='NOT_APPLICABLE'; GAPS=@(); EVIDENCE_REFERENCES=@() }
    } else {
        [ordered]@{ OWNING_PAGE_CHAT_ID=$pageOwner; SOURCE_REFERENCES=@(); PAGE_CONTEXT_INTAKE='UNKNOWN'; COMPLETENESS='UNKNOWN'; GAPS=@('UNVERIFIED_LIVE_PAGE_CONTEXT'); EVIDENCE_REFERENCES=@() }
    }
    $handoff=[ordered]@{
        HANDOFF_VERSION=1; HANDOFF_ID=$handoffId; EXECUTION_CONTEXT_ID=$Binding.ExecutionContextId
        CREATED_AT_UTC=[DateTime]::UtcNow.ToString('o'); SOURCE_ACTIVATION_EPOCH=$reservation.Snapshot.ACTIVATION_EPOCH
        TARGET_ACTIVATION_EPOCH=$payload.TARGET_ACTIVATION_EPOCH; SOURCE_RECORD_HASH=$reservation.Snapshot.RECORD_HASH
        HANDOFF_HASH=('0' * 64); SOURCE_TOWER=$sourceTower; TARGET_TOWER=$targetTower; SOURCE_RUN_ID=$SourceRunId
        SOURCE_ROUND_ID=$sourceRound; SOURCE_COMMAND_ID=$(if ($reservation.Snapshot.LAST_ACCEPTED_COMMAND_ID) { $reservation.Snapshot.LAST_ACCEPTED_COMMAND_ID } else { 'NOT_APPLICABLE' })
        TARGET_RUN_ID=$targetRun; CAUSAL_LINEAGE_ID=$reservation.Snapshot.CAUSAL_LINEAGE_ID
        WORKFLOW_STATE=[ordered]@{ CHANGE='federated-control-towers-foundation'; STAGE='LIVE_SELECTION_TRANSFER'; GATE_STATUS='HUMAN_SELECTION_CONSUMED'; SOURCE_REFERENCE=$Decision.DECISION_ID }
        DELIVERY_STATE=$reservation.Snapshot.DELIVERY_STATE; EXECUTION_STATE=$reservation.Snapshot.EXECUTION_STATE
        EVIDENCE_STOP_STATE=$reservation.Snapshot.EVIDENCE_STOP_STATE; RECOVERY_BUDGET=$reservation.Snapshot.RECOVERY_BUDGET
        EVALUATOR_BUDGET=$reservation.Snapshot.EVALUATOR_BUDGET; APPROVAL_REFERENCES=$reservation.Snapshot.APPROVAL_REFERENCES
        ARTIFACT_HASHES=$reservation.Snapshot.ARTIFACT_HASHES; EVIDENCE_REFERENCES=@("LIVE_SELECTION_DECISION_ID:$($Decision.DECISION_ID)")
        CURRENT_ACTIVE_FREEZES=$reservation.Snapshot.CURRENT_ACTIVE_FREEZES
        CONSUMED_AUTHORITY_PROOFS=$reservation.Snapshot.CONSUMED_AUTHORITY_PROOFS
        PRODUCT_PROVENANCE=$productProvenance; BLOCKERS=$reservation.Snapshot.BLOCKERS
        KNOWN_LIMITATIONS=$reservation.Snapshot.KNOWN_LIMITATIONS
        NEXT_CANDIDATE_ACTION=[ordered]@{ DESCRIPTION='Fresh read-only target probe'; EXPECTED_AUTHORITY_SOURCE='Exact consumed Human selection'; AUTHORIZATION_STATUS='PENDING' }
    }
    $handoffText=Set-InMemoryHash $handoff 'HANDOFF_HASH'
    $check=Test-Record $handoffText Handoff $Binding.ExecutionContextId $Binding.CheckoutRoot $Binding.HostLabel
    if (-not $check.Valid) { throw "BLOCKED: live handoff validation failed: $($check.Errors -join ', ')" }
    $handoffsRoot=[System.IO.Path]::Combine($Binding.ReservedStatePath,'handoffs')
    if (-not [System.IO.Directory]::Exists($handoffsRoot)) { [void][System.IO.Directory]::CreateDirectory($handoffsRoot) }
    [void][System.IO.Directory]::CreateDirectory($handoffDirectory)
    Assert-PlainPath $handoffsRoot
    Assert-PlainPath $handoffDirectory
    $final=[System.IO.Path]::Combine($handoffDirectory,'handoff.json')
    $temporary="$final.tmp-$([Guid]::NewGuid().ToString('N'))"
    Write-DurableNewFile $temporary $handoffText
    [System.IO.File]::Move($temporary,$final)
    $validated=Get-FixtureHandoff $Binding $handoffId
    if ($validated.HANDOFF_HASH -cne $handoff.HANDOFF_HASH) { throw 'BLOCKED: live handoff read-back differs' }
    $post=Copy-JsonRecord $reservation.Snapshot
    $persisted=Commit-LocalRevision $Binding $post 'HANDOFF_PERSISTED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("HANDOFF_ID:$handoffId","HANDOFF_HASH:$($validated.HANDOFF_HASH)")
    Assert-HandoffSourceAndStatus $Binding $validated $persisted.Snapshot
    return [pscustomobject]@{ Snapshot=$persisted.Snapshot; HandoffId=$handoffId; Handoff=$validated }
}

function Assert-ExactAuthorityCarry([System.Collections.IDictionary]$Source, [System.Collections.IDictionary]$Target) {
    foreach ($field in @('CURRENT_ACTIVE_FREEZES','CONSUMED_AUTHORITY_PROOFS')) {
        if ((Get-CanonicalRecordText ([ordered]@{ VALUE=$Source[$field] })) -cne
            (Get-CanonicalRecordText ([ordered]@{ VALUE=$Target[$field] }))) {
            throw "BLOCKED: $field handoff carry is missing, merged or different"
        }
    }
}

function Assert-BudgetExecutionAllowed([System.Collections.IDictionary]$Snapshot, [string]$BudgetType, [string]$BucketKey) {
    if ($Snapshot.EVIDENCE_STOP_STATE -cne 'NONE' -or $Snapshot.EXECUTION_STATE -cin @('ACCEPTED','EXECUTING','EXECUTION_UNCERTAIN')) {
        throw 'BLOCKED: execution or evidence-stop state prevents another budgeted operation'
    }
    $freezes=@($Snapshot.CURRENT_ACTIVE_FREEZES | Where-Object {
        $_.DECISION_SCOPE.BUDGET_TYPE -ceq $BudgetType -and
        ($BudgetType -ceq 'RECOVERY_BUDGET' -or $_.DECISION_SCOPE.BUCKET_KEY -ceq $BucketKey)
    })
    if ($freezes.Count -gt 0) { throw 'BLOCKED: exact budget scope is frozen' }
    if ($BudgetType -ceq 'RECOVERY_BUDGET') {
        if ([long]$Snapshot.RECOVERY_BUDGET.ATTEMPTS_USED -ge [long]$Snapshot.RECOVERY_BUDGET.APPROVED_MAXIMUM) {
            throw 'BLOCKED: recovery budget exhausted'
        }
    } elseif ($BudgetType -ceq 'EVALUATOR_BUDGET') {
        $bucket=@($Snapshot.EVALUATOR_BUDGET.BUCKETS | Where-Object { $_.BUCKET_KEY -ceq $BucketKey })
        if ($bucket.Count -ne 1 -or [long]$bucket[0].EXECUTION_GENERATIONS_USED -ge [long]$bucket[0].APPROVED_MAXIMUM -or
            $bucket[0].PENDING_COMMAND_ID -ne $null) { throw 'BLOCKED: evaluator bucket absent, pending or exhausted' }
    } else { throw 'BLOCKED: unsupported budget scope' }
}

function Assert-HandoffSourceAndStatus([psobject]$Binding, [System.Collections.IDictionary]$Handoff, [System.Collections.IDictionary]$Current) {
    if ($Handoff.HANDOFF_ID -cin @($Current.CONSUMED_HANDOFF_IDS)) { throw 'BLOCKED: handoff already consumed' }
    if ($Handoff.CAUSAL_LINEAGE_ID -cne $Current.CAUSAL_LINEAGE_ID -or
        $Handoff.TARGET_ACTIVATION_EPOCH -ne ($Handoff.SOURCE_ACTIVATION_EPOCH + 1) -or
        $Handoff.TARGET_RUN_ID -cin @($Current.RUN_BINDING | Where-Object { $_.STATE -cin @('ACTIVE','REVOKED','TERMINAL') } | ForEach-Object { $_.RUN_ID })) {
        throw 'BLOCKED: handoff lineage, epoch or fresh-run check failed'
    }
    $sourceFound=$false
    $superseded=$false
    foreach ($path in [System.IO.Directory]::GetFiles([System.IO.Path]::Combine($Binding.ReservedStatePath,'journal'),'*.json')) {
        $event=ConvertFrom-Json -InputObject ([System.IO.File]::ReadAllText($path)) -AsHashtable -Depth 40 -DateKind String
        if ($event.STATE_PAYLOAD.REVISION -le $Current.REVISION -and $event.EVENT_KIND -ceq 'RUN_RESERVED' -and
            $event.STATE_PAYLOAD.EXECUTION_CONTEXT_ID -ceq $Binding.ExecutionContextId) {
            $reconstructed=Copy-JsonRecord $event.STATE_PAYLOAD
            $reconstructed['LAST_EVENT_HASH']=$event.EVENT_HASH
            $reconstructed['RECORD_HASH']='0' * 64
            $null=Set-InMemoryHash $reconstructed 'RECORD_HASH'
            if ($reconstructed.RECORD_HASH -ceq $Handoff.SOURCE_RECORD_HASH -and
                $reconstructed.ACTIVATION_EPOCH -eq $Handoff.SOURCE_ACTIVATION_EPOCH -and
                $reconstructed.STATE -cin @('TERMINAL','REVOKED') -and
                $Handoff.TARGET_RUN_ID -cin @($reconstructed.RUN_BINDING | ForEach-Object { $_.RUN_ID })) {
                $sourceRun=@($reconstructed.RUN_BINDING | Where-Object { $_.RUN_ID -ceq $Handoff.SOURCE_RUN_ID -and $_.STATE -cin @('REVOKED','TERMINAL') })
                $targetRun=@($reconstructed.RUN_BINDING | Where-Object { $_.RUN_ID -ceq $Handoff.TARGET_RUN_ID -and $_.STATE -ceq 'RESERVED' -and $_.ACTIVATION_EPOCH -eq $Handoff.TARGET_ACTIVATION_EPOCH })
                if ($sourceRun.Count -eq 1 -and $targetRun.Count -eq 1 -and
                    (Get-ComparableValueText $reconstructed.TOWER_ID) -ceq (Get-ComparableValueText $Handoff.SOURCE_TOWER.TOWER_ID) -and
                    (Get-ComparableValueText $targetRun[0].TOWER_ID) -ceq (Get-ComparableValueText $Handoff.TARGET_TOWER.TOWER_ID) -and
                    $reconstructed.PROJECT_ID -ceq $Handoff.SOURCE_TOWER.PROJECT_ID -and
                    $reconstructed.CONVERSATION_ID -ceq $Handoff.SOURCE_TOWER.CONVERSATION_ID -and
                    $targetRun[0].PROJECT_ID -ceq $Handoff.TARGET_TOWER.PROJECT_ID -and
                    $targetRun[0].CONVERSATION_ID -ceq $Handoff.TARGET_TOWER.CONVERSATION_ID -and
                    $reconstructed.LAST_ACCEPTED_COMMAND_ID -ceq $(if ($Handoff.SOURCE_COMMAND_ID -ceq 'NOT_APPLICABLE') { $null } else { $Handoff.SOURCE_COMMAND_ID }) -and
                    (Get-CanonicalRecordText ([ordered]@{ FREEZES=$reconstructed.CURRENT_ACTIVE_FREEZES; PROOFS=$reconstructed.CONSUMED_AUTHORITY_PROOFS })) -ceq
                    (Get-CanonicalRecordText ([ordered]@{ FREEZES=$Handoff.CURRENT_ACTIVE_FREEZES; PROOFS=$Handoff.CONSUMED_AUTHORITY_PROOFS }))) {
                    $sourceFound=$true
                }
            }
        }
        if ($event.EVENT_KIND -ceq 'HANDOFF_SUPERSEDED' -and "HANDOFF_ID:$($Handoff.HANDOFF_ID)" -cin @($event.EVIDENCE_REFERENCES)) { $superseded=$true }
    }
    if (-not $sourceFound -or $superseded) { throw 'BLOCKED: handoff source is missing or superseded' }
    Assert-ExactAuthorityCarry $Current $Handoff
    if ((Get-ComparableValueText $Handoff.CURRENT_ACTIVE_FREEZES) -cne (Get-ComparableValueText $Current.CURRENT_ACTIVE_FREEZES) -or
        (Get-ComparableValueText $Handoff.CONSUMED_AUTHORITY_PROOFS) -cne (Get-ComparableValueText $Current.CONSUMED_AUTHORITY_PROOFS) -or
        (Get-ComparableValueText $Handoff.RECOVERY_BUDGET) -cne (Get-ComparableValueText $Current.RECOVERY_BUDGET) -or
        (Get-ComparableValueText $Handoff.EVALUATOR_BUDGET) -cne (Get-ComparableValueText $Current.EVALUATOR_BUDGET) -or
        $Handoff.EVIDENCE_STOP_STATE -cne $Current.EVIDENCE_STOP_STATE -or
        (Get-ComparableValueText $Handoff.BLOCKERS) -cne (Get-ComparableValueText $Current.BLOCKERS) -or
        (Get-ComparableValueText $Handoff.KNOWN_LIMITATIONS) -cne (Get-ComparableValueText $Current.KNOWN_LIMITATIONS) -or
        (Get-ComparableValueText $Handoff.APPROVAL_REFERENCES) -cne (Get-ComparableValueText $Current.APPROVAL_REFERENCES) -or
        (Get-ComparableValueText $Handoff.ARTIFACT_HASHES) -cne (Get-ComparableValueText $Current.ARTIFACT_HASHES)) {
        throw 'BLOCKED: handoff budget, approval or artifact drift'
    }
    foreach ($artifact in $Handoff.ARTIFACT_HASHES) {
        Assert-CurrentArtifactHash $Binding.CheckoutRoot $artifact.PATH $artifact.SHA256
    }
    foreach ($approval in $Handoff.APPROVAL_REFERENCES) {
        Assert-CurrentArtifactHash $Binding.CheckoutRoot $approval.ARTIFACT_PATH $approval.ARTIFACT_SHA256
    }
}

function Assert-BudgetTransition([System.Collections.IDictionary]$Old, [System.Collections.IDictionary]$Next, [string]$EventKind, [string]$EventId, [long]$Revision, [string]$CommandId, [string[]]$EvidenceReferences) {
    $eventReference = "JOURNAL:${Revision}:$EventId"
    if ($Old.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -cne 'NONE' -and
        $Next.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -cne $Old.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID) {
        throw 'BLOCKED: recovery budget lineage reset'
    }
    if ($Old.EVALUATOR_BUDGET.CAUSAL_LINEAGE_ID -cne 'NONE' -and
        $Next.EVALUATOR_BUDGET.CAUSAL_LINEAGE_ID -cne $Old.EVALUATOR_BUDGET.CAUSAL_LINEAGE_ID) {
        throw 'BLOCKED: evaluator budget lineage reset'
    }
    $firstLineage = $Old.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -ceq 'NONE' -and
        $Next.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -cne 'NONE' -and $EventKind -ceq 'ACTIVATION_INTENT'
    if (-not $firstLineage -and $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM -and $EventKind -cne 'AUTHORITY_CONSUMED') {
        throw 'BLOCKED: recovery maximum changed without a separately reviewed exception'
    }
    if ($firstLineage -and ($Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne 0 -or $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne 2)) {
        throw 'BLOCKED: initial lineage must use the approved recovery maximum'
    }
    $recoveryDelta = [long]$Next.RECOVERY_BUDGET.ATTEMPTS_USED - [long]$Old.RECOVERY_BUDGET.ATTEMPTS_USED
    $oldRecoveryEvidence = @($Old.RECOVERY_BUDGET.EVIDENCE_REFERENCES)
    $newRecoveryEvidence = @($Next.RECOVERY_BUDGET.EVIDENCE_REFERENCES)
    if ($recoveryDelta -lt 0 -or $recoveryDelta -gt 1 -or
        $newRecoveryEvidence.Count -ne ($oldRecoveryEvidence.Count + $recoveryDelta)) { throw 'BLOCKED: recovery budget reset or unsupported increment' }
    for ($index=0; $index -lt $oldRecoveryEvidence.Count; $index++) {
        if ($oldRecoveryEvidence[$index] -cne $newRecoveryEvidence[$index]) { throw 'BLOCKED: recovery evidence history rewritten' }
    }
    if ($recoveryDelta -eq 1 -and ($EventKind -cne 'COMMAND_OUTCOME' -or
        $newRecoveryEvidence[-1] -cne $eventReference -or
        'SYNTHETIC_FAILED_CORRECTION_SAME_BLOCKER' -cnotin $EvidenceReferences)) {
        throw 'BLOCKED: recovery attempt lacks attributable failed-correction evidence'
    }
    $oldBuckets = @($Old.EVALUATOR_BUDGET.BUCKETS)
    $newBuckets = @($Next.EVALUATOR_BUDGET.BUCKETS)
    if ($newBuckets.Count -lt $oldBuckets.Count -or $newBuckets.Count -gt ($oldBuckets.Count+1)) { throw 'BLOCKED: evaluator bucket set reset or expanded ambiguously' }
    foreach ($oldBucket in $oldBuckets) {
        $matches = @($newBuckets | Where-Object { $_.BUCKET_KEY -ceq $oldBucket.BUCKET_KEY })
        if ($matches.Count -ne 1) { throw 'BLOCKED: existing evaluator bucket removed or duplicated' }
        $newBucket = $matches[0]
        foreach ($field in @('STAGE_KEY','PURPOSE_KEY','MATERIAL_EQUIVALENCE_REFERENCE')) {
            if ($newBucket[$field] -cne $oldBucket[$field]) { throw 'BLOCKED: evaluator bucket identity, provenance or maximum changed' }
        }
        if ($newBucket.APPROVED_MAXIMUM -ne $oldBucket.APPROVED_MAXIMUM -and $EventKind -cne 'AUTHORITY_CONSUMED') {
            throw 'BLOCKED: evaluator maximum changed outside a consumed authority event'
        }
        $delta = [long]$newBucket.EXECUTION_GENERATIONS_USED - [long]$oldBucket.EXECUTION_GENERATIONS_USED
        $oldEvidence = @($oldBucket.EVIDENCE_REFERENCES)
        $newEvidence = @($newBucket.EVIDENCE_REFERENCES)
        if ($delta -lt 0 -or $delta -gt 1 -or $newEvidence.Count -ne ($oldEvidence.Count+$delta)) {
            throw 'BLOCKED: evaluator generation reset or unsupported increment'
        }
        for ($index=0; $index -lt $oldEvidence.Count; $index++) {
            if ($oldEvidence[$index] -cne $newEvidence[$index]) { throw 'BLOCKED: evaluator execution evidence rewritten' }
        }
        if ($delta -eq 1 -and ($EventKind -cne 'COMMAND_OUTCOME' -or
            $oldBucket.PENDING_COMMAND_ID -cne $CommandId -or $newBucket.PENDING_COMMAND_ID -ne $null -or
            $newEvidence[-1] -cne $eventReference -or
            -not @($EvidenceReferences | Where-Object { $_ -cmatch '^SYNTHETIC_EVALUATOR_EXECUTED:[0-9a-f]{64}$' }).Count)) {
            throw 'BLOCKED: evaluator generation lacks one attributable actual execution'
        }
        if ($delta -eq 0 -and $oldBucket.PENDING_COMMAND_ID -cne $newBucket.PENDING_COMMAND_ID) {
            if ($EventKind -cne 'COMMAND_ACCEPTED' -or $oldBucket.PENDING_COMMAND_ID -ne $null -or
                $newBucket.PENDING_COMMAND_ID -cne $CommandId) {
                throw 'BLOCKED: pending evaluator command changed outside accepted intent'
            }
        }
        if ($EventKind -ceq 'COMMAND_OUTCOME' -and $oldBucket.PENDING_COMMAND_ID -ceq $CommandId -and $delta -ne 1) {
            throw 'BLOCKED: outcome cannot clear or retain a pending evaluator without accounting'
        }
    }
    foreach ($newBucket in $newBuckets) {
        if (@($oldBuckets | Where-Object { $_.BUCKET_KEY -ceq $newBucket.BUCKET_KEY }).Count -ne 0) { continue }
        if ($EventKind -cne 'AUTHORITY_CONSUMED' -or $newBucket.PENDING_COMMAND_ID -ne $null -or
            $newBucket.EXECUTION_GENERATIONS_USED -ne 0 -or @($newBucket.EVIDENCE_REFERENCES).Count -ne 0) {
            throw 'BLOCKED: new material evaluator bucket lacks accepted command and reviewed zero state'
        }
    }
}

function Assert-AuthorityTransition([System.Collections.IDictionary]$Old, [System.Collections.IDictionary]$Next, [string]$EventKind) {
    $prior=@($Old.CONSUMED_AUTHORITY_PROOFS)
    $after=@($Next.CONSUMED_AUTHORITY_PROOFS)
    $oldFreezes=@($Old.CURRENT_ACTIVE_FREEZES)
    $newFreezes=@($Next.CURRENT_ACTIVE_FREEZES)
    if ($EventKind -cne 'AUTHORITY_CONSUMED') {
        if ((Get-CanonicalRecordText ([ordered]@{ PROOFS=$prior; FREEZES=$oldFreezes })) -cne
            (Get-CanonicalRecordText ([ordered]@{ PROOFS=$after; FREEZES=$newFreezes }))) {
            throw 'BLOCKED: authority proof or active freeze changed without consumption'
        }
        $initialLineage = $EventKind -ceq 'ACTIVATION_INTENT' -and $Old.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -ceq 'NONE' -and
            $Next.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -cne 'NONE' -and $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -eq 0 -and
            $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM -eq 2
        if (-not $initialLineage -and $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM) {
            throw 'BLOCKED: recovery maximum changed without consumption'
        }
        foreach ($oldBucket in @($Old.EVALUATOR_BUDGET.BUCKETS)) {
            $newBucket=@($Next.EVALUATOR_BUDGET.BUCKETS | Where-Object { $_.BUCKET_KEY -ceq $oldBucket.BUCKET_KEY })
            if ($newBucket.Count -eq 1 -and $newBucket[0].APPROVED_MAXIMUM -ne $oldBucket.APPROVED_MAXIMUM) { throw 'BLOCKED: evaluator maximum changed without consumption' }
        }
        return
    }
    if ($after.Count -ne $prior.Count+1) { throw 'BLOCKED: consumed authority must append exactly one proof' }
    foreach ($oldProof in $prior) {
        $matched=@($after | Where-Object { $_.CONSUMED_AUTHORITY_PROOF.DECISION_ID -ceq $oldProof.CONSUMED_AUTHORITY_PROOF.DECISION_ID })
        if ($matched.Count -ne 1 -or (Get-CanonicalRecordText $matched[0]) -cne (Get-CanonicalRecordText $oldProof)) {
            throw 'BLOCKED: prior authority proof removed or rewritten'
        }
    }
    $added=@($after | Where-Object { $_.CONSUMED_AUTHORITY_PROOF.DECISION_ID -cnotin @($prior | ForEach-Object { $_.CONSUMED_AUTHORITY_PROOF.DECISION_ID }) })
    if ($added.Count -ne 1) { throw 'BLOCKED: authority proof replay or collision' }
    $decisionId=[string]$added[0].CONSUMED_AUTHORITY_PROOF.DECISION_ID
    $decisionLineage=if ($null -ne $Old.CAUSAL_LINEAGE_ID) { $Old.CAUSAL_LINEAGE_ID } else {
        $addedDecision=Get-AuthorityArtifact $Old.CHECKOUT_ROOT "docs/reviews/federated-control-towers-foundation/decisions/$decisionId.json" '' ([ordered]@{
            RECORD_VERSION='integer'; DECISION_ID='string'; DECISION_TYPE='string'; STATUS='string'; DECISION_SCOPE='object'
            DECISION_PAYLOAD='object'; PRE_DECISION_DESCRIPTOR_PATH='string'; PRE_DECISION_DESCRIPTOR_SHA256='string'
            APPROVAL_RECORD_PATH='string'; APPROVAL_RECORD_SHA256='string'; RESULT_HASH='string'; DECISION_ITEM_ID='string'
        }) 'first selection decision'
        if ($Old.STATE -cne 'INACTIVE' -or $addedDecision.Record.DECISION_TYPE -cne 'LIVE_TOWER_SELECTION') {
            throw 'BLOCKED: only first live selection may introduce a causal lineage'
        }
        [string]$addedDecision.Record.DECISION_SCOPE.CAUSAL_LINEAGE_ID
    }
    $verified=Get-AuthorityDecision $Old.CHECKOUT_ROOT $decisionId $Old.EXECUTION_CONTEXT_ID $decisionLineage
    if ((Get-CanonicalRecordText $verified.ProofEntry) -cne (Get-CanonicalRecordText $added[0])) {
        throw 'BLOCKED: consumed proof differs from exact approved authority chain'
    }
    $decision=$verified.Decision
    $scope=$decision.DECISION_SCOPE
    $payload=$decision.DECISION_PAYLOAD
    $unrelated=Copy-JsonRecord $Next
    foreach ($field in @('RECOVERY_BUDGET','EVALUATOR_BUDGET','CURRENT_ACTIVE_FREEZES','CONSUMED_AUTHORITY_PROOFS',
        'REVISION','PREVIOUS_RECORD_HASH','LAST_EVENT_HASH','RECORD_HASH','UPDATED_AT_UTC')) {
        $unrelated[$field]=$Old[$field]
    }
    if ((Get-CanonicalRecordText $unrelated) -cne (Get-CanonicalRecordText $Old)) {
        throw 'BLOCKED: authority consumption modified unrelated state or execution authorization'
    }
    $unchangedFreezes=(Get-CanonicalRecordText ([ordered]@{ FREEZES=$oldFreezes })) -ceq (Get-CanonicalRecordText ([ordered]@{ FREEZES=$newFreezes }))
    $oldBuckets=@($Old.EVALUATOR_BUDGET.BUCKETS)
    $nextBuckets=@($Next.EVALUATOR_BUDGET.BUCKETS)
    switch ($decision.DECISION_TYPE) {
        'LIVE_TOWER_SELECTION' {
            Assert-LiveSelectionPayload $decision $Old
            if (-not $unchangedFreezes -or
                (Get-CanonicalRecordText ([ordered]@{ BUCKETS=$oldBuckets })) -cne (Get-CanonicalRecordText ([ordered]@{ BUCKETS=$nextBuckets })) -or
                $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM) {
                throw 'BLOCKED: live-selection consumption changed budget or freeze state'
            }
        }
        'EVALUATOR_BUCKET_CLASSIFICATION' {
            Assert-ExactAuthorityShape $payload ([ordered]@{
                CLASSIFICATION='string'; BUCKET_KEY='string'; STAGE_KEY='string'; PURPOSE_KEY='string'
                RELATED_BUCKET_KEY='string'; EVALUATED_CLAIM_REFERENCE='string'; EVALUATOR_PROCESS_REFERENCE='string'; RATIONALE_REFERENCE='string'
            }) 'classification payload'
            if ($scope.BUDGET_TYPE -cne 'NONE' -or $scope.BUCKET_KEY -cne $payload.BUCKET_KEY -or -not $unchangedFreezes -or
                $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM) {
                throw 'BLOCKED: classification scope or unrelated state changed'
            }
            if ($payload.CLASSIFICATION -ceq 'SAME_MATERIAL_BUCKET') {
                $match=@($oldBuckets | Where-Object { $_.BUCKET_KEY -ceq $payload.BUCKET_KEY -and $_.STAGE_KEY -ceq $payload.STAGE_KEY -and $_.PURPOSE_KEY -ceq $payload.PURPOSE_KEY })
                if ($match.Count -ne 1 -or (Get-CanonicalRecordText ([ordered]@{ BUCKETS=$oldBuckets })) -cne
                    (Get-CanonicalRecordText ([ordered]@{ BUCKETS=$nextBuckets }))) { throw 'BLOCKED: SAME classification must reuse one unchanged existing bucket' }
            } elseif ($payload.CLASSIFICATION -ceq 'DISTINCT_MATERIAL_BUCKET') {
                if (@($oldBuckets | Where-Object { $_.BUCKET_KEY -ceq $payload.BUCKET_KEY -or ($_.STAGE_KEY -ceq $payload.STAGE_KEY -and $_.PURPOSE_KEY -ceq $payload.PURPOSE_KEY) }).Count -ne 0 -or
                    $nextBuckets.Count -ne $oldBuckets.Count+1 -or
                    ($payload.RELATED_BUCKET_KEY -cne 'NONE' -and @($oldBuckets | Where-Object { $_.BUCKET_KEY -ceq $payload.RELATED_BUCKET_KEY }).Count -ne 1) -or
                    ($payload.RELATED_BUCKET_KEY -ceq 'NONE' -and $oldBuckets.Count -ne 0)) {
                    throw 'BLOCKED: DISTINCT classification does not identify one genuinely new bucket'
                }
                $new=@($nextBuckets | Where-Object { $_.BUCKET_KEY -ceq $payload.BUCKET_KEY })
                $expectedRef="REVIEW:docs/reviews/federated-control-towers-foundation/decisions/$decisionId.json:$($added[0].CONSUMED_AUTHORITY_PROOF.SEMANTIC_DECISION_RECORD_SHA256)"
                if ($new.Count -ne 1 -or $new[0].STAGE_KEY -cne $payload.STAGE_KEY -or $new[0].PURPOSE_KEY -cne $payload.PURPOSE_KEY -or
                    $new[0].MATERIAL_EQUIVALENCE_REFERENCE -cne $expectedRef -or $new[0].APPROVED_MAXIMUM -ne 3 -or
                    $new[0].EXECUTION_GENERATIONS_USED -ne 0 -or $new[0].PENDING_COMMAND_ID -ne $null -or @($new[0].EVIDENCE_REFERENCES).Count -ne 0) {
                    throw 'BLOCKED: new bucket does not match the exact reviewed zero state'
                }
            } else { throw 'BLOCKED: unsupported classification outcome' }
        }
        'BUDGET_MAXIMUM_EXCEPTION' {
            Assert-ExactAuthorityShape $payload ([ordered]@{
                BUDGET_TYPE='string'; BUCKET_KEY='nullable-string'; PREVIOUS_APPROVED_MAXIMUM='integer'
                NEW_APPROVED_MAXIMUM='integer'; ADDED_ALLOWANCE='integer'; PURPOSE='string'; STOP_CONDITION='string'
            }) 'budget maximum exception payload'
            if (-not $unchangedFreezes -or $scope.BUDGET_TYPE -cne $payload.BUDGET_TYPE -or
                $scope.BUCKET_KEY -cne $payload.BUCKET_KEY -or
                $payload.NEW_APPROVED_MAXIMUM -le $payload.PREVIOUS_APPROVED_MAXIMUM -or
                $payload.ADDED_ALLOWANCE -ne ($payload.NEW_APPROVED_MAXIMUM-$payload.PREVIOUS_APPROVED_MAXIMUM)) {
                throw 'BLOCKED: exception must be exact and strictly positive'
            }
            if ($scope.BUDGET_TYPE -ceq 'RECOVERY_BUDGET') {
                if ($scope.BUCKET_KEY -cne 'NONE' -or $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $payload.PREVIOUS_APPROVED_MAXIMUM -or
                    $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $payload.NEW_APPROVED_MAXIMUM -or
                    $Old.RECOVERY_BUDGET.ATTEMPTS_USED -ne $Next.RECOVERY_BUDGET.ATTEMPTS_USED) { throw 'BLOCKED: recovery exception scope or counter mismatch' }
            } elseif ($scope.BUDGET_TYPE -ceq 'EVALUATOR_BUDGET') {
                $oldBucket=@($oldBuckets | Where-Object { $_.BUCKET_KEY -ceq $scope.BUCKET_KEY })
                $newBucket=@($nextBuckets | Where-Object { $_.BUCKET_KEY -ceq $scope.BUCKET_KEY })
                if ($oldBucket.Count -ne 1 -or $newBucket.Count -ne 1 -or
                    $oldBucket[0].APPROVED_MAXIMUM -ne $payload.PREVIOUS_APPROVED_MAXIMUM -or
                    $newBucket[0].APPROVED_MAXIMUM -ne $payload.NEW_APPROVED_MAXIMUM -or
                    $oldBucket[0].EXECUTION_GENERATIONS_USED -ne $newBucket[0].EXECUTION_GENERATIONS_USED -or
                    $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM) {
                    throw 'BLOCKED: evaluator exception scope or counter mismatch'
                }
            } else { throw 'BLOCKED: unsupported exception budget type' }
        }
        'BUDGET_EXECUTION_FREEZE_TRANSITION' {
            Assert-ExactAuthorityShape $payload ([ordered]@{
                EXPECTED_ACTIVE_FREEZE_ID='nullable-string'; PURPOSE='string'; STOP_CONDITION='string'; TRANSITION='string'
            }) 'freeze transition payload'
            if ($scope.BUDGET_TYPE -cnotin @('RECOVERY_BUDGET','EVALUATOR_BUDGET') -or
                ($scope.BUDGET_TYPE -ceq 'RECOVERY_BUDGET' -and $null -ne $scope.BUCKET_KEY) -or
                ($scope.BUDGET_TYPE -ceq 'EVALUATOR_BUDGET' -and [string]::IsNullOrWhiteSpace($scope.BUCKET_KEY)) -or
                $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM -or
                (Get-CanonicalRecordText ([ordered]@{ BUCKETS=$oldBuckets })) -cne (Get-CanonicalRecordText ([ordered]@{ BUCKETS=$nextBuckets }))) {
                throw 'BLOCKED: freeze changed budget capacity or has invalid scope'
            }
            $scopeText=Get-CanonicalRecordText $scope
            $before=@($oldFreezes | Where-Object { (Get-CanonicalRecordText $_.DECISION_SCOPE) -ceq $scopeText })
            $afterScope=@($newFreezes | Where-Object { (Get-CanonicalRecordText $_.DECISION_SCOPE) -ceq $scopeText })
            if ($payload.TRANSITION -ceq 'APPLY') {
                if ($null -ne $payload.EXPECTED_ACTIVE_FREEZE_ID -or $before.Count -ne 0 -or $afterScope.Count -ne 1 -or $afterScope[0].FREEZE_ID -cne $decisionId) {
                    throw 'BLOCKED: APPLY requires no active freeze and establishes exact decision ID'
                }
            } elseif ($payload.TRANSITION -ceq 'LIFT') {
                if ($before.Count -ne 1 -or $before[0].FREEZE_ID -cne $payload.EXPECTED_ACTIVE_FREEZE_ID -or $afterScope.Count -ne 0) {
                    throw 'BLOCKED: LIFT target is not the exact active freeze'
                }
            } elseif ($payload.TRANSITION -ceq 'SUPERSEDE') {
                if ($before.Count -ne 1 -or $before[0].FREEZE_ID -cne $payload.EXPECTED_ACTIVE_FREEZE_ID -or $afterScope.Count -ne 1 -or $afterScope[0].FREEZE_ID -cne $decisionId) {
                    throw 'BLOCKED: SUPERSEDE target or replacement is wrong'
                }
            } else { throw 'BLOCKED: unsupported freeze transition' }
            $beforeOther=@($oldFreezes | Where-Object { (Get-CanonicalRecordText $_.DECISION_SCOPE) -cne $scopeText })
            $afterOther=@($newFreezes | Where-Object { (Get-CanonicalRecordText $_.DECISION_SCOPE) -cne $scopeText })
            if ((Get-CanonicalRecordText ([ordered]@{ OTHER=$beforeOther })) -cne (Get-CanonicalRecordText ([ordered]@{ OTHER=$afterOther }))) {
                throw 'BLOCKED: freeze transition altered unrelated active scope'
            }
        }
        default { throw 'BLOCKED: unsupported consumed decision type' }
    }
    if ($decision.DECISION_TYPE -cne 'BUDGET_MAXIMUM_EXCEPTION' -and
        $Old.RECOVERY_BUDGET.APPROVED_MAXIMUM -ne $Next.RECOVERY_BUDGET.APPROVED_MAXIMUM) {
        throw 'BLOCKED: unrelated recovery maximum changed'
    }
    foreach ($oldBucket in $oldBuckets) {
        $match=@($nextBuckets | Where-Object { $_.BUCKET_KEY -ceq $oldBucket.BUCKET_KEY })
        if ($match.Count -eq 1 -and $oldBucket.APPROVED_MAXIMUM -ne $match[0].APPROVED_MAXIMUM -and
            ($decision.DECISION_TYPE -cne 'BUDGET_MAXIMUM_EXCEPTION' -or $decision.DECISION_SCOPE.BUCKET_KEY -cne $oldBucket.BUCKET_KEY)) {
            throw 'BLOCKED: unrelated evaluator maximum changed'
        }
    }
}

function New-AuthorityPostState([System.Collections.IDictionary]$Current, [psobject]$Verified) {
    $next=Copy-JsonRecord $Current
    $decision=$Verified.Decision
    $id=[string]$decision.DECISION_ID
    if ($id -cin @($Current.CONSUMED_AUTHORITY_PROOFS | ForEach-Object { $_.CONSUMED_AUTHORITY_PROOF.DECISION_ID })) {
        throw 'BLOCKED: semantic authority was already consumed'
    }
    $payload=$decision.DECISION_PAYLOAD
    switch ($decision.DECISION_TYPE) {
        'EVALUATOR_BUCKET_CLASSIFICATION' {
            if ($payload.CLASSIFICATION -ceq 'DISTINCT_MATERIAL_BUCKET') {
                $newBucket=[ordered]@{
                    BUCKET_KEY=$payload.BUCKET_KEY; STAGE_KEY=$payload.STAGE_KEY; PURPOSE_KEY=$payload.PURPOSE_KEY
                    MATERIAL_EQUIVALENCE_REFERENCE="REVIEW:docs/reviews/federated-control-towers-foundation/decisions/$id.json:$($Verified.ProofEntry.CONSUMED_AUTHORITY_PROOF.SEMANTIC_DECISION_RECORD_SHA256)"
                    EXECUTION_GENERATIONS_USED=0; APPROVED_MAXIMUM=3; EVIDENCE_REFERENCES=@(); PENDING_COMMAND_ID=$null
                }
                $sortedBuckets=[System.Collections.Generic.SortedDictionary[string,object]]::new([System.StringComparer]::Ordinal)
                foreach ($bucket in (@($next.EVALUATOR_BUDGET.BUCKETS)+@($newBucket))) { $sortedBuckets.Add([string]$bucket.BUCKET_KEY,$bucket) }
                $next.EVALUATOR_BUDGET['BUCKETS']=@($sortedBuckets.Values)
            }
        }
        'BUDGET_MAXIMUM_EXCEPTION' {
            if ($payload.BUDGET_TYPE -ceq 'RECOVERY_BUDGET') {
                $next.RECOVERY_BUDGET['APPROVED_MAXIMUM']=[long]$payload.NEW_APPROVED_MAXIMUM
            } elseif ($payload.BUDGET_TYPE -ceq 'EVALUATOR_BUDGET') {
                $match=@($next.EVALUATOR_BUDGET.BUCKETS | Where-Object { $_.BUCKET_KEY -ceq $payload.BUCKET_KEY })
                if ($match.Count -ne 1) { throw 'BLOCKED: exception target bucket is absent' }
                $match[0]['APPROVED_MAXIMUM']=[long]$payload.NEW_APPROVED_MAXIMUM
            }
        }
        'BUDGET_EXECUTION_FREEZE_TRANSITION' {
            $scopeText=Get-CanonicalRecordText $decision.DECISION_SCOPE
            $unchanged=@($next.CURRENT_ACTIVE_FREEZES | Where-Object { (Get-CanonicalRecordText $_.DECISION_SCOPE) -cne $scopeText })
            if ($payload.TRANSITION -ceq 'LIFT') {
                $next['CURRENT_ACTIVE_FREEZES']=$unchanged
            } else {
                $entry=[ordered]@{ DECISION_SCOPE=$decision.DECISION_SCOPE; FREEZE_ID=$id; RECORD_VERSION=1 }
                $sortedFreezes=[System.Collections.Generic.SortedDictionary[string,object]]::new([System.StringComparer]::Ordinal)
                foreach ($freeze in (@($unchanged)+@($entry))) { $sortedFreezes.Add((Get-CanonicalRecordText $freeze.DECISION_SCOPE),$freeze) }
                $next['CURRENT_ACTIVE_FREEZES']=@($sortedFreezes.Values)
            }
        }
    }
    $sortedProofs=[System.Collections.Generic.SortedDictionary[string,object]]::new([System.StringComparer]::Ordinal)
    foreach ($entry in (@($next.CONSUMED_AUTHORITY_PROOFS)+@($Verified.ProofEntry))) { $sortedProofs.Add([string]$entry.CONSUMED_AUTHORITY_PROOF.DECISION_ID,$entry) }
    $next['CONSUMED_AUTHORITY_PROOFS']=@($sortedProofs.Values)
    Assert-AuthorityTransition $Current $next 'AUTHORITY_CONSUMED'
    return $next
}

function New-SyntheticAuthorityArtifact([string]$Root, [string]$RelativePath, [System.Collections.IDictionary]$Record) {
    $path=[System.IO.Path]::Combine($Root,$RelativePath)
    $directory=[System.IO.Path]::GetDirectoryName($path)
    [void][System.IO.Directory]::CreateDirectory($directory)
    $text=Get-CanonicalRecordText $Record
    Write-DurableNewFile $path $text
    return [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.IO.File]::ReadAllBytes($path))).ToLowerInvariant()
}

function New-SyntheticAuthorityChain([string]$Root, [string]$ContextId, [string]$LineageId, [string]$Type, [System.Collections.IDictionary]$Scope, [System.Collections.IDictionary]$Payload, [int]$Round, [string]$DecisionToken = '', [string]$ResultStatus = 'COMPLETED') {
    $base='docs/reviews/federated-control-towers-foundation/decisions'
    $idInput=[ordered]@{ DECISION_TYPE=$Type; DECISION_SCOPE=$Scope; PROPOSED_DECISION_PAYLOAD=$Payload }
    $id=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes((Get-CanonicalRecordText $idInput)))).ToLowerInvariant()
    $descriptorPath="$base/descriptors/$id.json"
    $descriptor=[ordered]@{
        DESCRIPTOR_VERSION=1; DECISION_TYPE=$Type; EXECUTION_CONTEXT_ID=$ContextId; CAUSAL_LINEAGE_ID=$LineageId
        BUCKET_KEY=$Scope.BUCKET_KEY; DECISION_SCOPE=$Scope; PROPOSED_DECISION_PAYLOAD=$Payload; PURPOSE_REFERENCE='SYNTHETIC_REVIEW'
    }
    $descriptorHash=New-SyntheticAuthorityArtifact $Root $descriptorPath $descriptor
    $reviewPath="$base/synthetic-review-$Round.txt"
    $reviewFull=[System.IO.Path]::Combine($Root,$reviewPath)
    Write-DurableNewFile $reviewFull "SYNTHETIC_REVIEW_$Round"
    $reviewHash=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.IO.File]::ReadAllBytes($reviewFull))).ToLowerInvariant()
    $gateCommand="SYNTH-RUN:$Round"
    $recordingCommand="SYNTH-RUN:$($Round+1)"
    $item="$gateCommand#1"
    $selectedToken=if ($DecisionToken) { $DecisionToken } else { $decisionTokens[$Type] }
    $core=[ordered]@{
        PROTOCOL_VERSION=1; RUN_ID='SYNTH-RUN'; ROUND_ID=$Round; COMMAND_ID=$gateCommand; CAUSAL_LINEAGE_ID=$LineageId
        STAGE='SYNTHETIC_AUTHORITY_REVIEW'; STATUS=$ResultStatus; CURRENT_USER_DECISION=$selectedToken
        DECISION_ITEM_ID=$item; DECISION_ID=$id; DECISION_TYPE=$Type; DECISION_SCOPE=$Scope
        REVIEW_PACKET_PATH=$reviewPath; REVIEW_PACKET_PRE_APPROVAL_SHA256=$reviewHash
    }
    $resultHash=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes((Get-CanonicalRecordText $core)))).ToLowerInvariant()
    $resultPath="$base/gate-results/$resultHash.json"
    $result=[ordered]@{ RECORD_VERSION=1; RESULT_HASH=$resultHash; RESULT_CORE=$core; RECORDED_BY_COMMAND_ID=$recordingCommand; RECORDED_AT_UTC='2026-09-26T00:00:00Z' }
    $resultFileHash=New-SyntheticAuthorityArtifact $Root $resultPath $result
    $approvalInput=[ordered]@{ DECISION_ID=$id; RESULT_HASH=$resultHash; DECISION_ITEM_ID=$item; REVIEW_PACKET_PRE_APPROVAL_SHA256=$reviewHash; APPROVAL_RECORDING_COMMAND_ID=$recordingCommand }
    $approvalId=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes((Get-CanonicalRecordText $approvalInput)))).ToLowerInvariant()
    $approvalPath="$base/approvals/$approvalId.json"
    $approval=[ordered]@{
        APPROVAL_RECORD_VERSION=1; APPROVAL_RECORD_ID=$approvalId; APPROVAL_STATUS='APPROVED'; DECISION_ID=$id
        DECISION_TYPE=$Type; DECISION_SCOPE=$Scope; PRE_DECISION_DESCRIPTOR_PATH=$descriptorPath
        PRE_DECISION_DESCRIPTOR_SHA256=$descriptorHash; ACCEPTED_GATE_RESULT_RECORD_PATH=$resultPath
        ACCEPTED_GATE_RESULT_RECORD_SHA256=$resultFileHash; RESULT_HASH=$resultHash; DECISION_ITEM_ID=$item
        CURRENT_USER_DECISION=$selectedToken; REVIEW_PACKET_PATH=$reviewPath
        REVIEW_PACKET_PRE_APPROVAL_SHA256=$reviewHash; APPROVAL_RECORDING_COMMAND_ID=$recordingCommand
        CREATED_AT_UTC='2026-09-26T00:00:01Z'
    }
    $approvalHash=New-SyntheticAuthorityArtifact $Root $approvalPath $approval
    $semantic=[ordered]@{
        RECORD_VERSION=1; DECISION_ID=$id; DECISION_TYPE=$Type; STATUS='APPROVED'; DECISION_SCOPE=$Scope
        DECISION_PAYLOAD=$Payload; PRE_DECISION_DESCRIPTOR_PATH=$descriptorPath; PRE_DECISION_DESCRIPTOR_SHA256=$descriptorHash
        APPROVAL_RECORD_PATH=$approvalPath; APPROVAL_RECORD_SHA256=$approvalHash; RESULT_HASH=$resultHash; DECISION_ITEM_ID=$item
    }
    $semanticHash=New-SyntheticAuthorityArtifact $Root "$base/$id.json" $semantic
    return [pscustomobject]@{ DecisionId=$id; SemanticHash=$semanticHash; ResultPath=$resultPath; ApprovalPath=$approvalPath; DescriptorPath=$descriptorPath }
}

function New-UncertainLiveTerminalState([System.Collections.IDictionary]$Current, [string]$ExpectedDecisionId, [string]$ExpectedRunId, [string]$ExpectedCommandId) {
    if ($ExpectedDecisionId -cnotmatch '^[0-9a-f]{64}$' -or $ExpectedRunId -cnotmatch '^[A-Z0-9][A-Z0-9-]*$' -or
        $ExpectedCommandId -cne "${ExpectedRunId}:1" -or $Current.STATE -cne 'ACTIVATING' -or
        $Current.ACTIVE_RUN_ID -cne $ExpectedRunId -or $Current.LAST_ACCEPTED_COMMAND_ID -cne $ExpectedCommandId -or
        $Current.DELIVERY_STATE -cne 'DELIVERY_UNCERTAIN' -or $Current.EXECUTION_STATE -cne 'EXECUTION_UNCERTAIN' -or
        $null -ne $Current.LAST_RESULT_IDENTITY -or $Current.AUTHORIZATION_REFERENCE.SCOPE -cne $ExpectedDecisionId) {
        throw 'BLOCKED: uncertain live terminalization identity or state mismatch'
    }
    $proofs=@($Current.CONSUMED_AUTHORITY_PROOFS | Where-Object { $_.CONSUMED_AUTHORITY_PROOF.DECISION_ID -ceq $ExpectedDecisionId })
    $runs=@($Current.RUN_BINDING | Where-Object { $_.RUN_ID -ceq $ExpectedRunId -and $_.STATE -ceq 'RESERVED' -and
        $_.ACTIVATION_EPOCH -eq $Current.ACTIVATION_EPOCH -and $_.CONTROL_TOWER_INSTANCE -ceq $Current.CONTROL_TOWER_INSTANCE })
    if ($proofs.Count -ne 1 -or $runs.Count -ne 1 -or @($Current.RUN_BINDING | Where-Object { $_.STATE -ceq 'ACTIVE' }).Count -ne 0) {
        throw 'BLOCKED: consumed authority or reserved run cannot be proven unique'
    }
    $next=Copy-JsonRecord $Current
    $next['STATE']='TERMINAL'
    $next['ACTIVE_RUN_ID']=$null
    foreach ($run in $next.RUN_BINDING) { if ($run.RUN_ID -ceq $ExpectedRunId) { $run['STATE']='TERMINAL' } }
    foreach ($blocker in @('DUPLICATE_RESULT_RELAY','UNCERTAIN_RESULT_DELIVERY','NO_REPLAY')) {
        if ($blocker -cnotin @($next.BLOCKERS)) { $next['BLOCKERS']=@($next.BLOCKERS)+@($blocker) }
    }
    return $next
}

function New-HistoryPreservingRetryState([System.Collections.IDictionary]$Current, [string]$ExpectedDecisionId, [string]$ExpectedRunId, [string]$ExpectedCommandId, [string]$TargetRunId) {
    if ($Current.STATE -cne 'TERMINAL' -or $null -ne $Current.ACTIVE_RUN_ID -or
        $Current.DELIVERY_STATE -cne 'DELIVERY_UNCERTAIN' -or $Current.EXECUTION_STATE -cne 'EXECUTION_UNCERTAIN' -or
        $Current.EVIDENCE_STOP_STATE -cne 'NONE' -or $Current.RECORD_HASH -cnotmatch '^[0-9a-f]{64}$' -or
        $ExpectedDecisionId -cnotmatch '^[0-9a-f]{64}$' -or $ExpectedRunId -cnotmatch '^[A-Z0-9][A-Z0-9-]*$' -or
        $ExpectedCommandId -cne "${ExpectedRunId}:1" -or $Current.LAST_ACCEPTED_COMMAND_ID -cne $ExpectedCommandId -or
        $Current.AUTHORIZATION_REFERENCE.SCOPE -cne $ExpectedDecisionId -or
        $TargetRunId -cnotmatch '^[A-Z0-9][A-Z0-9-]*$' -or
        $TargetRunId -cin @($Current.RUN_BINDING | ForEach-Object { $_.RUN_ID }) -or
        @($Current.RUN_BINDING | Where-Object { $_.STATE -cin @('ACTIVE','RESERVED') }).Count -ne 0 -or
        @($Current.RUN_BINDING | Where-Object { $_.RUN_ID -ceq $ExpectedRunId -and $_.STATE -ceq 'TERMINAL' }).Count -ne 1 -or
        @($Current.CONSUMED_AUTHORITY_PROOFS | Where-Object { $_.CONSUMED_AUTHORITY_PROOF.DECISION_ID -ceq $ExpectedDecisionId }).Count -ne 1 -or
        @($Current.EVALUATOR_BUDGET.BUCKETS | Where-Object { $null -ne $_.PENDING_COMMAND_ID }).Count -ne 0 -or
        'NO_REPLAY' -cnotin @($Current.BLOCKERS)) {
        throw 'BLOCKED: terminal uncertain parent, consumed authority, or fresh retry lineage is unproven'
    }
    $next=Copy-JsonRecord $Current
    # The prior uncertain delivery remains immutable in its parent journal
    # revision. These slots describe only the new, unsent retry transaction.
    $next['DELIVERY_STATE']='NOT_SENT'
    $next['EXECUTION_STATE']='NONE'
    return $next
}

function Invoke-AuthoritySelfTest([string]$CheckoutRoot, [string]$HostLabel) {
    $checks=[System.Collections.Generic.List[object]]::new()
    $tempBase=[System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
    $tempRoot=[System.IO.Path]::Combine($tempBase,"YUTA-FED-AUTH-SELFTEST-$([Guid]::NewGuid().ToString('N'))")
    [void][System.IO.Directory]::CreateDirectory($tempRoot)
    try {
        $context='SYNTHETIC_AUTHORITY_QA'
        $lineage='SYNTHETIC-LINEAGE'
        $state=New-ActivationFixture $context $tempRoot $HostLabel
        $state['STATE']='TERMINAL'
        $state['CAUSAL_LINEAGE_ID']=$lineage
        $state.RECOVERY_BUDGET['CAUSAL_LINEAGE_ID']=$lineage
        $state.RECOVERY_BUDGET['APPROVED_MAXIMUM']=2
        $state.EVALUATOR_BUDGET['CAUSAL_LINEAGE_ID']=$lineage
        $first=New-ActivationFixture $context $tempRoot $HostLabel
        $null=Set-InMemoryHash $first 'RECORD_HASH'
        $selectionReviewPath='docs/reviews/federated-control-towers-foundation/decisions/synthetic-live-selection.txt'
        $selectionReviewFull=[System.IO.Path]::Combine($tempRoot,$selectionReviewPath)
        [void][System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($selectionReviewFull))
        Write-DurableNewFile $selectionReviewFull 'SYNTHETIC_SELECTION_ONLY'
        $selectionReviewHash=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.IO.File]::ReadAllBytes($selectionReviewFull))).ToLowerInvariant()
        $targetId=[ordered]@{ CONTROL_TOWER_ROLE='GLOBAL_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='FOUNDATION'; OWNING_PAGE_CHAT_ID='NONE' }
        $selectionTarget=[ordered]@{
            TOWER_ID=$targetId; CONTROL_TOWER_ROLE='GLOBAL_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='FOUNDATION'
            OWNING_PAGE_CHAT_ID='NONE'; CONTROL_TOWER_INSTANCE='SYNTH-CONVERSATION'; PROJECT_ID='SYNTH-PROJECT'
            CONVERSATION_ID='SYNTH-CONVERSATION'; CONVERSATION_TITLE='Synthetic selection target'
            CONVERSATION_URL='https://chatgpt.com/g/SYNTH-PROJECT/c/SYNTH-CONVERSATION'
        }
        $selectionScope=[ordered]@{ BUDGET_TYPE='NONE'; BUCKET_KEY='NONE'; CAUSAL_LINEAGE_ID=$lineage; EXECUTION_CONTEXT_ID=$context }
        $selectionPayload=[ordered]@{
            INTENDED_ACTION='FIRST_ACTIVATION'; EXPECTED_SOURCE_RECORD_HASH=$first.RECORD_HASH
            EXPECTED_SOURCE_STATE='INACTIVE'; EXPECTED_SOURCE_EPOCH=0; TARGET_ACTIVATION_EPOCH=1
            TARGET_RUN_ID='SYNTH-SELECTION-RUN'; TARGET_TOWER=$selectionTarget
            REVIEWED_SELECTION_ARTIFACT_PATH=$selectionReviewPath; REVIEWED_SELECTION_ARTIFACT_SHA256=$selectionReviewHash
        }
        $selection=New-SyntheticAuthorityChain $tempRoot $context $lineage 'LIVE_TOWER_SELECTION' $selectionScope $selectionPayload 50
        $selectionVerified=Get-AuthorityDecision $tempRoot $selection.DecisionId $context $lineage
        $selectionPost=New-AuthorityPostState $first $selectionVerified
        $checks.Add([pscustomobject]@{ Case='live-selection-exact-chain-and-proof'; Passed=(
            $selectionPost.STATE -ceq 'INACTIVE' -and @($selectionPost.CONSUMED_AUTHORITY_PROOFS).Count -eq 1 -and
            $selectionVerified.ProofEntry.CONSUMED_AUTHORITY_PROOF.DECISION_TYPE -ceq 'LIVE_TOWER_SELECTION') })
        $selectionPost['REVISION']=1
        $selectionPost['PREVIOUS_RECORD_HASH']=$first.RECORD_HASH
        $checks.Add([pscustomobject]@{ Case='live-selection-inactive-post-state-schema'; Passed=(
            (Test-Record (Set-InMemoryHash $selectionPost 'RECORD_HASH') Activation $context $tempRoot $HostLabel).Valid) })
        $selectionReplayDenied=$false
        try { $null=New-AuthorityPostState $selectionPost $selectionVerified } catch { $selectionReplayDenied=$true }
        $checks.Add([pscustomobject]@{ Case='live-selection-once-only-consumption'; Passed=$selectionReplayDenied })
        $wrongSelectionSource=Copy-JsonRecord $first
        $wrongSelectionSource['RECORD_HASH']='0' * 64
        $wrongSelectionDenied=$false
        try { Assert-LiveSelectionPayload $selectionVerified.Decision $wrongSelectionSource } catch { $wrongSelectionDenied=$true }
        $checks.Add([pscustomobject]@{ Case='live-selection-stale-source-denied'; Passed=$wrongSelectionDenied })
        $wrongSelectionTarget=Copy-JsonRecord $selectionVerified.Decision
        $wrongSelectionTarget.DECISION_PAYLOAD.TARGET_TOWER['CONVERSATION_ID']='OTHER-CONVERSATION'
        $wrongTargetDenied=$false
        try { Assert-LiveSelectionPayload $wrongSelectionTarget $first } catch { $wrongTargetDenied=$true }
        $checks.Add([pscustomobject]@{ Case='live-selection-wrong-conversation-denied'; Passed=$wrongTargetDenied })
        $wrongLiveToken=New-SyntheticAuthorityChain $tempRoot $context $lineage 'LIVE_TOWER_SELECTION' $selectionScope ([ordered]@{
            INTENDED_ACTION='REACTIVATION'; EXPECTED_SOURCE_RECORD_HASH=$first.RECORD_HASH
            EXPECTED_SOURCE_STATE='INACTIVE'; EXPECTED_SOURCE_EPOCH=0; TARGET_ACTIVATION_EPOCH=1
            TARGET_RUN_ID='SYNTH-SELECTION-RUN-TWO'; TARGET_TOWER=$selectionTarget
            REVIEWED_SELECTION_ARTIFACT_PATH=$selectionReviewPath; REVIEWED_SELECTION_ARTIFACT_SHA256=$selectionReviewHash
        }) 51 'APPROVE_BUDGET_MAXIMUM_EXCEPTION'
        $wrongLiveTokenDenied=$false
        try { $null=Get-AuthorityDecision $tempRoot $wrongLiveToken.DecisionId $context $lineage } catch { $wrongLiveTokenDenied=$true }
        $checks.Add([pscustomobject]@{ Case='live-selection-wrong-exact-token-denied'; Passed=$wrongLiveTokenDenied })
        $probeState=Copy-JsonRecord $first
        $probeState['STATE']='ACTIVATING'
        $probeState['ACTIVE_RUN_ID']='SYNTH-SELECTION-RUN'
        $probeState['ACTIVATION_EPOCH']=1
        $probeState['CAUSAL_LINEAGE_ID']=$lineage
        $probeState['EXECUTION_CONTEXT_ID']=$context
        $intentHash='a' * 64
        $observation=[ordered]@{
            CONTINUATION_KIND='CONTROL_TOWER_EVALUATION_INPUT'; DECISION_ID=$selection.DecisionId
            EXECUTION_CONTEXT_ID=$context; CAUSAL_LINEAGE_ID=$lineage; TARGET_RUN_ID='SYNTH-SELECTION-RUN'
            TOWER_ID=$targetId; CONTROL_TOWER_INSTANCE='SYNTH-CONVERSATION'
            ACTIVATION_EPOCH=1; PROJECT_ID='SYNTH-PROJECT'; CONVERSATION_ID='SYNTH-CONVERSATION'
            CONVERSATION_TITLE='Synthetic selection target'; CONVERSATION_URL='https://chatgpt.com/g/SYNTH-PROJECT/c/SYNTH-CONVERSATION'
            PROTOCOL_VERSION=1; ROUND_ID=1; COMMAND_ID='SYNTH-SELECTION-RUN:1'
            HANDSHAKE_SHA256=('b' * 64); COMMAND_SHA256=('c' * 64); RESULT_SHA256=('d' * 64)
            EVALUATION_SHA256=('e' * 64); EVALUATION_STATUS='PASS'
            DELIVERY_STATE='RESPONSE_COMPLETE'; EXECUTION_STATE='COMPLETED'
            ACTION='READ_ONLY'; REPOSITORY_MUTATION='NONE'; PROBE_INTENT_EVENT_HASH=$intentHash
            OBSERVED_AT_UTC='2026-09-26T00:00:02Z'
        }
        $continuation=Assert-LiveTransactionContinuation (Get-CanonicalRecordText $observation) $probeState $selectionVerified.Decision $intentHash
        $observedHash=$continuation.InputHash
        $checks.Add([pscustomobject]@{ Case='live-probe-exact-metadata-join'; Passed=($observedHash -cmatch '^[0-9a-f]{64}$' -and $continuation.Disposition -ceq 'COMPLETE') })
        foreach ($negative in @(
            [pscustomobject]@{ Case='live-probe-wrong-target-denied'; Field='CONVERSATION_ID'; Value='OTHER-CONVERSATION' },
            [pscustomobject]@{ Case='live-probe-old-run-denied'; Field='TARGET_RUN_ID'; Value='OTHER-RUN' },
            [pscustomobject]@{ Case='live-probe-wrong-lineage-denied'; Field='CAUSAL_LINEAGE_ID'; Value='OTHER-LINEAGE' },
            [pscustomobject]@{ Case='live-probe-wrong-context-denied'; Field='EXECUTION_CONTEXT_ID'; Value='OTHER-CONTEXT' },
            [pscustomobject]@{ Case='live-probe-wrong-epoch-denied'; Field='ACTIVATION_EPOCH'; Value=2 },
            [pscustomobject]@{ Case='live-probe-wrong-transaction-denied'; Field='PROBE_INTENT_EVENT_HASH'; Value=('f' * 64) },
            [pscustomobject]@{ Case='live-probe-caller-marker-denied'; Field='TRANSPORT_SOURCE'; Value='CODEX_CUA_ACTUAL_UI' }
        )) {
            $bad=Copy-JsonRecord $observation
            $bad[$negative.Field]=$negative.Value
            $blocked=$false
            try { $null=Assert-LiveTransactionContinuation (Get-CanonicalRecordText $bad) $probeState $selectionVerified.Decision $intentHash } catch { $blocked=$true }
            $checks.Add([pscustomobject]@{ Case=$negative.Case; Passed=$blocked })
        }
        foreach ($disposition in @(
            [pscustomobject]@{ Case='live-probe-negative-evaluation-fails-closed'; Field='EVALUATION_STATUS'; Value='FAIL'; Expected='EVALUATION_FAILED' },
            [pscustomobject]@{ Case='live-probe-delivery-uncertain-fails-closed'; Field='DELIVERY_STATE'; Value='DELIVERY_UNCERTAIN'; Expected='DELIVERY_UNCERTAIN' },
            [pscustomobject]@{ Case='live-probe-execution-uncertain-fails-closed'; Field='EXECUTION_STATE'; Value='EXECUTION_UNCERTAIN'; Expected='EXECUTION_UNCERTAIN' }
        )) {
            $candidate=Copy-JsonRecord $observation
            $candidate[$disposition.Field]=$disposition.Value
            if ($disposition.Expected -cne 'EVALUATION_FAILED') { $candidate['EVALUATION_STATUS']='UNKNOWN' }
            $classified=Assert-LiveTransactionContinuation (Get-CanonicalRecordText $candidate) $probeState $selectionVerified.Decision $intentHash
            $checks.Add([pscustomobject]@{ Case=$disposition.Case; Passed=($classified.Disposition -ceq $disposition.Expected) })
        }
        $missingEvaluation=Copy-JsonRecord $observation
        $null=$missingEvaluation.Remove('EVALUATION_STATUS')
        $missingDenied=$false
        try { $null=Assert-LiveTransactionContinuation (Get-CanonicalRecordText $missingEvaluation) $probeState $selectionVerified.Decision $intentHash } catch { $missingDenied=$true }
        $checks.Add([pscustomobject]@{ Case='live-probe-missing-evaluation-denied'; Passed=$missingDenied })
        $selectionRuntime=[System.IO.Path]::Combine($tempRoot,'runtime-live-selection',$context)
        [void][System.IO.Directory]::CreateDirectory($selectionRuntime)
        $selectionLockPath=[System.IO.Path]::Combine($selectionRuntime,'lock')
        $selectionLock=[System.IO.FileStream]::new($selectionLockPath,[System.IO.FileMode]::OpenOrCreate,[System.IO.FileAccess]::ReadWrite,[System.IO.FileShare]::None)
        try {
            $selectionBinding=[pscustomobject]@{
                LockStream=$selectionLock; ReservedLockPath=$selectionLockPath; ReservedStatePath=$selectionRuntime
                ExecutionContextId=$context; CheckoutRoot=$tempRoot; HostLabel=$HostLabel; IsLive=$true
            }
            $selectionGenesis=New-ActivationFixture $context $tempRoot $HostLabel
            $genesisCommit=Commit-LocalRevision $selectionBinding $selectionGenesis 'ACTIVATION_INTENT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE'
            $committedPayload=Copy-JsonRecord $selectionPayload
            $committedPayload['EXPECTED_SOURCE_RECORD_HASH']=$genesisCommit.Snapshot.RECORD_HASH
            $committedSelection=New-SyntheticAuthorityChain $tempRoot $context $lineage 'LIVE_TOWER_SELECTION' $selectionScope $committedPayload 52
            $committedVerified=Get-LiveSelectionDecision $selectionBinding $genesisCommit.Snapshot $committedSelection.DecisionId
            $consumptionPost=New-AuthorityPostState $genesisCommit.Snapshot $committedVerified
            $consumed=Commit-LocalRevision $selectionBinding $consumptionPost 'AUTHORITY_CONSUMED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("DECISION_ID:$($committedSelection.DecisionId)")
            $checks.Add([pscustomobject]@{ Case='live-selection-journal-consumption-under-lock'; Passed=(
                @($consumed.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count -eq 1 -and $consumed.Snapshot.STATE -ceq 'INACTIVE') })
            $begin=Copy-JsonRecord $consumed.Snapshot
            $begin['STATE']='ACTIVATING'; $begin['ACTIVATION_EPOCH']=1
            foreach ($field in @('TOWER_ID','CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID','CONTROL_TOWER_INSTANCE','PROJECT_ID','CONVERSATION_ID','CONVERSATION_TITLE','CONVERSATION_URL')) {
                $begin[$field]=$selectionTarget[$field]
            }
            $begin['ACTIVE_RUN_ID']='SYNTH-SELECTION-RUN'; $begin['CAUSAL_LINEAGE_ID']=$lineage
            $begin.RECOVERY_BUDGET['CAUSAL_LINEAGE_ID']=$lineage
            $begin.RECOVERY_BUDGET['APPROVED_MAXIMUM']=2
            $begin.EVALUATOR_BUDGET['CAUSAL_LINEAGE_ID']=$lineage
            $begin['AUTHORIZATION_REFERENCE']=[ordered]@{
                DECISION_SOURCE='SYNTHETIC'; DECISION='NO_LIVE_AUTHORITY'; SCOPE='LOCAL_TEST'
                ARTIFACT_PATH=$selectionReviewPath; ARTIFACT_SHA256=$selectionReviewHash
                DECIDED_AT_UTC='2026-09-26T00:00:00Z'
            }
            $begin['RUN_BINDING']=@([ordered]@{
                RUN_ID='SYNTH-SELECTION-RUN'; ACTIVATION_EPOCH=1; TOWER_ID=$selectionTarget.TOWER_ID
                CONTROL_TOWER_INSTANCE='SYNTH-CONVERSATION'; PROJECT_ID='SYNTH-PROJECT'
                CONVERSATION_ID='SYNTH-CONVERSATION'; STATE='RESERVED'
            })
            $activationCommit=Commit-LocalRevision $selectionBinding $begin 'ACTIVATION_INTENT' 'SYNTH-SELECTION-RUN' $null 'NOT_APPLICABLE'
            $intentState=Copy-JsonRecord $activationCommit.Snapshot
            $intentState['LAST_ACCEPTED_COMMAND_ID']='SYNTH-SELECTION-RUN:1'
            $intentState['EXECUTION_STATE']='ACCEPTED'; $intentState['DELIVERY_STATE']='SENDING'
            $intentCommit=Commit-LocalRevision $selectionBinding $intentState 'PROBE_INTENT' 'SYNTH-SELECTION-RUN' 1 'SYNTH-SELECTION-RUN:1' @("LIVE_SELECTION_DECISION_ID:$($committedSelection.DecisionId)")
            $checks.Add([pscustomobject]@{ Case='live-selection-probe-intent-nonexecuting'; Passed=(
                $intentCommit.Status -cin @('EXECUTION_UNCERTAIN','PROBE_UNCERTAIN') -and -not $intentCommit.ExecutableAuthority) })
            $syntheticUncertain=Copy-JsonRecord $intentCommit.Snapshot
            $syntheticUncertain['DELIVERY_STATE']='DELIVERY_UNCERTAIN'
            $syntheticUncertain['EXECUTION_STATE']='EXECUTION_UNCERTAIN'
            $syntheticUncertain.AUTHORIZATION_REFERENCE['SCOPE']=$committedSelection.DecisionId
            $terminalProjection=New-UncertainLiveTerminalState $syntheticUncertain $committedSelection.DecisionId 'SYNTH-SELECTION-RUN' 'SYNTH-SELECTION-RUN:1'
            $checks.Add([pscustomobject]@{ Case='uncertain-live-terminal-preserves-proof-and-non-replayable-run'; Passed=(
                $terminalProjection.STATE -ceq 'TERMINAL' -and $null -eq $terminalProjection.ACTIVE_RUN_ID -and
                $terminalProjection.RUN_BINDING[0].STATE -ceq 'TERMINAL' -and
                $terminalProjection.DELIVERY_STATE -ceq 'DELIVERY_UNCERTAIN' -and
                $terminalProjection.EXECUTION_STATE -ceq 'EXECUTION_UNCERTAIN' -and
                @($terminalProjection.CONSUMED_AUTHORITY_PROOFS).Count -eq 1 -and
                $terminalProjection.LAST_ACCEPTED_COMMAND_ID -ceq 'SYNTH-SELECTION-RUN:1') })
            $terminalReplayDenied=$false
            try { $null=New-UncertainLiveTerminalState $terminalProjection $committedSelection.DecisionId 'SYNTH-SELECTION-RUN' 'SYNTH-SELECTION-RUN:1' } catch { $terminalReplayDenied=$true }
            $checks.Add([pscustomobject]@{ Case='uncertain-live-terminal-replay-denied'; Passed=$terminalReplayDenied })
            $wrongTerminalDecisionDenied=$false
            try { $null=New-UncertainLiveTerminalState $syntheticUncertain ('f' * 64) 'SYNTH-SELECTION-RUN' 'SYNTH-SELECTION-RUN:1' } catch { $wrongTerminalDecisionDenied=$true }
            $checks.Add([pscustomobject]@{ Case='uncertain-live-terminal-wrong-authority-denied'; Passed=$wrongTerminalDecisionDenied })
            $retryParent=Copy-JsonRecord $terminalProjection
            $retryParent['RECORD_HASH']='b' * 64
            $retryRun='SYNTH-SELECTION-RETRY-2'
            $retry=New-HistoryPreservingRetryState $retryParent $committedSelection.DecisionId 'SYNTH-SELECTION-RUN' 'SYNTH-SELECTION-RUN:1' $retryRun
            $retry['REVISION']=[long]$retryParent.REVISION+1
            $retry['PREVIOUS_RECORD_HASH']=$retryParent.RECORD_HASH
            $retryRefs=@(
                "PARENT_RUNTIME_HASH:$($retryParent.RECORD_HASH)", "TARGET_RUN_ID:$retryRun",
                'OLD_COMMAND_ID:SYNTH-SELECTION-RUN:1', "CONSUMED_DECISION_ID:$($committedSelection.DecisionId)",
                "CAUSAL_LINEAGE_ID:$($retryParent.CAUSAL_LINEAGE_ID)",
                'HUMAN_GATE_COMMAND_ID:BRIDGE-ARCH-20260925-F9R2:164'
            )
            $retryTransitionValid=$true
            try { Assert-ApprovedTransition $retryParent $retry 'RETRY_GENESIS' 'SYNTH-RETRY-EVENT' $retry.REVISION 'NOT_APPLICABLE' $retryRefs }
            catch { $retryTransitionValid=$false }
            $checks.Add([pscustomobject]@{ Case='history-preserving-retry-parent-and-budget-transition'; Passed=(
                $retryTransitionValid -and $retry.DELIVERY_STATE -ceq 'NOT_SENT' -and $retry.EXECUTION_STATE -ceq 'NONE' -and
                $retry.LAST_ACCEPTED_COMMAND_ID -ceq $retryParent.LAST_ACCEPTED_COMMAND_ID -and
                (Get-ComparableValueText $retry.CONSUMED_AUTHORITY_PROOFS) -ceq (Get-ComparableValueText $retryParent.CONSUMED_AUTHORITY_PROOFS) -and
                (Get-ComparableValueText $retry.RECOVERY_BUDGET) -ceq (Get-ComparableValueText $retryParent.RECOVERY_BUDGET) -and
                (Get-ComparableValueText $retry.EVALUATOR_BUDGET) -ceq (Get-ComparableValueText $retryParent.EVALUATOR_BUDGET)) })
            $wrongParent=Copy-JsonRecord $retry
            $wrongParent['PREVIOUS_RECORD_HASH']='a' * 64
            $wrongParentDenied=$false
            try { Assert-ApprovedTransition $retryParent $wrongParent 'RETRY_GENESIS' 'SYNTH-RETRY-EVENT' $retry.REVISION 'NOT_APPLICABLE' $retryRefs } catch { $wrongParentDenied=$true }
            $checks.Add([pscustomobject]@{ Case='history-preserving-retry-ambiguous-parent-denied'; Passed=$wrongParentDenied })
            $nonterminalDenied=$false
            try { $null=New-HistoryPreservingRetryState $syntheticUncertain $committedSelection.DecisionId 'SYNTH-SELECTION-RUN' 'SYNTH-SELECTION-RUN:1' $retryRun } catch { $nonterminalDenied=$true }
            $checks.Add([pscustomobject]@{ Case='history-preserving-retry-nonterminal-denied'; Passed=$nonterminalDenied })
            $activeSource=Copy-JsonRecord $retryParent
            $activeSource['ACTIVE_RUN_ID']='SYNTH-SELECTION-RUN'
            $activeSource.RUN_BINDING[0]['STATE']='ACTIVE'
            $activeSource['STATE']='ACTIVE'
            $activeSourceDenied=$false
            try { $null=New-HistoryPreservingRetryState $activeSource $committedSelection.DecisionId 'SYNTH-SELECTION-RUN' 'SYNTH-SELECTION-RUN:1' $retryRun } catch { $activeSourceDenied=$true }
            $checks.Add([pscustomobject]@{ Case='history-preserving-retry-executable-source-denied'; Passed=$activeSourceDenied })
            $replayDenied=$false
            try { $null=New-HistoryPreservingRetryState $retry $committedSelection.DecisionId 'SYNTH-SELECTION-RUN' 'SYNTH-SELECTION-RUN:1' $retryRun } catch { $replayDenied=$true }
            $checks.Add([pscustomobject]@{ Case='history-preserving-retry-old-command-and-authority-nonreplayable'; Passed=$replayDenied })
            $competingLockDenied=$false
            try {
                $second=[System.IO.FileStream]::new($selectionLockPath,[System.IO.FileMode]::OpenOrCreate,[System.IO.FileAccess]::ReadWrite,[System.IO.FileShare]::None)
                $second.Dispose()
            } catch [System.IO.IOException] { $competingLockDenied=$true }
            $checks.Add([pscustomobject]@{ Case='live-selection-lock-held-through-probe-intent'; Passed=$competingLockDenied })
            # A separate process must also be unable to acquire the same
            # FileShare.None handle while the synthetic external round waits.
            $lockLiteral="'" + $selectionLockPath.Replace("'","''") + "'"
            $probeScript="try { `$probe=[System.IO.FileStream]::new($lockLiteral,[System.IO.FileMode]::OpenOrCreate,[System.IO.FileAccess]::ReadWrite,[System.IO.FileShare]::None); `$probe.Dispose(); exit 0 } catch [System.IO.IOException] { exit 23 }"
            $probeInfo=[System.Diagnostics.ProcessStartInfo]::new()
            $probeInfo.FileName=(Get-Process -Id $PID).Path
            $probeInfo.UseShellExecute=$false
            $probeInfo.CreateNoWindow=$true
            $probeInfo.ArgumentList.Add('-NoProfile')
            $probeInfo.ArgumentList.Add('-EncodedCommand')
            $probeInfo.ArgumentList.Add([Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($probeScript)))
            $probeProcess=[System.Diagnostics.Process]::Start($probeInfo)
            try {
                if (-not $probeProcess.WaitForExit(10000)) { $probeProcess.Kill(); $probeProcess.WaitForExit() }
                $checks.Add([pscustomobject]@{ Case='live-selection-competing-process-denied-during-external-wait'; Passed=($probeProcess.ExitCode -eq 23) })
            } finally { $probeProcess.Dispose() }
            $outcomeState=Copy-JsonRecord $intentCommit.Snapshot
            $outcomeState['EXECUTION_STATE']='COMPLETED'; $outcomeState['DELIVERY_STATE']='RESPONSE_COMPLETE'
            $outcomeState['LAST_RESULT_IDENTITY']=[ordered]@{
                RUN_ID='SYNTH-SELECTION-RUN'; ROUND_ID=1; COMMAND_ID='SYNTH-SELECTION-RUN:1'
                CAUSAL_LINEAGE_ID=$lineage; STAGE='FEDERATION_READ_ONLY_PROBE'; RESULT_HASH=('d' * 64)
            }
            $outcomeCommit=Commit-LocalRevision $selectionBinding $outcomeState 'PROBE_OUTCOME' 'SYNTH-SELECTION-RUN' 1 'SYNTH-SELECTION-RUN:1' @(
                "LIVE_SELECTION_DECISION_ID:$($committedSelection.DecisionId)","CONTROL_TOWER_EVALUATION_INPUT:$observedHash")
            $activeState=Copy-JsonRecord $outcomeCommit.Snapshot
            $activeState['STATE']='ACTIVE'; $activeState.RUN_BINDING[0]['STATE']='ACTIVE'
            $activeCommitted=Commit-LocalRevision $selectionBinding $activeState 'ACTIVE_COMMIT' 'SYNTH-SELECTION-RUN' 1 'SYNTH-SELECTION-RUN:1' @(
                "LIVE_SELECTION_DECISION_ID:$($committedSelection.DecisionId)","CONTROL_TOWER_EVALUATION_INPUT:$observedHash")
            $checks.Add([pscustomobject]@{ Case='live-selection-private-synthetic-transaction'; Passed=(
                $activeCommitted.Snapshot.STATE -ceq 'ACTIVE' -and @($activeCommitted.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count -eq 1 -and
                -not $activeCommitted.ExecutableAuthority) })
            $rotatedTarget=Copy-JsonRecord $selectionTarget
            $rotatedTarget['CONTROL_TOWER_INSTANCE']='SYNTH-CONVERSATION-ROTATED'
            $rotatedTarget['CONVERSATION_ID']='SYNTH-CONVERSATION-ROTATED'
            $rotatedTarget['CONVERSATION_TITLE']='Synthetic rotated global tower'
            $rotatedTarget['CONVERSATION_URL']='https://chatgpt.com/g/SYNTH-PROJECT/c/SYNTH-CONVERSATION-ROTATED'
            $rotationPayload=[ordered]@{
                INTENDED_ACTION='GLOBAL_ROTATION'; EXPECTED_SOURCE_RECORD_HASH=$activeCommitted.Snapshot.RECORD_HASH
                EXPECTED_SOURCE_STATE='ACTIVE'; EXPECTED_SOURCE_EPOCH=1; TARGET_ACTIVATION_EPOCH=3
                TARGET_RUN_ID='SYNTH-ROTATED-RUN'; TARGET_TOWER=$rotatedTarget
                REVIEWED_SELECTION_ARTIFACT_PATH=$selectionReviewPath; REVIEWED_SELECTION_ARTIFACT_SHA256=$selectionReviewHash
            }
            $rotation=New-SyntheticAuthorityChain $tempRoot $context $lineage 'LIVE_TOWER_SELECTION' $selectionScope $rotationPayload 53
            $rotationVerified=Get-LiveSelectionDecision $selectionBinding $activeCommitted.Snapshot $rotation.DecisionId
            $rotationPost=New-AuthorityPostState $activeCommitted.Snapshot $rotationVerified
            $rotationConsumed=Commit-LocalRevision $selectionBinding $rotationPost 'AUTHORITY_CONSUMED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("DECISION_ID:$($rotation.DecisionId)")
            $fenceState=Copy-JsonRecord $rotationConsumed.Snapshot
            $fenceState['STATE']='FENCING'; $fenceState['ACTIVATION_EPOCH']=2
            $fenceState['ACTIVE_RUN_ID']=$null; $fenceState.RUN_BINDING[0]['STATE']='REVOKED'
            $fenceCommitted=Commit-LocalRevision $selectionBinding $fenceState 'FENCE_COMMIT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE'
            $terminalState=Copy-JsonRecord $fenceCommitted.Snapshot
            $terminalState['STATE']='TERMINAL'
            $terminalCommitted=Commit-LocalRevision $selectionBinding $terminalState 'TERMINAL_COMMIT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE'
            $transfer=New-LiveHandoff $selectionBinding $terminalCommitted.Snapshot $rotationVerified.Decision 'SYNTH-SELECTION-RUN'
            $checks.Add([pscustomobject]@{ Case='live-rotation-source-fenced-before-handoff'; Passed=(
                $transfer.Snapshot.STATE -ceq 'TERMINAL' -and $transfer.Snapshot.ACTIVATION_EPOCH -eq 2 -and
                @($transfer.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count -eq 2 -and
                @($transfer.Snapshot.RUN_BINDING).Count -eq 2 -and
                $transfer.Handoff.TARGET_RUN_ID -ceq 'SYNTH-ROTATED-RUN' -and
                -not $transfer.Snapshot.ACTIVE_RUN_ID) })
            $driftedBudget=Copy-JsonRecord $transfer.Handoff
            $driftedBudget.RECOVERY_BUDGET['ATTEMPTS_USED']=1
            $budgetDriftDenied=$false
            try { Assert-HandoffSourceAndStatus $selectionBinding $driftedBudget $transfer.Snapshot } catch { $budgetDriftDenied=$true }
            $checks.Add([pscustomobject]@{ Case='live-handoff-budget-counter-drift-denied'; Passed=$budgetDriftDenied })
            $driftedProof=Copy-JsonRecord $transfer.Handoff
            $driftedProof['CONSUMED_AUTHORITY_PROOFS']=@($driftedProof.CONSUMED_AUTHORITY_PROOFS | Select-Object -First 1)
            $proofDriftDenied=$false
            try { Assert-HandoffSourceAndStatus $selectionBinding $driftedProof $transfer.Snapshot } catch { $proofDriftDenied=$true }
            $checks.Add([pscustomobject]@{ Case='live-handoff-consumed-proof-drift-denied'; Passed=$proofDriftDenied })
            $rotationReplayDenied=$false
            try { $null=New-AuthorityPostState $transfer.Snapshot $rotationVerified } catch { $rotationReplayDenied=$true }
            $checks.Add([pscustomobject]@{ Case='live-rotation-selection-replay-denied'; Passed=$rotationReplayDenied })
            $rotationBegin=Copy-JsonRecord $transfer.Snapshot
            $rotationBegin['STATE']='ACTIVATING'; $rotationBegin['ACTIVATION_EPOCH']=3
            foreach ($field in @('TOWER_ID','CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID','CONTROL_TOWER_INSTANCE','PROJECT_ID','CONVERSATION_ID','CONVERSATION_TITLE','CONVERSATION_URL')) {
                $rotationBegin[$field]=$rotatedTarget[$field]
            }
            $rotationBegin['ACTIVE_RUN_ID']='SYNTH-ROTATED-RUN'
            $rotationActivation=Commit-LocalRevision $selectionBinding $rotationBegin 'ACTIVATION_INTENT' 'SYNTH-ROTATED-RUN' $null 'NOT_APPLICABLE' @("LIVE_SELECTION_DECISION_ID:$($rotation.DecisionId)")
            $rotationProbe=Copy-JsonRecord $rotationActivation.Snapshot
            $rotationProbe['LAST_ACCEPTED_COMMAND_ID']='SYNTH-ROTATED-RUN:1'
            $rotationProbe['LAST_RESULT_IDENTITY']=$null
            $rotationProbe['EXECUTION_STATE']='ACCEPTED'; $rotationProbe['DELIVERY_STATE']='SENDING'
            $rotationIntent=Commit-LocalRevision $selectionBinding $rotationProbe 'PROBE_INTENT' 'SYNTH-ROTATED-RUN' 1 'SYNTH-ROTATED-RUN:1' @("LIVE_SELECTION_DECISION_ID:$($rotation.DecisionId)")
            $rotationOutcome=Copy-JsonRecord $rotationIntent.Snapshot
            $rotationOutcome['EXECUTION_STATE']='COMPLETED'; $rotationOutcome['DELIVERY_STATE']='RESPONSE_COMPLETE'
            $rotationOutcome['LAST_RESULT_IDENTITY']=[ordered]@{
                RUN_ID='SYNTH-ROTATED-RUN'; ROUND_ID=1; COMMAND_ID='SYNTH-ROTATED-RUN:1'
                CAUSAL_LINEAGE_ID=$lineage; STAGE='FEDERATION_READ_ONLY_PROBE'; RESULT_HASH=('e' * 64)
            }
            $rotationResult=Commit-LocalRevision $selectionBinding $rotationOutcome 'PROBE_OUTCOME' 'SYNTH-ROTATED-RUN' 1 'SYNTH-ROTATED-RUN:1' @("LIVE_SELECTION_DECISION_ID:$($rotation.DecisionId)","CONTROL_TOWER_EVALUATION_INPUT:$observedHash")
            $rotationActive=Copy-JsonRecord $rotationResult.Snapshot
            $rotationActive['STATE']='ACTIVE'; $rotationActive.RUN_BINDING[1]['STATE']='ACTIVE'
            $rotationActive['CURRENT_HANDOFF_ID']=$transfer.HandoffId
            $rotationActive['CONSUMED_HANDOFF_IDS']=@($rotationActive.CONSUMED_HANDOFF_IDS)+@($transfer.HandoffId)
            $rotationFinal=Commit-LocalRevision $selectionBinding $rotationActive 'ACTIVE_COMMIT' 'SYNTH-ROTATED-RUN' 1 'SYNTH-ROTATED-RUN:1' @("CONTROL_TOWER_EVALUATION_INPUT:$observedHash")
            $checks.Add([pscustomobject]@{ Case='live-rotation-handoff-consumed-after-bound-probe'; Passed=(
                $rotationFinal.Snapshot.STATE -ceq 'ACTIVE' -and
                $rotationFinal.Snapshot.ACTIVE_RUN_ID -ceq 'SYNTH-ROTATED-RUN' -and
                $rotationFinal.Snapshot.CURRENT_HANDOFF_ID -ceq $transfer.HandoffId -and
                @($rotationFinal.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count -eq 2 -and
                @($rotationFinal.Snapshot.CONSUMED_HANDOFF_IDS).Count -eq 1 -and
                $rotationFinal.Snapshot.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -ceq $lineage -and
                -not $rotationFinal.ExecutableAuthority) })
            $pageSource=Copy-JsonRecord $activeCommitted.Snapshot
            $pageId=[ordered]@{ CONTROL_TOWER_ROLE='PAGE_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='PAGE_LOCAL'; OWNING_PAGE_CHAT_ID='PAGE-REVIEWS' }
            $pageSource['TOWER_ID']=$pageId
            $pageSource['CONTROL_TOWER_ROLE']='PAGE_CONTROL_TOWER'
            $pageSource['CONTROL_TOWER_SCOPE']='PAGE_LOCAL'
            $pageSource['OWNING_PAGE_CHAT_ID']='PAGE-REVIEWS'
            $pageSource['RECORD_HASH']='f' * 64
            $pageTarget=Copy-JsonRecord $selectionTarget
            $pageTarget['TOWER_ID']=$pageId
            $pageTarget['CONTROL_TOWER_ROLE']='PAGE_CONTROL_TOWER'
            $pageTarget['CONTROL_TOWER_SCOPE']='PAGE_LOCAL'
            $pageTarget['OWNING_PAGE_CHAT_ID']='PAGE-REVIEWS'
            $pageTarget['CONVERSATION_ID']='PAGE-CONVERSATION-2'
            $pageTarget['CONTROL_TOWER_INSTANCE']='PAGE-CONVERSATION-2'
            $pageTarget['CONVERSATION_URL']='https://chatgpt.com/g/SYNTH-PROJECT/c/PAGE-CONVERSATION-2'
            $pageRotationPayload=Copy-JsonRecord $rotationPayload
            $pageRotationPayload['INTENDED_ACTION']='PAGE_ROTATION'
            $pageRotationPayload['EXPECTED_SOURCE_RECORD_HASH']=$pageSource.RECORD_HASH
            $pageRotationPayload['TARGET_TOWER']=$pageTarget
            $pageRotationDecision=[ordered]@{ DECISION_TYPE='LIVE_TOWER_SELECTION'; DECISION_SCOPE=$selectionScope; DECISION_PAYLOAD=$pageRotationPayload }
            $pageRotationAllowed=$true
            try { Assert-LiveSelectionPayload $pageRotationDecision $pageSource } catch { $pageRotationAllowed=$false }
            $checks.Add([pscustomobject]@{ Case='live-page-rotation-same-owner-allowed'; Passed=$pageRotationAllowed })
            $pageEscalationPayload=Copy-JsonRecord $pageRotationPayload
            $pageEscalationPayload['INTENDED_ACTION']='PAGE_TO_GLOBAL_ESCALATION'
            $globalEscalationTarget=Copy-JsonRecord $rotatedTarget
            $globalId=[ordered]@{ CONTROL_TOWER_ROLE='GLOBAL_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='CROSS_MODULE'; OWNING_PAGE_CHAT_ID='NONE' }
            $globalEscalationTarget['TOWER_ID']=$globalId
            $globalEscalationTarget['CONTROL_TOWER_SCOPE']='CROSS_MODULE'
            $pageEscalationPayload['TARGET_TOWER']=$globalEscalationTarget
            $pageEscalationDecision=[ordered]@{ DECISION_TYPE='LIVE_TOWER_SELECTION'; DECISION_SCOPE=$selectionScope; DECISION_PAYLOAD=$pageEscalationPayload }
            $pageEscalationAllowed=$true
            try { Assert-LiveSelectionPayload $pageEscalationDecision $pageSource } catch { $pageEscalationAllowed=$false }
            $checks.Add([pscustomobject]@{ Case='live-page-to-global-reviewed-scope-allowed'; Passed=$pageEscalationAllowed })
            $wrongPageOwner=Copy-JsonRecord $pageRotationDecision
            $wrongPageOwner.DECISION_PAYLOAD.TARGET_TOWER.TOWER_ID['OWNING_PAGE_CHAT_ID']='OTHER-PAGE'
            $wrongPageOwner.DECISION_PAYLOAD.TARGET_TOWER['OWNING_PAGE_CHAT_ID']='OTHER-PAGE'
            $pageOwnerDenied=$false
            try { Assert-LiveSelectionPayload $wrongPageOwner $pageSource } catch { $pageOwnerDenied=$true }
            $checks.Add([pscustomobject]@{ Case='live-page-owner-substitution-denied'; Passed=$pageOwnerDenied })
            # Branch the already verified synthetic Global journal into another
            # private fixture. The original branch still tests uncertainty.
            $g2pRuntime=[System.IO.Path]::Combine($tempRoot,'runtime-bound-page-selection',$context)
            [void][System.IO.Directory]::CreateDirectory($g2pRuntime)
            foreach ($file in (Get-ChildItem -LiteralPath $selectionRuntime -Recurse -File | Where-Object { $_.Name -cne 'lock' })) {
                $relative=$file.FullName.Substring($selectionRuntime.Length).TrimStart([char]'\')
                $destination=[System.IO.Path]::Combine($g2pRuntime,$relative)
                [void][System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($destination))
                [System.IO.File]::Copy($file.FullName,$destination)
            }
            $g2pLockPath=[System.IO.Path]::Combine($g2pRuntime,'lock')
            $g2pLock=[System.IO.FileStream]::new($g2pLockPath,[System.IO.FileMode]::OpenOrCreate,[System.IO.FileAccess]::ReadWrite,[System.IO.FileShare]::None)
            try {
                $g2pBinding=[pscustomobject]@{
                    LockStream=$g2pLock; ReservedLockPath=$g2pLockPath; ReservedStatePath=$g2pRuntime
                    ExecutionContextId=$context; CheckoutRoot=$tempRoot; HostLabel=$HostLabel; IsLive=$true
                }
                $g2pSource=Read-ReconciledContext $g2pBinding
                $pageTowerId=[ordered]@{
                    CONTROL_TOWER_ROLE='PAGE_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='PAGE_LOCAL'
                    OWNING_PAGE_CHAT_ID='6a760691-3674-83eb-9347-9e4ef8c60acf'
                }
                $boundPage=[ordered]@{
                    TOWER_ID=$pageTowerId; CONTROL_TOWER_ROLE='PAGE_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='PAGE_LOCAL'
                    OWNING_PAGE_CHAT_ID='6a760691-3674-83eb-9347-9e4ef8c60acf'
                    CONTROL_TOWER_INSTANCE='6a760691-3674-83eb-9347-9e4ef8c60acf'
                    PROJECT_ID='g-p-6a4d778944108191894f8e3657742da4'
                    CONVERSATION_ID='6a760691-3674-83eb-9347-9e4ef8c60acf'
                    CONVERSATION_TITLE='Avis & commentaires v'
                    CONVERSATION_URL='https://chatgpt.com/g/g-p-6a4d778944108191894f8e3657742da4-yuta-sarl/c/6a760691-3674-83eb-9347-9e4ef8c60acf'
                }
                $g2pPayload=[ordered]@{
                    INTENDED_ACTION='GLOBAL_TO_BOUND_PAGE_QA_TRANSFER'
                    EXPECTED_SOURCE_RECORD_HASH=$g2pSource.Snapshot.RECORD_HASH
                    EXPECTED_SOURCE_STATE='ACTIVE'; EXPECTED_SOURCE_EPOCH=3
                    TARGET_ACTIVATION_EPOCH=5; TARGET_RUN_ID='SYNTH-BOUND-PAGE-RUN'
                    TARGET_TOWER=$boundPage; REVIEWED_SELECTION_ARTIFACT_PATH=$selectionReviewPath
                    REVIEWED_SELECTION_ARTIFACT_SHA256=$selectionReviewHash
                }
                $g2pChain=New-SyntheticAuthorityChain $tempRoot $context $lineage 'LIVE_TOWER_SELECTION' $selectionScope $g2pPayload 54
                $g2pVerified=Get-LiveSelectionDecision $g2pBinding $g2pSource.Snapshot $g2pChain.DecisionId
                $checks.Add([pscustomobject]@{ Case='bound-page-exact-typed-selection-accepted'; Passed=(
                    $g2pVerified.Decision.DECISION_PAYLOAD.INTENDED_ACTION -ceq 'GLOBAL_TO_BOUND_PAGE_QA_TRANSFER' -and
                    $g2pSource.Snapshot.STATE -ceq 'ACTIVE' -and -not $g2pSource.ExecutableAuthority) })
                $missingAuthorityDenied=$false
                try { $null=Get-LiveSelectionDecision $g2pBinding $g2pSource.Snapshot ('0' * 64) } catch { $missingAuthorityDenied=$true }
                $checks.Add([pscustomobject]@{ Case='bound-page-missing-typed-authority-denied'; Passed=$missingAuthorityDenied })
                $competingLockDenied=$false
                try {
                    $competing=[System.IO.FileStream]::new($g2pLockPath,[System.IO.FileMode]::OpenOrCreate,[System.IO.FileAccess]::ReadWrite,[System.IO.FileShare]::None)
                    $competing.Dispose()
                } catch { $competingLockDenied=$true }
                $checks.Add([pscustomobject]@{ Case='bound-page-competing-lock-denied'; Passed=$competingLockDenied })
                foreach ($bad in @(
                    [pscustomobject]@{ Case='bound-page-wrong-owner-denied'; Field='OWNING_PAGE_CHAT_ID'; Value='OTHER-PAGE' },
                    [pscustomobject]@{ Case='bound-page-wrong-title-denied'; Field='CONVERSATION_TITLE'; Value='Similar Page' },
                    [pscustomobject]@{ Case='bound-page-wrong-project-denied'; Field='PROJECT_ID'; Value='OTHER-PROJECT' }
                )) {
                    $invalid=Copy-JsonRecord $g2pVerified.Decision
                    $invalid.DECISION_PAYLOAD.TARGET_TOWER[$bad.Field]=$bad.Value
                    $denied=$false
                    try { Assert-LiveSelectionPayload $invalid $g2pSource.Snapshot } catch { $denied=$true }
                    $checks.Add([pscustomobject]@{ Case=$bad.Case; Passed=$denied })
                }
                foreach ($bad in @(
                    [pscustomobject]@{ Case='bound-page-stale-source-hash-denied'; Field='EXPECTED_SOURCE_RECORD_HASH'; Value=('0' * 64) },
                    [pscustomobject]@{ Case='bound-page-stale-epoch-denied'; Field='EXPECTED_SOURCE_EPOCH'; Value=2 },
                    [pscustomobject]@{ Case='bound-page-reused-run-denied'; Field='TARGET_RUN_ID'; Value='SYNTH-ROTATED-RUN' }
                )) {
                    $invalid=Copy-JsonRecord $g2pVerified.Decision
                    $invalid.DECISION_PAYLOAD[$bad.Field]=$bad.Value
                    $denied=$false
                    try { Assert-LiveSelectionPayload $invalid $g2pSource.Snapshot } catch { $denied=$true }
                    $checks.Add([pscustomobject]@{ Case=$bad.Case; Passed=$denied })
                }
                $g2pConsumed=Commit-LocalRevision $g2pBinding (New-AuthorityPostState $g2pSource.Snapshot $g2pVerified) 'AUTHORITY_CONSUMED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("DECISION_ID:$($g2pChain.DecisionId)")
                $g2pFence=Copy-JsonRecord $g2pConsumed.Snapshot
                $g2pFence['STATE']='FENCING'; $g2pFence['ACTIVATION_EPOCH']=4; $g2pFence['ACTIVE_RUN_ID']=$null
                foreach ($run in $g2pFence.RUN_BINDING) { if ($run.RUN_ID -ceq 'SYNTH-ROTATED-RUN') { $run['STATE']='REVOKED' } }
                $g2pFenced=Commit-LocalRevision $g2pBinding $g2pFence 'FENCE_COMMIT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("LIVE_SELECTION_DECISION_ID:$($g2pChain.DecisionId)")
                $g2pAfterFence=Read-ReconciledContext $g2pBinding
                $checks.Add([pscustomobject]@{ Case='bound-page-after-fence-zero-authority'; Passed=(
                    $g2pAfterFence.Snapshot.STATE -ceq 'FENCING' -and -not $g2pAfterFence.ExecutableAuthority -and
                    $null -eq $g2pAfterFence.Snapshot.ACTIVE_RUN_ID) })
                $g2pTerminal=Copy-JsonRecord $g2pFenced.Snapshot
                $g2pTerminal['STATE']='TERMINAL'
                $g2pStopped=Commit-LocalRevision $g2pBinding $g2pTerminal 'TERMINAL_COMMIT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE'
                $g2pTransfer=New-LiveHandoff $g2pBinding $g2pStopped.Snapshot $g2pVerified.Decision 'SYNTH-ROTATED-RUN'
                $checks.Add([pscustomobject]@{ Case='bound-page-global-fence-before-handoff'; Passed=(
                    $g2pConsumed.Snapshot.STATE -ceq 'ACTIVE' -and $g2pFenced.Snapshot.STATE -ceq 'FENCING' -and
                    $g2pStopped.Snapshot.STATE -ceq 'TERMINAL' -and $g2pTransfer.Snapshot.STATE -ceq 'TERMINAL' -and
                    $null -eq $g2pTransfer.Snapshot.ACTIVE_RUN_ID -and
                    $g2pTransfer.Handoff.PRODUCT_PROVENANCE.PAGE_CONTEXT_INTAKE -ceq 'UNKNOWN' -and
                    $g2pTransfer.Handoff.PRODUCT_PROVENANCE.OWNING_PAGE_CHAT_ID -ceq '6a760691-3674-83eb-9347-9e4ef8c60acf') })
                $g2pReplayDenied=$false
                try { $null=New-AuthorityPostState $g2pTransfer.Snapshot $g2pVerified } catch { $g2pReplayDenied=$true }
                $checks.Add([pscustomobject]@{ Case='bound-page-consumed-selection-replay-denied'; Passed=$g2pReplayDenied })
                $g2pSecondHandoffDenied=$false
                try { $null=New-LiveHandoff $g2pBinding $g2pStopped.Snapshot $g2pVerified.Decision 'SYNTH-ROTATED-RUN' } catch { $g2pSecondHandoffDenied=$true }
                $checks.Add([pscustomobject]@{ Case='bound-page-handoff-replay-denied'; Passed=$g2pSecondHandoffDenied })
                $g2pBegin=Copy-JsonRecord $g2pTransfer.Snapshot
                $g2pBegin['STATE']='ACTIVATING'; $g2pBegin['ACTIVATION_EPOCH']=5
                foreach ($field in @('TOWER_ID','CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID','CONTROL_TOWER_INSTANCE','PROJECT_ID','CONVERSATION_ID','CONVERSATION_TITLE','CONVERSATION_URL')) {
                    $g2pBegin[$field]=$boundPage[$field]
                }
                $g2pBegin['ACTIVE_RUN_ID']='SYNTH-BOUND-PAGE-RUN'
                $g2pActivating=Commit-LocalRevision $g2pBinding $g2pBegin 'ACTIVATION_INTENT' 'SYNTH-BOUND-PAGE-RUN' $null 'NOT_APPLICABLE' @("LIVE_SELECTION_DECISION_ID:$($g2pChain.DecisionId)")
                $g2pBeforeProbe=Read-ReconciledContext $g2pBinding
                $checks.Add([pscustomobject]@{ Case='bound-page-activating-before-probe-zero-authority'; Passed=(
                    $g2pBeforeProbe.Snapshot.STATE -ceq 'ACTIVATING' -and -not $g2pBeforeProbe.ExecutableAuthority) })
                $g2pProbe=Copy-JsonRecord $g2pActivating.Snapshot
                $g2pProbe['LAST_ACCEPTED_COMMAND_ID']='SYNTH-BOUND-PAGE-RUN:1'
                $g2pProbe['LAST_RESULT_IDENTITY']=$null
                $g2pProbe['EXECUTION_STATE']='ACCEPTED'; $g2pProbe['DELIVERY_STATE']='SENDING'
                $g2pIntent=Commit-LocalRevision $g2pBinding $g2pProbe 'PROBE_INTENT' 'SYNTH-BOUND-PAGE-RUN' 1 'SYNTH-BOUND-PAGE-RUN:1' @("LIVE_SELECTION_DECISION_ID:$($g2pChain.DecisionId)")
                $g2pCrashedProbe=Read-ReconciledContext $g2pBinding
                $checks.Add([pscustomobject]@{ Case='bound-page-interrupted-probe-no-replay'; Passed=(
                    $g2pCrashedProbe.Status -cin @('PROBE_UNCERTAIN','EXECUTION_UNCERTAIN') -and
                    -not $g2pCrashedProbe.ExecutableAuthority) })
                $g2pOutcome=Copy-JsonRecord $g2pIntent.Snapshot
                $g2pOutcome['EXECUTION_STATE']='COMPLETED'; $g2pOutcome['DELIVERY_STATE']='RESPONSE_COMPLETE'
                $g2pOutcome['LAST_RESULT_IDENTITY']=[ordered]@{
                    RUN_ID='SYNTH-BOUND-PAGE-RUN'; ROUND_ID=1; COMMAND_ID='SYNTH-BOUND-PAGE-RUN:1'
                    CAUSAL_LINEAGE_ID=$lineage; STAGE='FEDERATION_READ_ONLY_PROBE'; RESULT_HASH=('e' * 64)
                }
                $g2pResult=Commit-LocalRevision $g2pBinding $g2pOutcome 'PROBE_OUTCOME' 'SYNTH-BOUND-PAGE-RUN' 1 'SYNTH-BOUND-PAGE-RUN:1' @("LIVE_SELECTION_DECISION_ID:$($g2pChain.DecisionId)","CONTROL_TOWER_EVALUATION_INPUT:$observedHash")
                $g2pActive=Copy-JsonRecord $g2pResult.Snapshot
                $g2pActive['STATE']='ACTIVE'
                foreach ($run in $g2pActive.RUN_BINDING) { if ($run.RUN_ID -ceq 'SYNTH-BOUND-PAGE-RUN') { $run['STATE']='ACTIVE' } }
                $g2pActive['CURRENT_HANDOFF_ID']=$g2pTransfer.HandoffId
                $g2pActive['CONSUMED_HANDOFF_IDS']=@($g2pActive.CONSUMED_HANDOFF_IDS)+@($g2pTransfer.HandoffId)
                $g2pFinal=Commit-LocalRevision $g2pBinding $g2pActive 'ACTIVE_COMMIT' 'SYNTH-BOUND-PAGE-RUN' 1 'SYNTH-BOUND-PAGE-RUN:1' @("CONTROL_TOWER_EVALUATION_INPUT:$observedHash")
                $checks.Add([pscustomobject]@{ Case='bound-page-complete-private-synthetic-transfer'; Passed=(
                    $g2pFinal.Snapshot.CONTROL_TOWER_ROLE -ceq 'PAGE_CONTROL_TOWER' -and
                    $g2pFinal.Snapshot.ACTIVE_RUN_ID -ceq 'SYNTH-BOUND-PAGE-RUN' -and
                    @($g2pFinal.Snapshot.RUN_BINDING | Where-Object { $_.STATE -ceq 'ACTIVE' }).Count -eq 1 -and
                    $g2pFinal.Snapshot.CAUSAL_LINEAGE_ID -ceq $lineage -and
                    $g2pFinal.Snapshot.CURRENT_HANDOFF_ID -ceq $g2pTransfer.HandoffId -and
                    -not $g2pFinal.ExecutableAuthority) })
                $oldGlobalCommandDenied=$false
                try { Assert-FreshFixtureCommand $g2pBinding $g2pFinal.Snapshot 'SYNTH-ROTATED-RUN' 2 'SYNTH-ROTATED-RUN:2' } catch { $oldGlobalCommandDenied=$true }
                $checks.Add([pscustomobject]@{ Case='bound-page-old-global-command-denied'; Passed=$oldGlobalCommandDenied })
                $consumedHandoffDenied=$false
                try { Assert-HandoffSourceAndStatus $g2pBinding $g2pTransfer.Handoff $g2pFinal.Snapshot } catch { $consumedHandoffDenied=$true }
                $checks.Add([pscustomobject]@{ Case='bound-page-consumed-handoff-denied'; Passed=$consumedHandoffDenied })
            } finally { $g2pLock.Dispose() }
            $uncertainState=Copy-JsonRecord $rotationFinal.Snapshot
            $uncertainState['DELIVERY_STATE']='DELIVERY_UNCERTAIN'
            $uncertainState['EXECUTION_STATE']='EXECUTION_UNCERTAIN'
            $uncertainCommit=Commit-LocalRevision $selectionBinding $uncertainState 'RESULT_DELIVERY' 'SYNTH-ROTATED-RUN' 1 'SYNTH-ROTATED-RUN:1' @('NO_RESEND','SYNTHETIC_DELIVERY_UNCERTAIN')
            $newSelectionBlocked=$false
            try {
                $stalePayload=Copy-JsonRecord $rotationPayload
                $stalePayload['EXPECTED_SOURCE_RECORD_HASH']=$uncertainCommit.Snapshot.RECORD_HASH
                $stalePayload['EXPECTED_SOURCE_EPOCH']=3
                $stalePayload['TARGET_ACTIVATION_EPOCH']=5
                Assert-LiveSelectionPayload ([ordered]@{ DECISION_TYPE='LIVE_TOWER_SELECTION'; DECISION_SCOPE=$selectionScope; DECISION_PAYLOAD=$stalePayload }) $uncertainCommit.Snapshot
            } catch { $newSelectionBlocked=$true }
            $checks.Add([pscustomobject]@{ Case='live-uncertain-delivery-durably-blocks-next-selection'; Passed=(
                $uncertainCommit.Status -ceq 'EXECUTION_UNCERTAIN' -and $newSelectionBlocked) })
        } finally { $selectionLock.Dispose() }
        $reacquired=[System.IO.FileStream]::new($selectionLockPath,[System.IO.FileMode]::OpenOrCreate,[System.IO.FileAccess]::ReadWrite,[System.IO.FileShare]::None)
        $reacquired.Dispose()
        $checks.Add([pscustomobject]@{ Case='live-selection-lock-released-after-durable-outcome'; Passed=$true })
        $classificationScope=[ordered]@{ BUDGET_TYPE='NONE'; BUCKET_KEY='SYNTH_BUCKET'; CAUSAL_LINEAGE_ID=$lineage; EXECUTION_CONTEXT_ID=$context }
        $classificationPayload=[ordered]@{
            CLASSIFICATION='DISTINCT_MATERIAL_BUCKET'; BUCKET_KEY='SYNTH_BUCKET'; STAGE_KEY='SYNTH_STAGE'; PURPOSE_KEY='SYNTH_PURPOSE'
            RELATED_BUCKET_KEY='NONE'; EVALUATED_CLAIM_REFERENCE='SYNTH_CLAIM'; EVALUATOR_PROCESS_REFERENCE='SYNTH_EVALUATOR'; RATIONALE_REFERENCE='SYNTH_RATIONALE'
        }
        $classification=New-SyntheticAuthorityChain $tempRoot $context $lineage 'EVALUATOR_BUCKET_CLASSIFICATION' $classificationScope $classificationPayload 1
        $verified=Get-AuthorityDecision $tempRoot $classification.DecisionId $context $lineage
        $checks.Add([pscustomobject]@{ Case='exact-classification-chain'; Passed=($verified.ProofEntry.CONSUMED_AUTHORITY_PROOF.DECISION_ID -ceq $classification.DecisionId) })
        $withBucket=New-AuthorityPostState $state $verified
        $checks.Add([pscustomobject]@{ Case='distinct-bucket-zero-state'; Passed=(@($withBucket.EVALUATOR_BUDGET.BUCKETS).Count -eq 1 -and $withBucket.EVALUATOR_BUDGET.BUCKETS[0].EXECUTION_GENERATIONS_USED -eq 0) })
        $checks.Add([pscustomobject]@{ Case='valid-proof-and-bucket-projection'; Passed=(Test-Record (Set-InMemoryHash $withBucket 'RECORD_HASH') Activation $context $tempRoot $HostLabel).Valid })
        $replayBlocked=$false
        try { $null=New-AuthorityPostState $withBucket $verified } catch { $replayBlocked=$true }
        $checks.Add([pscustomobject]@{ Case='authority-replay-denied'; Passed=$replayBlocked })
        $wrongTokenPath=[System.IO.Path]::Combine($tempRoot,$classification.ResultPath)
        $original=[System.IO.File]::ReadAllBytes($wrongTokenPath)
        try {
            $tampered=ConvertFrom-Json -InputObject ([System.Text.Encoding]::UTF8.GetString($original)) -AsHashtable -Depth 40 -DateKind String
            $tampered.RESULT_CORE['CURRENT_USER_DECISION']='APPROVE_UNRELATED_CHANGE'
            [System.IO.File]::WriteAllText($wrongTokenPath,(Get-CanonicalRecordText $tampered),[System.Text.UTF8Encoding]::new($false))
            $denied=$false
            try { $null=Get-AuthorityDecision $tempRoot $classification.DecisionId $context $lineage } catch { $denied=$true }
            $checks.Add([pscustomobject]@{ Case='wrong-human-token-denied'; Passed=$denied })
        } finally { [System.IO.File]::WriteAllBytes($wrongTokenPath,$original) }
        $wrongTokenPayload=[ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY='NONE'; PREVIOUS_APPROVED_MAXIMUM=2; NEW_APPROVED_MAXIMUM=4; ADDED_ALLOWANCE=2; PURPOSE='WRONG_TOKEN_TEST'; STOP_CONDITION='SYNTH_STOP' }
        $wrongTokenChain=New-SyntheticAuthorityChain $tempRoot $context $lineage 'BUDGET_MAXIMUM_EXCEPTION' ([ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY='NONE'; CAUSAL_LINEAGE_ID=$lineage; EXECUTION_CONTEXT_ID=$context }) $wrongTokenPayload 15 'APPROVE_UNRELATED_CHANGE'
        $wrongTokenConsistentDenied=$false
        try { $null=Get-AuthorityDecision $tempRoot $wrongTokenChain.DecisionId $context $lineage } catch { $wrongTokenConsistentDenied=$true }
        $checks.Add([pscustomobject]@{ Case='hash-consistent-unrelated-human-token-denied'; Passed=$wrongTokenConsistentDenied })
        $blockedStatusPayload=[ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY='NONE'; PREVIOUS_APPROVED_MAXIMUM=2; NEW_APPROVED_MAXIMUM=4; ADDED_ALLOWANCE=2; PURPOSE='BLOCKED_STATUS_TEST'; STOP_CONDITION='SYNTH_STOP' }
        $blockedStatusChain=New-SyntheticAuthorityChain $tempRoot $context $lineage 'BUDGET_MAXIMUM_EXCEPTION' ([ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY='NONE'; CAUSAL_LINEAGE_ID=$lineage; EXECUTION_CONTEXT_ID=$context }) $blockedStatusPayload 17 '' 'BLOCKED'
        $blockedStatusDenied=$false
        try { $null=Get-AuthorityDecision $tempRoot $blockedStatusChain.DecisionId $context $lineage } catch { $blockedStatusDenied=$true }
        $checks.Add([pscustomobject]@{ Case='hash-consistent-blocked-gate-result-denied'; Passed=$blockedStatusDenied })
        foreach ($tamper in @(
            [pscustomobject]@{ Case='missing-accepted-result-denied'; Path=$classification.ResultPath; Kind='MISSING' },
            [pscustomobject]@{ Case='changed-result-core-denied'; Path=$classification.ResultPath; Kind='CORE' },
            [pscustomobject]@{ Case='noncanonical-result-json-denied'; Path=$classification.ResultPath; Kind='WHITESPACE' },
            [pscustomobject]@{ Case='stale-approval-record-denied'; Path=$classification.ApprovalPath; Kind='APPROVAL' },
            [pscustomobject]@{ Case='unknown-descriptor-field-denied'; Path=$classification.DescriptorPath; Kind='DESCRIPTOR' },
            [pscustomobject]@{ Case='changed-semantic-record-denied'; Path="docs/reviews/federated-control-towers-foundation/decisions/$($classification.DecisionId).json"; Kind='SEMANTIC' }
        )) {
            $testPath=[System.IO.Path]::Combine($tempRoot,$tamper.Path)
            $saved=[System.IO.File]::ReadAllBytes($testPath)
            try {
                if ($tamper.Kind -ceq 'MISSING') {
                    [System.IO.File]::Delete($testPath)
                } elseif ($tamper.Kind -ceq 'WHITESPACE') {
                    [System.IO.File]::WriteAllText($testPath,([System.Text.Encoding]::UTF8.GetString($saved)+' '),[System.Text.UTF8Encoding]::new($false))
                } else {
                    $changed=ConvertFrom-Json -InputObject ([System.Text.Encoding]::UTF8.GetString($saved)) -AsHashtable -Depth 40 -DateKind String
                    switch ($tamper.Kind) {
                        'CORE' { $changed.RESULT_CORE['ROUND_ID']=99 }
                        'APPROVAL' { $changed['APPROVAL_STATUS']='REJECTED' }
                        'DESCRIPTOR' { $changed['SESSION_TOKEN']='FORBIDDEN' }
                        'SEMANTIC' { $changed['STATUS']='REJECTED' }
                    }
                    [System.IO.File]::WriteAllText($testPath,(Get-CanonicalRecordText $changed),[System.Text.UTF8Encoding]::new($false))
                }
                $tamperDenied=$false
                try { $null=Get-AuthorityDecision $tempRoot $classification.DecisionId $context $lineage } catch { $tamperDenied=$true }
                $checks.Add([pscustomobject]@{ Case=$tamper.Case; Passed=$tamperDenied })
            } finally { [System.IO.File]::WriteAllBytes($testPath,$saved) }
        }
        $exceptionScope=[ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY='NONE'; CAUSAL_LINEAGE_ID=$lineage; EXECUTION_CONTEXT_ID=$context }
        $exceptionPayload=[ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY='NONE'; PREVIOUS_APPROVED_MAXIMUM=2; NEW_APPROVED_MAXIMUM=3; ADDED_ALLOWANCE=1; PURPOSE='SYNTH_LIMIT'; STOP_CONDITION='SYNTH_STOP' }
        $exception=New-SyntheticAuthorityChain $tempRoot $context $lineage 'BUDGET_MAXIMUM_EXCEPTION' $exceptionScope $exceptionPayload 3
        $verifiedException=Get-AuthorityDecision $tempRoot $exception.DecisionId $context $lineage
        $expanded=New-AuthorityPostState $withBucket $verifiedException
        $checks.Add([pscustomobject]@{ Case='strict-positive-maximum-preserves-used'; Passed=($expanded.RECOVERY_BUDGET.APPROVED_MAXIMUM -eq 3 -and $expanded.RECOVERY_BUDGET.ATTEMPTS_USED -eq 0) })
        $maximumRollback=Copy-JsonRecord $expanded
        $maximumRollback.RECOVERY_BUDGET['APPROVED_MAXIMUM']=2
        $maximumRollbackDenied=$false
        try { Assert-BudgetTransition $expanded $maximumRollback 'RESULT_DELIVERY' 'SYNTH_EVENT' 5 'NOT_APPLICABLE' @() } catch { $maximumRollbackDenied=$true }
        $checks.Add([pscustomobject]@{ Case='approved-maximum-rollback-denied'; Passed=$maximumRollbackDenied })
        $freezeScope=[ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY=$null; CAUSAL_LINEAGE_ID=$lineage; EXECUTION_CONTEXT_ID=$context }
        $applyPayload=[ordered]@{ EXPECTED_ACTIVE_FREEZE_ID=$null; PURPOSE='SYNTH_FREEZE'; STOP_CONDITION='SYNTH_STOP'; TRANSITION='APPLY' }
        $apply=New-SyntheticAuthorityChain $tempRoot $context $lineage 'BUDGET_EXECUTION_FREEZE_TRANSITION' $freezeScope $applyPayload 5
        $frozen=New-AuthorityPostState $expanded (Get-AuthorityDecision $tempRoot $apply.DecisionId $context $lineage)
        $checks.Add([pscustomobject]@{ Case='apply-freeze-exact-current-projection'; Passed=(@($frozen.CURRENT_ACTIVE_FREEZES).Count -eq 1 -and $frozen.CURRENT_ACTIVE_FREEZES[0].FREEZE_ID -ceq $apply.DecisionId) })
        $frozenRecoveryDenied=$false
        try { Assert-BudgetExecutionAllowed $frozen 'RECOVERY_BUDGET' '' } catch { $frozenRecoveryDenied=$true }
        $checks.Add([pscustomobject]@{ Case='active-recovery-freeze-denies-execution'; Passed=$frozenRecoveryDenied })
        $evalScope=[ordered]@{ BUDGET_TYPE='EVALUATOR_BUDGET'; BUCKET_KEY='SYNTH_BUCKET'; CAUSAL_LINEAGE_ID=$lineage; EXECUTION_CONTEXT_ID=$context }
        $evalFreezePayload=[ordered]@{ EXPECTED_ACTIVE_FREEZE_ID=$null; PURPOSE='SYNTH_EVAL_FREEZE'; STOP_CONDITION='SYNTH_STOP'; TRANSITION='APPLY' }
        $evalFreeze=New-SyntheticAuthorityChain $tempRoot $context $lineage 'BUDGET_EXECUTION_FREEZE_TRANSITION' $evalScope $evalFreezePayload 19
        $evalFrozen=New-AuthorityPostState $withBucket (Get-AuthorityDecision $tempRoot $evalFreeze.DecisionId $context $lineage)
        $evalFrozenDenied=$false
        try { Assert-BudgetExecutionAllowed $evalFrozen 'EVALUATOR_BUDGET' 'SYNTH_BUCKET' } catch { $evalFrozenDenied=$true }
        $checks.Add([pscustomobject]@{ Case='active-evaluator-freeze-denies-execution'; Passed=$evalFrozenDenied })
        $otherBudgetAllowed=$true
        try { Assert-BudgetExecutionAllowed $evalFrozen 'RECOVERY_BUDGET' '' } catch { $otherBudgetAllowed=$false }
        $checks.Add([pscustomobject]@{ Case='evaluator-freeze-does-not-freeze-recovery'; Passed=$otherBudgetAllowed })
        $liftPayload=[ordered]@{ EXPECTED_ACTIVE_FREEZE_ID=$apply.DecisionId; PURPOSE='SYNTH_LIFT'; STOP_CONDITION='SYNTH_STOP'; TRANSITION='LIFT' }
        $lift=New-SyntheticAuthorityChain $tempRoot $context $lineage 'BUDGET_EXECUTION_FREEZE_TRANSITION' $freezeScope $liftPayload 7
        $lifted=New-AuthorityPostState $frozen (Get-AuthorityDecision $tempRoot $lift.DecisionId $context $lineage)
        $checks.Add([pscustomobject]@{ Case='lift-preserves-maximum-and-history'; Passed=(@($lifted.CURRENT_ACTIVE_FREEZES).Count -eq 0 -and @($lifted.CONSUMED_AUTHORITY_PROOFS).Count -eq 4 -and $lifted.RECOVERY_BUDGET.APPROVED_MAXIMUM -eq 3) })
        $liftAllows=$true
        try { Assert-BudgetExecutionAllowed $lifted 'RECOVERY_BUDGET' '' } catch { $liftAllows=$false }
        $checks.Add([pscustomobject]@{ Case='lift-restores-only-existing-capacity'; Passed=$liftAllows })
        $superPayload=[ordered]@{ EXPECTED_ACTIVE_FREEZE_ID=$apply.DecisionId; PURPOSE='SYNTH_SUPERSEDE'; STOP_CONDITION='SYNTH_STOP'; TRANSITION='SUPERSEDE' }
        $supersede=New-SyntheticAuthorityChain $tempRoot $context $lineage 'BUDGET_EXECUTION_FREEZE_TRANSITION' $freezeScope $superPayload 11
        $superseded=New-AuthorityPostState $frozen (Get-AuthorityDecision $tempRoot $supersede.DecisionId $context $lineage)
        $checks.Add([pscustomobject]@{ Case='supersede-replaces-only-current-freeze'; Passed=(@($superseded.CURRENT_ACTIVE_FREEZES).Count -eq 1 -and $superseded.CURRENT_ACTIVE_FREEZES[0].FREEZE_ID -ceq $supersede.DecisionId) })
        $supersedeAbsentDenied=$false
        try { $null=New-AuthorityPostState $lifted (Get-AuthorityDecision $tempRoot $supersede.DecisionId $context $lineage) } catch { $supersedeAbsentDenied=$true }
        $checks.Add([pscustomobject]@{ Case='supersede-without-active-target-denied'; Passed=$supersedeAbsentDenied })
        $staleTarget=$false
        try { $null=New-AuthorityPostState $superseded (Get-AuthorityDecision $tempRoot $lift.DecisionId $context $lineage) } catch { $staleTarget=$true }
        $checks.Add([pscustomobject]@{ Case='lift-of-superseded-freeze-denied'; Passed=$staleTarget })
        $duplicateApply=$false
        try { $null=New-AuthorityPostState $frozen (Get-AuthorityDecision $tempRoot $apply.DecisionId $context $lineage) } catch { $duplicateApply=$true }
        $checks.Add([pscustomobject]@{ Case='apply-to-active-freeze-denied'; Passed=$duplicateApply })
        $samePayload=[ordered]@{
            CLASSIFICATION='SAME_MATERIAL_BUCKET'; BUCKET_KEY='SYNTH_BUCKET'; STAGE_KEY='SYNTH_STAGE'; PURPOSE_KEY='SYNTH_PURPOSE'
            RELATED_BUCKET_KEY='SYNTH_BUCKET'; EVALUATED_CLAIM_REFERENCE='SYNTH_CLAIM'; EVALUATOR_PROCESS_REFERENCE='SYNTH_EVALUATOR'; RATIONALE_REFERENCE='SYNTH_SAME'
        }
        $same=New-SyntheticAuthorityChain $tempRoot $context $lineage 'EVALUATOR_BUCKET_CLASSIFICATION' $classificationScope $samePayload 13
        $reused=New-AuthorityPostState $withBucket (Get-AuthorityDecision $tempRoot $same.DecisionId $context $lineage)
        $checks.Add([pscustomobject]@{ Case='same-classification-reuses-existing-bucket'; Passed=(@($reused.EVALUATOR_BUDGET.BUCKETS).Count -eq 1 -and @($reused.CONSUMED_AUTHORITY_PROOFS).Count -eq 2) })
        $missingProof=Copy-JsonRecord $withBucket
        $missingProof['CONSUMED_AUTHORITY_PROOFS']=@()
        $missingProofDenied=$false
        try { Assert-AuthorityTransition $state $missingProof 'AUTHORITY_CONSUMED' } catch { $missingProofDenied=$true }
        $checks.Add([pscustomobject]@{ Case='authority-effect-without-proof-denied'; Passed=$missingProofDenied })
        $multipleProof=Copy-JsonRecord $withBucket
        $multipleProof['CONSUMED_AUTHORITY_PROOFS']=@($multipleProof.CONSUMED_AUTHORITY_PROOFS)+@($verifiedException.ProofEntry)
        $multipleProofDenied=$false
        try { Assert-AuthorityTransition $state $multipleProof 'AUTHORITY_CONSUMED' } catch { $multipleProofDenied=$true }
        $checks.Add([pscustomobject]@{ Case='multiple-proofs-in-one-authority-event-denied'; Passed=$multipleProofDenied })
        $misordered=Copy-JsonRecord $expanded
        [array]::Reverse($misordered.CONSUMED_AUTHORITY_PROOFS)
        $misorderedValidation=Test-Record (Set-InMemoryHash $misordered 'RECORD_HASH') Activation $context $tempRoot $HostLabel
        $checks.Add([pscustomobject]@{ Case='misordered-proof-projection-denied'; Passed=(-not $misorderedValidation.Valid) })
        $unrelatedMutation=Copy-JsonRecord $withBucket
        $unrelatedMutation['AUTHORIZATION_REFERENCE']=[ordered]@{ DECISION_SOURCE='SYNTHETIC'; DECISION='FORGED'; SCOPE='SYNTHETIC'; ARTIFACT_PATH='NONE'; ARTIFACT_SHA256=('0'*64); DECIDED_AT_UTC='2026-09-26T00:00:00Z' }
        $unrelatedDenied=$false
        try { Assert-AuthorityTransition $state $unrelatedMutation 'AUTHORITY_CONSUMED' } catch { $unrelatedDenied=$true }
        $checks.Add([pscustomobject]@{ Case='consumption-cannot-grant-unrelated-authorization'; Passed=$unrelatedDenied })
        $syntheticHandoff=New-HandoffFixture $context
        $syntheticHandoff['CAUSAL_LINEAGE_ID']=$lineage
        $syntheticHandoff['RECOVERY_BUDGET']=$expanded.RECOVERY_BUDGET
        $syntheticHandoff['EVALUATOR_BUDGET']=$expanded.EVALUATOR_BUDGET
        $syntheticHandoff['CURRENT_ACTIVE_FREEZES']=$frozen.CURRENT_ACTIVE_FREEZES
        $syntheticHandoff['CONSUMED_AUTHORITY_PROOFS']=$frozen.CONSUMED_AUTHORITY_PROOFS
        $handoffValid=Test-Record (Set-InMemoryHash $syntheticHandoff 'HANDOFF_HASH') Handoff $context $tempRoot $HostLabel
        $checks.Add([pscustomobject]@{ Case='handoff-carries-freezes-and-proofs'; Passed=$handoffValid.Valid })
        $carryValid=$true
        try { Assert-ExactAuthorityCarry $frozen $syntheticHandoff } catch { $carryValid=$false }
        $checks.Add([pscustomobject]@{ Case='exact-source-handoff-authority-carry'; Passed=$carryValid })
        $falseEmpty=Copy-JsonRecord $syntheticHandoff
        $falseEmpty['CONSUMED_AUTHORITY_PROOFS']=@()
        $falseEmptyDenied=$false
        try { Assert-ExactAuthorityCarry $frozen $falseEmpty } catch { $falseEmptyDenied=$true }
        $checks.Add([pscustomobject]@{ Case='handoff-false-empty-proof-denied'; Passed=$falseEmptyDenied })
        $falseEmptyFreeze=Copy-JsonRecord $syntheticHandoff
        $falseEmptyFreeze['CURRENT_ACTIVE_FREEZES']=@()
        $falseEmptyFreezeDenied=$false
        try { Assert-ExactAuthorityCarry $frozen $falseEmptyFreeze } catch { $falseEmptyFreezeDenied=$true }
        $checks.Add([pscustomobject]@{ Case='handoff-false-empty-freeze-denied'; Passed=$falseEmptyFreezeDenied })
        $freshRun=Copy-JsonRecord $frozen
        $freshRun['ACTIVE_RUN_ID']='SYNTH-NEW-RUN'
        $freshRunPreserves=$true
        try { Assert-AuthorityTransition $frozen $freshRun 'RUN_RESERVED' } catch { $freshRunPreserves=$false }
        $checks.Add([pscustomobject]@{ Case='fresh-run-cannot-reset-consumed-authority'; Passed=$freshRunPreserves })
        $runReset=Copy-JsonRecord $freshRun
        $runReset['CONSUMED_AUTHORITY_PROOFS']=@()
        $runResetDenied=$false
        try { Assert-AuthorityTransition $frozen $runReset 'RUN_RESERVED' } catch { $runResetDenied=$true }
        $checks.Add([pscustomobject]@{ Case='fresh-run-proof-reset-denied'; Passed=$runResetDenied })
        $syntheticHandoff.Remove('CURRENT_ACTIVE_FREEZES')
        $handoffMissing=Test-Record (Set-InMemoryHash $syntheticHandoff 'HANDOFF_HASH') Handoff $context $tempRoot $HostLabel
        $checks.Add([pscustomobject]@{ Case='handoff-missing-freeze-projection-denied'; Passed=(-not $handoffMissing.Valid) })
        $staleLiftBlocked=$false
        try { $null=New-AuthorityPostState $lifted (Get-AuthorityDecision $tempRoot $lift.DecisionId $context $lineage) } catch { $staleLiftBlocked=$true }
        $checks.Add([pscustomobject]@{ Case='stale-freeze-lift-replay-denied'; Passed=$staleLiftBlocked })
        $invalidException=$false
        $badPayload=[ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY='NONE'; PREVIOUS_APPROVED_MAXIMUM=3; NEW_APPROVED_MAXIMUM=3; ADDED_ALLOWANCE=0; PURPOSE='SYNTH_LIMIT'; STOP_CONDITION='SYNTH_STOP' }
        $badException=New-SyntheticAuthorityChain $tempRoot $context $lineage 'BUDGET_MAXIMUM_EXCEPTION' $exceptionScope $badPayload 9
        try { $null=New-AuthorityPostState $lifted (Get-AuthorityDecision $tempRoot $badException.DecisionId $context $lineage) } catch { $invalidException=$true }
        $checks.Add([pscustomobject]@{ Case='nonpositive-exception-denied'; Passed=$invalidException })
        $wrongScope=Copy-JsonRecord $lifted
        $wrongScope.CURRENT_ACTIVE_FREEZES=@([ordered]@{ DECISION_SCOPE=([ordered]@{ BUDGET_TYPE='RECOVERY_BUDGET'; BUCKET_KEY='SYNTH_BUCKET'; CAUSAL_LINEAGE_ID=$lineage; EXECUTION_CONTEXT_ID=$context }); FREEZE_ID=$apply.DecisionId; RECORD_VERSION=1 })
        $wrongScopeValidation=Test-Record (Set-InMemoryHash $wrongScope 'RECORD_HASH') Activation $context $tempRoot $HostLabel
        $checks.Add([pscustomobject]@{ Case='wrong-freeze-bucket-denied'; Passed=(-not $wrongScopeValidation.Valid) })
        $duplicate=Copy-JsonRecord $frozen
        $duplicate.CURRENT_ACTIVE_FREEZES=@($duplicate.CURRENT_ACTIVE_FREEZES)+@($duplicate.CURRENT_ACTIVE_FREEZES[0])
        $duplicateValidation=Test-Record (Set-InMemoryHash $duplicate 'RECORD_HASH') Activation $context $tempRoot $HostLabel
        $checks.Add([pscustomobject]@{ Case='duplicate-freeze-scope-denied'; Passed=(-not $duplicateValidation.Valid) })
        $corruptProof=Copy-JsonRecord $expanded
        $corruptProof.CONSUMED_AUTHORITY_PROOFS[0]['CONSUMED_AUTHORITY_PROOF_SHA256']='0' * 64
        $corruptValidation=Test-Record (Set-InMemoryHash $corruptProof 'RECORD_HASH') Activation $context $tempRoot $HostLabel
        $checks.Add([pscustomobject]@{ Case='altered-consumption-proof-denied'; Passed=(-not $corruptValidation.Valid) })
        $runtime=[System.IO.Path]::Combine($tempRoot,'runtime',$context)
        [void][System.IO.Directory]::CreateDirectory($runtime)
        $lockPath=[System.IO.Path]::Combine($runtime,'lock')
        $lock=[System.IO.FileStream]::new($lockPath,[System.IO.FileMode]::OpenOrCreate,[System.IO.FileAccess]::ReadWrite,[System.IO.FileShare]::None)
        try {
            $binding=[pscustomobject]@{ LockStream=$lock; ReservedLockPath=$lockPath; ReservedStatePath=$runtime; ExecutionContextId=$context; CheckoutRoot=$tempRoot; HostLabel=$HostLabel; IsLive=$false }
            $genesis=New-ActivationFixture $context $tempRoot $HostLabel
            $genesisCommit=Commit-LocalRevision $binding $genesis 'ACTIVATION_INTENT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE'
            $checks.Add([pscustomobject]@{ Case='synthetic-journal-genesis'; Passed=($genesisCommit.Snapshot.REVISION -eq 0) })
            $activating=Copy-JsonRecord $genesisCommit.Snapshot
            $tower=[ordered]@{ CONTROL_TOWER_ROLE='GLOBAL_CONTROL_TOWER'; CONTROL_TOWER_SCOPE='FOUNDATION'; OWNING_PAGE_CHAT_ID='NONE' }
            $activating['STATE']='ACTIVATING'; $activating['ACTIVATION_EPOCH']=1
            $activating['TOWER_ID']=$tower; $activating['CONTROL_TOWER_ROLE']='GLOBAL_CONTROL_TOWER'
            $activating['CONTROL_TOWER_SCOPE']='FOUNDATION'; $activating['OWNING_PAGE_CHAT_ID']='NONE'
            $activating['CONTROL_TOWER_INSTANCE']='SYNTH-CONVERSATION'; $activating['PROJECT_ID']='SYNTH-PROJECT'
            $activating['CONVERSATION_ID']='SYNTH-CONVERSATION'; $activating['CONVERSATION_TITLE']='Synthetic authority test'
            $activating['CONVERSATION_URL']='https://chatgpt.com/g/SYNTH-PROJECT/c/SYNTH-CONVERSATION'
            $activating['ACTIVE_RUN_ID']='SYNTH-RUN'; $activating['CAUSAL_LINEAGE_ID']=$lineage
            $activating['RUN_BINDING']=@([ordered]@{ RUN_ID='SYNTH-RUN'; ACTIVATION_EPOCH=1; TOWER_ID=$tower; CONTROL_TOWER_INSTANCE='SYNTH-CONVERSATION'; PROJECT_ID='SYNTH-PROJECT'; CONVERSATION_ID='SYNTH-CONVERSATION'; STATE='RESERVED' })
            $activating.RECOVERY_BUDGET['CAUSAL_LINEAGE_ID']=$lineage
            $activating.RECOVERY_BUDGET['APPROVED_MAXIMUM']=2
            $activating.EVALUATOR_BUDGET['CAUSAL_LINEAGE_ID']=$lineage
            $activating['AUTHORIZATION_REFERENCE']=[ordered]@{ DECISION_SOURCE='SYNTHETIC'; DECISION='SYNTHETIC_ONLY'; SCOPE='SYNTHETIC'; ARTIFACT_PATH='NONE'; ARTIFACT_SHA256=('0'*64); DECIDED_AT_UTC='2026-09-26T00:00:00Z' }
            $activeCommit=Commit-LocalRevision $binding $activating 'ACTIVATION_INTENT' 'SYNTH-RUN' $null 'NOT_APPLICABLE'
            $checks.Add([pscustomobject]@{ Case='synthetic-lineage-journal-transition'; Passed=($activeCommit.Snapshot.CAUSAL_LINEAGE_ID -ceq $lineage) })
            $oldSnapshotBytes=[System.IO.File]::ReadAllBytes([System.IO.Path]::Combine($runtime,'activation.json'))
            $post=New-AuthorityPostState $activeCommit.Snapshot $verified
            $consumed=Commit-LocalRevision $binding $post 'AUTHORITY_CONSUMED' 'SYNTH-RUN' $null 'NOT_APPLICABLE' @("DECISION_ID:$($classification.DecisionId)")
            $checks.Add([pscustomobject]@{ Case='journal-first-consumption-commit'; Passed=(@($consumed.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count -eq 1) })
            [System.IO.File]::WriteAllBytes([System.IO.Path]::Combine($runtime,'activation.json'),$oldSnapshotBytes)
            $readOnlyRecoveryDenied=$false
            try { $null=Read-ReconciledContext $binding '' $true } catch { $readOnlyRecoveryDenied=$true }
            $stillOld=[System.IO.File]::ReadAllBytes([System.IO.Path]::Combine($runtime,'activation.json'))
            $checks.Add([pscustomobject]@{ Case='read-only-journal-ahead-repair-denied-without-byte-change'; Passed=(
                $readOnlyRecoveryDenied -and [Convert]::ToHexString($oldSnapshotBytes) -ceq [Convert]::ToHexString($stillOld)) })
            $recovered=Read-ReconciledContext $binding
            $checks.Add([pscustomobject]@{ Case='journal-ahead-crash-recovers-exact-post-state'; Passed=($recovered.Snapshot.RECORD_HASH -ceq $consumed.Snapshot.RECORD_HASH) })
            $replayed=$false
            try { $null=New-AuthorityPostState $recovered.Snapshot $verified } catch { $replayed=$true }
            $checks.Add([pscustomobject]@{ Case='recovery-does-not-reuse-consumed-authority'; Passed=$replayed })
            $active=Copy-JsonRecord $recovered.Snapshot
            $active['STATE']='ACTIVE'
            $active.RUN_BINDING[0]['STATE']='ACTIVE'
            $activeCommit=Commit-LocalRevision $binding $active 'ACTIVE_COMMIT' 'SYNTH-RUN' $null 'NOT_APPLICABLE'
            $checks.Add([pscustomobject]@{ Case='synthetic-temp-only-active-state'; Passed=($activeCommit.Snapshot.STATE -ceq 'ACTIVE' -and $activeCommit.ExecutableAuthority -eq $false) })
            $beforeRead=@(Get-ChildItem -LiteralPath $runtime -Recurse -File | Where-Object { $_.FullName -cne $lockPath } |
                ForEach-Object { "$($_.FullName)|$((Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash)" }) -join "`n"
            $readOnly=Read-ReconciledContext $binding '' $true
            $readOnlyProjection=Get-ReadOnlyLiveAuthorityProjection $readOnly
            $afterRead=@(Get-ChildItem -LiteralPath $runtime -Recurse -File | Where-Object { $_.FullName -cne $lockPath } |
                ForEach-Object { "$($_.FullName)|$((Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash)" }) -join "`n"
            $checks.Add([pscustomobject]@{ Case='read-only-locked-global-projection'; Passed=(
                $readOnlyProjection.OneActiveTowerInvariant -ceq 'PASS' -and $readOnlyProjection.ActiveRunId -ceq 'SYNTH-RUN') })
            $checks.Add([pscustomobject]@{ Case='read-only-reconciliation-preserves-all-state-bytes'; Passed=($beforeRead -ceq $afterRead) })
            $contentionDenied=$false
            try {
                $contender=[System.IO.FileStream]::new($lockPath,[System.IO.FileMode]::Open,[System.IO.FileAccess]::Read,[System.IO.FileShare]::None)
                $contender.Dispose()
            } catch [System.IO.IOException] { $contentionDenied=$true }
            $checks.Add([pscustomobject]@{ Case='read-only-lock-contention-denied'; Passed=$contentionDenied })
            $ambiguous=Copy-JsonRecord $readOnly.Snapshot
            $extra=Copy-JsonRecord $ambiguous.RUN_BINDING[0]
            $extra['RUN_ID']='SYNTH-SECOND-RUN'
            $ambiguous['RUN_BINDING']=@($ambiguous.RUN_BINDING)+@($extra)
            $multipleDenied=$false
            try { $null=Get-ReadOnlyLiveAuthorityProjection ([pscustomobject]@{ Status='RECONCILED_NON_EXECUTING'; Snapshot=$ambiguous; LastEvent=$readOnly.LastEvent }) } catch { $multipleDenied=$true }
            $checks.Add([pscustomobject]@{ Case='read-only-multiple-active-authorities-denied'; Passed=$multipleDenied })
            $corruptPath=[System.IO.Path]::Combine($runtime,'activation.json')
            $uncorrupted=[System.IO.File]::ReadAllBytes($corruptPath)
            try {
                [System.IO.File]::WriteAllText($corruptPath,'{',[System.Text.UTF8Encoding]::new($false))
                $corruptDenied=$false
                try { $null=Read-ReconciledContext $binding '' $true } catch { $corruptDenied=$true }
                $checks.Add([pscustomobject]@{ Case='read-only-corrupt-snapshot-denied'; Passed=$corruptDenied })
            } finally { [System.IO.File]::WriteAllBytes($corruptPath,$uncorrupted) }
            $rolling=$activeCommit
            foreach ($round in @(1,2)) {
                $command="SYNTH-RUN:$round"
                Assert-FreshFixtureCommand $binding $rolling.Snapshot 'SYNTH-RUN' $round $command
                $accepted=Copy-JsonRecord $rolling.Snapshot
                $accepted['LAST_ACCEPTED_COMMAND_ID']=$command
                $accepted['EXECUTION_STATE']='ACCEPTED'
                $accepted.EVALUATOR_BUDGET.BUCKETS[0]['PENDING_COMMAND_ID']=$command
                $acceptedCommit=Commit-LocalRevision $binding $accepted 'COMMAND_ACCEPTED' 'SYNTH-RUN' $round $command @('SYNTHETIC_NO_SIDE_EFFECT')
                $executing=Copy-JsonRecord $acceptedCommit.Snapshot
                $executing['EXECUTION_STATE']='EXECUTING'
                $executingCommit=Commit-LocalRevision $binding $executing 'COMMAND_EXECUTING' 'SYNTH-RUN' $round $command @('SYNTHETIC_NO_SIDE_EFFECT')
                $outcome=Copy-JsonRecord $executingCommit.Snapshot
                $outcome['EXECUTION_STATE']=if ($round -eq 1) { 'FAILED' } else { 'COMPLETED' }
                $digest=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes($command))).ToLowerInvariant()
                $rolling=Commit-LocalRevision $binding $outcome 'COMMAND_OUTCOME' 'SYNTH-RUN' $round $command @("SYNTHETIC_EVALUATOR_EXECUTED:$digest") $true
                $checks.Add([pscustomobject]@{ Case="actual-synthetic-execution-round-$round-consumes-once"; Passed=($rolling.Snapshot.EVALUATOR_BUDGET.BUCKETS[0].EXECUTION_GENERATIONS_USED -eq $round -and $rolling.Snapshot.EVALUATOR_BUDGET.BUCKETS[0].PENDING_COMMAND_ID -eq $null) })
                $sameCommandDenied=$false
                try { Assert-FreshFixtureCommand $binding $rolling.Snapshot 'SYNTH-RUN' $round $command } catch { $sameCommandDenied=$true }
                $checks.Add([pscustomobject]@{ Case="command-replay-round-$round-denied"; Passed=$sameCommandDenied })
            }
            $counterRollback=Copy-JsonRecord $rolling.Snapshot
            $counterRollback.EVALUATOR_BUDGET.BUCKETS[0]['EXECUTION_GENERATIONS_USED']=1
            $counterRollbackDenied=$false
            try { Assert-BudgetTransition $rolling.Snapshot $counterRollback 'RESULT_DELIVERY' 'SYNTH_EVENT' 99 'NOT_APPLICABLE' @() } catch { $counterRollbackDenied=$true }
            $checks.Add([pscustomobject]@{ Case='execution-generation-rollback-denied'; Passed=$counterRollbackDenied })
            $stopped=Copy-JsonRecord $rolling.Snapshot
            $stopped['EVIDENCE_STOP_STATE']='STOPPED'
            $evidenceStopDenied=$false
            try { Assert-FreshFixtureCommand $binding $stopped 'SYNTH-RUN' 3 'SYNTH-RUN:3' } catch { $evidenceStopDenied=$true }
            $checks.Add([pscustomobject]@{ Case='evidence-stop-prevents-fresh-command'; Passed=$evidenceStopDenied })
            $pendingCommand='SYNTH-RUN:3'
            Assert-FreshFixtureCommand $binding $rolling.Snapshot 'SYNTH-RUN' 3 $pendingCommand
            $pending=Copy-JsonRecord $rolling.Snapshot
            $pending['LAST_ACCEPTED_COMMAND_ID']=$pendingCommand
            $pending['EXECUTION_STATE']='ACCEPTED'
            $pending.EVALUATOR_BUDGET.BUCKETS[0]['PENDING_COMMAND_ID']=$pendingCommand
            $pendingCommit=Commit-LocalRevision $binding $pending 'COMMAND_ACCEPTED' 'SYNTH-RUN' 3 $pendingCommand @('SYNTHETIC_NO_SIDE_EFFECT')
            $uncertain=Read-ReconciledContext $binding
            $checks.Add([pscustomobject]@{ Case='accepted-without-outcome-remains-uncertain'; Passed=($uncertain.Status -ceq 'EXECUTION_UNCERTAIN' -and $uncertain.Snapshot.EVALUATOR_BUDGET.BUCKETS[0].EXECUTION_GENERATIONS_USED -eq 2) })
            $uncertainReplayDenied=$false
            try { Assert-FreshFixtureCommand $binding $uncertain.Snapshot 'SYNTH-RUN' 3 $pendingCommand } catch { $uncertainReplayDenied=$true }
            $checks.Add([pscustomobject]@{ Case='uncertain-accepted-command-never-reexecuted'; Passed=$uncertainReplayDenied })
            $orphanTemp=[System.IO.Path]::Combine($runtime,"activation.json.tmp-$([Guid]::NewGuid().ToString('N'))")
            Write-DurableNewFile $orphanTemp '{}'
            try {
                $orphanDenied=$false
                try { $null=Read-ReconciledContext $binding } catch { $orphanDenied=$true }
                $checks.Add([pscustomobject]@{ Case='orphan-preflush-snapshot-temp-fails-closed'; Passed=$orphanDenied })
            } finally { [System.IO.File]::Delete($orphanTemp) }
            $snapshotFinal=[System.IO.Path]::Combine($runtime,'activation.json')
            $validSnapshotBytes=[System.IO.File]::ReadAllBytes($snapshotFinal)
            try {
                [System.IO.File]::WriteAllBytes($snapshotFinal,$oldSnapshotBytes)
                $behindDenied=$false
                try { $null=Read-ReconciledContext $binding } catch { $behindDenied=$true }
                $checks.Add([pscustomobject]@{ Case='multi-revision-snapshot-behind-fails-closed'; Passed=$behindDenied })
            } finally { [System.IO.File]::WriteAllBytes($snapshotFinal,$validSnapshotBytes) }
            $journalFinal=[System.IO.Path]::Combine($runtime,'journal','2.json')
            $journalBytes=[System.IO.File]::ReadAllBytes($journalFinal)
            try {
                [System.IO.File]::WriteAllText($journalFinal,'{',[System.Text.UTF8Encoding]::new($false))
                $blocked=$false
                try { $null=Read-ReconciledContext $binding } catch { $blocked=$true }
                $checks.Add([pscustomobject]@{ Case='partial-consumption-journal-fails-closed'; Passed=$blocked })
            } finally { [System.IO.File]::WriteAllBytes($journalFinal,$journalBytes) }
        } finally { $lock.Dispose() }
        return @($checks.ToArray())
    } finally {
        if ($tempRoot.StartsWith($tempBase,[System.StringComparison]::OrdinalIgnoreCase) -and
            [System.IO.Path]::GetFileName($tempRoot) -cmatch '^YUTA-FED-AUTH-SELFTEST-[0-9a-f]{32}$') {
            [System.IO.Directory]::Delete($tempRoot,$true)
        }
    }
}

function Get-SyntheticTarget([string]$Role, [string]$Scope, [string]$Owner, [string]$Project, [string]$Conversation, [string]$Title) {
    if ($Project -cnotmatch '^QA-PROJECT-[A-Z0-9_-]{2,40}$' -or
        $Conversation -cnotmatch '^QA-CONVERSATION-[A-Z0-9_-]{2,40}$' -or
        $Title -cnotmatch '^QA-TARGET-[A-Z0-9_-]{2,40}$') {
        throw 'BLOCKED: exact synthetic Project, conversation and title required'
    }
    if ($Role -ceq 'PAGE_CONTROL_TOWER') {
        if ($Scope -cne 'PAGE_LOCAL' -or $Owner -cnotmatch '^QA-PAGE-[A-Z0-9_-]{2,40}$') {
            throw 'BLOCKED: synthetic Page target requires exact PAGE_LOCAL owner'
        }
    } elseif ($Role -ceq 'GLOBAL_CONTROL_TOWER') {
        if ($Scope -cnotin @('CROSS_MODULE','UNCERTAIN','CROSS_PAGE','SHARED','FOUNDATION') -or $Owner -cne 'NONE') {
            throw 'BLOCKED: synthetic Global target requires approved scope and owner NONE'
        }
    } else { throw 'BLOCKED: unsupported synthetic target role' }
    $towerId=[ordered]@{ CONTROL_TOWER_ROLE=$Role; CONTROL_TOWER_SCOPE=$Scope; OWNING_PAGE_CHAT_ID=$Owner }
    return [ordered]@{
        TOWER_ID=$towerId; CONTROL_TOWER_ROLE=$Role; CONTROL_TOWER_SCOPE=$Scope
        OWNING_PAGE_CHAT_ID=$Owner; PROJECT_ID=$Project; CONTROL_TOWER_INSTANCE=$Conversation
        CONVERSATION_ID=$Conversation; CONVERSATION_TITLE=$Title
    }
}

function Assert-ObservedFixtureTarget([System.Collections.IDictionary]$Snapshot, [string]$Project, [string]$Conversation, [string]$Title, [string]$Url) {
    $expectedUrl="https://chatgpt.com/g/$($Snapshot.PROJECT_ID)/c/$($Snapshot.CONVERSATION_ID)"
    if ($Snapshot.STATE -cne 'ACTIVATING' -or
        $Project -cne $Snapshot.PROJECT_ID -or $Conversation -cne $Snapshot.CONVERSATION_ID -or
        $Title -cne $Snapshot.CONVERSATION_TITLE -or $Url -cne $expectedUrl -or
        $Snapshot.CONVERSATION_URL -cne $expectedUrl -or
        $Snapshot.CONTROL_TOWER_INSTANCE -cne $Snapshot.CONVERSATION_ID) {
        throw 'BLOCKED: exact selected and observed Project/title/URL/conversation mismatch'
    }
}

function Get-VerifiedSyntheticProbeTrace([string]$Content, [System.Collections.IDictionary]$Snapshot) {
    if ([string]::IsNullOrWhiteSpace($Content)) { throw 'BLOCKED: complete synthetic probe trace required' }
    try { $document=[System.Text.Json.JsonDocument]::Parse($Content) }
    catch { throw 'BLOCKED: malformed synthetic probe trace' }
    try {
        $errors=[System.Collections.Generic.List[string]]::new()
        Test-RecursiveKeys $document.RootElement '$' $errors
        $fields=[ordered]@{
            PROTOCOL_VERSION='integer'; RUN_ID='string'; ROUND_ID='integer'; COMMAND_ID='string'
            CAUSAL_LINEAGE_ID='string'; PROJECT_ID='string'; CONVERSATION_ID='string'
            CONVERSATION_TITLE='string'; CONVERSATION_URL='string'; HANDSHAKE='string'
            COMMAND='string'; RESULT='string'; EVALUATION='string'; ACTION='string'
            REPOSITORY_MUTATION='string'
        }
        Test-ExactShape $document.RootElement $fields '$' $errors
        if ($errors.Count -gt 0) { throw 'BLOCKED: incomplete, duplicate or unknown synthetic probe field' }
        $trace=ConvertFrom-Json -InputObject $Content -AsHashtable -Depth 10 -DateKind String
        if ($trace.PROTOCOL_VERSION -ne 1 -or $trace.RUN_ID -cne $Snapshot.ACTIVE_RUN_ID -or
            $trace.ROUND_ID -ne 1 -or $trace.COMMAND_ID -cne "$($trace.RUN_ID):1" -or
            $trace.CAUSAL_LINEAGE_ID -cne $Snapshot.CAUSAL_LINEAGE_ID -or
            $trace.PROJECT_ID -cne $Snapshot.PROJECT_ID -or
            $trace.CONVERSATION_ID -cne $Snapshot.CONVERSATION_ID -or
            $trace.CONVERSATION_TITLE -cne $Snapshot.CONVERSATION_TITLE -or
            $trace.CONVERSATION_URL -cne $Snapshot.CONVERSATION_URL -or
            $trace.HANDSHAKE -cne 'VALID' -or $trace.COMMAND -cne 'VALID' -or
            $trace.RESULT -cne 'VALID' -or $trace.EVALUATION -cne 'COMPLETE' -or
            $trace.ACTION -cne 'READ_ONLY' -or $trace.REPOSITORY_MUTATION -cne 'NONE') {
            throw 'BLOCKED: synthetic probe grammar, lineage, target or read-only result mismatch'
        }
        $canonical=Get-CanonicalRecordText $trace
        $hash=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes($canonical))).ToLowerInvariant()
        return $hash
    } finally { $document.Dispose() }
}

function Get-PageContextProvenance([string]$Owner, [string]$Intake, [string]$Source, [string]$Completeness, [string[]]$Gaps) {
    if ($Intake -cnotin @('AVAILABLE','PARTIAL','UNKNOWN','NOT_APPLICABLE')) { throw 'BLOCKED: explicit PAGE_CONTEXT_INTAKE required' }
    if ($Source -and $Source -cnotmatch '^QA-REFERENCE-[A-Z0-9_-]{2,60}$') { throw 'BLOCKED: Page context source must be bounded synthetic metadata' }
    foreach ($gap in $Gaps) { if ($gap -cnotmatch '^QA-GAP-[A-Z0-9_-]{2,60}$') { throw 'BLOCKED: Page context gap must be bounded synthetic metadata' } }
    if ($Intake -ceq 'AVAILABLE' -and (-not $Source -or $Completeness -cne 'COMPLETE' -or $Gaps.Count -ne 0)) {
        throw 'BLOCKED: AVAILABLE requires attributable complete Page context'
    }
    if ($Intake -ceq 'PARTIAL' -and (-not $Source -or $Completeness -cne 'PARTIAL' -or $Gaps.Count -eq 0)) {
        throw 'BLOCKED: PARTIAL requires source and explicit gaps'
    }
    if ($Intake -ceq 'UNKNOWN' -and ($Completeness -cne 'UNKNOWN' -or $Gaps.Count -eq 0)) {
        throw 'BLOCKED: UNKNOWN requires explicit unresolved gaps'
    }
    if ($Intake -ceq 'NOT_APPLICABLE' -and ($Owner -cne 'NONE' -or $Source -or $Completeness -cne 'NOT_APPLICABLE' -or $Gaps.Count -ne 0)) {
        throw 'BLOCKED: NOT_APPLICABLE cannot erase an owning Page context'
    }
    $sourceReferences=@()
    if ($Source) { $sourceReferences=@($Source) }
    return [ordered]@{
        OWNING_PAGE_CHAT_ID=$Owner; SOURCE_REFERENCES=$sourceReferences
        PAGE_CONTEXT_INTAKE=$Intake; COMPLETENESS=$Completeness; GAPS=@($Gaps)
        EVIDENCE_REFERENCES=@()
    }
}

function Assert-ApprovedTransition([System.Collections.IDictionary]$Old, [System.Collections.IDictionary]$Next, [string]$EventKind, [string]$EventId, [long]$Revision, [string]$CommandId, [string[]]$EvidenceReferences) {
    if ($EventKind -ceq 'RETRY_GENESIS') {
        $parent="PARENT_RUNTIME_HASH:$($Old.RECORD_HASH)"
        $target=@($EvidenceReferences | Where-Object { $_ -cmatch '^TARGET_RUN_ID:[A-Z0-9][A-Z0-9-]*$' })
        $decision=@($EvidenceReferences | Where-Object { $_ -cmatch '^CONSUMED_DECISION_ID:[0-9a-f]{64}$' })
        if ($EvidenceReferences.Count -ne 6 -or $target.Count -ne 1 -or $decision.Count -ne 1 -or
            $parent -cnotin $EvidenceReferences -or
            "OLD_COMMAND_ID:$($Old.LAST_ACCEPTED_COMMAND_ID)" -cnotin $EvidenceReferences -or
            "CAUSAL_LINEAGE_ID:$($Old.CAUSAL_LINEAGE_ID)" -cnotin $EvidenceReferences -or
            'HUMAN_GATE_COMMAND_ID:BRIDGE-ARCH-20260925-F9R2:164' -cnotin $EvidenceReferences -or
            $CommandId -cne 'NOT_APPLICABLE' -or $Old.STATE -cne 'TERMINAL' -or $Next.STATE -cne 'TERMINAL' -or
            $Old.DELIVERY_STATE -cne 'DELIVERY_UNCERTAIN' -or $Old.EXECUTION_STATE -cne 'EXECUTION_UNCERTAIN' -or
            $Next.DELIVERY_STATE -cne 'NOT_SENT' -or $Next.EXECUTION_STATE -cne 'NONE' -or
            $Next.PREVIOUS_RECORD_HASH -cne $Old.RECORD_HASH -or
            $Next.REVISION -ne ($Old.REVISION + 1) -or
            $Next.ACTIVATION_EPOCH -ne $Old.ACTIVATION_EPOCH -or
            $Next.ACTIVE_RUN_ID -ne $null -or
            $decision[0] -cne "CONSUMED_DECISION_ID:$($Old.AUTHORIZATION_REFERENCE.SCOPE)") {
            throw 'BLOCKED: retry genesis does not bind an exact terminal uncertain parent'
        }
        $expected=New-HistoryPreservingRetryState $Old ([string]$Old.AUTHORIZATION_REFERENCE.SCOPE) `
            ([string]($Old.LAST_ACCEPTED_COMMAND_ID -replace ':1$', '')) ([string]$Old.LAST_ACCEPTED_COMMAND_ID) `
            ([string]($target[0] -replace '^TARGET_RUN_ID:', ''))
        foreach ($field in $activationFields.Keys) {
            if ($field -cin @('REVISION','PREVIOUS_RECORD_HASH','RECORD_HASH','LAST_EVENT_HASH','UPDATED_AT_UTC')) { continue }
            if ((Get-ComparableValueText $Next[$field]) -cne (Get-ComparableValueText $expected[$field])) {
                throw "BLOCKED: retry genesis changed unrelated $field"
            }
        }
    }
    $oldState = [string]$Old.STATE
    $nextState = [string]$Next.STATE
    $transition = "$oldState>$nextState"
    $allowed = @(
        'INACTIVE>ACTIVATING','ACTIVATING>ACTIVE','ACTIVATING>TERMINAL',
        'ACTIVE>FENCING','FENCING>TERMINAL','FENCING>REVOKED',
        'TERMINAL>ACTIVATING','REVOKED>ACTIVATING'
    )
    if ($oldState -cne $nextState -and $transition -cnotin $allowed) { throw "BLOCKED: unapproved state transition $transition" }
    $shouldIncrement = $transition -cin @('INACTIVE>ACTIVATING','TERMINAL>ACTIVATING','REVOKED>ACTIVATING','ACTIVE>FENCING')
    $expectedEpoch = [long]$Old.ACTIVATION_EPOCH + [int]$shouldIncrement
    if ([long]$Next.ACTIVATION_EPOCH -ne $expectedEpoch) { throw 'BLOCKED: non-monotonic or skipped activation epoch' }
    if ($oldState -ceq $nextState -and $EventKind -cin @('ACTIVE_COMMIT','FENCE_COMMIT','TERMINAL_COMMIT','ACTIVATION_INTENT')) {
        throw 'BLOCKED: transition event without state transition'
    }
    if ($transition -ceq 'ACTIVE>FENCING' -and $EventKind -cne 'FENCE_COMMIT') { throw 'BLOCKED: fence event mismatch' }
    if ($transition -ceq 'ACTIVATING>ACTIVE' -and $EventKind -cne 'ACTIVE_COMMIT') { throw 'BLOCKED: active event mismatch' }
    if ($transition -cin @('FENCING>TERMINAL','FENCING>REVOKED','ACTIVATING>TERMINAL') -and $EventKind -cne 'TERMINAL_COMMIT') { throw 'BLOCKED: terminal event mismatch' }
    if ($transition -cin @('INACTIVE>ACTIVATING','TERMINAL>ACTIVATING','REVOKED>ACTIVATING') -and $EventKind -cne 'ACTIVATION_INTENT') { throw 'BLOCKED: activation event mismatch' }
    if ($Old.CAUSAL_LINEAGE_ID -and $Next.CAUSAL_LINEAGE_ID -cne $Old.CAUSAL_LINEAGE_ID) { throw 'BLOCKED: causal lineage changed' }
    if ($Old.EXECUTION_CONTEXT_ID -cne $Next.EXECUTION_CONTEXT_ID -or $Old.CHECKOUT_ROOT -cne $Next.CHECKOUT_ROOT -or $Old.HOST_LABEL -cne $Next.HOST_LABEL) {
        throw 'BLOCKED: execution context, host or checkout changed'
    }
    if ($Old.EVIDENCE_STOP_STATE -cne 'NONE' -and $Old.EVIDENCE_STOP_STATE -cne $Next.EVIDENCE_STOP_STATE) {
        throw 'BLOCKED: evidence-stop state was reset or rewritten'
    }
    if ($transition -cin @('ACTIVATING>ACTIVE','ACTIVE>FENCING','FENCING>TERMINAL','FENCING>REVOKED') -and
        ($Old.CONTROL_TOWER_INSTANCE -cne $Next.CONTROL_TOWER_INSTANCE -or $Old.PROJECT_ID -cne $Next.PROJECT_ID -or $Old.CONVERSATION_ID -cne $Next.CONVERSATION_ID)) {
        throw 'BLOCKED: tower instance changed without new activation'
    }
    if ($transition -cin @('TERMINAL>ACTIVATING','REVOKED>ACTIVATING') -and
        $Next.ACTIVE_RUN_ID -cin @($Old.RUN_BINDING | Where-Object { $_.STATE -cne 'RESERVED' } | ForEach-Object { $_.RUN_ID })) {
        throw 'BLOCKED: old RUN_ID reused for new activation'
    }
    Assert-BudgetTransition $Old $Next $EventKind $EventId $Revision $CommandId $EvidenceReferences
    Assert-AuthorityTransition $Old $Next $EventKind
    foreach ($field in @('CONSUMED_HANDOFF_IDS','BLOCKERS','KNOWN_LIMITATIONS')) {
        foreach ($oldValue in $Old[$field]) {
            if ($oldValue -cnotin @($Next[$field])) { throw "BLOCKED: $field history removed" }
        }
    }
    if (@($Next.RUN_BINDING).Count -lt @($Old.RUN_BINDING).Count) { throw 'BLOCKED: run binding history removed' }
    foreach ($oldBinding in $Old.RUN_BINDING) {
        $same = @($Next.RUN_BINDING | Where-Object { $_.RUN_ID -ceq $oldBinding.RUN_ID })
        if ($same.Count -ne 1 -or $same[0].ACTIVATION_EPOCH -ne $oldBinding.ACTIVATION_EPOCH -or
            $same[0].CONTROL_TOWER_INSTANCE -cne $oldBinding.CONTROL_TOWER_INSTANCE) {
            throw 'BLOCKED: prior run binding rewritten or removed'
        }
        if ($oldBinding.STATE -cin @('TERMINAL','REVOKED') -and $same[0].STATE -cne $oldBinding.STATE) { throw 'BLOCKED: terminal run reopened' }
    }
}

function Commit-LocalRevision([psobject]$Binding, [System.Collections.IDictionary]$NewRecord, [string]$EventKind, [string]$RunId, [Nullable[int]]$RoundId, [string]$CommandId, [string[]]$EvidenceReferences = @(), [bool]$CountEvaluatorExecution = $false, [bool]$CountRecoveryAttempt = $false) {
    if ($null -eq $Binding.LockStream -or -not $Binding.LockStream.CanWrite -or
        $Binding.LockStream.Name -cne $Binding.ReservedLockPath) {
        throw 'BLOCKED: authoritative revision requires the exact held context lock'
    }
    $pendingHandoffId = if ($EventKind -ceq 'HANDOFF_PERSISTED') {
        @($EvidenceReferences | Where-Object { $_ -cmatch '^HANDOFF_ID:' } | Select-Object -First 1) -replace '^HANDOFF_ID:', ''
    } else { '' }
    $current = Read-ReconciledContext $Binding ([string]$pendingHandoffId)
    $eventId = "EVT-$([Guid]::NewGuid().ToString('N').ToUpperInvariant())"
    if ($current.Status -eq 'MISSING') {
        if ($EventKind -cne 'ACTIVATION_INTENT' -or $NewRecord.STATE -cne 'INACTIVE') { throw 'BLOCKED: only inactive genesis may initialize state' }
        if ($NewRecord.CAUSAL_LINEAGE_ID -ne $null -or
            $NewRecord.RECOVERY_BUDGET.CAUSAL_LINEAGE_ID -cne 'NONE' -or
            $NewRecord.EVALUATOR_BUDGET.CAUSAL_LINEAGE_ID -cne 'NONE') {
            throw 'BLOCKED: genesis cannot import an established budget'
        }
        $NewRecord['REVISION'] = 0
        $NewRecord['PREVIOUS_RECORD_HASH'] = $null
    } else {
        $NewRecord['REVISION'] = [long]$current.Snapshot.REVISION + 1
        $NewRecord['PREVIOUS_RECORD_HASH'] = $current.Snapshot.RECORD_HASH
        $reference = "JOURNAL:$($NewRecord.REVISION):$eventId"
        if ($CountEvaluatorExecution) {
            if ($EventKind -cne 'COMMAND_OUTCOME' -or
                -not @($EvidenceReferences | Where-Object { $_ -cmatch '^SYNTHETIC_EVALUATOR_EXECUTED:[0-9a-f]{64}$' }).Count) {
                throw 'BLOCKED: actual evaluator proof is required for generation accounting'
            }
            $pendingBuckets = @($NewRecord.EVALUATOR_BUDGET.BUCKETS | Where-Object { $_.PENDING_COMMAND_ID -ceq $CommandId })
            if ($pendingBuckets.Count -ne 1) { throw 'BLOCKED: outcome does not identify exactly one pending evaluator bucket' }
            $bucket = $pendingBuckets[0]
            if ([long]$bucket.EXECUTION_GENERATIONS_USED -ge [long]$bucket.APPROVED_MAXIMUM) { throw 'BLOCKED: evaluator generation budget exhausted' }
            $bucket['EXECUTION_GENERATIONS_USED'] = [long]$bucket.EXECUTION_GENERATIONS_USED + 1
            $bucket['EVIDENCE_REFERENCES'] = @($bucket.EVIDENCE_REFERENCES) + @($reference)
            $bucket['PENDING_COMMAND_ID'] = $null
        }
        if ($CountRecoveryAttempt) {
            if ($EventKind -cne 'COMMAND_OUTCOME' -or
                'SYNTHETIC_FAILED_CORRECTION_SAME_BLOCKER' -cnotin $EvidenceReferences) {
                throw 'BLOCKED: failed recovery observation proof is required'
            }
            if ([long]$NewRecord.RECOVERY_BUDGET.ATTEMPTS_USED -ge [long]$NewRecord.RECOVERY_BUDGET.APPROVED_MAXIMUM) { throw 'BLOCKED: recovery attempt budget exhausted' }
            $NewRecord.RECOVERY_BUDGET['ATTEMPTS_USED'] = [long]$NewRecord.RECOVERY_BUDGET.ATTEMPTS_USED + 1
            $NewRecord.RECOVERY_BUDGET['EVIDENCE_REFERENCES'] = @($NewRecord.RECOVERY_BUDGET.EVIDENCE_REFERENCES) + @($reference)
        }
        Assert-ApprovedTransition $current.Snapshot $NewRecord $EventKind $eventId $NewRecord.REVISION $CommandId @($EvidenceReferences)
    }
    $NewRecord['UPDATED_AT_UTC'] = [DateTime]::UtcNow.ToString('o')
    $NewRecord['RECORD_HASH'] = '0' * 64
    $NewRecord['LAST_EVENT_HASH'] = $null
    $payload = Copy-JsonRecord $NewRecord
    $payload.Remove('RECORD_HASH')
    $payload.Remove('LAST_EVENT_HASH')
    $previousEventHash = if ($current.Status -eq 'MISSING') { $null } else { $current.LastEvent.EVENT_HASH }
    $event = [ordered]@{
        SCHEMA_VERSION=1; REVISION=$NewRecord.REVISION; EVENT_ID=$eventId
        EVENT_KIND=$EventKind; EXECUTION_CONTEXT_ID=$Binding.ExecutionContextId; ACTIVATION_EPOCH=$NewRecord.ACTIVATION_EPOCH
        TOWER_ID=$NewRecord.TOWER_ID; RUN_ID=$RunId; ROUND_ID=$RoundId; COMMAND_ID=$CommandId
        PREVIOUS_EVENT_HASH=$previousEventHash; PREVIOUS_RECORD_HASH=$NewRecord.PREVIOUS_RECORD_HASH
        STATE_PAYLOAD=$payload; CREATED_AT_UTC=[DateTime]::UtcNow.ToString('o')
        AUTHORIZATION_REFERENCE=$NewRecord.AUTHORIZATION_REFERENCE; EVIDENCE_REFERENCES=@($EvidenceReferences); EVENT_HASH=('0' * 64)
    }
    $null = Set-InMemoryHash $event 'EVENT_HASH'
    $NewRecord['LAST_EVENT_HASH'] = $event.EVENT_HASH
    $null = Set-InMemoryHash $NewRecord 'RECORD_HASH'
    $eventText = Get-CanonicalRecordText $event
    $recordText = Get-CanonicalRecordText $NewRecord
    $eventCheck = Test-Record $eventText Journal $Binding.ExecutionContextId $Binding.CheckoutRoot $Binding.HostLabel
    $recordCheck = Test-Record $recordText Activation $Binding.ExecutionContextId $Binding.CheckoutRoot $Binding.HostLabel
    if (-not $eventCheck.Valid -or -not $recordCheck.Valid) { throw "BLOCKED: revision validation failed: $($eventCheck.Errors -join ', '); $($recordCheck.Errors -join ', ')" }
    $journalPath = [System.IO.Path]::Combine($Binding.ReservedStatePath, 'journal')
    if (-not [System.IO.Directory]::Exists($journalPath)) { [void][System.IO.Directory]::CreateDirectory($journalPath) }
    Assert-PlainPath $journalPath
    $eventFinal = [System.IO.Path]::Combine($journalPath, "$($NewRecord.REVISION).json")
    $eventTemp = "$eventFinal.tmp-$([Guid]::NewGuid().ToString('N'))"
    Write-DurableNewFile $eventTemp $eventText
    [System.IO.File]::Move($eventTemp, $eventFinal)
    if ([System.IO.File]::ReadAllText($eventFinal,[System.Text.Encoding]::UTF8) -cne $eventText) {
        throw 'BLOCKED: immutable journal final read-back mismatch; no dependent work permitted'
    }
    $snapshotPath = [System.IO.Path]::Combine($Binding.ReservedStatePath, 'activation.json')
    Write-AtomicSnapshot $snapshotPath $recordText
    $verified = Read-ReconciledContext $Binding
    if ($verified.Snapshot.RECORD_HASH -cne $NewRecord.RECORD_HASH) { throw 'BLOCKED: post-commit record hash mismatch' }
    return $verified
}

switch ($Action) {
    Preflight { Get-Preflight $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId }
    ReconcileLiveReadOnly {
        if ($ExecutionContextId -cne 'FEDERATED-CONTROL-TOWERS-FOUNDATION' -or
            @($PSBoundParameters.Keys | Where-Object { $_ -cnotin @('Action','ExpectedCheckoutRoot','ExpectedHostLabel','ExecutionContextId') }).Count -ne 0) {
            throw 'BLOCKED: exact foundation context and read-only parameters required'
        }
        $binding=Get-ApprovedContextPath $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId $false $true
        $binding | Add-Member -NotePropertyName IsLive -NotePropertyValue $true -Force
        Invoke-ExistingReadOnlyLock $binding {
            param($held)
            $current=Read-ReconciledContext $held '' $true
            Get-ReadOnlyLiveAuthorityProjection $current
        }
    }
    DescribeSchemas {
        [pscustomobject]@{
            Phase = 3; ReadOnlyActions = @('Preflight','DescribeSchemas','ValidateActivation','ValidateJournal','ValidateHandoff','ReconcileLiveReadOnly')
            IsolatedSyntheticTempTestActions = @('SelfTest')
            SyntheticFixtureActions = @('LockProbe','LockHold','InitializeFixture','ReconcileFixture','AdvanceFixture','RecordFixtureProbe','RecordFixtureCommand','MarkFixtureDelivery','PersistFixtureHandoff','SupersedeFixtureHandoff','ConsumeFixtureAuthority')
            ActivationFields = @($activationFields.Keys); JournalFields = @($journalFields.Keys); HandoffFields = @($handoffFields.Keys)
            CanonicalJson = 'UTF-8, ordinal-sorted object keys, integer numbers, hash field excluded at root'
            RuntimeStateCreatedByThisAction = $false; LockAcquiredByThisAction = $false; LiveExecutableAuthority = $false
        }
    }
    InitializeLiveContext {
        if ($ExecutionContextId -cmatch '^FED-QA-' -or -not $ExecutionContextId) {
            throw 'BLOCKED: live initialization cannot use a synthetic context'
        }
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            if ($binding.ContextExistedBeforeLock -or $binding.LockExistedBeforeAcquire -or
                (Read-ReconciledContext $binding).Status -cne 'MISSING') {
                throw 'BLOCKED: live inactive genesis requires an unused exact context'
            }
            $genesis=New-ActivationFixture $binding.ExecutionContextId $binding.CheckoutRoot $binding.HostLabel
            $now=[DateTime]::UtcNow.ToString('o')
            $genesis['CREATED_AT_UTC']=$now
            $genesis['OWNER_START_UTC']=$now
            $genesis['HELPER_INVOCATION_ID']="LIVE-$([Guid]::NewGuid().ToString('N').ToUpperInvariant())"
            $committed=Commit-LocalRevision $binding $genesis 'ACTIVATION_INTENT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE'
            [pscustomobject]@{
                Status='INACTIVE_AWAITING_EXACT_HUMAN_SELECTION'; ExecutionContextId=$binding.ExecutionContextId
                RecordHash=$committed.Snapshot.RECORD_HASH; ActivationEpoch=0; ExecutableAuthority=$false
            }
        } $true
    }
    RunLiveSelection {
        # Codex owns the built-in browser. This process holds the authority
        # lock while Codex performs one external round; stdin is evaluation
        # input, never independent proof of browser or Human provenance.
        if ($ExecutionContextId -cmatch '^FED-QA-' -or -not $ExecutionContextId -or
            $ProbeTraceJson -or $ObservedProjectId -or $ObservedConversationId -or $ObservedTitle -or $ObservedUrl) {
            throw 'BLOCKED: live selection cannot consume caller-supplied synthetic probe data'
        }
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current=Read-ReconciledContext $binding
            if ($current.Status -cne 'RECONCILED_NON_EXECUTING' -or
                $current.Snapshot.STATE -cnotin @('INACTIVE','ACTIVE','TERMINAL','REVOKED') -or
                $current.Snapshot.EVIDENCE_STOP_STATE -cne 'NONE' -or
                @($current.Snapshot.RUN_BINDING | Where-Object { $_.STATE -ceq 'RESERVED' }).Count -ne 0) {
                throw 'BLOCKED: live selection requires exact certain non-executing source'
            }
            $verified=Get-LiveSelectionDecision $binding $current.Snapshot $DecisionId
            $decision=$verified.Decision
            if ($decision.DECISION_PAYLOAD.INTENDED_ACTION -ceq 'GLOBAL_TO_BOUND_PAGE_QA_TRANSFER' -and
                $binding.ExecutionContextId -cne 'FEDERATED-CONTROL-TOWERS-FOUNDATION') {
                throw 'BLOCKED: bound Page QA transfer is restricted to its reviewed execution context'
            }
            $retrySource=$current.LastEvent.EVENT_KIND -ceq 'RETRY_GENESIS'
            if ($retrySource) {
                $retryTarget="TARGET_RUN_ID:$($decision.DECISION_PAYLOAD.TARGET_RUN_ID)"
                $targetTower=$decision.DECISION_PAYLOAD.TARGET_TOWER
                if ($current.Snapshot.STATE -cne 'TERMINAL' -or
                    $retryTarget -cnotin @($current.LastEvent.EVIDENCE_REFERENCES) -or
                    $targetTower.PROJECT_ID -cne $current.Snapshot.PROJECT_ID -or
                    $targetTower.CONVERSATION_ID -cne $current.Snapshot.CONVERSATION_ID -or
                    $targetTower.CONVERSATION_URL -cne $current.Snapshot.CONVERSATION_URL -or
                    (Get-ComparableValueText $targetTower.TOWER_ID) -cne (Get-ComparableValueText $current.Snapshot.TOWER_ID)) {
                    throw 'BLOCKED: fresh retry selection is not bound to the reviewed same-tower genesis'
                }
            }
            $sourceState=$current.Snapshot.STATE
            $sourceRunId=[string]$current.Snapshot.ACTIVE_RUN_ID
            if ($sourceState -cin @('TERMINAL','REVOKED')) {
                $sourceRun=@($current.Snapshot.RUN_BINDING | Where-Object { $_.STATE -cin @('TERMINAL','REVOKED') } | Select-Object -Last 1)
                if ($sourceRun.Count -ne 1) { throw 'BLOCKED: terminal source has no exact prior run' }
                $sourceRunId=[string]$sourceRun[0].RUN_ID
            }
            $post=New-AuthorityPostState $current.Snapshot $verified
            $consumed=Commit-LocalRevision $binding $post 'AUTHORITY_CONSUMED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("DECISION_ID:$DecisionId")
            $payload=$decision.DECISION_PAYLOAD
            $target=$payload.TARGET_TOWER
            $sourceForActivation=$consumed.Snapshot
            if ($sourceState -ceq 'ACTIVE') {
                $fenced=Copy-JsonRecord $sourceForActivation
                $fenced['STATE']='FENCING'
                $fenced['ACTIVATION_EPOCH']=[long]$fenced.ACTIVATION_EPOCH+1
                foreach ($run in $fenced.RUN_BINDING) { if ($run.RUN_ID -ceq $sourceRunId) { $run['STATE']='REVOKED' } }
                $fenced['ACTIVE_RUN_ID']=$null
                $fenceCommit=Commit-LocalRevision $binding $fenced 'FENCE_COMMIT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("LIVE_SELECTION_DECISION_ID:$DecisionId")
                $terminal=Copy-JsonRecord $fenceCommit.Snapshot
                $terminal['STATE']='TERMINAL'
                $terminalCommit=Commit-LocalRevision $binding $terminal 'TERMINAL_COMMIT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("LIVE_SELECTION_DECISION_ID:$DecisionId")
                $sourceForActivation=$terminalCommit.Snapshot
            }
            $handoffId=$null
            if ($sourceState -cne 'INACTIVE' -and -not $retrySource) {
                $transfer=New-LiveHandoff $binding $sourceForActivation $decision $sourceRunId
                $sourceForActivation=$transfer.Snapshot
                $handoffId=$transfer.HandoffId
            }
            $next=Copy-JsonRecord $sourceForActivation
            $next['STATE']='ACTIVATING'
            $next['ACTIVATION_EPOCH']=[long]$next.ACTIVATION_EPOCH+1
            foreach ($field in @('TOWER_ID','CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID','CONTROL_TOWER_INSTANCE','PROJECT_ID','CONVERSATION_ID','CONVERSATION_TITLE','CONVERSATION_URL')) {
                $next[$field]=$target[$field]
            }
            $next['ACTIVE_RUN_ID']=$payload.TARGET_RUN_ID
            $next['CAUSAL_LINEAGE_ID']=$decision.DECISION_SCOPE.CAUSAL_LINEAGE_ID
            $next['AUTHORIZATION_REFERENCE']=[ordered]@{
                DECISION_SOURCE='ACCEPTED_HUMAN_GATE_RESULT'; DECISION='APPROVE_LIVE_TOWER_SELECTION'
                SCOPE=$DecisionId; ARTIFACT_PATH=$verified.Approval.REVIEW_PACKET_PATH
                ARTIFACT_SHA256=$verified.Approval.REVIEW_PACKET_PRE_APPROVAL_SHA256
                DECIDED_AT_UTC=$verified.Approval.CREATED_AT_UTC
            }
            if ($sourceState -ceq 'INACTIVE') {
                $next.RECOVERY_BUDGET['CAUSAL_LINEAGE_ID']=$next.CAUSAL_LINEAGE_ID
                $next.RECOVERY_BUDGET['APPROVED_MAXIMUM']=2
                $next.EVALUATOR_BUDGET['CAUSAL_LINEAGE_ID']=$next.CAUSAL_LINEAGE_ID
                $next['RUN_BINDING']=@([ordered]@{
                    RUN_ID=$payload.TARGET_RUN_ID; ACTIVATION_EPOCH=$next.ACTIVATION_EPOCH; TOWER_ID=$target.TOWER_ID
                    CONTROL_TOWER_INSTANCE=$target.CONTROL_TOWER_INSTANCE; PROJECT_ID=$target.PROJECT_ID
                    CONVERSATION_ID=$target.CONVERSATION_ID; STATE='RESERVED'
                })
            } elseif ($retrySource) {
                $next['RUN_BINDING']=@($next.RUN_BINDING)+@([ordered]@{
                    RUN_ID=$payload.TARGET_RUN_ID; ACTIVATION_EPOCH=$next.ACTIVATION_EPOCH; TOWER_ID=$target.TOWER_ID
                    CONTROL_TOWER_INSTANCE=$target.CONTROL_TOWER_INSTANCE; PROJECT_ID=$target.PROJECT_ID
                    CONVERSATION_ID=$target.CONVERSATION_ID; STATE='RESERVED'
                })
            } else {
                $handoff=Get-FixtureHandoff $binding $handoffId
                Assert-HandoffSourceAndStatus $binding $handoff $sourceForActivation
                if ($handoff.TARGET_RUN_ID -cne $payload.TARGET_RUN_ID -or
                    $handoff.TARGET_ACTIVATION_EPOCH -ne $next.ACTIVATION_EPOCH -or
                    (Get-ComparableValueText $handoff.TARGET_TOWER.TOWER_ID) -cne (Get-ComparableValueText $target.TOWER_ID)) {
                    throw 'BLOCKED: live activation differs from immutable handoff'
                }
            }
            $activated=Commit-LocalRevision $binding $next 'ACTIVATION_INTENT' $payload.TARGET_RUN_ID $null 'NOT_APPLICABLE' @("LIVE_SELECTION_DECISION_ID:$DecisionId")
            $intent=Copy-JsonRecord $activated.Snapshot
            $intent['LAST_ACCEPTED_COMMAND_ID']="$($payload.TARGET_RUN_ID):1"
            $intent['LAST_RESULT_IDENTITY']=$null
            $intent['EXECUTION_STATE']='ACCEPTED'
            $intent['DELIVERY_STATE']='SENDING'
            $reserved=Commit-LocalRevision $binding $intent 'PROBE_INTENT' $payload.TARGET_RUN_ID 1 "$($payload.TARGET_RUN_ID):1" @("LIVE_SELECTION_DECISION_ID:$DecisionId")
            $request=[ordered]@{
                REQUEST='CODEX_BUILT_IN_BROWSER_READ_ONLY_ROUND'; DECISION_ID=$DecisionId
                EXECUTION_CONTEXT_ID=$binding.ExecutionContextId; CAUSAL_LINEAGE_ID=$reserved.Snapshot.CAUSAL_LINEAGE_ID
                TARGET_RUN_ID=$payload.TARGET_RUN_ID; ACTIVATION_EPOCH=$reserved.Snapshot.ACTIVATION_EPOCH
                TARGET_TOWER=$target; SOURCE_RECORD_HASH=$payload.EXPECTED_SOURCE_RECORD_HASH
                PROBE_INTENT_EVENT_HASH=$reserved.Snapshot.LAST_EVENT_HASH
                REQUIRED_ROUND_ID=1; REQUIRED_COMMAND_ID="$($payload.TARGET_RUN_ID):1"
                NO_COMPETING_ACTIVE_AUTHORITY=$true; EXECUTABLE_AUTHORITY=$false
            }
            [Console]::WriteLine((Get-CanonicalRecordText $request))
            [Console]::Out.Flush()
            $line=[Console]::ReadLine()
            $continuation=$null
            try {
                $continuation=Assert-LiveTransactionContinuation $line $reserved.Snapshot $decision $reserved.Snapshot.LAST_EVENT_HASH
            } catch {
                $uncertain=Copy-JsonRecord $reserved.Snapshot
                $uncertain['DELIVERY_STATE']='DELIVERY_UNCERTAIN'
                $uncertain['EXECUTION_STATE']='EXECUTION_UNCERTAIN'
                $null=Commit-LocalRevision $binding $uncertain 'RESULT_DELIVERY' $payload.TARGET_RUN_ID 1 "$($payload.TARGET_RUN_ID):1" @('EXTERNAL_ROUND_CONTINUATION_UNVERIFIED','NO_RESEND')
                throw 'BLOCKED: external round continuation missing, malformed or misbound; no resend or executable authority'
            }
            if ($continuation.Disposition -cin @('DELIVERY_UNCERTAIN','EXECUTION_UNCERTAIN')) {
                $uncertain=Copy-JsonRecord $reserved.Snapshot
                $uncertain['DELIVERY_STATE']='DELIVERY_UNCERTAIN'
                $uncertain['EXECUTION_STATE']='EXECUTION_UNCERTAIN'
                $null=Commit-LocalRevision $binding $uncertain 'RESULT_DELIVERY' $payload.TARGET_RUN_ID 1 "$($payload.TARGET_RUN_ID):1" @("EXTERNAL_ROUND_$($continuation.Disposition)",'NO_RESEND')
                throw 'BLOCKED: external round delivery or execution uncertain; no resend or executable authority'
            }
            $outcome=Copy-JsonRecord $reserved.Snapshot
            $outcome['DELIVERY_STATE']='RESPONSE_COMPLETE'
            $outcome['EXECUTION_STATE']=if ($continuation.Disposition -ceq 'COMPLETE') { 'COMPLETED' } else { 'FAILED' }
            $outcome['LAST_RESULT_IDENTITY']=[ordered]@{
                RUN_ID=$payload.TARGET_RUN_ID; ROUND_ID=1; COMMAND_ID="$($payload.TARGET_RUN_ID):1"
                CAUSAL_LINEAGE_ID=$outcome.CAUSAL_LINEAGE_ID; STAGE='FEDERATION_READ_ONLY_PROBE'
                RESULT_HASH=$continuation.Input.RESULT_SHA256
            }
            $completed=Commit-LocalRevision $binding $outcome 'PROBE_OUTCOME' $payload.TARGET_RUN_ID 1 "$($payload.TARGET_RUN_ID):1" @("LIVE_SELECTION_DECISION_ID:$DecisionId","CONTROL_TOWER_EVALUATION_INPUT:$($continuation.InputHash)")
            if ($continuation.Disposition -cne 'COMPLETE') {
                throw 'BLOCKED: Control Tower evaluation was negative; no executable authority'
            }
            $active=Copy-JsonRecord $completed.Snapshot
            $active['STATE']='ACTIVE'
            foreach ($run in $active.RUN_BINDING) { if ($run.RUN_ID -ceq $payload.TARGET_RUN_ID) { $run['STATE']='ACTIVE' } }
            if ($handoffId) {
                $handoff=Get-FixtureHandoff $binding $handoffId
                Assert-HandoffSourceAndStatus $binding $handoff $completed.Snapshot
                $active['CURRENT_HANDOFF_ID']=$handoffId
                $active['CONSUMED_HANDOFF_IDS']=@($active.CONSUMED_HANDOFF_IDS)+@($handoffId)
            }
            $committed=Commit-LocalRevision $binding $active 'ACTIVE_COMMIT' $payload.TARGET_RUN_ID 1 "$($payload.TARGET_RUN_ID):1" @("LIVE_SELECTION_DECISION_ID:$DecisionId","CONTROL_TOWER_EVALUATION_INPUT:$($continuation.InputHash)")
            [pscustomobject]@{
                Status='LIVE_ACTIVE_COMMIT'; DecisionId=$DecisionId; ExecutionContextId=$binding.ExecutionContextId
                RunId=$payload.TARGET_RUN_ID; RecordHash=$committed.Snapshot.RECORD_HASH
                ExternalEvaluationInputHash=$continuation.InputHash; ExecutableAuthority=$true
            }
        } $true
    }
    TerminalizeUncertainLiveSelection {
        if ($ExecutionContextId -cmatch '^FED-QA-' -or -not $ExecutionContextId -or
            $DecisionId -cnotmatch '^[0-9a-f]{64}$' -or $ExpectedRecordHash -cnotmatch '^[0-9a-f]{64}$' -or
            $RunId -cnotmatch '^[A-Z0-9][A-Z0-9-]*$' -or $CommandId -cne "${RunId}:1") {
            throw 'BLOCKED: exact live recovery identity and source hash are required'
        }
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current=Read-ReconciledContext $binding
            if ($current.Status -cne 'EXECUTION_UNCERTAIN' -or $current.Snapshot.RECORD_HASH -cne $ExpectedRecordHash) {
                throw 'BLOCKED: uncertain live recovery source is stale or not exact'
            }
            $post=New-UncertainLiveTerminalState $current.Snapshot $DecisionId $RunId $CommandId
            $committed=Commit-LocalRevision $binding $post 'TERMINAL_COMMIT' $RunId 1 $CommandId @(
                "DECISION_ID:$DecisionId",'DUPLICATE_RESULT_RELAY','DELIVERY_UNCERTAIN','EXECUTION_UNCERTAIN','NO_REPLAY')
            $verified=Read-ReconciledContext $binding
            if ($verified.Snapshot.RECORD_HASH -cne $committed.Snapshot.RECORD_HASH -or
                $verified.Snapshot.STATE -cne 'TERMINAL' -or $verified.Status -cne 'EXECUTION_UNCERTAIN' -or
                $verified.ExecutableAuthority -or $verified.Snapshot.ACTIVE_RUN_ID -ne $null) {
                throw 'BLOCKED: terminal uncertain recovery did not read back exactly'
            }
            [pscustomobject]@{
                Status='TERMINAL_UNCERTAIN_NON_EXECUTABLE'; ExecutionContextId=$binding.ExecutionContextId
                RunId=$RunId; CommandId=$CommandId; DecisionId=$DecisionId
                RecordHash=$verified.Snapshot.RECORD_HASH; Revision=$verified.Snapshot.REVISION
                DeliveryState=$verified.Snapshot.DELIVERY_STATE; ExecutionState=$verified.Snapshot.EXECUTION_STATE
                ConsumedAuthorityProofs=@($verified.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count
                ExecutableAuthority=$false; Replayable=$false
            }
        } $true
    }
    PrepareHistoryPreservingRetry {
        if ($ExecutionContextId -cmatch '^FED-QA-' -or -not $ExecutionContextId -or
            $DecisionId -cnotmatch '^[0-9a-f]{64}$' -or $ExpectedRecordHash -cnotmatch '^[0-9a-f]{64}$' -or
            $RunId -cnotmatch '^[A-Z0-9][A-Z0-9-]*$' -or $CommandId -cne "${RunId}:1" -or
            $NewRunId -cnotmatch '^[A-Z0-9][A-Z0-9-]*$') {
            throw 'BLOCKED: exact retry parent, old command and fresh target run required'
        }
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current=Read-ReconciledContext $binding
            if ($current.Status -cne 'EXECUTION_UNCERTAIN' -or
                $current.Snapshot.RECORD_HASH -cne $ExpectedRecordHash -or
                $current.LastEvent.EVENT_KIND -cne 'TERMINAL_COMMIT' -or
                $current.LastEvent.RUN_ID -cne $RunId -or $current.LastEvent.COMMAND_ID -cne $CommandId) {
                throw 'BLOCKED: retry parent is stale, ambiguous or not terminalized'
            }
            $post=New-HistoryPreservingRetryState $current.Snapshot $DecisionId $RunId $CommandId $NewRunId
            $references=@(
                "PARENT_RUNTIME_HASH:$ExpectedRecordHash", "TARGET_RUN_ID:$NewRunId",
                "OLD_COMMAND_ID:$CommandId", "CONSUMED_DECISION_ID:$DecisionId",
                "CAUSAL_LINEAGE_ID:$($current.Snapshot.CAUSAL_LINEAGE_ID)",
                'HUMAN_GATE_COMMAND_ID:BRIDGE-ARCH-20260925-F9R2:164'
            )
            $committed=Commit-LocalRevision $binding $post 'RETRY_GENESIS' $NewRunId $null 'NOT_APPLICABLE' $references
            $verified=Read-ReconciledContext $binding
            if ($verified.Status -cne 'RECONCILED_NON_EXECUTING' -or
                $verified.Snapshot.RECORD_HASH -cne $committed.Snapshot.RECORD_HASH -or
                $verified.Snapshot.PREVIOUS_RECORD_HASH -cne $ExpectedRecordHash -or
                $verified.LastEvent.EVENT_KIND -cne 'RETRY_GENESIS' -or $verified.ExecutableAuthority -or
                $verified.Snapshot.ACTIVE_RUN_ID -ne $null -or
                @($verified.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count -ne @($current.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count) {
                throw 'BLOCKED: fresh retry read-back or historical authority preservation failed'
            }
            [pscustomobject]@{
                Status='FRESH_RETRY_NON_EXECUTING'; ExecutionContextId=$binding.ExecutionContextId
                ParentRecordHash=$ExpectedRecordHash; RecordHash=$verified.Snapshot.RECORD_HASH
                Revision=$verified.Snapshot.REVISION; ActivationEpoch=$verified.Snapshot.ACTIVATION_EPOCH
                TargetRunId=$NewRunId; CausalLineageId=$verified.Snapshot.CAUSAL_LINEAGE_ID
                PriorCommandId=$verified.Snapshot.LAST_ACCEPTED_COMMAND_ID
                ConsumedAuthorityProofs=@($verified.Snapshot.CONSUMED_AUTHORITY_PROOFS).Count
                ExecutableAuthority=$false; HumanAuthorityConsumedForRetry=$false; BrowserActionSent=$false
            }
        } $true
    }
    LockProbe {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            [pscustomobject]@{
                Status = 'LOCK_HELD_FOR_LOCAL_PROBE_ONLY'; Context = $binding.ExecutionContextId
                LockPath = $binding.ReservedLockPath; ExecutableAuthority = $false
            }
        }
    }
    LockHold {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $marker = [pscustomobject]@{ Status='LOCK_HELD_FOR_LOCAL_PROBE_ONLY'; Context=$binding.ExecutionContextId; ProcessId=$PID; ExecutableAuthority=$false }
            Write-Output $marker
            [System.Threading.Thread]::Sleep($HoldSeconds * 1000)
        }
    }
    ConsumeFixtureAuthority {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            if ($DecisionId -cnotmatch '^[0-9a-f]{64}$') { throw 'BLOCKED: exact reviewed DECISION_ID required' }
            $current=Read-ReconciledContext $binding
            if ($current.Status -ne 'RECONCILED_NON_EXECUTING' -or -not $current.Snapshot.CAUSAL_LINEAGE_ID) {
                throw 'BLOCKED: semantic authority cannot be consumed in uncertain or pre-lineage state'
            }
            $verified=Get-AuthorityDecision $binding.CheckoutRoot $DecisionId $binding.ExecutionContextId $current.Snapshot.CAUSAL_LINEAGE_ID
            $post=New-AuthorityPostState $current.Snapshot $verified
            $run=if ($current.Snapshot.ACTIVE_RUN_ID) { [string]$current.Snapshot.ACTIVE_RUN_ID } else { 'NOT_APPLICABLE' }
            $committed=Commit-LocalRevision $binding $post 'AUTHORITY_CONSUMED' $run $null 'NOT_APPLICABLE' @("DECISION_ID:$DecisionId")
            [pscustomobject]@{ Status=$committed.Status; DecisionId=$DecisionId; Revision=$committed.Snapshot.REVISION; ProofHash=$verified.ProofEntry.CONSUMED_AUTHORITY_PROOF_SHA256; ExecutableAuthority=$false }
        }
    }
    InitializeFixture {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            if ($binding.ContextExistedBeforeLock -or $binding.LockExistedBeforeAcquire) {
                throw 'BLOCKED: pre-existing context or stale lock file cannot be treated as fresh genesis'
            }
            $existing = Read-ReconciledContext $binding
            if ($existing.Status -ne 'MISSING') { throw 'BLOCKED: fixture already initialized' }
            $genesis = New-ActivationFixture $binding.ExecutionContextId $binding.CheckoutRoot $binding.HostLabel
            $now = [DateTime]::UtcNow.ToString('o')
            $genesis['CREATED_AT_UTC'] = $now
            $genesis['OWNER_START_UTC'] = $now
            $genesis['HELPER_INVOCATION_ID'] = "QA-$([Guid]::NewGuid().ToString('N').ToUpperInvariant())"
            $committed = Commit-LocalRevision $binding $genesis 'ACTIVATION_INTENT' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE'
            [pscustomobject]@{ Status=$committed.Status; Revision=$committed.Snapshot.REVISION; RecordHash=$committed.Snapshot.RECORD_HASH; ExecutableAuthority=$false }
        }
    }
    AdvanceFixture {
        if ([string]::IsNullOrWhiteSpace($NextState)) { throw 'NextState is required' }
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current = Read-ReconciledContext $binding
            if ($current.Status -eq 'MISSING') { throw 'BLOCKED: initialize fixture before advancing' }
            $next = Copy-JsonRecord $current.Snapshot
            $oldState = [string]$next.STATE
            $transition = "$oldState>$NextState"
            if ($transition -cin @('ACTIVE>FENCING','FENCING>TERMINAL','FENCING>REVOKED') -and
                ($next.EXECUTION_STATE -cin @('ACCEPTED','EXECUTING','EXECUTION_UNCERTAIN') -or
                $next.DELIVERY_STATE -cin @('SENDING','SENT_WAITING_RESPONSE','RESPONSE_GENERATING','DELIVERY_UNCERTAIN'))) {
                throw 'BLOCKED: cannot transfer with uncertain execution or delivery'
            }
            if ($transition -cin @('INACTIVE>ACTIVATING','TERMINAL>ACTIVATING','REVOKED>ACTIVATING')) {
                if ($NewRunId -cnotmatch '^FED-QA-[A-Z0-9_-]{3,60}-RUN-[0-9]+$') { throw 'A fresh synthetic QA RUN_ID is required' }
                $selected=Get-SyntheticTarget $TargetRole $TargetScope $TargetOwningPageChatId $TargetProjectId $TargetConversationId $TargetTitle
                if ($oldState -cin @('TERMINAL','REVOKED')) {
                    $handoff=Get-FixtureHandoff $binding $HandoffId
                    Assert-HandoffSourceAndStatus $binding $handoff $current.Snapshot
                    if ($handoff.TARGET_RUN_ID -cne $NewRunId -or
                        $handoff.TARGET_ACTIVATION_EPOCH -ne ([long]$next.ACTIVATION_EPOCH+1) -or
                        (Get-ComparableValueText $handoff.TARGET_TOWER) -cne (Get-ComparableValueText $selected)) {
                        throw 'BLOCKED: selected target differs from immutable handoff target'
                    }
                }
                $next['STATE']='ACTIVATING'
                $next['ACTIVATION_EPOCH']=[long]$next.ACTIVATION_EPOCH + 1
                foreach ($field in @('TOWER_ID','CONTROL_TOWER_ROLE','CONTROL_TOWER_SCOPE','OWNING_PAGE_CHAT_ID','CONTROL_TOWER_INSTANCE','PROJECT_ID','CONVERSATION_ID','CONVERSATION_TITLE')) {
                    $next[$field]=$selected[$field]
                }
                $next['CONVERSATION_URL']="https://chatgpt.com/g/$($selected.PROJECT_ID)/c/$($selected.CONVERSATION_ID)"
                $next['ACTIVE_RUN_ID']=$NewRunId
                if (-not $next.CAUSAL_LINEAGE_ID) {
                    $next['CAUSAL_LINEAGE_ID']="$($binding.ExecutionContextId)-LINEAGE"
                    $next.RECOVERY_BUDGET['CAUSAL_LINEAGE_ID']=$next.CAUSAL_LINEAGE_ID
                    $next.RECOVERY_BUDGET['APPROVED_MAXIMUM']=2
                    $next.EVALUATOR_BUDGET['CAUSAL_LINEAGE_ID']=$next.CAUSAL_LINEAGE_ID
                }
                $next['AUTHORIZATION_REFERENCE']=[ordered]@{
                    DECISION_SOURCE='PHASE2_SYNTHETIC_FIXTURE'; DECISION='NO_LIVE_AUTHORITY'; SCOPE='LOCAL_QA_ONLY'
                    ARTIFACT_PATH='openspec/changes/federated-control-towers-foundation/tasks.md'
                    ARTIFACT_SHA256='2d950bb8adf260e49768a77b3991b0ca923f15d3b7bf6715b59906de2ef12b35'
                    DECIDED_AT_UTC=[DateTime]::UtcNow.ToString('o')
                }
                if ($oldState -ceq 'INACTIVE') {
                    $bindingEntry=[ordered]@{
                        RUN_ID=$NewRunId; ACTIVATION_EPOCH=$next.ACTIVATION_EPOCH; TOWER_ID=$selected.TOWER_ID
                        CONTROL_TOWER_INSTANCE=$selected.CONTROL_TOWER_INSTANCE; PROJECT_ID=$selected.PROJECT_ID
                        CONVERSATION_ID=$selected.CONVERSATION_ID; STATE='RESERVED'
                    }
                    $next['RUN_BINDING']=@($next.RUN_BINDING)+@($bindingEntry)
                }
                $eventKind='ACTIVATION_INTENT'
            } elseif ($transition -ceq 'ACTIVATING>ACTIVE') {
                if ($current.Status -ne 'RECONCILED_NON_EXECUTING') { throw "BLOCKED: $($current.Status)" }
                Assert-ObservedFixtureTarget $next $ObservedProjectId $ObservedConversationId $ObservedTitle $ObservedUrl
                $probeOutcomes=@(Get-ChildItem -LiteralPath ([System.IO.Path]::Combine($binding.ReservedStatePath,'journal')) -Filter '*.json' | ForEach-Object {
                    ConvertFrom-Json -InputObject ([System.IO.File]::ReadAllText($_.FullName)) -AsHashtable -Depth 40 -DateKind String
                } | Where-Object {
                    $_.EVENT_KIND -ceq 'PROBE_OUTCOME' -and $_.RUN_ID -ceq $next.ACTIVE_RUN_ID -and
                    $_.ACTIVATION_EPOCH -eq $next.ACTIVATION_EPOCH -and
                    @($_.EVIDENCE_REFERENCES | Where-Object { $_ -cmatch '^PHASE3_SYNTHETIC_PROBE_VERIFIED:[0-9a-f]{64}$' }).Count -eq 1
                })
                if ($probeOutcomes.Count -ne 1) { throw 'BLOCKED: complete synthetic read-only probe evidence required before fixture ACTIVE' }
                if (@($next.RUN_BINDING).Count -gt 1) {
                    $handoff=Get-FixtureHandoff $binding $HandoffId
                    Assert-HandoffSourceAndStatus $binding $handoff $current.Snapshot
                    if ($handoff.TARGET_RUN_ID -cne $next.ACTIVE_RUN_ID -or $handoff.TARGET_TOWER.CONVERSATION_ID -cne $next.CONVERSATION_ID) {
                        throw 'BLOCKED: ACTIVE commit target does not match handoff'
                    }
                    $next['CURRENT_HANDOFF_ID']=$HandoffId
                    $next['CONSUMED_HANDOFF_IDS']=@($next.CONSUMED_HANDOFF_IDS)+@($HandoffId)
                }
                $next['STATE']='ACTIVE'
                foreach ($run in $next.RUN_BINDING) { if ($run.RUN_ID -ceq $next.ACTIVE_RUN_ID) { $run['STATE']='ACTIVE' } }
                $eventKind='ACTIVE_COMMIT'
            } elseif ($transition -ceq 'ACTIVE>FENCING') {
                $next['STATE']='FENCING'
                $next['ACTIVATION_EPOCH']=[long]$next.ACTIVATION_EPOCH+1
                foreach ($run in $next.RUN_BINDING) { if ($run.RUN_ID -ceq $next.ACTIVE_RUN_ID) { $run['STATE']='REVOKED' } }
                $next['ACTIVE_RUN_ID']=$null
                $eventKind='FENCE_COMMIT'
            } elseif ($transition -cin @('FENCING>TERMINAL','FENCING>REVOKED','ACTIVATING>TERMINAL')) {
                $next['STATE']=$NextState
                if ($oldState -ceq 'ACTIVATING') {
                    foreach ($run in $next.RUN_BINDING) { if ($run.RUN_ID -ceq $next.ACTIVE_RUN_ID) { $run['STATE']='TERMINAL' } }
                    $next['ACTIVE_RUN_ID']=$null
                }
                $eventKind='TERMINAL_COMMIT'
            } else { throw "BLOCKED: fixture transition $transition is not allowed" }
            $next['OWNER_PID']=$PID
            $committed=Commit-LocalRevision $binding $next $eventKind 'NOT_APPLICABLE' $null 'NOT_APPLICABLE'
            [pscustomobject]@{
                Status=$committed.Status; State=$committed.Snapshot.STATE; Revision=$committed.Snapshot.REVISION
                Epoch=$committed.Snapshot.ACTIVATION_EPOCH; ActiveRunId=$committed.Snapshot.ACTIVE_RUN_ID
                RecordHash=$committed.Snapshot.RECORD_HASH; ExecutableAuthority=$false
            }
        }
    }
    RecordFixtureProbe {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current=Read-ReconciledContext $binding
            if ($current.Status -ne 'RECONCILED_NON_EXECUTING' -or $current.Snapshot.STATE -cne 'ACTIVATING' -or
                $RunId -cne $current.Snapshot.ACTIVE_RUN_ID) { throw 'BLOCKED: probe requires exact non-executing ACTIVATING run' }
            Assert-ObservedFixtureTarget $current.Snapshot $ObservedProjectId $ObservedConversationId $ObservedTitle $ObservedUrl
            $traceHash=Get-VerifiedSyntheticProbeTrace $ProbeTraceJson $current.Snapshot
            $prior=@(Get-ChildItem -LiteralPath ([System.IO.Path]::Combine($binding.ReservedStatePath,'journal')) -Filter '*.json' | ForEach-Object {
                ConvertFrom-Json -InputObject ([System.IO.File]::ReadAllText($_.FullName)) -AsHashtable -Depth 40 -DateKind String
            } | Where-Object { $_.EVENT_KIND -ceq 'PROBE_INTENT' -and $_.RUN_ID -ceq $RunId })
            if ($prior.Count -ne 0) { throw 'BLOCKED: probe replay or duplicate' }
            $intent=Copy-JsonRecord $current.Snapshot
            $recorded=Commit-LocalRevision $binding $intent 'PROBE_INTENT' $RunId 1 "${RunId}:1" @("PHASE3_SYNTHETIC_PROBE_TRACE:$traceHash",'NO_BROWSER_TRAFFIC')
            if ($ProbeIntentOnly) {
                [pscustomobject]@{ Status='PROBE_UNCERTAIN'; IntentRevision=$recorded.Snapshot.REVISION; ExecutableAuthority=$false }
                break
            }
            $outcome=Copy-JsonRecord $recorded.Snapshot
            $completed=Commit-LocalRevision $binding $outcome 'PROBE_OUTCOME' $RunId 1 "${RunId}:1" @("PHASE3_SYNTHETIC_PROBE_VERIFIED:$traceHash",'NO_BROWSER_TRAFFIC')
            [pscustomobject]@{ Status=$completed.Status; IntentRevision=$recorded.Snapshot.REVISION; OutcomeRevision=$completed.Snapshot.REVISION; ExecutableAuthority=$false }
        }
    }
    RecordFixtureCommand {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current = Read-ReconciledContext $binding
            if ($current.Status -ne 'RECONCILED_NON_EXECUTING') { throw "BLOCKED: $($current.Status)" }
            Assert-FreshFixtureCommand $binding $current.Snapshot $RunId $RoundId $CommandId
            $bucketArguments = @($EvaluatorBucketKey,$EvaluatorStageKey,$EvaluatorPurposeKey,$MaterialEquivalenceReference)
            $budgeted = @($bucketArguments | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }).Count -gt 0
            if ($budgeted -and @($bucketArguments | Where-Object { [string]::IsNullOrWhiteSpace($_) }).Count -gt 0) {
                throw 'BLOCKED: a synthetic evaluator requires exact material bucket identity and review provenance'
            }
            if ($FixtureSameBlockerObserved -and $FixtureOutcome -cne 'FAILED') {
                throw 'BLOCKED: same-blocker recovery accounting requires a failed corrective observation'
            }
            if ($FixtureSameBlockerObserved) { Assert-BudgetExecutionAllowed $current.Snapshot 'RECOVERY_BUDGET' '' }
            $accepted = Copy-JsonRecord $current.Snapshot
            $accepted['LAST_ACCEPTED_COMMAND_ID']=$CommandId
            $accepted['LAST_RESULT_IDENTITY']=$null
            $accepted['EXECUTION_STATE']='ACCEPTED'
            $accepted['DELIVERY_STATE']='RESPONSE_COMPLETE'
            $accepted['OWNER_PID']=$PID
            if ($budgeted) {
                Assert-BudgetExecutionAllowed $current.Snapshot 'EVALUATOR_BUDGET' $EvaluatorBucketKey
                foreach ($identity in @($EvaluatorBucketKey,$EvaluatorStageKey,$EvaluatorPurposeKey)) {
                    if ($identity -cnotmatch '^[A-Z][A-Z0-9_-]*$' -or $identity -ceq 'NONE') { throw 'BLOCKED: invalid material evaluator identity' }
                }
                $samePurpose = @($accepted.EVALUATOR_BUDGET.BUCKETS | Where-Object {
                    $_.STAGE_KEY -ceq $EvaluatorStageKey -and $_.PURPOSE_KEY -ceq $EvaluatorPurposeKey
                })
                $matching = @($accepted.EVALUATOR_BUDGET.BUCKETS | Where-Object { $_.BUCKET_KEY -ceq $EvaluatorBucketKey })
                if ($matching.Count -gt 1 -or $samePurpose.Count -gt 1 -or
                    ($samePurpose.Count -eq 1 -and $samePurpose[0].BUCKET_KEY -cne $EvaluatorBucketKey)) {
                    throw 'BLOCKED: equivalent evaluator purpose cannot create another bucket'
                }
                if ($matching.Count -eq 1) {
                    $bucket = $matching[0]
                    if ($bucket.STAGE_KEY -cne $EvaluatorStageKey -or $bucket.PURPOSE_KEY -cne $EvaluatorPurposeKey -or
                        $bucket.MATERIAL_EQUIVALENCE_REFERENCE -cne $MaterialEquivalenceReference -or
                        $bucket.PENDING_COMMAND_ID -ne $null -or
                        [long]$bucket.EXECUTION_GENERATIONS_USED -ge [long]$bucket.APPROVED_MAXIMUM) {
                        throw 'BLOCKED: bucket provenance, pending state or execution maximum prevents dispatch'
                    }
                    $bucket['PENDING_COMMAND_ID']=$CommandId
                } else {
                    throw 'BLOCKED: evaluator bucket creation requires an independently consumed approved DISTINCT decision'
                }
            }
            $acceptedRevision = Commit-LocalRevision $binding $accepted 'COMMAND_ACCEPTED' $RunId $RoundId $CommandId @('PHASE2_SYNTHETIC_READ_ONLY_NOOP')
            if ($FixtureOutcome -ceq 'ACCEPTED_ONLY') {
                [pscustomobject]@{ Status='EXECUTION_UNCERTAIN'; AcceptedRevision=$acceptedRevision.Snapshot.REVISION; CommandId=$CommandId; ExecutableAuthority=$false }
                break
            }
            $executing = Copy-JsonRecord $acceptedRevision.Snapshot
            $executing['EXECUTION_STATE']='EXECUTING'
            $executingRevision = Commit-LocalRevision $binding $executing 'COMMAND_EXECUTING' $RunId $RoundId $CommandId @('PHASE2_SYNTHETIC_READ_ONLY_NOOP')
            if ($FixtureOutcome -ceq 'EXECUTING_ONLY') {
                [pscustomobject]@{ Status='EXECUTION_UNCERTAIN'; AcceptedRevision=$acceptedRevision.Snapshot.REVISION; ExecutingRevision=$executingRevision.Snapshot.REVISION; CommandId=$CommandId; ExecutableAuthority=$false }
                break
            }
            # This is a local, read-only synthetic evaluator execution. There is no browser or Product side effect.
            $outcomeEvidence = @('PHASE2_SYNTHETIC_READ_ONLY_NOOP_OUTCOME')
            if ($budgeted) {
                $inputBytes=[System.Text.Encoding]::UTF8.GetBytes("$($binding.ExecutionContextId)|$CommandId|$EvaluatorBucketKey")
                $actualDigest=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($inputBytes)).ToLowerInvariant()
                $expectedDigest=if ($FixtureOutcome -ceq 'FAILED') { '0' * 64 } else { $actualDigest }
                $outcomeEvidence += "SYNTHETIC_EVALUATOR_EXECUTED:$actualDigest"
                $outcomeEvidence += "SYNTHETIC_EVALUATOR_EXPECTED:$expectedDigest"
                if ($FixtureOutcome -ceq 'FAILED' -and $actualDigest -ceq $expectedDigest) { throw 'BLOCKED: synthetic failed evaluator assertion did not fail' }
            }
            if ($FixtureSameBlockerObserved) { $outcomeEvidence += 'SYNTHETIC_FAILED_CORRECTION_SAME_BLOCKER' }
            $outcome = Copy-JsonRecord $executingRevision.Snapshot
            $outcome['EXECUTION_STATE']=if ($FixtureOutcome -ceq 'COMPLETE') { 'COMPLETED' } else { 'FAILED' }
            $outcomeRevision = Commit-LocalRevision $binding $outcome 'COMMAND_OUTCOME' $RunId $RoundId $CommandId $outcomeEvidence $budgeted ([bool]$FixtureSameBlockerObserved)
            [pscustomobject]@{
                Status=$outcomeRevision.Status; AcceptedRevision=$acceptedRevision.Snapshot.REVISION
                ExecutingRevision=$executingRevision.Snapshot.REVISION; OutcomeRevision=$outcomeRevision.Snapshot.REVISION
                CommandId=$CommandId; ExecutionState=$outcomeRevision.Snapshot.EXECUTION_STATE; ExecutableAuthority=$false
            }
        }
    }
    MarkFixtureDelivery {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current = Read-ReconciledContext $binding
            if ($current.Snapshot.LAST_ACCEPTED_COMMAND_ID -cne $CommandId -or
                $CommandId -cne "${RunId}:$RoundId" -or $RunId -cne $current.Snapshot.ACTIVE_RUN_ID -or
                $current.Snapshot.EXECUTION_STATE -cnotin @('COMPLETED','FAILED')) {
                throw 'BLOCKED: delivery identity has no attributable durable outcome'
            }
            if ($current.Snapshot.DELIVERY_STATE -ceq 'DELIVERY_UNCERTAIN') { throw 'BLOCKED: delivery already uncertain; no resend' }
            $next = Copy-JsonRecord $current.Snapshot
            $next['DELIVERY_STATE']='DELIVERY_UNCERTAIN'
            $syntheticResult=[System.Text.Encoding]::UTF8.GetBytes("PHASE2_SYNTHETIC_RESULT|$CommandId")
            $next['LAST_RESULT_IDENTITY']=[ordered]@{
                RUN_ID=$RunId; ROUND_ID=$RoundId; COMMAND_ID=$CommandId
                CAUSAL_LINEAGE_ID=$next.CAUSAL_LINEAGE_ID; STAGE='PHASE2_SYNTHETIC'
                RESULT_HASH=[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($syntheticResult)).ToLowerInvariant()
            }
            $committed=Commit-LocalRevision $binding $next 'RESULT_DELIVERY' $RunId $RoundId $CommandId @('PHASE2_SYNTHETIC_RESULT_DELIVERY_UNKNOWN')
            [pscustomobject]@{ Status=$committed.Status; CommandId=$CommandId; ExecutionState=$committed.Snapshot.EXECUTION_STATE; DeliveryState=$committed.Snapshot.DELIVERY_STATE; ExecutableAuthority=$false }
        }
    }
    PersistFixtureHandoff {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            if ($HandoffId -cnotmatch '^FED-QA-HANDOFF-[A-Z0-9_-]{3,60}$' -or
                $NewRunId -cnotmatch '^FED-QA-[A-Z0-9_-]{3,60}-RUN-[0-9]+$') { throw 'BLOCKED: exact fresh synthetic handoff/run IDs required' }
            $current=Read-ReconciledContext $binding
            if ($current.Status -ne 'RECONCILED_NON_EXECUTING' -or
                $current.Snapshot.STATE -cnotin @('TERMINAL','REVOKED') -or
                $current.Snapshot.EXECUTION_STATE -cin @('ACCEPTED','EXECUTING','EXECUTION_UNCERTAIN') -or
                $current.Snapshot.DELIVERY_STATE -cin @('SENDING','SENT_WAITING_RESPONSE','RESPONSE_GENERATING','DELIVERY_UNCERTAIN')) {
                throw 'BLOCKED: source is not terminal with certain outcome and delivery'
            }
            if ($NewRunId -cin @($current.Snapshot.RUN_BINDING | ForEach-Object { $_.RUN_ID })) { throw 'BLOCKED: target RUN_ID was used before' }
            $handoffsRoot=[System.IO.Path]::Combine($binding.ReservedStatePath,'handoffs')
            $handoffDirectory=[System.IO.Path]::Combine($handoffsRoot,$HandoffId)
            if ([System.IO.Directory]::Exists($handoffDirectory)) { throw 'BLOCKED: HANDOFF_ID already exists' }
            $oldRun=@($current.Snapshot.RUN_BINDING | Where-Object { $_.STATE -cin @('REVOKED','TERMINAL') } | Select-Object -Last 1)
            if ($oldRun.Count -ne 1) { throw 'BLOCKED: exact terminal source run missing' }
            $source=[ordered]@{
                TOWER_ID=$current.Snapshot.TOWER_ID; CONTROL_TOWER_ROLE=$current.Snapshot.CONTROL_TOWER_ROLE
                CONTROL_TOWER_SCOPE=$current.Snapshot.CONTROL_TOWER_SCOPE; OWNING_PAGE_CHAT_ID=$current.Snapshot.OWNING_PAGE_CHAT_ID
                PROJECT_ID=$current.Snapshot.PROJECT_ID; CONTROL_TOWER_INSTANCE=$current.Snapshot.CONTROL_TOWER_INSTANCE
                CONVERSATION_ID=$current.Snapshot.CONVERSATION_ID; CONVERSATION_TITLE=$current.Snapshot.CONVERSATION_TITLE
            }
            $target=Get-SyntheticTarget $TargetRole $TargetScope $TargetOwningPageChatId $TargetProjectId $TargetConversationId $TargetTitle
            if ($target.PROJECT_ID -ceq $source.PROJECT_ID -and $target.CONVERSATION_ID -ceq $source.CONVERSATION_ID) {
                throw 'BLOCKED: transfer requires a distinct exact target conversation'
            }
            if ($source.CONTROL_TOWER_ROLE -ceq 'PAGE_CONTROL_TOWER') {
                if ($target.CONTROL_TOWER_ROLE -ceq 'PAGE_CONTROL_TOWER') {
                    if ($target.OWNING_PAGE_CHAT_ID -cne $source.OWNING_PAGE_CHAT_ID -or $target.CONTROL_TOWER_SCOPE -cne 'PAGE_LOCAL') {
                        throw 'BLOCKED: Page rotation cannot change owning Page Chat'
                    }
                } elseif ($target.CONTROL_TOWER_ROLE -cne 'GLOBAL_CONTROL_TOWER' -or
                    $target.CONTROL_TOWER_SCOPE -cnotin @('CROSS_MODULE','UNCERTAIN')) {
                    throw 'BLOCKED: Page escalation requires reviewed CROSS_MODULE or UNCERTAIN target'
                }
            } elseif ($source.CONTROL_TOWER_ROLE -ceq 'GLOBAL_CONTROL_TOWER') {
                if ($target.CONTROL_TOWER_ROLE -cne 'GLOBAL_CONTROL_TOWER' -or
                    $target.CONTROL_TOWER_SCOPE -cne $source.CONTROL_TOWER_SCOPE) {
                    throw 'BLOCKED: Global rotation cannot change role or scope'
                }
            } else { throw 'BLOCKED: unsupported source tower role' }
            $pageOwner=if ($source.CONTROL_TOWER_ROLE -ceq 'PAGE_CONTROL_TOWER') { [string]$source.OWNING_PAGE_CHAT_ID } else { 'NONE' }
            $productProvenance=Get-PageContextProvenance $pageOwner $PageContextIntake $PageContextSourceReference $PageContextCompleteness $PageContextGaps
            $reserved=Copy-JsonRecord $current.Snapshot
            $reserved['RUN_BINDING']=@($reserved.RUN_BINDING)+@([ordered]@{
                RUN_ID=$NewRunId; ACTIVATION_EPOCH=([long]$reserved.ACTIVATION_EPOCH+1); TOWER_ID=$target.TOWER_ID
                CONTROL_TOWER_INSTANCE=$target.CONTROL_TOWER_INSTANCE; PROJECT_ID=$target.PROJECT_ID
                CONVERSATION_ID=$target.CONVERSATION_ID; STATE='RESERVED'
            })
            $reservation=Commit-LocalRevision $binding $reserved 'RUN_RESERVED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("TARGET_RUN_ID:$NewRunId")
            $lastCommand=[string]$reservation.Snapshot.LAST_ACCEPTED_COMMAND_ID
            $sourceRound=0
            if ($lastCommand -match ':(\d+)$') { $sourceRound=[int]$Matches[1] }
            $handoff=[ordered]@{
                HANDOFF_VERSION=1; HANDOFF_ID=$HandoffId; EXECUTION_CONTEXT_ID=$binding.ExecutionContextId
                CREATED_AT_UTC=[DateTime]::UtcNow.ToString('o'); SOURCE_ACTIVATION_EPOCH=$reservation.Snapshot.ACTIVATION_EPOCH
                TARGET_ACTIVATION_EPOCH=([long]$reservation.Snapshot.ACTIVATION_EPOCH+1)
                SOURCE_RECORD_HASH=$reservation.Snapshot.RECORD_HASH; HANDOFF_HASH=('0' * 64)
                SOURCE_TOWER=$source; TARGET_TOWER=$target; SOURCE_RUN_ID=$oldRun[0].RUN_ID
                SOURCE_ROUND_ID=$sourceRound; SOURCE_COMMAND_ID=$(if ($lastCommand) { $lastCommand } else { 'NOT_APPLICABLE' })
                TARGET_RUN_ID=$NewRunId; CAUSAL_LINEAGE_ID=$reservation.Snapshot.CAUSAL_LINEAGE_ID
                WORKFLOW_STATE=[ordered]@{ CHANGE='federated-control-towers-foundation'; STAGE='PHASE3_SYNTHETIC_FIXTURE'; GATE_STATUS='NO_LIVE_AUTHORITY'; SOURCE_REFERENCE='APPROVED_PHASE3_T12' }
                DELIVERY_STATE=$reservation.Snapshot.DELIVERY_STATE; EXECUTION_STATE=$reservation.Snapshot.EXECUTION_STATE
                EVIDENCE_STOP_STATE=$reservation.Snapshot.EVIDENCE_STOP_STATE
                RECOVERY_BUDGET=$reservation.Snapshot.RECOVERY_BUDGET; EVALUATOR_BUDGET=$reservation.Snapshot.EVALUATOR_BUDGET
                CURRENT_ACTIVE_FREEZES=$reservation.Snapshot.CURRENT_ACTIVE_FREEZES
                CONSUMED_AUTHORITY_PROOFS=$reservation.Snapshot.CONSUMED_AUTHORITY_PROOFS
                APPROVAL_REFERENCES=$reservation.Snapshot.APPROVAL_REFERENCES; ARTIFACT_HASHES=$reservation.Snapshot.ARTIFACT_HASHES
                EVIDENCE_REFERENCES=@('PHASE3_SYNTHETIC_NO_LIVE_AUTHORITY')
                PRODUCT_PROVENANCE=$productProvenance
                BLOCKERS=$reservation.Snapshot.BLOCKERS; KNOWN_LIMITATIONS=$reservation.Snapshot.KNOWN_LIMITATIONS
                NEXT_CANDIDATE_ACTION=[ordered]@{ DESCRIPTION='No action without independent authorization'; EXPECTED_AUTHORITY_SOURCE='Human/workflow'; AUTHORIZATION_STATUS='PENDING' }
            }
            $handoffText=Set-InMemoryHash $handoff 'HANDOFF_HASH'
            $check=Test-Record $handoffText Handoff $binding.ExecutionContextId $binding.CheckoutRoot $binding.HostLabel
            if (-not $check.Valid) { throw "BLOCKED: handoff validation failed: $($check.Errors -join ', ')" }
            if (-not [System.IO.Directory]::Exists($handoffsRoot)) { [void][System.IO.Directory]::CreateDirectory($handoffsRoot) }
            [void][System.IO.Directory]::CreateDirectory($handoffDirectory)
            Assert-PlainPath $handoffsRoot
            Assert-PlainPath $handoffDirectory
            $final=[System.IO.Path]::Combine($handoffDirectory,'handoff.json')
            $temp="$final.tmp-$([Guid]::NewGuid().ToString('N'))"
            Write-DurableNewFile $temp $handoffText
            [System.IO.File]::Move($temp,$final)
            $validated=Get-FixtureHandoff $binding $HandoffId
            if ($validated.HANDOFF_HASH -cne $handoff.HANDOFF_HASH) { throw 'BLOCKED: handoff read-back hash mismatch' }
            $post=Copy-JsonRecord $reservation.Snapshot
            $persisted=Commit-LocalRevision $binding $post 'HANDOFF_PERSISTED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("HANDOFF_ID:$HandoffId","HANDOFF_HASH:$($validated.HANDOFF_HASH)")
            [pscustomobject]@{ Status=$persisted.Status; HandoffId=$HandoffId; HandoffHash=$validated.HANDOFF_HASH; ReservedRunId=$NewRunId; SourceRecordHash=$handoff.SOURCE_RECORD_HASH; ExecutableAuthority=$false }
        }
    }
    SupersedeFixtureHandoff {
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current=Read-ReconciledContext $binding
            $handoff=Get-FixtureHandoff $binding $HandoffId
            Assert-HandoffSourceAndStatus $binding $handoff $current.Snapshot
            if ($current.Snapshot.STATE -cnotin @('TERMINAL','REVOKED')) { throw 'BLOCKED: only terminal handoff may be superseded' }
            $next=Copy-JsonRecord $current.Snapshot
            $committed=Commit-LocalRevision $binding $next 'HANDOFF_SUPERSEDED' 'NOT_APPLICABLE' $null 'NOT_APPLICABLE' @("HANDOFF_ID:$HandoffId")
            [pscustomobject]@{ Status=$committed.Status; HandoffId=$HandoffId; ExecutableAuthority=$false }
        }
    }
    ReconcileFixture {
        $existingPath=Get-ApprovedContextPath $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId $false
        if (-not [System.IO.Directory]::Exists($existingPath.ReservedStatePath)) {
            throw 'BLOCKED: missing execution context cannot be reconciled as fresh state'
        }
        Invoke-ExclusiveLocalLock $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId {
            param($binding)
            $current = Read-ReconciledContext $binding
            [pscustomobject]@{ Status=$current.Status; Revision=$current.Snapshot.REVISION; RecordHash=$current.Snapshot.RECORD_HASH; ExecutableAuthority=$false }
        }
    }
    ValidateActivation {
        if (-not $ExecutionContextId -or -not $ExpectedCheckoutRoot -or -not $ExpectedHostLabel) { throw 'Activation validation requires exact context, checkout and host binding' }
        Test-Record $Json Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
    }
    ValidateJournal {
        if (-not $ExecutionContextId) { throw 'Journal validation requires exact context binding' }
        Test-Record $Json Journal $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
    }
    ValidateHandoff {
        if (-not $ExecutionContextId) { throw 'Handoff validation requires exact context binding' }
        Test-Record $Json Handoff $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
    }
    SelfTest {
        if (-not $ExecutionContextId -or -not $ExpectedCheckoutRoot -or -not $ExpectedHostLabel) { throw 'SelfTest requires exact context, checkout and host binding' }
        $checks = [System.Collections.Generic.List[object]]::new()
        $valid = Get-Preflight $ExpectedCheckoutRoot $ExpectedHostLabel $ExecutionContextId
        $checks.Add([pscustomobject]@{ Case = 'supported-preflight'; Passed = $valid.Valid })
        $badHost = Get-Preflight $ExpectedCheckoutRoot 'WRONG_HOST' $ExecutionContextId
        $checks.Add([pscustomobject]@{ Case = 'wrong-host'; Passed = (-not $badHost.Valid -and 'Host label mismatch' -in $badHost.Errors) })
        $badRoot = Get-Preflight 'C:\wrong-checkout' $ExpectedHostLabel $ExecutionContextId
        $checks.Add([pscustomobject]@{ Case = 'wrong-checkout'; Passed = (-not $badRoot.Valid) })
        $malformed = Test-Record '{' Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'malformed-json'; Passed = (-not $malformed.Valid) })
        $duplicate = Test-Record '{"SCHEMA_VERSION":1,"SCHEMA_VERSION":1}' Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'duplicate-field'; Passed = (-not $duplicate.Valid -and ($duplicate.Errors -match 'duplicated').Count -gt 0) })
        $missing = Test-Record '{"SCHEMA_VERSION":1}' Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'missing-field'; Passed = (-not $missing.Valid -and ($missing.Errors -match 'missing').Count -gt 0) })
        $unknown = Test-Record '{"SCHEMA_VERSION":1,"UNREVIEWED_FIELD":1}' Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'unknown-field'; Passed = (-not $unknown.Valid -and ($unknown.Errors -match 'unknown').Count -gt 0) })
        $secret = Test-Record '{"SCHEMA_VERSION":1,"SESSION_TOKEN":"x"}' Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'secret-field'; Passed = (-not $secret.Valid -and ($secret.Errors -match 'forbidden').Count -gt 0) })
        $transcript = Test-Record '{"SCHEMA_VERSION":1,"TRANSCRIPT":"text"}' Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'transcript-field'; Passed = (-not $transcript.Valid -and ($transcript.Errors -match 'forbidden').Count -gt 0) })
        $activationFixture = New-ActivationFixture $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $activationJson = Set-InMemoryHash $activationFixture 'RECORD_HASH'
        $activation = Test-Record $activationJson Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'valid-activation-genesis'; Passed = $activation.Valid; Errors = $activation.Errors })
        $activationFixture['RECORD_HASH'] = '0' * 64
        $badHash = Test-Record (ConvertTo-Json -InputObject $activationFixture -Depth 30 -Compress) Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'activation-hash-mismatch'; Passed = (-not $badHash.Valid -and ($badHash.Errors -match 'SHA-256').Count -gt 0) })
        $activationFixture['STATE'] = 'ACTIVE'
        $activeWithoutTarget = Test-Record (Set-InMemoryHash $activationFixture 'RECORD_HASH') Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'inconsistent-active-state'; Passed = (-not $activeWithoutTarget.Valid -and ($activeWithoutTarget.Errors -match 'selected target').Count -gt 0) })
        $activationFixture['STATE'] = 'INACTIVE'
        $activationFixture['HOST_LABEL'] = 'WRONG_HOST'
        $hostMismatch = Test-Record (Set-InMemoryHash $activationFixture 'RECORD_HASH') Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'record-host-mismatch'; Passed = (-not $hostMismatch.Valid -and 'Host mismatch' -in $hostMismatch.Errors) })
        $activationFixture['HOST_LABEL'] = $ExpectedHostLabel
        $activationFixture['CHECKOUT_ROOT'] = 'C:\wrong-checkout'
        $checkoutMismatch = Test-Record (Set-InMemoryHash $activationFixture 'RECORD_HASH') Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'record-checkout-mismatch'; Passed = (-not $checkoutMismatch.Valid -and 'Checkout mismatch' -in $checkoutMismatch.Errors) })
        $handoffFixture = New-HandoffFixture $ExecutionContextId
        $handoff = Test-Record (Set-InMemoryHash $handoffFixture 'HANDOFF_HASH') Handoff $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'valid-handoff-schema'; Passed = $handoff.Valid; Errors = $handoff.Errors })
        $handoffFixture['TARGET_RUN_ID'] = 'RUN1'
        $reusedRun = Test-Record (Set-InMemoryHash $handoffFixture 'HANDOFF_HASH') Handoff $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'handoff-reused-run'; Passed = (-not $reusedRun.Valid -and ($reusedRun.Errors -match 'not fresh').Count -gt 0) })
        $handoffFixture['TARGET_RUN_ID'] = 'RUN2'
        $handoffFixture['TARGET_ACTIVATION_EPOCH'] = 5
        $badEpoch = Test-Record (Set-InMemoryHash $handoffFixture 'HANDOFF_HASH') Handoff $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'handoff-epoch-mismatch'; Passed = (-not $badEpoch.Valid -and ($badEpoch.Errors -match 'epoch mismatch').Count -gt 0) })
        $handoffFixture['TARGET_ACTIVATION_EPOCH'] = 3
        $handoffFixture['NEXT_CANDIDATE_ACTION']['AUTHORIZATION_STATUS'] = 'APPROVED'
        $selfApproval = Test-Record (Set-InMemoryHash $handoffFixture 'HANDOFF_HASH') Handoff $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'handoff-self-approval'; Passed = (-not $selfApproval.Valid -and ($selfApproval.Errors -match 'cannot grant').Count -gt 0) })
        $journalFixture = New-JournalFixture $ExecutionContextId
        $journal = Test-Record (Set-InMemoryHash $journalFixture 'EVENT_HASH') Journal $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'valid-journal-schema'; Passed = $journal.Valid; Errors = $journal.Errors })
        $journalFixture['EVENT_HASH'] = '0' * 64
        $journalBadHash = Test-Record (ConvertTo-Json -InputObject $journalFixture -Depth 30 -Compress) Journal $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'journal-hash-mismatch'; Passed = (-not $journalBadHash.Valid -and ($journalBadHash.Errors -match 'SHA-256').Count -gt 0) })
        $journalFixture['EVENT_KIND'] = 'UNKNOWN_EVENT'
        $journalUnknownEvent = Test-Record (Set-InMemoryHash $journalFixture 'EVENT_HASH') Journal $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'unknown-journal-event'; Passed = (-not $journalUnknownEvent.Valid -and ($journalUnknownEvent.Errors -match 'event kind').Count -gt 0) })
        $handoffFixture['NEXT_CANDIDATE_ACTION']['AUTHORIZATION_STATUS'] = 'PENDING'
        $handoffFixture['HANDOFF_HASH'] = '0' * 64
        $handoffBadHash = Test-Record (ConvertTo-Json -InputObject $handoffFixture -Depth 30 -Compress) Handoff $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'handoff-hash-mismatch'; Passed = (-not $handoffBadHash.Valid -and ($handoffBadHash.Errors -match 'SHA-256').Count -gt 0) })
        $nestedDuplicate = Test-Record '{"RECOVERY_BUDGET":{"ATTEMPTS_USED":0,"ATTEMPTS_USED":1}}' Activation $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'nested-duplicate-field'; Passed = (-not $nestedDuplicate.Valid -and ($nestedDuplicate.Errors -match 'duplicated').Count -gt 0) })
        $nestedSecret = Test-Record '{"PRODUCT_PROVENANCE":{"TOKEN":"x"}}' Handoff $ExecutionContextId $ExpectedCheckoutRoot $ExpectedHostLabel
        $checks.Add([pscustomobject]@{ Case = 'nested-secret-field'; Passed = (-not $nestedSecret.Valid -and ($nestedSecret.Errors -match 'forbidden').Count -gt 0) })
        foreach ($authorityCheck in (Invoke-AuthoritySelfTest $ExpectedCheckoutRoot $ExpectedHostLabel)) { $checks.Add($authorityCheck) }
        $summary = @($checks.ToArray())
        [pscustomobject]@{
            Passed = (@($summary | Where-Object Passed).Count -eq $summary.Count); Count = $summary.Count; Checks = $summary
            CanonicalRuntimeStateCreated = $false; LiveTowerActivated = $false
            SyntheticExternalTempStateCreatedAndRemoved = $true; SyntheticExternalTempLockAcquiredAndReleased = $true
        }
    }
}
