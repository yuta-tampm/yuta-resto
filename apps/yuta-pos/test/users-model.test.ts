import type { LocalUser } from '@yuta/contracts/local-pos';
import { describe, expect, it } from 'vitest';
import {
  canManageLocalUser,
  isLastActiveAdmin,
  manageableRoles,
  roleLabel,
  roleTone,
} from '../src/app/management/users/users-model';

const admin: LocalUser = {
  id: '0194f297-7c00-7000-8000-000000000001',
  name: 'Admin',
  email: null,
  role: 'admin',
  isActive: true,
};

describe('users management model', () => {
  it('protects the only active administrator', () => {
    expect(isLastActiveAdmin(admin, [admin])).toBe(true);
  });

  it('allows either administrator when another active admin exists', () => {
    const secondAdmin: LocalUser = {
      ...admin,
      id: '0194f297-7c00-7000-8000-000000000002',
    };

    expect(isLastActiveAdmin(admin, [admin, secondAdmin])).toBe(false);
    expect(isLastActiveAdmin(secondAdmin, [admin, secondAdmin])).toBe(false);
  });

  it('does not protect inactive admins or non-admin users', () => {
    expect(
      isLastActiveAdmin({ ...admin, isActive: false }, [
        { ...admin, isActive: false },
      ]),
    ).toBe(false);
    expect(
      isLastActiveAdmin({ ...admin, role: 'manager' }, [
        { ...admin, role: 'manager' },
      ]),
    ).toBe(false);
  });

  it('keeps admin and manager management boundaries explicit', () => {
    const manager = { ...admin, role: 'manager' as const };
    const staff = { ...admin, role: 'staff' as const };
    const kitchen = { ...admin, role: 'kitchen' as const };

    expect(canManageLocalUser('admin', manager)).toBe(true);
    expect(canManageLocalUser('manager', admin)).toBe(false);
    expect(canManageLocalUser('manager', manager)).toBe(false);
    expect(canManageLocalUser('manager', staff)).toBe(true);
    expect(canManageLocalUser('manager', kitchen)).toBe(true);
    expect(manageableRoles('admin')).toEqual([
      'admin',
      'manager',
      'staff',
      'kitchen',
    ]);
    expect(manageableRoles('manager')).toEqual(['staff', 'kitchen']);
  });

  it('maps role labels and semantic tones without UI state', () => {
    expect(roleLabel('admin')).toBe('Administrateur');
    expect(roleLabel('manager')).toBe('Manager');
    expect(roleLabel('staff')).toBe('Service');
    expect(roleLabel('kitchen')).toBe('Cuisine');
    expect(roleTone('admin')).toBe('brand');
    expect(roleTone('manager')).toBe('info');
    expect(roleTone('staff')).toBe('neutral');
    expect(roleTone('kitchen')).toBe('warning');
  });
});
