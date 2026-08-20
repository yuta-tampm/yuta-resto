'use client';

import { Button } from '@yuta/ui';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function ReportsRefreshButton({
  label = 'Actualiser',
}: {
  label?: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <Button
      type="button"
      variant="secondary"
      className="min-h-11"
      disabled={pending}
      loading={pending}
      onClick={() => {
        setPending(true);
        window.location.reload();
      }}
      aria-live="polite"
    >
      <RefreshCw className={`h-4 w-4 ${pending ? 'animate-spin' : ''}`} />
      {pending ? 'Actualisation…' : label}
    </Button>
  );
}
