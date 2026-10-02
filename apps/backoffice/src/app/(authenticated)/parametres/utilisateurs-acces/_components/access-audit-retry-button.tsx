'use client';

import { Button } from '@yuta/ui';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AccessAuditRetryButton() {
  const router = useRouter();
  return (
    <Button type="button" variant="secondary" onClick={() => router.refresh()}>
      <RefreshCw className="h-4 w-4" />
      Réessayer
    </Button>
  );
}
