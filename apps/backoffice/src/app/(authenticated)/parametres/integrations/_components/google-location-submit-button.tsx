'use client';

import { Button } from '@yuta/ui';
import { useFormStatus } from 'react-dom';

export function GoogleLocationSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" loading={pending}>
      {pending ? 'Sélection en cours…' : 'Sélectionner'}
    </Button>
  );
}
