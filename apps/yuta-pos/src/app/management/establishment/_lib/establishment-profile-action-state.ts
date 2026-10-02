import type { LocalEstablishmentProfile } from '@yuta/contracts/local-pos';

export type EstablishmentProfileActionState = {
  status: 'idle' | 'success' | 'error' | 'conflict';
  message: string | null;
  fieldError: string | null;
  profile: LocalEstablishmentProfile | null;
};

export const initialEstablishmentProfileActionState: EstablishmentProfileActionState =
  {
    status: 'idle',
    message: null,
    fieldError: null,
    profile: null,
  };
