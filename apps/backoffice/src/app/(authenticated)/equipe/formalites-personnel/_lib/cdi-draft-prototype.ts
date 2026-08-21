export type CdiDraftPrototypeField = {
  label: string;
  value: string;
};

export type CdiDraftPrototypeData = {
  fictionalEmployee: string;
  reusableFields: readonly CdiDraftPrototypeField[];
  formalityFields: readonly CdiDraftPrototypeField[];
};

export const cdiDraftPrototypeData: CdiDraftPrototypeData = {
  fictionalEmployee: 'Camille Martin',
  reusableFields: [
    { label: 'Identité', value: 'Camille Martin' },
    { label: 'Poste', value: 'Cheffe de rang' },
    { label: 'Qualification', value: 'Employée qualifiée' },
    { label: 'Type de contrat', value: 'CDI' },
    { label: "Date d'entrée prévue", value: '1 septembre 2026' },
    { label: 'Durée hebdomadaire', value: '35 h par semaine' },
  ],
  formalityFields: [
    { label: 'Adresse de la salariée', value: 'À compléter' },
    { label: 'Rémunération contractuelle', value: 'À compléter' },
    { label: "Période d'essai", value: 'À décider' },
  ],
};
