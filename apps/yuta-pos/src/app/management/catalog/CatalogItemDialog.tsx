'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@yuta/ui';
import { PackagePlus, Pencil } from 'lucide-react';
import { useActionState, useState } from 'react';
import {
  createCatalogItemAction,
  setCatalogItemAvailableAction,
  updateCatalogItemAction,
} from './actions';
import {
  CatalogActionFeedback,
  CatalogEditorFooter,
  CatalogToggleDialog,
  initialCatalogActionState,
  useCloseCatalogDialogOnSuccess,
} from './CatalogDialogSupport';
import {
  getStationLabel,
  stations,
  type Category,
  type Item,
  type OrderingPolicy,
  type Station,
} from './catalog-model';

export function CatalogItemDialog({
  categories,
  item,
  defaultCategoryId,
}: {
  categories: Category[];
  item?: Item;
  defaultCategoryId?: string;
}) {
  const [open, setOpen] = useState(false);
  const actionFunction = item
    ? updateCatalogItemAction.bind(null, item.id)
    : createCatalogItemAction;
  const [state, action, pending] = useActionState(
    actionFunction,
    initialCatalogActionState,
  );
  useCloseCatalogDialogOnSuccess(state, setOpen);
  const label = item ? `Modifier ${item.name}` : 'Nouvel article';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={item ? 'outline' : 'primary'}
          size={item ? 'sm' : 'md'}
          disabled={categories.length === 0}
          aria-label={label}
        >
          {item ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <PackagePlus className="h-4 w-4" />
          )}
          {!item && 'Nouvel article'}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[94dvh] max-w-5xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-5 py-4 pr-12 sm:px-6">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            Les changements apparaissent au prochain chargement du POS.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <CatalogItemFields
              categories={categories}
              item={item}
              defaultCategoryId={defaultCategoryId}
            />
            <CatalogActionFeedback state={state} />
          </div>
          <CatalogEditorFooter
            pending={pending}
            onCancel={() => setOpen(false)}
            sticky
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ToggleCatalogItemDialog({ item }: { item: Item }) {
  return (
    <CatalogToggleDialog
      title={`${item.isAvailable ? 'Rendre indisponible' : 'Rendre disponible'} ${item.name} ?`}
      description={
        item.isAvailable
          ? 'L’article ne sera plus proposé dans les nouvelles commandes.'
          : 'L’article sera de nouveau proposé dans les nouvelles commandes.'
      }
      triggerLabel={`${item.isAvailable ? 'Rendre indisponible' : 'Rendre disponible'} ${item.name}`}
      confirmLabel={
        item.isAvailable ? 'Rendre indisponible' : 'Rendre disponible'
      }
      active={item.isAvailable}
      action={setCatalogItemAvailableAction.bind(
        null,
        item.id,
        !item.isAvailable,
      )}
    />
  );
}

function CatalogItemFields({
  categories,
  item,
  defaultCategoryId,
}: {
  categories: Category[];
  item?: Item;
  defaultCategoryId?: string;
}) {
  const [categoryId, setCategoryId] = useState(
    item?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? '',
  );
  const [station, setStation] = useState<Station>(
    item?.kitchenStation ?? 'kitchen',
  );
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);
  const [orderingPolicy, setOrderingPolicy] = useState<OrderingPolicy>(
    item?.orderingPolicy ?? 'merge',
  );
  const [instructionSource, setInstructionSource] = useState<
    'category' | 'custom'
  >(item?.defaultInstructionCodes === null ? 'category' : 'custom');

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <fieldset className="grid min-w-0 gap-4 rounded-lg border border-border-default p-4">
        <legend className="px-1 font-black">1. Général / identité</legend>
        <FormField label="Catégorie">
          <input type="hidden" name="categoryId" value={categoryId} />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Nom">
          <Input
            name="name"
            defaultValue={item?.name}
            maxLength={255}
            required
          />
        </FormField>
        <FormField label="Description" hint="Facultative.">
          <Textarea
            name="description"
            defaultValue={item?.description ?? ''}
            maxLength={2000}
            rows={3}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Prix TTC (€)">
            <Input
              name="price"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              max="1000000"
              defaultValue={
                item ? (item.priceCents / 100).toFixed(2) : undefined
              }
              required
            />
          </FormField>
          <FormField label="Ordre">
            <Input
              name="sortOrder"
              type="number"
              min={-100000}
              max={100000}
              defaultValue={item?.sortOrder ?? 0}
              required
            />
          </FormField>
        </div>
        <FormField label="Disponibilité">
          <input
            type="hidden"
            name="isAvailable"
            value={isAvailable ? 'true' : 'false'}
          />
          <Select
            value={isAvailable ? 'available' : 'unavailable'}
            onValueChange={(value) => setIsAvailable(value === 'available')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="unavailable">Indisponible</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </fieldset>

      <fieldset className="grid min-w-0 gap-4 rounded-lg border border-border-default p-4">
        <legend className="px-1 font-black">2. Notes & codes</legend>
        <FormField
          label="Suggestions de notes"
          hint="Héritez de la catégorie ou définissez des choix propres à cet article."
        >
          <input
            type="hidden"
            name="instructionSource"
            value={instructionSource}
          />
          <Select
            value={instructionSource}
            onValueChange={(value) =>
              setInstructionSource(value as 'category' | 'custom')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">Hériter de la catégorie</SelectItem>
              <SelectItem value="custom">
                Options propres à l’article
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        {instructionSource === 'custom' && (
          <div className="grid gap-4">
            <FormField
              label="Suggestions principales"
              hint="Une ligne par code."
            >
              <Textarea
                name="defaultInstructionCodes"
                defaultValue={item?.defaultInstructionCodes?.join('\n')}
                rows={5}
              />
            </FormField>
            <FormField
              label="Suggestions supplémentaires"
              hint="Affichées sous Autres."
            >
              <Textarea
                name="additionalInstructionCodes"
                defaultValue={item?.additionalInstructionCodes?.join('\n')}
                rows={5}
              />
            </FormField>
          </div>
        )}
      </fieldset>

      <fieldset className="grid min-w-0 gap-4 rounded-lg border border-border-default p-4">
        <legend className="px-1 font-black">3. Préparation & commande</legend>
        <FormField label="Poste de préparation">
          <input type="hidden" name="kitchenStation" value={station} />
          <Select
            value={station}
            onValueChange={(value) => setStation(value as Station)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stations.map((value) => (
                <SelectItem key={value} value={value}>
                  {getStationLabel(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label="Politique d’ajout"
          hint="Séparez les portions lorsque chaque assiette doit conserver ses propres choix."
        >
          <input type="hidden" name="orderingPolicy" value={orderingPolicy} />
          <Select
            value={orderingPolicy}
            onValueChange={(value) =>
              setOrderingPolicy(value as OrderingPolicy)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="merge">Regrouper les quantités</SelectItem>
              <SelectItem value="separate">Une ligne par portion</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label="Choix requis par portion"
          hint="0 si aucun choix n’est obligatoire."
        >
          <Input
            name="requiredVariantQuantity"
            type="number"
            min={0}
            max={100}
            defaultValue={item?.requiredVariantQuantity ?? 0}
            required
          />
        </FormField>
      </fieldset>

      <fieldset className="grid min-w-0 gap-4 rounded-lg border border-border-default p-4">
        <legend className="px-1 font-black">4. Variantes / options</legend>
        <FormField
          label="Options disponibles"
          hint="Une ligne par option : CODE = Libellé. Exemple : MANGUE = Mangue."
        >
          {(!item || item.variantOptions.length === 0) && (
            <div className="mb-3 rounded-lg border border-dashed border-border-default bg-surface-muted p-4 text-center">
              <p className="font-bold">Aucune option pour le moment</p>
              <p className="mt-1 text-xs text-muted">
                Ajoutez des variantes uniquement si cet article en propose.
              </p>
            </div>
          )}
          <Textarea
            name="variantOptions"
            defaultValue={item?.variantOptions
              .map(({ code, label }) => `${code} = ${label}`)
              .join('\n')}
            rows={4}
            placeholder={'MANGUE = Mangue\nMATCHA = Matcha'}
          />
        </FormField>
      </fieldset>
    </div>
  );
}
