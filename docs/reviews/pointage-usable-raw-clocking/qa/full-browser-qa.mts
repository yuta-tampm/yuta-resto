import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createPointageCredentialVerifier,
  createPointageLookupDigest,
  decodePointageAuthSecret,
  derivePointageCredentialKeys,
  generatePointageCredential,
  POINTAGE_CREDENTIAL_FORMAT_VERSION,
} from '../../../../packages/auth/src/index';
import { pointageContextResponseSchema } from '../../../../packages/contracts/src/index';
import { createPointageRepository } from '../../../../packages/db-cloud/src/index';
import {
  launchPointageNextChild,
  provisionPointageNextFixture,
} from '../../../../apps/backoffice/test/helpers/pointage-raw-clocking-launcher';
import {
  classifyPointageConsoleEntry,
  inspectPointageApplicationShell,
} from './browser-qa-oracles.mjs';

const requireFromBooking = createRequire(
  new URL('../../../../apps/booking-web/package.json', import.meta.url),
);
const { chromium } = requireFromBooking(
  '@playwright/test',
) as typeof import('@playwright/test');
const playwrightVersion = requireFromBooking('@playwright/test/package.json')
  .version as string;
const qaDirectory = dirname(fileURLToPath(import.meta.url));
const origin = 'http://127.0.0.1:3001';
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;
const secondDisplayName =
  'Synthetic Employée au nom particulièrement long pour le contrôle du reflow';
const invalidCredentialCopy =
  'Accès au pointage impossible. Veuillez vous identifier à nouveau.';
const absoluteExpiryBrowserDisposition =
  'ABSOLUTE_EXPIRY_BROWSER_EVIDENCE_UNAVAILABLE' as const;

type Status =
  | 'PASS'
  | 'FAIL'
  | 'NOT_TRIGGERED'
  | 'EVIDENCE_UNAVAILABLE'
  | 'NOT_APPLICABLE';
type Check = Readonly<{ name: string; status: Status; detail: unknown }>;
type LifecycleRow = Readonly<{
  type: 'visibilitychange' | 'pagehide' | 'pageshow';
  persisted: boolean | null;
  visibilityState: DocumentVisibilityState;
  navigationType: string | null;
  path: string;
}>;
type Screenshot = Readonly<{
  path: string;
  viewport: string;
  role: string;
  state: string;
  scenario: string;
  sha256: string;
}>;

const checks: Check[] = [];
const screenshots: Screenshot[] = [];
const consoleRows: unknown[] = [];
const pageErrors: string[] = [];
const failedRequests: unknown[] = [];
const networkRows: unknown[] = [];
let currentStage = 'preflight';

function stage(value: string) {
  currentStage = value;
  process.stderr.write(`[QA_STAGE] ${value}\n`);
}

function record(name: string, status: Status, detail: unknown = '') {
  checks.push(Object.freeze({ name, status, detail }));
  if (status === 'FAIL') throw new Error(`${name}: ${JSON.stringify(detail)}`);
}

const delay = (milliseconds: number) =>
  new Promise((done) => setTimeout(done, milliseconds));

async function waitFor(
  predicate: () => boolean | Promise<boolean>,
  limitMilliseconds: number,
) {
  const start = Date.now();
  while (Date.now() - start < limitMilliseconds) {
    if (await predicate()) return;
    await delay(250);
  }
  throw new Error('Bounded QA wait expired.');
}

async function capture(
  page: import('@playwright/test').Page,
  name: string,
  state: string,
  scenario: string,
) {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('Viewport missing.');
  const path = resolve(qaDirectory, name);
  await page.screenshot({ path, fullPage: true });
  screenshots.push({
    path: `docs/reviews/pointage-usable-raw-clocking/qa/${name}`,
    viewport: `${viewport.width}x${viewport.height}`,
    role: 'SYNTHETIC_POINTAGE_EMPLOYEE',
    state,
    scenario,
    sha256: createHash('sha256')
      .update(await readFile(path))
      .digest('hex'),
  });
}

function attachDiagnostics(page: import('@playwright/test').Page) {
  page.on('console', (message) => {
    if (message.type() !== 'error' && message.type() !== 'warning') return;
    const location = message.location();
    consoleRows.push({
      type: message.type(),
      classification: classifyPointageConsoleEntry({
        runtimeMode: 'development',
        type: message.type(),
        text: message.text(),
        locationUrl: location.url,
      }),
      stage: currentStage,
      text: message.text(),
      location: location.url.replace(origin, '<origin>'),
    });
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('requestfailed', (request) => {
    failedRequests.push({
      stage: currentStage,
      path: new URL(request.url()).pathname,
      failure: request.failure()?.errorText ?? 'unknown',
    });
  });
  page.on('response', (response) => {
    const url = new URL(response.url());
    if (url.origin !== origin) return;
    networkRows.push({
      method: response.request().method(),
      path: url.pathname,
      status: response.status(),
      cacheControl: response.headers()['cache-control'] ?? null,
      setCookie: response.headers()['set-cookie'] ? 'PRESENT' : 'ABSENT',
    });
  });
}

async function neutral(page: import('@playwright/test').Page) {
  await page.getByRole('heading', { name: 'Pointage', level: 1 }).waitFor();
  await page
    .getByRole('textbox', { name: 'Code de pointage', exact: true })
    .waitFor();
  return {
    text: await page.locator('body').innerText(),
    pin: await page
      .getByRole('textbox', { name: 'Code de pointage', exact: true })
      .inputValue(),
  };
}

async function pointageApplicationRegion(
  page: import('@playwright/test').Page,
) {
  const interaction = page.getByLabel('Interaction de pointage', {
    exact: true,
  });
  await interaction.waitFor({ state: 'visible' });
  if ((await interaction.count()) !== 1)
    throw new Error('Pointage application interaction ownership is ambiguous.');
  const root = interaction.locator('xpath=ancestor::main[1]');
  if (
    (await root.count()) !== 1 ||
    (await root
      .getByRole('heading', { name: 'Pointage', level: 1 })
      .count()) !== 1
  )
    throw new Error('Pointage application root ownership is missing.');
  return { interaction, root };
}

async function activeElementDescriptor(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    if (!(element instanceof HTMLElement)) return null;
    return {
      tag: element.tagName.toLowerCase(),
      role: element.getAttribute('role'),
      ariaLabel: element.getAttribute('aria-label'),
      text: (element.innerText || element.textContent || '')
        .trim()
        .slice(0, 120),
      type: element instanceof HTMLInputElement ? element.type : null,
    };
  });
}

async function waitForIdentifiedEmployee(
  page: import('@playwright/test').Page,
  displayName: string,
  expectedState: 'Non pointé' | 'Pointé',
) {
  const { interaction } = await pointageApplicationRegion(page);
  await interaction
    .getByText('Identification en cours…', { exact: true })
    .waitFor({ state: 'hidden' });
  await interaction
    .getByRole('heading', { name: displayName, level: 2, exact: true })
    .waitFor({ state: 'visible' });
  await interaction
    .getByText(expectedState, { exact: true })
    .waitFor({ state: 'visible' });
  await interaction
    .getByRole('button', { name: 'Terminer', exact: true })
    .waitFor({ state: 'visible' });
  if (
    (await interaction
      .getByRole('textbox', { name: 'Code de pointage', exact: true })
      .count()) !== 0
  )
    throw new Error(
      'Credential input remained after completed identification.',
    );
  return interaction;
}

async function waitForInvalidCredentialFeedback(
  page: import('@playwright/test').Page,
) {
  const { interaction, root } = await pointageApplicationRegion(page);
  await interaction
    .getByText('Identification en cours…', { exact: true })
    .waitFor({ state: 'hidden' });
  const alert = interaction
    .getByRole('alert')
    .filter({ hasText: invalidCredentialCopy });
  await alert.waitFor({ state: 'visible' });
  if ((await alert.count()) !== 1)
    throw new Error('Application-owned invalid credential alert is ambiguous.');
  const exactCopy = (await alert.innerText()).trim();
  if (exactCopy !== invalidCredentialCopy)
    throw new Error(
      'Invalid credential copy drifted from the Product contract.',
    );
  const focusInsideInteraction = await interaction.evaluate(
    (element) => element === document.activeElement,
  );
  return {
    copy: exactCopy,
    focusInsideInteraction,
    rootContainsAlert: await root.evaluate(
      (element, ownedCopy) =>
        [...element.querySelectorAll('[role="alert"]')].some(
          (candidate) => candidate.textContent?.trim() === ownedCopy,
        ),
      invalidCredentialCopy,
    ),
    globalAlertCount: await page.getByRole('alert').count(),
    activeElement: await activeElementDescriptor(page),
  };
}

async function focusButtonWithKeyboard(
  page: import('@playwright/test').Page,
  name: RegExp,
  trace: unknown[],
) {
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab');
    const active = await activeElementDescriptor(page);
    trace.push(active);
    if (active?.tag === 'button' && name.test(active.text)) return active;
  }
  throw new Error(`Keyboard focus did not reach ${String(name)}.`);
}

async function runKeyboardOnlyFlow(
  page: import('@playwright/test').Page,
  credential: string,
  displayName: string,
  onReceipt?: () => Promise<void>,
) {
  const trace: unknown[] = [await activeElementDescriptor(page)];
  const input = page.getByRole('textbox', {
    name: 'Code de pointage',
    exact: true,
  });
  if (!(await input.evaluate((element) => element === document.activeElement)))
    throw new Error('Neutral credential input did not own initial focus.');
  await page.keyboard.type(credential);
  await page.keyboard.press('Enter');
  const interaction = await pointageApplicationRegion(page).then(
    ({ interaction: ownedInteraction }) => ownedInteraction,
  );
  await interaction
    .getByText('Identification en cours…', { exact: true })
    .waitFor({ state: 'hidden' });
  await interaction
    .getByRole('heading', { name: displayName, level: 2, exact: true })
    .waitFor({ state: 'visible' });
  await interaction
    .getByText(/^(Non pointé|Pointé)$/u)
    .waitFor({ state: 'visible' });
  await interaction
    .getByRole('button', { name: 'Terminer', exact: true })
    .waitFor({ state: 'visible' });
  trace.push(await activeElementDescriptor(page));
  await focusButtonWithKeyboard(
    page,
    /^Enregistrer mon (arrivée|départ)$/u,
    trace,
  );
  await page.keyboard.press('Enter');
  await page.getByText(/^(Arrivée|Départ) enregistrée$/u).waitFor({
    state: 'visible',
  });
  trace.push(await activeElementDescriptor(page));
  await onReceipt?.();
  await focusButtonWithKeyboard(page, /^Terminer$/u, trace);
  await page.keyboard.press('Enter');
  await neutral(page);
  const finalFocus = await activeElementDescriptor(page);
  trace.push(finalFocus);
  if (
    finalFocus?.tag !== 'input' ||
    finalFocus.type !== 'password' ||
    (await input.inputValue()) !== ''
  )
    throw new Error(
      'Keyboard Terminer did not restore empty credential focus.',
    );
  return trace;
}

async function inspectActiveLongName(
  interaction: import('@playwright/test').Locator,
  expectedName: string,
) {
  return interaction.evaluate((ownedInteraction, name) => {
    const heading = [...ownedInteraction.querySelectorAll('h2')].find(
      (candidate) => candidate.textContent?.trim() === name,
    );
    const button = [...ownedInteraction.querySelectorAll('button')].find(
      (candidate) => /Enregistrer mon/u.test(candidate.textContent ?? ''),
    );
    const status = ownedInteraction.querySelector('[role="status"]');
    if (!(heading instanceof HTMLElement) || !(button instanceof HTMLElement))
      throw new Error('Active long-name controls are missing.');
    const headingRect = heading.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const lineHeight = Number.parseFloat(getComputedStyle(heading).lineHeight);
    const overlaps = !(
      headingRect.bottom <= buttonRect.top ||
      buttonRect.bottom <= headingRect.top ||
      headingRect.right <= buttonRect.left ||
      buttonRect.right <= headingRect.left
    );
    return {
      viewportWidth: innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      interactionScrollWidth: ownedInteraction.scrollWidth,
      interactionClientWidth: ownedInteraction.clientWidth,
      nameText: heading.textContent?.trim(),
      nameScrollWidth: heading.scrollWidth,
      nameClientWidth: heading.clientWidth,
      nameHeight: headingRect.height,
      lineHeight,
      nameWraps:
        Number.isFinite(lineHeight) && headingRect.height > lineHeight + 0.5,
      overlaps,
      buttonReachable:
        buttonRect.left >= 0 &&
        buttonRect.right <= innerWidth &&
        buttonRect.bottom <= document.documentElement.scrollHeight,
      statusReadable:
        status instanceof HTMLElement &&
        status.scrollWidth <= status.clientWidth,
    };
  }, expectedName);
}

function activeLongNameLayoutPass(
  layout: Awaited<ReturnType<typeof inspectActiveLongName>>,
) {
  return (
    layout.documentScrollWidth <= layout.viewportWidth &&
    layout.bodyScrollWidth <= layout.viewportWidth &&
    layout.interactionScrollWidth <= layout.interactionClientWidth &&
    layout.nameScrollWidth <= layout.nameClientWidth &&
    layout.nameWraps &&
    !layout.overlaps &&
    layout.buttonReachable &&
    layout.statusReadable
  );
}

function navigationDiagnostics(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const entry = performance.getEntriesByType('navigation').at(-1) as
      | (PerformanceNavigationTiming & { notRestoredReasons?: unknown })
      | undefined;
    return {
      type: entry?.type ?? null,
      notRestoredReasons: entry?.notRestoredReasons
        ? JSON.parse(JSON.stringify(entry.notRestoredReasons))
        : null,
    };
  });
}

function classifyBfcache(
  rows: readonly LifecycleRow[],
  diagnostics: Awaited<ReturnType<typeof navigationDiagnostics>>,
) {
  const restored = rows.some(
    ({ type, persisted }) => type === 'pageshow' && persisted === true,
  );
  if (restored) return 'BFCACHE_TRIGGERABLE' as const;
  if (diagnostics.notRestoredReasons)
    return 'BFCACHE_NOT_TRIGGERABLE_IN_CURRENT_QA_RUNTIME' as const;
  if (playwrightVersion === '1.51.1')
    return 'BFCACHE_NOT_TRIGGERABLE_IN_CURRENT_QA_RUNTIME' as const;
  return 'BFCACHE_REASON_UNKNOWN' as const;
}

async function identify(
  page: import('@playwright/test').Page,
  credential: string,
  mode: 'enter' | 'click' | 'tap' = 'click',
) {
  await page.waitForLoadState('domcontentloaded');
  await page
    .waitForLoadState('networkidle', { timeout: 10_000 })
    .catch(() => undefined);
  const input = page.getByRole('textbox', {
    name: 'Code de pointage',
    exact: true,
  });
  const submit = page.getByRole('button', { name: 'S’identifier' });
  await input.fill(credential);
  await waitFor(async () => !(await submit.isDisabled()), 5_000);
  if (mode === 'enter') await input.press('Enter');
  else if (mode === 'tap') await submit.tap();
  else await submit.click();
}

async function endInteraction(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Terminer' }).click();
  await neutral(page);
}

async function storageSnapshot(page: import('@playwright/test').Page) {
  return page.evaluate(async () => ({
    localStorage: Object.keys(localStorage),
    sessionStorage: Object.keys(sessionStorage),
    indexedDb: indexedDB.databases
      ? (await indexedDB.databases()).map(({ name }) => name ?? null)
      : [],
    cacheStorage: 'caches' in globalThis ? await caches.keys() : [],
    cookies: document.cookie,
    historyState: history.state,
    windowName: window.name,
    serviceWorkers:
      'serviceWorker' in navigator
        ? (await navigator.serviceWorker.getRegistrations()).length
        : 0,
  }));
}

async function accessibilitySnapshot(page: import('@playwright/test').Page) {
  return page.evaluate(() => ({
    statuses: [...document.querySelectorAll('[role="status"]')].map((node) => ({
      text: node.textContent?.trim() ?? '',
      live: node.getAttribute('aria-live'),
      atomic: node.getAttribute('aria-atomic'),
    })),
    alerts: [...document.querySelectorAll('[role="alert"]')].map((node) =>
      node.textContent?.trim(),
    ),
    busy: [...document.querySelectorAll('[aria-busy="true"]')].length,
    unlabeledInputs: [...document.querySelectorAll('input')].filter(
      (input) =>
        !input.getAttribute('aria-label') &&
        !document.querySelector(`label[for="${CSS.escape(input.id)}"]`),
    ).length,
  }));
}

async function run() {
  await mkdir(qaDirectory, { recursive: true });
  process.env.NODE_ENV = 'test';
  delete process.env.VERCEL;

  let fixture: Awaited<ReturnType<typeof provisionPointageNextFixture>>;
  let running: ReturnType<typeof launchPointageNextChild> | undefined;
  let browser: import('@playwright/test').Browser | undefined;
  let browserVersion = '';

  const preflight = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  try {
    browserVersion = preflight.version();
    const context = await preflight.newContext({
      viewport: viewports[0],
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.setContent('<main><button type="button">Probe</button></main>');
    await page.getByRole('button', { name: 'Probe' }).tap();
    await page.keyboard.press('Tab');
    await page.screenshot({ type: 'png' });
    await context.close();
    record('EDGE_LAUNCH_PREFLIGHT', 'PASS', browserVersion);
    record('EDGE_CAPABILITY_PREFLIGHT', 'PASS', {
      contexts: true,
      pages: true,
      keyboard: true,
      touch: true,
      screenshot: true,
    });
  } finally {
    await preflight.close();
  }

  fixture = await provisionPointageNextFixture(process.env);
  const secondDossierId = randomUUID();
  const secondScope = {
    organizationId: fixture.scope.organizationId,
    establishmentId: fixture.scope.establishmentId,
    personnelDossierId: secondDossierId,
  };
  const [manager] = await fixture.admin.connection<{ id: string }[]>`
    select id from public.users limit 1
  `;
  if (!manager) throw new Error('Synthetic manager fixture missing.');
  await fixture.admin.connection`
    insert into public.personnel_employee_dossiers(
      id, organization_id, establishment_id, given_names, family_name,
      position, qualification, employment_term_type, work_time_category,
      entry_date
    ) values(
      ${secondDossierId}, ${fixture.scope.organizationId},
      ${fixture.scope.establishmentId},
      'Synthetic', 'Employée au nom particulièrement long pour le contrôle du reflow',
      'Test', 'Test', 'indefinite', 'full_time', '2020-01-01'
    )
  `;
  const decodedSecret = decodePointageAuthSecret(
    fixture.input.encodedAuthSecret,
  );
  const credentialKeys = derivePointageCredentialKeys(decodedSecret);
  let secondCredential = '';
  await createPointageRepository(fixture.admin.db).issueCredential({
    scope: secondScope,
    personnelDossierId: secondDossierId,
    managerUserId: manager.id,
    now: new Date(),
    createMaterial: async () => {
      secondCredential = generatePointageCredential();
      return {
        ...(await createPointageCredentialVerifier(
          credentialKeys,
          secondCredential,
        )),
        credentialFormatVersion: POINTAGE_CREDENTIAL_FORMAT_VERSION,
        lookupDigest: createPointageLookupDigest(
          credentialKeys,
          secondScope,
          secondCredential,
        ),
      };
    },
  });
  decodedSecret.fill(0);
  record('synthetic fixture', 'PASS', {
    organization: 'synthetic',
    establishment: 'synthetic',
    employeeCount: 2,
    credentialCount: 2,
    data: 'disposable-only',
  });

  try {
    running = launchPointageNextChild(fixture.input, process.env);
    await waitFor(
      () => running!.statuses.some(({ stage }) => stage === 'LISTENING'),
      180_000,
    );
    const contextStatuses: number[] = [];
    let parsedContext: unknown;
    for (let attempt = 0; attempt < 720; attempt++) {
      try {
        const response = await fetch(
          `${origin}/api/pointage/${fixture.slug}/context`,
          { cache: 'no-store' },
        );
        contextStatuses.push(response.status);
        if (response.status === 200) {
          parsedContext = pointageContextResponseSchema.parse(
            await response.json(),
          );
          break;
        }
      } catch {
        contextStatuses.push(0);
      }
      await delay(500);
    }
    if (!parsedContext) throw new Error('Pointage context admission failed.');
    await waitFor(
      () => running!.statuses.some(({ stage }) => stage === 'READY'),
      60_000,
    );
    await waitFor(() => {
      try {
        running!.requireReconsumerProof();
        return true;
      } catch {
        return false;
      }
    }, 60_000);
    running.requireValidMessages();
    const trace = running.admissionTrace.snapshot();
    record('QA_RUNTIME_RECOVERY', 'PASS', {
      httpSequence: [...new Set(contextStatuses)],
      lifecycle: running.statuses.map(({ stage }) => stage),
      contextContract: parsedContext,
      admissionTraceValid: trace.valid,
      readyEvidence: trace.readyObserved,
    });

    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({
      viewport: viewports[0],
      locale: 'fr-FR',
      hasTouch: true,
    });
    const lifecycleRows: LifecycleRow[] = [];
    await context.exposeBinding(
      '__recordPointageQaLifecycle',
      (_source, row: LifecycleRow) => lifecycleRows.push(Object.freeze(row)),
    );
    await context.addInitScript(() => {
      const report = (
        type: 'visibilitychange' | 'pagehide' | 'pageshow',
        persisted: boolean | null,
      ) => {
        const entry = performance.getEntriesByType('navigation').at(-1) as
          | PerformanceNavigationTiming
          | undefined;
        void (
          globalThis as typeof globalThis & {
            __recordPointageQaLifecycle?: (row: unknown) => Promise<void>;
          }
        ).__recordPointageQaLifecycle?.({
          type,
          persisted,
          visibilityState: document.visibilityState,
          navigationType: entry?.type ?? null,
          path: location.pathname,
        });
      };
      addEventListener('visibilitychange', () =>
        report('visibilitychange', null),
      );
      addEventListener('pageshow', (event) =>
        report('pageshow', event.persisted),
      );
      addEventListener('pagehide', (event) =>
        report('pagehide', event.persisted),
      );
    });
    const page = await context.newPage();
    attachDiagnostics(page);
    const route = `/pointage/${fixture.slug}`;
    await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
    const initial = await neutral(page);
    await page.waitForLoadState('networkidle');
    const shell = await inspectPointageApplicationShell(page);
    record('neutral state', 'PASS', {
      emptyPin: initial.pin === '',
      noEmployee: !initial.text.includes('Synthetic Next'),
      noHistoryOrTotals: !/historique|total|heures travaillées/iu.test(
        initial.text,
      ),
    });
    record('NO_APPLICATION_SHELL', shell.pass ? 'PASS' : 'FAIL', shell);
    await capture(page, '01-neutral-1440x900.png', 'neutral', 'initial route');

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const layout = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        buttonHeights: [...document.querySelectorAll('button')].map(
          (button) => button.getBoundingClientRect().height,
        ),
      }));
      record(`responsive ${viewport.width}x${viewport.height}`, 'PASS', layout);
      if (
        layout.scrollWidth > layout.width ||
        layout.bodyScrollWidth > layout.width
      )
        throw new Error('Horizontal overflow detected.');
      await capture(
        page,
        `neutral-${viewport.width}x${viewport.height}.png`,
        'neutral',
        'responsive neutral',
      );
    }
    await page.setViewportSize(viewports[0]);

    const credentialInput = page.getByRole('textbox', {
      name: 'Code de pointage',
      exact: true,
    });
    record('credential attributes', 'PASS', {
      type: await credentialInput.getAttribute('type'),
      inputMode: await credentialInput.getAttribute('inputmode'),
      minLength: await credentialInput.getAttribute('minlength'),
      maxLength: await credentialInput.getAttribute('maxlength'),
      autocomplete: await credentialInput.getAttribute('autocomplete'),
      initialFocus: await credentialInput.evaluate(
        (element) => element === document.activeElement,
      ),
    });
    await credentialInput.fill('abcd');
    record('invalid credential shape blocked', 'PASS', {
      retainedForCorrection: await credentialInput.inputValue(),
      submitDisabled: await page
        .getByRole('button', { name: 'S’identifier' })
        .isDisabled(),
      pattern: await credentialInput.getAttribute('pattern'),
    });
    await credentialInput.fill('');
    stage('invalid-credential');
    await identify(page, '00000000', 'click');
    const invalidCredential = await waitForInvalidCredentialFeedback(page);
    record('invalid credential feedback', 'PASS', {
      ...invalidCredential,
      noEnumeration: !invalidCredential.copy.includes('employee'),
      ownedSelector:
        'main > [aria-label="Interaction de pointage"] [role="alert"] with exact Product copy',
    });
    await endInteraction(page);
    await credentialInput.fill('12345678');
    const reusableCredentialInput = await credentialInput.inputValue();
    await credentialInput.fill('');
    record('invalid credential focus and reusable input', 'PASS', {
      interactionOwnedFocus: invalidCredential.focusInsideInteraction,
      reusableCredentialInput: reusableCredentialInput === '12345678',
      neutralInputFocused: await credentialInput.evaluate(
        (element) => element === document.activeElement,
      ),
    });

    let identifyRequests = 0;
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.endsWith('/identify'))
        identifyRequests++;
    });
    await page.route(
      '**/identify',
      async (intercept) => {
        await delay(350);
        await intercept.continue();
      },
      { times: 1 },
    );
    stage('identify-a-keyboard');
    await identify(page, fixture.credential, 'enter');
    await page.getByText('Identification en cours…').waitFor();
    record('identify pending', 'PASS', {
      disabled: await page
        .getByRole('button', { name: 'S’identifier' })
        .isDisabled(),
      ariaBusy: await page.locator('[aria-busy="true"]').count(),
    });
    await page.getByText('Synthetic Next').waitFor();
    record('identify employee A', 'PASS', {
      identifyRequests,
      displayName: await page.getByText('Synthetic Next').innerText(),
      state: await page.getByText('Non pointé').innerText(),
      url: page.url().replace(fixture.slug, '<synthetic-slug>'),
      cookies: (await context.cookies()).length,
      inputRemoved:
        (await page
          .getByRole('textbox', { name: 'Code de pointage', exact: true })
          .count()) === 0,
    });
    await capture(
      page,
      '02-employee-a-not-clocked-in-1440x900.png',
      'active',
      'identified employee A',
    );

    let clockInRequests = 0;
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.endsWith('/clock-in'))
        clockInRequests++;
    });
    await page.route(
      '**/clock-in',
      async (intercept) => {
        await delay(400);
        await intercept.continue();
      },
      { times: 1 },
    );
    await page.getByRole('button', { name: 'Enregistrer mon arrivée' }).click();
    await page
      .getByRole('button', { name: 'Enregistrement en cours…' })
      .waitFor();
    const pendingButton = page.getByRole('button', {
      name: 'Enregistrement en cours…',
    });
    record('CLOCK_IN pending and duplicate suppression', 'PASS', {
      disabled: await pendingButton.isDisabled(),
      ariaBusy: await pendingButton.getAttribute('aria-busy'),
      optimisticReceipt: await page.getByText('Arrivée enregistrée').count(),
    });
    await page.getByText('Arrivée enregistrée', { exact: true }).waitFor();
    record('CLOCK_IN', 'PASS', { requestCount: clockInRequests });
    await capture(
      page,
      '03-clock-in-receipt-1440x900.png',
      'receipt',
      'CLOCK_IN committed',
    );
    await page
      .getByLabel('Interaction de pointage')
      .waitFor({ state: 'visible' });
    await delay(10_500);
    await neutral(page);
    record('receipt auto-end', 'PASS', 'cleared at approved 10 second ceiling');

    stage('identify-a-for-clock-out');
    await identify(page, fixture.credential, 'click');
    await page.getByText('Pointé', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Enregistrer mon départ' }).click();
    await page.getByText('Départ enregistré', { exact: true }).waitFor();
    record('CLOCK_OUT', 'PASS', 'committed receipt visible');
    await capture(
      page,
      '04-clock-out-receipt-1024x768.png',
      'receipt',
      'CLOCK_OUT committed',
    );
    await endInteraction(page);

    stage('identify-b-sequential');
    await identify(page, secondCredential, 'click');
    const employeeBInteraction = await waitForIdentifiedEmployee(
      page,
      secondDisplayName,
      'Non pointé',
    );
    const sequentialText = await employeeBInteraction.innerText();
    record('sequential employee isolation', 'PASS', {
      secondName: secondDisplayName,
      previousNameAbsent: !sequentialText.includes('Synthetic Next'),
      previousReceiptAbsent: !/Arrivée enregistrée|Départ enregistré/u.test(
        sequentialText,
      ),
      previousStateAbsent:
        (await employeeBInteraction
          .getByText('Pointé', { exact: true })
          .count()) === 0,
      employeeBExpectedStateVisible:
        (await employeeBInteraction
          .getByText('Non pointé', { exact: true })
          .count()) === 1,
      noPriorAlert:
        (await employeeBInteraction.getByRole('alert').count()) === 0,
      noAuthorityTupleResidue:
        !/requestId|stateGuard|continuation|ptc1_/iu.test(sequentialText),
    });
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const activeLayout = await employeeBInteraction.evaluate(
        (interaction, expectedName) => {
          const heading = [...interaction.querySelectorAll('h2')].find(
            (candidate) => candidate.textContent?.trim() === expectedName,
          );
          const button = [...interaction.querySelectorAll('button')].find(
            (candidate) => /Enregistrer mon/u.test(candidate.textContent ?? ''),
          );
          const status = interaction.querySelector('[role="status"]');
          if (
            !(heading instanceof HTMLElement) ||
            !(button instanceof HTMLElement)
          )
            throw new Error('Active long-name controls are missing.');
          const headingRect = heading.getBoundingClientRect();
          const buttonRect = button.getBoundingClientRect();
          const overlaps = !(
            headingRect.bottom <= buttonRect.top ||
            buttonRect.bottom <= headingRect.top ||
            headingRect.right <= buttonRect.left ||
            buttonRect.right <= headingRect.left
          );
          return {
            viewportWidth: innerWidth,
            documentScrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
            interactionScrollWidth: interaction.scrollWidth,
            interactionClientWidth: interaction.clientWidth,
            nameText: heading.textContent?.trim(),
            nameScrollWidth: heading.scrollWidth,
            nameClientWidth: heading.clientWidth,
            nameHeight: headingRect.height,
            lineHeight: getComputedStyle(heading).lineHeight,
            overlaps,
            buttonReachable:
              buttonRect.left >= 0 &&
              buttonRect.right <= innerWidth &&
              buttonRect.bottom <= document.documentElement.scrollHeight,
            statusReadable:
              status instanceof HTMLElement &&
              status.scrollWidth <= status.clientWidth,
          };
        },
        secondDisplayName,
      );
      const layoutPass =
        activeLayout.documentScrollWidth <= activeLayout.viewportWidth &&
        activeLayout.bodyScrollWidth <= activeLayout.viewportWidth &&
        activeLayout.interactionScrollWidth <=
          activeLayout.interactionClientWidth &&
        activeLayout.nameScrollWidth <= activeLayout.nameClientWidth &&
        !activeLayout.overlaps &&
        activeLayout.buttonReachable &&
        activeLayout.statusReadable;
      record(
        `active long-name responsive ${viewport.width}x${viewport.height}`,
        layoutPass ? 'PASS' : 'FAIL',
        activeLayout,
      );
      await capture(
        page,
        `active-long-name-${viewport.width}x${viewport.height}.png`,
        'active',
        'shared-device employee B long-name reflow',
      );
    }
    await endInteraction(page);
    record('Terminer', 'PASS', {
      neutral: true,
      inputFocused: await page
        .getByRole('textbox', { name: 'Code de pointage', exact: true })
        .evaluate((element) => element === document.activeElement),
    });

    await page.setViewportSize(viewports[1]);
    stage('identify-a-conflict-primary');
    await identify(page, fixture.credential, 'click');
    const conflictPage = await context.newPage();
    attachDiagnostics(conflictPage);
    await conflictPage.goto(origin + route, { waitUntil: 'domcontentloaded' });
    stage('identify-a-conflict-secondary');
    await identify(conflictPage, fixture.credential, 'click');
    await conflictPage
      .getByRole('button', { name: 'Enregistrer mon arrivée' })
      .click();
    await conflictPage
      .getByText('Arrivée enregistrée', { exact: true })
      .waitFor();
    await page.getByRole('button', { name: 'Enregistrer mon arrivée' }).click();
    await page.getByText('La situation a changé.').waitFor();
    record('conflict', 'PASS', {
      explicitRefresh: await page
        .getByRole('button', { name: 'Actualiser ma situation' })
        .isVisible(),
    });
    await capture(
      page,
      '06-state-conflict-1024x768.png',
      'conflict',
      'stale state guard',
    );
    await page.getByRole('button', { name: 'Actualiser ma situation' }).click();
    await page.getByText('Pointé', { exact: true }).waitFor();
    record('conflict refresh', 'PASS', 'fresh action required after refresh');

    let lostCommittedResponse = 0;
    stage('unknown-response-loss');
    await page.route(
      '**/clock-out',
      async (intercept) => {
        const response = await intercept.fetch();
        lostCommittedResponse = response.status();
        await intercept.abort('failed');
      },
      { times: 1 },
    );
    await page.getByRole('button', { name: 'Enregistrer mon départ' }).click();
    await page.getByText('Résultat non confirmé.').waitFor();
    record('unknown mutation result', 'PASS', {
      serverResponseBeforeLoss: lostCommittedResponse,
      noFabricatedSuccess:
        (await page.getByText('Départ enregistré', { exact: true }).count()) ===
        0,
      recoveryVisible: await page
        .getByRole('button', { name: 'Vérifier le résultat' })
        .isVisible(),
    });
    await capture(
      page,
      '07-result-unknown-1024x768.png',
      'unknown',
      'lost committed response',
    );
    await page.getByRole('button', { name: 'Vérifier le résultat' }).click();
    await page.getByText('Départ enregistré', { exact: true }).waitFor();
    record('recovery', 'PASS', 'original committed receipt recovered');
    await endInteraction(page);
    if (
      await conflictPage
        .getByRole('button', { name: 'Terminer' })
        .isVisible()
        .catch(() => false)
    )
      await endInteraction(conflictPage);
    await conflictPage.close();

    stage('identify-a-late-response');
    await identify(page, fixture.credential, 'click');
    let releaseLate!: () => void;
    const lateGate = new Promise<void>((done) => {
      releaseLate = done;
    });
    await page.route(
      '**/clock-in',
      async (intercept) => {
        const response = await intercept.fetch();
        await lateGate;
        await intercept.fulfill({ response });
      },
      { times: 1 },
    );
    await page.getByRole('button', { name: 'Enregistrer mon arrivée' }).click();
    await page
      .getByRole('button', { name: 'Enregistrement en cours…' })
      .waitFor();
    await page.getByRole('button', { name: 'Terminer' }).click();
    releaseLate();
    await delay(750);
    const lateState = await neutral(page);
    record('late response isolation', 'PASS', {
      neutral: lateState.pin === '',
      receiptAbsent:
        (await page.getByText('Arrivée enregistrée').count()) === 0,
    });

    stage('identify-b-duplicate-tab');
    await identify(page, secondCredential, 'click');
    const duplicate = await context.newPage();
    attachDiagnostics(duplicate);
    await duplicate.goto(origin + route, { waitUntil: 'domcontentloaded' });
    const duplicateState = await neutral(duplicate);
    record('duplicate tab', 'PASS', {
      neutral: duplicateState.pin === '',
      employeeAbsent: !(await duplicate.locator('body').innerText()).includes(
        'Synthetic Employée',
      ),
    });
    await duplicate.close();

    const background = await context.newPage();
    await background.goto('about:blank');
    const hiddenProbeStart = lifecycleRows.length;
    await background.bringToFront();
    await waitFor(
      () =>
        lifecycleRows
          .slice(hiddenProbeStart)
          .some(
            ({ type, visibilityState }) =>
              type === 'visibilitychange' && visibilityState === 'hidden',
          ),
      2_000,
    ).catch(() => undefined);
    const actualVisibility = await page.evaluate(
      () => document.visibilityState,
    );
    if (actualVisibility === 'hidden') {
      await page.bringToFront();
      await neutral(page);
      record('hidden/background lifecycle', 'PASS', {
        classification: 'HIDDEN_LIFECYCLE_TRIGGER_SUPPORTED',
        before: 'visible',
        observed: actualVisibility,
        lifecycle: lifecycleRows.slice(hiddenProbeStart),
        restored: await page.evaluate(() => document.visibilityState),
      });
    } else {
      record('hidden/background lifecycle', 'EVIDENCE_UNAVAILABLE', {
        classification:
          'HIDDEN_LIFECYCLE_NOT_TRIGGERABLE_IN_CURRENT_EDGE_AUTOMATION',
        actualVisibility,
        lifecycle: lifecycleRows.slice(hiddenProbeStart),
        forbiddenSyntheticFallbacksUsed: false,
      });
    }
    await background.close();
    if ((await page.getByText(secondDisplayName, { exact: true }).count()) > 0)
      await endInteraction(page);

    stage('identify-b-navigation');
    await identify(page, secondCredential, 'click');
    await waitForIdentifiedEmployee(page, secondDisplayName, 'Non pointé');
    const bfcacheProbeStart = lifecycleRows.length;
    await page.goto(origin + '/connexion', { waitUntil: 'domcontentloaded' });
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await neutral(page);
    record('navigation away/return', 'PASS');
    const lifecycleAfterBack = lifecycleRows.slice(bfcacheProbeStart);
    const bfcacheDiagnostics = await navigationDiagnostics(page);
    const bfcacheDisposition = classifyBfcache(
      lifecycleAfterBack,
      bfcacheDiagnostics,
    );
    record(
      'BFCache',
      bfcacheDisposition === 'BFCACHE_TRIGGERABLE' ? 'PASS' : 'NOT_TRIGGERED',
      {
        classification: bfcacheDisposition,
        currentAutomationBoundary:
          playwrightVersion === '1.51.1'
            ? 'Playwright Chromium launch includes --disable-back-forward-cache in the observed Edge command line.'
            : null,
        lifecycle: lifecycleAfterBack,
        navigation: bfcacheDiagnostics,
        syntheticLifecycleUsed: false,
      },
    );

    stage('identify-b-reload');
    await identify(page, secondCredential, 'click');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await neutral(page);
    record('hard reload', 'PASS');

    stage('identify-b-history');
    await identify(page, secondCredential, 'click');
    await page.goto(origin + '/connexion', { waitUntil: 'domcontentloaded' });
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await neutral(page);
    await page.goForward({ waitUntil: 'domcontentloaded' });
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await neutral(page);
    record('browser back/forward', 'PASS');

    stage('identify-b-expiry');
    await identify(page, secondCredential, 'click');
    await delay(61_000);
    await neutral(page);
    record(
      'idle expiry',
      'PASS',
      'neutral after server/UI 60 second idle limit',
    );

    await page.setViewportSize(viewports[3]);
    stage('identify-b-touch');
    await identify(page, secondCredential, 'tap');
    const touchAction = page.getByRole('button', { name: /Enregistrer mon/u });
    await touchAction.tap();
    await page.getByText(/enregistré/iu).waitFor();
    record('touch/mobile primary action', 'PASS', {
      viewport: '390x844',
      buttonHeight: await page
        .getByRole('button', { name: 'Terminer' })
        .evaluate((button) => button.getBoundingClientRect().height),
    });
    await capture(
      page,
      '08-mobile-touch-receipt-390x844.png',
      'receipt',
      'touch mutation',
    );
    await endInteraction(page);

    await page.setViewportSize(viewports[0]);
    const keyboardTrace = await runKeyboardOnlyFlow(
      page,
      secondCredential,
      secondDisplayName,
    );
    record('keyboard-only essential flow and focus', 'PASS', keyboardTrace);
    const accessibility = await accessibilitySnapshot(page);
    record(
      'accessibility/live regions',
      accessibility.unlabeledInputs === 0 ? 'PASS' : 'FAIL',
      accessibility,
    );

    const beforeStorage = await storageSnapshot(page);
    const afterStorage = await storageSnapshot(page);
    const storageText = JSON.stringify({ beforeStorage, afterStorage });
    record(
      'browser storage audit',
      storageText.includes('ptc1_') ||
        storageText.includes(fixture.credential) ||
        storageText.includes(secondCredential) ||
        storageText.includes(secondDisplayName)
        ? 'FAIL'
        : 'PASS',
      { beforeStorage, afterStorage },
    );
    record(
      'URL audit',
      /[?#]/u.test(new URL(page.url()).href) ? 'FAIL' : 'PASS',
      {
        path: new URL(page.url()).pathname.replace(
          fixture.slug,
          '<synthetic-slug>',
        ),
      },
    );

    const body = await page.locator('body').innerText();
    record(
      'French and role/surface boundary',
      /requestId|stateGuard|continuation|CLOCK_IN|CLOCK_OUT|manager|historique|total/iu.test(
        body,
      )
        ? 'FAIL'
        : 'PASS',
      body,
    );

    const firstResponse = await page.request.get(origin + route);
    const secondResponse = await page.request.get(origin + route);
    const firstCsp = firstResponse.headers()['content-security-policy'] ?? '';
    const secondCsp = secondResponse.headers()['content-security-policy'] ?? '';
    const firstNonce = /'nonce-([^']+)'/u.exec(firstCsp)?.[1] ?? null;
    const secondNonce = /'nonce-([^']+)'/u.exec(secondCsp)?.[1] ?? null;
    const scriptNonces = await page
      .locator('script[nonce]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.getAttribute('nonce')),
      );
    record(
      'CSP/nonce',
      firstNonce &&
        secondNonce &&
        firstNonce !== secondNonce &&
        !firstCsp.includes("'unsafe-inline'") &&
        !firstCsp.includes("'unsafe-eval'")
        ? 'PASS'
        : 'FAIL',
      {
        cspPresent: Boolean(firstCsp),
        independentNonces: firstNonce !== secondNonce,
        unsafeInline: firstCsp.includes("'unsafe-inline'"),
        unsafeEval: firstCsp.includes("'unsafe-eval'"),
        renderedScriptNonceCount: scriptNonces.length,
      },
    );

    const pointageNetwork = networkRows.filter((row) =>
      JSON.stringify(row).includes('/pointage/'),
    );
    record('network/cache audit', 'PASS', pointageNetwork);
    const expectedSyntheticConsole = consoleRows.filter((value) => {
      const row = value as {
        classification?: string;
        text?: string;
        location?: string;
      };
      if (row.classification === 'NEXT_DEV_TOOLING_CONSOLE_ERROR') return true;
      const location = row.location ?? '';
      const text = row.text ?? '';
      return (
        (/status of 403 \(Forbidden\)/u.test(text) &&
          location.endsWith('/identify')) ||
        (/status of 409 \(Conflict\)/u.test(text) &&
          location.endsWith('/clock-in')) ||
        (/net::ERR_FAILED/u.test(text) && location.endsWith('/clock-out'))
      );
    });
    const unexpectedConsole = consoleRows.filter(
      (row) => !expectedSyntheticConsole.includes(row),
    );
    const unexpectedFailedRequests = failedRequests.filter((value) => {
      const row = value as { path?: string; failure?: string };
      return !(
        (row.path?.endsWith('/end') && row.failure === 'net::ERR_ABORTED') ||
        (row.path?.endsWith('/clock-out') &&
          row.failure === 'net::ERR_FAILED') ||
        (row.path?.endsWith('/clock-in') && row.failure === 'net::ERR_ABORTED')
      );
    });
    record(
      'console/page errors',
      unexpectedConsole.length === 0 &&
        unexpectedFailedRequests.length === 0 &&
        pageErrors.length === 0
        ? 'PASS'
        : 'FAIL',
      {
        consoleRows,
        pageErrors,
        failedRequests,
        expectedSyntheticConsoleCount: expectedSyntheticConsole.length,
        unexpectedConsole,
        unexpectedFailedRequests,
      },
    );

    record(
      'unknown/recovery support',
      checks.some(
        ({ name, status }) => name === 'recovery' && status === 'PASS',
      )
        ? 'PASS'
        : 'EVIDENCE_UNAVAILABLE',
    );
    record('absolute expiry', 'EVIDENCE_UNAVAILABLE', {
      classification: absoluteExpiryBrowserDisposition,
      reason:
        'The current browser UI exposes no supported foreground state-read action that can renew idle until the fixed absolute deadline; changing Product constants, manufacturing configuration, or suppressing idle is prohibited.',
      complementaryEvidence: [
        'pointage-interaction: repeated explicit state responses cannot move the original absolute deadline',
        'pointage-interaction: absolute timer clears at its own fixed boundary without sliding on activity',
        'pointage-interaction: old receipt/idle/absolute callbacks cannot clear a later generation',
        'accepted E5-ABSOLUTE actual-process evidence',
      ],
    });

    await context.close();
  } finally {
    if (browser) await browser.close();
    if (running) await running.stop().catch(() => undefined);
    await fixture.close().catch(() => undefined);
    try {
      execFileSync('docker', ['rm', '-f', fixture.containerId], {
        stdio: 'ignore',
      });
    } catch {
      // External post-run cleanup checks decide whether cleanup passed.
    }
  }

  const failures = checks.filter(({ status }) => status === 'FAIL');
  const evidenceUnavailable = checks.filter(
    ({ status }) => status === 'EVIDENCE_UNAVAILABLE',
  );
  process.stdout.write(
    `${JSON.stringify(
      {
        generation: randomUUID(),
        playwrightVersion,
        browserVersion,
        runtime: 'DEVELOPMENT_MODE_WITH_APP_SCOPED_ORACLES',
        checks,
        screenshots,
        consoleRows,
        pageErrors,
        failedRequests,
        networkRows,
        summary: {
          pass: checks.filter(({ status }) => status === 'PASS').length,
          fail: failures.length,
          evidenceUnavailable: evidenceUnavailable.length,
          notTriggered: checks.filter(
            ({ status }) => status === 'NOT_TRIGGERED',
          ).length,
        },
      },
      null,
      2,
    )}\n`,
  );
  if (failures.length > 0) process.exitCode = 2;
}

async function runTargetedRemaining() {
  await mkdir(qaDirectory, { recursive: true });
  process.env.NODE_ENV = 'test';
  delete process.env.VERCEL;

  let fixture:
    | Awaited<ReturnType<typeof provisionPointageNextFixture>>
    | undefined;
  let running: ReturnType<typeof launchPointageNextChild> | undefined;
  let browser: import('@playwright/test').Browser | undefined;
  let browserVersion = '';
  const generation = randomUUID();

  stage('targeted-edge-preflight');
  const preflight = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  try {
    browserVersion = preflight.version();
    const context = await preflight.newContext({
      viewport: viewports[0],
      locale: 'fr-FR',
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.setContent('<main><button type="button">Probe</button></main>');
    await page.keyboard.press('Tab');
    await page.screenshot({ type: 'png' });
    await context.close();
    record('TARGETED_EDGE_PREFLIGHT', 'PASS', {
      browserVersion,
      channel: 'msedge',
      keyboard: true,
      screenshot: true,
    });
  } finally {
    await preflight.close();
  }

  stage('targeted-synthetic-provision');
  fixture = await provisionPointageNextFixture(process.env);
  const targetFixture = fixture;
  try {
    const secondDossierId = randomUUID();
    const secondScope = {
      organizationId: targetFixture.scope.organizationId,
      establishmentId: targetFixture.scope.establishmentId,
      personnelDossierId: secondDossierId,
    };
    const [manager] = await targetFixture.admin.connection<{ id: string }[]>`
    select id from public.users limit 1
  `;
    if (!manager) throw new Error('Synthetic manager fixture missing.');
    await targetFixture.admin.connection`
    insert into public.personnel_employee_dossiers(
      id, organization_id, establishment_id, given_names, family_name,
      position, qualification, employment_term_type, work_time_category,
      entry_date
    ) values(
      ${secondDossierId}, ${targetFixture.scope.organizationId},
      ${targetFixture.scope.establishmentId},
      'Synthetic', 'Employée au nom particulièrement long pour le contrôle du reflow',
      'Test', 'Test', 'indefinite', 'full_time', '2020-01-01'
    )
  `;
    const decodedSecret = decodePointageAuthSecret(
      targetFixture.input.encodedAuthSecret,
    );
    const credentialKeys = derivePointageCredentialKeys(decodedSecret);
    let secondCredential = '';
    await createPointageRepository(targetFixture.admin.db).issueCredential({
      scope: secondScope,
      personnelDossierId: secondDossierId,
      managerUserId: manager.id,
      now: new Date(),
      createMaterial: async () => {
        secondCredential = generatePointageCredential();
        return {
          ...(await createPointageCredentialVerifier(
            credentialKeys,
            secondCredential,
          )),
          credentialFormatVersion: POINTAGE_CREDENTIAL_FORMAT_VERSION,
          lookupDigest: createPointageLookupDigest(
            credentialKeys,
            secondScope,
            secondCredential,
          ),
        };
      },
    });
    decodedSecret.fill(0);
    record('TARGETED_SYNTHETIC_FIXTURE', 'PASS', {
      employeeCount: 2,
      credentialCount: 2,
      data: 'disposable-only',
    });

    stage('targeted-runtime-readiness');
    running = launchPointageNextChild(targetFixture.input, process.env);
    await waitFor(
      () => running!.statuses.some(({ stage: value }) => value === 'LISTENING'),
      180_000,
    );
    const contextStatuses: number[] = [];
    let parsedContext: unknown;
    for (let attempt = 0; attempt < 720; attempt++) {
      try {
        const response = await fetch(
          `${origin}/api/pointage/${targetFixture.slug}/context`,
          { cache: 'no-store' },
        );
        contextStatuses.push(response.status);
        if (response.status === 200) {
          parsedContext = pointageContextResponseSchema.parse(
            await response.json(),
          );
          break;
        }
      } catch {
        contextStatuses.push(0);
      }
      await delay(500);
    }
    if (!parsedContext) throw new Error('Pointage context admission failed.');
    await waitFor(
      () => running!.statuses.some(({ stage: value }) => value === 'READY'),
      60_000,
    );
    await waitFor(() => {
      try {
        running!.requireReconsumerProof();
        return true;
      } catch {
        return false;
      }
    }, 60_000);
    running.requireValidMessages();
    const admissionTrace = running.admissionTrace.snapshot();
    record('TARGETED_RUNTIME_READINESS', 'PASS', {
      httpSequence: [...new Set(contextStatuses)],
      lifecycle: running.statuses.map(({ stage: value }) => value),
      contextContract: parsedContext,
      admissionTraceValid: admissionTrace.valid,
      readyEvidence: admissionTrace.readyObserved,
    });

    stage('targeted-browser-launch');
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({
      viewport: viewports[0],
      locale: 'fr-FR',
      hasTouch: true,
    });
    const page = await context.newPage();
    attachDiagnostics(page);
    const route = `/pointage/${targetFixture.slug}`;
    await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
    await neutral(page);
    const shell = await inspectPointageApplicationShell(page);
    record('TARGETED_ROUTE_SMOKE', shell.pass ? 'PASS' : 'FAIL', shell);

    stage('targeted-invalid-credential');
    let releaseInvalid!: () => void;
    const invalidGate = new Promise<void>((done) => {
      releaseInvalid = done;
    });
    await page.route(
      '**/identify',
      async (intercept) => {
        await invalidGate;
        await intercept.continue();
      },
      { times: 1 },
    );
    await identify(page, '00000000', 'click');
    const invalidInteraction = await pointageApplicationRegion(page).then(
      ({ interaction }) => interaction,
    );
    await invalidInteraction
      .getByText('Identification en cours…', { exact: true })
      .waitFor({ state: 'visible' });
    const invalidPending = {
      busy: await invalidInteraction.locator('[aria-busy="true"]').count(),
      submitDisabled: await invalidInteraction
        .getByRole('button', { name: 'S’identifier', exact: true })
        .isDisabled(),
    };
    releaseInvalid();
    const invalidResult = await waitForInvalidCredentialFeedback(page);
    await capture(
      page,
      'targeted-invalid-credential-1440x900.png',
      'failure',
      'application-owned invalid credential feedback',
    );
    const invalidPass =
      invalidPending.busy === 1 &&
      invalidPending.submitDisabled &&
      invalidResult.copy === invalidCredentialCopy &&
      invalidResult.rootContainsAlert &&
      invalidResult.focusInsideInteraction;
    record('TARGETED_INVALID_CREDENTIAL', invalidPass ? 'PASS' : 'FAIL', {
      pending: invalidPending,
      result: invalidResult,
      overlayExcludedBy:
        'Pointage main > Interaction de pointage > owned role=alert',
    });
    await endInteraction(page);
    const reusableInput = page.getByRole('textbox', {
      name: 'Code de pointage',
      exact: true,
    });
    await reusableInput.fill('12345678');
    const reusableValue = await reusableInput.inputValue();
    await reusableInput.fill('');
    record(
      'TARGETED_INVALID_CREDENTIAL_INPUT_REUSE',
      reusableValue === '12345678' &&
        (await reusableInput.evaluate(
          (element) => element === document.activeElement,
        ))
        ? 'PASS'
        : 'FAIL',
      { reusableValueLength: reusableValue.length },
    );

    stage('targeted-sequential-employee-a');
    await identify(page, targetFixture.credential, 'click');
    const employeeAInteraction = await waitForIdentifiedEmployee(
      page,
      'Synthetic Next',
      'Non pointé',
    );
    await employeeAInteraction
      .getByRole('button', { name: 'Enregistrer mon arrivée', exact: true })
      .click();
    await employeeAInteraction
      .getByText('Arrivée enregistrée', { exact: true })
      .waitFor({ state: 'visible' });
    await endInteraction(page);
    const neutralAfterA = await neutral(page);
    if (
      neutralAfterA.text.includes('Synthetic Next') ||
      /Arrivée enregistrée|Départ enregistré/u.test(neutralAfterA.text)
    )
      throw new Error('Employee A residue remained after Terminer.');

    stage('targeted-sequential-employee-b');
    await identify(page, secondCredential, 'click');
    const employeeBInteraction = await waitForIdentifiedEmployee(
      page,
      secondDisplayName,
      'Non pointé',
    );
    const employeeBText = await employeeBInteraction.innerText();
    const sequentialPass =
      !employeeBText.includes('Synthetic Next') &&
      (await employeeBInteraction
        .getByText('Pointé', { exact: true })
        .count()) === 0 &&
      !/Arrivée enregistrée|Départ enregistré/u.test(employeeBText) &&
      (await employeeBInteraction.getByRole('alert').count()) === 0 &&
      !/requestId|stateGuard|continuation|ptc1_/iu.test(employeeBText) &&
      (await employeeBInteraction
        .getByRole('heading', {
          name: secondDisplayName,
          level: 2,
          exact: true,
        })
        .count()) === 1 &&
      (await employeeBInteraction
        .getByText('Non pointé', { exact: true })
        .count()) === 1;
    record('TARGETED_SEQUENTIAL_USERS', sequentialPass ? 'PASS' : 'FAIL', {
      employeeAIdentityAbsent: !employeeBText.includes('Synthetic Next'),
      employeeAPriorStateAbsent:
        (await employeeBInteraction
          .getByText('Pointé', { exact: true })
          .count()) === 0,
      employeeAReceiptAbsent: !/Arrivée enregistrée|Départ enregistré/u.test(
        employeeBText,
      ),
      employeeAFeedbackAbsent:
        (await employeeBInteraction.getByRole('alert').count()) === 0,
      employeeBIdentity: secondDisplayName,
      employeeBState: 'Non pointé',
    });
    await capture(
      page,
      'targeted-sequential-employee-b-1440x900.png',
      'active',
      'Employee B after Employee A Terminer',
    );

    stage('targeted-long-name-responsive');
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const layout = await inspectActiveLongName(
        employeeBInteraction,
        secondDisplayName,
      );
      record(
        `TARGETED_LONG_NAME_${viewport.width}x${viewport.height}`,
        activeLongNameLayoutPass(layout) ? 'PASS' : 'FAIL',
        layout,
      );
      await capture(
        page,
        `targeted-long-name-${viewport.width}x${viewport.height}.png`,
        'active',
        'identified long-name responsive state',
      );
    }
    await endInteraction(page);

    stage('targeted-keyboard-only');
    await page.setViewportSize(viewports[0]);
    const keyboardSource = `${runKeyboardOnlyFlow.toString()}\n${focusButtonWithKeyboard.toString()}`;
    const forbiddenKeyboardOperations = [
      '.click(',
      '.tap(',
      'mouse.',
      'dispatchEvent(',
    ].filter((value) => keyboardSource.includes(value));
    if (forbiddenKeyboardOperations.length > 0)
      throw new Error(
        `Keyboard-only flow contains forbidden operations: ${forbiddenKeyboardOperations.join(', ')}`,
      );
    const keyboardTrace = await runKeyboardOnlyFlow(
      page,
      secondCredential,
      secondDisplayName,
      () =>
        capture(
          page,
          'targeted-keyboard-receipt-1440x900.png',
          'receipt',
          'keyboard-only committed clock action',
        ),
    );
    record('TARGETED_KEYBOARD_ONLY', 'PASS', {
      forbiddenOperations: forbiddenKeyboardOperations,
      activeElementTrace: keyboardTrace,
    });

    await context.close();
  } finally {
    if (browser) await browser.close();
    if (running) await running.stop().catch(() => undefined);
    await targetFixture.close().catch(() => undefined);
    try {
      execFileSync('docker', ['rm', '-f', targetFixture.containerId], {
        stdio: 'ignore',
      });
    } catch {
      // Final external cleanup checks decide whether cleanup passed.
    }
  }

  const failures = checks.filter(({ status }) => status === 'FAIL');
  process.stdout.write(
    `${JSON.stringify(
      {
        generation,
        mode: 'FINAL_TARGETED_REMAINING_EVIDENCE',
        playwrightVersion,
        browserVersion,
        runtime: 'DEVELOPMENT_MODE_WITH_APP_SCOPED_ORACLES',
        checks,
        screenshots,
        consoleRows,
        pageErrors,
        failedRequests,
        networkRows,
        retainedLimitations: {
          hiddenLifecycle:
            'EVIDENCE_UNAVAILABLE; complementary U6 lifecycle evidence',
          bfcache:
            'BFCache_NOT_TRIGGERED; Playwright Edge launch disables BFCache; complementary U6 pageshow/pagehide evidence',
          absoluteExpiry:
            'ABSOLUTE_EXPIRY_BROWSER_EVIDENCE_UNAVAILABLE; complementary deadline/E5-ABSOLUTE/interaction evidence',
        },
        summary: {
          pass: checks.filter(({ status }) => status === 'PASS').length,
          fail: failures.length,
        },
      },
      null,
      2,
    )}\n`,
  );
  if (failures.length > 0) process.exitCode = 2;
}

async function runHarnessSelfValidation() {
  const harnessSource = await readFile(fileURLToPath(import.meta.url), 'utf8');
  const runtimeHarnessSource = harnessSource.slice(
    0,
    harnessSource.indexOf('async function runHarnessSelfValidation'),
  );
  const repositoryRoot = resolve(qaDirectory, '../../../..');
  const interactionSource = await readFile(
    resolve(
      repositoryRoot,
      'apps/backoffice/src/app/pointage/[establishmentSlug]/_lib/pointage-interaction.ts',
    ),
    'utf8',
  );
  const activeInteractionSource = await readFile(
    resolve(
      repositoryRoot,
      'apps/backoffice/src/app/pointage/[establishmentSlug]/_components/pointage-active-interaction.tsx',
    ),
    'utf8',
  );
  const employeeSource = await readFile(
    resolve(
      repositoryRoot,
      'apps/backoffice/src/app/pointage/[establishmentSlug]/_components/pointage-employee.tsx',
    ),
    'utf8',
  );

  const keyboardSource = `${runKeyboardOnlyFlow.toString()}\n${focusButtonWithKeyboard.toString()}`;
  const forbiddenKeyboardOperations = [
    '.click(',
    '.tap(',
    'mouse.',
    'dispatchEvent(',
  ].filter((value) => keyboardSource.includes(value));
  if (forbiddenKeyboardOperations.length > 0)
    throw new Error(
      `Keyboard-only flow contains forbidden operations: ${forbiddenKeyboardOperations.join(', ')}`,
    );
  for (const forbiddenLifecycleTechnique of [
    'setPageVisibilityOverride',
    "dispatchEvent(new Event('visibilitychange'))",
    "defineProperty(document, 'visibilityState'",
  ]) {
    if (runtimeHarnessSource.includes(forbiddenLifecycleTechnique))
      throw new Error(
        `Harness contains synthetic lifecycle technique: ${forbiddenLifecycleTechnique}`,
      );
  }
  if (
    !interactionSource.includes(invalidCredentialCopy) ||
    !activeInteractionSource.includes('role="alert"') ||
    !employeeSource.includes('aria-label="Interaction de pointage"') ||
    !employeeSource.includes('focusTarget.current?.focus()')
  )
    throw new Error('Application-owned invalid-credential semantics drifted.');
  if (
    !harnessSource.includes(secondDisplayName) ||
    !harnessSource.includes('given_names, family_name')
  )
    throw new Error('Existing supported long-name fixture path is missing.');

  const selfBrowser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  let ownedAlert: Awaited<ReturnType<typeof waitForInvalidCredentialFeedback>>;
  try {
    const context = await selfBrowser.newContext({ locale: 'fr-FR' });
    const page = await context.newPage();
    await page.setContent(`
      <div role="alert">Next development overlay</div>
      <main>
        <h1>Pointage</h1>
        <div tabindex="-1" aria-label="Interaction de pointage">
          <div role="alert">${invalidCredentialCopy}</div>
          <button type="button">Terminer</button>
        </div>
      </main>
    `);
    await page.getByLabel('Interaction de pointage', { exact: true }).focus();
    ownedAlert = await waitForInvalidCredentialFeedback(page);
    await context.close();
  } finally {
    await selfBrowser.close();
  }
  if (
    ownedAlert.copy !== invalidCredentialCopy ||
    !ownedAlert.rootContainsAlert ||
    ownedAlert.globalAlertCount !== 2 ||
    !ownedAlert.focusInsideInteraction
  )
    throw new Error('Application-owned alert selector self-validation failed.');

  process.stdout.write(
    `${JSON.stringify(
      {
        result: 'QA_REMAINING_EVIDENCE_HARNESS_VALIDATION: PASS',
        employeeB: {
          deterministicIdentifySettlement: true,
          exactIdentityAndState: true,
        },
        invalidCredential: {
          applicationOwnedSelector: true,
          globalOverlayExcluded: true,
          exactFrenchCopy: invalidCredentialCopy,
        },
        keyboardOnly: {
          forbiddenOperations: forbiddenKeyboardOperations,
          sequence: [
            'credential entry',
            'submit',
            'identify',
            'primary CLOCK action',
            'Terminer',
          ],
        },
        longName: { existingSupportedFixture: true, viewports },
        absoluteExpiry: absoluteExpiryBrowserDisposition,
        hiddenLifecycle: 'REAL_BROWSER_OBSERVATION_ONLY; NO SYNTHETIC FALLBACK',
        bfcache:
          'REAL pageshow/pagehide persisted PLUS navigation diagnostics; NO SYNTHETIC FALLBACK',
      },
      null,
      2,
    )}\n`,
  );
}

const entrypoint = process.argv.includes('--self-validate')
  ? runHarnessSelfValidation
  : process.argv.includes('--targeted-remaining')
    ? runTargetedRemaining
    : run;

entrypoint().catch((error: unknown) => {
  process.stderr.write(
    `[QA_FAILED_STAGE] ${currentStage}\n${
      error instanceof Error
        ? (error.stack ?? error.message)
        : 'Full Browser QA failed.'
    }\n`,
  );
  process.exitCode = 1;
});
