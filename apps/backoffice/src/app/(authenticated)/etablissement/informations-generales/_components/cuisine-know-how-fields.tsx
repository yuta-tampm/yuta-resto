import { FormField, Label, Textarea } from '@yuta/ui';
import type { CuisineKnowHowDraft } from '../cuisine-know-how-model';

export function CuisineKnowHowFields({
  draft,
  canManage,
  onCuisineDescriptionChange,
  onKnowHowParticularitiesChange,
  onHomemadeChange,
}: {
  draft: CuisineKnowHowDraft;
  canManage: boolean;
  onCuisineDescriptionChange: (value: string) => void;
  onKnowHowParticularitiesChange: (value: string) => void;
  onHomemadeChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField
        label={
          <Label htmlFor="cuisineDescription">Description de la cuisine</Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="cuisineDescription"
          name="cuisineDescription"
          value={draft.cuisineDescription ?? ''}
          onChange={(event) => onCuisineDescriptionChange(event.target.value)}
          disabled={!canManage}
          rows={6}
        />
      </FormField>
      <FormField
        label={
          <Label htmlFor="knowHowParticularities">
            Savoir-faire &amp; particularités
          </Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="knowHowParticularities"
          name="knowHowParticularities"
          value={draft.knowHowParticularities ?? ''}
          onChange={(event) =>
            onKnowHowParticularitiesChange(event.target.value)
          }
          disabled={!canManage}
          rows={6}
        />
      </FormField>
      <FormField
        label={<Label htmlFor="homemade">Fait maison</Label>}
        hint="Optionnel"
      >
        <Textarea
          id="homemade"
          name="homemade"
          value={draft.homemade ?? ''}
          onChange={(event) => onHomemadeChange(event.target.value)}
          disabled={!canManage}
          rows={6}
        />
      </FormField>
    </div>
  );
}
