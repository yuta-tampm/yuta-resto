export function getPostSaveHistoryOperationId(
  historyIsActive: boolean,
  createOperationId: () => string,
): string {
  return historyIsActive ? createOperationId() : '';
}

export type EmployeeEditSurface = 'drawer' | 'full_dossier';

export function getEmployeeEditCommitRefreshPlan(
  surface: EmployeeEditSurface,
  historyIsActive: boolean,
  createOperationId: () => string,
) {
  return {
    surface,
    closeEditor: true,
    resetHistory: true,
    historyOperationId: getPostSaveHistoryOperationId(
      historyIsActive,
      createOperationId,
    ),
  } as const;
}

export function restoreEmployeeEditFocus(
  origin: { isConnected: boolean; focus(): void } | null,
  schedule: (callback: () => void) => void,
) {
  schedule(() => {
    if (origin?.isConnected) origin.focus();
  });
}
