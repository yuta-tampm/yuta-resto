import { Card } from '@yuta/ui';
import type { ReactNode } from 'react';

export function FeedbackShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-surface text-primary sm:bg-canvas sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-72 bg-surface-selected opacity-70 sm:block" />
      <div className="relative mx-auto min-h-dvh w-full max-w-[420px] sm:min-h-0">
        <Card
          padding="none"
          radius="lg"
          className="min-h-dvh overflow-hidden rounded-none border-0 shadow-none sm:min-h-0 sm:rounded-lg sm:border sm:shadow-lg"
        >
          <div className="flex min-h-dvh flex-col px-5 pb-6 pt-5 sm:min-h-[760px] sm:px-7">
            {children}
          </div>
        </Card>
      </div>
    </main>
  );
}
