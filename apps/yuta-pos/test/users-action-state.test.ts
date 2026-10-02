import { describe, expect, it } from 'vitest';
import { SiteAgentClientError } from '../src/lib/site-agent-client';
import { toLocalUserActionError } from '../src/app/management/users/users-action-state';

describe('users action state', () => {
  it('offers refresh recovery when the edited user is stale', () => {
    expect(
      toLocalUserActionError(
        new SiteAgentClientError(404, 'LOCAL_USER_NOT_FOUND', 'missing'),
      ),
    ).toEqual({
      error: "L'utilisateur n'existe plus.",
      success: null,
      recovery: 'refresh',
    });
  });

  it.each([
    ['LOCAL_USER_EMAIL_CONFLICT', 'Cette adresse e-mail est déjà utilisée.'],
    [
      'LAST_ACTIVE_ADMIN_REQUIRED',
      'Le dernier administrateur actif ne peut pas être désactivé ou rétrogradé.',
    ],
    [
      'LOCAL_USER_MANAGEMENT_FORBIDDEN',
      "Vous n'avez pas le droit de gérer ce rôle.",
    ],
  ])('maps %s without discarding the current editor', (code, message) => {
    expect(
      toLocalUserActionError(new SiteAgentClientError(409, code, 'source')),
    ).toEqual({ error: message, success: null });
  });

  it('maps local service failure truthfully', () => {
    expect(toLocalUserActionError(new Error('offline'))).toEqual({
      error: 'Site-agent indisponible.',
      success: null,
    });
  });
});
