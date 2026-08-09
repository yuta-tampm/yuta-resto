import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createUiPack, parseCreateArguments } from './ui-pack-tooling.mjs';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

try {
  const options = parseCreateArguments(process.argv.slice(2));
  const result = createUiPack({ repositoryRoot, ...options });

  console.log(`Created ${result.canonicalApp} UI package at:`);
  console.log(result.destination);
  console.log('\nCreated tree:');
  for (const entry of result.tree) console.log(`- ${entry}`);
  console.log('\nNext step: run the read-only Phase 0 repository analysis.');
  console.log(
    'Review docs/ui/pages/README.md when the package becomes current; it is not edited automatically.',
  );
} catch (error) {
  console.error(`UI page-pack generation failed: ${error.message}`);
  process.exitCode = 1;
}
