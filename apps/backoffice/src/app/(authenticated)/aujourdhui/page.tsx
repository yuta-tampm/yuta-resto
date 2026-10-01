import { TodayDashboard } from './_components/today-dashboard';
import { loadTodayDashboard } from './today-data';
import { Alert, AlertDescription, AlertTitle } from '@yuta/ui';

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const data = await loadTodayDashboard();
  const { exposure } = await searchParams;
  const recovery =
    data.releaseA && (exposure === 'unavailable' || exposure === 'restricted');

  return (
    <>
      {recovery && (
        <Alert tone="info" className="mb-5">
          <AlertTitle>
            {exposure === 'restricted'
              ? 'Accès limité'
              : 'Fonctionnalité indisponible'}
          </AlertTitle>
          <AlertDescription>
            {exposure === 'restricted'
              ? 'Votre accès actuel ne permet pas cette opération. Contactez le propriétaire de l’établissement ou le support YUTA.'
              : 'Cette fonctionnalité n’est pas disponible dans votre espace actuel. Retrouvez ci-dessous les avis et les informations accessibles.'}
          </AlertDescription>
        </Alert>
      )}
      <TodayDashboard data={data} />
    </>
  );
}
