import type { LocalUser } from '@yuta/contracts/local-pos';

const allRoles: LocalUser['role'][] = ['admin', 'manager', 'staff', 'kitchen'];

export function isLastActiveAdmin(
  user: LocalUser,
  users: LocalUser[],
): boolean {
  return (
    user.role === 'admin' &&
    user.isActive &&
    users.filter(
      (candidate) => candidate.role === 'admin' && candidate.isActive,
    ).length === 1
  );
}

export function canManageLocalUser(
  actorRole: LocalUser['role'],
  user: LocalUser,
): boolean {
  return (
    actorRole === 'admin' || user.role === 'staff' || user.role === 'kitchen'
  );
}

export function manageableRoles(
  actorRole: LocalUser['role'],
): LocalUser['role'][] {
  return actorRole === 'admin' ? allRoles : ['staff', 'kitchen'];
}

export function roleLabel(role: LocalUser['role']): string {
  const labels: Record<LocalUser['role'], string> = {
    admin: 'Administrateur',
    manager: 'Manager',
    staff: 'Service',
    kitchen: 'Cuisine',
  };
  return labels[role];
}

export function roleTone(
  role: LocalUser['role'],
): 'brand' | 'info' | 'neutral' | 'warning' {
  const tones: Record<
    LocalUser['role'],
    'brand' | 'info' | 'neutral' | 'warning'
  > = {
    admin: 'brand',
    manager: 'info',
    staff: 'neutral',
    kitchen: 'warning',
  };
  return tones[role];
}
