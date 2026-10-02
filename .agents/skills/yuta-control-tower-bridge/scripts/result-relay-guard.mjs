/**
 * A decision aid for identities observed in the selected browser conversation.
 * It does not observe the browser, submit messages, or establish provenance.
 */
export function classifyResultRelay({
  expected,
  observedResults,
  historyComplete,
}) {
  if (!historyComplete || !Array.isArray(observedResults)) {
    return { status: 'BLOCKED_UNCERTAIN_HISTORY', matchingCount: null };
  }

  const matching = observedResults.filter(
    (result) =>
      result.type === 'YUTA_CODEX_RESULT' &&
      (result.commandId === expected.commandId ||
        (result.runId === expected.runId &&
          result.roundId === expected.roundId)),
  );

  if (matching.length > 1) {
    return { status: 'DUPLICATE_RESULT_RELAY', matchingCount: matching.length };
  }
  if (matching.length === 1) {
    return { status: 'RESULT_ALREADY_POSTED', matchingCount: 1 };
  }
  return { status: 'NO_MATCHING_POSTED_RESULT', matchingCount: 0 };
}

export function maySubmitResult({
  expected,
  observedResults,
  historyComplete,
  deliveryState,
  sendActivated,
}) {
  const observation = classifyResultRelay({
    expected,
    observedResults,
    historyComplete,
  });
  return {
    allowed:
      observation.status === 'NO_MATCHING_POSTED_RESULT' &&
      deliveryState === 'NOT_SENT' &&
      sendActivated === false,
    observation,
  };
}
