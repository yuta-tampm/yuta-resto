'use client';

import { Badge } from '@yuta/ui';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
  EditCategoryDialog,
  ToggleCategoryDialog,
} from './CatalogCategoryDialogs';
import {
  CatalogItemDialog,
  ToggleCatalogItemDialog,
} from './CatalogItemDialog';
import styles from './CatalogManagement.module.css';
import {
  formatCatalogPrice,
  getStationLabel,
  type Category,
  type Item,
} from '../catalog-model';

export function CatalogOverview({ categories }: { categories: Category[] }) {
  return categories.map((category, index) => (
    <CatalogCategorySection
      key={category.id}
      category={category}
      categories={categories}
      initiallyOpen={index === 0}
    />
  ));
}

function CatalogCategorySection({
  category,
  categories,
  initiallyOpen,
}: {
  category: Category;
  categories: Category[];
  initiallyOpen: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const sectionId = `category-${category.id}`;
  const suggestionCount =
    category.defaultInstructionCodes.length +
    category.additionalInstructionCodes.length;

  return (
    <section className="border-b border-border-default last:border-b-0">
      <div
        className={`${styles.categoryGrid} grid gap-3 bg-surface px-3 py-3 lg:items-center lg:px-4`}
      >
        <button
          type="button"
          className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-focus-ring"
          aria-expanded={open}
          aria-controls={sectionId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )}
          <span className="truncate font-black">{category.name}</span>
          <Badge tone={category.isActive ? 'success' : 'warning'}>
            {category.isActive ? 'Visible' : 'Masquée'}
          </Badge>
        </button>
        <CatalogCategoryMetric label="Ordre" value={category.sortOrder} />
        <CatalogCategoryMetric label="Suggestions" value={suggestionCount} />
        <CatalogCategoryMetric label="Articles" value={category.items.length} />
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <EditCategoryDialog category={category} />
          <CatalogItemDialog
            categories={categories}
            defaultCategoryId={category.id}
          />
          <ToggleCategoryDialog category={category} />
        </div>
      </div>

      {open && (
        <div
          id={sectionId}
          className="border-t border-border-default bg-canvas/40"
        >
          {category.items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted">
              Aucun article dans cette catégorie.
            </div>
          ) : (
            <div className="divide-y divide-border-default">
              <div
                className={`${styles.itemGrid} hidden gap-3 px-4 py-2 text-[11px] font-bold text-muted lg:grid`}
              >
                <span>Article</span>
                <span>Disponibilité</span>
                <span>Politique de commande</span>
                <span>Prix TTC</span>
                <span>Poste · ordre</span>
                <span className="text-right">Actions</span>
              </div>
              {category.items.map((item) => (
                <CatalogItemRow
                  key={item.id}
                  item={item}
                  categories={categories}
                  categoryId={category.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function CatalogCategoryMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-xs lg:grid lg:justify-start">
      <span className="text-muted lg:sr-only">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function CatalogItemRow({
  item,
  categories,
  categoryId,
}: {
  item: Item;
  categories: Category[];
  categoryId: string;
}) {
  return (
    <div
      className={`${styles.itemGrid} grid gap-3 bg-surface px-4 py-3 lg:items-center`}
    >
      <div className="min-w-0">
        <p className="font-bold">{item.name}</p>
        {item.description && (
          <p className="mt-0.5 truncate text-xs text-muted">
            {item.description}
          </p>
        )}
      </div>
      <div>
        <Badge tone={item.isAvailable ? 'success' : 'warning'}>
          {item.isAvailable ? 'Disponible' : 'Indisponible'}
        </Badge>
      </div>
      <p className="text-sm font-medium">
        {item.orderingPolicy === 'separate'
          ? 'Une ligne par portion'
          : 'Quantités regroupées'}
      </p>
      <p className="text-sm font-bold">{formatCatalogPrice(item.priceCents)}</p>
      <p className="text-sm">
        {getStationLabel(item.kitchenStation)} · {item.sortOrder}
      </p>
      <div className="flex flex-wrap gap-2 lg:justify-end">
        <CatalogItemDialog
          categories={categories}
          item={item}
          defaultCategoryId={categoryId}
        />
        <ToggleCatalogItemDialog item={item} />
      </div>
    </div>
  );
}
