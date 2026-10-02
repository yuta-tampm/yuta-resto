import { FormField, Label, Textarea } from '@yuta/ui';
import type { CustomerExperienceDraft } from '../customer-experience-model';

export function CustomerExperienceFields({
  draft,
  canManage,
  onDesiredExperienceChange,
  onWelcomeAndServiceChange,
  onCustomerAttentionChange,
}: {
  draft: CustomerExperienceDraft;
  canManage: boolean;
  onDesiredExperienceChange: (value: string) => void;
  onWelcomeAndServiceChange: (value: string) => void;
  onCustomerAttentionChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField
        label={<Label htmlFor="desiredExperience">Expérience souhaitée</Label>}
        hint="Optionnel"
      >
        <Textarea
          id="desiredExperience"
          name="desiredExperience"
          value={draft.desiredExperience ?? ''}
          onChange={(event) => onDesiredExperienceChange(event.target.value)}
          disabled={!canManage}
          rows={6}
        />
      </FormField>
      <FormField
        label={<Label htmlFor="welcomeAndService">Accueil &amp; service</Label>}
        hint="Optionnel"
      >
        <Textarea
          id="welcomeAndService"
          name="welcomeAndService"
          value={draft.welcomeAndService ?? ''}
          onChange={(event) => onWelcomeAndServiceChange(event.target.value)}
          disabled={!canManage}
          rows={6}
        />
      </FormField>
      <FormField
        label={
          <Label htmlFor="customerAttention">
            Attention particulière au client
          </Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="customerAttention"
          name="customerAttention"
          value={draft.customerAttention ?? ''}
          onChange={(event) => onCustomerAttentionChange(event.target.value)}
          disabled={!canManage}
          rows={6}
        />
      </FormField>
    </div>
  );
}
