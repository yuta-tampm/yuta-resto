import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type {
  LocalKitchenEvent,
  LocalKitchenQueueQuery,
  LocalOrdersHomeQuery,
  ReceiptJobCommandInput,
} from '@yuta/contracts/local-pos';
import { createSiteAgentServer } from '../src/server';
import type { SiteAgentService } from '../src/services/site-agent-service';

const userId = '11111111-1111-4111-8111-111111111111';
const orderId = '22222222-2222-4222-8222-222222222222';
const sessionId = '33333333-3333-4333-8333-333333333333';
const checkedAt = '2026-07-27T12:00:00.000Z';
const sessionToken = 'local-session-token-with-more-than-thirty-two-characters';
const localSession = {
  id: sessionId,
  user: {
    id: userId,
    name: 'Local Admin',
    email: 'admin@yuta.local',
    role: 'admin' as const,
    isActive: true,
  },
  expiresAt: checkedAt,
};
const printJobSnapshot = {
  id: sessionId,
  orderId,
  checkId: null,
  paymentId: null,
  type: 'kitchen_ticket' as const,
  source: 'pos' as const,
  status: 'pending' as const,
  printerName: 'tm-m30-internal',
  summary: {
    orderNumber: 'POS-TEST',
    tableLabel: 'Terrasse 5',
    itemCount: 1,
  },
  errorMessage: null,
  createdAt: checkedAt,
  printedAt: null,
};

describe('site-agent HTTP boundary', () => {
  let server: ReturnType<typeof createSiteAgentServer>;
  let baseUrl: string;
  let revokedSessionTokens: string[];
  let ordersHomeQueries: LocalOrdersHomeQuery[];
  let kitchenQueueQueries: LocalKitchenQueueQuery[];
  let kitchenEventListeners: Array<(event: LocalKitchenEvent) => void>;
  let receiptCommands: ReceiptJobCommandInput[];

  beforeEach(async () => {
    revokedSessionTokens = [];
    ordersHomeQueries = [];
    kitchenQueueQueries = [];
    kitchenEventListeners = [];
    receiptCommands = [];
    server = createSiteAgentServer({
      env: {
        NODE_ENV: 'test',
        POS_DATABASE_URL: 'postgres://test:test@localhost:5432/yuta_pos_test',
        SITE_AGENT_HOST: '127.0.0.1',
        SITE_AGENT_PORT: 3004,
        SITE_AGENT_ALLOWED_ORIGIN: 'http://localhost:3003',
        POS_PRINT_POLL_INTERVAL_MS: 1_000,
      },
      service: {
        ...createMockService(),
        subscribeKitchenEvents: (listener) => {
          kitchenEventListeners.push(listener);
          return () => {
            kitchenEventListeners = kitchenEventListeners.filter(
              (candidate) => candidate !== listener,
            );
          };
        },
        listOrdersHome: async (query) => {
          ordersHomeQueries.push(query);
          return {
            serviceDay: {
              start: '2026-07-27T03:00:00.000Z',
              end: '2026-07-28T03:00:00.000Z',
            },
            view: query.view,
            query: query.q,
            orders: [],
            counts: { open: 2, paidToday: 1, allToday: 3 },
            pagination: {
              page: query.page,
              pageSize: query.limit,
              totalItems: 1,
              totalPages: 1,
            },
          };
        },
        listKitchenQueue: async (query) => {
          kitchenQueueQueries.push(query);
          return kitchenQueueSnapshot(query);
        },
        revokeSession: async (token) => {
          revokedSessionTokens.push(token);
        },
        getReceiptView: async () => receiptViewSnapshot(),
        executeReceiptCommand: async (_orderId, command) => {
          receiptCommands.push(command);
          return receiptCommandSnapshot(false);
        },
        getReceiptJobStatus: async () => ({
          printJob: receiptPrintJobSnapshot(),
          printer: printerStatusSnapshot(),
        }),
      },
    });
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', () => {
        server.off('error', reject);
        resolve();
      });
    });
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('serves health without exposing a database URL', async () => {
    const response = await fetch(`${baseUrl}/health`, {
      headers: { Origin: 'http://localhost:3003' },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe(
      'http://localhost:3003',
    );
    expect(await response.json()).toEqual({
      status: 'ok',
      database: 'ready',
      service: 'site-agent',
      apiVersion: 'v1',
      checkedAt,
    });
  });

  it('validates and serves the paginated POS Home read model', async () => {
    const response = await fetch(
      `${baseUrl}/api/v1/orders/home?view=paid_today&q=POS&page=2&limit=25`,
    );

    expect(response.status).toBe(200);
    expect(ordersHomeQueries).toEqual([
      { view: 'paid_today', q: 'POS', page: 2, limit: 25 },
    ]);
    expect(await response.json()).toMatchObject({
      view: 'paid_today',
      query: 'POS',
      counts: { open: 2, paidToday: 1, allToday: 3 },
      pagination: { page: 2, pageSize: 25 },
    });
  });

  it('validates and serves the bounded Kitchen read model', async () => {
    const response = await fetch(
      `${baseUrl}/api/v1/kitchen?screen=counter&queue=ready&limit=25`,
    );

    expect(response.status).toBe(200);
    expect(kitchenQueueQueries).toEqual([
      { screen: 'counter', queue: 'ready', limit: 25 },
    ]);
    expect(await response.json()).toMatchObject({
      screen: 'counter',
      queue: 'ready',
      tickets: [],
      counts: {
        stations: { kitchen: 0, bar: 0, dessert: 0 },
        queues: { active: 0, ready: 0 },
      },
    });
  });

  it('serves a cache-free Kitchen event stream and cleans up clients', async () => {
    const response = await fetch(`${baseUrl}/api/v1/kitchen/events`);
    const reader = response.body?.getReader();
    const firstChunk = await reader?.read();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(response.headers.get('cache-control')).toBe(
      'no-cache, no-transform',
    );
    expect(new TextDecoder().decode(firstChunk?.value)).toContain(
      'retry: 3000',
    );
    kitchenEventListeners[0]?.({
      type: 'kitchen_changed',
      revision: 'test-boot:1',
      screen: 'counter',
      reason: 'ticket_created',
      occurredAt: checkedAt,
    });
    const eventChunk = await reader?.read();
    expect(new TextDecoder().decode(eventChunk?.value)).toContain(
      'event: kitchen_changed',
    );
    expect(new TextDecoder().decode(eventChunk?.value)).toContain(
      '"screen":"counter"',
    );
    expect(new TextDecoder().decode(eventChunk?.value)).toContain(
      '"reason":"ticket_created"',
    );
    await reader?.cancel();
  });

  it('serves safe printer status without exposing the device path', async () => {
    const response = await fetch(`${baseUrl}/api/v1/printer-status`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'ready',
      worker: 'running',
      device: 'ready',
      queue: { pending: 0, printing: 0, failed: 0 },
      lastPrintedAt: null,
      lastFailureAt: null,
      checkedAt,
    });
  });

  it('rejects invalid order commands before calling a service', async () => {
    const response = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3003',
      },
      body: JSON.stringify({
        tableLabel: '',
        orderType: 'dine_in',
        staffUserId: userId,
        unexpected: true,
      }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: { code: 'VALIDATION_ERROR' },
    });
  });

  it('blocks browser origins outside the configured local POS origin', async () => {
    const response = await fetch(`${baseUrl}/api/v1/catalog`, {
      headers: { Origin: 'https://untrusted.example' },
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({
      error: { code: 'ORIGIN_NOT_ALLOWED' },
    });
  });

  it('creates and reads an authenticated local session', async () => {
    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3003',
      },
      body: JSON.stringify({ userId, pin: '1234' }),
    });

    expect(loginResponse.status).toBe(200);
    expect(await loginResponse.json()).toEqual({
      token: sessionToken,
      session: localSession,
    });

    const sessionResponse = await fetch(`${baseUrl}/api/v1/auth/session`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    expect(sessionResponse.status).toBe(200);
    expect(await sessionResponse.json()).toEqual({ session: localSession });
  });

  it('requires a bearer token for the local session endpoint', async () => {
    const response = await fetch(`${baseUrl}/api/v1/auth/session`);

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      error: { code: 'LOCAL_SESSION_REQUIRED' },
    });
  });

  it('revokes bearer sessions and keeps logout idempotent without a token', async () => {
    const authenticatedResponse = await fetch(
      `${baseUrl}/api/v1/auth/session`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${sessionToken}` },
      },
    );

    expect(authenticatedResponse.status).toBe(200);
    expect(await authenticatedResponse.json()).toEqual({ success: true });
    expect(revokedSessionTokens).toEqual([sessionToken]);

    const anonymousResponse = await fetch(`${baseUrl}/api/v1/auth/session`, {
      method: 'DELETE',
    });

    expect(anonymousResponse.status).toBe(200);
    expect(await anonymousResponse.json()).toEqual({ success: true });
    expect(revokedSessionTokens).toEqual([sessionToken]);
  });

  it('protects local-user mutations with a management session', async () => {
    const unauthorized = await fetch(`${baseUrl}/api/v1/local-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Staff',
        email: null,
        role: 'staff',
        pin: '2345',
      }),
    });
    expect(unauthorized.status).toBe(401);

    const created = await fetch(`${baseUrl}/api/v1/local-users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'New Staff',
        email: null,
        role: 'staff',
        pin: '2345',
      }),
    });
    expect(created.status).toBe(201);
    expect(await created.json()).toMatchObject({
      user: { name: 'New Staff', role: 'staff', isActive: true },
    });
  });

  it('validates local-user update and PIN routes', async () => {
    const invalidUpdate = await fetch(
      `${baseUrl}/api/v1/local-users/${userId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );
    expect(invalidUpdate.status).toBe(400);

    const resetPin = await fetch(
      `${baseUrl}/api/v1/local-users/${userId}/pin`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: '6789' }),
      },
    );
    expect(resetPin.status).toBe(200);
    expect(await resetPin.json()).toEqual({ user: localSession.user });
  });

  it('protects and validates catalog management routes', async () => {
    const unauthorized = await fetch(`${baseUrl}/api/v1/catalog/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Lunch', sortOrder: 10 }),
    });
    expect(unauthorized.status).toBe(401);

    const created = await fetch(`${baseUrl}/api/v1/catalog/categories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Lunch', sortOrder: 10 }),
    });
    expect(created.status).toBe(201);
    expect(await created.json()).toMatchObject({
      category: { name: 'Lunch', sortOrder: 10, isActive: true },
    });

    const invalidItem = await fetch(`${baseUrl}/api/v1/catalog/items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryId: userId,
        name: 'Invalid price',
        priceCents: -1,
        kitchenStation: 'kitchen',
      }),
    });
    expect(invalidItem.status).toBe(400);
  });

  it('protects and validates combo management routes', async () => {
    const unauthorized = await fetch(`${baseUrl}/api/v1/catalog/combo-rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lunch combo',
        pricingMode: 'fixed',
        comboPriceCents: 1500,
        maxApplications: null,
      }),
    });
    expect(unauthorized.status).toBe(401);

    const created = await fetch(`${baseUrl}/api/v1/catalog/combo-rules`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Lunch combo',
        pricingMode: 'fixed',
        comboPriceCents: 1500,
        maxApplications: null,
      }),
    });
    expect(created.status).toBe(201);
    expect(await created.json()).toMatchObject({
      comboRule: {
        name: 'Lunch combo',
        pricingMode: 'fixed',
        isActive: false,
      },
    });

    const invalidGroup = await fetch(`${baseUrl}/api/v1/catalog/combo-groups`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comboRuleId: userId,
        name: 'Main',
        minQuantity: 2,
        maxQuantity: 1,
      }),
    });
    expect(invalidGroup.status).toBe(400);
  });

  it('protects and validates local instruction settings', async () => {
    const input = {
      quickInstructionOptions: [
        { code: 'SANS_ALCOOL', label: 'Sans alcool', conflictsWith: [] },
      ],
      allergenOptions: [{ code: 'ARACHIDES', label: 'Arachides' }],
    };
    const unauthorized = await fetch(
      `${baseUrl}/api/v1/catalog/instruction-settings`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    );
    expect(unauthorized.status).toBe(401);

    const updated = await fetch(
      `${baseUrl}/api/v1/catalog/instruction-settings`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      },
    );
    expect(updated.status).toBe(200);
    expect(await updated.json()).toEqual(input);
  });

  it('protects print queue reads and commands', async () => {
    const unauthorizedList = await fetch(`${baseUrl}/api/v1/print-jobs`);
    expect(unauthorizedList.status).toBe(401);

    const list = await fetch(`${baseUrl}/api/v1/print-jobs?limit=25`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    expect(list.status).toBe(200);
    expect(await list.json()).toEqual({
      printJobs: [printJobSnapshot],
      summary: { pending: 1, printing: 0, printed: 0, failed: 0 },
      pagination: {
        page: 1,
        pageSize: 25,
        totalItems: 1,
        totalPages: 1,
      },
    });

    const unauthorizedTest = await fetch(`${baseUrl}/api/v1/print-jobs/test`, {
      method: 'POST',
    });
    expect(unauthorizedTest.status).toBe(401);

    const testPrint = await fetch(`${baseUrl}/api/v1/print-jobs/test`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    expect(testPrint.status).toBe(201);
    expect(await testPrint.json()).toEqual(printJobSnapshot);

    const unauthorizedCommand = await fetch(
      `${baseUrl}/api/v1/print-jobs/${sessionId}/commands`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_printing' }),
      },
    );
    expect(unauthorizedCommand.status).toBe(401);

    const command = await fetch(
      `${baseUrl}/api/v1/print-jobs/${sessionId}/commands`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mark_printing' }),
      },
    );
    expect(command.status).toBe(200);
    expect(await command.json()).toEqual(printJobSnapshot);
  });

  it('protects and validates local print settings', async () => {
    const unauthorized = await fetch(`${baseUrl}/api/v1/print-settings`);
    expect(unauthorized.status).toBe(401);

    const current = await fetch(`${baseUrl}/api/v1/print-settings`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    expect(current.status).toBe(200);
    expect(await current.json()).toEqual({
      kitchenEnabled: true,
      counterEnabled: true,
      kitchenCopies: 1,
      counterCopies: 1,
      fontSizePreset: 'standard',
      topPaddingLines: 1,
      leftPaddingChars: 2,
      bottomPaddingLines: 3,
    });

    const updated = await fetch(`${baseUrl}/api/v1/print-settings`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kitchenEnabled: false,
        counterEnabled: true,
        kitchenCopies: 2,
        counterCopies: 1,
        fontSizePreset: 'large',
        topPaddingLines: 2,
        leftPaddingChars: 4,
        bottomPaddingLines: 5,
      }),
    });
    expect(updated.status).toBe(200);
    expect(await updated.json()).toEqual({
      kitchenEnabled: false,
      counterEnabled: true,
      kitchenCopies: 2,
      counterCopies: 1,
      fontSizePreset: 'large',
      topPaddingLines: 2,
      leftPaddingChars: 4,
      bottomPaddingLines: 5,
    });

    const invalid = await fetch(`${baseUrl}/api/v1/print-settings`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kitchenEnabled: true,
        counterEnabled: true,
        kitchenCopies: 4,
        counterCopies: 1,
        fontSizePreset: 'standard',
        topPaddingLines: 1,
        leftPaddingChars: 2,
        bottomPaddingLines: 3,
      }),
    });
    expect(invalid.status).toBe(400);

    const noDestination = await fetch(`${baseUrl}/api/v1/print-settings`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kitchenEnabled: false,
        counterEnabled: false,
        kitchenCopies: 1,
        counterCopies: 1,
        fontSizePreset: 'standard',
        topPaddingLines: 1,
        leftPaddingChars: 2,
        bottomPaddingLines: 3,
      }),
    });
    expect(noDestination.status).toBe(400);
  });

  it('requires UUIDv7 idempotency keys for kitchen commands', async () => {
    const response = await fetch(
      `${baseUrl}/api/v1/orders/${orderId}/commands`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'http://localhost:3003',
        },
        body: JSON.stringify({
          action: 'send_to_kitchen',
          idempotencyKey: userId,
          staffUserId: userId,
        }),
      },
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: { code: 'VALIDATION_ERROR' },
    });
  });

  it('requires UUIDv7 idempotency keys for payment capture', async () => {
    const response = await fetch(
      `${baseUrl}/api/v1/orders/${orderId}/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'http://localhost:3003',
        },
        body: JSON.stringify({
          method: 'card',
          amountCents: 1000,
          staffUserId: userId,
          idempotencyKey: userId,
        }),
      },
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: { code: 'VALIDATION_ERROR' },
    });
  });

  it('serves order-scoped receipt commands without management auth', async () => {
    const operationId = '019c9b83-7c2d-70e5-8000-000000000006';
    const view = await fetch(`${baseUrl}/api/v1/orders/${orderId}/receipts`, {
      headers: { Origin: 'http://localhost:3003' },
    });
    expect(view.status).toBe(200);
    expect(await view.json()).toEqual(receiptViewSnapshot());

    const command = await fetch(
      `${baseUrl}/api/v1/orders/${orderId}/receipts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'http://localhost:3003',
        },
        body: JSON.stringify({
          operationId,
          target: { kind: 'order' },
          intent: 'print',
        }),
      },
    );
    expect(command.status).toBe(201);
    expect(await command.json()).toEqual(receiptCommandSnapshot(false));
    expect(receiptCommands).toEqual([
      {
        operationId,
        target: { kind: 'order' },
        intent: 'print',
      },
    ]);

    const status = await fetch(
      `${baseUrl}/api/v1/orders/${orderId}/receipts/${sessionId}`,
      { headers: { Origin: 'http://localhost:3003' } },
    );
    expect(status.status).toBe(200);
    expect(await status.json()).toEqual({
      printJob: receiptPrintJobSnapshot(),
      printer: printerStatusSnapshot(),
    });
  });
});

function printerStatusSnapshot() {
  return {
    status: 'ready' as const,
    worker: 'running' as const,
    device: 'ready' as const,
    queue: { pending: 1, printing: 0, failed: 0 },
    lastPrintedAt: null,
    lastFailureAt: null,
    checkedAt,
  };
}

function receiptPrintJobSnapshot() {
  return {
    ...printJobSnapshot,
    type: 'customer_receipt' as const,
    printerName: 'tm-m30-receipt',
  };
}

function receiptViewSnapshot() {
  return {
    orderId,
    paymentMode: 'single' as const,
    targets: [
      {
        kind: 'order' as const,
        id: orderId,
        label: 'Commande complète',
        amountCents: 1400,
        availability: 'available' as const,
        splitMode: 'single' as const,
        latestJob: null,
      },
    ],
    printer: printerStatusSnapshot(),
  };
}

function receiptCommandSnapshot(replayed: boolean) {
  const printJob = receiptPrintJobSnapshot();
  return {
    target: { ...receiptViewSnapshot().targets[0], latestJob: printJob },
    printJob,
    replayed,
    printer: printerStatusSnapshot(),
  };
}

function createMockService(): SiteAgentService {
  return {
    subscribeKitchenEvents: () => () => undefined,
    getHealth: async () => ({
      status: 'ok',
      database: 'ready',
      service: 'site-agent',
      apiVersion: 'v1',
      checkedAt,
    }),
    getPrinterStatus: async () => ({
      status: 'ready',
      worker: 'running',
      device: 'ready',
      queue: { pending: 0, printing: 0, failed: 0 },
      lastPrintedAt: null,
      lastFailureAt: null,
      checkedAt,
    }),
    signIn: async () => ({ token: sessionToken, session: localSession }),
    findSession: async (token) =>
      token === sessionToken ? localSession : null,
    revokeSession: async () => undefined,
    listLocalUsers: async () => ({ users: [] }),
    createLocalUser: async (_session, input) => ({
      user: {
        id: userId,
        name: input.name,
        email: input.email,
        role: input.role,
        isActive: true,
      },
    }),
    updateLocalUser: async (_session, _userId, input) => ({
      user: {
        ...localSession.user,
        ...input,
      },
    }),
    resetLocalUserPin: async () => ({ user: localSession.user }),
    getCatalog: async () => ({
      categories: [],
      comboRules: [],
      instructionSettings: {
        quickInstructionOptions: [],
        allergenOptions: [],
      },
    }),
    updateInstructionSettings: async (input) => input,
    createCatalogCategory: async (input) => ({
      category: {
        id: userId,
        name: input.name,
        sortOrder: input.sortOrder,
        isActive: true,
        defaultInstructionCodes: input.defaultInstructionCodes,
        additionalInstructionCodes: input.additionalInstructionCodes,
        items: [],
      },
    }),
    updateCatalogCategory: async (_categoryId, input) => ({
      category: {
        id: userId,
        name: input.name ?? 'Category',
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? true,
        defaultInstructionCodes: input.defaultInstructionCodes ?? [],
        additionalInstructionCodes: input.additionalInstructionCodes ?? [],
        items: [],
      },
    }),
    createCatalogItem: async (input) => ({
      item: {
        id: orderId,
        ...input,
        instructionConfig: {
          defaultOptions: [],
          additionalOptions: [],
        },
      },
    }),
    updateCatalogItem: async (_itemId, input) => ({
      item: {
        id: orderId,
        categoryId: input.categoryId ?? userId,
        name: input.name ?? 'Item',
        description: input.description ?? null,
        priceCents: input.priceCents ?? 1000,
        kitchenStation: input.kitchenStation ?? 'kitchen',
        orderingPolicy: input.orderingPolicy ?? 'merge',
        variantOptions: input.variantOptions ?? [],
        requiredVariantQuantity: input.requiredVariantQuantity ?? 0,
        defaultInstructionCodes: input.defaultInstructionCodes ?? null,
        additionalInstructionCodes: input.additionalInstructionCodes ?? null,
        instructionConfig: {
          defaultOptions: [],
          additionalOptions: [],
        },
        isAvailable: input.isAvailable ?? true,
        sortOrder: input.sortOrder ?? 0,
      },
    }),
    createComboRule: async (input) => ({
      comboRule: { id: userId, ...input, groups: [] },
    }),
    updateComboRule: async (_ruleId, input) => ({
      comboRule: {
        id: userId,
        name: input.name ?? 'Combo',
        pricingMode: input.pricingMode ?? 'fixed',
        comboPriceCents: input.comboPriceCents ?? 1000,
        priceDeltaCents: input.priceDeltaCents ?? 0,
        basePricingGroupName: input.basePricingGroupName ?? null,
        priority: input.priority ?? 0,
        maxApplications: input.maxApplications ?? null,
        isActive: input.isActive ?? false,
        groups: [],
      },
    }),
    createComboGroup: async (input) => ({
      group: {
        id: orderId,
        name: input.name,
        minQuantity: input.minQuantity,
        maxQuantity: input.maxQuantity,
        sortOrder: input.sortOrder,
        items: [],
      },
    }),
    updateComboGroup: async (_groupId, input) => ({
      group: {
        id: orderId,
        name: input.name ?? 'Group',
        minQuantity: input.minQuantity ?? 1,
        maxQuantity: input.maxQuantity ?? 1,
        sortOrder: input.sortOrder ?? 0,
        items: [],
      },
    }),
    deleteComboGroup: async () => ({ success: true as const }),
    createComboGroupItem: async (input) => ({
      item: { id: sessionId, ...input },
    }),
    updateComboGroupItem: async (_groupItemId, input) => ({
      item: {
        id: sessionId,
        menuItemId: orderId,
        extraPriceCents: input.extraPriceCents,
      },
    }),
    deleteComboGroupItem: async () => ({ success: true as const }),
    listOrders: async () => ({ orders: [] }),
    listOrdersHome: async (query) => ({
      serviceDay: {
        start: '2026-07-27T03:00:00.000Z',
        end: '2026-07-28T03:00:00.000Z',
      },
      view: query.view,
      query: query.q,
      orders: [],
      counts: { open: 0, paidToday: 0, allToday: 0 },
      pagination: {
        page: query.page,
        pageSize: query.limit,
        totalItems: 0,
        totalPages: 1,
      },
    }),
    listKitchenQueue: async (query) => kitchenQueueSnapshot(query),
    createOrder: async (input) => ({
      order: {
        id: orderId,
        orderNumber: 'POS-TEST',
        tableLabel: input.tableLabel,
        orderType: input.orderType,
        status: 'draft',
        subtotalCents: 0,
        discountCents: 0,
        totalCents: 0,
        paymentMode: 'single',
        note: input.note ?? null,
        hasAllergy: false,
        allergyNote: null,
        allergyAcknowledgedAt: null,
        createdBy: input.staffUserId,
        sentAt: null,
        paidAt: null,
        cancelledAt: null,
        cancelledReason: null,
        createdAt: checkedAt,
        updatedAt: checkedAt,
      },
    }),
    getOrderDetail: async () => {
      throw new Error('Not called by this test.');
    },
    addOrderItem: async () => {
      throw new Error('Not called by this test.');
    },
    updateOrderItem: async () => {
      throw new Error('Not called by this test.');
    },
    executeOrderItemCommand: async () => {
      throw new Error('Not called by this test.');
    },
    executeOrderCommand: async () => {
      throw new Error('Not called by this test.');
    },
    splitOrderEqually: async () => {
      throw new Error('Not called by this test.');
    },
    createChecksByItems: async () => {
      throw new Error('Not called by this test.');
    },
    cancelOrderSplit: async () => {
      throw new Error('Not called by this test.');
    },
    payOrder: async () => {
      throw new Error('Not called by this test.');
    },
    payCheck: async () => {
      throw new Error('Not called by this test.');
    },
    getPaymentSummary: async () => {
      throw new Error('Not called by this test.');
    },
    getReceiptView: async () => {
      throw new Error('Not called by this test.');
    },
    executeReceiptCommand: async () => {
      throw new Error('Not called by this test.');
    },
    getReceiptJobStatus: async () => {
      throw new Error('Not called by this test.');
    },
    listPrintJobs: async (query) => ({
      printJobs: [printJobSnapshot],
      summary: { pending: 1, printing: 0, printed: 0, failed: 0 },
      pagination: {
        page: query.page,
        pageSize: query.limit,
        totalItems: 1,
        totalPages: 1,
      },
    }),
    createTestPrintJob: async () => printJobSnapshot,
    executePrintJobCommand: async () => printJobSnapshot,
    getPrintSettings: async () => ({
      kitchenEnabled: true,
      counterEnabled: true,
      kitchenCopies: 1,
      counterCopies: 1,
      fontSizePreset: 'standard',
      topPaddingLines: 1,
      leftPaddingChars: 2,
      bottomPaddingLines: 3,
    }),
    updatePrintSettings: async (input) => input,
  };
}

function kitchenQueueSnapshot(query: LocalKitchenQueueQuery) {
  return {
    serviceDay: {
      start: '2026-07-27T03:00:00.000Z',
      end: '2026-07-28T03:00:00.000Z',
    },
    screen: query.screen,
    queue: query.queue,
    tickets: [],
    counts: {
      stations: { kitchen: 0, bar: 0, dessert: 0 },
      queues: { active: 0, ready: 0 },
    },
  };
}
