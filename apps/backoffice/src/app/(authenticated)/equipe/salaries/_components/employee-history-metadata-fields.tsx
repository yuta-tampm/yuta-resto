'use client';

import {
  FormField,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@yuta/ui';
import {
  employeeEditHistoryFieldKey,
  getAllowedHistoryClassifications,
  historyMetadataRequirements,
  type EmployeeEditHistoryMetadataDraft,
  type EmployeeEditSemanticGroup,
} from '../_lib/employee-edit-flow';

const groupLabels: Record<EmployeeEditSemanticGroup, string> = {
  identity: 'Identité',
  role: 'Poste et qualification',
  contract_terms: 'Conditions du contrat',
  work_time: 'Temps de travail',
  entry: 'Date d’entrée',
};

export function EmployeeHistoryMetadataFields({
  groups,
  drafts,
  minimumEffectiveDate,
  maximumEffectiveDate,
  fieldErrors,
  onDraftChange,
}: {
  groups: readonly EmployeeEditSemanticGroup[];
  drafts: Readonly<
    Record<EmployeeEditSemanticGroup, EmployeeEditHistoryMetadataDraft>
  >;
  minimumEffectiveDate: string;
  maximumEffectiveDate: string;
  fieldErrors: Readonly<Record<string, string>>;
  onDraftChange(
    group: EmployeeEditSemanticGroup,
    draft: EmployeeEditHistoryMetadataDraft,
  ): void;
}) {
  if (groups.length === 0) return null;

  return (
    <section className="grid gap-4" aria-labelledby="edit-history-meaning">
      <div>
        <h3 id="edit-history-meaning" className="font-bold">
          Nature des modifications
        </h3>
        <p className="mt-1 text-sm text-secondary">
          Précisez le sens de chaque groupe modifié. Le serveur vérifiera les
          différences réelles avant l’enregistrement.
        </p>
      </div>
      <div className="grid gap-3">
        {groups.map((group) => (
          <HistoryMetadataGroup
            key={group}
            group={group}
            draft={drafts[group]}
            minimumEffectiveDate={minimumEffectiveDate}
            maximumEffectiveDate={maximumEffectiveDate}
            fieldErrors={fieldErrors}
            onChange={(draft) => onDraftChange(group, draft)}
          />
        ))}
      </div>
      {fieldErrors.historyMetadata && (
        <p className="text-sm font-medium text-status-danger" role="alert">
          {fieldErrors.historyMetadata}
        </p>
      )}
    </section>
  );
}

function HistoryMetadataGroup({
  group,
  draft,
  minimumEffectiveDate,
  maximumEffectiveDate,
  fieldErrors,
  onChange,
}: {
  group: EmployeeEditSemanticGroup;
  draft: EmployeeEditHistoryMetadataDraft;
  minimumEffectiveDate: string;
  maximumEffectiveDate: string;
  fieldErrors: Readonly<Record<string, string>>;
  onChange(draft: EmployeeEditHistoryMetadataDraft): void;
}) {
  const allowedClassifications = getAllowedHistoryClassifications(group);
  const requirements = historyMetadataRequirements(group, draft.classification);
  const fieldPrefix = `history-${group.replace('_', '-')}`;
  const classificationError =
    fieldErrors[employeeEditHistoryFieldKey(group, 'classification')];
  const effectiveDateError =
    fieldErrors[employeeEditHistoryFieldKey(group, 'effectiveDate')];
  const correctionReasonError =
    fieldErrors[employeeEditHistoryFieldKey(group, 'correctionReason')];

  return (
    <fieldset className="rounded-lg border border-border-default bg-surface-muted p-4">
      <legend className="px-1 text-sm font-bold">{groupLabels[group]}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {group === 'entry' ? (
          <div>
            <p className="text-sm font-medium">Type de modification</p>
            <p className="mt-2 text-sm font-bold">Correction</p>
            <p className="mt-1 text-xs text-secondary">
              La date d’entrée ne peut être corrigée que comme une information
              erronée.
            </p>
            {classificationError && (
              <p className="mt-1 text-sm text-status-danger" role="alert">
                {classificationError}
              </p>
            )}
          </div>
        ) : (
          <FormField
            label={
              <Label htmlFor={`${fieldPrefix}-classification`}>
                Type de modification
              </Label>
            }
            error={
              classificationError ? (
                <span role="alert">{classificationError}</span>
              ) : undefined
            }
          >
            <Select
              value={draft.classification}
              onValueChange={(value) =>
                onChange({
                  classification: value as 'correction' | 'change',
                  effectiveDate: '',
                  correctionReason: '',
                })
              }
            >
              <SelectTrigger
                id={`${fieldPrefix}-classification`}
                aria-invalid={Boolean(classificationError)}
              >
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {allowedClassifications.includes('correction') && (
                  <SelectItem value="correction">Correction</SelectItem>
                )}
                {allowedClassifications.includes('change') && (
                  <SelectItem value="change">Changement</SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormField>
        )}

        {requirements.effectiveDate === 'required' && (
          <FormField
            label={
              <Label htmlFor={`${fieldPrefix}-effective-date`}>
                Date d’effet
              </Label>
            }
            error={
              effectiveDateError ? (
                <span role="alert">{effectiveDateError}</span>
              ) : undefined
            }
          >
            <Input
              id={`${fieldPrefix}-effective-date`}
              type="date"
              min={minimumEffectiveDate}
              max={maximumEffectiveDate}
              value={draft.effectiveDate}
              onChange={(event) =>
                onChange({ ...draft, effectiveDate: event.target.value })
              }
              required
              aria-invalid={Boolean(effectiveDateError)}
            />
            <p className="mt-1 text-xs text-secondary">
              Entre la date d’entrée et aujourd’hui, sans dépasser le départ.
            </p>
          </FormField>
        )}

        {requirements.correctionReason !== 'hidden' && (
          <FormField
            className="sm:col-span-2"
            label={
              <Label htmlFor={`${fieldPrefix}-reason`}>
                Motif de la correction
                {requirements.correctionReason === 'optional'
                  ? ' (facultatif)'
                  : ''}
              </Label>
            }
            error={
              correctionReasonError ? (
                <span role="alert">{correctionReasonError}</span>
              ) : undefined
            }
          >
            <Textarea
              id={`${fieldPrefix}-reason`}
              maxLength={250}
              value={draft.correctionReason}
              onChange={(event) =>
                onChange({ ...draft, correctionReason: event.target.value })
              }
              required={requirements.correctionReason === 'required'}
              aria-invalid={Boolean(correctionReasonError)}
            />
          </FormField>
        )}
      </div>
    </fieldset>
  );
}
