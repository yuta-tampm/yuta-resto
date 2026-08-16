import { Button, cn } from '@yuta/ui';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

type PosHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  secondaryActions?: ReactNode;
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

      {(actions || secondaryActions) && (
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
            {secondaryActions && (
              <details className="group">
                <summary
                  className={cn(
                    'grid cursor-pointer list-none place-items-center rounded-lg border border-border-default bg-white text-primary transition-colors hover:bg-surface-muted [&::-webkit-details-marker]:hidden',
                    prominent ? 'h-12 w-12' : 'h-11 w-11',
                  )}
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                  <span className="sr-only">{secondaryMenuLabel}</span>
                </summary>
                <div className="absolute right-4 top-full z-30 mt-2 grid min-w-64 gap-2 rounded-lg border border-border-default bg-white p-3 text-primary shadow-sm [&>a]:w-full [&>button]:w-full [&>form>button]:w-full [&>form]:w-full">
                  {secondaryActions}
                </div>
              </details>
            )}
          </div>
          <details
            className={cn('group', prominent ? 'lg:hidden' : 'sm:hidden')}
          >
            <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-lg text-white transition-colors hover:bg-white/10 [&::-webkit-details-marker]:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </summary>
            <div className="absolute right-4 top-full z-30 mt-2 grid min-w-64 gap-2 rounded-lg border border-border-default bg-white p-3 text-primary shadow-sm [&>a]:w-full [&>button]:w-full [&>form>button]:w-full [&>form]:w-full">
              {actions}
              {secondaryActions}
            </div>
          </details>
        </>
      )}
    </header>
  );
}
