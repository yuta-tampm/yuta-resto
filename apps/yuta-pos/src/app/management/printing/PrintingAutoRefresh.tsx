'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const refreshIntervalMs = 5_000;

export function PrintingAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
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
  }, [router]);

  return null;
}
