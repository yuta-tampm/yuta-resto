'use client';

import { Card } from '@yuta/ui';
import { Info } from 'lucide-react';
import {
  CreateCategoryDialog,
  InstructionSettingsDialog,
} from './CatalogCategoryDialogs';
import { CatalogItemDialog } from './CatalogItemDialog';
import { CatalogOverview } from './CatalogOverview';
import {
  getItemCount,
  type Category,
  type InstructionSettings,
} from '../catalog-model';

export function CatalogManagement({
  categories,
  instructionSettings,
}: {
  categories: Category[];
  instructionSettings: InstructionSettings;
}) {
  const itemCount = getItemCount(categories);

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap justify-end gap-2 rounded-lg border border-border-default bg-surface p-3 shadow-sm">
        <InstructionSettingsDialog settings={instructionSettings} />
        <CreateCategoryDialog />
        <CatalogItemDialog categories={categories} />
      </div>

      {categories.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="font-bold">Aucune catégorie</p>
          <p className="mt-1 text-sm text-secondary">
            Créez une catégorie avant d’ajouter des articles.
          </p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="border-b border-border-default px-4 py-3">
            <h2 className="font-black">Catégories et articles</h2>
            <p className="mt-0.5 text-xs text-secondary">
              {categories.length} catégorie{categories.length === 1 ? '' : 's'}{' '}
              · {itemCount} article{itemCount === 1 ? '' : 's'}
            </p>
          </div>
          <CatalogOverview categories={categories} />
          <div className="flex gap-2 border-t border-border-default bg-status-info/5 px-4 py-3 text-xs text-secondary">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-status-info" />
            <p>
              Les modifications prennent effet au prochain rendu des écrans POS.
              Les catégories sont masquées et les articles marqués indisponibles
              ; ils ne sont jamais supprimés.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
