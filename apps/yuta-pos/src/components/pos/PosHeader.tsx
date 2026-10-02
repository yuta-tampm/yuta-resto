import { cn } from '@yuta/ui';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PosHeaderMenu } from './PosHeaderMenu';

type PosHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  secondaryActions?: ReactNode;
  pageMenuActions?: ReactNode;
  secondaryMenuLabel?: string;
  prominent?: boolean;
  className?: string;
};

export function PosHeader({
  title,
  description,
  eyebrow,
  actions,
  secondaryActions,
  pageMenuActions,
  secondaryMenuLabel = 'Navigation secondaire',
  prominent = false,
  className,
}: PosHeaderProps) {
  return (
    <header
      className={cn(
        'relative flex flex-wrap items-center justify-between bg-primary text-white',
        prominent
          ? 'gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8'
          : 'gap-3 px-4 py-3',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          aria-label="Retour aux commandes"
          className={cn(
            'grid shrink-0 place-items-center overflow-hidden border border-white/15 bg-white transition-colors hover:bg-surface-muted',
            prominent
              ? 'h-11 w-11 rounded-lg sm:h-14 sm:w-14 sm:rounded-xl'
              : 'h-11 w-11 rounded-lg',
          )}
        >
          <Image
            src="/images/logo.svg"
            alt="YuTa"
            width={36}
            height={36}
            priority
            className={cn(
              'object-contain',
              prominent ? 'h-9 w-9 sm:h-12 sm:w-12' : 'h-9 w-9',
            )}
          />
        </Link>
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-black uppercase tracking-normal text-white/55">
              {eyebrow}
            </p>
          )}
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1
              className={cn(
                'truncate font-black tracking-normal',
                prominent ? 'text-xl sm:text-3xl' : 'text-xl md:text-2xl',
              )}
            >
              {title}
            </h1>
          </div>
          {description && (
            <p
              className={cn(
                'mt-0.5 font-semibold text-white/60',
                prominent ? 'text-xs sm:text-sm' : 'text-xs',
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {(actions || secondaryActions || pageMenuActions) && (
        <>
          <div
            className={cn(
              'hidden flex-wrap items-center',
              prominent
                ? 'gap-3 lg:flex [&>*]:h-12 [&>form>button]:h-12'
                : 'gap-2 sm:flex',
            )}
          >
            {actions}
            {(pageMenuActions || secondaryActions) && (
              <PosHeaderMenu
                label={secondaryMenuLabel}
                pageActions={pageMenuActions}
                navigationActions={secondaryActions}
                prominent={prominent}
                compact={false}
              />
            )}
          </div>
          <div className={cn(prominent ? 'lg:hidden' : 'sm:hidden')}>
            <PosHeaderMenu
              label="Menu"
              pageActions={pageMenuActions}
              workflowActions={actions}
              navigationActions={secondaryActions}
              prominent={prominent}
              compact
            />
          </div>
        </>
      )}
    </header>
  );
}
