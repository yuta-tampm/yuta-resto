// QA-only oracle helpers. This file does not define Product behavior and does
// not launch a runtime, database, browser, or full Browser QA generation.

const POINTAGE_HEADING = 'Pointage';
const POINTAGE_INTERACTION_LABEL = 'Interaction de pointage';

function normalizeText(value) {
  return value.replace(/\s+/gu, ' ').trim();
}

/**
 * Inspect NO_APPLICATION_SHELL using only application-owned light DOM.
 * Native document queries intentionally do not pierce framework/tooling shadow
 * roots. Shadow matches are collected separately only as provenance evidence.
 */
export async function inspectPointageApplicationShell(page) {
  return page.evaluate(
    ({ headingText, interactionLabel }) => {
      const visible = (element) => {
        const style = getComputedStyle(element);
        const rectangle = element.getBoundingClientRect();
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          rectangle.width > 0 &&
          rectangle.height > 0
        );
      };

      const descriptor = (element, applicationRoot) => {
        const rootNode = element.getRootNode();
        const shadowHost =
          rootNode instanceof ShadowRoot ? rootNode.host : undefined;
        const ancestors = [];
        let current = element;
        while (current && ancestors.length < 10) {
          const id = current.id ? `#${current.id}` : '';
          const classes =
            typeof current.className === 'string' && current.className.trim()
              ? `.${current.className.trim().split(/\s+/u).join('.')}`
              : '';
          ancestors.push(`${current.tagName.toLowerCase()}${id}${classes}`);
          const currentRoot = current.getRootNode();
          current = current.parentElement;
          if (!current && currentRoot instanceof ShadowRoot)
            current = currentRoot.host;
        }
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          className:
            typeof element.className === 'string'
              ? element.className || null
              : null,
          visible: visible(element),
          ancestorChain: ancestors,
          shadowHost: shadowHost
            ? {
                tag: shadowHost.tagName.toLowerCase(),
                id: shadowHost.id || null,
                className:
                  typeof shadowHost.className === 'string'
                    ? shadowHost.className || null
                    : null,
              }
            : null,
          nearestApplicationRoot:
            applicationRoot &&
            (element === applicationRoot || applicationRoot.contains(element))
              ? 'pointage-main'
              : null,
          dataAttributes: Object.fromEntries(
            [...element.attributes]
              .filter((attribute) => attribute.name.startsWith('data-'))
              .map((attribute) => [attribute.name, attribute.value]),
          ),
        };
      };

      const interactions = [
        ...document.querySelectorAll(
          `[aria-label="${CSS.escape(interactionLabel)}"]`,
        ),
      ];
      const applicationRoot =
        interactions.length === 1 ? interactions[0].closest('main') : null;
      const headings = applicationRoot
        ? [...applicationRoot.querySelectorAll('h1')].filter(
            (heading) =>
              (heading.textContent ?? '').replace(/\s+/gu, ' ').trim() ===
              headingText,
          )
        : [];

      const rootEstablished =
        applicationRoot !== null &&
        interactions.length === 1 &&
        headings.length === 1;
      const matches = [];
      const seen = new Set();
      const add = (reason, element) => {
        const key = `${reason}:${element.tagName}:${element.id}:${element.className}`;
        if (seen.has(key)) return;
        seen.add(key);
        matches.push({ reason, ...descriptor(element, applicationRoot) });
      };

      if (applicationRoot) {
        for (const element of applicationRoot.querySelectorAll(
          'header, nav, aside, footer',
        ))
          add('shell-landmark-inside-pointage-root', element);

        const wrappingMain = applicationRoot.parentElement?.closest('main');
        if (wrappingMain)
          add('pointage-root-wrapped-by-another-main', wrappingMain);
      }

      // The Pointage route owns the entire light-DOM page surface. Global
      // landmarks outside its root are therefore application chrome, while
      // framework shadow DOM is outside this positive ownership boundary.
      for (const element of document.querySelectorAll(
        'body header, body nav, body aside, body footer',
      )) {
        if (!applicationRoot || !applicationRoot.contains(element))
          add('application-landmark-outside-pointage-root', element);
      }

      for (const element of document.querySelectorAll(
        '[aria-label="Ouvrir le menu"], [aria-label="Notifications"], [aria-label="Fermer le menu"]',
      ))
        add('known-backoffice-shell-control', element);

      const shadowTooling = [];
      const visitShadowRoots = (node) => {
        for (const element of node.querySelectorAll('*')) {
          if (!element.shadowRoot) continue;
          for (const candidate of element.shadowRoot.querySelectorAll(
            'header, nav, aside, footer',
          ))
            shadowTooling.push(descriptor(candidate, applicationRoot));
          visitShadowRoots(element.shadowRoot);
        }
      };
      visitShadowRoots(document);

      return {
        rootEstablished,
        applicationRoot: applicationRoot
          ? descriptor(applicationRoot, applicationRoot)
          : null,
        interactionCount: interactions.length,
        headingCount: headings.length,
        shellMatches: matches,
        shadowTooling,
        pass: rootEstablished && matches.length === 0,
      };
    },
    {
      headingText: POINTAGE_HEADING,
      interactionLabel: POINTAGE_INTERACTION_LABEL,
    },
  );
}

export async function assertNoPointageApplicationShell(page) {
  const result = await inspectPointageApplicationShell(page);
  if (!result.pass)
    throw new Error(`NO_APPLICATION_SHELL failed: ${JSON.stringify(result)}`);
  return result;
}

/**
 * A development-only React/Next eval/CSP diagnostic is classified narrowly.
 * All other console errors, every pageerror, and every functional CSP failure
 * remain application QA failure candidates.
 */
export function classifyPointageConsoleEntry({
  runtimeMode,
  type,
  text,
  locationUrl = '',
}) {
  const exactReactDevelopmentDiagnostic =
    runtimeMode === 'development' &&
    type === 'error' &&
    text.includes('eval() is not supported in this environment.') &&
    text.includes('React requires eval() in development mode') &&
    text.includes('React will never use eval() in production mode');
  const developmentReactChunk =
    runtimeMode === 'development' &&
    type === 'error' &&
    /\/_next\/static\/chunks\//u.test(locationUrl) &&
    /react(?:-dom)?(?:-client)?\.development|react-dom-client/u.test(
      `${locationUrl} ${text}`,
    );
  const evalCspDiagnostic =
    /(?:unsafe-eval|Refused to evaluate|EvalError)/u.test(text) &&
    /(?:Content Security Policy|script-src|evaluate)/u.test(text);
  return exactReactDevelopmentDiagnostic ||
    (developmentReactChunk && evalCspDiagnostic)
    ? 'NEXT_DEV_TOOLING_CONSOLE_ERROR'
    : 'APPLICATION_CONSOLE_ERROR';
}

/**
 * Bounded harness-only browser proof. It uses a source-shaped neutral Pointage
 * root, a framework shadow portal, and two deliberate application-shell
 * compositions. It does not contact the Product route or mutate attendance.
 */
export async function validatePointageShellOracleHarness(chromium) {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await page.setContent(`<!doctype html><html lang="fr"><body>
      <main><div><h1>Pointage</h1><div tabindex="-1" aria-label="Interaction de pointage"><form><label for="pin">Code de pointage</label><input id="pin" type="password"></form></div></div></main>
      <nextjs-portal id="next-development-tooling"></nextjs-portal>
    </body></html>`);
    await page.evaluate(() => {
      const portal = document.querySelector('nextjs-portal');
      const shadow = portal.attachShadow({ mode: 'open' });
      shadow.innerHTML =
        '<nav class="error-overlay-pagination"><button>Tooling</button></nav>';
    });
    const neutral = await assertNoPointageApplicationShell(page);
    if (
      neutral.shadowTooling.length !== 1 ||
      neutral.shadowTooling[0].shadowHost?.tag !== 'nextjs-portal'
    )
      throw new Error('Framework shadow provenance was not established.');

    await page.evaluate(() => {
      const applicationShell = document.createElement('aside');
      applicationShell.setAttribute('aria-label', 'Application shell probe');
      document.body.prepend(applicationShell);
    });
    const applicationShell = await inspectPointageApplicationShell(page);
    if (
      applicationShell.pass ||
      !applicationShell.shellMatches.some(
        (match) => match.tag === 'aside' && match.shadowHost === null,
      )
    )
      throw new Error('Application-owned shell probe was not detected.');

    await page.evaluate(() => {
      document.querySelector('aside')?.remove();
      const pointage = document.querySelector('main');
      const wrapper = document.createElement('main');
      const parent = pointage.parentElement;
      parent.insertBefore(wrapper, pointage);
      wrapper.append(pointage);
    });
    const wrapped = await inspectPointageApplicationShell(page);
    if (
      wrapped.pass ||
      !wrapped.shellMatches.some(
        (match) => match.reason === 'pointage-root-wrapped-by-another-main',
      )
    )
      throw new Error('Backoffice main-wrapper probe was not detected.');

    return {
      browser: 'Microsoft Edge stable via Playwright channel msedge',
      pointageRootIdentified: neutral.rootEstablished,
      neutralPass: neutral.pass,
      frameworkShadowNavExcluded: neutral.shadowTooling.length === 1,
      applicationShellDetected: !applicationShell.pass,
      wrappingMainDetected: !wrapped.pass,
      provenanceDiagnostic: applicationShell.shellMatches[0],
    };
  } finally {
    await browser.close();
  }
}
