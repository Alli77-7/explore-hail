import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const entries = ['backend/src/server.js', 'frontend/node_modules/vite/bin/vite.js'];

if (!existsSync(new URL('../backend/node_modules/express', import.meta.url)) ||
    !existsSync(new URL('../frontend/node_modules/vite', import.meta.url))) {
  console.error('Dependencies are missing. Run npm run setup first.');
  process.exit(1);
}

const children = entries.map(entry => spawn(process.execPath, [fileURLToPath(new URL(`../${entry}`, import.meta.url))], {
  cwd: entry.startsWith('frontend/') ? fileURLToPath(new URL('../frontend/', import.meta.url)) : root,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' },
}));

let stopping = false;
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = code;
}

for (const child of children) {
  child.on('error', error => {
    console.error(error.message);
    shutdown(1);
  });
  child.on('exit', code => shutdown(code ?? 0));
}
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
