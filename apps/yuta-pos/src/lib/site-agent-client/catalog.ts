import {
  createLocalCatalogCategoryInputSchema,
  createLocalCatalogItemInputSchema,
  createLocalComboGroupInputSchema,
  createLocalComboGroupItemInputSchema,
  createLocalComboRuleInputSchema,
  localCatalogResponseSchema,
  localCatalogCategoryResponseSchema,
  localCatalogItemResponseSchema,
  localComboDeleteResponseSchema,
  localComboGroupItemResponseSchema,
  localComboGroupResponseSchema,
  localComboRuleResponseSchema,
  localPosRoutes,
  updateLocalCatalogCategoryInputSchema,
  updateLocalCatalogItemInputSchema,
  updateLocalComboGroupInputSchema,
  updateLocalComboGroupItemInputSchema,
  updateLocalComboRuleInputSchema,
  updateLocalInstructionSettingsInputSchema,
  localInstructionSettingsSchema,
  type CreateLocalCatalogCategoryInput,
  type CreateLocalCatalogItemInput,
  type CreateLocalComboGroupInput,
  type CreateLocalComboGroupItemInput,
  type CreateLocalComboRuleInput,
  type UpdateLocalCatalogCategoryInput,
  type UpdateLocalCatalogItemInput,
  type UpdateLocalComboGroupInput,
  type UpdateLocalComboGroupItemInput,
  type UpdateLocalComboRuleInput,
  type UpdateLocalInstructionSettingsInput,
} from '@yuta/contracts/local-pos';
import { managementJsonHeaders, type SiteAgentTransport } from './http';

/** Catalog, instruction settings and combo rule management. */
export function createCatalogMethods({ request }: SiteAgentTransport) {
  return {
    async getCatalog() {
      return request(localPosRoutes.catalog, localCatalogResponseSchema);
    },
    async updateInstructionSettings(
      token: string,
      input: UpdateLocalInstructionSettingsInput,
    ) {
      const body = updateLocalInstructionSettingsInputSchema.parse(input);
      return request(
        localPosRoutes.instructionSettings,
        localInstructionSettingsSchema,
        {
          method: 'PATCH',
          headers: managementJsonHeaders(token),
          body: JSON.stringify(body),
        },
      );
    },
    async createCatalogCategory(
      token: string,
      input: CreateLocalCatalogCategoryInput,
    ) {
      const body = createLocalCatalogCategoryInputSchema.parse(input);
      return request(
        localPosRoutes.catalogCategories,
        localCatalogCategoryResponseSchema,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
    },
    async updateCatalogCategory(
      token: string,
      categoryId: string,
      input: UpdateLocalCatalogCategoryInput,
    ) {
      const body = updateLocalCatalogCategoryInputSchema.parse(input);
      return request(
        `${localPosRoutes.catalogCategories}/${encodeURIComponent(categoryId)}`,
        localCatalogCategoryResponseSchema,
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
    async createCatalogItem(token: string, input: CreateLocalCatalogItemInput) {
      const body = createLocalCatalogItemInputSchema.parse(input);
      return request(
        localPosRoutes.catalogItems,
        localCatalogItemResponseSchema,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
    },
    async updateCatalogItem(
      token: string,
      itemId: string,
      input: UpdateLocalCatalogItemInput,
    ) {
      const body = updateLocalCatalogItemInputSchema.parse(input);
      return request(
        `${localPosRoutes.catalogItems}/${encodeURIComponent(itemId)}`,
        localCatalogItemResponseSchema,
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
    async createComboRule(token: string, input: CreateLocalComboRuleInput) {
      const body = createLocalComboRuleInputSchema.parse(input);
      return request(localPosRoutes.comboRules, localComboRuleResponseSchema, {
        method: 'POST',
        headers: managementJsonHeaders(token),
        body: JSON.stringify(body),
      });
    },
    async updateComboRule(
      token: string,
      ruleId: string,
      input: UpdateLocalComboRuleInput,
    ) {
      const body = updateLocalComboRuleInputSchema.parse(input);
      return request(
        `${localPosRoutes.comboRules}/${encodeURIComponent(ruleId)}`,
        localComboRuleResponseSchema,
        {
          method: 'PATCH',
          headers: managementJsonHeaders(token),
          body: JSON.stringify(body),
        },
      );
    },
    async createComboGroup(token: string, input: CreateLocalComboGroupInput) {
      const body = createLocalComboGroupInputSchema.parse(input);
      return request(
        localPosRoutes.comboRuleGroups,
        localComboGroupResponseSchema,
        {
          method: 'POST',
          headers: managementJsonHeaders(token),
          body: JSON.stringify(body),
        },
      );
    },
    async updateComboGroup(
      token: string,
      groupId: string,
      input: UpdateLocalComboGroupInput,
    ) {
      const body = updateLocalComboGroupInputSchema.parse(input);
      return request(
        `${localPosRoutes.comboRuleGroups}/${encodeURIComponent(groupId)}`,
        localComboGroupResponseSchema,
        {
          method: 'PATCH',
          headers: managementJsonHeaders(token),
          body: JSON.stringify(body),
        },
      );
    },
    async deleteComboGroup(token: string, groupId: string) {
      return request(
        `${localPosRoutes.comboRuleGroups}/${encodeURIComponent(groupId)}`,
        localComboDeleteResponseSchema,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    async createComboGroupItem(
      token: string,
      input: CreateLocalComboGroupItemInput,
    ) {
      const body = createLocalComboGroupItemInputSchema.parse(input);
      return request(
        localPosRoutes.comboRuleGroupItems,
        localComboGroupItemResponseSchema,
        {
          method: 'POST',
          headers: managementJsonHeaders(token),
          body: JSON.stringify(body),
        },
      );
    },
    async updateComboGroupItem(
      token: string,
      groupItemId: string,
      input: UpdateLocalComboGroupItemInput,
    ) {
      const body = updateLocalComboGroupItemInputSchema.parse(input);
      return request(
        `${localPosRoutes.comboRuleGroupItems}/${encodeURIComponent(groupItemId)}`,
        localComboGroupItemResponseSchema,
        {
          method: 'PATCH',
          headers: managementJsonHeaders(token),
          body: JSON.stringify(body),
        },
      );
    },
    async deleteComboGroupItem(token: string, groupItemId: string) {
      return request(
        `${localPosRoutes.comboRuleGroupItems}/${encodeURIComponent(groupItemId)}`,
        localComboDeleteResponseSchema,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
  };
}
