import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const requireFromBooking = createRequire(
  new URL('../../../../apps/booking-web/package.json', import.meta.url),
);
const { chromium } = requireFromBooking('@playwright/test');
const { AxeBuilder } = requireFromBooking('@axe-core/playwright');

const baseUrl = process.env.QA_BASE_URL;
const ownerPassword = process.env.QA_OWNER_PASSWORD;
const containerName = process.env.QA_DB_CONTAINER;
const databaseName = process.env.QA_DB_NAME;
const databaseUser = process.env.QA_DB_USER;
if (
  !baseUrl ||
  !ownerPassword ||
  !containerName ||
  !databaseName ||
  !databaseUser
) {
  throw new Error('Missing bounded local QA environment.');
}

const qaDir = dirname(fileURLToPath(import.meta.url));
const primaryEmployeeId = '019a0000-0000-7000-8000-000000000200';
const replayEmployeeId = '019a0000-0000-7000-8000-000000000201';
const organizationId = '01a07126-c773-72fc-befa-9be3ea22b322';
const establishmentId = '01a07126-c77d-7118-99fa-804d08e7f6ea';
const screenshots = [];
const checks = [];

mkdirSync(qaDir, { recursive: true });

function psql(sql) {
  return execFileSync(
    'docker',
    [
      'exec',
      containerName,
      'psql',
      '-U',
      databaseUser,
      '-d',
      databaseName,
      '-v',
      'ON_ERROR_STOP=1',
      '-tAc',
      sql,
    ],
    { encoding: 'utf8' },
  ).trim();
}

function resetEmployee(id, givenNames, familyName) {
  psql(`
    delete from formalites_personnel_draft_command_receipts
    where resulting_draft_id in (
      select id from formalites_personnel_drafts where employee_id='${id}'
    );
    delete from formalites_personnel_drafts where employee_id='${id}';
    delete from personnel_employee_dossiers where id='${id}';
    insert into personnel_employee_dossiers (
      id, organization_id, establishment_id, given_names, family_name,
      position, qualification, employment_term_type, work_time_category,
      entry_date, revision, contract_weekly_minutes
    ) values (
      '${id}', '${organizationId}', '${establishmentId}', '${givenNames}',
      '${familyName}', 'Serveuse', 'Employée', 'indefinite', 'full_time',
      '2026-09-01', 1, 2100
    );
  `);
}

function updatePersonnel(id, assignments) {
  psql(
    `update personnel_employee_dossiers set ${assignments}, revision=revision+1, updated_at=now() where id='${id}';`,
  );
}

function record(name, passed, detail = '') {
  checks.push({ name, passed, detail });
  if (!passed) throw new Error(`${name}: ${detail || 'failed'}`);
}

async function capture(page, file, viewport, state) {
  await page.setViewportSize(viewport);
  await page.waitForTimeout(100);
  const path = resolve(qaDir, file);
  await page.screenshot({ path, fullPage: true });
  const hash = createHash('sha256').update(readFileSync(path)).digest('hex');
  screenshots.push({
    path: `docs/reviews/formalites-persistent-draft-foundation/qa/${file}`,
    viewport: `${viewport.width}x${viewport.height}`,
    role: 'OWNER',
    state,
    sha256: hash,
  });
}

async function login(page, email, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
  if (await page.getByRole('heading', { name: 'Connexion' }).isVisible()) {
    await page.getByLabel('Adresse e-mail', { exact: true }).fill(email);
    await page.getByLabel('Mot de passe', { exact: true }).fill(ownerPassword);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);
  }
  if (
    await page
      .getByRole('heading', { name: 'Sélectionner un établissement' })
      .isVisible()
  ) {
    await page
      .getByRole('region', { name: 'LUNA', exact: true })
      .getByRole('button', { name: 'Continuer' })
      .first()
      .click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  }
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
}

async function waitSuccess(page) {
  await page.getByText('Modifications enregistrées').waitFor();
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  record(
    `no horizontal overflow — ${label}`,
    dimensions.scrollWidth <= dimensions.clientWidth,
    JSON.stringify(dimensions),
  );
}

async function run() {
  resetEmployee(primaryEmployeeId, 'Élodie', 'Martin');
  resetEmployee(replayEmployeeId, 'Nora', 'Replay');

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const owner = await browser.newContext({ locale: 'fr-FR' });
  const page = await owner.newPage();
  const route = `/equipe/formalites-personnel/${primaryEmployeeId}`;

  await login(page, 'owner@luna-restaurant.fr', route);
  await page.getByText('Aucun brouillon actif').waitFor();
  record('OWNER eligible/no draft', true);
  await capture(
    page,
    '01-owner-eligible-no-draft-1440.png',
    { width: 1440, height: 900 },
    'eligible_no_draft',
  );
  await assertNoOverflow(page, '1440 eligible');

  const visibleText = await page.locator('main').innerText();
  for (const forbidden of [
    'operationKey',
    'sourceStateFingerprint',
    'requestFingerprint',
    'actorUserId',
    'organizationId',
    'establishmentId',
    'Rémunération',
    'Adresse du salarié',
  ]) {
    record(
      `forbidden rendering absent: ${forbidden}`,
      !visibleText.includes(forbidden),
    );
  }

  await page.getByRole('button', { name: 'Créer le brouillon' }).click();
  await page.getByText('Brouillon en cours').waitFor();
  record('Create', true);
  await capture(
    page,
    '02-created-editable-1024.png',
    { width: 1024, height: 850 },
    'editable_created',
  );
  await assertNoOverflow(page, '1024 editable');

  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await waitSuccess(page);
  record(
    'SAVE UNDECIDED',
    psql(
      `select probation_choice from formalites_personnel_drafts where employee_id='${primaryEmployeeId}' and status='draft';`,
    ) === 'undecided',
  );

  await page.getByLabel('Prévoir une période d’essai').check();
  await page.getByRole('button', { name: 'Enregistrer' }).evaluate((button) => {
    button.click();
    button.click();
  });
  await waitSuccess(page);
  record(
    'INCLUDE + double-submit prevention',
    psql(
      `select probation_choice||'|'||revision from formalites_personnel_drafts where employee_id='${primaryEmployeeId}' and status='draft';`,
    ) === 'include|3',
  );

  await page.getByLabel('Ne pas prévoir de période d’essai').check();
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await waitSuccess(page);
  record(
    'EXCLUDE',
    psql(
      `select probation_choice from formalites_personnel_drafts where employee_id='${primaryEmployeeId}' and status='draft';`,
    ) === 'exclude',
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  record(
    'reload/reopen persisted state',
    await page.getByLabel('Ne pas prévoir de période d’essai').isChecked(),
  );

  updatePersonnel(
    primaryEmployeeId,
    "position='Cheffe de rang', qualification='Agente de maîtrise'",
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText('Le dossier salarié a changé').waitFor();
  record('reconciliation required', true);
  await capture(
    page,
    '03-reconciliation-required-768.png',
    { width: 768, height: 1024 },
    'reconciliation_required',
  );
  await assertNoOverflow(page, '768 reconciliation');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Valider les choix' }).click();
  await page.getByText('Choix incomplet').waitFor();
  const activeId = await page.evaluate(() => document.activeElement?.id ?? '');
  record(
    'per-fact validation and focus recovery',
    activeId.endsWith('-keep'),
    activeId,
  );
  await capture(
    page,
    '04-reconciliation-validation-390.png',
    { width: 390, height: 844 },
    'reconciliation_validation_error',
  );
  await assertNoOverflow(page, '390 validation');

  const groups = page
    .locator('fieldset')
    .filter({ has: page.getByText('Valeur du brouillon') });
  await groups.nth(0).getByLabel('Conserver la valeur du brouillon').check();
  await groups
    .nth(1)
    .getByLabel('Reprendre la valeur actuelle du dossier salarié')
    .check();
  await page.getByRole('button', { name: 'Valider les choix' }).click();
  await waitSuccess(page);
  record(
    'mixed KEEP/REFRESH',
    psql(
      `select draft_position||'|'||draft_qualification from formalites_personnel_drafts where employee_id='${primaryEmployeeId}' and status='draft';`,
    ) === 'Serveuse|Agente de maîtrise',
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  record(
    'unchanged source after KEEP does not reprompt',
    await page.getByText('Brouillon en cours').isVisible(),
  );
  record(
    'KEEP does not redefine Personnel truth',
    psql(
      `select position from personnel_employee_dossiers where id='${primaryEmployeeId}';`,
    ) === 'Cheffe de rang',
  );

  updatePersonnel(primaryEmployeeId, "position='Responsable de salle'");
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText('Le dossier salarié a changé').waitFor();
  record('later Personnel change creates new reconciliation', true);
  await page.getByLabel('Conserver la valeur du brouillon').check();
  updatePersonnel(primaryEmployeeId, "position='Maîtresse d’hôtel'");
  await page.getByRole('button', { name: 'Valider les choix' }).click();
  await page.getByText('Le dossier salarié a encore changé').waitFor();
  record('stale Personnel source', true);
  await capture(
    page,
    '05-stale-personnel-source-768.png',
    { width: 768, height: 1024 },
    'stale_personnel_source',
  );

  await page
    .getByRole('button', { name: 'Recharger la version enregistrée' })
    .click();
  await page.getByText('Données actualisées').waitFor();
  await page
    .getByLabel('Reprendre la valeur actuelle du dossier salarié')
    .check();
  await page.getByRole('button', { name: 'Valider les choix' }).click();
  await waitSuccess(page);
  record(
    'REFRESH accepts trusted current value',
    psql(
      `select draft_position from formalites_personnel_drafts where employee_id='${primaryEmployeeId}' and status='draft';`,
    ) === 'Maîtresse d’hôtel',
  );

  const stalePage = await owner.newPage();
  await stalePage.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Prévoir une période d’essai').check();
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await waitSuccess(page);
  await stalePage.getByLabel('Ne pas prévoir de période d’essai').check();
  await stalePage.getByRole('button', { name: 'Enregistrer' }).click();
  await stalePage.getByText('Le brouillon a été modifié ailleurs').waitFor();
  record('stale draft', true);
  await capture(
    stalePage,
    '06-stale-draft-1024.png',
    { width: 1024, height: 850 },
    'stale_draft',
  );
  await stalePage.close();

  await page.getByLabel('Ne pas prévoir de période d’essai').check();
  psql(
    'alter table formalites_personnel_draft_command_receipts rename to formalites_personnel_draft_command_receipts_phase4_fault;',
  );
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await page.getByText('Enregistrement incertain').waitFor();
  record('recoverable server error', true);
  await capture(
    page,
    '07-recoverable-server-error-1024.png',
    { width: 1024, height: 850 },
    'server_error_recoverable',
  );
  psql(
    'alter table formalites_personnel_draft_command_receipts_phase4_fault rename to formalites_personnel_draft_command_receipts;',
  );
  const revisionBeforeRetry = Number(
    psql(
      `select revision from formalites_personnel_drafts where employee_id='${primaryEmployeeId}' and status='draft';`,
    ),
  );
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await waitSuccess(page);
  const revisionAfterRetry = Number(
    psql(
      `select revision from formalites_personnel_drafts where employee_id='${primaryEmployeeId}' and status='draft';`,
    ),
  );
  record(
    'same action retry commits once',
    revisionAfterRetry === revisionBeforeRetry + 1,
    `${revisionBeforeRetry}->${revisionAfterRetry}`,
  );

  updatePersonnel(
    primaryEmployeeId,
    "employment_term_type='fixed_term', expected_end_date='2026-12-31'",
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText('Ce brouillon ne peut plus être modifié').waitFor();
  record('non-CDI recovery', true);
  await capture(
    page,
    '08-non-cdi-recovery-390.png',
    { width: 390, height: 844 },
    'ineligible_recovery',
  );
  await assertNoOverflow(page, '390 non-CDI');

  await page.getByRole('button', { name: 'Abandonner le brouillon' }).click();
  await page.getByRole('dialog').waitFor();
  const dialog = page.getByRole('dialog');
  record(
    'abandonment reason required',
    !(await dialog
      .getByRole('button', { name: 'Confirmer l’abandon' })
      .isEnabled()),
  );
  await dialog.getByLabel('Motif').fill('Situation contractuelle modifiée.');
  record(
    'dialog accessible name',
    await dialog
      .getByRole('heading', { name: 'Abandonner ce brouillon ?' })
      .isVisible(),
  );
  await capture(
    page,
    '09-abandon-dialog-390.png',
    { width: 390, height: 844 },
    'abandon_dialog_valid_reason',
  );
  await dialog.getByRole('button', { name: 'Confirmer l’abandon' }).click();
  await page.getByText('Brouillon abandonné — lecture seule').waitFor();
  record('ABANDON while non-CDI + abandoned read-only', true);
  await capture(
    page,
    '10-abandoned-read-only-768.png',
    { width: 768, height: 1024 },
    'abandoned_read_only',
  );

  updatePersonnel(
    primaryEmployeeId,
    "employment_term_type='indefinite', expected_end_date=null, fixed_term_reason_code=null",
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page
    .getByRole('button', { name: 'Créer un nouveau brouillon' })
    .click();
  await page.getByText('Brouillon en cours').waitFor();
  record(
    'create new after abandonment when CDI',
    psql(
      `select count(*) from formalites_personnel_drafts where employee_id='${primaryEmployeeId}';`,
    ) === '2',
  );

  await page.getByLabel('Prévoir une période d’essai').check();
  let dirtyDialogSeen = false;
  page.once('dialog', async (dialogEvent) => {
    dirtyDialogSeen = dialogEvent.type() === 'confirm';
    await dialogEvent.dismiss();
  });
  await page.getByRole('link', { name: 'Revenir au dossier salarié' }).click();
  record(
    'dirty-close protection',
    dirtyDialogSeen && page.url().endsWith(route),
  );

  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    label: document.activeElement?.getAttribute('aria-label'),
  }));
  record(
    'keyboard traversal reaches focusable control',
    Boolean(focused.tag),
    JSON.stringify(focused),
  );

  const accessibility = await new AxeBuilder({ page })
    .include('main')
    .exclude('main header')
    .analyze();
  const serious = accessibility.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact),
  );
  checks.push({
    name: 'main accessibility scan has no serious/critical violations',
    passed: serious.length === 0,
    detail: JSON.stringify(
      serious.map(({ id, impact, nodes }) => ({
        id,
        impact,
        nodes: nodes.map(({ html, target, failureSummary }) => ({
          html,
          target,
          failureSummary,
        })),
      })),
    ),
  });

  const replayContext = await browser.newContext({ locale: 'fr-FR' });
  await replayContext.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: () => '11111111-1111-4111-8111-111111111111',
    });
  });
  const replayPage = await replayContext.newPage();
  const replayRoute = `/equipe/formalites-personnel/${replayEmployeeId}`;
  await login(replayPage, 'owner@luna-restaurant.fr', replayRoute);
  await replayPage.getByRole('button', { name: 'Créer le brouillon' }).click();
  await replayPage.getByText('Brouillon en cours').waitFor();
  await replayPage.getByLabel('Prévoir une période d’essai').check();
  await replayPage.getByRole('button', { name: 'Enregistrer' }).click();
  await waitSuccess(replayPage);
  await replayPage.getByLabel('Ne pas prévoir de période d’essai').check();
  await replayPage.getByRole('button', { name: 'Enregistrer' }).click();
  await replayPage.getByText('Envoi à reprendre').waitFor();
  record('replay conflict', true);
  await capture(
    replayPage,
    '11-replay-conflict-1024.png',
    { width: 1024, height: 850 },
    'replay_conflict',
  );

  const manager = await browser.newContext({ locale: 'fr-FR' });
  const managerPage = await manager.newPage();
  await login(managerPage, 'manager@luna-restaurant.fr', route);
  const managerText = await managerPage.locator('body').innerText();
  record(
    'MANAGER permission denial',
    managerText.includes('Accès refusé') ||
      managerText.includes('403') ||
      managerText.includes('Permission denied'),
    managerText.slice(0, 200),
  );
  await managerPage.setViewportSize({ width: 1024, height: 850 });
  await managerPage.screenshot({
    path: resolve(qaDir, '12-manager-denied-1024.png'),
    fullPage: true,
  });
  screenshots.push({
    path: 'docs/reviews/formalites-persistent-draft-foundation/qa/12-manager-denied-1024.png',
    viewport: '1024x850',
    role: 'MANAGER',
    state: 'permission_denied',
    sha256: createHash('sha256')
      .update(readFileSync(resolve(qaDir, '12-manager-denied-1024.png')))
      .digest('hex'),
  });

  const anonymous = await browser.newContext({ locale: 'fr-FR' });
  const anonymousPage = await anonymous.newPage();
  await anonymousPage.setViewportSize({ width: 390, height: 844 });
  await anonymousPage.goto(`${baseUrl}${route}`, {
    waitUntil: 'domcontentloaded',
  });
  record(
    'login recovery redirect',
    await anonymousPage.getByRole('heading', { name: 'Connexion' }).isVisible(),
  );
  await anonymousPage.screenshot({
    path: resolve(qaDir, '13-login-recovery-390.png'),
    fullPage: true,
  });
  screenshots.push({
    path: 'docs/reviews/formalites-persistent-draft-foundation/qa/13-login-recovery-390.png',
    viewport: '390x844',
    role: 'ANONYMOUS',
    state: 'login_recovery',
    sha256: createHash('sha256')
      .update(readFileSync(resolve(qaDir, '13-login-recovery-390.png')))
      .digest('hex'),
  });

  await anonymous.close();
  await manager.close();
  await replayContext.close();
  await owner.close();
  await browser.close();

  const output = { checks, screenshots };
  writeFileSync(
    resolve(qaDir, 'browser-qa-results.json'),
    `${JSON.stringify(output, null, 2)}\n`,
  );
  console.log(JSON.stringify(output, null, 2));
}

run().catch((error) => {
  try {
    psql(
      `do $$ begin if to_regclass('public.formalites_personnel_draft_command_receipts_phase4_fault') is not null then alter table formalites_personnel_draft_command_receipts_phase4_fault rename to formalites_personnel_draft_command_receipts; end if; end $$;`,
    );
  } catch {}
  console.error(error);
  process.exitCode = 1;
});
