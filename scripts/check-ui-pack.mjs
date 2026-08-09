import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateUiPacks } from './ui-pack-tooling.mjs';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const arguments_ = process.argv.slice(2);

if (arguments_.length > 1 || arguments_[0]?.startsWith('--')) {
  console.error('Usage: pnpm ui:pack:check [<page-slug>]');
  process.exitCode = 1;
} else {
  const result = validateUiPacks({ repositoryRoot, slug: arguments_[0] });

  for (const warning of result.warnings) {
    console.warn(
      `[warning:${warning.rule}] ${warning.path}: ${warning.detail}`,
    );
  }
  for (const error of result.errors) {
    console.error(`[error:${error.rule}] ${error.path}: ${error.detail}`);
  }

  if (result.errors.length > 0) {
    console.error(
      `UI page-pack validation failed (${result.errors.length} error(s), ${result.warnings.length} warning(s)).`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `UI page-pack validation passed (${result.checkedPackages.length} package(s), ${result.warnings.length} warning(s)).`,
    );
  }
}
