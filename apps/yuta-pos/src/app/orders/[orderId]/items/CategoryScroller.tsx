'use client';

import { cn } from '@yuta/ui';
import Link from 'next/link';
import { useRef } from 'react';

type CategoryScrollerProps = {
  categories: Array<{ id: string; name: string }>;
  orderId: string;
  selectedCategoryId: string;
};

type DragState = {
  pointerId: number | null;
  startX: number;
  startScrollLeft: number;
  moved: boolean;
};

export function CategoryScroller({
  categories,
  orderId,
  selectedCategoryId,
}: CategoryScrollerProps) {
  const navRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragState>({
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  return (
    <nav
      ref={navRef}
      aria-label="Catégories de la carte"
      className="flex shrink-0 cursor-grab touch-pan-y select-none gap-2 overflow-x-auto overscroll-x-contain px-4 py-3 active:cursor-grabbing max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:grid lg:min-h-0 lg:flex-1 lg:cursor-auto lg:content-start lg:gap-1 lg:overflow-x-hidden lg:overflow-y-scroll lg:overscroll-contain lg:px-3 lg:pb-6 lg:pt-0"
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;

        const nav = navRef.current;
        if (!nav || nav.scrollWidth <= nav.clientWidth) return;

        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startScrollLeft: nav.scrollLeft,
          moved: false,
        };
        nav.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const nav = navRef.current;
        const drag = dragRef.current;
        if (!nav || drag.pointerId !== event.pointerId) return;

        const distance = drag.startX - event.clientX;
        if (Math.abs(distance) > 4) drag.moved = true;
        nav.scrollLeft = drag.startScrollLeft + distance;
      }}
      onPointerUp={(event) => {
        const nav = navRef.current;
        if (dragRef.current.pointerId !== event.pointerId) return;

        if (nav?.hasPointerCapture(event.pointerId)) {
          nav.releasePointerCapture(event.pointerId);
        }
        dragRef.current.pointerId = null;
        window.setTimeout(() => {
          dragRef.current.moved = false;
        }, 0);
      }}
      onPointerCancel={() => {
        dragRef.current.pointerId = null;
        dragRef.current.moved = false;
      }}
      onClickCapture={(event) => {
        if (!dragRef.current.moved) return;

        event.preventDefault();
        event.stopPropagation();
        dragRef.current.moved = false;
      }}
    >
      {categories.map((category) => (
        <Link
          key={category.id}
          href={categoryHref(orderId, category.id)}
          draggable={false}
          aria-current={category.id === selectedCategoryId ? 'page' : undefined}
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center rounded-lg border-l-4 border-transparent px-3 py-2 text-xs font-black transition-colors sm:px-4 sm:text-sm lg:w-full',
            category.id === selectedCategoryId
              ? 'border-action-primary bg-status-success-soft text-primary'
              : 'text-primary hover:bg-surface-muted',
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

function categoryHref(orderId: string, categoryId: string): string {
  return categoryId === 'all'
    ? `/orders/${orderId}/items`
    : `/orders/${orderId}/items?category=${encodeURIComponent(categoryId)}`;
}
