'use client';

import { Button, Input, cn } from '@yuta/ui';
import { LoaderCircle, Plus, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { addOrderItemAction } from '../../../../actions';

type MenuItemBrowserItem = {
  id: string;
  name: string;
  description: string | null;
  priceLabel: string;
  selectedQuantity: number;
};

type MenuItemBrowserProps = {
  orderId: string;
  items: MenuItemBrowserItem[];
  canEditItems: boolean;
  comboSuggestionGroups: ComboSuggestionGroup[];
};

type ComboSuggestionGroup = {
  comboRuleId: string;
  comboRuleName: string;
  items: Array<{
    id: string;
    name: string;
    priceLabel: string;
  }>;
};

export function MenuItemBrowser({
  orderId,
  items,
  canEditItems,
  comboSuggestionGroups,
}: MenuItemBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const hasActiveSearch = searchQuery.trim().length > 0;
  const visibleItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('fr-FR');

    if (normalizedQuery.length === 0) {
      return items;
    }

    return items.filter(
      (item) =>
        item.name.toLocaleLowerCase('fr-FR').includes(normalizedQuery) ||
        (item.description
          ?.toLocaleLowerCase('fr-FR')
          .includes(normalizedQuery) ??
          false),
    );
  }, [items, searchQuery]);

  return (
    <>
      <div className="shrink-0 border-b border-border-default px-3 py-2 lg:px-5 lg:py-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/35 lg:left-4 lg:h-5 lg:w-5" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Rechercher un article..."
            size="lg"
            className="h-11 pl-10 text-sm lg:h-12 lg:pl-12"
            aria-label="Rechercher un article"
          />
        </div>
      </div>

      {!hasActiveSearch && comboSuggestionGroups.length > 0 && (
        <section
          className="grid shrink-0 gap-3 border-b border-status-success-border bg-status-success-soft px-3 py-3 lg:px-5"
          aria-label="Suggestions de formules"
        >
          {comboSuggestionGroups.map((group) => (
            <div
              key={group.comboRuleId}
              className="grid min-w-0 gap-2 xl:grid-cols-[minmax(160px,auto)_minmax(0,1fr)] xl:items-center xl:gap-4"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-status-success text-inverse">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-wide text-status-success">
                    Suggestion combo
                  </p>
                  <h2 className="truncate text-sm font-black">
                    Compléter {group.comboRuleName}
                  </h2>
                </div>
              </div>

              <div className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1 lg:pb-0">
                {group.items.map((item) => (
                  <form
                    key={item.id}
                    action={addOrderItemAction}
                    className="grid min-w-[280px] flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-lg border border-status-success-border bg-white p-2 shadow-sm sm:min-w-[320px] sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                  >
                    <input type="hidden" name="orderId" value={orderId} />
                    <input type="hidden" name="menuItemId" value={item.id} />
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-status-success-border bg-status-success-soft text-xs font-black">
                      {menuItemInitials(item.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block whitespace-normal break-words text-sm font-black leading-tight">
                        {item.name}
                      </span>
                      <span className="block text-xs font-bold text-primary/60">
                        {item.priceLabel}
                      </span>
                    </span>
                    <AddSuggestionButton
                      disabled={!canEditItems}
                      itemName={item.name}
                      comboRuleName={group.comboRuleName}
                    />
                  </form>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {visibleItems.length === 0 ? (
        <div className="grid min-h-96 place-items-center p-6 text-center lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <div>
            <Search className="mx-auto h-9 w-9 text-primary/30" />
            <h3 className="mt-3 font-black">Aucun article</h3>
            <p className="mt-1 text-sm font-semibold text-primary/55">
              Essayez une autre recherche.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 p-4 pb-24 sm:gap-3 md:grid-cols-3 lg:min-h-0 lg:flex-1 lg:auto-rows-max lg:grid-cols-2 lg:overflow-y-auto lg:overscroll-contain lg:p-4 lg:pb-5 xl:grid-cols-4 2xl:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
          {visibleItems.map((item) => (
            <form key={item.id} action={addOrderItemAction}>
              <input type="hidden" name="orderId" value={orderId} />
              <input type="hidden" name="menuItemId" value={item.id} />
              <MenuItemSubmitButton item={item} disabled={!canEditItems} />
            </form>
          ))}
        </div>
      )}
    </>
  );
}

function MenuItemSubmitButton({
  item,
  disabled,
}: {
  item: MenuItemBrowserItem;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      className={cn(
        'relative h-36 w-full flex-col gap-0 overflow-hidden rounded-xl p-0 text-center sm:h-40',
        pending && 'ring-2 ring-status-success ring-offset-1',
      )}
      disabled={disabled || pending}
      aria-label={pending ? `Ajout de ${item.name} en cours` : item.name}
    >
      <MenuItemArtwork
        name={item.name}
        selectedQuantity={item.selectedQuantity}
      />
      <span className="grid w-full gap-1 px-3 pb-3 pt-2.5">
        <span className="line-clamp-2 min-h-7 text-xs font-black leading-tight sm:min-h-9 sm:text-sm">
          {item.name}
        </span>
        <span className="text-xs font-black sm:text-sm">{item.priceLabel}</span>
      </span>
      {pending && (
        <span
          className="absolute inset-0 grid place-items-center bg-white/90"
          aria-live="polite"
        >
          <span className="inline-flex items-center gap-2 rounded-lg bg-status-success px-3 py-2 text-sm font-black text-inverse shadow-sm">
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Ajout...
          </span>
        </span>
      )}
    </Button>
  );
}

function AddSuggestionButton({
  disabled,
  itemName,
  comboRuleName,
}: {
  disabled: boolean;
  itemName: string;
  comboRuleName: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      className="col-span-2 h-11 w-full shrink-0 px-3 sm:col-span-1 sm:w-auto"
      disabled={disabled || pending}
      aria-label={
        pending
          ? `Ajout de ${itemName} en cours`
          : `Ajouter ${itemName} pour compléter ${comboRuleName}`
      }
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      <span>{pending ? 'Ajout...' : 'Ajouter'}</span>
    </Button>
  );
}

function MenuItemArtwork({
  name,
  selectedQuantity,
}: {
  name: string;
  selectedQuantity: number;
}) {
  return (
    <span className="relative grid h-20 w-full place-items-center overflow-hidden bg-canvas sm:h-24">
      <span
        className={cn(
          'grid h-14 w-14 place-items-center rounded-full border border-border-default text-sm font-black shadow-sm sm:h-[4.5rem] sm:w-[4.5rem] sm:text-lg',
          menuItemArtworkClass(name),
        )}
      >
        {menuItemInitials(name)}
      </span>
      <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-status-success px-1 text-[11px] font-black text-inverse shadow-sm">
        {selectedQuantity}
      </span>
    </span>
  );
}

function menuItemArtworkClass(name: string): string {
  const classes = [
    'bg-surface-muted text-primary',
    'bg-action-primary text-primary',
    'bg-status-info-soft text-primary',
    'bg-status-warning text-primary',
    'bg-canvas text-primary',
  ];
  const index = Array.from(name).reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );

  return classes[index % classes.length] ?? classes[0];
}

function menuItemInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toLocaleUpperCase('fr-FR'))
    .join('');
}
