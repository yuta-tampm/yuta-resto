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
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuta/ui';
import {
  KeyRound,
  Pencil,
  Plus,
  ShieldAlert,
  UserCheck,
  UserX,
  CheckCircle2,
  RefreshCw,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useId, useState } from 'react';
import {
  createLocalUserAction,
  resetLocalUserPinAction,
  setLocalUserActiveAction,
  updateLocalUserAction,
} from './actions';
import { manageableRoles, roleLabel } from './users-model';
import {
  initialLocalUserActionState,
  type LocalUserActionState,
} from './users-action-state';

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

function UserFields({
  roles,
  user,
  includeStatus = false,
  protectActiveAdmin = false,
}: {
  roles: LocalUser['role'][];
  user?: LocalUser;
  includeStatus?: boolean;
  protectActiveAdmin?: boolean;
}) {
  const nameId = useId();
  const emailId = useId();
  const roleId = useId();
  const statusId = useId();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState<LocalUser['role']>(
    user?.role ?? roles[0] ?? 'staff',
  );
  const [isActive, setIsActive] = useState(user?.isActive ?? true);

  return (
    <>
      <FormField label={<label htmlFor={nameId}>Nom</label>}>
        <Input
          id={nameId}
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={255}
          required
        />
      </FormField>
      <FormField
        label={<label htmlFor={emailId}>E-mail</label>}
        hint="Facultatif, uniquement local."
      >
        <Input
          id={emailId}
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={320}
        />
      </FormField>
      <FormField label={<label htmlFor={roleId}>Rôle</label>}>
        <input type="hidden" name="role" value={role} />
        <Select
          value={role}
          onValueChange={(value) => setRole(value as LocalUser['role'])}
        >
          <SelectTrigger id={roleId} className="min-h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((value) => (
              <SelectItem
                key={value}
                value={value}
                disabled={protectActiveAdmin && value !== 'admin'}
              >
                {roleLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      {includeStatus && (
        <FormField label={<label htmlFor={statusId}>État</label>}>
          <input
            type="hidden"
            name="isActive"
            value={isActive ? 'true' : 'false'}
          />
          <Select
            value={isActive ? 'active' : 'inactive'}
            onValueChange={(value) => setIsActive(value === 'active')}
          >
            <SelectTrigger id={statusId} className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive" disabled={protectActiveAdmin}>
                Inactif
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      )}
    </>
  );
}

function PinInputField({
  name,
  label,
  hint,
}: {
  name: 'pin' | 'pinConfirmation';
  label: string;
  hint?: string;
}) {
  const id = useId();
  const [value, setValue] = useState('');

  return (
    <FormField label={<label htmlFor={id}>{label}</label>} hint={hint}>
      <Input
        id={id}
        name={name}
        type="password"
        inputMode="numeric"
        pattern="[0-9]{4,8}"
        minLength={4}
        maxLength={8}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required
      />
    </FormField>
  );
}

function ActionFeedback({ state }: { state: LocalUserActionState }) {
  if (!state.error) return null;
  return (
    <Alert tone="danger" role="alert">
      <AlertTitle>Impossible d’enregistrer</AlertTitle>
      <AlertDescription>{state.error}</AlertDescription>
      {state.recovery === 'refresh' && <RefreshRecoveryButton />}
    </Alert>
  );
}

function RefreshRecoveryButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="mt-3 min-h-11"
      onClick={() => router.refresh()}
    >
      <RefreshCw className="h-4 w-4" />
      Actualiser
    </Button>
  );
}

function LocalUserActionSuccess({ state }: { state: LocalUserActionState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state.success) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timeoutId = window.setTimeout(() => setVisible(false), 5_000);
    return () => window.clearTimeout(timeoutId);
  }, [state]);

  if (!state.success || !visible) return null;

  return (
    <Alert
      tone="success"
      icon={<CheckCircle2 className="h-5 w-5" />}
      className="fixed right-4 top-4 z-[70] w-[calc(100%-2rem)] max-w-sm pr-12 shadow-lg"
      role="status"
      aria-live="polite"
    >
      <AlertTitle>Modification enregistrée</AlertTitle>
      <AlertDescription>{state.success}</AlertDescription>
      <button
        type="button"
        className="absolute right-1 top-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-focus-ring"
        aria-label="Fermer la confirmation"
        onClick={() => setVisible(false)}
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
}

function useCloseOnSuccess(
  state: LocalUserActionState,
  setOpen: (open: boolean) => void,
) {
  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success, setOpen]);
}
