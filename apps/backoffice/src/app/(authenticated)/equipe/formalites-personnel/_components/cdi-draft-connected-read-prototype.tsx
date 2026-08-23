import type { CdiDraftConnectedReadModel } from '../_lib/cdi-draft-connected-read-model';
import { CdiDraftReadinessPrototype } from './cdi-draft-readiness-prototype';

export function CdiDraftConnectedReadPrototype({
  model,
  employeeDossierHref,
}: {
  model: CdiDraftConnectedReadModel;
  employeeDossierHref: string;
}) {
  return (
    <CdiDraftReadinessPrototype
      data={{
        fictionalEmployee: model.employeeName,
        reusableFields: model.fields,
      }}
      connectedEmployeeDossierHref={employeeDossierHref}
    />
  );
}
