import { Badge, Button, Card, IconButton, Switch } from '@yuta/ui';
import { PackagePlus, Pencil, X } from 'lucide-react';
import {
  StockDetailRows,
  StockDetailSection,
} from '../../_components/stock-detail-section';
import {
  formatInventoryCurrency,
  formatInventoryStock,
  type InventoryItem,
} from '../inventory-model';
import { inventoryStatusTones } from '../inventory-presentation';

export function InventoryDetails({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  return (
    <Card padding="none" className="overflow-hidden 2xl:sticky 2xl:top-0">
      <div className="flex items-start justify-between p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-surface-muted text-3xl">
            {item.emoji}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-black">{item.name}</h2>
            <Badge tone={inventoryStatusTones[item.status]} className="mt-1">
              ● {item.status}
            </Badge>
            <p className="mt-2 text-xs text-muted">
              {item.category} · {item.id}
            </p>
          </div>
        </div>
        <IconButton size="sm" aria-label="Fermer les détails" onClick={onClose}>
          <X className="h-5 w-5" />
        </IconButton>
      </div>
      <div
        className="flex overflow-x-auto border-y border-border-default px-3"
        aria-label="Sections de l’article"
      >
        <span className="min-w-max border-b-2 border-action-primary px-4 py-3 text-sm font-semibold text-brand-800">
          Détails
        </span>
        <button
          type="button"
          disabled
          className="min-w-max px-4 py-3 text-sm font-semibold text-secondary"
        >
          Mouvements
        </button>
        <button
          type="button"
          disabled
          className="min-w-max px-4 py-3 text-sm font-semibold text-secondary"
        >
          Fiche technique
        </button>
      </div>
      <div className="divide-y divide-border-default px-4">
        <StockDetailSection title="Stock et emplacements">
          <StockDetailRows
            rows={[
              ['Stock actuel', formatInventoryStock(item.stock, item.unit)],
              ['Stock minimum', formatInventoryStock(item.minimum, item.unit)],
              ['Stock maximum', formatInventoryStock(item.maximum, item.unit)],
              ['Valeur estimée', formatInventoryCurrency(item.value)],
            ]}
          />
          <h4 className="mb-2 mt-4 text-xs font-bold">Par emplacement</h4>
          <StockDetailRows
            rows={[
              [
                item.location,
                formatInventoryStock(Math.max(0, item.stock - 2.4), item.unit),
              ],
              [
                'Cuisine',
                formatInventoryStock(Math.min(2.4, item.stock), item.unit),
              ],
            ]}
          />
        </StockDetailSection>
        <StockDetailSection title="Informations d'achat">
          <StockDetailRows
            rows={[
              ['Fournisseur principal', item.supplier],
              ['Conditionnement', item.packaging],
              ["Prix d'achat", item.purchasePrice],
              ['Dernière réception', '12/07/2025 (10 kg)'],
              ['Délai de livraison', '2 jours'],
            ]}
          />
        </StockDetailSection>
        <StockDetailSection title="Statut et paramètres">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-muted">Suivi du stock</span>
            <Switch defaultChecked disabled aria-label="Suivi du stock" />
          </div>
          <StockDetailRows
            rows={[
              ['Périssable', 'Oui'],
              ['Unité de stock', item.unit],
              ['Catégorie', item.category],
              ['Code barre', item.barcode],
            ]}
          />
        </StockDetailSection>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-border-default p-4">
        <Button variant="secondary" disabled>
          <PackagePlus className="h-4 w-4" />
          Ajuster le stock
        </Button>
        <Button disabled>
          <Pencil className="h-4 w-4" />
          Modifier l&apos;article
        </Button>
      </div>
    </Card>
  );
}
