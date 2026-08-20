import { basename, resolve } from 'node:path';

const packageRoot =
  basename(process.cwd()) === 'yuta-pos'
    ? process.cwd()
    : resolve(process.cwd(), 'apps/yuta-pos');

const config = {
  plugins: {
    '@tailwindcss/postcss': {
      base: resolve(packageRoot, 'src'),
    },
  },
};
export default config;
