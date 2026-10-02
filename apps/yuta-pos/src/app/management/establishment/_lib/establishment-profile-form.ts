import { updateLocalEstablishmentProfileInputSchema } from '@yuta/contracts/local-pos';

export function getEstablishmentProfileFormState(input: {
  baseline: string;
  draft: string;
  revision: number;
}) {
  const validation = updateLocalEstablishmentProfileInputSchema.safeParse({
    displayName: input.draft,
    revision: input.revision,
  });
  return {
    isDirty: input.draft !== input.baseline,
    isValid: validation.success,
  };
}
