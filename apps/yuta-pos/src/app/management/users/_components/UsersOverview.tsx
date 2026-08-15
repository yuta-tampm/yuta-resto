'use client';

import type { LocalUser } from '@yuta/contracts/local-pos';
import {
  Badge,
  SimpleTable,
  SimpleTableBody,
  SimpleTableCell,
  SimpleTableHead,
  SimpleTableHeader,
  SimpleTableRow,
} from '@yuta/ui';
import { ShieldAlert } from 'lucide-react';
import {
  ActivationDialog,
  EditUserDialog,
  ResetPinDialog,
} from './UserDialogs';
import {
  canManageLocalUser,
  isLastActiveAdmin,
  roleLabel,
  roleTone,
} from './users-model';

export function UsersOverview({
  users,
  actorRole,
}: {
  users: LocalUser[];
  actorRole: LocalUser['role'];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-surface shadow-sm">
      <SimpleTable className="min-w-0">
        <SimpleTableHeader className="hidden md:table-header-group">
          <SimpleTableRow>
            <SimpleTableHead>Utilisateur</SimpleTableHead>
            <SimpleTableHead>Rôle</SimpleTableHead>
            <SimpleTableHead>État</SimpleTableHead>
            <SimpleTableHead className="text-right">Actions</SimpleTableHead>
          </SimpleTableRow>
        </SimpleTableHeader>
        <SimpleTableBody className="grid divide-y-0 gap-3 bg-canvas p-3 md:table-row-group md:divide-y md:bg-transparent md:p-0">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              actorRole={actorRole}
              lastActiveAdmin={isLastActiveAdmin(user, users)}
            />
          ))}
        </SimpleTableBody>
      </SimpleTable>
    </div>
  );
}

function UserRow({
  user,
  actorRole,
  lastActiveAdmin,
}: {
  user: LocalUser;
  actorRole: LocalUser['role'];
  lastActiveAdmin: boolean;
}) {
  const canManage = canManageLocalUser(actorRole, user);

  return (
    <SimpleTableRow className="grid rounded-lg border border-border-default bg-surface p-4 hover:bg-surface md:table-row md:rounded-none md:border-0 md:p-0 md:hover:bg-surface-muted/70">
      <SimpleTableCell className="p-0 md:px-4 md:py-3">
        <p className="font-bold">{user.name}</p>
        <p className="text-xs text-secondary">{user.email ?? 'Sans e-mail'}</p>
        {lastActiveAdmin && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-status-warning md:mt-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            Dernier administrateur actif
          </p>
        )}
      </SimpleTableCell>
      <SimpleTableCell className="flex items-center justify-between px-0 pb-0 pt-3 md:table-cell md:px-4 md:py-3">
        <span className="text-xs font-bold uppercase text-muted md:sr-only">
          Rôle
        </span>
        <Badge tone={roleTone(user.role)}>{roleLabel(user.role)}</Badge>
      </SimpleTableCell>
      <SimpleTableCell className="flex items-center justify-between px-0 pb-0 pt-3 md:table-cell md:px-4 md:py-3">
        <span className="text-xs font-bold uppercase text-muted md:sr-only">
          État
        </span>
        <Badge tone={user.isActive ? 'success' : 'neutral'}>
          {user.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      </SimpleTableCell>
      <SimpleTableCell className="px-0 pb-0 pt-4 md:px-4 md:py-3">
        {canManage ? (
          <div className="grid grid-cols-2 gap-2 md:flex md:justify-end">
            <EditUserDialog
              user={user}
              actorRole={actorRole}
              lastActiveAdmin={lastActiveAdmin}
            />
            <ResetPinDialog user={user} />
            <ActivationDialog user={user} lastActiveAdmin={lastActiveAdmin} />
          </div>
        ) : (
          <p className="text-right text-xs text-muted">Réservé à l’admin</p>
        )}
      </SimpleTableCell>
    </SimpleTableRow>
  );
}
