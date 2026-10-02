import { FormField, Label, Textarea } from '@yuta/ui';
import type { TeamCultureDraft } from '../team-culture-model';

export function TeamCultureFields({
  draft,
  canManage,
  onValuesAndMindsetChange,
  onWorkingTogetherChange,
  onTransmissionAndIntegrationChange,
}: {
  draft: TeamCultureDraft;
  canManage: boolean;
  onValuesAndMindsetChange: (value: string) => void;
  onWorkingTogetherChange: (value: string) => void;
  onTransmissionAndIntegrationChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField
        label={
          <Label htmlFor="valuesAndMindset">Valeurs &amp; état d’esprit</Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="valuesAndMindset"
          name="valuesAndMindset"
          value={draft.valuesAndMindset ?? ''}
          onChange={(event) => onValuesAndMindsetChange(event.target.value)}
          disabled={!canManage}
          rows={6}
        />
      </FormField>
      <FormField
        label={
          <Label htmlFor="workingTogether">Façon de travailler ensemble</Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="workingTogether"
          name="workingTogether"
          value={draft.workingTogether ?? ''}
          onChange={(event) => onWorkingTogetherChange(event.target.value)}
          disabled={!canManage}
          rows={6}
        />
      </FormField>
      <FormField
        label={
          <Label htmlFor="transmissionAndIntegration">
            Transmission &amp; intégration
          </Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="transmissionAndIntegration"
          name="transmissionAndIntegration"
          value={draft.transmissionAndIntegration ?? ''}
          onChange={(event) =>
            onTransmissionAndIntegrationChange(event.target.value)
          }
          disabled={!canManage}
          rows={6}
        />
      </FormField>
    </div>
  );
}
