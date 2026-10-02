'use client';

import type {
  ReputationReviewSocialLinkField,
  ReputationReviewSocialLinksOutcome,
  ReputationReviewSocialLinksSaveInput,
} from '@yuta/contracts/reputation';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  FormField,
  Input,
  Label,
  Skeleton,
} from '@yuta/ui';
import { Link2, RefreshCw, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from 'react';
import {
  applyReviewSocialLinksOutcome,
  canSubmitReviewSocialLinks,
  createReviewSocialLinksSubmissionGate,
  createReviewSocialLinksViewState,
  prepareReviewSocialLinksSave,
  reloadReviewSocialLinksConflict,
  updateReviewSocialLinksDraft,
  validateReviewSocialLinksDraft,
  type ReviewSocialLinksInitialOutcome,
} from '../_lib/review-social-links-state';

type SaveAction = (
  input: ReputationReviewSocialLinksSaveInput,
) => Promise<ReputationReviewSocialLinksOutcome>;

const fieldDefinitions: ReadonlyArray<{
  field: ReputationReviewSocialLinkField;
  label: string;
  placeholder: string;
}> = [
  {
    field: 'googleReviewUrl',
    label: 'Lien Google',
    placeholder: 'https://g.page/votre-restaurant/review',
  },
  {
    field: 'facebookReviewUrl',
    label: 'Lien Facebook',
    placeholder: 'https://www.facebook.com/votre-restaurant',
  },
  {
    field: 'instagramUrl',
    label: 'Lien Instagram',
    placeholder: 'https://www.instagram.com/votre-restaurant',
  },
];

export function ReviewSocialLinksSettings({
  initialOutcome,
  saveAction,
}: {
  initialOutcome: ReviewSocialLinksInitialOutcome;
  saveAction: SaveAction;
}) {
  const router = useRouter();
  const [view, setView] = useState(() =>
    createReviewSocialLinksViewState(initialOutcome),
  );
  const [isPending, startTransition] = useTransition();
  const submissionGate = useRef(createReviewSocialLinksSubmissionGate());
  const googleRef = useRef<HTMLInputElement>(null);
  const facebookRef = useRef<HTMLInputElement>(null);
  const instagramRef = useRef<HTMLInputElement>(null);
  const inputRefs = {
    googleReviewUrl: googleRef,
    facebookReviewUrl: facebookRef,
    instagramUrl: instagramRef,
  };

  useEffect(() => {
    setView(createReviewSocialLinksViewState(initialOutcome));
  }, [initialOutcome]);

  const hasModel = Boolean(view.baseline);
  const fieldsDisabled =
    !hasModel || isPending || view.status === 'configuration_unavailable';
  const saveEnabled = canSubmitReviewSocialLinks(view) && !isPending;

  const submit = () => {
    if (isPending || !submissionGate.current.tryStart()) return;
    const prepared = prepareReviewSocialLinksSave(view);
    setView(prepared.state);
    if (prepared.kind !== 'ready') {
      submissionGate.current.finish();
      if (prepared.focusField) {
        inputRefs[prepared.focusField].current?.focus();
      }
      return;
    }

    startTransition(async () => {
      try {
        const outcome = await saveAction(prepared.input);
        setView((current) => applyReviewSocialLinksOutcome(current, outcome));
      } catch {
        setView((current) =>
          applyReviewSocialLinksOutcome(current, { kind: 'server_error' }),
        );
      } finally {
        submissionGate.current.finish();
      }
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const reloadConflict = () => {
    setView((current) => reloadReviewSocialLinksConflict(current));
    router.refresh();
  };

  return (
    <section aria-labelledby="review-social-links-heading">
      <Card>
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-lg bg-surface-selected p-2 text-brand-700">
            <Link2 className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2
              id="review-social-links-heading"
              className="font-bold text-primary"
            >
              Liens d’avis et réseaux sociaux
            </h2>
            <p className="mt-1 text-sm text-muted">
              Renseignez les destinations publiques utilisées pour recueillir
              des avis et présenter vos réseaux sociaux.
            </p>
          </div>
        </div>

        <SettingsFeedback
          status={view.status}
          hasModel={hasModel}
          onRetry={hasModel ? submit : () => router.refresh()}
          onReloadConflict={reloadConflict}
        />

        <form
          className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end"
          aria-busy={isPending}
          noValidate
          onSubmit={onSubmit}
        >
          {fieldDefinitions.map(({ field, label, placeholder }, index) => {
            const inputId = `review-social-links-${field}`;
            const errorId = `${inputId}-error`;
            const error = view.fieldErrors[field];
            return (
              <FormField
                key={field}
                className={
                  index === 0 ? 'lg:col-span-2 xl:col-span-1' : undefined
                }
                label={<Label htmlFor={inputId}>{label}</Label>}
                error={error ? <span id={errorId}>{error}</span> : undefined}
              >
                <Input
                  ref={inputRefs[field]}
                  id={inputId}
                  name={field}
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  maxLength={2048}
                  value={view.draft[field]}
                  placeholder={placeholder}
                  disabled={fieldsDisabled}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onBlur={() =>
                    setView((current) =>
                      validateReviewSocialLinksDraft(current),
                    )
                  }
                  onChange={(event) =>
                    setView((current) =>
                      updateReviewSocialLinksDraft(
                        current,
                        field,
                        event.target.value,
                      ),
                    )
                  }
                />
              </FormField>
            );
          })}

          <div className="flex justify-end lg:col-span-2 xl:col-span-1">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!saveEnabled}
              loading={isPending}
            >
              <Save className="h-4 w-4" aria-hidden />
              {isPending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}

export function ReviewSocialLinksSettingsLoading() {
  return (
    <section
      aria-labelledby="review-social-links-loading-heading"
      aria-busy="true"
    >
      <Card>
        <h2
          id="review-social-links-loading-heading"
          className="font-bold text-primary"
        >
          Liens d’avis et réseaux sociaux
        </h2>
        <span className="sr-only" role="status">
          Chargement de la configuration…
        </span>
        <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-16 lg:col-span-2 xl:col-span-1" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-10 self-end" />
        </div>
      </Card>
    </section>
  );
}

function SettingsFeedback({
  status,
  hasModel,
  onRetry,
  onReloadConflict,
}: {
  status:
    | 'idle'
    | 'dirty'
    | 'invalid'
    | 'saving'
    | 'saved'
    | 'no_change'
    | 'server_error'
    | 'conflict'
    | 'configuration_unavailable';
  hasModel: boolean;
  onRetry(): void;
  onReloadConflict(): void;
}) {
  if (status === 'dirty') {
    return (
      <p className="text-sm font-medium text-muted" role="status">
        Modifications non enregistrées
      </p>
    );
  }
  if (status === 'saving') {
    return (
      <p className="text-sm font-medium text-muted" role="status">
        Enregistrement en cours…
      </p>
    );
  }
  if (status === 'saved') {
    return (
      <Alert tone="success">
        <AlertDescription>Liens enregistrés.</AlertDescription>
      </Alert>
    );
  }
  if (status === 'no_change') {
    return (
      <Alert>
        <AlertDescription>Aucune modification à enregistrer.</AlertDescription>
      </Alert>
    );
  }
  if (status === 'server_error') {
    return (
      <Alert tone="danger" role="alert">
        <AlertDescription>
          La configuration n’a pas pu être enregistrée ou chargée. Vos saisies
          sont conservées.
        </AlertDescription>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Réessayer
        </Button>
      </Alert>
    );
  }
  if (status === 'conflict') {
    return (
      <Alert tone="warning" role="alert">
        <AlertDescription>
          Ces liens ont été modifiés ailleurs. Rechargez les valeurs actuelles
          avant de poursuivre.
        </AlertDescription>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onReloadConflict}
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Recharger les valeurs
        </Button>
      </Alert>
    );
  }
  if (status === 'configuration_unavailable') {
    return (
      <Alert tone="warning" role="alert">
        <AlertDescription>Configuration indisponible</AlertDescription>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Réessayer
        </Button>
      </Alert>
    );
  }
  if (status === 'invalid' && !hasModel) {
    return (
      <Alert tone="danger" role="alert">
        <AlertDescription>Informations à vérifier.</AlertDescription>
      </Alert>
    );
  }
  return null;
}
