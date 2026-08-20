'use client';

import type { LocalEstablishmentProfile } from '@yuta/contracts/local-pos';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  FormField,
  Input,
  Label,
} from '@yuta/ui';
import {
  CheckCircle2,
  CloudOff,
  RefreshCw,
  RotateCcw,
  Save,
  TriangleAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { saveEstablishmentProfileAction } from '../actions';
import { initialEstablishmentProfileActionState } from '../_lib/establishment-profile-action-state';
import { getEstablishmentProfileFormState } from '../_lib/establishment-profile-form';

export function EstablishmentProfileForm({
  profile,
}: {
  profile: LocalEstablishmentProfile;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    saveEstablishmentProfileAction,
    initialEstablishmentProfileActionState,
  );
  const [baseline, setBaseline] = useState(profile.displayName ?? '');
  const [draft, setDraft] = useState(profile.displayName ?? '');
  const effectiveProfile = state.profile ?? profile;
  const formState = getEstablishmentProfileFormState({
    baseline,
    draft,
    revision: effectiveProfile.revision,
  });

  useEffect(() => {
    if (state.status !== 'success' || !state.profile?.displayName) return;
    setBaseline(state.profile.displayName);
    setDraft(state.profile.displayName);
  }, [state]);

  return (
    <div className="grid max-w-3xl gap-4">
      <Card padding="lg" radius="lg">
        <form
          action={action}
          aria-label="Identité locale"
          className="grid gap-6"
        >
          <input
            type="hidden"
            name="revision"
            value={effectiveProfile.revision}
          />

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-primary">
                Identité locale
              </h2>
              <p className="mt-1 text-sm font-medium text-muted">
                Nom propre à cette installation POS, sans synchronisation cloud.
              </p>
            </div>
            {formState.isDirty ? (
              <Badge tone="warning">Modifications non enregistrées</Badge>
            ) : effectiveProfile.displayName ? (
              <Badge tone="success">Configuré</Badge>
            ) : (
              <Badge tone="neutral">Non configuré</Badge>
            )}
          </div>

          <FormField
            label={
              <Label htmlFor="establishment-display-name">
                Nom affiché du restaurant
              </Label>
            }
            hint={
              <span id="establishment-display-name-hint">
                1 à 80 caractères. Ce nom sera ajouté uniquement aux nouveaux
                reçus de paiement non fiscaux.
              </span>
            }
            error={
              state.fieldError ? (
                <span id="establishment-display-name-error">
                  {state.fieldError}
                </span>
              ) : undefined
            }
          >
            <Input
              id="establishment-display-name"
              name="displayName"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-describedby={
                state.fieldError
                  ? 'establishment-display-name-hint establishment-display-name-error'
                  : 'establishment-display-name-hint'
              }
              aria-invalid={Boolean(state.fieldError)}
              autoComplete="organization"
              maxLength={80}
              size="lg"
              disabled={pending}
            />
          </FormField>

          {state.status === 'success' ? (
            <Alert
              tone="success"
              icon={<CheckCircle2 className="h-5 w-5" />}
              aria-live="polite"
            >
              <AlertTitle>Enregistrement terminé</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          {state.status === 'error' ? (
            <Alert
              tone="danger"
              icon={<TriangleAlert className="h-5 w-5" />}
              aria-live="polite"
            >
              <AlertTitle>Enregistrement impossible</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          {state.status === 'conflict' ? (
            <Alert
              tone="warning"
              icon={<RefreshCw className="h-5 w-5" />}
              aria-live="polite"
            >
              <AlertTitle>Données plus récentes disponibles</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-3 min-h-11"
                onClick={() => router.refresh()}
              >
                <RefreshCw className="h-4 w-4" />
                Recharger les données
              </Button>
            </Alert>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              disabled={pending || !formState.isDirty}
              onClick={() => setDraft(baseline)}
            >
              <RotateCcw className="h-4 w-4" />
              Annuler les modifications
            </Button>
            <Button
              type="submit"
              size="lg"
              loading={pending}
              disabled={!formState.isDirty || !formState.isValid}
            >
              <Save className="h-4 w-4" />
              {pending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>

          {effectiveProfile.updatedAt ? (
            <p className="text-xs font-medium text-muted">
              Dernière mise à jour locale :{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(effectiveProfile.updatedAt))}
            </p>
          ) : null}
        </form>
      </Card>

      <Alert tone="info" icon={<CloudOff className="h-5 w-5" />}>
        <AlertTitle>Aucune synchronisation cloud</AlertTitle>
        <AlertDescription>
          Les reçus déjà créés conservent leur nom d’origine. Cette identité
          locale n’est ni une raison sociale, ni une donnée fiscale.
        </AlertDescription>
      </Alert>
    </div>
  );
}
