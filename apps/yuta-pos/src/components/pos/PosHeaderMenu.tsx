'use client';

import { cn } from '@yuta/ui';
import { Menu } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const CloseMenuContext = createContext<() => void>(() => undefined);

type PosHeaderMenuProps = {
  label: string;
  pageActions?: ReactNode;
  workflowActions?: ReactNode;
  navigationActions?: ReactNode;
  prominent: boolean;
  compact: boolean;
};

export function PosHeaderMenu({
  label,
  pageActions,
  workflowActions,
  navigationActions,
  prominent,
  compact,
}: PosHeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const closeMenu = useCallback(() => {
    setOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'grid place-items-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
          compact
            ? 'h-11 w-11 text-white hover:bg-white/10'
            : 'border border-border-default bg-white text-primary hover:bg-surface-muted',
          !compact && (prominent ? 'h-12 w-12' : 'h-11 w-11'),
        )}
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <CloseMenuContext.Provider value={closeMenu}>
        <div
          id={menuId}
          role="group"
          aria-label={label}
          className={cn(
            'absolute right-0 top-full z-30 mt-2 min-w-64 gap-2 rounded-lg border border-border-default bg-white p-3 text-primary shadow-sm [&>a]:w-full [&>button]:w-full [&>form>button]:w-full [&>form]:w-full',
            open ? 'grid' : 'hidden',
          )}
        >
          {pageActions}
          {pageActions && (workflowActions || navigationActions) && (
            <div
              role="separator"
              className="my-1 border-t border-border-default"
            />
          )}
          {workflowActions}
          {workflowActions && navigationActions && (
            <div
              role="separator"
              className="my-1 border-t border-border-default"
            />
          )}
          {navigationActions}
        </div>
      </CloseMenuContext.Provider>
    </div>
  );
}

export function useClosePosHeaderMenu(): () => void {
  return useContext(CloseMenuContext);
}
