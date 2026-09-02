import { FormField, Label, Textarea } from '@yuta/ui';
import type { CommunicationIdentityDraft } from '../communication-identity-model';

export function CommunicationIdentityFields({
  draft,
  canManage,
  onToneAndCommunicationStyleChange,
  onCustomerAddressingChange,
  onLanguageElementsAndThingsToAvoidChange,
}: {
  draft: CommunicationIdentityDraft;
  canManage: boolean;
  onToneAndCommunicationStyleChange: (value: string) => void;
  onCustomerAddressingChange: (value: string) => void;
  onLanguageElementsAndThingsToAvoidChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField
        label={
          <Label htmlFor="toneAndCommunicationStyle">
            Ton &amp; style de communication
          </Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="toneAndCommunicationStyle"
          name="toneAndCommunicationStyle"
          value={draft.toneAndCommunicationStyle ?? ''}
          onChange={(event) =>
            onToneAndCommunicationStyleChange(event.target.value)
          }
          disabled={!canManage}
          rows={6}
        />
      </FormField>
      <FormField
        label={
          <Label htmlFor="customerAddressing">
            Façon de s’adresser aux clients
          </Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="customerAddressing"
          name="customerAddressing"
          value={draft.customerAddressing ?? ''}
          onChange={(event) => onCustomerAddressingChange(event.target.value)}
          disabled={!canManage}
          rows={6}
        />
      </FormField>
      <FormField
        label={
          <Label htmlFor="languageElementsAndThingsToAvoid">
            Éléments de langage &amp; choses à éviter
          </Label>
        }
        hint="Optionnel"
      >
        <Textarea
          id="languageElementsAndThingsToAvoid"
          name="languageElementsAndThingsToAvoid"
          value={draft.languageElementsAndThingsToAvoid ?? ''}
          onChange={(event) =>
            onLanguageElementsAndThingsToAvoidChange(event.target.value)
          }
          disabled={!canManage}
          rows={6}
        />
      </FormField>
    </div>
  );
}
