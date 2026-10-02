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
  Textarea,
} from '@yuta/ui';
import { Pencil, Plus, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import {
  createCatalogCategoryAction,
  setCatalogCategoryActiveAction,
  updateCatalogCategoryAction,
  updateInstructionSettingsAction,
} from '../actions';
import {
  CatalogActionFeedback,
  CatalogActionSuccess,
  CatalogEditorFooter,
  CatalogToggleDialog,
  useCatalogEditorAction,
  useCloseCatalogDialogOnSuccess,
} from './CatalogDialogSupport';
import type { Category, InstructionSettings } from '../catalog-model';

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const { state, submit, pending } = useCatalogEditorAction(
    createCatalogCategoryAction,
  );
  useCloseCatalogDialogOnSuccess(state, setOpen);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="min-h-11">
            <Plus className="h-4 w-4" />
            Nouvelle catégorie
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Elle sera immédiatement disponible dans le catalogue local.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <CategoryFields />
            <CatalogActionFeedback state={state} />
            <CatalogEditorFooter
              pending={pending}
              onCancel={() => setOpen(false)}
            />
          </form>
        </DialogContent>
      </Dialog>
      <CatalogActionSuccess state={state} />
    </>
  );
}

export function InstructionSettingsDialog({
  settings,
}: {
  settings: InstructionSettings;
}) {
  const [open, setOpen] = useState(false);
  const { state, submit, pending } = useCatalogEditorAction(
    updateInstructionSettingsAction,
  );
  useCloseCatalogDialogOnSuccess(state, setOpen);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="min-h-11">
            <SlidersHorizontal className="h-4 w-4" />
            Options notes / allergies
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Options locales</DialogTitle>
            <DialogDescription>
              Ces définitions appartiennent uniquement à ce POS local. Retirez
              d’abord une suggestion des catégories et articles avant de la
              supprimer ici.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <FormField
              label="Suggestions rapides"
              hint="Une ligne : CODE = Libellé | CONFLIT_1, CONFLIT_2. La partie conflit est facultative."
            >
              <Textarea
                name="quickInstructionOptions"
                defaultValue={settings.quickInstructionOptions
                  .map(
                    ({ code, label, conflictsWith }) =>
                      `${code} = ${label}${
                        conflictsWith.length > 0
                          ? ` | ${conflictsWith.join(', ')}`
                          : ''
                      }`,
                  )
                  .join('\n')}
                rows={14}
              />
            </FormField>
            <FormField label="Allergènes" hint="Une ligne : CODE = Libellé.">
              <Textarea
                name="allergenOptions"
                defaultValue={settings.allergenOptions
                  .map(({ code, label }) => `${code} = ${label}`)
                  .join('\n')}
                rows={8}
              />
            </FormField>
            <CatalogActionFeedback state={state} />
            <CatalogEditorFooter
              pending={pending}
              onCancel={() => setOpen(false)}
            />
          </form>
        </DialogContent>
      </Dialog>
      <CatalogActionSuccess state={state} />
    </>
  );
}

export function EditCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const { state, submit, pending } = useCatalogEditorAction(
    updateCatalogCategoryAction.bind(null, category.id),
  );
  useCloseCatalogDialogOnSuccess(state, setOpen);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 min-w-11 lg:min-h-9 lg:min-w-9"
            aria-label={`Modifier la catégorie ${category.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <CategoryFields category={category} />
            <CatalogActionFeedback state={state} />
            <CatalogEditorFooter
              pending={pending}
              onCancel={() => setOpen(false)}
            />
          </form>
        </DialogContent>
      </Dialog>
      <CatalogActionSuccess state={state} />
    </>
  );
}

export function ToggleCategoryDialog({ category }: { category: Category }) {
  return (
    <CatalogToggleDialog
      title={`${category.isActive ? 'Masquer' : 'Afficher'} ${category.name} ?`}
      description={
        category.isActive
          ? 'La catégorie et ses articles disparaîtront du POS, sans supprimer les données.'
          : 'La catégorie réapparaîtra dans le POS avec ses articles disponibles.'
      }
      triggerLabel={`${category.isActive ? 'Masquer' : 'Afficher'} la catégorie ${category.name}`}
      confirmLabel={category.isActive ? 'Masquer' : 'Afficher'}
      active={category.isActive}
      action={setCatalogCategoryActiveAction.bind(
        null,
        category.id,
        !category.isActive,
      )}
    />
  );
}

function CategoryFields({ category }: { category?: Category }) {
  return (
    <>
      <FormField label="Nom">
        <Input
          name="name"
          defaultValue={category?.name}
          maxLength={255}
          required
        />
      </FormField>
      <FormField label="Ordre d’affichage">
        <Input
          name="sortOrder"
          type="number"
          defaultValue={category?.sortOrder ?? 0}
          min={-100000}
          max={100000}
          required
        />
      </FormField>
      <FormField
        label="Suggestions principales"
        hint="Codes séparés par des espaces, virgules ou retours à la ligne."
      >
        <Textarea
          name="defaultInstructionCodes"
          defaultValue={category?.defaultInstructionCodes.join('\n')}
          rows={5}
          placeholder="SANS_ALCOOL"
        />
      </FormField>
      <FormField
        label="Suggestions supplémentaires"
        hint="Affichées sous Autres."
      >
        <Textarea
          name="additionalInstructionCodes"
          defaultValue={category?.additionalInstructionCodes.join('\n')}
          rows={4}
        />
      </FormField>
    </>
  );
}
