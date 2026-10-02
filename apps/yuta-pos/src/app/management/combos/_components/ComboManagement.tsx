'use client';

import { Card } from '@yuta/ui';
import { useState } from 'react';
import { ComboOverview } from './ComboOverview';
import type { CatalogItem, ComboRule } from '../combo-model';

export function ComboManagement({
  comboRules,
  catalogItems,
}: {
  comboRules: ComboRule[];
  catalogItems: CatalogItem[];
}) {
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(
    comboRules[0]?.id ?? null,
  );

  if (comboRules.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="font-bold">Aucune formule</p>
        <p className="mt-1 text-sm text-secondary">
          Créez une formule inactive, configurez ses groupes, puis activez-la.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      <ComboOverview
        comboRules={comboRules}
        catalogItems={catalogItems}
        expandedRuleId={expandedRuleId}
        onExpandedRuleChange={setExpandedRuleId}
      />
      <p className="px-1 text-sm font-medium text-muted">
        {comboRules.length} formule{comboRules.length === 1 ? '' : 's'} au total
      </p>
    </div>
  );
}
