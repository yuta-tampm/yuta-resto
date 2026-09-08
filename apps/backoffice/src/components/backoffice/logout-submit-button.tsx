'use client';

import { IconButton } from '@yuta/ui';
import { LoaderCircle, LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function LogoutSubmitButton() {
  const { pending } = useFormStatus();
  const accessibleLabel = pending ? 'Déconnexion en cours…' : 'Se déconnecter';

  return (
    <IconButton
      type="submit"
      variant="ghost"
      size="sm"
      disabled={pending}
      aria-busy={pending}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <LogOut className="h-4 w-4" aria-hidden />
      )}
    </IconButton>
  );
}
