import {
  localCatalogResponseSchema,
  localKitchenQueueQuerySchema,
  localKitchenQueueResponseSchema,
  localOrderResponseSchema,
  localOrdersHomeQuerySchema,
  localOrdersHomeResponseSchema,
  localOrdersQuerySchema,
  localOrdersResponseSchema,
  localUsersResponseSchema,
  siteAgentHealthResponseSchema,
  type CreateLocalOrderInput,
  type LocalOrdersHomeQuery,
  type LocalOrdersHomeView,
  type LocalKitchenQueueQuery,
  type LocalKitchenScreen,
  type LocalOrderSummary,
  type LocalOrdersQuery,
} from '@yuta/contracts/local-pos';
import { getServiceDayWindow } from '@yuta/core';
import type { PosDatabaseClient } from '@yuta/db-pos/client';
import {
  comboRuleGroupItems,
  comboRuleGroups,
  comboRules,
  localUsers,
  menuCategories,
  menuItems,
  orderItems,
  orders,
} from '@yuta/db-pos/schema';
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  lt,
  or,
  sql,
} from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { HttpError } from '../http';
import { createCatalogManagementService } from './catalog-management-service';
import { createComboManagementService } from './combo-management-service';
import { createCustomerReceiptService } from './customer-receipt-service';
import { createEstablishmentProfileService } from './establishment-profile-service';
import { createOrderCommandService } from './order-command-service';
import { createFinancialService } from './financial-service';
import { createLocalAuthService } from './local-auth-service';
import { createLocalUserManagementService } from './local-user-management-service';
import { createManagementReportsService } from './management-reports-service';
import { createPrintJobService } from './print-job-service';
import { createPrintSettingsService } from './print-settings-service';
import { createPrinterStatusService } from './printer-status-service';
import {
  createInstructionSettingsService,
  ensureInstructionSettings,
  resolveInstructionConfig,
} from './instruction-settings-service';
import {
  createKitchenEventHub,
  kitchenEventScreenForStation,
  kitchenEventScreensForStations,
} from './kitchen-event-hub';

export function createSiteAgentService(
  db: PosDatabaseClient,
  options: { printerDevicePath?: string } = {},
) {
  const orderCommands = createOrderCommandService(db);
  const financial = createFinancialService(db);
  const printing = createPrintJobService(db);
  const printSettings = createPrintSettingsService(db);
  const establishmentProfile = createEstablishmentProfileService(db);
  const authentication = createLocalAuthService(db);
  const userManagement = createLocalUserManagementService(db);
  const catalogManagement = createCatalogManagementService(db);
  const comboManagement = createComboManagementService(db);
  const managementReports = createManagementReportsService(db);
  const instructionSettings = createInstructionSettingsService(db);
  const printerStatus = createPrinterStatusService(db, {
    devicePath: options.printerDevicePath,
  });
  const customerReceipts = createCustomerReceiptService(db, {
    getPrinterStatus: printerStatus.getPrinterStatus,
  });
  const kitchenEvents = createKitchenEventHub();
  async function getHealth() {
    try {
      await db.execute(sql`select 1`);
      return siteAgentHealthResponseSchema.parse({
        status: 'ok',
        database: 'ready',
        service: 'site-agent',
        apiVersion: 'v1',
        checkedAt: new Date().toISOString(),
      });
    } catch {
      return siteAgentHealthResponseSchema.parse({
        status: 'degraded',
        database: 'unavailable',
        service: 'site-agent',
        apiVersion: 'v1',
        checkedAt: new Date().toISOString(),
      });
    }
  }

  async function listLocalUsers() {
    const rows = await db
      .select({
        id: localUsers.id,
        name: localUsers.name,
        email: localUsers.email,
        role: localUsers.role,
        isActive: localUsers.isActive,
      })
      .from(localUsers)
      .orderBy(asc(localUsers.name));

    return localUsersResponseSchema.parse({ users: rows });
  }

  async function getCatalog() {
    const [
      categoryRows,
      itemRows,
      ruleRows,
      groupRows,
      groupItemRows,
      instructionSettingsRow,
    ] = await Promise.all([
      db
        .select()
        .from(menuCategories)
        .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.name)),
      db
        .select()
        .from(menuItems)
        .orderBy(asc(menuItems.sortOrder), asc(menuItems.name)),
      db
        .select()
        .from(comboRules)
        .orderBy(asc(comboRules.priority), asc(comboRules.name)),
      db
        .select()
        .from(comboRuleGroups)
        .orderBy(asc(comboRuleGroups.sortOrder), asc(comboRuleGroups.name)),
      db.select().from(comboRuleGroupItems),
      ensureInstructionSettings(db),
    ]);
    const instructionSettingsValue = {
      quickInstructionOptions: instructionSettingsRow.quickInstructionOptions,
      allergenOptions: instructionSettingsRow.allergenOptions,
    };
    const itemsByCategory = new Map<string, typeof itemRows>();
    for (const item of itemRows) {
      const categoryItems = itemsByCategory.get(item.categoryId) ?? [];
      categoryItems.push(item);
      itemsByCategory.set(item.categoryId, categoryItems);
    }
    const groupItemsByGroup = new Map<string, typeof groupItemRows>();
    for (const item of groupItemRows) {
      const items = groupItemsByGroup.get(item.comboRuleGroupId) ?? [];
      items.push(item);
      groupItemsByGroup.set(item.comboRuleGroupId, items);
    }
    const groupsByRule = new Map<string, typeof groupRows>();
    for (const group of groupRows) {
      const groups = groupsByRule.get(group.comboRuleId) ?? [];
      groups.push(group);
      groupsByRule.set(group.comboRuleId, groups);
    }

    return localCatalogResponseSchema.parse({
      categories: categoryRows.map((category) => ({
        id: category.id,
        name: category.name,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        defaultInstructionCodes: category.defaultInstructionCodes,
        additionalInstructionCodes: category.additionalInstructionCodes,
        items: (itemsByCategory.get(category.id) ?? []).map((item) => ({
          id: item.id,
          categoryId: item.categoryId,
          name: item.name,
          description: item.description,
          priceCents: item.priceCents,
          kitchenStation: item.kitchenStation,
          orderingPolicy: item.orderingPolicy,
          variantOptions: item.variantOptions,
          requiredVariantQuantity: item.requiredVariantQuantity,
          defaultInstructionCodes: item.defaultInstructionCodes,
          additionalInstructionCodes: item.additionalInstructionCodes,
          instructionConfig: resolveInstructionConfig(
            instructionSettingsValue,
            category,
            item,
          ),
          isAvailable: item.isAvailable,
          sortOrder: item.sortOrder,
        })),
      })),
      comboRules: ruleRows.map((rule) => ({
        id: rule.id,
        name: rule.name,
        pricingMode: rule.pricingMode,
        comboPriceCents: rule.comboPriceCents,
        priceDeltaCents: rule.priceDeltaCents,
        basePricingGroupName: rule.basePricingGroupName,
        priority: rule.priority,
        maxApplications: rule.maxApplications,
        isActive: rule.isActive,
        isSuggestionEnabled: rule.isSuggestionEnabled,
        groups: (groupsByRule.get(rule.id) ?? []).map((group) => ({
          id: group.id,
          name: group.name,
          minQuantity: group.minQuantity,
          maxQuantity: group.maxQuantity,
          sortOrder: group.sortOrder,
          items: (groupItemsByGroup.get(group.id) ?? []).map((item) => ({
            id: item.id,
            menuItemId: item.menuItemId,
            extraPriceCents: item.extraPriceCents,
          })),
        })),
      })),
      instructionSettings: instructionSettingsValue,
    });
  }

  async function listOrders(input: LocalOrdersQuery) {
    const query = localOrdersQuerySchema.parse(input);
    const rows = query.status
      ? await db
          .select()
          .from(orders)
          .where(eq(orders.status, query.status))
          .orderBy(desc(orders.createdAt))
          .limit(query.limit)
      : await db
          .select()
          .from(orders)
          .orderBy(desc(orders.createdAt))
          .limit(query.limit);

    return localOrdersResponseSchema.parse({
      orders: rows.map(toOrderSummary),
    });
  }

  async function listOrdersHome(input: LocalOrdersHomeQuery) {
    const query = localOrdersHomeQuerySchema.parse(input);
    const serviceDay = getServiceDayWindow(new Date());
    const createdDuringService = and(
      gte(orders.createdAt, serviceDay.start),
      lt(orders.createdAt, serviceDay.end),
    )!;
    const paidDuringService = and(
      gte(orders.paidAt, serviceDay.start),
      lt(orders.paidAt, serviceDay.end),
    )!;
    const openCondition = and(
      createdDuringService,
      inArray(orders.status, ['draft', 'sent', 'preparing', 'ready', 'served']),
    )!;
    const paidTodayCondition = and(
      eq(orders.status, 'paid'),
      paidDuringService,
    )!;
    const allTodayCondition = or(createdDuringService, paidDuringService)!;
    const viewConditions: Record<LocalOrdersHomeView, typeof openCondition> = {
      open: openCondition,
      paid_today: paidTodayCondition,
      all_today: allTodayCondition,
    };
    const searchPattern = `%${escapeLikePattern(query.q)}%`;
    const searchCondition = query.q
      ? or(
          sql<boolean>`${orders.tableLabel} ilike ${searchPattern} escape '\\'`,
          sql<boolean>`${orders.orderNumber} ilike ${searchPattern} escape '\\'`,
        )!
      : undefined;
    const selectedCondition = searchCondition
      ? and(viewConditions[query.view], searchCondition)!
      : viewConditions[query.view];

    const [[counts], [total]] = await Promise.all([
      db
        .select({
          open: sql<number>`count(*) filter (where ${openCondition})::int`,
          paidToday: sql<number>`count(*) filter (where ${paidTodayCondition})::int`,
          allToday: sql<number>`count(*) filter (where ${allTodayCondition})::int`,
        })
        .from(orders),
      db.select({ value: count() }).from(orders).where(selectedCondition),
    ]);
    const totalItems = Number(total?.value ?? 0);
    const pagination = resolveOrdersHomePagination({
      requestedPage: query.page,
      pageSize: query.limit,
      totalItems,
    });
    const itemSummary = db
      .select({
        orderId: orderItems.orderId,
        itemCount: count(orderItems.id).as('item_count'),
        itemHasAllergy: sql<boolean>`bool_or(${orderItems.hasAllergy})`.as(
          'item_has_allergy',
        ),
      })
      .from(orderItems)
      .groupBy(orderItems.orderId)
      .as('item_summary');
    const baseQuery = db
      .select({
        ...getTableColumns(orders),
        itemCount: sql<number>`coalesce(${itemSummary.itemCount}, 0)::int`,
        itemHasAllergy: sql<boolean>`coalesce(${itemSummary.itemHasAllergy}, false)`,
      })
      .from(orders)
      .leftJoin(itemSummary, eq(itemSummary.orderId, orders.id))
      .where(selectedCondition);
    const rows =
      query.view === 'paid_today'
        ? await baseQuery
            .orderBy(
              desc(orders.paidAt),
              desc(orders.createdAt),
              asc(orders.id),
            )
            .limit(query.limit)
            .offset(pagination.offset)
        : await baseQuery
            .orderBy(desc(orders.createdAt), asc(orders.id))
            .limit(query.limit)
            .offset(pagination.offset);

    return localOrdersHomeResponseSchema.parse({
      serviceDay: {
        start: serviceDay.start.toISOString(),
        end: serviceDay.end.toISOString(),
      },
      view: query.view,
      query: query.q,
      orders: rows.map(({ itemCount, itemHasAllergy, ...order }) => ({
        ...toOrderSummary({
          ...order,
          hasAllergy: order.hasAllergy || itemHasAllergy,
        }),
        itemCount: Number(itemCount),
      })),
      counts: {
        open: Number(counts?.open ?? 0),
        paidToday: Number(counts?.paidToday ?? 0),
        allToday: Number(counts?.allToday ?? 0),
      },
      pagination: {
        page: pagination.page,
        pageSize: query.limit,
        totalItems,
        totalPages: pagination.totalPages,
      },
    });
  }

  async function listKitchenQueue(input: LocalKitchenQueueQuery) {
    const query = localKitchenQueueQuerySchema.parse(input);
    const serviceDay = getServiceDayWindow(new Date());
    const serviceCondition = and(
      gte(orders.createdAt, serviceDay.start),
      lt(orders.createdAt, serviceDay.end),
    )!;
    const productionStatusCondition = inArray(orderItems.status, [
      'sent',
      'preparing',
      'ready',
    ]);
    const selectedStationCondition = kitchenScreenCondition(query.screen);
    const unfinishedGroup = sql<boolean>`bool_or(${orderItems.status} in ('sent', 'preparing'))`;
    const groupSortDate =
      query.queue === 'ready'
        ? sql<Date>`min(coalesce(${orderItems.readyAt}, ${orderItems.createdAt}))`
        : sql<Date>`min(coalesce(${orderItems.sentAt}, ${orderItems.createdAt}))`;

    const [candidateOrders, countRows] = await Promise.all([
      db
        .select({ id: orders.id, sortAt: groupSortDate.as('sort_at') })
        .from(orders)
        .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
        .where(
          and(
            serviceCondition,
            productionStatusCondition,
            selectedStationCondition,
          ),
        )
        .groupBy(orders.id)
        .having(
          query.queue === 'ready'
            ? sql<boolean>`not (${unfinishedGroup})`
            : unfinishedGroup,
        )
        .orderBy(
          query.queue === 'ready' ? desc(groupSortDate) : asc(groupSortDate),
          asc(orders.id),
        )
        .limit(query.limit),
      db
        .select({
          orderId: orderItems.orderId,
          station: orderItems.kitchenStationSnapshot,
          hasUnfinished: unfinishedGroup.as('has_unfinished'),
        })
        .from(orderItems)
        .innerJoin(orders, eq(orders.id, orderItems.orderId))
        .where(
          and(
            serviceCondition,
            productionStatusCondition,
            inArray(orderItems.kitchenStationSnapshot, [
              'kitchen',
              'bar',
              'dessert',
            ]),
          ),
        )
        .groupBy(orderItems.orderId, orderItems.kitchenStationSnapshot),
    ]);

    const orderIds = candidateOrders.map(({ id }) => id);
    const detailRows =
      orderIds.length === 0
        ? []
        : await db
            .select({
              order: getTableColumns(orders),
              item: getTableColumns(orderItems),
              categoryName: menuCategories.name,
              categorySortOrder: menuCategories.sortOrder,
              itemSortOrder: menuItems.sortOrder,
            })
            .from(orderItems)
            .innerJoin(orders, eq(orders.id, orderItems.orderId))
            .innerJoin(menuItems, eq(menuItems.id, orderItems.menuItemId))
            .innerJoin(
              menuCategories,
              eq(menuCategories.id, menuItems.categoryId),
            )
            .where(
              and(
                inArray(orderItems.orderId, orderIds),
                productionStatusCondition,
                selectedStationCondition,
              ),
            )
            .orderBy(asc(orderItems.createdAt), asc(orderItems.id));

    const ticketsByOrder = new Map<
      string,
      {
        order: LocalOrderSummary;
        items: Array<ReturnType<typeof toKitchenOrderItem>>;
      }
    >();
    for (const row of detailRows) {
      const item = toKitchenOrderItem(row.item, row);
      const ticket = ticketsByOrder.get(row.order.id);
      if (ticket) {
        ticket.items.push(item);
      } else {
        ticketsByOrder.set(row.order.id, {
          order: toOrderSummary(row.order),
          items: [item],
        });
      }
    }

    const counts = summarizeKitchenCounts(countRows, query.screen);

    return localKitchenQueueResponseSchema.parse({
      serviceDay: {
        start: serviceDay.start.toISOString(),
        end: serviceDay.end.toISOString(),
      },
      screen: query.screen,
      queue: query.queue,
      tickets: orderIds.flatMap((orderId) => {
        const ticket = ticketsByOrder.get(orderId);
        return ticket ? [ticket] : [];
      }),
      counts,
    });
  }

  async function createOrder(input: CreateLocalOrderInput) {
    const staffUser = await db.query.localUsers.findFirst({
      where: eq(localUsers.id, input.staffUserId),
    });
    if (!staffUser || !staffUser.isActive || staffUser.role === 'kitchen') {
      throw new HttpError(
        422,
        'STAFF_USER_UNAVAILABLE',
        'The selected local staff user is not available.',
      );
    }

    const id = uuidv7();
    const [created] = await db
      .insert(orders)
      .values({
        id,
        orderNumber: createOrderNumber(id),
        tableLabel: input.tableLabel,
        orderType: input.orderType,
        createdBy: staffUser.id,
        note: input.note,
      })
      .returning();

    return localOrderResponseSchema.parse({ order: toOrderSummary(created) });
  }

  async function executeOrderItemCommandWithEvents(
    ...args: Parameters<typeof orderCommands.executeOrderItemCommand>
  ) {
    const result = await orderCommands.executeOrderItemCommand(...args);
    kitchenEvents.publish(
      kitchenEventScreenForStation(result.item.kitchenStationSnapshot),
    );
    return result;
  }

  async function executeOrderCommandWithEvents(
    ...args: Parameters<typeof orderCommands.executeOrderCommand>
  ) {
    const command = args[1];
    const pendingStations =
      command.action === 'send_to_kitchen'
        ? await db
            .selectDistinct({ station: orderItems.kitchenStationSnapshot })
            .from(orderItems)
            .where(
              and(
                eq(orderItems.orderId, args[0]),
                eq(orderItems.status, 'pending'),
              ),
            )
        : [];
    const result = await orderCommands.executeOrderCommand(...args);
    if (
      command.action === 'send_to_kitchen' &&
      'replayed' in result &&
      !result.replayed
    ) {
      const screens = kitchenEventScreensForStations(
        pendingStations.map(({ station }) => station),
      );
      for (const screen of screens) {
        kitchenEvents.publish(screen, 'ticket_created');
      }
      return result;
    }
    kitchenEvents.publish(
      command.action === 'mark_station_preparing' ||
        command.action === 'mark_station_sent'
        ? kitchenEventScreenForStation(command.station)
        : 'all',
    );
    return result;
  }

  function publishAllAfter<Arguments extends unknown[], Result>(
    operation: (...args: Arguments) => Promise<Result>,
  ) {
    return async (...args: Arguments) => {
      const result = await operation(...args);
      kitchenEvents.publish('all');
      return result;
    };
  }

  return {
    getHealth,
    listLocalUsers,
    getCatalog,
    listOrders,
    listOrdersHome,
    listKitchenQueue,
    createOrder,
    ...authentication,
    ...userManagement,
    ...catalogManagement,
    ...comboManagement,
    ...managementReports,
    ...instructionSettings,
    ...orderCommands,
    ...financial,
    ...printing,
    ...printSettings,
    ...establishmentProfile,
    ...printerStatus,
    ...customerReceipts,
    subscribeKitchenEvents: kitchenEvents.subscribe,
    executeOrderItemCommand: executeOrderItemCommandWithEvents,
    executeOrderCommand: executeOrderCommandWithEvents,
    createCatalogCategory: publishAllAfter(
      catalogManagement.createCatalogCategory,
    ),
    updateCatalogCategory: publishAllAfter(
      catalogManagement.updateCatalogCategory,
    ),
    createCatalogItem: publishAllAfter(catalogManagement.createCatalogItem),
    updateCatalogItem: publishAllAfter(catalogManagement.updateCatalogItem),
    payOrder: publishAllAfter(financial.payOrder),
    payCheck: publishAllAfter(financial.payCheck),
  };
}

export function resolveOrdersHomePagination(input: {
  requestedPage: number;
  pageSize: number;
  totalItems: number;
}) {
  const totalPages = Math.max(1, Math.ceil(input.totalItems / input.pageSize));
  const page = Math.min(input.requestedPage, totalPages);
  return {
    page,
    totalPages,
    offset: (page - 1) * input.pageSize,
  };
}

export function escapeLikePattern(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('%', '\\%')
    .replaceAll('_', '\\_');
}

export type SiteAgentService = ReturnType<typeof createSiteAgentService>;

export function toOrderSummary(
  order: typeof orders.$inferSelect,
): LocalOrderSummary {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    tableLabel: order.tableLabel,
    orderType: order.orderType,
    status: order.status,
    subtotalCents: order.subtotalCents,
    discountCents: order.discountCents,
    totalCents: order.totalCents,
    paymentMode: order.paymentMode,
    note: order.note,
    hasAllergy: order.hasAllergy,
    allergyNote: order.allergyNote,
    allergyAcknowledgedAt: order.allergyAcknowledgedAt?.toISOString() ?? null,
    createdBy: order.createdBy,
    sentAt: order.sentAt?.toISOString() ?? null,
    paidAt: order.paidAt?.toISOString() ?? null,
    cancelledAt: order.cancelledAt?.toISOString() ?? null,
    cancelledReason: order.cancelledReason,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

function kitchenScreenCondition(screen: LocalKitchenScreen) {
  return screen === 'kitchen'
    ? eq(orderItems.kitchenStationSnapshot, 'kitchen')
    : inArray(orderItems.kitchenStationSnapshot, ['bar', 'dessert']);
}

function isStationOnScreen(
  station: 'kitchen' | 'bar' | 'dessert',
  screen: LocalKitchenScreen,
): boolean {
  return screen === 'kitchen' ? station === 'kitchen' : station !== 'kitchen';
}

export function summarizeKitchenCounts(
  rows: Array<{
    orderId: string;
    station: 'kitchen' | 'bar' | 'dessert' | 'none';
    hasUnfinished: boolean;
  }>,
  screen: LocalKitchenScreen,
) {
  const stations = { kitchen: 0, bar: 0, dessert: 0 };
  const selectedOrderState = new Map<string, boolean>();
  for (const row of rows) {
    if (
      row.station !== 'kitchen' &&
      row.station !== 'bar' &&
      row.station !== 'dessert'
    ) {
      continue;
    }
    stations[row.station] += 1;
    if (!isStationOnScreen(row.station, screen)) continue;
    selectedOrderState.set(
      row.orderId,
      (selectedOrderState.get(row.orderId) ?? false) || row.hasUnfinished,
    );
  }
  const queues = { active: 0, ready: 0 };
  for (const hasUnfinished of selectedOrderState.values()) {
    queues[hasUnfinished ? 'active' : 'ready'] += 1;
  }
  return { stations, queues };
}

function toKitchenOrderItem(
  item: typeof orderItems.$inferSelect,
  presentation: {
    categoryName: string;
    categorySortOrder: number;
    itemSortOrder: number;
  },
) {
  return {
    id: item.id,
    orderId: item.orderId,
    menuItemId: item.menuItemId,
    itemNameSnapshot: item.itemNameSnapshot,
    unitPriceCentsSnapshot: item.unitPriceCentsSnapshot,
    kitchenStationSnapshot: item.kitchenStationSnapshot,
    quantity: item.quantity,
    note: item.note,
    quickInstructions: item.quickInstructions,
    selectedVariants: item.selectedVariants,
    hasAllergy: item.hasAllergy,
    allergenCodes: item.allergenCodes,
    selectedAllergens: item.selectedAllergens,
    allergySeverity: item.allergySeverity,
    allergyNote: item.allergyNote,
    allergyAcknowledgedAt: item.allergyAcknowledgedAt?.toISOString() ?? null,
    allergyKitchenConfirmedAt:
      item.allergyKitchenConfirmedAt?.toISOString() ?? null,
    status: item.status,
    sentAt: item.sentAt?.toISOString() ?? null,
    readyAt: item.readyAt?.toISOString() ?? null,
    servedAt: item.servedAt?.toISOString() ?? null,
    cancelledAt: item.cancelledAt?.toISOString() ?? null,
    cancelledReason: item.cancelledReason,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    categoryName: presentation.categoryName,
    categorySortOrder: presentation.categorySortOrder,
    itemSortOrder: presentation.itemSortOrder,
  };
}

function createOrderNumber(id: string, date = new Date()): string {
  const datePart = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('');
  const timePart = [
    String(date.getUTCHours()).padStart(2, '0'),
    String(date.getUTCMinutes()).padStart(2, '0'),
    String(date.getUTCSeconds()).padStart(2, '0'),
  ].join('');
  const suffix = id.replaceAll('-', '').slice(-6).toUpperCase();

  return `POS-${datePart}-${timePart}-${suffix}`;
}
