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
} from '@yuta/ui';
import { CirclePlus, Pencil, Plus } from 'lucide-react';
import { useActionState, useId, useState } from 'react';
import {
  createComboGroupAction,
  createComboGroupItemAction,
  updateComboGroupAction,
  updateComboGroupItemAction,
} from '../actions';
import {
  ComboActionFeedback,
  ComboEditorFooter,
  initialComboActionState,
  useCloseComboDialogOnSuccess,
} from './ComboDialogSupport';
import type { CatalogItem, ComboGroup, GroupItem } from '../combo-model';

export function ComboGroupDialog({
  ruleId,
  group,
  disabled = false,
}: {
  ruleId?: string;
  group?: ComboGroup;
  disabled?: boolean;
}) {
  const fieldPrefix = useId();
  const [open, setOpen] = useState(false);
  const actionFunction = group
    ? updateComboGroupAction.bind(null, group.id)
    : createComboGroupAction.bind(null, ruleId ?? '');
  const [state, action, pending] = useActionState(
    actionFunction,
    initialComboActionState,
  );
  useCloseComboDialogOnSuccess(state, setOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!pending || nextOpen) setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={group ? 'outline' : 'secondary'}
          size="sm"
          className="min-h-11 min-w-11"
          disabled={disabled}
          aria-label={
            group ? `Modifier le groupe ${group.name}` : 'Ajouter un groupe'
          }
        >
          {group ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <CirclePlus className="h-4 w-4" />
          )}
          {!group && 'Groupe'}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-0 sm:max-h-[90dvh]">
        <DialogHeader className="shrink-0 px-4 pt-4 pr-12 sm:px-6 sm:pt-6 sm:pr-12">
          <DialogTitle>
            {group ? `Modifier ${group.name}` : 'Nouveau groupe'}
          </DialogTitle>
          <DialogDescription>
            Configurez les quantités et l’ordre de ce groupe.
          </DialogDescription>
        </DialogHeader>
        <form
          action={action}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6">
            <FormField
              label={<label htmlFor={`${fieldPrefix}-name`}>Nom</label>}
            >
              <Input
                id={`${fieldPrefix}-name`}
                name="name"
                defaultValue={group?.name}
                maxLength={255}
                required
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                label={
                  <label htmlFor={`${fieldPrefix}-minimum`}>Minimum</label>
                }
              >
                <Input
                  id={`${fieldPrefix}-minimum`}
                  name="minQuantity"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={group?.minQuantity ?? 1}
                  required
                />
              </FormField>
              <FormField
                label={
                  <label htmlFor={`${fieldPrefix}-maximum`}>Maximum</label>
                }
              >
                <Input
                  id={`${fieldPrefix}-maximum`}
                  name="maxQuantity"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={group?.maxQuantity ?? 1}
                  required
                />
              </FormField>
              <FormField
                label={<label htmlFor={`${fieldPrefix}-order`}>Ordre</label>}
              >
                <Input
                  id={`${fieldPrefix}-order`}
                  name="sortOrder"
                  type="number"
                  defaultValue={group?.sortOrder ?? 0}
                  required
                />
              </FormField>
            </div>
            <ComboActionFeedback state={state} />
          </div>
          <ComboEditorFooter
            pending={pending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ComboGroupItemDialog({
  group,
  groupItem,
  catalogItems,
  disabled = false,
}: {
  group: ComboGroup;
  groupItem?: GroupItem;
  catalogItems: CatalogItem[];
  disabled?: boolean;
}) {
  const fieldPrefix = useId();
  const eligibleItems = catalogItems.filter(
    (item) =>
      item.id === groupItem?.menuItemId ||
      !group.items.some((existing) => existing.menuItemId === item.id),
  );
  const [menuItemId, setMenuItemId] = useState(
    groupItem?.menuItemId ?? eligibleItems[0]?.id ?? '',
  );
  const [open, setOpen] = useState(false);
  const actionFunction = groupItem
    ? updateComboGroupItemAction.bind(null, groupItem.id)
    : createComboGroupItemAction.bind(null, group.id);
  const [state, action, pending] = useActionState(
    actionFunction,
    initialComboActionState,
  );
  useCloseComboDialogOnSuccess(state, setOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!pending || nextOpen) setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-h-11 min-w-11"
          disabled={disabled || (!groupItem && eligibleItems.length === 0)}
          aria-label={
            groupItem
              ? 'Modifier le supplément de l’article'
              : `Ajouter un article au groupe ${group.name}`
          }
        >
          {groupItem ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-0 sm:max-h-[90dvh]">
        <DialogHeader className="shrink-0 px-4 pt-4 pr-12 sm:px-6 sm:pt-6 sm:pr-12">
          <DialogTitle>
            {groupItem ? 'Modifier le supplément' : 'Ajouter un article'}
          </DialogTitle>
          <DialogDescription>
            Sélectionnez l’article éligible et son supplément.
          </DialogDescription>
        </DialogHeader>
        <form
          action={action}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6">
            {!groupItem && (
              <FormField
                label={<label htmlFor={`${fieldPrefix}-item`}>Article</label>}
              >
                <input type="hidden" name="menuItemId" value={menuItemId} />
                <Select value={menuItemId} onValueChange={setMenuItemId}>
                  <SelectTrigger id={`${fieldPrefix}-item`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
            <FormField
              label={
                <label htmlFor={`${fieldPrefix}-extra-price`}>
                  Supplément (€)
                </label>
              }
            >
              <Input
                id={`${fieldPrefix}-extra-price`}
                name="extraPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  groupItem
                    ? (groupItem.extraPriceCents / 100).toFixed(2)
                    : '0.00'
                }
                required
              />
            </FormField>
            <ComboActionFeedback state={state} />
          </div>
          <ComboEditorFooter
            pending={pending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
