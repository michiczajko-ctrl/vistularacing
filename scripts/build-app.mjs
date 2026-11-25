import path from 'node:path';
import { build } from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');

await build({
  absWorkingDir: root,
  entryPoints: ['./js/app.js'],
  outfile: './app.bundle.js',
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  minify: true,
  legalComments: 'none',
  sourcemap: false
});

console.log('OK: app.bundle.js zbudowany dla HTTP i file://.');
