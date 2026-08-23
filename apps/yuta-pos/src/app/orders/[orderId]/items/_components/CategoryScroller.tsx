'use client';

import { cn } from '@yuta/ui';
import Link from 'next/link';
import { useRef } from 'react';

type CategoryScrollerProps = {
  categories: Array<{ id: string; name: string }>;
  orderId: string;
  selectedCategoryId: string;
  comboSuggestionDismissal: string;
};

type DragState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  startScrollLeft: number;
  moved: boolean;
};

const CATEGORY_DRAG_THRESHOLD_PX = 16;

export function isCategoryDragGesture(
  horizontalDistance: number,
  verticalDistance: number,
): boolean {
  return (
    Math.abs(horizontalDistance) >= CATEGORY_DRAG_THRESHOLD_PX &&
    Math.abs(horizontalDistance) > Math.abs(verticalDistance)
  );
}

export function CategoryScroller({
  categories,
  orderId,
  selectedCategoryId,
  comboSuggestionDismissal,
}: CategoryScrollerProps) {
  const navRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    moved: false,
  });

  return (
    <nav
      ref={navRef}
      aria-label="Catégories de la carte"
      className="grid shrink-0 auto-cols-max grid-flow-col grid-rows-2 gap-x-2 gap-y-1 overflow-x-auto overscroll-x-contain px-3 py-2 max-lg:cursor-grab max-lg:touch-auto max-lg:select-none max-lg:active:cursor-grabbing max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:min-h-0 lg:flex-1 lg:auto-cols-auto lg:grid-flow-row lg:grid-rows-none lg:content-start lg:gap-1 lg:overflow-x-hidden lg:overflow-y-scroll lg:overscroll-contain lg:px-3 lg:pb-6 lg:pt-0"
      onPointerDown={(event) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          event.pointerType === 'touch'
        )
          return;

        const nav = navRef.current;
        if (!nav || nav.scrollWidth <= nav.clientWidth) return;

        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          startScrollLeft: nav.scrollLeft,
          moved: false,
        };
      }}
      onPointerMove={(event) => {
        const nav = navRef.current;
        const drag = dragRef.current;
        if (!nav || drag.pointerId !== event.pointerId) return;

        const horizontalDistance = drag.startX - event.clientX;
        const verticalDistance = drag.startY - event.clientY;
        if (
          !drag.moved &&
          !isCategoryDragGesture(horizontalDistance, verticalDistance)
        ) {
          return;
        }

        if (!drag.moved) {
          drag.moved = true;
          nav.setPointerCapture(event.pointerId);
        }
        nav.scrollLeft = drag.startScrollLeft + horizontalDistance;
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
          href={categoryHref(orderId, category.id, comboSuggestionDismissal)}
          prefetch={false}
          draggable={false}
          aria-current={category.id === selectedCategoryId ? 'page' : undefined}
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-black shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-1 sm:px-4 sm:text-sm lg:w-full',
            category.id === selectedCategoryId
              ? 'border-status-success-border bg-status-success-soft text-status-success'
              : 'border-border-default bg-canvas text-primary hover:border-action-primary hover:bg-surface-selected',
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

export function categoryHref(
  orderId: string,
  categoryId: string,
  comboSuggestionDismissal: string,
): string {
  const search = new URLSearchParams();
  if (comboSuggestionDismissal) {
    search.set('hideComboSuggestions', comboSuggestionDismissal);
  }
  if (categoryId !== 'all') {
    search.set('category', categoryId);
  }
  const query = search.toString();
  return `/orders/${orderId}/items${query ? `?${query}` : ''}`;
}
