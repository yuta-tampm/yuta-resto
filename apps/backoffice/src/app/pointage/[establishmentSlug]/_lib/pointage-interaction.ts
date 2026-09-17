import type {
  PointageCommittedReceiptResponse,
  PointageEmployeeStateResponse,
  PointageFailureResponse,
} from '@yuta/contracts';

export type PointageVisibleEmployee = Omit<
  PointageEmployeeStateResponse,
  'stateGuard'
>;
export type PointageVisibleReceipt = Omit<
  PointageCommittedReceiptResponse,
  'requestId' | 'result'
>;
export type PointageVisibleFailure =
  | PointageFailureResponse['code']
  | 'RESULT_UNKNOWN';

export type PointagePresentation =
  | { phase: 'CREDENTIAL_ENTRY' | 'NEUTRAL'; pin: string }
  | { phase: 'IDENTIFY_PENDING'; pin: string }
  | { phase: 'ACTIVE'; employee: PointageVisibleEmployee }
  | { phase: 'MUTATION_PENDING' }
  | { phase: 'RECOVERY_PENDING' | 'STATE_REFRESH_PENDING' }
  | { phase: 'RECEIPT'; receipt: PointageVisibleReceipt }
  | {
      phase: 'FAILURE';
      code: PointageVisibleFailure;
      action?: 'recover' | 'refresh';
    };

type Event =
  | { type: 'PIN'; pin: string }
  | { type: 'IDENTIFY' }
  | { type: 'IDENTIFIED'; employee: PointageVisibleEmployee }
  | { type: 'MUTATE' }
  | { type: 'RECOVER' }
  | { type: 'REFRESH' }
  | { type: 'COMMITTED'; receipt: PointageVisibleReceipt }
  | {
      type: 'FAILED';
      code: PointageVisibleFailure;
      action?: 'recover' | 'refresh';
    }
  | { type: 'END' };

export const initialPointagePresentation: PointagePresentation = {
  phase: 'CREDENTIAL_ENTRY',
  pin: '',
};

// Presentation transitions only: no local attendance reconstruction or success.
export function reducePointagePresentation(
  state: PointagePresentation,
  event: Event,
): PointagePresentation {
  switch (event.type) {
    case 'PIN':
      return state.phase === 'CREDENTIAL_ENTRY' || state.phase === 'NEUTRAL'
        ? { ...state, pin: event.pin }
        : state;
    case 'IDENTIFY':
      return (state.phase === 'CREDENTIAL_ENTRY' ||
        state.phase === 'NEUTRAL') &&
        /^[0-9]{8}$/u.test(state.pin)
        ? { phase: 'IDENTIFY_PENDING', pin: state.pin }
        : state;
    case 'IDENTIFIED':
      return state.phase === 'IDENTIFY_PENDING' ||
        state.phase === 'STATE_REFRESH_PENDING'
        ? { phase: 'ACTIVE', employee: event.employee }
        : state;
    case 'MUTATE':
      return state.phase === 'ACTIVE' ? { phase: 'MUTATION_PENDING' } : state;
    case 'RECOVER':
      return state.phase === 'FAILURE' && state.action === 'recover'
        ? { phase: 'RECOVERY_PENDING' }
        : state;
    case 'REFRESH':
      return state.phase === 'FAILURE' && state.action === 'refresh'
        ? { phase: 'STATE_REFRESH_PENDING' }
        : state;
    case 'COMMITTED':
      return state.phase === 'MUTATION_PENDING' ||
        state.phase === 'RECOVERY_PENDING'
        ? { phase: 'RECEIPT', receipt: event.receipt }
        : state;
    case 'FAILED':
      return state.phase === 'IDENTIFY_PENDING' ||
        state.phase === 'MUTATION_PENDING' ||
        state.phase === 'RECOVERY_PENDING' ||
        state.phase === 'STATE_REFRESH_PENDING'
        ? {
            phase: 'FAILURE',
            code: event.code,
            ...(event.action ? { action: event.action } : {}),
          }
        : state;
    case 'END':
      return { phase: 'NEUTRAL', pin: '' };
  }
}

export const pointageFailureCopy: Record<PointageVisibleFailure, string> = {
  POINTAGE_ACCESS_DENIED:
    'Accès au pointage impossible. Veuillez vous identifier à nouveau.',
  POINTAGE_TRY_LATER: 'Trop de tentatives. Réessayez plus tard.',
  POINTAGE_STATE_CONFLICT:
    'La situation a changé. Actualisez avant de réessayer.',
  POINTAGE_REQUEST_CONFLICT: 'Cette demande ne peut pas être réutilisée.',
  POINTAGE_REQUEST_INVALID:
    'Accès au pointage impossible. Veuillez vous identifier à nouveau.',
  POINTAGE_UNAVAILABLE:
    'Pointage indisponible. Aucun résultat ne peut être confirmé.',
  RESULT_UNKNOWN: 'Résultat non confirmé. Vérifiez cette même demande.',
};

// Historical presentation uses the stored offset, never current tzdb or the
// browser timezone. Preserve six fractional digits and second-sized offsets.
export function pointageCalendarLabel(
  instant: string,
  snapshot: {
    businessDate: string;
    timezoneName: string;
    utcOffsetSeconds: number;
  },
) {
  const wall = new Date(
    Date.parse(instant) + snapshot.utcOffsetSeconds * 1_000,
  ).toISOString();
  const [year, month, day] = snapshot.businessDate.split('-');
  const absolute = Math.abs(snapshot.utcOffsetSeconds);
  const pad = (value: number) => String(value).padStart(2, '0');
  const offset = `${snapshot.utcOffsetSeconds < 0 ? '-' : '+'}${pad(Math.floor(absolute / 3_600))}:${pad(Math.floor((absolute % 3_600) / 60))}:${pad(absolute % 60)}`;
  return `${day}/${month}/${year} à ${wall.slice(11, 19)}.${instant.slice(20, 26)} (${snapshot.timezoneName}, UTC${offset})`;
}
