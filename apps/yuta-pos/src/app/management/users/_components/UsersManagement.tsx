import type { LocalUser } from '@yuta/contracts/local-pos';
import { Card } from '@yuta/ui';
import { UsersOverview } from './UsersOverview';

export function UsersManagement({
  users,
  actorRole,
}: {
  users: LocalUser[];
  actorRole: LocalUser['role'];
}) {
  if (users.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="font-bold">Aucun utilisateur POS</p>
        <p className="mt-1 text-sm text-secondary">
          Ajoutez un utilisateur pour permettre l’accès au terminal local.
        </p>
      </Card>
    );
  }

  return <UsersOverview users={users} actorRole={actorRole} />;
}
