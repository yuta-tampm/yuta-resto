export function formatDocumentSize(byteSize: number): string {
  if (byteSize < 1024 * 1024) return `${Math.ceil(byteSize / 1024)} Ko`;
  return `${(byteSize / (1024 * 1024)).toLocaleString('fr-FR', {
    maximumFractionDigits: 1,
  })} Mo`;
}

export function getDocumentFileSelectionLabel(filename: string | null) {
  return filename?.trim() || 'Aucun fichier sélectionné';
}
