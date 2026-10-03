import { useCallback, useRef, useState } from 'react';
import { recordEmployeeDossierViewAction } from '../actions';

export const employeeDossierAccessFailureMessage =
  'La traçabilité du dossier est indisponible. Réessayez.';

/**
 * Records one audited dossier view per call with a fresh operation
 * identifier. Only the latest request may report its outcome, so a late
 * failure of a previous employee or attempt never reaches the current one.
 */
export function useEmployeeDossierAccess() {
  const [dossierAccessError, setDossierAccessError] = useState<string | null>(
    null,
  );
  const latestOperationIdRef = useRef('');

  const recordDossierAccess = useCallback((employeeId: string) => {
    const operationId = crypto.randomUUID();
    latestOperationIdRef.current = operationId;
    setDossierAccessError(null);
    void recordEmployeeDossierViewAction(employeeId, operationId)
      .then((result) => (result.status === 'error' ? result.message : null))
      .catch(() => employeeDossierAccessFailureMessage)
      .then((message) => {
        if (latestOperationIdRef.current === operationId) {
          setDossierAccessError(message);
        }
      });
  }, []);

  return { dossierAccessError, recordDossierAccess };
}
