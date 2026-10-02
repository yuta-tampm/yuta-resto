import { Button, cn } from '@yuta/ui';
import { ChefHat, ClipboardList, Settings } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PosHeader } from './PosHeader';
import { PosConnectivityStatus } from './PosConnectivityStatus';

type PosPageShellProps = {
  title: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  secondaryActions?: ReactNode;
  pageMenuActions?: ReactNode;
  secondaryMenuLabel?: string;
  subHeader?: ReactNode;
  floatingAction?: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  prominentHeader?: boolean;
};

type PosMobileFabProps = {
  href: string;
  label: string;
  icon: ReactNode;
};

export function PosPageShell({
  title,
  children,
  description,
  eyebrow,
  actions,
  secondaryActions = <PosServiceNavigation />,
  pageMenuActions,
  secondaryMenuLabel,
  subHeader,
  floatingAction,
  className,
  contentClassName,
  headerClassName,
  prominentHeader = true,
}: PosPageShellProps) {
  return (
    <main className="h-dvh overflow-hidden bg-canvas text-primary">
      <div
        className={cn(
          'flex h-dvh w-full max-w-none flex-col bg-white',
          className,
        )}
      >
        <PosHeader
          title={title}
          description={description}
          eyebrow={eyebrow}
          actions={actions}
          secondaryActions={secondaryActions}
          pageMenuActions={pageMenuActions}
          secondaryMenuLabel={secondaryMenuLabel}
          prominent={prominentHeader}
          className={headerClassName}
        />
        <PosConnectivityStatus />
        {subHeader && (
          <div className="shrink-0 border-b border-border-default bg-white">
            {subHeader}
          </div>
        )}
        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto bg-white px-4 py-4',
            contentClassName,
          )}
        >
          {children}
        </div>
        {floatingAction}
      </div>
    </main>
  );
}

function PosServiceNavigation() {
  return (
    <>
      <Button asChild variant="secondary" size="lg" className="w-full">
        <Link href="/">
          <ClipboardList className="h-4 w-4" />
          Commandes
        </Link>
      </Button>
      <Button asChild variant="secondary" size="lg" className="w-full">
        <Link href="/kitchen">
          <ChefHat className="h-4 w-4" />
          Cuisine
        </Link>
      </Button>
      <Button asChild variant="secondary" size="lg" className="w-full">
        <Link href="/management">
          <Settings className="h-4 w-4" />
          Gestion
        </Link>
      </Button>
    </>
  );
}

export function PosMobileFab({ href, label, icon }: PosMobileFabProps) {
  return (
    <Button
      asChild
      variant="primary"
      size="sm"
      className="fixed bottom-5 right-5 z-20 h-14 w-14 rounded-full shadow-sm sm:hidden"
      aria-label={label}
    >
      <Link href={href}>{icon}</Link>
    </Button>
  );
}
