import esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

esbuild.build({
  absWorkingDir: root,
  entryPoints: ['webview-ui/src/main.tsx'],
  bundle: true,
  format: 'esm',
  target: ['es2022'],
  platform: 'browser',
  jsx: 'automatic',
  outfile: path.join(root, 'dist/webview/main.js'),
  sourcemap: true,
  loader: {
    '.css': 'css',
  },
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
