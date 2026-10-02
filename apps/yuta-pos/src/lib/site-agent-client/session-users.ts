import {
  createLocalUserInputSchema,
  localAuthLoginInputSchema,
  localAuthLoginResponseSchema,
  localAuthLogoutResponseSchema,
  localAuthSessionResponseSchema,
  localPosRoutes,
  localUserResponseSchema,
  localUsersResponseSchema,
  siteAgentHealthResponseSchema,
  resetLocalUserPinInputSchema,
  updateLocalUserInputSchema,
  type CreateLocalUserInput,
  type LocalAuthLoginInput,
  type ResetLocalUserPinInput,
  type UpdateLocalUserInput,
} from '@yuta/contracts/local-pos';
import type { SiteAgentTransport } from './http';

/** Health, local session authentication and local user management. */
export function createSessionAndUserMethods({ request }: SiteAgentTransport) {
  return {
    async getHealth() {
      return request(localPosRoutes.health, siteAgentHealthResponseSchema);
    },
    async signInLocalUser(input: LocalAuthLoginInput) {
      const body = localAuthLoginInputSchema.parse(input);
      return request(localPosRoutes.authLogin, localAuthLoginResponseSchema, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    },
    async getLocalSession(token: string) {
      return request(
        localPosRoutes.authSession,
        localAuthSessionResponseSchema,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    async signOutLocalSession(token: string) {
      return request(
        localPosRoutes.authSession,
        localAuthLogoutResponseSchema,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    async listLocalUsers() {
      return request(localPosRoutes.localUsers, localUsersResponseSchema);
    },
    async createLocalUser(token: string, input: CreateLocalUserInput) {
      const body = createLocalUserInputSchema.parse(input);
      return request(localPosRoutes.localUsers, localUserResponseSchema, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    },
    async updateLocalUser(
      token: string,
      userId: string,
      input: UpdateLocalUserInput,
    ) {
      const body = updateLocalUserInputSchema.parse(input);
      return request(
        `${localPosRoutes.localUsers}/${encodeURIComponent(userId)}`,
        localUserResponseSchema,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
    },
    async resetLocalUserPin(
      token: string,
      userId: string,
      input: ResetLocalUserPinInput,
    ) {
      const body = resetLocalUserPinInputSchema.parse(input);
      return request(
        `${localPosRoutes.localUsers}/${encodeURIComponent(userId)}/pin`,
        localUserResponseSchema,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
    },
  };
}
