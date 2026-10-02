import type {
  PersonnelActionOverviewCorrectionItem,
  PersonnelActionOverviewDepartureItem,
} from '@yuta/contracts/personnel';

export function getActionPresentation(
  item:
    | PersonnelActionOverviewCorrectionItem
    | PersonnelActionOverviewDepartureItem,
  locale: string,
  businessDate: string,
): { reason: string; actionLabel: string } {
  if (item.kind === 'incomplete_employee_dossier') {
    return { reason: 'Dossier incomplet', actionLabel: 'Compléter le dossier' };
  }
  if (item.kind === 'missing_signed_base_contract') {
    return {
      reason: 'Contrat signé manquant',
      actionLabel: 'Ajouter le contrat',
    };
  }
  if (!('departureDate' in item)) {
    return { reason: 'Action à vérifier', actionLabel: 'Ouvrir le dossier' };
  }
  const days = calendarDayDifference(businessDate, item.departureDate);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
    new Date(`${item.departureDate}T12:00:00Z`),
  );
  const relative =
    days === 0
      ? 'Départ aujourd’hui'
      : `Départ dans ${days} jour${days > 1 ? 's' : ''}`;
  return { reason: `${relative} · ${date}`, actionLabel: 'Voir le départ' };
}

function calendarDayDifference(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) /
      86_400_000,
  );
}
