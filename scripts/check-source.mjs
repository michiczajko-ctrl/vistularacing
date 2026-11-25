import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'app.bundle.js',
  ...fs.readdirSync(path.join(root, 'data')).filter((file) => file.endsWith('.js')).map((file) => `data/${file}`),
  ...fs.readdirSync(path.join(root, 'js')).filter((file) => file.endsWith('.js')).map((file) => `js/${file}`),
  ...fs.readdirSync(path.join(root, 'scripts')).filter((file) => file.endsWith('.mjs')).map((file) => `scripts/${file}`)
];

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

const validation = spawnSync(process.execPath, ['scripts/validate-data.mjs'], { cwd: root, stdio: 'inherit' });
process.exit(validation.status || 0);
