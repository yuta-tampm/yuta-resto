'use client';

import type { LocalUser } from '@yuta/contracts/local-pos';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yuta/ui';
import {
  KeyRound,
  Pencil,
  Plus,
  ShieldAlert,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useActionState, useState } from 'react';
import {
  createLocalUserAction,
  resetLocalUserPinAction,
  setLocalUserActiveAction,
  updateLocalUserAction,
} from '../actions';
import { manageableRoles } from '../users-model';
import { initialLocalUserActionState } from '../users-action-state';
import {
  ActionFeedback,
  LocalUserActionSuccess,
  useCloseOnSuccess,
} from './UserActionFeedback';
import { PinInputField, UserFields } from './UserFormFields';

const dialogContentClassName =
  '[&>button:last-child]:inline-flex [&>button:last-child]:min-h-11 [&>button:last-child]:min-w-11 [&>button:last-child]:items-center [&>button:last-child]:justify-center';

export function CreateUserDialog({
  actorRole,
}: {
  actorRole: LocalUser['role'];
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    createLocalUserAction,
    initialLocalUserActionState,
  );

  useCloseOnSuccess(state, setOpen);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => !pending && setOpen(nextOpen)}
      >
        <DialogTrigger asChild>
          <Button className="min-h-11 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </DialogTrigger>
        <DialogContent className={dialogContentClassName}>
          <DialogHeader>
            <DialogTitle>Nouvel utilisateur POS</DialogTitle>
            <DialogDescription>
              Le PIN reste local et n’est jamais envoyé vers le cloud.
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="grid gap-4">
            <UserFields roles={manageableRoles(actorRole)} />
            <PinInputField
              name="pin"
              label="Code PIN"
              hint="Entre 4 et 8 chiffres."
            />
            <ActionFeedback state={state} />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" className="min-h-11" loading={pending}>
                Créer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <LocalUserActionSuccess state={state} />
    </>
  );
}

export function EditUserDialog({
  user,
  actorRole,
  lastActiveAdmin,
}: {
  user: LocalUser;
  actorRole: LocalUser['role'];
  lastActiveAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    updateLocalUserAction.bind(null, user.id),
    initialLocalUserActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => !pending && setOpen(nextOpen)}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            aria-label={`Modifier ${user.name}`}
          >
            <Pencil className="h-4 w-4" />
            <span className="md:sr-only xl:not-sr-only">Modifier</span>
          </Button>
        </DialogTrigger>
        <DialogContent className={dialogContentClassName}>
          <DialogHeader>
            <DialogTitle>Modifier {user.name}</DialogTitle>
            <DialogDescription>
              Un changement de rôle invalide les sessions existantes.
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="grid gap-4">
            <UserFields
              roles={manageableRoles(actorRole)}
              user={user}
              includeStatus
              protectActiveAdmin={lastActiveAdmin}
            />
            {lastActiveAdmin && (
              <Alert tone="warning" icon={<ShieldAlert className="h-5 w-5" />}>
                <AlertTitle>Dernier administrateur actif</AlertTitle>
                <AlertDescription>
                  Créez un autre administrateur actif avant de modifier son rôle
                  ou de le désactiver.
                </AlertDescription>
              </Alert>
            )}
            <ActionFeedback state={state} />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" className="min-h-11" loading={pending}>
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <LocalUserActionSuccess state={state} />
    </>
  );
}

export function ResetPinDialog({ user }: { user: LocalUser }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    resetLocalUserPinAction.bind(null, user.id),
    initialLocalUserActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => !pending && setOpen(nextOpen)}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            aria-label={`Changer le PIN de ${user.name}`}
          >
            <KeyRound className="h-4 w-4" />
            <span className="md:sr-only xl:not-sr-only">Changer le PIN</span>
          </Button>
        </DialogTrigger>
        <DialogContent className={dialogContentClassName}>
          <DialogHeader>
            <DialogTitle>Changer le PIN</DialogTitle>
            <DialogDescription>
              Toutes les sessions de {user.name} seront invalidées.
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="grid gap-4">
            <PinInputField name="pin" label="Nouveau PIN" />
            <PinInputField name="pinConfirmation" label="Confirmer le PIN" />
            <ActionFeedback state={state} />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" className="min-h-11" loading={pending}>
                Modifier le PIN
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <LocalUserActionSuccess state={state} />
    </>
  );
}

export function ActivationDialog({
  user,
  lastActiveAdmin,
}: {
  user: LocalUser;
  lastActiveAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    setLocalUserActiveAction.bind(null, user.id, !user.isActive),
    initialLocalUserActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <>
      <Button
        type="button"
        variant={user.isActive ? 'danger' : 'secondary'}
        size="sm"
        className="col-span-2 min-h-11 md:col-auto"
        loading={pending}
        disabled={lastActiveAdmin}
        aria-label={`${user.isActive ? 'Désactiver' : 'Activer'} ${user.name}`}
        onClick={() => setOpen(true)}
      >
        {user.isActive ? (
          <UserX className="h-4 w-4" />
        ) : (
          <UserCheck className="h-4 w-4" />
        )}
        <span className="md:sr-only xl:not-sr-only">
          {user.isActive ? 'Désactiver' : 'Activer'}
        </span>
      </Button>
      {lastActiveAdmin && (
        <span className="sr-only" role="status">
          Le dernier administrateur actif ne peut pas être désactivé.
        </span>
      )}
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => !pending && setOpen(nextOpen)}
      >
        <DialogContent className={dialogContentClassName}>
          <DialogHeader>
            <DialogTitle>
              {user.isActive ? 'Désactiver' : 'Activer'} {user.name} ?
            </DialogTitle>
            <DialogDescription>
              {user.isActive
                ? 'Ses sessions seront invalidées immédiatement.'
                : 'Cet utilisateur pourra de nouveau se connecter au POS.'}
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="grid gap-4">
            <ActionFeedback state={state} />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant={user.isActive ? 'danger' : 'primary'}
                className="min-h-11"
                loading={pending}
              >
                {user.isActive ? 'Désactiver' : 'Activer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <LocalUserActionSuccess state={state} />
    </>
  );
}
