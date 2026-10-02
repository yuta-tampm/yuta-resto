'use client';

import { Badge, Card } from '@yuta/ui';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { deleteComboGroupAction, deleteComboGroupItemAction } from '../actions';
import { ComboDeleteAction } from './ComboDialogSupport';
import { ComboGroupDialog, ComboGroupItemDialog } from './ComboGroupDialogs';
import {
  formatComboPrice,
  getComboPricingSummary,
  type CatalogItem,
  type ComboGroup,
  type ComboRule,
} from '../combo-model';
import { ComboRuleDialog, ToggleComboRuleDialog } from './ComboRuleDialogs';
import { ComboSuggestionControl } from './ComboSuggestionControl';

export function ComboOverview({
  comboRules,
  catalogItems,
  expandedRuleId,
  onExpandedRuleChange,
}: {
  comboRules: ComboRule[];
  catalogItems: CatalogItem[];
  expandedRuleId: string | null;
  onExpandedRuleChange(ruleId: string | null): void;
}) {
  return comboRules.map((rule) => (
    <ComboRuleSection
      key={rule.id}
      rule={rule}
      catalogItems={catalogItems}
      expanded={expandedRuleId === rule.id}
      onExpandedChange={(expanded) =>
        onExpandedRuleChange(expanded ? rule.id : null)
      }
    />
  ));
}

function ComboRuleSection({
  rule,
  catalogItems,
  expanded,
  onExpandedChange,
}: {
  rule: ComboRule;
  catalogItems: CatalogItem[];
  expanded: boolean;
  onExpandedChange(expanded: boolean): void;
}) {
  const contentId = `combo-rule-${rule.id}`;

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="grid gap-3 bg-surface-muted px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start lg:grid-cols-[minmax(0,1fr)_minmax(15rem,auto)_auto] md:px-4">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={contentId}
            aria-label={`${expanded ? 'Replier' : 'Déplier'} ${rule.name}`}
            onClick={() => onExpandedChange(!expanded)}
            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-lg text-primary hover:bg-surface-selected focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          <div className="min-w-0 pt-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black">{rule.name}</h2>
              <Badge tone={rule.isActive ? 'success' : 'neutral'}>
                {rule.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge tone="neutral" variant="outline">
                Priorité {rule.priority}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-secondary">
              {getComboPricingSummary(rule)} · {rule.groups.length} groupe
              {rule.groups.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <ComboSuggestionControl rule={rule} />
        <div className="flex flex-wrap gap-2 sm:col-start-2 sm:row-start-1 sm:justify-end lg:col-start-3">
          <ComboRuleDialog rule={rule} />
          <ComboGroupDialog ruleId={rule.id} disabled={rule.isActive} />
          <ToggleComboRuleDialog rule={rule} />
        </div>
      </div>

      {expanded && (
        <div id={contentId} className="border-t border-border-default">
          {rule.isActive && (
            <div className="border-b border-status-info-border bg-status-info-soft px-4 py-2 text-xs font-medium text-status-info">
              Désactivez la formule pour modifier ses groupes et articles
              éligibles.
            </div>
          )}

          {rule.groups.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted">
              Aucun groupe configuré.
            </div>
          ) : (
            <div className="grid gap-2 p-3 md:p-4">
              {rule.groups.map((group, index) => (
                <ComboGroupCard
                  key={group.id}
                  group={group}
                  ruleActive={rule.isActive}
                  catalogItems={catalogItems}
                  initiallyExpanded={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function ComboGroupCard({
  group,
  ruleActive,
  catalogItems,
  initiallyExpanded,
}: {
  group: ComboGroup;
  ruleActive: boolean;
  catalogItems: CatalogItem[];
  initiallyExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [showAllItems, setShowAllItems] = useState(false);
  const contentId = `combo-group-${group.id}`;
  const visibleItems = showAllItems ? group.items : group.items.slice(0, 3);
  const hiddenItemCount = group.items.length - visibleItems.length;

  return (
    <div className="overflow-hidden rounded-lg border border-border-default">
      <div className="grid gap-2 bg-surface-muted px-3 py-3 sm:flex sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-1">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={contentId}
            aria-label={`${expanded ? 'Replier' : 'Déplier'} le groupe ${group.name}`}
            onClick={() => setExpanded(!expanded)}
            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-lg text-primary hover:bg-surface-selected focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <div className="min-w-0 pt-1.5">
            <p className="font-bold">{group.name}</p>
            <p className="text-xs text-secondary">
              Min {group.minQuantity} · Max {group.maxQuantity} · Ordre{' '}
              {group.sortOrder}
            </p>
            <p className="mt-1 text-xs font-semibold text-secondary">
              {group.items.length} article{group.items.length === 1 ? '' : 's'}
              {' · '}Suppléments configurés
            </p>
          </div>
        </div>
        <div className="flex gap-1 pl-12 sm:pl-0">
          <ComboGroupDialog group={group} disabled={ruleActive} />
          <ComboGroupItemDialog
            group={group}
            catalogItems={catalogItems}
            disabled={ruleActive}
          />
          <ComboDeleteAction
            title={`Supprimer le groupe ${group.name} ?`}
            description="Ses associations d’articles seront également supprimées."
            label={`Supprimer le groupe ${group.name}`}
            disabled={ruleActive}
            action={deleteComboGroupAction.bind(null, group.id)}
          />
        </div>
      </div>
      {expanded && (
        <div id={contentId} className="border-t border-border-default">
          {group.items.length === 0 ? (
            <p className="px-3 py-5 text-center text-xs text-muted">
              Aucun article éligible.
            </p>
          ) : (
            <div className="divide-y divide-border-default">
              {visibleItems.map((item) => {
                const catalogItem = catalogItems.find(
                  (candidate) => candidate.id === item.menuItemId,
                );

                return (
                  <div
                    key={item.id}
                    className="flex min-h-14 items-center justify-between gap-3 px-3 py-2 pl-5 sm:pl-14"
                  >
                    <div>
                      <p className="text-sm font-bold">
                        {catalogItem?.name ?? 'Article supprimé'}
                      </p>
                      <p className="text-xs text-secondary">
                        Supplément {formatComboPrice(item.extraPriceCents)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <ComboGroupItemDialog
                        group={group}
                        groupItem={item}
                        catalogItems={catalogItems}
                        disabled={ruleActive}
                      />
                      <ComboDeleteAction
                        title={`Retirer ${catalogItem?.name ?? 'cet article'} ?`}
                        description="L’article ne sera plus éligible dans ce groupe."
                        label={`Retirer ${catalogItem?.name ?? 'article'} du groupe`}
                        disabled={ruleActive}
                        action={deleteComboGroupItemAction.bind(null, item.id)}
                      />
                    </div>
                  </div>
                );
              })}
              {group.items.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="flex min-h-11 w-full items-center px-3 pl-5 text-left text-sm font-semibold text-status-info hover:underline focus:outline-none focus:ring-2 focus:ring-inset focus:ring-focus-ring sm:pl-14"
                >
                  {showAllItems
                    ? 'Réduire la liste'
                    : `Afficher ${hiddenItemCount} autre${hiddenItemCount === 1 ? '' : 's'} article${hiddenItemCount === 1 ? '' : 's'}`}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
