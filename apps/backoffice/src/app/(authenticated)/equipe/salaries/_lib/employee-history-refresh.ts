export function getPostSaveHistoryOperationId(
  historyIsActive: boolean,
  createOperationId: () => string,
): string {
  return historyIsActive ? createOperationId() : '';
}
