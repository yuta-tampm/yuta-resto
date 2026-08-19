import { describe, expect, it } from 'vitest';
import {
  apiErrorSchema,
  createInternalNoteSchema,
  createLocalCatalogItemInputSchema,
  createLocalComboGroupInputSchema,
  createLocalComboGroupItemInputSchema,
  createLocalComboRuleInputSchema,
  establishmentProfileInputSchema,
  createLocalOrderInputSchema,
  createLocalUserInputSchema,
  createOrderInputSchema,
  createReservationInputSchema,
  bookingExceptionInputSchema,
  cursorPaginationQuerySchema,
  kitchenOrderCreatedEventSchema,
  cloudUserSchema,
  moneySchema,
  localOrderCommandSchema,
  localKitchenEventSchema,
  localKitchenQueueQuerySchema,
  localKitchenQueueResponseSchema,
  localOrdersHomeQuerySchema,
  localOrdersHomeResponseSchema,
  localPrintSettingsSchema,
  localReceiptViewResponseSchema,
  localPosApiBasePath,
  orderStatusSchema,
  publicFeedbackSubmissionSchema,
  saveReplySchema,
  updateFeedbackSchema,
  updateLocalComboRuleInputSchema,
  updateLocalUserInputSchema,
  updateLocalPrintSettingsInputSchema,
  resetLocalUserPinInputSchema,
  receiptJobCommandInputSchema,
  localUserResponseSchema,
  uuidV7Schema,
  tenantMembershipContractSchema,
} from '../src';

const id = '11111111-1111-4111-8111-111111111111';

describe('@yuta/contracts', () => {
  it('keeps the current POS lifecycle', () => {
    expect(orderStatusSchema.parse('sent')).toBe('sent');
    expect(orderStatusSchema.safeParse('submitted').success).toBe(false);
  });

  it('validates the local site-agent API boundary', () => {
    const uuidV7 = '01981f90-8e60-7000-8000-000000000001';

    expect(localPosApiBasePath).toBe('/api/v1');
    expect(uuidV7Schema.parse(uuidV7)).toBe(uuidV7);
    expect(uuidV7Schema.safeParse(id).success).toBe(false);
    expect(
      createLocalOrderInputSchema.parse({
        tableLabel: 'Table 12',
        orderType: 'dine_in',
        staffUserId: id,
      }),
    ).toEqual({
      tableLabel: 'Table 12',
      orderType: 'dine_in',
      staffUserId: id,
    });
    expect(
      localOrderCommandSchema.safeParse({
        action: 'send_to_kitchen',
        idempotencyKey: id,
        staffUserId: id,
      }).success,
    ).toBe(false);
    const sendCommand = localOrderCommandSchema.parse({
      action: 'send_to_kitchen',
      idempotencyKey: uuidV7,
      staffUserId: id,
    });
    expect(sendCommand.action).toBe('send_to_kitchen');
    if (sendCommand.action !== 'send_to_kitchen') {
      throw new Error('Expected a send-to-kitchen command.');
    }
    expect(sendCommand.allergyAcknowledged).toBe(false);
    expect(
      localOrderCommandSchema.parse({
        action: 'mark_station_preparing',
        station: 'kitchen',
      }),
    ).toEqual({ action: 'mark_station_preparing', station: 'kitchen' });
    expect(
      localOrderCommandSchema.parse({
        action: 'mark_station_preparing',
        station: 'counter',
      }),
    ).toEqual({ action: 'mark_station_preparing', station: 'counter' });
    expect(
      localOrderCommandSchema.safeParse({
        action: 'mark_station_preparing',
        station: 'none',
      }).success,
    ).toBe(false);
    expect(
      localOrderCommandSchema.parse({
        action: 'mark_station_sent',
        station: 'dessert',
      }),
    ).toEqual({ action: 'mark_station_sent', station: 'dessert' });
    expect(
      localOrderCommandSchema.parse({
        action: 'mark_station_sent',
        station: 'counter',
      }),
    ).toEqual({ action: 'mark_station_sent', station: 'counter' });
    expect(
      localOrderCommandSchema.safeParse({
        action: 'mark_station_sent',
        station: 'none',
      }).success,
    ).toBe(false);
    expect(
      updateLocalPrintSettingsInputSchema.parse({
        kitchenEnabled: 'true',
        counterEnabled: 'false',
        kitchenCopies: '2',
        counterCopies: '1',
        fontSizePreset: 'large',
        topPaddingLines: '1',
        leftPaddingChars: '3',
        bottomPaddingLines: '4',
      }),
    ).toEqual({
      kitchenEnabled: true,
      counterEnabled: false,
      kitchenCopies: 2,
      counterCopies: 1,
      fontSizePreset: 'large',
      topPaddingLines: 1,
      leftPaddingChars: 3,
      bottomPaddingLines: 4,
    });
    expect(
      localPrintSettingsSchema.safeParse({
        kitchenEnabled: true,
        counterEnabled: true,
        kitchenCopies: 4,
        counterCopies: 1,
        fontSizePreset: 'standard',
        topPaddingLines: 1,
        leftPaddingChars: 2,
        bottomPaddingLines: 3,
      }).success,
    ).toBe(false);
    expect(
      updateLocalPrintSettingsInputSchema.safeParse({
        kitchenEnabled: 'false',
        counterEnabled: 'false',
        kitchenCopies: '1',
        counterCopies: '1',
        fontSizePreset: 'standard',
        topPaddingLines: '1',
        leftPaddingChars: '2',
        bottomPaddingLines: '3',
      }).success,
    ).toBe(false);
  });

  it('validates the bounded Kitchen read contract', () => {
    expect(localKitchenQueueQuerySchema.parse({})).toEqual({
      screen: 'kitchen',
      queue: 'active',
      limit: 100,
    });
    expect(
      localKitchenQueueQuerySchema.parse({
        screen: 'counter',
        queue: 'ready',
        limit: '25',
      }),
    ).toEqual({ screen: 'counter', queue: 'ready', limit: 25 });
    expect(
      localKitchenQueueResponseSchema.safeParse({
        serviceDay: {
          start: '2026-07-27T03:00:00.000Z',
          end: '2026-07-28T03:00:00.000Z',
        },
        screen: 'kitchen',
        queue: 'active',
        tickets: [],
        counts: {
          stations: { kitchen: 0, bar: 0, dessert: 0 },
          queues: { active: 0, ready: 0 },
        },
      }).success,
    ).toBe(true);
  });

  it('validates notification-only Kitchen events', () => {
    expect(
      localKitchenEventSchema.parse({
        type: 'kitchen_changed',
        revision: 'boot-id:4',
        screen: 'counter',
        reason: 'ticket_created',
        occurredAt: '2026-07-27T12:00:00.000Z',
      }),
    ).toMatchObject({ screen: 'counter', revision: 'boot-id:4' });
    expect(
      localKitchenEventSchema.safeParse({
        type: 'kitchen_changed',
        revision: 'boot-id:4',
        screen: 'counter',
        reason: 'state_changed',
        occurredAt: '2026-07-27T12:00:00.000Z',
        orders: [],
      }).success,
    ).toBe(false);
  });

  it('validates explicit customer receipt targets and retry intent', () => {
    const operationId = '01981f90-8e60-7000-8000-000000000001';

    expect(
      receiptJobCommandInputSchema.parse({
        operationId,
        target: { kind: 'order' },
        intent: 'print',
      }),
    ).toEqual({
      operationId,
      target: { kind: 'order' },
      intent: 'print',
    });
    expect(
      receiptJobCommandInputSchema.safeParse({
        operationId,
        target: { kind: 'order' },
        intent: 'retry',
      }).success,
    ).toBe(false);
    expect(
      receiptJobCommandInputSchema.safeParse({
        operationId,
        target: { kind: 'check', checkId: id },
        intent: 'print',
        jobId: id,
      }).success,
    ).toBe(false);
    expect(
      localReceiptViewResponseSchema.safeParse({
        orderId: id,
        paymentMode: 'split_by_items',
        targets: [
          {
            kind: 'check',
            id,
            label: 'Addition 1',
            amountCents: 1290,
            availability: 'available',
            splitMode: 'items',
            latestJob: null,
          },
        ],
        printer: {
          status: 'not_configured',
          worker: 'disabled',
          device: 'not_configured',
          queue: { pending: 0, printing: 0, failed: 0 },
          lastPrintedAt: null,
          lastFailureAt: null,
          checkedAt: '2026-08-18T12:00:00.000Z',
        },
      }).success,
    ).toBe(true);
  });

  it('validates paginated POS Home service-day transport', () => {
    expect(
      localOrdersHomeQuerySchema.parse({
        view: 'paid_today',
        q: '  POS-123  ',
        page: '2',
        limit: '25',
      }),
    ).toEqual({
      view: 'paid_today',
      q: 'POS-123',
      page: 2,
      limit: 25,
    });
    expect(
      localOrdersHomeQuerySchema.safeParse({ view: 'unknown' }).success,
    ).toBe(false);
    expect(
      localOrdersHomeResponseSchema.safeParse({
        serviceDay: {
          start: '2026-08-16T03:00:00.000Z',
          end: '2026-08-17T03:00:00.000Z',
        },
        view: 'open',
        query: '',
        orders: [],
        counts: { open: 0, paidToday: 0, allToday: 0 },
        pagination: {
          page: 1,
          pageSize: 50,
          totalItems: 0,
          totalPages: 1,
        },
      }).success,
    ).toBe(true);
  });

  it('keeps local user fields and PINs inside their transport boundaries', () => {
    expect(
      createLocalUserInputSchema.parse({
        name: '  Local Staff  ',
        email: ' staff@example.test ',
        role: 'staff',
        pin: ' 2468 ',
      }),
    ).toEqual({
      name: 'Local Staff',
      email: 'staff@example.test',
      role: 'staff',
      pin: '2468',
    });
    expect(updateLocalUserInputSchema.safeParse({}).success).toBe(false);
    expect(
      resetLocalUserPinInputSchema.safeParse({ pin: '12ab' }).success,
    ).toBe(false);
    expect(
      localUserResponseSchema.safeParse({
        user: {
          id: '01981f90-8e60-7000-8000-000000000001',
          name: 'Local Staff',
          email: null,
          role: 'staff',
          isActive: true,
          pinHash: 'must-not-cross-the-boundary',
        },
      }).success,
    ).toBe(false);
  });

  it('validates catalog-driven item ordering policies', () => {
    const parsed = createLocalCatalogItemInputSchema.parse({
      categoryId: id,
      name: 'Dessert à partager',
      priceCents: 900,
      kitchenStation: 'dessert',
      orderingPolicy: 'separate',
      variantOptions: [
        { code: 'MANGUE', label: 'Mangue' },
        { code: 'MATCHA', label: 'Matcha' },
      ],
      requiredVariantQuantity: 2,
    });

    expect(parsed.orderingPolicy).toBe('separate');
    expect(parsed.variantOptions).toHaveLength(2);
    expect(parsed.requiredVariantQuantity).toBe(2);
  });

  it('validates combo-management money, quantity, and application limits', () => {
    expect(
      createLocalComboRuleInputSchema.parse({
        name: '  Menu midi  ',
        pricingMode: 'base_item_plus_delta',
        comboPriceCents: 0,
        priceDeltaCents: -250,
        basePricingGroupName: 'Plat',
        maxApplications: 2,
      }),
    ).toEqual({
      name: 'Menu midi',
      pricingMode: 'base_item_plus_delta',
      comboPriceCents: 0,
      priceDeltaCents: -250,
      basePricingGroupName: 'Plat',
      priority: 0,
      maxApplications: 2,
      isActive: false,
    });
    expect(
      createLocalComboRuleInputSchema.safeParse({
        name: 'Invalid cap',
        pricingMode: 'fixed',
        comboPriceCents: 1000,
        maxApplications: 0,
      }).success,
    ).toBe(false);
    expect(updateLocalComboRuleInputSchema.safeParse({}).success).toBe(false);
    expect(
      createLocalComboGroupInputSchema.safeParse({
        comboRuleId: id,
        name: 'Plat',
        minQuantity: 2,
        maxQuantity: 1,
      }).success,
    ).toBe(false);
    expect(
      createLocalComboGroupItemInputSchema.safeParse({
        comboRuleGroupId: id,
        menuItemId: id,
        extraPriceCents: -1,
      }).success,
    ).toBe(false);
  });

  it('validates strict common and order contracts', () => {
    expect(
      moneySchema.parse({ amountMinor: 1490, currency: 'EUR' }).amountMinor,
    ).toBe(1490);
    expect(
      apiErrorSchema.safeParse({
        error: { code: 'CONFLICT', message: 'Conflict' },
        sql: 'secret',
      }).success,
    ).toBe(false);
    expect(cursorPaginationQuerySchema.parse({ limit: '10' }).limit).toBe(10);
    expect(
      createOrderInputSchema.parse({
        establishmentId: id,
        serviceType: 'dine_in',
        items: [{ productId: id, quantity: 1 }],
        idempotencyKey: id,
      }).items[0].modifierIds,
    ).toEqual([]);
    expect(
      createOrderInputSchema.safeParse({
        establishmentId: id,
        serviceType: 'dine_in',
        items: [],
        idempotencyKey: id,
        extra: true,
      }).success,
    ).toBe(false);
  });

  it('round-trips a versioned kitchen event', () => {
    const event = {
      eventId: id,
      eventVersion: 1,
      occurredAt: '2026-07-19T12:00:00+02:00',
      organizationId: id,
      establishmentId: id,
      type: 'kitchen.order.created',
      payload: {
        orderId: id,
        orderNumber: 'POS-1',
        createdAt: '2026-07-19T12:00:00+02:00',
        items: [
          { orderItemId: id, displayName: 'Pho', quantity: 1, notes: [] },
        ],
      },
    };
    expect(
      kitchenOrderCreatedEventSchema.parse(JSON.parse(JSON.stringify(event))),
    ).toEqual(event);
  });

  it('validates reservation privacy boundary', () => {
    const reservation = {
      establishmentId: id,
      startAt: '2026-07-19T12:00:00+02:00',
      partySize: 2,
      customer: {
        firstName: 'Tam',
        lastName: 'Nguyen',
        email: 'tam@example.com',
        phone: '0600000000',
      },
      idempotencyKey: id,
    };
    expect(createReservationInputSchema.parse(reservation)).toEqual(
      reservation,
    );
    expect(
      createReservationInputSchema.safeParse({
        ...reservation,
        customer: { firstName: 'Tam' },
      }).success,
    ).toBe(false);
  });

  it('validates booking exception fields for each exception kind', () => {
    const baseException = {
      date: '2026-08-15',
      servicePeriodId: null,
      startTime: null,
      endTime: null,
      capacityOverride: null,
      reason: null,
    };

    expect(
      bookingExceptionInputSchema.safeParse({
        ...baseException,
        kind: 'CLOSED_ALL_DAY',
      }).success,
    ).toBe(true);
    expect(
      bookingExceptionInputSchema.safeParse({
        ...baseException,
        kind: 'CLOSED_SERVICE',
      }).success,
    ).toBe(false);
    expect(
      bookingExceptionInputSchema.safeParse({
        ...baseException,
        kind: 'CLOSED_SERVICE',
        servicePeriodId: id,
      }).success,
    ).toBe(true);
    expect(
      bookingExceptionInputSchema.safeParse({
        ...baseException,
        kind: 'BLOCKED_SLOT',
        startTime: '19:00',
        endTime: '18:00',
      }).success,
    ).toBe(false);
    expect(
      bookingExceptionInputSchema.safeParse({
        ...baseException,
        kind: 'MODIFIED_HOURS',
        startTime: '18:00',
        endTime: '22:00',
      }).success,
    ).toBe(true);
  });

  it('validates establishment profile fields and service modes', () => {
    const profile = {
      name: 'LUNA',
      description: null,
      addressLine1: '12 rue du Marché',
      addressLine2: null,
      postalCode: '86000',
      city: 'Poitiers',
      countryCode: 'fr',
      phone: null,
      email: 'contact@example.test',
      website: 'https://example.test',
      publicPhone: '+33549000000',
      publicEmail: 'public@example.test',
      logoUrl: null,
      coverImageUrl: null,
      languages: ['fr', 'en', 'fr'],
      serviceModes: ['DINE_IN', 'RESERVATION'],
      publicDescription: true,
      publicAddress: true,
      publicPhoneVisible: true,
      publicEmailVisible: true,
      publicWebsite: true,
      publicLanguages: true,
      publicServiceModes: true,
    };
    expect(establishmentProfileInputSchema.parse(profile)).toMatchObject({
      countryCode: 'FR',
      languages: ['fr', 'en'],
    });
    expect(
      establishmentProfileInputSchema.safeParse({
        ...profile,
        serviceModes: ['UNSUPPORTED'],
      }).success,
    ).toBe(false);
  });

  it('validates public feedback and requires contact consent', () => {
    expect(
      publicFeedbackSubmissionSchema.parse({
        rating: 5,
        topics: ['FOOD_QUALITY', 'SERVICE'],
        comment: 'Très bon accueil.',
      }),
    ).toMatchObject({
      rating: 5,
      topics: ['FOOD_QUALITY', 'SERVICE'],
      consentToContact: false,
    });

    expect(
      publicFeedbackSubmissionSchema.safeParse({
        rating: 2,
        topics: ['ORDER_ACCURACY'],
        customerEmail: 'client@example.com',
        consentToContact: false,
      }).success,
    ).toBe(false);
    expect(
      publicFeedbackSubmissionSchema.safeParse({
        rating: 2,
        topics: ['ORDER_ACCURACY'],
        customerEmail: 'client@example.com',
        consentToContact: true,
      }).success,
    ).toBe(true);
  });

  it('rejects invalid public ratings and topics', () => {
    expect(
      publicFeedbackSubmissionSchema.safeParse({
        rating: 0,
        topics: [],
      }).success,
    ).toBe(false);
    expect(
      publicFeedbackSubmissionSchema.safeParse({
        rating: 5,
        topics: ['UNSUPPORTED_TOPIC'],
      }).success,
    ).toBe(false);
    expect(
      publicFeedbackSubmissionSchema.parse({
        rating: 5,
        topics: [],
        website: 'https://spam.example',
      }).website,
    ).toBe('https://spam.example');
  });

  it('validates persistent reputation inbox mutations', () => {
    expect(
      updateFeedbackSchema.parse({
        status: 'TO_PROCESS',
        assignedToUserId: id,
      }),
    ).toEqual({
      status: 'TO_PROCESS',
      assignedToUserId: id,
    });
    expect(updateFeedbackSchema.safeParse({}).success).toBe(false);
    expect(saveReplySchema.safeParse({ content: '  ' }).success).toBe(false);
    expect(
      createInternalNoteSchema.parse({
        content: 'Rappeler le client demain.',
      }).content,
    ).toBe('Rappeler le client demain.');
  });

  it('keeps system roles separate from tenant membership roles', () => {
    expect(
      cloudUserSchema.parse({
        id,
        email: 'owner@example.test',
        displayName: 'Owner',
        status: 'ACTIVE',
        systemRole: 'YUTA_SUPPORT',
      }).systemRole,
    ).toBe('YUTA_SUPPORT');
    expect(
      tenantMembershipContractSchema.safeParse({
        id,
        organizationId: id,
        establishmentId: id,
        userId: id,
        role: 'YUTA_ADMIN',
        status: 'active',
        joinedAt: new Date(),
      }).success,
    ).toBe(false);
  });
});
