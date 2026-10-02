import { FormField, Label, Textarea } from '@yuta/ui';
import type { ConceptHistoryDraft } from '../concept-history-model';

export function ConceptHistoryFields({
  draft,
  canManage,
  onConceptChange,
  onHistoryChange,
}: {
  draft: ConceptHistoryDraft;
  canManage: boolean;
  onConceptChange: (value: string) => void;
  onHistoryChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField
        label={<Label htmlFor="concept">Concept</Label>}
        hint="Optionnel"
      >
        <Textarea
          id="concept"
          name="concept"
          value={draft.concept ?? ''}
          onChange={(event) => onConceptChange(event.target.value)}
          disabled={!canManage}
          rows={7}
        />
      </FormField>
      <FormField
        label={<Label htmlFor="history">Histoire</Label>}
        hint="Optionnel"
      >
        <Textarea
          id="history"
          name="history"
          value={draft.history ?? ''}
          onChange={(event) => onHistoryChange(event.target.value)}
          disabled={!canManage}
          rows={7}
        />
      </FormField>
    </div>
  );
}
