import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer as createSocketServer } from 'node:net';
const app = fileURLToPath(new URL('../../', import.meta.url));
const root = resolve(app, '../..');
const require = createRequire(resolve(app, 'package.json'));
const nextRequire = createRequire(require.resolve('next/package.json'));
const { chromium, expect } = nextRequire('@playwright/test');
const { createViteServer } = await import(
  pathToFileURL(require.resolve('vitest/node')).href
);
const fixture = resolve(app, 'test/browser');
const output = resolve(
  root,
  'exports/backoffice-clean-code-20261003/browser-' +
    (process.argv[2] ?? 'cdi'),
);
mkdirSync(output, { recursive: true });
const port = await new Promise((accept, reject) => {
  const socket = createSocketServer();
  socket.on('error', reject);
  socket.listen(0, '127.0.0.1', () => {
    const address = socket.address();
    if (!address || typeof address !== 'object')
      return reject(Error('Missing loopback port'));
    socket.close(() => accept(address.port));
  });
});
const server = await createViteServer({
  configFile: false,
  envDir: false,
  root: app,
  logLevel: 'warn',
  define: { 'process.env': '{}' },
  resolve: {
    alias: [
      { find: /^@\//, replacement: app.replaceAll('\\', '/') + '/src/' },
      {
        find: /^next\/navigation$/,
        replacement: resolve(fixture, 'next-navigation.ts'),
      },
    ],
  },
  plugins: [
    {
      name: 'synthetic-history-actions',
      enforce: 'pre',
      resolveId(source, importer) {
        if (
          source === '../actions' &&
          importer
            ?.replaceAll('\\', '/')
            .match(
              /\/(?:salaries\/_components\/use-employee-history\.ts|registre-personnel\/_components\/personnel-register-(?:page|dialog)\.tsx)$/,
            )
        )
          return resolve(fixture, 'personnel-interactions.tsx');
      },
    },
  ],
  server: { host: '127.0.0.1', port, strictPort: true, fs: { allow: [root] } },
  css: { postcss: { plugins: [] } },
  oxc: { jsx: { runtime: 'automatic' } },
});
let browser;
const results = [];
try {
  await server.listen();
  const address = server.httpServer.address();
  if (typeof address !== 'object' || !address)
    throw Error('Missing fixture port');
  const base = `http://127.0.0.1:${address.port}/test/browser/index.html`;
  browser = await chromium.launch({
    channel: process.env.YUTA_TEST_BROWSER_CHANNEL ?? 'chrome',
    headless: true,
  });
  async function test(
    name,
    run,
    viewport = { width: 1440, height: 1000 },
    surface = 'cdi',
  ) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      await page.goto(base + '?surface=' + surface, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      await page.waitForFunction(() => Boolean(window.personnelTest));
      await run(page);
      expect(errors).toEqual([]);
      results.push({ name, status: 'PASS', viewport });
    } catch (error) {
      results.push({
        name,
        status: 'FAIL',
        error: error.message,
        pageErrors: errors,
      });
      await page
        .screenshot({
          path: resolve(output, name.replace(/[^a-z0-9]+/gi, '-') + '.png'),
        })
        .catch(() => {});
    } finally {
      await context.close();
    }
    console.log(JSON.stringify(results.at(-1)));
  }
  if (process.argv[2] !== 'history') {
    for (const failure of ['server_error', 'reject', 'stale_draft']) {
      await test(
        `abandon ${failure}: visible recovery and reload focus`,
        async (page) => {
          await page
            .getByRole('button', {
              name: 'Abandonner le brouillon',
              exact: true,
            })
            .click();
          await page.getByLabel('Motif').fill('Synthetic cancellation reason');
          await page
            .getByRole('button', { name: 'Confirmer l’abandon', exact: true })
            .click();
          await expect
            .poll(() => page.evaluate(() => window.personnelTest.calls.length))
            .toBe(1);
          await page.evaluate(
            (kind) => window.personnelTest.settle(kind),
            failure,
          );
          const message =
            failure === 'stale_draft'
              ? 'Le brouillon a été modifié ailleurs'
              : 'Enregistrement incertain';
          await expect(page.getByText(message, { exact: true })).toBeVisible();
          await expect
            .poll(() =>
              page.evaluate(() =>
                document.activeElement?.textContent?.includes('Recharger'),
              ),
            )
            .toBe(true);
          await page
            .getByRole('button', {
              name: 'Recharger la version enregistrée',
              exact: true,
            })
            .click();
          await expect(
            page.getByText('Données actualisées', { exact: true }),
          ).toBeVisible();
          await expect
            .poll(() =>
              page.evaluate(() =>
                document.activeElement?.textContent?.includes(
                  'Données actualisées',
                ),
              ),
            )
            .toBe(true);
        },
        { width: failure === 'reject' ? 390 : 1440, height: 1000 },
      );
    }
    await test('same employee refresh preserves pending and uncertain save intent', async (page) => {
      await page
        .getByRole('radio', {
          name: 'Prévoir une période d’essai',
          exact: true,
        })
        .check();
      await page
        .getByRole('button', { name: 'Enregistrer', exact: true })
        .click();
      await expect
        .poll(() => page.evaluate(() => window.personnelTest.calls.length))
        .toBe(1);
      await page.evaluate(() => window.personnelTest.refresh(40, 'exclude'));
      await expect(
        page.getByRole('button', { name: 'Enregistrer', exact: true }),
      ).toBeDisabled();
      await expect(
        page.getByRole('radio', {
          name: 'Prévoir une période d’essai',
          exact: true,
        }),
      ).toBeChecked();
      await page
        .getByRole('button', { name: 'Enregistrer', exact: true })
        .dispatchEvent('click');
      expect(await page.evaluate(() => window.personnelTest.calls.length)).toBe(
        1,
      );
      await page.evaluate(() => window.personnelTest.settle('reject'));
      await expect(
        page.getByText('Enregistrement incertain', { exact: true }),
      ).toBeVisible();
      await page.evaluate(() => window.personnelTest.refresh(41, 'exclude'));
      await page
        .getByRole('button', { name: 'Enregistrer', exact: true })
        .click();
      await expect
        .poll(() => page.evaluate(() => window.personnelTest.calls.length))
        .toBe(2);
      const calls = await page.evaluate(() => window.personnelTest.calls);
      expect(calls[1].input).toEqual(calls[0].input);
      await page.evaluate(() => window.personnelTest.settle('success'));
      await expect(
        page.getByText('Modifications enregistrées', { exact: true }),
      ).toBeVisible();
    });
    await test('permission denial ends pending without uncertain retry guidance', async (page) => {
      await page
        .getByRole('button', { name: 'Enregistrer', exact: true })
        .click();
      await expect
        .poll(() => page.evaluate(() => window.personnelTest.calls.length))
        .toBe(1);
      await page.evaluate(() => window.personnelTest.settle('forbidden'));
      await expect(
        page.getByRole('button', { name: 'Enregistrer', exact: true }),
      ).toBeDisabled();
      await expect(
        page.getByText('Enregistrement incertain', { exact: true }),
      ).toHaveCount(0);
      await expect(
        page.getByRole('button', {
          name: 'Recharger la version enregistrée',
          exact: true,
        }),
      ).toHaveCount(0);
      await expect
        .poll(() =>
          page.evaluate(() => {
            const text =
              document.activeElement?.textContent?.toLowerCase() ?? '';
            return (
              document.activeElement !== document.body &&
              (text.includes('accès') || text.includes('autorisé'))
            );
          }),
        )
        .toBe(true);
    });
    await test('uncertain retry denied: no unsupported persistence claim', async (page) => {
      await page
        .getByRole('button', { name: 'Enregistrer', exact: true })
        .click();
      await expect
        .poll(() => page.evaluate(() => window.personnelTest.calls.length))
        .toBe(1);
      await page.evaluate(() => window.personnelTest.settle('reject'));
      await expect(
        page.getByText('Enregistrement incertain', { exact: true }),
      ).toBeVisible();
      await page
        .getByRole('button', { name: 'Enregistrer', exact: true })
        .click();
      await expect
        .poll(() => page.evaluate(() => window.personnelTest.calls.length))
        .toBe(2);
      const calls = await page.evaluate(() => window.personnelTest.calls);
      expect(calls[1].input).toEqual(calls[0].input);
      await page.evaluate(() => window.personnelTest.settle('forbidden'));
      await expect(
        page.getByText(
          'Votre accès actuel ne permet pas de modifier ce brouillon.',
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        page.getByText('Aucune modification n’a été enregistrée.', {
          exact: true,
        }),
      ).toHaveCount(0);
      await expect(
        page.getByRole('button', { name: 'Enregistrer', exact: true }),
      ).toBeDisabled();
      await expect(
        page.getByRole('button', {
          name: 'Recharger la version enregistrée',
          exact: true,
        }),
      ).toHaveCount(0);
    });
    await test('employee switch ignores obsolete mutation completion', async (page) => {
      await page
        .getByRole('button', { name: 'Enregistrer', exact: true })
        .click();
      await expect
        .poll(() => page.evaluate(() => window.personnelTest.calls.length))
        .toBe(1);
      await page.evaluate(() => window.personnelTest.switchEmployee());
      await expect(
        page.getByText('Employee Two', { exact: true }),
      ).toBeVisible();
      await page.evaluate(() => window.personnelTest.settle('success'));
      await expect(
        page.getByText('Modifications enregistrées', { exact: true }),
      ).toHaveCount(0);
      await expect(
        page.getByRole('radio', {
          name: 'Ne pas prévoir de période d’essai',
          exact: true,
        }),
      ).toBeChecked();
    });
  }
  if (process.argv[2] !== 'cdi') {
    await test(
      'employee access identity: fresh key and first page, old completion ignored',
      async (page) => {
        await page.getByRole('button', { name: 'Access', exact: true }).click();
        await expect
          .poll(() =>
            page.evaluate(() => window.personnelHistoryTest.calls.length),
          )
          .toBe(1);
        await page.evaluate(() => window.personnelHistoryTest.settle(0));
        await expect(page.getByTestId('access-state')).toContainText(
          'OLD EMPLOYEE',
        );
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await expect
          .poll(() =>
            page.evaluate(() => window.personnelHistoryTest.calls.length),
          )
          .toBe(2);
        const oldCall = await page.evaluate(
          () => window.personnelHistoryTest.calls[1],
        );
        expect(oldCall.cursor).toBe('cursor-old');
        await page.evaluate(() => window.personnelHistoryTest.switchEmployee());
        await expect
          .poll(() =>
            page.evaluate(() => window.personnelHistoryTest.calls.length),
          )
          .toBe(3);
        const newCall = await page.evaluate(
          () => window.personnelHistoryTest.calls[2],
        );
        expect(newCall.employeeId).not.toBe(oldCall.employeeId);
        expect(newCall.operationId).not.toBe(oldCall.operationId);
        expect(newCall.cursor).toBeUndefined();
        await expect(page.getByTestId('access-page')).toHaveText('0');
        await page.evaluate(() => window.personnelHistoryTest.settle(1));
        await expect(page.getByTestId('access-state')).not.toContainText(
          'OLD EMPLOYEE',
        );
        await page.evaluate(() => window.personnelHistoryTest.settle(2));
        await expect(page.getByTestId('access-state')).toContainText(
          'NEW EMPLOYEE',
        );
        const oldDataFrames = await page.evaluate(() =>
          window.personnelHistoryTest.renders.filter(
            (frame) =>
              frame.employeeId.endsWith('40b') &&
              frame.access.includes('OLD EMPLOYEE'),
          ),
        );
        expect(oldDataFrames).toEqual([]);
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await expect
          .poll(() =>
            page.evaluate(() => window.personnelHistoryTest.calls.length),
          )
          .toBe(4);
        expect(
          await page.evaluate(
            () => window.personnelHistoryTest.calls[3].cursor,
          ),
        ).toBe('cursor-new');
        await page.evaluate(() => window.personnelHistoryTest.settle(3));
        await page
          .getByRole('button', { name: 'Previous', exact: true })
          .click();
        await expect
          .poll(() =>
            page.evaluate(() => window.personnelHistoryTest.calls.length),
          )
          .toBe(5);
        expect(
          await page.evaluate(
            () => window.personnelHistoryTest.calls[4].cursor,
          ),
        ).toBeUndefined();
        await expect(page.getByTestId('access-page')).toHaveText('0');
        await page.evaluate(() => window.personnelHistoryTest.settle(4));
      },
      undefined,
      'history',
    );
    await test(
      'unified history identity: new operation and ignored old pending completion',
      async (page) => {
        await page
          .getByRole('button', { name: 'History', exact: true })
          .click();
        await expect
          .poll(() =>
            page.evaluate(() => window.personnelHistoryTest.calls.length),
          )
          .toBe(1);
        await page.evaluate(() => window.personnelHistoryTest.switchEmployee());
        await expect
          .poll(() =>
            page.evaluate(() => window.personnelHistoryTest.calls.length),
          )
          .toBe(2);
        const calls = await page.evaluate(
          () => window.personnelHistoryTest.calls,
        );
        expect(calls[1].operationId).not.toBe(calls[0].operationId);
        expect(calls[1].employeeId).not.toBe(calls[0].employeeId);
        await page.evaluate(() => window.personnelHistoryTest.settle(0));
        await expect(page.getByTestId('history-state')).not.toContainText(
          '"truncated":true',
        );
        await page.evaluate(() => window.personnelHistoryTest.settle(1));
        await expect(page.getByTestId('history-state')).toContainText(
          '"truncated":false',
        );
      },
      undefined,
      'history',
    );
    for (const outcome of ['error', 'reject']) {
      await test(
        `access ${outcome} ends loading and retries with a fresh key`,
        async (page) => {
          await page
            .getByRole('button', { name: 'Access', exact: true })
            .click();
          await expect
            .poll(() =>
              page.evaluate(() => window.personnelHistoryTest.calls.length),
            )
            .toBe(1);
          await page.evaluate(
            (outcome) => window.personnelHistoryTest.settle(0, outcome),
            outcome,
          );
          await expect(page.getByTestId('access-state')).toContainText(
            '"status":"error"',
          );
          await page
            .getByRole('button', { name: 'Retry Access', exact: true })
            .click();
          await expect
            .poll(() =>
              page.evaluate(() => window.personnelHistoryTest.calls.length),
            )
            .toBe(2);
          const calls = await page.evaluate(
            () => window.personnelHistoryTest.calls,
          );
          expect(calls[1].operationId).not.toBe(calls[0].operationId);
          expect(calls[1].cursor).toBeUndefined();
          await page.evaluate(() => window.personnelHistoryTest.settle(1));
          await expect(page.getByTestId('access-state')).toContainText(
            '"status":"success"',
          );
        },
        { width: outcome === 'reject' ? 390 : 1440, height: 1000 },
        'history',
      );
    }
  }
  if (process.argv[2] !== 'history') {
    await test('CDI dirty navigation cancellation and beforeunload lifecycle', async (page) => {
      const cancelledBeforeUnload = () =>
        page.evaluate(() => {
          const event = new Event('beforeunload', { cancelable: true });
          window.dispatchEvent(event);
          return event.defaultPrevented;
        });
      await expect.poll(cancelledBeforeUnload).toBe(false);
      await page
        .getByRole('radio', {
          name: 'Prévoir une période d’essai',
          exact: true,
        })
        .check();
      await expect.poll(cancelledBeforeUnload).toBe(true);
      const previousUrl = page.url();
      const dialogSeen = page.waitForEvent('dialog');
      page.once('dialog', (dialog) => dialog.dismiss());
      await page
        .getByRole('link', { name: 'Revenir au dossier salarié', exact: true })
        .click();
      const dialog = await dialogSeen;
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain(
        'modifications ne sont pas enregistrées',
      );
      expect(page.url()).toBe(previousUrl);
      await expect(
        page.getByRole('radio', {
          name: 'Prévoir une période d’essai',
          exact: true,
        }),
      ).toBeChecked();
      await page.getByRole('radio', { name: 'À décider', exact: true }).check();
      await expect.poll(cancelledBeforeUnload).toBe(false);
      expect(await page.evaluate(() => window.personnelTest.calls)).toEqual([]);
    });
    await test('CDI abandon cancellation retains reason then clears on accepted close', async (page) => {
      const open = () =>
        page
          .getByRole('button', { name: 'Abandonner le brouillon', exact: true })
          .click();
      await open();
      const reason = page.getByLabel('Motif');
      await expect(reason).toBeFocused();
      await expect(reason).toHaveAttribute('maxlength', '250');
      await expect(reason).toHaveAttribute('required', '');
      await reason.fill('Synthetic preserved reason');
      let prompt = page.waitForEvent('dialog');
      page.once('dialog', (dialog) => dialog.dismiss());
      await page.getByRole('button', { name: 'Annuler', exact: true }).click();
      expect((await prompt).message()).toContain('motif saisi');
      await expect(reason).toHaveValue('Synthetic preserved reason');
      await expect(page.getByRole('dialog')).toBeVisible();
      expect(await page.evaluate(() => window.personnelTest.calls)).toEqual([]);
      prompt = page.waitForEvent('dialog');
      page.once('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'Annuler', exact: true }).click();
      await prompt;
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await open();
      await expect(page.getByLabel('Motif')).toHaveValue('');
      await expect(page.getByLabel('Motif')).toBeFocused();
    });
    await test('CDI incomplete reconciliation focuses the first missing choice', async (page) => {
      await page.evaluate(() => window.personnelTest.reconcileSource());
      await page
        .getByRole('button', { name: 'Valider les choix', exact: true })
        .click();
      await expect(
        page.getByText('Choix incomplet', { exact: true }),
      ).toBeVisible();
      await expect(page.locator('#reconcile-position-keep')).toBeFocused();
      expect(await page.evaluate(() => window.personnelTest.calls)).toEqual([]);
    });
    await test(
      'Register page correction forwards trusted business date to dialog and submitted command',
      async (page) => {
        await page
          .getByRole('button', { name: 'Corriger', exact: true })
          .click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(
          page.getByLabel('Date d’effet', { exact: true }),
        ).toHaveValue('2031-01-02');
        await page
          .getByLabel('Raison', { exact: true })
          .fill('Synthetic correction reason');
        await page
          .getByRole('button', {
            name: 'Enregistrer la correction',
            exact: true,
          })
          .click();
        await expect
          .poll(() =>
            page.evaluate(
              () => window.personnelRegisterTest.submissions.length,
            ),
          )
          .toBe(1);
        const command = await page.evaluate(
          () => window.personnelRegisterTest.submissions[0],
        );
        expect(command.effectiveDate).toBe('2031-01-02');
        expect(command.expectedRevision).toBe('2');
        expect(command.operationId).toMatch(/^[0-9a-f-]{36}$/);
        await expect(
          page.getByText('Synthetic action received', { exact: true }),
        ).toBeVisible();
      },
      undefined,
      'register',
    );
  }
} finally {
  await browser?.close();
  await server.close();
  writeFileSync(
    resolve(output, 'results.json'),
    JSON.stringify(
      {
        executor:
          'Codex; real React DOM in headless Chrome, synthetic action ports, no DB/provider/session',
        results,
      },
      null,
      2,
    ),
  );
}
if (results.some((result) => result.status !== 'PASS')) process.exitCode = 1;
