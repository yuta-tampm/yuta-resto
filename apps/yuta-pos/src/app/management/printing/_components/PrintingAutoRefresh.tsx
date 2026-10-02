'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePosStandby } from '../../../../components/pos/PosStandbyProvider';

const refreshIntervalMs = 5_000;

export function PrintingAutoRefresh() {
  const router = useRouter();
  const { automaticRefreshAllowed } = usePosStandby();

  useEffect(() => {
    if (!automaticRefreshAllowed) return;
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') {
        router.refresh();
      }
    };

    const intervalId = window.setInterval(refreshIfVisible, refreshIntervalMs);
    document.addEventListener('visibilitychange', refreshIfVisible);
    window.addEventListener('focus', refreshIfVisible);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshIfVisible);
      window.removeEventListener('focus', refreshIfVisible);
    };
  }, [automaticRefreshAllowed, router]);

  return null;
}
