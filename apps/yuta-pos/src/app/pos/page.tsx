import type { LocalUser } from '@yuta/contracts/local-pos';
import { Badge, Button } from '@yuta/ui';
import { ChefHat, ClipboardList } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { selectedStaffCookieName, staffSelectableRoles } from '../_pos-helpers';
import { PosPageShell } from '../../components/pos/PosPageShell';
import { posApi } from '../../lib/pos-api';
import { OrderEntryForm } from './_components/OrderEntryForm';

export const dynamic = 'force-dynamic';

export default async function PosHome() {
  let users: LocalUser[] = [];
  let loadFailed = false;
  try {
    ({ users } = await posApi.listLocalUsers());
  } catch (error: unknown) {
    loadFailed = true;
    console.error('POS order-entry staff loading failed.', error);
  }
  const staffUsers = users.filter(
    (user) =>
      user.isActive &&
      staffSelectableRoles.includes(
        user.role as (typeof staffSelectableRoles)[number],
      ),
  );
  const cookieStore = await cookies();
  const selectedStaffUserId = cookieStore.get(selectedStaffCookieName)?.value;
  const defaultStaffUserId = getDefaultStaffUserId(
    staffUsers,
    selectedStaffUserId,
  );

  return (
    <PosPageShell
      title="Nouvelle commande"
      description="Creer une commande pour le service"
      actions={
        <>
          <Badge
            variant="outline"
            className="hidden h-9 gap-2 border-white/25 px-4 text-sm text-white md:flex"
          >
            <span
              className="h-2.5 w-2.5 rounded-full bg-status-success"
              aria-hidden="true"
            />
            Service actif
          </Badge>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="sm:min-h-14 sm:px-7"
          >
            <Link href="/">
              <ClipboardList className="h-4 w-4" />
              Commandes
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="sm:min-h-14 sm:px-7"
          >
            <Link href="/kitchen">
              <ChefHat className="h-4 w-4" />
              Cuisine
            </Link>
          </Button>
        </>
      }
      prominentHeader
      maxWidthClassName="max-w-none"
      contentClassName="px-4 py-5 sm:px-6 sm:py-8"
    >
      <OrderEntryForm
        staffUsers={staffUsers}
        defaultStaffUserId={defaultStaffUserId}
        loadFailed={loadFailed}
      />
    </PosPageShell>
  );
}

function getDefaultStaffUserId(
  staffUsers: LocalUser[],
  selectedStaffUserId: string | undefined,
): string | undefined {
  if (
    selectedStaffUserId &&
    staffUsers.some((staffUser) => staffUser.id === selectedStaffUserId)
  ) {
    return selectedStaffUserId;
  }

  return (
    staffUsers.find((staffUser) => staffUser.email === 'staff@yuta.local')
      ?.id ?? staffUsers[0]?.id
  );
}
