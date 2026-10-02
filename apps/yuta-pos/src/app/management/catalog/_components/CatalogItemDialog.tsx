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
import { useId, useState } from 'react';
import {
  createCatalogItemAction,
  setCatalogItemAvailableAction,
  updateCatalogItemAction,
} from '../actions';
import {
  CatalogActionFeedback,
  CatalogActionSuccess,
  CatalogEditorFooter,
  CatalogToggleDialog,
  useCatalogEditorAction,
  useCloseCatalogDialogOnSuccess,
} from './CatalogDialogSupport';
import {
  getStationLabel,
  stations,
  type Category,
  type Item,
  type OrderingPolicy,
  type Station,
} from '../catalog-model';

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
  const { state, submit, pending } = useCatalogEditorAction(actionFunction);
  useCloseCatalogDialogOnSuccess(state, setOpen);
  const label = item ? `Modifier ${item.name}` : 'Nouvel article';

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={item ? 'outline' : 'primary'}
            size={item ? 'sm' : 'md'}
            className={
              item ? 'min-h-11 min-w-11 lg:min-h-9 lg:min-w-9' : 'min-h-11'
            }
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
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
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
      <CatalogActionSuccess state={state} />
    </>
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
  const fieldId = useId();
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
        <FormField
          label={<label htmlFor={`${fieldId}-categorie`}>Catégorie</label>}
        >
          <input type="hidden" name="categoryId" value={categoryId} />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id={`${fieldId}-categorie`}>
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
        <FormField label={<label htmlFor={`${fieldId}-nom`}>Nom</label>}>
          <Input
            id={`${fieldId}-nom`}
            name="name"
            defaultValue={item?.name}
            maxLength={255}
            required
          />
        </FormField>
        <FormField
          label={<label htmlFor={`${fieldId}-description`}>Description</label>}
          hint="Facultative."
        >
          <Textarea
            id={`${fieldId}-description`}
            name="description"
            defaultValue={item?.description ?? ''}
            maxLength={2000}
            rows={3}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label={<label htmlFor={`${fieldId}-prix-ttc`}>Prix TTC (€)</label>}
          >
            <Input
              id={`${fieldId}-prix-ttc`}
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
          <FormField label={<label htmlFor={`${fieldId}-ordre`}>Ordre</label>}>
            <Input
              id={`${fieldId}-ordre`}
              name="sortOrder"
              type="number"
              min={-100000}
              max={100000}
              defaultValue={item?.sortOrder ?? 0}
              required
            />
          </FormField>
        </div>
        <FormField
          label={
            <label htmlFor={`${fieldId}-disponibilite`}>Disponibilité</label>
          }
        >
          <input
            type="hidden"
            name="isAvailable"
            value={isAvailable ? 'true' : 'false'}
          />
          <Select
            value={isAvailable ? 'available' : 'unavailable'}
            onValueChange={(value) => setIsAvailable(value === 'available')}
          >
            <SelectTrigger id={`${fieldId}-disponibilite`}>
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
          label={
            <label htmlFor={`${fieldId}-suggestions-de-notes`}>
              Suggestions de notes
            </label>
          }
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
            <SelectTrigger id={`${fieldId}-suggestions-de-notes`}>
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
              label={
                <label htmlFor={`${fieldId}-suggestions-principales`}>
                  Suggestions principales
                </label>
              }
              hint="Une ligne par code."
            >
              <Textarea
                id={`${fieldId}-suggestions-principales`}
                name="defaultInstructionCodes"
                defaultValue={item?.defaultInstructionCodes?.join('\n')}
                rows={5}
              />
            </FormField>
            <FormField
              label={
                <label htmlFor={`${fieldId}-suggestions-supplementaires`}>
                  Suggestions supplémentaires
                </label>
              }
              hint="Affichées sous Autres."
            >
              <Textarea
                id={`${fieldId}-suggestions-supplementaires`}
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
        <FormField
          label={
            <label htmlFor={`${fieldId}-poste-de-preparation`}>
              Poste de préparation
            </label>
          }
        >
          <input type="hidden" name="kitchenStation" value={station} />
          <Select
            value={station}
            onValueChange={(value) => setStation(value as Station)}
          >
            <SelectTrigger id={`${fieldId}-poste-de-preparation`}>
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
          label={
            <label htmlFor={`${fieldId}-politique-d-ajout`}>
              Politique d’ajout
            </label>
          }
          hint="Séparez les portions lorsque chaque assiette doit conserver ses propres choix."
        >
          <input type="hidden" name="orderingPolicy" value={orderingPolicy} />
          <Select
            value={orderingPolicy}
            onValueChange={(value) =>
              setOrderingPolicy(value as OrderingPolicy)
            }
          >
            <SelectTrigger id={`${fieldId}-politique-d-ajout`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="merge">Regrouper les quantités</SelectItem>
              <SelectItem value="separate">Une ligne par portion</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label={
            <label htmlFor={`${fieldId}-choix-requis-par-portion`}>
              Choix requis par portion
            </label>
          }
          hint="0 si aucun choix n’est obligatoire."
        >
          <Input
            id={`${fieldId}-choix-requis-par-portion`}
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
          label={
            <label htmlFor={`${fieldId}-options-disponibles`}>
              Options disponibles
            </label>
          }
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
            id={`${fieldId}-options-disponibles`}
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
