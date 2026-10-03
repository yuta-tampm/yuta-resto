'use client';

import type { PersonnelRegisterEntry } from '@yuta/contracts/personnel';
import {
  Checkbox,
  FormField,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuta/ui';
import { useState } from 'react';

type RegisterFacts = PersonnelRegisterEntry['facts'];

export function BaseFacts({ facts }: { facts: RegisterFacts }) {
  return (
    <>
      {Object.entries({
        givenNames: facts.givenNames,
        familyName: facts.familyName,
        position: facts.position,
        qualification: facts.qualification,
        entryDate: facts.entryDate,
        departureDate: facts.departureDate ?? '',
        employmentTermType: facts.employmentTermType,
        workTimeCategory: facts.workTimeCategory,
      }).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </>
  );
}

export function EmploymentCorrectionFields({
  facts,
}: {
  facts: RegisterFacts;
}) {
  return (
    <section className="grid gap-4">
      <h3 className="font-bold">Identité et relation de travail</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="givenNames"
          label="Prénoms"
          defaultValue={facts.givenNames}
        />
        <TextField
          name="familyName"
          label="Nom"
          defaultValue={facts.familyName}
        />
        <TextField
          name="position"
          label="Emploi"
          defaultValue={facts.position}
        />
        <TextField
          name="qualification"
          label="Qualification"
          defaultValue={facts.qualification}
        />
        <TextField
          name="entryDate"
          label="Date d’entrée"
          type="date"
          defaultValue={facts.entryDate}
        />
        <TextField
          name="departureDate"
          label="Date de sortie"
          type="date"
          defaultValue={facts.departureDate ?? ''}
          required={false}
        />
        <SelectField
          name="employmentTermType"
          label="Type de contrat"
          defaultValue={facts.employmentTermType}
          options={[
            ['indefinite', 'Contrat à durée indéterminée'],
            ['fixed_term', 'Contrat à durée déterminée'],
          ]}
        />
        <SelectField
          name="workTimeCategory"
          label="Temps de travail"
          defaultValue={facts.workTimeCategory}
          options={[
            ['full_time', 'Temps plein'],
            ['part_time', 'Temps partiel'],
          ]}
        />
      </div>
    </section>
  );
}

export function LegalIdentityFields({ facts }: { facts: RegisterFacts }) {
  return (
    <section className="grid gap-4">
      <h3 className="font-bold">Identité légale</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="nationalityCode"
          label="Code pays de nationalité"
          defaultValue={facts.nationalityCode}
          placeholder="FR"
          maxLength={2}
        />
        <TextField
          name="nationalityLabel"
          label="Nationalité affichée"
          defaultValue={facts.nationalityLabel}
          placeholder="Française"
        />
        <TextField
          name="birthDate"
          label="Date de naissance"
          type="date"
          defaultValue={facts.birthDate}
        />
        <SelectField
          name="sex"
          label="Sexe inscrit"
          defaultValue={facts.sex}
          options={[
            ['F', 'F'],
            ['M', 'M'],
          ]}
        />
      </div>
    </section>
  );
}

export function ConditionalMentionFields({ facts }: { facts: RegisterFacts }) {
  const [protectedRequired, setProtectedRequired] = useState(
    facts.protectedAuthorization.required,
  );
  const [workRequired, setWorkRequired] = useState(
    facts.workAuthorization.required,
  );
  const [temporaryRequired, setTemporaryRequired] = useState(
    Boolean(facts.temporaryWorkCompany),
  );
  const [groupRequired, setGroupRequired] = useState(
    Boolean(facts.employerGroup),
  );

  return (
    <section className="grid gap-4">
      <h3 className="font-bold">Mentions conditionnelles</h3>
      <Toggle
        name="protectedAuthorizationRequired"
        checked={protectedRequired}
        onCheckedChange={setProtectedRequired}
        label="Autorisation administrative requise"
      />
      {protectedRequired && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="protectedAuthorizationDate"
            label="Date d’autorisation"
            type="date"
            defaultValue={facts.protectedAuthorization.authorizationDate ?? ''}
            required={false}
          />
          <TextField
            name="protectedAuthorizationRequestDate"
            label="Date de demande"
            type="date"
            defaultValue={facts.protectedAuthorization.requestDate ?? ''}
            required={false}
          />
        </div>
      )}
      <Toggle
        name="workAuthorizationRequired"
        checked={workRequired}
        onCheckedChange={setWorkRequired}
        label="Titre autorisant le travail requis"
      />
      {workRequired && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="workAuthorizationTitleType"
            label="Type de titre"
            defaultValue={facts.workAuthorization.titleType ?? ''}
          />
          <TextField
            name="workAuthorizationOrderNumber"
            label="Numéro d’ordre"
            defaultValue={facts.workAuthorization.orderNumber ?? ''}
          />
        </div>
      )}
      <SelectField
        name="specialContract"
        label="Mention particulière"
        defaultValue={facts.specialContract}
        options={[
          ['none', 'Aucune'],
          ['apprenticeship', 'Apprenti'],
          ['professionalization', 'Contrat de professionnalisation'],
        ]}
      />
      <ThirdPartyFields
        prefix="temporaryWorkCompany"
        title="Entreprise de travail temporaire"
        checked={temporaryRequired}
        onCheckedChange={setTemporaryRequired}
        value={facts.temporaryWorkCompany}
      />
      <ThirdPartyFields
        prefix="employerGroup"
        title="Groupement d’employeurs"
        checked={groupRequired}
        onCheckedChange={setGroupRequired}
        value={facts.employerGroup}
      />
    </section>
  );
}

export function CorrectionJustificationFields({
  businessDate,
}: {
  businessDate: string;
}) {
  return (
    <section className="grid gap-4">
      <h3 className="font-bold">Justification de la correction</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="effectiveDate"
          label="Date d’effet"
          type="date"
          defaultValue={businessDate}
        />
        <TextField
          name="reason"
          label="Raison"
          defaultValue=""
          placeholder="Correction vérifiée sur justificatif"
        />
      </div>
    </section>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  type = 'text',
  placeholder,
  maxLength,
  required = true,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <FormField label={<Label htmlFor={`register-${name}`}>{label}</Label>}>
      <Input
        id={`register-${name}`}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
      />
    </FormField>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: [string, string][];
}) {
  return (
    <FormField label={<Label htmlFor={`register-${name}`}>{label}</Label>}>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger id={`register-${name}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([value, text]) => (
            <SelectItem key={value} value={value}>
              {text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

function Toggle({
  name,
  label,
  checked,
  onCheckedChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onCheckedChange(value: boolean): void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-border-default p-3 text-sm font-semibold">
      <Checkbox
        name={name}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span>{label}</span>
    </label>
  );
}

function ThirdPartyFields({
  prefix,
  title,
  checked,
  onCheckedChange,
  value,
}: {
  prefix: string;
  title: string;
  checked: boolean;
  onCheckedChange(value: boolean): void;
  value: RegisterFacts['temporaryWorkCompany'];
}) {
  return (
    <div className="grid gap-3">
      <Toggle
        name={`${prefix}Required`}
        checked={checked}
        onCheckedChange={onCheckedChange}
        label={`${title} concerné`}
      />
      {checked && (
        <div className="grid gap-4 rounded-lg border border-border-default p-4 sm:grid-cols-2">
          <TextField
            name={`${prefix}LegalName`}
            label="Raison sociale"
            defaultValue={value?.legalName ?? ''}
          />
          <TextField
            name={`${prefix}AddressLine1`}
            label="Adresse"
            defaultValue={value?.address.line1 ?? ''}
          />
          <TextField
            name={`${prefix}AddressLine2`}
            label="Complément"
            defaultValue={value?.address.line2 ?? ''}
            required={false}
          />
          <TextField
            name={`${prefix}PostalCode`}
            label="Code postal"
            defaultValue={value?.address.postalCode ?? ''}
          />
          <TextField
            name={`${prefix}City`}
            label="Ville"
            defaultValue={value?.address.city ?? ''}
          />
          <TextField
            name={`${prefix}CountryCode`}
            label="Code pays"
            defaultValue={value?.address.countryCode ?? 'FR'}
            maxLength={2}
          />
        </div>
      )}
    </div>
  );
}
